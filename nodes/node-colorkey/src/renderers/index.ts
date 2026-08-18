import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { ColorKeyWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: ColorKeyWebGPURenderer,
});
