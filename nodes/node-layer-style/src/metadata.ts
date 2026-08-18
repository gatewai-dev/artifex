import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	LAYER_STYLE_CONFIG_HANDLES,
	type LayerStyleNodeConfig,
	LayerStyleNodeConfigSchema,
	LayerStyleResultSchema,
} from "./shared/index.js";

export {
	type LayerStyleNodeConfig,
	LayerStyleNodeConfigSchema,
	LayerStyleResultSchema,
};

export const metadata = defineMetadata({
	type: "LayerStyle",
	displayName: "Layer Style",
	description:
		"Applies procedural layer styles to an alpha-isolated layer or graphic. Calculates distance field vectors, inner/outer alpha convolutions, and light elevation models to generate standard Photoshop FX.",
	category: "Media",
	subcategory: undefined,
	configSchema: LayerStyleNodeConfigSchema,
	resultSchema: LayerStyleResultSchema,
	configHandles: LAYER_STYLE_CONFIG_HANDLES,
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
	defaultConfig: LayerStyleNodeConfigSchema.parse({}),
});
