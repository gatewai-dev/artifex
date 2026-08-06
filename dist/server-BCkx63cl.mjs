import { M as generateId, O as createOutputItemSchema, _ as FileDataSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, k as createVirtualMedia } from "./dist-xnVPaj2K.mjs";
import { o as createFileAsset } from "./server-BO6riaNn.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bgx3WrSt.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-video-to-music/dist/metadata-yE9B2VO0.mjs
const VideoToMusicNodeConfigSchema = z$1.object({ model: z$1.string().default("sonilo/v1.1/video-to-music") });
const VideoToMusicResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Audio"), FileDataSchema));
const metadata = defineMetadata({
	type: "VideoToMusic",
	displayName: "Video to Music",
	description: "Analyzes your video’s to generate a frame-synced soundtrack in seconds",
	category: "AI",
	subcategory: "Audio",
	configSchema: VideoToMusicNodeConfigSchema,
	resultSchema: VideoToMusicResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Video"],
			required: true,
			label: "Video",
			order: 0
		}, {
			dataTypes: ["Text"],
			required: false,
			label: "Prompt",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Audio"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { model: "sonilo/v1.1/video-to-music" },
	pricing: (_config, inputs) => {
		const PRICE_PER_SECOND = 2;
		const DEFAULT_PRICE = 20;
		if (!inputs) return DEFAULT_PRICE;
		const videoInput = Object.values(inputs).find((input) => {
			if (!input || typeof input !== "object") return false;
			const typedInput = input;
			if (typedInput.metadata?.durationMs != null) return true;
			if (typedInput.entity?.mimeType?.startsWith("video/")) return true;
			return false;
		});
		if (!videoInput) return DEFAULT_PRICE;
		const durationMs = videoInput.metadata?.durationMs ?? (videoInput.entity?.duration != null ? videoInput.entity.duration * 1e3 : null);
		if (durationMs == null || durationMs <= 0) return DEFAULT_PRICE;
		return Math.ceil(durationMs / 1e3) * PRICE_PER_SECOND;
	}
});

//#endregion
//#region ../../nodes/node-video-to-music/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let VideoToMusicProcessor = class VideoToMusicProcessor$1 {
	prisma;
	graph;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const videoInput = resolver.input("Video").required().asVideo();
			const prompt = resolver.input("Prompt").asText() ?? "";
			const nodeConfig = VideoToMusicNodeConfigSchema.parse(node.config);
			logger.debug(`Video to Music (Fal sonilo) — prompt chars: ${prompt.length}`);
			const videoResult = await this.mediaResolver.resolveToUrl(videoInput, "Video", { userId: data.canvas.userId ?? void 0 });
			if (!videoResult.url) throw new Error("Failed to resolve video URL");
			const fal = this.aiProvider.getFal();
			const input = {
				video_url: videoResult.url,
				num_samples: 1
			};
			if (prompt.trim()) input.prompt = prompt.trim();
			const falData = (await fal.subscribe(nodeConfig.model, { input })).data;
			const audioUrl = falData.audio?.url ?? falData.audios?.[0]?.url;
			if (!audioUrl) throw new Error("Fal AI did not return an audio URL");
			const response = await fetch(audioUrl);
			if (!response.ok) throw new Error(`Failed to fetch audio from Fal: ${response.statusText}`);
			const buffer = Buffer.from(await response.arrayBuffer());
			const contentType = falData.audio?.content_type ?? falData.audios?.[0]?.content_type ?? "audio/mp4";
			return this.finaliseAudioResult(node, data, buffer, contentType);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, `VideoToMusic processing failed: ${message}`);
			return {
				success: false,
				error: `VideoToMusic processing failed: ${message}`
			};
		}
	}
	async finaliseAudioResult(node, data, buffer, contentType) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const randId = generateId();
		const extension = contentType.includes("mp4") || contentType.includes("m4a") ? "m4a" : "mp3";
		const fileName = `${node.name}_${randId}.${extension}`;
		const { asset } = await createFileAsset(this.prisma, {
			userId: data.canvas.userId ?? void 0,
			buffer,
			filename: fileName,
			mimeType: contentType
		});
		const newResult = structuredClone(node.result) ?? {
			outputs: [],
			selectedOutputIndex: 0
		};
		newResult.outputs.push({ items: [{
			type: "Audio",
			data: createVirtualMedia({ entity: asset }, "Audio"),
			outputHandleId: outputHandle.id
		}] });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], VideoToMusicProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], VideoToMusicProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], VideoToMusicProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], VideoToMusicProcessor.prototype, "mediaResolver", void 0);
VideoToMusicProcessor = __decorate([injectable()], VideoToMusicProcessor);
var server_default = defineNode(metadata, { backendProcessor: VideoToMusicProcessor });

//#endregion
export { server_default as default };