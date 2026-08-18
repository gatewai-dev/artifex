import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	PatchHealNodeConfigSchema,
	PatchHealResultSchema,
	patchHealConfig,
} from "./shared/index.js";

export { PatchHealNodeConfigSchema, PatchHealResultSchema };

export const metadata = defineMetadata({
	type: "PatchHeal",
	displayName: "Patch Heal",
	description:
		"Coordinate-offset clone stamping, texture transfer, and seamless gradient healing",
	category: "Media",
	subcategory: undefined,
	configSchema: PatchHealNodeConfigSchema,
	resultSchema: PatchHealResultSchema,
	configHandles: patchHealConfig.configHandles,
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
				label: "Input",
				order: 0,
				required: true,
				description: "Target media to heal or clone onto",
			},
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Mask",
				order: 1,
				required: false,
				description: "Optional mask defining the region to heal/stamp",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Healed/cloned media output",
			},
		],
	},
	defaultConfig: {
		centerX: 0.5,
		centerY: 0.5,
		offsetX: 50,
		offsetY: 0,
		radius: 25,
		feather: 50,
		opacity: 1.0,
		mode: "SeamlessHeal",
	},
});
