---
name: shadows-highlights
description: "Independently lifts crushed shadows and recovers blown highlights without clipping midtones, with full tonal width, spatial radius, color correction, and midtone contrast controls."
metadata:
  nodeType: shadows-highlights
  triggers: ""
---

# ShadowsHighlights Node

The **ShadowsHighlights** node provides professional dynamic range detail recovery and tone mapping for visual media. It independently lifts dark underexposed shadow areas and suppresses overexposed blown highlights while preserving midtones and local contrast.

## Handles

### Inputs
- **`Input`** (`["Image", "SVG", "Video", "GIF", "Lottie"]`, required): The input visual media stream.

### Outputs
- **`Result`** (`["Image", "Video", "GIF"]`): The processed dynamic-range-recovered media stream.

## Configuration Schema

```typescript
export const shadowsHighlightsConfig = configBuilder()
  .field("shadowAmount", z.number().min(0).max(100).default(0), { label: "Shadow Boost (%)" })
  .field("shadowTonalWidth", z.number().min(0).max(100).default(50), { label: "Shadow Range (%)" })
  .field("shadowRadius", z.number().min(1).max(250).default(30), { label: "Shadow Radius (px)" })
  .field("highlightAmount", z.number().min(0).max(100).default(0), { label: "Highlight Suppression (%)" })
  .field("highlightTonalWidth", z.number().min(0).max(100).default(50), { label: "Highlight Range (%)" })
  .field("highlightRadius", z.number().min(1).max(250).default(30), { label: "Highlight Radius (px)" })
  .field("colorCorrection", z.number().min(-100).max(100).default(0))
  .field("midtoneContrast", z.number().min(-100).max(100).default(0))
  .build();
```

## Features
- **Independent Shadow Lift**: Lifts crushed blacks and underexposed shadow zones with natural photographic falloff without washing out midtones.
- **Independent Highlight Suppression**: Smoothly compresses blown-out skies and specular glares, recovering texture without flattening lighting dynamics.
- **Tonal Width Controls**: Precisely confine shadow and highlight adjustments to extreme tones or broaden them gracefully towards midtones.
- **Spatial Radius Blur**: Separable 2-pass Gaussian convolution determining local illumination context and preventing unseemly haloing.
- **Color Correction**: Compensate for color desaturation in recovered shadow zones or color clipping in bright highlights (-100% to +100%).
- **Midtone Contrast**: S-curve contrast boost centered around midtones (-100% to +100%).
- **Signal & Number Input Modulation**: Real-time signal binding support for all primary parameters.
- **Built-in Presets**: Quick studio presets including *Shadow Detail Lift*, *Highlight Recovery*, *HDR Dynamic Range*, *Backlight Correction*, *Dramatic Contrast & Clarity*, and *Gentle Fill Light*.
