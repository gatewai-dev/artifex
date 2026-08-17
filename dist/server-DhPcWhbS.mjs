import { C as getActiveMediaMetadata, _ as createOutputItemSchema, h as appendOperation, l as MultiOutputGenericSchema, p as VirtualMediaDataSchema } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-CsJ7TTyG.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-B4XCAm7d.mjs";
import { c as configBuilder } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-channel-splitter/dist/metadata-Bw9kiZw_.mjs
const ChannelColorSpaceEnum = z$1.enum([
	"RGBA",
	"HSLA",
	"CMYK",
	"LAB"
]);
const channelSplitterConfig = configBuilder().field("colorSpace", ChannelColorSpaceEnum.default("RGBA"), {
	label: "Color Model",
	description: "Color space used for channel decomposition (RGBA, HSLA, CMYK, or LAB)."
}).build();
const ChannelSplitterNodeConfigSchema = channelSplitterConfig.schema;
const ChannelSplitterResultSchema = MultiOutputGenericSchema(z$1.union([
	createOutputItemSchema(z$1.literal("Video"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("Image"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("SVG"), VirtualMediaDataSchema),
	createOutputItemSchema(z$1.literal("GIF"), VirtualMediaDataSchema)
]));
const CHANNEL_SPLITTER_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "ChannelSplitter",
	displayName: "Channel Splitter",
	description: "Splits an image or video stream into 4 distinct single-channel grayscale images across RGBA, HSLA, CMYK, or LAB color models.",
	category: "Media",
	subcategory: void 0,
	configSchema: ChannelSplitterNodeConfigSchema,
	resultSchema: ChannelSplitterResultSchema,
	configHandles: channelSplitterConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [{
			dataTypes: [
				"Image",
				"SVG",
				"Video",
				"Lottie",
				"GIF"
			],
			label: "Input",
			order: 0,
			required: true,
			description: "Source media to split into channels"
		}],
		outputs: [
			{
				dataTypes: [
					"Image",
					"Video",
					"GIF"
				],
				label: "Channel 1",
				order: 0,
				description: "Channel 1 (R / H / C / L*)"
			},
			{
				dataTypes: [
					"Image",
					"Video",
					"GIF"
				],
				label: "Channel 2",
				order: 1,
				description: "Channel 2 (G / S / M / a*)"
			},
			{
				dataTypes: [
					"Image",
					"Video",
					"GIF"
				],
				label: "Channel 3",
				order: 2,
				description: "Channel 3 (B / L / Y / b*)"
			},
			{
				dataTypes: [
					"Image",
					"Video",
					"GIF"
				],
				label: "Channel 4",
				order: 3,
				description: "Channel 4 (Alpha / Alpha / K / Alpha)"
			}
		]
	},
	defaultConfig: { colorSpace: "RGBA" }
});

//#endregion
//#region ../../nodes/node-channel-splitter/dist/server.mjs
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorateParam(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ChannelSplitterProcessor = class ChannelSplitterProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const inputItem = resolver.input("Input").item() || resolver.input().item();
			if (!inputItem) return {
				success: false,
				error: "Missing input"
			};
			const config = ChannelSplitterNodeConfigSchema.parse(node.config);
			const inputMedia = inputItem.data;
			if (!inputMedia) return {
				success: false,
				error: "ChannelSplitter processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(inputMedia);
			const outputType = CHANNEL_SPLITTER_OUTPUT_TYPE_MAP[inputItem.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalMeta = activeMeta ?? inputMedia.metadata;
			const ch1Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 0,
				metadata: finalMeta,
				dataType: outputType,
				inputs
			});
			const ch2Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 1,
				metadata: finalMeta,
				dataType: outputType,
				inputs
			});
			const ch3Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 2,
				metadata: finalMeta,
				dataType: outputType,
				inputs
			});
			const ch4Output = appendOperation(inputMedia, {
				op: "ChannelSplitter",
				colorSpace: config.colorSpace,
				channelIndex: 3,
				metadata: finalMeta,
				dataType: outputType,
				inputs
			});
			const outputHandles = data.handles.filter((h) => h.nodeId === node.id && h.type === "Output");
			const ch1Handle = outputHandles.find((h) => h.label.includes("Channel 1"));
			const ch2Handle = outputHandles.find((h) => h.label.includes("Channel 2"));
			const ch3Handle = outputHandles.find((h) => h.label.includes("Channel 3"));
			const ch4Handle = outputHandles.find((h) => h.label.includes("Channel 4"));
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [
						{
							type: outputType,
							data: ch1Output,
							outputHandleId: ch1Handle?.id
						},
						{
							type: outputType,
							data: ch2Output,
							outputHandleId: ch2Handle?.id
						},
						{
							type: outputType,
							data: ch3Output,
							outputHandleId: ch3Handle?.id
						},
						{
							type: outputType,
							data: ch4Output,
							outputHandleId: ch4Handle?.id
						}
					] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "ChannelSplitter processing failed"
			};
		}
	}
};
ChannelSplitterProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ChannelSplitterProcessor);
var server_default = defineNode(metadata, { backendProcessor: ChannelSplitterProcessor });

//#endregion
export { server_default as default };