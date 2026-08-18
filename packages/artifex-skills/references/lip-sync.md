---
name: lip-sync
description: "Animates a static avatar image into a talking head video synced to a target audio speech track. Powered by AI models (Creatify Aurora or ByteDance OmniHuman via Fal AI)."
metadata:
  nodeType: LipSync
  triggers: "lip sync, talking avatar, talking head, animate portrait, mouth movement, video generation, omnihuman, face animation"
---

# Lip Sync

## What It Does
Generates a video of a talking avatar by animating a static face portrait image in sync with a spoken audio track. Powered by advanced audio-to-video generation models (like **Creatify Aurora** or **ByteDance OmniHuman**) hosted on Fal AI.

## When to Use
- **AI Avatars:** Create talking head videos for advertisements, explainer clips, lectures, or digital hosts from a single portrait photo.
- **Dubbing / Voice replacement:** Re-animate an avatar's mouth to sync with a newly translated or voiced audio track.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Avatar Image | Image | ✅ | The static portrait/face image to animate. |
| Audio | Audio | ✅ | The driving spoken voiceover track. |
| Prompt | Text | ❌ | Optional style prompt to guide the avatar's visual expression and style (e.g. "smiling, confident expression"). *Note: This is not a text script.* |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| model | string (enum) | `fal-ai/creatify/aurora`, `fal-ai/bytedance/omnihuman/v1.5` | `"fal-ai/creatify/aurora"` | The AI model used to generate the lip sync. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Video | The final generated talking-head video file. |

## Common Patterns
- **AI Presenter Pipeline:** `Portrait Photo + Text-To-Speech Audio → Lip Sync (Aurora) → Result Video`

## Limitations & Pricing
- **Pricing:** Generation costs **20 credits per second** of the driving audio file's duration (`durationSeconds * 20` credits).
- Requires a high-quality, front-facing portrait image with clear facial features for optimal results.
- The input audio must contain clear spoken voice. Non-speech sounds, music, or heavy background noise will lead to distorted mouth movements.
