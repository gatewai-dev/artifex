---
nodeType: Starter
name: Starter Node
description: "Starter transformation node template"
triggers:
  - "starter"
  - "node-starter"
---

# Starter Node (`Starter`)

Starter transformation node template for building custom Gatewai nodes.

## Parameters
- `strength` (number, 0-10, default 1): Effect intensity.
- `enabled` (boolean, default true): Toggle effect on/off.

## Handles
- **Inputs**: `Input` (`Image`, `Video`) - required.
- **Outputs**: `Result` (`Image`, `Video`).

## Example Workflow Spec
```json
{
  "name": "Starter Demo",
  "plugins": ["./node-starter"],
  "nodes": [
    { "id": "input_1", "type": "Import", "config": { "file": "./input.png" } },
    { "id": "effect_1", "type": "Starter", "config": { "strength": 2 } },
    { "id": "export_1", "type": "Export", "config": { "file": "./output.png" } }
  ],
  "edges": [
    { "source": "input_1", "target": "effect_1" },
    { "source": "effect_1", "target": "export_1" }
  ]
}
```
