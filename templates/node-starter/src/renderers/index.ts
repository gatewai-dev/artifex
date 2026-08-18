import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { starterAudioProcessor } from "./audio-processor.js";
import { StarterWebGPURenderer } from "./webgpu-renderer.js";

/**
 * Node Renderer Definition
 *
 * Exposes WebGPU visual and audio renderers for real-time and offline headless execution.
 */
export default defineRenderer({
	WebGPURenderer: StarterWebGPURenderer,
	audioProcessor: starterAudioProcessor,
});
