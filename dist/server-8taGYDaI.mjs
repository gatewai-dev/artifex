import { C as SingleOutputGenericSchema, E as appendOperation, F as getMediaType, N as getActiveMediaMetadata, O as createOutputItemSchema, a as TOKENS, v as MediaMetadataSchema, w as VirtualMediaDataSchema } from "./dist-D86uNdKf.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BdNfjggX.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-kenburns/dist/metadata-JcN6b8uV.mjs
const KEN_BURNS_EASING_OPTIONS = [
	"linear",
	"ease-in",
	"ease-out",
	"ease-in-out",
	"spring"
];
const KenBurnsKeyframeSchema = z$1.object({
	id: z$1.string().optional(),
	durationMs: z$1.number(),
	holdMs: z$1.number().optional().default(1e3),
	scale: z$1.number(),
	x: z$1.number(),
	y: z$1.number(),
	easing: z$1.enum(KEN_BURNS_EASING_OPTIONS).default("ease-in-out").optional()
});
const KEN_BURNS_ASPECT_RATIOS = [
	"16:9",
	"9:16",
	"21:9",
	"9:21",
	"1:1",
	"4:3",
	"3:2",
	"2:3",
	"4:5",
	"5:4"
];
const KenBurnsConfigSchema = z$1.object({
	keyframes: z$1.array(KenBurnsKeyframeSchema).default([]),
	motionBlurSize: z$1.number().optional().default(1.5),
	movementStyle: z$1.enum(["spline", "direct"]).default("spline"),
	aspectRatio: z$1.enum(["input", ...KEN_BURNS_ASPECT_RATIOS]).default("input")
}).strict();
KenBurnsConfigSchema.extend({
	op: z$1.literal("KenBurns"),
	metadata: MediaMetadataSchema.optional(),
	originalWidth: z$1.number().optional(),
	originalHeight: z$1.number().optional()
});
const KenBurnsResultSchema = SingleOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema));
const metadata = defineMetadata({
	type: "KenBurns",
	displayName: "Ken Burns",
	description: "Create a video using Ken Burns effect",
	category: "Media",
	subcategory: void 0,
	configSchema: KenBurnsConfigSchema,
	resultSchema: KenBurnsResultSchema,
	isTerminal: false,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"Video",
				"SVG",
				"GIF",
				"Lottie"
			],
			required: true,
			label: "Input",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: KenBurnsConfigSchema.parse({
		keyframes: [{
			durationMs: 1e3,
			holdMs: 1e3,
			scale: 2,
			x: 25,
			y: 25,
			easing: "ease-in-out"
		}, {
			durationMs: 0,
			holdMs: 1e3,
			scale: 2,
			x: 75,
			y: 75,
			easing: "ease-in-out"
		}],
		motionBlurSize: 0,
		aspectRatio: "input",
		movementStyle: "direct"
	})
});

//#endregion
//#region ../../nodes/node-kenburns/dist/shared-7E0ngyWL.mjs
/**
* Calculates the output metadata for a Ken Burns operation based on current metadata and config.
* Ensures consistent behavior between browser and server processors.
*/
function calculateKenBurnsMetadata(currentMeta, config, inputType = "Image") {
	let outWidth = currentMeta.width;
	let outHeight = currentMeta.height;
	if (!outWidth || !outHeight) throw new Error("Dimensions are missing from input media.");
	if (config.aspectRatio && config.aspectRatio !== "input") {
		const [wRatio, hRatio] = config.aspectRatio.split(":").map(Number);
		const targetAr = wRatio / hRatio;
		if (outWidth / outHeight > targetAr) outWidth = Math.round(outHeight * targetAr);
		else outHeight = Math.round(outWidth / targetAr);
	}
	let totalDuration = currentMeta.durationMs ?? 3e3;
	if (config.keyframes && config.keyframes.length > 0) {
		const keyframesDuration = config.keyframes.reduce((acc, kf) => acc + kf.durationMs + (kf.holdMs || 0), 0);
		if (inputType === "Image" || inputType === "SVG") totalDuration = Math.max(100, keyframesDuration);
		else totalDuration = Math.min(totalDuration, Math.max(100, keyframesDuration));
	}
	let fps = currentMeta.fps;
	if (inputType === "Image" || inputType === "SVG" || inputType === "Lottie") fps = 60;
	else if (!fps) fps = 24;
	return {
		...currentMeta,
		width: Math.round(outWidth),
		height: Math.round(outHeight),
		durationMs: totalDuration,
		fps
	};
}
/**
* Performs the core Ken Burns processing logic, abstracting away environment-specific function calls.
*/
function performKenBurnsProcessing(inputMedia, config, env) {
	const currentMeta = env.getActiveMediaMetadata(inputMedia);
	if (!currentMeta) throw new Error("Unable to read media metadata");
	const newMeta = calculateKenBurnsMetadata(currentMeta, config, env.getMediaType(inputMedia));
	return env.appendOperation(inputMedia, {
		op: "KenBurns",
		...config,
		originalWidth: currentMeta.width,
		originalHeight: currentMeta.height,
		metadata: newMeta,
		dataType: "Video"
	});
}

//#endregion
//#region ../../nodes/node-kenburns/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let KenBurnsProcessor = class KenBurnsProcessor$1 {
	graph;
	async process({ node, data }) {
		try {
			const inputMedia = this.graph.forNode(node, data).input("Input").item()?.data;
			if (!inputMedia) return {
				success: false,
				error: "Missing Video, Image, or SVG input"
			};
			const output = performKenBurnsProcessing(inputMedia, KenBurnsConfigSchema.parse(node.config), {
				getActiveMediaMetadata,
				appendOperation,
				getMediaType
			});
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: "Video",
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Ken Burns processing failed"
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], KenBurnsProcessor.prototype, "graph", void 0);
KenBurnsProcessor = __decorate([injectable()], KenBurnsProcessor);
var server_default = defineNode(metadata, { backendProcessor: KenBurnsProcessor });

//#endregion
export { server_default as default };