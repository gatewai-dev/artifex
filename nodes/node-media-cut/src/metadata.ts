import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type MediaCutConfig,
	MediaCutConfigSchema,
	MediaCutResultSchema,
} from "./shared/index.js";

export { MediaCutConfigSchema, MediaCutResultSchema };

export const metadata = defineMetadata({
	type: "MediaCut",
	displayName: "Cut",
	description:
		"Cut video, audio, lottie or gif by specifying start and end times.",
	category: "Media",
	subcategory: undefined,
	configSchema: MediaCutConfigSchema,
	resultSchema: MediaCutResultSchema,
	isTerminal: false,
	isTransient: false,
	handles: {
		inputs: [
			{
				dataTypes: ["Video", "Audio", "Lottie", "GIF"],
				required: true,
				label: "Media",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Video", "Audio", "Lottie", "GIF"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {
		segments: [],
	} as MediaCutConfig,
});
