import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type FadeNodeConfig,
	FadeNodeConfigSchema,
	FadeResultSchema,
	fadeConfig,
} from "./shared/index.js";

export { type FadeNodeConfig, FadeNodeConfigSchema, FadeResultSchema };

export const metadata = defineMetadata({
	type: "AudioFade",
	displayName: "Fade In / Fade Out",
	description: "Applies a configurable gain envelope for audio and video.",
	category: "Media",
	subcategory: "Audio",
	configSchema: FadeNodeConfigSchema,
	resultSchema: FadeResultSchema,
	configHandles: fadeConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	handles: {
		inputs: [
			{
				dataTypes: ["Audio", "Video"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Audio", "Video"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {
		fadeInDuration: 0.0,
		fadeOutDuration: 0.0,
		fadeInCurve: "linear",
		fadeOutCurve: "linear",
	} as FadeNodeConfig,
});
