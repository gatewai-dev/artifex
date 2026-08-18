import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	defaultGradientMapConfig,
	type GradientMapNodeConfig,
	GradientMapNodeConfigSchema,
	type GradientMapResult,
	GradientMapResultSchema,
	gradientMapConfig,
} from "./shared/index.js";

export {
	type GradientMapNodeConfig,
	GradientMapNodeConfigSchema,
	type GradientMapResult,
	GradientMapResultSchema,
};

export const metadata = defineMetadata({
	type: "GradientMap",
	displayName: "Gradient Map",
	description:
		"Replaces luminance values with colors sampled along a custom multi-stop color gradient",
	category: "Media",
	subcategory: undefined,
	configSchema: GradientMapNodeConfigSchema,
	resultSchema: GradientMapResultSchema,
	configHandles: gradientMapConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "GIF", "Lottie"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{ dataTypes: ["Image", "Video", "GIF"], label: "Result", order: 0 },
		],
	},
	defaultConfig: defaultGradientMapConfig,
});
