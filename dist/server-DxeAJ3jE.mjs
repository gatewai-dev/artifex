import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { a as ImageResultSchema, l as VideoResultSchema } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-levels/dist/metadata-Tn4ynocZ.mjs
const LevelChannelSchema = z$1.object({
	inBlack: z$1.number().min(0).max(1).default(0),
	inWhite: z$1.number().min(0).max(1).default(1),
	outBlack: z$1.number().min(0).max(1).default(0),
	outWhite: z$1.number().min(0).max(1).default(1)
}).strict();
const LevelsNodeConfigSchema = z$1.object({
	master: LevelChannelSchema.default({
		inBlack: 0,
		inWhite: 1,
		outBlack: 0,
		outWhite: 1
	}),
	red: LevelChannelSchema.default({
		inBlack: 0,
		inWhite: 1,
		outBlack: 0,
		outWhite: 1
	}),
	green: LevelChannelSchema.default({
		inBlack: 0,
		inWhite: 1,
		outBlack: 0,
		outWhite: 1
	}),
	blue: LevelChannelSchema.default({
		inBlack: 0,
		inWhite: 1,
		outBlack: 0,
		outWhite: 1
	})
}).strict();
const LevelsResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
LevelsNodeConfigSchema.extend({
	op: z$1.literal("Levels"),
	metadata: z$1.any().optional()
});
const defaultLevelChannel = {
	inBlack: 0,
	inWhite: 1,
	outBlack: 0,
	outWhite: 1
};
const defaultLevelsConfig = {
	master: { ...defaultLevelChannel },
	red: { ...defaultLevelChannel },
	green: { ...defaultLevelChannel },
	blue: { ...defaultLevelChannel }
};
const LEVELS_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "Levels",
	displayName: "Levels",
	description: "Adjust tonal range and color balance with input/output levels",
	category: "Media",
	subcategory: void 0,
	configSchema: LevelsNodeConfigSchema,
	resultSchema: LevelsResultSchema,
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
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: defaultLevelsConfig
});

//#endregion
//#region ../../nodes/node-levels/dist/server.mjs
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
let LevelsProcessor = class LevelsProcessor$1 {
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
			const config = LevelsNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Levels processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = LEVELS_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "Levels",
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
				error: err instanceof Error ? err.message : "Levels processing failed"
			};
		}
	}
};
LevelsProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], LevelsProcessor);
var server_default = defineNode(metadata, { backendProcessor: LevelsProcessor });

//#endregion
export { server_default as default };