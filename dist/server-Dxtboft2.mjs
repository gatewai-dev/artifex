import { M as getActiveMediaMetadata, T as appendOperation, a as TOKENS } from "./dist-D9o3ES2C.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bh8-kZ60.mjs";
import { c as VideoResultSchema, l as configBuilder, t as AudioResultSchema } from "./dist-Dn0Jc9I4.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-compressor/dist/metadata-CEsTKQVz.mjs
const compressorConfig = configBuilder().field("threshold", z$1.number().min(-60).max(0).default(-24), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Threshold Signal",
	description: "Level (dBFS) above which gain reduction begins (-60 to 0 dB). Can be modulated by a static number or dynamic signal."
}).field("ratio", z$1.number().min(1).max(100).default(4), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Ratio Signal",
	description: "Input-to-output ratio above threshold (1 to 100). Can be modulated by a static number or dynamic signal."
}).field("attack", z$1.number().min(1e-4).max(1).default(.003), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Attack Signal",
	description: "Seconds to reach full gain reduction (0.0001 to 1.0s). Can be modulated by a static number or dynamic signal."
}).field("release", z$1.number().min(.01).max(5).default(.25), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Release Signal",
	description: "Seconds to recover gain after signal drops (0.01 to 5.0s). Can be modulated by a static number or dynamic signal."
}).field("knee", z$1.number().min(0).max(24).default(6), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Knee Signal",
	description: "dB range for soft-knee transition around threshold (0 to 24 dB). Can be modulated by a static number or dynamic signal."
}).field("makeupGain", z$1.number().min(0).max(24).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Makeup Gain Signal",
	description: "dBFS of gain applied after compression (0 to 24 dB). Can be modulated by a static number or dynamic signal."
}).build();
const CompressorNodeConfigSchema = compressorConfig.schema;
const CompressorResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const COMPRESSOR_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "Compressor",
	displayName: "Audio Compressor",
	description: "Smooth out dynamic range and prevent audio clipping/distortion",
	category: "Media",
	subcategory: "Audio",
	configSchema: CompressorNodeConfigSchema,
	resultSchema: CompressorResultSchema,
	configHandles: compressorConfig.configHandles,
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
		threshold: -24,
		ratio: 4,
		attack: .003,
		release: .25,
		knee: 6,
		makeupGain: 0
	}
});

//#endregion
//#region ../../nodes/node-audio-compressor/dist/server.mjs
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
let CompressorProcessor = class CompressorProcessor$1 {
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
			const config = CompressorNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Compressor failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = COMPRESSOR_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "Compressor",
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
				error: err instanceof Error ? err.message : "Compressor failed"
			};
		}
	}
};
CompressorProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], CompressorProcessor);
var server_default = defineNode(metadata, { backendProcessor: CompressorProcessor });

//#endregion
export { server_default as default };