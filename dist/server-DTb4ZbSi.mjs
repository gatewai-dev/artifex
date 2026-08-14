import { _ as createOutputItemSchema, a as FileDataSchema } from "./dist-DBCHxcBj.mjs";
import { c as logger } from "./dist-DxkWl3Vo.mjs";
import { a as finishUploadToRecordNode, l as uploadToRecordNode, s as prepareUploadToRecordNode } from "./server-DRy159Y_.mjs";
import "./src-CA7_tJ-a.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-B6_gSHpJ.mjs";
import { i as defineNode } from "./server-CTnlsWzD.mjs";
import { r as Hono, t as zValidator } from "./dist-DKds_9kg.mjs";
import { z as z$1 } from "zod";
import { injectable } from "inversify";

//#region ../../nodes/node-recorder/dist/metadata-DubLUXCD.mjs
const RecorderResultSchema = z$1.object({
	selectedOutputIndex: z$1.literal(0),
	outputs: z$1.tuple([z$1.object({ items: z$1.tuple([
		createOutputItemSchema(z$1.literal("Video"), FileDataSchema),
		createOutputItemSchema(z$1.literal("Video"), FileDataSchema),
		createOutputItemSchema(z$1.literal("Audio"), FileDataSchema)
	]) })])
});
const metadata = defineMetadata({
	type: "Recorder",
	displayName: "Recorder",
	description: "Record your screen, camera and microphone",
	category: "Input/Output",
	configSchema: z$1.object({
		camera: z$1.object({
			width: z$1.number().int().min(320).max(7680).default(1920),
			height: z$1.number().int().min(240).max(4320).default(1080),
			deviceId: z$1.string().min(1).optional()
		}).default({
			width: 1920,
			height: 1080
		}),
		mic: z$1.object({
			echoCancellation: z$1.boolean().default(true),
			noiseSuppression: z$1.boolean().default(true),
			autoGainControl: z$1.boolean().default(true),
			deviceId: z$1.string().min(1).optional()
		}).default({
			echoCancellation: true,
			noiseSuppression: true,
			autoGainControl: true
		}),
		screen: z$1.object({ captureAudio: z$1.boolean().default(false) }).default({ captureAudio: false })
	}).strict().default({
		camera: {
			width: 1920,
			height: 1080
		},
		mic: {
			echoCancellation: true,
			noiseSuppression: true,
			autoGainControl: true
		},
		screen: { captureAudio: false }
	}),
	resultSchema: RecorderResultSchema,
	isTerminal: false,
	isTransient: false,
	showInQuickAccess: false,
	handles: {
		inputs: [],
		outputs: [
			{
				dataTypes: ["Video"],
				label: "Screen",
				order: 0
			},
			{
				dataTypes: ["Video"],
				label: "Camera",
				order: 1
			},
			{
				dataTypes: ["Audio"],
				label: "Mic",
				order: 2
			}
		]
	}
});

//#endregion
//#region ../../nodes/node-recorder/dist/server.mjs
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RecorderProcessor = class RecorderProcessor$1 {
	async process({ node }) {
		const result = node.result;
		if (!result || !result.outputs) return {
			success: true,
			newResult: {
				outputs: [],
				selectedOutputIndex: 0
			}
		};
		return {
			success: true,
			newResult: {
				...result,
				outputs: result.outputs?.map((output) => ({
					...output,
					items: output.items.map((m) => {
						return {
							type: m.type,
							outputHandleId: m.outputHandleId,
							data: m.data
						};
					})
				}))
			}
		};
	}
};
RecorderProcessor = __decorate([injectable()], RecorderProcessor);
const uploadSchema = z$1.object({ files: z$1.union([z$1.any(), z$1.array(z$1.any())]).transform((v) => Array.isArray(v) ? v : [v]) });
const prepareSchema = z$1.object({ files: z$1.array(z$1.object({
	filename: z$1.string(),
	mimeType: z$1.string()
})) });
const finishSchema = z$1.object({ files: z$1.array(z$1.object({
	key: z$1.string(),
	filename: z$1.string(),
	mimeType: z$1.string()
})) });
const recorderNodeRouter = new Hono().get("/", (c) => c.json({ ok: true })).post("/upload/:nodeId", zValidator("form", uploadSchema), async (c) => {
	const { nodeId } = c.req.param();
	const body = await c.req.parseBody({ all: true });
	const parsed = uploadSchema.safeParse(body);
	if (!parsed.success) return c.json({ error: "Invalid files format" }, 400);
	const files = parsed.data.files.filter((f) => f instanceof File);
	if (files.length === 0) return c.json({ error: "At least one file is required" }, 400);
	try {
		const user = c.get("user");
		const updatedNode = await uploadToRecordNode({
			nodeId,
			files: await Promise.all(files.map(async (file) => ({
				buffer: Buffer.from(await file.arrayBuffer()),
				filename: file.name,
				mimeType: file.type || void 0
			}))),
			userId: user?.id
		});
		return c.json(updatedNode);
	} catch (error) {
		logger.error({
			err: error,
			nodeId
		}, "Recorder upload failed");
		return c.json({ error: "Upload failed" }, 500);
	}
}).post("/prepare/:nodeId", zValidator("json", prepareSchema), async (c) => {
	const { nodeId } = c.req.param();
	const { files } = c.req.valid("json");
	try {
		const result = await prepareUploadToRecordNode({
			nodeId,
			files,
			userId: c.get("user")?.id
		});
		return c.json(result);
	} catch (error) {
		logger.error({
			err: error,
			nodeId
		}, "Recorder preparation failed");
		return c.json({ error: "Preparation failed" }, 500);
	}
}).post("/finish/:nodeId", zValidator("json", finishSchema), async (c) => {
	const { nodeId } = c.req.param();
	const { files } = c.req.valid("json");
	try {
		const updatedNode = await finishUploadToRecordNode({
			nodeId,
			files,
			userId: c.get("user")?.id
		});
		return c.json(updatedNode);
	} catch (error) {
		logger.error({
			err: error,
			nodeId
		}, "Recorder completion failed");
		return c.json({ error: "Completion failed" }, 500);
	}
});
var server_default = defineNode(metadata, {
	backendProcessor: RecorderProcessor,
	route: recorderNodeRouter
});

//#endregion
export { server_default as default };