import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type DisplacementMapNodeConfig,
	DisplacementMapNodeConfigSchema,
	DisplacementMapResultSchema,
	displacementMapConfig,
} from "./shared/index.js";

export {
	type DisplacementMapNodeConfig,
	DisplacementMapNodeConfigSchema,
	DisplacementMapResultSchema,
};

export const metadata = defineMetadata({
	type: "DisplacementMap",
	displayName: "Displacement Map",
	description: "Distort media using a displacement map texture",
	category: "Media",
	subcategory: undefined,
	configSchema: DisplacementMapNodeConfigSchema,
	resultSchema: DisplacementMapResultSchema,
	configHandles: displacementMapConfig.configHandles,
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
			{
				dataTypes: ["Image", "Video"],
				required: true,
				label: "Map",
				order: 1,
				description:
					"Displacement map texture. Connect a Noise Generator or any grayscale texture.",
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
		strengthX: 50,
		strengthY: 50,
		xChannel: "Red",
		yChannel: "Green",
		wrapMode: "Clamp",
	} as DisplacementMapNodeConfig,
});
