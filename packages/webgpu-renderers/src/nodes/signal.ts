/// <reference types="webgpu" />
import type { RenderContextValue } from "../render-context.js";
import { signalRegistry } from "../signals/signal-registry.js";
import type { SignalNodeProps } from "./types.js";

export const STATIC_SIGNAL_PREVIEW_SHADER = `
struct SignalUniforms {
	amplitude        : f32,
	offset           : f32,
	previewMode      : f32,
	time             : f32,
	width            : f32,
	height           : f32,
	amplitudeMin     : f32,
	amplitudeMax     : f32,
};

@group(0) @binding(0) var<uniform> u : SignalUniforms;
@group(1) @binding(0) var signalTex  : texture_2d<f32>;
@group(1) @binding(1) var sigSamp    : sampler;

struct VSOut {
	@builtin(position) pos : vec4<f32>,
	@location(0) uv        : vec2<f32>,
};

@vertex fn vs(@builtin(vertex_index) vi: u32) -> VSOut {
	var pos = array<vec2<f32>, 4>(
		vec2<f32>(-1.0, 1.0),
		vec2<f32>(1.0, 1.0),
		vec2<f32>(-1.0, -1.0),
		vec2<f32>(1.0, -1.0)
	);
	var uv = array<vec2<f32>, 4>(
		vec2<f32>(0.0, 0.0),
		vec2<f32>(1.0, 0.0),
		vec2<f32>(0.0, 1.0),
		vec2<f32>(1.0, 1.0)
	);
	return VSOut(vec4<f32>(pos[vi], 0.0, 1.0), uv[vi]);
}

@fragment fn fs(in : VSOut) -> @location(0) vec4<f32> {
	// Prevent compiler optimization/stripping of uniforms by reading all variables
	let dummy_use = u.previewMode + u.width + u.height;
	let col_offset = vec3<f32>(dummy_use * 1e-10);

	// Dark background
	var col = vec3<f32>(0.07, 0.07, 0.08) + col_offset;

	let range = u.amplitudeMax - u.amplitudeMin;
	let zero_norm = clamp(select(-u.amplitudeMin / range, 0.5, range == 0.0), 0.0, 1.0);
	let y_zero = 0.5 - (zero_norm - 0.5) * 0.76;

	// Grid Lines
	let grid_scroll = u.time * 0.1;
	let uv10 = vec2<f32>(in.uv.x - grid_scroll, in.uv.y) * 10.0;
	let fw10 = fwidth(uv10);
	let gf   = abs(fract(uv10 - 0.5) - 0.5) / fw10;
	let fine = 1.0 - clamp(min(gf.x, gf.y), 0.0, 1.0);
	col = mix(col, vec3<f32>(0.12, 0.12, 0.14), fine * 0.4);

	let uv5 = vec2<f32>(in.uv.x - grid_scroll, in.uv.y) * 5.0;
	let fw5 = fwidth(uv5);
	let gc  = abs(fract(uv5 - 0.5) - 0.5) / fw5;
	let coarse = 1.0 - clamp(min(gc.x, gc.y), 0.0, 1.0);
	col = mix(col, vec3<f32>(0.16, 0.16, 0.19), coarse * 0.5);

	// Zero axis
	let axis_d  = abs(in.uv.y - y_zero);
	let axis_fw = fwidth(in.uv.y);
	let axis_px = 1.0 - smoothstep(0.0, axis_fw * 1.5, axis_d);
	// Dimmer zero axis in the future (x > 0.5)
	let axis_strength = select(0.3, 0.65, in.uv.x <= 0.5);
	col = mix(col, vec3<f32>(0.24, 0.24, 0.28), axis_px * axis_strength);

	// Sample the signal value from the registry's evaluated texture
	let signal_val = textureSampleLevel(signalTex, sigSamp, vec2<f32>(in.uv.x, 0.5), 0.0).r;

	// Normalize the mapped signal value back to [0, 1] using min/max bounds
	let norm_val = select((signal_val - u.amplitudeMin) / range, 0.5, range == 0.0);

	// Scale and offset waveform plot to fit viewport
	let y_plot = 0.5 - (norm_val - 0.5) * 0.76;
	let dist   = abs(in.uv.y - y_plot);

	// Semi-transparent fill under the curve (more prominent in the past, very faint in the future)
	let fill_lo    = min(y_plot, y_zero);
	let fill_hi    = max(y_plot, y_zero);
	let in_fill    = step(fill_lo, in.uv.y) * step(in.uv.y, fill_hi);
	let fill_alpha = select(0.04, 0.12, in.uv.x <= 0.5);
	col = mix(col, vec3<f32>(0.0, 0.72, 1.0), in_fill * fill_alpha);

	// Crisp Curve Line
	let core_fw = fwidth(in.uv.y);
	let core    = 1.0 - smoothstep(0.5 * core_fw, 2.0 * core_fw, dist);
	let curve_color = mix(vec3<f32>(0.3, 0.5, 0.6), vec3<f32>(0.0, 0.72, 1.0), select(0.5, 1.0, in.uv.x <= 0.5));
	col = mix(col, curve_color, core * 0.95);

	// Playhead line at center (uv.x = 0.5)
	let playhead_d = abs(in.uv.x - 0.5);
	let playhead_fw = fwidth(in.uv.x);
	
	// Soft glow around playhead
	let glow = exp(-30.0 * playhead_d);
	col = mix(col, vec3<f32>(1.0, 0.3, 0.2), glow * 0.15);
	
	// Sharp playhead line
	let playhead_line = 1.0 - smoothstep(0.0, playhead_fw * 1.5, playhead_d);
	col = mix(col, vec3<f32>(1.0, 0.35, 0.25), playhead_line * 0.9);

	return vec4<f32>(clamp(col, vec3<f32>(0.0), vec3<f32>(1.0)), 1.0);
}
`;

const devicePipelineCache = new WeakMap<
	GPUDevice,
	Map<string, GPURenderPipeline>
>();
const uniformData = new Float32Array(8); // padded to 32 bytes

function getDevicePipelines(device: GPUDevice): Map<string, GPURenderPipeline> {
	let cache = devicePipelineCache.get(device);
	if (!cache) {
		cache = new Map();
		devicePipelineCache.set(device, cache);
	}
	return cache;
}

export async function drawSignalNode(
	ctx: RenderContextValue,
	encoder: GPUCommandEncoder,
	pass: GPURenderPassEncoder,
	props: SignalNodeProps,
): Promise<void> {
	const config = props.signalConfig;
	if (!config) return;

	const nodeId = props.nodeId ?? config.nodeId ?? "preview";
	const frame = props.frame ?? 0;
	const fps = props.fps ?? 24;
	const width = props.width ?? 512;
	const height = props.height ?? 512;

	const elapsedMs =
		props.elapsedMs !== undefined ? props.elapsedMs : (frame / fps) * 1000;
	const durationMs = props.durationMs !== undefined ? props.durationMs : 0;
	const elapsedTimeSec = elapsedMs / 1000;
	const durationSec = durationMs / 1000;

	// Resolve the 2D evaluated signal texture view from registry
	const signalView = signalRegistry.getOrCreate2DTextureView(
		ctx.device,
		encoder,
		nodeId,
		elapsedTimeSec,
		durationSec,
		config,
		width,
		height,
		props.renderId,
		frame,
		fps,
	);

	const pipelines = getDevicePipelines(ctx.device);
	const cacheKey = `preview_${ctx.renderer.format}`;
	let pipeline = pipelines.get(cacheKey);

	if (!pipeline) {
		const shaderModule = ctx.device.createShaderModule({
			label: `signal_preview_static.wgsl`,
			code: STATIC_SIGNAL_PREVIEW_SHADER,
		});

		pipeline = ctx.device.createRenderPipeline({
			label: `SignalPreviewPipeline_static`,
			layout: "auto",
			vertex: {
				module: shaderModule,
				entryPoint: "vs",
			},
			fragment: {
				module: shaderModule,
				entryPoint: "fs",
				targets: [{ format: ctx.renderer.format }],
			},
			primitive: { topology: "triangle-strip" },
		});

		pipelines.set(cacheKey, pipeline);
	}

	const previewModeInt = 0;

	const minVal =
		config?.amplitudeMin !== undefined
			? config.amplitudeMin
			: (props.offset ?? 0) - (props.amplitude ?? 1);
	const maxVal =
		config?.amplitudeMax !== undefined
			? config.amplitudeMax
			: (props.offset ?? 0) + (props.amplitude ?? 1);

	uniformData[0] = props.amplitude ?? 1.0;
	uniformData[1] = props.offset ?? 0.0;
	uniformData[2] = previewModeInt;
	uniformData[3] = elapsedTimeSec;
	uniformData[4] = width;
	uniformData[5] = height;
	uniformData[6] = minVal;
	uniformData[7] = maxVal;

	const uBuffer = ctx.renderer.getTemporaryBuffer(uniformData);
	const sampler = ctx.renderer.samplerCache.getSampler(ctx.device);

	const bindGroup0 = ctx.device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{
				binding: 0,
				resource: { buffer: uBuffer },
			},
		],
	});

	const bindGroup1 = ctx.device.createBindGroup({
		layout: pipeline.getBindGroupLayout(1),
		entries: [
			{
				binding: 0,
				resource: signalView,
			},
			{
				binding: 1,
				resource: sampler,
			},
		],
	});

	pass.setPipeline(pipeline);
	pass.setBindGroup(0, bindGroup0);
	pass.setBindGroup(1, bindGroup1);
	pass.draw(4);
}
