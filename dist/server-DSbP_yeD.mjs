import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { a as PatchHealNodeConfigSchema, i as PATCH_HEAL_OUTPUT_TYPE_MAP, o as PatchHealResultSchema } from "./shared-oU4AGdRB-Dt11CWFI.mjs";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-patch-heal/dist/index.mjs
const metadata = defineMetadata({
	type: "PatchHeal",
	displayName: "Patch Heal",
	description: "Coordinate-offset clone stamping, texture transfer, and seamless gradient healing",
	category: "Media",
	subcategory: void 0,
	configSchema: PatchHealNodeConfigSchema,
	resultSchema: PatchHealResultSchema,
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
			description: "Target media to heal or clone onto"
		}, {
			dataTypes: [
				"Image",
				"SVG",
				"Video",
				"Lottie",
				"GIF"
			],
			label: "Mask",
			order: 1,
			required: false,
			description: "Optional mask defining the region to heal/stamp"
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Healed/cloned media output"
		}]
	},
	defaultConfig: {
		centerX: .5,
		centerY: .5,
		offsetX: 50,
		offsetY: 0,
		radius: 25,
		feather: 50,
		opacity: 1,
		mode: "SeamlessHeal"
	}
});

//#endregion
//#region ../../nodes/node-patch-heal/dist/server.mjs
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
let PatchHealProcessor = class PatchHealProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item();
			const maskItem = resolver.input("Mask").item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = PatchHealNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "PatchHeal processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = PATCH_HEAL_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "PatchHeal",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs,
				maskMedia: maskItem?.data
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
				error: err instanceof Error ? err.message : "PatchHeal processing failed"
			};
		}
	}
};
PatchHealProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], PatchHealProcessor);
var server_default = defineNode(metadata, { backendProcessor: PatchHealProcessor });

//#endregion
export { server_default as default };