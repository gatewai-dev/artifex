export interface NodeSkillSummary {
	/** The node type this skill documents (matches NodeMetadata.type) */
	nodeType: string;
	/** Human-readable name */
	name: string;
	/** 1-2 sentence summary of what the node does and when to use it */
	summary: string;
	/** Keywords that suggest loading this skill */
	triggers: string[];
}

export interface NodeSkillEntry extends NodeSkillSummary {
	/** Full markdown content of the skill (loaded lazily) */
	content: string;
}
