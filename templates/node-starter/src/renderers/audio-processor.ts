import type { AudioProcessor } from "@gatewai.studio/node-sdk/browser";
import { WebGPUAudioProcessor } from "@gatewai.studio/webgpu-renderers";

const PARAM_ORDER = ["strength"];

/**
 * WGSL Audio Compute Shader Template
 *
 * Audio effects run 100% on the GPU via compute shaders on multi-channel Float32Array PCM buffers.
 *
 * Buffer layout:
 * - @group(0) @binding(0): Uniforms (sampleRate, parameters, frame, numSamples, numChannels)
 * - @group(0) @binding(1): inputChannels (storage, read)
 * - @group(0) @binding(2): outputChannels (storage, read_write)
 * - @group(0) @binding(3): state (storage, read_write) - persistent ring buffer / filter state across frames
 * - @group(0) @binding(4..N): dynamic parameter modulation signals
 */
export const STARTER_AUDIO_SHADER_TEMPLATE = () => `
struct Uniforms {
    sampleRate      : f32,
    strength        : f32,
    hasStrengthSig  : f32,
    numSamples      : f32,
    numChannels     : f32,
    _pad0           : f32,
    _pad1           : f32,
    _pad2           : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(0) @binding(1) var<storage, read> inputChannels : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputChannels : array<f32>;
@group(0) @binding(3) var<storage, read_write> state : array<f32>;
@group(0) @binding(4) var<storage, read> strengthSignal : array<f32>;

// DSP Safety: Prevent NaN/Inf propagation
fn is_nan_or_inf(v: f32) -> bool {
    return (v != v) || (abs(v) > 3.402823466e+38f);
}

// DSP Safety: Soft saturation using hyperbolic tangent to avoid harsh digital clipping
fn soft_clip(x: f32) -> f32 {
    let exp2x = exp(2.0f * x);
    return (exp2x - 1.0f) / (exp2x + 1.0f);
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
    if (gid.x != 0u) { return; }

    let numSamples = u32(u.numSamples);
    let numChannels = u32(u.numChannels);

    for (var i = 0u; i < numSamples; i = i + 1u) {
        // 1. Resolve dynamic signal modulation per sample
        var effStrength = u.strength;
        if (u.hasStrengthSig > 0.5f) {
            effStrength = strengthSignal[i];
        }
        effStrength = clamp(effStrength, 0.0f, 10.0f);

        // 2. Process each audio channel
        for (var c = 0u; c < numChannels; c = c + 1u) {
            let sampleIdx = c * numSamples + i;
            var sample = inputChannels[sampleIdx];
            if (is_nan_or_inf(sample)) {
                sample = 0.0f;
            }

            // Custom DSP processing math
            var processed = sample * (1.0f + effStrength * 0.5f);

            // Apply soft clipping
            outputChannels[sampleIdx] = soft_clip(processed);
        }
    }
}
`;

/**
 * WebGPU Audio Processor
 *
 * Implements the AudioProcessor interface for offline audio rendering and real-time playback.
 * Dispatches audio compute shaders via WebGPUAudioProcessor.
 *
 * @param channels Multi-channel PCM Float32Array arrays (channels[0] = Left, channels[1] = Right).
 * @param sampleRate Audio sampling rate in Hz (typically 44100 or 48000).
 * @param virtualMedia VirtualMediaData containing the node operation config and signal bindings.
 * @param ctx Context containing GPUDevice, frame, fps, elapsedMs, durationMs, and renderId.
 */
export const starterAudioProcessor: AudioProcessor = async (
	channels,
	sampleRate,
	virtualMedia,
	ctx,
) => {
	if (!ctx?.device) {
		return;
	}

	const op = (virtualMedia.operation as Record<string, unknown>) || {};
	const inputs = (op.inputs as Record<string, any>) || {};

	const numChannels = channels.length;
	if (numChannels === 0) return;
	const numSamples = channels[0].length;
	if (numSamples === 0) return;

	const strength =
		typeof op.strength === "number" ? Math.max(0, op.strength) : 1.0;

	// Check if dynamic strength signal is connected
	const strengthHandleId = op.strengthHandleId;
	const hasStrengthSig =
		typeof strengthHandleId === "string" &&
		inputs[strengthHandleId]?.connectionValid
			? 1.0
			: 0.0;

	const nodeId = (op.id as string) || "starter-audio";
	const frame = ctx.frame ?? 0;
	const fps = ctx.fps ?? 24;

	// Dispatch GPU compute shader for audio DSP
	await WebGPUAudioProcessor.process(
		ctx.device,
		nodeId,
		channels,
		sampleRate,
		virtualMedia,
		frame,
		fps,
		STARTER_AUDIO_SHADER_TEMPLATE,
		() => [
			sampleRate,
			strength,
			hasStrengthSig,
			numSamples,
			numChannels,
			0,
			0,
			0,
		],
		16, // Uniform byte alignment
		1, // Persistent state float count (e.g. Ring buffer length + 1)
		ctx?.renderId,
		true,
		ctx?.elapsedMs,
		ctx?.durationMs,
		undefined,
		undefined,
		PARAM_ORDER,
	);
};
