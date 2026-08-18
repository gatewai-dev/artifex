import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ReverbNodeConfig,
	ReverbNodeConfigSchema,
	ReverbResultSchema,
	reverbConfig,
} from "./shared/index.js";

export { type ReverbNodeConfig, ReverbNodeConfigSchema, ReverbResultSchema };

export const metadata = defineMetadata({
	type: "Reverb",
	displayName: "Reverb",
	description: "Add room ambience and space to audio",
	category: "Media",
	subcategory: "Audio",
	configSchema: ReverbNodeConfigSchema,
	resultSchema: ReverbResultSchema,
	configHandles: reverbConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
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
		roomSize: 0.5,
		damping: 0.5,
		wet: 0.3,
		dry: 1.0,
		width: 1.0,
	} as ReverbNodeConfig,
});
