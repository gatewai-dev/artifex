---
name: apply-lut
description: "Applies a 3D Color Lookup Table (.cube LUT file) to input media (Image, SVG, Video, Lottie, or GIF). Supports adjusting the application intensity using static numbers or dynamic modulators/signals."
metadata:
  nodeType: ApplyLUT
  triggers: "apply lut, color grading, lut, look up table, filter, color correction, cube file, color preset"
---

# Apply LUT

## What It Does
Applies a 3D Color Lookup Table (LUT) in `.cube` format to an input media stream. It allows mapping color values to achieve specific cinematic grades, color corrections, or artistic filters, with adjustable intensity. Handles transparent inputs using premultiplied alpha, ensuring color grading does not bleed outside layer bounds.

## When to Use
- **Color Grading:** Apply standardized cinematic look profiles (e.g., Log to Rec.709 conversion, creative grades) to video clips or images.
- **Dynamic Color Filters:** Use a `Signal` modulator to dynamically animate the LUT's intensity over time, creating transition or pulsing color effects.
- **Stylized Visuals:** Apply color palettes consistently across multiple media types, including SVG, Lottie animations, and GIFs.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media source to which the color lookup table will be applied. |
| Lut | LUT | ✅ | The 3D LUT resource containing the color mapping definitions. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| intensity | number | 0–10 | 1.0 | The strength of the color lookup transformation. Supports dynamic signals (Number / Signal). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The color-graded output media file. |

## Common Patterns
- **Cinematic Video Pipeline:** `Video Input + LUT File → Apply LUT (intensity: 1.0) → Preview / Export`
- **Dynamic Transition Effect:** Feed a triangle or sine wave `Signal` into the `intensity` input of the `Apply LUT` node to cycle between the original colors and the color-graded version over time.

## Limitations
- Requires a valid LUT resource as the second input.
- Large LUT volumes may impact WebGPU rendering performance during real-time preview or export composition.
- The output format matches the input media category (Video/Lottie output as Video, Image/SVG output as Image, GIF output as GIF).
