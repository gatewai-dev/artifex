---
name: depth-map
description: "Generates a depth map from an input image using the Marigold depth estimation model. Returns a grayscale depth map image."
metadata:
  nodeType: DepthMap
  triggers: "depth map, depth estimation, marigold depth, image depth"
---

# Depth Map

## What It Does
Generates a depth map from an input image using the Marigold depth estimation model served via fal.ai. The output is a grayscale image where pixel intensity represents the relative distance of objects in the scene.

## When to Use
- **3D Effect Generation:** Create depth information to be used for displacement maps, 3D meshes, or parallax effects.
- **Focal Effects:** Use the depth map as a lens blur mask.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Image | Image | yes | The source image to process (JPEG/PNG/WebP). |

## Config
The config parameters are hidden from the user interface and set to optimal defaults.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `num_inference_steps` | integer | 10 | Number of denoising steps. |
| `ensemble_size` | integer | 10 | Number of predictions to average over. |
| `processing_res` | integer | 0 | Maximum processing resolution (0 = input image size). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image | The relative depth map (grayscale PNG). |

## Common Patterns
- **Displacement Mapping:** `Image → Depth Map → Displacement Map`.

## Limitations & Pricing
| Model | Credits | Notes |
|-------|---------|-------|
| `fal-ai/imageutils/marigold-depth` | 5 | Requires 5 fixed token pricing. |
