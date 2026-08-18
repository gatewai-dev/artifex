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
	SELECTIVE_COLOR_OUTPUT_TYPE_MAP,
	SelectiveColorNodeConfigSchema,
	type SelectiveColorResult,
} from "../shared/index.js";

@injectable()
export class SelectiveColorProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<SelectiveColorResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem =
				resolver.input("Input").item() || resolver.input().item();

			if (!inputItem) {
				return {
					success: false,
					error: "Missing Input",
				};
			}

			const config = SelectiveColorNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "SelectiveColor processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = SELECTIVE_COLOR_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");

			const output = appendOperation(inputMedia, {
				op: "SelectiveColor",
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType,
			});

			const outputHandle = data.handles.find(
				(h: { nodeId: string; type: string; id: string; label?: string }) =>
					h.nodeId === node.id && (h.type === "Output" || h.label === "Result"),
			);
			if (!outputHandle)
				return { success: false, error: "Output handle is missing" };

			const newResult = {
				selectedOutputIndex: 0 as const,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: output,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			} as unknown as SelectiveColorResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "SelectiveColor processing failed",
			};
		}
	}
}
