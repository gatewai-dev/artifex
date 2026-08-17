import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { c as configBuilder, n as ColorSchema, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-halftone-screen/dist/metadata-BYYKPTK0.mjs
const HalftoneModeEnum = z$1.enum(["Monochrome", "CMYK"]);
const DotShapeEnum = z$1.enum([
	"Circle",
	"Diamond",
	"Line",
	"Square"
]);
const halftoneScreenConfig = configBuilder().field("mode", HalftoneModeEnum.default("Monochrome"), {
	label: "Screening Mode",
	description: "Monochrome (single-ink raster on paper) or CMYK (4-color subtractive process with standard angle rosette separation)."
}).field("dotShape", DotShapeEnum.default("Circle"), {
	label: "Dot Geometry",
	description: "Geometric shape of the halftone raster cells: Circle, Diamond, Line, or Square."
}).field("frequency", z$1.number().min(1).max(200).default(30), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Screen Frequency (LPI)",
	description: "Line frequency in lines per unit / LPI. Higher values produce smaller, finer raster dots."
}).field("angle", z$1.number().min(0).max(360).default(45), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Screen Angle (deg)",
	description: "Global rotational angle of the screening grid in degrees (standard offset angle)."
}).field("contrast", z$1.number().min(.1).max(5).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Contrast Multiplier",
	description: "Tonal contrast curve multiplier applied to the luminance/ink density values."
}).field("dotColor", ColorSchema.default("#000000"), {
	label: "Dot / Ink Color",
	description: "Foreground ink color used in Monochrome mode (default #000000)."
}).field("paperColor", ColorSchema.default("#ffffff"), {
	label: "Paper / Background Color",
	description: "Substrate background color for Monochrome and CMYK subtractive print rendering."
}).field("smooth", z$1.boolean().default(true), {
	label: "Anti-aliasing (Smooth)",
	description: "Applies screen-space derivative smoothstep anti-aliasing to dot contours."
}).field("invert", z$1.boolean().default(false), {
	label: "Invert Raster",
	description: "Inverts ink density values (negative / photographic print effect)."
}).field("cyanAngle", z$1.number().min(0).max(360).default(15), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Cyan Angle Offset (deg)",
	description: "Rotational angle offset for Cyan channel in CMYK mode (standard offset: 15°)."
}).field("magentaAngle", z$1.number().min(0).max(360).default(75), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Magenta Angle Offset (deg)",
	description: "Rotational angle offset for Magenta channel in CMYK mode (standard offset: 75°)."
}).field("yellowAngle", z$1.number().min(0).max(360).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Yellow Angle Offset (deg)",
	description: "Rotational angle offset for Yellow channel in CMYK mode (standard offset: 0°)."
}).field("blackAngle", z$1.number().min(0).max(360).default(45), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Black Angle Offset (deg)",
	description: "Rotational angle offset for Black (Key) channel in CMYK mode (standard offset: 45°)."
}).field("opacity", z$1.number().min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Effect Opacity",
	description: "Blend opacity between the original input media and the screened halftone result."
}).build();
const HalftoneScreenNodeConfigSchema = halftoneScreenConfig.schema;
const HalftoneScreenResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
HalftoneScreenNodeConfigSchema.extend({
	op: z$1.literal("HalftoneScreen"),
	metadata: z$1.record(z$1.string(), z$1.unknown()).optional(),
	frequencyHandleId: z$1.string().nullable().optional(),
	angleHandleId: z$1.string().nullable().optional(),
	contrastHandleId: z$1.string().nullable().optional(),
	cyanAngleHandleId: z$1.string().nullable().optional(),
	magentaAngleHandleId: z$1.string().nullable().optional(),
	yellowAngleHandleId: z$1.string().nullable().optional(),
	blackAngleHandleId: z$1.string().nullable().optional(),
	opacityHandleId: z$1.string().nullable().optional(),
	inputs: z$1.record(z$1.string(), z$1.object({
		connectionValid: z$1.boolean(),
		outputItem: z$1.object({
			type: z$1.string(),
			data: z$1.unknown()
		}).nullable().optional()
	})).optional()
});
const HALFTONE_SCREEN_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "HalftoneScreen",
	displayName: "Halftone Screen",
	description: "Convert visual media into procedural halftone dot or CMYK raster screens with customizable angles and geometry",
	category: "Media",
	subcategory: void 0,
	configSchema: HalftoneScreenNodeConfigSchema,
	resultSchema: HalftoneScreenResultSchema,
	configHandles: halftoneScreenConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"]
	},
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
			order: 0
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		mode: "Monochrome",
		dotShape: "Circle",
		frequency: 30,
		angle: 45,
		contrast: 1,
		dotColor: "#000000",
		paperColor: "#ffffff",
		smooth: true,
		invert: false,
		cyanAngle: 15,
		magentaAngle: 75,
		yellowAngle: 0,
		blackAngle: 45,
		opacity: 1
	}
});

//#endregion
//#region ../../nodes/node-halftone-screen/dist/server.mjs
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
let HalftoneScreenProcessor = class HalftoneScreenProcessor$1 {
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
			const config = HalftoneScreenNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "HalftoneScreen processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = HALFTONE_SCREEN_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const finalMeta = activeMeta ?? inputMedia.metadata;
			const output = appendOperation(inputMedia, {
				op: "HalftoneScreen",
				...config,
				metadata: finalMeta,
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
				error: err instanceof Error ? err.message : "HalftoneScreen processing failed"
			};
		}
	}
};
HalftoneScreenProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], HalftoneScreenProcessor);
var server_default = defineNode(metadata, { backendProcessor: HalftoneScreenProcessor });

//#endregion
export { server_default as default };