import { n as ColorSchema, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-layer-style/dist/config-Di1VDQUU.mjs
const DropShadowStyleSchema = z$1.object({
	enabled: z$1.boolean().default(false),
	color: ColorSchema.default("#000000"),
	opacity: z$1.number().min(0).max(1).default(.75),
	angle: z$1.number().min(0).max(360).default(120),
	distance: z$1.number().min(0).max(500).default(10),
	spread: z$1.number().min(0).max(100).default(0),
	size: z$1.number().min(0).max(250).default(10),
	blendMode: z$1.string().default("multiply")
});
const InnerShadowStyleSchema = z$1.object({
	enabled: z$1.boolean().default(false),
	color: ColorSchema.default("#000000"),
	opacity: z$1.number().min(0).max(1).default(.75),
	angle: z$1.number().min(0).max(360).default(120),
	distance: z$1.number().min(0).max(500).default(5),
	choke: z$1.number().min(0).max(100).default(0),
	size: z$1.number().min(0).max(250).default(5),
	blendMode: z$1.string().default("multiply")
});
const StrokeStyleSchema = z$1.object({
	enabled: z$1.boolean().default(false),
	size: z$1.number().min(0).max(100).default(2),
	position: z$1.enum([
		"inside",
		"center",
		"outside"
	]).default("outside"),
	color: ColorSchema.default("#ffffff"),
	opacity: z$1.number().min(0).max(1).default(1),
	blendMode: z$1.string().default("normal")
});
const GlowStyleSchema = z$1.object({
	enabled: z$1.boolean().default(false),
	color: ColorSchema.default("#ffffff"),
	opacity: z$1.number().min(0).max(1).default(.75),
	size: z$1.number().min(0).max(250).default(15),
	spread: z$1.number().min(0).max(100).default(0),
	blendMode: z$1.string().default("screen")
});
const BevelEmbossStyleSchema = z$1.object({
	enabled: z$1.boolean().default(false),
	style: z$1.enum([
		"InnerBevel",
		"OuterBevel",
		"Emboss",
		"PillowEmboss"
	]).default("InnerBevel"),
	technique: z$1.enum([
		"Smooth",
		"ChiselHard",
		"ChiselSoft"
	]).default("Smooth"),
	depth: z$1.number().min(1).max(1e3).default(100),
	direction: z$1.enum(["Up", "Down"]).default("Up"),
	size: z$1.number().min(0).max(250).default(5),
	soften: z$1.number().min(0).max(50).default(0),
	angle: z$1.number().min(0).max(360).default(120),
	altitude: z$1.number().min(0).max(90).default(30),
	highlightColor: ColorSchema.default("#ffffff"),
	highlightOpacity: z$1.number().min(0).max(1).default(.75),
	shadowColor: ColorSchema.default("#000000"),
	shadowOpacity: z$1.number().min(0).max(1).default(.75)
});
const ColorOverlayStyleSchema = z$1.object({
	enabled: z$1.boolean().default(false),
	color: ColorSchema.default("#ff0000"),
	opacity: z$1.number().min(0).max(1).default(1),
	blendMode: z$1.string().default("normal")
});
const DEFAULT_DROP_SHADOW = {
	enabled: false,
	color: "#000000",
	opacity: .75,
	angle: 120,
	distance: 10,
	spread: 0,
	size: 10,
	blendMode: "multiply"
};
const DEFAULT_INNER_SHADOW = {
	enabled: false,
	color: "#000000",
	opacity: .75,
	angle: 120,
	distance: 5,
	choke: 0,
	size: 5,
	blendMode: "multiply"
};
const DEFAULT_GLOW = {
	enabled: false,
	color: "#ffffff",
	opacity: .75,
	size: 15,
	spread: 0,
	blendMode: "screen"
};
const LayerStyleNodeConfigSchema = z$1.object({
	dropShadow: DropShadowStyleSchema.default(DEFAULT_DROP_SHADOW),
	innerShadow: InnerShadowStyleSchema.default(DEFAULT_INNER_SHADOW),
	outerGlow: GlowStyleSchema.default(DEFAULT_GLOW),
	innerGlow: GlowStyleSchema.default(DEFAULT_GLOW),
	stroke: StrokeStyleSchema.default({
		enabled: false,
		size: 2,
		position: "outside",
		color: "#ffffff",
		opacity: 1,
		blendMode: "normal"
	}),
	bevelEmboss: BevelEmbossStyleSchema.default({
		enabled: false,
		style: "InnerBevel",
		technique: "Smooth",
		depth: 100,
		direction: "Up",
		size: 5,
		soften: 0,
		angle: 120,
		altitude: 30,
		highlightColor: "#ffffff",
		highlightOpacity: .75,
		shadowColor: "#000000",
		shadowOpacity: .75
	}),
	colorOverlay: ColorOverlayStyleSchema.default({
		enabled: false,
		color: "#ff0000",
		opacity: 1,
		blendMode: "normal"
	}),
	dropShadowAngleHandleId: z$1.string().nullable().optional(),
	dropShadowDistanceHandleId: z$1.string().nullable().optional(),
	dropShadowSpreadHandleId: z$1.string().nullable().optional(),
	dropShadowSizeHandleId: z$1.string().nullable().optional(),
	dropShadowOpacityHandleId: z$1.string().nullable().optional(),
	innerShadowAngleHandleId: z$1.string().nullable().optional(),
	innerShadowDistanceHandleId: z$1.string().nullable().optional(),
	innerShadowChokeHandleId: z$1.string().nullable().optional(),
	innerShadowSizeHandleId: z$1.string().nullable().optional(),
	innerShadowOpacityHandleId: z$1.string().nullable().optional(),
	outerGlowSizeHandleId: z$1.string().nullable().optional(),
	outerGlowSpreadHandleId: z$1.string().nullable().optional(),
	outerGlowOpacityHandleId: z$1.string().nullable().optional(),
	innerGlowSizeHandleId: z$1.string().nullable().optional(),
	innerGlowSpreadHandleId: z$1.string().nullable().optional(),
	innerGlowOpacityHandleId: z$1.string().nullable().optional(),
	strokeSizeHandleId: z$1.string().nullable().optional(),
	strokeOpacityHandleId: z$1.string().nullable().optional(),
	bevelEmbossDepthHandleId: z$1.string().nullable().optional(),
	bevelEmbossSizeHandleId: z$1.string().nullable().optional(),
	bevelEmbossSoftenHandleId: z$1.string().nullable().optional(),
	bevelEmbossAngleHandleId: z$1.string().nullable().optional(),
	bevelEmbossAltitudeHandleId: z$1.string().nullable().optional(),
	bevelEmbossHighlightOpacityHandleId: z$1.string().nullable().optional(),
	bevelEmbossShadowOpacityHandleId: z$1.string().nullable().optional(),
	colorOverlayOpacityHandleId: z$1.string().nullable().optional()
});
function computeLayerStylePadding(config) {
	let padX = 0;
	let padY = 0;
	if (config.dropShadow?.enabled) {
		const angleRad = (config.dropShadow.angle ?? 120) * Math.PI / 180;
		const dist = config.dropShadow.distance ?? 0;
		const dx = Math.ceil(Math.abs(Math.cos(angleRad)) * dist);
		const dy = Math.ceil(Math.abs(Math.sin(angleRad)) * dist);
		padX = Math.max(padX, dx);
		padY = Math.max(padY, dy);
	}
	if (config.stroke?.enabled && config.stroke.position !== "inside") {
		const strokePad = config.stroke.position === "outside" ? Math.ceil(config.stroke.size ?? 2) : Math.ceil((config.stroke.size ?? 2) * .5);
		padX = Math.max(padX, strokePad);
		padY = Math.max(padY, strokePad);
	}
	return {
		padX,
		padY
	};
}
const LAYER_STYLE_CONFIG_HANDLES = [
	{
		configKey: "dropShadowAngle",
		dataTypes: ["Number", "Signal"],
		label: "Drop Shadow Angle Signal",
		description: "Light angle for drop shadow in degrees (0–360°)."
	},
	{
		configKey: "dropShadowDistance",
		dataTypes: ["Number", "Signal"],
		label: "Drop Shadow Distance Signal",
		description: "Offset distance for drop shadow in pixels."
	},
	{
		configKey: "dropShadowSize",
		dataTypes: ["Number", "Signal"],
		label: "Drop Shadow Blur Signal",
		description: "Blur radius for drop shadow in pixels."
	},
	{
		configKey: "dropShadowSpread",
		dataTypes: ["Number", "Signal"],
		label: "Drop Shadow Spread Signal",
		description: "Edge expansion/sharpness percentage for drop shadow (0–100%)."
	},
	{
		configKey: "dropShadowOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Drop Shadow Opacity Signal",
		description: "Opacity multiplier for drop shadow (0–1)."
	},
	{
		configKey: "innerShadowAngle",
		dataTypes: ["Number", "Signal"],
		label: "Inner Shadow Angle Signal",
		description: "Light angle for inner shadow in degrees (0–360°)."
	},
	{
		configKey: "innerShadowDistance",
		dataTypes: ["Number", "Signal"],
		label: "Inner Shadow Distance Signal",
		description: "Offset distance for inner shadow in pixels."
	},
	{
		configKey: "innerShadowSize",
		dataTypes: ["Number", "Signal"],
		label: "Inner Shadow Blur Signal",
		description: "Blur radius for inner shadow in pixels."
	},
	{
		configKey: "innerShadowChoke",
		dataTypes: ["Number", "Signal"],
		label: "Inner Shadow Choke Signal",
		description: "Choke sharpness percentage for inner shadow (0–100%)."
	},
	{
		configKey: "innerShadowOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Inner Shadow Opacity Signal",
		description: "Opacity multiplier for inner shadow (0–1)."
	},
	{
		configKey: "outerGlowSize",
		dataTypes: ["Number", "Signal"],
		label: "Outer Glow Size Signal",
		description: "Glow radius for outer glow in pixels."
	},
	{
		configKey: "outerGlowSpread",
		dataTypes: ["Number", "Signal"],
		label: "Outer Glow Spread Signal",
		description: "Spread percentage for outer glow (0–100%)."
	},
	{
		configKey: "outerGlowOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Outer Glow Opacity Signal",
		description: "Opacity multiplier for outer glow (0–1)."
	},
	{
		configKey: "innerGlowSize",
		dataTypes: ["Number", "Signal"],
		label: "Inner Glow Size Signal",
		description: "Glow radius for inner glow in pixels."
	},
	{
		configKey: "innerGlowSpread",
		dataTypes: ["Number", "Signal"],
		label: "Inner Glow Spread Signal",
		description: "Spread percentage for inner glow (0–100%)."
	},
	{
		configKey: "innerGlowOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Inner Glow Opacity Signal",
		description: "Opacity multiplier for inner glow (0–1)."
	},
	{
		configKey: "strokeSize",
		dataTypes: ["Number", "Signal"],
		label: "Stroke Width Signal",
		description: "Stroke line width in pixels."
	},
	{
		configKey: "strokeOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Stroke Opacity Signal",
		description: "Opacity multiplier for stroke (0–1)."
	},
	{
		configKey: "bevelEmbossDepth",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Depth Signal",
		description: "Bevel depth / extrusion percentage (1–1000%)."
	},
	{
		configKey: "bevelEmbossSize",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Size Signal",
		description: "Bevel beveling size in pixels."
	},
	{
		configKey: "bevelEmbossSoften",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Soften Signal",
		description: "Edge softening blur radius in pixels."
	},
	{
		configKey: "bevelEmbossAngle",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Light Angle Signal",
		description: "Azimuth light direction in degrees (0–360°)."
	},
	{
		configKey: "bevelEmbossAltitude",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Light Altitude Signal",
		description: "Elevation light altitude in degrees (0–90°)."
	},
	{
		configKey: "bevelEmbossHighlightOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Highlight Opacity Signal",
		description: "Highlight specular intensity (0–1)."
	},
	{
		configKey: "bevelEmbossShadowOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Bevel Shadow Opacity Signal",
		description: "Shadow diffuse intensity (0–1)."
	},
	{
		configKey: "colorOverlayOpacity",
		dataTypes: ["Number", "Signal"],
		label: "Color Overlay Opacity Signal",
		description: "Color overlay blend opacity (0–1)."
	}
];
const LayerStyleResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const LAYER_STYLE_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { computeLayerStylePadding as a, LayerStyleResultSchema as i, LAYER_STYLE_OUTPUT_TYPE_MAP as n, LayerStyleNodeConfigSchema as r, LAYER_STYLE_CONFIG_HANDLES as t };