import { z } from "zod";

export const TaskStepSchema = z.object({
	id: z.string(),
	description: z.string(),
	status: z.enum(["pending", "in_progress", "completed", "failed"]),
	details: z.string().optional(),
});

export const TaskPlanSchema = z.object({
	id: z.string(),
	steps: z.array(TaskStepSchema),
	currentStepIndex: z.number(),
	totalSteps: z.number(),
});

export const ChatMessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "model", "assistant", "system"]),
	text: z.string(),
	createdAt: z.union([z.string(), z.date()]),
	isStreaming: z.boolean().optional(),
	eventType: z.string().optional(),
	messageType: z
		.enum([
			"message",
			"function_call",
			"function_call_result",
			"tool_call",
			"commit_canvas",
		])
		.optional(),
	toolStatus: z.enum(["started", "completed", "failed"]).optional(),
	toolName: z.string().optional(),
	assets: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				mimeType: z.string(),
				url: z.string(),
			}),
		)
		.optional(),
});

export const RunRawModelStreamEventSchema = z.object({
	type: z.literal("raw_model_stream_event"),
	data: z
		.object({
			type: z.string(),
			delta: z.string().optional(),
			response: z
				.object({
					usage: z
						.object({
							inputTokens: z.number().optional(),
							outputTokens: z.number().optional(),
							totalTokens: z.number().optional(),
							inputTokensDetails: z.any().optional(),
							outputTokensDetails: z.any().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
});

export const RunItemStreamEventSchema = z.object({
	type: z.literal("run_item_stream_event"),
	name: z.string(),
	item: z
		.object({
			delta: z.string().optional(),
			rawItem: z
				.object({
					content: z.any().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough()
		.optional(),
});

export const RunAgentUpdatedStreamEventSchema = z.object({
	type: z.literal("agent_updated_stream_event"),
	agent: z.any(),
});

export const GatewaiDoneEventSchema = z.object({
	type: z.literal("done"),
});

export const GatewaiErrorEventSchema = z.object({
	type: z.literal("error"),
	error: z.string(),
});

export const GatewaiCanvasUpdateEventSchema = z.object({
	type: z.literal("commit_canvas"),
});

export const GatewaiTaskProgressEventSchema = z.object({
	type: z.literal("task_progress"),
	planId: z.string(),
	currentStep: z.number(),
	totalSteps: z.number(),
	stepDescription: z.string(),
	status: z.enum([
		"pending",
		"started",
		"in_progress",
		"progress",
		"completed",
		"failed",
	]),
	details: z.string().optional(),
	steps: z.array(TaskStepSchema).optional(),
});

export const GatewaiCanvasCheckpointCreatedEventSchema = z.object({
	type: z.literal("canvas_checkpoint_created"),
	checkpointId: z.string(),
	label: z.string(),
	trigger: z.enum(["user_message", "agent_done"]),
	createdAt: z.string().optional(),
});

export const GatewaiSessionTitleUpdatedEventSchema = z.object({
	type: z.literal("session_title_updated"),
	title: z.string(),
});

export const GatewaiSessionCreatedEventSchema = z.object({
	type: z.literal("session_created"),
	sessionId: z.string(),
	title: z.string(),
});

export const GatewaiCanvasSnapshotEventSchema = z.object({
	type: z.literal("canvas_snapshot"),
	snapshot: z.any(), // bulkUpdateSchema would be cyclic or complex to import here, keep as any but typed in queue
	userMessageId: z.string(),
	description: z.string(),
});

export const GatewaiAgentToolCallEventSchema = z.object({
	type: z.literal("agent_tool_call"),
	callId: z.string(),
	toolName: z.string(),
	status: z.enum(["started", "completed", "failed"]),
	description: z.string(),
	// Optional payload data carried by some tools (e.g. run_workflow -> batchId)
	batchId: z.string().optional(),
});

export const GatewaiRunStartedEventSchema = z.object({
	type: z.literal("run_started"),
	messageId: z.string().optional(),
});

export const GatewaiQueuedEventSchema = z.object({
	type: z.literal("queued"),
	messageId: z.string(),
});

export const GatewaiAgentEventSchema = z.discriminatedUnion("type", [
	RunRawModelStreamEventSchema,
	RunItemStreamEventSchema,
	RunAgentUpdatedStreamEventSchema,
	GatewaiDoneEventSchema,
	GatewaiErrorEventSchema,
	GatewaiCanvasUpdateEventSchema,
	GatewaiTaskProgressEventSchema,
	GatewaiCanvasCheckpointCreatedEventSchema,
	GatewaiSessionTitleUpdatedEventSchema,
	GatewaiSessionCreatedEventSchema,
	GatewaiCanvasSnapshotEventSchema,
	GatewaiAgentToolCallEventSchema,
	GatewaiRunStartedEventSchema,
	GatewaiQueuedEventSchema,
]);
