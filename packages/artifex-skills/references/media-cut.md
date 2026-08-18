---
name: media-cut
description: "Cuts, trims, or stitches video, audio, Lottie, or GIF files by specifying one or more start and end times in seconds. Supports extracting multiple non-contiguous segments and joining them together."
metadata:
  nodeType: MediaCut
  triggers: "cut, trim, split, splice, slice, crop timeline, video trim, audio trim, subclip"
---

# Media Cut

## What It Does
Trims, cuts, or stitches input media files (Video, Audio, Lottie, GIF). By defining timeline segments (start and end times in seconds), it extracts designated ranges. If multiple segments are defined, it joins them sequentially.

## When to Use
- **Trimming Media:** Remove dead space, intro segments, or outro sequences from video or audio clips.
- **Highlight Reels:** Extract and stitch multiple distinct key moments from a long video file into a single condensed highlight clip.
- **Stitching Audio:** Cut out unwanted silences or sections in a voice recording or podcast track.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Media | Video, Audio, Lottie, GIF | ✅ | The media track to trim or cut |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| segments | array | Array of Segment objects | `[]` | List of target segments to retain. If empty, the original media is passed through. |

### Segment Schema
Each segment in the `segments` array specifies:
- **`startSec`** (number, range ≥0, required): The starting point of the segment in seconds.
- **`endSec`** (number, range ≥0, optional): The ending point of the segment in seconds. If omitted, the segment will run until the end of the input media track.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Video, Audio, Lottie, GIF | The trimmed/stitched output media file. |

## Common Patterns
- **Simple Trimming:** Set `segments: [{ startSec: 5.0, endSec: 25.0 }]` to keep only the 20-second portion of a clip from second 5 to 25.
- **Remove Middle Segment:** To cut out a middle section (e.g. from second 10 to 15) in a 30-second clip, define two segments: `[{ startSec: 0, endSec: 10 }, { startSec: 15, endSec: 30 }]`.

## Limitations
- Cut boundaries must be within the duration limits of the source media file.
- The output format and type match the source media type (e.g. cutting a `Video` outputs a `Video`).
