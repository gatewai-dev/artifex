import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type StereoPanningNodeConfig,
	StereoPanningNodeConfigSchema,
	StereoPanningResultSchema,
} from "./shared/index.js";

export {
	type StereoPanningNodeConfig,
	StereoPanningNodeConfigSchema,
	StereoPanningResultSchema,
};

export const metadata = defineMetadata({
	type: "StereoPanning",
	displayName: "Stereo Panning",
	description: "Balance audio output between left and right channels",
	category: "Media",
	subcategory: "Audio",
	configSchema: StereoPanningNodeConfigSchema,
	resultSchema: StereoPanningResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Audio", "Video"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Audio", "Video"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {
		pan: 0,
	} as StereoPanningNodeConfig,
});
