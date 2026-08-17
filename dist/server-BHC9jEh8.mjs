import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { d as REFINE_EDGE_OUTPUT_TYPE_MAP, f as RefineEdgeNodeConfigSchema, m as refineEdgeConfig, p as RefineEdgeResultSchema } from "./shared-CaC0NEDX-Biut4G0-.mjs";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-refine-edge/dist/index.mjs
const metadata = defineMetadata({
	type: "RefineEdge",
	displayName: "Refine Edge",
	description: "Matte defringing and edge decontamination. Strips background color bleeding halos, refines edge transparency, and smoothes sub-pixel details.",
	category: "Media",
	subcategory: void 0,
	configSchema: RefineEdgeNodeConfigSchema,
	resultSchema: RefineEdgeResultSchema,
	configHandles: refineEdgeConfig.configHandles,
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
			label: "Input",
			order: 0,
			required: true,
			description: "Primary image or video with alpha or RGB content"
		}, {
			dataTypes: [
				"Image",
				"SVG",
				"Video",
				"Lottie",
				"GIF"
			],
			label: "Matte",
			order: 1,
			required: false,
			description: "Optional external matte mask to refine"
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Decontaminated and refined edge composite or matte"
		}]
	},
	defaultConfig: {
		decontaminateAmount: .7,
		radius: 2,
		smooth: 5,
		feather: .5,
		shiftEdge: 0,
		matteChannel: "Alpha",
		outputMode: "Composite"
	}
});

//#endregion
//#region ../../nodes/node-refine-edge/dist/server.mjs
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
let RefineEdgeProcessor = class RefineEdgeProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item() || resolver.input().item();
			const matteItem = resolver.input("Matte").item();
			if (!inputItem) return {
				success: false,
				error: "Missing Input"
			};
			const config = RefineEdgeNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "RefineEdge processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = REFINE_EDGE_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "RefineEdge",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs,
				matteMedia: matteItem?.data
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
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "RefineEdge processing failed"
			};
		}
	}
};
RefineEdgeProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], RefineEdgeProcessor);
var server_default = defineNode(metadata, { backendProcessor: RefineEdgeProcessor });

//#endregion
export { server_default as default };