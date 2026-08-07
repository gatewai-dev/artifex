import { E as appendOperation, N as getActiveMediaMetadata, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, k as createVirtualMedia, w as VirtualMediaDataSchema } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { i as DimensionSchema } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-paint/dist/metadata-fdPgnzw_.mjs
const BrushStrokeSchema = z$1.object({
	id: z$1.string().default(() => Math.random().toString(36).substring(7)),
	tool: z$1.literal("brush"),
	path: z$1.string(),
	color: z$1.string(),
	size: z$1.number().positive(),
	opacity: z$1.number().min(0).max(1).default(1)
});
const EraserStrokeSchema = z$1.object({
	id: z$1.string().default(() => Math.random().toString(36).substring(7)),
	tool: z$1.literal("eraser"),
	path: z$1.string(),
	size: z$1.number().positive()
});
const FillStrokeSchema = z$1.object({
	id: z$1.string().default(() => Math.random().toString(36).substring(7)),
	tool: z$1.literal("fill"),
	imageData: z$1.string(),
	width: z$1.number().positive(),
	height: z$1.number().positive()
});
const StrokeSchema = z$1.discriminatedUnion("tool", [
	BrushStrokeSchema,
	EraserStrokeSchema,
	FillStrokeSchema
]);
const PaintNodeConfigSchema = z$1.object({
	width: DimensionSchema.default(1080),
	height: DimensionSchema.default(1080),
	maintainAspect: z$1.boolean().default(true),
	aspectRatio: z$1.number().optional(),
	backgroundColor: z$1.string().default("#ffffff"),
	strokes: z$1.array(StrokeSchema).optional()
}).strict();
const PaintResultSchema = MultiOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema)
]));
const PAINT_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "Paint",
	displayName: "Paint",
	description: "Draw / Fill Mask on an media",
	category: "Media",
	subcategory: void 0,
	configSchema: PaintNodeConfigSchema,
	resultSchema: PaintResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"SVG",
				"Video",
				"Lottie",
				"GIF"
			],
			label: "Background",
			order: 0,
			required: false
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Image/Video/GIF output, with mask"
		}, {
			dataTypes: ["Image"],
			label: "Mask",
			order: 1,
			description: "Image/Video/GIF output, only mask"
		}]
	},
	defaultConfig: {
		width: 1080,
		height: 1080,
		maintainAspect: true,
		backgroundColor: "#000"
	}
});

//#endregion
//#region ../../nodes/node-paint/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorateParam(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PaintProcessor = class PaintProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input().item();
			const paintConfig = PaintNodeConfigSchema.parse(node.config);
			const outputHandles = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output");
			const imageOutputHandle = outputHandles.find((h) => h.label.includes("Result"));
			const maskOutputHandle = outputHandles.find((h) => h.label.includes("Mask"));
			if (!imageOutputHandle || !maskOutputHandle) return {
				success: false,
				error: "Missing required output handles"
			};
			const inputMedia = inputItem?.data;
			const metadata$1 = (inputMedia ? getActiveMediaMetadata(inputMedia) : null) ?? {
				width: paintConfig.width,
				height: paintConfig.height
			};
			const outputType = inputItem?.type ? PAINT_OUTPUT_TYPE_MAP[inputItem.type] ?? "Image" : "Image";
			const imageOutputData = inputMedia ? appendOperation(inputMedia, {
				op: "Paint",
				...paintConfig,
				mode: "image",
				metadata: metadata$1,
				dataType: outputType
			}) : createVirtualMedia({
				operation: {
					op: "Paint",
					...paintConfig,
					mode: "media",
					dataType: outputType,
					metadata: metadata$1
				},
				metadata: metadata$1,
				children: []
			}, outputType);
			const maskOutputData = inputMedia ? appendOperation(inputMedia, {
				op: "Paint",
				...paintConfig,
				mode: "mask",
				dataType: "Image",
				metadata: metadata$1
			}) : createVirtualMedia({
				operation: {
					op: "Paint",
					...paintConfig,
					dataType: "Image",
					mode: "mask",
					metadata: metadata$1
				},
				metadata: metadata$1,
				children: []
			}, "Image");
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: imageOutputData,
						outputHandleId: imageOutputHandle.id
					}, {
						type: "Image",
						data: maskOutputData,
						outputHandleId: maskOutputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Paint processing failed"
			};
		}
	}
};
PaintProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], PaintProcessor);
var server_default = defineNode(metadata, { backendProcessor: PaintProcessor });

//#endregion
export { server_default as default };