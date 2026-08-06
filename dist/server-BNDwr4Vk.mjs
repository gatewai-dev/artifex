import { E as appendOperation, N as getActiveMediaMetadata, a as TOKENS } from "./dist-CJI3Jl43.mjs";
import { a as defineMetadata, i as defineNode } from "./server-ClH_dFot.mjs";
import { a as ImageResultSchema, l as VideoResultSchema, u as configBuilder } from "./dist-DyMTWRHA.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-film-grain/dist/metadata-Bj52_Zen.mjs
const MAX_STRENGTH = 100;
const filmGrainConfig = configBuilder().field("strength", z$1.number().min(0).max(MAX_STRENGTH).default(15), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Strength Signal",
	description: "The intensity of the film grain. 0 = no grain. Can be modulated by a static number or a dynamic signal."
}).field("size", z$1.number().min(.5).max(4).default(1.5), {
	bindable: false,
	label: "Grain Size"
}).field("monochrome", z$1.boolean().default(true), {
	bindable: false,
	label: "Monochrome"
}).field("animated", z$1.boolean().default(true), {
	bindable: false,
	label: "Animated"
}).field("speed", z$1.number().min(0).max(100).default(50), {
	bindable: false,
	label: "Evolution Speed"
}).field("shadows", z$1.number().min(0).max(1).default(.2), {
	bindable: false,
	label: "Shadow Response"
}).field("midtones", z$1.number().min(0).max(1).default(1), {
	bindable: false,
	label: "Midtone Response"
}).field("highlights", z$1.number().min(0).max(1).default(.2), {
	bindable: false,
	label: "Highlight Response"
}).build();
const FilmGrainNodeConfigSchema = filmGrainConfig.schema;
const FilmGrainResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const FILM_GRAIN_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "FilmGrain",
	displayName: "Film Grain",
	description: "Apply organic, cinematic film grain texture to media",
	category: "Media",
	subcategory: void 0,
	configSchema: FilmGrainNodeConfigSchema,
	resultSchema: FilmGrainResultSchema,
	configHandles: filmGrainConfig.configHandles,
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
		strength: 15,
		size: 1.5,
		monochrome: true,
		animated: true,
		speed: 50,
		shadows: .2,
		midtones: 1,
		highlights: .2
	}
});

//#endregion
//#region ../../nodes/node-film-grain/dist/server.mjs
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
let FilmGrainProcessor = class FilmGrainProcessor$1 {
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
			const config = FilmGrainNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Film Grain processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = FILM_GRAIN_OUTPUT_TYPE_MAP[inputItem.type];
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
				op: "FilmGrain",
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
				error: err instanceof Error ? err.message : "Film Grain processing failed"
			};
		}
	}
};
FilmGrainProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], FilmGrainProcessor);
var server_default = defineNode(metadata, { backendProcessor: FilmGrainProcessor });

//#endregion
export { server_default as default };