---
name: mesh-warp
description: "Warps images, videos, GIFs, SVGs, and Lottie animations using a grid of control points. Configure columns, rows, and coordinate offsets to mold and distort media in real time."
metadata:
  nodeType: MeshWarp
  triggers: "mesh warp, grid warp, elastic warp, distort image, liquefy, surface wrap, projection warp"
---

# Mesh Warp

## What It Does
Distorts input visual media (Image, Video, SVG, GIF, Lottie) using a structured grid of control points. By moving individual nodes in the grid, you can warp and stretch specific areas of the media relative to surrounding regions.

## When to Use
- **Surface Conforming:** Wrap logos or textures onto uneven or curved surfaces, such as fabrics, cups, or round packaging.
- **Liquefy / Creative Distortion:** Create elastic, melting, stretching, or caricature-like visual effects.
- **Correction:** Correct lens distortions or perspective anomalies by pulling and adjusting specific areas of the frame.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, Video, SVG, GIF, Lottie | ✅ | The media content to apply the grid mesh warping to |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| cols | number | 2–12 | 3 | Number of horizontal grid subdivisions. |
| rows | number | 2–12 | 3 | Number of vertical grid subdivisions. |
| points | array | Array of `{ x: number, y: number }` | `[]` | The list of target coordinates for each grid control point in the mesh (mapped row-by-row, from top-left to bottom-right). Coordinates are percentage-based (0–100). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Warped | Image, Video, GIF | The grid-deformed output media file. |

## Common Patterns
- **Curved Wrap:** Set a 3x3 grid (`cols: 3, rows: 3`), and drag the center point `(50, 50)` to `(50, 65)` while slightly pulling the side handles down to simulate gravity warping.

## Limitations
- Grid points must be ordered correctly to map the underlying mesh surface; chaotic overlapping points can cause visual folding or texture tearing artifacts.
- The total size of the points array must equal `cols * rows`.
