import {
	appendOperation,
	createVirtualMedia,
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
	PAINT_OUTPUT_TYPE_MAP,
	PaintNodeConfigSchema,
	type PaintResult,
} from "../shared/index.js";

@injectable()
export class PaintProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<PaintResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			const paintConfig = PaintNodeConfigSchema.parse(node.config);

			const outputHandles = data.handles.filter(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			const imageOutputHandle = outputHandles.find((h) =>
				h.label.includes("Result"),
			);
			const maskOutputHandle = outputHandles.find((h) =>
				h.label.includes("Mask"),
			);

			if (!imageOutputHandle || !maskOutputHandle) {
				return { success: false, error: "Missing required output handles" };
			}

			const inputMedia = inputItem?.data as VirtualMediaData | undefined;

			const activeMeta = inputMedia ? getActiveMediaMetadata(inputMedia) : null;

			const metadata = activeMeta ?? {
				width: paintConfig.width,
				height: paintConfig.height,
			};

			const outputType = inputItem?.type
				? (PAINT_OUTPUT_TYPE_MAP[inputItem.type] ?? "Image")
				: "Image";

			const imageOutputData = inputMedia
				? appendOperation(inputMedia, {
						op: "Paint",
						...paintConfig,
						mode: "image",
						metadata,
						dataType: outputType,
					})
				: createVirtualMedia(
						{
							operation: {
								op: "Paint",
								...paintConfig,
								mode: "media",
								dataType: outputType,
								metadata,
							},
							metadata,
							children: [],
						},
						outputType,
					);

			const maskOutputData = inputMedia
				? appendOperation(inputMedia, {
						op: "Paint",
						...paintConfig,
						mode: "mask",
						dataType: "Image",
						metadata,
					})
				: createVirtualMedia(
						{
							operation: {
								op: "Paint",
								...paintConfig,
								dataType: "Image",
								mode: "mask",
								metadata,
							},
							metadata,
							children: [],
						},
						"Image",
					);

			const newResult: PaintResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: imageOutputData,
								outputHandleId: imageOutputHandle.id,
							},
							{
								type: "Image",
								data: maskOutputData,
								outputHandleId: maskOutputHandle.id,
							},
						],
					},
				],
			};

			return { success: true, newResult: newResult as PaintResult };
		} catch (err: unknown) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Paint processing failed",
			};
		}
	}
}
