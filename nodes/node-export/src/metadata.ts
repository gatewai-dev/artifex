import { getActiveMediaMetadata } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	DEFAULT_RENDER_COST,
	type ExportConfig,
	ExportNodeConfigSchema,
	ExportResultSchema,
} from "./shared/index.js";

export { ExportNodeConfigSchema, ExportResultSchema, DEFAULT_RENDER_COST };

export const metadata = defineMetadata({
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
		if (config?.format === "mp3" || config?.format === "svg") {
			return null;
		}

		if (!inputs) return null;

		// Robustly find the first valid video, audio or image input
		const inputData = Object.values(inputs).find((input) => {
			const item = input as any;
			const dataType = item?.operation?.dataType || item?.dataType;
			const mimeType = item?.entity?.mimeType || item?.mimeType;

			const isAudio = dataType === "Audio" || mimeType?.startsWith("audio/");
			const isVideo = dataType === "Video" || mimeType?.startsWith("video/");
			const isGif = dataType === "GIF" || mimeType === "image/gif";
			const isImage = dataType === "Image" || mimeType?.startsWith("image/");
			const isSvg = dataType === "SVG" || mimeType === "image/svg+xml";
			const isLottie = dataType === "Lottie";
			const isCaption = dataType === "Caption";

			return (
				isAudio || isVideo || isGif || isImage || isSvg || isLottie || isCaption
			);
		}) as any;

		if (!inputData) return null;

		const dataType = inputData?.operation?.dataType || inputData?.dataType;
		const mimeType = inputData?.entity?.mimeType || inputData?.mimeType;

		const isVideo = dataType === "Video" || mimeType?.startsWith("video/");
		const isGif = dataType === "GIF" || mimeType === "image/gif";
		if (!isVideo && !isGif) return null;

		const width = inputData.operation
			? (getActiveMediaMetadata(inputData)?.width ??
				inputData.metadata?.width ??
				inputData.entity?.width)
			: (inputData.entity?.width ?? inputData.metadata?.width);
		const height = inputData.operation
			? (getActiveMediaMetadata(inputData)?.height ??
				inputData.metadata?.height ??
				inputData.entity?.height)
			: (inputData.entity?.height ?? inputData.metadata?.height);

		const errors: Record<string, string> = {};

		if (width != null && height != null) {
			if (width % 2 !== 0 || height % 2 !== 0) {
				errors.dimensions = `Video dimensions must be even numbers. Current size: ${width}x${height}. Please adjust the dimensions to be even numbers (e.g. by cropping or resizing) before exporting.`;
			}
		}

		if (config?.format === "gif") {
			const durationMs =
				inputData?.metadata?.durationMs ??
				inputData?.durationMs ??
				(inputData?.entity?.duration != null
					? inputData.entity.duration * 1000
					: inputData?.duration != null
						? inputData.duration * 1000
						: null);
			if (durationMs != null && durationMs > 15000) {
				errors.gifDuration = `GIF export is limited to a maximum duration of 15 seconds. Current duration: ${(durationMs / 1000).toFixed(1)}s.`;
			}
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},
	handles: {
		inputs: [
			{
				dataTypes: [
					"Text",
					"Image",
					"Video",
					"Audio",
					"SVG",
					"LUT",
					"Caption",
					"Lottie",
					"GIF",
				],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [],
	},
	pricing(_cfg: ExportConfig, inputs: Record<string, any> | undefined) {
		if (!inputs) return 0;

		// Robustly find the first valid video, audio or gif input
		const inputData = Object.values(inputs).find((input) => {
			const item = input as any;
			const dataType = item?.operation?.dataType || item?.dataType;
			const mimeType = item?.entity?.mimeType || item?.mimeType;

			const isAudio = dataType === "Audio" || mimeType?.startsWith("audio/");
			const isVideo = dataType === "Video" || mimeType?.startsWith("video/");
			const isGif = dataType === "GIF" || mimeType === "image/gif";

			return isAudio || isVideo || isGif;
		}) as any;

		if (!inputData) return 0;

		const dataType = inputData?.operation?.dataType || inputData?.dataType;
		const mimeType = inputData?.entity?.mimeType || inputData?.mimeType;

		const isAudio = dataType === "Audio" || mimeType?.startsWith("audio/");
		const isVideo = dataType === "Video" || mimeType?.startsWith("video/");
		const isGif = dataType === "GIF" || mimeType === "image/gif";
		// Only price Video, Audio, and GIF
		if (!isVideo && !isAudio && !isGif) return 0;

		const durationMs =
			inputData?.metadata?.durationMs ??
			inputData?.durationMs ??
			(inputData?.entity?.duration != null
				? inputData.entity.duration * 1000
				: inputData?.duration != null
					? inputData.duration * 1000
					: null);
		if (durationMs == null || durationMs <= 0) return 0;

		const durationSeconds = durationMs / 1000;

		let tokens = 0;

		if (isAudio && !isVideo && !isGif) {
			const audioTokensPerSecond = 0.002;
			tokens = durationSeconds * audioTokensPerSecond + 0.1;
		} else {
			// Video pricing
			const width =
				inputData?.metadata?.width ?? inputData?.entity?.width ?? 1920;
			const height =
				inputData?.metadata?.height ?? inputData?.entity?.height ?? 1080;
			const fps = inputData?.metadata?.fps ?? inputData?.entity?.fps ?? 30;

			const pixels = width * height;
			const hdPixels = 1920 * 1080;
			const pixelRatio = Math.max(0.1, pixels / hdPixels);

			// Resolution scales non-linearly for rendering cost. 4K is ~8x cost of HD.
			const resolutionMultiplier = pixelRatio ** 1.5;
			const fpsMultiplier = fps / 30;

			// Base rate: ~0.02 tokens per second for HD video (30fps)
			const baseTokensPerSecond = 0.02;

			tokens =
				durationSeconds *
				baseTokensPerSecond *
				resolutionMultiplier *
				fpsMultiplier;

			// Base lambda invocation cost + buffer
			tokens += 0.5;
		}

		// Minimum 5 tokens for Video/Audio
		return Math.max(DEFAULT_RENDER_COST, Number(tokens.toFixed(1)) * 2);
	},
});
