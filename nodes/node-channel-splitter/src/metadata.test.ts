import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";
import { ChannelSplitterNodeConfigSchema } from "./shared/config.js";

describe("ChannelSplitter Node Metadata & Schema", () => {
	it("registers metadata with correct type, handles and defaults", () => {
		expect(metadata.type).toBe("ChannelSplitter");
		expect(metadata.displayName).toBe("Channel Splitter");
		expect(metadata.category).toBe("Media");
		expect(metadata.isTerminal).toBe(false);
		expect(metadata.isTransient).toBe(true);

		expect(metadata.handles.inputs).toHaveLength(1);
		expect(metadata.handles.inputs[0].label).toBe("Input");
		expect(metadata.handles.inputs[0].required).toBe(true);

		expect(metadata.handles.outputs).toHaveLength(4);
		expect(metadata.handles.outputs[0].label).toBe("Channel 1");
		expect(metadata.handles.outputs[1].label).toBe("Channel 2");
		expect(metadata.handles.outputs[2].label).toBe("Channel 3");
		expect(metadata.handles.outputs[3].label).toBe("Channel 4");
	});

	it("parses default configuration successfully", () => {
		const parsed = ChannelSplitterNodeConfigSchema.parse(
			metadata.defaultConfig,
		);
		expect(parsed.colorSpace).toBe("RGBA");
	});

	it("validates all supported color spaces", () => {
		const colorSpaces = ["RGBA", "HSLA", "CMYK", "LAB"] as const;
		for (const cs of colorSpaces) {
			const res = ChannelSplitterNodeConfigSchema.safeParse({
				colorSpace: cs,
			});
			expect(res.success).toBe(true);
		}
	});

	it("rejects invalid color space values", () => {
		expect(
			ChannelSplitterNodeConfigSchema.safeParse({ colorSpace: "INVALID" })
				.success,
		).toBe(false);
	});
});
