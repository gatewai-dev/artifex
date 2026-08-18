import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ExtractFrameConfig,
	ExtractFrameConfigSchema,
	ExtractFrameResultSchema,
} from "./shared/index.js";

export { ExtractFrameConfigSchema, ExtractFrameResultSchema };

export const metadata = defineMetadata({
	type: "ExtractFrame",
	displayName: "Extract Frame",
	description: "Extract a single frame from a video, Lottie or GIF",
	category: "Media",
	subcategory: undefined,
	configSchema: ExtractFrameConfigSchema,
	resultSchema: ExtractFrameResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Video", "Lottie", "GIF"],
				required: true,
				label: "Media",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Image"],
				label: "Frame",
				order: 0,
			},
		],
	},
	defaultConfig: {
		frame: 0,
	} as ExtractFrameConfig,
});
