---
name: delay
description: "Adds a repeating echo/delay effect to audio or video tracks. Supports standard channel-independent delays and stereo ping-pong cross-feedback. Implemented using a WebGPU compute shader ring buffer."
metadata:
  nodeType: Delay
  triggers: "delay, echo, audio delay, ping pong delay, feedback, wet dry mix, spatial audio"
---

# Delay / Echo

## What It Does
Adds a repeating echo effect to audio tracks. It stores incoming audio frames in a GPU-based ring buffer and mixes the delayed feedback signal back into the audio line at specified feedback and dry/wet levels.

## When to Use
- **Echo Effects:** Add standard spatial echo/repeating delays to vocal or musical segments.
- **Ping-Pong Stereo Widening:** Alternate echo feedback between the left and right channels to create a wide stereo field.
- **Wet/Dry Control:** Control how much of the original signal is preserved relative to the echo.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The source media containing the audio stream to apply the delay effect to. |
| Delay Time Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating delay time in seconds. |
| Feedback Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating delay feedback. |
| Wet Mix Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating wet mix level. |
| Dry Mix Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating dry mix level. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| delayTime | number | 0.001 to 5.0 | 0.25 | The delay duration in seconds before the echo is heard. Bindable to Signal/Number. |
| feedback | number | 0.0 to 0.95 | 0.4 | Amount of the delayed signal fed back into the delay ring buffer. Bindable to Signal/Number. |
| wet | number | 0.0 to 1.0 | 0.3 | Volume level of the delayed wet signal. Bindable to Signal/Number. |
| dry | number | 0.0 to 1.0 | 1.0 | Volume level of the original dry signal. Bindable to Signal/Number. |
| pingPong | boolean | true/false | false | Alternates the echo feedback loop between the left and right channels (requires a stereo input). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The media containing the delayed echo audio track. |

## Common Patterns
- **Stereo Ping-Pong Echo:** `Vocal Track → Delay / Echo (delayTime: 0.35, feedback: 0.5, wet: 0.4, pingPong: true) → Output`
- **Slapback Delay:** Set `delayTime` very low (e.g., 0.08) and `feedback` to 0 to create a quick single-echo slapback effect.

## Limitations
- Requires an active GPU context to run the WebGPU compute shader ring buffer.
- `pingPong` delay requires a stereo input stream (at least 2 channels). If the input is mono, it falls back to standard delay.
- Feedback is capped at 0.95 to prevent runaway feedback loops (infinite volume buildup).
