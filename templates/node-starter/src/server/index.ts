import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { StarterProcessor } from "./processor.js";

/**
 * Server Node Definition
 *
 * Registers the node metadata and backend processor for the server engine.
 *
 * Optional parameters:
 * - `route`: An optional Hono API router for custom HTTP endpoints exposed by this node.
 * - `migrations`: An optional list of `NodeMigrateFn` functions with `.migrationName`
 *   to automatically migrate deprecated configs or database records upon server startup.
 */
export default defineNode(metadata, {
	backendProcessor: StarterProcessor,
});
