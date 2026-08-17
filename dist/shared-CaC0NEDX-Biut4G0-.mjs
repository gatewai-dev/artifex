import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-refine-edge/dist/shared-CaC0NEDX.mjs
const MIN_DECONTAMINATE = 0;
const MAX_DECONTAMINATE = 1;
const MIN_RADIUS = .5;
const MAX_RADIUS = 50;
const MIN_SMOOTH = 0;
const MAX_SMOOTH = 100;
const MIN_FEATHER = 0;
const MAX_FEATHER = 50;
const MIN_SHIFT_EDGE = -100;
const MAX_SHIFT_EDGE = 100;
const MatteChannelEnum = z$1.enum([
	"Alpha",
	"Luminance",
	"Red",
	"Green",
	"Blue"
]);
const RefineEdgeOutputModeEnum = z$1.enum([
	"Composite",
	"MatteOnly",
	"DecontaminatedRGB"
]);
const refineEdgeConfig = configBuilder().field("decontaminateAmount", z$1.number().multipleOf(.01).min(MIN_DECONTAMINATE).max(MAX_DECONTAMINATE).default(.7), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Decontaminate Colors",
	description: "Amount of edge color spill decontamination/defringing (0.0–1.0)."
}).field("radius", z$1.number().multipleOf(.1).min(MIN_RADIUS).max(MAX_RADIUS).default(2), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Edge Detection Radius (px)",
	description: "Radius in pixels around alpha transitions to refine and decontaminate."
}).field("smooth", z$1.number().min(MIN_SMOOTH).max(MAX_SMOOTH).default(5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Smoothness",
	description: "Matte edge smoothing curve intensity (0–100)."
}).field("feather", z$1.number().multipleOf(.1).min(MIN_FEATHER).max(MAX_FEATHER).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Feather (px)",
	description: "Sub-pixel gaussian softness along the matte boundary."
}).field("shiftEdge", z$1.number().min(MIN_SHIFT_EDGE).max(MAX_SHIFT_EDGE).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shift Edge (%)",
	description: "Contract (<0) or expand (>0) the edge boundary (-100% to +100%)."
}).field("matteChannel", MatteChannelEnum.default("Alpha"), {
	label: "Matte Channel",
	description: "Channel to extract matte from (Alpha, Luminance, Red, Green, Blue)."
}).field("outputMode", RefineEdgeOutputModeEnum.default("Composite"), {
	label: "Output Mode",
	description: "Composite (decontaminated RGB + refined alpha), MatteOnly (grayscale mask), DecontaminatedRGB (clean RGB with full alpha)."
}).build();
const RefineEdgeNodeConfigSchema = refineEdgeConfig.schema;
const RefineEdgeResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const REFINE_EDGE_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { MAX_SMOOTH as a, MIN_RADIUS as c, REFINE_EDGE_OUTPUT_TYPE_MAP as d, RefineEdgeNodeConfigSchema as f, MAX_SHIFT_EDGE as i, MIN_SHIFT_EDGE as l, refineEdgeConfig as m, MAX_FEATHER as n, MIN_DECONTAMINATE as o, RefineEdgeResultSchema as p, MAX_RADIUS as r, MIN_FEATHER as s, MAX_DECONTAMINATE as t, MIN_SMOOTH as u };