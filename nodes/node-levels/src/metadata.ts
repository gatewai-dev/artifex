import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	defaultLevelsConfig,
	type LevelsNodeConfig,
	LevelsNodeConfigSchema,
	LevelsResultSchema,
} from "./shared/index.js";

export { type LevelsNodeConfig, LevelsNodeConfigSchema, LevelsResultSchema };

export const metadata = defineMetadata({
	type: "Levels",
	displayName: "Levels",
	description: "Adjust tonal range and color balance with input/output levels",
	category: "Media",
	subcategory: undefined,
	configSchema: LevelsNodeConfigSchema,
	resultSchema: LevelsResultSchema,
	isTerminal: false,
	isTransient: true,
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
	defaultConfig: defaultLevelsConfig,
});
