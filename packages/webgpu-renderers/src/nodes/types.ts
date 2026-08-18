import type { Rect } from "../renderer2d/index.js";

export interface VideoNodeProps {
	nodeId?: string;
	frameKey: string;
	sourceUrl: string;
	timestampSec: number;
	dstRect: Rect;
	opacity?: number;
	matrix?: DOMMatrix;
	isHeadless?: boolean;
	forceWait?: boolean;
	isPlaying?: boolean;
}

export interface ImageNodeProps {
	src: string;
	dstRect: Rect;
	opacity?: number;
	matrix?: DOMMatrix;
	isHeadless?: boolean;
}

export interface GifNodeProps {
	src: string;
	frame: number;
	fps: number;
	dstRect: Rect;
	fit?: "contain" | "cover" | "fill";
	opacity?: number;
	matrix?: DOMMatrix;
	isHeadless?: boolean;
}

export interface LottieNodeProps {
	src: string;
	frame: number;
	fps: number;
	dstRect: Rect;
	fit?: "contain" | "cover" | "fill";
	opacity?: number;
	matrix?: DOMMatrix;
	isHeadless?: boolean;
	animationId?: string;
	stateMachineId?: string;
	theme?: string;
}

export interface SVGNodeProps {
	src: string;
	dstRect: Rect;
	fit?: "contain" | "cover" | "fill";
	opacity?: number;
	matrix?: DOMMatrix;
	isHeadless?: boolean;
}

export interface HTMLNodeProps {
	nodeId?: string;
	htmlContent: string;
	dstRect: Rect;
	width: number;
	height: number;
	timeSec: number;
	opacity?: number;
	matrix?: DOMMatrix;
	isHeadless?: boolean;
}

export type TextAlign = "left" | "center" | "right";
export type StrokeAlign = "inside" | "center" | "outside";

export interface ParagraphNodeProps {
	text: string;
	dstRect: Rect;
	width?: number;
	height?: number;
	fontFamily?: string;
	fontSize?: number;
	color?: string;
	opacity?: number;
	matrix?: DOMMatrix;
	lineHeight?: number;
	align?: TextAlign;
	fontWeight?: number | string;
	fontStyle?: "normal" | "italic";
	letterSpacing?: number;
	textBackgroundColor?: string;
	strokeRadius?: number;
	borderRadius?: number;
	padding?: number;
	shadows?: Array<{
		color: string;
		blurRadius?: number;
		offset?: { x: number; y: number };
	}>;
	stroke?: string;
	strokeWidth?: number;
	strokeAlign?: StrokeAlign;
	textAlignVertical?: "top" | "middle" | "bottom";
	isHeadless?: boolean;
	highlightWordIndex?: number;
	highlightColor?: string;
	// Animation support
	animation?: {
		in?: string;
		out?: string;
		entranceMs?: number;
		exitMs?: number;
		kinetic?: "none" | "stack" | "wave" | "wiggle" | "shuffle";
		applyBy?: "char" | "word" | "line";
		smoothing?: boolean;
		activeColor?: string;
	};
	frame?: number;
	fps?: number;
	durationMs?: number;
	elapsedMs?: number;
	isCaption?: boolean;
	isVideoMode?: boolean;
	renderId?: string;
}

export interface CaptionNodeProps extends Omit<ParagraphNodeProps, "text"> {
	text?: string;
	src: string;
	frame: number;
	fps: number;
	maxWidth?: number;
	padding?: number;
	verticalAlign?: "top" | "middle" | "bottom";
}

export interface BlurNodeProps {
	strength: number;
}

export interface SignalNodeProps {
	nodeId?: string;
	func: string;
	amplitude: number;
	frequency: number;
	phase: number;
	offset: number;
	signalConfig?: any;
	frame: number;
	fps: number;
	elapsedMs?: number;
	durationMs?: number;
	width: number;
	height: number;
	drawChild?: any;
	playbackRateOverride?: number;
	opacity?: number;
	renderId?: string;
}
