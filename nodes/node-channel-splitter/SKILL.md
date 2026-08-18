---
name: ChannelSplitter
nodeType: ChannelSplitter
summary: >
  Decomposes an image or video stream into 4 separate single-channel grayscale outputs across RGBA, HSLA, CMYK, or LAB color models.
triggers:
  - channel splitter
  - split channels
  - extract rgb channels
  - extract hsl channels
  - extract cmyk channels
  - extract lab channels
  - separate color channels
  - color decomposition
---

# ChannelSplitter

## What It Does
The `ChannelSplitter` node decomposes visual media (Image, SVG, Video, Lottie, GIF) into four distinct single-channel grayscale streams according to the selected color space:

- **RGBA**:
  - `Channel 1`: Red ($R \in [0, 1]$)
  - `Channel 2`: Green ($G \in [0, 1]$)
  - `Channel 3`: Blue ($B \in [0, 1]$)
  - `Channel 4`: Alpha ($A \in [0, 1]$)
- **HSLA**:
  - `Channel 1`: Hue ($H \in [0, 1]$, mapped from $0^\circ$ to $360^\circ$)
  - `Channel 2`: Saturation ($S \in [0, 1]$)
  - `Channel 3`: Lightness ($L \in [0, 1]$)
  - `Channel 4`: Alpha ($A \in [0, 1]$)
- **CMYK**:
  - `Channel 1`: Cyan ($C \in [0, 1]$)
  - `Channel 2`: Magenta ($M \in [0, 1]$)
  - `Channel 3`: Yellow ($Y \in [0, 1]$)
  - `Channel 4`: Black / Key ($K \in [0, 1]$)
- **LAB** (CIE $L^*a^*b^*$, D65 illuminant):
  - `Channel 1`: Lightness ($L^* \in [0, 1]$, mapped from $0$ to $100$)
  - `Channel 2`: Green-Red axis ($a^* \in [0, 1]$, where $0.5$ is neutral $0$)
  - `Channel 3`: Blue-Yellow axis ($b^* \in [0, 1]$, where $0.5$ is neutral $0$)
  - `Channel 4`: Alpha ($A \in [0, 1]$)

Each output channel is emitted as a grayscale image stream (`rgba(v, v, v, 1)`), ready for isolated filtering, tonal adjustment, mask extraction, or custom multi-node color re-routing.

## When to Use
- **Per-Channel Color Grading**: Process Red, Green, or Blue channels individually with Curves, Levels, or Blur nodes.
- **Frequency Separation & Sharpening**: Isolate the Lightness channel ($L^*$) in LAB mode to sharpen details without distorting hue or saturation.
- **Saturation & Hue Masking**: Extract pure Saturation or Hue grayscale mattes from HSLA mode for targeted keying.
- **Print & CMYK Prep**: Split color assets into CMYK plates for pre-press isolation.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | Source media stream to split |

## Config
| Field | Type | Options | Default | Description |
|-------|------|---------|---------|-------------|
| colorSpace | enum | `RGBA`, `HSLA`, `CMYK`, `LAB` | `RGBA` | Color model used for channel separation |

## Outputs
| Handle | Type | Description |
|--------|------|-------------|
| Channel 1 | Image, Video, GIF | Red (RGBA), Hue (HSLA), Cyan (CMYK), Lightness $L^*$ (LAB) |
| Channel 2 | Image, Video, GIF | Green (RGBA), Saturation (HSLA), Magenta (CMYK), $a^*$ (LAB) |
| Channel 3 | Image, Video, GIF | Blue (RGBA), Lightness (HSLA), Yellow (CMYK), $b^*$ (LAB) |
| Channel 4 | Image, Video, GIF | Alpha (RGBA/HSLA/LAB), Black $K$ (CMYK) |
