/**
 * Dependency Injection Tokens for Gatewai Nodes.
 * Use these tokens with @inject() to access engine services in your custom processors.
 */
export const TOKENS = {
	GRAPH_RESOLVERS: Symbol.for("GRAPH_RESOLVERS"),
	STORAGE: Symbol.for("STORAGE"),
	MEDIA: Symbol.for("MEDIA"),
	AI_PROVIDER: Symbol.for("AI_PROVIDER"),
	LOGGER: Symbol.for("LOGGER"),
	NODE_REGISTRY: Symbol.for("NODE_REGISTRY"),
	SKILL_REGISTRY: Symbol.for("SKILL_REGISTRY"),
} as const;
