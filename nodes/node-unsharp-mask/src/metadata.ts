import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type UnsharpMaskNodeConfig,
	UnsharpMaskNodeConfigSchema,
	UnsharpMaskResultSchema,
	unsharpMaskConfig,
} from "./shared/index.js";

export {
	type UnsharpMaskNodeConfig,
	UnsharpMaskNodeConfigSchema,
	UnsharpMaskResultSchema,
};

export const metadata = defineMetadata({
	type: "UnsharpMask",
	displayName: "Unsharp Mask",
	description:
		"Enhance edge contrast and texture sharpness with precision Gaussian unsharp masking",
	category: "Media",
	subcategory: undefined,
	configSchema: UnsharpMaskNodeConfigSchema,
	resultSchema: UnsharpMaskResultSchema,
	configHandles: unsharpMaskConfig.configHandles,
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
		amount: 100,
		radius: 1.5,
		threshold: 3,
	} as UnsharpMaskNodeConfig,
});
