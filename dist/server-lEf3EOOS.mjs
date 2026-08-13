import { D as createOutputItemSchema, O as createVirtualMedia, a as TOKENS, c as logger, g as FileDataSchema, j as generateId, s as getAssetKey, v as ModerationError, y as MultiOutputGenericSchema } from "./dist-CgOGu4Rk.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BpjyD7le.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-image-gen/dist/metadata-zwn9Ybgv.mjs
const IMAGEGEN_FAL_FLUX_MODELS = ["fal-ai/flux-2-pro"];
const IMAGEGEN_FAL_FLUX_PRESET_SIZES = [
	"auto",
	"square_hd",
	"square",
	"portrait_4_3",
	"portrait_16_9",
	"landscape_4_3",
	"landscape_16_9"
];
const IMAGEGEN_FAL_FLUX_SIZES = [...IMAGEGEN_FAL_FLUX_PRESET_SIZES, "custom"];
const IMAGEGEN_FAL_FLUX_SAFETY_TOLERANCES = [
	"1",
	"2",
	"3",
	"4",
	"5"
];
const IMAGEGEN_FAL_FLUX_OUTPUT_FORMATS = ["jpeg", "png"];
const IMAGEGEN_OPENAI_MODELS = ["openai/gpt-image-2"];
const IMAGEGEN_OPENAI_PRESET_SIZES = [
	"square_hd",
	"square",
	"portrait_4_3",
	"portrait_16_9",
	"landscape_4_3",
	"landscape_16_9"
];
const IMAGEGEN_OPENAI_SIZES = [...IMAGEGEN_OPENAI_PRESET_SIZES, "custom"];
const IMAGEGEN_OPENAI_QUALITIES = [
	"low",
	"medium",
	"high"
];
const IMAGEGEN_OPENAI_FORMATS = [
	"png",
	"jpeg",
	"webp"
];
const IMAGEGEN_OPENAI_BACKGROUNDS = [
	"opaque",
	"transparent",
	"auto"
];
const IMAGEGEN_SEEDREAM_MODELS = ["bytedance/seedream/v5/pro/text-to-image"];
const IMAGEGEN_SEEDREAM_PRESET_SIZES = [
	"square_hd",
	"square",
	"portrait_4_3",
	"portrait_16_9",
	"landscape_4_3",
	"landscape_16_9",
	"auto_1K",
	"auto_2K"
];
const IMAGEGEN_SEEDREAM_SIZES = [...IMAGEGEN_SEEDREAM_PRESET_SIZES, "custom"];
const IMAGEGEN_SEEDREAM_OUTPUT_FORMATS = ["jpeg", "png"];
const IMAGEGEN_NANO_BANANA_MODELS = ["fal-ai/nano-banana-2"];
const IMAGEGEN_NANO_BANANA_ASPECT_RATIOS = [
	"auto",
	"21:9",
	"16:9",
	"3:2",
	"4:3",
	"5:4",
	"1:1",
	"4:5",
	"3:4",
	"2:3",
	"9:16",
	"4:1",
	"1:4",
	"8:1",
	"1:8"
];
const IMAGEGEN_NANO_BANANA_OUTPUT_FORMATS = [
	"png",
	"jpeg",
	"webp"
];
const IMAGEGEN_NANO_BANANA_RESOLUTIONS = [
	"0.5K",
	"1K",
	"2K",
	"4K"
];
const IMAGEGEN_NANO_BANANA_THINKING_LEVELS = [
	"disabled",
	"minimal",
	"high"
];
const IMAGEGEN_QWEN_MODELS = ["alibaba/qwen-image-3/text-to-image"];
const IMAGEGEN_QWEN_PRESET_SIZES = [
	"square_hd",
	"square",
	"portrait_4_3",
	"portrait_16_9",
	"landscape_4_3",
	"landscape_16_9"
];
const IMAGEGEN_QWEN_SIZES = [...IMAGEGEN_QWEN_PRESET_SIZES, "custom"];
const IMAGEGEN_QWEN_OUTPUT_FORMATS = [
	"png",
	"jpeg",
	"webp"
];
const IMAGEGEN_NODE_MODELS = [
	...IMAGEGEN_OPENAI_MODELS,
	...IMAGEGEN_FAL_FLUX_MODELS,
	...IMAGEGEN_SEEDREAM_MODELS,
	...IMAGEGEN_NANO_BANANA_MODELS,
	...IMAGEGEN_QWEN_MODELS
];
const OpenAIImageSizeSchema = z$1.union([z$1.enum(IMAGEGEN_OPENAI_PRESET_SIZES), z$1.object({
	width: z$1.number().int().multipleOf(16).min(256).max(3840),
	height: z$1.number().int().multipleOf(16).min(256).max(3840)
}).refine(({ width, height }) => {
	if (Math.max(width, height) > 3840) return false;
	if (Math.max(width / height, height / width) > 3) return false;
	const pixels = width * height;
	return pixels >= 655360 && pixels <= 8294400;
}, { message: "Custom size must have max edge ≤ 3840px, aspect ratio ≤ 3:1, and total pixels between 655,360 and 8,294,400" })]);
const FalFluxImageSizeSchema = z$1.union([z$1.enum(IMAGEGEN_FAL_FLUX_PRESET_SIZES), z$1.object({
	width: z$1.number().int().multipleOf(16).min(256).max(4096),
	height: z$1.number().int().multipleOf(16).min(256).max(4096)
})]);
const SeedreamImageSizeSchema = z$1.union([z$1.enum(IMAGEGEN_SEEDREAM_PRESET_SIZES), z$1.object({
	width: z$1.number().int().multipleOf(16).min(256).max(2048),
	height: z$1.number().int().multipleOf(16).min(256).max(2048)
}).refine(({ width, height }) => {
	const pixels = width * height;
	const aspect = width / height;
	return pixels >= 1024 * 1024 && pixels <= 2048 * 2048 && aspect >= 1 / 16 && aspect <= 16;
}, { message: "Custom size must have total pixels between 1024x1024 and 2048x2048, and aspect ratio between 1/16 and 16" })]);
const QwenImageSizeSchema = z$1.union([z$1.enum(IMAGEGEN_QWEN_PRESET_SIZES), z$1.object({
	width: z$1.number().int().multipleOf(16).min(256).max(1440),
	height: z$1.number().int().multipleOf(16).min(256).max(1440)
}).refine(({ width, height }) => {
	const pixels = width * height;
	return pixels >= 512 * 512 && pixels <= 1440 * 1440;
}, { message: "Custom size must have total pixels between 512x512 and 1440x1440" })]);
const ImageGenNodeConfigSchema = z$1.object({
	model: z$1.enum(IMAGEGEN_NODE_MODELS),
	falFluxSize: FalFluxImageSizeSchema.default(IMAGEGEN_FAL_FLUX_PRESET_SIZES[0]),
	falFluxSafetyTolerance: z$1.enum(IMAGEGEN_FAL_FLUX_SAFETY_TOLERANCES).default("5"),
	falFluxEnableSafetyChecker: z$1.boolean().default(false),
	falFluxOutputFormat: z$1.enum(IMAGEGEN_FAL_FLUX_OUTPUT_FORMATS).default("jpeg"),
	openaiSize: OpenAIImageSizeSchema.default("landscape_4_3"),
	openaiQuality: z$1.enum(IMAGEGEN_OPENAI_QUALITIES).default("medium"),
	openaiFormat: z$1.enum(IMAGEGEN_OPENAI_FORMATS).default("png"),
	openaiBackground: z$1.enum(IMAGEGEN_OPENAI_BACKGROUNDS).default("opaque"),
	seedreamSize: SeedreamImageSizeSchema.default("auto_2K"),
	seedreamOutputFormat: z$1.enum(IMAGEGEN_SEEDREAM_OUTPUT_FORMATS).default("jpeg"),
	nanoBananaAspectRatio: z$1.enum(IMAGEGEN_NANO_BANANA_ASPECT_RATIOS).default("auto"),
	nanoBananaOutputFormat: z$1.enum(IMAGEGEN_NANO_BANANA_OUTPUT_FORMATS).default("png"),
	nanoBananaResolution: z$1.enum(IMAGEGEN_NANO_BANANA_RESOLUTIONS).default("1K"),
	nanoBananaEnableWebSearch: z$1.boolean().default(false),
	nanoBananaThinkingLevel: z$1.enum(IMAGEGEN_NANO_BANANA_THINKING_LEVELS).default("disabled"),
	qwenSize: QwenImageSizeSchema.default("square_hd"),
	qwenOutputFormat: z$1.enum(IMAGEGEN_QWEN_OUTPUT_FORMATS).default("png"),
	qwenEnablePromptExpansion: z$1.boolean().default(true),
	qwenEnableSafetyChecker: z$1.boolean().default(false)
});
const ImageGenResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), FileDataSchema));
const metadata = defineMetadata({
	type: "ImageGen",
	displayName: "Image Generator",
	description: "Generate or edit an image using AI",
	category: "AI",
	subcategory: "Image",
	configSchema: ImageGenNodeConfigSchema,
	resultSchema: ImageGenResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: ["Image"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}, {
			dataTypes: ["Image"],
			label: "Reference Image",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Image"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		model: "openai/gpt-image-2",
		falFluxEnableSafetyChecker: false,
		falFluxSafetyTolerance: "5",
		falFluxSize: "auto",
		falFluxOutputFormat: "jpeg",
		openaiSize: "square",
		openaiQuality: "medium",
		openaiFormat: "png",
		openaiBackground: "opaque",
		seedreamSize: "auto_2K",
		seedreamOutputFormat: "jpeg",
		nanoBananaAspectRatio: "auto",
		nanoBananaOutputFormat: "png",
		nanoBananaResolution: "1K",
		nanoBananaEnableWebSearch: false,
		nanoBananaThinkingLevel: "disabled",
		qwenSize: "square_hd",
		qwenOutputFormat: "png",
		qwenEnablePromptExpansion: true,
		qwenEnableSafetyChecker: false
	},
	pricing: (config, inputs) => {
		if (config.model.startsWith("bytedance/seedream")) {
			const size = config.seedreamSize;
			let w = 2048;
			let h = 2048;
			if (typeof size === "object" && size !== null) {
				w = size.width;
				h = size.height;
			} else switch (size) {
				case "square":
				case "auto_1K":
					w = 1024;
					h = 1024;
					break;
				case "square_hd":
					w = 2048;
					h = 2048;
					break;
				case "portrait_4_3":
					w = 1152;
					h = 1536;
					break;
				case "portrait_16_9":
					w = 1152;
					h = 2048;
					break;
				case "landscape_4_3":
					w = 1536;
					h = 1152;
					break;
				case "landscape_16_9":
					w = 2048;
					h = 1152;
					break;
				case "auto_2K":
					w = 2048;
					h = 2048;
					break;
			}
			const isSmallArea = w * h <= 1536 * 1536;
			let numInputImages = 0;
			if (inputs) for (const input of Object.values(inputs)) {
				const item = input;
				if (item?.operation?.dataType === "Image" || item?.entity?.mimeType?.startsWith("image/")) numInputImages++;
			}
			const numAdditionalInputs = Math.max(0, numInputImages - 1);
			const basePrice = isSmallArea ? 6.75 : 13.5;
			const inputPrice = numAdditionalInputs * .45;
			return Math.ceil(basePrice + inputPrice);
		}
		if (config.model === "openai/gpt-image-2") {
			const size = config.openaiSize;
			const quality = config.openaiQuality || "medium";
			const presetPrices = {
				square: {
					low: .6,
					medium: 5.3,
					high: 21.1
				},
				square_hd: {
					low: 1.2,
					medium: 10.1,
					high: 40.1
				},
				portrait_4_3: {
					low: .5,
					medium: 5.3,
					high: 21.1
				},
				portrait_16_9: {
					low: .5,
					medium: 7.5,
					high: 29.9
				},
				landscape_4_3: {
					low: .5,
					medium: 5.3,
					high: 21.1
				},
				landscape_16_9: {
					low: .5,
					medium: 7.5,
					high: 29.9
				}
			};
			let basePrice = 5.3;
			if (typeof size === "string" && size in presetPrices) basePrice = presetPrices[size][quality];
			else {
				let w = 1024;
				let h = 1024;
				if (typeof size === "object") {
					w = size.width;
					h = size.height;
				}
				const pixels = w * h;
				const tiers = [
					{
						pixels: 1024 * 768,
						low: .5,
						medium: 3.7,
						high: 14.5
					},
					{
						pixels: 1024 * 1024,
						low: .6,
						medium: 5.3,
						high: 21.1
					},
					{
						pixels: 1024 * 1536,
						low: .6,
						medium: 5.3,
						high: 21.1
					},
					{
						pixels: 1152 * 1536,
						low: .6,
						medium: 5.3,
						high: 21.1
					},
					{
						pixels: 1920 * 1080,
						low: .6,
						medium: 5.3,
						high: 21.1
					},
					{
						pixels: 1152 * 2048,
						low: .6,
						medium: 7.5,
						high: 29.9
					},
					{
						pixels: 2560 * 1440,
						low: .7,
						medium: 7.5,
						high: 29.9
					},
					{
						pixels: 2048 * 2048,
						low: 1.2,
						medium: 10.1,
						high: 40.1
					},
					{
						pixels: 3840 * 2160,
						low: 1.2,
						medium: 10.1,
						high: 40.1
					}
				];
				let closestTier = tiers[0];
				let minDiff = Math.abs(pixels - closestTier.pixels);
				for (let i = 1; i < tiers.length; i++) {
					const diff = Math.abs(pixels - tiers[i].pixels);
					if (diff < minDiff) {
						minDiff = diff;
						closestTier = tiers[i];
					}
				}
				basePrice = closestTier[quality];
			}
			let inputImageCredits = 0;
			if (inputs) for (const input of Object.values(inputs)) {
				const item = input;
				if (item?.operation?.dataType === "Image" || item?.entity?.mimeType?.startsWith("image/")) {
					let w_in = 1024;
					let h_in = 1024;
					if (item.metadata?.width != null) w_in = item.metadata.width;
					else if (item.entity?.width != null) w_in = item.entity.width;
					if (item.metadata?.height != null) h_in = item.metadata.height;
					else if (item.entity?.height != null) h_in = item.entity.height;
					if (w_in > 2048 || h_in > 2048) {
						const scale = 2048 / Math.max(w_in, h_in);
						w_in = Math.round(w_in * scale);
						h_in = Math.round(h_in * scale);
					}
					const shortest = Math.min(w_in, h_in);
					if (shortest > 768) {
						const scale = 768 / shortest;
						w_in = Math.round(w_in * scale);
						h_in = Math.round(h_in * scale);
					}
					const tokens = Math.ceil(w_in / 512) * Math.ceil(h_in / 512) * 170 + 85;
					inputImageCredits += tokens * 8e-4;
				}
			}
			const totalPrice = basePrice + inputImageCredits;
			let finalPrice = Math.ceil(totalPrice);
			if (inputImageCredits > 0 && finalPrice === Math.ceil(basePrice)) finalPrice += 1;
			return finalPrice;
		}
		if (config.model.startsWith("fal-ai/nano-banana-2")) {
			let basePrice = 8;
			const res = config.nanoBananaResolution || "1K";
			if (res === "0.5K") basePrice = 6;
			else if (res === "2K") basePrice = 12;
			else if (res === "4K") basePrice = 16;
			let additionalPrice = 0;
			if (config.nanoBananaEnableWebSearch) additionalPrice += 1.5;
			if (config.nanoBananaThinkingLevel === "high") additionalPrice += 2;
			return Math.ceil((basePrice + additionalPrice) * 1.2);
		}
		if (config.model.startsWith("alibaba/qwen-image-3")) return 8;
		return {
			"fal-ai/flux-2-pro": 9,
			"openai/gpt-image-2": 5
		}[config.model] ?? 0;
	}
});

//#endregion
//#region ../../nodes/node-image-gen/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ImageGenProcessor = class ImageGenProcessor$1 {
	prisma;
	env;
	graph;
	storage;
	media;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const nodeConfig = ImageGenNodeConfigSchema.parse(node.config);
			const resolver = this.graph.forNode(node, data);
			const userPrompt = resolver.input("Prompt").required().asText();
			const imageFileData = resolver.inputs().asImage().allData();
			if (!userPrompt && imageFileData.length === 0) return {
				success: false,
				error: "No user prompt or image provided"
			};
			const results = await this.#dispatchToProvider(nodeConfig, userPrompt, imageFileData, data.canvas.userId);
			return await this.#persistResults(results, node, data);
		} catch (err) {
			return this.#handleTopLevelError(err, node);
		}
	}
	async #dispatchToProvider(nodeConfig, userPrompt, imageFileData, userId) {
		if (IMAGEGEN_OPENAI_MODELS.includes(nodeConfig.model) || IMAGEGEN_FAL_FLUX_MODELS.includes(nodeConfig.model) || IMAGEGEN_SEEDREAM_MODELS.includes(nodeConfig.model) || IMAGEGEN_NANO_BANANA_MODELS.includes(nodeConfig.model) || IMAGEGEN_QWEN_MODELS.includes(nodeConfig.model)) return this.#generateWithFal(nodeConfig, userPrompt, imageFileData, userId);
		throw new Error(`Unsupported model: ${nodeConfig.model}`);
	}
	async #generateWithFal(nodeConfig, userPrompt, imageFileData, userId) {
		const fal = this.aiProvider.getFal();
		const isEdit = imageFileData.length > 0;
		let model = nodeConfig.model;
		const imageUrls = await Promise.all(imageFileData.map(async (imgData) => {
			const result$1 = await this.mediaResolver.resolveToUrl(imgData, "Image", { userId });
			if (!result$1.url) throw new Error("Failed to resolve image URL");
			return result$1.url;
		}));
		if (isEdit) {
			if (model === "openai/gpt-image-2") model = "openai/gpt-image-2/edit";
			if (model === "fal-ai/flux-2-pro") model = "fal-ai/flux-2-pro/edit";
			if (model === "bytedance/seedream/v5/pro/text-to-image") model = "bytedance/seedream/v5/pro/edit";
			if (model === "fal-ai/nano-banana-2") model = "fal-ai/nano-banana-2/edit";
			if (model === "alibaba/qwen-image-3/text-to-image") model = "alibaba/qwen-image-3/edit";
		} else {
			if (model === "bytedance/seedream/v5/pro/edit") model = "bytedance/seedream/v5/pro/text-to-image";
			if (model === "fal-ai/nano-banana-2/edit") model = "fal-ai/nano-banana-2";
			if (model === "alibaba/qwen-image-3/edit") model = "alibaba/qwen-image-3/text-to-image";
		}
		logger.debug(`fal.ai image ${isEdit ? "edit" : "generation"} — model: ${model}, prompt: ${userPrompt}`);
		const input = { prompt: userPrompt };
		if (model.startsWith("fal-ai/flux-2-pro")) {
			input.image_size = nodeConfig.falFluxSize === "auto" && !isEdit ? "square" : nodeConfig.falFluxSize;
			input.safety_tolerance = nodeConfig.falFluxSafetyTolerance;
			input.enable_safety_checker = nodeConfig.falFluxEnableSafetyChecker;
			input.output_format = nodeConfig.falFluxOutputFormat;
		} else if (model.startsWith("openai/gpt-image-2")) {
			input.image_size = nodeConfig.openaiSize;
			input.quality = nodeConfig.openaiQuality;
			input.output_format = nodeConfig.openaiFormat;
		} else if (model.startsWith("bytedance/seedream/v5/pro")) {
			input.image_size = nodeConfig.seedreamSize;
			input.num_images = 1;
			input.output_format = nodeConfig.seedreamOutputFormat;
			input.enable_safety_checker = false;
			input.sync_mode = false;
		} else if (model.startsWith("fal-ai/nano-banana-2")) {
			input.aspect_ratio = nodeConfig.nanoBananaAspectRatio;
			input.output_format = nodeConfig.nanoBananaOutputFormat;
			input.safety_tolerance = "6";
			input.resolution = nodeConfig.nanoBananaResolution;
			input.enable_web_search = nodeConfig.nanoBananaEnableWebSearch;
			if (nodeConfig.nanoBananaThinkingLevel !== "disabled") input.thinking_level = nodeConfig.nanoBananaThinkingLevel;
			input.limit_generations = true;
			input.sync_mode = false;
		} else if (model.startsWith("alibaba/qwen-image-3")) {
			input.image_size = nodeConfig.qwenSize;
			input.output_format = nodeConfig.qwenOutputFormat;
			input.enable_prompt_expansion = nodeConfig.qwenEnablePromptExpansion;
			input.enable_safety_checker = nodeConfig.qwenEnableSafetyChecker;
			input.num_images = 1;
			input.sync_mode = false;
		}
		if (model.startsWith("openai/gpt-image-2") || model.startsWith("fal-ai/flux-2-pro") || model.startsWith("fal-ai/nano-banana-2") || model.startsWith("alibaba/qwen-image-3")) {
			if (imageUrls.length > 0) input.image_urls = imageUrls.slice(0, 3);
		} else if (model.startsWith("bytedance/seedream/v5/pro")) {
			if (imageUrls.length > 0) input.image_urls = imageUrls.slice(-10);
		} else if (isEdit && imageUrls[0]) input.image_url = imageUrls[0];
		const result = await fal.subscribe(model, { input });
		const falData = result.data;
		const images = falData.images || (falData.image ? [falData.image] : []);
		if (images.length === 0) {
			logger.error(`fal.ai response error: ${JSON.stringify(result.data)}`);
			throw new Error(`No image URL returned from ${model}`);
		}
		return await Promise.all(images.map(async (image) => {
			if (!image.url) throw new Error(`Missing image url in fal.ai response`);
			const response = await fetch(image.url);
			if (!response.ok) throw new Error(`Failed to download image from fal: ${response.statusText}`);
			return {
				buffer: Buffer.from(await response.arrayBuffer()),
				mimeType: image.content_type || response.headers.get("content-type") || "image/png"
			};
		}));
	}
	async #persistResults(results, node, data) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const items = [];
		for (const result of results) {
			const { buffer, mimeType } = result;
			const extension = mimeTypeToExtension(mimeType);
			const dimensions = await this.media.getImageDimensions(buffer);
			const randId = generateId();
			const fileName = `${node.name}_${randId}.${extension}`;
			const key = getAssetKey(fileName);
			const bucket = this.env.R2_ASSETS_BUCKET;
			await this.storage.uploadToStorage(buffer, key, mimeType, bucket);
			let asset;
			try {
				asset = await this.prisma.fileAsset.create({ data: {
					name: fileName,
					userId: data.canvas.userId,
					bucket,
					key,
					size: buffer.length,
					...dimensions,
					mimeType
				} });
			} catch (dbErr) {
				logger.error(`DB write failed for asset "${key}"; attempting storage cleanup. Error: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`);
				try {
					await this.storage.deleteFromStorage(key, bucket);
				} catch (cleanupErr) {
					logger.error(`Storage cleanup failed for orphaned asset "${key}": ${cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr)}`);
				}
				throw dbErr;
			}
			items.push({
				type: DataType.Image,
				data: createVirtualMedia({ entity: asset }, "Image"),
				outputHandleId: outputHandle.id
			});
		}
		const newResult = cloneResult(node.result);
		newResult.outputs.push({ items });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
	#handleTopLevelError(err, node) {
		if (err instanceof ModerationError) {
			logger.warn(`Image blocked by moderation: ${err.message}`);
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
		}, "ImageGen processing failed with unknown error");
		return {
			success: false,
			error: "ImageGen processing failed"
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.MEDIA), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "media", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], ImageGenProcessor.prototype, "mediaResolver", void 0);
ImageGenProcessor = __decorate([injectable()], ImageGenProcessor);
/**
* Deep-clone the existing node result, or return a fresh empty result if absent.
* Avoids the unsafe `structuredClone(x) as unknown as T` pattern.
*/
function cloneResult(existing) {
	if (existing == null) return {
		outputs: [],
		selectedOutputIndex: 0
	};
	return structuredClone(existing);
}
function mimeTypeToExtension(mimeType) {
	if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
	if (mimeType.includes("webp")) return "webp";
	return "png";
}
var server_default = defineNode(metadata, { backendProcessor: ImageGenProcessor });

//#endregion
export { server_default as default };