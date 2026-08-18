import { compositeWgsl } from "../shaders/composite.js";
import type { BindGroupCache } from "./bind-group-cache.js";
import { BufferPool } from "./buffer-pool.js";
import type { BlendMode } from "./index.js";
import type { SamplerCache } from "./sampler-cache.js";

class TexturePool {
	private textures: GPUTexture[] = [];
	private index = 0;

	getTexture(
		device: GPUDevice,
		width: number,
		height: number,
		format: GPUTextureFormat,
		exclude?: GPUTexture | GPUTexture[],
	): GPUTexture {
		const excludeSet = new Set(
			Array.isArray(exclude) ? exclude : exclude ? [exclude] : [],
		);

		for (let i = this.index; i < this.textures.length; i++) {
			const tex = this.textures[i];
			if (
				tex.width === width &&
				tex.height === height &&
				tex.format === format &&
				!excludeSet.has(tex)
			) {
				// Move matching texture to 'used' portion of the pool
				const found = this.textures[i];
				this.textures[i] = this.textures[this.index];
				this.textures[this.index] = found;
				return this.textures[this.index++];
			}
		}

		const tex = device.createTexture({
			size: [width, height],
			format,
			usage:
				GPUTextureUsage.RENDER_ATTACHMENT |
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_SRC,
		});

		// Insert new texture at current index to mark it as used
		this.textures.splice(this.index, 0, tex);
		this.index++;
		return tex;
	}

	reset(): void {
		this.index = 0;
	}

	destroy(): void {
		for (const tex of this.textures) {
			tex.destroy();
		}
		this.textures = [];
		this.index = 0;
	}
}

const BLEND_MODE_MAP: Record<BlendMode, number> = {
	normal: 0,
	"source-over": 0,
	multiply: 1,
	screen: 2,
	overlay: 3,
	darken: 4,
	lighten: 5,
	"color-dodge": 6,
	"color-burn": 7,
	"hard-light": 8,
	"soft-light": 9,
	difference: 10,
	exclusion: 11,
	hue: 12,
	saturation: 13,
	color: 14,
	luminosity: 15,
	"mask-in": 16,
	"destination-in": 16,
	"mask-out": 17,
	"destination-out": 17,
	"source-in": 18,
	"source-out": 19,
	"source-atop": 20,
	"destination-over": 21,
	"destination-atop": 22,
	lighter: 23,
	copy: 24,
	xor: 25,
};

export class EffectPipeline {
	private device: GPUDevice;
	private compositeUniformLayout: GPUBindGroupLayout;
	private dualTextureLayout: GPUBindGroupLayout;
	private compositePipeline: GPURenderPipeline;
	private compositePool: BufferPool;
	private texturePool: TexturePool;
	private compositeData = new Uint32Array(4);

	constructor(device: GPUDevice, format: GPUTextureFormat) {
		this.device = device;

		this.compositePool = new BufferPool(
			1024,
			GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		);
		this.texturePool = new TexturePool();

		this.compositeUniformLayout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
			],
		});

		this.dualTextureLayout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.FRAGMENT,
					texture: { sampleType: "float" },
				},
				{
					binding: 1,
					visibility: GPUShaderStage.FRAGMENT,
					texture: { sampleType: "float" },
				},
				{
					binding: 2,
					visibility: GPUShaderStage.FRAGMENT,
					sampler: { type: "filtering" },
				},
			],
		});

		const pipelineLayout = device.createPipelineLayout({
			bindGroupLayouts: [this.compositeUniformLayout, this.dualTextureLayout],
		});

		const module = device.createShaderModule({
			label: "composite.wgsl",
			code: compositeWgsl,
		});

		this.compositePipeline = device.createRenderPipeline({
			label: "CompositePipeline",
			layout: pipelineLayout,
			vertex: { module, entryPoint: "vs" },
			fragment: {
				module,
				entryPoint: "fs",
				targets: [{ format }],
			},
			primitive: { topology: "triangle-strip" },
		});
	}

	resetPools(): void {
		this.compositePool.reset();
		this.texturePool.reset();
	}

	getTexture(
		device: GPUDevice,
		width: number,
		height: number,
		format: GPUTextureFormat,
		exclude?: GPUTexture | GPUTexture[],
	): GPUTexture {
		return this.texturePool.getTexture(device, width, height, format, exclude);
	}

	getBuffer(device: GPUDevice, data: ArrayBufferView): GPUBuffer {
		return this.compositePool.getBuffer(device, data);
	}

	composite(
		encoder: GPUCommandEncoder,
		bindGroupCache: BindGroupCache,
		samplerCache: SamplerCache,
		baseTex: GPUTexture,
		overlayTex: GPUTexture,
		mode: BlendMode,
		format: GPUTextureFormat,
		exclude?: GPUTexture | GPUTexture[],
	): GPUTexture {
		const sampler = samplerCache.getSampler(this.device);

		const combinedExclude: GPUTexture[] = [baseTex, overlayTex];
		if (exclude) {
			if (Array.isArray(exclude)) {
				combinedExclude.push(...exclude);
			} else {
				combinedExclude.push(exclude);
			}
		}

		const outTex = this.texturePool.getTexture(
			this.device,
			baseTex.width,
			baseTex.height,
			format,
			combinedExclude,
		);

		this.compositeData[0] = BLEND_MODE_MAP[mode] ?? 0;
		const buffer = this.compositePool.getBuffer(
			this.device,
			this.compositeData,
		);

		const pass = encoder.beginRenderPass({
			colorAttachments: [
				{
					view: outTex.createView(),
					loadOp: "clear",
					storeOp: "store",
					clearValue: { r: 0, g: 0, b: 0, a: 0 },
				},
			],
		});

		pass.setPipeline(this.compositePipeline);
		pass.setBindGroup(
			0,
			this.device.createBindGroup({
				layout: this.compositeUniformLayout,
				entries: [{ binding: 0, resource: { buffer } }],
			}),
		);
		pass.setBindGroup(
			1,
			bindGroupCache.getCompositeBindGroup(
				this.device,
				this.dualTextureLayout,
				baseTex,
				overlayTex,
				sampler,
			),
		);
		pass.draw(4);
		pass.end();

		return outTex;
	}

	destroy(): void {
		this.compositePool.destroy();
		this.texturePool.destroy();
	}
}
