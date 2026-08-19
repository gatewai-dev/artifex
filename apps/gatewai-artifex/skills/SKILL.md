---
name: artifex
description: Install, configure, and execute the Gatewai Artifex - GPU harness, headless workflow engine and offline media renderer.
metadata:
  triggers: "install artifex, run workflow offline, gatewai-artifex, @gatewai.studio/artifex, artifex cli, render spec, run headless"
  library: "@gatewai.studio/artifex"
  repository: "https://github.com/gatewai-dev/artifex-skills"
  version: "1.1.13"
  schema: "https://schemas.agentskills.io/v1/skill.json"
---

# Artifex: Headless Workflow Engine & Media Renderer

Artifex (`@gatewai.studio/artifex`) is a machine-first CLI designed for autonomous AI agents to compose, validate, run, and render Gatewai workflow canvases locally and offline. It uses GPU capabilities and has more than 60 nodes including AI tools.

---

## 1. Installation & Execution

To run Artifex use `npx` or `pnpm dlx`:
```bash
# Run on-demand via npx
npx -y @gatewai.studio/artifex --help

# Run on-demand via pnpm dlx
pnpm dlx -y @gatewai.studio/artifex --help
```

---

## 2. Credentials & Setup

Provider keys and runtime configurations can be set as environment variables, defined in a `.env` file in the current working directory where the CLI is executed, or placed in the home directory config (`~/.config/gatewai/credentials.json`):

- **`GATEWAI_FAL_API_KEY`**: Required for media generation (e.g. `ImageGen`, `VideoGen`, `TextToSpeech`, `MusicGenerator`).
- **`GATEWAI_OPENROUTER_API_KEY`**: Required for LLM, Lottie Generator Agent nodes.
- **`GATEWAI_STORAGE_DIR`**: Optional. The directory path for local asset storage. Defaults to `./gw-assets` in the directory where the CLI is called, unless specified via a `.env` file or environment variable. It contains output files from AI generations.
- **`GATEWAI_CONCURRENT_RENDERS`**: Optional. The maximum number of render operations (e.g. composition, still image, LUT, HTML, Video renders) allowed to run concurrently. Defaults to `2`. Render operations are queued.

### Credentials File
`~/.config/gatewai/credentials.json`
```json
{
  "GATEWAI_FAL_API_KEY": "your-fal-key",
  "GATEWAI_OPENROUTER_API_KEY": "your-openrouter-key"
}
```

### Local `.env` File
```env
GATEWAI_FAL_API_KEY=your-fal-key
GATEWAI_OPENROUTER_API_KEY=your-openrouter-key
GATEWAI_STORAGE_DIR=./gw-assets
GATEWAI_CONCURRENT_RENDERS=2
```

---

## 3. Command Catalog

The CLI offers commands to discover capabilities, validate templates, execute nodes, and render target media output.

| Command | Arguments | Description | Options |
|---|---|---|---|
| `nodes` | *none* | Prints the registered nodes manifest details (types, config schema fields, input/output handles). | `--json`, `--plugin <path>` |
| `skill` | `<nodeType>` | Prints the markdown documentation/instructions (`SKILL.md`) for the specific node type. | `--json`, `--list`, `--plugin <path>` |
| `validate` | `<spec.json>` | Validates spec layout schema, node config Zod schemas, edge handle wiring. Aggregates and returns **ALL** errors at once. | `--json`, `--plugin <path>` |
| `build` | `<spec.json>` | Assembles the graph in-memory and prints the full topological graph tree (nodes, handles, data types, execution order). | `--json`, `--plugin <path>` |
| `run` | `<spec.json>` | Runs all necessary nodes in topological order, resolves output assets, and writes file exports to disk. Defaults to running all terminal nodes. | `--node <ids>`, `--json`, `--state <file>`, `--from-state <file>`, `--plugin <path>` |
| `init-node` | `<name>` | Scaffolds a complete custom node package ready for development. | `--dir <path>`, `--type <name>`, `--description <text>`, `--category <name>` |

### `validate` vs `build` Usage Insight
- **`artifex validate <spec.json>` (Assertion & Gatekeeper)**: Non-mutating validation check for pre-execution, CI/CD, and agent dry-runs. Aggregates and reports **ALL** validation errors at once (schema errors, node Zod config errors, edge handle mismatches). Exits with code `2` (`E_INPUT`) on error.
- **`artifex build <spec.json>` (Inspection & Graph Analyzer)**: Assembles the graph in memory and prints the complete topological execution tree (nodes, handles, data types, node IDs, variable inputs). Exits with code `3` (`E_GRAPH`) on topological failure.


---

## 4. Node Catalog & Respective Skills

To view the schema details, config parameters, and input/output handles of all supported nodes:
- Refer to the dedicated [Node Catalog](file:///packages/artifex-skills/references/node-catalog.md) which lists all registered nodes.
- Each node in the Node Catalog points to its respective detailed reference file (e.g. `references/<node-type>.md`).
- Alternatively, run `artifex nodes --json` to fetch the schemas dynamically or `artifex skill <node-type>` to read a specific node's skill instructions.

### Supported Nodes
<!-- NODE_LIST_START -->
- ApplyLUT: Apply a color lookup table (.cube) to media
- AudioFade: Applies a configurable gain envelope for audio and video.
- AudioGenerator: Generate high-quality audio or speech using AI.
- Blur: Apply blur to a media
- CanvasGenerator: Create blank canvases or custom gradients from scratch
- CaptionEditor: Create captions manually in SRT format
- CaptionGenerator: Generate captions for audio or video using AI
- ChannelMerger: Combines up to 4 grayscale image streams into a composite color image across RGBA, HSLA, CMYK, or LAB color models.
- ChannelSplitter: Splits an image or video stream into 4 distinct single-channel grayscale images across RGBA, HSLA, CMYK, or LAB color models.
- ColorBalance: Shifts color balance of Shadows, Midtones, and Highlights along Cyan-Red, Magenta-Green, and Yellow-Blue axes
- ColorKey: Key out a color (chroma key) with spill suppression
- Compositor: Compose media layers using renderable inputs.
- Compressor: Smooth out dynamic range and prevent audio clipping/distortion
- CornerPin: Four-point perspective warp
- Crop: Crop media using rectangle, path, or ellipse
- Curves: Map tonal range and color balance using monotonic spline curves
- Delay: Add repeating echo effect for audio and video
- DepthMap: Generate a depth map from an image using AI
- DisplacementMap: Distort media using a displacement map texture
- Export: An UI download / API output node
- ExtractFrame: Extract a single frame from a video, Lottie or GIF
- ExtractLUT: Extract a 3D LUT from two frames
- ExtractObject: Segment and extract an object from an image using a prompt
- FilmGrain: Apply organic, cinematic film grain texture to media
- Flip: Mirror, flip, transpose, or reflect visual media horizontally, vertically, diagonally, or in kaleidoscopic split symmetry
- GradientMap: Replaces luminance values with colors sampled along a custom multi-stop color gradient
- HalftoneScreen: Convert visual media into procedural halftone dot or CMYK raster screens with customizable angles and geometry
- HighPass: Extract high-frequency edge details and textures for frequency separation and sharpening
- ImageGen: Generate or edit an image using AI
- Import: Upload your files
- KenBurns: Create a video using Ken Burns effect
- LayerStyle: Applies procedural layer styles to an alpha-isolated layer or graphic. Calculates distance field vectors, inner/outer alpha convolutions, and light elevation models to generate standard Photoshop FX.
- Levels: Adjust tonal range and color balance with input/output levels
- LipSync: Turns any avatar image into a talking video
- Liquify: Apply localized push, pull, bloat, pucker, and twirl distortions with smooth radial falloff
- LLM: Prompt a large language model
- LottieGen: Generate or Edit After Effect animations using an AI Agent.
- MaskMath: Morphological (dilate, erode, choke, feather) and Boolean set operations (union, intersect, subtract, difference, invert) on alpha/matte masks
- MediaCut: Cut video, audio, lottie or gif by specifying start and end times.
- MeshWarp: Warp media using a grid of control points
- Modulate: Apply Modulate adjustments to an image
- NoiseGate: Silence background noise and hum below a certain volume threshold
- NoiseGenerator: Generate procedural Perlin, Simplex, and Voronoi noise.
- Note: A sticky note
- Number: Number input node
- Paint: Draw / Fill Mask on an media
- ParametricEq: Boost or cut specific frequency ranges using biquad IIR filters
- PatchHeal: Coordinate-offset clone stamping, texture transfer, and seamless gradient healing
- Preview: Preview the output of a connected node
- ProceduralSignal: Create procedural Signals.
- Recorder: Record your screen, camera and microphone
- RefineEdge: Matte defringing and edge decontamination. Strips background color bleeding halos, refines edge transparency, and smoothes sub-pixel details.
- RemoveBackground: Remove the background from an image using AI
- ResizerScaler: Adjust aspect ratios, scale resolution, crop, and pad image/video assets.
- Reverb: Add room ambience and space to audio
- SelectiveColor: Photoshop standard CMYK color grading across 9 targeted color ranges without edge artifacts.
- ShadowsHighlights: Dynamic range recovery with independent shadow lifting, highlight suppression, and tonal width control
- ShapeGenerator: Renders crisp, resolution-independent parametric shapes (rectangles with per-corner radii, ellipses, regular polygons, stars, arrows, custom SVG bezier paths) with solid/gradient fills, strokes, and dash patterns
- SmartCut: Cuts media to keep the parts where speech is detected.
- StereoPanning: Balance audio output between left and right channels
- SvgGen: Generate SVG vector graphics
- Text: Text (prompt) input node
- TextMerger: Merges connected texts.
- TextToSpeech: Create speech from text
- TileOffset: Shifts visual media coordinates horizontally and vertically with seamless modulo wrap-around, mirror, or edge clamping for pattern design
- UnsharpMask: Enhance edge contrast and texture sharpness with precision Gaussian unsharp masking
- Upscaler: Upscale and enhance image or video assets using AI.
- VideoEdit: Edit an existing video using AI.
- VideoGen: A video generation node.
- VideoGenFirstLastFrame: Generate videos using first and last frame images
- VideoToAudio: Converts a video input to an audio output.
- VideoToMusic: Analyzes your video’s to generate a frame-synced soundtrack in seconds
- Vignette: Apply a classic vignette effect with dark corners to visual media
- Webhook: Sends workflow outputs to an external URL as a JSON web request.
<!-- NODE_LIST_END -->

---

## 5. Spec.json Schema Guide

The JSON specification (`spec.json`) defines the canvas configuration, dynamic imports, nodes array, edges wiring, loaded fonts, and render settings. See [Node Catalog](file:///packages/artifex-skills/references/node-catalog.md) for configuring individual nodes.

## NOTE:
For a user request you don't have to use single canvas spec. You can use more than once while you review the output of previous ones.

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
- **Automation**: The CLI automatically reads the local file, extracts full metadata (width, height, FPS, duration, audio sample rates, channels, codec info) using `@gatewai.studio/media/server`, and injects the populated `Import` node result definition into the execution graph.

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
- Custom fonts are automatically registered for use and preloaded into the canvas GPU cache during execution.

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
        "layout": [
          {
            "id": "bg-layer",
            "kind": "media",
            "inputHandleId": "background_layer",
            "position": "absolute",
            "x": 0,
            "y": 0,
            "width": 1080,
            "height": 1080,
            "fit": "cover",
            "zIndex": 0
          },
          {
            "id": "fg-layer",
            "kind": "media",
            "inputHandleId": "foreground_layer",
            "position": "absolute",
            "x": 290,
            "y": 290,
            "width": 500,
            "height": 500,
            "fit": "cover",
            "zIndex": 1
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
   To avoid re-running expensive remote AI generation API calls (in case of runtime errors or small changes on workflow) always save state:
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
7. **Always Plan**:
Create a plan document and ask for clarification from the user before executing any workflow spec (e.g. duration / dimensions of video / art style). No ambiugity.
---

## 7. Human-in-the-Loop (HITL) Workflow

AI agents must design workflows around human check-ins to conserve tokens, save remote API costs, and guarantee aesthetic excellence:

### A. Incremental Draft Verification
- **Validate First**: Always run `artifex validate` and `artifex build` before executing any workflow spec.
- **Low-Cost Preview Rendering**: Before rendering an entire multi-scene video or executing multiple expensive remote AI generations, extract a single representative preview frame using `ExtractFrame` (rendering to a file like `./scratch-renders/preview.png`). Show the image to the human user for approval.
- **Save and Load State**: Cache outputs of expensive generator nodes (e.g. `ImageGen`, `TextToSpeech`, `VideoGen`) into a state file (`--state checkpoint.json`) after your runs. For subsequent edits to layout positions, sizing, typography, filter adjustments, or composition layers, load the cached outputs using `--from-state checkpoint.json` to enable instant local updates and set `"locked": true` for the terminal nodes that should not be re-run.
- **Lock Terminal Nodes**: To prevent a terminal node from executing, set `"locked": true` in the spec. Any terminal node that is not locked will be executed by default in full workflow runs.

### B. Interactive Error Handoff
- Do not attempt to bypass missing credentials in an infinite loop. If execution yields code `5` (`E_PROVIDER_NO_KEY`), immediately pause and ask the user to configure their environment or update `~/.config/gatewai/credentials.json`.

---

## 8. Frame Extraction Guide

Frame extraction in canvas specs should be handled structurally via the graph using the `ExtractFrame` (Frame Extractor) node, rather than passing frame numbers to the CLI. This is a useful tool for checking if result is in expected quality. For example before rendering a composition for full duration, you can extract 10 frames to check if it looks good. 

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

## 9. Local Rendering and Media Capabilities

Gatewai features a robust set of rendering and media processing capabilities designed to run locally, offline, and with GPU acceleration.

---

## 10. Workflow Recipes (Production-Grade Specs)

For complete, multi-node production blueprints demonstrating keyframes, signal processors, grading splines, and AI media generators:
* [Viral AI Social Short with Dynamic Layouts & Auto-Captions (12 Nodes)](file:///packages/artifex-skills/references/recipe-viral-social-short.md)
* [Cinematic Grade & Layout Finishing with Custom Curves and Levels (11 Nodes)](file:///packages/artifex-skills/references/recipe-cinematic-style-transfer.md)
* [Product Demo Video with Video-to-Music Scoring and Final Compositor Multiplexing (12 Nodes)](file:///packages/artifex-skills/references/recipe-product-demo.md)
* [Master Guide for Building Gatewai Nodes: Metadata, Server, WebGPU Visuals & Audio DSP](file:///packages/artifex-skills/references/recipe-build-node.md)

---

## 11. Custom Nodes & Plugins

Artifex supports loading custom nodes located directly on the local filesystem. This enables agents and developers to build bespoke visual, audio, or metadata transformation nodes and immediately use them in canvas workflow specifications. For full development guidance, see the [Master Guide for Building Gatewai Nodes](file:///packages/artifex-skills/references/recipe-build-node.md).

### A. Scaffolding a New Custom Node
To create a new custom node with boilerplate metadata, server processor, WebGPU renderer, audio processor, and `SKILL.md`:
```bash
artifex init-node node-my-filter --type MyFilter --category Media
```
This generates:
- `package.json` with `@gatewai.studio/core`, `@gatewai.studio/node-sdk`, `@gatewai.studio/webgpu-renderers` dependencies.
- `tsconfig.json` & `tsdown.config.ts`
- `src/metadata.ts`: defines `type`, `displayName`, `category`, `handles`, and typed `configSchema` with bindable `configHandles`.
- `src/server/processor.ts` & `src/server/index.ts`: defines backend execution logic implementing `NodeProcessor` with Inversify DI.
- `src/renderers/webgpu-renderer.ts`, `src/renderers/audio-processor.ts` & `src/renderers/index.ts`: defines WebGPU visual shader & compute-based audio DSP logic.
- `SKILL.md`: machine-readable instructions and parameter documentation for AI agents.

### B. Using Custom Nodes in Workflow Specs
Declare the local plugin path(s) inside the `"plugins"` array of your `spec.json`:
```json
{
  "name": "Custom Filter Pipeline",
  "plugins": [
    "./node-my-filter"
  ],
  "nodes": [
    {
      "id": "input_1",
      "type": "Import",
      "config": { "file": "./input.png" }
    },
    {
      "id": "filter_1",
      "type": "MyFilter",
      "config": { "strength": 2.5, "enabled": true }
    },
    {
      "id": "export_1",
      "type": "Export",
      "config": { "file": "./output.png" }
    }
  ],
  "edges": [
    { "source": "input_1", "target": "filter_1" },
    { "source": "filter_1", "target": "export_1" }
  ]
}
```

### C. CLI Plugin Flags
Alternatively, pass plugin paths via CLI flags:
```bash
artifex validate spec.json --plugin ./node-my-filter
artifex run spec.json --plugins ./node-my-filter,./node-another-filter
artifex skill MyFilter --plugin ./node-my-filter
```