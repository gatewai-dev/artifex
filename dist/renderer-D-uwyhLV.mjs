import "./dist-DtlkxQom.mjs";
import { D as signalRegistry } from "./dist-xl6mY7se.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-displacement-map/dist/renderer.mjs
const STRENGTH_MIN = 0;
const STRENGTH_MAX = 500;
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
const DISPLACEMENT_MAP_SHADER = `
struct DisplacementUniforms {
    strengthX     : f32,
    strengthY     : f32,
    xChannel      : f32, // 0=R, 1=G, 2=B, 3=A, 4=Luma
    yChannel      : f32, // 0=R, 1=G, 2=B, 3=A, 4=Luma

    wrapMode      : f32, // 0=Clamp, 1=Repeat, 2=Mirror
    hasSignalX    : f32,
    hasSignalY    : f32,
    _pad          : f32,
};

@group(0) @binding(0) var<uniform> u : DisplacementUniforms;
@group(1) @binding(0) var srcTex     : texture_2d<f32>;
@group(1) @binding(1) var srcSamp    : sampler;
@group(2) @binding(0) var mapTex     : texture_2d<f32>;
@group(2) @binding(1) var mapSamp    : sampler;
@group(3) @binding(0) var sigXTex    : texture_2d<f32>;
@group(3) @binding(1) var sigYTex    : texture_2d<f32>;
@group(3) @binding(2) var sigSamp    : sampler;

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

fn extractChannel(color: vec4<f32>, channel: f32) -> f32 {
    if (channel < 0.5) { return color.r; }
    if (channel < 1.5) { return color.g; }
    if (channel < 2.5) { return color.b; }
    if (channel < 3.5) { return color.a; }
    // Luminance
    return dot(color.rgb, vec3<f32>(0.299, 0.587, 0.114));
}

fn applyWrap(coord: f32, mode: f32) -> f32 {
    if (mode < 0.5) {
        // Clamp
        return clamp(coord, 0.0, 1.0);
    }
    if (mode < 1.5) {
        // Repeat
        return fract(coord);
    }
    // Mirror
    let t = fract(coord * 0.5) * 2.0;
    if (t > 1.0) {
        return 2.0 - t;
    }
    return t;
}

@fragment fn fs(in : VSOut) -> @location(0) vec4<f32> {
    let mapColor = textureSampleLevel(mapTex, mapSamp, in.uv, 0.0);

    // Extract displacement values from chosen channels, centered around 0.5 and gated by alpha
    // NOTE (P3, not changed here): this yields a max offset of strength/2 px at
    // either extreme (peak-to-peak swing == strength). Confirm with design whether
    // "strength in pixels" should mean peak amplitude instead — see review doc.
    let dispX = (extractChannel(mapColor, u.xChannel) - 0.5) * mapColor.a;
    let dispY = (extractChannel(mapColor, u.yChannel) - 0.5) * mapColor.a;

    // Get strength, potentially from signal textures
    var sX = u.strengthX;
    var sY = u.strengthY;
    if (u.hasSignalX > 0.5) {
        sX = textureSampleLevel(sigXTex, sigSamp, in.uv, 0.0).r;
    }
    if (u.hasSignalY > 0.5) {
        sY = textureSampleLevel(sigYTex, sigSamp, in.uv, 0.0).r;
    }

    // Compute displacement in UV space (strength is in pixels, convert to UV)
    let srcDims = vec2<f32>(textureDimensions(srcTex));
    let offset = vec2<f32>(
        dispX * sX / srcDims.x,
        dispY * sY / srcDims.y,
    );

    let displaced = vec2<f32>(
        applyWrap(in.uv.x + offset.x, u.wrapMode),
        applyWrap(in.uv.y + offset.y, u.wrapMode),
    );

    return textureSampleLevel(srcTex, srcSamp, displaced, 0.0);
}
`;
const deviceResourceCache = /* @__PURE__ */ new WeakMap();
const uniformData = new Float32Array(8);
function getDeviceLayouts(device) {
	let res = deviceResourceCache.get(device);
	if (res) return res;
	res = {
		uniformLayout: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			buffer: { type: "uniform" }
		}] }),
		srcTextureLayout: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] }),
		mapTextureLayout: device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] }),
		signalTextureLayout: device.createBindGroupLayout({ entries: [
			{
				binding: 0,
				visibility: GPUShaderStage.FRAGMENT,
				texture: { sampleType: "float" }
			},
			{
				binding: 1,
				visibility: GPUShaderStage.FRAGMENT,
				texture: { sampleType: "float" }
			},
			{
				binding: 2,
				visibility: GPUShaderStage.FRAGMENT,
				sampler: { type: "filtering" }
			}
		] }),
		pipelineCache: /* @__PURE__ */ new Map()
	};
	deviceResourceCache.set(device, res);
	return res;
}
function getDisplacementResources(device, format) {
	const layouts = getDeviceLayouts(device);
	const cacheKey = `displacement_${format}`;
	let pipeline = layouts.pipelineCache.get(cacheKey);
	if (!pipeline) {
		const module = device.createShaderModule({
			label: `displacement_${format}.wgsl`,
			code: DISPLACEMENT_MAP_SHADER
		});
		pipeline = device.createRenderPipeline({
			label: `DisplacementMapPipeline_${format}`,
			layout: device.createPipelineLayout({ bindGroupLayouts: [
				layouts.uniformLayout,
				layouts.srcTextureLayout,
				layouts.mapTextureLayout,
				layouts.signalTextureLayout
			] }),
			vertex: {
				module,
				entryPoint: "vs"
			},
			fragment: {
				module,
				entryPoint: "fs",
				targets: [{ format }]
			},
			primitive: { topology: "triangle-strip" }
		});
		layouts.pipelineCache.set(cacheKey, pipeline);
	}
	return {
		pipeline,
		uniformLayout: layouts.uniformLayout,
		srcTextureLayout: layouts.srcTextureLayout,
		mapTextureLayout: layouts.mapTextureLayout,
		signalTextureLayout: layouts.signalTextureLayout
	};
}
function channelToFloat(ch) {
	switch (ch) {
		case "Green": return 1;
		case "Blue": return 2;
		case "Alpha": return 3;
		case "Luminance": return 4;
		default: return 0;
	}
}
function wrapModeToFloat(mode) {
	switch (mode) {
		case "Repeat": return 1;
		case "Mirror": return 2;
		default: return 0;
	}
}
function resolveSignalField(op, fieldName, defaultValue) {
	const handleId = op[`${fieldName}HandleId`];
	const signalInput = handleId ? op.inputs?.[handleId] : null;
	const hasSignal = !!(signalInput?.connectionValid && signalInput.outputItem?.type === "Signal");
	const sd = hasSignal ? signalInput?.outputItem?.data : null;
	let value = defaultValue;
	if (!hasSignal) if (signalInput?.connectionValid && signalInput.outputItem?.type === "Number") value = clamp(Number(signalInput.outputItem.data ?? defaultValue), STRENGTH_MIN, STRENGTH_MAX);
	else value = Number(op[fieldName] ?? defaultValue);
	else if (sd && typeof sd === "object" && "offset" in sd) value = Number(sd.offset ?? defaultValue);
	return {
		hasSignal,
		sd,
		value
	};
}
const DisplacementMapWebGPURenderer = async (args) => {
	const { ctx, encoder, pass, targetView, targetTexture, targetWidth, targetHeight, props, drawChild } = args;
	const op = props.virtualMedia?.operation;
	if (op?.op !== "DisplacementMap" || !op) return;
	const sourceMedia = props.virtualMedia.children?.[0];
	const mapMedia = op.mapMedia;
	if (!sourceMedia || !mapMedia) return;
	pass.end();
	const width = targetWidth;
	const height = targetHeight;
	const frame = props.frame ?? 0;
	const fps = props.fps || 30;
	const strengthXInfo = resolveSignalField(op, "strengthX", 50);
	const strengthYInfo = resolveSignalField(op, "strengthY", 50);
	const srcTex = ctx.renderer.getTemporaryTexture(width, height, [...props.excludeTextures || [], targetTexture]);
	const srcView = srcTex.createView();
	ctx.renderer.beginFrame(encoder, srcView, {
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
	await drawChild(sourceMedia, {
		...props,
		virtualMedia: sourceMedia,
		renderId: `${props.renderId}-c0`,
		excludeTextures: [...props.excludeTextures || [], srcTex]
	}, srcView, srcTex, width, height);
	ctx.renderer.popTransform();
	ctx.renderer.popScissor();
	args.pass.end();
	const mapTex = ctx.renderer.getTemporaryTexture(width, height, [
		...props.excludeTextures || [],
		targetTexture,
		srcTex
	]);
	const mapView = mapTex.createView();
	ctx.renderer.beginFrame(encoder, mapView, {
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
	await drawChild(mapMedia, {
		...props,
		virtualMedia: mapMedia,
		renderId: `${props.renderId}-c1`,
		excludeTextures: [
			...props.excludeTextures || [],
			srcTex,
			mapTex
		]
	}, mapView, mapTex, width, height);
	ctx.renderer.popTransform();
	ctx.renderer.popScissor();
	args.pass.end();
	const { pipeline, uniformLayout: uLayout, srcTextureLayout: srcLayout, mapTextureLayout: mapLayout, signalTextureLayout: sigLayout } = getDisplacementResources(ctx.device, ctx.renderer.format);
	const sampler = ctx.renderer.samplerCache.getSampler(ctx.device);
	let sigXView;
	let sigYView;
	const elapsedSeconds = props.elapsedMs !== void 0 ? props.elapsedMs / 1e3 : frame / fps;
	const durationSeconds = props.virtualMedia?.metadata?.durationMs ? props.virtualMedia.metadata.durationMs / 1e3 : props.durationMs !== void 0 ? props.durationMs / 1e3 : 0;
	if (strengthXInfo.hasSignal && strengthXInfo.sd) sigXView = signalRegistry.getOrCreate2DTextureView(ctx.device, encoder, strengthXInfo.sd.nodeId ?? "displace_sx_sig", elapsedSeconds, durationSeconds, strengthXInfo.sd, width, height, props.renderId, frame, fps);
	else sigXView = signalRegistry.getDummy1x1TextureView(ctx.device);
	if (strengthYInfo.hasSignal && strengthYInfo.sd) sigYView = signalRegistry.getOrCreate2DTextureView(ctx.device, encoder, strengthYInfo.sd.nodeId ?? "displace_sy_sig", elapsedSeconds, durationSeconds, strengthYInfo.sd, width, height, props.renderId, frame, fps);
	else sigYView = signalRegistry.getDummy1x1TextureView(ctx.device);
	uniformData[0] = strengthXInfo.value;
	uniformData[1] = strengthYInfo.value;
	uniformData[2] = channelToFloat(op.xChannel);
	uniformData[3] = channelToFloat(op.yChannel);
	uniformData[4] = wrapModeToFloat(op.wrapMode);
	uniformData[5] = strengthXInfo.hasSignal ? 1 : 0;
	uniformData[6] = strengthYInfo.hasSignal ? 1 : 0;
	uniformData[7] = 0;
	const uniformBuffer = ctx.renderer.getTemporaryBuffer(uniformData);
	const outTex = ctx.renderer.getTemporaryTexture(width, height, [
		srcTex,
		mapTex,
		targetTexture,
		...props.excludeTextures || []
	]);
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
	renderPass.setBindGroup(1, ctx.renderer.bindGroupCache.getBindGroup(ctx.device, srcLayout, srcTex, sampler));
	renderPass.setBindGroup(2, ctx.renderer.bindGroupCache.getBindGroup(ctx.device, mapLayout, mapTex, sampler));
	renderPass.setBindGroup(3, ctx.device.createBindGroup({
		layout: sigLayout,
		entries: [
			{
				binding: 0,
				resource: sigXView
			},
			{
				binding: 1,
				resource: sigYView
			},
			{
				binding: 2,
				resource: sampler
			}
		]
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
var renderers_default = defineRenderer({ WebGPURenderer: DisplacementMapWebGPURenderer });

//#endregion
export { renderers_default as default };