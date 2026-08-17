import { S as generateId, _ as createOutputItemSchema, a as FileDataSchema, c as ModerationError, l as MultiOutputGenericSchema, v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS, c as logger } from "./dist-CsJ7TTyG.mjs";
import { t as DataType } from "./dist-BmiZG8vq.mjs";
import { n as createFileAsset } from "./server-BoqMO5Jh.mjs";
import "./src-DTpmEm7a.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-upscaler/dist/metadata-C9O9yxfc.mjs
const UPSCALE_MODES = ["factor", "target"];
const UPSCALE_TARGET_RESOLUTIONS = [
	"720p",
	"1080p",
	"1440p",
	"2160p"
];
const UPSCALE_OUTPUT_FORMATS = [
	"png",
	"jpg",
	"webp"
];
const UpscalerNodeConfigSchema = z$1.object({
	upscaleMode: z$1.enum(UPSCALE_MODES).default("factor"),
	upscaleFactor: z$1.number().min(1).max(4).default(2),
	targetResolution: z$1.enum(UPSCALE_TARGET_RESOLUTIONS).default("1080p"),
	seed: z$1.number().int().min(0).max(2147483647).optional(),
	noiseScale: z$1.number().min(0).max(1).default(.1),
	outputFormat: z$1.enum(UPSCALE_OUTPUT_FORMATS).default("jpg")
}).strict();
const UpscalerResultSchema = MultiOutputGenericSchema(z$1.union([createOutputItemSchema(z$1.literal("Image"), FileDataSchema), createOutputItemSchema(z$1.literal("Video"), FileDataSchema)]));
const metadata = defineMetadata({
	type: "Upscaler",
	displayName: "AI Upscaler",
	description: "Upscale and enhance image or video assets using AI.",
	category: "AI",
	subcategory: "Media Enhancement",
	configSchema: UpscalerNodeConfigSchema,
	resultSchema: UpscalerResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Image", "Video"],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Image", "Video"],
			label: "Result",
			order: 0,
			description: "Enhanced, high-resolution media asset"
		}]
	},
	defaultConfig: {
		upscaleMode: "factor",
		upscaleFactor: 2,
		targetResolution: "1080p",
		noiseScale: .1,
		outputFormat: "jpg"
	},
	pricing: (config, inputs) => {
		const allInputs = Object.values(inputs ?? {});
		const inputItem = allInputs.find((i) => i?.entity?.mimeType != null || i?.metadata?.width != null || i?.metadata?.height != null);
		const isVideo = allInputs.some((i) => {
			if (i?.entity?.mimeType) return i.entity.mimeType.startsWith("video/");
			return (i?.metadata?.durationMs ?? 0) > 0;
		});
		let upscaledWidth;
		let upscaledHeight;
		if (config.upscaleMode === "target") switch (config.targetResolution) {
			case "720p":
				upscaledWidth = 1280;
				upscaledHeight = 720;
				break;
			case "1080p":
				upscaledWidth = 1920;
				upscaledHeight = 1080;
				break;
			case "1440p":
				upscaledWidth = 2560;
				upscaledHeight = 1440;
				break;
			case "2160p":
				upscaledWidth = 3840;
				upscaledHeight = 2160;
				break;
		}
		else {
			if (!inputItem) return 1;
			const srcWidth = inputItem.metadata?.width ?? inputItem.entity?.width ?? 640;
			const srcHeight = inputItem.metadata?.height ?? inputItem.entity?.height ?? 360;
			upscaledWidth = srcWidth * config.upscaleFactor;
			upscaledHeight = srcHeight * config.upscaleFactor;
		}
		const upscaledMegapixels = upscaledWidth * upscaledHeight / 1e6;
		if (isVideo) {
			const durationMs = inputItem?.metadata?.durationMs ?? (inputItem?.entity?.duration != null ? inputItem.entity.duration * 1e3 : 5e3);
			const fps = inputItem?.metadata?.fps ?? 24;
			const costInDollars$1 = upscaledMegapixels * Math.round(durationMs / 1e3 * fps) * .001;
			return Math.ceil(costInDollars$1 * 100);
		}
		const costInDollars = upscaledMegapixels * .001;
		return Math.max(10, Math.ceil(costInDollars * 100));
	}
});

//#endregion
//#region ../../nodes/node-upscaler/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UpscalerProcessor = class UpscalerProcessor$1 {
	prisma;
	graph;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const config = UpscalerNodeConfigSchema.parse(node.config);
			const inputItem = this.graph.forNode(node, data).input("Input").required().item();
			if (!inputItem) throw new Error("Input media is missing or invalid.");
			const mediaData = inputItem.data;
			if (!mediaData) throw new Error("Input media data is missing or invalid.");
			const sourceEntity = mediaData.operation.op === "source" ? mediaData.operation.source.entity : void 0;
			const isVideo = inputItem.type === "Video" || sourceEntity?.mimeType?.startsWith("video/") === true;
			const modelId = isVideo ? "fal-ai/seedvr/upscale/video" : "fal-ai/seedvr/upscale/image";
			const resolvedMedia = await this.mediaResolver.resolveToUrl(mediaData, isVideo ? "Video" : "Image", { userId: data.canvas.userId });
			if (!resolvedMedia.url) throw new Error("Failed to resolve input media URL.");
			const inputPayload = {
				upscale_mode: config.upscaleMode,
				upscale_factor: config.upscaleFactor,
				target_resolution: config.targetResolution,
				noise_scale: config.noiseScale,
				sync_mode: false
			};
			if (config.seed !== void 0) inputPayload.seed = Math.floor(config.seed);
			if (isVideo) {
				inputPayload.video_url = resolvedMedia.url;
				inputPayload.fps = mediaData.metadata?.fps ?? 24;
			} else {
				inputPayload.image_url = resolvedMedia.url;
				inputPayload.output_format = config.outputFormat;
			}
			logger.debug(`Invoking Fal.ai upscaler: ${modelId}`);
			const falData = (await this.aiProvider.getFal().subscribe(modelId, { input: inputPayload })).data;
			const outputUrl = isVideo ? falData.video?.url : falData.image?.url;
			const mimeType = isVideo ? "video/mp4" : falData.image?.content_type ?? `image/${config.outputFormat}`;
			if (!outputUrl) throw new Error("Fal response did not return a valid result asset URL.");
			const response = await fetch(outputUrl);
			if (!response.ok) throw new Error(`Failed to fetch processed media: ${response.statusText}`);
			const buffer = Buffer.from(await response.arrayBuffer());
			const randId = generateId();
			const extension = isVideo ? "mp4" : config.outputFormat === "png" ? "png" : config.outputFormat === "webp" ? "webp" : "jpg";
			const filename = `${node.name}_${randId}.${extension}`;
			const { asset } = await createFileAsset(this.prisma, {
				userId: data.canvas.userId,
				buffer,
				filename,
				mimeType
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) throw new Error("Output handle is missing on the node.");
			const newResult = structuredClone(node.result) ?? {
				outputs: [],
				selectedOutputIndex: 0
			};
			newResult.outputs.push({ items: [{
				type: isVideo ? DataType.Video : DataType.Image,
				data: createVirtualMedia({ entity: asset }, isVideo ? "Video" : "Image"),
				outputHandleId: outputHandle.id
			}] });
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult
			};
		} catch (err) {
			if (err instanceof ModerationError) {
				logger.warn(`Upscaler blocked by moderation: ${err.message}`);
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
			}, "Upscaler processing failed");
			return {
				success: false,
				error: "Upscaler processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], UpscalerProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], UpscalerProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], UpscalerProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], UpscalerProcessor.prototype, "mediaResolver", void 0);
UpscalerProcessor = __decorate([injectable()], UpscalerProcessor);
var server_default = defineNode(metadata, { backendProcessor: UpscalerProcessor });

//#endregion
export { server_default as default };