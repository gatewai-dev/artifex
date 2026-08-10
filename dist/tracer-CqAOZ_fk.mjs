//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/utils/error-codes.mjs
function defineErrorCodes(codes) {
	return Object.fromEntries(Object.entries(codes).map(([key, value]) => [key, {
		code: key,
		message: value,
		toString: () => key
	}]));
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/error/codes.mjs
const BASE_ERROR_CODES = defineErrorCodes({
	USER_NOT_FOUND: "User not found",
	FAILED_TO_CREATE_USER: "Failed to create user",
	FAILED_TO_CREATE_SESSION: "Failed to create session",
	FAILED_TO_UPDATE_USER: "Failed to update user",
	FAILED_TO_GET_SESSION: "Failed to get session",
	INVALID_PASSWORD: "Invalid password",
	INVALID_EMAIL: "Invalid email",
	INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
	INVALID_USER: "Invalid user",
	SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
	PROVIDER_NOT_FOUND: "Provider not found",
	INVALID_TOKEN: "Invalid token",
	TOKEN_EXPIRED: "Token expired",
	ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
	FAILED_TO_GET_USER_INFO: "Failed to get user info",
	USER_EMAIL_NOT_FOUND: "User email not found",
	EMAIL_NOT_VERIFIED: "Email not verified",
	PASSWORD_TOO_SHORT: "Password too short",
	PASSWORD_TOO_LONG: "Password too long",
	USER_ALREADY_EXISTS: "User already exists.",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
	EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
	CHANGE_EMAIL_DISABLED: "Change email is disabled",
	CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
	SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
	FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
	ACCOUNT_NOT_FOUND: "Account not found",
	USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.",
	CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked. This request appears to be a CSRF attack.",
	VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled",
	EMAIL_ALREADY_VERIFIED: "Email is already verified",
	EMAIL_MISMATCH: "Email mismatch",
	SESSION_NOT_FRESH: "Session is not fresh",
	LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
	INVALID_ORIGIN: "Invalid origin",
	INVALID_CALLBACK_URL: "Invalid callbackURL",
	INVALID_REDIRECT_URL: "Invalid redirectURL",
	INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL",
	INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL",
	MISSING_OR_NULL_ORIGIN: "Missing or null Origin",
	CALLBACK_URL_REQUIRED: "callbackURL is required",
	FAILED_TO_CREATE_VERIFICATION: "Unable to create verification",
	FIELD_NOT_ALLOWED: "Field not allowed to be set",
	ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
	VALIDATION_ERROR: "Validation Error",
	MISSING_FIELD: "Field is required",
	METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: "POST method requires deferSessionRefresh to be enabled in session config",
	BODY_MUST_BE_AN_OBJECT: "Body must be an object",
	PASSWORD_ALREADY_SET: "User already has a password set"
});

//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.7_zod@4.3.6/node_modules/better-call/dist/error.mjs
function isErrorStackTraceLimitWritable() {
	const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
	if (desc === void 0) return Object.isExtensible(Error);
	return Object.prototype.hasOwnProperty.call(desc, "writable") ? desc.writable : desc.set !== void 0;
}
/**
* Hide internal stack frames from the error stack trace.
*/
function hideInternalStackFrames(stack) {
	const lines = stack.split("\n    at ");
	if (lines.length <= 1) return stack;
	lines.splice(1, 1);
	return lines.join("\n    at ");
}
/**
* Creates a custom error class that hides stack frames.
*/
function makeErrorForHideStackFrame(Base, clazz) {
	class HideStackFramesError extends Base {
		#hiddenStack;
		constructor(...args) {
			if (isErrorStackTraceLimitWritable()) {
				const limit = Error.stackTraceLimit;
				Error.stackTraceLimit = 0;
				super(...args);
				Error.stackTraceLimit = limit;
			} else super(...args);
			const stack = (/* @__PURE__ */ new Error()).stack;
			if (stack) this.#hiddenStack = hideInternalStackFrames(stack.replace(/^Error/, this.name));
		}
		get errorStack() {
			return this.#hiddenStack;
		}
	}
	Object.defineProperty(HideStackFramesError.prototype, "constructor", {
		get() {
			return clazz;
		},
		enumerable: false,
		configurable: true
	});
	return HideStackFramesError;
}
const statusCodes = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	MULTIPLE_CHOICES: 300,
	MOVED_PERMANENTLY: 301,
	FOUND: 302,
	SEE_OTHER: 303,
	NOT_MODIFIED: 304,
	TEMPORARY_REDIRECT: 307,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	"I'M_A_TEAPOT": 418,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_ENTITY: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NOT_EXTENDED: 510,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var InternalAPIError = class extends Error {
	constructor(status = "INTERNAL_SERVER_ERROR", body = void 0, headers = {}, statusCode = typeof status === "number" ? status : statusCodes[status]) {
		super(body?.message, body?.cause ? { cause: body.cause } : void 0);
		this.status = status;
		this.body = body;
		this.headers = headers;
		this.statusCode = statusCode;
		this.name = "APIError";
		this.status = status;
		this.headers = headers;
		this.statusCode = statusCode;
		this.body = body;
	}
};
var ValidationError = class extends InternalAPIError {
	constructor(message, issues) {
		super(400, {
			message,
			code: "VALIDATION_ERROR"
		});
		this.message = message;
		this.issues = issues;
		this.issues = issues;
	}
};
var BetterCallError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "BetterCallError";
	}
};
const kAPIErrorHeaderSymbol = Symbol.for("better-call:api-error-headers");
const APIError$1 = makeErrorForHideStackFrame(InternalAPIError, Error);

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/error/index.mjs
var BetterAuthError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "BetterAuthError";
		this.message = message;
		this.stack = "";
	}
};
var APIError = class APIError$2 extends APIError$1 {
	constructor(...args) {
		super(...args);
	}
	static fromStatus(status, body) {
		return new APIError$2(status, body);
	}
	static from(status, error) {
		return new APIError$2(status, {
			message: error.message,
			code: error.code
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/env/env-impl.mjs
const _envShim = Object.create(null);
const _getEnv = (useShim) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (useShim ? _envShim : globalThis);
const env = new Proxy(_envShim, {
	get(_, prop) {
		return _getEnv()[prop] ?? _envShim[prop];
	},
	has(_, prop) {
		return prop in _getEnv() || prop in _envShim;
	},
	set(_, prop, value) {
		const env$1 = _getEnv(true);
		env$1[prop] = value;
		return true;
	},
	deleteProperty(_, prop) {
		if (!prop) return false;
		const env$1 = _getEnv(true);
		delete env$1[prop];
		return true;
	},
	ownKeys() {
		const env$1 = _getEnv(true);
		return Object.keys(env$1);
	}
});
function toBoolean(val) {
	return val ? val !== "false" : false;
}
const nodeENV = env.NODE_ENV ?? "";
/** Detect if `NODE_ENV` environment variable is `production` */
const isProduction = nodeENV === "production";
/** Detect if `NODE_ENV` environment variable is `dev` or `development` */
const isDevelopment = () => nodeENV === "dev" || nodeENV === "development";
/** Detect if `NODE_ENV` environment variable is `test` */
const isTest = () => nodeENV === "test" || toBoolean(env.TEST);
/**
* Get environment variable with fallback
*/
function getEnvVar(key, fallback) {
	if (typeof process !== "undefined" && process.env) return process.env[key] ?? fallback;
	if (typeof Deno !== "undefined") return Deno.env.get(key) ?? fallback;
	if (typeof Bun !== "undefined") return Bun.env[key] ?? fallback;
	return fallback;
}
/**
* Get boolean environment variable
*/
function getBooleanEnvVar(key, fallback = true) {
	const value = getEnvVar(key);
	if (!value) return fallback;
	return value !== "0" && value.toLowerCase() !== "false" && value !== "";
}
/**
* Common environment variables used in Better Auth
*/
const ENV = Object.freeze({
	get BETTER_AUTH_SECRET() {
		return getEnvVar("BETTER_AUTH_SECRET");
	},
	get AUTH_SECRET() {
		return getEnvVar("AUTH_SECRET");
	},
	get BETTER_AUTH_TELEMETRY() {
		return getEnvVar("BETTER_AUTH_TELEMETRY");
	},
	get BETTER_AUTH_TELEMETRY_ID() {
		return getEnvVar("BETTER_AUTH_TELEMETRY_ID");
	},
	get NODE_ENV() {
		return getEnvVar("NODE_ENV", "development");
	},
	get PACKAGE_VERSION() {
		return getEnvVar("PACKAGE_VERSION", "0.0.0");
	},
	get BETTER_AUTH_TELEMETRY_ENDPOINT() {
		return getEnvVar("BETTER_AUTH_TELEMETRY_ENDPOINT", "");
	}
});

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/env/color-depth.mjs
const COLORS_2 = 1;
const COLORS_16 = 4;
const COLORS_256 = 8;
const COLORS_16m = 24;
const TERM_ENVS = {
	eterm: COLORS_16,
	cons25: COLORS_16,
	console: COLORS_16,
	cygwin: COLORS_16,
	dtterm: COLORS_16,
	gnome: COLORS_16,
	hurd: COLORS_16,
	jfbterm: COLORS_16,
	konsole: COLORS_16,
	kterm: COLORS_16,
	mlterm: COLORS_16,
	mosh: COLORS_16m,
	putty: COLORS_16,
	st: COLORS_16,
	"rxvt-unicode-24bit": COLORS_16m,
	terminator: COLORS_16m,
	"xterm-kitty": COLORS_16m
};
const CI_ENVS_MAP = new Map(Object.entries({
	APPVEYOR: COLORS_256,
	BUILDKITE: COLORS_256,
	CIRCLECI: COLORS_16m,
	DRONE: COLORS_256,
	GITEA_ACTIONS: COLORS_16m,
	GITHUB_ACTIONS: COLORS_16m,
	GITLAB_CI: COLORS_256,
	TRAVIS: COLORS_256
}));
const TERM_ENVS_REG_EXP = [
	/ansi/,
	/color/,
	/linux/,
	/direct/,
	/^con[0-9]*x[0-9]/,
	/^rxvt/,
	/^screen/,
	/^xterm/,
	/^vt100/,
	/^vt220/
];
function getColorDepth() {
	if (getEnvVar("FORCE_COLOR") !== void 0) switch (getEnvVar("FORCE_COLOR")) {
		case "":
		case "1":
		case "true": return COLORS_16;
		case "2": return COLORS_256;
		case "3": return COLORS_16m;
		default: return COLORS_2;
	}
	if (getEnvVar("NODE_DISABLE_COLORS") !== void 0 && getEnvVar("NODE_DISABLE_COLORS") !== "" || getEnvVar("NO_COLOR") !== void 0 && getEnvVar("NO_COLOR") !== "" || getEnvVar("TERM") === "dumb") return COLORS_2;
	if (getEnvVar("TMUX")) return COLORS_16m;
	if ("TF_BUILD" in env && "AGENT_NAME" in env) return COLORS_16;
	if ("CI" in env) {
		for (const { 0: envName, 1: colors } of CI_ENVS_MAP) if (envName in env) return colors;
		if (getEnvVar("CI_NAME") === "codeship") return COLORS_256;
		return COLORS_2;
	}
	if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(getEnvVar("TEAMCITY_VERSION")) !== null ? COLORS_16 : COLORS_2;
	switch (getEnvVar("TERM_PROGRAM")) {
		case "iTerm.app":
			if (!getEnvVar("TERM_PROGRAM_VERSION") || /^[0-2]\./.exec(getEnvVar("TERM_PROGRAM_VERSION")) !== null) return COLORS_256;
			return COLORS_16m;
		case "HyperTerm":
		case "MacTerm": return COLORS_16m;
		case "Apple_Terminal": return COLORS_256;
	}
	if (getEnvVar("COLORTERM") === "truecolor" || getEnvVar("COLORTERM") === "24bit") return COLORS_16m;
	if (getEnvVar("TERM")) {
		if (/truecolor/.exec(getEnvVar("TERM")) !== null) return COLORS_16m;
		if (/^xterm-256/.exec(getEnvVar("TERM")) !== null) return COLORS_256;
		const termEnv = getEnvVar("TERM").toLowerCase();
		if (TERM_ENVS[termEnv]) return TERM_ENVS[termEnv];
		if (TERM_ENVS_REG_EXP.some((term) => term.exec(termEnv) !== null)) return COLORS_16;
	}
	if (getEnvVar("COLORTERM")) return COLORS_16;
	return COLORS_2;
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/env/logger.mjs
const TTY_COLORS = {
	reset: "\x1B[0m",
	bright: "\x1B[1m",
	dim: "\x1B[2m",
	undim: "\x1B[22m",
	underscore: "\x1B[4m",
	blink: "\x1B[5m",
	reverse: "\x1B[7m",
	hidden: "\x1B[8m",
	fg: {
		black: "\x1B[30m",
		red: "\x1B[31m",
		green: "\x1B[32m",
		yellow: "\x1B[33m",
		blue: "\x1B[34m",
		magenta: "\x1B[35m",
		cyan: "\x1B[36m",
		white: "\x1B[37m"
	},
	bg: {
		black: "\x1B[40m",
		red: "\x1B[41m",
		green: "\x1B[42m",
		yellow: "\x1B[43m",
		blue: "\x1B[44m",
		magenta: "\x1B[45m",
		cyan: "\x1B[46m",
		white: "\x1B[47m"
	}
};
const levels = [
	"debug",
	"info",
	"success",
	"warn",
	"error"
];
function shouldPublishLog(currentLogLevel, logLevel) {
	return levels.indexOf(logLevel) >= levels.indexOf(currentLogLevel);
}
const levelColors = {
	info: TTY_COLORS.fg.blue,
	success: TTY_COLORS.fg.green,
	warn: TTY_COLORS.fg.yellow,
	error: TTY_COLORS.fg.red,
	debug: TTY_COLORS.fg.magenta
};
const formatMessage = (level, message, colorsEnabled) => {
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	if (colorsEnabled) return `${TTY_COLORS.dim}${timestamp}${TTY_COLORS.reset} ${levelColors[level]}${level.toUpperCase()}${TTY_COLORS.reset} ${TTY_COLORS.bright}[Better Auth]:${TTY_COLORS.reset} ${message}`;
	return `${timestamp} ${level.toUpperCase()} [Better Auth]: ${message}`;
};
const createLogger = (options) => {
	const enabled = options?.disabled !== true;
	const logLevel = options?.level ?? "warn";
	const colorsEnabled = options?.disableColors !== void 0 ? !options.disableColors : getColorDepth() !== 1;
	const LogFunc = (level, message, args = []) => {
		if (!enabled || !shouldPublishLog(logLevel, level)) return;
		const formattedMessage = formatMessage(level, message, colorsEnabled);
		if (!options || typeof options.log !== "function") {
			if (level === "error") console.error(formattedMessage, ...args);
			else if (level === "warn") console.warn(formattedMessage, ...args);
			else console.log(formattedMessage, ...args);
			return;
		}
		options.log(level === "success" ? "info" : level, message, ...args);
	};
	return {
		...Object.fromEntries(levels.map((level) => [level, (...[message, ...args]) => LogFunc(level, message, args)])),
		get level() {
			return logLevel;
		}
	};
};
const logger = createLogger();

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.2/node_modules/@better-auth/utils/dist/random.mjs
function expandAlphabet(alphabet) {
	switch (alphabet) {
		case "a-z": return "abcdefghijklmnopqrstuvwxyz";
		case "A-Z": return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		case "0-9": return "0123456789";
		case "-_": return "-_";
		default: throw new Error(`Unsupported alphabet: ${alphabet}`);
	}
}
function createRandomStringGenerator(...baseAlphabets) {
	const baseCharSet = baseAlphabets.map(expandAlphabet).join("");
	if (baseCharSet.length === 0) throw new Error("No valid characters provided for random string generation.");
	const baseCharSetLength = baseCharSet.length;
	return (length, ...alphabets) => {
		if (length <= 0) throw new Error("Length must be a positive integer.");
		let charSet = baseCharSet;
		let charSetLength = baseCharSetLength;
		if (alphabets.length > 0) {
			charSet = alphabets.map(expandAlphabet).join("");
			charSetLength = charSet.length;
		}
		const maxValid = Math.floor(256 / charSetLength) * charSetLength;
		const buf = new Uint8Array(length * 2);
		const bufLength = buf.length;
		let result = "";
		let bufIndex = bufLength;
		let rand;
		while (result.length < length) {
			if (bufIndex >= bufLength) {
				crypto.getRandomValues(buf);
				bufIndex = 0;
			}
			rand = buf[bufIndex++];
			if (rand < maxValid) result += charSet[rand % charSetLength];
		}
		return result;
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/utils/id.mjs
const generateId = (size) => {
	return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
};

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/context/global.mjs
const symbol = Symbol.for("better-auth:global");
let bind = null;
const __context = {};
const __betterAuthVersion = "1.6.26";
/**
* We store context instance in the globalThis.
*
* The reason we do this is that some bundlers, web framework, or package managers might
* create multiple copies of BetterAuth in the same process intentionally or unintentionally.
*
* For example, yarn v1, Next.js, SSR, Vite...
*
* @internal
*/
function __getBetterAuthGlobal() {
	if (!globalThis[symbol]) {
		globalThis[symbol] = {
			version: __betterAuthVersion,
			epoch: 1,
			context: __context
		};
		bind = globalThis[symbol];
	}
	bind = globalThis[symbol];
	if (bind.version !== __betterAuthVersion) {
		bind.version = __betterAuthVersion;
		bind.epoch++;
	}
	return globalThis[symbol];
}
function getBetterAuthVersion() {
	return __getBetterAuthGlobal().version;
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/async_hooks/index.mjs
const AsyncLocalStoragePromise = import(
	/* @vite-ignore */
	/* webpackIgnore: true */
	"node:async_hooks"
).then((mod) => mod.AsyncLocalStorage).catch((err) => {
	if ("AsyncLocalStorage" in globalThis) return globalThis.AsyncLocalStorage;
	if (typeof window !== "undefined") return null;
	console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
	console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
	console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
	throw err;
});
async function getAsyncLocalStorage() {
	const mod = await AsyncLocalStoragePromise;
	if (mod === null) throw new Error("getAsyncLocalStorage is only available in server code");
	else return mod;
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/context/transaction.mjs
const ensureAsyncStorage = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	if (!betterAuthGlobal.context.adapterAsyncStorage) {
		const AsyncLocalStorage = await getAsyncLocalStorage();
		betterAuthGlobal.context.adapterAsyncStorage = new AsyncLocalStorage();
	}
	return betterAuthGlobal.context.adapterAsyncStorage;
};
const getCurrentAdapter = async (fallback) => {
	return ensureAsyncStorage().then((als) => {
		return als.getStore()?.adapter || fallback;
	}).catch(() => {
		return fallback;
	});
};
const runWithAdapter = async (adapter, fn) => {
	let called = false;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await als.run({
				adapter,
				pendingHooks,
				isTransactionActive: false
			}, fn);
		} catch (err) {
			error = err;
			hasError = true;
		}
		for (const hook of pendingHooks) await hook();
		if (hasError) throw error;
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
const runWithTransaction = async (adapter, fn) => {
	let called = false;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		if (als.getStore()?.isTransactionActive) return fn();
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await adapter.transaction(async (trx) => {
				return als.run({
					adapter: trx,
					pendingHooks,
					isTransactionActive: true
				}, fn);
			});
		} catch (e) {
			hasError = true;
			error = e;
		}
		for (const hook of pendingHooks) await hook();
		if (hasError) throw error;
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
/**
* Queue a hook to be executed after the current transaction commits.
* If not in a transaction, the hook will execute immediately.
*/
const queueAfterTransactionHook = async (hook) => {
	return ensureAsyncStorage().then((als) => {
		const store = als.getStore();
		if (store) store.pendingHooks.push(hook);
		else return hook();
	}).catch(() => {
		return hook();
	});
};

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/db/get-tables.mjs
const getAuthTables = (options) => {
	const pluginSchema = (options.plugins ?? []).reduce((acc, plugin) => {
		const schema = plugin.schema;
		if (!schema) return acc;
		for (const [key, value] of Object.entries(schema)) acc[key] = {
			fields: {
				...acc[key]?.fields,
				...value.fields
			},
			modelName: value.modelName || key,
			disableMigrations: value.disableMigration ?? acc[key]?.disableMigrations
		};
		return acc;
	}, {});
	const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
	const rateLimitTable = { rateLimit: {
		modelName: options.rateLimit?.modelName || "rateLimit",
		fields: {
			key: {
				type: "string",
				unique: true,
				required: true,
				fieldName: options.rateLimit?.fields?.key || "key"
			},
			count: {
				type: "number",
				required: true,
				fieldName: options.rateLimit?.fields?.count || "count"
			},
			lastRequest: {
				type: "number",
				bigint: true,
				required: true,
				fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest",
				defaultValue: () => Date.now()
			}
		}
	} };
	const { user, session, account, verification, ...pluginTables } = pluginSchema;
	const verificationTable = { verification: {
		modelName: options.verification?.modelName || "verification",
		fields: {
			identifier: {
				type: "string",
				required: true,
				fieldName: options.verification?.fields?.identifier || "identifier",
				index: true
			},
			value: {
				type: "string",
				required: true,
				fieldName: options.verification?.fields?.value || "value"
			},
			expiresAt: {
				type: "date",
				required: true,
				fieldName: options.verification?.fields?.expiresAt || "expiresAt"
			},
			createdAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				fieldName: options.verification?.fields?.createdAt || "createdAt"
			},
			updatedAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				onUpdate: () => /* @__PURE__ */ new Date(),
				fieldName: options.verification?.fields?.updatedAt || "updatedAt"
			},
			...verification?.fields,
			...options.verification?.additionalFields
		},
		order: 4
	} };
	const sessionTable = { session: {
		modelName: options.session?.modelName || "session",
		fields: {
			expiresAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.expiresAt || "expiresAt"
			},
			token: {
				type: "string",
				required: true,
				fieldName: options.session?.fields?.token || "token",
				unique: true
			},
			createdAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.createdAt || "createdAt",
				defaultValue: () => /* @__PURE__ */ new Date()
			},
			updatedAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.updatedAt || "updatedAt",
				onUpdate: () => /* @__PURE__ */ new Date()
			},
			ipAddress: {
				type: "string",
				required: false,
				fieldName: options.session?.fields?.ipAddress || "ipAddress"
			},
			userAgent: {
				type: "string",
				required: false,
				fieldName: options.session?.fields?.userAgent || "userAgent"
			},
			userId: {
				type: "string",
				fieldName: options.session?.fields?.userId || "userId",
				references: {
					model: "user",
					field: "id",
					onDelete: "cascade"
				},
				required: true,
				index: true
			},
			...session?.fields,
			...options.session?.additionalFields
		},
		order: 2
	} };
	return {
		user: {
			modelName: options.user?.modelName || "user",
			fields: {
				name: {
					type: "string",
					required: true,
					fieldName: options.user?.fields?.name || "name",
					sortable: true
				},
				email: {
					type: "string",
					unique: true,
					required: true,
					fieldName: options.user?.fields?.email || "email",
					sortable: true
				},
				emailVerified: {
					type: "boolean",
					defaultValue: false,
					required: true,
					fieldName: options.user?.fields?.emailVerified || "emailVerified",
					input: false
				},
				image: {
					type: "string",
					required: false,
					fieldName: options.user?.fields?.image || "image"
				},
				createdAt: {
					type: "date",
					defaultValue: () => /* @__PURE__ */ new Date(),
					required: true,
					fieldName: options.user?.fields?.createdAt || "createdAt"
				},
				updatedAt: {
					type: "date",
					defaultValue: () => /* @__PURE__ */ new Date(),
					onUpdate: () => /* @__PURE__ */ new Date(),
					required: true,
					fieldName: options.user?.fields?.updatedAt || "updatedAt"
				},
				...user?.fields,
				...options.user?.additionalFields
			},
			order: 1
		},
		...!options.secondaryStorage || options.session?.storeSessionInDatabase ? sessionTable : {},
		account: {
			modelName: options.account?.modelName || "account",
			fields: {
				accountId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.accountId || "accountId"
				},
				providerId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.providerId || "providerId"
				},
				userId: {
					type: "string",
					references: {
						model: "user",
						field: "id",
						onDelete: "cascade"
					},
					required: true,
					fieldName: options.account?.fields?.userId || "userId",
					index: true
				},
				accessToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.accessToken || "accessToken"
				},
				refreshToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.refreshToken || "refreshToken"
				},
				idToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.idToken || "idToken"
				},
				accessTokenExpiresAt: {
					type: "date",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
				},
				refreshTokenExpiresAt: {
					type: "date",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.refreshTokenExpiresAt || "refreshTokenExpiresAt"
				},
				scope: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.scope || "scope"
				},
				password: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.password || "password"
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.createdAt || "createdAt",
					defaultValue: () => /* @__PURE__ */ new Date()
				},
				updatedAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.updatedAt || "updatedAt",
					onUpdate: () => /* @__PURE__ */ new Date()
				},
				...account?.fields,
				...options.account?.additionalFields
			},
			order: 3
		},
		...!options.secondaryStorage || options.verification?.storeInDatabase ? verificationTable : {},
		...pluginTables,
		...shouldAddRateLimitTable ? rateLimitTable : {}
	};
};

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/utils/json.mjs
const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
function reviveDate(value) {
	if (typeof value === "string" && iso8601Regex.test(value)) {
		const date = new Date(value);
		if (!isNaN(date.getTime())) return date;
	}
	return value;
}
/**
* Recursively walk a pre-parsed object and convert ISO 8601 date strings
* to Date instances. This handles the case where a Redis client (or similar)
* returns already-parsed JSON objects whose date fields are still strings.
*/
function reviveDates(value) {
	if (value === null || value === void 0) return value;
	if (typeof value === "string") return reviveDate(value);
	if (value instanceof Date) return value;
	if (Array.isArray(value)) return value.map(reviveDates);
	if (typeof value === "object") {
		const result = {};
		for (const key of Object.keys(value)) result[key] = reviveDates(value[key]);
		return result;
	}
	return value;
}
function safeJSONParse(data) {
	try {
		if (typeof data !== "string") {
			if (data === null || data === void 0) return null;
			return reviveDates(data);
		}
		return JSON.parse(data, (_, value) => reviveDate(value));
	} catch (e) {
		logger.error("Error parsing JSON", { error: e });
		return null;
	}
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+semantic-conventions@1.40.0/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js
/**
* The name of a collection (table, container) within the database.
*
* @example public.users
* @example customers
*
* @note It is **RECOMMENDED** to capture the value as provided by the application
* without attempting to do any case normalization.
*
* The collection name **SHOULD NOT** be extracted from `db.query.text`,
* when the database system supports query text with multiple collections
* in non-batch operations.
*
* For batch operations, if the individual operations are known to have the same
* collection name then that collection name **SHOULD** be used.
*/
const ATTR_DB_COLLECTION_NAME = "db.collection.name";
/**
* The name of the operation or command being executed.
*
* @example findAndModify
* @example HMSET
* @example SELECT
*
* @note It is **RECOMMENDED** to capture the value as provided by the application
* without attempting to do any case normalization.
*
* The operation name **SHOULD NOT** be extracted from `db.query.text`,
* when the database system supports query text with multiple operations
* in non-batch operations.
*
* If spaces can occur in the operation name, multiple consecutive spaces
* **SHOULD** be normalized to a single space.
*
* For batch operations, if the individual operations are known to have the same operation name
* then that operation name **SHOULD** be used prepended by `BATCH `,
* otherwise `db.operation.name` **SHOULD** be `BATCH` or some other database
* system specific term if more applicable.
*/
const ATTR_DB_OPERATION_NAME = "db.operation.name";
/**
* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
*
* @example 200
*/
const ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
/**
* The matched route template for the request. This **MUST** be low-cardinality and include all static path segments, with dynamic path segments represented with placeholders.
*
* @example /users/:userID?
* @example my-controller/my-action/{id?}
*
* @note **MUST NOT** be populated when this is not supported by the HTTP server framework as the route attribute should have low-cardinality and the URI path can NOT substitute it.
* **SHOULD** include the [application root](/docs/http/http-spans.md#http-server-definitions) if there is one.
*
* A static path segment is a part of the route template with a fixed, low-cardinality value. This includes literal strings like `/users/` and placeholders that
* are constrained to a finite, predefined set of values, e.g. `{controller}` or `{action}`.
*
* A dynamic path segment is a placeholder for a value that can have high cardinality and is not constrained to a predefined list like static path segments.
*
* Instrumentations **SHOULD** use routing information provided by the corresponding web framework. They **SHOULD** pick the most precise source of routing information and **MAY**
* support custom route formatting. Instrumentations **SHOULD** document the format and the API used to obtain the route string.
*/
const ATTR_HTTP_ROUTE = "http.route";

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs
/** Operation identifier (e.g. getSession, signUpWithEmailAndPassword). Uses endpoint operationId when set, otherwise the endpoint key. */
const ATTR_OPERATION_ID = "better_auth.operation_id";
/** Hook type (e.g. before, after, create.before). */
const ATTR_HOOK_TYPE = "better_auth.hook.type";
/** Execution context (e.g. user, plugin:id). */
const ATTR_CONTEXT = "better_auth.context";

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/instrumentation/noop.mjs
function createNoopSpan() {
	const span = {
		end() {},
		setAttribute(_key, _value) {},
		setStatus(_status) {},
		recordException(_exception) {},
		updateName(_name) {
			return span;
		}
	};
	return span;
}
function createNoopTracer(noopSpan) {
	function startActiveSpan(_name, ...rest) {
		const fn = rest[rest.length - 1];
		return fn(noopSpan);
	}
	return { startActiveSpan };
}
function createNoopTraceAPI() {
	const noopTracer = createNoopTracer(createNoopSpan());
	return {
		getTracer(_name, _version) {
			return noopTracer;
		},
		getActiveSpan() {}
	};
}
function createNoopOpenTelemetryAPI() {
	return {
		SpanStatusCode: {
			UNSET: 0,
			OK: 1,
			ERROR: 2
		},
		trace: createNoopTraceAPI()
	};
}
const noopOpenTelemetryAPI = createNoopOpenTelemetryAPI();

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/instrumentation/api.mjs
let openTelemetryAPIPromise;
let openTelemetryAPI;
function getOpenTelemetryAPI() {
	if (!openTelemetryAPIPromise) openTelemetryAPIPromise = import("./esm-CYFWBRGM.mjs").then((mod) => {
		openTelemetryAPI = mod;
	}).catch(() => void 0);
	return openTelemetryAPI ?? noopOpenTelemetryAPI;
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs
const INSTRUMENTATION_SCOPE = "better-auth";
const INSTRUMENTATION_VERSION = "1.6.26";
/**
* Better-auth uses `throw ctx.redirect(url)` for flow control (e.g. OAuth
* callbacks). These are APIErrors with 3xx status codes and should not be
* recorded as span errors.
*/
function isRedirectError(err) {
	if (err != null && typeof err === "object" && "name" in err && err.name === "APIError" && "statusCode" in err) {
		const status = err.statusCode;
		return status >= 300 && status < 400;
	}
	return false;
}
function endSpanWithError(span, err) {
	const { SpanStatusCode } = getOpenTelemetryAPI();
	if (isRedirectError(err)) {
		span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, err.statusCode);
		span.setStatus({ code: SpanStatusCode.OK });
	} else {
		span.recordException(err);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: String(err?.message ?? err)
		});
	}
	span.end();
}
function withSpan(name, attributes, fn) {
	const { trace } = getOpenTelemetryAPI();
	return trace.getTracer(INSTRUMENTATION_SCOPE, INSTRUMENTATION_VERSION).startActiveSpan(name, { attributes }, (span) => {
		try {
			const result = fn();
			if (result instanceof Promise) return result.then((value) => {
				span.end();
				return value;
			}).catch((err) => {
				endSpanWithError(span, err);
				throw err;
			});
			span.end();
			return result;
		} catch (err) {
			endSpanWithError(span, err);
			throw err;
		}
	});
}

//#endregion
export { isProduction as A, shouldPublishLog as C, getBooleanEnvVar as D, env as E, BetterCallError as F, ValidationError as I, kAPIErrorHeaderSymbol as L, APIError as M, BetterAuthError as N, getEnvVar as O, APIError$1 as P, BASE_ERROR_CODES as R, logger as S, ENV as T, getBetterAuthVersion as _, ATTR_DB_COLLECTION_NAME as a, TTY_COLORS as b, ATTR_HTTP_ROUTE as c, getCurrentAdapter as d, queueAfterTransactionHook as f, __getBetterAuthGlobal as g, getAsyncLocalStorage as h, ATTR_OPERATION_ID as i, isTest as j, isDevelopment as k, safeJSONParse as l, runWithTransaction as m, ATTR_CONTEXT as n, ATTR_DB_OPERATION_NAME as o, runWithAdapter as p, ATTR_HOOK_TYPE as r, ATTR_HTTP_RESPONSE_STATUS_CODE as s, withSpan as t, getAuthTables as u, generateId as v, getColorDepth as w, createLogger as x, createRandomStringGenerator as y, defineErrorCodes as z };