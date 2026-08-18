import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ColorKeyNodeConfig,
	ColorKeyNodeConfigSchema,
	ColorKeyResultSchema,
	colorKeyConfig,
} from "./shared/index.js";

export {
	type ColorKeyNodeConfig,
	ColorKeyNodeConfigSchema,
	ColorKeyResultSchema,
};

export const metadata = defineMetadata({
	type: "ColorKey",
	displayName: "Color Key",
	description: "Key out a color (chroma key) with spill suppression",
	category: "Media",
	subcategory: undefined,
	configSchema: ColorKeyNodeConfigSchema,
	resultSchema: ColorKeyResultSchema,
	configHandles: colorKeyConfig.configHandles,
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
		keyColor: "#00ff00",
		similarity: 0.4,
		smoothness: 0.1,
		spillSuppression: 0.2,
		colorSpace: "YUV",
		spillSuppressionType: "Desaturate",
	} as ColorKeyNodeConfig,
});
