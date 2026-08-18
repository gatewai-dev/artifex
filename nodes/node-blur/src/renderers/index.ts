import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { BlurWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: BlurWebGPURenderer,
});
