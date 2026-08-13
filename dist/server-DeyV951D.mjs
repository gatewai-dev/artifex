import { C as VirtualMediaDataSchema, D as createOutputItemSchema, y as MultiOutputGenericSchema } from "./dist-DIOL7bVU.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Dk31kopb.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-caption-editor/dist/metadata-d_0G-6QP.mjs
const CaptionEditorNodeConfigSchema = z$1.object({ content: z$1.string().max(2e5).default("") }).strict();
const CaptionEditorResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Caption"), VirtualMediaDataSchema));
const metadata = defineMetadata({
	type: "CaptionEditor",
	displayName: "Caption Builder",
	description: "Create captions manually in SRT format",
	category: "Input/Output",
	configSchema: CaptionEditorNodeConfigSchema,
	resultSchema: CaptionEditorResultSchema,
	isTerminal: false,
	isTransient: false,
	showInQuickAccess: false,
	showInSidebar: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Caption"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: { content: "" }
});

//#endregion
//#region ../../nodes/node-caption-editor/dist/srt-utils-B7lInSb4.mjs
function getSrtDurationMs(srt) {
	try {
		const matches = [...srt.matchAll(/(\d{1,2}:\d{2}:\d{2}(?:[.,]\d{1,3})?)/g)];
		if (matches.length === 0) return 0;
		let maxMs = 0;
		for (const match of matches) {
			const parts = match[0].replace(",", ".").split(":");
			if (parts.length === 3) {
				const [h, m, sMs] = parts;
				const secs = parseFloat(sMs);
				const ms = (parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + secs) * 1e3;
				if (ms > maxMs) maxMs = ms;
			}
		}
		return maxMs;
	} catch (e) {
		return 0;
	}
}

//#endregion
//#region ../../nodes/node-caption-editor/dist/server.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CaptionEditorProcessor = class CaptionEditorProcessor$1 {
	async process({ node, data }) {
		const srtText = CaptionEditorNodeConfigSchema.parse(node.config).content ?? "";
		const durationMs = getSrtDurationMs(srtText);
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		return {
			success: true,
			newResult: {
				selectedOutputIndex: 0,
				outputs: [{ items: [{
					type: "Caption",
					data: {
						metadata: { durationMs: durationMs || void 0 },
						operation: {
							op: "source",
							srtText,
							dataType: "Caption"
						},
						children: []
					},
					outputHandleId: outputHandle?.id
				}] }]
			}
		};
	}
};
CaptionEditorProcessor = __decorate([injectable()], CaptionEditorProcessor);
var server_default = defineNode(metadata, { backendProcessor: CaptionEditorProcessor });

//#endregion
export { server_default as default };