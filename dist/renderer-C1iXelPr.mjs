import "./dist-DtlkxQom.mjs";
import { a as WebGPUAudioProcessor } from "./dist-xl6mY7se.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-audio-reverb/dist/renderer.mjs
const PARAM_ORDER = [
	"roomSize",
	"damping",
	"wet",
	"dry",
	"width"
];
const REVERB_SHADER_TEMPLATE = () => `
struct Uniforms {
    sampleRate     : f32,
    roomSize       : f32,
    damping        : f32,
    wet            : f32,
    dry            : f32,
    width          : f32,
    hasRoomSizeSig : f32,
    hasDampingSig  : f32,
    hasWetSig      : f32,
    hasDrySig      : f32,
    hasWidthSig    : f32,
    baseTime       : f32,
    frame          : f32,
    numSamples     : f32,
    numChannels    : f32,
    pad1           : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(0) @binding(1) var<storage, read> inputChannels : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputChannels : array<f32>;
@group(0) @binding(3) var<storage, read_write> state : array<f32>;
@group(0) @binding(4) var<storage, read> roomSizeSignal : array<f32>;
@group(0) @binding(5) var<storage, read> dampingSignal  : array<f32>;
@group(0) @binding(6) var<storage, read> wetSignal      : array<f32>;
@group(0) @binding(7) var<storage, read> drySignal      : array<f32>;
@group(0) @binding(8) var<storage, read> widthSignal    : array<f32>;

fn processComb(f: u32, inputVal: f32, damping: f32, roomSize: f32) -> f32 {
    let metaOffset = f * 4u;
    let size = u32(state[metaOffset]);
    let startOffset = u32(state[metaOffset + 1u]);
    var bufferIndex = u32(state[metaOffset + 2u]);
    var filterStore = state[metaOffset + 3u];
    if (isnan(filterStore) || isinf(filterStore)) { filterStore = 0.0f; }

    var output = state[startOffset + bufferIndex];
    if (isnan(output) || isinf(output)) { output = 0.0f; }

    filterStore = output * (1.0f - damping) + filterStore * damping;
    var nextVal = inputVal + filterStore * roomSize;
    if (isnan(nextVal) || isinf(nextVal)) { nextVal = 0.0f; }
    state[startOffset + bufferIndex] = clamp(nextVal, -4.0f, 4.0f);

    bufferIndex = (bufferIndex + 1u) % size;

    state[metaOffset + 2u] = f32(bufferIndex);
    state[metaOffset + 3u] = filterStore;
    return output;
}

fn processAllpass(f: u32, inputVal: f32) -> f32 {
    let metaOffset = f * 4u;
    let size = u32(state[metaOffset]);
    let startOffset = u32(state[metaOffset + 1u]);
    var bufferIndex = u32(state[metaOffset + 2u]);

    var bufOut = state[startOffset + bufferIndex];
    if (isnan(bufOut) || isinf(bufOut)) { bufOut = 0.0f; }

    var nextVal = inputVal + bufOut * 0.5f;
    if (isnan(nextVal) || isinf(nextVal)) { nextVal = 0.0f; }
    state[startOffset + bufferIndex] = clamp(nextVal, -4.0f, 4.0f);

    let output = bufOut - inputVal;
    bufferIndex = (bufferIndex + 1u) % size;

    state[metaOffset + 2u] = f32(bufferIndex);
    return output;
}

fn tanh(x: f32) -> f32 {
    let exp2x = exp(2.0f * x);
    return (exp2x - 1.0f) / (exp2x + 1.0f);
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
    if (gid.x != 0u) { return; }

    let numSamples = u32(u.numSamples);
    let numChannels = u32(u.numChannels);
    let fixedgain: f32 = 0.015f;

    if (numChannels == 1u) {
        for (var index = 0u; index < numSamples; index = index + 1u) {
            // Dynamic parameter signal evaluation
            var effRoomSize = u.roomSize;
            if (u.hasRoomSizeSig > 0.5f) { effRoomSize = roomSizeSignal[index]; }
            effRoomSize = clamp(effRoomSize, 0.0f, 0.98f);

            var effDamping = u.damping;
            if (u.hasDampingSig > 0.5f) { effDamping = dampingSignal[index]; }
            effDamping = clamp(effDamping, 0.0f, 1.0f) * 0.4f;

            var effWet = u.wet;
            if (u.hasWetSig > 0.5f) { effWet = wetSignal[index]; }
            effWet = clamp(effWet, 0.0f, 1.0f) * 3.0f;

            var effDry = u.dry;
            if (u.hasDrySig > 0.5f) { effDry = drySignal[index]; }
            effDry = clamp(effDry, 0.0f, 2.0f);

            var x = inputChannels[index];
            if (isnan(x) || isinf(x)) { x = 0.0f; }
            let inputVal = x * fixedgain;

            var combSum = 0.0f;
            for (var j = 0u; j < 8u; j = j + 1u) {
                combSum = combSum + processComb(j, inputVal, effDamping, effRoomSize);
            }

            var revOut = combSum;
            for (var j = 0u; j < 4u; j = j + 1u) {
                revOut = processAllpass(8u + j, revOut);
            }

            var outVal = x * effDry + revOut * effWet;
            if (isnan(outVal) || isinf(outVal)) { outVal = 0.0f; }

            if (outVal > 1.0f) { outVal = 1.0f; }
            else if (outVal < -1.0f) { outVal = -1.0f; }
            else if (outVal > 0.9f) { outVal = 0.9f + 0.1f * tanh((outVal - 0.9f) / 0.1f); }
            else if (outVal < -0.9f) { outVal = -0.9f + 0.1f * tanh((outVal + 0.9f) / 0.1f); }

            outputChannels[index] = outVal;
        }
    } else {
        for (var index = 0u; index < numSamples; index = index + 1u) {
            // Dynamic parameter signal evaluation
            var effRoomSize = u.roomSize;
            if (u.hasRoomSizeSig > 0.5f) { effRoomSize = roomSizeSignal[index]; }
            effRoomSize = clamp(effRoomSize, 0.0f, 0.98f);

            var effDamping = u.damping;
            if (u.hasDampingSig > 0.5f) { effDamping = dampingSignal[index]; }
            effDamping = clamp(effDamping, 0.0f, 1.0f) * 0.4f;

            var effWet = u.wet;
            if (u.hasWetSig > 0.5f) { effWet = wetSignal[index]; }
            effWet = clamp(effWet, 0.0f, 1.0f) * 3.0f;

            var effDry = u.dry;
            if (u.hasDrySig > 0.5f) { effDry = drySignal[index]; }
            effDry = clamp(effDry, 0.0f, 2.0f);

            var effWidth = u.width;
            if (u.hasWidthSig > 0.5f) { effWidth = widthSignal[index]; }
            effWidth = clamp(effWidth, 0.0f, 1.0f);

            let wet1 = effWet * (effWidth / 2.0f + 0.5f);
            let wet2 = effWet * ((1.0f - effWidth) / 2.0f);

            var inputL = inputChannels[index];
            if (isnan(inputL) || isinf(inputL)) { inputL = 0.0f; }
            var inputR = inputChannels[numSamples + index];
            if (isnan(inputR) || isinf(inputR)) { inputR = 0.0f; }

            let inputVal = (inputL + inputR) * fixedgain;

            // Left channel (Filters 0-11)
            var combSumL = 0.0f;
            for (var j = 0u; j < 8u; j = j + 1u) {
                combSumL = combSumL + processComb(j, inputVal, effDamping, effRoomSize);
            }
            var revOutL = combSumL;
            for (var j = 0u; j < 4u; j = j + 1u) {
                revOutL = processAllpass(8u + j, revOutL);
            }

            // Right channel (Filters 12-23)
            var combSumR = 0.0f;
            for (var j = 0u; j < 8u; j = j + 1u) {
                combSumR = combSumR + processComb(12u + j, inputVal, effDamping, effRoomSize);
            }
            var revOutR = combSumR;
            for (var j = 0u; j < 4u; j = j + 1u) {
                revOutR = processAllpass(20u + j, revOutR);
            }

            var outL = inputL * effDry + revOutL * wet1 + revOutR * wet2;
            var outR = inputR * effDry + revOutR * wet1 + revOutL * wet2;
            if (isnan(outL) || isinf(outL)) { outL = 0.0f; }
            if (isnan(outR) || isinf(outR)) { outR = 0.0f; }

            if (outL > 1.0f) { outL = 1.0f; } else if (outL < -1.0f) { outL = -1.0f; }
            else if (outL > 0.9f) { outL = 0.9f + 0.1f * tanh((outL - 0.9f) / 0.1f); }
            else if (outL < -0.9f) { outL = -0.9f + 0.1f * tanh((outL + 0.9f) / 0.1f); }

            if (outR > 1.0f) { outR = 1.0f; } else if (outR < -1.0f) { outR = -1.0f; }
            else if (outR > 0.9f) { outR = 0.9f + 0.1f * tanh((outR - 0.9f) / 0.1f); }
            else if (outR < -0.9f) { outR = -0.9f + 0.1f * tanh((outR + 0.9f) / 0.1f); }

            outputChannels[index] = outL;
            outputChannels[numSamples + index] = outR;
        }
    }
}
`;
const leftCombLengths = [
	1116,
	1188,
	1277,
	1356,
	1422,
	1491,
	1557,
	1617
];
const leftAllpassLengths = [
	556,
	441,
	341,
	225
];
const reverbAudioProcessor = async (channels, sampleRate, virtualMedia, ctx) => {
	if (!ctx?.device) throw new Error("GPUDevice is required for WebGPU Reverb.");
	const op = virtualMedia.operation || {};
	const inputs = op.inputs || {};
	const numChannels = channels.length;
	if (numChannels === 0) return;
	const numSamples = channels[0].length;
	if (numSamples === 0) return;
	const roomSizeInternal = Math.max(0, Math.min(typeof op.roomSize === "number" ? op.roomSize : .5, .98));
	const dampingInternal = Math.max(0, Math.min(typeof op.damping === "number" ? op.damping : .5, 1));
	const wetInternal = Math.max(0, Math.min(typeof op.wet === "number" ? op.wet : .3, 1));
	const dryInternal = Math.max(0, Math.min(typeof op.dry === "number" ? op.dry : 1, 1));
	const widthInternal = Math.max(0, Math.min(typeof op.width === "number" ? op.width : 1, 1));
	const isHandleConnected = (handleIdKey) => {
		const handleId = op[handleIdKey];
		if (typeof handleId !== "string" || !handleId) return false;
		const input = inputs[handleId];
		return Boolean(input?.connectionValid && input.outputItem && (input.outputItem.type === "Signal" || input.outputItem.type === "Number"));
	};
	const hasRoomSizeSig = isHandleConnected("roomSizeHandleId") ? 1 : 0;
	const hasDampingSig = isHandleConnected("dampingHandleId") ? 1 : 0;
	const hasWetSig = isHandleConnected("wetHandleId") ? 1 : 0;
	const hasDrySig = isHandleConnected("dryHandleId") ? 1 : 0;
	const hasWidthSig = isHandleConnected("widthHandleId") ? 1 : 0;
	const scale = sampleRate / 44100;
	const nodeId = op.id || "audio-reverb";
	const frame = ctx.frame ?? 0;
	const fps = ctx.fps ?? 24;
	const sizesL = [];
	const sizesR = [];
	leftCombLengths.forEach((len) => {
		sizesL.push(Math.round(len * scale));
	});
	leftCombLengths.forEach((len) => {
		sizesR.push(Math.round((len + 23) * scale));
	});
	leftAllpassLengths.forEach((len) => {
		sizesL.push(Math.round(len * scale));
	});
	leftAllpassLengths.forEach((len) => {
		sizesR.push(Math.round((len + 23) * scale));
	});
	const totalMetadataFloats = 96;
	let totalDelaySamples = 0;
	const filterSizes = [...sizesL, ...sizesR];
	for (const size of filterSizes) totalDelaySamples += size;
	const stateFloatCount = totalMetadataFloats + totalDelaySamples;
	const metaData = new Float32Array(totalMetadataFloats);
	let currentOffset = totalMetadataFloats;
	for (let f = 0; f < 24; f++) {
		const size = filterSizes[f];
		metaData[f * 4] = size;
		metaData[f * 4 + 1] = currentOffset;
		metaData[f * 4 + 2] = 0;
		metaData[f * 4 + 3] = 0;
		currentOffset += size;
	}
	await WebGPUAudioProcessor.process(ctx.device, nodeId, channels, sampleRate, virtualMedia, frame, fps, REVERB_SHADER_TEMPLATE, () => [
		sampleRate,
		roomSizeInternal,
		dampingInternal,
		wetInternal,
		dryInternal,
		widthInternal,
		hasRoomSizeSig,
		hasDampingSig,
		hasWetSig,
		hasDrySig,
		hasWidthSig,
		0,
		frame,
		numSamples,
		numChannels,
		0
	], 16, stateFloatCount, ctx?.renderId, true, ctx?.elapsedMs, ctx?.durationMs, metaData, void 0, PARAM_ORDER);
};
var renderers_default = defineRenderer({ audioProcessor: reverbAudioProcessor });

//#endregion
export { renderers_default as default };