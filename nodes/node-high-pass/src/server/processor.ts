import {
	appendOperation,
	getActiveMediaMetadata,
	type VirtualMediaData,
} from "@gatewai.studio/core";
import {

	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import {
	HIGH_PASS_OUTPUT_TYPE_MAP,
	HighPassNodeConfigSchema,
	type HighPassResult,
} from "../shared/index.js";

@injectable()
export class HighPassProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<HighPassResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return {
					success: false,
					error: "Missing input",
				};
			}

			const config = HighPassNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "HighPass processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = HIGH_PASS_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");

			const connected = resolver.inputs().allWithHandle();
			const inputs: Record<
				string,
				{ connectionValid: boolean; outputItem: unknown }
			> = {};
			for (const { handle, value } of connected) {
				if (value) {
					inputs[handle.id] = {
						connectionValid: true,
						outputItem: value,
					};
				}
			}

			const finalOutputType = outputType;
			const finalMeta = activeMeta ?? inputMedia.metadata;

			const output = appendOperation(inputMedia, {
				op: "HighPass",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs,
			});

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			if (!outputHandle)
				return { success: false, error: "Output handle is missing" };

			const newResult = {
				selectedOutputIndex: 0 as const,
				outputs: [
					{
						items: [
							{
								type: finalOutputType,
								data: output,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			} as unknown as HighPassResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "HighPass processing failed",
			};
		}
	}
}
