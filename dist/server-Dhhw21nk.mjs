import { C as SingleOutputGenericSchema, E as appendOperation, N as getActiveMediaMetadata, O as createOutputItemSchema, a as TOKENS, w as VirtualMediaDataSchema } from "./dist-CQCeP0r0.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BW9d6tuA.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-corner-pin/dist/utils-Ch93CaCz.mjs
function getDefaultPoints() {
	return [
		{
			x: 0,
			y: 0
		},
		{
			x: 100,
			y: 0
		},
		{
			x: 0,
			y: 100
		},
		{
			x: 100,
			y: 100
		}
	];
}

//#endregion
//#region ../../nodes/node-corner-pin/dist/metadata-D8bv5fhZ.mjs
const CornerPinNodeConfigSchema = z$1.object({ points: z$1.array(z$1.object({
	x: z$1.number(),
	y: z$1.number()
})).optional() }).strict();
CornerPinNodeConfigSchema.extend({
	op: z$1.literal("CornerPin"),
	metadata: z$1.any().optional()
});
const CornerPinResultSchema = SingleOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema)
]));
const CORNER_PIN_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "CornerPin",
	displayName: "Corner Pin",
	description: "Four-point perspective warp",
	category: "Media",
	subcategory: void 0,
	configSchema: CornerPinNodeConfigSchema,
	resultSchema: CornerPinResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"Video",
				"SVG",
				"GIF",
				"Lottie"
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
			label: "Warped",
			order: 0,
			description: "The perspective warped media output"
		}]
	},
	defaultConfig: { points: getDefaultPoints() }
});

//#endregion
//#region ../../nodes/node-corner-pin/dist/server.mjs
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
let CornerPinProcessor = class CornerPinProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input("Input").item();
			if (!inputItem) return {
				success: false,
				error: "Missing required input"
			};
			const config = CornerPinNodeConfigSchema.parse(node.config ?? {});
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Corner Pin processing failed - No input data"
			};
			const inputMeta = getActiveMediaMetadata(inputMedia);
			if (!inputMeta || !inputMeta.width || !inputMeta.height) return {
				success: false,
				error: "No active media metadata found for input"
			};
			const children = [inputMedia];
			const finalMeta = inputMeta;
			const outputType = CORNER_PIN_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const resultOutput = appendOperation(inputMedia, {
				op: "CornerPin",
				points: config.points && config.points.length === 4 ? config.points : getDefaultPoints(),
				metadata: finalMeta,
				dataType: outputType
			});
			resultOutput.children = children;
			const resultOutputHandle = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output").find((h) => h.label.includes("Warped"));
			if (!resultOutputHandle) return {
				success: false,
				error: "Missing required output handle"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: resultOutput,
						outputHandleId: resultOutputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Corner Pin processing failed"
			};
		}
	}
};
CornerPinProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], CornerPinProcessor);
var server_default = defineNode(metadata, { backendProcessor: CornerPinProcessor });

//#endregion
export { server_default as default };