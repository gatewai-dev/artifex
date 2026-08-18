---
name: selective-color
description: "Photoshop-standard CMYK color grading tool. Adjusts Cyan, Magenta, Yellow, and Black inks across 9 targeted color ranges without edge artifacts or noisy pixel masks."
metadata:
  nodeType: SelectiveColor
  triggers: "selective color, cmyk color grading, color balance range, adjust reds, adjust greens, adjust blues, adjust yellows, adjust cyans, adjust magentas, clean whites, deep blacks, relative color adjustment, absolute color adjustment, skin tone grading"
---

# SelectiveColor

## What It Does
The SelectiveColor node is the industry-standard CMYK color grading and tonal correction tool modeled directly after Adobe Photoshop's Selective Color adjustment layer:

- **9 Targeted Color Ranges**:
  - `Reds`: Warms or cools skin tones, sunsets, and warm accents.
  - `Yellows`: Tweaks foliage, daylight tones, and gold highlights.
  - `Greens`: Fine-tunes landscapes, grass, and foliage vitality.
  - `Cyans`: Balances skies, aquatic reflections, and cool lighting.
  - `Blues`: Intensifies deep water, night skies, and denim.
  - `Magentas`: Grades sunset purples, flowers, and neon tones.
  - `Whites`: Cleans highlights, removes color casts from backgrounds or paper.
  - `Neutrals`: Controls midtone color shifts, split toning, and global tint.
  - `Blacks`: Adds film fade, deepens shadows, or tones dark values.
- **CMYK Ink Sliders**:
  - Independent adjustments for **Cyan**, **Magenta**, **Yellow**, and **Black** ($-100\%$ to $+100\%$) within each range.
- **Two Calculation Modes**:
  - `Relative`: Scales CMYK deltas relative to existing channel percentages. Ensures pure whites remain white and adjustments remain smooth and photographic.
  - `Absolute`: Applies direct CMYK percentage offsets to target colors, allowing stronger shifts and highlight tinting.
- **Artifact-Free Processing**:
  - Operates via continuous procedural color weight equations—never creates pixel fringing, halos, or jagged threshold selections.

## When to Use
- **Commercial Retouching & Skin Tone Harmonization**: Remove unflattering yellow or magenta casts in portraits while preserving natural skin glow.
- **Landscape & Nature Grading**: Saturate and enrich foliage greens by adding cyan/yellow and reducing magenta.
- **Deep Sky & Ocean Enhancement**: Deepen atmospheric blues without affecting warm elements or neutrals.
- **Product Photography & Pure Whites**: Purify white studio backdrops by dropping cyan, magenta, yellow, and black in Whites.
- **Cinematic Split-Toning & Rich Blacks**: Inject teal into shadows (Blacks: $+5\%$ Cyan, $+5\%$ Yellow) and warm highlights for a filmic look.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | Primary media source to grade |

## Config
| Field | Type | Options / Range | Default | Description |
|-------|------|-----------------|---------|-------------|
| method | enum | Relative, Absolute | Relative | Calculation mode for ink scaling |
| reds | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Red pixels |
| yellows | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Yellow pixels |
| greens | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Green pixels |
| cyans | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Cyan pixels |
| blues | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Blue pixels |
| magentas | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Magenta pixels |
| whites | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Highlight / White pixels |
| neutrals | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Midtone / Neutral pixels |
| blacks | object | cyan, magenta, yellow, black: -100 to +100 | { cyan: 0, magenta: 0, yellow: 0, black: 0 } | Adjustments for Shadow / Black pixels |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Color graded output media stream |

## Common Recipes & Patterns

### 1. Landscape Pop (Punchy Foliage & Deep Sky)
```json
{
  "name": "Landscape Grade",
  "nodes": [
    { "id": "input-img", "type": "Import", "config": { "file": "./landscape.jpg" } },
    {
      "id": "selective-color",
      "type": "SelectiveColor",
      "config": {
        "method": "Relative",
        "greens": { "cyan": 25, "magenta": -20, "yellow": 35, "black": -10 },
        "yellows": { "cyan": -15, "magenta": -5, "yellow": 20, "black": 0 },
        "cyans": { "cyan": 30, "magenta": 10, "yellow": -15, "black": 5 },
        "blues": { "cyan": 20, "magenta": 15, "yellow": -20, "black": 10 }
      }
    },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/landscape-graded.png" } }
  ],
  "edges": [
    { "source": "input-img", "target": "selective-color", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "selective-color", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

### 2. High-Key Clean Studio Product
```json
{
  "name": "Clean Studio White",
  "nodes": [
    { "id": "input-img", "type": "Import", "config": { "file": "./product.jpg" } },
    {
      "id": "selective-color",
      "type": "SelectiveColor",
      "config": {
        "method": "Absolute",
        "whites": { "cyan": -8, "magenta": -8, "yellow": -8, "black": -15 },
        "blacks": { "cyan": 5, "magenta": 5, "yellow": 5, "black": 15 }
      }
    },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/product-clean.png" } }
  ],
  "edges": [
    { "source": "input-img", "target": "selective-color", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "selective-color", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```
