/// <reference types="webgpu" />

import { buildWGSLSignalFn } from "./wgsl.js";

export interface SignalRegistryResource {
	type: "1d-buffer" | "2d-texture";
	buffer?: GPUBuffer;
	texture?: GPUTexture;
	textureView?: GPUTextureView;
	lastProcessedFrame: number;
	lastFingerprint?: string;
	uniformBuffer?: GPUBuffer;
	bindGroup?: GPUBindGroup;
}

interface DeviceSignalResources {
	resources: Map<string, SignalRegistryResource>;
	dummy1x1TextureView: GPUTextureView | null;
	dummyBuffer: GPUBuffer | null;
	pipelineCache: Map<string, GPUComputePipeline | GPURenderPipeline>;
}

export class SignalRegistry {
	private deviceCache = new WeakMap<GPUDevice, DeviceSignalResources>();

	private getDeviceResources(device: GPUDevice): DeviceSignalResources {
		let res = this.deviceCache.get(device);
		if (!res) {
			res = {
				resources: new Map(),
				dummy1x1TextureView: null,
				dummyBuffer: null,
				pipelineCache: new Map(),
			};
			this.deviceCache.set(device, res);
		}
		return res;
	}

	/**
	 * Clears frame resources. Typically called on renderId reset or context destruction.
	 */
	public clear(renderId: string, device?: GPUDevice): void {
		if (!device) return;
		const dr = this.deviceCache.get(device);
		if (!dr) return;
		const prefix = `${renderId}:`;
		for (const [key, resource] of dr.resources.entries()) {
			if (key.startsWith(prefix)) {
				resource.buffer?.destroy();
				resource.texture?.destroy();
				resource.uniformBuffer?.destroy();
				dr.resources.delete(key);
			}
		}
	}

	public getDummy1x1TextureView(device: GPUDevice): GPUTextureView {
		const dr = this.getDeviceResources(device);
		if (dr.dummy1x1TextureView) return dr.dummy1x1TextureView;

		const texture = device.createTexture({
			size: [1, 1, 1],
			format: "rgba32float",
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			label: "dummy_1x1_signal_texture",
		});

		const commandEncoder = device.createCommandEncoder();
		const buffer = device.createBuffer({
			size: 256,
			usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(buffer, 0, new Float32Array([0.0, 0.0, 0.0, 1.0]));
		commandEncoder.copyBufferToTexture(
			{ buffer, bytesPerRow: 256 },
			{ texture },
			{ width: 1, height: 1 },
		);
		device.queue.submit([commandEncoder.finish()]);

		dr.dummy1x1TextureView = texture.createView();
		return dr.dummy1x1TextureView;
	}

	public getDummyBuffer(device: GPUDevice): GPUBuffer {
		const dr = this.getDeviceResources(device);
		if (dr.dummyBuffer) return dr.dummyBuffer;

		dr.dummyBuffer = device.createBuffer({
			size: 4,
			usage: GPUBufferUsage.STORAGE,
			label: "dummy_signal_buffer",
		});
		return dr.dummyBuffer;
	}

	/**
	 * Resolves or creates a 1D GPUBuffer for a time-varying signal.
	 * If not evaluated yet for the current frame, it dispatches the generator compute pass.
	 */
	public getOrCreate1DBuffer(
		device: GPUDevice,
		_encoder: GPUCommandEncoder,
		nodeId: string,
		elapsedTime: number,
		duration: number,
		sd: any,
		numSamples: number,
		sampleRate: number,
		renderId?: string,
		frame?: number,
		fps?: number,
	): GPUBuffer {
		let normalizedSd = sd;
		if (sd && !sd.customWGSL && !sd.wgsl && sd.fnBody) {
			const fnRes = buildWGSLSignalFn(sd, nodeId);
			normalizedSd = {
				...sd,
				customWGSL: fnRes.wgsl,
				signalFnName: fnRes.name,
				fnOutputType: fnRes.outputType,
				outputType: fnRes.outputType,
			};
		}

		const dr = this.getDeviceResources(device);
		const key = `${renderId ?? "global"}:${nodeId}`;
		let res = dr.resources.get(key);

		const bufferSize = numSamples * 4;

		if (!res) {
			const buffer = device.createBuffer({
				size: bufferSize,
				usage:
					GPUBufferUsage.STORAGE |
					GPUBufferUsage.COPY_DST |
					GPUBufferUsage.COPY_SRC,
				label: `signal_1d_buffer_${nodeId}`,
			});
			res = {
				type: "1d-buffer",
				buffer,
				lastProcessedFrame: -1,
			};
			dr.resources.set(key, res);
		}

		const fingerprint = normalizedSd
			? JSON.stringify({
					amplitude: normalizedSd.amplitude,
					frequency: normalizedSd.frequency,
					phase: normalizedSd.phase,
					offset: normalizedSd.offset,
					fnParams: normalizedSd.fnParams,
					customWGSL: normalizedSd.customWGSL || normalizedSd.fnBody,
					type: normalizedSd.type,
				})
			: "";

		const cacheFrame = frame !== undefined ? frame : elapsedTime;

		if (
			res.lastProcessedFrame === cacheFrame &&
			res.lastFingerprint === fingerprint
		) {
			return res.buffer!;
		}

		if (res.lastFingerprint !== fingerprint) {
			res.bindGroup = undefined;
		}

		// Update last processed frame and fingerprint
		res.lastProcessedFrame = cacheFrame;
		res.lastFingerprint = fingerprint;

		// Populate buffer
		if (
			normalizedSd.type === "generator" &&
			(normalizedSd.customWGSL || normalizedSd.fnBody)
		) {
			const signalEncoder = device.createCommandEncoder({
				label: `signal_1d_encoder_${nodeId}`,
			});
			this.dispatch1DGenerator(
				device,
				signalEncoder,
				res,
				elapsedTime,
				duration,
				normalizedSd,
				numSamples,
				sampleRate,
				frame,
				fps,
			);
			device.queue.submit([signalEncoder.finish()]);
		} else {
			// fallback
			const val = Number(normalizedSd.offset ?? 0.0);
			const flat = new Float32Array(numSamples).fill(val);
			device.queue.writeBuffer(res.buffer!, 0, flat);
		}

		return res.buffer!;
	}

	/**
	 * Resolves or creates a 2D GPUTextureView for spatial modulation.
	 * If not evaluated yet for the current frame, it dispatches the generator render pass.
	 */
	public getOrCreate2DTextureView(
		device: GPUDevice,
		_encoder: GPUCommandEncoder,
		nodeId: string,
		elapsedTime: number,
		duration: number,
		sd: any,
		width: number,
		_height: number,
		renderId?: string,
		frame?: number,
		fps?: number,
	): GPUTextureView {
		let normalizedSd = sd;
		if (sd && !sd.customWGSL && !sd.wgsl && sd.fnBody) {
			const fnRes = buildWGSLSignalFn(sd, nodeId);
			normalizedSd = {
				...sd,
				customWGSL: fnRes.wgsl,
				signalFnName: fnRes.name,
				fnOutputType: fnRes.outputType,
				outputType: fnRes.outputType,
			};
		}

		const dr = this.getDeviceResources(device);
		const key = `${renderId ?? "global"}:${nodeId}`;
		let res = dr.resources.get(key);

		const targetWidth = width;
		const targetHeight = 1;

		if (res && res.texture) {
			if (
				res.texture.width !== targetWidth ||
				res.texture.height !== targetHeight
			) {
				const toDestroy = res.texture;
				device.queue
					.onSubmittedWorkDone()
					.then(() => {
						try {
							toDestroy.destroy();
						} catch (_) {}
					})
					.catch(() => {});
				dr.resources.delete(key);
				res = undefined;
			}
		}

		if (!res) {
			const texture = device.createTexture({
				size: [targetWidth, targetHeight, 1],
				format: "rgba32float",
				usage:
					GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.RENDER_ATTACHMENT |
					GPUTextureUsage.COPY_DST,
				label: `signal_2d_texture_${nodeId}`,
			});
			res = {
				type: "2d-texture",
				texture,
				textureView: texture.createView(),
				lastProcessedFrame: -1,
			};
			dr.resources.set(key, res);
		}

		const fingerprint = normalizedSd
			? JSON.stringify({
					amplitude: normalizedSd.amplitude,
					frequency: normalizedSd.frequency,
					phase: normalizedSd.phase,
					offset: normalizedSd.offset,
					fnParams: normalizedSd.fnParams,
					customWGSL: normalizedSd.customWGSL || normalizedSd.fnBody,
					type: normalizedSd.type,
				})
			: "";

		const cacheFrame = frame !== undefined ? frame : elapsedTime;

		if (
			res.lastProcessedFrame === cacheFrame &&
			res.lastFingerprint === fingerprint
		) {
			return res.textureView!;
		}

		if (res.lastFingerprint !== fingerprint) {
			res.bindGroup = undefined;
		}

		// Update last processed frame and fingerprint
		res.lastProcessedFrame = cacheFrame;
		res.lastFingerprint = fingerprint;

		// Populate texture
		if (
			normalizedSd.type === "generator" &&
			(normalizedSd.customWGSL || normalizedSd.fnBody)
		) {
			const signalEncoder = device.createCommandEncoder({
				label: `signal_2d_encoder_${nodeId}`,
			});
			this.dispatch2DGenerator(
				device,
				signalEncoder,
				res,
				elapsedTime,
				duration,
				normalizedSd,
				targetWidth,
				targetHeight,
				frame,
				fps,
			);
			device.queue.submit([signalEncoder.finish()]);
		} else {
			// fallback
			const val = Number(normalizedSd.offset ?? 0.0);
			const flat = new Float32Array(targetWidth * targetHeight * 4);
			for (let i = 0; i < targetWidth * targetHeight; i++) {
				flat[i * 4] = val;
				flat[i * 4 + 1] = val;
				flat[i * 4 + 2] = val;
				flat[i * 4 + 3] = 1.0;
			}
			device.queue.writeTexture(
				{ texture: res.texture! },
				flat,
				{
					bytesPerRow: targetWidth * 16,
					rowsPerImage: targetHeight,
				},
				[targetWidth, targetHeight, 1],
			);
		}

		return res.textureView!;
	}

	private dispatch1DGenerator(
		device: GPUDevice,
		encoder: GPUCommandEncoder,
		res: SignalRegistryResource,
		elapsedTime: number,
		duration: number,
		sd: any,
		numSamples: number,
		sampleRate: number,
		frame?: number,
		fps?: number,
	): void {
		const customWGSL = sd.customWGSL ?? sd.wgsl ?? "";
		const signalFnName = sd.signalFnName ?? sd.name ?? "signal_fn";
		const outputType = sd.fnOutputType ?? sd.outputType ?? "f32";

		const dr = this.getDeviceResources(device);
		const shaderKey = `1d_${sd.nodeId}_${customWGSL}`;
		let pipeline = dr.pipelineCache.get(shaderKey) as
			| GPUComputePipeline
			| undefined;

		if (!pipeline) {
			const fnParams = sd.fnParams ?? [];
			const paramVals: string[] = [];
			for (const p of fnParams) {
				const val = p.defaultValue;
				paramVals.push(val % 1 === 0 ? `${val.toFixed(1)}f` : `${val}f`);
			}

			const args = [
				"t",
				"progress",
				"0.0",
				"0.0",
				"idx",
				"u.numSamples",
				"u.frame",
				"vec4<f32>(progress, 0.5, 0.5, 1.0)",
				"u.t_elapsed",
				"u.duration",
				...paramVals,
			];
			let callExpr = `${signalFnName}(${args.join(", ")})`;
			if (
				outputType === "vec2f" ||
				outputType === "vec3f" ||
				outputType === "vec4f"
			) {
				callExpr = `${callExpr}.x`;
			}

			const shaderCode = `
struct GeneratorUniforms {
    sampleRate : f32,
    baseTime   : f32,
    frame      : u32,
    numSamples : u32,
    amplitude  : f32,
    frequency  : f32,
    phase      : f32,
    offset     : f32,
    t_elapsed  : f32,
    duration   : f32,
    pad1       : f32,
    pad2       : f32,
};

@group(0) @binding(0) var<uniform> u : GeneratorUniforms;
@group(0) @binding(1) var<storage, read_write> outSignal : array<f32>;

${customWGSL}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
    let idx = gid.x;
    if (idx >= u.numSamples) { return; }

    let progress = f32(idx) / f32(u.numSamples - 1u);
    let t = u.baseTime + f32(idx) / u.sampleRate;
    
    // Evaluate custom signal
    let val = ${callExpr};
    outSignal[idx] = val;
}
			`;

			const shaderModule = device.createShaderModule({
				label: `signal_1d_generator_${sd.nodeId}.wgsl`,
				code: shaderCode,
			});

			pipeline = device.createComputePipeline({
				label: `Signal1DComputePipeline_${sd.nodeId}`,
				layout: "auto",
				compute: {
					module: shaderModule,
					entryPoint: "main",
				},
			});

			dr.pipelineCache.set(shaderKey, pipeline);
		}

		// Update Uniforms
		const baseTime =
			frame !== undefined && fps !== undefined && fps > 0
				? frame / fps
				: elapsedTime;
		const uFrame = frame !== undefined ? frame : 0;
		const uniformBufferData = new ArrayBuffer(12 * 4);
		const f32View = new Float32Array(uniformBufferData);
		const u32View = new Uint32Array(uniformBufferData);

		f32View[0] = sampleRate;
		f32View[1] = baseTime;
		u32View[2] = uFrame;
		u32View[3] = numSamples;
		f32View[4] = sd.amplitude ?? 1.0;
		f32View[5] = sd.frequency ?? 1.0;
		f32View[6] = sd.phase ?? 0.0;
		f32View[7] = sd.offset ?? 0.0;
		f32View[8] = elapsedTime;
		f32View[9] = duration;
		f32View[10] = 0.0; // pad1
		f32View[11] = 0.0; // pad2

		if (!res.uniformBuffer) {
			res.uniformBuffer = device.createBuffer({
				size: uniformBufferData.byteLength,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				label: `signal_1d_uniform_buffer_${sd.nodeId}`,
			});
		}
		device.queue.writeBuffer(res.uniformBuffer, 0, uniformBufferData);

		if (!res.bindGroup) {
			res.bindGroup = device.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: { buffer: res.uniformBuffer } },
					{ binding: 1, resource: { buffer: res.buffer! } },
				],
			});
		}

		const pass = encoder.beginComputePass({
			label: `signal_1d_compute_pass_${sd.nodeId}`,
		});
		pass.setPipeline(pipeline);
		pass.setBindGroup(0, res.bindGroup);
		const workgroups = Math.ceil(numSamples / 64);
		pass.dispatchWorkgroups(workgroups);
		pass.end();
	}

	private dispatch2DGenerator(
		device: GPUDevice,
		encoder: GPUCommandEncoder,
		res: SignalRegistryResource,
		elapsedTime: number,
		duration: number,
		sd: any,
		_width: number,
		_height: number,
		frame?: number,
		fps?: number,
	): void {
		const customWGSL = sd.customWGSL ?? sd.wgsl ?? "";
		const signalFnName = sd.signalFnName ?? sd.name ?? "signal_fn";

		const dr = this.getDeviceResources(device);
		const shaderKey = `2d_${sd.nodeId}_${customWGSL}`;
		let pipeline = dr.pipelineCache.get(shaderKey) as
			| GPURenderPipeline
			| undefined;

		if (!pipeline) {
			const fnParams = sd.fnParams ?? [];
			const paramVals: string[] = [];
			for (const p of fnParams) {
				const val = p.defaultValue;
				paramVals.push(val % 1 === 0 ? `${val.toFixed(1)}f` : `${val}f`);
			}

			const tExpr = "u.baseTime + (in.uv.x - 0.5) * 2.0";
			const tElapsedExpr = "u.t_elapsed + (in.uv.x - 0.5) * 2.0";

			const args = [
				tExpr,
				"in.uv.x",
				"1.0 - in.uv.y",
				"0.0",
				"0u",
				"1u",
				"u.frame",
				"vec4<f32>(in.uv.x, 1.0 - in.uv.y, 0.5, 1.0)",
				tElapsedExpr,
				"u.duration",
				...paramVals,
			];
			const callExpr = `${signalFnName}(${args.join(", ")})`;
			const returnExpr = `return vec4<f32>(vec3<f32>(${callExpr}), 1.0);`;

			const shaderCode = `
struct VSOut {
    @builtin(position) pos : vec4<f32>,
    @location(0) uv        : vec2<f32>,
};

struct GeneratorUniforms {
    baseTime   : f32,
    frame      : u32,
    amplitude  : f32,
    frequency  : f32,
    phase      : f32,
    offset     : f32,
    t_elapsed  : f32,
    duration   : f32,
};

@group(0) @binding(0) var<uniform> u : GeneratorUniforms;

${customWGSL}

@vertex fn vs(@builtin(vertex_index) vi: u32) -> VSOut {
    var pos = array<vec2<f32>, 4>(
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0,  1.0),
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0)
    );
    var uv = array<vec2<f32>, 4>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0)
    );
    return VSOut(vec4<f32>(pos[vi], 0.0, 1.0), uv[vi]);
}

@fragment fn fs(in : VSOut) -> @location(0) vec4<f32> {
    ${returnExpr}
}
			`;

			const shaderModule = device.createShaderModule({
				label: `signal_2d_generator_${sd.nodeId}.wgsl`,
				code: shaderCode,
			});

			pipeline = device.createRenderPipeline({
				label: `Signal2DPipeline_${sd.nodeId}`,
				layout: "auto",
				vertex: {
					module: shaderModule,
					entryPoint: "vs",
				},
				fragment: {
					module: shaderModule,
					entryPoint: "fs",
					targets: [{ format: "rgba32float" }],
				},
				primitive: { topology: "triangle-strip" },
			});

			dr.pipelineCache.set(shaderKey, pipeline);
		}

		// Update Uniforms
		const baseTime =
			frame !== undefined && fps !== undefined && fps > 0
				? frame / fps
				: elapsedTime;
		const uFrame = frame !== undefined ? frame : 0;
		const uniformBufferData = new ArrayBuffer(8 * 4);
		const f32View = new Float32Array(uniformBufferData);
		const u32View = new Uint32Array(uniformBufferData);

		f32View[0] = baseTime;
		u32View[1] = uFrame;
		f32View[2] = sd.amplitude ?? 1.0;
		f32View[3] = sd.frequency ?? 1.0;
		f32View[4] = sd.phase ?? 0.0;
		f32View[5] = sd.offset ?? 0.0;
		f32View[6] = elapsedTime;
		f32View[7] = duration;

		if (!res.uniformBuffer) {
			res.uniformBuffer = device.createBuffer({
				size: uniformBufferData.byteLength,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				label: `signal_2d_uniform_buffer_${sd.nodeId}`,
			});
		}
		device.queue.writeBuffer(res.uniformBuffer, 0, uniformBufferData);

		if (!res.bindGroup) {
			res.bindGroup = device.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [{ binding: 0, resource: { buffer: res.uniformBuffer } }],
			});
		}

		const pass = encoder.beginRenderPass({
			label: `signal_2d_render_pass_${sd.nodeId}`,
			colorAttachments: [
				{
					view: res.textureView!,
					loadOp: "clear",
					storeOp: "store",
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
				},
			],
		});

		pass.setPipeline(pipeline);
		pass.setBindGroup(0, res.bindGroup);
		pass.draw(4);
		pass.end();
	}
}

export const signalRegistry = new SignalRegistry();
