import "./dist-Dsv4ud6r.mjs";
import { g as drawSvgNode } from "./dist-rOgtcmwL.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";
import { n as generateShapeSvgDataUrl } from "./svg-generator-D6aPz8b4-vuVUfA54.mjs";

//#region ../../nodes/node-shape-generator/dist/renderer.mjs
const ShapeGeneratorWebGPURenderer = async (args) => {
	const { ctx, pass, props, targetWidth, targetHeight } = args;
	const op = props.virtualMedia?.operation;
	if (!op || op.op !== "ShapeGenerator" && op.op !== "source") return;
	const svgDataUrl = generateShapeSvgDataUrl(op);
	const width = targetWidth > 0 ? targetWidth : op.width ?? 500;
	const height = targetHeight > 0 ? targetHeight : op.height ?? 500;
	const isHeadless = Boolean(ctx.isHeadless || typeof window === "undefined");
	await drawSvgNode(ctx, pass, {
		src: svgDataUrl,
		dstRect: {
			x: 0,
			y: 0,
			width,
			height
		},
		opacity: op.opacity ?? 1,
		isHeadless
	});
};
var renderers_default = defineRenderer({ WebGPURenderer: ShapeGeneratorWebGPURenderer });

//#endregion
export { renderers_default as default };