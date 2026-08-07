import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { l as VideoResultSchema, t as AudioResultSchema } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-reverb/dist/metadata-Ch8QfklI.mjs
const ReverbNodeConfigSchema = z$1.object({
	roomSize: z$1.number().min(0).max(1).default(.5).describe("Room decay, size of simulated space"),
	damping: z$1.number().min(0).max(1).default(.5).describe("High-frequency absorption (walls damping)"),
	wet: z$1.number().min(0).max(1).default(.3).describe("Mix level of the wet reverberated signal"),
	dry: z$1.number().min(0).max(1).default(1).describe("Mix level of the original dry signal"),
	width: z$1.number().min(0).max(1).default(1).describe("Stereo spread of the reverb tail")
});
const ReverbResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const REVERB_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "Reverb",
	displayName: "Reverb",
	description: "Add room ambience and space to audio",
	category: "Media",
	subcategory: "Audio",
	configSchema: ReverbNodeConfigSchema,
	resultSchema: ReverbResultSchema,
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
		roomSize: .5,
		damping: .5,
		wet: .3,
		dry: 1,
		width: 1
	}
});

//#endregion
//#region ../../nodes/node-audio-reverb/dist/server.mjs
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
let ReverbProcessor = class ReverbProcessor$1 {
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
			const config = ReverbNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Reverb failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = REVERB_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "Reverb",
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
				error: err instanceof Error ? err.message : "Reverb failed"
			};
		}
	}
};
ReverbProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ReverbProcessor);
var server_default = defineNode(metadata, { backendProcessor: ReverbProcessor });

//#endregion
export { server_default as default };