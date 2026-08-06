import { L as isMultiModal, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, j as findSourceAsset, k as createVirtualMedia, w as VirtualMediaDataSchema } from "./dist-CJI3Jl43.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-ClH_dFot.mjs";
import { n as runCodeGenAgent, r as tool, t as createCodeGenAgent } from "./server-COr-c1W7.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-html-video-gen/dist/metadata-D8EKgjQ8.mjs
const HTML_VIDEO_GEN_MODELS = [
	"gpt-5.6-terra",
	"gpt-5.6-luna",
	"gpt-5.6-sol",
	"google/gemini-3.5-flash",
	"deepseek/deepseek-v4-pro",
	"~deepseek/deepseek-v4-flash-latest"
];
const HTMLVideoGenNodeConfigSchema = z$1.object({
	model: z$1.enum(HTML_VIDEO_GEN_MODELS).default("gpt-5.6-luna"),
	width: z$1.number().min(1).max(4096).default(1280),
	height: z$1.number().min(1).max(4096).default(720),
	fps: z$1.number().min(12).max(60).default(24),
	durationSeconds: z$1.number().min(.5).max(3600).default(5)
}).strict();
const HTMLVideoGenResultSchema = MultiOutputGenericSchema(z$1.union([createOutputItemSchema(z$1.literal("Text"), z$1.string()), createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema)]));
const MAX_REFERENCE_IMAGES = 4;
const BASE_RATES = {
	"gpt-5.6-sol": 10,
	"gpt-5.6-terra": 5,
	"gpt-5.6-luna": 3,
	"google/gemini-3.5-flash": 2.25,
	"deepseek/deepseek-v4-pro": 2,
	"~deepseek/deepseek-v4-flash-latest": 1
};
const metadata = defineMetadata({
	type: "HTMLVideoGen",
	displayName: "Motion Video Generator",
	description: "Prompt Agent to create animated motion videos",
	category: "AI",
	subcategory: "Video",
	configSchema: HTMLVideoGenNodeConfigSchema,
	resultSchema: HTMLVideoGenResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: [
			"Image",
			"Video",
			"SVG",
			"Caption",
			"Lottie"
		]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}],
		outputs: [{
			dataTypes: ["Text"],
			label: "HTML Result",
			order: 1
		}, {
			dataTypes: ["Video"],
			label: "Video Result",
			order: 0
		}]
	},
	defaultConfig: {
		model: "gpt-5.6-luna",
		width: 1280,
		height: 720,
		fps: 24,
		durationSeconds: 10
	},
	pricing: (config) => {
		const duration = Number(config.durationSeconds || 5);
		const baseRate = BASE_RATES[config.model] ?? 5;
		let price = 0;
		if (duration <= 10) price = duration * baseRate;
		else if (duration <= 30) price = 10 * baseRate + (duration - 10) * baseRate * .75;
		else price = 10 * baseRate + 20 * baseRate * .75 + (duration - 30) * baseRate * .5;
		return Math.ceil(price);
	}
});

//#endregion
//#region ../../nodes/node-html-video-gen/dist/server.mjs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getSkillsDir = () => {
	const prodPath = path.join(__dirname, "skills");
	if (fs.existsSync(prodPath)) return prodPath;
	return __dirname;
};
const DEFAULT_SKILL_DIR = getSkillsDir();
var HtmlVideoGenSkillManager = class {
	skillsDir;
	constructor(skillsDir = DEFAULT_SKILL_DIR) {
		this.skillsDir = skillsDir;
	}
	/**
	* Get the main control plane skill content (hyperframes/SKILL.md)
	* with YAML frontmatter stripped.
	*/
	getControlPlane() {
		const controlPlanePath = path.join(this.skillsDir, "hyperframes", "SKILL.md");
		if (!fs.existsSync(controlPlanePath)) throw new Error(`Control plane SKILL.md not found at "${controlPlanePath}".`);
		return fs.readFileSync(controlPlanePath, "utf-8").replace(/^---\n[\s\S]*?\n---\n\n?/m, "").trim();
	}
	/**
	* List all available skills by searching the skills directory and parsing frontmatter.
	*/
	async listSkills() {
		if (!fs.existsSync(this.skillsDir)) return [];
		const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });
		const skills = [];
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			const skillPath = path.join(this.skillsDir, entry.name, "SKILL.md");
			if (!fs.existsSync(skillPath)) continue;
			try {
				const content = fs.readFileSync(skillPath, "utf-8");
				const info = this.parseFrontmatter(content);
				skills.push({
					name: info.name || entry.name,
					description: info.description || ""
				});
			} catch {}
		}
		return skills.sort((a, b) => a.name.localeCompare(b.name));
	}
	/**
	* Get specific skill file content. Safe against directory traversal.
	* If skillPath resolves to a directory, reads SKILL.md under it.
	*/
	getSkill(skillPath) {
		if (typeof skillPath !== "string") throw new Error("Skill path must be a string");
		const sanitized = path.normalize(skillPath).replace(/^(\.\.(\/|\\|$))+/, "");
		let targetPath = path.join(this.skillsDir, sanitized);
		if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) targetPath = path.join(targetPath, "SKILL.md");
		if (!fs.existsSync(targetPath) && !path.extname(targetPath)) targetPath += ".md";
		if (!fs.existsSync(targetPath)) throw new Error(`Skill file not found: "${skillPath}"`);
		return fs.readFileSync(targetPath, "utf-8");
	}
	/**
	* Parse simple YAML frontmatter.
	*/
	parseFrontmatter(content) {
		const match = content.match(/^---\n([\s\S]*?)\n---/);
		if (!match) return {
			name: "",
			description: ""
		};
		const lines = match[1].split("\n");
		let name = "";
		let description = "";
		let inDescription = false;
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed.startsWith("name:")) {
				name = trimmed.substring(5).trim();
				inDescription = false;
			} else if (trimmed.startsWith("description:")) {
				description = trimmed.substring(12).trim();
				if (description === ">" || description === "|") {
					description = "";
					inDescription = true;
				} else inDescription = false;
			} else if (inDescription) {
				if (trimmed === "") continue;
				if (description) description += " ";
				description += trimmed;
			}
		}
		return {
			name,
			description
		};
	}
};
const htmlVideoGenSkillManager = new HtmlVideoGenSkillManager();
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const MAX_RETRIES = 4;
const HtmlSandboxResultSchema = z$1.object({ html: z$1.string().min(1) });
function buildSystemPrompt(width, height, fps, durationSeconds, images, videos, svgs, captions, skillControlPlane, lotties) {
	let referenceSection = "";
	if (images && images.length > 0) referenceSection += `\n## Reference Images:\n` + images.map((img, i) => {
		const meta = img.metadata;
		const metaParts = [];
		if (meta) {
			if (meta.width != null) metaParts.push(`Width: ${meta.width}px`);
			if (meta.height != null) metaParts.push(`Height: ${meta.height}px`);
		}
		const metaStr = metaParts.length > 0 ? ` (${metaParts.join(", ")})` : "";
		return `- Image ${i + 1}: ${img.url}${metaStr}`;
	}).join("\n") + `\nUse these reference images for visual design, layout, styling, and color inspiration when constructing the HTML animation. You can load these images using standard <img> tags with the crossorigin="anonymous" attribute.\n`;
	if (videos && videos.length > 0) referenceSection += `\n## Reference Videos (MUST BE EMBEDDED IN HTML):\n` + videos.map((vid, i) => {
		const meta = vid.metadata;
		const metaParts = [];
		if (meta) {
			if (meta.width != null) metaParts.push(`Width: ${meta.width}px`);
			if (meta.height != null) metaParts.push(`Height: ${meta.height}px`);
			if (meta.fps != null) metaParts.push(`FPS: ${meta.fps}`);
			if (meta.durationMs != null) metaParts.push(`Duration: ${(meta.durationMs / 1e3).toFixed(2)}s`);
		}
		const metaStr = metaParts.length > 0 ? ` (${metaParts.join(", ")})` : "";
		return `- Video ${i + 1}: ${vid.url}${metaStr}`;
	}).join("\n") + `
CRITICAL MANDATORY INSTRUCTION FOR REFERENCE VIDEOS:
The user has attached reference video(s) for this animation. You MUST embed the video(s) into your HTML output using <video> tag(s) with the exact URL provided in the reference section.
Example <video> element structure:
\`\`\`html
<video
  id="ref-video-1"
  data-start="0"
  data-duration="${durationSeconds}"\n  data-track-index="0"\n  data-media-start="0"\n  src="${videos[0].url}"\n  playsinline muted loop\n></video>\n\`\`\`\nApply CSS transformations (3D transforms, scale, rotation, clipping, mask, border-radius, perspective, etc.) and GSAP timeline animations directly to the <video> element or its wrapper container element so the user's actual attached video is displayed and animated in the composition!\n`;
	if (svgs && svgs.length > 0) referenceSection += `\n## Reference SVGs:\n` + svgs.map((svg, i) => {
		const meta = svg.metadata;
		const metaParts = [];
		if (meta) {
			if (meta.width != null) metaParts.push(`Width: ${meta.width}px`);
			if (meta.height != null) metaParts.push(`Height: ${meta.height}px`);
		}
		const metaStr = metaParts.length > 0 ? ` (${metaParts.join(", ")})` : "";
		return `- SVG ${i + 1}: ${svg.url}${metaStr}`;
	}).join("\n") + `\nUse these reference SVG graphics (icons, logos, custom shapes) in the HTML content. You can load these SVGs using standard <img> tags with the crossorigin="anonymous" attribute or fetch and embed them inline if appropriate.\n`;
	if (lotties && lotties.length > 0) referenceSection += `\n## Reference Lottie Animations:\n` + lotties.map((lot, i) => {
		const meta = lot.metadata;
		const metaParts = [];
		if (meta) {
			if (meta.width != null) metaParts.push(`Width: ${meta.width}px`);
			if (meta.height != null) metaParts.push(`Height: ${meta.height}px`);
			if (meta.fps != null) metaParts.push(`FPS: ${meta.fps}`);
			if (meta.durationMs != null) metaParts.push(`Duration: ${meta.durationMs}ms`);
		}
		const metaStr = metaParts.length > 0 ? ` (${metaParts.join(", ")})` : "";
		return `- Lottie ${i + 1}: ${lot.url}${metaStr}`;
	}).join("\n") + `
Use these reference Lottie JSON animations in the HTML content. You can load Lottie animations using the bodymovin / lottie-web library from CDN:
\`\`\`html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"><\/script>
\`\`\`
And initialize them and register to HyperFrames like so:
\`\`\`javascript
const anim = lottie.loadAnimation({
  container: document.getElementById('lottie-container'), // make sure to define this container div in your HTML
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: '${lotties[0].url}' // example Lottie URL\n});\nwindow.__hfLottie = window.__hfLottie || [];\nwindow.__hfLottie.push(anim);\n\`\`\`\nHyperFrames will automatically detect any animations in \`window.__hfLottie\` and seek them synchronously with the main animation timeline.\n`;
	if (captions && captions.length > 0) referenceSection += `\n## Reference Captions/Subtitles (SRT format):\n` + captions.map((srt, i) => `### Caption ${i + 1}:\n\`\`\`srt\n${srt}\n\`\`\``).join("\n\n") + `\nUse these captions/subtitles to synchronize animations, typography, text callouts, or subtitle overlays in the HTML/GSAP animation based on the timestamps in the SRT content.\n`;
	let skillSection = "";
	if (skillControlPlane) skillSection = `
## HTML Video Generation Skill Guide (General):
1. **FIRST STEP**: You MUST call the \`read_skill\` tool to fetch technical references, transition easing formulas, layout helpers, and design best practices relevant to the user's prompt and references before writing code.
2. **SECOND STEP**: Based on the skill knowledge you retrieve, write the complete, valid seekable HTML/GSAP animation.

${skillControlPlane}
`;
	return `# Role: Principal Front-End Web Animation Architect
 
You are an expert HTML5, CSS3, GSAP and ThreeJS animation engineer. You construct self-contained, high-performance seekable HTML animations.
 
## Output Requirements:
1. Construct a complete single-file HTML document (must start with \`<!DOCTYPE html>\` and contain proper \`<html>\`, \`<head>\`, and \`<body>\` tags — NEVER output a fragment or bare element).
2. Set up layout with full-bleed styling (e.g. 100vw/100vh or absolute layout sized to target dimensions).
3. MANDATORY HYPERFRAMES TIMELINE REGISTRATION:
   If you use GSAP, you MUST create a paused GSAP timeline and register it on \`window.__timelines\`:
   \`\`\`javascript
   window.__timelines = window.__timelines || {};
   window.__timelines["main"] = tl;
   \`\`\`
   The runtime discovers timelines from this registry — without \`window.__timelines\` registration, animations will NOT play during preview or video rendering.
4. Load GSAP CDN in \`<head>\` if using GSAP: \`<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js" defer><\/script>\`. To prevent browser warnings about "parser-blocking cross-site scripts", ALWAYS add the \`defer\` attribute to all external CDN \`<script>\` tags (e.g., \`<script src="..." defer><\/script>\`).
5. To prevent race conditions and "ReferenceError: XXX is not defined" (when external CDN scripts load asynchronously), ALWAYS wrap your main inline javascript code in a dependency-ready loader/checker. Do not execute any setup code until all used libraries (such as \`gsap\`, \`THREE\`, \`Splitting\`, etc.) are fully defined:
   \`\`\`javascript
   (function() {
     function init() {
       // Check if all needed external libraries are defined
       if (typeof gsap === 'undefined' || (document.getElementById('three') && typeof THREE === 'undefined') || (document.querySelector('[data-splitting]') && typeof Splitting === 'undefined')) {
         window.addEventListener('load', init);
         setTimeout(init, 30);
         return;
       }
       window.removeEventListener('load', init);
       if (window.__gatewai_initialized) return;
       window.__gatewai_initialized = true;

       // Initialize GSAP Timeline (MUST BE PAUSED)
       const tl = gsap.timeline({ paused: true });

       // ... add your animations to tl ...

       // Register timeline in HyperFrames registry (MANDATORY)
       window.__timelines = window.__timelines || {};
       window.__timelines["main"] = tl;
     }
     init();
   })();
   \`\`\`
6. Syntax Safety: All JavaScript code inside \`<script>\` tags MUST be valid, error-free JavaScript. Double check for unmatched parentheses, brackets, or syntax typos.
7. CORS Security for Canvas Drawing: Any external images, SVGs, or media files referenced from external URLs (including CDN assets) loaded via \`<img>\` tags MUST include the attribute \`crossorigin="anonymous"\`.
8. GSAP Opacity Transition Guard: NEVER animate opacity using \`gsap.from()\` if the CSS of the target element already has \`opacity: 0\` (this results in a 0 to 0 animation that stays invisible). Instead, either set CSS static style to \`opacity: 1\` and use \`gsap.from(..., { opacity: 0 })\` or keep CSS at \`opacity: 0\` and use \`gsap.to(..., { opacity: 1 })\`.
9. Target Resolution: ${width}x${height} pixels.
10. Target Frame Rate: ${fps} FPS.
11. Target Duration: ${durationSeconds} seconds.
12. Use Pastel Colors with white theme if no color is specified. ( pastel teal, pastel pink, pastel yellow, pastel purple, pastel orange, pastel mint, etc.).

## Video & Audio Element Specification (HyperFrames Schema):
When using video or audio elements in the composition, ensure they carry the correct HyperFrames data attributes so frame extraction and audio mixing process correctly. Video and audio media can be loaded from local relative asset URLs or remote HTTP/HTTPS URLs.

**Video Element Format:**
\`\`\`html
<video
  id="el-1"
  data-start="0"
  data-duration="15"
  data-track-index="0"
  data-media-start="0"
  src="./assets/video.mp4"
></video>
\`\`\`

**Audio Element Format:**
\`\`\`html
<audio
  id="el-4"
  data-start="0"
  data-duration="30"
  data-track-index="2"
  src="./assets/music.mp3"
></audio>
\`\`\`

**Key Attributes:**
| Attribute | Required | Description |
|---|---|---|
| \`id\` | Yes | Unique identifier |
| \`data-start\` | Yes | Start time in seconds |
| \`data-track-index\` | Yes | Track number / z-order |
| \`data-duration\` | Optional | Defaults to source duration |
| \`data-media-start\` | No | Trim/offset in source file (default \`0\`) |
| \`data-playback-rate\` | No | Speed multiplier \`0.1\`–\`5\` |
| \`data-volume\` | No | Volume \`0\`–\`1\` |
| \`data-has-audio\` | No | \`"true"\` if video has audio track |

Note: \`class="clip"\` is **omitted** for audio-only elements (\`<audio>\`).

## Supported UI & Visual Libraries (CDN Stack):
You can use the following visual libraries by loading them from CDN in your HTML. All animations and library updates must be seek-safe (frame-accurate) when scrubbed via the registered GSAP timeline.

### 1. Styling & Visual Foundations
- **Tailwind CSS (v4)**:
  - CDN: \`<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.2.4" defer><\/script>\`
  - Rules: Define styles inside \`<style type="text/tailwindcss">\`. Use Tailwind v4 features. Do NOT use CSS transition-delay or keyframe animations; GSAP must drive all movement.
- **DaisyUI**:
  - CDN: \`<link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css" rel="stylesheet" type="text/css" />\`
  - Rules: Use clean, CSS-only Tailwind UI components (badges, stats, cards) without JS overhead.
- **Glassmorphism / HUD Design**: Use modern CSS backdrop-filters (\`backdrop-blur\`), custom gradients, and multi-layered box-shadows.

### 2. Kinetic Typography & Titles
- **Splitting.js**:
  - CDN: \`<script src="https://unpkg.com/splitting/dist/splitting.min.js" defer><\/script>\` and \`<link rel="stylesheet" href="https://unpkg.com/splitting/dist/splitting.css" />\`
  - Usage: Call \`Splitting();\` on DOM load to split text into chars/words, then animate them using GSAP:
    \`\`\`javascript
    Splitting();
    tl.from(".char", { opacity: 0, y: 15, stagger: 0.05, ease: "power2.out" }, 0.5);
    \`\`\`
- **Baffle.js**:
  - CDN: \`<script src="https://cdn.jsdelivr.net/npm/baffle@0.3.6/dist/baffle.min.js" defer><\/script>\`
  - Seekability Rule: Do NOT call \`.start()\` (not seekable). Instead, create the baffle instance and drive the text scramble/reveal using a GSAP timeline proxy:
    \`\`\`javascript
    const b = baffle('.scramble-text').once();
    const scrambleProxy = { progress: 0 };
    tl.to(scrambleProxy, {
      progress: 1,
      duration: 1.0,
      onUpdate: () => {
        b.reveal(scrambleProxy.progress * 1000, 0);
      }
    }, 1.0);
    \`\`\`

### 3. Data Visualization & Motion Overlays
- **ECharts**:
  - CDN: \`<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer><\/script>\`
  - Seekability Rule: Disable default transitions (\`animation: false\`). Drive chart options or series data via a GSAP proxy, calling \`chart.setOption(...)\` on GSAP's \`onUpdate\`.
- **Chart.js**:
  - CDN: \`<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.js" defer><\/script>\`
  - Seekability Rule: Disable default animations (\`options: { animation: false, responsive: false }\`). Update chart data via a GSAP proxy, calling \`chart.update()\` on GSAP's \`onUpdate\`.
- **Lucide Icons**:
  - CDN: \`<script src="https://unpkg.com/lucide@latest" defer><\/script>\`
  - Usage: Run \`lucide.createIcons();\` on DOM load, or use inline SVGs for stroke drawing.

### 4. Canvas & Shader Effects
- **Curtains.js**:
  - CDN: \`<script src="https://cdn.jsdelivr.net/npm/curtainsjs@8.1.6/dist/curtains.umd.min.js" defer><\/script>\`
  - Seekability Rule: Drive WebGL custom uniform variables (e.g. \`uTime\`, \`uProgress\`) via a GSAP proxy instead of the curtains auto-draw loop.
- **PixiJS**:
  - CDN: \`<script src="https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/dist/pixi.min.js" defer><\/script>\`
  - Seekability Rule: Turn off Pixi's auto-ticker (\`app.ticker.stop()\`). Control updates and rendering manually using a GSAP proxy to advance ticker time and call render on GSAP \`onUpdate\`:
    \`\`\`javascript
    app.ticker.stop();
    const pixiProxy = { time: 0 };
    tl.to(pixiProxy, {
      time: duration,
      duration: duration,
      ease: "none",
      onUpdate: () => {
        app.ticker.update(pixiProxy.time * 1000);
        app.renderer.render(app.stage);
      }
    }, 0);
    \`\`\`
- **Two.js / Paper.js**:
  - Two.js CDN: \`<script src="https://cdn.jsdelivr.net/npm/two.js@0.8.10/build/two.min.js" defer><\/script>\`
  - Paper.js CDN: \`<script src="https://cdn.jsdelivr.net/npm/paper@0.12.17/dist/paper-full.min.js" defer><\/script>\`
  - Seekability Rule: Manually call \`two.update()\` or \`paper.view.draw()\` in the GSAP \`onUpdate\` callback.

${referenceSection}
## Required Return JSON Format:
Return an object containing a single \`html\` key with the generated HTML document code string:
\`\`\`javascript
return {
  html: "<!DOCTYPE html><html>...</html>"
};
\`\`\`
 
${skillSection}
`.trim();
}
function createSkillTools() {
	return [tool({
		name: "list_skills",
		description: "List all available HTML video generation skills, motion graphics techniques, and best practices.",
		parameters: z$1.object({}),
		async execute() {
			try {
				const list = await htmlVideoGenSkillManager.listSkills();
				return JSON.stringify(list, null, 2);
			} catch (err) {
				return `Error listing skills: ${err instanceof Error ? err.message : String(err)}`;
			}
		}
	}), tool({
		name: "read_skill",
		description: "Read detailed guidelines, transitions, formulas, design patterns, and code specs for a specific skill or topic.",
		parameters: z$1.object({ skillName: z$1.string().describe("The name of the skill or path to the file to read, e.g. 'hyperframes-core' or 'hyperframes-animation/techniques.md'") }),
		async execute({ skillName }) {
			try {
				return htmlVideoGenSkillManager.getSkill(skillName);
			} catch (err) {
				return `Error reading skill "${skillName}": ${err instanceof Error ? err.message : String(err)}`;
			}
		}
	})];
}
let HtmlVideoGenProcessor = class HtmlVideoGenProcessor$1 {
	graph;
	aiProvider;
	mediaResolver;
	env;
	storage;
	prisma;
	mediaRenderer;
	constructor() {}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const userPrompt = resolver.input("Prompt").required().asText();
			if (!userPrompt?.trim()) return {
				success: false,
				error: "Prompt is required."
			};
			const nodeConfig = HTMLVideoGenNodeConfigSchema.parse(node.config);
			const imageInputs = resolver.inputs().as("Image").allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0)).slice(0, MAX_REFERENCE_IMAGES);
			const imageObjects = await Promise.all(imageInputs.map(async (r) => {
				const mediaData = r.value.data;
				const result$1 = await this.mediaResolver.resolveToUrl(mediaData, "Image", { userId: data.canvas.userId });
				if (!result$1.url) throw new Error("Failed to resolve image URL");
				return {
					url: result$1.url,
					metadata: mediaData.metadata
				};
			}));
			const imageUrls = imageObjects.map((o) => o.url);
			const videoInputs = resolver.inputs().as("Video").allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0)).slice(0, MAX_REFERENCE_IMAGES);
			const videoObjects = await Promise.all(videoInputs.map(async (r) => {
				const mediaData = r.value.data;
				const result$1 = await this.mediaResolver.resolveToUrl(mediaData, "Video", { userId: data.canvas.userId });
				if (!result$1.url) throw new Error("Failed to resolve video URL");
				return {
					url: result$1.url,
					metadata: mediaData.metadata
				};
			}));
			const videoUrls = videoObjects.map((o) => o.url);
			const svgInputs = resolver.inputs().as("SVG").allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0)).slice(0, MAX_REFERENCE_IMAGES);
			const svgObjects = await Promise.all(svgInputs.map(async (r) => {
				const mediaData = r.value.data;
				return {
					url: await this.getSourceUrl(mediaData),
					metadata: mediaData.metadata
				};
			}));
			const svgUrls = svgObjects.map((o) => o.url);
			const captionInputs = resolver.inputs().as("Caption").allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0)).slice(0, MAX_REFERENCE_IMAGES);
			const captions = (await Promise.all(captionInputs.map(async (r) => {
				const captionData = r.value.data;
				try {
					const resolved = await this.mediaResolver.resolveToUrl(captionData, "Caption", { userId: data.canvas.userId });
					if (resolved.url) {
						const res = await fetch(resolved.url);
						if (res.ok) return await res.text();
						logger.warn(`Failed to fetch caption file content: ${res.statusText}`);
					}
				} catch (e) {
					logger.warn(`Failed to resolve caption data: ${e instanceof Error ? e.message : String(e)}`);
				}
				return null;
			}))).filter((srt) => typeof srt === "string" && srt.trim().length > 0);
			const lottieInputs = resolver.inputs().as("Lottie").allWithHandle().filter((r) => r.value != null).sort((a, b) => (a.handle?.order ?? 0) - (b.handle?.order ?? 0)).slice(0, MAX_REFERENCE_IMAGES);
			const lottieObjects = await Promise.all(lottieInputs.map(async (r) => {
				const mediaData = r.value.data;
				return {
					url: await this.getSourceUrl(mediaData),
					metadata: mediaData.metadata
				};
			}));
			const lottieUrls = lottieObjects.map((o) => o.url);
			const { agent, resultStore } = createCodeGenAgent({
				name: "HTMLVideoGenAgent",
				model: this.aiProvider.getAgentModel(nodeConfig.model, data.task?.id),
				systemPrompt: buildSystemPrompt(nodeConfig.width, nodeConfig.height, nodeConfig.fps, nodeConfig.durationSeconds, imageObjects, videoObjects, svgObjects, captions, htmlVideoGenSkillManager.getControlPlane(), lottieObjects),
				globals: {
					prompt: userPrompt,
					imageUrls,
					videoUrls,
					svgUrls,
					lottieUrls,
					captions
				},
				tools: createSkillTools(),
				resultSchema: HtmlSandboxResultSchema,
				maxRetries: MAX_RETRIES,
				timeoutMs: 45e3,
				async lint(result$1) {
					try {
						const problems = [];
						const { lintHyperframeHtml } = await import("./dist-DelZkKu6.mjs");
						const lintResult = await lintHyperframeHtml(result$1.html);
						if (!lintResult.ok && lintResult.findings.length > 0) {
							const linterProblems = lintResult.findings.filter((f) => f.severity === "error" || f.severity === "warning");
							for (const p of linterProblems) {
								let msg = `[${p.severity.toUpperCase()}] ${p.message}`;
								if (p.fixHint) msg += ` (Hint: ${p.fixHint})`;
								if (p.snippet) msg += `\n    Snippet: ${p.snippet}`;
								problems.push(msg);
							}
						}
						if (problems.length > 0) return problems;
					} catch (err) {
						const errMsg = err instanceof Error ? err.message : String(err);
						logger.error(`Error executing HTML linter: ${errMsg}`);
						return [`[ERROR] HTML linter exception / syntax error: ${errMsg}`];
					}
					return null;
				}
			});
			const promptText = `Generate a high-quality seekable HTML/GSAP animation matching prompt: "${userPrompt}". You can use styling and visual libraries (Tailwind CSS v4, DaisyUI), kinetic typography (Splitting.js, Baffle.js), data visualization (ECharts, Chart.js), icons (Lucide SVGs), and WebGL/Canvas engines (Curtains.js, PixiJS, Two.js/Paper.js) if requested or suitable. Remember to call the read_skill tool first to fetch relevant guidelines, easing formulas, or techniques before generating code.`;
			let runPrompt;
			if (imageUrls.length > 0 && isMultiModal(nodeConfig.model)) runPrompt = [{
				role: "user",
				content: [{
					type: "input_text",
					text: promptText
				}, ...imageUrls.map((url) => ({
					type: "input_image",
					image: url
				}))]
			}];
			else runPrompt = promptText;
			const result = await runCodeGenAgent({
				agent,
				resultStore,
				prompt: runPrompt
			});
			if (!result?.html) return {
				success: false,
				error: "Agent failed to return valid HTML code after maximum retries."
			};
			const generatedHtml = result.html;
			logger.info(`Rendering HTML content to MP4 video for node: ${node.id} via mediaRenderer service`);
			const renderResult = await this.mediaRenderer.renderHtmlVideo(generatedHtml, { userId: data.canvas.userId });
			let asset;
			if (renderResult.assetId) {
				asset = await this.prisma.fileAsset.findUnique({ where: { id: renderResult.assetId } });
				if (!asset) throw new Error(`FileAsset not found for id: ${renderResult.assetId}`);
			} else {
				const key = renderResult.fileKey;
				if (!key) throw new Error("Renderer failed to return assetId or fileKey.");
				const filename = path.basename(key);
				const { width, height, fps, durationMs } = renderResult.metadata || {};
				asset = await this.prisma.fileAsset.create({ data: {
					name: filename,
					userId: data.canvas.userId,
					bucket: this.env.R2_ASSETS_BUCKET,
					key,
					size: 0,
					width: width ?? null,
					height: height ?? null,
					fps: fps ?? null,
					duration: durationMs ?? null,
					mimeType: "video/mp4",
					isUploaded: true
				} });
			}
			const videoVirtualMedia = createVirtualMedia({ entity: asset }, "Video");
			const outputHandles = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output");
			const htmlOutputHandle = outputHandles.find((h) => h.label === "HTML Result" || h.dataTypes.includes("Text")) || outputHandles[0];
			const videoOutputHandle = outputHandles.find((h) => h.label === "Video Result" || h.dataTypes.includes("Video")) || outputHandles[1] || outputHandles[0];
			if (!htmlOutputHandle || !videoOutputHandle) return {
				success: false,
				error: "Output handles are missing."
			};
			const newResult = structuredClone(node.result) ?? {
				outputs: [],
				selectedOutputIndex: 0
			};
			newResult.outputs.push({ items: [{
				type: "Video",
				data: videoVirtualMedia,
				outputHandleId: videoOutputHandle.id
			}, {
				type: "Text",
				data: generatedHtml,
				outputHandleId: htmlOutputHandle.id
			}] });
			newResult.selectedOutputIndex = newResult.outputs.length - 1;
			return {
				success: true,
				newResult
			};
		} catch (err) {
			logger.error({
				err,
				nodeId: node.id,
				nodeType: node.type
			}, "HTML Video Generation Failed");
			return {
				success: false,
				error: err instanceof Error ? err.message : "HTML Video Generation failed"
			};
		}
	}
	async getSourceUrl(media) {
		const key = findSourceAsset(media)?.entity?.key;
		if (!key) throw new Error("Failed to find key for source asset");
		if (this.env.R2_CUSTOM_DOMAIN) return `https://${this.env.R2_CUSTOM_DOMAIN}/${this.encodeKey(key)}`;
		const url = await this.storage.generateSignedUrl(key, this.env.R2_ASSETS_BUCKET);
		if (!url) throw new Error("Failed to generate signed URL for source asset");
		return this.encodeUrl(url);
	}
	encodeKey(key) {
		return key.split("/").map(encodeURIComponent).join("/");
	}
	encodeUrl(url) {
		try {
			const parsed = new URL(url);
			parsed.pathname = parsed.pathname.split("/").map((seg) => encodeURIComponent(decodeURIComponent(seg))).join("/");
			return parsed.toString();
		} catch {
			return url;
		}
	}
};
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "mediaResolver", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.MEDIA_RENDERER), __decorateMetadata("design:type", Object)], HtmlVideoGenProcessor.prototype, "mediaRenderer", void 0);
HtmlVideoGenProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], HtmlVideoGenProcessor);
var server_default = defineNode(metadata, { backendProcessor: HtmlVideoGenProcessor });

//#endregion
export { server_default as default };