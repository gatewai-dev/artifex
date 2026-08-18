import { createVirtualMedia } from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { injectable } from "inversify";
import {
	generateShapeSvg,
	generateShapeSvgDataUrl,
	ShapeGeneratorNodeConfigSchema,
	type ShapeGeneratorResult,
} from "../shared/index.js";

@injectable()
export class ShapeGeneratorProcessor implements NodeProcessor {
	constructor() {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<ShapeGeneratorResult>
	> {
		try {
			const config = ShapeGeneratorNodeConfigSchema.parse(node.config);

			const metadata = {
				width: config.width,
				height: config.height,
				durationMs: 0,
			};

			const outputType = config.outputType ?? "SVG";
			const svgContent = generateShapeSvg(config);
			const svgDataUrl = generateShapeSvgDataUrl(config);

			const output = createVirtualMedia(
				{
					operation: {
						op: "source",
						...config,
						svgContent,
						svgDataUrl,
						dataType: outputType,
						metadata,
					},
					metadata,
					children: [],
				},
				outputType,
			);

			const outputHandle =
				data.handles?.find(
					(h) => h.nodeId === node.id && h.type === "Output",
				) || data.handles?.[0];

			const outputHandleId = outputHandle?.id || "output";

			const newResult: ShapeGeneratorResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: output,
								outputHandleId,
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
						: "ShapeGenerator processing failed",
			};
		}
	}
}
export default ShapeGeneratorProcessor;
