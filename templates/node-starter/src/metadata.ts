import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type StarterNodeConfig,
	StarterNodeConfigSchema,
	StarterResultSchema,
} from "./shared/index.js";

export { type StarterNodeConfig, StarterNodeConfigSchema, StarterResultSchema };

export const metadata = defineMetadata({
	type: "Starter",
	displayName: "Starter Node",
	description: "Starter transformation node template",
	category: "Media",
	configSchema: StarterNodeConfigSchema,
	resultSchema: StarterResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "Video"] as DataType[],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video"] as DataType[],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {
		strength: 1,
		enabled: true,
	} as StarterNodeConfig,
});
