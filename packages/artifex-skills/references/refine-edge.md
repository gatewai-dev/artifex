---
name: refine-edge
description: "Matte defringing and edge decontamination. Strips background color bleeding halos, refines edge transparency, and smoothes sub-pixel details for hair, fur, and keying composites."
metadata:
  nodeType: RefineEdge
  triggers: "refine edge, defringe, edge decontamination, matte refinement, remove halo, clean edges, green screen spill, hair matte, fur matte, shift edge, smooth edge, feather matte"
---

# RefineEdge

## What It Does
The RefineEdge node is a professional edge cleanup and defringing processor for visual media. It solves the edge halo and color bleed artifacts commonly produced by AI background removers (`node-remove-background`) and chroma keyers (`node-colorkey`):

- **Color Decontamination & Defringing**:
  - Automatically detects transition zones along the alpha perimeter.
  - Samples confident foreground colors within the specified pixel radius.
  - Neutralizes background color spill, green screen halos, or white AI segmenter fringe by replacing contaminated edge pixels with true subject colors.
- **Edge Smoothing**:
  - Eliminates jagged staircasing and aliasing along alpha cutouts using separable Gaussian edge smoothing.
- **Feathering**:
  - Applies sub-pixel Gaussian softness to achieve photographic depth and natural optical focus.
- **Edge Shifting (Choke / Expand)**:
  - Contracts (negative shift) or expands (positive shift) the alpha boundary to tuck in unwanted outer fringes or expand hairline coverage.
- **Output Flexibility**:
  - `Composite`: Clean defringed foreground with refined alpha.
  - `MatteOnly`: Refined grayscale mask for downstream mask operations or compositing nodes.
  - `DecontaminatedRGB`: Full-bleed RGB with background fringe removed.

## When to Use
- **Cleaning AI Background Removals**: Eliminate white, black, or blurry outline halos around hair, fur, and clothing after using AI background removal.
- **Chroma Key Post-Processing**: Remove remaining green/blue spill fringes around fine hair strands.
- **Edge Choking & Tightening**: Shrink a loose matte by a couple of pixels to eliminate background contamination.
- **Sub-pixel Hair & Soft Edge Refinement**: Produce smooth, photographic alpha transitions for realistic compositing onto new backgrounds.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Input | Image, SVG, Video, Lottie, GIF | ✅ | Primary image or video source |
| Matte | Image, SVG, Video, Lottie, GIF | ❌ | Optional separate matte or segmentation mask |
| Decontaminate Signal | Number, Signal | ❌ | Dynamic signal/number for color decontamination amount (0.0–1.0) |
| Radius Signal | Number, Signal | ❌ | Dynamic signal/number for edge detection radius (0.5–50.0 px) |
| Smoothness Signal | Number, Signal | ❌ | Dynamic signal/number for edge smoothing curve (0–100) |
| Feather Signal | Number, Signal | ❌ | Dynamic signal/number for gaussian feather radius (0.0–50.0 px) |
| Shift Edge Signal | Number, Signal | ❌ | Dynamic signal/number for edge shift percentage (-100% to +100%) |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| decontaminateAmount | number | 0.0–1.0 | 0.7 | Intensity of edge color spill decontamination/defringing |
| radius | number | 0.5–50.0 | 2.0 | Neighborhood search radius in pixels for edge detection & color sampling |
| smooth | number | 0–100 | 5 | Matte edge smoothing curve intensity |
| feather | number | 0.0–50.0 | 0.5 | Sub-pixel gaussian softness along the matte boundary (px) |
| shiftEdge | number | -100 to +100 | 0 | Contract (<0) or expand (>0) the edge boundary (%) |
| matteChannel | enum | Alpha, Luminance, Red, Green, Blue | Alpha | Channel to extract matte from if Matte input is connected |
| outputMode | enum | Composite, MatteOnly, DecontaminatedRGB | Composite | Output representation mode |

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video, GIF | Decontaminated and refined edge composite or matte |

## Common Recipes & Patterns

### 1. Defringe AI Background Removal Output
```json
{
  "name": "Defringe AI Cutout",
  "nodes": [
    { "id": "input-img", "type": "Import", "config": { "file": "./photo.jpg" } },
    { "id": "rem-bg", "type": "RemoveBackground" },
    { "id": "refine", "type": "RefineEdge", "config": { "decontaminateAmount": 0.8, "radius": 3.0, "smooth": 6, "feather": 0.8, "shiftEdge": -2 } },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/clean.png" } }
  ],
  "edges": [
    { "source": "input-img", "target": "rem-bg", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "rem-bg", "target": "refine", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "refine", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```

### 2. External AI Mask with Color Image
```json
{
  "name": "Refine External Mask",
  "nodes": [
    { "id": "input-color", "type": "Import", "config": { "file": "./source.jpg" } },
    { "id": "input-mask", "type": "Import", "config": { "file": "./segmentation-mask.png" } },
    { "id": "refine", "type": "RefineEdge", "config": { "decontaminateAmount": 0.9, "radius": 4.0, "smooth": 8, "feather": 1.0, "matteChannel": "Luminance" } },
    { "id": "export", "type": "Export", "config": { "file": "./scratch-renders/refined-composite.png" } }
  ],
  "edges": [
    { "source": "input-color", "target": "refine", "sourceLabel": "Result", "targetLabel": "Input" },
    { "source": "input-mask", "target": "refine", "sourceLabel": "Result", "targetLabel": "Matte" },
    { "source": "refine", "target": "export", "sourceLabel": "Result", "targetLabel": "Input" }
  ]
}
```
