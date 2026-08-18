---
name: HalftoneScreen
nodeType: HalftoneScreen
summary: >
  Converts visual media (Image, SVG, Video, Lottie, GIF) into procedural halftone dot or CMYK raster screens with customizable line frequency (LPI), screen angles, geometric dot shapes (Circle, Diamond, Line, Square), and paper/ink colors.
triggers:
  - halftone
  - halftone screen
  - raster screen
  - cmyk halftone
  - newspaper print
  - comic book print
  - dot print
  - pop art screen
  - engraving lines
  - lpi screening
---

# HalftoneScreen

## What It Does
Converts continuous-tone visual media (Image, SVG, Video, Lottie, GIF) into stylized halftone raster screens matching professional print reproduction techniques (vintage newspapers, comic books, pop art, engraving line screens, and offset 4-color CMYK process printing).

## When to Use
- **Vintage / Retro Print Looks:** Simulate newspaper print, comic book rosettes, or classic magazine reproduction.
- **Graphic Design & Pop Art:** Create high-contrast stylized graphics and posters using custom dot shapes (circles, diamonds, lines, squares).
- **Engraving & Woodcut Simulation:** Use `Line` screening with fine frequency and angle to create currency/engraving line art.
- **Dynamic & Audio-Reactive Screening:** Animate line frequency, rotation angle, or contrast continuously via LFOs or audio signals.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media to apply the halftone screen effect to |
| Frequency Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate screen frequency (LPI) |
| Screen Angle Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate screen rotation angle |
| Contrast Multiplier Signal | Number, Signal | ❌ | Optional signal or number to dynamically modulate tonal contrast |
| Cyan Angle Signal | Number, Signal | ❌ | Optional signal or number to modulate Cyan angle offset in CMYK mode |
| Magenta Angle Signal | Number, Signal | ❌ | Optional signal or number to modulate Magenta angle offset in CMYK mode |
| Yellow Angle Signal | Number, Signal | ❌ | Optional signal or number to modulate Yellow angle offset in CMYK mode |
| Black Angle Signal | Number, Signal | ❌ | Optional signal or number to modulate Black (K) angle offset in CMYK mode |
| Opacity Signal | Number, Signal | ❌ | Optional signal or number to modulate effect blend opacity |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| mode | string (enum) | Monochrome, CMYK | "Monochrome" | Screening color model (single-ink or 4-color process). |
| dotShape | string (enum) | Circle, Diamond, Line, Square | "Circle" | Geometric shape of the raster cells. |
| frequency | number | 1–200 | 30 | Screen frequency in lines per unit / LPI. Higher values produce smaller dots. |
| angle | number | 0–360 | 45 | Global base angle of the screening grid in degrees. |
| contrast | number | 0.1–5.0 | 1.0 | Tonal contrast multiplier applied to ink density. |
| dotColor | string (hex) | any valid color | "#000000" | Foreground dot ink color in Monochrome mode. |
| paperColor | string (hex) | any valid color | "#ffffff" | Paper / background substrate color. |
| smooth | boolean | true/false | true | Anti-aliased sub-pixel dot contours. |
| invert | boolean | true/false | false | Inverts ink density (photographic negative print). |
| cyanAngle | number | 0–360 | 15 | Cyan angle offset for CMYK mode. |
| magentaAngle | number | 0–360 | 75 | Magenta angle offset for CMYK mode. |
| yellowAngle | number | 0–360 | 0 | Yellow angle offset for CMYK mode. |
| blackAngle | number | 0–360 | 45 | Black (Key) angle offset for CMYK mode. |
| opacity | number | 0–1.0 | 1.0 | Blend opacity with original media. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The visual media with halftone raster screening applied. |

## Common Patterns
- **Vintage Newspaper:** `Import (image) → HalftoneScreen (mode: Monochrome, dotShape: Circle, frequency: 35, paperColor: #f4ecd8, dotColor: #000000) → Export`
- **4-Color Offset Comic Print:** `Import (image) → HalftoneScreen (mode: CMYK, dotShape: Circle, frequency: 28, angle: 0) → Export`
- **Linear Engraving Art:** `Import (image) → HalftoneScreen (mode: Monochrome, dotShape: Line, frequency: 40, angle: 45, contrast: 1.2) → Export`
- **Audio-Reactive Halftone Animation:** `Signal (LFO / Audio) → HalftoneScreen (frequency bound to signal) → Export`

## Limitations
- Screen frequency range is 1 to 200 LPI.
- Subtractive CMYK ink synthesis simulates standard commercial process inks (Cyan, Magenta, Yellow, Black) absorbing light from the paper color.
