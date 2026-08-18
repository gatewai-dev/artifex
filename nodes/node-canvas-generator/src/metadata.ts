import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type CanvasGeneratorNodeConfig,
	CanvasGeneratorNodeConfigSchema,
	CanvasGeneratorResultSchema,
} from "./shared/index.js";

export {
	type CanvasGeneratorNodeConfig,
	CanvasGeneratorNodeConfigSchema,
	CanvasGeneratorResultSchema,
};

export const metadata = defineMetadata({
	type: "CanvasGenerator",
	displayName: "Canvas Generator",
	description: "Create blank canvases or custom gradients from scratch",
	category: "Media",
	subcategory: undefined,
	configSchema: CanvasGeneratorNodeConfigSchema,
	resultSchema: CanvasGeneratorResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [
			{
				dataTypes: ["Image"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: {
		width: 1920,
		height: 1080,
		fillType: "solid",
		solidColor: "#3b82f6",
		gradientStart: "#3b82f6",
		gradientEnd: "#1d4ed8",
		gradientAngle: 180,
		radialCenterX: 0.5,
		radialCenterY: 0.5,
		radialRadius: 0.5,
	} as CanvasGeneratorNodeConfig,
});
