import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { PatchHealProcessor } from "./processor.js";

export { PatchHealProcessor };

export default defineNode(metadata, {
	backendProcessor: PatchHealProcessor,
});
