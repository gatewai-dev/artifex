---
name: LayerStyle
nodeType: LayerStyle
summary: >
  Applies procedural Photoshop-grade layer styles (Drop Shadow, Inner Shadow, Outer Glow, Inner Glow, Stroke, Bevel & Emboss, and Color Overlay) to alpha-isolated layers, text, icons, and shapes.
triggers:
  - layer style
  - drop shadow
  - inner shadow
  - outer glow
  - inner glow
  - stroke outline
  - bevel and emboss
  - color overlay
  - photoshop layer fx
  - sticker outline
  - neon glow
  - 3d bevel
---

# LayerStyle

## What It Does
The `LayerStyle` node generates procedural Photoshop-grade layer styles on alpha-isolated visual media. It calculates distance fields, morphological edge convolutions, and light elevation models to produce 7 classic non-destructive FX layers:
1. **Drop Shadow:** Multi-angle shadow cast behind the graphic with controllable blur, spread, distance, and opacity.
2. **Inner Shadow:** Carved inner shadow offset inside the graphic contours.
3. **Outer Glow:** Ambient luminescence radiating outwards from the edges.
4. **Inner Glow:** Inner luminescence radiating from borders into the graphic.
5. **Stroke:** Anti-aliased border outline positioned `outside`, `center`, or `inside`.
6. **Bevel & Emboss:** 3D surface extrusion and lighting with multiple styles (`InnerBevel`, `OuterBevel`, `Emboss`, `PillowEmboss`), techniques (`Smooth`, `ChiselHard`, `ChiselSoft`), and altitude/azimuth light direction.
7. **Color Overlay:** Non-destructive uniform color wash blended over the layer.

## When to Use
- **Stickers & Badges:** Add thick white outer strokes and soft drop shadows to icons and cutouts.
- **UI Elements & Buttons:** Create glossy bevels, glassmorphic edges, inner shadows, and neon outer glows.
- **Graphic Design & Typography:** Apply 3D metallic chiseled gold bevels or letterpress engravings.
- **Visual Effects:** Dynamic audio-reactive / signal-modulated glows and shadows.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | Visual media layer to apply styles to |
| Dynamic Signal Handles | Number, Signal | ❌ | Bindable handles for angle, distance, size, spread, choke, depth, and opacities |

## Config Structure
```json
{
  "dropShadow": {
    "enabled": true,
    "color": "#000000",
    "opacity": 0.5,
    "angle": 120,
    "distance": 8,
    "spread": 0,
    "size": 12,
    "blendMode": "multiply"
  },
  "innerShadow": {
    "enabled": false,
    "color": "#000000",
    "opacity": 0.75,
    "angle": 120,
    "distance": 5,
    "choke": 0,
    "size": 5,
    "blendMode": "multiply"
  },
  "outerGlow": {
    "enabled": false,
    "color": "#00f0ff",
    "opacity": 0.8,
    "size": 20,
    "spread": 10,
    "blendMode": "screen"
  },
  "innerGlow": {
    "enabled": false,
    "color": "#ffffff",
    "opacity": 0.6,
    "size": 8,
    "spread": 0,
    "blendMode": "screen"
  },
  "stroke": {
    "enabled": false,
    "size": 4,
    "position": "outside",
    "color": "#ffffff",
    "opacity": 1.0,
    "blendMode": "normal"
  },
  "bevelEmboss": {
    "enabled": false,
    "style": "InnerBevel",
    "technique": "Smooth",
    "depth": 150,
    "direction": "Up",
    "size": 6,
    "soften": 1,
    "angle": 120,
    "altitude": 30,
    "highlightColor": "#ffffff",
    "highlightOpacity": 0.85,
    "shadowColor": "#000000",
    "shadowOpacity": 0.75
  },
  "colorOverlay": {
    "enabled": false,
    "color": "#ff0000",
    "opacity": 1.0,
    "blendMode": "normal"
  }
}
```

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Media layer with all active procedural layer styles composited |

## Built-in Presets
- **Subtle Drop Shadow:** Natural soft drop shadow (`distance: 8`, `size: 16`, `opacity: 0.35`).
- **Sticker Border & Shadow:** 6px white outer stroke + contact drop shadow.
- **Neon Glow:** Cyan outer glow (`size: 28`) + inner glow + center stroke.
- **Glass & Emboss:** Inner bevel + specular highlight + inner shadow + subtle drop shadow.
- **Letterpress / Carved:** Inverted bevel relief + dark inner shadow + bottom white highlight shadow.
- **Metallic Gold Bevel:** Deep chisel bevel + gold outer glow + gold color overlay.
