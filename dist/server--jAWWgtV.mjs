import { D as createOutputItemSchema, O as createVirtualMedia, a as TOKENS, c as logger, g as FileDataSchema, j as generateId, s as getAssetKey, v as ModerationError, y as MultiOutputGenericSchema } from "./dist-D9o3ES2C.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bh8-kZ60.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-extract-object/dist/metadata-Cs6bNuLz.mjs
const EXTRACT_OBJECT_MODELS = ["bria/extract-object"];
const ExtractObjectNodeConfigSchema = z$1.object({
	model: z$1.enum(EXTRACT_OBJECT_MODELS).default("bria/extract-object"),
	autocrop: z$1.boolean().default(false),
	remove_background: z$1.boolean().default(false)
});
const ExtractObjectResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), FileDataSchema));
const defaultConfig = {
	model: EXTRACT_OBJECT_MODELS[0],
	autocrop: false,
	remove_background: false
};
const PRICE_TABLE = { "bria/extract-object": 20 };
const metadata = defineMetadata({
	type: "ExtractObject",
	displayName: "Extract Object",
	description: "Segment and extract an object from an image using a prompt",
	category: "AI",
	subcategory: "Image",
	configSchema: ExtractObjectNodeConfigSchema,
	resultSchema: ExtractObjectResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Image"],
			required: true,
			label: "Image",
			order: 0
		}, {
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Image"],
			label: "Result",
			order: 0
		}, {
			dataTypes: ["Image"],
			label: "Mask",
			order: 1
		}]
	},
	defaultConfig,
	pricing: () => PRICE_TABLE["bria/extract-object"]
});

//#endregion
//#region ../../nodes/node-extract-object/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExtractObjectProcessor = class ExtractObjectProcessor$1 {
	prisma;
	env;
	graph;
	storage;
	media;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const nodeConfig = ExtractObjectNodeConfigSchema.parse(node.config);
			const resolver = this.graph.forNode(node, data);
			const inputAsImage = resolver.input("Image").asImage();
			if (!inputAsImage) return {
				success: false,
				error: "Image input is required. Connect an image asset to the Image handle."
			};
			const promptInput = resolver.input("Prompt").required().asText();
			if (!promptInput?.trim()) return {
				success: false,
				error: "Prompt input is required."
			};
			const imageResult = await this.mediaResolver.resolveToUrl(inputAsImage, "Image", { userId: data.canvas.userId });
			if (!imageResult.url) throw new Error("Failed to resolve source image URL");
			const fal = this.aiProvider.getFal();
			const model = "bria/extract-object";
			logger.debug(`fal.ai extract-object — model: ${model}, prompt: ${promptInput}`);
			const input = {
				image_url: imageResult.url,
				prompt: promptInput,
				sync_mode: false,
				autocrop: nodeConfig.autocrop,
				remove_background: nodeConfig.remove_background
			};
			const result = await fal.subscribe(model, { input });
			const falData = result.data;
			if (!falData.image?.url) {
				logger.error(`fal.ai response error: ${JSON.stringify(result.data)}`);
				throw new Error(`No image output URL returned from ${model}`);
			}
			if (!falData.mask?.url) {
				logger.error(`fal.ai response error: ${JSON.stringify(result.data)}`);
				throw new Error(`No mask output URL returned from ${model}`);
			}
			const [imageBufferResult, maskBufferResult] = await Promise.all([this.#downloadFile(falData.image.url, falData.image.content_type || "image/png"), this.#downloadFile(falData.mask.url, falData.mask.content_type || "image/png")]);
			const [imageAsset, maskAsset] = await Promise.all([this.#uploadAndSaveAsset(imageBufferResult.buffer, imageBufferResult.mimeType, "result", node, data), this.#uploadAndSaveAsset(maskBufferResult.buffer, maskBufferResult.mimeType, "mask", node, data)]);
			const outputHandles = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output");
			const resultOutputHandle = outputHandles.find((h) => h.label === "Result");
			const maskOutputHandle = outputHandles.find((h) => h.label === "Mask");
			if (!resultOutputHandle || !maskOutputHandle) return {
				success: false,
				error: "Missing required output handles"
			};
			const newResult = cloneResult(node.result);
			newResult.outputs.push({ items: [{
				type: DataType.Image,
				data: createVirtualMedia({ entity: imageAsset }, "Image"),
				outputHandleId: resultOutputHandle.id
			}, {
				type: DataType.Image,
				data: createVirtualMedia({ entity: maskAsset }, "Image"),
				outputHandleId: maskOutputHandle.id
			}] });
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult
			};
		} catch (err) {
			return this.#handleTopLevelError(err, node);
		}
	}
	async #downloadFile(url, defaultMimeType) {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to download file from fal: ${response.statusText}`);
		const arrayBuffer = await response.arrayBuffer();
		return {
			buffer: Buffer.from(arrayBuffer),
			mimeType: response.headers.get("content-type") || defaultMimeType
		};
	}
	async #uploadAndSaveAsset(buffer, mimeType, prefix, node, data) {
		const extension = mimeTypeToExtension(mimeType);
		const randId = generateId();
		const fileName = `${node.name}_${prefix}_${randId}.${extension}`;
		const key = getAssetKey(fileName);
		const bucket = this.env.R2_ASSETS_BUCKET;
		await this.storage.uploadToStorage(buffer, key, mimeType, bucket);
		const dimensions = await this.media.getImageDimensions(buffer);
		try {
			return await this.prisma.fileAsset.create({ data: {
				name: fileName,
				userId: data.canvas.userId,
				bucket,
				key,
				size: buffer.length,
				...dimensions ?? {},
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
	}
	#handleTopLevelError(err, node) {
		if (err instanceof ModerationError) {
			logger.warn(`Media blocked by moderation: ${err.message}`);
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
		}, "Extract object failed with unknown error");
		return {
			success: false,
			error: "Extract object failed"
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.MEDIA), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "media", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], ExtractObjectProcessor.prototype, "mediaResolver", void 0);
ExtractObjectProcessor = __decorate([injectable()], ExtractObjectProcessor);
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
var server_default = defineNode(metadata, { backendProcessor: ExtractObjectProcessor });

//#endregion
export { server_default as default };