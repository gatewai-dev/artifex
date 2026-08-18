import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ResizerScalerNodeConfig,
	ResizerScalerNodeConfigSchema,
	ResizerScalerResultSchema,
} from "./shared/index.js";

export {
	type ResizerScalerNodeConfig,
	ResizerScalerNodeConfigSchema,
	ResizerScalerResultSchema,
};

export const metadata = defineMetadata({
	type: "ResizerScaler",
	displayName: "Resizer / Scaler",
	description:
		"Adjust aspect ratios, scale resolution, crop, and pad image/video assets.",
	category: "Media",
	subcategory: undefined,
	configSchema: ResizerScalerNodeConfigSchema,
	resultSchema: ResizerScalerResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "Video", "SVG", "GIF", "Lottie"],
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
				description: "Scaled & formatted output media",
			},
		],
	},
	defaultConfig: {
		aspectRatioPreset: "16:9",
		resolutionPreset: "1080p",
		targetWidth: 1920,
		targetHeight: 1080,
		fitMode: "contain",
		zoom: 100,
		offsetX: 0,
		offsetY: 0,
		backgroundMode: "solid",
		backgroundColor: "#000000FF",
		backgroundColor2: "#000000FF",
		blurRadius: 40,
		backgroundBrightness: 0.6,
		anchorX: "center",
		anchorY: "center",
	} as ResizerScalerNodeConfig,
});
