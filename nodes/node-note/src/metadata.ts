import { defineMetadata } from "@gatewai.studio/node-sdk";
import { NoteNodeConfigSchema } from "./shared/index.js";

export { NoteNodeConfigSchema };

export const metadata = defineMetadata({
	type: "Note",
	displayName: "Sticky Note",
	description: "A sticky note",
	category: "Utilities",
	configSchema: NoteNodeConfigSchema,
	isTerminal: false,
	isTransient: false,
	handles: {
		inputs: [],
		outputs: [],
	},
	defaultConfig: {
		backgroundColor: "#ffff88",
		textColor: "#000000",
		fontSize: 14,
	},
});
