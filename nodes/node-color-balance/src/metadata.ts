import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ColorBalanceNodeConfig,
	ColorBalanceNodeConfigSchema,
	type ColorBalanceResult,
	ColorBalanceResultSchema,
	colorBalanceConfig,
	defaultColorBalanceConfig,
} from "./shared/index.js";

export {
	type ColorBalanceNodeConfig,
	ColorBalanceNodeConfigSchema,
	type ColorBalanceResult,
	ColorBalanceResultSchema,
};

export const metadata = defineMetadata({
	type: "ColorBalance",
	displayName: "Color Balance",
	description:
		"Shifts color balance of Shadows, Midtones, and Highlights along Cyan-Red, Magenta-Green, and Yellow-Blue axes",
	category: "Media",
	subcategory: undefined,
	configSchema: ColorBalanceNodeConfigSchema,
	resultSchema: ColorBalanceResultSchema,
	configHandles: colorBalanceConfig.configHandles,
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
	defaultConfig: defaultColorBalanceConfig,
});
