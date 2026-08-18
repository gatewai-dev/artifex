import type { VirtualMediaData } from "@gatewai.studio/core";
import {
	createVirtualMedia,
	findSourceAsset,
	hasOnlySingleSource,
} from "@gatewai.studio/core";
import type { PrismaClient } from "@gatewai.studio/db/types";
import { createFileAsset } from "@gatewai.studio/media/server";
import type { AIProvider } from "@gatewai.studio/node-sdk/server";
import type {
	IMediaRendererService,
	IMediaResolverService,
	StorageService,
} from "@gatewai.studio/server-utils";
import { TOKENS } from "@gatewai.studio/server-utils";
import { inject, injectable, optional } from "inversify";

@injectable()
export class MediaResolverService implements IMediaResolverService {
	constructor(
		@inject(TOKENS.STORAGE) private storage: StorageService,
		@inject(TOKENS.PRISMA) private prisma: PrismaClient,
		@inject(TOKENS.MEDIA_RENDERER) private renderer: IMediaRendererService,
		@inject(TOKENS.AI_PROVIDER) @optional() private aiProvider?: AIProvider,
	) {}

	async resolveToBuffer(
		media: VirtualMediaData,
		type: any,
		options?: any,
	): Promise<any> {
		if (type === "Caption") {
			const srtText = (media.operation as any)?.srtText;
			if (typeof srtText === "string" && srtText.trim().length > 0) {
				return {
					buffer: Buffer.from(srtText),
					mimeType: "text/plain",
				};
			}

			if (hasOnlySingleSource(media)) {
				const source = findSourceAsset(media);
				const key = source?.entity?.key;
				if (key) {
					const buffer = await this.storage.getFromStorage(key);
					return {
						buffer,
						mimeType: source.entity?.mimeType ?? "text/plain",
						fileKey: key,
					};
				}
			}
			throw new Error("Caption not found in storage or operation config");
		}

		const isTypeMatching =
			!media.operation?.dataType || media.operation.dataType === type;
		if (hasOnlySingleSource(media) && isTypeMatching) {
			const source = findSourceAsset(media);
			const key = source?.entity?.key;
			if (key) {
				const buffer = await this.storage.getFromStorage(key);
				return {
					buffer,
					mimeType: source.entity?.mimeType ?? "application/octet-stream",
					fileKey: key,
				};
			}
		}

		// Render on demand locally
		let renderResult;
		let mimeType = "application/octet-stream";
		if (type === "Image" || type === "SVG") {
			renderResult = await this.renderer.renderVirtualImage(media, options);
			mimeType = "image/png";
		} else {
			renderResult = await this.renderer.renderVirtualMedia(
				media,
				type,
				options,
			);
			if (type === "Video") {
				mimeType = "video/mp4";
			} else if (type === "Audio") {
				mimeType = "audio/mp3";
			} else if (type === "LUT") {
				mimeType = "application/x-cube";
			}
		}

		if (renderResult.fileKey) {
			const buffer = await this.storage.getFromStorage(renderResult.fileKey);
			return {
				buffer,
				mimeType,
				fileKey: renderResult.fileKey,
			};
		}

		throw new Error(`Failed to resolve ${type} to buffer`);
	}

	private getMimeType(fileKey: string, type: string): string {
		const lowerKey = fileKey.toLowerCase();
		if (lowerKey.endsWith(".jpg") || lowerKey.endsWith(".jpeg")) {
			return "image/jpeg";
		} else if (lowerKey.endsWith(".png")) {
			return "image/png";
		} else if (lowerKey.endsWith(".webp")) {
			return "image/webp";
		} else if (lowerKey.endsWith(".svg")) {
			return "image/svg+xml";
		} else if (lowerKey.endsWith(".gif")) {
			return "image/gif";
		} else if (lowerKey.endsWith(".mp4")) {
			return "video/mp4";
		} else if (lowerKey.endsWith(".webm")) {
			return "video/webm";
		} else if (lowerKey.endsWith(".mp3") || lowerKey.endsWith(".mpeg")) {
			return "audio/mpeg";
		} else if (lowerKey.endsWith(".wav")) {
			return "audio/wav";
		} else if (lowerKey.endsWith(".srt") || lowerKey.endsWith(".txt")) {
			return "text/plain";
		}

		if (type === "Audio") {
			return "audio/mpeg";
		} else if (type === "Video") {
			return "video/mp4";
		} else if (type === "Caption") {
			return "text/plain";
		}
		return "image/png";
	}

	private async ensureUrlAccessible(
		url: string,
		fileKey: string,
		type: string,
	): Promise<string> {
		if (
			url &&
			(url.startsWith("http://") || url.startsWith("https://")) &&
			!url.includes("localhost")
		) {
			return url;
		}

		if (this.aiProvider) {
			try {
				const fal = this.aiProvider.getFal();
				const buffer = await this.storage.getFromStorage(fileKey);
				const mimeType = this.getMimeType(fileKey, type);
				const falUrl = await fal.storage.upload(
					new Blob([buffer], { type: mimeType }),
					{
						lifecycle: { expiresIn: "1d" },
					},
				);
				if (falUrl) {
					return falUrl;
				}
			} catch {
				// Fallback to data URL if fal upload fails or credentials are not provided
			}
		}

		return this.ensureDataUrlIfNeeded(url, fileKey, type);
	}

	private async ensureDataUrlIfNeeded(
		url: string,
		fileKey: string,
		type: string,
	): Promise<string> {
		if (!url || !url.startsWith("file://")) {
			return url;
		}

		try {
			const buffer = await this.storage.getFromStorage(fileKey);
			const mimeType = this.getMimeType(fileKey, type);
			return `data:${mimeType};base64,${buffer.toString("base64")}`;
		} catch {
			return url;
		}
	}

	async resolveToUrl(
		media: VirtualMediaData,
		type: any,
		options?: any,
	): Promise<any> {
		if (type === "Caption") {
			if (hasOnlySingleSource(media)) {
				const source = findSourceAsset(media);
				const key = source?.entity?.key;
				if (key) {
					const rawUrl = this.storage.getPublicUrl(key);
					const url = await this.ensureUrlAccessible(rawUrl, key, type);
					return { url, fileKey: key };
				}
			}
			const srtText = (media.operation as any)?.srtText;
			if (typeof srtText === "string" && srtText.trim().length > 0) {
				const tempKey = `temp/resolve_caption_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.srt`;
				await this.storage.uploadToStorage(
					Buffer.from(srtText),
					tempKey,
					"text/plain",
					"assets",
				);
				const rawUrl = this.storage.getPublicUrl(tempKey);
				const url = await this.ensureUrlAccessible(rawUrl, tempKey, type);
				return { url, fileKey: tempKey };
			}
			throw new Error("Caption not found in storage or operation config");
		}

		const isTypeMatching =
			!media.operation?.dataType || media.operation.dataType === type;
		if (hasOnlySingleSource(media) && isTypeMatching) {
			const source = findSourceAsset(media);
			const key = source?.entity?.key;
			if (key) {
				const rawUrl = this.storage.getPublicUrl(key);
				const url = await this.ensureUrlAccessible(rawUrl, key, type);
				return { url, fileKey: key };
			}
		}

		let renderResult;
		if (type === "Image" || type === "SVG") {
			renderResult = await this.renderer.renderVirtualImage(media, options);
		} else {
			renderResult = await this.renderer.renderVirtualMedia(
				media,
				type,
				options,
			);
		}
		if (renderResult.fileKey) {
			const rawUrl = this.storage.getPublicUrl(renderResult.fileKey);
			const url = await this.ensureUrlAccessible(
				rawUrl,
				renderResult.fileKey,
				type,
			);
			return { url, fileKey: renderResult.fileKey };
		}

		throw new Error(`Failed to resolve ${type} to URL`);
	}

	async resolveToAsset(
		media: VirtualMediaData,
		type: any,
		options?: any,
	): Promise<any> {
		if (type === "Caption" && hasOnlySingleSource(media)) {
			const source = findSourceAsset(media);
			if (source && source.entity?.key) {
				return { virtualMedia: createVirtualMedia(source, type) };
			}
		}

		const bufferResult = await this.resolveToBuffer(media, type, options);
		const filename = `resolved_${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${type === "Audio" ? "mp3" : type === "Image" ? "png" : type === "LUT" ? "cube" : "mp4"}`;

		const { asset } = await createFileAsset(this.prisma, {
			userId: "cli-user",
			buffer: bufferResult.buffer,
			filename,
			mimeType: bufferResult.mimeType,
		});

		return {
			virtualMedia: createVirtualMedia({ entity: asset }, type),
			fileKey: asset.key,
			assetId: asset.id,
		};
	}
}
