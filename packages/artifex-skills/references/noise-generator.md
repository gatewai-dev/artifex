---
name: noise-generator
description: "Generates procedural 3D noise textures (Perlin, Simplex, and Voronoi) using WebGPU shaders."
metadata:
  nodeType: NoiseGenerator
  triggers: "noise generator, generate noise, procedural noise, simplex noise, perlin noise, voronoi noise, texture generator"
---

# Noise Generator Node

Generates procedural 3D noise textures (Perlin, Simplex, and Voronoi) using WebGPU shaders.

## Features

- **Noise Types**: Perlin, Simplex, Voronoi.
- **Output Types**:
  - `Image`: Static 2D noise.
  - `Video`: Dynamic 3D noise evolving over time.
- **Configurable Settings**:
  - `width` / `height`: Resolution of the generated texture.
  - `scale`: Size/frequency of the noise. Can be modulated by a `ProceduralSignal`.
  - `octaves`: Fractal detail depth (1 to 8).
  - `persistence`: Roughness level of detail.
  - `lacunarity`: Frequency spacing of details.
  - `speed`: Time-based evolution speed in video mode.
  - `colorStart` & `colorEnd`: Colors mapped to the low/high values of the noise.
  - `durationMs` & `fps`: Timing settings in video mode.

## Handles

### Inputs
None.

### Outputs
- **Result**: `Image` or `Video` type containing the generated noise texture.
