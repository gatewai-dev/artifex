import { d as NodeResultSchema } from "./dist-DBCHxcBj.mjs";
import "./dist-frIVphF4.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode, n as ServerPassthroughProcessor } from "./server-3Yi2TTWf.mjs";
import { z as z$1 } from "zod";

//#region ../../nodes/node-preview/dist/metadata-ow7uMQP7.mjs
const metadata = defineMetadata({
	type: "Preview",
	displayName: "Preview",
	description: "Preview the output of a connected node",
	category: "Utilities",
	configSchema: z$1.object({}).strict(),
	resultSchema: NodeResultSchema,
	isTerminal: false,
	isTransient: true,
	showInQuickAccess: false,
	handles: {
		inputs: [{
			dataTypes: [
				"Video",
				"Image",
				"Text",
				"Audio",
				"SVG",
				"GIF",
				"Lottie",
				"Signal"
			],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: []
	}
});

//#endregion
//#region ../../nodes/node-preview/dist/server.mjs
var server_default = defineNode(metadata, { backendProcessor: ServerPassthroughProcessor });

//#endregion
export { server_default as default };