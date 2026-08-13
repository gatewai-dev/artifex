import "./dist-DtlkxQom.mjs";
import { a as WebGPUAudioProcessor } from "./dist-xl6mY7se.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-audio-compressor/dist/renderer.mjs
const PARAM_ORDER = [
	"threshold",
	"ratio",
	"attack",
	"release",
	"knee",
	"makeupGain"
];
const COMPRESSOR_SHADER_TEMPLATE = () => `
struct Uniforms {
    sampleRate        : f32,
    threshold         : f32,
    ratio             : f32,
    attack            : f32,
    release           : f32,
    knee              : f32,
    makeupGain        : f32,
    hasThresholdSig   : f32,
    hasRatioSig       : f32,
    hasAttackSig      : f32,
    hasReleaseSig     : f32,
    hasKneeSig        : f32,
    hasMakeupGainSig  : f32,
    baseTime          : f32,
    frame             : f32,
    numSamples        : f32,
    numChannels       : f32,
    pad1              : f32,
    pad2              : f32,
    pad3              : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(0) @binding(1) var<storage, read> inputChannels : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputChannels : array<f32>;
@group(0) @binding(3) var<storage, read_write> state : array<f32>; // state[0] = envelope
@group(0) @binding(4) var<storage, read> thresholdSignal  : array<f32>;
@group(0) @binding(5) var<storage, read> ratioSignal      : array<f32>;
@group(0) @binding(6) var<storage, read> attackSignal     : array<f32>;
@group(0) @binding(7) var<storage, read> releaseSignal    : array<f32>;
@group(0) @binding(8) var<storage, read> kneeSignal       : array<f32>;
@group(0) @binding(9) var<storage, read> makeupGainSignal : array<f32>;

fn log10(x: f32) -> f32 {
    return log(x) * 0.4342944819032518f;
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

    var envelope = state[0];
    if (isnan(envelope) || isinf(envelope)) {
        envelope = 0.0f;
    }

    for (var index = 0u; index < numSamples; index = index + 1u) {
        // 1. Dynamic Parameter Modulation & Anti-Explosion Clamping
        var effThreshold = u.threshold;
        if (u.hasThresholdSig > 0.5f) {
            effThreshold = thresholdSignal[index];
        }
        effThreshold = clamp(effThreshold, -120.0f, 0.0f);

        var effRatio = u.ratio;
        if (u.hasRatioSig > 0.5f) {
            effRatio = ratioSignal[index];
        }
        effRatio = clamp(effRatio, 1.0f, 100.0f);

        var effAttack = u.attack;
        if (u.hasAttackSig > 0.5f) {
            effAttack = attackSignal[index];
        }
        effAttack = clamp(effAttack, 0.0001f, 10.0f);

        var effRelease = u.release;
        if (u.hasReleaseSig > 0.5f) {
            effRelease = releaseSignal[index];
        }
        effRelease = clamp(effRelease, 0.001f, 10.0f);

        var effKnee = u.knee;
        if (u.hasKneeSig > 0.5f) {
            effKnee = kneeSignal[index];
        }
        effKnee = clamp(effKnee, 0.0f, 40.0f);

        var effMakeupGain = u.makeupGain;
        if (u.hasMakeupGainSig > 0.5f) {
            effMakeupGain = makeupGainSignal[index];
        }
        effMakeupGain = clamp(effMakeupGain, -60.0f, 36.0f);

        // 2. Safe Attack / Release Coefficients
        let attackCoeff = clamp(1.0f - exp(-1.0f / (u.sampleRate * effAttack)), 0.00001f, 1.0f);
        let releaseCoeff = clamp(1.0f - exp(-1.0f / (u.sampleRate * effRelease)), 0.00001f, 1.0f);

        // 3. Peak Detection with NaN / Inf sanitization
        var peak = 0.0f;
        for (var c = 0u; c < numChannels; c = c + 1u) {
            var val = abs(inputChannels[c * numSamples + index]);
            if (isnan(val) || isinf(val)) {
                val = 0.0f;
            }
            if (val > peak) {
                peak = val;
            }
        }
        
        // 4. Convert Peak to dBFS
        let dB = 20.0f * log10(max(peak, 1e-9f));

        // 5. Compute target reduction (soft-knee & ratio)
        var targetReductiondB = 0.0f;
        if (effKnee > 0.0f) {
            let x = dB - effThreshold;
            if (x <= -effKnee / 2.0f) {
                targetReductiondB = 0.0f;
            } else if (x >= effKnee / 2.0f) {
                targetReductiondB = (dB - effThreshold) * (1.0f - 1.0f / effRatio);
            } else {
                let kneeTerm = x + effKnee / 2.0f;
                targetReductiondB = ((kneeTerm * kneeTerm) / (2.0f * effKnee)) * (1.0f - 1.0f / effRatio);
            }
        } else {
            if (dB > effThreshold) {
                targetReductiondB = (dB - effThreshold) * (1.0f - 1.0f / effRatio);
            }
        }

        targetReductiondB = clamp(targetReductiondB, 0.0f, 120.0f);

        // 6. Envelope Smoothing
        let targetGaindB = -targetReductiondB;
        if (targetGaindB < envelope) {
            envelope += (targetGaindB - envelope) * attackCoeff;
        } else {
            envelope += (targetGaindB - envelope) * releaseCoeff;
        }

        if (isnan(envelope) || isinf(envelope)) {
            envelope = 0.0f;
        }
        envelope = clamp(envelope, -120.0f, 0.0f);

        // 7. Apply linear gain and soft clipping
        let totalGaindB = clamp(envelope + effMakeupGain, -120.0f, 36.0f);
        let gainLinear = clamp(pow(10.0f, totalGaindB / 20.0f), 0.0f, 63.1f);

        for (var c = 0u; c < numChannels; c = c + 1u) {
            let sampleIndex = c * numSamples + index;
            var inVal = inputChannels[sampleIndex];
            if (isnan(inVal) || isinf(inVal)) {
                inVal = 0.0f;
            }

            var outVal = inVal * gainLinear;
            if (isnan(outVal) || isinf(outVal)) {
                outVal = 0.0f;
            }
            
            // Soft clipping at ±1.0 with smooth tanh transition starting at ±0.9
            if (outVal > 1.0f) {
                outVal = 1.0f;
            } else if (outVal < -1.0f) {
                outVal = -1.0f;
            } else if (outVal > 0.9f) {
                outVal = 0.9f + 0.1f * tanh((outVal - 0.9f) / 0.1f);
            } else if (outVal < -0.9f) {
                outVal = -0.9f + 0.1f * tanh((outVal + 0.9f) / 0.1f);
            }
            
            outputChannels[sampleIndex] = outVal;
        }
    }

    if (isnan(envelope) || isinf(envelope)) {
        state[0] = 0.0f;
    } else {
        state[0] = clamp(envelope, -120.0f, 0.0f);
    }
}
`;
const compressorAudioProcessor = async (channels, sampleRate, virtualMedia, ctx) => {
	if (!ctx?.device) throw new Error("GPUDevice is required for WebGPU Dynamics Compressor.");
	const op = virtualMedia.operation || {};
	const inputs = op.inputs || {};
	const threshold = typeof op.threshold === "number" ? op.threshold : -24;
	const ratio = typeof op.ratio === "number" ? op.ratio : 4;
	const attack = typeof op.attack === "number" ? op.attack : .003;
	const release = typeof op.release === "number" ? op.release : .25;
	const knee = typeof op.knee === "number" ? op.knee : 6;
	const makeupGain = typeof op.makeupGain === "number" ? op.makeupGain : 0;
	const isHandleConnected = (handleIdKey) => {
		const handleId = op[handleIdKey];
		if (typeof handleId !== "string" || !handleId) return false;
		const input = inputs[handleId];
		return Boolean(input?.connectionValid && input.outputItem && (input.outputItem.type === "Signal" || input.outputItem.type === "Number"));
	};
	const hasThresholdSig = isHandleConnected("thresholdHandleId") ? 1 : 0;
	const hasRatioSig = isHandleConnected("ratioHandleId") ? 1 : 0;
	const hasAttackSig = isHandleConnected("attackHandleId") ? 1 : 0;
	const hasReleaseSig = isHandleConnected("releaseHandleId") ? 1 : 0;
	const hasKneeSig = isHandleConnected("kneeHandleId") ? 1 : 0;
	const hasMakeupGainSig = isHandleConnected("makeupGainHandleId") ? 1 : 0;
	const numChannels = channels.length;
	if (numChannels === 0) return;
	const numSamples = channels[0].length;
	if (numSamples === 0) return;
	const nodeId = op.id || "audio-compressor";
	const frame = ctx.frame ?? 0;
	const fps = ctx.fps ?? 24;
	await WebGPUAudioProcessor.process(ctx.device, nodeId, channels, sampleRate, virtualMedia, frame, fps, COMPRESSOR_SHADER_TEMPLATE, (t) => [
		sampleRate,
		threshold,
		ratio,
		attack,
		release,
		knee,
		makeupGain,
		hasThresholdSig,
		hasRatioSig,
		hasAttackSig,
		hasReleaseSig,
		hasKneeSig,
		hasMakeupGainSig,
		t,
		frame,
		numSamples,
		numChannels,
		0,
		0,
		0
	], 20, 1, ctx?.renderId, true, ctx?.elapsedMs, ctx?.durationMs, void 0, void 0, PARAM_ORDER);
};
var renderers_default = defineRenderer({ audioProcessor: compressorAudioProcessor });

//#endregion
export { renderers_default as default };