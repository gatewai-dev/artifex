import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { describe, expect, it } from "vitest";

const skillsPkgDir = path.resolve(__dirname, "..");
const referencesDir = path.join(skillsPkgDir, "references");
const distDir = path.join(skillsPkgDir, "dist");

function parseFrontmatter(raw: string) {
	const trimmed = raw.trim();
	if (!trimmed.startsWith("---")) return { frontmatter: null, content: raw };
	const parts = trimmed.split("\n---");
	if (parts.length < 2) return { frontmatter: null, content: raw };
	const frontmatterStr = parts[0].replace(/^---/, "").trim();
	const content = parts.slice(1).join("\n---").trim();
	try {
		const frontmatter = yaml.load(frontmatterStr) as Record<string, any>;
		return { frontmatter, content };
	} catch (e) {
		throw new Error(
			`YAML parse failure in frontmatter: ${(e as Error).message}`,
		);
	}
}

describe("Agent Skills Validation Tests", () => {
	it("should find the references directory and make sure it has files", () => {
		expect(fs.existsSync(referencesDir)).toBe(true);
		const entries = fs.readdirSync(referencesDir);
		expect(entries.length).toBeGreaterThan(0);
	});

	it("should check that every reference file contains a valid frontmatter", () => {
		const entries = fs.readdirSync(referencesDir).filter((file) => {
			return (
				fs.statSync(path.join(referencesDir, file)).isFile() &&
				file.endsWith(".md")
			);
		});

		for (const file of entries) {
			const filePath = path.join(referencesDir, file);
			const raw = fs.readFileSync(filePath, "utf-8");
			const { frontmatter, content } = parseFrontmatter(raw);

			expect(frontmatter).not.toBeNull();
			expect(frontmatter).toBeTypeOf("object");

			// Validate name matches the filename (without extension)
			const expectedName = file.replace(/\.md$/, "");
			expect(frontmatter?.name).toBe(expectedName);
			// Validate name constraints (lowercase alphanumeric and hyphens only)
			expect(frontmatter?.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
			expect(frontmatter?.name.length).toBeLessThanOrEqual(64);

			// Validate description
			const description = frontmatter?.description;
			expect(description).toBeDefined();
			expect(description).not.toBe("");
			expect(description.length).toBeLessThanOrEqual(1024);
			// Reject a degenerate/placeholder description. Regression guard:
			// a hand-rolled frontmatter parser used to treat a folded scalar
			// (`summary: >`) as the literal value `">"`, so every node skill
			// shipped with a useless one-char description and lost its triggers.
			expect(typeof description).toBe("string");
			expect(description?.trim().length ?? 0).toBeGreaterThan(3);
			expect(description?.trim()).not.toMatch(/^[>:|,\-\s]+$/);

			// Validate that metadata contains custom properties like triggers/nodeType if present
			if (frontmatter?.metadata !== undefined) {
				expect(frontmatter.metadata).toBeTypeOf("object");
			}

			// Check that content exists and has length
			expect(content).toBeDefined();
			expect(content.trim().length).toBeGreaterThan(0);
		}
	});

	it("should validate the compiled skills.json catalog", () => {
		const skillsJsonPath = path.join(distDir, "skills.json");
		expect(fs.existsSync(skillsJsonPath)).toBe(true);

		const raw = fs.readFileSync(skillsJsonPath, "utf-8");
		const parsed = JSON.parse(raw);

		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toBeGreaterThan(0);

		for (const entry of parsed) {
			expect(entry.nodeType).toBeDefined();
			expect(entry.name).toBeDefined();
			expect(entry.summary).toBeDefined();
			expect(typeof entry.summary).toBe("string");
			expect((entry.summary as string).trim().length).toBeGreaterThan(3);
			expect((entry.summary as string).trim()).not.toMatch(/^[>:|,\-\s]+$/);
			expect(entry.triggers).toBeDefined();
			expect(Array.isArray(entry.triggers)).toBe(true);
			expect(entry.content).toBeDefined();
		}
	});

	it("should validate the main compiled SKILL.md and node-catalog skill", () => {
		const skillMdPath = path.join(distDir, "SKILL.md");
		expect(fs.existsSync(skillMdPath)).toBe(true);

		const rawMain = fs.readFileSync(skillMdPath, "utf-8");
		expect(
			rawMain.includes("# Artifex: Headless Workflow Engine & Media Renderer"),
		).toBe(true);
		expect(rawMain.includes("artifex nodes")).toBe(true);
		expect(rawMain.includes("artifex run")).toBe(true);

		const catalogMdPath = path.join(referencesDir, "node-catalog.md");
		expect(fs.existsSync(catalogMdPath)).toBe(true);

		const rawCatalog = fs.readFileSync(catalogMdPath, "utf-8");
		expect(rawCatalog.includes("# Node Catalog")).toBe(true);
		expect(
			rawCatalog.includes(
				"Authoritative capabilities of every registered node",
			),
		).toBe(true);
	});
});
