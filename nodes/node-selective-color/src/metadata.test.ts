import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import {
	COLOR_RANGE_KEYS,
	ColorAdjustmentSchema,
	defaultColorAdjustment,
	SelectiveColorNodeConfigSchema,
} from "./shared/config.js";

describe("SelectiveColor Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("SelectiveColor");
		expect(metadata.displayName).toBe("Selective Color");
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
		const parsed = SelectiveColorNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.method).toBe("Relative");

		for (const key of COLOR_RANGE_KEYS) {
			expect(parsed[key]).toEqual(defaultColorAdjustment);
		}
	});

	it("validates valid ranges for all 9 color targets and CMYK channels", () => {
		const validConfig = {
			method: "Absolute" as const,
			reds: { cyan: -50, magenta: 20, yellow: 40, black: -10 },
			yellows: { cyan: -20, magenta: 10, yellow: 30, black: 0 },
			greens: { cyan: 50, magenta: -30, yellow: 50, black: -10 },
			cyans: { cyan: 40, magenta: 10, yellow: -10, black: 5 },
			blues: { cyan: 20, magenta: 20, yellow: -20, black: 10 },
			magentas: { cyan: -10, magenta: 30, yellow: 10, black: 0 },
			whites: { cyan: -5, magenta: -5, yellow: -5, black: -10 },
			neutrals: { cyan: 2, magenta: 0, yellow: -2, black: 0 },
			blacks: { cyan: 5, magenta: 5, yellow: 5, black: 15 },
		};

		const res = SelectiveColorNodeConfigSchema.safeParse(validConfig);
		expect(res.success).toBe(true);
	});

	it("validates single ColorAdjustmentSchema bounds (-100 to 100)", () => {
		expect(
			ColorAdjustmentSchema.safeParse({
				cyan: 100,
				magenta: -100,
				yellow: 0,
				black: 50,
			}).success,
		).toBe(true);

		expect(
			ColorAdjustmentSchema.safeParse({
				cyan: 101,
			}).success,
		).toBe(false);

		expect(
			ColorAdjustmentSchema.safeParse({
				magenta: -101,
			}).success,
		).toBe(false);

		expect(
			ColorAdjustmentSchema.safeParse({
				yellow: 200,
			}).success,
		).toBe(false);

		expect(
			ColorAdjustmentSchema.safeParse({
				black: -150,
			}).success,
		).toBe(false);
	});

	it("validates calculation method options (Relative vs Absolute)", () => {
		expect(
			SelectiveColorNodeConfigSchema.safeParse({
				method: "Relative",
			}).success,
		).toBe(true);

		expect(
			SelectiveColorNodeConfigSchema.safeParse({
				method: "Absolute",
			}).success,
		).toBe(true);

		expect(
			SelectiveColorNodeConfigSchema.safeParse({
				method: "InvalidMethod" as never,
			}).success,
		).toBe(false);
	});

	it("calculates range weights and isolates neutrals correctly", () => {
		function calculateWeights(r: number, g: number, b: number) {
			const maxVal = Math.max(r, g, b);
			const minVal = Math.min(r, g, b);

			const wRed = Math.max(0, r - Math.max(g, b));
			const wYellow = Math.max(0, Math.min(r, g) - b);
			const wGreen = Math.max(0, g - Math.max(r, b));
			const wCyan = Math.max(0, Math.min(g, b) - r);
			const wBlue = Math.max(0, b - Math.max(r, g));
			const wMagenta = Math.max(0, Math.min(r, b) - g);

			const wWhite = Math.max(0, (minVal - 0.5) * 2.0);
			const wBlack = Math.max(0, (0.5 - maxVal) * 2.0);
			const wNeutral = Math.max(
				0,
				1.0 -
					(wRed +
						wYellow +
						wGreen +
						wCyan +
						wBlue +
						wMagenta +
						wWhite +
						wBlack),
			);

			return {
				wRed,
				wYellow,
				wGreen,
				wCyan,
				wBlue,
				wMagenta,
				wWhite,
				wBlack,
				wNeutral,
			};
		}

		// Pure Red (1, 0, 0)
		const redWeights = calculateWeights(1, 0, 0);
		expect(redWeights.wRed).toBe(1.0);
		expect(redWeights.wNeutral).toBe(0.0);
		expect(redWeights.wWhite).toBe(0.0);
		expect(redWeights.wBlack).toBe(0.0);

		// Pure Green (0, 1, 0)
		const greenWeights = calculateWeights(0, 1, 0);
		expect(greenWeights.wGreen).toBe(1.0);
		expect(greenWeights.wNeutral).toBe(0.0);

		// Pure Blue (0, 0, 1)
		const blueWeights = calculateWeights(0, 0, 1);
		expect(blueWeights.wBlue).toBe(1.0);
		expect(blueWeights.wNeutral).toBe(0.0);

		// 50% Midtone Gray (0.5, 0.5, 0.5)
		const grayWeights = calculateWeights(0.5, 0.5, 0.5);
		expect(grayWeights.wNeutral).toBe(1.0);
		expect(grayWeights.wRed).toBe(0.0);
		expect(grayWeights.wWhite).toBe(0.0);
		expect(grayWeights.wBlack).toBe(0.0);

		// Pure White (1, 1, 1)
		const whiteWeights = calculateWeights(1, 1, 1);
		expect(whiteWeights.wWhite).toBe(1.0);
		expect(whiteWeights.wNeutral).toBe(0.0);

		// Pure Black (0, 0, 0)
		const blackWeights = calculateWeights(0, 0, 0);
		expect(blackWeights.wBlack).toBe(1.0);
		expect(blackWeights.wNeutral).toBe(0.0);
	});
});
