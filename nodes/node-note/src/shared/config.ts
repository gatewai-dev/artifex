import { z } from "zod";

export const NoteNodeConfigSchema = z
	.object({
		content: z.string().max(20000).optional(),
		backgroundColor: z
			.string()
			.regex(
				/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
				"must be a hex color",
			)
			.default("#ffff88"),
		textColor: z
			.string()
			.regex(
				/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
				"must be a hex color",
			)
			.default("#000000"),
		fontSize: z.number().int().min(1).max(100).default(14),
	})
	.strict();

export type NoteNodeConfig = z.infer<typeof NoteNodeConfigSchema>;
