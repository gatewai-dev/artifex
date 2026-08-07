import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { a as ImageResultSchema, l as VideoResultSchema, u as configBuilder } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-colorkey/dist/metadata-CzFbRLQp.mjs
const colorKeyConfig = configBuilder().field("keyColor", z$1.string().default("#00ff00"), {
	bindable: false,
	label: "Key Color"
}).field("similarity", z$1.number().min(0).max(1).default(.4), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Similarity",
	description: "How close the color must be to the Key Color to be removed."
}).field("smoothness", z$1.number().min(0).max(1).default(.1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Smoothness",
	description: "The softness of the transparency edge."
}).field("spillSuppression", z$1.number().min(0).max(1).default(.2), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Spill Suppression",
	description: "Amount of key color spill to remove from foreground edges."
}).field("colorSpace", z$1.enum(["YUV", "RGB"]).default("YUV"), {
	bindable: false,
	label: "Color Space",
	description: "Color space used to calculate similarity distance."
}).field("spillSuppressionType", z$1.enum([
	"Desaturate",
	"Neutralize",
	"None"
]).default("Desaturate"), {
	bindable: false,
	label: "Spill Style",
	description: "How key color spill is suppressed on foreground edges."
}).build();
const ColorKeyNodeConfigSchema = colorKeyConfig.schema;
const ColorKeyResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const COLORKEY_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "ColorKey",
	displayName: "Color Key",
	description: "Key out a color (chroma key) with spill suppression",
	category: "Media",
	subcategory: void 0,
	configSchema: ColorKeyNodeConfigSchema,
	resultSchema: ColorKeyResultSchema,
	configHandles: colorKeyConfig.configHandles,
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
		keyColor: "#00ff00",
		similarity: .4,
		smoothness: .1,
		spillSuppression: .2,
		colorSpace: "YUV",
		spillSuppressionType: "Desaturate"
	}
});

//#endregion
//#region ../../nodes/node-colorkey/dist/server.mjs
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
let ColorKeyProcessor = class ColorKeyProcessor$1 {
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
			const config = ColorKeyNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "ColorKey processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = COLORKEY_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "ColorKey",
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
				error: err instanceof Error ? err.message : "ColorKey processing failed"
			};
		}
	}
};
ColorKeyProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ColorKeyProcessor);
var server_default = defineNode(metadata, { backendProcessor: ColorKeyProcessor });

//#endregion
export { server_default as default };