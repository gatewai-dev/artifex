import { expect, test } from "vitest";
import { CanvasSpecSchema } from "../../../apps/gatewai-artifex/src/spec.js";
import { BlurNodeConfigSchema } from "../../../nodes/node-blur/src/shared/config.js";
import { TextNodeConfigSchema } from "../../../nodes/node-text/src/shared/config.js";

test("validate speculate JSON", () => {
	const spec = {
		name: "Creative City Canvas",
		nodes: [
			{
				id: "canvas-bg",
				type: "CanvasGenerator",
				name: "Base Background Canvas",
				config: {
					width: 1280,
					height: 720,
					fillType: "solid",
					solidColor: "#1a1a2e",
				},
			},
			{
				id: "blur-1",
				type: "Blur",
				name: "Background Blur",
				config: {
					blurType: "Gaussian",
					strength: 15,
				},
			},
			{
				id: "prompt-text",
				type: "Text",
				name: "AI Prompter Text",
				config: {
					content:
						"Create a detailed image generation prompt of a futuristic neon city skyline, 1 sentence.",
				},
			},
			{
				id: "comp-1",
				type: "Compositor",
				name: "Overlay Compositor",
				config: {
					width: 1280,
					height: 720,
					backgroundColor: "#000000",
					layers: [
						{
							id: "bg-layer",
							inputHandleId: "background",
							type: "Image",
							x: 0,
							y: 0,
							width: 1280,
							height: 720,
							durationFrames: 24,
						},
						{
							id: "overlay-layer",
							inputHandleId: "overlay",
							type: "Image",
							x: 160,
							y: 90,
							width: 960,
							height: 540,
							durationFrames: 24,
						},
					],
					dynamicInputs: [
						{
							label: "background",
							dataTypes: ["Image"],
						},
						{
							label: "overlay",
							dataTypes: ["Image"],
						},
					],
				},
			},
			{
				id: "export-node",
				type: "Export",
				config: {
					file: "./renders/output.png",
				},
			},
		],
		edges: [
			{
				source: "canvas-bg",
				target: "blur-1",
				sourceLabel: "Result",
				targetLabel: "Input",
			},
			{
				source: "blur-1",
				target: "comp-1",
				sourceLabel: "Result",
				targetLabel: "background",
			},
			{
				source: "comp-1",
				target: "export-node",
				sourceLabel: "Result",
				targetLabel: "Input",
			},
		],
	};

	const canvasRes = CanvasSpecSchema.safeParse(spec);
	expect(canvasRes.success).toBe(true);

	const blurRes = BlurNodeConfigSchema.safeParse(spec.nodes[1].config);
	expect(blurRes.success).toBe(true);

	const textRes = TextNodeConfigSchema.safeParse(spec.nodes[2].config);
	expect(textRes.success).toBe(true);
});
