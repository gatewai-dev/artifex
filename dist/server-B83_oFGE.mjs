import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { t as AudioResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-video-to-audio/dist/metadata-pZWvSeT_.mjs
const VideoToAudioNodeConfigSchema = z$1.object({}).strict();
const VideoToAudioResultSchema = AudioResultSchema;
const metadata = defineMetadata({
	type: "VideoToAudio",
	displayName: "Video to Audio",
	description: "Converts a video input to an audio output.",
	category: "Media",
	subcategory: "Audio",
	configSchema: VideoToAudioNodeConfigSchema,
	resultSchema: VideoToAudioResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: ["Video"],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Audio"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {}
});

//#endregion
//#region ../../nodes/node-video-to-audio/dist/server.mjs
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
let VideoToAudioProcessor = class VideoToAudioProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing video input"
			};
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Video to Audio failed - No input data"
			};
			const output = appendOperation(inputMedia, {
				op: "VideoToAudio",
				metadata: getActiveMediaMetadata(inputMedia) ?? inputMedia.metadata,
				dataType: "Audio"
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
						type: "Audio",
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Video to Audio failed"
			};
		}
	}
};
VideoToAudioProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], VideoToAudioProcessor);
var server_default = defineNode(metadata, { backendProcessor: VideoToAudioProcessor });

//#endregion
export { server_default as default };