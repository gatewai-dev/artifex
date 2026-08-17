import { S as generateId, _ as createOutputItemSchema, a as FileDataSchema, l as MultiOutputGenericSchema, v as createVirtualMedia } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS, c as logger } from "./dist-CsJ7TTyG.mjs";
import { n as createFileAsset } from "./server-BoqMO5Jh.mjs";
import "./src-DTpmEm7a.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-text-to-speech/dist/metadata-Dz-bxksP.mjs
const TTS_GEMINI_VOICES = [
	"Achernar",
	"Achird",
	"Algenib",
	"Algieba",
	"Alnilam",
	"Aoede",
	"Autonoe",
	"Callirrhoe",
	"Charon",
	"Despina",
	"Enceladus",
	"Erinome",
	"Fenrir",
	"Gacrux",
	"Iapetus",
	"Kore",
	"Laomedeia",
	"Leda",
	"Orus",
	"Pulcherrima",
	"Puck",
	"Rasalgethi",
	"Sadachbia",
	"Sadaltager",
	"Schedar",
	"Sulafat",
	"Umbriel",
	"Vindemiatrix",
	"Zephyr",
	"Zubenelgenubi"
];
const TTS_GEMINI_LANGUAGES = [
	"Arabic (Egypt)",
	"Bangla (Bangladesh)",
	"Dutch (Netherlands)",
	"English (India)",
	"English (US)",
	"French (France)",
	"German (Germany)",
	"Hindi (India)",
	"Indonesian (Indonesia)",
	"Italian (Italy)",
	"Japanese (Japan)",
	"Korean (South Korea)",
	"Marathi (India)",
	"Polish (Poland)",
	"Portuguese (Brazil)",
	"Romanian (Romania)",
	"Russian (Russia)",
	"Spanish (Spain)",
	"Tamil (India)",
	"Telugu (India)",
	"Thai (Thailand)",
	"Turkish (Turkey)",
	"Ukrainian (Ukraine)",
	"Vietnamese (Vietnam)",
	"Afrikaans (South Africa)",
	"Albanian (Albania)",
	"Amharic (Ethiopia)",
	"Arabic (World)",
	"Armenian (Armenia)",
	"Azerbaijani (Azerbaijan)",
	"Basque (Spain)",
	"Belarusian (Belarus)",
	"Bulgarian (Bulgaria)",
	"Burmese (Myanmar)",
	"Catalan (Spain)",
	"Cebuano (Philippines)",
	"Chinese Mandarin (China)",
	"Chinese Mandarin (Taiwan)",
	"Croatian (Croatia)",
	"Czech (Czech Republic)",
	"Danish (Denmark)",
	"English (Australia)",
	"English (UK)",
	"Estonian (Estonia)",
	"Filipino (Philippines)",
	"Finnish (Finland)",
	"French (Canada)",
	"Galician (Spain)",
	"Georgian (Georgia)",
	"Greek (Greece)",
	"Gujarati (India)",
	"Haitian Creole (Haiti)",
	"Hebrew (Israel)",
	"Hungarian (Hungary)",
	"Icelandic (Iceland)",
	"Javanese (Java)",
	"Kannada (India)",
	"Konkani (India)",
	"Lao (Laos)",
	"Latin (Vatican City)",
	"Latvian (Latvia)",
	"Lithuanian (Lithuania)",
	"Luxembourgish (Luxembourg)",
	"Macedonian (North Macedonia)",
	"Maithili (India)",
	"Malagasy (Madagascar)",
	"Malay (Malaysia)",
	"Malayalam (India)",
	"Mongolian (Mongolia)",
	"Nepali (Nepal)",
	"Norwegian Bokmal (Norway)",
	"Norwegian Nynorsk (Norway)",
	"Odia (India)",
	"Pashto (Afghanistan)",
	"Persian (Iran)",
	"Portuguese (Portugal)",
	"Punjabi (India)",
	"Serbian (Serbia)",
	"Sindhi (India)",
	"Sinhala (Sri Lanka)",
	"Slovak (Slovakia)",
	"Slovenian (Slovenia)",
	"Spanish (Latin America)",
	"Spanish (Mexico)",
	"Swahili (Kenya)",
	"Swedish (Sweden)",
	"Urdu (Pakistan)"
];
const TextToSpeechNodeConfigSchema = z$1.object({
	provider: z$1.literal("gemini").default("gemini").describe("Gemini TTS provider"),
	languageCode: z$1.union([z$1.enum(TTS_GEMINI_LANGUAGES), z$1.literal("auto")]).default("auto").describe("Language for multilingual synthesis"),
	temperature: z$1.number().min(0).max(2).default(1).describe("Controls the randomness of the speech output"),
	outputFormat: z$1.enum([
		"mp3",
		"wav",
		"ogg_opus"
	]).default("mp3").describe("Audio output format"),
	speakerConfig: z$1.array(z$1.object({
		speaker: z$1.string().regex(/^[A-Za-z0-9]*$/, "Speaker alias must be alphanumeric with no whitespace").optional().describe("Alias used to identify this speaker in the prompt (alphanumeric, no whitespace)"),
		voice: z$1.enum(TTS_GEMINI_VOICES).describe("Voice preset for this speaker")
	})).max(2).optional().describe("Multi-speaker voice configuration")
}).describe("Configuration for the Text-to-Speech node");
const TextToSpeechResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Audio"), FileDataSchema));
const metadata = defineMetadata({
	type: "TextToSpeech",
	displayName: "Text to Speech",
	description: "Create speech from text",
	category: "AI",
	subcategory: "Audio",
	configSchema: TextToSpeechNodeConfigSchema,
	resultSchema: TextToSpeechResultSchema,
	isTerminal: true,
	isDynamicPricing: true,
	isTransient: false,
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}, {
			dataTypes: ["Text"],
			required: false,
			label: "Style Instructions",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Audio"],
			label: "Result",
			order: 0
		}]
	},
	pricing: (_config, inputs) => {
		if (!inputs) return 15;
		const textValues = Object.values(inputs).filter((val) => typeof val === "string");
		if (textValues.length === 0) return 15;
		const dollarCost = textValues.reduce((longest, current) => current.length > longest.length ? current : longest, "").length / 1e3 * .15;
		return Math.max(15, Math.ceil(dollarCost * 100));
	},
	defaultConfig: {
		provider: "gemini",
		languageCode: "auto",
		temperature: 1,
		outputFormat: "mp3",
		speakerConfig: [{
			speaker: "Speaker1",
			voice: "Kore"
		}]
	}
});

//#endregion
//#region ../../nodes/node-text-to-speech/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TextToSpeechProcessor = class TextToSpeechProcessor$1 {
	prisma;
	graph;
	aiProvider;
	constructor() {}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const userPrompt = resolver.input("Prompt").required().asText();
			const styleInstructions = resolver.input("Style Instructions").asText() || "";
			const nodeConfig = TextToSpeechNodeConfigSchema.parse(node.config);
			return this.processGemini(node, data, userPrompt, styleInstructions, nodeConfig);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, `TextToSpeech processing failed: ${message}`);
			return {
				success: false,
				error: "TextToSpeech processing failed"
			};
		}
	}
	async processGemini(node, data, userPrompt, styleInstructions, nodeConfig) {
		if (nodeConfig.provider !== "gemini") return {
			success: false,
			error: "Invalid provider for Gemini processing"
		};
		let prompt = userPrompt;
		let speakers;
		let voice;
		const speakerConfig = nodeConfig.speakerConfig || [];
		if (speakerConfig.length > 1) speakers = speakerConfig.map((sc, index) => {
			const originalAlias = sc.speaker?.trim() || `Speaker ${index + 1}`;
			const cleanAlias = originalAlias.replace(/\s+/g, "_").replace(/[^\w]/g, "");
			if (originalAlias !== cleanAlias) {
				const escaped = originalAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const regex = new RegExp(`\\b${escaped}\\s*:`, "g");
				prompt = prompt.replace(regex, `${cleanAlias}:`);
			}
			return {
				voice: sc.voice,
				speaker_id: cleanAlias
			};
		});
		else voice = speakerConfig[0]?.voice || "Kore";
		logger.debug(`Gemini TTS (Fal) — voice: ${voice}, language: ${nodeConfig.languageCode}, chars: ${prompt.length}`);
		const fal = this.aiProvider.getFal();
		const input = {
			prompt,
			voice,
			style_instructions: styleInstructions || void 0,
			language_code: nodeConfig.languageCode === "auto" ? void 0 : nodeConfig.languageCode,
			speakers,
			temperature: nodeConfig.temperature,
			output_format: nodeConfig.outputFormat
		};
		console.log({ input });
		const data_fal = (await fal.subscribe("fal-ai/gemini-3.1-flash-tts", { input })).data;
		if (!data_fal.audio?.url) throw new Error("Fal AI did not return an audio URL");
		const response = await fetch(data_fal.audio.url);
		if (!response.ok) throw new Error(`Failed to fetch audio from Fal: ${response.statusText}`);
		let extension = "mp3";
		let contentType = "audio/mpeg";
		if (nodeConfig.outputFormat === "wav") {
			extension = "wav";
			contentType = "audio/wav";
		} else if (nodeConfig.outputFormat === "ogg_opus") {
			extension = "ogg";
			contentType = "audio/ogg";
		}
		const buffer = Buffer.from(await response.arrayBuffer());
		return this.finaliseAudioResult(node, data, buffer, contentType, extension);
	}
	/**
	* Parses metadata, uploads the buffer to storage, persists the asset row,
	* locates the output handle, and assembles the node result.
	*/
	async finaliseAudioResult(node, data, buffer, contentType, extension = "mp3") {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const randId = generateId();
		const fileName = `${node.name}_${randId}.${extension}`;
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
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], TextToSpeechProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], TextToSpeechProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], TextToSpeechProcessor.prototype, "aiProvider", void 0);
TextToSpeechProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], TextToSpeechProcessor);
var server_default = defineNode(metadata, { backendProcessor: TextToSpeechProcessor });

//#endregion
export { server_default as default };