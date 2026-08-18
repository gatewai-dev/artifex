import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { CornerPinWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: CornerPinWebGPURenderer,
});
