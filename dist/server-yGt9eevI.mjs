import { C as getActiveMediaMetadata, _ as createOutputItemSchema, f as SingleOutputGenericSchema, h as appendOperation, p as VirtualMediaDataSchema } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-media-cut/dist/metadata-w6rM_u3t.mjs
const MediaCutConfigSchema = z$1.object({ segments: z$1.array(z$1.object({
	startSec: z$1.number().min(0).max(86400),
	endSec: z$1.number().min(0).max(86400).optional()
}).superRefine((seg, ctx) => {
	if (seg.endSec !== void 0 && seg.endSec <= seg.startSec) ctx.addIssue({
		code: z$1.ZodIssueCode.custom,
		path: ["endSec"],
		message: "endSec must be greater than startSec"
	});
})).max(100).default([]) }).strict();
const MediaCutResultSchema = z$1.union([
	SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema)),
	SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Audio"), VirtualMediaDataSchema)),
	SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Lottie"), VirtualMediaDataSchema)),
	SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema))
]);
MediaCutConfigSchema.extend({
	op: z$1.literal("MediaCut"),
	metadata: z$1.any().optional()
});
const metadata = defineMetadata({
	type: "MediaCut",
	displayName: "Cut",
	description: "Cut video, audio, lottie or gif by specifying start and end times.",
	category: "Media",
	subcategory: void 0,
	configSchema: MediaCutConfigSchema,
	resultSchema: MediaCutResultSchema,
	isTerminal: false,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: [
				"Video",
				"Audio",
				"Lottie",
				"GIF"
			],
			required: true,
			label: "Media",
			order: 0
		}],
		outputs: [{
			dataTypes: [
				"Video",
				"Audio",
				"Lottie",
				"GIF"
			],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { segments: [] }
});

//#endregion
//#region ../../nodes/node-media-cut/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MediaCutProcessor = class MediaCutProcessor$1 {
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
				error: "MediaCut processing failed - No input data"
			};
			const inputType = inputItem.type;
			const config = MediaCutConfigSchema.parse(node.config);
			const activeMeta = getActiveMediaMetadata(inputMedia);
			if (!activeMeta) return {
				success: false,
				error: "Unable to read media metadata"
			};
			const durationMs = activeMeta.durationMs ?? 0;
			if (durationMs <= 0) return {
				success: false,
				error: "Media duration is unknown or zero"
			};
			const segments = config.segments || [];
			if (segments.length === 0) {
				const outputHandle$1 = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
				if (!outputHandle$1) return {
					success: false,
					error: "Output handle is missing"
				};
				return {
					success: true,
					newResult: {
						selectedOutputIndex: 0,
						outputs: [{ items: [{
							type: inputType,
							data: inputMedia,
							outputHandleId: outputHandle$1.id
						}] }]
					}
				};
			}
			const resolvedSegments = segments.map((s) => ({
				startSec: Math.max(0, s.startSec),
				endSec: s.endSec != null ? Math.min(s.endSec, durationMs / 1e3) : durationMs / 1e3
			}));
			if (resolvedSegments.some((s) => (s.endSec ?? 0) <= s.startSec)) return {
				success: false,
				error: "One or more cut ranges are invalid"
			};
			const totalDurationMs = resolvedSegments.reduce((sum, s) => sum + ((s.endSec ?? 0) - s.startSec) * 1e3, 0);
			const output = appendOperation(inputMedia, {
				op: "MediaCut",
				timeline: { segments: resolvedSegments },
				metadata: {
					...activeMeta,
					durationMs: totalDurationMs
				},
				dataType: inputMedia.operation.dataType
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
						type: inputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "MediaCut processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], MediaCutProcessor.prototype, "graph", void 0);
MediaCutProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], MediaCutProcessor);
var server_default = defineNode(metadata, { backendProcessor: MediaCutProcessor });

//#endregion
export { server_default as default };