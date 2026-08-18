import type { DataType, SignalData } from "@gatewai.studio/core";
import { z } from "zod";

export interface HandleBinding {
	configKey: string;
	dataTypes: DataType[];
	label: string;
	description?: string;
}

export type ConnectedInput = {
	connectionValid: boolean;
	outputItem: { type: string; data: unknown } | null;
};

export class ConfigBuilder<
	TShape extends z.ZodRawShape = {},
	TConfigHandles extends HandleBinding[] = [],
> {
	constructor(
		private shape: TShape,
		private configHandles: TConfigHandles,
		private fieldSchemas: Record<string, z.ZodTypeAny> = {},
		private options: { strict?: boolean } = { strict: true },
	) {}

	field<
		TKey extends string,
		TType extends z.ZodTypeAny,
		TBindable extends boolean = false,
	>(
		key: TKey,
		schema: TType,
		options?: {
			bindable?: TBindable;
			dataTypes?: DataType[];
			label?: string;
			description?: string;
		},
	): ConfigBuilder<
		TShape & { [K in TKey]: TType } & (TBindable extends true
				? { [K in `${TKey}HandleId`]: z.ZodDefault<z.ZodNullable<z.ZodString>> }
				: {}),
		TBindable extends true ? [...TConfigHandles, HandleBinding] : TConfigHandles
	> {
		const newShape = {
			...this.shape,
			[key]: schema,
		} as unknown as TShape & { [K in TKey]: TType } & (TBindable extends true
				? { [K in `${TKey}HandleId`]: z.ZodDefault<z.ZodNullable<z.ZodString>> }
				: {});

		const newHandles = [
			...this.configHandles,
		] as unknown as TBindable extends true
			? [...TConfigHandles, HandleBinding]
			: TConfigHandles;

		const newFieldSchemas = { ...this.fieldSchemas, [key]: schema };

		if (options?.bindable) {
			const handleIdKey = `${key}HandleId`;
			(newShape as unknown as Record<string, unknown>)[handleIdKey] = z
				.string()
				.nullable()
				.default(null);
			(newHandles as unknown as HandleBinding[]).push({
				configKey: key,
				dataTypes:
					options.dataTypes ??
					(schema instanceof z.ZodString
						? ["Text", "Signal"]
						: ["Number", "Signal"]),
				label:
					options.label ??
					`${key.charAt(0).toUpperCase() + key.slice(1)} Signal`,
				description: options.description,
			});
		}

		return new ConfigBuilder(
			newShape,
			newHandles,
			newFieldSchemas,
			this.options,
		);
	}

	build() {
		const baseSchema = z.object(this.shape);
		const schema =
			this.options.strict !== false ? baseSchema.strict() : baseSchema;
		const configHandles = this.configHandles;
		const fieldSchemas = this.fieldSchemas;

		return {
			schema,
			configHandles,
			resolve: (
				config: Record<string, unknown>,
				inputs: Record<string, ConnectedInput>,
				context?: { frame?: number; fps?: number },
			): {
				resolved: Record<string, unknown>;
				errors: Record<string, string>;
			} => {
				const resolved = { ...config };
				const errors: Record<string, string> = {};

				const frame = context?.frame ?? 0;
				const fps = context?.fps ?? 24;

				for (const handle of configHandles) {
					const handleIdKey = `${handle.configKey}HandleId`;
					const handleId = config[handleIdKey] as string | null | undefined;
					if (handleId) {
						const input = inputs[handleId];
						if (input && input.connectionValid && input.outputItem) {
							const signal = input.outputItem.data as
								| SignalData
								| null
								| undefined;
							let resolvedVal: unknown = signal;

							if (signal && typeof signal === "object" && "type" in signal) {
								if (signal.type === "generator") {
									const t = frame / fps;
									const freq = signal.frequency ?? 1;
									const amp = signal.amplitude ?? 1;
									const phase = signal.phase ?? 0;
									const offset = signal.offset ?? 0;

									if (signal.func === "sine") {
										resolvedVal =
											amp * Math.sin(2 * Math.PI * freq * t + phase) + offset;
									} else if (signal.func === "triangle") {
										const period = 1 / freq;
										const shiftedT =
											(t + (phase / (2 * Math.PI)) * period) % period;
										resolvedVal =
											amp * (2 * Math.abs(2 * (shiftedT / period) - 1) - 1) +
											offset;
									} else if (signal.func === "sawtooth") {
										const period = 1 / freq;
										const shiftedT =
											(t + (phase / (2 * Math.PI)) * period) % period;
										resolvedVal = amp * (2 * (shiftedT / period) - 1) + offset;
									} else if (signal.func === "square") {
										const period = 1 / freq;
										const shiftedT =
											(t + (phase / (2 * Math.PI)) * period) % period;
										resolvedVal =
											amp * (shiftedT < period / 2 ? 1 : -1) + offset;
									} else if (signal.func === "custom") {
										const customSignal = signal as SignalData & {
											customExpr?: string;
											params?: Record<string, number>;
										};
										if (
											customSignal.customExpr &&
											typeof customSignal.customExpr === "string"
										) {
											try {
												const paramKeys = Object.keys(
													customSignal.params ?? {},
												);
												const paramVals = Object.values(
													customSignal.params ?? {},
												);
												const fn = new Function(
													"t",
													"frame",
													"PI",
													"TAU",
													"E",
													...paramKeys,
													`"use strict"; return (${customSignal.customExpr});`,
												);
												resolvedVal = fn(
													t,
													frame,
													Math.PI,
													Math.PI * 2,
													Math.E,
													...paramVals,
												);
											} catch (e) {
												console.warn(
													"Failed to evaluate custom signal expression",
													e,
												);
												resolvedVal = offset;
											}
										} else {
											resolvedVal = offset;
										}
									} else {
										resolvedVal = offset;
									}
								}
							}

							const fieldSchema = fieldSchemas[handle.configKey];
							const parsed = fieldSchema.safeParse(resolvedVal);
							if (parsed.success) {
								resolved[handle.configKey] = parsed.data;
							} else {
								errors[handle.configKey] =
									`Invalid value for '${handle.configKey}': ${parsed.error.message}`;
							}
						} else if (input && !input.connectionValid) {
							errors[handle.configKey] =
								`Handle for '${handle.configKey}' is connected to an invalid source`;
						}
					}
				}

				return { resolved, errors };
			},
		};
	}
}

export function configBuilder(
	options: { strict?: boolean } = { strict: true },
) {
	return new ConfigBuilder({}, [], {}, options);
}
