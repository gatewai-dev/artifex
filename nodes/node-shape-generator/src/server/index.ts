import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { ShapeGeneratorProcessor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: ShapeGeneratorProcessor,
});
export { ShapeGeneratorProcessor };
