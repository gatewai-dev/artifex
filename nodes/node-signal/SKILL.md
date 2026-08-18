---
name: Procedural Signal
nodeType: ProceduralSignal
summary: >
  Generates custom mathematical/procedural signals using WGSL (WebGPU Shading Language) equations.
  Supports configurable amplitude, frequency, phase, offsets, custom uniform parameters, and multiple preview modes.
triggers:
  - procedural signal
  - math signal
  - wave generator
  - sine wave
  - cosine wave
  - wgsl function
  - oscillator
  - modulation signal
  - noise function
---

# Procedural Signal

## What It Does
Generates real-time math-based signals calculated on the GPU via WGSL. The node allows users to write custom formula code and define input parameters (uniforms) to create wave patterns, noise, envelopes, or custom functions.

## When to Use
- **Audio Synthesis:** Generate raw sound waveforms (e.g. sine, triangle, square, custom equations) to serve as audio inputs or modulators.
- **Visual Effects Modulation:** Drive properties of video renderers (like scale, offset, speed, or color parameters) using procedural wave oscillators.
- **Time/Space Mapping:** Map functions based on coordinate inputs (`x`, `y`, `z`) and elapsed time (`t`) to generate procedural 2D/3D patterns.

## Inputs
This node has no input handles.

## Config
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| amplitude | number | Any number | `1` | Amplitude scale multiplier of the generated signal. |
| frequency | number | Any number | `1` | Base frequency of the signal. |
| phase | number | Any number | `0` | Phase shift offset. |
| offset | number | Any number | `0` | Constant vertical offset added to the final signal. |
| amplitudeMin | number | Any number | `-1` | Minimum amplitude limit for the envelope. |
| amplitudeMax | number | Any number | `1` | Maximum amplitude limit for the envelope. |
| spatialScale | number | Any number | `1` | Spatial frequency scaling factor. |
| spatialSpeed | number | Any number | `1` | Speed of spatial signal variations over time. |
| fmAmplitude | number | Any number | `1` | Amplitude of frequency modulation. |
| fmFrequency | number | Any number | `0.5` | Frequency of frequency modulation. |
| gateEnabled | boolean | `true`, `false` | `false` | Whether the frame gate is active. |
| gateStartFrame | number | Any integer >= 0 | `0` | Start frame of the active window. |
| gateEndFrame | number | Any integer >= 0 | `100` | End frame of the active window. |
| gateIdleValue | number | Any number | `0.0` | Output value of the signal when outside the gate range. |
| envelopeUseFrame | boolean | `true`, `false` | `true` | Whether to calculate envelope progress relative to the Gate's Start/End frames instead of total clip duration. |
| baseEnabled | boolean | `true`, `false` | `true` | Whether the base wave is enabled. |
| baseType | string | `sine`, `triangle`, `sawtooth`, `square`, `constant`, `noise_smooth`, `noise_white`, `pulse`, `bounce`, `staircase`, `custom` | `sine` | Base oscillator waveform type. Set to `custom` to use `fnBody`. |
| fmEnabled | boolean | `true`, `false` | `false` | Whether frequency modulation is active. |
| envelopeEnabled | boolean | `true`, `false` | `false` | Whether the easing time envelope is active. |
| envelopeFamily | string | Easing family name (e.g. `sine`, `quad`, `elastic`, `bounce`, etc.) | `sine` | Easing curve math family. |
| envelopeMode | string | `in`, `out`, `in_out` | `in_out` | Easing acceleration direction. |
| envelopePattern | string | `ramp_up`, `ramp_down`, `bell`, `loop` | `ramp_up` | Easing envelope pattern. |
| envelopeCycles | number | Any integer >= 1 | `2` | Easing cycle count in loop pattern. |
| fnBody | string | WGSL Code | (Sine Wave body) | The WGSL function body returning a float (used when `baseType` is `custom`). |
| fnOutputType | string | `f32` | `f32` | Return type of the WGSL function. |
| fnParams | array | Array of FnParam objects | `[]` | User-defined custom uniform inputs. |
| previewMode | string | `pattern`, `cartesian`, `3d` | `cartesian` | Mode for visualizing the signal wave in the editor. |

### Built-in WGSL Bindings
Inside `fnBody`, the following variables are implicitly in scope:
- `t` (`f32`): Time elapsed in seconds.
- `x`, `y`, `z` (`f32`): Normalized spatial coordinates in the range `[0, 1]`.
- `i` (`u32`): Linear element index.
- `n` (`u32`): Total element count.
- `frame` (`u32`): Current frame number.
- `PI`, `TAU`, `E` (`f32`): Common mathematical constants.
- `u`: Struct containing the config uniforms (e.g. `u.amplitude`, `u.frequency`).

### Custom Uniform Parameter Schema (`fnParams`)
- **`name`** (string): Valid WGSL identifier.
- **`type`** (string): `f32`, `i32`, `u32`, `vec2f`, `vec3f`, or `vec4f`.
- **`defaultValue`** (number): Initial component value.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Signal | The procedural WGSL signal output. |

## Common Patterns
- **Sine Modulator:** Use the default config to output a sine wave:
  `Procedural Signal (Result) → Modulation input of visual or audio node`
- **Time Envelope:** Combine time variables and custom envelopes to create a fade-in or decay signal. If both the Frame Gate and Duration Envelope are active, the `envelopeUseFrame` option can be enabled to calculate envelope progress relative to the gate's start and end frames.
- **Frame Gate (Time Window):** Apply an effect (e.g. blur strength or sepia) only within a specific frame range by activating the Frame Gate and connecting the signal output to the effect's strength/modulation handle.

## Limitations
- Code body must be written in valid WGSL syntax. Invalid shaders will fail compile-time validation.
- Output is processed on the GPU; downstream nodes must support `Signal` bindings in WebGPU.
