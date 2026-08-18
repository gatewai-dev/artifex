import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ProceduralVFXNodeConfig,
	ProceduralVFXNodeConfigSchema,
	ProceduralVFXResultSchema,
	proceduralVFXConfig,
} from "./shared/index.js";

export {
	type ProceduralVFXNodeConfig,
	ProceduralVFXNodeConfigSchema,
	ProceduralVFXResultSchema,
};

export const metadata = defineMetadata({
	type: "ProceduralVFX",
	displayName: "Procedural VFX",
	description:
		"Generate procedural particles and visual effects (smoke, fire, rain, snow, sparks, lightning, lens flares, energy beams) from scratch.",
	category: "Media",
	subcategory: "Generators",
	configSchema: ProceduralVFXNodeConfigSchema,
	resultSchema: ProceduralVFXResultSchema,
	configHandles: proceduralVFXConfig.configHandles,
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
		effectType: "Smoke",
		outputType: "Video",
		width: 1080,
		height: 1080,
		density: 0.6,
		scale: 0.01,
		speed: 1.0,
		intensity: 0.8,
		seed: 1234,
		colorStart: "#ffffff",
		colorEnd: "#ff5500",
		durationMs: 5000,
		fps: 24,
	} as ProceduralVFXNodeConfig,
});
