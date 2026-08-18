import type { NodeProcessorParams, NodeResult } from "@gatewai.studio/core";
import type { IBrowserProcessor } from "./types.js";

export class BrowserPassthroughProcessor implements IBrowserProcessor {
	process(params: NodeProcessorParams): Promise<NodeResult | null> {
		return Promise.resolve(params.node.result);
	}
}
