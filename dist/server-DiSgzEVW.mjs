import { M as getActiveMediaMetadata, T as appendOperation, a as TOKENS } from "./dist-CgOGu4Rk.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BpjyD7le.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-B16HFQo4.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-vignette/dist/metadata-wFXiI_Ed.mjs
const MAX_STRENGTH = 100;
const vignetteConfig = configBuilder().field("strength", z$1.number().min(0).max(MAX_STRENGTH).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Strength Signal",
	description: "The intensity of the vignette darkening effect. 0 = no vignette."
}).field("radius", z$1.number().min(.1).max(2).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Radius Signal",
	description: "The extent/size of the vignette."
}).field("softness", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Softness Signal",
	description: "The softness of the vignette transition edge."
}).field("roundness", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Roundness Signal",
	description: "0.0 matches the image aspect ratio, 1.0 is a perfect circle."
}).field("centerX", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Center X Signal",
	description: "The X coordinate of the vignette center."
}).field("centerY", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Center Y Signal",
	description: "The Y coordinate of the vignette center."
}).build();
const VignetteNodeConfigSchema = vignetteConfig.schema;
const VignetteResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const VIGNETTE_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "Vignette",
	displayName: "Vignette",
	description: "Apply a classic vignette effect with dark corners to visual media",
	category: "Media",
	subcategory: void 0,
	configSchema: VignetteNodeConfigSchema,
	resultSchema: VignetteResultSchema,
	configHandles: vignetteConfig.configHandles,
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
		strength: 50,
		radius: 1,
		softness: .5,
		roundness: .5,
		centerX: .5,
		centerY: .5
	}
});

//#endregion
//#region ../../nodes/node-vignette/dist/server.mjs
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
let VignetteProcessor = class VignetteProcessor$1 {
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
			const config = VignetteNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Vignette processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = VIGNETTE_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "Vignette",
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
				error: err instanceof Error ? err.message : "Vignette processing failed"
			};
		}
	}
};
VignetteProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], VignetteProcessor);
var server_default = defineNode(metadata, { backendProcessor: VignetteProcessor });

//#endregion
export { server_default as default };