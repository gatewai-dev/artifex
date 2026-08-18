import { createVirtualMedia } from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { injectable } from "inversify";
import {
	NoiseGeneratorNodeConfigSchema,
	type NoiseGeneratorResult,
} from "../shared/index.js";

@injectable()
export class NoiseGeneratorProcessor implements NodeProcessor {
	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<NoiseGeneratorResult>
	> {
		try {
			const config = NoiseGeneratorNodeConfigSchema.parse(node.config);

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
						op: "NoiseGenerator",
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
			} as unknown as NoiseGeneratorResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "NoiseGenerator processing failed",
			};
		}
	}
}
export default NoiseGeneratorProcessor;
