---
name: Export
nodeType: Export
summary: >
  The terminal workflow node that compiles and renders composition outputs.
  Allows exporting results in MP4, WebM, GIF, MP3, or CUBE (LUT) formats with configurable render targets.
triggers:
  - export
  - download
  - save
  - render
  - compile
  - output
  - format video
---

# Export

## What It Does
Acts as the final (terminal) node in a workflow canvas. It collects the upstream processed media (including LUT data), renders the final composition, and prepares the output file for user download or API ingestion. If the input is already a completed file or does not require rendering/compilation, the render configuration options (location, format, quality) are hidden, and the node offers a direct download.

## When to Use
- **Final Output Generation:** Always place at the end of a canvas chain to compile and output your video, audio, image, or LUT compositions.
- **Format Conversion:** Convert dynamic media formats (like Lottie or SVG) or color lookup tables (LUTs) into standard, shareable/usable formats.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Text, Image, Video, Audio, SVG, Caption, Lottie, GIF, LUT | ✅ | The final media, text, or LUT asset to compile and export. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| file | string | Any valid file path | undefined | Output path/filename where the rendered asset will be saved locally. (For Artifex CLI only) |
| format | string (enum) | `mp4`, `webm`, `gif`, `mp3`, `cube` | `"mp4"` | The container format of the exported file. |
| renderAt | string (enum) | `server`, `browser` | `"browser"` | Where the rendering execution takes place (local browser canvas or remote server processor). |
| audioCodec | string (enum) | `aac`, `opus`, `mp3` | undefined | Custom audio codec to use for encoding. |

## Output
This is a **Terminal Node**; it does not have output handles, as its result is compiled directly into the downloadable asset of the workflow execution.

## Limitations & Validation
> [!IMPORTANT]
> **Even Dimension Requirement:**
> For video and GIF exports, the input media's dimensions (width and height) must be **even numbers** (e.g. 1920x1080). Odd dimensions (e.g., 1081px height) will fail validation because standard video encoders (like H.264/MP4) require even-aligned pixel grids. Static image exports, SVG, and audio-only exports do not require even dimensions. Adjust upstream Crop, Resize, or Compositor settings to resolve.
>
> **GIF Duration Limit:**
> Animated GIF exports are limited to a maximum duration of **15 seconds**. If your media exceeds 15 seconds, trim the source before exporting as a GIF or choose another export format.

### Pricing Logic
- **Minimum cost:** **20 credits** per render - direct downloads are free.
- **Audio-only:** `(durationSeconds * 0.002 + 0.1) * 2` credits.
- **Video/GIF:** Scales with resolution (non-linearly) and framerate:
  - `pixels = width * height`
  - `pixelRatio = pixels / (1920 * 1080)`
  - `resolutionMultiplier = pixelRatio ^ 1.5` (e.g., 4K is ~8x HD cost)
  - `fpsMultiplier = fps / 30`
  - `cost = Math.max(20, Math.round((durationSeconds * 0.017 * resolutionMultiplier * fpsMultiplier + 0.5) * 2))` credits.
