import { M as getActiveMediaMetadata, O as createVirtualMedia, _ as MediaMetadataSchema, a as TOKENS, p as DEFAULT_DURATION_MS, r as GetAssetEndpointBackend } from "./dist-DdOALdQJ.mjs";
import "./dist-BJT_v1BL.mjs";
import "./dist-rfuvqZnV.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BLjQvdJL.mjs";
import { n as resolveLayerDuration } from "./layer-logic-BRnbLDhA-DXcQS9Cs.mjs";
import { c as VideoResultSchema, i as ImageResultSchema, n as ColorSchema, r as GlobalCompositeOperation } from "./dist-PcmI0kPL.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-compositor/dist/metadata-3C03hsTb.mjs
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
const VariableLayerType = z$1.enum(VariableInputDataTypes);
const SegmentSchema = z$1.object({
	startSec: z$1.number().finite().min(0),
	endSec: z$1.number().finite().min(0).nullable().optional()
}).strict();
const BlendModeSchema = GlobalCompositeOperation;
const AnimatablePropSchema = z$1.enum([
	"x",
	"y",
	"scale",
	"rotation",
	"opacity",
	"width",
	"height",
	"volume",
	"hidden",
	"muted",
	"fill",
	"borderColor",
	"textBackgroundColor",
	"backgroundColor"
]);
const EaseRefSchema = z$1.object({
	name: z$1.enum([
		"none",
		"power1",
		"power2",
		"power3",
		"sine",
		"circ",
		"expo",
		"back",
		"elastic",
		"bounce",
		"spring"
	]),
	dir: z$1.enum([
		"in",
		"out",
		"inOut"
	]),
	params: z$1.array(z$1.number().finite()).optional()
}).strict();
const KeyframeSchema = z$1.object({
	id: z$1.string().min(1),
	frame: z$1.number().int().min(0),
	value: z$1.union([
		z$1.number().finite(),
		z$1.boolean(),
		z$1.string()
	]),
	ease: EaseRefSchema.optional(),
	presetGroupId: z$1.string().optional(),
	presetType: z$1.string().optional()
}).strict();
const AnimationTrackSchema = z$1.object({
	id: z$1.string().min(1),
	prop: AnimatablePropSchema,
	keyframes: z$1.array(KeyframeSchema),
	repeat: z$1.number().int().optional(),
	yoyo: z$1.boolean().optional(),
	durationFrames: z$1.number().int().min(1).optional()
}).strict();
const LayerAnimationSchema = z$1.object({ tracks: z$1.array(AnimationTrackSchema).max(24) }).strict();
const layerInvariantsRefinement = (layer, ctx) => {
	if (layer.type === "Caption") {
		if (layer.bottomPadding === void 0 || layer.bottomPadding === null) ctx.addIssue({
			code: z$1.ZodIssueCode.custom,
			message: "Caption layer requires a 'bottomPadding' property in layers config.",
			path: ["bottomPadding"]
		});
		else if (typeof layer.bottomPadding !== "number" || layer.bottomPadding < 0) ctx.addIssue({
			code: z$1.ZodIssueCode.custom,
			message: "Caption layer 'bottomPadding' must be a non-negative number.",
			path: ["bottomPadding"]
		});
	}
	if (layer.animation && layer.animation.tracks) {
		let totalKeyframes = 0;
		const tracks = layer.animation.tracks;
		for (let tIdx = 0; tIdx < tracks.length; tIdx++) {
			const track = tracks[tIdx];
			const keyframes = track.keyframes || [];
			totalKeyframes += keyframes.length;
			const isDiscrete = track.prop === "hidden" || track.prop === "muted";
			const minKeyframes = 1;
			if (keyframes.length < minKeyframes) ctx.addIssue({
				code: z$1.ZodIssueCode.custom,
				message: `Track for property '${track.prop}' must have at least ${minKeyframes} keyframe(s).`,
				path: [
					"animation",
					"tracks",
					tIdx,
					"keyframes"
				]
			});
			for (let kIdx = 0; kIdx < keyframes.length; kIdx++) {
				const kf = keyframes[kIdx];
				if (kf.frame < 0 || kf.frame > layer.durationFrames) ctx.addIssue({
					code: z$1.ZodIssueCode.custom,
					message: `Keyframe frame (${kf.frame}) must be within the clip duration [0, ${layer.durationFrames}].`,
					path: [
						"animation",
						"tracks",
						tIdx,
						"keyframes",
						kIdx,
						"frame"
					]
				});
				if (kIdx > 0) {
					const prevKf = keyframes[kIdx - 1];
					if (kf.frame < prevKf.frame) ctx.addIssue({
						code: z$1.ZodIssueCode.custom,
						message: "Keyframes must be sorted in ascending order of frame.",
						path: [
							"animation",
							"tracks",
							tIdx,
							"keyframes",
							kIdx
						]
					});
					else if (kf.frame === prevKf.frame) ctx.addIssue({
						code: z$1.ZodIssueCode.custom,
						message: "Duplicate keyframes at the same frame are not allowed.",
						path: [
							"animation",
							"tracks",
							tIdx,
							"keyframes",
							kIdx
						]
					});
				}
				const valType = typeof kf.value;
				if (isDiscrete) {
					if (valType !== "boolean") ctx.addIssue({
						code: z$1.ZodIssueCode.custom,
						message: `Keyframe value for discrete property '${track.prop}' must be a boolean.`,
						path: [
							"animation",
							"tracks",
							tIdx,
							"keyframes",
							kIdx,
							"value"
						]
					});
				} else if (valType !== "number" || isNaN(kf.value) || !isFinite(kf.value)) ctx.addIssue({
					code: z$1.ZodIssueCode.custom,
					message: `Keyframe value for numeric property '${track.prop}' must be a finite number.`,
					path: [
						"animation",
						"tracks",
						tIdx,
						"keyframes",
						kIdx,
						"value"
					]
				});
			}
		}
		if (totalKeyframes > 128) ctx.addIssue({
			code: z$1.ZodIssueCode.custom,
			message: `Total keyframes across all tracks (${totalKeyframes}) exceeds the limit of 128.`,
			path: ["animation"]
		});
	}
};
const LayerSchema = z$1.object({
	id: z$1.string().min(1),
	inputHandleId: z$1.string().min(1),
	name: z$1.string().optional(),
	type: VariableLayerType,
	x: z$1.number().finite().default(0),
	y: z$1.number().finite().default(0),
	width: z$1.number().positive().finite().optional(),
	height: z$1.number().positive().finite().optional(),
	scale: z$1.number().min(0).finite().default(1),
	rotation: z$1.number().finite().default(0),
	opacity: z$1.number().min(0).max(1).finite().default(1),
	anchorX: z$1.number().finite().default(.5),
	anchorY: z$1.number().finite().default(.5),
	volume: z$1.number().min(0).max(1).finite().default(1),
	zIndex: z$1.number().int().default(0),
	blendMode: BlendModeSchema.optional(),
	hidden: z$1.boolean().default(false),
	muted: z$1.boolean().default(false),
	startFrame: z$1.number().int().min(0).default(0),
	durationFrames: z$1.number().int().min(1),
	trimStartFrames: z$1.number().int().min(0).default(0),
	trimEndFrames: z$1.number().int().min(0).default(0),
	lockAspect: z$1.boolean().default(true),
	autoDimensions: z$1.boolean().default(true),
	backgroundColor: ColorSchema.optional(),
	borderColor: ColorSchema.optional(),
	borderWidth: z$1.number().min(0).finite().optional(),
	strokeRadius: z$1.number().min(0).finite().optional(),
	strokeAlign: z$1.enum([
		"inside",
		"center",
		"outside"
	]).optional(),
	borderRadius: z$1.number().min(0).finite().optional(),
	text: z$1.string().optional(),
	fontSize: z$1.number().positive().finite().optional(),
	fontFamily: z$1.string().optional(),
	fontWeight: z$1.union([z$1.number().int(), z$1.string()]).optional(),
	fontStyle: z$1.string().optional(),
	fill: ColorSchema.optional(),
	align: z$1.string().optional(),
	verticalAlign: z$1.string().optional(),
	letterSpacing: z$1.number().finite().optional(),
	lineHeight: z$1.number().positive().finite().optional(),
	padding: z$1.number().min(0).finite().optional(),
	textShadow: z$1.string().optional(),
	textBackgroundColor: ColorSchema.optional(),
	useRoundedTextBox: z$1.boolean().optional(),
	bottomPadding: z$1.number().min(0).finite().optional(),
	maxWidth: z$1.number().positive().finite().optional(),
	segments: z$1.array(SegmentSchema).optional(),
	animation: LayerAnimationSchema.default({ tracks: [] })
}).strict().superRefine(layerInvariantsRefinement);
const CompositorConfigObjectSchema = z$1.object({
	width: z$1.number().int().min(1).max(4096).finite(),
	height: z$1.number().int().min(1).max(4096).finite(),
	backgroundColor: ColorSchema,
	volume: z$1.number().min(0).max(1).finite().default(1),
	fps: z$1.number().int().min(1).max(120).default(24),
	mode: z$1.enum(["Video", "Image"]).default("Video"),
	layers: z$1.array(LayerSchema).max(64)
}).strict();
const CompositorNodeConfigSchema = z$1.preprocess((val) => {
	if (val && typeof val === "object") {
		const clone = { ...val };
		if ("FPS" in clone) {
			clone.fps = clone.FPS;
			delete clone.FPS;
		}
		if ("layerUpdates" in clone) {
			clone.layers = clone.layerUpdates;
			delete clone.layerUpdates;
		}
		return clone;
	}
	return val;
}, CompositorConfigObjectSchema);
z$1.preprocess((val) => {
	if (val && typeof val === "object") {
		const clone = { ...val };
		if ("FPS" in clone) {
			clone.fps = clone.FPS;
			delete clone.FPS;
		}
		if ("layerUpdates" in clone) {
			clone.layers = clone.layerUpdates;
			delete clone.layerUpdates;
		}
		return clone;
	}
	return val;
}, CompositorConfigObjectSchema.extend({
	op: z$1.literal("Compositor"),
	dataType: z$1.enum(["Video", "Image"]).optional(),
	metadata: MediaMetadataSchema.optional()
}));
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
		layers: [],
		width: 1080,
		height: 1080,
		fps: 24,
		mode: "Video"
	})
});

//#endregion
//#region ../../nodes/node-compositor/dist/processor-CoakZRJq.mjs
function processCompositor(config, itemsToRender, env, isVideoMode) {
	const width = config.width;
	const height = config.height;
	const fps = config.fps ?? 24;
	const backgroundColor = config.backgroundColor ?? "#000000";
	let compositionDurationFrames = 0;
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
			const durationMs = isVideoMode ? saved.durationFrames !== void 0 ? saved.durationFrames / fps * 1e3 : DEFAULT_DURATION_MS : void 0;
			const isAuto$1 = saved.autoDimensions !== false;
			const targetW = isAuto$1 ? void 0 : saved.width;
			const targetH = isAuto$1 ? void 0 : saved.height;
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
		const layerDurationFrames = isVideoMode ? saved.durationFrames !== void 0 ? saved.durationFrames : Math.max(1, Math.round(env.resolveLayerDuration(void 0, activeMeta?.durationMs ?? void 0, DEFAULT_DURATION_MS, item.type) / 1e3 * fps)) : void 0;
		const layerDurationInMS = isVideoMode && layerDurationFrames != null ? layerDurationFrames / fps * 1e3 : void 0;
		const isCaption = item.type === "Caption";
		const isAuto = saved.autoDimensions !== false;
		const layerOpWidth = isCaption ? width : isAuto ? activeMeta?.width ?? saved.width ?? width : saved.width ?? activeMeta?.width ?? width;
		const layerOpHeight = isCaption ? height : isAuto ? activeMeta?.height ?? saved.height ?? height : saved.height ?? activeMeta?.height ?? height;
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
				id: saved.id,
				inputHandleId: saved.inputHandleId,
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
					durationFrames: layerDurationFrames
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
				animation: saved.animation,
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
		if (isVideoMode && layerDurationFrames != null) {
			const layerEndFrame = (saved.startFrame ?? 0) + layerDurationFrames;
			if (layerEndFrame > compositionDurationFrames) compositionDurationFrames = layerEndFrame;
		}
		compositionChildren.push(layerOp);
	}
	const durationInMS = isVideoMode ? compositionDurationFrames / fps * 1e3 : void 0;
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
			layers: config.layers,
			mode: config.mode,
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
			const layers = config.layers ?? [];
			const resolver = this.graph.forNode(node, data);
			const itemsToRender = [];
			if (layers && layers.length > 0) for (const update of layers) {
				const typedUpdate = update;
				const handleId = typedUpdate.inputHandleId;
				const item = resolver.inputs().allWithHandle().find((e) => e.handle?.id === handleId)?.value;
				if (item) itemsToRender.push({
					item,
					savedConfig: typedUpdate
				});
			}
			else resolver.inputs().allWithHandle().forEach((inputEntry, idx) => {
				const handleId = inputEntry.handle?.id;
				const item = inputEntry.value;
				if (handleId && item) {
					const itemAny = item;
					const type = itemAny.outputItem?.type ?? itemAny.type ?? (itemAny.item && itemAny.item.type) ?? "Video";
					itemsToRender.push({
						item,
						savedConfig: {
							id: handleId,
							inputHandleId: handleId,
							type,
							x: 0,
							y: 0,
							scale: 1,
							rotation: 0,
							opacity: 1,
							zIndex: idx
						}
					});
				}
			});
			const isVideoMode = config.mode === "Video";
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