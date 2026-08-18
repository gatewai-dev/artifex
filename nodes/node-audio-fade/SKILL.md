---
name: Fade In / Fade Out
nodeType: fade
summary: >
  Applies configurable volume fade-in (from silence) and fade-out (to silence) envelopes to audio and video.
  Supports linear, exponential, and s-curve transitions. Implemented using WebGPU.
triggers:
  - fade
  - fade in
  - fade out
  - audio fade
  - crossfade
  - volume envelope
  - audio transition
---

# Fade In / Fade Out

## What It Does
Applies a gain envelope to the audio track of a video or audio file. It smoothly transitions the volume from silent to full level at the beginning of the file (Fade In) and from full level to silent at the end (Fade Out). It is fully compatible with compositor nested layers, correctly applying the fade relative to the start of the local clip segment.

## When to Use
- **Smooth Audio Starts/Ends:** Prevent abrupt audio starts or cutoffs in video or music tracks.
- **Crossfade Preparation:** Apply fade-in and fade-out curves to clips before overlapping them.
- **Atmospheric Transitions:** Use exponential or s-curve shapes to create more natural-sounding acoustic transitions.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The source media containing the audio stream to fade. |
| Fade In Duration Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating fade-in duration. |
| Fade Out Duration Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating fade-out duration. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| fadeInDuration | number | 0.0 to 60.0 | 0.0 | Duration of the fade-in envelope in seconds. Bindable to Signal/Number. |
| fadeOutDuration | number | 0.0 to 60.0 | 0.0 | Duration of the fade-out envelope in seconds. Bindable to Signal/Number. |
| fadeInCurve | string (enum) | `linear`, `exponential`, `scurve` | `"linear"` | The shape of the fade-in volume transition. |
| fadeOutCurve | string (enum) | `linear`, `exponential`, `scurve` | `"linear"` | The shape of the fade-out volume transition. |

### Fade Curve Shapes:
- **`linear`**: A straight line transition. Gain increases/decreases proportionally with time (`p`).
- **`exponential`**: A curved transition (`p * p`). Volume changes slower at lower levels and faster at higher levels.
- **`scurve`**: Smooth transition curve (`p * p * (3.0 - 2.0 * p)`). Eases in at the start and eases out at the end.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The media containing the faded audio track. |

## Common Patterns
- **Standard Intro/Outro Fade:** `Audio Input → Fade In / Fade Out (fadeInDuration: 2.0, fadeOutDuration: 3.0, fadeInCurve: scurve, fadeOutCurve: exponential) → Output`

## Limitations
- Clamps durations dynamically: if the sum of `fadeInDuration` and `fadeOutDuration` is greater than the total audio clip duration, each fade duration is capped to half of the clip's duration to prevent overlaps.
- Requires an active GPU context to run the WebGPU compute shader.
