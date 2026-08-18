import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type HighPassNodeConfig,
	HighPassNodeConfigSchema,
	HighPassResultSchema,
	highPassConfig,
} from "./shared/index.js";

export {
	type HighPassNodeConfig,
	HighPassNodeConfigSchema,
	HighPassResultSchema,
};

export const metadata = defineMetadata({
	type: "HighPass",
	displayName: "High Pass",
	description:
		"Extract high-frequency edge details and textures for frequency separation and sharpening",
	category: "Media",
	subcategory: undefined,
	configSchema: HighPassNodeConfigSchema,
	resultSchema: HighPassResultSchema,
	configHandles: highPassConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {
		radius: 3.0,
		contrastBoost: 1.0,
		monochrome: true,
	} as HighPassNodeConfig,
});
