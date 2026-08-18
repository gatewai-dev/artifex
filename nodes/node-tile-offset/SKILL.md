---
name: Tile Offset
nodeType: TileOffset
summary: >
  Shifts visual media coordinates horizontally and vertically with seamless modulo wrap-around (Photoshop Filter > Other > Offset), mirror reflection, or edge clamping for repeating pattern and wallpaper design.
triggers:
  - tile offset
  - seamless pattern
  - offset filter
  - photoshop offset
  - repeat texture
  - pattern tiling
  - wallpaper tiling
  - wrap around edges
---

# Tile Offset

## What It Does
Shifts the pixel coordinates of input visual media (Image, Video, SVG, GIF, Lottie) horizontally and vertically. By default, out-of-bounds pixels wrap seamlessly around the opposite edge using modulo arithmetic (analogous to Adobe Photoshop's `Filter > Other > Offset`).

This makes it straightforward to:
1. Shift edge seams directly to the center of the canvas so texture artists and inpainting models can heal and blend boundaries seamlessly.
2. Animate infinite conveyor belt, scrolling background, or panning pattern effects when hooked up to procedural `Signal` nodes.

## When to Use
- **Seamless Texture Design:** Creating repeating wallpapers, surface materials, 3D game textures, or fabric prints.
- **Seam Healing Workflow:** Use the **50% Shift** quick action (or `H` hotkey) to move the 4 outer image borders to the canvas center, apply healing/inpainting nodes, then shift by 50% again to return to normal.
- **Infinite Animated Scrolling:** Connect a procedural `Signal` wave (e.g. ramp or sine) to `offsetX` or `offsetY` for continuous WebGPU-accelerated scrolling animations.

## Hotkeys (Active when node is selected)
| Key | Action | Description |
|-----|--------|-------------|
| `ArrowLeft` / `ArrowRight` | Nudge X | Shifts horizontal offset by 1px (or 10px with `Shift`). |
| `ArrowUp` / `ArrowDown` | Nudge Y | Shifts vertical offset by 1px (or 10px with `Shift`). |
| `H` | 50% Shift | Instantly shifts +50% width and +50% height to bring borders to center. |
| `R` / `0` | Reset | Resets `(offsetX, offsetY)` to `(0, 0)`. |
| `W` | Toggle Wrap | Toggles seamless modulo edge wrap on/off. |
| `Shift + Drag` | Axis Constrain | Constrains interactive canvas dragging to single axis. |
| `Alt + Drag` | Increment Snap | Snaps offset to 25%, 50%, 75% quadrant increments. |

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, Video, SVG, GIF, Lottie | ✅ | Visual media to offset and tile. |
| offsetX | Number, Signal | ❌ | Dynamic horizontal pixel shift. |
| offsetY | Number, Signal | ❌ | Dynamic vertical pixel shift. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| offsetX | number | Any | `0` | Horizontal pixel offset (px). |
| offsetY | number | Any | `0` | Vertical pixel offset (px). |
| wrap | boolean | true / false | `true` | When true, wraps pixels across opposite edges (Photoshop Offset default). |
| edgeMode | string | wrap, clamp, transparent, mirror | `wrap` | Boundary handling algorithm. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The seamlessly offset and tiled media (same dimensions as input). |

## Common Workflows
```json
{
  "id": "tile-offset-1",
  "type": "TileOffset",
  "config": {
    "offsetX": 512,
    "offsetY": 512,
    "wrap": true,
    "edgeMode": "wrap"
  }
}
```
