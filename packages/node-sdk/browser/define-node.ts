import type { NodeMetadata } from "@gatewai.studio/core";
import type { FrontendNodePlugin } from "./types.js";

/**
 * Define a frontend node implementation.
 * This should be default exported by node packages /browser entrypoint.
 */
export function defineClient(
	metadata: NodeMetadata,
	plugin: Omit<FrontendNodePlugin, keyof NodeMetadata>,
): Readonly<FrontendNodePlugin> {
	return Object.freeze({
		...metadata,
		...plugin,
	});
}
