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
import type { VideoToAudioResult } from "../shared/index.js";

@injectable()
export class VideoToAudioProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<VideoToAudioResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return {
					success: false,
					error: "Missing video input",
				};
			}

			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Video to Audio failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);

			// Append VideoToAudio operation transforming visual type to Audio
			const output = appendOperation(inputMedia, {
				op: "VideoToAudio",
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: "Audio",
			});

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			if (!outputHandle) {
				return { success: false, error: "Output handle is missing" };
			}

			const newResult: VideoToAudioResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: "Audio",
								data: output,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			};

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Video to Audio failed",
			};
		}
	}
}
