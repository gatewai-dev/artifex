#!/usr/bin/env node
// Generate the compiled MAIN SKILL.md and bundle individual node skills for the Gatewai CLI.
//
//   skills/SKILL.md          <- static authoring header (frontmatter + usage guide)
//   scripts/generate-main-skill.mjs
//     reads   skills/SKILL.md                      (header)
//     appends "Node Catalog" section from discovered node MANIFESTS
//     writes  dist/skills/SKILL.md                 (bundled main skill)
//     copies  nodes/node-*/SKILL.md -> dist/skills/nodes/<nodeType>.md
//     writes  dist/skills/skills.json              (bundled node skills registry)
//

import { execSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

function toKebabCase(str) {
	if (!str || typeof str !== "string") return "";
	return str
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.toLowerCase()
		.replace(/^-+|-+$/g, "");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(cliDir, "../..");
const nodesDir = path.resolve(repoRoot, "nodes");
const headerPath = path.join(cliDir, "skills", "SKILL.md");
const outPath = path.join(cliDir, "dist", "skills", "SKILL.md");

// ── Seed minimal env BEFORE importing any node server module ──────────────
const DEFAULTS = {
	LOG_LEVEL: "error",
	BASE_URL: "http://localhost:8081",
	RENDERER_URL: "http://localhost:8082",
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
	FAL_API_KEY: "dummy-fal-key",
	OPENROUTER_API_KEY: "dummy-openrouter-key",
};
for (const [k, v] of Object.entries(DEFAULTS)) {
	if (!process.env[k]) process.env[k] = v;
}

// ── Discover + register node manifests ────────────────────────────────────
const { NodeRegistry } = await import("@gatewai.studio/node-sdk/server");

function discoverNodeDirs() {
	const entries = readdirSync(nodesDir).filter(
		(d) =>
			d.startsWith("node-") &&
			statSync(path.join(nodesDir, d)).isDirectory() &&
			existsSync(path.join(nodesDir, d, "package.json")),
	);
	return entries;
}

function serverImportPath(pkgJsonPath) {
	const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
	if (pkg.gatewai?.enabled === false) return null;
	const serverExports = pkg.exports?.["./server"];
	const rel =
		serverExports?.import ||
		serverExports?.default ||
		serverExports?.development;
	return rel || null;
}

const registry = new NodeRegistry();
let failed = 0;
const failureNames = [];

for (const dir of discoverNodeDirs()) {
	const pkgPath = path.join(nodesDir, dir, "package.json");
	const rel = serverImportPath(pkgPath);
	if (!rel) continue;
	try {
		const abs = path.join(nodesDir, dir, rel);
		const mod = await import(`file://${abs}`);
		if (mod.default) registry.register(mod.default);
		else failed++, failureNames.push(dir);
	} catch (e) {
		failed++;
		failureNames.push(`${dir} (${e?.message ?? e})`);
	}
}

const manifests = registry.getAllManifests();

// ── Render per-node catalog entry ─────────────────────────────────────────
const fmtTypes = (arr) =>
	Array.isArray(arr) && arr.length ? arr.join(", ") : "—";

function renderHandleTable(handles) {
	if (!handles || !handles.length) return "_none_";
	const rows = handles.map((h) => {
		const req = h.required ? "yes" : "no";
		return `| \`${h.label}\` | ${fmtTypes(h.dataTypes)} | ${req} |`;
	});
	return `| Handle | Types | Required |\n|--------|-------|----------|\n${rows.join("\n")}`;
}

function renderCatalog() {
	const groups = new Map();
	for (const m of manifests) {
		const cat = m.category || "Uncategorized";
		if (!groups.has(cat)) groups.set(cat, []);
		groups.get(cat).push(m);
	}

	const out = [];
	for (const [category, list] of groups) {
		out.push(`### ${category}\n`);
		for (const m of list) {
			const display = m.displayName || m.type;
			out.push(`#### ${display} (\`${m.type}\`)`);
			if (m.description) out.push(`\n${m.description}`);
			out.push("");
			if (m.category && m.category !== category) {
				out.push(
					`- **Category:** ${m.category}${m.subcategory ? ` / ${m.subcategory}` : ""}`,
				);
			} else if (m.subcategory) {
				out.push(`- **Category:** ${m.subcategory}`);
			}
			if (m.isTerminal)
				out.push(`- **Terminal node:** produces a final renderable output`);
			out.push(`- **Inputs:**\n${renderHandleTable(m.handles?.inputs)}`);
			out.push(`- **Outputs:**\n${renderHandleTable(m.handles?.outputs)}`);
			const dynIn = m.variableInputs?.enabled
				? `enabled (${fmtTypes(m.variableInputs.dataTypes)})`
				: "no";
			const dynOut = m.variableOutputs?.enabled
				? `enabled (${fmtTypes(m.variableOutputs.dataTypes)})`
				: "no";
			out.push(`- **Dynamic inputs:** ${dynIn}`);
			out.push(`- **Dynamic outputs:** ${dynOut}`);
			out.push("");
			out.push(
				`For detailed usage rules, config parameters, and examples for this node, see [${m.type} Reference](file:///packages/artifex-skills/references/${toKebabCase(m.type)}.md).`,
			);
			out.push("");
			out.push("---");
			out.push("");
		}
	}
	return out.join("\n");
}

const header = readFileSync(headerPath, "utf-8").trim();

const sortedManifests = [...manifests].sort((a, b) => {
	const nameA = a.type || "";
	const nameB = b.type || "";
	return nameA.localeCompare(nameB);
});

const nodeListMarkdown = sortedManifests
	.map((m) => {
		const name = m.type;
		const description = m.description
			? m.description.trim().replace(/\r?\n/g, " ").replace(/\s+/g, " ")
			: "No description provided.";
		return `- ${name}: ${description}`;
	})
	.join("\n");

const placeholderStart = "<!-- NODE_LIST_START -->";
const placeholderEnd = "<!-- NODE_LIST_END -->";

let generated = header;
if (header.includes(placeholderStart) && header.includes(placeholderEnd)) {
	const startIndex = header.indexOf(placeholderStart) + placeholderStart.length;
	const endIndex = header.indexOf(placeholderEnd);

	const before = header.slice(0, startIndex);
	const after = header.slice(endIndex);

	generated = `${before}\n${nodeListMarkdown}\n${after}`;

	// Also update the source file so it stays in sync
	writeFileSync(headerPath, generated, "utf-8");
} else {
	console.warn(
		`[generate-main-skill] Placeholders ${placeholderStart} and ${placeholderEnd} not found in ${headerPath}`,
	);
}

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, generated);
execSync(`chmod 644 '${outPath}'`);

// ── Copy main SKILL.md and individual skills to @gatewai.studio/artifex-skills ──
const skillsPkgDir = path.resolve(repoRoot, "packages", "artifex-skills");
const targetReferencesDir = path.join(skillsPkgDir, "references");

// Clean and delete old skills dir if present
const oldSkillsDir = path.join(skillsPkgDir, "skills");
if (existsSync(oldSkillsDir)) {
	rmSync(oldSkillsDir, { recursive: true, force: true });
}

// Clean and create target references dir
if (existsSync(targetReferencesDir)) {
	rmSync(targetReferencesDir, { recursive: true, force: true });
}
mkdirSync(targetReferencesDir, { recursive: true });
mkdirSync(path.join(skillsPkgDir, "dist"), { recursive: true });

// Copy main catalog SKILL.md to the package root and dist/
writeFileSync(path.join(skillsPkgDir, "SKILL.md"), generated);
execSync(`chmod 644 '${path.join(skillsPkgDir, "SKILL.md")}'`);
writeFileSync(path.join(skillsPkgDir, "dist", "SKILL.md"), generated);
execSync(`chmod 644 '${path.join(skillsPkgDir, "dist", "SKILL.md")}'`);

// ── Collect and bundle all skills ──────────────────────────────────────────
function parseFrontmatter(raw) {
	const trimmed = raw.trim();
	if (!trimmed.startsWith("---")) return { frontmatter: {}, content: raw };
	const parts = trimmed.split("\n---");
	if (parts.length < 2) return { frontmatter: {}, content: raw };
	const frontmatterStr = parts[0].replace(/^---/, "").trim();
	const content = parts.slice(1).join("\n---").trim();
	return { frontmatter: yaml.load(frontmatterStr) || {}, content };
}

const bundledSkills = [];

// 1. Process the artifex skill (make it match the main installation SKILL.md)

const { frontmatter: artifexFM, content: artifexContent } =
	parseFrontmatter(header);
const artifexTriggersStr = artifexFM.metadata?.triggers || "";
const artifexTriggers = artifexTriggersStr
	? artifexTriggersStr.split(",").map((s) => s.trim())
	: Array.isArray(artifexFM.triggers)
		? artifexFM.triggers
		: [];

bundledSkills.push({
	nodeType: "artifex",
	name: artifexFM.name || "artifex",
	summary: artifexFM.description || "",
	triggers: artifexTriggers,
	content: artifexContent,
	raw: header,
});

// 2. Generate and Process the Node Catalog skill
const nodeCatalogFrontmatter = `---
name: node-catalog
description: Authoritative catalog of all supported workflow canvas nodes, with links to their respective skills.
metadata:
  triggers: list nodes, supported node types, node catalog
---

# Node Catalog

Authoritative capabilities of every registered node. Input/output handles and dynamic (variable) inputs/outputs are read directly from each node manifest at build time — the same data \`artifex nodes --json\` reports. Featured nodes (${manifests.length}).

${renderCatalog()}
`;

const nodeCatalogDestFile = path.join(targetReferencesDir, "node-catalog.md");
writeFileSync(nodeCatalogDestFile, nodeCatalogFrontmatter);
execSync(`chmod 644 '${nodeCatalogDestFile}'`);

const { frontmatter: catalogFM, content: catalogContent } = parseFrontmatter(
	nodeCatalogFrontmatter,
);
const catalogTriggersStr = catalogFM.metadata?.triggers || "";
const catalogTriggers = catalogTriggersStr
	? catalogTriggersStr.split(",").map((s) => s.trim())
	: Array.isArray(catalogFM.triggers)
		? catalogFM.triggers
		: [];

bundledSkills.push({
	nodeType: "node-catalog",
	name: catalogFM.name || "node-catalog",
	summary: catalogFM.description || "",
	triggers: catalogTriggers,
	content: catalogContent,
	raw: nodeCatalogFrontmatter,
});
// 3. Process node-specific skills
for (const dir of discoverNodeDirs()) {
	const skillFile = path.join(nodesDir, dir, "SKILL.md");
	if (existsSync(skillFile)) {
		const raw = readFileSync(skillFile, "utf-8");
		const { frontmatter, content } = parseFrontmatter(raw);
		const nodeType = frontmatter.nodeType || dir.replace(/^node-/, "");
		const kebabName = toKebabCase(nodeType);
		const description =
			frontmatter.summary ||
			frontmatter.description ||
			`Skill for the ${nodeType} node.`;

		const nodeTriggersStr = Array.isArray(frontmatter.triggers)
			? frontmatter.triggers.join(", ")
			: frontmatter.metadata?.triggers || "";
		const nodeTriggers = nodeTriggersStr
			? nodeTriggersStr.split(",").map((s) => s.trim())
			: [];

		const compliantFM = `---
name: ${kebabName}
description: ${JSON.stringify(description.trim().slice(0, 1024))}
metadata:
  nodeType: ${nodeType}
  triggers: ${JSON.stringify(nodeTriggersStr)}
---

${content}
`;

		bundledSkills.push({
			nodeType,
			name: kebabName,
			summary: description,
			triggers: nodeTriggers,
			content,
			raw: compliantFM,
		});

		// Write node skill to packages/artifex-skills/references/<kebabName>.md
		const nodeSkillDestFile = path.join(targetReferencesDir, `${kebabName}.md`);
		writeFileSync(nodeSkillDestFile, compliantFM);
		execSync(`chmod 644 '${nodeSkillDestFile}'`);
	}
}

// 4. Process recipe skills
const recipesSrcDir = path.join(cliDir, "skills", "recipes");
if (existsSync(recipesSrcDir)) {
	const recipeFiles = readdirSync(recipesSrcDir).filter((f) =>
		f.endsWith(".md"),
	);
	for (const file of recipeFiles) {
		const raw = readFileSync(path.join(recipesSrcDir, file), "utf-8");
		const { frontmatter, content } = parseFrontmatter(raw);
		const nodeType =
			frontmatter.metadata?.nodeType || file.replace(/\.md$/, "");
		const name = frontmatter.name || nodeType;
		const description = frontmatter.description || `Workflow recipe: ${name}`;

		const triggersStr = frontmatter.metadata?.triggers || "";
		const triggers = triggersStr
			? triggersStr.split(",").map((s) => s.trim())
			: [];

		bundledSkills.push({
			nodeType,
			name,
			summary: description,
			triggers,
			content,
			raw,
		});

		// Copy recipe file to packages/artifex-skills/references/<filename>
		const destFile = path.join(targetReferencesDir, file);
		writeFileSync(destFile, raw);
		execSync(`chmod 644 '${destFile}'`);
	}
}

const skillsJson = JSON.stringify(bundledSkills, null, 2);

// Write to @gatewai.studio/artifex-skills dist/
const pkgSkillsJsonPath = path.join(skillsPkgDir, "dist", "skills.json");
writeFileSync(pkgSkillsJsonPath, skillsJson);

// Write to @gatewai.studio/artifex dist/
const cliSkillsJsonPath = path.join(cliDir, "dist", "skills", "skills.json");
mkdirSync(path.dirname(cliSkillsJsonPath), { recursive: true });
writeFileSync(cliSkillsJsonPath, skillsJson);

// Copy node-lottie skills to dist/text-to-lottie
const lottieSkillsSrc = path.resolve(
	nodesDir,
	"node-lottie",
	"src",
	"server",
	"skills",
	"text-to-lottie",
);
const lottieSkillsDest = path.join(cliDir, "dist", "text-to-lottie");
if (existsSync(lottieSkillsSrc)) {
	mkdirSync(lottieSkillsDest, { recursive: true });
	cpSync(lottieSkillsSrc, lottieSkillsDest, { recursive: true });
}

console.log(`[generate-main-skill] wrote ${outPath}`);
console.log(
	`[generate-main-skill] ${manifests.length} manifests, ${failed} failed to import`,
);
console.log(
	`[generate-main-skill] bundled ${bundledSkills.length} skills into ${targetReferencesDir} and registries`,
);
if (failureNames.length) {
	console.log("[generate-main-skill] failures:");
	for (const f of failureNames) console.log(`  - ${f}`);
}
