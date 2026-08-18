---
name: gradient-map
description: "Replaces the luminance values of an image or video with colors sampled along a custom multi-stop color gradient."
metadata:
  nodeType: gradient-map
  triggers: ""
---

# GradientMap Node

The **GradientMap** node replaces the tonal luminance values of incoming media (Image, Video, GIF, SVG, Lottie) with colors sampled along an interactive multi-stop color gradient. It is essential for duotone styling, false-color thermal effects, gradient grading, and artistic color mapping.

## Handles

### Inputs
- **`Input`** (`["Image", "SVG", "Video", "GIF", "Lottie"]`, required): The source visual media.

### Outputs
- **`Result`** (`["Image", "Video", "GIF"]`): The graded media stream.

## Configuration Schema

```typescript
export const GradientStopSchema = z.object({
  position: z.number().min(0).max(1), // 0.0 to 1.0 (Black to White)
  color: z.string(),                  // CSS color or hex (#RRGGBB)
});

export const gradientMapConfig = configBuilder()
  .field("stops", z.array(GradientStopSchema).min(2).default([
    { position: 0.0, color: "#000000" },
    { position: 1.0, color: "#ffffff" },
  ]))
  .field("smooth", z.boolean().default(true))
  .field("dither", z.boolean().default(true))
  .field("opacity", z.number().min(0).max(1).default(1.0), {
    bindable: true,
    dataTypes: ["Number", "Signal"],
    label: "Opacity",
  })
  .build();
```

## Features
- **Multi-Stop Color Gradient**: Define 2 to 16 color stops with custom positions from 0% (Shadows/Black) to 100% (Highlights/White).
- **Built-in Presets**: Quick access to classic B&W, Sepia Tone, Cyberpunk, Sunset Glow, Thermal/Heatmap, Emerald, Blueprint, Ultraviolet, and Golden Hour.
- **Smooth vs. Step Interpolation**: Switch between smooth linear color blending or stepped posterized gradients.
- **High-Quality Spatial Dithering**: Eliminates 8-bit banding across soft gradients.
- **Signal-Modulated Opacity**: Connect continuous LFOs, audio reactivity, or automation signals directly to the opacity handle.
