import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-shadows-highlights/dist/config-CDxbO_qU.mjs
const MAX_RADIUS = 250;
const MIN_RADIUS = 1;
const MAX_AMOUNT = 100;
const shadowsHighlightsConfig = configBuilder().field("shadowAmount", z$1.number().min(0).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shadow Boost (%)",
	description: "Percentage to lift and recover crushed shadow details (0–100%)."
}).field("shadowTonalWidth", z$1.number().min(0).max(100).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shadow Range (%)",
	description: "Range of dark tones affected by shadow adjustments (0–100%)."
}).field("shadowRadius", z$1.number().min(1).max(250).default(30), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shadow Radius (px)",
	description: "Local neighborhood radius in pixels to determine shadow illumination (1–250px)."
}).field("highlightAmount", z$1.number().min(0).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Highlight Suppression (%)",
	description: "Percentage to suppress and recover blown highlight details (0–100%)."
}).field("highlightTonalWidth", z$1.number().min(0).max(100).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Highlight Range (%)",
	description: "Range of bright tones affected by highlight adjustments (0–100%)."
}).field("highlightRadius", z$1.number().min(1).max(250).default(30), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Highlight Radius (px)",
	description: "Local neighborhood radius in pixels to determine highlight exposure (1–250px)."
}).field("colorCorrection", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Color Correction (%)",
	description: "Fine-tunes color saturation in recovered shadow/highlight zones (-100 to +100%)."
}).field("midtoneContrast", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Midtone Contrast (%)",
	description: "Adjusts contrast centered on the midtones (-100 to +100%)."
}).build();
const ShadowsHighlightsNodeConfigSchema = shadowsHighlightsConfig.schema;
const ShadowsHighlightsResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
ShadowsHighlightsNodeConfigSchema.extend({
	op: z$1.literal("ShadowsHighlights"),
	metadata: z$1.unknown().optional()
});
const defaultShadowsHighlightsConfig = ShadowsHighlightsNodeConfigSchema.parse({});
const SHADOWS_HIGHLIGHTS_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { ShadowsHighlightsNodeConfigSchema as a, shadowsHighlightsConfig as c, SHADOWS_HIGHLIGHTS_OUTPUT_TYPE_MAP as i, MAX_RADIUS as n, ShadowsHighlightsResultSchema as o, MIN_RADIUS as r, defaultShadowsHighlightsConfig as s, MAX_AMOUNT as t };