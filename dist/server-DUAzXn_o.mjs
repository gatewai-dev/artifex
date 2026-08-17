import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-tile-offset/dist/metadata-B-QE_kHS.mjs
const EdgeModeEnum = z$1.enum([
	"wrap",
	"clamp",
	"transparent",
	"mirror"
]);
const tileOffsetConfig = configBuilder().field("offsetX", z$1.number().default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Horizontal Offset (px)",
	description: "Horizontal pixel shift (positive shifts right, negative shifts left)."
}).field("offsetY", z$1.number().default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Vertical Offset (px)",
	description: "Vertical pixel shift (positive shifts down, negative shifts up)."
}).field("wrap", z$1.boolean().default(true), {
	label: "Wrap Around Edges",
	description: "Seamless modulo wrap-around across opposite borders."
}).field("edgeMode", EdgeModeEnum.default("wrap"), {
	label: "Edge Mode",
	description: "Boundary handling behavior: wrap (seamless modulo repeat), clamp (replicate edge pixels), transparent (empty transparent background), mirror (ping-pong reflection)."
}).build();
const TileOffsetNodeConfigSchema = tileOffsetConfig.schema;
const TileOffsetResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
TileOffsetNodeConfigSchema.extend({
	op: z$1.literal("TileOffset"),
	metadata: z$1.record(z$1.string(), z$1.unknown()).optional(),
	offsetXHandleId: z$1.string().nullable().optional(),
	offsetYHandleId: z$1.string().nullable().optional(),
	inputs: z$1.record(z$1.string(), z$1.object({
		connectionValid: z$1.boolean(),
		outputItem: z$1.object({
			type: z$1.string(),
			data: z$1.unknown()
		}).nullable().optional()
	})).optional()
});
const TILE_OFFSET_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "TileOffset",
	displayName: "Tile Offset",
	description: "Shifts visual media coordinates horizontally and vertically with seamless modulo wrap-around, mirror, or edge clamping for pattern design",
	category: "Media",
	subcategory: void 0,
	configSchema: TileOffsetNodeConfigSchema,
	resultSchema: TileOffsetResultSchema,
	configHandles: tileOffsetConfig.configHandles,
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
			required: true,
			label: "Input",
			order: 0,
			description: "Visual media to offset and tile"
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Offset / seamlessly tiled media"
		}]
	},
	defaultConfig: {
		offsetX: 0,
		offsetY: 0,
		wrap: true,
		edgeMode: "wrap"
	}
});

//#endregion
//#region ../../nodes/node-tile-offset/dist/server.mjs
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
let TileOffsetProcessor = class TileOffsetProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item() || resolver.input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = TileOffsetNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "TileOffset processing failed - No input data"
			};
			const baseMeta = getActiveMediaMetadata(inputMedia) ?? inputMedia.metadata;
			const outputType = TILE_OFFSET_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const output = appendOperation(inputMedia, {
				op: "TileOffset",
				...config,
				metadata: baseMeta,
				dataType: finalOutputType,
				inputs
			});
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
						type: finalOutputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "TileOffset processing failed"
			};
		}
	}
};
TileOffsetProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], TileOffsetProcessor);
var server_default = defineNode(metadata, { backendProcessor: TileOffsetProcessor });

//#endregion
export { server_default as default };