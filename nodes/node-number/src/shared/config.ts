import { NumberResultSchema } from "@gatewai.studio/node-sdk";
import { z } from "zod";

export const NumberNodeConfigSchema = z
	.object({
		value: z.number().default(0),
	})
	.strict();

export type NumberNodeConfig = z.infer<typeof NumberNodeConfigSchema>;
export type NumberNodeResult = z.infer<typeof NumberResultSchema>;
export { NumberResultSchema };
