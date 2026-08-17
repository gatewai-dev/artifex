import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { a as ShadowsHighlightsNodeConfigSchema, c as shadowsHighlightsConfig, i as SHADOWS_HIGHLIGHTS_OUTPUT_TYPE_MAP, o as ShadowsHighlightsResultSchema, s as defaultShadowsHighlightsConfig } from "./config-CDxbO_qU-CJmam_t_.mjs";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-shadows-highlights/dist/metadata-DLXoBWiY.mjs
const metadata = defineMetadata({
	type: "ShadowsHighlights",
	displayName: "Shadows & Highlights",
	description: "Dynamic range recovery with independent shadow lifting, highlight suppression, and tonal width control",
	category: "Media",
	subcategory: void 0,
	configSchema: ShadowsHighlightsNodeConfigSchema,
	resultSchema: ShadowsHighlightsResultSchema,
	configHandles: shadowsHighlightsConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"]
	},
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
	defaultConfig: defaultShadowsHighlightsConfig
});

//#endregion
//#region ../../nodes/node-shadows-highlights/dist/server.mjs
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
let ShadowsHighlightsProcessor = class ShadowsHighlightsProcessor$1 {
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
			const config = ShadowsHighlightsNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "ShadowsHighlights processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = SHADOWS_HIGHLIGHTS_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "ShadowsHighlights",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && (h.type === "Output" || h.label === "Result"));
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
				error: err instanceof Error ? err.message : "ShadowsHighlights processing failed"
			};
		}
	}
};
ShadowsHighlightsProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ShadowsHighlightsProcessor);
var server_default = defineNode(metadata, { backendProcessor: ShadowsHighlightsProcessor });

//#endregion
export { server_default as default };