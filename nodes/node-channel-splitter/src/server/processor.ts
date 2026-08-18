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
	CHANNEL_SPLITTER_OUTPUT_TYPE_MAP,
	ChannelSplitterNodeConfigSchema,
	type ChannelSplitterResult,
} from "../shared/index.js";

@injectable()
export class ChannelSplitterProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ChannelSplitterResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem =
				resolver.input("Input").item() || resolver.input().item();

			if (!inputItem) {
				return {
					success: false,
					error: "Missing input",
				};
			}

			const config = ChannelSplitterNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "ChannelSplitter processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = CHANNEL_SPLITTER_OUTPUT_TYPE_MAP[inputItem.type];
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

			const finalMeta = activeMeta ?? inputMedia.metadata;

			const ch1Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 0,
				metadata: finalMeta,
				dataType: outputType,
				inputs,
			});

			const ch2Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 1,
				metadata: finalMeta,
				dataType: outputType,
				inputs,
			});

			const ch3Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 2,
				metadata: finalMeta,
				dataType: outputType,
				inputs,
			});

			const ch4Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 3,
				metadata: finalMeta,
				dataType: outputType,
				inputs,
			});

			const outputHandles = data.handles.filter(
				(h: { nodeId: string; type: string; label: string; id: string }) =>
					h.nodeId === node.id && h.type === "Output",
			);

			const ch1Handle = outputHandles.find((h: { label: string }) =>
				h.label.includes("Channel 1"),
			);
			const ch2Handle = outputHandles.find((h: { label: string }) =>
				h.label.includes("Channel 2"),
			);
			const ch3Handle = outputHandles.find((h: { label: string }) =>
				h.label.includes("Channel 3"),
			);
			const ch4Handle = outputHandles.find((h: { label: string }) =>
				h.label.includes("Channel 4"),
			);

			const newResult = {
				selectedOutputIndex: 0 as const,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: ch1Output,
								outputHandleId: ch1Handle?.id,
							},
							{
								type: outputType,
								data: ch2Output,
								outputHandleId: ch2Handle?.id,
							},
							{
								type: outputType,
								data: ch3Output,
								outputHandleId: ch3Handle?.id,
							},
							{
								type: outputType,
								data: ch4Output,
								outputHandleId: ch4Handle?.id,
							},
						],
					},
				],
			} as unknown as ChannelSplitterResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "ChannelSplitter processing failed",
			};
		}
	}
}
