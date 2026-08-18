import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	RefineEdgeNodeConfigSchema,
	RefineEdgeResultSchema,
	refineEdgeConfig,
} from "./shared/index.js";

export { RefineEdgeNodeConfigSchema, RefineEdgeResultSchema };

export const metadata = defineMetadata({
	type: "RefineEdge",
	displayName: "Refine Edge",
	description:
		"Matte defringing and edge decontamination. Strips background color bleeding halos, refines edge transparency, and smoothes sub-pixel details.",
	category: "Media",
	subcategory: undefined,
	configSchema: RefineEdgeNodeConfigSchema,
	resultSchema: RefineEdgeResultSchema,
	configHandles: refineEdgeConfig.configHandles,
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
				description: "Primary image or video with alpha or RGB content",
			},
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Matte",
				order: 1,
				required: false,
				description: "Optional external matte mask to refine",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Decontaminated and refined edge composite or matte",
			},
		],
	},
	defaultConfig: {
		decontaminateAmount: 0.7,
		radius: 2.0,
		smooth: 5,
		feather: 0.5,
		shiftEdge: 0,
		matteChannel: "Alpha",
		outputMode: "Composite",
	},
});
