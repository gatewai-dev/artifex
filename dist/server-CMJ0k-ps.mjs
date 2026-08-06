import "./dist-CJI3Jl43.mjs";
import "./dist-9KdZG6Tv.mjs";
import { a as buildWGSLSignalFn } from "./dist-DU0SXbex.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { a as defineMetadata, i as defineNode } from "./server-ClH_dFot.mjs";
import { s as SignalResultSchema } from "./dist-DyMTWRHA.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-signal/dist/metadata-BaN4D_jW.mjs
const WGSL_OUTPUT_TYPES = ["f32"];
const FnParamSchema = z$1.object({
	name: z$1.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Must be a valid WGSL identifier"),
	type: z$1.enum([
		"f32",
		"i32",
		"u32",
		"vec2f",
		"vec3f",
		"vec4f"
	]),
	defaultValue: z$1.number()
});
const SignalNodeConfigSchema = z$1.object({
	amplitude: z$1.number().default(1),
	frequency: z$1.number().default(1),
	phase: z$1.number().default(0),
	offset: z$1.number().default(0),
	amplitudeMin: z$1.number().default(-1),
	amplitudeMax: z$1.number().default(1),
	spatialScale: z$1.number().default(1),
	spatialSpeed: z$1.number().default(1),
	fmAmplitude: z$1.number().default(1),
	fmFrequency: z$1.number().default(.5),
	gateEnabled: z$1.boolean().default(false),
	gateStartFrame: z$1.number().default(0),
	gateEndFrame: z$1.number().default(100),
	gateIdleValue: z$1.number().default(0),
	envelopeUseFrame: z$1.boolean().default(true),
	baseEnabled: z$1.boolean().default(true),
	baseType: z$1.enum([
		"sine",
		"triangle",
		"sawtooth",
		"square",
		"constant",
		"noise_smooth",
		"noise_white",
		"pulse",
		"bounce",
		"staircase",
		"custom"
	]).default("sine"),
	fmEnabled: z$1.boolean().default(false),
	envelopeEnabled: z$1.boolean().default(false),
	envelopeFamily: z$1.enum([
		"linear",
		"sine",
		"quad",
		"cubic",
		"quart",
		"quint",
		"expo",
		"circ",
		"back",
		"elastic",
		"bounce",
		"smoothstep",
		"smootherstep"
	]).default("sine"),
	envelopeMode: z$1.enum([
		"in",
		"out",
		"in_out"
	]).default("in_out"),
	envelopePattern: z$1.enum([
		"ramp_up",
		"ramp_down",
		"bell",
		"loop"
	]).default("ramp_up"),
	envelopeCycles: z$1.number().default(2),
	fnBody: z$1.string().default([
		"// Bindings: t: f32 | x y z: f32 | i n frame: u32",
		"// Constants: PI, TAU, E",
		"return u.amplitude * sin(t * u.frequency * TAU + u.phase) + u.offset;"
	].join("\n")),
	fnOutputType: z$1.enum(WGSL_OUTPUT_TYPES).default("f32"),
	fnParams: z$1.array(FnParamSchema).default([]),
	previewMode: z$1.enum([
		"pattern",
		"cartesian",
		"3d"
	]).default("cartesian")
});
const metadata = defineMetadata({
	type: "ProceduralSignal",
	displayName: "Procedural Signal",
	description: "Create procedural Signals.",
	category: "Signal",
	showInQuickAccess: false,
	configSchema: SignalNodeConfigSchema,
	resultSchema: SignalResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Signal"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		amplitude: 1,
		frequency: 1,
		phase: 0,
		offset: 0,
		fnBody: [
			"// Bindings: t: f32 | x y z: f32 | i n frame: u32",
			"// Constants: PI, TAU, E",
			"return u.amplitude * sin(t * u.frequency * TAU + u.phase) + u.offset;"
		].join("\n"),
		fnOutputType: "f32",
		fnParams: []
	}
});

//#endregion
//#region ../../nodes/node-signal/dist/server.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SignalProcessor = class SignalProcessor$1 {
	async process({ node, data }) {
		const config = SignalNodeConfigSchema.parse(node.config);
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		const params = {};
		for (const p of config.fnParams ?? []) params[p.name] = p.defaultValue;
		const fnRes = buildWGSLSignalFn(config, node.id);
		const resultData = {
			type: "generator",
			nodeId: node.id,
			func: "custom",
			amplitude: config.amplitude,
			frequency: config.frequency,
			phase: config.phase,
			offset: config.offset,
			params,
			customWGSL: fnRes.wgsl,
			signalFnName: fnRes.name,
			fnParams: config.fnParams,
			outputType: fnRes.outputType
		};
		return {
			success: true,
			newResult: {
				selectedOutputIndex: 0,
				outputs: [{ items: [{
					type: DataType.Signal,
					data: resultData,
					outputHandleId: outputHandle?.id
				}] }]
			}
		};
	}
};
SignalProcessor = __decorate([injectable()], SignalProcessor);
var server_default = defineNode(metadata, { backendProcessor: SignalProcessor });

//#endregion
export { server_default as default };