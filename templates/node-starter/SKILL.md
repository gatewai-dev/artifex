---
name: Starter
nodeType: Starter
summary: Starter transformation node template for building custom Gatewai nodes with dynamic modulation.
triggers:
  - starter
  - node-starter
  - custom node
---

# Starter Node (`Starter`)

Starter transformation node template for building custom Gatewai nodes. Demonstrates metadata, server processing, WebGPU visual rendering, WebGPU audio compute DSP, and dynamic signal modulation.

## What It Does
Applies a configurable transformation to input visual media (Image, Video) or audio streams with support for dynamic parameter modulation from external signals (LFO, Math, Audio Analyzers).

## When to Use
- As a starter boilerplate for authoring new custom transformation nodes.
- When applying custom WebGPU visual shaders (color grading, distortion, spatial effects).
- When applying custom WebGPU compute audio DSP (filters, delays, modulations).

## Inputs
| Handle | Type | Required | Description |
|---|---|---|---|
| `Input` | Image, Video | Yes | Primary visual media stream to transform. |
| `Strength Signal` | Number, Signal | No | Optional dynamic signal or static number to modulate strength in real-time. |

## Config
| Field | Type | Range / Options | Default | Description |
|---|---|---|---|---|
| `strength` | number | 0.0 – 10.0 | 1.0 | Intensity of the transformation effect. |
| `mode` | string (enum) | `standard`, `invert`, `vivid` | `standard` | Processing algorithm or visual style mode. |
| `enabled` | boolean | `true` / `false` | `true` | Toggle effect on/off. |

## Output
| Handle | Type | Description |
|---|---|---|
| `Result` | Image, Video | Transformed visual media output stream. |

## Common Patterns
- **Basic Transformation:** `Import -> Starter (strength: 2.0, mode: vivid) -> Export`
- **Dynamic Signal Modulation:** `Signal (LFO) -> Starter (Strength Signal) -> Compositor`
- **Chained Post-Processing:** `Import -> Starter -> Blur -> Export`

## Example Workflow Spec
```json
{
  "name": "Starter Demo",
  "plugins": ["./node-starter"],
  "nodes": [
    { "id": "input_1", "type": "Import", "config": { "file": "./input.png" } },
    { "id": "effect_1", "type": "Starter", "config": { "strength": 2.0, "mode": "vivid" } },
    { "id": "export_1", "type": "Export", "config": { "file": "./output.png" } }
  ],
  "edges": [
    { "source": "input_1", "target": "effect_1" },
    { "source": "effect_1", "target": "export_1" }
  ]
}
```
