import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-liquify/dist/metadata-CEMpLHhi.mjs
const LiquifyDeformTypeSchema = z$1.enum([
	"Push",
	"Pull",
	"Bloat",
	"Pucker",
	"TwirlCW",
	"TwirlCCW"
]);
const LiquifyDeformSchema = z$1.object({
	type: LiquifyDeformTypeSchema.default("Bloat"),
	x: z$1.number().min(0).max(1),
	y: z$1.number().min(0).max(1),
	radius: z$1.number().min(.01).max(1).default(.15),
	strength: z$1.number().min(0).max(1).default(.5),
	dx: z$1.number().min(-1).max(1).default(0),
	dy: z$1.number().min(-1).max(1).default(0)
});
const liquifyConfig = configBuilder().field("operations", z$1.array(LiquifyDeformSchema).default([]), {
	label: "Operations",
	description: "List of localized liquify deformation operations."
}).build();
const LiquifyNodeConfigSchema = liquifyConfig.schema;
const LiquifyResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const LIQUIFY_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "Liquify",
	displayName: "Liquify",
	description: "Apply localized push, pull, bloat, pucker, and twirl distortions with smooth radial falloff",
	category: "Media",
	subcategory: void 0,
	configSchema: LiquifyNodeConfigSchema,
	resultSchema: LiquifyResultSchema,
	configHandles: liquifyConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"SVG",
				"Video",
				"Lottie",
				"GIF"
			],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { operations: [] }
});

//#endregion
//#region ../../nodes/node-liquify/dist/server.mjs
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
let LiquifyProcessor = class LiquifyProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = LiquifyNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Liquify processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = LIQUIFY_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const finalMeta = activeMeta ?? inputMedia.metadata;
			const output = appendOperation(inputMedia, {
				op: "Liquify",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs
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
						type: finalOutputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}
};
LiquifyProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], LiquifyProcessor);
var server_default = defineNode(metadata, { backendProcessor: LiquifyProcessor });

//#endregion
export { server_default as default };