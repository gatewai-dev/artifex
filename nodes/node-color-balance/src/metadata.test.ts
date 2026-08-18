import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import {
	COLOR_BALANCE_PRESETS,
	ColorBalanceNodeConfigSchema,
} from "./shared/config.js";

describe("ColorBalance Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles, and defaults", () => {
		expect(metadata.type).toBe("ColorBalance");
		expect(metadata.displayName).toBe("Color Balance");
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
		const parsed = ColorBalanceNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.shadows).toEqual({
			cyanRed: 0,
			magentaGreen: 0,
			yellowBlue: 0,
		});
		expect(parsed.midtones).toEqual({
			cyanRed: 0,
			magentaGreen: 0,
			yellowBlue: 0,
		});
		expect(parsed.highlights).toEqual({
			cyanRed: 0,
			magentaGreen: 0,
			yellowBlue: 0,
		});
		expect(parsed.preserveLuminosity).toBe(true);
	});

	it("validates valid tonal shifts", () => {
		const validConfig = {
			shadows: { cyanRed: -30, magentaGreen: 10, yellowBlue: 25 },
			midtones: { cyanRed: 15, magentaGreen: -5, yellowBlue: -10 },
			highlights: { cyanRed: 20, magentaGreen: -10, yellowBlue: -30 },
			preserveLuminosity: false,
		};
		const res = ColorBalanceNodeConfigSchema.safeParse(validConfig);
		expect(res.success).toBe(true);
	});

	it("validates all built-in color balance presets", () => {
		expect(COLOR_BALANCE_PRESETS.length).toBeGreaterThan(4);
		for (const preset of COLOR_BALANCE_PRESETS) {
			const res = ColorBalanceNodeConfigSchema.safeParse({
				shadows: preset.shadows,
				midtones: preset.midtones,
				highlights: preset.highlights,
				preserveLuminosity: preset.preserveLuminosity,
			});
			expect(res.success).toBe(true);
		}
	});

	it("rejects invalid values outside range [-100, 100]", () => {
		expect(
			ColorBalanceNodeConfigSchema.safeParse({
				shadows: { cyanRed: -101 },
			}).success,
		).toBe(false);

		expect(
			ColorBalanceNodeConfigSchema.safeParse({
				midtones: { magentaGreen: 105 },
			}).success,
		).toBe(false);

		expect(
			ColorBalanceNodeConfigSchema.safeParse({
				highlights: { yellowBlue: -150 },
			}).success,
		).toBe(false);
	});
});
