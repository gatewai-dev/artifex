---
name: canvas-generator
description: "Generates solid colors, linear gradients, or radial gradients from scratch to serve as background color plates, overlays, or composition backdrops."
metadata:
  nodeType: CanvasGenerator
  triggers: "canvas generator, solid color, linear gradient, radial gradient, background generator, color plate"
---

# Canvas Generator

## What It Does
Generates clean solid colors, linear gradients, or radial gradients with customizable width, height, and gradient parameters. Outputs an image dataset that can be used directly as a composition backdrop or key overlay in visual pipelines.

## When to Use
- **Backdrops & Backgrounds**: Set up a starting background layer for texts or overlays.
- **Gradient Fills**: Use gradients for aesthetic designs, borders, or color washes.
- **Aspect Ratio Setups**: Establish custom dimensions (e.g., 1080x1080, 1920x1080) for composition templates.

## Inputs
None. This is a source/generator node that produces media from scratch.

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| width | number | 1–4096 | 1920 | Output width in pixels. |
| height | number | 1–4096 | 1080 | Output height in pixels. |
| fillType | string (enum) | solid, linear, radial | "solid" | The fill mode to render. |
| solidColor | string (hex) | - | "#3b82f6" | The solid color to draw. |
| gradientStart | string (hex) | - | "#3b82f6" | Starting color of the gradient. |
| gradientEnd | string (hex) | - | "#1d4ed8" | Ending color of the gradient. |
| gradientAngle | number | 0–360 | 180 | Angle in degrees for linear gradients. |
| radialCenterX | number | 0.0–1.0 | 0.5 | X-coordinate of the radial gradient center. |
| radialCenterY | number | 0.0–1.0 | 0.5 | Y-coordinate of the radial gradient center. |
| radialRadius | number | 0.0–2.0 | 0.5 | Radius of the radial gradient. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image | The generated solid or gradient color plate. |
