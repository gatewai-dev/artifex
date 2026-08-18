import { defineMetadata } from "@gatewai.studio/node-sdk";
import { NumberNodeConfigSchema, NumberResultSchema } from "./shared/index.js";

export { NumberNodeConfigSchema, NumberResultSchema };

export const metadata = defineMetadata({
	type: "Number",
	displayName: "Number",
	description: "Number input node",
	category: "Input/Output",
	showInQuickAccess: false,
	configSchema: NumberNodeConfigSchema,
	resultSchema: NumberResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{ dataTypes: ["Number"], label: "Result", order: 0 }],
	},
	defaultConfig: { value: 0 },
});
