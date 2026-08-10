import { i as __require, t as __commonJSMin } from "./chunk-DPkJJFeX.mjs";
import { createReadStream } from "node:fs";
import fs$1 from "node:fs/promises";
import z, { z as z$1 } from "zod";
import { nanoid } from "nanoid";
import pino from "pino";
import { Container, inject, injectable, postConstruct } from "inversify";
import assert from "node:assert";
import { PassThrough, Readable } from "node:stream";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//#region ../../packages/core/dist/index.mjs
const envSchema = z.object({
	BASE_URL: z.url(),
	RENDERER_URL: z.url().optional(),
	RUNPOD_API_KEY: z.string().optional(),
	NODE_ENV: z.enum([
		"development",
		"production",
		"staging",
		"test"
	]).default("development"),
	PORT: z.coerce.number().default(8081),
	REDIS_HOST: z.string().min(1),
	REDIS_PORT: z.coerce.number(),
	REDIS_PASSWORD: z.string().optional(),
	OPENROUTER_API_KEY: z.string().min(1, { error: "Open Router API key is mandatory" }),
	FAL_API_KEY: z.string().min(1, { error: "Fal API key is mandatory" }),
	LOG_LEVEL: z.string().default("info"),
	DISABLE_EMAIL_SIGNUP: z.string().toLowerCase().transform((val) => val === "true").default(false),
	MAX_CONCURRENT_ASSISTANT_JOBS: z.coerce.number().default(50),
	MAX_CONCURRENT_WORKFLOW_JOBS: z.coerce.number().default(50),
	MAX_CONCURRENT_RENDERING_JOBS: z.coerce.number().default(100),
	ENABLE_PRICING: z.string().toLowerCase().transform((val) => val === "true").default(true).optional(),
	WEBHOOK_PROXY_URL: z.string().optional(),
	DODO_PAYMENTS_API_KEY: z.string().optional(),
	DODO_PAYMENTS_WEBHOOK_SECRET: z.string().optional(),
	DODO_PAYMENTS_BASE_URL: z.url(),
	GOOGLE_AUTH_ENABLED: z.string().toLowerCase().transform((val) => val === "true").default(false).optional(),
	GOOGLE_CLIENT_ID: z.string().min(1).optional(),
	GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
	EMAIL_PSW_AUTH_ENABLED: z.string().toLowerCase().transform((val) => val === "true").default(false),
	AWS_REGION: z.enum([
		"eu-central-1",
		"eu-central-2",
		"eu-west-1",
		"eu-west-2",
		"eu-west-3",
		"eu-south-1",
		"eu-north-1",
		"us-east-1",
		"us-east-2",
		"us-west-1",
		"us-west-2",
		"af-south-1",
		"ap-south-1",
		"ap-east-1",
		"ap-southeast-1",
		"ap-southeast-2",
		"ap-northeast-1",
		"ap-northeast-2",
		"ap-northeast-3",
		"ap-southeast-4",
		"ap-southeast-5",
		"ca-central-1",
		"me-south-1",
		"sa-east-1"
	]).optional(),
	AWS_ACCESS_KEY_ID: z.string().optional(),
	AWS_SECRET_ACCESS_KEY: z.string().optional(),
	AWS_BUCKET_NAME: z.string().optional(),
	SENTRY_DSN: z.string().optional(),
	FRONTEND_PATH: z.string().min(1),
	R2_ASSETS_BUCKET: z.string().min(1),
	R2_S3_API_ENDPOINT: z.string().min(1),
	R2_ACCESS_KEY_ID: z.string().min(1),
	R2_SECRET_ACCESS_KEY: z.string().min(1),
	R2_CUSTOM_DOMAIN: z.string().optional(),
	ADMIN_EMAIL_ADDRESS: z.string().optional(),
	GRAPH_ENGINE_CANCELLATION_POLL_INTERVAL: z.coerce.number().default(5e3),
	GRAPH_ENGINE_WORKER_LOCK_DURATION: z.coerce.number().default(12e5),
	GRAPH_ENGINE_CANCELLATION_TTL: z.coerce.number().default(86400)
}).superRefine((data, ctx) => {
	if (data.GOOGLE_AUTH_ENABLED) {
		for (const [field, message] of [["GOOGLE_CLIENT_ID", "Required when GOOGLE_AUTH_ENABLED is true"], ["GOOGLE_CLIENT_SECRET", "Required when GOOGLE_AUTH_ENABLED is true"]]) if (!data[field]) ctx.addIssue({
			code: "custom",
			path: [field],
			message
		});
	}
	if (!data.EMAIL_PSW_AUTH_ENABLED && !data.GOOGLE_AUTH_ENABLED) ctx.addIssue({
		code: "custom",
		path: ["EMAIL_PSW_AUTH_ENABLED"],
		message: "At least one auth method must be enabled: EMAIL_PSW_AUTH_ENABLED or GOOGLE_AUTH_ENABLED"
	});
	if (data.ENABLE_PRICING) {
		for (const [field, message] of [["DODO_PAYMENTS_API_KEY", "Required when ENABLE_PRICING is true"], ["DODO_PAYMENTS_WEBHOOK_SECRET", "Required when ENABLE_PRICING is true"]]) if (!data[field]) ctx.addIssue({
			code: "custom",
			path: [field],
			message
		});
	}
});
var ModerationError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ModerationError";
	}
};
const USER_FEATURE_FLAGS = { SEEDANCE2: "SEEDANCE_2" };
const ALL_FEATURE_FLAGS = { ...USER_FEATURE_FLAGS };
/**
* Generates a unique ID using nanoid.
* This function is cross-platform compatible (Node.js and Browser).
*
* @param size - Optional size of the ID (default is 21)
* @returns A unique string ID
*/
const generateId = (size) => {
	return nanoid(size);
};
const AGENT_MODELS = [
	{
		value: "openai/gpt-5.6-terra",
		label: "GPT 5.6 Terra",
		isMultiModal: true,
		apiType: "chat"
	},
	{
		value: "openai/gpt-5.6-luna",
		label: "GPT 5.6 Luna",
		isMultiModal: true,
		apiType: "chat"
	},
	{
		value: "openai/gpt-5.6-sol",
		label: "GPT 5.6 Sol",
		isMultiModal: true,
		apiType: "chat"
	},
	{
		value: "moonshotai/kimi-k3",
		label: "Kimi K3",
		isMultiModal: false,
		apiType: "chat"
	},
	{
		value: "deepseek/deepseek-v4-pro",
		label: "DeepSeek V4 Pro",
		isMultiModal: false,
		apiType: "chat"
	},
	{
		value: "~deepseek/deepseek-v4-flash-latest",
		label: "DeepSeek V4 Flash",
		isMultiModal: false,
		useForGuests: true,
		apiType: "chat"
	}
];
function getGuestAgentModel() {
	return AGENT_MODELS.find((m) => m.useForGuests === true);
}
const GUEST_AGENT_MODEL = getGuestAgentModel()?.value;
const HandleDefinitionSchema = z.object({
	dataTypes: z.custom(),
	label: z.string(),
	required: z.boolean().optional(),
	order: z.number(),
	description: z.string().optional()
});
const ConfigHandleSchema = z.object({
	configKey: z.string(),
	dataTypes: z.custom(),
	label: z.string(),
	description: z.string().optional()
});
/**
* Metadata defining the interface and identity of a node.
* This is safe to import in any environment.
*/
const NodeMetadataSchema = z.object({
	type: z.string().min(1),
	version: z.number().int().positive().optional(),
	baseType: z.string().optional(),
	displayName: z.string().min(1),
	description: z.string().optional(),
	showInQuickAccess: z.boolean().optional(),
	showInSidebar: z.boolean().optional(),
	category: z.string().min(1),
	subcategory: z.string().optional(),
	handles: z.object({
		inputs: z.array(HandleDefinitionSchema),
		outputs: z.array(HandleDefinitionSchema)
	}),
	variableInputs: z.discriminatedUnion("enabled", [z.object({
		enabled: z.literal(true),
		dataTypes: z.custom()
	}), z.object({
		enabled: z.literal(false),
		dataTypes: z.custom().optional()
	})]).optional(),
	variableOutputs: z.discriminatedUnion("enabled", [z.object({
		enabled: z.literal(true),
		dataTypes: z.custom()
	}), z.object({
		enabled: z.literal(false),
		dataTypes: z.custom().optional()
	})]).optional(),
	isTerminal: z.boolean(),
	isTransient: z.boolean().optional(),
	configSchema: z.custom().optional(),
	defaultConfig: z.record(z.string(), z.unknown()).optional(),
	pricing: z.any().optional(),
	isDynamicPricing: z.boolean().optional(),
	validation: z.any().optional(),
	resultSchema: z.custom().optional(),
	configHandles: z.array(ConfigHandleSchema).optional()
});
const TaskStepSchema = z$1.object({
	id: z$1.string(),
	description: z$1.string(),
	status: z$1.enum([
		"pending",
		"in_progress",
		"completed",
		"failed"
	]),
	details: z$1.string().optional()
});
const TaskPlanSchema = z$1.object({
	id: z$1.string(),
	steps: z$1.array(TaskStepSchema),
	currentStepIndex: z$1.number(),
	totalSteps: z$1.number()
});
const ChatMessageSchema = z$1.object({
	id: z$1.string(),
	role: z$1.enum([
		"user",
		"model",
		"assistant",
		"system"
	]),
	text: z$1.string(),
	createdAt: z$1.union([z$1.string(), z$1.date()]),
	isStreaming: z$1.boolean().optional(),
	eventType: z$1.string().optional(),
	messageType: z$1.enum([
		"message",
		"function_call",
		"function_call_result",
		"tool_call",
		"commit_canvas"
	]).optional(),
	toolStatus: z$1.enum([
		"started",
		"completed",
		"failed"
	]).optional(),
	toolName: z$1.string().optional(),
	assets: z$1.array(z$1.object({
		id: z$1.string(),
		name: z$1.string(),
		mimeType: z$1.string(),
		url: z$1.string()
	})).optional()
});
const RunRawModelStreamEventSchema = z$1.object({
	type: z$1.literal("raw_model_stream_event"),
	data: z$1.object({
		type: z$1.string(),
		delta: z$1.string().optional(),
		response: z$1.object({ usage: z$1.object({
			inputTokens: z$1.number().optional(),
			outputTokens: z$1.number().optional(),
			totalTokens: z$1.number().optional(),
			inputTokensDetails: z$1.any().optional(),
			outputTokensDetails: z$1.any().optional()
		}).passthrough().optional() }).passthrough().optional()
	}).passthrough()
});
const RunItemStreamEventSchema = z$1.object({
	type: z$1.literal("run_item_stream_event"),
	name: z$1.string(),
	item: z$1.object({
		delta: z$1.string().optional(),
		rawItem: z$1.object({ content: z$1.any().optional() }).passthrough().optional()
	}).passthrough().optional()
});
const RunAgentUpdatedStreamEventSchema = z$1.object({
	type: z$1.literal("agent_updated_stream_event"),
	agent: z$1.any()
});
const GatewaiDoneEventSchema = z$1.object({ type: z$1.literal("done") });
const GatewaiErrorEventSchema = z$1.object({
	type: z$1.literal("error"),
	error: z$1.string()
});
const GatewaiCanvasUpdateEventSchema = z$1.object({ type: z$1.literal("commit_canvas") });
const GatewaiTaskProgressEventSchema = z$1.object({
	type: z$1.literal("task_progress"),
	planId: z$1.string(),
	currentStep: z$1.number(),
	totalSteps: z$1.number(),
	stepDescription: z$1.string(),
	status: z$1.enum([
		"pending",
		"started",
		"in_progress",
		"progress",
		"completed",
		"failed"
	]),
	details: z$1.string().optional(),
	steps: z$1.array(TaskStepSchema).optional()
});
const GatewaiCanvasCheckpointCreatedEventSchema = z$1.object({
	type: z$1.literal("canvas_checkpoint_created"),
	checkpointId: z$1.string(),
	label: z$1.string(),
	trigger: z$1.enum(["user_message", "agent_done"]),
	createdAt: z$1.string().optional()
});
const GatewaiSessionTitleUpdatedEventSchema = z$1.object({
	type: z$1.literal("session_title_updated"),
	title: z$1.string()
});
const GatewaiSessionCreatedEventSchema = z$1.object({
	type: z$1.literal("session_created"),
	sessionId: z$1.string(),
	title: z$1.string()
});
const GatewaiCanvasSnapshotEventSchema = z$1.object({
	type: z$1.literal("canvas_snapshot"),
	snapshot: z$1.any(),
	userMessageId: z$1.string(),
	description: z$1.string()
});
const GatewaiAgentToolCallEventSchema = z$1.object({
	type: z$1.literal("agent_tool_call"),
	callId: z$1.string(),
	toolName: z$1.string(),
	status: z$1.enum([
		"started",
		"completed",
		"failed"
	]),
	description: z$1.string(),
	batchId: z$1.string().optional()
});
const GatewaiRunStartedEventSchema = z$1.object({
	type: z$1.literal("run_started"),
	messageId: z$1.string().optional()
});
const GatewaiQueuedEventSchema = z$1.object({
	type: z$1.literal("queued"),
	messageId: z$1.string()
});
const GatewaiAgentEventSchema = z$1.discriminatedUnion("type", [
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
	GatewaiQueuedEventSchema
]);
const DataTypeVal = {
	Text: "Text",
	Number: "Number",
	Boolean: "Boolean",
	Image: "Image",
	Video: "Video",
	Audio: "Audio",
	SVG: "SVG",
	Caption: "Caption",
	Lottie: "Lottie",
	ThreeD: "ThreeD",
	GIF: "GIF",
	Signal: "Signal",
	LUT: "LUT"
};
const DataTypes = Object.values(DataTypeVal);
const JsonValueSchema = z.lazy(() => z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(JsonValueSchema),
	z.record(z.string(), JsonValueSchema.optional())
]));
/**
* Zod schema for the FileAsset model
* Matches the Prisma schema definitions for types and nullability.
*/
const FileAssetSchema = z.object({
	id: z.cuid2(),
	name: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.cuid2().nullable(),
	width: z.number().int().nullable(),
	height: z.number().int().nullable(),
	bucket: z.string(),
	size: z.number().int(),
	mimeType: z.string(),
	key: z.string(),
	isUploaded: z.boolean().default(true),
	duration: z.number().int().nullable(),
	sampleRate: z.number().int().nullable().optional(),
	channels: z.number().int().nullable().optional(),
	bitDepth: z.number().int().nullable().optional(),
	audioCodec: z.string().nullable().optional(),
	audioBitrate: z.number().int().nullable().optional(),
	fps: z.number().int().nullable(),
	fingerprint: z.string().nullable()
});
const MIME_TYPES = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	svg: "image/svg+xml",
	mp4: "video/mp4",
	webm: "video/webm",
	mov: "video/quicktime",
	mp3: "audio/mpeg",
	wav: "audio/wav",
	ogg: "audio/ogg",
	pdf: "application/pdf",
	json: "application/json",
	txt: "text/plain",
	srt: "text/srt",
	aac: "audio/aac",
	flac: "audio/flac"
};
const COMPOSITE_OPERATIONS = [
	"source-over",
	"source-in",
	"source-out",
	"source-atop",
	"destination-over",
	"destination-in",
	"destination-out",
	"destination-atop",
	"lighter",
	"copy",
	"xor",
	"multiply",
	"screen",
	"overlay",
	"darken",
	"lighten",
	"color-dodge",
	"color-burn",
	"hard-light",
	"soft-light",
	"difference",
	"exclusion",
	"hue",
	"saturation",
	"color",
	"luminosity"
];
const GlobalCompositeOperation = z$1.enum(COMPOSITE_OPERATIONS);
var ConfigSchemaRegistry = class ConfigSchemaRegistry$1 {
	static schemas = /* @__PURE__ */ new Map();
	static register(type, schema) {
		ConfigSchemaRegistry$1.schemas.set(type, schema);
	}
	static get(type) {
		return ConfigSchemaRegistry$1.schemas.get(type);
	}
	static clear() {
		ConfigSchemaRegistry$1.schemas.clear();
	}
};
const dataTypeEnum = z$1.enum(DataTypes);
const handleSchema = z$1.object({
	id: z$1.string().optional(),
	type: z$1.enum(["Input", "Output"]),
	dataTypes: z$1.array(dataTypeEnum),
	label: z$1.string(),
	order: z$1.number().default(0),
	required: z$1.boolean().default(false),
	templateHandleId: z$1.string().nullish(),
	nodeId: z$1.string()
});
const nodeSchema = z$1.object({
	id: z$1.string().optional(),
	name: z$1.string(),
	type: z$1.string(),
	position: z$1.object({
		x: z$1.number(),
		y: z$1.number()
	}),
	handles: z$1.array(handleSchema).optional(),
	width: z$1.number().optional().default(340),
	height: z$1.number().nullish().describe("It is better to keep this undefined for auto-style"),
	result: z$1.record(z$1.string(), z$1.unknown()).nullish().describe("The output data from this node"),
	config: z$1.record(z$1.string(), z$1.unknown()).nullish().describe("Configuration parameters for this node"),
	templateId: z$1.string(),
	locked: z$1.boolean().optional().default(false)
}).superRefine((node, ctx) => {
	const schema = ConfigSchemaRegistry.get(node.type);
	if (schema && node.config) {
		const result = schema.safeParse(node.config);
		if (!result.success) for (const issue of result.error.issues) ctx.addIssue({
			...issue,
			path: ["config", ...issue.path]
		});
	}
});
const edgeSchema = z$1.object({
	id: z$1.string().optional(),
	source: z$1.string().describe("Source Node ID"),
	target: z$1.string().describe("Target Node ID"),
	sourceHandleId: z$1.string().optional(),
	targetHandleId: z$1.string().optional()
});
const FileDataSchema = z.object({ entity: z.custom().optional() });
const SignalDataSchema = z.object({
	type: z.literal("generator"),
	func: z.enum([
		"sine",
		"triangle",
		"sawtooth",
		"square",
		"custom"
	]),
	frequency: z.number().default(1),
	amplitude: z.number().default(1),
	phase: z.number().default(0),
	offset: z.number().default(0)
});
const OutputItemSchema = z.object({
	type: z.custom(),
	data: z.any(),
	outputHandleId: z.string().optional()
});
const createOutputItemSchema = (type, dataSchema) => {
	return z.object({
		type,
		data: dataSchema,
		outputHandleId: z.string().optional()
	});
};
const SingleOutputGenericSchema = (outputItemSchema) => z.object({
	selectedOutputIndex: z.literal(0),
	outputs: z.tuple([z.object({ items: z.tuple([outputItemSchema]) })])
});
const MultiOutputGenericSchema = (outputItemSchema) => z.object({
	selectedOutputIndex: z.number(),
	outputs: z.array(z.object({ items: z.array(outputItemSchema) })),
	sourceFingerprint: z.string().optional()
});
const AnyOutputUnionSchema = z.object({
	type: z.custom(),
	data: z.any(),
	outputHandleId: z.string().optional()
});
const NodeResultSchema = z.object({
	selectedOutputIndex: z.number(),
	outputs: z.array(z.object({ items: z.array(AnyOutputUnionSchema) }))
});
const ExportResultSchema = MultiOutputGenericSchema(AnyOutputUnionSchema);
const processSchema = z$1.object({ node_ids: z$1.array(z$1.string()).optional() });
const bulkUpdateSchema = z$1.object({
	nodes: z$1.array(nodeSchema).default([]),
	edges: z$1.array(edgeSchema).default([]),
	handles: z$1.array(handleSchema).default([])
}).superRefine((val, ctx) => {
	const { nodes, edges, handles } = val;
	const nodeMap = /* @__PURE__ */ new Map();
	nodes.forEach((node, index) => {
		if (node.id) {
			if (nodeMap.has(node.id)) ctx.addIssue({
				code: "custom",
				path: [
					"nodes",
					index,
					"id"
				],
				message: "Duplicate node ID detected."
			});
			nodeMap.set(node.id, node);
		} else ctx.addIssue({
			code: "custom",
			path: [
				"nodes",
				index,
				"id"
			],
			message: "Node ID is required."
		});
	});
	const handleMap = /* @__PURE__ */ new Map();
	const nodeHandlesMap = /* @__PURE__ */ new Map();
	handles.forEach((handle, index) => {
		if (handle.id) {
			if (handleMap.has(handle.id)) ctx.addIssue({
				code: "custom",
				path: [
					"handles",
					index,
					"id"
				],
				message: "Duplicate handle ID detected."
			});
			handleMap.set(handle.id, handle);
			if (!nodeHandlesMap.has(handle.nodeId)) nodeHandlesMap.set(handle.nodeId, /* @__PURE__ */ new Set());
			nodeHandlesMap.get(handle.nodeId).add(handle.id);
		} else ctx.addIssue({
			code: "custom",
			path: [
				"handles",
				index,
				"id"
			],
			message: "Handle ID is required."
		});
		if (!nodeMap.has(handle.nodeId)) ctx.addIssue({
			code: "custom",
			path: [
				"handles",
				index,
				"nodeId"
			],
			message: "Referenced node ID does not exist."
		});
	});
	nodes.forEach((node, nodeIndex) => {
		if (!node.id || !node.config) return;
		if (node.type === "Compositor") {
			const nodeHandles = nodeHandlesMap.get(node.id);
			if (!nodeHandles) return;
			const inputHandleIds = [...nodeHandles].filter((hId) => {
				return handleMap.get(hId)?.type === "Input";
			});
			const layers = node.config.layers ?? [];
			for (const [index, layerConfig] of layers.entries()) {
				if (typeof layerConfig !== "object" || layerConfig === null) {
					ctx.addIssue({
						code: "custom",
						path: [
							"nodes",
							nodeIndex,
							"config",
							"layers",
							index
						],
						message: `Layer configuration at index "${index}" must be an object.`
					});
					continue;
				}
				const config$1 = layerConfig;
				const inputHandleId = config$1.inputHandleId;
				if (!inputHandleId || !inputHandleIds.includes(inputHandleId)) ctx.addIssue({
					code: "custom",
					path: [
						"nodes",
						nodeIndex,
						"config",
						"layers",
						index
					],
					message: `Layer at index "${index}" must have a valid inputHandleId for ${node.type} node.`
				});
				if ("opacity" in config$1) {
					const { opacity } = config$1;
					if (typeof opacity !== "number" || opacity < 0 || opacity > 1) ctx.addIssue({
						code: "custom",
						path: [
							"nodes",
							nodeIndex,
							"config",
							"layers",
							index,
							"opacity"
						],
						message: "Opacity must be a number between 0 and 1."
					});
				}
			}
		}
	});
	const adj = /* @__PURE__ */ new Map();
	const edgeMap = /* @__PURE__ */ new Map();
	const connectionSet = /* @__PURE__ */ new Set();
	edges.forEach((edge, index) => {
		if (edge.id) {
			if (edgeMap.has(edge.id)) ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"id"
				],
				message: "Duplicate edge ID detected."
			});
			edgeMap.set(edge.id, edge);
		} else ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"id"
			],
			message: "Edge ID is required."
		});
		if (!edge.source) ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"source"
			],
			message: "Source node ID is required."
		});
		if (!edge.target) ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"target"
			],
			message: "Target node ID is required."
		});
		if (edge.source && edge.target) {
			if (edge.source === edge.target) ctx.addIssue({
				code: "custom",
				path: ["edges", index],
				message: "Self-connections are not allowed."
			});
			if (!nodeMap.has(edge.source)) ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"source"
				],
				message: "Source node does not exist."
			});
			if (!nodeMap.has(edge.target)) ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"target"
				],
				message: "Target node does not exist."
			});
			if (!adj.has(edge.source)) adj.set(edge.source, []);
			adj.get(edge.source).push(edge.target);
		}
		if (edge.sourceHandleId) if (!handleMap.has(edge.sourceHandleId)) ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"sourceHandleId"
			],
			message: "Source handle does not exist."
		});
		else {
			const sh = handleMap.get(edge.sourceHandleId);
			if (sh.nodeId !== edge.source) ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"sourceHandleId"
				],
				message: "Source handle does not belong to source node."
			});
			if (sh.type !== "Output") ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"sourceHandleId"
				],
				message: "Source handle must be of type 'Output'."
			});
		}
		else ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"sourceHandleId"
			],
			message: "Source handle ID is required."
		});
		if (edge.targetHandleId) if (!handleMap.has(edge.targetHandleId)) ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"targetHandleId"
			],
			message: "Target handle does not exist."
		});
		else {
			const th = handleMap.get(edge.targetHandleId);
			if (th.nodeId !== edge.target) ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"targetHandleId"
				],
				message: "Target handle does not belong to target node."
			});
			if (th.type !== "Input") ctx.addIssue({
				code: "custom",
				path: [
					"edges",
					index,
					"targetHandleId"
				],
				message: "Target handle must be of type 'Input'."
			});
		}
		else ctx.addIssue({
			code: "custom",
			path: [
				"edges",
				index,
				"targetHandleId"
			],
			message: "Target handle ID is required."
		});
		if (edge.sourceHandleId && edge.targetHandleId) {
			const connectionKey = `${edge.sourceHandleId}|${edge.targetHandleId}`;
			if (connectionSet.has(connectionKey)) ctx.addIssue({
				code: "custom",
				path: ["edges", index],
				message: "Duplicate connection between handles."
			});
			connectionSet.add(connectionKey);
		}
	});
	function hasCycle() {
		const visited = /* @__PURE__ */ new Set();
		const recStack = /* @__PURE__ */ new Set();
		const path$1 = [];
		function dfs(node) {
			visited.add(node);
			recStack.add(node);
			path$1.push(node);
			for (const neighbor of adj.get(node) ?? []) if (!visited.has(neighbor)) {
				if (dfs(neighbor)) return true;
			} else if (recStack.has(neighbor)) {
				path$1.push(neighbor);
				return true;
			}
			recStack.delete(node);
			path$1.pop();
			return false;
		}
		for (const nodeId of nodeMap.keys()) if (!visited.has(nodeId) && dfs(nodeId)) return {
			hasCycle: true,
			path: [...path$1]
		};
		return { hasCycle: false };
	}
	const cycleResult = hasCycle();
	if (cycleResult.hasCycle) ctx.addIssue({
		code: "custom",
		path: ["edges"],
		message: `Graph contains a cycle, which is not allowed. Cycle path: ${cycleResult.path?.join(" → ") ?? "unknown"}`
	});
});
const agentBulkUpdateSchema = bulkUpdateSchema.superRefine((val, ctx) => {
	const { edges = [], handles = [] } = val;
	const handleMap = /* @__PURE__ */ new Map();
	handles.forEach((handle) => {
		if (handle.id) handleMap.set(handle.id, handle);
	});
	edges.forEach((edge, index) => {
		if (edge.sourceHandleId && edge.targetHandleId) {
			const sh = handleMap.get(edge.sourceHandleId);
			const th = handleMap.get(edge.targetHandleId);
			if (sh && th) {
				if (!sh.dataTypes.some((dt) => th.dataTypes.includes(dt))) ctx.addIssue({
					code: "custom",
					path: ["edges", index],
					message: `Data types between source (${sh.dataTypes.join(", ")}) and target (${th.dataTypes.join(", ")}) handles are incompatible.`
				});
			}
		}
	});
});
const AnimationTypeSchema = z$1.enum([
	"fade-in",
	"fade-out",
	"slide-in-left",
	"slide-in-right",
	"slide-in-top",
	"slide-in-bottom",
	"zoom-in",
	"zoom-out",
	"rotate-cw",
	"rotate-ccw",
	"bounce",
	"shake"
]);
const VideoAnimationSchema = z$1.object({
	id: z$1.string(),
	type: AnimationTypeSchema,
	value: z$1.number()
});
const VideoSpatialPropsSchema = z$1.object({
	x: z$1.number().default(0),
	y: z$1.number().default(0),
	width: z$1.number().optional(),
	height: z$1.number().optional(),
	rotation: z$1.number().default(0),
	scale: z$1.number().min(0).default(1),
	opacity: z$1.number().min(0).max(1).default(1),
	zIndex: z$1.number().int().optional(),
	blendMode: GlobalCompositeOperation.optional()
});
const VideoTimingPropsSchema = z$1.object({
	startFrame: z$1.number().int().min(0).default(0),
	durationInMS: z$1.number().int().min(1).optional(),
	trimStart: z$1.number().int().min(0).optional(),
	trimEnd: z$1.number().int().min(0).optional(),
	speed: z$1.number().min(.25).max(4).optional()
});
const VideoTextPropsSchema = z$1.object({
	text: z$1.string().optional(),
	fontSize: z$1.number().optional(),
	fontFamily: z$1.string().optional(),
	fontStyle: z$1.string().optional(),
	fontWeight: z$1.union([z$1.number(), z$1.string()]).optional(),
	fill: z$1.string().optional(),
	align: z$1.string().optional(),
	verticalAlign: z$1.string().optional(),
	letterSpacing: z$1.number().optional(),
	lineHeight: z$1.number().optional(),
	padding: z$1.number().optional(),
	stroke: z$1.string().optional(),
	strokeWidth: z$1.number().optional(),
	strokeAlign: z$1.enum([
		"inside",
		"center",
		"outside"
	]).optional(),
	textShadow: z$1.string().optional(),
	textBackgroundColor: z$1.string().optional(),
	shadows: z$1.array(z$1.object({
		color: z$1.string(),
		offset: z$1.object({
			x: z$1.number(),
			y: z$1.number()
		}).optional(),
		blurRadius: z$1.number().optional()
	})).optional(),
	useRoundedTextBox: z$1.boolean().optional(),
	textAnimation: z$1.any().optional(),
	bottomPadding: z$1.number().optional(),
	maxWidth: z$1.number().optional()
});
const VideoStylePropsSchema = z$1.object({
	backgroundColor: z$1.string().optional(),
	borderColor: z$1.string().optional(),
	borderWidth: z$1.number().optional(),
	strokeRadius: z$1.number().optional(),
	autoDimensions: z$1.boolean().optional()
});
const VideoLayerTypeSchema = z$1.enum([
	"Video",
	"Image",
	"Audio",
	"Text",
	"Caption",
	"SVG",
	"GIF",
	"Lottie"
]);
const BaseVideoLayerPropsSchema = VideoSpatialPropsSchema.merge(VideoTimingPropsSchema).merge(VideoTextPropsSchema).merge(VideoStylePropsSchema).extend({
	type: VideoLayerTypeSchema.optional(),
	animations: z$1.array(VideoAnimationSchema).optional()
});
const TransitionTypeSchema = z$1.enum([
	"none",
	"crossfade",
	"wipe-left",
	"wipe-right",
	"slide-up",
	"slide-down"
]);
const TransitionSchema = z$1.object({
	type: TransitionTypeSchema,
	durationFrames: z$1.number().min(1)
});
const MediaSourceSchema = z$1.object({ entity: FileAssetSchema.optional() });
const MediaMetadataSchema = z$1.object({
	width: z$1.number().optional().nullable(),
	height: z$1.number().optional().nullable(),
	fps: z$1.number().optional().nullable(),
	durationMs: z$1.number().optional().nullable(),
	sampleRate: z$1.number().optional().nullable(),
	channels: z$1.number().optional().nullable(),
	bitDepth: z$1.number().optional().nullable(),
	audioCodec: z$1.string().optional().nullable(),
	audioBitrate: z$1.number().optional().nullable()
});
const TimelineSegmentSchema = z$1.object({
	startSec: z$1.number(),
	endSec: z$1.number().optional()
});
const TimelineTransformSchema = z$1.object({
	startFrame: z$1.number().optional(),
	segments: z$1.array(TimelineSegmentSchema).optional()
});
const BaseMediaOperationPropsSchema = z$1.object({
	volume: z$1.number().optional(),
	opacity: z$1.number().optional(),
	startFrame: z$1.number().optional(),
	timeline: TimelineTransformSchema.optional()
});
/** Original source file (leaf node) */
const SourceOperationSchema = BaseMediaOperationPropsSchema.extend({
	op: z$1.literal("source"),
	source: MediaSourceSchema,
	sourceMeta: MediaMetadataSchema,
	dataType: z$1.enum(Object.values(DataTypeVal))
});
/** Text content (leaf node) */
const TextOperationSchema = BaseMediaOperationPropsSchema.extend({
	op: z$1.literal("text"),
	text: z$1.string(),
	metadata: MediaMetadataSchema.optional(),
	dataType: z$1.enum(Object.values(DataTypeVal))
}).passthrough();
const MediaOperationSchema = z$1.union([
	SourceOperationSchema,
	TextOperationSchema,
	BaseMediaOperationPropsSchema.extend({
		op: z$1.string(),
		metadata: MediaMetadataSchema.optional(),
		dataType: z$1.enum(Object.values(DataTypeVal))
	}).passthrough()
]);
const VirtualMediaDataSchema = z$1.lazy(() => z$1.object({
	metadata: MediaMetadataSchema,
	operation: MediaOperationSchema,
	children: z$1.array(VirtualMediaDataSchema).default([])
}));
const ExtendedLayerSchema = BaseVideoLayerPropsSchema.extend({
	id: z$1.string(),
	name: z$1.string().optional(),
	type: VideoLayerTypeSchema,
	virtualMedia: VirtualMediaDataSchema.optional(),
	transitionIn: TransitionSchema.optional(),
	transitionOut: TransitionSchema.optional(),
	durationInMS: z$1.number(),
	maxDurationInMS: z$1.number().optional(),
	src: z$1.string().optional(),
	volume: z$1.number().default(1),
	inputHandleId: z$1.string().optional(),
	isPlaceholder: z$1.boolean().optional(),
	lockAspect: z$1.boolean().optional(),
	lockRatio: z$1.boolean().optional(),
	zIndex: z$1.number().optional()
}).strict();
const DEFAULT_DURATION_MS = 3e3;
/**
* Resolve the MIME type of the leaf source media.
*/
function resolveMediaMimeType(vv) {
	if (!vv) return void 0;
	if (vv.operation?.op === "source") return vv.operation.source?.entity?.mimeType;
	if (vv.children && vv.children.length > 0) return resolveMediaMimeType(vv.children[0]);
}
/**
* Create a VirtualMediaData from a FileData source or Text.
* Used by Import, VideoGen, and Text nodes to wrap concrete content.
*/
function createVirtualMedia(source, type) {
	if (source && typeof source === "object" && "operation" in source) return source;
	const sourceMeta = getFileDataMetadata(source) || {
		width: void 0,
		height: void 0,
		durationMs: void 0,
		fps: void 0
	};
	return {
		metadata: sourceMeta,
		operation: {
			op: "source",
			source: { entity: source.entity },
			sourceMeta,
			dataType: type
		},
		children: []
	};
}
/**
* Identify if a VirtualMediaData node is intended to be Video, Audio, Image, or Text.
*/
function getMediaType(vv) {
	if (!vv) throw new Error("No media data provided");
	return vv.operation.dataType;
}
/**
* Append an operation to an existing VirtualMediaData (recursive).
* This creates a new parent node wrapping the current one as a child.
*/
function appendOperation(vv, operation) {
	return {
		metadata: computeNextMetadata(getActiveMediaMetadata(vv) ?? {}, operation),
		operation,
		children: [vv]
	};
}
/**
* Helper to compute the metadata of the NEXT node in the operator tree.
*/
function computeNextMetadata(baseMeta, op) {
	let { width, height, durationMs, fps, sampleRate, channels, bitDepth, audioCodec, audioBitrate } = baseMeta;
	if ("metadata" in op && op.metadata) {
		width = op.metadata.width ?? width;
		height = op.metadata.height ?? height;
		durationMs = op.metadata.durationMs ?? durationMs;
		fps = op.metadata.fps ?? fps;
		sampleRate = op.metadata.sampleRate ?? sampleRate;
		channels = op.metadata.channels ?? channels;
		bitDepth = op.metadata.bitDepth ?? bitDepth;
		audioCodec = op.metadata.audioCodec ?? audioCodec;
		audioBitrate = op.metadata.audioBitrate ?? audioBitrate;
	}
	if (op.dataType === "Audio" || op.dataType === "Text" || op.dataType === "Caption") {
		width = void 0;
		height = void 0;
		fps = void 0;
	}
	return {
		width,
		height,
		durationMs,
		fps,
		sampleRate,
		channels,
		bitDepth,
		audioCodec,
		audioBitrate
	};
}
function getFileDataMetadata(filedata) {
	if (!filedata) return null;
	const { entity } = filedata;
	const width = entity?.width;
	const height = entity?.height;
	let durationMs = entity?.duration;
	const fps = entity?.fps;
	const sampleRate = entity?.sampleRate;
	const channels = entity?.channels;
	const bitDepth = entity?.bitDepth;
	const audioCodec = entity?.audioCodec;
	const audioBitrate = entity?.audioBitrate;
	if (durationMs === void 0 || durationMs === null) {
		const mimeType = entity?.mimeType ?? "";
		if (mimeType.startsWith("image/") || mimeType === "image/svg+xml") durationMs = DEFAULT_DURATION_MS;
	}
	if (width === void 0 && height === void 0 && durationMs === void 0 && sampleRate === void 0 && channels === void 0) return null;
	return {
		width,
		height,
		durationMs: durationMs === 0 ? void 0 : durationMs,
		fps,
		sampleRate,
		channels,
		bitDepth,
		audioCodec,
		audioBitrate
	};
}
/**
* Get the active metadata from the VirtualMediaData node.
* Simply returns the metadata property of the node.
* Supports legacy formats (sourceMeta) and extracts from source if needed.
*/
function getActiveMediaMetadata(vv) {
	if (!vv) return null;
	let width = vv.metadata?.width;
	let height = vv.metadata?.height;
	let durationMs = vv.metadata?.durationMs;
	let fps = vv.metadata?.fps;
	let sampleRate = vv.metadata?.sampleRate;
	let channels = vv.metadata?.channels;
	let bitDepth = vv.metadata?.bitDepth;
	let audioCodec = vv.metadata?.audioCodec;
	let audioBitrate = vv.metadata?.audioBitrate;
	const op = vv.operation;
	if (op?.op === "source") {
		const sm = op.sourceMeta || {};
		const fdm = op.source ? getFileDataMetadata(op.source) : null;
		width = width ?? sm.width ?? fdm?.width;
		height = height ?? sm.height ?? fdm?.height;
		durationMs = durationMs ?? sm.durationMs ?? fdm?.durationMs;
		fps = fps ?? sm.fps ?? fdm?.fps;
		sampleRate = sampleRate ?? sm.sampleRate ?? fdm?.sampleRate;
		channels = channels ?? sm.channels ?? fdm?.channels;
		bitDepth = bitDepth ?? sm.bitDepth ?? fdm?.bitDepth;
		audioCodec = audioCodec ?? sm.audioCodec ?? fdm?.audioCodec;
		audioBitrate = audioBitrate ?? sm.audioBitrate ?? fdm?.audioBitrate;
	}
	if (width === void 0 && height === void 0 && durationMs === void 0 && sampleRate === void 0 && channels === void 0) return null;
	return {
		width,
		height,
		durationMs: durationMs === 0 ? void 0 : durationMs,
		fps,
		sampleRate,
		channels,
		bitDepth,
		audioCodec,
		audioBitrate
	};
}
/**
* Gets a stable object for hashing/fingerprinting by sorting keys and skipping volatile fields.
*/
function getStableData(data) {
	if (typeof data !== "object" || data === null) return data;
	if (Array.isArray(data)) return data.map(getStableData);
	const result = {};
	const keys = Object.keys(data).sort();
	for (const key of keys) {
		const val = data[key];
		if (key === "createdAt" || key === "updatedAt" || key === "dataUrl" || key === "filePath") continue;
		if (typeof val === "string" && val.startsWith("blob:")) continue;
		if (key === "entity" && val && typeof val === "object" && val.id) {
			result.entity = { id: val.id };
			continue;
		}
		result[key] = getStableData(val);
	}
	return result;
}
/**
* Generates a fingerprint for the given data.
*/
function getFingerprint(data) {
	const stableData = getStableData(data);
	const str = JSON.stringify(stableData);
	if (str.length === 0) return "0";
	const getHash = (seed) => {
		let h1 = 3735928559 ^ seed;
		let h2 = 1103547991 ^ seed;
		for (let i = 0; i < str.length; i++) {
			const ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 = Math.imul(h1 ^ h1 >>> 16, 2246822519);
		h1 = Math.imul(h1 ^ h1 >>> 13, 3266489917);
		h1 = h1 ^ h1 >>> 16;
		h2 = Math.imul(h2 ^ h2 >>> 16, 2246822519);
		h2 = Math.imul(h2 ^ h2 >>> 13, 3266489917);
		h2 = h2 ^ h2 >>> 16;
		return (h1 >>> 0).toString(36).padStart(7, "0") + (h2 >>> 0).toString(36).padStart(7, "0");
	};
	return getHash(0) + getHash(1);
}
/**
* Checks if data is VirtualMediaData.
*/
function isVirtualMediaData(data) {
	return typeof data === "object" && data !== null && "metadata" in data && "operation" in data && "children" in data;
}
/**
* Checks if the virtual media is just a raw source without any significant operations
* that would require a rendering step (like transformations, trimming, or effects).
*/
function hasOnlySingleSource(data) {
	if (!isVirtualMediaData(data)) return false;
	if (data.operation.op === "source") {
		if (data.children && data.children.length > 0) return false;
		const op = data.operation;
		return !(op.volume !== void 0 && op.volume !== 1 || op.opacity !== void 0 && op.opacity !== 1 || op.startFrame !== void 0 && op.startFrame !== 0 || op.timeline && (op.timeline.startFrame !== void 0 && op.timeline.startFrame !== 0 || op.timeline.segments && op.timeline.segments.length > 0));
	}
	if (data.operation.op === "compose") return false;
	if (data.operation.op === "layer" && data.children.length === 1) {
		const op = data.operation;
		if (!(op.x !== void 0 && op.x !== 0 || op.y !== void 0 && op.y !== 0 || op.rotation !== void 0 && op.rotation !== 0 || op.scale !== void 0 && op.scale !== 1 || op.opacity !== void 0 && op.opacity !== 1 || op.volume !== void 0 && op.volume !== 1 || op.zIndex !== void 0 || op.blendMode !== void 0 || op.filters !== void 0 || op.transitionIn !== void 0 || op.transitionOut !== void 0 || op.animations && op.animations.length > 0 || op.trimStart !== void 0 || op.trimEnd !== void 0 || op.speed !== void 0 || op.backgroundColor !== void 0 || op.borderColor !== void 0 || op.borderWidth !== void 0 || op.strokeRadius !== void 0)) return hasOnlySingleSource(data.children[0]);
	}
	return false;
}
/**
* Finds the source asset in a virtual media tree.
*/
function findSourceAsset(vm) {
	if (vm.operation.op === "source") return vm.operation.source;
	if (vm.children && vm.children.length > 0) return findSourceAsset(vm.children[0]);
	return null;
}
/**
* Checks if a cached node result can be reused based on source fingerprint.
* Returns the valid cached result, or null if the cache is stale.
*/
function checkNodeResultCache(currentResult, input) {
	if (!currentResult?.sourceFingerprint) return null;
	const inputFingerprint = getFingerprint(input);
	if (currentResult.sourceFingerprint !== inputFingerprint) return null;
	return currentResult;
}
/**
* Creates a fresh result with a source fingerprint stamp.
*/
function stampResult(result, input) {
	return {
		...result,
		sourceFingerprint: getFingerprint(input)
	};
}
/**
* Attempts to parse the width and height of an SVG from its buffer.
* Falls back to viewBox ratios if explicitly defined sizes are missing.
*/
function extractSvgDimensions(buffer) {
	try {
		const match = buffer.toString("utf-8").match(/<svg[^>]*>/i);
		if (!match) return null;
		const svgTag = match[0];
		const getAttr = (name) => {
			const attrMatch = svgTag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
			if (!attrMatch) return null;
			const val = parseFloat(attrMatch[1].replace(/[a-z%]/gi, ""));
			return isNaN(val) ? null : val;
		};
		let w = getAttr("width");
		let h = getAttr("height");
		const viewBoxMatch = svgTag.match(/viewBox=["']([^"']+)["']/i);
		if (viewBoxMatch) {
			const parts = viewBoxMatch[1].split(/[\s,]+/).map(parseFloat);
			if (parts.length >= 4 && !isNaN(parts[2]) && !isNaN(parts[3])) {
				const vbW = parts[2];
				const vbH = parts[3];
				if (w == null && h == null) {
					w = vbW;
					h = vbH;
				} else if (w != null && h == null) h = w * (vbH / vbW);
				else if (h != null && w == null) w = h * (vbW / vbH);
			}
		}
		if (w != null && h != null && w > 0 && h > 0) return {
			w,
			h
		};
		return null;
	} catch (error) {
		console.error("Error parsing SVG dimensions", error);
		return null;
	}
}

//#endregion
//#region ../../node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "dotenv",
		"version": "16.6.1",
		"description": "Loads environment variables from .env file",
		"main": "lib/main.js",
		"types": "lib/main.d.ts",
		"exports": {
			".": {
				"types": "./lib/main.d.ts",
				"require": "./lib/main.js",
				"default": "./lib/main.js"
			},
			"./config": "./config.js",
			"./config.js": "./config.js",
			"./lib/env-options": "./lib/env-options.js",
			"./lib/env-options.js": "./lib/env-options.js",
			"./lib/cli-options": "./lib/cli-options.js",
			"./lib/cli-options.js": "./lib/cli-options.js",
			"./package.json": "./package.json"
		},
		"scripts": {
			"dts-check": "tsc --project tests/types/tsconfig.json",
			"lint": "standard",
			"pretest": "npm run lint && npm run dts-check",
			"test": "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
			"test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
			"prerelease": "npm test",
			"release": "standard-version"
		},
		"repository": {
			"type": "git",
			"url": "git://github.com/motdotla/dotenv.git"
		},
		"homepage": "https://github.com/motdotla/dotenv#readme",
		"funding": "https://dotenvx.com",
		"keywords": [
			"dotenv",
			"env",
			".env",
			"environment",
			"variables",
			"config",
			"settings"
		],
		"readmeFilename": "README.md",
		"license": "BSD-2-Clause",
		"devDependencies": {
			"@types/node": "^18.11.3",
			"decache": "^4.6.2",
			"sinon": "^14.0.1",
			"standard": "^17.0.0",
			"standard-version": "^9.5.0",
			"tap": "^19.2.0",
			"typescript": "^4.8.4"
		},
		"engines": { "node": ">=12" },
		"browser": { "fs": false }
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js
var require_main = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs$2 = __require("fs");
	const path = __require("path");
	const os = __require("os");
	const crypto = __require("crypto");
	const version = require_package().version;
	const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.log(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _log(message) {
		console.log(`[dotenv@${version}] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs$2.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
		if (fs$2.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = Boolean(options && options.debug);
		const quiet = options && "quiet" in options ? options.quiet : true;
		if (debug || !quiet) _log("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		const debug = Boolean(options && options.debug);
		const quiet = options && "quiet" in options ? options.quiet : true;
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path$1 of optionPaths) try {
			const parsed = DotenvModule.parse(fs$2.readFileSync(path$1, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path$1} ${e.message}`);
			lastError = e;
		}
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsedAll, options);
		if (debug || !quiet) {
			const keysCount = Object.keys(parsedAll).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative = path.relative(process.cwd(), filePath);
				shortPaths.push(relative);
			} catch (e) {
				if (debug) _debug(`Failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) processEnv[key] = parsed[key];
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else processEnv[key] = parsed[key];
	}
	const DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
}));

//#endregion
//#region ../../packages/server-utils/dist/index.mjs
var import_main = require_main();
/**
* App version read from the monorepo root package.json.
* Used for version-aware render fingerprinting.
*/
const APP_VERSION = "1.0.149";
let loggerContext = {
	getStore: () => void 0,
	run: (_store, callback, ...args) => callback(...args)
};
if (typeof globalThis.window === "undefined") import(
	/* @vite-ignore */
	"node:async_hooks"
).then((module$1) => {
	if (module$1?.AsyncLocalStorage) loggerContext = new module$1.AsyncLocalStorage();
}).catch(() => {});
const targets = [];
const logger = pino({
	level: typeof process !== "undefined" && process.env?.LOG_LEVEL || "info",
	timestamp: pino.stdTimeFunctions.isoTime,
	base: {
		env: typeof process !== "undefined" && process.env?.NODE_ENV || "development",
		version: APP_VERSION
	},
	mixin() {
		return loggerContext.getStore() || {};
	},
	redact: {
		paths: [
			"email",
			"password",
			"accessToken",
			"refreshToken",
			"req.headers.authorization",
			"req.headers.x-api-key"
		],
		remove: true
	},
	...targets.length > 0 && { transport: { targets } }
});
const apiLogger = logger.child({ component: "api" });
const workflowLogger = logger.child({ component: "workflow" });
const agentLogger = logger.child({ component: "agent" });
const mediaLogger = logger.child({ component: "media" });
const rendererLogger = logger.child({ component: "renderer" });
let _envConfig = null;
function getEnvConfig() {
	if (!_envConfig) {
		(0, import_main.config)();
		const parsed = envSchema.safeParse(process.env);
		if (!parsed.success) {
			logger.error({ err: z$1.treeifyError(parsed.error) }, "❌ Invalid environment variables");
			throw new Error("Invalid environment variables");
		}
		_envConfig = parsed.data;
	}
	return _envConfig;
}
const ENV_CONFIG = new Proxy({}, {
	get(_target, prop, receiver) {
		return Reflect.get(getEnvConfig(), prop, receiver);
	},
	ownKeys() {
		return Reflect.ownKeys(getEnvConfig());
	},
	getOwnPropertyDescriptor(_target, prop) {
		return Reflect.getOwnPropertyDescriptor(getEnvConfig(), prop);
	},
	getPrototypeOf() {
		return Reflect.getPrototypeOf(getEnvConfig());
	}
});
/**
* Dependency Injection Tokens for Gatewai Core.
* Use these tokens to inject core services into your application.
*/
const TOKENS = {
	PRISMA: Symbol.for("PRISMA"),
	ENV: Symbol.for("ENV"),
	STORAGE: Symbol.for("STORAGE"),
	LOGGER: Symbol.for("LOGGER"),
	MEDIA: Symbol.for("MEDIA"),
	GRAPH_RESOLVERS: Symbol.for("GRAPH_RESOLVERS"),
	AI_PROVIDER: Symbol.for("AI_PROVIDER"),
	PRICING_SERVICE: Symbol.for("PRICING_SERVICE"),
	MEDIA_RENDERER: Symbol.for("MEDIA_RENDERER"),
	NODE_REGISTRY: Symbol.for("NODE_REGISTRY"),
	NODE_WF_PROCESSOR: Symbol.for("NODE_WF_PROCESSOR"),
	RENDER_CACHE: Symbol.for("RENDER_CACHE"),
	MEDIA_RESOLVER: Symbol.for("MEDIA_RESOLVER"),
	SKILL_REGISTRY: Symbol.for("SKILL_REGISTRY")
};
const GLOBAL_CONTAINER_KEY = Symbol.for("gatewai.server-utils.container");
const globalObj = globalThis;
if (!globalObj[GLOBAL_CONTAINER_KEY]) globalObj[GLOBAL_CONTAINER_KEY] = new Container();
const container = globalObj[GLOBAL_CONTAINER_KEY];
function GetAssetEndpointBackend(baseUrl, fileAsset) {
	const env = container.get(TOKENS.ENV);
	if (env.R2_CUSTOM_DOMAIN) return `https://${env.R2_CUSTOM_DOMAIN}/${fileAsset.key}`;
	if (fileAsset.key && (fileAsset.key.startsWith("file://") || fileAsset.key.startsWith("/"))) return fileAsset.key.startsWith("/") ? `file://${fileAsset.key}` : fileAsset.key;
	if (baseUrl && baseUrl.startsWith("file://")) return `${baseUrl.replace(/\/+$/, "")}/${fileAsset.key}`;
	const assetUrl = `${baseUrl}/api/v1/assets/${fileAsset.id.split(".")[0]}`;
	if (!fileAsset.mimeType) return assetUrl;
	const extension = Object.entries(MIME_TYPES).find(([_, mime]) => mime === fileAsset.mimeType)?.[0];
	return extension ? `${assetUrl}.${extension}` : assetUrl;
}
/**
* Generates a storage key for an asset.
* Format: assets/{path}
*/
function getAssetKey(path$1) {
	return `assets/${path$1.startsWith("/") ? path$1.slice(1) : path$1}`;
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function isWebReadableStream(obj) {
	return typeof obj === "object" && obj !== null && "getReader" in obj && typeof obj.getReader === "function";
}
function hasTransformToWebStream(obj) {
	return typeof obj === "object" && obj !== null && "transformToWebStream" in obj && typeof obj.transformToWebStream === "function";
}
function isNodeReadable(obj) {
	return typeof obj === "object" && obj !== null && "pipe" in obj && typeof obj.pipe === "function";
}
function isAsyncIterable(obj) {
	return typeof obj === "object" && obj !== null && Symbol.asyncIterator in obj && typeof obj[Symbol.asyncIterator] === "function";
}
let BaseS3StorageService = class BaseS3StorageService$1 {
	s3Client;
	defaultBucketName;
	customDomain;
	initClient(config$1, defaultBucketName, customDomain) {
		this.s3Client = new S3Client(config$1);
		this.defaultBucketName = defaultBucketName;
		this.customDomain = customDomain;
	}
	async uploadToStorage(buffer, key, contentType, bucketName) {
		await this.s3Client.send(new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: buffer,
			ContentType: contentType
		}));
	}
	async uploadFileToStorage(filePath, key, contentType, bucketName) {
		const stat = await fs$1.stat(filePath);
		if (stat.size <= 100 * 1024 * 1024) {
			const fileBuffer = await fs$1.readFile(filePath);
			await this.s3Client.send(new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: fileBuffer,
				ContentLength: fileBuffer.length,
				ContentType: contentType
			}));
		} else await this.s3Client.send(new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: createReadStream(filePath),
			ContentLength: stat.size,
			ContentType: contentType
		}));
	}
	async deleteFromStorage(key, bucketName) {
		await this.s3Client.send(new DeleteObjectCommand({
			Bucket: bucketName,
			Key: key
		}));
	}
	async generateSignedUrl(key, bucketName, expiresIn = 3600, options) {
		const command = new GetObjectCommand({
			Bucket: bucketName,
			Key: key,
			ResponseContentType: options?.responseContentType,
			ResponseContentDisposition: options?.responseContentDisposition
		});
		return await getSignedUrl(this.s3Client, command, { expiresIn });
	}
	async generateSignedPutUrl(key, bucketName, contentType, expiresIn = 3600) {
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			ContentType: contentType
		});
		return await getSignedUrl(this.s3Client, command, { expiresIn });
	}
	getPublicUrl(key, bucketName) {
		const bucket = bucketName || this.defaultBucketName;
		if (this.customDomain) return `https://${this.customDomain}/${key}`;
		return `https://${bucket}.r2.cloudflarestorage.com/${key}`;
	}
	async getFromStorage(key, bucketName = this.defaultBucketName) {
		const body = (await this.s3Client.send(new GetObjectCommand({
			Bucket: bucketName,
			Key: key
		}))).Body;
		assert(body, `No body returned for key: ${key}`);
		const chunks = [];
		if (isAsyncIterable(body)) for await (const chunk of body) chunks.push(chunk);
		else throw new Error(`Body is not an async iterable for key: ${key}`);
		return Buffer.concat(chunks);
	}
	async getObjectMetadata(key, bucketName = this.defaultBucketName) {
		return this.s3Client.send(new HeadObjectCommand({
			Bucket: bucketName,
			Key: key
		}));
	}
	/** Paginates automatically so all keys are returned regardless of bucket size. */
	async listFromStorage(prefix, bucketName) {
		const keys = [];
		let continuationToken;
		do {
			const response = await this.s3Client.send(new ListObjectsV2Command({
				Bucket: bucketName,
				Prefix: prefix,
				ContinuationToken: continuationToken
			}));
			for (const obj of response.Contents ?? []) if (obj.Key) keys.push(obj.Key);
			continuationToken = response.NextContinuationToken;
		} while (continuationToken);
		return keys;
	}
	async uploadToTemporaryStorageFolder(buffer, mimeType, key) {
		const keyToUse = `temp/${key}`;
		await this.uploadToStorage(buffer, keyToUse, mimeType, this.defaultBucketName);
		return { key: keyToUse };
	}
	getStreamFromStorage(key, bucketName, range) {
		const pass = new PassThrough();
		this.s3Client.send(new GetObjectCommand({
			Bucket: bucketName,
			Key: key,
			...range && { Range: `bytes=${range.start}-${range.end ?? ""}` }
		})).then((response) => {
			const body = response.Body;
			assert(body, `No body returned for key: ${key}`);
			if (isNodeReadable(body)) {
				body.pipe(pass);
				return;
			}
			if (hasTransformToWebStream(body)) {
				const webStream = body.transformToWebStream();
				Readable.fromWeb(webStream).pipe(pass);
				return;
			}
			if (isWebReadableStream(body)) {
				Readable.fromWeb(body).pipe(pass);
				return;
			}
			pass.destroy(/* @__PURE__ */ new Error("Unknown stream type returned from S3"));
		}).catch((err) => pass.destroy(err instanceof Error ? err : new Error(String(err))));
		return pass;
	}
	async fileExistsInStorage(key, bucketName) {
		try {
			await this.s3Client.send(new HeadObjectCommand({
				Bucket: bucketName,
				Key: key
			}));
			return true;
		} catch (error) {
			const status = error?.$metadata?.httpStatusCode;
			if (error?.name === "NotFound" || status === 404) return false;
			logger.warn({
				key,
				bucket: bucketName,
				err: error
			}, "Unexpected error checking object existence");
			throw error;
		}
	}
};
BaseS3StorageService = __decorate([injectable()], BaseS3StorageService);
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let R2StorageService = class R2StorageService$1 extends BaseS3StorageService {
	env;
	init() {
		assert(this.env.R2_ASSETS_BUCKET, "R2_ASSETS_BUCKET is missing");
		assert(this.env.R2_ACCESS_KEY_ID, "R2_ACCESS_KEY_ID is missing");
		assert(this.env.R2_SECRET_ACCESS_KEY, "R2_SECRET_ACCESS_KEY is missing");
		assert(this.env.R2_S3_API_ENDPOINT, "R2_S3_API_ENDPOINT is missing");
		this.initClient({
			region: "auto",
			endpoint: this.env.R2_S3_API_ENDPOINT,
			credentials: {
				accessKeyId: this.env.R2_ACCESS_KEY_ID,
				secretAccessKey: this.env.R2_SECRET_ACCESS_KEY
			}
		}, this.env.R2_ASSETS_BUCKET, this.env.R2_CUSTOM_DOMAIN);
	}
};
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], R2StorageService.prototype, "env", void 0);
__decorate([
	postConstruct(),
	__decorateMetadata("design:type", Function),
	__decorateMetadata("design:paramtypes", []),
	__decorateMetadata("design:returntype", void 0)
], R2StorageService.prototype, "init", null);
R2StorageService = __decorate([injectable()], R2StorageService);

//#endregion
export { findSourceAsset as A, VirtualMediaDataSchema as C, createOutputItemSchema as D, checkNodeResultCache as E, hasOnlySingleSource as F, resolveMediaMimeType as I, stampResult as L, getActiveMediaMetadata as M, getFingerprint as N, createVirtualMedia as O, getMediaType as P, SingleOutputGenericSchema as S, appendOperation as T, MediaMetadataSchema as _, TOKENS as a, NodeMetadataSchema as b, logger as c, rendererLogger as d, AnyOutputUnionSchema as f, FileDataSchema as g, ExportResultSchema as h, R2StorageService as i, generateId as j, extractSvgDimensions as k, loggerContext as l, DataTypeVal as m, ENV_CONFIG as n, container as o, DEFAULT_DURATION_MS as p, GetAssetEndpointBackend as r, getAssetKey as s, APP_VERSION as t, mediaLogger as u, ModerationError as v, agentBulkUpdateSchema as w, NodeResultSchema as x, MultiOutputGenericSchema as y };