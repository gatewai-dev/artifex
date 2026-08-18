import { DataType } from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { injectable } from "inversify";
import { NumberNodeConfigSchema } from "../metadata.js";
import type { NumberNodeResult } from "../shared/index.js";

@injectable()
export class NumberProcessor implements NodeProcessor {
	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<NumberNodeResult>
	> {
		const value = NumberNodeConfigSchema.parse(node.config).value ?? 0;

		const outputHandle = data.handles.find(
			(h) => h.nodeId === node.id && h.type === "Output",
		);

		return {
			success: true,
			newResult: {
				outputs: [
					{
						items: [
							{
								type: DataType.Number,
								data: value,
								outputHandleId: outputHandle?.id,
							},
						],
					},
				],
				selectedOutputIndex: 0,
			},
		};
	}
}
