import type {
	DataType,
	NodeProcessorParams,
	NodeResult,
	VirtualMediaData,
} from "@gatewai.studio/core";
import type React from "react";
import type { ComponentType, MemoExoticComponent } from "react";
import type { WebGPUNodeRenderer } from "./registry/renderers.js";

export enum TaskStatus {
	QUEUED = "QUEUED",
	EXECUTING = "EXECUTING",
	FAILED = "FAILED",
	COMPLETED = "COMPLETED",
}

export interface HandleState {
	id: string;
	isConnected: boolean;
	valid: boolean;
	type: string | null;
	color: string | null;
}

export interface NodeState {
	id: string;
	status: TaskStatus | null;
	isDirty: boolean;
	startedAt?: number;
	finishedAt?: number;
	durationMs?: number;
	lastProcessedSignature?: string | null;
	result: NodeResult | null;
	inputs: Record<string, ConnectedInput> | null;
	error: string | null;
	handleStatus: Record<string, HandleState>;
	abortController: AbortController | null;
	version: number;
	price?: number;
}

export type ConnectedInput = {
	connectionValid: boolean;
	outputItem: {
		type: DataType;
		data: any;
		outputHandleId: string | undefined;
	} | null;
};

export interface NodeRenderProps {
	renderId: string;
	virtualMedia: VirtualMediaData;
	volume?: number;
	playbackRateOverride?: number;
	trimStartOverride?: number;
	trimEndOverride?: number;
	containerWidth: number;
	containerHeight: number;
	opacity?: number;
	frame?: number;
	fps?: number;
	elapsedMs?: number;
	durationMs?: number;
	timestampSec?: number;
	renderingContext?: "visual" | "audio";
	inheritedSeekOffset?: number;
	inheritedClockOffset?: number;
	isHeadless?: boolean;
	forceWait?: boolean;
	isVideoMode?: boolean;
	isPlaying?: boolean;
	excludeTextures?: GPUTexture[];
	// The core engine provides this so nodes can render their nested children recursively
	renderChild?: (
		child: VirtualMediaData,
		overrides?: Partial<NodeRenderProps>,
	) => React.ReactNode;
}

export interface IEventEmitter {
	on(event: string | symbol, listener: (...args: any[]) => void): this;
	once(event: string | symbol, listener: (...args: any[]) => void): this;
	off(event: string | symbol, listener: (...args: any[]) => void): this;
	emit(event: string | symbol, ...args: any[]): boolean;
	addListener(event: string | symbol, listener: (...args: any[]) => void): this;
	removeListener(
		event: string | symbol,
		listener: (...args: any[]) => void,
	): this;
	removeAllListeners(event?: string | symbol): this;
}

/**
 * Interface for the node graph processor that handles execution and state
 */
export interface NodeProcessor extends IEventEmitter {
	getNodeState(nodeId: string): NodeState | null;
	getNodeResult(nodeId: string): NodeResult | null;
	getNodeValidation(nodeId: string): Record<string, string> | null;
	getHandleColor(nodeId: string, handleId: string): string | null;
	getHandleType?(nodeId: string, handleId: string): DataType | null;
	getNodeData(nodeId: string): any; // Returns NodeEntityType-like structure
}

/**
 * Frontend-specific plugin definition.
 */
export interface FrontendNodePlugin {
	/**
	 * The Reactflow custom node component
	 */
	Component: MemoExoticComponent<ComponentType<any>>;
	/**
	 * The (Form) component that shows in sidebar when node selected
	 */
	ConfigComponent?: ComponentType<any>;
	/**
	 * The Page component that opens when user clicks "Page Opener Button"
	 */
	PageContentComponent?: MemoExoticComponent<ComponentType<any>>;

	MainIconComponent?: ComponentType<any>;

	SkiaRenderer?: React.FC<NodeRenderProps>;
	WebGPURenderer?: WebGPUNodeRenderer;

	/**
	 * Custom audio processor for offline rendering and real-time playback
	 */
	audioProcessor?: AudioProcessor;

	processor: BrowserProcessorConstructor;
}

export interface AudioProcessorContext {
	device?: GPUDevice;
	frame?: number;
	fps?: number;
	elapsedMs?: number;
	durationMs?: number;
	renderId?: string;
}

/**
 * Custom audio processor for offline rendering and real-time playback on PCM Float32 arrays.
 */
export type AudioProcessor = (
	channels: Float32Array[],
	sampleRate: number,
	virtualMedia: VirtualMediaData,
	ctx?: AudioProcessorContext,
) => void | Promise<void>;

export interface IBrowserProcessor {
	process(params: NodeProcessorParams): Promise<NodeResult | null>;
}

export type BrowserProcessorConstructor = new () => IBrowserProcessor;
