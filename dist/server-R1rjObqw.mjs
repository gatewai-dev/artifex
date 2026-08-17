import { C as getActiveMediaMetadata, h as appendOperation } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { c as configBuilder, s as VideoResultSchema, t as AudioResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-noise-gate/dist/metadata-D8qMmGSi.mjs
const noiseGateConfig = configBuilder().field("threshold", z$1.number().min(-120).max(0).default(-40), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Threshold Signal",
	description: "dBFS level below which the gate closes (-120 to 0 dB). Can be modulated by a static number or dynamic signal."
}).field("attack", z$1.number().min(1e-4).max(1).default(.005), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Attack Signal",
	description: "Seconds to open (fade in) when signal exceeds threshold (0.0001 to 1.0s). Can be modulated by a static number or dynamic signal."
}).field("hold", z$1.number().min(.001).max(5).default(.05), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Hold Signal",
	description: "Seconds to stay open after signal drops below threshold (0.001 to 5.0s). Can be modulated by a static number or dynamic signal."
}).field("release", z$1.number().min(.01).max(5).default(.1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Release Signal",
	description: "Seconds to close (fade out) after hold expires (0.01 to 5.0s). Can be modulated by a static number or dynamic signal."
}).field("range", z$1.number().min(-120).max(0).default(-80), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Floor Range Signal",
	description: "dBFS floor when gate is closed (-120 to 0 dB). Can be modulated by a static number or dynamic signal."
}).build();
const NoiseGateNodeConfigSchema = noiseGateConfig.schema;
const NoiseGateResultSchema = z$1.union([AudioResultSchema, VideoResultSchema]);
const NOISE_GATE_OUTPUT_TYPE_MAP = {
	Audio: "Audio",
	Video: "Video"
};
const metadata = defineMetadata({
	type: "NoiseGate",
	displayName: "Audio Noise Gate",
	description: "Silence background noise and hum below a certain volume threshold",
	category: "Media",
	subcategory: "Audio",
	configSchema: NoiseGateNodeConfigSchema,
	resultSchema: NoiseGateResultSchema,
	configHandles: noiseGateConfig.configHandles,
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
		threshold: -40,
		attack: .005,
		hold: .05,
		release: .1,
		range: -80
	}
});

//#endregion
//#region ../../nodes/node-audio-noise-gate/dist/server.mjs
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
let NoiseGateProcessor = class NoiseGateProcessor$1 {
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
			const config = NoiseGateNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "Noise Gate failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = NOISE_GATE_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const output = appendOperation(inputMedia, {
				op: "NoiseGate",
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
				error: err instanceof Error ? err.message : "Noise Gate failed"
			};
		}
	}
};
NoiseGateProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], NoiseGateProcessor);
var server_default = defineNode(metadata, { backendProcessor: NoiseGateProcessor });

//#endregion
export { server_default as default };