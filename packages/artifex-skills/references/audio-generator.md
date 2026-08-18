---
name: audio-generator
description: "Generates audio, sound effects, or speech using the AI audio generator model. Supports reference images or reference audio clips, speed, volume, and pitch controls."
metadata:
  nodeType: AudioGenerator
  triggers: "audio generator, generate audio, text to audio, ai audio, seed audio"
---

# Audio Generator

## What It Does
Generates high-quality speech, dialog, sound effects, or general audio clips in MP3 format using advanced generative AI audio models (`bytedance/seed-audio-1.0`). It supports conditioning the generation on up to 3 optional reference audio clips, or a reference image.

## When to Use
- **Audio Cloned Synthesis:** Clone and guide speech using up to 3 short reference audio clips.
- **Image-to-Audio:** Guide or describe the generation with a reference image to match the visual context (cannot be combined with audio references).
- **Sound Effects (SFX) / Ambient:** Create specific late-night settings, suspense sounds, or narrative audio sequences.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | Description of the audio to synthesize (at most 2028 characters). |
| Reference Media | Image, Audio | | Optional reference image (max 1) OR reference audio files (max 3, each up to 30s). Adding an audio reference handle disables adding image reference handles and vice-versa. |

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| model | string | `bytedance/seed-audio-1.0` | `bytedance/seed-audio-1.0` | The audio model to use. |
| sample_rate | string | `8000`, `16000`, `24000`, `32000`, `44100`, `48000` | `24000` | Output sample rate in Hz. |
| speed | float | `0.5` - `2.0` | `1.0` | Speech/audio playback speed multiplier. |
| volume | float | `0.5` - `2.0` | `1.0` | Output volume multiplier. |
| pitch | integer | `-12` - `12` | `0` | Voice pitch shift in semitones. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio | The final generated audio file (MP3 format). |

## Common Patterns
- **Visual Dubbing:** `Image (Reference) + Text (Prompt) → Audio Generator (Result)`
- **Audio Cloning:** `Audio (Reference Clip) + Text (Prompt) → Audio Generator (Result)`

## Limitations
- Input text prompt must be at most 2028 characters.
- Input reference audio clips must be shorter than 30 seconds.
- Image reference and audio references cannot be combined (adding one type of handle disables adding the other).
- Audio Generator is a terminal node and uses a flat credit pricing (50 credits).
