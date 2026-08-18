import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type BlurNodeConfig,
	BlurNodeConfigSchema,
	BlurResultSchema,
	blurConfig,
} from "./shared/index.js";

export { type BlurNodeConfig, BlurNodeConfigSchema, BlurResultSchema };

export const metadata = defineMetadata({
	type: "Blur",
	displayName: "Blur",
	description: "Apply blur to a media",
	category: "Media",
	subcategory: undefined,
	configSchema: BlurNodeConfigSchema,
	resultSchema: BlurResultSchema,
	configHandles: blurConfig.configHandles,
	// Not a terminal node - it won't process automatically after inputs change on browser
	isTerminal: false,
	// Results are stored in the temporary storage, so they are transient
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
		blurType: "Gaussian",
		strength: 5,
		angle: 0,
		sigmaColor: 0.1,
		centerX: 0.5,
		centerY: 0.5,
	} as BlurNodeConfig,
});
