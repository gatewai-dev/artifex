import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	VideoToAudioNodeConfigSchema,
	VideoToAudioResultSchema,
} from "./shared/index.js";

export { VideoToAudioNodeConfigSchema, VideoToAudioResultSchema };

export const metadata = defineMetadata({
	type: "VideoToAudio",
	displayName: "Video to Audio",
	description: "Converts a video input to an audio output.",
	category: "Media",
	subcategory: "Audio",
	configSchema: VideoToAudioNodeConfigSchema,
	resultSchema: VideoToAudioResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Video"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Audio"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {},
});
