import { C as getActiveMediaMetadata, _ as createOutputItemSchema, f as SingleOutputGenericSchema, h as appendOperation, l as MultiOutputGenericSchema, p as VirtualMediaDataSchema } from "./dist-DBCHxcBj.mjs";
import { a as TOKENS } from "./dist-frIVphF4.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode } from "./server-3Yi2TTWf.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-crop/dist/metadata-THTyI8X5.mjs
const BaseCropNodeConfigSchema = z$1.object({
	cropType: z$1.enum(["rect", "path"]).default("rect"),
	leftPercentage: z$1.number().min(0).max(100).default(0),
	topPercentage: z$1.number().min(0).max(100).default(0),
	widthPercentage: z$1.number().min(.01).max(100).default(100),
	heightPercentage: z$1.number().min(.01).max(100).default(100),
	pathPoints: z$1.array(z$1.object({
		x: z$1.number().min(0).max(100),
		y: z$1.number().min(0).max(100)
	})).optional(),
	roundness: z$1.number().min(0).max(100).default(0)
}).strict();
const validateCropPathPoints = (data, ctx) => {
	if (data.cropType === "path") {
		if (!data.pathPoints || data.pathPoints.length < 3) ctx.addIssue({
			code: z$1.ZodIssueCode.custom,
			message: "pathPoints must contain at least 3 points when cropType is 'path'",
			path: ["pathPoints"]
		});
	}
};
const CropNodeConfigSchema = BaseCropNodeConfigSchema.superRefine(validateCropPathPoints);
BaseCropNodeConfigSchema.extend({
	op: z$1.literal("Crop"),
	mode: z$1.enum(["cropped", "rest"]).optional(),
	metadata: z$1.any().optional()
}).superRefine(validateCropPathPoints);
const VideoCropResultSchema = SingleOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema)
]));
const CropResultSchema = MultiOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema)
]));
const CROP_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
function calculateCropArea(config) {
	const isPath = config.cropType === "path";
	let leftPercentage = config.leftPercentage;
	let topPercentage = config.topPercentage;
	let widthPercentage = config.widthPercentage;
	let heightPercentage = config.heightPercentage;
	if (isPath && config.pathPoints && config.pathPoints.length > 0) {
		const xs = config.pathPoints.map((p) => p.x);
		const ys = config.pathPoints.map((p) => p.y);
		leftPercentage = Math.min(...xs);
		topPercentage = Math.min(...ys);
		widthPercentage = Math.max(.01, Math.max(...xs) - leftPercentage);
		heightPercentage = Math.max(.01, Math.max(...ys) - topPercentage);
	}
	return {
		leftPercentage,
		topPercentage,
		widthPercentage,
		heightPercentage
	};
}
const metadata = defineMetadata({
	type: "Crop",
	displayName: "Crop",
	description: "Crop media using rectangle, path, or ellipse",
	category: "Media",
	subcategory: void 0,
	configSchema: CropNodeConfigSchema,
	resultSchema: CropResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"Video",
				"SVG",
				"GIF",
				"Lottie"
			],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Cropped",
			order: 0,
			description: "The cropped area of the media"
		}, {
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Rest",
			order: 1,
			description: "The rest (uncropped) of the media"
		}]
	},
	defaultConfig: {
		cropType: "rect",
		leftPercentage: 0,
		topPercentage: 0,
		widthPercentage: 100,
		heightPercentage: 100,
		pathPoints: [],
		roundness: 0
	}
});

//#endregion
//#region ../../nodes/node-crop/dist/server.mjs
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
let CropProcessor = class CropProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const inputItem = this.graph.forNode(node, data).input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = CropNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Crop processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			if (!activeMeta || !activeMeta.width || !activeMeta.height) return {
				success: false,
				error: "No active media metadata found"
			};
			const sw = activeMeta.width;
			const sh = activeMeta.height;
			const { leftPercentage, topPercentage, widthPercentage, heightPercentage } = calculateCropArea(config);
			const cw = Math.max(1, Math.round(widthPercentage / 100 * sw));
			const ch = Math.max(1, Math.round(heightPercentage / 100 * sh));
			const outputType = CROP_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const resultOutput = appendOperation(inputMedia, {
				op: "Crop",
				cropType: config.cropType,
				pathPoints: config.pathPoints,
				leftPercentage,
				topPercentage,
				widthPercentage,
				roundness: config.roundness,
				heightPercentage,
				mode: "cropped",
				metadata: {
					...activeMeta,
					width: cw,
					height: ch
				},
				dataType: outputType
			});
			const restOutput = appendOperation(inputMedia, {
				op: "Crop",
				cropType: config.cropType,
				pathPoints: config.pathPoints,
				leftPercentage,
				topPercentage,
				roundness: config.roundness,
				widthPercentage,
				heightPercentage,
				mode: "rest",
				metadata: activeMeta,
				dataType: outputType
			});
			const outputHandles = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output");
			const resultOutputHandle = outputHandles.find((h) => h.label.includes("Cropped"));
			const restOutputHandle = outputHandles.find((h) => h.label.includes("Rest"));
			if (!resultOutputHandle || !restOutputHandle) return {
				success: false,
				error: "Missing required output handles"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: resultOutput,
						outputHandleId: resultOutputHandle.id
					}, {
						type: outputType,
						data: restOutput,
						outputHandleId: restOutputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Crop processing failed"
			};
		}
	}
};
CropProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], CropProcessor);
var server_default = defineNode(metadata, { backendProcessor: CropProcessor });

//#endregion
export { server_default as default };