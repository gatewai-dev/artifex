import "./dist-D9o3ES2C.mjs";
import { a as defineMetadata, i as defineNode, n as ServerPassthroughProcessor } from "./server-Bh8-kZ60.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-note/dist/metadata-VAE1LKSg.mjs
const NoteNodeConfigSchema = z$1.object({
	content: z$1.string().max(2e4).optional(),
	backgroundColor: z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a hex color").default("#ffff88"),
	textColor: z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a hex color").default("#000000"),
	fontSize: z$1.number().int().min(1).max(100).default(14)
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