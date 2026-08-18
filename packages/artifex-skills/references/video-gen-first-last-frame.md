---
name: video-gen-first-last-frame
description: "Generates AI videos that interpolate smoothly between a required first-frame image and a last-frame image. Ideal for creating controlled transitions, loops, morphs, or animated storytelling clips."
metadata:
  nodeType: VideoGenFirstLastFrame
  triggers: "first last frame video, image to video transition, frame interpolation, video interpolation, seedance transition, start end frame video"
---

# First to Last Frame Video

## What It Does
Generates an AI video transition that begins exactly at a specified "First Frame" image and smoothly evolves to end exactly on a "Last Frame" image. The transition's movement and style are guided by a text prompt and optional negative prompt.

## When to Use
- **Controlled Transitions:** Create seamless transitions between two separate images or graphics.
- **Perfect Video Loops:** Feed the same image into both the First Frame and Last Frame inputs to generate a perfectly looping video clip.
- **Before/After Reveals:** Morph or animate a product mockup, drawing, or photograph from its initial state to its final state.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | Description of the action, motion, interpolation path, or styling elements. |
| First Frame | Image | ✅ | The starting image of the video (Frame 0). |
| Last Frame | Image | | The ending image of the video (Final Frame, optional). |

## Config
The configuration fields depend on the selected **`model`**:

### 1. Seedance 2.0 Image-to-Video (`bytedance/seedance-2.0/image-to-video`)
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| falAspectRatio | string | `auto`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` | `auto` | Aspect ratio of the output video. |
| falResolution | string | `480p`, `720p`, `1080p`, `4k` | `720p` | Output video resolution. |
| falDurationSeconds | string | `4` to `15` | `8` | Duration of the generated clip in seconds. |
| falGenerateAudio | boolean | `true`, `false` | `true` | When true, generates accompanying audio sync. |
| falBitrateMode | string | `standard`, `high` | `standard` | Output encoding quality/bitrate mode. |
| falSeed | number | Any integer | undefined | Seed for reproducible output. |

### 1b. Seedance 2.5 Image-to-Video (`bytedance/seedance-2.5/image-to-video`)
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| falAspectRatio | string | `auto` | `auto` | Always `auto` for image-to-video. |
| falResolution | string | `480p`, `720p` | `720p` | Output video resolution. |
| falDurationSeconds | string | `4` to `30` | `10` | Duration of the generated clip in seconds. |
| falGenerateAudio | boolean | `true`, `false` | `true` | When true, generates accompanying audio sync. |
| falSeed | number | Any integer | undefined | Seed for reproducible output. |

### 2. MiniMax Image-to-Video (`minimax/h3/image-to-video`)
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| minimaxResolution | string | `768P`, `2K` | `2K` | Output video resolution. |
| minimaxDurationSeconds | string | `5` to `15` | `5` | Duration of the generated clip in seconds. |

## Prompting Guidelines

For best results on Seedance 2.0:
- **Write Like a Director:** Frame your prompt as a sequence of motion instructions rather than a list of static keyword tags. Describe the camera movement, path of action, and speed.
- **Reference First and Last Frames:** Use the prompt to guide how the start state (First Frame) animates and shifts towards the target state (Last Frame).
- **ControlPace:** Rely on natural timing and velocity descriptors (e.g. `"slowly morphs"`, `"pans smoothly from left to right"`, `"fast energetic transition"`).
- **Aspect Ratio & Composition:** Describe actions that fit the layout of the source images to avoid jarring perspective shifts.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Video | The generated MP4 video transition. |

## Common Patterns
- **Seamless Loop:**
  ```
  Image (background) ─┬→ First Frame 
                      └→ Last Frame ──→ VideoGenFirstLastFrame (Result)
  ```
  Generates a moving video clip that seamlessly loops back to its starting state.

## Limitations
- Performance and credit costs scale based on selected resolution, aspect ratio, and duration settings.
- The model must fit both the first and last frame context, which can sometimes produce creative warping or morphing visual paths.
