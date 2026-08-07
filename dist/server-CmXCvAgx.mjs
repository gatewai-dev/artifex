import "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode, n as ServerPassthroughProcessor } from "./server-B5otyLV2.mjs";
import { r as ColorSchema } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-note/dist/metadata-D7dpykKT.mjs
const NoteNodeConfigSchema = z$1.object({
	content: z$1.string().optional(),
	backgroundColor: ColorSchema.default("#ffff88"),
	textColor: ColorSchema.default("#000000"),
	fontSize: z$1.number().default(14)
}).strict();
const metadata = defineMetadata({
	type: "Note",
	displayName: "Sticky Note",
	description: "A sticky note",
	category: "Utilities",
	configSchema: NoteNodeConfigSchema,
	isTerminal: false,
	isTransient: false,
	handles: {
		inputs: [],
		outputs: []
	},
	defaultConfig: {
		backgroundColor: "#ffff88",
		textColor: "#000000",
		fontSize: 14
	}
});

//#endregion
//#region ../../nodes/node-note/dist/server.mjs
var server_default = defineNode(metadata, { backendProcessor: ServerPassthroughProcessor });

//#endregion
export { server_default as default };