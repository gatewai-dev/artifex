import fs from "node:fs";
import os from "node:os";
import path from "node:path";

//#region src/env.ts
function ensureEnvDefaults() {
	process.env.LOG_LEVEL ??= "error";
	const fileBaseUrl = `file://${process.env.GATEWAI_STORAGE_DIR ? path.resolve(process.env.GATEWAI_STORAGE_DIR) : path.join(os.tmpdir(), "gatewai-storage")}`;
	const defaults = {
		BASE_URL: fileBaseUrl,
		RENDERER_URL: fileBaseUrl,
		FRONTEND_PATH: "./dist",
		REDIS_HOST: "localhost",
		REDIS_PORT: "6379",
		EMAIL_PSW_AUTH_ENABLED: "true",
		GOOGLE_AUTH_ENABLED: "false",
		ENABLE_PRICING: "false",
		R2_ASSETS_BUCKET: "dummy-bucket",
		R2_S3_API_ENDPOINT: "http://localhost:9000",
		R2_ACCESS_KEY_ID: "local",
		R2_SECRET_ACCESS_KEY: "local",
		DODO_PAYMENTS_BASE_URL: "http://localhost:8083",
		BETTER_AUTH_SECRET: "gatewai-artifex-default-secret-32-chars-minimum-key",
		GATEWAI_CONCURRENT_RENDERS: "2"
	};
	for (const [k, v] of Object.entries(defaults)) if (!process.env[k]) process.env[k] = v;
	try {
		if (process.env.BASE_URL) new URL(process.env.BASE_URL);
		else process.env.BASE_URL = "http://localhost:8081";
	} catch {
		process.env.BASE_URL = "http://localhost:8081";
	}
	const homeDir = process.env.HOME || process.env.USERPROFILE;
	if (homeDir) {
		const credentialsPath = path.join(homeDir, ".config", "gatewai", "credentials.json");
		if (fs.existsSync(credentialsPath)) try {
			const creds = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
			const falKey = creds.fal || creds.GATEWAI_FAL_API_KEY;
			if (falKey && !process.env.FAL_API_KEY) process.env.FAL_API_KEY = falKey;
			const openrouterKey = creds.openrouter || creds.GATEWAI_OPENROUTER_API_KEY;
			if (openrouterKey && !process.env.OPENROUTER_API_KEY) process.env.OPENROUTER_API_KEY = openrouterKey;
		} catch (err) {
			console.warn(`Warning: Failed to parse credentials file at ${credentialsPath}:`, err);
		}
	}
	if (process.env.GATEWAI_FAL_API_KEY && !process.env.FAL_API_KEY) process.env.FAL_API_KEY = process.env.GATEWAI_FAL_API_KEY;
	if (process.env.GATEWAI_OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY) process.env.OPENROUTER_API_KEY = process.env.GATEWAI_OPENROUTER_API_KEY;
	process.env.FAL_API_KEY ??= "dummy-fal-key";
	process.env.OPENROUTER_API_KEY ??= "dummy-openrouter-key";
}

//#endregion
export { ensureEnvDefaults as t };