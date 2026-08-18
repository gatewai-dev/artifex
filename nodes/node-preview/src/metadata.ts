import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	PreviewNodeConfigSchema,
	PreviewResultSchema,
} from "./shared/index.js";

export const metadata = defineMetadata({
	type: "Preview",
	displayName: "Preview",
	description: "Preview the output of a connected node",
	category: "Utilities",
	configSchema: PreviewNodeConfigSchema,
	resultSchema: PreviewResultSchema,
	isTerminal: false,
	isTransient: true,
	showInQuickAccess: false,
	handles: {
		inputs: [
			{
				dataTypes: [
					"Video",
					"Image",
					"Text",
					"Audio",
					"SVG",
					"GIF",
					"Lottie",
					"Signal",
				],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [],
	},
});
