import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { LutWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: LutWebGPURenderer,
});
