import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-CJI3Jl43.mjs";
import { a as defineMetadata, i as defineNode } from "./server-ClH_dFot.mjs";
import { l as VideoResultSchema, t as AudioResultSchema } from "./dist-DyMTWRHA.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-delay/dist/metadata--ybl0ZYh.mjs
const DelayNodeConfigSchema = z$1.object({
	delayTime: z$1.number().min(0).max(5).default(.25).describe("Delay time in seconds"),
	feedback: z$1.number().min(0).max(.95).default(.4).describe("Amount of delayed signal fed back into delay line"),
	wet: z$1.number().min(0).max(1).default(.3).describe("Mix level of the wet delayed signal"),
	dry: z$1.number().min(0).max(1).default(1).describe("Mix level of the original dry signal"),
	pingPong: z$1.boolean().default(false).describe("Alternates echo between left and right channels")
});
const DelayResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const DELAY_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "Delay",
	displayName: "Delay / Echo",
	description: "Add repeating echo effect for audio and video",
	category: "Media",
	subcategory: "Audio",
	configSchema: DelayNodeConfigSchema,
	resultSchema: DelayResultSchema,
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
		delayTime: .25,
		feedback: .4,
		wet: .3,
		dry: 1,
		pingPong: false
	}
});

//#endregion
//#region ../../nodes/node-audio-delay/dist/server.mjs
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
let DelayProcessor = class DelayProcessor$1 {
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
			const config = DelayNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Delay failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = DELAY_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "Delay",
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
				error: err instanceof Error ? err.message : "Delay failed"
			};
		}
	}
};
DelayProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], DelayProcessor);
var server_default = defineNode(metadata, { backendProcessor: DelayProcessor });

//#endregion
export { server_default as default };