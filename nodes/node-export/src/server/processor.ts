import fs from "node:fs/promises";
import path from "node:path";
import { getFingerprint, type VirtualMediaData } from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type IMediaResolverService,
	type NodeProcessor,
	type ResolveOptions,
	type StorageService,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { logger } from "@gatewai.studio/server-utils";
import { inject, injectable } from "inversify";
import type { ExportConfig, ExportResult } from "../shared/config.js";

@injectable()
export class ExportServerProcessor implements NodeProcessor {
	@inject(TOKENS.GRAPH_RESOLVERS) private graph!: IGraphResolverService;
	@inject(TOKENS.MEDIA_RESOLVER)
	private mediaResolver!: IMediaResolverService;
	@inject(TOKENS.STORAGE)
	private storage!: StorageService;

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ExportResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputValue = resolver.input().item();
			if (!inputValue) {
				return { success: false, error: "Input is required for export" };
			}

			let dataToPass = inputValue.data;
			let resolvedFileKey: string | undefined;

			const isObjectData =
				typeof inputValue.data === "object" && inputValue.data !== null;
			const hasEntity = isObjectData && "entity" in (inputValue.data as object);

			const shouldRender =
				inputValue.type === "Video" ||
				inputValue.type === "Audio" ||
				inputValue.type === "GIF" ||
				inputValue.type === "LUT" ||
				inputValue.type === "Image";

			const config = node.config as ExportConfig;

			if (shouldRender && !hasEntity) {
				const virtualMedia = inputValue.data as VirtualMediaData;

				const isVideoOrGif =
					inputValue.type === "Video" || inputValue.type === "GIF";
				let codec: ResolveOptions["codec"];
				let audioCodec: ResolveOptions["audioCodec"];
				let imageFormat: ResolveOptions["imageFormat"];
				let pixelFormat: ResolveOptions["pixelFormat"];

				if (isVideoOrGif && config) {
					if (config.format === "webm") {
						codec = "vp8";
						imageFormat = "png";
						pixelFormat = "yuva420p";
					} else if (config.format === "gif") {
						codec = "gif";
					} else if (config.format === "mp4") {
						codec = "h264";
					}
					audioCodec = config.audioCodec;
				} else if (inputValue.type === "Audio") {
					if (config?.format === "mp4") {
						codec = "aac";
					} else if (config?.format === "webm") {
						codec = "opus";
					} else {
						codec = "mp3";
					}
					audioCodec = config.audioCodec;
				}

				const result = await this.mediaResolver.resolveToAsset(
					virtualMedia,
					inputValue.type as any,
					{
						userId: data.canvas.userId,
						codec,
						audioCodec,
						imageFormat,
						pixelFormat,
					},
				);

				if (result.virtualMedia) {
					dataToPass = result.virtualMedia as VirtualMediaData;
				}
				if (result.fileKey) {
					resolvedFileKey = result.fileKey;
				}
			}

			if (config?.file) {
				try {
					let buffer: Buffer | undefined;
					const key =
						resolvedFileKey ??
						(dataToPass as any)?.operation?.source?.entity?.key ??
						(dataToPass as any)?.entity?.key ??
						(dataToPass as any)?.key;

					const svgContent =
						(dataToPass as any)?.operation?.svgContent ??
						(inputValue.data as any)?.operation?.svgContent;
					const svgDataUrl =
						(dataToPass as any)?.operation?.svgDataUrl ??
						(inputValue.data as any)?.operation?.svgDataUrl;

					if (key) {
						buffer = await this.storage.getFromStorage(key);
					} else if (typeof svgContent === "string") {
						buffer = Buffer.from(svgContent, "utf-8");
					} else if (
						typeof svgDataUrl === "string" &&
						svgDataUrl.startsWith("data:image/svg+xml;base64,")
					) {
						buffer = Buffer.from(
							svgDataUrl.replace("data:image/svg+xml;base64,", ""),
							"base64",
						);
					} else if (Buffer.isBuffer(dataToPass)) {
						buffer = dataToPass;
					} else if (typeof dataToPass === "string") {
						buffer = Buffer.from(dataToPass);
					} else if (typeof inputValue.data === "string") {
						buffer = Buffer.from(inputValue.data);
					}

					if (buffer) {
						const absoluteOut = path.resolve(config.file);
						await fs.mkdir(path.dirname(absoluteOut), { recursive: true });
						await fs.writeFile(absoluteOut, buffer);
						logger.info(
							`[ExportServerProcessor] Exported file saved to: ${absoluteOut}`,
						);
					}
				} catch (writeErr) {
					console.error("Failed to write export file to disk:", writeErr);
				}
			}

			const inputFingerprint = getFingerprint({
				data: inputValue.data,
				config,
			});

			const newResult: ExportResult = {
				outputs: [
					{
						items: [
							{
								type: inputValue.type,
								data: dataToPass,
								outputHandleId: undefined,
							} as ExportResult["outputs"][number]["items"][number],
						],
					},
				],
				selectedOutputIndex: 0,
				sourceFingerprint: inputFingerprint,
			};
			return { success: true, newResult };
		} catch (err: unknown) {
			console.error("Export processing failed:", err);
			if (err instanceof Error) {
				return { success: false, error: err.message };
			}
			return { success: false, error: "Export processing failed" };
		}
	}
}
