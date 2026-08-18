import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import { RefineEdgeNodeConfigSchema } from "./shared/config.js";

describe("RefineEdge Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("RefineEdge");
		expect(metadata.displayName).toBe("Refine Edge");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(2);
		expect(metadata.handles.inputs[0].label).toBe("Input");
		expect(metadata.handles.inputs[0].required).toBe(true);
		expect(metadata.handles.inputs[1].label).toBe("Matte");
		expect(metadata.handles.inputs[1].required).toBe(false);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");
	});

	it("parses default configuration successfully", () => {
		const parsed = RefineEdgeNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.decontaminateAmount).toBe(0.7);
		expect(parsed.radius).toBe(2.0);
		expect(parsed.smooth).toBe(5);
		expect(parsed.feather).toBe(0.5);
		expect(parsed.shiftEdge).toBe(0);
		expect(parsed.matteChannel).toBe("Alpha");
		expect(parsed.outputMode).toBe("Composite");
	});

	it("validates valid ranges for all configuration parameters", () => {
		const validConfig = {
			decontaminateAmount: 0.85,
			radius: 10.5,
			smooth: 20,
			feather: 3.0,
			shiftEdge: -15,
			matteChannel: "Luminance" as const,
			outputMode: "MatteOnly" as const,
		};

		const res = RefineEdgeNodeConfigSchema.safeParse(validConfig);
		expect(res.success).toBe(true);
	});

	it("validates all output modes and matte channels", () => {
		const modes = ["Composite", "MatteOnly", "DecontaminatedRGB"] as const;
		for (const mode of modes) {
			expect(
				RefineEdgeNodeConfigSchema.safeParse({ outputMode: mode }).success,
			).toBe(true);
		}

		const channels = ["Alpha", "Luminance", "Red", "Green", "Blue"] as const;
		for (const ch of channels) {
			expect(
				RefineEdgeNodeConfigSchema.safeParse({ matteChannel: ch }).success,
			).toBe(true);
		}
	});

	it("rejects invalid values outside defined bounds", () => {
		expect(
			RefineEdgeNodeConfigSchema.safeParse({ decontaminateAmount: -0.1 })
				.success,
		).toBe(false);
		expect(
			RefineEdgeNodeConfigSchema.safeParse({ decontaminateAmount: 1.5 })
				.success,
		).toBe(false);
		expect(RefineEdgeNodeConfigSchema.safeParse({ radius: 0.1 }).success).toBe(
			false,
		);
		expect(RefineEdgeNodeConfigSchema.safeParse({ radius: 100 }).success).toBe(
			false,
		);
		expect(RefineEdgeNodeConfigSchema.safeParse({ smooth: -5 }).success).toBe(
			false,
		);
		expect(RefineEdgeNodeConfigSchema.safeParse({ smooth: 150 }).success).toBe(
			false,
		);
		expect(RefineEdgeNodeConfigSchema.safeParse({ feather: -1 }).success).toBe(
			false,
		);
		expect(RefineEdgeNodeConfigSchema.safeParse({ feather: 60 }).success).toBe(
			false,
		);
		expect(
			RefineEdgeNodeConfigSchema.safeParse({ shiftEdge: -150 }).success,
		).toBe(false);
		expect(
			RefineEdgeNodeConfigSchema.safeParse({ shiftEdge: 150 }).success,
		).toBe(false);
	});
});
