import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CliError, ExitCode } from "./errors.js";

export interface ScaffoldOptions {
	targetDir?: string;
	type?: string;
	displayName?: string;
	description?: string;
	category?: string;
}

function toPascalCase(str: string): string {
	return str
		.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
		.replace(/^\w/, (c) => c.toUpperCase())
		.replace(/[^a-zA-Z0-9]/g, "");
}

function toKebabCase(str: string): string {
	return str
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
}

function toDisplayName(str: string): string {
	return str
		.replace(/^node-/, "")
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Scaffolds a new custom Gatewai node package with all required metadata,
 * server processor, WebGPU renderer, and agent SKILL.md.
 */
export function scaffoldNode(
	rawName: string,
	options: ScaffoldOptions = {},
): string {
	const trimmed = rawName.trim();
	if (!trimmed) {
		throw new CliError(
			"Node name cannot be empty.",
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}

	const baseName = trimmed.replace(/^node-/, "");
	const dirName = trimmed.startsWith("node-")
		? trimmed
		: `node-${toKebabCase(baseName)}`;
	const nodeType = options.type || toPascalCase(baseName);
	const displayName = options.displayName || toDisplayName(trimmed);
	const description =
		options.description || `Custom ${displayName} transformation node`;
	const category = options.category || "Media";

	const parentDir = options.targetDir
		? path.resolve(process.cwd(), options.targetDir)
		: process.cwd();
	const outDir = path.join(parentDir, dirName);

	if (existsSync(outDir)) {
		throw new CliError(
			`Directory "${outDir}" already exists. Choose a different name or remove the existing directory.`,
			ExitCode.INPUT_ERROR,
			"E_INPUT",
		);
	}

	mkdirSync(path.join(outDir, "src", "shared"), { recursive: true });
	mkdirSync(path.join(outDir, "src", "server"), { recursive: true });
	mkdirSync(path.join(outDir, "src", "renderers"), { recursive: true });

	// 1. package.json
	const packageJson = {
		name: `@gatewai.studio/${dirName}`,
		version: "1.0.0",
		private: true,
		type: "module",
		license: "AGPL-3.0",
		exports: {
			".": {
				types: "./dist/index.d.mts",
				development: "./src/metadata.ts",
				import: "./dist/index.mjs",
				default: "./dist/index.mjs",
			},
			"./server": {
				types: "./dist/server.d.mts",
				development: "./src/server/index.ts",
				import: "./dist/server.mjs",
				default: "./dist/server.mjs",
			},
			"./renderer": {
				types: "./dist/renderer.d.mts",
				development: "./src/renderers/index.ts",
				import: "./dist/renderer.mjs",
				default: "./dist/renderer.mjs",
			},
		},
		scripts: {
			build: "tsdown",
			dev: "tsdown --watch",
			clean: "rm -rf dist .turbo",
		},
		dependencies: {
			"@gatewai.studio/core": "workspace:*",
			"@gatewai.studio/node-sdk": "workspace:*",
			"@gatewai.studio/webgpu-renderers": "workspace:*",
			inversify: "^7.11.0",
			zod: "^4.3.6",
		},
		devDependencies: {
			"@gatewai.studio/tsconfig": "workspace:*",
			"@types/node": "^24.1.0",
			tsdown: "^0.19.0",
			typescript: "^5.8.3",
			webgpu: "^0.4.0",
		},
	};
	writeFileSync(
		path.join(outDir, "package.json"),
		JSON.stringify(packageJson, null, 2) + "\n",
		"utf-8",
	);

	// 2. tsconfig.json
	const tsconfigJson = {
		extends: "@gatewai.studio/tsconfig/base.json",
		compilerOptions: {
			outDir: "./dist",
			rootDir: "./src",
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
		},
		include: ["src/**/*"],
	};
	writeFileSync(
		path.join(outDir, "tsconfig.json"),
		JSON.stringify(tsconfigJson, null, 2) + "\n",
		"utf-8",
	);

	// 2b. tsdown.config.ts
	const tsdownConfig = `import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "src/metadata.ts",
		server: "src/server/index.ts",
		renderer: "src/renderers/index.ts",
	},
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	treeshake: true,
});
`;
	writeFileSync(path.join(outDir, "tsdown.config.ts"), tsdownConfig, "utf-8");

	// 3. src/shared/config.ts
	const sharedConfig = `import {
	configBuilder,
	ImageResultSchema,
	VideoResultSchema,
} from "@gatewai.studio/node-sdk";
import { z } from "zod";

/**
 * Node Configuration Builder
 *
 * Use configBuilder() to declare your node parameters.
 * - Setting \`bindable: true\` automatically creates an input handle in \`configHandles\`
 *   allowing external signals (LFO, Math, Audio Analyzers) or static numbers to modulate the value.
 */
export const ${nodeType.toLowerCase()}Config = configBuilder()
	.field("strength", z.number().min(0).max(10).default(1.0), {
		bindable: true,
		dataTypes: ["Number", "Signal"],
		label: "Strength Signal",
		description: "Modulates transformation intensity (0 to 10).",
	})
	.field("enabled", z.boolean().default(true), {
		bindable: false,
		label: "Enabled",
		description: "Toggles the effect on or off.",
	})
	.build();

export const ${nodeType}NodeConfigSchema = ${nodeType.toLowerCase()}Config.schema;
export type ${nodeType}NodeConfig = z.infer<typeof ${nodeType}NodeConfigSchema>;

export const ${nodeType}ResultSchema = z.union([
	ImageResultSchema,
	VideoResultSchema,
]);
export type ${nodeType}Result = z.infer<typeof ${nodeType}ResultSchema>;
`;
	writeFileSync(
		path.join(outDir, "src", "shared", "config.ts"),
		sharedConfig,
		"utf-8",
	);

	// 4. src/shared/index.ts
	const sharedIndex = `export * from "./config.js";\n`;
	writeFileSync(
		path.join(outDir, "src", "shared", "index.ts"),
		sharedIndex,
		"utf-8",
	);

	// 5. src/metadata.ts
	const metadataTs = `import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
	type ${nodeType}NodeConfig,
	${nodeType}NodeConfigSchema,
	${nodeType}ResultSchema,
	${nodeType.toLowerCase()}Config,
} from "./shared/index.js";

export { type ${nodeType}NodeConfig, ${nodeType}NodeConfigSchema, ${nodeType}ResultSchema };

export const metadata = defineMetadata({
	type: "${nodeType}",
	version: 1,
	displayName: "${displayName}",
	description: "${description}",
	category: "${category}",
	configSchema: ${nodeType}NodeConfigSchema,
	resultSchema: ${nodeType}ResultSchema,
	configHandles: ${nodeType.toLowerCase()}Config.configHandles,
	// isTerminal: true for nodes requiring backend processing (e.g. AI media generation via Fal AI, VideoGen, LLM, Export)
	// false for intermediate/client nodes (e.g. Blur, Curves, ApplyLUT)
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: ["Image", "Video"] as DataType[],
				required: true,
				label: "Input",
				order: 0,
				description: "Primary media stream to transform.",
			},
		],
		outputs: [
			{
				dataTypes: ["Image", "Video"] as DataType[],
				label: "Result",
				order: 0,
				description: "Transformed media output stream.",
			},
		],
	},
	variableInputs: {
		enabled: true,
		dataTypes: ["Signal", "Number"] as DataType[],
	},
	defaultConfig: {
		strength: 1.0,
		enabled: true,
	} as ${nodeType}NodeConfig,
});
`;
	writeFileSync(path.join(outDir, "src", "metadata.ts"), metadataTs, "utf-8");

	// 6. src/server/processor.ts
	const processorTs = `import {
	appendOperation,
	getActiveMediaMetadata,
	type VirtualMediaData,
} from "@gatewai.studio/core";
import {
	type BackendNodeProcessorCtx,
	type BackendNodeProcessorResult,
	type IGraphResolverService,
	type NodeProcessor,
	TOKENS,
} from "@gatewai.studio/node-sdk/server";
import { inject, injectable } from "inversify";
import {
	${nodeType}NodeConfigSchema,
	type ${nodeType}Result,
} from "../shared/index.js";

@injectable()
export class ${nodeType}Processor implements NodeProcessor {
	constructor(
		@inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
	) {}

	async process({
		node,
		data,
	}: BackendNodeProcessorCtx): Promise<BackendNodeProcessorResult<${nodeType}Result>> {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input().item();

			if (!inputItem) {
				return {
					success: false,
					error: "${nodeType} requires an input media item.",
				};
			}

			const config = ${nodeType}NodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data as VirtualMediaData;
			if (!inputMedia) {
				return {
					success: false,
					error: "Input item contains no valid VirtualMediaData.",
				};
			}

			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = inputItem.type;

			const connected = resolver.inputs().allWithHandle();
			const inputs: Record<
				string,
				{ connectionValid: boolean; outputItem: unknown }
			> = {};
			for (const { handle, value } of connected) {
				if (value) {
					inputs[handle.id] = {
						connectionValid: true,
						outputItem: value,
					};
				}
			}

			const output = appendOperation(inputMedia, {
				op: "${nodeType}",
				...config,
				metadata: activeMeta ?? inputMedia.metadata,
				dataType: outputType,
				inputs,
			});

			const outputHandle = data.handles.find(
				(h) => h.nodeId === node.id && h.type === "Output",
			);
			if (!outputHandle) {
				return { success: false, error: "Output handle definition is missing" };
			}

			const newResult = {
				selectedOutputIndex: 0 as const,
				outputs: [
					{
						items: [
							{
								type: outputType,
								data: output,
								outputHandleId: outputHandle.id,
							},
						],
					},
				],
			} as unknown as ${nodeType}Result;

			return { success: true, newResult };
		} catch (err: unknown) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "${nodeType} processing failed",
			};
		}
	}
}
`;
	writeFileSync(
		path.join(outDir, "src", "server", "processor.ts"),
		processorTs,
		"utf-8",
	);

	// 7. src/server/index.ts
	const serverIndex = `import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { ${nodeType}Processor } from "./processor.js";

export default defineNode(metadata, {
	backendProcessor: ${nodeType}Processor,
});
`;
	writeFileSync(
		path.join(outDir, "src", "server", "index.ts"),
		serverIndex,
		"utf-8",
	);

	// 8. src/renderers/webgpu-renderer.ts
	const rendererTs = `/// <reference types="webgpu" />
import type { WebGPUNodeRenderer } from "@gatewai.studio/node-sdk/browser";

export const ${nodeType}WebGPURenderer: WebGPUNodeRenderer = async ({
	ctx,
	pass,
	targetView,
	targetTexture,
	targetWidth,
	targetHeight,
	props,
	drawChild,
}) => {
	// 1. Recursively draw upstream child media into target if present
	const childMedia = props.virtualMedia.children?.[0];
	if (childMedia) {
		await drawChild(childMedia);
	}

	// 2. Custom WebGPU visual render pass logic (bind shaders, uniforms, textures)
};
`;
	writeFileSync(
		path.join(outDir, "src", "renderers", "webgpu-renderer.ts"),
		rendererTs,
		"utf-8",
	);

	// 8b. src/renderers/audio-processor.ts
	const audioProcessorTs = `import type { AudioProcessor } from "@gatewai.studio/node-sdk/browser";
import { WebGPUAudioProcessor } from "@gatewai.studio/webgpu-renderers";

const PARAM_ORDER = ["strength"];

const AUDIO_SHADER_TEMPLATE = () => \`
struct Uniforms {
    sampleRate      : f32,
    strength        : f32,
    hasStrengthSig  : f32,
    numSamples      : f32,
    numChannels     : f32,
    _pad0           : f32,
    _pad1           : f32,
    _pad2           : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(0) @binding(1) var<storage, read> inputChannels : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputChannels : array<f32>;
@group(0) @binding(3) var<storage, read_write> state : array<f32>;
@group(0) @binding(4) var<storage, read> strengthSignal : array<f32>;

fn is_nan_or_inf(v: f32) -> bool {
    return (v != v) || (abs(v) > 3.402823466e+38f);
}

fn soft_clip(x: f32) -> f32 {
    let exp2x = exp(2.0f * x);
    return (exp2x - 1.0f) / (exp2x + 1.0f);
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
    if (gid.x != 0u) { return; }

    let numSamples = u32(u.numSamples);
    let numChannels = u32(u.numChannels);

    for (var i = 0u; i < numSamples; i = i + 1u) {
        var effStrength = u.strength;
        if (u.hasStrengthSig > 0.5f) {
            effStrength = strengthSignal[i];
        }
        effStrength = clamp(effStrength, 0.0f, 10.0f);

        for (var c = 0u; c < numChannels; c = c + 1u) {
            let sampleIdx = c * numSamples + i;
            var sample = inputChannels[sampleIdx];
            if (is_nan_or_inf(sample)) { sample = 0.0f; }

            var processed = sample * (1.0f + effStrength * 0.5f);
            outputChannels[sampleIdx] = soft_clip(processed);
        }
    }
}
\`;

export const ${nodeType.toLowerCase()}AudioProcessor: AudioProcessor = async (
	channels,
	sampleRate,
	virtualMedia,
	ctx,
) => {
	if (!ctx?.device) return;

	const op = (virtualMedia.operation as Record<string, unknown>) || {};
	const numChannels = channels.length;
	if (numChannels === 0 || channels[0].length === 0) return;

	const numSamples = channels[0].length;
	const strength = typeof op.strength === "number" ? Math.max(0, op.strength) : 1.0;

	const nodeId = (op.id as string) || "${toKebabCase(baseName)}-audio";
	const frame = ctx.frame ?? 0;
	const fps = ctx.fps ?? 24;

	await WebGPUAudioProcessor.process(
		ctx.device,
		nodeId,
		channels,
		sampleRate,
		virtualMedia,
		frame,
		fps,
		AUDIO_SHADER_TEMPLATE,
		() => [sampleRate, strength, 0.0, numSamples, numChannels, 0, 0, 0],
		16,
		1,
		ctx?.renderId,
		true,
		ctx?.elapsedMs,
		ctx?.durationMs,
		undefined,
		undefined,
		PARAM_ORDER,
	);
};
`;
	writeFileSync(
		path.join(outDir, "src", "renderers", "audio-processor.ts"),
		audioProcessorTs,
		"utf-8",
	);

	// 9. src/renderers/index.ts
	const renderersIndex = `import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { ${nodeType.toLowerCase()}AudioProcessor } from "./audio-processor.js";
import { ${nodeType}WebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
	WebGPURenderer: ${nodeType}WebGPURenderer,
	audioProcessor: ${nodeType.toLowerCase()}AudioProcessor,
});
`;
	writeFileSync(
		path.join(outDir, "src", "renderers", "index.ts"),
		renderersIndex,
		"utf-8",
	);

	// 10. SKILL.md
	const skillMd = `---
nodeType: ${nodeType}
name: ${displayName}
description: "${description}"
triggers:
  - "${displayName.toLowerCase()}"
  - "${toKebabCase(baseName)}"
---

# ${displayName} Node (\`${nodeType}\`)

${description}

## Parameters
- \`strength\` (number, 0-10, default 1.0): Effect intensity.
- \`enabled\` (boolean, default true): Toggle effect on/off.

## Handles
- **Inputs**: \`Input\` (\`Image\`, \`Video\`) - required.
- **Outputs**: \`Result\` (\`Image\`, \`Video\`).

## Example Workflow Spec
\`\`\`json
{
  "name": "${displayName} Demo",
  "plugins": ["./${dirName}"],
  "nodes": [
    { "id": "input_1", "type": "Import", "config": { "file": "./input.png" } },
    { "id": "effect_1", "type": "${nodeType}", "config": { "strength": 2.0 } },
    { "id": "export_1", "type": "Export", "config": { "file": "./output.png" } }
  ],
  "edges": [
    { "source": "input_1", "target": "effect_1" },
    { "source": "effect_1", "target": "export_1" }
  ]
}
\`\`\`
`;
	writeFileSync(path.join(outDir, "SKILL.md"), skillMd, "utf-8");

	return outDir;
}

