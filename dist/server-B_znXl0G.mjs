import { D as createOutputItemSchema, M as getActiveMediaMetadata, N as getFingerprint, a as TOKENS } from "./dist-DIOL7bVU.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Dk31kopb.mjs";
import { c as configBuilder } from "./dist-rOdXmsZD.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-extract-lut/dist/metadata-Bro3jTkU.mjs
const extractLutConfig = configBuilder().field("strategy", z$1.enum(["deterministic", "statistical"]).default("deterministic"), {
	bindable: false,
	label: "Extraction Strategy"
}).field("samplePoints", z$1.number().int().min(10).max(500).default(150), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Sample Points"
}).build();
const ExtractLutNodeConfigSchema = extractLutConfig.schema;
const ExtractLutResultSchema = createOutputItemSchema(z$1.literal("LUT"), z$1.any());
const ExtractLutNodeResultSchema = z$1.object({
	selectedOutputIndex: z$1.literal(0),
	outputs: z$1.tuple([z$1.object({ items: z$1.tuple([ExtractLutResultSchema]) })])
});
const metadata = defineMetadata({
	type: "ExtractLUT",
	displayName: "Extract LUT",
	description: "Extract a 3D LUT from two frames",
	category: "Media",
	isTerminal: false,
	isTransient: true,
	configSchema: ExtractLutNodeConfigSchema,
	resultSchema: ExtractLutNodeResultSchema,
	configHandles: extractLutConfig.configHandles,
	handles: {
		inputs: [{
			dataTypes: ["Image"],
			required: true,
			label: "Source Frame",
			order: 0
		}, {
			dataTypes: ["Image"],
			required: true,
			label: "Graded Frame",
			order: 1
		}],
		outputs: [{
			dataTypes: ["LUT"],
			label: "LUT",
			order: 0
		}]
	},
	defaultConfig: {
		strategy: "deterministic",
		samplePoints: 150
	},
	validation: (config, inputs) => {
		const mediaInputs = Object.values(inputs ?? {}).filter((input) => {
			if (input?.operation) return true;
			if (input?.entity?.mimeType?.startsWith("image/") || input?.entity?.mimeType?.startsWith("video/")) return true;
			return false;
		});
		if (config?.strategy === "deterministic" && mediaInputs.length === 2) {
			const m1 = mediaInputs[0];
			const m2 = mediaInputs[1];
			const w1 = m1.operation ? getActiveMediaMetadata(m1)?.width : m1.entity?.width;
			const h1 = m1.operation ? getActiveMediaMetadata(m1)?.height : m1.entity?.height;
			const w2 = m2.operation ? getActiveMediaMetadata(m2)?.width : m2.entity?.width;
			const h2 = m2.operation ? getActiveMediaMetadata(m2)?.height : m2.entity?.height;
			if (w1 && h1 && w2 && h2 && (w1 !== w2 || h1 !== h2)) return { dimensions: `Error: Source and Graded Frame dimensions do not match (${w1}x${h1} vs ${w2}x${h2}). Deterministic extraction works best on the exact same frame.` };
		}
		return null;
	}
});

//#endregion
//#region ../../nodes/node-extract-lut/dist/server.mjs
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
/** Must match browser processor key exactly */
function extractLutRuntimeKey(nodeId, fingerprint) {
	return fingerprint ? `runtime://lut/extract-lut-${nodeId}-${fingerprint}` : `runtime://lut/extract-lut-${nodeId}`;
}
let ExtractLutProcessor = class ExtractLutProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const config = ExtractLutNodeConfigSchema.parse(node.config ?? {});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing"
			};
			const resolver = this.graph.forNode(node, data);
			const sourceItem = resolver.input("Source Frame").item();
			const targetItem = resolver.input("Graded Frame").item();
			const sourceMedia = sourceItem?.data;
			const targetMedia = targetItem?.data;
			const samplePoints = config.samplePoints ?? 150;
			const placeholderMedia = {
				metadata: {},
				operation: {
					op: "ExtractLUT",
					dataType: "LUT",
					nodeId: node.id,
					strategy: config.strategy,
					samplePoints
				},
				children: sourceMedia && targetMedia ? [sourceMedia, targetMedia] : []
			};
			const fingerprint = getFingerprint(placeholderMedia);
			const lutUrl = extractLutRuntimeKey(node.id, fingerprint);
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: "LUT",
						data: {
							...placeholderMedia,
							operation: {
								...placeholderMedia.operation,
								lutUrl
							}
						},
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "ExtractLUT processing failed"
			};
		}
	}
};
ExtractLutProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ExtractLutProcessor);
var server_default = defineNode(metadata, { backendProcessor: ExtractLutProcessor });

//#endregion
export { server_default as default };