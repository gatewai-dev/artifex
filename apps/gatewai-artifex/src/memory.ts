import "reflect-metadata";
import "./polyfill.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CanvasEngine } from "@gatewai.studio/canvas-engine/memory";
import { InMemoryWorkflowRunner } from "@gatewai.studio/graph-engine/in-memory-runner";
import { GraphResolverService } from "@gatewai.studio/graph-engine/resolvers";
import {
	extractMediaMetadata,
	ServerMediaService,
} from "@gatewai.studio/media/server";
import { NodeRegistry, SkillRegistry } from "@gatewai.studio/node-sdk/server";
import { container, ENV_CONFIG, logger, TOKENS } from "@gatewai.studio/server-utils";
import * as yaml from "js-yaml";
import { AiProviderService } from "./ai/ai-provider.js";
import { MockPrismaClient } from "./db/prisma-shim.js";
import { ensureEnvDefaults } from "./env.js";
import {
	registerStaticNodes,
	registerStaticRenderers,
} from "./nodes-registry.js";
import { LocalMediaRendererService } from "./renderer/local-renderer.js";
import { MediaResolverService } from "./renderer/media-resolver.js";
import { CanvasSpecSchema } from "./spec.js";
import { LocalStorageService } from "./storage/local-storage.js";
import { loadAndRegisterPlugins } from "./plugins/node-loader.js";

function getFileInfo(filePath: string) {
	const ext = path.extname(filePath).toLowerCase();
	let dataType: "Video" | "Audio" | "Image" | "SVG" | "Lottie" | "GIF" | "LUT" =
		"Video";
	let mimeType = "video/mp4";

	if (ext === ".mp4") {
		dataType = "Video";
		mimeType = "video/mp4";
	} else if (ext === ".webm") {
		dataType = "Video";
		mimeType = "video/webm";
	} else if (ext === ".mp3" || ext === ".mpeg") {
		dataType = "Audio";
		mimeType = "audio/mpeg";
	} else if (ext === ".wav") {
		dataType = "Audio";
		mimeType = "audio/wav";
	} else if (ext === ".png") {
		dataType = "Image";
		mimeType = "image/png";
	} else if (ext === ".jpg" || ext === ".jpeg") {
		dataType = "Image";
		mimeType = "image/jpeg";
	} else if (ext === ".svg") {
		dataType = "SVG";
		mimeType = "image/svg+xml";
	} else if (ext === ".json") {
		dataType = "Lottie";
		mimeType = "application/json";
	} else if (ext === ".gif") {
		dataType = "GIF";
		mimeType = "image/gif";
	} else if (ext === ".cube") {
		dataType = "LUT";
		mimeType = "application/octet-stream";
	}
	return { dataType, mimeType };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Node discovery (no DB, no migrations) ───────────────────────────────────

interface DiscoveredNode {
	name: string;
	server: () => Promise<any>;
}

function findNodesDir(): string {
	let current = __dirname;
	while (true) {
		const nodesDir = path.resolve(current, "nodes");
		try {
			const entries = fs.readdirSync(nodesDir);
			if (
				entries.some(
					(d) =>
						d.startsWith("node-") &&
						fs.existsSync(path.join(nodesDir, d, "package.json")),
				)
			) {
				return nodesDir;
			}
		} catch {}
		const parent = path.dirname(current);
		if (parent === current) throw new Error("nodes/ directory not found");
		current = parent;
	}
}

export function discoverNodes(): DiscoveredNode[] {
	const nodesDir = findNodesDir();
	const entries = fs
		.readdirSync(nodesDir)
		.filter(
			(d) =>
				d.startsWith("node-") &&
				fs.statSync(path.join(nodesDir, d)).isDirectory(),
		);

	const discovered: DiscoveredNode[] = [];
	for (const dir of entries) {
		const pkgPath = path.join(nodesDir, dir, "package.json");
		if (!fs.existsSync(pkgPath)) continue;
		try {
			const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
			if (pkg.gatewai?.enabled === false) continue;
			const serverExports = pkg.exports?.["./server"];
			const relativePath =
				serverExports?.import ||
				serverExports?.default ||
				serverExports?.development;
			if (relativePath) {
				discovered.push({
					name: pkg.name,
					server: () =>
						import(`file://${path.join(nodesDir, dir, relativePath)}`),
				});
			}
		} catch (e) {
			logger.warn(`[memory] Failed to parse node ${dir}: ${e}`);
		}
	}
	return discovered;
}

// ─── Skill discovery ──────────────────────────────────────────────────────────

/**
 * Locate the generated+bundled MAIN skill file.
 *
 * The full main skill (header + node catalog) is produced at build time into
 * `dist/skills/SKILL.md` and shipped inside the npx package. We prefer that so
 * the CLI works without the source tree; the developer-authored header in
 * `skills/SKILL.md` is the fallback for a fresh dev checkout that hasn't run
 * the generator yet.
 */
export function resolveMainSkillPath(): string | undefined {
	const candidates = [
		// compiled: __dirname -> <cli>/dist/src, so ../../dist is <cli>/dist
		path.resolve(__dirname, "../../dist/skills/SKILL.md"),
		// dev (tsx): __dirname -> <cli>/src, so ../dist is <cli>/dist
		path.resolve(__dirname, "../dist/skills/SKILL.md"),
		// fallback: developer header (compiled: dist/src -> <cli>/dist/skills)
		path.resolve(__dirname, "../skills/SKILL.md"),
	];
	return candidates.find((p) => fs.existsSync(p));
}

function parseFrontmatter(raw: string): {
	frontmatter: Record<string, any>;
	content: string;
} {
	const trimmed = raw.trim();
	if (!trimmed.startsWith("---")) {
		return { frontmatter: {}, content: raw };
	}

	const parts = trimmed.split("\n---");
	if (parts.length < 2) {
		return { frontmatter: {}, content: raw };
	}

	const frontmatterStr = parts[0].replace(/^---/, "").trim();
	const content = parts.slice(1).join("\n---").trim();
	const frontmatter = (yaml.load(frontmatterStr) ?? {}) as Record<string, any>;

	return { frontmatter, content };
}

export function discoverSkills(): any[] {
	const discovered: any[] = [];
	const skillsJsonCandidates = [
		path.resolve(__dirname, "../../dist/skills/skills.json"),
		path.resolve(__dirname, "../dist/skills/skills.json"),
		path.resolve(__dirname, "./skills/skills.json"),
	];
	const skillsJsonPath = skillsJsonCandidates.find((p) => fs.existsSync(p));

	if (skillsJsonPath) {
		try {
			const items = JSON.parse(fs.readFileSync(skillsJsonPath, "utf-8"));
			if (Array.isArray(items)) {
				for (const item of items) {
					if (item.nodeType && item.name) {
						discovered.push(item);
					}
				}
			}
		} catch (e) {
			logger.warn(`[memory] Failed to read bundled skills.json: ${e}`);
		}
	} else {
		// Fallback to scanning node directories in development
		try {
			const nodesDir = findNodesDir();
			const entries = fs
				.readdirSync(nodesDir)
				.filter(
					(d) =>
						d.startsWith("node-") &&
						fs.statSync(path.join(nodesDir, d)).isDirectory(),
				);

			for (const dir of entries) {
				const pkgPath = path.join(nodesDir, dir, "package.json");
				if (fs.existsSync(pkgPath)) {
					try {
						const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
						if (pkg.gatewai?.enabled === false) continue;
					} catch {}
				}
				const skillPath = path.join(nodesDir, dir, "SKILL.md");
				if (fs.existsSync(skillPath)) {
					try {
						const raw = fs.readFileSync(skillPath, "utf-8");
						const { frontmatter, content } = parseFrontmatter(raw);

						const nodeType = frontmatter.nodeType;
						const name = frontmatter.name;
						const description = frontmatter.description || frontmatter.summary;
						const triggers = Array.isArray(frontmatter.triggers)
							? frontmatter.triggers.map(String)
							: typeof frontmatter.triggers === "string" && frontmatter.triggers
								? frontmatter.triggers.split(",").map((s: string) => s.trim())
								: [];

						if (nodeType && name && description) {
							discovered.push({
								nodeType: String(nodeType),
								name: String(name),
								summary: String(description),
								triggers,
								content,
							});
						}
					} catch (e) {
						logger.warn(`[memory] Failed to parse skill for node ${dir}: ${e}`);
					}
				}
			}
		} catch (e) {
			logger.warn(`[memory] Development node dir discovery skipped: ${e}`);
		}
	}

	// Register gatewai-artifex's own MAIN skill.
	const mainSkillPath = resolveMainSkillPath();
	if (mainSkillPath && fs.existsSync(mainSkillPath)) {
		try {
			const raw = fs.readFileSync(mainSkillPath, "utf-8");
			const { frontmatter, content } = parseFrontmatter(raw);
			const triggers = Array.isArray(frontmatter.triggers)
				? frontmatter.triggers.map(String)
				: typeof frontmatter.triggers === "string" && frontmatter.triggers
					? frontmatter.triggers.split(",").map((s: string) => s.trim())
					: [];
			discovered.push({
				nodeType: "gatewai-artifex",
				name: String(frontmatter.name ?? "gatewai-artifex"),
				summary: String(frontmatter.description ?? frontmatter.summary ?? ""),
				triggers,
				content,
			});
		} catch (e) {
			logger.warn(`[memory] Failed to parse CLI skill: ${e}`);
		}
	}

	return discovered;
}

// ─── Template derivation from manifests ───────────────────────────────────────

export interface InMemoryTemplate {
	id: string;
	type: string;
	templateHandles: Array<{
		type: "Input" | "Output";
		dataTypes: string[];
		label: string;
		order: number;
		required: boolean;
	}>;
	variableInputs?: { enabled: boolean; dataTypes: string[] };
	variableOutputs?: { enabled: boolean; dataTypes: string[] };
	isTerminal: boolean;
	defaultConfig?: Record<string, unknown>;
}

function buildTemplates(registry: NodeRegistry): InMemoryTemplate[] {
	const templates: InMemoryTemplate[] = [];
	for (const manifest of registry.getAllManifests()) {
		const handles: InMemoryTemplate["templateHandles"] = [];
		let order = 0;
		for (const input of manifest.handles?.inputs ?? []) {
			handles.push({
				type: "Input",
				dataTypes: input.dataTypes as string[],
				label: input.label,
				order: order++,
				required: input.required ?? false,
			});
		}
		for (const output of manifest.handles?.outputs ?? []) {
			handles.push({
				type: "Output",
				dataTypes: output.dataTypes as string[],
				label: output.label,
				order: order++,
				required: output.required ?? false,
			});
		}
		templates.push({
			id: manifest.type,
			type: manifest.type,
			templateHandles: handles,
			variableInputs: manifest.variableInputs
				? {
						enabled: true,
						dataTypes: manifest.variableInputs.dataTypes as string[],
					}
				: { enabled: false, dataTypes: [] },
			variableOutputs: manifest.variableOutputs
				? {
						enabled: true,
						dataTypes: manifest.variableOutputs.dataTypes as string[],
					}
				: { enabled: false, dataTypes: [] },
			isTerminal: manifest.isTerminal ?? false,
			defaultConfig: manifest.defaultConfig,
		});
	}
	return templates;
}

// ─── Minimal DI container bindings ───────────────────────────────────────────

let memoryBound = false;

export async function bootstrapInMemory(
	pluginPaths?: string[],
	baseDir?: string,
): Promise<void> {
	ensureEnvDefaults();
	if (!memoryBound) {
		const registry = new NodeRegistry();
		await registerStaticNodes(registry);
		await registerStaticRenderers();

		const skillRegistry = new SkillRegistry();
		const skills = discoverSkills();
		for (const skill of skills) {
			skillRegistry.register(skill);
		}

		const storage = new LocalStorageService();
		const prismaShim = new MockPrismaClient();

		// Bind TOKENS in shared container
		if (!container.isBound(TOKENS.ENV)) {
			container.bind(TOKENS.ENV).toConstantValue(ENV_CONFIG);
		}
		if (!container.isBound(TOKENS.LOGGER)) {
			container.bind(TOKENS.LOGGER).toConstantValue(logger);
		}

		// Unbind and rebind services we mock
		if (container.isBound(TOKENS.STORAGE)) container.unbind(TOKENS.STORAGE);
		container.bind(TOKENS.STORAGE).toConstantValue(storage);

		if (container.isBound(TOKENS.PRISMA)) container.unbind(TOKENS.PRISMA);
		container.bind(TOKENS.PRISMA).toConstantValue(prismaShim as any);

		if (container.isBound(TOKENS.AI_PROVIDER))
			container.unbind(TOKENS.AI_PROVIDER);
		container.bind(TOKENS.AI_PROVIDER).to(AiProviderService).inSingletonScope();

		const localRenderer = new LocalMediaRendererService(storage);
		if (container.isBound(TOKENS.MEDIA_RENDERER))
			container.unbind(TOKENS.MEDIA_RENDERER);
		container.bind(TOKENS.MEDIA_RENDERER).toConstantValue(localRenderer);

		if (container.isBound(TOKENS.MEDIA_RESOLVER))
			container.unbind(TOKENS.MEDIA_RESOLVER);
		container
			.bind(TOKENS.MEDIA_RESOLVER)
			.to(MediaResolverService)
			.inSingletonScope();

		if (container.isBound(TOKENS.NODE_REGISTRY))
			container.unbind(TOKENS.NODE_REGISTRY);
		container.bind(TOKENS.NODE_REGISTRY).toConstantValue(registry);

		if (container.isBound(TOKENS.MEDIA)) container.unbind(TOKENS.MEDIA);
		container.bind(TOKENS.MEDIA).to(ServerMediaService).inSingletonScope();

		if (container.isBound(TOKENS.SKILL_REGISTRY))
			container.unbind(TOKENS.SKILL_REGISTRY);
		container.bind(TOKENS.SKILL_REGISTRY).toConstantValue(skillRegistry);

		if (!container.isBound(TOKENS.GRAPH_RESOLVERS)) {
			container
				.bind(TOKENS.GRAPH_RESOLVERS)
				.to(GraphResolverService)
				.inSingletonScope();
		}

		memoryBound = true;
	}

	if (pluginPaths && pluginPaths.length > 0) {
		const registry = container.get<NodeRegistry>(TOKENS.NODE_REGISTRY);
		const skillRegistry = container.get<SkillRegistry>(TOKENS.SKILL_REGISTRY);
		await loadAndRegisterPlugins(pluginPaths, baseDir, {
			nodeRegistry: registry,
			skillRegistry,
		});
	}
}

// ─── Build from spec (in-memory, no DB, no Redis) ─────────────────────────────

export interface MemoryBuildResult {
	canvasId: string;
	sessionId: string;
	specFingerprint: string;
	nodeIds: Record<string, string>; // specId -> in-memory node id
	engine: CanvasEngine;
	terminalTypes: Set<string>;
	templates: InMemoryTemplate[];
}

function canonicalize(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, entry]) => [key, canonicalize(entry)]),
		);
	}
	return value;
}

function fingerprintSpec(spec: unknown): string {
	return crypto
		.createHash("sha256")
		.update(JSON.stringify(canonicalize(spec)))
		.digest("hex");
}

export async function buildFromSpecInMemory(
	specIn: unknown,
	specPath?: string,
	extraPlugins?: string[],
): Promise<MemoryBuildResult> {
	const spec = CanvasSpecSchema.parse(specIn);
	const specDir = specPath
		? path.dirname(path.resolve(specPath))
		: process.cwd();

	const combinedPlugins = [
		...(spec.plugins || []),
		...(extraPlugins || []),
	];

	if (combinedPlugins.length > 0) {
		await bootstrapInMemory(combinedPlugins, specDir);
	}
	// Fingerprint the authored workflow before adding runtime-only Import nodes
	// and timestamps. This makes state reusable across separate CLI processes.
	const authoredSpecFingerprint = fingerprintSpec(spec);

	// Process Import nodes with local files defined in config.file
	for (const node of spec.nodes) {
		if (
			node.type === "Import" &&
			node.config &&
			typeof node.config.file === "string"
		) {
			const relativePath = node.config.file;
			const specDir = specPath
				? path.dirname(path.resolve(specPath))
				: process.cwd();
			let absolutePath = relativePath;
			if (!path.isAbsolute(absolutePath)) {
				absolutePath = path.resolve(specDir, absolutePath);
			}

			if (!fs.existsSync(absolutePath)) {
				throw new Error(`Import file not found: ${absolutePath}`);
			}

			const { dataType, mimeType } = getFileInfo(absolutePath);
			const stats = await fs.promises.stat(absolutePath);

			let metaSource: Buffer | string;
			if (dataType === "Video" || dataType === "Audio") {
				metaSource = absolutePath;
			} else {
				metaSource = await fs.promises.readFile(absolutePath);
			}

			const meta = await extractMediaMetadata(metaSource, mimeType, dataType);
			const sourceMeta = {
				width: meta.width || undefined,
				height: meta.height || undefined,
				durationMs: meta.durationInSec ? meta.durationInSec * 1000 : undefined,
				fps: meta.fps || undefined,
				sampleRate: meta.sampleRate || undefined,
				channels: meta.channels || undefined,
				bitDepth: meta.bitDepth || undefined,
				audioCodec: meta.audioCodec || undefined,
				audioBitrate: meta.audioBitrate || undefined,
			};

			const mockResult = {
				selectedOutputIndex: 0,
				outputs: [
					{
						items: [
							{
								type: dataType,
								data: {
									metadata: sourceMeta,
									operation: {
										op: "source",
										source: {
											entity: {
												id: node.id,
												name: path.basename(absolutePath),
												createdAt: new Date(),
												updatedAt: new Date(),
												bucket: "dummy-bucket",
												size: stats.size,
												mimeType: mimeType,
												key: absolutePath,
												isUploaded: true,
												duration: sourceMeta.durationMs || null,
												fps: sourceMeta.fps || null,
												width: sourceMeta.width || null,
												height: sourceMeta.height || null,
											},
										},
										sourceMeta: sourceMeta,
										dataType: dataType,
									},
									children: [],
								},
							},
						],
					},
				],
			};

			node.result = mockResult;
			if (!node.name) {
				node.name = `Import ${dataType}`;
			}
		}
	}

	const registry = container.get<NodeRegistry>(TOKENS.NODE_REGISTRY);
	const templates = buildTemplates(registry);
	const terminalTypes = new Set(
		templates.filter((t) => t.isTerminal).map((t) => t.type),
	);

	const canvasId = spec.canvasId ?? `memory-${Date.now()}`;
	const sessionId = `cli-mem-${Date.now()}`;

	const engine = CanvasEngine.createInMemory(
		canvasId,
		sessionId,
		registry,
		templates,
	);

	// Create nodes
	const nodeIds: Record<string, string> = {};
	const buildErrors: string[] = [];

	for (const nodeSpec of spec.nodes) {
		try {
			if (nodeSpec.locked && !terminalTypes.has(nodeSpec.type)) {
				throw new Error(
					`Non-terminal node "${nodeSpec.name || nodeSpec.id}" of type "${nodeSpec.type}" cannot be locked. Only terminal nodes can be locked.`,
				);
			}
			const created = engine.createNode({
				type: nodeSpec.type,
				name: nodeSpec.name,
				position: nodeSpec.position,
				config: nodeSpec.config,
			});
			nodeIds[nodeSpec.id] = created.nodeId;
			if (nodeSpec.locked !== undefined) {
				created.node.locked = nodeSpec.locked;
			}
			if (nodeSpec.result) {
				const res = JSON.parse(JSON.stringify(nodeSpec.result)) as any;
				if (res.outputs && created.outputHandles.length > 0) {
					for (const [outputIndex, output] of res.outputs.entries()) {
						const outputHandleId = created.outputHandles[outputIndex]?.id;
						if (output.items) {
							for (const item of output.items) {
								if (!item.outputHandleId && outputHandleId) {
									item.outputHandleId = outputHandleId;
								}
							}
						}
					}
				}
				created.node.result = res;
			}
			const dynamicInputMap: Record<string, string> = {};
			for (const h of nodeSpec.dynamicInputs) {
				const added = engine.addDynamicInput(
					created.nodeId,
					h.label,
					h.dataTypes as any,
				);
				dynamicInputMap[h.label] = added.id;
				if ((h as any).id) {
					dynamicInputMap[(h as any).id] = added.id;
				}
			}
			for (const h of nodeSpec.dynamicOutputs) {
				engine.addDynamicOutput(created.nodeId, h.label, h.dataTypes as any);
			}

			if (Object.keys(dynamicInputMap).length > 0) {
				const updatedConfig: Record<string, any> = { ...nodeSpec.config };
				for (const [k, v] of Object.entries(updatedConfig)) {
					if (typeof v === "string" && dynamicInputMap[v]) {
						updatedConfig[k] = dynamicInputMap[v];
					}
				}

				const mapLayoutInputHandles = (nodes: any[]) => {
					for (const node of nodes) {
						if (node && typeof node === "object") {
							if (
								(node.kind === "media" || node.kind === "text") &&
								typeof node.inputHandleId === "string"
							) {
								node.inputHandleId =
									dynamicInputMap[node.inputHandleId] ?? node.inputHandleId;
							}
							if (Array.isArray(node.children)) {
								mapLayoutInputHandles(node.children);
							}
						}
					}
				};
				if (Array.isArray(updatedConfig.layout)) {
					mapLayoutInputHandles(updatedConfig.layout);
				}
				engine.updateNodeConfig(created.nodeId, updatedConfig);
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			buildErrors.push(
				`Node "${nodeSpec.name || nodeSpec.id}" [${nodeSpec.type}]: ${msg}`,
			);
		}
	}

	// Connect edges
	for (const edge of spec.edges) {
		const sourceNodeId = nodeIds[edge.source];
		const targetNodeId = nodeIds[edge.target];
		if (!sourceNodeId || !targetNodeId) {
			buildErrors.push(
				`Edge references unknown node: "${edge.source}" -> "${edge.target}"`,
			);
			continue;
		}
		try {
			engine.connect({
				sourceNodeId,
				targetNodeId,
				sourceLabel: edge.sourceLabel,
				targetLabel: edge.targetLabel,
			});
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			buildErrors.push(
				`Edge "${edge.source}" (${edge.sourceLabel ?? "*"}) -> "${edge.target}" (${edge.targetLabel ?? "*"}): ${msg}`,
			);
		}
	}

	// Validate configuration and graph connectivity
	try {
		engine.commitInMemory();
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		buildErrors.push(`Graph integrity error: ${msg}`);
	}

	if (buildErrors.length > 0) {
		throw new Error(
			`Found ${buildErrors.length} validation error(s):\n` +
				buildErrors.map((e, i) => `  ${i + 1}. ${e}`).join("\n"),
		);
	}
	return {
		canvasId,
		sessionId,
		specFingerprint: authoredSpecFingerprint,
		nodeIds,
		engine,
		terminalTypes,
		templates,
	};
}

// ─── Run in-memory ───────────────────────────────────────────────────────────

export interface MemoryRunResult {
	canvasId: string;
	results: Record<string, any>;
	nodeIds: Record<string, string>;
}

export async function runInMemory(
	build: MemoryBuildResult,
	targetNodeId?: string | string[],
): Promise<MemoryRunResult> {
	const runner = new InMemoryWorkflowRunner(
		container.get<NodeRegistry>(TOKENS.NODE_REGISTRY),
	);

	const data = {
		nodes: build.engine.getNodes(),
		edges: build.engine.getEdges(),
		handles: build.engine.getHandles(),
		canvas: { id: build.canvasId, name: build.canvasId },
	} as any;

	let nodeIds: string[] | undefined;
	if (Array.isArray(targetNodeId)) {
		nodeIds = targetNodeId;
	} else if (targetNodeId) {
		nodeIds = [targetNodeId];
	} else {
		// Default to running all terminal nodes (excluding locked ones)
		const terminals = build.engine
			.getNodes()
			.filter((n: any) => build.terminalTypes.has(n.type) && !n.locked)
			.map((n: any) => n.id);
		if (terminals.length > 0) {
			nodeIds = terminals;
		}
	}

	const availableNodeIds = new Set(
		build.engine.getNodes().map((node: any) => node.id),
	);
	for (const id of nodeIds ?? []) {
		if (!availableNodeIds.has(id)) {
			throw new Error(
				`Execution target "${id}" does not exist in the built canvas.`,
			);
		}
	}

	const executed = await runner.executeWorkflowData(
		data,
		build.terminalTypes,
		nodeIds,
	);

	const results: Record<string, any> = {};
	for (const node of executed.nodes) {
		if (node.result) {
			results[node.id] = node.result;
		}
	}
	return { canvasId: build.canvasId, results, nodeIds: build.nodeIds };
}
