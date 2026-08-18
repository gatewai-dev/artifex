---
name: recorder
description: "Records media directly from the web browser, supporting screen capture, camera feed, and microphone audio. Outputs separate Video and Audio handles for downstream compositing."
metadata:
  nodeType: Recorder
  triggers: "recorder, record screen, capture camera, microphone recording, webcam, audio recording, screen capture"
---

# Recorder

## What It Does
Captures and records local media inputs from the browser. It enables recording of the user's screen or specific application window, camera/webcam stream, and microphone input, producing separate high-quality video and audio files.

## When to Use
- **Video Presentations:** Record a presentation slide deck (screen) along with a talking-head overlay (camera) and narration (mic).
- **Voiceovers:** Record speech from a microphone directly on the canvas to use as voiceovers or prompts.
- **Tutorials / Demos:** Record software walk-throughs or live demonstrations.

## Inputs
This node has no input handles.

## Config
This node has no configurable fields in its schema. Interaction (start, pause, stop, source selection) is managed via the custom UI recorder controls.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Screen | Video | The captured screen recording video file. |
| Camera | Video | The captured webcam/camera recording video file. |
| Mic | Audio | The captured microphone recording audio file. |

## Common Patterns
- **Picture-in-Picture Presentation:**
  ```
  Recorder (Screen) ──┐
  Recorder (Camera) ──┼→ Compositor → Result
  Recorder (Mic) ────┘
  ```
  Composes screen capture and camera view side-by-side or overlaid, using mic audio as the main soundtrack.

## Limitations
- Relies on browser-level MediaDevices API permissions. The user must grant screen, camera, and microphone access.
- Output quality and performance are dependent on the user's local system specs and browser capabilities.
