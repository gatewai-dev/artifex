---
name: compressor
description: "Smooths out the dynamic range of audio and video voice/soundtracks, preventing clipping and distortion. Implemented using a WebGPU compute shader."
metadata:
  nodeType: Compressor
  triggers: "compressor, audio compressor, dynamics compressor, limiter, audio leveller, dynamic range compression, soft clipping, make-up gain"
---

# Audio Compressor

## What It Does
Smooths out the dynamic range of an audio or video soundtrack. It lowers the volume of loud sounds (above a defined threshold) and leaves quieter sounds unaffected, allowing the overall output to be boosted without clipping or distortion. It runs as a WebGPU compute shader.

## When to Use
- **Voice Leveling:** Smooth out voice recordings, podcasts, or dialogues where the speaker's volume fluctuates.
- **Clipping Prevention (Limiter):** Set a high ratio (e.g., 100) to act as a brick-wall limiter, preventing audio from distorting.
- **Punchier Audio:** Add presence and weight to sound effects, music tracks, or dialogue mixes.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The source media containing the audio stream to be compressed. |
| Threshold Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating the threshold level. |
| Ratio Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating the compression ratio. |
| Attack Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating attack time in seconds. |
| Release Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating release time in seconds. |
| Knee Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating soft-knee dB range. |
| Makeup Gain Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating makeup gain level. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| threshold | number | -60 to 0 | -24 | Level (dBFS) above which gain reduction begins. Bindable to Signal/Number. |
| ratio | number | 1 to 100 | 4 | Input-to-output gain ratio above threshold. Use high values (e.g., 100) for limiting. Bindable to Signal/Number. |
| attack | number | 0.0001 to 1.0 | 0.003 | Time in seconds to reach full gain reduction. Bindable to Signal/Number. |
| release | number | 0.01 to 5.0 | 0.25 | Time in seconds to recover gain after the signal level drops. Bindable to Signal/Number. |
| knee | number | 0 to 24 | 6 | Range in dB for the soft-knee transition curve around the threshold. Bindable to Signal/Number. |
| makeupGain | number | 0 to 24 | 0 | Gain in dBFS applied to the signal after compression. Bindable to Signal/Number. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The dynamically compressed audio or video track. |

## Common Patterns
- **Standard Voice Compressor:** `Voice Track → Audio Compressor (threshold: -18, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 3) → Output`
- **Brick-wall Limiter:** `Audio Master → Audio Compressor (threshold: -2, ratio: 100, attack: 0.0001, release: 0.05, makeupGain: 0) → Output`

## Limitations
- Only processes active audio channels.
- Compression is computed entirely via WebGPU compute shaders on the GPU, requiring an active GPU context.
- High compression ratios and makeup gain may amplify background noise (noise floor). Pair with a Noise Gate to prevent this.
- Soft-clipping is automatically applied at ±1.0 (with a tanh curve starting at ±0.9) to prevent digital distortion.
