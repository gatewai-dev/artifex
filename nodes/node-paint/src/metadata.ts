import { defineMetadata } from "@gatewai.studio/node-sdk";
import { PaintNodeConfigSchema, PaintResultSchema } from "./shared/index.js";

export { PaintNodeConfigSchema, PaintResultSchema };

export const metadata = defineMetadata({
	type: "Paint",
	displayName: "Paint",
	description: "Draw / Fill Mask on an media",
	category: "Media",
	subcategory: undefined,
	configSchema: PaintNodeConfigSchema,
	resultSchema: PaintResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Background",
				order: 0,
				required: false,
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Image/Video/GIF output, with mask",
			},
			{
				dataTypes: ["Image"],
				label: "Mask",
				order: 1,
				description: "Image/Video/GIF output, only mask",
			},
		],
	},
	defaultConfig: {
		width: 1080,
		height: 1080,
		maintainAspect: true,
		backgroundColor: "#000",
	},
});
