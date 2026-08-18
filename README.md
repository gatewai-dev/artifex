<div align="center">

# Gatewai Artifex & Node SDK

### The Headless WebGPU Media Director & Compositing Engine for Autonomous AI Agents

<p align="center">
  <a href="https://www.npmjs.com/package/@gatewai.studio/artifex"><img src="https://img.shields.io/npm/v/@gatewai.studio/artifex?color=blue&label=npm%20artifex" alt="npm version" /></a>
  <a href="https://github.com/gatewai-dev/Gatewai/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-green.svg" alt="License" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.w3.org/TR/webgpu/"><img src="https://img.shields.io/badge/WebGPU-Hardware%20Accelerated-orange" alt="WebGPU" /></a>
  <a href="https://gatewai.studio"><img src="https://img.shields.io/badge/Platform-gatewai.studio-black" alt="Gatewai Studio" /></a>
</p>

<p align="center">
  <b>Give autonomous AI coding agents the precision of Photoshop, After Effects, and Premiere in a deterministic, headless CLI runtime.</b>
</p>

[**🚀 Quick Start**](#-getting-started) •
[**🎬 Production Showcase**](#-production-showcase--blueprints) •
[**🧩 58+ Node Ecosystem**](#-58-built-in-nodes--custom-sdk) •
[**📖 Technical Documentation**](./apps/gatewai-artifex/README.md) •
[**🌐 Studio Platform**](https://gatewai.studio)

---

</div>

## 🌟 Why Artifex?

Autonomous AI coding agents (Antigravity, Claude Code, Cursor, Windsurf, Roo Code, etc.) can write code and call APIs, but creating broadcast-grade commercial video, social ads, and editorial print designs has traditionally required human designers driving complex desktop UIs.

**Artifex changes that.** It provides a machine-first execution engine where AI agents direct, composite, color-grade, animate, and mix multi-track media using deterministic JSON graph specifications.

<table>
  <tr>
    <td width="50%">
      <h3>🤖 Agent-Native Execution</h3>
      <p>Agents author portable JSON workflow specs, validate schemas instantly, inspect intermediate artifacts, and execute graphs headlessly without touching a GUI.</p>
    </td>
    <td width="50%">
      <h3>⚡ Hardware-Accelerated WebGPU</h3>
      <p>Native WGSL shaders and GPU render pipelines deliver real-time compositing, 4-color CMYK lithography screening, sub-pixel matting, and optical filters.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎨 Photoshop-Grade Precision</h3>
      <p>58+ modular nodes: monotonic Hermite <code>Curves</code>, <code>SelectiveColor</code>, multi-angle <code>LayerStyle</code> (stroke, drop shadow, bevel), <code>KenBurns</code> camera glides, and 35mm <code>FilmGrain</code>.</p>
    </td>
    <td width="50%">
      <h3>🔒 Deterministic & Resumable</h3>
      <p>Coded exit codes, schema validation, and state checkpointing (<code>--from-state</code>) ensure agents never waste expensive LLM or image/video generation API credits.</p>
    </td>
  </tr>
</table>

---

## 🚀 Getting Started

Equip your AI agent workspace with Artifex skills in seconds, or run the CLI directly.

### 1. Install Artifex Skills (Recommended for AI Agents)

Equip autonomous AI coding agents with node specifications, handle types, edge connection rules, and composition guidelines:

```bash
npx skills add gatewai-dev/artifex-skills --full-depth
```

*This installs the complete catalog of 58+ node skills directly into your agent's context window.*

### 2. Run or Install Artifex CLI

Execute workflows on-demand via `npx` / `pnpm dlx` or install globally:

```bash
# Run on-demand via npx
npx @gatewai.studio/artifex --help

# Or install globally
npm install -g @gatewai.studio/artifex
# (or: pnpm add -g @gatewai.studio/artifex)
```

### 3. Configure API Credentials

Set your provider API keys in environment variables or a `.env` file:

```bash
# Generative AI providers (FAL AI: Image / Video / Speech synthesis)
GATEWAI_FAL_API_KEY=your_fal_api_key

# LLM Providers (OpenRouter: Scriptwriting & Copywriting)
GATEWAI_OPENROUTER_API_KEY=your_openrouter_api_key

# Optional: Local asset storage & render concurrency
GATEWAI_STORAGE_DIR=./gw-assets
GATEWAI_CONCURRENT_RENDERS=2
```

---

## 🎬 Production Showcase & Blueprints

Explore executable, production-grade workflow blueprints authored for and executed by autonomous AI agents:

<div align="center">

| Output Preview | Blueprint & Deliverable | Key Nodes & Pipeline |
| :---: | :--- | :--- |
| <a href="https://youtu.be/9GPEeM90blk"><img src="https://img.youtube.com/vi/9GPEeM90blk/hqdefault.jpg" width="300" alt="Luxury Real Estate Video Ad Preview" /><br/><b>▶️ Watch on YouTube (1080p MP4)</b></a> | [**01: Luxury Real Estate Video Ad**](./apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad)<br/>`16:9 Video (MP4)`<br/><br/>Architectural listing tour with AI voiceover narration, chill lounge soundtrack, synchronized Whisper captions, and luxury Cinzel typography. | `ImageGen`, `Curves`, `SelectiveColor`, `KenBurns`, `UnsharpMask`, `FilmGrain`, `TextToSpeech`, `AudioGenerator`, `CaptionGenerator`, `Compositor` |
| <a href="./apps/gatewai-artifex/examples/02-ecommerce-product-card"><img src="./apps/gatewai-artifex/examples/02-ecommerce-product-card/output.png" width="280" alt="E-Commerce Product Card Preview" /></a> | [**02: High-Converting E-Commerce Card**](./apps/gatewai-artifex/examples/02-ecommerce-product-card)<br/>`1:1 Image (PNG)`<br/><br/>Studio-retouched sneaker ad with AI alpha isolation, vector shape plate, neon glow/bevel, pop-art halftone screening, and Space Grotesk typography. | `ImageGen`, `RemoveBackground`, `RefineEdge`, `ShapeGenerator`, `LayerStyle`, `HalftoneScreen`, `SelectiveColor`, `Compositor` |
| <a href="https://youtube.com/shorts/lzvBc_6_tuQ"><img src="https://img.youtube.com/vi/lzvBc_6_tuQ/hqdefault.jpg" width="220" alt="Faceless History Cash-Cow Short Preview" /><br/><b>▶️ Watch YouTube Short (9:16 MP4)</b></a> | [**03: Faceless History Cash-Cow Short**](./apps/gatewai-artifex/examples/03-faceless-cash-cow-short)<br/>`9:16 Video (MP4)`<br/><br/>5-Scene vertical short with Gemini scriptwriting, 5 sequential oil paintings, golden split-toning, 5 KenBurns trajectories, Charon voiceover, and Whisper captions. | `LLM`, `ImageGen`, `ColorBalance`, `KenBurns`, `Vignette`, `FilmGrain`, `TextToSpeech`, `CaptionGenerator`, `Compositor` |
| <a href="https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e"><img src="https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e" width="220" alt="Vintage Print Editorial Poster Preview" /><br/><b>▶️ Watch Motion Poster (3:4 MP4)</b></a> | [**04: Vintage Print Editorial Poster**](./apps/gatewai-artifex/examples/04-vintage-print-editorial-poster)<br/>`3:4 Video (MP4)`<br/><br/>4-Color CMYK offset lithography screening (15°/75°/0°/45° rosette angles), isolated kimono wave oscillation, and Swiss modernist typography. | `ImageGen`, `ExtractObject`, `ProceduralSignal`, `Modulate`, `HalftoneScreen`, `SelectiveColor`, `Levels`, `CanvasGenerator`, `Compositor` |
| <a href="https://youtube.com/shorts/vYRM4sDqc-4"><img src="https://img.youtube.com/vi/vYRM4sDqc-4/hqdefault.jpg" width="240" alt="AI Podcast Audiogram Visualizer Preview" /><br/><b>▶️ Watch YouTube Short (1:1 MP4)</b></a> | [**05: AI Podcast Audiogram Visualizer**](./apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer)<br/>`1:1 Video (MP4)`<br/><br/>64-second Ivory theme audiogram featuring Seedance 2.5 talking avatar host, 7 KenBurns diagram scenes, audio slicing, and synchronized subtitles. | `TextToSpeech`, `MediaCut`, `ImageGen`, `VideoGen`, `CaptionGenerator`, `ShadowsHighlights`, `Curves`, `KenBurns`, `Compositor` |
| <a href="./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook"><img src="./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/output.png" width="240" alt="Cross-Spec Lookbook Preview" /></a> | [**06: Cross-Spec Streetwear Lookbook**](./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook)<br/>`3:4 Image (PNG)`<br/><br/>Multi-spec pipeline re-using Example 02's rendered sneaker output as a visual reference to generate an editorial fashion lookbook photoshoot. | `Import`, `ImageGen`, `SelectiveColor`, `FilmGrain`, `Export` |

</div>

---

### Featured Showcase Breakdown

<details>
<summary><b>🔍 View Detailed Showcase Descriptions & Commands</b></summary>

#### Example 01: Luxury Real Estate Video Commercial (16:9 1080p MP4)
An automated luxury architectural listing commercial video pipeline that turns property prompts into broadcast-ready, motion-stabilized, color-graded listing videos with AI narration, background soundtrack, synchronized captions, and luxury typography.
- **Deliverable:** 16:9 Landscape Video (1080p MP4)
- **Watch:** [YouTube Demo Video](https://youtu.be/9GPEeM90blk)
```bash
artifex validate apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad/spec.json
artifex run apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad/spec.json
```

#### Example 02: High-Converting E-Commerce Product Card (1:1 PNG)
An automated DTC promotional ad banner featuring OpenAI sneaker synthesis, AI alpha cutout extraction, sub-pixel edge defringing, parametric vector hexagon shape plate with neon glow/bevel, pop-art halftone screening, and Space Grotesk / Montserrat typography.
- **Deliverable:** 1:1 Square Image (1080x1080 PNG)

<p align="center">
  <img src="./apps/gatewai-artifex/examples/02-ecommerce-product-card/output.png" width="460" alt="High-Converting E-Commerce Product Card" />
</p>

```bash
artifex validate apps/gatewai-artifex/examples/02-ecommerce-product-card/spec.json
artifex run apps/gatewai-artifex/examples/02-ecommerce-product-card/spec.json
```

#### Example 03: Faceless History Cash-Cow Short (9:16 MP4)
An automated high-retention YouTube Shorts and TikTok video generator pipeline with Gemini scriptwriting, 5 consecutive oil paintings, golden-age split-toning, 5 custom KenBurns camera trajectories, 35mm grain, Charon narration, and Whisper captions.
- **Deliverable:** 9:16 Vertical Video (1080x1920 MP4)
- **Watch:** [YouTube Shorts Demo](https://youtube.com/shorts/lzvBc_6_tuQ)
```bash
artifex validate apps/gatewai-artifex/examples/03-faceless-cash-cow-short/spec.json
artifex run apps/gatewai-artifex/examples/03-faceless-cash-cow-short/spec.json
```

#### Example 04: Vintage Print Editorial Motion Poster (3:4 MP4 @ 24fps)
An automated Print-on-Demand and motion graphics pipeline with 4-color CMYK offset lithography screening, isolated object displacement wave motion, Swiss modernist typography, and archival paper absorption response curves.
- **Deliverable:** 3:4 Editorial Motion Poster (1080x1440 MP4 @ 24fps)
- **Watch:** [Motion Poster Preview Video](https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e)
```bash
artifex validate apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/spec.json
artifex run apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/spec.json
```

#### Example 05: AI Podcast Audiogram Visualizer (1:1 MP4)
A 64-second multi-modal podcast repurposing pipeline in a refined Ivory Light Theme featuring a Seedance 2.5 talking female avatar host, 7 middle KenBurns AI infographic scenes, warm tonal dynamic range calibration, speaker badges, and synchronized subtitles.
- **Deliverable:** 1:1 Social Audiogram Video (1080x1080 MP4)
- **Watch:** [YouTube Shorts Demo](https://youtube.com/shorts/vYRM4sDqc-4)
```bash
artifex validate apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/spec.json
artifex run apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/spec.json
```

#### Example 06: Cross-Spec Streetwear Lookbook Editorial (3:4 PNG)
An automated fashion lookbook photoshoot pipeline demonstrating **cross-spec asset re-use**: importing the rendered promotional creative output from Example 02 as a reference image to condition an AI image generator to synthesize a fashion photoshoot.
- **Deliverable:** 3:4 Editorial Image (1K PNG)

<p align="center">
  <img src="./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/output.png" width="420" alt="Cross-Spec Streetwear Lookbook Editorial" />
</p>

```bash
artifex validate apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/spec.json
artifex run apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/spec.json
```

</details>

---

## 🛠 Autonomous Agent Production Loop

Artifex gives autonomous AI agents a reliable, deterministic media production lifecycle:

```text
┌────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. Spec Author │ ──► │ 2. Dry-Run & Lint│ ──► │ 3. GPU Execute  │ ──► │ 4. Output Media │
│  (Agent JSON)  │     │ (artifex validate│     │ (artifex run)   │     │  (MP4 / PNG)    │
└────────────────┘     └──────────────────┘     └─────────────────┘     └─────────────────┘
                               ▲                         │
                               └──── Checkpoint & State ─┘
                                   (--from-state resume)
```

1. **Portable Graph Spec**: Agents declare media inputs, generative prompts, color adjustments, audio tracks, and layout constraints in a portable JSON schema.
2. **Deterministic Validation**: Coded exits (`0`: OK, `2`: Input/Schema, `3`: Graph/Cycle, `4`: Render, `5`: Provider Key, `7`: Fatal) give agents actionable machine error feedback without guessing.
3. **Resumable State Checkpoints**: Pass `--state checkpoint.json` to persist intermediate artifacts. Resume downstream steps with `--from-state checkpoint.json` without re-running expensive generative models.
4. **Selective Node Execution**: Target specific nodes (`--node <id>`) or mark upstream nodes as `"locked": true` to skip redundant computation.

> 📖 **Deep Technical Reference:** For comprehensive Zod schema models, JSON spec examples, CLI arguments, and error code tables, visit [**Artifex Technical Documentation (`apps/gatewai-artifex/README.md`)**](./apps/gatewai-artifex/README.md).

---

## 🧩 58+ Built-in Nodes & Custom SDK

Artifex includes a comprehensive suite of hardware-accelerated nodes and generative primitives:

| Category | Highlights & Nodes Included |
| :--- | :--- |
| 🎨 **Visual Color & Tone** | `Curves` (monotonic Hermite splines), `Levels`, `SelectiveColor` (CMYK grading), `ColorBalance`, `ColorKey`, `GradientMap`, `HalftoneScreen`, `FilmGrain`, `UnsharpMask`, `Vignette`, `Modulate`, `ShadowsHighlights`, `ApplyLUT`, `ExtractLUT`. |
| 📐 **Geometry & Camera** | `KenBurns` (smooth spline trajectory & zoom), `Crop`, `Flip`, `CornerPin`, `ResizerScaler`, `DisplacementMap`, `MeshWarp`, `TileOffset`, `Liquify`. |
| ✨ **Generators & Signals** | `CanvasGenerator`, `ShapeGenerator`, `ProceduralVFX`, `NoiseGenerator`, `Signal`, `Text`, `TextMerger`, `HTMLVideoGen`, `HTMLVideoRender`. |
| 🔊 **Audio DSP & Voice** | `TextToSpeech` (Gemini, Charon, Kore), `CaptionGenerator` (Whisper SRT/VTT), `CaptionEditor`, `AudioCompressor`, `AudioDelay`, `AudioFade`, `AudioNoiseGate`, `AudioParametricEQ`, `AudioReverb`, `ChannelMerger`, `ChannelSplitter`, `StereoPanning`, `VideoToAudio`. |
| 🤖 **AI & Generative Primitives** | `ImageGen` (OpenAI, FLUX, Seedream), `VideoGen` (Seedance, Kling), `LLM` (Gemini, Claude, GPT), `RemoveBackground` (Bria AI), `RefineEdge` (defringing), `ExtractObject`, `PatchHeal`, `LipSync`, `Upscaler`, `ObjectDetector`. |
| 🎬 **Compositing & IO** | `Compositor` (flex/grid auto-layout, multi-track audio, typography), `Import` (local file metadata reading & cross-spec re-use), `Export` (deterministic disk writing), `MediaCut`, `ExtractFrame`, `LayerStyle` (drop shadow, bevel, stroke). |

### Querying Nodes with CLI
```bash
# Query complete machine-readable catalog
artifex nodes --json

# Print node skill instructions
artifex skill Compositor
artifex skill ImageGen
```

### Authoring Custom Nodes
Scaffold a new custom WebGPU node package in seconds:
```bash
artifex init-node node-my-filter --type MyFilter --category Media
```

---

## 📦 Monorepo Architecture

```
Gatewai/
├── apps/
│   └── gatewai-artifex/       # Headless CLI & Execution Engine
├── packages/
│   ├── core/                  # Core domain types & operation graph
│   ├── node-sdk/              # Node authoring SDK & processor contracts
│   ├── webgpu-renderers/      # WGSL shader pipelines & WebGPU renderers
│   └── artifex-skills/        # Agent skills & markdown instruction library
├── nodes/                     # 58 standalone node packages (e.g. node-compositor, node-curves)
└── scripts/                   # Synchronization & validation tooling
```

---

## 💻 Development & Building

```bash
# Install dependencies
pnpm install

# Build all packages & nodes
pnpm build

# Run unit tests
pnpm test
```

---

## 📄 License

Distributed under the **AGPL-3.0** License.

Presented by [**Gatewai Studio**](https://gatewai.studio) — *The Autonomous Media Platform for AI Agents.*
