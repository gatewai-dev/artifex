import {

	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import { TextMergerNodeConfigSchema } from "../shared/config.js";
import type { TextMergerResult } from "../shared/index.js";
import { joinText } from "../shared/join-fn.js";

@injectable()
export class TextMergerServerProcessor implements NodeProcessor {
	@inject(TOKENS.GRAPH_RESOLVERS) private graph!: IGraphResolverService;

	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<TextMergerResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const textInputs = resolver.inputs().as("Text").allData<string>();

			const nodeConfig = TextMergerNodeConfigSchema.parse(node.config);
			const joinString = nodeConfig?.join ?? "\n";

			const texts = textInputs.map((v) => v);
			const merged = joinText(texts, joinString);

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			if (!outputHandle)
				return { success: false, error: "Output handle is missing." };

			const newResult: TextMergerResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: "Text",
								data: merged,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			};

			return { success: true, newResult };
		} catch (err: unknown) {
			if (err instanceof Error) {
				return { success: false, error: err.message };
			}
			return { success: false, error: "Text merger processing failed" };
		}
	}
}
