import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ShapeGeneratorNodeConfig,
	ShapeGeneratorNodeConfigSchema,
	ShapeGeneratorResultSchema,
	shapeGeneratorConfig,
} from "./shared/index.js";

export {
	type ShapeGeneratorNodeConfig,
	ShapeGeneratorNodeConfigSchema,
	ShapeGeneratorResultSchema,
};

export const metadata = defineMetadata({
	type: "ShapeGenerator",
	displayName: "Vector Shape",
	description:
		"Renders crisp, resolution-independent parametric shapes (rectangles with per-corner radii, ellipses, regular polygons, stars, arrows, custom SVG bezier paths) with solid/gradient fills, strokes, and dash patterns",
	category: "Media",
	subcategory: undefined,
	configSchema: ShapeGeneratorNodeConfigSchema,
	resultSchema: ShapeGeneratorResultSchema,
	configHandles: shapeGeneratorConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	handles: {
		inputs: [],
		outputs: [
			{
				dataTypes: ["SVG", "Image"],
				label: "Result",
				order: 0,
				description: "Parametric vector shape output",
			},
		],
	},
	defaultConfig: {
		shapeType: "Rectangle",
		width: 500,
		height: 500,
		radiusTL: 24,
		radiusTR: 24,
		radiusBR: 24,
		radiusBL: 24,
		polygonSides: 5,
		starPoints: 5,
		starInnerRadius: 0.5,
		arrowHeadWidth: 40,
		arrowHeadLength: 40,
		arrowShaftWidth: 20,
		fillType: "solid",
		fillColor: "#3b82f6",
		gradientEndColor: "#1d4ed8",
		gradientAngle: 0,
		strokeColor: "#ffffff",
		strokeWidth: 0,
		strokeLineCap: "round",
		strokeLineJoin: "round",
		strokeDashOffset: 0,
		rotation: 0,
		opacity: 1,
		outputType: "SVG",
	} as ShapeGeneratorNodeConfig,
});
