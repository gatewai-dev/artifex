import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ParametricEqNodeConfig,
	ParametricEqNodeConfigSchema,
	ParametricEqResultSchema,
	parametricEqConfig,
} from "./shared/index.js";

export {
	type ParametricEqNodeConfig,
	ParametricEqNodeConfigSchema,
	ParametricEqResultSchema,
};

export const metadata = defineMetadata({
	type: "ParametricEq",
	displayName: "Parametric EQ",
	description:
		"Boost or cut specific frequency ranges using biquad IIR filters",
	category: "Media",
	subcategory: "Audio",
	configSchema: ParametricEqNodeConfigSchema,
	resultSchema: ParametricEqResultSchema,
	configHandles: parametricEqConfig.configHandles,
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
		type: "peak",
		frequency: 1000,
		gain: 0,
		q: 1.0,
	} as ParametricEqNodeConfig,
});
