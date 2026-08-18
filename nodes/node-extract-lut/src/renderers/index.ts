import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { ExtractLutWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: ExtractLutWebGPURenderer,
});
