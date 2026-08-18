# Example 05: AI Podcast Audiogram Visualizer (64s Episode)

A 64-second multi-modal podcast repurposing pipeline in a refined **Ivory Light Theme** featuring a **Seedance 2.5 Talking Female Host** (Dr. Elena Vance; 4s intro at `0–4s` and 4s outro at `60.2–64.2s` synthesized via **ByteDance Seedream 5.0** and driven by sliced Gemini `Kore` voiceover soundbites), 7 middle **KenBurns AI Infographic & Architecture scenes** (`4–60.2s`), warm tonal dynamic range calibration, speaker metadata badges, and synchronized subtitles. The content of the podcast is AI generated.

[▶️ Watch Demo Video (YouTube Shorts)](https://youtube.com/shorts/vYRM4sDqc-4)

---

## 🎬 64-Second Pipeline Timeline

| Timestamp | Duration | Scene / Asset | Nodes & Visual Technique |
|-----------|----------|---------------|--------------------------|
| **0.0s – 4.0s** | 4.0s (96f) | **Talking Avatar Intro (Dr. Elena Vance)** | `VideoGen` (Seedance 2.5 480p), `[Image1]` Host + `[Audio1]` (0–4s Slice) |
| **4.0s – 12.0s** | 8.0s (192f) | **Finite State Machine Diagram** | `ImageGen` (Seedream 5) → `Curves` → `KenBurns` (Float) → `UnsharpMask` |
| **12.0s – 20.0s** | 8.0s (192f) | **Self-Healing Automated Loop** | `ImageGen` (Seedream 5) → `ShadowsHighlights` → `KenBurns` (Drift) → `UnsharpMask` |
| **20.0s – 28.0s** | 8.0s (192f) | **Enterprise Bottlenecks Chart** | `ImageGen` (Seedream 5) → `SelectiveColor` → `KenBurns` (Pan) → `UnsharpMask` |
| **28.0s – 36.0s** | 8.0s (192f) | **Semantic Drift & Error Graph** | `ImageGen` (Seedream 5) → `Levels` → `KenBurns` (Fly-Through) → `UnsharpMask` |
| **36.0s – 44.0s** | 8.0s (192f) | **Context Latency & Memory Dashboard** | `ImageGen` (Seedream 5) → `Curves` → `KenBurns` → `UnsharpMask` |
| **44.0s – 52.0s** | 8.0s (192f) | **80% Compute Budget Metrics** | `ImageGen` (Seedream 5) → `ShadowsHighlights` → `KenBurns` → `UnsharpMask` |
| **52.0s – 60.2s** | 8.2s (196f) | **Autonomous Swarm Architecture** | `ImageGen` (Seedream 5) → `SelectiveColor` → `KenBurns` (Focus) → `UnsharpMask` |
| **60.2s – 64.2s** | 4.0s (96f) | **Talking Avatar Outro (Dr. Elena Vance)** | `VideoGen` (Seedance 2.5 480p), `[Image1]` Host + `[Audio1]` (60.2–64.2s Slice) |

---

## 🎬 Pipeline Architecture

```mermaid
graph TD
    Q[64s Script] --> TTS[TextToSpeech (Gemini Kore Female Voice)]
    TTS --> CG[CaptionGenerator (Whisper Transcriber)]
    TTS --> C1[MediaCut (0-4s Intro Slice)]
    TTS --> C2[MediaCut (60.2-64.2s Outro Slice)]
    
    A_P[Avatar Host Prompt (Ivory Theme)] --> A_IMG[ImageGen (Seedream 5.0 Host Portrait)]
    A_IMG --> V_IN[VideoGen (Seedance 2.5 Intro 0-4s)]
    C1 --> V_IN
    
    A_IMG --> V_OUT[VideoGen (Seedance 2.5 Outro 60.2-64.2s)]
    C2 --> V_OUT
    
    G1[Infographics Gen 1..7 (Seedream 5.0)] --> FX[Curves / Levels / ShadowsHighlights] --> KB[KenBurns 1..7] --> UM[UnsharpMask]
    
    V_IN --> COMP[Compositor (64s Ivory Theme Audiogram)]
    UM --> COMP
    V_OUT --> COMP
    TTS --> COMP
    CG --> COMP
    
    COMP --> EXP[Export (.mp4)]
```

---

## 🛠 Nodes & Photoshop-Grade Finishing

1. **`TextToSpeech`**: Synthesizes broadcast-quality speech (`Kore` female voice).
2. **`MediaCut` (Audio Trimming)**: Slices `0–4s` for intro avatar and `60.2–64.2s` for outro avatar.
3. **`ImageGen` (Seedream 5.0)**: ByteDance Seedream 5.0 generates high-fidelity photorealistic character reference portraits and editorial Ivory infographics.
4. **`VideoGen` (Seedance 2.5)**: Uses the Seedream 5 reference portrait and audio slices to generate realistic talking video segments with accurate lip sync.
5. **`KenBurns` (Dynamic Camera Movement)**: Smooth spline pan/zoom moves across technical diagrams.
6. **`Curves`, `Levels`, `ShadowsHighlights`, `SelectiveColor`**: Soft ivory tone curve calibration and dynamic range balancing.
7. **`UnsharpMask`**: High-frequency edge definition (radius 1.2px, amount 105–110%).
8. **`Compositor`**: Assembles 1080x1080 video with ivory backdrop `#fbfaf7`, glassmorphism header cards, speaker badges, and synchronized subtitles.
