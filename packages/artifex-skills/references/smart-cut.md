---
name: smart-cut
description: "Automatically cuts video or audio to keep only sections where speech is detected."
metadata:
  nodeType: SmartCut
  triggers: "smart cut, silence removal, trim silence, speech detection"
---

# Smart Cut Node

The Smart Cut Node is a terminal node that accepts a video or audio input, transcribes it using AI (specifically Whisper via Fal AI) to identify when the user is speaking, and cuts the media to keep only the sections that contain spoken speech.

## Features

- **Precise Silence Trimming**: Detects spoken words with absolute precision.
- **Configurable Padding**: Add left and right padding (in milliseconds) to each speaking segment to ensure words are not clipped.
- **Segment Merging**: Merge adjacent segments if the silence between them is shorter than the configured threshold (preventing rapid jumps).
- **Minimum Duration**: Discard very short segments (e.g. breathing, clicks) that fall below the minimum speaking duration.

## Inputs

| Handle | DataType | Required | Description |
|---|---|---|---|
| Media | Video, Audio | Yes | The video or audio media containing speech to cut. |

## Outputs

| Handle | DataType | Description |
|---|---|---|
| Result | Video, Audio | The resulting cut video or audio. |

## Configuration

- **Left Padding (ms)**: Extra padding added before each speech segment.
- **Right Padding (ms)**: Extra padding added after each speech segment.
- **Merge Threshold (ms)**: Merge adjacent speech segments if the silence between them is smaller than this threshold.
- **Min Duration (ms)**: Discard speech segments shorter than this threshold.
- **Precision Level**: Select between `word` (highly precise) and `segment` (rough) precision.
