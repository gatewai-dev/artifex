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
	MeshWarpNodeConfigSchema,
	type MeshWarpResult,
	WARP_OUTPUT_TYPE_MAP,
} from "../shared/config.js";
import { createUniformGrid } from "../shared/utils.js";

@injectable()
export class MeshWarpProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<MeshWarpResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return { success: false, error: "Missing input" };
			}

			const config = MeshWarpNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Mesh warp processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			if (!activeMeta || !activeMeta.width || !activeMeta.height) {
				return { success: false, error: "No active media metadata found" };
			}

			const outputType = WARP_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");

			const cols = config.cols ?? 3;
			const rows = config.rows ?? 3;
			const points =
				config.points && config.points.length === cols * rows
					? config.points
					: createUniformGrid(cols, rows);

			const resultOutput = appendOperation(inputMedia, {
				op: "MeshWarp",
				cols,
				rows,
				points,
				metadata: activeMeta,
				dataType: outputType,
			});

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
			} as unknown as MeshWarpResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "Mesh warp processing failed",
			};
		}
	}
}
