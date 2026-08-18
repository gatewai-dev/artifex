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
	RESIZER_SCALER_OUTPUT_TYPE_MAP,
	ResizerScalerNodeConfigSchema,
	type ResizerScalerResult,
	resolveTargetDimensions,
} from "../shared/index.js";

@injectable()
export class ResizerScalerProcessor implements NodeProcessor {
	private graph: IGraphResolverService;

	constructor(@inject(TOKENS.GRAPH_RESOLVERS) graph: IGraphResolverService) {
		this.graph = graph;
	}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ResizerScalerResult>
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

			const config = ResizerScalerNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Resizer / Scaler processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = RESIZER_SCALER_OUTPUT_TYPE_MAP[inputItem.type];
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

			const targetDims = resolveTargetDimensions(config);

			const finalMeta = {
				...(activeMeta ?? {}),
				width: targetDims.width,
				height: targetDims.height,
			};

			const output = appendOperation(inputMedia, {
				op: "ResizerScaler" as unknown as "Blur",
				...config,
				metadata: finalMeta,
				dataType: outputType as unknown as "Image" | "Video" | "GIF",
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
								type: outputType as unknown as "Image" | "Video" | "GIF",
								data: output,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			} as unknown as ResizerScalerResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Resizer / Scaler processing failed",
			};
		}
	}
}
