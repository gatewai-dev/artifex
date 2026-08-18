---
name: Text
nodeType: Text
summary: >
  Provides a text block input node on the canvas. Outputs a Text string that can be connected
  to prompt, caption, lyric, or instructions inputs of downstream nodes.
triggers:
  - text
  - string
  - prompt
  - input text
  - text input
  - description
  - words
---

# Text

## What It Does
Provides a constant text block input node on the canvas. It outputs a `Text` string entered by the user in the config interface.

## When to Use
- **AI Prompts:** Connect text prompts to generators (e.g. SvgGen, MusicGenerator, VideoGen, TextToSpeech).
- **Video Overlays / Subtitles:** Provide custom text overlays to the Compositor layer updates.
- **Documenting Inputs:** Centrally coordinate prompts or texts feeding multiple downstream nodes.

## Inputs
This node has no input handles.

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| content | string | Any text string | `""` | The text characters output by the node. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Text | The configured text string. |

## Common Patterns
- **Prompting AI:** `Text (Result) → Video Generator (Prompt)` to configure generation prompts.
- **Text Layers:** `Text (Result) → Compositor (dynamic text input layer)` to display typography overlay.

## Limitations
- Only outputs plain, unformatted text strings.
