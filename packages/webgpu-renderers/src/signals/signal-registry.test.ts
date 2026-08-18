import { describe, expect, it, vi } from "vitest";

// Polyfill WebGPU globals for the test runner environment
if (typeof globalThis.GPUBufferUsage === "undefined") {
	globalThis.GPUBufferUsage = {
		MAP_READ: 1,
		MAP_WRITE: 2,
		COPY_SRC: 4,
		COPY_DST: 8,
		INDEX: 16,
		VERTEX: 32,
		UNIFORM: 64,
		STORAGE: 128,
		INDIRECT: 256,
		QUERY_RESOLVE: 512,
	} as unknown as typeof GPUBufferUsage;
}

if (typeof globalThis.GPUTextureUsage === "undefined") {
	globalThis.GPUTextureUsage = {
		COPY_SRC: 1,
		COPY_DST: 2,
		TEXTURE_BINDING: 4,
		STORAGE_BINDING: 8,
		RENDER_ATTACHMENT: 16,
	} as unknown as typeof GPUTextureUsage;
}

import { SignalRegistry } from "./signal-registry.js";

describe("SignalRegistry", () => {
	it("should allocate, cache, and reuse 1D buffers", () => {
		const registry = new SignalRegistry();

		const mockBuffer = {
			destroy: vi.fn(),
		} as unknown as GPUBuffer;

		const mockDevice = {
			createBuffer: vi.fn().mockReturnValue(mockBuffer),
			queue: {
				writeBuffer: vi.fn(),
			},
		} as unknown as GPUDevice;

		const mockEncoder = {} as unknown as GPUCommandEncoder;

		const nodeId = "test-signal-node";
		const frame = 0;
		const fps = 24;
		const signalData = { type: "generator", offset: 1.5 };
		const numSamples = 128;
		const sampleRate = 48000;
		const renderId = "render-abc";

		// 1. Initial creation
		const buffer1 = registry.getOrCreate1DBuffer(
			mockDevice,
			mockEncoder,
			nodeId,
			frame / fps,
			0,
			signalData,
			numSamples,
			sampleRate,
			renderId,
			frame,
			fps,
		);

		expect(mockDevice.createBuffer).toHaveBeenCalledTimes(1);
		expect(mockDevice.queue.writeBuffer).toHaveBeenCalledTimes(1);
		expect(buffer1).toBe(mockBuffer);

		// 2. Querying on same frame -> should return cached buffer without rewriting
		const buffer2 = registry.getOrCreate1DBuffer(
			mockDevice,
			mockEncoder,
			nodeId,
			frame / fps,
			0,
			signalData,
			numSamples,
			sampleRate,
			renderId,
			frame,
			fps,
		);

		expect(mockDevice.createBuffer).toHaveBeenCalledTimes(1);
		expect(mockDevice.queue.writeBuffer).toHaveBeenCalledTimes(1);
		expect(buffer2).toBe(mockBuffer);

		// 3. Querying on a new frame -> should rewrite buffer but not recreate it
		const buffer3 = registry.getOrCreate1DBuffer(
			mockDevice,
			mockEncoder,
			nodeId,
			(frame + 1) / fps,
			0,
			signalData,
			numSamples,
			sampleRate,
			renderId,
			frame + 1,
			fps,
		);

		expect(mockDevice.createBuffer).toHaveBeenCalledTimes(1);
		expect(mockDevice.queue.writeBuffer).toHaveBeenCalledTimes(2);
		expect(buffer3).toBe(mockBuffer);
	});

	it("should allocate, cache, and reuse 2D textures", () => {
		const registry = new SignalRegistry();

		const mockTextureView = {} as unknown as GPUTextureView;
		const mockTexture = {
			width: 16,
			height: 1,
			createView: vi.fn().mockReturnValue(mockTextureView),
			destroy: vi.fn(),
		} as any;

		const mockDevice = {
			createTexture: vi.fn().mockImplementation((desc) => {
				mockTexture.width = desc.size[0];
				mockTexture.height = desc.size[1] ?? 1;
				return mockTexture as unknown as GPUTexture;
			}),
			queue: {
				writeBuffer: vi.fn(),
				writeTexture: vi.fn(),
			},
		} as unknown as GPUDevice;

		const mockEncoder = {} as unknown as GPUCommandEncoder;

		const nodeId = "test-signal-2d";
		const frame = 0;
		const fps = 24;
		const signalData = { type: "generator", offset: 0.5 };
		const width = 16;
		const height = 16;
		const renderId = "render-123";

		// 1. Initial creation
		const view1 = registry.getOrCreate2DTextureView(
			mockDevice,
			mockEncoder,
			nodeId,
			frame / fps,
			0,
			signalData,
			width,
			height,
			renderId,
			frame,
			fps,
		);

		expect(mockDevice.createTexture).toHaveBeenCalledTimes(1);
		expect(mockTexture.createView).toHaveBeenCalledTimes(1);
		expect(mockDevice.queue.writeTexture).toHaveBeenCalledTimes(1);
		expect(view1).toBe(mockTextureView);

		// 2. Querying on same frame -> should return cached view without rewriting
		const view2 = registry.getOrCreate2DTextureView(
			mockDevice,
			mockEncoder,
			nodeId,
			frame / fps,
			0,
			signalData,
			width,
			height,
			renderId,
			frame,
			fps,
		);

		expect(mockDevice.createTexture).toHaveBeenCalledTimes(1);
		expect(mockDevice.queue.writeTexture).toHaveBeenCalledTimes(1);
		expect(view2).toBe(mockTextureView);

		// 3. Querying on a new frame -> should rewrite texture but not recreate it
		const view3 = registry.getOrCreate2DTextureView(
			mockDevice,
			mockEncoder,
			nodeId,
			(frame + 1) / fps,
			0,
			signalData,
			width,
			height,
			renderId,
			frame + 1,
			fps,
		);

		expect(mockDevice.createTexture).toHaveBeenCalledTimes(1);
		expect(mockDevice.queue.writeTexture).toHaveBeenCalledTimes(2);
		expect(view3).toBe(mockTextureView);
	});

	it("should clear cached resources on clear() with renderId", () => {
		const registry = new SignalRegistry();

		const mockBuffer = {
			destroy: vi.fn(),
		} as unknown as GPUBuffer;
		const mockTexture = {
			destroy: vi.fn(),
		} as unknown as GPUTexture;

		const mockDevice = {
			createBuffer: vi.fn().mockReturnValue(mockBuffer),
			createTexture: vi.fn().mockReturnValue(mockTexture),
			queue: {
				writeBuffer: vi.fn(),
				writeTexture: vi.fn(),
			},
		} as unknown as GPUDevice;

		const mockEncoder = {} as unknown as GPUCommandEncoder;

		// Create 1D buffer under renderId 'render-1'
		registry.getOrCreate1DBuffer(
			mockDevice,
			mockEncoder,
			"node-1",
			0,
			0,
			{ type: "generator", offset: 1.0 },
			64,
			48000,
			"render-1",
			0,
			24,
		);

		// Create 2D texture under renderId 'render-1'
		const mockTextureView = {} as unknown as GPUTextureView;
		mockTexture.createView = vi.fn().mockReturnValue(mockTextureView);
		registry.getOrCreate2DTextureView(
			mockDevice,
			mockEncoder,
			"node-2",
			0,
			0,
			{ type: "generator", offset: 0.5 },
			8,
			8,
			"render-1",
			0,
			24,
		);

		// Clear render-1
		registry.clear("render-1", mockDevice);

		expect(mockBuffer.destroy).toHaveBeenCalledTimes(1);
		expect(mockTexture.destroy).toHaveBeenCalledTimes(1);
	});
});
