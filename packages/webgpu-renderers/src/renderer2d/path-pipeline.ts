import { parseColor } from "../color.js";
import { pathWgsl } from "../shaders/path.js";
import { BufferPool } from "./buffer-pool.js";
import type { Color, DrawOpts } from "./index.js";
import type { TransformStack } from "./transform-stack.js";

export class PathPipeline {
	private device: GPUDevice;
	private pipeline: GPURenderPipeline;
	private maxPipeline: GPURenderPipeline;
	private uniformLayout: GPUBindGroupLayout;
	private uniformPool: BufferPool;
	private vertexPool: BufferPool;

	constructor(device: GPUDevice, format: GPUTextureFormat) {
		this.device = device;
		this.uniformPool = new BufferPool(
			4096,
			GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		);
		this.vertexPool = new BufferPool(
			4096,
			GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		);

		const module = device.createShaderModule({
			label: "path.wgsl",
			code: pathWgsl,
		});

		this.uniformLayout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
			],
		});

		this.pipeline = device.createRenderPipeline({
			label: "PathPipeline",
			layout: device.createPipelineLayout({
				bindGroupLayouts: [this.uniformLayout],
			}),
			vertex: {
				module,
				entryPoint: "vs",
				buffers: [
					{
						arrayStride: 8,
						attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
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
								srcFactor: "src-alpha",
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
			primitive: { topology: "triangle-strip" },
		});

		this.maxPipeline = device.createRenderPipeline({
			label: "PathPipeline.max",
			layout: device.createPipelineLayout({
				bindGroupLayouts: [this.uniformLayout],
			}),
			vertex: {
				module,
				entryPoint: "vs",
				buffers: [
					{
						arrayStride: 8,
						attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
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
								dstFactor: "one",
								operation: "max",
							},
							alpha: {
								srcFactor: "one",
								dstFactor: "one",
								operation: "max",
							},
						},
					},
				],
			},
			primitive: { topology: "triangle-strip" },
		});
	}

	resetPools(): void {
		this.uniformPool.reset();
		this.vertexPool.reset();
	}

	drawPath(
		pass: GPURenderPassEncoder,
		transformStack: TransformStack,
		pathStr: string,
		color: Color | string,
		strokeWidth: number,
		surfaceWidth: number,
		surfaceHeight: number,
		opts?: DrawOpts,
	): void {
		const segments = this.parsePath(pathStr);
		if (segments.length === 0) return;

		const c = parseColor(color);
		const opacity = opts?.opacity ?? 1.0;

		for (const segment of segments) {
			this.drawSegment(
				pass,
				transformStack,
				segment.p0,
				segment.p1,
				c,
				strokeWidth,
				surfaceWidth,
				surfaceHeight,
				opacity,
				opts,
			);
		}
	}

	private drawSegment(
		pass: GPURenderPassEncoder,
		transformStack: TransformStack,
		p0: { x: number; y: number },
		p1: { x: number; y: number },
		color: Color,
		strokeWidth: number,
		surfaceWidth: number,
		surfaceHeight: number,
		opacity: number,
		opts?: DrawOpts,
	): void {
		const data = new Float32Array(24);
		transformStack.packIntoBuffer(
			data,
			opacity,
			surfaceWidth,
			surfaceHeight,
			opts?.transform,
		);

		data[15] = strokeWidth;
		data[16] = color.r;
		data[17] = color.g;
		data[18] = color.b;
		data[19] = color.a;
		data[20] = p0.x;
		data[21] = p0.y;
		data[22] = p1.x;
		data[23] = p1.y;

		const uniformBuffer = this.uniformPool.getBuffer(this.device, data);

		// Calculate a quad that covers the line segment plus strokeWidth padding
		const dx = p1.x - p0.x;
		const dy = p1.y - p0.y;
		const len = Math.sqrt(dx * dx + dy * dy);
		if (len < 1e-6) return;

		const nx = (dx / len) * (strokeWidth * 0.5 + 1);
		const ny = (dy / len) * (strokeWidth * 0.5 + 1);
		const px = -ny;
		const py = nx;

		const vertexData = new Float32Array([
			p0.x - nx - px,
			p0.y - ny - py,
			p0.x - nx + px,
			p0.y - ny + py,
			p1.x + nx - px,
			p1.y + ny - py,
			p1.x + nx + px,
			p1.y + ny + py,
		]);
		const vertexBuffer = this.vertexPool.getBuffer(this.device, vertexData);

		const useMax = opts?.blendMode === ("max" as any);
		pass.setPipeline(useMax ? this.maxPipeline : this.pipeline);
		pass.setBindGroup(
			0,
			this.device.createBindGroup({
				layout: this.uniformLayout,
				entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
			}),
		);
		pass.setVertexBuffer(0, vertexBuffer);
		pass.draw(4);
	}

	private parsePath(pathStr: string): {
		p0: { x: number; y: number };
		p1: { x: number; y: number };
	}[] {
		const segments: {
			p0: { x: number; y: number };
			p1: { x: number; y: number };
		}[] = [];
		const parts = pathStr.split(/\s+/);
		let currentPoint: { x: number; y: number } | null = null;
		let firstPoint: { x: number; y: number } | null = null;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part === "M" || part === "m") {
				const x = parseFloat(parts[++i]);
				const y = parseFloat(parts[++i]);
				currentPoint = { x, y };
				if (!firstPoint) firstPoint = currentPoint;
			} else if (part === "L" || part === "l") {
				const x = parseFloat(parts[++i]);
				const y = parseFloat(parts[++i]);
				if (currentPoint) {
					segments.push({ p0: currentPoint, p1: { x, y } });
					currentPoint = { x, y };
				}
			} else if (part === "Z" || part === "z") {
				if (currentPoint && firstPoint) {
					segments.push({ p0: currentPoint, p1: firstPoint });
					currentPoint = firstPoint;
				}
			}
		}
		return segments;
	}

	destroy(): void {
		this.uniformPool.destroy();
		this.vertexPool.destroy();
	}
}
