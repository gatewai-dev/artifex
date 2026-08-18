import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import {
	GRADIENT_MAP_PRESETS,
	GradientMapNodeConfigSchema,
} from "./shared/config.js";

describe("GradientMap Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles, and defaults", () => {
		expect(metadata.type).toBe("GradientMap");
		expect(metadata.displayName).toBe("Gradient Map");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(1);
		expect(metadata.handles.inputs[0].label).toBe("Input");
		expect(metadata.handles.inputs[0].required).toBe(true);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");
	});

	it("parses default configuration successfully", () => {
		const parsed = GradientMapNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.stops).toHaveLength(2);
		expect(parsed.stops[0]).toEqual({ position: 0.0, color: "#000000" });
		expect(parsed.stops[1]).toEqual({ position: 1.0, color: "#ffffff" });
		expect(parsed.smooth).toBe(true);
		expect(parsed.dither).toBe(true);
		expect(parsed.opacity).toBe(1.0);
	});

	it("validates valid multi-stop configurations", () => {
		const customConfig = {
			stops: [
				{ position: 0.0, color: "#000000" },
				{ position: 0.5, color: "#ff0080" },
				{ position: 1.0, color: "#ffffff" },
			],
			smooth: false,
			dither: false,
			opacity: 0.75,
		};
		const res = GradientMapNodeConfigSchema.safeParse(customConfig);
		expect(res.success).toBe(true);
	});

	it("validates all built-in gradient presets", () => {
		expect(GRADIENT_MAP_PRESETS.length).toBeGreaterThan(5);
		for (const preset of GRADIENT_MAP_PRESETS) {
			const res = GradientMapNodeConfigSchema.safeParse({
				stops: preset.stops,
			});
			expect(res.success).toBe(true);
		}
	});

	it("rejects invalid configurations outside bounds", () => {
		// Less than 2 stops
		expect(
			GradientMapNodeConfigSchema.safeParse({
				stops: [{ position: 0.0, color: "#000000" }],
			}).success,
		).toBe(false);

		// Stop position < 0 or > 1
		expect(
			GradientMapNodeConfigSchema.safeParse({
				stops: [
					{ position: -0.1, color: "#000000" },
					{ position: 1.0, color: "#ffffff" },
				],
			}).success,
		).toBe(false);

		expect(
			GradientMapNodeConfigSchema.safeParse({
				stops: [
					{ position: 0.0, color: "#000000" },
					{ position: 1.2, color: "#ffffff" },
				],
			}).success,
		).toBe(false);

		// Opacity out of bounds
		expect(
			GradientMapNodeConfigSchema.safeParse({
				opacity: -0.1,
			}).success,
		).toBe(false);

		expect(
			GradientMapNodeConfigSchema.safeParse({
				opacity: 1.5,
			}).success,
		).toBe(false);
	});
});
