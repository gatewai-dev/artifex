import { v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-noise-generator/dist/metadata-DHOn6plm.mjs
const noiseConfig = configBuilder().field("noiseType", z$1.enum([
	"Perlin",
	"Simplex",
	"Voronoi"
]).default("Perlin"), {
	bindable: false,
	label: "Noise Type"
}).field("outputType", z$1.enum(["Image", "Video"]).default("Image"), {
	bindable: false,
	label: "Output Type"
}).field("width", z$1.number().int().min(16).max(4096).default(512), {
	bindable: false,
	label: "Width"
}).field("height", z$1.number().int().min(16).max(4096).default(512), {
	bindable: false,
	label: "Height"
}).field("scale", z$1.number().min(.1).max(100).default(10), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Scale Signal",
	description: "Scale of the noise pattern. Can be modulated by a static number or a dynamic signal."
}).field("octaves", z$1.number().int().min(1).max(8).default(4), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Octaves Signal",
	description: "Fractal detail depth of the noise."
}).field("persistence", z$1.number().min(0).max(1).default(.5), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Persistence Signal",
	description: "Roughness multiplier for each fractal octave."
}).field("lacunarity", z$1.number().min(1).max(4).default(2), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Lacunarity Signal",
	description: "Frequency spacing multiplier for each fractal octave."
}).field("speed", z$1.number().min(0).max(10).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Speed Signal",
	description: "Speed of time-based noise animation in Video mode."
}).field("colorStart", z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #").default("#000000"), {
	bindable: false,
	label: "Color Start"
}).field("colorEnd", z$1.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a valid hex color starting with #").default("#ffffff"), {
	bindable: false,
	label: "Color End"
}).field("durationMs", z$1.number().int().min(1).max(6e4).default(5e3), {
	bindable: false,
	label: "Duration (ms)"
}).field("fps", z$1.number().int().min(1).max(120).default(30), {
	bindable: false,
	label: "FPS"
}).build();
const NoiseGeneratorNodeConfigSchema = noiseConfig.schema;
const NoiseGeneratorResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const metadata = defineMetadata({
	type: "NoiseGenerator",
	displayName: "Noise Generator",
	description: "Generate procedural Perlin, Simplex, and Voronoi noise.",
	category: "Media",
	subcategory: void 0,
	configSchema: NoiseGeneratorNodeConfigSchema,
	resultSchema: NoiseGeneratorResultSchema,
	configHandles: noiseConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: ["Image", "Video"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		noiseType: "Perlin",
		outputType: "Image",
		width: 512,
		height: 512,
		scale: 10,
		octaves: 4,
		persistence: .5,
		lacunarity: 2,
		speed: 1,
		colorStart: "#000000",
		colorEnd: "#ffffff",
		durationMs: 5e3,
		fps: 30
	}
});

//#endregion
//#region ../../nodes/node-noise-generator/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let NoiseGeneratorProcessor = class NoiseGeneratorProcessor$1 {
	constructor() {}
	async process({ node, data }) {
		try {
			const config = NoiseGeneratorNodeConfigSchema.parse(node.config);
			const isVideo = config.outputType === "Video";
			const metadata$1 = {
				width: config.width,
				height: config.height,
				durationMs: isVideo ? config.durationMs : 0,
				fps: isVideo ? config.fps : void 0
			};
			const finalOutputType = isVideo ? "Video" : "Image";
			const output = createVirtualMedia({
				operation: {
					op: "NoiseGenerator",
					...config,
					dataType: finalOutputType,
					metadata: metadata$1
				},
				metadata: metadata$1,
				children: []
			}, finalOutputType);
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
						type: finalOutputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "NoiseGenerator processing failed"
			};
		}
	}
};
NoiseGeneratorProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], NoiseGeneratorProcessor);
var server_default = defineNode(metadata, { backendProcessor: NoiseGeneratorProcessor });

//#endregion
export { server_default as default };