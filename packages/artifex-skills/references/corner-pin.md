---
name: corner-pin
description: "Applies a four-point perspective warp to warp/pin images, videos, GIFs, SVGs, and Lottie animations. Perfect for placing screen mockups inside perspective containers or simulating angled signs, posters, and surface projections."
metadata:
  nodeType: CornerPin
  triggers: "corner pin, perspective warp, quad warp, skew image, pin corners, homography"
---

# Corner Pin

## What It Does
Warps a 2D source image or video using a four-point homography (perspective transform). It allows mapping the four corners of a flat visual asset onto arbitrary custom target coordinates, distorting the perspective to match any quadrilateral shape.

## When to Use
- **Screen Replacements / Mockups:** Place a mobile, tablet, or monitor UI screen mockup inside a perspective shot of a physical device.
- **Environmental Placements:** Overlay posters, paintings, billboards, or graffiti onto angled walls, floors, or surfaces.
- **3D Projection Simulation:** Project visual content onto skewed planes within a scene to give it depth and perspective.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, Video, SVG, GIF, Lottie | ✅ | The media content to perform perspective warping on |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| points | array | Array of 4 coordinate objects: `{ x: number, y: number }` | `[{x:0, y:0}, {x:100, y:0}, {x:0, y:100}, {x:100, y:100}]` | Top-Left (index 0), Top-Right (index 1), Bottom-Left (index 2), and Bottom-Right (index 3) target corners, defined as percentage coordinates (0–100) of the target canvas. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Warped | Image, Video, GIF | The perspective warped output media file. |

## Common Patterns
- **Device Screen Insertion:** `Import (screen video) → Corner Pin (bound corners to the screen edges) → Compositor (over device frame background)`
- **Billboard Overlay:** `Import (advertisement image) → Corner Pin (skewed to match billboard frame) → Compositor (merge with background scene)`

## Limitations
- Values are defined relative to the target container size using normalized percentage coordinates (0 to 100).
- Extreme warping (e.g., crossing corners or dragging corners past the opposite edge) may cause extreme pixel stretching or rendering artifacts.
