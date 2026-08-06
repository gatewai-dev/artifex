import { M as generateId, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, k as createVirtualMedia, w as VirtualMediaDataSchema, y as ModerationError } from "./dist-CJI3Jl43.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { o as createFileAsset } from "./server-Cw7TZObR.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-ClH_dFot.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-edit-video/dist/metadata-DQ8Uc_E0.mjs
const WAN_ASPECT_RATIOS = [
	"16:9",
	"9:16",
	"1:1",
	"4:3",
	"3:4"
];
const WAN_RESOLUTIONS = ["720p", "1080p"];
const WAN_EDIT_DURATIONS = [
	"0",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10"
];
const WAN_AUDIO_SETTINGS = ["auto", "origin"];
const WanEditConfigSchema = z$1.object({
	model: z$1.literal("fal-ai/wan/v2.7/edit-video"),
	wanAspectRatio: z$1.enum([...WAN_ASPECT_RATIOS, "original"]).or(z$1.literal("")).optional(),
	wanResolution: z$1.enum(WAN_RESOLUTIONS).default("1080p"),
	wanDurationSeconds: z$1.enum(WAN_EDIT_DURATIONS).default("0"),
	wanAudioSetting: z$1.enum(WAN_AUDIO_SETTINGS).default("auto"),
	wanSeed: z$1.number().max(2147483647).min(0).optional(),
	wanEnableSafetyChecker: z$1.boolean().default(true)
});
const GeminiEditConfigSchema = z$1.object({ model: z$1.literal("google/gemini-omni-flash/edit") });
const EditVideoNodeConfigSchema = z$1.discriminatedUnion("model", [WanEditConfigSchema, GeminiEditConfigSchema]);
const EditVideoResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema));
const metadata = defineMetadata({
	type: "VideoEdit",
	displayName: "AI Edit Video",
	description: "Edit an existing video using AI.",
	category: "AI",
	subcategory: "Video",
	configSchema: EditVideoNodeConfigSchema,
	resultSchema: EditVideoResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: { enabled: false },
	handles: {
		inputs: [{
			dataTypes: ["Video"],
			required: true,
			label: "Video",
			order: 0
		}, {
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { model: "google/gemini-omni-flash/edit" },
	validation: (_config, inputs) => {
		const videoInput = Object.values(inputs ?? {}).find((input) => {
			if (input?.metadata?.durationMs != null) return true;
			if (input?.entity?.mimeType?.startsWith("video/")) return true;
			return false;
		});
		if (videoInput) {
			const durationMs = videoInput.metadata?.durationMs ?? (videoInput.entity?.duration != null ? videoInput.entity.duration * 1e3 : null);
			if (durationMs && durationMs > 1e4) return { duration: "Input video duration exceeds 10 seconds" };
		}
		return null;
	},
	pricing(config, inputs) {
		if (config.model === "google/gemini-omni-flash/edit") {
			const GEMINI_PRICE_PER_SECOND = 20;
			if (!inputs) return GEMINI_PRICE_PER_SECOND;
			const videoInput$1 = Object.values(inputs).find((input) => {
				if (input?.metadata?.durationMs != null) return true;
				if (input?.entity?.mimeType?.startsWith("video/")) return true;
				return false;
			});
			if (!videoInput$1) return GEMINI_PRICE_PER_SECOND;
			const durationMs$1 = videoInput$1.metadata?.durationMs ?? (videoInput$1.entity?.duration != null ? videoInput$1.entity.duration * 1e3 : null);
			if (durationMs$1 == null || durationMs$1 <= 0) return GEMINI_PRICE_PER_SECOND;
			return Math.ceil(durationMs$1 / 1e3) * GEMINI_PRICE_PER_SECOND;
		}
		const PRICE_PER_SECOND = 20;
		if (!inputs) return PRICE_PER_SECOND;
		const videoInput = Object.values(inputs).find((input) => {
			if (input?.metadata?.durationMs != null) return true;
			if (input?.entity?.mimeType?.startsWith("video/")) return true;
			return false;
		});
		if (!videoInput) return PRICE_PER_SECOND;
		const durationMs = videoInput.metadata?.durationMs ?? (videoInput.entity?.duration != null ? videoInput.entity.duration * 1e3 : null);
		if (durationMs == null || durationMs <= 0) return PRICE_PER_SECOND;
		const durationSeconds = Math.ceil(durationMs / 1e3);
		return Math.max(9, durationSeconds) * PRICE_PER_SECOND;
	}
});

//#endregion
//#region ../../nodes/node-edit-video/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EditVideoProcessor = class EditVideoProcessor$1 {
	prisma;
	graph;
	aiProvider;
	mediaResolver;
	constructor() {}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const userPrompt = resolver.input("Prompt").required().asText();
			const videoInput = resolver.input("Video").required().asVideo();
			const config = EditVideoNodeConfigSchema.parse(node.config);
			const videoFileData = videoInput;
			const videoResult = await this.mediaResolver.resolveToUrl(videoFileData, "Video", { userId: data.canvas.userId });
			if (!videoResult.url) throw new Error("Failed to resolve video URL");
			const videoUrl = videoResult.url;
			const fal = this.aiProvider.getFal();
			let falModelId;
			const input = {
				prompt: userPrompt,
				video_url: videoUrl
			};
			if (config.model === "google/gemini-omni-flash/edit") {
				falModelId = "google/gemini-omni-flash/edit";
				logger.info("Starting video edit with Gemini Omni Flash");
			} else {
				falModelId = config.model;
				input.resolution = config.wanResolution;
				input.duration = parseInt(config.wanDurationSeconds, 10);
				input.audio_setting = config.wanAudioSetting;
				input.seed = config.wanSeed;
				input.enable_safety_checker = false;
				if (config.wanAspectRatio) input.aspect_ratio = config.wanAspectRatio;
				logger.info(`Starting video edit with Wan 2.7 — resolution: ${input.resolution}, duration: ${input.duration}`);
			}
			const falData = (await fal.subscribe(falModelId, { input })).data;
			if (!falData.video?.url) throw new Error("Fal response is missing video URL");
			const response = await fetch(falData.video.url);
			if (!response.ok) throw new Error(`Failed to download Fal video: ${response.status} ${response.statusText}`);
			const videoBuffer = Buffer.from(await response.arrayBuffer());
			const randId = generateId();
			const fileName = `${node.name}_${randId}.mp4`;
			const { asset } = await createFileAsset(this.prisma, {
				userId: data.canvas.userId,
				buffer: videoBuffer,
				filename: fileName,
				mimeType: "video/mp4"
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) throw new Error("Output handle is missing");
			const newResult = structuredClone(node.result) ?? {
				outputs: [],
				selectedOutputIndex: 0
			};
			const newEdit = { items: [{
				type: DataType.Video,
				data: createVirtualMedia({ entity: asset }, "Video"),
				outputHandleId: outputHandle.id
			}] };
			newResult.outputs.push(newEdit);
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult
			};
		} catch (err) {
			if (err instanceof ModerationError) {
				logger.warn(`VideoEdit blocked by moderation: ${err.message}`);
				return {
					success: false,
					error: err.message,
					errorType: "ModerationError"
				};
			}
			if (err instanceof Error) {
				logger.error({
					err,
					nodeId: node.id,
					nodeType: node.type
				}, err.message);
				return {
					success: false,
					error: err.message
				};
			}
			logger.error({
				nodeId: node.id,
				nodeType: node.type
			}, "VideoEdit processing failed");
			return {
				success: false,
				error: "VideoEdit processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], EditVideoProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], EditVideoProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], EditVideoProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], EditVideoProcessor.prototype, "mediaResolver", void 0);
EditVideoProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], EditVideoProcessor);
var server_default = defineNode(metadata, { backendProcessor: EditVideoProcessor });

//#endregion
export { server_default as default };