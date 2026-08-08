import { E as appendOperation, N as getActiveMediaMetadata, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, w as VirtualMediaDataSchema } from "./dist-Bbhn-cb5.mjs";
import { a as defineMetadata, i as defineNode } from "./server-RmKl3RaO.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-resizer-scaler/dist/metadata-DWBNo43g.mjs
const ResizerScalerNodeConfigSchema = z$1.object({
	aspectRatioPreset: z$1.enum([
		"9:16",
		"16:9",
		"1:1",
		"4:5",
		"21:9",
		"custom"
	]).default("16:9"),
	resolutionPreset: z$1.enum([
		"4k",
		"1080p",
		"720p",
		"480p",
		"custom"
	]).default("1080p"),
	targetWidth: z$1.number().int().min(1).max(8192).default(1920),
	targetHeight: z$1.number().int().min(1).max(8192).default(1080),
	fitMode: z$1.enum([
		"cover",
		"contain",
		"stretch",
		"manual"
	]).default("contain"),
	zoom: z$1.number().int().min(1).max(1e3).default(100),
	offsetX: z$1.number().int().min(-8192).max(8192).default(0),
	offsetY: z$1.number().int().min(-8192).max(8192).default(0),
	backgroundMode: z$1.enum([
		"solid",
		"blurred",
		"gradient",
		"transparent"
	]).default("solid"),
	backgroundColor: z$1.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/).default("#000000FF"),
	backgroundColor2: z$1.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/).default("#000000FF"),
	blurRadius: z$1.number().int().min(0).max(100).default(40),
	backgroundBrightness: z$1.number().min(0).max(1).default(.6),
	anchorX: z$1.enum([
		"left",
		"center",
		"right"
	]).default("center"),
	anchorY: z$1.enum([
		"top",
		"center",
		"bottom"
	]).default("center")
}).strict();
const ResizerScalerResultSchema = MultiOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema)
]));
const RESIZER_SCALER_OUTPUT_TYPE_MAP = {
	Image: "Image",
	Video: "Video",
	GIF: "GIF",
	SVG: "Image",
	Lottie: "Video"
};
const RESOLUTION_PRESETS = {
	"16:9": {
		"4k": {
			w: 3840,
			h: 2160
		},
		"1080p": {
			w: 1920,
			h: 1080
		},
		"720p": {
			w: 1280,
			h: 720
		},
		"480p": {
			w: 854,
			h: 480
		}
	},
	"9:16": {
		"4k": {
			w: 2160,
			h: 3840
		},
		"1080p": {
			w: 1080,
			h: 1920
		},
		"720p": {
			w: 720,
			h: 1280
		},
		"480p": {
			w: 480,
			h: 854
		}
	},
	"1:1": {
		"4k": {
			w: 2160,
			h: 2160
		},
		"1080p": {
			w: 1080,
			h: 1080
		},
		"720p": {
			w: 720,
			h: 720
		},
		"480p": {
			w: 480,
			h: 480
		}
	},
	"4:5": {
		"4k": {
			w: 2160,
			h: 2700
		},
		"1080p": {
			w: 1080,
			h: 1350
		},
		"720p": {
			w: 720,
			h: 900
		},
		"480p": {
			w: 480,
			h: 600
		}
	},
	"21:9": {
		"4k": {
			w: 3840,
			h: 1646
		},
		"1080p": {
			w: 2560,
			h: 1080
		},
		"720p": {
			w: 1706,
			h: 720
		},
		"480p": {
			w: 1136,
			h: 480
		}
	}
};
function resolveTargetDimensions(config) {
	if (config.aspectRatioPreset === "custom" || config.resolutionPreset === "custom") {
		const w = Math.round(config.targetWidth);
		const h = Math.round(config.targetHeight);
		return {
			width: w % 2 === 0 ? w : w + 1,
			height: h % 2 === 0 ? h : h + 1
		};
	}
	const preset = RESOLUTION_PRESETS[config.aspectRatioPreset]?.[config.resolutionPreset];
	if (preset) return {
		width: preset.w % 2 === 0 ? preset.w : preset.w + 1,
		height: preset.h % 2 === 0 ? preset.h : preset.h + 1
	};
	return {
		width: 1920,
		height: 1080
	};
}
const metadata = defineMetadata({
	type: "ResizerScaler",
	displayName: "Resizer / Scaler",
	description: "Adjust aspect ratios, scale resolution, crop, and pad image/video assets.",
	category: "Media",
	subcategory: void 0,
	configSchema: ResizerScalerNodeConfigSchema,
	resultSchema: ResizerScalerResultSchema,
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
			label: "Result",
			order: 0,
			description: "Scaled & formatted output media"
		}]
	},
	defaultConfig: {
		aspectRatioPreset: "16:9",
		resolutionPreset: "1080p",
		targetWidth: 1920,
		targetHeight: 1080,
		fitMode: "contain",
		zoom: 100,
		offsetX: 0,
		offsetY: 0,
		backgroundMode: "solid",
		backgroundColor: "#000000FF",
		backgroundColor2: "#000000FF",
		blurRadius: 40,
		backgroundBrightness: .6,
		anchorX: "center",
		anchorY: "center"
	}
});

//#endregion
//#region ../../nodes/node-resizer-scaler/dist/server.mjs
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
let ResizerScalerProcessor = class ResizerScalerProcessor$1 {
	graph;
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = ResizerScalerNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Resizer / Scaler processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = RESIZER_SCALER_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const targetDims = resolveTargetDimensions(config);
			const finalMeta = {
				...activeMeta ?? {},
				width: targetDims.width,
				height: targetDims.height
			};
			const output = appendOperation(inputMedia, {
				op: "ResizerScaler",
				...config,
				metadata: finalMeta,
				dataType: outputType,
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
						type: outputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Resizer / Scaler processing failed"
			};
		}
	}
};
ResizerScalerProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ResizerScalerProcessor);
var server_default = defineNode(metadata, { backendProcessor: ResizerScalerProcessor });

//#endregion
export { server_default as default };