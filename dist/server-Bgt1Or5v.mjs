import { M as getActiveMediaMetadata, a as TOKENS } from "./dist-DIOL7bVU.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Dk31kopb.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-rOdXmsZD.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-displacement-map/dist/metadata-isnRXWOE.mjs
const displacementMapConfig = configBuilder().field("strengthX", z$1.number().min(0).max(500).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Strength X Signal",
	description: "Horizontal displacement strength in pixels. Can be modulated by a static number or a dynamic signal."
}).field("strengthY", z$1.number().min(0).max(500).default(50), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Strength Y Signal",
	description: "Vertical displacement strength in pixels. Can be modulated by a static number or a dynamic signal."
}).field("xChannel", z$1.enum([
	"Red",
	"Green",
	"Blue",
	"Alpha",
	"Luminance"
]).default("Red"), {
	bindable: false,
	label: "X Channel"
}).field("yChannel", z$1.enum([
	"Red",
	"Green",
	"Blue",
	"Alpha",
	"Luminance"
]).default("Green"), {
	bindable: false,
	label: "Y Channel"
}).field("wrapMode", z$1.enum([
	"Clamp",
	"Repeat",
	"Mirror"
]).default("Clamp"), {
	bindable: false,
	label: "Wrap Mode"
}).build();
const DisplacementMapNodeConfigSchema = displacementMapConfig.schema;
const DisplacementMapResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const DISPLACEMENT_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "DisplacementMap",
	displayName: "Displacement Map",
	description: "Distort media using a displacement map texture",
	category: "Media",
	subcategory: void 0,
	configSchema: DisplacementMapNodeConfigSchema,
	resultSchema: DisplacementMapResultSchema,
	configHandles: displacementMapConfig.configHandles,
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
		}, {
			dataTypes: ["Image", "Video"],
			required: true,
			label: "Map",
			order: 1,
			description: "Displacement map texture. Connect a Noise Generator or any grayscale texture."
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
		strengthX: 50,
		strengthY: 50,
		xChannel: "Red",
		yChannel: "Green",
		wrapMode: "Clamp"
	}
});

//#endregion
//#region ../../nodes/node-displacement-map/dist/server.mjs
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
let DisplacementMapProcessor = class DisplacementMapProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item();
			const mapItem = resolver.input("Map").item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			if (!mapItem) return {
				success: false,
				error: "Missing displacement map input"
			};
			const config = DisplacementMapNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Displacement map processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = DISPLACEMENT_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const output = {
				metadata: activeMeta ?? inputMedia.metadata ?? {},
				operation: {
					op: "DisplacementMap",
					...config,
					dataType: finalOutputType,
					inputs,
					mapMedia: mapItem.data
				},
				children: [inputMedia]
			};
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
				error: err instanceof Error ? err.message : "Displacement map processing failed"
			};
		}
	}
};
DisplacementMapProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], DisplacementMapProcessor);
var server_default = defineNode(metadata, { backendProcessor: DisplacementMapProcessor });

//#endregion
export { server_default as default };