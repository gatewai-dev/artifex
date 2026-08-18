import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

(globalThis as any).__IS_HEADLESS_RENDERER__ = true;

/**
 * Polyfills Node.js globalThis.fetch for `file://` URLs.
 * Intercepts local `file://` requests and reads content directly via Node fs.promises.readFile.
 * Maps asset requests to the correct local file by exact path or most recent modification time.
 */
export function setupFetchPolyfill(): void {
	if (
		typeof globalThis.fetch === "function" &&
		!(globalThis as any).__FILE_FETCH_POLYFILLED__
	) {
		(globalThis as any).__FILE_FETCH_POLYFILLED__ = true;
		const origFetch = globalThis.fetch;
		globalThis.fetch = async (
			input: RequestInfo | URL,
			init?: RequestInit,
		): Promise<Response> => {
			const urlStr =
				typeof input === "string"
					? input
					: input instanceof URL
						? input.href
						: (input as any)?.url;

			if (typeof urlStr === "string" && urlStr.startsWith("file://")) {
				try {
					let filePath = fileURLToPath(urlStr);

					if (!fs.existsSync(filePath)) {
						const storageTmpDir = process.env.GATEWAI_STORAGE_DIR
							? path.resolve(process.env.GATEWAI_STORAGE_DIR)
							: path.resolve(process.cwd(), "gw-assets");

						if (fs.existsSync(storageTmpDir)) {
							const findStorageFile = (dir: string): string | null => {
								try {
									const files: { path: string; mtime: number }[] = [];
									const scan = (d: string) => {
										const entries = fs.readdirSync(d, { withFileTypes: true });
										for (const entry of entries) {
											const fullPath = path.join(d, entry.name);
											if (entry.isDirectory()) {
												scan(fullPath);
											} else if (
												entry.name.endsWith(".mp4") ||
												entry.name.endsWith(".png") ||
												entry.name.endsWith(".mp3")
											) {
												const stat = fs.statSync(fullPath);
												files.push({ path: fullPath, mtime: stat.mtimeMs });
											}
										}
									};
									scan(dir);
									if (files.length === 0) return null;

									const targetName = path.basename(filePath);
									const exact = files.find((f) => f.path.includes(targetName));
									if (exact) return exact.path;

									// Try to match prefix (e.g. "Image sc2_0" from "Image sc2_0_xyz.png")
									const parts = targetName.split("_");
									if (parts.length >= 2) {
										const prefix = parts.slice(0, 2).join("_");
										const fuzzy = files.find((f) => f.path.includes(prefix));
										if (fuzzy) return fuzzy.path;
									}

									return null;
								} catch {}
								return null;
							};

							const matchedFile = findStorageFile(storageTmpDir);
							if (matchedFile) {
								filePath = matchedFile;
							}
						}
					}

					const data = await fs.promises.readFile(filePath);
					const res = new Response(data, {
						status: 200,
						headers: { "content-type": "application/octet-stream" },
					});
					const resolvedUrl = new URL(urlStr).href;
					Object.defineProperty(res, "url", {
						get: () => resolvedUrl,
						configurable: true,
					});
					return res;
				} catch (e: any) {
					const res = new Response(`File not found: ${e?.message}`, {
						status: 404,
					});
					const resolvedUrl = new URL(urlStr).href;
					Object.defineProperty(res, "url", {
						get: () => resolvedUrl,
						configurable: true,
					});
					return res;
				}
			}
			return origFetch(input, init);
		};
	}
}

setupFetchPolyfill();
