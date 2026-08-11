import { M as getActiveMediaMetadata, T as appendOperation, a as TOKENS } from "./dist-BVlcG2fv.mjs";
import { a as defineMetadata, i as defineNode } from "./server-CMCofAZH.mjs";
import { c as configBuilder, s as VideoResultSchema, t as AudioResultSchema } from "./dist-DsOpBQDR.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-reverb/dist/metadata-CVFf-Zw2.mjs
const reverbConfig = configBuilder().field("roomSize", z$1.number().min(0).max(.98).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Room Size Signal",
	description: "Room decay, size of simulated space (0 to 0.98). Can be modulated by a static number or dynamic signal."
}).field("damping", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Damping Signal",
	description: "High-frequency absorption (0 to 1.0). Can be modulated by a static number or dynamic signal."
}).field("wet", z$1.number().min(0).max(1).default(.3), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Wet Mix Signal",
	description: "Mix level of the wet reverberated signal (0 to 1.0). Can be modulated by a static number or dynamic signal."
}).field("dry", z$1.number().min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Dry Mix Signal",
	description: "Mix level of the original dry signal (0 to 1.0). Can be modulated by a static number or dynamic signal."
}).field("width", z$1.number().min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Stereo Width Signal",
	description: "Stereo spread of the reverb tail (0 to 1.0). Can be modulated by a static number or dynamic signal."
}).build();
const ReverbNodeConfigSchema = reverbConfig.schema;
const ReverbResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const REVERB_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "Reverb",
	displayName: "Reverb",
	description: "Add room ambience and space to audio",
	category: "Media",
	subcategory: "Audio",
	configSchema: ReverbNodeConfigSchema,
	resultSchema: ReverbResultSchema,
	configHandles: reverbConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"]
	},
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
	defaultConfig: {
		roomSize: .5,
		damping: .5,
		wet: .3,
		dry: 1,
		width: 1
	}
});

//#endregion
//#region ../../nodes/node-audio-reverb/dist/server.mjs
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
let ReverbProcessor = class ReverbProcessor$1 {
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
			const config = ReverbNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Reverb failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = REVERB_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "Reverb",
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
				error: err instanceof Error ? err.message : "Reverb failed"
			};
		}
	}
};
ReverbProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ReverbProcessor);
var server_default = defineNode(metadata, { backendProcessor: ReverbProcessor });

//#endregion
export { server_default as default };