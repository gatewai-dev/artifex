import { S as generateId, _ as createOutputItemSchema, a as FileDataSchema, c as ModerationError, l as MultiOutputGenericSchema, v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS, c as logger, s as getAssetKey } from "./dist-C1zv_7fB.mjs";
import { t as DataType } from "./dist-BmiZG8vq.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-depth-map/dist/metadata-BfkPp3El.mjs
const DepthMapNodeConfigSchema = z$1.object({
	num_inference_steps: z$1.number().int().min(2).max(50).catch(10),
	ensemble_size: z$1.number().int().min(2).max(50).catch(10),
	processing_res: z$1.number().int().min(0).max(2048).catch(0)
});
const DepthMapResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), FileDataSchema));
const metadata = defineMetadata({
	type: "DepthMap",
	displayName: "Depth Map",
	description: "Generate a depth map from an image using AI",
	category: "AI",
	subcategory: "Image",
	configSchema: DepthMapNodeConfigSchema,
	resultSchema: DepthMapResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Image"],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Image"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		num_inference_steps: 10,
		ensemble_size: 10,
		processing_res: 0
	},
	pricing: () => 5
});

//#endregion
//#region ../../nodes/node-depth-map/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DepthMapProcessor = class DepthMapProcessor$1 {
	prisma;
	env;
	graph;
	storage;
	media;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const nodeConfig = DepthMapNodeConfigSchema.parse(node.config);
			const inputAsImage = this.graph.forNode(node, data).input("Input").asImage();
			if (!inputAsImage) return {
				success: false,
				error: "Image input is required. Connect an image asset to the Image handle."
			};
			const { buffer, mimeType } = await this.#processImage(nodeConfig, data, inputAsImage);
			return await this.#persistResult(buffer, mimeType, node, data);
		} catch (err) {
			return this.#handleTopLevelError(err, node);
		}
	}
	async #processImage(nodeConfig, data, imageMedia) {
		const imageResult = await this.mediaResolver.resolveToUrl(imageMedia, "Image", { userId: data.canvas.userId });
		if (!imageResult.url) throw new Error("Failed to resolve image URL");
		return this.#generateDepthMap(nodeConfig, imageResult.url);
	}
	async #generateDepthMap(nodeConfig, mediaUrl) {
		const fal = this.aiProvider.getFal();
		const model = "fal-ai/imageutils/marigold-depth";
		logger.debug(`fal.ai depth estimation — model: ${model}`);
		const input = buildFalInput(nodeConfig, mediaUrl);
		console.log({ input });
		const result = await fal.subscribe(model, { input });
		const falData = result.data;
		const out = falData.image ?? falData.file;
		if (!out?.url) {
			logger.error(`fal.ai response error: ${JSON.stringify(result.data)}`);
			throw new Error(`No output URL returned from ${model}`);
		}
		const response = await fetch(out.url);
		if (!response.ok) throw new Error(`Failed to download image from fal: ${response.statusText}`);
		return {
			buffer: Buffer.from(await response.arrayBuffer()),
			mimeType: out.content_type ?? response.headers.get("content-type") ?? "image/png"
		};
	}
	async #persistResult(buffer, mimeType, node, data) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const extension = mimeTypeToExtension(mimeType);
		const randId = generateId();
		const fileName = `${node.name}_${randId}.${extension}`;
		const key = getAssetKey(fileName);
		const bucket = this.env.R2_ASSETS_BUCKET;
		await this.storage.uploadToStorage(buffer, key, mimeType, bucket);
		const dimensions = await this.media.getImageDimensions(buffer);
		let asset;
		try {
			asset = await this.prisma.fileAsset.create({ data: {
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
		const newResult = cloneResult(node.result);
		const dataType = DataType.Image;
		newResult.outputs.push({ items: [{
			type: dataType,
			data: createVirtualMedia({ entity: asset }, "Image"),
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
		}, "Depth estimation failed with unknown error");
		return {
			success: false,
			error: "Depth estimation failed"
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.MEDIA), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "media", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], DepthMapProcessor.prototype, "mediaResolver", void 0);
DepthMapProcessor = __decorate([injectable()], DepthMapProcessor);
function buildFalInput(cfg, mediaUrl) {
	return {
		image_url: mediaUrl,
		num_inference_steps: cfg.num_inference_steps,
		ensemble_size: cfg.ensemble_size,
		processing_res: cfg.processing_res
	};
}
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
var server_default = defineNode(metadata, { backendProcessor: DepthMapProcessor });

//#endregion
export { server_default as default };