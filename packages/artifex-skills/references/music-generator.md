---
name: music-generator
description: "Generates high-quality music/audio tracks from a text prompt and optional lyrics using AI music models. Supports settings for instrumental music, sample rates, and bitrates (fixed to MP3 format)."
metadata:
  nodeType: MusicGenerator
  triggers: "music generator, generate music, text to music, ai music, audio generation, song creator, soundtrack"
---

# Music Generator

## What It Does
Generates music and audio tracks from a descriptive text prompt and optional lyrics using advanced AI music generation models. It outputs a high-quality audio file with customizable sample rates and bitrates (fixed to MP3 format).

## When to Use
- **Background Music:** Generate unique background tracks for video advertisements, social media posts, or podcasts.
- **Custom Soundtracks:** Create full vocal songs or instrumental tracks matching specific genres, moods, or tempos.
- **Vocal-Free Loops:** Create instrumental-only beats or ambient soundscapes for presentations or applications.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | Description of the music style, genre, mood, tempo, and instruments. |
| Lyrics | Text | | Optional song lyrics to be synthesized in the music. |

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| model | string | `fal-ai/minimax-music/v2.6` | `fal-ai/minimax-music/v2.6` | The music model to use. |
| is_instrumental | boolean | `true`, `false` | `false` | When true, generates vocal-free instrumental music. |
| lyrics_optimizer | boolean | `true`, `false` | `true` | When true and lyrics is empty, auto-generates lyrics from the prompt. |
| sample_rate | string | `16000`, `24000`, `32000`, `44100` | `44100` | Sample rate of the generated audio (Hz). |
| bitrate | string | `32000`, `64000`, `128000`, `256000` | `256000` | Bitrate of the generated audio (bps). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio | The final AI-generated audio/music file. |

## Common Patterns
- **Video Soundtrack:** `Text (Prompt) → Music Generator (Result) → Compositor (combined with background Video)`
- **Lyrics-Driven Music:** `Text (Prompt) + Text (Lyrics) → Music Generator (Result)`

## Limitations
- The `Prompt` input is restricted to a maximum length of 2000 characters.
- Generates a fixed audio segment length per request based on the model's limitations.
- Music generation is a terminal node and uses a fixed credit pricing (15 credits).
