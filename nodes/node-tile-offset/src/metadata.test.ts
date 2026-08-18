import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import { TileOffsetNodeConfigSchema } from "./shared/config.js";

describe("TileOffset Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("TileOffset");
		expect(metadata.displayName).toBe("Tile Offset");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(1);
		expect(metadata.handles.inputs[0].label).toBe("Input");
		expect(metadata.handles.inputs[0].required).toBe(true);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");

		expect(metadata.configHandles).toBeDefined();
		const handleNames = metadata.configHandles?.map((h) => h.label);
		expect(handleNames).toContain("Horizontal Offset (px)");
		expect(handleNames).toContain("Vertical Offset (px)");
	});

	it("parses default configuration successfully", () => {
		const parsed = TileOffsetNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.offsetX).toBe(0);
		expect(parsed.offsetY).toBe(0);
		expect(parsed.wrap).toBe(true);
		expect(parsed.edgeMode).toBe("wrap");
	});

	it("validates all supported edge modes", () => {
		const edgeModes = ["wrap", "clamp", "transparent", "mirror"] as const;
		for (const mode of edgeModes) {
			const res = TileOffsetNodeConfigSchema.safeParse({
				edgeMode: mode,
			});
			expect(res.success).toBe(true);
		}
	});

	it("accepts arbitrary positive, negative, and fractional offsets", () => {
		expect(
			TileOffsetNodeConfigSchema.safeParse({
				offsetX: -512.5,
				offsetY: 1024.75,
			}).success,
		).toBe(true);
	});
});
