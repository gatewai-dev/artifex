import type { SlugCodePoint, SlugFont } from "./slug-loader.js";

export interface SlugGlyphLayout {
	char: string;
	cp: SlugCodePoint;
	x: number;
	y: number;
	lineIndex: number;
	wordIndex: number;
	charIndex: number;
	unitIndex: number; // Index of the animation unit this glyph belongs to
	isSpace: boolean;
}

export interface SlugEmojiLayout {
	char: string;
	x: number;
	y: number;
	size: number;
	lineIndex: number;
}

export interface SlugLayoutResult {
	glyphs: SlugGlyphLayout[];
	emojis: SlugEmojiLayout[];
	totalHeight: number;
	linesCount: number;
	wordsCount: number;
	charsCount: number;
}

const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

export class SlugGeometry {
	static layout(
		text: string,
		font: SlugFont,
		fontSize: number,
		letterSpacing: number,
		lineHeight: number,
		maxWidth: number,
		align: "left" | "center" | "right" | "start" | "end" = "left",
		applyBy: "line" | "word" | "char" = "word",
		alignWidth?: number,
	): SlugLayoutResult {
		const fontScale = fontSize / font.unitsPerEm;

		// 1. Tokenize text into paragraph lines, words, and spaces
		const rawLines = text.split("\n");

		interface RawGlyph {
			char: string;
			cp: SlugCodePoint | null;
			isEmoji: boolean;
			isSpace: boolean;
			x: number; // local X offset in the token
		}

		interface RawLine {
			glyphs: RawGlyph[];
			width: number;
		}

		const lines: RawLine[] = [];

		for (const rawLine of rawLines) {
			const tokens = rawLine.split(/(\s+)/);
			let currentLineGlyphs: RawGlyph[] = [];
			let currentLineWidth = 0;

			for (const token of tokens) {
				if (!token) continue;

				const isSpace = /^\s+$/.test(token);
				let tokenWidth = 0;
				const tokenGlyphs: RawGlyph[] = [];

				for (const char of token) {
					const codePoint = char.codePointAt(0) || 0;
					const isEmoji = EMOJI_REGEX.test(char);

					let cp: SlugCodePoint | null = null;
					let adv = 0;

					if (isEmoji) {
						adv = fontSize;
					} else {
						cp =
							font.codePoints.get(codePoint) || font.codePoints.get(-1) || null;
						adv = (cp?.advanceWidth || 0) * fontScale;
					}

					tokenGlyphs.push({
						char,
						cp,
						isEmoji,
						isSpace,
						x: tokenWidth,
					});

					tokenWidth += adv + letterSpacing;
				}

				if (isSpace) {
					// Skip leading spaces on a new line (after a word-wrap reset)
					if (currentLineGlyphs.length === 0) continue;
					for (const tg of tokenGlyphs) {
						tg.x += currentLineWidth;
						currentLineGlyphs.push(tg);
					}
					currentLineWidth += tokenWidth;
				} else {
					if (
						currentLineWidth > 0 &&
						currentLineWidth + tokenWidth > maxWidth
					) {
						lines.push({
							glyphs: currentLineGlyphs,
							width: currentLineWidth,
						});
						currentLineGlyphs = [];
						currentLineWidth = 0;
					}

					for (const tg of tokenGlyphs) {
						tg.x += currentLineWidth;
						currentLineGlyphs.push(tg);
					}
					currentLineWidth += tokenWidth;
				}
			}

			lines.push({
				glyphs: currentLineGlyphs,
				width: currentLineWidth,
			});
		}

		// 2. Position lines and build detailed glyph descriptions
		const glyphs: SlugGlyphLayout[] = [];
		const emojis: SlugEmojiLayout[] = [];

		let currentY = font.ascender * fontScale; // Baseline of first line
		let wordIndex = 0;
		let charIndex = 0;

		const isCenter = align === "center";
		const isRight = align === "right" || align === "end";

		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			const line = lines[lineIndex];
			let visibleLineWidth = line.width;
			for (let i = line.glyphs.length - 1; i >= 0; i--) {
				const g = line.glyphs[i];
				if (!g.isSpace) {
					const adv = g.isEmoji
						? fontSize
						: (g.cp?.advanceWidth || 0) * fontScale;
					visibleLineWidth = g.x + adv;
					break;
				}
			}

			const targetAlignWidth = alignWidth ?? maxWidth;
			let alignOffset = 0;
			if (isCenter) {
				alignOffset = (targetAlignWidth - visibleLineWidth) / 2;
			} else if (isRight) {
				alignOffset = targetAlignWidth - visibleLineWidth;
			}

			let inWord = false;

			for (let gIdx = 0; gIdx < line.glyphs.length; gIdx++) {
				const g = line.glyphs[gIdx];
				const charX = g.x + alignOffset;

				if (g.isEmoji) {
					emojis.push({
						char: g.char,
						x: charX,
						y: currentY - fontSize,
						size: fontSize,
						lineIndex,
					});
					charIndex++;
				} else if (g.cp) {
					if (g.isSpace) {
						if (inWord) {
							wordIndex++;
							inWord = false;
						}
					} else {
						if (!inWord) {
							inWord = true;
						}
					}

					let mappedUnitIndex = 0;
					if (applyBy === "line") {
						mappedUnitIndex = lineIndex;
					} else if (applyBy === "word") {
						mappedUnitIndex = wordIndex;
					} else {
						mappedUnitIndex = charIndex;
					}

					glyphs.push({
						char: g.char,
						cp: g.cp,
						x: charX,
						y: currentY,
						lineIndex,
						wordIndex,
						charIndex,
						unitIndex: mappedUnitIndex,
						isSpace: g.isSpace,
					});

					charIndex++;
				}
			}

			if (inWord) {
				wordIndex++;
			}
			currentY += lineHeight;
		}

		const totalHeight = currentY - lineHeight + -font.descender * fontScale;

		// Calculate total distinct unit counts
		let maxUnitIndex = 0;
		for (const g of glyphs) {
			if (!g.isSpace && g.unitIndex > maxUnitIndex) {
				maxUnitIndex = g.unitIndex;
			}
		}

		return {
			glyphs,
			emojis,
			totalHeight,
			linesCount: lines.length,
			wordsCount: wordIndex,
			charsCount: charIndex,
		};
	}

	/**
	 * Measure the actual bounding-box of laid-out text using the Slug font metrics.
	 * When no explicit maxWidth is given, text is laid out on a single line per paragraph.
	 */
	static measure(
		text: string,
		font: SlugFont,
		fontSize: number,
		letterSpacing: number,
		lineHeight: number,
		maxWidth?: number,
	): { width: number; height: number } {
		const effectiveMaxWidth = maxWidth ?? Number.MAX_SAFE_INTEGER;
		const layout = SlugGeometry.layout(
			text,
			font,
			fontSize,
			letterSpacing,
			lineHeight,
			effectiveMaxWidth,
			"left",
			"word",
		);

		// Compute the actual content width from the lines
		const fontScale = fontSize / font.unitsPerEm;
		let contentWidth = 0;

		// Walk all non-space glyphs to find the rightmost edge per line
		const lineWidths = new Map<number, number>();
		for (const g of layout.glyphs) {
			if (g.isSpace) continue;
			const glyphRight = g.x + g.cp.advanceWidth * fontScale;
			const cur = lineWidths.get(g.lineIndex) ?? 0;
			if (glyphRight > cur) {
				lineWidths.set(g.lineIndex, glyphRight);
			}
		}
		// Also walk all emojis to find the rightmost edge per line
		for (const emoji of layout.emojis) {
			const emojiRight = emoji.x + emoji.size;
			const cur = lineWidths.get(emoji.lineIndex) ?? 0;
			if (emojiRight > cur) {
				lineWidths.set(emoji.lineIndex, emojiRight);
			}
		}
		for (const w of lineWidths.values()) {
			if (w > contentWidth) contentWidth = w;
		}

		// Add trailing letterSpacing like the text-measurer does
		if (letterSpacing > 0) {
			contentWidth += letterSpacing;
		}

		return {
			width: Math.ceil(contentWidth) + 2,
			height: Math.ceil(layout.totalHeight) + 2,
		};
	}
}
