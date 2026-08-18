import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
	audioRegistry,
	registerWebGPURenderer,
} from "@gatewai.studio/node-sdk/browser";
import type {
	BackendNodePlugin,
	NodeProcessorConstructor,
	NodeRegistry,
	SkillRegistry,
} from "@gatewai.studio/node-sdk/server";
import { createJiti } from "jiti";
import * as yaml from "js-yaml";
import { CliError, ExitCode } from "../errors.js";

// Initialize Jiti for dynamic TS/ESM transpilation and loading
const jiti = createJiti(import.meta.url, {
	interopDefault: true,
	moduleCache: false,
});

export interface LoadedCustomNode {
	dir: string;
	packageName?: string;
	manifest: BackendNodePlugin;
	processor?: NodeProcessorConstructor;
	renderer?: {
		WebGPURenderer?: Parameters<typeof registerWebGPURenderer>[1];
		audioProcessor?: Parameters<typeof audioRegistry.register>[1];
	};
	skill?: {
		nodeType: string;
		name: string;
		summary: string;
		triggers: string[];
		content: string;
	};
}

/**
 * Checks if a given directory appears to be a Gatewai node package.
 */
export function isNodePackageDirectory(dirPath: string): boolean {
	if (!existsSync(dirPath)) return false;

	const pkgPath = path.join(dirPath, "package.json");
	if (existsSync(pkgPath)) {
		try {
			const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
			if (pkg.gatewai?.enabled === false) return false;
			if (
				pkg.exports?.["./server"] ||
				pkg.exports?.["./renderer"] ||
				pkg.exports?.["."] ||
				(typeof pkg.name === "string" &&
					(pkg.name.startsWith("@gatewai.studio/node-") ||
						pkg.name.startsWith("node-")))
			) {
				return true;
			}
		} catch {}
	}

	// Check for common source files or compiled dist files
	const indicatorFiles = [
		path.join(dirPath, "dist", "server.mjs"),
		path.join(dirPath, "dist", "server.js"),
		path.join(dirPath, "dist", "index.mjs"),
		path.join(dirPath, "dist", "index.js"),
		path.join(dirPath, "src", "metadata.ts"),
		path.join(dirPath, "src", "metadata.js"),
		path.join(dirPath, "metadata.ts"),
		path.join(dirPath, "metadata.js"),
		path.join(dirPath, "src", "server", "index.ts"),
		path.join(dirPath, "src", "server", "index.js"),
	];

	return indicatorFiles.some((f) => existsSync(f));
}

/**
 * Resolves and discovers all node package directories from an array of paths.
 * Supports direct node folders as well as container directories containing multiple nodes.
 */
export function discoverCustomNodePaths(
	pluginPaths: string[],
	baseDir: string = process.cwd(),
): string[] {
	const discoveredPaths = new Set<string>();

	for (const rawPath of pluginPaths) {
		const resolvedPath = path.isAbsolute(rawPath)
			? rawPath
			: path.resolve(baseDir, rawPath);

		if (!existsSync(resolvedPath)) {
			throw new CliError(
				`Plugin path does not exist: "${rawPath}" (resolved to ${resolvedPath})`,
				ExitCode.INPUT_ERROR,
				"E_INPUT",
			);
		}

		if (isNodePackageDirectory(resolvedPath)) {
			discoveredPaths.add(resolvedPath);
			continue;
		}

		// If it's a container directory, scan its subdirectories
		try {
			const entries = readdirSync(resolvedPath, { withFileTypes: true });
			let foundAny = false;

			for (const entry of entries) {
				if (entry.isDirectory()) {
					const childPath = path.join(resolvedPath, entry.name);
					if (isNodePackageDirectory(childPath)) {
						discoveredPaths.add(childPath);
						foundAny = true;
					}
				}
			}

			if (!foundAny) {
				throw new CliError(
					`No valid Gatewai node packages found in plugin directory: "${rawPath}"`,
					ExitCode.INPUT_ERROR,
					"E_INPUT",
				);
			}
		} catch (err) {
			if (err instanceof CliError) throw err;
			throw new CliError(
				`Failed to scan plugin directory "${rawPath}": ${err instanceof Error ? err.message : String(err)}`,
				ExitCode.INPUT_ERROR,
				"E_INPUT",
			);
		}
	}

	return Array.from(discoveredPaths);
}

function parseFrontmatter(raw: string): {
	frontmatter: Record<string, unknown>;
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
	const frontmatter = (yaml.load(frontmatterStr) ?? {}) as Record<
		string,
		unknown
	>;

	return { frontmatter, content };
}

function resolveExportTarget(exp: unknown): string | undefined {
	if (typeof exp === "string") return exp;
	if (exp && typeof exp === "object") {
		const obj = exp as Record<string, unknown>;
		return (
			(typeof obj.development === "string" && obj.development) ||
			(typeof obj.import === "string" && obj.import) ||
			(typeof obj.default === "string" && obj.default) ||
			(typeof obj.require === "string" && obj.require) ||
			undefined
		);
	}
	return undefined;
}

/**
 * Loads and validates a custom node package from disk.
 */
export async function loadCustomNode(
	nodeDir: string,
): Promise<LoadedCustomNode> {
	const pkgPath = path.join(nodeDir, "package.json");
	let pkg: Record<string, unknown> | undefined;
	if (existsSync(pkgPath)) {
		try {
			pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
		} catch (err) {
			throw new CliError(
				`Invalid package.json in node directory "${nodeDir}": ${err instanceof Error ? err.message : String(err)}`,
				ExitCode.INPUT_ERROR,
				"E_INPUT",
			);
		}
	}

	// Resolve Server entry point
	const serverExport = (pkg?.exports as Record<string, unknown>)?.["./server"];
	const rootExport = (pkg?.exports as Record<string, unknown>)?.["."];
	const serverExportTarget = resolveExportTarget(serverExport);
	const rootExportTarget = resolveExportTarget(rootExport);

	const serverCandidates = [
		serverExportTarget,
		rootExportTarget,
		typeof pkg?.module === "string" ? pkg.module : undefined,
		typeof pkg?.main === "string" ? pkg.main : undefined,
		"dist/server.mjs",
		"dist/server.js",
		"dist/index.mjs",
		"dist/index.js",
		"src/server/index.ts",
		"src/server/index.js",
		"src/server/index.mjs",
		"server/index.ts",
		"server/index.js",
		"src/index.ts",
		"src/index.js",
		"index.ts",
		"index.js",
	].filter((p): p is string => typeof p === "string");

	let serverFilePath: string | undefined;
	for (const candidate of serverCandidates) {
		const fullPath = path.join(nodeDir, candidate);
		if (existsSync(fullPath)) {
			serverFilePath = fullPath;
			break;
		}
	}

	if (!serverFilePath) {
		throw new CliError(
			`Node in "${nodeDir}" is missing a server entrypoint (e.g. dist/server.mjs or src/server/index.ts).`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}

	// Load Server Plugin
	let serverMod: unknown;
	try {
		serverMod = await jiti.import(serverFilePath);
	} catch (err) {
		throw new CliError(
			`Failed to import server entry for custom node at "${serverFilePath}":\n${err instanceof Error ? err.stack || err.message : String(err)}`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}

	const rawPlugin = (serverMod as { default?: unknown })?.default ?? serverMod;
	if (!rawPlugin || typeof rawPlugin !== "object") {
		throw new CliError(
			`Server entry "${serverFilePath}" must default export a defined node (e.g. defineNode(metadata, { backendProcessor })).`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}

	const plugin = rawPlugin as BackendNodePlugin;

	// Validate required manifest metadata fields
	if (!plugin.type || typeof plugin.type !== "string") {
		throw new CliError(
			`Custom node in "${nodeDir}" has invalid or missing "type" in metadata.`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}
	if (!plugin.displayName || typeof plugin.displayName !== "string") {
		throw new CliError(
			`Custom node "${plugin.type}" in "${nodeDir}" is missing "displayName".`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}
	if (!plugin.category || typeof plugin.category !== "string") {
		throw new CliError(
			`Custom node "${plugin.type}" in "${nodeDir}" is missing "category".`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}
	if (!plugin.handles || !Array.isArray(plugin.handles.inputs)) {
		throw new CliError(
			`Custom node "${plugin.type}" in "${nodeDir}" has invalid "handles.inputs" definition.`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}
	if (!plugin.handles || !Array.isArray(plugin.handles.outputs)) {
		throw new CliError(
			`Custom node "${plugin.type}" in "${nodeDir}" has invalid "handles.outputs" definition.`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}

	// Resolve Renderer entry point (optional)
	const rendererExport = (pkg?.exports as Record<string, unknown>)?.[
		"./renderer"
	];
	const rendererExportTarget = resolveExportTarget(rendererExport);

	const rendererCandidates = [
		rendererExportTarget,
		"dist/renderer.mjs",
		"dist/renderer.js",
		"src/renderers/index.ts",
		"src/renderers/index.js",
		"src/renderers/index.mjs",
		"renderers/index.ts",
		"renderers/index.js",
		"renderer/index.ts",
		"renderer/index.js",
	].filter((p): p is string => typeof p === "string");

	let rendererFilePath: string | undefined;
	for (const candidate of rendererCandidates) {
		const fullPath = path.join(nodeDir, candidate);
		if (existsSync(fullPath)) {
			rendererFilePath = fullPath;
			break;
		}
	}

	let renderer: LoadedCustomNode["renderer"];
	if (rendererFilePath) {
		try {
			const mod = (await jiti.import(rendererFilePath)) as Record<
				string,
				unknown
			>;
			const def = (mod?.default ?? mod) as {
				WebGPURenderer?: Parameters<typeof registerWebGPURenderer>[1];
				audioProcessor?: Parameters<typeof audioRegistry.register>[1];
			};
			if (def && typeof def === "object") {
				renderer = {
					WebGPURenderer: def.WebGPURenderer,
					audioProcessor: def.audioProcessor,
				};
			}
		} catch (err) {
			console.warn(
				`[node-loader] Failed to load renderer for custom node "${plugin.type}" from "${rendererFilePath}":`,
				err,
			);
		}
	}

	// Discover SKILL.md (optional)
	let skill: LoadedCustomNode["skill"];
	const skillPath = path.join(nodeDir, "SKILL.md");
	if (existsSync(skillPath)) {
		try {
			const raw = readFileSync(skillPath, "utf-8");
			const { frontmatter, content } = parseFrontmatter(raw);
			const nodeType = String(frontmatter.nodeType || plugin.type);
			const name = String(frontmatter.name || plugin.displayName);
			const summary = String(
				frontmatter.description ||
					frontmatter.summary ||
					plugin.description ||
					"",
			);
			const triggers = Array.isArray(frontmatter.triggers)
				? frontmatter.triggers.map(String)
				: typeof frontmatter.triggers === "string" && frontmatter.triggers
					? frontmatter.triggers.split(",").map((s) => s.trim())
					: [plugin.displayName.toLowerCase()];

			skill = {
				nodeType,
				name,
				summary,
				triggers,
				content,
			};
		} catch (err) {
			console.warn(
				`[node-loader] Failed to parse SKILL.md for custom node "${plugin.type}":`,
				err,
			);
		}
	}

	return {
		dir: nodeDir,
		packageName: typeof pkg?.name === "string" ? pkg.name : undefined,
		manifest: plugin,
		processor: plugin.backendProcessor,
		renderer,
		skill,
	};
}

/**
 * Registers loaded custom nodes into the global NodeRegistry, SkillRegistry, and WebGPU/Audio registries.
 */
export function registerCustomNodes(
	loadedNodes: LoadedCustomNode[],
	registries: {
		nodeRegistry: NodeRegistry;
		skillRegistry: SkillRegistry;
	},
): void {
	for (const node of loadedNodes) {
		registries.nodeRegistry.register(node.manifest);

		if (node.renderer?.WebGPURenderer) {
			registerWebGPURenderer(node.manifest.type, node.renderer.WebGPURenderer);
		}

		if (node.renderer?.audioProcessor) {
			audioRegistry.register(node.manifest.type, node.renderer.audioProcessor);
		}

		if (node.skill) {
			registries.skillRegistry.register(node.skill);
		}
	}
}

/**
 * Discover, load, and register all custom nodes specified in plugin paths.
 */
export async function loadAndRegisterPlugins(
	pluginPaths: string[],
	baseDir: string = process.cwd(),
	registries: {
		nodeRegistry: NodeRegistry;
		skillRegistry: SkillRegistry;
	},
): Promise<LoadedCustomNode[]> {
	if (!pluginPaths || pluginPaths.length === 0) return [];

	const nodeDirs = discoverCustomNodePaths(pluginPaths, baseDir);
	const loadedNodes: LoadedCustomNode[] = [];

	for (const dir of nodeDirs) {
		const loaded = await loadCustomNode(dir);
		loadedNodes.push(loaded);
	}

	registerCustomNodes(loadedNodes, registries);
	return loadedNodes;
}
