import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-unsharp-mask/dist/config-CG4t7edh.mjs
const MAX_RADIUS = 50;
const MAX_AMOUNT = 500;
const MAX_THRESHOLD = 255;
const unsharpMaskConfig = configBuilder().field("amount", z$1.number().min(0).max(MAX_AMOUNT).default(100), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Amount Signal",
	description: "Sharpening intensity percentage (0–500%)."
}).field("radius", z$1.number().min(.1).max(MAX_RADIUS).default(1.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Radius Signal",
	description: "The Gaussian blur radius in pixels used to detect edge contrast."
}).field("threshold", z$1.number().int().min(0).max(MAX_THRESHOLD).default(3), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Threshold Signal",
	description: "Minimum tonal level difference (0–255) required before sharpening is applied to avoid amplifying noise."
}).build();
const UnsharpMaskNodeConfigSchema = unsharpMaskConfig.schema;
const UnsharpMaskResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const UNSHARP_MASK_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};

//#endregion
export { UnsharpMaskNodeConfigSchema as a, UNSHARP_MASK_OUTPUT_TYPE_MAP as i, MAX_RADIUS as n, UnsharpMaskResultSchema as o, MAX_THRESHOLD as r, unsharpMaskConfig as s, MAX_AMOUNT as t };