---
name: node-catalog
description: Authoritative catalog of all supported workflow canvas nodes, with links to their respective skills.
metadata:
  triggers: list nodes, supported node types, node catalog
---

# Node Catalog

Authoritative capabilities of every registered node. Input/output handles and dynamic (variable) inputs/outputs are read directly from each node manifest at build time — the same data `artifex nodes --json` reports. Featured nodes (74).

### Media

#### Apply LUT (`ApplyLUT`)

Apply a color lookup table (.cube) to media

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
| `Lut` | LUT | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ApplyLUT Reference](file:///packages/artifex-skills/references/apply-lut.md).

---

#### Audio Compressor (`Compressor`)

Smooth out dynamic range and prevent audio clipping/distortion

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Compressor Reference](file:///packages/artifex-skills/references/compressor.md).

---

#### Delay / Echo (`Delay`)

Add repeating echo effect for audio and video

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Delay Reference](file:///packages/artifex-skills/references/delay.md).

---

#### Fade In / Fade Out (`AudioFade`)

Applies a configurable gain envelope for audio and video.

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [AudioFade Reference](file:///packages/artifex-skills/references/audio-fade.md).

---

#### Audio Noise Gate (`NoiseGate`)

Silence background noise and hum below a certain volume threshold

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [NoiseGate Reference](file:///packages/artifex-skills/references/noise-gate.md).

---

#### Parametric EQ (`ParametricEq`)

Boost or cut specific frequency ranges using biquad IIR filters

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ParametricEq Reference](file:///packages/artifex-skills/references/parametric-eq.md).

---

#### Reverb (`Reverb`)

Add room ambience and space to audio

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Reverb Reference](file:///packages/artifex-skills/references/reverb.md).

---

#### Blur (`Blur`)

Apply blur to a media

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Blur Reference](file:///packages/artifex-skills/references/blur.md).

---

#### Canvas Generator (`CanvasGenerator`)

Create blank canvases or custom gradients from scratch

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [CanvasGenerator Reference](file:///packages/artifex-skills/references/canvas-generator.md).

---

#### Channel Merger (`ChannelMerger`)

Combines up to 4 grayscale image streams into a composite color image across RGBA, HSLA, CMYK, or LAB color models.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Channel 1` | Image, SVG, Video, Lottie, GIF | yes |
| `Channel 2` | Image, SVG, Video, Lottie, GIF | yes |
| `Channel 3` | Image, SVG, Video, Lottie, GIF | yes |
| `Channel 4` | Image, SVG, Video, Lottie, GIF | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ChannelMerger Reference](file:///packages/artifex-skills/references/channel-merger.md).

---

#### Channel Splitter (`ChannelSplitter`)

Splits an image or video stream into 4 distinct single-channel grayscale images across RGBA, HSLA, CMYK, or LAB color models.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Channel 1` | Image, Video, GIF | no |
| `Channel 2` | Image, Video, GIF | no |
| `Channel 3` | Image, Video, GIF | no |
| `Channel 4` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ChannelSplitter Reference](file:///packages/artifex-skills/references/channel-splitter.md).

---

#### Color Balance (`ColorBalance`)

Shifts color balance of Shadows, Midtones, and Highlights along Cyan-Red, Magenta-Green, and Yellow-Blue axes

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ColorBalance Reference](file:///packages/artifex-skills/references/color-balance.md).

---

#### Color Key (`ColorKey`)

Key out a color (chroma key) with spill suppression

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ColorKey Reference](file:///packages/artifex-skills/references/color-key.md).

---

#### Compositor (`Compositor`)

Compose media layers using renderable inputs.

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video, Image | no |
- **Dynamic inputs:** enabled (Text, Image, Video, Audio, Caption, SVG, GIF, Lottie)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Compositor Reference](file:///packages/artifex-skills/references/compositor.md).

---

#### Corner Pin (`CornerPin`)

Four-point perspective warp

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, Video, SVG, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Warped` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [CornerPin Reference](file:///packages/artifex-skills/references/corner-pin.md).

---

#### Crop (`Crop`)

Crop media using rectangle, path, or ellipse

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, Video, SVG, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Cropped` | Image, Video, GIF | no |
| `Rest` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Crop Reference](file:///packages/artifex-skills/references/crop.md).

---

#### Color Curves (`Curves`)

Map tonal range and color balance using monotonic spline curves

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, SVG, Video, GIF, Lottie | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Curves Reference](file:///packages/artifex-skills/references/curves.md).

---

#### Displacement Map (`DisplacementMap`)

Distort media using a displacement map texture

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
| `Map` | Image, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [DisplacementMap Reference](file:///packages/artifex-skills/references/displacement-map.md).

---

#### Extract Frame (`ExtractFrame`)

Extract a single frame from a video, Lottie or GIF

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Media` | Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Frame` | Image | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ExtractFrame Reference](file:///packages/artifex-skills/references/extract-frame.md).

---

#### Extract LUT (`ExtractLUT`)

Extract a 3D LUT from two frames

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Source Frame` | Image | yes |
| `Graded Frame` | Image | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `LUT` | LUT | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ExtractLUT Reference](file:///packages/artifex-skills/references/extract-lut.md).

---

#### Film Grain (`FilmGrain`)

Apply organic, cinematic film grain texture to media

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [FilmGrain Reference](file:///packages/artifex-skills/references/film-grain.md).

---

#### Flip (`Flip`)

Mirror, flip, transpose, or reflect visual media horizontally, vertically, diagonally, or in kaleidoscopic split symmetry

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Flip Reference](file:///packages/artifex-skills/references/flip.md).

---

#### Gradient Map (`GradientMap`)

Replaces luminance values with colors sampled along a custom multi-stop color gradient

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [GradientMap Reference](file:///packages/artifex-skills/references/gradient-map.md).

---

#### Halftone Screen (`HalftoneScreen`)

Convert visual media into procedural halftone dot or CMYK raster screens with customizable angles and geometry

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [HalftoneScreen Reference](file:///packages/artifex-skills/references/halftone-screen.md).

---

#### High Pass (`HighPass`)

Extract high-frequency edge details and textures for frequency separation and sharpening

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [HighPass Reference](file:///packages/artifex-skills/references/high-pass.md).

---

#### Ken Burns (`KenBurns`)

Create a video using Ken Burns effect

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, Video, SVG, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [KenBurns Reference](file:///packages/artifex-skills/references/ken-burns.md).

---

#### Layer Style (`LayerStyle`)

Applies procedural layer styles to an alpha-isolated layer or graphic. Calculates distance field vectors, inner/outer alpha convolutions, and light elevation models to generate standard Photoshop FX.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [LayerStyle Reference](file:///packages/artifex-skills/references/layer-style.md).

---

#### Levels (`Levels`)

Adjust tonal range and color balance with input/output levels

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Levels Reference](file:///packages/artifex-skills/references/levels.md).

---

#### Liquify (`Liquify`)

Apply localized push, pull, bloat, pucker, and twirl distortions with smooth radial falloff

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Liquify Reference](file:///packages/artifex-skills/references/liquify.md).

---

#### Mask Math (`MaskMath`)

Morphological (dilate, erode, choke, feather) and Boolean set operations (union, intersect, subtract, difference, invert) on alpha/matte masks

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Mask A` | Image, SVG, Video, Lottie, GIF | yes |
| `Mask B` | Image, SVG, Video, Lottie, GIF | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [MaskMath Reference](file:///packages/artifex-skills/references/mask-math.md).

---

#### Cut (`MediaCut`)

Cut video, audio, lottie or gif by specifying start and end times.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Media` | Video, Audio, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video, Audio, Lottie, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [MediaCut Reference](file:///packages/artifex-skills/references/media-cut.md).

---

#### Mesh Warp (`MeshWarp`)

Warp media using a grid of control points

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, Video, SVG, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Warped` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [MeshWarp Reference](file:///packages/artifex-skills/references/mesh-warp.md).

---

#### Modulate (`Modulate`)

Apply Modulate adjustments to an image

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Modulate Reference](file:///packages/artifex-skills/references/modulate.md).

---

#### Noise Generator (`NoiseGenerator`)

Generate procedural Perlin, Simplex, and Voronoi noise.

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [NoiseGenerator Reference](file:///packages/artifex-skills/references/noise-generator.md).

---

#### Paint (`Paint`)

Draw / Fill Mask on an media

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Background` | Image, SVG, Video, Lottie, GIF | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
| `Mask` | Image | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Paint Reference](file:///packages/artifex-skills/references/paint.md).

---

#### Patch Heal (`PatchHeal`)

Coordinate-offset clone stamping, texture transfer, and seamless gradient healing

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
| `Mask` | Image, SVG, Video, Lottie, GIF | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [PatchHeal Reference](file:///packages/artifex-skills/references/patch-heal.md).

---

#### Refine Edge (`RefineEdge`)

Matte defringing and edge decontamination. Strips background color bleeding halos, refines edge transparency, and smoothes sub-pixel details.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
| `Matte` | Image, SVG, Video, Lottie, GIF | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [RefineEdge Reference](file:///packages/artifex-skills/references/refine-edge.md).

---

#### Resizer / Scaler (`ResizerScaler`)

Adjust aspect ratios, scale resolution, crop, and pad image/video assets.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, Video, SVG, GIF, Lottie | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ResizerScaler Reference](file:///packages/artifex-skills/references/resizer-scaler.md).

---

#### Selective Color (`SelectiveColor`)

Photoshop standard CMYK color grading across 9 targeted color ranges without edge artifacts.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [SelectiveColor Reference](file:///packages/artifex-skills/references/selective-color.md).

---

#### Shadows & Highlights (`ShadowsHighlights`)

Dynamic range recovery with independent shadow lifting, highlight suppression, and tonal width control

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ShadowsHighlights Reference](file:///packages/artifex-skills/references/shadows-highlights.md).

---

#### Vector Shape (`ShapeGenerator`)

Renders crisp, resolution-independent parametric shapes (rectangles with per-corner radii, ellipses, regular polygons, stars, arrows, custom SVG bezier paths) with solid/gradient fills, strokes, and dash patterns

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | SVG, Image | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ShapeGenerator Reference](file:///packages/artifex-skills/references/shape-generator.md).

---

#### Stereo Panning (`StereoPanning`)

Balance audio output between left and right channels

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Video | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [StereoPanning Reference](file:///packages/artifex-skills/references/stereo-panning.md).

---

#### Tile Offset (`TileOffset`)

Shifts visual media coordinates horizontally and vertically with seamless modulo wrap-around, mirror, or edge clamping for pattern design

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [TileOffset Reference](file:///packages/artifex-skills/references/tile-offset.md).

---

#### Unsharp Mask (`UnsharpMask`)

Enhance edge contrast and texture sharpness with precision Gaussian unsharp masking

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [UnsharpMask Reference](file:///packages/artifex-skills/references/unsharp-mask.md).

---

#### Video to Audio (`VideoToAudio`)

Converts a video input to an audio output.

- **Category:** Audio
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [VideoToAudio Reference](file:///packages/artifex-skills/references/video-to-audio.md).

---

#### Vignette (`Vignette`)

Apply a classic vignette effect with dark corners to visual media

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, SVG, Video, Lottie, GIF | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video, GIF | no |
- **Dynamic inputs:** enabled (Signal, Number)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Vignette Reference](file:///packages/artifex-skills/references/vignette.md).

---

### AI

#### Audio Generator (`AudioGenerator`)

Generate high-quality audio or speech using AI.

- **Category:** Audio
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio | no |
- **Dynamic inputs:** enabled (Audio, Image)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [AudioGenerator Reference](file:///packages/artifex-skills/references/audio-generator.md).

---

#### Caption Generator (`CaptionGenerator`)

Generate captions for audio or video using AI

- **Category:** Audio
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Audio, Video | yes |
| `Prompt` | Text | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Caption | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [CaptionGenerator Reference](file:///packages/artifex-skills/references/caption-generator.md).

---

#### Depth Map (`DepthMap`)

Generate a depth map from an image using AI

- **Category:** Image
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [DepthMap Reference](file:///packages/artifex-skills/references/depth-map.md).

---

#### AI Edit Video (`VideoEdit`)

Edit an existing video using AI.

- **Category:** Video
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Video` | Video | yes |
| `Prompt` | Text | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [VideoEdit Reference](file:///packages/artifex-skills/references/video-edit.md).

---

#### Extract Object (`ExtractObject`)

Segment and extract an object from an image using a prompt

- **Category:** Image
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Image` | Image | yes |
| `Prompt` | Text | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image | no |
| `Mask` | Image | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ExtractObject Reference](file:///packages/artifex-skills/references/extract-object.md).

---

#### Image Generator (`ImageGen`)

Generate or edit an image using AI

- **Category:** Image
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
| `Reference Image` | Image | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image | no |
- **Dynamic inputs:** enabled (Image)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ImageGen Reference](file:///packages/artifex-skills/references/image-gen.md).

---

#### Lip Sync (`LipSync`)

Turns any avatar image into a talking video

- **Category:** Video
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Avatar Image` | Image | yes |
| `Audio` | Audio | yes |
| `Prompt` | Text | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [LipSync Reference](file:///packages/artifex-skills/references/lip-sync.md).

---

#### LLM (`LLM`)

Prompt a large language model

- **Category:** Text
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
| `System Prompt` | Text | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Text | no |
- **Dynamic inputs:** enabled (Image)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [LLM Reference](file:///packages/artifex-skills/references/llm.md).

---

#### Lottie Generator (`LottieGen`)

Generate or Edit After Effect animations using an AI Agent.

- **Category:** Vector
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
| `Reference Image` | Image | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Lottie | no |
- **Dynamic inputs:** enabled (Image)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [LottieGen Reference](file:///packages/artifex-skills/references/lottie-gen.md).

---

#### Remove Background (`RemoveBackground`)

Remove the background from an image using AI

- **Category:** Image
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Media` | Image | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [RemoveBackground Reference](file:///packages/artifex-skills/references/remove-background.md).

---

#### Smart Cut (`SmartCut`)

Cuts media to keep the parts where speech is detected.

- **Category:** Audio
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Media` | Video, Audio | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video, Audio | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [SmartCut Reference](file:///packages/artifex-skills/references/smart-cut.md).

---

#### SVG Generator (`SvgGen`)

Generate SVG vector graphics

- **Category:** Vector
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | SVG | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [SvgGen Reference](file:///packages/artifex-skills/references/svg-gen.md).

---

#### Text to Speech (`TextToSpeech`)

Create speech from text

- **Category:** Audio
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
| `Style Instructions` | Text | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [TextToSpeech Reference](file:///packages/artifex-skills/references/text-to-speech.md).

---

#### AI Upscaler (`Upscaler`)

Upscale and enhance image or video assets using AI.

- **Category:** Media Enhancement
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Image, Video | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Image, Video | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Upscaler Reference](file:///packages/artifex-skills/references/upscaler.md).

---

#### Video Generator (`VideoGen`)

A video generation node.

- **Category:** Video
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video | no |
- **Dynamic inputs:** enabled (Image, Video, Audio)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [VideoGen Reference](file:///packages/artifex-skills/references/video-gen.md).

---

#### First to last frame video (`VideoGenFirstLastFrame`)

Generate videos using first and last frame images

- **Category:** Video
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Prompt` | Text | yes |
| `First Frame` | Image | yes |
| `Last Frame` | Image | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Video | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [VideoGenFirstLastFrame Reference](file:///packages/artifex-skills/references/video-gen-first-last-frame.md).

---

#### Video to Music (`VideoToMusic`)

Analyzes your video’s to generate a frame-synced soundtrack in seconds

- **Category:** Audio
- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Video` | Video | yes |
| `Prompt` | Text | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [VideoToMusic Reference](file:///packages/artifex-skills/references/video-to-music.md).

---

### Input/Output

#### Caption Builder (`CaptionEditor`)

Create captions manually in SRT format

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Caption | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [CaptionEditor Reference](file:///packages/artifex-skills/references/caption-editor.md).

---

#### Export (`Export`)

An UI download / API output node

- **Terminal node:** produces a final renderable output
- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Text, Image, Video, Audio, SVG, LUT, Caption, Lottie, GIF | yes |
- **Outputs:**
_none_
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Export Reference](file:///packages/artifex-skills/references/export.md).

---

#### Import (`Import`)

Upload your files

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Audio, Image, Video, SVG, Caption, Lottie, LUT, GIF | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Import Reference](file:///packages/artifex-skills/references/import.md).

---

#### Number (`Number`)

Number input node

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Number | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Number Reference](file:///packages/artifex-skills/references/number.md).

---

#### Recorder (`Recorder`)

Record your screen, camera and microphone

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Screen` | Video | no |
| `Camera` | Video | no |
| `Mic` | Audio | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Recorder Reference](file:///packages/artifex-skills/references/recorder.md).

---

#### Text (`Text`)

Text (prompt) input node

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Text | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Text Reference](file:///packages/artifex-skills/references/text.md).

---

#### Webhook (`Webhook`)

Sends workflow outputs to an external URL as a JSON web request.

- **Terminal node:** produces a final renderable output
- **Inputs:**
_none_
- **Outputs:**
_none_
- **Dynamic inputs:** enabled (Text, Image, Video, Audio, Caption, SVG, GIF, Lottie)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Webhook Reference](file:///packages/artifex-skills/references/webhook.md).

---

### Utilities

#### Sticky Note (`Note`)

A sticky note

- **Inputs:**
_none_
- **Outputs:**
_none_
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Note Reference](file:///packages/artifex-skills/references/note.md).

---

#### Preview (`Preview`)

Preview the output of a connected node

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Input` | Video, Image, Text, Audio, SVG, GIF, Lottie, Signal | yes |
- **Outputs:**
_none_
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [Preview Reference](file:///packages/artifex-skills/references/preview.md).

---

#### Text Merger (`TextMerger`)

Merges connected texts.

- **Inputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Text` | Text | no |
| `Text 2` | Text | no |
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Merged Text` | Text | no |
- **Dynamic inputs:** enabled (Text)
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [TextMerger Reference](file:///packages/artifex-skills/references/text-merger.md).

---

### Signal

#### Procedural Signal (`ProceduralSignal`)

Create procedural Signals.

- **Inputs:**
_none_
- **Outputs:**
| Handle | Types | Required |
|--------|-------|----------|
| `Result` | Signal | no |
- **Dynamic inputs:** no
- **Dynamic outputs:** no

For detailed usage rules, config parameters, and examples for this node, see [ProceduralSignal Reference](file:///packages/artifex-skills/references/procedural-signal.md).

---

