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
	CROP_OUTPUT_TYPE_MAP,
	CropNodeConfigSchema,
	type CropResult,
} from "../shared/config.js";
import { calculateCropArea } from "../shared/index.js";

@injectable()
export class CropProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<BackendNodeProcessorResult<CropResult>> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return { success: false, error: "Missing input" };
			}

			const config = CropNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Crop processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			if (!activeMeta || !activeMeta.width || !activeMeta.height) {
				return { success: false, error: "No active media metadata found" };
			}
			const sw = activeMeta.width;
			const sh = activeMeta.height;
			const {
				leftPercentage,
				topPercentage,
				widthPercentage,
				heightPercentage,
			} = calculateCropArea(config);
			const cw = Math.max(1, Math.round((widthPercentage / 100) * sw));
			const ch = Math.max(1, Math.round((heightPercentage / 100) * sh));

			const outputType = CROP_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");

			const resultOutput = appendOperation(inputMedia, {
				op: "Crop",
				cropType: config.cropType,
				pathPoints: config.pathPoints,
				leftPercentage,
				topPercentage,
				widthPercentage,
				roundness: config.roundness,
				heightPercentage,
				mode: "cropped",
				metadata: {
					...activeMeta,
					width: cw,
					height: ch,
				},
				dataType: outputType,
			});

			const restOutput = appendOperation(inputMedia, {
				op: "Crop",
				cropType: config.cropType,
				pathPoints: config.pathPoints,
				leftPercentage,
				topPercentage,
				roundness: config.roundness,
				widthPercentage,
				heightPercentage,
				mode: "rest",
				metadata: activeMeta,
				dataType: outputType,
			});

			const outputHandles = data.handles.filter(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			const resultOutputHandle = outputHandles.find((h) =>
				h.label.includes("Cropped"),
			);
			const restOutputHandle = outputHandles.find((h) =>
				h.label.includes("Rest"),
			);

			if (!resultOutputHandle || !restOutputHandle) {
				return { success: false, error: "Missing required output handles" };
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
							{
								type: outputType,
								data: restOutput,
								outputHandleId: restOutputHandle.id,
							},
						],
					},
				],
			} as unknown as CropResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Crop processing failed",
			};
		}
	}
}
