import "./dist-Dsv4ud6r.mjs";
import { O as signalRegistry, S as lutStore } from "./dist-rOgtcmwL.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-apply-lut/dist/renderer.mjs
const LUT_3D_SHADER = `
struct LutUniforms {
	intensity      : f32,
	lutSize        : f32,
	hasSignal      : f32,
	pad            : f32,
};

@group(0) @binding(0) var<uniform> u : LutUniforms;
@group(1) @binding(0) var tex        : texture_2d<f32>;
@group(1) @binding(1) var samp       : sampler;
@group(2) @binding(0) var lutTex     : texture_3d<f32>;
@group(2) @binding(1) var lutSamp    : sampler;
@group(3) @binding(0) var signalTex  : texture_2d<f32>;
@group(3) @binding(1) var signalSamp : sampler;

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
	let inputColor = textureSampleLevel(tex, samp, in.uv, 0.0);
	
	// Coordinate adjustment to sample from texel centers
	let uvw = inputColor.rgb * ((u.lutSize - 1.0) / u.lutSize) + vec3<f32>(0.5 / u.lutSize);
	let mappedColor = textureSampleLevel(lutTex, lutSamp, uvw, 0.0);
	
	var activeIntensity = u.intensity;
	if (u.hasSignal > 0.5) {
		activeIntensity = textureSampleLevel(signalTex, signalSamp, in.uv, 0.0).r;
	}
	
	let finalRgb = inputColor.rgb + activeIntensity  * (mappedColor.rgb - inputColor.rgb);
	return vec4<f32>(finalRgb * inputColor.a, inputColor.a);
}
`;
const LUT_1D_SHADER = `
struct LutUniforms {
	intensity      : f32,
	lutSize        : f32,
	hasSignal      : f32,
	pad            : f32,
};

@group(0) @binding(0) var<uniform> u : LutUniforms;
@group(1) @binding(0) var tex        : texture_2d<f32>;
@group(1) @binding(1) var samp       : sampler;
@group(2) @binding(0) var lutTex     : texture_1d<f32>;
@group(2) @binding(1) var lutSamp    : sampler;
@group(3) @binding(0) var signalTex  : texture_2d<f32>;
@group(3) @binding(1) var signalSamp : sampler;

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
	let inputColor = textureSampleLevel(tex, samp, in.uv, 0.0);
	
	let rCoord = inputColor.r * ((u.lutSize - 1.0) / u.lutSize) + (0.5 / u.lutSize);
	let gCoord = inputColor.g * ((u.lutSize - 1.0) / u.lutSize) + (0.5 / u.lutSize);
	let bCoord = inputColor.b * ((u.lutSize - 1.0) / u.lutSize) + (0.5 / u.lutSize);
	
	let mappedR = textureSampleLevel(lutTex, lutSamp, rCoord, 0.0).r;
	let mappedG = textureSampleLevel(lutTex, lutSamp, gCoord, 0.0).g;
	let mappedB = textureSampleLevel(lutTex, lutSamp, bCoord, 0.0).b;
	
	var activeIntensity = u.intensity;
	if (u.hasSignal > 0.5) {
		activeIntensity = textureSampleLevel(signalTex, signalSamp, in.uv, 0.0).r;
	}
	
	let finalRgb = inputColor.rgb + activeIntensity  * (vec3<f32>(mappedR, mappedG, mappedB) - inputColor.rgb);
	return vec4<f32>(finalRgb * inputColor.a, inputColor.a);
}
`;
const deviceResourceCache = /* @__PURE__ */ new WeakMap();
const lutUniformData = new Float32Array(4);
function getDeviceLayouts(device) {
	let res = deviceResourceCache.get(device);
	if (res) return res;
	res = {
		lutUniformLayout: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			buffer: { type: "uniform" }
		}] }),
		singleTextureLayout: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] }),
		lutTextureLayout3D: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: {
				viewDimension: "3d",
				sampleType: "float"
			}
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] }),
		lutTextureLayout1D: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: {
				viewDimension: "1d",
				sampleType: "float"
			}
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] }),
		signalTextureLayout: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] }),
		pipelineCache: /* @__PURE__ */ new Map()
	};
	deviceResourceCache.set(device, res);
	return res;
}
function getLutResources(device, format, type) {
	const layouts = getDeviceLayouts(device);
	const cacheKey = `lut_${type}_${format}`;
	let pipeline = layouts.pipelineCache.get(cacheKey);
	if (!pipeline) {
		const shaderCode = type === "3D" ? LUT_3D_SHADER : LUT_1D_SHADER;
		const lutModule = device.createShaderModule({
			label: `lut_${type.toLowerCase()}_${format}.wgsl`,
			code: shaderCode
		});
		const currentLutLayout = type === "3D" ? layouts.lutTextureLayout3D : layouts.lutTextureLayout1D;
		pipeline = device.createRenderPipeline({
			label: `LutPipeline_${type}_${format}`,
			layout: device.createPipelineLayout({ bindGroupLayouts: [
				layouts.lutUniformLayout,
				layouts.singleTextureLayout,
				currentLutLayout,
				layouts.signalTextureLayout
			] }),
			vertex: {
				module: lutModule,
				entryPoint: "vs"
			},
			fragment: {
				module: lutModule,
				entryPoint: "fs",
				targets: [{ format }]
			},
			primitive: { topology: "triangle-strip" }
		});
		layouts.pipelineCache.set(cacheKey, pipeline);
	}
	return {
		lutPipeline: pipeline,
		lutUniformLayout: layouts.lutUniformLayout,
		singleTextureLayout: layouts.singleTextureLayout,
		lutTextureLayout: type === "3D" ? layouts.lutTextureLayout3D : layouts.lutTextureLayout1D,
		signalTextureLayout: layouts.signalTextureLayout
	};
}
const LutWebGPURenderer = async (args) => {
	const { ctx, encoder, pass, targetView, targetTexture, targetWidth, targetHeight, props, drawChild } = args;
	const frame = props.frame ?? 0;
	const fps = props.fps || 30;
	const op = props.virtualMedia?.operation;
	if (op?.op !== "ApplyLUT" || !op) return;
	const childMedia = props.virtualMedia.children?.[0];
	if (!childMedia) return;
	const lutUrl = op.lutUrl;
	if (!lutUrl) return;
	pass.end();
	const width = targetWidth;
	const height = targetHeight;
	const intensityInput = op.intensityHandleId ? op.inputs?.[op.intensityHandleId] : null;
	const hasSignal = !!(intensityInput?.connectionValid && intensityInput.outputItem?.type === "Signal");
	const sd = hasSignal ? intensityInput?.outputItem?.data : null;
	let intensity = 1;
	let hasStaticSignal = false;
	if (!hasSignal) if (intensityInput?.connectionValid && intensityInput.outputItem?.type === "Number") intensity = Number(intensityInput.outputItem.data ?? 1);
	else intensity = Number(op.intensity ?? 1);
	else if (sd && typeof sd === "object") {
		intensity = Number(sd.offset ?? 1);
		hasStaticSignal = true;
	}
	intensity = Math.max(0, Math.min(10, intensity));
	let lut = lutStore.get(lutUrl, ctx.device);
	if (!lut) {
		lutStore.getOrLoad(lutUrl, ctx.device).catch((err) => {
			if (err instanceof DOMException && err.name === "AbortError" || err && typeof err === "object" && "name" in err && err.name === "AbortError") return;
			console.error("[ApplyLUT] Failed to load LUT in background:", err);
		});
		if (lutUrl.startsWith("runtime://lut/")) {
			const prefix = lutUrl.substring(0, lutUrl.lastIndexOf("-") + 1);
			if (prefix) lut = lutStore.getAnyMatching(prefix, ctx.device);
		}
	}
	const tmpTex = ctx.renderer.getTemporaryTexture(width, height, [...props.excludeTextures || [], targetTexture]);
	const tmpView = tmpTex.createView();
	ctx.renderer.beginFrame(encoder, tmpView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, width, height, "clear").end();
	ctx.renderer.pushScissor({
		x: 0,
		y: 0,
		width,
		height
	});
	ctx.renderer.pushIdentity();
	await drawChild(childMedia, {
		...props,
		virtualMedia: childMedia
	}, tmpView, tmpTex, width, height);
	ctx.renderer.popTransform();
	ctx.renderer.popScissor();
	if (!lut) {
		const finalPass$1 = ctx.renderer.beginFrame(encoder, targetView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, targetWidth, targetHeight, "load");
		ctx.renderer.drawTexture(finalPass$1, tmpTex, {
			x: 0,
			y: 0,
			width: targetWidth,
			height: targetHeight
		}, { opacity: op.opacity ?? 1 });
		args.pass = finalPass$1;
		return;
	}
	const { lutPipeline: pipeline, lutUniformLayout: uLayout, singleTextureLayout: tLayout, lutTextureLayout: lLayout, signalTextureLayout: sigLayout } = getLutResources(ctx.device, ctx.renderer.format, lut.type);
	const sampler = ctx.renderer.samplerCache.getSampler(ctx.device);
	const outTex = ctx.renderer.getTemporaryTexture(width, height, [
		tmpTex,
		targetTexture,
		...props.excludeTextures || []
	]);
	let signalView;
	if (hasStaticSignal) {
		const elapsedSeconds = props.elapsedMs !== void 0 ? props.elapsedMs / 1e3 : frame / fps;
		const durationSeconds = props.virtualMedia?.metadata?.durationMs ? props.virtualMedia.metadata.durationMs / 1e3 : props.durationMs !== void 0 ? props.durationMs / 1e3 : 0;
		signalView = signalRegistry.getOrCreate2DTextureView(ctx.device, encoder, sd.nodeId ?? "lut_intensity_sig", elapsedSeconds, durationSeconds, sd, width, height, props.renderId, frame, fps);
	} else signalView = signalRegistry.getDummy1x1TextureView(ctx.device);
	lutUniformData[0] = intensity;
	lutUniformData[1] = lut.size;
	lutUniformData[2] = hasStaticSignal ? 1 : 0;
	lutUniformData[3] = 0;
	const uniformBuffer = ctx.renderer.getTemporaryBuffer(lutUniformData);
	const renderPass = encoder.beginRenderPass({ colorAttachments: [{
		view: outTex.createView(),
		loadOp: "clear",
		storeOp: "store",
		clearValue: {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	}] });
	renderPass.setPipeline(pipeline);
	renderPass.setBindGroup(0, ctx.device.createBindGroup({
		layout: uLayout,
		entries: [{
			binding: 0,
			resource: { buffer: uniformBuffer }
		}]
	}));
	renderPass.setBindGroup(1, ctx.renderer.bindGroupCache.getBindGroup(ctx.device, tLayout, tmpTex, sampler));
	renderPass.setBindGroup(2, ctx.device.createBindGroup({
		layout: lLayout,
		entries: [{
			binding: 0,
			resource: lut.texture.createView()
		}, {
			binding: 1,
			resource: sampler
		}]
	}));
	renderPass.setBindGroup(3, ctx.device.createBindGroup({
		layout: sigLayout,
		entries: [{
			binding: 0,
			resource: signalView
		}, {
			binding: 1,
			resource: sampler
		}]
	}));
	renderPass.draw(4);
	renderPass.end();
	const finalPass = ctx.renderer.beginFrame(encoder, targetView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, targetWidth, targetHeight, "load");
	ctx.renderer.drawTexture(finalPass, outTex, {
		x: 0,
		y: 0,
		width: targetWidth,
		height: targetHeight
	}, { opacity: op.opacity ?? 1 });
	args.pass = finalPass;
};
var renderers_default = defineRenderer({ WebGPURenderer: LutWebGPURenderer });

//#endregion
export { renderers_default as default };