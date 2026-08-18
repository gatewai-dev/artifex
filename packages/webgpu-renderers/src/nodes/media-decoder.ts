import {
	AudioBufferSink,
	CanvasSink,
	type Input,
	type VideoSample,
	VideoSampleSink,
	type WrappedAudioBuffer,
	type WrappedCanvas,
} from "mediabunny";
import { inputStore } from "../input-store.js";

/**
 * Base class for media decoders (Video/Audio) that manages shared Input resources
 * and provides robust, cached iterator access with seek-ahead invalidation.
 */
abstract class BaseMediaDecoder<T> {
	protected input: Input | null = null;
	protected initPromise: Promise<void> | null = null;
	protected iterator: AsyncGenerator<T, void, unknown> | null = null;
	protected iteratorStartTimestamp = -1;
	protected currentFetchId = 0;
	protected fetchLock: Promise<void> = Promise.resolve();
	protected destroyed = false;

	constructor(
		protected url: string,
		protected isHeadless: boolean,
	) {}

	async init(): Promise<void> {
		if (this.input) return;
		if (this.initPromise) return this.initPromise;

		this.destroyed = false;

		this.initPromise = (async () => {
			try {
				const input = await inputStore.acquire(this.url);
				if (this.destroyed) {
					inputStore.release(this.url);
				} else {
					this.input = input;
				}
			} catch (err) {
				this.initPromise = null;
				throw err;
			}
		})();

		return this.initPromise;
	}

	destroy(): void {
		this.destroyed = true;
		void this.iterator?.return();
		if (this.input) {
			inputStore.release(this.url);
			this.input = null;
		}
		this.initPromise = null;
		this.onDestroy();
	}

	protected abstract onDestroy(): void;
	protected abstract startIterator(
		timestampSec: number,
		fetchId: number,
	): Promise<void>;
}

export interface VideoFrameData {
	width: number;
	height: number;
	canvas?: HTMLCanvasElement | OffscreenCanvas;
	buffer?: Uint8Array;
}

export class VideoDecoder extends BaseMediaDecoder<
	WrappedCanvas | VideoSample
> {
	private canvasSink: CanvasSink | null = null;
	private videoSampleSink: VideoSampleSink | null = null;
	private currentFrame: WrappedCanvas | null = null;
	private nextFrame: WrappedCanvas | null = null;
	private currentSample: VideoSample | null = null;
	private nextSample: VideoSample | null = null;
	private headlessQueue: VideoSample[] = [];
	private isDecoding = false;
	private nextRequest: {
		timestampSec: number;
		resolve: (value: VideoFrameData | null) => void;
		reject: (err: any) => void;
	} | null = null;

	private pushHeadlessQueue(sample: VideoSample) {
		const index = this.headlessQueue.findIndex(
			(s) => s.timestamp > sample.timestamp,
		);
		if (index === -1) {
			this.headlessQueue.push(sample);
		} else {
			this.headlessQueue.splice(index, 0, sample);
		}
	}

	private async fillHeadlessQueue(fetchId: number): Promise<void> {
		if (!this.iterator) return;
		while (this.headlessQueue.length < 2) {
			const result = await this.iterator.next();
			if (this.currentFetchId !== fetchId) {
				if (result.value && typeof (result.value as any).close === "function") {
					(result.value as any).close();
				}
				return;
			}
			if (result.done || !result.value) break;
			this.pushHeadlessQueue(result.value as VideoSample);
		}
	}

	protected onDestroy(): void {
		this.currentSample?.close();
		this.nextSample?.close();
		for (const sample of this.headlessQueue) {
			sample.close();
		}
		this.headlessQueue = [];
		this.canvasSink = null;
		this.videoSampleSink = null;
		this.currentSample = null;
		this.nextSample = null;
	}

	protected async startIterator(
		timestampSec: number,
		fetchId: number,
	): Promise<void> {
		if (!this.canvasSink) return;

		void this.iterator?.return();
		this.iterator = this.canvasSink.canvases(timestampSec);

		const first = await this.iterator.next();
		if (this.currentFetchId !== fetchId) return;
		this.currentFrame = (first.value as WrappedCanvas) ?? null;

		const second = await this.iterator.next();
		if (this.currentFetchId !== fetchId) return;
		this.nextFrame = (second.value as WrappedCanvas) ?? null;

		this.iteratorStartTimestamp = timestampSec;
	}

	protected async startIteratorHeadless(
		timestampSec: number,
		fetchId: number,
	): Promise<void> {
		if (!this.videoSampleSink) return;

		void this.iterator?.return();
		for (const sample of this.headlessQueue) {
			sample.close();
		}
		this.headlessQueue = [];

		const seekTime = Math.max(0, timestampSec - 0.1);
		this.iterator = this.videoSampleSink.samples(seekTime);

		await this.fillHeadlessQueue(fetchId);
		if (this.currentFetchId !== fetchId) return;

		this.iteratorStartTimestamp = timestampSec;
	}

	async getFrame(timestampSec: number): Promise<VideoFrameData | null> {
		await this.init();
		if (this.destroyed || !this.input) return null;

		if (this.isDecoding) {
			if (this.nextRequest) {
				this.nextRequest.resolve(null);
			}
			return new Promise<VideoFrameData | null>((resolve, reject) => {
				this.nextRequest = { timestampSec, resolve, reject };
			});
		}

		return this.executeDecode(timestampSec);
	}

	private async executeDecode(
		timestampSec: number,
	): Promise<VideoFrameData | null> {
		this.isDecoding = true;
		try {
			return await this.performDecode(timestampSec);
		} finally {
			this.isDecoding = false;
			if (this.nextRequest) {
				const req = this.nextRequest;
				this.nextRequest = null;
				this.executeDecode(req.timestampSec)
					.then(req.resolve)
					.catch(req.reject);
			}
		}
	}

	private async performDecode(
		timestampSec: number,
	): Promise<VideoFrameData | null> {
		try {
			this.currentFetchId++;
			const fetchId = this.currentFetchId;

			if (this.isHeadless) {
				if (!this.videoSampleSink) {
					if (this.destroyed || !this.input) return null;
					const track = await this.input.getPrimaryVideoTrack();
					if (!track) return null;
					this.videoSampleSink = new VideoSampleSink(track);
				}

				const eps = 0.0001;
				const forwardSeekThreshold = 1.0;
				const backwardSeekThreshold = 0.01;

				if (
					!this.iterator ||
					timestampSec < this.iteratorStartTimestamp - eps ||
					(this.headlessQueue.length > 0 &&
						timestampSec <
							this.headlessQueue[0].timestamp - backwardSeekThreshold) ||
					(this.headlessQueue.length > 0 &&
						timestampSec - this.headlessQueue[0].timestamp >
							forwardSeekThreshold)
				) {
					void this.iterator?.return();
					this.iterator = null;
					await this.startIteratorHeadless(timestampSec, fetchId);
					if (this.currentFetchId !== fetchId || this.destroyed || !this.input)
						return null;
				}

				while (true) {
					await this.fillHeadlessQueue(fetchId);
					if (this.currentFetchId !== fetchId || this.destroyed || !this.input)
						return null;

					if (this.headlessQueue.length >= 2) {
						const next = this.headlessQueue[1];
						if (next.timestamp <= timestampSec + eps) {
							const old = this.headlessQueue.shift();
							old?.close();
							continue;
						}
					}
					break;
				}

				const currentSample = this.headlessQueue[0];
				if (!currentSample) return null;

				const width = currentSample.displayWidth;
				const height = currentSample.displayHeight;
				const buffer = new Uint8Array(width * height * 4);
				await currentSample.copyTo(buffer, { format: "RGBA" });
				if (this.currentFetchId !== fetchId || this.destroyed || !this.input)
					return null;
				return { width, height, buffer };
			}

			if (!this.canvasSink) {
				if (this.destroyed || !this.input) return null;
				const track = await this.input.getPrimaryVideoTrack();
				if (!track) return null;
				this.canvasSink = new CanvasSink(track, { poolSize: 3, alpha: true });
			}

			const eps = 0.0001;
			const forwardSeekThreshold = 1.0;
			const backwardSeekThreshold = 0.01;

			if (
				!this.iterator ||
				timestampSec < this.iteratorStartTimestamp - eps ||
				(this.currentFrame &&
					timestampSec < this.currentFrame.timestamp - backwardSeekThreshold) ||
				(this.currentFrame &&
					timestampSec - this.currentFrame.timestamp > forwardSeekThreshold)
			) {
				void this.iterator?.return();
				this.iterator = null;
				await this.startIterator(timestampSec, fetchId);
				if (this.currentFetchId !== fetchId || this.destroyed || !this.input)
					return null;
			}

			while (this.nextFrame && this.nextFrame.timestamp <= timestampSec + eps) {
				this.currentFrame = this.nextFrame;
				this.nextFrame = null;
				if (this.iterator) {
					const result = await this.iterator.next();
					if (this.currentFetchId !== fetchId || this.destroyed || !this.input)
						return null;
					this.nextFrame = (result.value as WrappedCanvas) ?? null;
				}
			}

			if (!this.currentFrame) return null;
			const canvas = this.currentFrame.canvas;
			return { width: canvas.width, height: canvas.height, canvas };
		} catch (err: any) {
			if (
				err?.name === "InputDisposedError" ||
				err?.message?.includes("disposed") ||
				this.destroyed ||
				!this.input
			) {
				return null;
			}
			throw err;
		}
	}
}

export class AudioDecoder extends BaseMediaDecoder<WrappedAudioBuffer> {
	private audioSink: AudioBufferSink | null = null;

	protected onDestroy(): void {
		this.audioSink = null;
	}

	protected async startIterator(
		timestampSec: number,
		_fetchId: number,
	): Promise<void> {
		if (!this.audioSink) return;
		void this.iterator?.return();
		this.iterator = this.audioSink.buffers(timestampSec);
		this.iteratorStartTimestamp = timestampSec;
	}

	async *getBuffers(
		timestampSec: number,
	): AsyncGenerator<WrappedAudioBuffer, void, unknown> {
		try {
			await this.init();
			if (this.destroyed || !this.input) return;

			if (!this.audioSink) {
				const track = await this.input.getPrimaryAudioTrack();
				if (!track) return;
				this.audioSink = new AudioBufferSink(track);
			}

			const eps = 0.05; // 50ms tolerance for audio sync jumps
			if (
				!this.iterator ||
				Math.abs(timestampSec - this.iteratorStartTimestamp) > eps
			) {
				this.currentFetchId++;
				await this.startIterator(timestampSec, this.currentFetchId);
			}

			const fetchId = this.currentFetchId;
			if (!this.iterator) return;

			for await (const wrapped of this.iterator) {
				if (this.currentFetchId !== fetchId || this.destroyed || !this.input)
					break;
				this.iteratorStartTimestamp = wrapped.timestamp + wrapped.duration;
				yield wrapped;
			}
		} catch (err: any) {
			if (
				err?.name === "InputDisposedError" ||
				err?.message?.includes("disposed") ||
				this.destroyed ||
				!this.input
			) {
				return;
			}
			throw err;
		} finally {
			const fetchId = this.currentFetchId;
			if (this.currentFetchId === fetchId) {
				this.iterator = null;
			}
		}
	}
}

class MediaDecoderCache {
	private videoDecoders = new Map<string, VideoDecoder>();
	private audioDecoders = new Map<string, AudioDecoder>();
	private lastAccessed = new Map<string, number>();

	private touchKey(key: string) {
		this.lastAccessed.set(key, Date.now());
	}

	destroy(): void {
		for (const decoder of this.videoDecoders.values()) {
			try {
				decoder.destroy();
			} catch (_) {}
		}
		this.videoDecoders.clear();

		for (const decoder of this.audioDecoders.values()) {
			try {
				decoder.destroy();
			} catch (_) {}
		}
		this.audioDecoders.clear();
		this.lastAccessed.clear();
	}

	private prune(maxAgeMs = 300000) {
		const now = Date.now();
		for (const [key, lastTime] of this.lastAccessed.entries()) {
			if (now - lastTime > maxAgeMs) {
				const videoDecoder = this.videoDecoders.get(key);
				if (videoDecoder) {
					videoDecoder.destroy();
					this.videoDecoders.delete(key);
				}
				const audioDecoder = this.audioDecoders.get(key);
				if (audioDecoder) {
					audioDecoder.destroy();
					this.audioDecoders.delete(key);
				}
				this.lastAccessed.delete(key);
			}
		}
	}

	getVideo(url: string, isHeadless: boolean, nodeId?: string): VideoDecoder {
		const key = `${url}-${isHeadless}-${nodeId ?? "default"}`;
		let decoder = this.videoDecoders.get(key);
		if (!decoder) {
			decoder = new VideoDecoder(url, isHeadless);
			this.videoDecoders.set(key, decoder);
		}
		this.touchKey(key);
		this.prune();
		return decoder;
	}

	getAudio(url: string, nodeId?: string): AudioDecoder {
		const key = `${url}-${nodeId ?? "default"}`;
		let decoder = this.audioDecoders.get(key);
		if (!decoder) {
			decoder = new AudioDecoder(url, false);
			this.audioDecoders.set(key, decoder);
		}
		this.touchKey(key);
		this.prune();
		return decoder;
	}

	clearNode(nodeId: string) {
		for (const [key, decoder] of this.videoDecoders) {
			if (key.includes(nodeId)) {
				decoder.destroy();
				this.videoDecoders.delete(key);
				this.lastAccessed.delete(key);
			}
		}
		for (const [key, decoder] of this.audioDecoders) {
			if (key.includes(nodeId)) {
				decoder.destroy();
				this.audioDecoders.delete(key);
				this.lastAccessed.delete(key);
			}
		}
	}
}

export const mediaDecoderCache = new MediaDecoderCache();
