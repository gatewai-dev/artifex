import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import { ShapeGeneratorNodeConfigSchema } from "./shared/config.js";

describe("ShapeGenerator Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("ShapeGenerator");
		expect(metadata.displayName).toBe("Vector Shape");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(0);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");
		expect(metadata.handles.outputs[0].dataTypes).toContain("SVG");
		expect(metadata.handles.outputs[0].dataTypes).toContain("Image");

		expect(metadata.configHandles).toBeDefined();
		const handleNames = metadata.configHandles?.map((h) => h.label);
		expect(handleNames).toContain("Width (px)");
		expect(handleNames).toContain("Height (px)");
		expect(handleNames).toContain("Top-Left Radius (px)");
		expect(handleNames).toContain("Polygon Sides");
		expect(handleNames).toContain("Star Points");
		expect(handleNames).toContain("Star Inner Radius Ratio");
		expect(handleNames).toContain("Stroke Width (px)");
		expect(handleNames).toContain("Gradient Angle (deg)");
		expect(handleNames).toContain("Rotation (deg)");
		expect(handleNames).toContain("Opacity");
	});

	it("parses default configuration successfully", () => {
		const parsed = ShapeGeneratorNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.shapeType).toBe("Rectangle");
		expect(parsed.width).toBe(500);
		expect(parsed.height).toBe(500);
		expect(parsed.radiusTL).toBe(24);
		expect(parsed.fillType).toBe("solid");
		expect(parsed.fillColor).toBe("#3b82f6");
		expect(parsed.strokeColor).toBe("#ffffff");
		expect(parsed.outputType).toBe("SVG");
	});

	it("validates all shape types", () => {
		const shapes = [
			"Rectangle",
			"Ellipse",
			"Polygon",
			"Star",
			"Arrow",
			"CustomPath",
		] as const;
		for (const shapeType of shapes) {
			const res = ShapeGeneratorNodeConfigSchema.safeParse({
				shapeType,
			});
			expect(res.success).toBe(true);
		}
	});

	it("validates all fill types", () => {
		const fillTypes = ["solid", "linear", "radial", "none"] as const;
		for (const fillType of fillTypes) {
			const res = ShapeGeneratorNodeConfigSchema.safeParse({
				fillType,
			});
			expect(res.success).toBe(true);
		}
	});

	it("validates stroke caps and joins", () => {
		expect(
			ShapeGeneratorNodeConfigSchema.safeParse({
				strokeLineCap: "butt",
				strokeLineJoin: "bevel",
			}).success,
		).toBe(true);
	});
});
