---
name: Caption Editor
nodeType: CaptionEditor
summary: >
  Provides a manual caption editor on the canvas. Stores SRT formatted text in its config and outputs a Caption format for subtitle tracks.
triggers:
  - captions
  - subtitles
  - srt
  - create captions
  - caption editor
  - subtitle creator
---

# Caption Editor

## What It Does
Provides a caption/subtitle input node on the canvas. It outputs a `Caption` track that represents standard subtitle cue data formatted in SubRip (SRT) format.

## When to Use
- **Manual Subtitles:** Write subtitle tracks directly in SRT format on the canvas.
- **Video Overlays:** Connect the output caption handle to a Compositor layer to draw open captions directly on video clips.

## Inputs
This node has no input handles.

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| content | string | Valid SRT subtitle string | `""` | The SRT formatted subtitle tracks. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Caption | Caption | Subtitles object carrying the SRT captions track inline. |

## Common Patterns
- **Open Captions:** `Caption Editor (Caption) → Compositor (Input)` to overlay subtitle lines on videos.

## Limitations
- Input must follow standard SRT formatting guidelines (cue indices, timestamps, and lines).
