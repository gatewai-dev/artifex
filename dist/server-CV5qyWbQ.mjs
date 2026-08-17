import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { a as maskMathConfig, i as MaskMathResultSchema, r as MaskMathNodeConfigSchema, t as MASK_MATH_OUTPUT_TYPE_MAP } from "./shared-BPLI1__V-BtegUoiA.mjs";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-mask-math/dist/index.mjs
const metadata = defineMetadata({
	type: "MaskMath",
	displayName: "Mask Math",
	description: "Morphological (dilate, erode, choke, feather) and Boolean set operations (union, intersect, subtract, difference, invert) on alpha/matte masks",
	category: "Media",
	subcategory: void 0,
	configSchema: MaskMathNodeConfigSchema,
	resultSchema: MaskMathResultSchema,
	configHandles: maskMathConfig.configHandles,
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
			label: "Mask A",
			order: 0,
			required: true,
			description: "Primary matte or image source"
		}, {
			dataTypes: [
				"Image",
				"SVG",
				"Video",
				"Lottie",
				"GIF"
			],
			label: "Mask B",
			order: 1,
			required: false,
			description: "Secondary matte for dual-mask Boolean operations"
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Resulting processed alpha matte or masked image"
		}]
	},
	defaultConfig: {
		operation: "Union",
		radius: 0,
		threshold: .5,
		clampMin: 0,
		clampMax: 1,
		channelA: "Alpha",
		channelB: "Alpha",
		binarize: false,
		invertResult: false,
		outputFormat: "WhiteWithAlpha"
	}
});

//#endregion
//#region ../../nodes/node-mask-math/dist/server.mjs
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
let MaskMathProcessor = class MaskMathProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const maskAItem = resolver.input("Mask A").item() || resolver.input().item();
			const maskBItem = resolver.input("Mask B").item();
			if (!maskAItem) return {
				success: false,
				error: "Missing Mask A input"
			};
			const config = MaskMathNodeConfigSchema.parse(node.config);
			const inputMedia = maskAItem.data;
			if (!inputMedia) return {
				success: false,
				error: "MaskMath processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = MASK_MATH_OUTPUT_TYPE_MAP[maskAItem.type];
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
				op: "MaskMath",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs,
				maskBMedia: maskBItem?.data
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
				error: err instanceof Error ? err.message : "MaskMath processing failed"
			};
		}
	}
};
MaskMathProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], MaskMathProcessor);
var server_default = defineNode(metadata, { backendProcessor: MaskMathProcessor });

//#endregion
export { server_default as default };