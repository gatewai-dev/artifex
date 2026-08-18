import {
	configBuilder,
	ImageResultSchema,
	VideoResultSchema,
} from "@gatewai.studio/node-sdk";
import { z } from "zod";

/**
 * Node Configuration Builder
 *
 * Use configBuilder() to declare your node's parameters.
 * - Setting `bindable: true` automatically registers a dynamic input handle in `configHandles`
 *   allowing external signals (LFO, Math, Audio Analyzers) or static numbers to modulate the parameter.
 * - Setting `bindable: false` keeps the property as a static inspector/form field.
 */
export const starterConfig = configBuilder()
	.field("strength", z.number().min(0).max(10).default(1.0), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Strength Signal",
		description:
			"Intensity of the transformation effect (0 to 10). Can be modulated by a static Number or a dynamic Signal.",
	})
	.field(
		"mode",
		z.enum(["standard", "invert", "vivid"]).default("standard"),
		{
			bindable: false,
			label: "Operation Mode",
			description: "Selects the specific algorithm or processing mode.",
		},
	)
	.field("enabled", z.boolean().default(true), {
		bindable: false,
		label: "Enabled",
		description: "Toggles the effect on or off.",
	})
	.build();

/**
 * Zod schema for validating the node configuration object at runtime.
 */
export const StarterNodeConfigSchema = starterConfig.schema;

/**
 * Inferred TypeScript type for the node configuration.
 */
export type StarterNodeConfig = z.infer<typeof StarterNodeConfigSchema>;

/**
 * Output Result Schema:
 * Defines the structure of the output item(s) produced by this node.
 * For visual transformation nodes, this is typically a union of Image and Video results.
 */
export const StarterResultSchema = z.union([
	ImageResultSchema,
	VideoResultSchema,
]);

/**
 * Inferred TypeScript type for the node output result.
 */
export type StarterResult = z.infer<typeof StarterResultSchema>;
