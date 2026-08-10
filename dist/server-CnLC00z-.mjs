import { C as VirtualMediaDataSchema, D as createOutputItemSchema, M as getActiveMediaMetadata, S as SingleOutputGenericSchema, T as appendOperation, a as TOKENS } from "./dist-DdOALdQJ.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BLjQvdJL.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-extract-frame/dist/metadata-9R5oYMhN.mjs
const ExtractFrameConfigSchema = z$1.object({ frame: z$1.number().int().min(0).default(0) }).strict();
const ExtractFrameResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema));
ExtractFrameConfigSchema.extend({
	op: z$1.literal("ExtractFrame"),
	metadata: z$1.any().optional(),
	dataType: z$1.literal("Image")
});
const metadata = defineMetadata({
	type: "ExtractFrame",
	displayName: "Extract Frame",
	description: "Extract a single frame from a video, Lottie or GIF",
	category: "Media",
	subcategory: void 0,
	configSchema: ExtractFrameConfigSchema,
	resultSchema: ExtractFrameResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Video",
				"Lottie",
				"GIF"
			],
			required: true,
			label: "Media",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Image"],
			label: "Frame",
			order: 0
		}]
	},
	defaultConfig: { frame: 0 }
});

//#endregion
//#region ../../nodes/node-extract-frame/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExtractFrameProcessor = class ExtractFrameProcessor$1 {
	graph;
	constructor() {}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "ExtractFrame processing failed - No input data"
			};
			const config = ExtractFrameConfigSchema.parse(node.config);
			const activeMeta = getActiveMediaMetadata(inputMedia);
			if (!activeMeta) return {
				success: false,
				error: "Unable to read media metadata"
			};
			const fps = activeMeta.fps ?? 30;
			const durationMs = activeMeta.durationMs ?? 0;
			const totalFrames = durationMs > 0 ? Math.ceil(durationMs / 1e3 * fps) : 0;
			const output = appendOperation(inputMedia, {
				op: "ExtractFrame",
				frame: totalFrames > 0 ? Math.min(config.frame, totalFrames - 1) : config.frame,
				metadata: {
					width: activeMeta.width,
					height: activeMeta.height,
					fps: null,
					durationMs: null
				},
				dataType: "Image"
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
						type: "Image",
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "ExtractFrame processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], ExtractFrameProcessor.prototype, "graph", void 0);
ExtractFrameProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], ExtractFrameProcessor);
var server_default = defineNode(metadata, { backendProcessor: ExtractFrameProcessor });

//#endregion
export { server_default as default };