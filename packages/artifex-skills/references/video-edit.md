---
name: video-edit
description: "Edits an existing video using AI instruction-based prompting. Supports Wan 2.7 (style transfers, object replacements, aspect ratio adjustments) and Gemini Omni Flash (simple instruction edits)."
metadata:
  nodeType: VideoEdit
  triggers: "edit video, ai edit video, wan video edit, video prompt edit, style transfer video, gemini edit video"
---

# AI Edit Video

## What It Does
Edits an existing video using AI instructions. It takes an input video and a descriptive text prompt, then processes them through the selected model to generate a modified video asset matching the instructions.

## When to Use
- **Video Style Transfer:** Restyle an existing video (e.g. "turn this video into a claymation animation" or "make it look like a pencil sketch").
- **Object Replacement/Modification:** Modify elements in a scene (e.g. "change the dog into a cat" or "make the person wear a red jacket").
- **Atmospheric Changes:** Change background settings or time of day (e.g. "change the background to a snowy mountain peak at sunset").
- **Simple Edits:** Use Gemini Omni Flash for fast, instruction-based edits with simple prompts.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Video | Video | ✅ | The original source video to edit. *Must not exceed 10 seconds in duration.* |
| Prompt | Text | ✅ | Text instructions specifying the edits or styling to apply. |

## Config

### 1. Wan 2.7 (`fal-ai/wan/v2.7/edit-video`)
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| wanAspectRatio | string (enum) | `16:9`, `9:16`, `1:1`, `4:3`, `3:4`, `original` | `original` | Target aspect ratio of the output video. |
| wanResolution | string (enum) | `720p`, `1080p` | `"1080p"` | Output video resolution. |
| wanDurationSeconds | string (enum) | `0` to `10` | `"0"` | Target duration in seconds. Set to `0` to match input video duration. |
| wanAudioSetting | string (enum) | `auto`, `origin` | `"auto"` | How to handle the audio track. |
| wanSeed | number | 0 to 2147483647 | undefined | Random seed for deterministic generation. |

### 2. Gemini Omni Flash (`google/gemini-omni-flash/edit`)
No additional config fields. Uses only the prompt and video input.
> Simple prompts work best. Add "Keep everything else the same." to preserve the rest of the scene.

## Prompting Guidelines

### Wan 2.7
Write prompts as **explicit, actionable commands** rather than static scene descriptions.

- **Use Imperative Commands:** Start prompts with direct verbs (e.g. `"change"`, `"convert"`, `"replace"`, `"add"`, `"remove"`).
  - *Poor:* `"a watercolor painting of a dog"`
  - *Good:* `"convert the entire scene into a vibrant watercolor painting with visible brushstrokes"`
- **Target Specific Attributes:** Describe clearly what to change and what to keep the same.
- **Avoid Subjective Adjectives:** Specify physical properties like lighting, textures, or mediums instead.

### Gemini Omni Flash
- Keep prompts short and direct: `"Make this video anime. Keep everything else the same."`
- Voice editing is not supported.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Video | The final generated/edited video file. |

## Common Patterns
- **Video Stylization:** `Video Input + Text Prompt ("anime style") → AI Edit Video → Result`
- **Quick Edit:** `Video Input + Short Prompt → AI Edit Video (Gemini) → Result`

## Limitations & Pricing
- **Duration Limit:** The input video duration must not exceed **10 seconds**.
- **Wan 2.7 Pricing:** 20 credits per second (minimum 9 seconds = 180 credits).
- **Gemini Omni Flash Pricing:** Flat 10 credits per edit.
