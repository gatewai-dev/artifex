import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-vHBVmGr1.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CREtBW5m.mjs";
import { c as VideoResultSchema, i as ImageResultSchema, l as configBuilder } from "./dist-BxNhIWiB.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-blur/dist/metadata-DB3vxGSq.mjs
const MAX_BLUR = 100;
const blurConfig = configBuilder().field("blurType", z$1.enum([
	"Gaussian",
	"Box",
	"Median",
	"Motion",
	"Bilateral",
	"Edge-preserving",
	"Radial",
	"Zoom"
]).default("Gaussian"), {
	bindable: false,
	label: "Blur Type"
}).field("strength", z$1.number().min(0).max(MAX_BLUR).default(5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Strength Signal",
	description: "The intensity of the blur. 0 = no blur. Can be modulated by a static number or a dynamic signal."
}).field("angle", z$1.number().int().min(0).max(360).default(0), {
	bindable: false,
	label: "Angle"
}).field("sigmaColor", z$1.number().min(.01).max(1).default(.1), {
	bindable: false,
	label: "Color Sigma"
}).field("centerX", z$1.number().min(0).max(1).default(.5), {
	bindable: false,
	label: "Center X"
}).field("centerY", z$1.number().min(0).max(1).default(.5), {
	bindable: false,
	label: "Center Y"
}).build();
const BlurNodeConfigSchema = blurConfig.schema;
const BlurResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const BLUR_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "Blur",
	displayName: "Blur",
	description: "Apply blur to a media",
	category: "Media",
	subcategory: void 0,
	configSchema: BlurNodeConfigSchema,
	resultSchema: BlurResultSchema,
	configHandles: blurConfig.configHandles,
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
	defaultConfig: {
		blurType: "Gaussian",
		strength: 5,
		angle: 0,
		sigmaColor: .1,
		centerX: .5,
		centerY: .5
	}
});

//#endregion
//#region ../../nodes/node-blur/dist/server.mjs
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
let BlurProcessor = class BlurProcessor$1 {
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
			const config = BlurNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Blur processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = BLUR_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "Blur",
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
				error: err instanceof Error ? err.message : "Blur processing failed"
			};
		}
	}
};
BlurProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], BlurProcessor);
var server_default = defineNode(metadata, { backendProcessor: BlurProcessor });

//#endregion
export { server_default as default };