---
name: import
description: "Allows uploading external media and data files to the canvas workflow. Serves as the starting node for feeding assets into other nodes."
metadata:
  nodeType: Import
  triggers: "import, upload, file upload, source file, add media, choose file, select asset"
---

# Import

## What It Does
Acts as the starting point for a canvas workflow. It allows users to upload local media files (such as videos, images, audios including M4A, and subtitles) or reference pre-existing asset IDs, outputting the media as a structured virtual media object that downstream nodes can read, transform, or composition.

## When to Use
- **Workflow Inputs:** Always use this to bring in your raw assets (like camera footage, music/audio files including M4A, PNG logos, Lottie animation JSONs, or `.cube` LUTs) to begin a visual or audio rendering chain.

## Inputs
This node does not have input handles as it represents the source upload mechanism.

## Config
- **file**: (String, optional) The relative or absolute path to a local media file. This is used by the CLI to import the file and dynamically populate the node's result at runtime.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Image, Video, SVG, Caption, Lottie, LUT, GIF | The uploaded or referenced file asset. |

## Common Patterns
- **Standard Video Pipeline:** `Import (Video file) → Media Cut / Compositor / Filter Nodes → Export`
- **Subtitled Compositing:**
  - `Import A (Video)`
  - `Import B (SRT/VTT Caption file)`
  - Both fed into a `Compositor` to overlay subtitles on top of the video frames.

## Limitations
- Supported media and container formats are limited by the browser's local rendering capability or the server's encoding capabilities.
- Files must be uploaded to storage (like Cloudflare R2) before they can be resolved by downstream nodes.
