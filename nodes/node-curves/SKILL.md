---
name: Color Curves
nodeType: Curves
summary: >
  Applies tonal and color adjustments using an interactive curve editor.
  Supports RGB/Master, Red, Green, Blue channels plus secondary HSL curve modes
  (Hue vs Hue, Hue vs Sat, Lum vs Sat, Sat vs Sat).
  Uses Fritsch-Carlson Monotonic Cubic Hermite Splines and a 1024-entry rgba8unorm WebGPU LUT.
  Displays real-time GPU-computed output histograms behind the curve editor.
triggers:
  - color curves
  - curves
  - color correction
  - tonal grading
  - contrast adjustment
  - s-curve
  - color balance
  - hue saturation
  - hue vs sat
  - lum vs sat
---

# Color Curves

## What It Does
The Color Curves node performs high-fidelity color grading and tonal adjustments. Users can manipulate Master, Red, Green, and Blue RGB curves, or switch to secondary HSL curve modes for targeted hue/saturation control. All curves use Fritsch-Carlson monotonic cubic spline interpolation. The GPU renderer applies a 1024-entry `rgba8unorm` 1D LUT with UV center-alignment to avoid posterization. A WebGPU compute shader generates live histograms (R, G, B, Luma) from the graded output frame and feeds them to the curve editor UI.

## When to Use
- **Contrast Adjustments:** Apply an S-Curve preset on the Master channel.
- **Color Balancing:** Switch Red/Green/Blue channels to selectively tint shadows or highlights.
- **Hue Rotation:** Use Hue vs Hue to rotate specific color ranges without affecting the rest.
- **Targeted Saturation:** Use Hue vs Sat, Lum vs Sat, or Sat vs Sat for surgical saturation control.
- **Stylized Looks:** Combine RGB + HSL curves for filmic grades.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | Source media to grade. |

## Config
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| curveType | enum | `"rgb"` | Active curve mode: `"rgb"`, `"hue-vs-hue"`, `"hue-vs-sat"`, `"lum-vs-sat"`, `"sat-vs-sat"` |
| master | CurvePoint[] | linear | Composite RGB spline (applied before per-channel curves) |
| red | CurvePoint[] | linear | Red channel spline |
| green | CurvePoint[] | linear | Green channel spline |
| blue | CurvePoint[] | linear | Blue channel spline |
| hueVsHue | CurvePoint[] | flat (y=0.5) | Hue rotation by input hue (Y=0.5 = no change) |
| hueVsSat | CurvePoint[] | flat (y=1.0) | Saturation multiplier by input hue |
| lumVsSat | CurvePoint[] | flat (y=1.0) | Saturation multiplier by luminance |
| satVsSat | CurvePoint[] | flat (y=1.0) | Saturation remap by input saturation |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, SVG, Video, Lottie, GIF | Graded output media. |

## Rendering Architecture
- **LUT:** 1024-entry `rgba8unorm` texture. UV center-aligned: `uv = (color × 1023 + 0.5) / 1024`.
- **RGB shader:** Master curve applied first, then per-channel R/G/B curves.
- **HSL shader:** RGB→HSL→apply curve→HSL→RGB per-pixel, with mode uniform.
- **Histogram:** WebGPU compute shader (`atomicAdd` on 256-bin storage buffers) run on the graded output frame, async `mapAsync` readback, non-blocking.
- **Ghost overlay:** All inactive RGB channel curves shown at 25% opacity.

## UI Features
- **Ghost curves:** Inactive channels rendered as faint overlay lines.
- **Live histogram:** Real-time GPU-computed histogram shown as colored area behind the curve.
- **Keyboard:** Arrow keys to nudge (Shift=10×, Alt=0.1×), Tab to cycle points, Delete to remove.

## Common Patterns
- **S-Curve Contrast:** Select S-Curve preset on Master channel.
- **Teal & Orange:** Boost Red highlights + lower Blue shadows on RGB channels.
- **Matte:** Lift black point (x=0, y>0) and lower white point (x=1, y<1).
- **Selective Saturation:** Use Hue vs Sat to desaturate greens without touching skin tones.

## Limitations
- First and last points on each curve are locked to x=0 and x=1.
- Intermediate points must remain sorted along X.
- HSL secondary curves apply in non-linear sRGB space (no linearization).
