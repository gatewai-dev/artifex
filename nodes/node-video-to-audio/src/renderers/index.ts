import type { WebGPUNodeRenderer } from "@gatewai.studio/node-sdk/browser";
import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";

const VideoToAudioWebGPURenderer: WebGPUNodeRenderer = async () => {
	// No-op renderer: purposefully does not draw or invoke drawChild
	// to hide visual frames of the underlying video.
};

export default defineRenderer({
	WebGPURenderer: VideoToAudioWebGPURenderer,
});
