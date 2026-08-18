---
name: levels
description: "Adjusts the tonal range and color balance of images, videos, GIFs, SVGs, and Lottie files. Features channel-specific controls (Master, Red, Green, Blue) with input/output black and white points to adjust contrast, brightness, and color tinting."
metadata:
  nodeType: Levels
  triggers: "levels, color correction, color grading, contrast adjustment, brightness, black point, white point, color balance, tonal range"
---

# Levels

## What It Does
Adjusts the color tones and brightness levels of input visual media (Image, SVG, Video, Lottie, GIF). By defining black and white thresholds for both input mapping and output scaling, it compresses or expands the tonal range globally (Master) or per color channel (Red, Green, Blue).

## When to Use
- **Increase Contrast / Pop:** Darken highlights or lighten shadows by bringing the input black/white points closer together.
- **Color Grading / Tinting:** Adjust individual channel black/white properties (e.g., boosting red input white points or lowering green output points) to fix color casts or create artistic color palettes.
- **Normalize Footage:** Correct flat or washed-out log profiles by mapping black/white levels to full output ranges.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, GIF, Lottie | ✅ | The media content to apply color/level adjustments to |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| master | object | Levels Channel Object | `{inBlack: 0, inWhite: 1, outBlack: 0, outWhite: 1}` | Tonal adjustments applied globally to all color channels. |
| red | object | Levels Channel Object | `{inBlack: 0, inWhite: 1, outBlack: 0, outWhite: 1}` | Tonal adjustments applied specifically to the Red channel. |
| green | object | Levels Channel Object | `{inBlack: 0, inWhite: 1, outBlack: 0, outWhite: 1}` | Tonal adjustments applied specifically to the Green channel. |
| blue | object | Levels Channel Object | `{inBlack: 0, inWhite: 1, outBlack: 0, outWhite: 1}` | Tonal adjustments applied specifically to the Blue channel. |

### Levels Channel Schema
Each channel object supports:
- **`inBlack`** (number, range `0`–`1`): The input dark threshold. Any input pixel value below this becomes black.
- **`inWhite`** (number, range `0`–`1`): The input light threshold. Any input pixel value above this becomes white.
- **`outBlack`** (number, range `0`–`1`): Maps input black level to this output level. Raising this lightens shadows.
- **`outWhite`** (number, range `0`–`1`): Maps input white level to this output level. Lowering this dims highlights.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The color-corrected output media file. |

## Common Patterns
- **High Contrast Pop:** Set `master.inBlack: 0.1` and `master.inWhite: 0.9` to crush shadows and raise highlights.
- **Matte / Faded Film Look:** Set `master.outBlack: 0.1` and `master.outWhite: 0.95` to soften blacks and whites for a vintage aesthetic.
- **Warm / Golden Hour Tint:** Increase red channel highlights (`red.inWhite` lower) and blue channel shadows (`blue.outBlack` higher) to color-correct the image with warm highlights.

## Limitations
- Values are normalized floats between `0.0` and `1.0`.
- All operations are performed on the GPU using fragment shaders for real-time performance.
