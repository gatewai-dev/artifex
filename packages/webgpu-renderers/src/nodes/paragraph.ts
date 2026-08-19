import { GetFontAssetUrl } from "@gatewai.studio/client-utils";
import { parseColor } from "../color.js";
import type { RenderContextValue } from "../render-context.js";
import { SlugFontCache } from "../slug/slug-font-cache.js";
import { SlugGeometry } from "../slug/slug-geometry.js";
import type { SlugFont } from "../slug/slug-loader.js";
import type { ParagraphNodeProps } from "./types.js";

function easeInOutQuad(t: number): number {
	return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function seededRandom(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return () => {
		const x = Math.sin(hash++) * 10000;
		return x - Math.floor(x);
	};
}

function getShuffleOrder(n: number, seed: string): number[] {
	const rand = seededRandom(seed);
	const arr = Array.from({ length: n }, (_, i) => i);
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}

let skiaCanvasModule: any = null;

function getSkiaCanvas(): any {
	if (skiaCanvasModule !== null) return skiaCanvasModule;
	try {
		const nodeRequire = (globalThis as any).require;
		if (typeof nodeRequire === "function") {
			skiaCanvasModule = nodeRequire("skia-canvas");
		}
	} catch {}

	if (!skiaCanvasModule) {
		try {
			// Fallback for ESM contexts
			import("skia-canvas")
				.then((m) => {
					skiaCanvasModule = m;
				})
				.catch(() => {
					skiaCanvasModule = false;
				});
		} catch {
			skiaCanvasModule = false;
		}
	}
	return skiaCanvasModule;
}

function getOrCreateEmojiTexture(
	device: GPUDevice,
	char: string,
	fontSize: number,
): GPUTexture {
	const key = `${char}-${fontSize}`;
	let tex = SlugFontCache.emojiTextureCache.get(key);
	if (tex) {
		return tex;
	}

	const resolutionScale = 4.0;
	const emojiSize = Math.max(16, Math.ceil(fontSize * 1.5 * resolutionScale));
	const size = Math.ceil(emojiSize / 4) * 4;

	const isNode =
		!!(globalThis as Record<string, unknown>).__IS_HEADLESS_RENDERER__ ||
		typeof window === "undefined" ||
		typeof globalThis.document === "undefined";

	if (isNode) {
		const skia =
			getSkiaCanvas() ||
			(typeof (globalThis as any).OffscreenCanvas !== "undefined"
				? { Canvas: (globalThis as any).OffscreenCanvas }
				: null);

		if (skia && (skia.Canvas || skia.createCanvas)) {
			try {
				const CanvasClass = skia.Canvas;
				const canvas = CanvasClass
					? new CanvasClass(size, size)
					: skia.createCanvas(size, size);
				const c2d = canvas.getContext("2d");
				if (c2d) {
					c2d.font = `${fontSize * resolutionScale}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "NotoColorEmoji", "Arial Unicode MS", sans-serif`;
					c2d.textBaseline = "middle";
					c2d.textAlign = "center";
					c2d.fillText(char, size / 2, size / 2);
				}

				const imgData = c2d.getImageData(0, 0, size, size);

				tex = device.createTexture({
					label: `Emoji-${char}`,
					size: [size, size],
					format: "rgba8unorm",
					usage:
						GPUTextureUsage.TEXTURE_BINDING |
						GPUTextureUsage.COPY_DST |
						GPUTextureUsage.RENDER_ATTACHMENT,
				});

				device.queue.writeTexture(
					{ texture: tex },
					imgData.data,
					{ bytesPerRow: size * 4 },
					[size, size],
				);

				SlugFontCache.emojiTextureCache.set(key, tex);
				return tex;
			} catch (err) {
				console.warn(
					`[getOrCreateEmojiTexture] Failed to render headless emoji "${char}":`,
					err,
				);
			}
		}

		tex = device.createTexture({
			label: `Emoji-Dummy-${char}`,
			size: [1, 1],
			format: "rgba8unorm",
			usage: GPUTextureUsage.TEXTURE_BINDING,
		});
		SlugFontCache.emojiTextureCache.set(key, tex);
		return tex;
	}

	const canvas = new OffscreenCanvas(size, size);
	const c2d = canvas.getContext("2d");
	if (c2d) {
		c2d.font = `${fontSize * resolutionScale}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "NotoColorEmoji", sans-serif`;
		c2d.textBaseline = "middle";
		c2d.textAlign = "center";
		c2d.fillText(char, size / 2, size / 2);
	}

	tex = device.createTexture({
		label: `Emoji-${char}`,
		size: [size, size],
		format: "rgba8unorm",
		usage:
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.COPY_DST |
			GPUTextureUsage.RENDER_ATTACHMENT,
	});

	device.queue.copyExternalImageToTexture(
		{ source: canvas },
		{ texture: tex, premultipliedAlpha: true },
		[size, size],
	);

	SlugFontCache.emojiTextureCache.set(key, tex);
	return tex;
}

interface UnitProgress {
	p_in: number;
	p_out: number;
}

function computeUnitProgress(
	elapsed: number,
	duration: number,
	entranceMs: number,
	exitMs: number,
	idx_i: number,
	totalUnits: number,
	isVideoMode: boolean,
): UnitProgress {
	if (!isVideoMode) {
		return { p_in: 1, p_out: 1 };
	}

	let p_in = 1;
	if (entranceMs > 0) {
		const D_unit = entranceMs * 0.5;
		const t_stagger =
			totalUnits > 1 ? (entranceMs * 0.5) / (totalUnits - 1) : 0;
		const s_i = idx_i * t_stagger;
		const e_i = s_i + D_unit;
		if (elapsed < s_i) p_in = 0;
		else if (elapsed > e_i) p_in = 1;
		else p_in = (elapsed - s_i) / (e_i - s_i);
	}

	let p_out = 1;
	if (exitMs > 0) {
		const t_exit_start = duration - exitMs;
		if (elapsed > t_exit_start) {
			const D_unit = exitMs * 0.5;
			const t_stagger = totalUnits > 1 ? (exitMs * 0.5) / (totalUnits - 1) : 0;
			const s_i = t_exit_start + idx_i * t_stagger;
			const e_i = s_i + D_unit;
			if (elapsed < s_i) p_out = 1;
			else if (elapsed > e_i) p_out = 0;
			else p_out = 1 - (elapsed - s_i) / (e_i - s_i);
		}
	}

	return { p_in, p_out };
}

interface AnimationEffectsResult {
	opacity: number;
	transX: number;
	transY: number;
	rot: number;
	scale: number;
	blurAmount: number;
	visible: boolean;
}

function applyAnimationEffects(
	p_in: number,
	p_out: number,
	smoothing: boolean,
	transitionIn: string,
	transitionOut: string,
	kinetic: string,
	elapsed: number,
	duration: number,
	entranceMs: number,
	exitMs: number,
	idx_i: number,
	baseOpacity: number,
	isEmoji: boolean,
): AnimationEffectsResult {
	const ep_in = smoothing ? easeInOutQuad(p_in) : p_in;
	const ep_out = smoothing ? easeInOutQuad(p_out) : p_out;
	const ep_i = ep_in * ep_out;

	// Check visibility early if not blurring
	if (
		(ep_in <= 0 && transitionIn !== "blur") ||
		(ep_out <= 0 && transitionOut !== "blur")
	) {
		return {
			opacity: 0,
			transX: 0,
			transY: 0,
			rot: 0,
			scale: 1,
			blurAmount: 0,
			visible: false,
		};
	}

	let opacity = baseOpacity;

	// In-transition
	if (
		transitionIn === "fade" ||
		transitionIn === "slideUp" ||
		transitionIn === "blur"
	) {
		opacity *= ep_in;
	} else if (transitionIn === "appear") {
		if (ep_in < 0.5) opacity = 0;
	}

	// Out-transition
	if (
		transitionOut === "fade" ||
		transitionOut === "slideUp" ||
		transitionOut === "blur"
	) {
		opacity *= ep_out;
	} else if (transitionOut === "appear") {
		if (ep_out < 0.5) opacity = 0;
	}

	if (opacity < 0.001) {
		return {
			opacity: 0,
			transX: 0,
			transY: 0,
			rot: 0,
			scale: 1,
			blurAmount: 0,
			visible: false,
		};
	}

	let transX = 0;
	let transY = 0;
	let rot = 0;
	let scale = 1.0;

	// Slide-up transitions
	if (transitionIn === "slideUp" && elapsed < entranceMs) {
		transY += (1 - ep_in) * 30;
	}
	if (transitionOut === "slideUp" && elapsed > duration - exitMs) {
		transY -= (1 - ep_out) * 30;
	}

	// Kinetic effects
	const rotScale = isEmoji ? 1 : Math.PI / 180;

	if (kinetic === "stack") {
		scale = 0.8 + 0.2 * ep_i;
		rot = (1 - ep_i) * 15 * rotScale;
	} else if (kinetic === "wave") {
		transY += 10 * Math.sin(elapsed * 0.005 - idx_i * 0.5);
	} else if (kinetic === "wiggle") {
		transX += 5 * Math.sin(elapsed * 0.008 + idx_i * 1.7);
		transY += 5 * Math.cos(elapsed * 0.006 + idx_i * 1.3);
		rot += 4 * Math.sin(elapsed * 0.005 + idx_i * 2.1) * rotScale;
	} else if (kinetic === "shuffle") {
		transX += 3 * Math.sin(elapsed * 0.015 + idx_i * 3.1);
		transY += 3 * Math.cos(elapsed * 0.012 + idx_i * 2.3);
		rot += 8 * Math.sin(elapsed * 0.02 + idx_i * 1.1) * rotScale;
	}

	let blurAmount = 0.0;
	if (transitionIn === "blur") {
		blurAmount = Math.max(blurAmount, (1.0 - ep_in) * 20.0);
	}
	if (transitionOut === "blur") {
		blurAmount = Math.max(blurAmount, (1.0 - ep_out) * 20.0);
	}

	return {
		opacity,
		transX,
		transY,
		rot,
		scale,
		blurAmount,
		visible: true,
	};
}

export function drawParagraphNode(
	ctx: RenderContextValue,
	pass: GPURenderPassEncoder,
	props: ParagraphNodeProps,
): void {
	let fontFamily = props.fontFamily ?? "Inter";
	if (SlugFontCache.isFailed(fontFamily)) {
		fontFamily = "Inter";
	}
	if (SlugFontCache.isFailed(fontFamily)) {
		return;
	}

	const slugFont = SlugFontCache.getFont(
		fontFamily,
		props.fontWeight,
		ctx.device,
	);

	const hasStroke = props.stroke && props.strokeWidth && props.strokeWidth > 0;
	let strokeFont: any = null;

	if (slugFont && hasStroke && ctx.device) {
		const fontSize = props.fontSize ?? 48;
		const strokeWidthInFontUnits =
			(props.strokeWidth ?? 0) * (slugFont.unitsPerEm / fontSize);

		strokeFont = SlugFontCache.getFont(
			fontFamily,
			props.fontWeight,
			ctx.device,
			strokeWidthInFontUnits,
		);
	}

	if (
		!slugFont ||
		!slugFont.curvesTex ||
		(hasStroke && (!strokeFont || !strokeFont.curvesTex))
	) {
		const fontUrl = GetFontAssetUrl(fontFamily);
		SlugFontCache.preloadSlugFont(
			ctx.device,
			fontFamily,
			fontUrl,
			undefined,
			props.renderId,
		).catch((err) => {
			console.warn(
				`[drawParagraphNode] Failed to load Slug font for ${fontFamily}:`,
				err,
			);
		});
		return;
	}

	const fontSize = props.fontSize ?? 48;
	const letterSpacing = props.letterSpacing ?? 0;
	const lineHeight =
		props.lineHeight !== undefined && props.lineHeight < 10
			? props.lineHeight * fontSize
			: (props.lineHeight ?? fontSize * 1.2);
	const align = props.align ?? "left";

	const padding = props.isCaption
		? 0
		: props.textBackgroundColor
			? (props.padding ?? 0)
			: 0;

	// When no explicit width is set (autoDimensions), measure the text first
	// so that word-wrapping and alignment use the actual content width
	// instead of the canvas/container width.
	let maxWidth: number;
	let measured: { width: number; height: number };

	if (props.width != null) {
		maxWidth = Math.max(0, props.width - padding * 2);
		measured = SlugGeometry.measure(
			props.text,
			slugFont,
			fontSize,
			letterSpacing,
			lineHeight,
			maxWidth,
		);
	} else {
		measured = SlugGeometry.measure(
			props.text,
			slugFont,
			fontSize,
			letterSpacing,
			lineHeight,
		);
		maxWidth = measured.width;
	}

	const alignWidth = props.isCaption ? props.dstRect.width : maxWidth;

	const layout = SlugGeometry.layout(
		props.text,
		slugFont,
		fontSize,
		letterSpacing,
		lineHeight,
		maxWidth,
		align,
		props.animation?.applyBy ?? "word",
		alignWidth,
	);
	const anim = props.animation;
	const isBold =
		props.fontWeight === "bold" ||
		(typeof props.fontWeight === "number" && props.fontWeight >= 600) ||
		(typeof props.fontWeight === "string" &&
			parseInt(props.fontWeight, 10) >= 600);
	// Only use synthetic bolding if the font does not support true weight variations
	const passes = isBold && !(slugFont as any).hasTrueWeight ? 3 : 1;
	const instanceCount = layout.glyphs.length;

	const elapsed =
		props.elapsedMs !== undefined
			? props.elapsedMs
			: props.frame !== undefined && props.fps !== undefined
				? (props.frame / props.fps) * 1000
				: 0;
	const duration = props.durationMs !== undefined ? props.durationMs : 3000;

	const entranceMs = props.isCaption
		? anim?.in === "none" || !anim?.in
			? 0
			: duration
		: anim?.entranceMs
			? anim.entranceMs
			: anim?.in === "none" || !anim?.in
				? 0
				: duration;
	const exitMs = props.isCaption
		? 0
		: anim?.exitMs
			? anim.exitMs
			: anim?.out === "none" || !anim?.out
				? 0
				: duration;

	const transitionIn = anim?.in || "none";
	const transitionOut = anim?.out || "none";
	const kinetic = anim?.kinetic || "none";
	const smoothing = anim?.smoothing !== false;

	let maxUnitIndex = 0;
	for (const g of layout.glyphs) {
		if (!g.isSpace && g.unitIndex > maxUnitIndex) {
			maxUnitIndex = g.unitIndex;
		}
	}
	const totalUnits = maxUnitIndex + 1;

	const perm =
		kinetic === "shuffle" || transitionIn === "shuffle"
			? getShuffleOrder(totalUnits, props.text)
			: Array.from({ length: totalUnits }, (_, i) => i);

	// 1. Draw background color if present
	if (props.textBackgroundColor) {
		const strokeRadius = props.strokeRadius ?? props.borderRadius ?? 8;
		let maxParagraphOpacity = 0;
		const baseOpacity = props.opacity ?? 1.0;

		if (props.isVideoMode === false) {
			maxParagraphOpacity = baseOpacity;
		} else {
			for (const glyph of layout.glyphs) {
				if (glyph.isSpace) continue;
				const unitIdx = glyph.unitIndex;
				const idx_i = perm[unitIdx] ?? unitIdx;
				const { p_in, p_out } = computeUnitProgress(
					elapsed,
					duration,
					entranceMs,
					exitMs,
					idx_i,
					totalUnits,
					true,
				);
				const effect = applyAnimationEffects(
					p_in,
					p_out,
					smoothing,
					transitionIn,
					transitionOut,
					kinetic,
					elapsed,
					duration,
					entranceMs,
					exitMs,
					idx_i,
					baseOpacity,
					false,
				);
				if (effect.visible && effect.opacity > maxParagraphOpacity) {
					maxParagraphOpacity = effect.opacity;
				}
			}
			for (const emoji of layout.emojis) {
				const emojiUnitIdx =
					props.animation?.applyBy === "line"
						? 0
						: Math.floor(emoji.x / (fontSize + letterSpacing));
				const idx_i = perm[emojiUnitIdx % totalUnits] ?? 0;
				const { p_in, p_out } = computeUnitProgress(
					elapsed,
					duration,
					entranceMs,
					exitMs,
					idx_i,
					totalUnits,
					true,
				);
				const effect = applyAnimationEffects(
					p_in,
					p_out,
					smoothing,
					transitionIn,
					transitionOut,
					kinetic,
					elapsed,
					duration,
					entranceMs,
					exitMs,
					idx_i,
					baseOpacity,
					true,
				);
				if (effect.visible && effect.opacity > maxParagraphOpacity) {
					maxParagraphOpacity = effect.opacity;
				}
			}
		}

		if (maxParagraphOpacity > 0.001) {
			const rectWidth =
				props.width != null ? props.width : measured.width + padding * 2;
			const rectHeight =
				props.height != null ? props.height : measured.height + padding * 2;

			ctx.renderer.drawRRect(
				pass,
				{
					rect: {
						x: props.dstRect.x,
						y: props.dstRect.y,
						width: rectWidth,
						height: rectHeight,
					},
					rx: strokeRadius,
					ry: strokeRadius,
				},
				props.textBackgroundColor,
				{ opacity: maxParagraphOpacity },
			);
		}
	}

	const baseColor = parseColor(props.color ?? "white");
	const highlightColor = parseColor(props.highlightColor ?? "yellow");

	const buildInstanceData = (
		targetFont: SlugFont,
		colorOverride?: any,
		offsetX = 0,
		offsetY = 0,
		blurOverride?: number,
	) => {
		const data = new Float32Array(instanceCount * 24 * passes);
		let visibleCount = 0;

		for (let i = 0; i < layout.glyphs.length; i++) {
			const glyph = layout.glyphs[i];

			if (glyph.isSpace) {
				continue;
			}

			const cp = targetFont.codePoints.get(glyph.cp.codePoint) || glyph.cp;
			if (!cp || cp.width === 0 || cp.height === 0) {
				continue;
			}

			const unitIdx = glyph.unitIndex;
			const idx_i = perm[unitIdx] ?? unitIdx;

			let opacity = props.opacity ?? 1.0;
			let transX = 0;
			let transY = 0;
			let rot = 0;
			let scale = 1.0;
			let blurAmount = blurOverride !== undefined ? blurOverride : 0.0;

			if (props.isVideoMode !== false) {
				const { p_in, p_out } = computeUnitProgress(
					elapsed,
					duration,
					entranceMs,
					exitMs,
					idx_i,
					totalUnits,
					true,
				);
				const effect = applyAnimationEffects(
					p_in,
					p_out,
					smoothing,
					transitionIn,
					transitionOut,
					kinetic,
					elapsed,
					duration,
					entranceMs,
					exitMs,
					idx_i,
					props.opacity ?? 1.0,
					false,
				);
				if (!effect.visible) {
					continue;
				}
				opacity = effect.opacity;
				transX = effect.transX;
				transY = effect.transY;
				rot = effect.rot;
				scale = effect.scale;
				if (blurOverride === undefined) {
					blurAmount = effect.blurAmount;
				}
			}

			const isHighlighted =
				props.highlightWordIndex !== undefined &&
				glyph.wordIndex === props.highlightWordIndex;
			const col = colorOverride ?? (isHighlighted ? highlightColor : baseColor);

			const writeInstance = (boldShift: number) => {
				const offset = visibleCount * 24;
				const fontScale = fontSize / targetFont.unitsPerEm;
				const scaleX = (cp.width * fontScale) / 2.0;
				const scaleY = (cp.height * fontScale) / 2.0;
				const biasX =
					glyph.x +
					cp.bearingX * fontScale +
					scaleX +
					props.dstRect.x +
					padding +
					offsetX +
					boldShift;
				const biasY =
					glyph.y -
					cp.bearingY * fontScale +
					scaleY +
					props.dstRect.y +
					padding +
					offsetY;

				data[offset + 0] = scaleX;
				data[offset + 1] = scaleY;
				data[offset + 2] = biasX;
				data[offset + 3] = biasY;

				data[offset + 4] = cp.width;
				data[offset + 5] = cp.height;
				data[offset + 6] = cp.width / cp.bandDimX;
				data[offset + 7] = cp.height / cp.bandDimY;

				data[offset + 8] = cp.bandCount - 1;
				data[offset + 9] = cp.bandCount - 1;
				data[offset + 10] = cp.bandsTexCoordX;
				data[offset + 11] = cp.bandsTexCoordY;

				data[offset + 12] = rot;
				data[offset + 13] = scale;
				data[offset + 14] = transX;
				data[offset + 15] = transY;

				data[offset + 16] = col.r;
				data[offset + 17] = col.g;
				data[offset + 18] = col.b;
				data[offset + 19] = col.a * opacity;

				data[offset + 20] = blurAmount;
				data[offset + 21] = 0;
				data[offset + 22] = 0;
				data[offset + 23] = 0;

				visibleCount++;
			};

			if (passes === 3) {
				const shift = 0.015 * fontSize;
				writeInstance(-shift);
				writeInstance(0);
				writeInstance(shift);
			} else {
				writeInstance(0);
			}
		}

		return { data, visibleCount };
	};

	// 2. Draw shadows first (in order)
	if (props.shadows && props.shadows.length > 0) {
		for (const shadow of props.shadows) {
			const shadowColor = parseColor(shadow.color);
			const dx = shadow.offset?.x ?? 0;
			const dy = shadow.offset?.y ?? 0;
			const blur = shadow.blurRadius ?? 0;
			const { data: shadowData, visibleCount: shadowVisibleCount } =
				buildInstanceData(slugFont, shadowColor, dx, dy, blur);
			if (shadowVisibleCount > 0) {
				const drawInstances = shadowData.subarray(0, shadowVisibleCount * 24);
				const isItalic = props.fontStyle === "italic";
				const slant = isItalic ? 0.21 : 0.0;
				ctx.renderer.slugPipeline.draw(
					pass,
					ctx.renderer.getTransformStack(),
					slugFont,
					drawInstances,
					shadowVisibleCount,
					shadow.color,
					ctx.renderer.getSurfaceWidth(),
					ctx.renderer.getSurfaceHeight(),
					{
						opacity: props.opacity ?? 1,
						transform: props.matrix,
						customParam: slant,
					},
				);
			}
		}
	}

	// 2.5. Draw stroke pass (drawn below fill but above shadow)
	if (hasStroke && strokeFont) {
		const strokeColor = parseColor(props.stroke);
		const { data: strokeData, visibleCount: strokeVisibleCount } =
			buildInstanceData(strokeFont, strokeColor);
		if (strokeVisibleCount > 0) {
			const drawInstances = strokeData.subarray(0, strokeVisibleCount * 24);
			const isItalic = props.fontStyle === "italic";
			const slant = isItalic ? 0.21 : 0.0;
			ctx.renderer.slugPipeline.draw(
				pass,
				ctx.renderer.getTransformStack(),
				strokeFont,
				drawInstances,
				strokeVisibleCount,
				props.stroke!,
				ctx.renderer.getSurfaceWidth(),
				ctx.renderer.getSurfaceHeight(),
				{
					opacity: props.opacity ?? 1,
					transform: props.matrix,
					customParam: slant,
				},
			);
		}
	}

	// 3. Draw main text
	const { data: mainData, visibleCount: mainVisibleCount } =
		buildInstanceData(slugFont);
	if (mainVisibleCount > 0) {
		const drawInstances = mainData.subarray(0, mainVisibleCount * 24);
		const isItalic = props.fontStyle === "italic";
		const slant = isItalic ? 0.21 : 0.0;
		ctx.renderer.slugPipeline.draw(
			pass,
			ctx.renderer.getTransformStack(),
			slugFont,
			drawInstances,
			mainVisibleCount,
			props.color ?? "white",
			ctx.renderer.getSurfaceWidth(),
			ctx.renderer.getSurfaceHeight(),
			{
				opacity: props.opacity ?? 1,
				transform: props.matrix,
				customParam: slant,
			},
		);
	}

	for (const emoji of layout.emojis) {
		const emojiUnitIdx =
			props.animation?.applyBy === "line"
				? 0
				: Math.floor(emoji.x / (fontSize + letterSpacing));
		const idx_i = perm[emojiUnitIdx % totalUnits] ?? 0;

		let opacity = props.opacity ?? 1.0;
		let transX = 0;
		let transY = 0;
		let rot = 0;
		let scale = 1.0;

		if (props.isVideoMode !== false) {
			const { p_in, p_out } = computeUnitProgress(
				elapsed,
				duration,
				entranceMs,
				exitMs,
				idx_i,
				totalUnits,
				true,
			);
			const effect = applyAnimationEffects(
				p_in,
				p_out,
				smoothing,
				transitionIn,
				transitionOut,
				kinetic,
				elapsed,
				duration,
				entranceMs,
				exitMs,
				idx_i,
				props.opacity ?? 1.0,
				true,
			);
			if (!effect.visible) {
				continue;
			}
			opacity = effect.opacity;
			transX = effect.transX;
			transY = effect.transY;
			rot = effect.rot;
			scale = effect.scale;
		}

		const emojiTex = getOrCreateEmojiTexture(
			ctx.device,
			emoji.char,
			emoji.size,
		);

		const localEmojiSize = emoji.size * 1.5;
		const offsetAdjustment = (localEmojiSize - emoji.size) / 2;

		const emojiDstRect = {
			x: props.dstRect.x + emoji.x + padding - offsetAdjustment,
			y: props.dstRect.y + emoji.y + padding - offsetAdjustment,
			width: localEmojiSize,
			height: localEmojiSize,
		};

		let localM = new DOMMatrix();
		const emojiCenterX = emojiDstRect.x + localEmojiSize / 2;
		const emojiCenterY = emojiDstRect.y + localEmojiSize / 2;

		localM = localM.translate(emojiCenterX, emojiCenterY);
		if (transX !== 0 || transY !== 0) {
			localM = localM.translate(transX, transY);
		}
		if (rot !== 0) {
			localM = localM.rotate(rot);
		}
		if (scale !== 1.0) {
			localM = localM.scale(scale);
		}
		localM = localM.translate(-emojiCenterX, -emojiCenterY);

		const emojiMatrix = props.matrix ? props.matrix.multiply(localM) : localM;

		ctx.renderer.drawTextureRegion(
			pass,
			emojiTex,
			{ x: 0, y: 0, width: emojiTex.width, height: emojiTex.height },
			emojiDstRect,
			{
				opacity,
				transform: emojiMatrix,
			},
		);
	}
}
