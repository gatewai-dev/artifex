---
name: resizer-scaler
description: "Adjusts aspect ratios, scales resolutions, pads canvas dimensions, and reframes image/video/GIF assets. Supports cover, contain, stretch, and manual fit modes, anchoring, solid/gradient fills, and blurred smart backgrounds."
metadata:
  nodeType: ResizerScaler
  triggers: "resize, scale, aspect ratio, canvas scale, smart fill, blurred fill, reframe, crop pad"
---

# Resizer / Canvas Scaler

## What It Does
The Resizer / Canvas Scaler node adjusts the layout and resolution of input visual media (Image, SVG, Video, Lottie, GIF). It enables aspect ratio conversion (e.g., from 16:9 landscape to 9:16 vertical), resolution upscaling/downscaling (4K, 1080p, 720p, etc.), framing adjustments (cover, contain, stretch, manual positioning), and customizable canvas backgrounds (solid color, linear gradient, blurred smart background fills, or transparent).

## When to Use
- **Multi-Platform Repurposing:** Adapt widescreen horizontal YouTube/Vimeo videos into vertical TikTok, Instagram Reels, or YouTube Shorts formats.
- **Smart Background Padding:** Avoid blank black bars in "contain" mode by filling the empty space with a blurred, darkened version of the source media itself.
- **Manual Reframing/Pan-and-Zoom:** Manually position, offset, and zoom into specific areas of interest in images and videos.
- **Resolution Standardization:** Enforce exact output dimensions (such as standardizing assets to 1080p or 4K) before passing them downstream.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The source media to scale, resize, or reframe. |

## Config
| Field | Type | Options | Default | Description |
|-------|------|---------|---------|-------------|
| aspectRatioPreset | string (enum) | 16:9, 9:16, 1:1, 4:5, 21:9, custom | "16:9" | Target aspect ratio format. |
| resolutionPreset | string (enum) | 4k, 1080p, 720p, 480p, custom | "1080p" | Target output resolution. |
| targetWidth | number | 1–8192 | 1920 | Custom width in pixels (active if custom is selected). |
| targetHeight | number | 1–8192 | 1080 | Custom height in pixels (active if custom is selected). |
| fitMode | string (enum) | cover, contain, stretch, manual | "contain" | Layout scaling mode. cover fills output, contain fits inside, stretch deforms, manual allows manual positioning. |
| anchorX | string (enum) | left, center, right | "center" | Horizontal alignment anchor. |
| anchorY | string (enum) | top, center, bottom | "center" | Vertical alignment anchor. |
| zoom | number | 1–1000 | 100 | Percent scale zoom multiplier (active in manual mode). |
| offsetX | number | any | 0 | Horizontal translation offset in pixels (active in manual mode). |
| offsetY | number | any | 0 | Vertical translation offset in pixels (active in manual mode). |
| backgroundMode | string (enum) | solid, blurred, gradient, transparent | "solid" | Background style for empty canvas areas. |
| backgroundColor | string (hex) | regex | "#000000FF" | Main background color (HEX6 or HEX8 format). |
| backgroundColor2 | string (hex) | regex | "#000000FF" | Secondary background color (HEX6 or HEX8 format) for gradient mode. |
| blurRadius | number | 0–100 | 40 | Radius of the smart fill background blur. |
| backgroundBrightness | number | 0–1.0 | 0.6 | Darkening multiplier overlay for the blurred smart background. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Resized, padded, and scaled output visual media. |

## Common Patterns
- **Vertical Reframe (Smart Side Fill):** Connect horizontal video input. Set aspect to `9:16`, resolution to `1080p`, fitMode to `contain`, and backgroundMode to `blurred`. This generates a vertical video with the main horizontal clip centered, padded above and below by a blurred copy of the video.
- **Widescreen Cinematic Crop:** Connect landscape video input. Set aspect to `21:9`, resolution to `1080p`, fitMode to `cover`, and anchorY to `center`. This crops the top and bottom of the video to create a wide cinematic look.
- **Manual Zoom-In Reframe:** Set fitMode to `manual`, zoom to `150`, and use the interactive viewport overlay to drag/offset the focus onto a subject.

## Limitations
- Custom dimensions are rounded to the nearest even number to ensure compatibility with video encoders/codecs.
- In manual mode, dragging the preview translates the offsets relative to the resolved target size.
- A 25-tap box blur is used in the WebGPU shader to approximate the smart fill background blur efficiently at runtime.
