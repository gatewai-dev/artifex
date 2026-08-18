import { defineMetadata } from "@gatewai.studio/node-sdk";
import { KenBurnsConfigSchema, KenBurnsResultSchema } from "./shared/config.js";

export { KenBurnsConfigSchema, KenBurnsResultSchema };

export const metadata = defineMetadata({
	type: "KenBurns",
	displayName: "Ken Burns",
	description: "Create a video using Ken Burns effect",
	category: "Media",
	subcategory: undefined,
	configSchema: KenBurnsConfigSchema,
	resultSchema: KenBurnsResultSchema,
	isTerminal: false,
	isTransient: false,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "Video", "SVG", "GIF", "Lottie"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [{ dataTypes: ["Video"], label: "Result", order: 0 }],
	},
	defaultConfig: KenBurnsConfigSchema.parse({
		keyframes: [
			{
				durationMs: 1000,
				holdMs: 1000,
				scale: 2,
				x: 25,
				y: 25,
				easing: "ease-in-out",
			},
			{
				durationMs: 0,
				holdMs: 1000,
				scale: 2,
				x: 75,
				y: 75,
				easing: "ease-in-out",
			},
		],
		motionBlurSize: 0,
		aspectRatio: "input",
		movementStyle: "direct",
	}),
});
