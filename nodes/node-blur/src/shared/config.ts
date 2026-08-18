import {
	configBuilder,
	ImageResultSchema,
	VideoResultSchema,
} from "@gatewai.studio/node-sdk";
import { z } from "zod";

export const MAX_BLUR = 100;

export const blurConfig = configBuilder()
	.field(
		"blurType",
		z
			.enum([
				"Gaussian",
				"Box",
				"Median",
				"Motion",
				"Bilateral",
				"Edge-preserving",
				"Radial",
				"Zoom",
			])
			.default("Gaussian"),
		{
			bindable: false,
			label: "Blur Type",
		},
	)
	.field("strength", z.number().min(0).max(MAX_BLUR).default(5), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Strength Signal",
		description:
			"The intensity of the blur. 0 = no blur. Can be modulated by a static number or a dynamic signal.",
	})
	.field("angle", z.number().int().min(0).max(360).default(0), {
		bindable: false,
		label: "Angle",
	})
	.field("sigmaColor", z.number().min(0.01).max(1.0).default(0.1), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Color Sigma Signal",
		description:
			"Sigma value for color space in Bilateral / Edge-preserving blurs. Can be modulated by a static number or a dynamic signal.",
	})
	.field("centerX", z.number().min(0).max(1.0).default(0.5), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Center X Signal",
		description:
			"The X coordinate of the blur center (0.0 to 1.0). Can be modulated by a static number or a dynamic signal.",
	})
	.field("centerY", z.number().min(0).max(1.0).default(0.5), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Center Y Signal",
		description:
			"The Y coordinate of the blur center (0.0 to 1.0). Can be modulated by a static number or a dynamic signal.",
	})
	.field("partialBlur", z.boolean().default(false), {
		bindable: false,
		label: "Partial Blur",
		description: "Blurs only a specific circular area around center point.",
	})
	.field("radius", z.number().min(0.01).max(1.0).default(0.3), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Partial Radius Signal",
		description:
			"Radius of the partial blur region (0.01 to 1.0). Can be modulated by a static number or a dynamic signal.",
	})
	.build();

export const BlurNodeConfigSchema = blurConfig.schema;

export type BlurNodeConfig = z.infer<typeof BlurNodeConfigSchema>;

export const BlurResultSchema = z.union([ImageResultSchema, VideoResultSchema]);

export type BlurResult = z.infer<typeof BlurResultSchema>;

export const BLUR_OUTPUT_TYPE_MAP: Record<string, "Image" | "Video" | "GIF"> = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image",
};
