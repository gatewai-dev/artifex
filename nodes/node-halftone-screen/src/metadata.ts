import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type HalftoneScreenNodeConfig,
	HalftoneScreenNodeConfigSchema,
	HalftoneScreenResultSchema,
	halftoneScreenConfig,
} from "./shared/index.js";

export {
	type HalftoneScreenNodeConfig,
	HalftoneScreenNodeConfigSchema,
	HalftoneScreenResultSchema,
};

export const metadata = defineMetadata({
	type: "HalftoneScreen",
	displayName: "Halftone Screen",
	description:
		"Convert visual media into procedural halftone dot or CMYK raster screens with customizable angles and geometry",
	category: "Media",
	subcategory: undefined,
	configSchema: HalftoneScreenNodeConfigSchema,
	resultSchema: HalftoneScreenResultSchema,
	configHandles: halftoneScreenConfig.configHandles,
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
		mode: "Monochrome",
		dotShape: "Circle",
		frequency: 30,
		angle: 45,
		contrast: 1.0,
		dotColor: "#000000",
		paperColor: "#ffffff",
		smooth: true,
		invert: false,
		cyanAngle: 15,
		magentaAngle: 75,
		yellowAngle: 0,
		blackAngle: 45,
		opacity: 1.0,
	} as HalftoneScreenNodeConfig,
});
