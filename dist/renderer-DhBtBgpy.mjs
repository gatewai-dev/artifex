import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-curves/dist/spline-C0YcGKLS.mjs
/**
* Solves the Fritsch-Carlson Monotonic Cubic Hermite Spline interpolation
* for a set of control points. Returns an interpolation function.
*/
function solveMonotonicSpline(points) {
	const pts = [...points].sort((a, b) => a.x - b.x);
	const uniquePts = [];
	for (const p of pts) if (uniquePts.length === 0 || Math.abs(p.x - uniquePts[uniquePts.length - 1].x) > 1e-6) uniquePts.push(p);
	const n = uniquePts.length;
	if (n === 0) return (x) => x;
	if (n === 1) return () => uniquePts[0].y;
	const dx = new Float32Array(n - 1);
	const dy = new Float32Array(n - 1);
	const ms = new Float32Array(n - 1);
	for (let i = 0; i < n - 1; i++) {
		dx[i] = uniquePts[i + 1].x - uniquePts[i].x;
		dy[i] = uniquePts[i + 1].y - uniquePts[i].y;
		ms[i] = dy[i] / dx[i];
	}
	const tangents = new Float32Array(n);
	tangents[0] = ms[0];
	for (let i = 1; i < n - 1; i++) tangents[i] = (ms[i - 1] + ms[i]) / 2;
	tangents[n - 1] = ms[n - 2];
	for (let i = 0; i < n - 1; i++) {
		const m = ms[i];
		if (Math.abs(m) < 1e-9) {
			tangents[i] = 0;
			tangents[i + 1] = 0;
		} else {
			const alpha = tangents[i] / m;
			const beta = tangents[i + 1] / m;
			const alphaSq = alpha * alpha;
			const betaSq = beta * beta;
			if (alphaSq + betaSq > 9) {
				const tau = 3 / Math.sqrt(alphaSq + betaSq);
				tangents[i] = tau * alpha * m;
				tangents[i + 1] = tau * beta * m;
			}
		}
	}
	return (x) => {
		if (x <= uniquePts[0].x) return uniquePts[0].y;
		if (x >= uniquePts[n - 1].x) return uniquePts[n - 1].y;
		let low = 0;
		let high = n - 2;
		let idx = 0;
		while (low <= high) {
			const mid = low + high >> 1;
			if (x >= uniquePts[mid].x && x <= uniquePts[mid + 1].x) {
				idx = mid;
				break;
			}
			if (x < uniquePts[mid].x) high = mid - 1;
			else low = mid + 1;
		}
		const h = dx[idx];
		const t = (x - uniquePts[idx].x) / h;
		const t2 = t * t;
		const t3 = t2 * t;
		const h00 = 2 * t3 - 3 * t2 + 1;
		const h10 = t3 - 2 * t2 + t;
		const h01 = -2 * t3 + 3 * t2;
		const h11 = t3 - t2;
		const y = uniquePts[idx].y * h00 + h * tangents[idx] * h10 + uniquePts[idx + 1].y * h01 + h * tangents[idx + 1] * h11;
		return Math.max(0, Math.min(1, y));
	};
}

//#endregion
//#region ../../nodes/node-curves/dist/histogram-computer-CNNB-uHg.mjs
const PER_CHAN_SIZE = 256 * 4;
const HISTOGRAM_COMPUTE_SHADER = `
@group(0) @binding(0) var t_src: texture_2d<f32>;
@group(0) @binding(1) var<storage, read_write> bins_r:    array<atomic<u32>, 256>;
@group(0) @binding(2) var<storage, read_write> bins_g:    array<atomic<u32>, 256>;
@group(0) @binding(3) var<storage, read_write> bins_b:    array<atomic<u32>, 256>;
@group(0) @binding(4) var<storage, read_write> bins_luma: array<atomic<u32>, 256>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
	let dims = textureDimensions(t_src, 0);
	if (gid.x >= dims.x || gid.y >= dims.y) { return; }

	let color = textureLoad(t_src, vec2<u32>(gid.x, gid.y), 0);
	let a = color.a;
	if (a < 1e-5) { return; }

	let rgb = color.rgb / a;

	let ri    = u32(clamp(rgb.r * 255.0, 0.0, 255.0));
	let gi    = u32(clamp(rgb.g * 255.0, 0.0, 255.0));
	let bi    = u32(clamp(rgb.b * 255.0, 0.0, 255.0));
	let luma  = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
	let lumai = u32(clamp(luma * 255.0, 0.0, 255.0));

	atomicAdd(&bins_r[ri],    1u);
	atomicAdd(&bins_g[gi],    1u);
	atomicAdd(&bins_b[bi],    1u);
	atomicAdd(&bins_luma[lumai], 1u);
}
`;
const deviceResourceCache = /* @__PURE__ */ new WeakMap();
function getHistogramResources(device) {
	let res = deviceResourceCache.get(device);
	if (!res) {
		const bindGroupLayout = device.createBindGroupLayout({ entries: [
			{
				binding: 0,
				visibility: GPUShaderStage.COMPUTE,
				texture: {
					sampleType: "float",
					viewDimension: "2d"
				}
			},
			{
				binding: 1,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage" }
			},
			{
				binding: 2,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage" }
			},
			{
				binding: 3,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage" }
			},
			{
				binding: 4,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage" }
			}
		] });
		const module = device.createShaderModule({
			label: "histogram.wgsl",
			code: HISTOGRAM_COMPUTE_SHADER
		});
		res = {
			pipeline: device.createComputePipeline({
				label: "HistogramPipeline",
				layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
				compute: {
					module,
					entryPoint: "main"
				}
			}),
			bindGroupLayout
		};
		deviceResourceCache.set(device, res);
	}
	return res;
}
const histogramCallbacks = /* @__PURE__ */ new Map();
const inflight = /* @__PURE__ */ new Set();
/**
* Records histogram compute + buffer copy commands into the provided encoder.
* The async readback fires after the queue processes the encoder's commands.
* This ensures the source texture data is valid when the compute pass reads it.
*/
function computeHistogramFromEncoder(device, encoder, srcTexture, nodeId) {
	if (!histogramCallbacks.get(nodeId)) return;
	if (inflight.has(nodeId)) return;
	inflight.add(nodeId);
	const { pipeline, bindGroupLayout } = getHistogramResources(device);
	const makeStorage = () => device.createBuffer({
		size: PER_CHAN_SIZE,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
	});
	const bufR = makeStorage();
	const bufG = makeStorage();
	const bufB = makeStorage();
	const bufLuma = makeStorage();
	encoder.clearBuffer(bufR);
	encoder.clearBuffer(bufG);
	encoder.clearBuffer(bufB);
	encoder.clearBuffer(bufLuma);
	const bindGroup = device.createBindGroup({
		layout: bindGroupLayout,
		entries: [
			{
				binding: 0,
				resource: srcTexture.createView()
			},
			{
				binding: 1,
				resource: { buffer: bufR }
			},
			{
				binding: 2,
				resource: { buffer: bufG }
			},
			{
				binding: 3,
				resource: { buffer: bufB }
			},
			{
				binding: 4,
				resource: { buffer: bufLuma }
			}
		]
	});
	const pass = encoder.beginComputePass({ label: "histogram-pass" });
	pass.setPipeline(pipeline);
	pass.setBindGroup(0, bindGroup);
	pass.dispatchWorkgroups(Math.ceil(srcTexture.width / 8), Math.ceil(srcTexture.height / 8));
	pass.end();
	const makeReadback = () => device.createBuffer({
		size: PER_CHAN_SIZE,
		usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
	});
	const rbR = makeReadback();
	const rbG = makeReadback();
	const rbB = makeReadback();
	const rbLuma = makeReadback();
	encoder.copyBufferToBuffer(bufR, 0, rbR, 0, PER_CHAN_SIZE);
	encoder.copyBufferToBuffer(bufG, 0, rbG, 0, PER_CHAN_SIZE);
	encoder.copyBufferToBuffer(bufB, 0, rbB, 0, PER_CHAN_SIZE);
	encoder.copyBufferToBuffer(bufLuma, 0, rbLuma, 0, PER_CHAN_SIZE);
	device.queue.onSubmittedWorkDone().then(() => {
		return Promise.all([
			rbR.mapAsync(GPUMapMode.READ),
			rbG.mapAsync(GPUMapMode.READ),
			rbB.mapAsync(GPUMapMode.READ),
			rbLuma.mapAsync(GPUMapMode.READ)
		]);
	}).then(() => {
		const r = new Uint32Array(rbR.getMappedRange().slice(0));
		const g = new Uint32Array(rbG.getMappedRange().slice(0));
		const b = new Uint32Array(rbB.getMappedRange().slice(0));
		const luma = new Uint32Array(rbLuma.getMappedRange().slice(0));
		rbR.unmap();
		rbG.unmap();
		rbB.unmap();
		rbLuma.unmap();
		rbR.destroy();
		rbG.destroy();
		rbB.destroy();
		rbLuma.destroy();
		bufR.destroy();
		bufG.destroy();
		bufB.destroy();
		bufLuma.destroy();
		inflight.delete(nodeId);
		const currentCb = histogramCallbacks.get(nodeId);
		if (currentCb) currentCb({
			r,
			g,
			b,
			luma
		});
	}).catch(() => {
		rbR.destroy();
		rbG.destroy();
		rbB.destroy();
		rbLuma.destroy();
		bufR.destroy();
		bufG.destroy();
		bufB.destroy();
		bufLuma.destroy();
		inflight.delete(nodeId);
	});
}

//#endregion
//#region ../../nodes/node-curves/dist/renderer.mjs
const LUT_SIZE = 1024;
const LUT_FORMAT = "rgba8unorm";
const LUT_BYTES_PER_ROW = LUT_SIZE * 4;
const CURVES_RGB_SHADER = `
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

@group(0) @binding(0) var t_lut : texture_2d<f32>;
@group(0) @binding(1) var s_lut : sampler;

@group(1) @binding(0) var t_src : texture_2d<f32>;
@group(1) @binding(1) var s_src : sampler;

@fragment fn fs(in: VSOut) -> @location(0) vec4<f32> {
	let src = textureSampleLevel(t_src, s_src, in.uv, 0.0);
	if (src.a < 1e-5) { return src; }

	let rgb = src.rgb / src.a;

	let N = f32(${LUT_SIZE});
	let uv_r = (rgb.r * (N - 1.0) + 0.5) / N;
	let uv_g = (rgb.g * (N - 1.0) + 0.5) / N;
	let uv_b = (rgb.b * (N - 1.0) + 0.5) / N;

	let r_graded = textureSampleLevel(t_lut, s_lut, vec2<f32>(uv_r, 0.5), 0.0).r;
	let g_graded = textureSampleLevel(t_lut, s_lut, vec2<f32>(uv_g, 0.5), 0.0).g;
	let b_graded = textureSampleLevel(t_lut, s_lut, vec2<f32>(uv_b, 0.5), 0.0).b;

	let graded = vec3<f32>(r_graded, g_graded, b_graded);
	return vec4<f32>(graded * src.a, src.a);
}
`;
const CURVES_HSL_SHADER = `
struct Uniforms {
	mode: u32,
	pad0: u32,
	pad1: u32,
	pad2: u32,
};

struct VSOut {
	@builtin(position) pos : vec4<f32>,
	@location(0) uv        : vec2<f32>,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(0) @binding(1) var t_lut      : texture_2d<f32>;
@group(0) @binding(2) var s_lut      : sampler;

@group(1) @binding(0) var t_src : texture_2d<f32>;
@group(1) @binding(1) var s_src : sampler;

@vertex fn vs(@builtin(vertex_index) vi: u32) -> VSOut {
	var pos = array<vec2<f32>, 4>(
		vec2<f32>(-1.0,  1.0), vec2<f32>(1.0,  1.0),
		vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0)
	);
	var uv = array<vec2<f32>, 4>(
		vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 0.0),
		vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 1.0)
	);
	return VSOut(vec4<f32>(pos[vi], 0.0, 1.0), uv[vi]);
}

fn rgb_to_hsl(rgb: vec3<f32>) -> vec3<f32> {
	let r = rgb.r; let g = rgb.g; let b = rgb.b;
	let cmax = max(r, max(g, b));
	let cmin = min(r, min(g, b));
	let delta = cmax - cmin;

	var h = 0.0;
	var s = 0.0;
	let l = (cmax + cmin) * 0.5;

	if (delta > 1e-5) {
		s = delta / (1.0 - abs(2.0 * l - 1.0));
		if (cmax == r) {
			h = ((g - b) / delta) % 6.0;
		} else if (cmax == g) {
			h = (b - r) / delta + 2.0;
		} else {
			h = (r - g) / delta + 4.0;
		}
		h = h / 6.0;
		if (h < 0.0) { h = h + 1.0; }
	}
	return vec3<f32>(h, s, l);
}

fn hsl_to_rgb(hsl: vec3<f32>) -> vec3<f32> {
	let h = hsl.x; let s = hsl.y; let l = hsl.z;
	let c = (1.0 - abs(2.0 * l - 1.0)) * s;
	let x = c * (1.0 - abs((h * 6.0) % 2.0 - 1.0));
	let m = l - c * 0.5;

	var rgb = vec3<f32>(0.0);
	let hi = u32(h * 6.0) % 6u;
	if (hi == 0u) { rgb = vec3<f32>(c, x, 0.0); }
	else if (hi == 1u) { rgb = vec3<f32>(x, c, 0.0); }
	else if (hi == 2u) { rgb = vec3<f32>(0.0, c, x); }
	else if (hi == 3u) { rgb = vec3<f32>(0.0, x, c); }
	else if (hi == 4u) { rgb = vec3<f32>(x, 0.0, c); }
	else { rgb = vec3<f32>(c, 0.0, x); }
	return rgb + vec3<f32>(m);
}

fn lut_sample(x: f32) -> f32 {
	let N = f32(${LUT_SIZE});
	let uv_x = (x * (N - 1.0) + 0.5) / N;
	return textureSampleLevel(t_lut, s_lut, vec2<f32>(uv_x, 0.5), 0.0).r;
}

@fragment fn fs(in: VSOut) -> @location(0) vec4<f32> {
	let src = textureSampleLevel(t_src, s_src, in.uv, 0.0);
	if (src.a < 1e-5) { return src; }

	let rgb = src.rgb / src.a;
	let hsl = rgb_to_hsl(rgb);

	var out_hsl = hsl;

	if (u.mode == 0u) {
		let adj = lut_sample(hsl.x);
		out_hsl.x = fract(hsl.x + (adj - 0.5) * 2.0);
	} else if (u.mode == 1u) {
		let adj = lut_sample(hsl.x);
		out_hsl.y = clamp(hsl.y * (adj * 2.0), 0.0, 1.0);
	} else if (u.mode == 2u) {
		let adj = lut_sample(hsl.z);
		out_hsl.y = clamp(hsl.y * (adj * 2.0), 0.0, 1.0);
	} else {
		let adj = lut_sample(hsl.y);
		out_hsl.y = clamp(adj, 0.0, 1.0);
	}

	let out_rgb = clamp(hsl_to_rgb(out_hsl), vec3<f32>(0.0), vec3<f32>(1.0));
	return vec4<f32>(out_rgb * src.a, src.a);
}
`;
const rgbResourceCache = /* @__PURE__ */ new WeakMap();
const hslResourceCache = /* @__PURE__ */ new WeakMap();
function getRgbResources(device, format) {
	let res = rgbResourceCache.get(device);
	if (!res) {
		const lutBGL = device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] });
		const srcBGL = device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] });
		const module = device.createShaderModule({
			label: "curves-rgb.wgsl",
			code: CURVES_RGB_SHADER
		});
		res = {
			pipeline: device.createRenderPipeline({
				label: "CurvesRgbPipeline",
				layout: device.createPipelineLayout({ bindGroupLayouts: [lutBGL, srcBGL] }),
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
			}),
			lutBindGroupLayout: lutBGL,
			srcBindGroupLayout: srcBGL
		};
		rgbResourceCache.set(device, res);
	}
	return res;
}
function getHslResources(device, format) {
	let res = hslResourceCache.get(device);
	if (!res) {
		const uniformLayout = device.createBindGroupLayout({ entries: [
			{
				binding: 0,
				visibility: GPUShaderStage.FRAGMENT,
				buffer: { type: "uniform" }
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
		] });
		const srcBGL = device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] });
		const module = device.createShaderModule({
			label: "curves-hsl.wgsl",
			code: CURVES_HSL_SHADER
		});
		res = {
			pipeline: device.createRenderPipeline({
				label: "CurvesHslPipeline",
				layout: device.createPipelineLayout({ bindGroupLayouts: [uniformLayout, srcBGL] }),
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
			}),
			uniformLayout,
			srcBindGroupLayout: srcBGL
		};
		hslResourceCache.set(device, res);
	}
	return res;
}
const deviceTextureCache = /* @__PURE__ */ new WeakMap();
function buildRgbLut(device, op) {
	const masterSpline = solveMonotonicSpline(op.master || [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]);
	const redSpline = solveMonotonicSpline(op.red || [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]);
	const greenSpline = solveMonotonicSpline(op.green || [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]);
	const blueSpline = solveMonotonicSpline(op.blue || [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]);
	const lutData = new Uint8Array(LUT_SIZE * 4);
	for (let i = 0; i < LUT_SIZE; i++) {
		const masterVal = masterSpline(i / (LUT_SIZE - 1));
		const r = Math.max(0, Math.min(1, redSpline(masterVal)));
		const g = Math.max(0, Math.min(1, greenSpline(masterVal)));
		const b = Math.max(0, Math.min(1, blueSpline(masterVal)));
		lutData[i * 4 + 0] = Math.round(r * 255);
		lutData[i * 4 + 1] = Math.round(g * 255);
		lutData[i * 4 + 2] = Math.round(b * 255);
		lutData[i * 4 + 3] = 255;
	}
	const texture = device.createTexture({
		size: [
			LUT_SIZE,
			1,
			1
		],
		dimension: "2d",
		format: LUT_FORMAT,
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
	});
	device.queue.writeTexture({ texture }, lutData, { bytesPerRow: LUT_BYTES_PER_ROW }, [
		LUT_SIZE,
		1,
		1
	]);
	return texture;
}
function buildHslLut(device, points) {
	const spline = solveMonotonicSpline(points);
	const lutData = new Uint8Array(LUT_SIZE * 4);
	for (let i = 0; i < LUT_SIZE; i++) {
		const u = i / (LUT_SIZE - 1);
		const val = Math.round(Math.max(0, Math.min(1, spline(u))) * 255);
		lutData[i * 4 + 0] = val;
		lutData[i * 4 + 1] = val;
		lutData[i * 4 + 2] = val;
		lutData[i * 4 + 3] = 255;
	}
	const texture = device.createTexture({
		size: [
			LUT_SIZE,
			1,
			1
		],
		dimension: "2d",
		format: LUT_FORMAT,
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
	});
	device.queue.writeTexture({ texture }, lutData, { bytesPerRow: LUT_BYTES_PER_ROW }, [
		LUT_SIZE,
		1,
		1
	]);
	return texture;
}
const HSL_MODE_MAP = {
	"hue-vs-hue": 0,
	"hue-vs-sat": 1,
	"lum-vs-sat": 2,
	"sat-vs-sat": 3
};
const HSL_CURVE_KEY_MAP = {
	"hue-vs-hue": "hueVsHue",
	"hue-vs-sat": "hueVsSat",
	"lum-vs-sat": "lumVsSat",
	"sat-vs-sat": "satVsSat"
};
const CurvesWebGPURenderer = async (args) => {
	const { ctx, encoder, pass, targetView, targetTexture, targetWidth, targetHeight, props, drawChild } = args;
	const op = props.virtualMedia?.operation;
	if (op?.op !== "Curves" || !props.virtualMedia?.children?.[0]) return;
	pass.end();
	const childMedia = props.virtualMedia.children[0];
	const width = targetWidth;
	const height = targetHeight;
	const nodeId = op.nodeId || "curves_fallback";
	const curveType = op.curveType || "rgb";
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
	let texMap = deviceTextureCache.get(ctx.device);
	if (!texMap) {
		texMap = /* @__PURE__ */ new Map();
		deviceTextureCache.set(ctx.device, texMap);
	}
	const sampler = ctx.renderer.samplerCache.getSampler(ctx.device);
	const outTex = ctx.renderer.getTemporaryTexture(width, height, [
		tmpTex,
		targetTexture,
		...props.excludeTextures || []
	]);
	if (curveType === "rgb") {
		const configKey = JSON.stringify({
			curveType,
			master: op.master,
			red: op.red,
			green: op.green,
			blue: op.blue
		});
		let cachedEntry = texMap.get(nodeId);
		if (!cachedEntry || cachedEntry.configKey !== configKey) {
			cachedEntry?.texture.destroy();
			cachedEntry = {
				texture: buildRgbLut(ctx.device, op),
				configKey
			};
			texMap.set(nodeId, cachedEntry);
		}
		const { pipeline, lutBindGroupLayout, srcBindGroupLayout } = getRgbResources(ctx.device, ctx.renderer.format);
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
			layout: lutBindGroupLayout,
			entries: [{
				binding: 0,
				resource: cachedEntry.texture.createView()
			}, {
				binding: 1,
				resource: sampler
			}]
		}));
		renderPass.setBindGroup(1, ctx.renderer.bindGroupCache.getBindGroup(ctx.device, srcBindGroupLayout, tmpTex, sampler));
		renderPass.draw(4);
		renderPass.end();
	} else {
		const hslPoints = op[HSL_CURVE_KEY_MAP[curveType]] || [{
			x: 0,
			y: .5
		}, {
			x: 1,
			y: .5
		}];
		const configKey = JSON.stringify({
			curveType,
			points: hslPoints
		});
		let cachedEntry = texMap.get(`${nodeId}_hsl`);
		if (!cachedEntry || cachedEntry.configKey !== configKey) {
			cachedEntry?.texture.destroy();
			cachedEntry = {
				texture: buildHslLut(ctx.device, hslPoints),
				configKey
			};
			texMap.set(`${nodeId}_hsl`, cachedEntry);
		}
		const uniformData = new Uint32Array([
			HSL_MODE_MAP[curveType] ?? 0,
			0,
			0,
			0
		]);
		const uniformBuffer = ctx.renderer.getTemporaryBuffer(uniformData);
		const { pipeline, uniformLayout, srcBindGroupLayout } = getHslResources(ctx.device, ctx.renderer.format);
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
			layout: uniformLayout,
			entries: [
				{
					binding: 0,
					resource: { buffer: uniformBuffer }
				},
				{
					binding: 1,
					resource: cachedEntry.texture.createView()
				},
				{
					binding: 2,
					resource: sampler
				}
			]
		}));
		renderPass.setBindGroup(1, ctx.renderer.bindGroupCache.getBindGroup(ctx.device, srcBindGroupLayout, tmpTex, sampler));
		renderPass.draw(4);
		renderPass.end();
	}
	computeHistogramFromEncoder(ctx.device, encoder, outTex, nodeId);
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
	}, { opacity: props.opacity ?? 1 });
	args.pass = finalPass;
};
const rendererNode = defineRenderer({ WebGPURenderer: CurvesWebGPURenderer });
var renderers_default = rendererNode;

//#endregion
export { renderers_default as default };