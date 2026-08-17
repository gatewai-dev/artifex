import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-high-pass/dist/config-DdPHmjAf.mjs
const MAX_RADIUS = 250;
const highPassConfig = configBuilder().field("radius", z$1.number().min(.1).max(MAX_RADIUS).default(3), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Radius Signal",
	description: "The cutoff radius in pixels. Frequencies smaller than this radius are preserved."
}).field("contrastBoost", z$1.number().multipleOf(.01).min(1).max(10).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Contrast Boost Signal",
	description: "Multiplier applied to the extracted high-frequency detail delta."
}).field("monochrome", z$1.boolean().default(true), { description: "When enabled, high-pass delta is converted to luminance before centering on 50% neutral gray." }).build();
const HighPassNodeConfigSchema = highPassConfig.schema;
const HighPassResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const HIGH_PASS_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { highPassConfig as a, MAX_RADIUS as i, HighPassNodeConfigSchema as n, HighPassResultSchema as r, HIGH_PASS_OUTPUT_TYPE_MAP as t };