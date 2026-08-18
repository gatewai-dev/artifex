import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import { ChannelMergerNodeConfigSchema } from "./shared/config.js";

describe("ChannelMerger Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("ChannelMerger");
		expect(metadata.displayName).toBe("Channel Merger");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(4);
		expect(metadata.handles.inputs[0].label).toBe("Channel 1");
		expect(metadata.handles.inputs[0].required).toBe(true);
		expect(metadata.handles.inputs[1].label).toBe("Channel 2");
		expect(metadata.handles.inputs[1].required).toBe(true);
		expect(metadata.handles.inputs[2].label).toBe("Channel 3");
		expect(metadata.handles.inputs[2].required).toBe(true);
		expect(metadata.handles.inputs[3].label).toBe("Channel 4");
		expect(metadata.handles.inputs[3].required).toBe(false);

		expect(metadata.handles.outputs).toHaveLength(1);
		expect(metadata.handles.outputs[0].label).toBe("Result");
	});

	it("parses default configuration successfully", () => {
		const parsed = ChannelMergerNodeConfigSchema.parse(metadata.defaultConfig);
		expect(parsed.colorSpace).toBe("RGBA");
		expect(parsed.defaultChannel4).toBe(1.0);
	});

	it("validates all supported color spaces", () => {
		const colorSpaces = ["RGBA", "HSLA", "CMYK", "LAB"] as const;
		for (const cs of colorSpaces) {
			const res = ChannelMergerNodeConfigSchema.safeParse({
				colorSpace: cs,
			});
			expect(res.success).toBe(true);
		}
	});

	it("validates defaultChannel4 within range [0, 1]", () => {
		expect(
			ChannelMergerNodeConfigSchema.safeParse({ defaultChannel4: 0.5 }).success,
		).toBe(true);
		expect(
			ChannelMergerNodeConfigSchema.safeParse({ defaultChannel4: -0.1 })
				.success,
		).toBe(false);
		expect(
			ChannelMergerNodeConfigSchema.safeParse({ defaultChannel4: 1.5 }).success,
		).toBe(false);
	});
});
