---
name: procedural-vfx
description: "Generates procedural particles and visual effects (smoke, fire, rain, snow, dust, sparks, lightning, magic, lens flares, embers, energy beams) from scratch as an image or video layer."
metadata:
  nodeType: ProceduralVFX
  triggers: "procedural vfx, particle generator, smoke, fire, rain, snow, dust, sparks, lightning, magic effect, lens flare, embers, energy beam"
---

# Procedural VFX

## What It Does
Synthesizes stylized or realistic visual effects entirely in a WebGPU fragment shader with no input
media required. It is a **generator** node (like Canvas Generator or Noise Generator) that emits a
single `Image` or `Video` output that can be composited, keyed, or exported further down the
pipeline.

## When to Use
- **Ambient Atmosphere:** smoke, dust, fog-like puffs behind or over a subject.
- **Energy & Action:** fire, sparks, embers, lightning, magic, energy beams for dynamic scenes.
- **Weather & Motion:** rain and snow falling over a background, driven by signals for intensity.
- **Cinematic Optics:** lens flares to sell highlights and light sources.

## Inputs
None. This is a source/generator node.

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| effectType | string (enum) | Smoke, Fire, Rain, Sparks, Snow, Dust, Lightning, Magic, LensFlare, Embers, EnergyBeam | "Smoke" | The visual effect to synthesize. |
| outputType | string (enum) | Image, Video | "Video" | Image renders a static frame; Video animates over time. |
| width | number | 16–4096 | 1080 | Output width in pixels. |
| height | number | 16–4096 | 1080 | Output height in pixels. |
| density | number | 0.0–1.0 | 0.6 | Particle amount / effect coverage. Bindable to Number/Signal. |
| scale | number | 0.001–10.0 | 0.01 | Spatial frequency / particle size. Bindable. |
| speed | number | 0.0–10.0 | 1.0 | Animation speed (Video only). Bindable. |
| intensity | number | 0.0–1.0 | 0.8 | Brightness / alpha gain. Bindable. |
| seed | number | 0–1000000 | 1234 | Deterministic random shuffle. Bindable. |
| colorStart | string (hex) | – | "#ffffff" | Base / inner color for tinted effects. |
| colorEnd | string (hex) | – | "#ff5500" | Secondary / outer color for tinted effects. |
| durationMs | number | 100–100000 | 5000 | Video duration (Video only). |
| fps | number | 1–120 | 30 | Video frame rate (Video only). |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video | The generated procedural effect layer. |

## Common Patterns
- **Animated Atmosphere:** `Procedural VFX (effectType: Smoke, outputType: Video) → Compositor → Export`
- **Rain Over a Shot:** bound `Intensity`/`Speed` signals to make precipitation ramp up during a storm.
- **Energy Beams / Bolts:** `Procedural VFX (effectType: EnergyBeam) → Additive blend → Export`
- **Fire + Spark Overlay:** layer Fire under Sparks, key/tint via the color ramp.

## Limitations
- Effects are procedural approximations; they are not photorealistic simulation.
- Colour ramps (`colorStart`/`colorEnd`) are most meaningful for the emissive effects
  (Fire, Sparks, Lightning, Magic, LensFlare, Embers, EnergyBeam); dusty/drizzly/snowy effects use
  them only as a soft tint.
- Mask / depth-map / motion-path control is designed-for but not yet wired in v1 (see
  `spec/procedural-vfx-node.md` §7).
