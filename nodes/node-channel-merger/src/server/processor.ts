import {
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
	CHANNEL_MERGER_OUTPUT_TYPE_MAP,
	ChannelMergerNodeConfigSchema,
	type ChannelMergerResult,
} from "../shared/index.js";

@injectable()
export class ChannelMergerProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ChannelMergerResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const ch1Item = resolver.input("Channel 1").item();
			const ch2Item = resolver.input("Channel 2").item();
			const ch3Item = resolver.input("Channel 3").item();
			const ch4Item = resolver.input("Channel 4").item();

			if (!ch1Item || !ch2Item || !ch3Item) {
				return {
					success: false,
					error:
						"ChannelMerger requires Channel 1, Channel 2, and Channel 3 inputs",
				};
			}

			const config = ChannelMergerNodeConfigSchema.parse(node.config);
			const ch1Media = ch1Item.data as VirtualMediaData;
			const ch2Media = ch2Item.data as VirtualMediaData;
			const ch3Media = ch3Item.data as VirtualMediaData;
			const ch4Media = (ch4Item?.data as VirtualMediaData) ?? null;

			if (!ch1Media) {
				return {
					success: false,
					error: "ChannelMerger processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(ch1Media);
			const outputType = CHANNEL_MERGER_OUTPUT_TYPE_MAP[ch1Item.type];
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
			const finalMeta = activeMeta ?? ch1Media.metadata;

			const output: VirtualMediaData = {
				metadata: finalMeta ?? {},
				operation: {
					op: "ChannelMerger",
					...config,
					dataType: finalOutputType,
					inputs,
					channel1Media: ch1Media,
					channel2Media: ch2Media,
					channel3Media: ch3Media,
					channel4Media: ch4Media,
				},
				children: [ch1Media],
			};

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
			} as unknown as ChannelMergerResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "ChannelMerger processing failed",
			};
		}
	}
}
