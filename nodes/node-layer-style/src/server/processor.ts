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
	computeLayerStylePadding,
	LAYER_STYLE_OUTPUT_TYPE_MAP,
	LayerStyleNodeConfigSchema,
	type LayerStyleResult,
} from "../shared/index.js";

@injectable()
export class LayerStyleProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<LayerStyleResult>
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

			const config = LayerStyleNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "LayerStyle processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = LAYER_STYLE_OUTPUT_TYPE_MAP[inputItem.type];
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

			const padding = computeLayerStylePadding(config);
			const baseMeta = activeMeta ?? inputMedia.metadata;
			const finalOutputType = outputType;
			const finalMeta = baseMeta
				? {
						...baseMeta,
						width: baseMeta.width
							? baseMeta.width + padding.padX * 2
							: baseMeta.width,
						height: baseMeta.height
							? baseMeta.height + padding.padY * 2
							: baseMeta.height,
					}
				: undefined;

			const output = appendOperation(inputMedia, {
				op: "LayerStyle",
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
			} as unknown as LayerStyleResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "LayerStyle processing failed",
			};
		}
	}
}
