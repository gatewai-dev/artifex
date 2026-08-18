---
name: liquify
description: "Applies localized push, pull, bloat, pucker, and twirl distortions around specified coordinates, matching professional Liquify tools."
metadata:
  nodeType: Liquify
  triggers: "liquify, bloat, pucker, twirl, swirl, push pull distortion, localized warp, elastic deformation"
---

# Liquify

## What It Does
Applies localized, non-linear parametric distortions (Push, Pull, Bloat, Pucker, Twirl Clockwise, Twirl Counter-Clockwise) around target coordinates with controllable radius and strength falloff.

## When to Use
- **Retouching & Sculpting:** Subtly reshape portraits, garments, products, or feature silhouettes.
- **Radial Distortion:** Magnify (Bloat) or pinch/compress (Pucker) specific regions without disturbing distant parts of the image.
- **Vortex / Swirl Effects:** Create clockwise or counter-clockwise localized rotational vortices.
- **Directional Smudge / Push:** Shift regions along a vector direction with smooth radial falloff.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | Visual media to apply the localized liquify deformations to |

## Config
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| operations | array of objects | `[]` | List of deformation operations to apply sequentially |

### Operation Object Schema
| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| type | enum | `"Push" \| "Pull" \| "Bloat" \| "Pucker" \| "TwirlCW" \| "TwirlCCW"` | `"Bloat"` | Deformation mode |
| x | number | 0.0–1.0 | 0.5 | Normalized horizontal center coordinate (0=left, 1=right) |
| y | number | 0.0–1.0 | 0.5 | Normalized vertical center coordinate (0=top, 1=bottom) |
| radius | number | 0.01–1.0 | 0.15 | Normalized radius of influence (relative to media dimension) |
| strength | number | 0.0–1.0 | 0.5 | Intensity of the deformation |
| dx | number | -1.0–1.0 | 0.0 | Normalized horizontal displacement offset (for Push/Pull) |
| dy | number | -1.0–1.0 | 0.0 | Normalized vertical displacement offset (for Push/Pull) |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The liquified output media |

## Common Patterns
- **Eye / Feature Bloat:** Add a `Bloat` operation at `x: 0.45, y: 0.4, radius: 0.1, strength: 0.35` to subtly expand a region.
- **Swirl Vortex:** Add a `TwirlCW` operation at center `x: 0.5, y: 0.5, radius: 0.4, strength: 0.8` to create a hypnotic spiral distortion.
- **Directional Push:** Add a `Push` operation with `dx: 0.05, dy: -0.02, radius: 0.2, strength: 0.6` to nudge a contour.

## Limitations
- Operations are rendered in sequential order up to 1,024 strokes.
