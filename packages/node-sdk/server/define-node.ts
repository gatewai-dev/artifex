import type { NodeMetadata } from "@gatewai.studio/core";
import type { Env, Schema } from "hono";
import { defineMetadata } from "../shared/define-node.js";
import type { BackendNodePlugin } from "./types.js";

export { defineMetadata };

/**
 * Define a backend node implementation.
 * This should be used in the `node.ts` file of a node package.
 */
export function defineNode<
	E extends Env = any,
	S extends Schema = any,
	P extends string = string,
>(
	metadata: NodeMetadata,
	plugin: Omit<BackendNodePlugin<E, S, P>, keyof NodeMetadata>,
): Readonly<BackendNodePlugin<E, S, P>> {
	return Object.freeze({
		...metadata,
		...plugin,
	});
}
