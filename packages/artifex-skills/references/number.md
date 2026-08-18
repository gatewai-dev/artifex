---
name: number
description: "Provides a numeric value input node on the canvas. Outputs a Number datatype that can be connected to input handles of other nodes accepting numeric values."
metadata:
  nodeType: Number
  triggers: "number, value, float, integer, numeric input, constant number, scale, degree, offset"
---

# Number

## What It Does
Provides a constant numeric input node on the canvas. It outputs a single `Number` value, which can be dynamically adjusted via the UI (using a drag-to-slide or direct input field) and passed into other node properties.

## When to Use
- **Dynamic Parameters:** Control values like dimensions, scale, opacity, rotation, speed, frequency, or volume of other nodes from a single source.
- **Shared Constants:** Feed the same numeric value into multiple downstream nodes to synchronize their properties.
- **Modular Adjustments:** Avoid hardcoding parameters inside complex configurations by exposing them as canvas-level inputs.

## Inputs
This node has no input handles.

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| value | number | Any numeric value | 0 | The numeric value output by the node. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Number | The configured numeric value. |

## Common Patterns
- **Shared Speed Control:** `Number (Result) → videoA (speed) & videoB (speed)` to synchronize playback speed of two videos.
- **Opacity Controller:** `Number (Result) → Compositor (Layer Opacity)` to easily slide a layer's transparency on the canvas.

## Limitations
- Only outputs a single scalar number.
