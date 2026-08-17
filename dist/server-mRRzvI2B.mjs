import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { a as computeLayerStylePadding, i as LayerStyleResultSchema, n as LAYER_STYLE_OUTPUT_TYPE_MAP, r as LayerStyleNodeConfigSchema, t as LAYER_STYLE_CONFIG_HANDLES } from "./config-Di1VDQUU-D0RfKgzn.mjs";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-layer-style/dist/metadata-Dj_XMGjo.mjs
const metadata = defineMetadata({
	type: "LayerStyle",
	displayName: "Layer Style",
	description: "Applies procedural layer styles to an alpha-isolated layer or graphic. Calculates distance field vectors, inner/outer alpha convolutions, and light elevation models to generate standard Photoshop FX.",
	category: "Media",
	subcategory: void 0,
	configSchema: LayerStyleNodeConfigSchema,
	resultSchema: LayerStyleResultSchema,
	configHandles: LAYER_STYLE_CONFIG_HANDLES,
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
	defaultConfig: LayerStyleNodeConfigSchema.parse({})
});

//#endregion
//#region ../../nodes/node-layer-style/dist/server.mjs
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
let LayerStyleProcessor = class LayerStyleProcessor$1 {
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
			const config = LayerStyleNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "LayerStyle processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = LAYER_STYLE_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const padding = computeLayerStylePadding(config);
			const baseMeta = activeMeta ?? inputMedia.metadata;
			const finalOutputType = outputType;
			const finalMeta = baseMeta ? {
				...baseMeta,
				width: baseMeta.width ? baseMeta.width + padding.padX * 2 : baseMeta.width,
				height: baseMeta.height ? baseMeta.height + padding.padY * 2 : baseMeta.height
			} : void 0;
			const output = appendOperation(inputMedia, {
				op: "LayerStyle",
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
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "LayerStyle processing failed"
			};
		}
	}
};
LayerStyleProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], LayerStyleProcessor);
var server_default = defineNode(metadata, { backendProcessor: LayerStyleProcessor });

//#endregion
export { server_default as default };