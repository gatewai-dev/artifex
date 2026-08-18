import { TextResultSchema } from "@gatewai.studio/node-sdk";
import { z } from "zod";

export const TextMergerNodeConfigSchema = z
	.object({
		join: z.string().max(500).optional(),
	})
	.strict();

export type TextMergerNodeConfig = z.infer<typeof TextMergerNodeConfigSchema>;

export const TextMergerResultSchema = TextResultSchema;

export type TextMergerResult = z.infer<typeof TextMergerResultSchema>;
