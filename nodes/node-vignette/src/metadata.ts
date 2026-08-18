import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type VignetteNodeConfig,
	VignetteNodeConfigSchema,
	VignetteResultSchema,
	vignetteConfig,
} from "./shared/index.js";

export {
	type VignetteNodeConfig,
	VignetteNodeConfigSchema,
	VignetteResultSchema,
};

export const metadata = defineMetadata({
	type: "Vignette",
	displayName: "Vignette",
	description:
		"Apply a classic vignette effect with dark corners to visual media",
	category: "Media",
	subcategory: undefined,
	configSchema: VignetteNodeConfigSchema,
	resultSchema: VignetteResultSchema,
	configHandles: vignetteConfig.configHandles,
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
		strength: 50,
		radius: 1.0,
		softness: 0.5,
		roundness: 0.5,
		centerX: 0.5,
		centerY: 0.5,
	} as VignetteNodeConfig,
});
