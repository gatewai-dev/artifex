import { C as getActiveMediaMetadata, n as DEFAULT_DURATION_MS, s as MediaMetadataSchema, v as createVirtualMedia } from "./dist-DBCHxcBj.mjs";
import { a as TOKENS } from "./dist-DwwocMHt.mjs";
import "./dist-DtlkxQom.mjs";
import "./dist-DnO6zPQ-.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode } from "./server-B1wfqy91.mjs";
import { r as ImageResultSchema, s as VideoResultSchema } from "./dist-CvLMtr8b.mjs";
import { a as compositorToProgram, r as CompositorProgramSchema } from "./compiler-Dyinia12-BFrQT2vN.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-compositor/dist/metadata-DAPzP3ng.mjs
/**
* v2 config — THE document (spec: SKILL.md).
* No `layers`, no `layerUpdates`, no aliases. The node config IS the
* composition program: strict zod, validated by the E-code pre-parse scan
* in `@gatewai/compositions/program/validate`.
*/
const CompositorNodeConfigSchema = CompositorProgramSchema;
/** Data types accepted by the variable composer inputs. */
const VariableInputDataTypes = [
	"Text",
	"Image",
	"Video",
	"Audio",
	"Caption",
	"SVG",
	"GIF",
	"Lottie"
];
CompositorNodeConfigSchema.extend({
	op: z$1.literal("Compositor"),
	dataType: z$1.enum(["Video", "Image"]).optional(),
	metadata: MediaMetadataSchema.optional()
}).strict();
const CompositorResultSchema = z$1.union([VideoResultSchema, ImageResultSchema]);
const metadata = defineMetadata({
	type: "Compositor",
	displayName: "Compositor",
	description: "Compose media layers using renderable inputs.",
	category: "Media",
	subcategory: void 0,
	configSchema: CompositorNodeConfigSchema,
	resultSchema: CompositorResultSchema,
	isTerminal: false,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: [...VariableInputDataTypes]
	},
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Video", "Image"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: CompositorNodeConfigSchema.parse({
		layout: [],
		width: 1080,
		height: 1080,
		fps: 24,
		mode: "Video"
	})
});

//#endregion
//#region ../../nodes/node-compositor/dist/processor-DzX8a3Ux.mjs
/**
* processCompositor v2 — doc → render tree (spec: SKILL.md).
*
* The composition duration is derived from the tree itself: the max
* `startFrame + durationFrames` over nodes, with media nodes falling back
* to their bound source duration. Media nodes bind their graph sources by
* `inputHandleId`. Everything else is `compositorToProgram` — one
* constructor, no layer bookkeeping, no implicit "render all inputs".
*/
function mediaDurationFrames(vm, fps) {
	const ms = vm ? getActiveMediaMetadata(vm)?.durationMs : void 0;
	if (!ms || ms <= 0) return void 0;
	return Math.max(1, Math.round(ms / 1e3 * fps));
}
function computeCompositionDurationFrames(config, mediaByHandle, fps) {
	let frames = 0;
	const walk = (nodes) => {
		for (const n of nodes) {
			let dur = n.durationFrames;
			const vm = n.kind === "media" ? mediaByHandle.get(n.inputHandleId) : void 0;
			const limit = mediaDurationFrames(vm, fps);
			if (vm?.operation?.dataType === "Caption" && limit !== void 0 && limit > 0) dur = limit;
			else if (dur !== void 0) {
				if (limit !== void 0 && limit > 0) dur = Math.min(dur, limit);
			} else dur = limit ?? Math.round(DEFAULT_DURATION_MS / 1e3 * fps);
			frames = Math.max(frames, (n.startFrame ?? 0) + dur);
			if ("children" in n && n.children) walk(n.children);
		}
	};
	walk(config.layout);
	return Math.max(1, frames);
}
function processCompositor(config, mediaByHandle, isVideoMode) {
	const fps = config.fps ?? 24;
	const durationFrames = isVideoMode ? computeCompositionDurationFrames(config, mediaByHandle, fps) : void 0;
	const durationMs = durationFrames !== void 0 ? durationFrames / fps * 1e3 : void 0;
	return compositorToProgram(config, {
		isVideoMode,
		fps,
		...durationMs !== void 0 && { durationMs },
		resolveMedia: (inputHandleId) => mediaByHandle.get(inputHandleId)
	});
}

//#endregion
//#region ../../nodes/node-compositor/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CompositorProcessor = class CompositorProcessor$1 {
	graph;
	logger;
	async process({ node, data }) {
		try {
			const configParse = CompositorNodeConfigSchema.safeParse(node.config);
			if (!configParse.success) {
				this.logger.error({
					errors: configParse.error.issues,
					nodeId: node.id,
					nodeType: node.type
				}, "Invalid Compositor config");
				throw new Error("Invalid Compositor configuration");
			}
			const config = configParse.data;
			const isVideoMode = config.mode === "Video";
			const mediaByHandle = /* @__PURE__ */ new Map();
			const textByHandle = /* @__PURE__ */ new Map();
			const resolver = this.graph.forNode(node, data);
			for (const inputEntry of resolver.inputs().allWithHandle()) {
				const handleId = inputEntry.handle?.id;
				const item = inputEntry.value;
				if (!handleId || !item) continue;
				const type = item.outputItem?.type ?? item.type ?? (item.item && item.item.type);
				if (!type) continue;
				if (type === "Text") {
					const textVal = item.outputItem?.data ?? item.data;
					if (typeof textVal === "string") textByHandle.set(handleId, textVal);
					continue;
				}
				const rawData = item.outputItem?.data ?? item.data;
				if (!rawData) continue;
				mediaByHandle.set(handleId, rawData && typeof rawData === "object" && "operation" in rawData ? rawData : createVirtualMedia(rawData, type));
			}
			const walkAndInject = (nodes) => {
				for (const n of nodes) {
					if (n.kind === "text" && n.inputHandleId) if (textByHandle.has(n.inputHandleId)) n.text = textByHandle.get(n.inputHandleId);
					else n.text = n.text || "";
					if (n.children && Array.isArray(n.children)) walkAndInject(n.children);
				}
			};
			if (config.layout && Array.isArray(config.layout)) walkAndInject(config.layout);
			const outputVV = processCompositor(config, mediaByHandle, isVideoMode);
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: true,
				newResult: {
					outputs: [],
					selectedOutputIndex: 0
				}
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: isVideoMode ? "Video" : "Image",
						data: outputVV,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : "Composition processing failed";
			this.logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "Compositor processing failed");
			return {
				success: false,
				error: message
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], CompositorProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.LOGGER), __decorateMetadata("design:type", Object)], CompositorProcessor.prototype, "logger", void 0);
CompositorProcessor = __decorate([injectable()], CompositorProcessor);
var server_default = defineNode(metadata, { backendProcessor: CompositorProcessor });

//#endregion
export { server_default as default };