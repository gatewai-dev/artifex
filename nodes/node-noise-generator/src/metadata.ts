import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type NoiseGeneratorNodeConfig,
	NoiseGeneratorNodeConfigSchema,
	NoiseGeneratorResultSchema,
	noiseConfig,
} from "./shared/index.js";

export {
	type NoiseGeneratorNodeConfig,
	NoiseGeneratorNodeConfigSchema,
	NoiseGeneratorResultSchema,
};

export const metadata = defineMetadata({
	type: "NoiseGenerator",
	displayName: "Noise Generator",
	description: "Generate procedural Perlin, Simplex, and Voronoi noise.",
	category: "Media",
	subcategory: undefined,
	configSchema: NoiseGeneratorNodeConfigSchema,
	resultSchema: NoiseGeneratorResultSchema,
	configHandles: noiseConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	handles: {
		inputs: [],
		outputs: [
			{
				dataTypes: ["Image", "Video"],
				label: "Result",
				order: 0,
			},
		],
	},

	defaultConfig: {
		noiseType: "Perlin",
		outputType: "Image",
		width: 512,
		height: 512,
		scale: 10.0,
		octaves: 4,
		persistence: 0.5,
		lacunarity: 2.0,
		speed: 1.0,
		colorStart: "#000000",
		colorEnd: "#ffffff",
		durationMs: 5000,
		fps: 30,
	} as NoiseGeneratorNodeConfig,
});
