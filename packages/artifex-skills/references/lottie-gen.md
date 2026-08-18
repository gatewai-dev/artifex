---
name: lottie-gen
description: "Generates or edits interactive vector animations (Lottie format) based on a text prompt using an LLM. Configurable canvas size, duration, frame rate, and model selection."
metadata:
  nodeType: LottieGen
  triggers: "lottie, lottie generator, generate animation, vector animation, after effects json, motion graphic"
---

# Lottie Generator

## What It Does
Generates interactive, lightweight vector animations in the Lottie JSON format based on a text prompt using advanced Large Language Models (LLMs). It can define the animation canvas size, duration, and frame rate.

## When to Use
- **Dynamic Icons:** Generate animated icons (e.g. checkmarks, loading wheels, user avatars, menu transitions) for UI/UX applications.
- **Motion Graphics / Illustrations:** Create complex web animations, stickers, and vector illustration loops.
- **Lightweight Assets:** Export high-quality vector animations that have negligible file sizes compared to traditional GIF/Video formats.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | A detailed description of the vector animation you want to generate (e.g., "A loading circle spinner transitioning into a green checkmark"). |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| model | string (enum) | `gpt-5.6-terra`, `gpt-5.6-sol`, `google/gemini-3.7-flash`, | `"gpt-5.6-terra"` | The LLM used to write/structure the output Lottie JSON schema. |
| width | number | 1–4096 | 512 | Canvas width in pixels. |
| height | number | 1–4096 | 512 | Canvas height in pixels. |
| fps | number | 12–60 | 24 | Frames per second of the animation. |
| durationSeconds | number | 0.5–30 | 2 | Total duration of the animation in seconds. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Lottie | The generated Lottie JSON animation asset. |

## Common Patterns
- **Animated UI Feedback Loop:** `Prompt (e.g. "bounce success bell icon") → Lottie Generator (duration: 1.5s) → Compositor -> [Other Nodes] -> Export`
- **Compositing Lottie:** Connect the output of the Lottie Generator into a `Compositor` node as a layer overlaying a background video.

## Limitations
- Generates pure code-based Lottie JSON; complex textures, raster images, and external asset dependencies might not be supported.
- Render complexity is limited by the model's token limits and understanding of the Lottie JSON spec.
- Generation time scales with the requested complexity, duration, and selected LLM model.
