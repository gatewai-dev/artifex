---
name: vignette
description: "Applies a customizable vignette effect to images and videos with precise control over strength, radius, softness, roundness, and center coordinates."
metadata:
  nodeType: Vignette
  triggers: "vignette, soft edges, dark corners, framing effect, post-processing vignette"
---

# Vignette

## What It Does
Applies a classic dark vignette effect to input visual media (Image, SVG, Video, Lottie, GIF). It dims the periphery of the image relative to a specified center point.

## When to Use
- **Framing & Focus:** Direct the viewer's eye towards the center or a specific subject of interest by darkening non-essential edges.
- **Moody or Dramatic Aesthetic:** Add depth, mystery, or cinematic quality to photos and video clips.
- **Simulating Optical Limitations:** Replicate natural lens vignetting common in wide-aperture vintage cameras.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media to apply the vignette to |
| Strength Signal | Number, Signal | ❌ | Optional signal to modulate the strength of the vignette |
| Radius Signal | Number, Signal | ❌ | Optional signal to modulate the radius |
| Softness Signal | Number, Signal | ❌ | Optional signal to modulate the edge softness |
| Roundness Signal | Number, Signal | ❌ | Optional signal to modulate the roundness |
| Center X Signal | Number, Signal | ❌ | Optional signal to modulate the X coordinate of the center |
| Center Y Signal | Number, Signal | ❌ | Optional signal to modulate the Y coordinate of the center |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| strength | number | 0–100 | 50 | The intensity of the darkening effect. 0 = no vignette. |
| radius | number | 0.1–2.0 | 1.0 | The distance from the center where the full darkening occurs. |
| softness | number | 0.0–1.0 | 0.5 | The smoothness of the vignette transition. |
| roundness | number | 0.0–1.0 | 0.5 | 0.0 scales with the aspect ratio (oval), 1.0 makes it a perfect circle. |
| centerX | number | 0.0–1.0 | 0.5 | The horizontal center of the vignette (0.0 = left, 1.0 = right). |
| centerY | number | 0.0–1.0 | 0.5 | The vertical center of the vignette (0.0 = top, 1.0 = bottom). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The visual media with the vignette effect applied. |

## Common Patterns
- **Subtle Portrait Framing:** Use a larger radius and maximum softness (`strength: 40`, `radius: 1.2`, `softness: 0.8`) to softly guide focus without being visually obtrusive.
- **Dramatic Spotlight:** Set a smaller radius and medium softness (`strength: 80`, `radius: 0.6`, `softness: 0.4`) to emphasize a specific area.
- **Off-center Tracking:** Bind `Center X Signal` and `Center Y Signal` to tracker outputs or LFOs to follow an moving subject or create dynamic sweeps.
