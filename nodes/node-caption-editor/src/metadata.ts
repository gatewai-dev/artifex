import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	CaptionEditorNodeConfigSchema,
	CaptionEditorResultSchema,
} from "./shared/index.js";

export { CaptionEditorNodeConfigSchema, CaptionEditorResultSchema };

export const metadata = defineMetadata({
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
		outputs: [{ dataTypes: ["Caption"], label: "Result", order: 0 }],
	},
	defaultConfig: { content: "" },
});
