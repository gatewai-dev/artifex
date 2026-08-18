import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ModulateNodeConfig,
	ModulateNodeConfigSchema,
	ModulateResultSchema,
	modulateConfig,
} from "./shared/index.js";

export {
	type ModulateNodeConfig,
	ModulateNodeConfigSchema,
	ModulateResultSchema,
};

export const metadata = defineMetadata({
	type: "Modulate",
	displayName: "Modulate",
	description: "Apply Modulate adjustments to an image",
	category: "Media",
	subcategory: undefined,
	configSchema: ModulateNodeConfigSchema,
	resultSchema: ModulateResultSchema,
	configHandles: modulateConfig.configHandles,
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
			{ dataTypes: ["Image", "Video", "GIF"], label: "Result", order: 0 },
		],
	},
	defaultConfig: {
		hue: 0,
		brightness: 1,
		contrast: 1,
		exposure: 0,
		saturation: 1,
		sepia: 0,
	} as ModulateNodeConfig,
});
