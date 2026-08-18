import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { delayAudioProcessor } from "./audio-processor.js";

export default defineRenderer({
	audioProcessor: delayAudioProcessor,
});
