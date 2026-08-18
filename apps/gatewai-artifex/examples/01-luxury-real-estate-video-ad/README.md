# Example 01: Luxury Real Estate Video Ad

An automated luxury architectural listing commercial video pipeline that turns property prompts into broadcast-ready, motion-stabilized, color-graded listing videos with AI narration, background soundtrack, synchronized captions, and luxury typography.

<video src="./output.mp4" controls width="100%"></video>

---

## 🎬 Pipeline Architecture

```mermaid
graph TD
    P1[Architectural Prompt] --> IG[ImageGen (OpenAI Medium)]
    IG --> CV[Curves (S-Curve Contrast)]
    CV --> SC[SelectiveColor (CMYK Foliage & Sky Pop)]
    SC --> KB[KenBurns (Cinematic Glide Motion)]
    KB --> UM[UnsharpMask (Detail Acutance)]
    KB --> FG[FilmGrain (35mm Grain)]
    
    P2[Narrator Script] --> TTS[TextToSpeech (Gemini Zephyr)]
    TTS --> CG[CaptionGenerator (Whisper SRT)]
    
    P3[Soundtrack Prompt] --> AG[AudioGenerator (AI Lounge Music)]
    
    FG --> COMP[Compositor (Overlay & Layout Engine)]
    TTS --> COMP
    CG --> COMP
    AG --> COMP
    
    COMP --> EXP[Export (.mp4)]
```

---

## 🛠 Nodes & Photoshop-Grade Finishing

1. **`ImageGen` (OpenAI GPT Image 2, Medium Quality)**: Synthesizes high-aesthetic 16:9 architectural photography.
2. **`Curves`**: RGB S-curve contrast boost with subtle warm red highlight lifting and cool blue shadow compression.
3. **`SelectiveColor`**: Surgical CMYK tuning — deepens sky cyans (`+20% Cyan`), punches landscaping foliage (`+25% Cyan`, `+35% Yellow`), and enriches true blacks.
4. **`KenBurns`**: Renders camera motion across the villa using cubic spline easing and sub-pixel motion blur.
5. **`UnsharpMask` & `FilmGrain`**: Gaussian high-frequency unsharp masking (`amount: 110%`, `radius: 1.2px`) paired with organic 35mm film grain.
6. **`TextToSpeech` & `AudioGenerator`**: Generates a smooth, sophisticated voiceover alongside an ambient chill lounge background score.
7. **`CaptionGenerator`**: Generates synchronized SRT subtitle cues.
8. **`Compositor`**: Multiplexes audio streams, places price tag badges, architectural listing title headers, and styled bottom subtitles.

---

## 🚀 Execution Guide

### Validate the Spec
```bash
artifex validate examples/01-luxury-real-estate-video-ad/spec.json
```

### Inspect the Execution Graph
```bash
artifex build examples/01-luxury-real-estate-video-ad/spec.json
```

### Run and Render
```bash
artifex run examples/01-luxury-real-estate-video-ad/spec.json --state checkpoint.json
```
Output is saved to `scratch-renders/real-estate-commercial.mp4`.
