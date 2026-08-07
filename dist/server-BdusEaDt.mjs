import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-vHBVmGr1.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CREtBW5m.mjs";
import { c as VideoResultSchema, t as AudioResultSchema } from "./dist-BxNhIWiB.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-fade/dist/metadata-CJ5FKT2I.mjs
const FadeCurveSchema = z$1.enum([
	"linear",
	"exponential",
	"scurve"
]);
const FadeNodeConfigSchema = z$1.object({
	fadeInDuration: z$1.number().min(0).max(60).default(0).describe("Duration in seconds of fade in from silence"),
	fadeOutDuration: z$1.number().min(0).max(60).default(0).describe("Duration in seconds of fade out to silence"),
	fadeInCurve: FadeCurveSchema.default("linear").describe("Envelope shape for fade in"),
	fadeOutCurve: FadeCurveSchema.default("linear").describe("Envelope shape for fade out")
});
const FadeResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const FADE_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "AudioFade",
	displayName: "Fade In / Fade Out",
	description: "Applies a configurable gain envelope for audio and video.",
	category: "Media",
	subcategory: "Audio",
	configSchema: FadeNodeConfigSchema,
	resultSchema: FadeResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: ["Audio", "Video"],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Audio", "Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		fadeInDuration: 0,
		fadeOutDuration: 0,
		fadeInCurve: "linear",
		fadeOutCurve: "linear"
	}
});

//#endregion
//#region ../../nodes/node-audio-fade/dist/server.mjs
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
let FadeProcessor = class FadeProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = FadeNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Fade failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = FADE_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "AudioFade",
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType
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
						type: outputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Fade failed"
			};
		}
	}
};
FadeProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], FadeProcessor);
var server_default = defineNode(metadata, { backendProcessor: FadeProcessor });

//#endregion
export { server_default as default };