import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	defaultShadowsHighlightsConfig,
	type ShadowsHighlightsNodeConfig,
	ShadowsHighlightsNodeConfigSchema,
	ShadowsHighlightsResultSchema,
	shadowsHighlightsConfig,
} from "./shared/index.js";

export {
	type ShadowsHighlightsNodeConfig,
	ShadowsHighlightsNodeConfigSchema,
	ShadowsHighlightsResultSchema,
};

export const metadata = defineMetadata({
	type: "ShadowsHighlights",
	displayName: "Shadows & Highlights",
	description:
		"Dynamic range recovery with independent shadow lifting, highlight suppression, and tonal width control",
	category: "Media",
	subcategory: undefined,
	configSchema: ShadowsHighlightsNodeConfigSchema,
	resultSchema: ShadowsHighlightsResultSchema,
	configHandles: shadowsHighlightsConfig.configHandles,
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
	defaultConfig: defaultShadowsHighlightsConfig,
});
