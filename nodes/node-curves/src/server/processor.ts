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
	CURVES_OUTPUT_TYPE_MAP,
	CurvesNodeConfigSchema,
	type CurvesResult,
} from "../shared/index.js";

@injectable()
export class CurvesProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<CurvesResult>
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

			const config = CurvesNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Curves processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = CURVES_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) {
				return {
					success: false,
					error: `Curves processing failed - Unsupported input data type: ${inputItem.type}`,
				};
			}

			const output = appendOperation(inputMedia, {
				op: "Curves",
				nodeId: node.id,
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType,
			});

			const outputHandle = data.handles.find(
				(h) =>
					h.nodeId === node.id && (h.type === "Output" || h.label === "Result"),
			);
			if (!outputHandle) {
				return { success: false, error: "Output handle is missing" };
			}

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
			} as unknown as CurvesResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Curves processing failed",
			};
		}
	}
}
