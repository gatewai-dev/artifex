import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type LutNodeConfig,
	LutNodeConfigSchema,
	LutResultSchema,
	lutConfig,
} from "./shared/index.js";

export { type LutNodeConfig, LutNodeConfigSchema, LutResultSchema };

export const metadata = defineMetadata({
	type: "ApplyLUT",
	displayName: "Apply LUT",
	description: "Apply a color lookup table (.cube) to media",
	category: "Media",
	subcategory: undefined,
	configSchema: LutNodeConfigSchema,
	resultSchema: LutResultSchema,
	configHandles: lutConfig.configHandles,
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
			{
				dataTypes: ["LUT"],
				required: true,
				label: "Lut",
				order: 1,
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
		intensity: 1.0,
	} as LutNodeConfig,
});
