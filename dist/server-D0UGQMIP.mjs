import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { l as VideoResultSchema, t as AudioResultSchema } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-compressor/dist/metadata-C4FaGh9W.mjs
const CompressorNodeConfigSchema = z$1.object({
	threshold: z$1.number().min(-60).max(0).default(-24).describe("Level (dBFS) above which gain reduction begins"),
	ratio: z$1.number().min(1).max(100).default(4).describe("Input-to-output ratio above threshold. 100 for limiting"),
	attack: z$1.number().min(1e-4).max(1).default(.003).describe("Seconds to reach full gain reduction"),
	release: z$1.number().min(.01).max(5).default(.25).describe("Seconds to recover gain after signal drops"),
	knee: z$1.number().min(0).max(24).default(6).describe("dB range for soft-knee transition around threshold"),
	makeupGain: z$1.number().min(0).max(24).default(0).describe("dBFS of gain applied after compression")
});
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
	isTerminal: false,
	isTransient: true,
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