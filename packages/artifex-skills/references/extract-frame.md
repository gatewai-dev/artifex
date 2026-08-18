---
name: extract-frame
description: "Extracts a single frame from a Video, Lottie animation, or GIF and outputs it as a static Image. The user selects the frame number and the extraction is performed on the GPU as a virtual process."
metadata:
  nodeType: ExtractFrame
  triggers: "extract frame, frame capture, screenshot, video still, freeze frame, frame grab, snapshot"
---

# Extract Frame

## What It Does
Extracts a single frame from an input video, Lottie animation, or GIF file and outputs it as a static image. The frame extraction is a GPU-accelerated virtual operation — no file encoding is needed. The selected frame is rendered on the GPU at the specified frame number.

## When to Use
- **Video Thumbnails:** Extract a specific frame from a video to use as a thumbnail or preview image.
- **Animation Snapshots:** Capture a specific state from a Lottie or GIF animation.
- **Freeze Frames:** Pick a key moment from a video for further image processing (filters, compositing, etc.).
- **Reference Frames:** Extract frames for comparison or as input to other image-based nodes.
- **EXtract LUT:** Extract a single frame from a video to use as a reference for color grading.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Media | Video, Lottie, GIF | ✅ | The media source to extract a frame from |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| frame | number | ≥ 0 | 0 | The frame number to extract (0-indexed). Clamped to the total frame count of the input media. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Frame | Image | The extracted frame as a static image |
## UX
- The node displays a **video player** for the input media. Scrubbing or pausing the player automatically updates the frame number in the config.
- The **DraggableNumberInput** allows precise frame selection (displayed on the left) and also syncs the player position.
- An **info row** (displayed on the right) displays the current timestamp and total frames.

## Common Patterns
- **Video Thumbnail Pipeline:** Connect a Video → Extract Frame (set frame to desired point) → downstream image processing.
- **GIF Frame Picker:** Connect a GIF → Extract Frame → use the static frame as an Image input elsewhere.

## Limitations
- Frame numbers are clamped to the valid range of the input media (0 to totalFrames - 1).
- Output is always a single static Image (no duration, no FPS).
- **Do NOT Use for Static Images:** `ExtractFrame` is strictly meant for capturing frames from true animation sources (`Video`, `Lottie`, `GIF`). Do NOT connect static image pipelines or static `Compositor` outputs to `ExtractFrame`.
