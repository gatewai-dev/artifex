import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-patch-heal/dist/shared-oU4AGdRB.mjs
const MAX_RADIUS = 500;
const MAX_FEATHER = 100;
const MAX_OFFSET = 4096;
const PatchItemSchema = z$1.object({
	id: z$1.string().default(() => Math.random().toString(36).substring(7)),
	centerX: z$1.number().min(0).max(1).default(.5),
	centerY: z$1.number().min(0).max(1).default(.5),
	offsetX: z$1.number().min(-MAX_OFFSET).max(MAX_OFFSET).default(50),
	offsetY: z$1.number().min(-MAX_OFFSET).max(MAX_OFFSET).default(0),
	radius: z$1.number().min(1).max(MAX_RADIUS).default(25),
	sourceRadius: z$1.number().min(1).max(MAX_RADIUS).default(25),
	feather: z$1.number().min(0).max(MAX_FEATHER).default(50),
	opacity: z$1.number().min(0).max(1).default(1),
	mode: z$1.enum([
		"Clone",
		"SeamlessHeal",
		"TextureTransfer"
	]).default("SeamlessHeal")
});
const PatchHealNodeConfigSchema = configBuilder().field("patches", z$1.array(PatchItemSchema).optional(), {
	label: "Patches",
	description: "List of patch healing operations applied sequentially."
}).field("centerX", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Center X Signal",
	description: "Horizontal normalized position of destination patch (0.0 to 1.0)."
}).field("centerY", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Center Y Signal",
	description: "Vertical normalized position of destination patch (0.0 to 1.0)."
}).field("offsetX", z$1.number().min(-MAX_OFFSET).max(MAX_OFFSET).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Source Offset X Signal",
	description: "Horizontal pixel distance from destination to sample source patch."
}).field("offsetY", z$1.number().min(-MAX_OFFSET).max(MAX_OFFSET).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Source Offset Y Signal",
	description: "Vertical pixel distance from destination to sample source patch."
}).field("radius", z$1.number().min(1).max(MAX_RADIUS).default(25), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Target Radius Signal",
	description: "Radius of the destination circular patch in pixels (used when no explicit Mask input is connected)."
}).field("sourceRadius", z$1.number().min(1).max(MAX_RADIUS).default(25), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Source Radius Signal",
	description: "Radius of the source sample circular patch in pixels."
}).field("feather", z$1.number().min(0).max(MAX_FEATHER).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Feather Signal",
	description: "Softness edge falloff percentage (0–100%)."
}).field("opacity", z$1.number().min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Opacity Signal",
	description: "Blending opacity of the healed patch (0.0–1.0)."
}).field("mode", z$1.enum([
	"Clone",
	"SeamlessHeal",
	"TextureTransfer"
]).default("SeamlessHeal"), {
	label: "Healing Mode",
	description: "Healing algorithm: Clone (direct stamp), SeamlessHeal (Poisson color/lighting blend), TextureTransfer (luminance structure matching)."
}).build().schema;
function normalizePatches(config) {
	if (config?.patches && config.patches.length > 0) return config.patches.map((p, idx) => ({
		id: p.id || `patch-${idx + 1}`,
		centerX: p.centerX ?? .5,
		centerY: p.centerY ?? .5,
		offsetX: p.offsetX ?? 50,
		offsetY: p.offsetY ?? 0,
		radius: p.radius ?? 25,
		sourceRadius: p.sourceRadius ?? p.radius ?? 25,
		feather: p.feather ?? 50,
		opacity: p.opacity ?? 1,
		mode: p.mode ?? "SeamlessHeal"
	}));
	const fallbackRadius = config?.radius ?? 25;
	return [{
		id: "patch-1",
		centerX: config?.centerX ?? .5,
		centerY: config?.centerY ?? .5,
		offsetX: config?.offsetX ?? 50,
		offsetY: config?.offsetY ?? 0,
		radius: fallbackRadius,
		sourceRadius: config?.sourceRadius ?? fallbackRadius,
		feather: config?.feather ?? 50,
		opacity: config?.opacity ?? 1,
		mode: config?.mode ?? "SeamlessHeal"
	}];
}
const PatchHealResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const PATCH_HEAL_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { PatchHealNodeConfigSchema as a, PATCH_HEAL_OUTPUT_TYPE_MAP as i, MAX_OFFSET as n, PatchHealResultSchema as o, MAX_RADIUS as r, normalizePatches as s, MAX_FEATHER as t };