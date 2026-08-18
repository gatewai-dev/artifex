import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import { MaskMathNodeConfigSchema } from "./shared/config.js";

describe("MaskMath Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("MaskMath");
		expect(metadata.displayName).toBe("Mask Math");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(2);
		expect(metadata.handles.inputs[0].label).toBe("Mask A");
		expect(metadata.handles.inputs[0].required).toBe(true);
		expect(metadata.handles.inputs[1].label).toBe("Mask B");
		expect(metadata.handles.inputs[1].required).toBe(false);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");
	});

	it("parses default configuration successfully", () => {
		const parsed = MaskMathNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.operation).toBe("Union");
		expect(parsed.radius).toBe(0);
		expect(parsed.threshold).toBe(0.5);
		expect(parsed.clampMin).toBe(0.0);
		expect(parsed.clampMax).toBe(1.0);
		expect(parsed.channelA).toBe("Alpha");
		expect(parsed.channelB).toBe("Alpha");
		expect(parsed.binarize).toBe(false);
		expect(parsed.invertResult).toBe(false);
		expect(parsed.outputFormat).toBe("WhiteWithAlpha");
	});

	it("validates all supported operations", () => {
		const operations = [
			"Union",
			"Intersect",
			"Subtract",
			"Difference",
			"Invert",
			"Dilate",
			"Erode",
			"Choke",
			"Feather",
		] as const;

		for (const op of operations) {
			const res = MaskMathNodeConfigSchema.safeParse({
				operation: op,
			});
			expect(res.success).toBe(true);
		}
	});

	it("validates channel sources and output formats", () => {
		const channels = ["Alpha", "Luminance", "Red", "Green", "Blue"] as const;
		for (const ch of channels) {
			expect(
				MaskMathNodeConfigSchema.safeParse({ channelA: ch, channelB: ch })
					.success,
			).toBe(true);
		}

		const formats = [
			"WhiteWithAlpha",
			"GrayscaleRGB",
			"AlphaOnly",
			"PassthroughRGB",
		] as const;
		for (const fmt of formats) {
			expect(
				MaskMathNodeConfigSchema.safeParse({ outputFormat: fmt }).success,
			).toBe(true);
		}
	});

	it("rejects invalid values outside defined bounds", () => {
		expect(MaskMathNodeConfigSchema.safeParse({ radius: -5 }).success).toBe(
			false,
		);
		expect(MaskMathNodeConfigSchema.safeParse({ radius: 300 }).success).toBe(
			false,
		);
		expect(
			MaskMathNodeConfigSchema.safeParse({ threshold: -0.1 }).success,
		).toBe(false);
		expect(MaskMathNodeConfigSchema.safeParse({ threshold: 1.5 }).success).toBe(
			false,
		);
	});
});
