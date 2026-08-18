---
name: recipe-build-node
description: "Master Guide for Building Gatewai Nodes: Metadata, Server Processor, WebGPU Visual Renderer, WebGPU Audio Processor, and UI"
metadata:
  nodeType: recipe-build-node
  triggers: "build node, create node, custom node development, node architecture, webgpu renderer, audio processor, server processor, node metadata, defineMetadata, defineNode, defineRenderer, scaffold node"
---

# Recipe & Guide: Building Gatewai Nodes

This comprehensive guide teaches AI agents and developers how to build, extend, and publish custom nodes for the Gatewai engine and Artifex CLI. Gatewai nodes execute across multiple runtimes:
1. **Server Processor** (`src/server/`): Node graph traversal, dependency injection, non-destructive `VirtualMediaData` operation appending, or server-side rendering/AI jobs.
2. **WebGPU Visual Renderer** (`src/renderers/webgpu-renderer.ts`): Real-time and offline headless WGSL visual shaders (filters, blurs, color grading, spatial warps).
3. **WebGPU Audio Processor** (`src/renderers/audio-processor.ts`): Real-time and offline WebGPU compute-based audio DSP (delays, reverbs, dynamic EQ, compressors, fades).
4. **Browser UI** (`src/browser/`): ReactFlow canvas node components and sidebar inspector forms with accessibility and `DraggableNumberInput`.
5. **Agent Skill** (`SKILL.md`): Self-documenting instructions enabling AI agents to discover, wire, and execute the node.

---

## 1. Directory Structure & Package Exports

Custom nodes follow a modular ESM package layout. Use `artifex init-node <name>` to scaffold this structure:

```
nodes/node-<name>/
├── package.json               # Declares exports for ., ./server, ./renderer
├── tsconfig.json              # TypeScript configuration
├── tsdown.config.ts           # Multi-entrypoint build configuration
├── SKILL.md                   # Agent usage skill
└── src/
    ├── metadata.ts            # Node identity & defineMetadata()
    ├── shared/
    │   ├── config.ts          # Zod schemas, configBuilder(), result types
    │   └── index.ts           # Re-exports shared types and schemas
    ├── server/
    │   ├── processor.ts       # Backend NodeProcessor class (Inversify DI)
    │   └── index.ts           # defineNode() with backendProcessor, routes, migrations
    ├── renderers/
    │   ├── webgpu-renderer.ts # (Optional) WebGPUNodeRenderer visual shader
    │   ├── audio-processor.ts # (Optional) WebGPU Audio compute processor
    │   └── index.ts           # defineRenderer({ WebGPURenderer, audioProcessor })
    └── browser/               # (Internal Monorepo Nodes)
        ├── node-component.tsx # Canvas ReactFlow component
        ├── config-component.tsx # Sidebar inspector component
        ├── processor.ts       # Browser-side processor
        └── index.ts           # defineClient()
```

### `package.json` Exports Definition
Every node must expose three primary subpath exports (`.`, `./server`, `./renderer`):

```json
{
  "name": "@gatewai.studio/node-my-filter",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "development": "./src/metadata.ts",
      "import": "./dist/index.mjs",
      "default": "./dist/index.mjs"
    },
    "./server": {
      "types": "./dist/server.d.mts",
      "development": "./src/server/index.ts",
      "import": "./dist/server.mjs",
      "default": "./dist/server.mjs"
    },
    "./renderer": {
      "types": "./dist/renderer.d.mts",
      "development": "./src/renderers/index.ts",
      "import": "./dist/renderer.mjs",
      "default": "./dist/renderer.mjs"
    }
  },
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "clean": "rm -rf dist .turbo"
  },
  "dependencies": {
    "@gatewai.studio/core": "workspace:*",
    "@gatewai.studio/node-sdk": "workspace:*",
    "@gatewai.studio/webgpu-renderers": "workspace:*",
    "inversify": "^7.11.0",
    "zod": "^4.3.6"
  }
}
```

---

## 2. Metadata & Attribute Definitions (`src/metadata.ts`)

`defineMetadata` configures the node's identity, interface, and capabilities.

```typescript
import type { DataType } from "@gatewai.studio/core";
import { defineMetadata } from "@gatewai.studio/node-sdk";
import {
  type MyFilterNodeConfig,
  MyFilterNodeConfigSchema,
  MyFilterResultSchema,
  myFilterConfig,
} from "./shared/index.js";

export { type MyFilterNodeConfig, MyFilterNodeConfigSchema, MyFilterResultSchema };

export const metadata = defineMetadata({
  // Unique PascalCase string identifying the node across the engine
  type: "MyFilter",

  // Version number (integer >= 1). Increment when making breaking changes
  version: 1,

  // If introducing a versioned node (e.g. MyFilter_v2), baseType links to original
  baseType: "MyFilter",

  // User-facing name in the UI palette and node headers
  displayName: "My Filter",

  // Clear 1-2 sentence description for UI tooltips and agent catalogs
  description: "Applies a custom visual transformation with dynamic modulation",

  // Category in UI sidebar: "Media", "Generators", "AI", "Audio", "Utilities"
  category: "Media",
  subcategory: "Color",

  // UI Visibility flags (defaults to true)
  showInSidebar: true,
  showInQuickAccess: true,

  // Runtime Config Schema (Zod)
  configSchema: MyFilterNodeConfigSchema,

  // Default configuration values
  defaultConfig: {
    strength: 1.0,
    blendMode: "normal",
    enabled: true,
  } as MyFilterNodeConfig,

  // Output Result Schema (Zod)
  resultSchema: MyFilterResultSchema,

  // Bindable config handles generated by configBuilder()
  configHandles: myFilterConfig.configHandles,

  // Terminal flag:
  // - true: Node that requires backend processing on the server worker (e.g. AI media generation via Fal AI like ImageGen, VideoGen, TextToSpeech, LLM, or server exports).
  // - false: Intermediate/client transformer node that processes locally on WebGPU or non-destructively appends operations (e.g. Blur, Curves, Delay, ApplyLUT).
  isTerminal: false,

  // Transient flag:
  // - true: Results are temporary/intermediate VirtualMedia objects (not stored in permanent DB assets)
  // - false: Results are stored permanently in the database
  isTransient: true,

  // Static input/output sockets
  handles: {
    inputs: [
      {
        dataTypes: ["Image", "Video"] as DataType[],
        required: true,
        label: "Input",
        order: 0,
        description: "Primary visual media stream",
      },
    ],
    outputs: [
      {
        dataTypes: ["Image", "Video"] as DataType[],
        label: "Result",
        order: 0,
        description: "Transformed visual media stream",
      },
    ],
  },

  // Variable (dynamic) input sockets (e.g. dynamic signal modulators or extra audio layers)
  variableInputs: {
    enabled: true,
    dataTypes: ["Signal", "Number"] as DataType[],
  },

  // Variable (dynamic) output sockets (e.g. AI branching or channel splitter)
  variableOutputs: {
    enabled: false,
  },

  // Optional: Cost calculation function (config, inputs) => credits
  pricing: (config) => (config.highQuality ? 2 : 1),
  isDynamicPricing: false,

  // Optional: Pre-execution validation callback returning error messages
  validation: (config, inputs) => {
    if (config.strength < 0) return { strength: "Strength cannot be negative." };
    return null;
  },
});
```

---

## 3. Shared Config & Bindable Handles (`src/shared/config.ts`)

Use `configBuilder()` from `@gatewai.studio/node-sdk` to declare config fields. Setting `bindable: true` automatically registers a dynamic input socket in `configHandles` so signals (LFO, Math, Audio Analyzers) can modulate parameters dynamically:

```typescript
import {
  configBuilder,
  ImageResultSchema,
  VideoResultSchema,
} from "@gatewai.studio/node-sdk";
import { z } from "zod";

export const myFilterConfig = configBuilder()
  .field("strength", z.number().min(0).max(10).default(1.0), {
    bindable: true,
    dataTypes: ["Number", "Signal"],
    label: "Strength Signal",
    description: "Modulates filter strength dynamically.",
  })
  .field("blendMode", z.enum(["normal", "multiply", "screen"]).default("normal"), {
    bindable: false,
    label: "Blend Mode",
  })
  .field("enabled", z.boolean().default(true), {
    bindable: false,
    label: "Enabled",
  })
  .build();

export const MyFilterNodeConfigSchema = myFilterConfig.schema;
export type MyFilterNodeConfig = z.infer<typeof MyFilterNodeConfigSchema>;

// Shared standard result schemas
export const MyFilterResultSchema = z.union([ImageResultSchema, VideoResultSchema]);
export type MyFilterResult = z.infer<typeof MyFilterResultSchema>;
```

---

## 4. Server Processor Implementation (`src/server/processor.ts`)

Backend processors run during canvas execution (`artifex run` or web worker). They use **Inversify Dependency Injection**:

```typescript
import {
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
  MyFilterNodeConfigSchema,
  type MyFilterResult,
} from "../shared/index.js";

@injectable()
export class MyFilterProcessor implements NodeProcessor {
  constructor(
    @inject(TOKENS.GRAPH_RESOLVERS) private graph: IGraphResolverService,
  ) {}

  async process({
    node,
    data,
  }: BackendNodeProcessorCtx): Promise<BackendNodeProcessorResult<MyFilterResult>> {
    try {
      // 1. Resolve upstream inputs using graph resolver
      const resolver = this.graph.forNode(node, data);
      const inputItem = resolver.input().item();

      if (!inputItem) {
        return { success: false, error: "Missing required input media" };
      }

      // 2. Validate node config
      const config = MyFilterNodeConfigSchema.parse(node.config);
      const inputMedia = inputItem.data as VirtualMediaData;
      if (!inputMedia) {
        return { success: false, error: "Input item contains no media data" };
      }

      // 3. Collect connected dynamic signal handles
      const connected = resolver.inputs().allWithHandle();
      const inputs: Record<string, { connectionValid: boolean; outputItem: unknown }> = {};
      for (const { handle, value } of connected) {
        if (value) {
          inputs[handle.id] = { connectionValid: true, outputItem: value };
        }
      }

      // 4. Append non-destructive operation to VirtualMediaData
      const activeMeta = getActiveMediaMetadata(inputMedia);
      const outputType = inputItem.type;

      const output = appendOperation(inputMedia, {
        op: "MyFilter",
        ...config,
        metadata: activeMeta ?? inputMedia.metadata,
        dataType: outputType,
        inputs,
      });

      // 5. Build output result container
      const outputHandle = data.handles.find(
        (h) => h.nodeId === node.id && h.type === "Output",
      );
      if (!outputHandle) {
        return { success: false, error: "Output handle definition not found" };
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
      } as unknown as MyFilterResult;

      return { success: true, newResult };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "MyFilter processing failed",
      };
    }
  }
}
```

### Server Entrypoint (`src/server/index.ts`)
```typescript
import { defineNode } from "@gatewai.studio/node-sdk/server";
import { metadata } from "../metadata.js";
import { MyFilterProcessor } from "./processor.js";

export default defineNode(metadata, {
  backendProcessor: MyFilterProcessor,
});
```

---

## 5. WebGPU Visual Renderer (`src/renderers/webgpu-renderer.ts`)

Visual renderers execute offline inside the headless WebGPU renderer and real-time in the browser:

```typescript
/// <reference types="webgpu" />
import type { WebGPUNodeRenderer } from "@gatewai.studio/node-sdk/browser";

const WGSL_SHADER = `
struct Uniforms {
  strength: f32,
  hasStrengthSig: f32,
  _pad0: f32,
  _pad1: f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;
@group(1) @binding(0) var tex : texture_2d<f32>;
@group(1) @binding(1) var samp : sampler;
@group(2) @binding(0) var strengthSigTex : texture_2d<f32>;
@group(2) @binding(1) var signalSamp : sampler;

@fragment
fn fs_main(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {
  var color = textureSample(tex, samp, uv);
  
  var effStrength = u.strength;
  if (u.hasStrengthSig > 0.5) {
    effStrength = textureSampleLevel(strengthSigTex, signalSamp, vec2<f32>(0.5, 0.5), 0.0).r;
  }

  // Example: Invert color based on strength
  let inverted = vec3<f32>(1.0 - color.r, 1.0 - color.g, 1.0 - color.b);
  let finalRgb = mix(color.rgb, inverted, clamp(effStrength, 0.0, 1.0));

  return vec4<f32>(finalRgb, color.a);
}
`;

export const MyFilterWebGPURenderer: WebGPUNodeRenderer = async ({
  ctx,
  pass,
  targetView,
  targetWidth,
  targetHeight,
  props,
  drawChild,
}) => {
  const childMedia = props.virtualMedia.children?.[0];
  if (childMedia) {
    // Render upstream child first
    await drawChild(childMedia);
  }

  // Custom WebGPU render pipeline logic using ctx.device & ctx.shaderStore...
};
```

---

## 6. WebGPU Audio Processor (`src/renderers/audio-processor.ts`)

Audio effects run 100% on the GPU via compute shaders on multi-channel Float32 PCM arrays:

```typescript
import type { AudioProcessor } from "@gatewai.studio/node-sdk/browser";
import { WebGPUAudioProcessor } from "@gatewai.studio/webgpu-renderers";

const PARAM_ORDER = ["strength"];

const AUDIO_SHADER_TEMPLATE = () => `
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
  let exp2x = exp(2.0 * x);
  return (exp2x - 1.0) / (exp2x + 1.0); // tanh
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  if (gid.x != 0u) { return; }

  let numSamples = u32(u.numSamples);
  let numChannels = u32(u.numChannels);

  for (var i = 0u; i < numSamples; i = i + 1u) {
    var effStrength = u.strength;
    if (u.hasStrengthSig > 0.5) {
      effStrength = strengthSignal[i];
    }
    effStrength = clamp(effStrength, 0.0, 10.0);

    for (var c = 0u; c < numChannels; c = c + 1u) {
      let idx = c * numSamples + i;
      var sample = inputChannels[idx];
      if (is_nan_or_inf(sample)) { sample = 0.0; }

      // Apply effect & soft-clip output
      var processed = sample * (1.0 + effStrength);
      outputChannels[idx] = soft_clip(processed);
    }
  }
}
`;

export const myAudioProcessor: AudioProcessor = async (
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
  const strength = typeof op.strength === "number" ? op.strength : 1.0;

  const nodeId = (op.id as string) || "my-audio-node";
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
    16, // 16-byte alignment
    1,  // State buffer size
    ctx?.renderId,
    true,
    ctx?.elapsedMs,
    ctx?.durationMs,
    undefined,
    undefined,
    PARAM_ORDER,
  );
};
```

### Renderer Entrypoint (`src/renderers/index.ts`)
```typescript
import { defineRenderer } from "@gatewai.studio/node-sdk/renderer";
import { myAudioProcessor } from "./audio-processor.js";
import { MyFilterWebGPURenderer } from "./webgpu-renderer.js";

export default defineRenderer({
  WebGPURenderer: MyFilterWebGPURenderer,
  audioProcessor: myAudioProcessor,
});
```

---

## 7. Node Skill Authoring (`SKILL.md`)

Every node directory must include an authoritative `SKILL.md` file:

```markdown
---
name: MyFilter
nodeType: MyFilter
summary: Applies a custom transformation with dynamic signal modulation.
triggers:
  - myfilter
  - my filter
---

# MyFilter

## What It Does
Applies a custom visual or audio transformation to upstream media streams.

## When to Use
- Dynamically modulating parameters via LFO or audio analyzer signals.
- Post-processing media before final composition.

## Inputs
| Handle | Type | Required | Description |
|---|---|---|---|
| `Input` | Image, Video | Yes | Primary visual media stream |
| `Strength Signal` | Number, Signal | No | Dynamic modulation input |

## Config
| Field | Type | Range | Default | Description |
|---|---|---|---|---|
| `strength` | number | 0–10 | 1.0 | Effect intensity |
| `enabled` | boolean | true/false | true | Toggle effect on/off |

## Output
| Handle | Type | Description |
|---|---|---|
| `Result` | Image, Video | Processed media stream |

## Common Patterns
- `Import -> MyFilter (strength: 2.0) -> Export`
- `Signal (LFO) -> MyFilter (Strength Signal) -> Compositor`
```

---

## 8. Development & Verification Workflow

```bash
# 1. Scaffold new node
artifex init-node node-my-filter --type MyFilter --category Media

# 2. Build TypeScript & Bundle ESM
pnpm --filter @gatewai.studio/node-my-filter run build

# 3. Dry-run spec validation
artifex validate workflow.json --plugin ./nodes/node-my-filter

# 4. Inspect topological assembly
artifex build workflow.json --plugin ./nodes/node-my-filter

# 5. Execute & render media output
artifex run workflow.json --plugin ./nodes/node-my-filter
```
