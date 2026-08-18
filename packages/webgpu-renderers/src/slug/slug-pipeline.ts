import { BufferPool } from "../renderer2d/buffer-pool.js";
import type { Color, DrawOpts } from "../renderer2d/index.js";
import type { TransformStack } from "../renderer2d/transform-stack.js";
import { slugWgsl } from "../shaders/slug.js";
import type { SlugFont } from "./slug-loader.js";

export class SlugPipeline {
	private device: GPUDevice;
	private pipeline: GPURenderPipeline;
	private uniformLayout: GPUBindGroupLayout;
	private textureLayout: GPUBindGroupLayout;
	private uniformPool: BufferPool;
	private instancePool: BufferPool;
	private uniformData = new Float32Array(16);

	constructor(device: GPUDevice, format: GPUTextureFormat) {
		this.device = device;
		this.uniformPool = new BufferPool(
			1024,
			GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		);
		this.instancePool = new BufferPool(
			131072,
			GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		);

		const module = device.createShaderModule({
			label: "slug.wgsl",
			code: slugWgsl,
		});

		this.uniformLayout = device.createBindGroupLayout({
			label: "SlugUniformLayout",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
			],
		});

		this.textureLayout = device.createBindGroupLayout({
			label: "SlugTextureLayout",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.FRAGMENT,
					texture: { sampleType: "unfilterable-float" },
				},
				{
					binding: 1,
					visibility: GPUShaderStage.FRAGMENT,
					texture: { sampleType: "uint" },
				},
			],
		});

		this.pipeline = device.createRenderPipeline({
			label: "SlugPipeline",
			layout: device.createPipelineLayout({
				bindGroupLayouts: [this.uniformLayout, this.textureLayout],
			}),
			vertex: {
				module,
				entryPoint: "vs",
				buffers: [
					{
						arrayStride: 96, // 6 attributes * 4 floats * 4 bytes
						stepMode: "instance",
						attributes: [
							{ shaderLocation: 0, offset: 0, format: "float32x4" }, // aScaleBias
							{ shaderLocation: 1, offset: 16, format: "float32x4" }, // aGlyphBandScale
							{ shaderLocation: 2, offset: 32, format: "float32x4" }, // aBandMaxTexCoords
							{ shaderLocation: 3, offset: 48, format: "float32x4" }, // aAnim
							{ shaderLocation: 4, offset: 64, format: "float32x4" }, // aColor
							{ shaderLocation: 5, offset: 80, format: "float32x4" }, // aExtraParams (blurAmount, etc.)
						],
					},
				],
			},
			fragment: {
				module,
				entryPoint: "fs",
				targets: [
					{
						format,
						blend: {
							color: {
								srcFactor: "one",
								dstFactor: "one-minus-src-alpha",
								operation: "add",
							},
							alpha: {
								srcFactor: "one",
								dstFactor: "one-minus-src-alpha",
								operation: "add",
							},
						},
					},
				],
			},
			primitive: {
				topology: "triangle-list",
			},
		});
	}

	resetPools(): void {
		this.uniformPool.reset();
		this.instancePool.reset();
	}

	draw(
		pass: GPURenderPassEncoder,
		transformStack: TransformStack,
		font: SlugFont,
		instanceData: Float32Array,
		instanceCount: number,
		_color: Color | string,
		surfaceWidth: number,
		surfaceHeight: number,
		opts?: DrawOpts,
	): void {
		if (instanceCount === 0) return;

		const opacity = opts?.opacity ?? 1.0;

		transformStack.packIntoBuffer(
			this.uniformData,
			opacity,
			surfaceWidth,
			surfaceHeight,
			opts?.transform,
			opts?.customParam,
		);

		const uniformBuffer = this.uniformPool.getBuffer(
			this.device,
			this.uniformData,
		);
		const instanceBuffer = this.instancePool.getBuffer(
			this.device,
			instanceData,
		);

		const textureBindGroup = this.device.createBindGroup({
			layout: this.textureLayout,
			entries: [
				{ binding: 0, resource: font.curvesTex.createView() },
				{ binding: 1, resource: font.bandsTex.createView() },
			],
		});

		pass.setPipeline(this.pipeline);
		pass.setBindGroup(
			0,
			this.device.createBindGroup({
				layout: this.uniformLayout,
				entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
			}),
		);
		pass.setBindGroup(1, textureBindGroup);
		pass.setVertexBuffer(0, instanceBuffer);
		pass.draw(6, instanceCount);
	}

	destroy(): void {
		this.uniformPool.destroy();
		this.instancePool.destroy();
	}
}
