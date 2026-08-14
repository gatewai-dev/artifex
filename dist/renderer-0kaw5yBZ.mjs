import "./dist-DtlkxQom.mjs";
import { T as parseColor } from "./dist-DnO6zPQ-.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-paint/dist/renderer.mjs
const PaintWebGPURenderer = async (args) => {
	const { ctx, pass, targetView, targetTexture, targetWidth, targetHeight, encoder, props, drawChild } = args;
	const { virtualMedia } = props;
	if (virtualMedia.operation?.op !== "Paint") return;
	const childMedia = virtualMedia?.children?.[0];
	const containerW = props.containerWidth ?? childMedia?.metadata?.width ?? targetWidth;
	const containerH = props.containerHeight ?? childMedia?.metadata?.height ?? targetHeight;
	const config = virtualMedia.operation;
	const isMaskMode = config.mode === "mask";
	const strokes = config.strokes ?? [];
	pass.end();
	ctx.renderer.pushIdentity();
	const baseTex = ctx.renderer.getTemporaryTexture(containerW, containerH, [...props.excludeTextures || [], targetTexture]);
	const baseView = baseTex.createView();
	if (isMaskMode) ctx.renderer.beginFrame(encoder, baseView, {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	}, containerW, containerH, "clear").end();
	else if (childMedia) await drawChild(childMedia, props, baseView, baseTex, containerW, containerH);
	else {
		const basePass = ctx.renderer.beginFrame(encoder, baseView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, containerW, containerH, "clear");
		if (config.backgroundColor) ctx.renderer.drawRect(basePass, {
			x: 0,
			y: 0,
			width: containerW,
			height: containerH
		}, config.backgroundColor);
		basePass.end();
	}
	let finalTex = baseTex;
	if (strokes.length > 0) {
		const origW = childMedia?.metadata?.width ?? containerW;
		const origH = childMedia?.metadata?.height ?? containerH;
		const scaleX = origW > 0 ? containerW / origW : 1;
		const scaleY = origH > 0 ? containerH / origH : 1;
		let scalePushed = false;
		if (scaleX !== 1 || scaleY !== 1) {
			ctx.renderer.pushTransform(new DOMMatrix().scale(scaleX, scaleY));
			scalePushed = true;
		}
		const paintTex = ctx.renderer.getTemporaryTexture(containerW, containerH, [
			baseTex,
			targetTexture,
			...props.excludeTextures || []
		]);
		const paintView = paintTex.createView();
		ctx.renderer.beginFrame(encoder, paintView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, containerW, containerH, "clear").end();
		const allStrokes = strokes;
		let currentLayer = paintTex;
		let currentPass = null;
		for (const stroke of allStrokes) if (stroke.tool === "brush") {
			if (!currentPass) currentPass = ctx.renderer.beginFrame(encoder, currentLayer.createView(), {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, containerW, containerH, "load");
			const parsedColor = parseColor(stroke.color);
			const drawColor = isMaskMode ? {
				r: parsedColor.a,
				g: parsedColor.a,
				b: parsedColor.a,
				a: parsedColor.a
			} : {
				r: parsedColor.r * parsedColor.a,
				g: parsedColor.g * parsedColor.a,
				b: parsedColor.b * parsedColor.a,
				a: parsedColor.a
			};
			ctx.renderer.drawPath(currentPass, stroke.path, drawColor, stroke.size, {
				opacity: stroke.opacity ?? 1,
				blendMode: "max"
			});
		} else if (stroke.tool === "eraser") {
			if (currentPass) {
				currentPass.end();
				currentPass = null;
			}
			const maskTex = ctx.renderer.getTemporaryTexture(containerW, containerH, [
				baseTex,
				paintTex,
				targetTexture,
				...props.excludeTextures || []
			]);
			const maskView = maskTex.createView();
			const maskPass = ctx.renderer.beginFrame(encoder, maskView, {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, containerW, containerH, "clear");
			ctx.renderer.drawPath(maskPass, stroke.path, "#ffffff", stroke.size, { blendMode: "max" });
			maskPass.end();
			currentLayer = ctx.renderer.composite(encoder, currentLayer, maskTex, "mask-out", [
				baseTex,
				paintTex,
				targetTexture,
				...props.excludeTextures || []
			]);
		}
		if (currentPass) currentPass.end();
		finalTex = ctx.renderer.composite(encoder, baseTex, currentLayer, "normal", [
			baseTex,
			currentLayer,
			targetTexture,
			...props.excludeTextures || []
		]);
		if (scalePushed) ctx.renderer.popTransform();
	}
	ctx.renderer.popTransform();
	const finalPass = ctx.renderer.beginFrame(encoder, targetView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, targetWidth, targetHeight, "load");
	ctx.renderer.drawTexture(finalPass, finalTex, {
		x: 0,
		y: 0,
		width: containerW,
		height: containerH
	});
	args.pass = finalPass;
};
var renderers_default = defineRenderer({ WebGPURenderer: PaintWebGPURenderer });

//#endregion
export { renderers_default as default };