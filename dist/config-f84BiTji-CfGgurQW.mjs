import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-CvLMtr8b.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-blur/dist/config-f84BiTji.mjs
const MAX_BLUR = 100;
const blurConfig = configBuilder().field("blurType", z$1.enum([
	"Gaussian",
	"Box",
	"Median",
	"Motion",
	"Bilateral",
	"Edge-preserving",
	"Radial",
	"Zoom"
]).default("Gaussian"), {
	bindable: false,
	label: "Blur Type"
}).field("strength", z$1.number().min(0).max(MAX_BLUR).default(5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Strength Signal",
	description: "The intensity of the blur. 0 = no blur. Can be modulated by a static number or a dynamic signal."
}).field("angle", z$1.number().int().min(0).max(360).default(0), {
	bindable: false,
	label: "Angle"
}).field("sigmaColor", z$1.number().min(.01).max(1).default(.1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Color Sigma Signal",
	description: "Sigma value for color space in Bilateral / Edge-preserving blurs. Can be modulated by a static number or a dynamic signal."
}).field("centerX", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Center X Signal",
	description: "The X coordinate of the blur center (0.0 to 1.0). Can be modulated by a static number or a dynamic signal."
}).field("centerY", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Center Y Signal",
	description: "The Y coordinate of the blur center (0.0 to 1.0). Can be modulated by a static number or a dynamic signal."
}).field("partialBlur", z$1.boolean().default(false), {
	bindable: false,
	label: "Partial Blur",
	description: "Blurs only a specific circular area around center point."
}).field("radius", z$1.number().min(.01).max(1).default(.3), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Partial Radius Signal",
	description: "Radius of the partial blur region (0.01 to 1.0). Can be modulated by a static number or a dynamic signal."
}).build();
const BlurNodeConfigSchema = blurConfig.schema;
const BlurResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const BLUR_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { blurConfig as a, MAX_BLUR as i, BlurNodeConfigSchema as n, BlurResultSchema as r, BLUR_OUTPUT_TYPE_MAP as t };