import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { CaptionEditorProcessor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: CaptionEditorProcessor,
});
