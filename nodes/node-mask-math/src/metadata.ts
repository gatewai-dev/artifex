import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	MaskMathNodeConfigSchema,
	MaskMathResultSchema,
	maskMathConfig,
} from "./shared/index.js";

export { MaskMathNodeConfigSchema, MaskMathResultSchema };

export const metadata = defineMetadata({
	type: "MaskMath",
	displayName: "Mask Math",
	description:
		"Morphological (dilate, erode, choke, feather) and Boolean set operations (union, intersect, subtract, difference, invert) on alpha/matte masks",
	category: "Media",
	subcategory: undefined,
	configSchema: MaskMathNodeConfigSchema,
	resultSchema: MaskMathResultSchema,
	configHandles: maskMathConfig.configHandles,
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
				label: "Mask A",
				order: 0,
				required: true,
				description: "Primary matte or image source",
			},
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Mask B",
				order: 1,
				required: false,
				description: "Secondary matte for dual-mask Boolean operations",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Resulting processed alpha matte or masked image",
			},
		],
	},
	defaultConfig: {
		operation: "Union",
		radius: 0,
		threshold: 0.5,
		clampMin: 0.0,
		clampMax: 1.0,
		channelA: "Alpha",
		channelB: "Alpha",
		binarize: false,
		invertResult: false,
		outputFormat: "WhiteWithAlpha",
	},
});
