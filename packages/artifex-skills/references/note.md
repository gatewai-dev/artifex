---
name: note
description: "A visual sticky note utility for the node canvas. Allows editors and builders to document workflows, add comments, leave instructions, and customize note appearance."
metadata:
  nodeType: Note
  triggers: "sticky note, note, documentation, comment, text note, annotation, label"
---

# Sticky Note

## What It Does
Provides a non-functional sticky note on the canvas workspace. It is used exclusively for annotation, documentation, commenting, or organization, helping users and builders explain how a composition or workspace is structured.

## When to Use
- **Workflow Explanations:** Explain the purpose of a group of nodes or inputs.
- **Instructions for Collaborators:** Leave notes on how to configure certain parameters or run the workflow.
- **Organization:** Label different sections of a large canvas workspace.

## Inputs
This node has no input handles.

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| content | string | Any text / markdown | undefined | The text content displayed inside the sticky note. |
| backgroundColor | string | Hex CSS Color | `#ffff88` | Background color of the sticky note. |
| textColor | string | Hex CSS Color | `#000000` | Text color of the sticky note. |
| fontSize | number | ≥1 | 14 | Font size of the note text in pixels. |

## Output
This node has no output handles.

## Common Patterns
- **Canvas Documentation:** Place a Sticky Note adjacent to complex nodes (like a Procedural Signal or Compositor) to describe how to tweak parameters or explain the signal function logic.

## Limitations
- This is a utility node; it has no inputs, outputs, and does not execute any media processing or generation logic.
