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
import { MediaCutConfigSchema } from "../shared/config.js";
import type { MediaCutResult } from "../shared/index.js";

@injectable()
export class MediaCutProcessor implements NodeProcessor {
	@inject(TOKENS.GRAPH_RESOLVERS) private graph!: IGraphResolverService;

	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<MediaCutResult>
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

			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "MediaCut processing failed - No input data",
				};
			}

			const inputType = inputItem.type as "Video" | "Audio" | "Lottie" | "GIF";

			const config = MediaCutConfigSchema.parse(node.config);
			const activeMeta = getActiveMediaMetadata(inputMedia);

			if (!activeMeta) {
				return { success: false, error: "Unable to read media metadata" };
			}

			const durationMs = activeMeta.durationMs ?? 0;
			if (durationMs <= 0) {
				return { success: false, error: "Media duration is unknown or zero" };
			}

			// Resolve segments from config
			const segments = config.segments || [];

			if (segments.length === 0) {
				// No segments defined? Just return the original input
				// This is better for robustness when users are still configuring the node.
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
										type: inputType,
										data: inputMedia,
										outputHandleId: outputHandle.id,
									},
								],
							},
						],
					} as unknown as MediaCutResult,
				};
			}

			const resolvedSegments = segments.map((s) => ({
				startSec: Math.max(0, s.startSec),
				endSec:
					s.endSec != null
						? Math.min(s.endSec, durationMs / 1000)
						: durationMs / 1000,
			}));

			// Validate segment ranges
			if (resolvedSegments.some((s) => (s.endSec ?? 0) <= s.startSec)) {
				return {
					success: false,
					error: "One or more cut ranges are invalid",
				};
			}

			const totalDurationMs = resolvedSegments.reduce(
				(sum, s) => sum + ((s.endSec ?? 0) - s.startSec) * 1000,
				0,
			);

			const output = appendOperation(inputMedia, {
				op: "MediaCut",
				timeline: {
					segments: resolvedSegments,
				},
				metadata: { ...activeMeta, durationMs: totalDurationMs },
				dataType: inputMedia.operation.dataType,
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
									type: inputType,
									data: output,
									outputHandleId: outputHandle.id,
								},
							],
						},
					],
				} as unknown as MediaCutResult,
			};
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "MediaCut processing failed",
			};
		}
	}
}
