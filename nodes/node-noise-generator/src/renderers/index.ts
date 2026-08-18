import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { NoiseWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: NoiseWebGPURenderer,
});
export { NoiseWebGPURenderer };
