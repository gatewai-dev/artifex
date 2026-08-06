---
name: artifex
description: Install, configure, and execute the Gatewai Artifex - GPU harness, headless workflow engine and offline media renderer.
triggers:
  - "install artifex"
  - "run workflow offline"
  - "gatewai-artifex"
  - "@gatewai.studio/artifex"
  - "artifex cli"
  - "render spec"
  - "run headless"
library: "@gatewai.studio/artifex"
repository: "https://github.com/gatewai-dev/artifex-skills"
version: "1.0.130"
schema: "https://schemas.agentskills.io/v1/skill.json"
---

# Artifex: Headless Workflow Engine & Media Renderer

Artifex (`@gatewai.studio/artifex`) is a non-interactive, machine-first CLI designed for autonomous AI agents (Claude Code, Cursor, MCP callers, etc.) to compose, validate, run, and render Gatewai workflow canvases locally and offline. It uses GPU capabilities and has more than 60 nodes including AI tools.

---

## 1. Credentials & Setup

Provider keys are required to execute nodes that call remote APIs:
- **`GATEWAI_FAL_API_KEY`**: Required for media generation (e.g. `ImageGen`, `VideoGen`, `TextToSpeech`, `MusicGenerator`).
- **`GATEWAI_OPENROUTER_API_KEY`**: Required for LLM, HTML Motion Generator, Lottie Generator nodes.

Keys can be set as environment variables or placed in the home directory config:
`~/.config/gatewai/credentials.json`
```json
{
  "GATEWAI_FAL_API_KEY": "your-fal-key",
  "GATEWAI_OPENROUTER_API_KEY": "your-openrouter-key"
}
```

---

## 2. Command Catalog

The CLI offers commands to discover capabilities, validate templates, execute nodes, and render target media output.

| Command | Arguments | Description | Options |
|---|---|---|---|
| `nodes` | *none* | Prints the registered nodes manifest details (types, config schema fields, input/output handles). | `--json` |
| `skill` | `<nodeType>` | Prints the markdown documentation/instructions (`SKILL.md`) for the specific node type. | `--json`, `--list` |
| `validate` | `<spec.json>` | Validates that the spec layout conforms to schema and that node configs match manifest Zod schemas. | `--json` |
| `build` | `<spec.json>` | Assembles the graph in-memory and verifies that it is topologically sortable (has no cycles). | `--json` |
| `run` | `<spec.json>` | Runs all necessary nodes in topological order, resolves output assets, and writes file exports to disk. Defaults to running all terminal nodes. | `--node <ids>` (comma-separated terminal nodes), `--json`, `--state <file>`, `--from-state <file>` |

---

## 3. Node Catalog & Respective Skills

To view the schema details, config parameters, and input/output handles of all supported nodes:
- Refer to the dedicated [Node Catalog Skill](file:///packages/artifex-skills/skills/node-catalog/SKILL.md) which lists all registered nodes.
- Each node in the Node Catalog points to its respective detailed skill file (e.g. `skills/<nodeType>/SKILL.md`).
- Alternatively, run `artifex nodes --json` to fetch the schemas dynamically or `artifex skill <nodeType>` to read a specific node's skill instructions.
- **Workflow & Domain-Specific Skills**: Visual workflow/domain skills (such as `embedded-captions`, `talking-head-recut`, `product-launch-video`, `motion-graphics`, etc.) used in conjunction with the HTML Video Generator (`HTMLVideoGen`) are not pre-packaged. If the AI agent has terminal access, it must keep these skills updated and fresh by running:
  ```bash
  npx hyperframes skills update <workflow-name>
  ```
  (e.g., `npx hyperframes skills update product-launch-video`).

---

## 4. Spec.json Schema Guide

The JSON specification (`spec.json`) defines the canvas configuration, dynamic imports, nodes array, edges wiring, loaded fonts, and render settings. See [Node Catalog Skill](file:///packages/artifex-skills/skills/node-catalog/SKILL.md) for configuring individual nodes.

### Timing Units (Frames vs Milliseconds)
Different nodes and canvas spec properties use different timing units:
- **Canvas duration and Node configurations** (e.g., `durationMs`, `holdMs`, `durationInMS`, `trimStart`, `trimEnd`) are specified in **milliseconds (ms)**.
- **Compositor Layers** specify their start position using **`startFrame`**, which is measured in **frames** (computed as `seconds * FPS` of the canvas).
Always verify the units when configuring temporal properties to avoid layout offsets.

### Declarative Dynamic Imports (`imports`)
Instead of manually configuring verbose `Import` node structures and mock database records, AI agents can declare input files at the top level of the spec:
```json
  "imports": {
    "import-1": "./assets/input-video.mp4",
    "import-2": "./assets/overlay-image.png"
  }
```
- **Structure**: An object mapping `nodeId` to its local `filePath` (relative to the spec file).
- **Automation**: The CLI automatically reads the local file, extracts full metadata (width, height, FPS, duration, audio sample rates, channels, codec info) using `@gatewai/media/server`, and injects the populated `Import` node definition into the execution graph.

### Headless Custom Fonts (`fonts`)
Headless rendering supports custom TTF fonts for text layers. Define them in the top-level `fonts` array:
```json
  "fonts": [
    {
      "family": "Inter",
      "file": "./fonts/Inter-Regular.ttf"
    }
  ]
```
- Custom fonts are automatically registered for use and preloaded into the canvas GPU cache (`SlugFontCache`) during execution.

### Complete Spec.json Example
```json
{
  "name": "Photoshop-like Image Processing Demo",
  "nodes": [
    {
      "id": "bg-canvas",
      "type": "CanvasGenerator",
      "name": "Background Gradient",
      "config": {
        "width": 1080,
        "height": 1080,
        "fillType": "linear",
        "gradientStart": "#0f172a",
        "gradientEnd": "#1e1b4b",
        "gradientAngle": 135
      }
    },
    {
      "id": "fg-canvas",
      "type": "CanvasGenerator",
      "name": "Foreground Shape",
      "config": {
        "width": 500,
        "height": 500,
        "fillType": "linear",
        "gradientStart": "#ec4899",
        "gradientEnd": "#8b5cf6",
        "gradientAngle": 45
      }
    },
    {
      "id": "modulate-fg",
      "type": "Modulate",
      "name": "Color Adjustment",
      "config": {
        "hue": 10,
        "brightness": 1.2,
        "contrast": 1.1,
        "exposure": 0.0,
        "saturation": 1.3,
        "sepia": 0.0
      }
    },
    {
      "id": "blur-fg",
      "type": "Blur",
      "name": "Gaussian Blur Filter",
      "config": {
        "blurType": "Gaussian",
        "strength": 12,
        "angle": 0,
        "sigmaColor": 0.1,
        "centerX": 0.5,
        "centerY": 0.5
      }
    },
    {
      "id": "vignette-fg",
      "type": "Vignette",
      "name": "Vignette Filter",
      "config": {
        "strength": 60,
        "radius": 1.1,
        "softness": 0.4,
        "roundness": 0.6,
        "centerX": 0.5,
        "centerY": 0.5
      }
    },
    {
      "id": "image-compositor",
      "type": "Compositor",
      "name": "Layer Compositor",
      "config": {
        "width": 1080,
        "height": 1080,
        "backgroundColor": "#000000",
        "layerUpdates": [
          {
            "id": "bg-layer",
            "inputHandleId": "background_layer",
            "type": "Image",
            "x": 0,
            "y": 0,
            "width": 1080,
            "height": 1080
          },
          {
            "id": "fg-layer",
            "inputHandleId": "foreground_layer",
            "type": "Image",
            "x": 290,
            "y": 290,
            "width": 500,
            "height": 500
          }
        ]
      },
      "dynamicInputs": [
        {
          "label": "background_layer",
          "dataTypes": [
            "Image"
          ]
        },
        {
          "label": "foreground_layer",
          "dataTypes": [
            "Image"
          ]
        }
      ]
    },
    {
      "id": "export-node",
      "type": "Export",
      "name": "Export Final Image",
      "config": {
        "file": "scratch-renders/photoshop-demo.png"
      }
    }
  ],
  "edges": [
    {
      "source": "bg-canvas",
      "target": "image-compositor",
      "sourceLabel": "Result",
      "targetLabel": "background_layer"
    },
    {
      "source": "fg-canvas",
      "target": "modulate-fg",
      "sourceLabel": "Result",
      "targetLabel": "Input"
    },
    {
      "source": "modulate-fg",
      "target": "blur-fg",
      "sourceLabel": "Result",
      "targetLabel": "Input"
    },
    {
      "source": "blur-fg",
      "target": "vignette-fg",
      "sourceLabel": "Result",
      "targetLabel": "Input"
    },
    {
      "source": "vignette-fg",
      "target": "image-compositor",
      "sourceLabel": "Result",
      "targetLabel": "foreground_layer"
    },
    {
      "source": "image-compositor",
      "target": "export-node",
      "sourceLabel": "Result",
      "targetLabel": "Input"
    }
  ]
}
```

---

## 5. Best Practices for AI Agents

When acting as an AI agent configuring workflows, always follow this pipeline:

1. **Query Capability Registry**:
   Query all node schema configurations before writing a spec:
   ```bash
   artifex nodes --json
   ```
2. **Inspect Specific Nodes**:
   Review constraints for a node type to see what parameters to send (e.g. reading its respective skill at `skills/<nodeType>/SKILL.md`):
   ```bash
   artifex skill TextToSpeech
   ```
3. **Draft & Dry Run**:
   Save your canvas definition to `spec_[CANVAS_NAME].json` and validate:
   ```bash
   artifex validate spec_[CANVAS_NAME].json
   artifex build spec_[CANVAS_NAME].json
   ```
4. **Checkpoint with State**:
   To avoid re-running expensive remote AI generation API calls (FAL/OpenRouter) when adjusting canvas visuals or composition layers, always save state:
   ```bash
   artifex run spec_[CANVAS_NAME].json --state checkpoint.json
   ```
    Configure the output path directly inside the **Export** node's config (e.g. `"file": "./renders/output.mp4"`), then execute using:
    ```bash
    artifex run spec_[CANVAS_NAME].json --from-state checkpoint.json
    ```
5. **Handle Coded Exit Codes**:
   Always handle exit codes programmatically:
   - `0`: Success
   - `2`: Input Error (`E_INPUT`)
   - `3`: Graph Build Error (`E_GRAPH`)
   - `4`: Local Render Error (`E_RENDER`)
   - `5`: Remote Provider Error / Key Missing (`E_PROVIDER_NO_KEY`)
   - `6`: Timeout (`E_TIMEOUT`)
   - `7`: Fatal System Error (`E_FATAL`)

---

## 6. Human-in-the-Loop (HITL) Workflow

AI agents must design workflows around human check-ins to conserve tokens, save remote API costs, and guarantee aesthetic excellence:

### A. Incremental Draft Verification
- **Validate First**: Always run `artifex validate` and `artifex build` before executing any workflow spec.
- **Low-Cost Preview Rendering**: Before rendering an entire multi-scene video or executing multiple expensive remote AI generations, extract a single representative preview frame using `ExtractFrame` (rendering to a file like `./scratch-renders/preview.png`). Show the image to the human user for approval.
- **Save and Load State**: Cache outputs of expensive generator nodes (e.g. `ImageGen`, `TextToSpeech`, `VideoGen`) into a state file (`--state checkpoint.json`) after your runs. For subsequent edits to layout positions, sizing, typography, filter adjustments, or composition layers, load the cached outputs using `--from-state checkpoint.json` to enable instant local updates.

### B. Interactive Error Handoff
- Do not attempt to bypass missing credentials in an infinite loop. If execution yields code `5` (`E_PROVIDER_NO_KEY`), immediately pause and ask the user to configure their environment or update `~/.config/gatewai/credentials.json`.

---

## 7. Designing Premium Brand Systems (Full Potential)

When composing canvases and media layouts, agents should avoid generic templates and leverage Artifex's full suite of 60+ processing nodes to construct premium, high-end brand assets.

### A. Metaphor and Strategy First
Before composing a canvas, define a unified strategy based on the project's category:
- **Dark Developer / Builder**: Black/near-black panels, monospace labels, command lines, terminal frames, cyan/coral accents.
- **Dark Security / Threat Intel**: Black/navy base, shield geometry, watch/radar targets, red/blue alert chips, sharp gradients.
- **Light Editorial / Compliance**: Warm ivory/paper textures, small serif labels, gold/navy accent swatches, stamp/badge shapes.
- **Luxury / Beauty**: Espresso/stone canvas, elegant monograms, embossing visual layers, soft drop shadows.

### B. Structured Grid Layouts
Organize canvas presentations in clean layouts (e.g., 3×3 grids, 2×3 strips, or 2×2 boards) with consistent panel gutters and generous negative space. Rhythmically divide panels to tell a cohesive story:
1. **Logo Cover**: Large symbol/monmark, high negative space.
2. **Construction/Geometry**: Geometry guides, alignment lines, measurement metrics.
3. **Digital Mockup**: Clean browser bars, prompt inputs, code blocks, or terminal containers.
4. **Physical Application**: Stationery crops, folders, labels, or badges.
5. **System Identity**: Consistent typographic specimen text, swatches, and accent color disks.

### C. Design Restraint & Anti-Generic Rules
- **No Floating Clichés**: Do not create generic AI sparkles, floating light-glow blobs, or busy PowerPoint-style marketing slides. Keep compositions quiet, minimal, and premium.
- **Composition over Raw Generation**: Do not ask AI generators for a pre-baked single-image template. Instead, generate isolated assets (e.g., a minimal logo mark, an atmospheric photo crop) and use `Compositor`, `Blur`, `Modulate`, `Vignette`, and custom font mapping locally to create the final presentation board.
- **Disciplined Palette & Details**: Restrict palettes to 1 dominant background, 1 primary accent, and 1-2 neutrals. Reward close inspection by adding subtle alignment crosshairs, small page/panel index numbers, and thin borders.

---

## 8. Frame Extraction Guide

Frame extraction in canvas specs should be handled structurally via the graph using the `ExtractFrame` (Frame Extractor) node, rather than passing frame numbers to the CLI.

To extract a frame:
1. Insert an `ExtractFrame` node in the spec config:
   ```json
   {
     "id": "frame-grab",
     "type": "ExtractFrame",
     "config": {
       "frame": 15
     }
   }
   ```
2. Connect the video/media source to the `ExtractFrame` node's `Media` handle.
3. Connect the `ExtractFrame` node's `Frame` output handle to the `Export` node's `Input` handle.
4. Set the `Export` node config's `file` property (e.g. `"file": "./scratch-renders/thumbnail.png"`).
5. Execute the canvas using the standard CLI command:
   ```bash
   artifex run spec.json
   ```