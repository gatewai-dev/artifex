import { D as createOutputItemSchema, O as createVirtualMedia, a as TOKENS, c as logger, g as FileDataSchema, j as generateId, s as getAssetKey, v as ModerationError, y as MultiOutputGenericSchema } from "./dist-DIOL7bVU.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Dk31kopb.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-remove-background/dist/metadata-CblLI92F.mjs
const RMBG_NODE_MODELS = [...["fal-ai/bria/background/remove"]];
const RemBgNodeConfigSchema = z$1.object({ model: z$1.enum(RMBG_NODE_MODELS).default("fal-ai/bria/background/remove") });
const RemBgResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), FileDataSchema));
const defaultConfig = { model: RMBG_NODE_MODELS[0] };
const PRICE_TABLE = { "fal-ai/bria/background/remove": 10 };
const metadata = defineMetadata({
	type: "RemoveBackground",
	displayName: "Remove Background",
	description: "Remove the background from an image using AI",
	category: "AI",
	subcategory: "Image",
	configSchema: RemBgNodeConfigSchema,
	resultSchema: RemBgResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Image"],
			required: true,
			label: "Media",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Image"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig,
	pricing: () => PRICE_TABLE["fal-ai/bria/background/remove"]
});

//#endregion
//#region ../../nodes/node-remove-background/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RemBgProcessor = class RemBgProcessor$1 {
	prisma;
	env;
	graph;
	storage;
	media;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const nodeConfig = RemBgNodeConfigSchema.parse(node.config);
			const inputAsImage = this.graph.forNode(node, data).input("Media").asImage();
			if (!inputAsImage) return {
				success: false,
				error: "Media input is required. Connect an image asset to the Media handle."
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
		return this.#removeBackground(nodeConfig, imageResult.url);
	}
	async #removeBackground(nodeConfig, mediaUrl) {
		const fal = this.aiProvider.getFal();
		const model = "fal-ai/bria/background/remove";
		logger.debug(`fal.ai background removal — model: ${model}`);
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
		}, "Background removal failed with unknown error");
		return {
			success: false,
			error: "Background removal failed"
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.MEDIA), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "media", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], RemBgProcessor.prototype, "mediaResolver", void 0);
RemBgProcessor = __decorate([injectable()], RemBgProcessor);
function buildFalInput(_cfg, mediaUrl) {
	return {
		image_url: mediaUrl,
		sync_mode: false
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
var server_default = defineNode(metadata, { backendProcessor: RemBgProcessor });

//#endregion
export { server_default as default };