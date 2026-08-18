---
name: Audio Noise Gate
nodeType: NoiseGate
summary: >
  Mutes or attenuates low-volume background noise, hums, and hiss below a certain threshold.
  Uses a WebGPU compute shader state machine to model attack, hold, and release envelopes.
triggers:
  - noise gate
  - gate
  - audio noise gate
  - expander
  - background noise remover
  - hum reduction
  - silence audio
---

# Audio Noise Gate

## What It Does
Mutes or attenuates audio signals that fall below a specified volume threshold. It allows signals above the threshold to pass through unchanged (gate open) while attenuating or silencing signals below the threshold (gate closed). This helps eliminate quiet background noise, hiss, or hum during pauses in speech or music.

## When to Use
- **Vocal Clean-Up:** Remove room noise, breathing sounds, or microphone hum during pauses in voiceovers or dialogue.
- **Reducing Cross-Talk:** Silence leakage from other instruments or ambient noise in multi-track audio.
- **Dynamic Silence:** Ensure absolute silence during sections of a soundtrack that are intended to be quiet.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Audio, Video | ✅ | The source media containing the audio stream to clean. |
| Threshold Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating noise gate threshold level. |
| Attack Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating gate attack duration. |
| Hold Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating gate hold duration. |
| Release Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating gate release duration. |
| Floor Range Signal | Number, Signal | ❌ | Dynamic signal or static number handle modulating closed gate floor level. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| threshold | number | -120 to 0 | -40 | The volume level (dBFS) below which the gate begins to close. Bindable to Signal/Number. |
| attack | number | 0.0001 to 1.0 | 0.005 | Time in seconds to open (fade in) the gate when the signal exceeds the threshold. Bindable to Signal/Number. |
| hold | number | 0.001 to 5.0 | 0.05 | Time in seconds the gate stays fully open after the signal drops below the threshold. Bindable to Signal/Number. |
| release | number | 0.01 to 5.0 | 0.1 | Time in seconds to close (fade out) the gate after the hold period expires. Bindable to Signal/Number. |
| range | number | -120 to 0 | -80 | The volume level (dBFS) floor when the gate is closed. Bindable to Signal/Number. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Audio, Video | The audio or video track with background noise attenuated during quiet periods. |

## Common Patterns
- **Speech/Voice Cleaning:** `Voice Track → Audio Noise Gate (threshold: -35, attack: 0.003, hold: 0.1, release: 0.15, range: -60) → Output` (allows a natural -60dB room tone instead of harsh 100% silence).
- **Absolute Gate:** Set `range` to `-96` or less to apply a brick-wall mute (0 gain) when the gate is closed.

## Limitations
- Only processes active audio tracks.
- Uses a 10ms RMS window to calculate signal power to avoid gate chatter.
- Requires an active GPU context to run the WebGPU compute shader state machine.
- If the threshold is set too high, it may cut off the beginnings or ends of spoken words (known as clipping). Adjust `attack`, `hold`, and `release` to smooth out transitions.
