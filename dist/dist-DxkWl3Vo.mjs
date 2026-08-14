import { i as __require, t as __commonJSMin } from "./chunk-DPkJJFeX.mjs";
import { o as MIME_TYPES, y as envSchema } from "./dist-DBCHxcBj.mjs";
import { createReadStream } from "node:fs";
import fs$1 from "node:fs/promises";
import { z as z$1 } from "zod";
import pino from "pino";
import { Container, inject, injectable, postConstruct } from "inversify";
import assert from "node:assert";
import { PassThrough, Readable } from "node:stream";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
const APP_VERSION = "1.0.155";
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
export { TOKENS as a, logger as c, rendererLogger as d, R2StorageService as i, loggerContext as l, ENV_CONFIG as n, container as o, GetAssetEndpointBackend as r, getAssetKey as s, APP_VERSION as t, mediaLogger as u };