---
name: extract-lut
description: "Extracts a 3D Color Lookup Table (.cube LUT) by comparing a source image against a graded reference image. Supports deterministic RBF fitting and statistical Reinhard LAB color matching strategies."
metadata:
  nodeType: ExtractLUT
  triggers: "extract lut, match color, color transfer, generate lut, grade matching, lookup table creator, rbf interpolation, lab color space"
---

# Extract LUT

## What It Does
Extracts a 3D Color Lookup Table (LUT) of size 33x33x33 by comparing a source frame against a graded reference frame. It computes the color mapping difference and compiles it into a reusable `.cube` LUT file. It runs on the GPU using WebGPU.

## When to Use
- **Grade Matching:** Copy the exact color grade or filter applied to a video/image back into a reusable LUT.
- **Color Palette Transfer:** Match the general color mood, lighting, and palette of a movie scene or reference image onto your own media.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Source Frame | Image | ✅ | The ungraded, original input image frame. |
| Graded Frame | Image | ✅ | The reference image containing the target color grading or styling. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| strategy | string (enum) | `deterministic`, `statistical` | `"deterministic"` | The algorithm used to align and extract color mappings. |
| samplePoints | number | 10 to 500 | 150 | Target number of pixel sample points. Decoupled from grid rendering resolution, selected from a fixed 32x32 pool using a deterministic stratified shuffle to ensure cache stability. |

### Extraction Strategies:
1. **`deterministic`**:
   - **How it works:** Renders both frames at a fixed 32x32 resolution. It pre-triggers asset loads and defers the extraction pass until all nested input media assets at the current timestamp are fully loaded and cached on the GPU to avoid microtask yields (which invalidate active WebGPU render passes). It builds a unique color pool using a 20x20x20 spatial occupancy grid, shuffles it deterministically based on the content fingerprint, and selects `samplePoints` colors. If there are fewer than 8 unique colors, or if the solver is singular/unstable, it automatically falls back to the statistical strategy. It fits a stabilized **Radial Basis Function (RBF)** interpolation system on the CPU (using LU decomposition, adaptive shape parameters, and normalized regularization). It then evaluates the RBF on the GPU with distance-based extrapolation protection (fading RBF weights and blending to identity for regions far from samples) and applies a 3D box-filter smoothing pass to reduce oscillations near LUT edges.
   - **When to use:** Best when comparing the **exact same frame** (same scene, same content) but with different color grading applied. Regularization guarantees numerical stability even when the image color palette is coplanar or colinear.
2. **`statistical`**:
   - **How it works:** Converts both frames into the **Reinhard LAB** color space, computes their channel-wise means and standard deviations, maps the source statistics onto the target, and evaluates the color transfer on the GPU.
   - **When to use:** Best when the source and graded reference frames are **different images** (e.g., matching your footage to a movie screenshot).

## Output
| Handle | Type | Description |
|--------|------|-------------|
| LUT | LUT | The generated 3D LUT color mapping resource. |

## Common Patterns
- **Duplicate Frame Grading Extraction:** Connect a raw frame to `Source` and the Lightroom/Photoshop graded version of the same frame to `Graded`. Set strategy to `deterministic`. Feed the resulting `LUT` output into `Apply LUT` to grade your entire video clip.

## Limitations & Validation
- **Dimension Matching Error:** For the `deterministic` strategy, if the source and graded reference images have different resolutions, an error is raised since it works on pixel-for-pixel matched frames.
