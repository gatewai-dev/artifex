import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-extract-frame/dist/renderer.mjs
/**
* WebGPU renderer for the ExtractFrame operation.
*
* Renders the child media (Video/Lottie/GIF) at a specific frame number,
* producing a static image output. The frame number is stored in the operation
* and the child is rendered at the corresponding timestamp.
*/
const ExtractFrameWebGPURenderer = async (args) => {
	const { ctx, props, drawChild, targetView, targetTexture, targetWidth, targetHeight, encoder } = args;
	const { virtualMedia, opacity = 1 } = props;
	const op = virtualMedia?.operation;
	if (!op || op.op !== "ExtractFrame") return;
	const childMedia = virtualMedia.children?.[0];
	if (!childMedia) return;
	const frame = op.frame ?? 0;
	const childMeta = childMedia.metadata;
	const childFps = childMeta?.fps ?? 24;
	const timestampSec = frame / childFps;
	args.pass.end();
	const sourceWidth = childMeta?.width ?? props.containerWidth ?? targetWidth;
	const sourceHeight = childMeta?.height ?? props.containerHeight ?? targetHeight;
	const containerWidth = props.containerWidth ?? ctx.surface.width;
	const containerHeight = props.containerHeight ?? ctx.surface.height;
	const childTex = ctx.renderer.getTemporaryTexture(sourceWidth, sourceHeight, [...props.excludeTextures || [], targetTexture]);
	const childView = childTex.createView();
	ctx.renderer.beginFrame(encoder, childView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, sourceWidth, sourceHeight, "clear").end();
	ctx.renderer.pushScissor({
		x: 0,
		y: 0,
		width: sourceWidth,
		height: sourceHeight
	});
	ctx.renderer.pushIdentity();
	await drawChild(childMedia, {
		...props,
		containerWidth: sourceWidth,
		containerHeight: sourceHeight,
		frame,
		fps: childFps,
		timestampSec,
		forceWait: true
	}, childView, childTex, sourceWidth, sourceHeight);
	ctx.renderer.popTransform();
	ctx.renderer.popScissor();
	const outPass = ctx.renderer.beginFrame(encoder, targetView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, targetWidth, targetHeight, "load");
	ctx.renderer.drawTexture(outPass, childTex, {
		x: 0,
		y: 0,
		width: containerWidth,
		height: containerHeight
	}, { opacity });
	args.pass = outPass;
};
var renderers_default = defineRenderer({ WebGPURenderer: ExtractFrameWebGPURenderer });

//#endregion
export { renderers_default as default };