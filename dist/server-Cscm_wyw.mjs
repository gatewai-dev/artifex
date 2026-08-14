import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DBCHxcBj.mjs";
import { a as TOKENS } from "./dist-frIVphF4.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode } from "./server-3Yi2TTWf.mjs";
import { c as configBuilder, s as VideoResultSchema, t as AudioResultSchema } from "./dist-CvLMtr8b.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-delay/dist/metadata-B9RQ7Ah4.mjs
const delayConfig = configBuilder().field("delayTime", z$1.number().min(.001).max(5).default(.25), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Delay Time Signal",
	description: "Delay time in seconds (0.001 to 5.0s). Can be modulated by a static number or dynamic signal."
}).field("feedback", z$1.number().min(0).max(.95).default(.4), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Feedback Signal",
	description: "Amount of delayed signal fed back into delay line (0.0 to 0.95). Can be modulated by a static number or dynamic signal."
}).field("wet", z$1.number().min(0).max(1).default(.3), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Wet Mix Signal",
	description: "Mix level of the wet delayed signal (0.0 to 1.0). Can be modulated by a static number or dynamic signal."
}).field("dry", z$1.number().min(0).max(1).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Dry Mix Signal",
	description: "Mix level of the original dry signal (0.0 to 1.0). Can be modulated by a static number or dynamic signal."
}).field("pingPong", z$1.boolean().default(false), {
	bindable: false,
	label: "Ping Pong Mode",
	description: "Alternates echo reflections between left and right channels"
}).build();
const DelayNodeConfigSchema = delayConfig.schema;
const DelayResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const DELAY_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "Delay",
	displayName: "Delay / Echo",
	description: "Add repeating echo effect for audio and video",
	category: "Media",
	subcategory: "Audio",
	configSchema: DelayNodeConfigSchema,
	resultSchema: DelayResultSchema,
	configHandles: delayConfig.configHandles,
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
		delayTime: .25,
		feedback: .4,
		wet: .3,
		dry: 1,
		pingPong: false
	}
});

//#endregion
//#region ../../nodes/node-audio-delay/dist/server.mjs
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
let DelayProcessor = class DelayProcessor$1 {
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
			const config = DelayNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Delay failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = DELAY_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "Delay",
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
				error: err instanceof Error ? err.message : "Delay failed"
			};
		}
	}
};
DelayProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], DelayProcessor);
var server_default = defineNode(metadata, { backendProcessor: DelayProcessor });

//#endregion
export { server_default as default };