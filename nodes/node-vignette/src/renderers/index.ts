import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { VignetteWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: VignetteWebGPURenderer,
});
