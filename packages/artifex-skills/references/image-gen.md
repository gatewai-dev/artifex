---
name: image-gen
description: "Generates new images or edits existing images using AI models (OpenAI DALL-E, Flux 2 Pro, or Nano Banana 2 via Fal AI). Supports custom dimensions, safety checkers, quality levels, transparency, and image-to-image editing/inpainting."
metadata:
  nodeType: ImageGen
  triggers: "image gen, generate image, text to image, image to image, flux, dall-e, edit image, ai image, inpainting, nano banana"
---

# Image Generator

## What It Does
Generates new images from text prompts or edits/re-styles existing images using advanced generative AI models. (gpt-image-2 is best currently - use it)

## When to Use
- **Text-to-Image Generation:** Generate high-quality assets, artwork, backgrounds, or mockups from scratch using text descriptions.
- **Image-to-Image Editing:** Provide a reference image alongside a prompt to guide the style, compose variations, or edit specific elements (e.g. inpainting).

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | Text prompt describing the image you want to generate or how to modify the reference image. |
| Reference Image | Image | ❌ | Optional image(s) to edit or use as guidance. If provided, the node switches to image-to-image edit mode. |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| model | string (enum) | `openai/gpt-image-2`, `fal-ai/flux-2-pro`, `bytedance/seedream/v5/pro/text-to-image`, `fal-ai/nano-banana-2`, `alibaba/qwen-image-3/text-to-image` | `"openai/gpt-image-2"` | The AI model used for generation. |

### OpenAI Fields (`openai/*`):
- **`openaiSize`**: Preset aspect ratio (`square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`) or custom `{ width, height }` object (integers, multiples of 16, range 256 to 3840).
  *Note:* The configuration component automatically rounds custom width and height inputs to the nearest multiple of 16. In addition, the UI performs real-time validation checks to warn if the custom dimensions exceed limits (max edge ≤ 3840px, aspect ratio ≤ 3:1, and total pixels between 655,360 and 8,294,400).
- **`openaiQuality`**: `low`, `medium`, `high` (default: `"medium"`).
- **`openaiFormat`**: `png`, `jpeg`, `webp` (default: `"png"`).
- **`openaiBackground`**: `opaque`, `transparent`, `auto` (default: `"opaque"`).

### Fal Flux Fields (`fal-ai/flux-2-pro`):
- **`falFluxSize`**: Preset aspect ratio (`auto`, `square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`) or custom `{ width, height }` (integers, min 256).
- **`falFluxSafetyTolerance`**: `1` to `5` (default: `"5"`).
- **`falFluxEnableSafetyChecker`**: `true`/`false` (default: `false`).
- **`falFluxOutputFormat`**: `jpeg`, `png` (default: `"jpeg"`).

### Bytedance Seedream Fields (`bytedance/seedream/*`):
- **`seedreamSize`**: Preset aspect ratio (`square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`, `auto_1K`, `auto_2K`) or custom `{ width, height }` (integers, total pixels between 1024x1024 and 2048x2048, aspect ratio between 1/16 and 16).
  *Note:* The UI performs real-time validation checks to warn if the custom dimensions exceed the total pixels or aspect ratio boundaries.
- **`seedreamOutputFormat`**: `jpeg`, `png` (default: `"jpeg"`).
- *Note:* Generation is fixed to exactly 1 output image, and the safety checker is always disabled.

### Fal Nano Banana 2 Fields (`fal-ai/nano-banana-2`):
- **`nanoBananaAspectRatio`**: Aspect ratio (`auto`, `21:9`, `16:9`, `3:2`, `4:3`, `5:4`, `1:1`, `4:5`, `3:4`, `2:3`, `9:16`, `4:1`, `1:4`, `8:1`, `1:8`).
- **`nanoBananaResolution`**: `0.5K`, `1K`, `2K`, `4K` (default: `"1K"`).
- **`nanoBananaOutputFormat`**: `png`, `jpeg`, `webp` (default: `"png"`).
- **`nanoBananaEnableWebSearch`**: Enable web search (default: `false`).
- **`nanoBananaThinkingLevel`**: Model thinking level (`disabled`, `minimal`, `high`).
- *Note:* `safety_tolerance` is automatically fixed to `"6"`.

### Alibaba Qwen Image 3 Fields (`alibaba/qwen-image-3/*`):
- **`qwenSize`**: Preset aspect ratio (`square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`) or custom `{ width, height }` (integers, total pixels between 512x512 and 1440x1440).
- **`qwenOutputFormat`**: `png`, `jpeg`, `webp` (default: `"png"`).
- **`qwenEnablePromptExpansion`**: Enable automatic LLM prompt rewriting (default: `true`).

## Prompting Guidelines

For best results, adjust your prompting style based on the selected image model:

### 1. Flux 2 Pro (`fal-ai/flux-2-pro`)
Flux 2 Pro excels at high specificity, precise text rendering, and complex prompt adherence.

- **Logical Information Hierarchy:** Place the most critical information first:
  $$\text{Prompt} = \text{Subject} + \text{Action/State} + \text{Style} + \text{Context/Environment} + \text{Technical Details}$$
- **Describe, Don't Use Keywords:** Use descriptive natural language rather than tag lists or prompt weighting syntax (e.g. `(extreme:1.5)` is ignored).
- **Exact Color Control:** You can specify precise colors using HEX codes (e.g. `"a character wearing a #FF5733 orange jacket"`).
- **Text Rendering:** Wrap the exact text to render in quotation marks and describe the placement and font styling (e.g. `"The text 'OPEN' in large, bold red neon letters appears above the door"`).
- **No Negative Prompts:** Flux 2 Pro does not support negative prompts. Describe what you *want* in the image rather than what you *don't want*.
- **Photorealism via Tech Specs:** Specify camera body, lens focal lengths, f-number, and lighting setups (e.g., `"shot on Sony A7IV, 85mm lens at f/2.8, three-point softbox studio lighting"`).

### 2. OpenAI GPT Image 2 (`openai/gpt-image-2`)
OpenAI GPT Image 2 works best with highly descriptive natural paragraphs. Pick this for best results.

- **Describe the Story & Mood:** Focus on describing a cohesive scene with a rich narrative rather than camera settings.
- **Image-to-Image Editing:** When a `Reference Image` is provided, describe only the modifications relative to the original image (e.g. `"add a coffee mug on the desk to the right of the laptop"`).

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image | The final generated or edited image asset. |

## Common Patterns
- **Standard Image Creation:** `Prompt ("japan street at night") → Image Generator (Model: GPT Image 2, Size: landscape_16_9) → Output`
- **Image Editing / Styling:** Connect a photo of a person to `Reference Image` and connect a prompt like `make them wear space armor, cinematic lighting` to `Prompt`. The node calls `/edit` endpoints to perform the modification.

- If a reference image is connected, the model endpoints dynamically switch to their edit variants (e.g. `/edit` or `image_urls` parameters).
