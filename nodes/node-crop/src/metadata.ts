import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	CropNodeConfigSchema,
	CropResultSchema,
	ImageCropResultSchema,
	VideoCropResultSchema,
} from "./shared/index.js";

export {
	CropNodeConfigSchema,
	ImageCropResultSchema,
	VideoCropResultSchema,
	CropResultSchema,
};

export const metadata = defineMetadata({
	type: "Crop",
	displayName: "Crop",
	description: "Crop media using rectangle, path, or ellipse",
	category: "Media",
	subcategory: undefined,
	configSchema: CropNodeConfigSchema,
	resultSchema: CropResultSchema,
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
				label: "Cropped",
				order: 0,
				description: "The cropped area of the media",
			},
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Rest",
				order: 1,
				description: "The rest (uncropped) of the media",
			},
		],
	},
	defaultConfig: {
		cropType: "rect",
		leftPercentage: 0,
		topPercentage: 0,
		widthPercentage: 100,
		heightPercentage: 100,
		pathPoints: [],
		roundness: 0,
	},
});
