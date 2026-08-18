---
name: Reverb
nodeType: Reverb
summary: >
  Adds room ambience, acoustic space, and reverberation to audio tracks.
  Implements the standard algorithmic Freeverb model using a cascade of comb and allpass filters in a WebGPU compute shader.
triggers:
  - reverb
  - audio reverb
  - freeverb
  - room simulation
  - ambience
  - wet dry mix
  - stereo width
  - echo decay
---

# Reverb

## What It Does
Adds a sense of space and acoustic ambience (reverberation) to audio. It simulates sound reflections bouncing off walls in a virtual room using the industry-standard **Freeverb** algorithm. The filter network consists of 8 comb filters running in parallel, fed into 4 allpass filters in series.

## When to Use
- **Space Simulation:** Make dry vocals or musical instruments sound like they were recorded in a small room, large hall, or spacious cathedral.
- **Stereo Widening:** Increase the spatial separation and width of mono or stereo sources using the width control.
- **Atmospheric Tail:** Create long, smooth decaying reverb tails for background soundscapes or transitions.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The source media containing the audio track to reverberate. |
| Room Size Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating room decay size. |
| Damping Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating high-frequency absorption damping. |
| Wet Mix Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating wet reverb level. |
| Dry Mix Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating dry signal level. |
| Stereo Width Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating stereo width spread. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| roomSize | number | 0.0 to 0.98 | 0.5 | Size of the virtual room (reverb decay time). Bindable to Signal/Number. |
| damping | number | 0.0 to 1.0 | 0.5 | High-frequency absorption (damping of walls). Bindable to Signal/Number. |
| wet | number | 0.0 to 1.0 | 0.3 | Mix volume of the wet (reverberated) signal. Bindable to Signal/Number. |
| dry | number | 0.0 to 1.0 | 1.0 | Mix volume of the original dry signal. Bindable to Signal/Number. |
| width | number | 0.0 to 1.0 | 1.0 | Stereo spread width of the reverb tail. Bindable to Signal/Number. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The media containing the reverberated audio track. |

## Common Patterns
- **Large Hall Reverb:** `Vocals → Reverb (roomSize: 0.85, damping: 0.3, wet: 0.4, dry: 1.0, width: 1.0) → Output`
- **Subtle Room Ambience:** `Voice → Reverb (roomSize: 0.3, damping: 0.7, wet: 0.15, dry: 1.0, width: 0.5) → Output`

## Limitations
- Only processes active audio channels.
- Runs entirely in WebGPU compute shaders on the GPU.
- For stereo signals, the algorithm runs 24 filters in parallel (12 per channel, with right channel delay lengths offset by 23 samples to prevent phase correlation and increase stereo width).
- High `roomSize` and `wet` settings can easily muddy the mix. Combine with the Parametric EQ node to cut low-end reverb frequencies if necessary.
