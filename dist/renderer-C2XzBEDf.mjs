import "./dist-Dsv4ud6r.mjs";
import { a as WebGPUAudioProcessor } from "./dist-rOgtcmwL.mjs";
import { t as defineRenderer } from "./renderer-BMji3WdP.mjs";

//#region ../../nodes/node-stereo-panning/dist/renderer.mjs
const PANNING_SHADER_TEMPLATE = () => `
struct Uniforms {
    sampleRate  : f32,
    pan         : f32,
    baseTime    : f32,
    frame       : f32,
    numSamples  : f32,
    numChannels : f32,
    pad1        : f32,
    pad2        : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(0) @binding(1) var<storage, read> inputChannels : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputChannels : array<f32>;
@group(0) @binding(3) var<storage, read_write> state : array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
    if (gid.x != 0u) { return; }

    let numSamples = u32(u.numSamples);
    let numChannels = u32(u.numChannels);
    
    let clampedPan = max(-1.0f, min(1.0f, u.pan));
    var leftGain = 1.0f;
    var rightGain = 1.0f;

    if (clampedPan < 0.0f) {
        rightGain = 1.0f + clampedPan;
    } else if (clampedPan > 0.0f) {
        leftGain = 1.0f - clampedPan;
    }

    for (var index = 0u; index < numSamples; index = index + 1u) {
        if (numChannels > 1u) {
            outputChannels[index] = inputChannels[index] * leftGain;
            outputChannels[numSamples + index] = inputChannels[numSamples + index] * rightGain;
        } else {
            outputChannels[index] = inputChannels[index] * leftGain;
        }
    }

    // Dummy reference to prevent state binding from being optimized out
    state[0] = state[0];
}
`;
const stereoPanningAudioProcessor = async (channels, sampleRate, node, ctx) => {
	if (!ctx?.device) throw new Error("GPUDevice is required for WebGPU Stereo Panning.");
	const pan = node.operation?.pan ?? 0;
	const clampedPan = Math.max(-1, Math.min(1, pan));
	if (channels.length === 0) return;
	const numSamples = channels[0].length;
	if (numSamples === 0) return;
	if (channels.length === 1) {
		const rightChannel = new Float32Array(numSamples);
		rightChannel.set(channels[0]);
		channels.push(rightChannel);
	}
	const numChannels = channels.length;
	const nodeId = node.operation?.id || "stereo-panning";
	const frame = ctx.frame ?? 0;
	const fps = ctx.fps ?? 24;
	await WebGPUAudioProcessor.process(ctx.device, nodeId, channels, sampleRate, node, frame, fps, PANNING_SHADER_TEMPLATE, () => [
		sampleRate,
		clampedPan,
		0,
		frame,
		numSamples,
		numChannels,
		0,
		0
	], 8, 1, ctx?.renderId, true, ctx?.elapsedMs, ctx?.durationMs);
};
var renderers_default = defineRenderer({ audioProcessor: stereoPanningAudioProcessor });

//#endregion
export { renderers_default as default };