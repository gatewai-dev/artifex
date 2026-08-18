---
name: Displacement Map
nodeType: DisplacementMap
summary: >
  Distorts media using a displacement map texture for liquid, ripple, glitch, and organic warp effects using WebGPU shaders.
triggers:
  - displacement map
  - warp
  - distort
  - glitch effect
  - liquid ripple
  - displacement
---

# Displacement Map Node

Distorts media using a displacement map texture for liquid, ripple, glitch, and organic warp effects using WebGPU shaders.

## Features

- **Dual Input**: Accepts a source media (Image/Video/SVG/Lottie/GIF) and a displacement map texture (Image/Video).
- **Independent Axis Control**: Separate strength controls for X and Y displacement axes, each signal-bindable.
- **Channel Selection**: Choose which color channel (Red, Green, Blue, Alpha, Luminance) drives X and Y displacement independently.
- **Wrap Modes**: Clamp, Repeat, or Mirror for edge handling.
- **Signal Modulation**: Strength X and Y accept `ProceduralSignal` or `Number` connections for dynamic, audio-reactive displacement.

## Configurable Settings

- `strengthX` / `strengthY`: Displacement intensity in pixels per axis. Can be modulated by signals.
- `xChannel` / `yChannel`: Which channel of the map texture to use for each displacement axis.
- `wrapMode`: How to handle pixels displaced beyond the image boundary (Clamp, Repeat, Mirror).

## Handles

### Inputs
- **Input**: Source media to distort (`Image`, `SVG`, `Video`, `Lottie`, `GIF`). Required.
- **Map**: Displacement map texture (`Image`, `Video`). Required. Connect a Noise Generator or any grayscale/color texture.

### Outputs
- **Result**: `Image`, `Video`, or `GIF` containing the displaced media.

## Common Workflows

1. **Noise Generator → Displacement Map**: Connect a Perlin/Simplex noise to the Map input for organic liquid/ripple distortion.
2. **Audio-Reactive Distortion**: Connect a ProceduralSignal to strengthX/Y for beat-synced warping.
3. **Animated Displacement**: Use a Video-mode Noise Generator as the Map input for time-varying distortion.
