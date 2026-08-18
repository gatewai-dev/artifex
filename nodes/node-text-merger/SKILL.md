---
name: Text Merger
nodeType: TextMerger
summary: >
  Concatenates multiple text inputs into a single combined text output using a customizable join separator.
  Uses variable inputs to support merging any number of text handles.
triggers:
  - text merger
  - merge text
  - concat text
  - concatenate
  - join string
  - string merger
  - append text
---

# Text Merger

## What It Does
Merges several separate input strings into one contiguous text file or string. It uses a custom delimiter character (like a space, comma, or newline) to join them.

## When to Use
- **Prompt Compiling:** Combine a static base prompt with dynamic user parameters (e.g. `[Base Scene Prompt] + [Dynamic Style Prompt]`).
- **Dynamic Subtitles:** Assemble sentences or word lists into unified texts.
- **Batching Strings:** Feed grouped text items to downstream nodes as a single payload.

## Inputs
This node uses **Variable Inputs**. By default, it exposes two input handles:
- `Text` (Text)
- `Text 2` (Text)

You can add additional custom text input handles dynamically.

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| join | string | Any character/separator | `" "` (Space) | The string separator inserted between adjacent text pieces when merging. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Merged Text | Text | The final merged string. |

## Common Patterns
- **Dynamic Scene Prompt:**
  ```
  Text ("A beautiful view of") ─┐
  Text ("Paris at sunset") ──────┼→ Text Merger (join: " ") → Result → VideoGen (Prompt)
  ```

## Limitations
- Non-connected optional inputs are ignored during the concatenation step.
