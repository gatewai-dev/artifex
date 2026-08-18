---
name: upscaler
description: "Upscales and enhances image or video assets using Fal.ai SeedVR models. Automatically routes to the image or video model based on the connected input type. Supports factor-based scaling (1× – 4×) and fixed resolution targets (720p, 1080p, 1440p, 2160p)."
metadata:
  nodeType: Upscaler
  triggers: "upscale image, upscale video, enhance resolution, super resolution, increase quality, 4k upscale, ai upscaler, seedvr upscale"
---

# AI Upscaler

## What It Does
Increases the resolution and visual quality of an image or video using Fal.ai SeedVR AI models (`fal-ai/seedvr/upscale/image` and `fal-ai/seedvr/upscale/video`). The node automatically detects whether the input is an image or video and routes to the correct model.

## When to Use
- **Image Super-Resolution:** Enlarge a low-resolution image while recovering fine details.
- **Video Upscaling:** Increase the resolution of a short video clip (max 15 seconds).
- **Quality Enhancement:** Improve visual fidelity of any image or video before exporting or compositing.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image \| Video | ✅ | The source media to upscale. |

## Config

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| upscaleMode | `"factor"` \| `"target"` | `"factor"` | Scaling strategy. `factor` multiplies dimensions; `target` hits a preset resolution. |
| upscaleFactor | number (1.0 – 4.0) | `2.0` | Multiplier for width and height (Factor mode only). |
| targetResolution | `720p` \| `1080p` \| `1440p` \| `2160p` | `"1080p"` | Target output resolution (Target mode only). |
| noiseScale | number (0.0 – 1.0) | `0.1` | Controls the amount of detail synthesis noise during upscaling. |
| outputFormat | `"png"` \| `"jpg"` \| `"webp"` | `"jpg"` | Output image format. Ignored for video inputs. |
| seed | integer (optional) | — | Seed for deterministic output. Leave empty for random. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image \| Video | The upscaled, high-resolution media asset. |

## Pricing
Pricing is calculated from the **output** (upscaled) resolution:

- **Image:** `⌈ (upscaledWidth × upscaledHeight) / 10,000,000 ⌉` tokens (minimum 1 token)
- **Video:** `⌈ (upscaledWidth × upscaledHeight × frames) / 10,000,000 ⌉` tokens

## Limitations
- Upscale factor is capped at **4×** to prevent API timeout errors.
