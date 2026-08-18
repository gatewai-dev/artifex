import fs from "node:fs";
import path from "node:path";

export function loadEnvFile(envPath?: string): void {
	const targetPath = envPath || path.join(process.cwd(), ".env");
	if (fs.existsSync(targetPath)) {
		try {
			const envContent = fs.readFileSync(targetPath, "utf-8");
			for (const line of envContent.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIdx = trimmed.indexOf("=");
				if (eqIdx !== -1) {
					const key = trimmed.slice(0, eqIdx).trim();
					let val = trimmed.slice(eqIdx + 1).trim();
					if (
						(val.startsWith('"') && val.endsWith('"')) ||
						(val.startsWith("'") && val.endsWith("'"))
					) {
						val = val.slice(1, -1);
					}
					if (key && process.env[key] === undefined) {
						process.env[key] = val;
					}
				}
			}
		} catch (err) {
			console.warn(`Warning: Failed to parse .env file at ${targetPath}:`, err);
		}
	}
}

export function ensureEnvDefaults(): void {
	loadEnvFile();

	process.env.LOG_LEVEL ??= "error";

	const storageTmpDir = process.env.GATEWAI_STORAGE_DIR
		? path.resolve(process.env.GATEWAI_STORAGE_DIR)
		: path.resolve(process.cwd(), "gw-assets");
	const fileBaseUrl = `file://${storageTmpDir}`;

	const defaults: Record<string, string> = {
		GATEWAI_STORAGE_DIR: storageTmpDir,
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
		GATEWAI_CONCURRENT_RENDERS: "2",
	};

	for (const [k, v] of Object.entries(defaults)) {
		if (!process.env[k]) {
			process.env[k] = v;
		}
	}

	process.env.GATEWAI_STORAGE_DIR = storageTmpDir;

	try {
		if (process.env.BASE_URL) {
			new URL(process.env.BASE_URL);
		} else {
			process.env.BASE_URL = "http://localhost:8081";
		}
	} catch {
		process.env.BASE_URL = "http://localhost:8081";
	}

	const homeDir = process.env.HOME || process.env.USERPROFILE;
	if (homeDir) {
		const credentialsPath = path.join(
			homeDir,
			".config",
			"gatewai",
			"credentials.json",
		);
		if (fs.existsSync(credentialsPath)) {
			try {
				const creds = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
				const falKey = creds.fal || creds.GATEWAI_FAL_API_KEY;
				if (falKey && !process.env.FAL_API_KEY) {
					process.env.FAL_API_KEY = falKey;
				}
				const openrouterKey =
					creds.openrouter || creds.GATEWAI_OPENROUTER_API_KEY;
				if (openrouterKey && !process.env.OPENROUTER_API_KEY) {
					process.env.OPENROUTER_API_KEY = openrouterKey;
				}
			} catch (err) {
				console.warn(
					`Warning: Failed to parse credentials file at ${credentialsPath}:`,
					err,
				);
			}
		}
	}

	if (process.env.GATEWAI_FAL_API_KEY && !process.env.FAL_API_KEY) {
		process.env.FAL_API_KEY = process.env.GATEWAI_FAL_API_KEY;
	}
	if (
		process.env.GATEWAI_OPENROUTER_API_KEY &&
		!process.env.OPENROUTER_API_KEY
	) {
		process.env.OPENROUTER_API_KEY = process.env.GATEWAI_OPENROUTER_API_KEY;
	}

	process.env.FAL_API_KEY ??= "dummy-fal-key";
	process.env.OPENROUTER_API_KEY ??= "dummy-openrouter-key";
}
