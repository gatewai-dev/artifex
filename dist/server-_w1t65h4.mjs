import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-flip/dist/metadata-CzVuZ2u1.mjs
const flipConfig = configBuilder().field("horizontal", z$1.boolean().default(true), { description: "Mirror horizontally along the vertical center axis." }).field("vertical", z$1.boolean().default(false), { description: "Mirror vertically along the horizontal center axis." }).field("diagonal", z$1.boolean().default(false), { description: "Swap horizontal and vertical axes (diagonal transposition)." }).field("mode", z$1.enum([
	"horizontal",
	"vertical",
	"both",
	"diagonal",
	"antiDiagonal",
	"custom"
]).default("horizontal"), { description: "Quick preset mode for flipping or transposition." }).field("symmetry", z$1.enum([
	"none",
	"leftToRight",
	"rightToLeft",
	"topToBottom",
	"bottomToTop",
	"quadrant"
]).default("none"), { description: "Split-mirror reflection and symmetry effects." }).build();
const FlipNodeConfigSchema = flipConfig.schema;
const FlipResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const FLIP_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
function calculateFlipDimensions(width, height, config) {
	if (config.mode === "diagonal" || config.mode === "antiDiagonal" || config.mode === "custom" && config.diagonal || config.diagonal && !config.mode) return {
		width: height,
		height: width
	};
	return {
		width,
		height
	};
}
const metadata = defineMetadata({
	type: "Flip",
	displayName: "Flip",
	description: "Mirror, flip, transpose, or reflect visual media horizontally, vertically, diagonally, or in kaleidoscopic split symmetry",
	category: "Media",
	subcategory: void 0,
	configSchema: FlipNodeConfigSchema,
	resultSchema: FlipResultSchema,
	configHandles: flipConfig.configHandles,
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
	defaultConfig: {
		horizontal: true,
		vertical: false,
		diagonal: false,
		mode: "horizontal",
		symmetry: "none"
	}
});

//#endregion
//#region ../../nodes/node-flip/dist/server.mjs
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
let FlipProcessor = class FlipProcessor$1 {
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
			const config = FlipNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Flip processing failed - No input data"
			};
			const baseMeta = getActiveMediaMetadata(inputMedia) ?? inputMedia.metadata;
			const currentWidth = baseMeta?.width;
			const currentHeight = baseMeta?.height;
			let finalMeta = baseMeta;
			if (currentWidth && currentHeight) {
				const dims = calculateFlipDimensions(currentWidth, currentHeight, config);
				finalMeta = {
					...baseMeta,
					width: dims.width,
					height: dims.height
				};
			}
			const outputType = FLIP_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const output = appendOperation(inputMedia, {
				op: "Flip",
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
				error: err instanceof Error ? err.message : "Flip processing failed"
			};
		}
	}
};
FlipProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], FlipProcessor);
var server_default = defineNode(metadata, { backendProcessor: FlipProcessor });

//#endregion
export { server_default as default };