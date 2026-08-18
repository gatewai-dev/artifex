import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { CanvasGeneratorWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: CanvasGeneratorWebGPURenderer,
});
export { CanvasGeneratorWebGPURenderer };
