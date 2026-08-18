import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type DelayNodeConfig,
	DelayNodeConfigSchema,
	DelayResultSchema,
	delayConfig,
} from "./shared/index.js";

export { type DelayNodeConfig, DelayNodeConfigSchema, DelayResultSchema };

export const metadata = defineMetadata({
	type: "Delay",
	displayName: "Delay / Echo",
	description: "Add repeating echo effect for audio and video",
	category: "Media",
	subcategory: "Audio",
	configSchema: DelayNodeConfigSchema,
	resultSchema: DelayResultSchema,
	configHandles: delayConfig.configHandles,
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
		delayTime: 0.25,
		feedback: 0.4,
		wet: 0.3,
		dry: 1.0,
		pingPong: false,
	} as DelayNodeConfig,
});
