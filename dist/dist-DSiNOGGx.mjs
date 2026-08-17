import z, { z as z$1 } from "zod";
import { nanoid } from "nanoid";

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
	STRAPI_URL: z.string().optional(),
	STRAPI_API_TOKEN: z.string().optional(),
	STRAPI_REVALIDATE_SECRET: z.string().optional(),
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
			if (!nodeHandlesMap.get(node.id)) return;
			const layout = node.config?.layout;
			const walkLayout = (nodes$1, nodePath) => {
				for (const [index, nodeConfig] of (nodes$1 ?? []).entries()) {
					const at = [...nodePath, index];
					if (typeof nodeConfig !== "object" || nodeConfig === null) {
						ctx.addIssue({
							code: "custom",
							path: [
								"nodes",
								nodeIndex,
								"config",
								...at
							],
							message: `Layout node at index "${index}" must be an object.`
						});
						continue;
					}
					const config = nodeConfig;
					if (config.kind === "media") {
						const inputHandleId = config.inputHandleId;
						if (!inputHandleId || typeof inputHandleId !== "string" || inputHandleId.trim() === "") ctx.addIssue({
							code: "custom",
							path: [
								"nodes",
								nodeIndex,
								"config",
								...at
							],
							message: `Media node at index "${index}" must have a valid inputHandleId for ${node.type} node.`
						});
					}
					if ("opacity" in config) {
						const { opacity } = config;
						if (typeof opacity !== "number" || opacity < 0 || opacity > 1) ctx.addIssue({
							code: "custom",
							path: [
								"nodes",
								nodeIndex,
								"config",
								...at,
								"opacity"
							],
							message: "Opacity must be a number between 0 and 1."
						});
					}
					const children = config.children;
					if (children) walkLayout(children, [...at, "children"]);
				}
			};
			walkLayout(layout, ["layout"]);
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
		const path = [];
		function dfs(node) {
			visited.add(node);
			recStack.add(node);
			path.push(node);
			for (const neighbor of adj.get(node) ?? []) if (!visited.has(neighbor)) {
				if (dfs(neighbor)) return true;
			} else if (recStack.has(neighbor)) {
				path.push(neighbor);
				return true;
			}
			recStack.delete(node);
			path.pop();
			return false;
		}
		for (const nodeId of nodeMap.keys()) if (!visited.has(nodeId) && dfs(nodeId)) return {
			hasCycle: true,
			path: [...path]
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
export { getActiveMediaMetadata as C, isVirtualMediaData as D, hasOnlySingleSource as E, resolveMediaMimeType as O, generateId as S, getMediaType as T, createOutputItemSchema as _, FileDataSchema as a, extractSvgDimensions as b, ModerationError as c, NodeResultSchema as d, SingleOutputGenericSchema as f, checkNodeResultCache as g, appendOperation as h, ExportResultSchema as i, stampResult as k, MultiOutputGenericSchema as l, agentBulkUpdateSchema as m, DEFAULT_DURATION_MS as n, MIME_TYPES as o, VirtualMediaDataSchema as p, DataTypeVal as r, MediaMetadataSchema as s, AnyOutputUnionSchema as t, NodeMetadataSchema as u, createVirtualMedia as v, getFingerprint as w, findSourceAsset as x, envSchema as y };