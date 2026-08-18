import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	ChannelSplitterNodeConfigSchema,
	ChannelSplitterResultSchema,
	channelSplitterConfig,
} from "./shared/index.js";

export { ChannelSplitterNodeConfigSchema, ChannelSplitterResultSchema };

export const metadata = defineMetadata({
	type: "ChannelSplitter",
	displayName: "Channel Splitter",
	description:
		"Splits an image or video stream into 4 distinct single-channel grayscale images across RGBA, HSLA, CMYK, or LAB color models.",
	category: "Media",
	subcategory: undefined,
	configSchema: ChannelSplitterNodeConfigSchema,
	resultSchema: ChannelSplitterResultSchema,
	configHandles: channelSplitterConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "Lottie", "GIF"],
				label: "Input",
				order: 0,
				required: true,
				description: "Source media to split into channels",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Channel 1",
				order: 0,
				description: "Channel 1 (R / H / C / L*)",
			},
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Channel 2",
				order: 1,
				description: "Channel 2 (G / S / M / a*)",
			},
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Channel 3",
				order: 2,
				description: "Channel 3 (B / L / Y / b*)",
			},
			{
				dataTypes: ["Image", "Video", "GIF"],
				label: "Channel 4",
				order: 3,
				description: "Channel 4 (Alpha / Alpha / K / Alpha)",
			},
		],
	},
	defaultConfig: {
		colorSpace: "RGBA",
	},
});
