import type { FalClient } from "@fal-ai/client";

type Node = any;
type Handle = any;

import type { OpenAI } from "openai";
import type { DataType } from "./base.js";
import type {
	FileData,
	NodeResult,
	OutputItem,
	VirtualMediaData,
} from "./index.js";

/**
 * Interface that class-based node processors must implement.
 */
export interface NodeProcessorResult {
	success: boolean;
	error?: string;
	newResult?: unknown;
}

export interface NodeProcessor {
	process(ctx: unknown): Promise<NodeProcessorResult>;
}

/**
 * Interface for graph resolution services.
 * Used to resolve input/output values during node execution.
 */
export interface IGraphResolverService {
	forNode(node: Node, data: any): INodeResolver;
}

export interface INodeResolver {
	/** Resolve a single input by label or first available of type */
	input(label?: string): IInputResolver;

	/** Resolve multiple inputs, optionally filtered by label */
	inputs(label?: string): IInputsResolver;

	/** Load media buffer from storage */
	loadMediaBuffer(
		fileData: FileData | VirtualMediaData,
		userId?: string,
	): Promise<Buffer>;

	/** Get mime type of file data */
	getFileDataMimeType(
		fileData: FileData | VirtualMediaData,
	): Promise<string | null>;
}

export interface IInputResolver {
	/** Mark this input as required. Throws if not connected or value is missing. */
	required(): this;
	/** Filter by data type */
	as(type: DataType): this;

	/** Get the raw data value */
	value<T = unknown>(): T;

	/** Get the full OutputItem */
	item<T = OutputItem<DataType> | null>(): T;

	/** Convenient typed getters */
	asText(): string;
	asNumber(): number;
	asBoolean(): boolean;
	asImage(): VirtualMediaData;
	asVideo(): VirtualMediaData;
	asAudio(): VirtualMediaData;
	asSVG(): VirtualMediaData;
	asLUT(): VirtualMediaData;
}

export interface IInputsResolver {
	/** Filter by data type */
	as(type: DataType): this;

	/** Get all values */
	all<T = NodeResult>(): T[];

	/** Get all data points from values */
	allData<T = unknown>(): T[];

	/** Get all inputs with their handles */
	allWithHandle(): Array<{
		handle: Handle;
		value: OutputItem<DataType> | null;
	}>;

	/** Convenient typed filters */
	asImage(): this;
	asVideo(): this;
	asAudio(): this;
	asText(): this;
	asLUT(): this;
}

/**
 * Interface for media processing and handling.
 */
export interface MediaService {
	getImageDimensions: (
		buffer: Buffer,
	) =>
		| Promise<{ width: number; height: number }>
		| { width: number; height: number };

	getImageBuffer: (imageInput: FileData) => Promise<Buffer>;

	resolveFileDataUrl: (
		data: FileData | null,
	) => string | Promise<string | null> | null;
}

/**
 * Interface for AI provider services.
 * Used by AI nodes (LLM, ImageGen, VideoGen, TTS, STT) via DI.
 */
export interface AIProvider {
	getFal(): FalClient;
	getOpenRouterOpenAI(): OpenAI;
	getAgentModel<T>(modelName: string, sessionId?: string): T;
}

/**
 * Interface for storage operations.
 */
export interface StorageService {
	uploadToTemporaryStorageFolder: (
		buffer: Buffer,
		mimeType: string,
		key: string,
	) => Promise<{ key: string }>;

	uploadToStorage: (
		buffer: Buffer,
		key: string,
		contentType: string,
		bucketName: string,
	) => Promise<void>;

	uploadFileToStorage: (
		filePath: string,
		key: string,
		contentType: string,
		bucketName: string,
	) => Promise<void>;

	generateSignedUrl: (
		key: string,
		bucketName: string,
		expiresIn?: number,
		options?: {
			responseContentType?: string;
			responseContentDisposition?: string;
		},
	) => Promise<string>;

	generateSignedPutUrl: (
		key: string,
		bucketName: string,
		contentType: string,
		expiresIn?: number,
	) => Promise<string>;

	getFromStorage: (key: string, bucket?: string) => Promise<Buffer>;

	getObjectMetadata: (key: string, bucket?: string) => Promise<any>;

	deleteFromStorage: (key: string, bucketName: string) => Promise<void>;

	fileExistsInStorage: (key: string, bucketName: string) => Promise<boolean>;

	getStreamFromStorage: (
		key: string,
		bucketName: string,
		range?: { start: number; end?: number },
	) => NodeJS.ReadableStream;

	getPublicUrl: (key: string, bucketName?: string) => string;

	listFromStorage: (prefix: string, bucketName: string) => Promise<string[]>;
}
