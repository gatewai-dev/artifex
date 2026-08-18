import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type FlipNodeConfig,
	FlipNodeConfigSchema,
	FlipResultSchema,
	flipConfig,
} from "./shared/index.js";

export { type FlipNodeConfig, FlipNodeConfigSchema, FlipResultSchema };

export const metadata = defineMetadata({
	type: "Flip",
	displayName: "Flip",
	description:
		"Mirror, flip, transpose, or reflect visual media horizontally, vertically, diagonally, or in kaleidoscopic split symmetry",
	category: "Media",
	subcategory: undefined,
	configSchema: FlipNodeConfigSchema,
	resultSchema: FlipResultSchema,
	configHandles: flipConfig.configHandles,
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
		horizontal: true,
		vertical: false,
		diagonal: false,
		mode: "horizontal",
		symmetry: "none",
	} as FlipNodeConfig,
});
