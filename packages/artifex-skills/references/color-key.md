---
name: color-key
description: "Keys out a specific background color (chroma keying) from visual media and removes color spill from foreground edges. Supports YUV chrominance-based distance and RGB exact distance algorithms."
metadata:
  nodeType: ColorKey
  triggers: "color key, chroma key, green screen, blue screen, key color, transparency mask, remove background color"
---

# Color Key

## What It Does
Applies digital color keying (chroma key) to input visual media (Image, SVG, Video, Lottie, GIF). It replaces the selected key color with transparency using adjustable similarity, softness, and spill suppression.

## When to Use
- **Chroma Keying:** Remove green or blue screens to isolate subjects/objects from their background.
- **Graphic Isolation:** Key out white/black backgrounds from icons or illustrations.
- **Animated Keys:** Modulate similarity or smoothness via signals to create fade-in/fade-out masking transitions.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | The media to key out the color from |
| Similarity Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate the key similarity threshold |
| Smoothness Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate the transition softness |
| Spill Suppression Signal | Number, Signal | ❌ | Optional signal/number to dynamically modulate spill suppression strength |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| keyColor | string (hex) | - | "#00ff00" | Hex representation of the color to be removed. |
| colorSpace | string (enum) | YUV, RGB | "YUV" | Similarity distance algorithm color space. YUV is robust to uneven lighting; RGB keys exact matches. |
| similarity | number | 0.0–1.0 | 0.4 | Similarity threshold. 0 = match nothing, 1 = match everything. |
| smoothness | number | 0.0–1.0 | 0.1 | Edge transition softness. 0 = hard edge, 1 = extremely feathered. |
| spillSuppressionType | string (enum) | Desaturate, Neutralize, None | "Desaturate" | Style of spill suppression applied to edges. |
| spillSuppression | number | 0.0–1.0 | 0.2 | Spill suppression intensity. |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | The visual media with the key color removed (rendered as transparency). |

## Limitations
- Key color is parsed from hex format. Alpha/opacity of the key color is ignored.
- Extreme smoothness may cause the entire foreground to blend out if its colors are close to the key color.
