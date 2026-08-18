import { getFingerprint, type VirtualMediaData } from "@gatewai.studio/core";
import {

	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import {
	ExtractLutNodeConfigSchema,
	type ExtractLutNodeResult,
} from "../shared/index.js";

/** Must match browser processor key exactly */
function extractLutRuntimeKey(nodeId: string, fingerprint?: string): string {
	return fingerprint
		? `runtime://lut/extract-lut-${nodeId}-${fingerprint}`
		: `runtime://lut/extract-lut-${nodeId}`;
}

@injectable()
export class ExtractLutProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ExtractLutNodeResult>
	> {
		try {
			const config = ExtractLutNodeConfigSchema.parse(node.config ?? {});

			// ExtractLUT is a runtime-only transient node — it produces a LUT
			// by reading GPU pixel data in the browser renderer. On the server
			// side we simply pass through the VirtualMediaData so the graph can
			// be resolved. The actual GPU extraction happens in the WebGPU renderer.
			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);

			if (!outputHandle) {
				return { success: false, error: "Output handle is missing" };
			}

			const resolver = this.graph.forNode(node, data);
			const sourceItem = resolver.input("Source Frame").item();
			const targetItem = resolver.input("Graded Frame").item();

			const sourceMedia = sourceItem?.data as VirtualMediaData | undefined;
			const targetMedia = targetItem?.data as VirtualMediaData | undefined;

			const samplePoints = config.samplePoints ?? 150;

			// Create a placeholder VirtualMediaData for the LUT output (without lutUrl first)
			const placeholderMedia: VirtualMediaData = {
				metadata: {},
				operation: {
					op: "ExtractLUT",
					dataType: "LUT",
					nodeId: node.id,
					strategy: config.strategy,
					samplePoints,
				},
				children: sourceMedia && targetMedia ? [sourceMedia, targetMedia] : [],
			};

			const fingerprint = getFingerprint(placeholderMedia);
			const lutUrl = extractLutRuntimeKey(node.id, fingerprint);

			const finalMedia: VirtualMediaData = {
				...placeholderMedia,
				operation: {
					...placeholderMedia.operation,
					lutUrl,
				},
			};

			const newResult: ExtractLutNodeResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: "LUT",
								data: finalMedia,
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
				error:
					err instanceof Error ? err.message : "ExtractLUT processing failed",
			};
		}
	}
}
