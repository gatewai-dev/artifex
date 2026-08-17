import "./dist-BWJGEiuE.mjs";
import { O as signalRegistry } from "./dist-9NtvXM2x.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";
import { a as MAX_SMOOTH, c as MIN_RADIUS, i as MAX_SHIFT_EDGE, l as MIN_SHIFT_EDGE, n as MAX_FEATHER, o as MIN_DECONTAMINATE, r as MAX_RADIUS, s as MIN_FEATHER, t as MAX_DECONTAMINATE, u as MIN_SMOOTH } from "./shared-CaC0NEDX-Biut4G0-.mjs";

//#region ../../nodes/node-refine-edge/dist/renderer.mjs
const CHANNEL_MAP = {
	Alpha: 0,
	Luminance: 1,
	Red: 2,
	Green: 3,
	Blue: 4
};
const OUTPUT_MODE_MAP = {
	Composite: 0,
	MatteOnly: 1,
	DecontaminatedRGB: 2
};
const WGSL_REFINE_EDGE = `
struct RefineEdgeUniforms {
	dirX                : f32,
	dirY                : f32,
	decontaminateAmount : f32,
	radius              : f32,

	smoothness          : f32,
	feather             : f32,
	shiftEdge           : f32,
	matteChannel        : f32,

	outputMode          : f32,
	hasMatte            : f32,
	hasDecontamSig      : f32,
	hasRadiusSig        : f32,

	hasSmoothSig        : f32,
	hasFeatherSig       : f32,
	hasShiftEdgeSig     : f32,
	isSecondPass        : f32,

	pad0                : f32,
	pad1                : f32,
	pad2                : f32,
	pad3                : f32,
};

@group(0) @binding(0) var<uniform> u          : RefineEdgeUniforms;

@group(1) @binding(0) var texInput            : texture_2d<f32>;
@group(1) @binding(1) var texMatte            : texture_2d<f32>;
@group(1) @binding(2) var origTex             : texture_2d<f32>;
@group(1) @binding(3) var samp                : sampler;

@group(2) @binding(0) var decontamSigTex      : texture_2d<f32>;
@group(2) @binding(1) var radiusSigTex        : texture_2d<f32>;
@group(2) @binding(2) var smoothSigTex        : texture_2d<f32>;
@group(2) @binding(3) var featherSigTex       : texture_2d<f32>;
@group(2) @binding(4) var shiftEdgeSigTex     : texture_2d<f32>;
@group(2) @binding(5) var signalSamp          : sampler;

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

fn extractChannel(color : vec4<f32>, chCode : f32) -> f32 {
	if (chCode < 0.5) {
		// Alpha
		return color.a;
	} else if (chCode < 1.5) {
		// Luminance
		let luma = dot(color.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
		if (color.a > 1e-4) {
			return min(1.0, luma / color.a);
		}
		return luma;
	} else if (chCode < 2.5) {
		// Red
		if (color.a > 1e-4) {
			return min(1.0, color.r / color.a);
		}
		return color.r;
	} else if (chCode < 3.5) {
		// Green
		if (color.a > 1e-4) {
			return min(1.0, color.g / color.a);
		}
		return color.g;
	} else {
		// Blue
		if (color.a > 1e-4) {
			return min(1.0, color.b / color.a);
		}
		return color.b;
	}
}

@fragment fn fs(in : VSOut) -> @location(0) vec4<f32> {
	let dimensions = vec2<f32>(textureDimensions(texInput));
	let texelSize = 1.0 / max(dimensions, vec2<f32>(1.0, 1.0));

	var decontam = u.decontaminateAmount;
	if (u.hasDecontamSig > 0.5) {
		decontam = clamp(textureSampleLevel(decontamSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r, 0.0, 1.0);
	}
	var radius = u.radius;
	if (u.hasRadiusSig > 0.5) {
		radius = clamp(textureSampleLevel(radiusSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r, 0.5, 50.0);
	}
	var smoothVal = u.smoothness;
	if (u.hasSmoothSig > 0.5) {
		smoothVal = clamp(textureSampleLevel(smoothSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r, 0.0, 100.0);
	}
	var featherVal = u.feather;
	if (u.hasFeatherSig > 0.5) {
		featherVal = clamp(textureSampleLevel(featherSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r, 0.0, 50.0);
	}
	var shiftEdgeVal = u.shiftEdge;
	if (u.hasShiftEdgeSig > 0.5) {
		shiftEdgeVal = clamp(textureSampleLevel(shiftEdgeSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r, -100.0, 100.0);
	}

	let direction = vec2<f32>(u.dirX, u.dirY);

	// Combined sigma for smoothing & feathering
	let smoothSigma = max(0.0, smoothVal * 0.15);
	let featherSigma = max(0.0, featherVal);
	let totalSigma = max(0.1, sqrt(smoothSigma * smoothSigma + featherSigma * featherSigma));

	if (u.isSecondPass <= 0.5) {
		// =============================================================
		// PASS 1: Horizontal Pass (Alpha filter + FG color sampling)
		// =============================================================
		let centerInput = textureSampleLevel(texInput, samp, in.uv, 0.0);
		let centerMatte = textureSampleLevel(texMatte, samp, in.uv, 0.0);

		var centerRawAlpha = centerInput.a;
		if (u.hasMatte > 0.5) {
			centerRawAlpha = extractChannel(centerMatte, u.matteChannel);
		}

		// 1. Horizontal Alpha Blur / Filter
		var alphaAccum = 0.0;
		var alphaWeightSum = 0.0;

		let stepScale = max(1.0, totalSigma / 15.0);
		let effectiveSigma = totalSigma / stepScale;
		let sampleRadius = min(i32(ceil(3.0 * effectiveSigma)), 32);

		for (var i = -sampleRadius; i <= sampleRadius; i++) {
			let offset = vec2<f32>(f32(i) * stepScale) * direction * texelSize;
			let sampleUv = clamp(in.uv + offset, vec2<f32>(0.0), vec2<f32>(1.0));
			let sampleInput = textureSampleLevel(texInput, samp, sampleUv, 0.0);
			var sAlpha = sampleInput.a;
			if (u.hasMatte > 0.5) {
				let sMatte = textureSampleLevel(texMatte, samp, sampleUv, 0.0);
				sAlpha = extractChannel(sMatte, u.matteChannel);
			}

			let dist = f32(i) * stepScale;
			let weight = exp(-0.5 * (dist / totalSigma) * (dist / totalSigma));
			alphaAccum += sAlpha * weight;
			alphaWeightSum += weight;
		}

		let smoothedAlpha = alphaAccum / max(alphaWeightSum, 1e-5);

		// 2. Horizontal Foreground Color Sampling for Defringing
		var fgColorAccum = vec3<f32>(0.0);
		var fgWeightSum = 0.0;

		let rStepScale = max(1.0, radius / 15.0);
		let rSampleCount = min(i32(ceil(radius / rStepScale)), 32);

		for (var i = -rSampleCount; i <= rSampleCount; i++) {
			let offset = vec2<f32>(f32(i) * rStepScale) * direction * texelSize;
			let sampleUv = clamp(in.uv + offset, vec2<f32>(0.0), vec2<f32>(1.0));
			let sampleCol = textureSampleLevel(texInput, samp, sampleUv, 0.0);
			var sampleA = sampleCol.a;
			if (u.hasMatte > 0.5) {
				let sm = textureSampleLevel(texMatte, samp, sampleUv, 0.0);
				sampleA = extractChannel(sm, u.matteChannel);
			}

			let sampleRgb = select(sampleCol.rgb, sampleCol.rgb / max(sampleCol.a, 1e-4), sampleCol.a > 1e-4);
			let spatialDist = f32(i) * rStepScale;
			let spatialWeight = exp(-0.5 * (spatialDist / max(radius, 0.5)) * (spatialDist / max(radius, 0.5)));
			// Weight foreground pixels by alpha confidence
			let fgConfidence = clamp((sampleA - 0.2) / 0.8, 0.0, 1.0);
			let weight = fgConfidence * spatialWeight;

			fgColorAccum += sampleRgb * weight;
			fgWeightSum += weight;
		}

		let centerUnpremult = select(centerInput.rgb, centerInput.rgb / max(centerInput.a, 1e-4), centerInput.a > 1e-4);
		let fgColor = select(centerUnpremult, fgColorAccum / max(fgWeightSum, 1e-5), fgWeightSum > 1e-4);

		return vec4<f32>(fgColor, smoothedAlpha);
	}

	// =============================================================
	// PASS 2: Vertical Pass & Final Defringe/Composite
	// =============================================================
	let pass1Sample = textureSampleLevel(texInput, samp, in.uv, 0.0);
	let origSample = textureSampleLevel(origTex, samp, in.uv, 0.0);

	var rawMatteAlpha = origSample.a;
	if (u.hasMatte > 0.5) {
		let rawMatteSample = textureSampleLevel(texMatte, samp, in.uv, 0.0);
		rawMatteAlpha = extractChannel(rawMatteSample, u.matteChannel);
	}

	// 1. Vertical Alpha Blur / Filter
	var alphaAccum = 0.0;
	var alphaWeightSum = 0.0;

	let stepScale = max(1.0, totalSigma / 15.0);
	let effectiveSigma = totalSigma / stepScale;
	let sampleRadius = min(i32(ceil(3.0 * effectiveSigma)), 32);

	for (var i = -sampleRadius; i <= sampleRadius; i++) {
		let offset = vec2<f32>(f32(i) * stepScale) * direction * texelSize;
		let sampleUv = clamp(in.uv + offset, vec2<f32>(0.0), vec2<f32>(1.0));
		let sPass1 = textureSampleLevel(texInput, samp, sampleUv, 0.0);
		let sAlpha = sPass1.a;

		let dist = f32(i) * stepScale;
		let weight = exp(-0.5 * (dist / totalSigma) * (dist / totalSigma));
		alphaAccum += sAlpha * weight;
		alphaWeightSum += weight;
	}

	var refinedAlpha = alphaAccum / max(alphaWeightSum, 1e-5);

	// 2. Shift Edge (Choke < 0 or Expand > 0)
	if (abs(shiftEdgeVal) > 0.01) {
		let shiftNorm = shiftEdgeVal / 100.0;
		if (shiftNorm < 0.0) {
			// Contract / Choke
			let chokeLimit = abs(shiftNorm);
			refinedAlpha = clamp((refinedAlpha - chokeLimit) / max(1.0 - chokeLimit, 1e-4), 0.0, 1.0);
		} else {
			// Expand / Dilate
			refinedAlpha = clamp(refinedAlpha / max(1.0 - shiftNorm, 1e-4), 0.0, 1.0);
		}
	}

	// 3. Vertical Foreground Color Sampling for Defringing
	var fgColorAccum = vec3<f32>(0.0);
	var fgWeightSum = 0.0;

	let rStepScale = max(1.0, radius / 15.0);
	let rSampleCount = min(i32(ceil(radius / rStepScale)), 32);

	for (var i = -rSampleCount; i <= rSampleCount; i++) {
		let offset = vec2<f32>(f32(i) * rStepScale) * direction * texelSize;
		let sampleUv = clamp(in.uv + offset, vec2<f32>(0.0), vec2<f32>(1.0));
		let sPass1 = textureSampleLevel(texInput, samp, sampleUv, 0.0);
		let sRgb = sPass1.rgb;
		let sA = sPass1.a;

		let spatialDist = f32(i) * rStepScale;
		let spatialWeight = exp(-0.5 * (spatialDist / max(radius, 0.5)) * (spatialDist / max(radius, 0.5)));
		let fgConfidence = clamp((sA - 0.2) / 0.8, 0.0, 1.0);
		let weight = fgConfidence * spatialWeight;

		fgColorAccum += sRgb * weight;
		fgWeightSum += weight;
	}

	let origUnpremult = select(origSample.rgb, origSample.rgb / max(origSample.a, 1e-4), origSample.a > 1e-4);
	let fgColor = select(origUnpremult, fgColorAccum / max(fgWeightSum, 1e-5), fgWeightSum > 1e-4);

	// Edge zone detection: transitions between foreground and background
	let edgeWeight = clamp(4.0 * rawMatteAlpha * (1.0 - rawMatteAlpha), 0.0, 1.0);
	let decontamFactor = clamp(decontam * max(edgeWeight, (1.0 - refinedAlpha) * 0.8), 0.0, 1.0);

	let decontaminatedColor = mix(origUnpremult, fgColor, decontamFactor);

	// Format Output
	let mode = u.outputMode;
	if (mode < 0.5) {
		// Composite: Decontaminated RGB with refined alpha (premultiplied)
		return vec4<f32>(decontaminatedColor * refinedAlpha, refinedAlpha);
	} else if (mode < 1.5) {
		// MatteOnly: Grayscale refined alpha mask
		return vec4<f32>(refinedAlpha, refinedAlpha, refinedAlpha, 1.0);
	} else {
		// DecontaminatedRGB: Clean defringed RGB with full alpha
		return vec4<f32>(decontaminatedColor, 1.0);
	}
}
`;
const deviceResourceCache = /* @__PURE__ */ new WeakMap();
function getRefineEdgeResources(device, targetFormat) {
	const cached = deviceResourceCache.get(device);
	if (cached) return cached;
	const uniformLayout = device.createBindGroupLayout({ entries: [{
		binding: 0,
		visibility: GPUShaderStage.FRAGMENT,
		buffer: { type: "uniform" }
	}] });
	const textureLayout = device.createBindGroupLayout({ entries: [
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
			texture: { sampleType: "float" }
		},
		{
			binding: 3,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}
	] });
	const signalTextureLayout = device.createBindGroupLayout({ entries: [
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
			texture: { sampleType: "float" }
		},
		{
			binding: 3,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		},
		{
			binding: 4,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		},
		{
			binding: 5,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}
	] });
	const shaderModule = device.createShaderModule({ code: WGSL_REFINE_EDGE });
	const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [
		uniformLayout,
		textureLayout,
		signalTextureLayout
	] });
	const res = {
		uniformLayout,
		textureLayout,
		signalTextureLayout,
		pipeline: device.createRenderPipeline({
			layout: pipelineLayout,
			vertex: {
				module: shaderModule,
				entryPoint: "vs"
			},
			fragment: {
				module: shaderModule,
				entryPoint: "fs",
				targets: [{ format: targetFormat }]
			},
			primitive: { topology: "triangle-strip" }
		})
	};
	deviceResourceCache.set(device, res);
	return res;
}
const WebGPURenderer = async (args) => {
	const { ctx, encoder, pass, targetView, targetTexture, targetWidth, targetHeight, props, drawChild } = args;
	const op = props.virtualMedia?.operation;
	if (op?.op !== "RefineEdge" || !op) return;
	const childMedia = props.virtualMedia?.children?.[0];
	if (!childMedia) return;
	pass.end();
	const frame = props.frame ?? 0;
	const fps = props.fps || 30;
	const width = targetWidth;
	const height = targetHeight;
	const resolveField = (handleId, fallbackVal, clampMin = 0, clampMax = 1e3) => {
		if (handleId && op.inputs?.[handleId]?.connectionValid) {
			const outputItem = op.inputs[handleId].outputItem;
			if (outputItem?.type === "Number") {
				const numVal = typeof outputItem.data === "number" ? outputItem.data : outputItem.data?.value ?? fallbackVal;
				return {
					val: Math.max(clampMin, Math.min(clampMax, numVal)),
					hasStaticSig: false,
					sd: null,
					handleId
				};
			}
			if (outputItem?.type === "Signal" && outputItem.data) return {
				val: fallbackVal,
				hasStaticSig: true,
				sd: outputItem.data,
				handleId
			};
		}
		return {
			val: Math.max(clampMin, Math.min(clampMax, fallbackVal)),
			hasStaticSig: false,
			sd: null,
			handleId
		};
	};
	const decontamRes = resolveField(op.decontaminateAmountHandleId, Number(op.decontaminateAmount ?? .7), MIN_DECONTAMINATE, MAX_DECONTAMINATE);
	const radiusRes = resolveField(op.radiusHandleId, Number(op.radius ?? 2), MIN_RADIUS, MAX_RADIUS);
	const smoothRes = resolveField(op.smoothHandleId, Number(op.smooth ?? 5), MIN_SMOOTH, MAX_SMOOTH);
	const featherRes = resolveField(op.featherHandleId, Number(op.feather ?? .5), MIN_FEATHER, MAX_FEATHER);
	const shiftEdgeRes = resolveField(op.shiftEdgeHandleId, Number(op.shiftEdge ?? 0), MIN_SHIFT_EDGE, MAX_SHIFT_EDGE);
	const tmpInputTex = ctx.renderer.getTemporaryTexture(width, height, [...props.excludeTextures || [], targetTexture]);
	const tmpInputView = tmpInputTex.createView();
	ctx.renderer.beginFrame(encoder, tmpInputView, {
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
		virtualMedia: childMedia,
		renderId: `${props.renderId}-input`,
		excludeTextures: [...props.excludeTextures || [], tmpInputTex]
	}, tmpInputView, tmpInputTex, width, height);
	ctx.renderer.popTransform();
	ctx.renderer.popScissor();
	let tmpMatteTex = null;
	if (op.matteMedia) {
		tmpMatteTex = ctx.renderer.getTemporaryTexture(width, height, [
			...props.excludeTextures || [],
			targetTexture,
			tmpInputTex
		]);
		const tmpMatteView = tmpMatteTex.createView();
		ctx.renderer.beginFrame(encoder, tmpMatteView, {
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
		await drawChild(op.matteMedia, {
			...props,
			virtualMedia: op.matteMedia,
			renderId: `${props.renderId}-matte`,
			excludeTextures: [
				...props.excludeTextures || [],
				tmpInputTex,
				tmpMatteTex
			]
		}, tmpMatteView, tmpMatteTex, width, height);
		ctx.renderer.popTransform();
		ctx.renderer.popScissor();
	}
	const { pipeline, uniformLayout, textureLayout, signalTextureLayout } = getRefineEdgeResources(ctx.device, ctx.renderer.format);
	const sampler = ctx.renderer.samplerCache.getSampler(ctx.device);
	const elapsedSeconds = props.elapsedMs !== void 0 ? props.elapsedMs / 1e3 : frame / fps;
	const durationSeconds = props.virtualMedia?.metadata?.durationMs ? props.virtualMedia.metadata.durationMs / 1e3 : props.durationMs !== void 0 ? props.durationMs / 1e3 : 0;
	const getSignalView = (res, suffix) => {
		if (res.hasStaticSig && res.sd) {
			const cacheNodeId = res.sd.nodeId ?? res.handleId ?? `${props.renderId ?? "refineedge"}_${suffix}`;
			return signalRegistry.getOrCreate2DTextureView(ctx.device, encoder, cacheNodeId, elapsedSeconds, durationSeconds, res.sd, width, height, props.renderId, frame, fps);
		}
		return signalRegistry.getDummy1x1TextureView(ctx.device);
	};
	const decontamView = getSignalView(decontamRes, "decontam_sig");
	const radiusView = getSignalView(radiusRes, "radius_sig");
	const smoothView = getSignalView(smoothRes, "smooth_sig");
	const featherView = getSignalView(featherRes, "feather_sig");
	const shiftEdgeView = getSignalView(shiftEdgeRes, "shiftEdge_sig");
	const sigBindGroup = ctx.device.createBindGroup({
		layout: signalTextureLayout,
		entries: [
			{
				binding: 0,
				resource: decontamView
			},
			{
				binding: 1,
				resource: radiusView
			},
			{
				binding: 2,
				resource: smoothView
			},
			{
				binding: 3,
				resource: featherView
			},
			{
				binding: 4,
				resource: shiftEdgeView
			},
			{
				binding: 5,
				resource: sampler
			}
		]
	});
	const matteChannelCode = CHANNEL_MAP[op.matteChannel ?? "Alpha"] ?? 0;
	const outputModeCode = OUTPUT_MODE_MAP[op.outputMode ?? "Composite"] ?? 0;
	const dummyMatteView = tmpMatteTex ? tmpMatteTex.createView() : tmpInputView;
	const hUniformData = new Float32Array(20);
	const vUniformData = new Float32Array(20);
	const baseUniforms = [
		0,
		0,
		decontamRes.val,
		radiusRes.val,
		smoothRes.val,
		featherRes.val,
		shiftEdgeRes.val,
		matteChannelCode,
		outputModeCode,
		tmpMatteTex ? 1 : 0,
		decontamRes.hasStaticSig ? 1 : 0,
		radiusRes.hasStaticSig ? 1 : 0,
		smoothRes.hasStaticSig ? 1 : 0,
		featherRes.hasStaticSig ? 1 : 0,
		shiftEdgeRes.hasStaticSig ? 1 : 0,
		0,
		0,
		0,
		0,
		0
	];
	hUniformData.set(baseUniforms);
	hUniformData[0] = 1;
	hUniformData[1] = 0;
	hUniformData[15] = 0;
	vUniformData.set(baseUniforms);
	vUniformData[0] = 0;
	vUniformData[1] = 1;
	vUniformData[15] = 1;
	const outTex1 = ctx.renderer.getTemporaryTexture(width, height, [
		tmpInputTex,
		...tmpMatteTex ? [tmpMatteTex] : [],
		targetTexture,
		...props.excludeTextures || []
	]);
	const outTex2 = ctx.renderer.getTemporaryTexture(width, height, [
		tmpInputTex,
		...tmpMatteTex ? [tmpMatteTex] : [],
		outTex1,
		targetTexture,
		...props.excludeTextures || []
	]);
	const hBuffer = ctx.renderer.getTemporaryBuffer(hUniformData);
	const hPass = encoder.beginRenderPass({ colorAttachments: [{
		view: outTex1.createView(),
		loadOp: "clear",
		storeOp: "store",
		clearValue: {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	}] });
	hPass.setPipeline(pipeline);
	hPass.setBindGroup(0, ctx.device.createBindGroup({
		layout: uniformLayout,
		entries: [{
			binding: 0,
			resource: { buffer: hBuffer }
		}]
	}));
	hPass.setBindGroup(1, ctx.device.createBindGroup({
		layout: textureLayout,
		entries: [
			{
				binding: 0,
				resource: tmpInputView
			},
			{
				binding: 1,
				resource: dummyMatteView
			},
			{
				binding: 2,
				resource: tmpInputView
			},
			{
				binding: 3,
				resource: sampler
			}
		]
	}));
	hPass.setBindGroup(2, sigBindGroup);
	hPass.draw(4);
	hPass.end();
	const vBuffer = ctx.renderer.getTemporaryBuffer(vUniformData);
	const vPass = encoder.beginRenderPass({ colorAttachments: [{
		view: outTex2.createView(),
		loadOp: "clear",
		storeOp: "store",
		clearValue: {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	}] });
	vPass.setPipeline(pipeline);
	vPass.setBindGroup(0, ctx.device.createBindGroup({
		layout: uniformLayout,
		entries: [{
			binding: 0,
			resource: { buffer: vBuffer }
		}]
	}));
	vPass.setBindGroup(1, ctx.device.createBindGroup({
		layout: textureLayout,
		entries: [
			{
				binding: 0,
				resource: outTex1.createView()
			},
			{
				binding: 1,
				resource: dummyMatteView
			},
			{
				binding: 2,
				resource: tmpInputView
			},
			{
				binding: 3,
				resource: sampler
			}
		]
	}));
	vPass.setBindGroup(2, sigBindGroup);
	vPass.draw(4);
	vPass.end();
	const finalPass = ctx.renderer.beginFrame(encoder, targetView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, targetWidth, targetHeight, "load");
	const finalOpacity = props.opacity ?? op.opacity ?? 1;
	ctx.renderer.drawTexture(finalPass, outTex2, {
		x: 0,
		y: 0,
		width: targetWidth,
		height: targetHeight
	}, { opacity: finalOpacity });
	args.pass = finalPass;
};
var renderers_default = defineRenderer({ WebGPURenderer });

//#endregion
export { renderers_default as default };