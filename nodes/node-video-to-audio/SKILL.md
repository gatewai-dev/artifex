---
name: Video to Audio
nodeType: VideoToAudio
summary: >
  Converts a video track to an audio track.
  On the browser frontend, it hides the visual frames, and on the backend renderer, it decodes and processes only the audio track.
triggers:
  - video to audio
  - convert video to audio
  - extract audio from video
  - video sound track
  - hide video frames
---

# Video to Audio

## What It Does
Converts a `Video` input stream into an `Audio` output stream. It strips visual video frames and metadata (such as dimensions and frame rate) while preserving and routing the underlying audio track, allowing you to use video files as pure audio references.

## When to Use
- **Audio References:** When you want to use a video file's soundtrack as an audio reference input for an AI Audio Generator or other audio-processing nodes.
- **Background Music:** Stripping visuals from a video clip to play only its audio track in a composition layer.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Video | ✅ | The input video clip containing the audio track. |

## Config
This node does not require any additional configuration parameters.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio | The converted audio stream from the input video (visual dimensions and FPS metadata are stripped). |

## Common Patterns
- **Audio Generator Reference:** Connect a video to the Video to Audio node, then connect the output of the Video to Audio node to the reference audio input of the Audio Generator node.
