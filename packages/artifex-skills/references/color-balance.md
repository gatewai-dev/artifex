---
name: color-balance
description: "Shifts the color balance of Shadows, Midtones, and Highlights along Cyan-Red, Magenta-Green, and Yellow-Blue axes with optional luminosity preservation."
metadata:
  nodeType: color-balance
  triggers: ""
---

# ColorBalance Node

The **ColorBalance** node provides professional 3-way color balance and split-toning grading for images and video streams. It allows independent adjustment of shadows, midtones, and highlights along complementary color axes: Cyan ⟷ Red, Magenta ⟷ Green, and Yellow ⟷ Blue.

## Handles

### Inputs
- **`Input`** (`["Image", "SVG", "Video", "GIF", "Lottie"]`, required): The input visual media.

### Outputs
- **`Result`** (`["Image", "Video", "GIF"]`): The color-balanced media stream.

## Configuration Schema

```typescript
const TonalShiftSchema = z.object({
  cyanRed: z.number().min(-100).max(100).default(0),
  magentaGreen: z.number().min(-100).max(100).default(0),
  yellowBlue: z.number().min(-100).max(100).default(0),
});

export const colorBalanceConfig = configBuilder()
  .field("shadows", TonalShiftSchema.default({}))
  .field("midtones", TonalShiftSchema.default({}))
  .field("highlights", TonalShiftSchema.default({}))
  .field("preserveLuminosity", z.boolean().default(true))
  .build();
```

## Features
- **3-Way Tonal Split**: Target Shadows, Midtones, and Highlights independently using smooth, non-clipping weighting curves.
- **Complementary Color Axes**:
  - Cyan (-100) ⟷ Red (+100)
  - Magenta (-100) ⟷ Green (+100)
  - Yellow (-100) ⟷ Blue (+100)
- **Signal & Number Input Modulation**: Real-time signal binding support for all 9 tonal axes across Shadows, Midtones, and Highlights.
- **Preserve Luminosity**: Retains the exact photometric luminance of each pixel using standard W3C/Photoshop luminosity reconstruction, shifting color cast without altering brightness.
- **Built-in Presets**: Quick color grading presets including Teal & Orange, Golden Hour, Cool Moonlight, Vintage Film, Bleach Bypass, and Synthwave.
