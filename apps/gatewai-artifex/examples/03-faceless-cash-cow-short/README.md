# Example 03: Faceless Cash-Cow History Short

An automated high-retention YouTube Shorts and TikTok "cash-cow" video generator pipeline that writes dramatic, humorous historical storytelling hooks, synthesizes 5 consecutive oil paintings with 9:16 vertical framing, applies cinematic split-toning and lens vignetting, animates 5 synchronized Ken Burns camera motion trajectories, and syncs word-level subtitles with narrator voiceover.

<video src="./output.mp4" controls width="100%"></video>

---

## 🎬 Pipeline Architecture

```mermaid
graph TD
    H[Story Hook Prompt] --> LLM[LLM (Gemini 3.7 Flash Scriptwriter)]
    LLM --> TTS[TextToSpeech (Gemini Charon Narrator)]
    TTS --> CG[CaptionGenerator (Whisper Subtitles)]
    
    subgraph Scene 1: War Declared
        P1[Prompt 1] --> IG1[ImageGen 1]
        IG1 --> CB1[ColorBalance 1]
        CB1 --> KB1[KenBurns 1: Map Glide Zoom]
        KB1 --> V1[Vignette 1]
        V1 --> FG1[FilmGrain 1]
    end

    subgraph Scene 2: Heavy Artillery
        P2[Prompt 2] --> IG2[ImageGen 2]
        IG2 --> CB2[ColorBalance 2]
        CB2 --> KB2[KenBurns 2: Gun Mount Pan]
        KB2 --> V2[Vignette 2]
        V2 --> FG2[FilmGrain 2]
    end

    subgraph Scene 3: Guerrilla Emus
        P3[Prompt 3] --> IG3[ImageGen 3]
        IG3 --> CB3[ColorBalance 3]
        CB3 --> KB3[KenBurns 3: Emu Sprint Tracking]
        KB3 --> V3[Vignette 3]
        V3 --> FG3[FilmGrain 3]
    end

    subgraph Scene 4: Army Surrender
        P4[Prompt 4] --> IG4[ImageGen 4]
        IG4 --> CB4[ColorBalance 4]
        CB4 --> KB4[KenBurns 4: Defeat Slow Zoom]
        KB4 --> V4[Vignette 4]
        V4 --> FG4[FilmGrain 4]
    end

    subgraph Scene 5: Emu Overlord Victory
        P5[Prompt 5] --> IG5[ImageGen 5]
        IG5 --> CB5[ColorBalance 5]
        CB5 --> KB5[KenBurns 5: Victory Elevation]
        KB5 --> V5[Vignette 5]
        V5 --> FG5[FilmGrain 5]
    end

    FG1 --> COMP[Compositor (5-Scene Sequencer & Glowing Subtitles)]
    FG2 --> COMP
    FG3 --> COMP
    FG4 --> COMP
    FG5 --> COMP
    TTS --> COMP
    CG --> COMP
    
    COMP --> EXP[Export (.mp4)]
```

---

## 🛠 Nodes & Photoshop-Grade Finishing

1. **`LLM` (Google Gemini 3.7 Flash)**: Generates high-retention 5-sentence humorous storytelling scripts about historical events (The 1932 Great Emu War).
2. **`ImageGen` (OpenAI GPT Image 2, Medium Quality × 5)**: Renders 5 individual 9:16 vertical Rembrandt-style oil painting scenes.
3. **`ColorBalance` (× 5)**: Applies golden-age color grading (warm highlights, cool shadows) across all visual scenes.
4. **`KenBurns` (× 5)**: Animates 5 bespoke cubic-spline camera trajectories (map zooms, tactical tracking pans, elevation tilts) with sub-pixel motion blur.
5. **`Vignette` & `FilmGrain` (× 5)**: Darkens perimeter borders and overlays organic 35mm grain to establish a vintage newsreel aesthetic.
6. **`TextToSpeech`**: Deep, commanding narrator voice (`Charon`).
7. **`CaptionGenerator`**: Segment-level subtitle timestamps using Whisper AI.
8. **`Compositor`**: Sequentially layers the 5 video streams across the timeline (`startFrame` / `durationFrames`), multiplexes voiceover audio, places channel pill badge ("🏛️ WEIRD HISTORY | THE EMU WAR"), and renders bottom-aligned subtitles with heavy stroke outlines.

---

## 🚀 Execution Guide

### Validate the Spec
```bash
artifex validate examples/03-faceless-cash-cow-short/spec.json
```

### Inspect the Execution Graph
```bash
artifex build examples/03-faceless-cash-cow-short/spec.json
```

### Run and Render
```bash
artifex run examples/03-faceless-cash-cow-short/spec.json --state checkpoint.json
```
Output is saved to `scratch-renders/faceless-cash-cow-short.mp4`.
