import { a as TOKENS } from "./dist-D9o3ES2C.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bh8-kZ60.mjs";
import { s as TextResultSchema } from "./dist-Dn0Jc9I4.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-text-merger/dist/metadata-D8a4UIDF.mjs
const TextMergerNodeConfigSchema = z$1.object({ join: z$1.string().max(500).optional() }).strict();
const TextMergerResultSchema = TextResultSchema;
const metadata = defineMetadata({
	type: "TextMerger",
	displayName: "Text Merger",
	description: "Merges connected texts.",
	category: "Utilities",
	configSchema: TextMergerNodeConfigSchema,
	resultSchema: TextMergerResultSchema,
	isTerminal: false,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: ["Text"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			label: "Text",
			order: 0
		}, {
			dataTypes: ["Text"],
			label: "Text 2",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Text"],
			label: "Merged Text",
			order: 0
		}]
	},
	defaultConfig: { join: "\n" }
});

//#endregion
//#region ../../nodes/node-text-merger/dist/join-fn-BL3H4KWE.mjs
function joinText(values, separator) {
	return values.filter((v) => v !== null && v !== void 0).map((v) => String(v)).join(separator);
}

//#endregion
//#region ../../nodes/node-text-merger/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TextMergerServerProcessor = class TextMergerServerProcessor$1 {
	graph;
	constructor() {}
	async process({ node, data }) {
		try {
			const textInputs = this.graph.forNode(node, data).inputs().as("Text").allData();
			const joinString = TextMergerNodeConfigSchema.parse(node.config)?.join ?? "\n";
			const merged = joinText(textInputs.map((v) => v), joinString);
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing."
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: "Text",
						data: merged,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			if (err instanceof Error) return {
				success: false,
				error: err.message
			};
			return {
				success: false,
				error: "Text merger processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], TextMergerServerProcessor.prototype, "graph", void 0);
TextMergerServerProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], TextMergerServerProcessor);
var server_default = defineNode(metadata, { backendProcessor: TextMergerServerProcessor });

//#endregion
export { server_default as default };