import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	MeshWarpNodeConfigSchema,
	MeshWarpResultSchema,
} from "./shared/index.js";

export { MeshWarpNodeConfigSchema, MeshWarpResultSchema };

export const metadata = defineMetadata({
	type: "MeshWarp",
	displayName: "Mesh Warp",
	description: "Warp media using a grid of control points",
	category: "Media",
	subcategory: undefined,
	configSchema: MeshWarpNodeConfigSchema,
	resultSchema: MeshWarpResultSchema,
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
				label: "Warped",
				order: 0,
				description: "The warped media",
			},
		],
	},
	defaultConfig: {
		cols: 6,
		rows: 6,
		points: [],
	},
});
