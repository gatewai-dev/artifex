import { C as VirtualMediaDataSchema, D as createOutputItemSchema, O as createVirtualMedia, a as TOKENS, c as logger, j as generateId, s as getAssetKey, y as MultiOutputGenericSchema } from "./dist-D9o3ES2C.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bh8-kZ60.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-svg/dist/metadata-B8DsR1Y-.mjs
const SVG_NODE_MODELS = ["fal-ai/recraft/v4.1/text-to-vector", "fal-ai/recraft/v4.1/pro/text-to-vector"];
const SVG_PRESET_SIZES = [
	"square_hd",
	"square",
	"portrait_4_3",
	"portrait_16_9",
	"landscape_4_3",
	"landscape_16_9"
];
const SVG_SIZES = [...SVG_PRESET_SIZES, "custom"];
const SvgNodeConfigSchema = z$1.object({
	model: z$1.enum(SVG_NODE_MODELS).default("fal-ai/recraft/v4.1/text-to-vector"),
	imageSize: z$1.union([z$1.enum(SVG_PRESET_SIZES), z$1.object({
		width: z$1.number().int().min(64).max(2048),
		height: z$1.number().int().min(64).max(2048)
	})]).default("square_hd"),
	colors: z$1.array(z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #")).max(10).default([]),
	backgroundColor: z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #").nullable().default(null)
}).strict();
const SvgResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema));
const defaultConfig = {
	model: SVG_NODE_MODELS[0],
	imageSize: "square_hd",
	colors: [],
	backgroundColor: null
};
const PRICE_TABLE = {
	"fal-ai/recraft/v4.1/text-to-vector": 10,
	"fal-ai/recraft/v4.1/pro/text-to-vector": 30
};
const metadata = defineMetadata({
	type: "SvgGen",
	displayName: "SVG Generator",
	description: "Generate SVG vector graphics",
	category: "AI",
	subcategory: "Vector",
	configSchema: SvgNodeConfigSchema,
	resultSchema: SvgResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: {
		enabled: false,
		dataTypes: ["SVG"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}],
		outputs: [{
			dataTypes: ["SVG"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig,
	pricing: (config) => PRICE_TABLE[config.model]
});

//#endregion
//#region ../../nodes/node-svg/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SvgProcessor = class SvgProcessor$1 {
	prisma;
	env;
	storage;
	graph;
	aiProvider;
	async process({ node, data }) {
		try {
			const nodeConfig = SvgNodeConfigSchema.parse(node.config);
			const userPrompt = this.graph.forNode(node, data).input("Prompt").required().asText();
			if (!userPrompt?.trim()) return {
				success: false,
				error: "Prompt is required."
			};
			const { buffer } = await this.#generateWithFal(nodeConfig, userPrompt);
			return await this.#persistResult(buffer, node, data);
		} catch (err) {
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "SVG Generation Failed");
			return {
				success: false,
				error: err instanceof Error ? err.message : "SVG Generation failed"
			};
		}
	}
	async #generateWithFal(nodeConfig, userPrompt) {
		const fal = this.aiProvider.getFal();
		const input = {
			prompt: userPrompt,
			image_size: nodeConfig.imageSize,
			enable_safety_checker: false
		};
		if (nodeConfig.colors.length > 0) input.colors = nodeConfig.colors.map(hexToRgb);
		if (nodeConfig.backgroundColor) input.background_color = hexToRgb(nodeConfig.backgroundColor);
		logger.debug(`fal.ai recraft text-to-vector — model: ${nodeConfig.model}, prompt: ${userPrompt}`);
		const result = await fal.subscribe(nodeConfig.model, { input });
		const image = result.data.images?.[0];
		if (!image?.url) {
			logger.error(`fal.ai response error: ${JSON.stringify(result.data)}`);
			throw new Error("No SVG URL returned from recraft");
		}
		const response = await fetch(image.url);
		if (!response.ok) throw new Error(`Failed to download SVG from fal: ${response.statusText}`);
		return { buffer: Buffer.from(await response.arrayBuffer()) };
	}
	async #persistResult(buffer, node, data) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const contentType = "image/svg+xml";
		const randId = generateId();
		const fileName = `${node.name}_${randId}.svg`;
		const key = getAssetKey(fileName);
		const bucket = this.env.R2_ASSETS_BUCKET;
		await this.storage.uploadToStorage(buffer, key, contentType, bucket);
		let asset;
		try {
			asset = await this.prisma.fileAsset.create({ data: {
				name: fileName,
				userId: data.canvas.userId,
				bucket,
				key,
				size: buffer.length,
				mimeType: contentType
			} });
		} catch (dbErr) {
			logger.error(`DB write failed for asset "${key}"; attempting storage cleanup. Error: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`);
			try {
				await this.storage.deleteFromStorage(key, bucket);
			} catch (cleanupErr) {
				logger.error(`Storage cleanup failed for orphaned asset "${key}": ${cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr)}`);
			}
			throw dbErr;
		}
		const newResult = cloneResult(node.result);
		newResult.outputs.push({ items: [{
			type: "SVG",
			data: createVirtualMedia({ entity: asset }, "SVG"),
			outputHandleId: outputHandle.id
		}] });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], SvgProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], SvgProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], SvgProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], SvgProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], SvgProcessor.prototype, "aiProvider", void 0);
SvgProcessor = __decorate([injectable()], SvgProcessor);
function hexToRgb(hex) {
	const clean = hex.replace("#", "");
	const num = parseInt(clean, 16);
	return {
		r: num >> 16 & 255,
		g: num >> 8 & 255,
		b: num & 255
	};
}
function cloneResult(existing) {
	if (existing == null) return {
		outputs: [],
		selectedOutputIndex: 0
	};
	return structuredClone(existing);
}
var server_default = defineNode(metadata, { backendProcessor: SvgProcessor });

//#endregion
export { server_default as default };