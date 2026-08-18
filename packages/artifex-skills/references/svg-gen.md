---
name: svg-gen
description: "Generates scalable vector graphics (SVG) using text-to-vector models. Ideal for creating scalable logos, vector icons, patterns, and custom illustrations."
metadata:
  nodeType: SvgGen
  triggers: "svg generator, generate svg, vector graphics, ai svg, vector image, illustration, logo generator, recraft"
---

# SVG Generator

## What It Does
Generates SVG vector files using text-to-vector models. Takes a text prompt and produces a downloadable, scalable SVG with optional color preferences, background color, and custom aspect ratio.

## When to Use
- **Vector Assets:** Generate icons, logos, silhouettes, and vector graphics that scale infinitely without pixelation.
- **Custom Compositions:** Render vector designs and feed them into the Compositor node to layer over videos or images.
- **Brand Assets:** Create consistent vector illustrations with preferred brand colors.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | Text description of the vector graphic to generate. |

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| model | string | `fal-ai/recraft/v4.1/text-to-vector`, `fal-ai/recraft/v4.1/pro/text-to-vector` | `fal-ai/recraft/v4.1/text-to-vector` | The Recraft model used for generation. Pro variant produces higher quality outputs. |
| imageSize | enum / object | `square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`, or custom `{ width, height }` | `square_hd` | Aspect ratio or custom dimensions (64–2048 px). |
| colors | string[] | Array of hex color strings | `[]` | Array of preferred colors for the generated vector. |
| backgroundColor | string | Hex color or empty | (none) | Optional background color for the generated SVG. |
| enableSafetyChecker | boolean | `true`, `false` | `true` | Enable safety moderation. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | SVG | The generated SVG vector file. |

## Common Patterns
- **SVG Generation:** `Text (Prompt) → SVG Generator (Result) → Compositor (Overlay)`
- **Brand-colored graphics:** Set `colors` to your brand palette, describe the illustration, and get on-brand vectors.

## Pricing
| Model | Credits |
|-------|---------|
| `fal-ai/recraft/v4.1/text-to-vector` | 10 |
| `fal-ai/recraft/v4.1/pro/text-to-vector` | 30 |
