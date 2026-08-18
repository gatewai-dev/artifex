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
	DISPLACEMENT_OUTPUT_TYPE_MAP,
	DisplacementMapNodeConfigSchema,
	type DisplacementMapResult,
} from "../shared/index.js";

@injectable()
export class DisplacementMapProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<DisplacementMapResult>
	> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item();
			const mapItem = resolver.input("Map").item();

			if (!inputItem) {
				return {
					success: false,
					error: "Missing input",
				};
			}

			if (!mapItem) {
				return {
					success: false,
					error: "Missing displacement map input",
				};
			}

			const config = DisplacementMapNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Displacement map processing failed - No input data",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = DISPLACEMENT_OUTPUT_TYPE_MAP[inputItem.type];
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
			const finalMeta = activeMeta ?? inputMedia.metadata;

			const output: VirtualMediaData = {
				metadata: finalMeta ?? {},
				operation: {
					op: "DisplacementMap",
					...config,
					dataType: finalOutputType,
					inputs,
					mapMedia: mapItem.data,
				},
				children: [inputMedia],
			};

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
			} as unknown as DisplacementMapResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Displacement map processing failed",
			};
		}
	}
}
