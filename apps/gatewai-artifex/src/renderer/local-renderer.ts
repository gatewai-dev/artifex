import type { VirtualMediaData } from "@gatewai.studio/core";
import { HeadlessMediaRenderer } from "@gatewai.studio/renderer";
import type {
	IMediaRendererResult,
	IMediaRendererService,
	MediaRenderOptions,
} from "@gatewai.studio/server-utils";
import { inject, injectable } from "inversify";
import pLimit from "p-limit";
import "@gatewai.studio/renderer/offscreen-gl-polyfill";
import { TOKENS } from "@gatewai.studio/server-utils";

@injectable()
export class LocalMediaRendererService implements IMediaRendererService {
	private limit: ReturnType<typeof pLimit>;

	constructor(@inject(TOKENS.STORAGE) private storage: any) {
		const limitEnv = process.env.GATEWAI_CONCURRENT_RENDERS;
		let limitVal = limitEnv ? parseInt(limitEnv, 10) : 2;
		if (Number.isNaN(limitVal) || limitVal <= 0) {
			limitVal = 2;
		}
		this.limit = pLimit(limitVal);
	}

	async renderComposition(
		options: MediaRenderOptions,
	): Promise<IMediaRendererResult> {
		return this.limit(async () => {
			const virtualMedia = options.inputProps.virtualMedia;
			if (!virtualMedia) throw new Error("Missing virtualMedia in inputProps");

			const renderer = new HeadlessMediaRenderer();
			const renderResult = await renderer.renderVideo(virtualMedia, {
				codec: options.codec,
				audioCodec: options.audioCodec,
			});

			const key = options.fileKey ?? `renders/render-${Date.now()}.mp4`;
			await this.storage.uploadFileToStorage(renderResult.filePath, key);
			await renderResult.cleanup();

			return { fileKey: key };
		});
	}

	async renderStillComposition(
		options: MediaRenderOptions,
	): Promise<IMediaRendererResult> {
		return this.limit(async () => {
			const virtualMedia = options.inputProps.virtualMedia;
			if (!virtualMedia) throw new Error("Missing virtualMedia in inputProps");

			const renderer = new HeadlessMediaRenderer();
			const buffer = await renderer.renderImage(
				virtualMedia,
				options.frame ?? 0,
			);

			const key = options.fileKey ?? `renders/render-${Date.now()}.png`;
			await this.storage.uploadToStorage(buffer, key);

			return { fileKey: key };
		});
	}

	async renderLutComposition(
		options: MediaRenderOptions,
	): Promise<IMediaRendererResult> {
		return this.limit(async () => {
			const virtualMedia = options.inputProps.virtualMedia;
			if (!virtualMedia) throw new Error("Missing virtualMedia in inputProps");

			const renderer = new HeadlessMediaRenderer();
			const buffer = await renderer.renderLut(virtualMedia, options.frame ?? 0);

			const key = options.fileKey ?? `renders/render-${Date.now()}.cube`;
			await this.storage.uploadToStorage(buffer, key);

			return { fileKey: key };
		});
	}

	async renderVirtualMedia(
		media: VirtualMediaData,
		_type: "Video" | "Audio" | "Image" | "GIF" | "LUT",
		options?: any,
	) {
		if (_type === "LUT") {
			return this.renderVirtualLut(media, options);
		}
		return this.renderComposition({
			...options,
			inputProps: { virtualMedia: media },
		});
	}

	async renderVirtualImage(media: VirtualMediaData, options?: any) {
		return this.renderStillComposition({
			...options,
			inputProps: { virtualMedia: media },
			frame: options?.frame ?? 0,
		});
	}

	async renderVirtualLut(media: VirtualMediaData, options?: any) {
		return this.renderLutComposition({
			...options,
			inputProps: { virtualMedia: media },
			frame: options?.frame ?? 0,
		});
	}

	async renderVirtualAudio(media: VirtualMediaData, options?: any) {
		return this.renderVirtualMedia(media, "Audio", options);
	}
}
