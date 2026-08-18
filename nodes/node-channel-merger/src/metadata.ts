import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	ChannelMergerNodeConfigSchema,
	ChannelMergerResultSchema,
	channelMergerConfig,
} from "./shared/index.js";

export { ChannelMergerNodeConfigSchema, ChannelMergerResultSchema };

export const metadata = defineMetadata({
	type: "ChannelMerger",
	displayName: "Channel Merger",
	description:
		"Combines up to 4 grayscale image streams into a composite color image across RGBA, HSLA, CMYK, or LAB color models.",
	category: "Media",
	subcategory: undefined,
	configSchema: ChannelMergerNodeConfigSchema,
	resultSchema: ChannelMergerResultSchema,
	configHandles: channelMergerConfig.configHandles,
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
				label: "Channel 1",
				order: 0,
				required: true,
				description: "First channel component (R / H / C / L*)",
			},
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Channel 2",
				order: 1,
				required: true,
				description: "Second channel component (G / S / M / a*)",
			},
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Channel 3",
				order: 2,
				required: true,
				description: "Third channel component (B / L / Y / b*)",
			},
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Channel 4",
				order: 3,
				required: false,
				description: "Optional fourth channel component (Alpha / K / Alpha)",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Result",
				order: 0,
				description: "Recombined composite color image or video",
			},
		],
	},
	defaultConfig: {
		colorSpace: "RGBA",
		defaultChannel4: 1.0,
	},
});
