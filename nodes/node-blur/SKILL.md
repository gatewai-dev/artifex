---
name: Blur
nodeType: Blur
summary: >
  Applies various types of blurs (Gaussian, Box, Median, Motion, Bilateral, Edge-preserving, Radial, Zoom)
  to images, videos, GIFs, SVGs, and Lottie animations. Use this for depth-of-field effects, focus pull
  transitions, speed/movement effects, or visual styling.
triggers:
  - blur
  - defocus
  - soft focus
  - motion blur
  - radial blur
  - zoom blur
  - gaussian blur
  - box blur
  - median blur
  - bilateral blur
  - edge-preserving blur
---

# Blur

## What It Does
Applies a digital blur effect to input visual media (Image, SVG, Video, Lottie, GIF). It supports multiple blur algorithms (such as Gaussian, Box, Median, Motion, Bilateral, Radial, Zoom, Edge-preserving) to achieve different styles and processing goals.

## When to Use
- **Visual Focus / Depth of Field:** Emphasize foreground elements by blurring the background.
- **Stylistic Transitions:** Animate the blur strength over time to transition between scenes.
- **Motion Effects:** Apply motion blur, radial blur, or zoom blur to simulate movement, speed, or action.
- **Privacy Masking / Obfuscation:** Blur faces, text, license plates, or specific areas of the media.
- **Artistic / Soft Looks:** Smooth skin tones, create dreamlike glow effects, or stylize visuals.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media to apply the blur effect to |
| Strength Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate the blur strength |
| Color Sigma Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate color sigma |
| Center X Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate center X position |
| Center Y Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate center Y position |
| Partial Radius Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate partial blur radius |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| blurType | string (enum) | Gaussian, Box, Median, Motion, Bilateral, Edge-preserving, Radial, Zoom | "Gaussian" | The algorithm used to calculate the blur. |
| strength | number | 0–100 (varies by type) | 5 | Intensity of blur (Gaussian/Box/Radial/Zoom: 0–100, Motion: 0–64, Bilateral: 0–32, Median: 0–15, Edge-preserving: 1–10). |
| angle | number | 0–360 | 0 | The angle of direction for Motion blur (in degrees). |
| sigmaColor | number | 0.01–1.0 | 0.1 | Sigma value for color space in Bilateral / Edge-preserving blurs. High values mix farther colors. |
| centerX | number | 0–1.0 | 0.5 | Normalized horizontal center coordinate (0 to 1) for Radial, Zoom, and Partial blurs. |
| centerY | number | 0–1.0 | 0.5 | Normalized vertical center coordinate (0 to 1) for Radial, Zoom, and Partial blurs. |
| partialBlur | boolean | true/false | false | Blurs only a circular region around (centerX, centerY). |
| radius | number | 0.01–1.0 | 0.3 | Radius of the partial blur region (0.01 to 1.0). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The visual media with the blur effect applied. |

## Common Patterns
- **Animated Transition Pipeline:** `Signal → Blur (strength bound to signal) → Export`
- **Background Defocus / Layering:** `Import (image) → Resize/Crop → Blur (high strength) → Compositor (background)`
- **Action/Speed Effect:** `Import (video) → Blur (blurType: Motion, strength: 15, angle: 90) → Export`
- **Vignette/Focus Pull:** `Import (image) → Blur (blurType: Zoom/Radial, centerX: 0.5, centerY: 0.5) → Export`
- **Spot / Region Obfuscation:** `Import (image) → Blur (partialBlur: true, radius: 0.25, centerX: 0.5, centerY: 0.5)`

## Limitations
- Strength values are capped at 100 (with max 64 for Motion, 32 for Bilateral, 15 for Median, 10 for Edge-preserving).
- Radial, Zoom, and Partial blurs calculate their center relative to width and height using normalized `centerX`/`centerY` coordinates. Interactive canvas handles appear on screen to drag center position and view partial radius.
- Bilateral and Edge-preserving blurs are computationally more expensive and may impact rendering performance.
