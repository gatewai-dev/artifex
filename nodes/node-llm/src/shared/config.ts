import { z } from "zod";

// ─── Models ──────────────────────────────────────────────────────────────────

export const LLM_OPENAI_MODELS = [
	"openai/gpt-5.6-terra",
	"openai/gpt-5.6-luna",
	"openai/gpt-5.6-sol",
	"google/gemini-3.7-flash",
	"x-ai/grok-4.5",
] as const;

export const LLM_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh",
] as const;
export const LLM_TEXT_VERBOSITY = ["low", "medium", "high"] as const;

// ─── Combined ───────────────────────────────────────────────────────────────

export const LLM_NODE_MODELS = [...LLM_OPENAI_MODELS] as const;

export const LLM_OPENAI_MODELS_SET = new Set(LLM_OPENAI_MODELS);

const baseConfig = z
	.object({
		model: z.enum(LLM_NODE_MODELS).default("openai/gpt-5.6-luna"),
		reasoningEffort: z.enum(LLM_REASONING_EFFORTS).optional(),
		textVerbosity: z.enum(LLM_TEXT_VERBOSITY).optional(),
		temperature: z.number().min(0).max(2).optional(),
	})
	.strict();

export const LLMNodeConfigSchema = baseConfig;

export function getDefaultConfigForModel(model: string) {
	if (model.startsWith("openai/")) {
		return {
			reasoningEffort: "medium",
			textVerbosity: "medium",
		} as Partial<z.infer<typeof LLMNodeConfigSchema>>;
	}
	return {
		temperature: 0.7,
	} as Partial<z.infer<typeof LLMNodeConfigSchema>>;
}

export function hasTemperatureSupport(
	model: string,
	reasoningEffort?: string,
): boolean {
	const isOpenAI = model.startsWith("openai/");
	return !isOpenAI || reasoningEffort === "none";
}

export type LLMNodeConfig = z.infer<typeof LLMNodeConfigSchema>;

import {
	createOutputItemSchema,
	MultiOutputGenericSchema,
} from "@gatewai.studio/core";

export const LLMResultSchema = MultiOutputGenericSchema(
	createOutputItemSchema(z.literal("Text"), z.string()),
);

export type LLMResult = z.infer<typeof LLMResultSchema>;
