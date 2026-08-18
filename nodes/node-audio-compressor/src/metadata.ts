import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type CompressorNodeConfig,
	CompressorNodeConfigSchema,
	CompressorResultSchema,
	compressorConfig,
} from "./shared/index.js";

export {
	type CompressorNodeConfig,
	CompressorNodeConfigSchema,
	CompressorResultSchema,
};

export const metadata = defineMetadata({
	type: "Compressor",
	displayName: "Audio Compressor",
	description: "Smooth out dynamic range and prevent audio clipping/distortion",
	category: "Media",
	subcategory: "Audio",
	configSchema: CompressorNodeConfigSchema,
	resultSchema: CompressorResultSchema,
	configHandles: compressorConfig.configHandles,
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
		threshold: -24,
		ratio: 4,
		attack: 0.003,
		release: 0.25,
		knee: 6,
		makeupGain: 0,
	} as CompressorNodeConfig,
});
