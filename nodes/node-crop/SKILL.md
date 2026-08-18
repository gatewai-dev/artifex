---
name: Crop
nodeType: Crop
summary: >
  Crops media files using rectangular or path-based masks. Produces two outputs: the cropped
  region and the remaining uncropped region. Supports rounded corners and customized point-by-point path structures.
triggers:
  - crop
  - mask
  - slice
  - trim image
  - cut media
  - rounded corners
  - path crop
---

# Crop

## What It Does
Crops input visual media (Image, Video, SVG, GIF, Lottie) using a specified geometric shape (a rectangle or a custom polygon path). It outputs both the cropped portion (inside the shape) and the rest of the media (outside the shape).

## When to Use
- **Reframing Video/Images:** Cut out unwanted edges, borders, or black bars from an uploaded asset.
- **Custom Masks / Shapes:** Crop an image or video into a circle (using `rect` + `roundness`) or a custom polygon path.
- **Split Screen / Dual Effects:** Extract the cropped area to apply one set of effects/modulations to, and use the "Rest" output to apply different effects or keep it original.
- **Aspect Ratio Formatting:** Fit square or portrait assets into landscapes by cropping out matching regions.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, Video, SVG, GIF, Lottie | ✅ | The visual media to apply the crop/mask to |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| cropType | string (enum) | `rect`, `path` | `"rect"` | The type of cropping area boundary. |
| leftPercentage | number | 0–100 | 0 | The left offset of the crop rectangle (as a percentage of container width). |
| topPercentage | number | 0–100 | 0 | The top offset of the crop rectangle (as a percentage of container height). |
| widthPercentage | number | 0–100 | 100 | The width of the crop rectangle (as a percentage of container width). |
| heightPercentage | number | 0–100 | 100 | The height of the crop rectangle (as a percentage of container height). |
| roundness | number | 0–100 | 0 | Percentage of corner rounding. Set to 100 on a square crop to create a perfect circle mask. |
| pathPoints | array | Array of `{ x: number, y: number }` | `[]` | Percentage points (0–100) defining a custom polygon path crop when `cropType` is set to `"path"`. |

## Outputs
| Handle | Type | Description |
|--------|------|-------------|
| Cropped | Image, Video, GIF | The cropped portion of the input media (inside the mask). |
| Rest | Image, Video, GIF | The remaining portion of the input media (outside the mask). |

## Common Patterns
- **Circle Mask / Avatar:** Set `cropType: "rect"`, `leftPercentage: 25`, `topPercentage: 0`, `widthPercentage: 50`, `heightPercentage: 50` (or make width/height percentages match to ensure a square), and set `roundness: 100` to create a circle cutout.
- **Multi-Effect Split:** Pipe `Input` to `Crop`. Take the `Cropped` handle, apply a `Blur` effect to it, and then overlay it back onto the `Rest` handle using a `Compositor` to create a selective blur layout.
- **Aspect Ratio Formatting:** Fit square or portrait assets into landscapes by cropping out matching regions.

## Limitations
- Coordinates and dimensions are defined as percentages (0 to 100) relative to the input media dimensions.
- The `pathPoints` must contain valid coordinates in chronological order to form a closed polygon.
