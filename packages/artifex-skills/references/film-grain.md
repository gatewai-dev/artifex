---
name: film-grain
description: "Applies custom, cinematic film grain to images and videos with precise control over grain size, strength, evolution animation, and luminance response curves (shadows, midtones, highlights)."
metadata:
  nodeType: FilmGrain
  triggers: "film grain, grain, cinematic grain, noise, chromatic noise, monochrome noise"
---

# Film Grain

## What It Does
Applies an organic, cinematic film grain effect to input visual media (Image, SVG, Video, Lottie, GIF). Unlike simple static noise, it generates structured grain sizes using smooth value noise and allows fine-grained modulation depending on the image's pixel luminance.

## When to Use
- **Cinematic Finishing:** Add organic texture to flat digital footage to make it look like analog film (e.g. 8mm, 16mm, or 35mm stocks).
- **Matching CG to Live Action:** Blend composited 3D elements or text overlays seamlessly into live-action backgrounds by matching the grain profile.
- **Visual Cohesion:** Unify different source media formats under a single, consistent texture overlay.
- **Retro / Vintage Look:** Create styled visual content with heavy, coarse grain.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media to apply the film grain to |
| Strength Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate the grain strength |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| strength | number | 0–100 | 15 | The intensity of the grain noise. 0 = no grain. |
| size | number | 0.5–4.0 | 1.5 | The scaling of the grain noise clumps. Higher values generate coarser grain. |
| monochrome | boolean | true/false | true | If true, applies monochromatic (B&W) noise. If false, applies chromatic (colored) noise. |
| animated | boolean | true/false | true | If true, the noise patterns evolve over time and output becomes Video. |
| speed | number | 0–100 | 50 | The speed at which the animated grain evolves. |
| shadows | number | 0–1.0 | 0.2 | Grain intensity multiplier in deep shadows (low-luminance pixels). |
| midtones | number | 0–1.0 | 1.0 | Grain intensity multiplier in midtones (mid-luminance pixels). |
| highlights | number | 0–1.0 | 0.2 | Grain intensity multiplier in bright highlights (high-luminance pixels). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The visual media with cinematic film grain applied. |

## Common Patterns
- **Standard Cinematic Finish:** Add subtle grain (`strength: 10`, `size: 1.2`, `shadows: 0.15`, `midtones: 0.8`, `highlights: 0.1`) to polish a composition.
- **Vintage Film Stock:** Apply heavy, colored grain (`strength: 35`, `size: 2.5`, `monochrome: false`, `speed: 70`) for a retro aesthetic.
- **Audio-modulated Grain:** Bind `Strength Signal` to a signal representing audio volume or frequency to make the grain pulse dynamically with music.

## Don't Forget
- **Static Image Compositions:** `animated` defaults to `true`. When composing static graphics, ad banners, or posters, **ALWAYS set `"animated": false`**. Leaving `animated: true` will turn the output into a dynamic 3-second animated sequence, causing downstream `Compositor` and `Export` nodes to render an MP4 video instead of a PNG image.
