import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-mask-math/dist/shared-BPLI1__V.mjs
const MAX_RADIUS = 200;
const MaskOperationEnum = z$1.enum([
	"Union",
	"Intersect",
	"Subtract",
	"Difference",
	"Invert",
	"Dilate",
	"Erode",
	"Choke",
	"Feather"
]);
const MaskChannelEnum = z$1.enum([
	"Alpha",
	"Luminance",
	"Red",
	"Green",
	"Blue"
]);
const MaskOutputFormatEnum = z$1.enum([
	"WhiteWithAlpha",
	"GrayscaleRGB",
	"AlphaOnly",
	"PassthroughRGB"
]);
const maskMathConfig = configBuilder().field("operation", MaskOperationEnum.default("Union"), {
	label: "Operation",
	description: "Morphological or Boolean set operation applied to input alpha masks."
}).field("radius", z$1.number().min(0).max(MAX_RADIUS).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Radius / Width (px)",
	description: "Kernel radius in pixels for Dilate, Erode, Choke, or Feather operations."
}).field("threshold", z$1.number().multipleOf(.01).min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Threshold",
	description: "Cutoff threshold level (0.0–1.0) for binarization step or non-linear choke."
}).field("clampMin", z$1.number().multipleOf(.01).min(0).max(1).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Clamp Min",
	description: "Minimum alpha matte cutoff limit (0.0–1.0)."
}).field("clampMax", z$1.number().multipleOf(.01).min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Clamp Max",
	description: "Maximum alpha matte cutoff limit (0.0–1.0)."
}).field("channelA", MaskChannelEnum.default("Alpha"), {
	label: "Mask A Channel",
	description: "Source channel to extract mask from Mask A (Alpha, Luminance, Red, Green, Blue)."
}).field("channelB", MaskChannelEnum.default("Alpha"), {
	label: "Mask B Channel",
	description: "Source channel to extract mask from Mask B (Alpha, Luminance, Red, Green, Blue)."
}).field("binarize", z$1.boolean().default(false), {
	label: "Binarize",
	description: "When enabled, outputs crisp 1-bit binary matte based on threshold."
}).field("invertResult", z$1.boolean().default(false), {
	label: "Invert Result",
	description: "Inverts final matte output."
}).field("outputFormat", MaskOutputFormatEnum.default("WhiteWithAlpha"), {
	label: "Output Format",
	description: "WhiteWithAlpha (rgba(1,1,1,a)), GrayscaleRGB (rgba(a,a,a,1)), AlphaOnly (rgba(0,0,0,a)), PassthroughRGB (Mask A RGB with new alpha)."
}).build();
const MaskMathNodeConfigSchema = maskMathConfig.schema;
const MaskMathResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const MASK_MATH_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { maskMathConfig as a, MaskMathResultSchema as i, MAX_RADIUS as n, MaskMathNodeConfigSchema as r, MASK_MATH_OUTPUT_TYPE_MAP as t };