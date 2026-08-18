---
name: compositor
description: "Composes media inputs (Text, Image, SVG, Audio, Caption, Video, GIF, and Lottie) into a single image or video file with an HTML-like auto-layout engine. The composition document is a single recursive `layout` code tree (flex/block/box/text/media) with per-node keyframe animation — deterministic: identical pixels for the same document and frame, in preview AND final render."
metadata:
  nodeType: Compositor
  triggers: "compositor, composite, layer, merge media, layout, flex, overlay, picture in picture, video layout, title card"
---

# Compositor

## What It Does
Composes media inputs into a single image or video using a **layout code tree** — the ONE
source of truth for the composition. Agents author `config.layout`: a recursive tree of
layout nodes (`flex` / `block` / `box` / `text` / `media`) with HTML-like auto-layout
(`dir`, `gap`, `padding`, `justify`, `align`, `wrap`) and per-node keyframe animations.
Rendering is deterministic: `(document, frame) → pixels`, identical in preview and final render.

## When to Use
- **Title cards / hero layouts:** Flex stacks with title + subtitle text and box chips (see example below).
- **Overlays / Watermarks:** Absolute-positioned text or media over video/image backgrounds.
- **Picture-in-Picture:** Multiple videos/images arranged by a flex/block tree or absolute placement.
- **Timeline composition:** Per-node `startFrame` / `durationFrames` + keyframe tracks.
- **Visual styling:** Box fills + radius, text styling, shadows, keyframe motion.

## Inputs
This node uses **Variable Inputs**. You can add dynamically named input handles of the following types:
- `Text`
- `Image`
- `Video`
- `Audio`
- `Caption`
- `SVG`
- `GIF`
- `Lottie`

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| width | number | 1–4096 | 1080 | Canvas width in pixels. |
| height | number | 1–4096 | 1080 | Canvas height in pixels. |
| backgroundColor | string | Hex/RGB CSS Color | undefined | Background color of the compositor canvas. |
| volume | number | 0–1 | 1 | Overall master audio volume scaling. |
| fps | number | 1–120 | 24 | Frames per second for video output. |
| mode | string | `"Video"` or `"Image"` | `"Video"` | Explicitly configures compositor rendering/output mode. |
| layout | array | Array of Layout Nodes | `[]` | The composition document: a recursive tree of layout nodes. |

> **`type` vs `kind`:** `type` is an INPUT DataType (`Text`, `Image`, `Video`, `Audio`,
> `Caption`, `SVG`, `GIF`, `Lottie` …) and never appears on layout nodes. The layout type of
> a node is its **`kind`**: `flex` | `block` | `box` | `text` | `media`.

---

### Layout Node Schema
Common fields (every node):
- **`id`** (string, required): Unique node id — also keys the timeline.
- **`kind`** (string, required): `"flex"` | `"block"` | `"box"` | `"text"` | `"media"`.
- **`inputHandleId`** (string, optional): Graph binding — which connected input this node renders (for text/media nodes).
- **`position`** (string, optional): `"relative"` (default, in-flow) or `"absolute"` (out-of-flow; placed by `x`/`y`).
- **`x` / `y`** (number, optional): Offset from the parent's content box (absolute placement / transform base).
- **`width` / `height`** (SizeSpec, optional): `number` (pixels), `"auto"` (content), `"fit"` (fit content), or `"fill"` (fill the parent). `block` defaults to `"fill"` width.
- **`grow`** (number, optional): Flex-grow weight — extra main-axis space is split proportionally.
- **`flexShrink`** (number, optional): Flex shrink factor (Yoga).
- **`flexBasis`** (number, optional): Flex basis in pixels.
- **`alignSelf`** (string, optional): Per-child cross-axis override (`"auto"` | `"start"` | `"center"` | `"end"` | `"stretch"` | `"baseline"`).
- **`aspectRatio`** (number, optional): Intrinsic aspect ratio (`width / height`).
- **`zIndex`** (number, optional, default 0): Stack order **within the same parent level**. Higher renders on top.
- **`hidden`** (boolean, optional): Skips drawing the node.
- **`opacity`** (number, optional, 0–1, default 1).
- **`blendMode`** (string, optional, default `"normal"`): Blend mode used when compositing the node (`"normal"`, `"multiply"`, `"screen"`, `"overlay"`, `"darken"`, `"lighten"`, `"color-dodge"`, `"color-burn"`, `"hard-light"`, `"soft-light"`, `"difference"`, `"exclusion"`, `"hue"`, `"saturation"`, `"color"`, `"luminosity"`, `"source-over"`, `"source-in"`, `"source-out"`, `"source-atop"`, `"destination-over"`, `"destination-in"`, `"destination-out"`, `"destination-atop"`, `"lighter"`, `"copy"`, `"mask-in"`, `"mask-out"`, `"xor"`).
- **`rotation`** (degrees) / **`scale`** (multiplier) / **`anchorX`**, **`anchorY`** (0–1): Node transform.
- **`startFrame`** / **`durationFrames`** (integer, optional): Node visibility window on the master timeline (frames).
- **`animation`** (object, optional): Track-based keyframes (§ Animation Schema).

Container styles (flex/block/box with children):
- **`dir`** (flex only): `"row"` (default) or `"column"`.
- **`gap`** (number): Space between children along the main axis.
- **`padding`** (number): Inset of the content box.
- **`justify`** (flex only): `start` (default) | `center` | `end` | `space-between` | `space-around`.
- **`align`** (flex/block): `start` (default) | `center` | `end` | `stretch`.
- **`wrap`** (flex only, boolean): Allow main-axis wrapping.

Per-kind fields:
- **`box`**: `background` (CSS color, also accepts gradients), `borderRadius` (number), `padding`. A `box` with children behaves like a column container.
- **`text`**: `text` (string), `fontSize`, `fontFamily`, `fontWeight`, `fontStyle`, `fill` (text color), `align`, `verticalAlign`, `lineHeight`, `letterSpacing`, `textShadow`, `shadows`, `background` (rounded text box fill), `borderRadius`, `padding`.
- **`media`**: `inputHandleId` (string, required — must match a connected input handle).
  - **Standard Media (`Video`, `Image`, `GIF`, `SVG`, `Lottie`)**: `fit` (`"cover"` | `"contain"` | `"fill"` | `"none"`, default `"contain"`), `volume` (0–1), `muted`, `borderRadius`, `borderColor`, `borderWidth`.
  - **Captions & Subtitles (`Caption` DataType)**: When bound to a `Caption` input (SRT source), `kind: "media"` renders time-synchronized subtitle cues:
    - `fontSize` (number, default `48`): Font size in pixels.
    - `fontFamily` (string, default `"Inter"`): Font family.
    - `fontWeight` (string | number, default `700`): Weight (`"normal"`, `"bold"`, `400`, `700`, `900`).
    - `fontStyle` (`"normal"` | `"italic"`).
    - `fill` (string, default `"#ffffff"`): Text color.
    - `align` (`"start"` | `"center"` | `"end"`, default `"center"`): Horizontal text alignment.
    - `verticalAlign` (`"top"` | `"middle"` | `"bottom"`, default `"bottom"`): Vertical alignment. When `"bottom"`, the bottom edge is anchored, and multi-line subtitle cues expand **upwards**.
    - `lineHeight` (number, default `1.2` or `fontSize * 1.2`).
    - `letterSpacing` (number, default `0`).
    - `background` (string, optional): Background box fill color behind the active subtitle text.
    - `padding` (number, optional): Inset padding around text.
    - `borderRadius` / `strokeRadius` (number, default `8`): Corner radius for background rectangle.
    - `stroke` (string) / `strokeWidth` (number): Text outline stroke.
    - `textShadow` / `shadows`: Drop shadows.
    - **Sizing & Placement**: An explicit `width` (e.g. `800` or `"80%"`) controls word-wrapping width. When `height` is omitted or `"auto"`, the engine measures the maximum height needed across all cues in the SRT file to keep layout and positioning stable throughout playback.

Layout semantics (HTML-like):
- A **flex** node with `dir: "column"` stacks children vertically; `dir: "row"` lays them horizontally.
- **block** behaves as a column container whose width fills the parent.
- **box** without children is a styled rectangle (fill + radius); with children it wraps them in a column.
- `"fill"`/`"fit"` sizes resolve against the containing block; `grow` splits leftover space.
- **absolute** nodes are removed from flow and placed at `x`/`y` of their parent's content box.
- **Text wraps**: an explicit numeric `width` wraps at that width. The node box always matches the drawn (wrapped) text.
- **Captions**: Render synchronized cues from connected SRT sources. Default to bottom alignment (`verticalAlign: "bottom"`), expanding earlier lines upwards when wrapping across multiple lines.
- **Canvas bounds**: the output is exactly `width`×`height`. Nodes may extend beyond it (large sizes, negative `x`/`y`) — anything outside the canvas is clipped in the output. Use `fit`/`contain`/`fill` and canvas-sized boxes for fully-visible media.

---

### Animation Schema (per node)
- **`tracks`** (array): Up to 24 animation tracks.
Each track represents animatable property modifications:
  - **`id`** (string, required): Unique identifier for the track.
  - **`prop`** (string, enum, required): `x`, `y`, `scale`, `rotation`, `opacity`, `width`, `height`, `volume`, `hidden`, `muted`, `fontSize`, `text` (layout-affecting props like `width`/`height`/`fontSize` re-layout the tree per frame; `text` controls progressive text reveal for typewriter, word-reveal, line-reveal, karaoke).
  - **`keyframes`** (array, required): Chronologically sorted keyframe points.
  - **`repeat`** (number, optional): GSAP loop count (e.g., -1 for infinite loops).
  - **`yoyo`** (boolean, optional): If true, animates back and forth.

#### Keyframe Schema:
  - **`id`** (string, required): Unique keyframe identifier.
  - **`frame`** (number, required): Clip-relative frame number where this keyframe is reached (`0` = node start).
  - **`value`** (number or boolean, required): Target value at this keyframe.
  - **`ease`** (object, optional): Segment easing parameters.
    - **`name`**: `none`, `power1`, `power2`, `power3`, `sine`, `circ`, `expo`, `back`, `elastic`, `bounce`, `spring`.
    - **`dir`**: `in`, `out`, `inOut`.
    - **`params`** (array of numbers): Optional easing parameter overrides (e.g. `back.out(1.7)`).

---

### Ordering / Z-Index
- Within each parent level, nodes draw in ascending `zIndex` (default `0`).
- The tree order (children array order) is the layout order; `zIndex` only breaks ties within a level.

## Output
| Handle | Type | Description |
|--------|------|-------------|
| Result | Image, Video | The final rendered composite media file. |

## Common Patterns
- **Title card:** one `flex` column (`align: "center"`, `pad`, `fill`) containing title `text`, subtitle `text`, and a `flex` row of `box` chips with `media` avatars. Animate the column's `opacity`, the row's `y`, and a media node's `scale` with keyframe tracks.
- **Video Subtitles / Captions:** Add a dynamic `Caption` input handle (e.g. `"subtitles"`). In the layout tree, place a `media` node bound to `"subtitles"` with `width: 900`, `fill: "#ffffff"`, `fontSize: 44`, `align: "center"`, `verticalAlign: "bottom"`, and place it near the bottom of the canvas (e.g. `x: 90`, `y: 880` or in a bottom-aligned flex container).
- **Watermarking a Video:** a `flex` row (`align: "end"`, `justify: "end"`, full canvas) containing a `media` node bound to the PNG input; low `opacity`.
- **Picture-in-Picture:** a `flex` row with two `media` nodes (`fit: "cover"`, each `grow: 1`).

## Don't Forget
- If text rendering required, you must include a font in spec (CLI TOOL only). By default emoji font is not loaded. NotoColorEmoji seems to be working well. Try to use NotoColorEmoji as default font for emojis.
- The `layout` tree IS the composition — there is no other layer model. Every **media** node
  needs a valid `inputHandleId` matching a connected input, and every node needs a `kind`.
- `type` is an input DataType — never put it on layout nodes; use `kind`.
- Connected inputs do NOT render automatically — build the tree explicitly.
- **Static Image Compositions:** When outputting static ad banners, posters, or graphics, set `"mode": "Image"` and ensure all connected filter nodes (such as `FilmGrain`) are configured statically (`animated: false`). Do NOT insert `ExtractFrame` nodes for static image compositions — connect `Compositor` directly to `Export`.

### Dynamic Handle Mapping (for Offline CLI Rendering)
When running the workflow headless via the Artifex CLI, dynamic inputs receive generated internal IDs (e.g., `temp-xxxx`). 
To correctly reference a dynamic input in your layout:
1. In your `spec.json`, set the `inputHandleId` of your `media` or `text` layout node to the human-readable label of the dynamic input (e.g., `"bg_canvas_handle"`).
2. The Artifex runner automatically resolves and maps these human-readable labels to the generated internal handle IDs during graph compilation.
3. This mapping is recursively applied to all string properties matching a dynamic input label in:
   - Root configuration properties
   - Compositor `layout` tree elements (`inputHandleId`)

## Example JSON Configuration
```json
{
  "width": 1920,
  "height": 1080,
  "backgroundColor": "#16130d",
  "fps": 24,
  "mode": "Video",
  "layout": [
    {
      "id": "hero",
      "kind": "flex",
      "dir": "column",
      "gap": 24,
      "padding": 80,
      "align": "center",
      "width": "fill",
      "height": "fill",
      "animation": {
        "tracks": [
          {
            "id": "hero-fade",
            "prop": "opacity",
            "keyframes": [
              { "id": "kf0", "frame": 0, "value": 0 },
              { "id": "kf1", "frame": 15, "value": 1, "ease": { "name": "power2", "dir": "out" } }
            ]
          }
        ]
      },
      "children": [
        {
          "id": "title",
          "kind": "text",
          "text": "Big Title",
          "fontSize": 96,
          "fontWeight": 900,
          "fill": "#f4ead8"
        },
        {
          "id": "subtitle",
          "kind": "text",
          "text": "Rendered by the compositor layout engine",
          "fontSize": 40,
          "fill": "#b8a88a"
        },
        {
          "id": "badges",
          "kind": "flex",
          "dir": "row",
          "gap": 16,
          "animation": {
            "tracks": [
              {
                "id": "badges-rise",
                "prop": "y",
                "keyframes": [
                  { "id": "kf0", "frame": 0, "value": 40 },
                  { "id": "kf1", "frame": 20, "value": 0, "ease": { "name": "back", "dir": "out" } }
                ]
              }
            ]
          },
          "children": [
            { "id": "chip-avatar", "kind": "box", "width": 160, "height": 48, "borderRadius": 24, "background": "#3a2f1e" },
            { "id": "chip-hero", "kind": "box", "width": 160, "height": 48, "borderRadius": 24, "background": "#3a2f1e" }
          ]
        }
      ]
    },
    {
      "id": "avatar-img",
      "kind": "media",
      "inputHandleId": "avatar",
      "fit": "cover",
      "width": 200,
      "height": 200,
      "borderRadius": 100,
      "startFrame": 0,
      "durationFrames": 72,
      "animation": {
        "tracks": [
          {
            "id": "avatar-pop",
            "prop": "scale",
            "keyframes": [
              { "id": "kf0", "frame": 0, "value": 1.15 },
              { "id": "kf1", "frame": 30, "value": 1 }
            ]
          }
        ]
      }
    },
    {
      "id": "subtitles",
      "kind": "media",
      "inputHandleId": "subtitles_handle",
      "position": "absolute",
      "x": 160,
      "y": 860,
      "width": 1600,
      "fontSize": 48,
      "fontWeight": 700,
      "fill": "#ffffff",
      "align": "center",
      "verticalAlign": "bottom",
      "stroke": "#000000",
      "strokeWidth": 4,
      "background": "#00000088",
      "padding": 16,
      "borderRadius": 12
    }
  ]
}
```
