import { z } from "zod";
import { DataTypes } from "../types/base.js";
import { ConfigSchemaRegistry } from "../types/config/schemas.js";

// z.enum() in v4 requires a non-empty readonly tuple.
// Cast DataTypes (string[]) so it satisfies that constraint.
const dataTypeEnum = z.enum(DataTypes);

export const handleSchema = z.object({
	id: z.string().optional(),
	type: z.enum(["Input", "Output"]),
	dataTypes: z.array(dataTypeEnum),
	label: z.string(),
	order: z.number().default(0),
	required: z.boolean().default(false),
	templateHandleId: z.string().nullish(),
	nodeId: z.string(),
});

export const nodeSchema = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		type: z.string(),
		position: z.object({
			x: z.number(),
			y: z.number(),
		}),
		handles: z.array(handleSchema).optional(),
		width: z.number().optional().default(340),
		height: z
			.number()
			.nullish()
			.describe("It is better to keep this undefined for auto-style"),
		result: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe("The output data from this node"),
		config: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe("Configuration parameters for this node"),
		templateId: z.string(),
		locked: z.boolean().optional().default(false),
	})
	.superRefine((node, ctx) => {
		const schema = ConfigSchemaRegistry.get(node.type);
		if (schema && node.config) {
			const result = schema.safeParse(node.config);
			if (!result.success) {
				// v4: result.error.issues is still the correct API
				for (const issue of result.error.issues) {
					ctx.addIssue({
						...issue,
						path: ["config", ...issue.path],
					});
				}
			}
		}
	});

export const edgeSchema = z.object({
	id: z.string().optional(),
	source: z.string().describe("Source Node ID"),
	target: z.string().describe("Target Node ID"),
	sourceHandleId: z.string().optional(),
	targetHandleId: z.string().optional(),
});
