---
name: paint
description: "A canvas drawing tool that lets you paint brush strokes, erase, and draw custom masks over any media. Outputs the composited result and a standalone monochrome mask for downstream masking/effects."
metadata:
  nodeType: Paint
  triggers: "paint, draw, sketch, mask creator, eraser, inpainting mask, overlay drawing, markup"
---

# Paint

## What It Does
Provides an interactive drawing canvas to paint brush strokes, apply eraser paths, or fill areas directly over a media background (or a solid background color). It executes real-time path drawing, alpha-blending, and layer compositing on the GPU using WebGPU, producing both a fully merged image/video and a standalone grayscale alpha mask.

## When to Use
- **Inpainting Mask Generation:** Draw a black-and-white mask over an image region to feed into AI inpainting models (like SDXL or Flux Inpaint) to replace or modify only that specific area.
- **Overlay Sketching:** Draw lines, arrows, highlights, or custom drawings over video/image backgrounds (e.g. video markups or handwritten style overlays).

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Background | Image, SVG, Video, Lottie, GIF | ❌ | Optional background media. If omitted, the canvas clears to the configured `backgroundColor`. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| width | number | min 1 | 1080 | Canvas rendering width. |
| height | number | min 1 | 1080 | Canvas rendering height. |
| maintainAspect | boolean | true/false | true | Lock the drawing aspect ratio to match the background media. |
| backgroundColor | string | Hex color | `"#ffffff"` | Solid color background if no input media is connected. |
| strokes | array (objects) | - | `[]` | List of drawing strokes. Supports brush, eraser, and fill. |

### Stroke Types:
1. **`brush`**: Draws a vector path (`path` string) in a given hex `color`, `size`, and `opacity` with custom alpha blending.
2. **`eraser`**: Clears or cuts out parts of the painted layer using a path (`path` string) and `size` compiled via WebGPU `"mask-out"` blending.
3. **`fill`**: Fills a layer with custom raw image data.

## Outputs
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The composite output (Background media with the painted layers superimposed). |
| Mask | Image | The standalone alpha mask (painted strokes on black background, suitable for downstream mask/matte nodes). |

## Common Patterns
- **AI Inpainting Pipeline:**
  - `Image → [Background] Paint → [Mask output] → Connect to AI Inpainting Mask input`
  - This allows a user to brush over a face or object in the UI, and have an AI replace it.

## Limitations
- Brush paths are rendered as vectorized smooth curves. Very complex or high-frequency drawings with thousands of strokes can impact WebGPU rendering performance.
- When background video is connected, the paint strokes remain static across all frames.
