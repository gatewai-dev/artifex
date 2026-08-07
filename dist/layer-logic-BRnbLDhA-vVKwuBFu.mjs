import { o as __toESM } from "./chunk-DPkJJFeX.mjs";
import { N as getActiveMediaMetadata, R as resolveMediaMimeType, m as DEFAULT_DURATION_MS } from "./dist-vHBVmGr1.mjs";
import { i as getEnv, o as resolveMediaSourceUrl, s as require_react } from "./dist-BJT_v1BL.mjs";
import { x as registerHeadlessFont } from "./dist-BxLYxH-O.mjs";

//#region ../../packages/renderers/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
const { cbrt, sqrt, PI: π } = Math;
const x2t = (x, a, b, c, d) => {
	const q = a + b * x;
	const s = q ** 2 + c;
	if (s > 0) {
		const root = sqrt(s);
		return cbrt(q + root) + cbrt(q - root) - d;
	}
	const l = cbrt(sqrt(q * q - s));
	const angle = q ? Math.atan(sqrt(-s) / q) : -π / 2;
	let φ;
	if (b < 0) φ = (q > 0 ? 2 * π : π) - angle;
	else if (d < 0) φ = (q > 0 ? 2 * π : -3 * π) + angle;
	else φ = (q > 0 ? 0 : π) + angle;
	return 2 * l * Math.cos(φ / 3) - d;
};
const Y = (t, ay, by, cy) => ((ay * t + 3 * by) * t + cy) * t;
const linearEasing = (x) => x;
function bezier(mX1, mY1, mX2, mY2) {
	if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) throw new Error("bezier x values must be in [0, 1] range");
	if (mX1 === mY1 && mX2 === mY2) return linearEasing;
	const a = 6 * (3 * mX1 - 3 * mX2 + 1);
	const b = 6 * (mX2 - 2 * mX1);
	const c = 3 * mX1;
	const a2 = a * a;
	const b2 = b * b;
	const d = b / a;
	const e = 3 * b * c / a2 - b2 * b / (a2 * a);
	const w1 = 2 * c / a - b2 / a2;
	const w = w1 * w1 * w1;
	const o = 3 / a;
	const ay = 3 * mY1 - 3 * mY2 + 1;
	const by = mY2 - 2 * mY1;
	const cy = 3 * mY1;
	const X2T = a ? x2t : linearEasing;
	return function BezierEasing(x) {
		if (x === 0 || x === 1) return x;
		return Y(X2T(x, e, o, w, d), ay, by, cy);
	};
}
const Easing = {
	linear: linearEasing,
	ease: bezier(.25, .1, .25, 1),
	quad: (t) => t * t,
	cubic: (t) => t * t * t,
	poly: (n) => (t) => t ** n,
	sin: (t) => 1 - Math.cos(t * Math.PI / 2),
	circle: (t) => 1 - Math.sqrt(1 - t * t),
	exp: (t) => 2 ** (10 * (t - 1)),
	elastic: (bounciness = 1) => {
		const p = bounciness * Math.PI;
		return (t) => 1 - Math.cos(t * Math.PI / 2) ** 3 * Math.cos(t * p);
	},
	back: (s = 1.70158) => (t) => t * t * ((s + 1) * t - s),
	bounce: (t) => {
		if (t < 1 / 2.75) return 7.5625 * t * t;
		if (t < 2 / 2.75) {
			const t2$1 = t - 1.5 / 2.75;
			return 7.5625 * t2$1 * t2$1 + .75;
		}
		if (t < 2.5 / 2.75) {
			const t2$1 = t - 2.25 / 2.75;
			return 7.5625 * t2$1 * t2$1 + .9375;
		}
		const t2 = t - 2.625 / 2.75;
		return 7.5625 * t2 * t2 + .984375;
	},
	bezier,
	in: (fn) => fn,
	out: (fn) => (t) => 1 - fn(1 - t),
	inOut: (fn) => (t) => t < .5 ? fn(t * 2) / 2 : 1 - fn((1 - t) * 2) / 2
};
const PlaybackContext = (0, import_react.createContext)({
	frame: 0,
	fps: 24,
	isPlaying: false
});
const PlaybackProvider = PlaybackContext.Provider;
if (typeof globalThis !== "undefined") globalThis.__GATEWAI_DELAYS__ = globalThis.__GATEWAI_DELAYS__ || /* @__PURE__ */ new Set();
/**
* Preloads a font into the browser or headless environment.
*/
async function preloadFont(family, url) {
	if (typeof window !== "undefined" && typeof FontFace !== "undefined") try {
		const loadedFace = await new FontFace(family, `url(${url})`).load();
		document.fonts.add(loadedFace);
		await document.fonts.ready;
	} catch (e) {
		console.warn(`[preloadFont] Failed to load font "${family}" from ${url}:`, e);
	}
	else await registerHeadlessFont(family, url);
}

//#endregion
//#region ../../packages/compositions/dist/layer-logic-BRnbLDhA.mjs
const BASE_URL = getEnv("BASE_URL");
const CDN_DOMAIN = getEnv("R2_CUSTOM_DOMAIN");
/**
* Compute render parameters for the CURRENT node only — does NOT recurse into
* children. Each node in the VirtualMedia tree is responsible for exactly its
* own operation; `SingleClipComposition` drives traversal via React recursion.
*
* This is the correct function to use inside the renderer.
*/
function computeRenderParams(vv) {
	const op = vv.operation;
	const baseMeta = getActiveMediaMetadata(vv);
	const params = {
		sourceUrl: void 0,
		trimStartSec: 0,
		trimEndSec: null,
		speed: 1,
		cropRegion: null,
		flipH: false,
		flipV: false,
		rotation: 0,
		effectiveDurationSec: 0,
		mimeType: resolveMediaMimeType(vv) || null
	};
	switch (op.op) {
		case "text":
			params.sourceUrl = void 0;
			break;
		default:
			params.sourceUrl = resolveMediaSourceUrl(vv);
			break;
	}
	const sourceDurationSec = (baseMeta?.durationMs ?? 0) / 1e3;
	params.effectiveDurationSec = ((params.trimEndSec ?? sourceDurationSec) - params.trimStartSec) / params.speed;
	return params;
}
function secondsToFrames(seconds, fps) {
	return Math.round(seconds * fps);
}
const isStaticVisualMedia = (type) => type === "Image" || type === "SVG" || type === "Text";
const resolveLayerDuration = (layerDurationInMS, metaDurationMs, defaultDuration = DEFAULT_DURATION_MS, type) => {
	if (type === "Caption") return metaDurationMs && metaDurationMs > 0 ? metaDurationMs : layerDurationInMS || defaultDuration;
	const isStatic = isStaticVisualMedia(type);
	if (layerDurationInMS && metaDurationMs && !isStatic) return Math.min(layerDurationInMS, metaDurationMs);
	return layerDurationInMS || metaDurationMs || defaultDuration;
};

//#endregion
export { preloadFont as i, resolveLayerDuration as n, secondsToFrames as r, computeRenderParams as t };