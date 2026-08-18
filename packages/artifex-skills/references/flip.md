---
name: flip
description: "Flips, mirrors, transposes, or reflects visual media horizontally, vertically, diagonally, or into split-mirror symmetry."
metadata:
  nodeType: Flip
  triggers: "flip, mirror image, flip horizontal, flip vertical, mirror video, transpose image, kaleidoscope, split mirror, reverse orientation"
---

# Flip

## What It Does
The `Flip` node provides geometric reflection operations on visual media (images, videos, SVGs, Lottie, GIFs). It supports horizontal and vertical mirroring, diagonal transpositions (swapping X and Y dimensions), point reflections (180° flips), and split-mirror kaleidoscopic symmetries (`leftToRight`, `rightToLeft`, `topToBottom`, `bottomToTop`, `quadrant`).

## When to Use
- **Directional Correction:** Fix mirrored camera selfies or horizontally invert character/product assets to face another direction.
- **Orientation & Transposition:** Swap X and Y axes (`diagonal` / `antiDiagonal`) to transpose portrait and landscape orientations without cropping.
- **Symmetry & Patterns:** Generate seamless bilateral or 4-way radial kaleidoscope reflections using the `symmetry` split-mirror modes.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The visual media to flip or mirror |

## Config
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | enum | "horizontal" | Preset mode: `horizontal`, `vertical`, `both`, `diagonal`, `antiDiagonal`, `custom` |
| horizontal | boolean | true | Mirror horizontally along vertical center axis (active in `custom` mode) |
| vertical | boolean | false | Mirror vertically along horizontal center axis (active in `custom` mode) |
| diagonal | boolean | false | Swap X and Y axes (transposition) |
| symmetry | enum | "none" | Split-mirror symmetry: `none`, `leftToRight`, `rightToLeft`, `topToBottom`, `bottomToTop`, `quadrant` |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Flipped / mirrored visual media output |

## Common Recipes & Patterns

### 1. Horizontal Mirror
```json
{
  "name": "Horizontal Mirror Recipe",
  "nodes": [
    { "id": "src-img", "type": "Import", "config": { "file": "./character.png" } },
    {
      "id": "flip-1",
      "type": "Flip",
      "config": { "mode": "horizontal" }
    },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/flipped.png" } }
  ],
  "edges": [
    { "source": "src-img", "target": "flip-1", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "flip-1", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

### 2. 4-Way Kaleidoscopic Symmetry
```json
{
  "name": "Kaleidoscope Recipe",
  "nodes": [
    { "id": "src-img", "type": "Import", "config": { "file": "./texture.png" } },
    {
      "id": "flip-sym",
      "type": "Flip",
      "config": { "symmetry": "quadrant" }
    },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/kaleidoscope.png" } }
  ],
  "edges": [
    { "source": "src-img", "target": "flip-sym", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "flip-sym", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```
