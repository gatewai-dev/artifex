# Gatewai Artifex Showcase & Production Blueprints

A comprehensive collection of production-grade, validated workflow specifications demonstrating how developers and autonomous AI agents can generate broadcast-quality commercial media with **Artifex**.

---

## 📁 Showcase Workflows Overview

| Preview | Example | Format | Deliverable | Key Photoshop & AI Nodes |
|---|---|---|---|---|
| [▶️ Watch](https://youtu.be/9GPEeM90blk) | [**01: Luxury Real Estate Video Ad**](./01-luxury-real-estate-video-ad) | 16:9 Video (MP4) | Architectural listing tour video with voiceover narration, lounge soundtrack, and captions. | `ImageGen` (OpenAI Medium), `Curves`, `SelectiveColor`, `KenBurns`, `UnsharpMask`, `FilmGrain`, `TextToSpeech`, `AudioGenerator`, `CaptionGenerator`, `Compositor` |
| <a href="./02-ecommerce-product-card"><img src="./02-ecommerce-product-card/output.png" width="100" alt="E-Commerce Product Card Preview" /></a> | [**02: E-Commerce Product Ad Card**](./02-ecommerce-product-card) | 1:1 Image (PNG) | Studio-retouched, alpha-isolated promotional ad creative with Photoshop layer styles. | `ImageGen` (OpenAI Medium), `RemoveBackground`, `RefineEdge`, `ShapeGenerator`, `LayerStyle` (Stroke, Shadow, Bevel), `HalftoneScreen`, `SelectiveColor`, `Compositor` |
| [▶️ Watch](https://youtube.com/shorts/lzvBc_6_tuQ) | [**03: Faceless History Cash-Cow Short**](./03-faceless-cash-cow-short) | 9:16 Video (MP4) | 5-Scene vertical short with Gemini scriptwriting, 5 KenBurns trajectories, Charon voiceover, and Whisper captions. | `LLM`, `ImageGen` (OpenAI Medium × 5), `ColorBalance`, `KenBurns` (× 5), `Vignette`, `FilmGrain`, `TextToSpeech`, `CaptionGenerator`, `Compositor` |
| [▶️ Watch](https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e) | [**04: Vintage Print Editorial Poster**](./04-vintage-print-editorial-poster) | 3:4 Video (MP4) | 4-Color CMYK offset lithography simulation with isolated kimono color oscillation and Swiss typography. | `ImageGen` (Seedream 5.0), `ExtractObject`, `ProceduralSignal`, `Modulate`, `HalftoneScreen`, `SelectiveColor`, `Levels`, `CanvasGenerator`, `Compositor` |
| [▶️ Watch](https://youtube.com/shorts/vYRM4sDqc-4) | [**05: AI Podcast Audiogram Visualizer**](./05-podcast-audiogram-visualizer) | 1:1 Video (MP4) | 64-second Ivory theme audiogram featuring Seedance 2.5 talking avatar host and 7 KenBurns diagram scenes. | `TextToSpeech`, `MediaCut`, `ImageGen` (Seedream 5.0), `VideoGen` (Seedance 2.5), `CaptionGenerator`, `ShadowsHighlights`, `Curves`, `KenBurns` (× 7), `UnsharpMask`, `Compositor` |
| <a href="./06-cross-spec-product-lookbook"><img src="./06-cross-spec-product-lookbook/output.png" width="75" alt="Cross-Spec Lookbook Preview" /></a> | [**06: Cross-Spec Product Lookbook**](./06-cross-spec-product-lookbook) | 3:4 Image (PNG) | Multi-spec pipeline re-using Example 02's rendered product output as an image conditioning reference for a fashion lookbook photoshoot. | `Import` (Cross-Spec Asset Re-use), `ImageGen` (Nano Banana 2 / Imagen 3 Edit), `SelectiveColor`, `FilmGrain`, `Export` |

---

## 🎬 Production Deliverables & Context

### 01: Luxury Real Estate Commercial Video Ad

An automated luxury architectural listing commercial video pipeline that turns property prompts into broadcast-ready, motion-stabilized, color-graded listing videos with AI narration, background soundtrack, synchronized captions, and luxury typography.

[▶️ Watch Demo Video (YouTube)](https://youtu.be/9GPEeM90blk)

* **Deliverable:** 16:9 Landscape Video (1080p MP4)
* **Pipeline Highlights:**
  * Synthesizes architectural villas via `ImageGen` (OpenAI medium quality).
  * Applies RGB S-curve contrast boost with `Curves` and enriches landscape foliage/sky cyans via `SelectiveColor`.
  * Generates cinematic camera glide motion with sub-pixel motion blur via `KenBurns`.
  * Multi-track audio mix: `TextToSpeech` (Gemini Zephyr) narration + `AudioGenerator` ambient chill lounge soundtrack.
  * Synchronized SRT subtitle cues via `CaptionGenerator` (Whisper) and Cinzel typography composited via `Compositor`.

[👉 View Full Spec & README](./01-luxury-real-estate-video-ad)

---

### 02: High-Converting E-Commerce Product Ad Card

An automated e-commerce ad creative and social commerce design pipeline that turns product prompts into studio-retouched, alpha-isolated promotional ad banners with parametric vector shapes, Photoshop-grade layer effects, halftone styling, and dynamic typography.

<img src="./02-ecommerce-product-card/output.png" width="380" alt="High-Converting E-Commerce Product Card" />

* **Deliverable:** 1:1 Square Image (1080x1080 PNG)
* **Pipeline Highlights:**
  * Synthesizes studio sneaker product photography with `ImageGen`.
  * Strips background with `RemoveBackground` (Bria AI) and eliminates edge fringing with `RefineEdge` (`smooth: 8`, `decontaminateAmount: 0.85`).
  * Generates parametric 6-sided vector plate with `ShapeGenerator` with neon glow and 3D bevel.
  * Standard Photoshop `LayerStyle` on product: 4px crisp white stroke, multi-angle drop shadow (`distance: 25px`, `size: 35px`), and inner bevel lighting.
  * Pop-art halftone screen rasterization (`frequency: 24`, `angle: 45°`) on gradient backdrop.
  * Composited with discount badges, feature pills, and Space Grotesk / Montserrat typography.

[👉 View Full Spec & README](./02-ecommerce-product-card)

---

### 03: Faceless History Cash-Cow Short

An automated high-retention YouTube Shorts and TikTok "cash-cow" video generator pipeline that writes dramatic, humorous historical storytelling hooks, synthesizes 5 consecutive oil paintings with 9:16 vertical framing, applies cinematic split-toning and lens vignetting, animates 5 synchronized Ken Burns camera motion trajectories, and syncs word-level subtitles with narrator voiceover.

[▶️ Watch Demo Video (YouTube Shorts)](https://youtube.com/shorts/lzvBc_6_tuQ)

* **Deliverable:** 9:16 Vertical Video (1080x1920 MP4)
* **Pipeline Highlights:**
  * High-retention scriptwriting with `LLM` (Google Gemini 3.7 Flash) about historical events (The 1932 Great Emu War).
  * 5 sequential 9:16 Rembrandt-style oil painting scene generations via `ImageGen` (OpenAI medium quality).
  * Golden-age split-toning via `ColorBalance` and 5 custom cubic-spline camera trajectories via `KenBurns`.
  * Vintage newsreel aesthetic using `Vignette` edge darkening and `FilmGrain` (35mm grain).
  * Deep commanding voiceover with `TextToSpeech` (Gemini Charon) and word-level Whisper subtitles.
  * 5-scene sequencer with channel badge ("🏛️ WEIRD HISTORY") and heavy stroke subtitles via `Compositor`.

[👉 View Full Spec & README](./03-faceless-cash-cow-short)

---

### 04: Vintage Print Editorial Motion Poster

An automated Print-on-Demand (POD), digital gallery, and motion graphics pipeline that transforms AI prompts into physical-fidelity CMYK offset print editorial motion posters (5.0s @ 24fps) with isolated object displacement wave motion, Swiss typography layout, archival cotton paper emulation, and limited edition numbering.

[▶️ Watch Demo Video (GitHub Asset)](https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e)

* **Deliverable:** 3:4 Editorial Motion Poster (1080x1440 MP4 @ 24fps)
* **Pipeline Highlights:**
  * Cyberpunk visual artwork synthesis via `ImageGen` (ByteDance Seedream 5.0 Pro).
  * Surgical isolation of red velvet kimono fabric via `ExtractObject` (Bria AI).
  * 1.0 Hz GPU-driven hue oscillation signal with `ProceduralSignal` modulating the isolated fabric via `Modulate`.
  * True 4-color CMYK offset lithography screening (15°/75°/0°/45° rosette angles) and ink calibration with `SelectiveColor`.
  * Matte paper ink absorption simulation via `Levels` (`inBlack: 0.04`, `outBlack: 0.03`, `inWhite: 0.96`).
  * Swiss modernist typography ("NEO TOKYO // 2088"), archival paper base (`#f5f0eb`), and edition metadata.

[👉 View Full Spec & README](./04-vintage-print-editorial-poster)

---

### 05: AI Podcast Audiogram Visualizer (64s Episode)

A 64-second multi-modal podcast repurposing pipeline in a refined **Ivory Light Theme** featuring a **Seedance 2.5 Talking Female Host** (Dr. Elena Vance; 4s intro at `0–4s` and 4s outro at `60.2–64.2s` synthesized via **ByteDance Seedream 5.0** and driven by sliced Gemini `Kore` voiceover soundbites), 7 middle **KenBurns AI Infographic & Architecture scenes** (`4–60.2s`), warm tonal dynamic range calibration, speaker metadata badges, and synchronized subtitles.

[▶️ Watch Demo Video (YouTube Shorts)](https://youtube.com/shorts/vYRM4sDqc-4)

* **Deliverable:** 1:1 Social Audiogram Video (1080x1080 MP4)
* **Pipeline Highlights:**
  * Voiceover generation with `TextToSpeech` (Gemini Kore) and precise audio slicing with `MediaCut`.
  * Character reference portrait and 7 architectural diagrams via `ImageGen` (Seedream 5.0).
  * Talking avatar host segments with lip-sync via `VideoGen` (Seedance 2.5).
  * 7 floating camera trajectories across technical diagrams with `KenBurns`.
  * Soft ivory tone curve calibration and dynamic range balancing with `Curves`, `Levels`, and `ShadowsHighlights`.
  * Glassmorphism header cards, speaker badges, and synchronized subtitles on ivory canvas (`#fbfaf7`).

[👉 View Full Spec & README](./05-podcast-audiogram-visualizer)

---

### 06: Cross-Spec Streetwear Lookbook Editorial

An automated fashion lookbook photoshoot pipeline demonstrating **cross-spec asset re-use**: importing the rendered promotional creative output from **Example 02** (`../02-ecommerce-product-card/output.png`) as a reference image to condition an AI image generator to synthesize a fashion photoshoot with a young athletic model wearing the exact sneakers from the ad.

<img src="./06-cross-spec-product-lookbook/output.png" width="340" alt="Cross-Spec Streetwear Lookbook Editorial" />

* **Deliverable:** 3:4 Editorial Image (1K PNG)
* **Pipeline Highlights:**
  * Imports rendered image asset from another workflow using `Import` with relative path `../02-ecommerce-product-card/output.png`.
  * Passes reference image into `ImageGen` (`fal-ai/nano-banana-2`, edit mode) to condition footwear generation on the model's feet.
  * Streetwear tonal polish and urban shadow grading with `SelectiveColor`.
  * Editorial 35mm physical film grain texturing with `FilmGrain`.

[👉 View Full Spec & README](./06-cross-spec-product-lookbook)

---

## 🎨 Photoshop-Grade Node Capabilities Demonstrated

* **Cross-Spec & Asset Pipeline**: `Import` (re-using rendered outputs across separate pipelines without hardcoded IDs).
* **Tonal & Color Correction**: `Curves` (monotonic Hermite splines), `SelectiveColor` (CMYK range grading), `Levels` (black/white input/output mapping), `ColorBalance` (shadow/mid/highlight tinting), and `ShadowsHighlights` (independent dynamic range recovery).
* **Layer FX & Styling**: `LayerStyle` (multi-angle Drop Shadow, Inner Shadow, Stroke outlines, and 3D Bevel & Emboss).
* **Subject Extraction & Matting**: `RemoveBackground` (Bria AI) + `RefineEdge` (sub-pixel Gaussian smoothing, edge shifting, and color spill decontamination).
* **Print & Pop-Art Screening**: `HalftoneScreen` (4-Color CMYK process offset screening with standard angles and LPI control).
* **Optical & Analog Finishing**: `KenBurns` (cinematic camera translation & zoom), `UnsharpMask` (acutance sharpening), `FilmGrain` (35mm grain), and `Vignette` (dark corners).
* **Layout & Compositing**: `Compositor` (flexible HTML-like auto-layout engine, subtitle cue rendering, and typography).

---

## ⚡ Quick Validation & Dry-Run

To validate all example specifications:
```bash
# Example 1
artifex validate examples/01-luxury-real-estate-video-ad/spec.json
artifex build examples/01-luxury-real-estate-video-ad/spec.json

# Example 2
artifex validate examples/02-ecommerce-product-card/spec.json
artifex build examples/02-ecommerce-product-card/spec.json

# Example 3
artifex validate examples/03-faceless-cash-cow-short/spec.json
artifex build examples/03-faceless-cash-cow-short/spec.json

# Example 4
artifex validate examples/04-vintage-print-editorial-poster/spec.json
artifex build examples/04-vintage-print-editorial-poster/spec.json

# Example 5
artifex validate examples/05-podcast-audiogram-visualizer/spec.json
artifex build examples/05-podcast-audiogram-visualizer/spec.json

# Example 6
artifex validate examples/06-cross-spec-product-lookbook/spec.json
artifex build examples/06-cross-spec-product-lookbook/spec.json
```
