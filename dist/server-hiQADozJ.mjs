import { O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, k as createVirtualMedia, w as VirtualMediaDataSchema } from "./dist-CZ1kEBl4.mjs";
import { a as defineMetadata, i as defineNode } from "./server-B5otyLV2.mjs";
import path from "node:path";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-html-video-render/dist/metadata-DIavCrsB.mjs
const HTMLVideoRenderResultSchema = MultiOutputGenericSchema(z$1.union([createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema)]));
const HTMLVideoRenderNodeConfigSchema = z$1.object({
	format: z$1.enum(["mp4", "webm"]).default("mp4"),
	transparent: z$1.boolean().default(false)
}).strict();
const metadata = defineMetadata({
	type: "HTMLVideoRender",
	displayName: "Motion Renderer",
	description: "Render HTML, CSS, and GSAP animations to video",
	category: "Media",
	subcategory: "Video",
	configSchema: HTMLVideoRenderNodeConfigSchema,
	resultSchema: HTMLVideoRenderResultSchema,
	isTerminal: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "HTML",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Video"],
			label: "Video Result",
			order: 0
		}]
	},
	validation: (_config, inputs, handles) => {
		const htmlHandle = handles?.find((h) => h.label === "HTML");
		const htmlVal = htmlHandle ? inputs?.[htmlHandle.id] : Object.values(inputs ?? {}).find((val) => typeof val === "string");
		if (htmlVal === void 0 || htmlVal === null) return null;
		if (typeof htmlVal !== "string") return { html: "HTML input must be a string." };
		const trimmed = htmlVal.trim();
		if (trimmed === "") return { html: "HTML input cannot be empty." };
		if (!trimmed.startsWith("<!DOCTYPE html>") && !trimmed.startsWith("<!doctype html>")) return { html: "Composition must start with a proper HTML5 document structure (<!DOCTYPE html>)." };
		if (!trimmed.includes("<html") || !trimmed.includes("<body")) return { html: "Composition must contain <html> and <body> tags." };
		if (trimmed.includes("gsap") && !trimmed.includes("cdn.jsdelivr.net/npm/gsap") && !trimmed.includes("https://cdnjs.cloudflare.com/ajax/libs/gsap")) return { html: "Composition uses GSAP but no GSAP script tag is loaded in the document." };
		const hasOpacityZeroCss = trimmed.match(/opacity\s*:\s*0/i);
		const hasGsapFromOpacityZero = trimmed.match(/gsap\.from\([^)]*opacity\s*:\s*0/i);
		if (hasOpacityZeroCss && hasGsapFromOpacityZero) return { html: "Avoid animating opacity using gsap.from() if the CSS already sets opacity to 0 (resulting in a 0 to 0 animation)." };
		return null;
	}
});

//#endregion
//#region ../../nodes/node-html-video-render/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let HtmlVideoRenderProcessor = class HtmlVideoRenderProcessor$1 {
	graph;
	prisma;
	mediaRenderer;
	env;
	constructor() {}
	async process({ node, data }) {
		try {
			const htmlContent = this.graph.forNode(node, data).input("HTML").required().asText();
			if (!htmlContent?.trim()) return {
				success: false,
				error: "HTML content is required."
			};
			const config = HTMLVideoRenderNodeConfigSchema.parse(node.config);
			logger.info(`Rendering HTML content to ${config.format} video for node: ${node.id} via mediaRenderer service`);
			const renderResult = await this.mediaRenderer.renderHtmlVideo(htmlContent, {
				userId: data.canvas.userId,
				format: config.format,
				transparent: config.transparent
			});
			let asset;
			if (renderResult.assetId) {
				asset = await this.prisma.fileAsset.findUnique({ where: { id: renderResult.assetId } });
				if (!asset) throw new Error(`FileAsset not found for id: ${renderResult.assetId}`);
			} else {
				const key = renderResult.fileKey;
				if (!key) throw new Error("Renderer failed to return assetId or fileKey.");
				const filename = path.basename(key);
				const { width, height, fps, durationMs } = renderResult.metadata || {};
				asset = await this.prisma.fileAsset.create({ data: {
					name: filename,
					userId: data.canvas.userId,
					bucket: this.env.R2_ASSETS_BUCKET,
					key,
					size: 0,
					width: width ?? null,
					height: height ?? null,
					fps: fps ?? null,
					duration: durationMs ?? null,
					mimeType: config.format === "webm" ? "video/webm" : "video/mp4",
					isUploaded: true
				} });
			}
			const videoVirtualMedia = createVirtualMedia({ entity: asset }, "Video");
			const outputHandles = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output");
			const videoOutputHandle = outputHandles.find((h) => h.label === "Video Result" || h.dataTypes.includes("Video")) || outputHandles[0];
			if (!videoOutputHandle) return {
				success: false,
				error: "Output handles are missing."
			};
			const newResult = structuredClone(node.result) ?? {
				outputs: [],
				selectedOutputIndex: 0
			};
			newResult.outputs.push({ items: [{
				type: "Video",
				data: videoVirtualMedia,
				outputHandleId: videoOutputHandle.id
			}] });
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult
			};
		} catch (err) {
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "HTML Video Rendering Failed");
			return {
				success: false,
				error: err instanceof Error ? err.message : "HTML Video Rendering failed"
			};
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], HtmlVideoRenderProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], HtmlVideoRenderProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.MEDIA_RENDERER), __decorateMetadata("design:type", Object)], HtmlVideoRenderProcessor.prototype, "mediaRenderer", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], HtmlVideoRenderProcessor.prototype, "env", void 0);
HtmlVideoRenderProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], HtmlVideoRenderProcessor);
var server_default = defineNode(metadata, { backendProcessor: HtmlVideoRenderProcessor });

//#endregion
export { server_default as default };