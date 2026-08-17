import { S as generateId, _ as createOutputItemSchema, c as ModerationError, l as MultiOutputGenericSchema, p as VirtualMediaDataSchema, v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS, c as logger } from "./dist-CsJ7TTyG.mjs";
import { t as DataType } from "./dist-BmiZG8vq.mjs";
import { n as createFileAsset } from "./server-BoqMO5Jh.mjs";
import "./src-DTpmEm7a.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";
import assert from "node:assert";

//#region ../../nodes/node-lip-sync/dist/metadata-BniPLadA.mjs
const LIP_SYNC_MODELS = ["fal-ai/creatify/aurora", "fal-ai/bytedance/omnihuman/v1.5"];
const LipSyncNodeConfigSchema = z$1.object({ model: z$1.enum(LIP_SYNC_MODELS) });
const metadata = defineMetadata({
	type: "LipSync",
	displayName: "Lip Sync",
	description: "Turns any avatar image into a talking video",
	category: "AI",
	subcategory: "Video",
	configSchema: LipSyncNodeConfigSchema,
	resultSchema: MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema)),
	isTerminal: true,
	isDynamicPricing: true,
	isTransient: false,
	variableInputs: {
		enabled: false,
		dataTypes: [
			"Text",
			"Image",
			"Video",
			"Audio"
		]
	},
	handles: {
		inputs: [
			{
				label: "Avatar Image",
				required: true,
				dataTypes: ["Image"],
				order: 0
			},
			{
				label: "Audio",
				required: true,
				dataTypes: ["Audio"],
				order: 1
			},
			{
				label: "Prompt",
				required: false,
				dataTypes: ["Text"],
				description: "Optional prompt to guide the avatar's expression and style. If omitted, the avatar will default to a neutral expression. NOT A SCRIPT INPUT.",
				order: 2
			}
		],
		outputs: [{
			label: "Result",
			dataTypes: ["Video"],
			order: 0
		}]
	},
	defaultConfig: { model: "fal-ai/creatify/aurora" },
	pricing(inputs) {
		const PRICE_PER_SECOND = 20;
		if (!inputs) return PRICE_PER_SECOND;
		const audioInput = Object.values(inputs).find((input) => {
			if (input?.metadata?.durationMs != null) return true;
			if (input?.entity?.mimeType?.startsWith("audio/")) return true;
			return false;
		});
		if (!audioInput) return PRICE_PER_SECOND;
		const durationMs = audioInput?.metadata?.durationMs ?? (audioInput?.entity?.duration != null ? audioInput.entity.duration * 1e3 : null);
		if (durationMs == null || durationMs <= 0) return PRICE_PER_SECOND * 10;
		return Math.ceil(durationMs / 1e3) * PRICE_PER_SECOND;
	}
});

//#endregion
//#region ../../nodes/node-lip-sync/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LipSyncProcessor = class LipSyncProcessor$1 {
	prisma;
	env;
	graph;
	aiProvider;
	mediaResolver;
	async resolveVirtualMediaToUrl(media, type, userId) {
		if (!media?.operation) return null;
		try {
			return (await this.mediaResolver.resolveToUrl(media, type, { userId })).url ?? null;
		} catch (err) {
			logger.error(`Failed to resolve ${type} to URL: ${err}`);
			return null;
		}
	}
	async process({ node, data }) {
		try {
			const { model } = LipSyncNodeConfigSchema.parse(node.config);
			if (!this.env.FAL_API_KEY) return {
				success: false,
				error: "FAL_API_KEY is not configured"
			};
			const fal = this.aiProvider.getFal();
			const resolver = this.graph.forNode(node, data);
			const imageMedia = resolver.input("Avatar Image").asImage();
			const prompt = resolver.input("Prompt").asText();
			const audioMedia = resolver.input("Audio").asAudio();
			const imageUrl = await this.resolveVirtualMediaToUrl(imageMedia, "Image", data.canvas.userId);
			const audioUrl = await this.resolveVirtualMediaToUrl(audioMedia, "Audio", data.canvas.userId);
			if (!imageUrl || !audioUrl) return {
				success: false,
				error: "Failed to resolve input media URLs"
			};
			const input = {
				image_url: imageUrl,
				audio_url: audioUrl,
				prompt
			};
			logger.info(`Calling Fal AI: ${model} with params: ${input}`);
			const falData = (await fal.subscribe(model, { input })).data;
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing."
			};
			const dataType = DataType.Video;
			let fileAsset = null;
			assert(falData.video?.url, "Fal response is missing video URL");
			const videoUrl = falData.video.url;
			const arrayBuffer = await (await fetch(videoUrl)).arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const mimeType = falData.video.content_type ?? "video/mp4";
			const randId = generateId();
			const extension = mimeType.split("/")[1] ?? "mp4";
			const fileName = `LipSync_${data.task?.id ?? `${node.id}_${randId}`}.${extension}`;
			const { asset } = await createFileAsset(this.prisma, {
				userId: data.canvas.userId,
				buffer,
				filename: fileName,
				mimeType
			});
			fileAsset = asset;
			const newResult = node.result ? structuredClone(node.result) : {
				outputs: [],
				selectedOutputIndex: 0
			};
			if (!newResult.outputs) newResult.outputs = [];
			const newGeneration = { items: [{
				type: dataType,
				data: createVirtualMedia({ entity: fileAsset }, "Video"),
				outputHandleId: outputHandle.id
			}] };
			newResult.outputs.push(newGeneration);
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult
			};
		} catch (err) {
			if (err instanceof ModerationError) {
				logger.warn({
					err,
					nodeId: node.id
				}, `LipSync blocked by moderation: ${err.message}`);
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
				}, "LipSync processing failed");
				return {
					success: false,
					error: err.message
				};
			}
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "LipSync processing failed");
			return {
				success: false,
				error: "FalGen processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], LipSyncProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], LipSyncProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], LipSyncProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], LipSyncProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], LipSyncProcessor.prototype, "mediaResolver", void 0);
LipSyncProcessor = __decorate([injectable()], LipSyncProcessor);
var server_default = defineNode(metadata, { backendProcessor: LipSyncProcessor });

//#endregion
export { server_default as default };