import { D as checkNodeResultCache, E as appendOperation, N as getActiveMediaMetadata, a as TOKENS, b as MultiOutputGenericSchema, c as logger, f as AnyOutputUnionSchema, z as stampResult } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-smart-cut/dist/metadata-DKbwb5ln.mjs
const SmartCutNodeConfigSchema = z$1.object({
	paddingLeftMs: z$1.number().min(0).default(200).describe("Left padding in milliseconds"),
	paddingRightMs: z$1.number().min(0).default(200).describe("Right padding in milliseconds"),
	mergeThresholdMs: z$1.number().min(0).default(500).describe("Merge threshold in milliseconds for adjacent speech segments"),
	minSegmentDurationMs: z$1.number().min(0).default(100).describe("Minimum duration of a speech segment in milliseconds to keep")
});
const SmartCutResultSchema = MultiOutputGenericSchema(AnyOutputUnionSchema);
const metadata = defineMetadata({
	type: "SmartCut",
	displayName: "Smart Cut",
	description: "Cuts media to keep the parts where speech is detected.",
	category: "AI",
	subcategory: "Audio",
	configSchema: SmartCutNodeConfigSchema,
	resultSchema: SmartCutResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Video", "Audio"],
			required: true,
			label: "Media",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Video", "Audio"],
			label: "Result",
			order: 0
		}]
	},
	pricing: (_config, inputs) => {
		if (!inputs) return 5;
		const inputEntry = Object.values(inputs).find(({ connectionValid, outputItem }) => connectionValid && (outputItem?.type === "Audio" || outputItem?.type === "Video"));
		if (!inputEntry) return 5;
		const durationMs = (inputEntry.outputItem?.data)?.metadata?.durationMs;
		return Math.max(5, Math.round((durationMs || 1e3) / 1e3));
	},
	defaultConfig: {
		paddingLeftMs: 200,
		paddingRightMs: 200,
		mergeThresholdMs: 500,
		minSegmentDurationMs: 100,
		chunkLevel: "word",
		language: void 0
	}
});

//#endregion
//#region ../../nodes/node-smart-cut/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const SUPPORTED_AUDIO_MIMETYPES = [
	"audio/mpeg",
	"audio/mp3",
	"video/mp4",
	"audio/mp4",
	"audio/x-m4a",
	"audio/wav",
	"audio/webm",
	"video/webm"
];
let SmartCutProcessor = class SmartCutProcessor$1 {
	storage;
	graph;
	aiProvider;
	env;
	mediaResolver;
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const videoInput = resolver.input("Media").asVideo();
			const audioInput = resolver.input("Media").asAudio();
			const mediaInput = videoInput ?? audioInput;
			if (!mediaInput) return {
				success: false,
				error: "Missing input media (Video or Audio)"
			};
			const fingerprintInput = {
				input: mediaInput,
				config: node.config
			};
			const cached = checkNodeResultCache(node.result, fingerprintInput);
			if (cached) {
				logger.info("Fingerprint matches, returning cached result for Smart Cut");
				return {
					success: true,
					newResult: cached
				};
			}
			const nodeConfig = SmartCutNodeConfigSchema.parse(node.config);
			const activeMeta = getActiveMediaMetadata(mediaInput);
			if (!activeMeta) return {
				success: false,
				error: "Unable to read media metadata"
			};
			const durationMs = activeMeta.durationMs ?? 0;
			if (durationMs <= 0) return {
				success: false,
				error: "Media duration is unknown or zero"
			};
			let audioBuffer;
			let audioMimeType;
			if (mediaInput.operation.op === "source") {
				const source = mediaInput.operation.source;
				const key = source.entity?.key;
				const bucket = source.entity?.bucket ?? this.env.R2_ASSETS_BUCKET;
				const mimeType = source.entity?.mimeType;
				if (key && mimeType && SUPPORTED_AUDIO_MIMETYPES.includes(mimeType)) {
					audioBuffer = await this.storage.getFromStorage(key, bucket);
					audioMimeType = mimeType;
				}
			}
			if (!audioBuffer) {
				const result = await this.mediaResolver.resolveToBuffer(mediaInput, "Audio", { userId: data.canvas.userId });
				audioBuffer = result.buffer;
				audioMimeType = result.mimeType ?? "audio/mpeg";
			}
			if (!audioBuffer || !audioMimeType) throw new Error("Failed to prepare audio for speech detection");
			const fal = this.aiProvider.getFal();
			const input = { audio_url: await fal.storage.upload(new Blob([audioBuffer], { type: audioMimeType }), { lifecycle: { expiresIn: "1d" } }) };
			const falData = (await fal.subscribe("fal-ai/silero-vad", { input })).data;
			if (!falData.has_speech) throw new Error("No speech detected in the audio");
			if (!falData.timestamps) throw new Error("Fal AI did not return any speech timestamps");
			const rawSegments = falData.timestamps.filter((c) => typeof c.start === "number" && typeof c.end === "number" && c.start <= c.end).map((c) => ({
				startSec: c.start,
				endSec: c.end
			}));
			const mergedRaw = [];
			const sortedRaw = [...rawSegments].sort((a, b) => a.startSec - b.startSec);
			for (const seg of sortedRaw) if (mergedRaw.length === 0) mergedRaw.push({ ...seg });
			else {
				const last = mergedRaw[mergedRaw.length - 1];
				if (seg.startSec - last.endSec <= nodeConfig.mergeThresholdMs / 1e3) last.endSec = Math.max(last.endSec, seg.endSec);
				else mergedRaw.push({ ...seg });
			}
			const durationSec = durationMs / 1e3;
			const paddedSegments = mergedRaw.map((s) => {
				return {
					startSec: Math.max(0, s.startSec - nodeConfig.paddingLeftMs / 1e3),
					endSec: Math.min(durationSec, s.endSec + nodeConfig.paddingRightMs / 1e3)
				};
			});
			const resolvedSegments = [];
			const sortedPadded = [...paddedSegments].sort((a, b) => a.startSec - b.startSec);
			for (const seg of sortedPadded) if (resolvedSegments.length === 0) resolvedSegments.push({ ...seg });
			else {
				const last = resolvedSegments[resolvedSegments.length - 1];
				if (seg.startSec <= last.endSec) last.endSec = Math.max(last.endSec, seg.endSec);
				else resolvedSegments.push({ ...seg });
			}
			const finalSegments = resolvedSegments.filter((s) => s.endSec - s.startSec >= nodeConfig.minSegmentDurationMs / 1e3);
			const totalDurationMs = finalSegments.reduce((sum, s) => sum + (s.endSec - s.startSec) * 1e3, 0);
			const output = appendOperation(mediaInput, {
				op: "MediaCut",
				timeline: { segments: finalSegments },
				metadata: {
					...activeMeta,
					durationMs: totalDurationMs
				},
				dataType: mediaInput.operation.dataType
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) throw new Error("Output handle is missing");
			const inputType = mediaInput.operation.dataType;
			const newResult = cloneResult(node.result);
			newResult.outputs.push({ items: [{
				type: inputType,
				data: output,
				outputHandleId: outputHandle.id
			}] });
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult: stampResult(newResult, fingerprintInput)
			};
		} catch (err) {
			const errMessage = err instanceof Error ? err.message : "Smart Cut Failed";
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, errMessage);
			return {
				success: false,
				error: errMessage
			};
		}
	}
};
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], SmartCutProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], SmartCutProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], SmartCutProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], SmartCutProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], SmartCutProcessor.prototype, "mediaResolver", void 0);
SmartCutProcessor = __decorate([injectable()], SmartCutProcessor);
function cloneResult(existing) {
	if (existing == null || !Array.isArray(existing.outputs)) return {
		outputs: [],
		selectedOutputIndex: 0
	};
	return structuredClone(existing);
}
var server_default = defineNode(metadata, { backendProcessor: SmartCutProcessor });

//#endregion
export { server_default as default };