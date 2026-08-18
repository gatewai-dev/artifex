import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { StarterWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: StarterWebGPURenderer,
});
