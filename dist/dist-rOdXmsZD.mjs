import { C as VirtualMediaDataSchema, D as createOutputItemSchema, S as SingleOutputGenericSchema, g as FileDataSchema } from "./dist-DIOL7bVU.mjs";
import { z as z$1 } from "zod";

//#region ../../packages/node-sdk/dist/index.mjs
var ConfigBuilder = class ConfigBuilder$1 {
	constructor(shape, configHandles, fieldSchemas = {}, options = { strict: true }) {
		this.shape = shape;
		this.configHandles = configHandles;
		this.fieldSchemas = fieldSchemas;
		this.options = options;
	}
	field(key, schema, options) {
		const newShape = {
			...this.shape,
			[key]: schema
		};
		const newHandles = [...this.configHandles];
		const newFieldSchemas = {
			...this.fieldSchemas,
			[key]: schema
		};
		if (options?.bindable) {
			const handleIdKey = `${key}HandleId`;
			newShape[handleIdKey] = z$1.string().nullable().default(null);
			newHandles.push({
				configKey: key,
				dataTypes: options.dataTypes ?? (schema instanceof z$1.ZodString ? ["Text", "Signal"] : ["Number", "Signal"]),
				label: options.label ?? `${key.charAt(0).toUpperCase() + key.slice(1)} Signal`,
				description: options.description
			});
		}
		return new ConfigBuilder$1(newShape, newHandles, newFieldSchemas, this.options);
	}
	build() {
		const baseSchema = z$1.object(this.shape);
		const schema = this.options.strict !== false ? baseSchema.strict() : baseSchema;
		const configHandles = this.configHandles;
		const fieldSchemas = this.fieldSchemas;
		return {
			schema,
			configHandles,
			resolve: (config, inputs, context) => {
				const resolved = { ...config };
				const errors = {};
				const frame = context?.frame ?? 0;
				const fps = context?.fps ?? 24;
				for (const handle of configHandles) {
					const handleId = config[`${handle.configKey}HandleId`];
					if (handleId) {
						const input = inputs[handleId];
						if (input && input.connectionValid && input.outputItem) {
							const signal = input.outputItem.data;
							let resolvedVal = signal;
							if (signal && typeof signal === "object" && "type" in signal) {
								if (signal.type === "generator") {
									const t = frame / fps;
									const freq = signal.frequency ?? 1;
									const amp = signal.amplitude ?? 1;
									const phase = signal.phase ?? 0;
									const offset = signal.offset ?? 0;
									if (signal.func === "sine") resolvedVal = amp * Math.sin(2 * Math.PI * freq * t + phase) + offset;
									else if (signal.func === "triangle") {
										const period = 1 / freq;
										const shiftedT = (t + phase / (2 * Math.PI) * period) % period;
										resolvedVal = amp * (2 * Math.abs(2 * (shiftedT / period) - 1) - 1) + offset;
									} else if (signal.func === "sawtooth") {
										const period = 1 / freq;
										resolvedVal = amp * (2 * ((t + phase / (2 * Math.PI) * period) % period / period) - 1) + offset;
									} else if (signal.func === "square") {
										const period = 1 / freq;
										resolvedVal = amp * ((t + phase / (2 * Math.PI) * period) % period < period / 2 ? 1 : -1) + offset;
									} else if (signal.func === "custom") {
										const customSignal = signal;
										if (customSignal.customExpr && typeof customSignal.customExpr === "string") try {
											const paramKeys = Object.keys(customSignal.params ?? {});
											const paramVals = Object.values(customSignal.params ?? {});
											resolvedVal = new Function("t", "frame", "PI", "TAU", "E", ...paramKeys, `"use strict"; return (${customSignal.customExpr});`)(t, frame, Math.PI, Math.PI * 2, Math.E, ...paramVals);
										} catch (e) {
											console.warn("Failed to evaluate custom signal expression", e);
											resolvedVal = offset;
										}
										else resolvedVal = offset;
									} else resolvedVal = offset;
								}
							}
							const parsed = fieldSchemas[handle.configKey].safeParse(resolvedVal);
							if (parsed.success) resolved[handle.configKey] = parsed.data;
							else errors[handle.configKey] = `Invalid value for '${handle.configKey}': ${parsed.error.message}`;
						} else if (input && !input.connectionValid) errors[handle.configKey] = `Handle for '${handle.configKey}' is connected to an invalid source`;
					}
				}
				return {
					resolved,
					errors
				};
			}
		};
	}
};
function configBuilder(options = { strict: true }) {
	return new ConfigBuilder({}, [], {}, options);
}
const COMPOSITE_OPERATIONS = [
	"source-over",
	"source-in",
	"source-out",
	"source-atop",
	"destination-over",
	"destination-in",
	"destination-out",
	"destination-atop",
	"lighter",
	"copy",
	"xor",
	"multiply",
	"screen",
	"overlay",
	"darken",
	"lighten",
	"color-dodge",
	"color-burn",
	"hard-light",
	"soft-light",
	"difference",
	"exclusion",
	"hue",
	"saturation",
	"color",
	"luminosity"
];
const GlobalCompositeOperation = z$1.enum(COMPOSITE_OPERATIONS);
const ColorSchema = z$1.string().optional();
const PercentageSchema = z$1.number().min(0).max(100);
const DimensionSchema = z$1.number().min(0).optional();
const FontOptionsSchema = z$1.object({
	fontFamily: z$1.string().optional(),
	fontSize: z$1.number().optional(),
	fontStyle: z$1.string().optional(),
	letterSpacing: z$1.number().optional(),
	lineHeight: z$1.number().optional(),
	fontWeight: z$1.union([z$1.string(), z$1.number()]).optional()
});
const AlignmentSchema = z$1.object({
	align: z$1.enum([
		"left",
		"center",
		"right"
	]).optional(),
	verticalAlign: z$1.enum([
		"top",
		"middle",
		"bottom"
	]).optional()
});
const PositionSchema = z$1.object({
	x: z$1.number(),
	y: z$1.number()
});
const SizeSchema = z$1.object({
	width: DimensionSchema,
	height: DimensionSchema
});
const RotationSchema = z$1.object({ rotation: z$1.number() });
const AspectLockSchema = z$1.object({ lockAspect: z$1.boolean() });
const OpacitySchema = z$1.object({ opacity: PercentageSchema.optional().default(100) });
const ZIndexSchema = z$1.object({ zIndex: z$1.number().optional() });
const VideoTimingSchema = z$1.object({
	startFrame: z$1.number().optional(),
	durationInMS: z$1.number().optional()
});
const AudioOptionsSchema = z$1.object({
	src: z$1.string().optional(),
	volume: z$1.number().min(0).max(100).optional()
});
const AnimationSchema = z$1.object({ animations: z$1.array(z$1.object({
	id: z$1.string(),
	type: z$1.enum([
		"fade-in",
		"fade-out",
		"slide-in-left",
		"slide-in-right",
		"slide-in-top",
		"slide-in-bottom",
		"zoom-in",
		"zoom-out",
		"rotate-cw",
		"rotate-ccw",
		"bounce",
		"shake"
	]),
	value: z$1.number()
})).optional() });
const ScaleSchema = z$1.object({ scale: z$1.number().optional() });
const StrokeSchema = z$1.object({
	stroke: ColorSchema,
	strokeWidth: z$1.number().min(0).optional(),
	strokeAlign: z$1.enum([
		"inside",
		"center",
		"outside"
	]).optional().default("inside"),
	strokeRadius: z$1.number().min(0).optional()
});
const PaddingSchema = z$1.object({ padding: z$1.number().min(0).optional() });
const BaseLayerSchema = z$1.object({
	id: z$1.string(),
	inputHandleId: z$1.string(),
	name: z$1.string().optional(),
	fill: ColorSchema,
	blendMode: GlobalCompositeOperation.optional()
});
const ImageResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), FileDataSchema));
const VideoResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema));
const AudioResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Audio"), VirtualMediaDataSchema));
const TextResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Text"), z$1.string()));
const NumberResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Number"), z$1.number()));
const SignalResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Signal"), z$1.any()));

//#endregion
export { SignalResultSchema as a, configBuilder as c, NumberResultSchema as i, ColorSchema as n, TextResultSchema as o, ImageResultSchema as r, VideoResultSchema as s, AudioResultSchema as t };