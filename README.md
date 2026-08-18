# Gatewai Plugins & Node SDK

Official open-source monorepo for the **Gatewai Node SDK**, **WebGPU Renderers**, **Core Types**, and **Reference Node Packages**.

This repository enables developers and AI agents to build, test, and package custom nodes that integrate seamlessly with [Gatewai](https://gatewai.studio) and the [Artifex CLI](https://www.npmjs.com/package/@gatewai.studio/artifex).

---

## 🎬 Production Workflow Examples & Output Showcase

Artifex enables autonomous AI agents and developers to build broadcast-quality, multi-modal commercial media pipelines. Below are 6 validated, production-grade blueprints demonstrating end-to-end media synthesis, Photoshop-grade grading, camera motion, and multi-track compositing.

---

### 📁 Showcase Workflows Overview

| Example | Format | Deliverable | Key Photoshop & AI Nodes |
|---|---|---|---|
| [**01: Luxury Real Estate Video Ad**](./apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad) | 16:9 Video (MP4) | Architectural listing tour video with voiceover narration, lounge soundtrack, and captions. | `ImageGen` (OpenAI Medium), `Curves`, `SelectiveColor`, `KenBurns`, `UnsharpMask`, `FilmGrain`, `TextToSpeech`, `AudioGenerator`, `CaptionGenerator`, `Compositor` |
| [**02: E-Commerce Product Ad Card**](./apps/gatewai-artifex/examples/02-ecommerce-product-card) | 1:1 Image (PNG) | Studio-retouched, alpha-isolated promotional ad creative with Photoshop layer styles. | `ImageGen` (OpenAI Medium), `RemoveBackground`, `RefineEdge`, `ShapeGenerator`, `LayerStyle` (Stroke, Shadow, Bevel), `HalftoneScreen`, `SelectiveColor`, `Compositor` |
| [**03: Faceless History Cash-Cow Short**](./apps/gatewai-artifex/examples/03-faceless-cash-cow-short) | 9:16 Video (MP4) | 5-Scene vertical short with Gemini scriptwriting, 5 KenBurns trajectories, Charon voiceover, and Whisper captions. | `LLM`, `ImageGen` (OpenAI Medium × 5), `ColorBalance`, `KenBurns` (× 5), `Vignette`, `FilmGrain`, `TextToSpeech`, `CaptionGenerator`, `Compositor` |
| [**04: Vintage Print Editorial Poster**](./apps/gatewai-artifex/examples/04-vintage-print-editorial-poster) | 3:4 Video (MP4) | 4-Color CMYK offset lithography simulation with isolated kimono color oscillation and Swiss typography. | `ImageGen` (Seedream 5.0), `ExtractObject`, `ProceduralSignal`, `Modulate`, `HalftoneScreen`, `SelectiveColor`, `Levels`, `CanvasGenerator`, `Compositor` |
| [**05: AI Podcast Audiogram Visualizer**](./apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer) | 1:1 Video (MP4) | 64-second Ivory theme audiogram featuring Seedance 2.5 talking avatar host and 7 KenBurns diagram scenes. | `TextToSpeech`, `MediaCut`, `ImageGen` (Seedream 5.0), `VideoGen` (Seedance 2.5), `CaptionGenerator`, `ShadowsHighlights`, `Curves`, `KenBurns` (× 7), `UnsharpMask`, `Compositor` |
| [**06: Cross-Spec Product Lookbook**](./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook) | 3:4 Image (PNG) | Multi-spec pipeline re-using Example 02's rendered product output as an image conditioning reference for a fashion lookbook photoshoot. | `Import` (Cross-Spec Asset Re-use), `ImageGen` (Nano Banana 2 / Imagen 3 Edit), `SelectiveColor`, `FilmGrain`, `Export` |

---

### Example 01: Luxury Real Estate Commercial Video Ad

An automated luxury architectural listing commercial video pipeline that turns property prompts into broadcast-ready, motion-stabilized, color-graded listing videos with AI narration, background soundtrack, synchronized captions, and luxury typography.

<video src="./apps/gatewai-arti

fex/examples/01-luxury-real-estate-video-ad/output.mp4" controls width="100%"></video>

* **Format:** 16:9 Landscape Video (1080p MP4)
* **Key Nodes:**
  * `ImageGen` (OpenAI GPT Image 2, Medium Quality): Architectural villa synthesis.
  * `Curves`: RGB S-curve contrast boost with subtle warm red highlight lifting and cool blue shadow compression.
  * `SelectiveColor`: CMYK selective grading for foliage greens and deep sky cyans.
  * `KenBurns`: Smooth cinematic camera glide with cubic spline easing.
  * `UnsharpMask` & `FilmGrain`: Gaussian high-frequency unsharp masking (`amount: 110%`, `radius: 1.2px`) paired with organic 35mm film grain.
  * `TextToSpeech` & `AudioGenerator`: Gemini Zephyr voiceover narration multiplexed with an ambient chill lounge soundtrack.
  * `CaptionGenerator` & `Compositor`: Whisper SRT subtitle generation, price badges, and Cinzel luxury typography.

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/01-luxury-real-estate-video-ad/spec.json
```

---

### Example 02: High-Converting E-Commerce Product Ad Card

An automated e-commerce ad creative and social commerce design pipeline that turns product prompts into studio-retouched, alpha-isolated promotional ad banners with parametric vector shapes, Photoshop-grade layer effects, halftone styling, and dynamic typography.

![High-Converting E-Commerce Product Card](./apps/gatewai-artifex/examples/02-ecommerce-product-card/output.png)

* **Format:** 1:1 Square Image (1080x1080 PNG)
* **Key Nodes:**
  * `ImageGen` (OpenAI GPT Image 2, Medium Quality): Studio sneaker photography.
  * `RemoveBackground` (Bria AI) + `RefineEdge`: Sub-pixel edge smoothing and color spill decontamination (`decontaminateAmount: 0.85`).
  * `SelectiveColor`: CMYK tuning for rich product color accents.
  * `ShapeGenerator` & `LayerStyle`: Parametric hexagonal vector plate with neon glow and 3D bevel.
  * `LayerStyle` (Product FX): 4px crisp white outer stroke, multi-angle drop shadow (`distance: 25px`, `size: 35px`), and specular inner bevel.
  * `HalftoneScreen`: Pop-art halftone dot rasterization (`frequency: 24`, `angle: 45°`) on gradient backdrop.
  * `Compositor`: Discount badges ("LIMITED EDITION | 50% OFF"), feature tags, and Space Grotesk / Montserrat layout.

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/02-ecommerce-product-card/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/02-ecommerce-product-card/spec.json
```

---

### Example 03: Faceless History Cash-Cow Short

An automated high-retention YouTube Shorts and TikTok "cash-cow" video generator pipeline that writes dramatic, humorous historical storytelling hooks, synthesizes 5 consecutive oil paintings with 9:16 vertical framing, applies cinematic split-toning and lens vignetting, animates 5 synchronized Ken Burns camera motion trajectories, and syncs word-level subtitles with narrator voiceover.

<video src="https://github.com/gatewai-dev/artifex/main/apps/gatewai-artifex/examples/03-faceless-cash-cow-short/output.mp4" controls width="100%"></video>

* **Format:** 9:16 Vertical Video (1080x1920 MP4)
* **Key Nodes:**
  * `LLM` (Google Gemini 3.7 Flash): Scriptwriting humorous historical storytelling hooks (The 1932 Great Emu War).
  * `ImageGen` (OpenAI GPT Image 2 × 5): 5 distinct Rembrandt-style oil painting scenes.
  * `ColorBalance` (× 5): Golden-age split-toning (warm highlights, cool shadows).
  * `KenBurns` (× 5): 5 bespoke camera trajectories (map zooms, tactical tracking pans, elevation tilts) with motion blur.
  * `Vignette` & `FilmGrain` (× 5): Vintage newsreel edge darkening and 35mm film grain.
  * `TextToSpeech` (Gemini Charon) + `CaptionGenerator` (Whisper): Deep voiceover narration with synchronized subtitles.
  * `Compositor`: Multi-scene timeline sequencing, channel pill badge ("🏛️ WEIRD HISTORY"), and heavy stroke subtitles.

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/03-faceless-cash-cow-short/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/03-faceless-cash-cow-short/spec.json
```

---

### Example 04: Vintage Print Editorial Motion Poster

An automated Print-on-Demand (POD), digital gallery, and motion graphics pipeline that transforms AI prompts into physical-fidelity CMYK offset print editorial motion posters (5.0s @ 24fps) with isolated object displacement wave motion, Swiss typography layout, archival cotton paper emulation, and limited edition numbering.



https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e


* **Format:** 3:4 Editorial Motion Poster (1080x1440 MP4 @ 24fps)
* **Key Nodes:**
  * `ImageGen` (ByteDance Seedream 5.0 Pro): High-contrast cyberpunk editorial visual art.
  * `ExtractObject` (Bria AI): Alpha mask isolation of the red velvet kimono fabric while preserving gold embroidery and headwear.
  * `ProceduralSignal` (Sine Wave Signal) + `Modulate`: Continuous 1.0 Hz GPU-driven hue oscillation on the isolated fabric.
  * `SelectiveColor`: CMYK ink calibration for tactile screen-printing depth.
  * `Levels`: Dynamic range compression (`inBlack: 0.04`, `outBlack: 0.03`, `inWhite: 0.96`) simulating matte ink absorption on heavy archival cotton rag paper.
  * `CanvasGenerator` & `Compositor`: Archival paper base (`#f5f0eb`), Swiss modernist typography ("NEO TOKYO // 2088"), and edition numbering ("LIMITED EDITION: 042 / 100").

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/spec.json
```

---

### Example 05: AI Podcast Audiogram Visualizer (64s Episode)

A 64-second multi-modal podcast repurposing pipeline in a refined **Ivory Light Theme** featuring a **Seedance 2.5 Talking Female Host** (Dr. Elena Vance; 4s intro at `0–4s` and 4s outro at `60.2–64.2s` synthesized via **ByteDance Seedream 5.0** and driven by sliced Gemini `Kore` voiceover soundbites), 7 middle **KenBurns AI Infographic & Architecture scenes** (`4–60.2s`), warm tonal dynamic range calibration, speaker metadata badges, and synchronized subtitles.

<video src="./apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/output.mp4" controls width="100%"></video>

* **Format:** 1:1 Social Audiogram Video (1080x1080 MP4)
* **Key Nodes:**
  * `TextToSpeech` (Gemini Kore) + `MediaCut`: Full speech generation with precise audio slices for intro and outro.
  * `ImageGen` (ByteDance Seedream 5.0): Photorealistic character reference portrait and 7 Ivory technical diagrams.
  * `VideoGen` (Seedance 2.5): Reference-to-video lip-synced talking host segments.
  * `KenBurns` (× 7): Dynamic camera pans and drift moves across technical infographics.
  * `Curves`, `Levels`, `ShadowsHighlights`, `SelectiveColor`: Soft ivory tone curve calibration and dynamic range balancing.
  * `UnsharpMask`: High-frequency edge definition (radius 1.2px, amount 105–110%).
  * `CaptionGenerator` & `Compositor`: Ivory backdrop (`#fbfaf7`), glassmorphic header cards, speaker badges, and synchronized subtitles.

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/05-podcast-audiogram-visualizer/spec.json
```

---

### Example 06: Cross-Spec Streetwear Lookbook Editorial

An automated fashion lookbook photoshoot pipeline demonstrating **cross-spec asset re-use**: importing the rendered promotional creative output from **Example 02** (`../02-ecommerce-product-card/output.png`) as a reference image to condition an AI image generator to synthesize a fashion photoshoot with a young athletic model wearing the exact sneakers from the ad.

![Cross-Spec Streetwear Lookbook Editorial](./apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/output.png)

* **Format:** 3:4 Editorial Image (1K PNG)
* **Key Nodes:**
  * `Import`: Cross-spec asset connection re-using rendered outputs across separate pipelines without hardcoded IDs.
  * `ImageGen` (`fal-ai/nano-banana-2`, edit mode): Reference image conditioning to transfer footwear style onto the model.
  * `SelectiveColor`: Streetwear tonal polish and urban shadow grading.
  * `FilmGrain`: 35mm physical film grain texturing (`strength: 12`, `size: 1.2`, `monochrome: true`).
  * `Export`: Deterministic output saving.

```bash
# Validate and inspect
npx @gatewai.studio/artifex validate apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/spec.json
npx @gatewai.studio/artifex build apps/gatewai-artifex/examples/06-cross-spec-product-lookbook/spec.json
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

### Reference Nodes (`nodes/`)
- **`@gatewai.studio/node-blur`**: Gaussian, directional, and box blur visual filters.
- **`@gatewai.studio/node-crop`**: Rectangle, polygon, and ellipse media cropping.
- **`@gatewai.studio/node-levels`**: Tonal range, histogram, and color balance adjustments.
- **`@gatewai.studio/node-vignette`**: Radial luminance falloff and vignette shader.
- **`@gatewai.studio/node-flip`**: Horizontal, vertical, and symmetry reflection transforms.
- **`@gatewai.studio/node-text`**: Text generation and typography input node.
- **`@gatewai.studio/node-number`**: Dynamic numeric signal input and modulation.
- **`@gatewai.studio/node-signal`**: Procedural WGSL shader signals.
- **`@gatewai.studio/node-kenburns`**: Hardware-accelerated camera pan, zoom, and translation trajectories.
- **`@gatewai.studio/node-apply-lut`**: 3D Color Lookup Table (.cube LUT) application.

---

## Quickstart: Creating a Custom Node

### 1. Scaffold with Artifex CLI
```bash
npx @gatewai.studio/artifex init-node node-my-filter --type MyFilter --category Media
```

### 2. Node Architecture
A Gatewai node consists of:
1. **`src/metadata.ts`**: Defines the node type, display name, handle inputs/outputs, and Zod configuration schema.
2. **`src/server/processor.ts`**: Implements `NodeProcessor` to transform media data in the headless execution pipeline.
3. **`src/renderers/webgpu-renderer.ts`**: (Optional) Implements `WebGPUNodeRenderer` for GPU hardware acceleration.
4. **`SKILL.md`**: Machine-readable markdown instructions for autonomous AI agents.

### 3. Run Locally with Artifex
Add your custom node directory to the `plugins` field of your workflow `spec.json`:
```json
{
  "name": "Custom Workflow",
  "plugins": ["./node-my-filter"],
  "nodes": [
    { "id": "input_1", "type": "Import", "config": { "file": "./input.png" } },
    { "id": "filter_1", "type": "MyFilter", "config": { "strength": 2 } },
    { "id": "export_1", "type": "Export", "config": { "file": "./output.png" } }
  ],
  "edges": [
    { "source": "input_1", "target": "filter_1" },
    { "source": "filter_1", "target": "export_1" }
  ]
}
```

Run and render:
```bash
npx @gatewai.studio/artifex run spec.json
```

---

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License
AGPL-3.0
