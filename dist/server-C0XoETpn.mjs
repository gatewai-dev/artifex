import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-selective-color/dist/metadata-DFFKGk1A.mjs
const MIN_COLOR_ADJUSTMENT = -100;
const MAX_COLOR_ADJUSTMENT = 100;
const ColorAdjustmentSchema = z$1.object({
	cyan: z$1.number().min(MIN_COLOR_ADJUSTMENT).max(MAX_COLOR_ADJUSTMENT).default(0),
	magenta: z$1.number().min(MIN_COLOR_ADJUSTMENT).max(MAX_COLOR_ADJUSTMENT).default(0),
	yellow: z$1.number().min(MIN_COLOR_ADJUSTMENT).max(MAX_COLOR_ADJUSTMENT).default(0),
	black: z$1.number().min(MIN_COLOR_ADJUSTMENT).max(MAX_COLOR_ADJUSTMENT).default(0)
});
const defaultColorAdjustment = {
	cyan: 0,
	magenta: 0,
	yellow: 0,
	black: 0
};
const SelectiveColorMethodEnum = z$1.enum(["Relative", "Absolute"]);
const selectiveColorConfig = configBuilder().field("method", SelectiveColorMethodEnum.default("Relative"), {
	label: "Method",
	description: "Relative modifies CMYK ink proportions relative to existing ink levels. Absolute directly adjusts channel percentages."
}).field("reds", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Reds Adjustment" }).field("yellows", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Yellows Adjustment" }).field("greens", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Greens Adjustment" }).field("cyans", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Cyans Adjustment" }).field("blues", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Blues Adjustment" }).field("magentas", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Magentas Adjustment" }).field("whites", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Whites Adjustment" }).field("neutrals", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Neutrals Adjustment" }).field("blacks", ColorAdjustmentSchema.default(defaultColorAdjustment), { label: "Blacks Adjustment" }).build();
const SelectiveColorNodeConfigSchema = selectiveColorConfig.schema;
const defaultSelectiveColorConfig = {
	method: "Relative",
	reds: { ...defaultColorAdjustment },
	yellows: { ...defaultColorAdjustment },
	greens: { ...defaultColorAdjustment },
	cyans: { ...defaultColorAdjustment },
	blues: { ...defaultColorAdjustment },
	magentas: { ...defaultColorAdjustment },
	whites: { ...defaultColorAdjustment },
	neutrals: { ...defaultColorAdjustment },
	blacks: { ...defaultColorAdjustment }
};
const SelectiveColorResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
SelectiveColorNodeConfigSchema.extend({
	op: z$1.literal("SelectiveColor"),
	metadata: z$1.unknown().optional(),
	dataType: z$1.enum([
		"Image",
		"Video",
		"GIF"
	]).optional()
});
const SELECTIVE_COLOR_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "SelectiveColor",
	displayName: "Selective Color",
	description: "Photoshop standard CMYK color grading across 9 targeted color ranges without edge artifacts.",
	category: "Media",
	subcategory: void 0,
	configSchema: SelectiveColorNodeConfigSchema,
	resultSchema: SelectiveColorResultSchema,
	configHandles: selectiveColorConfig.configHandles,
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
			label: "Input",
			order: 0,
			required: true,
			description: "Media input to apply selective color grading onto"
		}],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Color graded output media"
		}]
	},
	defaultConfig: defaultSelectiveColorConfig
});

//#endregion
//#region ../../nodes/node-selective-color/dist/server.mjs
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
let SelectiveColorProcessor = class SelectiveColorProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item() || resolver.input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing Input"
			};
			const config = SelectiveColorNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "SelectiveColor processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = SELECTIVE_COLOR_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "SelectiveColor",
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
				error: err instanceof Error ? err.message : "SelectiveColor processing failed"
			};
		}
	}
};
SelectiveColorProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], SelectiveColorProcessor);
var server_default = defineNode(metadata, { backendProcessor: SelectiveColorProcessor });

//#endregion
export { server_default as default };