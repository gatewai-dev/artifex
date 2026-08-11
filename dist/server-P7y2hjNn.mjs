import { M as getActiveMediaMetadata, T as appendOperation, a as TOKENS } from "./dist-BVlcG2fv.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CMCofAZH.mjs";
import { s as VideoResultSchema, t as AudioResultSchema } from "./dist-DsOpBQDR.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-stereo-panning/dist/metadata-DIslfvbx.mjs
const StereoPanningNodeConfigSchema = z$1.object({ pan: z$1.number().min(-1).max(1).default(0).describe("Stereo panning value: -1 (full left) to 1 (full right), 0 is center") });
const StereoPanningResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const STEREO_PANNING_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "StereoPanning",
	displayName: "Stereo Panning",
	description: "Balance audio output between left and right channels",
	category: "Media",
	subcategory: "Audio",
	configSchema: StereoPanningNodeConfigSchema,
	resultSchema: StereoPanningResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: ["Audio", "Video"],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Audio", "Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { pan: 0 }
});

//#endregion
//#region ../../nodes/node-stereo-panning/dist/server.mjs
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
let StereoPanningProcessor = class StereoPanningProcessor$1 {
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
			const config = StereoPanningNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Stereo Panning failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = STEREO_PANNING_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "StereoPanning",
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType
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
				error: err instanceof Error ? err.message : "Stereo Panning failed"
			};
		}
	}
};
StereoPanningProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], StereoPanningProcessor);
var server_default = defineNode(metadata, { backendProcessor: StereoPanningProcessor });

//#endregion
export { server_default as default };