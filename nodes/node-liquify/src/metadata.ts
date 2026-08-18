import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type LiquifyNodeConfig,
	LiquifyNodeConfigSchema,
	LiquifyResultSchema,
	liquifyConfig,
} from "./shared/index.js";

export { type LiquifyNodeConfig, LiquifyNodeConfigSchema, LiquifyResultSchema };

export const metadata = defineMetadata({
	type: "Liquify",
	displayName: "Liquify",
	description:
		"Apply localized push, pull, bloat, pucker, and twirl distortions with smooth radial falloff",
	category: "Media",
	subcategory: undefined,
	configSchema: LiquifyNodeConfigSchema,
	resultSchema: LiquifyResultSchema,
	configHandles: liquifyConfig.configHandles,
	isTerminal: false,
	isTransient: true,
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
		operations: [],
	} as LiquifyNodeConfig,
});
