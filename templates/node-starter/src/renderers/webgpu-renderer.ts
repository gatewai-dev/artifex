/// <reference types="webgpu" />
import type { WebGPUNodeRenderer } from "@gatewai.studio/node-sdk/browser";

/**
 * WGSL Shader Template
 *
 * Demonstrates standard Gatewai WebGPU bind group conventions:
 * - @group(0) @binding(0): Uniform parameters (strength, options, signal presence flags)
 * - @group(1) @binding(0), @binding(1): Input texture & linear sampler
 * - @group(2) @binding(0..N), @binding(N+1): Dynamic modulation signal textures & sampler
 */
export const STARTER_WGSL_SHADER = `
struct Uniforms {
	strength        : f32,
	hasStrengthSig  : f32,
	mode            : f32, // 0 = standard, 1 = invert, 2 = vivid
	_pad0           : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(1) @binding(0) var tex        : texture_2d<f32>;
@group(1) @binding(1) var samp       : sampler;

@group(2) @binding(0) var strengthSigTex : texture_2d<f32>;
@group(2) @binding(1) var signalSamp     : sampler;

@fragment
fn fs_main(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {
	var color = textureSample(tex, samp, uv);

	// 1. Resolve dynamic signal modulation if connected
	var effStrength = u.strength;
	if (u.hasStrengthSig > 0.5) {
		effStrength = textureSampleLevel(strengthSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r;
	}
	effStrength = clamp(effStrength, 0.0, 10.0);

	// 2. Perform custom transformation math
	var transformed = color.rgb;
	if (u.mode > 1.5) {
		// Vivid mode (boost saturation and contrast)
		let gray = dot(transformed, vec3<f32>(0.299, 0.587, 0.114));
		transformed = mix(vec3<f32>(gray), transformed, 1.0 + effStrength * 0.5);
	} else if (u.mode > 0.5) {
		// Invert mode
		transformed = mix(transformed, vec3<f32>(1.0) - transformed, clamp(effStrength, 0.0, 1.0));
	} else {
		// Standard mode: slight exposure / gain adjustment
		transformed = transformed * (1.0 + effStrength * 0.1);
	}

	return vec4<f32>(transformed, color.a);
}
`;

/**
 * WebGPU Node Renderer
 *
 * Executes both in real-time in the browser canvas and offline in the headless Artifex renderer.
 *
 * @param args Context and rendering parameters:
 * - `ctx`: RenderContextValue containing the WebGPU device, renderer instance, and shader/texture caches.
 * - `encoder`: GPUCommandEncoder for dispatching commands.
 * - `pass`: Active GPURenderPassEncoder.
 * - `targetView`: Destination GPUTextureView.
 * - `targetTexture`: Destination GPUTexture.
 * - `targetWidth`, `targetHeight`: Render target dimensions in pixels.
 * - `props`: NodeRenderProps containing virtualMedia, frame, fps, container dimensions, etc.
 * - `drawChild`: Helper to recursively render upstream child media inputs.
 */
export const StarterWebGPURenderer: WebGPUNodeRenderer = async ({
	ctx,
	pass,
	targetView,
	targetTexture,
	targetWidth,
	targetHeight,
	props,
	drawChild,
}) => {
	// 1. Render upstream child input media recursively into the target if present
	const childMedia = props.virtualMedia.children?.[0];
	if (childMedia) {
		await drawChild(childMedia);
	}

	// 2. Custom WebGPU visual rendering pass
	// Access ctx.device, ctx.shaderStore, and GPU pipelines to apply post-processing shaders.
};
