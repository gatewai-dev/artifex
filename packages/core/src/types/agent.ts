import type { z } from "zod";
import type * as schemas from "../schemas/agent.js";

export type MessageRole = "user" | "model" | "assistant" | "system";

export type TaskStep = z.infer<typeof schemas.TaskStepSchema>;
export type TaskPlan = z.infer<typeof schemas.TaskPlanSchema>;

export type RunRawModelStreamEvent = z.infer<
	typeof schemas.RunRawModelStreamEventSchema
>;
export type RunItemStreamEvent = z.infer<
	typeof schemas.RunItemStreamEventSchema
>;
export type RunAgentUpdatedStreamEvent = z.infer<
	typeof schemas.RunAgentUpdatedStreamEventSchema
>;

export type GatewaiDoneEvent = z.infer<typeof schemas.GatewaiDoneEventSchema>;
export type GatewaiErrorEvent = z.infer<typeof schemas.GatewaiErrorEventSchema>;
export type GatewaiCanvasUpdateEvent = z.infer<
	typeof schemas.GatewaiCanvasUpdateEventSchema
>;
export type GatewaiTaskProgressEvent = z.infer<
	typeof schemas.GatewaiTaskProgressEventSchema
>;
export type GatewaiCanvasCheckpointCreatedEvent = z.infer<
	typeof schemas.GatewaiCanvasCheckpointCreatedEventSchema
>;
export type GatewaiSessionTitleUpdatedEvent = z.infer<
	typeof schemas.GatewaiSessionTitleUpdatedEventSchema
>;
export type GatewaiSessionCreatedEvent = z.infer<
	typeof schemas.GatewaiSessionCreatedEventSchema
>;
export type GatewaiCanvasSnapshotEvent = z.infer<
	typeof schemas.GatewaiCanvasSnapshotEventSchema
>;
export type GatewaiAgentToolCallEvent = z.infer<
	typeof schemas.GatewaiAgentToolCallEventSchema
>;
export type GatewaiRunStartedEvent = z.infer<
	typeof schemas.GatewaiRunStartedEventSchema
>;
export type GatewaiQueuedEvent = z.infer<
	typeof schemas.GatewaiQueuedEventSchema
>;

export type GatewaiAgentEvent = z.infer<typeof schemas.GatewaiAgentEventSchema>;

export type ChatMessage = z.infer<typeof schemas.ChatMessageSchema>;

export interface CanvasCheckpoint {
	id: string;
	canvasId: string;
	agentSessionId: string;
	label: string;
	trigger: "user_message" | "agent_done";
	createdAt: string | Date;
}
