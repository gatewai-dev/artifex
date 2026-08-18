---
name: patch-heal
description: "Precision coordinate-offset clone stamping, texture transfer, and seamless gradient healing with procedural circular falloff or explicit mask inputs."
category: "Media"
---

# `PatchHeal` (Coordinate Healing & Clone Stamp)

The `PatchHeal` node copies pixels from a source coordinate offset $(dx, dy)$ relative to the destination area and composites them with adjustable opacity, feathering, independent source/target scaling, and gradient/luminance healing algorithms.

## Handles

- **Inputs**:
  - `Input` (`["Image", "SVG", "Video", "Lottie", "GIF"]`, required): Primary media to heal or clone onto.
  - `Mask` (`["Image", "SVG", "Video", "Lottie", "GIF"]`, optional): Optional raster/alpha mask defining the exact region to heal or stamp.
- **Outputs**:
  - `Result` (`["Image", "Video", "GIF"]`): The composited and healed media.

## Parameters

| Parameter | Type | Default | Range | Bindable | Description |
|:---|:---|:---|:---|:---|:---|
| `mode` | `enum` | `"SeamlessHeal"` | `"SeamlessHeal"`, `"Clone"`, `"TextureTransfer"` | No | Algorithm for blending the source patch into the destination. |
| `centerX` | `number` | `0.5` | `0.0` to `1.0` | Yes (Number / Signal) | Horizontal normalized center of the destination patch. |
| `centerY` | `number` | `0.5` | `0.0` to `1.0` | Yes (Number / Signal) | Vertical normalized center of the destination patch. |
| `offsetX` | `number` | `50` | `-4096` to `4096` px | Yes (Number / Signal) | Horizontal pixel offset from destination to sample source patch. |
| `offsetY` | `number` | `0` | `-4096` to `4096` px | Yes (Number / Signal) | Vertical pixel offset from destination to sample source patch. |
| `radius` | `number` | `25` | `1` to `500` px | Yes (Number / Signal) | Radius of destination circular brush in pixels. |
| `sourceRadius` | `number` | `25` | `1` to `500` px | No | Radius of source sample circular brush in pixels (can be sized independently). |
| `feather` | `number` | `50` | `0` to `100` % | Yes (Number / Signal) | Softness and falloff percentage at the outer perimeter of the patch. |
| `opacity` | `number` | `1.0` | `0.0` to `1.0` | Yes (Number / Signal) | Blending opacity multiplier for the stamped/healed region. |
| `patches` | `array` | `[]` | List of `PatchItem` | No | Multiple patch healing operations applied sequentially. |

## Healing Modes

1. **`SeamlessHeal` (Default)**:
   Preserves the destination's ambient illumination and low-frequency tonal gradients while seamlessly blending in the source patch's high-frequency texture details. Perfect for blemish removal, object cleanup, and texture repair without harsh seams.
2. **`Clone`**:
   Direct clone stamping of source pixels onto the destination with feathering and opacity control.
3. **`TextureTransfer`**:
   Extracts luminance and structural detail from the source coordinates and applies it over the destination's underlying chrominance/color tones.

## Recipes

### Blemish & Artifact Removal
```json
{
  "id": "heal-blemish",
  "type": "PatchHeal",
  "config": {
    "mode": "SeamlessHeal",
    "offsetX": 40,
    "offsetY": 15,
    "radius": 20,
    "feather": 60,
    "opacity": 1.0
  }
}
```

### Targeted Mask Healing
Connect a generated mask (e.g. from `Paint` or `ExtractObject`) to the `Mask` handle to heal an arbitrary shape with seamless gradient matching.
