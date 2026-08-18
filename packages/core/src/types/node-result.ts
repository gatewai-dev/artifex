import z from "zod";
import type { DataType, FileAsset } from "./base.js";
import type { VirtualMediaData } from "./video/virtual-video.js";

export const FileDataSchema = z.object({
	entity: z.custom<FileAsset>().optional(),
});

export type FileData = z.infer<typeof FileDataSchema>;

export const SignalDataSchema = z.object({
	type: z.literal("generator"),
	func: z.enum(["sine", "triangle", "sawtooth", "square", "custom"]),
	frequency: z.number().default(1),
	amplitude: z.number().default(1),
	phase: z.number().default(0),
	offset: z.number().default(0),
});

export type SignalData = z.infer<typeof SignalDataSchema>;

export type DataForType<R extends DataType> = R extends "Text"
	? string
	: R extends "Number"
		? number
		: R extends "Boolean"
			? boolean
			: R extends "Signal"
				? SignalData
				: R extends
							| "Image"
							| "SVG"
							| "Caption"
							| "Video"
							| "Audio"
							| "Lottie"
							| "ThreeD"
							| "GIF"
							| "LUT"
					? VirtualMediaData
					: R extends "Any"
						?
								| string
								| number
								| boolean
								| FileData
								| VirtualMediaData
								| SignalData
						: never;

export const OutputItemSchema = z.object({
	type: z.custom<DataType>(),
	data: z.any(), // Since DataForType is complex, we just allow any at runtime but type it properly if possible.
	outputHandleId: z.string().optional(),
});

// Utility to create strictly-typed output item schemas
export const createOutputItemSchema = <T extends DataType>(
	type: z.ZodLiteral<T>,
	dataSchema: z.ZodTypeAny,
) => {
	return z.object({
		type: type,
		data: dataSchema,
		outputHandleId: z.string().optional(),
	}) as z.ZodType<OutputItem<T>>;
};

export type OutputItem<R extends DataType> = {
	type: R;
	data: DataForType<R>;
	outputHandleId: string | undefined;
};

export type Output = {
	items: OutputItem<DataType>[];
};

export const SingleOutputGenericSchema = <T extends DataType>(
	outputItemSchema: z.ZodType<OutputItem<T>>,
) =>
	z.object({
		selectedOutputIndex: z.literal(0),
		outputs: z.tuple([z.object({ items: z.tuple([outputItemSchema]) })]),
	});

export type SingleOutputGeneric<T extends DataType> = {
	selectedOutputIndex: 0;
	outputs: [{ items: [OutputItem<T>] }];
};

export const MultiOutputGenericSchema = <T extends DataType>(
	outputItemSchema: z.ZodType<OutputItem<T>>,
) =>
	z.object({
		selectedOutputIndex: z.number(),
		outputs: z.array(z.object({ items: z.array(outputItemSchema) })),
		sourceFingerprint: z.string().optional(),
	});

export type MultiOutputGeneric<T extends DataType> = {
	selectedOutputIndex: number;
	outputs: { items: OutputItem<T>[] }[];
	sourceFingerprint?: string;
};

export type AnyOutputUnion =
	| OutputItem<"Video">
	| OutputItem<"Image">
	| OutputItem<"Audio">
	| OutputItem<"Text">
	| OutputItem<"Number">
	| OutputItem<"Boolean">
	| OutputItem<"SVG">
	| OutputItem<"GIF">
	| OutputItem<"Caption">
	| OutputItem<"Lottie">
	| OutputItem<"ThreeD">
	| OutputItem<"Signal">
	| OutputItem<"LUT">;

export const AnyOutputUnionSchema = z.object({
	type: z.custom<DataType>(),
	data: z.any(),
	outputHandleId: z.string().optional(),
}) as z.ZodType<AnyOutputUnion>;

export const NodeResultSchema = z.object({
	selectedOutputIndex: z.number(),
	outputs: z.array(
		z.object({
			items: z.array(AnyOutputUnionSchema),
		}),
	),
});

export type NodeResult = z.infer<typeof NodeResultSchema>;

export const ExportResultSchema =
	MultiOutputGenericSchema(AnyOutputUnionSchema);

export type ExportResult = {
	selectedOutputIndex: number;
	outputs: { items: AnyOutputUnion[] }[];
	sourceFingerprint?: string;
};
