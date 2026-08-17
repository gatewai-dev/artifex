import { _ as createOutputItemSchema, l as MultiOutputGenericSchema, p as VirtualMediaDataSchema, v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { c as configBuilder, n as ColorSchema } from "./dist-9Gzt6jDx.mjs";
import { n as generateShapeSvgDataUrl, t as generateShapeSvg } from "./svg-generator-D6aPz8b4-vuVUfA54.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-shape-generator/dist/metadata-BHEg9xIz.mjs
const ShapeTypeEnum = z$1.enum([
	"Rectangle",
	"Ellipse",
	"Polygon",
	"Star",
	"Arrow",
	"CustomPath"
]);
const FillTypeEnum = z$1.enum([
	"solid",
	"linear",
	"radial",
	"none"
]);
const StrokeLineCapEnum = z$1.enum([
	"butt",
	"round",
	"square"
]);
const StrokeLineJoinEnum = z$1.enum([
	"miter",
	"round",
	"bevel"
]);
const OutputTypeEnum = z$1.enum(["SVG", "Image"]);
const shapeGeneratorConfig = configBuilder().field("shapeType", ShapeTypeEnum.default("Rectangle"), {
	label: "Shape Type",
	description: "Parametric vector geometry type."
}).field("width", z$1.number().int().min(1).max(8192).default(500), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Width (px)",
	description: "Vector canvas bounding box width in pixels."
}).field("height", z$1.number().int().min(1).max(8192).default(500), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Height (px)",
	description: "Vector canvas bounding box height in pixels."
}).field("radiusTL", z$1.number().min(0).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Top-Left Radius (px)",
	description: "Top-left corner rounding for rectangular shapes."
}).field("radiusTR", z$1.number().min(0).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Top-Right Radius (px)",
	description: "Top-right corner rounding for rectangular shapes."
}).field("radiusBR", z$1.number().min(0).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Bottom-Right Radius (px)",
	description: "Bottom-right corner rounding for rectangular shapes."
}).field("radiusBL", z$1.number().min(0).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Bottom-Left Radius (px)",
	description: "Bottom-left corner rounding for rectangular shapes."
}).field("polygonSides", z$1.number().int().min(3).max(64).default(5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Polygon Sides",
	description: "Number of regular polygon vertices (3 for triangle, 5 for pentagon, etc.)."
}).field("starPoints", z$1.number().int().min(3).max(64).default(5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Star Points",
	description: "Number of star spikes (3 to 64)."
}).field("starInnerRadius", z$1.number().min(.01).max(.99).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Star Inner Radius Ratio",
	description: "Ratio of inner vertex radius to outer tip radius (0.01 to 0.99)."
}).field("arrowHeadWidth", z$1.number().min(0).default(40), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Arrow Head Width (px)",
	description: "Total cross-width of the arrowhead barb in pixels."
}).field("arrowHeadLength", z$1.number().min(0).default(40), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Arrow Head Length (px)",
	description: "Length of the arrowhead tip in pixels."
}).field("arrowShaftWidth", z$1.number().min(1).default(20), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Arrow Shaft Width (px)",
	description: "Thickness of the arrow stem in pixels."
}).field("customPath", z$1.string().optional(), {
	label: "Custom SVG Path Data",
	description: "Standard SVG path data string (e.g. 'M 10,10 L 90,90 ...')."
}).field("customPathScale", z$1.number().min(.01).max(100).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Path Scale",
	description: "Scale factor applied to custom SVG path geometry."
}).field("fillType", FillTypeEnum.default("solid"), {
	label: "Fill Type",
	description: "Fill style: solid color, linear gradient, radial gradient, or none."
}).field("fillColor", ColorSchema.default("#3b82f6"), {
	label: "Fill Color / Gradient Start",
	description: "Primary fill color or starting color for gradient fills."
}).field("gradientEndColor", ColorSchema.default("#1d4ed8"), {
	label: "Gradient End Color",
	description: "Secondary termination color for linear or radial gradient fills."
}).field("gradientAngle", z$1.number().default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Gradient Angle (deg)",
	description: "Linear gradient direction in degrees (0 = left to right, 90 = top to bottom)."
}).field("strokeColor", ColorSchema.default("#ffffff"), {
	label: "Stroke Color",
	description: "Color of the outline stroke."
}).field("strokeWidth", z$1.number().min(0).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Stroke Width (px)",
	description: "Width of outline border stroke in pixels (0 for no stroke)."
}).field("strokeDashArray", z$1.string().optional(), {
	label: "Stroke Dash Pattern",
	description: "Dash array pattern, e.g. '5,5' for dashed, '2,4' for dotted, or empty for solid."
}).field("strokeLineCap", StrokeLineCapEnum.default("round"), {
	label: "Stroke Line Cap",
	description: "Shape used at the ends of open subpaths (butt, round, square)."
}).field("strokeLineJoin", StrokeLineJoinEnum.default("round"), {
	label: "Stroke Line Join",
	description: "Shape used at the corners of paths (miter, round, bevel)."
}).field("strokeDashOffset", z$1.number().default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Stroke Dash Offset (px)",
	description: "Offset distance into the dash pattern in pixels."
}).field("rotation", z$1.number().default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Rotation (deg)",
	description: "Center rotation angle in degrees."
}).field("opacity", z$1.number().min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Opacity",
	description: "Overall shape layer opacity from 0.0 (transparent) to 1.0 (opaque)."
}).field("outputType", OutputTypeEnum.default("SVG"), {
	label: "Output Data Type",
	description: "Output format stream: SVG (vector) or Image (rasterized bitmap)."
}).build();
const ShapeGeneratorNodeConfigSchema = shapeGeneratorConfig.schema;
const ShapeGeneratorResultSchema = MultiOutputGenericSchema(z$1.union([createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema), createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema)]));
ShapeGeneratorNodeConfigSchema.extend({
	op: z$1.enum(["ShapeGenerator", "source"]).default("source"),
	svgContent: z$1.string().optional(),
	svgDataUrl: z$1.string().optional(),
	metadata: z$1.record(z$1.string(), z$1.unknown()).optional(),
	inputs: z$1.record(z$1.string(), z$1.object({
		connectionValid: z$1.boolean(),
		outputItem: z$1.object({
			type: z$1.string(),
			data: z$1.unknown()
		}).nullable().optional()
	})).optional()
});
const metadata = defineMetadata({
	type: "ShapeGenerator",
	displayName: "Vector Shape",
	description: "Renders crisp, resolution-independent parametric shapes (rectangles with per-corner radii, ellipses, regular polygons, stars, arrows, custom SVG bezier paths) with solid/gradient fills, strokes, and dash patterns",
	category: "Media",
	subcategory: void 0,
	configSchema: ShapeGeneratorNodeConfigSchema,
	resultSchema: ShapeGeneratorResultSchema,
	configHandles: shapeGeneratorConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["SVG", "Image"],
			label: "Result",
			order: 0,
			description: "Parametric vector shape output"
		}]
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
		starInnerRadius: .5,
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
		outputType: "SVG"
	}
});

//#endregion
//#region ../../nodes/node-shape-generator/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ShapeGeneratorProcessor = class ShapeGeneratorProcessor$1 {
	constructor() {}
	async process({ node, data }) {
		try {
			const config = ShapeGeneratorNodeConfigSchema.parse(node.config);
			const metadata$1 = {
				width: config.width,
				height: config.height,
				durationMs: 0
			};
			const outputType = config.outputType ?? "SVG";
			const svgContent = generateShapeSvg(config);
			const svgDataUrl = generateShapeSvgDataUrl(config);
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: createVirtualMedia({
							operation: {
								op: "source",
								...config,
								svgContent,
								svgDataUrl,
								dataType: outputType,
								metadata: metadata$1
							},
							metadata: metadata$1,
							children: []
						}, outputType),
						outputHandleId: (data.handles?.find((h) => h.nodeId === node.id && h.type === "Output") || data.handles?.[0])?.id || "output"
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "ShapeGenerator processing failed"
			};
		}
	}
};
ShapeGeneratorProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], ShapeGeneratorProcessor);
var server_default = defineNode(metadata, { backendProcessor: ShapeGeneratorProcessor });

//#endregion
export { server_default as default };