import { D as createOutputItemSchema, O as createVirtualMedia, a as TOKENS, c as logger, g as FileDataSchema, j as generateId, y as MultiOutputGenericSchema } from "./dist-DdOALdQJ.mjs";
import { n as createFileAsset } from "./server-q978G5Ag.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BLjQvdJL.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-audio-generator/dist/metadata-CZUjjIyR.mjs
const AUDIO_FORMATS = ["mp3"];
const AUDIO_SAMPLE_RATES = [
	"8000",
	"16000",
	"24000",
	"32000",
	"44100",
	"48000"
];
const AUDIO_MODELS = ["bytedance/seed-audio-1.0"];
const AudioGeneratorNodeConfigSchema = z$1.object({
	model: z$1.enum(AUDIO_MODELS).default("bytedance/seed-audio-1.0").describe("The audio model to use"),
	output_format: z$1.enum(AUDIO_FORMATS).default("mp3").describe("Output audio format."),
	sample_rate: z$1.enum(AUDIO_SAMPLE_RATES).default("24000").describe("Sample rate of the output audio in Hz."),
	speed: z$1.number().min(.5).max(2).default(1).describe("Speech speed. 1.0 is normal, 0.5 is half, 2.0 is double."),
	volume: z$1.number().min(.5).max(2).default(1).describe("Volume. 1.0 is normal, 0.5 is half, 2.0 is double."),
	pitch: z$1.number().int().min(-12).max(12).default(0).describe("Voice pitch shift in semitones.")
});
const AudioGeneratorResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Audio"), FileDataSchema));
const metadata = defineMetadata({
	type: "AudioGenerator",
	displayName: "Audio Generator",
	description: "Generate high-quality audio or speech using AI.",
	category: "AI",
	subcategory: "Audio",
	configSchema: AudioGeneratorNodeConfigSchema,
	resultSchema: AudioGeneratorResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: ["Audio", "Image"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Audio"],
			label: "Result",
			order: 0
		}]
	},
	pricing: () => 50,
	defaultConfig: {
		model: "bytedance/seed-audio-1.0",
		output_format: "mp3",
		sample_rate: "24000",
		speed: 1,
		volume: 1,
		pitch: 0
	},
	validation: (_config, inputs) => {
		const promptVal = Object.values(inputs ?? {}).find((val) => typeof val === "string");
		if (promptVal && typeof promptVal === "string" && promptVal.length > 2028) return { prompt_length: `Prompt must be at most 2028 characters (currently ${promptVal.length}).` };
		return null;
	}
});

//#endregion
//#region ../../nodes/node-audio-generator/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AudioGeneratorProcessor = class AudioGeneratorProcessor$1 {
	prisma;
	graph;
	mediaResolver;
	aiProvider;
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const userPrompt = resolver.input("Prompt").required().asText();
			if (userPrompt.length > 2028) throw new Error(`Prompt must be at most 2028 characters (currently ${userPrompt.length}).`);
			const nodeConfig = AudioGeneratorNodeConfigSchema.parse(node.config);
			this.validateAudioDurations(resolver);
			const [imageUrls, audioUrls] = await Promise.all([this.resolveReferenceUrls(data, resolver, "Image"), this.resolveReferenceUrls(data, resolver, "Audio")]);
			if (imageUrls.length > 0 && audioUrls.length > 0) throw new Error("Cannot combine image and audio reference inputs.");
			if (imageUrls.length > 1) throw new Error("Maximum 1 reference image file allowed.");
			if (audioUrls.length > 3) throw new Error("Maximum 3 reference audio files allowed.");
			logger.debug(`Audio Generator (Fal seed-audio) — prompt chars: ${userPrompt.length}, images: ${imageUrls.length}, audios: ${audioUrls.length}`);
			const fal = this.aiProvider.getFal();
			const input = {
				prompt: userPrompt,
				voice: null,
				output_format: nodeConfig.output_format,
				sample_rate: Number(nodeConfig.sample_rate),
				speed: nodeConfig.speed,
				volume: nodeConfig.volume,
				pitch: nodeConfig.pitch
			};
			if (imageUrls.length > 0) input.image_url = imageUrls[0];
			if (audioUrls.length > 0) input.audio_urls = audioUrls;
			const data_fal = (await fal.subscribe(nodeConfig.model, { input })).data;
			if (!data_fal.audio?.url) throw new Error("Fal AI did not return an audio URL");
			const response = await fetch(data_fal.audio.url);
			if (!response.ok) throw new Error(`Failed to fetch audio from Fal: ${response.statusText}`);
			const buffer = Buffer.from(await response.arrayBuffer());
			const contentType = data_fal.audio.content_type ?? "audio/mpeg";
			return this.finaliseAudioResult(node, data, buffer, contentType, nodeConfig.output_format);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, `AudioGenerator processing failed: ${message}`);
			return {
				success: false,
				error: message
			};
		}
	}
	validateAudioDurations(resolver) {
		const audios = resolver.inputs().as("Audio").allWithHandle().map((r) => r.value).filter((v) => v !== null);
		for (const audio of audios) {
			const data = audio.data;
			let durationMs;
			if (data && typeof data === "object" && "metadata" in data) durationMs = data.metadata.durationMs;
			else durationMs = data.entity?.duration != null ? data.entity.duration * 1e3 : 0;
			if (durationMs != null && durationMs > 3e4) throw new Error("Reference audio clips must be 30 seconds or shorter.");
		}
	}
	async resolveReferenceUrls(data, resolver, type) {
		const items = resolver.inputs().as(type).allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0));
		if (!items.length) return [];
		return Promise.all(items.map(async (r) => {
			const outputItem = r.value;
			const result = await this.mediaResolver.resolveToUrl(outputItem.data, type, { userId: data.canvas.userId });
			if (!result.url) throw new Error(`Failed to resolve ${type} reference input URL`);
			return result.url;
		}));
	}
	async finaliseAudioResult(node, data, buffer, contentType, format) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const randId = generateId();
		const extension = format;
		const fileName = `${node.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "").replace(/-+/g, "-")}_${randId}.${extension}`;
		const { asset } = await createFileAsset(this.prisma, {
			userId: data.canvas.userId,
			buffer,
			filename: fileName,
			mimeType: contentType
		});
		const newResult = structuredClone(node.result) ?? {
			outputs: [],
			selectedOutputIndex: 0
		};
		newResult.outputs.push({ items: [{
			type: "Audio",
			data: createVirtualMedia({ entity: asset }, "Audio"),
			outputHandleId: outputHandle.id
		}] });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], AudioGeneratorProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], AudioGeneratorProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], AudioGeneratorProcessor.prototype, "mediaResolver", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], AudioGeneratorProcessor.prototype, "aiProvider", void 0);
AudioGeneratorProcessor = __decorate([injectable()], AudioGeneratorProcessor);
var server_default = defineNode(metadata, { backendProcessor: AudioGeneratorProcessor });

//#endregion
export { server_default as default };