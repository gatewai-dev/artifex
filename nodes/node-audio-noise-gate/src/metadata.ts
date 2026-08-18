import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type NoiseGateNodeConfig,
	NoiseGateNodeConfigSchema,
	NoiseGateResultSchema,
	noiseGateConfig,
} from "./shared/index.js";

export {
	type NoiseGateNodeConfig,
	NoiseGateNodeConfigSchema,
	NoiseGateResultSchema,
};

export const metadata = defineMetadata({
	type: "NoiseGate",
	displayName: "Audio Noise Gate",
	description:
		"Silence background noise and hum below a certain volume threshold",
	category: "Media",
	subcategory: "Audio",
	configSchema: NoiseGateNodeConfigSchema,
	resultSchema: NoiseGateResultSchema,
	configHandles: noiseGateConfig.configHandles,
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
		threshold: -40,
		attack: 0.005,
		hold: 0.05,
		release: 0.1,
		range: -80,
	} as NoiseGateNodeConfig,
});
