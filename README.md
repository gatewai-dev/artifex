# Gatewai Artifex & Node SDK

A **non-interactive, hardware-accelerated, machine-first CLI and SDK for autonomous AI agents** to compose and render media from a JSON spec. Presented by [http://gatewai.studio](http://gatewai.studio)

Official open-source monorepo for **Artifex CLI**, **Gatewai Node SDK**, **WebGPU Renderers**, **Core Types**, and **Reference Node Packages**.

---

## 🚀 Getting Started

To get started with Artifex, install the agent skills into your AI agent's workspace, and run or install the Artifex CLI.

### 1. Install Artifex Skills (Recommended for AI Agents)

To equip autonomous AI coding agents (such as Antigravity, Claude Code, Cursor, Windsurf, Roo Code, etc.) with Artifex skills, node instructions, and execution workflows, add the skill to your project workspace:

```bash
npx skills add gatewai-dev/artifex-skills --full-depth
```

This installs the complete catalog of node specifications, handle types, edge connection rules, and composition guidelines directly into your agent's context window.

### 2. Run or Install Artifex CLI

Artifex can be executed on-demand globally or installed as a CLI tool.

#### On-Demand via npx / pnpm dlx:
```bash
# Run on-demand via npx
npx @gatewai.studio/artifex --help

# Run on-demand via pnpm dlx
pnpm dlx @gatewai.studio/artifex --help
```

#### Global Installation:
```bash
# Using npm
npm install -g @gatewai.studio/artifex

# Using pnpm
pnpm add -g @gatewai.studio/artifex

# Verify installation
artifex --help
```

---

## Credentials & Configuration

```bash
# FAL AI  → image / video / speech generation
GATEWAI_FAL_API_KEY=...
# OpenRouter → LLM
GATEWAI_OPENROUTER_API_KEY=...

# Local asset storage directory (defaults to ./gw-assets)
GATEWAI_STORAGE_DIR=./gw-assets

# Concurrency limit for renders (Composition, Still, LUT). Defaults to 2.
GATEWAI_CONCURRENT_RENDERS=2
```

Environment variables take precedence. Alternatively, keys may be placed in a `.env` file or under `~/.config/gatewai/credentials.json`.

---

## Commands

```
artifex validate <spec>               Parse & validate spec (aggregates ALL schema, node config, edge, & linter errors).
artifex build    <spec>               Build + inspect graph (nodes, order, supported types).
artifex run      <spec>               Execute workflow; print / save results.
artifex init-node <name>              Scaffold a new custom node package.
artifex nodes                        Machine-readable node catalog (metadata: config, key, outputs).
artifex skill    [<nodeType>]         Print node markdown skill instructions.
artifex version                       Print build + schema version.
artifex help                          Show help.
```

### CLI Options:
- `--plugin, --plugins, -p <path>`: Specify custom node package or directory (comma-separated).
- `--dir <path>`: Target directory for init-node scaffolding.
- `--type <name>`: Explicit node type for init-node (e.g. InvertColors).
- `--description <text>`: Description for init-node scaffolding.
- `--category <name>`: Category for init-node scaffolding (default: Media).
- `--json`: Produce machine-readable JSON output on stdout.
- `--node <id>`: Specify target terminal node(s) to run (comma-separated).
- `--state <file>`: Specify path to save CanvasState (results + node IDs).
- `--from-state <file>`: Specify path to load CanvasState from.
- `--yes, --force`: Auto-approve non-destructive execution prompts.

---

## Workflow / Canvas State & Checkpoints

The CLI is registry-driven: every node type registers its **metadata** (config schema, required provider key, output types) and **processor** in a NodeRegistry, and execution auto-picks the processor by type. Metadata drives validation, the `requiresKey` check, and the `artifex nodes` catalog — so a node's contract and behavior can't drift.

`run` returns a JSON object (or logs a summary) containing the canvas ID, the map of node ID to its generated result (`results`), and the mapping of spec node IDs to engine node IDs (`nodeIds`).

### Checkpoints:
- `--state <file>` persists the CanvasState (results + node IDs) to JSON.
- `run --from-state <file>` loads the cached outputs and runs from the checkpoint — **no recompute of FAL/LLM/TTS calls**.
- To prevent execution of specific nodes (especially terminal nodes like `Export`, `VideoGen`, or `ImageGen` which run by default in a full workflow execution), mark them as `"locked": true` in the spec and supply their `"result"` (or load it via `--from-state`). The runner will skip execution of locked nodes and their upstream dependencies.

---

## Exit Codes

The CLI returns specific exit codes depending on the failure type:
- `0`: SUCCESS - Execution completed successfully.
- `2`: INPUT_ERROR (`E_INPUT`) - Invalid command arguments, missing files, or schema validation failure.
- `3`: GRAPH_ERROR (`E_GRAPH`) - Issues with building the execution graph (e.g., cycles, references to unknown nodes).
- `4`: RENDER_ERROR (`E_RENDER`) - Rendering-specific issues (e.g., missing node outputs, renderer engine failures).
- `5`: PROVIDER_ERROR (`E_PROVIDER_NO_KEY`) - Authentication or missing API key issues for external providers.
- `7`: FATAL_ERROR (`E_FATAL`) - Unhandled or unexpected critical exceptions.

*(Note: Exit code `6` / `TIMEOUT_ERROR` is reserved but not currently produced by the runtime execution loop.)*

---

## Spec Schema (Zod)

The JSON specification is validated against the following Zod schema definitions:

```typescript
import z from "zod";

export const HandleSpecSchema = z.object({
	label: z.string(),
	dataTypes: z.array(z.string()),
});

export const NodeSpecSchema = z.object({
	id: z.string(),
	type: z.string(),
	name: z.string().optional(),
	position: z
		.object({ x: z.number(), y: z.number() })
		.optional()
		.default({ x: 0, y: 0 }),
	config: z.record(z.string(), z.unknown()).optional().default({}),
	dynamicInputs: z.array(HandleSpecSchema).optional().default([]),
	dynamicOutputs: z.array(HandleSpecSchema).optional().default([]),
	result: z.unknown().optional(),
	locked: z.boolean().optional(),
});

export const EdgeSpecSchema = z.object({
	source: z.string(),
	target: z.string(),
	sourceLabel: z.string().optional(),
	targetLabel: z.string().optional(),
});

export const FontSpecSchema = z.object({
	family: z.string(),
	file: z.string(),
});

export const CanvasSpecSchema = z.object({
	name: z.string(),
	plugins: z.array(z.string()).optional().default([]),
	nodes: z.array(NodeSpecSchema),
	edges: z.array(EdgeSpecSchema).optional().default([]),
	fonts: z.array(FontSpecSchema).optional().default([]),
	canvasId: z.string().optional(),
});
```

### Declarative Local Imports
Instead of specifying complex mock node results for file uploads/imports, you can configure the path to local files directly inside your `Import` nodes:
```json
{
  "id": "import-1",
  "type": "Import",
  "config": {
    "file": "path/to/media.mp4"
  }
}
```
The CLI dynamically reads the local file, fetches metadata (resolution, duration, FPS, sample rates), and constructs the required node results automatically before execution.

---

## Spec Format Example

Below is a complete, validated canvas spec containing `CanvasGenerator`, `Modulate`, `Text`, `LLM`, `ImageGen`, and `Compositor` nodes:

```jsonc
{
  "name": "Creative City Canvas",
  "nodes": [
    {
      "id": "canvas-bg",
      "type": "CanvasGenerator",
      "name": "Base Background Canvas",
      "config": {
        "width": 1280,
        "height": 720,
        "fillType": "solid",
        "solidColor": "#1a1a2e"
      }
    },
    {
      "id": "modulate-1",
      "type": "Modulate",
      "name": "Background Color Adjuster",
      "config": {
        "hue": 180,
        "brightness": 1.2,
        "contrast": 1.0,
        "exposure": 0.0,
        "saturation": 1.5,
        "sepia": 0.0
      }
    },
    {
      "id": "prompt-text",
      "type": "Text",
      "name": "AI Prompter Text",
      "config": {
        "content": "Create a detailed image generation prompt of a futuristic neon city skyline, 1 sentence."
      }
    },
    {
      "id": "llm-1",
      "type": "LLM",
      "name": "Creative Prompt Refiner",
      "config": {
        "model": "google/gemini-3.7-flash"
      }
    },
    {
      "id": "img-1",
      "type": "ImageGen",
      "name": "AI Cityscape Generator",
      "config": {
        "model": "openai/gpt-image-2",
        "openaiSize": "square",
        "openaiQuality": "medium",
        "openaiFormat": "png",
        "openaiBackground": "opaque"
      }
    },
    {
      "id": "comp-1",
      "type": "Compositor",
      "name": "Overlay Compositor",
      "config": {
        "width": 1280,
        "height": 720,
        "backgroundColor": "#000000",
        "layout": [
          {
            "id": "bg-media",
            "kind": "media",
            "inputHandleId": "background",
            "position": "absolute",
            "x": 0,
            "y": 0,
            "width": 1280,
            "height": 720,
            "fit": "cover"
          },
          {
            "id": "overlay-media",
            "kind": "media",
            "inputHandleId": "overlay",
            "position": "absolute",
            "x": 160,
            "y": 90,
            "width": 960,
            "height": 540,
            "fit": "cover"
          }
        ]
      },
      "dynamicInputs": [
        {
          "label": "background",
          "dataTypes": ["Image"]
        },
        {
          "label": "overlay",
          "dataTypes": ["Image"]
        }
      ]
    },
    {
      "id": "export-node",
      "type": "Export",
      "config": {
        "file": "./renders/output.png"
      }
    }
  ],
  "edges": [
    {
      "source": "canvas-bg",
      "target": "modulate-1",
      "sourceLabel": "Result",
      "targetLabel": "Input"
    },
    {
      "source": "prompt-text",
      "target": "llm-1",
      "sourceLabel": "Result",
      "targetLabel": "Prompt"
    },
    {
      "source": "llm-1",
      "target": "img-1",
      "sourceLabel": "Result",
      "targetLabel": "Prompt"
    },
    {
      "source": "modulate-1",
      "target": "comp-1",
      "sourceLabel": "Result",
      "targetLabel": "background"
    },
    {
      "source": "img-1",
      "target": "comp-1",
      "sourceLabel": "Result",
      "targetLabel": "overlay"
    },
    {
      "source": "comp-1",
      "target": "export-node",
      "sourceLabel": "Result",
      "targetLabel": "Input"
    }
  ]
}
```

---

## Supported Node Types

Query the complete machine-readable catalog of all supported workflow canvas nodes (with config schemas, inputs, outputs, and required provider keys) directly using the CLI:
```bash
artifex nodes --json
```

Or view individual node skill instructions:
```bash
artifex skill Compositor
artifex skill ImageGen
```

---

## 🎬 Production Examples & Blueprints

Explore production-grade, executable workflow specifications in the [`apps/gatewai-artifex/examples/`](./apps/gatewai-artifex/examples) directory:

| Preview | Example | Format | Deliverable | Key Photoshop & AI Nodes |
|---|---|---|---|---|
| [▶️ Watch](https://youtu.be/9GPEeM90blk) | [**01: Luxury Real Estate Video Ad**](./apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad) | 16:9 Video (MP4) | Architectural listing tour video with voiceover narration, lounge soundtrack, and captions. | `ImageGen`, `Curves`, `SelectiveColor`, `KenBurns`, `UnsharpMask`, `FilmGrain`, `TextToSpeech`, `AudioGenerator`, `CaptionGenerator`, `Compositor` |
| <a href="./apps/gatewai-artifex/examples/02-ecommerce-product-card"><img src="./apps/gatewai-artifex/examples/02-ecommerce-product-card/output.png" width="100" alt="E-Commerce Product Card Preview" /></a> | [**02: E-Commerce Product Ad Card**](./apps/gatewai-artifex/examples/02-ecommerce-product-card) | 1:1 Image (PNG) | Studio-retouched, alpha-isolated promotional ad creative with Photoshop layer styles. | `ImageGen`, `RemoveBackground`, `RefineEdge`, `ShapeGenerator`, `LayerStyle`, `HalftoneScreen`, `SelectiveColor`, `Compositor` |
| [▶️ Watch](https://youtube.com/shorts/lzvBc_6_tuQ) | [**03: Faceless History Cash-Cow Short**](./apps/gatewai-artifex/examples/03-faceless-cash-cow-short) | 9:16 Video (MP4) | 5-Scene vertical short with Gemini scriptwriting, 5 KenBurns trajectories, Charon voiceover, and Whisper captions. | `LLM`, `ImageGen`, `ColorBalance`, `KenBurns`, `Vignette`, `FilmGrain`, `TextToSpeech`, `CaptionGenerator`, `Compositor` |
| [▶️ Watch](https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e) | [**04: Vintage Print Editorial Poster**](./apps/gatewai-artifex/examples/04-vintage-print-editorial-poster) | 3:4 Video (MP4) | 4-Color CMYK offset lithography simulation with isolated kimono color oscillation and Swiss typography. | `ImageGen`, `ExtractObject`, `ProceduralSignal`, `Modulate`, `HalftoneScreen`, `SelectiveColor`, `Levels`, `CanvasGenerator`, `Compositor` |
| [▶️ Watch](https://youtube.com/shorts/vYRM4sDqc-4) | [**05: AI Podcast Audiogram Visualizer**](./apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer) | 1:1 Video (MP4) | 64-second Ivory theme audiogram featuring Seedance 2.5 talking avatar host and 7 KenBurns diagram scenes. | `TextToSpeech`, `MediaCut`, `ImageGen`, `VideoGen`, `CaptionGenerator`, `ShadowsHighlights`, `Curves`, `KenBurns`, `UnsharpMask`, `Compositor` |
| <a href="./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook"><img src="./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/output.png" width="75" alt="Cross-Spec Lookbook Preview" /></a> | [**06: Cross-Spec Product Lookbook**](./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook) | 3:4 Image (PNG) | Multi-spec pipeline re-using Example 02's rendered product output as an image conditioning reference for a fashion lookbook photoshoot. | `Import`, `ImageGen`, `SelectiveColor`, `FilmGrain`, `Export` |

---

### Example 01: Luxury Real Estate Commercial Video Ad

An automated luxury architectural listing commercial video pipeline that turns property prompts into broadcast-ready, motion-stabilized, color-graded listing videos with AI narration, background soundtrack, synchronized captions, and luxury typography.

[See output video on YouTube](https://youtu.be/9GPEeM90blk)

* **Format:** 16:9 Landscape Video (1080p MP4)
* **Key Nodes:** `ImageGen`, `Curves`, `SelectiveColor`, `KenBurns`, `UnsharpMask`, `FilmGrain`, `TextToSpeech`, `AudioGenerator`, `CaptionGenerator`, `Compositor`

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad/spec.json
```

---

### Example 02: High-Converting E-Commerce Product Ad Card

An automated e-commerce ad creative and social commerce design pipeline that turns product prompts into studio-retouched, alpha-isolated promotional ad banners with parametric vector shapes, Photoshop-grade layer effects, halftone styling, and dynamic typography.

<img src="./apps/gatewai-artifex/examples/02-ecommerce-product-card/output.png" width="380" alt="High-Converting E-Commerce Product Card" />

* **Format:** 1:1 Square Image (1080x1080 PNG)
* **Key Nodes:** `ImageGen`, `RemoveBackground`, `RefineEdge`, `SelectiveColor`, `ShapeGenerator`, `LayerStyle`, `HalftoneScreen`, `Compositor`

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/02-ecommerce-product-card/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/02-ecommerce-product-card/spec.json
```

---

### Example 03: Faceless History Cash-Cow Short

An automated high-retention vertical video generator pipeline with Gemini scriptwriting, 5 consecutive oil paintings, golden-age split-toning, 5 custom KenBurns camera trajectories, 35mm grain, Charon narration, and Whisper captions.

[See output video on YouTube](https://youtube.com/shorts/lzvBc_6_tuQ)

* **Format:** 9:16 Vertical Video (1080x1920 MP4)
* **Key Nodes:** `LLM`, `ImageGen`, `ColorBalance`, `KenBurns`, `Vignette`, `FilmGrain`, `TextToSpeech`, `CaptionGenerator`, `Compositor`

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/03-faceless-cash-cow-short/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/03-faceless-cow-cow-short/spec.json
```

---

### Example 04: Vintage Print Editorial Motion Poster

An automated Print-on-Demand and motion poster pipeline with 4-color CMYK offset lithography screening, isolated object displacement wave motion, Swiss modernist typography, and archival paper absorption response curves.

[Watch motion poster preview](https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e)

* **Format:** 3:4 Editorial Motion Poster (1080x1440 MP4 @ 24fps)
* **Key Nodes:** `ImageGen`, `ExtractObject`, `ProceduralSignal`, `Modulate`, `SelectiveColor`, `Levels`, `CanvasGenerator`, `Compositor`

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/spec.json
```

---

### Example 05: AI Podcast Audiogram Visualizer (64s Episode)

A 64-second multi-modal podcast repurposing pipeline in a refined Ivory Light Theme featuring a Seedance 2.5 talking female avatar host, 7 middle KenBurns AI infographic scenes, warm tonal dynamic range calibration, speaker badges, and synchronized subtitles.

[See output video on YouTube](https://youtube.com/shorts/vYRM4sDqc-4)

* **Format:** 1:1 Social Audiogram Video (1080x1080 MP4)
* **Key Nodes:** `TextToSpeech`, `MediaCut`, `ImageGen`, `VideoGen`, `KenBurns`, `Curves`, `Levels`, `ShadowsHighlights`, `CaptionGenerator`, `Compositor`

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/spec.json
```

---

### Example 06: Cross-Spec Streetwear Lookbook Editorial

An automated fashion lookbook photoshoot pipeline demonstrating **cross-spec asset re-use**: importing the rendered promotional creative output from Example 02 as a reference image to condition an AI image generator to synthesize a fashion photoshoot.

<img src="./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/output.png" width="340" alt="Cross-Spec Streetwear Lookbook Editorial" />

* **Format:** 3:4 Editorial Image (1K PNG)
* **Key Nodes:** `Import` (Cross-Spec Asset Re-use), `ImageGen`, `SelectiveColor`, `FilmGrain`, `Export`

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/spec.json
```

---

## Autonomous Agent Production Loop

Artifex is the execution runtime for AI-authored media workflows — not merely a renderer. An agent can describe a composition as a graph, ask Artifex to validate it, execute only the necessary nodes, inspect the resulting artifacts, and export the final work without driving a web UI or learning backend internals.

```text
workflow spec → validation → execution → inspectable artifacts → export
```

### What this gives an agent:
- **A machine-executable media contract:** Nodes, configuration, handles, dependencies, and export targets live in one portable JSON document.
- **Early, actionable failures:** Schema, graph, input, provider, and renderer failures are separated by coded exits instead of being hidden in prose.
- **Selective execution:** Run the whole graph or target a node while preserving upstream dependencies and cached results.
- **Safe checkpoints:** State files let an agent resume work, export another target, or revise a composition without repeating expensive generation calls.
- **Inspectable intermediate work:** Images, audio, video, text, filters, and compositions remain visible as node results.

### GPU-First Execution
Artifex is designed around local hardware-accelerated rendering. The GPU is part of the rendering path for visual composition and media operations, so a generic CPU-only CI pipeline is not the primary deployment model. For repeatable automation, run Artifex on a machine with the required graphics stack.

---

## Custom Nodes & Local Plugins

Artifex allows developers and AI agents to author, scaffold, and execute custom node packages directly from the local filesystem.

### 1. Scaffold a Custom Node
```bash
artifex init-node node-my-filter --type MyFilter --category Media
```
Creates a complete TypeScript package structure with `src/metadata.ts`, `src/server/processor.ts`, `src/renderers/webgpu-renderer.ts`, and `SKILL.md`.

### 2. Include in Spec
```json
{
  "name": "Custom Pipeline",
  "plugins": ["./node-my-filter"],
  "nodes": [
    { "id": "input", "type": "CanvasGenerator", "config": { "width": 512, "height": 512 } },
    { "id": "effect", "type": "MyFilter", "config": { "strength": 3 } },
    { "id": "export", "type": "Export", "config": { "file": "./out.png" } }
  ],
  "edges": [
    { "source": "input", "target": "effect" },
    { "source": "effect", "target": "export" }
  ]
}
```

### 3. Run or Validate with CLI
```bash
artifex validate spec.json --plugin ./node-my-filter
artifex run spec.json
```

---

## Monorepo Packages

### Core Packages (`packages/`)
- **`@gatewai.studio/core`**: Core domain types, virtual media data models, metadata extraction, and operation graph types.
- **`@gatewai.studio/node-sdk`**: SDK for authoring Gatewai nodes, manifests, execution processors, and renderers.
- **`@gatewai.studio/webgpu-renderers`**: WebGPU rendering pipelines, WGSL shader utilities, and hardware-accelerated media renderers.
- **`@gatewai.studio/client-utils`**: Common browser/client utility functions.
- **`@gatewai.studio/tsconfig`**: Shared TypeScript configuration presets.
- **`@gatewai.studio/artifex-skills`**: Agent skills, node instructions, and execution guides.

### Standalone & Reference Nodes (`nodes/`)
The repository contains 58 open-source node packages implementing media operations, shaders, audio processors, and generation primitives:
- **Visual Filters & Adjustments:** `@gatewai.studio/node-blur`, `@gatewai.studio/node-curves`, `@gatewai.studio/node-levels`, `@gatewai.studio/node-selective-color`, `@gatewai.studio/node-color-balance`, `@gatewai.studio/node-colorkey`, `@gatewai.studio/node-gradient-map`, `@gatewai.studio/node-halftone-screen`, `@gatewai.studio/node-high-pass`, `@gatewai.studio/node-film-grain`, `@gatewai.studio/node-unsharp-mask`, `@gatewai.studio/node-vignette`, `@gatewai.studio/node-modulate`, `@gatewai.studio/node-shadows-highlights`, `@gatewai.studio/node-apply-lut`, `@gatewai.studio/node-extract-lut`.
- **Transforms & Geometry:** `@gatewai.studio/node-crop`, `@gatewai.studio/node-flip`, `@gatewai.studio/node-corner-pin`, `@gatewai.studio/node-resizer-scaler`, `@gatewai.studio/node-displacement-map`, `@gatewai.studio/node-mesh-warp`, `@gatewai.studio/node-tile-offset`, `@gatewai.studio/node-liquify`, `@gatewai.studio/node-kenburns`.
- **Generators & Signals:** `@gatewai.studio/node-canvas-generator`, `@gatewai.studio/node-shape-generator`, `@gatewai.studio/node-signal`, `@gatewai.studio/node-noise-generator`, `@gatewai.studio/node-procedural-vfx`, `@gatewai.studio/node-number`, `@gatewai.studio/node-text`, `@gatewai.studio/node-text-merger`, `@gatewai.studio/node-html-video-gen`, `@gatewai.studio/node-html-video-render`.
- **Audio Processing:** `@gatewai.studio/node-audio-compressor`, `@gatewai.studio/node-audio-delay`, `@gatewai.studio/node-audio-fade`, `@gatewai.studio/node-audio-noise-gate`, `@gatewai.studio/node-audio-parametric-eq`, `@gatewai.studio/node-audio-reverb`, `@gatewai.studio/node-channel-merger`, `@gatewai.studio/node-channel-splitter`, `@gatewai.studio/node-stereo-panning`, `@gatewai.studio/node-video-to-audio`.
- **AI & Automation Primitives:** `@gatewai.studio/node-llm`, `@gatewai.studio/node-caption-editor`, `@gatewai.studio/node-export`, `@gatewai.studio/node-extract-frame`, `@gatewai.studio/node-layer-style`, `@gatewai.studio/node-mask-math`, `@gatewai.studio/node-media-cut`, `@gatewai.studio/node-note`, `@gatewai.studio/node-paint`, `@gatewai.studio/node-patch-heal`, `@gatewai.studio/node-preview`, `@gatewai.studio/node-refine-edge`, `@gatewai.studio/node-object-detector`.

---

## Development

```bash
pnpm install
pnpm build
pnpm test
```

---

## License

AGPL-3.0
