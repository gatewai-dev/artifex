---
name: ChannelMerger
nodeType: ChannelMerger
summary: >
  Combines up to 4 single-channel grayscale streams into a composite color image or video across RGBA, HSLA, CMYK, or LAB color models.
triggers:
  - channel merger
  - merge channels
  - combine rgb channels
  - combine hsl channels
  - combine cmyk channels
  - combine lab channels
  - color reconstruction
  - channel recomposition
---

# ChannelMerger

## What It Does
The `ChannelMerger` node accepts up to 4 separate grayscale image streams and recombines them into a full-color composite image or video according to the selected color space:

- **RGBA**:
  - `Channel 1`: Red ($R \in [0, 1]$)
  - `Channel 2`: Green ($G \in [0, 1]$)
  - `Channel 3`: Blue ($B \in [0, 1]$)
  - `Channel 4` (Optional): Alpha ($A \in [0, 1]$, defaults to `defaultChannel4` or 1.0)
- **HSLA**:
  - `Channel 1`: Hue ($H \in [0, 1]$)
  - `Channel 2`: Saturation ($S \in [0, 1]$)
  - `Channel 3`: Lightness ($L \in [0, 1]$)
  - `Channel 4` (Optional): Alpha ($A \in [0, 1]$, defaults to `defaultChannel4` or 1.0)
- **CMYK**:
  - `Channel 1`: Cyan ($C \in [0, 1]$)
  - `Channel 2`: Magenta ($M \in [0, 1]$)
  - `Channel 3`: Yellow ($Y \in [0, 1]$)
  - `Channel 4` (Optional): Black / Key ($K \in [0, 1]$, defaults to 0.0)
- **LAB** (CIE $L^*a^*b^*$, D65 illuminant):
  - `Channel 1`: Lightness ($L^* \in [0, 1]$)
  - `Channel 2`: Green-Red axis ($a^* \in [0, 1]$, neutral = 0.5)
  - `Channel 3`: Blue-Yellow axis ($b^* \in [0, 1]$, neutral = 0.5)
  - `Channel 4` (Optional): Alpha ($A \in [0, 1]$, defaults to 1.0)

## When to Use
- **Recombining Processed Channels**: Recombine channels after running individual spatial filters (blur, sharpen, curves, levels) on separated channels.
- **False Color & Spectral Mapping**: Feed infrared, depth, or thermal grayscale maps into Red/Green/Blue channels to create false-color visualizations.
- **Custom Matte Injection**: Inject an external alpha matte directly into the 4th channel of an RGB or LAB recombination stream.
- **RGB Channel Swapping / Effects**: Swap Red and Blue channels for chromatic aberration or infrared film simulation.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Channel 1 | Image, SVG, Video, Lottie, GIF | ✅ | Red (RGBA), Hue (HSLA), Cyan (CMYK), Lightness $L^*$ (LAB) |
| Channel 2 | Image, SVG, Video, Lottie, GIF | ✅ | Green (RGBA), Saturation (HSLA), Magenta (CMYK), $a^*$ (LAB) |
| Channel 3 | Image, SVG, Video, Lottie, GIF | ✅ | Blue (RGBA), Lightness (HSLA), Yellow (CMYK), $b^*$ (LAB) |
| Channel 4 | Image, SVG, Video, Lottie, GIF | ❌ | Alpha (RGBA/HSLA/LAB), Black $K$ (CMYK). Optional. |

## Config
| Field | Type | Options | Default | Description |
|-------|------|---------|---------|-------------|
| colorSpace | enum | `RGBA`, `HSLA`, `CMYK`, `LAB` | `RGBA` | Color model used for channel recombination |
| defaultChannel4 | number | `0.0` to `1.0` | `1.0` | Fallback value used when Channel 4 is unconnected |

## Outputs
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Recombined composite color visual media output |
