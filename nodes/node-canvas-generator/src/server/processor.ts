import { createVirtualMedia } from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { injectable } from "inversify";
import {
	CanvasGeneratorNodeConfigSchema,
	type CanvasGeneratorResult,
} from "../shared/index.js";

@injectable()
export class CanvasGeneratorProcessor implements NodeProcessor {
	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<CanvasGeneratorResult>
	> {
		try {
			const config = CanvasGeneratorNodeConfigSchema.parse(node.config);
			const metadata = {
				width: config.width,
				height: config.height,
				durationMs: 0,
			};

			const output = createVirtualMedia(
				{
					operation: {
						op: "CanvasGenerator",
						...config,
						dataType: "Image",
						metadata,
					},
					metadata,
					children: [],
				},
				"Image",
			);

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);

			if (!outputHandle) {
				return { success: false, error: "Output handle is missing" };
			}

			const newResult: CanvasGeneratorResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: "Image",
								data: output,
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
					err instanceof Error
						? err.message
						: "CanvasGenerator processing failed",
			};
		}
	}
}
