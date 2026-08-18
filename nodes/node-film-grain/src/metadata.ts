import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type FilmGrainNodeConfig,
	FilmGrainNodeConfigSchema,
	FilmGrainResultSchema,
	filmGrainConfig,
} from "./shared/index.js";

export {
	type FilmGrainNodeConfig,
	FilmGrainNodeConfigSchema,
	FilmGrainResultSchema,
};

export const metadata = defineMetadata({
	type: "FilmGrain",
	displayName: "Film Grain",
	description: "Apply organic, cinematic film grain texture to media",
	category: "Media",
	subcategory: undefined,
	configSchema: FilmGrainNodeConfigSchema,
	resultSchema: FilmGrainResultSchema,
	configHandles: filmGrainConfig.configHandles,
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

	defaultConfig: {
		strength: 15,
		size: 1.5,
		monochrome: true,
		animated: true,
		speed: 50,
		shadows: 0.2,
		midtones: 1.0,
		highlights: 0.2,
	} as FilmGrainNodeConfig,
});
