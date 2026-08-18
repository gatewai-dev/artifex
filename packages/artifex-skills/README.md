# @gatewai.studio/artifex-skills

<p align="center">
  <img src="https://raw.githubusercontent.com/gatewai-dev/artifex-skills/refs/heads/main/assets/logo.png" alt="Gatewai Logo" width="160" />
</p>

## Headless AI media workflows for autonomous agents

`@gatewai.studio/artifex-skills` is the official skill bundle for **Gatewai Artifex** — a headless
workflow engine that turns a JSON canvas spec into rendered image, video, and audio files.

An agent (Claude Code, Cursor, MCP callers, custom scripts) composes a `spec.json` from **57 node
types** — AI generation, compositing, color grading, audio mastering — and the Artifex CLI validates
it, executes the graph in dependency order, and writes the finished files to disk. Rendering is
GPU-accelerated and runs locally; only the AI generation nodes (image/video/audio/LLM) call remote
providers, and only two API keys are needed.

This package contains what agents need to drive it: the full node catalog, per-node configuration
references, and three production-grade recipes.

---

## What you can do with it

| Outcome | How |
|---|---|
| **Script → finished social short** | Feed a raw script; Artifex refines it with an LLM, synthesizes a voiceover (TextToSpeech), transcribes word-level captions (Whisper), generates, background-removes and upscales a character (Flux + RemoveBackground + Upscaler), composites everything on an animated gradient layout, and exports the MP4 with captions burned in. [Full spec →](file:///packages/artifex-skills/references/recipe-viral-social-short.md) |
| **Post-production grade** | Import flat footage and apply a teal/orange Curves grade, Levels black crush, blurred backing framing, vignette, chromatic film grain, and typographic title cards. [Full spec →](file:///packages/artifex-skills/references/recipe-cinematic-style-transfer.md) |
| **Scored product video** | Grade product footage, animate it onto a branded canvas with keyframe entrances, generate a frame-synced soundtrack (VideoToMusic), fade, and remux the final video+audio. [Full spec →](file:///packages/artifex-skills/references/recipe-product-demo.md) |
| **Anything repeatable, at scale** | Artifex is headless and deterministic: the same spec runs any number of times with any inputs. Coded exit codes make it script/CI friendly, and state checkpoints let agents cache expensive AI outputs and iterate cheaply. |
| **Iterate with human approval** | Extract a single preview frame (`ExtractFrame`) before committing to a full render, and re-run layout edits from a checkpoint — no re-invoking remote models. |

The three recipes are complete, copy-paste-ready canvas specs. Each takes minutes to adapt.

---

## Node capabilities

All 57 node types are documented in the [Node Catalog](file:///packages/artifex-skills/references/node-catalog.md),
each with its own reference file (`references/<node-type>.md`). By capability:

| Area | What it covers | Example nodes |
|---|---|---|
| AI generation | text → image/video/audio/Lottie/SVG, talking avatars, LLMs | `ImageGen`, `VideoGen`, `TextToSpeech`, `LipSync`, `LLM`, `LottieGen`, `SvgGen` |
| AI media intelligence | captions, sync soundtracks, background removal, upscaling, object extraction, smart cuts | `CaptionGenerator`, `VideoToMusic`, `RemoveBackground`, `Upscaler`, `ExtractObject`, `SmartCut`, `DepthMap` |
| Layout & compositing | HTML-like flex/absolute layout tree with per-node keyframe animation | `Compositor`, `CanvasGenerator`, `Text`, `KenBurns`, `ResizerScaler`, `MediaCut` |
| Transform & compositing FX | crop, corner pin, mesh warp, displacement, chroma key, paint | `Crop`, `CornerPin`, `MeshWarp`, `DisplacementMap`, `ColorKey`, `Paint`, `Modulate` |
| Color & film | spline curves, levels, LUTs, blur, vignette, film grain | `Curves`, `Levels`, `ApplyLUT`, `ExtractLUT`, `Blur`, `Vignette`, `FilmGrain` |
| Audio mastering | EQ, compression, noise gate, reverb, echo, stereo, fades | `ParametricEq`, `Compressor`, `NoiseGate`, `Reverb`, `Delay`, `StereoPanning`, `AudioFade` |
| I/O & automation | local file imports, exports, screen/camera recording, webhooks | `Import`, `Export`, `Recorder`, `Webhook` |

Compositions are written as a **layout tree**: a recursive document of `flex` / `block` / `box` /
`text` / `media` nodes with HTML-like sizing (`fill`, `fit`, `auto`, px) and GSAP-style keyframe
tracks. Rendering is deterministic: the same document and frame produce identical pixels, in
preview and final render.

---

## A minimal example

This is a complete, runnable spec: two generated gradients, a color adjustment, a blur, a
vignette, a layout composite, and an export — 7 nodes wired as a dependency graph.

```json
{
  "name": "Graded Gradient Card",
  "nodes": [
    {
      "id": "bg-canvas",
      "type": "CanvasGenerator",
      "config": {
        "width": 1280, "height": 720,
        "fillType": "linear",
        "gradientStart": "#101828", "gradientEnd": "#1e1b4b", "gradientAngle": 135
      }
    },
    {
      "id": "fg-canvas",
      "type": "CanvasGenerator",
      "config": {
        "width": 600, "height": 400,
        "fillType": "linear",
        "gradientStart": "#ec4899", "gradientEnd": "#8b5cf6", "gradientAngle": 45
      }
    },
    {
      "id": "modulate-fg",
      "type": "Modulate",
      "config": {
        "hue": 0, "brightness": 1.1, "contrast": 1.15, "exposure": 0.0, "saturation": 1.3, "sepia": 0.0
      }
    },
    {
      "id": "blur-fg",
      "type": "Blur",
      "config": {
        "blurType": "Gaussian", "strength": 14, "angle": 0, "sigmaColor": 0.1,
        "centerX": 0.5, "centerY": 0.5
      }
    },
    {
      "id": "vignette-fg",
      "type": "Vignette",
      "config": {
        "strength": 55, "radius": 1.1, "softness": 0.4, "roundness": 0.6,
        "centerX": 0.5, "centerY": 0.5
      }
    },
    {
      "id": "compositor-node",
      "type": "Compositor",
      "config": {
        "width": 1280, "height": 720, "backgroundColor": "#000000", "mode": "Image",
        "layout": [
          {
            "id": "bg-media", "kind": "media", "inputHandleId": "background_layer",
            "position": "absolute", "x": 0, "y": 0, "width": 1280, "height": 720, "fit": "cover"
          },
          {
            "id": "fg-media", "kind": "media", "inputHandleId": "foreground_layer",
            "position": "absolute", "x": 340, "y": 160, "width": 600, "height": 400,
            "fit": "cover", "borderRadius": 24
          }
        ]
      },
      "dynamicInputs": [
        { "label": "background_layer", "dataTypes": ["Image"] },
        { "label": "foreground_layer", "dataTypes": ["Image"] }
      ]
    },
    {
      "id": "export-node",
      "type": "Export",
      "config": { "file": "./renders/graded-card.png" }
    }
  ],
  "edges": [
    { "source": "bg-canvas", "target": "compositor-node", "sourceLabel": "Result", "targetLabel": "background_layer" },
    { "source": "fg-canvas", "target": "modulate-fg", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "modulate-fg", "target": "blur-fg", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "blur-fg", "target": "vignette-fg", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "vignette-fg", "target": "compositor-node", "sourceLabel": "Result", "targetLabel": "foreground_layer" },
    { "source": "compositor-node", "target": "export-node", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

Save it as `spec.json`, then run:

```bash
# 1. Validate — schema, node configs, edge wiring (all errors at once, exit 2 on failure)
npx -y @gatewai.studio/artifex validate spec.json

# 2. Inspect — assemble the graph and print the topological execution order
npx -y @gatewai.studio/artifex build spec.json

# 3. Render — execute the graph and write the export
npx -y @gatewai.studio/artifex run spec.json
```

That renders a 1280×720 still — background gradient, foreground card with a saturated color
adjustment, gaussian blur, vignette, and rounded-corner composite:

<p align="center">
  <img src="https://raw.githubusercontent.com/gatewai-dev/artifex-skills/refs/heads/main/assets/example-minimal-graded-card.png" alt="Output of the minimal example: a dark gradient background with a blurred, vignetted gradient card composited at 340,160" width="480" />
</p>

For video, set the compositor's `"mode": "Video"`, add `"fps"` and per-node `startFrame` /
`durationFrames` + animation tracks, and change the export `format` to `mp4` — the same spec
shape extends to full multi-scene timelines (see the recipes).

---

## CLI at a glance

| Command | Purpose |
|---|---|
| `nodes` | Print the registered node manifest (`--json` for machine-readable schemas). |
| `skill <nodeType>` | Read the markdown instructions for one node type. |
| `validate <spec.json>` | Non-mutating check of layout schema, node config Zod schemas, edge wiring, and HTML lint rules. Reports **all** errors at once. |
| `build <spec.json>` | Assemble the graph in memory and print the full topological execution tree. |
| `run <spec.json>` | Execute all necessary nodes in topological order and write exports. `--node <ids>` limits terminal nodes, `--state` / `--from-state` checkpoint results. |

Exit codes are stable and script-friendly: `0` success · `2` input error · `3` graph build
error · `4` render error · `5` missing provider key · `6` timeout · `7` fatal error.

Only two environment variables are required, for the AI generation nodes:

- `GATEWAI_FAL_API_KEY` — media generation (`ImageGen`, `VideoGen`, `TextToSpeech`, …)
- `GATEWAI_OPENROUTER_API_KEY` — LLM, motion, and Lottie generator nodes

They can also live in `~/.config/gatewai/credentials.json`. Everything else — compositing,
filters, grading, audio, encoding — runs locally on the GPU without network access.

---

## Installation

Load the skills into an agent workspace:

```bash
npx skills add gatewai-dev/artifex-skills
```

Then:

- **[SKILL.md](./SKILL.md)** — the main entry point: command workflows, spec schema guide,
  timing units (ms vs frames), state management, and best practices for agents.
- **[Node Catalog](file:///packages/artifex-skills/references/node-catalog.md)** — every node
  type with its input/output handles and config fields.
- **`references/<node-type>.md`** — per-node configuration specs and examples.
- **`references/recipe-*.md`** — the three production recipes linked above.