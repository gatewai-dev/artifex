import { resolveMediaSourceUrl } from "@gatewai.studio/client-utils";
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
	LUT_OUTPUT_TYPE_MAP,
	LutNodeConfigSchema,
	type LutResult,
} from "../shared/index.js";

@injectable()
export class LutProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<BackendNodeProcessorResult<LutResult>> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item();
			const lutItem = resolver.input("Lut").item();

			if (!inputItem) {
				return {
					success: false,
					error: "Missing media input",
				};
			}

			if (!lutItem) {
				return {
					success: false,
					error: "Missing LUT input",
				};
			}

			const config = LutNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "LUT processing failed - No input media data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = LUT_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");

			const connected = resolver.inputs().allWithHandle();
			const inputs: Record<
				string,
				{ connectionValid: boolean; outputItem: any }
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
			const finalMeta = activeMeta ?? inputMedia.metadata;

			const lutData = lutItem.data as VirtualMediaData;
			const lutUrl =
				resolveMediaSourceUrl(lutData) ||
				(lutData?.operation as { lutUrl?: string })?.lutUrl;

			const output = appendOperation(inputMedia, {
				op: "ApplyLUT",
				lutUrl,
				...config,
				metadata: finalMeta,
				dataType: finalOutputType,
				inputs,
			});

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
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
			} as unknown as LutResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "LUT processing failed",
			};
		}
	}
}
