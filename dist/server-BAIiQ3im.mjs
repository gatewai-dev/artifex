import { _ as createOutputItemSchema, l as MultiOutputGenericSchema, p as VirtualMediaDataSchema, v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-canvas-generator/dist/metadata-x4BFUBeG.mjs
const CanvasGeneratorNodeConfigSchema = z$1.object({
	width: z$1.number().int().min(1).max(4096).default(1920),
	height: z$1.number().int().min(1).max(4096).default(1080),
	fillType: z$1.enum([
		"solid",
		"linear",
		"radial"
	]).default("solid"),
	solidColor: z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #").default("#3b82f6"),
	gradientStart: z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #").default("#3b82f6"),
	gradientEnd: z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #").default("#d8711dff"),
	gradientAngle: z$1.number().int().min(0).max(360).default(180),
	radialCenterX: z$1.number().min(0).max(1).default(.5),
	radialCenterY: z$1.number().min(0).max(1).default(.5),
	radialRadius: z$1.number().min(0).max(2).default(.5)
}).strict();
const CanvasGeneratorResultSchema = MultiOutputGenericSchema(z$1.union([createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema)]));
const metadata = defineMetadata({
	type: "CanvasGenerator",
	displayName: "Canvas Generator",
	description: "Create blank canvases or custom gradients from scratch",
	category: "Media",
	subcategory: void 0,
	configSchema: CanvasGeneratorNodeConfigSchema,
	resultSchema: CanvasGeneratorResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Image"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		width: 1920,
		height: 1080,
		fillType: "solid",
		solidColor: "#3b82f6",
		gradientStart: "#3b82f6",
		gradientEnd: "#1d4ed8",
		gradientAngle: 180,
		radialCenterX: .5,
		radialCenterY: .5,
		radialRadius: .5
	}
});

//#endregion
//#region ../../nodes/node-canvas-generator/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CanvasGeneratorProcessor = class CanvasGeneratorProcessor$1 {
	constructor() {}
	async process({ node, data }) {
		try {
			const config = CanvasGeneratorNodeConfigSchema.parse(node.config);
			const metadata$1 = {
				width: config.width,
				height: config.height,
				durationMs: 0
			};
			const output = createVirtualMedia({
				operation: {
					op: "CanvasGenerator",
					...config,
					dataType: "Image",
					metadata: metadata$1
				},
				metadata: metadata$1,
				children: []
			}, "Image");
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: "Image",
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "CanvasGenerator processing failed"
			};
		}
	}
};
CanvasGeneratorProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], CanvasGeneratorProcessor);
var server_default = defineNode(metadata, { backendProcessor: CanvasGeneratorProcessor });

//#endregion
export { server_default as default };