import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { ResizerScalerWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: ResizerScalerWebGPURenderer,
});
