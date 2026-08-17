import { D as isVirtualMediaData, E as hasOnlySingleSource, i as ExportResultSchema, w as getFingerprint, x as findSourceAsset } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS, c as logger, r as GetAssetEndpointBackend } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-webhook/dist/metadata-OXlPO7rl.mjs
/**
* HTTP methods that can carry a JSON payload.
* GET intentionally omitted — a webhook without a body is a ping, not a delivery.
*/
const WEBHOOK_METHODS = [
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
];
const DEFAULT_WEBHOOK_TIMEOUT_S = 30;
const MAX_ERROR_BODY_LENGTH = 2048;
/**
* Local FileData guard — mirrors `@gatewai/client-utils` but without pulling
* browser-only entry points into the server bundle.
*/
const isFileData = (data) => typeof data === "object" && data !== null && "entity" in data;
/**
* Resolves an output item to its backing file, if any.
*
* Accepts a `FileData` directly, or a `VirtualMediaData` tree whose leaf
* operation is a file source (e.g. an import or a passthrough of an asset).
*/
function extractFileData(data) {
	if (isFileData(data)) return data;
	if (isVirtualMediaData(data)) return findSourceAsset(data);
	return null;
}
/**
* Turns a handle label into a stable, safe JSON object key, de-duplicating
* collisions (`Title` -> `Title`, `Title` -> `Title_2`).
*/
function payloadKey(label, seen) {
	const raw = label.trim().replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "input";
	const count = seen.get(raw) ?? 0;
	seen.set(raw, count + 1);
	return count === 0 ? raw : `${raw}_${count + 1}`;
}
/**
* Dispatches the resolved payload to the configured endpoint.
*
* `Content-Type` defaults to `application/json` unless the user supplies
* their own (matched case-insensitively). Aborts on timeout or when the
* surrounding job is cancelled.
*/
async function sendWebhook(options) {
	const headers = {};
	for (const header of options.headers) {
		const key = header.key.trim();
		if (!key) continue;
		headers[key] = header.value;
	}
	if (!Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) headers["content-type"] = "application/json";
	const timeoutSignal = AbortSignal.timeout(options.timeoutMs);
	const signal = options.abortSignal ? AbortSignal.any([timeoutSignal, options.abortSignal]) : timeoutSignal;
	const response = await fetch(options.url, {
		method: options.method,
		headers,
		body: JSON.stringify(options.payload),
		signal
	});
	const body = await response.text();
	return {
		status: response.status,
		ok: response.ok,
		body
	};
}
/**
* Caps the response body echoed into error messages.
*/
function truncatedErrorBody(body) {
	const trimmed = body.trim();
	if (trimmed.length <= MAX_ERROR_BODY_LENGTH) return trimmed;
	return `${trimmed.slice(0, MAX_ERROR_BODY_LENGTH)}…`;
}
const HEADER_KEY_MAX = 128;
const HEADER_VALUE_MAX = 4096;
const HEADERS_MAX = 40;
const TIMEOUT_MIN_S = 5;
const TIMEOUT_MAX_S = 60;
const WebhookHeaderSchema = z$1.object({
	key: z$1.string().max(HEADER_KEY_MAX),
	value: z$1.string().max(HEADER_VALUE_MAX)
}).strict();
/**
* Strict schema for the Webhook node.
*
* `url` is optional so a freshly created node parses before the user enters
* anything; missing/malformed URLs are flagged by `metadata.validation`
* (editor) and fail fast in the processors.
*/
const WebhookNodeConfigSchema = z$1.object({
	url: z$1.string().min(1).optional(),
	method: z$1.enum(WEBHOOK_METHODS).default("POST"),
	headers: z$1.array(WebhookHeaderSchema).max(HEADERS_MAX).default([]).transform((headers) => headers.filter((h) => h.key.trim() !== "" && h.value.trim() !== "")),
	timeout: z$1.number().int().min(TIMEOUT_MIN_S).max(TIMEOUT_MAX_S).default(DEFAULT_WEBHOOK_TIMEOUT_S)
}).strict();
function isHttpUrl(value) {
	return /^https?:\/\//i.test(value.trim());
}
/**
* Accepted variable-input data types, mirroring the Compositor node.
* Text is sent verbatim; everything else is resolved to a file URL.
*/
const WEBHOOK_INPUT_DATA_TYPES = [
	"Text",
	"Image",
	"Video",
	"Audio",
	"Caption",
	"SVG",
	"GIF",
	"Lottie"
];
const metadata = defineMetadata({
	type: "Webhook",
	displayName: "Webhook",
	description: "Sends workflow outputs to an external URL as a JSON web request.",
	category: "Input/Output",
	configSchema: WebhookNodeConfigSchema,
	resultSchema: ExportResultSchema,
	isTerminal: true,
	isTransient: false,
	showInQuickAccess: false,
	variableInputs: {
		enabled: true,
		dataTypes: [...WEBHOOK_INPUT_DATA_TYPES]
	},
	handles: {
		inputs: [],
		outputs: []
	},
	defaultConfig: WebhookNodeConfigSchema.parse({
		method: "POST",
		headers: [],
		timeout: 30
	}),
	validation: (config, inputs) => {
		const errors = {};
		const url = config?.url?.trim() ?? "";
		if (!url) errors.url = "Enter the webhook URL to receive requests.";
		else if (!isHttpUrl(url)) errors.url = "Webhook URL must start with http:// or https://.";
		if (!inputs || Object.keys(inputs).length === 0) errors.inputs = "Connect at least one input to send.";
		return Object.keys(errors).length > 0 ? errors : null;
	},
	pricing: () => 0
});

//#endregion
//#region ../../nodes/node-webhook/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WebhookServerProcessor = class WebhookServerProcessor$1 {
	graph;
	mediaResolver;
	env;
	async process({ node, data, abortSignal }) {
		try {
			const config = WebhookNodeConfigSchema.parse(node.config);
			const url = (config.url ?? "").trim();
			if (!url) return {
				success: false,
				error: "Webhook URL is required"
			};
			const inputs = this.graph.forNode(node, data).inputs().allWithHandle();
			if (inputs.length === 0) return {
				success: false,
				error: "Webhook requires at least one connected input"
			};
			const seen = /* @__PURE__ */ new Map();
			const payload = {};
			for (const { handle, value } of inputs) {
				if (!value) continue;
				const key = payloadKey(handle.label, seen);
				payload[key] = value.type === "Text" ? String(value.data ?? "") : await this.resolveFileUrl(value.data, value.type, data.canvas.userId);
			}
			if (Object.keys(payload).length === 0) return {
				success: false,
				error: "Webhook has no resolvable inputs"
			};
			const response = await sendWebhook({
				url,
				method: config.method,
				headers: config.headers,
				payload,
				timeoutMs: config.timeout * 1e3,
				abortSignal
			});
			if (!response.ok) {
				const detail = truncatedErrorBody(response.body);
				return {
					success: false,
					error: `Webhook request failed (${response.status})${detail ? `: ${detail}` : ""}`
				};
			}
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: "Text",
						data: response.body,
						outputHandleId: void 0
					}] }],
					sourceFingerprint: getFingerprint({
						payload,
						config
					})
				}
			};
		} catch (err) {
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "Webhook processing failed");
			return err instanceof Error ? {
				success: false,
				error: err.message
			} : {
				success: false,
				error: "Webhook processing failed"
			};
		}
	}
	/**
	* Resolves a media output to an absolute file URL.
	*
	* Already-materialized files (FileData or virtual media rooted in a plain
	* source) map straight to their asset endpoint. Anything that still needs
	* composition is rendered through the media resolver first, mirroring the
	* Export node's server-side rendering behavior.
	*/
	async resolveFileUrl(data, type, userId) {
		const file = extractFileData(data);
		if (file?.entity && (!isVirtualMediaData(data) || hasOnlySingleSource(data))) return GetAssetEndpointBackend(this.env.BASE_URL, file.entity);
		if (!isVirtualMediaData(data)) throw new Error(`Cannot resolve ${type} input to a file URL`);
		const resolved = await this.mediaResolver.resolveToAsset(data, type, { userId });
		const resolvedEntity = extractFileData(resolved.virtualMedia)?.entity;
		if (resolvedEntity) return GetAssetEndpointBackend(this.env.BASE_URL, resolvedEntity);
		if (resolved.fileKey) {
			const fallbackAsset = {
				id: resolved.fileKey,
				key: resolved.fileKey,
				mimeType: resolved.mimeType ?? "application/octet-stream"
			};
			return GetAssetEndpointBackend(this.env.BASE_URL, fallbackAsset);
		}
		throw new Error(`Unable to resolve ${type} input to a file URL`);
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], WebhookServerProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], WebhookServerProcessor.prototype, "mediaResolver", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], WebhookServerProcessor.prototype, "env", void 0);
WebhookServerProcessor = __decorate([injectable()], WebhookServerProcessor);
var server_default = defineNode(metadata, { backendProcessor: WebhookServerProcessor });

//#endregion
export { server_default as default };