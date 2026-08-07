import { O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger } from "./dist-D86uNdKf.mjs";
import { a as defineMetadata, i as defineNode } from "./server-BdNfjggX.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-llm/dist/metadata-Di9MKv5R.mjs
const LLM_OPENAI_MODELS = [
	"openai/gpt-5.6-terra",
	"openai/gpt-5.6-luna",
	"openai/gpt-5.6-sol",
	"google/gemini-3.5-flash",
	"x-ai/grok-4.5"
];
const LLM_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh"
];
const LLM_TEXT_VERBOSITY = [
	"low",
	"medium",
	"high"
];
const LLM_NODE_MODELS = [...LLM_OPENAI_MODELS];
const LLM_OPENAI_MODELS_SET = new Set(LLM_OPENAI_MODELS);
const LLMNodeConfigSchema = z$1.object({
	model: z$1.enum(LLM_NODE_MODELS).default("openai/gpt-5.6-luna"),
	reasoningEffort: z$1.enum(LLM_REASONING_EFFORTS).optional(),
	textVerbosity: z$1.enum(LLM_TEXT_VERBOSITY).optional(),
	temperature: z$1.number().min(0).max(2).optional()
}).strict();
const metadata = defineMetadata({
	type: "LLM",
	displayName: "LLM",
	description: "Prompt a large language model",
	category: "AI",
	subcategory: "Text",
	configSchema: LLMNodeConfigSchema,
	resultSchema: MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Text"), z$1.string())),
	isTerminal: true,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: ["Image"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}, {
			dataTypes: ["Text"],
			label: "System Prompt",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Text"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		model: "openai/gpt-5.6-luna",
		reasoningEffort: "medium",
		textVerbosity: "medium"
	},
	pricing: (config) => {
		return {
			"openai/gpt-5.6-terra": 4.5,
			"openai/gpt-5.6-luna": 3,
			"openai/gpt-5.6-sol": 9,
			"google/gemini-3.5-flash": 3,
			"x-ai/grok-4.5": 5
		}[config.model];
	}
});

//#endregion
//#region ../../nodes/node-llm/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LLMProcessor = class LLMProcessor$1 {
	graph;
	aiProvider;
	mediaResolver;
	async process({ node, data }) {
		try {
			const nodeConfig = LLMNodeConfigSchema.parse(node.config);
			return this.processOpenAI({
				node,
				data,
				config: nodeConfig
			});
		} catch (err) {
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, err instanceof Error ? err.message : "LLM Failed");
			return {
				success: false,
				error: "LLM processing failed"
			};
		}
	}
	/**
	* Loads all image inputs for a node and returns them as base64-encoded
	* objects ready for each provider's multimodal API.
	*/
	async loadImageData(resolver, userId) {
		const imageInputs = resolver.inputs().asImage().allData();
		if (!imageInputs?.length) return [];
		const results = [];
		for (const imageInput of imageInputs) {
			if (!imageInput) continue;
			const result = await this.mediaResolver.resolveToBuffer(imageInput, "Image", { userId });
			if (result.buffer) {
				const base64 = result.buffer.toString("base64");
				results.push({
					base64,
					mimeType: result.mimeType ?? "image/png"
				});
			}
		}
		return results;
	}
	async processOpenAI({ node, data, config }) {
		const openai = this.aiProvider.getOpenRouterOpenAI();
		const resolver = this.graph.forNode(node, data);
		const userPrompt = resolver.input("Prompt").required().asText();
		const systemPrompt = resolver.input("System Prompt").asText();
		const images = await this.loadImageData(resolver, data.canvas.userId);
		logger.debug(`OpenAI LLM — model: ${config.model}, prompt: ${userPrompt}`);
		const inputMessages = [];
		if (systemPrompt) inputMessages.push({
			role: "developer",
			content: [{
				type: "input_text",
				text: systemPrompt
			}]
		});
		const userContent = images.map(({ base64, mimeType }) => ({
			type: "input_image",
			detail: "auto",
			image_url: `data:${mimeType};base64,${base64}`
		}));
		userContent.push({
			type: "input_text",
			text: userPrompt
		});
		inputMessages.push({
			role: "user",
			content: userContent
		});
		const supportsTemperature = !config.reasoningEffort || config.reasoningEffort === "none";
		const requestParams = {
			model: config.model,
			input: inputMessages,
			...supportsTemperature && config.temperature !== void 0 ? { temperature: config.temperature } : {},
			...config.reasoningEffort ? { reasoning: { effort: config.reasoningEffort } } : {},
			...config.textVerbosity ? { text: { verbosity: config.textVerbosity } } : {}
		};
		const text = (await openai.responses.create(requestParams)).output_text;
		if (!text) return {
			success: false,
			error: "LLM response is empty"
		};
		return this.buildResult(node, data, text);
	}
	buildResult(node, data, text) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "Output handle is missing."
		};
		const newResult = structuredClone(node.result) ?? {
			outputs: [],
			selectedOutputIndex: 0
		};
		newResult.outputs.push({ items: [{
			type: "Text",
			data: text,
			outputHandleId: outputHandle.id
		}] });
		newResult.selectedOutputIndex = newResult.outputs.length - 1;
		return {
			success: true,
			newResult
		};
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], LLMProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], LLMProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], LLMProcessor.prototype, "mediaResolver", void 0);
LLMProcessor = __decorate([injectable()], LLMProcessor);
var server_default = defineNode(metadata, { backendProcessor: LLMProcessor });

//#endregion
export { server_default as default };