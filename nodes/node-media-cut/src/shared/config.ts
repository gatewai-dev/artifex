import {
	createOutputItemSchema,
	SingleOutputGenericSchema,
	VirtualMediaDataSchema,
} from "@gatewai.studio/core";
import { z } from "zod";

export const MediaCutConfigSchema = z
	.object({
		/** Multiple segments for non-contiguous cuts */
		segments: z
			.array(
				z
					.object({
						startSec: z.number().min(0).max(86400),
						endSec: z.number().min(0).max(86400).optional(),
					})
					.superRefine((seg, ctx) => {
						if (seg.endSec !== undefined && seg.endSec <= seg.startSec) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								path: ["endSec"],
								message: "endSec must be greater than startSec",
							});
						}
					}),
			)
			.max(100)
			.default([]),
	})
	.strict();

export type MediaCutConfig = z.infer<typeof MediaCutConfigSchema>;

export const MediaCutResultSchema = z.union([
	SingleOutputGenericSchema(
		createOutputItemSchema(z.literal("Video"), VirtualMediaDataSchema),
	),
	SingleOutputGenericSchema(
		createOutputItemSchema(z.literal("Audio"), VirtualMediaDataSchema),
	),
	SingleOutputGenericSchema(
		createOutputItemSchema(z.literal("Lottie"), VirtualMediaDataSchema),
	),
	SingleOutputGenericSchema(
		createOutputItemSchema(z.literal("GIF"), VirtualMediaDataSchema),
	),
]);

export type MediaCutResult = z.infer<typeof MediaCutResultSchema>;

export const MediaCutOperationSchema = MediaCutConfigSchema.extend({
	op: z.literal("MediaCut"),
	metadata: z.any().optional(),
});

export type MediaCutOperation = z.infer<typeof MediaCutOperationSchema>;
