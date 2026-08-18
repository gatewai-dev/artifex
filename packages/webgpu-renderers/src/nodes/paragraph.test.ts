import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createMockDevice,
	createMockRenderPassEncoder,
	ensureDOMGlobals,
} from "../renderer2d/test-helpers.js";
import { SlugFontCache } from "../slug/slug-font-cache.js";
import { SlugGeometry } from "../slug/slug-geometry.js";
import { drawParagraphNode } from "./paragraph.js";

// Mock SlugGeometry
vi.mock("../slug/slug-geometry.js", () => {
	return {
		SlugGeometry: {
			measure: vi.fn().mockReturnValue({ width: 100, height: 50 }),
			layout: vi.fn().mockReturnValue({
				glyphs: [
					{
						isSpace: false,
						unitIndex: 0,
						lineIndex: 0,
						wordIndex: 0,
						x: 0,
						y: 10,
						cp: {
							width: 10,
							height: 10,
							advanceWidth: 10,
							bearingX: 0,
							bearingY: 10,
							bandCount: 1,
							bandDimX: 1,
							bandDimY: 1,
							bandsTexCoordX: 0,
							bandsTexCoordY: 0,
						},
					},
				],
				emojis: [
					{
						lineIndex: 0,
						x: 50,
						y: 10,
						char: "😀",
						size: 20,
					},
				],
				linesCount: 1,
			}),
		},
	};
});

// Mock client-utils
vi.mock("@gatewai.studio/client-utils", () => {
	return {
		GetFontAssetUrl: vi.fn().mockReturnValue("http://test.com/font.slug"),
	};
});

describe("Paragraph Node", () => {
	beforeAll(() => {
		ensureDOMGlobals();
		globalThis.GPUTextureUsage = {
			TEXTURE_BINDING: 1,
			COPY_DST: 2,
			RENDER_ATTACHMENT: 4,
		} as any;

		// Mock isNode headless flags
		(globalThis as any).__IS_HEADLESS_RENDERER__ = true;
	});

	let mockDevice: any;
	let mockPass: any;
	let mockCtx: any;
	let mockFont: any;

	beforeEach(() => {
		vi.clearAllMocks();
		SlugFontCache.destroy();
		mockDevice = createMockDevice();
		mockPass = createMockRenderPassEncoder();

		mockFont = {
			curvesTex: { destroy: vi.fn() } as any,
			bandsTex: { destroy: vi.fn() } as any,
			ascender: 800,
			descender: -200,
			lineGap: 100,
			unitsPerEm: 1000,
			codePoints: new Map(),
		};

		SlugFontCache.registerFont("Inter", mockFont);

		mockCtx = {
			device: mockDevice,
			renderer: {
				getTransformStack: vi.fn().mockReturnValue({
					getCurrent: vi.fn().mockReturnValue(new DOMMatrix()),
				}),
				getSurfaceWidth: vi.fn().mockReturnValue(800),
				getSurfaceHeight: vi.fn().mockReturnValue(600),
				drawRRect: vi.fn(),
				drawTextureRegion: vi.fn(),
				slugPipeline: {
					draw: vi.fn(),
				},
			},
		};
	});

	it("should draw paragraph layout without backgrounds", () => {
		const props = {
			text: "Hello 😀",
			dstRect: { x: 0, y: 0, width: 200, height: 100 },
			fontFamily: "Inter",
			fontSize: 32,
		};

		drawParagraphNode(mockCtx, mockPass, props);

		expect(SlugGeometry.layout).toHaveBeenCalled();
		expect(mockCtx.renderer.slugPipeline.draw).toHaveBeenCalled();
		expect(mockCtx.renderer.drawTextureRegion).toHaveBeenCalled();
	});

	it("should preload font if not cached", () => {
		const props = {
			text: "Preload",
			dstRect: { x: 0, y: 0, width: 200, height: 100 },
			fontFamily: "Roboto", // not registered
			fontSize: 32,
		};

		const spy = vi
			.spyOn(SlugFontCache, "preloadSlugFont")
			.mockResolvedValue({} as any);

		drawParagraphNode(mockCtx, mockPass, props);

		expect(spy).toHaveBeenCalled();
	});

	it("should render background rectangle if textBackgroundColor is provided", () => {
		const props = {
			text: "Background",
			dstRect: { x: 0, y: 0, width: 200, height: 100 },
			fontFamily: "Inter",
			fontSize: 32,
			textBackgroundColor: "#ff0000",
		};

		drawParagraphNode(mockCtx, mockPass, props);

		expect(mockCtx.renderer.drawRRect).toHaveBeenCalled();
	});

	it("should apply animations in video mode", () => {
		const props = {
			text: "Animated",
			dstRect: { x: 0, y: 0, width: 200, height: 100 },
			fontFamily: "Inter",
			fontSize: 32,
			isVideoMode: true,
			frame: 5,
			fps: 30,
			durationMs: 1000,
			animation: {
				in: "fade",
				kinetic: "wiggle" as const,
			},
		};

		drawParagraphNode(mockCtx, mockPass, props);

		expect(mockCtx.renderer.slugPipeline.draw).toHaveBeenCalled();
	});

	it("should render shadows if configured", () => {
		const props = {
			text: "Shadowed",
			dstRect: { x: 0, y: 0, width: 200, height: 100 },
			fontFamily: "Inter",
			fontSize: 32,
			shadows: [
				{
					color: "rgba(0,0,0,0.5)",
					blurRadius: 4,
					offset: { x: 2, y: 2 },
				},
			],
		};

		drawParagraphNode(mockCtx, mockPass, props);

		// main text + shadow = 2 draws
		expect(mockCtx.renderer.slugPipeline.draw).toHaveBeenCalledTimes(2);
	});

	it("should render stroke if configured", () => {
		const props = {
			text: "Stroked",
			dstRect: { x: 0, y: 0, width: 200, height: 100 },
			fontFamily: "Inter",
			fontSize: 32,
			stroke: "rgba(255,0,0,1)",
			strokeWidth: 2,
		};

		drawParagraphNode(mockCtx, mockPass, props);

		// main text + stroke = 2 draws
		expect(mockCtx.renderer.slugPipeline.draw).toHaveBeenCalledTimes(2);
	});
});
