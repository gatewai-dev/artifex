import { t as __commonJSMin } from "./chunk-DPkJJFeX.mjs";
import { _ as createOutputItemSchema, a as FileDataSchema, l as MultiOutputGenericSchema } from "./dist-DBCHxcBj.mjs";
import { c as logger, n as ENV_CONFIG } from "./dist-DwwocMHt.mjs";
import { n as prisma } from "./dist-BmiZG8vq.mjs";
import { c as uploadToImportNode, i as finishUploadToImportNode, o as prepareUploadToImportNode } from "./server-dPmIvDkb.mjs";
import "./src-CA7_tJ-a.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode } from "./server-B1wfqy91.mjs";
import { n as getKyselyDatabaseType, t as createKyselyAdapter } from "./dist-i_X5oDqs.mjs";
import { n as sql } from "./compiled-query-Bw_2JZUJ.mjs";
import { A as isProduction, D as getBooleanEnvVar, E as env, M as APIError$1, N as BetterAuthError, O as getEnvVar, R as BASE_ERROR_CODES, S as logger$1, T as ENV, _ as getBetterAuthVersion, j as isTest, l as safeJSONParse, p as runWithAdapter, u as getAuthTables, v as generateId$1, x as createLogger, y as createRandomStringGenerator, z as defineErrorCodes } from "./tracer-paBLaQ7d.mjs";
import { i as initGetFieldName, n as createAdapterFactory, r as initGetModelName, t as whereOperators } from "./adapter-BjHHVvWA.mjs";
import { A as base64Url, B as getOrigin, C as sessionMiddleware, D as getCookies, E as expireCookie, F as hasServerSessionStore, G as getDate$1, H as createAuthEndpoint, I as findInvalidTrustedProxies, L as getIp, M as mergeSchema, N as parseSessionOutput, O as setSessionCookie, P as parseUserOutput, R as matchesOriginPattern, S as getSessionFromCtx, T as deleteSessionCookie, U as createAuthMiddleware, V as isDynamicBaseURLConfig, W as isAPIError$1, _ as runPluginInit, a as router, b as createHash$1, c as betterFetch, d as verifyPassword$1, f as getInternalPlugins, g as resolveRequestContext, h as resolveDynamicTrustedProxyHeaders, i as getEndpoints, j as isPromise, k as base64$1, l as generateRandomString, m as getTrustedProviders, n as role, o as checkPassword, p as getTrustedOrigins, r as checkEndpointConflicts, s as socialProviders, t as createAccessControl, u as hashPassword$1, v as defu, w as createCookieGetter, x as getAuthoritativeSessionFromCtx, y as createInternalAdapter, z as getBaseURL } from "./access-M8Frymj_.mjs";
import { i as HTTPException, n as getCookie, r as Hono, t as zValidator } from "./dist-DKds_9kg.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import * as z$3 from "zod";
import { z as z$1 } from "zod";
import { injectable } from "inversify";
import { createHash } from "node:crypto";
import { z as z$2 } from "zod/v3";

//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/client/parser.mjs
const PROTO_POLLUTION_PATTERNS = {
	proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
	constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
	protoShort: /"__proto__"\s*:/,
	constructorShort: /"constructor"\s*:/
};
const JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
const SPECIAL_VALUES = {
	true: true,
	false: false,
	null: null,
	undefined: void 0,
	nan: NaN,
	infinity: Number.POSITIVE_INFINITY,
	"-infinity": Number.NEGATIVE_INFINITY
};
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
	return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
	const match = ISO_DATE_REGEX.exec(value);
	if (!match) return null;
	const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
	const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
	if (offsetSign) {
		const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
		date.setUTCMinutes(date.getUTCMinutes() + offset);
	}
	return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
	const { strict = false, warnings = false, reviver, parseDates = true } = options;
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	const lowerValue = trimmed.toLowerCase();
	if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) return SPECIAL_VALUES[lowerValue];
	if (!JSON_SIGNATURE.test(trimmed)) {
		if (strict) throw new SyntaxError("[better-json] Invalid JSON");
		return value;
	}
	if (Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
		const matches = pattern.test(trimmed);
		if (matches && warnings) console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
		return matches;
	}) && strict) throw new Error("[better-json] Potential prototype pollution attempt detected");
	try {
		const secureReviver = (key, value$1) => {
			if (key === "__proto__" || key === "constructor" && value$1 && typeof value$1 === "object" && "prototype" in value$1) {
				if (warnings) console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
				return;
			}
			if (parseDates && typeof value$1 === "string") {
				const date = parseISODate(value$1);
				if (date) return date;
			}
			return reviver ? reviver(key, value$1) : value$1;
		};
		return JSON.parse(trimmed, secureReviver);
	} catch (error) {
		if (strict) throw error;
		return value;
	}
}
function parseJSON(value, options = { strict: true }) {
	return betterJSONParse(value, options);
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/package.mjs
var version = "1.6.26";

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/version.mjs
const PACKAGE_VERSION$1 = version;

//#endregion
//#region ../../nodes/node-import/dist/metadata-gHrdMcbF.mjs
const ImportResultSchema = z$1.union([
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Video"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Image"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Audio"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("SVG"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Caption"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("GIF"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Lottie"), FileDataSchema)),
	MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("LUT"), FileDataSchema))
]);
const ImportNodeConfigSchema = z$1.object({ file: z$1.string().min(1).max(4096).refine((s) => s.trim().length > 0, "File path cannot be empty or only whitespace").optional() }).strict();
const metadata = defineMetadata({
	type: "Import",
	displayName: "Import",
	description: "Upload your files",
	category: "Input/Output",
	configSchema: ImportNodeConfigSchema,
	resultSchema: ImportResultSchema,
	isTerminal: false,
	isTransient: false,
	showInQuickAccess: false,
	handles: {
		inputs: [],
		outputs: [{
			dataTypes: [
				"Audio",
				"Image",
				"Video",
				"SVG",
				"Caption",
				"Lottie",
				"LUT",
				"GIF"
			],
			label: "Result",
			order: 0
		}]
	}
});

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+api-key@1.6.26_@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-f_357d091d724ef3028b044205d47069ba/node_modules/@better-auth/api-key/dist/version-vgVyvied.mjs
const API_KEY_ERROR_CODES = defineErrorCodes({
	INVALID_METADATA_TYPE: "metadata must be an object or undefined",
	REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided",
	REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided",
	USER_BANNED: "User is banned",
	UNAUTHORIZED_SESSION: "Unauthorized or invalid session",
	KEY_NOT_FOUND: "API Key not found",
	KEY_DISABLED: "API Key is disabled",
	KEY_EXPIRED: "API Key has expired",
	USAGE_EXCEEDED: "API Key has reached its usage limit",
	KEY_NOT_RECOVERABLE: "API Key is not recoverable",
	EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.",
	EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.",
	INVALID_REMAINING: "The remaining count is either too large or too small.",
	INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.",
	INVALID_NAME_LENGTH: "The name length is either too large or too small.",
	METADATA_DISABLED: "Metadata is disabled.",
	RATE_LIMIT_EXCEEDED: "Rate limit exceeded.",
	NO_VALUES_TO_UPDATE: "No values to update.",
	KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.",
	INVALID_API_KEY: "Invalid API key.",
	INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.",
	INVALID_REFERENCE_ID_FROM_API_KEY: "The reference id from the API key is invalid.",
	INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.",
	SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only.",
	FAILED_TO_UPDATE_API_KEY: "Failed to update API key",
	NAME_REQUIRED: "API Key name is required.",
	ORGANIZATION_ID_REQUIRED: "Organization ID is required for organization-owned API keys.",
	USER_NOT_MEMBER_OF_ORGANIZATION: "You are not a member of the organization that owns this API key.",
	INSUFFICIENT_API_KEY_PERMISSIONS: "You do not have permission to perform this action on organization API keys.",
	NO_DEFAULT_API_KEY_CONFIGURATION_FOUND: "No default api-key configuration found.",
	ORGANIZATION_PLUGIN_REQUIRED: "Organization plugin is required for organization-owned API keys. Please install and configure the organization plugin."
});
const PACKAGE_VERSION = "1.6.26";

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/db/adapter-base.mjs
async function getBaseAdapter(options, handleDirectDatabase) {
	let adapter;
	if (!options.database) {
		const tables = getAuthTables(options);
		const memoryDB = Object.keys(tables).reduce((acc, key) => {
			acc[key] = [];
			return acc;
		}, {});
		const { memoryAdapter } = await import("./dist-BrPTyU7a.mjs");
		adapter = memoryAdapter(memoryDB)(options);
	} else if (typeof options.database === "function") adapter = options.database(options);
	else adapter = await handleDirectDatabase(options);
	if (!adapter.transaction) {
		logger$1.warn("Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.");
		adapter.transaction = async (cb) => {
			return cb(adapter);
		};
	}
	return adapter;
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/db/adapter-kysely.mjs
async function getAdapter(options) {
	return getBaseAdapter(options, async (opts) => {
		const { createKyselyAdapter: createKyselyAdapter$1 } = await import("./kysely-adapter-CvK_cUcl.mjs");
		const { kysely, databaseType, transaction } = await createKyselyAdapter$1(opts);
		if (!kysely) throw new BetterAuthError("Failed to initialize database adapter");
		const { kyselyAdapter } = await import("./kysely-adapter-CvK_cUcl.mjs");
		return kyselyAdapter(kysely, {
			type: databaseType || "sqlite",
			debugLogs: opts.database && "debugLogs" in opts.database ? opts.database.debugLogs : false,
			transaction
		})(opts);
	});
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/db/get-schema.mjs
function getSchema(config) {
	const tables = getAuthTables(config);
	const schema$1 = {};
	for (const key in tables) {
		const table = tables[key];
		const fields = table.fields;
		const actualFields = {};
		Object.entries(fields).forEach(([key$1, field]) => {
			actualFields[field.fieldName || key$1] = field;
			if (field.references) {
				const refTable = tables[field.references.model];
				if (refTable) actualFields[field.fieldName || key$1].references = {
					...field.references,
					model: refTable.modelName,
					field: field.references.field
				};
			}
		});
		if (schema$1[table.modelName]) {
			schema$1[table.modelName].fields = {
				...schema$1[table.modelName].fields,
				...actualFields
			};
			if (table.disableMigrations) schema$1[table.modelName].disableMigrations = true;
			continue;
		}
		schema$1[table.modelName] = {
			fields: actualFields,
			order: table.order || Infinity,
			disableMigrations: table.disableMigrations
		};
	}
	return schema$1;
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/db/get-migration.mjs
const map = {
	postgres: {
		string: [
			"character varying",
			"varchar",
			"text",
			"uuid"
		],
		number: [
			"int4",
			"integer",
			"bigint",
			"smallint",
			"numeric",
			"real",
			"double precision"
		],
		boolean: ["bool", "boolean"],
		date: [
			"timestamptz",
			"timestamp",
			"date"
		],
		json: ["json", "jsonb"]
	},
	mysql: {
		string: [
			"varchar",
			"text",
			"uuid"
		],
		number: [
			"integer",
			"int",
			"bigint",
			"smallint",
			"decimal",
			"float",
			"double"
		],
		boolean: ["boolean", "tinyint"],
		date: [
			"timestamp",
			"datetime",
			"date"
		],
		json: ["json"]
	},
	sqlite: {
		string: ["TEXT"],
		number: [
			"INTEGER",
			"REAL",
			"BIGINT"
		],
		boolean: ["INTEGER", "BOOLEAN"],
		date: ["DATE", "INTEGER"],
		json: ["TEXT"]
	},
	mssql: {
		string: [
			"varchar",
			"nvarchar",
			"uniqueidentifier"
		],
		number: [
			"int",
			"bigint",
			"smallint",
			"decimal",
			"float",
			"double"
		],
		boolean: ["bit", "smallint"],
		date: [
			"datetime2",
			"date",
			"datetime"
		],
		json: ["varchar", "nvarchar"]
	}
};
function matchType(columnDataType, fieldType, dbType) {
	function normalize(type) {
		return type.toLowerCase().split("(")[0].trim();
	}
	if (fieldType === "string[]" || fieldType === "number[]") return columnDataType.toLowerCase().includes("json");
	const types = map[dbType];
	return (Array.isArray(fieldType) ? types["string"].map((t) => t.toLowerCase()) : types[fieldType].map((t) => t.toLowerCase())).includes(normalize(columnDataType));
}
/**
* Get the current PostgreSQL schema (search_path) for the database connection
* Returns the first schema in the search_path, defaulting to 'public' if not found
*/
async function getPostgresSchema(db) {
	try {
		const result = await sql`SHOW search_path`.execute(db);
		const searchPath = result.rows[0]?.search_path ?? result.rows[0]?.searchPath;
		if (searchPath) return searchPath.split(",").map((s) => s.trim()).map((s) => s.replace(/^["']|["']$/g, "")).filter((s) => !s.startsWith("$") && !s.startsWith("\\$"))[0] || "public";
	} catch {}
	return "public";
}
async function getMigrations(config) {
	const betterAuthSchema = getSchema(config);
	const logger$2 = createLogger(config.logger);
	let { kysely: db, databaseType: dbType } = await createKyselyAdapter(config);
	if (!dbType) {
		logger$2.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.");
		dbType = "sqlite";
	}
	if (!db) {
		logger$2.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.");
		process.exit(1);
	}
	let currentSchema = "public";
	if (dbType === "postgres") {
		currentSchema = await getPostgresSchema(db);
		logger$2.debug(`PostgreSQL migration: Using schema '${currentSchema}' (from search_path)`);
		try {
			const schemaCheck = await sql`
				SELECT schema_name
				FROM information_schema.schemata
				WHERE schema_name = ${currentSchema}
			`.execute(db);
			if (!(schemaCheck.rows[0]?.schema_name ?? schemaCheck.rows[0]?.schemaName)) logger$2.warn(`Schema '${currentSchema}' does not exist. Tables will be inspected from available schemas. Consider creating the schema first or checking your database configuration.`);
		} catch (error) {
			logger$2.debug(`Could not verify schema existence: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
	const allTableMetadata = await db.introspection.getTables();
	let tableMetadata = allTableMetadata;
	if (dbType === "postgres") try {
		const tablesInSchema = await sql`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = ${currentSchema}
				AND table_type = 'BASE TABLE'
			`.execute(db);
		const tableNamesInSchema = new Set(tablesInSchema.rows.map((row) => row.table_name ?? row.tableName));
		tableMetadata = allTableMetadata.filter((table) => table.schema === currentSchema && tableNamesInSchema.has(table.name));
		logger$2.debug(`Found ${tableMetadata.length} table(s) in schema '${currentSchema}': ${tableMetadata.map((t) => t.name).join(", ") || "(none)"}`);
	} catch (error) {
		logger$2.warn(`Could not filter tables by schema. Using all discovered tables. Error: ${error instanceof Error ? error.message : String(error)}`);
	}
	const toBeCreated = [];
	const toBeAdded = [];
	for (const [key, value] of Object.entries(betterAuthSchema)) {
		if (value.disableMigrations) continue;
		const table = tableMetadata.find((t) => t.name === key);
		if (!table) {
			const tIndex = toBeCreated.findIndex((t) => t.table === key);
			const tableData = {
				table: key,
				fields: value.fields,
				order: value.order || Infinity
			};
			const insertIndex = toBeCreated.findIndex((t) => (t.order || Infinity) > tableData.order);
			if (insertIndex === -1) if (tIndex === -1) toBeCreated.push(tableData);
			else toBeCreated[tIndex].fields = {
				...toBeCreated[tIndex].fields,
				...value.fields
			};
			else toBeCreated.splice(insertIndex, 0, tableData);
			continue;
		}
		const toBeAddedFields = {};
		for (const [fieldName, field] of Object.entries(value.fields)) {
			const column = table.columns.find((c) => c.name === fieldName);
			if (!column) {
				toBeAddedFields[fieldName] = field;
				continue;
			}
			if (matchType(column.dataType, field.type, dbType)) continue;
			else logger$2.warn(`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`);
		}
		if (Object.keys(toBeAddedFields).length > 0) toBeAdded.push({
			table: key,
			fields: toBeAddedFields,
			order: value.order || Infinity
		});
	}
	const migrations = [];
	const useUUIDs = config.advanced?.database?.generateId === "uuid";
	const useNumberId = config.advanced?.database?.generateId === "serial";
	function getType(field, fieldName) {
		const type = field.type;
		const provider = dbType || "sqlite";
		const typeMap = {
			string: {
				sqlite: "text",
				postgres: "text",
				mysql: field.unique ? "varchar(255)" : field.references ? "varchar(36)" : field.sortable ? "varchar(255)" : field.index ? "varchar(255)" : "text",
				mssql: field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : "varchar(8000)"
			},
			boolean: {
				sqlite: "integer",
				postgres: "boolean",
				mysql: "boolean",
				mssql: "smallint"
			},
			number: {
				sqlite: field.bigint ? "bigint" : "integer",
				postgres: field.bigint ? "bigint" : "integer",
				mysql: field.bigint ? "bigint" : "integer",
				mssql: field.bigint ? "bigint" : "integer"
			},
			date: {
				sqlite: "date",
				postgres: "timestamptz",
				mysql: "timestamp(3)",
				mssql: sql`datetime2(3)`
			},
			json: {
				sqlite: "text",
				postgres: "jsonb",
				mysql: "json",
				mssql: "varchar(8000)"
			},
			id: {
				postgres: useNumberId ? sql`integer GENERATED BY DEFAULT AS IDENTITY` : useUUIDs ? "uuid" : "text",
				mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				sqlite: useNumberId ? "integer" : "text"
			},
			foreignKeyId: {
				postgres: useNumberId ? "integer" : useUUIDs ? "uuid" : "text",
				mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				sqlite: useNumberId ? "integer" : "text"
			},
			"string[]": {
				sqlite: "text",
				postgres: "jsonb",
				mysql: "json",
				mssql: "varchar(8000)"
			},
			"number[]": {
				sqlite: "text",
				postgres: "jsonb",
				mysql: "json",
				mssql: "varchar(8000)"
			}
		};
		if (fieldName === "id" || field.references?.field === "id") {
			if (fieldName === "id") return typeMap.id[provider];
			return typeMap.foreignKeyId[provider];
		}
		if (Array.isArray(type)) return "text";
		if (!(type in typeMap)) throw new Error(`Unsupported field type '${String(type)}' for field '${fieldName}'. Allowed types are: string, number, boolean, date, string[], number[]. If you need to store structured data, store it as a JSON string (type: "string") or split it into primitive fields. See https://better-auth.com/docs/advanced/schema#additional-fields`);
		return typeMap[type][provider];
	}
	const getModelName = initGetModelName({
		schema: getAuthTables(config),
		usePlural: false
	});
	const getFieldName = initGetFieldName({
		schema: getAuthTables(config),
		usePlural: false
	});
	function getReferencePath(model, field) {
		try {
			return `${getModelName(model)}.${getFieldName({
				model,
				field
			})}`;
		} catch {
			return `${model}.${field}`;
		}
	}
	const deferredIndexes = [];
	if (toBeAdded.length) for (const table of toBeAdded) for (const [fieldName, field] of Object.entries(table.fields)) {
		const type = getType(field, fieldName);
		const builder = db.schema.alterTable(table.table);
		if (field.index) {
			const indexName = `${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`;
			const indexBuilder = db.schema.createIndex(indexName).on(table.table).columns([fieldName]);
			deferredIndexes.push(field.unique ? indexBuilder.unique() : indexBuilder);
		}
		const built = builder.addColumn(fieldName, type, (col) => {
			col = field.required !== false ? col.notNull() : col;
			if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
			if (field.unique) col = col.unique();
			if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql`CURRENT_TIMESTAMP(3)`);
			else col = col.defaultTo(sql`CURRENT_TIMESTAMP`);
			return col;
		});
		migrations.push(built);
	}
	if (toBeCreated.length) for (const table of toBeCreated) {
		const idType = getType({ type: useNumberId ? "number" : "string" }, "id");
		let dbT = db.schema.createTable(table.table).addColumn("id", idType, (col) => {
			if (useNumberId) {
				if (dbType === "postgres") return col.primaryKey().notNull();
				else if (dbType === "sqlite") return col.primaryKey().notNull();
				else if (dbType === "mssql") return col.identity().primaryKey().notNull();
				return col.autoIncrement().primaryKey().notNull();
			}
			if (useUUIDs) {
				if (dbType === "postgres") return col.primaryKey().defaultTo(sql`pg_catalog.gen_random_uuid()`).notNull();
				return col.primaryKey().notNull();
			}
			return col.primaryKey().notNull();
		});
		for (const [fieldName, field] of Object.entries(table.fields)) {
			const type = getType(field, fieldName);
			dbT = dbT.addColumn(fieldName, type, (col) => {
				col = field.required !== false ? col.notNull() : col;
				if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
				if (field.unique) col = col.unique();
				if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql`CURRENT_TIMESTAMP(3)`);
				else col = col.defaultTo(sql`CURRENT_TIMESTAMP`);
				return col;
			});
			if (field.index && !field.unique) {
				const builder = db.schema.createIndex(`${table.table}_${fieldName}_idx`).on(table.table).columns([fieldName]);
				deferredIndexes.push(builder);
			}
		}
		migrations.push(dbT);
	}
	for (const index of deferredIndexes) migrations.push(index);
	async function runMigrations() {
		for (const migration of migrations) await migration.execute();
	}
	async function compileMigrations() {
		return migrations.map((m) => m.compile().sql).join(";\n\n") + ";";
	}
	return {
		toBeCreated,
		toBeAdded,
		runMigrations,
		compileMigrations
	};
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/utils/constants.mjs
const DEFAULT_SECRET = "better-auth-secret-12345678901234567890";

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/context/secret-utils.mjs
/**
* Estimates the entropy of a string in bits.
* This is a simple approximation that helps detect low-entropy secrets.
*/
function estimateEntropy$1(str) {
	const unique = new Set(str).size;
	if (unique === 0) return 0;
	return Math.log2(Math.pow(unique, str.length));
}
function parseSecretsEnv(envValue) {
	if (!envValue) return null;
	return envValue.split(",").map((entry) => {
		entry = entry.trim();
		const colonIdx = entry.indexOf(":");
		if (colonIdx === -1) throw new BetterAuthError(`Invalid BETTER_AUTH_SECRETS entry: "${entry}". Expected format: "<version>:<secret>"`);
		const version$1 = parseInt(entry.slice(0, colonIdx), 10);
		if (!Number.isInteger(version$1) || version$1 < 0) throw new BetterAuthError(`Invalid version in BETTER_AUTH_SECRETS: "${entry.slice(0, colonIdx)}". Version must be a non-negative integer.`);
		const value = entry.slice(colonIdx + 1).trim();
		if (!value) throw new BetterAuthError(`Empty secret value for version ${version$1} in BETTER_AUTH_SECRETS.`);
		return {
			version: version$1,
			value
		};
	});
}
function validateSecretsArray(secrets, logger$2) {
	if (secrets.length === 0) throw new BetterAuthError("`secrets` array must contain at least one entry.");
	const seen = /* @__PURE__ */ new Set();
	for (const s of secrets) {
		const version$1 = parseInt(String(s.version), 10);
		if (!Number.isInteger(version$1) || version$1 < 0 || String(version$1) !== String(s.version).trim()) throw new BetterAuthError(`Invalid version ${s.version} in \`secrets\`. Version must be a non-negative integer.`);
		if (!s.value) throw new BetterAuthError(`Empty secret value for version ${version$1} in \`secrets\`.`);
		if (seen.has(version$1)) throw new BetterAuthError(`Duplicate version ${version$1} in \`secrets\`. Each version must be unique.`);
		seen.add(version$1);
	}
	const current = secrets[0];
	if (current.value.length < 32) logger$2.warn(`[better-auth] Warning: the current secret (version ${current.version}) should be at least 32 characters long for adequate security.`);
	if (estimateEntropy$1(current.value) < 120) logger$2.warn("[better-auth] Warning: the current secret appears low-entropy. Use a randomly generated secret for production.");
}
function buildSecretConfig(secrets, legacySecret) {
	const keys = /* @__PURE__ */ new Map();
	for (const s of secrets) keys.set(parseInt(String(s.version), 10), s.value);
	return {
		keys,
		currentVersion: parseInt(String(secrets[0].version), 10),
		legacySecret: legacySecret && legacySecret !== "better-auth-secret-12345678901234567890" ? legacySecret : void 0
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+telemetry@1.6.26_@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better_a6f3530d87df3256dd84c314ac52c4af/node_modules/@better-auth/telemetry/dist/node.mjs
async function getTelemetryAuthConfig(options, context) {
	return {
		database: context?.database,
		adapter: context?.adapter,
		emailVerification: {
			sendVerificationEmail: !!options.emailVerification?.sendVerificationEmail,
			sendOnSignUp: !!options.emailVerification?.sendOnSignUp,
			sendOnSignIn: !!options.emailVerification?.sendOnSignIn,
			autoSignInAfterVerification: !!options.emailVerification?.autoSignInAfterVerification,
			expiresIn: options.emailVerification?.expiresIn,
			beforeEmailVerification: !!options.emailVerification?.beforeEmailVerification,
			afterEmailVerification: !!options.emailVerification?.afterEmailVerification
		},
		emailAndPassword: {
			enabled: !!options.emailAndPassword?.enabled,
			disableSignUp: !!options.emailAndPassword?.disableSignUp,
			requireEmailVerification: !!options.emailAndPassword?.requireEmailVerification,
			maxPasswordLength: options.emailAndPassword?.maxPasswordLength,
			minPasswordLength: options.emailAndPassword?.minPasswordLength,
			sendResetPassword: !!options.emailAndPassword?.sendResetPassword,
			resetPasswordTokenExpiresIn: options.emailAndPassword?.resetPasswordTokenExpiresIn,
			onPasswordReset: !!options.emailAndPassword?.onPasswordReset,
			password: {
				hash: !!options.emailAndPassword?.password?.hash,
				verify: !!options.emailAndPassword?.password?.verify
			},
			autoSignIn: !!options.emailAndPassword?.autoSignIn,
			revokeSessionsOnPasswordReset: !!options.emailAndPassword?.revokeSessionsOnPasswordReset
		},
		socialProviders: await Promise.all(Object.keys(options.socialProviders || {}).map(async (key) => {
			const p = options.socialProviders?.[key];
			if (!p) return {};
			const provider = typeof p === "function" ? await p() : p;
			return {
				id: key,
				mapProfileToUser: !!provider.mapProfileToUser,
				disableDefaultScope: !!provider.disableDefaultScope,
				disableIdTokenSignIn: !!provider.disableIdTokenSignIn,
				disableImplicitSignUp: provider.disableImplicitSignUp,
				disableSignUp: provider.disableSignUp,
				getUserInfo: !!provider.getUserInfo,
				overrideUserInfoOnSignIn: !!provider.overrideUserInfoOnSignIn,
				prompt: provider.prompt,
				verifyIdToken: !!provider.verifyIdToken,
				scope: provider.scope,
				refreshAccessToken: !!provider.refreshAccessToken
			};
		})),
		plugins: options.plugins?.map((p) => p.id.toString()),
		user: {
			modelName: options.user?.modelName,
			fields: options.user?.fields,
			additionalFields: options.user?.additionalFields,
			changeEmail: {
				enabled: options.user?.changeEmail?.enabled,
				sendChangeEmailConfirmation: !!options.user?.changeEmail?.sendChangeEmailConfirmation
			}
		},
		verification: {
			modelName: options.verification?.modelName,
			disableCleanup: options.verification?.disableCleanup,
			fields: options.verification?.fields
		},
		session: {
			modelName: options.session?.modelName,
			additionalFields: options.session?.additionalFields,
			cookieCache: {
				enabled: options.session?.cookieCache?.enabled,
				maxAge: options.session?.cookieCache?.maxAge,
				strategy: options.session?.cookieCache?.strategy
			},
			disableSessionRefresh: options.session?.disableSessionRefresh,
			expiresIn: options.session?.expiresIn,
			fields: options.session?.fields,
			freshAge: options.session?.freshAge,
			preserveSessionInDatabase: options.session?.preserveSessionInDatabase,
			storeSessionInDatabase: options.session?.storeSessionInDatabase,
			updateAge: options.session?.updateAge
		},
		account: {
			modelName: options.account?.modelName,
			fields: options.account?.fields,
			encryptOAuthTokens: options.account?.encryptOAuthTokens,
			updateAccountOnSignIn: options.account?.updateAccountOnSignIn,
			accountLinking: {
				enabled: options.account?.accountLinking?.enabled,
				trustedProviders: options.account?.accountLinking?.trustedProviders,
				updateUserInfoOnLink: options.account?.accountLinking?.updateUserInfoOnLink,
				allowUnlinkingAll: options.account?.accountLinking?.allowUnlinkingAll
			}
		},
		hooks: {
			after: !!options.hooks?.after,
			before: !!options.hooks?.before
		},
		secondaryStorage: !!options.secondaryStorage,
		advanced: {
			cookiePrefix: !!options.advanced?.cookiePrefix,
			cookies: !!options.advanced?.cookies,
			crossSubDomainCookies: {
				domain: !!options.advanced?.crossSubDomainCookies?.domain,
				enabled: options.advanced?.crossSubDomainCookies?.enabled,
				additionalCookies: options.advanced?.crossSubDomainCookies?.additionalCookies
			},
			database: {
				generateId: options.advanced?.database?.generateId,
				defaultFindManyLimit: options.advanced?.database?.defaultFindManyLimit
			},
			useSecureCookies: options.advanced?.useSecureCookies,
			ipAddress: {
				disableIpTracking: options.advanced?.ipAddress?.disableIpTracking,
				ipAddressHeaders: options.advanced?.ipAddress?.ipAddressHeaders
			},
			disableCSRFCheck: options.advanced?.disableCSRFCheck,
			cookieAttributes: {
				expires: options.advanced?.defaultCookieAttributes?.expires,
				secure: options.advanced?.defaultCookieAttributes?.secure,
				sameSite: options.advanced?.defaultCookieAttributes?.sameSite,
				domain: !!options.advanced?.defaultCookieAttributes?.domain,
				path: options.advanced?.defaultCookieAttributes?.path,
				httpOnly: options.advanced?.defaultCookieAttributes?.httpOnly
			}
		},
		trustedOrigins: options.trustedOrigins?.length,
		rateLimit: {
			storage: options.rateLimit?.storage,
			modelName: options.rateLimit?.modelName,
			window: options.rateLimit?.window,
			customStorage: !!options.rateLimit?.customStorage,
			enabled: options.rateLimit?.enabled,
			max: options.rateLimit?.max
		},
		onAPIError: {
			errorURL: options.onAPIError?.errorURL,
			onError: !!options.onAPIError?.onError,
			throw: options.onAPIError?.throw
		},
		logger: {
			disabled: options.logger?.disabled,
			level: options.logger?.level,
			log: !!options.logger?.log
		},
		databaseHooks: {
			user: {
				create: {
					after: !!options.databaseHooks?.user?.create?.after,
					before: !!options.databaseHooks?.user?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.user?.update?.after,
					before: !!options.databaseHooks?.user?.update?.before
				}
			},
			session: {
				create: {
					after: !!options.databaseHooks?.session?.create?.after,
					before: !!options.databaseHooks?.session?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.session?.update?.after,
					before: !!options.databaseHooks?.session?.update?.before
				}
			},
			account: {
				create: {
					after: !!options.databaseHooks?.account?.create?.after,
					before: !!options.databaseHooks?.account?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.account?.update?.after,
					before: !!options.databaseHooks?.account?.update?.before
				}
			},
			verification: {
				create: {
					after: !!options.databaseHooks?.verification?.create?.after,
					before: !!options.databaseHooks?.verification?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.verification?.update?.after,
					before: !!options.databaseHooks?.verification?.update?.before
				}
			}
		}
	};
}
function detectPackageManager() {
	const userAgent = env.npm_config_user_agent;
	if (!userAgent) return;
	const pmSpec = userAgent.split(" ")[0];
	const separatorPos = pmSpec.lastIndexOf("/");
	const name = pmSpec.substring(0, separatorPos);
	return {
		name: name === "npminstall" ? "cnpm" : name,
		version: pmSpec.substring(separatorPos + 1)
	};
}
function isCI() {
	return env.CI !== "false" && ("BUILD_ID" in env || "BUILD_NUMBER" in env || "CI" in env || "CI_APP_ID" in env || "CI_BUILD_ID" in env || "CI_BUILD_NUMBER" in env || "CI_NAME" in env || "CONTINUOUS_INTEGRATION" in env || "RUN_ID" in env);
}
function detectRuntime() {
	if (typeof Deno !== "undefined") return {
		name: "deno",
		version: Deno?.version?.deno ?? null
	};
	if (typeof Bun !== "undefined") return {
		name: "bun",
		version: Bun?.version ?? null
	};
	if (typeof process !== "undefined" && process?.versions?.node) return {
		name: "node",
		version: process.versions.node ?? null
	};
	return {
		name: "edge",
		version: null
	};
}
function detectEnvironment() {
	return getEnvVar("NODE_ENV") === "production" ? "production" : isCI() ? "ci" : isTest() ? "test" : "development";
}
async function hashToBase64(data) {
	const buffer = await createHash$1("SHA-256").digest(data);
	return base64$1.encode(buffer);
}
const generateId = (size) => {
	return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
};
let packageJSONCache;
async function readRootPackageJson() {
	if (packageJSONCache) return packageJSONCache;
	try {
		const cwd = process.cwd();
		if (!cwd) return void 0;
		const raw = await fs$1.readFile(path.join(cwd, "package.json"), "utf-8");
		packageJSONCache = JSON.parse(raw);
		return packageJSONCache;
	} catch {}
}
async function getPackageVersion(pkg) {
	if (packageJSONCache) return packageJSONCache.dependencies?.[pkg] || packageJSONCache.devDependencies?.[pkg] || packageJSONCache.peerDependencies?.[pkg];
	try {
		const cwd = process.cwd();
		if (!cwd) throw new Error("no-cwd");
		const pkgJsonPath = path.join(cwd, "node_modules", pkg, "package.json");
		const raw = await fs$1.readFile(pkgJsonPath, "utf-8");
		return JSON.parse(raw).version || await getVersionFromLocalPackageJson(pkg) || void 0;
	} catch {}
	return getVersionFromLocalPackageJson(pkg);
}
async function getVersionFromLocalPackageJson(pkg) {
	const json = await readRootPackageJson();
	if (!json) return void 0;
	return {
		...json.dependencies,
		...json.devDependencies,
		...json.peerDependencies
	}[pkg];
}
async function getNameFromLocalPackageJson() {
	return (await readRootPackageJson())?.name;
}
async function detectSystemInfo() {
	try {
		const cpus = os.cpus();
		return {
			deploymentVendor: getVendor(),
			systemPlatform: os.platform(),
			systemRelease: os.release(),
			systemArchitecture: os.arch(),
			cpuCount: cpus.length,
			cpuModel: cpus.length ? cpus[0].model : null,
			cpuSpeed: cpus.length ? cpus[0].speed : null,
			memory: os.totalmem(),
			isWSL: await isWsl(),
			isDocker: await isDocker(),
			isTTY: process.stdout ? process.stdout.isTTY : null
		};
	} catch {
		return {
			systemPlatform: null,
			systemRelease: null,
			systemArchitecture: null,
			cpuCount: null,
			cpuModel: null,
			cpuSpeed: null,
			memory: null,
			isWSL: null,
			isDocker: null,
			isTTY: null
		};
	}
}
function getVendor() {
	const env$1 = process.env;
	const hasAny = (...keys) => keys.some((k) => Boolean(env$1[k]));
	if (hasAny("CF_PAGES", "CF_PAGES_URL", "CF_ACCOUNT_ID") || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") return "cloudflare";
	if (hasAny("VERCEL", "VERCEL_URL", "VERCEL_ENV")) return "vercel";
	if (hasAny("NETLIFY", "NETLIFY_URL")) return "netlify";
	if (hasAny("RENDER", "RENDER_URL", "RENDER_INTERNAL_HOSTNAME", "RENDER_SERVICE_ID")) return "render";
	if (hasAny("AWS_LAMBDA_FUNCTION_NAME", "AWS_EXECUTION_ENV", "LAMBDA_TASK_ROOT")) return "aws";
	if (hasAny("GOOGLE_CLOUD_FUNCTION_NAME", "GOOGLE_CLOUD_PROJECT", "GCP_PROJECT", "K_SERVICE")) return "gcp";
	if (hasAny("AZURE_FUNCTION_NAME", "FUNCTIONS_WORKER_RUNTIME", "WEBSITE_INSTANCE_ID", "WEBSITE_SITE_NAME")) return "azure";
	if (hasAny("DENO_DEPLOYMENT_ID", "DENO_REGION")) return "deno-deploy";
	if (hasAny("FLY_APP_NAME", "FLY_REGION", "FLY_ALLOC_ID")) return "fly-io";
	if (hasAny("RAILWAY_STATIC_URL", "RAILWAY_ENVIRONMENT_NAME")) return "railway";
	if (hasAny("DYNO", "HEROKU_APP_NAME")) return "heroku";
	if (hasAny("DO_DEPLOYMENT_ID", "DO_APP_NAME", "DIGITALOCEAN")) return "digitalocean";
	if (hasAny("KOYEB", "KOYEB_DEPLOYMENT_ID", "KOYEB_APP_NAME")) return "koyeb";
	return null;
}
let isDockerCached;
async function hasDockerEnv() {
	try {
		fs.statSync("/.dockerenv");
		return true;
	} catch {
		return false;
	}
}
async function hasDockerCGroup() {
	try {
		return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
	} catch {
		return false;
	}
}
async function isDocker() {
	if (isDockerCached === void 0) isDockerCached = await hasDockerEnv() || await hasDockerCGroup();
	return isDockerCached;
}
let isInsideContainerCached;
const hasContainerEnv = async () => {
	try {
		fs.statSync("/run/.containerenv");
		return true;
	} catch {
		return false;
	}
};
async function isInsideContainer() {
	if (isInsideContainerCached === void 0) isInsideContainerCached = await hasContainerEnv() || await isDocker();
	return isInsideContainerCached;
}
async function isWsl() {
	try {
		if (process.platform !== "linux") return false;
		if (os.release().toLowerCase().includes("microsoft")) {
			if (await isInsideContainer()) return false;
			return true;
		}
		return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !await isInsideContainer() : false;
	} catch {
		return false;
	}
}
let projectIdCached = null;
async function getProjectId(baseUrl) {
	if (projectIdCached) return projectIdCached;
	const projectName = await getNameFromLocalPackageJson();
	if (projectName) {
		projectIdCached = await hashToBase64(baseUrl ? baseUrl + projectName : projectName);
		return projectIdCached;
	}
	if (baseUrl) {
		projectIdCached = await hashToBase64(baseUrl);
		return projectIdCached;
	}
	projectIdCached = generateId(32);
	return projectIdCached;
}
async function detectDatabaseNode() {
	for (const [pkg, name] of Object.entries({
		pg: "postgresql",
		mysql: "mysql",
		mariadb: "mariadb",
		sqlite3: "sqlite",
		"better-sqlite3": "sqlite",
		"@prisma/client": "prisma",
		mongoose: "mongodb",
		mongodb: "mongodb",
		"drizzle-orm": "drizzle"
	})) {
		const version$1 = await getPackageVersion(pkg);
		if (version$1) return {
			name,
			version: version$1
		};
	}
}
async function detectFrameworkNode() {
	for (const [pkg, name] of Object.entries({
		next: "next",
		nuxt: "nuxt",
		"react-router": "react-router",
		astro: "astro",
		"@sveltejs/kit": "sveltekit",
		"solid-start": "solid-start",
		"tanstack-start": "tanstack-start",
		hono: "hono",
		express: "express",
		elysia: "elysia",
		expo: "expo"
	})) {
		const version$1 = await getPackageVersion(pkg);
		if (version$1) return {
			name,
			version: version$1
		};
	}
}
const noop$1 = async function noop$2() {};
async function createTelemetry(options, context) {
	const debugEnabled = options.telemetry?.debug || getBooleanEnvVar("BETTER_AUTH_TELEMETRY_DEBUG", false);
	const telemetryEndpoint = ENV.BETTER_AUTH_TELEMETRY_ENDPOINT;
	if (!telemetryEndpoint && !context?.customTrack) return { publish: noop$1 };
	const track = async (event) => {
		if (context?.customTrack) await context.customTrack(event).catch(logger$1.error);
		else if (telemetryEndpoint) if (debugEnabled) logger$1.info("telemetry event", JSON.stringify(event, null, 2));
		else await betterFetch(telemetryEndpoint, {
			method: "POST",
			body: event
		}).catch(logger$1.error);
	};
	const isEnabled = async () => {
		const telemetryEnabled = options.telemetry?.enabled !== void 0 ? options.telemetry.enabled : false;
		return (getBooleanEnvVar("BETTER_AUTH_TELEMETRY", false) || telemetryEnabled) && (context?.skipTestCheck || !isTest());
	};
	const enabled = await isEnabled();
	let anonymousId;
	if (enabled) {
		anonymousId = await getProjectId(typeof options.baseURL === "string" ? options.baseURL : void 0);
		track({
			type: "init",
			payload: {
				config: await getTelemetryAuthConfig(options, context),
				runtime: detectRuntime(),
				database: await detectDatabaseNode(),
				framework: await detectFrameworkNode(),
				environment: detectEnvironment(),
				systemInfo: await detectSystemInfo(),
				packageManager: detectPackageManager()
			},
			anonymousId
		});
	}
	return { publish: async (event) => {
		if (!enabled) return;
		if (!anonymousId) anonymousId = await getProjectId(typeof options.baseURL === "string" ? options.baseURL : void 0);
		await track({
			type: event.type,
			payload: event.payload,
			anonymousId
		});
	} };
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/context/create-context.mjs
/**
* Estimates the entropy of a string in bits.
* This is a simple approximation that helps detect low-entropy secrets.
*/
function estimateEntropy(str) {
	const unique = new Set(str).size;
	if (unique === 0) return 0;
	return Math.log2(Math.pow(unique, str.length));
}
/**
* Validates that the secret meets minimum security requirements.
* Throws BetterAuthError if the secret is invalid.
* Skips validation for DEFAULT_SECRET in test environments only.
* Only throws for DEFAULT_SECRET in production environment.
*/
function validateSecret(secret, logger$2) {
	const isDefaultSecret = secret === DEFAULT_SECRET;
	if (isTest()) return;
	if (isDefaultSecret && isProduction) throw new BetterAuthError("You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.");
	if (!secret) throw new BetterAuthError("BETTER_AUTH_SECRET is missing. Set it in your environment or pass `secret` to betterAuth({ secret }).");
	if (secret.length < 32) logger$2.warn(`[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with \`npx auth secret\` or \`openssl rand -base64 32\`.`);
	if (estimateEntropy(secret) < 120) logger$2.warn("[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.");
}
async function createAuthContext(adapter, options, getDatabaseType) {
	const isStateful = hasServerSessionStore(options);
	if (!isStateful) options = defu(options, { session: { cookieCache: {
		enabled: true,
		strategy: "jwe",
		refreshCache: true,
		maxAge: options.session?.expiresIn || 3600 * 24 * 7
	} } });
	if (!options.database) options = defu(options, { account: { storeAccountCookie: true } });
	const plugins = options.plugins || [];
	const internalPlugins = getInternalPlugins(options);
	const logger$2 = createLogger(options.logger);
	const isDynamicConfig = isDynamicBaseURLConfig(options.baseURL);
	if (isDynamicBaseURLConfig(options.baseURL)) {
		const { allowedHosts } = options.baseURL;
		if (!allowedHosts || allowedHosts.length === 0) throw new BetterAuthError("baseURL.allowedHosts cannot be empty. Provide at least one allowed host pattern (e.g., [\"myapp.com\", \"*.vercel.app\"]).");
	}
	const baseURL = isDynamicConfig ? void 0 : getBaseURL(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath);
	if (!baseURL && !isDynamicConfig) logger$2.warn(`[better-auth] Base URL is not set. Set the baseURL option or BETTER_AUTH_URL env, or use a dynamic baseURL with allowedHosts for multi-host setups. Without it the origin is derived from the incoming request, and callbacks and redirects may not work correctly.`);
	if (adapter.id === "memory" && options.advanced?.database?.generateId === false) logger$2.error(`[better-auth] Misconfiguration detected.
You are using the memory DB with generateId: false.
This will cause no id to be generated for any model.
Most of the features of Better Auth will not work correctly.`);
	const secretsArray = options.secrets ?? parseSecretsEnv(env.BETTER_AUTH_SECRETS);
	const legacySecret = options.secret || env.BETTER_AUTH_SECRET || env.AUTH_SECRET || "";
	let secret;
	let secretConfig;
	if (secretsArray) {
		validateSecretsArray(secretsArray, logger$2);
		secret = secretsArray[0].value;
		secretConfig = buildSecretConfig(secretsArray, legacySecret);
	} else {
		secret = legacySecret || "better-auth-secret-12345678901234567890";
		validateSecret(secret, logger$2);
		secretConfig = secret;
	}
	options = {
		...options,
		secret,
		baseURL: isDynamicConfig ? options.baseURL : baseURL ? new URL(baseURL).origin : "",
		basePath: options.basePath || "/api/auth",
		plugins: plugins.concat(internalPlugins)
	};
	checkEndpointConflicts(options, logger$2);
	const trustedProxies = options.advanced?.ipAddress?.trustedProxies;
	if (trustedProxies && trustedProxies.length > 0) {
		const invalid = findInvalidTrustedProxies(trustedProxies);
		if (invalid.length > 0) logger$2.warn(`Ignoring invalid \`advanced.ipAddress.trustedProxies\` entries: ${invalid.join(", ")}. Each entry must be an IP address or CIDR range.`);
	}
	const cookies = getCookies(options);
	const tables = getAuthTables(options);
	const providers = (await Promise.all(Object.entries(options.socialProviders || {}).map(async ([key, originalConfig]) => {
		const config = typeof originalConfig === "function" ? await originalConfig() : originalConfig;
		if (config == null) return null;
		if (config.enabled === false) return null;
		if (!config.clientId) logger$2.warn(`Social provider ${key} is missing clientId or clientSecret`);
		const provider = socialProviders[key](config);
		provider.disableImplicitSignUp = config.disableImplicitSignUp;
		return provider;
	}))).filter((x) => x !== null);
	const generateIdFunc = ({ model, size }) => {
		if (typeof options.advanced?.generateId === "function") return options.advanced.generateId({
			model,
			size
		});
		const dbGenerateId = options?.advanced?.database?.generateId;
		if (typeof dbGenerateId === "function") return dbGenerateId({
			model,
			size
		});
		if (dbGenerateId === "uuid") return crypto.randomUUID();
		if (dbGenerateId === "serial" || dbGenerateId === false) return false;
		return generateId$1(size);
	};
	const { publish } = await createTelemetry(options, {
		adapter: adapter.id,
		database: typeof options.database === "function" ? "adapter" : getDatabaseType(options.database)
	});
	const pluginIds = new Set(options.plugins.map((p) => p.id));
	const getPluginFn = (id) => options.plugins.find((p) => p.id === id) ?? null;
	const hasPluginFn = (id) => pluginIds.has(id);
	const trustedOrigins = await getTrustedOrigins(options);
	const trustedProviders = await getTrustedProviders(options);
	const ctx = {
		appName: options.appName || "Better Auth",
		baseURL: baseURL || "",
		version: getBetterAuthVersion(),
		socialProviders: providers,
		options,
		oauthConfig: {
			storeStateStrategy: options.account?.storeStateStrategy || (isStateful ? "database" : "cookie"),
			skipStateCookieCheck: !!options.account?.skipStateCookieCheck
		},
		tables,
		trustedOrigins,
		trustedProviders,
		isTrustedOrigin(url, settings) {
			return this.trustedOrigins.some((origin) => matchesOriginPattern(url, origin, settings));
		},
		sessionConfig: {
			updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 1440 * 60,
			expiresIn: options.session?.expiresIn || 3600 * 24 * 7,
			freshAge: options.session?.freshAge === void 0 ? 3600 * 24 : options.session.freshAge,
			cookieRefreshCache: (() => {
				const refreshCache = options.session?.cookieCache?.refreshCache;
				const maxAge = options.session?.cookieCache?.maxAge || 300;
				if (isStateful && refreshCache) {
					logger$2.warn("[better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.");
					return false;
				}
				if (refreshCache === false || refreshCache === void 0) return false;
				if (refreshCache === true) return {
					enabled: true,
					updateAge: Math.floor(maxAge * .2)
				};
				return {
					enabled: true,
					updateAge: refreshCache.updateAge !== void 0 ? refreshCache.updateAge : Math.floor(maxAge * .2)
				};
			})()
		},
		secret,
		secretConfig,
		rateLimit: {
			...options.rateLimit,
			enabled: options.rateLimit?.enabled ?? isProduction,
			window: options.rateLimit?.window || 10,
			max: options.rateLimit?.max || 100,
			storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
		},
		authCookies: cookies,
		logger: logger$2,
		generateId: generateIdFunc,
		session: null,
		secondaryStorage: options.secondaryStorage,
		password: {
			hash: options.emailAndPassword?.password?.hash || hashPassword$1,
			verify: options.emailAndPassword?.password?.verify || verifyPassword$1,
			config: {
				minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
				maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
			},
			checkPassword
		},
		setNewSession(session) {
			this.newSession = session;
		},
		newSession: null,
		adapter,
		internalAdapter: createInternalAdapter(adapter, {
			options,
			logger: logger$2,
			hooks: options.databaseHooks ? [{
				source: "user",
				hooks: options.databaseHooks
			}] : [],
			generateId: generateIdFunc
		}),
		createAuthCookie: createCookieGetter(options),
		async runMigrations() {
			throw new BetterAuthError("runMigrations will be set by the specific init implementation");
		},
		publishTelemetry: publish,
		skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
		skipOriginCheck: options.advanced?.disableOriginCheck !== void 0 ? options.advanced.disableOriginCheck : isTest() ? true : false,
		runInBackground: options.advanced?.backgroundTasks?.handler ?? ((p) => {
			p.catch(() => {});
		}),
		async runInBackgroundOrAwait(promise) {
			try {
				if (options.advanced?.backgroundTasks?.handler) {
					if (promise instanceof Promise) options.advanced.backgroundTasks.handler(promise.catch((e) => {
						logger$2.error("Failed to run background task:", e);
					}));
				} else await promise;
			} catch (e) {
				logger$2.error("Failed to run background task:", e);
			}
		},
		getPlugin: getPluginFn,
		hasPlugin: hasPluginFn
	};
	const initOrPromise = runPluginInit(ctx);
	if (isPromise(initOrPromise)) await initOrPromise;
	return ctx;
}

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/context/init.mjs
const init = async (options) => {
	const adapter = await getAdapter(options);
	const getDatabaseType = (database) => getKyselyDatabaseType(database) || "unknown";
	const ctx = await createAuthContext(adapter, options, getDatabaseType);
	ctx.runMigrations = async function() {
		if (!options.database || "updateMany" in options.database) throw new BetterAuthError("Database is not provided or it's an adapter. Migrations are only supported with a database instance.");
		const { runMigrations } = await getMigrations(options);
		await runMigrations();
	};
	return ctx;
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/auth/base.mjs
const createBetterAuth = (options, initFn) => {
	const authContext = initFn(options);
	const { api } = getEndpoints(authContext, options);
	return {
		handler: async (request) => {
			const ctx = await authContext;
			const basePath = ctx.options.basePath || "/api/auth";
			let handlerCtx;
			if (isDynamicBaseURLConfig(options.baseURL)) handlerCtx = await resolveRequestContext(ctx, request, resolveDynamicTrustedProxyHeaders(ctx.options));
			else {
				handlerCtx = Object.create(Object.getPrototypeOf(ctx), Object.getOwnPropertyDescriptors(ctx));
				let trustOptions = ctx.options;
				if (!ctx.options.baseURL) {
					const baseURL = getBaseURL(void 0, basePath, request, void 0, ctx.options.advanced?.trustedProxyHeaders);
					if (!baseURL) throw new BetterAuthError("Could not get base URL from request. Please provide a valid base URL.");
					handlerCtx.baseURL = baseURL;
					handlerCtx.options = {
						...ctx.options,
						baseURL: getOrigin(baseURL) || void 0
					};
					trustOptions = handlerCtx.options;
				}
				handlerCtx.trustedOrigins = await getTrustedOrigins(trustOptions, request);
				handlerCtx.trustedProviders = await getTrustedProviders(trustOptions, request);
			}
			const { handler } = router(handlerCtx, options);
			return runWithAdapter(handlerCtx.adapter, () => handler(request));
		},
		api,
		options,
		$context: authContext,
		$ERROR_CODES: {
			...options.plugins?.reduce((acc, plugin) => {
				if (plugin.$ERROR_CODES) return {
					...acc,
					...plugin.$ERROR_CODES
				};
				return acc;
			}, {}),
			...BASE_ERROR_CODES
		}
	};
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/auth/full.mjs
/**
* Better Auth initializer for full mode (with Kysely)
*
* @example
* ```ts
* import { betterAuth } from "better-auth";
*
* const auth = betterAuth({
* 	database: new PostgresDialect({ connection: process.env.DATABASE_URL }),
* });
* ```
*
* For minimal mode (without Kysely), import from `better-auth/minimal` instead
* @example
* ```ts
* import { betterAuth } from "better-auth/minimal";
*
* const auth = betterAuth({
*	  database: drizzleAdapter(db, { provider: "pg" }),
* });
*/
const betterAuth = (options) => {
	return createBetterAuth(options, init);
};

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_5c24aad5c2286b070a33445d4913218a/node_modules/@better-auth/core/dist/utils/async.mjs
/**
* Run an async mapper over items with bounded concurrency.
* Preserves input order in the result. Fails fast on the first rejection.
*/
async function mapConcurrent(items, fn, options) {
	const n = items.length;
	if (n === 0) return [];
	const { signal } = options;
	if (signal?.aborted) throw signal.reason;
	const raw = Math.floor(options.concurrency);
	const width = Math.min(n, raw >= 1 ? raw : 1);
	const results = new Array(n);
	let idx = 0;
	let failed = false;
	const worker = async () => {
		while (!failed && idx < n) {
			if (signal?.aborted) throw signal.reason;
			const i = idx++;
			try {
				results[i] = await fn(items[i], i);
			} catch (error) {
				failed = true;
				throw error;
			}
		}
	};
	await Promise.all(Array.from({ length: width }, worker));
	return results;
}

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+api-key@1.6.26_@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@better-f_357d091d724ef3028b044205d47069ba/node_modules/@better-auth/api-key/dist/index.mjs
const STORAGE_CONCURRENCY = 10;
/**
* Parses double-stringified metadata synchronously without updating the database.
* Use this for reading metadata, then call migrateLegacyMetadataInBackground for DB updates.
*
* @returns The properly parsed metadata object, or the original if already an object
*/
function parseDoubleStringifiedMetadata(metadata$1) {
	if (metadata$1 == null) return null;
	if (typeof metadata$1 === "object") return metadata$1;
	return safeJSONParse(metadata$1);
}
/**
* Checks if metadata needs migration (is a string instead of object)
*/
function needsMetadataMigration(metadata$1) {
	return metadata$1 != null && typeof metadata$1 === "string";
}
/**
* Batch migrates double-stringified metadata for multiple API keys.
* Runs all updates in parallel to avoid N sequential database calls.
*/
async function batchMigrateLegacyMetadata(ctx, apiKeys, opts) {
	if (opts.storage !== "database" && !opts.fallbackToDatabase) return;
	const keysToMigrate = apiKeys.filter((key) => needsMetadataMigration(key.metadata));
	if (keysToMigrate.length === 0) return;
	const migrationPromises = keysToMigrate.map(async (apiKey$1) => {
		const parsed = parseDoubleStringifiedMetadata(apiKey$1.metadata);
		try {
			await ctx.context.adapter.update({
				model: "apikey",
				where: [{
					field: "id",
					value: apiKey$1.id
				}],
				update: { metadata: parsed }
			});
		} catch (error) {
			ctx.context.logger.warn(`Failed to migrate double-stringified metadata for API key ${apiKey$1.id}:`, error);
		}
	});
	await Promise.all(migrationPromises);
}
/**
* Migrates double-stringified metadata to properly parsed object.
*
* This handles legacy data where metadata was incorrectly double-stringified.
* If metadata is a string (should be object after adapter's transform.output),
* it parses it and optionally updates the database.
*
* @returns The properly parsed metadata object
*/
async function migrateDoubleStringifiedMetadata(ctx, apiKey$1, opts) {
	const parsed = parseDoubleStringifiedMetadata(apiKey$1.metadata);
	if (needsMetadataMigration(apiKey$1.metadata) && (opts.storage === "database" || opts.fallbackToDatabase)) try {
		await ctx.context.adapter.update({
			model: "apikey",
			where: [{
				field: "id",
				value: apiKey$1.id
			}],
			update: { metadata: parsed }
		});
	} catch (error) {
		ctx.context.logger.warn(`Failed to migrate double-stringified metadata for API key ${apiKey$1.id}:`, error);
	}
	return parsed;
}
/**
* Generate storage key for API key by hashed key
*/
function getStorageKeyByHashedKey(hashedKey) {
	return `api-key:${hashedKey}`;
}
/**
* Generate storage key for API key by ID
*/
function getStorageKeyById(id) {
	return `api-key:by-id:${id}`;
}
/**
* Generate storage key for reference's API key list (user or org)
*/
function getStorageKeyByReferenceId(referenceId) {
	return `api-key:by-ref:${referenceId}`;
}
/**
* Serialize API key for storage
*/
function serializeApiKey(apiKey$1) {
	return JSON.stringify({
		...apiKey$1,
		createdAt: apiKey$1.createdAt.toISOString(),
		updatedAt: apiKey$1.updatedAt.toISOString(),
		expiresAt: apiKey$1.expiresAt?.toISOString() ?? null,
		lastRefillAt: apiKey$1.lastRefillAt?.toISOString() ?? null,
		lastRequest: apiKey$1.lastRequest?.toISOString() ?? null
	});
}
/**
* Deserialize API key from storage
*/
function deserializeApiKey(data) {
	if (!data || typeof data !== "string") return null;
	try {
		const parsed = JSON.parse(data);
		return {
			...parsed,
			createdAt: new Date(parsed.createdAt),
			updatedAt: new Date(parsed.updatedAt),
			expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
			lastRefillAt: parsed.lastRefillAt ? new Date(parsed.lastRefillAt) : null,
			lastRequest: parsed.lastRequest ? new Date(parsed.lastRequest) : null
		};
	} catch {
		return null;
	}
}
/**
* Get the storage instance to use (custom methods take precedence)
*/
function getStorageInstance(ctx, opts) {
	if (opts.customStorage) return opts.customStorage;
	return ctx.context.secondaryStorage || null;
}
/**
* Calculate TTL in seconds for an API key
*/
function calculateTTL(apiKey$1) {
	if (apiKey$1.expiresAt) {
		const now = Date.now();
		const expiresAt = new Date(apiKey$1.expiresAt).getTime();
		const ttlSeconds = Math.floor((expiresAt - now) / 1e3);
		if (ttlSeconds > 0) return ttlSeconds;
	}
}
/**
* Get API key from secondary storage by hashed key
*/
async function getApiKeyFromStorage(ctx, hashedKey, storage) {
	const key = getStorageKeyByHashedKey(hashedKey);
	return deserializeApiKey(await storage.get(key));
}
/**
* Get API key from secondary storage by ID
*/
async function getApiKeyByIdFromStorage(ctx, id, storage) {
	const key = getStorageKeyById(id);
	return deserializeApiKey(await storage.get(key));
}
/**
* Serializes reference-list mutations per `refKey` within a single process.
* Each new mutation chains onto the previous one for the same key, so the
* read/modify/write below never interleaves with another mutation of the same
* list. This closes the lost-update race in secondary-storage-only mode, where
* the serialized list is the source of truth for listing.
*
* Limitation: the lock is in-process only. Across multiple server instances
* sharing one secondary storage, concurrent writers can still lose updates.
* Secondary storage with `fallbackToDatabase` avoids this by treating the list
* as an invalidate-only cache with the database as the source of truth.
* FIXME(api-key-reflist-durable): on `next`, drop the source-of-truth reference
* list entirely and make the database authoritative for listing, removing this
* in-process lock.
*/
const refListLocks = /* @__PURE__ */ new Map();
function withRefListLock(refKey, task) {
	const run = (refListLocks.get(refKey) ?? Promise.resolve()).then(task, task);
	const tracked = run.finally(() => {
		if (refListLocks.get(refKey) === tracked) refListLocks.delete(refKey);
	});
	refListLocks.set(refKey, tracked);
	return run;
}
/**
* Read-modify-write the ref list:
* used only when the list is the source of truth.
*/
async function modifyRefList(storage, refKey, modify) {
	await withRefListLock(refKey, async () => {
		const refListData = await storage.get(refKey);
		let keyIds = [];
		if (refListData && typeof refListData === "string") try {
			keyIds = JSON.parse(refListData);
		} catch {
			keyIds = [];
		}
		else if (Array.isArray(refListData)) keyIds = refListData;
		const next = modify(keyIds);
		if (next.length === 0) await storage.delete(refKey);
		else await storage.set(refKey, JSON.stringify(next));
	});
}
async function setApiKeyInStorage(_ctx, apiKey$1, storage, ttl, opts) {
	const serialized = serializeApiKey(apiKey$1);
	const refKey = getStorageKeyByReferenceId(apiKey$1.referenceId);
	if (opts.fallbackToDatabase) {
		await Promise.all([
			storage.set(getStorageKeyByHashedKey(apiKey$1.key), serialized, ttl),
			storage.set(getStorageKeyById(apiKey$1.id), serialized, ttl),
			storage.delete(refKey)
		]);
		return;
	}
	await Promise.all([storage.set(getStorageKeyByHashedKey(apiKey$1.key), serialized, ttl), storage.set(getStorageKeyById(apiKey$1.id), serialized, ttl)]);
	await modifyRefList(storage, refKey, (ids) => ids.includes(apiKey$1.id) ? ids : [...ids, apiKey$1.id]);
}
/**
* Delete API key from secondary storage
*/
async function deleteApiKeyFromStorage(ctx, apiKey$1, storage, opts) {
	const refKey = getStorageKeyByReferenceId(apiKey$1.referenceId);
	if (opts.fallbackToDatabase) {
		await Promise.all([
			storage.delete(getStorageKeyByHashedKey(apiKey$1.key)),
			storage.delete(getStorageKeyById(apiKey$1.id)),
			storage.delete(refKey)
		]);
		return;
	}
	await Promise.all([
		storage.delete(getStorageKeyByHashedKey(apiKey$1.key)),
		storage.delete(getStorageKeyById(apiKey$1.id)),
		modifyRefList(storage, refKey, (ids) => ids.filter((keyId) => keyId !== apiKey$1.id))
	]);
}
/**
* Unified getter for API keys with support for all storage modes
*/
async function getApiKey$1(ctx, hashedKey, opts) {
	const storage = getStorageInstance(ctx, opts);
	if (opts.storage === "database") return await ctx.context.adapter.findOne({
		model: "apikey",
		where: [{
			field: "key",
			value: hashedKey
		}]
	});
	if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
		if (storage) {
			const cached = await getApiKeyFromStorage(ctx, hashedKey, storage);
			if (cached) return cached;
		}
		const dbKey = await ctx.context.adapter.findOne({
			model: "apikey",
			where: [{
				field: "key",
				value: hashedKey
			}]
		});
		if (dbKey && storage) await setApiKeyInStorage(ctx, dbKey, storage, calculateTTL(dbKey), opts);
		return dbKey;
	}
	if (opts.storage === "secondary-storage") {
		if (!storage) return null;
		return await getApiKeyFromStorage(ctx, hashedKey, storage);
	}
	return await ctx.context.adapter.findOne({
		model: "apikey",
		where: [{
			field: "key",
			value: hashedKey
		}]
	});
}
/**
* Unified getter for API keys by ID
*/
async function getApiKeyById(ctx, id, opts) {
	const storage = getStorageInstance(ctx, opts);
	if (opts.storage === "database") return await ctx.context.adapter.findOne({
		model: "apikey",
		where: [{
			field: "id",
			value: id
		}]
	});
	if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
		if (storage) {
			const cached = await getApiKeyByIdFromStorage(ctx, id, storage);
			if (cached) return cached;
		}
		const dbKey = await ctx.context.adapter.findOne({
			model: "apikey",
			where: [{
				field: "id",
				value: id
			}]
		});
		if (dbKey && storage) await setApiKeyInStorage(ctx, dbKey, storage, calculateTTL(dbKey), opts);
		return dbKey;
	}
	if (opts.storage === "secondary-storage") {
		if (!storage) return null;
		return await getApiKeyByIdFromStorage(ctx, id, storage);
	}
	return await ctx.context.adapter.findOne({
		model: "apikey",
		where: [{
			field: "id",
			value: id
		}]
	});
}
/**
* Unified setter for API keys with support for all storage modes
*/
async function setApiKey(ctx, apiKey$1, opts) {
	const storage = getStorageInstance(ctx, opts);
	const ttl = calculateTTL(apiKey$1);
	if (opts.storage === "database") return;
	if (opts.storage === "secondary-storage") {
		if (!storage) throw new Error("Secondary storage is required when storage mode is 'secondary-storage'");
		await setApiKeyInStorage(ctx, apiKey$1, storage, ttl, opts);
		return;
	}
}
/**
* Unified deleter for API keys with support for all storage modes
*/
async function deleteApiKey$1(ctx, apiKey$1, opts) {
	const storage = getStorageInstance(ctx, opts);
	if (opts.storage === "database") return;
	if (opts.storage === "secondary-storage") {
		if (!storage) throw new Error("Secondary storage is required when storage mode is 'secondary-storage'");
		await deleteApiKeyFromStorage(ctx, apiKey$1, storage, opts);
		return;
	}
}
/**
* Apply sorting and pagination to an array of API keys in memory
* Used for secondary storage mode where we can't rely on database operations
*/
function applySortingAndPagination(apiKeys, sortBy, sortDirection, limit, offset) {
	let result = [...apiKeys];
	if (sortBy) {
		const direction = sortDirection || "asc";
		result.sort((a, b) => {
			const aValue = a[sortBy];
			const bValue = b[sortBy];
			if (aValue == null && bValue == null) return 0;
			if (aValue == null) return direction === "asc" ? -1 : 1;
			if (bValue == null) return direction === "asc" ? 1 : -1;
			if (aValue < bValue) return direction === "asc" ? -1 : 1;
			if (aValue > bValue) return direction === "asc" ? 1 : -1;
			return 0;
		});
	}
	if (offset !== void 0) result = result.slice(offset);
	if (limit !== void 0) result = result.slice(0, limit);
	return result;
}
/**
* List API keys for a reference (user or org) with support for all storage modes
*/
async function listApiKeys$1(ctx, referenceId, opts, paginationOpts) {
	const storage = getStorageInstance(ctx, opts);
	const { limit, offset, sortBy, sortDirection } = paginationOpts || {};
	if (opts.storage === "database") {
		const [apiKeys$1, total$1] = await Promise.all([ctx.context.adapter.findMany({
			model: "apikey",
			where: [{
				field: "referenceId",
				value: referenceId
			}],
			limit,
			offset,
			sortBy: sortBy ? {
				field: sortBy,
				direction: sortDirection || "asc"
			} : void 0
		}), ctx.context.adapter.count({
			model: "apikey",
			where: [{
				field: "referenceId",
				value: referenceId
			}]
		})]);
		return {
			apiKeys: apiKeys$1,
			total: total$1
		};
	}
	if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
		const refKey = getStorageKeyByReferenceId(referenceId);
		if (storage) {
			const refListData = await storage.get(refKey);
			let keyIds = [];
			if (refListData && typeof refListData === "string") try {
				keyIds = JSON.parse(refListData);
			} catch {
				keyIds = [];
			}
			else if (Array.isArray(refListData)) keyIds = refListData;
			if (keyIds.length > 0) {
				const apiKeys$1 = (await mapConcurrent(keyIds, (id) => getApiKeyByIdFromStorage(ctx, id, storage), { concurrency: STORAGE_CONCURRENCY })).filter((key) => key !== null && key !== void 0);
				return {
					apiKeys: applySortingAndPagination(apiKeys$1, sortBy, sortDirection, limit, offset),
					total: apiKeys$1.length
				};
			}
		}
		const [dbKeys, total$1] = await Promise.all([ctx.context.adapter.findMany({
			model: "apikey",
			where: [{
				field: "referenceId",
				value: referenceId
			}],
			limit,
			offset,
			sortBy: sortBy ? {
				field: sortBy,
				direction: sortDirection || "asc"
			} : void 0
		}), ctx.context.adapter.count({
			model: "apikey",
			where: [{
				field: "referenceId",
				value: referenceId
			}]
		})]);
		if (storage && dbKeys.length > 0) {
			await mapConcurrent(dbKeys, (apiKey$1) => setApiKeyInStorage(ctx, apiKey$1, storage, calculateTTL(apiKey$1), opts), { concurrency: STORAGE_CONCURRENCY });
			const keyIds = dbKeys.map((apiKey$1) => apiKey$1.id);
			await storage.set(refKey, JSON.stringify(keyIds));
		}
		return {
			apiKeys: dbKeys,
			total: total$1
		};
	}
	if (opts.storage === "secondary-storage") {
		if (!storage) return {
			apiKeys: [],
			total: 0
		};
		const refKey = getStorageKeyByReferenceId(referenceId);
		const refListData = await storage.get(refKey);
		let keyIds = [];
		if (refListData && typeof refListData === "string") try {
			keyIds = JSON.parse(refListData);
		} catch {
			return {
				apiKeys: [],
				total: 0
			};
		}
		else if (Array.isArray(refListData)) keyIds = refListData;
		else return {
			apiKeys: [],
			total: 0
		};
		const apiKeys$1 = (await mapConcurrent(keyIds, (id) => getApiKeyByIdFromStorage(ctx, id, storage), { concurrency: STORAGE_CONCURRENCY })).filter((key) => key !== null && key !== void 0);
		return {
			apiKeys: applySortingAndPagination(apiKeys$1, sortBy, sortDirection, limit, offset),
			total: apiKeys$1.length
		};
	}
	const [apiKeys, total] = await Promise.all([ctx.context.adapter.findMany({
		model: "apikey",
		where: [{
			field: "referenceId",
			value: referenceId
		}],
		limit,
		offset,
		sortBy: sortBy ? {
			field: sortBy,
			direction: sortDirection || "asc"
		} : void 0
	}), ctx.context.adapter.count({
		model: "apikey",
		where: [{
			field: "referenceId",
			value: referenceId
		}]
	})]);
	return {
		apiKeys,
		total
	};
}
/**
* Gets the organization plugin options from the context.
* Returns null if the organization plugin is not installed.
*/
function getOrgOptions(ctx) {
	const context = ctx.context;
	if ("orgOptions" in context && context.orgOptions) return context.orgOptions;
	const orgPlugin = context.getPlugin?.("organization");
	if (orgPlugin && "options" in orgPlugin) return orgPlugin.options;
	return null;
}
/**
* Checks if a user is a member of an organization and has the required permission.
* This is used for organization-owned API keys to validate access.
*
* @param ctx - The endpoint context
* @param userId - The ID of the user to check
* @param organizationId - The ID of the organization (from API key's referenceId)
* @param requiredAction - The action the user is trying to perform (create, read, update, delete)
* @returns The member object if authorized
* @throws APIError if not authorized
*/
async function checkOrgApiKeyPermission(ctx, userId, organizationId, requiredAction) {
	const orgOptions = getOrgOptions(ctx);
	if (!orgOptions) {
		const msg = API_KEY_ERROR_CODES.ORGANIZATION_PLUGIN_REQUIRED;
		throw APIError$1.from("INTERNAL_SERVER_ERROR", msg);
	}
	const member = await ctx.context.adapter.findOne({
		model: "member",
		where: [{
			field: "userId",
			value: userId
		}, {
			field: "organizationId",
			value: organizationId
		}]
	});
	if (!member) {
		const msg = API_KEY_ERROR_CODES.USER_NOT_MEMBER_OF_ORGANIZATION;
		throw APIError$1.from("FORBIDDEN", msg);
	}
	if (!await checkPermission(ctx, member.role, organizationId, requiredAction, orgOptions)) {
		const msg = API_KEY_ERROR_CODES.INSUFFICIENT_API_KEY_PERMISSIONS;
		throw APIError$1.from("FORBIDDEN", msg);
	}
	return member;
}
/**
* Checks if a role has the required permission for API key operations.
* Uses the organization's access control system.
*
* Organization owners (determined by orgOptions.creatorRole, default "owner")
* are granted full access to API key operations.
*/
async function checkPermission(ctx, role$1, organizationId, action, orgOptions) {
	const { hasPermission: hasPermission$1 } = await import("./organization-y0r_U2-i.mjs");
	try {
		return await hasPermission$1({
			role: role$1,
			options: orgOptions,
			permissions: { apiKey: [action] },
			organizationId,
			allowCreatorAllPermissions: true
		}, ctx);
	} catch {
		return false;
	}
}
const getDate = (span, unit = "ms") => {
	return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};
function isAPIError(error) {
	return error instanceof APIError$1 || error instanceof APIError$1 || error?.name === "APIError";
}
const createApiKeyBodySchema = z$3.object({
	configId: z$3.string().meta({ description: "The configuration ID to use for the API key. If not provided, the default configuration will be used." }).optional(),
	name: z$3.string().meta({ description: "Name of the Api Key" }).optional(),
	expiresIn: z$3.number().meta({ description: "Expiration time of the Api Key in seconds" }).min(1).optional().nullable().default(null),
	prefix: z$3.string().meta({ description: "Prefix of the Api Key" }).regex(/^[a-zA-Z0-9_-]+$/, { message: "Invalid prefix format, must be alphanumeric and contain only underscores and hyphens." }).optional(),
	remaining: z$3.number().meta({ description: "Remaining number of requests. Server side only" }).min(0).optional().nullable().default(null),
	metadata: z$3.any().optional(),
	refillAmount: z$3.number().meta({ description: "Amount to refill the remaining count of the Api Key. server-only. Eg: 100" }).min(1).optional(),
	refillInterval: z$3.number().meta({ description: "Interval to refill the Api Key in milliseconds. server-only. Eg: 1000" }).optional(),
	rateLimitTimeWindow: z$3.number().meta({ description: "The duration in milliseconds where each request is counted. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 1000" }).optional(),
	rateLimitMax: z$3.number().meta({ description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 100" }).optional(),
	rateLimitEnabled: z$3.boolean().meta({ description: "Whether the key has rate limiting enabled. server-only. Eg: true" }).optional(),
	permissions: z$3.record(z$3.string(), z$3.array(z$3.string())).meta({ description: "Permissions of the Api Key." }).optional(),
	userId: z$3.coerce.string().meta({ description: "User Id of the user that the Api Key belongs to. server-only. Eg: \"user-id\"" }).optional(),
	organizationId: z$3.coerce.string().meta({ description: "Organization Id of the organization that the Api Key belongs to. Eg: 'org-id'" }).optional()
});
function createApiKey({ defaultKeyGenerator, configurations, schema: schema$1, deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint("/api-key/create", {
		method: "POST",
		body: createApiKeyBodySchema,
		metadata: { openapi: {
			description: "Create a new API key for a user",
			responses: { "200": {
				description: "API key created successfully",
				content: { "application/json": { schema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "Unique identifier of the API key"
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "Creation timestamp"
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							description: "Last update timestamp"
						},
						name: {
							type: "string",
							nullable: true,
							description: "Name of the API key"
						},
						prefix: {
							type: "string",
							nullable: true,
							description: "Prefix of the API key"
						},
						start: {
							type: "string",
							nullable: true,
							description: "Starting characters of the key (if configured)"
						},
						key: {
							type: "string",
							description: "The full API key (only returned on creation)"
						},
						enabled: {
							type: "boolean",
							description: "Whether the key is enabled"
						},
						expiresAt: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "Expiration timestamp"
						},
						referenceId: {
							type: "string",
							description: "ID of the reference owning the key"
						},
						lastRefillAt: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "Last refill timestamp"
						},
						lastRequest: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "Last request timestamp"
						},
						metadata: {
							type: "object",
							nullable: true,
							additionalProperties: true,
							description: "Metadata associated with the key"
						},
						rateLimitMax: {
							type: "number",
							nullable: true,
							description: "Maximum requests in time window"
						},
						rateLimitTimeWindow: {
							type: "number",
							nullable: true,
							description: "Rate limit time window in milliseconds"
						},
						remaining: {
							type: "number",
							nullable: true,
							description: "Remaining requests"
						},
						refillAmount: {
							type: "number",
							nullable: true,
							description: "Amount to refill"
						},
						refillInterval: {
							type: "number",
							nullable: true,
							description: "Refill interval in milliseconds"
						},
						rateLimitEnabled: {
							type: "boolean",
							description: "Whether rate limiting is enabled"
						},
						requestCount: {
							type: "number",
							description: "Current request count in window"
						},
						permissions: {
							type: "object",
							nullable: true,
							additionalProperties: {
								type: "array",
								items: { type: "string" }
							},
							description: "Permissions associated with the key"
						}
					},
					required: [
						"id",
						"createdAt",
						"updatedAt",
						"key",
						"enabled",
						"referenceId",
						"rateLimitEnabled",
						"requestCount"
					]
				} } }
			} }
		} }
	}, async (ctx) => {
		const { configId, name, expiresIn, prefix, remaining, metadata: metadata$1, refillAmount, refillInterval, permissions, rateLimitMax, rateLimitTimeWindow, rateLimitEnabled } = ctx.body;
		const opts = resolveConfiguration(ctx.context, configurations, configId);
		const keyGenerator = opts.customKeyGenerator || defaultKeyGenerator;
		const session = await getSessionFromCtx(ctx, { disableCookieCache: true });
		const isClientRequest = ctx.request || ctx.headers;
		if (isClientRequest && (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || permissions !== void 0 || remaining !== null)) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.SERVER_ONLY_PROPERTY);
		if (ctx.request && ctx.body.userId !== void 0) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION);
		const referencesType = opts.references ?? "user";
		let referenceId;
		if (referencesType === "organization") {
			const orgId = ctx.body.organizationId;
			if (!orgId) {
				const msg = API_KEY_ERROR_CODES.ORGANIZATION_ID_REQUIRED;
				throw APIError$1.from("BAD_REQUEST", msg);
			}
			const userId = session?.user.id || ctx.body.userId;
			if (!userId) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION);
			await checkOrgApiKeyPermission(ctx, userId, orgId, "create");
			referenceId = orgId;
		} else if (isClientRequest) {
			if (!session?.user.id) {
				const msg = API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION;
				throw APIError$1.from("UNAUTHORIZED", msg);
			}
			referenceId = session.user.id;
		} else {
			const ctxUserId = ctx.body.userId;
			const sessionUserId = session?.user.id;
			if (!sessionUserId && !ctxUserId) {
				const msg = API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION;
				throw APIError$1.from("UNAUTHORIZED", msg);
			}
			if (session && ctxUserId && sessionUserId !== ctxUserId) {
				const msg = API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION;
				throw APIError$1.from("UNAUTHORIZED", msg);
			}
			referenceId = sessionUserId || ctxUserId;
		}
		if (metadata$1) {
			if (opts.enableMetadata === false) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.METADATA_DISABLED);
			if (typeof metadata$1 !== "object") throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_METADATA_TYPE);
		}
		if (refillAmount && !refillInterval) {
			const msg = API_KEY_ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED;
			throw APIError$1.from("BAD_REQUEST", msg);
		}
		if (refillInterval && !refillAmount) {
			const msg = API_KEY_ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED;
			throw APIError$1.from("BAD_REQUEST", msg);
		}
		if (expiresIn) {
			if (opts.keyExpiration.disableCustomExpiresTime === true) {
				const msg = API_KEY_ERROR_CODES.KEY_DISABLED_EXPIRATION;
				throw APIError$1.from("BAD_REQUEST", msg);
			}
			const expiresIn_in_days = expiresIn / (3600 * 24);
			if (opts.keyExpiration.minExpiresIn > expiresIn_in_days) {
				const msg = API_KEY_ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL;
				throw APIError$1.from("BAD_REQUEST", msg);
			} else if (opts.keyExpiration.maxExpiresIn < expiresIn_in_days) {
				const msg = API_KEY_ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE;
				throw APIError$1.from("BAD_REQUEST", msg);
			}
		}
		if (prefix) {
			if (prefix.length < opts.minimumPrefixLength) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_PREFIX_LENGTH);
			if (prefix.length > opts.maximumPrefixLength) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_PREFIX_LENGTH);
		}
		if (name) {
			if (name.length < opts.minimumNameLength) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_NAME_LENGTH);
			if (name.length > opts.maximumNameLength) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_NAME_LENGTH);
		} else if (opts.requireName) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.NAME_REQUIRED);
		deleteAllExpiredApiKeys$1(ctx.context);
		const key = await keyGenerator({
			length: opts.defaultKeyLength,
			prefix: prefix || opts.defaultPrefix
		});
		const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
		let start = null;
		if (opts.startingCharactersConfig.shouldStore) start = key.substring(0, opts.startingCharactersConfig.charactersLength);
		const defaultPermissions = opts.permissions?.defaultPermissions ? typeof opts.permissions.defaultPermissions === "function" ? await opts.permissions.defaultPermissions(referenceId, ctx) : opts.permissions.defaultPermissions : void 0;
		const permissionsToApply = permissions ? JSON.stringify(permissions) : defaultPermissions ? JSON.stringify(defaultPermissions) : void 0;
		const data = {
			configId: opts.configId ?? "default",
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date(),
			name: name ?? null,
			prefix: prefix ?? opts.defaultPrefix ?? null,
			start,
			key: hashed,
			enabled: true,
			expiresAt: expiresIn ? getDate(expiresIn, "sec") : opts.keyExpiration.defaultExpiresIn ? getDate(opts.keyExpiration.defaultExpiresIn, "sec") : null,
			referenceId,
			lastRefillAt: null,
			lastRequest: null,
			metadata: null,
			rateLimitMax: rateLimitMax ?? opts.rateLimit.maxRequests ?? null,
			rateLimitTimeWindow: rateLimitTimeWindow ?? opts.rateLimit.timeWindow ?? null,
			remaining: remaining === null ? remaining : remaining ?? refillAmount ?? null,
			refillAmount: refillAmount ?? null,
			refillInterval: refillInterval ?? null,
			rateLimitEnabled: rateLimitEnabled === void 0 ? opts.rateLimit.enabled ?? true : rateLimitEnabled,
			requestCount: 0,
			permissions: permissionsToApply
		};
		if (metadata$1) data.metadata = metadata$1;
		let apiKey$1;
		if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
			apiKey$1 = await ctx.context.adapter.create({
				model: API_KEY_TABLE_NAME,
				data
			});
			await setApiKey(ctx, apiKey$1, opts);
		} else if (opts.storage === "secondary-storage") {
			const id = ctx.context.generateId({ model: "apikey" }) || generateId$1();
			apiKey$1 = {
				...data,
				id
			};
			await setApiKey(ctx, apiKey$1, opts);
		} else apiKey$1 = await ctx.context.adapter.create({
			model: API_KEY_TABLE_NAME,
			data
		});
		return ctx.json({
			...apiKey$1,
			key,
			metadata: metadata$1 ?? null,
			permissions: apiKey$1.permissions ? safeJSONParse(apiKey$1.permissions) : null
		});
	});
}
function deleteAllExpiredApiKeysEndpoint({ deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint.serverOnly({ method: "POST" }, async (ctx) => {
		try {
			await deleteAllExpiredApiKeys$1(ctx.context, true);
		} catch (error) {
			ctx.context.logger.error("[API KEY PLUGIN] Failed to delete expired API keys:", error);
			return ctx.json({
				success: false,
				error
			});
		}
		return ctx.json({
			success: true,
			error: null
		});
	});
}
const deleteApiKeyBodySchema = z$3.object({
	configId: z$3.string().meta({ description: "The configuration ID to use for the API key lookup. If not provided, the default configuration will be used." }).optional(),
	keyId: z$3.string().meta({ description: "The id of the Api Key" })
});
function deleteApiKey({ configurations, schema: schema$1, deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint("/api-key/delete", {
		method: "POST",
		body: deleteApiKeyBodySchema,
		use: [sessionMiddleware],
		metadata: { openapi: {
			description: "Delete an existing API key",
			requestBody: { content: { "application/json": { schema: {
				type: "object",
				properties: { keyId: {
					type: "string",
					description: "The id of the API key to delete"
				} },
				required: ["keyId"]
			} } } },
			responses: { "200": {
				description: "API key deleted successfully",
				content: { "application/json": { schema: {
					type: "object",
					properties: { success: {
						type: "boolean",
						description: "Indicates if the API key was successfully deleted"
					} },
					required: ["success"]
				} } }
			} }
		} }
	}, async (ctx) => {
		const { configId, keyId } = ctx.body;
		const session = ctx.context.session;
		if (session.user.banned === true) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.USER_BANNED);
		const lookupOpts = resolveConfiguration(ctx.context, configurations, configId);
		let apiKey$1 = null;
		apiKey$1 = await getApiKeyById(ctx, keyId, lookupOpts);
		if (!apiKey$1) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		if (!configIdMatches(apiKey$1.configId, lookupOpts.configId)) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		const opts = resolveConfiguration(ctx.context, configurations, apiKey$1.configId);
		if ((opts.references ?? "user") === "organization") await checkOrgApiKeyPermission(ctx, session.user.id, apiKey$1.referenceId, "delete");
		else if (apiKey$1.referenceId !== session.user.id) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		try {
			if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
				await deleteApiKey$1(ctx, apiKey$1, opts);
				await ctx.context.adapter.delete({
					model: API_KEY_TABLE_NAME,
					where: [{
						field: "id",
						value: apiKey$1.id
					}]
				});
			} else if (opts.storage === "database") await ctx.context.adapter.delete({
				model: API_KEY_TABLE_NAME,
				where: [{
					field: "id",
					value: apiKey$1.id
				}]
			});
			else await deleteApiKey$1(ctx, apiKey$1, opts);
		} catch (error) {
			throw APIError$1.fromStatus("INTERNAL_SERVER_ERROR", { message: error?.message });
		}
		deleteAllExpiredApiKeys$1(ctx.context);
		return ctx.json({ success: true });
	});
}
const getApiKeyQuerySchema = z$3.object({
	configId: z$3.string().meta({ description: "The configuration ID to use for the API key lookup. If not provided, the default configuration will be used." }).optional(),
	id: z$3.string().meta({ description: "The id of the Api Key" })
});
function getApiKey({ configurations, schema: schema$1, deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint("/api-key/get", {
		method: "GET",
		query: getApiKeyQuerySchema,
		use: [sessionMiddleware],
		metadata: { openapi: {
			description: "Retrieve an existing API key by ID",
			responses: { "200": {
				description: "API key retrieved successfully",
				content: { "application/json": { schema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "ID"
						},
						name: {
							type: "string",
							nullable: true,
							description: "The name of the key"
						},
						start: {
							type: "string",
							nullable: true,
							description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
						},
						prefix: {
							type: "string",
							nullable: true,
							description: "The API Key prefix. Stored as plain text."
						},
						userId: {
							type: "string",
							description: "The owner of the user id"
						},
						refillInterval: {
							type: "number",
							nullable: true,
							description: "The interval in milliseconds between refills of the `remaining` count. Example: 3600000 // refill every hour (3600000ms = 1h)"
						},
						refillAmount: {
							type: "number",
							nullable: true,
							description: "The amount to refill"
						},
						lastRefillAt: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "The last refill date"
						},
						enabled: {
							type: "boolean",
							description: "Sets if key is enabled or disabled",
							default: true
						},
						rateLimitEnabled: {
							type: "boolean",
							description: "Whether the key has rate limiting enabled"
						},
						rateLimitTimeWindow: {
							type: "number",
							nullable: true,
							description: "The duration in milliseconds"
						},
						rateLimitMax: {
							type: "number",
							nullable: true,
							description: "Maximum amount of requests allowed within a window"
						},
						requestCount: {
							type: "number",
							description: "The number of requests made within the rate limit time window"
						},
						remaining: {
							type: "number",
							nullable: true,
							description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
						},
						lastRequest: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "When last request occurred"
						},
						expiresAt: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "Expiry date of a key"
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "created at"
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							description: "updated at"
						},
						metadata: {
							type: "object",
							nullable: true,
							additionalProperties: true,
							description: "Extra metadata about the apiKey"
						},
						permissions: {
							type: "string",
							nullable: true,
							description: "Permissions for the api key (stored as JSON string)"
						}
					},
					required: [
						"id",
						"userId",
						"enabled",
						"rateLimitEnabled",
						"requestCount",
						"createdAt",
						"updatedAt"
					]
				} } }
			} }
		} }
	}, async (ctx) => {
		const { configId, id } = ctx.query;
		const session = ctx.context.session;
		const lookupOpts = resolveConfiguration(ctx.context, configurations, configId);
		let apiKey$1 = null;
		apiKey$1 = await getApiKeyById(ctx, id, lookupOpts);
		if (!apiKey$1) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		if (!configIdMatches(apiKey$1.configId, lookupOpts.configId)) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		const opts = resolveConfiguration(ctx.context, configurations, apiKey$1.configId);
		if ((opts.references ?? "user") === "organization") await checkOrgApiKeyPermission(ctx, session.user.id, apiKey$1.referenceId, "read");
		else if (apiKey$1.referenceId !== session.user.id) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		deleteAllExpiredApiKeys$1(ctx.context);
		const metadata$1 = await migrateDoubleStringifiedMetadata(ctx, apiKey$1, opts);
		const { key: _key, ...returningApiKey } = apiKey$1;
		return ctx.json({
			...returningApiKey,
			metadata: metadata$1,
			permissions: returningApiKey.permissions ? safeJSONParse(returningApiKey.permissions) : null
		});
	});
}
/**
* Generate a unique identifier for a configuration's storage backend.
* Used to group configurations that share the same storage and avoid duplicate queries.
*/
function getStorageIdentifier(config) {
	if (config.storage === "database") return "database";
	if (config.customStorage) return `custom:${config.configId ?? "default"}`;
	return config.fallbackToDatabase ? "secondary-storage-with-fallback" : "secondary-storage";
}
const listApiKeysQuerySchema = z$3.object({
	configId: z$3.string().meta({ description: "Filter by configuration ID. If not provided, returns keys from all configurations." }).optional(),
	organizationId: z$3.string().meta({ description: "Organization ID to list keys for. If provided, returns organization-owned keys. If not provided, returns user-owned keys." }).optional(),
	limit: z$3.coerce.number().int().nonnegative().meta({ description: "The number of API keys to return" }).optional(),
	offset: z$3.coerce.number().int().nonnegative().meta({ description: "The offset to start from" }).optional(),
	sortBy: z$3.string().meta({ description: "The field to sort by (e.g., createdAt, name, expiresAt)" }).optional(),
	sortDirection: z$3.enum(["asc", "desc"]).meta({ description: "The direction to sort by" }).optional()
}).optional();
function listApiKeys({ configurations, schema: schema$1, deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint("/api-key/list", {
		method: "GET",
		use: [sessionMiddleware],
		query: listApiKeysQuerySchema,
		metadata: { openapi: {
			description: "List all API keys for the authenticated user or for a specific organization",
			responses: { "200": {
				description: "API keys retrieved successfully",
				content: { "application/json": { schema: {
					type: "object",
					properties: {
						apiKeys: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
										description: "ID"
									},
									name: {
										type: "string",
										nullable: true,
										description: "The name of the key"
									},
									start: {
										type: "string",
										nullable: true,
										description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
									},
									prefix: {
										type: "string",
										nullable: true,
										description: "The API Key prefix. Stored as plain text."
									},
									userId: {
										type: "string",
										description: "The owner of the user id"
									},
									refillInterval: {
										type: "number",
										nullable: true,
										description: "The interval in milliseconds between refills of the `remaining` count. Example: 3600000 // refill every hour (3600000ms = 1h)"
									},
									refillAmount: {
										type: "number",
										nullable: true,
										description: "The amount to refill"
									},
									lastRefillAt: {
										type: "string",
										format: "date-time",
										nullable: true,
										description: "The last refill date"
									},
									enabled: {
										type: "boolean",
										description: "Sets if key is enabled or disabled",
										default: true
									},
									rateLimitEnabled: {
										type: "boolean",
										description: "Whether the key has rate limiting enabled"
									},
									rateLimitTimeWindow: {
										type: "number",
										nullable: true,
										description: "The duration in milliseconds"
									},
									rateLimitMax: {
										type: "number",
										nullable: true,
										description: "Maximum amount of requests allowed within a window"
									},
									requestCount: {
										type: "number",
										description: "The number of requests made within the rate limit time window"
									},
									remaining: {
										type: "number",
										nullable: true,
										description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
									},
									lastRequest: {
										type: "string",
										format: "date-time",
										nullable: true,
										description: "When last request occurred"
									},
									expiresAt: {
										type: "string",
										format: "date-time",
										nullable: true,
										description: "Expiry date of a key"
									},
									createdAt: {
										type: "string",
										format: "date-time",
										description: "created at"
									},
									updatedAt: {
										type: "string",
										format: "date-time",
										description: "updated at"
									},
									metadata: {
										type: "object",
										nullable: true,
										additionalProperties: true,
										description: "Extra metadata about the apiKey"
									},
									permissions: {
										type: "string",
										nullable: true,
										description: "Permissions for the api key (stored as JSON string)"
									}
								},
								required: [
									"id",
									"userId",
									"enabled",
									"rateLimitEnabled",
									"requestCount",
									"createdAt",
									"updatedAt"
								]
							}
						},
						total: {
							type: "number",
							description: "Total number of API keys"
						},
						limit: {
							type: "number",
							nullable: true,
							description: "The limit used for pagination"
						},
						offset: {
							type: "number",
							nullable: true,
							description: "The offset used for pagination"
						}
					},
					required: ["apiKeys", "total"]
				} } }
			} }
		} }
	}, async (ctx) => {
		const session = ctx.context.session;
		const configId = ctx.query?.configId;
		const organizationId = ctx.query?.organizationId;
		const limit = ctx.query?.limit != null ? Number(ctx.query.limit) : void 0;
		const offset = ctx.query?.offset != null ? Number(ctx.query.offset) : void 0;
		if (organizationId) await checkOrgApiKeyPermission(ctx, session.user.id, organizationId, "read");
		const referenceId = organizationId ?? session.user.id;
		const expectedReferencesType = organizationId ? "organization" : "user";
		let allApiKeys = [];
		if (configId) {
			const { apiKeys } = await listApiKeys$1(ctx, referenceId, resolveConfiguration(ctx.context, configurations, configId), {
				limit: void 0,
				offset: void 0,
				sortBy: ctx.query?.sortBy,
				sortDirection: ctx.query?.sortDirection
			});
			allApiKeys = apiKeys;
		} else {
			const storageGroups = /* @__PURE__ */ new Map();
			for (const config of configurations) {
				const storageKey = getStorageIdentifier(config);
				if (!storageGroups.has(storageKey)) storageGroups.set(storageKey, config);
			}
			const groupResults = await Promise.all([...storageGroups.values()].map((opts) => listApiKeys$1(ctx, referenceId, opts, {
				limit: void 0,
				offset: void 0,
				sortBy: ctx.query?.sortBy,
				sortDirection: ctx.query?.sortDirection
			})));
			const seenIds = /* @__PURE__ */ new Set();
			for (const { apiKeys } of groupResults) for (const key of apiKeys) if (!seenIds.has(key.id)) {
				seenIds.add(key.id);
				allApiKeys.push(key);
			}
		}
		let filteredApiKeys = allApiKeys.filter((key) => {
			return (configurations.find((c) => {
				if (isDefaultConfigId(key.configId)) return isDefaultConfigId(c.configId);
				return c.configId === key.configId;
			})?.references ?? "user") === expectedReferencesType && key.referenceId === referenceId;
		});
		if (configId) filteredApiKeys = filteredApiKeys.filter((key) => configIdMatches(key.configId, configId));
		const total = filteredApiKeys.length;
		let paginatedApiKeys = filteredApiKeys;
		if (offset !== void 0) paginatedApiKeys = paginatedApiKeys.slice(offset);
		if (limit !== void 0) paginatedApiKeys = paginatedApiKeys.slice(0, limit);
		deleteAllExpiredApiKeys$1(ctx.context);
		const returningApiKeys = paginatedApiKeys.map((apiKey$1) => {
			const { key: _key, ...rest } = apiKey$1;
			return {
				...rest,
				metadata: parseDoubleStringifiedMetadata(apiKey$1.metadata),
				permissions: rest.permissions ? safeJSONParse(rest.permissions) : null
			};
		});
		const dbConfig = configurations.find((c) => c.storage === "database" || c.fallbackToDatabase);
		if (dbConfig) await ctx.context.runInBackgroundOrAwait(batchMigrateLegacyMetadata(ctx, paginatedApiKeys, dbConfig));
		return ctx.json({
			apiKeys: returningApiKeys,
			total,
			limit,
			offset
		});
	});
}
const updateApiKeyBodySchema = z$3.object({
	configId: z$3.string().meta({ description: "The configuration ID to use for the API key lookup. If not provided, the default configuration will be used." }).optional(),
	keyId: z$3.string().meta({ description: "The id of the Api Key" }),
	userId: z$3.coerce.string().meta({ description: "The id of the user which the api key belongs to. server-only. Eg: \"some-user-id\"" }).optional(),
	name: z$3.string().meta({ description: "The name of the key" }).optional(),
	enabled: z$3.boolean().meta({ description: "Whether the Api Key is enabled or not" }).optional(),
	remaining: z$3.number().meta({ description: "The number of remaining requests" }).min(1).optional(),
	refillAmount: z$3.number().meta({ description: "The refill amount" }).optional(),
	refillInterval: z$3.number().meta({ description: "The refill interval" }).optional(),
	metadata: z$3.any().optional(),
	expiresIn: z$3.number().meta({ description: "Expiration time of the Api Key in seconds" }).min(1).optional().nullable(),
	rateLimitEnabled: z$3.boolean().meta({ description: "Whether the key has rate limiting enabled." }).optional(),
	rateLimitTimeWindow: z$3.number().meta({ description: "The duration in milliseconds where each request is counted. server-only. Eg: 1000" }).optional(),
	rateLimitMax: z$3.number().meta({ description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 100" }).optional(),
	permissions: z$3.record(z$3.string(), z$3.array(z$3.string())).meta({ description: "Update the permissions on the API Key. server-only." }).optional().nullable()
});
function updateApiKey({ configurations, schema: schema$1, deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint("/api-key/update", {
		method: "POST",
		body: updateApiKeyBodySchema,
		metadata: { openapi: {
			description: "Update an existing API key by ID",
			responses: { "200": {
				description: "API key updated successfully",
				content: { "application/json": { schema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "ID"
						},
						name: {
							type: "string",
							nullable: true,
							description: "The name of the key"
						},
						start: {
							type: "string",
							nullable: true,
							description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
						},
						prefix: {
							type: "string",
							nullable: true,
							description: "The API Key prefix. Stored as plain text."
						},
						userId: {
							type: "string",
							description: "The owner of the user id"
						},
						refillInterval: {
							type: "number",
							nullable: true,
							description: "The interval in milliseconds between refills of the `remaining` count. Example: 3600000 // refill every hour (3600000ms = 1h)"
						},
						refillAmount: {
							type: "number",
							nullable: true,
							description: "The amount to refill"
						},
						lastRefillAt: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "The last refill date"
						},
						enabled: {
							type: "boolean",
							description: "Sets if key is enabled or disabled",
							default: true
						},
						rateLimitEnabled: {
							type: "boolean",
							description: "Whether the key has rate limiting enabled"
						},
						rateLimitTimeWindow: {
							type: "number",
							nullable: true,
							description: "The duration in milliseconds"
						},
						rateLimitMax: {
							type: "number",
							nullable: true,
							description: "Maximum amount of requests allowed within a window"
						},
						requestCount: {
							type: "number",
							description: "The number of requests made within the rate limit time window"
						},
						remaining: {
							type: "number",
							nullable: true,
							description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
						},
						lastRequest: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "When last request occurred"
						},
						expiresAt: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "Expiry date of a key"
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "created at"
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							description: "updated at"
						},
						metadata: {
							type: "object",
							nullable: true,
							additionalProperties: true,
							description: "Extra metadata about the apiKey"
						},
						permissions: {
							type: "string",
							nullable: true,
							description: "Permissions for the api key (stored as JSON string)"
						}
					},
					required: [
						"id",
						"userId",
						"enabled",
						"rateLimitEnabled",
						"requestCount",
						"createdAt",
						"updatedAt"
					]
				} } }
			} }
		} }
	}, async (ctx) => {
		const { configId, keyId, expiresIn, enabled, metadata: metadata$1, refillAmount, refillInterval, remaining, name, permissions, rateLimitEnabled, rateLimitTimeWindow, rateLimitMax } = ctx.body;
		const session = await getSessionFromCtx(ctx, { disableCookieCache: true });
		const authRequired = ctx.request || ctx.headers;
		const user = authRequired && !session ? null : session?.user || { id: ctx.body.userId };
		if (!user?.id) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION);
		if (session && ctx.body.userId && session?.user.id !== ctx.body.userId) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.UNAUTHORIZED_SESSION);
		if (authRequired) {
			if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || remaining !== void 0 || permissions !== void 0) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.SERVER_ONLY_PROPERTY);
		}
		const lookupOpts = resolveConfiguration(ctx.context, configurations, configId);
		let apiKey$1 = null;
		apiKey$1 = await getApiKeyById(ctx, keyId, lookupOpts);
		if (!apiKey$1) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		if (!configIdMatches(apiKey$1.configId, lookupOpts.configId)) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		const opts = resolveConfiguration(ctx.context, configurations, apiKey$1.configId);
		if ((opts.references ?? "user") === "organization") await checkOrgApiKeyPermission(ctx, user.id, apiKey$1.referenceId, "update");
		else if (apiKey$1.referenceId !== user.id) throw APIError$1.from("NOT_FOUND", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		const newValues = {};
		if (name !== void 0) {
			if (name.length < opts.minimumNameLength) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_NAME_LENGTH);
			else if (name.length > opts.maximumNameLength) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_NAME_LENGTH);
			newValues.name = name;
		}
		if (enabled !== void 0) newValues.enabled = enabled;
		if (expiresIn !== void 0) {
			if (opts.keyExpiration.disableCustomExpiresTime === true) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.KEY_DISABLED_EXPIRATION);
			if (expiresIn !== null) {
				const expiresIn_in_days = expiresIn / (3600 * 24);
				if (expiresIn_in_days < opts.keyExpiration.minExpiresIn) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL);
				else if (expiresIn_in_days > opts.keyExpiration.maxExpiresIn) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE);
			}
			newValues.expiresAt = expiresIn ? getDate(expiresIn, "sec") : null;
		}
		if (metadata$1 !== void 0 && opts.enableMetadata === true) {
			if (typeof metadata$1 !== "object") throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_METADATA_TYPE);
			newValues.metadata = metadata$1;
		}
		if (remaining !== void 0) newValues.remaining = remaining;
		if (refillAmount !== void 0 || refillInterval !== void 0) {
			if (refillAmount !== void 0 && refillInterval === void 0) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED);
			else if (refillInterval !== void 0 && refillAmount === void 0) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED);
			newValues.refillAmount = refillAmount;
			newValues.refillInterval = refillInterval;
		}
		if (rateLimitEnabled !== void 0) newValues.rateLimitEnabled = rateLimitEnabled;
		if (rateLimitTimeWindow !== void 0) newValues.rateLimitTimeWindow = rateLimitTimeWindow;
		if (rateLimitMax !== void 0) newValues.rateLimitMax = rateLimitMax;
		if (permissions !== void 0) newValues.permissions = JSON.stringify(permissions);
		if (Object.keys(newValues).length === 0) throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.NO_VALUES_TO_UPDATE);
		let newApiKey = apiKey$1;
		try {
			if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
				const dbUpdated = await ctx.context.adapter.update({
					model: API_KEY_TABLE_NAME,
					where: [{
						field: "id",
						value: apiKey$1.id
					}],
					update: newValues
				});
				if (dbUpdated) {
					await setApiKey(ctx, dbUpdated, opts);
					newApiKey = dbUpdated;
				}
			} else if (opts.storage === "database") {
				const result = await ctx.context.adapter.update({
					model: API_KEY_TABLE_NAME,
					where: [{
						field: "id",
						value: apiKey$1.id
					}],
					update: newValues
				});
				if (result) newApiKey = result;
			} else {
				const updated = {
					...apiKey$1,
					...newValues,
					updatedAt: /* @__PURE__ */ new Date()
				};
				await setApiKey(ctx, updated, opts);
				newApiKey = updated;
			}
		} catch (error) {
			throw APIError$1.fromStatus("INTERNAL_SERVER_ERROR", { message: error?.message });
		}
		deleteAllExpiredApiKeys$1(ctx.context);
		const migratedMetadata = await migrateDoubleStringifiedMetadata(ctx, newApiKey, opts);
		const { key: _key, ...returningApiKey } = newApiKey;
		return ctx.json({
			...returningApiKey,
			metadata: migratedMetadata,
			permissions: returningApiKey.permissions ? safeJSONParse(returningApiKey.permissions) : null
		});
	});
}
/**
* Decides how the current request affects the per-key rate-limit counter, based
* on the read-in-memory ApiKey. The verify route applies the result atomically;
* this function performs no writes.
*/
function evaluateRateLimit(apiKey$1, opts) {
	const now = /* @__PURE__ */ new Date();
	const lastRequest = apiKey$1.lastRequest;
	const rateLimitTimeWindow = apiKey$1.rateLimitTimeWindow;
	const rateLimitMax = apiKey$1.rateLimitMax;
	if (opts.rateLimit.enabled === false) return {
		type: "skip",
		lastRequest: now
	};
	if (apiKey$1.rateLimitEnabled === false) return {
		type: "skip",
		lastRequest: now
	};
	if (rateLimitTimeWindow === null || rateLimitMax === null) return {
		type: "skip",
		lastRequest: null
	};
	if (lastRequest === null) return {
		type: "start",
		now
	};
	const timeSinceLastRequest = now.getTime() - new Date(lastRequest).getTime();
	if (timeSinceLastRequest > rateLimitTimeWindow) return {
		type: "reset",
		now,
		windowStart: new Date(now.getTime() - rateLimitTimeWindow)
	};
	if (apiKey$1.requestCount >= rateLimitMax) return {
		type: "deny",
		message: API_KEY_ERROR_CODES.RATE_LIMIT_EXCEEDED.message,
		tryAgainIn: Math.ceil(rateLimitTimeWindow - timeSinceLastRequest)
	};
	return {
		type: "increment",
		now,
		max: rateLimitMax,
		windowStart: new Date(now.getTime() - rateLimitTimeWindow)
	};
}
async function validateApiKey({ key, ctx, lookupOpts, configurations, schema: schema$1, permissions, expectedConfigId, runCustomValidator }) {
	const hashedKey = lookupOpts.disableKeyHashing ? key : await defaultKeyHasher(key);
	const apiKey$1 = await getApiKey$1(ctx, hashedKey, lookupOpts);
	if (!apiKey$1) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.INVALID_API_KEY);
	if (expectedConfigId !== void 0 && !configIdMatches(apiKey$1.configId, expectedConfigId)) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.INVALID_API_KEY);
	const opts = resolveConfiguration(ctx.context, configurations, apiKey$1.configId);
	if (runCustomValidator && opts.customAPIKeyValidator) {
		if (!await opts.customAPIKeyValidator({
			ctx,
			key
		})) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
	}
	if (apiKey$1.enabled === false) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.KEY_DISABLED);
	if (apiKey$1.expiresAt) {
		if (Date.now() > new Date(apiKey$1.expiresAt).getTime()) {
			const deleteExpiredKey = async () => {
				if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
					await deleteApiKey$1(ctx, apiKey$1, opts);
					await ctx.context.adapter.delete({
						model: API_KEY_TABLE_NAME,
						where: [{
							field: "id",
							value: apiKey$1.id
						}]
					});
				} else if (opts.storage === "secondary-storage") await deleteApiKey$1(ctx, apiKey$1, opts);
				else await ctx.context.adapter.delete({
					model: API_KEY_TABLE_NAME,
					where: [{
						field: "id",
						value: apiKey$1.id
					}]
				});
			};
			if (opts.deferUpdates) ctx.context.runInBackground(deleteExpiredKey().catch((error) => {
				ctx.context.logger.error("Deferred update failed:", error);
			}));
			else await deleteExpiredKey();
			throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.KEY_EXPIRED);
		}
	}
	if (permissions) {
		const apiKeyPermissions = apiKey$1.permissions ? safeJSONParse(apiKey$1.permissions) : null;
		if (!apiKeyPermissions) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
		if (!role(apiKeyPermissions).authorize(permissions).success) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.KEY_NOT_FOUND);
	}
	if (apiKey$1.remaining === 0 && apiKey$1.refillAmount === null) {
		const deleteExhaustedKey = async () => {
			if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) {
				await deleteApiKey$1(ctx, apiKey$1, opts);
				await ctx.context.adapter.delete({
					model: API_KEY_TABLE_NAME,
					where: [{
						field: "id",
						value: apiKey$1.id
					}]
				});
			} else if (opts.storage === "secondary-storage") await deleteApiKey$1(ctx, apiKey$1, opts);
			else await ctx.context.adapter.delete({
				model: API_KEY_TABLE_NAME,
				where: [{
					field: "id",
					value: apiKey$1.id
				}]
			});
		};
		if (opts.deferUpdates) ctx.context.runInBackground(deleteExhaustedKey().catch((error) => {
			ctx.context.logger.error("Deferred update failed:", error);
		}));
		else await deleteExhaustedKey();
		throw APIError$1.from("TOO_MANY_REQUESTS", API_KEY_ERROR_CODES.USAGE_EXCEEDED);
	}
	return {
		apiKey: opts.storage === "database" || opts.storage === "secondary-storage" && opts.fallbackToDatabase ? await claimUsageInDatabase({
			ctx,
			apiKey: apiKey$1,
			opts,
			hashedKey
		}) : await claimUsageInSecondaryStorage({
			ctx,
			apiKey: apiKey$1,
			opts,
			hashedKey
		}),
		opts
	};
}
/**
* Atomically consume quota and a rate-limit slot against the database row, the
* source of truth for `database` and `secondary-storage` + `fallbackToDatabase`
* modes. Each guarded `incrementOne` only mutates the row while the guard still
* holds, so concurrent verifications cannot drive `remaining` below zero or push
* `requestCount` past the configured max. The cache (when present) is refreshed
* from the resulting row.
*/
async function claimUsageInDatabase({ ctx, apiKey: apiKey$1, opts, hashedKey }) {
	let row = apiKey$1;
	if (apiKey$1.remaining !== null) row = await consumeRemaining(ctx, apiKey$1);
	row = await consumeRateLimit(ctx, row, opts);
	const finalRow = await ctx.context.adapter.update({
		model: API_KEY_TABLE_NAME,
		where: [{
			field: "id",
			value: row.id
		}],
		update: { updatedAt: /* @__PURE__ */ new Date() }
	});
	if (!finalRow) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.INVALID_API_KEY);
	if (opts.storage === "secondary-storage" && opts.fallbackToDatabase) await setApiKey(ctx, finalRow, opts);
	return finalRow;
}
/**
* Guarded quota consumption. When a refill is due, exactly one verification wins
* the refill (compare-and-swap on the observed `lastRefillAt`); any concurrent
* verification falls through to the plain guarded decrement against the refilled
* value. The decrement only applies while `remaining > 0`, so it can never go
* negative. Returns the updated row; throws when the quota is exhausted.
*/
async function consumeRemaining(ctx, apiKey$1) {
	const now = /* @__PURE__ */ new Date();
	const { refillInterval, refillAmount } = apiKey$1;
	if (refillInterval && refillAmount) {
		const lastTime = new Date(apiKey$1.lastRefillAt ?? apiKey$1.createdAt).getTime();
		if (now.getTime() - lastTime > refillInterval) {
			const refilled = await ctx.context.adapter.incrementOne({
				model: API_KEY_TABLE_NAME,
				where: [{
					field: "id",
					value: apiKey$1.id
				}, {
					field: "lastRefillAt",
					value: apiKey$1.lastRefillAt
				}],
				increment: {},
				set: {
					remaining: refillAmount - 1,
					lastRefillAt: now
				}
			});
			if (refilled) return refilled;
		}
	}
	const decremented = await ctx.context.adapter.incrementOne({
		model: API_KEY_TABLE_NAME,
		where: [{
			field: "id",
			value: apiKey$1.id
		}, {
			field: "remaining",
			operator: "gt",
			value: 0
		}],
		increment: { remaining: -1 }
	});
	if (!decremented) throw APIError$1.from("TOO_MANY_REQUESTS", API_KEY_ERROR_CODES.USAGE_EXCEEDED);
	return decremented;
}
/**
* Guarded rate-limit consumption. The common in-window path increments
* `requestCount` only while it is below the max (compare-and-swap), so a burst
* of concurrent verifications can never exceed the limit. Window resets and the
* first request in a window are guarded conditional sets; a request that loses
* every guard within an active window is rejected. Returns the updated row, or
* the unchanged row when rate limiting does not apply.
*/
async function consumeRateLimit(ctx, apiKey$1, opts) {
	const decision = evaluateRateLimit(apiKey$1, opts);
	if (decision.type === "deny") throw new APIError$1("TOO_MANY_REQUESTS", {
		message: decision.message,
		code: "RATE_LIMITED",
		details: { tryAgainIn: decision.tryAgainIn }
	});
	if (decision.type === "skip") {
		if (decision.lastRequest === null) return apiKey$1;
		return await ctx.context.adapter.update({
			model: "apikey",
			where: [{
				field: "id",
				value: apiKey$1.id
			}],
			update: { lastRequest: decision.lastRequest }
		}) ?? apiKey$1;
	}
	if (decision.type === "increment") {
		const incremented = await ctx.context.adapter.incrementOne({
			model: API_KEY_TABLE_NAME,
			where: [
				{
					field: "id",
					value: apiKey$1.id
				},
				{
					field: "lastRequest",
					operator: "gt",
					value: decision.windowStart
				},
				{
					field: "requestCount",
					operator: "lt",
					value: decision.max
				}
			],
			increment: { requestCount: 1 },
			set: { lastRequest: decision.now }
		});
		if (incremented) return incremented;
		const fresh$1 = await ctx.context.adapter.findOne({
			model: API_KEY_TABLE_NAME,
			where: [{
				field: "id",
				value: apiKey$1.id
			}]
		});
		if (!fresh$1) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.INVALID_API_KEY);
		return consumeRateLimit(ctx, fresh$1, opts);
	}
	const windowGuard = decision.type === "reset" ? {
		field: "lastRequest",
		operator: "lte",
		value: decision.windowStart
	} : {
		field: "lastRequest",
		operator: "eq",
		value: null
	};
	const started = await ctx.context.adapter.incrementOne({
		model: API_KEY_TABLE_NAME,
		where: [{
			field: "id",
			value: apiKey$1.id
		}, windowGuard],
		increment: {},
		set: {
			requestCount: 1,
			lastRequest: decision.now
		}
	});
	if (started) return started;
	const fresh = await ctx.context.adapter.findOne({
		model: API_KEY_TABLE_NAME,
		where: [{
			field: "id",
			value: apiKey$1.id
		}]
	});
	if (!fresh) throw APIError$1.from("UNAUTHORIZED", API_KEY_ERROR_CODES.INVALID_API_KEY);
	return consumeRateLimit(ctx, fresh, opts);
}
/**
* Secondary-storage-only mode has no database row to guard, so quota and
* rate-limit consumption stays a read-modify-write merge over the serialized
* key. This is the residual non-atomic path; strict enforcement requires the
* database (use `fallbackToDatabase`) or an atomic secondary-storage primitive.
* FIXME(api-key-secondary-atomic): back this with SecondaryStorage.increment on
* `next` so secondary-storage-only mode enforces quota and rate limits atomically.
*/
async function claimUsageInSecondaryStorage({ ctx, apiKey: apiKey$1, opts, hashedKey }) {
	let remaining = apiKey$1.remaining;
	let lastRefillAt = apiKey$1.lastRefillAt;
	if (remaining !== null) {
		const now = Date.now();
		const { refillInterval, refillAmount } = apiKey$1;
		const lastTime = new Date(lastRefillAt ?? apiKey$1.createdAt).getTime();
		if (refillInterval && refillAmount && now - lastTime > refillInterval) {
			remaining = refillAmount;
			lastRefillAt = /* @__PURE__ */ new Date();
		}
		if (remaining === 0) throw APIError$1.from("TOO_MANY_REQUESTS", API_KEY_ERROR_CODES.USAGE_EXCEEDED);
		remaining--;
	}
	const mutations = {
		...applyRateLimitToSnapshot(apiKey$1, opts),
		remaining,
		lastRefillAt,
		updatedAt: /* @__PURE__ */ new Date()
	};
	const performUpdate = async () => {
		const fresh = await getApiKey$1(ctx, hashedKey, opts);
		if (!fresh) return null;
		const merged = {
			...fresh,
			...mutations
		};
		await setApiKey(ctx, merged, opts);
		return merged;
	};
	if (opts.deferUpdates) {
		ctx.context.runInBackground(performUpdate().catch((error) => {
			ctx.context.logger.error("Failed to update API key:", error);
		}));
		return {
			...apiKey$1,
			...mutations
		};
	}
	const updated = await performUpdate();
	if (!updated) throw APIError$1.from("INTERNAL_SERVER_ERROR", API_KEY_ERROR_CODES.FAILED_TO_UPDATE_API_KEY);
	return updated;
}
/**
* Translate a rate-limit decision into a counter snapshot for the
* secondary-storage merge write. Denials throw before any write.
*/
function applyRateLimitToSnapshot(apiKey$1, opts) {
	const decision = evaluateRateLimit(apiKey$1, opts);
	switch (decision.type) {
		case "deny": throw new APIError$1("TOO_MANY_REQUESTS", {
			message: decision.message,
			code: "RATE_LIMITED",
			details: { tryAgainIn: decision.tryAgainIn }
		});
		case "skip": return decision.lastRequest === null ? {} : { lastRequest: decision.lastRequest };
		case "start":
		case "reset": return {
			lastRequest: decision.now,
			requestCount: 1
		};
		case "increment": return {
			lastRequest: decision.now,
			requestCount: apiKey$1.requestCount + 1
		};
	}
}
const verifyApiKeyBodySchema = z$3.object({
	configId: z$3.string().meta({ description: "Configuration ID to scope verification to. When omitted, the key is validated against its own configuration." }).optional(),
	key: z$3.string().meta({ description: "The key to verify" }),
	permissions: z$3.record(z$3.string(), z$3.array(z$3.string())).meta({ description: "The permissions to verify." }).optional()
});
function verifyApiKey({ configurations, schema: schema$1, deleteAllExpiredApiKeys: deleteAllExpiredApiKeys$1 }) {
	return createAuthEndpoint.serverOnly({
		method: "POST",
		body: verifyApiKeyBodySchema
	}, async (ctx) => {
		const { configId, key } = ctx.body;
		const lookupOpts = resolveConfiguration(ctx.context, configurations, configId);
		if (configId !== void 0 && lookupOpts.customAPIKeyValidator) {
			if (!await lookupOpts.customAPIKeyValidator({
				ctx,
				key
			})) return ctx.json({
				valid: false,
				error: {
					message: API_KEY_ERROR_CODES.INVALID_API_KEY,
					code: "KEY_NOT_FOUND"
				},
				key: null
			});
		}
		let apiKey$1 = null;
		let opts;
		try {
			const result = await validateApiKey({
				key,
				permissions: ctx.body.permissions,
				ctx,
				lookupOpts,
				configurations,
				schema: schema$1,
				expectedConfigId: configId,
				runCustomValidator: configId === void 0
			});
			apiKey$1 = result.apiKey;
			opts = result.opts;
			if (opts.deferUpdates) ctx.context.runInBackground(deleteAllExpiredApiKeys$1(ctx.context).catch((err) => {
				ctx.context.logger.error("Failed to delete expired API keys:", err);
			}));
		} catch (error) {
			ctx.context.logger.error("Failed to validate API key:", error);
			if (isAPIError(error)) return ctx.json({
				valid: false,
				error: {
					...error.body,
					message: error.body?.message,
					code: error.body?.code
				},
				key: null
			});
			return ctx.json({
				valid: false,
				error: {
					message: API_KEY_ERROR_CODES.INVALID_API_KEY,
					code: "INVALID_API_KEY"
				},
				key: null
			});
		}
		const { key: _, ...returningApiKey } = apiKey$1 ?? {
			key: 1,
			permissions: void 0
		};
		let migratedMetadata = null;
		if (apiKey$1) migratedMetadata = await migrateDoubleStringifiedMetadata(ctx, apiKey$1, opts);
		returningApiKey.permissions = returningApiKey.permissions ? safeJSONParse(returningApiKey.permissions) : null;
		return ctx.json({
			valid: true,
			error: null,
			key: apiKey$1 === null ? null : {
				...returningApiKey,
				metadata: migratedMetadata
			}
		});
	});
}
function resolveConfiguration(authContext, configurations, configId) {
	const getDefaultConfig = () => {
		const defaultConfig = configurations.find((c) => !c.configId || c.configId === "default");
		if (!defaultConfig) {
			authContext.logger.error("No default api-key configuration found. Either provide an api-key configuration with configId 'default' or provide a configuration with no `configId` set.");
			const error = API_KEY_ERROR_CODES.NO_DEFAULT_API_KEY_CONFIGURATION_FOUND;
			throw APIError$1.from("BAD_REQUEST", error);
		}
		return {
			...defaultConfig,
			configId: "default"
		};
	};
	if (!configId) return getDefaultConfig();
	return configurations.find((c) => c.configId === configId) ?? getDefaultConfig();
}
/**
* Checks if a configId value represents the default configuration.
* Treats null, undefined, and "default" as equivalent (all are default).
* This handles backward compatibility for keys created before the configId field existed.
*/
function isDefaultConfigId(configId) {
	return !configId || configId === "default";
}
/**
* Checks if two configId values match, treating null/undefined as "default".
* This handles backward compatibility for keys created before the configId field existed.
*/
function configIdMatches(keyConfigId, expectedConfigId) {
	if (isDefaultConfigId(keyConfigId) && isDefaultConfigId(expectedConfigId)) return true;
	return keyConfigId === expectedConfigId;
}
let lastChecked = null;
async function deleteAllExpiredApiKeys(ctx, byPassLastCheckTime = false) {
	if (lastChecked && !byPassLastCheckTime) {
		if ((/* @__PURE__ */ new Date()).getTime() - lastChecked.getTime() < 1e4) return;
	}
	lastChecked = /* @__PURE__ */ new Date();
	await ctx.adapter.deleteMany({
		model: API_KEY_TABLE_NAME,
		where: [{
			field: "expiresAt",
			operator: "lt",
			value: /* @__PURE__ */ new Date()
		}, {
			field: "expiresAt",
			operator: "ne",
			value: null
		}]
	}).catch((error) => {
		ctx.logger.error(`Failed to delete expired API keys:`, error);
	});
}
function createApiKeyRoutes({ defaultKeyGenerator, configurations, schema: schema$1 }) {
	return {
		createApiKey: createApiKey({
			defaultKeyGenerator,
			configurations,
			schema: schema$1,
			deleteAllExpiredApiKeys
		}),
		verifyApiKey: verifyApiKey({
			configurations,
			schema: schema$1,
			deleteAllExpiredApiKeys
		}),
		getApiKey: getApiKey({
			configurations,
			schema: schema$1,
			deleteAllExpiredApiKeys
		}),
		updateApiKey: updateApiKey({
			configurations,
			schema: schema$1,
			deleteAllExpiredApiKeys
		}),
		deleteApiKey: deleteApiKey({
			configurations,
			schema: schema$1,
			deleteAllExpiredApiKeys
		}),
		listApiKeys: listApiKeys({
			configurations,
			schema: schema$1,
			deleteAllExpiredApiKeys
		}),
		deleteAllExpiredApiKeys: deleteAllExpiredApiKeysEndpoint({ deleteAllExpiredApiKeys })
	};
}
const apiKeySchema = ({ defaultRateLimitMax, defaultTimeWindow }) => ({ apikey: { fields: {
	configId: {
		type: "string",
		required: true,
		defaultValue: "default",
		input: false,
		index: true
	},
	name: {
		type: "string",
		required: false,
		input: false
	},
	start: {
		type: "string",
		required: false,
		input: false
	},
	referenceId: {
		type: "string",
		required: true,
		input: false,
		index: true
	},
	prefix: {
		type: "string",
		required: false,
		input: false
	},
	key: {
		type: "string",
		required: true,
		input: false,
		index: true
	},
	refillInterval: {
		type: "number",
		required: false,
		input: false
	},
	refillAmount: {
		type: "number",
		required: false,
		input: false
	},
	lastRefillAt: {
		type: "date",
		required: false,
		input: false
	},
	enabled: {
		type: "boolean",
		required: false,
		input: false,
		defaultValue: true
	},
	rateLimitEnabled: {
		type: "boolean",
		required: false,
		input: false,
		defaultValue: true
	},
	rateLimitTimeWindow: {
		type: "number",
		required: false,
		input: false,
		defaultValue: defaultTimeWindow
	},
	rateLimitMax: {
		type: "number",
		required: false,
		input: false,
		defaultValue: defaultRateLimitMax
	},
	requestCount: {
		type: "number",
		required: false,
		input: false,
		defaultValue: 0
	},
	remaining: {
		type: "number",
		required: false,
		input: false
	},
	lastRequest: {
		type: "date",
		required: false,
		input: false
	},
	expiresAt: {
		type: "date",
		required: false,
		input: false
	},
	createdAt: {
		type: "date",
		required: true,
		input: false
	},
	updatedAt: {
		type: "date",
		required: true,
		input: false
	},
	permissions: {
		type: "string",
		required: false,
		input: false
	},
	metadata: {
		type: "string",
		required: false,
		input: true,
		transform: {
			input(value) {
				return JSON.stringify(value);
			},
			output(value) {
				if (!value) return null;
				return parseJSON(value);
			}
		}
	}
} } });
const defaultKeyHasher = async (key) => {
	const hash = await createHash$1("SHA-256").digest(new TextEncoder().encode(key));
	return base64Url.encode(new Uint8Array(hash), { padding: false });
};
const API_KEY_TABLE_NAME = "apikey";
function apiKey(_configurations, _options) {
	if (Array.isArray(_configurations) && _configurations.length > 0) {
		if (!_configurations.every((option) => option.configId)) throw new BetterAuthError("configId is required for each API key configuration in the api-key plugin.");
		const configIds = _configurations.map((option) => option.configId);
		if (new Set(configIds).size !== configIds.length) throw new BetterAuthError("configId must be unique for each API key configuration in the api-key plugin.");
	}
	const options = _options ?? { schema: Array.isArray(_configurations) ? void 0 : _configurations?.schema };
	const configurations = [...(Array.isArray(_configurations) ? _configurations : [_configurations]).map((config) => ({
		...config,
		apiKeyHeaders: config?.apiKeyHeaders ?? "x-api-key",
		defaultKeyLength: config?.defaultKeyLength || 64,
		maximumPrefixLength: config?.maximumPrefixLength ?? 32,
		minimumPrefixLength: config?.minimumPrefixLength ?? 1,
		maximumNameLength: config?.maximumNameLength ?? 32,
		minimumNameLength: config?.minimumNameLength ?? 1,
		enableMetadata: config?.enableMetadata ?? false,
		disableKeyHashing: config?.disableKeyHashing ?? false,
		requireName: config?.requireName ?? false,
		storage: config?.storage ?? "database",
		rateLimit: {
			enabled: config?.rateLimit?.enabled === void 0 ? true : config?.rateLimit?.enabled,
			timeWindow: config?.rateLimit?.timeWindow ?? 1e3 * 60 * 60 * 24,
			maxRequests: config?.rateLimit?.maxRequests ?? 10
		},
		keyExpiration: {
			defaultExpiresIn: config?.keyExpiration?.defaultExpiresIn ?? null,
			disableCustomExpiresTime: config?.keyExpiration?.disableCustomExpiresTime ?? false,
			maxExpiresIn: config?.keyExpiration?.maxExpiresIn ?? 365,
			minExpiresIn: config?.keyExpiration?.minExpiresIn ?? 1
		},
		startingCharactersConfig: {
			shouldStore: config?.startingCharactersConfig?.shouldStore ?? true,
			charactersLength: config?.startingCharactersConfig?.charactersLength ?? 6
		},
		enableSessionForAPIKeys: config?.enableSessionForAPIKeys ?? false,
		fallbackToDatabase: config?.fallbackToDatabase ?? false,
		customStorage: config?.customStorage,
		deferUpdates: config?.deferUpdates ?? false
	}))];
	const schema$1 = mergeSchema(apiKeySchema({
		defaultRateLimitMax: (configurations.length === 1 ? configurations[0]?.rateLimit.maxRequests : void 0) ?? 10,
		defaultTimeWindow: (configurations.length === 1 ? configurations[0]?.rateLimit.timeWindow : void 0) ?? 1e3 * 60 * 60 * 24
	}), options.schema);
	const defaultKeyGenerator = async (opts) => {
		const key = generateRandomString(opts.length, "a-z", "A-Z");
		return `${opts.prefix || ""}${key}`;
	};
	function getApiKeyFromConfig(ctx, config) {
		if (config.customAPIKeyGetter) return config.customAPIKeyGetter(ctx);
		if (Array.isArray(config.apiKeyHeaders)) {
			for (const header of config.apiKeyHeaders) {
				const value = ctx.headers?.get(header);
				if (value) return value;
			}
			return null;
		}
		return ctx.headers?.get(config.apiKeyHeaders) ?? null;
	}
	function findApiKeyAndConfig(ctx) {
		for (const config of configurations) {
			if (!config.enableSessionForAPIKeys) continue;
			const key = getApiKeyFromConfig(ctx, config);
			if (key) return {
				key,
				config
			};
		}
		return null;
	}
	const routes = createApiKeyRoutes({
		defaultKeyGenerator,
		configurations,
		schema: schema$1
	});
	return {
		id: "api-key",
		version: PACKAGE_VERSION,
		$ERROR_CODES: API_KEY_ERROR_CODES,
		hooks: { before: [{
			matcher: (ctx) => !!findApiKeyAndConfig(ctx),
			handler: createAuthMiddleware(async (ctx) => {
				const { key, config } = findApiKeyAndConfig(ctx);
				if (typeof key !== "string") throw APIError$1.from("BAD_REQUEST", API_KEY_ERROR_CODES.INVALID_API_KEY_GETTER_RETURN_TYPE);
				if (key.length < config.defaultKeyLength) throw APIError$1.from("FORBIDDEN", API_KEY_ERROR_CODES.INVALID_API_KEY);
				if (config.customAPIKeyValidator) {
					if (!await config.customAPIKeyValidator({
						ctx,
						key
					})) throw APIError$1.from("FORBIDDEN", API_KEY_ERROR_CODES.INVALID_API_KEY);
				}
				const { apiKey: apiKey$1 } = await validateApiKey({
					key,
					ctx,
					lookupOpts: config,
					configurations,
					schema: schema$1,
					expectedConfigId: config.configId
				});
				const cleanupTask = deleteAllExpiredApiKeys(ctx.context).catch((err) => {
					ctx.context.logger.error("Failed to delete expired API keys:", err);
				});
				if (config.deferUpdates) ctx.context.runInBackground(cleanupTask);
				if ((config.references ?? "user") !== "user") {
					const msg = API_KEY_ERROR_CODES.INVALID_REFERENCE_ID_FROM_API_KEY;
					throw APIError$1.from("UNAUTHORIZED", msg);
				}
				const user = await ctx.context.internalAdapter.findUserById(apiKey$1.referenceId);
				if (!user) {
					const msg = API_KEY_ERROR_CODES.INVALID_REFERENCE_ID_FROM_API_KEY;
					throw APIError$1.from("UNAUTHORIZED", msg);
				}
				const session = {
					user,
					session: {
						id: apiKey$1.id,
						token: key,
						userId: apiKey$1.referenceId,
						userAgent: ctx.request?.headers.get("user-agent") ?? null,
						ipAddress: ctx.request ? getIp(ctx.request, ctx.context.options) : null,
						createdAt: /* @__PURE__ */ new Date(),
						updatedAt: /* @__PURE__ */ new Date(),
						expiresAt: apiKey$1.expiresAt || getDate(ctx.context.options.session?.expiresIn || 3600 * 24 * 7, "ms")
					}
				};
				ctx.context.session = session;
				if (ctx.path === "/get-session") return session;
				else return { context: ctx };
			})
		}] },
		endpoints: {
			createApiKey: routes.createApiKey,
			verifyApiKey: routes.verifyApiKey,
			getApiKey: routes.getApiKey,
			updateApiKey: routes.updateApiKey,
			deleteApiKey: routes.deleteApiKey,
			listApiKeys: routes.listApiKeys,
			deleteAllExpiredApiKeys: routes.deleteAllExpiredApiKeys
		},
		schema: schema$1
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+core@0.3.13_zod@4.3.6/node_modules/@dodopayments/core/dist/chunk-BEVRRP4F.js
var metadataSchema = z$2.record(z$2.any());
var customerLimitedDetailsSchema = z$2.object({
	customer_id: z$2.string(),
	email: z$2.string(),
	name: z$2.string(),
	metadata: metadataSchema.optional(),
	phone_number: z$2.string().nullable().optional()
});
var billingAddressSchema = z$2.object({
	city: z$2.string().nullable(),
	country: z$2.string(),
	state: z$2.string().nullable(),
	street: z$2.string().nullable(),
	zipcode: z$2.string().nullable()
});
var customFieldResponseSchema = z$2.object({
	key: z$2.string(),
	value: z$2.string()
});
var discountTypeSchema = z$2.enum(["percentage"]);
var discountDetailSchema = z$2.object({
	amount: z$2.number(),
	business_id: z$2.string(),
	code: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	discount_id: z$2.string(),
	metadata: metadataSchema,
	position: z$2.number(),
	preserve_on_plan_change: z$2.boolean(),
	restricted_to: z$2.array(z$2.string()),
	times_used: z$2.number(),
	type: discountTypeSchema,
	cycles_remaining: z$2.number().nullable().optional(),
	expires_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	name: z$2.string().nullable().optional(),
	subscription_cycles: z$2.number().nullable().optional(),
	usage_limit: z$2.number().nullable().optional()
});
var disputeStageSchema = z$2.enum([
	"pre_dispute",
	"dispute",
	"pre_arbitration"
]);
var disputeStatusSchema = z$2.enum([
	"dispute_opened",
	"dispute_expired",
	"dispute_accepted",
	"dispute_cancelled",
	"dispute_challenged",
	"dispute_won",
	"dispute_lost"
]);
var refundStatusSchema = z$2.enum([
	"succeeded",
	"failed",
	"pending",
	"review"
]);
var intentStatusSchema = z$2.enum([
	"succeeded",
	"failed",
	"cancelled",
	"processing",
	"requires_customer_action",
	"requires_merchant_action",
	"requires_payment_method",
	"requires_confirmation",
	"requires_capture",
	"partially_captured",
	"partially_captured_and_capturable"
]);
var paymentProviderSchema = z$2.enum([
	"stripe",
	"adyen",
	"dodo"
]);
var timeIntervalSchema = z$2.enum([
	"Day",
	"Week",
	"Month",
	"Year"
]);
var refundListItemSchema = z$2.object({
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	is_partial: z$2.boolean(),
	payment_id: z$2.string(),
	refund_id: z$2.string(),
	status: refundStatusSchema,
	amount: z$2.number().nullable().optional(),
	currency: z$2.string().nullable().optional(),
	reason: z$2.string().nullable().optional()
});
var disputeSchema = z$2.object({
	amount: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	currency: z$2.string(),
	dispute_id: z$2.string(),
	dispute_stage: disputeStageSchema,
	dispute_status: disputeStatusSchema,
	payment_id: z$2.string(),
	is_resolved_by_rdr: z$2.boolean().nullable().optional(),
	remarks: z$2.string().nullable().optional()
});
var getDisputeSchema = z$2.object({
	amount: z$2.string(),
	brand_id: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	currency: z$2.string(),
	customer: customerLimitedDetailsSchema,
	dispute_id: z$2.string(),
	dispute_stage: disputeStageSchema,
	dispute_status: disputeStatusSchema,
	payment_id: z$2.string(),
	payment_provider: paymentProviderSchema,
	is_resolved_by_rdr: z$2.boolean().nullable().optional(),
	reason: z$2.string().nullable().optional(),
	remarks: z$2.string().nullable().optional()
});
var PaymentSchema = z$2.object({
	payload_type: z$2.literal("Payment"),
	billing: billingAddressSchema,
	brand_id: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	currency: z$2.string(),
	customer: customerLimitedDetailsSchema,
	digital_products_delivered: z$2.boolean(),
	disputes: z$2.array(disputeSchema),
	is_update_payment_method: z$2.boolean(),
	metadata: metadataSchema,
	payment_id: z$2.string(),
	payment_provider: paymentProviderSchema,
	refunds: z$2.array(refundListItemSchema),
	retry_attempt: z$2.number(),
	settlement_amount: z$2.number(),
	settlement_currency: z$2.string(),
	total_amount: z$2.number(),
	card_holder_name: z$2.string().nullable().optional(),
	card_issuing_country: z$2.string().nullable().optional(),
	card_last_four: z$2.string().nullable().optional(),
	card_network: z$2.string().nullable().optional(),
	card_type: z$2.string().nullable().optional(),
	checkout_session_id: z$2.string().nullable().optional(),
	custom_field_responses: z$2.array(customFieldResponseSchema).nullable().optional(),
	discount_id: z$2.string().nullable().optional(),
	discounts: z$2.array(discountDetailSchema).nullable().optional(),
	error_code: z$2.string().nullable().optional(),
	error_message: z$2.string().nullable().optional(),
	invoice_id: z$2.string().nullable().optional(),
	invoice_url: z$2.string().nullable().optional(),
	payment_link: z$2.string().nullable().optional(),
	payment_method: z$2.string().nullable().optional(),
	payment_method_id: z$2.string().nullable().optional(),
	payment_method_type: z$2.string().nullable().optional(),
	product_cart: z$2.array(z$2.object({
		product_id: z$2.string(),
		quantity: z$2.number()
	})).nullable().optional(),
	refund_status: z$2.enum(["partial", "full"]).nullable().optional(),
	settlement_tax: z$2.number().nullable().optional(),
	status: intentStatusSchema.nullable().optional(),
	subscription_id: z$2.string().nullable().optional(),
	tax: z$2.number().nullable().optional(),
	updated_at: z$2.string().transform((d) => new Date(d)).nullable().optional()
});
var cbbOverageBehaviorSchema = z$2.enum([
	"forgive_at_reset",
	"invoice_at_billing",
	"carry_deficit",
	"carry_deficit_auto_repay"
]);
var subscriptionStatusSchema = z$2.enum([
	"pending",
	"active",
	"on_hold",
	"cancelled",
	"failed",
	"expired"
]);
var cancellationFeedbackSchema = z$2.enum([
	"too_expensive",
	"missing_features",
	"switched_service",
	"unused",
	"customer_service",
	"low_quality",
	"too_complex",
	"other"
]);
var creditEntitlementCartResponseSchema = z$2.object({
	credit_entitlement_id: z$2.string(),
	credit_entitlement_name: z$2.string(),
	credits_amount: z$2.string(),
	overage_balance: z$2.string(),
	overage_behavior: cbbOverageBehaviorSchema,
	overage_enabled: z$2.boolean(),
	product_id: z$2.string(),
	remaining_balance: z$2.string(),
	rollover_enabled: z$2.boolean(),
	unit: z$2.string(),
	expires_after_days: z$2.number().nullable().optional(),
	low_balance_threshold_percent: z$2.number().nullable().optional(),
	max_rollover_count: z$2.number().nullable().optional(),
	overage_limit: z$2.string().nullable().optional(),
	rollover_percentage: z$2.number().nullable().optional(),
	rollover_timeframe_count: z$2.number().nullable().optional(),
	rollover_timeframe_interval: timeIntervalSchema.nullable().optional()
});
var meterCreditEntitlementCartResponseSchema = z$2.object({
	credit_entitlement_id: z$2.string(),
	meter_id: z$2.string(),
	meter_name: z$2.string(),
	meter_units_per_credit: z$2.string(),
	product_id: z$2.string()
});
var meterCartResponseItemSchema = z$2.object({
	currency: z$2.string(),
	free_threshold: z$2.number(),
	measurement_unit: z$2.string(),
	meter_id: z$2.string(),
	name: z$2.string(),
	description: z$2.string().nullable().optional(),
	price_per_unit: z$2.string().nullable().optional()
});
var scheduledPlanChangeSchema = z$2.object({
	id: z$2.string(),
	addons: z$2.array(z$2.object({
		addon_id: z$2.string(),
		name: z$2.string(),
		quantity: z$2.number()
	})),
	created_at: z$2.string().transform((d) => new Date(d)),
	effective_at: z$2.string().transform((d) => new Date(d)),
	product_id: z$2.string(),
	quantity: z$2.number(),
	product_description: z$2.string().nullable().optional(),
	product_name: z$2.string().nullable().optional()
});
var SubscriptionSchema = z$2.object({
	payload_type: z$2.literal("Subscription"),
	addons: z$2.array(z$2.object({
		addon_id: z$2.string(),
		quantity: z$2.number()
	})),
	billing: billingAddressSchema,
	brand_id: z$2.string(),
	cancel_at_next_billing_date: z$2.boolean(),
	created_at: z$2.string().transform((d) => new Date(d)),
	credit_entitlement_cart: z$2.array(creditEntitlementCartResponseSchema),
	currency: z$2.string(),
	customer: customerLimitedDetailsSchema,
	metadata: metadataSchema,
	meter_credit_entitlement_cart: z$2.array(meterCreditEntitlementCartResponseSchema),
	meters: z$2.array(meterCartResponseItemSchema),
	next_billing_date: z$2.string().transform((d) => new Date(d)),
	on_demand: z$2.boolean(),
	payment_frequency_count: z$2.number(),
	payment_frequency_interval: timeIntervalSchema,
	previous_billing_date: z$2.string().transform((d) => new Date(d)),
	product_id: z$2.string(),
	quantity: z$2.number(),
	recurring_pre_tax_amount: z$2.number(),
	status: subscriptionStatusSchema,
	subscription_id: z$2.string(),
	subscription_period_count: z$2.number(),
	subscription_period_interval: timeIntervalSchema,
	tax_inclusive: z$2.boolean(),
	trial_period_days: z$2.number(),
	cancellation_comment: z$2.string().nullable().optional(),
	cancellation_feedback: cancellationFeedbackSchema.nullable().optional(),
	cancelled_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	custom_field_responses: z$2.array(customFieldResponseSchema).nullable().optional(),
	customer_business_name: z$2.string().nullable().optional(),
	discount_cycles_remaining: z$2.number().nullable().optional(),
	discount_id: z$2.string().nullable().optional(),
	discounts: z$2.array(discountDetailSchema).nullable().optional(),
	expires_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	payment_method_id: z$2.string().nullable().optional(),
	scheduled_change: scheduledPlanChangeSchema.nullable().optional(),
	tax_id: z$2.string().nullable().optional()
});
var RefundSchema = z$2.object({
	payload_type: z$2.literal("Refund"),
	brand_id: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	customer: customerLimitedDetailsSchema,
	is_partial: z$2.boolean(),
	metadata: metadataSchema,
	payment_id: z$2.string(),
	refund_id: z$2.string(),
	status: refundStatusSchema,
	amount: z$2.number().nullable().optional(),
	currency: z$2.string().nullable().optional(),
	reason: z$2.string().nullable().optional()
});
var DisputeSchema = getDisputeSchema.extend({ payload_type: z$2.literal("Dispute") });
var licenseKeyStatusSchema = z$2.enum([
	"active",
	"expired",
	"disabled"
]);
var LicenseKeySchema = z$2.object({
	payload_type: z$2.literal("LicenseKey"),
	id: z$2.string(),
	brand_id: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	customer_id: z$2.string(),
	instances_count: z$2.number(),
	key: z$2.string(),
	product_id: z$2.string(),
	source: z$2.enum([
		"auto",
		"import",
		"manual"
	]),
	status: licenseKeyStatusSchema,
	activations_limit: z$2.number().nullable().optional(),
	expires_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	payment_id: z$2.string().nullable().optional(),
	subscription_id: z$2.string().nullable().optional()
});
var PaymentSucceededPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payment.succeeded"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: PaymentSchema
});
var PaymentFailedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payment.failed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: PaymentSchema
});
var PaymentProcessingPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payment.processing"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: PaymentSchema
});
var PaymentCancelledPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payment.cancelled"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: PaymentSchema
});
var RefundSucceededPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("refund.succeeded"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: RefundSchema
});
var RefundFailedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("refund.failed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: RefundSchema
});
var DisputeOpenedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.opened"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var DisputeExpiredPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.expired"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var DisputeAcceptedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.accepted"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var DisputeCancelledPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.cancelled"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var DisputeChallengedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.challenged"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var DisputeWonPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.won"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var DisputeLostPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dispute.lost"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DisputeSchema
});
var SubscriptionActivePayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.active"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionOnHoldPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.on_hold"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionRenewedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.renewed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionPlanChangedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.plan_changed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionCancelledPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.cancelled"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionFailedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.failed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionExpiredPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.expired"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionUpdatedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.updated"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionPausedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.paused"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var SubscriptionUpdatePaymentMethodPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("subscription.update_payment_method"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: SubscriptionSchema
});
var LicenseKeyCreatedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("license_key.created"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: LicenseKeySchema
});
var CreditLedgerEntrySchema = z$2.object({
	payload_type: z$2.literal("CreditLedgerEntry"),
	id: z$2.string(),
	amount: z$2.string(),
	balance_after: z$2.string(),
	balance_before: z$2.string(),
	brand_id: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	credit_entitlement_id: z$2.string(),
	customer_id: z$2.string(),
	is_credit: z$2.boolean(),
	metadata: metadataSchema,
	overage_after: z$2.string(),
	overage_before: z$2.string(),
	transaction_type: z$2.enum([
		"credit_added",
		"credit_deducted",
		"credit_expired",
		"credit_rolled_over",
		"rollover_forfeited",
		"overage_charged",
		"overage_reset",
		"auto_top_up",
		"manual_adjustment",
		"refund"
	]),
	description: z$2.string().nullable().optional(),
	grant_id: z$2.string().nullable().optional(),
	reference_id: z$2.string().nullable().optional(),
	reference_type: z$2.string().nullable().optional()
});
var CreditBalanceLowSchema = z$2.object({
	payload_type: z$2.literal("CreditBalanceLow"),
	available_balance: z$2.string(),
	brand_id: z$2.string(),
	credit_entitlement_id: z$2.string(),
	credit_entitlement_name: z$2.string(),
	customer_id: z$2.string(),
	subscription_credits_amount: z$2.string(),
	subscription_id: z$2.string(),
	threshold_amount: z$2.string(),
	threshold_percent: z$2.number()
});
var CreditAddedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.added"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditDeductedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.deducted"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditExpiredPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.expired"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditRolledOverPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.rolled_over"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditRolloverForfeitedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.rollover_forfeited"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditOverageChargedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.overage_charged"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditManualAdjustmentPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.manual_adjustment"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var CreditBalanceLowPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.balance_low"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditBalanceLowSchema
});
var AbandonedCheckoutSchema = z$2.object({
	payload_type: z$2.literal("AbandonedCheckout"),
	abandoned_at: z$2.string().transform((d) => new Date(d)),
	abandonment_reason: z$2.enum(["payment_failed", "checkout_incomplete"]),
	brand_id: z$2.string(),
	customer_id: z$2.string(),
	payment_id: z$2.string(),
	status: z$2.enum([
		"abandoned",
		"recovering",
		"recovered",
		"exhausted",
		"opted_out"
	]),
	recovered_payment_id: z$2.string().nullable().optional()
});
var DunningAttemptSchema = z$2.object({
	payload_type: z$2.literal("DunningAttempt"),
	brand_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	customer_id: z$2.string(),
	status: z$2.enum([
		"recovering",
		"recovered",
		"exhausted"
	]),
	subscription_id: z$2.string(),
	trigger_state: z$2.enum(["on_hold", "cancelled"]),
	payment_id: z$2.string().nullable().optional()
});
var AbandonedCheckoutDetectedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("abandoned_checkout.detected"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: AbandonedCheckoutSchema
});
var AbandonedCheckoutRecoveredPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("abandoned_checkout.recovered"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: AbandonedCheckoutSchema
});
var DunningStartedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dunning.started"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DunningAttemptSchema
});
var DunningRecoveredPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("dunning.recovered"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: DunningAttemptSchema
});
var CreditOverageResetPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("credit.overage_reset"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: CreditLedgerEntrySchema
});
var entitlementIntegrationTypeSchema = z$2.enum([
	"discord",
	"telegram",
	"github",
	"figma",
	"framer",
	"notion",
	"digital_files",
	"license_key",
	"feature_flag"
]);
var featureTypeSchema = z$2.enum(["boolean"]);
var entitlementFeatureSchema = z$2.object({
	feature_id: z$2.string(),
	feature_type: featureTypeSchema
});
var licenseKeyGrantSchema = z$2.object({
	activations_used: z$2.number(),
	key: z$2.string(),
	activations_limit: z$2.number().nullable().optional(),
	expires_at: z$2.string().transform((d) => new Date(d)).nullable().optional()
});
var digitalProductDeliveryFileSchema = z$2.object({
	download_url: z$2.string(),
	expires_in: z$2.number(),
	file_id: z$2.string(),
	filename: z$2.string(),
	content_type: z$2.string().nullable().optional(),
	file_size: z$2.number().nullable().optional()
});
var digitalProductDeliverySchema = z$2.object({
	files: z$2.array(digitalProductDeliveryFileSchema),
	external_url: z$2.string().nullable().optional(),
	instructions: z$2.string().nullable().optional()
});
var EntitlementGrantSchema = z$2.object({
	payload_type: z$2.literal("EntitlementGrant"),
	id: z$2.string(),
	brand_id: z$2.string(),
	business_id: z$2.string(),
	created_at: z$2.string().transform((d) => new Date(d)),
	customer_id: z$2.string(),
	entitlement_id: z$2.string(),
	integration_type: entitlementIntegrationTypeSchema,
	metadata: metadataSchema,
	status: z$2.enum([
		"Pending",
		"Delivered",
		"Failed",
		"Revoked"
	]),
	updated_at: z$2.string().transform((d) => new Date(d)),
	delivered_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	digital_product_delivery: digitalProductDeliverySchema.nullable().optional(),
	error_code: z$2.string().nullable().optional(),
	error_message: z$2.string().nullable().optional(),
	feature: entitlementFeatureSchema.nullable().optional(),
	license_key: licenseKeyGrantSchema.nullable().optional(),
	oauth_expires_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	oauth_url: z$2.string().nullable().optional(),
	payment_id: z$2.string().nullable().optional(),
	revocation_reason: z$2.string().nullable().optional(),
	revoked_at: z$2.string().transform((d) => new Date(d)).nullable().optional(),
	subscription_id: z$2.string().nullable().optional()
});
var EntitlementGrantCreatedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("entitlement_grant.created"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: EntitlementGrantSchema
});
var EntitlementGrantDeliveredPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("entitlement_grant.delivered"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: EntitlementGrantSchema
});
var EntitlementGrantFailedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("entitlement_grant.failed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: EntitlementGrantSchema
});
var EntitlementGrantRevokedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("entitlement_grant.revoked"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: EntitlementGrantSchema
});
var payoutEventDataSchema = z$2.record(z$2.any());
var PayoutNotInitiatedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payout.not_initiated"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: payoutEventDataSchema
});
var PayoutOnHoldPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payout.on_hold"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: payoutEventDataSchema
});
var PayoutInProgressPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payout.in_progress"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: payoutEventDataSchema
});
var PayoutFailedPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payout.failed"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: payoutEventDataSchema
});
var PayoutSuccessPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.literal("payout.success"),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: payoutEventDataSchema
});
var KNOWN_WEBHOOK_EVENT_TYPES = [
	"payment.succeeded",
	"payment.failed",
	"payment.processing",
	"payment.cancelled",
	"refund.succeeded",
	"refund.failed",
	"dispute.opened",
	"dispute.expired",
	"dispute.accepted",
	"dispute.cancelled",
	"dispute.challenged",
	"dispute.won",
	"dispute.lost",
	"subscription.active",
	"subscription.on_hold",
	"subscription.renewed",
	"subscription.plan_changed",
	"subscription.cancelled",
	"subscription.failed",
	"subscription.expired",
	"subscription.updated",
	"subscription.paused",
	"subscription.update_payment_method",
	"license_key.created",
	"abandoned_checkout.detected",
	"abandoned_checkout.recovered",
	"dunning.started",
	"dunning.recovered",
	"credit.added",
	"credit.deducted",
	"credit.expired",
	"credit.rolled_over",
	"credit.rollover_forfeited",
	"credit.overage_charged",
	"credit.overage_reset",
	"credit.manual_adjustment",
	"credit.balance_low",
	"entitlement_grant.created",
	"entitlement_grant.delivered",
	"entitlement_grant.failed",
	"entitlement_grant.revoked",
	"payout.not_initiated",
	"payout.on_hold",
	"payout.in_progress",
	"payout.failed",
	"payout.success"
];
var UnknownWebhookPayloadSchema = z$2.object({
	business_id: z$2.string(),
	type: z$2.string().refine((t) => !KNOWN_WEBHOOK_EVENT_TYPES.includes(t), { message: "handled by a specific schema" }),
	timestamp: z$2.string().transform((d) => new Date(d)),
	data: z$2.record(z$2.any())
});
var KnownWebhookPayloadSchema = z$2.discriminatedUnion("type", [
	PaymentSucceededPayloadSchema,
	PaymentFailedPayloadSchema,
	PaymentProcessingPayloadSchema,
	PaymentCancelledPayloadSchema,
	RefundSucceededPayloadSchema,
	RefundFailedPayloadSchema,
	DisputeOpenedPayloadSchema,
	DisputeExpiredPayloadSchema,
	DisputeAcceptedPayloadSchema,
	DisputeCancelledPayloadSchema,
	DisputeChallengedPayloadSchema,
	DisputeWonPayloadSchema,
	DisputeLostPayloadSchema,
	SubscriptionActivePayloadSchema,
	SubscriptionOnHoldPayloadSchema,
	SubscriptionRenewedPayloadSchema,
	SubscriptionPlanChangedPayloadSchema,
	SubscriptionCancelledPayloadSchema,
	SubscriptionFailedPayloadSchema,
	SubscriptionExpiredPayloadSchema,
	SubscriptionUpdatedPayloadSchema,
	SubscriptionPausedPayloadSchema,
	SubscriptionUpdatePaymentMethodPayloadSchema,
	LicenseKeyCreatedPayloadSchema,
	AbandonedCheckoutDetectedPayloadSchema,
	AbandonedCheckoutRecoveredPayloadSchema,
	DunningStartedPayloadSchema,
	DunningRecoveredPayloadSchema,
	CreditAddedPayloadSchema,
	CreditDeductedPayloadSchema,
	CreditExpiredPayloadSchema,
	CreditRolledOverPayloadSchema,
	CreditRolloverForfeitedPayloadSchema,
	CreditOverageChargedPayloadSchema,
	CreditOverageResetPayloadSchema,
	CreditManualAdjustmentPayloadSchema,
	CreditBalanceLowPayloadSchema,
	EntitlementGrantCreatedPayloadSchema,
	EntitlementGrantDeliveredPayloadSchema,
	EntitlementGrantFailedPayloadSchema,
	EntitlementGrantRevokedPayloadSchema,
	PayoutNotInitiatedPayloadSchema,
	PayoutOnHoldPayloadSchema,
	PayoutInProgressPayloadSchema,
	PayoutFailedPayloadSchema,
	PayoutSuccessPayloadSchema
]);
var WebhookPayloadSchema = z$2.union([KnownWebhookPayloadSchema, UnknownWebhookPayloadSchema]);

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+core@0.3.13_zod@4.3.6/node_modules/@dodopayments/core/dist/chunk-B5Z4XRMO.js
function assert(expr, msg = "") {
	if (!expr) throw new Error(msg);
}
function timingSafeEqual(a, b) {
	if (a.byteLength !== b.byteLength) return false;
	if (!(a instanceof DataView)) a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
	if (!(b instanceof DataView)) b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
	assert(a instanceof DataView);
	assert(b instanceof DataView);
	const length = a.byteLength;
	let out = 0;
	let i = -1;
	while (++i < length) out |= a.getUint8(i) ^ b.getUint8(i);
	return out === 0;
}

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+core@0.3.13_zod@4.3.6/node_modules/@dodopayments/core/dist/chunk-7D4SUZUM.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require2() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+core@0.3.13_zod@4.3.6/node_modules/@dodopayments/core/dist/chunk-65ICCAWN.js
var require_base64$1 = __commonJS({ "../../node_modules/@stablelib/base64/lib/base64.js"(exports$1) {
	"use strict";
	var __extends = exports$1 && exports$1.__extends || /* @__PURE__ */ function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
				d2.__proto__ = b2;
			} || function(d2, b2) {
				for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	}();
	Object.defineProperty(exports$1, "__esModule", { value: true });
	var INVALID_BYTE = 256;
	var Coder = function() {
		function Coder2(_paddingCharacter) {
			if (_paddingCharacter === void 0) _paddingCharacter = "=";
			this._paddingCharacter = _paddingCharacter;
		}
		Coder2.prototype.encodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 8 + 5) / 6 | 0;
			return (length + 2) / 3 * 4 | 0;
		};
		Coder2.prototype.encode = function(data) {
			var out = "";
			var i = 0;
			for (; i < data.length - 2; i += 3) {
				var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
				out += this._encodeByte(c >>> 18 & 63);
				out += this._encodeByte(c >>> 12 & 63);
				out += this._encodeByte(c >>> 6 & 63);
				out += this._encodeByte(c >>> 0 & 63);
			}
			var left = data.length - i;
			if (left > 0) {
				var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
				out += this._encodeByte(c >>> 18 & 63);
				out += this._encodeByte(c >>> 12 & 63);
				if (left === 2) out += this._encodeByte(c >>> 6 & 63);
				else out += this._paddingCharacter || "";
				out += this._paddingCharacter || "";
			}
			return out;
		};
		Coder2.prototype.maxDecodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 6 + 7) / 8 | 0;
			return length / 4 * 3 | 0;
		};
		Coder2.prototype.decodedLength = function(s) {
			return this.maxDecodedLength(s.length - this._getPaddingLength(s));
		};
		Coder2.prototype.decode = function(s) {
			if (s.length === 0) return new Uint8Array(0);
			var paddingLength = this._getPaddingLength(s);
			var length = s.length - paddingLength;
			var out = new Uint8Array(this.maxDecodedLength(length));
			var op = 0;
			var i = 0;
			var haveBad = 0;
			var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
			for (; i < length - 4; i += 4) {
				v0 = this._decodeChar(s.charCodeAt(i + 0));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v0 << 2 | v1 >>> 4;
				out[op++] = v1 << 4 | v2 >>> 2;
				out[op++] = v2 << 6 | v3;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
				haveBad |= v2 & INVALID_BYTE;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (i < length - 1) {
				v0 = this._decodeChar(s.charCodeAt(i));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				out[op++] = v0 << 2 | v1 >>> 4;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
			}
			if (i < length - 2) {
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				out[op++] = v1 << 4 | v2 >>> 2;
				haveBad |= v2 & INVALID_BYTE;
			}
			if (i < length - 3) {
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v2 << 6 | v3;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (haveBad !== 0) throw new Error("Base64Coder: incorrect characters for decoding");
			return out;
		};
		Coder2.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -15;
			result += 62 - b >>> 8 & 3;
			return String.fromCharCode(result);
		};
		Coder2.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
			result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		Coder2.prototype._getPaddingLength = function(s) {
			var paddingLength = 0;
			if (this._paddingCharacter) {
				for (var i = s.length - 1; i >= 0; i--) {
					if (s[i] !== this._paddingCharacter) break;
					paddingLength++;
				}
				if (s.length < 4 || paddingLength > 2) throw new Error("Base64Coder: incorrect padding");
			}
			return paddingLength;
		};
		return Coder2;
	}();
	exports$1.Coder = Coder;
	var stdCoder = new Coder();
	function encode2(data) {
		return stdCoder.encode(data);
	}
	exports$1.encode = encode2;
	function decode2(s) {
		return stdCoder.decode(s);
	}
	exports$1.decode = decode2;
	var URLSafeCoder = function(_super) {
		__extends(URLSafeCoder2, _super);
		function URLSafeCoder2() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		URLSafeCoder2.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -13;
			result += 62 - b >>> 8 & 49;
			return String.fromCharCode(result);
		};
		URLSafeCoder2.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
			result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		return URLSafeCoder2;
	}(Coder);
	exports$1.URLSafeCoder = URLSafeCoder;
	var urlSafeCoder = new URLSafeCoder();
	function encodeURLSafe(data) {
		return urlSafeCoder.encode(data);
	}
	exports$1.encodeURLSafe = encodeURLSafe;
	function decodeURLSafe(s) {
		return urlSafeCoder.decode(s);
	}
	exports$1.decodeURLSafe = decodeURLSafe;
	exports$1.encodedLength = function(length) {
		return stdCoder.encodedLength(length);
	};
	exports$1.maxDecodedLength = function(length) {
		return stdCoder.maxDecodedLength(length);
	};
	exports$1.decodedLength = function(s) {
		return stdCoder.decodedLength(s);
	};
} });
var require_sha256$1 = __commonJS({ "../../node_modules/fast-sha256/sha256.js"(exports$1, module$1) {
	"use strict";
	(function(root, factory) {
		var exports2 = {};
		factory(exports2);
		var sha2562 = exports2["default"];
		for (var k in exports2) sha2562[k] = exports2[k];
		if (typeof module$1 === "object" && typeof module$1.exports === "object") module$1.exports = sha2562;
		else if (typeof define === "function" && define.amd) define(function() {
			return sha2562;
		});
		else root.sha256 = sha2562;
	})(exports$1, function(exports2) {
		"use strict";
		exports2.__esModule = true;
		exports2.digestLength = 32;
		exports2.blockSize = 64;
		var K = new Uint32Array([
			1116352408,
			1899447441,
			3049323471,
			3921009573,
			961987163,
			1508970993,
			2453635748,
			2870763221,
			3624381080,
			310598401,
			607225278,
			1426881987,
			1925078388,
			2162078206,
			2614888103,
			3248222580,
			3835390401,
			4022224774,
			264347078,
			604807628,
			770255983,
			1249150122,
			1555081692,
			1996064986,
			2554220882,
			2821834349,
			2952996808,
			3210313671,
			3336571891,
			3584528711,
			113926993,
			338241895,
			666307205,
			773529912,
			1294757372,
			1396182291,
			1695183700,
			1986661051,
			2177026350,
			2456956037,
			2730485921,
			2820302411,
			3259730800,
			3345764771,
			3516065817,
			3600352804,
			4094571909,
			275423344,
			430227734,
			506948616,
			659060556,
			883997877,
			958139571,
			1322822218,
			1537002063,
			1747873779,
			1955562222,
			2024104815,
			2227730452,
			2361852424,
			2428436474,
			2756734187,
			3204031479,
			3329325298
		]);
		function hashBlocks(w, v, p, pos, len) {
			var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
			while (len >= 64) {
				a = v[0];
				b = v[1];
				c = v[2];
				d = v[3];
				e = v[4];
				f = v[5];
				g = v[6];
				h = v[7];
				for (i = 0; i < 16; i++) {
					j = pos + i * 4;
					w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
				}
				for (i = 16; i < 64; i++) {
					u = w[i - 2];
					t1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
					u = w[i - 15];
					t2 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
					w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
				}
				for (i = 0; i < 64; i++) {
					t1 = (((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
					t2 = ((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + (a & b ^ a & c ^ b & c) | 0;
					h = g;
					g = f;
					f = e;
					e = d + t1 | 0;
					d = c;
					c = b;
					b = a;
					a = t1 + t2 | 0;
				}
				v[0] += a;
				v[1] += b;
				v[2] += c;
				v[3] += d;
				v[4] += e;
				v[5] += f;
				v[6] += g;
				v[7] += h;
				pos += 64;
				len -= 64;
			}
			return pos;
		}
		var Hash = function() {
			function Hash2() {
				this.digestLength = exports2.digestLength;
				this.blockSize = exports2.blockSize;
				this.state = new Int32Array(8);
				this.temp = new Int32Array(64);
				this.buffer = new Uint8Array(128);
				this.bufferLength = 0;
				this.bytesHashed = 0;
				this.finished = false;
				this.reset();
			}
			Hash2.prototype.reset = function() {
				this.state[0] = 1779033703;
				this.state[1] = 3144134277;
				this.state[2] = 1013904242;
				this.state[3] = 2773480762;
				this.state[4] = 1359893119;
				this.state[5] = 2600822924;
				this.state[6] = 528734635;
				this.state[7] = 1541459225;
				this.bufferLength = 0;
				this.bytesHashed = 0;
				this.finished = false;
				return this;
			};
			Hash2.prototype.clean = function() {
				for (var i = 0; i < this.buffer.length; i++) this.buffer[i] = 0;
				for (var i = 0; i < this.temp.length; i++) this.temp[i] = 0;
				this.reset();
			};
			Hash2.prototype.update = function(data, dataLength) {
				if (dataLength === void 0) dataLength = data.length;
				if (this.finished) throw new Error("SHA256: can't update because hash was finished.");
				var dataPos = 0;
				this.bytesHashed += dataLength;
				if (this.bufferLength > 0) {
					while (this.bufferLength < 64 && dataLength > 0) {
						this.buffer[this.bufferLength++] = data[dataPos++];
						dataLength--;
					}
					if (this.bufferLength === 64) {
						hashBlocks(this.temp, this.state, this.buffer, 0, 64);
						this.bufferLength = 0;
					}
				}
				if (dataLength >= 64) {
					dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
					dataLength %= 64;
				}
				while (dataLength > 0) {
					this.buffer[this.bufferLength++] = data[dataPos++];
					dataLength--;
				}
				return this;
			};
			Hash2.prototype.finish = function(out) {
				if (!this.finished) {
					var bytesHashed = this.bytesHashed;
					var left = this.bufferLength;
					var bitLenHi = bytesHashed / 536870912 | 0;
					var bitLenLo = bytesHashed << 3;
					var padLength = bytesHashed % 64 < 56 ? 64 : 128;
					this.buffer[left] = 128;
					for (var i = left + 1; i < padLength - 8; i++) this.buffer[i] = 0;
					this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
					this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
					this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
					this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
					this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
					this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
					this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
					this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
					hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
					this.finished = true;
				}
				for (var i = 0; i < 8; i++) {
					out[i * 4 + 0] = this.state[i] >>> 24 & 255;
					out[i * 4 + 1] = this.state[i] >>> 16 & 255;
					out[i * 4 + 2] = this.state[i] >>> 8 & 255;
					out[i * 4 + 3] = this.state[i] >>> 0 & 255;
				}
				return this;
			};
			Hash2.prototype.digest = function() {
				var out = new Uint8Array(this.digestLength);
				this.finish(out);
				return out;
			};
			Hash2.prototype._saveState = function(out) {
				for (var i = 0; i < this.state.length; i++) out[i] = this.state[i];
			};
			Hash2.prototype._restoreState = function(from, bytesHashed) {
				for (var i = 0; i < this.state.length; i++) this.state[i] = from[i];
				this.bytesHashed = bytesHashed;
				this.finished = false;
				this.bufferLength = 0;
			};
			return Hash2;
		}();
		exports2.Hash = Hash;
		var HMAC = function() {
			function HMAC2(key) {
				this.inner = new Hash();
				this.outer = new Hash();
				this.blockSize = this.inner.blockSize;
				this.digestLength = this.inner.digestLength;
				var pad = new Uint8Array(this.blockSize);
				if (key.length > this.blockSize) new Hash().update(key).finish(pad).clean();
				else for (var i = 0; i < key.length; i++) pad[i] = key[i];
				for (var i = 0; i < pad.length; i++) pad[i] ^= 54;
				this.inner.update(pad);
				for (var i = 0; i < pad.length; i++) pad[i] ^= 106;
				this.outer.update(pad);
				this.istate = new Uint32Array(8);
				this.ostate = new Uint32Array(8);
				this.inner._saveState(this.istate);
				this.outer._saveState(this.ostate);
				for (var i = 0; i < pad.length; i++) pad[i] = 0;
			}
			HMAC2.prototype.reset = function() {
				this.inner._restoreState(this.istate, this.inner.blockSize);
				this.outer._restoreState(this.ostate, this.outer.blockSize);
				return this;
			};
			HMAC2.prototype.clean = function() {
				for (var i = 0; i < this.istate.length; i++) this.ostate[i] = this.istate[i] = 0;
				this.inner.clean();
				this.outer.clean();
			};
			HMAC2.prototype.update = function(data) {
				this.inner.update(data);
				return this;
			};
			HMAC2.prototype.finish = function(out) {
				if (this.outer.finished) this.outer.finish(out);
				else {
					this.inner.finish(out);
					this.outer.update(out, this.digestLength).finish(out);
				}
				return this;
			};
			HMAC2.prototype.digest = function() {
				var out = new Uint8Array(this.digestLength);
				this.finish(out);
				return out;
			};
			return HMAC2;
		}();
		exports2.HMAC = HMAC;
		function hash(data) {
			var h = new Hash().update(data);
			var digest = h.digest();
			h.clean();
			return digest;
		}
		exports2.hash = hash;
		exports2["default"] = hash;
		function hmac2(key, data) {
			var h = new HMAC(key).update(data);
			var digest = h.digest();
			h.clean();
			return digest;
		}
		exports2.hmac = hmac2;
		function fillBuffer(buffer, hmac3, info, counter) {
			var num = counter[0];
			if (num === 0) throw new Error("hkdf: cannot expand more");
			hmac3.reset();
			if (num > 1) hmac3.update(buffer);
			if (info) hmac3.update(info);
			hmac3.update(counter);
			hmac3.finish(buffer);
			counter[0]++;
		}
		var hkdfSalt = new Uint8Array(exports2.digestLength);
		function hkdf(key, salt, info, length) {
			if (salt === void 0) salt = hkdfSalt;
			if (length === void 0) length = 32;
			var counter = new Uint8Array([1]);
			var hmac_ = new HMAC(hmac2(salt, key));
			var buffer = new Uint8Array(hmac_.digestLength);
			var bufpos = buffer.length;
			var out = new Uint8Array(length);
			for (var i = 0; i < length; i++) {
				if (bufpos === buffer.length) {
					fillBuffer(buffer, hmac_, info, counter);
					bufpos = 0;
				}
				out[i] = buffer[bufpos++];
			}
			hmac_.clean();
			buffer.fill(0);
			counter.fill(0);
			return out;
		}
		exports2.hkdf = hkdf;
		function pbkdf2(password, salt, iterations, dkLen) {
			var prf = new HMAC(password);
			var len = prf.digestLength;
			var ctr = new Uint8Array(4);
			var t = new Uint8Array(len);
			var u = new Uint8Array(len);
			var dk = new Uint8Array(dkLen);
			for (var i = 0; i * len < dkLen; i++) {
				var c = i + 1;
				ctr[0] = c >>> 24 & 255;
				ctr[1] = c >>> 16 & 255;
				ctr[2] = c >>> 8 & 255;
				ctr[3] = c >>> 0 & 255;
				prf.reset();
				prf.update(salt);
				prf.update(ctr);
				prf.finish(u);
				for (var j = 0; j < len; j++) t[j] = u[j];
				for (var j = 2; j <= iterations; j++) {
					prf.reset();
					prf.update(u).finish(u);
					for (var k = 0; k < len; k++) t[k] ^= u[k];
				}
				for (var j = 0; j < len && i * len + j < dkLen; j++) dk[i * len + j] = t[j];
			}
			for (var i = 0; i < len; i++) t[i] = u[i] = 0;
			for (var i = 0; i < 4; i++) ctr[i] = 0;
			prf.clean();
			return dk;
		}
		exports2.pbkdf2 = pbkdf2;
	});
} });
var base64 = __toESM(require_base64$1(), 1);
var sha256 = __toESM(require_sha256$1(), 1);
var WEBHOOK_TOLERANCE_IN_SECONDS = 300;
var ExtendableError = class _ExtendableError extends Error {
	constructor(message) {
		super(message);
		Object.setPrototypeOf(this, _ExtendableError.prototype);
		this.name = "ExtendableError";
		this.stack = new Error(message).stack;
	}
};
var WebhookVerificationError = class _WebhookVerificationError extends ExtendableError {
	constructor(message) {
		super(message);
		Object.setPrototypeOf(this, _WebhookVerificationError.prototype);
		this.name = "WebhookVerificationError";
	}
};
var Webhook$1 = class _Webhook {
	static prefix = "whsec_";
	key;
	constructor(secret, options) {
		if (!secret) throw new Error("Secret can't be empty.");
		if ((options == null ? void 0 : options.format) === "raw") if (secret instanceof Uint8Array) this.key = secret;
		else this.key = Uint8Array.from(secret, (c) => c.charCodeAt(0));
		else {
			if (typeof secret !== "string") throw new Error("Expected secret to be of type string");
			if (secret.startsWith(_Webhook.prefix)) secret = secret.substring(_Webhook.prefix.length);
			this.key = base64.decode(secret);
		}
	}
	verify(payload, headers_) {
		const headers = {};
		for (const key of Object.keys(headers_)) headers[key.toLowerCase()] = headers_[key];
		const msgId = headers["webhook-id"];
		const msgSignature = headers["webhook-signature"];
		const msgTimestamp = headers["webhook-timestamp"];
		if (!msgSignature || !msgId || !msgTimestamp) throw new WebhookVerificationError("Missing required headers");
		const timestamp = this.verifyTimestamp(msgTimestamp);
		const expectedSignature = this.sign(msgId, timestamp, payload).split(",")[1];
		const passedSignatures = msgSignature.split(" ");
		const encoder = new globalThis.TextEncoder();
		for (const versionedSignature of passedSignatures) {
			const [version$1, signature] = versionedSignature.split(",");
			if (version$1 !== "v1") continue;
			if (timingSafeEqual(encoder.encode(signature), encoder.encode(expectedSignature))) return JSON.parse(payload.toString());
		}
		throw new WebhookVerificationError("No matching signature found");
	}
	sign(msgId, timestamp, payload) {
		if (typeof payload === "string") {} else if (payload.constructor.name === "Buffer") payload = payload.toString();
		else throw new Error("Expected payload to be of type string or Buffer.");
		const encoder = new TextEncoder();
		const timestampNumber = Math.floor(timestamp.getTime() / 1e3);
		const toSign = encoder.encode(`${msgId}.${timestampNumber}.${payload}`);
		return `v1,${base64.encode(sha256.hmac(this.key, toSign))}`;
	}
	verifyTimestamp(timestampHeader) {
		const now = Math.floor(Date.now() / 1e3);
		const timestamp = parseInt(timestampHeader, 10);
		if (isNaN(timestamp)) throw new WebhookVerificationError("Invalid Signature Headers");
		if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) throw new WebhookVerificationError("Message timestamp too old");
		if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) throw new WebhookVerificationError("Message timestamp too new");
		return /* @__PURE__ */ new Date(timestamp * 1e3);
	}
};
/**
* The MIT License
*
* Copyright (c) 2023 Svix (https://www.svix.com)
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* @fileoverview Server-only webhook verification implementation.
* @description Vendored from standardwebhooks package to avoid bundling issues.
* Uses Node.js crypto module - DO NOT import in client/browser code.
* @license MIT
* @internal
*/

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+core@0.3.13_zod@4.3.6/node_modules/@dodopayments/core/dist/chunk-QJARQYLA.js
async function handleWebhookPayload(payload, config, context) {
	const callHandler = (handler, payload2) => {
		if (!handler) return;
		if (context !== void 0) return handler(context, payload2);
		return handler(payload2);
	};
	if (config.onPayload) await callHandler(config.onPayload, payload);
	if (payload.type === "payment.succeeded") await callHandler(config.onPaymentSucceeded, payload);
	if (payload.type === "payment.failed") await callHandler(config.onPaymentFailed, payload);
	if (payload.type === "payment.processing") await callHandler(config.onPaymentProcessing, payload);
	if (payload.type === "payment.cancelled") await callHandler(config.onPaymentCancelled, payload);
	if (payload.type === "refund.succeeded") await callHandler(config.onRefundSucceeded, payload);
	if (payload.type === "refund.failed") await callHandler(config.onRefundFailed, payload);
	if (payload.type === "dispute.opened") await callHandler(config.onDisputeOpened, payload);
	if (payload.type === "dispute.expired") await callHandler(config.onDisputeExpired, payload);
	if (payload.type === "dispute.accepted") await callHandler(config.onDisputeAccepted, payload);
	if (payload.type === "dispute.cancelled") await callHandler(config.onDisputeCancelled, payload);
	if (payload.type === "dispute.challenged") await callHandler(config.onDisputeChallenged, payload);
	if (payload.type === "dispute.won") await callHandler(config.onDisputeWon, payload);
	if (payload.type === "dispute.lost") await callHandler(config.onDisputeLost, payload);
	if (payload.type === "subscription.active") await callHandler(config.onSubscriptionActive, payload);
	if (payload.type === "subscription.on_hold") await callHandler(config.onSubscriptionOnHold, payload);
	if (payload.type === "subscription.renewed") await callHandler(config.onSubscriptionRenewed, payload);
	if (payload.type === "subscription.plan_changed") await callHandler(config.onSubscriptionPlanChanged, payload);
	if (payload.type === "subscription.cancelled") await callHandler(config.onSubscriptionCancelled, payload);
	if (payload.type === "subscription.failed") await callHandler(config.onSubscriptionFailed, payload);
	if (payload.type === "subscription.expired") await callHandler(config.onSubscriptionExpired, payload);
	if (payload.type === "subscription.updated") await callHandler(config.onSubscriptionUpdated, payload);
	if (payload.type === "subscription.paused") await callHandler(config.onSubscriptionPaused, payload);
	if (payload.type === "subscription.update_payment_method") await callHandler(config.onSubscriptionUpdatePaymentMethod, payload);
	if (payload.type === "license_key.created") await callHandler(config.onLicenseKeyCreated, payload);
	if (payload.type === "abandoned_checkout.detected") await callHandler(config.onAbandonedCheckoutDetected, payload);
	if (payload.type === "abandoned_checkout.recovered") await callHandler(config.onAbandonedCheckoutRecovered, payload);
	if (payload.type === "dunning.started") await callHandler(config.onDunningStarted, payload);
	if (payload.type === "dunning.recovered") await callHandler(config.onDunningRecovered, payload);
	if (payload.type === "credit.added") await callHandler(config.onCreditAdded, payload);
	if (payload.type === "credit.deducted") await callHandler(config.onCreditDeducted, payload);
	if (payload.type === "credit.expired") await callHandler(config.onCreditExpired, payload);
	if (payload.type === "credit.rolled_over") await callHandler(config.onCreditRolledOver, payload);
	if (payload.type === "credit.rollover_forfeited") await callHandler(config.onCreditRolloverForfeited, payload);
	if (payload.type === "credit.overage_charged") await callHandler(config.onCreditOverageCharged, payload);
	if (payload.type === "credit.overage_reset") await callHandler(config.onCreditOverageReset, payload);
	if (payload.type === "credit.manual_adjustment") await callHandler(config.onCreditManualAdjustment, payload);
	if (payload.type === "credit.balance_low") await callHandler(config.onCreditBalanceLow, payload);
	if (payload.type === "entitlement_grant.created") await callHandler(config.onEntitlementGrantCreated, payload);
	if (payload.type === "entitlement_grant.delivered") await callHandler(config.onEntitlementGrantDelivered, payload);
	if (payload.type === "entitlement_grant.failed") await callHandler(config.onEntitlementGrantFailed, payload);
	if (payload.type === "entitlement_grant.revoked") await callHandler(config.onEntitlementGrantRevoked, payload);
	if (payload.type === "payout.not_initiated") await callHandler(config.onPayoutNotInitiated, payload);
	if (payload.type === "payout.on_hold") await callHandler(config.onPayoutOnHold, payload);
	if (payload.type === "payout.in_progress") await callHandler(config.onPayoutInProgress, payload);
	if (payload.type === "payout.failed") await callHandler(config.onPayoutFailed, payload);
	if (payload.type === "payout.success") await callHandler(config.onPayoutSuccess, payload);
}
var verifyWebhookPayload = async ({ webhookKey, headers, body }) => {
	const standardWebhook = new Webhook$1(webhookKey);
	try {
		standardWebhook.verify(body, headers);
	} catch (e) {
		if (e instanceof WebhookVerificationError) throw new Error(e.message);
		throw e;
	}
	const { success, data: payload, error } = WebhookPayloadSchema.safeParse(JSON.parse(body));
	if (!success) throw new Error(error.message);
	return payload;
};

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/chunk-XXIDSJPK.js
var webhooks = (webhookOptions) => (_options) => {
	return { dodopaymentsWebhooks: createAuthEndpoint("/dodopayments/webhooks", {
		method: "POST",
		metadata: { isAction: false },
		cloneRequest: true
	}, async (ctx) => {
		const { webhookKey } = webhookOptions;
		if (!ctx.request?.body) throw new APIError$1("INTERNAL_SERVER_ERROR");
		const buf = await ctx.request.text();
		let event;
		try {
			if (!webhookKey) throw new APIError$1("INTERNAL_SERVER_ERROR", { message: "DodoPayments webhook webhookKey not found" });
			event = await verifyWebhookPayload({
				webhookKey,
				headers: {
					"webhook-id": ctx.request.headers.get("webhook-id"),
					"webhook-timestamp": ctx.request.headers.get("webhook-timestamp"),
					"webhook-signature": ctx.request.headers.get("webhook-signature")
				},
				body: buf
			});
		} catch (err) {
			if (err instanceof Error) {
				ctx.context.logger.error(`Webhook Error: ${err.message}`);
				throw new APIError$1("BAD_REQUEST", { message: `Webhook Error: ${err.message}` });
			}
			throw new APIError$1("BAD_REQUEST", { message: `Webhook Error: ${err}` });
		}
		try {
			await handleWebhookPayload(event, webhookOptions);
		} catch (e) {
			if (e instanceof Error) ctx.context.logger.error(`DodoPayments webhook failed. Error: ${e.message}`);
			ctx.context.logger.error(`DodoPayments webhook failed. Error: ${e}`);
			throw new APIError$1("BAD_REQUEST", { message: "Webhook error: See server logs for more information." });
		}
		return ctx.json({ received: true });
	}) };
};

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/chunk-527Y7FSE.js
var onUserCreate = (options) => async (user, ctx) => {
	if (ctx && options.createCustomerOnSignUp) try {
		const existingCustomer = (await options.client.customers.list({ email: user.email })).items[0];
		let customerId;
		const additionalParams = options.getCustomerParams ? await options.getCustomerParams(user) : void 0;
		if (existingCustomer) {
			await options.client.customers.update(existingCustomer.customer_id, {
				name: user.name,
				metadata: additionalParams?.metadata,
				phone_number: additionalParams?.phone_number
			});
			customerId = existingCustomer.customer_id;
		} else customerId = (await options.client.customers.create({
			email: user.email,
			name: user.name,
			metadata: additionalParams?.metadata,
			phone_number: additionalParams?.phone_number
		}, { idempotencyKey: user.id })).customer_id;
		ctx.context.internalAdapter.updateUser(user.id, { dodoCustomerId: customerId }).catch((e) => {
			ctx.context.logger.warn(`DodoPayments: failed to store dodoCustomerId for user ${user.id}. Error: ${e instanceof Error ? e.message : e}`);
		});
	} catch (e) {
		if (e instanceof Error) throw new APIError$1("INTERNAL_SERVER_ERROR", { message: `DodoPayments customer creation failed. Error: ${e.message}` });
		throw new APIError$1("INTERNAL_SERVER_ERROR", { message: `DodoPayments customer creation failed. Error: ${e}` });
	}
};
var onUserUpdate = (options) => async (user, ctx) => {
	if (ctx && options.createCustomerOnSignUp) try {
		let customerId = user.dodoCustomerId;
		if (!customerId) {
			const existingCustomer = (await options.client.customers.list({ email: user.email })).items[0];
			if (!existingCustomer) return;
			customerId = existingCustomer.customer_id;
			ctx.context.internalAdapter.updateUser(user.id, { dodoCustomerId: customerId }).catch((e) => {
				ctx.context.logger.warn(`DodoPayments: failed to backfill dodoCustomerId for user ${user.id}. Error: ${e instanceof Error ? e.message : e}`);
			});
		}
		const additionalParams = options.getCustomerParams ? await options.getCustomerParams(user) : void 0;
		await options.client.customers.update(customerId, {
			name: user.name,
			metadata: additionalParams?.metadata,
			phone_number: additionalParams?.phone_number
		});
	} catch (e) {
		if (e instanceof Error) ctx.context.logger.error(`DodoPayments customer update failed. Error: ${e.message}`);
		else ctx.context.logger.error(`DodoPayments customer update failed. Error: ${e}`);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/uuid.mjs
/**
* https://stackoverflow.com/a/2117523
*/
let uuid4 = function() {
	const { crypto: crypto$2 } = globalThis;
	if (crypto$2?.randomUUID) {
		uuid4 = crypto$2.randomUUID.bind(crypto$2);
		return crypto$2.randomUUID();
	}
	const u8 = new Uint8Array(1);
	const randomByte = crypto$2 ? () => crypto$2.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/errors.mjs
function isAbortError(err) {
	return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
const castToError = (err) => {
	if (err instanceof Error) return err;
	if (typeof err === "object" && err !== null) {
		try {
			if (Object.prototype.toString.call(err) === "[object Error]") {
				const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
				if (err.stack) error.stack = err.stack;
				if (err.cause && !error.cause) error.cause = err.cause;
				if (err.name) error.name = err.name;
				return error;
			}
		} catch {}
		try {
			return new Error(JSON.stringify(err));
		} catch {}
	}
	return new Error(err);
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/core/error.mjs
var DodoPaymentsError = class extends Error {};
var APIError = class APIError extends DodoPaymentsError {
	constructor(status, error, message, headers) {
		super(`${APIError.makeMessage(status, error, message)}`);
		this.status = status;
		this.headers = headers;
		this.error = error;
	}
	static makeMessage(status, error, message) {
		const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
		if (status && msg) return `${status} ${msg}`;
		if (status) return `${status} status code (no body)`;
		if (msg) return msg;
		return "(no status code or body)";
	}
	static generate(status, errorResponse, message, headers) {
		if (!status || !headers) return new APIConnectionError({
			message,
			cause: castToError(errorResponse)
		});
		const error = errorResponse;
		if (status === 400) return new BadRequestError(status, error, message, headers);
		if (status === 401) return new AuthenticationError(status, error, message, headers);
		if (status === 403) return new PermissionDeniedError(status, error, message, headers);
		if (status === 404) return new NotFoundError(status, error, message, headers);
		if (status === 409) return new ConflictError(status, error, message, headers);
		if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
		if (status === 429) return new RateLimitError(status, error, message, headers);
		if (status >= 500) return new InternalServerError(status, error, message, headers);
		return new APIError(status, error, message, headers);
	}
};
var APIUserAbortError = class extends APIError {
	constructor({ message } = {}) {
		super(void 0, void 0, message || "Request was aborted.", void 0);
	}
};
var APIConnectionError = class extends APIError {
	constructor({ message, cause }) {
		super(void 0, void 0, message || "Connection error.", void 0);
		if (cause) this.cause = cause;
	}
};
var APIConnectionTimeoutError = class extends APIConnectionError {
	constructor({ message } = {}) {
		super({ message: message ?? "Request timed out." });
	}
};
var BadRequestError = class extends APIError {};
var AuthenticationError = class extends APIError {};
var PermissionDeniedError = class extends APIError {};
var NotFoundError = class extends APIError {};
var ConflictError = class extends APIError {};
var UnprocessableEntityError = class extends APIError {};
var RateLimitError = class extends APIError {};
var InternalServerError = class extends APIError {};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/values.mjs
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url) => {
	return startsWithSchemeRegexp.test(url);
};
let isArray = (val) => (isArray = Array.isArray, isArray(val));
let isReadonlyArray = isArray;
/** Returns an object if the given value isn't an object, otherwise returns as-is */
function maybeObj(x) {
	if (typeof x !== "object") return {};
	return x ?? {};
}
function isEmptyObj(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
const validatePositiveInteger = (name, n) => {
	if (typeof n !== "number" || !Number.isInteger(n)) throw new DodoPaymentsError(`${name} must be an integer`);
	if (n < 0) throw new DodoPaymentsError(`${name} must be a positive integer`);
	return n;
};
const safeJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (err) {
		return;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/sleep.mjs
const sleep = (ms) => new Promise((resolve$1) => setTimeout(resolve$1, ms));

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/version.mjs
const VERSION = "2.43.0";

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/detect-platform.mjs
/**
* Note this does not detect 'browser'; for that, use getBrowserInfo().
*/
function getDetectedPlatform() {
	if (typeof Deno !== "undefined" && Deno.build != null) return "deno";
	if (typeof EdgeRuntime !== "undefined") return "edge";
	if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") return "node";
	return "unknown";
}
const getPlatformProperties = () => {
	const detectedPlatform = getDetectedPlatform();
	if (detectedPlatform === "deno") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(Deno.build.os),
		"X-Stainless-Arch": normalizeArch(Deno.build.arch),
		"X-Stainless-Runtime": "deno",
		"X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
	};
	if (typeof EdgeRuntime !== "undefined") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": `other:${EdgeRuntime}`,
		"X-Stainless-Runtime": "edge",
		"X-Stainless-Runtime-Version": globalThis.process.version
	};
	if (detectedPlatform === "node") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
		"X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
		"X-Stainless-Runtime": "node",
		"X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
	};
	const browserInfo = getBrowserInfo();
	if (browserInfo) return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": `browser:${browserInfo.browser}`,
		"X-Stainless-Runtime-Version": browserInfo.version
	};
	return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": "unknown",
		"X-Stainless-Runtime-Version": "unknown"
	};
};
function getBrowserInfo() {
	if (typeof navigator === "undefined" || !navigator) return null;
	for (const { key, pattern } of [
		{
			key: "edge",
			pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "chrome",
			pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "firefox",
			pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "safari",
			pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
		}
	]) {
		const match = pattern.exec(navigator.userAgent);
		if (match) return {
			browser: key,
			version: `${match[1] || 0}.${match[2] || 0}.${match[3] || 0}`
		};
	}
	return null;
}
const normalizeArch = (arch) => {
	if (arch === "x32") return "x32";
	if (arch === "x86_64" || arch === "x64") return "x64";
	if (arch === "arm") return "arm";
	if (arch === "aarch64" || arch === "arm64") return "arm64";
	if (arch) return `other:${arch}`;
	return "unknown";
};
const normalizePlatform = (platform) => {
	platform = platform.toLowerCase();
	if (platform.includes("ios")) return "iOS";
	if (platform === "android") return "Android";
	if (platform === "darwin") return "MacOS";
	if (platform === "win32") return "Windows";
	if (platform === "freebsd") return "FreeBSD";
	if (platform === "openbsd") return "OpenBSD";
	if (platform === "linux") return "Linux";
	if (platform) return `Other:${platform}`;
	return "Unknown";
};
let _platformHeaders;
const getPlatformHeaders = () => {
	return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/shims.mjs
function getDefaultFetch() {
	if (typeof fetch !== "undefined") return fetch;
	throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new DodoPayments({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
	const ReadableStream = globalThis.ReadableStream;
	if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
	let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
	return makeReadableStream({
		start() {},
		async pull(controller) {
			const { done, value } = await iter.next();
			if (done) controller.close();
			else controller.enqueue(value);
		},
		async cancel() {
			await iter.return?.();
		}
	});
}
/**
* Cancels a ReadableStream we don't need to consume.
* See https://undici.nodejs.org/#/?id=garbage-collection
*/
async function CancelReadableStream(stream) {
	if (stream === null || typeof stream !== "object") return;
	if (stream[Symbol.asyncIterator]) {
		await stream[Symbol.asyncIterator]().return?.();
		return;
	}
	const reader = stream.getReader();
	const cancelPromise = reader.cancel();
	reader.releaseLock();
	await cancelPromise;
}

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/request-options.mjs
const FallbackEncoder = ({ headers, body }) => {
	return {
		bodyHeaders: { "content-type": "application/json" },
		body: JSON.stringify(body)
	};
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/query.mjs
/**
* Basic re-implementation of `qs.stringify` for primitive types.
*/
function stringifyQuery(query) {
	return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
		if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		if (value === null) return `${encodeURIComponent(key)}=`;
		throw new DodoPaymentsError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
	}).join("&");
}

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/log.mjs
const levelNumbers = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
};
const parseLogLevel = (maybeLevel, sourceName, client) => {
	if (!maybeLevel) return;
	if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
	loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
};
function noop() {}
function makeLogFn(fnLevel, logger$2, logLevel) {
	if (!logger$2 || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
	else return logger$2[fnLevel].bind(logger$2);
}
const noopLogger = {
	error: noop,
	warn: noop,
	info: noop,
	debug: noop
};
let cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
	const logger$2 = client.logger;
	const logLevel = client.logLevel ?? "off";
	if (!logger$2) return noopLogger;
	const cachedLogger = cachedLoggers.get(logger$2);
	if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
	const levelLogger = {
		error: makeLogFn("error", logger$2, logLevel),
		warn: makeLogFn("warn", logger$2, logLevel),
		info: makeLogFn("info", logger$2, logLevel),
		debug: makeLogFn("debug", logger$2, logLevel)
	};
	cachedLoggers.set(logger$2, [logLevel, levelLogger]);
	return levelLogger;
}
const formatRequestDetails = (details) => {
	if (details.options) {
		details.options = { ...details.options };
		delete details.options["headers"];
	}
	if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, name.toLowerCase() === "authorization" || name.toLowerCase() === "api-key" || name.toLowerCase() === "x-api-key" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value]));
	if ("retryOfRequestLogID" in details) {
		if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
		delete details.retryOfRequestLogID;
	}
	return details;
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/parse.mjs
async function defaultParseResponse(client, props) {
	const { response, requestLogID, retryOfRequestLogID, startTime } = props;
	const body = await (async () => {
		if (response.status === 204) return null;
		if (props.options.__binaryResponse) return response;
		const mediaType = response.headers.get("content-type")?.split(";")[0]?.trim();
		if (mediaType?.includes("application/json") || mediaType?.endsWith("+json")) {
			if (response.headers.get("content-length") === "0") return;
			return await response.json();
		}
		return await response.text();
	})();
	loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
		retryOfRequestLogID,
		url: response.url,
		status: response.status,
		body,
		durationMs: Date.now() - startTime
	}));
	return body;
}

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/core/api-promise.mjs
var _APIPromise_client;
/**
* A subclass of `Promise` providing additional helper methods
* for interacting with the SDK.
*/
var APIPromise = class APIPromise extends Promise {
	constructor(client, responsePromise, parseResponse = defaultParseResponse) {
		super((resolve$1) => {
			resolve$1(null);
		});
		this.responsePromise = responsePromise;
		this.parseResponse = parseResponse;
		_APIPromise_client.set(this, void 0);
		__classPrivateFieldSet(this, _APIPromise_client, client, "f");
	}
	_thenUnwrap(transform) {
		return new APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => transform(await this.parseResponse(client, props), props));
	}
	/**
	* Gets the raw `Response` instance instead of parsing the response
	* data.
	*
	* If you want to parse the response body but still get the `Response`
	* instance, you can use {@link withResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	asResponse() {
		return this.responsePromise.then((p) => p.response);
	}
	/**
	* Gets the parsed response data and the raw `Response` instance.
	*
	* If you just want to get the raw `Response` instance without parsing it,
	* you can use {@link asResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	async withResponse() {
		const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
		return {
			data,
			response
		};
	}
	parse() {
		if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
		return this.parsedPromise;
	}
	then(onfulfilled, onrejected) {
		return this.parse().then(onfulfilled, onrejected);
	}
	catch(onrejected) {
		return this.parse().catch(onrejected);
	}
	finally(onfinally) {
		return this.parse().finally(onfinally);
	}
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/core/pagination.mjs
var _AbstractPage_client;
var AbstractPage = class {
	constructor(client, response, body, options) {
		_AbstractPage_client.set(this, void 0);
		__classPrivateFieldSet(this, _AbstractPage_client, client, "f");
		this.options = options;
		this.response = response;
		this.body = body;
	}
	hasNextPage() {
		if (!this.getPaginatedItems().length) return false;
		return this.nextPageRequestOptions() != null;
	}
	async getNextPage() {
		const nextOptions = this.nextPageRequestOptions();
		if (!nextOptions) throw new DodoPaymentsError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
		return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
	}
	async *iterPages() {
		let page = this;
		yield page;
		while (page.hasNextPage()) {
			page = await page.getNextPage();
			yield page;
		}
	}
	async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
		for await (const page of this.iterPages()) for (const item of page.getPaginatedItems()) yield item;
	}
};
/**
* This subclass of Promise will resolve to an instantiated Page once the request completes.
*
* It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
*
*    for await (const item of client.items.list()) {
*      console.log(item)
*    }
*/
var PagePromise = class extends APIPromise {
	constructor(client, request, Page) {
		super(client, request, async (client$1, props) => new Page(client$1, props.response, await defaultParseResponse(client$1, props), props.options));
	}
	/**
	* Allow auto-paginating iteration on an unawaited list call, eg:
	*
	*    for await (const item of client.items.list()) {
	*      console.log(item)
	*    }
	*/
	async *[Symbol.asyncIterator]() {
		const page = await this;
		for await (const item of page) yield item;
	}
};
var DefaultPageNumberPagination = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.items = body.items || [];
	}
	getPaginatedItems() {
		return this.items ?? [];
	}
	nextPageRequestOptions() {
		const currentPage = this.options.query?.page_number ?? 1;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				page_number: currentPage + 1
			}
		};
	}
};
var CursorPagePagination = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.iterator = body.iterator || "";
		this.done = body.done || false;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	nextPageRequestOptions() {
		const cursor = this.iterator;
		if (!cursor) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				iterator: cursor
			}
		};
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/uploads.mjs
const checkFileSupport = () => {
	if (typeof File === "undefined") {
		const { process: process$1 } = globalThis;
		const isOldNode = typeof process$1?.versions?.node === "string" && parseInt(process$1.versions.node.split(".")) < 20;
		throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
	}
};
/**
* Construct a `File` instance. This is used to ensure a helpful error is thrown
* for environments that don't define a global `File` yet.
*/
function makeFile(fileBits, fileName, options) {
	checkFileSupport();
	return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value) {
	return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
const isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/to-file.mjs
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
const isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
const isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
const isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
/**
* Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
* @param value the raw content of the file. Can be an {@link Uploadable}, BlobLikePart, or AsyncIterable of BlobLikeParts
* @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
* @param {Object=} options additional properties
* @param {string=} options.type the MIME type of the content
* @param {number=} options.lastModified the last modified timestamp
* @returns a {@link File} with the given properties
*/
async function toFile(value, name, options) {
	checkFileSupport();
	value = await value;
	if (isFileLike(value)) {
		if (value instanceof File) return value;
		return makeFile([await value.arrayBuffer()], value.name);
	}
	if (isResponseLike(value)) {
		const blob = await value.blob();
		name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
		return makeFile(await getBytes(blob), name, options);
	}
	const parts = await getBytes(value);
	name || (name = getName(value));
	if (!options?.type) {
		const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
		if (typeof type === "string") options = {
			...options,
			type
		};
	}
	return makeFile(parts, name, options);
}
async function getBytes(value) {
	let parts = [];
	if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) parts.push(value);
	else if (isBlobLike(value)) parts.push(value instanceof Blob ? value : await value.arrayBuffer());
	else if (isAsyncIterable(value)) for await (const chunk of value) parts.push(...await getBytes(chunk));
	else {
		const constructor = value?.constructor?.name;
		throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
	}
	return parts;
}
function propsForError(value) {
	if (typeof value !== "object" || value === null) return "";
	return `; props: [${Object.getOwnPropertyNames(value).map((p) => `"${p}"`).join(", ")}]`;
}

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/core/resource.mjs
var APIResource = class {
	constructor(client) {
		this._client = client;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/path.mjs
/**
* Percent-encode everything that isn't safe to have in a path without encoding safe chars.
*
* Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
* > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
* > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
* > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
*/
function encodeURIPath(str) {
	return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
const EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
const createPathTagFunction = (pathEncoder = encodeURIPath) => function path$2(statics, ...params) {
	if (statics.length === 1) return statics[0];
	let postPath = false;
	const invalidSegments = [];
	const path$3 = statics.reduce((previousValue, currentValue, index) => {
		if (/[?#]/.test(currentValue)) postPath = true;
		const value = params[index];
		let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
		if (index !== params.length && (value == null || typeof value === "object" && value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
			encoded = value + "";
			invalidSegments.push({
				start: previousValue.length + currentValue.length,
				length: encoded.length,
				error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
			});
		}
		return previousValue + currentValue + (index === params.length ? "" : encoded);
	}, "");
	const pathOnly = path$3.split(/[?#]/, 1)[0];
	const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
	let match;
	while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) invalidSegments.push({
		start: match.index,
		length: match[0].length,
		error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
	});
	invalidSegments.sort((a, b) => a.start - b.start);
	if (invalidSegments.length > 0) {
		let lastEnd = 0;
		const underline = invalidSegments.reduce((acc, segment) => {
			const spaces = " ".repeat(segment.start - lastEnd);
			const arrows = "^".repeat(segment.length);
			lastEnd = segment.start + segment.length;
			return acc + spaces + arrows;
		}, "");
		throw new DodoPaymentsError(`Path parameters result in path with invalid segments:\n${invalidSegments.map((e) => e.error).join("\n")}\n${path$3}\n${underline}`);
	}
	return path$3;
};
/**
* URI-encodes path params and ensures no unsafe /./ or /../ path segments are introduced.
*/
const path$1 = /* @__PURE__ */ createPathTagFunction(encodeURIPath);

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/addons.mjs
var Addons = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const addonResponse of client.addons.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/addons", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const addonResponse = await client.addons.create({
	*   currency: 'AED',
	*   name: 'name',
	*   price: 0,
	*   tax_category: 'digital_products',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/addons", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const addonResponse = await client.addons.retrieve(
	*   'adn_NX1zdqW4Hbivsqz8vI9dc',
	* );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/addons/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* const addonResponse = await client.addons.update(
	*   'adn_NX1zdqW4Hbivsqz8vI9dc',
	* );
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/addons/${id}`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response = await client.addons.updateImages(
	*   'adn_NX1zdqW4Hbivsqz8vI9dc',
	* );
	* ```
	*/
	updateImages(id, options) {
		return this._client.put(path$1`/addons/${id}/images`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/balances.mjs
var Balances$1 = class extends APIResource {
	retrieveLedger(query = {}, options) {
		return this._client.getAPIList("/balances/ledger", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/brands.mjs
var Brands = class extends APIResource {
	/**
	* @example
	* ```ts
	* const brands = await client.brands.list();
	* ```
	*/
	list(options) {
		return this._client.get("/brands", options);
	}
	/**
	* @example
	* ```ts
	* const brand = await client.brands.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/brands", {
			body,
			...options
		});
	}
	/**
	* Thin handler just calls `get_brand` and wraps in `Json(...)`
	*
	* @example
	* ```ts
	* const brand = await client.brands.retrieve(
	*   'brnd_8dFiAW42v28JzhlVSocjq',
	* );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/brands/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* const brand = await client.brands.update(
	*   'brnd_8dFiAW42v28JzhlVSocjq',
	* );
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/brands/${id}`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response = await client.brands.updateImages(
	*   'brnd_8dFiAW42v28JzhlVSocjq',
	* );
	* ```
	*/
	updateImages(id, options) {
		return this._client.put(path$1`/brands/${id}/images`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/checkout-sessions.mjs
var CheckoutSessions = class extends APIResource {
	/**
	* @example
	* ```ts
	* const checkoutSessionResponse =
	*   await client.checkoutSessions.create({
	*     product_cart: [
	*       { product_id: 'product_id', quantity: 0 },
	*     ],
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/checkouts", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const checkoutSessionStatus =
	*   await client.checkoutSessions.retrieve(
	*     'cks_n010SZaY4NXc7F1ck3Tq1',
	*   );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/checkouts/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* const response = await client.checkoutSessions.preview({
	*   product_cart: [{ product_id: 'product_id', quantity: 0 }],
	* });
	* ```
	*/
	preview(body, options) {
		return this._client.post("/checkouts/preview", {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/credit-entitlements/balances.mjs
var Balances = class extends APIResource {
	/**
	* Returns a paginated list of customer credit balances for the given credit
	* entitlement.
	*
	* # Authentication
	*
	* Requires an API key with `Viewer` role or higher.
	*
	* # Path Parameters
	*
	* - `credit_entitlement_id` - The unique identifier of the credit entitlement
	*
	* # Query Parameters
	*
	* - `page_size` - Number of items per page (default: 10, max: 100)
	* - `page_number` - Zero-based page number (default: 0)
	* - `customer_id` - Optional filter by specific customer
	*
	* # Responses
	*
	* - `200 OK` - Returns list of customer balances
	* - `404 Not Found` - Credit entitlement not found
	* - `500 Internal Server Error` - Database or server error
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const customerCreditBalance of client.creditEntitlements.balances.list(
	*   'cde_ztxm5XJsKxWucRWA3rjdM',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(creditEntitlementID, query = {}, options) {
		return this._client.getAPIList(path$1`/credit-entitlements/${creditEntitlementID}/balances`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Returns the credit balance details for a specific customer and credit
	* entitlement.
	*
	* # Authentication
	*
	* Requires an API key with `Viewer` role or higher.
	*
	* # Path Parameters
	*
	* - `credit_entitlement_id` - The unique identifier of the credit entitlement
	* - `customer_id` - The unique identifier of the customer
	*
	* # Responses
	*
	* - `200 OK` - Returns the customer's balance
	* - `404 Not Found` - Credit entitlement or customer balance not found
	* - `500 Internal Server Error` - Database or server error
	*
	* @example
	* ```ts
	* const customerCreditBalance =
	*   await client.creditEntitlements.balances.retrieve(
	*     'cus_TV52uJWWXt2yIoBBxpjaa',
	*     { credit_entitlement_id: 'cde_ztxm5XJsKxWucRWA3rjdM' },
	*   );
	* ```
	*/
	retrieve(customerID, params, options) {
		const { credit_entitlement_id } = params;
		return this._client.get(path$1`/credit-entitlements/${credit_entitlement_id}/balances/${customerID}`, options);
	}
	/**
	* Returns a paginated list of credit grants with optional filtering by status.
	*
	* # Authentication
	*
	* Requires an API key with `Viewer` role or higher.
	*
	* # Path Parameters
	*
	* - `credit_entitlement_id` - The unique identifier of the credit entitlement
	* - `customer_id` - The unique identifier of the customer
	*
	* # Query Parameters
	*
	* - `page_size` - Number of items per page (default: 10, max: 100)
	* - `page_number` - Zero-based page number (default: 0)
	* - `status` - Filter by status: active, expired, depleted
	*
	* # Responses
	*
	* - `200 OK` - Returns list of grants
	* - `404 Not Found` - Credit entitlement not found
	* - `500 Internal Server Error` - Database or server error
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const balanceListGrantsResponse of client.creditEntitlements.balances.listGrants(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	*   { credit_entitlement_id: 'cde_ztxm5XJsKxWucRWA3rjdM' },
	* )) {
	*   // ...
	* }
	* ```
	*/
	listGrants(customerID, params, options) {
		const { credit_entitlement_id, ...query } = params;
		return this._client.getAPIList(path$1`/credit-entitlements/${credit_entitlement_id}/balances/${customerID}/grants`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Returns a paginated list of credit transaction history with optional filtering.
	*
	* # Authentication
	*
	* Requires an API key with `Viewer` role or higher.
	*
	* # Path Parameters
	*
	* - `credit_entitlement_id` - The unique identifier of the credit entitlement
	* - `customer_id` - The unique identifier of the customer
	*
	* # Query Parameters
	*
	* - `page_size` - Number of items per page (default: 10, max: 100)
	* - `page_number` - Zero-based page number (default: 0)
	* - `transaction_type` - Filter by transaction type
	* - `start_date` - Filter entries from this date
	* - `end_date` - Filter entries until this date
	*
	* # Responses
	*
	* - `200 OK` - Returns list of ledger entries
	* - `404 Not Found` - Credit entitlement not found
	* - `500 Internal Server Error` - Database or server error
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const creditLedgerEntry of client.creditEntitlements.balances.listLedger(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	*   { credit_entitlement_id: 'cde_ztxm5XJsKxWucRWA3rjdM' },
	* )) {
	*   // ...
	* }
	* ```
	*/
	listLedger(customerID, params, options) {
		const { credit_entitlement_id, ...query } = params;
		return this._client.getAPIList(path$1`/credit-entitlements/${credit_entitlement_id}/balances/${customerID}/ledger`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* For credit entries, a new grant is created. For debit entries, credits are
	* deducted from existing grants using FIFO (oldest first).
	*
	* # Authentication
	*
	* Requires an API key with `Editor` role.
	*
	* # Path Parameters
	*
	* - `credit_entitlement_id` - The unique identifier of the credit entitlement
	* - `customer_id` - The unique identifier of the customer
	*
	* # Request Body
	*
	* - `entry_type` - "credit" or "debit"
	* - `amount` - Amount to credit or debit
	* - `reason` - Optional human-readable reason
	* - `expires_at` - Optional expiration for credited amount (only for credit type)
	* - `idempotency_key` - Optional key to prevent duplicate entries
	*
	* # Responses
	*
	* - `201 Created` - Ledger entry created successfully
	* - `400 Bad Request` - Invalid request (e.g., debit with insufficient balance)
	* - `404 Not Found` - Credit entitlement or customer not found
	* - `409 Conflict` - Idempotency key already exists
	* - `500 Internal Server Error` - Database or server error
	*
	* @example
	* ```ts
	* const response =
	*   await client.creditEntitlements.balances.createLedgerEntry(
	*     'cus_TV52uJWWXt2yIoBBxpjaa',
	*     {
	*       credit_entitlement_id: 'cde_ztxm5XJsKxWucRWA3rjdM',
	*       amount: 'amount',
	*       entry_type: 'credit',
	*     },
	*   );
	* ```
	*/
	createLedgerEntry(customerID, params, options) {
		const { credit_entitlement_id, ...body } = params;
		return this._client.post(path$1`/credit-entitlements/${credit_entitlement_id}/balances/${customerID}/ledger-entries`, {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/headers.mjs
const brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
function* iterateHeaders(headers) {
	if (!headers) return;
	if (brand_privateNullableHeaders in headers) {
		const { values, nulls } = headers;
		yield* values.entries();
		for (const name of nulls) yield [name, null];
		return;
	}
	let shouldClear = false;
	let iter;
	if (headers instanceof Headers) iter = headers.entries();
	else if (isReadonlyArray(headers)) iter = headers;
	else {
		shouldClear = true;
		iter = Object.entries(headers ?? {});
	}
	for (let row of iter) {
		const name = row[0];
		if (typeof name !== "string") throw new TypeError("expected header name to be a string");
		const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
		let didClear = false;
		for (const value of values) {
			if (value === void 0) continue;
			if (shouldClear && !didClear) {
				didClear = true;
				yield [name, null];
			}
			yield [name, value];
		}
	}
}
const buildHeaders = (newHeaders) => {
	const targetHeaders = new Headers();
	const nullHeaders = /* @__PURE__ */ new Set();
	for (const headers of newHeaders) {
		const seenHeaders = /* @__PURE__ */ new Set();
		for (const [name, value] of iterateHeaders(headers)) {
			const lowerName = name.toLowerCase();
			if (!seenHeaders.has(lowerName)) {
				targetHeaders.delete(name);
				seenHeaders.add(lowerName);
			}
			if (value === null) {
				targetHeaders.delete(name);
				nullHeaders.add(lowerName);
			} else {
				targetHeaders.append(name, value);
				nullHeaders.delete(lowerName);
			}
		}
	}
	return {
		[brand_privateNullableHeaders]: true,
		values: targetHeaders,
		nulls: nullHeaders
	};
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/credit-entitlements/credit-entitlements.mjs
var CreditEntitlements = class extends APIResource {
	constructor() {
		super(...arguments);
		this.balances = new Balances(this._client);
	}
	/**
	* Returns a paginated list of credit entitlements, allowing filtering of deleted
	* entitlements. By default, only non-deleted entitlements are returned.
	*
	* # Authentication
	*
	* Requires an API key with `Viewer` role or higher.
	*
	* # Query Parameters
	*
	* - `page_size` - Number of items per page (default: 10, max: 100)
	* - `page_number` - Zero-based page number (default: 0)
	* - `deleted` - Boolean flag to list deleted entitlements instead of active ones
	*   (default: false)
	*
	* # Responses
	*
	* - `200 OK` - Returns a list of credit entitlements wrapped in a response object
	* - `422 Unprocessable Entity` - Invalid query parameters (e.g., page_size > 100)
	* - `500 Internal Server Error` - Database or server error
	*
	* # Business Logic
	*
	* - Results are ordered by creation date in descending order (newest first)
	* - Only entitlements belonging to the authenticated business are returned
	* - The `deleted` parameter controls visibility of soft-deleted entitlements
	* - Pagination uses offset-based pagination (offset = page_number \* page_size)
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const creditEntitlement of client.creditEntitlements.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/credit-entitlements", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Credit entitlements define reusable credit templates that can be attached to
	* products. Each entitlement defines how credits behave in terms of expiration,
	* rollover, and overage.
	*
	* # Authentication
	*
	* Requires an API key with `Editor` role.
	*
	* # Request Body
	*
	* - `name` - Human-readable name of the credit entitlement (1-255 characters,
	*   required)
	* - `description` - Optional description (max 1000 characters)
	* - `precision` - Decimal precision for credit amounts (0-10 decimal places)
	* - `unit` - Unit of measurement for the credit (e.g., "API Calls", "Tokens",
	*   "Credits")
	* - `expires_after_days` - Number of days after which credits expire (optional)
	* - `rollover_enabled` - Whether unused credits can rollover to the next period
	* - `rollover_percentage` - Percentage of unused credits that rollover (0-100)
	* - `rollover_timeframe_count` - Count of timeframe periods for rollover limit
	* - `rollover_timeframe_interval` - Interval type (day, week, month, year)
	* - `max_rollover_count` - Maximum number of times credits can be rolled over
	* - `overage_enabled` - Whether overage charges apply when credits run out
	*   (requires price_per_unit)
	* - `overage_limit` - Maximum overage units allowed (optional)
	* - `currency` - Currency for pricing (required if price_per_unit is set)
	* - `price_per_unit` - Price per credit unit (decimal)
	*
	* # Responses
	*
	* - `201 Created` - Credit entitlement created successfully, returns the full
	*   entitlement object
	* - `422 Unprocessable Entity` - Invalid request parameters or validation failure
	* - `500 Internal Server Error` - Database or server error
	*
	* # Business Logic
	*
	* - A unique ID with prefix `cde_` is automatically generated for the entitlement
	* - Created and updated timestamps are automatically set
	* - Currency is required when price_per_unit is set
	* - price_per_unit is required when overage_enabled is true
	* - rollover_timeframe_count and rollover_timeframe_interval must both be set or
	*   both be null
	*
	* @example
	* ```ts
	* const creditEntitlement =
	*   await client.creditEntitlements.create({
	*     name: 'name',
	*     overage_enabled: true,
	*     precision: 0,
	*     rollover_enabled: true,
	*     unit: 'unit',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/credit-entitlements", {
			body,
			...options
		});
	}
	/**
	* Returns the full details of a single credit entitlement including all
	* configuration settings for expiration, rollover, and overage policies.
	*
	* # Authentication
	*
	* Requires an API key with `Viewer` role or higher.
	*
	* # Path Parameters
	*
	* - `id` - The unique identifier of the credit entitlement (format: `cde_...`)
	*
	* # Responses
	*
	* - `200 OK` - Returns the full credit entitlement object
	* - `404 Not Found` - Credit entitlement does not exist or does not belong to the
	*   authenticated business
	* - `500 Internal Server Error` - Database or server error
	*
	* # Business Logic
	*
	* - Only non-deleted credit entitlements can be retrieved through this endpoint
	* - The entitlement must belong to the authenticated business (business_id check)
	* - Deleted entitlements return a 404 error and must be retrieved via the list
	*   endpoint with `deleted=true`
	*
	* @example
	* ```ts
	* const creditEntitlement =
	*   await client.creditEntitlements.retrieve(
	*     'cde_ztxm5XJsKxWucRWA3rjdM',
	*   );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/credit-entitlements/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* await client.creditEntitlements.delete(
	*   'cde_ztxm5XJsKxWucRWA3rjdM',
	* );
	* ```
	*/
	delete(id, options) {
		return this._client.delete(path$1`/credit-entitlements/${id}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Allows partial updates to a credit entitlement's configuration. Only the fields
	* provided in the request body will be updated; all other fields remain unchanged.
	* This endpoint supports nullable fields using the double option pattern.
	*
	* # Authentication
	*
	* Requires an API key with `Editor` role.
	*
	* # Path Parameters
	*
	* - `id` - The unique identifier of the credit entitlement to update (format:
	*   `cde_...`)
	*
	* # Request Body (all fields optional)
	*
	* - `name` - Human-readable name of the credit entitlement (1-255 characters)
	* - `description` - Optional description (max 1000 characters)
	* - `unit` - Unit of measurement for the credit (1-50 characters)
	*
	* Note: `precision` cannot be modified after creation as it would invalidate
	* existing grants.
	*
	* - `expires_after_days` - Number of days after which credits expire (use `null`
	*   to remove expiration)
	* - `rollover_enabled` - Whether unused credits can rollover to the next period
	* - `rollover_percentage` - Percentage of unused credits that rollover (0-100,
	*   nullable)
	* - `rollover_timeframe_count` - Count of timeframe periods for rollover limit
	*   (nullable)
	* - `rollover_timeframe_interval` - Interval type (day, week, month, year,
	*   nullable)
	* - `max_rollover_count` - Maximum number of times credits can be rolled over
	*   (nullable)
	* - `overage_enabled` - Whether overage charges apply when credits run out
	* - `overage_limit` - Maximum overage units allowed (nullable)
	* - `currency` - Currency for pricing (nullable)
	* - `price_per_unit` - Price per credit unit (decimal, nullable)
	*
	* # Responses
	*
	* - `200 OK` - Credit entitlement updated successfully
	* - `404 Not Found` - Credit entitlement does not exist or does not belong to the
	*   authenticated business
	* - `422 Unprocessable Entity` - Invalid request parameters or validation failure
	* - `500 Internal Server Error` - Database or server error
	*
	* # Business Logic
	*
	* - Only non-deleted credit entitlements can be updated
	* - Fields set to `null` explicitly will clear the database value (using double
	*   option pattern)
	* - The `updated_at` timestamp is automatically updated on successful modification
	* - Changes take effect immediately but do not retroactively affect existing
	*   credit grants
	* - The merged state is validated: currency required with price, rollover
	*   timeframe fields together, price required for overage
	*
	* @example
	* ```ts
	* await client.creditEntitlements.update(
	*   'cde_ztxm5XJsKxWucRWA3rjdM',
	* );
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/credit-entitlements/${id}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Undeletes a soft-deleted credit entitlement by clearing `deleted_at`, making it
	* available again through standard list and get endpoints.
	*
	* # Authentication
	*
	* Requires an API key with `Editor` role.
	*
	* # Path Parameters
	*
	* - `id` - The unique identifier of the credit entitlement to restore (format:
	*   `cde_...`)
	*
	* # Responses
	*
	* - `200 OK` - Credit entitlement restored successfully
	* - `500 Internal Server Error` - Database error, entitlement not found, or
	*   entitlement is not deleted
	*
	* # Business Logic
	*
	* - Only deleted credit entitlements can be restored
	* - The query filters for `deleted_at IS NOT NULL`, so non-deleted entitlements
	*   will result in 0 rows affected
	* - If no rows are affected (entitlement doesn't exist, doesn't belong to
	*   business, or is not deleted), returns 500
	* - The `updated_at` timestamp is automatically updated on successful restoration
	* - Once restored, the entitlement becomes immediately available in the standard
	*   list and get endpoints
	* - All configuration settings are preserved during delete/restore operations
	*
	* # Error Handling
	*
	* This endpoint returns 500 Internal Server Error in several cases:
	*
	* - The credit entitlement does not exist
	* - The credit entitlement belongs to a different business
	* - The credit entitlement is not currently deleted (already active)
	*
	* Callers should verify the entitlement exists and is deleted before calling this
	* endpoint.
	*
	* @example
	* ```ts
	* await client.creditEntitlements.undelete(
	*   'cde_ztxm5XJsKxWucRWA3rjdM',
	* );
	* ```
	*/
	undelete(id, options) {
		return this._client.post(path$1`/credit-entitlements/${id}/undelete`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};
CreditEntitlements.Balances = Balances;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/customers/customer-portal.mjs
var CustomerPortal = class extends APIResource {
	/**
	* @example
	* ```ts
	* const customerPortalSession =
	*   await client.customers.customerPortal.create(
	*     'cus_TV52uJWWXt2yIoBBxpjaa',
	*   );
	* ```
	*/
	create(customerID, params = {}, options) {
		const { return_url, send_email } = params ?? {};
		return this._client.post(path$1`/customers/${customerID}/customer-portal/session`, {
			query: {
				return_url,
				send_email
			},
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/customers/wallets/ledger-entries.mjs
var LedgerEntries = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const customerWalletTransaction of client.customers.wallets.ledgerEntries.list(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(customerID, query = {}, options) {
		return this._client.getAPIList(path$1`/customers/${customerID}/wallets/ledger-entries`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const customerWallet =
	*   await client.customers.wallets.ledgerEntries.create(
	*     'cus_TV52uJWWXt2yIoBBxpjaa',
	*     {
	*       amount: 0,
	*       currency: 'AED',
	*       entry_type: 'credit',
	*     },
	*   );
	* ```
	*/
	create(customerID, body, options) {
		return this._client.post(path$1`/customers/${customerID}/wallets/ledger-entries`, {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/customers/wallets/wallets.mjs
var Wallets = class extends APIResource {
	constructor() {
		super(...arguments);
		this.ledgerEntries = new LedgerEntries(this._client);
	}
	/**
	* @example
	* ```ts
	* const wallets = await client.customers.wallets.list(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	* );
	* ```
	*/
	list(customerID, options) {
		return this._client.get(path$1`/customers/${customerID}/wallets`, options);
	}
};
Wallets.LedgerEntries = LedgerEntries;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/customers/customers.mjs
var Customers = class extends APIResource {
	constructor() {
		super(...arguments);
		this.customerPortal = new CustomerPortal(this._client);
		this.wallets = new Wallets(this._client);
	}
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const customer of client.customers.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/customers", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const customer = await client.customers.retrieve(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	* );
	* ```
	*/
	retrieve(customerID, options) {
		return this._client.get(path$1`/customers/${customerID}`, options);
	}
	/**
	* @example
	* ```ts
	* const customer = await client.customers.create({
	*   email: 'email',
	*   name: 'name',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/customers", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const customer = await client.customers.update(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	* );
	* ```
	*/
	update(customerID, body, options) {
		return this._client.patch(path$1`/customers/${customerID}`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.customers.retrievePaymentMethods(
	*     'cus_TV52uJWWXt2yIoBBxpjaa',
	*   );
	* ```
	*/
	retrievePaymentMethods(customerID, options) {
		return this._client.get(path$1`/customers/${customerID}/payment-methods`, options);
	}
	/**
	* List all credit entitlements for a customer with their current balances
	*
	* @example
	* ```ts
	* const response =
	*   await client.customers.listCreditEntitlements(
	*     'cus_TV52uJWWXt2yIoBBxpjaa',
	*   );
	* ```
	*/
	listCreditEntitlements(customerID, options) {
		return this._client.get(path$1`/customers/${customerID}/credit-entitlements`, options);
	}
	/**
	* @example
	* ```ts
	* await client.customers.deletePaymentMethod(
	*   'payment_method_id',
	*   { customer_id: 'cus_TV52uJWWXt2yIoBBxpjaa' },
	* );
	* ```
	*/
	deletePaymentMethod(paymentMethodID, params, options) {
		const { customer_id } = params;
		return this._client.delete(path$1`/customers/${customer_id}/payment-methods/${paymentMethodID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* List all entitlement grants delivered (or in flight) to a customer.
	*
	* @example
	* ```ts
	* const response = await client.customers.listEntitlements(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	* );
	* ```
	*/
	listEntitlements(customerID, options) {
		return this._client.get(path$1`/customers/${customerID}/entitlements`, options);
	}
	/**
	* List all of a customer's entitlement grants across every entitlement. One row
	* per grant.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const entitlementGrant of client.customers.listEntitlementGrants(
	*   'cus_TV52uJWWXt2yIoBBxpjaa',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listEntitlementGrants(customerID, query = {}, options) {
		return this._client.getAPIList(path$1`/customers/${customerID}/entitlement-grants`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
};
Customers.CustomerPortal = CustomerPortal;
Customers.Wallets = Wallets;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/discounts.mjs
var Discounts = class extends APIResource {
	/**
	* GET /discounts
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const discount of client.discounts.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/discounts", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* POST /discounts If `code` is omitted or empty, a random 16-char uppercase code
	* is generated.
	*
	* @example
	* ```ts
	* const discount = await client.discounts.create({
	*   amount: 0,
	*   type: 'flat',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/discounts", {
			body,
			...options
		});
	}
	/**
	* GET /discounts/{discount_id}
	*
	* @example
	* ```ts
	* const discount = await client.discounts.retrieve(
	*   'dsc_qxxEmg5PuM1uNTE0LgkP9',
	* );
	* ```
	*/
	retrieve(discountID, options) {
		return this._client.get(path$1`/discounts/${discountID}`, options);
	}
	/**
	* DELETE /discounts/{discount_id}
	*
	* @example
	* ```ts
	* await client.discounts.delete('dsc_qxxEmg5PuM1uNTE0LgkP9');
	* ```
	*/
	delete(discountID, options) {
		return this._client.delete(path$1`/discounts/${discountID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* PATCH /discounts/{discount_id}
	*
	* @example
	* ```ts
	* const discount = await client.discounts.update(
	*   'dsc_qxxEmg5PuM1uNTE0LgkP9',
	* );
	* ```
	*/
	update(discountID, body, options) {
		return this._client.patch(path$1`/discounts/${discountID}`, {
			body,
			...options
		});
	}
	/**
	* Validate and fetch a discount by its code name (e.g., "SAVE20"). This allows
	* real-time validation directly against the API using the human-readable discount
	* code instead of requiring the internal discount_id.
	*
	* @example
	* ```ts
	* const discount = await client.discounts.retrieveByCode(
	*   'code',
	* );
	* ```
	*/
	retrieveByCode(code, options) {
		return this._client.get(path$1`/discounts/code/${code}`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/disputes.mjs
var Disputes = class extends APIResource {
	list(query = {}, options) {
		return this._client.getAPIList("/disputes", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	retrieve(disputeID, options) {
		return this._client.get(path$1`/disputes/${disputeID}`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/entitlements/files.mjs
var Files = class extends APIResource {
	/**
	* Attach a file to a `digital_files` entitlement. Per-file size cap: 500 MiB.
	*
	* @example
	* ```ts
	* const response = await client.entitlements.files.upload(
	*   'ent_jt7jcvI79Xh8eehqgWdcm',
	* );
	* ```
	*/
	upload(id, options) {
		return this._client.post(path$1`/entitlements/${id}/files`, options);
	}
	/**
	* Detach a previously-attached file from a `digital_files` entitlement.
	*
	* @example
	* ```ts
	* await client.entitlements.files.delete('file_id', {
	*   id: 'ent_jt7jcvI79Xh8eehqgWdcm',
	* });
	* ```
	*/
	delete(fileID, params, options) {
		const { id } = params;
		return this._client.delete(path$1`/entitlements/${id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/entitlements/grants.mjs
var Grants = class extends APIResource {
	/**
	* GET /entitlements/{id}/grants (public API)
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const entitlementGrant of client.entitlements.grants.list(
	*   'ent_jt7jcvI79Xh8eehqgWdcm',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(id, query = {}, options) {
		return this._client.getAPIList(path$1`/entitlements/${id}/grants`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Revoke a single grant. Idempotent: re-revoking an already-revoked grant returns
	* the grant in its current state.
	*
	* @example
	* ```ts
	* const entitlementGrant =
	*   await client.entitlements.grants.revoke(
	*     'entg_w0ZCJZgNXuNDdMVzvja6p',
	*     { id: 'ent_jt7jcvI79Xh8eehqgWdcm' },
	*   );
	* ```
	*/
	revoke(grantID, params, options) {
		const { id } = params;
		return this._client.delete(path$1`/entitlements/${id}/grants/${grantID}`, options);
	}
	/**
	* For entitlements whose license-key config uses `manual` fulfillment, grants are
	* created in the `pending` state without a key. Call this endpoint to deliver the
	* key: the grant moves to `delivered`, the customer is emailed the key, and the
	* `license_key.created` and `entitlement_grant.delivered` webhook events are sent.
	*
	* @example
	* ```ts
	* const entitlementGrant =
	*   await client.entitlements.grants.fulfillLicenseKey(
	*     'entg_w0ZCJZgNXuNDdMVzvja6p',
	*     { key: 'key' },
	*   );
	* ```
	*/
	fulfillLicenseKey(grantID, body, options) {
		return this._client.post(path$1`/grants/${grantID}/license-key`, {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/entitlements/entitlements.mjs
var Entitlements = class extends APIResource {
	constructor() {
		super(...arguments);
		this.files = new Files(this._client);
		this.grants = new Grants(this._client);
	}
	/**
	* GET /entitlements
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const entitlement of client.entitlements.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/entitlements", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* POST /entitlements
	*
	* @example
	* ```ts
	* const entitlement = await client.entitlements.create({
	*   integration_config: {
	*     feature_id: 'feature_id',
	*     feature_type: 'boolean',
	*   },
	*   integration_type: 'discord',
	*   name: 'name',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/entitlements", {
			body,
			...options
		});
	}
	/**
	* GET /entitlements/{id}
	*
	* @example
	* ```ts
	* const entitlement = await client.entitlements.retrieve(
	*   'ent_jt7jcvI79Xh8eehqgWdcm',
	* );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/entitlements/${id}`, options);
	}
	/**
	* DELETE /entitlements/{id} (soft-delete)
	*
	* @example
	* ```ts
	* await client.entitlements.delete(
	*   'ent_jt7jcvI79Xh8eehqgWdcm',
	* );
	* ```
	*/
	delete(id, options) {
		return this._client.delete(path$1`/entitlements/${id}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* PATCH /entitlements/{id}
	*
	* @example
	* ```ts
	* const entitlement = await client.entitlements.update(
	*   'ent_jt7jcvI79Xh8eehqgWdcm',
	* );
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/entitlements/${id}`, {
			body,
			...options
		});
	}
};
Entitlements.Files = Files;
Entitlements.Grants = Grants;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/invoices/payments.mjs
var Payments$1 = class extends APIResource {
	/**
	* @example
	* ```ts
	* const payment = await client.invoices.payments.retrieve(
	*   'pay_gr4RizvMOXFJ6xca3y2tU',
	* );
	*
	* const content = await payment.blob();
	* console.log(content);
	* ```
	*/
	retrieve(paymentID, options) {
		return this._client.get(path$1`/invoices/payments/${paymentID}`, {
			...options,
			headers: buildHeaders([{ Accept: "application/pdf" }, options?.headers]),
			__binaryResponse: true
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.invoices.payments.retrieveRefund(
	*     'ref_F0gZetLvTxxBrMU2CZcmy',
	*   );
	*
	* const content = await response.blob();
	* console.log(content);
	* ```
	*/
	retrieveRefund(refundID, options) {
		return this._client.get(path$1`/invoices/refunds/${refundID}`, {
			...options,
			headers: buildHeaders([{ Accept: "application/pdf" }, options?.headers]),
			__binaryResponse: true
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.invoices.payments.retrievePayout(
	*     'pyt_zFTrrn4sk3x3y2vjDBW3T',
	*   );
	*
	* const content = await response.blob();
	* console.log(content);
	* ```
	*/
	retrievePayout(payoutID, options) {
		return this._client.get(path$1`/invoices/payouts/${payoutID}`, {
			...options,
			headers: buildHeaders([{ Accept: "application/pdf" }, options?.headers]),
			__binaryResponse: true
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/invoices/invoices.mjs
var Invoices = class extends APIResource {
	constructor() {
		super(...arguments);
		this.payments = new Payments$1(this._client);
	}
};
Invoices.Payments = Payments$1;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/license-key-instances.mjs
var LicenseKeyInstances = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const licenseKeyInstance of client.licenseKeyInstances.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/license_key_instances", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const licenseKeyInstance =
	*   await client.licenseKeyInstances.retrieve(
	*     'lki_EeWORStkMc7z0KycI31VS',
	*   );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/license_key_instances/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* const licenseKeyInstance =
	*   await client.licenseKeyInstances.update(
	*     'lki_EeWORStkMc7z0KycI31VS',
	*     { name: 'name' },
	*   );
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/license_key_instances/${id}`, {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/license-keys.mjs
var LicenseKeys = class extends APIResource {
	/**
	* @deprecated
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/license_keys", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @deprecated
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/license_keys/${id}`, options);
	}
	/**
	* @deprecated
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/license_keys/${id}`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const licenseKey = await client.licenseKeys.create({
	*   customer_id: 'customer_id',
	*   key: 'key',
	*   product_id: 'product_id',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/license_keys", {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/licenses.mjs
var Licenses = class extends APIResource {
	/**
	* @example
	* ```ts
	* const response = await client.licenses.activate({
	*   license_key: 'license_key',
	*   name: 'name',
	* });
	* ```
	*/
	activate(body, options) {
		return this._client.post("/licenses/activate", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* await client.licenses.deactivate({
	*   license_key: 'license_key',
	*   license_key_instance_id: 'license_key_instance_id',
	* });
	* ```
	*/
	deactivate(body, options) {
		return this._client.post("/licenses/deactivate", {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* const response = await client.licenses.validate({
	*   license_key: '2b1f8e2d-c41e-4e8f-b2d3-d9fd61c38f43',
	* });
	* ```
	*/
	validate(body, options) {
		return this._client.post("/licenses/validate", {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/meters.mjs
var Meters = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const meter of client.meters.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/meters", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const meter = await client.meters.create({
	*   aggregation: { type: 'count' },
	*   event_name: 'event_name',
	*   measurement_unit: 'measurement_unit',
	*   name: 'name',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/meters", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const meter = await client.meters.retrieve(
	*   'mtr_h5tgTWL55OyMO0L2Q9w9v',
	* );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/meters/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* await client.meters.archive('mtr_h5tgTWL55OyMO0L2Q9w9v');
	* ```
	*/
	archive(id, options) {
		return this._client.delete(path$1`/meters/${id}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* await client.meters.unarchive('mtr_h5tgTWL55OyMO0L2Q9w9v');
	* ```
	*/
	unarchive(id, options) {
		return this._client.post(path$1`/meters/${id}/unarchive`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/misc.mjs
var Misc = class extends APIResource {
	listSupportedCountries(options) {
		return this._client.get("/checkout/supported_countries", options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/payments.mjs
var Payments = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const paymentListResponse of client.payments.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/payments", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @deprecated
	*/
	create(body, options) {
		return this._client.post("/payments", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const payment = await client.payments.retrieve(
	*   'pay_gr4RizvMOXFJ6xca3y2tU',
	* );
	* ```
	*/
	retrieve(paymentID, options) {
		return this._client.get(path$1`/payments/${paymentID}`, options);
	}
	/**
	* @example
	* ```ts
	* const response = await client.payments.retrieveLineItems(
	*   'pay_gr4RizvMOXFJ6xca3y2tU',
	* );
	* ```
	*/
	retrieveLineItems(paymentID, options) {
		return this._client.get(path$1`/payments/${paymentID}/line-items`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/payouts/breakup/details.mjs
var Details = class extends APIResource {
	/**
	* Returns paginated individual balance ledger entries for a payout, with each
	* entry's amount pro-rated into the payout's currency. Supports pagination via
	* `page_size` (default 10, max 100) and `page_number` (default 0) query
	* parameters.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const detailListResponse of client.payouts.breakup.details.list(
	*   'pyt_zFTrrn4sk3x3y2vjDBW3T',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(payoutID, query = {}, options) {
		return this._client.getAPIList(path$1`/payouts/${payoutID}/breakup/details`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Downloads the complete payout breakup as a CSV file. Each row represents a
	* balance ledger entry with columns: Ledger ID, Event Type, Original Amount,
	* Original Currency, Reference Object ID, Description, Created At, USD Equivalent
	* Amount, and Payout Currency Amount.
	*
	* @example
	* ```ts
	* await client.payouts.breakup.details.downloadCsv(
	*   'pyt_zFTrrn4sk3x3y2vjDBW3T',
	* );
	* ```
	*/
	downloadCsv(payoutID, options) {
		return this._client.get(path$1`/payouts/${payoutID}/breakup/details/csv`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/payouts/breakup/breakup.mjs
var Breakup = class extends APIResource {
	constructor() {
		super(...arguments);
		this.details = new Details(this._client);
	}
	/**
	* Returns the breakdown of a payout by event type (payments, refunds, disputes,
	* fees, etc.) in the payout's currency. Each amount is proportionally allocated
	* based on USD equivalent values, ensuring the total sums exactly to the payout
	* amount.
	*
	* @example
	* ```ts
	* const breakups = await client.payouts.breakup.retrieve(
	*   'pyt_zFTrrn4sk3x3y2vjDBW3T',
	* );
	* ```
	*/
	retrieve(payoutID, options) {
		return this._client.get(path$1`/payouts/${payoutID}/breakup`, options);
	}
};
Breakup.Details = Details;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/payouts/payouts.mjs
var Payouts = class extends APIResource {
	constructor() {
		super(...arguments);
		this.breakup = new Breakup(this._client);
	}
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const payoutListResponse of client.payouts.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/payouts", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
};
Payouts.Breakup = Breakup;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/product-collections/groups/items.mjs
var Items = class extends APIResource {
	/**
	* @example
	* ```ts
	* const productCollectionProducts =
	*   await client.productCollections.groups.items.create(
	*     '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*     {
	*       id: 'pdc_8BWv0hojwUH7iCDabr0NI',
	*       products: [{ product_id: 'product_id' }],
	*     },
	*   );
	* ```
	*/
	create(groupID, params, options) {
		const { id, ...body } = params;
		return this._client.post(path$1`/product-collections/${id}/groups/${groupID}/items`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* await client.productCollections.groups.items.delete(
	*   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*   {
	*     id: 'pdc_8BWv0hojwUH7iCDabr0NI',
	*     group_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*   },
	* );
	* ```
	*/
	delete(itemID, params, options) {
		const { id, group_id } = params;
		return this._client.delete(path$1`/product-collections/${id}/groups/${group_id}/items/${itemID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* await client.productCollections.groups.items.update(
	*   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*   {
	*     id: 'pdc_8BWv0hojwUH7iCDabr0NI',
	*     group_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*     status: true,
	*   },
	* );
	* ```
	*/
	update(itemID, params, options) {
		const { id, group_id, ...body } = params;
		return this._client.patch(path$1`/product-collections/${id}/groups/${group_id}/items/${itemID}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/product-collections/groups/groups.mjs
var Groups = class extends APIResource {
	constructor() {
		super(...arguments);
		this.items = new Items(this._client);
	}
	/**
	* @example
	* ```ts
	* const productCollectionGroupResponse =
	*   await client.productCollections.groups.create(
	*     'pdc_8BWv0hojwUH7iCDabr0NI',
	*     { products: [{ product_id: 'product_id' }] },
	*   );
	* ```
	*/
	create(id, body, options) {
		return this._client.post(path$1`/product-collections/${id}/groups`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* await client.productCollections.groups.delete(
	*   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*   { id: 'pdc_8BWv0hojwUH7iCDabr0NI' },
	* );
	* ```
	*/
	delete(groupID, params, options) {
		const { id } = params;
		return this._client.delete(path$1`/product-collections/${id}/groups/${groupID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* await client.productCollections.groups.update(
	*   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
	*   { id: 'pdc_8BWv0hojwUH7iCDabr0NI' },
	* );
	* ```
	*/
	update(groupID, params, options) {
		const { id, ...body } = params;
		return this._client.patch(path$1`/product-collections/${id}/groups/${groupID}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};
Groups.Items = Items;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/product-collections/product-collections.mjs
var ProductCollections = class extends APIResource {
	constructor() {
		super(...arguments);
		this.groups = new Groups(this._client);
	}
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const productCollectionListResponse of client.productCollections.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/product-collections", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const productCollection =
	*   await client.productCollections.create({
	*     groups: [{ products: [{ product_id: 'product_id' }] }],
	*     name: 'name',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/product-collections", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const productCollection =
	*   await client.productCollections.retrieve(
	*     'pdc_8BWv0hojwUH7iCDabr0NI',
	*   );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/product-collections/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* await client.productCollections.delete(
	*   'pdc_8BWv0hojwUH7iCDabr0NI',
	* );
	* ```
	*/
	delete(id, options) {
		return this._client.delete(path$1`/product-collections/${id}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* await client.productCollections.update(
	*   'pdc_8BWv0hojwUH7iCDabr0NI',
	* );
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/product-collections/${id}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.productCollections.updateImages(
	*     'pdc_8BWv0hojwUH7iCDabr0NI',
	*   );
	* ```
	*/
	updateImages(id, params = {}, options) {
		const { force_update } = params ?? {};
		return this._client.put(path$1`/product-collections/${id}/images`, {
			query: { force_update },
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response = await client.productCollections.unarchive(
	*   'pdc_8BWv0hojwUH7iCDabr0NI',
	* );
	* ```
	*/
	unarchive(id, options) {
		return this._client.post(path$1`/product-collections/${id}/unarchive`, options);
	}
};
ProductCollections.Groups = Groups;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/products/images.mjs
var Images = class extends APIResource {
	/**
	* @example
	* ```ts
	* const image = await client.products.images.update(
	*   'pdt_R8AWMPiV8RyJElcCKvAID',
	* );
	* ```
	*/
	update(id, params = {}, options) {
		const { force_update } = params ?? {};
		return this._client.put(path$1`/products/${id}/images`, {
			query: { force_update },
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/products/localized-prices.mjs
var LocalizedPrices = class extends APIResource {
	/**
	* @example
	* ```ts
	* const listLocalizedPricesResponse =
	*   await client.products.localizedPrices.list(
	*     'pdt_R8AWMPiV8RyJElcCKvAID',
	*   );
	* ```
	*/
	list(productID, options) {
		return this._client.get(path$1`/products/${productID}/localized-prices`, options);
	}
	/**
	* @example
	* ```ts
	* const localizedPrice =
	*   await client.products.localizedPrices.create(
	*     'pdt_R8AWMPiV8RyJElcCKvAID',
	*     { amount: 0, currency: 'AED' },
	*   );
	* ```
	*/
	create(productID, body, options) {
		return this._client.post(path$1`/products/${productID}/localized-prices`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const localizedPrice =
	*   await client.products.localizedPrices.retrieve(
	*     'lcp_3aOOT7ebrzBOV41yL2V6s',
	*     { product_id: 'pdt_R8AWMPiV8RyJElcCKvAID' },
	*   );
	* ```
	*/
	retrieve(id, params, options) {
		const { product_id } = params;
		return this._client.get(path$1`/products/${product_id}/localized-prices/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* const localizedPrice =
	*   await client.products.localizedPrices.update(
	*     'lcp_3aOOT7ebrzBOV41yL2V6s',
	*     { product_id: 'pdt_R8AWMPiV8RyJElcCKvAID' },
	*   );
	* ```
	*/
	update(id, params, options) {
		const { product_id, ...body } = params;
		return this._client.patch(path$1`/products/${product_id}/localized-prices/${id}`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* await client.products.localizedPrices.archive(
	*   'lcp_3aOOT7ebrzBOV41yL2V6s',
	*   { product_id: 'pdt_R8AWMPiV8RyJElcCKvAID' },
	* );
	* ```
	*/
	archive(id, params, options) {
		const { product_id } = params;
		return this._client.delete(path$1`/products/${product_id}/localized-prices/${id}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/products/short-links.mjs
var ShortLinks = class extends APIResource {
	/**
	* Lists all short links created by the business.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const shortLinkListResponse of client.products.shortLinks.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/products/short_links", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Gives a Short Checkout URL with custom slug for a product. Uses a Static
	* Checkout URL under the hood.
	*
	* @example
	* ```ts
	* const shortLink = await client.products.shortLinks.create(
	*   'pdt_R8AWMPiV8RyJElcCKvAID',
	*   { slug: 'slug' },
	* );
	* ```
	*/
	create(id, body, options) {
		return this._client.post(path$1`/products/${id}/short_links`, {
			body,
			...options
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/products/products.mjs
var Products = class extends APIResource {
	constructor() {
		super(...arguments);
		this.images = new Images(this._client);
		this.shortLinks = new ShortLinks(this._client);
		this.localizedPrices = new LocalizedPrices(this._client);
	}
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const productListResponse of client.products.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/products", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const product = await client.products.create({
	*   name: 'name',
	*   price: {
	*     currency: 'AED',
	*     discount: 0,
	*     price: 0,
	*     purchasing_power_parity: true,
	*     type: 'one_time_price',
	*   },
	*   tax_category: 'digital_products',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/products", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const product = await client.products.retrieve(
	*   'pdt_R8AWMPiV8RyJElcCKvAID',
	* );
	* ```
	*/
	retrieve(id, options) {
		return this._client.get(path$1`/products/${id}`, options);
	}
	/**
	* @example
	* ```ts
	* await client.products.update('pdt_R8AWMPiV8RyJElcCKvAID');
	* ```
	*/
	update(id, body, options) {
		return this._client.patch(path$1`/products/${id}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* await client.products.archive('pdt_R8AWMPiV8RyJElcCKvAID');
	* ```
	*/
	archive(id, options) {
		return this._client.delete(path$1`/products/${id}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* await client.products.unarchive(
	*   'pdt_R8AWMPiV8RyJElcCKvAID',
	* );
	* ```
	*/
	unarchive(id, options) {
		return this._client.post(path$1`/products/${id}/unarchive`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* @example
	* ```ts
	* const response = await client.products.updateFiles(
	*   'pdt_R8AWMPiV8RyJElcCKvAID',
	*   { file_name: 'file_name' },
	* );
	* ```
	*/
	updateFiles(id, body, options) {
		return this._client.put(path$1`/products/${id}/files`, {
			body,
			...options
		});
	}
};
Products.Images = Images;
Products.ShortLinks = ShortLinks;
Products.LocalizedPrices = LocalizedPrices;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/refunds.mjs
var Refunds = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const refundListItem of client.refunds.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/refunds", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const refund = await client.refunds.create({
	*   payment_id: 'payment_id',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/refunds", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const refund = await client.refunds.retrieve(
	*   'ref_F0gZetLvTxxBrMU2CZcmy',
	* );
	* ```
	*/
	retrieve(refundID, options) {
		return this._client.get(path$1`/refunds/${refundID}`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/subscriptions.mjs
var Subscriptions = class extends APIResource {
	/**
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const subscriptionListResponse of client.subscriptions.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/subscriptions", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @deprecated
	*/
	create(body, options) {
		return this._client.post("/subscriptions", {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const subscription = await client.subscriptions.retrieve(
	*   'sub_Iuaq622bbmmfOGrVTqdXv',
	* );
	* ```
	*/
	retrieve(subscriptionID, options) {
		return this._client.get(path$1`/subscriptions/${subscriptionID}`, options);
	}
	/**
	* @example
	* ```ts
	* const subscription = await client.subscriptions.update(
	*   'sub_Iuaq622bbmmfOGrVTqdXv',
	* );
	* ```
	*/
	update(subscriptionID, body, options) {
		return this._client.patch(path$1`/subscriptions/${subscriptionID}`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response = await client.subscriptions.charge(
	*   'sub_Iuaq622bbmmfOGrVTqdXv',
	*   { product_price: 0 },
	* );
	* ```
	*/
	charge(subscriptionID, body, options) {
		return this._client.post(path$1`/subscriptions/${subscriptionID}/charge`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* await client.subscriptions.changePlan(
	*   'sub_Iuaq622bbmmfOGrVTqdXv',
	*   {
	*     product_id: 'product_id',
	*     proration_billing_mode: 'prorated_immediately',
	*     quantity: 0,
	*   },
	* );
	* ```
	*/
	changePlan(subscriptionID, body, options) {
		return this._client.post(path$1`/subscriptions/${subscriptionID}/change-plan`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Get detailed usage history for a subscription that includes usage-based billing
	* (metered components). This endpoint provides insights into customer usage
	* patterns and billing calculations over time.
	*
	* ## What You'll Get:
	*
	* - **Billing periods**: Each item represents a billing cycle with start and end
	*   dates
	* - **Meter usage**: Detailed breakdown of usage for each meter configured on the
	*   subscription
	* - **Usage calculations**: Total units consumed, free threshold units, and
	*   chargeable units
	* - **Historical tracking**: Complete audit trail of usage-based charges
	*
	* ## Use Cases:
	*
	* - **Customer support**: Investigate billing questions and usage discrepancies
	* - **Usage analytics**: Analyze customer consumption patterns over time
	* - **Billing transparency**: Provide customers with detailed usage breakdowns
	* - **Revenue optimization**: Identify usage trends to optimize pricing strategies
	*
	* ## Filtering Options:
	*
	* - **Date range filtering**: Get usage history for specific time periods
	* - **Meter-specific filtering**: Focus on usage for a particular meter
	* - **Pagination**: Navigate through large usage histories efficiently
	*
	* ## Important Notes:
	*
	* - Only returns data for subscriptions with usage-based (metered) components
	* - Usage history is organized by billing periods (subscription cycles)
	* - Free threshold units are calculated and displayed separately from chargeable
	*   units
	* - Historical data is preserved even if meter configurations change
	*
	* ## Example Query Patterns:
	*
	* - Get last 3 months:
	*   `?start_date=2024-01-01T00:00:00Z&end_date=2024-03-31T23:59:59Z`
	* - Filter by meter: `?meter_id=mtr_api_requests`
	* - Paginate results: `?page_size=20&page_number=1`
	* - Recent usage: `?start_date=2024-03-01T00:00:00Z` (from March 1st to now)
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const subscriptionRetrieveUsageHistoryResponse of client.subscriptions.retrieveUsageHistory(
	*   'sub_Iuaq622bbmmfOGrVTqdXv',
	* )) {
	*   // ...
	* }
	* ```
	*/
	retrieveUsageHistory(subscriptionID, query = {}, options) {
		return this._client.getAPIList(path$1`/subscriptions/${subscriptionID}/usage-history`, DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.subscriptions.updatePaymentMethod(
	*     'sub_Iuaq622bbmmfOGrVTqdXv',
	*     { payment_method: { type: 'new' } },
	*   );
	* ```
	*/
	updatePaymentMethod(subscriptionID, params, options) {
		const { payment_method } = params;
		return this._client.post(path$1`/subscriptions/${subscriptionID}/update-payment-method`, {
			body: payment_method,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.subscriptions.previewChangePlan(
	*     'sub_Iuaq622bbmmfOGrVTqdXv',
	*     {
	*       product_id: 'product_id',
	*       proration_billing_mode: 'prorated_immediately',
	*       quantity: 0,
	*     },
	*   );
	* ```
	*/
	previewChangePlan(subscriptionID, body, options) {
		return this._client.post(path$1`/subscriptions/${subscriptionID}/change-plan/preview`, {
			body,
			...options
		});
	}
	/**
	* @example
	* ```ts
	* const response =
	*   await client.subscriptions.retrieveCreditUsage(
	*     'sub_Iuaq622bbmmfOGrVTqdXv',
	*   );
	* ```
	*/
	retrieveCreditUsage(subscriptionID, options) {
		return this._client.get(path$1`/subscriptions/${subscriptionID}/credit-usage`, options);
	}
	/**
	* @example
	* ```ts
	* await client.subscriptions.cancelChangePlan(
	*   'sub_Iuaq622bbmmfOGrVTqdXv',
	* );
	* ```
	*/
	cancelChangePlan(subscriptionID, options) {
		return this._client.delete(path$1`/subscriptions/${subscriptionID}/change-plan/scheduled`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/usage-events.mjs
var UsageEvents = class extends APIResource {
	/**
	* This endpoint allows you to ingest custom events that can be used for:
	*
	* - Usage-based billing and metering
	* - Analytics and reporting
	* - Customer behavior tracking
	*
	* ## Important Notes:
	*
	* - **Duplicate Prevention**:
	*   - Duplicate `event_id` values within the same request are rejected (entire
	*     request fails)
	*   - Subsequent requests with existing `event_id` values are ignored (idempotent
	*     behavior)
	* - **Rate Limiting**: Maximum 1000 events per request
	* - **Time Validation**: Events with timestamps older than 1 hour or more than 5
	*   minutes in the future will be rejected
	* - **Metadata Limits**: Maximum 50 key-value pairs per event, keys max 100 chars,
	*   values max 500 chars
	*
	* ## Example Usage:
	*
	* ```json
	* {
	*   "events": [
	*     {
	*       "event_id": "api_call_12345",
	*       "customer_id": "cus_abc123",
	*       "event_name": "api_request",
	*       "timestamp": "2024-01-15T10:30:00Z",
	*       "metadata": {
	*         "endpoint": "/api/v1/users",
	*         "method": "GET",
	*         "tokens_used": "150"
	*       }
	*     }
	*   ]
	* }
	* ```
	*/
	ingest(body, options) {
		return this._client.post("/events/ingest", {
			body,
			...options
		});
	}
	/**
	* Fetch events from your account with powerful filtering capabilities. This
	* endpoint is ideal for:
	*
	* - Debugging event ingestion issues
	* - Analyzing customer usage patterns
	* - Building custom analytics dashboards
	* - Auditing billing-related events
	*
	* ## Filtering Options:
	*
	* - **Customer filtering**: Filter by specific customer ID
	* - **Event name filtering**: Filter by event type/name
	* - **Meter-based filtering**: Use a meter ID to apply the meter's event name and
	*   filter criteria automatically
	* - **Time range filtering**: Filter events within a specific date range
	* - **Pagination**: Navigate through large result sets
	*
	* ## Meter Integration:
	*
	* When using `meter_id`, the endpoint automatically applies:
	*
	* - The meter's configured `event_name` filter
	* - The meter's custom filter criteria (if any)
	* - If you also provide `event_name`, it must match the meter's event name
	*
	* ## Example Queries:
	*
	* - Get all events for a customer: `?customer_id=cus_abc123`
	* - Get API request events: `?event_name=api_request`
	* - Get events from last 24 hours:
	*   `?start=2024-01-14T10:30:00Z&end=2024-01-15T10:30:00Z`
	* - Get events with meter filtering: `?meter_id=mtr_xyz789`
	* - Paginate results: `?page_size=50&page_number=2`
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/events", DefaultPageNumberPagination, {
			query,
			...options
		});
	}
	/**
	* Fetch detailed information about a single event using its unique event ID. This
	* endpoint is useful for:
	*
	* - Debugging specific event ingestion issues
	* - Retrieving event details for customer support
	* - Validating that events were processed correctly
	* - Getting the complete metadata for an event
	*
	* ## Event ID Format:
	*
	* The event ID should be the same value that was provided during event ingestion
	* via the `/events/ingest` endpoint. Event IDs are case-sensitive and must match
	* exactly.
	*
	* ## Response Details:
	*
	* The response includes all event data including:
	*
	* - Complete metadata key-value pairs
	* - Original timestamp (preserved from ingestion)
	* - Customer and business association
	* - Event name and processing information
	*
	* ## Example Usage:
	*
	* ```text
	* GET /events/api_call_12345
	* ```
	*/
	retrieve(eventID, options) {
		return this._client.get(path$1`/events/${eventID}`, options);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/webhook-events.mjs
var WebhookEvents = class extends APIResource {};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/webhooks/headers.mjs
var Headers$1 = class extends APIResource {
	/**
	* Get a webhook by id
	*
	* @example
	* ```ts
	* const header = await client.webhooks.headers.retrieve(
	*   'whk_YdWqVEGKmSYKbsIyDxEab',
	* );
	* ```
	*/
	retrieve(webhookID, options) {
		return this._client.get(path$1`/webhooks/${webhookID}/headers`, options);
	}
	/**
	* Patch a webhook by id
	*
	* @example
	* ```ts
	* await client.webhooks.headers.update(
	*   'whk_YdWqVEGKmSYKbsIyDxEab',
	*   { headers: { foo: 'string' } },
	* );
	* ```
	*/
	update(webhookID, body, options) {
		return this._client.patch(path$1`/webhooks/${webhookID}/headers`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/standardwebhooks@1.0.0/node_modules/standardwebhooks/dist/timing_safe_equal.js
var require_timing_safe_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timingSafeEqual = void 0;
	function assert(expr, msg = "") {
		if (!expr) throw new Error(msg);
	}
	function timingSafeEqual(a, b) {
		if (a.byteLength !== b.byteLength) return false;
		if (!(a instanceof DataView)) a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
		if (!(b instanceof DataView)) b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
		assert(a instanceof DataView);
		assert(b instanceof DataView);
		const length = a.byteLength;
		let out = 0;
		let i = -1;
		while (++i < length) out |= a.getUint8(i) ^ b.getUint8(i);
		return out === 0;
	}
	exports.timingSafeEqual = timingSafeEqual;
}));

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+base64@1.0.1/node_modules/@stablelib/base64/lib/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (b$1.hasOwnProperty(p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Package base64 implements Base64 encoding and decoding.
	*/
	var INVALID_BYTE = 256;
	/**
	* Implements standard Base64 encoding.
	*
	* Operates in constant time.
	*/
	var Coder = function() {
		function Coder(_paddingCharacter) {
			if (_paddingCharacter === void 0) _paddingCharacter = "=";
			this._paddingCharacter = _paddingCharacter;
		}
		Coder.prototype.encodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 8 + 5) / 6 | 0;
			return (length + 2) / 3 * 4 | 0;
		};
		Coder.prototype.encode = function(data) {
			var out = "";
			var i = 0;
			for (; i < data.length - 2; i += 3) {
				var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
				out += this._encodeByte(c >>> 18 & 63);
				out += this._encodeByte(c >>> 12 & 63);
				out += this._encodeByte(c >>> 6 & 63);
				out += this._encodeByte(c >>> 0 & 63);
			}
			var left = data.length - i;
			if (left > 0) {
				var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
				out += this._encodeByte(c >>> 18 & 63);
				out += this._encodeByte(c >>> 12 & 63);
				if (left === 2) out += this._encodeByte(c >>> 6 & 63);
				else out += this._paddingCharacter || "";
				out += this._paddingCharacter || "";
			}
			return out;
		};
		Coder.prototype.maxDecodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 6 + 7) / 8 | 0;
			return length / 4 * 3 | 0;
		};
		Coder.prototype.decodedLength = function(s) {
			return this.maxDecodedLength(s.length - this._getPaddingLength(s));
		};
		Coder.prototype.decode = function(s) {
			if (s.length === 0) return new Uint8Array(0);
			var paddingLength = this._getPaddingLength(s);
			var length = s.length - paddingLength;
			var out = new Uint8Array(this.maxDecodedLength(length));
			var op = 0;
			var i = 0;
			var haveBad = 0;
			var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
			for (; i < length - 4; i += 4) {
				v0 = this._decodeChar(s.charCodeAt(i + 0));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v0 << 2 | v1 >>> 4;
				out[op++] = v1 << 4 | v2 >>> 2;
				out[op++] = v2 << 6 | v3;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
				haveBad |= v2 & INVALID_BYTE;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (i < length - 1) {
				v0 = this._decodeChar(s.charCodeAt(i));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				out[op++] = v0 << 2 | v1 >>> 4;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
			}
			if (i < length - 2) {
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				out[op++] = v1 << 4 | v2 >>> 2;
				haveBad |= v2 & INVALID_BYTE;
			}
			if (i < length - 3) {
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v2 << 6 | v3;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (haveBad !== 0) throw new Error("Base64Coder: incorrect characters for decoding");
			return out;
		};
		Coder.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -15;
			result += 62 - b >>> 8 & 3;
			return String.fromCharCode(result);
		};
		Coder.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
			result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		Coder.prototype._getPaddingLength = function(s) {
			var paddingLength = 0;
			if (this._paddingCharacter) {
				for (var i = s.length - 1; i >= 0; i--) {
					if (s[i] !== this._paddingCharacter) break;
					paddingLength++;
				}
				if (s.length < 4 || paddingLength > 2) throw new Error("Base64Coder: incorrect padding");
			}
			return paddingLength;
		};
		return Coder;
	}();
	exports.Coder = Coder;
	var stdCoder = new Coder();
	function encode(data) {
		return stdCoder.encode(data);
	}
	exports.encode = encode;
	function decode(s) {
		return stdCoder.decode(s);
	}
	exports.decode = decode;
	/**
	* Implements URL-safe Base64 encoding.
	* (Same as Base64, but '+' is replaced with '-', and '/' with '_').
	*
	* Operates in constant time.
	*/
	var URLSafeCoder = function(_super) {
		__extends(URLSafeCoder, _super);
		function URLSafeCoder() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		URLSafeCoder.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -13;
			result += 62 - b >>> 8 & 49;
			return String.fromCharCode(result);
		};
		URLSafeCoder.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
			result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		return URLSafeCoder;
	}(Coder);
	exports.URLSafeCoder = URLSafeCoder;
	var urlSafeCoder = new URLSafeCoder();
	function encodeURLSafe(data) {
		return urlSafeCoder.encode(data);
	}
	exports.encodeURLSafe = encodeURLSafe;
	function decodeURLSafe(s) {
		return urlSafeCoder.decode(s);
	}
	exports.decodeURLSafe = decodeURLSafe;
	exports.encodedLength = function(length) {
		return stdCoder.encodedLength(length);
	};
	exports.maxDecodedLength = function(length) {
		return stdCoder.maxDecodedLength(length);
	};
	exports.decodedLength = function(s) {
		return stdCoder.decodedLength(s);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-sha256@1.3.0/node_modules/fast-sha256/sha256.js
var require_sha256 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		var exports$1 = {};
		factory(exports$1);
		var sha256$1 = exports$1["default"];
		for (var k in exports$1) sha256$1[k] = exports$1[k];
		if (typeof module === "object" && typeof module.exports === "object") module.exports = sha256$1;
		else if (typeof define === "function" && define.amd) define(function() {
			return sha256$1;
		});
		else root.sha256 = sha256$1;
	})(exports, function(exports$1) {
		"use strict";
		exports$1.__esModule = true;
		exports$1.digestLength = 32;
		exports$1.blockSize = 64;
		var K = new Uint32Array([
			1116352408,
			1899447441,
			3049323471,
			3921009573,
			961987163,
			1508970993,
			2453635748,
			2870763221,
			3624381080,
			310598401,
			607225278,
			1426881987,
			1925078388,
			2162078206,
			2614888103,
			3248222580,
			3835390401,
			4022224774,
			264347078,
			604807628,
			770255983,
			1249150122,
			1555081692,
			1996064986,
			2554220882,
			2821834349,
			2952996808,
			3210313671,
			3336571891,
			3584528711,
			113926993,
			338241895,
			666307205,
			773529912,
			1294757372,
			1396182291,
			1695183700,
			1986661051,
			2177026350,
			2456956037,
			2730485921,
			2820302411,
			3259730800,
			3345764771,
			3516065817,
			3600352804,
			4094571909,
			275423344,
			430227734,
			506948616,
			659060556,
			883997877,
			958139571,
			1322822218,
			1537002063,
			1747873779,
			1955562222,
			2024104815,
			2227730452,
			2361852424,
			2428436474,
			2756734187,
			3204031479,
			3329325298
		]);
		function hashBlocks(w, v, p, pos, len) {
			var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
			while (len >= 64) {
				a = v[0];
				b = v[1];
				c = v[2];
				d = v[3];
				e = v[4];
				f = v[5];
				g = v[6];
				h = v[7];
				for (i = 0; i < 16; i++) {
					j = pos + i * 4;
					w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
				}
				for (i = 16; i < 64; i++) {
					u = w[i - 2];
					t1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
					u = w[i - 15];
					t2 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
					w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
				}
				for (i = 0; i < 64; i++) {
					t1 = (((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
					t2 = ((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + (a & b ^ a & c ^ b & c) | 0;
					h = g;
					g = f;
					f = e;
					e = d + t1 | 0;
					d = c;
					c = b;
					b = a;
					a = t1 + t2 | 0;
				}
				v[0] += a;
				v[1] += b;
				v[2] += c;
				v[3] += d;
				v[4] += e;
				v[5] += f;
				v[6] += g;
				v[7] += h;
				pos += 64;
				len -= 64;
			}
			return pos;
		}
		var Hash = function() {
			function Hash$1() {
				this.digestLength = exports$1.digestLength;
				this.blockSize = exports$1.blockSize;
				this.state = new Int32Array(8);
				this.temp = new Int32Array(64);
				this.buffer = new Uint8Array(128);
				this.bufferLength = 0;
				this.bytesHashed = 0;
				this.finished = false;
				this.reset();
			}
			Hash$1.prototype.reset = function() {
				this.state[0] = 1779033703;
				this.state[1] = 3144134277;
				this.state[2] = 1013904242;
				this.state[3] = 2773480762;
				this.state[4] = 1359893119;
				this.state[5] = 2600822924;
				this.state[6] = 528734635;
				this.state[7] = 1541459225;
				this.bufferLength = 0;
				this.bytesHashed = 0;
				this.finished = false;
				return this;
			};
			Hash$1.prototype.clean = function() {
				for (var i = 0; i < this.buffer.length; i++) this.buffer[i] = 0;
				for (var i = 0; i < this.temp.length; i++) this.temp[i] = 0;
				this.reset();
			};
			Hash$1.prototype.update = function(data, dataLength) {
				if (dataLength === void 0) dataLength = data.length;
				if (this.finished) throw new Error("SHA256: can't update because hash was finished.");
				var dataPos = 0;
				this.bytesHashed += dataLength;
				if (this.bufferLength > 0) {
					while (this.bufferLength < 64 && dataLength > 0) {
						this.buffer[this.bufferLength++] = data[dataPos++];
						dataLength--;
					}
					if (this.bufferLength === 64) {
						hashBlocks(this.temp, this.state, this.buffer, 0, 64);
						this.bufferLength = 0;
					}
				}
				if (dataLength >= 64) {
					dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
					dataLength %= 64;
				}
				while (dataLength > 0) {
					this.buffer[this.bufferLength++] = data[dataPos++];
					dataLength--;
				}
				return this;
			};
			Hash$1.prototype.finish = function(out) {
				if (!this.finished) {
					var bytesHashed = this.bytesHashed;
					var left = this.bufferLength;
					var bitLenHi = bytesHashed / 536870912 | 0;
					var bitLenLo = bytesHashed << 3;
					var padLength = bytesHashed % 64 < 56 ? 64 : 128;
					this.buffer[left] = 128;
					for (var i = left + 1; i < padLength - 8; i++) this.buffer[i] = 0;
					this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
					this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
					this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
					this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
					this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
					this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
					this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
					this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
					hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
					this.finished = true;
				}
				for (var i = 0; i < 8; i++) {
					out[i * 4 + 0] = this.state[i] >>> 24 & 255;
					out[i * 4 + 1] = this.state[i] >>> 16 & 255;
					out[i * 4 + 2] = this.state[i] >>> 8 & 255;
					out[i * 4 + 3] = this.state[i] >>> 0 & 255;
				}
				return this;
			};
			Hash$1.prototype.digest = function() {
				var out = new Uint8Array(this.digestLength);
				this.finish(out);
				return out;
			};
			Hash$1.prototype._saveState = function(out) {
				for (var i = 0; i < this.state.length; i++) out[i] = this.state[i];
			};
			Hash$1.prototype._restoreState = function(from, bytesHashed) {
				for (var i = 0; i < this.state.length; i++) this.state[i] = from[i];
				this.bytesHashed = bytesHashed;
				this.finished = false;
				this.bufferLength = 0;
			};
			return Hash$1;
		}();
		exports$1.Hash = Hash;
		var HMAC = function() {
			function HMAC$1(key) {
				this.inner = new Hash();
				this.outer = new Hash();
				this.blockSize = this.inner.blockSize;
				this.digestLength = this.inner.digestLength;
				var pad = new Uint8Array(this.blockSize);
				if (key.length > this.blockSize) new Hash().update(key).finish(pad).clean();
				else for (var i = 0; i < key.length; i++) pad[i] = key[i];
				for (var i = 0; i < pad.length; i++) pad[i] ^= 54;
				this.inner.update(pad);
				for (var i = 0; i < pad.length; i++) pad[i] ^= 106;
				this.outer.update(pad);
				this.istate = new Uint32Array(8);
				this.ostate = new Uint32Array(8);
				this.inner._saveState(this.istate);
				this.outer._saveState(this.ostate);
				for (var i = 0; i < pad.length; i++) pad[i] = 0;
			}
			HMAC$1.prototype.reset = function() {
				this.inner._restoreState(this.istate, this.inner.blockSize);
				this.outer._restoreState(this.ostate, this.outer.blockSize);
				return this;
			};
			HMAC$1.prototype.clean = function() {
				for (var i = 0; i < this.istate.length; i++) this.ostate[i] = this.istate[i] = 0;
				this.inner.clean();
				this.outer.clean();
			};
			HMAC$1.prototype.update = function(data) {
				this.inner.update(data);
				return this;
			};
			HMAC$1.prototype.finish = function(out) {
				if (this.outer.finished) this.outer.finish(out);
				else {
					this.inner.finish(out);
					this.outer.update(out, this.digestLength).finish(out);
				}
				return this;
			};
			HMAC$1.prototype.digest = function() {
				var out = new Uint8Array(this.digestLength);
				this.finish(out);
				return out;
			};
			return HMAC$1;
		}();
		exports$1.HMAC = HMAC;
		function hash(data) {
			var h = new Hash().update(data);
			var digest = h.digest();
			h.clean();
			return digest;
		}
		exports$1.hash = hash;
		exports$1["default"] = hash;
		function hmac(key, data) {
			var h = new HMAC(key).update(data);
			var digest = h.digest();
			h.clean();
			return digest;
		}
		exports$1.hmac = hmac;
		function fillBuffer(buffer, hmac$1, info, counter) {
			var num = counter[0];
			if (num === 0) throw new Error("hkdf: cannot expand more");
			hmac$1.reset();
			if (num > 1) hmac$1.update(buffer);
			if (info) hmac$1.update(info);
			hmac$1.update(counter);
			hmac$1.finish(buffer);
			counter[0]++;
		}
		var hkdfSalt = new Uint8Array(exports$1.digestLength);
		function hkdf(key, salt, info, length) {
			if (salt === void 0) salt = hkdfSalt;
			if (length === void 0) length = 32;
			var counter = new Uint8Array([1]);
			var hmac_ = new HMAC(hmac(salt, key));
			var buffer = new Uint8Array(hmac_.digestLength);
			var bufpos = buffer.length;
			var out = new Uint8Array(length);
			for (var i = 0; i < length; i++) {
				if (bufpos === buffer.length) {
					fillBuffer(buffer, hmac_, info, counter);
					bufpos = 0;
				}
				out[i] = buffer[bufpos++];
			}
			hmac_.clean();
			buffer.fill(0);
			counter.fill(0);
			return out;
		}
		exports$1.hkdf = hkdf;
		function pbkdf2(password, salt, iterations, dkLen) {
			var prf = new HMAC(password);
			var len = prf.digestLength;
			var ctr = new Uint8Array(4);
			var t = new Uint8Array(len);
			var u = new Uint8Array(len);
			var dk = new Uint8Array(dkLen);
			for (var i = 0; i * len < dkLen; i++) {
				var c = i + 1;
				ctr[0] = c >>> 24 & 255;
				ctr[1] = c >>> 16 & 255;
				ctr[2] = c >>> 8 & 255;
				ctr[3] = c >>> 0 & 255;
				prf.reset();
				prf.update(salt);
				prf.update(ctr);
				prf.finish(u);
				for (var j = 0; j < len; j++) t[j] = u[j];
				for (var j = 2; j <= iterations; j++) {
					prf.reset();
					prf.update(u).finish(u);
					for (var k = 0; k < len; k++) t[k] ^= u[k];
				}
				for (var j = 0; j < len && i * len + j < dkLen; j++) dk[i * len + j] = t[j];
			}
			for (var i = 0; i < len; i++) t[i] = u[i] = 0;
			for (var i = 0; i < 4; i++) ctr[i] = 0;
			prf.clean();
			return dk;
		}
		exports$1.pbkdf2 = pbkdf2;
	});
}));

//#endregion
//#region ../../node_modules/.pnpm/standardwebhooks@1.0.0/node_modules/standardwebhooks/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Webhook = exports.WebhookVerificationError = void 0;
	const timing_safe_equal_1 = require_timing_safe_equal();
	const base64 = require_base64();
	const sha256 = require_sha256();
	const WEBHOOK_TOLERANCE_IN_SECONDS = 300;
	var ExtendableError = class ExtendableError extends Error {
		constructor(message) {
			super(message);
			Object.setPrototypeOf(this, ExtendableError.prototype);
			this.name = "ExtendableError";
			this.stack = new Error(message).stack;
		}
	};
	var WebhookVerificationError = class WebhookVerificationError extends ExtendableError {
		constructor(message) {
			super(message);
			Object.setPrototypeOf(this, WebhookVerificationError.prototype);
			this.name = "WebhookVerificationError";
		}
	};
	exports.WebhookVerificationError = WebhookVerificationError;
	var Webhook = class Webhook {
		constructor(secret, options) {
			if (!secret) throw new Error("Secret can't be empty.");
			if ((options === null || options === void 0 ? void 0 : options.format) === "raw") if (secret instanceof Uint8Array) this.key = secret;
			else this.key = Uint8Array.from(secret, (c) => c.charCodeAt(0));
			else {
				if (typeof secret !== "string") throw new Error("Expected secret to be of type string");
				if (secret.startsWith(Webhook.prefix)) secret = secret.substring(Webhook.prefix.length);
				this.key = base64.decode(secret);
			}
		}
		verify(payload, headers_) {
			const headers = {};
			for (const key of Object.keys(headers_)) headers[key.toLowerCase()] = headers_[key];
			const msgId = headers["webhook-id"];
			const msgSignature = headers["webhook-signature"];
			const msgTimestamp = headers["webhook-timestamp"];
			if (!msgSignature || !msgId || !msgTimestamp) throw new WebhookVerificationError("Missing required headers");
			const timestamp = this.verifyTimestamp(msgTimestamp);
			const expectedSignature = this.sign(msgId, timestamp, payload).split(",")[1];
			const passedSignatures = msgSignature.split(" ");
			const encoder = new globalThis.TextEncoder();
			for (const versionedSignature of passedSignatures) {
				const [version$1, signature] = versionedSignature.split(",");
				if (version$1 !== "v1") continue;
				if ((0, timing_safe_equal_1.timingSafeEqual)(encoder.encode(signature), encoder.encode(expectedSignature))) return JSON.parse(payload.toString());
			}
			throw new WebhookVerificationError("No matching signature found");
		}
		sign(msgId, timestamp, payload) {
			if (typeof payload === "string") {} else if (payload.constructor.name === "Buffer") payload = payload.toString();
			else throw new Error("Expected payload to be of type string or Buffer.");
			const encoder = new TextEncoder();
			const timestampNumber = Math.floor(timestamp.getTime() / 1e3);
			const toSign = encoder.encode(`${msgId}.${timestampNumber}.${payload}`);
			return `v1,${base64.encode(sha256.hmac(this.key, toSign))}`;
		}
		verifyTimestamp(timestampHeader) {
			const now = Math.floor(Date.now() / 1e3);
			const timestamp = parseInt(timestampHeader, 10);
			if (isNaN(timestamp)) throw new WebhookVerificationError("Invalid Signature Headers");
			if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) throw new WebhookVerificationError("Message timestamp too old");
			if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) throw new WebhookVerificationError("Message timestamp too new");
			return /* @__PURE__ */ new Date(timestamp * 1e3);
		}
	};
	exports.Webhook = Webhook;
	Webhook.prefix = "whsec_";
}));

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/resources/webhooks/webhooks.mjs
var import_dist = require_dist();
var Webhooks = class extends APIResource {
	constructor() {
		super(...arguments);
		this.headers = new Headers$1(this._client);
	}
	/**
	* List all webhooks
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const webhookDetails of client.webhooks.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/webhooks", CursorPagePagination, {
			query,
			...options
		});
	}
	/**
	* Create a new webhook
	*
	* @example
	* ```ts
	* const webhookDetails = await client.webhooks.create({
	*   url: 'url',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/webhooks", {
			body,
			...options
		});
	}
	/**
	* Get a webhook by id
	*
	* @example
	* ```ts
	* const webhookDetails = await client.webhooks.retrieve(
	*   'whk_YdWqVEGKmSYKbsIyDxEab',
	* );
	* ```
	*/
	retrieve(webhookID, options) {
		return this._client.get(path$1`/webhooks/${webhookID}`, options);
	}
	/**
	* Delete a webhook by id
	*
	* @example
	* ```ts
	* await client.webhooks.delete('whk_YdWqVEGKmSYKbsIyDxEab');
	* ```
	*/
	delete(webhookID, options) {
		return this._client.delete(path$1`/webhooks/${webhookID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Patch a webhook by id
	*
	* @example
	* ```ts
	* const webhookDetails = await client.webhooks.update(
	*   'whk_YdWqVEGKmSYKbsIyDxEab',
	* );
	* ```
	*/
	update(webhookID, body, options) {
		return this._client.patch(path$1`/webhooks/${webhookID}`, {
			body,
			...options
		});
	}
	/**
	* Get webhook secret by id
	*
	* @example
	* ```ts
	* const response = await client.webhooks.retrieveSecret(
	*   'whk_YdWqVEGKmSYKbsIyDxEab',
	* );
	* ```
	*/
	retrieveSecret(webhookID, options) {
		return this._client.get(path$1`/webhooks/${webhookID}/secret`, options);
	}
	unwrap(body, { headers, key }) {
		if (headers !== void 0) {
			const keyStr = key === void 0 ? this._client.webhookKey : key;
			if (keyStr === null) throw new Error("Webhook key must not be null in order to unwrap");
			new import_dist.Webhook(keyStr).verify(body, headers);
		}
		return JSON.parse(body);
	}
	unsafeUnwrap(body) {
		return JSON.parse(body);
	}
};
Webhooks.Headers = Headers$1;

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/internal/utils/env.mjs
/**
* Read an environment variable.
*
* Trims beginning and trailing whitespace.
*
* Will return undefined if the environment variable doesn't exist or cannot be accessed.
*/
const readEnv = (env$1) => {
	if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env$1]?.trim() || void 0;
	if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env$1)?.trim() || void 0;
};

//#endregion
//#region ../../node_modules/.pnpm/dodopayments@2.43.0/node_modules/dodopayments/client.mjs
var _DodoPayments_instances, _a, _DodoPayments_encoder, _DodoPayments_baseURLOverridden;
const environments = {
	live_mode: "https://live.dodopayments.com",
	test_mode: "https://test.dodopayments.com"
};
/**
* API Client for interfacing with the Dodo Payments API.
*/
var DodoPayments = class {
	/**
	* API Client for interfacing with the Dodo Payments API.
	*
	* @param {string | undefined} [opts.bearerToken=process.env['DODO_PAYMENTS_API_KEY'] ?? undefined]
	* @param {string | null | undefined} [opts.webhookKey=process.env['DODO_PAYMENTS_WEBHOOK_KEY'] ?? null]
	* @param {Environment} [opts.environment=live_mode] - Specifies the environment URL to use for the API.
	* @param {string} [opts.baseURL=process.env['DODO_PAYMENTS_BASE_URL'] ?? https://live.dodopayments.com] - Override the default base URL for the API.
	* @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
	* @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
	* @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
	* @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
	* @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
	* @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
	*/
	constructor({ baseURL = readEnv("DODO_PAYMENTS_BASE_URL"), bearerToken = readEnv("DODO_PAYMENTS_API_KEY"), webhookKey = readEnv("DODO_PAYMENTS_WEBHOOK_KEY") ?? null, ...opts } = {}) {
		_DodoPayments_instances.add(this);
		_DodoPayments_encoder.set(this, void 0);
		this.checkoutSessions = new CheckoutSessions(this);
		this.payments = new Payments(this);
		this.subscriptions = new Subscriptions(this);
		this.invoices = new Invoices(this);
		this.licenses = new Licenses(this);
		this.licenseKeys = new LicenseKeys(this);
		this.licenseKeyInstances = new LicenseKeyInstances(this);
		this.customers = new Customers(this);
		this.refunds = new Refunds(this);
		this.disputes = new Disputes(this);
		this.payouts = new Payouts(this);
		this.products = new Products(this);
		this.misc = new Misc(this);
		this.discounts = new Discounts(this);
		this.addons = new Addons(this);
		this.brands = new Brands(this);
		this.webhooks = new Webhooks(this);
		this.webhookEvents = new WebhookEvents(this);
		this.usageEvents = new UsageEvents(this);
		this.meters = new Meters(this);
		this.balances = new Balances$1(this);
		this.creditEntitlements = new CreditEntitlements(this);
		this.entitlements = new Entitlements(this);
		this.productCollections = new ProductCollections(this);
		if (bearerToken === void 0) throw new DodoPaymentsError("The DODO_PAYMENTS_API_KEY environment variable is missing or empty; either provide it, or instantiate the DodoPayments client with an bearerToken option, like new DodoPayments({ bearerToken: 'My Bearer Token' }).");
		const options = {
			bearerToken,
			webhookKey,
			...opts,
			baseURL,
			environment: opts.environment ?? "live_mode"
		};
		if (baseURL && opts.environment) throw new DodoPaymentsError("Ambiguous URL; The `baseURL` option (or DODO_PAYMENTS_BASE_URL env var) and the `environment` option are given. If you want to use the environment you must pass baseURL: null");
		this.baseURL = options.baseURL || environments[options.environment || "live_mode"];
		this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
		this.logger = options.logger ?? console;
		const defaultLogLevel = "warn";
		this.logLevel = defaultLogLevel;
		this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("DODO_PAYMENTS_LOG"), "process.env['DODO_PAYMENTS_LOG']", this) ?? defaultLogLevel;
		this.fetchOptions = options.fetchOptions;
		this.maxRetries = options.maxRetries ?? 2;
		this.fetch = options.fetch ?? getDefaultFetch();
		__classPrivateFieldSet(this, _DodoPayments_encoder, FallbackEncoder, "f");
		const customHeadersEnv = readEnv("DODO_PAYMENTS_CUSTOM_HEADERS");
		if (customHeadersEnv) {
			const parsed = {};
			for (const line of customHeadersEnv.split("\n")) {
				const colon = line.indexOf(":");
				if (colon >= 0) parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
			}
			options.defaultHeaders = {
				...parsed,
				...options.defaultHeaders
			};
		}
		this._options = options;
		this.bearerToken = bearerToken;
		this.webhookKey = webhookKey;
	}
	/**
	* Create a new client instance re-using the same options given to the current client with optional overriding.
	*/
	withOptions(options) {
		return new this.constructor({
			...this._options,
			environment: options.environment ? options.environment : void 0,
			baseURL: options.environment ? void 0 : this.baseURL,
			maxRetries: this.maxRetries,
			timeout: this.timeout,
			logger: this.logger,
			logLevel: this.logLevel,
			fetch: this.fetch,
			fetchOptions: this.fetchOptions,
			bearerToken: this.bearerToken,
			webhookKey: this.webhookKey,
			...options
		});
	}
	defaultQuery() {
		return this._options.defaultQuery;
	}
	validateHeaders({ values, nulls }) {}
	async authHeaders(opts) {
		return buildHeaders([{ Authorization: `Bearer ${this.bearerToken}` }]);
	}
	/**
	* Basic re-implementation of `qs.stringify` for primitive types.
	*/
	stringifyQuery(query) {
		return stringifyQuery(query);
	}
	getUserAgent() {
		return `${this.constructor.name}/JS ${VERSION}`;
	}
	defaultIdempotencyKey() {
		return `stainless-node-retry-${uuid4()}`;
	}
	makeStatusError(status, error, message, headers) {
		return APIError.generate(status, error, message, headers);
	}
	buildURL(path$2, query, defaultBaseURL) {
		const baseURL = !__classPrivateFieldGet(this, _DodoPayments_instances, "m", _DodoPayments_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
		const url = isAbsoluteURL(path$2) ? new URL(path$2) : new URL(baseURL + (baseURL.endsWith("/") && path$2.startsWith("/") ? path$2.slice(1) : path$2));
		const defaultQuery = this.defaultQuery();
		const pathQuery = Object.fromEntries(url.searchParams);
		if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) query = {
			...pathQuery,
			...defaultQuery,
			...query
		};
		if (typeof query === "object" && query && !Array.isArray(query)) url.search = this.stringifyQuery(query);
		return url.toString();
	}
	/**
	* Used as a callback for mutating the given `FinalRequestOptions` object.
	*/
	async prepareOptions(options) {}
	/**
	* Used as a callback for mutating the given `RequestInit` object.
	*
	* This is useful for cases where you want to add certain headers based off of
	* the request properties, e.g. `method` or `url`.
	*/
	async prepareRequest(request, { url, options }) {}
	get(path$2, opts) {
		return this.methodRequest("get", path$2, opts);
	}
	post(path$2, opts) {
		return this.methodRequest("post", path$2, opts);
	}
	patch(path$2, opts) {
		return this.methodRequest("patch", path$2, opts);
	}
	put(path$2, opts) {
		return this.methodRequest("put", path$2, opts);
	}
	delete(path$2, opts) {
		return this.methodRequest("delete", path$2, opts);
	}
	methodRequest(method, path$2, opts) {
		return this.request(Promise.resolve(opts).then((opts$1) => {
			return {
				method,
				path: path$2,
				...opts$1
			};
		}));
	}
	request(options, remainingRetries = null) {
		return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
	}
	async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
		const options = await optionsInput;
		const maxRetries = options.maxRetries ?? this.maxRetries;
		if (retriesRemaining == null) retriesRemaining = maxRetries;
		await this.prepareOptions(options);
		const { req, url, timeout } = await this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
		await this.prepareRequest(req, {
			url,
			options
		});
		/** Not an API request ID, just for correlating local log entries. */
		const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
		const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
		const startTime = Date.now();
		loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
			retryOfRequestLogID,
			method: options.method,
			url,
			options,
			headers: req.headers
		}));
		if (options.signal?.aborted) throw new APIUserAbortError();
		const controller = new AbortController();
		const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
		const headersTime = Date.now();
		if (response instanceof globalThis.Error) {
			const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
			if (options.signal?.aborted) throw new APIUserAbortError();
			const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
			if (retriesRemaining) {
				loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url,
					durationMs: headersTime - startTime,
					message: response.message
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
			loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
				retryOfRequestLogID,
				url,
				durationMs: headersTime - startTime,
				message: response.message
			}));
			if (isTimeout) throw new APIConnectionTimeoutError();
			throw new APIConnectionError({ cause: response });
		}
		const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
		if (!response.ok) {
			const shouldRetry = await this.shouldRetry(response);
			if (retriesRemaining && shouldRetry) {
				const retryMessage$1 = `retrying, ${retriesRemaining} attempts remaining`;
				await CancelReadableStream(response.body);
				loggerFor(this).info(`${responseInfo} - ${retryMessage$1}`);
				loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage$1})`, formatRequestDetails({
					retryOfRequestLogID,
					url: response.url,
					status: response.status,
					headers: response.headers,
					durationMs: headersTime - startTime
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
			}
			const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
			loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
			const errText = await response.text().catch((err) => castToError(err).message);
			const errJSON = safeJSON(errText);
			const errMessage = errJSON ? void 0 : errText;
			loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
				retryOfRequestLogID,
				url: response.url,
				status: response.status,
				headers: response.headers,
				message: errMessage,
				durationMs: Date.now() - startTime
			}));
			throw this.makeStatusError(response.status, errJSON, errMessage, response.headers);
		}
		loggerFor(this).info(responseInfo);
		loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
			retryOfRequestLogID,
			url: response.url,
			status: response.status,
			headers: response.headers,
			durationMs: headersTime - startTime
		}));
		return {
			response,
			options,
			controller,
			requestLogID,
			retryOfRequestLogID,
			startTime
		};
	}
	getAPIList(path$2, Page, opts) {
		return this.requestAPIList(Page, opts && "then" in opts ? opts.then((opts$1) => ({
			method: "get",
			path: path$2,
			...opts$1
		})) : {
			method: "get",
			path: path$2,
			...opts
		});
	}
	requestAPIList(Page, options) {
		const request = this.makeRequest(options, null, void 0);
		return new PagePromise(this, request, Page);
	}
	async fetchWithTimeout(url, init$1, ms, controller) {
		const { signal, method, ...options } = init$1 || {};
		const abort = this._makeAbort(controller);
		if (signal) signal.addEventListener("abort", abort, { once: true });
		const timeout = setTimeout(abort, ms);
		const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
		const fetchOptions = {
			signal: controller.signal,
			...isReadableBody ? { duplex: "half" } : {},
			method: "GET",
			...options
		};
		if (method) fetchOptions.method = method.toUpperCase();
		try {
			return await this.fetch.call(void 0, url, fetchOptions);
		} finally {
			clearTimeout(timeout);
		}
	}
	async shouldRetry(response) {
		const shouldRetryHeader = response.headers.get("x-should-retry");
		if (shouldRetryHeader === "true") return true;
		if (shouldRetryHeader === "false") return false;
		if (response.status === 408) return true;
		if (response.status === 409) return true;
		if (response.status === 429) return true;
		if (response.status >= 500) return true;
		return false;
	}
	async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
		let timeoutMillis;
		const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
		if (retryAfterMillisHeader) {
			const timeoutMs = parseFloat(retryAfterMillisHeader);
			if (!Number.isNaN(timeoutMs)) timeoutMillis = timeoutMs;
		}
		const retryAfterHeader = responseHeaders?.get("retry-after");
		if (retryAfterHeader && !timeoutMillis) {
			const timeoutSeconds = parseFloat(retryAfterHeader);
			if (!Number.isNaN(timeoutSeconds)) timeoutMillis = timeoutSeconds * 1e3;
			else timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
		}
		if (timeoutMillis === void 0) {
			const maxRetries = options.maxRetries ?? this.maxRetries;
			timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
		}
		await sleep(timeoutMillis);
		return this.makeRequest(options, retriesRemaining - 1, requestLogID);
	}
	calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
		const initialRetryDelay = .5;
		const maxRetryDelay = 8;
		const numRetries = maxRetries - retriesRemaining;
		return Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay) * (1 - Math.random() * .25) * 1e3;
	}
	async buildRequest(inputOptions, { retryCount = 0 } = {}) {
		const options = { ...inputOptions };
		const { method, path: path$2, query, defaultBaseURL } = options;
		const url = this.buildURL(path$2, query, defaultBaseURL);
		if ("timeout" in options) validatePositiveInteger("timeout", options.timeout);
		options.timeout = options.timeout ?? this.timeout;
		const { bodyHeaders, body } = this.buildBody({ options });
		return {
			req: {
				method,
				headers: await this.buildHeaders({
					options: inputOptions,
					method,
					bodyHeaders,
					retryCount
				}),
				...options.signal && { signal: options.signal },
				...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
				...body && { body },
				...this.fetchOptions ?? {},
				...options.fetchOptions ?? {}
			},
			url,
			timeout: options.timeout
		};
	}
	async buildHeaders({ options, method, bodyHeaders, retryCount }) {
		let idempotencyHeaders = {};
		if (this.idempotencyHeader && method !== "get") {
			if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
			idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
		}
		const headers = buildHeaders([
			idempotencyHeaders,
			{
				Accept: "application/json",
				"User-Agent": this.getUserAgent(),
				"X-Stainless-Retry-Count": String(retryCount),
				...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
				...getPlatformHeaders()
			},
			await this.authHeaders(options),
			this._options.defaultHeaders,
			bodyHeaders,
			options.headers
		]);
		this.validateHeaders(headers);
		return headers.values;
	}
	_makeAbort(controller) {
		return () => controller.abort();
	}
	buildBody({ options: { body, headers: rawHeaders } }) {
		if (!body) return {
			bodyHeaders: void 0,
			body: void 0
		};
		const headers = buildHeaders([rawHeaders]);
		if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && headers.values.has("content-type") || globalThis.Blob && body instanceof globalThis.Blob || body instanceof FormData || body instanceof URLSearchParams || globalThis.ReadableStream && body instanceof globalThis.ReadableStream) return {
			bodyHeaders: void 0,
			body
		};
		else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) return {
			bodyHeaders: void 0,
			body: ReadableStreamFrom(body)
		};
		else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") return {
			bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
			body: this.stringifyQuery(body)
		};
		else return __classPrivateFieldGet(this, _DodoPayments_encoder, "f").call(this, {
			body,
			headers
		});
	}
};
_a = DodoPayments, _DodoPayments_encoder = /* @__PURE__ */ new WeakMap(), _DodoPayments_instances = /* @__PURE__ */ new WeakSet(), _DodoPayments_baseURLOverridden = function _DodoPayments_baseURLOverridden$1() {
	return this.baseURL !== environments[this._options.environment || "live_mode"];
};
DodoPayments.DodoPayments = _a;
DodoPayments.DEFAULT_TIMEOUT = 6e4;
DodoPayments.DodoPaymentsError = DodoPaymentsError;
DodoPayments.APIError = APIError;
DodoPayments.APIConnectionError = APIConnectionError;
DodoPayments.APIConnectionTimeoutError = APIConnectionTimeoutError;
DodoPayments.APIUserAbortError = APIUserAbortError;
DodoPayments.NotFoundError = NotFoundError;
DodoPayments.ConflictError = ConflictError;
DodoPayments.RateLimitError = RateLimitError;
DodoPayments.BadRequestError = BadRequestError;
DodoPayments.AuthenticationError = AuthenticationError;
DodoPayments.InternalServerError = InternalServerError;
DodoPayments.PermissionDeniedError = PermissionDeniedError;
DodoPayments.UnprocessableEntityError = UnprocessableEntityError;
DodoPayments.toFile = toFile;
DodoPayments.CheckoutSessions = CheckoutSessions;
DodoPayments.Payments = Payments;
DodoPayments.Subscriptions = Subscriptions;
DodoPayments.Invoices = Invoices;
DodoPayments.Licenses = Licenses;
DodoPayments.LicenseKeys = LicenseKeys;
DodoPayments.LicenseKeyInstances = LicenseKeyInstances;
DodoPayments.Customers = Customers;
DodoPayments.Refunds = Refunds;
DodoPayments.Disputes = Disputes;
DodoPayments.Payouts = Payouts;
DodoPayments.Products = Products;
DodoPayments.Misc = Misc;
DodoPayments.Discounts = Discounts;
DodoPayments.Addons = Addons;
DodoPayments.Brands = Brands;
DodoPayments.Webhooks = Webhooks;
DodoPayments.WebhookEvents = WebhookEvents;
DodoPayments.UsageEvents = UsageEvents;
DodoPayments.Meters = Meters;
DodoPayments.Balances = Balances$1;
DodoPayments.CreditEntitlements = CreditEntitlements;
DodoPayments.Entitlements = Entitlements;
DodoPayments.ProductCollections = ProductCollections;

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+core@0.3.13_zod@4.3.6/node_modules/@dodopayments/core/dist/chunk-IHA244I5.js
var checkoutQuerySchema = z$2.object({
	productId: z$2.string(),
	quantity: z$2.string().optional(),
	fullName: z$2.string().optional(),
	firstName: z$2.string().optional(),
	lastName: z$2.string().optional(),
	email: z$2.string().optional(),
	country: z$2.string().optional(),
	addressLine: z$2.string().optional(),
	city: z$2.string().optional(),
	state: z$2.string().optional(),
	zipCode: z$2.string().optional(),
	disableFullName: z$2.string().optional(),
	disableFirstName: z$2.string().optional(),
	disableLastName: z$2.string().optional(),
	disableEmail: z$2.string().optional(),
	disableCountry: z$2.string().optional(),
	disableAddressLine: z$2.string().optional(),
	disableCity: z$2.string().optional(),
	disableState: z$2.string().optional(),
	disableZipCode: z$2.string().optional(),
	paymentCurrency: z$2.string().optional(),
	showCurrencySelector: z$2.string().optional(),
	paymentAmount: z$2.string().optional(),
	showDiscounts: z$2.string().optional()
}).catchall(z$2.unknown());
var dynamicCheckoutBodySchema = z$2.object({
	product_id: z$2.string().optional(),
	quantity: z$2.number().optional(),
	product_cart: z$2.array(z$2.object({
		product_id: z$2.string(),
		quantity: z$2.number()
	})).optional(),
	billing: z$2.object({
		city: z$2.string(),
		country: z$2.string(),
		state: z$2.string(),
		street: z$2.string(),
		zipcode: z$2.string()
	}),
	customer: z$2.object({
		customer_id: z$2.string().optional(),
		email: z$2.string().optional(),
		name: z$2.string().optional()
	}),
	discount_id: z$2.string().optional(),
	addons: z$2.array(z$2.object({
		addon_id: z$2.string(),
		quantity: z$2.number()
	})).optional(),
	metadata: z$2.record(z$2.string(), z$2.union([
		z$2.string(),
		z$2.number(),
		z$2.boolean()
	])).optional(),
	currency: z$2.string().optional(),
	discount_code: z$2.string().optional(),
	discount_codes: z$2.array(z$2.string().min(1, "Discount code cannot be empty")).max(20, "At most 20 stacked discount codes are allowed").optional()
}).catchall(z$2.unknown());
var MAX_STACKED_DISCOUNT_CODES = 20;
var discountCodesSchema = z$2.array(z$2.string().min(1, "Discount code cannot be empty")).max(MAX_STACKED_DISCOUNT_CODES, `At most ${MAX_STACKED_DISCOUNT_CODES} stacked discount codes are allowed`);
var checkoutSessionCreditEntitlementOverrideSchema = z$2.object({
	credit_entitlement_id: z$2.string().min(1, "credit_entitlement_id is required"),
	credits_amount: z$2.string().min(1, "credits_amount is required (string for precision)")
});
var checkoutSessionProductCartItemSchema = z$2.object({
	product_id: z$2.string().min(1, "Product ID is required"),
	quantity: z$2.number().int().positive("Quantity must be a positive integer"),
	addons: z$2.array(z$2.object({
		addon_id: z$2.string(),
		quantity: z$2.number().int().nonnegative()
	})).nullable().optional(),
	amount: z$2.number().int().nonnegative("Amount must be a non-negative integer (for pay-what-you-want products)").nullable().optional(),
	credit_entitlements: z$2.array(checkoutSessionCreditEntitlementOverrideSchema).nullable().optional()
});
var checkoutSessionCustomerSchema = z$2.union([z$2.object({
	email: z$2.string().email(),
	name: z$2.string().min(1).nullable().optional(),
	phone_number: z$2.string().nullable().optional()
}), z$2.object({ customer_id: z$2.string() })]).nullable().optional();
var checkoutSessionBillingAddressSchema = z$2.object({
	street: z$2.string().nullable().optional(),
	city: z$2.string().nullable().optional(),
	state: z$2.string().nullable().optional(),
	country: z$2.string().length(2, "Country must be a 2-letter ISO code"),
	zipcode: z$2.string().nullable().optional()
}).nullable().optional();
var paymentMethodTypeSchema = z$2.enum([
	"ach",
	"affirm",
	"afterpay_clearpay",
	"alfamart",
	"ali_pay",
	"ali_pay_hk",
	"alma",
	"amazon_pay",
	"apple_pay",
	"atome",
	"bacs",
	"bancontact_card",
	"becs",
	"benefit",
	"bizum",
	"blik",
	"boleto",
	"bca_bank_transfer",
	"bni_va",
	"bri_va",
	"card_redirect",
	"cimb_va",
	"classic",
	"credit",
	"crypto_currency",
	"cashapp",
	"dana",
	"danamon_va",
	"debit",
	"duit_now",
	"efecty",
	"eft",
	"eps",
	"fps",
	"evoucher",
	"giropay",
	"givex",
	"google_pay",
	"go_pay",
	"gcash",
	"ideal",
	"interac",
	"indomaret",
	"klarna",
	"kakao_pay",
	"local_bank_redirect",
	"mandiri_va",
	"knet",
	"mb_way",
	"mobile_pay",
	"momo",
	"momo_atm",
	"multibanco",
	"online_banking_thailand",
	"online_banking_czech_republic",
	"online_banking_finland",
	"online_banking_fpx",
	"online_banking_poland",
	"online_banking_slovakia",
	"oxxo",
	"pago_efectivo",
	"permata_bank_transfer",
	"open_banking_uk",
	"pay_bright",
	"paypal",
	"paze",
	"pix",
	"pay_safe_card",
	"przelewy24",
	"prompt_pay",
	"pse",
	"red_compra",
	"red_pagos",
	"samsung_pay",
	"sepa",
	"sepa_bank_transfer",
	"sofort",
	"sunbit",
	"swish",
	"touch_n_go",
	"trustly",
	"twint",
	"upi_collect",
	"upi_intent",
	"vipps",
	"viet_qr",
	"venmo",
	"walley",
	"we_chat_pay",
	"seven_eleven",
	"lawson",
	"mini_stop",
	"family_mart",
	"seicomart",
	"pay_easy",
	"local_bank_transfer",
	"mifinity",
	"open_banking_pis",
	"direct_carrier_billing",
	"instant_bank_transfer",
	"billie",
	"zip",
	"revolut_pay",
	"naver_pay",
	"payco",
	"satispay"
]);
var checkoutSessionThemeModeConfigSchema = z$2.object({
	bg_primary: z$2.string().nullable().optional(),
	bg_secondary: z$2.string().nullable().optional(),
	border_primary: z$2.string().nullable().optional(),
	border_secondary: z$2.string().nullable().optional(),
	button_primary: z$2.string().nullable().optional(),
	button_primary_hover: z$2.string().nullable().optional(),
	button_secondary: z$2.string().nullable().optional(),
	button_secondary_hover: z$2.string().nullable().optional(),
	button_text_primary: z$2.string().nullable().optional(),
	button_text_secondary: z$2.string().nullable().optional(),
	input_focus_border: z$2.string().nullable().optional(),
	text_error: z$2.string().nullable().optional(),
	text_placeholder: z$2.string().nullable().optional(),
	text_primary: z$2.string().nullable().optional(),
	text_secondary: z$2.string().nullable().optional(),
	text_success: z$2.string().nullable().optional()
});
var checkoutSessionThemeConfigSchema = z$2.object({
	dark: checkoutSessionThemeModeConfigSchema.nullable().optional(),
	font_primary_url: z$2.string().nullable().optional(),
	font_secondary_url: z$2.string().nullable().optional(),
	font_size: z$2.enum([
		"xs",
		"sm",
		"md",
		"lg",
		"xl",
		"2xl"
	]).nullable().optional(),
	font_weight: z$2.enum([
		"normal",
		"medium",
		"bold",
		"extraBold"
	]).nullable().optional(),
	light: checkoutSessionThemeModeConfigSchema.nullable().optional(),
	pay_button_text: z$2.string().nullable().optional(),
	radius: z$2.string().nullable().optional()
});
var checkoutSessionCustomizationSchema = z$2.object({
	force_language: z$2.string().nullable().optional(),
	show_on_demand_tag: z$2.boolean().optional(),
	show_order_details: z$2.boolean().optional(),
	theme: z$2.enum([
		"dark",
		"light",
		"system"
	]).nullable().optional(),
	theme_config: checkoutSessionThemeConfigSchema.nullable().optional()
}).optional();
var checkoutSessionFeatureFlagsSchema = z$2.object({
	allow_currency_selection: z$2.boolean().optional(),
	allow_customer_editing_business_name: z$2.boolean().optional(),
	allow_customer_editing_city: z$2.boolean().optional(),
	allow_customer_editing_country: z$2.boolean().optional(),
	allow_customer_editing_email: z$2.boolean().optional(),
	allow_customer_editing_name: z$2.boolean().optional(),
	allow_customer_editing_state: z$2.boolean().optional(),
	allow_customer_editing_street: z$2.boolean().optional(),
	allow_customer_editing_tax_id: z$2.boolean().optional(),
	allow_customer_editing_zipcode: z$2.boolean().optional(),
	allow_discount_code: z$2.boolean().optional(),
	allow_editing_addons: z$2.boolean().optional(),
	allow_phone_number_collection: z$2.boolean().optional(),
	allow_tax_id: z$2.boolean().optional(),
	always_create_new_customer: z$2.boolean().optional(),
	redirect_immediately: z$2.boolean().optional(),
	require_phone_number: z$2.boolean().optional()
}).optional();
var checkoutSessionOnDemandSchema = z$2.object({
	mandate_only: z$2.boolean(),
	adaptive_currency_fees_inclusive: z$2.boolean().nullable().optional(),
	product_currency: z$2.string().nullable().optional(),
	product_description: z$2.string().nullable().optional(),
	product_price: z$2.number().int().nullable().optional()
}).optional();
var checkoutSessionSubscriptionDataSchema = z$2.object({
	on_demand: checkoutSessionOnDemandSchema.nullable(),
	trial_period_days: z$2.number().int().nonnegative().nullable().optional()
}).nullable().optional();
var checkoutSessionCustomFieldSchema = z$2.object({
	field_type: z$2.enum([
		"text",
		"number",
		"email",
		"url",
		"date",
		"dropdown",
		"boolean"
	]),
	key: z$2.string(),
	label: z$2.string(),
	options: z$2.array(z$2.string()).nullable().optional(),
	placeholder: z$2.string().nullable().optional(),
	required: z$2.boolean().optional()
});
var checkoutSessionPayloadSchema = z$2.object({
	product_cart: z$2.array(checkoutSessionProductCartItemSchema).min(1, "At least one product is required"),
	allowed_payment_method_types: z$2.array(paymentMethodTypeSchema).nullable().optional(),
	billing_address: checkoutSessionBillingAddressSchema,
	billing_currency: z$2.string().length(3, "Currency must be a 3-letter ISO code").nullable().optional(),
	cancel_url: z$2.string().nullable().optional(),
	confirm: z$2.boolean().optional(),
	custom_fields: z$2.array(checkoutSessionCustomFieldSchema).nullable().optional(),
	customer: checkoutSessionCustomerSchema,
	customer_business_name: z$2.string().nullable().optional(),
	customization: checkoutSessionCustomizationSchema,
	discount_code: z$2.string().nullable().optional(),
	discount_codes: discountCodesSchema.nullable().optional(),
	feature_flags: checkoutSessionFeatureFlagsSchema,
	force_3ds: z$2.boolean().nullable().optional(),
	mandate_min_amount_inr_paise: z$2.number().int().nullable().optional(),
	metadata: z$2.record(z$2.string(), z$2.union([
		z$2.string(),
		z$2.number(),
		z$2.boolean()
	])).nullable().optional(),
	minimal_address: z$2.boolean().optional(),
	payment_method_id: z$2.string().nullable().optional(),
	product_collection_id: z$2.string().nullable().optional(),
	return_url: z$2.string().url().nullable().optional(),
	short_link: z$2.boolean().optional(),
	show_saved_payment_methods: z$2.boolean().optional(),
	subscription_data: checkoutSessionSubscriptionDataSchema,
	tax_id: z$2.string().nullable().optional()
});
function assertDiscountFieldsExclusive(input) {
	if (input.discount_code != null && input.discount_code !== "" && input.discount_codes != null && input.discount_codes.length > 0) throw new Error("Cannot use both `discount_code` and `discount_codes` in the same request. The singular `discount_code` is deprecated — prefer `discount_codes`.");
}
var checkoutSessionResponseSchema = z$2.object({
	session_id: z$2.string().min(1, "Session ID is required"),
	checkout_url: z$2.string().url("Invalid checkout URL").nullable().optional(),
	client_secret: z$2.string().nullable().optional(),
	payment_id: z$2.string().nullable().optional(),
	publishable_key: z$2.string().nullable().optional()
});
var createCheckoutSession = async (payload, config) => {
	const validation = checkoutSessionPayloadSchema.safeParse(payload);
	if (!validation.success) throw new Error(`Invalid checkout session payload: ${validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")}`);
	assertDiscountFieldsExclusive(validation.data);
	const dodopayments$1 = new DodoPayments({
		bearerToken: config.bearerToken,
		environment: config.environment
	});
	try {
		const sdkPayload = {
			...validation.data,
			...validation.data.billing_address && { billing_address: {
				...validation.data.billing_address,
				country: validation.data.billing_address.country
			} }
		};
		const session = await dodopayments$1.checkoutSessions.create(sdkPayload);
		const responseValidation = checkoutSessionResponseSchema.safeParse(session);
		if (!responseValidation.success) throw new Error(`Invalid checkout session response from API: ${responseValidation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")}`);
		return responseValidation.data;
	} catch (error) {
		if (error instanceof Error) {
			console.error("Dodo Payments Checkout Session API Error:", {
				message: error.message,
				payload: validation.data,
				config: {
					environment: config.environment,
					hasBearerToken: !!config.bearerToken
				}
			});
			throw new Error(`Failed to create checkout session: ${error.message}`);
		}
		console.error("Unknown error creating checkout session:", error);
		throw new Error("Failed to create checkout session due to an unknown error");
	}
};
var buildCheckoutUrl = async ({ queryParams, body, sessionPayload, returnUrl, bearerToken, environment, type = "static" }) => {
	if (type === "session") {
		if (!sessionPayload) throw new Error("sessionPayload is required when type is 'session'");
		const session = await createCheckoutSession({
			...sessionPayload,
			return_url: sessionPayload.return_url ?? returnUrl
		}, {
			bearerToken,
			environment
		});
		if (!session.checkout_url) throw new Error("No checkout_url returned from Dodo Payments API. This can happen for confirm-mode sessions created with a payment_method_id; use createCheckoutSession directly to access client_secret/payment_id.");
		return session.checkout_url;
	}
	const inputData = type === "dynamic" ? body : queryParams;
	let parseResult;
	if (type === "dynamic") parseResult = dynamicCheckoutBodySchema.safeParse(inputData);
	else parseResult = checkoutQuerySchema.safeParse(inputData);
	const { success, data, error } = parseResult;
	if (!success) throw new Error(`Invalid ${type === "dynamic" ? "body" : "query parameters"}.
 ${error.message}`);
	if (type !== "dynamic") {
		const { productId, quantity: quantity2, fullName, firstName, lastName, email, country, addressLine, city, state, zipCode, disableFullName, disableFirstName, disableLastName, disableEmail, disableCountry, disableAddressLine, disableCity, disableState, disableZipCode, paymentCurrency, showCurrencySelector, paymentAmount, showDiscounts } = data;
		const dodopayments2 = new DodoPayments({
			bearerToken,
			environment
		});
		if (!productId) throw new Error("Missing required field: productId");
		try {
			await dodopayments2.products.retrieve(productId);
		} catch (err) {
			console.error(err);
			throw new Error("Product not found");
		}
		const url = new URL(`${environment === "test_mode" ? "https://test.checkout.dodopayments.com" : "https://checkout.dodopayments.com"}/buy/${productId}`);
		url.searchParams.set("quantity", quantity2 ? String(quantity2) : "1");
		if (returnUrl) url.searchParams.set("redirect_url", returnUrl);
		if (fullName) url.searchParams.set("fullName", String(fullName));
		if (firstName) url.searchParams.set("firstName", String(firstName));
		if (lastName) url.searchParams.set("lastName", String(lastName));
		if (email) url.searchParams.set("email", String(email));
		if (country) url.searchParams.set("country", String(country));
		if (addressLine) url.searchParams.set("addressLine", String(addressLine));
		if (city) url.searchParams.set("city", String(city));
		if (state) url.searchParams.set("state", String(state));
		if (zipCode) url.searchParams.set("zipCode", String(zipCode));
		if (disableFullName === "true") url.searchParams.set("disableFullName", "true");
		if (disableFirstName === "true") url.searchParams.set("disableFirstName", "true");
		if (disableLastName === "true") url.searchParams.set("disableLastName", "true");
		if (disableEmail === "true") url.searchParams.set("disableEmail", "true");
		if (disableCountry === "true") url.searchParams.set("disableCountry", "true");
		if (disableAddressLine === "true") url.searchParams.set("disableAddressLine", "true");
		if (disableCity === "true") url.searchParams.set("disableCity", "true");
		if (disableState === "true") url.searchParams.set("disableState", "true");
		if (disableZipCode === "true") url.searchParams.set("disableZipCode", "true");
		if (paymentCurrency) url.searchParams.set("paymentCurrency", String(paymentCurrency));
		if (showCurrencySelector) url.searchParams.set("showCurrencySelector", String(showCurrencySelector));
		if (paymentAmount) url.searchParams.set("paymentAmount", String(paymentAmount));
		if (showDiscounts) url.searchParams.set("showDiscounts", String(showDiscounts));
		for (const [key, value] of Object.entries(queryParams || {})) if (key.startsWith("metadata_") && value && typeof value !== "object") url.searchParams.set(key, String(value));
		return url.toString();
	}
	const dyn = data;
	assertDiscountFieldsExclusive({
		discount_code: dyn.discount_code,
		discount_codes: dyn.discount_codes
	});
	const { product_id, product_cart, quantity, billing, customer, addons, metadata: metadata$1, allowed_payment_method_types, billing_currency, discount_code, discount_codes, on_demand, return_url: bodyReturnUrl, show_saved_payment_methods, tax_id, trial_period_days } = dyn;
	const dodopayments$1 = new DodoPayments({
		bearerToken,
		environment
	});
	let isSubscription = false;
	let productIdToFetch = product_id;
	if (!product_id && product_cart && product_cart.length > 0) productIdToFetch = product_cart[0].product_id;
	if (!productIdToFetch) throw new Error("Missing required field: product_id or product_cart[0].product_id");
	let product;
	try {
		product = await dodopayments$1.products.retrieve(productIdToFetch);
	} catch (err) {
		console.error(err);
		throw new Error("Product not found");
	}
	isSubscription = Boolean(product.is_recurring);
	if (isSubscription && !product_id) throw new Error("Missing required field: product_id for subscription");
	if (!billing) throw new Error("Missing required field: billing");
	if (!customer) throw new Error("Missing required field: customer");
	if (isSubscription) {
		const subscriptionPayload = {
			billing,
			customer,
			product_id,
			quantity: quantity ? Number(quantity) : 1
		};
		if (metadata$1) subscriptionPayload.metadata = metadata$1;
		if (discount_codes && discount_codes.length > 0) subscriptionPayload.discount_codes = discount_codes;
		else if (discount_code) subscriptionPayload.discount_code = discount_code;
		if (addons) subscriptionPayload.addons = addons;
		if (allowed_payment_method_types) subscriptionPayload.allowed_payment_method_types = allowed_payment_method_types;
		if (billing_currency) subscriptionPayload.billing_currency = billing_currency;
		if (on_demand) subscriptionPayload.on_demand = on_demand;
		subscriptionPayload.payment_link = true;
		if (bodyReturnUrl) subscriptionPayload.return_url = bodyReturnUrl;
		else if (returnUrl) subscriptionPayload.return_url = returnUrl;
		if (show_saved_payment_methods) subscriptionPayload.show_saved_payment_methods = show_saved_payment_methods;
		if (tax_id) subscriptionPayload.tax_id = tax_id;
		if (trial_period_days) subscriptionPayload.trial_period_days = trial_period_days;
		let subscription;
		try {
			subscription = await dodopayments$1.subscriptions.create(subscriptionPayload);
		} catch (err) {
			console.error("Error when creating subscription", err);
			throw new Error(err instanceof Error ? err.message : String(err));
		}
		if (!subscription || !subscription.payment_link) throw new Error("No payment link returned from Dodo Payments API (subscription). Make sure to set payment_link as true in payload");
		return subscription.payment_link;
	} else {
		let cart = product_cart;
		if (!cart && product_id) cart = [{
			product_id,
			quantity: quantity ? Number(quantity) : 1
		}];
		if (!cart || cart.length === 0) throw new Error("Missing required field: product_cart or product_id");
		const paymentPayload = {
			billing,
			customer,
			product_cart: cart
		};
		if (metadata$1) paymentPayload.metadata = metadata$1;
		paymentPayload.payment_link = true;
		if (allowed_payment_method_types) paymentPayload.allowed_payment_method_types = allowed_payment_method_types;
		if (billing_currency) paymentPayload.billing_currency = billing_currency;
		if (discount_codes && discount_codes.length > 0) paymentPayload.discount_codes = discount_codes;
		else if (discount_code) paymentPayload.discount_code = discount_code;
		if (bodyReturnUrl) paymentPayload.return_url = bodyReturnUrl;
		else if (returnUrl) paymentPayload.return_url = returnUrl;
		if (show_saved_payment_methods) paymentPayload.show_saved_payment_methods = show_saved_payment_methods;
		if (tax_id) paymentPayload.tax_id = tax_id;
		let payment;
		try {
			payment = await dodopayments$1.payments.create(paymentPayload);
		} catch (err) {
			console.error("Error when creating payment link", err);
			throw new Error(err instanceof Error ? err.message : String(err));
		}
		if (!payment || !payment.payment_link) throw new Error("No payment link returned from Dodo Payments API. Make sure to set payment_link as true in payload.");
		return payment.payment_link;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/chunk-6VDYFSNJ.js
var checkout = (checkoutOptions = {}) => (options) => {
	return {
		dodoCheckout: createAuthEndpoint("/dodopayments/checkout", {
			method: "POST",
			body: dynamicCheckoutBodySchema.extend({
				slug: z$2.string().optional(),
				referenceId: z$2.string().optional()
			}),
			requireRequest: true
		}, async (ctx) => {
			const session = await getSessionFromCtx(ctx);
			let dodoPaymentsProductId;
			if (ctx.body?.slug) {
				const productId = (typeof checkoutOptions.products === "function" ? await checkoutOptions.products() : checkoutOptions.products)?.find((product) => product.slug === ctx.body.slug)?.productId;
				if (!productId) throw new APIError$1("BAD_REQUEST", { message: "Product not found" });
				dodoPaymentsProductId = productId;
			} else dodoPaymentsProductId = ctx.body.product_id;
			if (checkoutOptions.authenticatedUsersOnly && !session?.user.id) throw new APIError$1("UNAUTHORIZED", { message: "You must be logged in to checkout" });
			try {
				const checkoutUrl = await buildCheckoutUrl({
					body: {
						...ctx.body,
						product_id: dodoPaymentsProductId,
						customer: {
							email: session?.user.email,
							name: session?.user.name,
							...ctx.body.customer
						},
						product_cart: dodoPaymentsProductId ? [{
							product_id: dodoPaymentsProductId,
							quantity: 1
						}] : void 0,
						metadata: ctx.body.referenceId ? {
							referenceId: ctx.body.referenceId,
							...ctx.body.metadata
						} : ctx.body.metadata
					},
					bearerToken: options.client.bearerToken,
					environment: options.client.baseURL.includes("test") ? "test_mode" : "live_mode",
					returnUrl: checkoutOptions.successUrl ? new URL(checkoutOptions.successUrl, ctx.request?.url).toString() : void 0,
					type: "dynamic"
				});
				const redirectUrl = new URL(checkoutUrl);
				return ctx.json({
					url: redirectUrl.toString(),
					redirect: true
				});
			} catch (e) {
				if (e instanceof Error) ctx.context.logger.error(`DodoPayments checkout creation failed. Error: ${e.message}`);
				throw new APIError$1("INTERNAL_SERVER_ERROR", { message: "Checkout creation failed" });
			}
		}),
		dodoCheckoutSession: createAuthEndpoint("/dodopayments/checkout-session", {
			method: "POST",
			body: checkoutSessionPayloadSchema.extend({
				slug: z$2.string().optional(),
				referenceId: z$2.string().optional()
			}).partial({ product_cart: true }),
			requireRequest: true
		}, async (ctx) => {
			const session = await getSessionFromCtx(ctx);
			let dodoPaymentsProductId;
			if (ctx.body?.slug) {
				const productId = (typeof checkoutOptions.products === "function" ? await checkoutOptions.products() : checkoutOptions.products)?.find((product) => product.slug === ctx.body.slug)?.productId;
				if (!productId) throw new APIError$1("BAD_REQUEST", { message: "Product not found" });
				dodoPaymentsProductId = productId;
			}
			if (checkoutOptions.authenticatedUsersOnly && !session?.user.id) throw new APIError$1("UNAUTHORIZED", { message: "You must be logged in to checkout" });
			const product_cart = dodoPaymentsProductId ? [{
				product_id: dodoPaymentsProductId,
				quantity: 1
			}] : ctx.body.product_cart;
			if (!product_cart || product_cart.length === 0) throw new APIError$1("BAD_REQUEST", { message: "Neither product_cart nor slug was provided" });
			try {
				const checkoutUrl = await buildCheckoutUrl({
					sessionPayload: {
						...ctx.body,
						product_cart,
						customer: session?.user.email ? {
							email: session?.user.email,
							name: session?.user.name
						} : ctx.body.customer,
						metadata: ctx.body.referenceId ? {
							referenceId: ctx.body.referenceId,
							...ctx.body.metadata
						} : ctx.body.metadata,
						return_url: checkoutOptions.successUrl ? new URL(checkoutOptions.successUrl, ctx.request?.url).toString() : void 0
					},
					bearerToken: options.client.bearerToken,
					environment: options.client.baseURL.includes("test") ? "test_mode" : "live_mode",
					type: "session"
				});
				const redirectUrl = new URL(checkoutUrl);
				return ctx.json({
					url: redirectUrl.toString(),
					redirect: true
				});
			} catch (e) {
				if (e instanceof Error) ctx.context.logger.error(`DodoPayments checkout creation failed. Error: ${e.message}`);
				throw new APIError$1("INTERNAL_SERVER_ERROR", { message: "Checkout session creation failed" });
			}
		})
	};
};

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/chunk-EGRIWRWP.js
async function getOrCreateCustomerId(dodopayments$1, session, internalAdapter, getCustomerParams) {
	const dodoCustomerId = session.user["dodoCustomerId"];
	if (dodoCustomerId) return dodoCustomerId;
	let customer = (await dodopayments$1.customers.list({ email: session.user.email })).items[0];
	if (!customer) {
		const additionalParams = getCustomerParams ? await getCustomerParams(session.user) : void 0;
		customer = await dodopayments$1.customers.create({
			email: session.user.email,
			name: session.user.name,
			metadata: additionalParams?.metadata,
			phone_number: additionalParams?.phone_number
		}, { idempotencyKey: session.user.id });
	}
	internalAdapter.updateUser(session.user.id, { dodoCustomerId: customer.customer_id }).catch(() => {});
	return customer.customer_id;
}

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/chunk-YCUWFLKK.js
var portal = () => (options) => {
	return {
		dodoPortal: createAuthEndpoint("/dodopayments/customer/portal", {
			method: "GET",
			use: [sessionMiddleware]
		}, async (ctx) => {
			if (!ctx.context.session?.user.id) throw new APIError$1("BAD_REQUEST", { message: "User not found" });
			if (!ctx.context.session?.user.emailVerified) throw new APIError$1("UNAUTHORIZED", { message: "User email not verified" });
			try {
				const customerId = await getOrCreateCustomerId(options.client, ctx.context.session, ctx.context.internalAdapter, options.getCustomerParams);
				const customerSession = await options.client.customers.customerPortal.create(customerId);
				return ctx.json({
					url: customerSession.link,
					redirect: true
				});
			} catch (e) {
				if (e instanceof Error) ctx.context.logger.error(`DodoPayments customer portal creation failed. Error: ${e.message}`);
				throw new APIError$1("INTERNAL_SERVER_ERROR", { message: "Customer portal creation failed" });
			}
		}),
		dodoSubscriptions: createAuthEndpoint("/dodopayments/customer/subscriptions/list", {
			method: "GET",
			query: z$2.object({
				page: z$2.coerce.number().optional(),
				limit: z$2.coerce.number().optional(),
				status: z$2.enum([
					"active",
					"cancelled",
					"on_hold",
					"pending",
					"failed",
					"expired"
				]).optional()
			}).optional(),
			use: [sessionMiddleware]
		}, async (ctx) => {
			if (!ctx.context.session.user.id) throw new APIError$1("BAD_REQUEST", { message: "User not found" });
			if (!ctx.context.session?.user.emailVerified) throw new APIError$1("UNAUTHORIZED", { message: "User email not verified" });
			try {
				const customerId = await getOrCreateCustomerId(options.client, ctx.context.session, ctx.context.internalAdapter, options.getCustomerParams);
				const subscriptions = await options.client.subscriptions.list({
					customer_id: customerId,
					page_number: ctx.query?.page ? ctx.query.page - 1 : void 0,
					page_size: ctx.query?.limit,
					status: ctx.query?.status
				});
				return ctx.json({ items: subscriptions.items });
			} catch (e) {
				if (e instanceof Error) ctx.context.logger.error(`DodoPayments subscriptions list failed. Error: ${e.message}`);
				throw new APIError$1("INTERNAL_SERVER_ERROR", { message: "DodoPayments subscriptions list failed" });
			}
		}),
		dodoPayments: createAuthEndpoint("/dodopayments/customer/payments/list", {
			method: "GET",
			query: z$2.object({
				page: z$2.coerce.number().optional(),
				limit: z$2.coerce.number().optional(),
				status: z$2.enum([
					"succeeded",
					"failed",
					"cancelled",
					"processing",
					"requires_customer_action",
					"requires_merchant_action",
					"requires_payment_method",
					"requires_confirmation",
					"requires_capture",
					"partially_captured",
					"partially_captured_and_capturable"
				]).optional()
			}).optional(),
			use: [sessionMiddleware]
		}, async (ctx) => {
			if (!ctx.context.session.user.id) throw new APIError$1("BAD_REQUEST", { message: "User not found" });
			if (!ctx.context.session?.user.emailVerified) throw new APIError$1("UNAUTHORIZED", { message: "User email not verified" });
			try {
				const customerId = await getOrCreateCustomerId(options.client, ctx.context.session, ctx.context.internalAdapter, options.getCustomerParams);
				const payments = await options.client.payments.list({
					customer_id: customerId,
					page_number: ctx.query?.page ? ctx.query.page - 1 : void 0,
					page_size: ctx.query?.limit,
					status: ctx.query?.status
				});
				return ctx.json({ items: payments.items });
			} catch (e) {
				if (e instanceof Error) ctx.context.logger.error(`DodoPayments orders list failed. Error: ${e.message}`);
				throw new APIError$1("INTERNAL_SERVER_ERROR", { message: "Orders list failed" });
			}
		})
	};
};

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/chunk-ZA3TNX5K.js
var EventInputSchema = z$2.object({
	event_id: z$2.string(),
	event_name: z$2.string(),
	metadata: z$2.record(z$2.union([
		z$2.string(),
		z$2.number(),
		z$2.boolean()
	])).nullable().optional(),
	timestamp: z$2.date({ coerce: true }).transform((d) => d.toISOString()).optional().describe("Custom Timestamp. Defaults to current timestamp in UTC.      Timestamps that are older that 1 hour or after 5 mins from      current timestamp will be rejected.")
});

//#endregion
//#region ../../node_modules/.pnpm/@dodopayments+better-auth@1.6.4_better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+cli_417203ed12389d55183eb9933a861246/node_modules/@dodopayments/better-auth/dist/index.js
var dodopayments = (options) => {
	return {
		id: "dodopayments",
		schema: { user: { fields: { dodoCustomerId: {
			type: "string",
			required: false,
			input: false
		} } } },
		endpoints: { ...options.use.map((use) => use(options)).reduce((acc, plugin) => {
			Object.assign(acc, plugin);
			return acc;
		}, {}) },
		init() {
			return { options: { databaseHooks: { user: {
				create: { after: onUserCreate(options) },
				update: { after: onUserUpdate(options) }
			} } } };
		}
	};
};

//#endregion
//#region ../../packages/dodo-payments/dist/index.mjs
const dodoClient = ENV_CONFIG.ENABLE_PRICING ? new DodoPayments({
	bearerToken: ENV_CONFIG.DODO_PAYMENTS_API_KEY || "",
	baseURL: ENV_CONFIG.DODO_PAYMENTS_BASE_URL || (ENV_CONFIG.NODE_ENV === "production" ? "https://live.dodopayments.com" : "https://test.dodopayments.com"),
	webhookKey: ENV_CONFIG.DODO_PAYMENTS_WEBHOOK_SECRET || null
}) : void 0;
const PRODUCT_SLUG_MAP = {
	basic: "pdt_basic",
	pro: "pdt_pro",
	max: "pdt_max"
};
/**
* Handle success events to credit tokens to user's balance.
*/
const handlePaymentSucceeded = async (payment) => {
	const userId = payment.metadata?.userId || payment.metadata?.user_id;
	const email = payment.customer?.email;
	let user = null;
	if (userId) user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user && email) user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		logger.warn(`Dodo payment.succeeded: No user found for payment ${payment.payment_id}`);
		return;
	}
	if (await prisma.tokenTransaction.findFirst({ where: { metadata: {
		path: ["dodoPaymentId"],
		equals: payment.payment_id
	} } })) {
		logger.info(`Dodo payment.succeeded: Payment ${payment.payment_id} already processed. Skipping.`);
		return;
	}
	const isSubscription = !!payment.subscription_id;
	const productId = payment.product_cart?.[0]?.product_id;
	if (!productId) {
		logger.warn(`Dodo payment.succeeded: No product ID in cart for payment ${payment.payment_id}`);
		return;
	}
	let tokenCredits = 0;
	let productName = "Credits Purchase";
	try {
		if (dodoClient) {
			const product = await dodoClient.products.retrieve(productId);
			productName = product.name || "Credits Purchase";
			const tokenCreditsStr = String(product.metadata?.tokenCredits || product.metadata?.tokens || "0");
			tokenCredits = parseInt(tokenCreditsStr, 10);
		}
	} catch (error) {
		logger.error({ err: error }, `Dodo payment.succeeded: Failed to retrieve product ${productId}`);
	}
	if (tokenCredits > 0) {
		await prisma.tokenTransaction.create({ data: {
			userId: user.id,
			amount: tokenCredits,
			type: isSubscription ? "SUBSCRIPTION_REFILL" : "PURCHASE",
			metadata: {
				dodoPaymentId: payment.payment_id,
				dodoSubscriptionId: payment.subscription_id,
				productId,
				productName
			}
		} });
		await prisma.user.update({
			where: { id: user.id },
			data: { tokens: { increment: tokenCredits } }
		});
		logger.info(`Dodo Webhook: Credited ${tokenCredits} tokens to user ${user.id} (${isSubscription ? "SUBSCRIPTION_REFILL" : "PURCHASE"})`);
	}
};
/**
* Handle subscription active event (refills tokens for initial period).
*/
const handleSubscriptionActive = async (sub) => {
	const userId = sub.metadata?.userId || sub.metadata?.user_id;
	const email = sub.customer?.email;
	let user = null;
	if (userId) user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user && email) user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		logger.warn(`Dodo subscription.active: No user found for subscription ${sub.subscription_id}`);
		return;
	}
	const billingCycleStart = sub.previous_billing_date || sub.created_at;
	if (await prisma.tokenTransaction.findFirst({ where: {
		userId: user.id,
		type: "SUBSCRIPTION_REFILL",
		metadata: {
			path: ["billingCycleStart"],
			equals: billingCycleStart
		}
	} })) {
		logger.info(`Dodo subscription.active: Subscription ${sub.subscription_id} cycle ${billingCycleStart} already refilled. Skipping.`);
		return;
	}
	const productId = sub.product_id;
	let tokenCredits = 0;
	let productName = "Subscription";
	try {
		if (dodoClient) {
			const product = await dodoClient.products.retrieve(productId);
			productName = product.name || "Subscription";
			const tokenCreditsStr = String(product.metadata?.tokenCredits || product.metadata?.tokens || "0");
			tokenCredits = parseInt(tokenCreditsStr, 10);
		}
	} catch (error) {
		logger.error({ err: error }, `Dodo subscription.active: Failed to retrieve product ${productId}`);
	}
	if (tokenCredits > 0) {
		await prisma.tokenTransaction.create({ data: {
			userId: user.id,
			amount: tokenCredits,
			type: "SUBSCRIPTION_REFILL",
			metadata: {
				dodoSubscriptionId: sub.subscription_id,
				productId,
				productName,
				billingCycleStart
			}
		} });
		await prisma.user.update({
			where: { id: user.id },
			data: { tokens: { increment: tokenCredits } }
		});
		logger.info(`Dodo Webhook: Subscription active refill of ${tokenCredits} tokens for user ${user.id}`);
	}
};
/**
* Handle subscription renewals.
*/
const handleSubscriptionRenewed = async (sub) => {
	if (sub.previous_billing_date && sub.created_at && sub.previous_billing_date === sub.created_at) {
		logger.info(`Dodo Webhook: subscription.renewed received for initial cycle ${sub.subscription_id}. Skipping to prevent double refill.`);
		return;
	}
	await handleSubscriptionActive(sub);
};
const dodoPlugin = ENV_CONFIG.ENABLE_PRICING && dodoClient ? dodopayments({
	client: dodoClient,
	createCustomerOnSignUp: true,
	use: [
		checkout({
			products: [
				{
					productId: PRODUCT_SLUG_MAP.basic,
					slug: "basic"
				},
				{
					productId: PRODUCT_SLUG_MAP.pro,
					slug: "pro"
				},
				{
					productId: PRODUCT_SLUG_MAP.max,
					slug: "max"
				}
			],
			successUrl: "/success?checkout_id={CHECKOUT_ID}",
			authenticatedUsersOnly: true
		}),
		portal(),
		webhooks({
			webhookKey: ENV_CONFIG.DODO_PAYMENTS_WEBHOOK_SECRET,
			onPayload: async (payload) => {
				logger.info(`Dodo Better-Auth Webhook: Received ${payload.type}`);
				await prisma.webhookEvent.create({ data: {
					eventName: payload.type,
					body: payload
				} });
				if (payload.type === "payment.succeeded") await handlePaymentSucceeded(payload.data);
				else if (payload.type === "subscription.active") await handleSubscriptionActive(payload.data);
				else if (payload.type === "subscription.renewed") await handleSubscriptionRenewed(payload.data);
			}
		})
	]
}) : void 0;

//#endregion
//#region ../../node_modules/.pnpm/@better-auth+prisma-adapter@1.6.26_@better-auth+core@1.6.26_@better-auth+utils@0.4.2_@b_d473ac8a100208c50be6745bf3228a85/node_modules/@better-auth/prisma-adapter/dist/index.mjs
function isPrismaNotFoundError(e) {
	return e?.code === "P2025";
}
const prismaAdapter = (prisma$1, config) => {
	let lazyOptions = null;
	const createCustomAdapter = (prisma$2, inTransaction = false) => ({ getFieldName, getModelName, getFieldAttributes, getDefaultModelName, schema: schema$1 }) => {
		const db = prisma$2;
		const convertSelect = (select, model, join$1) => {
			if (!select && !join$1) return void 0;
			const result = {};
			if (select) for (const field of select) result[getFieldName({
				model,
				field
			})] = true;
			if (join$1) {
				if (!select) {
					const fields = schema$1[getDefaultModelName(model)]?.fields || {};
					fields.id = { type: "string" };
					for (const field of Object.keys(fields)) result[getFieldName({
						model,
						field
					})] = true;
				}
				for (const [joinModel, joinAttr] of Object.entries(join$1)) {
					const key = getJoinKeyName(model, getModelName(joinModel), schema$1);
					if (joinAttr.relation === "one-to-one") result[key] = true;
					else result[key] = { take: joinAttr.limit };
				}
			}
			return result;
		};
		/**
		* Build the join key name based on whether the foreign field is unique or not.
		* If unique, use singular. Otherwise, pluralize (add 's').
		*/
		const getJoinKeyName = (baseModel, joinedModel, schema$2) => {
			try {
				const defaultBaseModelName = getDefaultModelName(baseModel);
				const defaultJoinedModelName = getDefaultModelName(joinedModel);
				const key = getModelName(joinedModel).toLowerCase();
				let foreignKeys = Object.entries(schema$2[defaultJoinedModelName]?.fields || {}).filter(([_field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultBaseModelName);
				if (foreignKeys.length > 0) {
					const [_foreignKey, foreignKeyAttributes] = foreignKeys[0];
					return foreignKeyAttributes?.unique === true || config.usePlural === true ? key : `${key}s`;
				}
				foreignKeys = Object.entries(schema$2[defaultBaseModelName]?.fields || {}).filter(([_field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultJoinedModelName);
				if (foreignKeys.length > 0) return key;
			} catch {}
			return `${getModelName(joinedModel).toLowerCase()}s`;
		};
		function operatorToPrismaOperator(operator) {
			switch (operator) {
				case "starts_with": return "startsWith";
				case "ends_with": return "endsWith";
				case "ne": return "not";
				case "not_in": return "notIn";
				default: return operator;
			}
		}
		const hasRootUniqueWhereCondition = (model, where) => {
			if (!where?.length) return false;
			return where.some((condition) => {
				if (condition.connector === "OR") return false;
				if (condition.operator && condition.operator !== "eq") return false;
				if (condition.mode === "insensitive") {
					const providerSupportsMode = config.provider === "postgresql" || config.provider === "mongodb";
					const isStringValue = typeof condition.value === "string" || Array.isArray(condition.value) && condition.value.every((v) => typeof v === "string");
					if (providerSupportsMode && isStringValue) return false;
				}
				if (condition.field === "id") return true;
				return getFieldAttributes({
					model,
					field: condition.field
				})?.unique === true;
			});
		};
		const convertWhereClause = ({ action, model, where }) => {
			if (!where || !where.length) return {};
			const buildSingleCondition = (w) => {
				const fieldName = getFieldName({
					model,
					field: w.field
				});
				const isInsensitive = (w.mode ?? "sensitive") === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
				const providerSupportsMode = config.provider === "postgresql" || config.provider === "mongodb";
				const prismaMode = isInsensitive && providerSupportsMode ? "insensitive" : void 0;
				const modeFilter = prismaMode ? { mode: prismaMode } : {};
				if (w.operator === "ne" && w.value === null) return getFieldAttributes({
					model,
					field: w.field
				})?.required !== true ? { [fieldName]: { not: null } } : {};
				if ((w.operator === "in" || w.operator === "not_in") && Array.isArray(w.value)) {
					const filtered = w.value.filter((v) => v != null);
					if (filtered.length === 0) if (w.operator === "in") return { AND: [{ [fieldName]: { equals: "__never__" } }, { [fieldName]: { not: "__never__" } }] };
					else return {};
					const prismaOp$1 = operatorToPrismaOperator(w.operator);
					return { [fieldName]: {
						[prismaOp$1]: filtered,
						...modeFilter
					} };
				}
				if (w.operator === "eq" || !w.operator) return { [fieldName]: {
					equals: w.value,
					...modeFilter
				} };
				if (w.operator === "ne") return { [fieldName]: {
					not: { equals: w.value },
					...modeFilter
				} };
				const prismaOp = operatorToPrismaOperator(w.operator);
				return { [fieldName]: {
					[prismaOp]: w.value,
					...modeFilter
				} };
			};
			if (action === "update") {
				const and$1 = where.filter((w) => w.connector === "AND" || !w.connector);
				const or$1 = where.filter((w) => w.connector === "OR");
				const andSimple = and$1.filter((w) => w.operator === "eq" || !w.operator);
				const andComplexClause = and$1.filter((w) => w.operator !== "eq" && w.operator !== void 0).map((w) => buildSingleCondition(w));
				const orClause$1 = or$1.map((w) => buildSingleCondition(w));
				const result = {};
				for (const w of andSimple) {
					const fieldName = getFieldName({
						model,
						field: w.field
					});
					result[fieldName] = w.value;
				}
				if (andComplexClause.length > 0) result.AND = andComplexClause;
				if (orClause$1.length > 0) result.OR = orClause$1;
				return result;
			}
			if (action === "delete") {
				const idCondition = where.find((w) => w.field === "id");
				if (idCondition) {
					const idFieldName = getFieldName({
						model,
						field: "id"
					});
					const remainingWhere = where.filter((w) => w.field !== "id");
					if (remainingWhere.length === 0) return { [idFieldName]: idCondition.value };
					const and$1 = remainingWhere.filter((w) => w.connector === "AND" || !w.connector);
					const or$1 = remainingWhere.filter((w) => w.connector === "OR");
					const andClause$1 = and$1.map((w) => buildSingleCondition(w));
					const orClause$1 = or$1.map((w) => buildSingleCondition(w));
					const result = { [idFieldName]: idCondition.value };
					if (andClause$1.length > 0) result.AND = andClause$1;
					if (orClause$1.length > 0) result.OR = orClause$1;
					return result;
				}
			}
			if (where.length === 1) {
				const w = where[0];
				if (!w) return;
				return buildSingleCondition(w);
			}
			const and = where.filter((w) => w.connector === "AND" || !w.connector);
			const or = where.filter((w) => w.connector === "OR");
			const andClause = and.map((w) => buildSingleCondition(w));
			const orClause = or.map((w) => buildSingleCondition(w));
			return {
				...andClause.length ? { AND: andClause } : {},
				...orClause.length ? { OR: orClause } : {}
			};
		};
		return {
			async create({ model, data: values, select }) {
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				return await db[model].create({
					data: values,
					select: convertSelect(select, model)
				});
			},
			async findOne({ model, where, select, join: join$1 }) {
				const whereClause = convertWhereClause({
					model,
					where,
					action: "findOne"
				});
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				const map$1 = /* @__PURE__ */ new Map();
				for (const joinModel of Object.keys(join$1 ?? {})) {
					const key = getJoinKeyName(model, joinModel, schema$1);
					map$1.set(key, getModelName(joinModel));
				}
				const selects = convertSelect(select, model, join$1);
				const result = await db[model].findFirst({
					where: whereClause,
					select: selects
				});
				if (join$1 && result) for (const [includeKey, originalKey] of map$1.entries()) {
					if (includeKey === originalKey) continue;
					if (includeKey in result) {
						result[originalKey] = result[includeKey];
						delete result[includeKey];
					}
				}
				return result;
			},
			async findMany({ model, where, limit, select, offset, sortBy, join: join$1 }) {
				const whereClause = convertWhereClause({
					model,
					where,
					action: "findMany"
				});
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				const map$1 = /* @__PURE__ */ new Map();
				if (join$1) for (const [joinModel, _value] of Object.entries(join$1)) {
					const key = getJoinKeyName(model, joinModel, schema$1);
					map$1.set(key, getModelName(joinModel));
				}
				const selects = convertSelect(select, model, join$1);
				const result = await db[model].findMany({
					where: whereClause,
					take: limit || 100,
					skip: offset || 0,
					...sortBy?.field ? { orderBy: { [getFieldName({
						model,
						field: sortBy.field
					})]: sortBy.direction === "desc" ? "desc" : "asc" } } : {},
					select: selects
				});
				if (join$1 && Array.isArray(result)) for (const item of result) for (const [includeKey, originalKey] of map$1.entries()) {
					if (includeKey === originalKey) continue;
					if (includeKey in item) {
						item[originalKey] = item[includeKey];
						delete item[includeKey];
					}
				}
				return result;
			},
			async count({ model, where }) {
				const whereClause = convertWhereClause({
					model,
					where,
					action: "count"
				});
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				return await db[model].count({ where: whereClause });
			},
			async update({ model, where, update }) {
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				if (!hasRootUniqueWhereCondition(model, where)) {
					const whereClause$1 = convertWhereClause({
						model,
						where,
						action: "updateMany"
					});
					if (!(await db[model].updateMany({
						where: whereClause$1,
						data: update
					}))?.count) return null;
					return await db[model].findFirst({ where: whereClause$1 });
				}
				const whereClause = convertWhereClause({
					model,
					where,
					action: "update"
				});
				try {
					return await db[model].update({
						where: whereClause,
						data: update
					});
				} catch (e) {
					if (isPrismaNotFoundError(e)) return null;
					throw e;
				}
			},
			async updateMany({ model, where, update }) {
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				const whereClause = convertWhereClause({
					model,
					where,
					action: "updateMany"
				});
				const result = await db[model].updateMany({
					where: whereClause,
					data: update
				});
				return result ? result.count : 0;
			},
			async delete({ model, where }) {
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				if (!where?.some((w) => w.field === "id")) {
					const whereClause$1 = convertWhereClause({
						model,
						where,
						action: "deleteMany"
					});
					await db[model].deleteMany({ where: whereClause$1 });
					return;
				}
				const whereClause = convertWhereClause({
					model,
					where,
					action: "delete"
				});
				try {
					await db[model].delete({ where: whereClause });
				} catch (e) {
					if (isPrismaNotFoundError(e)) return;
					throw e;
				}
			},
			async deleteMany({ model, where }) {
				const whereClause = convertWhereClause({
					model,
					where,
					action: "deleteMany"
				});
				const result = await db[model].deleteMany({ where: whereClause });
				return result ? result.count : 0;
			},
			async consumeOne({ model, where }) {
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				if (where?.some((w) => w.field === "id")) {
					const whereClause = convertWhereClause({
						model,
						where,
						action: "delete"
					});
					try {
						return await db[model].delete({ where: whereClause }) ?? null;
					} catch (e) {
						if (isPrismaNotFoundError(e)) return null;
						throw e;
					}
				}
				const findWhere = convertWhereClause({
					model,
					where,
					action: "findOne"
				});
				const claimFromTransaction = async (tx) => {
					const target = await tx[model].findFirst({ where: findWhere });
					if (!target) return null;
					try {
						return (await tx[model].deleteMany({ where: convertWhereClause({
							model,
							where: [...where ?? [], {
								field: "id",
								value: target.id,
								operator: "eq",
								connector: "AND",
								mode: "sensitive"
							}],
							action: "deleteMany"
						}) }))?.count > 0 ? target : null;
					} catch (e) {
						if (isPrismaNotFoundError(e)) return null;
						throw e;
					}
				};
				return inTransaction || typeof db.$transaction !== "function" ? claimFromTransaction(db) : db.$transaction(claimFromTransaction);
			},
			async incrementOne({ model, where, increment, set }) {
				if (!db[model]) throw new BetterAuthError(`Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);
				const data = { ...set ?? {} };
				for (const [field, delta] of Object.entries(increment)) data[field] = { increment: delta };
				if (where?.some((w) => w.field === "id")) {
					const whereClause = convertWhereClause({
						model,
						where,
						action: "update"
					});
					try {
						return await db[model].update({
							where: whereClause,
							data
						}) ?? null;
					} catch (e) {
						if (isPrismaNotFoundError(e)) return null;
						throw e;
					}
				}
				const findWhere = convertWhereClause({
					model,
					where,
					action: "findOne"
				});
				const mutateInTransaction = async (tx) => {
					const target = await tx[model].findFirst({ where: findWhere });
					if (!target) return null;
					try {
						return await tx[model].update({
							where: convertWhereClause({
								model,
								where: [...where, {
									field: "id",
									value: target.id,
									operator: "eq",
									connector: "AND",
									mode: "sensitive"
								}],
								action: "update"
							}),
							data
						}) ?? null;
					} catch (e) {
						if (isPrismaNotFoundError(e)) return null;
						throw e;
					}
				};
				return inTransaction || typeof db.$transaction !== "function" ? mutateInTransaction(db) : db.$transaction(mutateInTransaction);
			},
			options: config
		};
	};
	let adapterOptions = null;
	adapterOptions = {
		config: {
			adapterId: "prisma",
			adapterName: "Prisma Adapter",
			usePlural: config.usePlural ?? false,
			debugLogs: config.debugLogs ?? false,
			supportsUUIDs: config.provider === "postgresql" ? true : false,
			supportsArrays: config.provider === "postgresql" || config.provider === "mongodb" ? true : false,
			transaction: config.transaction ?? false ? (cb) => prisma$1.$transaction((tx) => {
				return cb(createAdapterFactory({
					config: {
						...adapterOptions.config,
						transaction: false
					},
					adapter: createCustomAdapter(tx, true)
				})(lazyOptions));
			}) : false
		},
		adapter: createCustomAdapter(prisma$1)
	};
	const adapter = createAdapterFactory(adapterOptions);
	return (options) => {
		lazyOptions = options;
		return adapter(options);
	};
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/admin/access/statement.mjs
const defaultStatements = {
	user: [
		"create",
		"list",
		"set-role",
		"ban",
		"impersonate",
		"impersonate-admins",
		"delete",
		"set-password",
		"set-email",
		"get",
		"update"
	],
	session: [
		"list",
		"revoke",
		"delete"
	]
};
const defaultAc = createAccessControl(defaultStatements);
const adminAc = defaultAc.newRole({
	user: [
		"create",
		"list",
		"set-role",
		"ban",
		"impersonate",
		"delete",
		"set-password",
		"set-email",
		"get",
		"update"
	],
	session: [
		"list",
		"revoke",
		"delete"
	]
});
const userAc = defaultAc.newRole({
	user: [],
	session: []
});
const defaultRoles = {
	admin: adminAc,
	user: userAc
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/admin/error-codes.mjs
const ADMIN_ERROR_CODES = defineErrorCodes({
	FAILED_TO_CREATE_USER: "Failed to create user",
	USER_ALREADY_EXISTS: "User already exists.",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
	YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself",
	YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role",
	YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users",
	YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users",
	YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions",
	YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users",
	YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users",
	YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users",
	YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password",
	BANNED_USER: "You have been banned from this application",
	YOU_ARE_NOT_ALLOWED_TO_GET_USER: "You are not allowed to get user",
	NO_DATA_TO_UPDATE: "No data to update",
	YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: "You are not allowed to update users",
	YOU_CANNOT_REMOVE_YOURSELF: "You cannot remove yourself",
	YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: "You are not allowed to set a non-existent role value",
	YOU_CANNOT_IMPERSONATE_ADMINS: "You cannot impersonate admins",
	INVALID_ROLE_TYPE: "Invalid role type",
	YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: "You are not allowed to update users email",
	PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: "Password cannot be updated through update-user. Use the set-user-password endpoint instead"
});

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/utils/plugin-helper.mjs
const getEndpointResponse = async (ctx) => {
	const returned = ctx.context.returned;
	if (!returned) return null;
	if (returned instanceof Response) {
		if (returned.status !== 200) return null;
		return await returned.clone().json();
	}
	if (isAPIError$1(returned)) return null;
	return returned;
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/admin/has-permission.mjs
const hasPermission = (input) => {
	if (input.userId && input.options?.adminUserIds?.includes(input.userId)) return true;
	if (!input.permissions) return false;
	const roles = (input.role || input.options?.defaultRole || "user").split(",");
	const acRoles = input.options?.roles || defaultRoles;
	for (const role$1 of roles) if ((acRoles[role$1]?.authorize(input.permissions))?.success) return true;
	return false;
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/admin/routes.mjs
/**
* Ensures a valid session, if not will throw.
* Will also provide additional types on the user to include role types.
*/
const adminMiddleware$1 = createAuthMiddleware(async (ctx) => {
	const session = await getAuthoritativeSessionFromCtx(ctx);
	if (!session) throw APIError$1.fromStatus("UNAUTHORIZED");
	return { session };
});
function parseRoles(roles) {
	return Array.isArray(roles) ? roles.join(",") : roles;
}
const setRoleBodySchema = z$3.object({
	userId: z$3.coerce.string().meta({ description: "The user id" }),
	role: z$3.union([z$3.string().meta({ description: "The role to set. `admin` or `user` by default" }), z$3.array(z$3.string().meta({ description: "The roles to set. `admin` or `user` by default" }))]).meta({ description: "The role to set, this can be a string or an array of strings. Eg: `admin` or `[admin, user]`" })
});
/**
* ### Endpoint
*
* POST `/admin/set-role`
*
* ### API Methods
*
* **server:**
* `auth.api.setRole`
*
* **client:**
* `authClient.admin.setRole`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-set-role)
*/
const setRole = (opts) => createAuthEndpoint("/admin/set-role", {
	method: "POST",
	body: setRoleBodySchema,
	requireHeaders: true,
	use: [adminMiddleware$1],
	metadata: {
		openapi: {
			operationId: "setUserRole",
			summary: "Set the role of a user",
			description: "Set the role of a user",
			responses: { 200: {
				description: "User role updated",
				content: { "application/json": { schema: {
					type: "object",
					properties: { user: { $ref: "#/components/schemas/User" } }
				} } }
			} }
		},
		$Infer: { body: {} }
	}
}, async (ctx) => {
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: ctx.context.session.user.role,
		options: opts,
		permissions: { user: ["set-role"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE);
	const roles = opts.roles;
	if (roles) {
		const inputRoles = Array.isArray(ctx.body.role) ? ctx.body.role : [ctx.body.role];
		for (const role$1 of inputRoles) if (!roles[role$1]) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE);
	}
	if (!await ctx.context.internalAdapter.findUserById(ctx.body.userId)) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	const updatedUser = await ctx.context.internalAdapter.updateUser(ctx.body.userId, { role: parseRoles(ctx.body.role) });
	return ctx.json({ user: parseUserOutput(ctx.context.options, updatedUser) });
});
const getUserQuerySchema = z$3.object({ id: z$3.string().meta({ description: "The id of the User" }) });
const getUser = (opts) => createAuthEndpoint("/admin/get-user", {
	method: "GET",
	query: getUserQuerySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "getUser",
		summary: "Get an existing user",
		description: "Get an existing user",
		responses: { 200: {
			description: "User",
			content: { "application/json": { schema: {
				type: "object",
				properties: { user: { $ref: "#/components/schemas/User" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const { id } = ctx.query;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: ctx.context.session.user.role,
		options: opts,
		permissions: { user: ["get"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_GET_USER);
	const user = await ctx.context.internalAdapter.findUserById(id);
	if (!user) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	return parseUserOutput(ctx.context.options, user);
});
const createUserBodySchema = z$3.object({
	email: z$3.string().meta({ description: "The email of the user" }),
	password: z$3.string().optional().meta({ description: "The password of the user. If not provided, the user will be created without a credential account (useful for magic link or social login only users)." }),
	name: z$3.string().meta({ description: "The name of the user" }),
	role: z$3.union([z$3.string().meta({ description: "The role of the user" }), z$3.array(z$3.string().meta({ description: "The roles of user" }))]).optional().meta({ description: `A string or array of strings representing the roles to apply to the new user. Eg: \"user\"` }),
	data: z$3.record(z$3.string(), z$3.any()).optional().meta({ description: "Extra fields for the user. Including custom additional fields." })
});
/**
* ### Endpoint
*
* POST `/admin/create-user`
*
* ### API Methods
*
* **server:**
* `auth.api.createUser`
*
* **client:**
* `authClient.admin.createUser`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-create-user)
*/
const createUser = (opts) => createAuthEndpoint("/admin/create-user", {
	method: "POST",
	body: createUserBodySchema,
	metadata: {
		openapi: {
			operationId: "createUser",
			summary: "Create a new user",
			description: "Create a new user",
			responses: { 200: {
				description: "User created",
				content: { "application/json": { schema: {
					type: "object",
					properties: { user: { $ref: "#/components/schemas/User" } }
				} } }
			} }
		},
		$Infer: { body: {} }
	}
}, async (ctx) => {
	const session = await getAuthoritativeSessionFromCtx(ctx);
	if (!session && (ctx.request || ctx.headers)) throw ctx.error("UNAUTHORIZED");
	if (session) {
		if (!hasPermission({
			userId: session.user.id,
			role: session.user.role,
			options: opts,
			permissions: { user: ["create"] }
		})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS);
	}
	const { role: dataRole, ...userData } = ctx.body.data ?? {};
	const requestedRole = ctx.body.role ?? dataRole;
	if (requestedRole !== void 0) {
		if (session) {
			if (!hasPermission({
				userId: session.user.id,
				role: session.user.role,
				options: opts,
				permissions: { user: ["set-role"] }
			})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE);
		}
		const inputRoles = Array.isArray(requestedRole) ? requestedRole : [requestedRole];
		for (const role$1 of inputRoles) {
			if (typeof role$1 !== "string") throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.INVALID_ROLE_TYPE);
			if (opts.roles && !opts.roles[role$1]) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE);
		}
	}
	if (session && [
		"banned",
		"banReason",
		"banExpires"
	].some((key) => Object.prototype.hasOwnProperty.call(userData, key))) {
		if (!hasPermission({
			userId: session.user.id,
			role: session.user.role,
			options: opts,
			permissions: { user: ["ban"] }
		})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_BAN_USERS);
	}
	const email = ctx.body.email.toLowerCase();
	if (!z$3.email().safeParse(email).success) throw APIError$1.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
	if (await ctx.context.internalAdapter.findUserByEmail(email)) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL);
	const user = await ctx.context.internalAdapter.createUser({
		...userData,
		email,
		name: ctx.body.name,
		role: requestedRole !== void 0 ? parseRoles(requestedRole) : opts?.defaultRole ?? "user"
	});
	if (!user) throw APIError$1.from("INTERNAL_SERVER_ERROR", ADMIN_ERROR_CODES.FAILED_TO_CREATE_USER);
	if (ctx.body.password) {
		const hashedPassword = await ctx.context.password.hash(ctx.body.password);
		await ctx.context.internalAdapter.linkAccount({
			accountId: user.id,
			providerId: "credential",
			password: hashedPassword,
			userId: user.id
		});
	}
	return ctx.json({ user: parseUserOutput(ctx.context.options, user) });
});
const adminUpdateUserBodySchema = z$3.object({
	userId: z$3.coerce.string().meta({ description: "The user id" }),
	data: z$3.record(z$3.any(), z$3.any()).meta({ description: "The user data to update" })
});
/**
* ### Endpoint
*
* POST `/admin/update-user`
*
* ### API Methods
*
* **server:**
* `auth.api.adminUpdateUser`
*
* **client:**
* `authClient.admin.updateUser`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-update-user)
*/
const adminUpdateUser = (opts) => createAuthEndpoint("/admin/update-user", {
	method: "POST",
	body: adminUpdateUserBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "adminUpdateUser",
		summary: "Update a user",
		description: "Update a user's details",
		responses: { 200: {
			description: "User updated",
			content: { "application/json": { schema: {
				type: "object",
				properties: { user: { $ref: "#/components/schemas/User" } }
			} } }
		} }
	} }
}, async (ctx) => {
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: ctx.context.session.user.role,
		options: opts,
		permissions: { user: ["update"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS);
	if (Object.keys(ctx.body.data).length === 0) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.NO_DATA_TO_UPDATE);
	const updateData = ctx.body.data;
	const hasDataKey = (key) => Object.prototype.hasOwnProperty.call(updateData, key);
	if (hasDataKey("password")) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER);
	if (Object.prototype.hasOwnProperty.call(ctx.body.data, "role")) {
		if (!hasPermission({
			userId: ctx.context.session.user.id,
			role: ctx.context.session.user.role,
			options: opts,
			permissions: { user: ["set-role"] }
		})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE);
		const roleValue = ctx.body.data.role;
		const inputRoles = Array.isArray(roleValue) ? roleValue : [roleValue];
		for (const role$1 of inputRoles) {
			if (typeof role$1 !== "string") throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.INVALID_ROLE_TYPE);
			if (opts.roles && !opts.roles[role$1]) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE);
		}
		ctx.body.data.role = parseRoles(inputRoles);
	}
	if ([
		"banned",
		"banReason",
		"banExpires"
	].some(hasDataKey)) {
		if (!hasPermission({
			userId: ctx.context.session.user.id,
			role: ctx.context.session.user.role,
			options: opts,
			permissions: { user: ["ban"] }
		})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_BAN_USERS);
		if (updateData.banned === true && ctx.body.userId === ctx.context.session.user.id) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.YOU_CANNOT_BAN_YOURSELF);
	}
	if (hasDataKey("email") || hasDataKey("emailVerified")) {
		if (!hasPermission({
			userId: ctx.context.session.user.id,
			role: ctx.context.session.user.role,
			options: opts,
			permissions: { user: ["set-email"] }
		})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL);
		if (hasDataKey("email")) {
			const email = String(updateData.email).toLowerCase();
			if (!z$3.email().safeParse(email).success) throw APIError$1.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
			const existUser = await ctx.context.internalAdapter.findUserByEmail(email);
			if (existUser && existUser.user.id !== ctx.body.userId) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL);
			updateData.email = email;
		}
	}
	if (!await ctx.context.internalAdapter.findUserById(ctx.body.userId)) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	const updatedUser = await ctx.context.internalAdapter.updateUser(ctx.body.userId, ctx.body.data);
	if (updateData.banned === true) await ctx.context.internalAdapter.deleteUserSessions(ctx.body.userId);
	return ctx.json(parseUserOutput(ctx.context.options, updatedUser));
});
const listUsersQuerySchema = z$3.object({
	searchValue: z$3.string().optional().meta({ description: "The value to search for. Eg: \"some name\"" }),
	searchField: z$3.enum(["email", "name"]).meta({ description: "The field to search in, defaults to email. Can be `email` or `name`. Eg: \"name\"" }).optional(),
	searchOperator: z$3.enum([
		"contains",
		"starts_with",
		"ends_with"
	]).meta({ description: "The operator to use for the search. Can be `contains`, `starts_with` or `ends_with`. Eg: \"contains\"" }).optional(),
	limit: z$3.string().meta({ description: "The number of users to return" }).or(z$3.number()).optional(),
	offset: z$3.string().meta({ description: "The offset to start from" }).or(z$3.number()).optional(),
	sortBy: z$3.string().meta({ description: "The field to sort by" }).optional(),
	sortDirection: z$3.enum(["asc", "desc"]).meta({ description: "The direction to sort by" }).optional(),
	filterField: z$3.string().meta({ description: "The field to filter by" }).optional(),
	filterValue: z$3.string().meta({ description: "The value to filter by" }).or(z$3.number()).or(z$3.boolean()).or(z$3.array(z$3.string())).or(z$3.array(z$3.number())).optional(),
	filterOperator: z$3.enum(whereOperators).meta({ description: "The operator to use for the filter" }).optional()
});
const listUsers = (opts) => createAuthEndpoint("/admin/list-users", {
	method: "GET",
	use: [adminMiddleware$1],
	query: listUsersQuerySchema,
	metadata: { openapi: {
		operationId: "listUsers",
		summary: "List users",
		description: "List users",
		responses: { 200: {
			description: "List of users",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					users: {
						type: "array",
						items: { $ref: "#/components/schemas/User" }
					},
					total: { type: "number" },
					limit: { type: "number" },
					offset: { type: "number" }
				},
				required: ["users", "total"]
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { user: ["list"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_LIST_USERS);
	const where = [];
	if (ctx.query?.searchValue) where.push({
		field: ctx.query.searchField || "email",
		operator: ctx.query.searchOperator || "contains",
		value: ctx.query.searchValue
	});
	if (ctx.query?.filterValue !== void 0) where.push({
		field: ctx.query.filterField || "email",
		operator: ctx.query.filterOperator || "eq",
		value: ctx.query.filterValue
	});
	try {
		const users = await ctx.context.internalAdapter.listUsers(Number(ctx.query?.limit) || void 0, Number(ctx.query?.offset) || void 0, ctx.query?.sortBy ? {
			field: ctx.query.sortBy,
			direction: ctx.query.sortDirection || "asc"
		} : void 0, where.length ? where : void 0);
		const total = await ctx.context.internalAdapter.countTotalUsers(where.length ? where : void 0);
		return ctx.json({
			users: users.map((user) => parseUserOutput(ctx.context.options, user)),
			total,
			limit: Number(ctx.query?.limit) || void 0,
			offset: Number(ctx.query?.offset) || void 0
		});
	} catch {
		return ctx.json({
			users: [],
			total: 0
		});
	}
});
const listUserSessionsBodySchema = z$3.object({ userId: z$3.coerce.string().meta({ description: "The user id" }) });
/**
* ### Endpoint
*
* POST `/admin/list-user-sessions`
*
* ### API Methods
*
* **server:**
* `auth.api.listUserSessions`
*
* **client:**
* `authClient.admin.listUserSessions`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-list-user-sessions)
*/
const listUserSessions = (opts) => createAuthEndpoint("/admin/list-user-sessions", {
	method: "POST",
	use: [adminMiddleware$1],
	body: listUserSessionsBodySchema,
	metadata: { openapi: {
		operationId: "adminListUserSessions",
		summary: "List user sessions",
		description: "List user sessions",
		responses: { 200: {
			description: "List of user sessions",
			content: { "application/json": { schema: {
				type: "object",
				properties: { sessions: {
					type: "array",
					items: { $ref: "#/components/schemas/Session" }
				} }
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { session: ["list"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS);
	const sessions = await ctx.context.internalAdapter.listSessions(ctx.body.userId);
	return ctx.json({ sessions: sessions.map((s) => parseSessionOutput(ctx.context.options, s)) });
});
const unbanUserBodySchema = z$3.object({ userId: z$3.coerce.string().meta({ description: "The user id" }) });
/**
* ### Endpoint
*
* POST `/admin/unban-user`
*
* ### API Methods
*
* **server:**
* `auth.api.unbanUser`
*
* **client:**
* `authClient.admin.unbanUser`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-unban-user)
*/
const unbanUser = (opts) => createAuthEndpoint("/admin/unban-user", {
	method: "POST",
	body: unbanUserBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "unbanUser",
		summary: "Unban a user",
		description: "Unban a user",
		responses: { 200: {
			description: "User unbanned",
			content: { "application/json": { schema: {
				type: "object",
				properties: { user: { $ref: "#/components/schemas/User" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { user: ["ban"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_BAN_USERS);
	if (!await ctx.context.internalAdapter.findUserById(ctx.body.userId)) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	const user = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
		banned: false,
		banExpires: null,
		banReason: null,
		updatedAt: /* @__PURE__ */ new Date()
	});
	return ctx.json({ user: parseUserOutput(ctx.context.options, user) });
});
const banUserBodySchema = z$3.object({
	userId: z$3.coerce.string().meta({ description: "The user id" }),
	banReason: z$3.string().meta({ description: "The reason for the ban" }).optional(),
	banExpiresIn: z$3.number().meta({ description: "The number of seconds until the ban expires" }).optional()
});
/**
* ### Endpoint
*
* POST `/admin/ban-user`
*
* ### API Methods
*
* **server:**
* `auth.api.banUser`
*
* **client:**
* `authClient.admin.banUser`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-ban-user)
*/
const banUser = (opts) => createAuthEndpoint("/admin/ban-user", {
	method: "POST",
	body: banUserBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "banUser",
		summary: "Ban a user",
		description: "Ban a user",
		responses: { 200: {
			description: "User banned",
			content: { "application/json": { schema: {
				type: "object",
				properties: { user: { $ref: "#/components/schemas/User" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { user: ["ban"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_BAN_USERS);
	if (!await ctx.context.internalAdapter.findUserById(ctx.body.userId)) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	if (ctx.body.userId === ctx.context.session.user.id) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.YOU_CANNOT_BAN_YOURSELF);
	const user = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
		banned: true,
		banReason: ctx.body.banReason || opts?.defaultBanReason || "No reason",
		banExpires: ctx.body.banExpiresIn ? getDate$1(ctx.body.banExpiresIn, "sec") : opts?.defaultBanExpiresIn ? getDate$1(opts.defaultBanExpiresIn, "sec") : void 0,
		updatedAt: /* @__PURE__ */ new Date()
	});
	await ctx.context.internalAdapter.deleteUserSessions(ctx.body.userId);
	return ctx.json({ user: parseUserOutput(ctx.context.options, user) });
});
const impersonateUserBodySchema = z$3.object({ userId: z$3.coerce.string().meta({ description: "The user id" }) });
/**
* ### Endpoint
*
* POST `/admin/impersonate-user`
*
* ### API Methods
*
* **server:**
* `auth.api.impersonateUser`
*
* **client:**
* `authClient.admin.impersonateUser`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-impersonate-user)
*/
const impersonateUser = (opts) => createAuthEndpoint("/admin/impersonate-user", {
	method: "POST",
	body: impersonateUserBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "impersonateUser",
		summary: "Impersonate a user",
		description: "Impersonate a user",
		responses: { 200: {
			description: "Impersonation session created",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					session: { $ref: "#/components/schemas/Session" },
					user: { $ref: "#/components/schemas/User" }
				}
			} } }
		} }
	} }
}, async (ctx) => {
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: ctx.context.session.user.role,
		options: opts,
		permissions: { user: ["impersonate"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS);
	const targetUser = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
	if (!targetUser) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	const adminRoles = (Array.isArray(opts.adminRoles) ? opts.adminRoles : opts.adminRoles?.split(",") || []).map((role$1) => role$1.trim());
	if ((targetUser.role || opts.defaultRole || "user").split(",").some((role$1) => adminRoles.includes(role$1)) || !!opts.adminUserIds?.includes(targetUser.id)) {
		if (!(opts.allowImpersonatingAdmins === true || hasPermission({
			userId: ctx.context.session.user.id,
			role: ctx.context.session.user.role,
			options: opts,
			permissions: { user: ["impersonate-admins"] }
		}))) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_CANNOT_IMPERSONATE_ADMINS);
	}
	const session = await ctx.context.internalAdapter.createSession(targetUser.id, true, {
		impersonatedBy: ctx.context.session.user.id,
		expiresAt: opts?.impersonationSessionDuration ? getDate$1(opts.impersonationSessionDuration, "sec") : getDate$1(3600, "sec")
	}, true);
	if (!session) throw APIError$1.from("INTERNAL_SERVER_ERROR", ADMIN_ERROR_CODES.FAILED_TO_CREATE_USER);
	const authCookies = ctx.context.authCookies;
	deleteSessionCookie(ctx);
	const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
	const adminCookieProp = ctx.context.createAuthCookie("admin_session");
	await ctx.setSignedCookie(adminCookieProp.name, `${ctx.context.session.session.token}:${dontRememberMeCookie || ""}`, ctx.context.secret, authCookies.sessionToken.attributes);
	await setSessionCookie(ctx, {
		session,
		user: targetUser
	}, true);
	return ctx.json({
		session,
		user: parseUserOutput(ctx.context.options, targetUser)
	});
});
/**
* ### Endpoint
*
* POST `/admin/stop-impersonating`
*
* ### API Methods
*
* **server:**
* `auth.api.stopImpersonating`
*
* **client:**
* `authClient.admin.stopImpersonating`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-stop-impersonating)
*/
const stopImpersonating = () => createAuthEndpoint("/admin/stop-impersonating", {
	method: "POST",
	requireHeaders: true
}, async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (!session) throw APIError$1.fromStatus("UNAUTHORIZED");
	if (!session.session.impersonatedBy) throw APIError$1.fromStatus("BAD_REQUEST", { message: "You are not impersonating anyone" });
	const user = await ctx.context.internalAdapter.findUserById(session.session.impersonatedBy);
	if (!user) throw APIError$1.fromStatus("INTERNAL_SERVER_ERROR", { message: "Failed to find user" });
	const adminSessionCookie = ctx.context.createAuthCookie("admin_session");
	const adminCookie = await ctx.getSignedCookie(adminSessionCookie.name, ctx.context.secret);
	if (!adminCookie) throw APIError$1.fromStatus("INTERNAL_SERVER_ERROR", { message: "Failed to find admin session" });
	const [adminSessionToken, dontRememberMeCookie] = adminCookie?.split(":");
	const adminSession = await ctx.context.internalAdapter.findSession(adminSessionToken);
	if (!adminSession || adminSession.session.userId !== user.id) throw APIError$1.fromStatus("INTERNAL_SERVER_ERROR", { message: "Failed to find admin session" });
	await ctx.context.internalAdapter.deleteSession(session.session.token);
	await setSessionCookie(ctx, adminSession, !!dontRememberMeCookie);
	expireCookie(ctx, adminSessionCookie);
	return ctx.json({
		session: parseSessionOutput(ctx.context.options, adminSession.session),
		user: parseUserOutput(ctx.context.options, adminSession.user)
	});
});
const revokeUserSessionBodySchema = z$3.object({ sessionToken: z$3.string().meta({ description: "The session token" }) });
/**
* ### Endpoint
*
* POST `/admin/revoke-user-session`
*
* ### API Methods
*
* **server:**
* `auth.api.revokeUserSession`
*
* **client:**
* `authClient.admin.revokeUserSession`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-revoke-user-session)
*/
const revokeUserSession = (opts) => createAuthEndpoint("/admin/revoke-user-session", {
	method: "POST",
	body: revokeUserSessionBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "revokeUserSession",
		summary: "Revoke a user session",
		description: "Revoke a user session",
		responses: { 200: {
			description: "Session revoked",
			content: { "application/json": { schema: {
				type: "object",
				properties: { success: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { session: ["revoke"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS);
	await ctx.context.internalAdapter.deleteSession(ctx.body.sessionToken);
	return ctx.json({ success: true });
});
const revokeUserSessionsBodySchema = z$3.object({ userId: z$3.coerce.string().meta({ description: "The user id" }) });
/**
* ### Endpoint
*
* POST `/admin/revoke-user-sessions`
*
* ### API Methods
*
* **server:**
* `auth.api.revokeUserSessions`
*
* **client:**
* `authClient.admin.revokeUserSessions`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-revoke-user-sessions)
*/
const revokeUserSessions = (opts) => createAuthEndpoint("/admin/revoke-user-sessions", {
	method: "POST",
	body: revokeUserSessionsBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "revokeUserSessions",
		summary: "Revoke all user sessions",
		description: "Revoke all user sessions",
		responses: { 200: {
			description: "Sessions revoked",
			content: { "application/json": { schema: {
				type: "object",
				properties: { success: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { session: ["revoke"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS);
	await ctx.context.internalAdapter.deleteUserSessions(ctx.body.userId);
	return ctx.json({ success: true });
});
const removeUserBodySchema = z$3.object({ userId: z$3.coerce.string().meta({ description: "The user id" }) });
/**
* ### Endpoint
*
* POST `/admin/remove-user`
*
* ### API Methods
*
* **server:**
* `auth.api.removeUser`
*
* **client:**
* `authClient.admin.removeUser`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-remove-user)
*/
const removeUser = (opts) => createAuthEndpoint("/admin/remove-user", {
	method: "POST",
	body: removeUserBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "removeUser",
		summary: "Remove a user",
		description: "Delete a user and all their sessions and accounts. Cannot be undone.",
		responses: { 200: {
			description: "User removed",
			content: { "application/json": { schema: {
				type: "object",
				properties: { success: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: session.user.role,
		options: opts,
		permissions: { user: ["delete"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS);
	if (ctx.body.userId === ctx.context.session.user.id) throw APIError$1.from("BAD_REQUEST", ADMIN_ERROR_CODES.YOU_CANNOT_REMOVE_YOURSELF);
	if (!await ctx.context.internalAdapter.findUserById(ctx.body.userId)) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	await ctx.context.internalAdapter.deleteUserSessions(ctx.body.userId);
	await ctx.context.internalAdapter.deleteUser(ctx.body.userId);
	return ctx.json({ success: true });
});
const setUserPasswordBodySchema = z$3.object({
	newPassword: z$3.string().nonempty("newPassword cannot be empty").meta({ description: "The new password" }),
	userId: z$3.coerce.string().nonempty("userId cannot be empty").meta({ description: "The user id" })
});
/**
* ### Endpoint
*
* POST `/admin/set-user-password`
*
* ### API Methods
*
* **server:**
* `auth.api.setUserPassword`
*
* **client:**
* `authClient.admin.setUserPassword`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-set-user-password)
*/
const setUserPassword = (opts) => createAuthEndpoint("/admin/set-user-password", {
	method: "POST",
	body: setUserPasswordBodySchema,
	use: [adminMiddleware$1],
	metadata: { openapi: {
		operationId: "setUserPassword",
		summary: "Set a user's password",
		description: "Set a user's password",
		responses: { 200: {
			description: "Password set",
			content: { "application/json": { schema: {
				type: "object",
				properties: { status: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	if (!hasPermission({
		userId: ctx.context.session.user.id,
		role: ctx.context.session.user.role,
		options: opts,
		permissions: { user: ["set-password"] }
	})) throw APIError$1.from("FORBIDDEN", ADMIN_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD);
	const { newPassword, userId } = ctx.body;
	const minPasswordLength = ctx.context.password.config.minPasswordLength;
	if (newPassword.length < minPasswordLength) {
		ctx.context.logger.warn("Password is too short");
		throw APIError$1.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
	}
	const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
	if (newPassword.length > maxPasswordLength) {
		ctx.context.logger.warn("Password is too long");
		throw APIError$1.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
	}
	if (!await ctx.context.internalAdapter.findUserById(userId)) throw APIError$1.from("NOT_FOUND", BASE_ERROR_CODES.USER_NOT_FOUND);
	const hashedPassword = await ctx.context.password.hash(newPassword);
	if ((await ctx.context.internalAdapter.findAccounts(userId)).find((account) => account.providerId === "credential")) await ctx.context.internalAdapter.updatePassword(userId, hashedPassword);
	else await ctx.context.internalAdapter.createAccount({
		userId,
		providerId: "credential",
		accountId: userId,
		password: hashedPassword
	});
	return ctx.json({ status: true });
});
const userHasPermissionBodySchema = z$3.object({
	userId: z$3.coerce.string().optional().meta({ description: `The user id. Eg: "user-id"` }),
	role: z$3.string().optional().meta({ description: `The role to check permission for. Eg: "admin"` })
}).and(z$3.xor([z$3.object({ permission: z$3.record(z$3.string(), z$3.array(z$3.string())) }), z$3.object({ permissions: z$3.record(z$3.string(), z$3.array(z$3.string())) })]));
/**
* ### Endpoint
*
* POST `/admin/has-permission`
*
* ### API Methods
*
* **server:**
* `auth.api.userHasPermission`
*
* **client:**
* `authClient.admin.hasPermission`
*
* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-has-permission)
*/
const userHasPermission = (opts) => {
	return createAuthEndpoint("/admin/has-permission", {
		method: "POST",
		body: userHasPermissionBodySchema,
		metadata: {
			openapi: {
				description: "Check if the user has permission",
				requestBody: { content: { "application/json": { schema: {
					type: "object",
					properties: { permissions: {
						type: "object",
						description: "The permission to check"
					} },
					required: ["permissions"]
				} } } },
				responses: { "200": {
					description: "Success",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							error: { type: "string" },
							success: { type: "boolean" }
						},
						required: ["success"]
					} } }
				} }
			},
			$Infer: { body: {} }
		}
	}, async (ctx) => {
		if (!ctx.body?.permissions) throw new APIError$1("BAD_REQUEST", { message: "invalid permission check. no permission(s) were passed." });
		const session = await getAuthoritativeSessionFromCtx(ctx);
		if (!session && (ctx.request || ctx.headers)) throw new APIError$1("UNAUTHORIZED");
		if (!session && !ctx.body.userId && !ctx.body.role) throw new APIError$1("BAD_REQUEST", { message: "user id or role is required" });
		const user = session?.user || (ctx.body.role ? {
			id: ctx.body.userId || "",
			role: ctx.body.role
		} : null) || (ctx.body.userId ? await ctx.context.internalAdapter.findUserById(ctx.body.userId) : null);
		if (!user) throw new APIError$1("BAD_REQUEST", { message: "user not found" });
		const result = hasPermission({
			userId: user.id,
			role: user.role,
			options: opts,
			permissions: ctx.body.permissions
		});
		return ctx.json({
			error: null,
			success: result
		});
	});
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/admin/schema.mjs
const schema = {
	user: { fields: {
		role: {
			type: "string",
			required: false,
			input: false
		},
		banned: {
			type: "boolean",
			defaultValue: false,
			required: false,
			input: false
		},
		banReason: {
			type: "string",
			required: false,
			input: false
		},
		banExpires: {
			type: "date",
			required: false,
			input: false
		}
	} },
	session: { fields: { impersonatedBy: {
		type: "string",
		required: false,
		input: false
	} } }
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/admin/admin.mjs
const admin = (options) => {
	const opts = {
		...options || {},
		defaultRole: options?.defaultRole ?? "user",
		adminRoles: options?.adminRoles ?? ["admin"],
		bannedUserMessage: options?.bannedUserMessage ?? "You have been banned from this application. Please contact support if you believe this is an error."
	};
	if (options?.adminRoles) {
		const invalidRoles = (Array.isArray(options.adminRoles) ? options.adminRoles : [...options.adminRoles.split(",")]).filter((role$1) => !Object.keys(options?.roles || defaultRoles).map((r) => r.toLowerCase()).includes(role$1.toLowerCase()));
		if (invalidRoles.length > 0) throw new BetterAuthError(`Invalid admin roles: ${invalidRoles.join(", ")}. Admin roles must be defined in the 'roles' configuration.`);
	}
	return {
		id: "admin",
		version: PACKAGE_VERSION$1,
		init() {
			return { options: { databaseHooks: {
				user: { create: { async before(user) {
					return { data: {
						role: options?.defaultRole ?? "user",
						...user
					} };
				} } },
				session: { create: { async before(session, ctx) {
					if (!ctx) return;
					const user = await ctx.context.internalAdapter.findUserById(session.userId);
					if (user?.banned) {
						if (user.banExpires && new Date(user.banExpires).getTime() < Date.now()) {
							await ctx.context.internalAdapter.updateUser(session.userId, {
								banned: false,
								banReason: null,
								banExpires: null
							});
							return;
						}
						throw APIError$1.from("FORBIDDEN", {
							message: opts.bannedUserMessage,
							code: "BANNED_USER"
						});
					}
				} } }
			} } };
		},
		hooks: { after: [{
			matcher(context) {
				return context.path === "/list-sessions";
			},
			handler: createAuthMiddleware(async (ctx) => {
				const response = await getEndpointResponse(ctx);
				if (!response) return;
				const newJson = response.filter((session) => {
					return !session.impersonatedBy;
				});
				return ctx.json(newJson);
			})
		}] },
		endpoints: {
			setRole: setRole(opts),
			getUser: getUser(opts),
			createUser: createUser(opts),
			adminUpdateUser: adminUpdateUser(opts),
			listUsers: listUsers(opts),
			listUserSessions: listUserSessions(opts),
			unbanUser: unbanUser(opts),
			banUser: banUser(opts),
			impersonateUser: impersonateUser(opts),
			stopImpersonating: stopImpersonating(),
			revokeUserSession: revokeUserSession(opts),
			revokeUserSessions: revokeUserSessions(opts),
			removeUser: removeUser(opts),
			setUserPassword: setUserPassword(opts),
			userHasPermission: userHasPermission(opts)
		},
		$ERROR_CODES: ADMIN_ERROR_CODES,
		schema: mergeSchema(schema, opts.schema),
		options
	};
};

//#endregion
//#region ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/helper/factory/index.js
var createMiddleware = (middleware) => middleware;

//#endregion
//#region ../../packages/auth/dist/index.mjs
/**
* Hashes an API key using SHA-256.
* @param key The raw API key to hash.
* @returns The hex-encoded SHA-256 hash.
*/
function hashApiKey(key) {
	return createHash("sha256").update(key).digest("hex");
}
const assertEnv = (val, name) => {
	if (!val) throw new Error(`${name} is required but missing from ENV_CONFIG`);
	return val;
};
let _authInstance = null;
function getAuth() {
	if (!_authInstance) {
		const plugins = [admin(), apiKey({ apiKeyHeaders: "X-API-KEY" })];
		if (dodoPlugin) plugins.push(dodoPlugin);
		_authInstance = betterAuth({
			database: prismaAdapter(prisma, { provider: "postgresql" }),
			trustedOrigins: [ENV_CONFIG.BASE_URL, "http://localhost:5173"],
			baseURL: ENV_CONFIG.BASE_URL,
			emailAndPassword: {
				enabled: ENV_CONFIG.EMAIL_PSW_AUTH_ENABLED,
				requireEmailVerification: false,
				minPasswordLength: 8,
				maxPasswordLength: 128,
				autoSignIn: true,
				disableSignUp: ENV_CONFIG.DISABLE_EMAIL_SIGNUP
			},
			...ENV_CONFIG.GOOGLE_AUTH_ENABLED ? { socialProviders: { google: {
				clientId: assertEnv(ENV_CONFIG.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID"),
				clientSecret: assertEnv(ENV_CONFIG.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET")
			} } } : {},
			plugins,
			databaseHooks: { user: { create: { after: async (user) => {
				const key = `gwi_${crypto.randomUUID().replace(/-/g, "")}`;
				await prisma.apiKey.create({ data: {
					key: hashApiKey(key),
					name: "Default API Key",
					userId: user.id,
					start: key.substring(0, 4),
					prefix: "gwi"
				} });
				if (user.email === ENV_CONFIG.ADMIN_EMAIL_ADDRESS) await prisma.user.update({
					where: { id: user.id },
					data: { role: "admin" }
				});
			} } } }
		});
	}
	return _authInstance;
}
const auth = new Proxy({}, { get(_target, prop, receiver) {
	return Reflect.get(getAuth(), prop, receiver);
} });
const authMiddleware = createMiddleware(async (c, next) => {
	if (!c.get("session")) {
		const apiKeyHeader = c.req.header("X-API-KEY");
		if (apiKeyHeader) {
			const hashedKey = hashApiKey(apiKeyHeader);
			const keyRecord = await prisma.apiKey.findUnique({
				where: { key: hashedKey },
				include: { user: true }
			});
			if (keyRecord) {
				c.set("user", keyRecord.user);
				c.set("session", {
					id: "api-key-session",
					userId: keyRecord.userId,
					expiresAt: new Date(Date.now() + 1e3 * 60 * 60),
					token: apiKeyHeader,
					createdAt: /* @__PURE__ */ new Date(),
					updatedAt: /* @__PURE__ */ new Date(),
					ipAddress: c.req.header("x-forwarded-for") || null,
					userAgent: c.req.header("user-agent") || null
				});
				c.set("isApiKeyAuth", true);
				await prisma.apiKey.update({
					where: { id: keyRecord.id },
					data: { lastUsedAt: /* @__PURE__ */ new Date() }
				});
				await next();
				return;
			}
		}
		if (!apiKeyHeader) return c.json({
			error: "Unauthorized",
			message: "Missing or invalid API key"
		}, 401, { "WWW-Authenticate": "Bearer error=\"invalid_token\"" });
		throw new HTTPException(401, { res: new Response("Unauthorized - Invalid API Key", { status: 401 }) });
	}
	await next();
});
const adminMiddleware = createMiddleware(async (c, next) => {
	if (c.get("user")?.role !== "admin") return c.json({
		error: "Forbidden",
		message: "Admin privileges required"
	}, 403);
	await next();
});
/**
* Get user from context if available, or null
*/
function getUserOrNull(c) {
	return c.get("user") ?? null;
}
/**
* Get anonymous session ID from cookie or context
*/
function getAnonymousSessionId(c) {
	return getCookie(c, "anonymous_session_id") || c.get("anonymousSessionId") || null;
}
/**
* Assert user owns the node (via canvas ownership)
* API key auth bypasses ownership checks
*/
async function assertNodeOwnership(c, nodeId) {
	const user = getUserOrNull(c);
	const anonymousSessionId = getAnonymousSessionId(c);
	let node;
	if (user) node = await prisma.node.findFirst({ where: {
		id: nodeId,
		canvas: { OR: [{ userId: user.id }, {
			userId: null,
			anonymousSessionId
		}] }
	} });
	else if (anonymousSessionId) node = await prisma.node.findFirst({ where: {
		id: nodeId,
		canvas: {
			userId: null,
			anonymousSessionId
		}
	} });
	if (!node) throw new HTTPException(404, { message: "Node not found" });
	return node;
}

//#endregion
//#region ../../nodes/node-import/dist/server.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ImportProcessor = class ImportProcessor$1 {
	async process({ node, data }) {
		const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
		if (!outputHandle) return {
			success: false,
			error: "No output handle found"
		};
		const result = node.result;
		if (!result || !result.outputs) return {
			success: true,
			newResult: {
				outputs: [],
				selectedOutputIndex: 0
			}
		};
		return {
			success: true,
			newResult: {
				...result,
				outputs: result.outputs?.map((output) => ({ items: output.items.map((m) => ({
					type: m.type,
					outputHandleId: outputHandle.id,
					data: m.data
				})) }))
			}
		};
	}
};
ImportProcessor = __decorate([injectable()], ImportProcessor);
const uploadSchema = z$1.object({ file: z$1.any() });
const prepareSchema = z$1.object({
	filename: z$1.string(),
	mimeType: z$1.string(),
	fileSize: z$1.number().optional()
});
const finishSchema = z$1.object({
	key: z$1.string(),
	filename: z$1.string(),
	mimeType: z$1.string()
});
const importNodeRouter = new Hono().post("/upload/:nodeId", zValidator("form", uploadSchema), async (c) => {
	const { nodeId } = c.req.param();
	const file = (await c.req.parseBody()).file;
	if (!(file instanceof File)) return c.json({ error: "File is required" }, 400);
	try {
		await assertNodeOwnership(c, nodeId);
		const user = getUserOrNull(c);
		const anonymousSessionId = getAnonymousSessionId(c) || void 0;
		const updatedNode = await uploadToImportNode({
			nodeId,
			buffer: Buffer.from(await file.arrayBuffer()),
			filename: file.name,
			mimeType: file.type || void 0,
			userId: user?.id,
			anonymousSessionId
		});
		return c.json(updatedNode);
	} catch (error) {
		logger.error({
			err: error,
			nodeId
		}, "Import upload failed");
		const message = error instanceof Error ? error.message : "Upload failed";
		return c.json({ error: message }, 400);
	}
}).post("/prepare/:nodeId", zValidator("json", prepareSchema), async (c) => {
	const { nodeId } = c.req.param();
	const { filename, mimeType, fileSize } = c.req.valid("json");
	try {
		await assertNodeOwnership(c, nodeId);
		const user = getUserOrNull(c);
		const anonymousSessionId = getAnonymousSessionId(c) || void 0;
		const result = await prepareUploadToImportNode({
			nodeId,
			filename,
			mimeType,
			fileSize,
			userId: user?.id,
			anonymousSessionId
		});
		return c.json(result);
	} catch (error) {
		logger.error({
			err: error,
			nodeId
		}, "Import preparation failed");
		const message = error instanceof Error ? error.message : "Preparation failed";
		return c.json({ error: message }, 400);
	}
}).post("/finish/:nodeId", zValidator("json", finishSchema), async (c) => {
	const { nodeId } = c.req.param();
	const { key, filename, mimeType } = c.req.valid("json");
	try {
		await assertNodeOwnership(c, nodeId);
		const user = getUserOrNull(c);
		const anonymousSessionId = getAnonymousSessionId(c) || void 0;
		const updatedNode = await finishUploadToImportNode({
			nodeId,
			key,
			filename,
			mimeType,
			userId: user?.id,
			anonymousSessionId
		});
		return c.json(updatedNode);
	} catch (error) {
		logger.error({
			err: error,
			nodeId
		}, "Import completion failed");
		const message = error instanceof Error ? error.message : "Completion failed";
		return c.json({ error: message }, 400);
	}
});
var server_default = defineNode(metadata, {
	backendProcessor: ImportProcessor,
	route: importNodeRouter
});

//#endregion
export { server_default as default };