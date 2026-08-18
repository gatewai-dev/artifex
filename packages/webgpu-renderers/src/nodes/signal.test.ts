import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createMockCommandEncoder,
	createMockDevice,
	createMockRenderPassEncoder,
	ensureDOMGlobals,
} from "../renderer2d/test-helpers.js";
import { signalRegistry } from "../signals/signal-registry.js";
import { drawSignalNode } from "./signal.js";

vi.mock("../signals/signal-registry.js", () => {
	return {
		signalRegistry: {
			getOrCreate2DTextureView: vi.fn().mockReturnValue({}),
		},
	};
});

describe("Signal Node", () => {
	beforeAll(() => {
		ensureDOMGlobals();
		globalThis.GPUBufferUsage = {
			UNIFORM: 1,
		} as any;
	});

	let mockDevice: any;
	let mockEncoder: any;
	let mockPass: any;
	let mockCtx: any;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDevice = createMockDevice();
		mockDevice.createRenderPipeline.mockReturnValue({
			getBindGroupLayout: vi.fn().mockReturnValue({}),
		});
		mockEncoder = createMockCommandEncoder();
		mockPass = createMockRenderPassEncoder();

		mockCtx = {
			device: mockDevice,
			renderer: {
				format: "rgba8unorm",
				getTemporaryBuffer: vi.fn().mockReturnValue({}),
				samplerCache: {
					getSampler: vi.fn().mockReturnValue({}),
				},
			},
		};
	});

	it("should compile pipeline, create bind groups, and draw signal", async () => {
		const props = {
			nodeId: "sig-1",
			func: "sine",
			amplitude: 2,
			frequency: 5,
			phase: 0,
			offset: 1,
			signalConfig: {
				amplitudeMin: -1,
				amplitudeMax: 3,
			},
			frame: 10,
			fps: 30,
			width: 256,
			height: 256,
		};

		await drawSignalNode(mockCtx, mockEncoder, mockPass, props);

		expect(signalRegistry.getOrCreate2DTextureView).toHaveBeenCalledWith(
			mockDevice,
			mockEncoder,
			"sig-1",
			10 / 30,
			0,
			props.signalConfig,
			256,
			256,
			undefined,
			10,
			30,
		);

		expect(mockDevice.createShaderModule).toHaveBeenCalled();
		expect(mockDevice.createRenderPipeline).toHaveBeenCalled();
		expect(mockCtx.renderer.getTemporaryBuffer).toHaveBeenCalled();
		expect(mockDevice.createBindGroup).toHaveBeenCalledTimes(2);

		expect(mockPass.setPipeline).toHaveBeenCalled();
		expect(mockPass.setBindGroup).toHaveBeenCalledTimes(2);
		expect(mockPass.draw).toHaveBeenCalledWith(4);
	});

	it("should return early if no signalConfig is provided", async () => {
		const props = {
			func: "sine",
			amplitude: 1,
			frequency: 1,
			phase: 0,
			offset: 0,
			frame: 0,
			fps: 30,
			width: 100,
			height: 100,
		};

		await drawSignalNode(mockCtx, mockEncoder, mockPass, props);

		expect(signalRegistry.getOrCreate2DTextureView).not.toHaveBeenCalled();
		expect(mockPass.draw).not.toHaveBeenCalled();
	});
});
