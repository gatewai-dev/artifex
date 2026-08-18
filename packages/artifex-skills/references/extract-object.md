---
name: extract-object
description: "Extracts specific objects from an image using natural language prompt descriptions. Returns the extracted object on a transparent background and the corresponding segmentation mask."
metadata:
  nodeType: ExtractObject
  triggers: "extract object, object extraction, segment object, cutout, sam, bria"
---

# Extract Object

## What It Does
The **Extract Object** node isolates specific objects from a source image using natural language descriptions (e.g. "yellow hammer", "red car"). It runs the `bria/extract-object` AI model to identify, crop, and segment the targeted item, producing both the transparent cutout (RGBA) and the black-and-white segmentation mask.

## When to Use
- **E-commerce & Product Catalogs:** Quickly isolate objects, tools, clothing items, or electronics from cluttered backgrounds to create clean product listings.
- **Graphic Design & Collages:** Extract specific assets from generic photos to combine them into creative compositions.
- **AI Pipelines:** Prepare isolated elements (image and mask) for inpainting, outpainting, or custom editing nodes.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Image | Image | ✅ | The source image containing the object to isolate. |
| Prompt | Text | ✅ | Natural language description of the object to extract (e.g., "yellow hammer"). |

## Config
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| autocrop | boolean | `false` | When true, tightens the output canvas dimensions to fit the bounding box of the extracted object. |
| remove_background | boolean | `false` | When true, refines the cutout boundaries using a dedicated background removal model (RMBG) for cleaner edges. When false, uses the standard SAM mask (faster). |

## Outputs
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image | The extracted object on a transparent background (RGBA). |
| Mask | Image | The black-and-white segmentation mask of the extracted object. |

> [!NOTE]
> The node component preview on the canvas only displays the **Result** (extracted object), but the **Mask** remains fully accessible through its respective output handle for downstream nodes.

## Common Patterns
- **Cutout Isolation Pipeline:** Connect an image and prompt → `Extract Object` → Send `Result` to a background-merging node or canvas composer.
- **Mask-based Inpainting:** Send `Mask` output to an Inpainting node to replace only the extracted object within the original image.

## Limitations
- Output is determined by the clarity of the natural language description.
- Complex overlaps or multi-object scenes may require descriptive prompts (e.g., "the blue mug on the left").
- Processing is performed via cloud API models (Fal.ai), which may introduce minor network latency.
