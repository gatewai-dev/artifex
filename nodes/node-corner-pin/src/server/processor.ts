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
	CORNER_PIN_OUTPUT_TYPE_MAP,
	CornerPinNodeConfigSchema,
	type CornerPinResult,
} from "../shared/config.js";
import { getDefaultPoints } from "../shared/utils.js";

@injectable()
export class CornerPinProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<CornerPinResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item();

			if (!inputItem) {
				return { success: false, error: "Missing required input" };
			}

			const config = CornerPinNodeConfigSchema.parse(node.config ?? {});
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Corner Pin processing failed - No input data",
				};
			}

			const inputMeta = getActiveMediaMetadata(inputMedia);
			if (!inputMeta || !inputMeta.width || !inputMeta.height) {
				return {
					success: false,
					error: "No active media metadata found for input",
				};
			}

			const children: VirtualMediaData[] = [inputMedia];
			const finalMeta = inputMeta;

			const outputType = CORNER_PIN_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");

			const points =
				config.points && config.points.length === 4
					? config.points
					: getDefaultPoints();

			const resultOutput = appendOperation(inputMedia, {
				op: "CornerPin",
				points,
				metadata: finalMeta,
				dataType: outputType,
			});

			// Pass both children to the renderer
			resultOutput.children = children;

			const outputHandles = data.handles.filter(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			const resultOutputHandle = outputHandles.find((h) =>
				h.label.includes("Warped"),
			);

			if (!resultOutputHandle) {
				return { success: false, error: "Missing required output handle" };
			}

			const newResult = {
				selectedOutputIndex: 0 as const,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: resultOutput,
								outputHandleId: resultOutputHandle.id,
							},
						],
					},
				],
			} as unknown as CornerPinResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "Corner Pin processing failed",
			};
		}
	}
}
