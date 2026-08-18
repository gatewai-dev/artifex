import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { MeshWarpWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: MeshWarpWebGPURenderer,
});
