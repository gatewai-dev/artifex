import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import {
	SHADOWS_HIGHLIGHTS_PRESETS,
	ShadowsHighlightsNodeConfigSchema,
} from "./shared/config.js";

describe("ShadowsHighlights Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles, and defaults", () => {
		expect(metadata.type).toBe("ShadowsHighlights");
		expect(metadata.displayName).toBe("Shadows & Highlights");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(1);
		expect(metadata.handles.inputs[0].label).toBe("Input");
		expect(metadata.handles.inputs[0].required).toBe(true);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");

		expect(metadata.variableInputs?.enabled).toBe(true);
		expect(metadata.configHandles).toBeDefined();
	});

	it("parses default configuration successfully", () => {
		const parsed = ShadowsHighlightsNodeConfigSchema.parse(
			metadata.defaultConfig,
		);
		expect(parsed.shadowAmount).toBe(0);
		expect(parsed.shadowTonalWidth).toBe(50);
		expect(parsed.shadowRadius).toBe(30);
		expect(parsed.highlightAmount).toBe(0);
		expect(parsed.highlightTonalWidth).toBe(50);
		expect(parsed.highlightRadius).toBe(30);
		expect(parsed.colorCorrection).toBe(0);
		expect(parsed.midtoneContrast).toBe(0);
	});

	it("validates custom configuration parameters", () => {
		const validConfig = {
			shadowAmount: 45,
			shadowTonalWidth: 60,
			shadowRadius: 50,
			highlightAmount: 30,
			highlightTonalWidth: 40,
			highlightRadius: 35,
			colorCorrection: 15,
			midtoneContrast: -10,
		};
		const res = ShadowsHighlightsNodeConfigSchema.safeParse(validConfig);
		expect(res.success).toBe(true);
		if (res.success) {
			expect(res.data).toMatchObject(validConfig);
		}
	});

	it("validates all built-in dynamic range recovery presets", () => {
		expect(SHADOWS_HIGHLIGHTS_PRESETS.length).toBeGreaterThan(4);
		for (const preset of SHADOWS_HIGHLIGHTS_PRESETS) {
			const res = ShadowsHighlightsNodeConfigSchema.safeParse(preset.config);
			expect(res.success).toBe(true);
		}
	});

	it("rejects invalid values outside allowed ranges", () => {
		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				shadowAmount: -1,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				shadowAmount: 101,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				shadowRadius: 0.5,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				shadowRadius: 251,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				highlightAmount: 150,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				colorCorrection: -101,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				colorCorrection: 101,
			}).success,
		).toBe(false);

		expect(
			ShadowsHighlightsNodeConfigSchema.safeParse({
				midtoneContrast: 120,
			}).success,
		).toBe(false);
	});
});
