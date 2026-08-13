import "./dist-DIOL7bVU.mjs";
import { t as DataType } from "./dist-BtS_watq.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Dk31kopb.mjs";
import { i as NumberResultSchema } from "./dist-rOdXmsZD.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-number/dist/metadata-Bop8toss.mjs
const NumberNodeConfigSchema = z$1.object({ value: z$1.number().default(0) }).strict();
const metadata = defineMetadata({
	type: "Number",
	displayName: "Number",
	description: "Number input node",
	category: "Input/Output",
	showInQuickAccess: false,
	configSchema: NumberNodeConfigSchema,
	resultSchema: NumberResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Number"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { value: 0 }
});

//#endregion
//#region ../../nodes/node-number/dist/server.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let NumberProcessor = class NumberProcessor$1 {
	async process({ node, data }) {
		const value = NumberNodeConfigSchema.parse(node.config).value ?? 0;
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		return {
			success: true,
			newResult: {
				outputs: [{ items: [{
					type: DataType.Number,
					data: value,
					outputHandleId: outputHandle?.id
				}] }],
				selectedOutputIndex: 0
			}
		};
	}
};
NumberProcessor = __decorate([injectable()], NumberProcessor);
var server_default = defineNode(metadata, { backendProcessor: NumberProcessor });

//#endregion
export { server_default as default };