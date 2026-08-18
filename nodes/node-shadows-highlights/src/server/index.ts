import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { ShadowsHighlightsProcessor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: ShadowsHighlightsProcessor,
});
