import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { KenBurnsWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: KenBurnsWebGPURenderer,
});
