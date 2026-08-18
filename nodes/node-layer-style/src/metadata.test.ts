import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import {
	LAYER_STYLE_PRESETS,
	LayerStyleNodeConfigSchema,
} from "./shared/config.js";

describe("LayerStyle Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles, and defaults", () => {
		expect(metadata.type).toBe("LayerStyle");
		expect(metadata.displayName).toBe("Layer Style");
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
		expect(metadata.configHandles?.length).toBeGreaterThan(15);
	});

	it("parses default configuration successfully", () => {
		const parsed = LayerStyleNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.dropShadow.enabled).toBe(false);
		expect(parsed.dropShadow.color).toBe("#000000");
		expect(parsed.dropShadow.opacity).toBe(0.75);
		expect(parsed.dropShadow.angle).toBe(120);
		expect(parsed.dropShadow.distance).toBe(10);
		expect(parsed.dropShadow.spread).toBe(0);
		expect(parsed.dropShadow.size).toBe(10);
		expect(parsed.dropShadow.blendMode).toBe("multiply");

		expect(parsed.innerShadow.enabled).toBe(false);
		expect(parsed.innerShadow.distance).toBe(5);

		expect(parsed.outerGlow.enabled).toBe(false);
		expect(parsed.innerGlow.enabled).toBe(false);

		expect(parsed.stroke.enabled).toBe(false);
		expect(parsed.stroke.size).toBe(2);
		expect(parsed.stroke.position).toBe("outside");

		expect(parsed.bevelEmboss.enabled).toBe(false);
		expect(parsed.bevelEmboss.style).toBe("InnerBevel");
		expect(parsed.bevelEmboss.technique).toBe("Smooth");
		expect(parsed.bevelEmboss.depth).toBe(100);
		expect(parsed.bevelEmboss.direction).toBe("Up");

		expect(parsed.colorOverlay.enabled).toBe(false);
		expect(parsed.colorOverlay.color).toBe("#ff0000");
	});

	it("validates all built-in Layer Style presets", () => {
		expect(LAYER_STYLE_PRESETS.length).toBeGreaterThanOrEqual(5);
		for (const preset of LAYER_STYLE_PRESETS) {
			const res = LayerStyleNodeConfigSchema.safeParse(preset.config);
			expect(res.success).toBe(true);
		}
	});

	it("validates custom configuration with signal handles", () => {
		const customConfig = {
			dropShadow: {
				enabled: true,
				color: "#112233",
				opacity: 0.8,
				angle: 90,
				distance: 15,
				spread: 10,
				size: 20,
				blendMode: "multiply",
			},
			dropShadowAngleHandleId: "handle-ds-angle",
			strokeSizeHandleId: "handle-stroke-size",
		};
		const res = LayerStyleNodeConfigSchema.safeParse(customConfig);
		expect(res.success).toBe(true);
		if (res.success) {
			expect(res.data.dropShadow.enabled).toBe(true);
			expect(res.data.dropShadowAngleHandleId).toBe("handle-ds-angle");
			expect(res.data.strokeSizeHandleId).toBe("handle-stroke-size");
		}
	});

	it("rejects invalid values outside allowed ranges", () => {
		expect(
			LayerStyleNodeConfigSchema.safeParse({
				dropShadow: {
					opacity: 1.5,
				},
			}).success,
		).toBe(false);

		expect(
			LayerStyleNodeConfigSchema.safeParse({
				stroke: {
					position: "invalid-position" as never,
				},
			}).success,
		).toBe(false);

		expect(
			LayerStyleNodeConfigSchema.safeParse({
				bevelEmboss: {
					depth: 0, // min is 1
				},
			}).success,
		).toBe(false);

		expect(
			LayerStyleNodeConfigSchema.safeParse({
				bevelEmboss: {
					altitude: 95, // max is 90
				},
			}).success,
		).toBe(false);
	});
});
