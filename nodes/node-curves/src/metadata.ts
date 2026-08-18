import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type CurvesNodeConfig,
	CurvesNodeConfigSchema,
	CurvesResultSchema,
} from "./shared/index.js";

export { type CurvesNodeConfig, CurvesNodeConfigSchema, CurvesResultSchema };

export const defaultCurvesConfig: CurvesNodeConfig = {
	curveType: "rgb",
	master: [
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
	],
	red: [
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
	],
	green: [
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
	],
	blue: [
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
	],
	hueVsHue: [
		{ x: 0, y: 0.5 },
		{ x: 1, y: 0.5 },
	],
	hueVsSat: [
		{ x: 0, y: 1.0 },
		{ x: 1, y: 1.0 },
	],
	lumVsSat: [
		{ x: 0, y: 1.0 },
		{ x: 1, y: 1.0 },
	],
	satVsSat: [
		{ x: 0, y: 1.0 },
		{ x: 1, y: 1.0 },
	],
};

export const metadata = defineMetadata({
	type: "Curves",
	displayName: "Color Curves",
	description:
		"Map tonal range and color balance using monotonic spline curves",
	category: "Media",
	subcategory: undefined,
	configSchema: CurvesNodeConfigSchema,
	resultSchema: CurvesResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "GIF", "Lottie"],
				required: true,
				label: "Input",
				order: 0,
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "SVG", "Video", "GIF", "Lottie"],
				label: "Result",
				order: 0,
			},
		],
	},
	defaultConfig: defaultCurvesConfig,
});
export default metadata;
