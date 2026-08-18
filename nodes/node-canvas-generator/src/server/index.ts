import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { CanvasGeneratorProcessor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: CanvasGeneratorProcessor,
});
export { CanvasGeneratorProcessor };
