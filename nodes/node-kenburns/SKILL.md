---
name: Ken Burns
nodeType: KenBurns
summary: >
  Applies smooth pan, zoom, and translation animations over time to convert static or dynamic media into a video.
  Perfect for creating slideshows, dramatic photo showcases, document reviews, and cinematic visual tours.
triggers:
  - ken burns
  - pan and zoom
  - slideshow animation
  - image movement
  - zoom effect
  - camera animation
  - keyframe motion
---

# Ken Burns

## What It Does
Generates a Video from visual inputs (Image, Video, SVG, GIF, Lottie) by animating the camera position and scale using a list of custom keyframes. It translates, zooms, and holds on regions of the media, optionally adding motion blur.

## When to Use
- **Photo Showcases / Slideshows:** Animate high-resolution static images to make them feel active and cinematic.
- **Visual Tours:** Glide across large panoramic photos, maps, documents, or digital art to showcase detailed segments.
- **Focus Transitions:** Zoom in on a specific face or object in a photo, hold on it, and then slide/pan to another target area.

## Inputs
| Handle | Type | Required | Description |
|--------|------|----------|-------------|
| Media | Image, Video, SVG, GIF, Lottie | ✅ | The media content to apply the camera pan/zoom animations to |

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| keyframes | array | Array of Keyframe objects | `[]` | Ordered list of camera positions, scales, durations, and easing styles. |
| motionBlurSize | number | ≥0 | 1.5 | Subpixel blur multiplier added to fast camera movements to smooth transition frames. Set to 0 to disable. |
| movementStyle | string (enum) | `spline`, `direct` | `"spline"` | Interpolation style between keyframes. Spline creates a curved, organic path; direct uses straight lines. |
| aspectRatio | string (enum) | `input`, `16:9`, `9:16`, `21:9`, `9:21`, `1:1`, `4:3`, `3:2`, `2:3`, `4:5`, `5:4` | `"input"` | Aspect ratio of the output video. `"input"` preserves the source media aspect ratio. |

### Keyframe Object Schema
Each keyframe inside `keyframes` specifies:
- **`x` / `y`** (number, required): The target focus coordinates (0 to 100 percentage range).
- **`scale`** (number, required): The zoom factor. `1` is default size, `2` is twice as close, etc.
- **`durationMs`** (number, required): Transition duration in milliseconds **to move from this keyframe to the next one**. If this is the last keyframe, `durationMs` **must be set to 0**.
- **`holdMs`** (number): Duration to remain static at this position and scale before starting the transition to the next keyframe.
- **`easing`** (string, enum): Timing function for the transition. Options: `linear`, `ease-in`, `ease-out`, `ease-in-out`, `spring`.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Video | The output video with the camera movement path rendered. |

## Common Patterns

- **Slow Zoom-in Showcase:** Start at center `(50, 50)`, scale `1`. Hold for 1 second, then zoom in to scale `1.5` over 3 seconds:
  ```json
  [
    {
      "x": 50,
      "y": 50,
      "scale": 1.0,
      "holdMs": 1000,
      "durationMs": 3000
    },
    {
      "x": 50,
      "y": 50,
      "scale": 1.5,
      "holdMs": 1000,
      "durationMs": 0
    }
  ]
  ```

- **A to B Pan:** Hold at top-left `(20, 20)`, scale `2` for 500ms, then glide to bottom-right `(80, 80)`, scale `2` over 4 seconds:
  ```json
  [
    {
      "x": 20,
      "y": 20,
      "scale": 2.0,
      "holdMs": 500,
      "durationMs": 4000
    },
    {
      "x": 80,
      "y": 80,
      "scale": 2.0,
      "holdMs": 1000,
      "durationMs": 0
    }
  ]
  ```

### Detailed Timeline Progression Example
Given a 3-keyframe configuration:
```json
"keyframes": [
  { "x": 50, "y": 50, "scale": 1.0, "holdMs": 1000, "durationMs": 2000, "easing": "ease-in-out" },
  { "x": 80, "y": 20, "scale": 2.5, "holdMs": 500,  "durationMs": 3000, "easing": "linear" },
  { "x": 50, "y": 50, "scale": 1.2, "holdMs": 1500, "durationMs": 0 }
]
```

How this plays out over time (total duration = 8000ms):
1. **0ms - 1000ms (1.0s total):** Hold at Keyframe 0 (`scale: 1.0`).
2. **1000ms - 3000ms (2.0s total):** Animate from Keyframe 0 to Keyframe 1 over `2000ms` using `ease-in-out`.
3. **3000ms - 3500ms (0.5s total):** Hold at Keyframe 1 (`scale: 2.5`).
4. **3500ms - 6500ms (3.0s total):** Animate from Keyframe 1 to Keyframe 2 over `3000ms` using `linear`.
5. **6500ms - 8000ms (1.5s total):** Hold at Keyframe 2 (`scale: 1.2`).

> [!IMPORTANT]
> The last keyframe must always have `"durationMs": 0`. If a non-zero value is specified, the Zod schema automatically overrides it to `0` during parsing.

## Limitations
- Output is always a `Video` because the effect dynamically animates spatial properties over a timeline.
- High zoom scales (e.g., scale > 4) might pixelate low-resolution source images.
