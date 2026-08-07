import { i as __require, o as __toESM, t as __commonJSMin } from "./chunk-DPkJJFeX.mjs";
import { accessSync, constants, existsSync } from "fs";
import { delimiter, join, resolve } from "path";
import { execFileSync } from "child_process";

//#region ../../node_modules/.pnpm/@hyperframes+parsers@0.7.86_canvas@3.2.3/node_modules/@hyperframes/parsers/dist/compositionContract.js
var COMPOSITION_ATTRIBUTES = Object.freeze({
	start: "data-start",
	duration: "data-duration",
	trackIndex: "data-track-index",
	derivedEnd: "data-end",
	legacyTrack: "data-layer"
});
var CANONICAL_AUTHORED_TIMING_ATTRIBUTES = Object.freeze([
	COMPOSITION_ATTRIBUTES.start,
	COMPOSITION_ATTRIBUTES.duration,
	COMPOSITION_ATTRIBUTES.trackIndex
]);
var DERIVED_TIMING_ATTRIBUTES = Object.freeze([COMPOSITION_ATTRIBUTES.derivedEnd]);
var LEGACY_TIMING_ATTRIBUTES = Object.freeze([COMPOSITION_ATTRIBUTES.derivedEnd, COMPOSITION_ATTRIBUTES.legacyTrack]);
function parseNumeric(value) {
	if (value == null || value.trim() === "") return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}
var REFERENCE_ID_PATTERN = /^[A-Za-z0-9_.:-]+$/;
function isAsciiDigitAt(value, index) {
	const code = value.charCodeAt(index);
	return code >= 48 && code <= 57;
}
function skipDigitsLeft(value, start) {
	let cursor = start;
	while (cursor >= 0 && isAsciiDigitAt(value, cursor)) cursor--;
	return cursor;
}
function skipWhitespaceLeft(value, start) {
	let cursor = start;
	while (cursor >= 0 && (value[cursor] ?? "").trim() === "") cursor--;
	return cursor;
}
function findMagnitudeStart(value) {
	const last = value.length - 1;
	if (!isAsciiDigitAt(value, last)) return null;
	let cursor = skipDigitsLeft(value, last);
	if (value[cursor] === ".") cursor = skipDigitsLeft(value, cursor - 1);
	return cursor + 1;
}
function parseReferenceOffset(value) {
	const magnitudeStart = findMagnitudeStart(value);
	if (magnitudeStart == null) return null;
	const operatorIndex = skipWhitespaceLeft(value, magnitudeStart - 1);
	const operator = value[operatorIndex];
	if (operator !== "+" && operator !== "-") return null;
	const refId = value.slice(0, operatorIndex).trim();
	if (!REFERENCE_ID_PATTERN.test(refId)) return null;
	const magnitude = Number(value.slice(magnitudeStart));
	if (!Number.isFinite(magnitude)) return null;
	return {
		refId,
		operator,
		magnitude
	};
}
function parseStartExpression(raw) {
	const normalized = (raw ?? "").trim();
	if (!normalized) return null;
	const absolute = parseNumeric(normalized);
	if (absolute != null) return {
		kind: "absolute",
		value: absolute
	};
	if (REFERENCE_ID_PATTERN.test(normalized)) return {
		kind: "reference",
		refId: normalized,
		offset: 0
	};
	const reference = parseReferenceOffset(normalized);
	if (!reference) return null;
	return {
		kind: "reference",
		refId: reference.refId,
		offset: reference.operator === "-" ? -reference.magnitude : reference.magnitude
	};
}
function pushDiagnostic(diagnostics, code, attribute, value) {
	diagnostics.push({
		code,
		attribute,
		value
	});
}
function resolveStart(expression, rawStart, options, diagnostics) {
	if (rawStart == null || rawStart.trim() === "") return options.defaultStart === void 0 ? 0 : options.defaultStart;
	if (!expression) {
		pushDiagnostic(diagnostics, "invalid-start", COMPOSITION_ATTRIBUTES.start, rawStart);
		return null;
	}
	if (expression.kind === "absolute") return Math.max(0, expression.value);
	const referencedEnd = options.resolveReferenceEnd?.(expression.refId);
	if (referencedEnd == null || !Number.isFinite(referencedEnd)) {
		pushDiagnostic(diagnostics, "unresolved-start-reference", COMPOSITION_ATTRIBUTES.start, rawStart);
		return null;
	}
	return Math.max(0, referencedEnd + expression.offset);
}
var DERIVED_END_EQUALITY_EPSILON_SECONDS = 1e-9;
function derivedEndsAreConsistent(parsedEnd, canonicalEnd) {
	return Math.abs(parsedEnd - canonicalEnd) <= DERIVED_END_EQUALITY_EPSILON_SECONDS;
}
function diagnoseDerivedEnd(rawEnd, canonicalEnd, diagnostics) {
	const parsedEnd = parseNumeric(rawEnd);
	if (parsedEnd == null) {
		pushDiagnostic(diagnostics, "deprecated-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
		pushDiagnostic(diagnostics, "invalid-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
		return;
	}
	if (canonicalEnd == null) {
		pushDiagnostic(diagnostics, "deprecated-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
		return;
	}
	if (derivedEndsAreConsistent(parsedEnd, canonicalEnd)) return;
	pushDiagnostic(diagnostics, "deprecated-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
	pushDiagnostic(diagnostics, "conflicting-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
}
function readCanonicalDuration(rawDuration, start, diagnostics) {
	const duration = parseNumeric(rawDuration);
	if (duration == null || duration < 0) {
		pushDiagnostic(diagnostics, "invalid-duration", COMPOSITION_ATTRIBUTES.duration, rawDuration);
		return {
			duration: null,
			end: null,
			durationSource: "invalid"
		};
	}
	return {
		duration,
		end: start == null ? null : start + duration,
		durationSource: "duration"
	};
}
function readLegacyEnd(rawEnd, start, diagnostics) {
	pushDiagnostic(diagnostics, "deprecated-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
	const end = parseNumeric(rawEnd);
	if (end == null) {
		pushDiagnostic(diagnostics, "invalid-end", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
		return {
			duration: null,
			end: null,
			durationSource: "invalid"
		};
	}
	if (start == null) return {
		duration: null,
		end,
		durationSource: "legacy-end"
	};
	if (end < start) {
		pushDiagnostic(diagnostics, "end-before-start", COMPOSITION_ATTRIBUTES.derivedEnd, rawEnd);
		return {
			duration: null,
			end: null,
			durationSource: "invalid"
		};
	}
	return {
		duration: end - start,
		end,
		durationSource: "legacy-end"
	};
}
function readDuration(attributes, start, diagnostics) {
	const rawDuration = attributes.getAttribute(COMPOSITION_ATTRIBUTES.duration);
	const rawEnd = attributes.getAttribute(COMPOSITION_ATTRIBUTES.derivedEnd);
	if (rawDuration == null) return rawEnd == null ? {
		duration: null,
		end: null,
		durationSource: "missing"
	} : readLegacyEnd(rawEnd, start, diagnostics);
	const canonical = readCanonicalDuration(rawDuration, start, diagnostics);
	if (rawEnd != null) diagnoseDerivedEnd(rawEnd, canonical.end, diagnostics);
	return canonical;
}
function readTrackValue(rawValue, attribute, source, diagnostics) {
	const trackIndex = parseNumeric(rawValue);
	if (trackIndex == null || !Number.isInteger(trackIndex)) {
		pushDiagnostic(diagnostics, "invalid-track-index", attribute, rawValue);
		return {
			trackIndex: 0,
			trackSource: "invalid"
		};
	}
	return {
		trackIndex,
		trackSource: source
	};
}
function readTrack(attributes, diagnostics) {
	const rawTrack = attributes.getAttribute(COMPOSITION_ATTRIBUTES.trackIndex);
	const rawLayer = attributes.getAttribute(COMPOSITION_ATTRIBUTES.legacyTrack);
	if (rawTrack == null && rawLayer == null) return {
		trackIndex: 0,
		trackSource: "default"
	};
	if (rawTrack == null && rawLayer != null) {
		pushDiagnostic(diagnostics, "deprecated-layer", COMPOSITION_ATTRIBUTES.legacyTrack, rawLayer);
		return readTrackValue(rawLayer, COMPOSITION_ATTRIBUTES.legacyTrack, "legacy-layer", diagnostics);
	}
	const canonical = readTrackValue(rawTrack ?? "", COMPOSITION_ATTRIBUTES.trackIndex, "track-index", diagnostics);
	if (rawLayer == null) return canonical;
	pushDiagnostic(diagnostics, "deprecated-layer", COMPOSITION_ATTRIBUTES.legacyTrack, rawLayer);
	const parsedLayer = parseNumeric(rawLayer);
	if (parsedLayer != null && parsedLayer !== canonical.trackIndex) pushDiagnostic(diagnostics, "conflicting-layer", COMPOSITION_ATTRIBUTES.legacyTrack, rawLayer);
	return canonical;
}
function readClipTiming(attributes, options = {}) {
	const diagnostics = [];
	const rawStart = attributes.getAttribute(COMPOSITION_ATTRIBUTES.start);
	const startExpression = parseStartExpression(rawStart);
	const start = resolveStart(startExpression, rawStart, options, diagnostics);
	const duration = readDuration(attributes, start, diagnostics);
	const track = readTrack(attributes, diagnostics);
	return {
		startExpression,
		start,
		...duration,
		...track,
		diagnostics
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@hyperframes+parsers@0.7.86_canvas@3.2.3/node_modules/@hyperframes/parsers/dist/colorGradingContract.js
var COLOR_GRADING_COLOR_SPACE = "rec709";
var COLOR_GRADING_MAX_CURVE_POINTS = 16;
var COLOR_GRADING_MAX_SECONDARIES = 4;
var COLOR_GRADING_ADVANCED_LIMITS = {
	hueDegrees: {
		min: 0,
		max: 360,
		inclusiveMax: false
	},
	unit: {
		min: 0,
		max: 1
	},
	signedUnit: {
		min: -1,
		max: 1
	},
	secondaryHueRange: {
		min: 0,
		max: 180
	},
	secondaryHueSoftness: {
		min: 0,
		max: 180
	},
	secondaryHueCombinedMax: 180,
	secondarySoftRangeSoftness: {
		min: 0,
		max: .5
	},
	secondaryHueShift: {
		min: -180,
		max: 180
	},
	effects: {
		asciiStyle: {
			min: 0,
			max: 7
		},
		bloom: {
			min: 0,
			max: 3
		},
		bloomRadius: {
			min: 1,
			max: 100
		},
		monoScreenShape: {
			min: 0,
			max: 4
		}
	}
};
var COLOR_GRADING_TOP_LEVEL_KEYS = [
	"enabled",
	"preset",
	"intensity",
	"adjust",
	"wheels",
	"curves",
	"hueCurves",
	"secondaries",
	"details",
	"effects",
	"palette",
	"lut",
	"colorSpace"
];
var COLOR_GRADING_ADJUST_KEYS = [
	"exposure",
	"contrast",
	"highlights",
	"shadows",
	"whites",
	"blacks",
	"temperature",
	"tint",
	"vibrance",
	"saturation"
];
var COLOR_GRADING_WHEEL_KEYS = [
	"shadows",
	"midtones",
	"highlights"
];
var COLOR_GRADING_CURVE_KEYS = [
	"master",
	"red",
	"green",
	"blue"
];
var COLOR_GRADING_HUE_CURVE_KEYS = [
	"hueVsHue",
	"hueVsSaturation",
	"hueVsLuma"
];
var COLOR_GRADING_WHEEL_CONTROL_KEYS = [
	"hue",
	"amount",
	"level"
];
var COLOR_GRADING_SECONDARY_KEYS = [
	"enabled",
	"key",
	"correction"
];
var COLOR_GRADING_SECONDARY_KEY_KEYS = [
	"hue",
	"saturation",
	"luma"
];
var COLOR_GRADING_HUE_RANGE_KEYS = [
	"center",
	"range",
	"softness"
];
var COLOR_GRADING_SOFT_RANGE_KEYS = [
	"min",
	"max",
	"softness"
];
var COLOR_GRADING_SECONDARY_CORRECTION_KEYS = [
	"hueShift",
	"saturation",
	"luma",
	"temperature",
	"tint"
];
var COLOR_GRADING_DETAIL_KEYS = [
	"vignette",
	"vignetteMidpoint",
	"vignetteRoundness",
	"vignetteFeather",
	"grain",
	"grainSize",
	"grainRoughness"
];
var COLOR_GRADING_EFFECT_KEYS = [
	"blur",
	"pixelate",
	"chromaBleed",
	"tapeDamage",
	"tapeTracking",
	"tapeNoise",
	"tapeSpeed",
	"filmArtifacts",
	"halftone",
	"halftoneSize",
	"twoInkPrint",
	"twoInkPrintSize",
	"ascii",
	"asciiSize",
	"asciiInvert",
	"asciiStyle",
	"asciiColor",
	"asciiRotation",
	"dither",
	"ditherSize",
	"bloom",
	"bloomRadius",
	"monoScreen",
	"monoScreenSize",
	"monoScreenAngle",
	"monoScreenSpread",
	"monoScreenShape",
	"monoScreenInvert",
	"scanlines",
	"scanlineCount",
	"scanlineSoftness",
	"chromaticAberration",
	"chromaticAngle",
	"crtCurvature",
	"digitalGlitch",
	"digitalGlitchColorSplit",
	"digitalGlitchLineTear",
	"digitalGlitchPixelate",
	"digitalGlitchBlockAmount",
	"digitalGlitchBlockDisplacement",
	"digitalGlitchBlockOpacity",
	"digitalGlitchSpeed",
	"engraving",
	"engravingSpacing",
	"engravingMinThickness",
	"engravingMaxThickness",
	"engravingAngle",
	"engravingContrast",
	"engravingSharpness",
	"engravingWave",
	"engravingWaveFrequency",
	"crosshatch",
	"crosshatchSpacing",
	"crosshatchThickness",
	"crosshatchAngle",
	"crosshatchContrast",
	"crosshatchEdges",
	"crosshatchLineWeight",
	"crosshatchWave",
	"crosshatchWaveFrequency",
	"kuwahara",
	"kuwaharaRadius",
	"kuwaharaSharpness",
	"kuwaharaSaturation"
];
var COLOR_GRADING_LUT_KEYS = ["src", "intensity"];
var UNIT_LIMIT = COLOR_GRADING_ADVANCED_LIMITS.unit;
var SIGNED_UNIT_LIMIT = COLOR_GRADING_ADVANCED_LIMITS.signedUnit;
var EFFECT_LIMIT_OVERRIDES = COLOR_GRADING_ADVANCED_LIMITS.effects;
var VARIABLE_REF = /^\$(?:\{[A-Za-z0-9_.:-]+\}|[A-Za-z0-9_.:-]+)$/;
var PALETTE_COLOR = /^#[0-9a-f]{6}$/i;
var OBJECT_SECTIONS = [
	["adjust", COLOR_GRADING_ADJUST_KEYS],
	["details", COLOR_GRADING_DETAIL_KEYS],
	["effects", COLOR_GRADING_EFFECT_KEYS],
	["lut", COLOR_GRADING_LUT_KEYS]
];
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isColorGradingVariableRef(value) {
	return typeof value === "string" && VARIABLE_REF.test(value.trim());
}
function unknownKeysHint(path, unknown) {
	if (path !== "grading") return `Correct or remove the unsupported "${path}" keys.`;
	const sections = new Set(unknown.flatMap((key) => OBJECT_SECTIONS.filter(([, keys]) => keys.includes(key)).map(([section]) => section)));
	return sections.size === 1 ? `Move those controls under "${[...sections][0]}".` : "Use only the documented media-treatment keys at the top level.";
}
function validateObject(value, path, keys, issues) {
	if (isColorGradingVariableRef(value)) return null;
	if (!isRecord(value)) {
		issues.push({
			path,
			message: "must be an object or variable reference"
		});
		return null;
	}
	const allowed = new Set(keys);
	const unknown = Object.keys(value).filter((key) => !allowed.has(key));
	if (unknown.length > 0) issues.push({
		path,
		message: `has unsupported key(s): ${unknown.join(", ")}`,
		hint: unknownKeysHint(path, unknown)
	});
	return value;
}
function isNumberInRange(value, limit, inclusiveMax) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < limit.min) return false;
	return inclusiveMax ? value <= limit.max : value < limit.max;
}
function validateNumericField(value, key, path, limit, issues, inclusiveMax = true) {
	const candidate = value[key];
	if (candidate === void 0 || isColorGradingVariableRef(candidate)) return;
	if (isNumberInRange(candidate, limit, inclusiveMax)) return;
	issues.push({
		path: path ? `${path}.${key}` : key,
		message: `must be a finite number from ${limit.min} ${inclusiveMax ? "through" : "up to"} ${limit.max}`
	});
}
function isFiniteTuple(value) {
	return Array.isArray(value) && value.length === 2 && value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate));
}
function validateCurve(value, path, issues) {
	if (isColorGradingVariableRef(value)) return;
	if (!Array.isArray(value) || value.length < 2 || value.length > COLOR_GRADING_MAX_CURVE_POINTS) {
		issues.push({
			path,
			message: `must contain 2 to ${COLOR_GRADING_MAX_CURVE_POINTS} [input, output] points`
		});
		return;
	}
	const inputs = /* @__PURE__ */ new Set();
	value.forEach((point, index) => {
		if (!isFiniteTuple(point)) {
			issues.push({
				path: `${path}[${index}]`,
				message: "must be a finite [input, output] tuple"
			});
			return;
		}
		const [input, output] = point;
		if (input < 0 || input > 1 || output < 0 || output > 1) issues.push({
			path: `${path}[${index}]`,
			message: "coordinates must be between 0 and 1"
		});
		if (inputs.has(input)) issues.push({
			path,
			message: `contains duplicate input ${input}`
		});
		inputs.add(input);
	});
	if (value.length + (inputs.has(0) ? 0 : 1) + (inputs.has(1) ? 0 : 1) > COLOR_GRADING_MAX_CURVE_POINTS) issues.push({
		path,
		message: `must contain at most ${COLOR_GRADING_MAX_CURVE_POINTS} points including inferred 0 and 1 endpoints`
	});
}
function validateHueCurve(value, path, outputMin, outputMax, issues) {
	if (isColorGradingVariableRef(value)) return;
	if (!Array.isArray(value) || value.length < 3 || value.length > COLOR_GRADING_MAX_CURVE_POINTS) {
		issues.push({
			path,
			message: `must contain 3 to ${COLOR_GRADING_MAX_CURVE_POINTS} [hueDegrees, delta] points`
		});
		return;
	}
	const hues = /* @__PURE__ */ new Set();
	value.forEach((point, index) => {
		if (!isFiniteTuple(point)) {
			issues.push({
				path: `${path}[${index}]`,
				message: "must be a finite [hue, delta] tuple"
			});
			return;
		}
		const [hue, delta] = point;
		if (hue < 0 || hue >= 360) issues.push({
			path: `${path}[${index}][0]`,
			message: "must be from 0 up to 360 degrees"
		});
		if (delta < outputMin || delta > outputMax) issues.push({
			path: `${path}[${index}][1]`,
			message: `must be between ${outputMin} and ${outputMax}`
		});
		if (hues.has(hue)) issues.push({
			path,
			message: `contains duplicate hue ${hue}`
		});
		hues.add(hue);
	});
}
function validateNumericSection(value, path, keys, limitFor, issues) {
	for (const key of keys) validateNumericField(value, key, path, limitFor(key), issues);
}
function validatePalette(value, issues) {
	if (value === void 0 || value === null || isColorGradingVariableRef(value)) return;
	const hint = "Use 2 to 6 colors in the intended mapping order, each written as exact \"#RRGGBB\", or use a project variable reference.";
	if (!Array.isArray(value) || value.length < 2 || value.length > 6) {
		issues.push({
			path: "palette",
			message: "must contain 2 to 6 hex colors",
			hint
		});
		return;
	}
	value.forEach((color, index) => {
		if (typeof color !== "string" || !PALETTE_COLOR.test(color)) issues.push({
			path: `palette[${index}]`,
			message: "must be a six-digit hex color",
			hint
		});
	});
}
function validateLut(value, object, issues) {
	if (typeof value === "string") {
		if (!value.trim()) issues.push({
			path: "lut",
			message: "must not be empty"
		});
		return;
	}
	if (!object) return;
	if (!isColorGradingVariableRef(object.src) && (typeof object.src !== "string" || !object.src.trim())) issues.push({
		path: "lut.src",
		message: "must be a non-empty string or variable reference"
	});
	validateNumericField(object, "intensity", "lut", UNIT_LIMIT, issues);
}
function validateEnabled(grading, issues) {
	if (grading.enabled !== void 0 && !isColorGradingVariableRef(grading.enabled) && typeof grading.enabled !== "boolean") issues.push({
		path: "enabled",
		message: "must be a boolean or variable reference"
	});
}
function validatePreset(grading, issues) {
	if (grading.preset !== void 0 && grading.preset !== null && !isColorGradingVariableRef(grading.preset) && (typeof grading.preset !== "string" || !grading.preset.trim())) issues.push({
		path: "preset",
		message: "must be a non-empty string, null, or variable reference"
	});
}
function validateColorSpace(grading, issues) {
	if (grading.colorSpace !== void 0 && !isColorGradingVariableRef(grading.colorSpace) && grading.colorSpace !== COLOR_GRADING_COLOR_SPACE) issues.push({
		path: "colorSpace",
		message: `must be "${COLOR_GRADING_COLOR_SPACE}" or a variable reference`
	});
}
function validateTopLevel(grading, issues) {
	validateEnabled(grading, issues);
	validateNumericField(grading, "intensity", "", UNIT_LIMIT, issues);
	validatePreset(grading, issues);
	validateColorSpace(grading, issues);
}
function validateSection(grading, key, keys, issues) {
	const section = grading[key];
	if (section === void 0 || key === "lut" && section === null) return;
	if (key === "lut" && typeof section === "string") {
		validateLut(section, null, issues);
		return;
	}
	const object = validateObject(section, key, keys, issues);
	if (!object) return;
	if (key === "lut") return validateLut(section, object, issues);
	const limitFor = (control) => {
		if (key === "adjust" && control === "exposure") return {
			min: -2,
			max: 2
		};
		if (key === "adjust" || key === "details" && control === "vignetteRoundness") return SIGNED_UNIT_LIMIT;
		return key === "effects" ? EFFECT_LIMIT_OVERRIDES[control] ?? UNIT_LIMIT : UNIT_LIMIT;
	};
	validateNumericSection(object, key, keys, limitFor, issues);
}
function validateSections(grading, issues) {
	for (const [key, keys] of OBJECT_SECTIONS) validateSection(grading, key, keys, issues);
}
function validateWheels(value, issues) {
	if (value === void 0 || isColorGradingVariableRef(value)) return;
	const wheels = validateObject(value, "wheels", COLOR_GRADING_WHEEL_KEYS, issues);
	if (!wheels) return;
	for (const wheel of COLOR_GRADING_WHEEL_KEYS) {
		if (wheels[wheel] === void 0) continue;
		const path = `wheels.${wheel}`;
		const controls = validateObject(wheels[wheel], path, COLOR_GRADING_WHEEL_CONTROL_KEYS, issues);
		if (!controls) continue;
		validateNumericField(controls, "hue", path, COLOR_GRADING_ADVANCED_LIMITS.hueDegrees, issues, COLOR_GRADING_ADVANCED_LIMITS.hueDegrees.inclusiveMax);
		validateNumericField(controls, "amount", path, UNIT_LIMIT, issues);
		validateNumericField(controls, "level", path, SIGNED_UNIT_LIMIT, issues);
	}
}
function validateCurves(value, issues) {
	if (value === void 0 || isColorGradingVariableRef(value)) return;
	const curves = validateObject(value, "curves", COLOR_GRADING_CURVE_KEYS, issues);
	if (!curves) return;
	for (const key of COLOR_GRADING_CURVE_KEYS) if (curves[key] !== void 0) validateCurve(curves[key], `curves.${key}`, issues);
}
function validateHueCurves(value, issues) {
	if (value === void 0 || isColorGradingVariableRef(value)) return;
	const curves = validateObject(value, "hueCurves", COLOR_GRADING_HUE_CURVE_KEYS, issues);
	if (!curves) return;
	const limits = {
		hueVsHue: [-180, 180],
		hueVsSaturation: [-1, 1],
		hueVsLuma: [-1, 1]
	};
	for (const key of COLOR_GRADING_HUE_CURVE_KEYS) if (curves[key] !== void 0) validateHueCurve(curves[key], `hueCurves.${key}`, limits[key][0], limits[key][1], issues);
}
function validateSoftRange(value, path, issues) {
	const range = validateObject(value, path, COLOR_GRADING_SOFT_RANGE_KEYS, issues);
	if (!range) return;
	validateNumericField(range, "min", path, UNIT_LIMIT, issues);
	validateNumericField(range, "max", path, UNIT_LIMIT, issues);
	validateNumericField(range, "softness", path, COLOR_GRADING_ADVANCED_LIMITS.secondarySoftRangeSoftness, issues);
	if (typeof range.min === "number" && typeof range.max === "number" && range.min >= range.max) issues.push({
		path,
		message: "min must be smaller than max"
	});
}
function validateSecondaryHue(value, path, issues) {
	const hue = validateObject(value, path, COLOR_GRADING_HUE_RANGE_KEYS, issues);
	if (!hue) return;
	validateNumericField(hue, "center", path, COLOR_GRADING_ADVANCED_LIMITS.hueDegrees, issues, COLOR_GRADING_ADVANCED_LIMITS.hueDegrees.inclusiveMax);
	validateNumericField(hue, "range", path, COLOR_GRADING_ADVANCED_LIMITS.secondaryHueRange, issues);
	validateNumericField(hue, "softness", path, COLOR_GRADING_ADVANCED_LIMITS.secondaryHueSoftness, issues);
	if (typeof hue.range === "number" && typeof hue.softness === "number" && hue.range + hue.softness > COLOR_GRADING_ADVANCED_LIMITS.secondaryHueCombinedMax) issues.push({
		path,
		message: `range plus softness must not exceed ${COLOR_GRADING_ADVANCED_LIMITS.secondaryHueCombinedMax} degrees`
	});
}
function validateSecondaryKey(value, path, issues) {
	const key = validateObject(value, path, COLOR_GRADING_SECONDARY_KEY_KEYS, issues);
	if (!key) return;
	if (key.hue !== void 0) validateSecondaryHue(key.hue, `${path}.hue`, issues);
	if (key.saturation !== void 0) validateSoftRange(key.saturation, `${path}.saturation`, issues);
	if (key.luma !== void 0) validateSoftRange(key.luma, `${path}.luma`, issues);
}
function validateSecondaryCorrection(value, path, issues) {
	const correction = validateObject(value, path, COLOR_GRADING_SECONDARY_CORRECTION_KEYS, issues);
	if (!correction) return;
	validateNumericField(correction, "hueShift", path, COLOR_GRADING_ADVANCED_LIMITS.secondaryHueShift, issues);
	for (const key of [
		"saturation",
		"luma",
		"temperature",
		"tint"
	]) validateNumericField(correction, key, path, SIGNED_UNIT_LIMIT, issues);
}
function validateSecondary(value, index, issues) {
	const path = `secondaries[${index}]`;
	const secondary = validateObject(value, path, COLOR_GRADING_SECONDARY_KEYS, issues);
	if (!secondary) return;
	if (secondary.enabled !== void 0 && typeof secondary.enabled !== "boolean" && !isColorGradingVariableRef(secondary.enabled)) issues.push({
		path: `${path}.enabled`,
		message: "must be a boolean"
	});
	validateSecondaryKey(secondary.key, `${path}.key`, issues);
	validateSecondaryCorrection(secondary.correction, `${path}.correction`, issues);
}
function validateSecondaries(value, issues) {
	if (value === void 0 || isColorGradingVariableRef(value)) return;
	if (!Array.isArray(value) || value.length > COLOR_GRADING_MAX_SECONDARIES) {
		issues.push({
			path: "secondaries",
			message: `must be an array of at most ${COLOR_GRADING_MAX_SECONDARIES} selections`
		});
		return;
	}
	value.forEach((secondary, index) => validateSecondary(secondary, index, issues));
}
function validateColorGradingContract(value) {
	if (typeof value === "string") return value.trim() ? [] : [{
		path: "grading",
		message: "is empty"
	}];
	const issues = [];
	const grading = validateObject(value, "grading", COLOR_GRADING_TOP_LEVEL_KEYS, issues);
	if (!grading) return issues;
	validateTopLevel(grading, issues);
	validateSections(grading, issues);
	validateWheels(grading.wheels, issues);
	validateCurves(grading.curves, issues);
	validateHueCurves(grading.hueCurves, issues);
	validateSecondaries(grading.secondaries, issues);
	validatePalette(grading.palette, issues);
	return issues;
}

//#endregion
//#region ../../node_modules/.pnpm/@hyperframes+parsers@0.7.86_canvas@3.2.3/node_modules/@hyperframes/parsers/dist/ffBinaries.js
var FFMPEG_PATH_ENV = "HYPERFRAMES_FFMPEG_PATH";
var FFPROBE_PATH_ENV = "HYPERFRAMES_FFPROBE_PATH";
var ENV_BY_NAME = {
	ffmpeg: FFMPEG_PATH_ENV,
	ffprobe: FFPROBE_PATH_ENV
};
var pathLookupCache = /* @__PURE__ */ new Map();
function candidateFileName(candidate) {
	return candidate.split(/[\\/]/).at(-1)?.toLowerCase() ?? candidate.toLowerCase();
}
function chooseBestPathCandidate(name, candidates) {
	const normalized = candidates.map((candidate) => candidate.trim()).filter(Boolean);
	return normalized.find((candidate) => candidateFileName(candidate) === `${name}.exe`) ?? normalized.find((candidate) => candidateFileName(candidate) === name) ?? normalized.find((candidate) => !candidateFileName(candidate).match(/\.(cmd|bat)$/i)) ?? normalized[0];
}
function isExecutablePathCandidate(candidate) {
	if (process.platform === "win32") return existsSync(candidate);
	try {
		accessSync(candidate, constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function scanPath(name) {
	const pathValue = process.env.PATH;
	const searchDirs = [...process.platform === "win32" ? [process.cwd()] : [], ...pathValue ? pathValue.split(delimiter) : []].filter(Boolean);
	if (searchDirs.length === 0) return void 0;
	const extensions = process.platform === "win32" ? [
		".exe",
		...new Set((process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").map((ext) => ext.trim().toLowerCase()).filter(Boolean)),
		""
	] : [""];
	const candidates = [];
	for (const dir of new Set(searchDirs)) for (const ext of extensions) {
		const candidate = join(dir, `${name}${ext}`);
		if (isExecutablePathCandidate(candidate)) candidates.push(candidate);
	}
	return chooseBestPathCandidate(name, candidates);
}
var COMMON_BIN_DIRS = process.platform === "win32" ? [] : [
	"/opt/homebrew/bin",
	"/usr/local/bin",
	"/usr/bin",
	"/bin",
	"/snap/bin"
];
function findInCommonDirs(name) {
	for (const dir of COMMON_BIN_DIRS) {
		const candidate = `${dir}/${name}`;
		if (existsSync(candidate)) return candidate;
	}
}
function findInProjectLocalBin(name) {
	const candidate = resolve(".hyperframes", "bin", `${name}${process.platform === "win32" ? ".exe" : ""}`);
	return existsSync(candidate) ? candidate : void 0;
}
function lookupOnSystem(name) {
	if (pathLookupCache.has(name)) return pathLookupCache.get(name);
	let found;
	if (process.platform === "win32") found = scanPath(name);
	else try {
		const candidate = chooseBestPathCandidate(name, execFileSync("which", [name], {
			encoding: "utf-8",
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			timeout: 5e3
		}).split(/\r?\n/));
		found = candidate && isExecutablePathCandidate(candidate) ? candidate : scanPath(name);
	} catch {
		found = scanPath(name);
	}
	found ??= findInProjectLocalBin(name);
	found ??= findInCommonDirs(name);
	const resolved = found ? resolve(found) : void 0;
	pathLookupCache.set(name, resolved);
	return resolved;
}
function findFfBinary(name, options = {}) {
	const configured = process.env[ENV_BY_NAME[name]]?.trim();
	if (configured) {
		if (options.configuredMustExist && !existsSync(configured)) return void 0;
		return resolve(configured);
	}
	return lookupOnSystem(name);
}

//#endregion
//#region ../../node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let p = process || {}, argv = p.argv || [], env = p.env || {};
	let isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
	let formatter = (open, close, replace = open) => (input) => {
		let string = "" + input, index = string.indexOf(close, open.length);
		return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
	};
	let replaceClose = (string, close, replace, index) => {
		let result = "", cursor = 0;
		do {
			result += string.substring(cursor, index) + replace;
			cursor = index + close.length;
			index = string.indexOf(close, cursor);
		} while (~index);
		return result + string.substring(cursor);
	};
	let createColors = (enabled = isColorSupported) => {
		let f = enabled ? formatter : () => String;
		return {
			isColorSupported: enabled,
			reset: f("\x1B[0m", "\x1B[0m"),
			bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
			dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
			italic: f("\x1B[3m", "\x1B[23m"),
			underline: f("\x1B[4m", "\x1B[24m"),
			inverse: f("\x1B[7m", "\x1B[27m"),
			hidden: f("\x1B[8m", "\x1B[28m"),
			strikethrough: f("\x1B[9m", "\x1B[29m"),
			black: f("\x1B[30m", "\x1B[39m"),
			red: f("\x1B[31m", "\x1B[39m"),
			green: f("\x1B[32m", "\x1B[39m"),
			yellow: f("\x1B[33m", "\x1B[39m"),
			blue: f("\x1B[34m", "\x1B[39m"),
			magenta: f("\x1B[35m", "\x1B[39m"),
			cyan: f("\x1B[36m", "\x1B[39m"),
			white: f("\x1B[37m", "\x1B[39m"),
			gray: f("\x1B[90m", "\x1B[39m"),
			bgBlack: f("\x1B[40m", "\x1B[49m"),
			bgRed: f("\x1B[41m", "\x1B[49m"),
			bgGreen: f("\x1B[42m", "\x1B[49m"),
			bgYellow: f("\x1B[43m", "\x1B[49m"),
			bgBlue: f("\x1B[44m", "\x1B[49m"),
			bgMagenta: f("\x1B[45m", "\x1B[49m"),
			bgCyan: f("\x1B[46m", "\x1B[49m"),
			bgWhite: f("\x1B[47m", "\x1B[49m"),
			blackBright: f("\x1B[90m", "\x1B[39m"),
			redBright: f("\x1B[91m", "\x1B[39m"),
			greenBright: f("\x1B[92m", "\x1B[39m"),
			yellowBright: f("\x1B[93m", "\x1B[39m"),
			blueBright: f("\x1B[94m", "\x1B[39m"),
			magentaBright: f("\x1B[95m", "\x1B[39m"),
			cyanBright: f("\x1B[96m", "\x1B[39m"),
			whiteBright: f("\x1B[97m", "\x1B[39m"),
			bgBlackBright: f("\x1B[100m", "\x1B[49m"),
			bgRedBright: f("\x1B[101m", "\x1B[49m"),
			bgGreenBright: f("\x1B[102m", "\x1B[49m"),
			bgYellowBright: f("\x1B[103m", "\x1B[49m"),
			bgBlueBright: f("\x1B[104m", "\x1B[49m"),
			bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
			bgCyanBright: f("\x1B[106m", "\x1B[49m"),
			bgWhiteBright: f("\x1B[107m", "\x1B[49m")
		};
	};
	module.exports = createColors();
	module.exports.createColors = createColors;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/tokenize.js
var require_tokenize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SINGLE_QUOTE = "'".charCodeAt(0);
	const DOUBLE_QUOTE = "\"".charCodeAt(0);
	const BACKSLASH = "\\".charCodeAt(0);
	const SLASH = "/".charCodeAt(0);
	const NEWLINE = "\n".charCodeAt(0);
	const SPACE = " ".charCodeAt(0);
	const FEED = "\f".charCodeAt(0);
	const TAB = "	".charCodeAt(0);
	const CR = "\r".charCodeAt(0);
	const OPEN_SQUARE = "[".charCodeAt(0);
	const CLOSE_SQUARE = "]".charCodeAt(0);
	const OPEN_PARENTHESES = "(".charCodeAt(0);
	const CLOSE_PARENTHESES = ")".charCodeAt(0);
	const OPEN_CURLY = "{".charCodeAt(0);
	const CLOSE_CURLY = "}".charCodeAt(0);
	const SEMICOLON = ";".charCodeAt(0);
	const ASTERISK = "*".charCodeAt(0);
	const COLON = ":".charCodeAt(0);
	const AT = "@".charCodeAt(0);
	const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
	const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
	const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
	const RE_HEX_ESCAPE = /[\da-f]/i;
	module.exports = function tokenizer(input, options = {}) {
		let css = input.css.valueOf();
		let ignore = options.ignoreErrors;
		let code, content, escape, next, quote;
		let currentToken, escaped, escapePos, n, prev;
		let length = css.length;
		let pos = 0;
		let buffer = [];
		let returned = [];
		let lastBadParen = -1;
		function position() {
			return pos;
		}
		function unclosed(what) {
			throw input.error("Unclosed " + what, pos);
		}
		function endOfFile() {
			return returned.length === 0 && pos >= length;
		}
		function nextToken(opts) {
			if (returned.length) return returned.pop();
			if (pos >= length) return;
			let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
			code = css.charCodeAt(pos);
			switch (code) {
				case NEWLINE:
				case SPACE:
				case TAB:
				case CR:
				case FEED:
					next = pos;
					do {
						next += 1;
						code = css.charCodeAt(next);
					} while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
					currentToken = ["space", css.slice(pos, next)];
					pos = next - 1;
					break;
				case OPEN_SQUARE:
				case CLOSE_SQUARE:
				case OPEN_CURLY:
				case CLOSE_CURLY:
				case COLON:
				case SEMICOLON:
				case CLOSE_PARENTHESES: {
					let controlChar = String.fromCharCode(code);
					currentToken = [
						controlChar,
						controlChar,
						pos
					];
					break;
				}
				case OPEN_PARENTHESES:
					prev = buffer.length ? buffer.pop()[1] : "";
					n = css.charCodeAt(pos + 1);
					if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
						next = pos;
						do {
							escaped = false;
							next = css.indexOf(")", next + 1);
							if (next === -1) if (ignore || ignoreUnclosed) {
								next = pos;
								break;
							} else unclosed("bracket");
							escapePos = next;
							while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
								escapePos -= 1;
								escaped = !escaped;
							}
						} while (escaped);
						currentToken = [
							"brackets",
							css.slice(pos, next + 1),
							pos,
							next
						];
						pos = next;
					} else if (pos <= lastBadParen) currentToken = [
						"(",
						"(",
						pos
					];
					else {
						next = css.indexOf(")", pos + 1);
						content = css.slice(pos, next + 1);
						if (next === -1 || RE_BAD_BRACKET.test(content)) {
							lastBadParen = next === -1 ? length : next;
							currentToken = [
								"(",
								"(",
								pos
							];
						} else {
							currentToken = [
								"brackets",
								content,
								pos,
								next
							];
							pos = next;
						}
					}
					break;
				case SINGLE_QUOTE:
				case DOUBLE_QUOTE:
					quote = code === SINGLE_QUOTE ? "'" : "\"";
					next = pos;
					do {
						escaped = false;
						next = css.indexOf(quote, next + 1);
						if (next === -1) if (ignore || ignoreUnclosed) {
							next = pos + 1;
							break;
						} else unclosed("string");
						escapePos = next;
						while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
							escapePos -= 1;
							escaped = !escaped;
						}
					} while (escaped);
					currentToken = [
						"string",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				case AT:
					RE_AT_END.lastIndex = pos + 1;
					RE_AT_END.test(css);
					if (RE_AT_END.lastIndex === 0) next = css.length - 1;
					else next = RE_AT_END.lastIndex - 2;
					currentToken = [
						"at-word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				case BACKSLASH:
					next = pos;
					escape = true;
					while (css.charCodeAt(next + 1) === BACKSLASH) {
						next += 1;
						escape = !escape;
					}
					code = css.charCodeAt(next + 1);
					if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
						next += 1;
						if (RE_HEX_ESCAPE.test(css.charAt(next))) {
							while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) next += 1;
							if (css.charCodeAt(next + 1) === SPACE) next += 1;
						}
					}
					currentToken = [
						"word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				default:
					if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
						next = css.indexOf("*/", pos + 2) + 1;
						if (next === 0) if (ignore || ignoreUnclosed) next = css.length;
						else unclosed("comment");
						currentToken = [
							"comment",
							css.slice(pos, next + 1),
							pos,
							next
						];
						pos = next;
					} else {
						RE_WORD_END.lastIndex = pos + 1;
						RE_WORD_END.test(css);
						if (RE_WORD_END.lastIndex === 0) next = css.length - 1;
						else next = RE_WORD_END.lastIndex - 2;
						currentToken = [
							"word",
							css.slice(pos, next + 1),
							pos,
							next
						];
						buffer.push(currentToken);
						pos = next;
					}
					break;
			}
			pos++;
			return currentToken;
		}
		function back(token) {
			returned.push(token);
		}
		return {
			back,
			endOfFile,
			nextToken,
			position
		};
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/terminal-highlight.js
var require_terminal_highlight = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let pico = require_picocolors();
	let tokenizer = require_tokenize();
	let Input;
	function registerInput(dependant) {
		Input = dependant;
	}
	const HIGHLIGHT_THEME = {
		";": pico.yellow,
		":": pico.yellow,
		"(": pico.cyan,
		")": pico.cyan,
		"[": pico.yellow,
		"]": pico.yellow,
		"{": pico.yellow,
		"}": pico.yellow,
		"at-word": pico.cyan,
		"brackets": pico.cyan,
		"call": pico.cyan,
		"class": pico.yellow,
		"comment": pico.gray,
		"hash": pico.magenta,
		"string": pico.green
	};
	function getTokenType([type, value], processor) {
		if (type === "word") {
			if (value[0] === ".") return "class";
			if (value[0] === "#") return "hash";
		}
		if (!processor.endOfFile()) {
			let next = processor.nextToken();
			processor.back(next);
			if (next[0] === "brackets" || next[0] === "(") return "call";
		}
		return type;
	}
	function terminalHighlight(css) {
		let processor = tokenizer(new Input(css), { ignoreErrors: true });
		let result = "";
		while (!processor.endOfFile()) {
			let token = processor.nextToken();
			let color = HIGHLIGHT_THEME[getTokenType(token, processor)];
			if (color) result += token[1].split(/\r?\n/).map((i) => color(i)).join("\n");
			else result += token[1];
		}
		return result;
	}
	terminalHighlight.registerInput = registerInput;
	module.exports = terminalHighlight;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/css-syntax-error.js
var require_css_syntax_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let pico = require_picocolors();
	let terminalHighlight = require_terminal_highlight();
	var CssSyntaxError = class CssSyntaxError extends Error {
		constructor(message, line, column, source, file, plugin$1) {
			super(message);
			this.name = "CssSyntaxError";
			this.reason = message;
			if (file) this.file = file;
			if (source) this.source = source;
			if (plugin$1) this.plugin = plugin$1;
			if (typeof line !== "undefined" && typeof column !== "undefined") if (typeof line === "number") {
				this.line = line;
				this.column = column;
			} else {
				this.line = line.line;
				this.column = line.column;
				this.endLine = column.line;
				this.endColumn = column.column;
			}
			this.setMessage();
			if (Error.captureStackTrace) Error.captureStackTrace(this, CssSyntaxError);
		}
		setMessage() {
			this.message = this.plugin ? this.plugin + ": " : "";
			this.message += this.file ? this.file : "<css input>";
			if (typeof this.line !== "undefined") this.message += ":" + this.line + ":" + this.column;
			this.message += ": " + this.reason;
		}
		showSourceCode(color) {
			if (!this.source) return "";
			let css = this.source;
			if (color == null) color = pico.isColorSupported;
			let aside = (text) => text;
			let mark = (text) => text;
			let highlight = (text) => text;
			if (color) {
				let { bold, gray, red } = pico.createColors(true);
				mark = (text) => bold(red(text));
				aside = (text) => gray(text);
				if (terminalHighlight) highlight = (text) => terminalHighlight(text);
			}
			let lines = css.split(/\r?\n/);
			let start = Math.max(this.line - 3, 0);
			let end = Math.min(this.line + 2, lines.length);
			let maxWidth = String(end).length;
			return lines.slice(start, end).map((line, index) => {
				let number = start + 1 + index;
				let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
				if (number === this.line) {
					if (line.length > 160) {
						let padding = 20;
						let subLineStart = Math.max(0, this.column - padding);
						let subLineEnd = Math.max(this.column + padding, this.endColumn + padding);
						let subLine = line.slice(subLineStart, subLineEnd);
						let spacing$1 = aside(gutter.replace(/\d/g, " ")) + line.slice(0, Math.min(this.column - 1, padding - 1)).replace(/[^\t]/g, " ");
						return mark(">") + aside(gutter) + highlight(subLine) + "\n " + spacing$1 + mark("^");
					}
					let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
					return mark(">") + aside(gutter) + highlight(line) + "\n " + spacing + mark("^");
				}
				return " " + aside(gutter) + highlight(line);
			}).join("\n");
		}
		toString() {
			let code = this.showSourceCode();
			if (code) code = "\n\n" + code + "\n";
			return this.name + ": " + this.message + code;
		}
	};
	module.exports = CssSyntaxError;
	CssSyntaxError.default = CssSyntaxError;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/stringifier.js
var require_stringifier = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const STYLE_TAG = /(<)(\/?style\b)/gi;
	const COMMENT_OPEN = /(<)(!--)/g;
	const AT_NAME_END = /[\t\n\f\r "#'()/;[\\\]{}]/;
	function escapeHTMLInCSS(str) {
		if (typeof str !== "string") return str;
		if (!str.includes("<")) return str;
		return str.replace(STYLE_TAG, "\\3c $2").replace(COMMENT_OPEN, "\\3c $2");
	}
	const DEFAULT_RAW = {
		after: "\n",
		beforeClose: "\n",
		beforeComment: "\n",
		beforeDecl: "\n",
		beforeOpen: " ",
		beforeRule: "\n",
		colon: ": ",
		commentLeft: " ",
		commentRight: " ",
		emptyBody: "",
		indent: "    ",
		semicolon: false
	};
	function capitalize(str) {
		return str[0].toUpperCase() + str.slice(1);
	}
	function atruleStart(str, node) {
		let name = "@" + node.name;
		let params = node.params ? str.rawValue(node, "params") : "";
		let afterName = node.raws.afterName;
		if (typeof afterName === "undefined") afterName = params ? " " : "";
		else if (afterName === "" && params && !AT_NAME_END.test(params[0])) afterName = " ";
		return name + afterName + params;
	}
	function pushBody(str, stack, node) {
		let nodes = node.nodes;
		let last = nodes.length - 1;
		while (last > 0) {
			if (nodes[last].type !== "comment") break;
			last -= 1;
		}
		let semicolon = str.raw(node, "semicolon");
		let isDocument = node.type === "document";
		for (let i = nodes.length - 1; i >= 0; i--) {
			let child = nodes[i];
			let childSemicolon = last !== i || semicolon;
			if (!childSemicolon && i < nodes.length - 1 && (child.type === "atrule" && !child.nodes || child.type === "decl" && child.prop.startsWith("--"))) childSemicolon = true;
			stack.push({
				document: isDocument,
				node: child,
				semicolon: childSemicolon
			});
		}
	}
	function pushBlock(str, stack, node, start) {
		let between = str.raw(node, "between", "beforeOpen");
		str.builder(escapeHTMLInCSS(start + between) + "{", node, "start");
		let hasNodes = node.nodes && node.nodes.length;
		let close = () => {
			let after = hasNodes ? str.raw(node, "after") : str.raw(node, "after", "emptyBody");
			if (after) str.builder(escapeHTMLInCSS(after));
			str.builder("}", node, "end");
			if (node.type === "rule" && node.raws.ownSemicolon) str.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
		};
		if (hasNodes) {
			stack.push(close);
			pushBody(str, stack, node);
		} else close();
	}
	var Stringifier = class Stringifier {
		constructor(builder) {
			this.builder = builder;
		}
		atrule(node, semicolon) {
			let start = atruleStart(this, node);
			if (node.nodes) this.block(node, start);
			else {
				let end = (node.raws.between || "") + (semicolon ? ";" : "");
				this.builder(escapeHTMLInCSS(start + end), node);
			}
		}
		beforeAfter(node, detect) {
			let value;
			if (node.type === "decl") value = this.raw(node, null, "beforeDecl");
			else if (node.type === "comment") value = this.raw(node, null, "beforeComment");
			else if (detect === "before") value = this.raw(node, null, "beforeRule");
			else value = this.raw(node, null, "beforeClose");
			let buf = node.parent;
			let depth = 0;
			while (buf && buf.type !== "root") {
				depth += 1;
				buf = buf.parent;
			}
			if (value.includes("\n")) {
				let indent = this.raw(node, null, "indent");
				if (indent.length) for (let step = 0; step < depth; step++) value += indent;
			}
			return value;
		}
		block(node, start) {
			let between = this.raw(node, "between", "beforeOpen");
			this.builder(escapeHTMLInCSS(start + between) + "{", node, "start");
			let after;
			if (node.nodes && node.nodes.length) {
				this.body(node);
				after = this.raw(node, "after");
			} else after = this.raw(node, "after", "emptyBody");
			if (after) this.builder(escapeHTMLInCSS(after));
			this.builder("}", node, "end");
		}
		body(node) {
			let proto = Stringifier.prototype;
			let expandable = [
				"atrule",
				"block",
				"body",
				"rule",
				"stringify"
			].every((method) => this[method] === proto[method]);
			let stack = [];
			pushBody(this, stack, node);
			while (stack.length > 0) {
				let entry = stack.pop();
				if (typeof entry === "function") {
					entry();
					continue;
				}
				let child = entry.node;
				let before = this.raw(child, "before");
				if (before) this.builder(entry.document ? before : escapeHTMLInCSS(before));
				if (expandable && child.type === "rule") pushBlock(this, stack, child, this.rawValue(child, "selector"));
				else if (expandable && child.type === "atrule" && child.nodes) pushBlock(this, stack, child, atruleStart(this, child));
				else this.stringify(child, entry.semicolon);
			}
		}
		comment(node) {
			let left = this.raw(node, "left", "commentLeft");
			let right = this.raw(node, "right", "commentRight");
			this.builder(escapeHTMLInCSS("/*" + left + node.text + right + "*/"), node);
		}
		decl(node, semicolon) {
			let raws = node.raws;
			let between = this.raw(node, "between", "colon");
			let string = node.prop + between + this.rawValue(node, "value");
			if (node.important) string += raws.important || " !important";
			if (semicolon) string += ";";
			this.builder(escapeHTMLInCSS(string), node);
		}
		document(node) {
			this.body(node);
		}
		raw(node, own, detect) {
			let value;
			if (!detect) detect = own;
			if (own) {
				value = node.raws[own];
				if (typeof value !== "undefined") return value;
			}
			let parent = node.parent;
			if (detect === "before") {
				if (!parent || parent.type === "root" && parent.first === node) return "";
				if (parent && parent.type === "document") return "";
			}
			if (!parent) return DEFAULT_RAW[detect];
			let root$1 = node.root();
			let cache = root$1.rawCache || (root$1.rawCache = {});
			if (typeof cache[detect] !== "undefined") return cache[detect];
			if (detect === "before" || detect === "after") return this.beforeAfter(node, detect);
			else {
				let method = "raw" + capitalize(detect);
				if (this[method]) value = this[method](root$1, node);
				else root$1.walk((i) => {
					value = i.raws[own];
					if (typeof value !== "undefined") return false;
				});
			}
			if (typeof value === "undefined") value = DEFAULT_RAW[detect];
			cache[detect] = value;
			return value;
		}
		rawBeforeClose(root$1) {
			let value;
			root$1.walk((i) => {
				if (i.nodes && i.nodes.length > 0) {
					if (typeof i.raws.after !== "undefined") {
						value = i.raws.after;
						if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
						return false;
					}
				}
			});
			if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeComment(root$1, node) {
			let value;
			root$1.walkComments((i) => {
				if (typeof i.raws.before !== "undefined") {
					value = i.raws.before;
					if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
					return false;
				}
			});
			if (typeof value === "undefined") value = this.raw(node, null, "beforeDecl");
			else if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeDecl(root$1, node) {
			let value;
			root$1.walkDecls((i) => {
				if (typeof i.raws.before !== "undefined") {
					value = i.raws.before;
					if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
					return false;
				}
			});
			if (typeof value === "undefined") value = this.raw(node, null, "beforeRule");
			else if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeOpen(root$1) {
			let value;
			root$1.walk((i) => {
				if (i.type !== "decl") {
					value = i.raws.between;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawBeforeRule(root$1) {
			let value;
			root$1.walk((i) => {
				if (i.nodes && (i.parent !== root$1 || root$1.first !== i)) {
					if (typeof i.raws.before !== "undefined") {
						value = i.raws.before;
						if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
						return false;
					}
				}
			});
			if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawColon(root$1) {
			let value;
			root$1.walkDecls((i) => {
				if (typeof i.raws.between !== "undefined") {
					value = i.raws.between.replace(/[^\s:]/g, "");
					return false;
				}
			});
			return value;
		}
		rawEmptyBody(root$1) {
			let value;
			root$1.walk((i) => {
				if (i.nodes && i.nodes.length === 0) {
					value = i.raws.after;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawIndent(root$1) {
			if (root$1.raws.indent) return root$1.raws.indent;
			let value;
			root$1.walk((i) => {
				let p = i.parent;
				if (p && p !== root$1 && p.parent && p.parent === root$1) {
					if (typeof i.raws.before !== "undefined") {
						let parts = i.raws.before.split("\n");
						value = parts[parts.length - 1];
						value = value.replace(/\S/g, "");
						return false;
					}
				}
			});
			return value;
		}
		rawSemicolon(root$1) {
			let value;
			root$1.walk((i) => {
				if (i.nodes && i.nodes.length && i.last.type === "decl") {
					value = i.raws.semicolon;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawValue(node, prop) {
			let value = node[prop];
			let raw = node.raws[prop];
			if (raw && raw.value === value) return raw.raw;
			return value;
		}
		root(node) {
			if (node.source && node.source.input.hasBOM) this.builder("﻿", node, "start");
			this.body(node);
			if (node.raws.after) {
				let after = node.raws.after;
				let isDocument = node.parent && node.parent.type === "document";
				this.builder(isDocument ? after : escapeHTMLInCSS(after));
			}
		}
		rule(node) {
			this.block(node, this.rawValue(node, "selector"));
			if (node.raws.ownSemicolon) this.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
		}
		stringify(node, semicolon) {
			/* c8 ignore start */
			if (!this[node.type]) throw new Error("Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier.");
			/* c8 ignore stop */
			this[node.type](node, semicolon);
		}
	};
	module.exports = Stringifier;
	Stringifier.default = Stringifier;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Stringifier = require_stringifier();
	function stringify(node, builder) {
		new Stringifier(builder).stringify(node);
	}
	module.exports = stringify;
	stringify.default = stringify;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.isClean = Symbol("isClean");
	module.exports.my = Symbol("my");
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let CssSyntaxError = require_css_syntax_error();
	let Stringifier = require_stringifier();
	let stringify = require_stringify();
	let { isClean, my } = require_symbols();
	function cloneNode(obj, parent) {
		let cloned = new obj.constructor();
		let stack = [[
			obj,
			cloned,
			parent
		]];
		while (stack.length > 0) {
			let [source, target, targetParent] = stack.pop();
			for (let i in source) {
				if (!Object.prototype.hasOwnProperty.call(source, i))
 /* c8 ignore next 2 */
				continue;
				if (i === "proxyCache") continue;
				let value = source[i];
				let type = typeof value;
				if (i === "parent" && type === "object") {
					if (targetParent) target[i] = targetParent;
				} else if (i === "source") target[i] = value;
				else if (Array.isArray(value)) {
					let children = [];
					target[i] = children;
					for (let j of value) {
						let childClone = new j.constructor();
						children.push(childClone);
						stack.push([
							j,
							childClone,
							target
						]);
					}
				} else {
					if (type === "object" && value !== null) {
						let valueClone = new value.constructor();
						stack.push([
							value,
							valueClone,
							void 0
						]);
						value = valueClone;
					}
					target[i] = value;
				}
			}
		}
		return cloned;
	}
	function sourceOffset(inputCSS, position) {
		if (position && typeof position.offset !== "undefined") return position.offset;
		let column = 1;
		let line = 1;
		let offset = 0;
		for (let i = 0; i < inputCSS.length; i++) {
			if (line === position.line && column === position.column) {
				offset = i;
				break;
			}
			if (inputCSS[i] === "\n") {
				column = 1;
				line += 1;
			} else column += 1;
		}
		return offset;
	}
	var Node = class Node {
		get proxyOf() {
			return this;
		}
		constructor(defaults = {}) {
			this.raws = {};
			this[isClean] = false;
			this[my] = true;
			for (let name of Object.keys(defaults)) {
				if (name === "__proto__") continue;
				if (name === "nodes") {
					this.nodes = [];
					for (let node of defaults[name]) if (typeof node.clone === "function" && node.parent) this.append(node.clone());
					else this.append(node);
				} else this[name] = defaults[name];
			}
		}
		addToError(error) {
			error.postcssNode = this;
			if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
				let s = this.source;
				error.stack = error.stack.replace(/\n\s{4}at /, `$&${s.input.from}:${s.start.line}:${s.start.column}$&`);
			}
			return error;
		}
		after(add) {
			this.parent.insertAfter(this, add);
			return this;
		}
		assign(overrides = {}) {
			for (let name in overrides) this[name] = overrides[name];
			return this;
		}
		before(add) {
			this.parent.insertBefore(this, add);
			return this;
		}
		cleanRaws(keepBetween) {
			delete this.raws.before;
			delete this.raws.after;
			if (!keepBetween) delete this.raws.between;
		}
		clone(overrides = {}) {
			let cloned = cloneNode(this);
			for (let name in overrides) cloned[name] = overrides[name];
			return cloned;
		}
		cloneAfter(overrides = {}) {
			let cloned = this.clone(overrides);
			this.parent.insertAfter(this, cloned);
			return cloned;
		}
		cloneBefore(overrides = {}) {
			let cloned = this.clone(overrides);
			this.parent.insertBefore(this, cloned);
			return cloned;
		}
		error(message, opts = {}) {
			if (this.source) {
				let { end, start } = this.rangeBy(opts);
				return this.source.input.error(message, {
					column: start.column,
					line: start.line
				}, {
					column: end.column,
					line: end.line
				}, opts);
			}
			return new CssSyntaxError(message);
		}
		getProxyProcessor() {
			return {
				get(node, prop) {
					if (prop === "proxyOf") return node;
					else if (prop === "root") return () => node.root().toProxy();
					else return node[prop];
				},
				set(node, prop, value) {
					if (node[prop] === value) return true;
					node[prop] = value;
					if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || prop === "text") node.markDirty();
					return true;
				}
			};
		}
		/* c8 ignore next 3 */
		markClean() {
			this[isClean] = true;
		}
		markDirty() {
			if (this[isClean]) {
				this[isClean] = false;
				let next = this;
				while (next = next.parent) next[isClean] = false;
			}
		}
		next() {
			if (!this.parent) return void 0;
			let index = this.parent.index(this);
			return this.parent.nodes[index + 1];
		}
		positionBy(opts = {}) {
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let pos = {
				column: this.source.start.column,
				line: this.source.start.line,
				offset: sourceOffset(inputString, this.source.start)
			};
			if (opts.index) pos = this.positionInside(opts.index);
			else if (opts.word) {
				let index = inputString.slice(sourceOffset(inputString, this.source.start), sourceOffset(inputString, this.source.end)).indexOf(opts.word);
				if (index !== -1) pos = this.positionInside(index);
			}
			return pos;
		}
		positionInside(index) {
			let column = this.source.start.column;
			let line = this.source.start.line;
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let offset = sourceOffset(inputString, this.source.start);
			let end = offset + index;
			for (let i = offset; i < end; i++) if (inputString[i] === "\n") {
				column = 1;
				line += 1;
			} else column += 1;
			return {
				column,
				line,
				offset: end
			};
		}
		prev() {
			if (!this.parent) return void 0;
			let index = this.parent.index(this);
			return this.parent.nodes[index - 1];
		}
		rangeBy(opts = {}) {
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let start = {
				column: this.source.start.column,
				line: this.source.start.line,
				offset: sourceOffset(inputString, this.source.start)
			};
			let end = this.source.end ? {
				column: this.source.end.column + 1,
				line: this.source.end.line,
				offset: typeof this.source.end.offset === "number" ? this.source.end.offset : sourceOffset(inputString, this.source.end) + 1
			} : {
				column: start.column + 1,
				line: start.line,
				offset: start.offset + 1
			};
			if (opts.word) {
				let index = inputString.slice(sourceOffset(inputString, this.source.start), sourceOffset(inputString, this.source.end)).indexOf(opts.word);
				if (index !== -1) {
					start = this.positionInside(index);
					end = this.positionInside(index + opts.word.length);
				}
			} else {
				if (opts.start) start = {
					column: opts.start.column,
					line: opts.start.line,
					offset: sourceOffset(inputString, opts.start)
				};
				else if (typeof opts.index === "number") start = this.positionInside(opts.index);
				if (opts.end) end = {
					column: opts.end.column,
					line: opts.end.line,
					offset: sourceOffset(inputString, opts.end)
				};
				else if (typeof opts.endIndex === "number") end = this.positionInside(opts.endIndex);
				else if (typeof opts.index === "number") end = this.positionInside(opts.index + 1);
			}
			if (end.line < start.line || end.line === start.line && end.column <= start.column) end = {
				column: start.column + 1,
				line: start.line,
				offset: start.offset + 1
			};
			return {
				end,
				start
			};
		}
		raw(prop, defaultType) {
			return new Stringifier().raw(this, prop, defaultType);
		}
		remove() {
			if (this.parent) this.parent.removeChild(this);
			this.parent = void 0;
			return this;
		}
		replaceWith(...nodes) {
			if (this.parent) {
				let bookmark = this;
				let foundSelf = false;
				for (let node of nodes) if (node === this) foundSelf = true;
				else if (foundSelf) {
					this.parent.insertAfter(bookmark, node);
					bookmark = node;
				} else this.parent.insertBefore(bookmark, node);
				if (!foundSelf) this.remove();
			}
			return this;
		}
		root() {
			let result = this;
			while (result.parent && result.parent.type !== "document") result = result.parent;
			return result;
		}
		toJSON(_, inputs) {
			let emitInputs = inputs == null;
			inputs = inputs || /* @__PURE__ */ new Map();
			let holderOfRoot = [];
			let queue = [[
				this,
				holderOfRoot,
				0
			]];
			for (let step = 0; step < queue.length; step++) {
				let [node, holder, key] = queue[step];
				let fixed$1 = {};
				holder[key] = fixed$1;
				for (let name in node) {
					if (!Object.prototype.hasOwnProperty.call(node, name))
 /* c8 ignore next 2 */
					continue;
					if (name === "parent" || name === "proxyCache") continue;
					let value = node[name];
					if (Array.isArray(value)) {
						let fixedArray = [];
						fixed$1[name] = fixedArray;
						for (let i = 0; i < value.length; i++) {
							let item = value[i];
							if (typeof item === "object" && item.toJSON) if (item.toJSON === Node.prototype.toJSON) queue.push([
								item,
								fixedArray,
								i
							]);
							else fixedArray[i] = item.toJSON(null, inputs);
							else fixedArray[i] = item;
						}
					} else if (typeof value === "object" && value.toJSON) if (value.toJSON === Node.prototype.toJSON) queue.push([
						value,
						fixed$1,
						name
					]);
					else fixed$1[name] = value.toJSON(null, inputs);
					else if (name === "source") {
						if (value == null) continue;
						let inputId = inputs.get(value.input);
						if (inputId == null) {
							inputId = inputs.size;
							inputs.set(value.input, inputId);
						}
						fixed$1[name] = {
							end: value.end,
							inputId,
							start: value.start
						};
					} else fixed$1[name] = value;
				}
			}
			let fixed = holderOfRoot[0];
			if (emitInputs) fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
			return fixed;
		}
		toProxy() {
			if (!this.proxyCache) this.proxyCache = new Proxy(this, this.getProxyProcessor());
			return this.proxyCache;
		}
		toString(stringifier = stringify) {
			if (stringifier.stringify) stringifier = stringifier.stringify;
			let result = "";
			stringifier(this, (i) => {
				result += i;
			});
			return result;
		}
		warn(result, text, opts = {}) {
			let data = { node: this };
			for (let i in opts) data[i] = opts[i];
			return result.warn(text, data);
		}
	};
	module.exports = Node;
	Node.default = Node;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/comment.js
var require_comment = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Node = require_node();
	var Comment = class extends Node {
		constructor(defaults) {
			super(defaults);
			this.type = "comment";
		}
	};
	module.exports = Comment;
	Comment.default = Comment;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/declaration.js
var require_declaration = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Node = require_node();
	var Declaration = class extends Node {
		get variable() {
			return this.prop.startsWith("--") || this.prop[0] === "$";
		}
		constructor(defaults) {
			if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") defaults = {
				...defaults,
				value: String(defaults.value)
			};
			super(defaults);
			this.type = "decl";
		}
	};
	module.exports = Declaration;
	Declaration.default = Declaration;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/container.js
var require_container = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Comment = require_comment();
	let Declaration = require_declaration();
	let Node = require_node();
	let { isClean, my } = require_symbols();
	let AtRule, parse, Root, Rule;
	function cleanSource(nodes) {
		let stack = nodes.slice();
		while (stack.length > 0) {
			let node = stack.pop();
			delete node.source;
			if (node.nodes) {
				node.nodes = node.nodes.slice();
				for (let i of node.nodes) stack.push(i);
			}
		}
		return nodes.slice();
	}
	function markTreeDirty(node) {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			next[isClean] = false;
			if (next.proxyOf.nodes) for (let i of next.proxyOf.nodes) stack.push(i);
		}
	}
	var Container = class Container extends Node {
		get first() {
			if (!this.proxyOf.nodes) return void 0;
			return this.proxyOf.nodes[0];
		}
		get last() {
			if (!this.proxyOf.nodes) return void 0;
			return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
		}
		append(...children) {
			for (let child of children) {
				let nodes = this.normalize(child, this.last);
				for (let node of nodes) this.proxyOf.nodes.push(node);
			}
			this.markDirty();
			return this;
		}
		cleanRaws(keepBetween) {
			let stack = [this];
			while (stack.length > 0) {
				let node = stack.pop();
				if (node !== this && node.cleanRaws !== Container.prototype.cleanRaws) {
					node.cleanRaws(keepBetween);
					continue;
				}
				Node.prototype.cleanRaws.call(node, keepBetween);
				if (node.nodes) for (let child of node.nodes) stack.push(child);
			}
		}
		each(callback) {
			if (!this.proxyOf.nodes) return void 0;
			let iterator = this.getIterator();
			let index, result;
			while (this.indexes[iterator] < this.proxyOf.nodes.length) {
				index = this.indexes[iterator];
				result = callback(this.proxyOf.nodes[index], index);
				if (result === false) break;
				this.indexes[iterator] += 1;
			}
			delete this.indexes[iterator];
			return result;
		}
		every(condition) {
			return this.nodes.every(condition);
		}
		getIterator() {
			if (!this.lastEach) this.lastEach = 0;
			if (!this.indexes) this.indexes = {};
			this.lastEach += 1;
			let iterator = this.lastEach;
			this.indexes[iterator] = 0;
			return iterator;
		}
		getProxyProcessor() {
			return {
				get(node, prop) {
					if (prop === "proxyOf") return node;
					else if (!node[prop]) return node[prop];
					else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) return (...args) => {
						return node[prop](...args.map((i) => {
							if (typeof i === "function") return (child, index) => i(child.toProxy(), index);
							else return i;
						}));
					};
					else if (prop === "every" || prop === "some") return (cb) => {
						return node[prop]((child, ...other) => cb(child.toProxy(), ...other));
					};
					else if (prop === "root") return () => node.root().toProxy();
					else if (prop === "nodes") return node.nodes.map((i) => i.toProxy());
					else if (prop === "first" || prop === "last") return node[prop].toProxy();
					else return node[prop];
				},
				set(node, prop, value) {
					if (node[prop] === value) return true;
					node[prop] = value;
					if (prop === "name" || prop === "params" || prop === "selector") node.markDirty();
					return true;
				}
			};
		}
		index(child) {
			if (typeof child === "number") return child;
			if (child.proxyOf) child = child.proxyOf;
			return this.proxyOf.nodes.indexOf(child);
		}
		insertAfter(exist, add) {
			let existIndex = this.index(exist);
			let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
			existIndex = this.index(exist);
			for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (existIndex < index) this.indexes[id] = index + nodes.length;
			}
			this.markDirty();
			return this;
		}
		insertBefore(exist, add) {
			let existIndex = this.index(exist);
			let type = existIndex === 0 ? "prepend" : false;
			let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
			existIndex = this.index(exist);
			for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (existIndex <= index) this.indexes[id] = index + nodes.length;
			}
			this.markDirty();
			return this;
		}
		normalize(nodes, sample) {
			if (typeof nodes === "string") nodes = cleanSource(parse(nodes).nodes);
			else if (typeof nodes === "undefined") nodes = [];
			else if (Array.isArray(nodes)) {
				nodes = nodes.slice(0);
				for (let i of nodes) if (i.parent) i.parent.removeChild(i, "ignore");
			} else if (nodes.type === "root" && this.type !== "document") {
				nodes = nodes.nodes.slice(0);
				for (let i of nodes) if (i.parent) i.parent.removeChild(i, "ignore");
			} else if (nodes.type) nodes = [nodes];
			else if (nodes.prop) {
				if (typeof nodes.value === "undefined") throw new Error("Value field is missed in node creation");
				else if (typeof nodes.value !== "string") nodes.value = String(nodes.value);
				nodes = [new Declaration(nodes)];
			} else if (nodes.selector || nodes.selectors) nodes = [new Rule(nodes)];
			else if (nodes.name) nodes = [new AtRule(nodes)];
			else if (nodes.text) nodes = [new Comment(nodes)];
			else throw new Error("Unknown node type in node creation");
			return nodes.map((i) => {
				/* c8 ignore next */
				if (!i[my]) Container.rebuild(i);
				i = i.proxyOf;
				if (i.parent) i.parent.removeChild(i);
				if (i[isClean]) markTreeDirty(i);
				if (!i.raws) i.raws = {};
				if (typeof i.raws.before === "undefined") {
					if (sample && typeof sample.raws.before !== "undefined") i.raws.before = sample.raws.before.replace(/\S/g, "");
				}
				i.parent = this.proxyOf;
				return i;
			});
		}
		prepend(...children) {
			children = children.reverse();
			for (let child of children) {
				let nodes = this.normalize(child, this.first, "prepend").reverse();
				for (let node of nodes) this.proxyOf.nodes.unshift(node);
				for (let id in this.indexes) this.indexes[id] = this.indexes[id] + nodes.length;
			}
			this.markDirty();
			return this;
		}
		push(child) {
			child.parent = this;
			this.proxyOf.nodes.push(child);
			return this;
		}
		removeAll() {
			for (let node of this.proxyOf.nodes) node.parent = void 0;
			this.proxyOf.nodes = [];
			this.markDirty();
			return this;
		}
		removeChild(child) {
			child = this.index(child);
			this.proxyOf.nodes[child].parent = void 0;
			this.proxyOf.nodes.splice(child, 1);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (index >= child) this.indexes[id] = index - 1;
			}
			this.markDirty();
			return this;
		}
		replaceValues(pattern, opts, callback) {
			if (!callback) {
				callback = opts;
				opts = {};
			}
			this.walkDecls((decl$1) => {
				if (opts.props && !opts.props.includes(decl$1.prop)) return;
				if (opts.fast && !decl$1.value.includes(opts.fast)) return;
				decl$1.value = decl$1.value.replace(pattern, callback);
			});
			this.markDirty();
			return this;
		}
		some(condition) {
			return this.nodes.some(condition);
		}
		walk(callback) {
			if (!this.proxyOf.nodes) return void 0;
			let stack = [{
				iterator: this.getIterator(),
				node: this.proxyOf
			}];
			while (stack.length > 0) {
				let { iterator, node } = stack[stack.length - 1];
				let index = node.indexes[iterator];
				if (index >= node.proxyOf.nodes.length) {
					delete node.indexes[iterator];
					stack.pop();
					let parent = stack[stack.length - 1];
					if (parent) parent.node.indexes[parent.iterator] += 1;
					continue;
				}
				let child = node.proxyOf.nodes[index];
				let result;
				try {
					result = callback(child, index);
				} catch (e) {
					throw child.addToError(e);
				}
				if (result === false) {
					for (let opened of stack) delete opened.node.indexes[opened.iterator];
					return false;
				}
				if (child.walk && child.proxyOf.nodes) stack.push({
					iterator: child.getIterator(),
					node: child
				});
				else node.indexes[iterator] += 1;
			}
		}
		walkAtRules(name, callback) {
			if (!callback) {
				callback = name;
				return this.walk((child, i) => {
					if (child.type === "atrule") return callback(child, i);
				});
			}
			if (name instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "atrule" && name.test(child.name)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "atrule" && child.name === name) return callback(child, i);
			});
		}
		walkComments(callback) {
			return this.walk((child, i) => {
				if (child.type === "comment") return callback(child, i);
			});
		}
		walkDecls(prop, callback) {
			if (!callback) {
				callback = prop;
				return this.walk((child, i) => {
					if (child.type === "decl") return callback(child, i);
				});
			}
			if (prop instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "decl" && prop.test(child.prop)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "decl" && child.prop === prop) return callback(child, i);
			});
		}
		walkRules(selector, callback) {
			if (!callback) {
				callback = selector;
				return this.walk((child, i) => {
					if (child.type === "rule") return callback(child, i);
				});
			}
			if (selector instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "rule" && selector.test(child.selector)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "rule" && child.selector === selector) return callback(child, i);
			});
		}
	};
	Container.registerParse = (dependant) => {
		parse = dependant;
	};
	Container.registerRule = (dependant) => {
		Rule = dependant;
	};
	Container.registerAtRule = (dependant) => {
		AtRule = dependant;
	};
	Container.registerRoot = (dependant) => {
		Root = dependant;
	};
	module.exports = Container;
	Container.default = Container;
	/* c8 ignore start */
	Container.rebuild = (node) => {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			if (next.type === "atrule") Object.setPrototypeOf(next, AtRule.prototype);
			else if (next.type === "rule") Object.setPrototypeOf(next, Rule.prototype);
			else if (next.type === "decl") Object.setPrototypeOf(next, Declaration.prototype);
			else if (next.type === "comment") Object.setPrototypeOf(next, Comment.prototype);
			else if (next.type === "root") Object.setPrototypeOf(next, Root.prototype);
			next[my] = true;
			if (next.nodes) for (let child of next.nodes) stack.push(child);
		}
	};
}));
/* c8 ignore stop */

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/at-rule.js
var require_at_rule = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	var AtRule = class extends Container {
		constructor(defaults) {
			super(defaults);
			this.type = "atrule";
		}
		append(...children) {
			if (!this.proxyOf.nodes) this.nodes = [];
			return super.append(...children);
		}
		prepend(...children) {
			if (!this.proxyOf.nodes) this.nodes = [];
			return super.prepend(...children);
		}
	};
	module.exports = AtRule;
	AtRule.default = AtRule;
	Container.registerAtRule(AtRule);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/document.js
var require_document = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let LazyResult, Processor;
	var Document = class extends Container {
		constructor(defaults) {
			super({
				type: "document",
				...defaults
			});
			if (!this.nodes) this.nodes = [];
		}
		toResult(opts = {}) {
			return new LazyResult(new Processor(), this, opts).stringify();
		}
	};
	Document.registerLazyResult = (dependant) => {
		LazyResult = dependant;
	};
	Document.registerProcessor = (dependant) => {
		Processor = dependant;
	};
	module.exports = Document;
	Document.default = Document;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
	/**
	* Encode an integer in the range of 0 to 63 to a single base 64 digit.
	*/
	exports.encode = function(number) {
		if (0 <= number && number < intToCharMap.length) return intToCharMap[number];
		throw new TypeError("Must be between 0 and 63: " + number);
	};
	/**
	* Decode a single base 64 character code digit to an integer. Returns -1 on
	* failure.
	*/
	exports.decode = function(charCode) {
		var bigA = 65;
		var bigZ = 90;
		var littleA = 97;
		var littleZ = 122;
		var zero = 48;
		var nine = 57;
		var plus = 43;
		var slash = 47;
		var littleOffset = 26;
		var numberOffset = 52;
		if (bigA <= charCode && charCode <= bigZ) return charCode - bigA;
		if (littleA <= charCode && charCode <= littleZ) return charCode - littleA + littleOffset;
		if (zero <= charCode && charCode <= nine) return charCode - zero + numberOffset;
		if (charCode == plus) return 62;
		if (charCode == slash) return 63;
		return -1;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/base64-vlq.js
var require_base64_vlq = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64 = require_base64();
	var VLQ_BASE_SHIFT = 5;
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	/**
	* Converts from a two-complement value to a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	*   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	*/
	function toVLQSigned(aValue) {
		return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
	}
	/**
	* Converts to a two-complement value from a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	*   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	*/
	function fromVLQSigned(aValue) {
		var isNegative = (aValue & 1) === 1;
		var shifted = aValue >> 1;
		return isNegative ? -shifted : shifted;
	}
	/**
	* Returns the base 64 VLQ encoded value.
	*/
	exports.encode = function base64VLQ_encode(aValue) {
		var encoded = "";
		var digit;
		var vlq = toVLQSigned(aValue);
		do {
			digit = vlq & VLQ_BASE_MASK;
			vlq >>>= VLQ_BASE_SHIFT;
			if (vlq > 0) digit |= VLQ_CONTINUATION_BIT;
			encoded += base64.encode(digit);
		} while (vlq > 0);
		return encoded;
	};
	/**
	* Decodes the next base 64 VLQ value from the given string and returns the
	* value and the rest of the string via the out parameter.
	*/
	exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
		var strLen = aStr.length;
		var result = 0;
		var shift = 0;
		var continuation, digit;
		do {
			if (aIndex >= strLen) throw new Error("Expected more digits in base 64 VLQ value.");
			digit = base64.decode(aStr.charCodeAt(aIndex++));
			if (digit === -1) throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
			continuation = !!(digit & VLQ_CONTINUATION_BIT);
			digit &= VLQ_BASE_MASK;
			result = result + (digit << shift);
			shift += VLQ_BASE_SHIFT;
		} while (continuation);
		aOutParam.value = fromVLQSigned(result);
		aOutParam.rest = aIndex;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* This is a helper function for getting values from parameter/options
	* objects.
	*
	* @param args The object we are extracting values from
	* @param name The name of the property we are getting.
	* @param defaultValue An optional value to return if the property is missing
	* from the object. If this is not specified and the property is missing, an
	* error will be thrown.
	*/
	function getArg(aArgs, aName, aDefaultValue) {
		if (aName in aArgs) return aArgs[aName];
		else if (arguments.length === 3) return aDefaultValue;
		else throw new Error("\"" + aName + "\" is a required argument.");
	}
	exports.getArg = getArg;
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	function urlParse(aUrl) {
		var match = aUrl.match(urlRegexp);
		if (!match) return null;
		return {
			scheme: match[1],
			auth: match[2],
			host: match[3],
			port: match[4],
			path: match[5]
		};
	}
	exports.urlParse = urlParse;
	function urlGenerate(aParsedUrl) {
		var url = "";
		if (aParsedUrl.scheme) url += aParsedUrl.scheme + ":";
		url += "//";
		if (aParsedUrl.auth) url += aParsedUrl.auth + "@";
		if (aParsedUrl.host) url += aParsedUrl.host;
		if (aParsedUrl.port) url += ":" + aParsedUrl.port;
		if (aParsedUrl.path) url += aParsedUrl.path;
		return url;
	}
	exports.urlGenerate = urlGenerate;
	var MAX_CACHED_INPUTS = 32;
	/**
	* Takes some function `f(input) -> result` and returns a memoized version of
	* `f`.
	*
	* We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
	* memoization is a dumb-simple, linear least-recently-used cache.
	*/
	function lruMemoize(f) {
		var cache = [];
		return function(input) {
			for (var i = 0; i < cache.length; i++) if (cache[i].input === input) {
				var temp = cache[0];
				cache[0] = cache[i];
				cache[i] = temp;
				return cache[0].result;
			}
			var result = f(input);
			cache.unshift({
				input,
				result
			});
			if (cache.length > MAX_CACHED_INPUTS) cache.pop();
			return result;
		};
	}
	/**
	* Normalizes a path, or the path portion of a URL:
	*
	* - Replaces consecutive slashes with one slash.
	* - Removes unnecessary '.' parts.
	* - Removes unnecessary '<dir>/..' parts.
	*
	* Based on code in the Node.js 'path' core module.
	*
	* @param aPath The path or url to normalize.
	*/
	var normalize = lruMemoize(function normalize(aPath) {
		var path = aPath;
		var url = urlParse(aPath);
		if (url) {
			if (!url.path) return aPath;
			path = url.path;
		}
		var isAbsolute$3 = exports.isAbsolute(path);
		var parts = [];
		var start = 0;
		var i = 0;
		while (true) {
			start = i;
			i = path.indexOf("/", start);
			if (i === -1) {
				parts.push(path.slice(start));
				break;
			} else {
				parts.push(path.slice(start, i));
				while (i < path.length && path[i] === "/") i++;
			}
		}
		for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
			part = parts[i];
			if (part === ".") parts.splice(i, 1);
			else if (part === "..") up++;
			else if (up > 0) if (part === "") {
				parts.splice(i + 1, up);
				up = 0;
			} else {
				parts.splice(i, 2);
				up--;
			}
		}
		path = parts.join("/");
		if (path === "") path = isAbsolute$3 ? "/" : ".";
		if (url) {
			url.path = path;
			return urlGenerate(url);
		}
		return path;
	});
	exports.normalize = normalize;
	/**
	* Joins two paths/URLs.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be joined with the root.
	*
	* - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	*   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	*   first.
	* - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	*   is updated with the result and aRoot is returned. Otherwise the result
	*   is returned.
	*   - If aPath is absolute, the result is aPath.
	*   - Otherwise the two paths are joined with a slash.
	* - Joining for example 'http://' and 'www.example.com' is also supported.
	*/
	function join(aRoot, aPath) {
		if (aRoot === "") aRoot = ".";
		if (aPath === "") aPath = ".";
		var aPathUrl = urlParse(aPath);
		var aRootUrl = urlParse(aRoot);
		if (aRootUrl) aRoot = aRootUrl.path || "/";
		if (aPathUrl && !aPathUrl.scheme) {
			if (aRootUrl) aPathUrl.scheme = aRootUrl.scheme;
			return urlGenerate(aPathUrl);
		}
		if (aPathUrl || aPath.match(dataUrlRegexp)) return aPath;
		if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
			aRootUrl.host = aPath;
			return urlGenerate(aRootUrl);
		}
		var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
		if (aRootUrl) {
			aRootUrl.path = joined;
			return urlGenerate(aRootUrl);
		}
		return joined;
	}
	exports.join = join;
	exports.isAbsolute = function(aPath) {
		return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
	};
	/**
	* Make a path relative to a URL or another path.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be made relative to aRoot.
	*/
	function relative(aRoot, aPath) {
		if (aRoot === "") aRoot = ".";
		aRoot = aRoot.replace(/\/$/, "");
		var level = 0;
		while (aPath.indexOf(aRoot + "/") !== 0) {
			var index = aRoot.lastIndexOf("/");
			if (index < 0) return aPath;
			aRoot = aRoot.slice(0, index);
			if (aRoot.match(/^([^\/]+:\/)?\/*$/)) return aPath;
			++level;
		}
		return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	var supportsNullProto = function() {
		return !("__proto__" in Object.create(null));
	}();
	function identity(s) {
		return s;
	}
	/**
	* Because behavior goes wacky when you set `__proto__` on objects, we
	* have to prefix all the strings in our set with an arbitrary character.
	*
	* See https://github.com/mozilla/source-map/pull/31 and
	* https://github.com/mozilla/source-map/issues/30
	*
	* @param String aStr
	*/
	function toSetString(aStr) {
		if (isProtoString(aStr)) return "$" + aStr;
		return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	function fromSetString(aStr) {
		if (isProtoString(aStr)) return aStr.slice(1);
		return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	function isProtoString(s) {
		if (!s) return false;
		var length = s.length;
		if (length < 9) return false;
		if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) return false;
		for (var i = length - 10; i >= 0; i--) if (s.charCodeAt(i) !== 36) return false;
		return true;
	}
	/**
	* Comparator between two mappings where the original positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same original source/line/column, but different generated
	* line and column the same. Useful when searching for a mapping with a
	* stubbed out mapping.
	*/
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
		var cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0 || onlyCompareOriginal) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
		var cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0 || onlyCompareOriginal) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
	/**
	* Comparator between two mappings with deflated source and name indices where
	* the generated positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same generated line and column, but different
	* source/name/original line and column the same. Useful when searching for a
	* mapping with a stubbed out mapping.
	*/
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
		var cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0 || onlyCompareGenerated) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
		var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0 || onlyCompareGenerated) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
	function strcmp(aStr1, aStr2) {
		if (aStr1 === aStr2) return 0;
		if (aStr1 === null) return 1;
		if (aStr2 === null) return -1;
		if (aStr1 > aStr2) return 1;
		return -1;
	}
	/**
	* Comparator between two mappings with inflated source and name strings where
	* the generated positions are compared.
	*/
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
		var cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	/**
	* Strip any JSON XSSI avoidance prefix from the string (as documented
	* in the source maps specification), and then parse the string as
	* JSON.
	*/
	function parseSourceMapInput(str) {
		return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	/**
	* Compute the URL of a source given the the source root, the source's
	* URL, and the source map's URL.
	*/
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
		sourceURL = sourceURL || "";
		if (sourceRoot) {
			if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") sourceRoot += "/";
			sourceURL = sourceRoot + sourceURL;
		}
		if (sourceMapURL) {
			var parsed = urlParse(sourceMapURL);
			if (!parsed) throw new Error("sourceMapURL could not be parsed");
			if (parsed.path) {
				var index = parsed.path.lastIndexOf("/");
				if (index >= 0) parsed.path = parsed.path.substring(0, index + 1);
			}
			sourceURL = join(urlGenerate(parsed), sourceURL);
		}
		return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/array-set.js
var require_array_set = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	/**
	* A data structure which is a combination of an array and a set. Adding a new
	* member is O(1), testing for membership is O(1), and finding the index of an
	* element is O(1). Removing elements from the set is not supported. Only
	* strings are supported for membership.
	*/
	function ArraySet() {
		this._array = [];
		this._set = hasNativeMap ? /* @__PURE__ */ new Map() : Object.create(null);
	}
	/**
	* Static method for creating ArraySet instances from an existing array.
	*/
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
		var set = new ArraySet();
		for (var i = 0, len = aArray.length; i < len; i++) set.add(aArray[i], aAllowDuplicates);
		return set;
	};
	/**
	* Return how many unique items are in this ArraySet. If duplicates have been
	* added, than those do not count towards the size.
	*
	* @returns Number
	*/
	ArraySet.prototype.size = function ArraySet_size() {
		return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	/**
	* Add the given string to this set.
	*
	* @param String aStr
	*/
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
		var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
		var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
		var idx = this._array.length;
		if (!isDuplicate || aAllowDuplicates) this._array.push(aStr);
		if (!isDuplicate) if (hasNativeMap) this._set.set(aStr, idx);
		else this._set[sStr] = idx;
	};
	/**
	* Is the given string a member of this set?
	*
	* @param String aStr
	*/
	ArraySet.prototype.has = function ArraySet_has(aStr) {
		if (hasNativeMap) return this._set.has(aStr);
		else {
			var sStr = util.toSetString(aStr);
			return has.call(this._set, sStr);
		}
	};
	/**
	* What is the index of the given string in the array?
	*
	* @param String aStr
	*/
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
		if (hasNativeMap) {
			var idx = this._set.get(aStr);
			if (idx >= 0) return idx;
		} else {
			var sStr = util.toSetString(aStr);
			if (has.call(this._set, sStr)) return this._set[sStr];
		}
		throw new Error("\"" + aStr + "\" is not in the set.");
	};
	/**
	* What is the element at the given index?
	*
	* @param Number aIdx
	*/
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
		if (aIdx >= 0 && aIdx < this._array.length) return this._array[aIdx];
		throw new Error("No element indexed by " + aIdx);
	};
	/**
	* Returns the array representation of this set (which has the proper indices
	* indicated by indexOf). Note that this is a copy of the internal array used
	* for storing the members so that no one can mess with internal state.
	*/
	ArraySet.prototype.toArray = function ArraySet_toArray() {
		return this._array.slice();
	};
	exports.ArraySet = ArraySet;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/mapping-list.js
var require_mapping_list = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	/**
	* Determine whether mappingB is after mappingA with respect to generated
	* position.
	*/
	function generatedPositionAfter(mappingA, mappingB) {
		var lineA = mappingA.generatedLine;
		var lineB = mappingB.generatedLine;
		var columnA = mappingA.generatedColumn;
		var columnB = mappingB.generatedColumn;
		return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	/**
	* A data structure to provide a sorted view of accumulated mappings in a
	* performance conscious manner. It trades a neglibable overhead in general
	* case for a large speedup in case of mappings being added in order.
	*/
	function MappingList() {
		this._array = [];
		this._sorted = true;
		this._last = {
			generatedLine: -1,
			generatedColumn: 0
		};
	}
	/**
	* Iterate through internal items. This method takes the same arguments that
	* `Array.prototype.forEach` takes.
	*
	* NOTE: The order of the mappings is NOT guaranteed.
	*/
	MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
		this._array.forEach(aCallback, aThisArg);
	};
	/**
	* Add the given source mapping.
	*
	* @param Object aMapping
	*/
	MappingList.prototype.add = function MappingList_add(aMapping) {
		if (generatedPositionAfter(this._last, aMapping)) {
			this._last = aMapping;
			this._array.push(aMapping);
		} else {
			this._sorted = false;
			this._array.push(aMapping);
		}
	};
	/**
	* Returns the flat, sorted array of mappings. The mappings are sorted by
	* generated position.
	*
	* WARNING: This method returns internal data without copying, for
	* performance. The return value must NOT be mutated, and should be treated as
	* an immutable borrow. If you want to take ownership, you must make your own
	* copy.
	*/
	MappingList.prototype.toArray = function MappingList_toArray() {
		if (!this._sorted) {
			this._array.sort(util.compareByGeneratedPositionsInflated);
			this._sorted = true;
		}
		return this._array;
	};
	exports.MappingList = MappingList;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/source-map-generator.js
var require_source_map_generator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64VLQ = require_base64_vlq();
	var util = require_util();
	var ArraySet = require_array_set().ArraySet;
	var MappingList = require_mapping_list().MappingList;
	/**
	* An instance of the SourceMapGenerator represents a source map which is
	* being built incrementally. You may pass an object with the following
	* properties:
	*
	*   - file: The filename of the generated source.
	*   - sourceRoot: A root for all relative URLs in this source map.
	*/
	function SourceMapGenerator(aArgs) {
		if (!aArgs) aArgs = {};
		this._file = util.getArg(aArgs, "file", null);
		this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
		this._skipValidation = util.getArg(aArgs, "skipValidation", false);
		this._ignoreInvalidMapping = util.getArg(aArgs, "ignoreInvalidMapping", false);
		this._sources = new ArraySet();
		this._names = new ArraySet();
		this._mappings = new MappingList();
		this._sourcesContents = null;
	}
	SourceMapGenerator.prototype._version = 3;
	/**
	* Creates a new SourceMapGenerator based on a SourceMapConsumer
	*
	* @param aSourceMapConsumer The SourceMap.
	*/
	SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
		var sourceRoot = aSourceMapConsumer.sourceRoot;
		var generator = new SourceMapGenerator(Object.assign(generatorOps || {}, {
			file: aSourceMapConsumer.file,
			sourceRoot
		}));
		aSourceMapConsumer.eachMapping(function(mapping) {
			var newMapping = { generated: {
				line: mapping.generatedLine,
				column: mapping.generatedColumn
			} };
			if (mapping.source != null) {
				newMapping.source = mapping.source;
				if (sourceRoot != null) newMapping.source = util.relative(sourceRoot, newMapping.source);
				newMapping.original = {
					line: mapping.originalLine,
					column: mapping.originalColumn
				};
				if (mapping.name != null) newMapping.name = mapping.name;
			}
			generator.addMapping(newMapping);
		});
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var sourceRelative = sourceFile;
			if (sourceRoot !== null) sourceRelative = util.relative(sourceRoot, sourceFile);
			if (!generator._sources.has(sourceRelative)) generator._sources.add(sourceRelative);
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) generator.setSourceContent(sourceFile, content);
		});
		return generator;
	};
	/**
	* Add a single mapping from original source line and column to the generated
	* source's line and column for this source map being created. The mapping
	* object should have the following properties:
	*
	*   - generated: An object with the generated line and column positions.
	*   - original: An object with the original line and column positions.
	*   - source: The original source file (relative to the sourceRoot).
	*   - name: An optional original token name for this mapping.
	*/
	SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
		var generated = util.getArg(aArgs, "generated");
		var original = util.getArg(aArgs, "original", null);
		var source = util.getArg(aArgs, "source", null);
		var name = util.getArg(aArgs, "name", null);
		if (!this._skipValidation) {
			if (this._validateMapping(generated, original, source, name) === false) return;
		}
		if (source != null) {
			source = String(source);
			if (!this._sources.has(source)) this._sources.add(source);
		}
		if (name != null) {
			name = String(name);
			if (!this._names.has(name)) this._names.add(name);
		}
		this._mappings.add({
			generatedLine: generated.line,
			generatedColumn: generated.column,
			originalLine: original != null && original.line,
			originalColumn: original != null && original.column,
			source,
			name
		});
	};
	/**
	* Set the source content for a source file.
	*/
	SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
		var source = aSourceFile;
		if (this._sourceRoot != null) source = util.relative(this._sourceRoot, source);
		if (aSourceContent != null) {
			if (!this._sourcesContents) this._sourcesContents = Object.create(null);
			this._sourcesContents[util.toSetString(source)] = aSourceContent;
		} else if (this._sourcesContents) {
			delete this._sourcesContents[util.toSetString(source)];
			if (Object.keys(this._sourcesContents).length === 0) this._sourcesContents = null;
		}
	};
	/**
	* Applies the mappings of a sub-source-map for a specific source file to the
	* source map being generated. Each mapping to the supplied source file is
	* rewritten using the supplied source map. Note: The resolution for the
	* resulting mappings is the minimium of this map and the supplied map.
	*
	* @param aSourceMapConsumer The source map to be applied.
	* @param aSourceFile Optional. The filename of the source file.
	*        If omitted, SourceMapConsumer's file property will be used.
	* @param aSourceMapPath Optional. The dirname of the path to the source map
	*        to be applied. If relative, it is relative to the SourceMapConsumer.
	*        This parameter is needed when the two source maps aren't in the same
	*        directory, and the source map to be applied contains relative source
	*        paths. If so, those relative source paths need to be rewritten
	*        relative to the SourceMapGenerator.
	*/
	SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
		var sourceFile = aSourceFile;
		if (aSourceFile == null) {
			if (aSourceMapConsumer.file == null) throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's \"file\" property. Both were omitted.");
			sourceFile = aSourceMapConsumer.file;
		}
		var sourceRoot = this._sourceRoot;
		if (sourceRoot != null) sourceFile = util.relative(sourceRoot, sourceFile);
		var newSources = new ArraySet();
		var newNames = new ArraySet();
		this._mappings.unsortedForEach(function(mapping) {
			if (mapping.source === sourceFile && mapping.originalLine != null) {
				var original = aSourceMapConsumer.originalPositionFor({
					line: mapping.originalLine,
					column: mapping.originalColumn
				});
				if (original.source != null) {
					mapping.source = original.source;
					if (aSourceMapPath != null) mapping.source = util.join(aSourceMapPath, mapping.source);
					if (sourceRoot != null) mapping.source = util.relative(sourceRoot, mapping.source);
					mapping.originalLine = original.line;
					mapping.originalColumn = original.column;
					if (original.name != null) mapping.name = original.name;
				}
			}
			var source = mapping.source;
			if (source != null && !newSources.has(source)) newSources.add(source);
			var name = mapping.name;
			if (name != null && !newNames.has(name)) newNames.add(name);
		}, this);
		this._sources = newSources;
		this._names = newNames;
		aSourceMapConsumer.sources.forEach(function(sourceFile$1) {
			var content = aSourceMapConsumer.sourceContentFor(sourceFile$1);
			if (content != null) {
				if (aSourceMapPath != null) sourceFile$1 = util.join(aSourceMapPath, sourceFile$1);
				if (sourceRoot != null) sourceFile$1 = util.relative(sourceRoot, sourceFile$1);
				this.setSourceContent(sourceFile$1, content);
			}
		}, this);
	};
	/**
	* A mapping can have one of the three levels of data:
	*
	*   1. Just the generated position.
	*   2. The Generated position, original position, and original source.
	*   3. Generated and original position, original source, as well as a name
	*      token.
	*
	* To maintain consistency, we validate that any new mapping being added falls
	* in to one of these categories.
	*/
	SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
		if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
			var message = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
			if (this._ignoreInvalidMapping) {
				if (typeof console !== "undefined" && console.warn) console.warn(message);
				return false;
			} else throw new Error(message);
		}
		if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) return;
		else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) return;
		else {
			var message = "Invalid mapping: " + JSON.stringify({
				generated: aGenerated,
				source: aSource,
				original: aOriginal,
				name: aName
			});
			if (this._ignoreInvalidMapping) {
				if (typeof console !== "undefined" && console.warn) console.warn(message);
				return false;
			} else throw new Error(message);
		}
	};
	/**
	* Serialize the accumulated mappings in to the stream of base 64 VLQs
	* specified by the source map format.
	*/
	SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
		var previousGeneratedColumn = 0;
		var previousGeneratedLine = 1;
		var previousOriginalColumn = 0;
		var previousOriginalLine = 0;
		var previousName = 0;
		var previousSource = 0;
		var result = "";
		var next;
		var mapping;
		var nameIdx;
		var sourceIdx;
		var mappings = this._mappings.toArray();
		for (var i = 0, len = mappings.length; i < len; i++) {
			mapping = mappings[i];
			next = "";
			if (mapping.generatedLine !== previousGeneratedLine) {
				previousGeneratedColumn = 0;
				while (mapping.generatedLine !== previousGeneratedLine) {
					next += ";";
					previousGeneratedLine++;
				}
			} else if (i > 0) {
				if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) continue;
				next += ",";
			}
			next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
			previousGeneratedColumn = mapping.generatedColumn;
			if (mapping.source != null) {
				sourceIdx = this._sources.indexOf(mapping.source);
				next += base64VLQ.encode(sourceIdx - previousSource);
				previousSource = sourceIdx;
				next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
				previousOriginalLine = mapping.originalLine - 1;
				next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
				previousOriginalColumn = mapping.originalColumn;
				if (mapping.name != null) {
					nameIdx = this._names.indexOf(mapping.name);
					next += base64VLQ.encode(nameIdx - previousName);
					previousName = nameIdx;
				}
			}
			result += next;
		}
		return result;
	};
	SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
		return aSources.map(function(source) {
			if (!this._sourcesContents) return null;
			if (aSourceRoot != null) source = util.relative(aSourceRoot, source);
			var key = util.toSetString(source);
			return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
		}, this);
	};
	/**
	* Externalize the source map.
	*/
	SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
		var map = {
			version: this._version,
			sources: this._sources.toArray(),
			names: this._names.toArray(),
			mappings: this._serializeMappings()
		};
		if (this._file != null) map.file = this._file;
		if (this._sourceRoot != null) map.sourceRoot = this._sourceRoot;
		if (this._sourcesContents) map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
		return map;
	};
	/**
	* Render the source map being generated to a string.
	*/
	SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
		return JSON.stringify(this.toJSON());
	};
	exports.SourceMapGenerator = SourceMapGenerator;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/binary-search.js
var require_binary_search = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	/**
	* Recursive implementation of binary search.
	*
	* @param aLow Indices here and lower do not contain the needle.
	* @param aHigh Indices here and higher do not contain the needle.
	* @param aNeedle The element being searched for.
	* @param aHaystack The non-empty array being searched.
	* @param aCompare Function which takes two elements and returns -1, 0, or 1.
	* @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	*     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*/
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
		var mid = Math.floor((aHigh - aLow) / 2) + aLow;
		var cmp = aCompare(aNeedle, aHaystack[mid], true);
		if (cmp === 0) return mid;
		else if (cmp > 0) {
			if (aHigh - mid > 1) return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
			if (aBias == exports.LEAST_UPPER_BOUND) return aHigh < aHaystack.length ? aHigh : -1;
			else return mid;
		} else {
			if (mid - aLow > 1) return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
			if (aBias == exports.LEAST_UPPER_BOUND) return mid;
			else return aLow < 0 ? -1 : aLow;
		}
	}
	/**
	* This is an implementation of binary search which will always try and return
	* the index of the closest element if there is no exact hit. This is because
	* mappings between original and generated line/col pairs are single points,
	* and there is an implicit region between each of them, so a miss just means
	* that you aren't on the very start of a region.
	*
	* @param aNeedle The element you are looking for.
	* @param aHaystack The array that is being searched.
	* @param aCompare A function which takes the needle and an element in the
	*     array and returns -1, 0, or 1 depending on whether the needle is less
	*     than, equal to, or greater than the element, respectively.
	* @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	*     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	*/
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
		if (aHaystack.length === 0) return -1;
		var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
		if (index < 0) return -1;
		while (index - 1 >= 0) {
			if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) break;
			--index;
		}
		return index;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/quick-sort.js
var require_quick_sort = /* @__PURE__ */ __commonJSMin(((exports) => {
	function SortTemplate(comparator) {
		/**
		* Swap the elements indexed by `x` and `y` in the array `ary`.
		*
		* @param {Array} ary
		*        The array.
		* @param {Number} x
		*        The index of the first item.
		* @param {Number} y
		*        The index of the second item.
		*/
		function swap(ary, x, y) {
			var temp = ary[x];
			ary[x] = ary[y];
			ary[y] = temp;
		}
		/**
		* Returns a random integer within the range `low .. high` inclusive.
		*
		* @param {Number} low
		*        The lower bound on the range.
		* @param {Number} high
		*        The upper bound on the range.
		*/
		function randomIntInRange(low, high) {
			return Math.round(low + Math.random() * (high - low));
		}
		/**
		* The Quick Sort algorithm.
		*
		* @param {Array} ary
		*        An array to sort.
		* @param {function} comparator
		*        Function to use to compare two items.
		* @param {Number} p
		*        Start index of the array
		* @param {Number} r
		*        End index of the array
		*/
		function doQuickSort(ary, comparator$1, p, r) {
			if (p < r) {
				var pivotIndex = randomIntInRange(p, r);
				var i = p - 1;
				swap(ary, pivotIndex, r);
				var pivot = ary[r];
				for (var j = p; j < r; j++) if (comparator$1(ary[j], pivot, false) <= 0) {
					i += 1;
					swap(ary, i, j);
				}
				swap(ary, i + 1, j);
				var q = i + 1;
				doQuickSort(ary, comparator$1, p, q - 1);
				doQuickSort(ary, comparator$1, q + 1, r);
			}
		}
		return doQuickSort;
	}
	function cloneSort(comparator) {
		let template = SortTemplate.toString();
		return new Function(`return ${template}`)()(comparator);
	}
	/**
	* Sort the given array in-place with the given comparator function.
	*
	* @param {Array} ary
	*        An array to sort.
	* @param {function} comparator
	*        Function to use to compare two items.
	*/
	let sortCache = /* @__PURE__ */ new WeakMap();
	exports.quickSort = function(ary, comparator, start = 0) {
		let doQuickSort = sortCache.get(comparator);
		if (doQuickSort === void 0) {
			doQuickSort = cloneSort(comparator);
			sortCache.set(comparator, doQuickSort);
		}
		doQuickSort(ary, comparator, start, ary.length - 1);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/source-map-consumer.js
var require_source_map_consumer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	var binarySearch = require_binary_search();
	var ArraySet = require_array_set().ArraySet;
	var base64VLQ = require_base64_vlq();
	var quickSort = require_quick_sort().quickSort;
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
		return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	};
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	SourceMapConsumer.prototype._version = 3;
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
		configurable: true,
		enumerable: true,
		get: function() {
			if (!this.__generatedMappings) this._parseMappings(this._mappings, this.sourceRoot);
			return this.__generatedMappings;
		}
	});
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
		configurable: true,
		enumerable: true,
		get: function() {
			if (!this.__originalMappings) this._parseMappings(this._mappings, this.sourceRoot);
			return this.__originalMappings;
		}
	});
	SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
		var c = aStr.charAt(index);
		return c === ";" || c === ",";
	};
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		throw new Error("Subclasses must implement _parseMappings");
	};
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	/**
	* Iterate over each mapping between an original source/line/column and a
	* generated line/column in this source map.
	*
	* @param Function aCallback
	*        The function that is called with each mapping.
	* @param Object aContext
	*        Optional. If specified, this object will be the value of `this` every
	*        time that `aCallback` is called.
	* @param aOrder
	*        Either `SourceMapConsumer.GENERATED_ORDER` or
	*        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	*        iterate over the mappings sorted by the generated file's line/column
	*        order or the original's source/line/column order, respectively. Defaults to
	*        `SourceMapConsumer.GENERATED_ORDER`.
	*/
	SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
		var context = aContext || null;
		var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
		var mappings;
		switch (order) {
			case SourceMapConsumer.GENERATED_ORDER:
				mappings = this._generatedMappings;
				break;
			case SourceMapConsumer.ORIGINAL_ORDER:
				mappings = this._originalMappings;
				break;
			default: throw new Error("Unknown order of iteration.");
		}
		var sourceRoot = this.sourceRoot;
		var boundCallback = aCallback.bind(context);
		var names = this._names;
		var sources = this._sources;
		var sourceMapURL = this._sourceMapURL;
		for (var i = 0, n = mappings.length; i < n; i++) {
			var mapping = mappings[i];
			var source = mapping.source === null ? null : sources.at(mapping.source);
			if (source !== null) source = util.computeSourceURL(sourceRoot, source, sourceMapURL);
			boundCallback({
				source,
				generatedLine: mapping.generatedLine,
				generatedColumn: mapping.generatedColumn,
				originalLine: mapping.originalLine,
				originalColumn: mapping.originalColumn,
				name: mapping.name === null ? null : names.at(mapping.name)
			});
		}
	};
	/**
	* Returns all generated line and column information for the original source,
	* line, and column provided. If no column is provided, returns all mappings
	* corresponding to a either the line we are searching for or the next
	* closest line that has any mappings. Otherwise, returns all mappings
	* corresponding to the given line and either the column we are searching for
	* or the next closest column that has any offsets.
	*
	* The only argument is an object with the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number is 1-based.
	*   - column: Optional. the column number in the original source.
	*    The column number is 0-based.
	*
	* and an array of objects is returned, each with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*    line number is 1-based.
	*   - column: The column number in the generated source, or null.
	*    The column number is 0-based.
	*/
	SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
		var line = util.getArg(aArgs, "line");
		var needle = {
			source: util.getArg(aArgs, "source"),
			originalLine: line,
			originalColumn: util.getArg(aArgs, "column", 0)
		};
		needle.source = this._findSourceIndex(needle.source);
		if (needle.source < 0) return [];
		var mappings = [];
		var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
		if (index >= 0) {
			var mapping = this._originalMappings[index];
			if (aArgs.column === void 0) {
				var originalLine = mapping.originalLine;
				while (mapping && mapping.originalLine === originalLine) {
					mappings.push({
						line: util.getArg(mapping, "generatedLine", null),
						column: util.getArg(mapping, "generatedColumn", null),
						lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
					});
					mapping = this._originalMappings[++index];
				}
			} else {
				var originalColumn = mapping.originalColumn;
				while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
					mappings.push({
						line: util.getArg(mapping, "generatedLine", null),
						column: util.getArg(mapping, "generatedColumn", null),
						lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
					});
					mapping = this._originalMappings[++index];
				}
			}
		}
		return mappings;
	};
	exports.SourceMapConsumer = SourceMapConsumer;
	/**
	* A BasicSourceMapConsumer instance represents a parsed source map which we can
	* query for information about the original file positions by giving it a file
	* position in the generated source.
	*
	* The first parameter is the raw source map (either as a JSON string, or
	* already parsed to an object). According to the spec, source maps have the
	* following attributes:
	*
	*   - version: Which version of the source map spec this map is following.
	*   - sources: An array of URLs to the original source files.
	*   - names: An array of identifiers which can be referrenced by individual mappings.
	*   - sourceRoot: Optional. The URL root from which all sources are relative.
	*   - sourcesContent: Optional. An array of contents of the original source files.
	*   - mappings: A string of base64 VLQs which contain the actual mappings.
	*   - file: Optional. The generated file this source map is associated with.
	*
	* Here is an example source map, taken from the source map spec[0]:
	*
	*     {
	*       version : 3,
	*       file: "out.js",
	*       sourceRoot : "",
	*       sources: ["foo.js", "bar.js"],
	*       names: ["src", "maps", "are", "fun"],
	*       mappings: "AA,AB;;ABCDE;"
	*     }
	*
	* The second parameter, if given, is a string whose value is the URL
	* at which the source map was found.  This URL is used to compute the
	* sources array.
	*
	* [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	*/
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		var version = util.getArg(sourceMap, "version");
		var sources = util.getArg(sourceMap, "sources");
		var names = util.getArg(sourceMap, "names", []);
		var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
		var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
		var mappings = util.getArg(sourceMap, "mappings");
		var file = util.getArg(sourceMap, "file", null);
		if (version != this._version) throw new Error("Unsupported version: " + version);
		if (sourceRoot) sourceRoot = util.normalize(sourceRoot);
		sources = sources.map(String).map(util.normalize).map(function(source) {
			return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
		});
		this._names = ArraySet.fromArray(names.map(String), true);
		this._sources = ArraySet.fromArray(sources, true);
		this._absoluteSources = this._sources.toArray().map(function(s) {
			return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
		});
		this.sourceRoot = sourceRoot;
		this.sourcesContent = sourcesContent;
		this._mappings = mappings;
		this._sourceMapURL = aSourceMapURL;
		this.file = file;
	}
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	/**
	* Utility function to find the index of a source.  Returns -1 if not
	* found.
	*/
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
		var relativeSource = aSource;
		if (this.sourceRoot != null) relativeSource = util.relative(this.sourceRoot, relativeSource);
		if (this._sources.has(relativeSource)) return this._sources.indexOf(relativeSource);
		var i;
		for (i = 0; i < this._absoluteSources.length; ++i) if (this._absoluteSources[i] == aSource) return i;
		return -1;
	};
	/**
	* Create a BasicSourceMapConsumer from a SourceMapGenerator.
	*
	* @param SourceMapGenerator aSourceMap
	*        The source map that will be consumed.
	* @param String aSourceMapURL
	*        The URL at which the source map can be found (optional)
	* @returns BasicSourceMapConsumer
	*/
	BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
		var smc = Object.create(BasicSourceMapConsumer.prototype);
		var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
		var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
		smc.sourceRoot = aSourceMap._sourceRoot;
		smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
		smc.file = aSourceMap._file;
		smc._sourceMapURL = aSourceMapURL;
		smc._absoluteSources = smc._sources.toArray().map(function(s) {
			return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
		});
		var generatedMappings = aSourceMap._mappings.toArray().slice();
		var destGeneratedMappings = smc.__generatedMappings = [];
		var destOriginalMappings = smc.__originalMappings = [];
		for (var i = 0, length = generatedMappings.length; i < length; i++) {
			var srcMapping = generatedMappings[i];
			var destMapping = new Mapping();
			destMapping.generatedLine = srcMapping.generatedLine;
			destMapping.generatedColumn = srcMapping.generatedColumn;
			if (srcMapping.source) {
				destMapping.source = sources.indexOf(srcMapping.source);
				destMapping.originalLine = srcMapping.originalLine;
				destMapping.originalColumn = srcMapping.originalColumn;
				if (srcMapping.name) destMapping.name = names.indexOf(srcMapping.name);
				destOriginalMappings.push(destMapping);
			}
			destGeneratedMappings.push(destMapping);
		}
		quickSort(smc.__originalMappings, util.compareByOriginalPositions);
		return smc;
	};
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	BasicSourceMapConsumer.prototype._version = 3;
	/**
	* The list of original sources.
	*/
	Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", { get: function() {
		return this._absoluteSources.slice();
	} });
	/**
	* Provide the JIT with a nice shape / hidden class.
	*/
	function Mapping() {
		this.generatedLine = 0;
		this.generatedColumn = 0;
		this.source = null;
		this.originalLine = null;
		this.originalColumn = null;
		this.name = null;
	}
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	const compareGenerated = util.compareByGeneratedPositionsDeflatedNoLine;
	function sortGenerated(array, start) {
		let l = array.length;
		let n = array.length - start;
		if (n <= 1) return;
		else if (n == 2) {
			let a = array[start];
			let b = array[start + 1];
			if (compareGenerated(a, b) > 0) {
				array[start] = b;
				array[start + 1] = a;
			}
		} else if (n < 20) for (let i = start; i < l; i++) for (let j = i; j > start; j--) {
			let a = array[j - 1];
			let b = array[j];
			if (compareGenerated(a, b) <= 0) break;
			array[j - 1] = b;
			array[j] = a;
		}
		else quickSort(array, compareGenerated, start);
	}
	BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		var generatedLine = 1;
		var previousGeneratedColumn = 0;
		var previousOriginalLine = 0;
		var previousOriginalColumn = 0;
		var previousSource = 0;
		var previousName = 0;
		var length = aStr.length;
		var index = 0;
		var temp = {};
		var originalMappings = [];
		var generatedMappings = [], mapping, segment, end, value;
		let subarrayStart = 0;
		while (index < length) if (aStr.charAt(index) === ";") {
			generatedLine++;
			index++;
			previousGeneratedColumn = 0;
			sortGenerated(generatedMappings, subarrayStart);
			subarrayStart = generatedMappings.length;
		} else if (aStr.charAt(index) === ",") index++;
		else {
			mapping = new Mapping();
			mapping.generatedLine = generatedLine;
			for (end = index; end < length; end++) if (this._charIsMappingSeparator(aStr, end)) break;
			aStr.slice(index, end);
			segment = [];
			while (index < end) {
				base64VLQ.decode(aStr, index, temp);
				value = temp.value;
				index = temp.rest;
				segment.push(value);
			}
			if (segment.length === 2) throw new Error("Found a source, but no line and column");
			if (segment.length === 3) throw new Error("Found a source and line, but no column");
			mapping.generatedColumn = previousGeneratedColumn + segment[0];
			previousGeneratedColumn = mapping.generatedColumn;
			if (segment.length > 1) {
				mapping.source = previousSource + segment[1];
				previousSource += segment[1];
				mapping.originalLine = previousOriginalLine + segment[2];
				previousOriginalLine = mapping.originalLine;
				mapping.originalLine += 1;
				mapping.originalColumn = previousOriginalColumn + segment[3];
				previousOriginalColumn = mapping.originalColumn;
				if (segment.length > 4) {
					mapping.name = previousName + segment[4];
					previousName += segment[4];
				}
			}
			generatedMappings.push(mapping);
			if (typeof mapping.originalLine === "number") {
				let currentSource = mapping.source;
				while (originalMappings.length <= currentSource) originalMappings.push(null);
				if (originalMappings[currentSource] === null) originalMappings[currentSource] = [];
				originalMappings[currentSource].push(mapping);
			}
		}
		sortGenerated(generatedMappings, subarrayStart);
		this.__generatedMappings = generatedMappings;
		for (var i = 0; i < originalMappings.length; i++) if (originalMappings[i] != null) quickSort(originalMappings[i], util.compareByOriginalPositionsNoSource);
		this.__originalMappings = [].concat(...originalMappings);
	};
	/**
	* Find the mapping that best matches the hypothetical "needle" mapping that
	* we are searching for in the given "haystack" of mappings.
	*/
	BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
		if (aNeedle[aLineName] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
		if (aNeedle[aColumnName] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
		return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	};
	/**
	* Compute the last column for each generated mapping. The last column is
	* inclusive.
	*/
	BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
		for (var index = 0; index < this._generatedMappings.length; ++index) {
			var mapping = this._generatedMappings[index];
			if (index + 1 < this._generatedMappings.length) {
				var nextMapping = this._generatedMappings[index + 1];
				if (mapping.generatedLine === nextMapping.generatedLine) {
					mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
					continue;
				}
			}
			mapping.lastGeneratedColumn = Infinity;
		}
	};
	/**
	* Returns the original source, line, and column information for the generated
	* source's line and column positions provided. The only argument is an object
	* with the following properties:
	*
	*   - line: The line number in the generated source.  The line number
	*     is 1-based.
	*   - column: The column number in the generated source.  The column
	*     number is 0-based.
	*   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	*     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	*
	* and an object is returned with the following properties:
	*
	*   - source: The original source file, or null.
	*   - line: The line number in the original source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the original source, or null.  The
	*     column number is 0-based.
	*   - name: The original identifier, or null.
	*/
	BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
		var needle = {
			generatedLine: util.getArg(aArgs, "line"),
			generatedColumn: util.getArg(aArgs, "column")
		};
		var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
		if (index >= 0) {
			var mapping = this._generatedMappings[index];
			if (mapping.generatedLine === needle.generatedLine) {
				var source = util.getArg(mapping, "source", null);
				if (source !== null) {
					source = this._sources.at(source);
					source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
				}
				var name = util.getArg(mapping, "name", null);
				if (name !== null) name = this._names.at(name);
				return {
					source,
					line: util.getArg(mapping, "originalLine", null),
					column: util.getArg(mapping, "originalColumn", null),
					name
				};
			}
		}
		return {
			source: null,
			line: null,
			column: null,
			name: null
		};
	};
	/**
	* Return true if we have the source content for every source in the source
	* map, false otherwise.
	*/
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
		if (!this.sourcesContent) return false;
		return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
			return sc == null;
		});
	};
	/**
	* Returns the original source content. The only argument is the url of the
	* original source file. Returns null if no original source content is
	* available.
	*/
	BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
		if (!this.sourcesContent) return null;
		var index = this._findSourceIndex(aSource);
		if (index >= 0) return this.sourcesContent[index];
		var relativeSource = aSource;
		if (this.sourceRoot != null) relativeSource = util.relative(this.sourceRoot, relativeSource);
		var url;
		if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
			var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
			if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
			if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
		}
		if (nullOnMissing) return null;
		else throw new Error("\"" + relativeSource + "\" is not in the SourceMap.");
	};
	/**
	* Returns the generated line and column information for the original source,
	* line, and column positions provided. The only argument is an object with
	* the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number
	*     is 1-based.
	*   - column: The column number in the original source.  The column
	*     number is 0-based.
	*   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	*     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	*
	* and an object is returned with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the generated source, or null.
	*     The column number is 0-based.
	*/
	BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
		var source = util.getArg(aArgs, "source");
		source = this._findSourceIndex(source);
		if (source < 0) return {
			line: null,
			column: null,
			lastColumn: null
		};
		var needle = {
			source,
			originalLine: util.getArg(aArgs, "line"),
			originalColumn: util.getArg(aArgs, "column")
		};
		var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
		if (index >= 0) {
			var mapping = this._originalMappings[index];
			if (mapping.source === needle.source) return {
				line: util.getArg(mapping, "generatedLine", null),
				column: util.getArg(mapping, "generatedColumn", null),
				lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
			};
		}
		return {
			line: null,
			column: null,
			lastColumn: null
		};
	};
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	/**
	* An IndexedSourceMapConsumer instance represents a parsed source map which
	* we can query for information. It differs from BasicSourceMapConsumer in
	* that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	* input.
	*
	* The first parameter is a raw source map (either as a JSON string, or already
	* parsed to an object). According to the spec for indexed source maps, they
	* have the following attributes:
	*
	*   - version: Which version of the source map spec this map is following.
	*   - file: Optional. The generated file this source map is associated with.
	*   - sections: A list of section definitions.
	*
	* Each value under the "sections" field has two fields:
	*   - offset: The offset into the original specified at which this section
	*       begins to apply, defined as an object with a "line" and "column"
	*       field.
	*   - map: A source map definition. This source map could also be indexed,
	*       but doesn't have to be.
	*
	* Instead of the "map" field, it's also possible to have a "url" field
	* specifying a URL to retrieve a source map from, but that's currently
	* unsupported.
	*
	* Here's an example source map, taken from the source map spec[0], but
	* modified to omit a section which uses the "url" field.
	*
	*  {
	*    version : 3,
	*    file: "app.js",
	*    sections: [{
	*      offset: {line:100, column:10},
	*      map: {
	*        version : 3,
	*        file: "section.js",
	*        sources: ["foo.js", "bar.js"],
	*        names: ["src", "maps", "are", "fun"],
	*        mappings: "AAAA,E;;ABCDE;"
	*      }
	*    }],
	*  }
	*
	* The second parameter, if given, is a string whose value is the URL
	* at which the source map was found.  This URL is used to compute the
	* sources array.
	*
	* [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	*/
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		var version = util.getArg(sourceMap, "version");
		var sections = util.getArg(sourceMap, "sections");
		if (version != this._version) throw new Error("Unsupported version: " + version);
		this._sources = new ArraySet();
		this._names = new ArraySet();
		var lastOffset = {
			line: -1,
			column: 0
		};
		this._sections = sections.map(function(s) {
			if (s.url) throw new Error("Support for url field in sections not implemented.");
			var offset = util.getArg(s, "offset");
			var offsetLine = util.getArg(offset, "line");
			var offsetColumn = util.getArg(offset, "column");
			if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) throw new Error("Section offsets must be ordered and non-overlapping.");
			lastOffset = offset;
			return {
				generatedOffset: {
					generatedLine: offsetLine + 1,
					generatedColumn: offsetColumn + 1
				},
				consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
			};
		});
	}
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	IndexedSourceMapConsumer.prototype._version = 3;
	/**
	* The list of original sources.
	*/
	Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", { get: function() {
		var sources = [];
		for (var i = 0; i < this._sections.length; i++) for (var j = 0; j < this._sections[i].consumer.sources.length; j++) sources.push(this._sections[i].consumer.sources[j]);
		return sources;
	} });
	/**
	* Returns the original source, line, and column information for the generated
	* source's line and column positions provided. The only argument is an object
	* with the following properties:
	*
	*   - line: The line number in the generated source.  The line number
	*     is 1-based.
	*   - column: The column number in the generated source.  The column
	*     number is 0-based.
	*
	* and an object is returned with the following properties:
	*
	*   - source: The original source file, or null.
	*   - line: The line number in the original source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the original source, or null.  The
	*     column number is 0-based.
	*   - name: The original identifier, or null.
	*/
	IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
		var needle = {
			generatedLine: util.getArg(aArgs, "line"),
			generatedColumn: util.getArg(aArgs, "column")
		};
		var sectionIndex = binarySearch.search(needle, this._sections, function(needle$1, section$1) {
			var cmp = needle$1.generatedLine - section$1.generatedOffset.generatedLine;
			if (cmp) return cmp;
			return needle$1.generatedColumn - section$1.generatedOffset.generatedColumn;
		});
		var section = this._sections[sectionIndex];
		if (!section) return {
			source: null,
			line: null,
			column: null,
			name: null
		};
		return section.consumer.originalPositionFor({
			line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
			column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
			bias: aArgs.bias
		});
	};
	/**
	* Return true if we have the source content for every source in the source
	* map, false otherwise.
	*/
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
		return this._sections.every(function(s) {
			return s.consumer.hasContentsOfAllSources();
		});
	};
	/**
	* Returns the original source content. The only argument is the url of the
	* original source file. Returns null if no original source content is
	* available.
	*/
	IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
		for (var i = 0; i < this._sections.length; i++) {
			var content = this._sections[i].consumer.sourceContentFor(aSource, true);
			if (content || content === "") return content;
		}
		if (nullOnMissing) return null;
		else throw new Error("\"" + aSource + "\" is not in the SourceMap.");
	};
	/**
	* Returns the generated line and column information for the original source,
	* line, and column positions provided. The only argument is an object with
	* the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number
	*     is 1-based.
	*   - column: The column number in the original source.  The column
	*     number is 0-based.
	*
	* and an object is returned with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*     line number is 1-based. 
	*   - column: The column number in the generated source, or null.
	*     The column number is 0-based.
	*/
	IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
		for (var i = 0; i < this._sections.length; i++) {
			var section = this._sections[i];
			if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) continue;
			var generatedPosition = section.consumer.generatedPositionFor(aArgs);
			if (generatedPosition) return {
				line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
				column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
			};
		}
		return {
			line: null,
			column: null
		};
	};
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		this.__generatedMappings = [];
		this.__originalMappings = [];
		for (var i = 0; i < this._sections.length; i++) {
			var section = this._sections[i];
			var sectionMappings = section.consumer._generatedMappings;
			for (var j = 0; j < sectionMappings.length; j++) {
				var mapping = sectionMappings[j];
				var source = section.consumer._sources.at(mapping.source);
				if (source !== null) source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
				this._sources.add(source);
				source = this._sources.indexOf(source);
				var name = null;
				if (mapping.name) {
					name = section.consumer._names.at(mapping.name);
					this._names.add(name);
					name = this._names.indexOf(name);
				}
				var adjustedMapping = {
					source,
					generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
					generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
					originalLine: mapping.originalLine,
					originalColumn: mapping.originalColumn,
					name
				};
				this.__generatedMappings.push(adjustedMapping);
				if (typeof adjustedMapping.originalLine === "number") this.__originalMappings.push(adjustedMapping);
			}
		}
		quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
		quickSort(this.__originalMappings, util.compareByOriginalPositions);
	};
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/source-node.js
var require_source_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
	var util = require_util();
	var REGEX_NEWLINE = /(\r?\n)/;
	var NEWLINE_CODE = 10;
	var isSourceNode = "$$$isSourceNode$$$";
	/**
	* SourceNodes provide a way to abstract over interpolating/concatenating
	* snippets of generated JavaScript source code while maintaining the line and
	* column information associated with the original source code.
	*
	* @param aLine The original line number.
	* @param aColumn The original column number.
	* @param aSource The original source's filename.
	* @param aChunks Optional. An array of strings which are snippets of
	*        generated JS, or other SourceNodes.
	* @param aName The original identifier.
	*/
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
		this.children = [];
		this.sourceContents = {};
		this.line = aLine == null ? null : aLine;
		this.column = aColumn == null ? null : aColumn;
		this.source = aSource == null ? null : aSource;
		this.name = aName == null ? null : aName;
		this[isSourceNode] = true;
		if (aChunks != null) this.add(aChunks);
	}
	/**
	* Creates a SourceNode from generated code and a SourceMapConsumer.
	*
	* @param aGeneratedCode The generated code
	* @param aSourceMapConsumer The SourceMap for the generated code
	* @param aRelativePath Optional. The path that relative sources in the
	*        SourceMapConsumer should be relative to.
	*/
	SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
		var node = new SourceNode();
		var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
		var remainingLinesIndex = 0;
		var shiftNextLine = function() {
			return getNextLine() + (getNextLine() || "");
			function getNextLine() {
				return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
			}
		};
		var lastGeneratedLine = 1, lastGeneratedColumn = 0;
		var lastMapping = null;
		aSourceMapConsumer.eachMapping(function(mapping) {
			if (lastMapping !== null) if (lastGeneratedLine < mapping.generatedLine) {
				addMappingWithCode(lastMapping, shiftNextLine());
				lastGeneratedLine++;
				lastGeneratedColumn = 0;
			} else {
				var nextLine = remainingLines[remainingLinesIndex] || "";
				var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
				remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
				lastGeneratedColumn = mapping.generatedColumn;
				addMappingWithCode(lastMapping, code);
				lastMapping = mapping;
				return;
			}
			while (lastGeneratedLine < mapping.generatedLine) {
				node.add(shiftNextLine());
				lastGeneratedLine++;
			}
			if (lastGeneratedColumn < mapping.generatedColumn) {
				var nextLine = remainingLines[remainingLinesIndex] || "";
				node.add(nextLine.substr(0, mapping.generatedColumn));
				remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
				lastGeneratedColumn = mapping.generatedColumn;
			}
			lastMapping = mapping;
		}, this);
		if (remainingLinesIndex < remainingLines.length) {
			if (lastMapping) addMappingWithCode(lastMapping, shiftNextLine());
			node.add(remainingLines.splice(remainingLinesIndex).join(""));
		}
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) {
				if (aRelativePath != null) sourceFile = util.join(aRelativePath, sourceFile);
				node.setSourceContent(sourceFile, content);
			}
		});
		return node;
		function addMappingWithCode(mapping, code) {
			if (mapping === null || mapping.source === void 0) node.add(code);
			else {
				var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
				node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
			}
		}
	};
	/**
	* Add a chunk of generated JS to this source node.
	*
	* @param aChunk A string snippet of generated JS code, another instance of
	*        SourceNode, or an array where each member is one of those things.
	*/
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
		if (Array.isArray(aChunk)) aChunk.forEach(function(chunk) {
			this.add(chunk);
		}, this);
		else if (aChunk[isSourceNode] || typeof aChunk === "string") {
			if (aChunk) this.children.push(aChunk);
		} else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
		return this;
	};
	/**
	* Add a chunk of generated JS to the beginning of this source node.
	*
	* @param aChunk A string snippet of generated JS code, another instance of
	*        SourceNode, or an array where each member is one of those things.
	*/
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
		if (Array.isArray(aChunk)) for (var i = aChunk.length - 1; i >= 0; i--) this.prepend(aChunk[i]);
		else if (aChunk[isSourceNode] || typeof aChunk === "string") this.children.unshift(aChunk);
		else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
		return this;
	};
	/**
	* Walk over the tree of JS snippets in this node and its children. The
	* walking function is called once for each snippet of JS and is passed that
	* snippet and the its original associated source's line/column location.
	*
	* @param aFn The traversal function.
	*/
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
		var chunk;
		for (var i = 0, len = this.children.length; i < len; i++) {
			chunk = this.children[i];
			if (chunk[isSourceNode]) chunk.walk(aFn);
			else if (chunk !== "") aFn(chunk, {
				source: this.source,
				line: this.line,
				column: this.column,
				name: this.name
			});
		}
	};
	/**
	* Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	* each of `this.children`.
	*
	* @param aSep The separator.
	*/
	SourceNode.prototype.join = function SourceNode_join(aSep) {
		var newChildren;
		var i;
		var len = this.children.length;
		if (len > 0) {
			newChildren = [];
			for (i = 0; i < len - 1; i++) {
				newChildren.push(this.children[i]);
				newChildren.push(aSep);
			}
			newChildren.push(this.children[i]);
			this.children = newChildren;
		}
		return this;
	};
	/**
	* Call String.prototype.replace on the very right-most source snippet. Useful
	* for trimming whitespace from the end of a source node, etc.
	*
	* @param aPattern The pattern to replace.
	* @param aReplacement The thing to replace the pattern with.
	*/
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
		var lastChild = this.children[this.children.length - 1];
		if (lastChild[isSourceNode]) lastChild.replaceRight(aPattern, aReplacement);
		else if (typeof lastChild === "string") this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
		else this.children.push("".replace(aPattern, aReplacement));
		return this;
	};
	/**
	* Set the source content for a source file. This will be added to the SourceMapGenerator
	* in the sourcesContent field.
	*
	* @param aSourceFile The filename of the source file
	* @param aSourceContent The content of the source file
	*/
	SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
		this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	};
	/**
	* Walk over the tree of SourceNodes. The walking function is called for each
	* source file content and is passed the filename and source content.
	*
	* @param aFn The traversal function.
	*/
	SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
		for (var i = 0, len = this.children.length; i < len; i++) if (this.children[i][isSourceNode]) this.children[i].walkSourceContents(aFn);
		var sources = Object.keys(this.sourceContents);
		for (var i = 0, len = sources.length; i < len; i++) aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	};
	/**
	* Return the string representation of this source node. Walks over the tree
	* and concatenates all the various snippets together to one string.
	*/
	SourceNode.prototype.toString = function SourceNode_toString() {
		var str = "";
		this.walk(function(chunk) {
			str += chunk;
		});
		return str;
	};
	/**
	* Returns the string representation of this source node along with a source
	* map.
	*/
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
		var generated = {
			code: "",
			line: 1,
			column: 0
		};
		var map = new SourceMapGenerator(aArgs);
		var sourceMappingActive = false;
		var lastOriginalSource = null;
		var lastOriginalLine = null;
		var lastOriginalColumn = null;
		var lastOriginalName = null;
		this.walk(function(chunk, original) {
			generated.code += chunk;
			if (original.source !== null && original.line !== null && original.column !== null) {
				if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) map.addMapping({
					source: original.source,
					original: {
						line: original.line,
						column: original.column
					},
					generated: {
						line: generated.line,
						column: generated.column
					},
					name: original.name
				});
				lastOriginalSource = original.source;
				lastOriginalLine = original.line;
				lastOriginalColumn = original.column;
				lastOriginalName = original.name;
				sourceMappingActive = true;
			} else if (sourceMappingActive) {
				map.addMapping({ generated: {
					line: generated.line,
					column: generated.column
				} });
				lastOriginalSource = null;
				sourceMappingActive = false;
			}
			for (var idx = 0, length = chunk.length; idx < length; idx++) if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
				generated.line++;
				generated.column = 0;
				if (idx + 1 === length) {
					lastOriginalSource = null;
					sourceMappingActive = false;
				} else if (sourceMappingActive) map.addMapping({
					source: original.source,
					original: {
						line: original.line,
						column: original.column
					},
					generated: {
						line: generated.line,
						column: generated.column
					},
					name: original.name
				});
			} else generated.column++;
		});
		this.walkSourceContents(function(sourceFile, sourceContent) {
			map.setSourceContent(sourceFile, sourceContent);
		});
		return {
			code: generated.code,
			map
		};
	};
	exports.SourceNode = SourceNode;
}));

//#endregion
//#region ../../node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/source-map.js
var require_source_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
	exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
	exports.SourceNode = require_source_node().SourceNode;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/previous-map.js
var require_previous_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let { existsSync: existsSync$1, readFileSync: readFileSync$1, realpathSync } = __require("fs");
	let { dirname: dirname$2, isAbsolute: isAbsolute$2, join: join$1, relative: relative$1, sep: sep$2 } = __require("path");
	let { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	function realPath(path) {
		try {
			return realpathSync(path);
		} catch {
			return path;
		}
	}
	function fromBase64(str) {
		if (Buffer) return Buffer.from(str, "base64").toString();
		else
 /* c8 ignore next 2 */
		return window.atob(str);
	}
	var PreviousMap = class {
		constructor(css, opts) {
			if (opts.map === false) return;
			if (opts.unsafeMap) this.unsafeMap = true;
			this.loadAnnotation(css);
			this.inline = this.startWith(this.annotation, "data:");
			let prev = opts.map ? opts.map.prev : void 0;
			let text = this.loadMap(opts.from, prev);
			if (!this.mapFile && opts.from) this.mapFile = opts.from;
			if (this.mapFile) this.root = dirname$2(this.mapFile);
			if (text) this.text = text;
		}
		consumer() {
			if (!this.consumerCache) this.consumerCache = new SourceMapConsumer(this.json || this.text);
			return this.consumerCache;
		}
		decodeInline(text) {
			let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
			let baseUri = /^data:application\/json;base64,/;
			let uriMatch = text.match(/^data:application\/json;charset=utf-?8,/) || text.match(/^data:application\/json,/);
			if (uriMatch) return decodeURIComponent(text.substr(uriMatch[0].length));
			let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
			if (baseUriMatch) return fromBase64(text.substr(baseUriMatch[0].length));
			let encoding = text.slice(22);
			encoding = encoding.slice(0, encoding.indexOf(","));
			throw new Error("Unsupported source map encoding " + encoding);
		}
		getAnnotationURL(sourceMapString) {
			return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
		}
		isMap(map) {
			if (typeof map !== "object") return false;
			return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
		}
		loadAnnotation(css) {
			let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
			if (!comments) return;
			let start = css.lastIndexOf(comments.pop());
			let end = css.indexOf("*/", start);
			if (start > -1 && end > -1) this.annotation = this.getAnnotationURL(css.substring(start, end));
		}
		loadFile(path, cssFile, trusted) {
			if (!trusted && !this.unsafeMap) {
				if (!/\.map$/i.test(path)) return void 0;
				if (!cssFile) return void 0;
				let rel = relative$1(realPath(dirname$2(cssFile)), realPath(path));
				if (rel === ".." || rel.startsWith(".." + sep$2) || isAbsolute$2(rel)) return;
			}
			this.root = dirname$2(path);
			if (existsSync$1(path)) {
				this.mapFile = path;
				return readFileSync$1(path, "utf-8").toString().trim();
			}
		}
		loadMap(file, prev) {
			if (prev === false) return false;
			if (prev) if (typeof prev === "string") return prev;
			else if (typeof prev === "function") {
				let prevPath = prev(file);
				if (prevPath) {
					let map = this.loadFile(prevPath, file, true);
					if (!map) throw new Error("Unable to load previous source map: " + prevPath.toString());
					return map;
				}
			} else if (prev instanceof SourceMapConsumer) return SourceMapGenerator.fromSourceMap(prev).toString();
			else if (prev instanceof SourceMapGenerator) return prev.toString();
			else if (this.isMap(prev)) return JSON.stringify(prev);
			else throw new Error("Unsupported previous source map format: " + prev.toString());
			else if (this.inline) return this.decodeInline(this.annotation);
			else if (this.annotation) {
				let map = this.annotation;
				if (file) map = join$1(dirname$2(file), map);
				let unknown = this.loadFile(map, file, false);
				if (unknown) try {
					/* c8 ignore next 4 */
					this.json = JSON.parse(unknown.replace(/^\)]}'[^\n]*\n/, ""));
				} catch {
					return;
				}
				return unknown;
			}
		}
		startWith(string, start) {
			if (!string) return false;
			return string.substr(0, start.length) === start;
		}
		withContent() {
			return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
		}
	};
	module.exports = PreviousMap;
	PreviousMap.default = PreviousMap;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/input.js
var require_input = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let { nanoid } = __require("nanoid/non-secure");
	let { isAbsolute: isAbsolute$1, resolve: resolve$2 } = __require("path");
	let { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	let { fileURLToPath, pathToFileURL: pathToFileURL$1 } = __require("url");
	let CssSyntaxError = require_css_syntax_error();
	let PreviousMap = require_previous_map();
	let terminalHighlight = require_terminal_highlight();
	let lineToIndexCache = Symbol("lineToIndexCache");
	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(resolve$2 && isAbsolute$1);
	function getLineToIndex(input) {
		if (input[lineToIndexCache]) return input[lineToIndexCache];
		let lines = input.css.split("\n");
		let lineToIndex = new Array(lines.length);
		let prevIndex = 0;
		for (let i = 0, l = lines.length; i < l; i++) {
			lineToIndex[i] = prevIndex;
			prevIndex += lines[i].length + 1;
		}
		input[lineToIndexCache] = lineToIndex;
		return lineToIndex;
	}
	var Input = class {
		get from() {
			return this.file || this.id;
		}
		constructor(css, opts = {}) {
			if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) throw new Error(`PostCSS received ${css} instead of CSS string`);
			this.css = css.toString();
			if (this.css[0] === "﻿" || this.css[0] === "￾") {
				this.hasBOM = true;
				this.css = this.css.slice(1);
			} else this.hasBOM = false;
			this.document = this.css;
			if (opts.document) this.document = opts.document.toString();
			if (opts.from) if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute$1(opts.from)) this.file = opts.from;
			else this.file = resolve$2(opts.from);
			if (pathAvailable && sourceMapAvailable) {
				let map = new PreviousMap(this.css, opts);
				if (map.text) {
					this.map = map;
					let file = map.consumer().file;
					if (!this.file && file) this.file = this.mapResolve(file);
				}
			}
			if (!this.file) this.id = "<input css " + nanoid(6) + ">";
			if (this.map) this.map.file = this.from;
		}
		error(message, line, column, opts = {}) {
			let endColumn, endLine, endOffset, offset, result;
			if (line && typeof line === "object") {
				let start = line;
				let end = column;
				if (typeof start.offset === "number") {
					offset = start.offset;
					let pos = this.fromOffset(offset);
					line = pos.line;
					column = pos.col;
				} else {
					line = start.line;
					column = start.column;
					offset = this.fromLineAndColumn(line, column);
				}
				if (typeof end.offset === "number") {
					endOffset = end.offset;
					let pos = this.fromOffset(endOffset);
					endLine = pos.line;
					endColumn = pos.col;
				} else {
					endLine = end.line;
					endColumn = end.column;
					endOffset = this.fromLineAndColumn(end.line, end.column);
				}
			} else if (!column) {
				offset = line;
				let pos = this.fromOffset(offset);
				line = pos.line;
				column = pos.col;
			} else offset = this.fromLineAndColumn(line, column);
			let origin = this.origin(line, column, endLine, endColumn);
			if (origin) result = new CssSyntaxError(message, origin.endLine === void 0 ? origin.line : {
				column: origin.column,
				line: origin.line
			}, origin.endLine === void 0 ? origin.column : {
				column: origin.endColumn,
				line: origin.endLine
			}, origin.source, origin.file, opts.plugin);
			else result = new CssSyntaxError(message, endLine === void 0 ? line : {
				column,
				line
			}, endLine === void 0 ? column : {
				column: endColumn,
				line: endLine
			}, this.css, this.file, opts.plugin);
			result.input = {
				column,
				endColumn,
				endLine,
				endOffset,
				line,
				offset,
				source: this.css
			};
			if (this.file) {
				if (pathToFileURL$1) result.input.url = pathToFileURL$1(this.file).toString();
				result.input.file = this.file;
			}
			return result;
		}
		fromLineAndColumn(line, column) {
			return getLineToIndex(this)[line - 1] + column - 1;
		}
		fromOffset(offset) {
			let lineToIndex = getLineToIndex(this);
			let lastLine = lineToIndex[lineToIndex.length - 1];
			let min = 0;
			if (offset >= lastLine) min = lineToIndex.length - 1;
			else {
				let max = lineToIndex.length - 2;
				let mid;
				while (min < max) {
					mid = min + (max - min >> 1);
					if (offset < lineToIndex[mid]) max = mid - 1;
					else if (offset >= lineToIndex[mid + 1]) min = mid + 1;
					else {
						min = mid;
						break;
					}
				}
			}
			return {
				col: offset - lineToIndex[min] + 1,
				line: min + 1
			};
		}
		mapResolve(file) {
			if (/^\w+:\/\//.test(file)) return file;
			return resolve$2(this.map.consumer().sourceRoot || this.map.root || ".", file);
		}
		origin(line, column, endLine, endColumn) {
			if (!this.map) return false;
			let consumer = this.map.consumer();
			let from = consumer.originalPositionFor({
				column: column - 1,
				line
			});
			if (!from.source) return false;
			let to;
			if (typeof endLine === "number") {
				let toPosition = consumer.originalPositionFor({
					column: endColumn - 1,
					line: endLine
				});
				if (toPosition.source) to = toPosition;
			}
			let fromUrl;
			if (isAbsolute$1(from.source)) fromUrl = pathToFileURL$1(from.source);
			else fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile));
			let result = {
				column: from.column + 1,
				endColumn: to && to.column + 1,
				endLine: to && to.line,
				line: from.line,
				url: fromUrl.toString()
			};
			if (fromUrl.protocol === "file:") if (fileURLToPath) result.file = fileURLToPath(fromUrl);
			else
 /* c8 ignore next 2 */
			throw new Error(`file: protocol is not available in this PostCSS build`);
			let source = consumer.sourceContentFor(from.source);
			if (source) result.source = source;
			return result;
		}
		toJSON() {
			let json = {};
			for (let name of [
				"hasBOM",
				"css",
				"file",
				"id"
			]) if (this[name] != null) json[name] = this[name];
			if (this.map) {
				json.map = { ...this.map };
				if (json.map.consumerCache) json.map.consumerCache = void 0;
			}
			return json;
		}
	};
	module.exports = Input;
	Input.default = Input;
	if (terminalHighlight && terminalHighlight.registerInput) terminalHighlight.registerInput(Input);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/root.js
var require_root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let LazyResult, Processor;
	var Root = class extends Container {
		constructor(defaults) {
			super(defaults);
			this.type = "root";
			if (!this.nodes) this.nodes = [];
		}
		normalize(child, sample, type) {
			let keepBefore = /* @__PURE__ */ new Set();
			for (let node of Array.isArray(child) ? child : [child]) if (node && typeof node === "object" && !node.parent && node.raws && typeof node.raws.before !== "undefined") keepBefore.add(node.raws);
			let nodes = super.normalize(child);
			if (sample) {
				if (type === "prepend") if (this.nodes.length > 1) sample.raws.before = this.nodes[1].raws.before;
				else delete sample.raws.before;
				else if (this.first !== sample) {
					for (let node of nodes) if (!keepBefore.has(node.raws)) node.raws.before = sample.raws.before;
				}
			}
			return nodes;
		}
		removeChild(child, ignore) {
			let index = this.index(child);
			if (!ignore && index === 0 && this.nodes.length > 1) this.nodes[1].raws.before = this.nodes[index].raws.before;
			return super.removeChild(child);
		}
		toResult(opts = {}) {
			return new LazyResult(new Processor(), this, opts).stringify();
		}
	};
	Root.registerLazyResult = (dependant) => {
		LazyResult = dependant;
	};
	Root.registerProcessor = (dependant) => {
		Processor = dependant;
	};
	module.exports = Root;
	Root.default = Root;
	Container.registerRoot(Root);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/list.js
var require_list = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let list = {
		comma(string) {
			return list.split(string, [","], true);
		},
		space(string) {
			return list.split(string, [
				" ",
				"\n",
				"	"
			]);
		},
		split(string, separators, last) {
			if (typeof string !== "string") return [];
			let array = [];
			let current = "";
			let split = false;
			let func = 0;
			let inQuote = false;
			let prevQuote = "";
			let escape = false;
			for (let letter of string) {
				if (escape) escape = false;
				else if (letter === "\\") escape = true;
				else if (inQuote) {
					if (letter === prevQuote) inQuote = false;
				} else if (letter === "\"" || letter === "'") {
					inQuote = true;
					prevQuote = letter;
				} else if (letter === "(") func += 1;
				else if (letter === ")") {
					if (func > 0) func -= 1;
				} else if (func === 0) {
					if (separators.includes(letter)) split = true;
				}
				if (split) {
					if (current !== "") array.push(current.trim());
					current = "";
					split = false;
				} else current += letter;
			}
			if (last || current !== "") array.push(current.trim());
			return array;
		}
	};
	module.exports = list;
	list.default = list;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/rule.js
var require_rule = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let list = require_list();
	var Rule = class extends Container {
		get selectors() {
			return list.comma(this.selector);
		}
		set selectors(values) {
			let match = this.selector ? this.selector.match(/,\s*/) : null;
			let sep$3 = match ? match[0] : "," + this.raw("between", "beforeOpen");
			this.selector = values.join(sep$3);
		}
		constructor(defaults) {
			super(defaults);
			this.type = "rule";
			if (!this.nodes) this.nodes = [];
		}
	};
	module.exports = Rule;
	Rule.default = Rule;
	Container.registerRule(Rule);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/fromJSON.js
var require_fromJSON = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let AtRule = require_at_rule();
	let Comment = require_comment();
	let Declaration = require_declaration();
	let Input = require_input();
	let PreviousMap = require_previous_map();
	let Root = require_root();
	let Rule = require_rule();
	function hydrateInputs(json, inputs) {
		if (!json.inputs) return inputs;
		return json.inputs.map((input) => {
			let inputHydrated = {
				...input,
				__proto__: Input.prototype
			};
			if (inputHydrated.map) inputHydrated.map = {
				...inputHydrated.map,
				__proto__: PreviousMap.prototype
			};
			return inputHydrated;
		});
	}
	function constructNode(json, inputs, children) {
		let defaults = { ...json };
		delete defaults.inputs;
		delete defaults.nodes;
		if (defaults.source) {
			let { inputId, ...source } = defaults.source;
			defaults.source = source;
			if (inputId != null) defaults.source.input = inputs[inputId];
		}
		let node;
		if (defaults.type === "root") node = new Root(defaults);
		else if (defaults.type === "decl") node = new Declaration(defaults);
		else if (defaults.type === "rule") node = new Rule(defaults);
		else if (defaults.type === "comment") node = new Comment(defaults);
		else if (defaults.type === "atrule") node = new AtRule(defaults);
		else throw new Error("Unknown node type: " + json.type);
		if (children) {
			node.nodes = children;
			for (let child of children) child.parent = node;
		}
		return node;
	}
	function fromJSON(json, inputs) {
		if (Array.isArray(json)) return json.map((n) => fromJSON(n));
		let result;
		let stack = [{
			childIndex: 0,
			children: [],
			inputs: hydrateInputs(json, inputs),
			json
		}];
		while (stack.length > 0) {
			let frame = stack[stack.length - 1];
			let jsonNodes = frame.json.nodes;
			if (jsonNodes && frame.childIndex < jsonNodes.length) {
				let childJson = jsonNodes[frame.childIndex];
				frame.childIndex += 1;
				stack.push({
					childIndex: 0,
					children: [],
					inputs: hydrateInputs(childJson, frame.inputs),
					json: childJson
				});
				continue;
			}
			stack.pop();
			let node = constructNode(frame.json, frame.inputs, jsonNodes ? frame.children : void 0);
			if (stack.length > 0) stack[stack.length - 1].children.push(node);
			else result = node;
		}
		return result;
	}
	module.exports = fromJSON;
	fromJSON.default = fromJSON;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/map-generator.js
var require_map_generator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let { dirname: dirname$1, relative, resolve: resolve$1, sep: sep$1 } = __require("path");
	let { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	let { pathToFileURL } = __require("url");
	let Input = require_input();
	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(dirname$1 && resolve$1 && relative && sep$1);
	var MapGenerator = class {
		constructor(stringify$1, root$1, opts, cssString) {
			this.stringify = stringify$1;
			this.mapOpts = opts.map || {};
			this.root = root$1;
			this.opts = opts;
			this.css = cssString;
			this.originalCSS = cssString;
			this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
			this.memoizedFileURLs = /* @__PURE__ */ new Map();
			this.memoizedPaths = /* @__PURE__ */ new Map();
			this.memoizedURLs = /* @__PURE__ */ new Map();
		}
		addAnnotation() {
			let content;
			if (this.isInline()) content = "data:application/json;base64," + this.toBase64(this.map.toString());
			else if (typeof this.mapOpts.annotation === "string") content = this.mapOpts.annotation;
			else if (typeof this.mapOpts.annotation === "function") content = this.mapOpts.annotation(this.opts.to, this.root);
			else content = this.outputFile() + ".map";
			let eol = "\n";
			if (this.css.includes("\r\n")) eol = "\r\n";
			this.css += eol + "/*# sourceMappingURL=" + content + " */";
		}
		applyPrevMaps() {
			for (let prev of this.previous()) {
				let from = this.toUrl(this.path(prev.file));
				let root$1 = prev.root || dirname$1(prev.file);
				let map;
				if (this.mapOpts.sourcesContent === false) {
					map = new SourceMapConsumer(prev.text);
					if (map.sourcesContent) map.sourcesContent = null;
				} else map = prev.consumer();
				this.map.applySourceMap(map, from, this.toUrl(this.path(root$1)));
			}
		}
		clearAnnotation() {
			if (this.mapOpts.annotation === false) return;
			if (this.root) {
				let node;
				for (let i = this.root.nodes.length - 1; i >= 0; i--) {
					node = this.root.nodes[i];
					if (node.type !== "comment") continue;
					if (node.text.startsWith("# sourceMappingURL=")) this.root.removeChild(i);
				}
			} else if (this.css) {
				let startIndex;
				while ((startIndex = this.css.lastIndexOf("/*#")) !== -1) {
					let endIndex = this.css.indexOf("*/", startIndex + 3);
					if (endIndex === -1) break;
					while (startIndex > 0 && this.css[startIndex - 1] === "\n") startIndex--;
					this.css = this.css.slice(0, startIndex) + this.css.slice(endIndex + 2);
				}
			}
		}
		generate() {
			this.clearAnnotation();
			if (pathAvailable && sourceMapAvailable && this.isMap()) return this.generateMap();
			else {
				let result = "";
				this.stringify(this.root, (i) => {
					result += i;
				});
				return [result];
			}
		}
		generateMap() {
			if (this.root) this.generateString();
			else if (this.previous().length === 1) {
				let prev = this.previous()[0].consumer();
				prev.file = this.outputFile();
				this.map = SourceMapGenerator.fromSourceMap(prev, { ignoreInvalidMapping: true });
			} else {
				this.map = new SourceMapGenerator({
					file: this.outputFile(),
					ignoreInvalidMapping: true
				});
				this.map.addMapping({
					generated: {
						column: 0,
						line: 1
					},
					original: {
						column: 0,
						line: 1
					},
					source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
				});
			}
			if (this.isSourcesContent()) this.setSourcesContent();
			if (this.root && this.previous().length > 0) this.applyPrevMaps();
			if (this.isAnnotation()) this.addAnnotation();
			if (this.isInline()) return [this.css];
			else return [this.css, this.map];
		}
		generateString() {
			this.css = "";
			this.map = new SourceMapGenerator({
				file: this.outputFile(),
				ignoreInvalidMapping: true
			});
			let line = 1;
			let column = 1;
			let noSource = "<no source>";
			let mapping = {
				generated: {
					column: 0,
					line: 0
				},
				original: {
					column: 0,
					line: 0
				},
				source: ""
			};
			let last, lines;
			this.stringify(this.root, (str, node, type) => {
				this.css += str;
				if (node && type !== "end") {
					mapping.generated.line = line;
					mapping.generated.column = column - 1;
					if (node.source && node.source.start) {
						mapping.source = this.sourcePath(node);
						mapping.original.line = node.source.start.line;
						mapping.original.column = node.source.start.column - 1;
						this.map.addMapping(mapping);
					} else {
						mapping.source = noSource;
						mapping.original.line = 1;
						mapping.original.column = 0;
						this.map.addMapping(mapping);
					}
				}
				lines = str.match(/\n/g);
				if (lines) {
					line += lines.length;
					last = str.lastIndexOf("\n");
					column = str.length - last;
				} else column += str.length;
				if (node && type !== "start") {
					let p = node.parent || { raws: {} };
					if (!(node.type === "decl" || node.type === "atrule" && !node.nodes) || node !== p.last || p.raws.semicolon) if (node.source && node.source.end) {
						mapping.source = this.sourcePath(node);
						mapping.original.line = node.source.end.line;
						mapping.original.column = node.source.end.column - 1;
						mapping.generated.line = line;
						mapping.generated.column = column - 2;
						this.map.addMapping(mapping);
					} else {
						mapping.source = noSource;
						mapping.original.line = 1;
						mapping.original.column = 0;
						mapping.generated.line = line;
						mapping.generated.column = column - 1;
						this.map.addMapping(mapping);
					}
				}
			});
		}
		isAnnotation() {
			if (this.isInline()) return true;
			if (typeof this.mapOpts.annotation !== "undefined") return this.mapOpts.annotation;
			if (this.previous().length) return this.previous().some((i) => i.annotation);
			return true;
		}
		isInline() {
			if (typeof this.mapOpts.inline !== "undefined") return this.mapOpts.inline;
			let annotation = this.mapOpts.annotation;
			if (typeof annotation !== "undefined" && annotation !== true) return false;
			if (this.previous().length) return this.previous().some((i) => i.inline);
			return true;
		}
		isMap() {
			if (typeof this.opts.map !== "undefined") return !!this.opts.map;
			return this.previous().length > 0;
		}
		isSourcesContent() {
			if (typeof this.mapOpts.sourcesContent !== "undefined") return this.mapOpts.sourcesContent;
			if (this.previous().length) return this.previous().some((i) => i.withContent());
			return true;
		}
		outputFile() {
			if (this.opts.to) return this.path(this.opts.to);
			else if (this.opts.from) return this.path(this.opts.from);
			else return "to.css";
		}
		path(file) {
			if (this.mapOpts.absolute) return file;
			if (file.charCodeAt(0) === 60) return file;
			if (/^\w+:\/\//.test(file)) return file;
			let cached = this.memoizedPaths.get(file);
			if (cached) return cached;
			let from = this.opts.to ? dirname$1(this.opts.to) : ".";
			if (typeof this.mapOpts.annotation === "string") from = dirname$1(resolve$1(from, this.mapOpts.annotation));
			let path = relative(from, file);
			this.memoizedPaths.set(file, path);
			return path;
		}
		previous() {
			if (!this.previousMaps) {
				this.previousMaps = [];
				if (this.root) this.root.walk((node) => {
					if (node.source && node.source.input.map) {
						let map = node.source.input.map;
						if (!this.previousMaps.includes(map)) this.previousMaps.push(map);
					}
				});
				else {
					let input = new Input(this.originalCSS, this.opts);
					if (input.map) this.previousMaps.push(input.map);
				}
			}
			return this.previousMaps;
		}
		setSourcesContent() {
			let already = {};
			if (this.root) this.root.walk((node) => {
				if (node.source) {
					let from = node.source.input.from;
					if (from && !already[from]) {
						already[from] = true;
						let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
						this.map.setSourceContent(fromUrl, node.source.input.css);
					}
				}
			});
			else if (this.css) {
				let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
				this.map.setSourceContent(from, this.css);
			}
		}
		sourcePath(node) {
			if (this.mapOpts.from) return this.toUrl(this.mapOpts.from);
			else if (this.usesFileUrls) return this.toFileUrl(node.source.input.from);
			else return this.toUrl(this.path(node.source.input.from));
		}
		toBase64(str) {
			if (Buffer) return Buffer.from(str).toString("base64");
			else return window.btoa(unescape(encodeURIComponent(str)));
		}
		toFileUrl(path) {
			let cached = this.memoizedFileURLs.get(path);
			if (cached) return cached;
			if (pathToFileURL) {
				let fileURL = pathToFileURL(path).toString();
				this.memoizedFileURLs.set(path, fileURL);
				return fileURL;
			} else throw new Error("`map.absolute` option is not available in this PostCSS build");
		}
		toUrl(path) {
			let cached = this.memoizedURLs.get(path);
			if (cached) return cached;
			if (sep$1 === "\\") path = path.replace(/\\/g, "/");
			let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
			this.memoizedURLs.set(path, url);
			return url;
		}
	};
	module.exports = MapGenerator;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let AtRule = require_at_rule();
	let Comment = require_comment();
	let Declaration = require_declaration();
	let Root = require_root();
	let Rule = require_rule();
	let tokenizer = require_tokenize();
	const SAFE_COMMENT_NEIGHBOR = {
		empty: true,
		space: true
	};
	function findLastWithPosition(tokens) {
		for (let i = tokens.length - 1; i >= 0; i--) {
			let token = tokens[i];
			let pos = token[3] || token[2];
			if (pos) return pos;
		}
	}
	function tokensToString(tokens, from, to) {
		let result = "";
		for (let i = from; i < to; i++) result += tokens[i][1];
		return result;
	}
	var Parser = class {
		constructor(input) {
			this.input = input;
			this.root = new Root();
			this.current = this.root;
			this.spaces = "";
			this.semicolon = false;
			this.createTokenizer();
			this.root.source = {
				input,
				start: {
					column: 1,
					line: 1,
					offset: 0
				}
			};
		}
		atrule(token) {
			let node = new AtRule();
			node.name = token[1].slice(1);
			if (node.name === "") this.unnamedAtrule(node, token);
			this.init(node, token[2]);
			let type;
			let prev;
			let shift;
			let last = false;
			let open = false;
			let params = [];
			let brackets = [];
			while (!this.tokenizer.endOfFile()) {
				token = this.tokenizer.nextToken();
				type = token[0];
				if (type === "(" || type === "[") brackets.push(type === "(" ? ")" : "]");
				else if (type === "{" && brackets.length > 0) brackets.push("}");
				else if (type === brackets[brackets.length - 1]) brackets.pop();
				if (brackets.length === 0) if (type === ";") {
					node.source.end = this.getPosition(token[2]);
					node.source.end.offset++;
					this.semicolon = true;
					break;
				} else if (type === "{") {
					open = true;
					break;
				} else if (type === "}") {
					if (params.length > 0) {
						shift = params.length - 1;
						prev = params[shift];
						while (prev && prev[0] === "space") prev = params[--shift];
						if (prev) {
							node.source.end = this.getPosition(prev[3] || prev[2]);
							node.source.end.offset++;
						}
					}
					this.end(token);
					break;
				} else params.push(token);
				else params.push(token);
				if (this.tokenizer.endOfFile()) {
					last = true;
					break;
				}
			}
			node.raws.between = this.spacesAndCommentsFromEnd(params);
			if (params.length) {
				node.raws.afterName = this.spacesAndCommentsFromStart(params);
				this.raw(node, "params", params);
				if (last) {
					token = params[params.length - 1];
					node.source.end = this.getPosition(token[3] || token[2]);
					node.source.end.offset++;
					this.spaces = node.raws.between;
					node.raws.between = "";
				}
			} else {
				node.raws.afterName = "";
				node.params = "";
			}
			if (open) {
				node.nodes = [];
				this.current = node;
			}
		}
		checkMissedSemicolon(tokens) {
			let colon = this.colon(tokens);
			if (colon === false) return;
			let founded = 0;
			let token;
			for (let j = colon - 1; j >= 0; j--) {
				token = tokens[j];
				if (token[0] !== "space") {
					founded += 1;
					if (founded === 2) break;
				}
			}
			throw this.input.error("Missed semicolon", token[0] === "word" ? token[3] + 1 : token[2]);
		}
		colon(tokens) {
			let brackets = 0;
			let prev, token, type;
			for (let [i, element] of tokens.entries()) {
				token = element;
				type = token[0];
				if (type === "(") brackets += 1;
				if (type === ")") brackets -= 1;
				if (brackets === 0 && type === ":") if (!prev) this.doubleColon(token);
				else if (prev[0] === "word" && prev[1] === "progid") continue;
				else return i;
				prev = token;
			}
			return false;
		}
		comment(token) {
			let node = new Comment();
			this.init(node, token[2]);
			node.source.end = this.getPosition(token[3] || token[2]);
			node.source.end.offset++;
			let text = token[1].slice(2, -2);
			if (!text.trim()) {
				node.text = "";
				node.raws.left = text;
				node.raws.right = "";
			} else {
				let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
				node.text = match[2];
				node.raws.left = match[1];
				node.raws.right = match[3];
			}
		}
		createTokenizer() {
			this.tokenizer = tokenizer(this.input);
		}
		decl(tokens, customProperty) {
			let node = new Declaration();
			this.init(node, tokens[0][2]);
			let last = tokens[tokens.length - 1];
			if (last[0] === ";") {
				this.semicolon = true;
				tokens.pop();
			}
			node.source.end = this.getPosition(last[3] || last[2] || findLastWithPosition(tokens));
			node.source.end.offset++;
			let start = 0;
			while (tokens[start][0] !== "word") {
				if (start === tokens.length - 1) this.unknownWord([tokens[start]]);
				start++;
			}
			node.raws.before += tokensToString(tokens, 0, start);
			node.source.start = this.getPosition(tokens[start][2]);
			let propStart = start;
			while (start < tokens.length) {
				let type = tokens[start][0];
				if (type === ":" || type === "space" || type === "comment") break;
				start++;
			}
			node.prop = tokensToString(tokens, propStart, start);
			let betweenStart = start;
			let token;
			while (start < tokens.length) {
				token = tokens[start];
				start++;
				if (token[0] === ":") break;
				if (token[0] === "word" && /\w/.test(token[1])) this.unknownWord([token]);
			}
			node.raws.between = tokensToString(tokens, betweenStart, start);
			if (node.prop[0] === "_" || node.prop[0] === "*") {
				node.raws.before += node.prop[0];
				node.prop = node.prop.slice(1);
			}
			let firstSpacesStart = start;
			while (start < tokens.length) {
				let next = tokens[start][0];
				if (next !== "space" && next !== "comment") break;
				start++;
			}
			let firstSpaces = tokens.slice(firstSpacesStart, start);
			tokens = tokens.slice(start);
			this.precheckMissedSemicolon(tokens);
			for (let i = tokens.length - 1; i >= 0; i--) {
				token = tokens[i];
				if (token[1].toLowerCase() === "!important") {
					node.important = true;
					let string = this.stringFrom(tokens, i);
					string = this.spacesFromEnd(tokens) + string;
					if (string !== " !important") node.raws.important = string;
					break;
				} else if (token[1].toLowerCase() === "important") {
					let cache = tokens.slice(0);
					let str = "";
					for (let j = i; j > 0; j--) {
						let type = cache[j][0];
						if (str.trim().startsWith("!") && type !== "space") break;
						str = cache.pop()[1] + str;
					}
					if (str.trim().startsWith("!")) {
						node.important = true;
						node.raws.important = str;
						tokens = cache;
					}
				}
				if (token[0] !== "space" && token[0] !== "comment") break;
			}
			if (tokens.some((i) => i[0] !== "space" && i[0] !== "comment")) {
				node.raws.between += firstSpaces.map((i) => i[1]).join("");
				firstSpaces = [];
			}
			this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
			if (node.value.includes(":") && !customProperty) this.checkMissedSemicolon(tokens);
		}
		doubleColon(token) {
			throw this.input.error("Double colon", { offset: token[2] }, { offset: token[2] + token[1].length });
		}
		emptyRule(token) {
			let node = new Rule();
			this.init(node, token[2]);
			node.selector = "";
			node.raws.between = "";
			this.current = node;
		}
		end(token) {
			if (this.current.nodes && this.current.nodes.length) this.current.raws.semicolon = this.semicolon;
			this.semicolon = false;
			this.current.raws.after = (this.current.raws.after || "") + this.spaces;
			this.spaces = "";
			if (this.current.parent) {
				this.current.source.end = this.getPosition(token[2]);
				this.current.source.end.offset++;
				this.current = this.current.parent;
			} else this.unexpectedClose(token);
		}
		endFile() {
			if (this.current.parent) this.unclosedBlock();
			if (this.current.nodes && this.current.nodes.length) this.current.raws.semicolon = this.semicolon;
			this.current.raws.after = (this.current.raws.after || "") + this.spaces;
			this.root.source.end = this.getPosition(this.tokenizer.position());
		}
		freeSemicolon(token) {
			this.spaces += token[1];
			if (this.current.nodes) {
				let prev = this.current.nodes[this.current.nodes.length - 1];
				if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
					prev.raws.ownSemicolon = this.spaces;
					this.spaces = "";
					prev.source.end = this.getPosition(token[2]);
					prev.source.end.offset += prev.raws.ownSemicolon.length;
				}
			}
		}
		getPosition(offset) {
			let pos = this.input.fromOffset(offset);
			return {
				column: pos.col,
				line: pos.line,
				offset
			};
		}
		init(node, offset) {
			this.current.push(node);
			node.source = {
				input: this.input,
				start: this.getPosition(offset)
			};
			node.raws.before = this.spaces;
			this.spaces = "";
			if (node.type !== "comment") this.semicolon = false;
		}
		other(start) {
			let end = false;
			let type = null;
			let colon = false;
			let bracket = null;
			let brackets = [];
			let customProperty = start[1].startsWith("--");
			let tokens = [];
			let token = start;
			while (token) {
				type = token[0];
				tokens.push(token);
				if (type === "(" || type === "[") {
					if (!bracket) bracket = token;
					brackets.push(type === "(" ? ")" : "]");
				} else if (customProperty && colon && type === "{") {
					if (!bracket) bracket = token;
					brackets.push("}");
				} else if (brackets.length === 0) {
					if (type === ";") if (colon) {
						this.decl(tokens, customProperty);
						return;
					} else break;
					else if (type === "{") {
						this.rule(tokens);
						return;
					} else if (type === "}") {
						this.tokenizer.back(tokens.pop());
						end = true;
						break;
					} else if (type === ":") colon = true;
				} else if (type === brackets[brackets.length - 1]) {
					brackets.pop();
					if (brackets.length === 0) bracket = null;
				}
				token = this.tokenizer.nextToken();
			}
			if (this.tokenizer.endOfFile()) end = true;
			if (brackets.length > 0) this.unclosedBracket(bracket);
			if (end && colon) {
				if (!customProperty) while (tokens.length) {
					token = tokens[tokens.length - 1][0];
					if (token !== "space" && token !== "comment") break;
					this.tokenizer.back(tokens.pop());
				}
				this.decl(tokens, customProperty);
			} else this.unknownWord(tokens);
		}
		parse() {
			let token;
			while (!this.tokenizer.endOfFile()) {
				token = this.tokenizer.nextToken();
				switch (token[0]) {
					case "space":
						this.spaces += token[1];
						break;
					case ";":
						this.freeSemicolon(token);
						break;
					case "}":
						this.end(token);
						break;
					case "comment":
						this.comment(token);
						break;
					case "at-word":
						this.atrule(token);
						break;
					case "{":
						this.emptyRule(token);
						break;
					default:
						this.other(token);
						break;
				}
			}
			this.endFile();
		}
		precheckMissedSemicolon() {}
		raw(node, prop, tokens, customProperty) {
			let token, type;
			let length = tokens.length;
			let value = "";
			let clean = true;
			let next, prev;
			for (let i = 0; i < length; i += 1) {
				token = tokens[i];
				type = token[0];
				if (type === "space" && i === length - 1 && !customProperty) clean = false;
				else if (type === "comment") {
					prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
					next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
					if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) if (value.slice(-1) === ",") clean = false;
					else value += token[1];
					else clean = false;
				} else value += token[1];
			}
			if (!clean) {
				let raw = tokens.reduce((all, i) => all + i[1], "");
				node.raws[prop] = {
					raw,
					value
				};
			}
			node[prop] = value;
		}
		rule(tokens) {
			tokens.pop();
			let node = new Rule();
			this.init(node, tokens[0][2]);
			node.raws.between = this.spacesAndCommentsFromEnd(tokens);
			this.raw(node, "selector", tokens);
			this.current = node;
		}
		spacesAndCommentsFromEnd(tokens) {
			let lastTokenType;
			let spaces = "";
			while (tokens.length) {
				lastTokenType = tokens[tokens.length - 1][0];
				if (lastTokenType !== "space" && lastTokenType !== "comment") break;
				spaces = tokens.pop()[1] + spaces;
			}
			return spaces;
		}
		spacesAndCommentsFromStart(tokens) {
			let next;
			let spaces = "";
			while (tokens.length) {
				next = tokens[0][0];
				if (next !== "space" && next !== "comment") break;
				spaces += tokens.shift()[1];
			}
			return spaces;
		}
		spacesFromEnd(tokens) {
			let lastTokenType;
			let spaces = "";
			while (tokens.length) {
				lastTokenType = tokens[tokens.length - 1][0];
				if (lastTokenType !== "space") break;
				spaces = tokens.pop()[1] + spaces;
			}
			return spaces;
		}
		stringFrom(tokens, from) {
			let result = "";
			for (let i = from; i < tokens.length; i++) result += tokens[i][1];
			tokens.splice(from, tokens.length - from);
			return result;
		}
		unclosedBlock() {
			let pos = this.current.source.start;
			throw this.input.error("Unclosed block", pos.line, pos.column);
		}
		unclosedBracket(bracket) {
			throw this.input.error("Unclosed bracket", { offset: bracket[2] }, { offset: bracket[2] + 1 });
		}
		unexpectedClose(token) {
			throw this.input.error("Unexpected }", { offset: token[2] }, { offset: token[2] + 1 });
		}
		unknownWord(tokens) {
			throw this.input.error("Unknown word " + tokens[0][1], { offset: tokens[0][2] }, { offset: tokens[0][2] + tokens[0][1].length });
		}
		unnamedAtrule(node, token) {
			throw this.input.error("At-rule without name", { offset: token[2] }, { offset: token[2] + token[1].length });
		}
	};
	module.exports = Parser;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let Input = require_input();
	let Parser = require_parser();
	function parse(css, opts) {
		let parser = new Parser(new Input(css, opts));
		try {
			parser.parse();
		} catch (e) {
			if (process.env.NODE_ENV !== "production") {
				if (e.name === "CssSyntaxError" && opts && opts.from) {
					if (/\.scss$/i.test(opts.from)) e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
					else if (/\.sass/i.test(opts.from)) e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
					else if (/\.less$/i.test(opts.from)) e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
				}
			}
			throw e;
		}
		return parser.root;
	}
	module.exports = parse;
	parse.default = parse;
	Container.registerParse(parse);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/warning.js
var require_warning = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let { my } = require_symbols();
	var Warning = class {
		constructor(text, opts = {}) {
			this.type = "warning";
			this.text = text;
			if (opts.node && opts.node.source) {
				if (!opts.node[my]) Container.rebuild(opts.node);
				let range = opts.node.rangeBy(opts);
				this.line = range.start.line;
				this.column = range.start.column;
				this.endLine = range.end.line;
				this.endColumn = range.end.column;
			}
			for (let opt in opts) this[opt] = opts[opt];
		}
		toString() {
			if (this.node) return this.node.error(this.text, {
				index: this.index,
				plugin: this.plugin,
				word: this.word
			}).message;
			if (this.plugin) return this.plugin + ": " + this.text;
			return this.text;
		}
	};
	module.exports = Warning;
	Warning.default = Warning;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/result.js
var require_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Warning = require_warning();
	var Result = class {
		get content() {
			return this.css;
		}
		constructor(processor, root$1, opts) {
			this.processor = processor;
			this.messages = [];
			this.root = root$1;
			this.opts = opts;
			this.css = "";
			this.map = void 0;
		}
		toString() {
			return this.css;
		}
		warn(text, opts = {}) {
			if (!opts.plugin) {
				if (this.lastPlugin && this.lastPlugin.postcssPlugin) opts.plugin = this.lastPlugin.postcssPlugin;
			}
			let warning = new Warning(text, opts);
			this.messages.push(warning);
			return warning;
		}
		warnings() {
			return this.messages.filter((i) => i.type === "warning");
		}
	};
	module.exports = Result;
	Result.default = Result;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/warn-once.js
var require_warn_once = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let printed = {};
	module.exports = function warnOnce(message) {
		if (printed[message]) return;
		printed[message] = true;
		if (typeof console !== "undefined" && console.warn) console.warn(message);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/lazy-result.js
var require_lazy_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let Document = require_document();
	let MapGenerator = require_map_generator();
	let parse = require_parse();
	let Result = require_result();
	let Root = require_root();
	let stringify = require_stringify();
	let { isClean, my } = require_symbols();
	let warnOnce = require_warn_once();
	const TYPE_TO_CLASS_NAME = {
		atrule: "AtRule",
		comment: "Comment",
		decl: "Declaration",
		document: "Document",
		root: "Root",
		rule: "Rule"
	};
	const PLUGIN_PROPS = {
		AtRule: true,
		AtRuleExit: true,
		Comment: true,
		CommentExit: true,
		Declaration: true,
		DeclarationExit: true,
		Document: true,
		DocumentExit: true,
		Once: true,
		OnceExit: true,
		postcssPlugin: true,
		prepare: true,
		Root: true,
		RootExit: true,
		Rule: true,
		RuleExit: true
	};
	const NOT_VISITORS = {
		Once: true,
		postcssPlugin: true,
		prepare: true
	};
	const CHILDREN = 0;
	function isPromise(obj) {
		return typeof obj === "object" && typeof obj.then === "function";
	}
	function getEvents(node) {
		let key = false;
		let type = TYPE_TO_CLASS_NAME[node.type];
		if (node.type === "decl") key = node.prop.toLowerCase();
		else if (node.type === "atrule") key = node.name.toLowerCase();
		if (key && node.append) return [
			type,
			type + "-" + key,
			CHILDREN,
			type + "Exit",
			type + "Exit-" + key
		];
		else if (key) return [
			type,
			type + "-" + key,
			type + "Exit",
			type + "Exit-" + key
		];
		else if (node.append) return [
			type,
			CHILDREN,
			type + "Exit"
		];
		else return [type, type + "Exit"];
	}
	function toStack(node) {
		let events;
		if (node.type === "document") events = [
			"Document",
			CHILDREN,
			"DocumentExit"
		];
		else if (node.type === "root") events = [
			"Root",
			CHILDREN,
			"RootExit"
		];
		else events = getEvents(node);
		return {
			eventIndex: 0,
			events,
			iterator: 0,
			node,
			visitorIndex: 0,
			visitors: []
		};
	}
	function cleanMarks(node) {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			next[isClean] = false;
			if (next.nodes) for (let i of next.nodes) stack.push(i);
		}
		return node;
	}
	let postcss = {};
	var LazyResult = class LazyResult {
		get content() {
			return this.stringify().content;
		}
		get css() {
			return this.stringify().css;
		}
		get map() {
			return this.stringify().map;
		}
		get messages() {
			return this.sync().messages;
		}
		get opts() {
			return this.result.opts;
		}
		get processor() {
			return this.result.processor;
		}
		get root() {
			return this.sync().root;
		}
		get [Symbol.toStringTag]() {
			return "LazyResult";
		}
		constructor(processor, css, opts) {
			this.stringified = false;
			this.processed = false;
			let root$1;
			if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) root$1 = cleanMarks(css);
			else if (css instanceof LazyResult || css instanceof Result) {
				root$1 = cleanMarks(css.root);
				if (css.map) {
					if (typeof opts.map === "undefined") opts.map = {};
					if (!opts.map.inline) opts.map.inline = false;
					opts.map.prev = css.map;
				}
			} else {
				let parser = parse;
				if (opts.syntax) parser = opts.syntax.parse;
				if (opts.parser) parser = opts.parser;
				if (parser.parse) parser = parser.parse;
				try {
					root$1 = parser(css, opts);
				} catch (error) {
					this.processed = true;
					this.error = error;
				}
				if (root$1 && !root$1[my])
 /* c8 ignore next 2 */
				Container.rebuild(root$1);
			}
			this.result = new Result(processor, root$1, opts);
			this.helpers = {
				...postcss,
				postcss,
				result: this.result
			};
			this.plugins = this.processor.plugins.map((plugin$1) => {
				if (typeof plugin$1 === "object" && plugin$1.prepare) return {
					...plugin$1,
					...plugin$1.prepare(this.result)
				};
				else return plugin$1;
			});
		}
		async() {
			if (this.error) return Promise.reject(this.error);
			if (this.processed) return Promise.resolve(this.result);
			if (!this.processing) this.processing = this.runAsync();
			return this.processing;
		}
		catch(onRejected) {
			return this.async().catch(onRejected);
		}
		finally(onFinally) {
			return this.async().then(onFinally, onFinally);
		}
		getAsyncError() {
			throw new Error("Use process(css).then(cb) to work with async plugins");
		}
		handleError(error, node) {
			let plugin$1 = this.result.lastPlugin;
			try {
				if (node) node.addToError(error);
				this.error = error;
				if (error.name === "CssSyntaxError" && !error.plugin) {
					error.plugin = plugin$1.postcssPlugin;
					error.setMessage();
				} else if (plugin$1.postcssVersion) {
					if (process.env.NODE_ENV !== "production") {
						let pluginName = plugin$1.postcssPlugin;
						let pluginVer = plugin$1.postcssVersion;
						let runtimeVer = this.result.processor.version;
						let a = pluginVer.split(".");
						let b = runtimeVer.split(".");
						if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) console.error("Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below.");
					}
				}
			} catch (err) {
				/* c8 ignore next 3 */
				if (console && console.error) console.error(err);
			}
			return error;
		}
		prepareVisitors() {
			this.listeners = {};
			let add = (plugin$1, type, cb) => {
				if (!this.listeners[type]) this.listeners[type] = [];
				this.listeners[type].push([plugin$1, cb]);
			};
			for (let plugin$1 of this.plugins) if (typeof plugin$1 === "object") for (let event in plugin$1) {
				if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) throw new Error(`Unknown event ${event} in ${plugin$1.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
				if (!NOT_VISITORS[event]) {
					if (typeof plugin$1[event] === "object") for (let filter in plugin$1[event]) if (filter === "*") add(plugin$1, event, plugin$1[event][filter]);
					else add(plugin$1, event + "-" + filter.toLowerCase(), plugin$1[event][filter]);
					else if (typeof plugin$1[event] === "function") add(plugin$1, event, plugin$1[event]);
				}
			}
			this.hasListener = Object.keys(this.listeners).length > 0;
		}
		async runAsync() {
			this.plugin = 0;
			for (let i = 0; i < this.plugins.length; i++) {
				let plugin$1 = this.plugins[i];
				let promise = this.runOnRoot(plugin$1);
				if (isPromise(promise)) try {
					await promise;
				} catch (error) {
					throw this.handleError(error);
				}
			}
			this.prepareVisitors();
			if (this.hasListener) {
				let root$1 = this.result.root;
				while (!root$1[isClean]) {
					root$1[isClean] = true;
					let stack = [toStack(root$1)];
					while (stack.length > 0) {
						let promise = this.visitTick(stack);
						if (isPromise(promise)) try {
							await promise;
						} catch (e) {
							let node = stack[stack.length - 1].node;
							throw this.handleError(e, node);
						}
					}
				}
				if (this.listeners.OnceExit) for (let [plugin$1, visitor] of this.listeners.OnceExit) {
					this.result.lastPlugin = plugin$1;
					try {
						if (root$1.type === "document") {
							let roots = root$1.nodes.map((subRoot) => visitor(subRoot, this.helpers));
							await Promise.all(roots);
						} else await visitor(root$1, this.helpers);
					} catch (e) {
						throw this.handleError(e);
					}
				}
			}
			this.processed = true;
			return this.stringify();
		}
		runOnRoot(plugin$1) {
			this.result.lastPlugin = plugin$1;
			try {
				if (typeof plugin$1 === "object" && plugin$1.Once) {
					if (this.result.root.type === "document") {
						let roots = this.result.root.nodes.map((root$1) => plugin$1.Once(root$1, this.helpers));
						if (isPromise(roots[0])) return Promise.all(roots);
						return roots;
					}
					return plugin$1.Once(this.result.root, this.helpers);
				} else if (typeof plugin$1 === "function") return plugin$1(this.result.root, this.result);
			} catch (error) {
				throw this.handleError(error);
			}
		}
		stringify() {
			if (this.error) throw this.error;
			if (this.stringified) return this.result;
			this.stringified = true;
			this.sync();
			let opts = this.result.opts;
			let str = stringify;
			if (opts.syntax) str = opts.syntax.stringify;
			if (opts.stringifier) str = opts.stringifier;
			if (str.stringify) str = str.stringify;
			let rootSource = this.result.root.source;
			if (opts.map === void 0 && !(rootSource && rootSource.input && rootSource.input.map)) {
				let result = "";
				str(this.result.root, (i) => {
					result += i;
				});
				this.result.css = result;
				return this.result;
			}
			let data = new MapGenerator(str, this.result.root, this.result.opts).generate();
			this.result.css = data[0];
			this.result.map = data[1];
			return this.result;
		}
		sync() {
			if (this.error) throw this.error;
			if (this.processed) return this.result;
			this.processed = true;
			if (this.processing) throw this.getAsyncError();
			for (let plugin$1 of this.plugins) if (isPromise(this.runOnRoot(plugin$1))) throw this.getAsyncError();
			this.prepareVisitors();
			if (this.hasListener) {
				let root$1 = this.result.root;
				while (!root$1[isClean]) {
					root$1[isClean] = true;
					this.walkSync(root$1);
				}
				if (this.listeners.OnceExit) if (root$1.type === "document") for (let subRoot of root$1.nodes) this.visitSync(this.listeners.OnceExit, subRoot);
				else this.visitSync(this.listeners.OnceExit, root$1);
			}
			return this.result;
		}
		then(onFulfilled, onRejected) {
			if (process.env.NODE_ENV !== "production") {
				if (!("from" in this.opts)) warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
			}
			return this.async().then(onFulfilled, onRejected);
		}
		toString() {
			return this.css;
		}
		visitSync(visitors, node) {
			for (let [plugin$1, visitor] of visitors) {
				this.result.lastPlugin = plugin$1;
				let promise;
				try {
					promise = visitor(node, this.helpers);
				} catch (e) {
					throw this.handleError(e, node.proxyOf);
				}
				if (node.type !== "root" && node.type !== "document" && !node.parent) return true;
				if (isPromise(promise)) throw this.getAsyncError();
			}
		}
		visitTick(stack) {
			let visit = stack[stack.length - 1];
			let { node, visitors } = visit;
			if (node.type !== "root" && node.type !== "document" && !node.parent) {
				stack.pop();
				return;
			}
			if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
				let [plugin$1, visitor] = visitors[visit.visitorIndex];
				visit.visitorIndex += 1;
				if (visit.visitorIndex === visitors.length) {
					visit.visitors = [];
					visit.visitorIndex = 0;
				}
				this.result.lastPlugin = plugin$1;
				try {
					return visitor(node.toProxy(), this.helpers);
				} catch (e) {
					throw this.handleError(e, node);
				}
			}
			if (visit.iterator !== 0) {
				let iterator = visit.iterator;
				if (visit.descending) {
					visit.descending = false;
					node.indexes[iterator] += 1;
				}
				let child;
				while (child = node.nodes[node.indexes[iterator]]) {
					if (!child[isClean]) {
						child[isClean] = true;
						visit.descending = true;
						stack.push(toStack(child));
						return;
					}
					node.indexes[iterator] += 1;
				}
				visit.iterator = 0;
				delete node.indexes[iterator];
			}
			let events = visit.events;
			while (visit.eventIndex < events.length) {
				let event = events[visit.eventIndex];
				visit.eventIndex += 1;
				if (event === CHILDREN) {
					if (node.nodes && node.nodes.length) {
						node[isClean] = true;
						visit.iterator = node.getIterator();
					}
					return;
				} else if (this.listeners[event]) {
					visit.visitors = this.listeners[event];
					return;
				}
			}
			stack.pop();
		}
		walkSync(node) {
			node[isClean] = true;
			let stack = [{
				eventIndex: 0,
				events: getEvents(node),
				iterator: 0,
				node
			}];
			while (stack.length > 0) {
				let visit = stack[stack.length - 1];
				let visitNode = visit.node;
				if (visit.iterator !== 0) {
					let iterator = visit.iterator;
					if (visit.descending) {
						visit.descending = false;
						visitNode.indexes[iterator] += 1;
					}
					let child;
					let descended = false;
					while (child = visitNode.nodes[visitNode.indexes[iterator]]) {
						if (!child[isClean]) {
							child[isClean] = true;
							visit.descending = true;
							stack.push({
								eventIndex: 0,
								events: getEvents(child),
								iterator: 0,
								node: child
							});
							descended = true;
							break;
						}
						visitNode.indexes[iterator] += 1;
					}
					if (descended) continue;
					visit.iterator = 0;
					delete visitNode.indexes[iterator];
				}
				if (visit.eventIndex < visit.events.length) {
					let event = visit.events[visit.eventIndex];
					visit.eventIndex += 1;
					if (event === CHILDREN) {
						if (visitNode.nodes && visitNode.nodes.length) visit.iterator = visitNode.getIterator();
					} else {
						let visitors = this.listeners[event];
						if (visitors) {
							if (this.visitSync(visitors, visitNode.toProxy())) stack.pop();
						}
					}
					continue;
				}
				stack.pop();
			}
		}
		warnings() {
			return this.sync().warnings();
		}
	};
	LazyResult.registerPostcss = (dependant) => {
		postcss = dependant;
	};
	module.exports = LazyResult;
	LazyResult.default = LazyResult;
	Root.registerLazyResult(LazyResult);
	Document.registerLazyResult(LazyResult);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/no-work-result.js
var require_no_work_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let MapGenerator = require_map_generator();
	let parse = require_parse();
	let Result = require_result();
	let stringify = require_stringify();
	let warnOnce = require_warn_once();
	var NoWorkResult = class {
		get content() {
			return this.result.css;
		}
		get css() {
			return this.result.css;
		}
		get map() {
			return this.result.map;
		}
		get messages() {
			return [];
		}
		get opts() {
			return this.result.opts;
		}
		get processor() {
			return this.result.processor;
		}
		get root() {
			if (this._root) return this._root;
			let root$1;
			let parser = parse;
			try {
				root$1 = parser(this._css, this._opts);
			} catch (error) {
				this.error = error;
			}
			if (this.error) throw this.error;
			else {
				this._root = root$1;
				return root$1;
			}
		}
		get [Symbol.toStringTag]() {
			return "NoWorkResult";
		}
		constructor(processor, css, opts) {
			css = css.toString();
			this.stringified = false;
			this._processor = processor;
			this._css = css;
			this._opts = opts;
			this._map = void 0;
			let str = stringify;
			this.result = new Result(this._processor, void 0, this._opts);
			this.result.css = css;
			let self = this;
			Object.defineProperty(this.result, "root", { get() {
				return self.root;
			} });
			let map = new MapGenerator(str, void 0, this._opts, css);
			if (map.isMap()) {
				let [generatedCSS, generatedMap] = map.generate();
				if (generatedCSS) this.result.css = generatedCSS;
				if (generatedMap) this.result.map = generatedMap;
			} else {
				map.clearAnnotation();
				this.result.css = map.css;
			}
		}
		async() {
			if (this.error) return Promise.reject(this.error);
			return Promise.resolve(this.result);
		}
		catch(onRejected) {
			return this.async().catch(onRejected);
		}
		finally(onFinally) {
			return this.async().then(onFinally, onFinally);
		}
		sync() {
			if (this.error) throw this.error;
			return this.result;
		}
		then(onFulfilled, onRejected) {
			if (process.env.NODE_ENV !== "production") {
				if (!("from" in this._opts)) warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
			}
			return this.async().then(onFulfilled, onRejected);
		}
		toString() {
			return this._css;
		}
		warnings() {
			return [];
		}
	};
	module.exports = NoWorkResult;
	NoWorkResult.default = NoWorkResult;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/processor.js
var require_processor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Document = require_document();
	let LazyResult = require_lazy_result();
	let NoWorkResult = require_no_work_result();
	let Root = require_root();
	var Processor = class {
		constructor(plugins = []) {
			this.version = "8.5.26";
			this.plugins = this.normalize(plugins);
		}
		normalize(plugins) {
			let normalized = [];
			for (let i of plugins) {
				if (i.postcss === true) i = i();
				else if (i.postcss) i = i.postcss;
				if (typeof i === "object" && Array.isArray(i.plugins)) normalized = normalized.concat(i.plugins);
				else if (typeof i === "object" && i.postcssPlugin) normalized.push(i);
				else if (typeof i === "function") normalized.push(i);
				else if (typeof i === "object" && (i.parse || i.stringify)) {
					if (process.env.NODE_ENV !== "production") throw new Error("PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation.");
				} else throw new Error(i + " is not a PostCSS plugin");
			}
			return normalized;
		}
		process(css, opts = {}) {
			if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) return new NoWorkResult(this, css, opts);
			else return new LazyResult(this, css, opts);
		}
		use(plugin$1) {
			this.plugins = this.plugins.concat(this.normalize([plugin$1]));
			return this;
		}
	};
	module.exports = Processor;
	Processor.default = Processor;
	Root.registerProcessor(Processor);
	Document.registerProcessor(Processor);
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/postcss.js
var require_postcss = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let AtRule = require_at_rule();
	let Comment = require_comment();
	let Container = require_container();
	let CssSyntaxError = require_css_syntax_error();
	let Declaration = require_declaration();
	let Document = require_document();
	let fromJSON = require_fromJSON();
	let Input = require_input();
	let LazyResult = require_lazy_result();
	let list = require_list();
	let Node = require_node();
	let parse = require_parse();
	let Processor = require_processor();
	let Result = require_result();
	let Root = require_root();
	let Rule = require_rule();
	let stringify = require_stringify();
	let Warning = require_warning();
	function postcss(...plugins) {
		if (plugins.length === 1 && Array.isArray(plugins[0])) plugins = plugins[0];
		return new Processor(plugins);
	}
	postcss.plugin = function plugin$1(name, initializer) {
		let warningPrinted = false;
		function creator(...args) {
			if (console && console.warn && !warningPrinted) {
				warningPrinted = true;
				console.warn(name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration");
				if (process.env.LANG && process.env.LANG.startsWith("cn"))
 /* c8 ignore next 7 */
				console.warn(name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226");
			}
			let transformer = initializer(...args);
			transformer.postcssPlugin = name;
			transformer.postcssVersion = new Processor().version;
			return transformer;
		}
		let cache;
		Object.defineProperty(creator, "postcss", { get() {
			if (!cache) cache = creator();
			return cache;
		} });
		creator.process = function(css, processOpts, pluginOpts) {
			return postcss([creator(pluginOpts)]).process(css, processOpts);
		};
		return creator;
	};
	postcss.stringify = stringify;
	postcss.parse = parse;
	postcss.fromJSON = fromJSON;
	postcss.list = list;
	postcss.comment = (defaults) => new Comment(defaults);
	postcss.atRule = (defaults) => new AtRule(defaults);
	postcss.decl = (defaults) => new Declaration(defaults);
	postcss.rule = (defaults) => new Rule(defaults);
	postcss.root = (defaults) => new Root(defaults);
	postcss.document = (defaults) => new Document(defaults);
	postcss.CssSyntaxError = CssSyntaxError;
	postcss.Declaration = Declaration;
	postcss.Container = Container;
	postcss.Processor = Processor;
	postcss.Document = Document;
	postcss.Comment = Comment;
	postcss.Warning = Warning;
	postcss.AtRule = AtRule;
	postcss.Result = Result;
	postcss.Input = Input;
	postcss.Rule = Rule;
	postcss.Root = Root;
	postcss.Node = Node;
	LazyResult.registerPostcss(postcss);
	module.exports = postcss;
	postcss.default = postcss;
}));

//#endregion
//#region ../../node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/postcss.mjs
var import_postcss = /* @__PURE__ */ __toESM(require_postcss(), 1);
var postcss_default = import_postcss.default;
const stringify = import_postcss.default.stringify;
const fromJSON = import_postcss.default.fromJSON;
const plugin = import_postcss.default.plugin;
const parse = import_postcss.default.parse;
const list = import_postcss.default.list;
const document = import_postcss.default.document;
const comment = import_postcss.default.comment;
const atRule = import_postcss.default.atRule;
const rule = import_postcss.default.rule;
const decl = import_postcss.default.decl;
const root = import_postcss.default.root;
const CssSyntaxError = import_postcss.default.CssSyntaxError;
const Declaration = import_postcss.default.Declaration;
const Container = import_postcss.default.Container;
const Processor = import_postcss.default.Processor;
const Document = import_postcss.default.Document;
const Comment = import_postcss.default.Comment;
const Warning = import_postcss.default.Warning;
const AtRule = import_postcss.default.AtRule;
const Result = import_postcss.default.Result;
const Input = import_postcss.default.Input;
const Rule = import_postcss.default.Rule;
const Root = import_postcss.default.Root;
const Node = import_postcss.default.Node;

//#endregion
export { validateColorGradingContract as a, parseStartExpression as c, COLOR_GRADING_ADVANCED_LIMITS as i, readClipTiming as l, FFPROBE_PATH_ENV as n, COMPOSITION_ATTRIBUTES as o, findFfBinary as r, parseNumeric as s, postcss_default as t };