import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { FilmGrainWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: FilmGrainWebGPURenderer,
});
