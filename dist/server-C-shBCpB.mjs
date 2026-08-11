import { C as VirtualMediaDataSchema, D as createOutputItemSchema, M as getActiveMediaMetadata, S as SingleOutputGenericSchema, T as appendOperation, a as TOKENS } from "./dist-BVlcG2fv.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CMCofAZH.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-mesh-warp/dist/metadata-B6ERmPUH.mjs
const MeshWarpNodeConfigSchema = z$1.object({
	cols: z$1.number().int().min(2).max(12).default(3),
	rows: z$1.number().int().min(2).max(12).default(3),
	points: z$1.array(z$1.object({
		x: z$1.number().min(0).max(100),
		y: z$1.number().min(0).max(100)
	})).max(144).optional()
}).strict().superRefine((data, ctx) => {
	if (data.points && data.points.length > 0) {
		const expected = data.cols * data.rows;
		if (data.points.length !== expected) ctx.addIssue({
			code: z$1.ZodIssueCode.custom,
			path: ["points"],
			message: `points array must have exactly ${expected} coordinates (cols * rows), got ${data.points.length}`
		});
	}
});
MeshWarpNodeConfigSchema.extend({
	op: z$1.literal("MeshWarp"),
	metadata: z$1.any().optional()
});
const MeshWarpResultSchema = SingleOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema)
]));
const WARP_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "MeshWarp",
	displayName: "Mesh Warp",
	description: "Warp media using a grid of control points",
	category: "Media",
	subcategory: void 0,
	configSchema: MeshWarpNodeConfigSchema,
	resultSchema: MeshWarpResultSchema,
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
			label: "Warped",
			order: 0,
			description: "The warped media"
		}]
	},
	defaultConfig: {
		cols: 6,
		rows: 6,
		points: []
	}
});

//#endregion
//#region ../../nodes/node-mesh-warp/dist/utils-CHc0Pz0m.mjs
function createUniformGrid(cols, rows) {
	const points = [];
	for (let r = 0; r < rows; r++) {
		const y = r / (rows - 1) * 100;
		for (let c = 0; c < cols; c++) {
			const x = c / (cols - 1) * 100;
			points.push({
				x,
				y
			});
		}
	}
	return points;
}

//#endregion
//#region ../../nodes/node-mesh-warp/dist/server.mjs
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
let MeshWarpProcessor = class MeshWarpProcessor$1 {
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
			const config = MeshWarpNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Mesh warp processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			if (!activeMeta || !activeMeta.width || !activeMeta.height) return {
				success: false,
				error: "No active media metadata found"
			};
			const outputType = WARP_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const cols = config.cols ?? 3;
			const rows = config.rows ?? 3;
			const resultOutput = appendOperation(inputMedia, {
				op: "MeshWarp",
				cols,
				rows,
				points: config.points && config.points.length === cols * rows ? config.points : createUniformGrid(cols, rows),
				metadata: activeMeta,
				dataType: outputType
			});
			const resultOutputHandle = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output").find((h) => h.label.includes("Warped"));
			if (!resultOutputHandle) return {
				success: false,
				error: "Missing required output handle"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: resultOutput,
						outputHandleId: resultOutputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Mesh warp processing failed"
			};
		}
	}
};
MeshWarpProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], MeshWarpProcessor);
var server_default = defineNode(metadata, { backendProcessor: MeshWarpProcessor });

//#endregion
export { server_default as default };