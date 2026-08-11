import { D as createOutputItemSchema, O as createVirtualMedia, a as TOKENS, c as logger, g as FileDataSchema, j as generateId, v as ModerationError, y as MultiOutputGenericSchema } from "./dist-BVlcG2fv.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { n as createFileAsset } from "./server-BjuLePJs.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CMCofAZH.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";
import assert from "node:assert";

//#region ../../nodes/node-video-gen-first-last-frame/dist/metadata-DusA7jcE.mjs
const VIDEOGEN_FAL_MODELS = ["bytedance/seedance-2.0/image-to-video", "bytedance/seedance-2.5/image-to-video"];
const VIDEOGEN_FAL_ASPECT_RATIOS = [
	"auto",
	"21:9",
	"16:9",
	"4:3",
	"1:1",
	"3:4",
	"9:16"
];
const VIDEOGEN_FAL_RESOLUTIONS = [
	"480p",
	"720p",
	"1080p",
	"4k"
];
const SEEDANCE_25_RESOLUTIONS = ["480p", "720p"];
const VIDEOGEN_FAL_DURATIONS = [
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
const SEEDANCE_25_DURATIONS = [
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
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
	"21",
	"22",
	"23",
	"24",
	"25",
	"26",
	"27",
	"28",
	"29",
	"30"
];
const VIDEOGEN_FAL_BITRATE_MODES = ["standard", "high"];
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
const VIDEOGEN_NODE_MODELS = [...VIDEOGEN_FAL_MODELS, "minimax/h3/image-to-video"];
const SeedanceImageToVideoConfigSchema = z$1.object({
	model: z$1.literal("bytedance/seedance-2.0/image-to-video"),
	falAspectRatio: z$1.enum(VIDEOGEN_FAL_ASPECT_RATIOS).default("auto"),
	falResolution: z$1.enum(VIDEOGEN_FAL_RESOLUTIONS).default("720p"),
	falDurationSeconds: z$1.enum(VIDEOGEN_FAL_DURATIONS).default("8"),
	falGenerateAudio: z$1.boolean().default(true),
	falBitrateMode: z$1.enum(VIDEOGEN_FAL_BITRATE_MODES).default("standard"),
	falSeed: z$1.number().int().min(0).max(4294967295).optional()
});
const Seedance25ImageToVideoConfigSchema = z$1.object({
	model: z$1.literal("bytedance/seedance-2.5/image-to-video"),
	falAspectRatio: z$1.enum(VIDEOGEN_FAL_ASPECT_RATIOS).default("auto"),
	falResolution: z$1.enum(SEEDANCE_25_RESOLUTIONS).default("720p"),
	falDurationSeconds: z$1.enum(SEEDANCE_25_DURATIONS).default("10"),
	falGenerateAudio: z$1.boolean().default(true),
	falBitrateMode: z$1.enum(VIDEOGEN_FAL_BITRATE_MODES).default("standard"),
	falSeed: z$1.number().int().min(0).max(4294967295).optional()
});
const MinimaxImageToVideoConfigSchema = z$1.object({
	model: z$1.literal("minimax/h3/image-to-video"),
	minimaxResolution: z$1.enum(MINIMAX_RESOLUTIONS).default("2K"),
	minimaxDurationSeconds: z$1.enum(MINIMAX_DURATIONS).default("5")
});
const VideoGenFirstLastFrameNodeConfigSchema = z$1.discriminatedUnion("model", [
	SeedanceImageToVideoConfigSchema,
	Seedance25ImageToVideoConfigSchema,
	MinimaxImageToVideoConfigSchema
]);
const metadata = defineMetadata({
	type: "VideoGenFirstLastFrame",
	displayName: "First to last frame video",
	description: "Generate videos using first and last frame images",
	category: "AI",
	subcategory: "Video",
	configSchema: VideoGenFirstLastFrameNodeConfigSchema,
	resultSchema: MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), FileDataSchema)),
	isTerminal: true,
	isDynamicPricing: true,
	isTransient: false,
	handles: {
		inputs: [
			{
				dataTypes: ["Text"],
				required: true,
				label: "Prompt",
				order: 0
			},
			{
				dataTypes: ["Image"],
				required: true,
				label: "First Frame",
				order: 1
			},
			{
				dataTypes: ["Image"],
				required: false,
				label: "Last Frame",
				order: 2
			}
		],
		outputs: [{
			dataTypes: ["Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		model: "bytedance/seedance-2.5/image-to-video",
		falAspectRatio: "auto",
		falResolution: "720p",
		falDurationSeconds: "10",
		falGenerateAudio: true,
		falBitrateMode: "standard",
		minimaxResolution: "2K",
		minimaxDurationSeconds: "5"
	},
	pricing: (config, inputs) => {
		if (config.model === "bytedance/seedance-2.0/image-to-video" || config.model === "bytedance/seedance-2.5/image-to-video") {
			const isSeedance25 = config.model === "bytedance/seedance-2.5/image-to-video";
			const isFast = config.model.includes("/fast/");
			const modelRate = isSeedance25 ? .0214 : isFast ? .0112 : .014;
			const resolution = config.falResolution || "720p";
			const aspectRatio = isSeedance25 ? "auto" : config.falAspectRatio || "auto";
			const getDimensions = (res, ratioStr) => {
				let base = 720;
				if (res === "480p") base = 480;
				if (res === "1080p") base = 1080;
				if (res === "4k") base = 2160;
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
			const durationVal = config.falDurationSeconds;
			outputDuration = Number(durationVal);
			let hasVideoInput = false;
			let inputDuration = 0;
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
					inputDuration = (item?.metadata?.durationMs ?? (item?.entity?.duration != null ? item.entity.duration * 1e3 : 0)) / 1e3;
				}
			}
			let dollarCost = width * height * (inputDuration + outputDuration) * 24 / 1024 / 1e3 * modelRate;
			if (hasVideoInput) dollarCost *= .6;
			return Math.ceil(dollarCost * 100);
		}
		if (config.model === "minimax/h3/image-to-video") {
			const rate = (config.minimaxResolution || "2K") === "2K" ? 26 : 15;
			const duration = config.minimaxDurationSeconds ? Number(config.minimaxDurationSeconds) : 5;
			return (Number.isNaN(duration) ? 5 : duration) * rate;
		}
		return 0;
	}
});

//#endregion
//#region ../../nodes/node-video-gen-first-last-frame/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let VideoGenFirstLastFrameProcessor = class VideoGenFirstLastFrameProcessor$1 {
	prisma;
	graph;
	mediaResolver;
	aiProvider;
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const config = VideoGenFirstLastFrameNodeConfigSchema.parse(node.config);
			const userPrompt = resolver.input("Prompt").required().asText();
			const firstItem = resolver.input("First Frame").required().item();
			if (!firstItem) return {
				success: false,
				error: "Missing data for First frame."
			};
			const firstMediaData = firstItem.data;
			const lastMediaData = resolver.input("Last Frame").item()?.data;
			const [firstUrlResult, lastUrlResult] = await Promise.all([this.mediaResolver.resolveToUrl(firstMediaData, "Image", { userId: data.canvas.userId }), lastMediaData ? this.mediaResolver.resolveToUrl(lastMediaData, "Image", { userId: data.canvas.userId }) : Promise.resolve(void 0)]);
			const firstUrl = firstUrlResult.url;
			const lastUrl = lastUrlResult?.url;
			if (!firstUrl) return {
				success: false,
				error: "Failed to resolve URL for First frame image."
			};
			const { buffer, contentType } = await this.#generateWithFal(config, userPrompt, firstUrl, lastUrl, data.canvas.userId);
			return await this.#persistResult(buffer, contentType, node, data);
		} catch (err) {
			return this.#handleTopLevelError(err, node);
		}
	}
	async #generateWithFal(config, userPrompt, firstUrl, lastUrl, userId) {
		const fal = this.aiProvider.getFal();
		const modelName = config.model;
		logger.debug(`Fal video generation — model: ${modelName}, prompt: ${userPrompt}`);
		let input;
		let durationSec = 10;
		if (config.model === "bytedance/seedance-2.0/image-to-video" || config.model === "bytedance/seedance-2.5/image-to-video") {
			const isSeedance25 = config.model === "bytedance/seedance-2.5/image-to-video";
			input = {
				prompt: userPrompt,
				image_url: firstUrl,
				end_image_url: lastUrl,
				resolution: config.falResolution,
				end_user_id: userId,
				duration: Number(config.falDurationSeconds),
				aspect_ratio: isSeedance25 ? "auto" : config.falAspectRatio,
				generate_audio: config.falGenerateAudio,
				seed: config.falSeed
			};
			if (!isSeedance25) input.bitrate_mode = config.falBitrateMode;
			durationSec = Number(config.falDurationSeconds);
		} else if (config.model === "minimax/h3/image-to-video") {
			input = {
				prompt: userPrompt,
				image_url: firstUrl,
				end_image_url: lastUrl,
				resolution: config.minimaxResolution,
				duration: Number(config.minimaxDurationSeconds)
			};
			durationSec = Number(config.minimaxDurationSeconds);
		} else throw new Error(`Unsupported model: ${modelName}`);
		const falData = (await fal.subscribe(modelName, { input })).data;
		assert(falData.video?.url, "Fal response is missing video URL");
		const response = await fetch(falData.video.url);
		if (!response.ok) throw new Error(`Failed to download Fal video: ${response.status} ${response.statusText}`);
		return {
			buffer: Buffer.from(await response.arrayBuffer()),
			contentType: falData.video.content_type ?? "video/mp4",
			durationMs: durationSec * 1e3
		};
	}
	async #persistResult(buffer, contentType, node, data) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const userId = data.canvas.userId;
		const randId = generateId();
		const fileName = `${node.name}_${randId}.mp4`;
		const { asset } = await createFileAsset(this.prisma, {
			userId,
			buffer,
			filename: fileName,
			mimeType: contentType
		});
		const newResult = structuredClone(node.result) ?? {
			outputs: [],
			selectedOutputIndex: 0
		};
		newResult.outputs.push({ items: [{
			type: DataType.Video,
			data: createVirtualMedia({ entity: asset }, "Video"),
			outputHandleId: outputHandle.id
		}] });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
	#handleTopLevelError(err, node) {
		if (err instanceof ModerationError) {
			logger.warn(`VideoGenFirstLastFrame blocked by moderation: ${err.message}`);
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
			}, `VideoGenFirstLastFrame error: ${err.message}`);
			return {
				success: false,
				error: err.message
			};
		}
		logger.error({
			nodeId: node.id,
			nodeType: node.type
		}, "VideoGenFirstLastFrame failed with unknown error");
		return {
			success: false,
			error: "Video interpolation failed."
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], VideoGenFirstLastFrameProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], VideoGenFirstLastFrameProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], VideoGenFirstLastFrameProcessor.prototype, "mediaResolver", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], VideoGenFirstLastFrameProcessor.prototype, "aiProvider", void 0);
VideoGenFirstLastFrameProcessor = __decorate([injectable()], VideoGenFirstLastFrameProcessor);
var server_default = defineNode(metadata, { backendProcessor: VideoGenFirstLastFrameProcessor });

//#endregion
export { server_default as default };