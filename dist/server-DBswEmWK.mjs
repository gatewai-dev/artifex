import { D as checkNodeResultCache, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, w as VirtualMediaDataSchema, z as stampResult } from "./dist-Bbhn-cb5.mjs";
import { a as defineMetadata, i as defineNode } from "./server-RmKl3RaO.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-caption-generator/dist/metadata-B5qIbo68.mjs
const CAPTION_GEN_MODELS = ["fal-ai/whisper"];
const WHISPER_LANGUAGES = [
	"af",
	"am",
	"ar",
	"as",
	"az",
	"ba",
	"be",
	"bg",
	"bn",
	"bo",
	"br",
	"bs",
	"ca",
	"cs",
	"cy",
	"da",
	"de",
	"el",
	"en",
	"es",
	"et",
	"eu",
	"fa",
	"fi",
	"fo",
	"fr",
	"gl",
	"gu",
	"ha",
	"haw",
	"he",
	"hi",
	"hr",
	"ht",
	"hu",
	"hy",
	"id",
	"is",
	"it",
	"ja",
	"jw",
	"ka",
	"kk",
	"km",
	"kn",
	"ko",
	"la",
	"lb",
	"ln",
	"lo",
	"lt",
	"lv",
	"mg",
	"mi",
	"mk",
	"ml",
	"mn",
	"mr",
	"ms",
	"mt",
	"my",
	"ne",
	"nl",
	"nn",
	"no",
	"oc",
	"pa",
	"pl",
	"ps",
	"pt",
	"ro",
	"ru",
	"sa",
	"sd",
	"si",
	"sk",
	"sl",
	"sn",
	"so",
	"sq",
	"sr",
	"su",
	"sv",
	"sw",
	"ta",
	"te",
	"tg",
	"th",
	"tk",
	"tl",
	"tr",
	"tt",
	"uk",
	"ur",
	"uz",
	"vi",
	"yi",
	"yo",
	"zh"
];
const CaptionGeneratorNodeConfigSchema = z$1.object({
	model: z$1.enum(CAPTION_GEN_MODELS).default("fal-ai/whisper"),
	task: z$1.literal("transcribe"),
	language: z$1.union([z$1.enum(WHISPER_LANGUAGES), z$1.literal("auto")]).default("auto"),
	chunk_level: z$1.enum(["segment", "word"]).default("segment"),
	batch_size: z$1.number().int().min(1).max(256).default(32)
}).strict();
const CaptionGeneratorResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Caption"), VirtualMediaDataSchema));
const metadata = defineMetadata({
	type: "CaptionGenerator",
	displayName: "Caption Generator",
	description: "Generate captions for audio or video using AI",
	category: "AI",
	subcategory: "Audio",
	configSchema: CaptionGeneratorNodeConfigSchema,
	resultSchema: CaptionGeneratorResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Audio", "Video"],
			required: true,
			label: "Input",
			order: 0
		}, {
			dataTypes: ["Text"],
			required: false,
			label: "Prompt",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Caption"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: CaptionGeneratorNodeConfigSchema.parse({
		model: "fal-ai/whisper",
		task: "transcribe",
		language: "auto",
		chunk_level: "segment",
		batch_size: 32
	}),
	pricing: (_config, inputs = {}) => {
		const inputEntry = Object.values(inputs).find(({ connectionValid, outputItem }) => connectionValid && outputItem?.type === "Audio");
		if (!inputEntry) return 5;
		const durationMs = (inputEntry.outputItem?.data)?.metadata?.durationMs;
		return Math.max(5, Math.round((durationMs || 1e3) / 1e3));
	}
});

//#endregion
//#region ../../nodes/node-caption-generator/dist/server.mjs
function formatSrtTime(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor(seconds % 3600 / 60);
	const s = Math.floor(seconds % 60);
	const ms = Math.round(seconds % 1 * 1e3);
	return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}
function convertChunksToSrt(chunks) {
	return chunks.map((chunk, index) => {
		const [start, end] = chunk.timestamp;
		return `${index + 1}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${chunk.text}\n`;
	}).join("\n");
}
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
let CaptionGeneratorProcessor = class CaptionGeneratorProcessor$1 {
	storage;
	graph;
	aiProvider;
	env;
	mediaResolver;
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const videoInput = resolver.input("Input").asVideo();
			const audioInput = resolver.input("Input").asAudio();
			const mediaInput = videoInput ?? audioInput;
			const fingerprintInput = {
				input: mediaInput,
				config: node.config
			};
			const cached = checkNodeResultCache(node.result, fingerprintInput);
			if (cached) {
				logger.info("Fingerprint matches, returning cached result for STT");
				return {
					success: true,
					newResult: cached
				};
			}
			const nodeConfig = CaptionGeneratorNodeConfigSchema.parse(node.config);
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
			if (!audioBuffer || !audioMimeType) throw new Error("Failed to prepare audio for transcription");
			const fal = this.aiProvider.getFal();
			const falAudioUrl = await fal.storage.upload(new Blob([audioBuffer], { type: audioMimeType }), { lifecycle: { expiresIn: "1d" } });
			const promptInput = resolver.input("Prompt").asText() || "";
			const input = {
				audio_url: falAudioUrl,
				task: nodeConfig.task,
				language: nodeConfig.language === "auto" ? void 0 : nodeConfig.language,
				chunk_level: nodeConfig.chunk_level,
				batch_size: nodeConfig.batch_size,
				prompt: promptInput
			};
			const falData = (await fal.subscribe(nodeConfig.model, { input })).data;
			if (!falData.chunks) throw new Error("Fal AI did not return any transcription chunks");
			const srtContent = convertChunksToSrt(falData.chunks);
			const durationSec = falData.chunks[falData.chunks.length - 1]?.timestamp[1];
			const durationMs = durationSec ? Math.round(durationSec * 1e3) : 0;
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) throw new Error("Output handle is missing");
			return {
				success: true,
				newResult: stampResult({
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: "Caption",
						data: {
							metadata: { durationMs: durationMs || void 0 },
							operation: {
								op: "source",
								srtText: srtContent,
								dataType: "Caption"
							},
							children: []
						},
						outputHandleId: outputHandle.id
					}] }]
				}, fingerprintInput)
			};
		} catch (err) {
			const errMessage = err instanceof Error ? err.message : "Caption Generation Failed";
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
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], CaptionGeneratorProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], CaptionGeneratorProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], CaptionGeneratorProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], CaptionGeneratorProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], CaptionGeneratorProcessor.prototype, "mediaResolver", void 0);
CaptionGeneratorProcessor = __decorate([injectable()], CaptionGeneratorProcessor);
var server_default = defineNode(metadata, { backendProcessor: CaptionGeneratorProcessor });

//#endregion
export { server_default as default };