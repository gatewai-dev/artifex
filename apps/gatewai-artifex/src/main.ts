import { existsSync, readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NodeRegistry, SkillRegistry } from "@gatewai.studio/node-sdk/server";
import type { StorageService } from "@gatewai.studio/server-utils";
import { container, TOKENS } from "@gatewai.studio/server-utils";
import {
	ensureDevice,
	registerHeadlessFont,
	SlugFontCache,
} from "@gatewai.studio/webgpu-renderers";
import { ensureEnvDefaults } from "./env.js";
import { CliError, ExitCode, handleCliError } from "./errors.js";
import {
	bootstrapInMemory,
	buildFromSpecInMemory,
	runInMemory,
} from "./memory.js";
import { CanvasSpecSchema } from "./spec.js";
import { scaffoldNode } from "./scaffold.js";

const HELP = `
Usage: artifex <command> [spec.json] [options]

Commands:
  validate <spec.json>               Parse + validate spec and node config schemas.
  build    <spec.json>               Build canvas in memory and verify topological sort.
  run      <spec.json>               Execute workflow; print / save results.
  init-node <name>                   Scaffold a new custom node package.
  nodes                              Print the machine-readable registered nodes catalog.
  skill    [<nodeType>]              Print markdown instructions. Bare: the main skill (usage
                                     guide + full node catalog). --list enumerates all skills.
  version                            Print CLI version.
  help                               Show help.

Options:
  --plugin, --plugins, -p <path>     Specify custom node package or directory (comma-separated).
  --dir <path>                       Target directory for init-node scaffolding.
  --type <name>                      Explicit node type for init-node (e.g. InvertColors).
  --description <text>               Description for init-node scaffolding.
  --category <name>                  Category for init-node scaffolding (default: Media).
  --json                             Produce machine-readable JSON output on stdout.
  --node <id>                        Specify target terminal node(s) to run (comma-separated).
  --state <file>                     Specify path to save CanvasState (results + node IDs).
  --from-state <file>                Specify path to load CanvasState from.
  --yes, --force                     Auto-approve non-destructive execution prompts.
`;

export interface ParsedCliArgs {
	command: string;
	specPath?: string;
	options: {
		json: boolean;
		node?: string;
		state?: string;
		fromState?: string;
		yes: boolean;
		plugins: string[];
		dir?: string;
		type?: string;
		description?: string;
		category?: string;
	};
}

export function parseArgs(args: string[]): ParsedCliArgs {
	const options: ParsedCliArgs["options"] = {
		json: false,
		node: undefined,
		state: undefined,
		fromState: undefined,
		yes: false,
		plugins: [],
		dir: undefined,
		type: undefined,
		description: undefined,
		category: undefined,
	};
	let command = "";
	let specPath = "";

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--json") {
			options.json = true;
		} else if (arg === "--node" && i + 1 < args.length) {
			options.node = args[++i];
		} else if (arg === "--state" && i + 1 < args.length) {
			options.state = args[++i];
		} else if (arg === "--from-state" && i + 1 < args.length) {
			options.fromState = args[++i];
		} else if (arg === "--yes" || arg === "--force") {
			options.yes = true;
		} else if (
			(arg === "--plugin" || arg === "--plugins" || arg === "-p") &&
			i + 1 < args.length
		) {
			const val = args[++i];
			const paths = val
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			options.plugins.push(...paths);
		} else if (arg === "--dir" && i + 1 < args.length) {
			options.dir = args[++i];
		} else if (arg === "--type" && i + 1 < args.length) {
			options.type = args[++i];
		} else if (arg === "--description" && i + 1 < args.length) {
			options.description = args[++i];
		} else if (arg === "--category" && i + 1 < args.length) {
			options.category = args[++i];
		} else if (!command) {
			command = arg;
		} else if (!specPath) {
			specPath = arg;
		}
	}

	return { command, specPath, options };
}

import type { MemoryBuildResult } from "./memory.js";

export function applyStateToBuild(
	build: MemoryBuildResult,
	stateData: {
		results: Record<string, any>;
		nodeIds?: Record<string, string>;
		specFingerprint?: string;
	},
): void {
	if (
		stateData.specFingerprint &&
		stateData.specFingerprint !== build.specFingerprint
	) {
		console.warn(
			`[applyStateToBuild] Warning: State fingerprint does not match the current workflow (expected ${build.specFingerprint}, received ${stateData.specFingerprint}). Loading cached results anyway.`,
		);
	}
	const results = stateData.results || {};
	const stateNodeIds = stateData.nodeIds || {};

	for (const [specId, currentEngineId] of Object.entries(build.nodeIds)) {
		const node = build.engine.findNode(currentEngineId);
		if (node && (node.type === "Export" || node.type.startsWith("Export_"))) {
			continue;
		}
		const oldEngineId = stateNodeIds[specId] ?? specId;
		const cachedResult = results[oldEngineId] ?? results[specId];
		if (cachedResult) {
			if (node) {
				const res = JSON.parse(JSON.stringify(cachedResult)) as any;
				const outputHandles = build.engine
					.getHandles()
					.filter(
						(h: any) => h.nodeId === currentEngineId && h.type === "Output",
					)
					.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

				if (res.outputs && outputHandles.length > 0) {
					for (const [outputIndex, output] of res.outputs.entries()) {
						const outputHandleId = outputHandles[outputIndex]?.id;
						if (output.items && outputHandleId) {
							for (const item of output.items) {
								item.outputHandleId = outputHandleId;
							}
						}
					}
				}
				node.result = res;
			}
		}
	}
}

export function extractVirtualMedia(result: unknown): Record<string, unknown> {
	if (!result || typeof result !== "object") {
		throw new CliError(
			"Node has no result - did you run the workflow first?",
			ExitCode.RENDER_ERROR,
			"E_RENDER",
		);
	}
	const resObj = result as Record<string, unknown>;
	const sel =
		typeof resObj.selectedOutputIndex === "number"
			? resObj.selectedOutputIndex
			: 0;
	const outputs = Array.isArray(resObj.outputs) ? resObj.outputs : [];
	const item = outputs[sel] ?? outputs[0];
	const itemData = item?.items?.[0]?.data ?? item?.data ?? item;

	if (itemData && typeof itemData === "object" && "operation" in itemData) {
		return itemData as Record<string, unknown>;
	}
	if (
		itemData &&
		typeof itemData === "object" &&
		"mediaData" in itemData &&
		typeof itemData.mediaData === "object" &&
		itemData.mediaData !== null &&
		"operation" in itemData.mediaData
	) {
		return itemData.mediaData as Record<string, unknown>;
	}
	throw new CliError(
		"Target node result does not contain valid VirtualMediaData.",
		ExitCode.RENDER_ERROR,
		"E_RENDER",
	);
}

/**
 * Node types whose processors call a paid AI provider (FAL / OpenRouter) at run
 * time. Frame extraction must not silently re-run these. Derived from which
 * `nodes/*` processors call AiProviderService.getFal() / getOpenRouterOpenAI().
 */

async function loadFonts(
	specPath: string,
	fonts?: { family: string; file: string }[],
): Promise<void> {
	if (!fonts || fonts.length === 0) return;
	let device: GPUDevice | null = null;
	try {
		device = await ensureDevice();
	} catch (e) {
		// Non-fatal: WebGPU device may not be available (e.g. CLI validation/build steps)
	}
	const specDir = path.dirname(path.resolve(specPath));
	for (const font of fonts) {
		try {
			let fontUrl = font.file;
			if (
				!fontUrl.startsWith("http://") &&
				!fontUrl.startsWith("https://") &&
				!fontUrl.startsWith("file://") &&
				!path.isAbsolute(fontUrl)
			) {
				fontUrl = path.resolve(specDir, fontUrl);
			}
			if (path.isAbsolute(fontUrl)) {
				fontUrl = `file://${fontUrl}`;
			}
			await registerHeadlessFont(font.family, fontUrl);
			if (device) {
				await SlugFontCache.preloadSlugFont(device, font.family, fontUrl);
			}
		} catch (err) {
			console.warn(
				`[loadFonts] Failed to load font "${font.family}" from ${font.file}:`,
				err,
			);
		}
	}
}

export async function main(argsOverride?: string[]): Promise<void> {
	ensureEnvDefaults();
	const args = argsOverride ?? process.argv.slice(2);
	const { command, specPath, options } = parseArgs(args);

	if (
		!command ||
		command === "help" ||
		command === "--help" ||
		command === "-h"
	) {
		console.log(HELP);
		return;
	}

	try {
		switch (command) {
			case "init-node": {
				if (!specPath) {
					throw new CliError(
						"init-node requires a node name (e.g. 'artifex init-node node-my-filter')",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				const outDir = scaffoldNode(specPath, {
					targetDir: options.dir,
					type: options.type,
					description: options.description,
					category: options.category,
				});
				if (options.json) {
					console.log(JSON.stringify({ success: true, path: outDir }));
				} else {
					console.log(`✓ Created new custom node package at: ${outDir}`);
					console.log(
						`  To use it in your workflow, declare it in "plugins" in your spec.json:`,
					);
					console.log(
						`  "plugins": ["${path.relative(process.cwd(), outDir) || "."}"]`,
					);
				}
				return;
			}

			case "version": {
				let version = "1.0.0";
				try {
					const currentDir = path.dirname(fileURLToPath(import.meta.url));
					let dir = currentDir;
					while (true) {
						const pkgPath = path.join(dir, "package.json");
						if (existsSync(pkgPath)) {
							const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
							if (pkg.name === "@gatewai.studio/artifex" && pkg.version) {
								version = pkg.version;
								break;
							}
						}
						const parent = path.dirname(dir);
						if (parent === dir) {
							break;
						}
						dir = parent;
					}
				} catch {}
				if (options.json) {
					console.log(JSON.stringify({ version }));
				} else {
					console.log(`artifex v${version}`);
				}
				return;
			}

			case "nodes": {
				await bootstrapInMemory(options.plugins);
				const registry = container.get<NodeRegistry>(TOKENS.NODE_REGISTRY);
				const catalog = registry.getAllManifests().map((m) => ({
					type: m.type,
					displayName: m.displayName,
					description: m.description,
					category: m.category,
					subcategory: m.subcategory,
					isTerminal: m.isTerminal ?? false,
					handles: m.handles ?? { inputs: [], outputs: [] },
					variableInputs: m.variableInputs,
					variableOutputs: m.variableOutputs,
					defaultConfig: m.defaultConfig ?? {},
				}));
				console.log(JSON.stringify(catalog, null, options.json ? 0 : 2));
				return;
			}

			case "skill": {
				await bootstrapInMemory(options.plugins);
				const skillRegistry = container.get<SkillRegistry>(
					TOKENS.SKILL_REGISTRY,
				);

				// `skill --list`: enumerate every registered skill summary.
				if (specPath === "--list") {
					const summaries = skillRegistry.getAllSummaries();
					if (options.json) {
						console.log(JSON.stringify(summaries));
					} else {
						for (const s of summaries) {
							console.log(`${s.nodeType}	${s.name}	${s.summary}`);
						}
					}
					return;
				}

				const requested = specPath || "gatewai-artifex";
				let content = skillRegistry.getContent(requested);
				let matchedNodeType = requested;

				if (!content) {
					const summary = skillRegistry.getAllSummaries().find(
						(s) =>
							s.name.toLowerCase() === requested.toLowerCase() ||
							// Node skill names are often display names (e.g. "Apply LUT")
							// while the registry's stable key is ApplyLUT.
							s.name.replace(/\s+/g, "").toLowerCase() ===
								requested.replace(/\s+/g, "").toLowerCase() ||
							s.nodeType.toLowerCase() === requested.toLowerCase() ||
							s.nodeType.replace(/\s+/g, "").toLowerCase() ===
								requested.replace(/\s+/g, "").toLowerCase(),
					);
					if (summary) {
						matchedNodeType = summary.nodeType;
						content = skillRegistry.getContent(summary.nodeType);
					}
				}

				if (!content) {
					throw new CliError(
						`No skill found for node type "${requested}"`,
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				if (options.json) {
					console.log(JSON.stringify({ nodeType: matchedNodeType, content }));
				} else {
					console.log(content);
				}
				return;
			}

			case "validate": {
				if (!specPath) {
					throw new CliError(
						"validate requires spec.json file path",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				let raw: string;
				try {
					raw = await fs.readFile(specPath, "utf-8");
				} catch (e: unknown) {
					const msg = e instanceof Error ? e.message : String(e);
					throw new CliError(
						`Failed to read spec file: ${msg}`,
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				let spec: unknown;
				try {
					spec = JSON.parse(raw);
				} catch {
					throw new CliError(
						"Invalid JSON in spec file",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}

				const allErrors: string[] = [];

				const parsed = CanvasSpecSchema.safeParse(spec);
				if (!parsed.success) {
					for (const issue of parsed.error.issues) {
						const fieldPath =
							issue.path.length > 0 ? ` at .${issue.path.join(".")}` : "";
						allErrors.push(`Schema error${fieldPath}: ${issue.message}`);
					}
				}

				if (parsed.success) {
					// Deeper validation: bootstrap registry and build graph in-memory to check node config Zod schemas and edge wiring
					try {
						const specDir = path.dirname(path.resolve(specPath));
						await bootstrapInMemory(options.plugins, specDir);
						await buildFromSpecInMemory(parsed.data, specPath, options.plugins);
					} catch (err: unknown) {
						const msg = err instanceof Error ? err.message : String(err);
						allErrors.push(msg);
					}
				}

				if (allErrors.length > 0) {
					throw new CliError(
						`Spec validation failed with ${allErrors.length} error(s):\n` +
							allErrors.map((e, i) => `  ${i + 1}. ${e}`).join("\n"),
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}

				if (options.json) {
					console.log(JSON.stringify({ valid: true }));
				} else {
					console.log("✓ Spec is valid.");
				}
				return;
			}

			case "build": {
				if (!specPath) {
					throw new CliError(
						"build requires spec.json file path",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				let raw: string;
				try {
					raw = await fs.readFile(specPath, "utf-8");
				} catch (e: unknown) {
					const msg = e instanceof Error ? e.message : String(e);
					throw new CliError(
						`Failed to read spec file: ${msg}`,
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				let spec: unknown;
				try {
					spec = JSON.parse(raw);
				} catch {
					throw new CliError(
						"Invalid JSON in spec file",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				const specDir = path.dirname(path.resolve(specPath));
				await bootstrapInMemory(options.plugins, specDir);
				try {
					const build = await buildFromSpecInMemory(
						spec as any,
						specPath,
						options.plugins,
					);
					if (options.json) {
						console.log(
							JSON.stringify({
								canvasId: build.canvasId,
								nodes: Object.keys(build.nodeIds),
							}),
						);
					} else {
						console.log(
							`✓ Built canvas ${build.canvasId} in-memory successfully.`,
						);
						console.log(build.engine.inspect());
					}
				} catch (err: unknown) {
					const msg = err instanceof Error ? err.message : String(err);
					throw new CliError(
						`Build graph error: ${msg}`,
						ExitCode.GRAPH_ERROR,
						"E_GRAPH",
					);
				}
				return;
			}

			case "run": {
				if (!specPath) {
					throw new CliError(
						"run requires spec.json file path",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				let raw: string;
				try {
					raw = await fs.readFile(specPath, "utf-8");
				} catch (e: unknown) {
					const msg = e instanceof Error ? e.message : String(e);
					throw new CliError(
						`Failed to read spec file: ${msg}`,
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				let spec: unknown;
				try {
					spec = JSON.parse(raw);
				} catch {
					throw new CliError(
						"Invalid JSON in spec file",
						ExitCode.INPUT_ERROR,
						"E_INPUT",
					);
				}
				const parsedSpec = CanvasSpecSchema.parse(spec);
				const specDir = path.dirname(path.resolve(specPath));
				await bootstrapInMemory(options.plugins, specDir);
				await loadFonts(specPath, parsedSpec.fonts);
				const build = await buildFromSpecInMemory(
					parsedSpec,
					specPath,
					options.plugins,
				);

				if (options.fromState) {
					try {
						const rawState = await fs.readFile(options.fromState, "utf-8");
						const stateData = JSON.parse(rawState);
						applyStateToBuild(build, stateData);
					} catch (err) {
						throw new CliError(
							`Failed to load compatible state from ${options.fromState}: ${err instanceof Error ? err.message : String(err)}`,
							ExitCode.INPUT_ERROR,
							"E_INPUT",
						);
					}
				}

				let targetEngineIds: string[] | undefined;

				if (options.node) {
					const targetSpecIds = options.node
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean);
					targetEngineIds = [];
					for (const specId of targetSpecIds) {
						const engineId = build.nodeIds[specId];
						if (!engineId) {
							throw new CliError(
								`Target node "${specId}" not found in spec.`,
								ExitCode.GRAPH_ERROR,
								"E_GRAPH",
							);
						}
						const node = build.engine.findNode(engineId);
						if (!node || !build.terminalTypes.has(node.type)) {
							throw new CliError(
								`Only terminal nodes can be selected for run. Node "${specId}" is not a terminal node.`,
								ExitCode.INPUT_ERROR,
								"E_INPUT",
							);
						}
						targetEngineIds.push(engineId);
					}
				}

				let runResult: any;
				let runError: any;
				try {
					runResult = await runInMemory(build, targetEngineIds);
				} catch (err) {
					runError = err;
					const results: Record<string, any> = {};
					for (const node of build.engine.getNodes()) {
						if (node.result) {
							results[node.id] = node.result;
						}
					}
					runResult = {
						canvasId: build.canvasId,
						results,
						nodeIds: build.nodeIds,
						specFingerprint: build.specFingerprint,
					};
				}

				const filteredResults: Record<string, any> = {};
				for (const [specId, engineId] of Object.entries(runResult.nodeIds) as [
					string,
					string,
				][]) {
					const specNode = parsedSpec.nodes.find((n) => n.id === specId);
					if (
						specNode &&
						build.terminalTypes.has(specNode.type) &&
						specNode.type !== "Export" &&
						!specNode.type.startsWith("Export_")
					) {
						const result = runResult.results[engineId];
						if (result) {
							filteredResults[engineId] = result;
						}
					}
				}

				const outputData = {
					canvasId: runResult.canvasId,
					results: filteredResults,
					nodeIds: runResult.nodeIds,
					specFingerprint: build.specFingerprint,
				};

				const storage = container.get<StorageService>(TOKENS.STORAGE);
				for (const nodeSpec of parsedSpec.nodes) {
					if (
						nodeSpec.type !== "Export" &&
						!nodeSpec.type.startsWith("Export_")
					)
						continue;

					const engineId = build.nodeIds[nodeSpec.id];
					if (!engineId) continue;

					const nodeResult = runResult.results[engineId] as any;
					if (!nodeResult) continue;

					const outputItem =
						nodeResult.outputs?.[nodeResult.selectedOutputIndex ?? 0]
							?.items?.[0];
					if (!outputItem) continue;

					const itemData = outputItem.data;
					const key =
						itemData?.operation?.source?.entity?.key ??
						itemData?.entity?.key ??
						itemData?.key ??
						itemData?.source?.entity?.key ??
						outputItem?.fileKey;

					const nodeConfig = nodeSpec.config ?? {};
					const format = nodeConfig.format ?? "mp4";
					const ext =
						format === "mp3"
							? "mp3"
							: format === "gif"
								? "gif"
								: format === "webm"
									? "webm"
									: "mp4";
					const defaultFile =
						outputItem.type === "Image" ? "output.png" : `output.${ext}`;
					const targetFile =
						(nodeConfig.file as string | undefined) ?? defaultFile;
					const absoluteOut = path.resolve(targetFile);

					try {
						let buffer: Buffer | undefined;
						if (key) {
							buffer = await storage.getFromStorage(key);
						} else if (Buffer.isBuffer(itemData)) {
							buffer = itemData;
						} else if (typeof itemData === "string") {
							buffer = Buffer.from(itemData);
						}

						if (buffer) {
							await fs.mkdir(path.dirname(absoluteOut), { recursive: true });
							await fs.writeFile(absoluteOut, buffer);
							if (!options.json) {
								console.log(
									`✓ Exported node "${nodeSpec.id}" result to: ${absoluteOut}`,
								);
							}
						}
					} catch (err) {
						console.error(
							`[run] Failed to write exported node "${nodeSpec.id}" file:`,
							err,
						);
					}
				}

				if (options.state) {
					await fs.writeFile(
						options.state,
						JSON.stringify(outputData, null, 2),
					);
					if (!options.json) console.log(`✓ State saved to ${options.state}`);
				}
				if (runError) {
					throw runError;
				}
				if (options.json && !options.state) {
					console.log(JSON.stringify(outputData));
				} else if (!options.json && !options.state) {
					console.log(`✓ Ran canvas ${runResult.canvasId} successfully.`);
					for (const [id] of Object.entries(runResult.results)) {
						console.log(`  Node ${id}: result generated.`);
					}
				}
				return;
			}

			default:
				throw new CliError(
					`Unknown command "${command}". Run 'artifex help'.`,
					ExitCode.INPUT_ERROR,
					"E_INPUT",
				);
		}
	} catch (err: unknown) {
		handleCliError(err, options.json);
	}
}
