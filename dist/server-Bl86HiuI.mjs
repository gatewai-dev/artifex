import { M as generateId, O as createOutputItemSchema, a as TOKENS, b as MultiOutputGenericSchema, c as logger, k as createVirtualMedia, s as getAssetKey, w as VirtualMediaDataSchema } from "./dist-xnVPaj2K.mjs";
import "./src-goQ_UXNy.mjs";
import { a as defineMetadata, i as defineNode } from "./server-Bgx3WrSt.mjs";
import { n as runCodeGenAgent, r as tool, t as createCodeGenAgent } from "./server-VEIcFPdJ.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-lottie/dist/metadata-1RqLBjWV.mjs
const LOTTIE_NODE_MODELS = [
	"gpt-5.6-terra",
	"gpt-5.6-luna",
	"gpt-5.6-sol",
	"google/gemini-3.5-flash",
	"deepseek/deepseek-v4-flash",
	"deepseek/deepseek-v4-pro"
];
const MAX_REFERENCE_IMAGES = 8;
const LottieNodeConfigSchema = z$1.object({
	model: z$1.enum(LOTTIE_NODE_MODELS),
	width: z$1.number().min(1).max(4096).default(512),
	height: z$1.number().min(1).max(4096).default(512),
	fps: z$1.number().min(12).max(60).default(24),
	durationSeconds: z$1.number().min(.5).max(30).default(2)
}).strict();
const LottieResultSchema = MultiOutputGenericSchema(createOutputItemSchema(z$1.literal("Lottie"), VirtualMediaDataSchema));
const metadata = defineMetadata({
	type: "LottieGen",
	displayName: "Lottie Generator",
	description: "Generate or Edit After Effect animations using an AI Agent.",
	category: "AI",
	subcategory: "Vector",
	configSchema: LottieNodeConfigSchema,
	resultSchema: LottieResultSchema,
	isTerminal: true,
	isTransient: false,
	variableInputs: {
		enabled: true,
		dataTypes: ["Image"]
	},
	handles: {
		inputs: [{
			dataTypes: ["Text"],
			required: true,
			label: "Prompt",
			order: 0
		}, {
			dataTypes: ["Image"],
			label: "Reference Image",
			order: 1
		}],
		outputs: [{
			dataTypes: ["Lottie"],
			label: "Result",
			order: 0
		}]
	},
	defaultConfig: {
		model: "gpt-5.6-terra",
		width: 512,
		height: 512,
		fps: 24,
		durationSeconds: 5
	},
	pricing: (config) => {
		return {
			"gpt-5.6-terra": 90,
			"gpt-5.6-luna": 60,
			"gpt-5.6-sol": 180,
			"google/gemini-3.5-flash": 45,
			"deepseek/deepseek-v4-flash": 20,
			"deepseek/deepseek-v4-pro": 45
		}[config.model];
	}
});

//#endregion
//#region ../../nodes/node-lottie/dist/server.mjs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SKILL_DIR = path.join(__dirname, "text-to-lottie");
const COMMON_ANIMATION_WORDS = new Set([
	"animation",
	"animate",
	"lottie",
	"create",
	"make",
	"scene",
	"fix",
	"edit",
	"skottie"
]);
const PREMIUM_QUALIFIERS = [
	"premium",
	"clean",
	"minimal",
	"modern",
	"sleek",
	"polished",
	"sophisticated",
	"elegant",
	"refined"
];
/**
* Tokenize an intent cell into individual matchable keywords,
* filtering out common animation words that would cause false matches.
*/
function tokenizeIntent(intent) {
	return intent.replace(/[,"]|plus the routed recipe|restraint defaults/g, "").trim().split(/\s+/).map((w) => w.toLowerCase().replace(/[()]/g, "")).filter((w) => w.length > 2 && !COMMON_ANIMATION_WORDS.has(w));
}
function hasPremiumQualifiers(prompt) {
	const lower = prompt.toLowerCase();
	return PREMIUM_QUALIFIERS.some((q) => new RegExp(`\\b${q}\\b`, "i").test(lower));
}
var LottieSkillManager = class {
	controlPlane;
	references = /* @__PURE__ */ new Map();
	routingRows = [];
	alwaysRefs = /* @__PURE__ */ new Set();
	premiumRefs = /* @__PURE__ */ new Set();
	constructor(skillDir = DEFAULT_SKILL_DIR) {
		this.controlPlane = this.loadControlPlane(skillDir);
		this.loadReferences(path.join(skillDir, "references"));
		this.parseRoutingTable();
		if (this.routingRows.length === 0) this.alwaysRefs.add("player-contract");
	}
	/** Full SKILL.md body stripped of eval maintenance section. */
	getControlPlane() {
		return this.controlPlane;
	}
	/** Content of a single reference, or undefined if not found. */
	getReference(name) {
		return this.references.get(name);
	}
	/**
	* Get specific skill content by reference name (e.g. "references/motion-taste.md", "motion-taste.md", "motion-taste").
	* If not found, throws an error.
	*/
	getSkill(skillName) {
		if (typeof skillName !== "string") throw new Error("Skill name must be a string");
		let name = skillName.trim();
		name = name.replace(/^[/\\]+/, "").replace(/[/\\]+$/, "");
		if (name.startsWith("references/")) name = name.substring(11);
		else if (name.startsWith("references\\")) name = name.substring(11);
		if (name.endsWith(".md")) name = name.substring(0, name.length - 3);
		const content = this.references.get(name);
		if (!content) {
			const available = this.getAllReferenceNames().sort().map((r) => `references/${r}.md`).join(", ");
			throw new Error(`Invalid skill/reference name "${skillName}". You must only request valid reference paths from the routing table. Available options: ${available}`);
		}
		return content;
	}
	/** Names of all loaded references. */
	getAllReferenceNames() {
		return [...this.references.keys()];
	}
	/**
	* Match a user prompt against the routing table and return
	* deduplicated reference filenames (without .md extension).
	* Always includes `player-contract` for any non-empty prompt.
	*/
	matchReferences(prompt) {
		const matched = new Set(this.alwaysRefs);
		if (!prompt?.trim()) return [...matched];
		const lower = prompt.toLowerCase();
		for (const row of this.routingRows) if (row.keywords.some((kw) => lower.includes(kw))) for (const ref of row.refs) matched.add(ref);
		if (hasPremiumQualifiers(prompt)) for (const ref of this.premiumRefs) matched.add(ref);
		return [...matched];
	}
	/**
	* Build the complete skill context for injection into a system prompt.
	* Includes the control plane followed by matched reference content.
	*/
	buildContext(prompt) {
		const refs = this.matchReferences(prompt);
		const parts = [
			`# LOTTIE SKILL CONTEXT`,
			"",
			"## Skill (Control Plane)",
			"",
			this.controlPlane
		];
		if (refs.length > 0) {
			parts.push("", "## Loaded References");
			for (const name of refs) {
				const content = this.references.get(name);
				if (!content) continue;
				parts.push("", `### reference: ${name}`, "", content);
			}
		}
		return parts.join("\n");
	}
	loadControlPlane(skillDir) {
		const skillPath = path.join(skillDir, "SKILL.md");
		if (!fs.existsSync(skillPath)) throw new Error(`SKILL.md not found at "${skillPath}". The text-to-lottie skill directory must contain a SKILL.md file.`);
		const raw = fs.readFileSync(skillPath, "utf-8");
		const idx = raw.indexOf("\n## Maintenance Evals\n");
		return (idx === -1 ? raw : raw.slice(0, idx)).replace(/^---\n[\s\S]*?\n---\n\n?/m, "").trim();
	}
	loadReferences(refDir) {
		if (!fs.existsSync(refDir)) return;
		const entries = fs.readdirSync(refDir, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
			const name = entry.name.replace(/\.md$/, "");
			try {
				const content = fs.readFileSync(path.join(refDir, entry.name), "utf-8");
				if (content.trim()) this.references.set(name, content.trim());
			} catch {}
		}
	}
	parseRoutingTable() {
		const lines = this.controlPlane.split("\n");
		let start = -1;
		for (let i = 0; i < lines.length; i++) {
			const ln = lines[i].trim();
			if (ln.startsWith("## Reference Loading")) start = i;
			else if (start !== -1 && ln.startsWith("## ") && !ln.startsWith("## Reference Loading")) break;
		}
		const sectionStart = start !== -1 ? start : 0;
		const sectionLines = lines.slice(sectionStart);
		for (const line of sectionLines) {
			const trimmed = line.trim();
			if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) continue;
			const cells = trimmed.split("|").slice(1, -1).map((c) => c.trim());
			if (cells.length < 2) continue;
			const intent = cells[0];
			if (!intent || intent.startsWith("--") || intent.toLowerCase() === "user intent") continue;
			const refStr = cells[1];
			const refs = this.extractReferenceNames(refStr);
			if (refs.length === 0) continue;
			if (intent.toLowerCase().includes("any new") || intent.toLowerCase().includes("any lottie")) {
				for (const r of refs) this.alwaysRefs.add(r);
				continue;
			}
			if (intent.includes("\"premium\"") || intent.includes("\"clean\"") || intent.includes("\"minimal")) {
				for (const r of refs) this.premiumRefs.add(r);
				continue;
			}
			this.routingRows.push({
				keywords: tokenizeIntent(intent),
				refs
			});
		}
		if (this.alwaysRefs.size === 0) this.alwaysRefs.add("player-contract");
	}
	/**
	* Extract clean reference filenames from a cell like
	* `references/recipe-logo.md`, `references/motion-taste.md`, `references/design-taste.md`
	* or `references/design-taste.md` (restraint defaults), plus the routed recipe.
	*/
	extractReferenceNames(cell) {
		const refs = [];
		const re = /references\/([\w-]+)\.md/g;
		let match;
		while ((match = re.exec(cell)) !== null) refs.push(match[1]);
		return [...new Set(refs)];
	}
};
/** Singleton — loaded at module init time. */
const lottieSkillManager = new LottieSkillManager();
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
let cachedFontNames = null;
let fontCacheTimestamp = 0;
const FONT_CACHE_TTL = 6e4 * 10;
async function getAvailableFonts(storage, env) {
	const now = Date.now();
	if (cachedFontNames && now - fontCacheTimestamp < FONT_CACHE_TTL) return cachedFontNames;
	try {
		if (env.R2_CUSTOM_DOMAIN) {
			const keys = await storage.listFromStorage("fonts/", env.R2_ASSETS_BUCKET);
			const names = [...new Set(keys.map((k) => k.split("/")[1]).filter(Boolean))];
			names.sort();
			cachedFontNames = names;
			fontCacheTimestamp = now;
			return names;
		}
	} catch (err) {
		logger.warn({ err }, "Failed to list fonts from R2, trying local fallback");
	}
	try {
		const fs$1 = await import("fs/promises");
		const path$1 = await import("path");
		const possibleDirs = [
			path$1.join(process.cwd(), "assets", "fonts"),
			path$1.join(process.cwd(), "src", "assets", "fonts"),
			path$1.join(process.cwd(), "apps", "gatewai-backend", "src", "assets", "fonts")
		];
		for (const dir of possibleDirs) try {
			const names = (await fs$1.readdir(dir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort();
			cachedFontNames = names;
			fontCacheTimestamp = now;
			return names;
		} catch {}
	} catch (err) {
		logger.warn({ err }, "Failed to list fonts from local filesystem");
	}
	return cachedFontNames || [];
}
/**
* Extracts fonts from fonts.list AND deep traverses all text layers (handling kf.s, kf.e, and direct kf).
*/
function extractFontsFromLottie(lottie) {
	const fonts = /* @__PURE__ */ new Set();
	const fontsList = lottie?.fonts?.list;
	if (Array.isArray(fontsList)) for (const entry of fontsList) {
		if (entry?.fName && typeof entry.fName === "string") fonts.add(entry.fName);
		if (entry?.fFamily && typeof entry.fFamily === "string") fonts.add(entry.fFamily);
	}
	const layers = lottie?.layers;
	if (!Array.isArray(layers)) return [...fonts];
	for (const layer of layers) {
		if (layer?.ty !== 5) continue;
		const k = layer?.t?.d?.k ?? layer?.t?.k;
		if (!k) continue;
		const kArr = Array.isArray(k) ? k : [k];
		for (const kf of kArr) {
			const possibleDocs = [
				kf?.s,
				kf?.e,
				kf
			].filter(Boolean);
			for (const doc of possibleDocs) {
				const docArr = Array.isArray(doc) ? doc : [doc];
				for (const d of docArr) if (d?.f && typeof d.f === "string") fonts.add(d.f);
			}
		}
	}
	return [...fonts];
}
/**
* Guarantees every text document carries a font reference and that a
* spec-compliant `fonts.list` exists for all referenced fonts.
*/
function ensureLottieTextFonts(lottie, availableFonts) {
	const layers = lottie?.layers;
	if (!Array.isArray(layers)) return lottie;
	const defaultFont = availableFonts.includes("Inter") ? "Inter" : availableFonts[0] || "Inter";
	if (!lottie.fonts || typeof lottie.fonts !== "object") lottie.fonts = {};
	if (!Array.isArray(lottie.fonts.list)) lottie.fonts.list = [];
	const fontsList = lottie.fonts.list;
	const used = /* @__PURE__ */ new Set();
	for (const layer of layers) {
		if (layer?.ty !== 5) continue;
		const k = layer?.t?.d?.k ?? layer?.t?.k;
		if (!k) continue;
		const kArr = Array.isArray(k) ? k : [k];
		for (const kf of kArr) {
			const possibleDocs = [
				kf?.s,
				kf?.e,
				kf
			].filter(Boolean);
			for (const doc of possibleDocs) {
				const docArr = Array.isArray(doc) ? doc : [doc];
				for (const d of docArr) {
					if (!d || typeof d !== "object" || d.t === void 0) continue;
					if (typeof d.f !== "string" || !d.f) {
						const fallback = fontsList.find((e) => typeof e?.fName === "string")?.fName ?? defaultFont;
						if (fallback) d.f = fallback;
					}
					if (typeof d.f === "string" && d.f) {
						const canonical = availableFonts.find((af) => af.toLowerCase() === d.f.toLowerCase());
						if (canonical) d.f = canonical;
						used.add(d.f);
					}
				}
			}
		}
	}
	for (const name of used) if (!fontsList.some((e) => e?.fName === name || e?.fFamily === name)) fontsList.push({
		origin: 0,
		fPath: "",
		fClass: "",
		fFamily: name,
		fWeight: "Regular",
		fStyle: "Regular",
		fName: name,
		ascent: 75
	});
	if (fontsList.length === 0) delete lottie.fonts;
	return lottie;
}
function createSkillTools() {
	return [tool({
		name: "list_skills",
		description: "List all available animation skills, motion techniques, and best practice guides.",
		parameters: z$1.object({}),
		async execute() {
			try {
				let skillList;
				if (typeof lottieSkillManager.listSkills === "function") skillList = await lottieSkillManager.listSkills();
				else if (typeof lottieSkillManager.getAvailableSkills === "function") skillList = await lottieSkillManager.getAvailableSkills();
				else skillList = [
					"easings",
					"morphing",
					"typography",
					"particles",
					"complex-paths"
				];
				return typeof skillList === "string" ? skillList : JSON.stringify(skillList, null, 2);
			} catch (err) {
				return `Error listing skills: ${err instanceof Error ? err.message : String(err)}`;
			}
		}
	}), tool({
		name: "read_skill",
		description: "Read detailed code guidelines, motion formulas, design patterns, and technical references for a specific animation skill or topic.",
		parameters: z$1.object({ skillName: z$1.string().describe("The reference file path from the routing table to read (e.g. 'references/player-contract.md', 'references/motion-taste.md', etc.)") }),
		async execute({ skillName }) {
			console.log({ skillName });
			try {
				let content;
				if (typeof lottieSkillManager.getSkill === "function") content = await lottieSkillManager.getSkill(skillName);
				else if (typeof lottieSkillManager.readSkill === "function") content = await lottieSkillManager.readSkill(skillName);
				else if (typeof lottieSkillManager.buildContext === "function") content = lottieSkillManager.buildContext(skillName);
				if (!content || !content.trim()) return `No specific documentation found for skill: "${skillName}".`;
				return content;
			} catch (err) {
				return `Error reading skill "${skillName}": ${err instanceof Error ? err.message : String(err)}`;
			}
		}
	})];
}
const LottieLayerSchema = z$1.object({
	ty: z$1.number(),
	nm: z$1.string().optional(),
	ind: z$1.number(),
	ip: z$1.number(),
	op: z$1.number(),
	st: z$1.number(),
	sr: z$1.number().optional(),
	ao: z$1.number().optional(),
	ks: z$1.record(z$1.string(), z$1.any()),
	shapes: z$1.array(z$1.any()).optional()
}).passthrough();
const LottieSchemaValidator = z$1.object({
	v: z$1.string().min(1),
	fr: z$1.number().min(1),
	ip: z$1.number(),
	op: z$1.number().min(1),
	w: z$1.number().min(1),
	h: z$1.number().min(1),
	assets: z$1.array(z$1.any()).optional(),
	layers: z$1.array(LottieLayerSchema).min(1)
}).passthrough();
const LottieSandboxResultSchema = z$1.object({ lottie: LottieSchemaValidator });
function buildSystemPrompt(canvasW, canvasH, frameRate, durationSeconds, availableFonts, imageUrls) {
	const totalFrames = Math.round(frameRate * durationSeconds);
	const fontList = availableFonts.length > 0 ? availableFonts.map((f) => `"${f}"`).join(", ") : "\"Inter\" (default)";
	let imageSection = "";
	if (imageUrls && imageUrls.length > 0) imageSection = `\n## Reference Images:\n` + imageUrls.map((url, i) => `- Image ${i + 1}: ${url}`).join("\n") + `\nUse these reference images for visual guidance (colors, layout, styling, subject matter) when generating the animation. You can access the raw URLs in the global \`imageUrls\` array if needed.\n`;
	return `# Role: Principal Motion Design Architect

You are an elite motion designer and Bodymovin/Lottie engineer. You have full creative freedom to generate visually stunning, fluidly animated Lottie JSON structures directly in JavaScript.

## MANDATORY WORKFLOW INSTRUCTIONS:
1. **FIRST STEP**: You MUST call the \`read_skill\` tool to fetch technical references, easing formulas, structural helpers, and motion design best practices relevant to the user's prompt before writing code.
2. **SECOND STEP**: Based on the skill knowledge you retrieve, write pure JavaScript code that builds and returns the complete, valid Lottie JSON structure.

## Animation Skill Guide (General):
${lottieSkillManager.getControlPlane()}
${imageSection}
## Canvas & Animation Specifications:
- Canvas Dimensions: ${canvasW}x${canvasH}
- Frame Rate: ${frameRate} FPS
- Total Duration: ${durationSeconds} seconds (${totalFrames} total frames)

## Available System Fonts:
[${fontList}]
- Default to "Inter" if no specific font is requested.

## REQUIRED OUTPUT FORMAT:
Write JavaScript code that constructs the final animation and returns an object containing a single \`lottie\` key holding the full Lottie JSON object:
\`\`\`js
return {
  lottie: {
    v: "5.12.1",
    fr: ${frameRate},
    ip: 0,
    op: ${totalFrames},
    w: ${canvasW},
    h: ${canvasH},
    nm: "Animation",
    assets: [],
    layers: [ /* your layer stack */ ]
  }
};
\`\`\`
`.trim();
}
let LottieProcessor = class LottieProcessor$1 {
	prisma;
	env;
	storage;
	graph;
	aiProvider;
	mediaResolver;
	constructor() {}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const userPrompt = resolver.input("Prompt").required().asText();
			if (!userPrompt?.trim()) return {
				success: false,
				error: "Prompt is required."
			};
			const nodeConfig = LottieNodeConfigSchema.parse(node.config);
			const canvasW = nodeConfig.width;
			const canvasH = nodeConfig.height;
			const isDeepSeek = nodeConfig.model.startsWith("deepseek/");
			let imageUrls = [];
			if (!isDeepSeek) {
				const referenceImages = resolver.inputs().asImage().allData().slice(0, MAX_REFERENCE_IMAGES);
				imageUrls = await Promise.all(referenceImages.map(async (imgData) => {
					const result$1 = await this.mediaResolver.resolveToUrl(imgData, "Image", { userId: data.canvas.userId });
					if (!result$1.url) throw new Error("Failed to resolve image URL");
					return result$1.url;
				}));
			}
			const availableFonts = await getAvailableFonts(this.storage, this.env);
			const agentModel = this.aiProvider.getAgentModel(nodeConfig.model, data.task?.id);
			const skillTools = createSkillTools();
			const { agent, resultStore } = createCodeGenAgent({
				name: "LottieGenAgent",
				model: agentModel,
				systemPrompt: buildSystemPrompt(canvasW, canvasH, nodeConfig.fps, nodeConfig.durationSeconds, availableFonts, imageUrls),
				globals: {
					prompt: userPrompt,
					availableFonts,
					imageUrls
				},
				tools: skillTools,
				resultSchema: LottieSandboxResultSchema,
				maxRetries: MAX_RETRIES,
				timeoutMs: 45e3
			});
			const promptText = `Create a high-quality Lottie animation for: "${userPrompt}". Remember to call the read_skill tool first to check relevant animation best practices and techniques before generating code.`;
			let runPrompt;
			if (imageUrls.length > 0) runPrompt = [{
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
			if (!result?.lottie) return {
				success: false,
				error: "Agent failed to return a structurally valid Lottie animation after maximum retries."
			};
			ensureLottieTextFonts(result.lottie, availableFonts);
			const unknownFonts = extractFontsFromLottie(result.lottie).filter((f) => !availableFonts.some((af) => af.toLowerCase() === f.toLowerCase()));
			if (unknownFonts.length > 0) logger.warn({
				unknownFonts,
				availableFonts
			}, "Generated Lottie references fonts not in the available list");
			const lottieContent = JSON.stringify(result.lottie, null, 2);
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing."
			};
			const buffer = Buffer.from(lottieContent, "utf-8");
			const randId = generateId();
			const fileName = `${node.name}_${randId}.json`;
			const key = getAssetKey(fileName);
			const bucket = this.env.R2_ASSETS_BUCKET;
			const contentType = "application/json";
			await this.storage.uploadToStorage(buffer, key, contentType, bucket);
			const asset = await this.prisma.fileAsset.create({ data: {
				name: fileName,
				userId: data.canvas.userId,
				bucket,
				key,
				fps: nodeConfig.fps,
				duration: nodeConfig.durationSeconds * 1e3,
				size: buffer.length,
				width: canvasW,
				height: canvasH,
				mimeType: contentType
			} });
			const newResult = structuredClone(node.result) ?? {
				outputs: [],
				selectedOutputIndex: 0
			};
			newResult.outputs.push({ items: [{
				type: "Lottie",
				data: createVirtualMedia({ entity: asset }, "Lottie"),
				outputHandleId: outputHandle.id
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
			}, "Lottie Generation Failed");
			return {
				success: false,
				error: err instanceof Error ? err.message : "Lottie Generation failed"
			};
		}
	}
};
__decorate([inject(TOKENS.PRISMA), __decorateMetadata("design:type", Object)], LottieProcessor.prototype, "prisma", void 0);
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], LottieProcessor.prototype, "env", void 0);
__decorate([inject(TOKENS.STORAGE), __decorateMetadata("design:type", Object)], LottieProcessor.prototype, "storage", void 0);
__decorate([inject(TOKENS.GRAPH_RESOLVERS), __decorateMetadata("design:type", Object)], LottieProcessor.prototype, "graph", void 0);
__decorate([inject(TOKENS.AI_PROVIDER), __decorateMetadata("design:type", Object)], LottieProcessor.prototype, "aiProvider", void 0);
__decorate([inject(TOKENS.MEDIA_RESOLVER), __decorateMetadata("design:type", Object)], LottieProcessor.prototype, "mediaResolver", void 0);
LottieProcessor = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], LottieProcessor);
var server_default = defineNode(metadata, { backendProcessor: LottieProcessor });

//#endregion
export { server_default as default };