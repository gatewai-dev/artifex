# Example 02: High-Converting E-Commerce Product Card

An automated e-commerce ad creative and social commerce design pipeline that turns product prompts into studio-retouched, alpha-isolated promotional ad banners with parametric vector shapes, Photoshop-grade layer effects, halftone styling, and dynamic typography.

<img src="./output.png" width="380" alt="High-Converting E-Commerce Product Card" />

---

## 🎬 Pipeline Architecture

```mermaid
graph TD
    P[Product Prompt] --> IG[ImageGen (OpenAI Medium)]
    IG --> RB[RemoveBackground (Bria AI)]
    RB --> RE[RefineEdge (Edge Decontamination & Smoothing)]
    RE --> SC[SelectiveColor (CMYK Red & Cyan Pop)]
    SC --> PLS[LayerStyle (Product Drop Shadow, Stroke & Inner Bevel)]
    
    BG[CanvasGenerator (Gradient Backdrop)] --> HS[HalftoneScreen (Pop-Art Dot Screen)]
    
    SG[ShapeGenerator (Hexagon Vector Plate)] --> SLS[LayerStyle (Neon Outer Glow & 3D Bevel)]
    
    HS --> COMP[Compositor (Layout: Background + Vector Plate + Product + Badges + CTA)]
    SLS --> COMP
    PLS --> COMP
    
    COMP --> EXP[Export (.png)]
```

---

## 🛠 Nodes & Photoshop-Grade Finishing

1. **`ImageGen` (OpenAI GPT Image 2, Medium Quality)**: Generates a high-resolution square product photograph with studio lighting.
2. **`RemoveBackground`**: Strips the background to isolate the subject with an alpha mask.
3. **`RefineEdge`**: Eliminates white/gray segmentation halos along the edges, applies sub-pixel edge smoothing (`smooth: 8`), and decontaminates color fringe (`decontaminateAmount: 0.85`).
4. **`SelectiveColor`**: Applies CMYK color grading to enhance sneaker highlights and deepen blacks.
5. **`ShapeGenerator`**: Generates a parametric 6-sided hexagonal vector plate with electric orange-to-magenta linear gradient and cyan outline stroke (`outputType: "Image"`).
6. **`LayerStyle` (Shape Glow & Bevel)**: Enhances the geometric shape with a multi-pass neon screen outer glow and 3D inner bevel.
7. **`LayerStyle` (Product FX)**: Applies standard Photoshop layer styles to the extracted sneaker:
   * **Stroke**: 4px crisp white outer border.
   * **Drop Shadow**: Multi-angle soft contact shadow (`distance: 25px`, `size: 35px`, `opacity: 0.65`).
   * **Bevel & Emboss**: Subtle 3D light elevation and specular highlight.
8. **`CanvasGenerator` & `HalftoneScreen`**: Generates a sleek dark gradient and converts it into a stylized pop-art halftone raster dot screen (`frequency: 24`, `angle: 45°`).
9. **`Compositor` (`mode: "Image"`)**: Lays out the composite image with discount badge ("LIMITED EDITION | 50% OFF"), product typography (`SpaceGrotesk` / `Montserrat`), feature highlights, and "SHOP NOW" call-to-action button.

---

## 🚀 Execution Guide

### Validate the Spec
```bash
artifex validate examples/02-ecommerce-product-card/spec.json
```

### Inspect the Execution Graph
```bash
artifex build examples/02-ecommerce-product-card/spec.json
```

### Run and Render
```bash
artifex run examples/02-ecommerce-product-card/spec.json --state checkpoint.json
```
Output is saved to `scratch-renders/ecommerce-ad-card.png`.
