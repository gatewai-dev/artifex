import type { VirtualMediaData } from "@gatewai.studio/core";
import {
	appendOperation,
	getActiveMediaMetadata,
	getMediaType,
} from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import type { KenBurnsResult } from "../shared/index.js";
import {
	KenBurnsConfigSchema,
	performKenBurnsProcessing,
} from "../shared/index.js";

@injectable()
export class KenBurnsProcessor implements NodeProcessor {
	@inject(TOKENS.GRAPH_RESOLVERS) private graph!: IGraphResolverService;

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<KenBurnsResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);

			const inputItem = resolver.input("Input").item();
			const inputMedia = inputItem?.data as VirtualMediaData;

			if (!inputMedia) {
				return { success: false, error: "Missing Video, Image, or SVG input" };
			}

			const config = KenBurnsConfigSchema.parse(node.config);

			// Perform the core Ken Burns operation using shared logic
			const output = performKenBurnsProcessing(inputMedia, config, {
				getActiveMediaMetadata,
				appendOperation,
				getMediaType,
			});

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);

			if (!outputHandle) {
				return { success: false, error: "Output handle is missing" };
			}
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [
						{
							items: [
								{
									type: "Video",
									data: output,
									outputHandleId: outputHandle.id,
								},
							],
						},
					],
				},
			};
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error ? err.message : "Ken Burns processing failed",
			};
		}
	}
}
