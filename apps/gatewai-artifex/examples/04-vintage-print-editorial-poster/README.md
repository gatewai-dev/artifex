# Example 04: Vintage Print Editorial Motion Poster

An automated Print-on-Demand (POD), digital gallery, and motion graphics pipeline that transforms AI prompts into physical-fidelity CMYK offset print editorial motion posters (5.0s @ 24fps) with isolated object displacement wave motion, Swiss typography layout, archival cotton paper emulation, and limited edition numbering.

[▶️ Watch Demo Video (GitHub Asset)](https://github.com/user-attachments/assets/0991d00f-05b1-464a-97b4-21493d23b74e)

---

## 🎬 Pipeline Architecture

```mermaid
graph TD
    P[Cyberpunk Art Prompt] --> IG[ImageGen (ByteDance Seedream 5.0)]
    EP[Kimono Red Section Extract Prompt] --> EO[ExtractObject (Bria AI)]
    IG --> EO
    
    SIG[ProceduralSignal (Sine Hue Modulation)] --> MOD[Modulate (Red Fabric Color Cycling)]
    EO --> MOD
    
    IG --> ART_COMP[Compositor (Artwork Motion Layer)]
    MOD --> ART_COMP
    
    ART_COMP --> SC[SelectiveColor (CMYK Ink Calibration)]
    SC --> LVL[Levels (Matte Archival Paper Response)]
    
    BG[CanvasGenerator (Archival Cotton Rag)] --> COMP[Compositor (Master Swiss Editorial Layout)]
    LVL --> COMP
    
    COMP --> EXP[Export (.mp4)]
```

---

## 🛠 Nodes & Photoshop-Grade Finishing

1. **`ImageGen` (ByteDance Seedream 5.0 Pro)**: Generates high-contrast 4:3 cyberpunk/editorial visual art.
2. **`ExtractObject` (Bria AI)**: Surgically isolates only the red velvet fabric of the kimono with an alpha transparency mask, preserving gold dragon embroidery and headwear.
3. **`ProceduralSignal` (Sine Wave Signal)**: Generates a smooth continuous GPU-driven hue oscillation signal (1.0 Hz).
4. **`Modulate`**: Cycles color on the isolated red kimono fabric while keeping the face, cyberware, gold embroidery, and background pristine.
5. **`Compositor` (`Artwork Motion Compositor`)**: Layers the static base artwork and the animated red kimono layer into an inner motion canvas.
6. **`SelectiveColor`**: Calibrates ink saturation across Cyan, Magenta, and Black inks for true screen-printing tactile depth.
7. **`Levels`**: Softens dynamic range (`inBlack: 0.04`, `outBlack: 0.03`, `inWhite: 0.96`) to simulate matte ink absorption on heavy archival cotton rag paper.
8. **`CanvasGenerator`**: Synthesizes a warm archival paper base (`#f5f0eb`).
9. **`Compositor` (Master Layout)**: Assembles the poster with Swiss modernist typography ("NEO TOKYO // 2088"), heavy border frame, edition metadata ("LIMITED EDITION: 042 / 100"), and verified brand signatures.

---

## 🚀 Execution Guide

### Validate the Spec
```bash
artifex validate examples/04-vintage-print-editorial-poster/spec.json
```

### Inspect the Execution Graph
```bash
artifex build examples/04-vintage-print-editorial-poster/spec.json
```

### Run and Render
```bash
artifex run examples/04-vintage-print-editorial-poster/spec.json --state checkpoint.json
```
Output is saved to `apps/gatewai-artifex/examples/04-vintage-print-editorial-poster/output.mp4`.
