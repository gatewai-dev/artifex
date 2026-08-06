import { E as appendOperation, N as getActiveMediaMetadata, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, w as VirtualMediaDataSchema } from "./dist-xnVPaj2K.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bgx3WrSt.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-curves/dist/metadata-Dbv8Oa7r.mjs
const CurvePointSchema = z$1.object({
	x: z$1.number().min(0).max(1),
	y: z$1.number().min(0).max(1)
});
const CurveTypeSchema = z$1.enum([
	"rgb",
	"hue-vs-hue",
	"hue-vs-sat",
	"lum-vs-sat",
	"sat-vs-sat"
]);
const CurvesNodeConfigSchema = z$1.object({
	curveType: CurveTypeSchema.default("rgb"),
	master: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]),
	red: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]),
	green: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]),
	blue: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}]),
	hueVsHue: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}]),
	hueVsSat: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}]),
	lumVsSat: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}]),
	satVsSat: z$1.array(CurvePointSchema).min(2).default([{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}])
}).strict();
const CurvesResultSchema = MultiOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Lottie"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema)
]));
const CURVES_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Image: "Image",
	GIF: "GIF",
	Lottie: "Lottie",
	SVG: "SVG"
};
const defaultCurvesConfig = {
	curveType: "rgb",
	master: [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}],
	red: [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}],
	green: [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}],
	blue: [{
		x: 0,
		y: 0
	}, {
		x: 1,
		y: 1
	}],
	hueVsHue: [{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}],
	hueVsSat: [{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}],
	lumVsSat: [{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}],
	satVsSat: [{
		x: 0,
		y: .5
	}, {
		x: 1,
		y: .5
	}]
};
const metadata = defineMetadata({
	type: "Curves",
	displayName: "Color Curves",
	description: "Map tonal range and color balance using monotonic spline curves",
	category: "Media",
	subcategory: void 0,
	configSchema: CurvesNodeConfigSchema,
	resultSchema: CurvesResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"SVG",
				"Video",
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
				"SVG",
				"Video",
				"GIF",
				"Lottie"
			],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: defaultCurvesConfig
});

//#endregion
//#region ../../nodes/node-curves/dist/server.mjs
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
let CurvesProcessor = class CurvesProcessor$1 {
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
			const config = CurvesNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Curves processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = CURVES_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) return {
				success: false,
				error: `Curves processing failed - Unsupported input data type: ${inputItem.type}`
			};
			const output = appendOperation(inputMedia, {
				op: "Curves",
				nodeId: node.id,
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && (h.type === "Output" || h.label === "Result"));
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: outputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Curves processing failed"
			};
		}
	}
};
CurvesProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], CurvesProcessor);
const serverNode = defineNode(metadata, { backendProcessor: CurvesProcessor });
var server_default = serverNode;

//#endregion
export { server_default as default };