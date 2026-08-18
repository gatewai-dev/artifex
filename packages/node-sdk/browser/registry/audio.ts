import type { AudioProcessor } from "../types.js";

class AudioProcessorRegistry {
	private processors = new Map<string, AudioProcessor>();

	register(opType: string, processor: AudioProcessor): void {
		this.processors.set(opType, processor);
	}

	get(opType: string): AudioProcessor | null {
		return this.processors.get(opType) || null;
	}
}

const GLOBAL_AUDIO_KEY = Symbol.for("gatewai.audioRegistry");
export const audioRegistry: AudioProcessorRegistry = (() => {
	const g = globalThis as any;
	if (!g[GLOBAL_AUDIO_KEY]) {
		g[GLOBAL_AUDIO_KEY] = new AudioProcessorRegistry();
	}
	return g[GLOBAL_AUDIO_KEY];
})();
