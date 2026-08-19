---
name: video-gen
description: "Generates AI videos from text prompts and optional reference inputs (Images, Videos, or Audio) using advanced models like Wan 2.7, Seedance 2.0, and Seedance 2.5. Supports customized resolution, aspect ratios, seeds, and durations."
metadata:
  nodeType: VideoGen
  triggers: "video generator, generate video, text to video, image to video, reference to video, ai video, seedance, wan video, gemini video, gemini omni flash"
---

# Video Generator

## What It Does
Generates cinematic videos from written text prompts. If optional reference inputs (Image, Video, or Audio) are supplied, the generator uses them as starting frames, motion guides, or audio backgrounds to perform image-to-video, video-to-video, or audio-driven generation.

## When to Use
- **Text-to-Video:** Generate full cinematic clips by simply writing a detailed description of the action and style.
- **Image/Video-to-Video:** Use an input image or baseline video clip as a style or motion reference to animate static images or transform existing video actions.
- **Visual Mockups & B-Roll:** Produce custom b-roll video clips or visual concepts dynamically for video editors.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Prompt | Text | ✅ | Description of the scene, motion details, camera moves, and styling instructions. |

This node also supports **Variable Inputs** (enable/add from the canvas) of the following types:
- `Image` (Image): Serves as a reference first-frame or style template.
- `Video` (Video): Serves as reference/baseline motion.
- `Audio` (Audio): Serves as background track reference.

## Config
The config is structured dynamically via a union on the chosen **`model`**:

### 1. Seedance 2.0 Models (`bytedance/seedance-2.0/reference-to-video` or `.../fast/...`)
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| seedanceAspectRatio | string | `auto`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` | `auto` | Video aspect ratio. |
| seedanceResolution | string | `480p`, `720p`, `1080p` | `720p` | Output video resolution. |
| seedanceDurationSeconds | string | `4` to `15` | `8` | Generation duration in seconds. |
| seedanceGenerateAudio | boolean | `true`, `false` | `true` | When true, generates accompanying audio sync. |
| seedanceSeed | number | `0` to `2147483646` | undefined | Seed for reproducible output. |

### 1b. Seedance 2.5 Models (`bytedance/seedance-2.5/text-to-video` or `.../reference-to-video`)
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| seedanceAspectRatio | string | `auto`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` | `auto` | Video aspect ratio. |
| seedanceResolution | string | `480p`, `720p` | `720p` | Output video resolution. |
| seedanceDurationSeconds | string | `4` to `30` | `10` | Generation duration in seconds. |
| seedanceGenerateAudio | boolean | `true`, `false` | `true` | When true, generates accompanying audio sync. |
| seedanceSeed | number | `0` to `2147483646` | undefined | Seed for reproducible output. |

### 2. Wan 2.7 Models (`fal-ai/wan/v2.7`)
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| wanAspectRatio | string | `16:9`, `9:16`, `1:1`, `4:3`, `3:4` | `16:9` | Aspect ratio of the video. |
| wanResolution | string | `720p`, `1080p` | `1080p` | Output resolution. |
| wanDurationSeconds | string | `2` to `10` | `5` | Length of generated video in seconds. |
| wanEnablePromptExpansion | boolean | `true`, `false` | `true` | Enhances prompt descriptions automatically. |
| wanMultiShots | boolean | `true`, `false` | `false` | Enables multi-camera angle shots if supported. |
| wanSeed | number | `0` to `2147483647` | undefined | Seed for reproducible generation. |

### 3. Gemini Omni Flash (`google/gemini-omni-flash`)
Automatically uses the reference-to-video endpoint when Image inputs are connected.
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| geminiAspectRatio | string | `16:9`, `9:16` | `16:9` | Aspect ratio of the video. |
| geminiDurationSeconds | string | `5` to `8` | `8` | Length of generated video in seconds. |

### 4. MiniMax H3 Models (`minimax/h3`)
Automatically maps to reference-to-video if any reference assets are connected; otherwise maps to text-to-video.
| Field | Type | Range / Options | Default | Description |
|-------|------|-----------------|---------|-------------|
| minimaxAspectRatio | string | `adaptive`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` | `16:9` | Video aspect ratio. `adaptive` is only available for reference-to-video (otherwise defaults to `16:9`). |
| minimaxResolution | string | `480P`, `768P`, `2K`, `4K` | `2K` | Output video resolution. |
| minimaxDurationSeconds | string | `5` to `15` | `5` | Length of generated video in seconds. |

## Prompting Guidelines

For best results, tailor your prompt style based on the selected generator model:

### 1. Wan 2.7 Models (`fal-ai/wan/*`)
Wan v2.7 responds best to detailed, descriptive, and cinematically-oriented prompts. Use a structured formula to construct your prompt:

$$\text{Prompt} = \text{Subject} + \text{Scene/Environment} + \text{Motion} + \text{Camera Language} + \text{Style/Atmosphere}$$

- **Subject:** Define the main focus with specific details (e.g., `"a young woman with curly red hair wearing a vintage leather jacket"`).
- **Scene/Environment:** Describe foreground/background and lighting (e.g., `"walking through a rain-slicked Tokyo street under bright neon signs at night"`).
- **Motion:** Use descriptive, active motion verbs instead of passive phrases (e.g., `"striding confidently"`, `"sprinting"`, `"slowly turning head"`).
- **Camera Language:** Direct the camera framing and movement (e.g., `"cinematic close-up"`, `"low-angle tracking shot"`, `"smooth dolly push-in"`, `"static shot"`).
- **Style/Atmosphere:** Add descriptors for lighting, mood, color grading, and aesthetic (e.g., `"dreamy soft focus, 35mm film grain, warm cinematic lighting"`).
- **Text Rendering:** Wrap the exact text you want rendered in double quotes inside your prompt (e.g., `holding a sign that says "GATEWAI"`).

> [!TIP]
> Keep prompts vivid and descriptive, ideally between 60 to 150 words. You can enable **Prompt Expansion** in the node's configuration to automatically enrich simple prompts.

### 2. Seedance Models (`bytedance/seedance-2.0/*`)
Seedance 2.0 treats prompts like a **director's shot list** rather than a list of keywords. It is highly responsive to natural language and multimodal inputs.

- **Multimodal Referencing:** Refer to connected input handles in your prompt text using bracketed tags:
  - `[Image1]`, `[Image2]`, etc. for connected Image inputs.
  - `[Video1]`, `[Video2]`, etc. for connected Video inputs.
  - `[Audio1]`, etc. for connected Audio inputs.
  - *Example:* `"The character from [Image1] performs the dance from [Video1] while matching the rhythm of [Audio1]."`
- **Structured Flow (CRAFT):**
  - **Context:** Describe the setting, characters, and mood.
  - **Reference:** Explicitly link media references using the bracketed tags above.
  - **Action:** Specify precise motion, speed, and timing (e.g., `"slowly turns around over 3 seconds"`).
  - **Framing:** Define camera transitions (e.g., `"low-angle tracking right"`).
  - **Style:** Specify aesthetic details, stable composition, and lighting.
- **Lip-Sync & Dialogue:** To trigger lip-syncing when an audio reference is attached, wrap spoken lines in double quotes (e.g., `The man in [Image1] turns to the camera and says: "Welcome to the studio."`).
## Example

Style: Hybrid visual style — photorealistic, documentary-level environment combined with stylized 3D animated characters. The subject and the fan are fully 3D animated characters seamlessly composited into a live-action realistic world. Single continuous unbroken shot from a handheld camera within a dense crowd. Natural micro-shake, eye-level perspective.

Character Style: The subject from @Image1 is rendered as a polished 3D animated character with stylized proportions, soft subsurface skin shading, expressive features, and clean rim lighting — while maintaining a perfectly consistent face and the exact outfit from the reference image. The fan they interact with is also a 3D animated character in the same rendering style. Both characters retain cinematic CG quality with realistic interaction with the surrounding light (flash bounces, streetlight highlights, shadow casting on real ground).

Lighting & Environment: Fully photorealistic. Nighttime at an upscale event in New York City. Illuminated by real streetlights and camera flashes. Mixed reflections on polished surfaces (phones, cars), soft realistic shadows, and a slight atmospheric haze for depth. The crowd, barricades, hotel facade, SUVs, and street are all live-action realistic — only the two main characters are stylized 3D.

Subject: The 3D animated subject maintains a calm, controlled presence with a subtle, confident smile, perfectly matching the face and outfit from @Image1.

Action Sequence: The shot begins completely immersed in a restless, chaotic realistic crowd behind barricades. The view is partially obscured by real people raising smartphones to record. As the camera lifts slightly above shoulder level, the 3D animated subject exits a luxury hotel in the background. Bright media flashes erupt, illuminating the CG character against the realistic environment. Real security personnel step into frame, pushing the crowd back, causing the camera to shake naturally. Through shifting gaps in the crowd, the animated subject walks forward clearly into center frame. The subject pauses to interact with a 3D animated fan, leaning in briefly for a selfie while giving a calm, controlled wave. The camera pans to follow as a luxury convoy of three premium black SUVs (photorealistic) pulls up. A real security guard opens the back door of the middle SUV. The animated subject steps inside, rolls down the window to wave one last time, and the vehicles begin to pull away as the realistic crowd jumps to capture the moment.
Audio: Loud, chaotic crowd cheering and whistling. Overlapping voices shouting the subject's name. A barrage of rapid camera shutter clicks. Distant New York City sirens and traffic. The rustling of heavy fabric and footsteps. The deep, heavy bass of an SUV engine idling and pulling away.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Video | The final generated MP4 video file. |

## Common Patterns
- **Text-To-Video B-Roll:** `Text (Prompt description) → Video Generator (Result) → Compositor (Scene)`
- **Image-to-Video Animation:** `Image (Reference picture) + Text (Motion Prompt) → Video Generator (Result)`

## Limitations
- High processing requirements; generation cost scales depending on the model, resolution, input length, and duration settings.
