import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	CornerPinNodeConfigSchema,
	CornerPinResultSchema,
} from "./shared/index.js";
import { getDefaultPoints } from "./shared/utils.js";

export { CornerPinNodeConfigSchema, CornerPinResultSchema };

export const metadata = defineMetadata({
	type: "CornerPin",
	displayName: "Corner Pin",
	description: "Four-point perspective warp",
	category: "Media",
	subcategory: undefined,
	configSchema: CornerPinNodeConfigSchema,
	resultSchema: CornerPinResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "Video", "SVG", "GIF", "Lottie"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Warped",
				order: 0,
				description: "The perspective warped media output",
			},
		],
	},
	defaultConfig: {
		points: getDefaultPoints(),
	},
});
