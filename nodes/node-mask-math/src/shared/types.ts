import type { SignalData } from "@gatewai.studio/core";
import type { MaskMathNodeConfig } from "./config.js";

export interface MaskMathOp extends Partial<MaskMathNodeConfig> {
	op: "MaskMath";
	maskBMedia?: unknown;
	radiusHandleId?: string | null;
	thresholdHandleId?: string | null;
	clampMinHandleId?: string | null;
	clampMaxHandleId?: string | null;
	opacity?: number;
	inputs?: Record<
		string,
		{
			connectionValid: boolean;
			outputItem: {
				type: string;
				data: unknown;
			} | null;
		}
	>;
}

export type MaskMathSignalData = SignalData & { nodeId?: string };
