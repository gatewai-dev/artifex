//#region ../../packages/node-sdk/dist/browser.mjs
var AudioProcessorRegistry = class {
	processors = /* @__PURE__ */ new Map();
	register(opType, processor) {
		this.processors.set(opType, processor);
	}
	get(opType) {
		return this.processors.get(opType) || null;
	}
};
const GLOBAL_AUDIO_KEY = Symbol.for("gatewai.audioRegistry");
const audioRegistry = (() => {
	const g = globalThis;
	if (!g[GLOBAL_AUDIO_KEY]) g[GLOBAL_AUDIO_KEY] = new AudioProcessorRegistry();
	return g[GLOBAL_AUDIO_KEY];
})();
const GLOBAL_WEBGPU_REGISTRY_KEY = Symbol.for("gatewai.webgpuRegistry");
var WebGPURegistry = class {
	renderers = /* @__PURE__ */ new Map();
	register(op, renderer) {
		this.renderers.set(op, renderer);
	}
	get(op) {
		return this.renderers.get(op);
	}
	has(op) {
		return this.renderers.has(op);
	}
};
const webgpuRegistry = (() => {
	const g = globalThis;
	if (!g[GLOBAL_WEBGPU_REGISTRY_KEY]) g[GLOBAL_WEBGPU_REGISTRY_KEY] = new WebGPURegistry();
	return g[GLOBAL_WEBGPU_REGISTRY_KEY];
})();
function registerWebGPURenderer(op, renderer) {
	webgpuRegistry.register(op, renderer);
}

//#endregion
export { registerWebGPURenderer as n, audioRegistry as t };