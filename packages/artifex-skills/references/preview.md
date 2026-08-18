---
name: preview
description: "A utility node that displays a real-time visualization of any connected media, text, or signal input. Helps debug intermediary workflow states without modifying assets."
metadata:
  nodeType: Preview
  triggers: "preview, inspect, view output, debugger, monitor, visualizer, watch"
---

# Preview

## What It Does
Acts as an inspector or monitoring node in a canvas workflow. It accepts any data type (Video, Image, Text, Audio, SVG, GIF, Lottie, or Signal) and renders a visual preview of it directly in the editor UI. It has no output handles, as its sole purpose is to serve as a diagnostic viewport.

## When to Use
- **Debugging Workflows:** Place a preview node downstream of an effect or generator node (like an audio noise gate, image generator, or text translator) to verify the results of the operation before connecting it to final compositor or export pipelines.
- **Waveform Inspection:** Monitor dynamic signal outputs (like beat detectors or LFO modulators) in a visual waveform graph to fine-tune their parameters.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Video, Image, Text, Audio, SVG, GIF, Lottie, Signal | ✅ | The data stream or media asset to preview. |

## Config
This node does not require any configuration settings.

## Output
This node does not have output handles, as it is used exclusively for visual inspector debugging.

## Common Patterns
- **Intermediate Inspection:**
  `Import (Video) → [Input] Crop → [Result] → [Input] Preview`
  This lets you inspect the cropped boundaries of the video directly before sending it to a Compositor.

## Limitations
- It does not modify or pass through data; it is an end-point viewer.
- Preview rendering is done entirely in the local browser context and does not incur any token/pricing costs.
