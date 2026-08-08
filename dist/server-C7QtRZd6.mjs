import "./dist-Bbhn-cb5.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { a as defineMetadata, i as defineNode } from "./server-RmKl3RaO.mjs";
import { s as TextResultSchema } from "./dist-C-mYL7qe.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-text/dist/metadata-DwamJRmY.mjs
const TextNodeConfigSchema = z$1.object({ content: z$1.string().max(1e5).default("") }).strict();
const metadata = defineMetadata({
	type: "Text",
	displayName: "Text",
	description: "Text (prompt) input node",
	category: "Input/Output",
	showInQuickAccess: false,
	configSchema: TextNodeConfigSchema,
	resultSchema: TextResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Text"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { content: "" }
});

//#endregion
//#region ../../nodes/node-text/dist/server.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TextProcessor = class TextProcessor$1 {
	async process({ node, data }) {
		const text = TextNodeConfigSchema.parse(node.config).content ?? "";
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		return {
			success: true,
			newResult: {
				outputs: [{ items: [{
					type: DataType.Text,
					data: text,
					outputHandleId: outputHandle?.id
				}] }],
				selectedOutputIndex: 0
			}
		};
	}
};
TextProcessor = __decorate([injectable()], TextProcessor);
var server_default = defineNode(metadata, { backendProcessor: TextProcessor });

//#endregion
export { server_default as default };