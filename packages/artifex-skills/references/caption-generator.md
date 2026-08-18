---
name: caption-generator
description: "Generates text captions (subtitles/transcriptions) for audio and video media using AI (specifically Whisper via Fal AI). Output is generated in SRT format. Supports customized prompts, language selection, batch sizing, and segment-level or word-level transcription chunks."
metadata:
  nodeType: CaptionGenerator
  triggers: "caption, transcription, subtitle, speech to text, srt, transcribe, whisper, audio transcription"
---

# Caption Generator

## What It Does
Generates text transcriptions (subtitles) for input audio or video tracks using AI (specifically the Whisper model hosted via Fal AI). It converts the voice track into an SRT subtitle file.

## When to Use
- **Subtitling Video Content:** Generate subtitles for videos, lectures, or social media posts to increase accessibility.
- **Audio Transcription:** Transcribe podcast recordings, voice memos, interviews, or meetings to text.
- **Searchable Transcripts:** Create subtitle index files (`.srt`) to allow searching and navigating video/audio tracks.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The audio or video media containing speech to transcribe. |
| Prompt | Text | ❌ | Optional prompt/context text to guide the transcription model (e.g., proper nouns, acronyms, or specific vocabulary). |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| model | string (enum) | `fal-ai/whisper` | `"fal-ai/whisper"` | The AI model used for transcription. |
| task | string | `"transcribe"` | `"transcribe"` | The transcription task to perform. |
| language | string (enum) | Two-letter ISO language codes (e.g., `en`, `es`, `fr`, `tr`, `zh`, etc.) | `"auto"` | Language of the audio. If not provided, the model will attempt to auto-detect the language. |
| chunk_level | string (enum) | `segment`, `word` | `"segment"` | The granularity of transcription timestamps (by segment or word). |
| batch_size | number | 1–256 | 32 | Batch size for processing audio segments in parallel. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Caption | Caption | The generated subtitles in SRT (SubRip Subtitle) format. |

## Common Patterns
- **Video to Caption Pipeline:** `Video Input → Caption Generator → Subtitle Overlaid Video / Export`
- **Audio to SRT Exporter:** `Audio Input → Caption Generator (Language: en, chunk_level: word) → Export (SRT)`

## Limitations
- Only supports audio and video input streams with valid voice tracks.
- The default model is `fal-ai/whisper`.
- Requires an active connection to Fal AI provider at runtime.
- Large files may take longer to process, billed proportionally to the duration of the media.
