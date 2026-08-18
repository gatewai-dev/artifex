import type { WebGPUNodeRenderer } from "../browser/registry/renderers.js";
import type { AudioProcessor } from "../browser/types.js";

export interface NodeRendererPlugin {
	WebGPURenderer?: WebGPUNodeRenderer;
	audioProcessor?: AudioProcessor;
}

export function defineRenderer(
	plugin: NodeRendererPlugin,
): Readonly<NodeRendererPlugin> {
	return Object.freeze(plugin);
}
