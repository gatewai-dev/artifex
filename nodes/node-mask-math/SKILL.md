---
name: MaskMath
nodeType: MaskMath
summary: >
  Performs morphological (dilate, erode, choke, feather) and Boolean set operations (union, intersect, subtract, difference, invert) on alpha and matte channels.
triggers:
  - mask math
  - alpha math
  - matte operations
  - dilate mask
  - erode mask
  - choke matte
  - feather mask
  - invert mask
  - mask union
  - mask intersect
  - mask subtract
  - mask difference
  - combine masks
  - alpha boolean
---

# MaskMath

## What It Does
The MaskMath node executes hardware-accelerated morphological and Boolean set operations on alpha masks and grayscale mattes:

- **Boolean Set Operations**:
  - **Union ($A \cup B$)**: Combines two masks: $M = \operatorname{clamp}(A + B, 0, 1)$ or $\max(A, B)$.
  - **Intersect ($A \cap B$)**: Retains overlapping areas: $M = \min(A, B)$.
  - **Subtract ($A - B$)**: Cuts out Mask B from Mask A: $M = \operatorname{clamp}(A - B, 0, 1)$.
  - **Difference ($|A - B|$)**: Symmetric exclusive OR (XOR) mask difference: $M = |A - B|$.
  - **Invert ($1 - A$)**: Flips matte polarity: $M = 1.0 - A$.

- **Morphological & Spatial Filtering**:
  - **Dilate**: Expands mask boundaries outward by radius $R$ pixels using a maximum filter.
  - **Erode**: Shrinks mask boundaries inward by radius $R$ pixels using a minimum filter.
  - **Choke**: Non-linear contracted erosion with thresholded compression to tighten soft AI/green-screen mattes.
  - **Feather**: Smooths mask transitions with a separable Gaussian blur kernel.

- **Channel Extraction & Output Conditioning**:
  - Extract masks from `Alpha`, `Luminance`, `Red`, `Green`, or `Blue` channels.
  - Apply `clampMin` and `clampMax` to clamp soft falloffs.
  - Optional `binarize` for crisp 1-bit binary cutouts.
  - Output as `WhiteWithAlpha` (standard compositing matte), `GrayscaleRGB` (preview), `AlphaOnly`, or `PassthroughRGB` (cuts out Mask A's RGB directly).

## When to Use
- **Combining AI Segmentations**: Merge subject segmentation masks with clothing or face masks.
- **Edge Outlines & Stroke Generation**: Subtract an eroded mask from the original mask to generate an exact perimeter outline.
- **Garbage Mattes & Holdout Mattes**: Subtract exclusion zones or combine green screen keyer outputs.
- **Soft Border Vignettes & Feathering**: Soften harsh cutout boundaries using Gaussian feathering.
- **Color Extraction to Matte**: Convert a high-contrast luminance or red/blue channel directly into a usable alpha mask.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Mask A | Image, SVG, Video, Lottie, GIF | ✅ | Primary matte or image channel |
| Mask B | Image, SVG, Video, Lottie, GIF | ❌ | Secondary matte for dual-mask Boolean operations |
| Radius Signal | Number, Signal | ❌ | Dynamic signal/number to modulate kernel radius (0–200 px) |
| Threshold Signal | Number, Signal | ❌ | Dynamic signal/number to modulate binarization/choke threshold (0.0–1.0) |
| Clamp Min Signal | Number, Signal | ❌ | Dynamic signal/number for lower matte cutoff (0.0–1.0) |
| Clamp Max Signal | Number, Signal | ❌ | Dynamic signal/number for upper matte cutoff (0.0–1.0) |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| operation | enum | Union, Intersect, Subtract, Difference, Invert, Dilate, Erode, Choke, Feather | Union | Mathematical or morphological operation to execute |
| radius | number | 0–200 | 0 | Kernel radius in pixels for Dilate, Erode, Choke, or Feather |
| threshold | number | 0.0–1.0 | 0.5 | Threshold level used for binarization or non-linear choke contraction |
| clampMin | number | 0.0–1.0 | 0.0 | Minimum alpha cutoff level |
| clampMax | number | 0.0–1.0 | 1.0 | Maximum alpha cutoff level |
| channelA | enum | Alpha, Luminance, Red, Green, Blue | Alpha | Source channel extracted from Mask A |
| channelB | enum | Alpha, Luminance, Red, Green, Blue | Alpha | Source channel extracted from Mask B |
| binarize | boolean | true / false | false | Quantize output to hard 1-bit binary mask (0.0 or 1.0) |
| invertResult | boolean | true / false | false | Invert final output matte polarity |
| outputFormat | enum | WhiteWithAlpha, GrayscaleRGB, AlphaOnly, PassthroughRGB | WhiteWithAlpha | Output color representation |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Processed matte or masked visual media output |

## Common Recipes & Patterns

### 1. Extract Mask Boundary Outline (Perimeter Stroke)
Generate a 4px perimeter ring around a subject mask:
```json
{
  "name": "Mask Perimeter Outline",
  "nodes": [
    { "id": "subject-mask", "type": "Import", "config": { "file": "./matte.png" } },
    { "id": "erode-node", "type": "MaskMath", "config": { "operation": "Erode", "radius": 4 } },
    { "id": "diff-node", "type": "MaskMath", "config": { "operation": "Subtract" } },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/border.png" } }
  ],
  "edges": [
    { "source": "subject-mask", "target": "erode-node", "sourceLabel": "Result", "targetLabel": "Mask A" },
    { "source": "subject-mask", "target": "diff-node", "sourceLabel": "Result", "targetLabel": "Mask A" },
    { "source": "erode-node", "target": "diff-node", "sourceLabel": "Result", "targetLabel": "Mask B" },
    { "source": "diff-node", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

### 2. Tighten Green-Screen Matte with Choke & Feather
Remove green fringing by shrinking and softening the edge:
```json
{
  "name": "Choke and Soften Keyer Matte",
  "nodes": [
    { "id": "keyer", "type": "ColorKey", "config": { "keyColor": "#00FF00" } },
    { "id": "choke", "type": "MaskMath", "config": { "operation": "Choke", "radius": 2, "threshold": 0.3 } },
    { "id": "feather", "type": "MaskMath", "config": { "operation": "Feather", "radius": 1.5 } }
  ],
  "edges": [
    { "source": "keyer", "target": "choke", "sourceLabel": "Result", "targetLabel": "Mask A" },
    { "source": "choke", "target": "feather", "sourceLabel": "Result", "targetLabel": "Mask A" }
  ]
}
```
