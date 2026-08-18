---
name: parametric-eq
description: "Boosts or cuts specific frequency bands using a WebGPU-accelerated biquad IIR filter. Supports peak, shelf, pass, and notch filter configurations."
metadata:
  nodeType: ParametricEq
  triggers: "parametric eq, eq, equalizer, filter, lowpass, highpass, notch filter, audio filter, biquad filter, bass boost, treble boost"
---

# Parametric EQ

## What It Does
Applies frequency equalization to an audio stream using a biquad IIR filter. You can configure the filter band by choosing its type (e.g. low-pass, peaking, high-shelf), frequency, gain, and Q factor. It is processed in real time using WebGPU compute shaders. To chain multiple EQ bands, simply connect multiple Parametric EQ nodes in series.

## When to Use
- **High-Pass Filtering (Rumble/Wind Cut):** Apply a high-pass filter at 80Hz to eliminate low-frequency rumble, mic handling noise, or wind hum from dialogue tracks.
- **Notch Filtering (Hum Removal):** Apply a notch filter at 50Hz or 60Hz to target and remove AC electrical hum.
- **Bass/Treble Boosts:** Use low/high-shelf bands to add warmth (bass boost) or clarity (treble air) to a recording.
- **Vocal Enhancements:** Cut muddiness around 300Hz and boost presence around 2kHz-4kHz using peaking filters.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The source media containing the audio stream to equalize. |
| Frequency Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating filter frequency in Hz. |
| Gain Boost / Cut Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating filter gain in dB. |
| Q (Resonance) Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating filter Q bandwidth factor. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| type | string | `lowShelf`, `highShelf`, `peak`, `lowPass`, `highPass`, `notch` | `peak` | The type of biquad filter. |
| frequency | number | 20 to 20000 | 1000 | Center/cutoff frequency in Hz. Bindable to Signal/Number. |
| gain | number | -24 to +24 | 0 | Gain adjustment in dB. *Unused for lowPass, highPass, and notch.* Bindable to Signal/Number. |
| q | number | 0.01 to 10.0 | 1.0 | Resonance or bandwidth width of the filter. Bindable to Signal/Number. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The media containing the equalized audio stream. |

## Common Patterns
- **Cascading Filters:** Chain two or more Parametric EQ nodes in sequence (e.g., `Input -> EQ (highPass, 80Hz) -> EQ (peak, 3000Hz) -> Output`) to apply complex EQ curves.
- **AC Hum Removal Notch:** Configure a single EQ node as a `notch` filter at 60Hz with a high Q (e.g., 5.0) for a narrow cut.

## Limitations
- Filter computations are done entirely in WebGPU compute shaders on the GPU.
- Too much gain boost can cause clipping. Pair with the Audio Compressor node if necessary.
