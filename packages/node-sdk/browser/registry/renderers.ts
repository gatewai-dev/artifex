import type { VirtualMediaData } from "@gatewai.studio/core";
import type { RenderContextValue } from "@gatewai.studio/webgpu-renderers";
import type { NodeRenderProps } from "../types.js";

/**
 * WebGPU Type definitions for environments where they are not globally available.
 * These are used as placeholders for the TypeScript compiler.
 */
// @ts-expect-error
export type GPUCommandEncoder = globalThis.GPUCommandEncoder;
// @ts-expect-error
export type GPURenderPassEncoder = globalThis.GPURenderPassEncoder;
// @ts-expect-error
export type GPUTextureView = globalThis.GPUTextureView;
// @ts-expect-error
export type GPUTexture = globalThis.GPUTexture;

export type WebGPUNodeRenderer = (args: {
	ctx: RenderContextValue;
	encoder: GPUCommandEncoder;
	pass: GPURenderPassEncoder;
	targetView: GPUTextureView;
	targetTexture: GPUTexture;
	targetWidth: number;
	targetHeight: number;
	props: NodeRenderProps;
	drawChild: (
		child: VirtualMediaData,
		overrides?: Partial<NodeRenderProps>,
		targetViewOverride?: GPUTextureView,
		targetTextureOverride?: GPUTexture,
		targetWidthOverride?: number,
		targetHeightOverride?: number,
	) => Promise<void>;
}) => Promise<void> | void;

const GLOBAL_WEBGPU_REGISTRY_KEY = Symbol.for("gatewai.webgpuRegistry");

export class WebGPURegistry {
	private renderers = new Map<string, WebGPUNodeRenderer>();

	register(op: string, renderer: WebGPUNodeRenderer): void {
		this.renderers.set(op, renderer);
	}

	get(op: string): WebGPUNodeRenderer | undefined {
		return this.renderers.get(op);
	}

	has(op: string): boolean {
		return this.renderers.has(op);
	}
}

export const webgpuRegistry: WebGPURegistry = (() => {
	const g = globalThis as any;
	if (!g[GLOBAL_WEBGPU_REGISTRY_KEY]) {
		g[GLOBAL_WEBGPU_REGISTRY_KEY] = new WebGPURegistry();
	}
	return g[GLOBAL_WEBGPU_REGISTRY_KEY];
})();

export function registerWebGPURenderer(
	op: string,
	renderer: WebGPUNodeRenderer,
): void {
	webgpuRegistry.register(op, renderer);
}
