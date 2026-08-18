---
name: Stereo Panning
nodeType: StereoPanning
summary: >
  Adjusts the left/right stereo balance (panning) of audio or video tracks.
  Supports panning values from -1 (full left) to 1 (full right).
triggers:
  - stereo panning
  - pan audio
  - audio balance
  - left right channel
  - stereo sound
  - audio spatialization
---

# Stereo Panning

## What It Does
Controls the stereo field distribution of an audio signal or the audio track embedded inside a video file. It balances the volume levels between the left and right speakers.

## When to Use
- **Sound Stage Positioning:** Pan background tracks, sound effects, or character dialogue to the left or right to match their on-screen visual positions.
- **Stereo Separation:** Distribute overlapping audio inputs across the stereo field to improve clarity and avoid mud in composited mixes.
- **Directional Audio:** Create spatial motion or directional sound effects.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The input media containing the audio channel to pan. |

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| pan | number | `-1` to `1` | `0` | Stereo panning amount. `-1` routes audio fully to the left, `1` fully to the right, and `0` is center. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The panned output media file (matching the input type). |

## Common Patterns
- **Dialogue Spatialization:** Connect a voiceover track and adjust `pan` to `-0.5` or `0.5` to make it sound like the speaker is standing slightly to one side.
- **Panning a Video Sound:** Pass video directly through the node to shift its audio track to one side without altering the visual frames.

## Limitations
- Only affects the audio channels of the input media; video visuals pass through completely untouched.
