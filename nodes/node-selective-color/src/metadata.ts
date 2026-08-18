import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	defaultSelectiveColorConfig,
	type SelectiveColorNodeConfig,
	SelectiveColorNodeConfigSchema,
	type SelectiveColorResult,
	SelectiveColorResultSchema,
	selectiveColorConfig,
} from "./shared/index.js";

export {
	type SelectiveColorNodeConfig,
	SelectiveColorNodeConfigSchema,
	type SelectiveColorResult,
	SelectiveColorResultSchema,
};

export const metadata = defineMetadata({
	type: "SelectiveColor",
	displayName: "Selective Color",
	description:
		"Photoshop standard CMYK color grading across 9 targeted color ranges without edge artifacts.",
	category: "Media",
	subcategory: undefined,
	configSchema: SelectiveColorNodeConfigSchema,
	resultSchema: SelectiveColorResultSchema,
	configHandles: selectiveColorConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Input",
				order: 0,
				required: true,
				description: "Media input to apply selective color grading onto",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Color graded output media",
			},
		],
	},
	defaultConfig: defaultSelectiveColorConfig,
});
