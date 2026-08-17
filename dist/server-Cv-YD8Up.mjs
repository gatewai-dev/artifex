import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-color-balance/dist/metadata-CDf3zhH_.mjs
const TonalShiftSchema = z$1.object({
	cyanRed: z$1.number().min(-100).max(100).default(0),
	magentaGreen: z$1.number().min(-100).max(100).default(0),
	yellowBlue: z$1.number().min(-100).max(100).default(0)
});
const defaultTonalShift = {
	cyanRed: 0,
	magentaGreen: 0,
	yellowBlue: 0
};
const colorBalanceConfig = configBuilder({ strict: false }).field("shadows", TonalShiftSchema.default(defaultTonalShift)).field("midtones", TonalShiftSchema.default(defaultTonalShift)).field("highlights", TonalShiftSchema.default(defaultTonalShift)).field("preserveLuminosity", z$1.boolean().default(true)).field("shadows_cyanRed", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shadows Cyan-Red Signal"
}).field("shadows_magentaGreen", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shadows Magenta-Green Signal"
}).field("shadows_yellowBlue", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Shadows Yellow-Blue Signal"
}).field("midtones_cyanRed", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Midtones Cyan-Red Signal"
}).field("midtones_magentaGreen", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Midtones Magenta-Green Signal"
}).field("midtones_yellowBlue", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Midtones Yellow-Blue Signal"
}).field("highlights_cyanRed", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Highlights Cyan-Red Signal"
}).field("highlights_magentaGreen", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Highlights Magenta-Green Signal"
}).field("highlights_yellowBlue", z$1.number().min(-100).max(100).default(0), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Highlights Yellow-Blue Signal"
}).build();
const ColorBalanceNodeConfigSchema = colorBalanceConfig.schema;
const ColorBalanceResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
ColorBalanceNodeConfigSchema.extend({
	op: z$1.literal("ColorBalance"),
	metadata: z$1.unknown().optional()
});
const defaultColorBalanceConfig = ColorBalanceNodeConfigSchema.parse({});
const COLOR_BALANCE_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "ColorBalance",
	displayName: "Color Balance",
	description: "Shifts color balance of Shadows, Midtones, and Highlights along Cyan-Red, Magenta-Green, and Yellow-Blue axes",
	category: "Media",
	subcategory: void 0,
	configSchema: ColorBalanceNodeConfigSchema,
	resultSchema: ColorBalanceResultSchema,
	configHandles: colorBalanceConfig.configHandles,
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
			order: 0
		}]
	},
	defaultConfig: defaultColorBalanceConfig
});

//#endregion
//#region ../../nodes/node-color-balance/dist/server.mjs
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
let ColorBalanceProcessor = class ColorBalanceProcessor$1 {
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
			const config = ColorBalanceNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "ColorBalance processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = COLOR_BALANCE_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "ColorBalance",
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
				error: err instanceof Error ? err.message : "ColorBalance processing failed"
			};
		}
	}
};
ColorBalanceProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ColorBalanceProcessor);
var server_default = defineNode(metadata, { backendProcessor: ColorBalanceProcessor });

//#endregion
export { server_default as default };