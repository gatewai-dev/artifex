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
	MASK_MATH_OUTPUT_TYPE_MAP,
	MaskMathNodeConfigSchema,
	type MaskMathResult,
} from "../shared/index.js";

@injectable()
export class MaskMathProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<MaskMathResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const maskAItem =
				resolver.input("Mask A").item() || resolver.input().item();
			const maskBItem = resolver.input("Mask B").item();

			if (!maskAItem) {
				return {
					success: false,
					error: "Missing Mask A input",
				};
			}

			const config = MaskMathNodeConfigSchema.parse(node.config);
			const inputMedia = maskAItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "MaskMath processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = MASK_MATH_OUTPUT_TYPE_MAP[maskAItem.type];
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
				op: "MaskMath",
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs,
				maskBMedia: maskBItem?.data,
			});

			const outputHandle = data.handles.find(
				(h: { nodeId: string; type: string; id: string }) =>
					h.nodeId === node.id && h.type === "Output",
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
			} as unknown as MaskMathResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "MaskMath processing failed",
			};
		}
	}
}
