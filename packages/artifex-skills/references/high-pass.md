---
name: high-pass
description: "Extracts high-frequency edge details and textures while neutralizing low-frequency tones to 50% gray. Essential for professional frequency separation skin retouching and micro-contrast sharpening."
metadata:
  nodeType: HighPass
  triggers: "high pass, frequency separation, skin retouching, texture sharpening, highpass filter, micro contrast, edge detail extraction"
---

# HighPass

## What It Does
The HighPass filter extracts fine details, pores, textures, and crisp edges by subtracting a Gaussian-blurred low-frequency version of the image from the original, shifting the result to a neutral 50% gray (`#808080`) baseline.

## When to Use
- **Frequency Separation (Pro Skin Retouching):** Separate skin texture (pores, eyelashes, fabric weave) from underlying color and tonal gradients. When composited with `Linear Light` blend mode over a blurred color layer, it allows non-destructive blemish cleanup and color smoothing without destroying surface texture.
- **High-End Micro Sharpening:** Overlay the HighPass layer using `Overlay`, `Soft Light`, or `Linear Light` over the original image to dramatically enhance perceived sharpness and clarity without introducing ringing halos.
- **Normal Map / Texture Extraction:** Extract surface relief details from photographs for 3D displacement or embossing.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The visual media to extract high frequencies from |
| Radius Signal | Number, Signal | ❌ | Optional signal to dynamically modulate the cutoff radius |
| Contrast Boost Signal | Number, Signal | ❌ | Optional signal to modulate the contrast multiplier |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| radius | number | 0.1–250.0 | 3.0 | The cutoff radius in pixels. Frequencies smaller than this radius are preserved as high-frequency details. |
| contrastBoost | number | 1.0–10.0 | 1.0 | Multiplier applied to the extracted detail delta before adding the 50% neutral gray offset. |
| monochrome | boolean | true/false | true | When true, converts color deltas to luminance so the output is purely grayscale 50% neutral texture. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | High-frequency detail layer centered on 50% neutral gray. |

## Common Recipes & Patterns

### 1. High-End Frequency Separation
```json
{
  "name": "Frequency Separation Recipe",
  "nodes": [
    { "id": "src-img", "type": "Import", "config": { "file": "./portrait.jpg" } },
    {
      "id": "low-pass",
      "type": "Blur",
      "config": { "blurType": "Gaussian", "strength": 6 }
    },
    {
      "id": "high-pass",
      "type": "HighPass",
      "config": { "radius": 6, "monochrome": true, "contrastBoost": 1.0 }
    },
    {
      "id": "comp",
      "type": "Compositor",
      "config": {
        "layout": [
          { "id": "tone-layer", "kind": "media", "inputHandleId": "low_freq", "zIndex": 0 },
          { "id": "texture-layer", "kind": "media", "inputHandleId": "high_freq", "blendMode": "linear-light", "zIndex": 1 }
        ]
      },
      "dynamicInputs": [
        { "label": "low_freq", "dataTypes": ["Image"] },
        { "label": "high_freq", "dataTypes": ["Image"] }
      ]
    },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/retouched.png" } }
  ],
  "edges": [
    { "source": "src-img", "target": "low-pass", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "src-img", "target": "high-pass", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "low-pass", "target": "comp", "sourceLabel": "Result", "targetLabel": "low_freq" },
    { "source": "high-pass", "target": "comp", "sourceLabel": "Result", "targetLabel": "high_freq" },
    { "source": "comp", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

### 2. High-Pass Texture Sharpening
- Connect image to `HighPass` (`radius: 2.0`, `contrastBoost: 1.2`).
- In `Compositor`, place original image as background layer and `HighPass` result as foreground layer with `blendMode: "overlay"` and `opacity: 0.7`.
