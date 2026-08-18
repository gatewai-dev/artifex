import { type DataType, getActiveMediaMetadata } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	ExtractLutNodeConfigSchema,
	ExtractLutNodeResultSchema,
	extractLutConfig,
} from "./shared/index.js";

export { ExtractLutNodeResultSchema };

export const metadata = defineMetadata({
	type: "ExtractLUT",
	displayName: "Extract LUT",
	description: "Extract a 3D LUT from two frames",
	category: "Media",
	isTerminal: false,
	isTransient: true,
	configSchema: ExtractLutNodeConfigSchema,
	resultSchema: ExtractLutNodeResultSchema,
	configHandles: extractLutConfig.configHandles,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	handles: {
		inputs: [
			{
				dataTypes: ["Image"],
				required: true,
				label: "Source Frame",
				order: 0,
			},
			{
				dataTypes: ["Image"],
				required: true,
				label: "Graded Frame",
				order: 1,
			},
		],
		outputs: [
			{
				dataTypes: ["LUT"],
				label: "LUT",
				order: 0,
			},
		],
	},
	defaultConfig: {
		strategy: "deterministic",
		samplePoints: 150,
	},
	validation: (config, inputs) => {
		const values = Object.values(inputs ?? {});
		const mediaInputs = values.filter((input) => {
			if (input?.operation) return true;
			if (
				input?.entity?.mimeType?.startsWith("image/") ||
				input?.entity?.mimeType?.startsWith("video/")
			)
				return true;
			return false;
		});

		if (config?.strategy === "deterministic" && mediaInputs.length === 2) {
			const m1 = mediaInputs[0];
			const m2 = mediaInputs[1];

			const w1 = m1.operation
				? getActiveMediaMetadata(m1)?.width
				: m1.entity?.width;
			const h1 = m1.operation
				? getActiveMediaMetadata(m1)?.height
				: m1.entity?.height;

			const w2 = m2.operation
				? getActiveMediaMetadata(m2)?.width
				: m2.entity?.width;
			const h2 = m2.operation
				? getActiveMediaMetadata(m2)?.height
				: m2.entity?.height;

			if (w1 && h1 && w2 && h2 && (w1 !== w2 || h1 !== h2)) {
				return {
					dimensions: `Error: Source and Graded Frame dimensions do not match (${w1}x${h1} vs ${w2}x${h2}). Deterministic extraction works best on the exact same frame.`,
				};
			}
		}

		return null;
	},
});
