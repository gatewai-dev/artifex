import { N as getActiveMediaMetadata, P as getFingerprint, a as TOKENS, c as logger, g as ExportResultSchema } from "./dist-D86uNdKf.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BdNfjggX.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-export/dist/metadata-fP5YwtaN.mjs
const DEFAULT_RENDER_COST = 20;
const ExportNodeConfigSchema = z$1.object({
	file: z$1.string().optional(),
	format: z$1.enum([
		"mp4",
		"webm",
		"gif",
		"mp3"
	]).optional().default("mp4"),
	renderAt: z$1.enum(["server", "browser"]).optional().default("browser"),
	audioCodec: z$1.enum([
		"aac",
		"opus",
		"mp3"
	]).optional()
}).strict();
const metadata = defineMetadata({
	type: "Export",
	displayName: "Export",
	description: "An UI download / API output node",
	category: "Input/Output",
	configSchema: ExportNodeConfigSchema,
	resultSchema: ExportResultSchema,
	isTerminal: true,
	isTransient: false,
	showInQuickAccess: false,
	validation: (config, inputs) => {
		if (config?.format === "mp3") return null;
		if (!inputs) return null;
		const inputData = Object.values(inputs).find((input) => {
			const item = input;
			const dataType$1 = item?.operation?.dataType || item?.dataType;
			const mimeType$1 = item?.entity?.mimeType || item?.mimeType;
			const isAudio = dataType$1 === "Audio" || mimeType$1?.startsWith("audio/");
			const isVideo = dataType$1 === "Video" || mimeType$1?.startsWith("video/");
			const isGif = dataType$1 === "GIF" || mimeType$1 === "image/gif";
			const isImage = dataType$1 === "Image" || mimeType$1?.startsWith("image/");
			return isAudio || isVideo || isGif || isImage || dataType$1 === "SVG" || mimeType$1 === "image/svg+xml" || dataType$1 === "Lottie" || dataType$1 === "Caption";
		});
		if (!inputData) return null;
		const dataType = inputData?.operation?.dataType || inputData?.dataType;
		const mimeType = inputData?.entity?.mimeType || inputData?.mimeType;
		if (!(dataType === "Video" || mimeType?.startsWith("video/")) && !(dataType === "GIF" || mimeType === "image/gif")) return null;
		const width = inputData.operation ? getActiveMediaMetadata(inputData)?.width ?? inputData.metadata?.width ?? inputData.entity?.width : inputData.entity?.width ?? inputData.metadata?.width;
		const height = inputData.operation ? getActiveMediaMetadata(inputData)?.height ?? inputData.metadata?.height ?? inputData.entity?.height : inputData.entity?.height ?? inputData.metadata?.height;
		if (width != null && height != null) {
			if (width % 2 !== 0 || height % 2 !== 0) return { dimensions: `Video dimensions must be even numbers. Current size: ${width}x${height}. Please adjust the dimensions to be even numbers (e.g. by cropping or resizing) before exporting.` };
		}
		return null;
	},
	handles: {
		inputs: [{
			dataTypes: [
				"Text",
				"Image",
				"Video",
				"Audio",
				"SVG",
				"LUT",
				"Caption",
				"Lottie",
				"GIF"
			],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: []
	},
	pricing(_cfg, inputs) {
		if (!inputs) return 0;
		const inputData = Object.values(inputs).find((input) => {
			const item = input;
			const dataType$1 = item?.operation?.dataType || item?.dataType;
			const mimeType$1 = item?.entity?.mimeType || item?.mimeType;
			const isAudio$1 = dataType$1 === "Audio" || mimeType$1?.startsWith("audio/");
			const isVideo$1 = dataType$1 === "Video" || mimeType$1?.startsWith("video/");
			return isAudio$1 || isVideo$1 || dataType$1 === "GIF" || mimeType$1 === "image/gif";
		});
		if (!inputData) return 0;
		const dataType = inputData?.operation?.dataType || inputData?.dataType;
		const mimeType = inputData?.entity?.mimeType || inputData?.mimeType;
		const isAudio = dataType === "Audio" || mimeType?.startsWith("audio/");
		const isVideo = dataType === "Video" || mimeType?.startsWith("video/");
		const isGif = dataType === "GIF" || mimeType === "image/gif";
		if (!isVideo && !isAudio && !isGif) return 0;
		const durationMs = inputData?.metadata?.durationMs ?? inputData?.durationMs ?? (inputData?.entity?.duration != null ? inputData.entity.duration * 1e3 : inputData?.duration != null ? inputData.duration * 1e3 : null);
		if (durationMs == null || durationMs <= 0) return 0;
		const durationSeconds = durationMs / 1e3;
		let tokens = 0;
		if (isAudio && !isVideo && !isGif) tokens = durationSeconds * .002 + .1;
		else {
			const width = inputData?.metadata?.width ?? inputData?.entity?.width ?? 1920;
			const height = inputData?.metadata?.height ?? inputData?.entity?.height ?? 1080;
			const fps = inputData?.metadata?.fps ?? inputData?.entity?.fps ?? 30;
			const pixels = width * height;
			const resolutionMultiplier = Math.max(.1, pixels / (1920 * 1080)) ** 1.5;
			const fpsMultiplier = fps / 30;
			tokens = durationSeconds * .02 * resolutionMultiplier * fpsMultiplier;
			tokens += .5;
		}
		return Math.max(DEFAULT_RENDER_COST, Number(tokens.toFixed(1)) * 2);
	}
});

//#endregion
//#region ../../nodes/node-export/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExportServerProcessor = class ExportServerProcessor$1 {
	graph;
	mediaResolver;
	storage;
	async process({ node, data }) {
		try {
			const inputValue = this.graph.forNode(node, data).input().item();
			if (!inputValue) return {
				success: false,
				error: "Input is required for export"
			};
			let dataToPass = inputValue.data;
			let resolvedFileKey;
			const hasEntity = typeof inputValue.data === "object" && inputValue.data !== null && "entity" in inputValue.data;
			const shouldRender = inputValue.type === "Video" || inputValue.type === "Audio" || inputValue.type === "GIF" || inputValue.type === "LUT" || inputValue.type === "Image";
			const config = node.config;
			if (shouldRender && !hasEntity) {
				const virtualMedia = inputValue.data;
				const isVideoOrGif = inputValue.type === "Video" || inputValue.type === "GIF";
				let codec;
				let audioCodec;
				let imageFormat;
				let pixelFormat;
				if (isVideoOrGif && config) {
					if (config.format === "webm") {
						codec = "vp8";
						imageFormat = "png";
						pixelFormat = "yuva420p";
					} else if (config.format === "gif") codec = "gif";
					else if (config.format === "mp4") codec = "h264";
					audioCodec = config.audioCodec;
				} else if (inputValue.type === "Audio") {
					if (config?.format === "mp4") codec = "aac";
					else if (config?.format === "webm") codec = "opus";
					else codec = "mp3";
					audioCodec = config.audioCodec;
				}
				const result = await this.mediaResolver.resolveToAsset(virtualMedia, inputValue.type, {
					userId: data.canvas.userId,
					codec,
					audioCodec,
					imageFormat,
					pixelFormat
				});
				if (result.virtualMedia) dataToPass = result.virtualMedia;
				if (result.fileKey) resolvedFileKey = result.fileKey;
			}
			if (config?.file) try {
				let buffer;
				const key = resolvedFileKey ?? dataToPass?.operation?.source?.entity?.key ?? dataToPass?.entity?.key ?? dataToPass?.key;
				if (key) buffer = await this.storage.getFromStorage(key);
				else if (Buffer.isBuffer(dataToPass)) buffer = dataToPass;
				else if (typeof dataToPass === "string") buffer = Buffer.from(dataToPass);
				else if (typeof inputValue.data === "string") buffer = Buffer.from(inputValue.data);
				if (buffer) {
					const absoluteOut = path.resolve(config.file);
					await fs.mkdir(path.dirname(absoluteOut), { recursive: true });
					await fs.writeFile(absoluteOut, buffer);
					logger.info(`[ExportServerProcessor] Exported file saved to: ${absoluteOut}`);
				}
			} catch (writeErr) {
				logger.error({
					err: writeErr,
					file: config.file
				}, "Failed to write export file to disk");
			}
			const inputFingerprint = getFingerprint({
				data: inputValue.data,
				config
			});
			return {
				success: true,
				newResult: {
					outputs: [{ items: [{
						type: inputValue.type,
						data: dataToPass,
						outputHandleId: void 0
					}] }],
					selectedOutputIndex: 0,
					sourceFingerprint: inputFingerprint
				}
			};
		} catch (err) {
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "Export processing failed");
			if (err instanceof Error) return {
				success: false,
				error: err.message
			};
			return {
				success: false,
				error: "Export processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], ExportServerProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], ExportServerProcessor.prototype, "mediaResolver", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], ExportServerProcessor.prototype, "storage", void 0);
ExportServerProcessor = __decorate([injectable()], ExportServerProcessor);
var server_default = defineNode(metadata, { backendProcessor: ExportServerProcessor });

//#endregion
export { server_default as default };