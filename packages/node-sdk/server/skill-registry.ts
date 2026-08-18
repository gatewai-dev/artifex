import type { NodeSkillEntry, NodeSkillSummary } from "@gatewai.studio/core";
import { injectable } from "inversify";

/**
 * Central registry for node skills.
 */
@injectable()
export class SkillRegistry {
	private summaries = new Map<string, NodeSkillSummary>();
	private contents = new Map<string, string>();

	/**
	 * Register a node skill.
	 */
	register(entry: NodeSkillEntry): void {
		this.summaries.set(entry.nodeType, {
			nodeType: entry.nodeType,
			name: entry.name,
			summary: entry.summary,
			triggers: entry.triggers,
		});
		this.contents.set(entry.nodeType, entry.content);
	}

	/**
	 * Get all summaries — used for the orchestrator system prompt index.
	 */
	getAllSummaries(): NodeSkillSummary[] {
		return Array.from(this.summaries.values());
	}

	/**
	 * Get a single summary by nodeType.
	 */
	getSummary(nodeType: string): NodeSkillSummary | undefined {
		return this.summaries.get(nodeType);
	}

	/**
	 * Get the full skill content for a nodeType.
	 */
	getContent(nodeType: string): string | undefined {
		return this.contents.get(nodeType);
	}

	/**
	 * Check if a skill exists for a nodeType.
	 */
	has(nodeType: string): boolean {
		return this.summaries.has(nodeType);
	}

	/**
	 * Get the count of registered skills.
	 */
	get count(): number {
		return this.summaries.size;
	}
}
