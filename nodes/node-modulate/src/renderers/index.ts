import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { ModulateWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: ModulateWebGPURenderer,
});
