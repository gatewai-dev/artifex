import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { injectable } from "inversify";
import { CaptionEditorNodeConfigSchema } from "../metadata.js";
import type { CaptionEditorResult } from "../shared/index.js";
import { getSrtDurationMs } from "../shared/srt-utils.js";

@injectable()
export class CaptionEditorProcessor implements NodeProcessor {
	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<CaptionEditorResult>
	> {
		const config = CaptionEditorNodeConfigSchema.parse(node.config);
		const srtText = config.content ?? "";
		const durationMs = getSrtDurationMs(srtText);

		const outputHandle = data.handles.find(
			(h) => h.nodeId === node.id && h.type === "Output",
		);

		return {
			success: true,
			newResult: {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: "Caption" as const,
								data: {
									metadata: {
										durationMs: durationMs || undefined,
									},
									operation: {
										op: "source",
										srtText,
										dataType: "Caption" as const,
									},
									children: [],
								},
								outputHandleId: outputHandle?.id,
							},
						],
					},
				],
			},
		};
	}
}
