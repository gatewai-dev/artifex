---
name: unsharp-mask
description: "Enhances edge acutance and micro-contrast using the classic Gaussian unsharp masking equation with threshold noise suppression."
metadata:
  nodeType: UnsharpMask
  triggers: "unsharp mask, sharpen, sharpening, edge enhance, clarity, acutance, texture detail, unsharp"
---

# UnsharpMask

## What It Does
The UnsharpMask node enhances edge contrast and texture sharpness using the classic Gaussian unsharp masking equation:
$$I_{\text{sharp}} = I + \frac{\text{Amount}}{100} \cdot (I - I_{\text{blur}}) \quad \text{where} \quad |I - I_{\text{blur}}| \ge \frac{\text{Threshold}}{255}$$

It extracts high-frequency edge deltas by computing a Gaussian blur and boosts edge transitions above a specified tonal threshold, preserving smooth gradients (such as skies and skin tones) without noise amplification.

## When to Use
- **Post-Upscaling & Resizing Crispness:** Restore fine edge definition after upscaling, downsampling, or video compression.
- **Product & Portrait Photography:** Sharpen eyes, jewelry, fabric weave, and intricate product details without creating harsh halos.
- **Video Acutance Enhancement:** Apply temporal sharpening to video frames to counteract lens softness or motion blur.
- **Selective Edge Sharpening:** Use the `Threshold` parameter to prevent background grain or compression artifacts from being exaggerated.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The visual media to sharpen |
| Amount Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate sharpening strength (0–500%) |
| Radius Signal | Number, Signal | ❌ | Optional signal or number to modulate blur kernel radius (0.1–50.0 px) |
| Threshold Signal | Number, Signal | ❌ | Optional signal or number to modulate the noise suppression threshold (0–255 levels) |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| amount | number | 0–500 | 100 | Sharpening strength percentage. 100% applies 1:1 edge delta boost. |
| radius | number | 0.1–50.0 | 1.5 | Gaussian blur radius in pixels used to detect edge contrast transitions. |
| threshold | number | 0–255 | 3 | Minimum tonal difference (in 8-bit levels) required before sharpening is applied. Suppresses noise in flat areas. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Sharpened visual media with enhanced edge acutance. |

## Common Recipes & Patterns

### 1. High-Quality Photo Sharpening Workflow
```json
{
  "name": "Precision Photo Sharpening Recipe",
  "nodes": [
    { "id": "photo-in", "type": "Import", "config": { "file": "./input.jpg" } },
    {
      "id": "sharpen",
      "type": "UnsharpMask",
      "config": { "amount": 120, "radius": 1.2, "threshold": 2 }
    },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/sharpened.png" } }
  ],
  "edges": [
    { "source": "photo-in", "target": "sharpen", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "sharpen", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

### 2. Aggressive Detail Pop (Macro / Product)
- Connect media to `UnsharpMask` with `amount: 200`, `radius: 2.0`, `threshold: 5`.
