import type { VirtualMediaData } from "@gatewai.studio/core";
import { appendOperation, getActiveMediaMetadata } from "@gatewai.studio/core";
import {

	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import { ExtractFrameConfigSchema } from "../shared/config.js";
import type { ExtractFrameResult } from "../shared/index.js";

@injectable()
export class ExtractFrameProcessor implements NodeProcessor {
	@inject(TOKENS.GRAPH_RESOLVERS) private graph!: IGraphResolverService;

	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ExtractFrameResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return { success: false, error: "Missing input" };
			}

			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "ExtractFrame processing failed - No input data",
				};
			}

			const config = ExtractFrameConfigSchema.parse(node.config);
			const activeMeta = getActiveMediaMetadata(inputMedia);

			if (!activeMeta) {
				return { success: false, error: "Unable to read media metadata" };
			}

			const fps = activeMeta.fps ?? 30;
			const durationMs = activeMeta.durationMs ?? 0;
			const totalFrames =
				durationMs > 0 ? Math.ceil((durationMs / 1000) * fps) : 0;

			// Clamp frame to valid range
			const frame =
				totalFrames > 0
					? Math.min(config.frame, totalFrames - 1)
					: config.frame;

			const output = appendOperation(inputMedia, {
				op: "ExtractFrame",
				frame,
				metadata: {
					width: activeMeta.width,
					height: activeMeta.height,
					fps: null,
					durationMs: null,
				},
				dataType: "Image",
			});

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			if (!outputHandle)
				return { success: false, error: "Output handle is missing" };

			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [
						{
							items: [
								{
									type: "Image",
									data: output,
									outputHandleId: outputHandle.id,
								},
							],
						},
					],
				} as unknown as ExtractFrameResult,
			};
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "ExtractFrame processing failed",
			};
		}
	}
}
