---
name: artifex
description: Install, configure, and execute the Gatewai Artifex - GPU harness, headless workflow engine and offline media renderer.
metadata:
  triggers: "install artifex, run workflow offline, gatewai-artifex, @gatewai.studio/artifex, artifex cli, render spec, run headless"
  library: "@gatewai.studio/artifex"
  repository: "https://github.com/gatewai-dev/artifex-skills"
  version: "1.0.143"
  schema: "https://schemas.agentskills.io/v1/skill.json"
---

# Artifex: Headless Workflow Engine & Media Renderer

Artifex (`@gatewai.studio/artifex`) is a machine-first CLI designed for autonomous AI agents to compose, validate, run, and render Gatewai workflow canvases locally and offline. It uses GPU capabilities and has more than 60 nodes including AI tools.

---

## 1. Installation & Execution

To run Artifex use `npx` or `pnpm dlx`:
```bash
# Run on-demand via npx
npx @gatewai.studio/artifex --help

# Run on-demand via pnpm dlx
pnpm dlx @gatewai.studio/artifex --help
```

---

## 2. Credentials & Setup

Provider keys are required to execute nodes that call remote APIs:
- **`GATEWAI_FAL_API_KEY`**: Required for media generation (e.g. `ImageGen`, `VideoGen`, `TextToSpeech`, `MusicGenerator`).
- **`GATEWAI_OPENROUTER_API_KEY`**: Required for LLM, HTML Motion Generator, Lottie Generator nodes.
- **`GATEWAI_CONCURRENT_RENDERS`**: Optional. The maximum number of render operations (e.g. composition, still image, LUT, HTML, Video renders) allowed to run concurrently. Defaults to `2`. Render operations are queued.

Keys can be set as environment variables or placed in the home directory config:
`~/.config/gatewai/credentials.json`
```json
{
  "GATEWAI_FAL_API_KEY": "your-fal-key",
  "GATEWAI_OPENROUTER_API_KEY": "your-openrouter-key"
}
```

---

## 3. Command Catalog

The CLI offers commands to discover capabilities, validate templates, execute nodes, and render target media output.

| Command | Arguments | Description | Options |
|---|---|---|---|
| `nodes` | *none* | Prints the registered nodes manifest details (types, config schema fields, input/output handles). | `--json` |
| `skill` | `<nodeType>` | Prints the markdown documentation/instructions (`SKILL.md`) for the specific node type. | `--json`, `--list` |
| `validate` | `<spec.json>` | Validates spec layout schema, node config Zod schemas, edge handle wiring, and HTML linter rules. Aggregates and returns **ALL** errors at once. | `--json` |
| `build` | `<spec.json>` | Assembles the graph in-memory and prints the full topological graph tree (nodes, handles, data types, execution order). | `--json` |
| `run` | `<spec.json>` | Runs all necessary nodes in topological order, resolves output assets, and writes file exports to disk. Defaults to running all terminal nodes. | `--node <ids>` (comma-separated terminal nodes), `--json`, `--state <file>`, `--from-state <file>` |

### `validate` vs `build` Usage Insight
- **`artifex validate <spec.json>` (Assertion & Gatekeeper)**: Non-mutating validation check for pre-execution, CI/CD, and agent dry-runs. Aggregates and reports **ALL** validation errors at once (schema errors, node Zod config errors, edge handle mismatches, and HTML linter checks). Exits with code `2` (`E_INPUT`) on error.
- **`artifex build <spec.json>` (Inspection & Graph Analyzer)**: Assembles the graph in memory and prints the complete topological execution tree (nodes, handles, data types, node IDs, variable inputs). Exits with code `3` (`E_GRAPH`) on topological failure.


---

## 4. Node Catalog & Respective Skills

To view the schema details, config parameters, and input/output handles of all supported nodes:
- Refer to the dedicated [Node Catalog](file:///packages/artifex-skills/references/node-catalog.md) which lists all registered nodes.
- Each node in the Node Catalog points to its respective detailed reference file (e.g. `references/<node-type>.md`).
- Alternatively, run `artifex nodes --json` to fetch the schemas dynamically or `artifex skill <node-type>` to read a specific node's skill instructions.
- **Workflow & Domain-Specific Skills**: Visual workflow/domain skills (such as `embedded-captions`, `talking-head-recut`, `product-launch-video`, `motion-graphics`, etc.) used in conjunction with the HTML Video Generator (`HTMLVideoGen`) are not pre-packaged. If the AI agent has terminal access, it must keep these skills updated and fresh by running:
  ```bash
  npx hyperframes skills update <workflow-name>
  ```
  (e.g., `npx hyperframes skills update product-launch-video`).

---

## 5. Spec.json Schema Guide

The JSON specification (`spec.json`) defines the canvas configuration, dynamic imports, nodes array, edges wiring, loaded fonts, and render settings. See [Node Catalog](file:///packages/artifex-skills/references/node-catalog.md) for configuring individual nodes.

### Timing Units (Frames vs Milliseconds)
- **Node configurations** (e.g., `holdMs`, `durationInMS`, `trimStart`, `trimEnd`) are specified in **milliseconds (ms)**.
- **Compositor Layers** specify their start position using **`startFrame`**, which is measured in **frames** (computed as `seconds * FPS` of the canvas).
Always verify the units when configuring temporal properties to avoid layout offsets.

### Declarative Dynamic Imports
Instead of manually configuring verbose `Import` node structures and mock database records, AI agents can configure the path to local files directly inside your `Import` nodes:
```json
    {
      "id": "import-1",
      "type": "Import",
      "config": {
        "file": "./assets/input-video.mp4"
      }
    }
```
- **Automation**: The CLI automatically reads the local file, extracts full metadata (width, height, FPS, duration, audio sample rates, channels, codec info) using `@gatewai/media/server`, and injects the populated `Import` node result definition into the execution graph.

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

## 6. Best Practices for AI Agents

When acting as an AI agent configuring workflows, always follow this pipeline:

1. **Query Capability Registry**:
   Query all node schema configurations before writing a spec:
   ```bash
   artifex nodes --json
   ```
2. **Inspect Specific Nodes**:
   Review constraints for a node type to see what parameters to send (e.g. reading its respective skill at `skills/<node-type>/SKILL.md`):
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
5. **Locking Nodes & Terminal Nodes**:
   To prevent execution of specific nodes (especially terminal / expensive generation nodes like `VideoGen` or `VideoEdit` or `ImageGen` which execute by default during a workflow run), mark them as `"locked": true` in the spec and supply their `"result"` (or load it from a checkpoint using `--from-state`). **For a terminal node to not run, it must be locked.**
6. **Handle Coded Exit Codes**:
   Always handle exit codes programmatically:
   - `0`: Success
   - `2`: Input Error (`E_INPUT`)
   - `3`: Graph Build Error (`E_GRAPH`)
   - `4`: Local Render Error (`E_RENDER`)
   - `5`: Remote Provider Error / Key Missing (`E_PROVIDER_NO_KEY`)
   - `6`: Timeout (`E_TIMEOUT`)
   - `7`: Fatal System Error (`E_FATAL`)

---

## 7. Human-in-the-Loop (HITL) Workflow

AI agents must design workflows around human check-ins to conserve tokens, save remote API costs, and guarantee aesthetic excellence:

### A. Incremental Draft Verification
- **Validate First**: Always run `artifex validate` and `artifex build` before executing any workflow spec.
- **Low-Cost Preview Rendering**: Before rendering an entire multi-scene video or executing multiple expensive remote AI generations, extract a single representative preview frame using `ExtractFrame` (rendering to a file like `./scratch-renders/preview.png`). Show the image to the human user for approval.
- **Save and Load State**: Cache outputs of expensive generator nodes (e.g. `ImageGen`, `TextToSpeech`, `VideoGen`) into a state file (`--state checkpoint.json`) after your runs. For subsequent edits to layout positions, sizing, typography, filter adjustments, or composition layers, load the cached outputs using `--from-state checkpoint.json` to enable instant local updates.
- **Lock Terminal Nodes**: To prevent a terminal node from executing, set `"locked": true` in the spec. Any terminal node that is not locked will be executed by default in full workflow runs.

### B. Interactive Error Handoff
- Do not attempt to bypass missing credentials in an infinite loop. If execution yields code `5` (`E_PROVIDER_NO_KEY`), immediately pause and ask the user to configure their environment or update `~/.config/gatewai/credentials.json`.

---

## 8. Designing Premium Brand Systems (Full Potential)

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

## 9. Frame Extraction Guide

Frame extraction in canvas specs should be handled structurally via the graph using the `ExtractFrame` (Frame Extractor) node, rather than passing frame numbers to the CLI. This is a useful tool for checking if result is in expected quality. For example before rendering HTML motion for full duration, you can extract 10 frames to check if it looks good. 

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

---

## 10. Local Rendering and Media Capabilities

Gatewai features a robust set of rendering and media processing capabilities designed to run locally, offline, and with GPU acceleration. Below is the reference architecture of what can be rendered and how the system processes each media type under the hood.

### A. WebGPU Local Rendering Engine (`@gatewai/webgpu-renderers`)

Visual assets and components are processed using modern WebGPU graphics APIs. The pipeline splits behaviors between browser (client) and headless (Node.js/server) execution:

1. **Images (`Image`)**:
   - **Browser Context**: Fetches raw data into a `Blob`, instantiates an `ImageBitmap` via `createImageBitmap()`, and uploads it directly to GPU textures using `copyExternalImageToTexture()`.
   - **Headless / Node.js**: Uses `sharp` to parse raw image buffers, processes transparency/alpha formats, and writes the resulting decoded raw pixel buffer to GPU textures using `writeTexture()`.

2. **Videos (`Video`)**:
   - Decodes frame-by-frame on the fly using `mediabunny`'s underlying decoders (leveraging `WebCodecs` or native system resources).
   - **Caching & Fallbacks**: Features a frame-caching mechanism. To maintain smooth playback and prevent blank screens when decode latency is high, it implements YouTube-like fallback logic (drawing the last good decoded frame).
   - **Frame Accuracy**: In headless/export mode, it strictly waits / blocks execution until the exact decoded frame key is retrieved, guaranteeing 100% deterministic, frame-accurate renders.

3. **Text / Paragraphs (`Text`, `Paragraph`, `Caption`)**:
   - Uses the highly optimized GPU-based vector text rendering pipeline (`Slug`).
   - **Typography Engine**: Loads TTF/OTF files via `fontkit` and dynamically generates vector curve textures on the fly (`curvesTex` format: `rgba32float`, `bandsTex` format: `rg32uint`). Text is rendered directly on the GPU as resolution-independent vector outlines.
   - **Rich Typesetting**: Supports alignment, line-heights, character-spacing, text background highlights, multi-layered text shadows, borders/strokes (inside, center, outside alignment), and custom kinetic entrance/exit text animations (`stack`, `wave`, `wiggle`, `shuffle` by character, word, or line).
   - **Emojis**: Headless context falls back to NotoColorEmoji/Apple/Segoe system styles drawn into offscreen canvases and uploaded dynamically as GPU textures.

4. **Lottie Animations (`Lottie`)**:
   - Decodes and compiles Lottie animations (`.json` and `.lottie` packages) using `@lottiefiles/dotlottie-web`.
   - **Layout / Placement**: Supports alignment and sizing modes (`contain`, `cover`, `fill`).
   - **ThorVG Font Integration**: Automatically parses Lottie JSON assets, extracts referenced text layers and font families, downloads/locates the assets, and registers them directly with the ThorVG WASM engine (via `DotLottie.registerFont()`) so Lottie text layers render correctly.
   - **Rendering**: Converts canvas renderings to GPU textures via `copyExternalImageToTexture()` (browser) or fallbacks (OffscreenCanvas/WebGL readPixels) in headless context.

5. **Vector Assets (`SVG`)**:
   - **Browser Context**: Loads XML into a SVG Blob URL, draws onto an `OffscreenCanvas`, and uploads as an `ImageBitmap`.
   - **Headless / Node.js**: Uses `@resvg/resvg-js` to rasterize SVG XML layout directly to raw pixel buffers, which are written via `writeTexture()`.

6. **Animated Graphics (`GIF`)**:
   - Parses and decompresses frame data using `gifuct-js`.
   - Tracked and cached in memory. The current frame index is computed on the fly by looping the elapsed timeline duration against the GIF's frame delays.

7. **Signal & Waveforms (`Signal`)**:
   - Renders mathematical curves, waveforms, and visualizer nodes directly via WebGPU solid/path shaders, parameterized by amplitude, frequency, phase, and offset.

8. **Canvas Layouts (`CanvasGenerator`, `Compositor`)**:
   - Draws geometric rectangles, rounded corners, solid fills, and gradients (linear, radial) natively on the GPU.
   - Combines multiple media nodes/layers using hardware-accelerated composite blending operations (supporting standard, multiply, screen, overlay, color-dodge, mask-in, mask-out, destination-over, etc.).

### B. HTML / HyperFrames Video Renderer

For complex canvas structures, web animations, or template renders that cannot be expressed via individual nodes, Gatewai uses a headless puppet rendering engine built on Puppeteer. Install hyperframes skills for better capability.

Run
```bash
npx skills add heygen-com/hyperframes --full-depth
```

### C. Audio Extraction & Processing

1. **Extraction**:
   - **Browser Context**: Fetches the target media URL as an `ArrayBuffer` and decodes the audio source using `AudioContext.decodeAudioData()`.
   - **Headless / Node.js**: Acquires the source from `inputStore` (managed by `mediabunny`), retrieves the primary audio track, and loops the frames through `AudioSampleSink` to extract raw mono/stereo Float32 planes.

2. **Processing Nodes**:
   - Dispatches audio buffers to dedicated processors (fade-in/out, noise gates, compressor/limiter filters, parametric EQ, stereo panning, reverb, and delay) to finalize soundtrack output.