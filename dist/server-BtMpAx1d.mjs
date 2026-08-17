import { C as getActiveMediaMetadata } from "./dist-DSiNOGGx.mjs";
import { a as TOKENS } from "./dist-C1zv_7fB.mjs";
import { t as defineMetadata } from "./define-node-HJy7QW5D-BDZoFKKQ.mjs";
import { i as defineNode } from "./server-foxN8LMn.mjs";
import { c as configBuilder, r as ImageResultSchema, s as VideoResultSchema } from "./dist-9Gzt6jDx.mjs";
import { z as z$1 } from "zod";
import { inject, injectable } from "inversify";

//#region ../../nodes/node-channel-merger/dist/metadata-eCe7i_J-.mjs
const ChannelColorSpaceEnum = z$1.enum([
	"RGBA",
	"HSLA",
	"CMYK",
	"LAB"
]);
const channelMergerConfig = configBuilder().field("colorSpace", ChannelColorSpaceEnum.default("RGBA"), {
	label: "Color Model",
	description: "Color space used for channel recombination (RGBA, HSLA, CMYK, or LAB)."
}).field("defaultChannel4", z$1.number().min(0).max(1).multipleOf(.01).default(1), {
	bindable: true,
	dataTypes: ["Number", "Signal"],
	label: "Default Channel 4 Value",
	description: "Fallback value used when Channel 4 is unconnected (Alpha=1.0, Black=0.0 in CMYK)."
}).build();
const ChannelMergerNodeConfigSchema = channelMergerConfig.schema;
const ChannelMergerResultSchema = z$1.union([ImageResultSchema, VideoResultSchema]);
const CHANNEL_MERGER_OUTPUT_TYPE_MAP = {
	Video: "Video",
	Lottie: "Video",
	GIF: "GIF",
	Image: "Image",
	SVG: "Image"
};
const metadata = defineMetadata({
	type: "ChannelMerger",
	displayName: "Channel Merger",
	description: "Combines up to 4 grayscale image streams into a composite color image across RGBA, HSLA, CMYK, or LAB color models.",
	category: "Media",
	subcategory: void 0,
	configSchema: ChannelMergerNodeConfigSchema,
	resultSchema: ChannelMergerResultSchema,
	configHandles: channelMergerConfig.configHandles,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [
			{
				dataTypes: [
					"Image",
					"SVG",
					"Video",
					"Lottie",
					"GIF"
				],
				label: "Channel 1",
				order: 0,
				required: true,
				description: "First channel component (R / H / C / L*)"
			},
			{
				dataTypes: [
					"Image",
					"SVG",
					"Video",
					"Lottie",
					"GIF"
				],
				label: "Channel 2",
				order: 1,
				required: true,
				description: "Second channel component (G / S / M / a*)"
			},
			{
				dataTypes: [
					"Image",
					"SVG",
					"Video",
					"Lottie",
					"GIF"
				],
				label: "Channel 3",
				order: 2,
				required: true,
				description: "Third channel component (B / L / Y / b*)"
			},
			{
				dataTypes: [
					"Image",
					"SVG",
					"Video",
					"Lottie",
					"GIF"
				],
				label: "Channel 4",
				order: 3,
				required: false,
				description: "Optional fourth channel component (Alpha / K / Alpha)"
			}
		],
		outputs: [{
			dataTypes: [
				"Image",
				"Video",
				"GIF"
			],
			label: "Result",
			order: 0,
			description: "Recombined composite color image or video"
		}]
	},
	defaultConfig: {
		colorSpace: "RGBA",
		defaultChannel4: 1
	}
});

//#endregion
//#region ../../nodes/node-channel-merger/dist/server.mjs
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
let ChannelMergerProcessor = class ChannelMergerProcessor$1 {
	constructor(graph) {
		this.graph = graph;
	}
	async process({ node, data }) {
		try {
			const resolver = this.graph.forNode(node, data);
			const ch1Item = resolver.input("Channel 1").item();
			const ch2Item = resolver.input("Channel 2").item();
			const ch3Item = resolver.input("Channel 3").item();
			const ch4Item = resolver.input("Channel 4").item();
			if (!ch1Item || !ch2Item || !ch3Item) return {
				success: false,
				error: "ChannelMerger requires Channel 1, Channel 2, and Channel 3 inputs"
			};
			const config = ChannelMergerNodeConfigSchema.parse(node.config);
			const ch1Media = ch1Item.data;
			const ch2Media = ch2Item.data;
			const ch3Media = ch3Item.data;
			const ch4Media = ch4Item?.data ?? null;
			if (!ch1Media) return {
				success: false,
				error: "ChannelMerger processing failed - No input data"
			};
			const activeMeta = getActiveMediaMetadata(ch1Media);
			const outputType = CHANNEL_MERGER_OUTPUT_TYPE_MAP[ch1Item.type];
			if (!outputType) throw new Error("Missing output type");
			const connected = resolver.inputs().allWithHandle();
			const inputs = {};
			for (const { handle, value } of connected) if (value) inputs[handle.id] = {
				connectionValid: true,
				outputItem: value
			};
			const finalOutputType = outputType;
			const output = {
				metadata: activeMeta ?? ch1Media.metadata ?? {},
				operation: {
					op: "ChannelMerger",
					...config,
					dataType: finalOutputType,
					inputs,
					channel1Media: ch1Media,
					channel2Media: ch2Media,
					channel3Media: ch3Media,
					channel4Media: ch4Media
				},
				children: [ch1Media]
			};
			const outputHandle = data.handles.find((h) => h.nodeId === node.id && h.type === "Output");
			if (!outputHandle) return {
				success: false,
				error: "Output handle is missing"
			};
			return {
				success: true,
				newResult: {
					selectedOutputIndex: 0,
					outputs: [{ items: [{
						type: finalOutputType,
						data: output,
						outputHandleId: outputHandle.id
					}] }]
				}
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "ChannelMerger processing failed"
			};
		}
	}
};
ChannelMergerProcessor = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.GRAPH_RESOLVERS)),
	__decorateMetadata("design:paramtypes", [Object])
], ChannelMergerProcessor);
var server_default = defineNode(metadata, { backendProcessor: ChannelMergerProcessor });

//#endregion
export { server_default as default };