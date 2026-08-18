import { type ExportResult, ExportResultSchema } from "@gatewai.studio/core";
import { z } from "zod";

export const DEFAULT_RENDER_COST = 20;

export const ExportNodeConfigSchema = z
	.object({
		// Only used by CLI
		file: z.string().min(1).optional(),
		format: z
			.enum(["mp4", "webm", "gif", "mp3", "cube", "svg"])
			.optional()
			.default("mp4"),
		renderAt: z.enum(["server", "browser"]).optional().default("browser"),
		audioCodec: z.enum(["aac", "opus", "mp3"]).optional(),
	})
	.strict();
export type ExportConfig = z.infer<typeof ExportNodeConfigSchema>;

export { ExportResultSchema, type ExportResult };
