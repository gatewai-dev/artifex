import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { CurvesWebGPURenderer } from "./webgpu-renderer.js";

export const rendererNode = defineRenderer({
	WebGPURenderer: CurvesWebGPURenderer,
});

export default rendererNode;
