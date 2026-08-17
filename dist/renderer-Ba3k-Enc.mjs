import "./dist-BWJGEiuE.mjs";
import { l as colorMatrixWgsl } from "./dist-9NtvXM2x.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-levels/dist/renderer.mjs
const deviceResourceCache = /* @__PURE__ */ new WeakMap();
const colorMatrixData = new Float32Array(20);
function getColorMatrixResources(device, format) {
	let res = deviceResourceCache.get(device);
	if (!res) {
		const colorMatrixUniformLayout = device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			buffer: { type: "uniform" }
		}] });
		const singleTextureLayout = device.createBindGroupLayout({ entries: [{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			texture: { sampleType: "float" }
		}, {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: { type: "filtering" }
		}] });
		const colorMatrixModule = device.createShaderModule({
			label: "color-matrix.wgsl",
			code: colorMatrixWgsl
		});
		res = {
			colorMatrixPipeline: device.createRenderPipeline({
				label: "ColorMatrixPipeline",
				layout: device.createPipelineLayout({ bindGroupLayouts: [colorMatrixUniformLayout, singleTextureLayout] }),
				vertex: {
					module: colorMatrixModule,
					entryPoint: "vs"
				},
				fragment: {
					module: colorMatrixModule,
					entryPoint: "fs",
					targets: [{ format }]
				},
				primitive: { topology: "triangle-strip" }
			}),
			colorMatrixUniformLayout,
			singleTextureLayout
		};
		deviceResourceCache.set(device, res);
	}
	return res;
}
function getTransform(ch) {
	const inRange = Math.max(ch.inWhite - ch.inBlack, 1e-5);
	const scale = (ch.outWhite - ch.outBlack) / inRange;
	return {
		scale,
		bias: ch.outBlack - ch.inBlack * scale
	};
}
const LevelsWebGPURenderer = async (args) => {
	const { ctx, encoder, pass, targetView, targetTexture, targetWidth, targetHeight, props, drawChild } = args;
	const op = props.virtualMedia?.operation;
	if (op?.op !== "Levels" || !props.virtualMedia?.children?.[0]) return;
	pass.end();
	const childMedia = props.virtualMedia.children[0];
	const m = getTransform(op.master);
	const r = getTransform(op.red);
	const g = getTransform(op.green);
	const b = getTransform(op.blue);
	const matrix = [
		r.scale * m.scale,
		0,
		0,
		0,
		r.bias * m.scale + m.bias,
		0,
		g.scale * m.scale,
		0,
		0,
		g.bias * m.scale + m.bias,
		0,
		0,
		b.scale * m.scale,
		0,
		b.bias * m.scale + m.bias,
		0,
		0,
		0,
		1,
		0
	];
	const width = targetWidth;
	const height = targetHeight;
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
	const { colorMatrixPipeline: pipeline, colorMatrixUniformLayout: uLayout, singleTextureLayout: tLayout } = getColorMatrixResources(ctx.device, ctx.renderer.format);
	const sampler = ctx.renderer.samplerCache.getSampler(ctx.device);
	colorMatrixData[0] = matrix[0];
	colorMatrixData[1] = matrix[1];
	colorMatrixData[2] = matrix[2];
	colorMatrixData[3] = matrix[3];
	colorMatrixData[4] = matrix[5];
	colorMatrixData[5] = matrix[6];
	colorMatrixData[6] = matrix[7];
	colorMatrixData[7] = matrix[8];
	colorMatrixData[8] = matrix[10];
	colorMatrixData[9] = matrix[11];
	colorMatrixData[10] = matrix[12];
	colorMatrixData[11] = matrix[13];
	colorMatrixData[12] = matrix[15];
	colorMatrixData[13] = matrix[16];
	colorMatrixData[14] = matrix[17];
	colorMatrixData[15] = matrix[18];
	colorMatrixData[16] = matrix[4];
	colorMatrixData[17] = matrix[9];
	colorMatrixData[18] = matrix[14];
	colorMatrixData[19] = matrix[19];
	const buffer = ctx.renderer.getTemporaryBuffer(colorMatrixData);
	const outTex = ctx.renderer.getTemporaryTexture(width, height, [
		tmpTex,
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
			resource: { buffer }
		}]
	}));
	renderPass.setBindGroup(1, ctx.renderer.bindGroupCache.getBindGroup(ctx.device, tLayout, tmpTex, sampler));
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
	}, { opacity: props.opacity ?? 1 });
	args.pass = finalPass;
};
var renderers_default = defineRenderer({ WebGPURenderer: LevelsWebGPURenderer });

//#endregion
export { renderers_default as default };