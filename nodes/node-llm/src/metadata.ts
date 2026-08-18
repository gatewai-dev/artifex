import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type LLMNodeConfig,
	LLMNodeConfigSchema,
	LLMResultSchema,
} from "./shared/index.js";

export const metadata = defineMetadata({
	type: "LLM",
	displayName: "LLM",
	description: "Prompt a large language model",
	category: "AI",
	subcategory: "Text",
	configSchema: LLMNodeConfigSchema,
	resultSchema: LLMResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: { enabled: true, dataTypes: ["Image"] },
	handles: {
		inputs: [
			{ dataTypes: ["Text"], required: true, label: "Prompt", order: 0 },
			{ dataTypes: ["Text"], label: "System Prompt", order: 1 },
		],
		outputs: [{ dataTypes: ["Text"], label: "Result", order: 0 }],
	},
	defaultConfig: {
		model: "openai/gpt-5.6-luna",
		reasoningEffort: "medium",
		textVerbosity: "medium",
	},
	pricing: (config: LLMNodeConfig) => {
		const MODEL_TOKEN_PRICING: Record<LLMNodeConfig["model"], number> = {
			"openai/gpt-5.6-terra": 4.5,
			"openai/gpt-5.6-luna": 3,
			"openai/gpt-5.6-sol": 9,
			"google/gemini-3.7-flash": 3,
			"x-ai/grok-4.5": 5,
		};

		return MODEL_TOKEN_PRICING[config.model];
	},
});
