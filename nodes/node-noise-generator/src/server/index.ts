import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { NoiseGeneratorProcessor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: NoiseGeneratorProcessor,
});
export { NoiseGeneratorProcessor };
