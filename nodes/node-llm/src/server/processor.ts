import type { VirtualMediaData } from "@gatewai.studio/core";
import {
	type AIProvider,
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type IMediaResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import type { OpenAI } from "openai";
import {
	type LLMNodeConfig,
	LLMNodeConfigSchema,
	type LLMResult,
} from "../shared/index.js";

@injectable()
export class LLMProcessor implements NodeProcessor {
	@inject(TOKENS.GRAPH_RESOLVERS) private graph!: IGraphResolverService;
	@inject(TOKENS.AI_PROVIDER) private aiProvider!: AIProvider;
	@inject(TOKENS.MEDIA_RESOLVER) private mediaResolver!: IMediaResolverService;

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<BackendNodeProcessorResult<LLMResult>> {
		try {
			const nodeConfig = LLMNodeConfigSchema.parse(node.config);

			return this.processOpenAI({ node, data, config: nodeConfig });
		} catch (err: unknown) {
			console.error("LLM Failed:", err);
			return { success: false, error: "LLM processing failed" };
		}
	}

	/**
	 * Loads all image inputs for a node and returns them as base64-encoded
	 * objects ready for each provider's multimodal API.
	 */
	private async loadImageData(
		resolver: ReturnType<IGraphResolverService["forNode"]>,
		userId: string,
	): Promise<Array<{ base64: string; mimeType: string }>> {
		const imageInputs = resolver
			.inputs()
			.asImage()
			.allData() as VirtualMediaData[];
		if (!imageInputs?.length) return [];

		const results: Array<{ base64: string; mimeType: string }> = [];

		for (const imageInput of imageInputs) {
			if (!imageInput) continue;

			const result = await this.mediaResolver.resolveToBuffer(
				imageInput,
				"Image",
				{ userId },
			);

			if (result.buffer) {
				const base64 = result.buffer.toString("base64");
				results.push({
					base64,
					mimeType: result.mimeType ?? "image/png",
				});
			}
		}

		return results;
	}

	private async processOpenAI({
		node,
		data,
		config,
	}: {
		node: BackendNodeProcessorCtx["node"];
		data: BackendNodeProcessorCtx["data"];
		config: LLMNodeConfig;
	}): Promise<BackendNodeProcessorResult<LLMResult>> {
		const openai = this.aiProvider.getOpenRouterOpenAI();
		const resolver = this.graph.forNode(node, data);

		const userPrompt = resolver.input("Prompt").required().asText();
		const systemPrompt = resolver.input("System Prompt").asText();
		const images = await this.loadImageData(resolver, data.canvas.userId);

		logger.debug(`OpenAI LLM — model: ${config.model}, prompt: ${userPrompt}`);

		const inputMessages: OpenAI.Responses.ResponseInput = [];

		if (systemPrompt) {
			inputMessages.push({
				role: "developer",
				content: [{ type: "input_text" as const, text: systemPrompt }],
			});
		}

		const userContent: OpenAI.Responses.ResponseInputContent[] = images.map(
			({ base64, mimeType }) => ({
				type: "input_image" as const,
				detail: "auto" as const,
				image_url: `data:${mimeType};base64,${base64}`,
			}),
		);
		userContent.push({ type: "input_text" as const, text: userPrompt });
		inputMessages.push({ role: "user", content: userContent });

		// Temperature is only valid when reasoning is disabled or absent.
		// When reasoningEffort is "none", we send the effort explicitly so
		// the model skips its internal chain-of-thought, but temperature still
		// applies — matching OpenAI's documented behaviour.
		const supportsTemperature =
			!config.reasoningEffort || config.reasoningEffort === "none";

		const requestParams: OpenAI.Responses.ResponseCreateParamsNonStreaming = {
			model: config.model,
			input: inputMessages,
			...(supportsTemperature && config.temperature !== undefined
				? { temperature: config.temperature }
				: {}),
			...(config.reasoningEffort
				? { reasoning: { effort: config.reasoningEffort } }
				: {}),
			...(config.textVerbosity
				? {
						text: {
							verbosity: config.textVerbosity,
						} as OpenAI.Responses.ResponseTextConfig,
					}
				: {}),
		};

		const response = await openai.responses.create(requestParams);
		const text = response.output_text;

		if (!text) {
			return { success: false, error: "LLM response is empty" };
		}

		return this.buildResult(node, data, text);
	}

	private buildResult(
		node: BackendNodeProcessorCtx["node"],
		data: BackendNodeProcessorCtx["data"],
		text: string,
	): BackendNodeProcessorResult<LLMResult> {
		const outputHandle = data.handles.find(
			(h) => h.nodeId === node.id && h.type === "Output",
		);

		if (!outputHandle) {
			return { success: false, error: "Output handle is missing." };
		}

		const newResult: LLMResult = structuredClone(
			node.result as unknown as LLMResult,
		) ?? { outputs: [], selectedOutputIndex: 0 };

		newResult.outputs.push({
			items: [
				{
					type: "Text",
					data: text,
					outputHandleId: outputHandle.id,
				},
			],
		});
		newResult.selectedOutputIndex = newResult.outputs.length - 1;

		return { success: true, newResult };
	}
}
