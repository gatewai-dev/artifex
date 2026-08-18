import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { SelectiveColorProcessor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: SelectiveColorProcessor,
});
