---
name: video-to-music
description: "Generates a high-quality music track/soundtrack from a source video and optional text prompt using AI."
metadata:
  nodeType: VideoToMusic
  triggers: "video to music, video soundtrack, generate music from video, score video, background music generator"
---

# Video to Music

## What It Does
Generates music and audio tracks matching a source video. You can optionally provide a descriptive text prompt to steer the musical style (e.g. genre, tempo, instruments). If the prompt is omitted, the AI will automatically generate a fitting soundtrack based on the video context.

## When to Use
- **Video Scoring:** Automatically generate synchronized music tracks for silent videos, animations, or cinematic shots.
- **Content Creation:** Produce royalty-free background soundtracks for social media clips, ads, or gameplay highlights.
- **Thematic Soundtracks:** Steer the music style using prompts to match different thematic requirements for the same video.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Video  | Video|  ✅      | The source video to generate the music soundtrack for. |
| Prompt | Text |          | Optional text prompt steering the musical style (e.g., genre, mood, tempo). |

## Output
| Handle | Type  | Description |
|--------|-------|-------------|
| Result | Audio | The final AI-generated music track. |

## Common Patterns
- **Automated Score:** `Video Input → Video to Music (Result)`
- **Prompted Score:** `Video Input + Text (Prompt) → Video to Music (Result)`

## Limitations
- Generates exactly 1 music sample per execution.
- The prompt is limited to 2000 characters.
- Requires valid video format inputs.
