import { M as getActiveMediaMetadata, T as appendOperation, a as TOKENS } from "./dist-BVlcG2fv.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CMCofAZH.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-DsOpBQDR.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-modulate/dist/metadata-hHEi-znM.mjs
const modulateConfig = configBuilder().field("hue", z$1.number().int().min(0).max(359).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Hue Signal"
}).field("brightness", z$1.number().multipleOf(.01).min(0).max(2).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Brightness Signal"
}).field("contrast", z$1.number().multipleOf(.01).min(0).max(2).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Contrast Signal"
}).field("exposure", z$1.number().multipleOf(.01).min(-2).max(2).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Exposure Signal"
}).field("saturation", z$1.number().multipleOf(.01).min(0).max(2).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Saturation Signal"
}).field("sepia", z$1.number().multipleOf(.01).min(0).max(1).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Sepia Signal"
}).build();
const ModulateNodeConfigSchema = modulateConfig.schema;
const ModulateResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
ModulateNodeConfigSchema.extend({
	op: z$1.literal("Modulate"),
	metadata: z$1.any().optional()
});
const MODULATE_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "Modulate",
	displayName: "Modulate",
	description: "Apply Modulate adjustments to an image",
	category: "Media",
	subcategory: void 0,
	configSchema: ModulateNodeConfigSchema,
	resultSchema: ModulateResultSchema,
	configHandles: modulateConfig.configHandles,
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
		hue: 0,
		brightness: 1,
		contrast: 1,
		exposure: 0,
		saturation: 1,
		sepia: 0
	}
});

//#endregion
//#region ../../nodes/node-modulate/dist/server.mjs
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
let ModulateProcessor = class ModulateProcessor$1 {
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
			const config = ModulateNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Modulate processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = MODULATE_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "Modulate",
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
				error: err instanceof Error ? err.message : "Modulate processing failed"
			};
		}
	}
};
ModulateProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ModulateProcessor);
var server_default = defineNode(metadata, { backendProcessor: ModulateProcessor });

//#endregion
export { server_default as default };