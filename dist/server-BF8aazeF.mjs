import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-D86uNdKf.mjs";
import { o as resolveMediaSourceUrl } from "./dist-BJT_v1BL.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BdNfjggX.mjs";
import { a as ImageResultSchema, l as VideoResultSchema, u as configBuilder } from "./dist-DHiCqHc6.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-apply-lut/dist/metadata-DikGEq19.mjs
const lutConfig = configBuilder().field("intensity", z$1.number().min(0).max(10).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Intensity Signal"
}).build();
const LutNodeConfigSchema = lutConfig.schema;
const LutResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const LUT_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "ApplyLUT",
	displayName: "Apply LUT",
	description: "Apply a color lookup table (.cube) to media",
	category: "Media",
	subcategory: void 0,
	configSchema: LutNodeConfigSchema,
	resultSchema: LutResultSchema,
	configHandles: lutConfig.configHandles,
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
		}, {
			dataTypes: ["LUT"],
			required: true,
			label: "Lut",
			order: 1
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
	defaultConfig: { intensity: 1 }
});

//#endregion
//#region ../../nodes/node-apply-lut/dist/server.mjs
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
let LutProcessor = class LutProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item();
			const lutItem = resolver.input("Lut").item();
			if (!inputItem) return {
				success: false,
				error: "Missing media input"
			};
			if (!lutItem) return {
				success: false,
				error: "Missing LUT input"
			};
			const config = LutNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "LUT processing failed - No input media data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = LUT_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const finalMeta = activeMeta ?? inputMedia.metadata;
			const lutData = lutItem.data;
			const output = appendOperation(inputMedia, {
				op: "ApplyLUT",
				lutUrl: resolveMediaSourceUrl(lutData) || (lutData?.operation)?.lutUrl,
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
				error: err instanceof Error ? err.message : "LUT processing failed"
			};
		}
	}
};
LutProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], LutProcessor);
var server_default = defineNode(metadata, { backendProcessor: LutProcessor });

//#endregion
export { server_default as default };