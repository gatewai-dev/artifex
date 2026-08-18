---
name: modulate
description: "Applies color modulation adjustments (Hue, Brightness, Contrast, Exposure, Saturation, Sepia) to images, videos, GIFs, SVGs, and Lottie animations. Supports binding parameters to dynamic signals."
metadata:
  nodeType: Modulate
  triggers: "modulate, color adjustments, hue rotation, brightness modulate, saturation modulate, sepia filter, exposure adjustment, signal filter"
---

# Modulate

## What It Does
Modulates color and exposure properties of input visual media (Image, SVG, Video, Lottie, GIF). Crucially, every property can be dynamically bound to a numeric input or control Signal (such as LFO, audio, or envelopes) for real-time reactive animation.

## When to Use
- **Dynamic Color Pulsing:** Bind hue or saturation to an audio/beat signal to make colors shift to the rhythm of music.
- **Exposure / Flash Effects:** Bind exposure or brightness to a spike or trigger signal to simulate lightning flashes, camera shutters, or strobes.
- **Basic Grading & Filtering:** Apply static filters to adjust contrast, warm up an image using sepia, or desaturate visual layers.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media content to modulate |
| Hue Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate hue |
| Brightness Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate brightness |
| Contrast Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate contrast |
| Exposure Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate exposure |
| Saturation Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate saturation |
| Sepia Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate sepia strength |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| hue | number | 0–360 | 0 | Hue rotation in degrees. |
| brightness | number | 0–2 | 1 | Brightness multiplier. `1` is original, `0` is black, `2` is twice as bright. |
| contrast | number | 0–2 | 1 | Contrast multiplier. `1` is original, `0` is completely flat grey. |
| exposure | number | -2–2 | 0 | Exposure offset scale. |
| saturation | number | 0–2 | 1 | Saturation multiplier. `1` is original, `0` is grayscale, `2` is twice as saturated. |
| sepia | number | 0–1 | 0 | Sepia tone intensity. `0` is disabled, `1` is full sepia tint. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The modulated output media file. |

## Common Patterns
- **Audio-Reactive Saturation:** `Beat/Audio Signal → Modulate (Saturation Signal input bound) → Export`
- **Flicker Screen:** Connect a random or high-frequency sine wave signal to the `Brightness Signal` or `Exposure Signal` handle.

## Limitations
- Values are clamped to the specified ranges in the shaders.
- Standard blending modes apply; excessive exposure or brightness adjustments may clip/blow out highlights.
