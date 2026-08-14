import { C as getActiveMediaMetadata, n as DEFAULT_DURATION_MS } from "./dist-DBCHxcBj.mjs";
import { o as resolveMediaSourceUrl } from "./dist-DtlkxQom.mjs";
import { C as measureMaxCaptionHeight, T as parseColor, k as srtLoader } from "./dist-DnO6zPQ-.mjs";
import { t as audioRegistry } from "./browser-G8bOolNE.mjs";
import { a as measureText } from "./dist-DG-TiLPB.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";
import { i as collectNodeOps, n as compileTimeline, o as computeLayout, s as initLayout, t as compileLayerTimeline } from "./compiler-Dyinia12-B-cP_UDi.mjs";

//#region ../../nodes/node-compositor/dist/transform-CbYtd6wk.mjs
function translate(tx, ty) {
	return {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		e: tx,
		f: ty
	};
}
/** Rotation in degrees (screen convention: positive = clockwise, y-down). */
function rotate(degrees) {
	const rad = degrees * Math.PI / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	return {
		a: cos,
		b: sin,
		c: -sin,
		d: cos,
		e: 0,
		f: 0
	};
}
function scale(sx, sy = sx) {
	return {
		a: sx,
		b: 0,
		c: 0,
		d: sy,
		e: 0,
		f: 0
	};
}
/** m1 ∘ m2 (m2 applied first — matches DOMMatrix.multiply ordering). */
function multiply(m1, m2) {
	return {
		a: m1.a * m2.a + m1.c * m2.b,
		b: m1.b * m2.a + m1.d * m2.b,
		c: m1.a * m2.c + m1.c * m2.d,
		d: m1.b * m2.c + m1.d * m2.d,
		e: m1.a * m2.e + m1.c * m2.f + m1.e,
		f: m1.b * m2.e + m1.d * m2.f + m1.f
	};
}
/** Materialize into a DOMMatrix for the renderer's transform stack. */
function toDOMMatrix(m) {
	return new DOMMatrix([
		m.a,
		m.b,
		m.c,
		m.d,
		m.e,
		m.f
	]);
}
/**
* Layer transform matrix with anchor-aware pivot semantics.
*
* The composition node box is drawn at (0, 0, width, height) in local space
* and positioned at `x`/`y`. `anchorX`/`anchorY` (0–1 fractions of the box)
* select the pivot point that scale/rotation are applied AROUND:
*
*   position → pivot → rotate → scale → un-pivot
*
* With the default center anchor (0.5, 0.5) a `scale: 2` animation grows the
* node symmetrically from its middle instead of from its top-left corner.
* The pivot point itself is invariant under rotation and scale.
*/
function buildLayerMatrix(params) {
	const ax = params.anchorX ?? .5;
	const ay = params.anchorY ?? .5;
	const px = ax * params.width;
	const py = ay * params.height;
	return multiply(translate(params.x, params.y), multiply(translate(px, py), multiply(rotate(params.rotation), multiply(scale(params.scale), translate(-px, -py)))));
}

//#endregion
//#region ../../nodes/node-compositor/dist/renderer.mjs
/**
* Which container kinds paint their own background.
*
* flex/block/box all accept an optional `background` in the program schema.
* The renderer must draw the rounded background pass for ALL of them (the old
* code only painted `box`, so flex/block backgrounds were silently dropped and
* their "transparent-optimized" fast path skipped the fill entirely).
*/
function shouldPaintContainerBackground(kind, background) {
	if (!background) return false;
	return kind === "flex" || kind === "block" || kind === "box";
}
const CompositorWebGPURenderer = async (args) => {
	const { ctx, pass, targetView, targetTexture, targetWidth, targetHeight, encoder, props, drawChild } = args;
	const { virtualMedia, fps, frame } = props;
	const op = virtualMedia.operation;
	if (!op) return;
	pass.end();
	if (op.op === "CompositorLayer") {
		console.warn("CompositorWebGPURenderer called directly with legacy CompositorLayer operation. This is a bug.");
		args.pass = ctx.renderer.beginFrame(encoder, targetView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, targetWidth, targetHeight, "load");
		return;
	}
	if (op.op === "Compositor") {
		const vop = op;
		const containerWidth = props.containerWidth ?? ctx.surface.width;
		const containerHeight = props.containerHeight ?? ctx.surface.height;
		const nativeWidth = vop.width ?? containerWidth;
		const nativeHeight = vop.height ?? containerHeight;
		const opacity = typeof vop.opacity === "number" ? vop.opacity : 1;
		const inheritedSeekOffset = props.inheritedSeekOffset ?? 0;
		const shiftedFrame = frame != null && fps != null ? frame + Math.round(inheritedSeekOffset * fps) : frame ?? 0;
		const compTex = ctx.renderer.getTemporaryTexture(nativeWidth, nativeHeight, [...props.excludeTextures || [], targetTexture]);
		const compView = compTex.createView();
		const composeDuration = virtualMedia?.metadata?.durationMs ?? DEFAULT_DURATION_MS;
		const durationSec = composeDuration / 1e3;
		const { tl, targetsById } = compileTimeline(props.renderId, virtualMedia, {
			fps: fps ?? 24,
			durationSec
		});
		tl.seek(shiftedFrame / (fps ?? 24));
		const clearColor = parseColor(vop.backgroundColor);
		ctx.renderer.beginFrame(encoder, compView, clearColor, nativeWidth, nativeHeight, "clear").end();
		let currentCompTex = compTex;
		ctx.renderer.pushScissor({
			x: 0,
			y: 0,
			width: nativeWidth,
			height: nativeHeight
		});
		ctx.renderer.pushIdentity();
		await initLayout();
		const mediaDims = /* @__PURE__ */ new Map();
		for (const vm of collectNodeOps(virtualMedia.children)) {
			const lop = vm.operation;
			if (lop.kind === "media") {
				const meta = getActiveMediaMetadata(vm.children?.[0]);
				if (meta?.width && meta?.height) mediaDims.set(lop.id, {
					width: meta.width,
					height: meta.height
				});
				else if (lop.dataType === "Caption" || (vm.children?.[0]?.operation)?.dataType === "Caption" || (vm.children?.[0]?.operation)?.srtText !== void 0) {
					const lopWidth = targetsById[lop.id]?.width ?? lop.width;
					const autoWidth = typeof lopWidth === "number" ? lopWidth : Math.round(nativeWidth * .8);
					const lopHeight = targetsById[lop.id]?.height ?? lop.height;
					let autoHeight = typeof lopHeight === "number" ? lopHeight : 160;
					const contentVM = vm.children?.[0];
					const src = resolveMediaSourceUrl(contentVM) ?? (contentVM?.operation)?.url ?? (contentVM?.operation)?.src ?? (contentVM?.operation)?.srtText ?? lop.src ?? lop.url;
					if (typeof lopHeight !== "number" && src) try {
						const captions = await srtLoader.load(src);
						if (captions && captions.length > 0) autoHeight = measureMaxCaptionHeight(captions, lop, autoWidth);
					} catch {}
					mediaDims.set(lop.id, {
						width: autoWidth,
						height: autoHeight
					});
				}
			}
		}
		const frameResolveNode = (vm) => {
			const lop = vm?.operation ?? {};
			const target = targetsById[lop.id];
			const pick = (k) => target && target[k] !== void 0 ? target[k] : lop[k];
			const node = {
				...lop,
				width: pick("width"),
				height: pick("height"),
				gap: pick("gap"),
				padding: pick("padding"),
				fontSize: pick("fontSize")
			};
			node.children = (vm?.children ?? []).map(frameResolveNode);
			if (!node.children.length) node.children = void 0;
			return node;
		};
		const { rects } = await computeLayout({
			layout: (virtualMedia.children ?? []).map(frameResolveNode),
			viewport: {
				width: nativeWidth,
				height: nativeHeight
			},
			measure: (node, constraintWidth) => {
				if (node.kind === "text") {
					const textStyle = {
						fontSize: node.fontSize ?? 48,
						fontWeight: node.fontWeight,
						fontFamily: node.fontFamily,
						letterSpacing: node.letterSpacing,
						lineHeight: node.lineHeight,
						padding: node.padding
					};
					if (constraintWidth !== void 0) {
						const isAuto = typeof node.width !== "number";
						const wrapped$1 = measureText(node.text ?? "", {
							...textStyle,
							width: isAuto ? void 0 : constraintWidth,
							keepNaturalWidth: true
						});
						return {
							width: isAuto ? Math.ceil(wrapped$1.width) : Math.min(constraintWidth, Math.ceil(wrapped$1.width)),
							height: Math.ceil(wrapped$1.height)
						};
					}
					const natural = measureText(node.text ?? "", textStyle);
					if (typeof node.width !== "number") return {
						width: Math.ceil(natural.width),
						height: Math.ceil(natural.height)
					};
					const wrapped = measureText(node.text ?? "", {
						...textStyle,
						width: node.width
					});
					return {
						width: Math.ceil(wrapped.width),
						height: Math.ceil(wrapped.height)
					};
				}
				if (node.kind === "media") return mediaDims.get(node.id) ?? null;
				return null;
			}
		});
		let nodeIndex = 0;
		const renderNodeTree = async (vms, initialTex, initialView, excludes, accumulatedOpacity = 1, parentMatrix = new DOMMatrix(), parentRect = null) => {
			const sorted = [...vms].sort((a, b) => {
				return (a.operation?.zIndex ?? 0) - (b.operation?.zIndex ?? 0);
			});
			let activeTex = initialTex;
			let activeView = initialView;
			let activeExcludes = excludes;
			for (const child of sorted) {
				const lop = child.operation;
				if (lop.op !== "CompositorLayer") {
					await drawChild(child, {
						containerWidth: nativeWidth,
						containerHeight: nativeHeight,
						renderId: `${props.renderId}-c${nodeIndex}-${lop.op}`,
						fps,
						isVideoMode: props.isVideoMode,
						frame: shiftedFrame
					}, activeView, activeTex, nativeWidth, nativeHeight);
					continue;
				}
				nodeIndex += 1;
				const res = await renderLayerVM(child, nodeIndex, activeTex, activeView, activeExcludes, accumulatedOpacity, parentMatrix, parentRect);
				if (res) {
					if (res.finalTex !== activeTex) activeExcludes = [...activeExcludes, res.finalTex];
					activeTex = res.finalTex;
					activeView = res.finalView;
				}
			}
			return {
				finalTex: activeTex,
				finalView: activeView
			};
		};
		const renderLayerVM = async (nodeVM, i, destTex, destView, excludes, accumulatedOpacity, parentMatrix, parentRect) => {
			const lop = nodeVM.operation;
			const targetId = lop.id || lop.inputHandleId;
			const target = targetId ? targetsById[targetId] : void 0;
			if (target?.hidden || lop.hidden) return;
			const kind = lop.kind;
			const isContainer = kind === "flex" || kind === "block" || kind === "box";
			if (props.isVideoMode && lop.durationFrames !== void 0) {
				const startFrame = lop.startFrame ?? 0;
				if (shiftedFrame < startFrame || shiftedFrame >= startFrame + lop.durationFrames) return;
			}
			const rect = rects[lop.id];
			if (!rect) {
				if (isContainer) return await renderNodeTree(nodeVM.children ?? [], destTex, destView, excludes, accumulatedOpacity, parentMatrix, parentRect);
				return;
			}
			const baseX = lop.x ?? 0;
			const baseY = lop.y ?? 0;
			const sampledX = target?.x ?? baseX;
			const sampledY = target?.y ?? baseY;
			let localX = 0;
			let localY = 0;
			if (parentRect) {
				const localLayoutX = rect.x - parentRect.x;
				const localLayoutY = rect.y - parentRect.y;
				localX = localLayoutX + (sampledX - baseX);
				localY = localLayoutY + (sampledY - baseY);
			} else {
				localX = rect.x + (sampledX - baseX);
				localY = rect.y + (sampledY - baseY);
			}
			const scale$1 = target?.scale ?? lop.scale ?? 1;
			const rotation = target?.rotation ?? lop.rotation ?? 0;
			const layerOpacity = (target?.opacity ?? lop.opacity ?? 1) * accumulatedOpacity;
			const layerW = rect.width;
			const layerH = rect.height;
			const localMatrix = toDOMMatrix(buildLayerMatrix({
				x: localX,
				y: localY,
				width: layerW,
				height: layerH,
				rotation,
				scale: scale$1,
				anchorX: lop.anchorX ?? .5,
				anchorY: lop.anchorY ?? .5
			}));
			const layerMatrix = parentMatrix.multiply(localMatrix);
			const blendMode = lop.blendMode || "normal";
			let activeTex = destTex;
			let activeView = destView;
			if (isContainer) {
				if ((kind === "flex" || kind === "block") && !shouldPaintContainerBackground(kind, lop.background) && layerOpacity === 1 && blendMode === "normal" && !lop.borderWidth && !lop.borderColor) return await renderNodeTree(nodeVM.children ?? [], activeTex, activeView, excludes, accumulatedOpacity, layerMatrix, rect);
				const groupExcludes = [
					activeTex,
					targetTexture,
					...excludes
				];
				const groupTex = ctx.renderer.getTemporaryTexture(nativeWidth, nativeHeight, groupExcludes);
				const groupView = groupTex.createView();
				ctx.renderer.beginFrame(encoder, groupView, {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}, nativeWidth, nativeHeight, "clear").end();
				const br$1 = Math.min(lop.borderRadius ?? lop.strokeRadius ?? 0, layerW / 2, layerH / 2);
				if (shouldPaintContainerBackground(kind, lop.background)) {
					const bgPass = ctx.renderer.beginFrame(encoder, groupView, {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					}, nativeWidth, nativeHeight, "load");
					ctx.renderer.pushTransform(layerMatrix);
					ctx.renderer.drawRect(bgPass, {
						x: 0,
						y: 0,
						width: layerW,
						height: layerH
					}, lop.background, br$1, { opacity: layerOpacity });
					ctx.renderer.popTransform();
					bgPass.end();
				}
				let activeGroupTex = groupTex;
				let activeGroupView = groupView;
				if (nodeVM.children && nodeVM.children.length > 0) {
					const res = await renderNodeTree(nodeVM.children, groupTex, groupView, [groupTex, ...groupExcludes], layerOpacity, layerMatrix, rect);
					activeGroupTex = res.finalTex;
					activeGroupView = res.finalView;
				}
				const borderResult$1 = lop.borderWidth !== void 0 && lop.borderColor ? createBorderTexture(ctx, encoder, layerW, layerH, br$1, lop.borderWidth, lop.borderColor, lop.strokeAlign ?? "inside", [activeGroupTex, ...groupExcludes]) : null;
				if (borderResult$1) {
					const borderPass = ctx.renderer.beginFrame(encoder, activeGroupView, {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					}, nativeWidth, nativeHeight, "load");
					ctx.renderer.pushTransform(layerMatrix);
					ctx.renderer.drawTexture(borderPass, borderResult$1.borderTex, {
						x: borderResult$1.ox,
						y: borderResult$1.oy,
						width: borderResult$1.ow,
						height: borderResult$1.oh
					}, { opacity: layerOpacity });
					ctx.renderer.popTransform();
					borderPass.end();
				}
				const compositeExcludes = [
					activeTex,
					targetTexture,
					...excludes
				];
				if (borderResult$1) compositeExcludes.push(borderResult$1.borderTex);
				activeTex = ctx.renderer.composite(encoder, activeTex, activeGroupTex, blendMode, compositeExcludes);
				activeView = activeTex.createView();
				return {
					finalTex: activeTex,
					finalView: activeView
				};
			}
			if (!(layerW > 0 && layerH > 0)) return {
				finalTex: activeTex,
				finalView: activeView
			};
			const br = Math.min(lop.borderRadius ?? lop.strokeRadius ?? 0, layerW / 2, layerH / 2);
			const texW = Math.ceil(layerW);
			const texH = Math.ceil(layerH);
			const localTex = ctx.renderer.getTemporaryTexture(texW, texH, [
				activeTex,
				targetTexture,
				...excludes
			]);
			const localView = localTex.createView();
			ctx.renderer.beginFrame(encoder, localView, {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, texW, texH, "clear").end();
			let content;
			if (kind === "media") content = nodeVM.children?.[0];
			else if (kind === "text") {
				const fullText = lop.text ?? "";
				let displayText = fullText;
				const textTrack = lop.animation?.tracks?.find((t) => t.prop === "text");
				if ((textTrack !== void 0 || typeof target?.text === "number") && fullText.length > 0) {
					const progress = typeof target?.text === "number" ? Math.max(0, Math.min(1, target.text)) : 1;
					if (progress >= 1) displayText = fullText;
					else if (progress <= 0) displayText = "";
					else {
						const presetType = textTrack?.keyframes?.find((k) => k.presetType)?.presetType ?? "typewriter";
						if (presetType === "word-reveal" || presetType === "karaoke") {
							const tokens = fullText.split(/(\s+)/);
							const wordIndices = [];
							tokens.forEach((token, idx) => {
								if (token.trim().length > 0) wordIndices.push(idx);
							});
							const visibleWordCount = Math.round(wordIndices.length * progress);
							if (visibleWordCount === 0) displayText = "";
							else {
								const lastTokenIdx = wordIndices[Math.min(wordIndices.length - 1, visibleWordCount - 1)];
								displayText = tokens.slice(0, lastTokenIdx + 1).join("");
							}
						} else if (presetType === "line-reveal") {
							const lines = fullText.split("\n");
							const visibleLineCount = Math.round(lines.length * progress);
							displayText = lines.slice(0, Math.max(0, visibleLineCount)).join("\n");
						} else {
							const visibleChars = Math.round(fullText.length * progress);
							displayText = fullText.slice(0, visibleChars);
						}
					}
				}
				content = {
					metadata: {},
					operation: {
						op: "text",
						text: displayText,
						fontSize: target?.fontSize ?? lop.fontSize,
						fontFamily: lop.fontFamily,
						fontStyle: lop.fontStyle,
						fontWeight: lop.fontWeight,
						fill: lop.fill,
						align: lop.align === "start" ? "left" : lop.align === "end" ? "right" : lop.align,
						verticalAlign: lop.verticalAlign,
						letterSpacing: lop.letterSpacing,
						lineHeight: lop.lineHeight,
						padding: lop.padding,
						textBackgroundColor: lop.background,
						borderRadius: lop.borderRadius,
						stroke: lop.stroke,
						strokeWidth: lop.strokeWidth,
						strokeAlign: lop.strokeAlign,
						textShadow: lop.textShadow,
						shadows: lop.shadows,
						x: 0,
						y: 0,
						width: layerW,
						height: layerH
					},
					children: []
				};
			}
			if (content) {
				const contentDurationMs = getActiveMediaMetadata(content)?.durationMs ?? composeDuration;
				const layerDurationInMS = Math.max(1, Math.round(contentDurationMs / 1e3 * (fps ?? 24))) / (fps ?? 24) * 1e3;
				const contentIsImageCompositor = content.operation?.op === "Compositor" && content.operation?.dataType === "Image";
				const isCaption = content.operation?.dataType === "Caption" || lop.dataType === "Caption" || content.operation?.srtText !== void 0;
				await drawChild(content, {
					containerWidth: layerW,
					containerHeight: layerH,
					renderId: `${props.renderId}-l${i}`,
					durationMs: layerDurationInMS,
					opacity: 1,
					fps,
					isVideoMode: props.isVideoMode && !contentIsImageCompositor,
					...props.isVideoMode && { frame: shiftedFrame - (lop.startFrame ?? 0) },
					...isCaption && {
						fontFamily: lop.fontFamily,
						fontSize: target?.fontSize ?? lop.fontSize,
						fontWeight: lop.fontWeight,
						fontStyle: lop.fontStyle,
						fill: lop.fill,
						color: lop.fill,
						align: lop.align === "start" ? "left" : lop.align === "end" ? "right" : lop.align ?? "center",
						verticalAlign: lop.verticalAlign ?? lop.textAlignVertical,
						lineHeight: lop.lineHeight,
						letterSpacing: lop.letterSpacing,
						textBackgroundColor: lop.background ?? lop.textBackgroundColor,
						borderRadius: lop.borderRadius ?? lop.strokeRadius,
						strokeRadius: lop.strokeRadius ?? lop.borderRadius,
						stroke: lop.stroke,
						strokeWidth: lop.strokeWidth,
						shadows: lop.shadows,
						padding: lop.padding,
						maxWidth: lop.maxWidth ?? layerW
					}
				}, localView, localTex, texW, texH);
			}
			let finalTex = localTex;
			if (br > 0) {
				const maskTex = ctx.renderer.getTemporaryTexture(texW, texH, [
					localTex,
					activeTex,
					targetTexture,
					...excludes
				]);
				const maskView = maskTex.createView();
				ctx.renderer.beginFrame(encoder, maskView, {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}, texW, texH, "clear").end();
				const maskPass = ctx.renderer.beginFrame(encoder, maskView, {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}, texW, texH, "load");
				ctx.renderer.drawRect(maskPass, {
					x: 0,
					y: 0,
					width: layerW,
					height: layerH
				}, {
					r: 1,
					g: 1,
					b: 1,
					a: 1
				}, br);
				maskPass.end();
				finalTex = ctx.renderer.composite(encoder, localTex, maskTex, "mask-in", [
					activeTex,
					targetTexture,
					...excludes
				]);
			}
			const borderExcludes = [
				localTex,
				finalTex,
				activeTex,
				targetTexture,
				...excludes
			];
			const borderResult = lop.borderWidth !== void 0 && lop.borderColor ? createBorderTexture(ctx, encoder, layerW, layerH, br, lop.borderWidth, lop.borderColor, lop.strokeAlign ?? "inside", borderExcludes) : null;
			if (blendMode === "normal" || blendMode === "source-over") {
				const drawPass = ctx.renderer.beginFrame(encoder, activeView, {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}, nativeWidth, nativeHeight, "load");
				ctx.renderer.pushTransform(layerMatrix);
				ctx.renderer.drawTexture(drawPass, finalTex, {
					x: 0,
					y: 0,
					width: layerW,
					height: layerH
				}, { opacity: layerOpacity });
				if (borderResult) ctx.renderer.drawTexture(drawPass, borderResult.borderTex, {
					x: borderResult.ox,
					y: borderResult.oy,
					width: borderResult.ow,
					height: borderResult.oh
				}, { opacity: layerOpacity });
				ctx.renderer.popTransform();
				drawPass.end();
			} else {
				const layerExcludes = [
					activeTex,
					targetTexture,
					...excludes
				];
				if (borderResult) layerExcludes.push(borderResult.borderTex);
				const layerTex = ctx.renderer.getTemporaryTexture(nativeWidth, nativeHeight, layerExcludes);
				const layerView = layerTex.createView();
				ctx.renderer.beginFrame(encoder, layerView, {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}, nativeWidth, nativeHeight, "clear").end();
				const drawPass = ctx.renderer.beginFrame(encoder, layerView, {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}, nativeWidth, nativeHeight, "load");
				ctx.renderer.pushTransform(layerMatrix);
				ctx.renderer.drawTexture(drawPass, finalTex, {
					x: 0,
					y: 0,
					width: layerW,
					height: layerH
				}, { opacity: layerOpacity });
				if (borderResult) ctx.renderer.drawTexture(drawPass, borderResult.borderTex, {
					x: borderResult.ox,
					y: borderResult.oy,
					width: borderResult.ow,
					height: borderResult.oh
				}, { opacity: layerOpacity });
				ctx.renderer.popTransform();
				drawPass.end();
				activeTex = ctx.renderer.composite(encoder, activeTex, layerTex, blendMode, [targetTexture, ...excludes]);
				activeView = activeTex.createView();
			}
			return {
				finalTex: activeTex,
				finalView: activeView
			};
		};
		const initialExcludes = [
			compTex,
			targetTexture,
			...props.excludeTextures || []
		];
		currentCompTex = (await renderNodeTree(virtualMedia.children ?? [], compTex, compView, initialExcludes)).finalTex;
		ctx.renderer.popTransform();
		ctx.renderer.popScissor();
		const finalPass = ctx.renderer.beginFrame(encoder, targetView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, targetWidth, targetHeight, "load");
		ctx.renderer.drawTexture(finalPass, currentCompTex, {
			x: 0,
			y: 0,
			width: props.containerWidth ?? targetWidth,
			height: props.containerHeight ?? targetHeight
		}, { opacity });
		args.pass = finalPass;
	}
};
function createBorderTexture(ctx, encoder, w, h, br, borderWidth, borderColor, strokeAlign, excludeTextures) {
	if (w <= 0 || h <= 0 || !borderColor || !borderWidth || borderWidth <= 0) return null;
	let ox = 0;
	let oy = 0;
	let ow = w;
	let oh = h;
	let outerRadius = br;
	let innerRadius = br;
	if (strokeAlign === "inside") {
		ox = 0;
		oy = 0;
		ow = w;
		oh = h;
		outerRadius = br;
		innerRadius = Math.max(0, br - borderWidth);
	} else if (strokeAlign === "outside") {
		ox = -borderWidth;
		oy = -borderWidth;
		ow = w + 2 * borderWidth;
		oh = h + 2 * borderWidth;
		outerRadius = br + borderWidth;
		innerRadius = br;
	} else {
		ox = -borderWidth / 2;
		oy = -borderWidth / 2;
		ow = w + borderWidth;
		oh = h + borderWidth;
		outerRadius = br + borderWidth / 2;
		innerRadius = Math.max(0, br - borderWidth / 2);
	}
	if (br <= 0) {
		outerRadius = 0;
		innerRadius = 0;
	}
	if (ow <= 0 || oh <= 0) return null;
	const borderTexW = Math.ceil(ow);
	const borderTexH = Math.ceil(oh);
	const outerTex = ctx.renderer.getTemporaryTexture(borderTexW, borderTexH, excludeTextures);
	const outerView = outerTex.createView();
	ctx.renderer.beginFrame(encoder, outerView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, borderTexW, borderTexH, "clear").end();
	const outerDrawPass = ctx.renderer.beginFrame(encoder, outerView, {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}, borderTexW, borderTexH, "load");
	ctx.renderer.drawRect(outerDrawPass, {
		x: 0,
		y: 0,
		width: ow,
		height: oh
	}, borderColor, outerRadius);
	outerDrawPass.end();
	const innerW = ow - 2 * borderWidth;
	const innerH = oh - 2 * borderWidth;
	if (innerW > 0 && innerH > 0) {
		const innerTex = ctx.renderer.getTemporaryTexture(borderTexW, borderTexH, [outerTex, ...excludeTextures]);
		const innerView = innerTex.createView();
		ctx.renderer.beginFrame(encoder, innerView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, borderTexW, borderTexH, "clear").end();
		const innerDrawPass = ctx.renderer.beginFrame(encoder, innerView, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, borderTexW, borderTexH, "load");
		ctx.renderer.drawRect(innerDrawPass, {
			x: borderWidth,
			y: borderWidth,
			width: innerW,
			height: innerH
		}, {
			r: 1,
			g: 1,
			b: 1,
			a: 1
		}, innerRadius);
		innerDrawPass.end();
		return {
			borderTex: ctx.renderer.composite(encoder, outerTex, innerTex, "mask-out", excludeTextures),
			ox,
			oy,
			ow,
			oh
		};
	}
	return {
		borderTex: outerTex,
		ox,
		oy,
		ow,
		oh
	};
}
const compositorLayerAudioProcessor = async (channels, sampleRate, virtualMedia, ctx) => {
	const op = virtualMedia.operation;
	if (!op) return;
	const numChannels = channels.length;
	if (numChannels === 0) return;
	const numSamples = channels[0].length;
	if (numSamples === 0) return;
	if (op.op === "Compositor") {
		const master = typeof op.volume === "number" ? op.volume : 1;
		if (master === 1) return;
		for (let c = 0; c < numChannels; c++) {
			const ch = channels[c];
			for (let i = 0; i < ch.length; i++) ch[i] *= master;
		}
		return;
	}
	const volume = typeof op.volume === "number" ? op.volume : 1;
	const muted = !!op.muted;
	const animation = op.animation;
	const fps = ctx?.fps ?? 24;
	const tracks = animation?.tracks || [];
	const hasVolumeKeys = tracks.some((t) => t.prop === "volume" && t.keyframes && t.keyframes.length > 0);
	const hasMutedKeys = tracks.some((t) => t.prop === "muted" && t.keyframes && t.keyframes.length > 0);
	if (!hasVolumeKeys && !hasMutedKeys) return;
	const { tl, stub } = compileLayerTimeline(op.id || op.inputHandleId || "layer", animation, volume, muted, fps);
	const startTimeSec = (ctx?.elapsedMs ?? 0) / 1e3;
	const subChunkSize = 128;
	tl.seek(startTimeSec);
	let lastVol = stub.volume;
	let lastMuted = stub.muted;
	const baseGain = muted ? 0 : volume;
	for (let i = 0; i < numSamples; i += subChunkSize) {
		const nextI = Math.min(numSamples, i + subChunkSize);
		const tNext = startTimeSec + (nextI - i) / sampleRate;
		tl.seek(tNext);
		const nextVol = stub.volume;
		const nextMuted = stub.muted;
		for (let j = i; j < nextI; j++) {
			const p = (j - i) / (nextI - i);
			const currentVol = Math.min(1, Math.max(0, lastVol + (nextVol - lastVol) * p));
			const finalGain = (j - i < (nextI - i) / 2 ? lastMuted : nextMuted) ? 0 : currentVol;
			const relativeGain = baseGain === 0 ? 0 : finalGain / baseGain;
			if (relativeGain !== 1) for (let c = 0; c < numChannels; c++) channels[c][j] *= relativeGain;
		}
		lastVol = nextVol;
		lastMuted = nextMuted;
	}
};
audioRegistry.register("CompositorLayer", compositorLayerAudioProcessor);
var renderers_default = defineRenderer({ WebGPURenderer: CompositorWebGPURenderer });

//#endregion
export { renderers_default as default };