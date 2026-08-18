import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type TileOffsetNodeConfig,
	TileOffsetNodeConfigSchema,
	TileOffsetResultSchema,
	tileOffsetConfig,
} from "./shared/index.js";

export {
	type TileOffsetNodeConfig,
	TileOffsetNodeConfigSchema,
	TileOffsetResultSchema,
};

export const metadata = defineMetadata({
	type: "TileOffset",
	displayName: "Tile Offset",
	description:
		"Shifts visual media coordinates horizontally and vertically with seamless modulo wrap-around, mirror, or edge clamping for pattern design",
	category: "Media",
	subcategory: undefined,
	configSchema: TileOffsetNodeConfigSchema,
	resultSchema: TileOffsetResultSchema,
	configHandles: tileOffsetConfig.configHandles,
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
				description: "Visual media to offset and tile",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Offset / seamlessly tiled media",
			},
		],
	},
	defaultConfig: {
		offsetX: 0,
		offsetY: 0,
		wrap: true,
		edgeMode: "wrap",
	} as TileOffsetNodeConfig,
});
