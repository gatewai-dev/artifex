---
name: text-to-speech
description: "Synthesizes human-like spoken audio from a text input prompt using the Gemini TTS model via Fal AI. Supports customizable voice profiles, multiple languages, and stylistic instructions."
metadata:
  nodeType: TextToSpeech
  triggers: "text to speech, speech synthesis, tts, voice generator, voiceover, speak text, read aloud, ai voice"
---

# Text to Speech

## What It Does
Converts written text prompt inputs into natural-sounding spoken audio files. It connects to the Gemini TTS generation engine via Fal AI, allowing you to choose between various vocal tones, speeds, and languages.

## When to Use
- **Voiceovers:** Generate narration or voiceovers for presentations, advertisements, and storytelling videos. It is important to generate TTS first and then the video section underneath since output audio duration is non-deterministic. Then read the duration metadata and plan accordingly.

- **Dynamic Dialogue:** Read out dynamically merged text or prompt sentences for video characters.
- **Accessibility:** Create audio versions of text content.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | The text content to be spoken by the AI voice. |
| Style Instructions | Text | ❌ | Optional style and delivery instructions prepended to the prompt (e.g., 'Speak warmly and slowly'). |

## Config
The configuration parameters are:

### Gemini Provider Options
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| provider | string | `gemini` | `gemini` | Gemini TTS provider. |
| voice | string | Astronomically-themed names (e.g. `Kore`, `Achird`, `Charon`, `Zephyr`, `Aoede`, etc.) | `Kore` | Vocal character preset for single-speaker output. |
| languageCode | string | `auto` or standard language names (e.g., `English (US)`, `Spanish (Spain)`, `Turkish (Turkey)`, etc.) | `auto` | Multilingual synthesis language. Omitted or `auto` for auto-detection. |
| temperature | float | `0.0` - `2.0` | `1.0` | Controls randomness/expressiveness of output. |
| outputFormat | string | `mp3`, `wav`, `ogg_opus` | `mp3` | Format of output file. |
| speakerConfig | array | Array of SpeakerConfig | `[]` | Multi-speaker setup. Each config specifies: `speaker` (alias, optional, defaults to 'Speaker 1' / 'Speaker 2' if empty) and `voice`. In single-speaker mode, the alias input is hidden and omitted in the API call. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio | The generated speech audio file. |

## Common Patterns
- **Video Narrator:** `Text (Prompt narration) → Text to Speech (Result) → Compositor (layered with Video asset)`
- **Dynamic Dialogue:** `Text Merger (Merged Text) → Text to Speech (Result)`

## Limitations
- Generational token credits cost is dynamic, priced at $0.15 (15 credits) per 1000 characters with a minimum cost of 5 credits.
