import { DataType } from "@gatewai.studio/core";
import type {
	BackendNodeProcessorCtx,
	BackendNodeProcessorResult,
	NodeProcessor,
} from "@gatewai.studio/node-sdk/server";
import { buildWGSLSignalFn } from "@gatewai.studio/webgpu-renderers";
import { injectable } from "inversify";
import { SignalNodeConfigSchema } from "../metadata.js";
import type { SignalNodeResult } from "../shared/index.js";

@injectable()
export class SignalProcessor implements NodeProcessor {
	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<SignalNodeResult>
	> {
		const config = SignalNodeConfigSchema.parse(node.config);

		const outputHandle = data.handles.find(
			(h) => h.nodeId === node.id && h.type === "Output",
		);

		const params: Record<string, number> = {};
		for (const p of config.fnParams ?? []) {
			params[p.name] = p.defaultValue;
		}

		const fnRes = buildWGSLSignalFn(config, node.id);

		const resultData = {
			type: "generator" as const,
			nodeId: node.id,
			func: "custom" as const,
			amplitude: config.amplitude,
			frequency: config.frequency,
			phase: config.phase,
			offset: config.offset,
			params,
			customWGSL: fnRes.wgsl,
			signalFnName: fnRes.name,
			fnParams: config.fnParams,
			outputType: fnRes.outputType,
		};

		return {
			success: true,
			newResult: {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: DataType.Signal,
								data: resultData,
								outputHandleId: outputHandle?.id,
							},
						],
					},
				],
			},
		};
	}
}
