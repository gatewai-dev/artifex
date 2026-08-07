import { M as generateId, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, k as createVirtualMedia, w as VirtualMediaDataSchema, y as ModerationError } from "./dist-D86uNdKf.mjs";
import { o as createFileAsset } from "./server-DshFxBkS.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BdNfjggX.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";
import assert from "node:assert";

//#region ../../nodes/node-video-gen/dist/metadata-DeUmoICy.mjs
const SEEDANCE_ASPECT_RATIOS = [
	"auto",
	"21:9",
	"16:9",
	"4:3",
	"1:1",
	"3:4",
	"9:16"
];
const SEEDANCE_RESOLUTIONS = [
	"480p",
	"720p",
	"1080p"
];
const SEEDANCE_DURATIONS = [
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15"
];
const WAN_ASPECT_RATIOS = [
	"16:9",
	"9:16",
	"1:1",
	"4:3",
	"3:4"
];
const WAN_RESOLUTIONS = ["720p", "1080p"];
const WAN_T2V_DURATIONS = [
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
const WAN_MIN_DIMENSION = 240;
const MINIMAX_ASPECT_RATIOS = [
	"adaptive",
	"21:9",
	"16:9",
	"4:3",
	"1:1",
	"3:4",
	"9:16"
];
const MINIMAX_RESOLUTIONS = ["768P", "2K"];
const MINIMAX_DURATIONS = [
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15"
];
const SeedanceConfigSchema = z$1.object({
	model: z$1.enum(["bytedance/seedance-2.0/reference-to-video", "bytedance/seedance-2.0/fast/reference-to-video"]),
	seedanceAspectRatio: z$1.enum(SEEDANCE_ASPECT_RATIOS).default("auto"),
	seedanceResolution: z$1.enum(SEEDANCE_RESOLUTIONS).default("720p"),
	seedanceDurationSeconds: z$1.enum(SEEDANCE_DURATIONS).default("8"),
	seedanceGenerateAudio: z$1.boolean().default(true),
	seedanceSeed: z$1.number().max(2147483646).min(0).optional()
});
const WanConfigSchema = z$1.object({
	model: z$1.literal("fal-ai/wan/v2.7"),
	wanAspectRatio: z$1.enum(WAN_ASPECT_RATIOS).default("16:9"),
	wanResolution: z$1.enum(WAN_RESOLUTIONS).default("1080p"),
	wanDurationSeconds: z$1.enum(WAN_T2V_DURATIONS).default("5"),
	wanSeed: z$1.number().max(2147483647).min(0).optional(),
	wanEnablePromptExpansion: z$1.boolean().default(true),
	wanMultiShots: z$1.boolean().default(false)
});
const WanT2VConfigSchema = z$1.object({
	model: z$1.literal("fal-ai/wan/v2.7/text-to-video"),
	wanAspectRatio: z$1.enum(WAN_ASPECT_RATIOS).default("16:9"),
	wanResolution: z$1.enum(WAN_RESOLUTIONS).default("1080p"),
	wanDurationSeconds: z$1.enum(WAN_T2V_DURATIONS).default("5"),
	wanSeed: z$1.number().max(2147483647).min(0).optional(),
	wanEnablePromptExpansion: z$1.boolean().default(true)
});
const WanR2VConfigSchema = z$1.object({
	model: z$1.literal("fal-ai/wan/v2.7/reference-to-video"),
	wanAspectRatio: z$1.enum(WAN_ASPECT_RATIOS).default("16:9"),
	wanResolution: z$1.enum(WAN_RESOLUTIONS).default("1080p"),
	wanDurationSeconds: z$1.enum(WAN_T2V_DURATIONS).default("5"),
	wanSeed: z$1.number().max(2147483647).min(0).optional(),
	wanMultiShots: z$1.boolean().default(false)
});
const GEMINI_OMNI_ASPECT_RATIOS = ["16:9", "9:16"];
const GEMINI_OMNI_DURATIONS = [
	"5",
	"6",
	"7",
	"8",
	"9",
	"10"
];
const GeminiOmniFlashConfigSchema = z$1.object({
	model: z$1.literal("google/gemini-omni-flash"),
	geminiAspectRatio: z$1.enum(GEMINI_OMNI_ASPECT_RATIOS).default("16:9"),
	geminiDurationSeconds: z$1.enum(GEMINI_OMNI_DURATIONS).default("10")
});
const GeminiOmniFlashR2VConfigSchema = z$1.object({
	model: z$1.literal("google/gemini-omni-flash/reference-to-video"),
	geminiAspectRatio: z$1.enum(GEMINI_OMNI_ASPECT_RATIOS).default("16:9"),
	geminiDurationSeconds: z$1.enum(GEMINI_OMNI_DURATIONS).default("10")
});
const MinimaxConfigSchema = z$1.object({
	model: z$1.literal("minimax/h3"),
	minimaxAspectRatio: z$1.enum(MINIMAX_ASPECT_RATIOS).default("16:9"),
	minimaxResolution: z$1.enum(MINIMAX_RESOLUTIONS).default("2K"),
	minimaxDurationSeconds: z$1.enum(MINIMAX_DURATIONS).default("5")
});
const MinimaxT2VConfigSchema = z$1.object({
	model: z$1.literal("minimax/h3/text-to-video"),
	minimaxAspectRatio: z$1.enum(MINIMAX_ASPECT_RATIOS).default("16:9"),
	minimaxResolution: z$1.enum(MINIMAX_RESOLUTIONS).default("2K"),
	minimaxDurationSeconds: z$1.enum(MINIMAX_DURATIONS).default("5")
});
const MinimaxR2VConfigSchema = z$1.object({
	model: z$1.literal("minimax/h3/reference-to-video"),
	minimaxAspectRatio: z$1.enum(MINIMAX_ASPECT_RATIOS).default("adaptive"),
	minimaxResolution: z$1.enum(MINIMAX_RESOLUTIONS).default("2K"),
	minimaxDurationSeconds: z$1.enum(MINIMAX_DURATIONS).default("5")
});
const VideoGenNodeConfigSchema = z$1.discriminatedUnion("model", [
	SeedanceConfigSchema,
	WanConfigSchema,
	WanT2VConfigSchema,
	WanR2VConfigSchema,
	GeminiOmniFlashConfigSchema,
	GeminiOmniFlashR2VConfigSchema,
	MinimaxConfigSchema,
	MinimaxT2VConfigSchema,
	MinimaxR2VConfigSchema
]);
const VideoGenResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema));
const metadata = defineMetadata({
	type: "VideoGen",
	displayName: "Video Generator",
	description: "A video generation node.",
	category: "AI",
	subcategory: "Video",
	configSchema: VideoGenNodeConfigSchema,
	resultSchema: VideoGenResultSchema,
	isTerminal: true,
	isDynamicPricing: true,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: [
			"Image",
			"Video",
			"Audio"
		]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		model: "bytedance/seedance-2.0/reference-to-video",
		seedanceAspectRatio: "auto",
		seedanceResolution: "720p",
		seedanceDurationSeconds: "10",
		seedanceEnablePromptExpansion: true,
		seedanceMultiShots: false,
		wanAspectRatio: "16:9",
		wanResolution: "1080p",
		wanDurationSeconds: "5",
		wanEnablePromptExpansion: true,
		wanMultiShots: false,
		geminiAspectRatio: "16:9",
		geminiDurationSeconds: "8",
		minimaxResolution: "2K",
		minimaxAspectRatio: "16:9",
		minimaxDurationSeconds: "5"
	},
	pricing: (config, inputs) => {
		const model = config.model;
		if (model.startsWith("bytedance/seedance")) {
			const seedanceConfig = config;
			const modelRate = model.includes("/fast/") ? .0112 : .014;
			const resolution = seedanceConfig.seedanceResolution || "720p";
			const aspectRatio = seedanceConfig.seedanceAspectRatio || "auto";
			const getDimensions = (res, ratioStr) => {
				let base = 720;
				if (res === "480p") base = 480;
				if (res === "1080p") base = 1080;
				let ratio = 16 / 9;
				switch (ratioStr) {
					case "21:9":
						ratio = 21 / 9;
						break;
					case "16:9":
						ratio = 16 / 9;
						break;
					case "4:3":
						ratio = 4 / 3;
						break;
					case "1:1":
						ratio = 1;
						break;
					case "3:4":
						ratio = 3 / 4;
						break;
					case "9:16":
						ratio = 9 / 16;
						break;
					default: ratio = 16 / 9;
				}
				if (ratio >= 1) return {
					width: Math.round(base * ratio),
					height: base
				};
				else return {
					width: base,
					height: Math.round(base / ratio)
				};
			};
			const { width, height } = getDimensions(resolution, aspectRatio);
			let outputDuration = 10;
			if ("seedanceDurationSeconds" in config) outputDuration = Number(config.seedanceDurationSeconds);
			let hasVideoInput = false;
			let inputDuration$1 = 0;
			if (inputs) {
				const videoInput = Object.values(inputs).find((input) => {
					const item = input;
					if (item?.metadata?.durationMs != null) return true;
					if (item?.entity?.mimeType?.startsWith("video/")) return true;
					return false;
				});
				if (videoInput) {
					hasVideoInput = true;
					const item = videoInput;
					inputDuration$1 = (item?.metadata?.durationMs ?? (item?.entity?.duration != null ? item.entity.duration * 1e3 : 0)) / 1e3;
				}
			}
			let dollarCost = width * height * (inputDuration$1 + outputDuration) * 24 / 1024 / 1e3 * modelRate;
			if (hasVideoInput) dollarCost *= .6;
			return Math.ceil(dollarCost * 100);
		}
		let inputDuration = 0;
		if (inputs) {
			const videoInput = Object.values(inputs).find((input) => {
				const item = input;
				if (item?.metadata?.durationMs != null) return true;
				if (item?.entity?.mimeType?.startsWith("video/")) return true;
				return false;
			});
			if (videoInput) {
				const item = videoInput;
				inputDuration = (item?.metadata?.durationMs ?? (item?.entity?.duration != null ? item.entity.duration * 1e3 : 0)) / 1e3;
			}
		}
		if (config.model === "fal-ai/wan/v2.7" || config.model === "fal-ai/wan/v2.7/text-to-video" || config.model === "fal-ai/wan/v2.7/reference-to-video") {
			let hasReferenceInput = false;
			if (inputs) {
				if (Object.values(inputs).find((input) => {
					const item = input;
					if (item?.entity?.mimeType?.startsWith("image/")) return true;
					if (item?.entity?.mimeType?.startsWith("video/")) return true;
					return false;
				})) hasReferenceInput = true;
			}
			const isR2V = hasReferenceInput || model === "fal-ai/wan/v2.7/reference-to-video";
			const resolution = config.wanResolution || "1080p";
			let duration = Number(config.wanDurationSeconds || 5);
			if (isR2V) {
				if (duration > 10) duration = 10;
				const rate = 10;
				const billingDuration = inputDuration + duration;
				return Math.ceil(billingDuration * rate);
			} else {
				const rate = resolution === "720p" ? 10 : 15;
				return Math.ceil(duration * rate);
			}
		}
		if (config.model === "google/gemini-omni-flash" || config.model === "google/gemini-omni-flash/reference-to-video") return Number(config.geminiDurationSeconds ?? 8) * 20;
		if (config.model === "minimax/h3" || config.model === "minimax/h3/text-to-video" || config.model === "minimax/h3/reference-to-video") {
			const res = config.minimaxResolution || "2K";
			const baseRate = res === "2K" ? 26 : 15;
			const videoRate = res === "2K" ? 26 : 15;
			const imageRate = 8;
			const duration = config.minimaxDurationSeconds ? Number(config.minimaxDurationSeconds) : 5;
			const baseVideoCost = (Number.isNaN(duration) ? 5 : duration) * baseRate;
			let inputImageCount = 0;
			let inputVideoDuration = 0;
			if (inputs) for (const input of Object.values(inputs)) {
				const item = input;
				if (item?.entity?.mimeType?.startsWith("image/")) inputImageCount++;
				else if (item?.metadata?.durationMs != null) inputVideoDuration += item.metadata.durationMs / 1e3;
				else if (item?.entity?.mimeType?.startsWith("video/")) inputVideoDuration += item.entity.duration ?? 0;
			}
			if (model === "minimax/h3/reference-to-video" || inputImageCount > 0 || inputVideoDuration > 0) {
				const additionalImagesCost = Math.max(0, inputImageCount - 5) * imageRate;
				const referenceVideoCost = inputVideoDuration * videoRate;
				return Math.ceil(baseVideoCost + additionalImagesCost + referenceVideoCost);
			}
			return Math.ceil(baseVideoCost);
		}
		throw new Error(`Could not calculate pricing for model ${config.model}`);
	}
});

//#endregion
//#region ../../nodes/node-video-gen/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let VideoGenProcessor = class VideoGenProcessor$1 {
	prisma;
	graph;
	mediaResolver;
	aiProvider;
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const args = {
				node,
				data,
				resolver,
				userPrompt: resolver.input("Prompt").required().asText(),
				config: VideoGenNodeConfigSchema.parse(node.config)
			};
			return this.processFal(args);
		} catch (err) {
			if (err instanceof ModerationError) {
				logger.warn(`VideoGen blocked by moderation: ${err.message}`);
				return {
					success: false,
					error: err.message,
					errorType: "ModerationError"
				};
			}
			const message = err instanceof Error ? err.message : "VideoGen processing failed";
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, message);
			return {
				success: false,
				error: message
			};
		}
	}
	/**
	* Collect signed URLs for all connected references of a given data type.
	*/
	async resolveReferenceUrls(data, resolver, type) {
		const items = resolver.inputs().as(type).allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0));
		if (!items.length) return [];
		return Promise.all(items.map(async (r) => {
			const outputItem = r.value;
			const result = await this.mediaResolver.resolveToUrl(outputItem.data, type, { userId: data.canvas.userId });
			if (!result.url) throw new Error(`Failed to resolve ${type} reference input URL`);
			return result.url;
		}));
	}
	validateWanImageDimensions(resolver) {
		const images = resolver.inputs().as("Image").allWithHandle().map((r) => r.value).filter((v) => v !== null);
		for (const img of images) {
			const data = img.data;
			let width;
			let height;
			if (data && typeof data === "object") {
				if ("metadata" in data && data.metadata && typeof data.metadata === "object") {
					width = data.metadata.width;
					height = data.metadata.height;
				} else if ("entity" in data && data.entity && typeof data.entity === "object") {
					width = data.entity.width;
					height = data.entity.height;
				}
			}
			if (width != null && height != null && (width < WAN_MIN_DIMENSION || height < WAN_MIN_DIMENSION)) throw new Error(`Image dimensions are too small. Minimum dimensions are ${WAN_MIN_DIMENSION}x${WAN_MIN_DIMENSION} pixels.`);
		}
	}
	async saveAsset(data, node, buffer) {
		const fileName = `${node.name}_${generateId()}.mp4`;
		const { asset } = await createFileAsset(this.prisma, {
			userId: data.canvas.userId,
			buffer,
			filename: fileName,
			mimeType: "video/mp4"
		});
		return asset;
	}
	async processFal({ node, data, resolver, userPrompt, config }) {
		const isSeedance = config.model.startsWith("bytedance/seedance");
		const fal = this.aiProvider.getFal();
		const [imageUrls, videoUrls, audioUrls] = await Promise.all([
			this.resolveReferenceUrls(data, resolver, "Image"),
			this.resolveReferenceUrls(data, resolver, "Video"),
			this.resolveReferenceUrls(data, resolver, "Audio")
		]);
		const isWan = config.model.startsWith("fal-ai/wan/");
		const isMinimax = config.model.startsWith("minimax/h3");
		const isWanR2V = isWan && (imageUrls.length > 0 || videoUrls.length > 0 || config.model === "fal-ai/wan/v2.7/reference-to-video");
		const isWanT2V = isWan && !isWanR2V;
		const isMinimaxR2V = isMinimax && (imageUrls.length > 0 || videoUrls.length > 0 || audioUrls.length > 0 || config.model === "minimax/h3/reference-to-video");
		const isMinimaxT2V = isMinimax && !isMinimaxR2V;
		if (isWanR2V) this.validateWanImageDimensions(resolver);
		let modelId = config.model;
		const input = {
			prompt: userPrompt,
			end_user_id: isSeedance ? data.canvas.userId : void 0
		};
		if (config.model === "bytedance/seedance-2.0/reference-to-video" || config.model === "bytedance/seedance-2.0/fast/reference-to-video") {
			input.aspect_ratio = config.seedanceAspectRatio;
			input.resolution = config.seedanceResolution;
			input.duration = Number(config.seedanceDurationSeconds);
			input.generate_audio = config.seedanceGenerateAudio;
			input.seed = config.seedanceSeed;
			if (imageUrls.length > 0) input.image_urls = imageUrls;
			if (videoUrls.length > 0) input.video_urls = videoUrls;
			if (audioUrls.length > 0) input.audio_urls = audioUrls;
		} else if (config.model === "google/gemini-omni-flash" || config.model === "google/gemini-omni-flash/reference-to-video") {
			const isGeminiR2V = imageUrls.length > 0;
			modelId = isGeminiR2V ? "google/gemini-omni-flash/reference-to-video" : "google/gemini-omni-flash";
			input.aspect_ratio = config.geminiAspectRatio;
			input.duration = Number(config.geminiDurationSeconds);
			if (isGeminiR2V) input.image_urls = imageUrls;
		} else if (config.model === "fal-ai/wan/v2.7" || config.model === "fal-ai/wan/v2.7/text-to-video" || config.model === "fal-ai/wan/v2.7/reference-to-video") if (isWanT2V) {
			modelId = "fal-ai/wan/v2.7/text-to-video";
			input.aspect_ratio = config.wanAspectRatio;
			input.resolution = config.wanResolution;
			input.duration = parseInt(config.wanDurationSeconds, 10);
			input.seed = config.wanSeed;
			input.enable_prompt_expansion = config.model === "fal-ai/wan/v2.7" || config.model === "fal-ai/wan/v2.7/text-to-video" ? config.wanEnablePromptExpansion : true;
			input.enable_safety_checker = false;
			if (audioUrls.length > 0) input.audio_url = audioUrls[0];
		} else {
			modelId = "fal-ai/wan/v2.7/reference-to-video";
			input.aspect_ratio = config.wanAspectRatio;
			input.resolution = config.wanResolution;
			let duration = parseInt(config.wanDurationSeconds, 10);
			if (duration > 10) duration = 10;
			input.duration = duration;
			input.seed = config.wanSeed;
			input.multi_shots = config.model === "fal-ai/wan/v2.7" || config.model === "fal-ai/wan/v2.7/reference-to-video" ? config.wanMultiShots : false;
			input.enable_safety_checker = false;
			if (imageUrls.length > 0) input.reference_image_urls = imageUrls;
			if (videoUrls.length > 0) input.reference_video_urls = videoUrls;
		}
		else if (config.model === "minimax/h3" || config.model === "minimax/h3/text-to-video" || config.model === "minimax/h3/reference-to-video") if (isMinimaxT2V) {
			modelId = "minimax/h3/text-to-video";
			input.resolution = config.minimaxResolution || "2K";
			input.aspect_ratio = config.minimaxAspectRatio || "16:9";
			if (input.aspect_ratio === "adaptive") input.aspect_ratio = "16:9";
			input.duration = config.minimaxDurationSeconds ? Number(config.minimaxDurationSeconds) : 5;
		} else {
			modelId = "minimax/h3/reference-to-video";
			input.resolution = config.minimaxResolution || "2K";
			input.aspect_ratio = config.minimaxAspectRatio || "adaptive";
			input.duration = config.minimaxDurationSeconds ? Number(config.minimaxDurationSeconds) : 5;
			if (imageUrls.length > 0) input.reference_image_urls = imageUrls;
			if (videoUrls.length > 0) input.reference_video_urls = videoUrls;
			if (audioUrls.length > 0) input.reference_audio_urls = audioUrls;
		}
		else throw new Error(`Unsupported model: ${config.model}`);
		logger.info(`Fal video generation — model: ${modelId} (orig: ${config.model}), images: ${imageUrls.length}, videos: ${videoUrls.length}, audio: ${audioUrls.length}`);
		const falData = (await fal.subscribe(modelId, { input })).data;
		assert(falData.video?.url, "Fal response is missing video URL");
		const response = await fetch(falData.video.url);
		if (!response.ok) throw new Error(`Failed to download Fal video: ${response.status} ${response.statusText}`);
		const buffer = Buffer.from(await response.arrayBuffer());
		const asset = await this.saveAsset(data, node, buffer);
		return this.createProcessorResult(node, data, asset);
	}
	createProcessorResult(node, data, asset) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) throw new Error("Output handle is missing");
		const newResult = structuredClone(node.result) ?? {
			outputs: [],
			selectedOutputIndex: 0
		};
		newResult.outputs.push({ items: [{
			type: "Video",
			data: createVirtualMedia({ entity: asset }, "Video"),
			outputHandleId: outputHandle.id
		}] });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], VideoGenProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], VideoGenProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], VideoGenProcessor.prototype, "mediaResolver", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], VideoGenProcessor.prototype, "aiProvider", void 0);
VideoGenProcessor = __decorate([injectable()], VideoGenProcessor);
var server_default = defineNode(metadata, { backendProcessor: VideoGenProcessor });

//#endregion
export { server_default as default };