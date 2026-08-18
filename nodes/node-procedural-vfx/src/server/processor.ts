import { createVirtualMedia } from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { injectable } from "inversify";
import {
	ProceduralVFXNodeConfigSchema,
	type ProceduralVFXResult,
} from "../shared/index.js";

@injectable()
export class ProceduralVFXProcessor implements NodeProcessor {
	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ProceduralVFXResult>
	> {
		try {
			const config = ProceduralVFXNodeConfigSchema.parse(node.config);

			const isVideo = config.outputType === "Video";
			const metadata = {
				width: config.width,
				height: config.height,
				durationMs: isVideo ? config.durationMs : 0,
				fps: isVideo ? config.fps : undefined,
			};

			const finalOutputType = isVideo ? "Video" : "Image";

			const output = createVirtualMedia(
				{
					operation: {
						op: "ProceduralVFX",
						...config,
						dataType: finalOutputType,
						metadata,
					},
					metadata,
					children: [],
				},
				finalOutputType,
			);

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);

			if (!outputHandle) {
				return { success: false, error: "Output handle is missing" };
			}

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
			} as unknown as ProceduralVFXResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "ProceduralVFX processing failed",
			};
		}
	}
}
export default ProceduralVFXProcessor;
