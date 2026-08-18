import type { DataType, VirtualMediaData } from "@gatewai.studio/core";
import { z } from "zod";

export const StarterNodeConfigSchema = z.object({
	strength: z.number().min(0).max(10).default(1),
	enabled: z.boolean().default(true),
});

export type StarterNodeConfig = z.infer<typeof StarterNodeConfigSchema>;

export const StarterResultSchema = z.object({
	selectedOutputIndex: z.number().default(0),
	outputs: z.array(
		z.object({
			items: z.array(
				z.object({
					type: z.custom<DataType>(),
					data: z.custom<VirtualMediaData>(),
					outputHandleId: z.string().optional(),
				}),
			),
		}),
	),
});

export type StarterResult = z.infer<typeof StarterResultSchema>;
