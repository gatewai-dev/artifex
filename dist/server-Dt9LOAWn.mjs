import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DBCHxcBj.mjs";
import { a as TOKENS } from "./dist-frIVphF4.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode } from "./server-3Yi2TTWf.mjs";
import { c as configBuilder, s as VideoResultSchema, t as AudioResultSchema } from "./dist-CvLMtr8b.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-parametric-eq/dist/metadata-BLHaknrW.mjs
const ParametricEqFilterTypeSchema = z$1.enum([
	"lowShelf",
	"highShelf",
	"peak",
	"lowPass",
	"highPass",
	"notch"
]);
const parametricEqConfig = configBuilder().field("type", ParametricEqFilterTypeSchema.default("peak"), {
	bindable: false,
	label: "Filter Type",
	description: "Type of biquad filter"
}).field("frequency", z$1.number().int().min(20).max(2e4).default(1e3), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Frequency Signal",
	description: "Cutoff or center frequency in Hz (20 to 20000 Hz). Can be modulated by a static number or dynamic signal."
}).field("gain", z$1.number().min(-24).max(24).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Gain Boost / Cut Signal",
	description: "Gain boost or cut in dB (-24 to 24 dB). Can be modulated by a static number or dynamic signal."
}).field("q", z$1.number().min(.01).max(10).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Q (Resonance) Signal",
	description: "Filter bandwidth / Q factor (0.01 to 10.0). Can be modulated by a static number or dynamic signal."
}).build();
const ParametricEqNodeConfigSchema = parametricEqConfig.schema;
const ParametricEqResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const PARAMETRIC_EQ_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "ParametricEq",
	displayName: "Parametric EQ",
	description: "Boost or cut specific frequency ranges using biquad IIR filters",
	category: "Media",
	subcategory: "Audio",
	configSchema: ParametricEqNodeConfigSchema,
	resultSchema: ParametricEqResultSchema,
	configHandles: parametricEqConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Audio", "Video"],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Audio", "Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		type: "peak",
		frequency: 1e3,
		gain: 0,
		q: 1
	}
});

//#endregion
//#region ../../nodes/node-audio-parametric-eq/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorateParam(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ParametricEqProcessor = class ParametricEqProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = ParametricEqNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Parametric EQ failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = PARAMETRIC_EQ_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "ParametricEq",
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Parametric EQ failed"
			};
		}
	}
};
ParametricEqProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ParametricEqProcessor);
var server_default = defineNode(metadata, { backendProcessor: ParametricEqProcessor });

//#endregion
export { server_default as default };