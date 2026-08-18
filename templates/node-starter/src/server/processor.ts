import {
	appendOperation,
	getActiveMediaMetadata,
	type VirtualMediaData,
} from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import {
	StarterNodeConfigSchema,
	type StarterResult,
} from "../shared/index.js";

/**
 * Backend Node Processor
 *
 * Implements the NodeProcessor interface. Executes in the Node.js/Bun server worker
 * during canvas workflow execution (`artifex run` or backend job queues).
 *
 * Dependency Injection:
 * - Use `@inject(TOKENS.<SERVICE>)` to inject engine services.
 * - Available tokens in `@gatewai.studio/node-sdk/server`:
 *   - `TOKENS.GRAPH_RESOLVERS`: Resolves upstream connected inputs, edge data, handles.
 *   - `TOKENS.MEDIA_RESOLVER`: Converts VirtualMediaData to raw Buffers or URLs.
 *   - `TOKENS.STORAGE`: Uploads/downloads files from cloud object storage (R2/S3).
 *   - `TOKENS.AI_PROVIDER`: Interacts with AI generation providers (Fal, OpenRouter).
 *   - `TOKENS.LOGGER`: Structured logging for execution tracing.
 */
@injectable()
export class StarterProcessor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	/**
	 * Main processor execution entrypoint.
	 *
	 * @param ctx Context containing the active node, full canvas graph state, tasks, and abortSignal.
	 * @returns BackendNodeProcessorResult with success flag, newResult, or error message.
	 */
	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<
		BackendNodeProcessorResult<StarterResult>
	> {
		try {
			// 1. Resolve upstream inputs connected to this node
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return {
					success: false,
					error: "Starter node requires an input media item.",
				};
			}

			// 2. Validate and parse configuration
			const config = StarterNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Input item contains no valid VirtualMediaData.",
				};
			}

			// 3. Collect connected dynamic inputs (e.g. Signal or Number modulators)
			const connected = resolver.inputs().allWithHandle();
			const inputs: Record<
				string,
				{ connectionValid: boolean; outputItem: unknown }
			> = {};
			for (const { handle, value } of connected) {
				if (value) {
					inputs[handle.id] = {
						connectionValid: true,
						outputItem: value,
					};
				}
			}

			// 4. Determine output media type and active metadata
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = inputItem.type;

			// 5. Append non-destructive operation to the VirtualMediaData chain.
			// Intermediate transformer nodes do not transcode media on the server;
			// instead, they append an operation description that the WebGPU renderer executes.
			const output = appendOperation(inputMedia, {
				op: "Starter",
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType,
				inputs,
			});

			// 6. Find the output handle definition
			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			if (!outputHandle) {
				return {
					success: false,
					error: "Output handle definition not found on node.",
				};
			}

			// 7. Construct the final NodeResult container
			const newResult = {
				selectedOutputIndex: 0 as const,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: output,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			} as unknown as StarterResult;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Starter node processing failed.",
			};
		}
	}
}
