import { createFalClient, type FalClient } from "@fal-ai/client";
import type { AIProvider } from "@gatewai.studio/node-sdk/server";
import { type EnvConfig, TOKENS } from "@gatewai.studio/server-utils";
import { inject, injectable } from "inversify";
import OpenAI from "openai";

@injectable()
export class AiProviderService implements AIProvider {
	private falClient: FalClient | null = null;
	private openaiClient: OpenAI | null = null;

	constructor(@inject(TOKENS.ENV) private env: EnvConfig) {}

	getFal(): FalClient {
		if (!this.falClient) {
			const key = this.env.FAL_API_KEY;
			if (!key || key === "fal-local" || key === "dummy-fal-key") {
				throw new Error("No FAL_API_KEY provided in environment");
			}
			this.falClient = createFalClient({
				credentials: key,
			});
		}
		return this.falClient;
	}

	getOpenRouterOpenAI(): OpenAI {
		if (!this.openaiClient) {
			const key = this.env.OPENROUTER_API_KEY;
			if (!key || key === "sk-local" || key === "dummy-openrouter-key") {
				throw new Error("No OPENROUTER_API_KEY provided in environment");
			}
			this.openaiClient = new OpenAI({
				apiKey: key,
				baseURL: "https://openrouter.ai/api/v1",
				dangerouslyAllowBrowser: true,
				defaultHeaders: {
					"HTTP-Referer": "https://gatewai.studio",
					"X-OpenRouter-Title": "Gatewai Studio CLI",
				},
			});
		}
		return this.openaiClient;
	}

	getAgentModel<T>(_name: string, _sessionId?: string): T {
		throw new Error(
			"getAgentModel is not implemented in CLI in-memory provider.",
		);
	}
}
