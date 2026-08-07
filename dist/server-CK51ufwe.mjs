import { N as getActiveMediaMetadata, a as TOKENS, k as createVirtualMedia, m as DEFAULT_DURATION_MS, p as BaseVideoLayerPropsSchema, r as GetAssetEndpointBackend, v as MediaMetadataSchema, w as VirtualMediaDataSchema } from "./dist-CZ1kEBl4.mjs";
import "./dist-BJT_v1BL.mjs";
import "./dist-CbFVR0yN.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import { n as resolveLayerDuration } from "./layer-logic-BRnbLDhA-CAL7hb2U.mjs";
import { a as ImageResultSchema, l as VideoResultSchema, n as BaseLayerSchema, r as ColorSchema } from "./dist-tM4GX3DS.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-compositor/dist/metadata-Bxr_nt3S.mjs
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
const CompositorLayerSchema = BaseLayerSchema.merge(BaseVideoLayerPropsSchema.omit({ speed: true })).extend({
	type: z$1.enum(VariableInputDataTypes),
	virtualMedia: VirtualMediaDataSchema.optional(),
	volume: z$1.number().optional(),
	lockAspect: z$1.boolean().optional(),
	hidden: z$1.boolean().optional(),
	muted: z$1.boolean().optional(),
	transition: z$1.object({
		type: z$1.enum([
			"crossfade",
			"wipe-left",
			"wipe-right",
			"slide-up",
			"slide-down"
		]),
		durationInMS: z$1.number().min(1)
	}).optional(),
	segments: z$1.array(z$1.object({
		startSec: z$1.number().min(0),
		endSec: z$1.number().min(0).nullable().optional()
	})).optional()
}).passthrough();
const CompositorNodeConfigSchema = z$1.object({
	layerUpdates: z$1.array(CompositorLayerSchema.extend({ inputHandleId: z$1.string().describe("The source Handle ID this instance maps to") })),
	width: z$1.number().min(1),
	height: z$1.number().min(1),
	backgroundColor: ColorSchema,
	volume: z$1.number().optional(),
	FPS: z$1.number().max(120).min(1).optional()
}).passthrough().superRefine((data, ctx) => {
	if (data.layerUpdates) for (let i = 0; i < data.layerUpdates.length; i++) {
		const layer = data.layerUpdates[i];
		if (layer && layer.type === "Caption") {
			if (layer.bottomPadding === void 0 || layer.bottomPadding === null) ctx.addIssue({
				code: z$1.ZodIssueCode.custom,
				message: "Caption layer requires a 'bottomPadding' property in layerUpdates config.",
				path: [
					"layerUpdates",
					i,
					"bottomPadding"
				]
			});
			else if (typeof layer.bottomPadding !== "number" || layer.bottomPadding < 0) ctx.addIssue({
				code: z$1.ZodIssueCode.custom,
				message: "Caption layer 'bottomPadding' must be a non-negative number.",
				path: [
					"layerUpdates",
					i,
					"bottomPadding"
				]
			});
		}
	}
});
CompositorNodeConfigSchema.extend({
	op: z$1.literal("Compositor"),
	dataType: z$1.enum(["Video", "Image"]).optional(),
	metadata: MediaMetadataSchema.optional()
});
BaseVideoLayerPropsSchema.omit({ speed: true }).extend({
	op: z$1.literal("CompositorLayer"),
	metadata: MediaMetadataSchema.optional()
});
const CompositorResultSchema = z$1.union([VideoResultSchema, ImageResultSchema]);
function isCompositorVideoMode(inputs, layerUpdates) {
	if (layerUpdates && layerUpdates.length > 0) return layerUpdates.some((layer) => {
		if (!layer) return false;
		const type = layer.type;
		return type === "Video" || type === "Audio" || type === "Caption" || type === "GIF" || type === "Lottie" || Array.isArray(layer.animations) && layer.animations.length > 0 || type === "Text" && layer.textAnimation && (typeof layer.textAnimation.entranceMs === "number" && layer.textAnimation.entranceMs > 0 || typeof layer.textAnimation.exitMs === "number" && layer.textAnimation.exitMs > 0 || layer.textAnimation.in && layer.textAnimation.in !== "none" || layer.textAnimation.out && layer.textAnimation.out !== "none");
	});
	let items = [];
	if (inputs instanceof Map) items = Array.from(inputs.values());
	else if (Array.isArray(inputs)) items = inputs;
	else if (inputs && typeof inputs === "object") items = Object.values(inputs);
	return items.some((item) => {
		if (!item) return false;
		const type = item.outputItem?.type ?? item.type ?? (item.item && item.item.type);
		return type === "Video" || type === "Audio" || type === "Caption" || type === "GIF" || type === "Lottie";
	});
}
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
		layerUpdates: [],
		width: 1080,
		height: 1080,
		FPS: 24
	})
});

//#endregion
//#region ../../nodes/node-compositor/dist/processor-DkCGN4v2.mjs
function processCompositor(config, itemsToRender, env, isVideoMode) {
	const width = config.width;
	const height = config.height;
	const fps = config.FPS ?? 24;
	const backgroundColor = config.backgroundColor ?? "#000000";
	let durationInMS = 0;
	const compositionChildren = [];
	const sortedItems = [...itemsToRender].sort((a, b) => (a.savedConfig.zIndex ?? 0) - (b.savedConfig.zIndex ?? 0));
	for (const { item, savedConfig: saved } of sortedItems) {
		let childVV;
		let sourceText;
		if (item.type === "Video" || item.type === "Audio" || item.type === "Image" || item.type === "Caption" || item.type === "SVG" || item.type === "GIF" || item.type === "Lottie") {
			const rawData = item.data;
			childVV = rawData && typeof rawData === "object" && "operation" in rawData ? rawData : createVirtualMedia(rawData, item.type);
		} else if (item.type === "Text") {
			sourceText = item.data || "";
			const durationMs = isVideoMode ? saved.durationInMS ?? DEFAULT_DURATION_MS : void 0;
			const isAuto = saved.autoDimensions !== false;
			const targetW = isAuto ? void 0 : saved.width;
			const targetH = isAuto ? void 0 : saved.height;
			childVV = {
				metadata: {
					width,
					height,
					...durationMs != null && { durationMs }
				},
				operation: {
					op: "text",
					text: sourceText,
					fontSize: saved.fontSize,
					fontFamily: saved.fontFamily,
					fill: saved.fill,
					align: saved.align,
					verticalAlign: saved.verticalAlign,
					fontWeight: saved.fontWeight,
					fontStyle: saved.fontStyle,
					letterSpacing: saved.letterSpacing,
					lineHeight: saved.lineHeight,
					dataType: item.type,
					width: targetW,
					height: targetH,
					padding: saved.padding,
					strokeRadius: saved.strokeRadius,
					textShadow: saved.textShadow,
					textBackgroundColor: saved.textBackgroundColor,
					shadows: saved.shadows,
					textAnimation: saved.textAnimation,
					useRoundedTextBox: saved.useRoundedTextBox,
					stroke: saved.stroke,
					strokeWidth: saved.strokeWidth
				},
				children: []
			};
		}
		if (!childVV) continue;
		const activeMeta = getActiveMediaMetadata(childVV);
		const layerDurationInMS = isVideoMode ? env.resolveLayerDuration(saved.durationInMS, activeMeta?.durationMs ?? void 0, DEFAULT_DURATION_MS, item.type) : void 0;
		const isCaption = item.type === "Caption";
		const layerOpWidth = isCaption ? width : saved.width ?? activeMeta?.width ?? width;
		const layerOpHeight = isCaption ? height : saved.height ?? activeMeta?.height ?? height;
		const isText = item.type === "Text";
		const segments = isVideoMode ? saved.segments?.map((s) => ({
			startSec: s.startSec,
			endSec: s.endSec ?? void 0
		})) : void 0;
		const layerOp = {
			metadata: {
				...activeMeta,
				width: layerOpWidth,
				height: layerOpHeight,
				...layerDurationInMS != null && { durationMs: layerDurationInMS }
			},
			operation: {
				op: "CompositorLayer",
				x: isCaption ? 0 : saved.x ?? 0,
				y: isCaption ? 0 : saved.y ?? 0,
				width: layerOpWidth,
				height: layerOpHeight,
				rotation: saved.rotation ?? 0,
				scale: saved.scale ?? 1,
				opacity: saved.opacity ?? 1,
				volume: saved.volume ?? 1,
				autoDimensions: saved.autoDimensions,
				dataType: item.type,
				textShadow: saved.textShadow,
				...isVideoMode && {
					startFrame: saved.startFrame ?? 0,
					durationInMS: layerDurationInMS
				},
				type: item.type,
				zIndex: saved.zIndex ?? 0,
				blendMode: saved.blendMode,
				hidden: saved.hidden,
				muted: saved.muted,
				backgroundColor: saved.backgroundColor,
				borderColor: saved.borderColor,
				borderWidth: saved.borderWidth,
				strokeRadius: saved.strokeRadius,
				stroke: isText || isCaption ? void 0 : saved.stroke,
				strokeWidth: isText || isCaption ? void 0 : saved.strokeWidth,
				strokeAlign: isText || isCaption ? void 0 : saved.strokeAlign,
				...segments && segments.length > 0 ? { segments } : {},
				animations: isText || item.type === "Caption" ? void 0 : saved.animations,
				useRoundedTextBox: saved.useRoundedTextBox,
				textAnimation: saved.textAnimation,
				bottomPadding: saved.bottomPadding,
				maxWidth: saved.maxWidth,
				...isText ? {} : {
					text: saved.text,
					fontSize: saved.fontSize,
					fontFamily: saved.fontFamily,
					fontStyle: saved.fontStyle,
					fontWeight: saved.fontWeight,
					fill: saved.fill,
					align: saved.align,
					verticalAlign: saved.verticalAlign,
					letterSpacing: saved.letterSpacing,
					lineHeight: saved.lineHeight,
					padding: saved.padding,
					textBackgroundColor: saved.textBackgroundColor,
					shadows: saved.shadows
				}
			},
			children: [childVV]
		};
		if (isVideoMode && layerDurationInMS != null) {
			const layerEnd = (saved.startFrame ?? 0) / fps * 1e3 + layerDurationInMS;
			if (layerEnd > durationInMS) durationInMS = layerEnd;
		}
		compositionChildren.push(layerOp);
	}
	return {
		metadata: {
			width,
			height,
			...isVideoMode && {
				fps,
				durationMs: durationInMS
			}
		},
		operation: {
			op: "Compositor",
			dataType: isVideoMode ? "Video" : "Image",
			width,
			height,
			backgroundColor,
			layerUpdates: config.layerUpdates,
			...isVideoMode && {
				fps,
				volume: config.volume ?? 1,
				metadata: {
					durationMs: durationInMS,
					width,
					height,
					fps
				}
			}
		},
		children: compositionChildren
	};
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
	env;
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
			const layerUpdates = config.layerUpdates ?? [];
			const resolver = this.graph.forNode(node, data);
			const itemsToRender = [];
			if (layerUpdates.length > 0) for (const update of layerUpdates) {
				const typedUpdate = update;
				const handleId = typedUpdate.inputHandleId;
				const item = resolver.inputs().allWithHandle().find((e) => e.handle?.id === handleId)?.value;
				if (item) itemsToRender.push({
					item,
					savedConfig: typedUpdate
				});
			}
			const isVideoMode = isCompositorVideoMode(resolver.inputs().allWithHandle().map((e) => e.value), config.layerUpdates);
			const outputVV = processCompositor(config, itemsToRender, {
				resolveAssetUrl: (fileData) => {
					return typeof fileData === "string" ? fileData : fileData?.entity?.id ? GetAssetEndpointBackend(this.env.BASE_URL, fileData.entity) : void 0;
				},
				resolveLayerDuration: (layerDur, metaDur, defaultDur, type) => resolveLayerDuration(layerDur ?? void 0, metaDur ?? void 0, defaultDur, type)
			}, isVideoMode);
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
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], CompositorProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.LOGGER), __decorateMetadata("design:type", Object)], CompositorProcessor.prototype, "logger", void 0);
CompositorProcessor = __decorate([injectable()], CompositorProcessor);
var server_default = defineNode(metadata, { backendProcessor: CompositorProcessor });

//#endregion
export { server_default as default };