---
name: remove-background
description: "Removes the background from an image using the Bria AI background-removal models. Returns a PNG with transparency for the image."
metadata:
  nodeType: RemoveBackground
  triggers: "remove background, background removal, remove bg, transparent background, bria"
---

# Remove Background

## What It Does
Removes the background from an input image using Bria's background-removal model served via fal.ai. The output is a PNG asset with a transparent background.

## When to Use
- **Subject Isolation:** Strip the background from a portrait or product shot so it can be composited onto another scene.
- **Asset Preparation:** Generate transparent cut-outs for use in `Compositor`, overlays, or thumbnails.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Media | Image | yes | The source media to process (JPEG/PNG/WebP). |

## Config
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `model` | enum | `"fal-ai/bria/background/remove"` | The background-removal model. |

### `fal-ai/bria/background/remove` (Bria 2.0)
- Used automatically for image inputs.
- No additional configuration.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image | The background-removed media (transparent PNG). |

## Common Patterns
- **Subject Cut-out:** `Photo → Remove Background → Compositor`.

## Limitations & Pricing
| Model | Credits | Notes |
|-------|---------|-------|
| `fal-ai/bria/background/remove` (Image) | 5 | Accepts JPEG / PNG. High-quality subject isolation. |
