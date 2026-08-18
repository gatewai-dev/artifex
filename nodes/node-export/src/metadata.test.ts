import { describe, expect, it } from "vitest";
import { metadata } from "./metadata.js";

describe("Export Node Metadata Validation", () => {
	it("passes on valid mp4 export", () => {
		const config = { format: "mp4" };
		const inputs = {
			input1: {
				dataType: "Video",
				metadata: {
					width: 1920,
					height: 1080,
					durationMs: 20000,
				},
			},
		};

		const errors = metadata.validation?.(config, inputs);
		expect(errors).toBeNull();
	});

	it("passes on valid gif export (<= 15 seconds)", () => {
		const config = { format: "gif" };
		const inputs = {
			input1: {
				dataType: "Video",
				metadata: {
					width: 1920,
					height: 1080,
					durationMs: 15000,
				},
			},
		};

		const errors = metadata.validation?.(config, inputs);
		expect(errors).toBeNull();
	});

	it("fails on gif export with duration > 15 seconds", () => {
		const config = { format: "gif" };
		const inputs = {
			input1: {
				dataType: "Video",
				metadata: {
					width: 1920,
					height: 1080,
					durationMs: 15001,
				},
			},
		};

		const errors = metadata.validation?.(config, inputs);
		expect(errors).not.toBeNull();
		expect(errors?.gifDuration).toContain(
			"GIF export is limited to a maximum duration of 15 seconds",
		);
	});

	it("fails on odd video dimensions", () => {
		const config = { format: "mp4" };
		const inputs = {
			input1: {
				dataType: "Video",
				metadata: {
					width: 1921,
					height: 1080,
					durationMs: 10000,
				},
			},
		};

		const errors = metadata.validation?.(config, inputs);
		expect(errors).not.toBeNull();
		expect(errors?.dimensions).toContain(
			"Video dimensions must be even numbers",
		);
	});

	it("fails with both dimension and gif duration errors", () => {
		const config = { format: "gif" };
		const inputs = {
			input1: {
				dataType: "Video",
				metadata: {
					width: 1921,
					height: 1080,
					durationMs: 16000,
				},
			},
		};

		const errors = metadata.validation?.(config, inputs);
		expect(errors).not.toBeNull();
		expect(errors?.dimensions).toContain(
			"Video dimensions must be even numbers",
		);
		expect(errors?.gifDuration).toContain(
			"GIF export is limited to a maximum duration of 15 seconds",
		);
	});
});
