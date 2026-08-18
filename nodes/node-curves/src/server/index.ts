import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { CurvesProcessor } from "./processor.js";

export const serverNode = defineNode(metadata, {
	backendProcessor: CurvesProcessor,
});

export default serverNode;
