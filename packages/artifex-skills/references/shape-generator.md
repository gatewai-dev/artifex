---
name: shape-generator
description: "Renders crisp, resolution-independent parametric shapes (rectangles with per-corner radii, ellipses, regular polygons, stars, arrows, custom SVG bezier paths) with solid/gradient fills, strokes, and dash patterns."
metadata:
  nodeType: ShapeGenerator
  triggers: "shape generator, vector shape, draw rectangle, draw star, draw polygon, draw arrow, vector path, rounded rectangle, badge, button shape"
---

# Vector Shape (ShapeGenerator)

## What It Does
Generates clean, resolution-independent parametric vector graphics and shapes directly from parameters or custom SVG path definitions. Shapes can be filled with solid colors, linear gradients (with custom direction angles), or radial gradients, and outlined with styled strokes, dash patterns, and custom line caps/joins.

## Supported Shape Types
1. **Rectangle**: Configurable width, height, and independent 4-corner radii (`radiusTL`, `radiusTR`, `radiusBR`, `radiusBL`).
2. **Ellipse / Circle**: Symmetrical or non-uniform circular shapes.
3. **Polygon**: Regular polygons with $N$ sides (triangles, pentagons, hexagons, octagons, etc.).
4. **Star**: Multi-point stars with configurable spike counts (3 to 64) and inner-to-outer radius ratio.
5. **Arrow**: Parametric directional arrows with adjustable head width, head length, and shaft thickness.
6. **CustomPath**: Arbitrary SVG bezier path strings (`d="..."`) with full gradient and stroke styling.

## Fullscreen Vector Editor & Hotkeys
Click **Open Shape Editor** on the node (or navigate to `view/<nodeId>`) to launch the dedicated vector designer.

| Key | Action | Description |
|---|---|---|
| `V` | Select Tool | Activates the selection & transform tool with 8-point bounding box handles. |
| `H` / `Space + Drag` | Pan Tool | Pans the infinite canvas workspace. |
| `R` | Rectangle | Quickly switches shape to Rectangle. |
| `O` / `C` | Ellipse | Quickly switches shape to Ellipse / Circle. |
| `P` | Polygon | Quickly switches shape to Regular Polygon. |
| `S` | Star | Quickly switches shape to Star. |
| `A` | Arrow | Quickly switches shape to Directional Arrow. |
| `Ctrl + 0` | Fit View | Centers and fits the shape to the viewport. |
| `Ctrl + 1` | 100% Zoom | Resets zoom level to 1:1 scale. |
| `+` / `-` | Zoom In / Out | Scales canvas zoom level. |
| `Ctrl + Z` / `Ctrl + Shift + Z` | Undo / Redo | Navigates config edit history. |
| `Ctrl + C` | Copy SVG | Copies standard SVG XML markup to clipboard. |
| `Arrow Keys` | Nudge | Nudges width/height by 1px (or 10px with `Shift`). |
| `Esc` | Exit / Close | Closes modal or returns to the canvas graph. |

## Handles
- **Inputs**: None (Generator node).
- **Config Signal Handles**: Continuous numeric properties (`width`, `height`, `radiusTL`, `polygonSides`, `starPoints`, `starInnerRadius`, `strokeWidth`, `rotation`, `opacity`, `gradientAngle`) support direct signal wire bindings.
- **Outputs**: `Result` (`SVG`, `Image`).

## Configuration Schema
```ts
export const shapeGeneratorConfig = configBuilder()
  .field("shapeType", z.enum(["Rectangle", "Ellipse", "Polygon", "Star", "Arrow", "CustomPath"]).default("Rectangle"))
  .field("width", z.number().int().min(1).max(8192).default(500))
  .field("height", z.number().int().min(1).max(8192).default(500))
  .field("radiusTL", z.number().min(0).default(24))
  .field("radiusTR", z.number().min(0).default(24))
  .field("radiusBR", z.number().min(0).default(24))
  .field("radiusBL", z.number().min(0).default(24))
  .field("polygonSides", z.number().int().min(3).max(64).default(5))
  .field("starPoints", z.number().int().min(3).max(64).default(5))
  .field("starInnerRadius", z.number().min(0.01).max(0.99).default(0.5))
  .field("arrowHeadWidth", z.number().min(0).default(40))
  .field("arrowHeadLength", z.number().min(0).default(40))
  .field("arrowShaftWidth", z.number().min(1).default(20))
  .field("customPath", z.string().optional())
  .field("fillType", z.enum(["solid", "linear", "radial", "none"]).default("solid"))
  .field("fillColor", ColorSchema.default("#3b82f6"))
  .field("gradientEndColor", ColorSchema.default("#1d4ed8"))
  .field("gradientAngle", z.number().default(0))
  .field("strokeColor", ColorSchema.default("#ffffff"))
  .field("strokeWidth", z.number().min(0).default(0))
  .field("strokeDashArray", z.string().optional())
  .field("strokeLineCap", z.enum(["butt", "round", "square"]).default("round"))
  .field("strokeLineJoin", z.enum(["miter", "round", "bevel"]).default("round"))
  .field("strokeDashOffset", z.number().default(0))
  .field("rotation", z.number().default(0))
  .field("opacity", z.number().min(0).max(1).default(1))
  .field("outputType", z.enum(["SVG", "Image"]).default("SVG"))
  .build();
```

## Example Workflow Spec
```json
{
  "id": "shape-1",
  "type": "ShapeGenerator",
  "config": {
    "shapeType": "Star",
    "width": 500,
    "height": 500,
    "starPoints": 5,
    "starInnerRadius": 0.48,
    "fillType": "linear",
    "fillColor": "#fbbf24",
    "gradientEndColor": "#d97706",
    "gradientAngle": 45,
    "strokeColor": "#ffffff",
    "strokeWidth": 4,
    "outputType": "SVG"
  }
}
```
