import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { fadeAudioProcessor } from "./audio-processor.js";

export default defineRenderer({
	audioProcessor: fadeAudioProcessor,
});
