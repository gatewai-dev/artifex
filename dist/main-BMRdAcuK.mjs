import { o as __toESM } from "./chunk-DPkJJFeX.mjs";
import { t as ensureEnvDefaults } from "./env-CCT1yCAD.mjs";
import { E as hasOnlySingleSource, T as getMediaType, m as agentBulkUpdateSchema, r as DataTypeVal, v as createVirtualMedia, x as findSourceAsset } from "./dist-DBCHxcBj.mjs";
import { a as TOKENS, c as logger, d as rendererLogger, n as ENV_CONFIG, o as container } from "./dist-DxkWl3Vo.mjs";
import { n as GetFontAssetUrl, r as R2_CUSTOM_DOMAIN } from "./dist-DtlkxQom.mjs";
import { $t as validateSubtitleMetadata, A as textureCache, An as last$1, At as iterateNalUnitsInAnnexB$1, B as CustomVideoDecoder, Bn as toUint8Array$1, Bt as computeMp3FrameSize, Cn as colorSpaceIsComplete, Ct as MIN_BOX_HEADER_SIZE, D as shaderStore, Dn as isIso639Dash2LanguageCode, Dt as determineVideoPacketType, E as registerHeadlessFont, En as imageMimeTypeToExtension, Et as concatNalUnitsInLengthPrefixed, Fn as setUint24, Ft as serializeHevcDecoderConfigurationRecord$1, G as registerEncoder, Gt as OPUS_SAMPLE_RATE, H as customAudioEncoders, Hn as wait, Ht as readMp3FrameHeader, I as toAlaw, In as simplifyRational$1, It as INFO, J as QUALITY_MEDIUM, Jt as VIDEO_CODECS, K as QUALITY_HIGH, Kt as PCM_AUDIO_CODECS, L as toUlaw, Ln as textEncoder, Lt as KILOBIT_RATES, Mn as promiseWithResolvers, Mt as parseEac3SyncFrame, N as Id3V2Writer, Nn as roundToDivisor, Nt as parseOpusIdentificationHeader, On as isU32, Ot as extractAvcDecoderConfigurationRecord$1, P as FileSlice, Pn as setInt24, Pt as serializeAvcDecoderConfigurationRecord$1, Q as buildVideoEncoderConfig, Qt as validateAudioChunkMetadata, R as CustomAudioDecoder, Rn as toArray, Rt as XING, S as lutStore, Sn as clamp, St as MAX_BOX_HEADER_SIZE, Tn as floorToDivisor, Tt as EncodedPacket, U as customVideoEncoders, Un as writeBits, Ut as AUDIO_CODECS, V as CustomVideoEncoder, Vn as uint8ArraysAreEqual, Vt as getXingOffset, W as registerDecoder, Wt as NON_PCM_AUDIO_CODECS, X as QUALITY_VERY_LOW, Xt as generateVp9CodecConfigurationFromCodecString, Y as QUALITY_VERY_HIGH, Yt as generateAv1CodecConfigurationFromCodecString, Z as buildAudioEncoderConfig, Zt as parsePcmCodec, _n as TRANSFER_CHARACTERISTICS_MAP$1, _t as EBMLFloat64, a as WebGPUAudioProcessor, an as Bitstream$1, at as VideoSampleColorSpace, b as initHeadlessWebGPU, bn as assertNever$1, bt as EBMLUnicodeString, cn as metadataTagsAreEmpty, ct as registerVideoSampleTransformer, dn as Logging$1, dt as MAX_ADTS_FRAME_HEADER_SIZE, en as validateVideoChunkMetadata, et as validateAudioEncodingConfig, fn as AsyncMutex, ft as MIN_ADTS_FRAME_HEADER_SIZE, gn as MATRIX_COEFFICIENTS_MAP$1, gt as EBMLFloat32, hn as EventEmitter$1, ht as CODEC_STRING_MAP, in as parseAacAudioSpecificConfig$1, it as VideoSample, jn as normalizeRotation, jt as parseAc3SyncFrame, kn as keyValueIterator, kt as extractHevcDecoderConfigurationRecord$1, ln as validateMetadataTags, lt as toInterleavedAudioFormat, mn as CallSerializer, mt as buildMatroskaMimeType, n as Renderer2D, nn as aacFrequencyTable$1, nt as AudioSample, on as AttachedFile, ot as VideoSampleResource, pn as COLOR_PRIMARIES_MAP$1, pt as readAdtsFrameHeader, q as QUALITY_LOW, qt as SUBTITLE_CODECS, r as SlugFontCache, rn as buildAacAudioSpecificConfig, rt as AudioSampleResource, s as clearAllVideoCache, sn as RichImageData, st as audioSampleToInterleavedFormat, t as NodeSurfaceProvider, tn as aacChannelMap$1, tt as validateVideoEncodingConfig, un as validateTrackDisposition, ut as node_exports, v as ensureDevice, vn as UNDETERMINED_LANGUAGE, vt as EBMLId, w as mediaDecoderCache, wn as computeRationalApproximation, wt as buildIsobmffMimeType, xn as binarySearchLessOrEqual$1, xt as EBMLWriter, yn as assert$3, yt as EBMLSignedInt, z as CustomAudioEncoder, zn as toDataView$1, zt as XingFlags } from "./dist-DnO6zPQ-.mjs";
import { n as createFileAsset, r as extractMediaMetadata, t as ServerMediaService } from "./server-DRy159Y_.mjs";
import "./src-CA7_tJ-a.mjs";
import { r as SkillRegistry, t as NodeRegistry } from "./server-CTnlsWzD.mjs";
import { n as registerWebGPURenderer, t as audioRegistry } from "./browser-G8bOolNE.mjs";
import { n as drawCompositionTree, o as preloadFont, r as mixAudioTracks, t as compositionStateStore } from "./dist-DG-TiLPB.mjs";
import fs, { createReadStream, existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { fileURLToPath } from "node:url";
import z from "zod";
import { inject, injectable } from "inversify";
import assert from "node:assert";
import "reflect-metadata";
import crypto, { randomUUID } from "node:crypto";
import sharp from "sharp";
import { execSync, spawn } from "node:child_process";
import * as yaml from "js-yaml";
import { createFalClient } from "@fal-ai/client";
import OpenAI from "openai";
import * as NodeAv8 from "node-av";
import * as webcodecs from "@napi-rs/webcodecs";
import { Canvas, Image } from "skia-canvas";
import pLimit from "p-limit";

//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/muxer.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var Muxer = class {
	constructor(output) {
		this.mutex = new AsyncMutex();
		this.trackTimestampInfo = /* @__PURE__ */ new WeakMap();
		this.output = output;
	}
	onTrackClose(track) {}
	validateTimestamp(track, timestampInSeconds, isKeyPacket) {
		if (timestampInSeconds < 0) throw new Error(`Timestamps must be non-negative (got ${timestampInSeconds}s).`);
		let timestampInfo = this.trackTimestampInfo.get(track);
		if (!timestampInfo) {
			if (!isKeyPacket) throw new Error("First packet must be a key packet.");
			timestampInfo = {
				maxTimestamp: timestampInSeconds,
				maxTimestampBeforeLastKeyPacket: null
			};
			this.trackTimestampInfo.set(track, timestampInfo);
		} else {
			if (isKeyPacket) timestampInfo.maxTimestampBeforeLastKeyPacket = timestampInfo.maxTimestamp;
			if (timestampInfo.maxTimestampBeforeLastKeyPacket !== null && timestampInSeconds < timestampInfo.maxTimestampBeforeLastKeyPacket) throw new Error(`Timestamps cannot be smaller than the largest timestamp of the previous GOP (a GOP begins with a key packet and ends right before the next key packet). Got ${timestampInSeconds}s, but largest timestamp is ${timestampInfo.maxTimestampBeforeLastKeyPacket}s.`);
			timestampInfo.maxTimestamp = Math.max(timestampInfo.maxTimestamp, timestampInSeconds);
		}
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/subtitles.js
const inlineTimestampRegex = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g;
const timestampRegex = /(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})/;
const parseSubtitleTimestamp = (string) => {
	const match = timestampRegex.exec(string);
	if (!match) throw new Error("Expected match.");
	return 3600 * 1e3 * Number(match[1] || "0") + 60 * 1e3 * Number(match[2]) + 1e3 * Number(match[3]) + Number(match[4]);
};
const formatSubtitleTimestamp = (timestamp) => {
	const hours = Math.floor(timestamp / (3600 * 1e3));
	const minutes = Math.floor(timestamp % (3600 * 1e3) / (60 * 1e3));
	const seconds = Math.floor(timestamp % (60 * 1e3) / 1e3);
	const milliseconds = timestamp % 1e3;
	return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + "." + milliseconds.toString().padStart(3, "0");
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/isobmff/isobmff-boxes.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var IsobmffBoxWriter = class {
	constructor(writer) {
		this.writer = writer;
		this.helper = new Uint8Array(8);
		this.helperView = new DataView(this.helper.buffer);
		/**
		* Stores the position from the start of the file to where boxes elements have been written. This is used to
		* rewrite/edit elements that were already added before, and to measure sizes of things.
		*/
		this.offsets = /* @__PURE__ */ new WeakMap();
	}
	writeU32(value) {
		this.helperView.setUint32(0, value, false);
		this.writer.write(this.helper.subarray(0, 4));
	}
	writeU64(value) {
		this.helperView.setUint32(0, Math.floor(value / 2 ** 32), false);
		this.helperView.setUint32(4, value, false);
		this.writer.write(this.helper.subarray(0, 8));
	}
	writeAscii(text) {
		for (let i = 0; i < text.length; i++) {
			this.helperView.setUint8(i % 8, text.charCodeAt(i));
			if (i % 8 === 7) this.writer.write(this.helper);
		}
		if (text.length % 8 !== 0) this.writer.write(this.helper.subarray(0, text.length % 8));
	}
	writeBox(box$1) {
		this.offsets.set(box$1, this.writer.getPos());
		if (box$1.contents && !box$1.children) {
			this.writeBoxHeader(box$1, box$1.size ?? box$1.contents.byteLength + 8);
			this.writer.write(box$1.contents);
		} else {
			const startPos = this.writer.getPos();
			this.writeBoxHeader(box$1, 0);
			if (box$1.contents) this.writer.write(box$1.contents);
			if (box$1.children) {
				for (const child of box$1.children) if (child) this.writeBox(child);
			}
			const endPos = this.writer.getPos();
			const size = box$1.size ?? endPos - startPos;
			this.writer.seek(startPos);
			this.writeBoxHeader(box$1, size);
			this.writer.seek(endPos);
		}
	}
	writeBoxHeader(box$1, size) {
		this.writeU32(box$1.largeSize ? 1 : size);
		this.writeAscii(box$1.type);
		if (box$1.largeSize) this.writeU64(size);
	}
	measureBoxHeader(box$1) {
		return 8 + (box$1.largeSize ? 8 : 0);
	}
	patchBox(box$1) {
		const boxOffset = this.offsets.get(box$1);
		assert$3(boxOffset !== void 0);
		const endPos = this.writer.getPos();
		this.writer.seek(boxOffset);
		this.writeBox(box$1);
		this.writer.seek(endPos);
	}
	measureBox(box$1) {
		if (box$1.contents && !box$1.children) return this.measureBoxHeader(box$1) + box$1.contents.byteLength;
		else {
			let result = this.measureBoxHeader(box$1);
			if (box$1.contents) result += box$1.contents.byteLength;
			if (box$1.children) {
				for (const child of box$1.children) if (child) result += this.measureBox(child);
			}
			return result;
		}
	}
};
const bytes = /* @__PURE__ */ new Uint8Array(8);
const view = /* @__PURE__ */ new DataView(bytes.buffer);
const u8 = (value) => {
	return [(value % 256 + 256) % 256];
};
const u16 = (value) => {
	view.setUint16(0, value, false);
	return [bytes[0], bytes[1]];
};
const i16 = (value) => {
	view.setInt16(0, value, false);
	return [bytes[0], bytes[1]];
};
const u24 = (value) => {
	view.setUint32(0, value, false);
	return [
		bytes[1],
		bytes[2],
		bytes[3]
	];
};
const u32 = (value) => {
	view.setUint32(0, value, false);
	return [
		bytes[0],
		bytes[1],
		bytes[2],
		bytes[3]
	];
};
const i32 = (value) => {
	view.setInt32(0, value, false);
	return [
		bytes[0],
		bytes[1],
		bytes[2],
		bytes[3]
	];
};
const u64 = (value) => {
	view.setUint32(0, Math.floor(value / 2 ** 32), false);
	view.setUint32(4, value, false);
	return [
		bytes[0],
		bytes[1],
		bytes[2],
		bytes[3],
		bytes[4],
		bytes[5],
		bytes[6],
		bytes[7]
	];
};
const i64 = (value) => {
	view.setInt32(0, Math.floor(value / 2 ** 32), false);
	view.setUint32(4, value, false);
	return [
		bytes[0],
		bytes[1],
		bytes[2],
		bytes[3],
		bytes[4],
		bytes[5],
		bytes[6],
		bytes[7]
	];
};
const fixed_8_8 = (value) => {
	view.setInt16(0, 2 ** 8 * value, false);
	return [bytes[0], bytes[1]];
};
const fixed_16_16 = (value) => {
	view.setInt32(0, 2 ** 16 * value, false);
	return [
		bytes[0],
		bytes[1],
		bytes[2],
		bytes[3]
	];
};
const fixed_2_30 = (value) => {
	view.setInt32(0, 2 ** 30 * value, false);
	return [
		bytes[0],
		bytes[1],
		bytes[2],
		bytes[3]
	];
};
const variableUnsignedInt = (value, byteLength) => {
	const bytes$1 = [];
	let remaining = value;
	do {
		let byte = remaining & 127;
		remaining >>= 7;
		if (bytes$1.length > 0) byte |= 128;
		bytes$1.push(byte);
		if (byteLength !== void 0) byteLength--;
	} while (remaining > 0 || byteLength);
	return bytes$1.reverse();
};
const ascii = (text, nullTerminated = false) => {
	const bytes$1 = Array(text.length).fill(null).map((_$1, i) => text.charCodeAt(i));
	if (nullTerminated) bytes$1.push(0);
	return bytes$1;
};
const rotationMatrix = (rotationInDegrees) => {
	const theta = rotationInDegrees * (Math.PI / 180);
	const cosTheta = Math.round(Math.cos(theta));
	const sinTheta = Math.round(Math.sin(theta));
	return [
		cosTheta,
		sinTheta,
		0,
		-sinTheta,
		cosTheta,
		0,
		0,
		0,
		1
	];
};
const IDENTITY_MATRIX = /* @__PURE__ */ rotationMatrix(0);
const matrixToBytes = (matrix) => {
	return [
		fixed_16_16(matrix[0]),
		fixed_16_16(matrix[1]),
		fixed_2_30(matrix[2]),
		fixed_16_16(matrix[3]),
		fixed_16_16(matrix[4]),
		fixed_2_30(matrix[5]),
		fixed_16_16(matrix[6]),
		fixed_16_16(matrix[7]),
		fixed_2_30(matrix[8])
	];
};
const box = (type, contents, children) => ({
	type,
	contents: contents && new Uint8Array(contents.flat(10)),
	children
});
/** A FullBox always starts with a version byte, followed by three flag bytes. */
const fullBox = (type, version, flags, contents, children) => box(type, [
	u8(version),
	u24(flags),
	contents ?? []
], children);
/**
* File Type Compatibility Box: Allows the reader to determine whether this is a type of file that the
* reader understands.
*/
const ftyp = (details) => {
	const minorVersion = 512;
	if (details.isQuickTime) return box("ftyp", [
		ascii("qt  "),
		u32(minorVersion),
		ascii("qt  ")
	]);
	if (details.fragmented) if (details.cmaf) return box("ftyp", [
		ascii("iso5"),
		u32(minorVersion),
		ascii("iso5"),
		ascii("iso6"),
		ascii("mp41"),
		ascii("cmfc"),
		ascii("dash")
	]);
	else return box("ftyp", [
		ascii("iso5"),
		u32(minorVersion),
		ascii("iso5"),
		ascii("iso6"),
		ascii("mp41")
	]);
	return box("ftyp", [
		ascii("isom"),
		u32(minorVersion),
		ascii("isom"),
		details.holdsAvc ? ascii("avc1") : [],
		ascii("mp41")
	]);
};
/** Segment Type Box */
const styp = () => box("styp", [
	ascii("iso5"),
	u32(0),
	ascii("iso5"),
	ascii("iso6"),
	ascii("mp41"),
	ascii("cmfc"),
	ascii("dash")
]);
/** Segment Index Box */
const sidx = (muxer, referencedSize) => {
	let duration = muxer.maxWrittenEndTimestamp - muxer.minWrittenTimestamp;
	if (!Number.isFinite(duration)) duration = 0;
	return fullBox("sidx", 1, 0, [
		u32(1),
		u32(GLOBAL_TIMESCALE),
		u64(intoTimescale(muxer.minWrittenTimestamp, GLOBAL_TIMESCALE)),
		u64(0),
		u16(0),
		u16(1),
		u32(referencedSize & 2147483647),
		u32(intoTimescale(duration, GLOBAL_TIMESCALE)),
		u32(0)
	]);
};
/** Movie Sample Data Box. Contains the actual frames/samples of the media. */
const mdat = (reserveLargeSize) => ({
	type: "mdat",
	largeSize: reserveLargeSize
});
/** Free Space Box: A box that designates unused space in the movie data file. */
const free = (size) => ({
	type: "free",
	size
});
/**
* Movie Box: Used to specify the information that defines a movie - that is, the information that allows
* an application to interpret the sample data that is stored elsewhere.
*/
const moov = (muxer) => {
	return box("moov", void 0, [
		mvhd(muxer.creationTime, muxer.trackDatas),
		...muxer.trackDatas.map((x$1) => trak(x$1, muxer.creationTime)),
		muxer.isFragmented ? mvex(muxer.trackDatas) : null,
		udta(muxer)
	]);
};
/** Movie Header Box: Used to specify the characteristics of the entire movie, such as timescale and duration. */
const mvhd = (creationTime, trackDatas) => {
	const duration = Math.max(0, ...trackDatas.map((trackData) => intoTimescale(presentationSpan(trackData), GLOBAL_TIMESCALE) + intoTimescale(trackData.startTimestampOffset ?? 0, GLOBAL_TIMESCALE)));
	const nextTrackId = Math.max(0, ...trackDatas.map((x$1) => x$1.track.id)) + 1;
	const needsU64 = !isU32(creationTime) || !isU32(duration);
	const u32OrU64 = needsU64 ? u64 : u32;
	return fullBox("mvhd", +needsU64, 0, [
		u32OrU64(creationTime),
		u32OrU64(creationTime),
		u32(GLOBAL_TIMESCALE),
		u32OrU64(duration),
		fixed_16_16(1),
		fixed_8_8(1),
		Array(10).fill(0),
		matrixToBytes(IDENTITY_MATRIX),
		Array(24).fill(0),
		u32(nextTrackId)
	]);
};
const presentationSpan = (trackData) => {
	if (trackData.samples.length === 0) return 0;
	let minTimestamp = Infinity;
	let maxEndTimestamp = -Infinity;
	for (let i = 0; i < trackData.samples.length; i++) {
		const sample = trackData.samples[i];
		if (sample.timestamp < minTimestamp) minTimestamp = sample.timestamp;
		if (sample.timestamp + sample.duration > maxEndTimestamp) maxEndTimestamp = sample.timestamp + sample.duration;
	}
	if (minTimestamp === Infinity) return 0;
	return maxEndTimestamp - minTimestamp;
};
/**
* Track Box: Defines a single track of a movie. A movie may consist of one or more tracks. Each track is
* independent of the other tracks in the movie and carries its own temporal and spatial information. Each Track Box
* contains its associated Media Box.
*/
const trak = (trackData, creationTime) => {
	const trackMetadata = getTrackMetadata(trackData);
	const needsEditList = trackData.startTimestampOffset !== null && trackData.startTimestampOffset > 0;
	return box("trak", void 0, [
		tkhd(trackData, creationTime),
		needsEditList ? edts(trackData, trackData.startTimestampOffset) : null,
		mdia(trackData, creationTime),
		trackMetadata.name !== void 0 ? box("udta", void 0, [box("name", [...textEncoder.encode(trackMetadata.name)])]) : null
	]);
};
/** Track Header Box: Specifies the characteristics of a single track within a movie. */
const tkhd = (trackData, creationTime) => {
	const durationInGlobalTimescale = intoTimescale(presentationSpan(trackData), GLOBAL_TIMESCALE) + intoTimescale(trackData.startTimestampOffset ?? 0, GLOBAL_TIMESCALE);
	const needsU64 = !isU32(creationTime) || !isU32(durationInGlobalTimescale);
	const u32OrU64 = needsU64 ? u64 : u32;
	let matrix;
	if (trackData.type === "video") {
		const rotation = trackData.track.metadata.rotation;
		matrix = rotationMatrix(rotation ?? 0);
	} else matrix = IDENTITY_MATRIX;
	let flags = 2;
	if (trackData.track.metadata.disposition?.default !== false) flags |= 1;
	return fullBox("tkhd", +needsU64, flags, [
		u32OrU64(creationTime),
		u32OrU64(creationTime),
		u32(trackData.track.id),
		u32(0),
		u32OrU64(durationInGlobalTimescale),
		Array(8).fill(0),
		u16(0),
		u16(trackData.track.id),
		fixed_8_8(trackData.type === "audio" ? 1 : 0),
		u16(0),
		matrixToBytes(matrix),
		fixed_16_16(trackData.type === "video" ? trackData.info.width : 0),
		fixed_16_16(trackData.type === "video" ? trackData.info.height : 0)
	]);
};
/** Edit Box: Specifies edits to the track's media. */
const edts = (trackData, offset) => {
	const startOffset = intoTimescale(offset, GLOBAL_TIMESCALE);
	const mediaDuration = intoTimescale(presentationSpan(trackData), GLOBAL_TIMESCALE);
	const needs64Bits = !isU32(startOffset) || !isU32(mediaDuration);
	const u32OrU64 = needs64Bits ? u64 : u32;
	const i32OrI64 = needs64Bits ? i64 : i32;
	return box("edts", void 0, [fullBox("elst", needs64Bits ? 1 : 0, 0, [
		u32(2),
		u32OrU64(startOffset),
		i32OrI64(-1),
		fixed_16_16(1),
		u32OrU64(mediaDuration),
		i32OrI64(0),
		fixed_16_16(1)
	])]);
};
/** Media Box: Describes and define a track's media type and sample data. */
const mdia = (trackData, creationTime) => box("mdia", void 0, [
	mdhd(trackData, creationTime),
	hdlr(true, TRACK_TYPE_TO_COMPONENT_SUBTYPE[trackData.type], TRACK_TYPE_TO_HANDLER_NAME[trackData.type]),
	minf(trackData)
]);
/** Media Header Box: Specifies the characteristics of a media, including timescale and duration. */
const mdhd = (trackData, creationTime) => {
	const localDuration = intoTimescale(presentationSpan(trackData), trackData.timescale);
	const needsU64 = !isU32(creationTime) || !isU32(localDuration);
	const u32OrU64 = needsU64 ? u64 : u32;
	return fullBox("mdhd", +needsU64, 0, [
		u32OrU64(creationTime),
		u32OrU64(creationTime),
		u32(trackData.timescale),
		u32OrU64(localDuration),
		u16(getLanguageCodeInt(trackData.track.metadata.languageCode ?? UNDETERMINED_LANGUAGE)),
		u16(0)
	]);
};
const TRACK_TYPE_TO_COMPONENT_SUBTYPE = {
	video: "vide",
	audio: "soun",
	subtitle: "text"
};
const TRACK_TYPE_TO_HANDLER_NAME = {
	video: "MediabunnyVideoHandler",
	audio: "MediabunnySoundHandler",
	subtitle: "MediabunnyTextHandler"
};
/** Handler Reference Box. */
const hdlr = (hasComponentType, handlerType, name, manufacturer = "\0\0\0\0") => fullBox("hdlr", 0, 0, [
	hasComponentType ? ascii("mhlr") : u32(0),
	ascii(handlerType),
	ascii(manufacturer),
	u32(0),
	u32(0),
	ascii(name, true)
]);
/**
* Media Information Box: Stores handler-specific information for a track's media data. The media handler uses this
* information to map from media time to media data and to process the media data.
*/
const minf = (trackData) => box("minf", void 0, [
	TRACK_TYPE_TO_HEADER_BOX[trackData.type](),
	dinf(),
	stbl(trackData)
]);
/** Video Media Information Header Box: Defines specific color and graphics mode information. */
const vmhd = () => fullBox("vmhd", 0, 1, [
	u16(0),
	u16(0),
	u16(0),
	u16(0)
]);
/** Sound Media Information Header Box: Stores the sound media's control information, such as balance. */
const smhd = () => fullBox("smhd", 0, 0, [u16(0), u16(0)]);
/** Null Media Header Box. */
const nmhd = () => fullBox("nmhd", 0, 0);
const TRACK_TYPE_TO_HEADER_BOX = {
	video: vmhd,
	audio: smhd,
	subtitle: nmhd
};
/**
* Data Information Box: Contains information specifying the data handler component that provides access to the
* media data. The data handler component uses the Data Information Box to interpret the media's data.
*/
const dinf = () => box("dinf", void 0, [dref()]);
/**
* Data Reference Box: Contains tabular data that instructs the data handler component how to access the media's data.
*/
const dref = () => fullBox("dref", 0, 0, [u32(1)], [url()]);
const url = () => fullBox("url ", 0, 1);
/**
* Sample Table Box: Contains information for converting from media time to sample number to sample location. This box
* also indicates how to interpret the sample (for example, whether to decompress the video data and, if so, how).
*/
const stbl = (trackData) => {
	const needsCtts = trackData.compositionTimeOffsetTable.length > 1 || trackData.compositionTimeOffsetTable.some((x$1) => x$1.sampleCompositionTimeOffset !== 0);
	return box("stbl", void 0, [
		stsd(trackData),
		stts(trackData),
		needsCtts ? ctts(trackData) : null,
		needsCtts ? cslg(trackData) : null,
		stsc(trackData),
		stsz(trackData),
		stco(trackData),
		stss(trackData)
	]);
};
/**
* Sample Description Box: Stores information that allows you to decode samples in the media. The data stored in the
* sample description varies, depending on the media type.
*/
const stsd = (trackData) => {
	let sampleDescription;
	if (trackData.type === "video") sampleDescription = videoSampleDescription(videoCodecToBoxName(trackData.track.source._codec, trackData.info.decoderConfig.codec), trackData);
	else if (trackData.type === "audio") {
		const boxName = audioCodecToBoxName(trackData.track.source._codec, trackData.muxer.isQuickTime);
		assert$3(boxName);
		sampleDescription = soundSampleDescription(boxName, trackData);
	} else if (trackData.type === "subtitle") sampleDescription = subtitleSampleDescription(SUBTITLE_CODEC_TO_BOX_NAME[trackData.track.source._codec], trackData);
	assert$3(sampleDescription);
	return fullBox("stsd", 0, 0, [u32(1)], [sampleDescription]);
};
/** Video Sample Description Box: Contains information that defines how to interpret video media data. */
const videoSampleDescription = (compressionType, trackData) => box(compressionType, [
	Array(6).fill(0),
	u16(1),
	u16(0),
	u16(0),
	Array(12).fill(0),
	u16(trackData.info.width),
	u16(trackData.info.height),
	u32(4718592),
	u32(4718592),
	u32(0),
	u16(1),
	Array(32).fill(0),
	u16(24),
	i16(65535)
], [
	VIDEO_CODEC_TO_CONFIGURATION_BOX[trackData.track.source._codec]?.(trackData) ?? null,
	pasp(trackData),
	colorSpaceIsComplete(trackData.info.decoderConfig.colorSpace) ? colr(trackData) : null
]);
/** Pixel Aspect Ratio Box: Specifies pixel width:height spacing for non-square pixels. */
const pasp = (trackData) => {
	if (trackData.info.pixelAspectRatio.num === trackData.info.pixelAspectRatio.den) return null;
	return box("pasp", [u32(trackData.info.pixelAspectRatio.num), u32(trackData.info.pixelAspectRatio.den)]);
};
/** Colour Information Box: Specifies the color space of the video. */
const colr = (trackData) => box("colr", [
	ascii(trackData.muxer.isQuickTime ? "nclc" : "nclx"),
	u16(COLOR_PRIMARIES_MAP$1[trackData.info.decoderConfig.colorSpace.primaries]),
	u16(TRANSFER_CHARACTERISTICS_MAP$1[trackData.info.decoderConfig.colorSpace.transfer]),
	u16(MATRIX_COEFFICIENTS_MAP$1[trackData.info.decoderConfig.colorSpace.matrix]),
	trackData.muxer.isQuickTime ? [] : u8((trackData.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
]);
/** AVC Configuration Box: Provides additional information to the decoder. */
const avcC = (trackData) => trackData.info.decoderConfig && box("avcC", [...toUint8Array$1(trackData.info.decoderConfig.description)]);
/** HEVC Configuration Box: Provides additional information to the decoder. */
const hvcC = (trackData) => trackData.info.decoderConfig && box("hvcC", [...toUint8Array$1(trackData.info.decoderConfig.description)]);
/** VP Configuration Box: Provides additional information to the decoder. */
const vpcC = (trackData) => {
	if (!trackData.info.decoderConfig) return null;
	const decoderConfig = trackData.info.decoderConfig;
	const parts = decoderConfig.codec.split(".");
	const profile = Number(parts[1]);
	const level = Number(parts[2]);
	const bitDepth = Number(parts[3]);
	const chromaSubsampling = parts[4] ? Number(parts[4]) : 1;
	const videoFullRangeFlag = parts[8] ? Number(parts[8]) : Number(decoderConfig.colorSpace?.fullRange ?? 0);
	const thirdByte = (bitDepth << 4) + (chromaSubsampling << 1) + videoFullRangeFlag;
	const colourPrimaries = parts[5] ? Number(parts[5]) : decoderConfig.colorSpace?.primaries ? COLOR_PRIMARIES_MAP$1[decoderConfig.colorSpace.primaries] : 2;
	const transferCharacteristics = parts[6] ? Number(parts[6]) : decoderConfig.colorSpace?.transfer ? TRANSFER_CHARACTERISTICS_MAP$1[decoderConfig.colorSpace.transfer] : 2;
	const matrixCoefficients = parts[7] ? Number(parts[7]) : decoderConfig.colorSpace?.matrix ? MATRIX_COEFFICIENTS_MAP$1[decoderConfig.colorSpace.matrix] : 2;
	return fullBox("vpcC", 1, 0, [
		u8(profile),
		u8(level),
		u8(thirdByte),
		u8(colourPrimaries),
		u8(transferCharacteristics),
		u8(matrixCoefficients),
		u16(0)
	]);
};
/** AV1 Configuration Box: Provides additional information to the decoder. */
const av1C = (trackData) => {
	return box("av1C", generateAv1CodecConfigurationFromCodecString(trackData.info.decoderConfig.codec));
};
/** Sound Sample Description Box: Contains information that defines how to interpret sound media data. */
const soundSampleDescription = (compressionType, trackData) => {
	let version = 0;
	let contents;
	let sampleSizeInBits = 16;
	const isPcmCodec = PCM_AUDIO_CODECS.includes(trackData.track.source._codec);
	if (isPcmCodec) {
		const codec = trackData.track.source._codec;
		const { sampleSize } = parsePcmCodec(codec);
		sampleSizeInBits = 8 * sampleSize;
		if (sampleSizeInBits > 16) version = 1;
	}
	if (trackData.muxer.isQuickTime) version = 1;
	if (version === 0) contents = [
		Array(6).fill(0),
		u16(1),
		u16(version),
		u16(0),
		u32(0),
		u16(trackData.info.numberOfChannels),
		u16(sampleSizeInBits),
		u16(0),
		u16(0),
		u16(trackData.info.sampleRate < 2 ** 16 ? trackData.info.sampleRate : 0),
		u16(0)
	];
	else {
		const compressionId = isPcmCodec ? 0 : -2;
		contents = [
			Array(6).fill(0),
			u16(1),
			u16(version),
			u16(0),
			u32(0),
			u16(trackData.info.numberOfChannels),
			u16(Math.min(sampleSizeInBits, 16)),
			i16(compressionId),
			u16(0),
			u16(trackData.info.sampleRate < 2 ** 16 ? trackData.info.sampleRate : 0),
			u16(0),
			isPcmCodec ? [
				u32(1),
				u32(sampleSizeInBits / 8),
				u32(trackData.info.numberOfChannels * sampleSizeInBits / 8)
			] : [
				u32(0),
				u32(0),
				u32(0)
			],
			u32(2)
		];
	}
	return box(compressionType, contents, [audioCodecToConfigurationBox(trackData.track.source._codec, trackData.muxer.isQuickTime)?.(trackData) ?? null]);
};
/** MPEG-4 Elementary Stream Descriptor Box. */
const esds = (trackData) => {
	let objectTypeIndication;
	switch (trackData.track.source._codec) {
		case "aac":
			objectTypeIndication = 64;
			break;
		case "mp3":
			objectTypeIndication = 107;
			break;
		case "vorbis":
			objectTypeIndication = 221;
			break;
		default: throw new Error(`Unhandled audio codec: ${trackData.track.source._codec}`);
	}
	let bytes$1 = [
		...u8(objectTypeIndication),
		...u8(21),
		...u24(0),
		...u32(0),
		...u32(0)
	];
	if (trackData.info.decoderConfig.description) {
		const description = toUint8Array$1(trackData.info.decoderConfig.description);
		bytes$1 = [
			...bytes$1,
			...u8(5),
			...variableUnsignedInt(description.byteLength),
			...description
		];
	}
	bytes$1 = [
		...u16(1),
		...u8(0),
		...u8(4),
		...variableUnsignedInt(bytes$1.length),
		...bytes$1,
		...u8(6),
		...u8(1),
		...u8(2)
	];
	bytes$1 = [
		...u8(3),
		...variableUnsignedInt(bytes$1.length),
		...bytes$1
	];
	return fullBox("esds", 0, 0, bytes$1);
};
const wave = (trackData) => {
	return box("wave", void 0, [
		frma(trackData),
		enda(trackData),
		box("\0\0\0\0")
	]);
};
const frma = (trackData) => {
	return box("frma", [ascii(audioCodecToBoxName(trackData.track.source._codec, trackData.muxer.isQuickTime))]);
};
const enda = (trackData) => {
	const { littleEndian } = parsePcmCodec(trackData.track.source._codec);
	return box("enda", [u16(+littleEndian)]);
};
/** Opus Specific Box. */
const dOps = (trackData) => {
	let outputChannelCount = trackData.info.numberOfChannels;
	let preSkip = 3840;
	let inputSampleRate = trackData.info.sampleRate;
	let outputGain = 0;
	let channelMappingFamily = 0;
	let channelMappingTable = new Uint8Array(0);
	const description = trackData.info.decoderConfig?.description;
	if (description) {
		assert$3(description.byteLength >= 18);
		const header = parseOpusIdentificationHeader(toUint8Array$1(description));
		outputChannelCount = header.outputChannelCount;
		preSkip = header.preSkip;
		inputSampleRate = header.inputSampleRate;
		outputGain = header.outputGain;
		channelMappingFamily = header.channelMappingFamily;
		if (header.channelMappingTable) channelMappingTable = header.channelMappingTable;
	}
	return box("dOps", [
		u8(0),
		u8(outputChannelCount),
		u16(preSkip),
		u32(inputSampleRate),
		i16(outputGain),
		u8(channelMappingFamily),
		...channelMappingTable
	]);
};
/** FLAC specific box. */
const dfLa = (trackData) => {
	const description = trackData.info.decoderConfig?.description;
	assert$3(description);
	return fullBox("dfLa", 0, 0, [...toUint8Array$1(description).subarray(4)]);
};
/** PCM Configuration Box, ISO/IEC 23003-5. */
const pcmC = (trackData) => {
	const { littleEndian, sampleSize } = parsePcmCodec(trackData.track.source._codec);
	return fullBox("pcmC", 0, 0, [u8(+littleEndian), u8(8 * sampleSize)]);
};
/** AC3SpecificBox */
const dac3 = (trackData) => {
	const frameInfo = parseAc3SyncFrame(trackData.info.firstPacket.data);
	if (!frameInfo) throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
	const bytes$1 = new Uint8Array(3);
	const bitstream = new Bitstream$1(bytes$1);
	bitstream.writeBits(2, frameInfo.fscod);
	bitstream.writeBits(5, frameInfo.bsid);
	bitstream.writeBits(3, frameInfo.bsmod);
	bitstream.writeBits(3, frameInfo.acmod);
	bitstream.writeBits(1, frameInfo.lfeon);
	bitstream.writeBits(5, frameInfo.bitRateCode);
	bitstream.writeBits(5, 0);
	return box("dac3", [...bytes$1]);
};
/** EC3SpecificBox */
const dec3 = (trackData) => {
	const frameInfo = parseEac3SyncFrame(trackData.info.firstPacket.data);
	if (!frameInfo) throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
	let totalBits = 16;
	for (const sub of frameInfo.substreams) {
		totalBits += 23;
		if (sub.numDepSub > 0) totalBits += 9;
		else totalBits += 1;
	}
	const size = Math.ceil(totalBits / 8);
	const bytes$1 = new Uint8Array(size);
	const bitstream = new Bitstream$1(bytes$1);
	bitstream.writeBits(13, frameInfo.dataRate);
	bitstream.writeBits(3, frameInfo.substreams.length - 1);
	for (const sub of frameInfo.substreams) {
		bitstream.writeBits(2, sub.fscod);
		bitstream.writeBits(5, sub.bsid);
		bitstream.writeBits(1, 0);
		bitstream.writeBits(1, 0);
		bitstream.writeBits(3, sub.bsmod);
		bitstream.writeBits(3, sub.acmod);
		bitstream.writeBits(1, sub.lfeon);
		bitstream.writeBits(3, 0);
		bitstream.writeBits(4, sub.numDepSub);
		if (sub.numDepSub > 0) bitstream.writeBits(9, sub.chanLoc);
		else bitstream.writeBits(1, 0);
	}
	return box("dec3", [...bytes$1]);
};
const subtitleSampleDescription = (compressionType, trackData) => box(compressionType, [Array(6).fill(0), u16(1)], [SUBTITLE_CODEC_TO_CONFIGURATION_BOX[trackData.track.source._codec](trackData)]);
const vttC = (trackData) => box("vttC", [...textEncoder.encode(trackData.info.config.description)]);
/**
* Time-To-Sample Box: Stores duration information for a media's samples, providing a mapping from a time in a media
* to the corresponding data sample. The table is compact, meaning that consecutive samples with the same time delta
* will be grouped.
*/
const stts = (trackData) => {
	return fullBox("stts", 0, 0, [u32(trackData.timeToSampleTable.length), trackData.timeToSampleTable.map((x$1) => [u32(x$1.sampleCount), u32(x$1.sampleDelta)])]);
};
/** Sync Sample Box: Identifies the key frames in the media, marking the random access points within a stream. */
const stss = (trackData) => {
	if (trackData.samples.every((x$1) => x$1.type === "key")) return null;
	const keySamples = [...trackData.samples.entries()].filter(([, sample]) => sample.type === "key");
	return fullBox("stss", 0, 0, [u32(keySamples.length), keySamples.map(([index]) => u32(index + 1))]);
};
/**
* Sample-To-Chunk Box: As samples are added to a media, they are collected into chunks that allow optimized data
* access. A chunk contains one or more samples. Chunks in a media may have different sizes, and the samples within a
* chunk may have different sizes. The Sample-To-Chunk Box stores chunk information for the samples in a media, stored
* in a compactly-coded fashion.
*/
const stsc = (trackData) => {
	return fullBox("stsc", 0, 0, [u32(trackData.compactlyCodedChunkTable.length), trackData.compactlyCodedChunkTable.map((x$1) => [
		u32(x$1.firstChunk),
		u32(x$1.samplesPerChunk),
		u32(1)
	])]);
};
/** Sample Size Box: Specifies the byte size of each sample in the media. */
const stsz = (trackData) => {
	if (trackData.type === "audio" && trackData.info.requiresPcmTransformation) {
		const { sampleSize } = parsePcmCodec(trackData.track.source._codec);
		return fullBox("stsz", 0, 0, [u32(sampleSize * trackData.info.numberOfChannels), u32(trackData.samples.reduce((acc, x$1) => acc + intoTimescale(x$1.duration, trackData.timescale), 0))]);
	}
	return fullBox("stsz", 0, 0, [
		u32(0),
		u32(trackData.samples.length),
		trackData.samples.map((x$1) => u32(x$1.size))
	]);
};
/** Chunk Offset Box: Identifies the location of each chunk of data in the media's data stream, relative to the file. */
const stco = (trackData) => {
	if (trackData.finalizedChunks.length > 0 && last$1(trackData.finalizedChunks).offset >= 2 ** 32) return fullBox("co64", 0, 0, [u32(trackData.finalizedChunks.length), trackData.finalizedChunks.map((x$1) => u64(x$1.offset))]);
	return fullBox("stco", 0, 0, [u32(trackData.finalizedChunks.length), trackData.finalizedChunks.map((x$1) => u32(x$1.offset))]);
};
/**
* Composition Time to Sample Box: Stores composition time offset information (PTS-DTS) for a
* media's samples. The table is compact, meaning that consecutive samples with the same time
* composition time offset will be grouped.
*/
const ctts = (trackData) => {
	return fullBox("ctts", 1, 0, [u32(trackData.compositionTimeOffsetTable.length), trackData.compositionTimeOffsetTable.map((x$1) => [u32(x$1.sampleCount), i32(x$1.sampleCompositionTimeOffset)])]);
};
/**
* Composition to Decode Box: Stores information about the composition and display times of the media samples.
*/
const cslg = (trackData) => {
	let leastDecodeToDisplayDelta = Infinity;
	let greatestDecodeToDisplayDelta = -Infinity;
	let compositionStartTime = Infinity;
	let compositionEndTime = -Infinity;
	assert$3(trackData.compositionTimeOffsetTable.length > 0);
	assert$3(trackData.samples.length > 0);
	for (let i = 0; i < trackData.compositionTimeOffsetTable.length; i++) {
		const entry = trackData.compositionTimeOffsetTable[i];
		leastDecodeToDisplayDelta = Math.min(leastDecodeToDisplayDelta, entry.sampleCompositionTimeOffset);
		greatestDecodeToDisplayDelta = Math.max(greatestDecodeToDisplayDelta, entry.sampleCompositionTimeOffset);
	}
	for (let i = 0; i < trackData.samples.length; i++) {
		const sample = trackData.samples[i];
		compositionStartTime = Math.min(compositionStartTime, intoTimescale(sample.timestamp, trackData.timescale));
		compositionEndTime = Math.max(compositionEndTime, intoTimescale(sample.timestamp + sample.duration, trackData.timescale));
	}
	const compositionToDtsShift = Math.max(-leastDecodeToDisplayDelta, 0);
	if (compositionEndTime >= 2 ** 31) return null;
	return fullBox("cslg", 0, 0, [
		i32(compositionToDtsShift),
		i32(leastDecodeToDisplayDelta),
		i32(greatestDecodeToDisplayDelta),
		i32(compositionStartTime),
		i32(compositionEndTime)
	]);
};
/**
* Movie Extends Box: This box signals to readers that the file is fragmented. Contains a single Track Extends Box
* for each track in the movie.
*/
const mvex = (trackDatas) => {
	return box("mvex", void 0, trackDatas.map(trex));
};
/** Track Extends Box: Contains the default values used by the movie fragments. */
const trex = (trackData) => {
	return fullBox("trex", 0, 0, [
		u32(trackData.track.id),
		u32(1),
		u32(0),
		u32(0),
		u32(0)
	]);
};
/**
* Movie Fragment Box: The movie fragments extend the presentation in time. They provide the information that would
* previously have been	in the Movie Box.
*/
const moof = (sequenceNumber, trackDatas) => {
	return box("moof", void 0, [mfhd(sequenceNumber), ...trackDatas.map(traf)]);
};
/** Movie Fragment Header Box: Contains a sequence number as a safety check. */
const mfhd = (sequenceNumber) => {
	return fullBox("mfhd", 0, 0, [u32(sequenceNumber)]);
};
const fragmentSampleFlags = (sample) => {
	let byte1 = 0;
	let byte2 = 0;
	const sampleIsDifferenceSample = sample.type === "delta";
	byte2 |= +sampleIsDifferenceSample;
	if (sampleIsDifferenceSample) byte1 |= 1;
	else byte1 |= 2;
	return byte1 << 24 | byte2 << 16 | 0;
};
/** Track Fragment Box */
const traf = (trackData) => {
	return box("traf", void 0, [
		tfhd(trackData),
		tfdt(trackData),
		trun(trackData)
	]);
};
/** Track Fragment Header Box: Provides a reference to the extended track, and flags. */
const tfhd = (trackData) => {
	assert$3(trackData.currentChunk);
	let tfFlags = 0;
	tfFlags |= 8;
	tfFlags |= 16;
	tfFlags |= 32;
	tfFlags |= 131072;
	const referenceSample = trackData.currentChunk.samples[1] ?? trackData.currentChunk.samples[0];
	const referenceSampleInfo = {
		duration: referenceSample.timescaleUnitsToNextSample,
		size: referenceSample.size,
		flags: fragmentSampleFlags(referenceSample)
	};
	return fullBox("tfhd", 0, tfFlags, [
		u32(trackData.track.id),
		u32(referenceSampleInfo.duration),
		u32(referenceSampleInfo.size),
		u32(referenceSampleInfo.flags)
	]);
};
/**
* Track Fragment Decode Time Box: Provides the absolute decode time of the first sample of the fragment. This is
* useful for performing random access on the media file.
*/
const tfdt = (trackData) => {
	assert$3(trackData.currentChunk);
	return fullBox("tfdt", 1, 0, [u64(intoTimescale(trackData.currentChunk.startTimestamp, trackData.timescale))]);
};
/** Track Run Box: Specifies a run of contiguous samples for a given track. */
const trun = (trackData) => {
	assert$3(trackData.currentChunk);
	const allSampleDurations = trackData.currentChunk.samples.map((x$1) => x$1.timescaleUnitsToNextSample);
	const allSampleSizes = trackData.currentChunk.samples.map((x$1) => x$1.size);
	const allSampleFlags = trackData.currentChunk.samples.map(fragmentSampleFlags);
	const allSampleCompositionTimeOffsets = trackData.currentChunk.samples.map((x$1) => intoTimescale(x$1.timestamp - x$1.decodeTimestamp, trackData.timescale));
	const uniqueSampleDurations = new Set(allSampleDurations);
	const uniqueSampleSizes = new Set(allSampleSizes);
	const uniqueSampleFlags = new Set(allSampleFlags);
	const uniqueSampleCompositionTimeOffsets = new Set(allSampleCompositionTimeOffsets);
	const firstSampleFlagsPresent = uniqueSampleFlags.size === 2 && allSampleFlags[0] !== allSampleFlags[1];
	const sampleDurationPresent = uniqueSampleDurations.size > 1;
	const sampleSizePresent = uniqueSampleSizes.size > 1;
	const sampleFlagsPresent = !firstSampleFlagsPresent && uniqueSampleFlags.size > 1;
	const sampleCompositionTimeOffsetsPresent = uniqueSampleCompositionTimeOffsets.size > 1 || [...uniqueSampleCompositionTimeOffsets].some((x$1) => x$1 !== 0);
	let flags = 0;
	flags |= 1;
	flags |= 4 * +firstSampleFlagsPresent;
	flags |= 256 * +sampleDurationPresent;
	flags |= 512 * +sampleSizePresent;
	flags |= 1024 * +sampleFlagsPresent;
	flags |= 2048 * +sampleCompositionTimeOffsetsPresent;
	return fullBox("trun", 1, flags, [
		u32(trackData.currentChunk.samples.length),
		u32(trackData.currentChunk.offset - trackData.currentChunk.moofOffset || 0),
		firstSampleFlagsPresent ? u32(allSampleFlags[0]) : [],
		trackData.currentChunk.samples.map((_$1, i) => [
			sampleDurationPresent ? u32(allSampleDurations[i]) : [],
			sampleSizePresent ? u32(allSampleSizes[i]) : [],
			sampleFlagsPresent ? u32(allSampleFlags[i]) : [],
			sampleCompositionTimeOffsetsPresent ? i32(allSampleCompositionTimeOffsets[i]) : []
		])
	]);
};
/**
* Movie Fragment Random Access Box: For each track, provides pointers to sync samples within the file
* for random access.
*/
const mfra = (trackDatas) => {
	return box("mfra", void 0, [...trackDatas.map(tfra), mfro()]);
};
/** Track Fragment Random Access Box: Provides pointers to sync samples within the file for random access. */
const tfra = (trackData, trackIndex) => {
	return fullBox("tfra", 1, 0, [
		u32(trackData.track.id),
		u32(63),
		u32(trackData.finalizedChunks.length),
		trackData.finalizedChunks.map((chunk) => [
			u64(intoTimescale(chunk.samples[0].timestamp, trackData.timescale)),
			u64(chunk.moofOffset),
			u32(trackIndex + 1),
			u32(1),
			u32(1)
		])
	]);
};
/**
* Movie Fragment Random Access Offset Box: Provides the size of the enclosing mfra box. This box can be used by readers
* to quickly locate the mfra box by searching from the end of the file.
*/
const mfro = () => {
	return fullBox("mfro", 0, 0, [u32(0)]);
};
/** VTT Empty Cue Box */
const vtte = () => box("vtte");
/** VTT Cue Box */
const vttc = (payload, timestamp, identifier, settings, sourceId) => box("vttc", void 0, [
	sourceId !== null ? box("vsid", [i32(sourceId)]) : null,
	identifier !== null ? box("iden", [...textEncoder.encode(identifier)]) : null,
	timestamp !== null ? box("ctim", [...textEncoder.encode(formatSubtitleTimestamp(timestamp))]) : null,
	settings !== null ? box("sttg", [...textEncoder.encode(settings)]) : null,
	box("payl", [...textEncoder.encode(payload)])
]);
/** VTT Additional Text Box */
const vtta = (notes) => box("vtta", [...textEncoder.encode(notes)]);
/** User Data Box */
const udta = (muxer) => {
	const boxes = [];
	const metadataFormat = muxer.format._options.metadataFormat ?? "auto";
	const metadataTags = muxer.output._metadataTags;
	if (metadataFormat === "mdir" || metadataFormat === "auto" && !muxer.isQuickTime) {
		const metaBox = metaMdir(metadataTags);
		if (metaBox) boxes.push(metaBox);
	} else if (metadataFormat === "mdta") {
		const metaBox = metaMdta(metadataTags);
		if (metaBox) boxes.push(metaBox);
	} else if (metadataFormat === "udta" || metadataFormat === "auto" && muxer.isQuickTime) addQuickTimeMetadataTagBoxes(boxes, muxer.output._metadataTags);
	if (boxes.length === 0) return null;
	return box("udta", void 0, boxes);
};
const addQuickTimeMetadataTagBoxes = (boxes, tags) => {
	for (const { key, value } of keyValueIterator(tags)) switch (key) {
		case "title":
			boxes.push(metadataTagStringBoxShort("©nam", value));
			break;
		case "description":
			boxes.push(metadataTagStringBoxShort("©des", value));
			break;
		case "artist":
			boxes.push(metadataTagStringBoxShort("©ART", value));
			break;
		case "album":
			boxes.push(metadataTagStringBoxShort("©alb", value));
			break;
		case "albumArtist":
			boxes.push(metadataTagStringBoxShort("albr", value));
			break;
		case "genre":
			boxes.push(metadataTagStringBoxShort("©gen", value));
			break;
		case "date":
			boxes.push(metadataTagStringBoxShort("©day", value.toISOString().slice(0, 10)));
			break;
		case "comment":
			boxes.push(metadataTagStringBoxShort("©cmt", value));
			break;
		case "lyrics":
			boxes.push(metadataTagStringBoxShort("©lyr", value));
			break;
		case "raw": break;
		case "discNumber":
		case "discsTotal":
		case "trackNumber":
		case "tracksTotal":
		case "images": break;
		default: assertNever$1(key);
	}
	if (tags.raw) for (const key in tags.raw) {
		const value = tags.raw[key];
		if (value == null || key.length !== 4 || boxes.some((x$1) => x$1.type === key)) continue;
		if (typeof value === "string") boxes.push(metadataTagStringBoxShort(key, value));
		else if (value instanceof Uint8Array) boxes.push(box(key, Array.from(value)));
	}
};
const metadataTagStringBoxShort = (name, value) => {
	const encoded = textEncoder.encode(value);
	return box(name, [
		u16(encoded.length),
		u16(getLanguageCodeInt("und")),
		Array.from(encoded)
	]);
};
const DATA_BOX_MIME_TYPE_MAP = {
	"image/jpeg": 13,
	"image/png": 14,
	"image/bmp": 27
};
/**
* Generates key-value metadata for inclusion in the "meta" box.
*/
const generateMetadataPairs = (tags, isMdta) => {
	const pairs = [];
	for (const { key, value } of keyValueIterator(tags)) switch (key) {
		case "title":
			pairs.push({
				key: isMdta ? "title" : "©nam",
				value: dataStringBoxLong(value)
			});
			break;
		case "description":
			pairs.push({
				key: isMdta ? "description" : "©des",
				value: dataStringBoxLong(value)
			});
			break;
		case "artist":
			pairs.push({
				key: isMdta ? "artist" : "©ART",
				value: dataStringBoxLong(value)
			});
			break;
		case "album":
			pairs.push({
				key: isMdta ? "album" : "©alb",
				value: dataStringBoxLong(value)
			});
			break;
		case "albumArtist":
			pairs.push({
				key: isMdta ? "album_artist" : "aART",
				value: dataStringBoxLong(value)
			});
			break;
		case "comment":
			pairs.push({
				key: isMdta ? "comment" : "©cmt",
				value: dataStringBoxLong(value)
			});
			break;
		case "genre":
			pairs.push({
				key: isMdta ? "genre" : "©gen",
				value: dataStringBoxLong(value)
			});
			break;
		case "lyrics":
			pairs.push({
				key: isMdta ? "lyrics" : "©lyr",
				value: dataStringBoxLong(value)
			});
			break;
		case "date":
			pairs.push({
				key: isMdta ? "date" : "©day",
				value: dataStringBoxLong(value.toISOString().slice(0, 10))
			});
			break;
		case "images":
			for (const image of value) {
				if (image.kind !== "coverFront") continue;
				pairs.push({
					key: "covr",
					value: box("data", [
						u32(DATA_BOX_MIME_TYPE_MAP[image.mimeType] ?? 0),
						u32(0),
						Array.from(image.data)
					])
				});
			}
			break;
		case "trackNumber":
			if (isMdta) {
				const string = tags.tracksTotal !== void 0 ? `${value}/${tags.tracksTotal}` : value.toString();
				pairs.push({
					key: "track",
					value: dataStringBoxLong(string)
				});
			} else pairs.push({
				key: "trkn",
				value: box("data", [
					u32(0),
					u32(0),
					u16(0),
					u16(value),
					u16(tags.tracksTotal ?? 0),
					u16(0)
				])
			});
			break;
		case "discNumber":
			if (!isMdta) pairs.push({
				key: "disc",
				value: box("data", [
					u32(0),
					u32(0),
					u16(0),
					u16(value),
					u16(tags.discsTotal ?? 0),
					u16(0)
				])
			});
			break;
		case "tracksTotal":
		case "discsTotal": break;
		case "raw": break;
		default: assertNever$1(key);
	}
	if (tags.raw) for (const key in tags.raw) {
		const value = tags.raw[key];
		if (value == null || !isMdta && key.length !== 4 || pairs.some((x$1) => x$1.key === key)) continue;
		if (typeof value === "string") pairs.push({
			key,
			value: dataStringBoxLong(value)
		});
		else if (value instanceof Uint8Array) pairs.push({
			key,
			value: box("data", [
				u32(0),
				u32(0),
				Array.from(value)
			])
		});
		else if (value instanceof RichImageData) pairs.push({
			key,
			value: box("data", [
				u32(DATA_BOX_MIME_TYPE_MAP[value.mimeType] ?? 0),
				u32(0),
				Array.from(value.data)
			])
		});
	}
	return pairs;
};
/** Metadata Box (mdir format) */
const metaMdir = (tags) => {
	const pairs = generateMetadataPairs(tags, false);
	if (pairs.length === 0) return null;
	return fullBox("meta", 0, 0, void 0, [hdlr(false, "mdir", "", "appl"), box("ilst", void 0, pairs.map((pair) => box(pair.key, void 0, [pair.value])))]);
};
/** Metadata Box (mdta format with keys box) */
const metaMdta = (tags) => {
	const pairs = generateMetadataPairs(tags, true);
	if (pairs.length === 0) return null;
	return box("meta", void 0, [
		hdlr(false, "mdta", ""),
		fullBox("keys", 0, 0, [u32(pairs.length)], pairs.map((pair) => box("mdta", [...textEncoder.encode(pair.key)]))),
		box("ilst", void 0, pairs.map((pair, i) => {
			return box(String.fromCharCode(...u32(i + 1)), void 0, [pair.value]);
		}))
	]);
};
const dataStringBoxLong = (value) => {
	return box("data", [
		u32(1),
		u32(0),
		...textEncoder.encode(value)
	]);
};
const videoCodecToBoxName = (codec, fullCodecString) => {
	switch (codec) {
		case "avc": return fullCodecString.startsWith("avc3") ? "avc3" : "avc1";
		case "hevc": return "hvc1";
		case "vp8": return "vp08";
		case "vp9": return "vp09";
		case "av1": return "av01";
		case "prores": return fullCodecString;
	}
};
const VIDEO_CODEC_TO_CONFIGURATION_BOX = {
	avc: avcC,
	hevc: hvcC,
	vp8: vpcC,
	vp9: vpcC,
	av1: av1C,
	prores: null
};
const audioCodecToBoxName = (codec, isQuickTime) => {
	switch (codec) {
		case "aac": return "mp4a";
		case "mp3": return "mp4a";
		case "opus": return "Opus";
		case "vorbis": return "mp4a";
		case "flac": return "fLaC";
		case "ulaw": return "ulaw";
		case "alaw": return "alaw";
		case "pcm-u8": return "raw ";
		case "pcm-s8": return "sowt";
		case "ac3": return "ac-3";
		case "eac3": return "ec-3";
	}
	if (isQuickTime) switch (codec) {
		case "pcm-s16": return "sowt";
		case "pcm-s16be": return "twos";
		case "pcm-s24": return "in24";
		case "pcm-s24be": return "in24";
		case "pcm-s32": return "in32";
		case "pcm-s32be": return "in32";
		case "pcm-f32": return "fl32";
		case "pcm-f32be": return "fl32";
		case "pcm-f64": return "fl64";
		case "pcm-f64be": return "fl64";
	}
	else switch (codec) {
		case "pcm-s16": return "ipcm";
		case "pcm-s16be": return "ipcm";
		case "pcm-s24": return "ipcm";
		case "pcm-s24be": return "ipcm";
		case "pcm-s32": return "ipcm";
		case "pcm-s32be": return "ipcm";
		case "pcm-f32": return "fpcm";
		case "pcm-f32be": return "fpcm";
		case "pcm-f64": return "fpcm";
		case "pcm-f64be": return "fpcm";
	}
};
const audioCodecToConfigurationBox = (codec, isQuickTime) => {
	switch (codec) {
		case "aac": return esds;
		case "mp3": return esds;
		case "opus": return dOps;
		case "vorbis": return esds;
		case "flac": return dfLa;
		case "ac3": return dac3;
		case "eac3": return dec3;
	}
	if (isQuickTime) switch (codec) {
		case "pcm-s24": return wave;
		case "pcm-s24be": return wave;
		case "pcm-s32": return wave;
		case "pcm-s32be": return wave;
		case "pcm-f32": return wave;
		case "pcm-f32be": return wave;
		case "pcm-f64": return wave;
		case "pcm-f64be": return wave;
	}
	else switch (codec) {
		case "pcm-s16": return pcmC;
		case "pcm-s16be": return pcmC;
		case "pcm-s24": return pcmC;
		case "pcm-s24be": return pcmC;
		case "pcm-s32": return pcmC;
		case "pcm-s32be": return pcmC;
		case "pcm-f32": return pcmC;
		case "pcm-f32be": return pcmC;
		case "pcm-f64": return pcmC;
		case "pcm-f64be": return pcmC;
	}
	return null;
};
const SUBTITLE_CODEC_TO_BOX_NAME = { webvtt: "wvtt" };
const SUBTITLE_CODEC_TO_CONFIGURATION_BOX = { webvtt: vttC };
const getLanguageCodeInt = (code) => {
	assert$3(code.length === 3);
	let language = 0;
	for (let i = 0; i < 3; i++) {
		language <<= 5;
		language += code.charCodeAt(i) - 96;
	}
	return language;
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/writer.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var Writer = class {
	constructor(target, isMonotonic) {
		this.finalized = false;
		this.started = false;
		this.pos = 0;
		this.trackedWrites = null;
		this.trackedStart = -1;
		this.trackedEnd = -1;
		if (target._writerAcquired) throw new Error("Can't have multiple Writers for the same Target.");
		this.target = target;
		target._setMonotonicity(isMonotonic);
		target._writerAcquired = true;
	}
	start() {
		assert$3(!this.started);
		this.target._start();
		this.started = true;
	}
	/** Writes the given data to the target, at the current position. */
	write(data) {
		assert$3(this.started && !this.finalized);
		this.maybeTrackWrites(data);
		this.target._write(data, this.pos);
		this.pos += data.byteLength;
	}
	/** Sets the current position for future writes to a new one. */
	seek(newPos) {
		this.pos = newPos;
	}
	/** Returns the current position. */
	getPos() {
		return this.pos;
	}
	/** Signals to the writer that it may be time to flush. */
	async flush() {
		assert$3(this.started && !this.finalized);
		return this.target._flush();
	}
	/** Called after muxing has finished. */
	async finalize() {
		assert$3(this.started && !this.finalized);
		await this.target._finalize();
		this.finalized = true;
	}
	maybeTrackWrites(data) {
		if (!this.trackedWrites) return;
		let pos = this.getPos();
		if (pos < this.trackedStart) {
			if (pos + data.byteLength <= this.trackedStart) return;
			data = data.subarray(this.trackedStart - pos);
			pos = 0;
		}
		const neededSize = pos + data.byteLength - this.trackedStart;
		let newLength = this.trackedWrites.byteLength;
		while (newLength < neededSize) newLength *= 2;
		if (newLength !== this.trackedWrites.byteLength) {
			const copy = new Uint8Array(newLength);
			copy.set(this.trackedWrites, 0);
			this.trackedWrites = copy;
		}
		this.trackedWrites.set(data, pos - this.trackedStart);
		this.trackedEnd = Math.max(this.trackedEnd, pos + data.byteLength);
	}
	startTrackingWrites() {
		this.trackedWrites = new Uint8Array(2 ** 10);
		this.trackedStart = this.getPos();
		this.trackedEnd = this.trackedStart;
	}
	stopTrackingWrites() {
		if (!this.trackedWrites) throw new Error("Internal error: Can't get tracked writes since nothing was tracked.");
		const result = {
			data: this.trackedWrites.subarray(0, this.trackedEnd - this.trackedStart),
			start: this.trackedStart,
			end: this.trackedEnd
		};
		this.trackedWrites = null;
		return result;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/target.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
const node = typeof node_exports !== "undefined" ? node_exports : void 0;
/**
* Base class for targets, specifying where output files are written.
* @group Output targets
* @public
*/
var Target = class extends EventEmitter$1 {
	constructor() {
		super(...arguments);
		/** @internal */
		this._writerAcquired = false;
		/** @internal */
		this._monotonicity = null;
		/**
		* Called each time data is written to the target. Will be called with the byte range into which data was written.
		*
		* Use this callback to track the size of the output file as it grows. But be warned, this function is chatty and
		* gets called *extremely* often.
		*
		* @deprecated Use `target.on('write', ({ start, end }) => ...)` instead.
		*/
		this.onwrite = null;
	}
	/** @internal */
	_setMonotonicity(monotonicity) {
		if (this._monotonicity !== false) this._monotonicity = monotonicity;
	}
	/** @internal */
	_dispatchWrite(start, end) {
		this.onwrite?.(start, end);
		this._emit("write", {
			start,
			end
		});
	}
	/**
	* Returns a new {@link RangedTarget} that writes data to this target using the given offset.
	*
	* Useful for writing a file into a section of a larger file.
	*/
	slice(offset) {
		if (!Number.isInteger(offset) || offset < 0) throw new TypeError("offset must be a non-negative integer.");
		return new RangedTarget(this, offset);
	}
};
const ARRAY_BUFFER_INITIAL_SIZE = 2 ** 16;
const ARRAY_BUFFER_MAX_SIZE = 2 ** 32;
/**
* A target that writes data directly into an ArrayBuffer in memory. Great for performance, but not suitable for very
* large files. The buffer will be available once the output has been finalized.
* @group Output targets
* @public
*/
var BufferTarget = class extends Target {
	/** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
	constructor(options = {}) {
		super();
		/** Stores the final output buffer. Until the output is finalized, this will be `null`. */
		this.buffer = null;
		/** @internal */
		this._maxPos = 0;
		if (!options || typeof options !== "object") throw new TypeError("BufferTarget options, when provided, must be an object.");
		if (options.onFinalize !== void 0 && typeof options.onFinalize !== "function") throw new TypeError("options.onFinalize, when provided, must be a function.");
		this._options = options;
		this._supportsResize = "resize" in /* @__PURE__ */ new ArrayBuffer(0);
		if (this._supportsResize) try {
			this._buffer = new ArrayBuffer(ARRAY_BUFFER_INITIAL_SIZE, { maxByteLength: ARRAY_BUFFER_MAX_SIZE });
		} catch {
			this._buffer = new ArrayBuffer(ARRAY_BUFFER_INITIAL_SIZE);
			this._supportsResize = false;
		}
		else this._buffer = new ArrayBuffer(ARRAY_BUFFER_INITIAL_SIZE);
		this._bytes = new Uint8Array(this._buffer);
	}
	/** @internal */
	_ensureSize(size) {
		let newLength = this._buffer.byteLength;
		while (newLength < size) newLength *= 2;
		if (newLength === this._buffer.byteLength) return;
		if (newLength > ARRAY_BUFFER_MAX_SIZE) throw new Error(`ArrayBuffer exceeded maximum size of ${ARRAY_BUFFER_MAX_SIZE} bytes. Please consider using another target.`);
		if (this._supportsResize) this._buffer.resize(newLength);
		else {
			const newBuffer = new ArrayBuffer(newLength);
			const newBytes = new Uint8Array(newBuffer);
			newBytes.set(this._bytes, 0);
			this._buffer = newBuffer;
			this._bytes = newBytes;
		}
	}
	/** @internal */
	_start() {}
	/** @internal */
	_write(data, pos) {
		this._ensureSize(pos + data.byteLength);
		this._bytes.set(data, pos);
		this._maxPos = Math.max(this._maxPos, pos + data.byteLength);
		this._dispatchWrite(pos, pos + data.byteLength);
	}
	/** @internal */
	async _flush() {}
	/** @internal */
	async _finalize() {
		this.buffer = this._buffer.slice(0, this._maxPos);
		if (this._options.onFinalize) await this._options.onFinalize(this.buffer);
		this._emit("finalized");
	}
	/** @internal */
	async _close() {}
	/** @internal */
	_getSlice(start, end) {
		return this._bytes.slice(start, end);
	}
};
const DEFAULT_CHUNK_SIZE = 2 ** 24;
const MAX_CHUNKS_AT_ONCE = 2;
/**
* This target writes data to a [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream),
* making it a general-purpose target for writing data anywhere. It is also compatible with
* [`FileSystemWritableFileStream`](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream) for
* use with the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). The
* `WritableStream` can also apply backpressure, which will propagate to the output and throttle the encoders.
* @group Output targets
* @public
*/
var StreamTarget = class extends Target {
	/** Creates a new {@link StreamTarget} which writes to the specified `writable`. */
	constructor(writable, options = {}) {
		super();
		/** @internal */
		this._sections = [];
		/** @internal */
		this._lastWriteEnd = 0;
		/** @internal */
		this._lastFlushEnd = 0;
		/** @internal */
		this._streamWriter = null;
		/** @internal */
		this._writeError = null;
		/**
		* The data is divided up into fixed-size chunks, whose contents are first filled in RAM and then flushed out.
		* A chunk is flushed if all of its contents have been written.
		*/
		/** @internal */
		this._chunks = [];
		if (!(writable instanceof WritableStream)) throw new TypeError("StreamTarget requires a WritableStream instance.");
		if (options != null && typeof options !== "object") throw new TypeError("StreamTarget options, when provided, must be an object.");
		if (options.chunked !== void 0 && typeof options.chunked !== "boolean") throw new TypeError("options.chunked, when provided, must be a boolean.");
		if (options.chunkSize !== void 0 && (!Number.isInteger(options.chunkSize) || options.chunkSize < 1024)) throw new TypeError("options.chunkSize, when provided, must be an integer and not smaller than 1024.");
		this._writable = writable;
		this._options = options;
		this._chunked = options.chunked ?? false;
		this._chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
	}
	/** @internal */
	_start() {
		this._streamWriter = this._writable.getWriter();
	}
	/** @internal */
	_write(data, pos) {
		if (pos > this._lastWriteEnd) {
			const paddingBytesNeeded = pos - this._lastWriteEnd;
			this._write(new Uint8Array(paddingBytesNeeded), this._lastWriteEnd);
		}
		this._sections.push({
			data: data.slice(),
			start: pos
		});
		this._lastWriteEnd = Math.max(this._lastWriteEnd, pos + data.byteLength);
		this._dispatchWrite(pos, pos + data.byteLength);
	}
	/** @internal */
	async _flush() {
		if (this._writeError !== null) throw this._writeError;
		assert$3(this._streamWriter);
		if (this._sections.length === 0) return;
		const chunks = [];
		const sorted = [...this._sections].sort((a, b$1) => a.start - b$1.start);
		chunks.push({
			start: sorted[0].start,
			size: sorted[0].data.byteLength
		});
		for (let i = 1; i < sorted.length; i++) {
			const lastChunk = chunks[chunks.length - 1];
			const section = sorted[i];
			if (section.start <= lastChunk.start + lastChunk.size) lastChunk.size = Math.max(lastChunk.size, section.start + section.data.byteLength - lastChunk.start);
			else chunks.push({
				start: section.start,
				size: section.data.byteLength
			});
		}
		for (const chunk of chunks) {
			chunk.data = new Uint8Array(chunk.size);
			for (const section of this._sections) if (chunk.start <= section.start && section.start < chunk.start + chunk.size) chunk.data.set(section.data, section.start - chunk.start);
			if (this._streamWriter.desiredSize !== null && this._streamWriter.desiredSize <= 0) await this._streamWriter.ready;
			if (this._chunked) {
				this._writeDataIntoChunks(chunk.data, chunk.start);
				this._tryToFlushChunks();
			} else {
				if (this._monotonicity === true && chunk.start !== this._lastFlushEnd) throw new Error("Internal error: Monotonicity violation.");
				this._streamWriter.write({
					type: "write",
					data: chunk.data,
					position: chunk.start
				}).catch((error) => {
					this._writeError ??= error;
				});
				this._lastFlushEnd = chunk.start + chunk.data.byteLength;
			}
		}
		this._sections.length = 0;
	}
	/** @internal */
	_writeDataIntoChunks(data, position) {
		let chunkIndex = this._chunks.findIndex((x$1) => x$1.start <= position && position < x$1.start + this._chunkSize);
		if (chunkIndex === -1) chunkIndex = this._createChunk(position);
		const chunk = this._chunks[chunkIndex];
		const relativePosition = position - chunk.start;
		const toWrite = data.subarray(0, Math.min(this._chunkSize - relativePosition, data.byteLength));
		chunk.data.set(toWrite, relativePosition);
		const section = {
			start: relativePosition,
			end: relativePosition + toWrite.byteLength
		};
		this._insertSectionIntoChunk(chunk, section);
		if (chunk.written[0].start === 0 && chunk.written[0].end === this._chunkSize) chunk.shouldFlush = true;
		if (this._chunks.length > MAX_CHUNKS_AT_ONCE) {
			for (let i = 0; i < this._chunks.length - 1; i++) this._chunks[i].shouldFlush = true;
			this._tryToFlushChunks();
		}
		if (toWrite.byteLength < data.byteLength) this._writeDataIntoChunks(data.subarray(toWrite.byteLength), position + toWrite.byteLength);
	}
	/** @internal */
	_insertSectionIntoChunk(chunk, section) {
		let low = 0;
		let high = chunk.written.length - 1;
		let index = -1;
		while (low <= high) {
			const mid = Math.floor(low + (high - low + 1) / 2);
			if (chunk.written[mid].start <= section.start) {
				low = mid + 1;
				index = mid;
			} else high = mid - 1;
		}
		chunk.written.splice(index + 1, 0, section);
		if (index === -1 || chunk.written[index].end < section.start) index++;
		while (index < chunk.written.length - 1 && chunk.written[index].end >= chunk.written[index + 1].start) {
			chunk.written[index].end = Math.max(chunk.written[index].end, chunk.written[index + 1].end);
			chunk.written.splice(index + 1, 1);
		}
	}
	/** @internal */
	_createChunk(includesPosition) {
		const chunk = {
			start: Math.floor(includesPosition / this._chunkSize) * this._chunkSize,
			data: new Uint8Array(this._chunkSize),
			written: [],
			shouldFlush: false
		};
		this._chunks.push(chunk);
		this._chunks.sort((a, b$1) => a.start - b$1.start);
		return this._chunks.indexOf(chunk);
	}
	/** @internal */
	_tryToFlushChunks(force = false) {
		assert$3(this._streamWriter);
		for (let i = 0; i < this._chunks.length; i++) {
			const chunk = this._chunks[i];
			if (!chunk.shouldFlush && !force) continue;
			for (const section of chunk.written) {
				const position = chunk.start + section.start;
				if (this._monotonicity === true && position !== this._lastFlushEnd) throw new Error("Internal error: Monotonicity violation.");
				this._streamWriter.write({
					type: "write",
					data: chunk.data.subarray(section.start, section.end),
					position
				}).catch((error) => {
					this._writeError ??= error;
				});
				this._lastFlushEnd = chunk.start + section.end;
			}
			this._chunks.splice(i--, 1);
		}
	}
	/** @internal */
	async _finalize() {
		if (this._chunked) this._tryToFlushChunks(true);
		if (this._writeError !== null) throw this._writeError;
		assert$3(this._streamWriter);
		await this._streamWriter.ready;
		await this._streamWriter.close();
		this._emit("finalized");
	}
	/** @internal */
	async _close() {
		return this._streamWriter?.close();
	}
};
/**
* A target that writes to a file at the specified path. Intended for server-side usage in Node, Bun, or Deno.
*
* Writing is chunked by default. The internally held file handle will be closed when `.finalize()` or `.cancel()` are
* called on the corresponding {@link Output}.
* @group Output targets
* @public
*/
var FilePathTarget = class extends Target {
	/** Creates a new {@link FilePathTarget} that writes to the file at the specified file path. */
	constructor(filePath, options = {}) {
		if (typeof filePath !== "string") throw new TypeError("filePath must be a string.");
		if (!options || typeof options !== "object") throw new TypeError("options must be an object.");
		if (!node.fs) throw new Error("FilePathTarget is only available in server-side environments (Node.js, Bun, Deno).");
		super();
		/** @internal */
		this._fileHandle = null;
		this._streamTarget = new StreamTarget(new WritableStream({
			start: async () => {
				this._fileHandle = await node.fs.open(filePath, "w");
			},
			write: async (chunk) => {
				assert$3(this._fileHandle);
				await this._fileHandle.write(chunk.data, 0, chunk.data.byteLength, chunk.position);
			},
			close: async () => {
				if (this._fileHandle) {
					await this._fileHandle.close();
					this._fileHandle = null;
				}
			}
		}), {
			chunked: true,
			...options
		});
	}
	/** @internal */
	_start() {
		this._streamTarget._start();
	}
	/** @internal */
	_write(data, pos) {
		this._streamTarget._write(data, pos);
		this._dispatchWrite(pos, pos + data.byteLength);
	}
	/** @internal */
	async _flush() {
		return this._streamTarget._flush();
	}
	/** @internal */
	async _finalize() {
		await this._streamTarget._finalize();
		this._emit("finalized");
	}
	/** @internal */
	async _close() {
		return this._streamTarget._close();
	}
	/** @internal */
	_setMonotonicity(monotonicity) {
		super._setMonotonicity(monotonicity);
		this._streamTarget._setMonotonicity(monotonicity);
	}
};
/**
* A target that writes to a subrange (defined by an offset) of another, underlying target. Useful for writing a file
* into a section of a larger file.
* @group Output targets
* @public
*/
var RangedTarget = class extends Target {
	/** @internal */
	constructor(baseTarget, offset) {
		super();
		this._baseTarget = baseTarget;
		this._offset = offset;
	}
	/** @internal */
	_start() {}
	/** @internal */
	_write(data, pos) {
		this._baseTarget._write(data, this._offset + pos);
		this._dispatchWrite(pos, pos + data.byteLength);
	}
	/** @internal */
	_flush() {
		return this._baseTarget._flush();
	}
	/** @internal */
	async _finalize() {
		this._emit("finalized");
	}
	/** @internal */
	async _close() {}
	/** @internal */
	_setMonotonicity(monotonicity) {
		super._setMonotonicity(monotonicity);
		this._baseTarget._setMonotonicity(monotonicity);
	}
};
/**
* A special target for writing multi-file media where each file is uniquely identified by a path.
* @group Output targets
* @public
*/
var PathedTarget = class {
	/** Creates a new {@link PathedTarget} from a root path and a callback. */
	constructor(rootPath, getTarget) {
		this.rootPath = rootPath;
		this.getTarget = getTarget;
		if (typeof rootPath !== "string") throw new TypeError("rootPath must be a string.");
		if (typeof getTarget !== "function") throw new TypeError("getTarget must be a function.");
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/isobmff/isobmff-muxer.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
const GLOBAL_TIMESCALE = 57600;
const TIMESTAMP_OFFSET = 2082844800;
const getTrackMetadata = (trackData) => {
	const metadata = {};
	const track = trackData.track;
	if (track.metadata.name !== void 0) metadata.name = track.metadata.name;
	return metadata;
};
const intoTimescale = (timeInSeconds, timescale, round = true) => {
	const value = timeInSeconds * timescale;
	return round ? Math.round(value) : value;
};
var IsobmffMuxer = class extends Muxer {
	constructor(output, format) {
		super(output);
		this.writer = null;
		this.boxWriter = null;
		this.initWriter = null;
		this.initBoxWriter = null;
		this.auxTarget = new BufferTarget();
		this.auxWriter = new Writer(this.auxTarget, false);
		this.auxBoxWriter = new IsobmffBoxWriter(this.auxWriter);
		this.mdat = null;
		this.ftypSize = null;
		this.trackDatas = [];
		this.allTracksKnown = promiseWithResolvers();
		this.creationTime = Math.floor(Date.now() / 1e3) + TIMESTAMP_OFFSET;
		this.finalizedChunks = [];
		this.nextFragmentNumber = 1;
		this.maxWrittenTimestamp = -Infinity;
		this.minWrittenTimestamp = Infinity;
		this.maxWrittenEndTimestamp = -Infinity;
		this.segmentHeaderSize = null;
		this.format = format;
		this.isQuickTime = format instanceof MovOutputFormat;
		this.isCmaf = format instanceof CmafOutputFormat;
		this.minimumFragmentDuration = format._options.minimumFragmentDuration ?? (format instanceof CmafOutputFormat ? Infinity : 1);
		this.auxWriter.start();
	}
	async start() {
		const release = await this.mutex.acquire();
		if (!this.isCmaf) {
			this.writer = await this.output._getRootWriter((target) => this.format._options.fastStart !== void 0 ? this.format._options.fastStart === "fragmented" : target instanceof BufferTarget);
			this.boxWriter = new IsobmffBoxWriter(this.writer);
			this.fastStart = this.format._options.fastStart ?? (this.writer.target instanceof BufferTarget ? "in-memory" : false);
			this.isFragmented = this.fastStart === "fragmented";
		} else {
			this.fastStart = "fragmented";
			this.isFragmented = true;
		}
		if (this.isCmaf) {
			if (!this.output._hasInitTarget()) throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
			const initWriter = new Writer(await this.output._getInitTarget(), true);
			initWriter.start();
			this.initWriter = initWriter;
			this.initBoxWriter = new IsobmffBoxWriter(initWriter);
		}
		const holdsAvc = this.output.tracks.some((x$1) => x$1.isVideoTrack() && x$1.source._codec === "avc");
		{
			const boxWriter = this.initBoxWriter ?? this.boxWriter;
			assert$3(boxWriter);
			if (this.format._options.onFtyp) boxWriter.writer.startTrackingWrites();
			boxWriter.writeBox(ftyp({
				isQuickTime: this.isQuickTime,
				holdsAvc,
				fragmented: this.isFragmented,
				cmaf: this.isCmaf
			}));
			if (this.format._options.onFtyp) {
				const { data, start } = boxWriter.writer.stopTrackingWrites();
				this.format._options.onFtyp(data, start);
			}
			this.ftypSize = boxWriter.writer.getPos();
			if (this.isCmaf) await this.initWriter.flush();
		}
		if (this.fastStart === "in-memory") {} else if (this.fastStart === "reserve") {
			for (const track of this.output.tracks) if (track.metadata.maximumPacketCount === void 0) throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
		} else if (this.isFragmented) {} else {
			assert$3(this.writer);
			assert$3(this.boxWriter);
			if (this.format._options.onMdat) this.writer.startTrackingWrites();
			this.mdat = mdat(true);
			this.boxWriter.writeBox(this.mdat);
		}
		await this.writer?.flush();
		release();
	}
	allTracksAreKnown() {
		for (const track of this.output.tracks) if (!track.source._closed && !this.trackDatas.some((x$1) => x$1.track === track)) return false;
		return true;
	}
	async getMimeType() {
		await this.allTracksKnown.promise;
		const codecStrings = this.trackDatas.map((trackData) => {
			if (trackData.type === "video") return trackData.info.decoderConfig.codec;
			else if (trackData.type === "audio") return trackData.info.decoderConfig.codec;
			else return { webvtt: "wvtt" }[trackData.track.source._codec];
		});
		return buildIsobmffMimeType({
			isQuickTime: this.isQuickTime,
			hasVideo: this.trackDatas.some((x$1) => x$1.type === "video"),
			hasAudio: this.trackDatas.some((x$1) => x$1.type === "audio"),
			codecStrings
		});
	}
	getVideoTrackData(track, packet, meta) {
		const existingTrackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (existingTrackData) return existingTrackData;
		validateVideoChunkMetadata(meta);
		assert$3(meta);
		assert$3(meta.decoderConfig);
		const decoderConfig = { ...meta.decoderConfig };
		assert$3(decoderConfig.codedWidth !== void 0);
		assert$3(decoderConfig.codedHeight !== void 0);
		let requiresAnnexBTransformation = false;
		if (track.source._codec === "avc" && !decoderConfig.description) {
			const decoderConfigurationRecord = extractAvcDecoderConfigurationRecord$1(packet.data);
			if (!decoderConfigurationRecord) throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
			decoderConfig.description = serializeAvcDecoderConfigurationRecord$1(decoderConfigurationRecord);
			requiresAnnexBTransformation = true;
		} else if (track.source._codec === "hevc" && !decoderConfig.description) {
			const decoderConfigurationRecord = extractHevcDecoderConfigurationRecord$1(packet.data);
			if (!decoderConfigurationRecord) throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
			decoderConfig.description = serializeHevcDecoderConfigurationRecord$1(decoderConfigurationRecord);
			requiresAnnexBTransformation = true;
		}
		const timescale = computeRationalApproximation(1 / (track.metadata.frameRate ?? GLOBAL_TIMESCALE), 1e6).den;
		const displayAspectWidth = decoderConfig.displayAspectWidth;
		const displayAspectHeight = decoderConfig.displayAspectHeight;
		const pixelAspectRatio = displayAspectWidth === void 0 || displayAspectHeight === void 0 ? {
			num: 1,
			den: 1
		} : simplifyRational$1({
			num: displayAspectWidth * decoderConfig.codedHeight,
			den: displayAspectHeight * decoderConfig.codedWidth
		});
		const newTrackData = {
			muxer: this,
			track,
			type: "video",
			info: {
				width: decoderConfig.codedWidth,
				height: decoderConfig.codedHeight,
				pixelAspectRatio,
				decoderConfig,
				requiresAnnexBTransformation
			},
			timescale,
			samples: [],
			sampleQueue: [],
			timestampProcessingQueue: [],
			timeToSampleTable: [],
			compositionTimeOffsetTable: [],
			lastTimescaleUnits: null,
			lastSample: null,
			startTimestampOffset: null,
			finalizedChunks: [],
			currentChunk: null,
			compactlyCodedChunkTable: [],
			closed: false
		};
		this.trackDatas.push(newTrackData);
		this.trackDatas.sort((a, b$1) => a.track.id - b$1.track.id);
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		return newTrackData;
	}
	getAudioTrackData(track, packet, meta) {
		const existingTrackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (existingTrackData) return existingTrackData;
		validateAudioChunkMetadata(meta);
		assert$3(meta);
		assert$3(meta.decoderConfig);
		const decoderConfig = { ...meta.decoderConfig };
		let requiresAdtsStripping = false;
		if (track.source._codec === "aac" && !decoderConfig.description) {
			const adtsFrame = readAdtsFrameHeader(FileSlice.tempFromBytes(packet.data));
			if (!adtsFrame) throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
			const sampleRate = aacFrequencyTable$1[adtsFrame.samplingFrequencyIndex];
			const numberOfChannels = aacChannelMap$1[adtsFrame.channelConfiguration];
			if (sampleRate === void 0 || numberOfChannels === void 0) throw new Error("Invalid ADTS frame header.");
			decoderConfig.description = buildAacAudioSpecificConfig({
				objectType: adtsFrame.objectType,
				sampleRate,
				numberOfChannels
			});
			requiresAdtsStripping = true;
		}
		const newTrackData = {
			muxer: this,
			track,
			type: "audio",
			info: {
				numberOfChannels: meta.decoderConfig.numberOfChannels,
				sampleRate: meta.decoderConfig.sampleRate,
				decoderConfig,
				requiresPcmTransformation: !this.isFragmented && PCM_AUDIO_CODECS.includes(track.source._codec),
				expectedNextPcmPacketTimestamp: null,
				requiresAdtsStripping,
				firstPacket: packet
			},
			timescale: decoderConfig.sampleRate,
			samples: [],
			sampleQueue: [],
			timestampProcessingQueue: [],
			timeToSampleTable: [],
			compositionTimeOffsetTable: [],
			lastTimescaleUnits: null,
			lastSample: null,
			startTimestampOffset: null,
			finalizedChunks: [],
			currentChunk: null,
			compactlyCodedChunkTable: [],
			closed: false
		};
		this.trackDatas.push(newTrackData);
		this.trackDatas.sort((a, b$1) => a.track.id - b$1.track.id);
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		return newTrackData;
	}
	getSubtitleTrackData(track, meta) {
		const existingTrackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (existingTrackData) return existingTrackData;
		validateSubtitleMetadata(meta);
		assert$3(meta);
		assert$3(meta.config);
		const newTrackData = {
			muxer: this,
			track,
			type: "subtitle",
			info: { config: meta.config },
			timescale: 1e3,
			samples: [],
			sampleQueue: [],
			timestampProcessingQueue: [],
			timeToSampleTable: [],
			compositionTimeOffsetTable: [],
			lastTimescaleUnits: null,
			lastSample: null,
			startTimestampOffset: null,
			finalizedChunks: [],
			currentChunk: null,
			compactlyCodedChunkTable: [],
			closed: false,
			lastCueEndTimestamp: 0,
			cueQueue: [],
			nextSourceId: 0,
			cueToSourceId: /* @__PURE__ */ new WeakMap()
		};
		this.trackDatas.push(newTrackData);
		this.trackDatas.sort((a, b$1) => a.track.id - b$1.track.id);
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		return newTrackData;
	}
	async addEncodedVideoPacket(track, packet, meta) {
		const release = await this.mutex.acquire();
		try {
			const trackData = this.getVideoTrackData(track, packet, meta);
			let packetData = packet.data;
			if (trackData.info.requiresAnnexBTransformation) {
				const nalUnits = [...iterateNalUnitsInAnnexB$1(packetData)].map((loc) => packetData.subarray(loc.offset, loc.offset + loc.length));
				if (nalUnits.length === 0) throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
				packetData = concatNalUnitsInLengthPrefixed(nalUnits, 4);
			}
			this.validateTimestamp(trackData.track, packet.timestamp, packet.type === "key");
			const internalSample = this.createSampleForTrack(trackData, packetData, packet.timestamp, packet.duration, packet.type);
			await this.registerSample(trackData, internalSample);
		} finally {
			release();
		}
	}
	async addEncodedAudioPacket(track, packet, meta) {
		const release = await this.mutex.acquire();
		try {
			const trackData = this.getAudioTrackData(track, packet, meta);
			let packetData = packet.data;
			if (trackData.info.requiresAdtsStripping) {
				const adtsFrame = readAdtsFrameHeader(FileSlice.tempFromBytes(packetData));
				if (!adtsFrame) throw new Error("Expected ADTS frame, didn't get one.");
				const headerLength = adtsFrame.crcCheck === null ? MIN_ADTS_FRAME_HEADER_SIZE : MAX_ADTS_FRAME_HEADER_SIZE;
				packetData = packetData.subarray(headerLength);
			}
			this.validateTimestamp(trackData.track, packet.timestamp, packet.type === "key");
			let timestamp = packet.timestamp;
			let duration = packet.duration;
			if (trackData.info.requiresPcmTransformation) {
				const frameSize = parsePcmCodec(trackData.info.decoderConfig.codec).sampleSize * trackData.info.numberOfChannels;
				duration = packetData.byteLength / frameSize / trackData.info.sampleRate;
				if (trackData.info.expectedNextPcmPacketTimestamp !== null) {
					const diff = timestamp - trackData.info.expectedNextPcmPacketTimestamp;
					if (diff < .01) timestamp = trackData.info.expectedNextPcmPacketTimestamp;
					else {
						const paddedDuration = await this.padWithSilence(trackData, trackData.info.expectedNextPcmPacketTimestamp, diff);
						timestamp = trackData.info.expectedNextPcmPacketTimestamp + paddedDuration;
					}
				}
				trackData.info.expectedNextPcmPacketTimestamp = timestamp + duration;
			}
			const internalSample = this.createSampleForTrack(trackData, packetData, timestamp, duration, packet.type);
			await this.registerSample(trackData, internalSample);
		} finally {
			release();
		}
	}
	async padWithSilence(trackData, timestamp, duration) {
		const deltaInTimescale = intoTimescale(duration, trackData.timescale);
		duration = deltaInTimescale / trackData.timescale;
		if (deltaInTimescale > 0) {
			const { sampleSize, silentValue } = parsePcmCodec(trackData.info.decoderConfig.codec);
			const samplesNeeded = deltaInTimescale * trackData.info.numberOfChannels;
			const data = new Uint8Array(sampleSize * samplesNeeded).fill(silentValue);
			const paddingSample = this.createSampleForTrack(trackData, new Uint8Array(data.buffer), timestamp, duration, "key");
			await this.registerSample(trackData, paddingSample);
		}
		return duration;
	}
	async addSubtitleCue(track, cue, meta) {
		const release = await this.mutex.acquire();
		try {
			const trackData = this.getSubtitleTrackData(track, meta);
			this.validateTimestamp(trackData.track, cue.timestamp, true);
			if (track.source._codec === "webvtt") {
				trackData.cueQueue.push(cue);
				await this.processWebVTTCues(trackData, cue.timestamp);
			}
		} finally {
			release();
		}
	}
	async processWebVTTCues(trackData, until) {
		while (trackData.cueQueue.length > 0) {
			const timestamps = /* @__PURE__ */ new Set([]);
			for (const cue of trackData.cueQueue) {
				assert$3(cue.timestamp <= until);
				assert$3(trackData.lastCueEndTimestamp <= cue.timestamp + cue.duration);
				timestamps.add(Math.max(cue.timestamp, trackData.lastCueEndTimestamp));
				timestamps.add(cue.timestamp + cue.duration);
			}
			const sortedTimestamps = [...timestamps].sort((a, b$1) => a - b$1);
			const sampleStart = sortedTimestamps[0];
			const sampleEnd = sortedTimestamps[1] ?? sampleStart;
			if (until < sampleEnd) break;
			if (trackData.lastCueEndTimestamp < sampleStart) {
				this.auxWriter.seek(0);
				const box$1 = vtte();
				this.auxBoxWriter.writeBox(box$1);
				const body$1 = this.auxTarget._getSlice(0, this.auxWriter.getPos());
				const sample$1 = this.createSampleForTrack(trackData, body$1, trackData.lastCueEndTimestamp, sampleStart - trackData.lastCueEndTimestamp, "key");
				await this.registerSample(trackData, sample$1);
				trackData.lastCueEndTimestamp = sampleStart;
			}
			this.auxWriter.seek(0);
			for (let i = 0; i < trackData.cueQueue.length; i++) {
				const cue = trackData.cueQueue[i];
				if (cue.timestamp >= sampleEnd) break;
				inlineTimestampRegex.lastIndex = 0;
				const containsTimestamp = inlineTimestampRegex.test(cue.text);
				const endTimestamp = cue.timestamp + cue.duration;
				let sourceId = trackData.cueToSourceId.get(cue);
				if (sourceId === void 0 && sampleEnd < endTimestamp) {
					sourceId = trackData.nextSourceId++;
					trackData.cueToSourceId.set(cue, sourceId);
				}
				if (cue.notes) {
					const box$2 = vtta(cue.notes);
					this.auxBoxWriter.writeBox(box$2);
				}
				const box$1 = vttc(cue.text, containsTimestamp ? sampleStart : null, cue.identifier ?? null, cue.settings ?? null, sourceId ?? null);
				this.auxBoxWriter.writeBox(box$1);
				if (endTimestamp === sampleEnd) trackData.cueQueue.splice(i--, 1);
			}
			const body = this.auxTarget._getSlice(0, this.auxWriter.getPos());
			const sample = this.createSampleForTrack(trackData, body, sampleStart, sampleEnd - sampleStart, "key");
			await this.registerSample(trackData, sample);
			trackData.lastCueEndTimestamp = sampleEnd;
		}
	}
	createSampleForTrack(trackData, data, timestamp, duration, type) {
		return {
			timestamp,
			decodeTimestamp: timestamp,
			duration,
			data,
			size: data.byteLength,
			type,
			timescaleUnitsToNextSample: intoTimescale(duration, trackData.timescale)
		};
	}
	processTimestamps(trackData, nextSample) {
		if (trackData.timestampProcessingQueue.length === 0) return;
		if (trackData.type === "audio" && trackData.info.requiresPcmTransformation) {
			if (!this.isFragmented) trackData.startTimestampOffset ??= trackData.timestampProcessingQueue[0].timestamp;
			let totalDuration = 0;
			for (let i = 0; i < trackData.timestampProcessingQueue.length; i++) {
				const sample = trackData.timestampProcessingQueue[i];
				const duration = intoTimescale(sample.duration, trackData.timescale);
				totalDuration += duration;
			}
			if (trackData.timeToSampleTable.length === 0) trackData.timeToSampleTable.push({
				sampleCount: totalDuration,
				sampleDelta: 1
			});
			else {
				const lastEntry = last$1(trackData.timeToSampleTable);
				lastEntry.sampleCount += totalDuration;
			}
			trackData.timestampProcessingQueue.length = 0;
			return;
		}
		const sortedTimestamps = trackData.timestampProcessingQueue.map((x$1) => x$1.timestamp).sort((a, b$1) => a - b$1);
		if (!this.isFragmented) trackData.startTimestampOffset ??= sortedTimestamps[0];
		for (let i = 0; i < trackData.timestampProcessingQueue.length; i++) {
			const sample = trackData.timestampProcessingQueue[i];
			sample.decodeTimestamp = sortedTimestamps[i];
			const sampleCompositionTimeOffset = intoTimescale(sample.timestamp - sample.decodeTimestamp, trackData.timescale);
			const durationInTimescale = intoTimescale(sample.duration, trackData.timescale);
			if (trackData.lastTimescaleUnits !== null) {
				assert$3(trackData.lastSample);
				const timescaleUnits = intoTimescale(sample.decodeTimestamp, trackData.timescale, false);
				const delta = Math.round(timescaleUnits - trackData.lastTimescaleUnits);
				assert$3(delta >= 0);
				trackData.lastTimescaleUnits += delta;
				trackData.lastSample.timescaleUnitsToNextSample = delta;
				if (!this.isFragmented) {
					let lastTableEntry = last$1(trackData.timeToSampleTable);
					assert$3(lastTableEntry);
					if (lastTableEntry.sampleCount === 1) {
						lastTableEntry.sampleDelta = delta;
						const entryBefore = trackData.timeToSampleTable[trackData.timeToSampleTable.length - 2];
						if (entryBefore && entryBefore.sampleDelta === delta) {
							entryBefore.sampleCount++;
							trackData.timeToSampleTable.pop();
							lastTableEntry = entryBefore;
						}
					} else if (lastTableEntry.sampleDelta !== delta) {
						lastTableEntry.sampleCount--;
						trackData.timeToSampleTable.push(lastTableEntry = {
							sampleCount: 1,
							sampleDelta: delta
						});
					}
					if (lastTableEntry.sampleDelta === durationInTimescale) lastTableEntry.sampleCount++;
					else trackData.timeToSampleTable.push({
						sampleCount: 1,
						sampleDelta: durationInTimescale
					});
					const lastCompositionTimeOffsetTableEntry = last$1(trackData.compositionTimeOffsetTable);
					assert$3(lastCompositionTimeOffsetTableEntry);
					if (lastCompositionTimeOffsetTableEntry.sampleCompositionTimeOffset === sampleCompositionTimeOffset) lastCompositionTimeOffsetTableEntry.sampleCount++;
					else trackData.compositionTimeOffsetTable.push({
						sampleCount: 1,
						sampleCompositionTimeOffset
					});
				}
			} else {
				trackData.lastTimescaleUnits = intoTimescale(sample.decodeTimestamp, trackData.timescale, false);
				if (!this.isFragmented) {
					trackData.timeToSampleTable.push({
						sampleCount: 1,
						sampleDelta: durationInTimescale
					});
					trackData.compositionTimeOffsetTable.push({
						sampleCount: 1,
						sampleCompositionTimeOffset
					});
				}
			}
			trackData.lastSample = sample;
		}
		trackData.timestampProcessingQueue.length = 0;
		assert$3(trackData.lastSample);
		assert$3(trackData.lastTimescaleUnits !== null);
		if (nextSample !== void 0 && trackData.lastSample.timescaleUnitsToNextSample === 0) {
			assert$3(nextSample.type === "key");
			const timescaleUnits = intoTimescale(nextSample.timestamp, trackData.timescale, false);
			const delta = Math.round(timescaleUnits - trackData.lastTimescaleUnits);
			trackData.lastSample.timescaleUnitsToNextSample = delta;
		}
	}
	async registerSample(trackData, sample) {
		if (sample.type === "key") this.processTimestamps(trackData, sample);
		trackData.timestampProcessingQueue.push(sample);
		if (this.isFragmented) {
			trackData.sampleQueue.push(sample);
			await this.interleaveSamples();
		} else if (this.fastStart === "reserve") await this.registerSampleFastStartReserve(trackData, sample);
		else await this.addSampleToTrack(trackData, sample);
	}
	async addSampleToTrack(trackData, sample) {
		if (!this.isFragmented) {
			trackData.samples.push(sample);
			if (this.fastStart === "reserve") {
				const maximumPacketCount = trackData.track.metadata.maximumPacketCount;
				assert$3(maximumPacketCount !== void 0);
				if (trackData.samples.length > maximumPacketCount) throw new Error(`Track #${trackData.track.id} has already reached the maximum packet count (${maximumPacketCount}). Either add less packets or increase the maximum packet count.`);
			}
		}
		let beginNewChunk = false;
		if (!trackData.currentChunk) beginNewChunk = true;
		else {
			trackData.currentChunk.startTimestamp = Math.min(trackData.currentChunk.startTimestamp, sample.timestamp);
			const currentChunkDuration = sample.timestamp - trackData.currentChunk.startTimestamp;
			if (this.isFragmented) {
				const keyFrameQueuedEverywhere = this.trackDatas.every((otherTrackData) => {
					if (trackData === otherTrackData) return sample.type === "key";
					const firstQueuedSample = otherTrackData.sampleQueue[0];
					if (firstQueuedSample) return firstQueuedSample.type === "key";
					return otherTrackData.closed;
				});
				if (currentChunkDuration >= this.minimumFragmentDuration && keyFrameQueuedEverywhere && sample.timestamp > this.maxWrittenTimestamp) {
					beginNewChunk = true;
					await this.finalizeFragment();
				}
			} else beginNewChunk = currentChunkDuration >= .5;
		}
		if (beginNewChunk) {
			if (trackData.currentChunk) await this.finalizeCurrentChunk(trackData);
			trackData.currentChunk = {
				startTimestamp: sample.timestamp,
				samples: [],
				offset: null,
				moofOffset: null
			};
		}
		assert$3(trackData.currentChunk);
		trackData.currentChunk.samples.push(sample);
		if (this.isFragmented) {
			this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, sample.timestamp);
			this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, sample.timestamp + sample.duration);
			this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, sample.timestamp);
		}
	}
	async finalizeCurrentChunk(trackData) {
		assert$3(!this.isFragmented);
		assert$3(this.writer);
		if (!trackData.currentChunk) return;
		trackData.finalizedChunks.push(trackData.currentChunk);
		this.finalizedChunks.push(trackData.currentChunk);
		let sampleCount = trackData.currentChunk.samples.length;
		if (trackData.type === "audio" && trackData.info.requiresPcmTransformation) sampleCount = trackData.currentChunk.samples.reduce((acc, sample) => acc + intoTimescale(sample.duration, trackData.timescale), 0);
		if (trackData.compactlyCodedChunkTable.length === 0 || last$1(trackData.compactlyCodedChunkTable).samplesPerChunk !== sampleCount) trackData.compactlyCodedChunkTable.push({
			firstChunk: trackData.finalizedChunks.length,
			samplesPerChunk: sampleCount
		});
		if (this.fastStart === "in-memory") {
			trackData.currentChunk.offset = 0;
			return;
		}
		trackData.currentChunk.offset = this.writer.getPos();
		for (const sample of trackData.currentChunk.samples) {
			assert$3(sample.data);
			this.writer.write(sample.data);
			sample.data = null;
		}
		await this.writer.flush();
	}
	async interleaveSamples(isFinalCall = false) {
		assert$3(this.isFragmented);
		if (!isFinalCall && !this.allTracksAreKnown()) return;
		outer: while (true) {
			let trackWithMinTimestamp = null;
			let minTimestamp = Infinity;
			for (const trackData of this.trackDatas) {
				if (!isFinalCall && trackData.sampleQueue.length === 0 && !trackData.closed) break outer;
				if (trackData.sampleQueue.length > 0 && trackData.sampleQueue[0].timestamp < minTimestamp) {
					trackWithMinTimestamp = trackData;
					minTimestamp = trackData.sampleQueue[0].timestamp;
				}
			}
			if (!trackWithMinTimestamp) break;
			const sample = trackWithMinTimestamp.sampleQueue.shift();
			await this.addSampleToTrack(trackWithMinTimestamp, sample);
		}
	}
	async finalizeFragment(flushWriter = !this.isCmaf) {
		assert$3(this.isFragmented);
		const fragmentNumber = this.nextFragmentNumber++;
		if (fragmentNumber === 1) {
			const boxWriter = this.initBoxWriter ?? this.boxWriter;
			assert$3(boxWriter);
			if (this.format._options.onMoov) boxWriter.writer.startTrackingWrites();
			this.ensureOneEnabledTrack();
			const movieBox = moov(this);
			boxWriter.writeBox(movieBox);
			if (this.format._options.onMoov) {
				const { data, start } = boxWriter.writer.stopTrackingWrites();
				this.format._options.onMoov(data, start);
			}
			if (this.isCmaf) {
				assert$3(this.initWriter);
				await this.initWriter.flush();
				await this.initWriter.finalize();
				this.writer = await this.output._getRootWriter(true);
				this.boxWriter = new IsobmffBoxWriter(this.writer);
				this.segmentHeaderSize = this.boxWriter.measureBox(styp()) + this.boxWriter.measureBox(sidx(this, 0));
				this.writer.seek(this.segmentHeaderSize);
			}
		}
		assert$3(this.writer);
		assert$3(this.boxWriter);
		const tracksInFragment = this.trackDatas.filter((x$1) => x$1.currentChunk);
		const moofBox = moof(fragmentNumber, tracksInFragment);
		const moofOffset = this.writer.getPos();
		const mdatStartPos = moofOffset + this.boxWriter.measureBox(moofBox);
		let currentPos = mdatStartPos + MIN_BOX_HEADER_SIZE;
		let fragmentStartTimestamp = Infinity;
		for (const trackData of tracksInFragment) {
			trackData.currentChunk.offset = currentPos;
			trackData.currentChunk.moofOffset = moofOffset;
			for (const sample of trackData.currentChunk.samples) currentPos += sample.size;
			fragmentStartTimestamp = Math.min(fragmentStartTimestamp, trackData.currentChunk.startTimestamp);
		}
		const mdatSize = currentPos - mdatStartPos;
		const needsLargeMdatSize = mdatSize >= 2 ** 32;
		if (needsLargeMdatSize) for (const trackData of tracksInFragment) trackData.currentChunk.offset += MAX_BOX_HEADER_SIZE - MIN_BOX_HEADER_SIZE;
		if (this.format._options.onMoof) this.writer.startTrackingWrites();
		const newMoofBox = moof(fragmentNumber, tracksInFragment);
		this.boxWriter.writeBox(newMoofBox);
		if (this.format._options.onMoof) {
			const { data, start } = this.writer.stopTrackingWrites();
			this.format._options.onMoof(data, start, fragmentStartTimestamp);
		}
		assert$3(this.writer.getPos() === mdatStartPos);
		if (this.format._options.onMdat) this.writer.startTrackingWrites();
		const mdatBox = mdat(needsLargeMdatSize);
		mdatBox.size = mdatSize;
		this.boxWriter.writeBox(mdatBox);
		this.writer.seek(mdatStartPos + (needsLargeMdatSize ? MAX_BOX_HEADER_SIZE : MIN_BOX_HEADER_SIZE));
		for (const trackData of tracksInFragment) for (const sample of trackData.currentChunk.samples) {
			this.writer.write(sample.data);
			sample.data = null;
		}
		if (this.format._options.onMdat) {
			const { data, start } = this.writer.stopTrackingWrites();
			this.format._options.onMdat(data, start);
		}
		for (const trackData of tracksInFragment) {
			trackData.finalizedChunks.push(trackData.currentChunk);
			this.finalizedChunks.push(trackData.currentChunk);
			trackData.currentChunk = null;
		}
		if (flushWriter) await this.writer.flush();
	}
	async registerSampleFastStartReserve(trackData, sample) {
		assert$3(this.writer);
		assert$3(this.boxWriter);
		if (this.allTracksAreKnown()) {
			if (!this.mdat) {
				this.ensureOneEnabledTrack();
				const moovBox = moov(this);
				const reservedSize = this.boxWriter.measureBox(moovBox) + this.computeSampleTableSizeUpperBound() + 4096;
				assert$3(this.ftypSize !== null);
				this.writer.seek(this.ftypSize + reservedSize);
				if (this.format._options.onMdat) this.writer.startTrackingWrites();
				this.mdat = mdat(true);
				this.boxWriter.writeBox(this.mdat);
				for (const trackData$1 of this.trackDatas) {
					for (const sample$1 of trackData$1.sampleQueue) await this.addSampleToTrack(trackData$1, sample$1);
					trackData$1.sampleQueue.length = 0;
				}
			}
			await this.addSampleToTrack(trackData, sample);
		} else trackData.sampleQueue.push(sample);
	}
	computeSampleTableSizeUpperBound() {
		assert$3(this.fastStart === "reserve");
		let upperBound = 0;
		for (const trackData of this.trackDatas) {
			const n = trackData.track.metadata.maximumPacketCount;
			assert$3(n !== void 0);
			upperBound += 8 * Math.ceil(2 / 3 * n);
			upperBound += 4 * n;
			upperBound += 8 * Math.ceil(2 / 3 * n);
			upperBound += 12 * Math.ceil(2 / 3 * n);
			upperBound += 4 * n;
			upperBound += 8 * n;
		}
		return upperBound;
	}
	async onTrackClose(track) {
		const release = await this.mutex.acquire();
		const trackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (trackData) {
			trackData.closed = true;
			if (trackData.type === "subtitle" && track.source._codec === "webvtt") await this.processWebVTTCues(trackData, Infinity);
			this.processTimestamps(trackData);
		}
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		if (this.isFragmented) await this.interleaveSamples();
		release();
	}
	ensureOneEnabledTrack() {
		for (const type of [
			"video",
			"audio",
			"subtitle"
		]) {
			const tracks = this.trackDatas.filter((t) => t.type === type);
			if (tracks.length === 0) continue;
			if (!tracks.some((t) => t.track.metadata.disposition?.default !== false)) {
				const firstTrack = tracks[0];
				firstTrack.track.metadata.disposition = {
					...firstTrack.track.metadata.disposition,
					default: true
				};
			}
		}
	}
	/** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
	async finalize() {
		const release = await this.mutex.acquire();
		this.allTracksKnown.resolve();
		this.ensureOneEnabledTrack();
		for (const trackData of this.trackDatas) {
			trackData.closed = true;
			if (trackData.type === "subtitle" && trackData.track.source._codec === "webvtt") await this.processWebVTTCues(trackData, Infinity);
			this.processTimestamps(trackData);
		}
		if (this.isFragmented) {
			await this.interleaveSamples(true);
			await this.finalizeFragment(false);
		} else for (const trackData of this.trackDatas) {
			await this.finalizeCurrentChunk(trackData);
			assert$3(trackData.startTimestampOffset !== null);
			for (let i = 0; i < trackData.samples.length; i++) {
				const sample = trackData.samples[i];
				sample.timestamp -= trackData.startTimestampOffset;
				sample.decodeTimestamp -= trackData.startTimestampOffset;
			}
		}
		assert$3(this.writer);
		assert$3(this.boxWriter);
		if (this.fastStart === "in-memory") {
			this.mdat = mdat(false);
			let mdatSize;
			for (let i = 0; i < 2; i++) {
				const movieBox$1 = moov(this);
				const movieBoxSize = this.boxWriter.measureBox(movieBox$1);
				mdatSize = this.boxWriter.measureBox(this.mdat);
				let currentChunkPos = this.writer.getPos() + movieBoxSize + mdatSize;
				for (const chunk of this.finalizedChunks) {
					chunk.offset = currentChunkPos;
					for (const { data } of chunk.samples) {
						assert$3(data);
						currentChunkPos += data.byteLength;
						mdatSize += data.byteLength;
					}
				}
				if (currentChunkPos < 2 ** 32) break;
				if (mdatSize >= 2 ** 32) this.mdat.largeSize = true;
			}
			if (this.format._options.onMoov) this.writer.startTrackingWrites();
			const movieBox = moov(this);
			this.boxWriter.writeBox(movieBox);
			if (this.format._options.onMoov) {
				const { data, start } = this.writer.stopTrackingWrites();
				this.format._options.onMoov(data, start);
			}
			if (this.format._options.onMdat) this.writer.startTrackingWrites();
			this.mdat.size = mdatSize;
			this.boxWriter.writeBox(this.mdat);
			for (const chunk of this.finalizedChunks) for (const sample of chunk.samples) {
				assert$3(sample.data);
				this.writer.write(sample.data);
				sample.data = null;
			}
			if (this.format._options.onMdat) {
				const { data, start } = this.writer.stopTrackingWrites();
				this.format._options.onMdat(data, start);
			}
		} else if (this.isFragmented) if (this.isCmaf) {
			const contentSize = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
			this.writer.seek(0);
			this.boxWriter.writeBox(styp());
			this.boxWriter.writeBox(sidx(this, contentSize));
		} else {
			const startPos = this.writer.getPos();
			const mfraBox = mfra(this.trackDatas);
			this.boxWriter.writeBox(mfraBox);
			const mfraBoxSize = this.writer.getPos() - startPos;
			this.writer.seek(this.writer.getPos() - 4);
			this.boxWriter.writeU32(mfraBoxSize);
		}
		else {
			assert$3(this.mdat);
			const mdatPos = this.boxWriter.offsets.get(this.mdat);
			assert$3(mdatPos !== void 0);
			const mdatSize = this.writer.getPos() - mdatPos;
			this.mdat.size = mdatSize;
			this.mdat.largeSize = mdatSize >= 2 ** 32;
			this.boxWriter.patchBox(this.mdat);
			if (this.format._options.onMdat) {
				const { data, start } = this.writer.stopTrackingWrites();
				this.format._options.onMdat(data, start);
			}
			const movieBox = moov(this);
			if (this.fastStart === "reserve") {
				assert$3(this.ftypSize !== null);
				this.writer.seek(this.ftypSize);
				if (this.format._options.onMoov) this.writer.startTrackingWrites();
				this.boxWriter.writeBox(movieBox);
				const remainingSpace = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
				this.boxWriter.writeBox(free(remainingSpace));
			} else {
				if (this.format._options.onMoov) this.writer.startTrackingWrites();
				this.boxWriter.writeBox(movieBox);
			}
			if (this.format._options.onMoov) {
				const { data, start } = this.writer.stopTrackingWrites();
				this.format._options.onMoov(data, start);
			}
		}
		release();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/matroska/matroska-muxer.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
const MIN_CLUSTER_TIMESTAMP_MS = -(2 ** 15);
const MAX_CLUSTER_TIMESTAMP_MS = 2 ** 15 - 1;
const APP_NAME = "Mediabunny";
const SEGMENT_SIZE_BYTES = 6;
const CLUSTER_SIZE_BYTES = 5;
const TRACK_TYPE_MAP = {
	video: 1,
	audio: 2,
	subtitle: 17
};
var MatroskaMuxer = class extends Muxer {
	constructor(output, format) {
		super(output);
		this.trackDatas = [];
		this.allTracksKnown = promiseWithResolvers();
		this.segment = null;
		this.segmentInfo = null;
		this.seekHead = null;
		this.tracksElement = null;
		this.tagsElement = null;
		this.attachmentsElement = null;
		this.segmentDuration = null;
		this.cues = null;
		this.currentCluster = null;
		this.currentClusterStartMsTimestamp = null;
		this.currentClusterMaxMsTimestamp = null;
		this.trackDatasInCurrentCluster = /* @__PURE__ */ new Map();
		this.startTimestamp = Infinity;
		this.endTimestamp = -Infinity;
		this.format = format;
	}
	async start() {
		const release = await this.mutex.acquire();
		this.writer = await this.output._getRootWriter(!!this.format._options.appendOnly);
		this.ebmlWriter = new EBMLWriter(this.writer);
		this.writeEBMLHeader();
		this.createSegmentInfo();
		this.createCues();
		await this.writer.flush();
		release();
	}
	writeEBMLHeader() {
		if (this.format._options.onEbmlHeader) this.writer.startTrackingWrites();
		const ebmlHeader = {
			id: EBMLId.EBML,
			data: [
				{
					id: EBMLId.EBMLVersion,
					data: 1
				},
				{
					id: EBMLId.EBMLReadVersion,
					data: 1
				},
				{
					id: EBMLId.EBMLMaxIDLength,
					data: 4
				},
				{
					id: EBMLId.EBMLMaxSizeLength,
					data: 8
				},
				{
					id: EBMLId.DocType,
					data: this.format instanceof WebMOutputFormat ? "webm" : "matroska"
				},
				{
					id: EBMLId.DocTypeVersion,
					data: 2
				},
				{
					id: EBMLId.DocTypeReadVersion,
					data: 2
				}
			]
		};
		this.ebmlWriter.writeEBML(ebmlHeader);
		if (this.format._options.onEbmlHeader) {
			const { data, start } = this.writer.stopTrackingWrites();
			this.format._options.onEbmlHeader(data, start);
		}
	}
	/**
	* Creates a SeekHead element which is positioned near the start of the file and allows the media player to seek to
	* relevant sections more easily. Since we don't know the positions of those sections yet, we'll set them later.
	*/
	maybeCreateSeekHead(writeOffsets) {
		if (this.format._options.appendOnly) return;
		const kaxCues = new Uint8Array([
			28,
			83,
			187,
			107
		]);
		const kaxInfo = new Uint8Array([
			21,
			73,
			169,
			102
		]);
		const kaxTracks = new Uint8Array([
			22,
			84,
			174,
			107
		]);
		const kaxAttachments = new Uint8Array([
			25,
			65,
			164,
			105
		]);
		const kaxTags = new Uint8Array([
			18,
			84,
			195,
			103
		]);
		this.seekHead = {
			id: EBMLId.SeekHead,
			data: [
				{
					id: EBMLId.Seek,
					data: [{
						id: EBMLId.SeekID,
						data: kaxCues
					}, {
						id: EBMLId.SeekPosition,
						size: 5,
						data: writeOffsets ? this.ebmlWriter.offsets.get(this.cues) - this.segmentDataOffset : 0
					}]
				},
				{
					id: EBMLId.Seek,
					data: [{
						id: EBMLId.SeekID,
						data: kaxInfo
					}, {
						id: EBMLId.SeekPosition,
						size: 5,
						data: writeOffsets ? this.ebmlWriter.offsets.get(this.segmentInfo) - this.segmentDataOffset : 0
					}]
				},
				{
					id: EBMLId.Seek,
					data: [{
						id: EBMLId.SeekID,
						data: kaxTracks
					}, {
						id: EBMLId.SeekPosition,
						size: 5,
						data: writeOffsets ? this.ebmlWriter.offsets.get(this.tracksElement) - this.segmentDataOffset : 0
					}]
				},
				this.attachmentsElement ? {
					id: EBMLId.Seek,
					data: [{
						id: EBMLId.SeekID,
						data: kaxAttachments
					}, {
						id: EBMLId.SeekPosition,
						size: 5,
						data: writeOffsets ? this.ebmlWriter.offsets.get(this.attachmentsElement) - this.segmentDataOffset : 0
					}]
				} : null,
				this.tagsElement ? {
					id: EBMLId.Seek,
					data: [{
						id: EBMLId.SeekID,
						data: kaxTags
					}, {
						id: EBMLId.SeekPosition,
						size: 5,
						data: writeOffsets ? this.ebmlWriter.offsets.get(this.tagsElement) - this.segmentDataOffset : 0
					}]
				} : null
			]
		};
	}
	createSegmentInfo() {
		const segmentDuration = {
			id: EBMLId.Duration,
			data: new EBMLFloat64(0)
		};
		this.segmentDuration = segmentDuration;
		this.segmentInfo = {
			id: EBMLId.Info,
			data: [
				{
					id: EBMLId.TimestampScale,
					data: 1e6
				},
				{
					id: EBMLId.MuxingApp,
					data: APP_NAME
				},
				{
					id: EBMLId.WritingApp,
					data: APP_NAME
				},
				!this.format._options.appendOnly ? segmentDuration : null
			]
		};
	}
	createTracks() {
		const tracksElement = {
			id: EBMLId.Tracks,
			data: []
		};
		this.tracksElement = tracksElement;
		for (const trackData of this.trackDatas) {
			const codecId = CODEC_STRING_MAP[trackData.track.source._codec];
			assert$3(codecId);
			let seekPreRollNs = 0;
			if (trackData.type === "audio" && trackData.track.source._codec === "opus") {
				seekPreRollNs = 1e6 * 80;
				const description = trackData.info.decoderConfig.description;
				if (description) {
					const header = parseOpusIdentificationHeader(toUint8Array$1(description));
					seekPreRollNs = Math.round(1e9 * (header.preSkip / OPUS_SAMPLE_RATE));
				}
			}
			tracksElement.data.push({
				id: EBMLId.TrackEntry,
				data: [
					{
						id: EBMLId.TrackNumber,
						data: trackData.track.id
					},
					{
						id: EBMLId.TrackUID,
						data: trackData.track.id
					},
					{
						id: EBMLId.TrackType,
						data: TRACK_TYPE_MAP[trackData.type]
					},
					trackData.track.metadata.disposition?.default === false ? {
						id: EBMLId.FlagDefault,
						data: 0
					} : null,
					trackData.track.metadata.disposition?.forced ? {
						id: EBMLId.FlagForced,
						data: 1
					} : null,
					trackData.track.metadata.disposition?.hearingImpaired ? {
						id: EBMLId.FlagHearingImpaired,
						data: 1
					} : null,
					trackData.track.metadata.disposition?.visuallyImpaired ? {
						id: EBMLId.FlagVisualImpaired,
						data: 1
					} : null,
					trackData.track.metadata.disposition?.original ? {
						id: EBMLId.FlagOriginal,
						data: 1
					} : null,
					trackData.track.metadata.disposition?.commentary ? {
						id: EBMLId.FlagCommentary,
						data: 1
					} : null,
					{
						id: EBMLId.FlagLacing,
						data: 0
					},
					{
						id: EBMLId.Language,
						data: trackData.track.metadata.languageCode ?? UNDETERMINED_LANGUAGE
					},
					{
						id: EBMLId.CodecID,
						data: codecId
					},
					trackData.codecPrivate ? {
						id: EBMLId.CodecPrivate,
						data: toUint8Array$1(trackData.codecPrivate)
					} : null,
					{
						id: EBMLId.CodecDelay,
						data: 0
					},
					{
						id: EBMLId.SeekPreRoll,
						data: seekPreRollNs
					},
					trackData.track.metadata.name !== void 0 ? {
						id: EBMLId.Name,
						data: new EBMLUnicodeString(trackData.track.metadata.name)
					} : null,
					trackData.type === "video" ? this.videoSpecificTrackInfo(trackData) : null,
					trackData.type === "audio" ? this.audioSpecificTrackInfo(trackData) : null,
					trackData.type === "subtitle" ? this.subtitleSpecificTrackInfo(trackData) : null
				]
			});
		}
	}
	videoSpecificTrackInfo(trackData) {
		const { frameRate, rotation } = trackData.track.metadata;
		const elements = [frameRate ? {
			id: EBMLId.DefaultDuration,
			data: 1e9 / frameRate
		} : null];
		const flippedRotation = rotation ? normalizeRotation(-rotation) : 0;
		const hasNonSquarePixelAspectRatio = !!trackData.info.aspectRatio && trackData.info.aspectRatio.num * trackData.info.height !== trackData.info.aspectRatio.den * trackData.info.width;
		const colorSpace = trackData.info.decoderConfig.colorSpace;
		const videoElement = {
			id: EBMLId.Video,
			data: [
				{
					id: EBMLId.PixelWidth,
					data: trackData.info.width
				},
				{
					id: EBMLId.PixelHeight,
					data: trackData.info.height
				},
				hasNonSquarePixelAspectRatio ? {
					id: EBMLId.DisplayWidth,
					data: trackData.info.aspectRatio.num
				} : null,
				hasNonSquarePixelAspectRatio ? {
					id: EBMLId.DisplayHeight,
					data: trackData.info.aspectRatio.den
				} : null,
				hasNonSquarePixelAspectRatio ? {
					id: EBMLId.DisplayUnit,
					data: 3
				} : null,
				trackData.info.alphaMode ? {
					id: EBMLId.AlphaMode,
					data: 1
				} : null,
				colorSpaceIsComplete(colorSpace) ? {
					id: EBMLId.Colour,
					data: [
						{
							id: EBMLId.MatrixCoefficients,
							data: MATRIX_COEFFICIENTS_MAP$1[colorSpace.matrix]
						},
						{
							id: EBMLId.TransferCharacteristics,
							data: TRANSFER_CHARACTERISTICS_MAP$1[colorSpace.transfer]
						},
						{
							id: EBMLId.Primaries,
							data: COLOR_PRIMARIES_MAP$1[colorSpace.primaries]
						},
						{
							id: EBMLId.Range,
							data: colorSpace.fullRange ? 2 : 1
						}
					]
				} : null,
				flippedRotation ? {
					id: EBMLId.Projection,
					data: [{
						id: EBMLId.ProjectionType,
						data: 0
					}, {
						id: EBMLId.ProjectionPoseRoll,
						data: new EBMLFloat32((flippedRotation + 180) % 360 - 180)
					}]
				} : null
			]
		};
		elements.push(videoElement);
		return elements;
	}
	audioSpecificTrackInfo(trackData) {
		const pcmInfo = PCM_AUDIO_CODECS.includes(trackData.track.source._codec) ? parsePcmCodec(trackData.track.source._codec) : null;
		return [{
			id: EBMLId.Audio,
			data: [
				{
					id: EBMLId.SamplingFrequency,
					data: new EBMLFloat32(trackData.info.sampleRate)
				},
				{
					id: EBMLId.Channels,
					data: trackData.info.numberOfChannels
				},
				pcmInfo ? {
					id: EBMLId.BitDepth,
					data: 8 * pcmInfo.sampleSize
				} : null
			]
		}];
	}
	subtitleSpecificTrackInfo(trackData) {
		return [];
	}
	maybeCreateTags() {
		const simpleTags = [];
		const addSimpleTag = (key, value) => {
			simpleTags.push({
				id: EBMLId.SimpleTag,
				data: [{
					id: EBMLId.TagName,
					data: new EBMLUnicodeString(key)
				}, typeof value === "string" ? {
					id: EBMLId.TagString,
					data: new EBMLUnicodeString(value)
				} : {
					id: EBMLId.TagBinary,
					data: value
				}]
			});
		};
		const metadataTags = this.output._metadataTags;
		const writtenTags = /* @__PURE__ */ new Set();
		for (const { key, value } of keyValueIterator(metadataTags)) switch (key) {
			case "title":
				addSimpleTag("TITLE", value);
				writtenTags.add("TITLE");
				break;
			case "description":
				addSimpleTag("DESCRIPTION", value);
				writtenTags.add("DESCRIPTION");
				break;
			case "artist":
				addSimpleTag("ARTIST", value);
				writtenTags.add("ARTIST");
				break;
			case "album":
				addSimpleTag("ALBUM", value);
				writtenTags.add("ALBUM");
				break;
			case "albumArtist":
				addSimpleTag("ALBUM_ARTIST", value);
				writtenTags.add("ALBUM_ARTIST");
				break;
			case "genre":
				addSimpleTag("GENRE", value);
				writtenTags.add("GENRE");
				break;
			case "comment":
				addSimpleTag("COMMENT", value);
				writtenTags.add("COMMENT");
				break;
			case "lyrics":
				addSimpleTag("LYRICS", value);
				writtenTags.add("LYRICS");
				break;
			case "date":
				addSimpleTag("DATE", value.toISOString().slice(0, 10));
				writtenTags.add("DATE");
				break;
			case "trackNumber":
				addSimpleTag("PART_NUMBER", metadataTags.tracksTotal !== void 0 ? `${value}/${metadataTags.tracksTotal}` : value.toString());
				writtenTags.add("PART_NUMBER");
				break;
			case "discNumber":
				addSimpleTag("DISC", metadataTags.discsTotal !== void 0 ? `${value}/${metadataTags.discsTotal}` : value.toString());
				writtenTags.add("DISC");
				break;
			case "tracksTotal":
			case "discsTotal": break;
			case "images":
			case "raw": break;
			default: assertNever$1(key);
		}
		if (metadataTags.raw) for (const key in metadataTags.raw) {
			const value = metadataTags.raw[key];
			if (value == null || writtenTags.has(key)) continue;
			if (typeof value === "string" || value instanceof Uint8Array) addSimpleTag(key, value);
		}
		if (simpleTags.length === 0) return;
		this.tagsElement = {
			id: EBMLId.Tags,
			data: [{
				id: EBMLId.Tag,
				data: [{
					id: EBMLId.Targets,
					data: [{
						id: EBMLId.TargetTypeValue,
						data: 50
					}, {
						id: EBMLId.TargetType,
						data: "MOVIE"
					}]
				}, ...simpleTags]
			}]
		};
	}
	maybeCreateAttachments() {
		const metadataTags = this.output._metadataTags;
		const elements = [];
		const existingFileUids = /* @__PURE__ */ new Set();
		const images = metadataTags.images ?? [];
		for (const image of images) {
			let imageName = image.name;
			if (imageName === void 0) imageName = (image.kind === "coverFront" ? "cover" : image.kind === "coverBack" ? "back" : "image") + (imageMimeTypeToExtension(image.mimeType) ?? "");
			let fileUid;
			while (true) {
				fileUid = 0n;
				for (let i = 0; i < 8; i++) {
					fileUid <<= 8n;
					fileUid |= BigInt(Math.floor(Math.random() * 256));
				}
				if (fileUid !== 0n && !existingFileUids.has(fileUid)) break;
			}
			existingFileUids.add(fileUid);
			elements.push({
				id: EBMLId.AttachedFile,
				data: [
					image.description !== void 0 ? {
						id: EBMLId.FileDescription,
						data: new EBMLUnicodeString(image.description)
					} : null,
					{
						id: EBMLId.FileName,
						data: new EBMLUnicodeString(imageName)
					},
					{
						id: EBMLId.FileMediaType,
						data: image.mimeType
					},
					{
						id: EBMLId.FileData,
						data: image.data
					},
					{
						id: EBMLId.FileUID,
						data: fileUid
					}
				]
			});
		}
		for (const [key, value] of Object.entries(metadataTags.raw ?? {})) {
			if (!(value instanceof AttachedFile)) continue;
			if (!/^\d+$/.test(key)) continue;
			if (images.find((x$1) => x$1.mimeType === value.mimeType && uint8ArraysAreEqual(x$1.data, value.data))) continue;
			elements.push({
				id: EBMLId.AttachedFile,
				data: [
					value.description !== void 0 ? {
						id: EBMLId.FileDescription,
						data: new EBMLUnicodeString(value.description)
					} : null,
					{
						id: EBMLId.FileName,
						data: new EBMLUnicodeString(value.name ?? "")
					},
					{
						id: EBMLId.FileMediaType,
						data: value.mimeType ?? ""
					},
					{
						id: EBMLId.FileData,
						data: value.data
					},
					{
						id: EBMLId.FileUID,
						data: BigInt(key)
					}
				]
			});
		}
		if (elements.length === 0) return;
		this.attachmentsElement = {
			id: EBMLId.Attachments,
			data: elements
		};
	}
	createSegment() {
		this.createTracks();
		this.maybeCreateTags();
		this.maybeCreateAttachments();
		this.maybeCreateSeekHead(false);
		const segment = {
			id: EBMLId.Segment,
			size: this.format._options.appendOnly ? -1 : SEGMENT_SIZE_BYTES,
			data: [
				this.seekHead,
				this.segmentInfo,
				this.tracksElement,
				this.attachmentsElement,
				this.tagsElement
			]
		};
		this.segment = segment;
		if (this.format._options.onSegmentHeader) this.writer.startTrackingWrites();
		this.ebmlWriter.writeEBML(segment);
		if (this.format._options.onSegmentHeader) {
			const { data, start } = this.writer.stopTrackingWrites();
			this.format._options.onSegmentHeader(data, start);
		}
	}
	createCues() {
		this.cues = {
			id: EBMLId.Cues,
			data: []
		};
	}
	get segmentDataOffset() {
		assert$3(this.segment);
		return this.ebmlWriter.dataOffsets.get(this.segment);
	}
	allTracksAreKnown() {
		for (const track of this.output.tracks) if (!track.source._closed && !this.trackDatas.some((x$1) => x$1.track === track)) return false;
		return true;
	}
	async getMimeType() {
		await this.allTracksKnown.promise;
		const codecStrings = this.trackDatas.map((trackData) => {
			if (trackData.type === "video") return trackData.info.decoderConfig.codec;
			else if (trackData.type === "audio") return trackData.info.decoderConfig.codec;
			else return { webvtt: "wvtt" }[trackData.track.source._codec];
		});
		return buildMatroskaMimeType({
			isWebM: this.format instanceof WebMOutputFormat,
			hasVideo: this.trackDatas.some((x$1) => x$1.type === "video"),
			hasAudio: this.trackDatas.some((x$1) => x$1.type === "audio"),
			codecStrings
		});
	}
	getVideoTrackData(track, packet, meta) {
		const existingTrackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (existingTrackData) return existingTrackData;
		validateVideoChunkMetadata(meta);
		assert$3(meta);
		assert$3(meta.decoderConfig);
		assert$3(meta.decoderConfig.codedWidth !== void 0);
		assert$3(meta.decoderConfig.codedHeight !== void 0);
		const displayAspectWidth = meta.decoderConfig.displayAspectWidth;
		const displayAspectHeight = meta.decoderConfig.displayAspectHeight;
		const aspectRatio = displayAspectWidth === void 0 || displayAspectHeight === void 0 ? null : simplifyRational$1({
			num: displayAspectWidth,
			den: displayAspectHeight
		});
		const newTrackData = {
			track,
			type: "video",
			info: {
				width: meta.decoderConfig.codedWidth,
				height: meta.decoderConfig.codedHeight,
				aspectRatio,
				decoderConfig: meta.decoderConfig,
				alphaMode: !!packet.sideData.alpha
			},
			chunkQueue: [],
			lastWrittenMsTimestamp: null,
			codecPrivate: meta.decoderConfig.description ?? null,
			closed: false
		};
		if (track.source._codec === "vp9") newTrackData.codecPrivate = new Uint8Array(generateVp9CodecConfigurationFromCodecString(newTrackData.info.decoderConfig.codec));
		else if (track.source._codec === "av1") newTrackData.codecPrivate = new Uint8Array(generateAv1CodecConfigurationFromCodecString(newTrackData.info.decoderConfig.codec));
		else if (track.source._codec === "prores") newTrackData.codecPrivate = textEncoder.encode(meta.decoderConfig.codec);
		this.trackDatas.push(newTrackData);
		this.trackDatas.sort((a, b$1) => a.track.id - b$1.track.id);
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		return newTrackData;
	}
	getAudioTrackData(track, packet, meta) {
		const existingTrackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (existingTrackData) return existingTrackData;
		validateAudioChunkMetadata(meta);
		assert$3(meta);
		assert$3(meta.decoderConfig);
		const decoderConfig = { ...meta.decoderConfig };
		let requiresAdtsStripping = false;
		if (track.source._codec === "aac" && !decoderConfig.description) {
			const adtsFrame = readAdtsFrameHeader(FileSlice.tempFromBytes(packet.data));
			if (!adtsFrame) throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
			const sampleRate = aacFrequencyTable$1[adtsFrame.samplingFrequencyIndex];
			const numberOfChannels = aacChannelMap$1[adtsFrame.channelConfiguration];
			if (sampleRate === void 0 || numberOfChannels === void 0) throw new Error("Invalid ADTS frame header.");
			decoderConfig.description = buildAacAudioSpecificConfig({
				objectType: adtsFrame.objectType,
				sampleRate,
				numberOfChannels
			});
			requiresAdtsStripping = true;
		}
		const newTrackData = {
			track,
			type: "audio",
			info: {
				numberOfChannels: meta.decoderConfig.numberOfChannels,
				sampleRate: meta.decoderConfig.sampleRate,
				decoderConfig,
				requiresAdtsStripping
			},
			chunkQueue: [],
			lastWrittenMsTimestamp: null,
			codecPrivate: decoderConfig.description ?? null,
			closed: false
		};
		this.trackDatas.push(newTrackData);
		this.trackDatas.sort((a, b$1) => a.track.id - b$1.track.id);
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		return newTrackData;
	}
	getSubtitleTrackData(track, meta) {
		const existingTrackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (existingTrackData) return existingTrackData;
		validateSubtitleMetadata(meta);
		assert$3(meta);
		assert$3(meta.config);
		const newTrackData = {
			track,
			type: "subtitle",
			info: { config: meta.config },
			chunkQueue: [],
			lastWrittenMsTimestamp: null,
			codecPrivate: textEncoder.encode(meta.config.description),
			closed: false
		};
		this.trackDatas.push(newTrackData);
		this.trackDatas.sort((a, b$1) => a.track.id - b$1.track.id);
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		return newTrackData;
	}
	async addEncodedVideoPacket(track, packet, meta) {
		const release = await this.mutex.acquire();
		try {
			const trackData = this.getVideoTrackData(track, packet, meta);
			let packetData = packet.data;
			if (track.source._codec === "prores") {
				if (packetData.byteLength < 8) throw new Error("ProRes packet too small, expected at least 8 bytes.");
				packetData = packetData.subarray(8);
			}
			const isKeyFrame = packet.type === "key";
			this.validateTimestamp(trackData.track, packet.timestamp, isKeyFrame);
			let timestamp = packet.timestamp;
			let duration = packet.duration;
			if (track.metadata.frameRate !== void 0) {
				timestamp = roundToDivisor(timestamp, track.metadata.frameRate);
				duration = roundToDivisor(duration, track.metadata.frameRate);
			}
			const additions = trackData.info.alphaMode ? packet.sideData.alpha ?? null : null;
			const videoChunk = this.createInternalChunk(packetData, timestamp, duration, packet.type, additions);
			if (track.source._codec === "vp9") this.fixVP9ColorSpace(trackData, videoChunk);
			trackData.chunkQueue.push(videoChunk);
			await this.interleaveChunks();
		} finally {
			release();
		}
	}
	async addEncodedAudioPacket(track, packet, meta) {
		const release = await this.mutex.acquire();
		try {
			const trackData = this.getAudioTrackData(track, packet, meta);
			let packetData = packet.data;
			if (trackData.info.requiresAdtsStripping) {
				const adtsFrame = readAdtsFrameHeader(FileSlice.tempFromBytes(packetData));
				if (!adtsFrame) throw new Error("Expected ADTS frame, didn't get one.");
				const headerLength = adtsFrame.crcCheck === null ? MIN_ADTS_FRAME_HEADER_SIZE : MAX_ADTS_FRAME_HEADER_SIZE;
				packetData = packetData.subarray(headerLength);
			}
			const isKeyFrame = packet.type === "key";
			this.validateTimestamp(trackData.track, packet.timestamp, isKeyFrame);
			const audioChunk = this.createInternalChunk(packetData, packet.timestamp, packet.duration, packet.type);
			trackData.chunkQueue.push(audioChunk);
			await this.interleaveChunks();
		} finally {
			release();
		}
	}
	async addSubtitleCue(track, cue, meta) {
		const release = await this.mutex.acquire();
		try {
			const trackData = this.getSubtitleTrackData(track, meta);
			this.validateTimestamp(trackData.track, cue.timestamp, true);
			let bodyText = cue.text;
			const timestampMs = Math.round(cue.timestamp * 1e3);
			inlineTimestampRegex.lastIndex = 0;
			bodyText = bodyText.replace(inlineTimestampRegex, (match) => {
				return `<${formatSubtitleTimestamp(parseSubtitleTimestamp(match.slice(1, -1)) - timestampMs)}>`;
			});
			const body = textEncoder.encode(bodyText);
			const additions = `${cue.settings ?? ""}\n${cue.identifier ?? ""}\n${cue.notes ?? ""}`;
			const subtitleChunk = this.createInternalChunk(body, cue.timestamp, cue.duration, "key", additions.trim() ? textEncoder.encode(additions) : null);
			trackData.chunkQueue.push(subtitleChunk);
			await this.interleaveChunks();
		} finally {
			release();
		}
	}
	async interleaveChunks(isFinalCall = false) {
		if (!isFinalCall && !this.allTracksAreKnown()) return;
		outer: while (true) {
			let trackWithMinTimestamp = null;
			let minTimestamp = Infinity;
			for (const trackData of this.trackDatas) {
				if (!isFinalCall && trackData.chunkQueue.length === 0 && !trackData.closed) break outer;
				if (trackData.chunkQueue.length > 0 && trackData.chunkQueue[0].timestamp < minTimestamp) {
					trackWithMinTimestamp = trackData;
					minTimestamp = trackData.chunkQueue[0].timestamp;
				}
			}
			if (!trackWithMinTimestamp) break;
			const chunk = trackWithMinTimestamp.chunkQueue.shift();
			this.writeBlock(trackWithMinTimestamp, chunk);
		}
		if (!isFinalCall) await this.writer.flush();
	}
	/**
	* Due to [a bug in Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1377842), VP9 streams often
	* lack color space information. This method patches in that information.
	*/
	fixVP9ColorSpace(trackData, chunk) {
		if (chunk.type !== "key") return;
		if (!trackData.info.decoderConfig.colorSpace || !trackData.info.decoderConfig.colorSpace.matrix) return;
		const bitstream = new Bitstream$1(chunk.data);
		bitstream.skipBits(2);
		const profileLowBit = bitstream.readBits(1);
		const profile = (bitstream.readBits(1) << 1) + profileLowBit;
		if (profile === 3) bitstream.skipBits(1);
		if (bitstream.readBits(1)) return;
		if (bitstream.readBits(1) !== 0) return;
		bitstream.skipBits(2);
		if (bitstream.readBits(24) !== 4817730) return;
		if (profile >= 2) bitstream.skipBits(1);
		const colorSpaceID = {
			rgb: 7,
			bt709: 2,
			bt470bg: 1,
			smpte170m: 3
		}[trackData.info.decoderConfig.colorSpace.matrix];
		writeBits(chunk.data, bitstream.pos, bitstream.pos + 3, colorSpaceID);
	}
	/** Converts a read-only external chunk into an internal one for easier use. */
	createInternalChunk(data, timestamp, duration, type, additions = null) {
		return {
			data,
			type,
			timestamp,
			duration,
			additions
		};
	}
	/** Writes a block containing media data to the file. */
	writeBlock(trackData, chunk) {
		if (!this.segment) this.createSegment();
		const msTimestamp = Math.round(1e3 * chunk.timestamp);
		const keyFrameQueuedEverywhere = this.trackDatas.every((otherTrackData) => {
			if (trackData === otherTrackData) return chunk.type === "key";
			const firstQueuedSample = otherTrackData.chunkQueue[0];
			if (firstQueuedSample) return firstQueuedSample.type === "key";
			return otherTrackData.closed;
		});
		let shouldCreateNewCluster = false;
		if (!this.currentCluster) shouldCreateNewCluster = true;
		else {
			assert$3(this.currentClusterStartMsTimestamp !== null);
			assert$3(this.currentClusterMaxMsTimestamp !== null);
			const relativeTimestamp$1 = msTimestamp - this.currentClusterStartMsTimestamp;
			shouldCreateNewCluster = keyFrameQueuedEverywhere && msTimestamp > this.currentClusterMaxMsTimestamp && relativeTimestamp$1 >= 1e3 * (this.format._options.minimumClusterDuration ?? 1) || relativeTimestamp$1 > MAX_CLUSTER_TIMESTAMP_MS;
		}
		if (shouldCreateNewCluster) this.createNewCluster(msTimestamp);
		const relativeTimestamp = msTimestamp - this.currentClusterStartMsTimestamp;
		if (relativeTimestamp < MIN_CLUSTER_TIMESTAMP_MS) return;
		const prelude = new Uint8Array(4);
		const view$1 = new DataView(prelude.buffer);
		view$1.setUint8(0, 128 | trackData.track.id);
		view$1.setInt16(1, relativeTimestamp, false);
		const msDuration = Math.round(1e3 * chunk.duration);
		if (!(!!chunk.additions || trackData.type === "subtitle")) {
			view$1.setUint8(3, Number(chunk.type === "key") << 7);
			const simpleBlock = {
				id: EBMLId.SimpleBlock,
				data: [prelude, chunk.data]
			};
			this.ebmlWriter.writeEBML(simpleBlock);
		} else {
			const blockGroup = {
				id: EBMLId.BlockGroup,
				data: [
					{
						id: EBMLId.Block,
						data: [prelude, chunk.data]
					},
					chunk.type === "delta" ? {
						id: EBMLId.ReferenceBlock,
						data: new EBMLSignedInt(trackData.lastWrittenMsTimestamp - msTimestamp)
					} : null,
					chunk.additions ? {
						id: EBMLId.BlockAdditions,
						data: [{
							id: EBMLId.BlockMore,
							data: [{
								id: EBMLId.BlockAddID,
								data: 1
							}, {
								id: EBMLId.BlockAdditional,
								data: chunk.additions
							}]
						}]
					} : null,
					msDuration > 0 ? {
						id: EBMLId.BlockDuration,
						data: msDuration
					} : null
				]
			};
			this.ebmlWriter.writeEBML(blockGroup);
		}
		this.startTimestamp = Math.min(this.startTimestamp, msTimestamp);
		this.endTimestamp = Math.max(this.endTimestamp, msTimestamp + msDuration);
		trackData.lastWrittenMsTimestamp = msTimestamp;
		if (!this.trackDatasInCurrentCluster.has(trackData)) this.trackDatasInCurrentCluster.set(trackData, { firstMsTimestamp: msTimestamp });
		this.currentClusterMaxMsTimestamp = Math.max(this.currentClusterMaxMsTimestamp, msTimestamp);
	}
	/** Creates a new Cluster element to contain media chunks. */
	createNewCluster(msTimestamp) {
		if (this.currentCluster) this.finalizeCurrentCluster();
		if (this.format._options.onCluster) this.writer.startTrackingWrites();
		this.currentCluster = {
			id: EBMLId.Cluster,
			size: this.format._options.appendOnly ? -1 : CLUSTER_SIZE_BYTES,
			data: [{
				id: EBMLId.Timestamp,
				data: msTimestamp
			}]
		};
		this.ebmlWriter.writeEBML(this.currentCluster);
		this.currentClusterStartMsTimestamp = msTimestamp;
		this.currentClusterMaxMsTimestamp = msTimestamp;
		this.trackDatasInCurrentCluster.clear();
	}
	finalizeCurrentCluster() {
		assert$3(this.currentCluster);
		if (!this.format._options.appendOnly) {
			const clusterSize = this.writer.getPos() - this.ebmlWriter.dataOffsets.get(this.currentCluster);
			const endPos = this.writer.getPos();
			this.writer.seek(this.ebmlWriter.offsets.get(this.currentCluster) + 4);
			this.ebmlWriter.writeVarInt(clusterSize, CLUSTER_SIZE_BYTES);
			this.writer.seek(endPos);
		}
		if (this.format._options.onCluster) {
			assert$3(this.currentClusterStartMsTimestamp !== null);
			const { data, start } = this.writer.stopTrackingWrites();
			this.format._options.onCluster(data, start, this.currentClusterStartMsTimestamp / 1e3);
		}
		const clusterOffsetFromSegment = this.ebmlWriter.offsets.get(this.currentCluster) - this.segmentDataOffset;
		const groupedByTimestamp = /* @__PURE__ */ new Map();
		for (const [trackData, { firstMsTimestamp }] of this.trackDatasInCurrentCluster) {
			if (!groupedByTimestamp.has(firstMsTimestamp)) groupedByTimestamp.set(firstMsTimestamp, []);
			groupedByTimestamp.get(firstMsTimestamp).push(trackData);
		}
		const groupedAndSortedByTimestamp = [...groupedByTimestamp.entries()].sort((a, b$1) => a[0] - b$1[0]);
		for (const [msTimestamp, trackDatas] of groupedAndSortedByTimestamp) {
			assert$3(this.cues);
			this.cues.data.push({
				id: EBMLId.CuePoint,
				data: [{
					id: EBMLId.CueTime,
					data: msTimestamp
				}, ...trackDatas.map((trackData) => {
					return {
						id: EBMLId.CueTrackPositions,
						data: [{
							id: EBMLId.CueTrack,
							data: trackData.track.id
						}, {
							id: EBMLId.CueClusterPosition,
							data: clusterOffsetFromSegment
						}]
					};
				})]
			});
		}
	}
	async onTrackClose(track) {
		const release = await this.mutex.acquire();
		const trackData = this.trackDatas.find((x$1) => x$1.track === track);
		if (trackData) trackData.closed = true;
		if (this.allTracksAreKnown()) this.allTracksKnown.resolve();
		await this.interleaveChunks();
		release();
	}
	/** Finalizes the file, making it ready for use. Must be called after all media chunks have been added. */
	async finalize() {
		const release = await this.mutex.acquire();
		this.allTracksKnown.resolve();
		for (const trackData of this.trackDatas) trackData.closed = true;
		if (!this.segment) this.createSegment();
		await this.interleaveChunks(true);
		if (this.currentCluster) this.finalizeCurrentCluster();
		assert$3(this.cues);
		this.ebmlWriter.writeEBML(this.cues);
		if (!this.format._options.appendOnly) {
			const segmentSize = this.writer.getPos() - this.segmentDataOffset;
			this.writer.seek(this.ebmlWriter.offsets.get(this.segment) + 4);
			this.ebmlWriter.writeVarInt(segmentSize, SEGMENT_SIZE_BYTES);
			const duration = this.startTimestamp === Infinity ? 0 : this.endTimestamp - this.startTimestamp;
			this.segmentDuration.data = new EBMLFloat64(duration);
			this.writer.seek(this.ebmlWriter.offsets.get(this.segmentDuration));
			this.ebmlWriter.writeEBML(this.segmentDuration);
			assert$3(this.seekHead);
			this.writer.seek(this.ebmlWriter.offsets.get(this.seekHead));
			this.maybeCreateSeekHead(true);
			this.ebmlWriter.writeEBML(this.seekHead);
		}
		release();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/mp3/mp3-writer.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var Mp3Writer = class {
	constructor(writer) {
		this.writer = writer;
		this.helper = new Uint8Array(8);
		this.helperView = new DataView(this.helper.buffer);
	}
	writeU32(value) {
		this.helperView.setUint32(0, value, false);
		this.writer.write(this.helper.subarray(0, 4));
	}
	writeXingFrame(data) {
		const startPos = this.writer.getPos();
		const firstByte = 255;
		const secondByte = 224 | data.mpegVersionId << 3 | data.layer << 1;
		let lowSamplingFrequency;
		if (data.mpegVersionId & 2) lowSamplingFrequency = data.mpegVersionId & 1 ? 0 : 1;
		else lowSamplingFrequency = 1;
		const padding = 0;
		const neededBytes = 155;
		let bitrateIndex = -1;
		const bitrateOffset = lowSamplingFrequency * 16 * 4 + data.layer * 16;
		for (let i = 0; i < 16; i++) {
			const kbr = KILOBIT_RATES[bitrateOffset + i];
			if (computeMp3FrameSize(lowSamplingFrequency, data.layer, 1e3 * kbr, data.sampleRate, padding) >= neededBytes) {
				bitrateIndex = i;
				break;
			}
		}
		if (bitrateIndex === -1) throw new Error("No suitable bitrate found.");
		const thirdByte = bitrateIndex << 4 | data.frequencyIndex << 2 | padding << 1;
		const fourthByte = data.channel << 6 | data.modeExtension << 4 | data.copyright << 3 | data.original << 2 | data.emphasis;
		this.helper[0] = firstByte;
		this.helper[1] = secondByte;
		this.helper[2] = thirdByte;
		this.helper[3] = fourthByte;
		this.writer.write(this.helper.subarray(0, 4));
		const xingOffset = getXingOffset(data.mpegVersionId, data.channel);
		this.writer.seek(startPos + xingOffset);
		this.writeU32(XING);
		let flags = 0;
		if (data.frameCount !== null) flags |= XingFlags.FrameCount;
		if (data.fileSize !== null) flags |= XingFlags.FileSize;
		if (data.toc !== null) flags |= XingFlags.Toc;
		this.writeU32(flags);
		this.writeU32(data.frameCount ?? 0);
		this.writeU32(data.fileSize ?? 0);
		this.writer.write(data.toc ?? new Uint8Array(100));
		const kilobitRate = KILOBIT_RATES[bitrateOffset + bitrateIndex];
		const frameSize = computeMp3FrameSize(lowSamplingFrequency, data.layer, 1e3 * kilobitRate, data.sampleRate, padding);
		this.writer.seek(startPos + frameSize);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/mp3/mp3-muxer.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var Mp3Muxer = class extends Muxer {
	constructor(output, format) {
		super(output);
		this.xingFrameData = null;
		this.frameCount = 0;
		this.framePositions = [];
		this.xingFramePos = null;
		this.format = format;
	}
	async start() {
		const release = await this.mutex.acquire();
		this.writer = await this.output._getRootWriter(this.format._options.xingHeader === false);
		this.mp3Writer = new Mp3Writer(this.writer);
		if (!metadataTagsAreEmpty(this.output._metadataTags)) new Id3V2Writer(this.writer).writeId3V2Tag(this.output._metadataTags);
		release();
	}
	async getMimeType() {
		return "audio/mpeg";
	}
	async addEncodedVideoPacket() {
		throw new Error("MP3 does not support video.");
	}
	async addEncodedAudioPacket(track, packet) {
		const release = await this.mutex.acquire();
		try {
			const writeXingHeader = this.format._options.xingHeader !== false;
			if (!this.xingFrameData && writeXingHeader) {
				const view$1 = toDataView$1(packet.data);
				if (view$1.byteLength < 4) throw new Error("Invalid MP3 header in sample.");
				const header = readMp3FrameHeader(view$1.getUint32(0, false), null).header;
				if (!header) throw new Error("Invalid MP3 header in sample.");
				const xingOffset = getXingOffset(header.mpegVersionId, header.channel);
				if (view$1.byteLength >= xingOffset + 4) {
					const word = view$1.getUint32(xingOffset, false);
					if (word === XING || word === INFO) return;
				}
				this.xingFrameData = {
					mpegVersionId: header.mpegVersionId,
					layer: header.layer,
					frequencyIndex: header.frequencyIndex,
					sampleRate: header.sampleRate,
					channel: header.channel,
					modeExtension: header.modeExtension,
					copyright: header.copyright,
					original: header.original,
					emphasis: header.emphasis,
					frameCount: null,
					fileSize: null,
					toc: null
				};
				this.xingFramePos = this.writer.getPos();
				this.mp3Writer.writeXingFrame(this.xingFrameData);
				this.frameCount++;
			}
			this.validateTimestamp(track, packet.timestamp, packet.type === "key");
			if (writeXingHeader) this.framePositions.push(this.writer.getPos());
			this.writer.write(packet.data);
			this.frameCount++;
			await this.writer.flush();
		} finally {
			release();
		}
	}
	async addSubtitleCue() {
		throw new Error("MP3 does not support subtitles.");
	}
	async finalize() {
		if (!this.xingFrameData || this.xingFramePos === null) return;
		const release = await this.mutex.acquire();
		const audioDataEndPos = this.writer.getPos() - this.xingFramePos;
		this.writer.seek(this.xingFramePos);
		const toc = new Uint8Array(100);
		for (let i = 0; i < 100; i++) {
			const index = Math.floor(this.framePositions.length * (i / 100));
			toc[i] = 256 * ((this.framePositions[index] - this.xingFramePos) / audioDataEndPos);
		}
		this.xingFrameData.frameCount = this.frameCount;
		this.xingFrameData.fileSize = audioDataEndPos;
		this.xingFrameData.toc = toc;
		if (this.format._options.onXingFrame) this.writer.startTrackingWrites();
		this.mp3Writer.writeXingFrame(this.xingFrameData);
		if (this.format._options.onXingFrame) {
			const { data, start } = this.writer.stopTrackingWrites();
			this.format._options.onXingFrame(data, start);
		}
		release();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/resample.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
/**
* Utility class to handle audio resampling, handling both sample rate resampling as well as channel up/downmixing.
* The advantage over doing this manually rather than using OfflineAudioContext to do it for us is the artifact-free
* handling of putting multiple resampled audio samples back to back, which produces flaky results using
* OfflineAudioContext.
*/
var AudioResampler = class {
	constructor(options) {
		this.sourceSampleRate = null;
		this.sourceNumberOfChannels = null;
		this.startTime = null;
		/** Start frame of current buffer */
		this.bufferStartFrame = 0;
		/** The highest index written to in the current buffer */
		this.maxWrittenFrame = null;
		this.targetSampleRate = options.targetSampleRate;
		this.targetNumberOfChannels = options.targetNumberOfChannels;
		this.onSample = options.onSample;
		this.bufferSizeInFrames = Math.floor(this.targetSampleRate * 5);
		this.bufferSizeInSamples = this.bufferSizeInFrames * this.targetNumberOfChannels;
		this.outputBuffer = new Float32Array(this.bufferSizeInSamples);
	}
	/**
	* Sets up the channel mixer to handle up/downmixing in the case where input and output channel counts don't match.
	*/
	doChannelMixerSetup() {
		assert$3(this.sourceNumberOfChannels !== null);
		const sourceNum = this.sourceNumberOfChannels;
		const targetNum = this.targetNumberOfChannels;
		if (sourceNum === 1 && targetNum === 2) this.channelMixer = (sourceData, sourceFrameIndex) => {
			return sourceData[sourceFrameIndex * sourceNum];
		};
		else if (sourceNum === 1 && targetNum === 4) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			return sourceData[sourceFrameIndex * sourceNum] * +(targetChannelIndex < 2);
		};
		else if (sourceNum === 1 && targetNum === 6) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			return sourceData[sourceFrameIndex * sourceNum] * +(targetChannelIndex === 2);
		};
		else if (sourceNum === 2 && targetNum === 1) this.channelMixer = (sourceData, sourceFrameIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			return .5 * (sourceData[baseIdx] + sourceData[baseIdx + 1]);
		};
		else if (sourceNum === 2 && targetNum === 4) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			return sourceData[sourceFrameIndex * sourceNum + targetChannelIndex] * +(targetChannelIndex < 2);
		};
		else if (sourceNum === 2 && targetNum === 6) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			return sourceData[sourceFrameIndex * sourceNum + targetChannelIndex] * +(targetChannelIndex < 2);
		};
		else if (sourceNum === 4 && targetNum === 1) this.channelMixer = (sourceData, sourceFrameIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			return .25 * (sourceData[baseIdx] + sourceData[baseIdx + 1] + sourceData[baseIdx + 2] + sourceData[baseIdx + 3]);
		};
		else if (sourceNum === 4 && targetNum === 2) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			return .5 * (sourceData[baseIdx + targetChannelIndex] + sourceData[baseIdx + targetChannelIndex + 2]);
		};
		else if (sourceNum === 4 && targetNum === 6) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			if (targetChannelIndex < 2) return sourceData[baseIdx + targetChannelIndex];
			if (targetChannelIndex === 2 || targetChannelIndex === 3) return 0;
			return sourceData[baseIdx + targetChannelIndex - 2];
		};
		else if (sourceNum === 6 && targetNum === 1) this.channelMixer = (sourceData, sourceFrameIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			return Math.SQRT1_2 * (sourceData[baseIdx] + sourceData[baseIdx + 1]) + sourceData[baseIdx + 2] + .5 * (sourceData[baseIdx + 4] + sourceData[baseIdx + 5]);
		};
		else if (sourceNum === 6 && targetNum === 2) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			return sourceData[baseIdx + targetChannelIndex] + Math.SQRT1_2 * (sourceData[baseIdx + 2] + sourceData[baseIdx + targetChannelIndex + 4]);
		};
		else if (sourceNum === 6 && targetNum === 4) this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			const baseIdx = sourceFrameIndex * sourceNum;
			if (targetChannelIndex < 2) return sourceData[baseIdx + targetChannelIndex] + Math.SQRT1_2 * sourceData[baseIdx + 2];
			return sourceData[baseIdx + targetChannelIndex + 2];
		};
		else this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
			return targetChannelIndex < sourceNum ? sourceData[sourceFrameIndex * sourceNum + targetChannelIndex] : 0;
		};
	}
	ensureTempBufferSize(requiredSamples) {
		let length = this.tempSourceBuffer.length;
		while (length < requiredSamples) length *= 2;
		if (length !== this.tempSourceBuffer.length) {
			const newBuffer = new Float32Array(length);
			newBuffer.set(this.tempSourceBuffer);
			this.tempSourceBuffer = newBuffer;
		}
	}
	async add(audioSample) {
		if (this.sourceSampleRate === null) {
			this.sourceSampleRate = audioSample.sampleRate;
			this.sourceNumberOfChannels = audioSample.numberOfChannels;
			this.startTime = audioSample.timestamp;
			this.tempSourceBuffer = new Float32Array(this.sourceSampleRate * this.sourceNumberOfChannels);
			this.doChannelMixerSetup();
		}
		assert$3(this.startTime !== null);
		const requiredSamples = audioSample.numberOfFrames * audioSample.numberOfChannels;
		this.ensureTempBufferSize(requiredSamples);
		const sourceDataSize = audioSample.allocationSize({
			planeIndex: 0,
			format: "f32"
		});
		const sourceView = new Float32Array(this.tempSourceBuffer.buffer, 0, sourceDataSize / 4);
		audioSample.copyTo(sourceView, {
			planeIndex: 0,
			format: "f32"
		});
		const inputStartTime = audioSample.timestamp - this.startTime;
		const inputEndTime = inputStartTime + audioSample.duration;
		const outputStartFrame = Math.floor((inputStartTime - 1 / this.sourceSampleRate) * this.targetSampleRate) + 1;
		const outputEndFrame = Math.ceil(inputEndTime * this.targetSampleRate);
		for (let outputFrame = outputStartFrame; outputFrame < outputEndFrame; outputFrame++) {
			if (outputFrame < this.bufferStartFrame) continue;
			while (outputFrame >= this.bufferStartFrame + this.bufferSizeInFrames) {
				await this.finalizeCurrentBuffer();
				this.bufferStartFrame += this.bufferSizeInFrames;
			}
			const bufferFrameIndex = outputFrame - this.bufferStartFrame;
			assert$3(bufferFrameIndex < this.bufferSizeInFrames);
			const sourcePosition = (outputFrame / this.targetSampleRate - inputStartTime) * this.sourceSampleRate;
			const sourceLowerFrame = Math.floor(sourcePosition);
			const sourceUpperFrame = Math.ceil(sourcePosition);
			const fraction = sourcePosition - sourceLowerFrame;
			for (let targetChannel = 0; targetChannel < this.targetNumberOfChannels; targetChannel++) {
				let lowerSample = 0;
				let upperSample = 0;
				if (sourceLowerFrame >= 0 && sourceLowerFrame < audioSample.numberOfFrames) lowerSample = this.channelMixer(sourceView, sourceLowerFrame, targetChannel);
				if (sourceUpperFrame >= 0 && sourceUpperFrame < audioSample.numberOfFrames) upperSample = this.channelMixer(sourceView, sourceUpperFrame, targetChannel);
				const outputSample = lowerSample + fraction * (upperSample - lowerSample);
				const outputIndex = bufferFrameIndex * this.targetNumberOfChannels + targetChannel;
				this.outputBuffer[outputIndex] += outputSample;
			}
			if (this.maxWrittenFrame === null) this.maxWrittenFrame = bufferFrameIndex;
			else this.maxWrittenFrame = Math.max(this.maxWrittenFrame, bufferFrameIndex);
		}
	}
	async finalizeCurrentBuffer() {
		if (this.maxWrittenFrame === null) return;
		assert$3(this.startTime !== null);
		const samplesWritten = (this.maxWrittenFrame + 1) * this.targetNumberOfChannels;
		const outputData = new Float32Array(samplesWritten);
		outputData.set(this.outputBuffer.subarray(0, samplesWritten));
		const audioSample = new AudioSample({
			format: "f32",
			sampleRate: this.targetSampleRate,
			numberOfChannels: this.targetNumberOfChannels,
			timestamp: this.startTime + this.bufferStartFrame / this.targetSampleRate,
			data: outputData
		});
		await this.onSample(audioSample);
		this.outputBuffer.fill(0);
		this.maxWrittenFrame = null;
	}
	finalize() {
		return this.finalizeCurrentBuffer();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/media-source.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
/**
* Base class for media sources. Media sources are used to add media samples to an output file.
* @group Media sources
* @public
*/
var MediaSource = class {
	constructor() {
		/** @internal */
		this._connectedTrack = null;
		/** @internal */
		this._closingPromise = null;
		/** @internal */
		this._closed = false;
	}
	/** @internal */
	_ensureValidAdd() {
		if (!this._connectedTrack) throw new Error("Source is not connected to an output track.");
		if (this._connectedTrack.output.state === "canceled") throw new Error("Output has been canceled.");
		if (this._connectedTrack.output.state === "finalizing" || this._connectedTrack.output.state === "finalized") throw new Error("Output has been finalized.");
		if (this._connectedTrack.output.state === "pending") throw new Error("Output has not started.");
		if (this._closed) throw new Error("Source is closed.");
	}
	/** @internal */
	async _start() {}
	/** @internal */
	async _flushAndClose(forceClose) {}
	/**
	* Closes this source. This prevents future samples from being added and signals to the output file that no further
	* samples will come in for this track. Calling `.close()` is optional but recommended after adding the
	* last sample - for improved performance and reduced memory usage.
	*/
	close() {
		if (this._closingPromise) return;
		const connectedTrack = this._connectedTrack;
		if (!connectedTrack) throw new Error("Cannot call close without connecting the source to an output track.");
		if (connectedTrack.output.state === "pending") throw new Error("Cannot call close before output has been started.");
		this._closingPromise = (async () => {
			await this._flushAndClose(false);
			this._closed = true;
			if (connectedTrack.output.state === "finalizing" || connectedTrack.output.state === "finalized") return;
			connectedTrack.output._muxer.onTrackClose(connectedTrack);
		})();
	}
	/** @internal */
	async _flushOrWaitForOngoingClose(forceClose) {
		return this._closingPromise ??= (async () => {
			await this._flushAndClose(forceClose);
			this._closed = true;
		})();
	}
};
/**
* Base class for video sources - sources for video tracks.
* @group Media sources
* @public
*/
var VideoSource = class extends MediaSource {
	/** Internal constructor. */
	constructor(codec) {
		super();
		/** @internal */
		this._connectedTrack = null;
		if (!VIDEO_CODECS.includes(codec)) throw new TypeError(`Invalid video codec '${codec}'. Must be one of: ${VIDEO_CODECS.join(", ")}.`);
		this._codec = codec;
	}
};
const maybeEnsureIsKeyPacket = (track, packet) => {
	if (track.metadata.hasOnlyKeyPackets && packet.type !== "key") throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
var VideoEncoderWrapper = class {
	setError(error) {
		if (!this.errorSet) {
			this.error = error;
			this.errorSet = true;
		}
	}
	constructor(source, encodingConfig) {
		this.source = source;
		this.encodingConfig = encodingConfig;
		this.ensureEncoderPromise = null;
		this.encoderInitialized = false;
		this.encoder = null;
		this.muxer = null;
		this.lastMultipleOfKeyFrameInterval = -1;
		this.emittedEncoderPackets = 0;
		this.codedWidth = null;
		this.codedHeight = null;
		this.outputWidth = null;
		this.outputHeight = null;
		this.frameRateLastSample = null;
		this.frameRateLastTimestamp = null;
		this.frameRateLastEndTimestamp = null;
		this.preciseTimings = [];
		this.customEncoder = null;
		this.customEncoderCallSerializer = new CallSerializer();
		this.customEncoderQueueSize = 0;
		this.alphaEncoder = null;
		this.splitter = null;
		this.splitterCreationFailed = false;
		this.alphaFrameQueue = [];
		/**
		* Encoders typically throw their errors "out of band", meaning asynchronously in some other execution context.
		* However, we want to surface these errors to the user within the normal control flow, so they don't go uncaught.
		* So, we keep track of the encoder error and throw it as soon as we get the chance.
		*/
		this.error = null;
		this.errorSet = false;
		this.lastMuxerPromise = Promise.resolve();
		this.closed = false;
	}
	async add(videoSample, shouldClose, encodeOptions) {
		const originalSample = videoSample;
		try {
			this.checkForEncoderError();
			this.source._ensureValidAdd();
			const config = this.encodingConfig;
			const sizeChangeBehavior = config.sizeChangeBehavior ?? "deny";
			let isSizeChange = false;
			if (this.codedWidth !== null && this.codedHeight !== null) {
				if (videoSample.codedWidth !== this.codedWidth || videoSample.codedHeight !== this.codedHeight) {
					isSizeChange = true;
					if (sizeChangeBehavior === "deny") throw new Error(`Video sample size must remain constant. Expected ${this.codedWidth}x${this.codedHeight}, got ${videoSample.codedWidth}x${videoSample.codedHeight}. To allow the sample size to change over time, set \`sizeChangeBehavior\` to a value other than 'deny' in the encoding options.`);
				}
			} else {
				this.codedWidth = videoSample.codedWidth;
				this.codedHeight = videoSample.codedHeight;
			}
			if (config.transform?.width !== void 0 || config.transform?.height !== void 0 || config.transform?.rotate !== void 0 || config.transform?.crop !== void 0 || config.transform?.force === true || isSizeChange && sizeChangeBehavior !== "passThrough") {
				let targetWidth = config.transform?.width;
				let targetHeight = config.transform?.height;
				let appliedFit = config.transform?.fit ?? "fill";
				if (isSizeChange && sizeChangeBehavior !== "passThrough") {
					assert$3(this.outputWidth);
					assert$3(this.outputHeight);
					assert$3(sizeChangeBehavior !== "deny");
					targetWidth = this.outputWidth;
					targetHeight = this.outputHeight;
					appliedFit = sizeChangeBehavior;
				}
				const transformed = await videoSample.transform({
					width: targetWidth,
					height: targetHeight,
					roundDimensionsTo: 2,
					crop: config.transform?.crop,
					rotate: config.transform?.rotate,
					fit: appliedFit,
					alpha: config.alpha
				});
				if (this.outputWidth === null || this.outputHeight === null) {
					this.outputWidth = transformed.displayWidth;
					this.outputHeight = transformed.displayHeight;
				}
				if (shouldClose) videoSample.close();
				videoSample = transformed;
				shouldClose = true;
			} else if (this.outputWidth === null || this.outputHeight === null) {
				this.outputWidth = videoSample.codedWidth;
				this.outputHeight = videoSample.codedHeight;
			}
			const frameRate = config.transform?.frameRate;
			if (frameRate !== void 0) {
				const originalEndTimestamp = videoSample.timestamp + videoSample.duration;
				const alignedTimestamp = floorToDivisor(videoSample.timestamp, frameRate);
				if (this.frameRateLastSample !== null) if (alignedTimestamp <= this.frameRateLastTimestamp) {
					this.frameRateLastSample.close();
					this.frameRateLastSample = videoSample.clone();
					this.frameRateLastEndTimestamp = originalEndTimestamp;
					return;
				} else await this.padFrameRate(alignedTimestamp, encodeOptions);
				if (videoSample === originalSample) {
					videoSample = videoSample.clone();
					shouldClose = true;
				}
				videoSample.setTimestamp(alignedTimestamp);
				videoSample.setDuration(1 / frameRate);
				this.frameRateLastSample?.close();
				this.frameRateLastSample = videoSample.clone();
				this.frameRateLastTimestamp = alignedTimestamp;
				this.frameRateLastEndTimestamp = originalEndTimestamp;
			}
			await this.processAndEncode(videoSample, encodeOptions);
		} finally {
			if (shouldClose) videoSample.close();
		}
	}
	/**
	* Runs the process function (if any) and encodes the resulting samples.
	*/
	async processAndEncode(videoSample, encodeOptions) {
		const config = this.encodingConfig;
		let samplesToEncode;
		if (config.transform?.process) {
			let processed = config.transform.process(videoSample);
			if (processed instanceof Promise) processed = await processed;
			if (processed === null) return;
			if (!Array.isArray(processed)) processed = [processed];
			samplesToEncode = processed.map((x$1) => {
				if (x$1 instanceof VideoSample) return x$1;
				if (typeof VideoFrame !== "undefined" && x$1 instanceof VideoFrame) return new VideoSample(x$1);
				return new VideoSample(x$1, {
					timestamp: videoSample.timestamp,
					duration: videoSample.duration
				});
			});
		} else samplesToEncode = [videoSample];
		try {
			for (const sampleToEncode of samplesToEncode) {
				if (!this.encoderInitialized) {
					if (!this.ensureEncoderPromise) this.ensureEncoder(sampleToEncode);
					if (!this.encoderInitialized) await this.ensureEncoderPromise;
				}
				assert$3(this.encoderInitialized);
				if (this.closed) break;
				const keyFrameInterval = this.encodingConfig.keyFrameInterval ?? 2;
				const multipleOfKeyFrameInterval = Math.floor(sampleToEncode.timestamp / keyFrameInterval);
				const mergedEncodeOptions = {
					...sampleToEncode.encodeOptions,
					...encodeOptions
				};
				const finalEncodeOptions = {
					...mergedEncodeOptions,
					keyFrame: mergedEncodeOptions.keyFrame !== void 0 ? mergedEncodeOptions.keyFrame : keyFrameInterval === 0 || multipleOfKeyFrameInterval !== this.lastMultipleOfKeyFrameInterval
				};
				this.lastMultipleOfKeyFrameInterval = multipleOfKeyFrameInterval;
				this.encodingConfig.onEncodedSample?.(sampleToEncode);
				if (this.customEncoder) {
					this.customEncoderQueueSize++;
					const clonedSample = sampleToEncode.clone();
					const promise = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(clonedSample, finalEncodeOptions)).catch((error) => this.setError(error)).finally(() => {
						this.customEncoderQueueSize--;
						clonedSample.close();
					});
					if (this.customEncoderQueueSize >= 4) await promise;
				} else {
					assert$3(this.encoder);
					const videoFrame = sampleToEncode.toVideoFrame();
					const preciseTimingIndex = binarySearchLessOrEqual$1(this.preciseTimings, videoFrame.timestamp, (x$1) => x$1.microsecondTimestamp);
					const existingEntry = preciseTimingIndex !== -1 ? this.preciseTimings[preciseTimingIndex] : null;
					if (existingEntry && existingEntry.microsecondTimestamp === videoFrame.timestamp) {
						if (existingEntry.timestamp !== sampleToEncode.timestamp) existingEntry.timestampIsValid = false;
						if (existingEntry.duration !== sampleToEncode.duration) existingEntry.durationIsValid = false;
					} else {
						this.preciseTimings.splice(preciseTimingIndex + 1, 0, {
							microsecondTimestamp: videoFrame.timestamp,
							timestamp: sampleToEncode.timestamp,
							duration: sampleToEncode.duration,
							timestampIsValid: true,
							durationIsValid: true
						});
						if (this.preciseTimings.length > 128) this.preciseTimings.shift();
					}
					if (!this.alphaEncoder) {
						this.encoder.encode(videoFrame, finalEncodeOptions);
						videoFrame.close();
					} else if (!!videoFrame.format && !videoFrame.format.includes("A") || this.splitterCreationFailed) {
						this.alphaFrameQueue.push(null);
						this.encoder.encode(videoFrame, finalEncodeOptions);
						videoFrame.close();
					} else {
						if (!this.splitter) this.splitter = new ColorAlphaSplitter();
						const { colorFrame, alphaFrame } = await this.splitter.split(videoFrame);
						this.alphaFrameQueue.push(alphaFrame);
						this.encoder.encode(colorFrame, finalEncodeOptions);
						colorFrame.close();
					}
					if (this.encoder.encodeQueueSize >= 4) await new Promise((resolve$1) => this.encoder.addEventListener("dequeue", resolve$1, { once: true }));
				}
				await this.lastMuxerPromise;
			}
		} finally {
			for (const sample of samplesToEncode) if (sample !== videoSample) sample.close();
		}
	}
	/** Repeats the last frame rate sample to fill the gap up to the given timestamp. */
	async padFrameRate(until, encodeOptions) {
		const frameRate = this.encodingConfig.transform.frameRate;
		assert$3(this.frameRateLastSample);
		const frameDifference = Math.round((until - this.frameRateLastTimestamp) * frameRate);
		for (let i = 1; i < frameDifference; i++) {
			const sample = this.frameRateLastSample.clone();
			sample.setTimestamp(this.frameRateLastTimestamp + i / frameRate);
			sample.setDuration(1 / frameRate);
			await this.processAndEncode(sample, encodeOptions);
			sample.close();
		}
	}
	ensureEncoder(videoSample) {
		this.ensureEncoderPromise = (async () => {
			const encoderConfig = buildVideoEncoderConfig({
				...this.encodingConfig,
				width: videoSample.codedWidth,
				height: videoSample.codedHeight,
				squarePixelWidth: videoSample.squarePixelWidth,
				squarePixelHeight: videoSample.squarePixelHeight,
				framerate: this.source._connectedTrack?.metadata.frameRate
			});
			this.encodingConfig.onEncoderConfig?.(encoderConfig);
			const MatchingCustomEncoder = customVideoEncoders.find((x$1) => x$1.supports(this.encodingConfig.codec, encoderConfig));
			if (MatchingCustomEncoder) {
				this.customEncoder = new MatchingCustomEncoder();
				this.customEncoder.codec = this.encodingConfig.codec;
				this.customEncoder.config = encoderConfig;
				this.customEncoder.onPacket = (packet, meta) => {
					if (!(packet instanceof EncodedPacket)) throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
					if (meta !== void 0 && (!meta || typeof meta !== "object")) throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
					maybeEnsureIsKeyPacket(this.source._connectedTrack, packet);
					this.encodingConfig.onEncodedPacket?.(packet, meta);
					this.lastMuxerPromise = this.muxer.addEncodedVideoPacket(this.source._connectedTrack, packet, meta).catch((error) => {
						this.setError(error);
					});
				};
				this.customEncoder.onError = (error) => {
					this.setError(error);
				};
				await this.customEncoder.init();
			} else {
				if (typeof VideoEncoder === "undefined") throw new Error("VideoEncoder is not supported by this browser.");
				encoderConfig.alpha = "discard";
				if (this.encodingConfig.alpha === "keep") encoderConfig.latencyMode = "quality";
				if ((encoderConfig.width % 2 === 1 || encoderConfig.height % 2 === 1) && (this.encodingConfig.codec === "avc" || this.encodingConfig.codec === "hevc")) throw new Error(`The dimensions ${encoderConfig.width}x${encoderConfig.height} are not supported for codec '${this.encodingConfig.codec}'; both width and height must be even numbers. Make sure to round your dimensions to the nearest even number.`);
				if (!(await VideoEncoder.isConfigSupported(encoderConfig)).supported) throw new Error(`This specific encoder configuration (${encoderConfig.codec}, ${encoderConfig.bitrate} bps, ${encoderConfig.width}x${encoderConfig.height}, hardware acceleration: ${encoderConfig.hardwareAcceleration ?? "no-preference"}) is not supported by this browser. Consider using another codec or changing your video parameters.`);
				/** Queue of color chunks waiting for their alpha counterpart. */
				const colorChunkQueue = [];
				/** Each value is the number of encoded alpha chunks at which a null alpha chunk should be added. */
				const nullAlphaChunkQueue = [];
				let encodedAlphaChunkCount = 0;
				let alphaEncoderQueue = 0;
				const addPacket = (colorChunk, alphaChunk, meta) => {
					const sideData = {};
					if (alphaChunk) {
						const alphaData = new Uint8Array(alphaChunk.byteLength);
						alphaChunk.copyTo(alphaData);
						sideData.alpha = alphaData;
					}
					let packet = EncodedPacket.fromEncodedChunk(colorChunk, sideData);
					const preciseTimingIndex = binarySearchLessOrEqual$1(this.preciseTimings, colorChunk.timestamp, (x$1) => x$1.microsecondTimestamp);
					const entry = preciseTimingIndex !== -1 ? this.preciseTimings[preciseTimingIndex] : null;
					let actualType = null;
					if (this.emittedEncoderPackets === 0 && packet.type === "delta" && meta?.decoderConfig) actualType = determineVideoPacketType(this.encodingConfig.codec, meta.decoderConfig, packet.data);
					if (entry && entry.microsecondTimestamp === colorChunk.timestamp || actualType !== null) packet = packet.clone({
						timestamp: entry?.timestampIsValid ? entry.timestamp : void 0,
						duration: entry?.durationIsValid ? entry.duration : void 0,
						type: actualType ?? void 0
					});
					maybeEnsureIsKeyPacket(this.source._connectedTrack, packet);
					this.encodingConfig.onEncodedPacket?.(packet, meta);
					this.lastMuxerPromise = this.muxer.addEncodedVideoPacket(this.source._connectedTrack, packet, meta).catch((error) => {
						this.setError(error);
					});
					this.emittedEncoderPackets++;
				};
				const stack = (/* @__PURE__ */ new Error("Encoding error")).stack;
				this.encoder = new VideoEncoder({
					output: (chunk, meta) => {
						if (!this.alphaEncoder) {
							addPacket(chunk, null, meta);
							return;
						}
						const alphaFrame = this.alphaFrameQueue.shift();
						assert$3(alphaFrame !== void 0);
						if (alphaFrame) {
							this.alphaEncoder.encode(alphaFrame, { keyFrame: chunk.type === "key" });
							alphaEncoderQueue++;
							alphaFrame.close();
							colorChunkQueue.push({
								chunk,
								meta
							});
						} else if (alphaEncoderQueue === 0) addPacket(chunk, null, meta);
						else {
							nullAlphaChunkQueue.push(encodedAlphaChunkCount + alphaEncoderQueue);
							colorChunkQueue.push({
								chunk,
								meta
							});
						}
					},
					error: (error) => {
						error.stack = stack;
						this.setError(error);
					}
				});
				this.encoder.configure(encoderConfig);
				if (this.encodingConfig.alpha === "keep") {
					const stack$1 = (/* @__PURE__ */ new Error("Encoding error")).stack;
					this.alphaEncoder = new VideoEncoder({
						output: (chunk, meta) => {
							alphaEncoderQueue--;
							const colorChunk = colorChunkQueue.shift();
							assert$3(colorChunk !== void 0);
							addPacket(colorChunk.chunk, chunk, colorChunk.meta);
							encodedAlphaChunkCount++;
							while (nullAlphaChunkQueue.length > 0 && nullAlphaChunkQueue[0] === encodedAlphaChunkCount) {
								nullAlphaChunkQueue.shift();
								const colorChunk$1 = colorChunkQueue.shift();
								assert$3(colorChunk$1 !== void 0);
								addPacket(colorChunk$1.chunk, null, colorChunk$1.meta);
							}
						},
						error: (error) => {
							error.stack = stack$1;
							this.setError(error);
						}
					});
					this.alphaEncoder.configure(encoderConfig);
				}
			}
			assert$3(this.source._connectedTrack);
			this.muxer = this.source._connectedTrack.output._muxer;
			this.encoderInitialized = true;
		})();
	}
	async flushAndClose(forceClose) {
		if (!forceClose) this.checkForEncoderError();
		if (!forceClose && this.frameRateLastSample) {
			const frameRate = this.encodingConfig.transform.frameRate;
			const alignedEnd = floorToDivisor(this.frameRateLastEndTimestamp, frameRate);
			await this.padFrameRate(alignedEnd);
		}
		this.closed = true;
		this.frameRateLastSample?.close();
		this.frameRateLastSample = null;
		if (this.customEncoder) {
			if (!forceClose) this.customEncoderCallSerializer.call(() => this.customEncoder.flush());
			await this.customEncoderCallSerializer.call(() => this.customEncoder.close());
		} else if (this.encoder) {
			if (!forceClose) {
				await this.encoder.flush();
				await this.alphaEncoder?.flush();
				await wait(25);
			}
			if (this.encoder.state !== "closed") this.encoder.close();
			if (this.alphaEncoder && this.alphaEncoder.state !== "closed") this.alphaEncoder.close();
			this.alphaFrameQueue.forEach((x$1) => x$1?.close());
			this.splitter?.close();
		}
		if (!forceClose) this.checkForEncoderError();
	}
	getQueueSize() {
		if (this.customEncoder) return this.customEncoderQueueSize;
		else return this.encoder?.encodeQueueSize ?? 0;
	}
	checkForEncoderError() {
		if (this.errorSet) throw this.error;
	}
};
let splitterWorkerUrl = null;
/** Utility class for splitting a composite frame into separate color and alpha parts on the CPU in a worker. */
var ColorAlphaSplitter = class {
	constructor() {
		this.worker = null;
		this.pendingRequests = /* @__PURE__ */ new Map();
		this.nextRequestId = 0;
	}
	split(sourceFrame) {
		if (!this.worker) {
			if (!splitterWorkerUrl) {
				const blob = new Blob([`(${colorAlphaSplitterWorkerCode.toString()})()`], { type: "application/javascript" });
				splitterWorkerUrl = URL.createObjectURL(blob);
			}
			this.worker = new Worker(splitterWorkerUrl);
			this.worker.addEventListener("message", (event) => {
				const data = event.data;
				const pending$1 = this.pendingRequests.get(data.id);
				if (!pending$1) return;
				this.pendingRequests.delete(data.id);
				if ("error" in data) pending$1.reject(new Error(data.error));
				else pending$1.resolve({
					colorFrame: data.colorFrame,
					alphaFrame: data.alphaFrame
				});
			});
			this.worker.addEventListener("error", (event) => {
				const error = new Error(event.message || "Color/alpha splitter worker error.");
				for (const pending$1 of this.pendingRequests.values()) pending$1.reject(error);
				this.pendingRequests.clear();
			});
		}
		const id = this.nextRequestId++;
		const pending = promiseWithResolvers();
		this.pendingRequests.set(id, pending);
		this.worker.postMessage({
			id,
			sourceFrame
		}, { transfer: [sourceFrame] });
		return pending.promise;
	}
	close() {
		this.worker?.terminate();
		this.worker = null;
		const error = /* @__PURE__ */ new Error("Color/alpha splitter closed.");
		for (const pending of this.pendingRequests.values()) pending.reject(error);
		this.pendingRequests.clear();
	}
};
const colorAlphaSplitterWorkerCode = () => {
	let cpuSourceBuffer = null;
	let chain = Promise.resolve();
	self.addEventListener("message", (event) => {
		const { id, sourceFrame } = event.data;
		chain = chain.then(async () => {
			try {
				const { colorFrame, alphaFrame } = await split(sourceFrame);
				self.postMessage({
					id,
					colorFrame,
					alphaFrame
				}, { transfer: [colorFrame, alphaFrame] });
			} catch (error) {
				self.postMessage({
					id,
					error: error.message
				});
			} finally {
				sourceFrame.close();
			}
		});
	});
	const split = async (sourceFrame) => {
		const format = sourceFrame.format;
		if (!format) throw new Error("CPU color/alpha splitting requires a known VideoFrame format.");
		const sourceSize = sourceFrame.allocationSize();
		if (!cpuSourceBuffer || cpuSourceBuffer.byteLength !== sourceSize) cpuSourceBuffer = new Uint8Array(sourceSize);
		await sourceFrame.copyTo(cpuSourceBuffer);
		if (format === "RGBA" || format === "BGRA") return splitInterleavedRgba(cpuSourceBuffer, format, sourceFrame);
		else if (format === "I420A" || format === "I420AP10" || format === "I420AP12" || format === "I422A" || format === "I422AP10" || format === "I422AP12" || format === "I444A" || format === "I444AP10" || format === "I444AP12") return splitPlanarYuvA(cpuSourceBuffer, format, sourceFrame);
		throw new Error(`CPU color/alpha splitting does not support format '${format}'.`);
	};
	const splitInterleavedRgba = (source, format, sourceFrame) => {
		const width = sourceFrame.visibleRect?.width ?? sourceFrame.codedWidth;
		const height = sourceFrame.visibleRect?.height ?? sourceFrame.codedHeight;
		const pixelCount = width * height;
		const alphaSize = pixelCount + Math.ceil(width / 2) * Math.ceil(height / 2) * 2;
		const alphaBuffer = new Uint8Array(alphaSize);
		for (let i = 0, j$1 = 3; i < pixelCount; i++, j$1 += 4) alphaBuffer[i] = source[j$1];
		alphaBuffer.fill(128, pixelCount);
		const colorFrame = new VideoFrame(source, {
			format: format === "RGBA" ? "RGBX" : "BGRX",
			codedWidth: width,
			codedHeight: height,
			timestamp: sourceFrame.timestamp,
			duration: sourceFrame.duration ?? void 0
		});
		const alphaInit = {
			format: "I420",
			codedWidth: width,
			codedHeight: height,
			timestamp: sourceFrame.timestamp,
			duration: sourceFrame.duration ?? void 0,
			transfer: [alphaBuffer.buffer]
		};
		return {
			colorFrame,
			alphaFrame: new VideoFrame(alphaBuffer, alphaInit)
		};
	};
	const splitPlanarYuvA = (source, format, sourceFrame) => {
		const width = sourceFrame.visibleRect?.width ?? sourceFrame.codedWidth;
		const height = sourceFrame.visibleRect?.height ?? sourceFrame.codedHeight;
		const is10 = format.includes("P10");
		const is12 = format.includes("P12");
		const bytesPerSample = is10 || is12 ? 2 : 1;
		let chromaW;
		let chromaH;
		if (format.startsWith("I420")) {
			chromaW = Math.ceil(width / 2);
			chromaH = Math.ceil(height / 2);
		} else if (format.startsWith("I422")) {
			chromaW = Math.ceil(width / 2);
			chromaH = height;
		} else {
			chromaW = width;
			chromaH = height;
		}
		const ySamples = width * height;
		const uvSamples = chromaW * chromaH;
		const yBytes = ySamples * bytesPerSample;
		const uvBytes = uvSamples * bytesPerSample;
		const aBytes = ySamples * bytesPerSample;
		const colorBytes = yBytes + uvBytes * 2;
		const colorFormat = format.replace("A", "");
		const alphaUvSamples = Math.ceil(width / 2) * Math.ceil(height / 2);
		const alphaSize = aBytes + 2 * (alphaUvSamples * bytesPerSample);
		const alphaBuffer = new Uint8Array(alphaSize);
		const aPlaneStart = colorBytes;
		alphaBuffer.set(source.subarray(aPlaneStart, aPlaneStart + aBytes), 0);
		const uvOffset = aBytes;
		const neutralChroma = is10 ? 512 : is12 ? 2048 : 128;
		if (bytesPerSample === 1) alphaBuffer.fill(neutralChroma, uvOffset);
		else new Uint16Array(alphaBuffer.buffer, uvOffset, 2 * alphaUvSamples).fill(neutralChroma);
		const alphaFormat = is10 ? "I420P10" : is12 ? "I420P12" : "I420";
		const colorFrame = new VideoFrame(source.subarray(0, colorBytes), {
			format: colorFormat,
			codedWidth: width,
			codedHeight: height,
			timestamp: sourceFrame.timestamp,
			duration: sourceFrame.duration ?? void 0
		});
		const alphaInit = {
			format: alphaFormat,
			codedWidth: width,
			codedHeight: height,
			timestamp: sourceFrame.timestamp,
			duration: sourceFrame.duration ?? void 0,
			transfer: [alphaBuffer.buffer]
		};
		return {
			colorFrame,
			alphaFrame: new VideoFrame(alphaBuffer, alphaInit)
		};
	};
};
/**
* This source can be used to add raw, unencoded video samples (frames) to an output video track. These frames will
* automatically be encoded and then piped into the output.
* @group Media sources
* @public
*/
var VideoSampleSource = class extends VideoSource {
	/**
	* Creates a new {@link VideoSampleSource} whose samples are encoded according to the specified
	* {@link VideoEncodingConfig}.
	*/
	constructor(encodingConfig) {
		validateVideoEncodingConfig(encodingConfig);
		super(encodingConfig.codec);
		this._encoder = new VideoEncoderWrapper(this, encodingConfig);
	}
	/**
	* Encodes a video sample (frame) and then adds it to the output.
	*
	* @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
	* to respect writer and encoder backpressure.
	*/
	add(videoSample, encodeOptions) {
		if (!(videoSample instanceof VideoSample)) throw new TypeError("videoSample must be a VideoSample.");
		return this._encoder.add(videoSample, false, encodeOptions);
	}
	/** @internal */
	_flushAndClose(forceClose) {
		return this._encoder.flushAndClose(forceClose);
	}
};
/**
* Base class for audio sources - sources for audio tracks.
* @group Media sources
* @public
*/
var AudioSource = class extends MediaSource {
	/** Internal constructor. */
	constructor(codec) {
		super();
		/** @internal */
		this._connectedTrack = null;
		if (!AUDIO_CODECS.includes(codec)) throw new TypeError(`Invalid audio codec '${codec}'. Must be one of: ${AUDIO_CODECS.join(", ")}.`);
		this._codec = codec;
	}
};
var AudioEncoderWrapper = class {
	setError(error) {
		if (!this.errorSet) {
			this.error = error;
			this.errorSet = true;
		}
	}
	constructor(source, encodingConfig) {
		this.source = source;
		this.encodingConfig = encodingConfig;
		this.ensureEncoderPromise = null;
		this.encoderInitialized = false;
		this.encoder = null;
		this.muxer = null;
		this.lastNumberOfChannels = null;
		this.lastSampleRate = null;
		this.isPcmEncoder = false;
		this.outputSampleSize = null;
		this.writeOutputValue = null;
		this.customEncoder = null;
		this.customEncoderCallSerializer = new CallSerializer();
		this.customEncoderQueueSize = 0;
		this.lastEndSampleIndex = null;
		this.resampler = null;
		/**
		* Encoders typically throw their errors "out of band", meaning asynchronously in some other execution context.
		* However, we want to surface these errors to the user within the normal control flow, so they don't go uncaught.
		* So, we keep track of the encoder error and throw it as soon as we get the chance.
		*/
		this.error = null;
		this.errorSet = false;
		this.lastMuxerPromise = Promise.resolve();
		this.closed = false;
	}
	async add(audioSample, shouldClose) {
		try {
			this.checkForEncoderError();
			this.source._ensureValidAdd();
			if (this.lastNumberOfChannels !== null && this.lastSampleRate !== null) {
				if (audioSample.numberOfChannels !== this.lastNumberOfChannels || audioSample.sampleRate !== this.lastSampleRate) throw new Error(`Audio parameters must remain constant. Expected ${this.lastNumberOfChannels} channels at ${this.lastSampleRate} Hz, got ${audioSample.numberOfChannels} channels at ${audioSample.sampleRate} Hz.`);
			} else {
				this.lastNumberOfChannels = audioSample.numberOfChannels;
				this.lastSampleRate = audioSample.sampleRate;
			}
			const config = this.encodingConfig;
			if (config.transform?.numberOfChannels !== void 0 || config.transform?.sampleRate !== void 0) {
				if (!this.resampler) this.resampler = new AudioResampler({
					targetNumberOfChannels: config.transform.numberOfChannels ?? audioSample.numberOfChannels,
					targetSampleRate: config.transform.sampleRate ?? audioSample.sampleRate,
					onSample: async (sample) => {
						await this.processAndEncode(sample, true);
					}
				});
				await this.resampler.add(audioSample);
			} else await this.processAndEncode(audioSample, shouldClose);
		} finally {
			if (shouldClose) audioSample.close();
		}
	}
	/**
	* Runs the process function (if any) and encodes the resulting samples.
	*/
	async processAndEncode(audioSample, shouldClose) {
		const config = this.encodingConfig;
		if (config.transform?.sampleFormat !== void 0 && toInterleavedAudioFormat(audioSample.format) !== config.transform.sampleFormat) {
			const newSample = audioSampleToInterleavedFormat(audioSample, config.transform.sampleFormat);
			if (shouldClose) audioSample.close();
			audioSample = newSample;
			shouldClose = true;
		}
		if (config.transform?.process) {
			let processed = config.transform.process(audioSample);
			if (processed instanceof Promise) processed = await processed;
			if (processed === null) return;
			if (!Array.isArray(processed)) processed = [processed];
			for (const sample of processed) {
				if (!(sample instanceof AudioSample)) throw new TypeError("The audio process function must return an AudioSample, null, or an array of AudioSamples.");
				await this.encodeSample(sample, true);
			}
			if (shouldClose) audioSample.close();
		} else await this.encodeSample(audioSample, shouldClose);
	}
	/**
	* Encodes a single audio sample, handling encoder init, gap padding, and backpressure.
	*/
	async encodeSample(audioSample, shouldClose) {
		try {
			if (!this.encoderInitialized) {
				if (!this.ensureEncoderPromise) this.ensureEncoder(audioSample);
				if (!this.encoderInitialized) await this.ensureEncoderPromise;
			}
			assert$3(this.encoderInitialized);
			if (this.closed) return;
			{
				const startSampleIndex = Math.round(audioSample.timestamp * audioSample.sampleRate);
				const endSampleIndex = Math.round((audioSample.timestamp + audioSample.duration) * audioSample.sampleRate);
				if (this.lastEndSampleIndex === null) this.lastEndSampleIndex = endSampleIndex;
				else {
					const sampleDiff = startSampleIndex - this.lastEndSampleIndex;
					if (sampleDiff >= 64) {
						const fillSample = new AudioSample({
							data: new Float32Array(sampleDiff * audioSample.numberOfChannels),
							format: "f32-planar",
							sampleRate: audioSample.sampleRate,
							numberOfChannels: audioSample.numberOfChannels,
							numberOfFrames: sampleDiff,
							timestamp: this.lastEndSampleIndex / audioSample.sampleRate
						});
						await this.encodeSample(fillSample, true);
					}
					this.lastEndSampleIndex += audioSample.numberOfFrames;
				}
			}
			this.encodingConfig.onEncodedSample?.(audioSample);
			if (this.customEncoder) {
				this.customEncoderQueueSize++;
				const clonedSample = audioSample.clone();
				const promise = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(clonedSample)).catch((error) => this.setError(error)).finally(() => {
					this.customEncoderQueueSize--;
					clonedSample.close();
				});
				if (this.customEncoderQueueSize >= 4) await promise;
				await this.lastMuxerPromise;
			} else if (this.isPcmEncoder) await this.doPcmEncoding(audioSample, shouldClose);
			else {
				assert$3(this.encoder);
				const audioData = audioSample.toAudioData();
				this.encoder.encode(audioData);
				audioData.close();
				if (shouldClose) audioSample.close();
				if (this.encoder.encodeQueueSize >= 4) await new Promise((resolve$1) => this.encoder.addEventListener("dequeue", resolve$1, { once: true }));
				await this.lastMuxerPromise;
			}
		} finally {
			if (shouldClose) audioSample.close();
		}
	}
	async doPcmEncoding(audioSample, shouldClose) {
		assert$3(this.outputSampleSize);
		assert$3(this.writeOutputValue);
		const { numberOfChannels, numberOfFrames, sampleRate, timestamp } = audioSample;
		const CHUNK_SIZE = 2048;
		const outputs = [];
		for (let frame = 0; frame < numberOfFrames; frame += CHUNK_SIZE) {
			const frameCount = Math.min(CHUNK_SIZE, audioSample.numberOfFrames - frame);
			const outputSize = frameCount * numberOfChannels * this.outputSampleSize;
			const outputBuffer = new ArrayBuffer(outputSize);
			const outputView = new DataView(outputBuffer);
			outputs.push({
				frameCount,
				view: outputView
			});
		}
		const allocationSize = audioSample.allocationSize({
			planeIndex: 0,
			format: "f32-planar"
		});
		const floats = new Float32Array(allocationSize / Float32Array.BYTES_PER_ELEMENT);
		for (let i = 0; i < numberOfChannels; i++) {
			audioSample.copyTo(floats, {
				planeIndex: i,
				format: "f32-planar"
			});
			for (let j$1 = 0; j$1 < outputs.length; j$1++) {
				const { frameCount, view: view$1 } = outputs[j$1];
				for (let k$1 = 0; k$1 < frameCount; k$1++) this.writeOutputValue(view$1, (k$1 * numberOfChannels + i) * this.outputSampleSize, floats[j$1 * CHUNK_SIZE + k$1]);
			}
		}
		if (shouldClose) audioSample.close();
		const meta = { decoderConfig: {
			codec: this.encodingConfig.codec,
			numberOfChannels,
			sampleRate
		} };
		for (let i = 0; i < outputs.length; i++) {
			const { frameCount, view: view$1 } = outputs[i];
			const outputBuffer = view$1.buffer;
			const startFrame = i * CHUNK_SIZE;
			const packet = new EncodedPacket(new Uint8Array(outputBuffer), "key", timestamp + startFrame / sampleRate, frameCount / sampleRate);
			this.encodingConfig.onEncodedPacket?.(packet, meta);
			await this.muxer.addEncodedAudioPacket(this.source._connectedTrack, packet, meta);
		}
	}
	ensureEncoder(audioSample) {
		this.ensureEncoderPromise = (async () => {
			const { numberOfChannels, sampleRate } = audioSample;
			const encoderConfig = buildAudioEncoderConfig({
				numberOfChannels,
				sampleRate,
				...this.encodingConfig
			});
			this.encodingConfig.onEncoderConfig?.(encoderConfig);
			const MatchingCustomEncoder = customAudioEncoders.find((x$1) => x$1.supports(this.encodingConfig.codec, encoderConfig));
			if (MatchingCustomEncoder) {
				this.customEncoder = new MatchingCustomEncoder();
				this.customEncoder.codec = this.encodingConfig.codec;
				this.customEncoder.config = encoderConfig;
				this.customEncoder.onPacket = (packet, meta) => {
					if (!(packet instanceof EncodedPacket)) throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
					if (meta !== void 0 && (!meta || typeof meta !== "object")) throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
					this.encodingConfig.onEncodedPacket?.(packet, meta);
					this.lastMuxerPromise = this.muxer.addEncodedAudioPacket(this.source._connectedTrack, packet, meta).catch((error) => {
						this.setError(error);
					});
				};
				this.customEncoder.onError = (error) => {
					this.setError(error);
				};
				await this.customEncoder.init();
			} else if (PCM_AUDIO_CODECS.includes(this.encodingConfig.codec)) this.initPcmEncoder();
			else {
				if (typeof AudioEncoder === "undefined") throw new Error("AudioEncoder is not supported by this browser.");
				if (!(await AudioEncoder.isConfigSupported(encoderConfig)).supported) throw new Error(`This specific encoder configuration (${encoderConfig.codec}, ${encoderConfig.bitrate} bps, ${encoderConfig.numberOfChannels} channels, ${encoderConfig.sampleRate} Hz) is not supported by this browser. Consider using another codec or changing your audio parameters.`);
				const stack = (/* @__PURE__ */ new Error("Encoding error")).stack;
				this.encoder = new AudioEncoder({
					output: (chunk, meta) => {
						if (this.encodingConfig.codec === "aac" && meta?.decoderConfig) {
							let needsDescriptionOverwrite = false;
							if (!meta.decoderConfig.description || meta.decoderConfig.description.byteLength < 2) needsDescriptionOverwrite = true;
							else needsDescriptionOverwrite = parseAacAudioSpecificConfig$1(toUint8Array$1(meta.decoderConfig.description)).objectType === 0;
							if (needsDescriptionOverwrite) {
								const objectType = Number(last$1(encoderConfig.codec.split(".")));
								meta.decoderConfig.description = buildAacAudioSpecificConfig({
									objectType,
									numberOfChannels: meta.decoderConfig.numberOfChannels,
									sampleRate: meta.decoderConfig.sampleRate
								});
							}
						}
						let packet = EncodedPacket.fromEncodedChunk(chunk);
						packet = packet.clone({
							timestamp: roundToDivisor(packet.timestamp, encoderConfig.sampleRate),
							duration: chunk.duration != null ? roundToDivisor(packet.duration, encoderConfig.sampleRate) : void 0
						});
						this.encodingConfig.onEncodedPacket?.(packet, meta);
						this.lastMuxerPromise = this.muxer.addEncodedAudioPacket(this.source._connectedTrack, packet, meta).catch((error) => {
							this.setError(error);
						});
					},
					error: (error) => {
						error.stack = stack;
						this.setError(error);
					}
				});
				this.encoder.configure(encoderConfig);
			}
			assert$3(this.source._connectedTrack);
			this.muxer = this.source._connectedTrack.output._muxer;
			this.encoderInitialized = true;
		})();
	}
	initPcmEncoder() {
		this.isPcmEncoder = true;
		const codec = this.encodingConfig.codec;
		const { dataType, sampleSize, littleEndian } = parsePcmCodec(codec);
		this.outputSampleSize = sampleSize;
		switch (sampleSize) {
			case 1:
				if (dataType === "unsigned") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setUint8(byteOffset, clamp((value + 1) * 127.5, 0, 255));
				else if (dataType === "signed") this.writeOutputValue = (view$1, byteOffset, value) => {
					view$1.setInt8(byteOffset, clamp(Math.round(value * 128), -128, 127));
				};
				else if (dataType === "ulaw") this.writeOutputValue = (view$1, byteOffset, value) => {
					const int16 = clamp(Math.floor(value * 32767), -32768, 32767);
					view$1.setUint8(byteOffset, toUlaw(int16));
				};
				else if (dataType === "alaw") this.writeOutputValue = (view$1, byteOffset, value) => {
					const int16 = clamp(Math.floor(value * 32767), -32768, 32767);
					view$1.setUint8(byteOffset, toAlaw(int16));
				};
				else assert$3(false);
				break;
			case 2:
				if (dataType === "unsigned") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setUint16(byteOffset, clamp((value + 1) * 32767.5, 0, 65535), littleEndian);
				else if (dataType === "signed") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setInt16(byteOffset, clamp(Math.round(value * 32767), -32768, 32767), littleEndian);
				else assert$3(false);
				break;
			case 3:
				if (dataType === "unsigned") this.writeOutputValue = (view$1, byteOffset, value) => setUint24(view$1, byteOffset, clamp((value + 1) * 8388607.5, 0, 16777215), littleEndian);
				else if (dataType === "signed") this.writeOutputValue = (view$1, byteOffset, value) => setInt24(view$1, byteOffset, clamp(Math.round(value * 8388607), -8388608, 8388607), littleEndian);
				else assert$3(false);
				break;
			case 4:
				if (dataType === "unsigned") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setUint32(byteOffset, clamp((value + 1) * 2147483647.5, 0, 4294967295), littleEndian);
				else if (dataType === "signed") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setInt32(byteOffset, clamp(Math.round(value * 2147483647), -2147483648, 2147483647), littleEndian);
				else if (dataType === "float") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setFloat32(byteOffset, value, littleEndian);
				else assert$3(false);
				break;
			case 8:
				if (dataType === "float") this.writeOutputValue = (view$1, byteOffset, value) => view$1.setFloat64(byteOffset, value, littleEndian);
				else assert$3(false);
				break;
			default:
				assertNever$1(sampleSize);
				assert$3(false);
		}
	}
	async flushAndClose(forceClose) {
		if (!forceClose) this.checkForEncoderError();
		if (!forceClose && this.resampler) await this.resampler.finalize();
		this.resampler = null;
		this.closed = true;
		if (this.customEncoder) {
			if (!forceClose) this.customEncoderCallSerializer.call(() => this.customEncoder.flush());
			await this.customEncoderCallSerializer.call(() => this.customEncoder.close());
		} else if (this.encoder) {
			if (!forceClose) await this.encoder.flush();
			if (this.encoder.state !== "closed") this.encoder.close();
		}
		if (!forceClose) this.checkForEncoderError();
	}
	getQueueSize() {
		if (this.customEncoder) return this.customEncoderQueueSize;
		else if (this.isPcmEncoder) return 0;
		else return this.encoder?.encodeQueueSize ?? 0;
	}
	checkForEncoderError() {
		if (this.errorSet) throw this.error;
	}
};
/**
* This source can be used to add raw, unencoded audio samples to an output audio track. These samples will
* automatically be encoded and then piped into the output.
* @group Media sources
* @public
*/
var AudioSampleSource = class extends AudioSource {
	/**
	* Creates a new {@link AudioSampleSource} whose samples are encoded according to the specified
	* {@link AudioEncodingConfig}.
	*/
	constructor(encodingConfig) {
		validateAudioEncodingConfig(encodingConfig);
		super(encodingConfig.codec);
		this._encoder = new AudioEncoderWrapper(this, encodingConfig);
	}
	/**
	* Encodes an audio sample and then adds it to the output.
	*
	* @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
	* to respect writer and encoder backpressure.
	*/
	add(audioSample) {
		if (!(audioSample instanceof AudioSample)) throw new TypeError("audioSample must be an AudioSample.");
		return this._encoder.add(audioSample, false);
	}
	/** @internal */
	_flushAndClose(forceClose) {
		return this._encoder.flushAndClose(forceClose);
	}
};
/**
* Base class for subtitle sources - sources for subtitle tracks.
* @group Media sources
* @public
*/
var SubtitleSource = class extends MediaSource {
	/** Internal constructor. */
	constructor(codec) {
		super();
		/** @internal */
		this._connectedTrack = null;
		if (!SUBTITLE_CODECS.includes(codec)) throw new TypeError(`Invalid subtitle codec '${codec}'. Must be one of: ${SUBTITLE_CODECS.join(", ")}.`);
		this._codec = codec;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/output-format.js
/**
* Base class representing an output media file format.
* @group Output formats
* @public
*/
var OutputFormat = class {
	/** Returns a list of video codecs that this output format can contain. */
	getSupportedVideoCodecs() {
		return this.getSupportedCodecs().filter((codec) => VIDEO_CODECS.includes(codec));
	}
	/** Returns a list of audio codecs that this output format can contain. */
	getSupportedAudioCodecs() {
		return this.getSupportedCodecs().filter((codec) => AUDIO_CODECS.includes(codec));
	}
	/** Returns a list of subtitle codecs that this output format can contain. */
	getSupportedSubtitleCodecs() {
		return this.getSupportedCodecs().filter((codec) => SUBTITLE_CODECS.includes(codec));
	}
	/** @internal */
	_codecUnsupportedHint(codec) {
		return "";
	}
};
/**
* Format representing files compatible with the ISO base media file format (ISOBMFF), like MP4 or MOV files.
* @group Output formats
* @public
*/
var IsobmffOutputFormat = class extends OutputFormat {
	/** Internal constructor. */
	constructor(options = {}) {
		if (!options || typeof options !== "object") throw new TypeError("options must be an object.");
		if (options.fastStart !== void 0 && ![
			false,
			"in-memory",
			"reserve",
			"fragmented"
		].includes(options.fastStart)) throw new TypeError("options.fastStart, when provided, must be false, 'in-memory', 'reserve', or 'fragmented'.");
		if (options.minimumFragmentDuration !== void 0 && (!Number.isFinite(options.minimumFragmentDuration) || options.minimumFragmentDuration < 0)) throw new TypeError("options.minimumFragmentDuration, when provided, must be a non-negative number.");
		if (options.onFtyp !== void 0 && typeof options.onFtyp !== "function") throw new TypeError("options.onFtyp, when provided, must be a function.");
		if (options.onMoov !== void 0 && typeof options.onMoov !== "function") throw new TypeError("options.onMoov, when provided, must be a function.");
		if (options.onMdat !== void 0 && typeof options.onMdat !== "function") throw new TypeError("options.onMdat, when provided, must be a function.");
		if (options.onMoof !== void 0 && typeof options.onMoof !== "function") throw new TypeError("options.onMoof, when provided, must be a function.");
		if (options.metadataFormat !== void 0 && ![
			"mdir",
			"mdta",
			"udta",
			"auto"
		].includes(options.metadataFormat)) throw new TypeError("options.metadataFormat, when provided, must be either 'auto', 'mdir', 'mdta', or 'udta'.");
		super();
		this._options = options;
	}
	getSupportedTrackCounts() {
		const max = 2 ** 32 - 1;
		return {
			video: {
				min: 0,
				max
			},
			audio: {
				min: 0,
				max
			},
			subtitle: {
				min: 0,
				max
			},
			total: {
				min: 1,
				max
			}
		};
	}
	get supportsVideoRotationMetadata() {
		return true;
	}
	get supportsTimestampedMediaData() {
		return true;
	}
	/** @internal */
	_createMuxer(output) {
		return new IsobmffMuxer(output, this);
	}
};
/**
* MPEG-4 Part 14 (MP4) file format. Supports most codecs.
* @group Output formats
* @public
*/
var Mp4OutputFormat = class extends IsobmffOutputFormat {
	/** Creates a new {@link Mp4OutputFormat} configured with the specified `options`. */
	constructor(options) {
		super(options);
	}
	/** @internal */
	get _name() {
		return "MP4";
	}
	get fileExtension() {
		return ".mp4";
	}
	get mimeType() {
		return "video/mp4";
	}
	getSupportedCodecs() {
		return [
			...VIDEO_CODECS,
			...NON_PCM_AUDIO_CODECS,
			"pcm-s16",
			"pcm-s16be",
			"pcm-s24",
			"pcm-s24be",
			"pcm-s32",
			"pcm-s32be",
			"pcm-f32",
			"pcm-f32be",
			"pcm-f64",
			"pcm-f64be",
			...SUBTITLE_CODECS
		];
	}
	/** @internal */
	_codecUnsupportedHint(codec) {
		if (new MovOutputFormat().getSupportedCodecs().includes(codec)) return " Switching to MOV will grant support for this codec.";
		return "";
	}
};
/**
* Creates a single Common Media Application Format (CMAF) segment. An init segment will be written to the
* {@link Target} specified in {@link OutputOptions.initTarget}. Supports most codecs.
* @group Output formats
* @public
*/
var CmafOutputFormat = class extends IsobmffOutputFormat {
	/** Creates a new {@link CmafOutputFormat} configured with the specified `options`. */
	constructor(options) {
		super(options);
	}
	/** @internal */
	get _name() {
		return "CMAF";
	}
	get fileExtension() {
		return ".m4s";
	}
	get mimeType() {
		return "video/mp4";
	}
	getSupportedCodecs() {
		return [
			...VIDEO_CODECS,
			...NON_PCM_AUDIO_CODECS,
			"pcm-s16",
			"pcm-s16be",
			"pcm-s24",
			"pcm-s24be",
			"pcm-s32",
			"pcm-s32be",
			"pcm-f32",
			"pcm-f32be",
			"pcm-f64",
			"pcm-f64be",
			...SUBTITLE_CODECS
		];
	}
};
/**
* QuickTime File Format (QTFF), often called MOV. Supports all video and audio codecs, but not subtitle codecs.
* @group Output formats
* @public
*/
var MovOutputFormat = class extends IsobmffOutputFormat {
	/** Creates a new {@link MovOutputFormat} configured with the specified `options`. */
	constructor(options) {
		super(options);
	}
	/** @internal */
	get _name() {
		return "MOV";
	}
	get fileExtension() {
		return ".mov";
	}
	get mimeType() {
		return "video/quicktime";
	}
	getSupportedCodecs() {
		return [...VIDEO_CODECS, ...AUDIO_CODECS];
	}
	/** @internal */
	_codecUnsupportedHint(codec) {
		if (new Mp4OutputFormat().getSupportedCodecs().includes(codec)) return " Switching to MP4 will grant support for this codec.";
		return "";
	}
};
/**
* Matroska file format.
*
* Supports writing transparent video. For a video track to be marked as transparent, the first packet added must
* contain alpha side data.
*
* @group Output formats
* @public
*/
var MkvOutputFormat = class extends OutputFormat {
	/** Creates a new {@link MkvOutputFormat} configured with the specified `options`. */
	constructor(options = {}) {
		if (!options || typeof options !== "object") throw new TypeError("options must be an object.");
		if (options.appendOnly !== void 0 && typeof options.appendOnly !== "boolean") throw new TypeError("options.appendOnly, when provided, must be a boolean.");
		if (options.minimumClusterDuration !== void 0 && (!Number.isFinite(options.minimumClusterDuration) || options.minimumClusterDuration < 0)) throw new TypeError("options.minimumClusterDuration, when provided, must be a non-negative number.");
		if (options.onEbmlHeader !== void 0 && typeof options.onEbmlHeader !== "function") throw new TypeError("options.onEbmlHeader, when provided, must be a function.");
		if (options.onSegmentHeader !== void 0 && typeof options.onSegmentHeader !== "function") throw new TypeError("options.onHeader, when provided, must be a function.");
		if (options.onCluster !== void 0 && typeof options.onCluster !== "function") throw new TypeError("options.onCluster, when provided, must be a function.");
		super();
		this._options = options;
	}
	/** @internal */
	_createMuxer(output) {
		return new MatroskaMuxer(output, this);
	}
	/** @internal */
	get _name() {
		return "Matroska";
	}
	getSupportedTrackCounts() {
		const max = 127;
		return {
			video: {
				min: 0,
				max
			},
			audio: {
				min: 0,
				max
			},
			subtitle: {
				min: 0,
				max
			},
			total: {
				min: 1,
				max
			}
		};
	}
	get fileExtension() {
		return ".mkv";
	}
	get mimeType() {
		return "video/x-matroska";
	}
	getSupportedCodecs() {
		return [
			...VIDEO_CODECS,
			...NON_PCM_AUDIO_CODECS,
			...PCM_AUDIO_CODECS.filter((codec) => ![
				"pcm-s8",
				"pcm-f32be",
				"pcm-f64be",
				"ulaw",
				"alaw"
			].includes(codec)),
			...SUBTITLE_CODECS
		];
	}
	get supportsVideoRotationMetadata() {
		return false;
	}
	get supportsTimestampedMediaData() {
		return true;
	}
};
/**
* WebM file format, based on Matroska.
*
* Supports writing transparent video. For a video track to be marked as transparent, the first packet added must
* contain alpha side data.
*
* @group Output formats
* @public
*/
var WebMOutputFormat = class extends MkvOutputFormat {
	/** Creates a new {@link WebMOutputFormat} configured with the specified `options`. */
	constructor(options) {
		super(options);
	}
	getSupportedCodecs() {
		return [
			...VIDEO_CODECS.filter((codec) => [
				"vp8",
				"vp9",
				"av1"
			].includes(codec)),
			...AUDIO_CODECS.filter((codec) => ["opus", "vorbis"].includes(codec)),
			...SUBTITLE_CODECS
		];
	}
	/** @internal */
	get _name() {
		return "WebM";
	}
	get fileExtension() {
		return ".webm";
	}
	get mimeType() {
		return "video/webm";
	}
	/** @internal */
	_codecUnsupportedHint(codec) {
		if (new MkvOutputFormat().getSupportedCodecs().includes(codec)) return " Switching to MKV will grant support for this codec.";
		return "";
	}
};
/**
* MP3 file format.
* @group Output formats
* @public
*/
var Mp3OutputFormat = class extends OutputFormat {
	/** Creates a new {@link Mp3OutputFormat} configured with the specified `options`. */
	constructor(options = {}) {
		if (!options || typeof options !== "object") throw new TypeError("options must be an object.");
		if (options.xingHeader !== void 0 && typeof options.xingHeader !== "boolean") throw new TypeError("options.xingHeader, when provided, must be a boolean.");
		if (options.onXingFrame !== void 0 && typeof options.onXingFrame !== "function") throw new TypeError("options.onXingFrame, when provided, must be a function.");
		super();
		this._options = options;
	}
	/** @internal */
	_createMuxer(output) {
		return new Mp3Muxer(output, this);
	}
	/** @internal */
	get _name() {
		return "MP3";
	}
	getSupportedTrackCounts() {
		return {
			video: {
				min: 0,
				max: 0
			},
			audio: {
				min: 1,
				max: 1
			},
			subtitle: {
				min: 0,
				max: 0
			},
			total: {
				min: 1,
				max: 1
			}
		};
	}
	get fileExtension() {
		return ".mp3";
	}
	get mimeType() {
		return "audio/mpeg";
	}
	getSupportedCodecs() {
		return ["mp3"];
	}
	get supportsVideoRotationMetadata() {
		return false;
	}
	get supportsTimestampedMediaData() {
		return false;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/mediabunny@1.51.0/node_modules/mediabunny/dist/modules/src/output.js
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
/**
* List of all track types.
* @group Miscellaneous
* @public
*/
const ALL_TRACK_TYPES = [
	"video",
	"audio",
	"subtitle"
];
/**
* Represents a track added to an {@link Output}.
* @group Output files
* @public
*/
var OutputTrack = class OutputTrack {
	/** @internal */
	constructor(id, output, type, source, metadata) {
		this.id = id;
		this.output = output;
		this.type = type;
		this.source = source;
		this.metadata = metadata;
	}
	/** Returns true if and only if this track is a video track. */
	isVideoTrack() {
		return this.type === "video";
	}
	/** Returns true if and only if this track is an audio track. */
	isAudioTrack() {
		return this.type === "audio";
	}
	/** Returns true if and only if this track is a subtitle track. */
	isSubtitleTrack() {
		return this.type === "subtitle";
	}
	/**
	* Returns true if and only if this track can be paired with the given other track. Pairability can be set using
	* the {@link BaseTrackMetadata.group} option.
	*/
	canBePairedWith(other) {
		if (!(other instanceof OutputTrack)) throw new TypeError("other must be an OutputTrack.");
		if (this === other) return false;
		const thisGroups = toArray(this.metadata.group);
		const otherGroups = toArray(other.metadata.group);
		for (const aGroup of thisGroups) {
			if (this.type !== other.type && otherGroups.some((bGroup) => aGroup === bGroup)) return true;
			if (otherGroups.some((bGroup) => aGroup._pairedGroups.has(bGroup))) return true;
		}
		return false;
	}
};
/**
* An {@link OutputTrack} providing video data, created using {@link Output.addVideoTrack}.
* @group Output files
* @public
*/
var OutputVideoTrack = class extends OutputTrack {
	/** @internal */
	constructor(id, output, source, metadata) {
		super(id, output, "video", source, metadata);
	}
};
/**
* An {@link OutputTrack} providing audio data, created using {@link Output.addAudioTrack}.
* @group Output files
* @public
*/
var OutputAudioTrack = class extends OutputTrack {
	/** @internal */
	constructor(id, output, source, metadata) {
		super(id, output, "audio", source, metadata);
	}
};
/**
* An {@link OutputTrack} providing subtitle data, created using {@link Output.addSubtitleTrack}.
* @group Output files
* @public
*/
var OutputSubtitleTrack = class extends OutputTrack {
	/** @internal */
	constructor(id, output, source, metadata) {
		super(id, output, "subtitle", source, metadata);
	}
};
/**
* Used to define pairability between {@link OutputTrack} instances. First create the group, then assign tracks to it
* via {@link BaseTrackMetadata.group}.
*
* Two tracks are considered _pairable_ if they are in the same group but have a different {@link TrackType}, or if they
* are in different groups that are paired with each other. Groups can be paired with each other using the
* {@link OutputTrackGroup.pairWith} method.
*
* @group Output files
* @public
*/
var OutputTrackGroup = class OutputTrackGroup {
	/** Creates a new {@link OutputTrackGroup}. */
	constructor() {
		/** @internal */
		this._pairedGroups = /* @__PURE__ */ new Set();
	}
	/**
	* Marks this group as being pairable with another group, symmetrically. Output tracks where each track is assigned
	* to one half of a group pairing are then considered pairable.
	*
	* You cannot pair a group with itself.
	*/
	pairWith(other) {
		if (!(other instanceof OutputTrackGroup)) throw new TypeError("other must be an OutputTrackGroup.");
		if (this === other) throw new TypeError("Cannot pair a group with itself.");
		this._pairedGroups.add(other);
		other._pairedGroups.add(this);
	}
};
const validateBaseTrackMetadata = (metadata) => {
	if (!metadata || typeof metadata !== "object") throw new TypeError("metadata must be an object.");
	if (metadata.languageCode !== void 0 && !isIso639Dash2LanguageCode(metadata.languageCode)) throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
	if (metadata.name !== void 0 && typeof metadata.name !== "string") throw new TypeError("metadata.name, when provided, must be a string.");
	if (metadata.disposition !== void 0) validateTrackDisposition(metadata.disposition);
	if (metadata.maximumPacketCount !== void 0 && (!Number.isInteger(metadata.maximumPacketCount) || metadata.maximumPacketCount < 0)) throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
	if (metadata.group !== void 0 && !(metadata.group instanceof OutputTrackGroup) && (!Array.isArray(metadata.group) || metadata.group.some((group) => !(group instanceof OutputTrackGroup)))) throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
/**
* Main class orchestrating the creation of new media files.
* @group Output files
* @public
*/
var Output = class extends EventEmitter$1 {
	/**
	* The target to which the root file will be written. Throws when using {@link PathedTarget} with an async callback;
	* prefer the `'target'` event for those cases.
	*/
	get target() {
		const errorMessage = "Output.target cannot be used when using PathedTarget with an async callback. Use the 'target' event instead.";
		if (this._rootTargetPromise) throw new TypeError(errorMessage);
		const rootTargetResult = this._getRootTarget();
		if (rootTargetResult instanceof Promise) throw new TypeError(errorMessage);
		return rootTargetResult;
	}
	/**
	* Creates a new instance of {@link Output} which can then be used to create a new media file according to the
	* specified {@link OutputOptions}.
	*/
	constructor(options) {
		super();
		/** The current state of the output. */
		this.state = "pending";
		/**
		* The {@link OutputTrackGroup} that all tracks are assigned to by default unless otherwise specified by
		* {@link BaseTrackMetadata.group}.
		*/
		this.defaultTrackGroup = new OutputTrackGroup();
		/**
		* The tracks that have been added to this output. Treat it as a readonly field; to add tracks, use the methods.
		*/
		this.tracks = [];
		/** @internal */
		this._onFinalize = null;
		/** @internal */
		this._unfinalizedTargets = /* @__PURE__ */ new Set();
		/** @internal */
		this._rootWriterPromise = null;
		/** @internal */
		this._startPromise = null;
		/** @internal */
		this._cancelPromise = null;
		/** @internal */
		this._finalizePromise = null;
		/** @internal */
		this._mutex = new AsyncMutex();
		/** @internal */
		this._metadataTags = {};
		/** @internal */
		this._rootTarget = null;
		/** @internal */
		this._rootTargetPromise = null;
		/**
		* This field is used to synchronize multiple MediaStreamTracks. They use the same time coordinate system across
		* tracks, and to ensure correct audio-video sync, we must use the same offset for all of them. The reason an offset
		* is needed at all is because the timestamps typically don't start at zero.
		* @internal
		*/
		this._firstMediaStreamTimestamp = null;
		if (!options || typeof options !== "object") throw new TypeError("options must be an object.");
		if (!(options.format instanceof OutputFormat)) throw new TypeError("options.format must be an OutputFormat.");
		if (!(options.target instanceof Target || options.target instanceof PathedTarget)) throw new TypeError("options.target must be a Target or a PathedTarget.");
		if (options.target instanceof Target) this._rememberTarget(options.target);
		if (options.initTarget !== void 0 && !(options.initTarget instanceof Target) && typeof options.initTarget !== "function") throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
		if (options.onFinalize !== void 0 && typeof options.onFinalize !== "function") throw new TypeError("options.onFinalize, when provided, must be a function.");
		this.format = options.format;
		this._target = options.target;
		this._onFinalize = options.onFinalize ?? null;
		this._initTarget = options.initTarget ?? null;
		if (this._initTarget instanceof Target) this._rememberTarget(this._initTarget);
		this._muxer = options.format._createMuxer(this);
	}
	/** @internal */
	_getTargetValidated(request) {
		assert$3(this._target instanceof PathedTarget);
		const result = this._target.getTarget(request);
		const handleResult = (result$1) => {
			if (!(result$1 instanceof Target)) throw new TypeError("getTarget must return a Target.");
			return result$1;
		};
		if (result instanceof Promise) return result.then(handleResult);
		else return handleResult(result);
	}
	/** @internal */
	async _getTarget(request) {
		assert$3(this._target instanceof PathedTarget);
		const target = await this._getTargetValidated(request);
		this._emit("target", {
			target,
			request,
			isRoot: request.isRoot
		});
		if (this.state === "canceled") await target._close();
		else this._rememberTarget(target);
		return target;
	}
	/** @internal */
	_rememberTarget(target) {
		this._unfinalizedTargets.add(target);
		target.on("finalized", () => this._unfinalizedTargets.delete(target), { once: true });
	}
	/** @internal */
	async _getInitTarget() {
		assert$3(this._initTarget !== null);
		if (this._initTarget instanceof Target) return this._initTarget;
		const target = await this._initTarget();
		if (this.state === "canceled") await target._close();
		else this._rememberTarget(target);
		return target;
	}
	/** @internal */
	_hasInitTarget() {
		return this._initTarget !== null;
	}
	/** @internal */
	_getRootTarget() {
		if (this._rootTarget) return this._rootTarget;
		if (this._rootTargetPromise) return this._rootTargetPromise;
		if (this._target instanceof Target) {
			this._emit("target", {
				target: this._target,
				request: null,
				isRoot: true
			});
			this._rootTarget = this._target;
			return this._target;
		}
		const request = {
			path: this._target.rootPath,
			isRoot: true,
			mimeType: this.format.mimeType
		};
		const result = this._getTargetValidated(request);
		const handleResult = (target) => {
			if (this.state === "canceled") target._close();
			else this._rememberTarget(target);
			this._emit("target", {
				target,
				request,
				isRoot: true
			});
			this._rootTarget = target;
			return target;
		};
		if (result instanceof Promise) return this._rootTargetPromise = result.then(handleResult);
		else return handleResult(result);
	}
	/** @internal */
	_getRootWriter(isMonotonic) {
		return this._rootWriterPromise ??= (async () => {
			const target = await this._getRootTarget();
			const writer = new Writer(target, typeof isMonotonic === "boolean" ? isMonotonic : isMonotonic(target));
			writer.start();
			return writer;
		})();
	}
	/** Adds a video track to the output with the given source. Can only be called before the output is started. */
	addVideoTrack(source, metadata = {}) {
		if (!(source instanceof VideoSource)) throw new TypeError("source must be a VideoSource.");
		validateBaseTrackMetadata(metadata);
		if (metadata.rotation !== void 0 && ![
			0,
			90,
			180,
			270
		].includes(metadata.rotation)) throw new TypeError(`Invalid video rotation: ${metadata.rotation}. Has to be 0, 90, 180 or 270.`);
		if (!this.format.supportsVideoRotationMetadata && metadata.rotation) throw new Error(`${this.format._name} does not support video rotation metadata.`);
		if (metadata.frameRate !== void 0 && (!Number.isFinite(metadata.frameRate) || metadata.frameRate <= 0)) throw new TypeError(`Invalid video frame rate: ${metadata.frameRate}. Must be a positive number.`);
		const metadataCopy = { ...metadata };
		metadataCopy.group ??= this.defaultTrackGroup;
		return this._addTrack(new OutputVideoTrack(this.tracks.length + 1, this, source, metadataCopy));
	}
	/** Adds an audio track to the output with the given source. Can only be called before the output is started. */
	addAudioTrack(source, metadata = {}) {
		if (!(source instanceof AudioSource)) throw new TypeError("source must be an AudioSource.");
		validateBaseTrackMetadata(metadata);
		const metadataCopy = { ...metadata };
		metadataCopy.group ??= this.defaultTrackGroup;
		return this._addTrack(new OutputAudioTrack(this.tracks.length + 1, this, source, metadataCopy));
	}
	/** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
	addSubtitleTrack(source, metadata = {}) {
		if (!(source instanceof SubtitleSource)) throw new TypeError("source must be a SubtitleSource.");
		validateBaseTrackMetadata(metadata);
		const metadataCopy = { ...metadata };
		metadataCopy.group ??= this.defaultTrackGroup;
		return this._addTrack(new OutputSubtitleTrack(this.tracks.length + 1, this, source, metadataCopy));
	}
	/**
	* Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
	* multiple times, only the metadata from the last call will be used.
	*
	* Can only be called before the output is started.
	*/
	setMetadataTags(tags) {
		validateMetadataTags(tags);
		if (this.state !== "pending") throw new Error("Cannot set metadata tags after output has been started or canceled.");
		this._metadataTags = tags;
	}
	/** @internal */
	_addTrack(track) {
		if (this.state !== "pending") throw new Error("Cannot add track after output has been started or canceled.");
		if (track.source._connectedTrack) throw new Error("Source is already used for a track.");
		const supportedTrackCounts = this.format.getSupportedTrackCounts();
		const presentTracksOfThisType = this.tracks.reduce((count, t) => count + (t.type === track.type ? 1 : 0), 0);
		const maxCount = supportedTrackCounts[track.type].max;
		if (presentTracksOfThisType === maxCount) throw new Error(maxCount === 0 ? `${this.format._name} does not support ${track.type} tracks.` : `${this.format._name} does not support more than ${maxCount} ${track.type} track${maxCount === 1 ? "" : "s"}.`);
		const maxTotalCount = supportedTrackCounts.total.max;
		if (this.tracks.length === maxTotalCount) throw new Error(`${this.format._name} does not support more than ${maxTotalCount} tracks${maxTotalCount === 1 ? "" : "s"} in total.`);
		if (track.isVideoTrack()) {
			const supportedVideoCodecs = this.format.getSupportedVideoCodecs();
			if (supportedVideoCodecs.length === 0) throw new Error(`${this.format._name} does not support video tracks.` + this.format._codecUnsupportedHint(track.source._codec));
			else if (!supportedVideoCodecs.includes(track.source._codec)) throw new Error(`Codec '${track.source._codec}' cannot be contained within ${this.format._name}. Supported video codecs are: ${supportedVideoCodecs.map((codec) => `'${codec}'`).join(", ")}.` + this.format._codecUnsupportedHint(track.source._codec));
		} else if (track.isAudioTrack()) {
			const supportedAudioCodecs = this.format.getSupportedAudioCodecs();
			if (supportedAudioCodecs.length === 0) throw new Error(`${this.format._name} does not support audio tracks.` + this.format._codecUnsupportedHint(track.source._codec));
			else if (!supportedAudioCodecs.includes(track.source._codec)) throw new Error(`Codec '${track.source._codec}' cannot be contained within ${this.format._name}. Supported audio codecs are: ${supportedAudioCodecs.map((codec) => `'${codec}'`).join(", ")}.` + this.format._codecUnsupportedHint(track.source._codec));
		} else if (track.isSubtitleTrack()) {
			const supportedSubtitleCodecs = this.format.getSupportedSubtitleCodecs();
			if (supportedSubtitleCodecs.length === 0) throw new Error(`${this.format._name} does not support subtitle tracks.` + this.format._codecUnsupportedHint(track.source._codec));
			else if (!supportedSubtitleCodecs.includes(track.source._codec)) throw new Error(`Codec '${track.source._codec}' cannot be contained within ${this.format._name}. Supported subtitle codecs are: ${supportedSubtitleCodecs.map((codec) => `'${codec}'`).join(", ")}.` + this.format._codecUnsupportedHint(track.source._codec));
		}
		this.tracks.push(track);
		track.source._connectedTrack = track;
		return track;
	}
	/**
	* Whether the output has enough tracks (of the correct type) to be started, based on the requirements of the output
	* format.
	*/
	hasEnoughTracks() {
		const supportedTrackCounts = this.format.getSupportedTrackCounts();
		for (const trackType of ALL_TRACK_TYPES) if (this.tracks.reduce((count, track) => count + (track.type === trackType ? 1 : 0), 0) < supportedTrackCounts[trackType].min) return false;
		const totalMinCount = supportedTrackCounts.total.min;
		if (this.tracks.length < totalMinCount) return false;
		return true;
	}
	/**
	* Starts the creation of the output file. This method should be called after all tracks have been added. Only after
	* the output has started can media samples be added to the tracks.
	*
	* @returns A promise that resolves when the output has successfully started and is ready to receive media samples.
	*/
	async start() {
		const supportedTrackCounts = this.format.getSupportedTrackCounts();
		for (const trackType of ALL_TRACK_TYPES) {
			const presentTracksOfThisType = this.tracks.reduce((count, track) => count + (track.type === trackType ? 1 : 0), 0);
			const minCount = supportedTrackCounts[trackType].min;
			if (presentTracksOfThisType < minCount) throw new Error(minCount === supportedTrackCounts[trackType].max ? `${this.format._name} requires exactly ${minCount} ${trackType} track${minCount === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${minCount} ${trackType} track${minCount === 1 ? "" : "s"}.`);
		}
		const totalMinCount = supportedTrackCounts.total.min;
		if (this.tracks.length < totalMinCount) throw new Error(totalMinCount === supportedTrackCounts.total.max ? `${this.format._name} requires exactly ${totalMinCount} track${totalMinCount === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${totalMinCount} track${totalMinCount === 1 ? "" : "s"}.`);
		if (this.state === "canceled") throw new Error("Output has been canceled.");
		if (this._startPromise) {
			Logging$1._warn("Output has already been started.");
			return this._startPromise;
		}
		return this._startPromise = (async () => {
			this.state = "started";
			const release = await this._mutex.acquire();
			try {
				await this._muxer.start();
				const promises = this.tracks.map((track) => track.source._start());
				await Promise.all(promises);
			} finally {
				release();
			}
		})();
	}
	/**
	* Resolves with the full MIME type of the output file, including track codecs.
	*
	* The returned promise will resolve only once the precise codec strings of all tracks are known.
	*/
	getMimeType() {
		return this._muxer.getMimeType();
	}
	/**
	* Cancels the creation of the output file, releasing internal resources like encoders and preventing further
	* samples from being added.
	*
	* @returns A promise that resolves once all internal resources have been released.
	*/
	async cancel() {
		if (this._cancelPromise) {
			Logging$1._warn("Output has already been canceled.");
			return this._cancelPromise;
		} else if (this.state === "finalizing" || this.state === "finalized") {
			if (this.state === "finalized") Logging$1._warn("Output has already been finalized.");
			return;
		}
		return this._cancelPromise = (async () => {
			this.state = "canceled";
			const release = await this._mutex.acquire();
			try {
				const promises = this.tracks.map((x$1) => x$1.source._flushOrWaitForOngoingClose(true));
				await Promise.all(promises);
				await Promise.all([...this._unfinalizedTargets].map((target) => target._close()));
				this._unfinalizedTargets.clear();
			} finally {
				release();
			}
		})();
	}
	/**
	* Finalizes the output file. This method must be called after all media samples across all tracks have been added.
	* Once the Promise returned by this method completes, the output file is ready.
	*/
	async finalize() {
		if (this.state === "pending") throw new Error("Cannot finalize before starting.");
		if (this.state === "canceled") throw new Error("Cannot finalize after canceling.");
		if (this._finalizePromise) {
			Logging$1._warn("Output has already been finalized.");
			return this._finalizePromise;
		}
		return this._finalizePromise = (async () => {
			this.state = "finalizing";
			const release = await this._mutex.acquire();
			try {
				const promises = this.tracks.map((x$1) => x$1.source._flushOrWaitForOngoingClose(false));
				await Promise.all(promises);
				await this._muxer.finalize();
				if (this._rootWriterPromise) {
					const rootWriter = await this._rootWriterPromise;
					if (!rootWriter.finalized) {
						await rootWriter.flush();
						await rootWriter.finalize();
					}
				}
				if (this._onFinalize) await this._onFinalize();
				this.state = "finalized";
			} finally {
				release();
			}
		})();
	}
};

//#endregion
//#region src/errors.ts
let ExitCode = /* @__PURE__ */ function(ExitCode$1) {
	ExitCode$1[ExitCode$1["SUCCESS"] = 0] = "SUCCESS";
	ExitCode$1[ExitCode$1["INPUT_ERROR"] = 2] = "INPUT_ERROR";
	ExitCode$1[ExitCode$1["GRAPH_ERROR"] = 3] = "GRAPH_ERROR";
	ExitCode$1[ExitCode$1["RENDER_ERROR"] = 4] = "RENDER_ERROR";
	ExitCode$1[ExitCode$1["PROVIDER_ERROR"] = 5] = "PROVIDER_ERROR";
	ExitCode$1[ExitCode$1["TIMEOUT_ERROR"] = 6] = "TIMEOUT_ERROR";
	ExitCode$1[ExitCode$1["FATAL_ERROR"] = 7] = "FATAL_ERROR";
	return ExitCode$1;
}({});
var CliError = class extends Error {
	exitCode;
	code;
	constructor(message, exitCode = ExitCode.INPUT_ERROR, code = "E_INPUT") {
		super(message);
		this.name = "CliError";
		this.exitCode = exitCode;
		this.code = code;
	}
};
function handleCliError(err, json = false) {
	const message = err instanceof Error ? err.message : String(err);
	let exitCode = ExitCode.FATAL_ERROR;
	let code = "E_FATAL";
	if (err instanceof CliError) {
		exitCode = err.exitCode;
		code = err.code;
	} else if (message.includes("Spec validation failed") || message.includes("requires spec.json") || message.includes("Unknown command")) {
		exitCode = ExitCode.INPUT_ERROR;
		code = "E_INPUT";
	} else if (message.includes("Edge references unknown node") || message.includes("not found in spec") || message.includes("graph")) {
		exitCode = ExitCode.GRAPH_ERROR;
		code = "E_GRAPH";
	} else if (message.includes("Target node result does not contain") || message.includes("render") || message.includes("Renderer did not return")) {
		exitCode = ExitCode.RENDER_ERROR;
		code = "E_RENDER";
	} else if (message.includes("API key") || message.includes("401") || message.includes("Authentication")) {
		exitCode = ExitCode.PROVIDER_ERROR;
		code = "E_PROVIDER_NO_KEY";
	}
	if (json) console.error(JSON.stringify({
		error: message,
		code,
		exitCode,
		stack: err instanceof Error ? err.stack : void 0
	}));
	else {
		console.error(`✖ Error [${code}]: ${message}`);
		if (!(err instanceof CliError) && err instanceof Error && err.stack) console.error(err.stack);
	}
	process.exit(exitCode);
}

//#endregion
//#region src/polyfill.ts
globalThis.__IS_HEADLESS_RENDERER__ = true;
/**
* Polyfills Node.js globalThis.fetch for `file://` URLs.
* Intercepts local `file://` requests and reads content directly via Node fs.promises.readFile.
* Maps asset requests to the correct local file by exact path or most recent modification time.
*/
function setupFetchPolyfill() {
	if (typeof globalThis.fetch === "function" && !globalThis.__FILE_FETCH_POLYFILLED__) {
		globalThis.__FILE_FETCH_POLYFILLED__ = true;
		const origFetch = globalThis.fetch;
		globalThis.fetch = async (input, init) => {
			const urlStr = typeof input === "string" ? input : input instanceof URL ? input.href : input?.url;
			if (typeof urlStr === "string" && urlStr.startsWith("file://")) try {
				let filePath = fileURLToPath(urlStr);
				if (!fs.existsSync(filePath)) {
					const storageTmpDir = process.env.GATEWAI_STORAGE_DIR ? path.resolve(process.env.GATEWAI_STORAGE_DIR) : path.join(os.tmpdir(), "gatewai-storage");
					if (fs.existsSync(storageTmpDir)) {
						const findStorageFile = (dir) => {
							try {
								const files = [];
								const scan = (d) => {
									const entries = fs.readdirSync(d, { withFileTypes: true });
									for (const entry of entries) {
										const fullPath = path.join(d, entry.name);
										if (entry.isDirectory()) scan(fullPath);
										else if (entry.name.endsWith(".mp4") || entry.name.endsWith(".png") || entry.name.endsWith(".mp3")) {
											const stat = fs.statSync(fullPath);
											files.push({
												path: fullPath,
												mtime: stat.mtimeMs
											});
										}
									}
								};
								scan(dir);
								if (files.length === 0) return null;
								const targetName = path.basename(filePath);
								const exact = files.find((f) => f.path.includes(targetName));
								if (exact) return exact.path;
								const parts = targetName.split("_");
								if (parts.length >= 2) {
									const prefix = parts.slice(0, 2).join("_");
									const fuzzy = files.find((f) => f.path.includes(prefix));
									if (fuzzy) return fuzzy.path;
								}
								return null;
							} catch {}
							return null;
						};
						const matchedFile = findStorageFile(storageTmpDir);
						if (matchedFile) filePath = matchedFile;
					}
				}
				const data = await fs.promises.readFile(filePath);
				const res = new Response(data, {
					status: 200,
					headers: { "content-type": "application/octet-stream" }
				});
				const resolvedUrl = new URL(urlStr).href;
				Object.defineProperty(res, "url", {
					get: () => resolvedUrl,
					configurable: true
				});
				return res;
			} catch (e) {
				const res = new Response(`File not found: ${e?.message}`, { status: 404 });
				const resolvedUrl = new URL(urlStr).href;
				Object.defineProperty(res, "url", {
					get: () => resolvedUrl,
					configurable: true
				});
				return res;
			}
			return origFetch(input, init);
		};
	}
}
setupFetchPolyfill();

//#endregion
//#region ../../packages/canvas-engine/dist/memory-DaTZ1zSl.mjs
var EngineError = class extends Error {
	constructor(message) {
		super(`[CanvasEngine] ${message}`);
		this.name = "EngineError";
	}
};
function checkGraphIntegrity(nodes, edges, handles, nodeRegistry) {
	const errors = [];
	const warnings = [];
	const nodeById = new Map(nodes.map((n) => [n.id, n]));
	const handleById = new Map(handles.map((h$1) => [h$1.id, h$1]));
	const nodeLabel = (id) => {
		const n = nodeById.get(id);
		return n ? `"${n.name}" [${n.type}] (id:${id})` : `(missing node id:${id})`;
	};
	const handleLabel = (h$1) => h$1 ? `[${h$1.type === "Input" ? "IN" : "OUT"}] "${h$1.label}" on ${nodeLabel(h$1.nodeId)}` : "(missing handle)";
	handles.forEach((h$1) => {
		if (!nodeById.has(h$1.nodeId)) errors.push(`Handle "${h$1.label}" (id:${h$1.id}) belongs to a node that doesn't exist (id:${h$1.nodeId}).`);
	});
	const targetOccupancy = /* @__PURE__ */ new Map();
	edges.forEach((e) => {
		const sh = handleById.get(e.sourceHandleId);
		const th = handleById.get(e.targetHandleId);
		if (!sh) {
			errors.push(`Edge (id:${e.id}) references a source handle that doesn't exist (id:${e.sourceHandleId}).`);
			return;
		}
		if (!th) {
			errors.push(`Edge (id:${e.id}) references a target handle that doesn't exist (id:${e.targetHandleId}).`);
			return;
		}
		if (sh.type !== "Output") errors.push(`Edge (id:${e.id}): source ${handleLabel(sh)} is not an Output handle.`);
		if (th.type !== "Input") errors.push(`Edge (id:${e.id}): target ${handleLabel(th)} is not an Input handle.`);
		if (sh.nodeId === th.nodeId) errors.push(`Edge (id:${e.id}): self-loop on ${nodeLabel(sh.nodeId)}.`);
		if ((sh.dataTypes ?? []).filter((dt) => (th.dataTypes ?? []).includes(dt)).length === 0) errors.push(`Edge (id:${e.id}): incompatible dataTypes between ${handleLabel(sh)} and ${handleLabel(th)}.`);
		if (targetOccupancy.has(e.targetHandleId)) errors.push(`Input ${handleLabel(th)} has more than one incoming edge — each Input may only have one.`);
		else targetOccupancy.set(e.targetHandleId, e);
	});
	handles.filter((h$1) => h$1.type === "Input" && h$1.required).forEach((h$1) => {
		if (!targetOccupancy.has(h$1.id)) warnings.push(`Required input ${handleLabel(h$1)} has no incoming connection.`);
	});
	if (nodeRegistry) nodes.forEach((node$1) => {
		if (!node$1.config) return;
		const manifest = nodeRegistry.getManifest(node$1.type);
		if (manifest?.configSchema) {
			const res = manifest.configSchema.safeParse(node$1.config);
			if (!res.success) res.error.issues.forEach((issue) => {
				const path$1 = issue.path.join(".") || "(root)";
				errors.push(`Invalid config key "${path$1}" on ${nodeLabel(node$1.id)}: ${issue.message}`);
			});
		}
	});
	const validationPayload = {
		nodes,
		edges,
		handles
	};
	const zodValidation = agentBulkUpdateSchema.safeParse(validationPayload);
	if (!zodValidation.success) zodValidation.error.issues.forEach((issue) => {
		const path$1 = issue.path.join(".") || "(root)";
		errors.push(`Zod Schema error: ${path$1}: ${issue.message}`);
	});
	return {
		valid: errors.length === 0,
		errors,
		warnings
	};
}
var CanvasEngine = class CanvasEngine$1 {
	nodes = [];
	edges = [];
	handles = [];
	templates = [];
	snapshotNodes = "";
	snapshotEdges = "";
	snapshotHandles = "";
	constructor(canvasId, sessionId, nodeRegistry) {
		this.canvasId = canvasId;
		this.sessionId = sessionId;
		this.nodeRegistry = nodeRegistry;
	}
	/**
	* Build an engine that runs purely in-memory: templates are supplied directly
	* (no Redis context, no database). Useful for headless/CLI/offline use where
	* the canvas is assembled from a spec rather than persisted.
	*
	* `templates` should be shaped like `ensureContext`'s transformed templates:
	*   { id, type, templateHandles: [{ type:'Input'|'Output', label, dataTypes, order, required }],
	*     variableInputs?: {enabled, dataTypes}, variableOutputs?: {enabled, dataTypes} }
	*/
	static createInMemory(canvasId, sessionId, nodeRegistry, templates) {
		const engine = new CanvasEngine$1(canvasId, sessionId, nodeRegistry);
		engine.nodes = [];
		engine.edges = [];
		engine.handles = [];
		engine.templates = structuredClone(templates);
		return engine;
	}
	generateId() {
		return `temp-${crypto.randomUUID()}`;
	}
	snapshot() {
		this.snapshotNodes = JSON.stringify(this.nodes);
		this.snapshotEdges = JSON.stringify(this.edges);
		this.snapshotHandles = JSON.stringify(this.handles);
	}
	restore() {
		if (this.snapshotNodes) this.nodes = JSON.parse(this.snapshotNodes);
		if (this.snapshotEdges) this.edges = JSON.parse(this.snapshotEdges);
		if (this.snapshotHandles) this.handles = JSON.parse(this.snapshotHandles);
	}
	get nodeCount() {
		return this.nodes.length;
	}
	get edgeCount() {
		return this.edges.length;
	}
	get handleCount() {
		return this.handles.length;
	}
	getNodes() {
		return this.nodes;
	}
	getEdges() {
		return this.edges;
	}
	getHandles() {
		return this.handles;
	}
	getTemplates() {
		return this.templates;
	}
	findTemplate(type) {
		const t = this.templates.find((x$1) => x$1.type === type);
		if (!t) throw new EngineError(`Unknown node type "${type}". Available types: [${this.templates.map((x$1) => x$1.type).sort().join(", ")}]`);
		return t;
	}
	findNode(id) {
		const found = this.nodes.find((n) => n.id === id);
		if (!found) throw new EngineError(`No node matched ID "${id}". Nodes on canvas: [${this.nodes.map((n) => `"${n.name}" [${n.type}] (id:${n.id})`).join(", ") || "none"}]`);
		return found;
	}
	findNodeByName(name) {
		const found = this.nodes.find((n) => n.name === name);
		if (!found) throw new EngineError(`No node named "${name}". Node names on canvas: [${this.nodes.map((n) => `"${n.name}"`).join(", ") || "none"}]`);
		return found;
	}
	findNodesByType(type) {
		return this.nodes.filter((n) => n.type === type);
	}
	findNodeByIdOrName(idOrName) {
		const found = this.nodes.find((n) => n.id === idOrName || n.name === idOrName);
		if (!found) throw new EngineError(`No node matched ID or name "${idOrName}". Node roster: [${this.nodes.map((n) => `"${n.name}" (${n.id})`).join(", ") || "none"}]`);
		return found;
	}
	getHandlesForNode(nodeId) {
		this.findNode(nodeId);
		const all = this.handles.filter((h$1) => h$1.nodeId === nodeId);
		return {
			allHandles: all,
			inputHandles: all.filter((h$1) => h$1.type === "Input"),
			outputHandles: all.filter((h$1) => h$1.type === "Output")
		};
	}
	getHandle(nodeId, label, handleType) {
		const nodeHandles = this.handles.filter((h$1) => h$1.nodeId === nodeId && (handleType == null || h$1.type === handleType));
		const found = nodeHandles.find((h$1) => h$1.label === label);
		if (!found) {
			const dirStr = handleType ? `${handleType} ` : "";
			const available = nodeHandles.map((h$1) => `"${h$1.label}"`).join(", ");
			const node$1 = this.findNode(nodeId);
			throw new EngineError(`No ${dirStr}handle labeled "${label}" on node "${node$1.name}" [${node$1.type}]. Available: [${available || "none"}]`);
		}
		return found;
	}
	getOutputHandle(nodeId, label) {
		const outputs = this.handles.filter((h$1) => h$1.nodeId === nodeId && h$1.type === "Output");
		const found = label == null ? outputs[0] : outputs.find((h$1) => h$1.label === label);
		if (!found) {
			const available = outputs.map((h$1) => `"${h$1.label}"`).join(", ");
			const node$1 = this.findNode(nodeId);
			throw new EngineError(`No Output handle${label ? ` labeled "${label}"` : ""} on node "${node$1.name}" [${node$1.type}]. Available: [${available || "none"}]`);
		}
		return found;
	}
	getInputHandle(nodeId, label) {
		const inputs = this.handles.filter((h$1) => h$1.nodeId === nodeId && h$1.type === "Input");
		const found = label == null ? inputs[0] : inputs.find((h$1) => h$1.label === label);
		if (!found) {
			const available = inputs.map((h$1) => `"${h$1.label}"`).join(", ");
			const node$1 = this.findNode(nodeId);
			throw new EngineError(`No Input handle${label ? ` labeled "${label}"` : ""} on node "${node$1.name}" [${node$1.type}]. Available: [${available || "none"}]`);
		}
		return found;
	}
	createNode(params) {
		const { type, name, position = {
			x: 0,
			y: 0
		}, config = {} } = params;
		const template = this.findTemplate(type);
		const nodeId = this.generateId();
		const resolvedName = name ?? type;
		const createdHandles = [];
		template.templateHandles.forEach((th) => {
			createdHandles.push({
				id: this.generateId(),
				type: th.type,
				dataTypes: th.dataTypes,
				label: th.label,
				order: th.order,
				nodeId,
				required: th.required ?? false,
				templateHandleId: th.id
			});
		});
		const manifest = this.nodeRegistry.getManifest(type);
		const mergedConfig = {
			...manifest?.defaultConfig ?? {},
			...config
		};
		if (manifest?.configSchema) {
			const val = manifest.configSchema.safeParse(mergedConfig);
			if (!val.success) console.warn(`[CanvasEngine] Config validation warnings during creation of "${resolvedName}" [${type}]:`, val.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "));
		}
		const node$1 = {
			id: nodeId,
			name: resolvedName,
			type: template.type,
			templateId: template.id,
			position,
			width: 340,
			config: mergedConfig
		};
		this.nodes.push(node$1);
		createdHandles.forEach((h$1) => this.handles.push(h$1));
		return {
			node: node$1,
			nodeId,
			allHandles: createdHandles,
			inputHandles: createdHandles.filter((h$1) => h$1.type === "Input"),
			outputHandles: createdHandles.filter((h$1) => h$1.type === "Output")
		};
	}
	removeNode(nodeId) {
		const nodeIdx = this.nodes.findIndex((n) => n.id === nodeId);
		if (nodeIdx === -1) return;
		const nodeHandleIds = new Set(this.handles.filter((h$1) => h$1.nodeId === nodeId).map((h$1) => h$1.id));
		this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId && !nodeHandleIds.has(e.sourceHandleId) && !nodeHandleIds.has(e.targetHandleId));
		this.handles = this.handles.filter((h$1) => h$1.nodeId !== nodeId);
		this.nodes.splice(nodeIdx, 1);
	}
	connectHandles(sourceHandle, targetHandle) {
		if (sourceHandle.type !== "Output") throw new EngineError(`Source handle "${sourceHandle.label}" must be type Output, got ${sourceHandle.type}`);
		if (targetHandle.type !== "Input") throw new EngineError(`Target handle "${targetHandle.label}" must be type Input, got ${targetHandle.type}`);
		if (sourceHandle.nodeId === targetHandle.nodeId) throw new EngineError(`Self-loop detected — source and target are both on node "${sourceHandle.nodeId}"`);
		if (sourceHandle.dataTypes.filter((dt) => targetHandle.dataTypes.includes(dt)).length === 0) throw new EngineError(`Incompatible dataTypes: source accepts [${sourceHandle.dataTypes.join(", ")}], but target accepts [${targetHandle.dataTypes.join(", ")}]`);
		if (this.edges.some((e) => e.sourceHandleId === sourceHandle.id && e.targetHandleId === targetHandle.id)) throw new EngineError(`Edge already exists between these handles.`);
		const occupant = this.edges.find((e) => e.targetHandleId === targetHandle.id);
		if (occupant) {
			const occupantSrc = this.handles.find((h$1) => h$1.id === occupant.sourceHandleId);
			const targetNode = this.findNode(targetHandle.nodeId);
			const occupantSrcNode = occupantSrc ? this.findNode(occupantSrc.nodeId) : null;
			throw new EngineError(`Input handle "${targetHandle.label}" on node "${targetNode.name}" is already occupied by connection from "${occupantSrcNode?.name ?? "unknown"}". Remove the edge first.`);
		}
		const edge = {
			id: this.generateId(),
			source: sourceHandle.nodeId,
			target: targetHandle.nodeId,
			sourceHandleId: sourceHandle.id,
			targetHandleId: targetHandle.id
		};
		this.edges.push(edge);
		return edge;
	}
	connect(params) {
		const sh = this.getOutputHandle(params.sourceNodeId, params.sourceLabel);
		const th = this.getInputHandle(params.targetNodeId, params.targetLabel);
		return this.connectHandles(sh, th);
	}
	tryConnect(params) {
		try {
			return this.connect(params);
		} catch (e) {
			console.log("[tryConnect skipped]", e instanceof Error ? e.message : String(e));
			return null;
		}
	}
	disconnectNodes(params) {
		const { sourceNodeId, targetNodeId, sourceLabel, targetLabel } = params;
		const idx = this.edges.findIndex((e) => {
			if (e.source !== sourceNodeId || e.target !== targetNodeId) return false;
			if (sourceLabel != null) {
				const sh = this.handles.find((h$1) => h$1.id === e.sourceHandleId);
				if (!sh || sh.label !== sourceLabel) return false;
			}
			if (targetLabel != null) {
				const th = this.handles.find((h$1) => h$1.id === e.targetHandleId);
				if (!th || th.label !== targetLabel) return false;
			}
			return true;
		});
		if (idx === -1) throw new EngineError(`No edge found from node "${sourceNodeId}" to "${targetNodeId}".`);
		this.edges.splice(idx, 1);
	}
	updateNodeConfig(nodeId, patch) {
		const node$1 = this.findNode(nodeId);
		const manifest = this.nodeRegistry.getManifest(node$1.type);
		const mergedConfig = {
			...node$1.config ?? {},
			...patch
		};
		if (manifest?.configSchema) {
			const val = manifest.configSchema.safeParse(mergedConfig);
			if (!val.success) {
				const issues = val.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
				throw new EngineError(`Invalid config patch for node "${node$1.name}" [${node$1.type}]:\n` + issues.map((i) => `  • ${i}`).join("\n"));
			}
		}
		node$1.config = mergedConfig;
		return node$1;
	}
	moveNode(nodeId, position) {
		const node$1 = this.findNode(nodeId);
		node$1.position = position;
		return node$1;
	}
	addDynamicInput(nodeId, label, dataTypes) {
		const node$1 = this.findNode(nodeId);
		const template = this.findTemplate(node$1.type);
		if (!template.variableInputs || !template.variableInputs.enabled) throw new EngineError(`Node "${node$1.name}" [${node$1.type}] does not support variable/dynamic inputs.`);
		const allowed = template.variableInputs.dataTypes ?? [];
		const invalid = dataTypes.filter((dt) => !allowed.includes(dt));
		if (invalid.length > 0) throw new EngineError(`Invalid dataType(s) [${invalid.join(", ")}] for node "${node$1.name}" [${node$1.type}]. Supports: [${allowed.join(", ")}]`);
		const existing = this.handles.filter((h$1) => h$1.nodeId === nodeId && h$1.type === "Input");
		const handle = {
			id: this.generateId(),
			type: "Input",
			dataTypes,
			label,
			order: existing.length,
			nodeId,
			required: false
		};
		this.handles.push(handle);
		return handle;
	}
	addDynamicOutput(nodeId, label, dataTypes) {
		const node$1 = this.findNode(nodeId);
		const template = this.findTemplate(node$1.type);
		if (!template.variableOutputs || !template.variableOutputs.enabled) throw new EngineError(`Node "${node$1.name}" [${node$1.type}] does not support variable/dynamic outputs.`);
		const allowed = template.variableOutputs.dataTypes ?? [];
		const invalid = dataTypes.filter((dt) => !allowed.includes(dt));
		if (invalid.length > 0) throw new EngineError(`Invalid dataType(s) [${invalid.join(", ")}] for node "${node$1.name}" [${node$1.type}]. Supports: [${allowed.join(", ")}]`);
		const existing = this.handles.filter((h$1) => h$1.nodeId === nodeId && h$1.type === "Output");
		const handle = {
			id: this.generateId(),
			type: "Output",
			dataTypes,
			label,
			order: existing.length,
			nodeId,
			required: false
		};
		this.handles.push(handle);
		return handle;
	}
	addCompositorInput(nodeId, label, dataTypes) {
		const node$1 = this.findNode(nodeId);
		if (node$1.type !== "Compositor") throw new EngineError(`Node "${node$1.name}" [${node$1.type}] is not a Compositor.`);
		return this.addDynamicInput(nodeId, label, dataTypes);
	}
	setCompositorLayer(nodeId, inputHandleId, layerConfig) {
		const node$1 = this.findNode(nodeId);
		const handle = this.handles.find((h$1) => h$1.id === inputHandleId);
		if (!handle) throw new EngineError(`Handle "${inputHandleId}" not found on canvas.`);
		if (handle.nodeId !== nodeId || handle.type !== "Input") throw new EngineError(`Handle "${handle.label}" is not an Input on compositor "${node$1.name}".`);
		const layout = Array.isArray(node$1.config?.layout) ? node$1.config.layout : [];
		const existingIndex = layout.findIndex((l$1) => l$1.kind === "media" && l$1.inputHandleId === handle.id);
		const newLayer = {
			kind: "media",
			inputHandleId: handle.id,
			opacity: 1,
			...layerConfig
		};
		if (!newLayer.id) newLayer.id = `media-${handle.id}`;
		const newLayout = existingIndex >= 0 ? layout.map((l$1, i) => i === existingIndex ? newLayer : l$1) : [...layout, newLayer];
		node$1.config = {
			...node$1.config,
			layout: newLayout
		};
		return node$1;
	}
	createCompositorNode(params) {
		const { type = "Compositor", name, position = {
			x: 0,
			y: 0
		}, config = {}, inputs = [], layers = [] } = params;
		const mergedConfig = {
			layout: [],
			width: 1080,
			height: 1080,
			fps: 24,
			backgroundColor: "#000000",
			...config
		};
		const result = this.createNode({
			type,
			name: name ?? type,
			position,
			config: mergedConfig
		});
		inputs.forEach((inp) => {
			this.addCompositorInput(result.nodeId, inp.label, inp.dataTypes);
		});
		result.allHandles = this.handles.filter((h$1) => h$1.nodeId === result.nodeId);
		result.inputHandles = result.allHandles.filter((h$1) => h$1.type === "Input");
		result.outputHandles = result.allHandles.filter((h$1) => h$1.type === "Output");
		layers.forEach((layer) => {
			const handle = this.getInputHandle(result.nodeId, layer.handleLabel);
			this.setCompositorLayer(result.nodeId, handle.id, layer.config ?? {
				opacity: 1,
				blendMode: "source-over"
			});
		});
		return result;
	}
	autoLayout(params) {
		const { nodeIds, startX = 100, startY = 100, hSpacing = 500, vSpacing = 400, columns = 0 } = params;
		const cols = columns > 0 ? columns : nodeIds.length;
		nodeIds.forEach((id, i) => {
			const node$1 = this.nodes.find((n) => n.id === id);
			if (!node$1) return;
			const col = i % cols;
			const row = Math.floor(i / cols);
			node$1.position = {
				x: startX + col * hSpacing,
				y: startY + row * vSpacing
			};
		});
	}
	nextPosition(params) {
		const { referenceNodeId, direction = "right", spacing = 500 } = params;
		const { x: x$1, y: y$1 } = this.findNode(referenceNodeId).position;
		switch (direction) {
			case "right": return {
				x: x$1 + spacing,
				y: y$1
			};
			case "left": return {
				x: x$1 - spacing,
				y: y$1
			};
			case "below": return {
				x: x$1,
				y: y$1 + spacing
			};
			case "above": return {
				x: x$1,
				y: y$1 - spacing
			};
			default: throw new EngineError(`Invalid direction "${direction}". Use 'right', 'left', 'below', or 'above'.`);
		}
	}
	inspect() {
		const lines = ["=== Canvas Inspection ==="];
		lines.push(`Nodes (${this.nodes.length}):`);
		this.nodes.forEach((n) => {
			const nh = this.handles.filter((h$1) => h$1.nodeId === n.id);
			const inputs = nh.filter((h$1) => h$1.type === "Input");
			const outputs = nh.filter((h$1) => h$1.type === "Output");
			lines.push(`  "${n.name}" [${n.type}] id:${n.id} @ (${n.position?.x},${n.position?.y})`);
			inputs.forEach((h$1) => lines.push(`    [IN]  "${h$1.label}" (${h$1.dataTypes.join("|")}) id:${h$1.id}${h$1.required ? " *required*" : ""}`));
			outputs.forEach((h$1) => lines.push(`    [OUT] "${h$1.label}" (${h$1.dataTypes.join("|")}) id:${h$1.id}`));
		});
		lines.push(`\nEdges (${this.edges.length}):`);
		this.edges.forEach((e) => {
			const sh = this.handles.find((h$1) => h$1.id === e.sourceHandleId);
			const th = this.handles.find((h$1) => h$1.id === e.targetHandleId);
			const srcNode = this.nodes.find((n) => n.id === e.source);
			const tgtNode = this.nodes.find((n) => n.id === e.target);
			lines.push(`  "${srcNode?.name ?? e.source}".${sh?.label ?? "?"} → "${tgtNode?.name ?? e.target}".${th?.label ?? "?"}`);
		});
		lines.push("=========================");
		return lines.join("\n");
	}
	validate() {
		return checkGraphIntegrity(this.nodes, this.edges, this.handles, this.nodeRegistry);
	}
	commitInMemory() {
		const validationResult = this.validate();
		if (!validationResult.valid) throw new EngineError(`Validation failed:\n` + validationResult.errors.map((e) => `  • ${e}`).join("\n"));
		return {
			nodes: this.nodes.map((n) => ({
				...n,
				locked: n.locked ?? false
			})),
			edges: this.edges,
			handles: this.handles
		};
	}
	async executeOp(op, placeholderMap = /* @__PURE__ */ new Map()) {
		const resolveId = (id) => {
			if (typeof id === "string" && id.startsWith("@@")) {
				const resolved = placeholderMap.get(id);
				if (!resolved) throw new EngineError(`Placeholder "${id}" referenced before it was defined in this batch.`);
				return resolved;
			}
			return id;
		};
		const parseJson = (val) => {
			try {
				return robustParseJson(val);
			} catch (err) {
				throw new EngineError(`Invalid JSON string: ${val}. Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		};
		switch (op.op) {
			case "create_node": {
				const res = this.createNode({
					type: op.type,
					name: op.name ?? void 0,
					position: op.position ?? void 0,
					config: parseJson(op.config) ?? void 0
				});
				if (op._id) placeholderMap.set(op._id, res.nodeId);
				return res;
			}
			case "add_asset_node": throw new EngineError("add_asset_node operation is not supported in the in-memory CanvasEngine.");
			case "create_compositor_node": {
				const parsedLayers = op.layers ? op.layers.map((l$1) => ({
					...l$1,
					config: parseJson(l$1.config) ?? void 0
				})) : void 0;
				const res = this.createCompositorNode({
					type: op.type,
					name: op.name ?? void 0,
					position: op.position ?? void 0,
					config: parseJson(op.config) ?? void 0,
					inputs: op.inputs,
					layers: parsedLayers
				});
				if (op._id) placeholderMap.set(op._id, res.nodeId);
				return res;
			}
			case "remove_node":
				this.removeNode(resolveId(op.nodeId));
				return { success: true };
			case "connect": return this.connect({
				sourceNodeId: resolveId(op.sourceNodeId),
				targetNodeId: resolveId(op.targetNodeId),
				sourceLabel: op.sourceLabel ?? void 0,
				targetLabel: op.targetLabel ?? void 0
			});
			case "disconnect":
				this.disconnectNodes({
					sourceNodeId: resolveId(op.sourceNodeId),
					targetNodeId: resolveId(op.targetNodeId),
					sourceLabel: op.sourceLabel ?? void 0,
					targetLabel: op.targetLabel ?? void 0
				});
				return { success: true };
			case "update_config": return this.updateNodeConfig(resolveId(op.nodeId), parseJson(op.patch));
			case "move_node": return this.moveNode(resolveId(op.nodeId), op.position);
			case "add_dynamic_input": return this.addDynamicInput(resolveId(op.nodeId), op.label, op.dataTypes);
			case "add_dynamic_output": return this.addDynamicOutput(resolveId(op.nodeId), op.label, op.dataTypes);
			case "add_compositor_input": return this.addCompositorInput(resolveId(op.nodeId), op.label, op.dataTypes);
			case "set_compositor_layer": {
				let handleId = op.inputHandleId;
				if (!handleId && op.inputHandleLabel) {
					const nodeResolvedId = resolveId(op.nodeId);
					handleId = this.getInputHandle(nodeResolvedId, op.inputHandleLabel).id;
				}
				return this.setCompositorLayer(resolveId(op.nodeId), resolveId(handleId), parseJson(op.layerConfig));
			}
			case "auto_layout":
				this.autoLayout({
					nodeIds: op.nodeIds.map(resolveId),
					startX: op.startX,
					startY: op.startY,
					hSpacing: op.hSpacing,
					vSpacing: op.vSpacing,
					columns: op.columns
				});
				return { success: true };
			default: throw new EngineError(`Unsupported batch operation type: "${op.op}"`);
		}
	}
};
function robustParseJson(val) {
	if (typeof val !== "string") return val;
	let cleaned = val.trim();
	if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
	try {
		const parsed = JSON.parse(cleaned);
		if (typeof parsed === "string" && parsed !== val) return robustParseJson(parsed);
		return parsed;
	} catch (e) {}
	let fixed = cleaned;
	fixed = fixed.replace(/,\s*([}\]])/g, "$1");
	try {
		return JSON.parse(fixed);
	} catch (e) {
		try {
			const doubleQuoted = fixed.replace(/'([^']*)'\s*:/g, "\"$1\":").replace(/:\s*'([^']*)'/g, ":\"$1\"");
			return JSON.parse(doubleQuoted);
		} catch (innerErr) {
			throw new Error(`Failed to parse JSON string. Original error: ${e instanceof Error ? e.message : String(e)}. Raw value: ${val}`);
		}
	}
}

//#endregion
//#region ../../packages/graph-engine/dist/in-memory-runner-D4tV0MzE.mjs
var InMemoryWorkflowRunner = class {
	constructor(nodeRegistry) {
		this.nodeRegistry = nodeRegistry;
	}
	buildDepGraphs(nodeIds, data) {
		const depGraph = /* @__PURE__ */ new Map();
		const revDepGraph = /* @__PURE__ */ new Map();
		for (const id of nodeIds) {
			depGraph.set(id, []);
			revDepGraph.set(id, []);
		}
		const selectedSet = new Set(nodeIds);
		for (const edge of data.edges) {
			const source = edge.sourceNodeId ?? edge.source;
			const target = edge.targetNodeId ?? edge.target;
			if (selectedSet.has(source) && selectedSet.has(target)) {
				depGraph.get(source).push(target);
				revDepGraph.get(target).push(source);
			}
		}
		return {
			depGraph,
			revDepGraph
		};
	}
	topologicalSort(nodeIds, depGraph, revDepGraph) {
		const inDegree = /* @__PURE__ */ new Map();
		for (const id of nodeIds) {
			if (!revDepGraph.has(id)) throw new Error(`Missing reverse dependencies for node ${id}`);
			const revDeps = revDepGraph.get(id);
			inDegree.set(id, revDeps ? revDeps.length : 0);
		}
		const queue = [];
		for (const id of nodeIds) if (inDegree.get(id) === 0) queue.push(id);
		const order = [];
		while (queue.length > 0) {
			const node$1 = queue.shift();
			order.push(node$1);
			const neighbors = depGraph.get(node$1) || [];
			for (const neighbor of neighbors) {
				inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
				if (inDegree.get(neighbor) === 0) queue.push(neighbor);
			}
		}
		return order.length === nodeIds.length ? order : null;
	}
	async executeWorkflowData(data, _terminalTypes, nodeIds) {
		const allNodeIds = data.nodes.map((n) => n.id);
		const { revDepGraph } = this.buildDepGraphs(allNodeIds, data);
		const targetNodeIds = nodeIds ?? allNodeIds;
		const nodesToExecute = /* @__PURE__ */ new Set();
		const visited = /* @__PURE__ */ new Set();
		const traverse = (nodeId) => {
			if (visited.has(nodeId)) return;
			visited.add(nodeId);
			const node$1 = data.nodes.find((n) => n.id === nodeId);
			if (!node$1) return;
			if (node$1.locked) {
				if (!node$1.result) throw new Error(`Node ${node$1.id} (${node$1.name || node$1.type}) is locked but does not have a result.`);
				return;
			}
			if (node$1.result) return;
			nodesToExecute.add(nodeId);
			const upstreamNodeIds = revDepGraph.get(nodeId) || [];
			for (const upstreamId of upstreamNodeIds) traverse(upstreamId);
		};
		for (const targetId of targetNodeIds) traverse(targetId);
		const executionListIds = Array.from(nodesToExecute);
		const { depGraph: subDepGraph, revDepGraph: subRevDepGraph } = this.buildDepGraphs(executionListIds, data);
		if (!this.topologicalSort(executionListIds, subDepGraph, subRevDepGraph)) throw new Error("Cycle detected in necessary execution nodes.");
		const inDegree = /* @__PURE__ */ new Map();
		for (const id of executionListIds) {
			const revDeps = subRevDepGraph.get(id) || [];
			inDegree.set(id, revDeps.length);
		}
		const executionPromises = /* @__PURE__ */ new Map();
		const executeNode = async (nodeId) => {
			if (executionPromises.has(nodeId)) return executionPromises.get(nodeId);
			const promise = (async () => {
				const node$1 = data.nodes.find((n) => n.id === nodeId);
				if (!node$1) return;
				const ProcessorClass = this.nodeRegistry.getProcessor(node$1.type);
				if (!ProcessorClass) throw new Error(`No processor found for node type ${node$1.type}`);
				if (!container.isBound(ProcessorClass)) container.bind(ProcessorClass).toSelf().inTransientScope();
				const processorInstance = container.get(ProcessorClass);
				const ctx = {
					node: node$1,
					data: {
						...data,
						canvas: data.canvas,
						tasks: [],
						isApiBatch: false
					},
					abortSignal: void 0
				};
				logger.info(`[InMemoryWorkflow] Executing processor for node: ${node$1.id} (${node$1.name})`);
				const result = await processorInstance.process(ctx);
				if (result.success && result.newResult) node$1.result = result.newResult;
				else throw new Error(result.error ?? `In-memory processing failed for node ${node$1.id}`);
				const downstream = subDepGraph.get(nodeId) || [];
				const nextPromises = [];
				for (const childId of downstream) {
					const currentInDegree = inDegree.get(childId);
					if (currentInDegree !== void 0) {
						const remaining = currentInDegree - 1;
						inDegree.set(childId, remaining);
						if (remaining === 0) nextPromises.push(executeNode(childId));
					}
				}
				if (nextPromises.length > 0) await Promise.all(nextPromises);
			})();
			executionPromises.set(nodeId, promise);
			return promise;
		};
		const roots = executionListIds.filter((id) => inDegree.get(id) === 0);
		if (roots.length > 0) await Promise.all(roots.map((id) => executeNode(id)));
		return data;
	}
};

//#endregion
//#region ../../packages/graph-engine/dist/decorate-B5KV32rV.mjs
function __decorateMetadata$1(k$1, v$1) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k$1, v$1);
}
function __decorate$1(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}

//#endregion
//#region ../../packages/graph-engine/dist/resolvers-Dd6Ajp3o.mjs
/**
* Resolve the actual data value that flows into a target node through an edge.
*/
function resolveSourceValue(ctx, edge) {
	const sourceHandle = ctx.handles.get(edge.sourceHandleId);
	if (!sourceHandle) throw new Error("Source handle missing");
	const sourceNode = ctx.nodes.get(sourceHandle.nodeId);
	if (!sourceNode) throw new Error("Source node missing");
	const resultToUse = ctx.tasks.get(sourceNode.id)?.result ?? sourceNode.result;
	if (!resultToUse || !Array.isArray(resultToUse.outputs) || resultToUse.outputs.length === 0) return null;
	const idx = resultToUse.selectedOutputIndex ?? 0;
	if (idx < 0 || idx >= resultToUse.outputs.length) return null;
	const selected = resultToUse.outputs[idx];
	if (!selected || !Array.isArray(selected.items)) return null;
	return selected.items.find((i) => i.outputHandleId === edge.sourceHandleId) ?? null;
}
/**
* Get the input value for a given data type on a target node, with optional filters.
*/
function getInputValue(ctx, targetNodeId, required = true, options) {
	let incoming = ctx.data.edges.filter((e) => e.target === targetNodeId);
	if (options.label) incoming = incoming.filter((e) => {
		return ctx.handles.get(e.targetHandleId)?.label === options.label;
	});
	if (options.dataType) incoming = incoming.filter((e) => {
		assert(options.dataType);
		return ctx.handles.get(e.targetHandleId)?.dataTypes.includes(options.dataType);
	});
	if (incoming.length === 0) {
		if (required) throw new Error(`Required ${options.dataType ?? "any"} input${options.label ? ` with label "${options.label}"` : ""} not connected`);
		return null;
	}
	incoming.sort((a, b$1) => {
		const handleA = ctx.handles.get(a.targetHandleId);
		const handleB = ctx.handles.get(b$1.targetHandleId);
		return (handleA?.order ?? 0) - (handleB?.order ?? 0);
	});
	if (options.dataType) {
		for (const edge of incoming) {
			const value$1 = resolveSourceValue(ctx, edge);
			if (value$1 && value$1.type === options.dataType) return value$1;
		}
		if (required) throw new Error(`Required ${options.dataType} input not found in connected edges`);
		return null;
	}
	const value = resolveSourceValue(ctx, incoming[0]);
	if ((value === null || value === void 0) && required) throw new Error(`No value received from ${options.dataType ?? "any"} input${options.label ? ` with label "${options.label}"` : ""}`);
	return value;
}
function getInputValuesByType(ctx, targetNodeId, options) {
	let incoming = ctx.data.edges.filter((e) => e.target === targetNodeId);
	if (options.label) incoming = incoming.filter((e) => {
		return ctx.handles.get(e.targetHandleId)?.label === options.label;
	});
	if (options.dataType) incoming = incoming.filter((e) => {
		assert(options.dataType);
		return ctx.handles.get(e.targetHandleId)?.dataTypes.includes(options.dataType);
	});
	incoming.sort((a, b$1) => {
		const handleA = ctx.handles.get(a.targetHandleId);
		const handleB = ctx.handles.get(b$1.targetHandleId);
		return (handleA?.order ?? 0) - (handleB?.order ?? 0);
	});
	let values = incoming.map((edge) => resolveSourceValue(ctx, edge));
	if (options.dataType) values = values.filter((v$1) => v$1 && v$1.type === options.dataType);
	return values;
}
function getActualFileData(fileData) {
	if (!fileData) return null;
	if ("operation" in fileData) {
		const v$1 = fileData;
		if (v$1.operation.op === "source") return v$1.operation.source;
		const findSource = (node$1, visited = /* @__PURE__ */ new Set()) => {
			if (visited.has(node$1)) return null;
			visited.add(node$1);
			if (node$1.operation.op === "source") return node$1.operation.source;
			for (const child of node$1.children || []) {
				const found = findSource(child, visited);
				if (found) return found;
			}
			return null;
		};
		return findSource(v$1) || fileData;
	}
	return fileData;
}
/**
* @param rawFileData Filedata of node
* @returns Returns file data from Storage (GCS)
*/
async function loadMediaBuffer(storage, renderer, rawFileData, userId) {
	if (rawFileData && typeof rawFileData === "object" && "operation" in rawFileData && rawFileData.operation.op !== "source") {
		const v$1 = rawFileData;
		let result;
		if (v$1.operation.dataType === "Image" || v$1.operation.dataType === "SVG") result = await renderer.renderVirtualImage(v$1, { userId });
		else result = await renderer.renderVirtualMedia(v$1, v$1.operation.dataType, { userId });
		if (result.fileKey) return await storage.getFromStorage(result.fileKey);
		else if (result.filePath) return await fs$1.readFile(result.filePath);
		throw new Error("Render failed to produce a file");
	}
	const fileData = getActualFileData(rawFileData);
	let key;
	let bucket;
	let mimeType;
	if (fileData?.entity) {
		key = fileData.entity.key;
		bucket = fileData.entity.bucket;
		mimeType = fileData.entity.mimeType;
	} else throw new Error("Image data could not be found");
	assert(key);
	assert(mimeType);
	return await storage.getFromStorage(key, bucket);
}
async function getFileDataMimeType(rawFileData) {
	const fileData = getActualFileData(rawFileData);
	if (fileData?.entity?.mimeType) return fileData?.entity?.mimeType;
	return null;
}
let GraphResolverService = class GraphResolverService$1 {
	storage;
	renderer;
	constructor() {}
	forNode(node$1, data) {
		return new NodeResolver(node$1, data, this.storage, this.renderer);
	}
};
__decorate$1([inject(TOKENS.STORAGE), __decorateMetadata$1("design:type", Object)], GraphResolverService.prototype, "storage", void 0);
__decorate$1([inject(TOKENS.MEDIA_RENDERER), __decorateMetadata$1("design:type", Object)], GraphResolverService.prototype, "renderer", void 0);
GraphResolverService = __decorate$1([injectable(), __decorateMetadata$1("design:paramtypes", [])], GraphResolverService);
var NodeResolver = class {
	ctx;
	constructor(node$1, data, storage, renderer) {
		this.node = node$1;
		this.data = data;
		this.storage = storage;
		this.renderer = renderer;
		this.ctx = {
			data: this.data,
			handles: new Map(this.data.handles.map((h$1) => [h$1.id, h$1])),
			nodes: new Map(this.data.nodes.map((n) => [n.id, n])),
			tasks: new Map(this.data.tasks?.filter((t) => t.nodeId).map((t) => [t.nodeId, t]) ?? [])
		};
	}
	input(label) {
		return new InputResolver(this.node, this.ctx, label);
	}
	inputs(label) {
		return new InputsResolver(this.node, this.ctx, label);
	}
	async loadMediaBuffer(fileData, userId) {
		return loadMediaBuffer(this.storage, this.renderer, fileData, userId ?? this.data.canvas.userId ?? void 0);
	}
	async getFileDataMimeType(fileData) {
		return getFileDataMimeType(fileData);
	}
};
var InputResolver = class {
	isRequired = false;
	dataType;
	constructor(node$1, ctx, label) {
		this.node = node$1;
		this.ctx = ctx;
		this.label = label;
	}
	required() {
		this.isRequired = true;
		return this;
	}
	as(type) {
		this.dataType = type;
		return this;
	}
	value() {
		return getInputValue(this.ctx, this.node.id, this.isRequired, {
			dataType: this.dataType,
			label: this.label
		})?.data;
	}
	item() {
		return getInputValue(this.ctx, this.node.id, this.isRequired, {
			dataType: this.dataType,
			label: this.label
		});
	}
	asText() {
		return this.as("Text").value();
	}
	asNumber() {
		return this.as("Number").value();
	}
	asBoolean() {
		return this.as("Boolean").value();
	}
	asImage() {
		return this.as("Image").value();
	}
	asVideo() {
		return this.as("Video").value();
	}
	asAudio() {
		return this.as("Audio").value();
	}
	asSVG() {
		return this.as("SVG").value();
	}
	asLUT() {
		return this.as("LUT").value();
	}
};
var InputsResolver = class {
	dataType;
	constructor(node$1, ctx, label) {
		this.node = node$1;
		this.ctx = ctx;
		this.label = label;
	}
	as(type) {
		this.dataType = type;
		return this;
	}
	all() {
		return getInputValuesByType(this.ctx, this.node.id, {
			dataType: this.dataType,
			label: this.label
		});
	}
	allData() {
		return getInputValuesByType(this.ctx, this.node.id, {
			dataType: this.dataType,
			label: this.label
		}).map((r) => r?.data);
	}
	allWithHandle() {
		let incoming = this.ctx.data.edges.filter((e) => e.target === this.node.id);
		if (this.dataType) incoming = incoming.filter((e) => {
			assert(this.dataType);
			return this.ctx.handles.get(e.targetHandleId)?.dataTypes.includes(this.dataType);
		});
		if (this.label) incoming = incoming.filter((e) => {
			return this.ctx.handles.get(e.targetHandleId)?.label === this.label;
		});
		incoming.sort((a, b$1) => {
			const handleA = this.ctx.handles.get(a.targetHandleId);
			const handleB = this.ctx.handles.get(b$1.targetHandleId);
			return (handleA?.order ?? 0) - (handleB?.order ?? 0);
		});
		return incoming.map((edge) => {
			const handle = this.ctx.handles.get(edge.targetHandleId);
			if (!handle) return null;
			return {
				handle,
				value: resolveSourceValue(this.ctx, edge)
			};
		}).filter((item) => item !== null);
	}
	asImage() {
		return this.as(DataTypeVal.Image);
	}
	asVideo() {
		return this.as(DataTypeVal.Video);
	}
	asAudio() {
		return this.as(DataTypeVal.Audio);
	}
	asText() {
		return this.as(DataTypeVal.Text);
	}
	asLUT() {
		return this.as(DataTypeVal.LUT);
	}
};

//#endregion
//#region \0@oxc-project+runtime@0.107.0/helpers/decorateMetadata.js
function __decorateMetadata(k$1, v$1) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k$1, v$1);
}

//#endregion
//#region \0@oxc-project+runtime@0.107.0/helpers/decorateParam.js
function __decorateParam(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}

//#endregion
//#region \0@oxc-project+runtime@0.107.0/helpers/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}

//#endregion
//#region src/ai/ai-provider.ts
let AiProviderService = class AiProviderService$1 {
	falClient = null;
	openaiClient = null;
	constructor(env) {
		this.env = env;
	}
	getFal() {
		if (!this.falClient) {
			const key = this.env.FAL_API_KEY;
			if (!key || key === "fal-local" || key === "dummy-fal-key") throw new Error("No FAL_API_KEY provided in environment");
			this.falClient = createFalClient({ credentials: key });
		}
		return this.falClient;
	}
	getOpenRouterOpenAI() {
		if (!this.openaiClient) {
			const key = this.env.OPENROUTER_API_KEY;
			if (!key || key === "sk-local" || key === "dummy-openrouter-key") throw new Error("No OPENROUTER_API_KEY provided in environment");
			this.openaiClient = new OpenAI({
				apiKey: key,
				baseURL: "https://openrouter.ai/api/v1",
				dangerouslyAllowBrowser: true,
				defaultHeaders: {
					"HTTP-Referer": "https://gatewai.studio",
					"X-OpenRouter-Title": "Gatewai Studio CLI"
				}
			});
		}
		return this.openaiClient;
	}
	getAgentModel(_name, _sessionId) {
		throw new Error("getAgentModel is not implemented in CLI in-memory provider.");
	}
};
AiProviderService = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.ENV)),
	__decorateMetadata("design:paramtypes", [Object])
], AiProviderService);

//#endregion
//#region src/db/prisma-shim.ts
let MockPrismaClient = class MockPrismaClient$1 {
	assets = /* @__PURE__ */ new Map();
	fileAsset = {
		create: async ({ data }) => {
			const asset = {
				id: data.id ?? `asset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				createdAt: /* @__PURE__ */ new Date(),
				width: data.width ?? null,
				height: data.height ?? null,
				duration: data.duration ?? null,
				fps: data.fps ?? null,
				fingerprint: data.fingerprint ?? null,
				...data
			};
			this.assets.set(asset.id, asset);
			return asset;
		},
		findUnique: async ({ where }) => {
			return this.assets.get(where.id) ?? null;
		},
		findFirst: async ({ where }) => {
			if (where?.fingerprint) {
				for (const asset of this.assets.values()) if (asset.fingerprint === where.fingerprint) return asset;
			}
			return null;
		},
		delete: async ({ where }) => {
			this.assets.delete(where.id);
			return { id: where.id };
		}
	};
	$transaction = async (cb) => {
		return cb(this);
	};
};
MockPrismaClient = __decorate([injectable()], MockPrismaClient);

//#endregion
//#region src/nodes-registry.ts
async function registerStaticNodes(registry) {
	try {
		const node_apply_lut = await import("./server-53QgdebH.mjs");
		if (node_apply_lut.default) registry.register(node_apply_lut.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-lut:", e);
	}
	try {
		const node_audio_compressor = await import("./server-Dlc3CRtN.mjs");
		if (node_audio_compressor.default) registry.register(node_audio_compressor.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-compressor:", e);
	}
	try {
		const node_audio_delay = await import("./server-CboozmHg.mjs");
		if (node_audio_delay.default) registry.register(node_audio_delay.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-delay:", e);
	}
	try {
		const node_audio_fade = await import("./server-BTUN1TH3.mjs");
		if (node_audio_fade.default) registry.register(node_audio_fade.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-fade:", e);
	}
	try {
		const node_audio_generator = await import("./server-Zxo2pmZT.mjs");
		if (node_audio_generator.default) registry.register(node_audio_generator.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-generator:", e);
	}
	try {
		const node_audio_noise_gate = await import("./server-C6ktzsIa.mjs");
		if (node_audio_noise_gate.default) registry.register(node_audio_noise_gate.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-noise-gate:", e);
	}
	try {
		const node_audio_parametric_eq = await import("./server-D-t3BwNx.mjs");
		if (node_audio_parametric_eq.default) registry.register(node_audio_parametric_eq.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-parametric-eq:", e);
	}
	try {
		const node_audio_reverb = await import("./server-CYjidHJL.mjs");
		if (node_audio_reverb.default) registry.register(node_audio_reverb.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-audio-reverb:", e);
	}
	try {
		const node_blur = await import("./server-Do9KHqWe.mjs");
		if (node_blur.default) registry.register(node_blur.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-blur:", e);
	}
	try {
		const node_canvas_generator = await import("./server-Cz2yuN1C.mjs");
		if (node_canvas_generator.default) registry.register(node_canvas_generator.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-canvas-generator:", e);
	}
	try {
		const node_caption_editor = await import("./server-gSc-Oz5z.mjs");
		if (node_caption_editor.default) registry.register(node_caption_editor.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-caption-editor:", e);
	}
	try {
		const node_caption_generator = await import("./server-CYz1XO0y.mjs");
		if (node_caption_generator.default) registry.register(node_caption_generator.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-caption-generator:", e);
	}
	try {
		const node_colorkey = await import("./server-BfshHWGw.mjs");
		if (node_colorkey.default) registry.register(node_colorkey.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-colorkey:", e);
	}
	try {
		const node_compositor = await import("./server-CkPb8fyF.mjs");
		if (node_compositor.default) registry.register(node_compositor.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-compositor:", e);
	}
	try {
		const node_corner_pin = await import("./server-Cf83E9cg.mjs");
		if (node_corner_pin.default) registry.register(node_corner_pin.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-corner-pin:", e);
	}
	try {
		const node_crop = await import("./server-DPBUxy5T.mjs");
		if (node_crop.default) registry.register(node_crop.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-crop:", e);
	}
	try {
		const node_curves = await import("./server-BJK5ajVq.mjs");
		if (node_curves.default) registry.register(node_curves.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-curves:", e);
	}
	try {
		const node_depth_map = await import("./server-CZ8SBHaa.mjs");
		if (node_depth_map.default) registry.register(node_depth_map.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-depth-map:", e);
	}
	try {
		const node_displacement_map = await import("./server-Bb2Faa3e.mjs");
		if (node_displacement_map.default) registry.register(node_displacement_map.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-displacement-map:", e);
	}
	try {
		const node_edit_video = await import("./server--yMH-jJT.mjs");
		if (node_edit_video.default) registry.register(node_edit_video.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-edit-video:", e);
	}
	try {
		const node_export = await import("./server-BitrPhgp.mjs");
		if (node_export.default) registry.register(node_export.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-export:", e);
	}
	try {
		const node_extract_frame = await import("./server-D-3NqE17.mjs");
		if (node_extract_frame.default) registry.register(node_extract_frame.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-extract-frame:", e);
	}
	try {
		const node_extract_lut = await import("./server-DG3HLf9k.mjs");
		if (node_extract_lut.default) registry.register(node_extract_lut.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-extract-lut:", e);
	}
	try {
		const node_extract_object = await import("./server-Do8w-Zri.mjs");
		if (node_extract_object.default) registry.register(node_extract_object.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-extract-object:", e);
	}
	try {
		const node_film_grain = await import("./server-UpdIWwAy.mjs");
		if (node_film_grain.default) registry.register(node_film_grain.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-film-grain:", e);
	}
	try {
		const node_image_gen = await import("./server-DTleRkqf.mjs");
		if (node_image_gen.default) registry.register(node_image_gen.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-image-gen:", e);
	}
	try {
		const node_import = await import("./server-B8UUh-QN.mjs");
		if (node_import.default) registry.register(node_import.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-import:", e);
	}
	try {
		const node_kenburns = await import("./server-BRRRdOkC.mjs");
		if (node_kenburns.default) registry.register(node_kenburns.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-kenburns:", e);
	}
	try {
		const node_levels = await import("./server-DtZeLNzl.mjs");
		if (node_levels.default) registry.register(node_levels.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-levels:", e);
	}
	try {
		const node_lip_sync = await import("./server-BlCP_tHO.mjs");
		if (node_lip_sync.default) registry.register(node_lip_sync.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-lip-sync:", e);
	}
	try {
		const node_llm = await import("./server-psazbjWK.mjs");
		if (node_llm.default) registry.register(node_llm.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-llm:", e);
	}
	try {
		const node_lottie = await import("./server-CLSyhRpN.mjs");
		if (node_lottie.default) registry.register(node_lottie.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-lottie:", e);
	}
	try {
		const node_media_cut = await import("./server-uhGJjyBu.mjs");
		if (node_media_cut.default) registry.register(node_media_cut.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-media-cut:", e);
	}
	try {
		const node_mesh_warp = await import("./server-BnTW0-EG.mjs");
		if (node_mesh_warp.default) registry.register(node_mesh_warp.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-mesh-warp:", e);
	}
	try {
		const node_modulate = await import("./server-BO8vmBwM.mjs");
		if (node_modulate.default) registry.register(node_modulate.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-modulate:", e);
	}
	try {
		const node_noise_generator = await import("./server-Bk1tUPnG.mjs");
		if (node_noise_generator.default) registry.register(node_noise_generator.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-noise-generator:", e);
	}
	try {
		const node_note = await import("./server-ClIGTX-e.mjs");
		if (node_note.default) registry.register(node_note.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-note:", e);
	}
	try {
		const node_number = await import("./server-Z5a2qDqg.mjs");
		if (node_number.default) registry.register(node_number.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-number:", e);
	}
	try {
		const node_paint = await import("./server-CUNm4Bn9.mjs");
		if (node_paint.default) registry.register(node_paint.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-paint:", e);
	}
	try {
		const node_preview = await import("./server-amiiljVb.mjs");
		if (node_preview.default) registry.register(node_preview.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-preview:", e);
	}
	try {
		const node_recorder = await import("./server-DTb4ZbSi.mjs");
		if (node_recorder.default) registry.register(node_recorder.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/recorder:", e);
	}
	try {
		const node_remove_background = await import("./server-Cg7qP9RP.mjs");
		if (node_remove_background.default) registry.register(node_remove_background.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-remove-background:", e);
	}
	try {
		const node_resizer_scaler = await import("./server-C2wobP1g.mjs");
		if (node_resizer_scaler.default) registry.register(node_resizer_scaler.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-resizer-scaler:", e);
	}
	try {
		const node_signal = await import("./server-By60_U5-.mjs");
		if (node_signal.default) registry.register(node_signal.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-signal:", e);
	}
	try {
		const node_smart_cut = await import("./server-5ON7G8Oe.mjs");
		if (node_smart_cut.default) registry.register(node_smart_cut.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-smart-cut:", e);
	}
	try {
		const node_stereo_panning = await import("./server-BXZGncQ8.mjs");
		if (node_stereo_panning.default) registry.register(node_stereo_panning.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-stereo-panning:", e);
	}
	try {
		const node_svg = await import("./server-eoKEhbx9.mjs");
		if (node_svg.default) registry.register(node_svg.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-svg:", e);
	}
	try {
		const node_text = await import("./server-Blz1WefS.mjs");
		if (node_text.default) registry.register(node_text.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-text:", e);
	}
	try {
		const node_text_merger = await import("./server-BpFIKT9o.mjs");
		if (node_text_merger.default) registry.register(node_text_merger.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-text-merger:", e);
	}
	try {
		const node_text_to_speech = await import("./server-DIRpEXHM.mjs");
		if (node_text_to_speech.default) registry.register(node_text_to_speech.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-text-to-speech:", e);
	}
	try {
		const node_upscaler = await import("./server-CpF56pyE.mjs");
		if (node_upscaler.default) registry.register(node_upscaler.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-upscaler:", e);
	}
	try {
		const node_video_gen = await import("./server-DfrxSCZd.mjs");
		if (node_video_gen.default) registry.register(node_video_gen.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-video-gen:", e);
	}
	try {
		const node_video_gen_first_last_frame = await import("./server-DmBfINvG.mjs");
		if (node_video_gen_first_last_frame.default) registry.register(node_video_gen_first_last_frame.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-video-gen-first-last-frame:", e);
	}
	try {
		const node_video_to_audio = await import("./server-ioRRP1vL.mjs");
		if (node_video_to_audio.default) registry.register(node_video_to_audio.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-video-to-audio:", e);
	}
	try {
		const node_video_to_music = await import("./server-dEEWQ_T6.mjs");
		if (node_video_to_music.default) registry.register(node_video_to_music.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-video-to-music:", e);
	}
	try {
		const node_vignette = await import("./server-CxurFk0s.mjs");
		if (node_vignette.default) registry.register(node_vignette.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-vignette:", e);
	}
	try {
		const node_webhook = await import("./server-BzWArAny.mjs");
		if (node_webhook.default) registry.register(node_webhook.default);
	} catch (e) {
		console.warn("Failed to register static node @gatewai/node-webhook:", e);
	}
}
async function registerStaticRenderers() {
	try {
		const mod = await import("./renderer-CiY1Hc9l.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("ApplyLUT", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("ApplyLUT", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-lut:", e);
	}
	try {
		const mod = await import("./renderer-CKQEhlyB.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Compressor", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Compressor", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-audio-compressor:", e);
	}
	try {
		const mod = await import("./renderer-DY1IW9mr.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Delay", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Delay", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-audio-delay:", e);
	}
	try {
		const mod = await import("./renderer-Ckf4mhwD.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("AudioFade", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("AudioFade", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-audio-fade:", e);
	}
	try {
		const mod = await import("./renderer-B0-FzJ28.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("NoiseGate", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("NoiseGate", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-audio-noise-gate:", e);
	}
	try {
		const mod = await import("./renderer-Dap0T1yU.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("ParametricEq", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("ParametricEq", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-audio-parametric-eq:", e);
	}
	try {
		const mod = await import("./renderer-hwK424AD.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Reverb", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Reverb", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-audio-reverb:", e);
	}
	try {
		const mod = await import("./renderer-CuJQqi9V.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Blur", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Blur", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-blur:", e);
	}
	try {
		const mod = await import("./renderer-BpNK-jw2.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("CanvasGenerator", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("CanvasGenerator", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-canvas-generator:", e);
	}
	try {
		const mod = await import("./renderer-CZAxI_eD.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("ColorKey", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("ColorKey", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-colorkey:", e);
	}
	try {
		const mod = await import("./renderer-OSKMYRjO.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Compositor", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Compositor", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-compositor:", e);
	}
	try {
		const mod = await import("./renderer-Y5GL_6dT.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("CornerPin", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("CornerPin", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-corner-pin:", e);
	}
	try {
		const mod = await import("./renderer-eJ8KIyQB.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Crop", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Crop", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-crop:", e);
	}
	try {
		const mod = await import("./renderer-CZR58_nY.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Curves", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Curves", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-curves:", e);
	}
	try {
		const mod = await import("./renderer-D-S87dpM.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("DisplacementMap", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("DisplacementMap", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-displacement-map:", e);
	}
	try {
		const mod = await import("./renderer-CrKKAhPC.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("ExtractFrame", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("ExtractFrame", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-extract-frame:", e);
	}
	try {
		const mod = await import("./renderer-CaX1zzjU.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("ExtractLUT", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("ExtractLUT", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-extract-lut:", e);
	}
	try {
		const mod = await import("./renderer-akl2GX-W.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("FilmGrain", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("FilmGrain", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-film-grain:", e);
	}
	try {
		const mod = await import("./renderer-CCqM-xqO.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("KenBurns", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("KenBurns", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-kenburns:", e);
	}
	try {
		const mod = await import("./renderer-DknWcZqP.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Levels", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Levels", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-levels:", e);
	}
	try {
		const mod = await import("./renderer-NMqiclgN.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("MeshWarp", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("MeshWarp", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-mesh-warp:", e);
	}
	try {
		const mod = await import("./renderer-xySGnfQR.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Modulate", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Modulate", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-modulate:", e);
	}
	try {
		const mod = await import("./renderer-B2tBzrik.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("NoiseGenerator", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("NoiseGenerator", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-noise-generator:", e);
	}
	try {
		const mod = await import("./renderer-0kaw5yBZ.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Paint", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Paint", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-paint:", e);
	}
	try {
		const mod = await import("./renderer-C20vUODV.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("ResizerScaler", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("ResizerScaler", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-resizer-scaler:", e);
	}
	try {
		const mod = await import("./renderer-DEgc1lRC.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("StereoPanning", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("StereoPanning", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-stereo-panning:", e);
	}
	try {
		const mod = await import("./renderer-MH43v0zF.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("VideoToAudio", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("VideoToAudio", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-video-to-audio:", e);
	}
	try {
		const mod = await import("./renderer-L5mFnR_e.mjs");
		if (mod.default?.WebGPURenderer) registerWebGPURenderer("Vignette", mod.default.WebGPURenderer);
		if (mod.default?.audioProcessor) audioRegistry.register("Vignette", mod.default.audioProcessor);
	} catch (e) {
		console.warn("Failed to register static renderer for @gatewai/node-vignette:", e);
	}
}

//#endregion
//#region ../../node_modules/.pnpm/@mediabunny+prores@1.51.0_mediabunny@1.51.0/node_modules/@mediabunny/prores/dist/bundles/mediabunny-prores.mjs
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var p = class extends Error {
	constructor(e = "The decoder ran out of memory.") {
		super(e), this.name = "OutOfMemoryError";
	}
};
var H = class extends Error {
	constructor(e = "Invalid data: the packet ended before the decoder expected it to.") {
		super(e), this.name = "UnexpectedEofError";
	}
};
var x = class extends Error {
	constructor(e = "The packet contains invalid data.") {
		super(e), this.name = "InvalidDataError";
	}
};
var C = class extends Error {
	constructor(e = "The packet uses a feature that is not supported.") {
		super(e), this.name = "NotSupportedError";
	}
};
var N = class extends Error {
	constructor(e = "The decoder is in an invalid internal state. This should never happen! Please report.") {
		super(e), this.name = "InvalidStateError";
	}
};
var j = class extends Error {
	constructor(e = "The decoder has been closed.") {
		super(e), this.name = "DecoderClosedError";
	}
};
var O = class extends Error {
	constructor(e = "The frame is locked by an in-flight decoding operation.") {
		super(e), this.name = "FrameLockedError";
	}
};
var W = (t, e) => {
	switch (t) {
		case -1: return new p(e);
		case -2: return new H(e);
		case -3: return new x(e);
		case -4: return new C(e);
		case -5: return new N(e);
		case -6: return new x(e ?? "Unexpected integer overflow.");
		default: throw new Error(`Unhandled error code: ${t}`);
	}
};
function h(t) {
	if (!t) throw new Error("Assertion failed.");
}
var T = (t) => {
	let e = 0, r = "";
	for (; e < t.length;) {
		let o = t[e++];
		if (o > 127) if (o > 191 && o < 224) {
			if (e >= t.length) throw new Error("UTF-8 decode: incomplete 2-byte sequence");
			o = (o & 31) << 6 | t[e++] & 63;
		} else if (o > 223 && o < 240) {
			if (e + 1 >= t.length) throw new Error("UTF-8 decode: incomplete 3-byte sequence");
			o = (o & 15) << 12 | (t[e++] & 63) << 6 | t[e++] & 63;
		} else if (o > 239 && o < 248) {
			if (e + 2 >= t.length) throw new Error("UTF-8 decode: incomplete 4-byte sequence");
			o = (o & 7) << 18 | (t[e++] & 63) << 12 | (t[e++] & 63) << 6 | t[e++] & 63;
		} else throw new Error("UTF-8 decode: unknown multibyte start 0x" + o.toString(16) + " at index " + (e - 1));
		if (o <= 65535) r += String.fromCharCode(o);
		else if (o <= 1114111) o -= 65536, r += String.fromCharCode(o >> 10 | 55296), r += String.fromCharCode(o & 1023 | 56320);
		else throw new Error("UTF-8 decode: code point 0x" + o.toString(16) + " exceeds UTF-16 reach");
	}
	return r;
};
var y = class {
	constructor() {
		__publicField(this, "currentPromise", Promise.resolve());
		__publicField(this, "pending", 0);
	}
	async acquire() {
		let e;
		const r = new Promise((i) => {
			let s = false;
			e = () => {
				s || (i(), this.pending--, s = true);
			};
		}), o = this.currentPromise;
		return this.currentPromise = r, this.pending++, await o, e;
	}
};
var I = typeof SharedArrayBuffer < "u";
var L = (t) => t;
Symbol.dispose ??= Symbol("dispose");
Symbol.asyncDispose ??= Symbol("asyncDispose");
var g = [
	"I420",
	"I420P10",
	"I420P12",
	"I420A",
	"I420AP10",
	"I420AP12",
	"I422",
	"I422P10",
	"I422P12",
	"I422A",
	"I422AP10",
	"I422AP12",
	"I444",
	"I444P10",
	"I444P12",
	"I444A",
	"I444AP10",
	"I444AP12"
];
var Q = {
	1: "bt709",
	5: "bt470bg",
	6: "smpte170m",
	9: "bt2020",
	12: "smpte432"
};
var V = {
	1: "bt709",
	6: "smpte170m",
	8: "linear",
	13: "iec61966-2-1",
	16: "pq",
	18: "hlg"
};
var G = {
	0: "rgb",
	1: "bt709",
	5: "bt470bg",
	6: "smpte170m",
	9: "bt2020-ncl"
};
var b = new FinalizationRegistry(({ runtime: t, ptr: e }) => {
	t.exports.closeFrame(e);
});
var X = class {
	constructor() {
		/**
		* The raw data of the decoded frame, stored in the format described by `pixelFormat`. All frame data is stored in
		* YUV format. This data becomes invalid as soon as the frame is used for its next decoding task.
		*/
		__publicField(this, "frameData", null);
		/** The coded width of the frame data in pixels. Always a multiple of 16. */
		__publicField(this, "codedWidth", null);
		/** The coded height of the frame data in pixels. Always a multiple of 16. */
		__publicField(this, "codedHeight", null);
		/**
		* The visible, displayed width of the frame in pixels. May be smaller than `codedWidth`. The visible rectangle
		* always starts in the top-left corner of the coded rectangle.
		*/
		__publicField(this, "visibleWidth", null);
		/**
		* The visible, displayed height of the frame in pixels. May be smaller than `codedHeight`. The displayed rectangle
		* always starts in the top-left corner of the coded rectangle.
		*/
		__publicField(this, "visibleHeight", null);
		/** The pixel format of this frame's data. */
		__publicField(this, "pixelFormat", null);
		/**
		* The original frame pixel format as specified by the packet. If no conversion has taken place, this will match
		* {@link Frame.pixelFormat}.
		*/
		__publicField(this, "originalPixelFormat", null);
		/**
		* The pixel aspect ratio of the decoded frame. This is typically 1:1.
		*/
		__publicField(this, "pixelAspectRatio", null);
		/**
		* The color primaries of the decoded frame's color space. Common values are:
		*
		* 0 - Unknown/unspecified \
		* 1 - ITU-R BT.709 \
		* 2 - Unknown/unspecified \
		* 5 - ITU-R BT.601 625 \
		* 6 - ITU-R BT.601 525 \
		* 9 - ITU-R BT.2020 \
		* 11 - DCI P3 \
		* 12 - P3 D65
		*/
		__publicField(this, "colorPrimaries", null);
		/**
		* The color transfer function of the decoded frame's color space. Common values are:
		*
		* 0 - Unknown/unspecified \
		* 1 - ITU-R BT.601/BT.709/BT.2020 \
		* 2 - Unknown/unspecified \
		* 6 - ITU-R BT.601 \
		* 8 - Linear \
		* 13 - IEC 61966-2-1
		* 16 - SMPTE ST 2084 (PQ) \
		* 18 - ITU-R BT.2100-2 (HLG)
		*/
		__publicField(this, "colorTransfer", null);
		/**
		* The matrix coefficients of the decoded frame's color space. Common values are:
		*
		* 0 - Unknown/unspecified \
		* 1 - ITU-R BT.709 \
		* 2 - Unknown/unspecified \
		* 5 - ITU-R BT.601 625 \
		* 6 - ITU-R BT.601 525 \
		* 9 - ITU-R BT.2020
		*/
		__publicField(this, "colorMatrix", null);
		/**
		* Whether the decoded frame uses full range or limited range. ProRes always uses limited range, so this field
		* is `false` whenever it is populated.
		*/
		__publicField(this, "colorRangeFull", null);
		/**
		* How the frame's lines are scanned. `'progressive'` for a full-frame picture, or one of the interlaced types
		* when the frame is split into two fields (the suffix indicates which field comes first).
		*/
		__publicField(this, "scanType", null);
		/**
		* The runtime the WASM Frame lives on (shared-memory path).
		* @internal
		*/
		__publicField(this, "_runtime", null);
		/**
		* Pointer to the WASM Frame (shared-memory path).
		* @internal
		*/
		__publicField(this, "_ptr", null);
		/**
		* The recycled frame data buffer that ping-pongs between the main thread and a worker (message-passing path).
		* @internal
		*/
		__publicField(this, "_buffer", null);
		/** @internal */
		__publicField(this, "_locked", false);
	}
	/** {@link Frame.colorPrimaries} as a string compatible with the WebCodecs API, or `undefined` if none exists. */
	get colorPrimariesString() {
		return this.colorPrimaries === null ? void 0 : Q[this.colorPrimaries];
	}
	/** {@link Frame.colorTransfer} as a string compatible with the WebCodecs API, or `undefined` if none exists. */
	get colorTransferString() {
		return this.colorTransfer === null ? void 0 : V[this.colorTransfer];
	}
	/** {@link Frame.colorMatrix} as a string compatible with the WebCodecs API, or `undefined` if none exists. */
	get colorMatrixString() {
		return this.colorMatrix === null ? void 0 : G[this.colorMatrix];
	}
	/** Whether this frame is locked by an in-flight decoding operation. While locked, it cannot be used or cleared. */
	get isLocked() {
		return this._locked;
	}
	/** Whether this frame contains decoded data, meaning all of its data fields are non-null. */
	get isFilled() {
		return this.frameData !== null && this.codedWidth !== null && this.codedHeight !== null && this.visibleWidth !== null && this.visibleHeight !== null && this.pixelFormat !== null && this.pixelAspectRatio !== null && this.colorPrimaries !== null && this.colorTransfer !== null && this.colorMatrix !== null && this.colorRangeFull !== null && this.scanType !== null;
	}
	/** Returns this frame typed as a `FilledFrame` if it is filled, or `null` otherwise. */
	toFilled() {
		return this.isFilled ? this : null;
	}
	/**
	* Clears this frame, resetting all of its fields and releasing all internal resources. The frame can still be
	* used again afterwards. Throws if the frame is locked.
	*
	* You *should always* call this method when you're done using a `Frame`. Not doing so may unnecessary bloat the
	* WASM memory and may even lead to out-of-memory errors.
	*/
	clear() {
		if (this._locked) throw new O();
		this._ptr !== null && (h(this._runtime), b.unregister(this), this._runtime.exports.closeFrame(this._ptr), this._runtime = null, this._ptr = null), this._buffer = null, this._reset();
	}
	/** Calls `.clear()` internally. */
	[Symbol.dispose]() {
		this.clear();
	}
	/** @internal */
	_ensureWasmFrame(e) {
		if (this._runtime === e) return true;
		this._runtime && (b.unregister(this), this._runtime.exports.closeFrame(this._ptr), this._runtime = null, this._ptr = null);
		const r = e.exports.createFrame();
		return r === 0 ? false : (this._runtime = e, this._ptr = r, b.register(this, {
			runtime: e,
			ptr: r
		}, this), true);
	}
	/** @internal */
	_reset() {
		this.frameData = null, this.codedWidth = null, this.codedHeight = null, this.visibleWidth = null, this.visibleHeight = null, this.pixelFormat = null, this.pixelAspectRatio = null, this.colorPrimaries = null, this.colorTransfer = null, this.colorMatrix = null, this.colorRangeFull = null, this.scanType = null;
	}
	/** @internal */
	_populate(e) {
		this.frameData = e.frameData, this.codedWidth = e.codedWidth, this.codedHeight = e.codedHeight, this.visibleWidth = e.visibleWidth, this.visibleHeight = e.visibleHeight, this.pixelFormat = e.pixelFormat, this.originalPixelFormat = e.originalPixelFormat, this.pixelAspectRatio = e.pixelAspectRatio, this.colorPrimaries = e.colorPrimaries, this.colorTransfer = e.colorTransfer, this.colorMatrix = e.colorMatrix, this.colorRangeFull = e.colorRangeFull, this.scanType = e.scanType;
	}
};
var Y = (t, e, r, o) => {
	const i = t.getFrameDataPtr(r), s = t.getFrameDataSize(r), n = new Uint8Array(e.buffer, i, s), a = g[t.getFramePixelFormat(r)];
	h(a !== void 0);
	const c = g[t.getOriginalPixelFormat(o)];
	h(c !== void 0);
	const d = [
		"progressive",
		"interlaced-top-field-first",
		"interlaced-bottom-field-first"
	][t.getScanType(r)];
	return h(d !== void 0), {
		frameData: n,
		codedWidth: t.getCodedWidth(r),
		codedHeight: t.getCodedHeight(r),
		visibleWidth: t.getVisibleWidth(r),
		visibleHeight: t.getVisibleHeight(r),
		pixelFormat: a,
		originalPixelFormat: c,
		pixelAspectRatio: {
			num: t.getAspectRatioNum(r),
			den: t.getAspectRatioDen(r)
		},
		colorPrimaries: t.getColorPrimaries(r),
		colorTransfer: t.getColorTransfer(r),
		colorMatrix: t.getColorMatrix(r),
		colorRangeFull: false,
		scanType: d
	};
};
var l = /* @__PURE__ */ ((t) => (t[t.SharedMemoryInit = 0] = "SharedMemoryInit", t[t.MessagePassingInit = 1] = "MessagePassingInit", t[t.CreateDecoder = 2] = "CreateDecoder", t[t.CloseDecoder = 3] = "CloseDecoder", t[t.Decode = 4] = "Decode", t[t.Ready = 5] = "Ready", t[t.InitOutOfMemoryError = 6] = "InitOutOfMemoryError", t[t.Decoded = 7] = "Decoded", t[t.DecodeError = 8] = "DecodeError", t))(l || {});
var k = `\0asm\0\0\0\x99\`\x7F\x7F\x7F\x7F\x7F\`\x7F\x7F\x7F\x7F\x7F\0\`\x7F\0\`\0\0\`\x7F\x7F\x7F\x7F\x7F\x7F\x7F\`
\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F\`\x7F\x7F\`\x7F\x7F\x7F\x7F{{{{{{{{{{{{{{{{\x7F\x7F\x7F\x7F\0\`\x7F\x7F\x7F\x7F{{{{{{{{{{{{{{{{\x7F\x7F\x7F\0\`	\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F\0\`\x7F\x7F\0\`\x7F\x7F\x7F\x7F\`\x7F\x7F\x7F\x7F\0\`\x7F\x7F\x7F\`\x7F\x7F\x7F\0\`\0\x7Fenvmemory\x80\x80ML\x07\x07\b\b\b\b\b\b\b\b\b\b						
\0\v\f\v\r\0\r\v\v\v\r\r\f\f\v\vp		\x7FA\x80\x80\xC0\0\v\x7FA\0\v\x7F\0A\x90\b\v\x7F\0A\v\x07\xE1!__stack_pointer\0
__tls_base
__tls_size\v__tls_align__wasm_init_tls\0\0\vstartWorker\0allocateThreadLocalState\0&\vgetScanType\0'getColorMatrix\0(getColorTransfer\0)getColorPrimaries\0*getAspectRatioDen\0+getAspectRatioNum\0,getFramePixelFormat\0-getFrameDataSize\0/getFrameDataPtr\x000getCodedHeight\x001\rgetCodedWidth\x002getVisibleHeight\x003getVisibleWidth\x004
closeFrame\x005\vcreateFrame\x007setIsBrowserMainThread\x008allocateWorkerStack\x009finalizePacketDecoding\0;\fdecodePacket\0<getTaskStateAddress\0EallocatePacket\0F\fcloseDecoder\0GgetErrorMessageSize\0HgetErrorMessagePtr\0IgetOriginalPixelFormat\0J\rcreateDecoder\0K\b	\0A\v\b%$#\x1B\f
\xB2\xE3\x07L\0 \0$ \0A\0A\x90\b\xFC\b\0\0\v\x87\0@@@A\x98\xA8\xC0\0A\0A\xFEH\0\0\vA\x80\x80\xC0\0A\x80\x80\xC0\0$A\0A\x90\b\xFC\b\0\0A\x90\x88\xC0\0A\0A\xC8\xFC\b\0A\xD8\xA6\xC0\0A\0A\xFC\b\0A\xE8\xA6\xC0\0A\0A\xB0\xFC\v\0A\x98\xA8\xC0\0A\xFE\0A\x98\xA8\xC0\0A\x7F\xFE\0\0\f\vA\x98\xA8\xC0\0AB\x7F\xFE\0\v\xFC	\xFC	\v\xF1\b\x7F~\x7F~\x7F~\x7F~#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@ E\r\0 A6 A\xB3\x9E\xC0\x80\x006\fA\b!\x07@@ A\bI\r\0 \0)\0\0"\bB8\x86 \bB\x80\xFE\x83B(\x86\x84 \bB\x80\x80\xFC\x07\x83B\x86 \bB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \bB\b\x88B\x80\x80\x80\xF8\x83 \bB\x88B\x80\x80\xFC\x07\x83\x84 \bB(\x88B\x80\xFE\x83 \bB8\x88\x84\x84\x84!\bB\xC0\0!	\f\v@@@@@@@@ A\x7Fj\x07\0\v \0/\0\0"
A\bt 
A\bvr\xADB0\x86!\bA!\x07\f\v \0/\0\0"
A\x80\xFEq \0Aj-\0\0rA\bt 
AtrA\bv\xADB(\x86!\bA!\x07\f\v \0(\0\0"
At 
A\x80\xFEqA\btr 
A\bvA\x80\xFEq 
Avrr\xADB \x86!\bA!\x07\f\v \0Aj1\0\0B \x86"	B\b\x88 \x005\0\0"\bB8\x86 \bB\x80\xFE\x83B(\x86\x84 \b 	\x84"\bB\x80\x80\xFC\x07\x83B\x86 \bB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84!\bA!\x07\f\v \x005\0\0"\bB8\x86 \bB\x80\xFE\x83B(\x86\x84 \b \0Aj3\0\0"	B \x86\x84"\bB\x80\x80\xFC\x07\x83B\x86 \bB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 	B\x86B\x80\x80\x80\xF8\x83 	B\b\x86B\x80\x80\xFC\x07\x83\x84\x84!\bA!\x07\f\v \x005\0\0"\bB8\x86 \bB\x80\xFE\x83B(\x86\x84 \b \0Aj1\0\0B0\x86"\v \0Aj3\0\0"	B \x86\x84\x84"\bB\x80\x80\xFC\x07\x83B\x86 \bB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 	B\x86 	B\b\x86\x84B\x80\x80\xFC\xFF\x83 \vB(\x88\x84\x84!\bA\x07!\x07\f\v \x001\0\0B8\x86!\bA!\x07\vB\x7F!	\vA\xE4\0!\f \bB\x80\x80\x80\x80\x84y\xA7At"
(\xA0\x9B\xC0\x80\0"\rAK\r  \bA\0 \rkA?q\xAD\x88 
A\xA0\x9B\xC0\x80\0j5|\xA7"
AvA\0 
Aqks"\xB28\0 \b \r\xAD\x86"\vB\x80\x80\x80\x80\x84y\xA7At"
(\xA0\x99\xC0\x80\0"AK\r  \vA\0 kA?q\xAD\x88 
A\xA0\x99\xC0\x80\0j5|\xA7"
Aq" j 
AjAvA\0 k"sj"\xB28\x80 A\x80j! 	  \rj\xAD"\v}!	 \b \v\x86!\bB\0!\vA!@@@  O\r\0 	B?V\r@@@@@@@@@  \x07k"\rA\x07K\r\0B\0! \r\b\b\x07\b\vB\0 \0 \x07j)\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \vB\b\x88B\x80\x80\x80\xF8\x83 \vB\x88B\x80\x80\xFC\x07\x83\x84 \vB(\x88B\x80\xFE\x83 \vB8\x88\x84\x84\x84"B\0 	}\x86 	P\x1B!\v  	\x88 \b\x84!\b 	B\xC0\0\x84!	 \x07A\bj!\x07\f	\v \0 \x07j1\0\0B8\x86! \x07Aj!\x07\f\v \0 \x07j/\0\0"\rA\bt \rA\bvr\xADB0\x86! \x07Aj!\x07\f\v \0 \x07j"\r/\0\0"A\x80\xFEq \rAj-\0\0rA\bt AtrA\bv\xADB(\x86! \x07Aj!\x07\f\v \0 \x07j(\0\0"\rAt \rA\x80\xFEqA\btr \rA\bvA\x80\xFEq \rAvrr\xADB \x86! \x07Aj!\x07\f\v \0 \x07j"\rAj1\0\0B \x86"B\b\x88 \r5\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \v \x84"\vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \x07Aj!\x07\f\v \0 \x07j"\r5\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \v \rAj3\0\0"B \x86\x84"\vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \x07Aj!\x07\f\v \0 \x07j"\r5\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \v \rAj1\0\0B0\x86" \rAj3\0\0"B \x86\x84\x84"\vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! \x07A\x07j!\x07\vB\0 B\0 	}\x86 	P\x1B!\v  	\x88 \b\x84!\bB\x7F!	\f\v A6 A\xCB\x9E\xC0\x80\x006\f  gA\x7Fs"
Aq":\0\bA\xC0\0 
t!A!A!\r A\x7Fj"!
@@ 	B\xC0\0Z\r\0@@@@@@@@@  \x07k"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \x07j)\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \vB\b\x88B\x80\x80\x80\xF8\x83 \vB\x88B\x80\x80\xFC\x07\x83\x84 \vB(\x88B\x80\xFE\x83 \vB8\x88\x84\x84\x84"B\0 	}\x86 	P\x1B!\v  	\x88 \b\x84!\b 	B\xC0\0\x84!	 \x07A\bj!\x07\f\b\v \0 \x07j1\0\0B8\x86! \x07Aj!\x07\f\v \0 \x07j/\0\0"A\bt A\bvr\xADB0\x86! \x07Aj!\x07\f\v \0 \x07j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! \x07Aj!\x07\f\v \0 \x07j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \x07Aj!\x07\f\v \0 \x07j"Aj1\0\0B \x86"B\b\x88 5\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \v \x84"\vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \x07Aj!\x07\f\v \0 \x07j"5\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \v Aj3\0\0"B \x86\x84"\vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \x07Aj!\x07\f\v \0 \x07j"5\0\0"\vB8\x86 \vB\x80\xFE\x83B(\x86\x84 \v Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"\vB\x80\x80\xFC\x07\x83B\x86 \vB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! \x07A\x07j!\x07\vB\0 B\0 	}\x86 	P\x1B!\v  	\x88 \b\x84!\bB\x7F!	\v@@ \bPE\r\0A\xC6\xA2\xC0\x80\0!B\0!\b\f\v \rA \rAI\x1BAt(\xC8\xA2\xC0\x80\0 \bB\x80\x80\x80\x80\x84y\xA7Atj"\r(\0"AK\r 
 \bA\0 kA?q\xAD\x88 \r5|\xA7"\rjAj"
 O\r A	 A	I\x1BAt(\x88\xA3\xC0\x80\0 \b \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r  
 qA\btj  
 vj-\0\0Atj A\0 kA?q\xAD\x88 5|\xA7Aj"A\0 \b  j\xAD"B?\x85"\x88\xA7Aq"ks j\xB28\0 \b B|"\x86 \v \x88\x84!\b 	 }!	 \v \x86!\vA\xB2\xA3\xC0\x80\0!\v -\0\0\r\0\v B\x007\f\f\v 
A 
AI\x1BAt(\xA8\xA2\xC0\x80\0 \bB\x80\x80\x80\x80\x84y\xA7Atj"
(\0"\rAK\r  A\0 A\0 \bA\0 \rkA?q\xAD\x88 
4|"\xA7"
Aqks P\x1B"k  
AjAvsj"\xB28\0 B BT\x1B\xA7At(\xA8\xA2\xC0\x80\0 \b \r\xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"
(\0"AK\r A\x80j A\0 A\0 A\0 kA?q\xAD\x88 
4|"\xA7"
Aqks P\x1B"k  
AjAvsj"\xB28\0 \vB\0  \rj\xAD"}\x88 \b \x86\x84!\b A\x80j! Aj! 	 }!	 \v \x86!\v\f\0\v\vA\0!\f\v Aj$\x80\x80\x80\x80\0 \f\v\x83M	\x7F~\b\x7F~\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"
$\x80\x80\x80\x80\0@@@ E\r\0 \r\v@ E\r\0 \0    \b 	\x82\x80\x80\x80\0A\xFF\xFFq!\v\f\v    \x07 \b 	\x82\x80\x80\x80\0A\xFF\xFFq!\v\f\v \bA6 \bA\xB3\x9E\xC0\x80\x006\fA\b!\f@@ A\bI\r\0 \0)\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \rB\b\x88B\x80\x80\x80\xF8\x83 \rB\x88B\x80\x80\xFC\x07\x83\x84 \rB(\x88B\x80\xFE\x83 \rB8\x88\x84\x84\x84!B\xC0\0!\f\v@@@@@@@@ A\x7Fj\x07\0\v \0/\0\0"A\bt A\bvr\xADB0\x86!A!\f\f\v \0/\0\0"A\x80\xFEq \0Aj-\0\0rA\bt AtrA\bv\xADB(\x86!A!\f\f\v \0(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86!A!\f\f\v \0Aj1\0\0B \x86"B\b\x88 \x005\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r \x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84!A!\f\f\v \x005\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r \0Aj3\0\0"B \x86\x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84!A!\f\f\v \x005\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r \0Aj1\0\0B0\x86" \0Aj3\0\0"B \x86\x84\x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84!A\x07!\f\f\v \x001\0\0B8\x86!A!\f\vB\x7F!\vA\xE4\0!\v B\x80\x80\x80\x80\x84y\xA7At"(\xA0\x9B\xC0\x80\0"AK\r\0  A\0 kA?q\xAD\x88 A\xA0\x9B\xC0\x80\0j5|\xA7"AvA\0 Aqks"\xB28\0  \xAD\x86"\rB\x80\x80\x80\x80\x84y\xA7At"(\xA0\x99\xC0\x80\0"AK\r\0  \rA\0 kA?q\xAD\x88 A\xA0\x99\xC0\x80\0j5|\xA7"Aq" j AjAvA\0 k"sj"\xB28\x80A\b!@@@@@@@@@ A\bO\r\0 A\x7Fj\x07\x07\v )\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \rB\b\x88B\x80\x80\x80\xF8\x83 \rB\x88B\x80\x80\xFC\x07\x83\x84 \rB(\x88B\x80\xFE\x83 \rB8\x88\x84\x84\x84!B\xC0\0!\f\x07\v 1\0\0B8\x86!A!B\x7F!\f\v /\0\0"A\bt A\bvr\xADB0\x86!A!B\x7F!\f\v /\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86!A!B\x7F!\f\v (\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86!A!B\x7F!\f\v Aj1\0\0B \x86"B\b\x88 5\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r \x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84!A!B\x7F!\f\v 5\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r Aj3\0\0"B \x86\x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84!A!B\x7F!\f\v 5\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84!A\x07!B\x7F!\v B\x80\x80\x80\x80\x84y\xA7At"(\xA0\x9B\xC0\x80\0"AK\r\0  A\0 kA?q\xAD\x88 A\xA0\x9B\xC0\x80\0j5|\xA7"AvA\0 Aqks"\xB28\0  \xAD\x86"\x1BB\x80\x80\x80\x80\x84y\xA7At"(\xA0\x99\xC0\x80\0"AK\r\0   j\xAD"\r}!  \r\x86!\r  \x1BA\0 kA?q\xAD\x88 A\xA0\x99\xC0\x80\0j5|\xA7"Aq" j AjAvA\0 k"sj"\xB28\x80  \x07  \x07I\x1B! A\x80j! A\x80j!   j\xAD"}!  \x86!B\0!\x1BB\0!A!@@  I\r\0@@  I\r\0@@@  \x07O\r\0 B?V\r@@@@@@@@@  k"A\x07K\r\0B\0! \b\b\x07\b\vB\0  j)\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \x1BB\b\x88B\x80\x80\x80\xF8\x83 \x1BB\x88B\x80\x80\xFC\x07\x83\x84 \x1BB(\x88B\x80\xFE\x83 \x1BB8\x88\x84\x84\x84"B\0 }\x86 P\x1B!\x1B  \x88 \x84! B\xC0\0\x84! A\bj!\f	\v  j1\0\0B8\x86! Aj!\f\v  j/\0\0"A\bt A\bvr\xADB0\x86! Aj!\f\v  j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! Aj!\f\v  j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! Aj!\f\v  j"Aj1\0\0B \x86"B\b\x88 5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B \x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v  j"5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B Aj3\0\0"B \x86\x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v  j"5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B Aj1\0\0B0\x86"  Aj3\0\0"B \x86\x84\x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!\x1B  \x88 \x84!B\x7F!\f\v \bA6 \bA\xCB\x9E\xC0\x80\x006\f 
 gA\x7Fs"Aq":\0\0 
 \x07gA\x7Fs"Aq":\0\bA\xC0\0 t!!A\xC0\0 t!A!A! A\x7Fj""!A!A! \x07A\x7Fj"!A!A!@@@ AqE\r\0 AqE\r\0 B\xC0\0Z\r@@@@@@@@@  \fk"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \fj)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \r\x84!\r B\xC0\0\x84! \fA\bj!\f\f	\v \0 \fj1\0\0B8\x86! \fAj!\f\f\v \0 \fj/\0\0"A\bt A\bvr\xADB0\x86! \fAj!\f\f\v \0 \fj"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! \fAj!\f\f\v \0 \fj(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \fAj!\f\f\v \0 \fj"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86"  Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! \fA\x07j!\f\vB\0 B\0 }\x86 P\x1B!  \x88 \r\x84!\rB\x7F!\f\v@@ Aq\r\0@@@@ AqE\r\0 B?X\r\f\v \bB\x007\fA\0!\v\f\r\v@@@@@@@@@  k"A\x07K\r\0B\0!\r \b\b\x07\b\vB\0  j)\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \rB\b\x88B\x80\x80\x80\xF8\x83 \rB\x88B\x80\x80\xFC\x07\x83\x84 \rB(\x88B\x80\xFE\x83 \rB8\x88\x84\x84\x84"\rB\0 }\x86 P\x1B!\x1B \r \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v  j1\0\0B8\x86!\r Aj!\f\v  j/\0\0"A\bt A\bvr\xADB0\x86!\r Aj!\f\v  j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86!\r Aj!\f\v  j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86!\r Aj!\f\v  j"Aj1\0\0B \x86"B\b\x88 5\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r \x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84!\r Aj!\f\v  j"5\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r Aj3\0\0"B \x86\x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84!\r Aj!\f\v  j"5\0\0"\rB8\x86 \rB\x80\xFE\x83B(\x86\x84 \r Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"\rB\x80\x80\xFC\x07\x83B\x86 \rB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84!\r A\x07j!\vB\0 \rB\0 }\x86 P\x1B!\x1B \r \x88 \x84!B\x7F!\v@@ PE\r\0A\xC6\xA2\xC0\x80\0!B\0!\f\v A AI\x1BAt(\xC8\xA2\xC0\x80\0 B\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r\f  A\0 kA?q\xAD\x88 5|\xA7"jAj" !O\r\f A	 A	I\x1BAt(\x88\xA3\xC0\x80\0  \xAD\x86"\rB\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r\f   qA\btj 	  vj-\0\0Atj \rA\0 kA?q\xAD\x88 5|\xA7Aj"A\0   j\xAD"\rB?\x85"\x88\xA7Aq"ks j\xB28\0  \rB|"\r\x86 \x1B \x88\x84!  \r}! \x1B \r\x86!\x1BA\xB2\xA3\xC0\x80\0!\v -\0\0!\f\0\v\v@ B\xC0\0Z\r\0@@@@@@@@@  \fk"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \fj)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \r\x84!\r B\xC0\0\x84! \fA\bj!\f\f\b\v \0 \fj1\0\0B8\x86! \fAj!\f\f\v \0 \fj/\0\0"A\bt A\bvr\xADB0\x86! \fAj!\f\f\v \0 \fj"/\0\0"#A\x80\xFEq Aj-\0\0rA\bt #AtrA\bv\xADB(\x86! \fAj!\f\f\v \0 \fj(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \fAj!\f\f\v \0 \fj"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86"  Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! \fA\x07j!\f\vB\0 B\0 }\x86 P\x1B!  \x88 \r\x84!\rB\x7F!\v@@ \rPE\r\0A\xC6\xA2\xC0\x80\0!B\0!\r\f\v A AI\x1BAt(\xC8\xA2\xC0\x80\0 \rB\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r
  \rA\0 kA?q\xAD\x88 5|\xA7"jAj" O\r
 A	 A	I\x1BAt(\x88\xA3\xC0\x80\0 \r \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0"#AK\r
   "qA\btj 	  vj-\0\0Atj A\0 #kA?q\xAD\x88 5|\xA7Aj"A\0 \r # j\xAD"B?\x85" \x88\xA7Aq"ks j\xB28\0 \r B|"\x86   \x88\x84!\r  }!  \x86!A\xB2\xA3\xC0\x80\0!\v -\0\0!\f\0\v\v@@ \rPE\r\0A\xC6\xA2\xC0\x80\0!B\0!\r\f\v A AI\x1BAt(\xC8\xA2\xC0\x80\0 \rB\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r\b  \rA\0 kA?q\xAD\x88 5|\xA7"jAj" O\r\b A	 A	I\x1BAt(\x88\xA3\xC0\x80\0 \r \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r\b   "qA\btj 	  vj-\0\0Atj A\0 kA?q\xAD\x88 5|\xA7Aj"A\0 \r  j\xAD"B?\x85" \x88\xA7Aq"ks j\xB28\0 \r B|"\x86   \x88\x84!\r  }!  \x86!A\xB2\xA3\xC0\x80\0!\v -\0\0!@ B\xC0\0Z\r\0@@@@@@@@@  k"A\x07K\r\0B\0! \b\b\x07\b\vB\0  j)\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \x1BB\b\x88B\x80\x80\x80\xF8\x83 \x1BB\x88B\x80\x80\xFC\x07\x83\x84 \x1BB(\x88B\x80\xFE\x83 \x1BB8\x88\x84\x84\x84"B\0 }\x86 P\x1B!\x1B  \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v  j1\0\0B8\x86! Aj!\f\v  j/\0\0"A\bt A\bvr\xADB0\x86! Aj!\f\v  j"/\0\0"#A\x80\xFEq Aj-\0\0rA\bt #AtrA\bv\xADB(\x86! Aj!\f\v  j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! Aj!\f\v  j"Aj1\0\0B \x86"B\b\x88 5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B \x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v  j"5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B Aj3\0\0"B \x86\x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v  j"5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B Aj1\0\0B0\x86"  Aj3\0\0"B \x86\x84\x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!\x1B  \x88 \x84!B\x7F!\v@@ PE\r\0A\xC6\xA2\xC0\x80\0!B\0!\f\v A AI\x1BAt(\xC8\xA2\xC0\x80\0 B\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r\b  A\0 kA?q\xAD\x88 5|\xA7"jAj" !O\r\b A	 A	I\x1BAt(\x88\xA3\xC0\x80\0  \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0"#AK\r\b   qA\btj 	  vj-\0\0Atj A\0 #kA?q\xAD\x88 5|\xA7Aj"A\0  # j\xAD"B?\x85" \x88\xA7Aq"ks j\xB28\0  B|"\x86 \x1B  \x88\x84!  }! \x1B \x86!\x1BA\xB2\xA3\xC0\x80\0!\v -\0\0!\f\0\v\v A AI\x1BAt(\xA8\xA2\xC0\x80\0 B\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r  A\0 A\0 A\0 kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0 B BT\x1B\xA7At(\xA8\xA2\xC0\x80\0  \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r A\x80j A\0 A\0 A\0 kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0 \x1BB\0  j\xAD"}\x88  \x86\x84! A\x80j! Aj!  }! \x1B \x86!\x1B\f\0\v\v@ B\xC0\0Z\r\0@@@@@@@@@  \fk"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \fj)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \r\x84!\r B\xC0\0\x84! \fA\bj!\f\f\b\v \0 \fj1\0\0B8\x86! \fAj!\f\f\v \0 \fj/\0\0"A\bt A\bvr\xADB0\x86! \fAj!\f\f\v \0 \fj"/\0\0"#A\x80\xFEq Aj-\0\0rA\bt #AtrA\bv\xADB(\x86! \fAj!\f\f\v \0 \fj(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \fAj!\f\f\v \0 \fj"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86"  Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! \fA\x07j!\f\vB\0 B\0 }\x86 P\x1B!  \x88 \r\x84!\rB\x7F!\v A AI\x1BAt(\xA8\xA2\xC0\x80\0 \rB\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r  A\0 A\0 \rA\0 kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0 B BT\x1B\xA7At(\xA8\xA2\xC0\x80\0 \r \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0"#AK\r A\x80j A\0 A\0 A\0 #kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0 B\0 # j\xAD"}\x88 \r \x86\x84!\r A\x80j! A\x80j! Aj!  }!  \x86!\f\0\v\v@ B\xC0\0Z\r\0@@@@@@@@@  \fk"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \fj)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \r\x84!\r B\xC0\0\x84! \fA\bj!\f\f\b\v \0 \fj1\0\0B8\x86! \fAj!\f\f\v \0 \fj/\0\0"A\bt A\bvr\xADB0\x86! \fAj!\f\f\v \0 \fj"/\0\0"#A\x80\xFEq Aj-\0\0rA\bt #AtrA\bv\xADB(\x86! \fAj!\f\f\v \0 \fj(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \fAj!\f\f\v \0 \fj"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \fAj!\f\f\v \0 \fj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86"  Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! \fA\x07j!\f\vB\0 B\0 }\x86 P\x1B!  \x88 \r\x84!\rB\x7F!\v A AI\x1BAt(\xA8\xA2\xC0\x80\0 \rB\x80\x80\x80\x80\x84y\xA7Atj"(\0"AK\r  A\0 A\0 \rA\0 kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"#\xB28\0 B BT\x1B\xA7At(\xA8\xA2\xC0\x80\0 \r \xAD\x86"B\x80\x80\x80\x80\x84y\xA7Atj"(\0""AK\r A\x80j #A\0 A\0 A\0 "kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0@ B\xC0\0Z\r\0@@@@@@@@@  k"#A\x07K\r\0B\0! #\b\b\x07\b\vB\0  j)\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 \x1BB\b\x88B\x80\x80\x80\xF8\x83 \x1BB\x88B\x80\x80\xFC\x07\x83\x84 \x1BB(\x88B\x80\xFE\x83 \x1BB8\x88\x84\x84\x84"B\0 }\x86 P\x1B!\x1B  \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v  j1\0\0B8\x86! Aj!\f\v  j/\0\0"#A\bt #A\bvr\xADB0\x86! Aj!\f\v  j"#/\0\0"!A\x80\xFEq #Aj-\0\0rA\bt !AtrA\bv\xADB(\x86! Aj!\f\v  j(\0\0"#At #A\x80\xFEqA\btr #A\bvA\x80\xFEq #Avrr\xADB \x86! Aj!\f\v  j"#Aj1\0\0B \x86"B\b\x88 #5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B \x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v  j"#5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B #Aj3\0\0"B \x86\x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v  j"#5\0\0"\x1BB8\x86 \x1BB\x80\xFE\x83B(\x86\x84 \x1B #Aj1\0\0B0\x86"  #Aj3\0\0"B \x86\x84\x84"\x1BB\x80\x80\xFC\x07\x83B\x86 \x1BB\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83  B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!\x1B  \x88 \x84!B\x7F!\v A AI\x1BAt(\xA8\xA2\xC0\x80\0 B\x80\x80\x80\x80\x84y\xA7Atj"(\0"#AK\r  A\0 A\0 A\0 #kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0 B BT\x1B\xA7At(\xA8\xA2\xC0\x80\0  #\xAD\x86" B\x80\x80\x80\x80\x84y\xA7Atj"(\0"!AK\r B\0 " j\xAD"}\x88 \r \x86\x84!\r  }!  \x86! A\x80j A\0 A\0  A\0 !kA?q\xAD\x88 4|"\xA7"Aqks P\x1B"k  AjAvsj"\xB28\0 \x1BB\0 ! #j\xAD"}\x88  \x86\x84! A\x80j! A\x80j! Aj!  }! \x1B \x86!\x1B\f\0\v\v 
Aj$\x80\x80\x80\x80\0 \v\v\xCAK\b\x7F {\x7F~\x7F{
\x7F{#\x80\x80\x80\x80\0A k"$\x80\x80\x80\x80\0 \0(\0"\xFD\0\x8C! \xFD\0\xFC! \xFD\0\xEC! \xFD\0\xDC! \xFD\0\xCC!\x07 \xFD\0\xBC!\b \xFD\0\xAC!	 \xFD\0\x9C!
 \xFD\0\x8C!\v \xFD\0\xFC!\f \xFD\0\xEC!\r \xFD\0\xDC! \xFD\0\xCC! \xFD\0\xBC! \xFD\0\xAC! \xFD\0\x9C! \xFD\0\x8C! \xFD\0\xFC! \xFD\0\xEC! \xFD\0\xDC! \xFD\0\xCC! \xFD\0\xBC! \xFD\0\xAC! \xFD\0\x9C! \xFD\0\x8C!\x1B \xFD\0\xFC! \xFD\0\xEC! \xFD\0\xDC! \xFD\0\xCC! \xFD\0\xBC!  \xFD\0\xAC!! \xFD\0\x9C!" (!# (!$ \0(\b"%($!& %-\x004!' \0("((!) ((!* ((\0!+ ((\f!, %(0!- (( !. ((\b!/ ((!0  %("1 (\x90t"2A\bt 1A	t"3j"4A\xFF\xFF\xFF\xFFK:\0@@ 4A\x80\x80\x80\x80I\r\0A9!0\f\v@@@@@ 4At"5\r\0B\xF0\xFF\xFF\xFF!6\f\vB\0B\x80\x80\x80\x80\x90\x07A\0)\xB8\xA3\xC0\x80\0"6\xA7 5AA\0 6B \x88\xA7(\0\x80\x80\x80\x80\0\x80\x80\x80\x80\0"5\x1B!6 5E\r 6 5\xAD\x84!6\v , /l",A 0kv"5 ,j .A\x07jAv"7l"8 / 0AGv 7 -l"0l".j!- . , 7l"9j!. ) 5At ,j 7l"5 0 /l":A\0 *A\0J\x1Bj"/k!; + /j!< 'Aq!= 6\xA7!> (("?A\x7FF\r\f\v 6B \x88\xA7!0\f\v (\xA0 (\xA4AljAlj \0G\r\0@ (( "@A\bG\r\0 ;E\r <A\xFF ;\xFC\v\0\f\v ;Av"*A\x80\xC0\0 *A\x80\xC0\0I\x1BAt!0A < ) /F\x1B!,A\x7F @A\xFF\xFFqtA\x7Fs!)A\0!/@@ 0 /G\r\0A\x80\x80!0A\x80\xC0\0!/@@ /A\xFF?j *O\r@A\x80\x80E\r\0 , 0j ,A\x80\x80\xFC
\0\0\v 0A\x80\x80j!0 /A\x80\xC0\0j!/\f\0\v\v / *O\r *At 0k"/E\r , 0j , /\xFC
\0\0\f\v , /j );\0 /Aj!/\f\0\v\v 5 -k!A + -j!B 8 .k!C + .j!D 9 :k!EA\x90\x88\xC0\x80\0A\xD0\x88\xC0\x80\0 =\x1B!5 + :j!F > 3Atj"G 2A\x80lj!H G 2A	tj!I G 2A\btj!J 'Aq!K 4At!L > 1A
tj!M@@@@@@ %A\xFE,"1 &O\r %( 1At"0j(\0!/ \0(\b"+( 0j(\0!2@@@@@@@@@@ 1Aj", &G\r\0A\xE3\0!0 # /F\r # /Aj",F\r # /Aj")kAI\r # /Aj"*kAI\rA5!8A\xEF\xA1\xC0\x80\0!9 2 $ )j/\0\0")A\bt )A\bvrA\xFF\xFFq"% $ /j-\0\0"3Av":j $ *j/\0\0")A\bt )A\bvrA\xFF\xFFq"-j".I\r $ ,j-\0\0!, /Aj!* 3A?M\r # *kAI\r $ *j/\0\0"#A\bt #A\bvrA\xFF\xFFq!) /A\bj!*\f\vA\xE3\0!0 # /F\r # /Aj")F\r # /Aj"*kAI\r # /Aj"-kAI\rA5!9A\xEF\xA1\xC0\x80\0!@ 2 $ *j/\0\0"*A\bt *A\bvrA\xFF\xFFq"8 $ /j-\0\0"3Av":j $ -j/\0\0"*A\bt *A\bvrA\xFF\xFFq"=j".I\r $ )j-\0\0!) /Aj!* 3A?M\r # *kAI\r $ *j/\0\0"0A\bt 0A\bvrA\xFF\xFFq!- /A\bj!*\f\v 2 .k!)\v 2 ) .j"3I\r\0 / :j". *O\rA!8A\x9F\x9F\xC0\x80\0!9\v \0 86 \0 96\f\f
\v +("/A +(\f"#\x1B 1 1 +(\b"+n"0 +lk"+Atj/\0!1@ / #AtjA #\x1B +j-\0\0"/ (\x90t"#A	t /A
t"+j"*E\r\0 >A\0 *\xFC\v\0\v  0At":6\b  1At"86 $ .j % > /At"1 \0 5\x82\x80\x80\x80\0A\xFF\xFFq"0\r
 > +j!+ $ . %j"%j!0   ,A ,AK\x1B"*A\xE0 *A\xE0I\x1B"*AtA\x80}j * ,A\x80K\x1B\xB3\xFD"N\xFD\xE6!O ! N\xFD\xE6!P " N\xFD\xE6!Q  N\xFD\xE6!R  N\xFD\xE6!S  N\xFD\xE6!T  N\xFD\xE6!U \x1B N\xFD\xE6!V  N\xFD\xE6!W  N\xFD\xE6!X  N\xFD\xE6!Y  N\xFD\xE6!Z  N\xFD\xE6![  N\xFD\xE6!\\  N\xFD\xE6!]  N\xFD\xE6!^@@ 7AG\r\0 \0 > F E Q P O R S T U V W X Y Z [ \\ ] ^ Aj 1A\0 '\x85\x80\x80\x80\0\f\v \0 > F E Q P O R S T U V W X Y Z [ \\ ] ^ Aj 1A\0 '\x86\x80\x80\x80\0\v 0 - + # \0 5\x82\x80\x80\x80\0A\xFF\xFFq"0\r
 + #A\btj!1  N\xFD\xE6!O  N\xFD\xE6!P  N\xFD\xE6!Q $ % -j"%j!,  N\xFD\xE6!R  N\xFD\xE6!S \r N\xFD\xE6!T \f N\xFD\xE6!U \v N\xFD\xE6!V 
 N\xFD\xE6!W 	 N\xFD\xE6!X \b N\xFD\xE6!Y \x07 N\xFD\xE6!Z  N\xFD\xE6![  N\xFD\xE6!\\  N\xFD\xE6!]  N\xFD\xE6!N ((!0 (\x90!*@ 7AG\r\0@@@@@@@ *AG\r\0 0\v 0\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x87\x80\x80\x80\0\f\f\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x88\x80\x80\x80\0\f\v\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x89\x80\x80\x80\0\f
\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8A\x80\x80\x80\0\f	\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8B\x80\x80\x80\0\f\b\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj #A '\x85\x80\x80\x80\0\f\x07\v *AF\r@@@ 0\0\0\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8C\x80\x80\x80\0\f\b\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8D\x80\x80\x80\0\f\x07\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj #A '\x86\x80\x80\x80\0\f\v 2 .k!-\v 2 - .j"_I\r\0 / :j"@ *O\rA!9A\x9F\x9F\xC0\x80\0!@\v \0 96 \0 @6\f\f\v 1 +(\b".n!9A\xE3\0!0 # %( ,At"*j(\0"/F\r # /Aj"3F\r # /Aj"\`kAI\r # /Aj"akAI\rA5!bA\xEF\xA1\xC0\x80\0!c@@ +( *j(\0": $ \`j/\0\0"*A\bt *A\bvrA\xFF\xFFq"\` $ /j-\0\0"dAv"ej $ aj/\0\0"*A\bt *A\bvrA\xFF\xFFq"aj"fI\r\0 +("g +(\f"*AtjA *\x1B 1 9 .lk".j-\0\0!1 gA *\x1B .Atj/\0!g $ 3j-\0\0!* /Aj!3@@ dA?M\r\0 # 3kAI\r
 $ 3j/\0\0"0A\bt 0A\bvrA\xFF\xFFq!. /A\bj!3\f\v : fk!.\v : . fj"hI\r\0 / ej"f 3O\rA!bA\x9F\x9F\xC0\x80\0!c\v \0 b6 \0 c6\f\f\v $ @j!0 +("3 +(\f"/AtjA /\x1B , , +(\b"+n"d +lk"+j-\0\0!, 3A /\x1B +Atj/\0!/@ LE\r\0 >A\0 L\xFC\v\0\v  9At"e6  gAt"g6\f  dAt"b6  /At"c6 (\x90!+ 0 8 $ fj \` > M 1At"3 ,At"9 \0 5\x83\x80\x80\x80\0A\xFF\xFFq"0\r $ @ 8j"dj!0 , +t!/ $ f \`j"\`j!8   *A *AK\x1B"@A\xE0 @A\xE0I\x1B"@AtA\x80}j @ *A\x80K\x1B\xB3\xFD"N\xFD\xE6!P ! N\xFD\xE6!Q " N\xFD\xE6!R   )A )AK\x1B"*A\xE0 *A\xE0I\x1B"*AtA\x80}j * )A\x80K\x1B\xB3\xFD"O\xFD\xE6!S ! O\xFD\xE6!T " O\xFD\xE6!U  N\xFD\xE6!V  O\xFD\xE6!W  N\xFD\xE6!X  O\xFD\xE6!Y  N\xFD\xE6!Z  O\xFD\xE6![  N\xFD\xE6!\\  O\xFD\xE6!] \x1B N\xFD\xE6!^ \x1B O\xFD\xE6!i  N\xFD\xE6!j  O\xFD\xE6!k  N\xFD\xE6!l  O\xFD\xE6!m 1 +t!+  N\xFD\xE6!n  O\xFD\xE6!o  N\xFD\xE6!p  O\xFD\xE6!q  N\xFD\xE6!r  O\xFD\xE6!s  N\xFD\xE6!t  O\xFD\xE6!u  N\xFD\xE6!v  O\xFD\xE6!w  N\xFD\xE6!x  O\xFD\xE6!y@@ 7AG\r\0 \0 > F E U T S W Y [ ] i k m o q s u w y A\fj 3A\0 '\x85\x80\x80\x80\0 \0 M F E R Q P V X Z \\ ^ j l n p r t v x Aj 9A\0 '\x85\x80\x80\x80\0\f\v \0 > F E U T S W Y [ ] i k m o q s u w y A\fj 3A\0 '\x86\x80\x80\x80\0 \0 M F E R Q P V X Z \\ ^ j l n p r t v x Aj 9A\0 '\x86\x80\x80\x80\0\v 0 = 8 a G J + / \0 5\x83\x80\x80\x80\0A\xFF\xFFq"0\r $ d =j"9j!)  N\xFD\xE6!P  N\xFD\xE6!Q  N\xFD\xE6!R  O\xFD\xE6!S  O\xFD\xE6!T  O\xFD\xE6!U $ \` aj"=j!*  N\xFD\xE6!V  O\xFD\xE6!W  N\xFD\xE6!X  O\xFD\xE6!Y \r N\xFD\xE6!Z \r O\xFD\xE6![ \f N\xFD\xE6!\\ \f O\xFD\xE6!] \v N\xFD\xE6!^ \v O\xFD\xE6!i 
 N\xFD\xE6!j 
 O\xFD\xE6!k 	 N\xFD\xE6!l 	 O\xFD\xE6!m \b N\xFD\xE6!n \b O\xFD\xE6!o \x07 N\xFD\xE6!p \x07 O\xFD\xE6!q  N\xFD\xE6!r  O\xFD\xE6!s  N\xFD\xE6!t  O\xFD\xE6!u  N\xFD\xE6!v  O\xFD\xE6!w  N\xFD\xE6!N  O\xFD\xE6!O ((!0 (\x90!3@@@@@@ 7AG"8\r\0@@@@@@ 3AG\r\0 0\x07\x07\v 0\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x88\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x89\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x8A\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x8B\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj +A '\x85\x80\x80\x80\0\f\v 3AF\r@@@ 0\0\0\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x8C\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x8D\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj +A '\x86\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x87\x80\x80\x80\0\v ((!0@@@@@@@ (\x90AG\r\0 0\v 0\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x87\x80\x80\x80\0\f\x07\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x88\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x89\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8A\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8B\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj /A '\x85\x80\x80\x80\0\f\v@@@ 0\0\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x8E\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x8F\x80\x80\x80\0\f\v \0 G D C U T S W Y [ ] i k m o q s u w O A\fj + '\x90\x80\x80\x80\0\v ((!0@@@@@@@ (\x90AG\r\0 0\v 0\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x90\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8E\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8F\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8C\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8D\x80\x80\x80\0\f\v \0 J D C R Q P V X Z \\ ^ j l n p r t v N Aj /A '\x86\x80\x80\x80\0\v ) - * . I H + / \0 5\x83\x80\x80\x80\0A\xFF\xFFq"0\r ((!0 (\x90!)@@@@@@ 8\r\0@@@@@@ )AG\r\0 0\x07\x07\v 0\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x88\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x89\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x8A\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x8B\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj +A '\x85\x80\x80\x80\0\f\v )AF\r@@@ 0\0\0\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x8C\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x8D\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj +A '\x86\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x87\x80\x80\x80\0\v ((!+@@@@@@@ (\x90AG\r\0 +\v +\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x87\x80\x80\x80\0\f\x07\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x88\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x89\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8A\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8B\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj /A '\x85\x80\x80\x80\0\f\v@@@ 0\0\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x8E\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x8F\x80\x80\x80\0\f\v \0 I B A U T S W Y [ ] i k m o q s u w O A\fj + '\x90\x80\x80\x80\0\v ((!+@@@@@@@ (\x90AG\r\0 +\v +\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x90\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8E\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8F\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8C\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj / '\x8D\x80\x80\x80\0\f\v \0 H B A R Q P V X Z \\ ^ j l n p r t v N Aj /A '\x86\x80\x80\x80\0\v ?A\0L\r 2 _k!+ $ - 9jj!0 : hk!2 $ . =jj!) ,A\bt!* ,At!, 1A\bt!- 1At!1 ((\b Kt!. (( !/@@@@@@@ ((A\bG\r\0 /Axj

\v /Axj		\v 0 + < ; g e 1 - .\x91\x80\x80\x80\0 ) 2 < ; c b , * ((\b Kt\x91\x80\x80\x80\0\f\v 0 + < ; g e 1 - .\x92\x80\x80\x80\0 ) 2 < ; c b , * ((\b Kt\x92\x80\x80\x80\0\f\v 0 + < ; g e 1 - .\x93\x80\x80\x80\0 ) 2 < ; c b , * ((\b Kt\x93\x80\x80\x80\0\f\v 0 + < ; g e 1 - .\x94\x80\x80\x80\0 ) 2 < ; c b , * ((\b Kt\x94\x80\x80\x80\0\f\v 0 + < ; g e 1 - .\x95\x80\x80\x80\0 ) 2 < ; c b , * ((\b Kt\x95\x80\x80\x80\0\f\v 0 + < ; g e 1 - .\x96\x80\x80\x80\0 ) 2 < ; c b , * ((\b Kt\x96\x80\x80\x80\0\f\v\v@@@ 0\0\0\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x90\x80\x80\x80\0\f\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8E\x80\x80\x80\0\f\v \0 + D C Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8F\x80\x80\x80\0\v , ) 1 # \0 5\x82\x80\x80\x80\0A\xFF\xFFq"0\r ((!+ (\x90!@@ 7AG\r\0@@@@@@ AG\r\0@ +\0\0\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x87\x80\x80\x80\0\f\x07\v +\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x88\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x89\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8A\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8B\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj #A '\x85\x80\x80\x80\0\f\v@ AF\r\0@@@ +\0\0\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8C\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8D\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj #A '\x86\x80\x80\x80\0\f\v@@@ +\0\0\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x90\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8E\x80\x80\x80\0\f\v \0 1 B A Q P O R S T U V W X Y Z [ \\ ] N Aj # '\x8F\x80\x80\x80\0\v ?A\0L\r /A\bt!\0 2 3k! $ ) %jj!$ /At!# ((\b Kt!/ (( !+@@@@@@@ ((A\bG\r\0 +Axj\x07\x07\v +Axj\v $  < ; 8 : # \0 /\x91\x80\x80\x80\0\f\v $  < ; 8 : # \0 /\x92\x80\x80\x80\0\f\v $  < ; 8 : # \0 /\x93\x80\x80\x80\0\f\v $  < ; 8 : # \0 /\x94\x80\x80\x80\0\f\v $  < ; 8 : # \0 /\x95\x80\x80\x80\0\f\v $  < ; 8 : # \0 /\x96\x80\x80\x80\0\f\v\0\v > 4\x97\x80\x80\x80\0A\0!0\f\vA\xE4\0!0\v > 4\x97\x80\x80\x80\0\v A j$\x80\x80\x80\x80\0 0\v\x80L\x7F{}S{ A \x1B" \0("(\b t" (" A\bj" Aq"\x1B"lj!\x1B     \x1B"lj!   A\x07jlj!   Ajlj!   Ajlj!   Ajlj!    Ajlj!!   Ajlj!"   Ajlj!#   A\x07jlj!$   Ajlj!%   Ajlj!&   Ajlj!'   Ajlj!(   Ajlj!)   Ajlj!*   lj!+ A\bj!,A\x7F / tA\x7FsA\xFF\xFFq\xFD!- (\0! \0(\0*\x9C!.A\0!@@  O\r A\xF0\x07j\xFD\0\0!/ A\xB0j\xFD\0\0!0 A\xB0\x07j\xFD\0\0!1 A\xF0j\xFD\0\0!2 A\xD0\x07j\xFD\0\0!3 A\xD0j\xFD\0\0!4 A\x90\x07j\xFD\0\0!5 A\x90j\xFD\0\0!6 A\xE0\x07j\xFD\0\0!7 A\xA0j\xFD\0\0!8 A\xA0\x07j\xFD\0\0!9 A\xE0j\xFD\0\0!: A\xC0\x07j\xFD\0\0!; A\xC0j\xFD\0\0!< A\x80\x07j\xFD\0\0!= A\x80j\xFD\0\0!> A\xF0j\xFD\0\0!? A\xB0j\xFD\0\0!@ A\xB0j\xFD\0\0!A A\xF0j\xFD\0\0!B A\xD0j\xFD\0\0!C A\xD0j\xFD\0\0!D A\x90j\xFD\0\0!E A\x90j\xFD\0\0!F A\xE0j\xFD\0\0!G A\xA0j\xFD\0\0!H A\xA0j\xFD\0\0!I A\xE0j\xFD\0\0!J A\xC0j\xFD\0\0!K A\xC0j\xFD\0\0!L A\x80j\xFD\0\0!M A\x80j\xFD\0\0!N A\xF0j\xFD\0\0!O A\xB0j\xFD\0\0!P A\xB0j\xFD\0\0!Q A\xF0j\xFD\0\0!R A\xD0j\xFD\0\0!S A\xD0j\xFD\0\0!T A\x90j\xFD\0\0!U A\x90j\xFD\0\0!V A\xE0j\xFD\0\0!W A\xA0j\xFD\0\0!X A\xA0j\xFD\0\0!Y A\xE0j\xFD\0\0!Z A\xC0j\xFD\0\0![ A\xC0j\xFD\0\0!\\ A\x80j\xFD\0\0!] A\x80j\xFD\0\0!^ + j"  \xFD\0 \xFD\xE6"_  \xFD\0\xE0\xFD\xE6"\`\xFD\xE4"a  \xFD\0\xA0\xFD\xE6"b 
 \xFD\0\`\xFD\xE6"c\xFD\xE4"d\xFD\xE4"e \b \xFD\0@\xFD\xE6"f  \xFD\0\xC0\xFD\xE6"g\xFD\xE4"h \f \xFD\0\x80\xFD\xE6"i  \xFD\0\0\xFD\xE6"j . j\xFD\0\x92\xFD \0"j\xFD\xE4"k\xFD\xE4"l\xFD\xE4"m f g\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"f\xFD\xE6 h\xFD\xE5"g j i\xFD\xE5"i\xFD\xE4"n b c\xFD\xE5"c _ \`\xFD\xE5"b\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"_\xFD\xE6"j b\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"\`\xFD\xE6\xFD\xE4 e\xFD\xE5"b\xFD\xE4"o\xFD\r\0\x07"p i g\xFD\xE5"q a d\xFD\xE5 f\xFD\xE6 b\xFD\xE5"a\xFD\xE4"r k h\xFD\xE5"k c\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"h\xFD\xE6 j\xFD\xE5 a\xFD\xE4"s\xFD\xE5"j\xFD\r\0\x07"t\xFD\r\0\x07"u \x07 \xFD\00\xFD\xE6"g  \xFD\0\xF0\xFD\xE6"i\xFD\xE4"v  \xFD\0\xB0\xFD\xE6"w \v \xFD\0p\xFD\xE6"x\xFD\xE4"y\xFD\xE4"c 	 \xFD\0P\xFD\xE6"z  \xFD\0\xD0\xFD\xE6"{\xFD\xE4"d \r \xFD\0\x90\xFD\xE6"|  \xFD\0\xFD\xE6"}\xFD\xE4"~\xFD\xE4"\x7F\xFD\xE4"\x80 z {\xFD\xE5 f\xFD\xE6 d\xFD\xE5"z } |\xFD\xE5"{\xFD\xE4"| w x\xFD\xE5"w g i\xFD\xE5"g\xFD\xE5 _\xFD\xE6"x g \`\xFD\xE6\xFD\xE4 c\xFD\xE5"g\xFD\xE4"}\xFD\r\0\x07"\x81 { z\xFD\xE5"z v y\xFD\xE5 f\xFD\xE6 g\xFD\xE5"i\xFD\xE4"v ~ d\xFD\xE5"y w h\xFD\xE6 x\xFD\xE5 i\xFD\xE4"w\xFD\xE5"d\xFD\r\0\x07"x\xFD\r\0\x07"{\xFD\xE4"~ m o\xFD\r\b	
\v\x1B\f\r"m r j\xFD\r\b	
\v\x1B\f\r"j\xFD\r\0\x07"o \x80 }\xFD\r\b	
\v\x1B\f\r"r v d\xFD\r\b	
\v\x1B\f\r"v\xFD\r\0\x07"}\xFD\xE4"d\xFD\xE4"\x80 p t\xFD\r\b	
\v\f\r\x1B"p r v\xFD\r\b	
\v\f\r\x1B"r\xFD\xE4"t \x81 x\xFD\r\b	
\v\f\r\x1B"v m j\xFD\r\b	
\v\f\r\x1B"m\xFD\xE4"x\xFD\xE4"j\xFD\xE4\xFD\xF9 -\xFD\xB7 k s\xFD\xE4"k q a\xFD\xE5"a\xFD\r\0\x07"q n b\xFD\xE5"b l e\xFD\xE5"e\xFD\r\0\x07"l\xFD\r\0\x07"n y w\xFD\xE4"s z i\xFD\xE5"i\xFD\r\0\x07"w | g\xFD\xE5"g \x7F c\xFD\xE5"c\xFD\r\0\x07"y\xFD\r\0\x07"z\xFD\xE4"| k a\xFD\r\b	
\v\x1B\f\r"a b e\xFD\r\b	
\v\x1B\f\r"b\xFD\r\0\x07"k s i\xFD\r\b	
\v\x1B\f\r"i g c\xFD\r\b	
\v\x1B\f\r"c\xFD\r\0\x07"g\xFD\xE4"e\xFD\xE4"s q l\xFD\r\b	
\v\f\r\x1B"l i c\xFD\r\b	
\v\f\r\x1B"c\xFD\xE4"i w y\xFD\r\b	
\v\f\r\x1B"q a b\xFD\r\b	
\v\f\r\x1B"w\xFD\xE4"y\xFD\xE4"b\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r u {\xFD\xE5"u o }\xFD\xE5 f\xFD\xE6 d\xFD\xE5"o\xFD\xE4"{ v m\xFD\xE5"m p r\xFD\xE5"a\xFD\xE5 _\xFD\xE6"p a \`\xFD\xE6\xFD\xE4 j\xFD\xE5"a\xFD\xE4\xFD\xF9 -\xFD\xB7 n z\xFD\xE5"n k g\xFD\xE5 f\xFD\xE6 e\xFD\xE5"k\xFD\xE4"r q w\xFD\xE5"q l c\xFD\xE5"c\xFD\xE5 _\xFD\xE6"l c \`\xFD\xE6\xFD\xE4 b\xFD\xE5"c\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"g\xFD[\0\0\0  j" g\xFD[\0\0  j" u o\xFD\xE5"o t x\xFD\xE5 f\xFD\xE6 a\xFD\xE5"g\xFD\xE4\xFD\xF9 -\xFD\xB7 n k\xFD\xE5"k i y\xFD\xE5 f\xFD\xE6 c\xFD\xE5"i\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r ~ d\xFD\xE5"d m h\xFD\xE6 p\xFD\xE5 g\xFD\xE4"m\xFD\xE5\xFD\xF9 -\xFD\xB7 | e\xFD\xE5"e q h\xFD\xE6 l\xFD\xE5 i\xFD\xE4"l\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"n\xFD[\0\0\0  j" n\xFD[\0\0  j" d m\xFD\xE4\xFD\xF9 -\xFD\xB7 e l\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r o g\xFD\xE5\xFD\xF9 -\xFD\xB7 k i\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"e\xFD[\0\0\0  j" e\xFD[\0\0  j" { a\xFD\xE5\xFD\xF9 -\xFD\xB7 r c\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r \x80 j\xFD\xE5\xFD\xF9 -\xFD\xB7 s b\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"e\xFD[\0\0\0  j" e\xFD[\0\0   A\bj" \x1B"j  X\xFD\xE6"a  W\xFD\xE6"c\xFD\xE4"d  Y\xFD\xE6"g 
 Z\xFD\xE6"i\xFD\xE4"j\xFD\xE4"e \b \\\xFD\xE6"W  [\xFD\xE6"X\xFD\xE4"b \f ]\xFD\xE6"Y  ^\xFD\xE6"Z . Z\xFD\0\x92\xFD \0"Z\xFD\xE4"[\xFD\xE4"\\\xFD\xE4"] W X\xFD\xE5 f\xFD\xE6 b\xFD\xE5"W Z Y\xFD\xE5"X\xFD\xE4"Y g i\xFD\xE5"g a c\xFD\xE5"a\xFD\xE5 _\xFD\xE6"i a \`\xFD\xE6\xFD\xE4 e\xFD\xE5"a\xFD\xE4"Z\xFD\r\0\x07"^ X W\xFD\xE5"W d j\xFD\xE5 f\xFD\xE6 a\xFD\xE5"c\xFD\xE4"j [ b\xFD\xE5"X g h\xFD\xE6 i\xFD\xE5 c\xFD\xE4"[\xFD\xE5"k\xFD\r\0\x07"l\xFD\r\0\x07"m \x07 P\xFD\xE6"g  O\xFD\xE6"i\xFD\xE4"O  Q\xFD\xE6"P \v R\xFD\xE6"Q\xFD\xE4"R\xFD\xE4"b 	 T\xFD\xE6"T  S\xFD\xE6"S\xFD\xE4"d \r U\xFD\xE6"U  V\xFD\xE6"V\xFD\xE4"n\xFD\xE4"o\xFD\xE4"p T S\xFD\xE5 f\xFD\xE6 d\xFD\xE5"S V U\xFD\xE5"T\xFD\xE4"U P Q\xFD\xE5"P g i\xFD\xE5"g\xFD\xE5 _\xFD\xE6"Q g \`\xFD\xE6\xFD\xE4 b\xFD\xE5"g\xFD\xE4"V\xFD\r\0\x07"q T S\xFD\xE5"S O R\xFD\xE5 f\xFD\xE6 g\xFD\xE5"i\xFD\xE4"O n d\xFD\xE5"R P h\xFD\xE6 Q\xFD\xE5 i\xFD\xE4"P\xFD\xE5"d\xFD\r\0\x07"Q\xFD\r\0\x07"T\xFD\xE4"n ] Z\xFD\r\b	
\v\x1B\f\r"Z j k\xFD\r\b	
\v\x1B\f\r"j\xFD\r\0\x07"] p V\xFD\r\b	
\v\x1B\f\r"V O d\xFD\r\b	
\v\x1B\f\r"O\xFD\r\0\x07"k\xFD\xE4"d\xFD\xE4"p ^ l\xFD\r\b	
\v\f\r\x1B"^ V O\xFD\r\b	
\v\f\r\x1B"O\xFD\xE4"V q Q\xFD\r\b	
\v\f\r\x1B"Q Z j\xFD\r\b	
\v\f\r\x1B"Z\xFD\xE4"l\xFD\xE4"j\xFD\xE4\xFD\xF9 -\xFD\xB7 X [\xFD\xE4"X W c\xFD\xE5"c\xFD\r\0\x07"W Y a\xFD\xE5"a \\ e\xFD\xE5"e\xFD\r\0\x07"Y\xFD\r\0\x07"[ R P\xFD\xE4"P S i\xFD\xE5"i\xFD\r\0\x07"R U g\xFD\xE5"g o b\xFD\xE5"b\xFD\r\0\x07"S\xFD\r\0\x07"U\xFD\xE4"\\ X c\xFD\r\b	
\v\x1B\f\r"c a e\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"X P i\xFD\r\b	
\v\x1B\f\r"i g b\xFD\r\b	
\v\x1B\f\r"b\xFD\r\0\x07"g\xFD\xE4"e\xFD\xE4"P W Y\xFD\r\b	
\v\f\r\x1B"W i b\xFD\r\b	
\v\f\r\x1B"i\xFD\xE4"Y R S\xFD\r\b	
\v\f\r\x1B"R c a\xFD\r\b	
\v\f\r\x1B"c\xFD\xE4"S\xFD\xE4"b\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r m T\xFD\xE5"T ] k\xFD\xE5 f\xFD\xE6 d\xFD\xE5"]\xFD\xE4"k Q Z\xFD\xE5"Q ^ O\xFD\xE5"a\xFD\xE5 _\xFD\xE6"O a \`\xFD\xE6\xFD\xE4 j\xFD\xE5"a\xFD\xE4\xFD\xF9 -\xFD\xB7 [ U\xFD\xE5"U X g\xFD\xE5 f\xFD\xE6 e\xFD\xE5"X\xFD\xE4"Z R c\xFD\xE5"R W i\xFD\xE5"c\xFD\xE5 _\xFD\xE6"W c \`\xFD\xE6\xFD\xE4 b\xFD\xE5"c\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"g\xFD[\0\0\0 * j g\xFD[\0\0 ) j T ]\xFD\xE5"T V l\xFD\xE5 f\xFD\xE6 a\xFD\xE5"g\xFD\xE4\xFD\xF9 -\xFD\xB7 U X\xFD\xE5"U Y S\xFD\xE5 f\xFD\xE6 c\xFD\xE5"i\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r n d\xFD\xE5"d Q h\xFD\xE6 O\xFD\xE5 g\xFD\xE4"O\xFD\xE5\xFD\xF9 -\xFD\xB7 \\ e\xFD\xE5"e R h\xFD\xE6 W\xFD\xE5 i\xFD\xE4"Q\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"R\xFD[\0\0\0 ( j R\xFD[\0\0 ' j d O\xFD\xE4\xFD\xF9 -\xFD\xB7 e Q\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r T g\xFD\xE5\xFD\xF9 -\xFD\xB7 U i\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"e\xFD[\0\0\0 & j e\xFD[\0\0 % j k a\xFD\xE5\xFD\xF9 -\xFD\xB7 Z c\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r p j\xFD\xE5\xFD\xF9 -\xFD\xB7 P b\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"e\xFD[\0\0\0 $ j e\xFD[\0\0 \x1B   \x1B"j  H\xFD\xE6"a  G\xFD\xE6"c\xFD\xE4"d  I\xFD\xE6"g 
 J\xFD\xE6"i\xFD\xE4"j\xFD\xE4"e \b L\xFD\xE6"G  K\xFD\xE6"H\xFD\xE4"b \f M\xFD\xE6"I  N\xFD\xE6"J . J\xFD\0\x92\xFD \0"J\xFD\xE4"K\xFD\xE4"L\xFD\xE4"M G H\xFD\xE5 f\xFD\xE6 b\xFD\xE5"G J I\xFD\xE5"H\xFD\xE4"I g i\xFD\xE5"g a c\xFD\xE5"a\xFD\xE5 _\xFD\xE6"i a \`\xFD\xE6\xFD\xE4 e\xFD\xE5"a\xFD\xE4"J\xFD\r\0\x07"N H G\xFD\xE5"G d j\xFD\xE5 f\xFD\xE6 a\xFD\xE5"c\xFD\xE4"j K b\xFD\xE5"H g h\xFD\xE6 i\xFD\xE5 c\xFD\xE4"K\xFD\xE5"O\xFD\r\0\x07"P\xFD\r\0\x07"Q \x07 @\xFD\xE6"g  ?\xFD\xE6"i\xFD\xE4"?  A\xFD\xE6"@ \v B\xFD\xE6"A\xFD\xE4"B\xFD\xE4"b 	 D\xFD\xE6"D  C\xFD\xE6"C\xFD\xE4"d \r E\xFD\xE6"E  F\xFD\xE6"F\xFD\xE4"R\xFD\xE4"S\xFD\xE4"T D C\xFD\xE5 f\xFD\xE6 d\xFD\xE5"C F E\xFD\xE5"D\xFD\xE4"E @ A\xFD\xE5"@ g i\xFD\xE5"g\xFD\xE5 _\xFD\xE6"A g \`\xFD\xE6\xFD\xE4 b\xFD\xE5"g\xFD\xE4"F\xFD\r\0\x07"U D C\xFD\xE5"C ? B\xFD\xE5 f\xFD\xE6 g\xFD\xE5"i\xFD\xE4"? R d\xFD\xE5"B @ h\xFD\xE6 A\xFD\xE5 i\xFD\xE4"@\xFD\xE5"d\xFD\r\0\x07"A\xFD\r\0\x07"D\xFD\xE4"R M J\xFD\r\b	
\v\x1B\f\r"J j O\xFD\r\b	
\v\x1B\f\r"j\xFD\r\0\x07"M T F\xFD\r\b	
\v\x1B\f\r"F ? d\xFD\r\b	
\v\x1B\f\r"?\xFD\r\0\x07"O\xFD\xE4"d\xFD\xE4"T N P\xFD\r\b	
\v\f\r\x1B"N F ?\xFD\r\b	
\v\f\r\x1B"?\xFD\xE4"F U A\xFD\r\b	
\v\f\r\x1B"A J j\xFD\r\b	
\v\f\r\x1B"J\xFD\xE4"P\xFD\xE4"j\xFD\xE4\xFD\xF9 -\xFD\xB7 H K\xFD\xE4"H G c\xFD\xE5"c\xFD\r\0\x07"G I a\xFD\xE5"a L e\xFD\xE5"e\xFD\r\0\x07"I\xFD\r\0\x07"K B @\xFD\xE4"@ C i\xFD\xE5"i\xFD\r\0\x07"B E g\xFD\xE5"g S b\xFD\xE5"b\xFD\r\0\x07"C\xFD\r\0\x07"E\xFD\xE4"L H c\xFD\r\b	
\v\x1B\f\r"c a e\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"H @ i\xFD\r\b	
\v\x1B\f\r"i g b\xFD\r\b	
\v\x1B\f\r"b\xFD\r\0\x07"g\xFD\xE4"e\xFD\xE4"@ G I\xFD\r\b	
\v\f\r\x1B"G i b\xFD\r\b	
\v\f\r\x1B"i\xFD\xE4"I B C\xFD\r\b	
\v\f\r\x1B"B c a\xFD\r\b	
\v\f\r\x1B"c\xFD\xE4"C\xFD\xE4"b\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r Q D\xFD\xE5"D M O\xFD\xE5 f\xFD\xE6 d\xFD\xE5"M\xFD\xE4"O A J\xFD\xE5"A N ?\xFD\xE5"a\xFD\xE5 _\xFD\xE6"? a \`\xFD\xE6\xFD\xE4 j\xFD\xE5"a\xFD\xE4\xFD\xF9 -\xFD\xB7 K E\xFD\xE5"E H g\xFD\xE5 f\xFD\xE6 e\xFD\xE5"H\xFD\xE4"J B c\xFD\xE5"B G i\xFD\xE5"c\xFD\xE5 _\xFD\xE6"G c \`\xFD\xE6\xFD\xE4 b\xFD\xE5"c\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"g\xFD[\0\0\0 # j g\xFD[\0\0 " j D M\xFD\xE5"D F P\xFD\xE5 f\xFD\xE6 a\xFD\xE5"g\xFD\xE4\xFD\xF9 -\xFD\xB7 E H\xFD\xE5"E I C\xFD\xE5 f\xFD\xE6 c\xFD\xE5"i\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r R d\xFD\xE5"d A h\xFD\xE6 ?\xFD\xE5 g\xFD\xE4"?\xFD\xE5\xFD\xF9 -\xFD\xB7 L e\xFD\xE5"e B h\xFD\xE6 G\xFD\xE5 i\xFD\xE4"A\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"B\xFD[\0\0\0 ! j B\xFD[\0\0   j d ?\xFD\xE4\xFD\xF9 -\xFD\xB7 e A\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r D g\xFD\xE5\xFD\xF9 -\xFD\xB7 E i\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"e\xFD[\0\0\0  j e\xFD[\0\0  j O a\xFD\xE5\xFD\xF9 -\xFD\xB7 J c\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r T j\xFD\xE5\xFD\xF9 -\xFD\xB7 @ b\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"e\xFD[\0\0\0  j e\xFD[\0\0  ,j"  8\xFD\xE6"a  7\xFD\xE6"c\xFD\xE4"d  9\xFD\xE6"g 
 :\xFD\xE6"i\xFD\xE4"j\xFD\xE4"e \b <\xFD\xE6"7  ;\xFD\xE6"8\xFD\xE4"b \f =\xFD\xE6"9  >\xFD\xE6": . :\xFD\0\x92\xFD \0":\xFD\xE4";\xFD\xE4"<\xFD\xE4"= 7 8\xFD\xE5 f\xFD\xE6 b\xFD\xE5"7 : 9\xFD\xE5"8\xFD\xE4"9 g i\xFD\xE5"g a c\xFD\xE5"a\xFD\xE5 _\xFD\xE6"i a \`\xFD\xE6\xFD\xE4 e\xFD\xE5"a\xFD\xE4":\xFD\r\0\x07"> 8 7\xFD\xE5"7 d j\xFD\xE5 f\xFD\xE6 a\xFD\xE5"c\xFD\xE4"j ; b\xFD\xE5"8 g h\xFD\xE6 i\xFD\xE5 c\xFD\xE4";\xFD\xE5"?\xFD\r\0\x07"@\xFD\r\0\x07"A \x07 0\xFD\xE6"g  /\xFD\xE6"i\xFD\xE4"/  1\xFD\xE6"0 \v 2\xFD\xE6"1\xFD\xE4"2\xFD\xE4"b 	 4\xFD\xE6"4  3\xFD\xE6"3\xFD\xE4"d \r 5\xFD\xE6"5  6\xFD\xE6"6\xFD\xE4"B\xFD\xE4"C\xFD\xE4"D 4 3\xFD\xE5 f\xFD\xE6 d\xFD\xE5"3 6 5\xFD\xE5"4\xFD\xE4"5 0 1\xFD\xE5"0 g i\xFD\xE5"g\xFD\xE5 _\xFD\xE6"1 g \`\xFD\xE6\xFD\xE4 b\xFD\xE5"g\xFD\xE4"6\xFD\r\0\x07"E 4 3\xFD\xE5"3 / 2\xFD\xE5 f\xFD\xE6 g\xFD\xE5"i\xFD\xE4"/ B d\xFD\xE5"2 0 h\xFD\xE6 1\xFD\xE5 i\xFD\xE4"0\xFD\xE5"d\xFD\r\0\x07"1\xFD\r\0\x07"4\xFD\xE4"B = :\xFD\r\b	
\v\x1B\f\r": j ?\xFD\r\b	
\v\x1B\f\r"j\xFD\r\0\x07"= D 6\xFD\r\b	
\v\x1B\f\r"6 / d\xFD\r\b	
\v\x1B\f\r"/\xFD\r\0\x07"?\xFD\xE4"d\xFD\xE4"D > @\xFD\r\b	
\v\f\r\x1B"> 6 /\xFD\r\b	
\v\f\r\x1B"/\xFD\xE4"6 E 1\xFD\r\b	
\v\f\r\x1B"1 : j\xFD\r\b	
\v\f\r\x1B":\xFD\xE4"@\xFD\xE4"j\xFD\xE4\xFD\xF9 -\xFD\xB7 8 ;\xFD\xE4"8 7 c\xFD\xE5"c\xFD\r\0\x07"7 9 a\xFD\xE5"a < e\xFD\xE5"e\xFD\r\0\x07"9\xFD\r\0\x07"; 2 0\xFD\xE4"0 3 i\xFD\xE5"i\xFD\r\0\x07"2 5 g\xFD\xE5"g C b\xFD\xE5"b\xFD\r\0\x07"3\xFD\r\0\x07"5\xFD\xE4"< 8 c\xFD\r\b	
\v\x1B\f\r"c a e\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"8 0 i\xFD\r\b	
\v\x1B\f\r"i g b\xFD\r\b	
\v\x1B\f\r"b\xFD\r\0\x07"g\xFD\xE4"e\xFD\xE4"0 7 9\xFD\r\b	
\v\f\r\x1B"7 i b\xFD\r\b	
\v\f\r\x1B"i\xFD\xE4"9 2 3\xFD\r\b	
\v\f\r\x1B"2 c a\xFD\r\b	
\v\f\r\x1B"c\xFD\xE4"3\xFD\xE4"b\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r A 4\xFD\xE5"4 = ?\xFD\xE5 f\xFD\xE6 d\xFD\xE5"=\xFD\xE4"? 1 :\xFD\xE5"1 > /\xFD\xE5"a\xFD\xE5 _\xFD\xE6"/ a \`\xFD\xE6\xFD\xE4 j\xFD\xE5"a\xFD\xE4\xFD\xF9 -\xFD\xB7 ; 5\xFD\xE5"5 8 g\xFD\xE5 f\xFD\xE6 e\xFD\xE5"g\xFD\xE4"8 2 c\xFD\xE5"c 7 i\xFD\xE5"i\xFD\xE5 _\xFD\xE6"2 i \`\xFD\xE6\xFD\xE4 b\xFD\xE5"_\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"\`\xFD[\0\0\0  j" \`\xFD[\0\0  j" 4 =\xFD\xE5"i 6 @\xFD\xE5 f\xFD\xE6 a\xFD\xE5"\`\xFD\xE4\xFD\xF9 -\xFD\xB7 5 g\xFD\xE5"g 9 3\xFD\xE5 f\xFD\xE6 _\xFD\xE5"f\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r B d\xFD\xE5"d 1 h\xFD\xE6 /\xFD\xE5 \`\xFD\xE4"/\xFD\xE5\xFD\xF9 -\xFD\xB7 < e\xFD\xE5"e c h\xFD\xE6 2\xFD\xE5 f\xFD\xE4"h\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"c\xFD[\0\0\0  j" c\xFD[\0\0  j" d /\xFD\xE4\xFD\xF9 -\xFD\xB7 e h\xFD\xE4\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r i \`\xFD\xE5\xFD\xF9 -\xFD\xB7 g f\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"f\xFD[\0\0\0  j" f\xFD[\0\0  j" ? a\xFD\xE5\xFD\xF9 -\xFD\xB7 8 _\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r D j\xFD\xE5\xFD\xF9 -\xFD\xB7 0 b\xFD\xE5\xFD\xF9 -\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"f\xFD[\0\0\0  j f\xFD[\0\0 Aj! A\x80\bj! Aj!\f\0\v\v\v\xE0E\x7F{}S{ A \x1B" \0("(\b t" (" A\bj" Aq"\x1B"lAtj!\x1B     \x1B"lAtj!   lAt (\0"Atjj!   A\x07jlAtj!   AjlAtj!   AjlAtj!   AjlAtj!    AjlAtj!!   AjlAtj!"   AjlAtj!#   A\x07jlAtj!$   AjlAtj!%   AjlAtj!&   AjlAtj!'   AjlAtj!(   AjlAtj!)   AjlAtj!* At"Aj!+A\x7F / tA\x7FsA\xFF\xFFq\xFD!, \0(\0*\x9C!-A\0!@@  O\r A\xF0\x07j\xFD\0\0!. A\xB0j\xFD\0\0!/ A\xB0\x07j\xFD\0\0!0 A\xF0j\xFD\0\0!1 A\xD0\x07j\xFD\0\0!2 A\xD0j\xFD\0\0!3 A\x90\x07j\xFD\0\0!4 A\x90j\xFD\0\0!5 A\xE0\x07j\xFD\0\0!6 A\xA0j\xFD\0\0!7 A\xA0\x07j\xFD\0\0!8 A\xE0j\xFD\0\0!9 A\xC0\x07j\xFD\0\0!: A\xC0j\xFD\0\0!; A\x80\x07j\xFD\0\0!< A\x80j\xFD\0\0!= A\xF0j\xFD\0\0!> A\xB0j\xFD\0\0!? A\xB0j\xFD\0\0!@ A\xF0j\xFD\0\0!A A\xD0j\xFD\0\0!B A\xD0j\xFD\0\0!C A\x90j\xFD\0\0!D A\x90j\xFD\0\0!E A\xE0j\xFD\0\0!F A\xA0j\xFD\0\0!G A\xA0j\xFD\0\0!H A\xE0j\xFD\0\0!I A\xC0j\xFD\0\0!J A\xC0j\xFD\0\0!K A\x80j\xFD\0\0!L A\x80j\xFD\0\0!M A\xF0j\xFD\0\0!N A\xB0j\xFD\0\0!O A\xB0j\xFD\0\0!P A\xF0j\xFD\0\0!Q A\xD0j\xFD\0\0!R A\xD0j\xFD\0\0!S A\x90j\xFD\0\0!T A\x90j\xFD\0\0!U A\xE0j\xFD\0\0!V A\xA0j\xFD\0\0!W A\xA0j\xFD\0\0!X A\xE0j\xFD\0\0!Y A\xC0j\xFD\0\0!Z A\xC0j\xFD\0\0![ A\x80j\xFD\0\0!\\ A\x80j\xFD\0\0!]   \xFD\0 \xFD\xE6"^  \xFD\0\xE0\xFD\xE6"_\xFD\xE4"\`  \xFD\0\xA0\xFD\xE6"a 
 \xFD\0\`\xFD\xE6"b\xFD\xE4"c\xFD\xE4"d \b \xFD\0@\xFD\xE6"e  \xFD\0\xC0\xFD\xE6"f\xFD\xE4"g \f \xFD\0\x80\xFD\xE6"h  \xFD\0\0\xFD\xE6"i - i\xFD\0\x92\xFD \0"i\xFD\xE4"j\xFD\xE4"k\xFD\xE4"l e f\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"e\xFD\xE6 g\xFD\xE5"f i h\xFD\xE5"h\xFD\xE4"m a b\xFD\xE5"b ^ _\xFD\xE5"a\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"^\xFD\xE6"i a\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"_\xFD\xE6\xFD\xE4 d\xFD\xE5"a\xFD\xE4"n\xFD\r\0\x07"o h f\xFD\xE5"p \` c\xFD\xE5 e\xFD\xE6 a\xFD\xE5"\`\xFD\xE4"q j g\xFD\xE5"j b\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"g\xFD\xE6 i\xFD\xE5 \`\xFD\xE4"r\xFD\xE5"i\xFD\r\0\x07"s\xFD\r\0\x07"t \x07 \xFD\00\xFD\xE6"f  \xFD\0\xF0\xFD\xE6"h\xFD\xE4"u  \xFD\0\xB0\xFD\xE6"v \v \xFD\0p\xFD\xE6"w\xFD\xE4"x\xFD\xE4"b 	 \xFD\0P\xFD\xE6"y  \xFD\0\xD0\xFD\xE6"z\xFD\xE4"c \r \xFD\0\x90\xFD\xE6"{  \xFD\0\xFD\xE6"|\xFD\xE4"}\xFD\xE4"~\xFD\xE4"\x7F y z\xFD\xE5 e\xFD\xE6 c\xFD\xE5"y | {\xFD\xE5"z\xFD\xE4"{ v w\xFD\xE5"v f h\xFD\xE5"f\xFD\xE5 ^\xFD\xE6"w f _\xFD\xE6\xFD\xE4 b\xFD\xE5"f\xFD\xE4"|\xFD\r\0\x07"\x80 z y\xFD\xE5"y u x\xFD\xE5 e\xFD\xE6 f\xFD\xE5"h\xFD\xE4"u } c\xFD\xE5"x v g\xFD\xE6 w\xFD\xE5 h\xFD\xE4"v\xFD\xE5"c\xFD\r\0\x07"w\xFD\r\0\x07"z\xFD\xE4"} l n\xFD\r\b	
\v\x1B\f\r"l q i\xFD\r\b	
\v\x1B\f\r"i\xFD\r\0\x07"n \x7F |\xFD\r\b	
\v\x1B\f\r"q u c\xFD\r\b	
\v\x1B\f\r"u\xFD\r\0\x07"|\xFD\xE4"c\xFD\xE4"\x7F o s\xFD\r\b	
\v\f\r\x1B"o q u\xFD\r\b	
\v\f\r\x1B"q\xFD\xE4"s \x80 w\xFD\r\b	
\v\f\r\x1B"u l i\xFD\r\b	
\v\f\r\x1B"l\xFD\xE4"w\xFD\xE4"i\xFD\xE4\xFD\xF9 ,\xFD\xB7 j r\xFD\xE4"j p \`\xFD\xE5"\`\xFD\r\0\x07"p m a\xFD\xE5"a k d\xFD\xE5"d\xFD\r\0\x07"k\xFD\r\0\x07"m x v\xFD\xE4"r y h\xFD\xE5"h\xFD\r\0\x07"v { f\xFD\xE5"f ~ b\xFD\xE5"b\xFD\r\0\x07"x\xFD\r\0\x07"y\xFD\xE4"{ j \`\xFD\r\b	
\v\x1B\f\r"\` a d\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"j r h\xFD\r\b	
\v\x1B\f\r"h f b\xFD\r\b	
\v\x1B\f\r"b\xFD\r\0\x07"f\xFD\xE4"d\xFD\xE4"r p k\xFD\r\b	
\v\f\r\x1B"k h b\xFD\r\b	
\v\f\r\x1B"b\xFD\xE4"h v x\xFD\r\b	
\v\f\r\x1B"p \` a\xFD\r\b	
\v\f\r\x1B"v\xFD\xE4"x\xFD\xE4"a\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" t z\xFD\xE5"t n |\xFD\xE5 e\xFD\xE6 c\xFD\xE5"n\xFD\xE4"z u l\xFD\xE5"l o q\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6"o \` _\xFD\xE6\xFD\xE4 i\xFD\xE5"\`\xFD\xE4\xFD\xF9 ,\xFD\xB7 m y\xFD\xE5"m j f\xFD\xE5 e\xFD\xE6 d\xFD\xE5"j\xFD\xE4"q p v\xFD\xE5"p k b\xFD\xE5"b\xFD\xE5 ^\xFD\xE6"k b _\xFD\xE6\xFD\xE4 a\xFD\xE5"b\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" t n\xFD\xE5"n s w\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"f\xFD\xE4\xFD\xF9 ,\xFD\xB7 m j\xFD\xE5"j h x\xFD\xE5 e\xFD\xE6 b\xFD\xE5"h\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" } c\xFD\xE5"c l g\xFD\xE6 o\xFD\xE5 f\xFD\xE4"l\xFD\xE5\xFD\xF9 ,\xFD\xB7 { d\xFD\xE5"d p g\xFD\xE6 k\xFD\xE5 h\xFD\xE4"k\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" c l\xFD\xE4\xFD\xF9 ,\xFD\xB7 d k\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" n f\xFD\xE5\xFD\xF9 ,\xFD\xB7 j h\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" z \`\xFD\xE5\xFD\xF9 ,\xFD\xB7 q b\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" \x7F i\xFD\xE5\xFD\xF9 ,\xFD\xB7 r a\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0   A\bj"\0 \x1BAt"j  W\xFD\xE6"\`  V\xFD\xE6"b\xFD\xE4"c  X\xFD\xE6"f 
 Y\xFD\xE6"h\xFD\xE4"i\xFD\xE4"d \b [\xFD\xE6"V  Z\xFD\xE6"W\xFD\xE4"a \f \\\xFD\xE6"X  ]\xFD\xE6"Y - Y\xFD\0\x92\xFD \0"Y\xFD\xE4"Z\xFD\xE4"[\xFD\xE4"\\ V W\xFD\xE5 e\xFD\xE6 a\xFD\xE5"V Y X\xFD\xE5"W\xFD\xE4"X f h\xFD\xE5"f \` b\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6"h \` _\xFD\xE6\xFD\xE4 d\xFD\xE5"\`\xFD\xE4"Y\xFD\r\0\x07"] W V\xFD\xE5"V c i\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"b\xFD\xE4"i Z a\xFD\xE5"W f g\xFD\xE6 h\xFD\xE5 b\xFD\xE4"Z\xFD\xE5"j\xFD\r\0\x07"k\xFD\r\0\x07"l \x07 O\xFD\xE6"f  N\xFD\xE6"h\xFD\xE4"N  P\xFD\xE6"O \v Q\xFD\xE6"P\xFD\xE4"Q\xFD\xE4"a 	 S\xFD\xE6"S  R\xFD\xE6"R\xFD\xE4"c \r T\xFD\xE6"T  U\xFD\xE6"U\xFD\xE4"m\xFD\xE4"n\xFD\xE4"o S R\xFD\xE5 e\xFD\xE6 c\xFD\xE5"R U T\xFD\xE5"S\xFD\xE4"T O P\xFD\xE5"O f h\xFD\xE5"f\xFD\xE5 ^\xFD\xE6"P f _\xFD\xE6\xFD\xE4 a\xFD\xE5"f\xFD\xE4"U\xFD\r\0\x07"p S R\xFD\xE5"R N Q\xFD\xE5 e\xFD\xE6 f\xFD\xE5"h\xFD\xE4"N m c\xFD\xE5"Q O g\xFD\xE6 P\xFD\xE5 h\xFD\xE4"O\xFD\xE5"c\xFD\r\0\x07"P\xFD\r\0\x07"S\xFD\xE4"m \\ Y\xFD\r\b	
\v\x1B\f\r"Y i j\xFD\r\b	
\v\x1B\f\r"i\xFD\r\0\x07"\\ o U\xFD\r\b	
\v\x1B\f\r"U N c\xFD\r\b	
\v\x1B\f\r"N\xFD\r\0\x07"j\xFD\xE4"c\xFD\xE4"o ] k\xFD\r\b	
\v\f\r\x1B"] U N\xFD\r\b	
\v\f\r\x1B"N\xFD\xE4"U p P\xFD\r\b	
\v\f\r\x1B"P Y i\xFD\r\b	
\v\f\r\x1B"Y\xFD\xE4"k\xFD\xE4"i\xFD\xE4\xFD\xF9 ,\xFD\xB7 W Z\xFD\xE4"W V b\xFD\xE5"b\xFD\r\0\x07"V X \`\xFD\xE5"\` [ d\xFD\xE5"d\xFD\r\0\x07"X\xFD\r\0\x07"Z Q O\xFD\xE4"O R h\xFD\xE5"h\xFD\r\0\x07"Q T f\xFD\xE5"f n a\xFD\xE5"a\xFD\r\0\x07"R\xFD\r\0\x07"T\xFD\xE4"[ W b\xFD\r\b	
\v\x1B\f\r"b \` d\xFD\r\b	
\v\x1B\f\r"\`\xFD\r\0\x07"W O h\xFD\r\b	
\v\x1B\f\r"h f a\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"f\xFD\xE4"d\xFD\xE4"O V X\xFD\r\b	
\v\f\r\x1B"V h a\xFD\r\b	
\v\f\r\x1B"h\xFD\xE4"X Q R\xFD\r\b	
\v\f\r\x1B"Q b \`\xFD\r\b	
\v\f\r\x1B"b\xFD\xE4"R\xFD\xE4"a\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 * j l S\xFD\xE5"S \\ j\xFD\xE5 e\xFD\xE6 c\xFD\xE5"\\\xFD\xE4"j P Y\xFD\xE5"P ] N\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6"N \` _\xFD\xE6\xFD\xE4 i\xFD\xE5"\`\xFD\xE4\xFD\xF9 ,\xFD\xB7 Z T\xFD\xE5"T W f\xFD\xE5 e\xFD\xE6 d\xFD\xE5"W\xFD\xE4"Y Q b\xFD\xE5"Q V h\xFD\xE5"b\xFD\xE5 ^\xFD\xE6"V b _\xFD\xE6\xFD\xE4 a\xFD\xE5"b\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 ) j S \\\xFD\xE5"S U k\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"f\xFD\xE4\xFD\xF9 ,\xFD\xB7 T W\xFD\xE5"T X R\xFD\xE5 e\xFD\xE6 b\xFD\xE5"h\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 ( j m c\xFD\xE5"c P g\xFD\xE6 N\xFD\xE5 f\xFD\xE4"N\xFD\xE5\xFD\xF9 ,\xFD\xB7 [ d\xFD\xE5"d Q g\xFD\xE6 V\xFD\xE5 h\xFD\xE4"P\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 ' j c N\xFD\xE4\xFD\xF9 ,\xFD\xB7 d P\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 & j S f\xFD\xE5\xFD\xF9 ,\xFD\xB7 T h\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 % j j \`\xFD\xE5\xFD\xF9 ,\xFD\xB7 Y b\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 $ j o i\xFD\xE5\xFD\xF9 ,\xFD\xB7 O a\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 \x1B \0  \x1BAt"j  G\xFD\xE6"\`  F\xFD\xE6"b\xFD\xE4"c  H\xFD\xE6"f 
 I\xFD\xE6"h\xFD\xE4"i\xFD\xE4"d \b K\xFD\xE6"F  J\xFD\xE6"G\xFD\xE4"a \f L\xFD\xE6"H  M\xFD\xE6"I - I\xFD\0\x92\xFD \0"I\xFD\xE4"J\xFD\xE4"K\xFD\xE4"L F G\xFD\xE5 e\xFD\xE6 a\xFD\xE5"F I H\xFD\xE5"G\xFD\xE4"H f h\xFD\xE5"f \` b\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6"h \` _\xFD\xE6\xFD\xE4 d\xFD\xE5"\`\xFD\xE4"I\xFD\r\0\x07"M G F\xFD\xE5"F c i\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"b\xFD\xE4"i J a\xFD\xE5"G f g\xFD\xE6 h\xFD\xE5 b\xFD\xE4"J\xFD\xE5"N\xFD\r\0\x07"O\xFD\r\0\x07"P \x07 ?\xFD\xE6"f  >\xFD\xE6"h\xFD\xE4">  @\xFD\xE6"? \v A\xFD\xE6"@\xFD\xE4"A\xFD\xE4"a 	 C\xFD\xE6"C  B\xFD\xE6"B\xFD\xE4"c \r D\xFD\xE6"D  E\xFD\xE6"E\xFD\xE4"Q\xFD\xE4"R\xFD\xE4"S C B\xFD\xE5 e\xFD\xE6 c\xFD\xE5"B E D\xFD\xE5"C\xFD\xE4"D ? @\xFD\xE5"? f h\xFD\xE5"f\xFD\xE5 ^\xFD\xE6"@ f _\xFD\xE6\xFD\xE4 a\xFD\xE5"f\xFD\xE4"E\xFD\r\0\x07"T C B\xFD\xE5"B > A\xFD\xE5 e\xFD\xE6 f\xFD\xE5"h\xFD\xE4"> Q c\xFD\xE5"A ? g\xFD\xE6 @\xFD\xE5 h\xFD\xE4"?\xFD\xE5"c\xFD\r\0\x07"@\xFD\r\0\x07"C\xFD\xE4"Q L I\xFD\r\b	
\v\x1B\f\r"I i N\xFD\r\b	
\v\x1B\f\r"i\xFD\r\0\x07"L S E\xFD\r\b	
\v\x1B\f\r"E > c\xFD\r\b	
\v\x1B\f\r">\xFD\r\0\x07"N\xFD\xE4"c\xFD\xE4"S M O\xFD\r\b	
\v\f\r\x1B"M E >\xFD\r\b	
\v\f\r\x1B">\xFD\xE4"E T @\xFD\r\b	
\v\f\r\x1B"@ I i\xFD\r\b	
\v\f\r\x1B"I\xFD\xE4"O\xFD\xE4"i\xFD\xE4\xFD\xF9 ,\xFD\xB7 G J\xFD\xE4"G F b\xFD\xE5"b\xFD\r\0\x07"F H \`\xFD\xE5"\` K d\xFD\xE5"d\xFD\r\0\x07"H\xFD\r\0\x07"J A ?\xFD\xE4"? B h\xFD\xE5"h\xFD\r\0\x07"A D f\xFD\xE5"f R a\xFD\xE5"a\xFD\r\0\x07"B\xFD\r\0\x07"D\xFD\xE4"K G b\xFD\r\b	
\v\x1B\f\r"b \` d\xFD\r\b	
\v\x1B\f\r"\`\xFD\r\0\x07"G ? h\xFD\r\b	
\v\x1B\f\r"h f a\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"f\xFD\xE4"d\xFD\xE4"? F H\xFD\r\b	
\v\f\r\x1B"F h a\xFD\r\b	
\v\f\r\x1B"h\xFD\xE4"H A B\xFD\r\b	
\v\f\r\x1B"A b \`\xFD\r\b	
\v\f\r\x1B"b\xFD\xE4"B\xFD\xE4"a\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 # j P C\xFD\xE5"C L N\xFD\xE5 e\xFD\xE6 c\xFD\xE5"L\xFD\xE4"N @ I\xFD\xE5"@ M >\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6"> \` _\xFD\xE6\xFD\xE4 i\xFD\xE5"\`\xFD\xE4\xFD\xF9 ,\xFD\xB7 J D\xFD\xE5"D G f\xFD\xE5 e\xFD\xE6 d\xFD\xE5"G\xFD\xE4"I A b\xFD\xE5"A F h\xFD\xE5"b\xFD\xE5 ^\xFD\xE6"F b _\xFD\xE6\xFD\xE4 a\xFD\xE5"b\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 " j C L\xFD\xE5"C E O\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"f\xFD\xE4\xFD\xF9 ,\xFD\xB7 D G\xFD\xE5"D H B\xFD\xE5 e\xFD\xE6 b\xFD\xE5"h\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 ! j Q c\xFD\xE5"c @ g\xFD\xE6 >\xFD\xE5 f\xFD\xE4">\xFD\xE5\xFD\xF9 ,\xFD\xB7 K d\xFD\xE5"d A g\xFD\xE6 F\xFD\xE5 h\xFD\xE4"@\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0   j c >\xFD\xE4\xFD\xF9 ,\xFD\xB7 d @\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j C f\xFD\xE5\xFD\xF9 ,\xFD\xB7 D h\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j N \`\xFD\xE5\xFD\xF9 ,\xFD\xB7 I b\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j S i\xFD\xE5\xFD\xF9 ,\xFD\xB7 ? a\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  +j"  7\xFD\xE6"\`  6\xFD\xE6"b\xFD\xE4"c  8\xFD\xE6"f 
 9\xFD\xE6"h\xFD\xE4"i\xFD\xE4"d \b ;\xFD\xE6"6  :\xFD\xE6"7\xFD\xE4"a \f <\xFD\xE6"8  =\xFD\xE6"9 - 9\xFD\0\x92\xFD \0"9\xFD\xE4":\xFD\xE4";\xFD\xE4"< 6 7\xFD\xE5 e\xFD\xE6 a\xFD\xE5"6 9 8\xFD\xE5"7\xFD\xE4"8 f h\xFD\xE5"f \` b\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6"h \` _\xFD\xE6\xFD\xE4 d\xFD\xE5"\`\xFD\xE4"9\xFD\r\0\x07"= 7 6\xFD\xE5"6 c i\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"b\xFD\xE4"i : a\xFD\xE5"7 f g\xFD\xE6 h\xFD\xE5 b\xFD\xE4":\xFD\xE5">\xFD\r\0\x07"?\xFD\r\0\x07"@ \x07 /\xFD\xE6"f  .\xFD\xE6"h\xFD\xE4".  0\xFD\xE6"/ \v 1\xFD\xE6"0\xFD\xE4"1\xFD\xE4"a 	 3\xFD\xE6"3  2\xFD\xE6"2\xFD\xE4"c \r 4\xFD\xE6"4  5\xFD\xE6"5\xFD\xE4"A\xFD\xE4"B\xFD\xE4"C 3 2\xFD\xE5 e\xFD\xE6 c\xFD\xE5"2 5 4\xFD\xE5"3\xFD\xE4"4 / 0\xFD\xE5"/ f h\xFD\xE5"f\xFD\xE5 ^\xFD\xE6"0 f _\xFD\xE6\xFD\xE4 a\xFD\xE5"f\xFD\xE4"5\xFD\r\0\x07"D 3 2\xFD\xE5"2 . 1\xFD\xE5 e\xFD\xE6 f\xFD\xE5"h\xFD\xE4". A c\xFD\xE5"1 / g\xFD\xE6 0\xFD\xE5 h\xFD\xE4"/\xFD\xE5"c\xFD\r\0\x07"0\xFD\r\0\x07"3\xFD\xE4"A < 9\xFD\r\b	
\v\x1B\f\r"9 i >\xFD\r\b	
\v\x1B\f\r"i\xFD\r\0\x07"< C 5\xFD\r\b	
\v\x1B\f\r"5 . c\xFD\r\b	
\v\x1B\f\r".\xFD\r\0\x07">\xFD\xE4"c\xFD\xE4"C = ?\xFD\r\b	
\v\f\r\x1B"= 5 .\xFD\r\b	
\v\f\r\x1B".\xFD\xE4"5 D 0\xFD\r\b	
\v\f\r\x1B"0 9 i\xFD\r\b	
\v\f\r\x1B"9\xFD\xE4"?\xFD\xE4"i\xFD\xE4\xFD\xF9 ,\xFD\xB7 7 :\xFD\xE4"7 6 b\xFD\xE5"b\xFD\r\0\x07"6 8 \`\xFD\xE5"\` ; d\xFD\xE5"d\xFD\r\0\x07"8\xFD\r\0\x07": 1 /\xFD\xE4"/ 2 h\xFD\xE5"h\xFD\r\0\x07"1 4 f\xFD\xE5"f B a\xFD\xE5"a\xFD\r\0\x07"2\xFD\r\0\x07"4\xFD\xE4"; 7 b\xFD\r\b	
\v\x1B\f\r"b \` d\xFD\r\b	
\v\x1B\f\r"\`\xFD\r\0\x07"7 / h\xFD\r\b	
\v\x1B\f\r"h f a\xFD\r\b	
\v\x1B\f\r"a\xFD\r\0\x07"f\xFD\xE4"d\xFD\xE4"/ 6 8\xFD\r\b	
\v\f\r\x1B"6 h a\xFD\r\b	
\v\f\r\x1B"h\xFD\xE4"8 1 2\xFD\r\b	
\v\f\r\x1B"1 b \`\xFD\r\b	
\v\f\r\x1B"b\xFD\xE4"2\xFD\xE4"a\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" @ 3\xFD\xE5"3 < >\xFD\xE5 e\xFD\xE6 c\xFD\xE5"<\xFD\xE4"> 0 9\xFD\xE5"0 = .\xFD\xE5"\`\xFD\xE5 ^\xFD\xE6". \` _\xFD\xE6\xFD\xE4 i\xFD\xE5"\`\xFD\xE4\xFD\xF9 ,\xFD\xB7 : 4\xFD\xE5"4 7 f\xFD\xE5 e\xFD\xE6 d\xFD\xE5"f\xFD\xE4"7 1 b\xFD\xE5"b 6 h\xFD\xE5"h\xFD\xE5 ^\xFD\xE6"1 h _\xFD\xE6\xFD\xE4 a\xFD\xE5"^\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" 3 <\xFD\xE5"h 5 ?\xFD\xE5 e\xFD\xE6 \`\xFD\xE5"_\xFD\xE4\xFD\xF9 ,\xFD\xB7 4 f\xFD\xE5"f 8 2\xFD\xE5 e\xFD\xE6 ^\xFD\xE5"e\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" A c\xFD\xE5"c 0 g\xFD\xE6 .\xFD\xE5 _\xFD\xE4".\xFD\xE5\xFD\xF9 ,\xFD\xB7 ; d\xFD\xE5"d b g\xFD\xE6 1\xFD\xE5 e\xFD\xE4"g\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" c .\xFD\xE4\xFD\xF9 ,\xFD\xB7 d g\xFD\xE4\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" h _\xFD\xE5\xFD\xF9 ,\xFD\xB7 f e\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j" > \`\xFD\xE5\xFD\xF9 ,\xFD\xB7 7 ^\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0  j C i\xFD\xE5\xFD\xF9 ,\xFD\xB7 / a\xFD\xE5\xFD\xF9 ,\xFD\xB7\xFD\x86\xFD\v\0 Aj! A j! A\x80\bj! Aj!\f\0\v\v\v\xE3 \x07\x7F{}3{ A \x1B (\0Avj! \0("(\b tAv" (Av"A\x07jl!  Ajl!  Ajl!  Ajl!  Ajl!\x1B  Ajl!  Ajl!  l!A\x7F / tA\x7FsA\xFF\xFFq\xFD! \0(\0*\x9C!A\0!@@  O\r A\xF0j\xFD\0\0!  A\xB0j\xFD\0\0!! A\xB0j\xFD\0\0!" A\xF0j\xFD\0\0!# A\xD0j\xFD\0\0!$ A\xD0j\xFD\0\0!% A\x90j\xFD\0\0!& A\x90j\xFD\0\0!' A\xE0j\xFD\0\0!( A\xA0j\xFD\0\0!) A\xA0j\xFD\0\0!* A\xE0j\xFD\0\0!+ A\xC0j\xFD\0\0!, A\xC0j\xFD\0\0!- A\x80j\xFD\0\0!. A\x80j\xFD\0\0!/  j  \xFD\0 \xFD\xE6"0  \xFD\0\xE0\xFD\xE6"1\xFD\xE4"2  \xFD\0\xA0\xFD\xE6"3 
 \xFD\0\`\xFD\xE6"4\xFD\xE4"5\xFD\xE4"6 \b \xFD\0@\xFD\xE6"7  \xFD\0\xC0\xFD\xE6"8\xFD\xE4"9 \f \xFD\0\x80\xFD\xE6":  \xFD\0\0\xFD\xE6";  ;\xFD\0\x92\xFD \0";\xFD\xE4"<\xFD\xE4"=\xFD\xE4"> 7 8\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"7\xFD\xE6 9\xFD\xE5"8 ; :\xFD\xE5":\xFD\xE4"; 3 4\xFD\xE5"4 0 1\xFD\xE5"3\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"0\xFD\xE6"? 3\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"1\xFD\xE6\xFD\xE4 6\xFD\xE5"3\xFD\xE4"@\xFD\r\0\x07"A : 8\xFD\xE5"B 2 5\xFD\xE5 7\xFD\xE6 3\xFD\xE5"2\xFD\xE4"C < 9\xFD\xE5"< 4\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"9\xFD\xE6 ?\xFD\xE5 2\xFD\xE4"?\xFD\xE5"D\xFD\r\0\x07"E\xFD\r\0\x07"F \x07 \xFD\00\xFD\xE6"8  \xFD\0\xF0\xFD\xE6":\xFD\xE4"G  \xFD\0\xB0\xFD\xE6"H \v \xFD\0p\xFD\xE6"I\xFD\xE4"J\xFD\xE4"4 	 \xFD\0P\xFD\xE6"K  \xFD\0\xD0\xFD\xE6"L\xFD\xE4"5 \r \xFD\0\x90\xFD\xE6"M  \xFD\0\xFD\xE6"N\xFD\xE4"O\xFD\xE4"P\xFD\xE4"Q K L\xFD\xE5 7\xFD\xE6 5\xFD\xE5"K N M\xFD\xE5"L\xFD\xE4"M H I\xFD\xE5"H 8 :\xFD\xE5"8\xFD\xE5 0\xFD\xE6"I 8 1\xFD\xE6\xFD\xE4 4\xFD\xE5"8\xFD\xE4"N\xFD\r\0\x07"R L K\xFD\xE5"K G J\xFD\xE5 7\xFD\xE6 8\xFD\xE5":\xFD\xE4"G O 5\xFD\xE5"J H 9\xFD\xE6 I\xFD\xE5 :\xFD\xE4"H\xFD\xE5"5\xFD\r\0\x07"I\xFD\r\0\x07"L\xFD\xE4"O > @\xFD\r\b	
\v\x1B\f\r"> C D\xFD\r\b	
\v\x1B\f\r"@\xFD\r\0\x07"C Q N\xFD\r\b	
\v\x1B\f\r"D G 5\xFD\r\b	
\v\x1B\f\r"G\xFD\r\0\x07"N\xFD\xE4"5\xFD\xE4 A E\xFD\r\b	
\v\f\r\x1B"A D G\xFD\r\b	
\v\f\r\x1B"D\xFD\xE4"E R I\xFD\r\b	
\v\f\r\x1B"G > @\xFD\r\b	
\v\f\r\x1B">\xFD\xE4"@\xFD\xE4"I\xFD\xE4\xFD\xF9 \xFD\xB7 < ?\xFD\xE4"< B 2\xFD\xE5"2\xFD\r\0\x07"? ; 3\xFD\xE5"3 = 6\xFD\xE5"6\xFD\r\0\x07";\xFD\r\0\x07"= J H\xFD\xE4"B K :\xFD\xE5":\xFD\r\0\x07"H M 8\xFD\xE5"8 P 4\xFD\xE5"4\xFD\r\0\x07"J\xFD\r\0\x07"K\xFD\xE4"M < 2\xFD\r\b	
\v\x1B\f\r"2 3 6\xFD\r\b	
\v\x1B\f\r"3\xFD\r\0\x07"< B :\xFD\r\b	
\v\x1B\f\r": 8 4\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"8\xFD\xE4"6\xFD\xE4 ? ;\xFD\r\b	
\v\f\r\x1B"; : 4\xFD\r\b	
\v\f\r\x1B"4\xFD\xE4": H J\xFD\r\b	
\v\f\r\x1B"? 2 3\xFD\r\b	
\v\f\r\x1B"3\xFD\xE4"2\xFD\xE4"B\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  j F L\xFD\xE5"F C N\xFD\xE5 7\xFD\xE6 5\xFD\xE5"C\xFD\xE5 E @\xFD\xE5 7\xFD\xE6 G >\xFD\xE5"> A D\xFD\xE5"@\xFD\xE5 0\xFD\xE6"A @ 1\xFD\xE6\xFD\xE4 I\xFD\xE5"@\xFD\xE5"D\xFD\xE4\xFD\xF9 \xFD\xB7 = K\xFD\xE5"= < 8\xFD\xE5 7\xFD\xE6 6\xFD\xE5"8\xFD\xE5 : 2\xFD\xE5 7\xFD\xE6 ? 3\xFD\xE5"3 ; 4\xFD\xE5"2\xFD\xE5 0\xFD\xE6"4 2 1\xFD\xE6\xFD\xE4 B\xFD\xE5"2\xFD\xE5":\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  j O 5\xFD\xE5 > 9\xFD\xE6 A\xFD\xE5 D\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 M 6\xFD\xE5 3 9\xFD\xE6 4\xFD\xE5 :\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  \x1Bj F C\xFD\xE4 @\xFD\xE5\xFD\xF9 \xFD\xB7 = 8\xFD\xE4 2\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  j  )\xFD\xE6"2  (\xFD\xE6"4\xFD\xE4"5  *\xFD\xE6"8 
 +\xFD\xE6":\xFD\xE4"(\xFD\xE4"6 \b -\xFD\xE6")  ,\xFD\xE6"*\xFD\xE4"3 \f .\xFD\xE6"+  /\xFD\xE6",  ,\xFD\0\x92\xFD \0",\xFD\xE4"-\xFD\xE4".\xFD\xE4"/ ) *\xFD\xE5 7\xFD\xE6 3\xFD\xE5") , +\xFD\xE5"*\xFD\xE4"+ 8 :\xFD\xE5"8 2 4\xFD\xE5"2\xFD\xE5 0\xFD\xE6": 2 1\xFD\xE6\xFD\xE4 6\xFD\xE5"2\xFD\xE4",\xFD\r\0\x07"; * )\xFD\xE5") 5 (\xFD\xE5 7\xFD\xE6 2\xFD\xE5"4\xFD\xE4"( - 3\xFD\xE5"* 8 9\xFD\xE6 :\xFD\xE5 4\xFD\xE4"-\xFD\xE5"<\xFD\r\0\x07"=\xFD\r\0\x07"> \x07 !\xFD\xE6"8   \xFD\xE6":\xFD\xE4"   "\xFD\xE6"! \v #\xFD\xE6""\xFD\xE4"#\xFD\xE4"3 	 %\xFD\xE6"%  $\xFD\xE6"$\xFD\xE4"5 \r &\xFD\xE6"&  '\xFD\xE6"'\xFD\xE4"?\xFD\xE4"@\xFD\xE4"A % $\xFD\xE5 7\xFD\xE6 5\xFD\xE5"$ ' &\xFD\xE5"%\xFD\xE4"& ! "\xFD\xE5"! 8 :\xFD\xE5"8\xFD\xE5 0\xFD\xE6"" 8 1\xFD\xE6\xFD\xE4 3\xFD\xE5"8\xFD\xE4"'\xFD\r\0\x07"B % $\xFD\xE5"$   #\xFD\xE5 7\xFD\xE6 8\xFD\xE5":\xFD\xE4"  ? 5\xFD\xE5"# ! 9\xFD\xE6 "\xFD\xE5 :\xFD\xE4"!\xFD\xE5"5\xFD\r\0\x07""\xFD\r\0\x07"%\xFD\xE4"? / ,\xFD\r\b	
\v\x1B\f\r", ( <\xFD\r\b	
\v\x1B\f\r"(\xFD\r\0\x07"/ A '\xFD\r\b	
\v\x1B\f\r"'   5\xFD\r\b	
\v\x1B\f\r" \xFD\r\0\x07"<\xFD\xE4"5\xFD\xE4 ; =\xFD\r\b	
\v\f\r\x1B"; '  \xFD\r\b	
\v\f\r\x1B" \xFD\xE4"' B "\xFD\r\b	
\v\f\r\x1B"" , (\xFD\r\b	
\v\f\r\x1B"(\xFD\xE4",\xFD\xE4"=\xFD\xE4\xFD\xF9 \xFD\xB7 * -\xFD\xE4"* ) 4\xFD\xE5"4\xFD\r\0\x07") + 2\xFD\xE5"2 . 6\xFD\xE5"6\xFD\r\0\x07"+\xFD\r\0\x07"- # !\xFD\xE4"! $ :\xFD\xE5":\xFD\r\0\x07"# & 8\xFD\xE5"8 @ 3\xFD\xE5"3\xFD\r\0\x07"$\xFD\r\0\x07"&\xFD\xE4". * 4\xFD\r\b	
\v\x1B\f\r"4 2 6\xFD\r\b	
\v\x1B\f\r"2\xFD\r\0\x07"* ! :\xFD\r\b	
\v\x1B\f\r": 8 3\xFD\r\b	
\v\x1B\f\r"3\xFD\r\0\x07"8\xFD\xE4"6\xFD\xE4 ) +\xFD\r\b	
\v\f\r\x1B"! : 3\xFD\r\b	
\v\f\r\x1B"3\xFD\xE4": # $\xFD\r\b	
\v\f\r\x1B"# 4 2\xFD\r\b	
\v\f\r\x1B"2\xFD\xE4"4\xFD\xE4"$\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  j > %\xFD\xE5"% / <\xFD\xE5 7\xFD\xE6 5\xFD\xE5")\xFD\xE5 ' ,\xFD\xE5 7\xFD\xE6 " (\xFD\xE5"" ;  \xFD\xE5" \xFD\xE5 0\xFD\xE6"'   1\xFD\xE6\xFD\xE4 =\xFD\xE5" \xFD\xE5"(\xFD\xE4\xFD\xF9 \xFD\xB7 - &\xFD\xE5"& * 8\xFD\xE5 7\xFD\xE6 6\xFD\xE5"8\xFD\xE5 : 4\xFD\xE5 7\xFD\xE6 # 2\xFD\xE5"7 ! 3\xFD\xE5"3\xFD\xE5 0\xFD\xE6"0 3 1\xFD\xE6\xFD\xE4 $\xFD\xE5"1\xFD\xE5"3\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  j ? 5\xFD\xE5 " 9\xFD\xE6 '\xFD\xE5 (\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 . 6\xFD\xE5 7 9\xFD\xE6 0\xFD\xE5 3\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0  j % )\xFD\xE4  \xFD\xE5\xFD\xF9 \xFD\xB7 & 8\xFD\xE4 1\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86 \xFD\r\0\b
\f\0\0\0\0\0\0\0\0\xFD[\0\0\0 A\bj! A\x80j! Aj!\f\0\v\v\v\xB0&\x7F{}3{ A \x1B (\0Avj! \0("(\b tAv" ("Ajl!  Ajl!  A\rjl!  A\fjl!  A\vjl!\x1B  A
jl!  A	jl!  A\bjl!  A\x07jl!  Ajl!   Ajl!!  Ajl!"  Ajl!#  Ajl!$  Ajl!%  l!A\x7F / tA\x7FsA\xFF\xFFq\xFD!& \0(\0*\x9C!'A\0!@@  O\r A\xF0j\xFD\0\0!( A\xB0j\xFD\0\0!) A\xB0j\xFD\0\0!* A\xF0j\xFD\0\0!+ A\xD0j\xFD\0\0!, A\xD0j\xFD\0\0!- A\x90j\xFD\0\0!. A\x90j\xFD\0\0!/ A\xE0j\xFD\0\0!0 A\xA0j\xFD\0\0!1 A\xA0j\xFD\0\0!2 A\xE0j\xFD\0\0!3 A\xC0j\xFD\0\0!4 A\xC0j\xFD\0\0!5 A\x80j\xFD\0\0!6 A\x80j\xFD\0\0!7  j  \xFD\0 \xFD\xE6"8  \xFD\0\xE0\xFD\xE6"9\xFD\xE4":  \xFD\0\xA0\xFD\xE6"; 
 \xFD\0\`\xFD\xE6"<\xFD\xE4"=\xFD\xE4"> \b \xFD\0@\xFD\xE6"?  \xFD\0\xC0\xFD\xE6"@\xFD\xE4"A \f \xFD\0\x80\xFD\xE6"B  \xFD\0\0\xFD\xE6"C ' C\xFD\0\x92\xFD \0"C\xFD\xE4"D\xFD\xE4"E\xFD\xE4"F ? @\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"?\xFD\xE6 A\xFD\xE5"@ C B\xFD\xE5"B\xFD\xE4"G ; <\xFD\xE5"< 8 9\xFD\xE5";\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"8\xFD\xE6"C ;\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"9\xFD\xE6\xFD\xE4 >\xFD\xE5";\xFD\xE4"H\xFD\r\0\x07"I B @\xFD\xE5"J : =\xFD\xE5 ?\xFD\xE6 ;\xFD\xE5":\xFD\xE4"K D A\xFD\xE5"D <\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"A\xFD\xE6 C\xFD\xE5 :\xFD\xE4"L\xFD\xE5"C\xFD\r\0\x07"M\xFD\r\0\x07"N \x07 \xFD\00\xFD\xE6"@  \xFD\0\xF0\xFD\xE6"B\xFD\xE4"O  \xFD\0\xB0\xFD\xE6"P \v \xFD\0p\xFD\xE6"Q\xFD\xE4"R\xFD\xE4"< 	 \xFD\0P\xFD\xE6"S  \xFD\0\xD0\xFD\xE6"T\xFD\xE4"= \r \xFD\0\x90\xFD\xE6"U  \xFD\0\xFD\xE6"V\xFD\xE4"W\xFD\xE4"X\xFD\xE4"Y S T\xFD\xE5 ?\xFD\xE6 =\xFD\xE5"S V U\xFD\xE5"T\xFD\xE4"U P Q\xFD\xE5"P @ B\xFD\xE5"@\xFD\xE5 8\xFD\xE6"Q @ 9\xFD\xE6\xFD\xE4 <\xFD\xE5"@\xFD\xE4"V\xFD\r\0\x07"Z T S\xFD\xE5"S O R\xFD\xE5 ?\xFD\xE6 @\xFD\xE5"B\xFD\xE4"O W =\xFD\xE5"R P A\xFD\xE6 Q\xFD\xE5 B\xFD\xE4"P\xFD\xE5"=\xFD\r\0\x07"Q\xFD\r\0\x07"T\xFD\xE4"W F H\xFD\r\b	
\v\x1B\f\r"F K C\xFD\r\b	
\v\x1B\f\r"C\xFD\r\0\x07"H Y V\xFD\r\b	
\v\x1B\f\r"K O =\xFD\r\b	
\v\x1B\f\r"O\xFD\r\0\x07"V\xFD\xE4"=\xFD\xE4"Y I M\xFD\r\b	
\v\f\r\x1B"I K O\xFD\r\b	
\v\f\r\x1B"K\xFD\xE4"M Z Q\xFD\r\b	
\v\f\r\x1B"O F C\xFD\r\b	
\v\f\r\x1B"F\xFD\xE4"Q\xFD\xE4"C\xFD\xE4\xFD\xF9 &\xFD\xB7 D L\xFD\xE4"D J :\xFD\xE5":\xFD\r\0\x07"J G ;\xFD\xE5"; E >\xFD\xE5">\xFD\r\0\x07"E\xFD\r\0\x07"G R P\xFD\xE4"L S B\xFD\xE5"B\xFD\r\0\x07"P U @\xFD\xE5"@ X <\xFD\xE5"<\xFD\r\0\x07"R\xFD\r\0\x07"S\xFD\xE4"U D :\xFD\r\b	
\v\x1B\f\r": ; >\xFD\r\b	
\v\x1B\f\r";\xFD\r\0\x07"D L B\xFD\r\b	
\v\x1B\f\r"B @ <\xFD\r\b	
\v\x1B\f\r"<\xFD\r\0\x07"@\xFD\xE4">\xFD\xE4"L J E\xFD\r\b	
\v\f\r\x1B"E B <\xFD\r\b	
\v\f\r\x1B"<\xFD\xE4"B P R\xFD\r\b	
\v\f\r\x1B"J : ;\xFD\r\b	
\v\f\r\x1B"P\xFD\xE4"R\xFD\xE4";\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r N T\xFD\xE5"N H V\xFD\xE5 ?\xFD\xE6 =\xFD\xE5"H\xFD\xE4"T O F\xFD\xE5"F I K\xFD\xE5":\xFD\xE5 8\xFD\xE6"I : 9\xFD\xE6\xFD\xE4 C\xFD\xE5":\xFD\xE4\xFD\xF9 &\xFD\xB7 G S\xFD\xE5"G D @\xFD\xE5 ?\xFD\xE6 >\xFD\xE5"D\xFD\xE4"K J P\xFD\xE5"J E <\xFD\xE5"<\xFD\xE5 8\xFD\xE6"E < 9\xFD\xE6\xFD\xE4 ;\xFD\xE5"<\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"@\xFD[\0\0\0  %j @\xFD[\0\0  $j N H\xFD\xE5"H M Q\xFD\xE5 ?\xFD\xE6 :\xFD\xE5"@\xFD\xE4\xFD\xF9 &\xFD\xB7 G D\xFD\xE5"D B R\xFD\xE5 ?\xFD\xE6 <\xFD\xE5"B\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r W =\xFD\xE5"= F A\xFD\xE6 I\xFD\xE5 @\xFD\xE4"F\xFD\xE5\xFD\xF9 &\xFD\xB7 U >\xFD\xE5"> J A\xFD\xE6 E\xFD\xE5 B\xFD\xE4"E\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"G\xFD[\0\0\0  #j G\xFD[\0\0  "j = F\xFD\xE4\xFD\xF9 &\xFD\xB7 > E\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r H @\xFD\xE5\xFD\xF9 &\xFD\xB7 D B\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f">\xFD[\0\0\0  !j >\xFD[\0\0   j T :\xFD\xE5\xFD\xF9 &\xFD\xB7 K <\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r Y C\xFD\xE5\xFD\xF9 &\xFD\xB7 L ;\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f">\xFD[\0\0\0  j >\xFD[\0\0  j  1\xFD\xE6":  0\xFD\xE6"<\xFD\xE4"=  2\xFD\xE6"@ 
 3\xFD\xE6"B\xFD\xE4"C\xFD\xE4"> \b 5\xFD\xE6"0  4\xFD\xE6"1\xFD\xE4"; \f 6\xFD\xE6"2  7\xFD\xE6"3 ' 3\xFD\0\x92\xFD \0"3\xFD\xE4"4\xFD\xE4"5\xFD\xE4"6 0 1\xFD\xE5 ?\xFD\xE6 ;\xFD\xE5"0 3 2\xFD\xE5"1\xFD\xE4"2 @ B\xFD\xE5"@ : <\xFD\xE5":\xFD\xE5 8\xFD\xE6"B : 9\xFD\xE6\xFD\xE4 >\xFD\xE5":\xFD\xE4"3\xFD\r\0\x07"7 1 0\xFD\xE5"0 = C\xFD\xE5 ?\xFD\xE6 :\xFD\xE5"<\xFD\xE4"C 4 ;\xFD\xE5"1 @ A\xFD\xE6 B\xFD\xE5 <\xFD\xE4"4\xFD\xE5"D\xFD\r\0\x07"E\xFD\r\0\x07"F \x07 )\xFD\xE6"@  (\xFD\xE6"B\xFD\xE4"(  *\xFD\xE6") \v +\xFD\xE6"*\xFD\xE4"+\xFD\xE4"; 	 -\xFD\xE6"-  ,\xFD\xE6",\xFD\xE4"= \r .\xFD\xE6".  /\xFD\xE6"/\xFD\xE4"G\xFD\xE4"H\xFD\xE4"I - ,\xFD\xE5 ?\xFD\xE6 =\xFD\xE5", / .\xFD\xE5"-\xFD\xE4". ) *\xFD\xE5") @ B\xFD\xE5"@\xFD\xE5 8\xFD\xE6"* @ 9\xFD\xE6\xFD\xE4 ;\xFD\xE5"@\xFD\xE4"/\xFD\r\0\x07"J - ,\xFD\xE5", ( +\xFD\xE5 ?\xFD\xE6 @\xFD\xE5"B\xFD\xE4"( G =\xFD\xE5"+ ) A\xFD\xE6 *\xFD\xE5 B\xFD\xE4")\xFD\xE5"=\xFD\r\0\x07"*\xFD\r\0\x07"-\xFD\xE4"G 6 3\xFD\r\b	
\v\x1B\f\r"3 C D\xFD\r\b	
\v\x1B\f\r"C\xFD\r\0\x07"6 I /\xFD\r\b	
\v\x1B\f\r"/ ( =\xFD\r\b	
\v\x1B\f\r"(\xFD\r\0\x07"D\xFD\xE4"=\xFD\xE4"I 7 E\xFD\r\b	
\v\f\r\x1B"7 / (\xFD\r\b	
\v\f\r\x1B"(\xFD\xE4"/ J *\xFD\r\b	
\v\f\r\x1B"* 3 C\xFD\r\b	
\v\f\r\x1B"3\xFD\xE4"E\xFD\xE4"C\xFD\xE4\xFD\xF9 &\xFD\xB7 1 4\xFD\xE4"1 0 <\xFD\xE5"<\xFD\r\0\x07"0 2 :\xFD\xE5": 5 >\xFD\xE5">\xFD\r\0\x07"2\xFD\r\0\x07"4 + )\xFD\xE4") , B\xFD\xE5"B\xFD\r\0\x07"+ . @\xFD\xE5"@ H ;\xFD\xE5";\xFD\r\0\x07",\xFD\r\0\x07".\xFD\xE4"5 1 <\xFD\r\b	
\v\x1B\f\r"< : >\xFD\r\b	
\v\x1B\f\r":\xFD\r\0\x07"1 ) B\xFD\r\b	
\v\x1B\f\r"B @ ;\xFD\r\b	
\v\x1B\f\r";\xFD\r\0\x07"@\xFD\xE4">\xFD\xE4") 0 2\xFD\r\b	
\v\f\r\x1B"0 B ;\xFD\r\b	
\v\f\r\x1B"B\xFD\xE4"2 + ,\xFD\r\b	
\v\f\r\x1B"+ < :\xFD\r\b	
\v\f\r\x1B"<\xFD\xE4",\xFD\xE4";\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r F -\xFD\xE5"- 6 D\xFD\xE5 ?\xFD\xE6 =\xFD\xE5"6\xFD\xE4"D * 3\xFD\xE5"* 7 (\xFD\xE5":\xFD\xE5 8\xFD\xE6"( : 9\xFD\xE6\xFD\xE4 C\xFD\xE5":\xFD\xE4\xFD\xF9 &\xFD\xB7 4 .\xFD\xE5". 1 @\xFD\xE5 ?\xFD\xE6 >\xFD\xE5"@\xFD\xE4"1 + <\xFD\xE5"< 0 B\xFD\xE5"B\xFD\xE5 8\xFD\xE6"+ B 9\xFD\xE6\xFD\xE4 ;\xFD\xE5"8\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"9\xFD[\0\0\0  j 9\xFD[\0\0  j - 6\xFD\xE5"B / E\xFD\xE5 ?\xFD\xE6 :\xFD\xE5"9\xFD\xE4\xFD\xF9 &\xFD\xB7 . @\xFD\xE5"@ 2 ,\xFD\xE5 ?\xFD\xE6 8\xFD\xE5"?\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r G =\xFD\xE5"= * A\xFD\xE6 (\xFD\xE5 9\xFD\xE4"(\xFD\xE5\xFD\xF9 &\xFD\xB7 5 >\xFD\xE5"> < A\xFD\xE6 +\xFD\xE5 ?\xFD\xE4"A\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"<\xFD[\0\0\0  \x1Bj <\xFD[\0\0  j = (\xFD\xE4\xFD\xF9 &\xFD\xB7 > A\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r B 9\xFD\xE5\xFD\xF9 &\xFD\xB7 @ ?\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"?\xFD[\0\0\0  j ?\xFD[\0\0  j D :\xFD\xE5\xFD\xF9 &\xFD\xB7 1 8\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r I C\xFD\xE5\xFD\xF9 &\xFD\xB7 ) ;\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f"?\xFD[\0\0\0  j ?\xFD[\0\0 A\bj! A\x80j! Aj!\f\0\v\v\v\xA8({}.{ A \x1B (\0 \0("(\b t" (ljj!A\x7F / tA\x7FsA\xFF\xFFq\xFD! \0(\0*\x9C!A\0!\0@@ \0 O\r  \xFD\0 \xFD\xE6"  \xFD\0\xE0\xFD\xE6"\xFD\xE4"\x1B  \xFD\0\xA0\xFD\xE6" 
 \xFD\0\`\xFD\xE6"\xFD\xE4"\xFD\xE4" \b \xFD\0@\xFD\xE6"   \xFD\0\xC0\xFD\xE6"!\xFD\xE4"" \f \xFD\0\x80\xFD\xE6"#  \xFD\0\0\xFD\xE6"$  $\xFD\0\x92\xFD \0"$\xFD\xE4"%\xFD\xE4"&\xFD\xE4"'   !\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?" \xFD\xE6 "\xFD\xE5"! $ #\xFD\xE5"#\xFD\xE4"(  \xFD\xE5"  \xFD\xE5"\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"\xFD\xE6"$ \xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"\xFD\xE6\xFD\xE4 \xFD\xE5"\xFD\xE4")\xFD\r\0\x07"* # !\xFD\xE5"+ \x1B \xFD\xE5  \xFD\xE6 \xFD\xE5"\x1B\xFD\xE4", % "\xFD\xE5"% \xFD\fu='\xC0u='\xC0u='\xC0u='\xC0""\xFD\xE6 $\xFD\xE5 \x1B\xFD\xE4"-\xFD\xE5"$\xFD\r\0\x07".\xFD\r\0\x07"/ \x07 \xFD\00\xFD\xE6"!  \xFD\0\xF0\xFD\xE6"#\xFD\xE4"0  \xFD\0\xB0\xFD\xE6"1 \v \xFD\0p\xFD\xE6"2\xFD\xE4"3\xFD\xE4" 	 \xFD\0P\xFD\xE6"4  \xFD\0\xD0\xFD\xE6"5\xFD\xE4" \r \xFD\0\x90\xFD\xE6"6  \xFD\0\xFD\xE6"7\xFD\xE4"8\xFD\xE4"9\xFD\xE4": 4 5\xFD\xE5  \xFD\xE6 \xFD\xE5"4 7 6\xFD\xE5"5\xFD\xE4"6 1 2\xFD\xE5"1 ! #\xFD\xE5"!\xFD\xE5 \xFD\xE6"2 ! \xFD\xE6\xFD\xE4 \xFD\xE5"!\xFD\xE4"7\xFD\r\0\x07"; 5 4\xFD\xE5"4 0 3\xFD\xE5  \xFD\xE6 !\xFD\xE5"#\xFD\xE4"0 8 \xFD\xE5"3 1 "\xFD\xE6 2\xFD\xE5 #\xFD\xE4"1\xFD\xE5"\xFD\r\0\x07"2\xFD\r\0\x07"5\xFD\xE4"8 ' )\xFD\r\b	
\v\x1B\f\r"' , $\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07") : 7\xFD\r\b	
\v\x1B\f\r", 0 \xFD\r\b	
\v\x1B\f\r"0\xFD\r\0\x07"7\xFD\xE4"\xFD\xE4": * .\xFD\r\b	
\v\f\r\x1B"* , 0\xFD\r\b	
\v\f\r\x1B",\xFD\xE4". ; 2\xFD\r\b	
\v\f\r\x1B"0 ' $\xFD\r\b	
\v\f\r\x1B"'\xFD\xE4"2\xFD\xE4"$\xFD\xE4\xFD\xF9 \xFD\xB7 % -\xFD\xE4"% + \x1B\xFD\xE5"\x1B\xFD\r\0\x07"+ ( \xFD\xE5" & \xFD\xE5"\xFD\r\0\x07"&\xFD\r\0\x07"( 3 1\xFD\xE4"- 4 #\xFD\xE5"#\xFD\r\0\x07"1 6 !\xFD\xE5"! 9 \xFD\xE5"\xFD\r\0\x07"3\xFD\r\0\x07"4\xFD\xE4"6 % \x1B\xFD\r\b	
\v\x1B\f\r"\x1B  \xFD\r\b	
\v\x1B\f\r"\xFD\r\0\x07"% - #\xFD\r\b	
\v\x1B\f\r"# ! \xFD\r\b	
\v\x1B\f\r"\xFD\r\0\x07"!\xFD\xE4"\xFD\xE4"- + &\xFD\r\b	
\v\f\r\x1B"& # \xFD\r\b	
\v\f\r\x1B"\xFD\xE4"# 1 3\xFD\r\b	
\v\f\r\x1B"+ \x1B \xFD\r\b	
\v\f\r\x1B"1\xFD\xE4"3\xFD\xE4"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r / 5\xFD\xE5"/ ) 7\xFD\xE5  \xFD\xE6 \xFD\xE5")\xFD\xE4"5 0 '\xFD\xE5"' * ,\xFD\xE5"\x1B\xFD\xE5 \xFD\xE6"* \x1B \xFD\xE6\xFD\xE4 $\xFD\xE5"\x1B\xFD\xE4\xFD\xF9 \xFD\xB7 ( 4\xFD\xE5"( % !\xFD\xE5  \xFD\xE6 \xFD\xE5"%\xFD\xE4", + 1\xFD\xE5"+ & \xFD\xE5"\xFD\xE5 \xFD\xE6"&  \xFD\xE6\xFD\xE4 \xFD\xE5"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!! A\xF0j\xFD\0\0!0 A\xB0j\xFD\0\0!1 A\xB0j\xFD\0\0!4 A\xF0j\xFD\0\0!7 A\xD0j\xFD\0\0!9 A\xD0j\xFD\0\0!; A\x90j\xFD\0\0!< A\x90j\xFD\0\0!= A\xE0j\xFD\0\0!> A\xA0j\xFD\0\0!? A\xA0j\xFD\0\0!@ A\xE0j\xFD\0\0!A A\xC0j\xFD\0\0!B A\xC0j\xFD\0\0!C A\x80j\xFD\0\0!D A\x80j\xFD\0\0!E ! \xFD\r\0\0\x07\x07!F ! \xFD\r\b\b		

\v\v\f\f\r\r!!  F\xFD\v\0\0  j" !\xFD\v\0\0 / )\xFD\xE5") . 2\xFD\xE5  \xFD\xE6 \x1B\xFD\xE5"!\xFD\xE4\xFD\xF9 \xFD\xB7 ( %\xFD\xE5"% # 3\xFD\xE5  \xFD\xE6 \xFD\xE5"#\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 8 \xFD\xE5" ' "\xFD\xE6 *\xFD\xE5 !\xFD\xE4"'\xFD\xE5\xFD\xF9 \xFD\xB7 6 \xFD\xE5"( + "\xFD\xE6 &\xFD\xE5 #\xFD\xE4"&\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!  \xFD\r\0\0\x07\x07!*  \xFD\r\b\b		

\v\v\f\f\r\r!  j" *\xFD\v\0\0  j" \xFD\v\0\0  '\xFD\xE4\xFD\xF9 \xFD\xB7 ( &\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r ) !\xFD\xE5\xFD\xF9 \xFD\xB7 % #\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!  \xFD\r\0\0\x07\x07!  \xFD\r\b\b		

\v\v\f\f\r\r!  j" \xFD\v\0\0  j" \xFD\v\0\0 5 \x1B\xFD\xE5\xFD\xF9 \xFD\xB7 , \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r : $\xFD\xE5\xFD\xF9 \xFD\xB7 - \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!  \xFD\r\0\0\x07\x07!  \xFD\r\b\b		

\v\v\f\f\r\r!  j" \xFD\v\0\0  j" \xFD\v\0\0  ?\xFD\xE6"\x1B  >\xFD\xE6"\xFD\xE4"  @\xFD\xE6"! 
 A\xFD\xE6"#\xFD\xE4"$\xFD\xE4" \b C\xFD\xE6"%  B\xFD\xE6"&\xFD\xE4" \f D\xFD\xE6"'  E\xFD\xE6"(  (\xFD\0\x92\xFD \0"(\xFD\xE4")\xFD\xE4"*\xFD\xE4"+ % &\xFD\xE5  \xFD\xE6 \xFD\xE5"% ( '\xFD\xE5"&\xFD\xE4"' ! #\xFD\xE5"! \x1B \xFD\xE5"\x1B\xFD\xE5 \xFD\xE6"# \x1B \xFD\xE6\xFD\xE4 \xFD\xE5"\x1B\xFD\xE4"(\xFD\r\0\x07", & %\xFD\xE5"%  $\xFD\xE5  \xFD\xE6 \x1B\xFD\xE5"\xFD\xE4"$ ) \xFD\xE5"& ! "\xFD\xE6 #\xFD\xE5 \xFD\xE4")\xFD\xE5"-\xFD\r\0\x07".\xFD\r\0\x07"/ \x07 1\xFD\xE6"!  0\xFD\xE6"#\xFD\xE4"0  4\xFD\xE6"1 \v 7\xFD\xE6"2\xFD\xE4"3\xFD\xE4" 	 ;\xFD\xE6"4  9\xFD\xE6"5\xFD\xE4" \r <\xFD\xE6"6  =\xFD\xE6"7\xFD\xE4"8\xFD\xE4"9\xFD\xE4": 4 5\xFD\xE5  \xFD\xE6 \xFD\xE5"4 7 6\xFD\xE5"5\xFD\xE4"6 1 2\xFD\xE5"1 ! #\xFD\xE5"!\xFD\xE5 \xFD\xE6"2 ! \xFD\xE6\xFD\xE4 \xFD\xE5"!\xFD\xE4"7\xFD\r\0\x07"; 5 4\xFD\xE5"4 0 3\xFD\xE5  \xFD\xE6 !\xFD\xE5"#\xFD\xE4"0 8 \xFD\xE5"3 1 "\xFD\xE6 2\xFD\xE5 #\xFD\xE4"1\xFD\xE5"\xFD\r\0\x07"2\xFD\r\0\x07"5\xFD\xE4"8 + (\xFD\r\b	
\v\x1B\f\r"( $ -\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07"+ : 7\xFD\r\b	
\v\x1B\f\r"- 0 \xFD\r\b	
\v\x1B\f\r"0\xFD\r\0\x07"7\xFD\xE4"\xFD\xE4": , .\xFD\r\b	
\v\f\r\x1B", - 0\xFD\r\b	
\v\f\r\x1B"-\xFD\xE4". ; 2\xFD\r\b	
\v\f\r\x1B"0 ( $\xFD\r\b	
\v\f\r\x1B"(\xFD\xE4"2\xFD\xE4"$\xFD\xE4\xFD\xF9 \xFD\xB7 & )\xFD\xE4"& % \xFD\xE5"\xFD\r\0\x07"% ' \x1B\xFD\xE5"\x1B * \xFD\xE5"\xFD\r\0\x07"'\xFD\r\0\x07") 3 1\xFD\xE4"* 4 #\xFD\xE5"#\xFD\r\0\x07"1 6 !\xFD\xE5"! 9 \xFD\xE5"\xFD\r\0\x07"3\xFD\r\0\x07"4\xFD\xE4"6 & \xFD\r\b	
\v\x1B\f\r" \x1B \xFD\r\b	
\v\x1B\f\r"\x1B\xFD\r\0\x07"& * #\xFD\r\b	
\v\x1B\f\r"# ! \xFD\r\b	
\v\x1B\f\r"\xFD\r\0\x07"!\xFD\xE4"\xFD\xE4"* % '\xFD\r\b	
\v\f\r\x1B"% # \xFD\r\b	
\v\f\r\x1B"#\xFD\xE4"' 1 3\xFD\r\b	
\v\f\r\x1B"1  \x1B\xFD\r\b	
\v\f\r\x1B"\xFD\xE4"3\xFD\xE4"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r / 5\xFD\xE5"/ + 7\xFD\xE5  \xFD\xE6 \xFD\xE5"+\xFD\xE4"5 0 (\xFD\xE5"( , -\xFD\xE5"\x1B\xFD\xE5 \xFD\xE6", \x1B \xFD\xE6\xFD\xE4 $\xFD\xE5"\x1B\xFD\xE4\xFD\xF9 \xFD\xB7 ) 4\xFD\xE5") & !\xFD\xE5  \xFD\xE6 \xFD\xE5"!\xFD\xE4"& 1 \xFD\xE5" % #\xFD\xE5"#\xFD\xE5 \xFD\xE6"% # \xFD\xE6\xFD\xE4 \xFD\xE5"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!  \xFD\r\0\0\x07\x07!#  \xFD\r\b\b		

\v\v\f\f\r\r!  j" #\xFD\v\0\0  j" \xFD\v\0\0 / +\xFD\xE5"# . 2\xFD\xE5  \xFD\xE6 \x1B\xFD\xE5"\xFD\xE4\xFD\xF9 \xFD\xB7 ) !\xFD\xE5"! ' 3\xFD\xE5  \xFD\xE6 \xFD\xE5" \xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 8 \xFD\xE5" ( "\xFD\xE6 ,\xFD\xE5 \xFD\xE4"'\xFD\xE5\xFD\xF9 \xFD\xB7 6 \xFD\xE5"  "\xFD\xE6 %\xFD\xE5  \xFD\xE4"\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!" " \xFD\r\0\0\x07\x07!% " \xFD\r\b\b		

\v\v\f\f\r\r!"  j" %\xFD\v\0\0  j" "\xFD\v\0\0  '\xFD\xE4\xFD\xF9 \xFD\xB7  \xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r # \xFD\xE5\xFD\xF9 \xFD\xB7 !  \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!    \xFD\r\0\0\x07\x07!   \xFD\r\b\b		

\v\v\f\f\r\r!   j" \xFD\v\0\0  j"  \xFD\v\0\0 5 \x1B\xFD\xE5\xFD\xF9 \xFD\xB7 & \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r : $\xFD\xE5\xFD\xF9 \xFD\xB7 * \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!    \xFD\r\0\0\x07\x07!   \xFD\r\b\b		

\v\v\f\f\r\r!   j" \xFD\v\0\0  j  \xFD\v\0\0 Aj! A\x80j! \0Aj!\0\f\0\v\v\v\xADI\x07\x7F{}W{ A \x1B (\0Avj! \0("(\b tAv" (Av"A\x07jl!  Ajl!  Ajl!  Ajl!  Ajl!\x1B  Ajl!  Ajl!  l!A\x7F / tA\x7FsA\xFF\xFFq\xFD! \0(\0*\x9C!A\0!@@  O\r  \xFD\0 \xFD\xE6"   \xFD\0\xE0\xFD\xE6"!\xFD\xE4""  \xFD\0\xA0\xFD\xE6"# 
 \xFD\0\`\xFD\xE6"$\xFD\xE4"%\xFD\xE4"& \b \xFD\0@\xFD\xE6"'  \xFD\0\xC0\xFD\xE6"(\xFD\xE4") \f \xFD\0\x80\xFD\xE6"*  \xFD\0\0\xFD\xE6"+  +\xFD\0\x92\xFD \0"+\xFD\xE4",\xFD\xE4"-\xFD\xE4". ' (\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"'\xFD\xE6 )\xFD\xE5"( + *\xFD\xE5"*\xFD\xE4"/ # $\xFD\xE5"$   !\xFD\xE5"#\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF" \xFD\xE6"+ #\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"!\xFD\xE6\xFD\xE4 &\xFD\xE5"#\xFD\xE4"0\xFD\r\0\x07"1 * (\xFD\xE5"2 " %\xFD\xE5 '\xFD\xE6 #\xFD\xE5""\xFD\xE4"3 , )\xFD\xE5", $\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0")\xFD\xE6 +\xFD\xE5 "\xFD\xE4"4\xFD\xE5"+\xFD\r\0\x07"5\xFD\r\0\x07"6 \x07 \xFD\00\xFD\xE6"(  \xFD\0\xF0\xFD\xE6"*\xFD\xE4"7  \xFD\0\xB0\xFD\xE6"8 \v \xFD\0p\xFD\xE6"9\xFD\xE4":\xFD\xE4"$ 	 \xFD\0P\xFD\xE6";  \xFD\0\xD0\xFD\xE6"<\xFD\xE4"% \r \xFD\0\x90\xFD\xE6"=  \xFD\0\xFD\xE6">\xFD\xE4"?\xFD\xE4"@\xFD\xE4"A ; <\xFD\xE5 '\xFD\xE6 %\xFD\xE5"; > =\xFD\xE5"<\xFD\xE4"= 8 9\xFD\xE5"8 ( *\xFD\xE5"(\xFD\xE5  \xFD\xE6"9 ( !\xFD\xE6\xFD\xE4 $\xFD\xE5"(\xFD\xE4">\xFD\r\0\x07"B < ;\xFD\xE5"; 7 :\xFD\xE5 '\xFD\xE6 (\xFD\xE5"*\xFD\xE4"7 ? %\xFD\xE5": 8 )\xFD\xE6 9\xFD\xE5 *\xFD\xE4"8\xFD\xE5"%\xFD\r\0\x07"9\xFD\r\0\x07"<\xFD\xE4"? . 0\xFD\r\b	
\v\x1B\f\r". 3 +\xFD\r\b	
\v\x1B\f\r"+\xFD\r\0\x07"0 A >\xFD\r\b	
\v\x1B\f\r"3 7 %\xFD\r\b	
\v\x1B\f\r"7\xFD\r\0\x07">\xFD\xE4"%\xFD\xE4"A 1 5\xFD\r\b	
\v\f\r\x1B"1 3 7\xFD\r\b	
\v\f\r\x1B"3\xFD\xE4"5 B 9\xFD\r\b	
\v\f\r\x1B"7 . +\xFD\r\b	
\v\f\r\x1B".\xFD\xE4"9\xFD\xE4"+\xFD\xE4\xFD\xF9 \xFD\xB7 , 4\xFD\xE4", 2 "\xFD\xE5""\xFD\r\0\x07"2 / #\xFD\xE5"# - &\xFD\xE5"&\xFD\r\0\x07"-\xFD\r\0\x07"/ : 8\xFD\xE4"4 ; *\xFD\xE5"*\xFD\r\0\x07"8 = (\xFD\xE5"( @ $\xFD\xE5"$\xFD\r\0\x07":\xFD\r\0\x07";\xFD\xE4"= , "\xFD\r\b	
\v\x1B\f\r"" # &\xFD\r\b	
\v\x1B\f\r"#\xFD\r\0\x07", 4 *\xFD\r\b	
\v\x1B\f\r"* ( $\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07"(\xFD\xE4"&\xFD\xE4"4 2 -\xFD\r\b	
\v\f\r\x1B"- * $\xFD\r\b	
\v\f\r\x1B"$\xFD\xE4"2 8 :\xFD\r\b	
\v\f\r\x1B"* " #\xFD\r\b	
\v\f\r\x1B"8\xFD\xE4":\xFD\xE4"#\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 6 <\xFD\xE5"6 0 >\xFD\xE5 '\xFD\xE6 %\xFD\xE5"<\xFD\xE4"> 7 .\xFD\xE5"7 1 3\xFD\xE5""\xFD\xE5  \xFD\xE6"3 " !\xFD\xE6\xFD\xE4 +\xFD\xE5""\xFD\xE4\xFD\xF9 \xFD\xB7 / ;\xFD\xE5"; , (\xFD\xE5 '\xFD\xE6 &\xFD\xE5"@\xFD\xE4"B * 8\xFD\xE5"8 - $\xFD\xE5"$\xFD\xE5  \xFD\xE6"C $ !\xFD\xE6\xFD\xE4 #\xFD\xE5"$\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!D  A\xA0j\xFD\0\0\xFD\xE6",  A\xE0j\xFD\0\0\xFD\xE6"-\xFD\xE4".  A\xA0j\xFD\0\0\xFD\xE6"/ 
 A\xE0j\xFD\0\0\xFD\xE6"0\xFD\xE4"1\xFD\xE4"( \b A\xC0j\xFD\0\0\xFD\xE6"E  A\xC0j\xFD\0\0\xFD\xE6"F\xFD\xE4"* \f A\x80j\xFD\0\0\xFD\xE6"G  A\x80j\xFD\0\0\xFD\xE6"H  H\xFD\0\x92\xFD \0"H\xFD\xE4"I\xFD\xE4"J\xFD\xE4"K E F\xFD\xE5 '\xFD\xE6 *\xFD\xE5"E H G\xFD\xE5"F\xFD\xE4"G / 0\xFD\xE5"/ , -\xFD\xE5",\xFD\xE5  \xFD\xE6"0 , !\xFD\xE6\xFD\xE4 (\xFD\xE5",\xFD\xE4"H\xFD\r\0\x07"L F E\xFD\xE5"E . 1\xFD\xE5 '\xFD\xE6 ,\xFD\xE5"-\xFD\xE4"1 I *\xFD\xE5"F / )\xFD\xE6 0\xFD\xE5 -\xFD\xE4"I\xFD\xE5"M\xFD\r\0\x07"N\xFD\r\0\x07"O \x07 A\xB0j\xFD\0\0\xFD\xE6"/  A\xF0j\xFD\0\0\xFD\xE6"0\xFD\xE4"P  A\xB0j\xFD\0\0\xFD\xE6"Q \v A\xF0j\xFD\0\0\xFD\xE6"R\xFD\xE4"S\xFD\xE4"* 	 A\xD0j\xFD\0\0\xFD\xE6"T  A\xD0j\xFD\0\0\xFD\xE6"U\xFD\xE4". \r A\x90j\xFD\0\0\xFD\xE6"V  A\x90j\xFD\0\0\xFD\xE6"W\xFD\xE4"X\xFD\xE4"Y\xFD\xE4"Z T U\xFD\xE5 '\xFD\xE6 .\xFD\xE5"T W V\xFD\xE5"U\xFD\xE4"V Q R\xFD\xE5"Q / 0\xFD\xE5"/\xFD\xE5  \xFD\xE6"R / !\xFD\xE6\xFD\xE4 *\xFD\xE5"/\xFD\xE4"W\xFD\r\0\x07"[ U T\xFD\xE5"T P S\xFD\xE5 '\xFD\xE6 /\xFD\xE5"0\xFD\xE4"P X .\xFD\xE5"S Q )\xFD\xE6 R\xFD\xE5 0\xFD\xE4"Q\xFD\xE5".\xFD\r\0\x07"R\xFD\r\0\x07"U\xFD\xE4"X K H\xFD\r\b	
\v\x1B\f\r"H 1 M\xFD\r\b	
\v\x1B\f\r"1\xFD\r\0\x07"K Z W\xFD\r\b	
\v\x1B\f\r"M P .\xFD\r\b	
\v\x1B\f\r"P\xFD\r\0\x07"W\xFD\xE4".\xFD\xE4"Z L N\xFD\r\b	
\v\f\r\x1B"L M P\xFD\r\b	
\v\f\r\x1B"M\xFD\xE4"N [ R\xFD\r\b	
\v\f\r\x1B"P H 1\xFD\r\b	
\v\f\r\x1B"H\xFD\xE4"R\xFD\xE4"1\xFD\xE4\xFD\xF9 \xFD\xB7 F I\xFD\xE4"F E -\xFD\xE5"-\xFD\r\0\x07"E G ,\xFD\xE5", J (\xFD\xE5"(\xFD\r\0\x07"G\xFD\r\0\x07"I S Q\xFD\xE4"J T 0\xFD\xE5"0\xFD\r\0\x07"Q V /\xFD\xE5"/ Y *\xFD\xE5"*\xFD\r\0\x07"S\xFD\r\0\x07"T\xFD\xE4"V F -\xFD\r\b	
\v\x1B\f\r"- , (\xFD\r\b	
\v\x1B\f\r",\xFD\r\0\x07"F J 0\xFD\r\b	
\v\x1B\f\r"0 / *\xFD\r\b	
\v\x1B\f\r"*\xFD\r\0\x07"/\xFD\xE4"(\xFD\xE4"J E G\xFD\r\b	
\v\f\r\x1B"E 0 *\xFD\r\b	
\v\f\r\x1B"0\xFD\xE4"G Q S\xFD\r\b	
\v\f\r\x1B"Q - ,\xFD\r\b	
\v\f\r\x1B"-\xFD\xE4"S\xFD\xE4"*\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r O U\xFD\xE5"O K W\xFD\xE5 '\xFD\xE6 .\xFD\xE5"K\xFD\xE4"U P H\xFD\xE5"H L M\xFD\xE5",\xFD\xE5  \xFD\xE6"L , !\xFD\xE6\xFD\xE4 1\xFD\xE5",\xFD\xE4\xFD\xF9 \xFD\xB7 I T\xFD\xE5"I F /\xFD\xE5 '\xFD\xE6 (\xFD\xE5"F\xFD\xE4"M Q -\xFD\xE5"P E 0\xFD\xE5"-\xFD\xE5  \xFD\xE6"E - !\xFD\xE6\xFD\xE4 *\xFD\xE5"-\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!/ A\xF0\x07j\xFD\0\0!Q A\xB0j\xFD\0\0!T A\xB0\x07j\xFD\0\0!W A\xF0j\xFD\0\0!Y A\xD0\x07j\xFD\0\0![ A\xD0j\xFD\0\0!\\ A\x90\x07j\xFD\0\0!] A\x90j\xFD\0\0!^ A\xE0\x07j\xFD\0\0!_ A\xA0j\xFD\0\0!\` A\xA0\x07j\xFD\0\0!a A\xE0j\xFD\0\0!b A\xC0\x07j\xFD\0\0!c A\xC0j\xFD\0\0!d A\x80\x07j\xFD\0\0!e A\x80j\xFD\0\0!f A\xF0j\xFD\0\0!g A\xB0j\xFD\0\0!h A\xB0j\xFD\0\0!i A\xF0j\xFD\0\0!j A\xD0j\xFD\0\0!k A\xD0j\xFD\0\0!l A\x90j\xFD\0\0!m A\x90j\xFD\0\0!n A\xE0j\xFD\0\0!o A\xA0j\xFD\0\0!p A\xA0j\xFD\0\0!q A\xE0j\xFD\0\0!r A\xC0j\xFD\0\0!s A\xC0j\xFD\0\0!t A\x80j\xFD\0\0!u A\x80j\xFD\0\0!v D /\xFD\r\0\b
\f!/  j /\xFD[\0\0\0 6 <\xFD\xE5"6 5 9\xFD\xE5 '\xFD\xE6 "\xFD\xE5"/\xFD\xE4\xFD\xF9 \xFD\xB7 ; @\xFD\xE5"5 2 :\xFD\xE5 '\xFD\xE6 $\xFD\xE5"0\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r ? %\xFD\xE5"2 7 )\xFD\xE6 3\xFD\xE5 /\xFD\xE4"3\xFD\xE5\xFD\xF9 \xFD\xB7 = &\xFD\xE5"7 8 )\xFD\xE6 C\xFD\xE5 0\xFD\xE4"8\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!9 O K\xFD\xE5": N R\xFD\xE5 '\xFD\xE6 ,\xFD\xE5"&\xFD\xE4\xFD\xF9 \xFD\xB7 I F\xFD\xE5"; G S\xFD\xE5 '\xFD\xE6 -\xFD\xE5"%\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r X .\xFD\xE5". H )\xFD\xE6 L\xFD\xE5 &\xFD\xE4"<\xFD\xE5\xFD\xF9 \xFD\xB7 V (\xFD\xE5"( P )\xFD\xE6 E\xFD\xE5 %\xFD\xE4"=\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!? 9 ?\xFD\r\0\b
\f!9  j 9\xFD[\0\0\0 2 3\xFD\xE4\xFD\xF9 \xFD\xB7 7 8\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 6 /\xFD\xE5\xFD\xF9 \xFD\xB7 5 0\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!/ . <\xFD\xE4\xFD\xF9 \xFD\xB7 ( =\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r : &\xFD\xE5\xFD\xF9 \xFD\xB7 ; %\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!& / &\xFD\r\0\b
\f!&  j &\xFD[\0\0\0 > "\xFD\xE5\xFD\xF9 \xFD\xB7 B $\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r A +\xFD\xE5\xFD\xF9 \xFD\xB7 4 #\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!& U ,\xFD\xE5\xFD\xF9 \xFD\xB7 M -\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r Z 1\xFD\xE5\xFD\xF9 \xFD\xB7 J *\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!# & #\xFD\r\0\b
\f!&  \x1Bj &\xFD[\0\0\0  p\xFD\xE6""  o\xFD\xE6"$\xFD\xE4"%  q\xFD\xE6"( 
 r\xFD\xE6"*\xFD\xE4"+\xFD\xE4"& \b t\xFD\xE6",  s\xFD\xE6"-\xFD\xE4"# \f u\xFD\xE6".  v\xFD\xE6"/  /\xFD\0\x92\xFD \0"/\xFD\xE4"0\xFD\xE4"1\xFD\xE4"2 , -\xFD\xE5 '\xFD\xE6 #\xFD\xE5", / .\xFD\xE5"-\xFD\xE4". ( *\xFD\xE5"( " $\xFD\xE5""\xFD\xE5  \xFD\xE6"* " !\xFD\xE6\xFD\xE4 &\xFD\xE5""\xFD\xE4"/\xFD\r\0\x07"3 - ,\xFD\xE5", % +\xFD\xE5 '\xFD\xE6 "\xFD\xE5"$\xFD\xE4"+ 0 #\xFD\xE5"- ( )\xFD\xE6 *\xFD\xE5 $\xFD\xE4"0\xFD\xE5"4\xFD\r\0\x07"5\xFD\r\0\x07"6 \x07 h\xFD\xE6"(  g\xFD\xE6"*\xFD\xE4"7  i\xFD\xE6"8 \v j\xFD\xE6"9\xFD\xE4":\xFD\xE4"# 	 l\xFD\xE6";  k\xFD\xE6"<\xFD\xE4"% \r m\xFD\xE6"=  n\xFD\xE6">\xFD\xE4"?\xFD\xE4"@\xFD\xE4"A ; <\xFD\xE5 '\xFD\xE6 %\xFD\xE5"; > =\xFD\xE5"<\xFD\xE4"= 8 9\xFD\xE5"8 ( *\xFD\xE5"(\xFD\xE5  \xFD\xE6"9 ( !\xFD\xE6\xFD\xE4 #\xFD\xE5"(\xFD\xE4">\xFD\r\0\x07"B < ;\xFD\xE5"; 7 :\xFD\xE5 '\xFD\xE6 (\xFD\xE5"*\xFD\xE4"7 ? %\xFD\xE5": 8 )\xFD\xE6 9\xFD\xE5 *\xFD\xE4"8\xFD\xE5"%\xFD\r\0\x07"9\xFD\r\0\x07"<\xFD\xE4"? 2 /\xFD\r\b	
\v\x1B\f\r"/ + 4\xFD\r\b	
\v\x1B\f\r"+\xFD\r\0\x07"2 A >\xFD\r\b	
\v\x1B\f\r"4 7 %\xFD\r\b	
\v\x1B\f\r"7\xFD\r\0\x07">\xFD\xE4"%\xFD\xE4"A 3 5\xFD\r\b	
\v\f\r\x1B"3 4 7\xFD\r\b	
\v\f\r\x1B"4\xFD\xE4"5 B 9\xFD\r\b	
\v\f\r\x1B"7 / +\xFD\r\b	
\v\f\r\x1B"/\xFD\xE4"9\xFD\xE4"+\xFD\xE4\xFD\xF9 \xFD\xB7 - 0\xFD\xE4"- , $\xFD\xE5"$\xFD\r\0\x07", . "\xFD\xE5"" 1 &\xFD\xE5"&\xFD\r\0\x07".\xFD\r\0\x07"0 : 8\xFD\xE4"1 ; *\xFD\xE5"*\xFD\r\0\x07"8 = (\xFD\xE5"( @ #\xFD\xE5"#\xFD\r\0\x07":\xFD\r\0\x07";\xFD\xE4"= - $\xFD\r\b	
\v\x1B\f\r"$ " &\xFD\r\b	
\v\x1B\f\r""\xFD\r\0\x07"- 1 *\xFD\r\b	
\v\x1B\f\r"* ( #\xFD\r\b	
\v\x1B\f\r"#\xFD\r\0\x07"(\xFD\xE4"&\xFD\xE4"@ , .\xFD\r\b	
\v\f\r\x1B", * #\xFD\r\b	
\v\f\r\x1B"*\xFD\xE4"B 8 :\xFD\r\b	
\v\f\r\x1B". $ "\xFD\r\b	
\v\f\r\x1B"$\xFD\xE4"8\xFD\xE4"#\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 6 <\xFD\xE5"6 2 >\xFD\xE5 '\xFD\xE6 %\xFD\xE5"2\xFD\xE4": 7 /\xFD\xE5"7 3 4\xFD\xE5""\xFD\xE5  \xFD\xE6"3 " !\xFD\xE6\xFD\xE4 +\xFD\xE5""\xFD\xE4\xFD\xF9 \xFD\xB7 0 ;\xFD\xE5"4 - (\xFD\xE5 '\xFD\xE6 &\xFD\xE5";\xFD\xE4"< . $\xFD\xE5"> , *\xFD\xE5"$\xFD\xE5  \xFD\xE6"C $ !\xFD\xE6\xFD\xE4 #\xFD\xE5"$\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!D  \`\xFD\xE6",  _\xFD\xE6"-\xFD\xE4".  a\xFD\xE6"/ 
 b\xFD\xE6"0\xFD\xE4"1\xFD\xE4"( \b d\xFD\xE6"E  c\xFD\xE6"F\xFD\xE4"* \f e\xFD\xE6"G  f\xFD\xE6"H  H\xFD\0\x92\xFD \0"H\xFD\xE4"I\xFD\xE4"J\xFD\xE4"K E F\xFD\xE5 '\xFD\xE6 *\xFD\xE5"E H G\xFD\xE5"F\xFD\xE4"G / 0\xFD\xE5"/ , -\xFD\xE5",\xFD\xE5  \xFD\xE6"0 , !\xFD\xE6\xFD\xE4 (\xFD\xE5",\xFD\xE4"H\xFD\r\0\x07"L F E\xFD\xE5"E . 1\xFD\xE5 '\xFD\xE6 ,\xFD\xE5"-\xFD\xE4"1 I *\xFD\xE5"F / )\xFD\xE6 0\xFD\xE5 -\xFD\xE4"I\xFD\xE5"M\xFD\r\0\x07"N\xFD\r\0\x07"O \x07 T\xFD\xE6"/  Q\xFD\xE6"0\xFD\xE4"P  W\xFD\xE6"Q \v Y\xFD\xE6"R\xFD\xE4"S\xFD\xE4"* 	 \\\xFD\xE6"T  [\xFD\xE6"U\xFD\xE4". \r ]\xFD\xE6"V  ^\xFD\xE6"W\xFD\xE4"X\xFD\xE4"Y\xFD\xE4"Z T U\xFD\xE5 '\xFD\xE6 .\xFD\xE5"T W V\xFD\xE5"U\xFD\xE4"V Q R\xFD\xE5"Q / 0\xFD\xE5"/\xFD\xE5  \xFD\xE6"R / !\xFD\xE6\xFD\xE4 *\xFD\xE5"/\xFD\xE4"W\xFD\r\0\x07"[ U T\xFD\xE5"T P S\xFD\xE5 '\xFD\xE6 /\xFD\xE5"0\xFD\xE4"P X .\xFD\xE5"S Q )\xFD\xE6 R\xFD\xE5 0\xFD\xE4"Q\xFD\xE5".\xFD\r\0\x07"R\xFD\r\0\x07"U\xFD\xE4"X K H\xFD\r\b	
\v\x1B\f\r"H 1 M\xFD\r\b	
\v\x1B\f\r"1\xFD\r\0\x07"K Z W\xFD\r\b	
\v\x1B\f\r"M P .\xFD\r\b	
\v\x1B\f\r"P\xFD\r\0\x07"W\xFD\xE4".\xFD\xE4"Z L N\xFD\r\b	
\v\f\r\x1B"L M P\xFD\r\b	
\v\f\r\x1B"M\xFD\xE4"N [ R\xFD\r\b	
\v\f\r\x1B"P H 1\xFD\r\b	
\v\f\r\x1B"H\xFD\xE4"R\xFD\xE4"1\xFD\xE4\xFD\xF9 \xFD\xB7 F I\xFD\xE4"F E -\xFD\xE5"-\xFD\r\0\x07"E G ,\xFD\xE5", J (\xFD\xE5"(\xFD\r\0\x07"G\xFD\r\0\x07"I S Q\xFD\xE4"J T 0\xFD\xE5"0\xFD\r\0\x07"Q V /\xFD\xE5"/ Y *\xFD\xE5"*\xFD\r\0\x07"S\xFD\r\0\x07"T\xFD\xE4"V F -\xFD\r\b	
\v\x1B\f\r"- , (\xFD\r\b	
\v\x1B\f\r",\xFD\r\0\x07"F J 0\xFD\r\b	
\v\x1B\f\r"0 / *\xFD\r\b	
\v\x1B\f\r"*\xFD\r\0\x07"/\xFD\xE4"(\xFD\xE4"J E G\xFD\r\b	
\v\f\r\x1B"E 0 *\xFD\r\b	
\v\f\r\x1B"0\xFD\xE4"G Q S\xFD\r\b	
\v\f\r\x1B"Q - ,\xFD\r\b	
\v\f\r\x1B"-\xFD\xE4"S\xFD\xE4"*\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r O U\xFD\xE5"O K W\xFD\xE5 '\xFD\xE6 .\xFD\xE5"K\xFD\xE4"U P H\xFD\xE5"H L M\xFD\xE5",\xFD\xE5  \xFD\xE6"L , !\xFD\xE6\xFD\xE4 1\xFD\xE5",\xFD\xE4\xFD\xF9 \xFD\xB7 I T\xFD\xE5"I F /\xFD\xE5 '\xFD\xE6 (\xFD\xE5"/\xFD\xE4"F Q -\xFD\xE5"M E 0\xFD\xE5"-\xFD\xE5  \xFD\xE6"0 - !\xFD\xE6\xFD\xE4 *\xFD\xE5" \xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!! D !\xFD\r\0\b
\f!!  j !\xFD[\0\0\0 6 2\xFD\xE5"2 5 9\xFD\xE5 '\xFD\xE6 "\xFD\xE5"!\xFD\xE4\xFD\xF9 \xFD\xB7 4 ;\xFD\xE5"4 B 8\xFD\xE5 '\xFD\xE6 $\xFD\xE5"-\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r ? %\xFD\xE5"% 7 )\xFD\xE6 3\xFD\xE5 !\xFD\xE4"3\xFD\xE5\xFD\xF9 \xFD\xB7 = &\xFD\xE5"5 > )\xFD\xE6 C\xFD\xE5 -\xFD\xE4"6\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!7 O K\xFD\xE5"8 N R\xFD\xE5 '\xFD\xE6 ,\xFD\xE5"&\xFD\xE4\xFD\xF9 \xFD\xB7 I /\xFD\xE5"/ G S\xFD\xE5 '\xFD\xE6  \xFD\xE5"'\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r X .\xFD\xE5". H )\xFD\xE6 L\xFD\xE5 &\xFD\xE4"9\xFD\xE5\xFD\xF9 \xFD\xB7 V (\xFD\xE5"( M )\xFD\xE6 0\xFD\xE5 '\xFD\xE4")\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!0 7 0\xFD\r\0\b
\f!0  j 0\xFD[\0\0\0 % 3\xFD\xE4\xFD\xF9 \xFD\xB7 5 6\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 2 !\xFD\xE5\xFD\xF9 \xFD\xB7 4 -\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!! . 9\xFD\xE4\xFD\xF9 \xFD\xB7 ( )\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r 8 &\xFD\xE5\xFD\xF9 \xFD\xB7 / '\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!' ! '\xFD\r\0\b
\f!'  j '\xFD[\0\0\0 : "\xFD\xE5\xFD\xF9 \xFD\xB7 < $\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r A +\xFD\xE5\xFD\xF9 \xFD\xB7 @ #\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!' U ,\xFD\xE5\xFD\xF9 \xFD\xB7 F  \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r Z 1\xFD\xE5\xFD\xF9 \xFD\xB7 J *\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!  '  \xFD\r\0\b
\f!'  j '\xFD[\0\0\0 A\bj! A\x80\bj! Aj!\f\0\v\v\v\xDAJ\x7F{}W{ A \x1B (\0Avj! \0("(\b tAv" ("Ajl!  Ajl!  A\rjl!  A\fjl!  A\vjl!\x1B  A
jl!  A	jl!  A\bjl!  A\x07jl!  Ajl!   Ajl!!  Ajl!"  Ajl!#  Ajl!$  Ajl!%  l!A\x7F / tA\x7FsA\xFF\xFFq\xFD!& \0(\0*\x9C!'A\0!@@  O\r  \xFD\0 \xFD\xE6"(  \xFD\0\xE0\xFD\xE6")\xFD\xE4"*  \xFD\0\xA0\xFD\xE6"+ 
 \xFD\0\`\xFD\xE6",\xFD\xE4"-\xFD\xE4". \b \xFD\0@\xFD\xE6"/  \xFD\0\xC0\xFD\xE6"0\xFD\xE4"1 \f \xFD\0\x80\xFD\xE6"2  \xFD\0\0\xFD\xE6"3 ' 3\xFD\0\x92\xFD \0"3\xFD\xE4"4\xFD\xE4"5\xFD\xE4"6 / 0\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"/\xFD\xE6 1\xFD\xE5"0 3 2\xFD\xE5"2\xFD\xE4"7 + ,\xFD\xE5", ( )\xFD\xE5"+\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"(\xFD\xE6"3 +\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?")\xFD\xE6\xFD\xE4 .\xFD\xE5"+\xFD\xE4"8\xFD\r\0\x07"9 2 0\xFD\xE5": * -\xFD\xE5 /\xFD\xE6 +\xFD\xE5"*\xFD\xE4"; 4 1\xFD\xE5"4 ,\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"1\xFD\xE6 3\xFD\xE5 *\xFD\xE4"<\xFD\xE5"3\xFD\r\0\x07"=\xFD\r\0\x07"> \x07 \xFD\00\xFD\xE6"0  \xFD\0\xF0\xFD\xE6"2\xFD\xE4"?  \xFD\0\xB0\xFD\xE6"@ \v \xFD\0p\xFD\xE6"A\xFD\xE4"B\xFD\xE4", 	 \xFD\0P\xFD\xE6"C  \xFD\0\xD0\xFD\xE6"D\xFD\xE4"- \r \xFD\0\x90\xFD\xE6"E  \xFD\0\xFD\xE6"F\xFD\xE4"G\xFD\xE4"H\xFD\xE4"I C D\xFD\xE5 /\xFD\xE6 -\xFD\xE5"C F E\xFD\xE5"D\xFD\xE4"E @ A\xFD\xE5"@ 0 2\xFD\xE5"0\xFD\xE5 (\xFD\xE6"A 0 )\xFD\xE6\xFD\xE4 ,\xFD\xE5"0\xFD\xE4"F\xFD\r\0\x07"J D C\xFD\xE5"C ? B\xFD\xE5 /\xFD\xE6 0\xFD\xE5"2\xFD\xE4"? G -\xFD\xE5"B @ 1\xFD\xE6 A\xFD\xE5 2\xFD\xE4"@\xFD\xE5"-\xFD\r\0\x07"A\xFD\r\0\x07"D\xFD\xE4"G 6 8\xFD\r\b	
\v\x1B\f\r"6 ; 3\xFD\r\b	
\v\x1B\f\r"3\xFD\r\0\x07"8 I F\xFD\r\b	
\v\x1B\f\r"; ? -\xFD\r\b	
\v\x1B\f\r"?\xFD\r\0\x07"F\xFD\xE4"-\xFD\xE4"I 9 =\xFD\r\b	
\v\f\r\x1B"9 ; ?\xFD\r\b	
\v\f\r\x1B";\xFD\xE4"= J A\xFD\r\b	
\v\f\r\x1B"? 6 3\xFD\r\b	
\v\f\r\x1B"6\xFD\xE4"A\xFD\xE4"3\xFD\xE4\xFD\xF9 &\xFD\xB7 4 <\xFD\xE4"4 : *\xFD\xE5"*\xFD\r\0\x07": 7 +\xFD\xE5"+ 5 .\xFD\xE5".\xFD\r\0\x07"5\xFD\r\0\x07"7 B @\xFD\xE4"< C 2\xFD\xE5"2\xFD\r\0\x07"@ E 0\xFD\xE5"0 H ,\xFD\xE5",\xFD\r\0\x07"B\xFD\r\0\x07"C\xFD\xE4"E 4 *\xFD\r\b	
\v\x1B\f\r"* + .\xFD\r\b	
\v\x1B\f\r"+\xFD\r\0\x07"4 < 2\xFD\r\b	
\v\x1B\f\r"2 0 ,\xFD\r\b	
\v\x1B\f\r",\xFD\r\0\x07"0\xFD\xE4".\xFD\xE4"< : 5\xFD\r\b	
\v\f\r\x1B"5 2 ,\xFD\r\b	
\v\f\r\x1B",\xFD\xE4": @ B\xFD\r\b	
\v\f\r\x1B"2 * +\xFD\r\b	
\v\f\r\x1B"@\xFD\xE4"B\xFD\xE4"+\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r > D\xFD\xE5"> 8 F\xFD\xE5 /\xFD\xE6 -\xFD\xE5"D\xFD\xE4"F ? 6\xFD\xE5"? 9 ;\xFD\xE5"*\xFD\xE5 (\xFD\xE6"; * )\xFD\xE6\xFD\xE4 3\xFD\xE5"*\xFD\xE4\xFD\xF9 &\xFD\xB7 7 C\xFD\xE5"C 4 0\xFD\xE5 /\xFD\xE6 .\xFD\xE5"H\xFD\xE4"J 2 @\xFD\xE5"@ 5 ,\xFD\xE5",\xFD\xE5 (\xFD\xE6"K , )\xFD\xE6\xFD\xE4 +\xFD\xE5",\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!L  A\xA0j\xFD\0\0\xFD\xE6"4  A\xE0j\xFD\0\0\xFD\xE6"5\xFD\xE4"6  A\xA0j\xFD\0\0\xFD\xE6"7 
 A\xE0j\xFD\0\0\xFD\xE6"8\xFD\xE4"9\xFD\xE4"0 \b A\xC0j\xFD\0\0\xFD\xE6"M  A\xC0j\xFD\0\0\xFD\xE6"N\xFD\xE4"2 \f A\x80j\xFD\0\0\xFD\xE6"O  A\x80j\xFD\0\0\xFD\xE6"P ' P\xFD\0\x92\xFD \0"P\xFD\xE4"Q\xFD\xE4"R\xFD\xE4"S M N\xFD\xE5 /\xFD\xE6 2\xFD\xE5"M P O\xFD\xE5"N\xFD\xE4"O 7 8\xFD\xE5"7 4 5\xFD\xE5"4\xFD\xE5 (\xFD\xE6"8 4 )\xFD\xE6\xFD\xE4 0\xFD\xE5"4\xFD\xE4"P\xFD\r\0\x07"T N M\xFD\xE5"M 6 9\xFD\xE5 /\xFD\xE6 4\xFD\xE5"5\xFD\xE4"9 Q 2\xFD\xE5"N 7 1\xFD\xE6 8\xFD\xE5 5\xFD\xE4"Q\xFD\xE5"U\xFD\r\0\x07"V\xFD\r\0\x07"W \x07 A\xB0j\xFD\0\0\xFD\xE6"7  A\xF0j\xFD\0\0\xFD\xE6"8\xFD\xE4"X  A\xB0j\xFD\0\0\xFD\xE6"Y \v A\xF0j\xFD\0\0\xFD\xE6"Z\xFD\xE4"[\xFD\xE4"2 	 A\xD0j\xFD\0\0\xFD\xE6"\\  A\xD0j\xFD\0\0\xFD\xE6"]\xFD\xE4"6 \r A\x90j\xFD\0\0\xFD\xE6"^  A\x90j\xFD\0\0\xFD\xE6"_\xFD\xE4"\`\xFD\xE4"a\xFD\xE4"b \\ ]\xFD\xE5 /\xFD\xE6 6\xFD\xE5"\\ _ ^\xFD\xE5"]\xFD\xE4"^ Y Z\xFD\xE5"Y 7 8\xFD\xE5"7\xFD\xE5 (\xFD\xE6"Z 7 )\xFD\xE6\xFD\xE4 2\xFD\xE5"7\xFD\xE4"_\xFD\r\0\x07"c ] \\\xFD\xE5"\\ X [\xFD\xE5 /\xFD\xE6 7\xFD\xE5"8\xFD\xE4"X \` 6\xFD\xE5"[ Y 1\xFD\xE6 Z\xFD\xE5 8\xFD\xE4"Y\xFD\xE5"6\xFD\r\0\x07"Z\xFD\r\0\x07"]\xFD\xE4"\` S P\xFD\r\b	
\v\x1B\f\r"P 9 U\xFD\r\b	
\v\x1B\f\r"9\xFD\r\0\x07"S b _\xFD\r\b	
\v\x1B\f\r"U X 6\xFD\r\b	
\v\x1B\f\r"X\xFD\r\0\x07"_\xFD\xE4"6\xFD\xE4"b T V\xFD\r\b	
\v\f\r\x1B"T U X\xFD\r\b	
\v\f\r\x1B"U\xFD\xE4"V c Z\xFD\r\b	
\v\f\r\x1B"X P 9\xFD\r\b	
\v\f\r\x1B"P\xFD\xE4"Z\xFD\xE4"9\xFD\xE4\xFD\xF9 &\xFD\xB7 N Q\xFD\xE4"N M 5\xFD\xE5"5\xFD\r\0\x07"M O 4\xFD\xE5"4 R 0\xFD\xE5"0\xFD\r\0\x07"O\xFD\r\0\x07"Q [ Y\xFD\xE4"R \\ 8\xFD\xE5"8\xFD\r\0\x07"Y ^ 7\xFD\xE5"7 a 2\xFD\xE5"2\xFD\r\0\x07"[\xFD\r\0\x07"\\\xFD\xE4"^ N 5\xFD\r\b	
\v\x1B\f\r"5 4 0\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"N R 8\xFD\r\b	
\v\x1B\f\r"8 7 2\xFD\r\b	
\v\x1B\f\r"2\xFD\r\0\x07"7\xFD\xE4"0\xFD\xE4"R M O\xFD\r\b	
\v\f\r\x1B"M 8 2\xFD\r\b	
\v\f\r\x1B"8\xFD\xE4"O Y [\xFD\r\b	
\v\f\r\x1B"Y 5 4\xFD\r\b	
\v\f\r\x1B"5\xFD\xE4"[\xFD\xE4"2\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r W ]\xFD\xE5"W S _\xFD\xE5 /\xFD\xE6 6\xFD\xE5"S\xFD\xE4"] X P\xFD\xE5"P T U\xFD\xE5"4\xFD\xE5 (\xFD\xE6"T 4 )\xFD\xE6\xFD\xE4 9\xFD\xE5"4\xFD\xE4\xFD\xF9 &\xFD\xB7 Q \\\xFD\xE5"Q N 7\xFD\xE5 /\xFD\xE6 0\xFD\xE5"N\xFD\xE4"U Y 5\xFD\xE5"X M 8\xFD\xE5"5\xFD\xE5 (\xFD\xE6"M 5 )\xFD\xE6\xFD\xE4 2\xFD\xE5"5\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!7 A\xF0\x07j\xFD\0\0!Y A\xB0j\xFD\0\0!\\ A\xB0\x07j\xFD\0\0!_ A\xF0j\xFD\0\0!a A\xD0\x07j\xFD\0\0!c A\xD0j\xFD\0\0!d A\x90\x07j\xFD\0\0!e A\x90j\xFD\0\0!f A\xE0\x07j\xFD\0\0!g A\xA0j\xFD\0\0!h A\xA0\x07j\xFD\0\0!i A\xE0j\xFD\0\0!j A\xC0\x07j\xFD\0\0!k A\xC0j\xFD\0\0!l A\x80\x07j\xFD\0\0!m A\x80j\xFD\0\0!n A\xF0j\xFD\0\0!o A\xB0j\xFD\0\0!p A\xB0j\xFD\0\0!q A\xF0j\xFD\0\0!r A\xD0j\xFD\0\0!s A\xD0j\xFD\0\0!t A\x90j\xFD\0\0!u A\x90j\xFD\0\0!v A\xE0j\xFD\0\0!w A\xA0j\xFD\0\0!x A\xA0j\xFD\0\0!y A\xE0j\xFD\0\0!z A\xC0j\xFD\0\0!{ A\xC0j\xFD\0\0!| A\x80j\xFD\0\0!} A\x80j\xFD\0\0!~ L 7\xFD\r\0\b
\f!7  j 7\xFD[\0\0\0  %j 7\xFD[\0\0 > D\xFD\xE5"> = A\xFD\xE5 /\xFD\xE6 *\xFD\xE5"7\xFD\xE4\xFD\xF9 &\xFD\xB7 C H\xFD\xE5"= : B\xFD\xE5 /\xFD\xE6 ,\xFD\xE5"8\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r G -\xFD\xE5": ? 1\xFD\xE6 ;\xFD\xE5 7\xFD\xE4";\xFD\xE5\xFD\xF9 &\xFD\xB7 E .\xFD\xE5"? @ 1\xFD\xE6 K\xFD\xE5 8\xFD\xE4"@\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!A W S\xFD\xE5"B V Z\xFD\xE5 /\xFD\xE6 4\xFD\xE5".\xFD\xE4\xFD\xF9 &\xFD\xB7 Q N\xFD\xE5"C O [\xFD\xE5 /\xFD\xE6 5\xFD\xE5"-\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r \` 6\xFD\xE5"6 P 1\xFD\xE6 T\xFD\xE5 .\xFD\xE4"D\xFD\xE5\xFD\xF9 &\xFD\xB7 ^ 0\xFD\xE5"E X 1\xFD\xE6 M\xFD\xE5 -\xFD\xE4"G\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!0 A 0\xFD\r\0\b
\f!0  $j 0\xFD[\0\0\0  #j 0\xFD[\0\0 : ;\xFD\xE4\xFD\xF9 &\xFD\xB7 ? @\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r > 7\xFD\xE5\xFD\xF9 &\xFD\xB7 = 8\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!0 6 D\xFD\xE4\xFD\xF9 &\xFD\xB7 E G\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r B .\xFD\xE5\xFD\xF9 &\xFD\xB7 C -\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!. 0 .\xFD\r\0\b
\f!.  "j .\xFD[\0\0\0  !j .\xFD[\0\0 F *\xFD\xE5\xFD\xF9 &\xFD\xB7 J ,\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r I 3\xFD\xE5\xFD\xF9 &\xFD\xB7 < +\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!. ] 4\xFD\xE5\xFD\xF9 &\xFD\xB7 U 5\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r b 9\xFD\xE5\xFD\xF9 &\xFD\xB7 R 2\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!+ . +\xFD\r\0\b
\f!.   j .\xFD[\0\0\0  j .\xFD[\0\0  x\xFD\xE6"*  w\xFD\xE6",\xFD\xE4"-  y\xFD\xE6"0 
 z\xFD\xE6"2\xFD\xE4"3\xFD\xE4". \b |\xFD\xE6"4  {\xFD\xE6"5\xFD\xE4"+ \f }\xFD\xE6"6  ~\xFD\xE6"7 ' 7\xFD\0\x92\xFD \0"7\xFD\xE4"8\xFD\xE4"9\xFD\xE4": 4 5\xFD\xE5 /\xFD\xE6 +\xFD\xE5"4 7 6\xFD\xE5"5\xFD\xE4"6 0 2\xFD\xE5"0 * ,\xFD\xE5"*\xFD\xE5 (\xFD\xE6"2 * )\xFD\xE6\xFD\xE4 .\xFD\xE5"*\xFD\xE4"7\xFD\r\0\x07"; 5 4\xFD\xE5"4 - 3\xFD\xE5 /\xFD\xE6 *\xFD\xE5",\xFD\xE4"3 8 +\xFD\xE5"5 0 1\xFD\xE6 2\xFD\xE5 ,\xFD\xE4"8\xFD\xE5"<\xFD\r\0\x07"=\xFD\r\0\x07"> \x07 p\xFD\xE6"0  o\xFD\xE6"2\xFD\xE4"?  q\xFD\xE6"@ \v r\xFD\xE6"A\xFD\xE4"B\xFD\xE4"+ 	 t\xFD\xE6"C  s\xFD\xE6"D\xFD\xE4"- \r u\xFD\xE6"E  v\xFD\xE6"F\xFD\xE4"G\xFD\xE4"H\xFD\xE4"I C D\xFD\xE5 /\xFD\xE6 -\xFD\xE5"C F E\xFD\xE5"D\xFD\xE4"E @ A\xFD\xE5"@ 0 2\xFD\xE5"0\xFD\xE5 (\xFD\xE6"A 0 )\xFD\xE6\xFD\xE4 +\xFD\xE5"0\xFD\xE4"F\xFD\r\0\x07"J D C\xFD\xE5"C ? B\xFD\xE5 /\xFD\xE6 0\xFD\xE5"2\xFD\xE4"? G -\xFD\xE5"B @ 1\xFD\xE6 A\xFD\xE5 2\xFD\xE4"@\xFD\xE5"-\xFD\r\0\x07"A\xFD\r\0\x07"D\xFD\xE4"G : 7\xFD\r\b	
\v\x1B\f\r"7 3 <\xFD\r\b	
\v\x1B\f\r"3\xFD\r\0\x07": I F\xFD\r\b	
\v\x1B\f\r"< ? -\xFD\r\b	
\v\x1B\f\r"?\xFD\r\0\x07"F\xFD\xE4"-\xFD\xE4"I ; =\xFD\r\b	
\v\f\r\x1B"; < ?\xFD\r\b	
\v\f\r\x1B"<\xFD\xE4"= J A\xFD\r\b	
\v\f\r\x1B"? 7 3\xFD\r\b	
\v\f\r\x1B"7\xFD\xE4"A\xFD\xE4"3\xFD\xE4\xFD\xF9 &\xFD\xB7 5 8\xFD\xE4"5 4 ,\xFD\xE5",\xFD\r\0\x07"4 6 *\xFD\xE5"* 9 .\xFD\xE5".\xFD\r\0\x07"6\xFD\r\0\x07"8 B @\xFD\xE4"9 C 2\xFD\xE5"2\xFD\r\0\x07"@ E 0\xFD\xE5"0 H +\xFD\xE5"+\xFD\r\0\x07"B\xFD\r\0\x07"C\xFD\xE4"E 5 ,\xFD\r\b	
\v\x1B\f\r", * .\xFD\r\b	
\v\x1B\f\r"*\xFD\r\0\x07"5 9 2\xFD\r\b	
\v\x1B\f\r"2 0 +\xFD\r\b	
\v\x1B\f\r"+\xFD\r\0\x07"0\xFD\xE4".\xFD\xE4"H 4 6\xFD\r\b	
\v\f\r\x1B"4 2 +\xFD\r\b	
\v\f\r\x1B"2\xFD\xE4"J @ B\xFD\r\b	
\v\f\r\x1B"6 , *\xFD\r\b	
\v\f\r\x1B",\xFD\xE4"@\xFD\xE4"+\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r > D\xFD\xE5"> : F\xFD\xE5 /\xFD\xE6 -\xFD\xE5":\xFD\xE4"B ? 7\xFD\xE5"? ; <\xFD\xE5"*\xFD\xE5 (\xFD\xE6"; * )\xFD\xE6\xFD\xE4 3\xFD\xE5"*\xFD\xE4\xFD\xF9 &\xFD\xB7 8 C\xFD\xE5"< 5 0\xFD\xE5 /\xFD\xE6 .\xFD\xE5"C\xFD\xE4"D 6 ,\xFD\xE5"F 4 2\xFD\xE5",\xFD\xE5 (\xFD\xE6"K , )\xFD\xE6\xFD\xE4 +\xFD\xE5",\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!L  h\xFD\xE6"4  g\xFD\xE6"5\xFD\xE4"6  i\xFD\xE6"7 
 j\xFD\xE6"8\xFD\xE4"9\xFD\xE4"0 \b l\xFD\xE6"M  k\xFD\xE6"N\xFD\xE4"2 \f m\xFD\xE6"O  n\xFD\xE6"P ' P\xFD\0\x92\xFD \0"P\xFD\xE4"Q\xFD\xE4"R\xFD\xE4"S M N\xFD\xE5 /\xFD\xE6 2\xFD\xE5"M P O\xFD\xE5"N\xFD\xE4"O 7 8\xFD\xE5"7 4 5\xFD\xE5"4\xFD\xE5 (\xFD\xE6"8 4 )\xFD\xE6\xFD\xE4 0\xFD\xE5"4\xFD\xE4"P\xFD\r\0\x07"T N M\xFD\xE5"M 6 9\xFD\xE5 /\xFD\xE6 4\xFD\xE5"5\xFD\xE4"9 Q 2\xFD\xE5"N 7 1\xFD\xE6 8\xFD\xE5 5\xFD\xE4"Q\xFD\xE5"U\xFD\r\0\x07"V\xFD\r\0\x07"W \x07 \\\xFD\xE6"7  Y\xFD\xE6"8\xFD\xE4"X  _\xFD\xE6"Y \v a\xFD\xE6"Z\xFD\xE4"[\xFD\xE4"2 	 d\xFD\xE6"\\  c\xFD\xE6"]\xFD\xE4"6 \r e\xFD\xE6"^  f\xFD\xE6"_\xFD\xE4"\`\xFD\xE4"a\xFD\xE4"b \\ ]\xFD\xE5 /\xFD\xE6 6\xFD\xE5"\\ _ ^\xFD\xE5"]\xFD\xE4"^ Y Z\xFD\xE5"Y 7 8\xFD\xE5"7\xFD\xE5 (\xFD\xE6"Z 7 )\xFD\xE6\xFD\xE4 2\xFD\xE5"7\xFD\xE4"_\xFD\r\0\x07"c ] \\\xFD\xE5"\\ X [\xFD\xE5 /\xFD\xE6 7\xFD\xE5"8\xFD\xE4"X \` 6\xFD\xE5"[ Y 1\xFD\xE6 Z\xFD\xE5 8\xFD\xE4"Y\xFD\xE5"6\xFD\r\0\x07"Z\xFD\r\0\x07"]\xFD\xE4"\` S P\xFD\r\b	
\v\x1B\f\r"P 9 U\xFD\r\b	
\v\x1B\f\r"9\xFD\r\0\x07"S b _\xFD\r\b	
\v\x1B\f\r"U X 6\xFD\r\b	
\v\x1B\f\r"X\xFD\r\0\x07"_\xFD\xE4"6\xFD\xE4"b T V\xFD\r\b	
\v\f\r\x1B"T U X\xFD\r\b	
\v\f\r\x1B"U\xFD\xE4"V c Z\xFD\r\b	
\v\f\r\x1B"X P 9\xFD\r\b	
\v\f\r\x1B"P\xFD\xE4"Z\xFD\xE4"9\xFD\xE4\xFD\xF9 &\xFD\xB7 N Q\xFD\xE4"N M 5\xFD\xE5"5\xFD\r\0\x07"M O 4\xFD\xE5"4 R 0\xFD\xE5"0\xFD\r\0\x07"O\xFD\r\0\x07"Q [ Y\xFD\xE4"R \\ 8\xFD\xE5"8\xFD\r\0\x07"Y ^ 7\xFD\xE5"7 a 2\xFD\xE5"2\xFD\r\0\x07"[\xFD\r\0\x07"\\\xFD\xE4"^ N 5\xFD\r\b	
\v\x1B\f\r"5 4 0\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"N R 8\xFD\r\b	
\v\x1B\f\r"8 7 2\xFD\r\b	
\v\x1B\f\r"2\xFD\r\0\x07"7\xFD\xE4"0\xFD\xE4"R M O\xFD\r\b	
\v\f\r\x1B"M 8 2\xFD\r\b	
\v\f\r\x1B"8\xFD\xE4"O Y [\xFD\r\b	
\v\f\r\x1B"Y 5 4\xFD\r\b	
\v\f\r\x1B"5\xFD\xE4"[\xFD\xE4"2\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r W ]\xFD\xE5"W S _\xFD\xE5 /\xFD\xE6 6\xFD\xE5"S\xFD\xE4"] X P\xFD\xE5"P T U\xFD\xE5"4\xFD\xE5 (\xFD\xE6"T 4 )\xFD\xE6\xFD\xE4 9\xFD\xE5"4\xFD\xE4\xFD\xF9 &\xFD\xB7 Q \\\xFD\xE5"Q N 7\xFD\xE5 /\xFD\xE6 0\xFD\xE5"7\xFD\xE4"N Y 5\xFD\xE5"U M 8\xFD\xE5"5\xFD\xE5 (\xFD\xE6"8 5 )\xFD\xE6\xFD\xE4 2\xFD\xE5"(\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!) L )\xFD\r\0\b
\f!)  j )\xFD[\0\0\0  j )\xFD[\0\0 > :\xFD\xE5": = A\xFD\xE5 /\xFD\xE6 *\xFD\xE5")\xFD\xE4\xFD\xF9 &\xFD\xB7 < C\xFD\xE5"< J @\xFD\xE5 /\xFD\xE6 ,\xFD\xE5"5\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r G -\xFD\xE5"- ? 1\xFD\xE6 ;\xFD\xE5 )\xFD\xE4";\xFD\xE5\xFD\xF9 &\xFD\xB7 E .\xFD\xE5"= F 1\xFD\xE6 K\xFD\xE5 5\xFD\xE4">\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!? W S\xFD\xE5"@ V Z\xFD\xE5 /\xFD\xE6 4\xFD\xE5".\xFD\xE4\xFD\xF9 &\xFD\xB7 Q 7\xFD\xE5"7 O [\xFD\xE5 /\xFD\xE6 (\xFD\xE5"/\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r \` 6\xFD\xE5"6 P 1\xFD\xE6 T\xFD\xE5 .\xFD\xE4"A\xFD\xE5\xFD\xF9 &\xFD\xB7 ^ 0\xFD\xE5"0 U 1\xFD\xE6 8\xFD\xE5 /\xFD\xE4"8\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!1 ? 1\xFD\r\0\b
\f!1  j 1\xFD[\0\0\0  \x1Bj 1\xFD[\0\0 - ;\xFD\xE4\xFD\xF9 &\xFD\xB7 = >\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r : )\xFD\xE5\xFD\xF9 &\xFD\xB7 < 5\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!) 6 A\xFD\xE4\xFD\xF9 &\xFD\xB7 0 8\xFD\xE4\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r @ .\xFD\xE5\xFD\xF9 &\xFD\xB7 7 /\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!/ ) /\xFD\r\0\b
\f!/  j /\xFD[\0\0\0  j /\xFD[\0\0 B *\xFD\xE5\xFD\xF9 &\xFD\xB7 D ,\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r I 3\xFD\xE5\xFD\xF9 &\xFD\xB7 H +\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!/ ] 4\xFD\xE5\xFD\xF9 &\xFD\xB7 N (\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r b 9\xFD\xE5\xFD\xF9 &\xFD\xB7 R 2\xFD\xE5\xFD\xF9 &\xFD\xB7\xFD\r\0\b	\f\r\xFD\r\0\b
\f!( / (\xFD\r\0\b
\f!/  j /\xFD[\0\0\0  j /\xFD[\0\0 A\bj! A\x80\bj! Aj!\f\0\v\v\v\xA5?\b\x7F{}Z{ A \x1B" \0("(\b tAv" (Av"A\x07jlAtj!   AjlAtj!   AjlAtj!   AjlAtj!\x1B   AjlAtj!   AjlAtj!   AjlAtj!   lAtj! (\0A~q!A\x7F / tA\x7FsA\xFF\xFFq\xFD! \0(\0*\x9C! A\0!@@  O\r  \xFD\0 \xFD\xE6"!  \xFD\0\xE0\xFD\xE6""\xFD\xE4"#  \xFD\0\xA0\xFD\xE6"$ 
 \xFD\0\`\xFD\xE6"%\xFD\xE4"&\xFD\xE4"' \b \xFD\0@\xFD\xE6"(  \xFD\0\xC0\xFD\xE6")\xFD\xE4"* \f \xFD\0\x80\xFD\xE6"+  \xFD\0\0\xFD\xE6",   ,\xFD\0\x92\xFD \0",\xFD\xE4"-\xFD\xE4".\xFD\xE4"/ ( )\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"(\xFD\xE6 *\xFD\xE5") , +\xFD\xE5"+\xFD\xE4", $ %\xFD\xE5"% ! "\xFD\xE5"$\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"!\xFD\xE6"0 $\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?""\xFD\xE6\xFD\xE4 '\xFD\xE5"$\xFD\xE4"1\xFD\r\0\x07"2 + )\xFD\xE5"3 # &\xFD\xE5 (\xFD\xE6 $\xFD\xE5"#\xFD\xE4"4 - *\xFD\xE5"- %\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"*\xFD\xE6 0\xFD\xE5 #\xFD\xE4"0\xFD\xE5"5\xFD\r\0\x07"6\xFD\r\0\x07"7 \x07 \xFD\00\xFD\xE6")  \xFD\0\xF0\xFD\xE6"+\xFD\xE4"8  \xFD\0\xB0\xFD\xE6"9 \v \xFD\0p\xFD\xE6":\xFD\xE4";\xFD\xE4"% 	 \xFD\0P\xFD\xE6"<  \xFD\0\xD0\xFD\xE6"=\xFD\xE4"& \r \xFD\0\x90\xFD\xE6">  \xFD\0\xFD\xE6"?\xFD\xE4"@\xFD\xE4"A\xFD\xE4"B < =\xFD\xE5 (\xFD\xE6 &\xFD\xE5"< ? >\xFD\xE5"=\xFD\xE4"> 9 :\xFD\xE5"9 ) +\xFD\xE5")\xFD\xE5 !\xFD\xE6": ) "\xFD\xE6\xFD\xE4 %\xFD\xE5")\xFD\xE4"?\xFD\r\0\x07"C = <\xFD\xE5"< 8 ;\xFD\xE5 (\xFD\xE6 )\xFD\xE5"+\xFD\xE4"8 @ &\xFD\xE5"; 9 *\xFD\xE6 :\xFD\xE5 +\xFD\xE4"9\xFD\xE5"&\xFD\r\0\x07":\xFD\r\0\x07"=\xFD\xE4"@ / 1\xFD\r\b	
\v\x1B\f\r"/ 4 5\xFD\r\b	
\v\x1B\f\r"1\xFD\r\0\x07"4 B ?\xFD\r\b	
\v\x1B\f\r"5 8 &\xFD\r\b	
\v\x1B\f\r"8\xFD\r\0\x07"?\xFD\xE4"&\xFD\xE4 2 6\xFD\r\b	
\v\f\r\x1B"2 5 8\xFD\r\b	
\v\f\r\x1B"5\xFD\xE4"6 C :\xFD\r\b	
\v\f\r\x1B"8 / 1\xFD\r\b	
\v\f\r\x1B"/\xFD\xE4"1\xFD\xE4":\xFD\xE4\xFD\xF9 \xFD\xB7 - 0\xFD\xE4"- 3 #\xFD\xE5"#\xFD\r\0\x07"0 , $\xFD\xE5"$ . '\xFD\xE5"'\xFD\r\0\x07",\xFD\r\0\x07". ; 9\xFD\xE4"3 < +\xFD\xE5"+\xFD\r\0\x07"9 > )\xFD\xE5") A %\xFD\xE5"%\xFD\r\0\x07";\xFD\r\0\x07"<\xFD\xE4"> - #\xFD\r\b	
\v\x1B\f\r"# $ '\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07"A 3 +\xFD\r\b	
\v\x1B\f\r"+ ) %\xFD\r\b	
\v\x1B\f\r"%\xFD\r\0\x07"3\xFD\xE4"'\xFD\xE4 0 ,\xFD\r\b	
\v\f\r\x1B"0 + %\xFD\r\b	
\v\f\r\x1B"B\xFD\xE4"C 9 ;\xFD\r\b	
\v\f\r\x1B"9 # $\xFD\r\b	
\v\f\r\x1B";\xFD\xE4"D\xFD\xE4"E\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!F  A\xA0j\xFD\0\0\xFD\xE6"%  A\xE0j\xFD\0\0\xFD\xE6")\xFD\xE4"+  A\xA0j\xFD\0\0\xFD\xE6", 
 A\xE0j\xFD\0\0\xFD\xE6"-\xFD\xE4"G\xFD\xE4"$ \b A\xC0j\xFD\0\0\xFD\xE6"H  A\xC0j\xFD\0\0\xFD\xE6"I\xFD\xE4"# \f A\x80j\xFD\0\0\xFD\xE6"J  A\x80j\xFD\0\0\xFD\xE6"K   K\xFD\0\x92\xFD \0"K\xFD\xE4"L\xFD\xE4"M\xFD\xE4"N H I\xFD\xE5 (\xFD\xE6 #\xFD\xE5"H K J\xFD\xE5"I\xFD\xE4"J , -\xFD\xE5", % )\xFD\xE5"%\xFD\xE5 !\xFD\xE6"- % "\xFD\xE6\xFD\xE4 $\xFD\xE5"%\xFD\xE4"K\xFD\r\0\x07"O I H\xFD\xE5"H + G\xFD\xE5 (\xFD\xE6 %\xFD\xE5")\xFD\xE4"G L #\xFD\xE5"I , *\xFD\xE6 -\xFD\xE5 )\xFD\xE4"L\xFD\xE5"P\xFD\r\0\x07"Q\xFD\r\0\x07"R \x07 A\xB0j\xFD\0\0\xFD\xE6",  A\xF0j\xFD\0\0\xFD\xE6"-\xFD\xE4"S  A\xB0j\xFD\0\0\xFD\xE6"T \v A\xF0j\xFD\0\0\xFD\xE6"U\xFD\xE4"V\xFD\xE4"# 	 A\xD0j\xFD\0\0\xFD\xE6"W  A\xD0j\xFD\0\0\xFD\xE6"X\xFD\xE4"+ \r A\x90j\xFD\0\0\xFD\xE6"Y  A\x90j\xFD\0\0\xFD\xE6"Z\xFD\xE4"[\xFD\xE4"\\\xFD\xE4"] W X\xFD\xE5 (\xFD\xE6 +\xFD\xE5"W Z Y\xFD\xE5"X\xFD\xE4"Y T U\xFD\xE5"T , -\xFD\xE5",\xFD\xE5 !\xFD\xE6"U , "\xFD\xE6\xFD\xE4 #\xFD\xE5",\xFD\xE4"Z\xFD\r\0\x07"^ X W\xFD\xE5"W S V\xFD\xE5 (\xFD\xE6 ,\xFD\xE5"-\xFD\xE4"S [ +\xFD\xE5"V T *\xFD\xE6 U\xFD\xE5 -\xFD\xE4"T\xFD\xE5"+\xFD\r\0\x07"U\xFD\r\0\x07"X\xFD\xE4"[ N K\xFD\r\b	
\v\x1B\f\r"K G P\xFD\r\b	
\v\x1B\f\r"G\xFD\r\0\x07"N ] Z\xFD\r\b	
\v\x1B\f\r"P S +\xFD\r\b	
\v\x1B\f\r"S\xFD\r\0\x07"Z\xFD\xE4"+\xFD\xE4 O Q\xFD\r\b	
\v\f\r\x1B"O P S\xFD\r\b	
\v\f\r\x1B"P\xFD\xE4"Q ^ U\xFD\r\b	
\v\f\r\x1B"S K G\xFD\r\b	
\v\f\r\x1B"G\xFD\xE4"K\xFD\xE4"U\xFD\xE4\xFD\xF9 \xFD\xB7 I L\xFD\xE4"I H )\xFD\xE5")\xFD\r\0\x07"H J %\xFD\xE5"% M $\xFD\xE5"$\xFD\r\0\x07"J\xFD\r\0\x07"L V T\xFD\xE4"M W -\xFD\xE5"-\xFD\r\0\x07"T Y ,\xFD\xE5", \\ #\xFD\xE5"#\xFD\r\0\x07"V\xFD\r\0\x07"W\xFD\xE4"Y I )\xFD\r\b	
\v\x1B\f\r") % $\xFD\r\b	
\v\x1B\f\r"%\xFD\r\0\x07"I M -\xFD\r\b	
\v\x1B\f\r"- , #\xFD\r\b	
\v\x1B\f\r"#\xFD\r\0\x07",\xFD\xE4"$\xFD\xE4 H J\xFD\r\b	
\v\f\r\x1B"H - #\xFD\r\b	
\v\f\r\x1B"#\xFD\xE4"- T V\xFD\r\b	
\v\f\r\x1B"J ) %\xFD\r\b	
\v\f\r\x1B"%\xFD\xE4")\xFD\xE4"M\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!T A\xF0\x07j\xFD\0\0!V A\xB0j\xFD\0\0!\\ A\xB0\x07j\xFD\0\0!] A\xF0j\xFD\0\0!^ A\xD0\x07j\xFD\0\0!_ A\xD0j\xFD\0\0!\` A\x90\x07j\xFD\0\0!a A\x90j\xFD\0\0!b A\xE0\x07j\xFD\0\0!c A\xA0j\xFD\0\0!d A\xA0\x07j\xFD\0\0!e A\xE0j\xFD\0\0!f A\xC0\x07j\xFD\0\0!g A\xC0j\xFD\0\0!h A\x80\x07j\xFD\0\0!i A\x80j\xFD\0\0!j A\xF0j\xFD\0\0!k A\xB0j\xFD\0\0!l A\xB0j\xFD\0\0!m A\xF0j\xFD\0\0!n A\xD0j\xFD\0\0!o A\xD0j\xFD\0\0!p A\x90j\xFD\0\0!q A\x90j\xFD\0\0!r A\xE0j\xFD\0\0!s A\xA0j\xFD\0\0!t A\xA0j\xFD\0\0!u A\xE0j\xFD\0\0!v A\xC0j\xFD\0\0!w A\xC0j\xFD\0\0!x A\x80j\xFD\0\0!y A\x80j\xFD\0\0!z F T\xFD\r\0\b	\f\r!F  j F\xFD\v\0 7 =\xFD\xE5"7 4 ?\xFD\xE5 (\xFD\xE6 &\xFD\xE5"4\xFD\xE5 6 1\xFD\xE5 (\xFD\xE6 8 /\xFD\xE5"/ 2 5\xFD\xE5"1\xFD\xE5 !\xFD\xE6"2 1 "\xFD\xE6\xFD\xE4 :\xFD\xE5"1\xFD\xE5"5\xFD\xE4\xFD\xF9 \xFD\xB7 . <\xFD\xE5". A 3\xFD\xE5 (\xFD\xE6 '\xFD\xE5"3\xFD\xE5 C D\xFD\xE5 (\xFD\xE6 9 ;\xFD\xE5"6 0 B\xFD\xE5"0\xFD\xE5 !\xFD\xE6"8 0 "\xFD\xE6\xFD\xE4 E\xFD\xE5"0\xFD\xE5"9\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!: R X\xFD\xE5"; N Z\xFD\xE5 (\xFD\xE6 +\xFD\xE5"<\xFD\xE5 Q K\xFD\xE5 (\xFD\xE6 S G\xFD\xE5"= O P\xFD\xE5"?\xFD\xE5 !\xFD\xE6"A ? "\xFD\xE6\xFD\xE4 U\xFD\xE5"?\xFD\xE5"B\xFD\xE4\xFD\xF9 \xFD\xB7 L W\xFD\xE5"C I ,\xFD\xE5 (\xFD\xE6 $\xFD\xE5",\xFD\xE5 - )\xFD\xE5 (\xFD\xE6 J %\xFD\xE5"% H #\xFD\xE5"#\xFD\xE5 !\xFD\xE6") # "\xFD\xE6\xFD\xE4 M\xFD\xE5"#\xFD\xE5"-\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!D : D\xFD\r\0\b	\f\r!:  j :\xFD\v\0 @ &\xFD\xE5 / *\xFD\xE6 2\xFD\xE5 5\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 > '\xFD\xE5 6 *\xFD\xE6 8\xFD\xE5 9\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!' [ +\xFD\xE5 = *\xFD\xE6 A\xFD\xE5 B\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 Y $\xFD\xE5 % *\xFD\xE6 )\xFD\xE5 -\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!$ ' $\xFD\r\0\b	\f\r!'  j '\xFD\v\0 7 4\xFD\xE4 1\xFD\xE5\xFD\xF9 \xFD\xB7 . 3\xFD\xE4 0\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!' ; <\xFD\xE4 ?\xFD\xE5\xFD\xF9 \xFD\xB7 C ,\xFD\xE4 #\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!$ ' $\xFD\r\0\b	\f\r!'  j '\xFD\v\0  t\xFD\xE6"#  s\xFD\xE6"%\xFD\xE4"&  u\xFD\xE6") 
 v\xFD\xE6"+\xFD\xE4",\xFD\xE4"' \b x\xFD\xE6"-  w\xFD\xE6".\xFD\xE4"$ \f y\xFD\xE6"/  z\xFD\xE6"0   0\xFD\0\x92\xFD \0"0\xFD\xE4"1\xFD\xE4"2\xFD\xE4"3 - .\xFD\xE5 (\xFD\xE6 $\xFD\xE5"- 0 /\xFD\xE5".\xFD\xE4"/ ) +\xFD\xE5") # %\xFD\xE5"#\xFD\xE5 !\xFD\xE6"+ # "\xFD\xE6\xFD\xE4 '\xFD\xE5"#\xFD\xE4"0\xFD\r\0\x07"4 . -\xFD\xE5"- & ,\xFD\xE5 (\xFD\xE6 #\xFD\xE5"%\xFD\xE4", 1 $\xFD\xE5". ) *\xFD\xE6 +\xFD\xE5 %\xFD\xE4"1\xFD\xE5"5\xFD\r\0\x07"6\xFD\r\0\x07"7 \x07 l\xFD\xE6")  k\xFD\xE6"+\xFD\xE4"8  m\xFD\xE6"9 \v n\xFD\xE6":\xFD\xE4";\xFD\xE4"$ 	 p\xFD\xE6"<  o\xFD\xE6"=\xFD\xE4"& \r q\xFD\xE6">  r\xFD\xE6"?\xFD\xE4"@\xFD\xE4"A\xFD\xE4"B < =\xFD\xE5 (\xFD\xE6 &\xFD\xE5"< ? >\xFD\xE5"=\xFD\xE4"> 9 :\xFD\xE5"9 ) +\xFD\xE5")\xFD\xE5 !\xFD\xE6": ) "\xFD\xE6\xFD\xE4 $\xFD\xE5")\xFD\xE4"?\xFD\r\0\x07"C = <\xFD\xE5"< 8 ;\xFD\xE5 (\xFD\xE6 )\xFD\xE5"+\xFD\xE4"8 @ &\xFD\xE5"; 9 *\xFD\xE6 :\xFD\xE5 +\xFD\xE4"9\xFD\xE5"&\xFD\r\0\x07":\xFD\r\0\x07"=\xFD\xE4"@ 3 0\xFD\r\b	
\v\x1B\f\r"0 , 5\xFD\r\b	
\v\x1B\f\r",\xFD\r\0\x07"3 B ?\xFD\r\b	
\v\x1B\f\r"5 8 &\xFD\r\b	
\v\x1B\f\r"8\xFD\r\0\x07"?\xFD\xE4"&\xFD\xE4 4 6\xFD\r\b	
\v\f\r\x1B"4 5 8\xFD\r\b	
\v\f\r\x1B"5\xFD\xE4"6 C :\xFD\r\b	
\v\f\r\x1B"8 0 ,\xFD\r\b	
\v\f\r\x1B"0\xFD\xE4":\xFD\xE4"B\xFD\xE4\xFD\xF9 \xFD\xB7 . 1\xFD\xE4", - %\xFD\xE5"%\xFD\r\0\x07"- / #\xFD\xE5"# 2 '\xFD\xE5"'\xFD\r\0\x07".\xFD\r\0\x07"/ ; 9\xFD\xE4"1 < +\xFD\xE5"+\xFD\r\0\x07"2 > )\xFD\xE5") A $\xFD\xE5"$\xFD\r\0\x07"9\xFD\r\0\x07";\xFD\xE4"< , %\xFD\r\b	
\v\x1B\f\r"% # '\xFD\r\b	
\v\x1B\f\r"#\xFD\r\0\x07"> 1 +\xFD\r\b	
\v\x1B\f\r"+ ) $\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07"1\xFD\xE4"'\xFD\xE4 - .\xFD\r\b	
\v\f\r\x1B". + $\xFD\r\b	
\v\f\r\x1B"A\xFD\xE4"C 2 9\xFD\r\b	
\v\f\r\x1B"2 % #\xFD\r\b	
\v\f\r\x1B"9\xFD\xE4"D\xFD\xE4"E\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!F  d\xFD\xE6"%  c\xFD\xE6")\xFD\xE4"+  e\xFD\xE6", 
 f\xFD\xE6"-\xFD\xE4"G\xFD\xE4"$ \b h\xFD\xE6"H  g\xFD\xE6"I\xFD\xE4"# \f i\xFD\xE6"J  j\xFD\xE6"K   K\xFD\0\x92\xFD \0"K\xFD\xE4"L\xFD\xE4"M\xFD\xE4"N H I\xFD\xE5 (\xFD\xE6 #\xFD\xE5"H K J\xFD\xE5"I\xFD\xE4"J , -\xFD\xE5", % )\xFD\xE5"%\xFD\xE5 !\xFD\xE6"- % "\xFD\xE6\xFD\xE4 $\xFD\xE5"%\xFD\xE4"K\xFD\r\0\x07"O I H\xFD\xE5"H + G\xFD\xE5 (\xFD\xE6 %\xFD\xE5")\xFD\xE4"G L #\xFD\xE5"I , *\xFD\xE6 -\xFD\xE5 )\xFD\xE4"L\xFD\xE5"P\xFD\r\0\x07"Q\xFD\r\0\x07"R \x07 \\\xFD\xE6",  V\xFD\xE6"-\xFD\xE4"S  ]\xFD\xE6"T \v ^\xFD\xE6"U\xFD\xE4"V\xFD\xE4"# 	 \`\xFD\xE6"W  _\xFD\xE6"X\xFD\xE4"+ \r a\xFD\xE6"Y  b\xFD\xE6"Z\xFD\xE4"[\xFD\xE4"\\\xFD\xE4"] W X\xFD\xE5 (\xFD\xE6 +\xFD\xE5"W Z Y\xFD\xE5"X\xFD\xE4"Y T U\xFD\xE5"T , -\xFD\xE5",\xFD\xE5 !\xFD\xE6"U , "\xFD\xE6\xFD\xE4 #\xFD\xE5",\xFD\xE4"Z\xFD\r\0\x07"^ X W\xFD\xE5"W S V\xFD\xE5 (\xFD\xE6 ,\xFD\xE5"-\xFD\xE4"S [ +\xFD\xE5"V T *\xFD\xE6 U\xFD\xE5 -\xFD\xE4"T\xFD\xE5"+\xFD\r\0\x07"U\xFD\r\0\x07"X\xFD\xE4"[ N K\xFD\r\b	
\v\x1B\f\r"K G P\xFD\r\b	
\v\x1B\f\r"G\xFD\r\0\x07"N ] Z\xFD\r\b	
\v\x1B\f\r"P S +\xFD\r\b	
\v\x1B\f\r"S\xFD\r\0\x07"Z\xFD\xE4"+\xFD\xE4 O Q\xFD\r\b	
\v\f\r\x1B"O P S\xFD\r\b	
\v\f\r\x1B"P\xFD\xE4"Q ^ U\xFD\r\b	
\v\f\r\x1B"S K G\xFD\r\b	
\v\f\r\x1B"G\xFD\xE4"K\xFD\xE4"U\xFD\xE4\xFD\xF9 \xFD\xB7 I L\xFD\xE4"I H )\xFD\xE5")\xFD\r\0\x07"H J %\xFD\xE5"% M $\xFD\xE5"$\xFD\r\0\x07"J\xFD\r\0\x07"L V T\xFD\xE4"M W -\xFD\xE5"-\xFD\r\0\x07"T Y ,\xFD\xE5", \\ #\xFD\xE5"#\xFD\r\0\x07"V\xFD\r\0\x07"W\xFD\xE4"Y I )\xFD\r\b	
\v\x1B\f\r") % $\xFD\r\b	
\v\x1B\f\r"%\xFD\r\0\x07"I M -\xFD\r\b	
\v\x1B\f\r"- , #\xFD\r\b	
\v\x1B\f\r"#\xFD\r\0\x07",\xFD\xE4"$\xFD\xE4 H J\xFD\r\b	
\v\f\r\x1B"H - #\xFD\r\b	
\v\f\r\x1B"#\xFD\xE4"- T V\xFD\r\b	
\v\f\r\x1B"J ) %\xFD\r\b	
\v\f\r\x1B"%\xFD\xE4")\xFD\xE4"M\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!T F T\xFD\r\0\b	\f\r!F \x1B j F\xFD\v\0 7 =\xFD\xE5"7 3 ?\xFD\xE5 (\xFD\xE6 &\xFD\xE5"3\xFD\xE5 6 :\xFD\xE5 (\xFD\xE6 8 0\xFD\xE5"0 4 5\xFD\xE5"4\xFD\xE5 !\xFD\xE6"5 4 "\xFD\xE6\xFD\xE4 B\xFD\xE5"4\xFD\xE5"6\xFD\xE4\xFD\xF9 \xFD\xB7 / ;\xFD\xE5"/ > 1\xFD\xE5 (\xFD\xE6 '\xFD\xE5"1\xFD\xE5 C D\xFD\xE5 (\xFD\xE6 2 9\xFD\xE5"2 . A\xFD\xE5".\xFD\xE5 !\xFD\xE6"8 . "\xFD\xE6\xFD\xE4 E\xFD\xE5".\xFD\xE5"9\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!: R X\xFD\xE5"; N Z\xFD\xE5 (\xFD\xE6 +\xFD\xE5"=\xFD\xE5 Q K\xFD\xE5 (\xFD\xE6 S G\xFD\xE5"> O P\xFD\xE5"?\xFD\xE5 !\xFD\xE6"A ? "\xFD\xE6\xFD\xE4 U\xFD\xE5"?\xFD\xE5"B\xFD\xE4\xFD\xF9 \xFD\xB7 L W\xFD\xE5"C I ,\xFD\xE5 (\xFD\xE6 $\xFD\xE5",\xFD\xE5 - )\xFD\xE5 (\xFD\xE6 J %\xFD\xE5"( H #\xFD\xE5"#\xFD\xE5 !\xFD\xE6"! # "\xFD\xE6\xFD\xE4 M\xFD\xE5""\xFD\xE5"#\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!% : %\xFD\r\0\b	\f\r!%  j %\xFD\v\0 @ &\xFD\xE5 0 *\xFD\xE6 5\xFD\xE5 6\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 < '\xFD\xE5 2 *\xFD\xE6 8\xFD\xE5 9\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!' [ +\xFD\xE5 > *\xFD\xE6 A\xFD\xE5 B\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 Y $\xFD\xE5 ( *\xFD\xE6 !\xFD\xE5 #\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!( ' (\xFD\r\0\b	\f\r!(  j (\xFD\v\0 7 3\xFD\xE4 4\xFD\xE5\xFD\xF9 \xFD\xB7 / 1\xFD\xE4 .\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!( ; =\xFD\xE4 ?\xFD\xE5\xFD\xF9 \xFD\xB7 C ,\xFD\xE4 "\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!! ( !\xFD\r\0\b	\f\r!(  j (\xFD\v\0 Aj! Aj! Aj! Aj! \x1BAj!\x1B Aj! Aj! Aj! A\x80\bj! Aj!\f\0\v\v\v\x84H\x7F{}\`{ A \x1B" \0("(\b tAv" ("AjlAtj!   AjlAtj!   A\rjlAtj!   A\fjlAtj!\x1B   A\vjlAtj!   A
jlAtj!   A	jlAtj!   A\bjlAtj!   A\x07jlAtj!    AjlAtj!!   AjlAtj!"   AjlAtj!#   AjlAtj!$   AjlAtj!%   AjlAtj!&   lAtj! (\0A~q!A\x7F / tA\x7FsA\xFF\xFFq\xFD!' \0(\0*\x9C!(A\0!@@  O\r  \xFD\0 \xFD\xE6")  \xFD\0\xE0\xFD\xE6"*\xFD\xE4"+  \xFD\0\xA0\xFD\xE6", 
 \xFD\0\`\xFD\xE6"-\xFD\xE4".\xFD\xE4"/ \b \xFD\0@\xFD\xE6"0  \xFD\0\xC0\xFD\xE6"1\xFD\xE4"2 \f \xFD\0\x80\xFD\xE6"3  \xFD\0\0\xFD\xE6"4 ( 4\xFD\0\x92\xFD \0"4\xFD\xE4"5\xFD\xE4"6\xFD\xE4"7 0 1\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"0\xFD\xE6 2\xFD\xE5"1 4 3\xFD\xE5"3\xFD\xE4"8 , -\xFD\xE5"- ) *\xFD\xE5",\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF")\xFD\xE6"4 ,\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"*\xFD\xE6\xFD\xE4 /\xFD\xE5",\xFD\xE4"9\xFD\r\0\x07": 3 1\xFD\xE5"; + .\xFD\xE5 0\xFD\xE6 ,\xFD\xE5"+\xFD\xE4"< 5 2\xFD\xE5"5 -\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"2\xFD\xE6 4\xFD\xE5 +\xFD\xE4"=\xFD\xE5"4\xFD\r\0\x07">\xFD\r\0\x07"? \x07 \xFD\00\xFD\xE6"1  \xFD\0\xF0\xFD\xE6"3\xFD\xE4"@  \xFD\0\xB0\xFD\xE6"A \v \xFD\0p\xFD\xE6"B\xFD\xE4"C\xFD\xE4"- 	 \xFD\0P\xFD\xE6"D  \xFD\0\xD0\xFD\xE6"E\xFD\xE4". \r \xFD\0\x90\xFD\xE6"F  \xFD\0\xFD\xE6"G\xFD\xE4"H\xFD\xE4"I\xFD\xE4"J D E\xFD\xE5 0\xFD\xE6 .\xFD\xE5"D G F\xFD\xE5"E\xFD\xE4"F A B\xFD\xE5"A 1 3\xFD\xE5"1\xFD\xE5 )\xFD\xE6"B 1 *\xFD\xE6\xFD\xE4 -\xFD\xE5"1\xFD\xE4"G\xFD\r\0\x07"K E D\xFD\xE5"D @ C\xFD\xE5 0\xFD\xE6 1\xFD\xE5"3\xFD\xE4"@ H .\xFD\xE5"C A 2\xFD\xE6 B\xFD\xE5 3\xFD\xE4"A\xFD\xE5".\xFD\r\0\x07"B\xFD\r\0\x07"E\xFD\xE4"H 7 9\xFD\r\b	
\v\x1B\f\r"7 < 4\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"9 J G\xFD\r\b	
\v\x1B\f\r"< @ .\xFD\r\b	
\v\x1B\f\r"@\xFD\r\0\x07"G\xFD\xE4".\xFD\xE4"J : >\xFD\r\b	
\v\f\r\x1B": < @\xFD\r\b	
\v\f\r\x1B"<\xFD\xE4"> K B\xFD\r\b	
\v\f\r\x1B"@ 7 4\xFD\r\b	
\v\f\r\x1B"B\xFD\xE4"K\xFD\xE4"4\xFD\xE4\xFD\xF9 '\xFD\xB7 5 =\xFD\xE4"5 ; +\xFD\xE5"+\xFD\r\0\x07"7 8 ,\xFD\xE5", 6 /\xFD\xE5"/\xFD\r\0\x07"6\xFD\r\0\x07"; C A\xFD\xE4"8 D 3\xFD\xE5"3\xFD\r\0\x07"= F 1\xFD\xE5"1 I -\xFD\xE5"-\xFD\r\0\x07"A\xFD\r\0\x07"C\xFD\xE4"D 5 +\xFD\r\b	
\v\x1B\f\r"+ , /\xFD\r\b	
\v\x1B\f\r",\xFD\r\0\x07"F 8 3\xFD\r\b	
\v\x1B\f\r"3 1 -\xFD\r\b	
\v\x1B\f\r"-\xFD\r\0\x07"I\xFD\xE4"/\xFD\xE4"L 7 6\xFD\r\b	
\v\f\r\x1B"M 3 -\xFD\r\b	
\v\f\r\x1B"N\xFD\xE4"O = A\xFD\r\b	
\v\f\r\x1B"= + ,\xFD\r\b	
\v\f\r\x1B"A\xFD\xE4"P\xFD\xE4",\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!Q  A\xA0j\xFD\0\0\xFD\xE6"1  A\xE0j\xFD\0\0\xFD\xE6"3\xFD\xE4"5  A\xA0j\xFD\0\0\xFD\xE6"6 
 A\xE0j\xFD\0\0\xFD\xE6"7\xFD\xE4"8\xFD\xE4"+ \b A\xC0j\xFD\0\0\xFD\xE6"R  A\xC0j\xFD\0\0\xFD\xE6"S\xFD\xE4"- \f A\x80j\xFD\0\0\xFD\xE6"T  A\x80j\xFD\0\0\xFD\xE6"U ( U\xFD\0\x92\xFD \0"U\xFD\xE4"V\xFD\xE4"W\xFD\xE4"X R S\xFD\xE5 0\xFD\xE6 -\xFD\xE5"R U T\xFD\xE5"S\xFD\xE4"T 6 7\xFD\xE5"6 1 3\xFD\xE5"1\xFD\xE5 )\xFD\xE6"7 1 *\xFD\xE6\xFD\xE4 +\xFD\xE5"1\xFD\xE4"U\xFD\r\0\x07"Y S R\xFD\xE5"R 5 8\xFD\xE5 0\xFD\xE6 1\xFD\xE5"3\xFD\xE4"8 V -\xFD\xE5"S 6 2\xFD\xE6 7\xFD\xE5 3\xFD\xE4"V\xFD\xE5"Z\xFD\r\0\x07"[\xFD\r\0\x07"\\ \x07 A\xB0j\xFD\0\0\xFD\xE6"6  A\xF0j\xFD\0\0\xFD\xE6"7\xFD\xE4"]  A\xB0j\xFD\0\0\xFD\xE6"^ \v A\xF0j\xFD\0\0\xFD\xE6"_\xFD\xE4"\`\xFD\xE4"- 	 A\xD0j\xFD\0\0\xFD\xE6"a  A\xD0j\xFD\0\0\xFD\xE6"b\xFD\xE4"5 \r A\x90j\xFD\0\0\xFD\xE6"c  A\x90j\xFD\0\0\xFD\xE6"d\xFD\xE4"e\xFD\xE4"f\xFD\xE4"g a b\xFD\xE5 0\xFD\xE6 5\xFD\xE5"a d c\xFD\xE5"b\xFD\xE4"c ^ _\xFD\xE5"^ 6 7\xFD\xE5"6\xFD\xE5 )\xFD\xE6"_ 6 *\xFD\xE6\xFD\xE4 -\xFD\xE5"6\xFD\xE4"d\xFD\r\0\x07"h b a\xFD\xE5"a ] \`\xFD\xE5 0\xFD\xE6 6\xFD\xE5"7\xFD\xE4"] e 5\xFD\xE5"\` ^ 2\xFD\xE6 _\xFD\xE5 7\xFD\xE4"^\xFD\xE5"5\xFD\r\0\x07"_\xFD\r\0\x07"b\xFD\xE4"e X U\xFD\r\b	
\v\x1B\f\r"U 8 Z\xFD\r\b	
\v\x1B\f\r"8\xFD\r\0\x07"X g d\xFD\r\b	
\v\x1B\f\r"Z ] 5\xFD\r\b	
\v\x1B\f\r"]\xFD\r\0\x07"d\xFD\xE4"5\xFD\xE4"g Y [\xFD\r\b	
\v\f\r\x1B"Y Z ]\xFD\r\b	
\v\f\r\x1B"Z\xFD\xE4"[ h _\xFD\r\b	
\v\f\r\x1B"] U 8\xFD\r\b	
\v\f\r\x1B"U\xFD\xE4"_\xFD\xE4"8\xFD\xE4\xFD\xF9 '\xFD\xB7 S V\xFD\xE4"S R 3\xFD\xE5"3\xFD\r\0\x07"R T 1\xFD\xE5"1 W +\xFD\xE5"+\xFD\r\0\x07"T\xFD\r\0\x07"V \` ^\xFD\xE4"W a 7\xFD\xE5"7\xFD\r\0\x07"^ c 6\xFD\xE5"6 f -\xFD\xE5"-\xFD\r\0\x07"\`\xFD\r\0\x07"a\xFD\xE4"c S 3\xFD\r\b	
\v\x1B\f\r"3 1 +\xFD\r\b	
\v\x1B\f\r"1\xFD\r\0\x07"S W 7\xFD\r\b	
\v\x1B\f\r"7 6 -\xFD\r\b	
\v\x1B\f\r"-\xFD\r\0\x07"W\xFD\xE4"+\xFD\xE4"f R T\xFD\r\b	
\v\f\r\x1B"R 7 -\xFD\r\b	
\v\f\r\x1B"7\xFD\xE4"T ^ \`\xFD\r\b	
\v\f\r\x1B"^ 3 1\xFD\r\b	
\v\f\r\x1B"\`\xFD\xE4"h\xFD\xE4"-\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!1 A\xF0\x07j\xFD\0\0!i A\xB0j\xFD\0\0!j A\xB0\x07j\xFD\0\0!k A\xF0j\xFD\0\0!l A\xD0\x07j\xFD\0\0!m A\xD0j\xFD\0\0!n A\x90\x07j\xFD\0\0!o A\x90j\xFD\0\0!p A\xE0\x07j\xFD\0\0!q A\xA0j\xFD\0\0!r A\xA0\x07j\xFD\0\0!s A\xE0j\xFD\0\0!t A\xC0\x07j\xFD\0\0!u A\xC0j\xFD\0\0!v A\x80\x07j\xFD\0\0!w A\x80j\xFD\0\0!x A\xF0j\xFD\0\0!y A\xB0j\xFD\0\0!z A\xB0j\xFD\0\0!{ A\xF0j\xFD\0\0!| A\xD0j\xFD\0\0!} A\xD0j\xFD\0\0!~ A\x90j\xFD\0\0!\x7F A\x90j\xFD\0\0!\x80 A\xE0j\xFD\0\0!\x81 A\xA0j\xFD\0\0!\x82 A\xA0j\xFD\0\0!\x83 A\xE0j\xFD\0\0!\x84 A\xC0j\xFD\0\0!\x85 A\xC0j\xFD\0\0!\x86 A\x80j\xFD\0\0!\x87 A\x80j\xFD\0\0!\x88 Q 1\xFD\r\0\b	\f\r!1  j 1\xFD\v\0 ? E\xFD\xE5"? 9 G\xFD\xE5 0\xFD\xE6 .\xFD\xE5"9\xFD\xE4"E @ B\xFD\xE5"@ : <\xFD\xE5"1\xFD\xE5 )\xFD\xE6"B 1 *\xFD\xE6\xFD\xE4 4\xFD\xE5"1\xFD\xE4\xFD\xF9 '\xFD\xB7 ; C\xFD\xE5": F I\xFD\xE5 0\xFD\xE6 /\xFD\xE5";\xFD\xE4"C = A\xFD\xE5"= M N\xFD\xE5"3\xFD\xE5 )\xFD\xE6"A 3 *\xFD\xE6\xFD\xE4 ,\xFD\xE5"3\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!< \\ b\xFD\xE5"F X d\xFD\xE5 0\xFD\xE6 5\xFD\xE5"G\xFD\xE4"I ] U\xFD\xE5"M Y Z\xFD\xE5"6\xFD\xE5 )\xFD\xE6"N 6 *\xFD\xE6\xFD\xE4 8\xFD\xE5"6\xFD\xE4\xFD\xF9 '\xFD\xB7 V a\xFD\xE5"Q S W\xFD\xE5 0\xFD\xE6 +\xFD\xE5"S\xFD\xE4"U ^ \`\xFD\xE5"V R 7\xFD\xE5"7\xFD\xE5 )\xFD\xE6"R 7 *\xFD\xE6\xFD\xE4 -\xFD\xE5"7\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!W < W\xFD\r\0\b	\f\r!< & j <\xFD\v\0 ? 9\xFD\xE5"? > K\xFD\xE5 0\xFD\xE6 1\xFD\xE5"9\xFD\xE4\xFD\xF9 '\xFD\xB7 : ;\xFD\xE5"> O P\xFD\xE5 0\xFD\xE6 3\xFD\xE5":\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!K F G\xFD\xE5"F [ _\xFD\xE5 0\xFD\xE6 6\xFD\xE5";\xFD\xE4\xFD\xF9 '\xFD\xB7 Q S\xFD\xE5"G T h\xFD\xE5 0\xFD\xE6 7\xFD\xE5"<\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!O K O\xFD\r\0\b	\f\r!K % j K\xFD\v\0 H .\xFD\xE5". @ 2\xFD\xE6 B\xFD\xE5 9\xFD\xE4"@\xFD\xE5\xFD\xF9 '\xFD\xB7 D /\xFD\xE5"/ = 2\xFD\xE6 A\xFD\xE5 :\xFD\xE4"=\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!A e 5\xFD\xE5"5 M 2\xFD\xE6 N\xFD\xE5 ;\xFD\xE4"B\xFD\xE5\xFD\xF9 '\xFD\xB7 c +\xFD\xE5"+ V 2\xFD\xE6 R\xFD\xE5 <\xFD\xE4"D\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!H A H\xFD\r\0\b	\f\r!A $ j A\xFD\v\0 . @\xFD\xE4\xFD\xF9 '\xFD\xB7 / =\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!/ 5 B\xFD\xE4\xFD\xF9 '\xFD\xB7 + D\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!+ / +\xFD\r\0\b	\f\r!/ # j /\xFD\v\0 ? 9\xFD\xE5\xFD\xF9 '\xFD\xB7 > :\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!/ F ;\xFD\xE5\xFD\xF9 '\xFD\xB7 G <\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!+ / +\xFD\r\0\b	\f\r!/ " j /\xFD\v\0 E 1\xFD\xE5\xFD\xF9 '\xFD\xB7 C 3\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!/ I 6\xFD\xE5\xFD\xF9 '\xFD\xB7 U 7\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!+ / +\xFD\r\0\b	\f\r!/ ! j /\xFD\v\0 J 4\xFD\xE5\xFD\xF9 '\xFD\xB7 L ,\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!/ g 8\xFD\xE5\xFD\xF9 '\xFD\xB7 f -\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!, / ,\xFD\r\0\b	\f\r!/   j /\xFD\v\0  \x82\xFD\xE6"+  \x81\xFD\xE6"-\xFD\xE4".  \x83\xFD\xE6"1 
 \x84\xFD\xE6"3\xFD\xE4"4\xFD\xE4"/ \b \x86\xFD\xE6"5  \x85\xFD\xE6"6\xFD\xE4", \f \x87\xFD\xE6"7  \x88\xFD\xE6"8 ( 8\xFD\0\x92\xFD \0"8\xFD\xE4"9\xFD\xE4":\xFD\xE4"; 5 6\xFD\xE5 0\xFD\xE6 ,\xFD\xE5"5 8 7\xFD\xE5"6\xFD\xE4"7 1 3\xFD\xE5"1 + -\xFD\xE5"+\xFD\xE5 )\xFD\xE6"3 + *\xFD\xE6\xFD\xE4 /\xFD\xE5"+\xFD\xE4"8\xFD\r\0\x07"< 6 5\xFD\xE5"5 . 4\xFD\xE5 0\xFD\xE6 +\xFD\xE5"-\xFD\xE4"4 9 ,\xFD\xE5"6 1 2\xFD\xE6 3\xFD\xE5 -\xFD\xE4"9\xFD\xE5"=\xFD\r\0\x07">\xFD\r\0\x07"? \x07 z\xFD\xE6"1  y\xFD\xE6"3\xFD\xE4"@  {\xFD\xE6"A \v |\xFD\xE6"B\xFD\xE4"C\xFD\xE4", 	 ~\xFD\xE6"D  }\xFD\xE6"E\xFD\xE4". \r \x7F\xFD\xE6"F  \x80\xFD\xE6"G\xFD\xE4"H\xFD\xE4"I\xFD\xE4"J D E\xFD\xE5 0\xFD\xE6 .\xFD\xE5"D G F\xFD\xE5"E\xFD\xE4"F A B\xFD\xE5"A 1 3\xFD\xE5"1\xFD\xE5 )\xFD\xE6"B 1 *\xFD\xE6\xFD\xE4 ,\xFD\xE5"1\xFD\xE4"G\xFD\r\0\x07"K E D\xFD\xE5"D @ C\xFD\xE5 0\xFD\xE6 1\xFD\xE5"3\xFD\xE4"@ H .\xFD\xE5"C A 2\xFD\xE6 B\xFD\xE5 3\xFD\xE4"A\xFD\xE5".\xFD\r\0\x07"B\xFD\r\0\x07"E\xFD\xE4"H ; 8\xFD\r\b	
\v\x1B\f\r"8 4 =\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"; J G\xFD\r\b	
\v\x1B\f\r"= @ .\xFD\r\b	
\v\x1B\f\r"@\xFD\r\0\x07"G\xFD\xE4".\xFD\xE4"J < >\xFD\r\b	
\v\f\r\x1B"< = @\xFD\r\b	
\v\f\r\x1B"=\xFD\xE4"> K B\xFD\r\b	
\v\f\r\x1B"@ 8 4\xFD\r\b	
\v\f\r\x1B"B\xFD\xE4"K\xFD\xE4"4\xFD\xE4\xFD\xF9 '\xFD\xB7 6 9\xFD\xE4"6 5 -\xFD\xE5"-\xFD\r\0\x07"5 7 +\xFD\xE5"+ : /\xFD\xE5"/\xFD\r\0\x07"7\xFD\r\0\x07"9 C A\xFD\xE4"8 D 3\xFD\xE5"3\xFD\r\0\x07": F 1\xFD\xE5"1 I ,\xFD\xE5",\xFD\r\0\x07"A\xFD\r\0\x07"C\xFD\xE4"D 6 -\xFD\r\b	
\v\x1B\f\r"- + /\xFD\r\b	
\v\x1B\f\r"+\xFD\r\0\x07"F 8 3\xFD\r\b	
\v\x1B\f\r"3 1 ,\xFD\r\b	
\v\x1B\f\r",\xFD\r\0\x07"I\xFD\xE4"/\xFD\xE4"L 5 7\xFD\r\b	
\v\f\r\x1B"M 3 ,\xFD\r\b	
\v\f\r\x1B"N\xFD\xE4"O : A\xFD\r\b	
\v\f\r\x1B": - +\xFD\r\b	
\v\f\r\x1B"A\xFD\xE4"P\xFD\xE4",\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!Q  r\xFD\xE6"1  q\xFD\xE6"3\xFD\xE4"5  s\xFD\xE6"6 
 t\xFD\xE6"7\xFD\xE4"8\xFD\xE4"+ \b v\xFD\xE6"R  u\xFD\xE6"S\xFD\xE4"- \f w\xFD\xE6"T  x\xFD\xE6"U ( U\xFD\0\x92\xFD \0"U\xFD\xE4"V\xFD\xE4"W\xFD\xE4"X R S\xFD\xE5 0\xFD\xE6 -\xFD\xE5"R U T\xFD\xE5"S\xFD\xE4"T 6 7\xFD\xE5"6 1 3\xFD\xE5"1\xFD\xE5 )\xFD\xE6"7 1 *\xFD\xE6\xFD\xE4 +\xFD\xE5"1\xFD\xE4"U\xFD\r\0\x07"Y S R\xFD\xE5"R 5 8\xFD\xE5 0\xFD\xE6 1\xFD\xE5"3\xFD\xE4"8 V -\xFD\xE5"S 6 2\xFD\xE6 7\xFD\xE5 3\xFD\xE4"V\xFD\xE5"Z\xFD\r\0\x07"[\xFD\r\0\x07"\\ \x07 j\xFD\xE6"6  i\xFD\xE6"7\xFD\xE4"]  k\xFD\xE6"^ \v l\xFD\xE6"_\xFD\xE4"\`\xFD\xE4"- 	 n\xFD\xE6"a  m\xFD\xE6"b\xFD\xE4"5 \r o\xFD\xE6"c  p\xFD\xE6"d\xFD\xE4"e\xFD\xE4"f\xFD\xE4"g a b\xFD\xE5 0\xFD\xE6 5\xFD\xE5"a d c\xFD\xE5"b\xFD\xE4"c ^ _\xFD\xE5"^ 6 7\xFD\xE5"6\xFD\xE5 )\xFD\xE6"_ 6 *\xFD\xE6\xFD\xE4 -\xFD\xE5"6\xFD\xE4"d\xFD\r\0\x07"h b a\xFD\xE5"a ] \`\xFD\xE5 0\xFD\xE6 6\xFD\xE5"7\xFD\xE4"] e 5\xFD\xE5"\` ^ 2\xFD\xE6 _\xFD\xE5 7\xFD\xE4"^\xFD\xE5"5\xFD\r\0\x07"_\xFD\r\0\x07"b\xFD\xE4"e X U\xFD\r\b	
\v\x1B\f\r"U 8 Z\xFD\r\b	
\v\x1B\f\r"8\xFD\r\0\x07"X g d\xFD\r\b	
\v\x1B\f\r"Z ] 5\xFD\r\b	
\v\x1B\f\r"]\xFD\r\0\x07"d\xFD\xE4"5\xFD\xE4"g Y [\xFD\r\b	
\v\f\r\x1B"Y Z ]\xFD\r\b	
\v\f\r\x1B"Z\xFD\xE4"[ h _\xFD\r\b	
\v\f\r\x1B"] U 8\xFD\r\b	
\v\f\r\x1B"U\xFD\xE4"_\xFD\xE4"8\xFD\xE4\xFD\xF9 '\xFD\xB7 S V\xFD\xE4"S R 3\xFD\xE5"3\xFD\r\0\x07"R T 1\xFD\xE5"1 W +\xFD\xE5"+\xFD\r\0\x07"T\xFD\r\0\x07"V \` ^\xFD\xE4"W a 7\xFD\xE5"7\xFD\r\0\x07"^ c 6\xFD\xE5"6 f -\xFD\xE5"-\xFD\r\0\x07"\`\xFD\r\0\x07"a\xFD\xE4"c S 3\xFD\r\b	
\v\x1B\f\r"3 1 +\xFD\r\b	
\v\x1B\f\r"1\xFD\r\0\x07"S W 7\xFD\r\b	
\v\x1B\f\r"7 6 -\xFD\r\b	
\v\x1B\f\r"-\xFD\r\0\x07"W\xFD\xE4"+\xFD\xE4"f R T\xFD\r\b	
\v\f\r\x1B"R 7 -\xFD\r\b	
\v\f\r\x1B"7\xFD\xE4"T ^ \`\xFD\r\b	
\v\f\r\x1B"^ 3 1\xFD\r\b	
\v\f\r\x1B"\`\xFD\xE4"h\xFD\xE4"-\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!1 Q 1\xFD\r\0\b	\f\r!1  j 1\xFD\v\0 ? E\xFD\xE5"? ; G\xFD\xE5 0\xFD\xE6 .\xFD\xE5";\xFD\xE4"E @ B\xFD\xE5"@ < =\xFD\xE5"1\xFD\xE5 )\xFD\xE6"< 1 *\xFD\xE6\xFD\xE4 4\xFD\xE5"1\xFD\xE4\xFD\xF9 '\xFD\xB7 9 C\xFD\xE5"9 F I\xFD\xE5 0\xFD\xE6 /\xFD\xE5"=\xFD\xE4"B : A\xFD\xE5": M N\xFD\xE5"3\xFD\xE5 )\xFD\xE6"A 3 *\xFD\xE6\xFD\xE4 ,\xFD\xE5"3\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!C \\ b\xFD\xE5"F X d\xFD\xE5 0\xFD\xE6 5\xFD\xE5"G\xFD\xE4"I ] U\xFD\xE5"M Y Z\xFD\xE5"6\xFD\xE5 )\xFD\xE6"N 6 *\xFD\xE6\xFD\xE4 8\xFD\xE5"6\xFD\xE4\xFD\xF9 '\xFD\xB7 V a\xFD\xE5"Q S W\xFD\xE5 0\xFD\xE6 +\xFD\xE5"S\xFD\xE4"U ^ \`\xFD\xE5"V R 7\xFD\xE5"7\xFD\xE5 )\xFD\xE6"R 7 *\xFD\xE6\xFD\xE4 -\xFD\xE5")\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!* C *\xFD\r\0\b	\f\r!*  j *\xFD\v\0 ? ;\xFD\xE5"; > K\xFD\xE5 0\xFD\xE6 1\xFD\xE5"*\xFD\xE4\xFD\xF9 '\xFD\xB7 9 =\xFD\xE5"= O P\xFD\xE5 0\xFD\xE6 3\xFD\xE5"7\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!> F G\xFD\xE5"? [ _\xFD\xE5 0\xFD\xE6 6\xFD\xE5"9\xFD\xE4\xFD\xF9 '\xFD\xB7 Q S\xFD\xE5"C T h\xFD\xE5 0\xFD\xE6 )\xFD\xE5"0\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!F > F\xFD\r\0\b	\f\r!>  j >\xFD\v\0 H .\xFD\xE5". @ 2\xFD\xE6 <\xFD\xE5 *\xFD\xE4"<\xFD\xE5\xFD\xF9 '\xFD\xB7 D /\xFD\xE5"/ : 2\xFD\xE6 A\xFD\xE5 7\xFD\xE4":\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!> e 5\xFD\xE5"5 M 2\xFD\xE6 N\xFD\xE5 9\xFD\xE4"@\xFD\xE5\xFD\xF9 '\xFD\xB7 c +\xFD\xE5"+ V 2\xFD\xE6 R\xFD\xE5 0\xFD\xE4"2\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!A > A\xFD\r\0\b	\f\r!>  j >\xFD\v\0 . <\xFD\xE4\xFD\xF9 '\xFD\xB7 / :\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!/ 5 @\xFD\xE4\xFD\xF9 '\xFD\xB7 + 2\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86!2 / 2\xFD\r\0\b	\f\r!2 \x1B j 2\xFD\v\0 ; *\xFD\xE5\xFD\xF9 '\xFD\xB7 = 7\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!* ? 9\xFD\xE5\xFD\xF9 '\xFD\xB7 C 0\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!0 * 0\xFD\r\0\b	\f\r!0  j 0\xFD\v\0 E 1\xFD\xE5\xFD\xF9 '\xFD\xB7 B 3\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!0 I 6\xFD\xE5\xFD\xF9 '\xFD\xB7 U )\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!) 0 )\xFD\r\0\b	\f\r!0  j 0\xFD\v\0 J 4\xFD\xE5\xFD\xF9 '\xFD\xB7 L ,\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!0 g 8\xFD\xE5\xFD\xF9 '\xFD\xB7 f -\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86!) 0 )\xFD\r\0\b	\f\r!0  j 0\xFD\v\0 Aj! &Aj!& %Aj!% $Aj!$ #Aj!# "Aj!" !Aj!!  Aj!  Aj! Aj! Aj! Aj! \x1BAj!\x1B Aj! Aj! Aj! A\x80\bj! Aj!\f\0\v\v\v\xC8$\x7F{}3{ A \x1B" \0("(\b tAv" ("AjlAtj!   AjlAtj!   A\rjlAtj!   A\fjlAtj!\x1B   A\vjlAtj!   A
jlAtj!   A	jlAtj!   A\bjlAtj!   A\x07jlAtj!    AjlAtj!!   AjlAtj!"   AjlAtj!#   AjlAtj!$   AjlAtj!%   AjlAtj!&   lAtj! (\0A~q!A\x7F / tA\x7FsA\xFF\xFFq\xFD!' \0(\0*\x9C!(A\0!@@  O\r A\xF0j\xFD\0\0!) A\xB0j\xFD\0\0!* A\xB0j\xFD\0\0!+ A\xF0j\xFD\0\0!, A\xD0j\xFD\0\0!- A\xD0j\xFD\0\0!. A\x90j\xFD\0\0!/ A\x90j\xFD\0\0!0 A\xE0j\xFD\0\0!1 A\xA0j\xFD\0\0!2 A\xA0j\xFD\0\0!3 A\xE0j\xFD\0\0!4 A\xC0j\xFD\0\0!5 A\xC0j\xFD\0\0!6 A\x80j\xFD\0\0!7 A\x80j\xFD\0\0!8  j  \xFD\0 \xFD\xE6"9  \xFD\0\xE0\xFD\xE6":\xFD\xE4";  \xFD\0\xA0\xFD\xE6"< 
 \xFD\0\`\xFD\xE6"=\xFD\xE4">\xFD\xE4"? \b \xFD\0@\xFD\xE6"@  \xFD\0\xC0\xFD\xE6"A\xFD\xE4"B \f \xFD\0\x80\xFD\xE6"C  \xFD\0\0\xFD\xE6"D ( D\xFD\0\x92\xFD \0"D\xFD\xE4"E\xFD\xE4"F\xFD\xE4"G @ A\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"@\xFD\xE6 B\xFD\xE5"A D C\xFD\xE5"C\xFD\xE4"H < =\xFD\xE5"= 9 :\xFD\xE5"<\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"9\xFD\xE6"D <\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?":\xFD\xE6\xFD\xE4 ?\xFD\xE5"<\xFD\xE4"I\xFD\r\0\x07"J C A\xFD\xE5"K ; >\xFD\xE5 @\xFD\xE6 <\xFD\xE5";\xFD\xE4"L E B\xFD\xE5"E =\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0"B\xFD\xE6 D\xFD\xE5 ;\xFD\xE4"M\xFD\xE5"D\xFD\r\0\x07"N\xFD\r\0\x07"O \x07 \xFD\00\xFD\xE6"A  \xFD\0\xF0\xFD\xE6"C\xFD\xE4"P  \xFD\0\xB0\xFD\xE6"Q \v \xFD\0p\xFD\xE6"R\xFD\xE4"S\xFD\xE4"= 	 \xFD\0P\xFD\xE6"T  \xFD\0\xD0\xFD\xE6"U\xFD\xE4"> \r \xFD\0\x90\xFD\xE6"V  \xFD\0\xFD\xE6"W\xFD\xE4"X\xFD\xE4"Y\xFD\xE4"Z T U\xFD\xE5 @\xFD\xE6 >\xFD\xE5"T W V\xFD\xE5"U\xFD\xE4"V Q R\xFD\xE5"Q A C\xFD\xE5"A\xFD\xE5 9\xFD\xE6"R A :\xFD\xE6\xFD\xE4 =\xFD\xE5"A\xFD\xE4"W\xFD\r\0\x07"[ U T\xFD\xE5"T P S\xFD\xE5 @\xFD\xE6 A\xFD\xE5"C\xFD\xE4"P X >\xFD\xE5"S Q B\xFD\xE6 R\xFD\xE5 C\xFD\xE4"Q\xFD\xE5">\xFD\r\0\x07"R\xFD\r\0\x07"U\xFD\xE4"X G I\xFD\r\b	
\v\x1B\f\r"G L D\xFD\r\b	
\v\x1B\f\r"D\xFD\r\0\x07"I Z W\xFD\r\b	
\v\x1B\f\r"L P >\xFD\r\b	
\v\x1B\f\r"P\xFD\r\0\x07"W\xFD\xE4">\xFD\xE4"Z J N\xFD\r\b	
\v\f\r\x1B"J L P\xFD\r\b	
\v\f\r\x1B"L\xFD\xE4"N [ R\xFD\r\b	
\v\f\r\x1B"P G D\xFD\r\b	
\v\f\r\x1B"G\xFD\xE4"R\xFD\xE4"D\xFD\xE4\xFD\xF9 '\xFD\xB7 E M\xFD\xE4"E K ;\xFD\xE5";\xFD\r\0\x07"K H <\xFD\xE5"< F ?\xFD\xE5"?\xFD\r\0\x07"F\xFD\r\0\x07"H S Q\xFD\xE4"M T C\xFD\xE5"C\xFD\r\0\x07"Q V A\xFD\xE5"A Y =\xFD\xE5"=\xFD\r\0\x07"S\xFD\r\0\x07"T\xFD\xE4"V E ;\xFD\r\b	
\v\x1B\f\r"; < ?\xFD\r\b	
\v\x1B\f\r"<\xFD\r\0\x07"E M C\xFD\r\b	
\v\x1B\f\r"C A =\xFD\r\b	
\v\x1B\f\r"=\xFD\r\0\x07"A\xFD\xE4"?\xFD\xE4"M K F\xFD\r\b	
\v\f\r\x1B"F C =\xFD\r\b	
\v\f\r\x1B"=\xFD\xE4"C Q S\xFD\r\b	
\v\f\r\x1B"K ; <\xFD\r\b	
\v\f\r\x1B"Q\xFD\xE4"S\xFD\xE4"<\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 & j O U\xFD\xE5"O I W\xFD\xE5 @\xFD\xE6 >\xFD\xE5"I\xFD\xE4"U P G\xFD\xE5"G J L\xFD\xE5";\xFD\xE5 9\xFD\xE6"J ; :\xFD\xE6\xFD\xE4 D\xFD\xE5";\xFD\xE4\xFD\xF9 '\xFD\xB7 H T\xFD\xE5"H E A\xFD\xE5 @\xFD\xE6 ?\xFD\xE5"E\xFD\xE4"L K Q\xFD\xE5"K F =\xFD\xE5"=\xFD\xE5 9\xFD\xE6"F = :\xFD\xE6\xFD\xE4 <\xFD\xE5"=\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 % j O I\xFD\xE5"I N R\xFD\xE5 @\xFD\xE6 ;\xFD\xE5"A\xFD\xE4\xFD\xF9 '\xFD\xB7 H E\xFD\xE5"E C S\xFD\xE5 @\xFD\xE6 =\xFD\xE5"C\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 $ j X >\xFD\xE5"> G B\xFD\xE6 J\xFD\xE5 A\xFD\xE4"G\xFD\xE5\xFD\xF9 '\xFD\xB7 V ?\xFD\xE5"? K B\xFD\xE6 F\xFD\xE5 C\xFD\xE4"F\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 # j > G\xFD\xE4\xFD\xF9 '\xFD\xB7 ? F\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 " j I A\xFD\xE5\xFD\xF9 '\xFD\xB7 E C\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 ! j U ;\xFD\xE5\xFD\xF9 '\xFD\xB7 L =\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0   j Z D\xFD\xE5\xFD\xF9 '\xFD\xB7 M <\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j  2\xFD\xE6";  1\xFD\xE6"=\xFD\xE4">  3\xFD\xE6"A 
 4\xFD\xE6"C\xFD\xE4"D\xFD\xE4"? \b 6\xFD\xE6"1  5\xFD\xE6"2\xFD\xE4"< \f 7\xFD\xE6"3  8\xFD\xE6"4 ( 4\xFD\0\x92\xFD \0"4\xFD\xE4"5\xFD\xE4"6\xFD\xE4"7 1 2\xFD\xE5 @\xFD\xE6 <\xFD\xE5"1 4 3\xFD\xE5"2\xFD\xE4"3 A C\xFD\xE5"A ; =\xFD\xE5";\xFD\xE5 9\xFD\xE6"C ; :\xFD\xE6\xFD\xE4 ?\xFD\xE5";\xFD\xE4"4\xFD\r\0\x07"8 2 1\xFD\xE5"1 > D\xFD\xE5 @\xFD\xE6 ;\xFD\xE5"=\xFD\xE4"D 5 <\xFD\xE5"2 A B\xFD\xE6 C\xFD\xE5 =\xFD\xE4"5\xFD\xE5"E\xFD\r\0\x07"F\xFD\r\0\x07"G \x07 *\xFD\xE6"A  )\xFD\xE6"C\xFD\xE4")  +\xFD\xE6"* \v ,\xFD\xE6"+\xFD\xE4",\xFD\xE4"< 	 .\xFD\xE6".  -\xFD\xE6"-\xFD\xE4"> \r /\xFD\xE6"/  0\xFD\xE6"0\xFD\xE4"H\xFD\xE4"I\xFD\xE4"J . -\xFD\xE5 @\xFD\xE6 >\xFD\xE5"- 0 /\xFD\xE5".\xFD\xE4"/ * +\xFD\xE5"* A C\xFD\xE5"A\xFD\xE5 9\xFD\xE6"+ A :\xFD\xE6\xFD\xE4 <\xFD\xE5"A\xFD\xE4"0\xFD\r\0\x07"K . -\xFD\xE5"- ) ,\xFD\xE5 @\xFD\xE6 A\xFD\xE5"C\xFD\xE4") H >\xFD\xE5", * B\xFD\xE6 +\xFD\xE5 C\xFD\xE4"*\xFD\xE5">\xFD\r\0\x07"+\xFD\r\0\x07".\xFD\xE4"H 7 4\xFD\r\b	
\v\x1B\f\r"4 D E\xFD\r\b	
\v\x1B\f\r"D\xFD\r\0\x07"7 J 0\xFD\r\b	
\v\x1B\f\r"0 ) >\xFD\r\b	
\v\x1B\f\r")\xFD\r\0\x07"E\xFD\xE4">\xFD\xE4"J 8 F\xFD\r\b	
\v\f\r\x1B"8 0 )\xFD\r\b	
\v\f\r\x1B")\xFD\xE4"0 K +\xFD\r\b	
\v\f\r\x1B"+ 4 D\xFD\r\b	
\v\f\r\x1B"4\xFD\xE4"F\xFD\xE4"D\xFD\xE4\xFD\xF9 '\xFD\xB7 2 5\xFD\xE4"2 1 =\xFD\xE5"=\xFD\r\0\x07"1 3 ;\xFD\xE5"; 6 ?\xFD\xE5"?\xFD\r\0\x07"3\xFD\r\0\x07"5 , *\xFD\xE4"* - C\xFD\xE5"C\xFD\r\0\x07", / A\xFD\xE5"A I <\xFD\xE5"<\xFD\r\0\x07"-\xFD\r\0\x07"/\xFD\xE4"6 2 =\xFD\r\b	
\v\x1B\f\r"= ; ?\xFD\r\b	
\v\x1B\f\r";\xFD\r\0\x07"2 * C\xFD\r\b	
\v\x1B\f\r"C A <\xFD\r\b	
\v\x1B\f\r"<\xFD\r\0\x07"A\xFD\xE4"?\xFD\xE4"* 1 3\xFD\r\b	
\v\f\r\x1B"1 C <\xFD\r\b	
\v\f\r\x1B"C\xFD\xE4"3 , -\xFD\r\b	
\v\f\r\x1B", = ;\xFD\r\b	
\v\f\r\x1B"=\xFD\xE4"-\xFD\xE4"<\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j G .\xFD\xE5". 7 E\xFD\xE5 @\xFD\xE6 >\xFD\xE5"7\xFD\xE4"E + 4\xFD\xE5"+ 8 )\xFD\xE5";\xFD\xE5 9\xFD\xE6") ; :\xFD\xE6\xFD\xE4 D\xFD\xE5";\xFD\xE4\xFD\xF9 '\xFD\xB7 5 /\xFD\xE5"/ 2 A\xFD\xE5 @\xFD\xE6 ?\xFD\xE5"A\xFD\xE4"2 , =\xFD\xE5"= 1 C\xFD\xE5"C\xFD\xE5 9\xFD\xE6", C :\xFD\xE6\xFD\xE4 <\xFD\xE5"9\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j . 7\xFD\xE5"C 0 F\xFD\xE5 @\xFD\xE6 ;\xFD\xE5":\xFD\xE4\xFD\xF9 '\xFD\xB7 / A\xFD\xE5"A 3 -\xFD\xE5 @\xFD\xE6 9\xFD\xE5"@\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j H >\xFD\xE5"> + B\xFD\xE6 )\xFD\xE5 :\xFD\xE4")\xFD\xE5\xFD\xF9 '\xFD\xB7 6 ?\xFD\xE5"? = B\xFD\xE6 ,\xFD\xE5 @\xFD\xE4"B\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 \x1B j > )\xFD\xE4\xFD\xF9 '\xFD\xB7 ? B\xFD\xE4\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j C :\xFD\xE5\xFD\xF9 '\xFD\xB7 A @\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j E ;\xFD\xE5\xFD\xF9 '\xFD\xB7 2 9\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0  j J D\xFD\xE5\xFD\xF9 '\xFD\xB7 * <\xFD\xE5\xFD\xF9 '\xFD\xB7\xFD\x86\xFD\v\0 Aj! &Aj!& %Aj!% $Aj!$ #Aj!# "Aj!" !Aj!!  Aj!  Aj! Aj! Aj! Aj! \x1BAj!\x1B Aj! Aj! Aj! A\x80j! Aj!\f\0\v\v\v\xF7){}2{ A \x1B ( \0("(\b t"lAt (\0Atjj! At!A\x7F / tA\x7FsA\xFF\xFFq\xFD! \0(\0*\x9C!A\0!\0@@ \0 O\r  \xFD\0 \xFD\xE6"  \xFD\0\xE0\xFD\xE6"\xFD\xE4"\x1B  \xFD\0\xA0\xFD\xE6" 
 \xFD\0\`\xFD\xE6"\xFD\xE4"\xFD\xE4" \b \xFD\0@\xFD\xE6"   \xFD\0\xC0\xFD\xE6"!\xFD\xE4"" \f \xFD\0\x80\xFD\xE6"#  \xFD\0\0\xFD\xE6"$  $\xFD\0\x92\xFD \0"$\xFD\xE4"%\xFD\xE4"&\xFD\xE4"'   !\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?" \xFD\xE6 "\xFD\xE5"! $ #\xFD\xE5"#\xFD\xE4"(  \xFD\xE5"  \xFD\xE5"\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"\xFD\xE6"$ \xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"\xFD\xE6\xFD\xE4 \xFD\xE5"\xFD\xE4")\xFD\r\0\x07"* # !\xFD\xE5"+ \x1B \xFD\xE5  \xFD\xE6 \xFD\xE5"\x1B\xFD\xE4", % "\xFD\xE5"% \xFD\fu='\xC0u='\xC0u='\xC0u='\xC0""\xFD\xE6 $\xFD\xE5 \x1B\xFD\xE4"-\xFD\xE5"$\xFD\r\0\x07".\xFD\r\0\x07"/ \x07 \xFD\00\xFD\xE6"!  \xFD\0\xF0\xFD\xE6"#\xFD\xE4"0  \xFD\0\xB0\xFD\xE6"1 \v \xFD\0p\xFD\xE6"2\xFD\xE4"3\xFD\xE4" 	 \xFD\0P\xFD\xE6"4  \xFD\0\xD0\xFD\xE6"5\xFD\xE4" \r \xFD\0\x90\xFD\xE6"6  \xFD\0\xFD\xE6"7\xFD\xE4"8\xFD\xE4"9\xFD\xE4": 4 5\xFD\xE5  \xFD\xE6 \xFD\xE5"4 7 6\xFD\xE5"5\xFD\xE4"6 1 2\xFD\xE5"1 ! #\xFD\xE5"!\xFD\xE5 \xFD\xE6"2 ! \xFD\xE6\xFD\xE4 \xFD\xE5"!\xFD\xE4"7\xFD\r\0\x07"; 5 4\xFD\xE5"4 0 3\xFD\xE5  \xFD\xE6 !\xFD\xE5"#\xFD\xE4"0 8 \xFD\xE5"3 1 "\xFD\xE6 2\xFD\xE5 #\xFD\xE4"1\xFD\xE5"\xFD\r\0\x07"2\xFD\r\0\x07"5\xFD\xE4"8 ' )\xFD\r\b	
\v\x1B\f\r"' , $\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07") : 7\xFD\r\b	
\v\x1B\f\r", 0 \xFD\r\b	
\v\x1B\f\r"0\xFD\r\0\x07"7\xFD\xE4"\xFD\xE4": * .\xFD\r\b	
\v\f\r\x1B"* , 0\xFD\r\b	
\v\f\r\x1B",\xFD\xE4". ; 2\xFD\r\b	
\v\f\r\x1B"0 ' $\xFD\r\b	
\v\f\r\x1B"'\xFD\xE4"2\xFD\xE4"$\xFD\xE4\xFD\xF9 \xFD\xB7 % -\xFD\xE4"% + \x1B\xFD\xE5"\x1B\xFD\r\0\x07"+ ( \xFD\xE5" & \xFD\xE5"\xFD\r\0\x07"&\xFD\r\0\x07"( 3 1\xFD\xE4"- 4 #\xFD\xE5"#\xFD\r\0\x07"1 6 !\xFD\xE5"! 9 \xFD\xE5"\xFD\r\0\x07"3\xFD\r\0\x07"4\xFD\xE4"6 % \x1B\xFD\r\b	
\v\x1B\f\r"\x1B  \xFD\r\b	
\v\x1B\f\r"\xFD\r\0\x07"% - #\xFD\r\b	
\v\x1B\f\r"# ! \xFD\r\b	
\v\x1B\f\r"\xFD\r\0\x07"!\xFD\xE4"\xFD\xE4"- + &\xFD\r\b	
\v\f\r\x1B"& # \xFD\r\b	
\v\f\r\x1B"\xFD\xE4"# 1 3\xFD\r\b	
\v\f\r\x1B"+ \x1B \xFD\r\b	
\v\f\r\x1B"1\xFD\xE4"3\xFD\xE4"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!\x1B A\xF0j\xFD\0\0!9 A\xB0j\xFD\0\0!; A\xB0j\xFD\0\0!< A\xF0j\xFD\0\0!= A\xD0j\xFD\0\0!> A\xD0j\xFD\0\0!? A\x90j\xFD\0\0!@ A\x90j\xFD\0\0!A A\xE0j\xFD\0\0!B A\xA0j\xFD\0\0!C A\xA0j\xFD\0\0!D A\xE0j\xFD\0\0!E A\xC0j\xFD\0\0!F A\xC0j\xFD\0\0!G A\x80j\xFD\0\0!H A\x80j\xFD\0\0!I \x1B \xFD\r\0\0\x07\x07!J \x1B \xFD\r\b	\b	
\v
\v\f\r\f\r!\x1B Aj \x1B\xFD\v\0  J\xFD\v\0 / 5\xFD\xE5"/ ) 7\xFD\xE5  \xFD\xE6 \xFD\xE5")\xFD\xE4"5 0 '\xFD\xE5"' * ,\xFD\xE5"\x1B\xFD\xE5 \xFD\xE6"* \x1B \xFD\xE6\xFD\xE4 $\xFD\xE5"\x1B\xFD\xE4\xFD\xF9 \xFD\xB7 ( 4\xFD\xE5"( % !\xFD\xE5  \xFD\xE6 \xFD\xE5"%\xFD\xE4", + 1\xFD\xE5"+ & \xFD\xE5"\xFD\xE5 \xFD\xE6"&  \xFD\xE6\xFD\xE4 \xFD\xE5"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!! ! \xFD\r\0\0\x07\x07!0 ! \xFD\r\b	\b	
\v
\v\f\r\f\r!!  j"Aj !\xFD\v\0  0\xFD\v\0 / )\xFD\xE5") . 2\xFD\xE5  \xFD\xE6 \x1B\xFD\xE5"!\xFD\xE4\xFD\xF9 \xFD\xB7 ( %\xFD\xE5"( # 3\xFD\xE5  \xFD\xE6 \xFD\xE5"#\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!% % \xFD\r\0\0\x07\x07!. % \xFD\r\b	\b	
\v
\v\f\r\f\r!%  j"Aj %\xFD\v\0  .\xFD\v\0 8 \xFD\xE5" ' "\xFD\xE6 *\xFD\xE5 !\xFD\xE4"%\xFD\xE5\xFD\xF9 \xFD\xB7 6 \xFD\xE5"' + "\xFD\xE6 &\xFD\xE5 #\xFD\xE4"&\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!*  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  *\xFD\v\0  %\xFD\xE4\xFD\xF9 \xFD\xB7 ' &\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  \xFD\v\0 ) !\xFD\xE5\xFD\xF9 \xFD\xB7 ( #\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  \xFD\v\0 5 \x1B\xFD\xE5\xFD\xF9 \xFD\xB7 , \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!\x1B  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  \x1B\xFD\v\0 : $\xFD\xE5\xFD\xF9 \xFD\xB7 - \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  \xFD\v\0  C\xFD\xE6"\x1B  B\xFD\xE6"\xFD\xE4"  D\xFD\xE6"! 
 E\xFD\xE6"#\xFD\xE4"$\xFD\xE4" \b G\xFD\xE6"%  F\xFD\xE6"&\xFD\xE4" \f H\xFD\xE6"'  I\xFD\xE6"(  (\xFD\0\x92\xFD \0"(\xFD\xE4")\xFD\xE4"*\xFD\xE4"+ % &\xFD\xE5  \xFD\xE6 \xFD\xE5"% ( '\xFD\xE5"&\xFD\xE4"' ! #\xFD\xE5"! \x1B \xFD\xE5"\x1B\xFD\xE5 \xFD\xE6"# \x1B \xFD\xE6\xFD\xE4 \xFD\xE5"\x1B\xFD\xE4"(\xFD\r\0\x07", & %\xFD\xE5"%  $\xFD\xE5  \xFD\xE6 \x1B\xFD\xE5"\xFD\xE4"$ ) \xFD\xE5"& ! "\xFD\xE6 #\xFD\xE5 \xFD\xE4")\xFD\xE5"-\xFD\r\0\x07".\xFD\r\0\x07"/ \x07 ;\xFD\xE6"!  9\xFD\xE6"#\xFD\xE4"0  <\xFD\xE6"1 \v =\xFD\xE6"2\xFD\xE4"3\xFD\xE4" 	 ?\xFD\xE6"4  >\xFD\xE6"5\xFD\xE4" \r @\xFD\xE6"6  A\xFD\xE6"7\xFD\xE4"8\xFD\xE4"9\xFD\xE4": 4 5\xFD\xE5  \xFD\xE6 \xFD\xE5"4 7 6\xFD\xE5"5\xFD\xE4"6 1 2\xFD\xE5"1 ! #\xFD\xE5"!\xFD\xE5 \xFD\xE6"2 ! \xFD\xE6\xFD\xE4 \xFD\xE5"!\xFD\xE4"7\xFD\r\0\x07"; 5 4\xFD\xE5"4 0 3\xFD\xE5  \xFD\xE6 !\xFD\xE5"#\xFD\xE4"0 8 \xFD\xE5"3 1 "\xFD\xE6 2\xFD\xE5 #\xFD\xE4"1\xFD\xE5"\xFD\r\0\x07"2\xFD\r\0\x07"5\xFD\xE4"8 + (\xFD\r\b	
\v\x1B\f\r"( $ -\xFD\r\b	
\v\x1B\f\r"$\xFD\r\0\x07"+ : 7\xFD\r\b	
\v\x1B\f\r"- 0 \xFD\r\b	
\v\x1B\f\r"0\xFD\r\0\x07"7\xFD\xE4"\xFD\xE4": , .\xFD\r\b	
\v\f\r\x1B", - 0\xFD\r\b	
\v\f\r\x1B"-\xFD\xE4". ; 2\xFD\r\b	
\v\f\r\x1B"0 ( $\xFD\r\b	
\v\f\r\x1B"(\xFD\xE4"2\xFD\xE4"$\xFD\xE4\xFD\xF9 \xFD\xB7 & )\xFD\xE4"& % \xFD\xE5"\xFD\r\0\x07"% ' \x1B\xFD\xE5"\x1B * \xFD\xE5"\xFD\r\0\x07"'\xFD\r\0\x07") 3 1\xFD\xE4"* 4 #\xFD\xE5"#\xFD\r\0\x07"1 6 !\xFD\xE5"! 9 \xFD\xE5"\xFD\r\0\x07"3\xFD\r\0\x07"4\xFD\xE4"6 & \xFD\r\b	
\v\x1B\f\r" \x1B \xFD\r\b	
\v\x1B\f\r"\x1B\xFD\r\0\x07"& * #\xFD\r\b	
\v\x1B\f\r"# ! \xFD\r\b	
\v\x1B\f\r"\xFD\r\0\x07"!\xFD\xE4"\xFD\xE4"* % '\xFD\r\b	
\v\f\r\x1B"% # \xFD\r\b	
\v\f\r\x1B"#\xFD\xE4"' 1 3\xFD\r\b	
\v\f\r\x1B"1  \x1B\xFD\r\b	
\v\f\r\x1B"\xFD\xE4"3\xFD\xE4"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!\x1B \x1B \xFD\r\0\0\x07\x07!9 \x1B \xFD\r\b	\b	
\v
\v\f\r\f\r!\x1B  j"Aj \x1B\xFD\v\0  9\xFD\v\0 / 5\xFD\xE5"/ + 7\xFD\xE5  \xFD\xE6 \xFD\xE5"+\xFD\xE4"5 0 (\xFD\xE5"( , -\xFD\xE5"\x1B\xFD\xE5 \xFD\xE6", \x1B \xFD\xE6\xFD\xE4 $\xFD\xE5"\x1B\xFD\xE4\xFD\xF9 \xFD\xB7 ) 4\xFD\xE5") & !\xFD\xE5  \xFD\xE6 \xFD\xE5"!\xFD\xE4"& 1 \xFD\xE5"- % #\xFD\xE5"\xFD\xE5 \xFD\xE6"#  \xFD\xE6\xFD\xE4 \xFD\xE5"\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  \xFD\v\0 / +\xFD\xE5"% . 2\xFD\xE5  \xFD\xE6 \x1B\xFD\xE5"\xFD\xE4\xFD\xF9 \xFD\xB7 ) !\xFD\xE5"! ' 3\xFD\xE5  \xFD\xE6 \xFD\xE5" \xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!  \xFD\r\0\0\x07\x07!'  \xFD\r\b	\b	
\v
\v\f\r\f\r!  j"Aj \xFD\v\0  '\xFD\v\0 8 \xFD\xE5" ( "\xFD\xE6 ,\xFD\xE5 \xFD\xE4"\xFD\xE5\xFD\xF9 \xFD\xB7 6 \xFD\xE5" - "\xFD\xE6 #\xFD\xE5  \xFD\xE4"#\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!" " \xFD\r\0\0\x07\x07!' " \xFD\r\b	\b	
\v
\v\f\r\f\r!"  j"Aj "\xFD\v\0  '\xFD\v\0  \xFD\xE4\xFD\xF9 \xFD\xB7  #\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86!" " \xFD\r\0\0\x07\x07! " \xFD\r\b	\b	
\v
\v\f\r\f\r!"  j"Aj "\xFD\v\0  \xFD\v\0 % \xFD\xE5\xFD\xF9 \xFD\xB7 !  \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!    \xFD\r\0\0\x07\x07!   \xFD\r\b	\b	
\v
\v\f\r\f\r!   j"Aj  \xFD\v\0  \xFD\v\0 5 \x1B\xFD\xE5\xFD\xF9 \xFD\xB7 & \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!    \xFD\r\0\0\x07\x07!   \xFD\r\b	\b	
\v
\v\f\r\f\r!   j"Aj  \xFD\v\0  \xFD\v\0 : $\xFD\xE5\xFD\xF9 \xFD\xB7 * \xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86!    \xFD\r\0\0\x07\x07!   \xFD\r\b	\b	
\v
\v\f\r\f\r!   j"Aj  \xFD\v\0  \xFD\v\0 A j! A\x80j! \0Aj!\0\f\0\v\v\v\x9B \b\x7F{}3{ A \x1B" \0("(\b tAv" (Av"A\x07jlAtj!   AjlAtj!   AjlAtj!   AjlAtj!\x1B   AjlAtj!   AjlAtj!   AjlAtj!   lAtj! (\0A~q!A\x7F / tA\x7FsA\xFF\xFFq\xFD! \0(\0*\x9C! A\0!@@  O\r A\xF0j\xFD\0\0!! A\xB0j\xFD\0\0!" A\xB0j\xFD\0\0!# A\xF0j\xFD\0\0!$ A\xD0j\xFD\0\0!% A\xD0j\xFD\0\0!& A\x90j\xFD\0\0!' A\x90j\xFD\0\0!( A\xE0j\xFD\0\0!) A\xA0j\xFD\0\0!* A\xA0j\xFD\0\0!+ A\xE0j\xFD\0\0!, A\xC0j\xFD\0\0!- A\xC0j\xFD\0\0!. A\x80j\xFD\0\0!/ A\x80j\xFD\0\0!0  j  \xFD\0 \xFD\xE6"1  \xFD\0\xE0\xFD\xE6"2\xFD\xE4"3  \xFD\0\xA0\xFD\xE6"4 
 \xFD\0\`\xFD\xE6"5\xFD\xE4"6\xFD\xE4"7 \b \xFD\0@\xFD\xE6"8  \xFD\0\xC0\xFD\xE6"9\xFD\xE4": \f \xFD\0\x80\xFD\xE6";  \xFD\0\0\xFD\xE6"<   <\xFD\0\x92\xFD \0"<\xFD\xE4"=\xFD\xE4">\xFD\xE4"? 8 9\xFD\xE5\xFD\f\xF3\xB5?\xF3\xB5?\xF3\xB5?\xF3\xB5?"8\xFD\xE6 :\xFD\xE5"9 < ;\xFD\xE5";\xFD\xE4"< 4 5\xFD\xE5"5 1 2\xFD\xE5"4\xFD\xE5\xFD\f\xEFC\xBF\xEFC\xBF\xEFC\xBF\xEFC\xBF"1\xFD\xE6"@ 4\xFD\f\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?\xD4\x8B\x8A?"2\xFD\xE6\xFD\xE4 7\xFD\xE5"4\xFD\xE4"A\xFD\r\0\x07"B ; 9\xFD\xE5"C 3 6\xFD\xE5 8\xFD\xE6 4\xFD\xE5"3\xFD\xE4"D = :\xFD\xE5"= 5\xFD\fu='\xC0u='\xC0u='\xC0u='\xC0":\xFD\xE6 @\xFD\xE5 3\xFD\xE4"@\xFD\xE5"E\xFD\r\0\x07"F\xFD\r\0\x07"G \x07 \xFD\00\xFD\xE6"9  \xFD\0\xF0\xFD\xE6";\xFD\xE4"H  \xFD\0\xB0\xFD\xE6"I \v \xFD\0p\xFD\xE6"J\xFD\xE4"K\xFD\xE4"5 	 \xFD\0P\xFD\xE6"L  \xFD\0\xD0\xFD\xE6"M\xFD\xE4"6 \r \xFD\0\x90\xFD\xE6"N  \xFD\0\xFD\xE6"O\xFD\xE4"P\xFD\xE4"Q\xFD\xE4"R L M\xFD\xE5 8\xFD\xE6 6\xFD\xE5"L O N\xFD\xE5"M\xFD\xE4"N I J\xFD\xE5"I 9 ;\xFD\xE5"9\xFD\xE5 1\xFD\xE6"J 9 2\xFD\xE6\xFD\xE4 5\xFD\xE5"9\xFD\xE4"O\xFD\r\0\x07"S M L\xFD\xE5"L H K\xFD\xE5 8\xFD\xE6 9\xFD\xE5";\xFD\xE4"H P 6\xFD\xE5"K I :\xFD\xE6 J\xFD\xE5 ;\xFD\xE4"I\xFD\xE5"6\xFD\r\0\x07"J\xFD\r\0\x07"M\xFD\xE4"P ? A\xFD\r\b	
\v\x1B\f\r"? D E\xFD\r\b	
\v\x1B\f\r"A\xFD\r\0\x07"D R O\xFD\r\b	
\v\x1B\f\r"E H 6\xFD\r\b	
\v\x1B\f\r"H\xFD\r\0\x07"O\xFD\xE4"6\xFD\xE4 B F\xFD\r\b	
\v\f\r\x1B"B E H\xFD\r\b	
\v\f\r\x1B"E\xFD\xE4"F S J\xFD\r\b	
\v\f\r\x1B"H ? A\xFD\r\b	
\v\f\r\x1B"?\xFD\xE4"A\xFD\xE4"J\xFD\xE4\xFD\xF9 \xFD\xB7 = @\xFD\xE4"= C 3\xFD\xE5"3\xFD\r\0\x07"@ < 4\xFD\xE5"4 > 7\xFD\xE5"7\xFD\r\0\x07"<\xFD\r\0\x07"> K I\xFD\xE4"C L ;\xFD\xE5";\xFD\r\0\x07"I N 9\xFD\xE5"9 Q 5\xFD\xE5"5\xFD\r\0\x07"K\xFD\r\0\x07"L\xFD\xE4"N = 3\xFD\r\b	
\v\x1B\f\r"3 4 7\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"= C ;\xFD\r\b	
\v\x1B\f\r"; 9 5\xFD\r\b	
\v\x1B\f\r"5\xFD\r\0\x07"9\xFD\xE4"7\xFD\xE4 @ <\xFD\r\b	
\v\f\r\x1B"< ; 5\xFD\r\b	
\v\f\r\x1B"5\xFD\xE4"; I K\xFD\r\b	
\v\f\r\x1B"@ 3 4\xFD\r\b	
\v\f\r\x1B"4\xFD\xE4"3\xFD\xE4"C\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0  j G M\xFD\xE5"G D O\xFD\xE5 8\xFD\xE6 6\xFD\xE5"D\xFD\xE5 F A\xFD\xE5 8\xFD\xE6 H ?\xFD\xE5"? B E\xFD\xE5"A\xFD\xE5 1\xFD\xE6"B A 2\xFD\xE6\xFD\xE4 J\xFD\xE5"A\xFD\xE5"E\xFD\xE4\xFD\xF9 \xFD\xB7 > L\xFD\xE5"> = 9\xFD\xE5 8\xFD\xE6 7\xFD\xE5"9\xFD\xE5 ; 3\xFD\xE5 8\xFD\xE6 @ 4\xFD\xE5"4 < 5\xFD\xE5"3\xFD\xE5 1\xFD\xE6"5 3 2\xFD\xE6\xFD\xE4 C\xFD\xE5"3\xFD\xE5";\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0  j P 6\xFD\xE5 ? :\xFD\xE6 B\xFD\xE5 E\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 N 7\xFD\xE5 4 :\xFD\xE6 5\xFD\xE5 ;\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0  j G D\xFD\xE4 A\xFD\xE5\xFD\xF9 \xFD\xB7 > 9\xFD\xE4 3\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0 \x1B j  *\xFD\xE6"3  )\xFD\xE6"5\xFD\xE4"6  +\xFD\xE6"9 
 ,\xFD\xE6";\xFD\xE4")\xFD\xE4"7 \b .\xFD\xE6"*  -\xFD\xE6"+\xFD\xE4"4 \f /\xFD\xE6",  0\xFD\xE6"-   -\xFD\0\x92\xFD \0"-\xFD\xE4".\xFD\xE4"/\xFD\xE4"0 * +\xFD\xE5 8\xFD\xE6 4\xFD\xE5"* - ,\xFD\xE5"+\xFD\xE4", 9 ;\xFD\xE5"9 3 5\xFD\xE5"3\xFD\xE5 1\xFD\xE6"; 3 2\xFD\xE6\xFD\xE4 7\xFD\xE5"3\xFD\xE4"-\xFD\r\0\x07"< + *\xFD\xE5"* 6 )\xFD\xE5 8\xFD\xE6 3\xFD\xE5"5\xFD\xE4") . 4\xFD\xE5"+ 9 :\xFD\xE6 ;\xFD\xE5 5\xFD\xE4".\xFD\xE5"=\xFD\r\0\x07">\xFD\r\0\x07"? \x07 "\xFD\xE6"9  !\xFD\xE6";\xFD\xE4"!  #\xFD\xE6"" \v $\xFD\xE6"#\xFD\xE4"$\xFD\xE4"4 	 &\xFD\xE6"&  %\xFD\xE6"%\xFD\xE4"6 \r '\xFD\xE6"'  (\xFD\xE6"(\xFD\xE4"@\xFD\xE4"A\xFD\xE4"B & %\xFD\xE5 8\xFD\xE6 6\xFD\xE5"% ( '\xFD\xE5"&\xFD\xE4"' " #\xFD\xE5"" 9 ;\xFD\xE5"9\xFD\xE5 1\xFD\xE6"# 9 2\xFD\xE6\xFD\xE4 4\xFD\xE5"9\xFD\xE4"(\xFD\r\0\x07"C & %\xFD\xE5"% ! $\xFD\xE5 8\xFD\xE6 9\xFD\xE5";\xFD\xE4"! @ 6\xFD\xE5"$ " :\xFD\xE6 #\xFD\xE5 ;\xFD\xE4""\xFD\xE5"6\xFD\r\0\x07"#\xFD\r\0\x07"&\xFD\xE4"@ 0 -\xFD\r\b	
\v\x1B\f\r"- ) =\xFD\r\b	
\v\x1B\f\r")\xFD\r\0\x07"0 B (\xFD\r\b	
\v\x1B\f\r"( ! 6\xFD\r\b	
\v\x1B\f\r"!\xFD\r\0\x07"=\xFD\xE4"6\xFD\xE4 < >\xFD\r\b	
\v\f\r\x1B"< ( !\xFD\r\b	
\v\f\r\x1B"!\xFD\xE4"( C #\xFD\r\b	
\v\f\r\x1B"# - )\xFD\r\b	
\v\f\r\x1B")\xFD\xE4"-\xFD\xE4">\xFD\xE4\xFD\xF9 \xFD\xB7 + .\xFD\xE4"+ * 5\xFD\xE5"5\xFD\r\0\x07"* , 3\xFD\xE5"3 / 7\xFD\xE5"7\xFD\r\0\x07",\xFD\r\0\x07". $ "\xFD\xE4"" % ;\xFD\xE5";\xFD\r\0\x07"$ ' 9\xFD\xE5"9 A 4\xFD\xE5"4\xFD\r\0\x07"%\xFD\r\0\x07"'\xFD\xE4"/ + 5\xFD\r\b	
\v\x1B\f\r"5 3 7\xFD\r\b	
\v\x1B\f\r"3\xFD\r\0\x07"+ " ;\xFD\r\b	
\v\x1B\f\r"; 9 4\xFD\r\b	
\v\x1B\f\r"4\xFD\r\0\x07"9\xFD\xE4"7\xFD\xE4 * ,\xFD\r\b	
\v\f\r\x1B"" ; 4\xFD\r\b	
\v\f\r\x1B"4\xFD\xE4"; $ %\xFD\r\b	
\v\f\r\x1B"$ 5 3\xFD\r\b	
\v\f\r\x1B"3\xFD\xE4"5\xFD\xE4"%\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0  j ? &\xFD\xE5"& 0 =\xFD\xE5 8\xFD\xE6 6\xFD\xE5"*\xFD\xE5 ( -\xFD\xE5 8\xFD\xE6 # )\xFD\xE5"# < !\xFD\xE5"!\xFD\xE5 1\xFD\xE6"( ! 2\xFD\xE6\xFD\xE4 >\xFD\xE5"!\xFD\xE5")\xFD\xE4\xFD\xF9 \xFD\xB7 . '\xFD\xE5"' + 9\xFD\xE5 8\xFD\xE6 7\xFD\xE5"9\xFD\xE5 ; 5\xFD\xE5 8\xFD\xE6 $ 3\xFD\xE5"8 " 4\xFD\xE5"4\xFD\xE5 1\xFD\xE6"1 4 2\xFD\xE6\xFD\xE4 %\xFD\xE5"2\xFD\xE5"4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0  j @ 6\xFD\xE5 # :\xFD\xE6 (\xFD\xE5 )\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7 / 7\xFD\xE5 8 :\xFD\xE6 1\xFD\xE5 4\xFD\xE4\xFD\xE4\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0  j & *\xFD\xE4 !\xFD\xE5\xFD\xF9 \xFD\xB7 ' 9\xFD\xE4 2\xFD\xE5\xFD\xF9 \xFD\xB7\xFD\x86\xFD\v\0 Aj! Aj! Aj! Aj! \x1BAj!\x1B Aj! Aj! Aj! A\x80j! Aj!\f\0\v\v\v\xFC\b\x07\x7F~\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"	$\x80\x80\x80\x80\0 	 gA\x7FsAq"
:\0\f A \x1B j!\v A\x7Fj!\fB\xFF!\rA\0!A\0!B\0!B\0!B\0!@@ B\xC0\0Z\r\0@@@@@@@@@  k"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 j)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v \0 j1\0\0B8\x86! Aj!\f\v \0 j/\0\0"A\bt A\bvr\xADB0\x86! Aj!\f\v \0 j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! Aj!\f\v \0 j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! Aj!\f\v \0 j"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!  \x88 \x84!B\x7F!\v@@ B\x7FU\r\0 B7\x88!B	!\f\v B;\x88"B|B\x88B\0 B\x83"}\x85 |!B!\v \v  
v j \blj  \fqj  \r|"\r\xA7":\0\0@@@@  B\f\x83B>\x85\x88B\x83PE\r\0 B; }\x88B\x83"PE\r B\x84! B0 }\x88B\xFF\x83!\f\v B|!A!\f\v B|!\v \xA7" \x07 A\x7Fsj"  I\x1B" Aj"j!@@  M\r@   \fq"k"  k"  I\x1B"E\r\0 \v  
v j \blj j  \xFC\v\0\v  j!\f\0\v\v Aj!\v  \x86 B\0 }\x88\x84!  }!  \x86!  j" \x07I\r\0\v 	Aj$\x80\x80\x80\x80\0\v\xB2	\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"	$\x80\x80\x80\x80\0 	 gA\x7FsAq"
:\0\f A \x1B Atj!\v A\x7Fj!\fA\0!\rB\xFF!A\0!B\0!B\0!B\0!@@ B\xC0\0Z\r\0@@@@@@@@@  \rk"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \rj)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \x84! B\xC0\0\x84! \rA\bj!\r\f\b\v \0 \rj1\0\0B8\x86! \rAj!\r\f\v \0 \rj/\0\0"A\bt A\bvr\xADB0\x86! \rAj!\r\f\v \0 \rj"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! \rAj!\r\f\v \0 \rj(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \rAj!\r\f\v \0 \rj"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \rAj!\r\f\v \0 \rj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \rAj!\r\f\v \0 \rj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! \rA\x07j!\r\vB\0 B\0 }\x86 P\x1B!  \x88 \x84!B\x7F!\v@@ B\x7FU\r\0 B7\x88!B	!\f\v B;\x88"B|B\x88B\0 B\x83"}\x85 |!B!\v \v  
v j \blAtj  \fqAtj  |B\xFF\x83"\xA7"At Avr";\0@@@@  B\f\x83B>\x85\x88B\x83PE\r\0 B; }\x88B\x83"PE\r B\x84! B0 }\x88B\xFF\x83!\f\v B|!A!\f\v B|!\v \xA7" \x07 A\x7Fsj"  I\x1B" Aj"j!@@  M\r   \fq"k"  k"  I\x1B"At! \v  
v j \blAtj Atj!@@ E\r  ;\0 A~j! Aj!\f\0\v\v  j!\f\0\v\v Aj!\v  \x86 B\0 }\x88\x84!  }!  \x86!  j" \x07I\r\0\v 	Aj$\x80\x80\x80\x80\0\v\xB2	\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"	$\x80\x80\x80\x80\0 	 gA\x7FsAq"
:\0\f A \x1B Atj!\v A\x7Fj!\fA\0!\rB\xFF!A\0!B\0!B\0!B\0!@@ B\xC0\0Z\r\0@@@@@@@@@  \rk"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 \rj)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \x84! B\xC0\0\x84! \rA\bj!\r\f\b\v \0 \rj1\0\0B8\x86! \rAj!\r\f\v \0 \rj/\0\0"A\bt A\bvr\xADB0\x86! \rAj!\r\f\v \0 \rj"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! \rAj!\r\f\v \0 \rj(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! \rAj!\r\f\v \0 \rj"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! \rAj!\r\f\v \0 \rj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! \rAj!\r\f\v \0 \rj"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! \rA\x07j!\r\vB\0 B\0 }\x86 P\x1B!  \x88 \x84!B\x7F!\v@@ B\x7FU\r\0 B7\x88!B	!\f\v B;\x88"B|B\x88B\0 B\x83"}\x85 |!B!\v \v  
v j \blAtj  \fqAtj  |B\xFF\x83"\xA7"At Avr";\0@@@@  B\f\x83B>\x85\x88B\x83PE\r\0 B; }\x88B\x83"PE\r B\x84! B0 }\x88B\xFF\x83!\f\v B|!A!\f\v B|!\v \xA7" \x07 A\x7Fsj"  I\x1B" Aj"j!@@  M\r   \fq"k"  k"  I\x1B"At! \v  
v j \blAtj Atj!@@ E\r  ;\0 A~j! Aj!\f\0\v\v  j!\f\0\v\v Aj!\v  \x86 B\0 }\x88\x84!  }!  \x86!  j" \x07I\r\0\v 	Aj$\x80\x80\x80\x80\0\v\xE7\b\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"	$\x80\x80\x80\x80\0 	 gA\x7FsAq"
:\0\f A \x1B j!\v A\x7Fj!\fB\xFF\xFF!\rA\0!A\0!B\0!B\0!B\0!@@ B\xC0\0Z\r\0@@@@@@@@@  k"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 j)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v \0 j1\0\0B8\x86! Aj!\f\v \0 j/\0\0"A\bt A\bvr\xADB0\x86! Aj!\f\v \0 j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! Aj!\f\v \0 j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! Aj!\f\v \0 j"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!  \x88 \x84!B\x7F!\v@@ B\x7FU\r\0 B/\x88!B!\f\v B8\x88"B|B\x88B\0 B\x83"}\x85 |!B\b!\v \v  
v j \blj  \fqj  \r|"\rB\b\x88\xA7":\0\0B!A!@  B?\x85\x88B\x83PE\r\0 B0 }\x88B\xFF\x83 B; }\x88B\x83" P"\x1B\xA7" \x07 A\x7Fsj"  I\x1B" Aj"j!BB \x1B!@@  M\r@   \fq"k"  k"  I\x1B"E\r\0 \v  
v j \blj j  \xFC\v\0\v  j!\f\0\v\v Aj!\v   |"\x86 B\0 }\x88\x84!  }!  \x86!  j" \x07I\r\0\v 	Aj$\x80\x80\x80\x80\0\v\x97	\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"	$\x80\x80\x80\x80\0 	 gA\x7FsAq"
:\0\f A \x1B Atj!\v A\x7Fj!\fB\xFF\xFF!\rA\0!A\0!B\0!B\0!B\0!@@ B\xC0\0Z\r\0@@@@@@@@@  k"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 j)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v \0 j1\0\0B8\x86! Aj!\f\v \0 j/\0\0"A\bt A\bvr\xADB0\x86! Aj!\f\v \0 j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! Aj!\f\v \0 j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! Aj!\f\v \0 j"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!  \x88 \x84!B\x7F!\v@@ B\x7FU\r\0 B/\x88!B!\f\v B8\x88"B|B\x88B\0 B\x83"}\x85 |!B\b!\vA! \v  
v j \blAtj  \fqAtj  \r|"\r\xA7A\xC0\xFFqAv";\0B!@  B?\x85\x88B\x83PE\r\0 B0 }\x88B\xFF\x83 B; }\x88B\x83" P"\x1B\xA7" \x07 A\x7Fsj"  I\x1B" Aj"j!BB \x1B!@@  M\r   \fq"k"  k"  I\x1B"At! \v  
v j \blAtj Atj!@@ E\r  ;\0 A~j! Aj!\f\0\v\v  j!\f\0\v\v Aj!\v   |"\x86 B\0 }\x88\x84!  }!  \x86!  j" \x07I\r\0\v 	Aj$\x80\x80\x80\x80\0\v\x97	\x7F~\x7F~\x7F#\x80\x80\x80\x80\0Ak"	$\x80\x80\x80\x80\0 	 gA\x7FsAq"
:\0\f A \x1B Atj!\v A\x7Fj!\fB\xFF\xFF!\rA\0!A\0!B\0!B\0!B\0!@@ B\xC0\0Z\r\0@@@@@@@@@  k"A\x07K\r\0B\0! \b\b\x07\b\vB\0 \0 j)\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84 B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\b\x88B\x80\x80\x80\xF8\x83 B\x88B\x80\x80\xFC\x07\x83\x84 B(\x88B\x80\xFE\x83 B8\x88\x84\x84\x84"B\0 }\x86 P\x1B!  \x88 \x84! B\xC0\0\x84! A\bj!\f\b\v \0 j1\0\0B8\x86! Aj!\f\v \0 j/\0\0"A\bt A\bvr\xADB0\x86! Aj!\f\v \0 j"/\0\0"A\x80\xFEq Aj-\0\0rA\bt AtrA\bv\xADB(\x86! Aj!\f\v \0 j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr\xADB \x86! Aj!\f\v \0 j"Aj1\0\0B \x86"B\b\x88 5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  \x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj3\0\0"B \x86\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86B\x80\x80\x80\xF8\x83 B\b\x86B\x80\x80\xFC\x07\x83\x84\x84! Aj!\f\v \0 j"5\0\0"B8\x86 B\x80\xFE\x83B(\x86\x84  Aj1\0\0B0\x86" Aj3\0\0"B \x86\x84\x84"B\x80\x80\xFC\x07\x83B\x86 B\x80\x80\x80\xF8\x83B\b\x86\x84\x84 B\x86 B\b\x86\x84B\x80\x80\xFC\xFF\x83 B(\x88\x84\x84! A\x07j!\vB\0 B\0 }\x86 P\x1B!  \x88 \x84!B\x7F!\v@@ B\x7FU\r\0 B/\x88!B!\f\v B8\x88"B|B\x88B\0 B\x83"}\x85 |!B\b!\vA! \v  
v j \blAtj  \fqAtj  \r|"\r\xA7A\xF0\xFFqAv";\0B!@  B?\x85\x88B\x83PE\r\0 B0 }\x88B\xFF\x83 B; }\x88B\x83" P"\x1B\xA7" \x07 A\x7Fsj"  I\x1B" Aj"j!BB \x1B!@@  M\r   \fq"k"  k"  I\x1B"At! \v  
v j \blAtj Atj!@@ E\r  ;\0 A~j! Aj!\f\0\v\v  j!\f\0\v\v Aj!\v   |"\x86 B\0 }\x88\x84!  }!  \x86!  j" \x07I\r\0\v 	Aj$\x80\x80\x80\x80\0\v\0@ E\r\0  \0 AtA \x9F\x80\x80\x80\0\v\v\xB0
\x7F#\x80\x80\x80\x80\0Ak$\x80\x80\x80\x80\0A!\0A\xE8\xA6\xC0\x80\0!A\xFF\xFF\xFF\xFF\x07!@ A\xE4\xA6\xC0\x80\0A\0A\xC0\xA3\xC0\x80\0\x99\x80\x80\x80\0@@#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j-\0\0\r\0A\xE8\xA6\xC0\x80\0\x9A\x80\x80\x80\0\f\v@A\0A\0A\xFEH\xE8\xA6\xC0\x80\0\r\0\v\v@A\0(\xE4\xA6\xC0\x80\0"\r\0A\0A\0\xFEA\xE8\xA6\xC0\x80\0AG\r  \0\xFE\0\0!\f\vA\0 A\x7Fj6\xE4\xA6\xC0\x80\0A\0A\0(\xE0\xA6\xC0\x80\0"A\0A\0(\xDC\xA6\xC0\x80\0 k"k AK\x1BAj6\xE0\xA6\xC0\x80\0A\0(\xD8\xA6\xC0\x80\0 Atj(\0!@A\0A\0\xFEA\xE8\xA6\xC0\x80\0AG\r\0  \0\xFE\0\0!\v (\0!@@@@@ \x84\x80\x80\x80\0A\xFF\xFFq"\x07A\x9D\x7Fj\0\vA\x7F!\b \x07A9F\r\f\vA~!\b\f\vA}!\b\v#\x81\x80\x80\x80\0A\x84\x80\x80\x80\0j"\x07 \b6\0 \x07 )\f7 A\0 \x07\xFEH\xB0\v A\xFE%\xA8AG\r\0 A\0\xFE\xAC A\xACj!  \xFE\0\0!	\f\0\v\v\xC8\x7F~\x7F~\x7F#\x80\x80\x80\x80\0A\xC0\0k"$\x80\x80\x80\x80\0 )\b! )\0! -\0!\x07A\xF0\xA3\xC0\x80\0!\b@@@@ -\0 Aq\0\v AjAj Aj)\0\x007\0\0  7  \x07:\0   7  )\07\0! Aj!\b\f\v  7  >  \x07A\x07q":\0\0  :\0  Aj!\b\v \bA:\0 \v@@ \b-\0 \r\0B\x7F!\f\vB\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\0B\0 \b)\0"B\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\0 B\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\0T\x1B P \b)\b"\xC4"	B\0S B\xFF\xFF\xFF\xFF\x83P"\x1B\x1B B\x7FQ 	B\0U \x1B\x1B!\v   \xFE\0!
 A\xC0\0j$\x80\x80\x80\x80\0A\0\v\x95\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0  \0A\0A\xFEH\0"A\0G:\0\f@@ E\r\0@ AG\r\0  \0AA\xC0\xA3\xC0\x80\0\x99\x80\x80\x80\0"A\xFF\xFFq\r\v@ \0A\xFEA\0E\r  \0AA\xC0\xA3\xC0\x80\0\x99\x80\x80\x80\0"A\xFF\xFFq\r\f\0\v\vA\0!\v Aj$\x80\x80\x80\x80\0 \v\0A\xE8\0\v\0A\0\v\xA7~\x7FB\0!@ E\r\0 A\x7Fj! !\x07@@@ (\b (\f"\bk!	 ( \bj!
 A\x7Fj"E\r@ \x07Aj(\0"\b 	 \b 	I\x1B"\vE\r\0 
 \x07(\0 \v\xFC
\0\0\v \x07A\bj!\x07  (\f \vj6\f \b 	M\r\0\f\v\v  Atj"\x07(\0!\v@@ \x07("\x07\0\v@ 	E\r\0 
 \v-\0\0 	\xFC\v\0\v  (\f 	j6\f\f\v@@ \x07 	 	 \x07K\x1B"\bE\r\0 
 \v \b\xFC
\0\0\v  (\f \bj6\f 
 \x07j!
 	 \x07I!\b 	 \x07k!	 \bE\r\0\v\vB\x80\x80\x80\x80\x80\r!\v \0 7\0\v\0 \0B\x80\x80\x80\x80\xB07\0\v\xB5\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j-\0\0E\r\0@A\0A\0A\xFEH\xEC\xA6\xC0\x80\0\r\0\f\v\vA\xEC\xA6\xC0\x80\0\x9A\x80\x80\x80\0\v  Aq:\0\v@@A  Aj"A t"  K\x1B"A\x7Fjgk"A\xFF\xFFqA}j"A\fK\r\0 B \xAC\x86\xA7jA|j At"(\xA4\xA7\xC0\x80\x006\0  6\xA4\xA7\xC0\x80\0\f\v BA  A\x83\x80jAvA\x7Fjgk"\xADB\xFF\xFF\x83\x86\xA7AtjA|j A\xFF\xFFqAt"(\xD8\xA7\xC0\x80\x006\0  6\xD8\xA7\xC0\x80\0\v@A\0A\0\xFEA\xEC\xA6\xC0\x80\0AG\r\0A\xEC\xA6\xC0\x80\0!A!  \xFE\0\0!\x07\v Aj$\x80\x80\x80\x80\0\v\xE0\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0  Aq:\0A\x7F Aj"  I\x1B"A t"  K\x1B!@@@ \0Aj"\0  \0 K\x1B"A\x7Fjg"\0AojA\fK\r\0 A\x7Fjg"\rA\0!\f\vBA  A\x83\x80jAvA\x7Fjgk\xADB\xFF\xFF\x83\x86\xA7BA  A\x83\x80jAvA\x7Fjgk\xADB\xFF\xFF\x83\x86\xA7F!\f\vBA  \0k\xADB\xFF\xFF\x83\x86\xA7BA  k\xADB\xFF\xFF\x83\x86\xA7F!\v Aj$\x80\x80\x80\x80\0 \v\x95\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0  Aq:\0A\0!@A\x7F \0Aj"  \0I\x1B"\0A t" \0 K\x1B"\0A\x7Fjg"E\r\0@@A  k"A\xFF\xFFqA}j"A\rO\r\0B \xADB\xFF\xFF\x83\x86\xA7! At"(\xA4\xA7\xC0\x80\0"\0E\r A\xA4\xA7\xC0\x80\0j  \0jA|j(\x006\0 \0!\f\v \0A\x83\x80jAv\xA2\x80\x80\x80\0!\f\v A\xF0\xA6\xC0\x80\0j!\0@ (\xF0\xA6\xC0\x80\0"A\xFF\xFFq\r\0A\xA2\x80\x80\x80\0"E\r \0  j6\0 !\f\v \0  j6\0 !\v Aj$\x80\x80\x80\x80\0 \vd\x7FBA  \0A\x7Fjgk"\0\xADB\xFF\xFF\x83\x86\xA7!@ \0A\xFF\xFFqAt"(\xD8\xA7\xC0\x80\0"\0E\r\0 A\xD8\xA7\xC0\x80\0j At \0jA|j(\x006\0 \0\vA\0 @\0"\0At \0A\x7FF\x1B\v\x9D\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j-\0\0E\r\0@A\0A\0A\xFEH\xEC\xA6\xC0\x80\0\r\0\f\v\vA\xEC\xA6\xC0\x80\0\x9A\x80\x80\x80\0\v   \xA0\x80\x80\x80\0!@A\0A\0\xFEA\xEC\xA6\xC0\x80\0AG\r\0A\xEC\xA6\xC0\x80\0!A!  \xFE\0\0!\x07\v Aj$\x80\x80\x80\x80\0 A\0 Aq\x1B\v\x95\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j-\0\0E\r\0@A\0A\0A\xFEH\xEC\xA6\xC0\x80\0\r\0\f\v\vA\xEC\xA6\xC0\x80\0\x9A\x80\x80\x80\0\v   \xA0\x80\x80\x80\0!@A\0A\0\xFEA\xEC\xA6\xC0\x80\0AG\r\0A\xEC\xA6\xC0\x80\0!A!  \xFE\0\0!\x07\v Aj$\x80\x80\x80\x80\0 \v\x93\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j-\0\0E\r\0@A\0A\0A\xFEH\xEC\xA6\xC0\x80\0\r\0\f\v\vA\xEC\xA6\xC0\x80\0\x9A\x80\x80\x80\0\v  \xA1\x80\x80\x80\0!@A\0A\0\xFEA\xEC\xA6\xC0\x80\0AG\r\0A\xEC\xA6\xC0\x80\0!A!  \xFE\0\0!\v Aj$\x80\x80\x80\x80\0 \v\r\0 \0 h\xA1\x80\x80\x80\0\v\x07\0 \0-\x008\v\x07\0 \0(4\v\x07\0 \0(0\v\x07\0 \0(,\v\x07\0 \0((\v\x07\0 \0($\v\0 \0( \0(  \0(A\0G\xAE\x80\x80\x80\0Aq\v\xBC\0@@@@@@@@@@@@@ \0\0\0\v Axj\v\v\v Axj

\v Axj	\x07	\b\vAA\0 Aq\x1B\vAA Aq\x1B\vAA Aq\x1B\vA	A Aq\x1B\vA
A\x07 Aq\x1B\vA\vA\b Aq\x1B\vAA\f Aq\x1B\vApA\r Aq\x1B\vAqA Aq\x1B\v\0\v\x07\0 \0(\v\x07\0 \0(\0\v\x07\0 \0(\f\v\x07\0 \0(\b\v\x07\0 \0(\v\x07\0 \0(\v(\0A\xB8\xA3\xC0\x80\0 \0(\0 \0(\xB6\x80\x80\x80\0 \0 \0A<A \0\x9F\x80\x80\x80\0\v*\0@ E\r\0 \0(\0  AA\0 \0((\f\x81\x80\x80\x80\0\x80\x80\x80\x80\0\v\v#\x7F@ \0A<A \0\xA5\x80\x80\x80\0"\0E\r\0 \0B7\0\v \0\v\0#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j \0A\0G:\0\0\vY\x7F#\x80\x80\x80\x80\0Ak"\0$\x80\x80\x80\x80\0 \0A\0)\xB8\xA3\xC0\x80\x007\0 \0A\bj \0A\x80\x80 \xBA\x80\x80\x80\0 \0(\b! \0/\f! \0Aj$\x80\x80\x80\x80\0A\0 A\x80\x80 j \x1B\v\x83\x7F~#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@A\r\0B\x80\x80\x80\x80\x90\x07!\f\v@ \r\0B\xFF\xFF\xFF\xFF!\f\vB\0B\x80\x80\x80\x80\x90\x07 )\0"\xA7 A\0A\0 B \x88\xA7(\0\x80\x80\x80\x80\0\x80\x80\x80\x80\0"\x1B \xAD\x84!\v \0 7\0 Aj$\x80\x80\x80\x80\0\v5\x7F@ \0\xFE\xA8E\r\0A{\v@ \0\xFE\xB0"\r\0A\0\v \0 )7\xB4 (\0\v\xB5D\x94\x7F}	{~\x7F#\x80\x80\x80\x80\0A\xF0k"$\x80\x80\x80\x80\0 \0 Atj"A\bj(\0! A\fj(\0! \0B\x007\xB4 \0 6 \0 6 \0A\0\xFE\xB0@@@@@@@@ AI\r\0@  (\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr"O\r\0A\xC4\0!A\xEE\x9D\xC0\x80\0!\f\v A|q"AF\r\0@ (\0A\xE9\xC6\xC1\xB3F\r\0A!!A\xBC\x9F\xC0\x80\0!\f\v A~q"\x07A\bF\r\0 \x07A
F\r\0@@@ /\0
"\bA\bt \bA\bvrA\xFF\xFFqAM\r\0A!A\xC2\xA0\xC0\x80\0!\f\v A\fF\r \x07AF\r \x07AF\r /\0"A\bt A\bvr!@@@ /\0"\x07A\bt \x07A\bvr"\bA\xFF\xFFqA\x80\x80K\r\0 A\xFF\xFFqA\x81\x80I\r\v B\x80\b7\xE4 A\xC4\xA5\xC0\x80\x006\xDC #\x81\x80\x80\x80\0A\x90\x80\x80\x80\0j6\xE0 A\xDCjA\xFC\xA4\xC0\x80\0A\xBD\x80\x80\x80\0A\xFF\xFFq\r\b A\xDCj \b\xBE\x80\x80\x80\0A\xFF\xFFq\r\b A\xDCjA\x8E\xA5\xC0\x80\0A\xBD\x80\x80\x80\0A\xFF\xFFq\r\b A\xDCj \xBE\x80\x80\x80\0A\xFF\xFFq\r\b A\xDCjA\x8F\xA5\xC0\x80\0A3\xBD\x80\x80\x80\0A\xFF\xFFqE\r\f\b\v A\x80\x80\x80\xA0G\r\f\v (\xE0! (\xE8!\v \0 6\xB8 \0 6\xB4\f\v@ -\0"	AvAq"\x07AG\r\0A!A\xDE\x9F\xC0\x80\0!\f\v /\0\b!
  \x07:\x008 \0 	AvAqAj"	6\x90 A\x80\x80\x80\xA8F\r\0@ -\0"\vA?M\r\0A.!A\x93\xA0\xC0\x80\0!\f\v  \vAvA<q"\v(\xC8\xA6\xC0\x80\x006(  \v(\xB8\xA6\xC0\x80\x006$ A\x80\x80\x80\xB0F\r\0  -\06, A\x80\x80\x80\xB8F\r\0  -\060 A\x80\x80\x80\xC0F\r\0  -\064 A\x80\x80\x80\xC8F\r\0@ -\0Aq"\fAM\r\0A !A\xF2\x9F\xC0\x80\0!\f\v \0 \fAt"\v6\x98 A\x80\x80\x80\xD8F\r\0@@ -\0\x1B"\rAq\r\0A\xA0\xA4\xC0\x80\0!A\xDF\xA4\xC0\x80\0!A\xDE\xA4\xC0\x80\0!A\xDD\xA4\xC0\x80\0!A\xDC\xA4\xC0\x80\0!A\xDB\xA4\xC0\x80\0!A\xDA\xA4\xC0\x80\0!A\xD9\xA4\xC0\x80\0!A\xD8\xA4\xC0\x80\0!A\xD7\xA4\xC0\x80\0!A\xD6\xA4\xC0\x80\0!A\xD5\xA4\xC0\x80\0!A\xD4\xA4\xC0\x80\0!A\xD3\xA4\xC0\x80\0!A\xD2\xA4\xC0\x80\0!\x1BA\xD1\xA4\xC0\x80\0!A\xD0\xA4\xC0\x80\0!A\xCF\xA4\xC0\x80\0!A\xCE\xA4\xC0\x80\0!A\xCD\xA4\xC0\x80\0! A\xCC\xA4\xC0\x80\0!!A\xCB\xA4\xC0\x80\0!"A\xCA\xA4\xC0\x80\0!#A\xC9\xA4\xC0\x80\0!$A\xC8\xA4\xC0\x80\0!%A\xC7\xA4\xC0\x80\0!&A\xC6\xA4\xC0\x80\0!'A\xC5\xA4\xC0\x80\0!(A\xC4\xA4\xC0\x80\0!)A\xC3\xA4\xC0\x80\0!*A\xC2\xA4\xC0\x80\0!+A\xC1\xA4\xC0\x80\0!,A\xC0\xA4\xC0\x80\0!-A\xBF\xA4\xC0\x80\0!.A\xBE\xA4\xC0\x80\0!/A\xBD\xA4\xC0\x80\0!0A\xBC\xA4\xC0\x80\0!1A\xBB\xA4\xC0\x80\0!2A\xBA\xA4\xC0\x80\0!3A\xB9\xA4\xC0\x80\0!4A\xB8\xA4\xC0\x80\0!5A\xB7\xA4\xC0\x80\0!6A\xB6\xA4\xC0\x80\0!7A\xB5\xA4\xC0\x80\0!8A\xB4\xA4\xC0\x80\0!9A\xB3\xA4\xC0\x80\0!:A\xB2\xA4\xC0\x80\0!;A\xB1\xA4\xC0\x80\0!<A\xB0\xA4\xC0\x80\0!=A\xAF\xA4\xC0\x80\0!>A\xAE\xA4\xC0\x80\0!?A\xAD\xA4\xC0\x80\0!@A\xAC\xA4\xC0\x80\0!AA\xAB\xA4\xC0\x80\0!BA\xAA\xA4\xC0\x80\0!CA\xA9\xA4\xC0\x80\0!DA\xA8\xA4\xC0\x80\0!EA\xA7\xA4\xC0\x80\0!FA\xA6\xA4\xC0\x80\0!GA\xA5\xA4\xC0\x80\0!HA\xA4\xA4\xC0\x80\0!IA\xA3\xA4\xC0\x80\0!JA\xA2\xA4\xC0\x80\0!KA\xA1\xA4\xC0\x80\0!LA!M\f\v AdjA\xC0\0I\r@A\xC0\0E\r\0 Aj AjA\xC0\0\xFC
\0\0\v A\xC3\0j! A\xC2\0j! A\xC1\0j! A\xC0\0j! A?j! A>j! A=j! A<j! A;j! A:j! A9j! A8j! A7j! A6j!\x1B A5j! A4j! A3j! A2j! A1j!  A0j!! A/j!" A.j!# A-j!$ A,j!% A+j!& A*j!' A)j!( A(j!) A'j!* A&j!+ A%j!, A$j!- A#j!. A"j!/ A!j!0 A j!1 Aj!2 Aj!3 Aj!4 AjAj!5 A\x1Bj!6 Aj!7 Aj!8 Aj!9 Aj!: Aj!; Aj!< Aj!= Aj!> Aj!? Aj!@ AjA\fj!A Aj!B Aj!C A\rj!D AjA\bj!E A\vj!F A
j!G A	j!H AjAj!I AjAj!J Aj!K Aj!L Aj!A\xDC\0!M\v -\0\0!N -\0\0!O -\0\0!P -\0\0!Q -\0\0!R -\0\0!S -\0\0! -\0\0! -\0\0! -\0\0! -\0\0! -\0\0! -\0\0! \x1B-\0\0!\x1B -\0\0! -\0\0! -\0\0! -\0\0!  -\0\0!  !-\0\0!! "-\0\0!" #-\0\0!# $-\0\0!$ %-\0\0!% &-\0\0!& '-\0\0!' (-\0\0!( )-\0\0!) *-\0\0!* +-\0\0!+ ,-\0\0!, --\0\0!- .-\0\0!. /-\0\0!/ 0-\0\0!0 1-\0\0!1 2-\0\0!2 3-\0\0!3 4-\0\0!4 5-\0\0!5 6-\0\0!6 7-\0\0!7 8-\0\0!8 9-\0\0!9 :-\0\0!: ;-\0\0!; <-\0\0!< =-\0\0!= >-\0\0!> ?-\0\0!? @-\0\0!@ A-\0\0!A B-\0\0!B C-\0\0!C D-\0\0!D E-\0\0!E F-\0\0!F G-\0\0!G H-\0\0!H I-\0\0!I J-\0\0!J K-\0\0!K L-\0\0!L -\0\0!@@ \rAq\r\0 !T\f\v  MkA\xC0\0I\r@A\xC0\0E\r\0 A\xC4\0j  MjA\xC0\0\xFC
\0\0\v MA\xC0\0j!M A\xC4\0j! -\0D!T\vA\0!U -\0?!V -\0>!W -\0=!X -\0<!Y -\0;!Z -\0:![ -\x009!\\ -\x008!] -\x007!^ -\x006!_ -\x005!\` -\x004!a -\x003!b -\x002!c -\x001!d -\x000!e -\0/!f -\0.!g -\0-!h -\0,!i -\0+!j -\0*!k -\0)!l -\0(!m -\0'!n -\0&!o -\0%!p -\0$!q -\0#!r -\0"!s -\0!!t -\0 !u -\0!v -\0!w -\0!x -\0!y -\0\x1B!z -\0!{ -\0!| -\0!} -\0!~ -\0!\x7F -\0!\x80 -\0!\x81 -\0!\x82 -\0!\x83 -\0!\x84 -\0!\x85 -\0!\x86 -\0!\x87 -\0\r!\x88 -\0\f!\x89 -\0\v!\x8A -\0
!\x8B -\0	!\x8C -\0\b!\x8D -\0\x07!\x8E -\0!\x8F -\0!\x90 -\0!\x91 -\0!\x92 -\0!\x93 -\0!\x94 \0(\x94!  	6 \0(\x94!  \v6  6 @@ \0(" 	  \fA\0G\xAE\x80\x80\x80\0vAq\r\0 \vA\x7F \f\x1B!\x95@@@ UAG\r\0A\0!\x96@ \x96AF\r A\b6\x8C B\x8C\x80\x80\x80\xA07\x84A\0! \fA\0G \x96-\0\xE0\xA4\xC0\x80\0s!@@ AG\r\0 \x96Aj!\x96\f\vA\0! A\x006\x98 B\x82\x80\x80\x807\x90 A\x84j Atj(\0!\r@@ Aj"	AF\r A\x90j j!\v 	!  \v(\0" \r \xAE\x80\x80\x80\0vAq\r\f\0\v\v Aj!\f\0\v\v\vA\0! \fA\0G U-\0\xE0\xA4\xC0\x80\0"Asq!\x96@@ AF\r \x96 At(\xE4\xA4\xC0\x80\0" 	Ir!\vAt!@@@@ E\r\0 \vE\r\f\v Aj!\f\v A\xFC\xA4\xC0\x80\0j(\0"\r \0(\x94I\r\0   \r \xAE\x80\x80\x80\0vAq\r\v Aj!\f\0\v\v\v UAj!U\f\0\v\v  \r6   6  \x95A\0 Aq\x1B6\f\v !\r\v@@ \rA	M\r\0A \rAvjt\xB3!\x97\f\vA
 \rkAtA\x80\x80\x80\xFCs\xBE!\x97\v \0 \x97C\0\0D\x948\x9C \0 F\xFD >\xFD 6\xFD .\xFD\xFD\x89\xFD\xA9\xFD\xFB\xFD\f\0\0\x80>\0\0\x80>\0\0\x80>\0\0\x80>"\x98\xFD\xE6\xFD\f\xAFB\r=\xEFC=\xD2\x908=\xD1&="\x99\xFD\xE6 \x97\xFD"\x9A\xFD\xE6\xFD\v\xFC \0 G\xFD ?\xFD 7\xFD /\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\xD4\x8B\x8A=J+\xC0=\xF2\xB5=\xC0\xE9\xA2="\x9B\xFD\xE6 \x9A\xFD\xE6\xFD\v\xDC \0 H\xFD @\xFD 8\xFD 0\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\fO#\xC9=>~\v>Qf>^\x83\xEC="\x9C\xFD\xE6 \x9A\xFD\xE6\xFD\v\xBC \0 I\xFD A\xFD 9\xFD 1\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\0\0>\x85\x8A1>u='>\x83>"\x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\x9C \0 J\xFD B\xFD :\xFD 2\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\x83>(\xC4P>L\xA7D>\xC6\xFB0>"\x9E\xFD\xE6 \x9A\xFD\xE6\xFD\v\xFC \0 K\xFD C\xFD ;\xFD 3\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\fu='>\xF6\xF7g>y\x82Z>L\xA7D>"\x9F\xFD\xE6 \x9A\xFD\xE6\xFD\v\xDC \0 L\xFD D\xFD <\xFD 4\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\x85\x8A1>\xADAv>\xF6\xF7g>(\xC4P>"\xA0\xFD\xE6 \x9A\xFD\xE6\xFD\v\xBC \0 \xFD E\xFD =\xFD 5\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\x9C \0 \x8E\xFD \x86\xFD ~\xFD v\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x99\xFD\xE6 \x9A\xFD\xE6\xFD\v\xFC \0 \x8F\xFD \x87\xFD \x7F\xFD w\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9B\xFD\xE6 \x9A\xFD\xE6\xFD\v\xDC \0 \x90\xFD \x88\xFD \x80\xFD x\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9C\xFD\xE6 \x9A\xFD\xE6\xFD\v\xBC \0 \x91\xFD \x89\xFD \x81\xFD y\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\x9C \0 \x92\xFD \x8A\xFD \x82\xFD z\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9E\xFD\xE6 \x9A\xFD\xE6\xFD\v\xFC \0 \x93\xFD \x8B\xFD \x83\xFD {\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9F\xFD\xE6 \x9A\xFD\xE6\xFD\v\xDC \0 \x94\xFD \x8C\xFD \x84\xFD |\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \xA0\xFD\xE6 \x9A\xFD\xE6\xFD\v\xBC \0 T\xFD \x8D\xFD \x85\xFD }\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\x9C \0 &\xFD \xFD \xFD N\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\xAFB\r=\xAD\xF9\xDD<4\xE6\x98<\v\xE5\x1B<"\x99\xFD\xE6 \x9A\xFD\xE6\xFD\v\x8C \0 '\xFD \xFD \xFD O\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\xD4\x8B\x8A=\xC9\xB5Y=\xF6=4\xE6\x98<"\x9B\xFD\xE6 \x9A\xFD\xE6\xFD\v\xEC \0 (\xFD  \xFD \xFD P\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\fO#\xC9=v\b\x9E=\xC9\xB5Y=\xAD\xF9\xDD<"\x9C\xFD\xE6 \x9A\xFD\xE6\xFD\v\xCC \0 )\xFD !\xFD \xFD Q\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\0\0>O#\xC9=\xD4\x8B\x8A=\xAFB\r="\x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\xAC \0 *\xFD "\xFD \xFD R\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\x83>^\x83\xEC=\xC0\xE9\xA2=\xD1&="\x9E\xFD\xE6 \x9A\xFD\xE6\xFD\v\x8C \0 +\xFD #\xFD \x1B\xFD S\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\fu='>Qf>\xF2\xB5=\xD2\x908="\x9F\xFD\xE6 \x9A\xFD\xE6\xFD\v\xEC \0 ,\xFD $\xFD \xFD \xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6\xFD\f\x85\x8A1>>~\v>J+\xC0=\xEFC="\xA0\xFD\xE6 \x9A\xFD\xE6\xFD\v\xCC \0 -\xFD %\xFD \xFD \xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\xAC \0 n\xFD f\xFD ^\xFD V\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x99\xFD\xE6 \x9A\xFD\xE6\xFD\v\x8C \0 o\xFD g\xFD _\xFD W\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9B\xFD\xE6 \x9A\xFD\xE6\xFD\v\xEC \0 p\xFD h\xFD \`\xFD X\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9C\xFD\xE6 \x9A\xFD\xE6\xFD\v\xCC \0 q\xFD i\xFD a\xFD Y\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\xAC \0 r\xFD j\xFD b\xFD Z\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9E\xFD\xE6 \x9A\xFD\xE6\xFD\v\x8C \0 s\xFD k\xFD c\xFD [\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9F\xFD\xE6 \x9A\xFD\xE6\xFD\v\xEC \0 t\xFD l\xFD d\xFD \\\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \xA0\xFD\xE6 \x9A\xFD\xE6\xFD\v\xCC \0 u\xFD m\xFD e\xFD ]\xFD\xFD\x89\xFD\xA9\xFD\xFB \x98\xFD\xE6 \x9D\xFD\xE6 \x9A\xFD\xE6\xFD\v\xAC  A\xFF\xFFq6  \bA\xFF\xFFq6  AA \x07\x1BjA\`A\xF0\xFF \x07\x1BqA\xF0\xFFq"6\f  \bAjA\xF0\xFFq"6\b ("\bAj  l"l Av j \b\x1B A\0 (\x1Bj ( A\x07jAvl!@@@@ ("\b\r\0A\x7F!A\0\r\v@ \r\0Ap!	\f\v \0 A \0\xA5\x80\x80\x80\0"	\r\f\v (\0!\v@ E\r\0A\x7F!A\0\r\v \0 \v \bA  \0\xA3\x80\x80\x80\0"	\r \0 A \0\xA5\x80\x80\x80\0"	E\r\v@  \b  \bI\x1B"E\r\0 	 \v \xFC
\0\0\v \0 \v \bA \0\x9F\x80\x80\x80\0\f\v \0 \v \bA \0\x9F\x80\x80\x80\0Ap!	A\0!\v  6  	6\0@ 
A\bt 
A\bvrA\xFF\xFFqA\bj" MO\r\0A!A\x82\x9F\xC0\x80\0!\f\b\vAA \x07\x1B! \x07A\0G! \0A j! (\f \x07A\0G"vAv!A\0)\xB8\xA3\xC0\x80\0"\xA1B \x88\xA7! \xA1\xA7!M \x07AF!A\0!@@@@@  F\r  F\r  Aj"kAI\r  j-\0\0!\x07    j(\0\0"At A\x80\xFEqA\btr A\bvA\x80\xFEq Avrr"j" I:\0\xDC  I\r@  O\r\0 \0A\xCD\x006\xB8 \0A\xA0\x9D\xC0\x80\x006\xB4A\xE4\0!\f\x07\v  Aj"\bkAI\r  A\x07j"F\r@ \x07A?K\r\0 \0A6\xB8 \0A\xE3\x9E\xC0\x80\x006\xB4A\xE4\0!\f\x07\v@  j,\0\0"A\x7FJ\r\0 \0A/6\xB8 \0A\xE0\xA0\xC0\x80\x006\xB4A\xE5\0!\f\x07\v  \bj/\0\0!\b  A8lj"\vA A\xF0qAvt6\0@ AqE\r\0 \0A&6\xB8 \0A\x90\xA1\xC0\x80\x006\xB4A\xE5\0!\f\x07\v  A\0Gs! \bA\bt \bA\bvrA\xFF\xFFq!  \x07Av"\x1Bj!A\0!\x07 \vA\x006 \vA\x006\b (\bAv!	@@ 	 \x07A\xFF\xFFqM\r \v(\0!@ "
A\xFFq"Av! 	 \x07 j"\bA\xFF\xFFqI\r\0\v@@ \v(\f" \v(\b"M\r\0 \v(!\r\f\vA9!A\0\r	 MA\x7F Aj"Av jA j"\r \r I\x1B"AlAA\0 (\0\x80\x80\x80\x80\0\x80\x80\x80\x80\0"\rE\r	@@ \v(\b"\r\0@ \v(\f"\r\0A\0!\f\v \0 \v( AlA \0\x9F\x80\x80\x80\0 \v(\b!\f\v \v(\f! \v(!\f@ At"E\r\0 \r \fA \x1B \xFC
\0\0\v@ E\r\0 \r Atj \f AtjA \x1B \xFC
\0\0\v \v(\f"E\r\0 \0 \v( AlA \0\x9F\x80\x80\x80\0\v \v 6\f \v \r6\v \v Aj6\b \r Atj \x07;\0 \r Atj j 
:\0\0 \b!\x07 \v(\r\0 \v 6 \b!\x07\f\0\v\v@ \v(\b l" F\r\0 B\x80\b7\xE4 A\xC4\xA5\xC0\x80\x006\xDC #\x81\x80\x80\x80\0A\x90\x80\x80\x80\0j6\xE0 A\xDCjA\xD4\xA5\xC0\x80\0A!\xBD\x80\x80\x80\0A\xFF\xFFq\r A\xDCj \xBF\x80\x80\x80\0A\xFF\xFFq\r A\xDCjA\xF5\xA5\xC0\x80\0A\b\xBD\x80\x80\x80\0A\xFF\xFFq\r A\xDCj \xBF\x80\x80\x80\0A\xFF\xFFq\r A\xDCjA\xFD\xA5\xC0\x80\0A\xBD\x80\x80\x80\0A\xFF\xFFq\r (\xE0! \0 (\xE86\xB8 \0 6\xB4A\xE4\0!\f\x07\v A\xBCj \v( \v( \xC0\x80\x80\x80\0 /\xC4"\r \v )\xBC7 At!	  \x1Bk!A\0!A\0!\x07@@ 	 F\r AI\r \v( j  j/\0\0"\bA\bt \bA\bvrA\xFF\xFFq"\b6\0 \x07 \bj!\x07 Aj! A~j! Aj!\f\0\v\v A\xC8j \v( \v(  \xC0\x80\x80\x80\0 /\xD0"\r \v )\xC87A\0!@@ 	 F\r \v( j 6\0   \v( j(\0j" I:\0\xDC  I\r Aj! !\f\0\v\v  K\r \v :\x004 \v 60 \v \x076( \v 6$ Aj! !\f\0\v\v@@@ \0(\0E\r\0#\x81\x80\x80\x80\0A\x80\x80\x80\x80\0j-\0\0E\r@A\0A\0A\xFEH\xE8\xA6\xC0\x80\0\r\0\f\v\v A\x9Cj \0(\xA0 \0(\xA4 \xC1\x80\x80\x80\0 /\xA4"\r \0 )\x9C7\xA0 \0A\xCC\0j! AlAj!\bA\0!A\0!@ \b Aj"\x07F\r A\0\xFE\0 \0(\xA0 j" \x006\0 A\fjB\x007\0 A\bj ATj6\0 Aj 6\0 \0(\xA0"	 j! A8j! \x07! \x84\x80\x80\x80\0A\xFF\xFFq"E\r\0\v \0 	 \x07jAxj)\x007\xB4\f\vA\xE8\xA6\xC0\x80\0\x9A\x80\x80\x80\0\v A\xA8j \0(\xA0 \0(\xA4 \0(\0" t"\xC1\x80\x80\x80\0@ /\xB0"E\r\0A\0A\0\xFEA\xE8\xA6\xC0\x80\0AG\rA\xE8\xA6\xC0\x80\0!\0A! \0 \xFE\0\0!\xA2\f\v \0 )\xA87\xA0 Al!MA\0)\xB8\xA3\xC0\x80\0!\xA1A\0!\fA\0!@@@  F\r  A8lj"
A\0\xFE, \f! !\x07@@@@@ \x07E\r\0 \0(\xA0 j" \x006\0 A\fjB\x007\0 A\bj 
6\0 Aj 6\0 \0(\xA0!\b A\0(\xE4\xA6\xC0\x80\0Aj"E":\0\xDC  :\0\xC8@ \r\0A9!\f\b\vA\0(\xD8\xA6\xC0\x80\0!	@A\0(\xDC\xA6\xC0\x80\0" I\r\0 	! !\f\vA\x7F Av jAj"  I\x1B! E\r  A\xFF\xFF\xFF\xFFK:\0\xDC A\x80\x80\x80\x80O\r \0 	 AtA At \0\xA3\x80\x80\x80\0"E\r A\xFF\xFF\xFF\xFFq!\v\f\v \f Mj!\f Aj!\f\vA\0!A\0!\v\v@@@@@ E\r\0 \v!A\0(\xE0\xA6\xC0\x80\0"	 A\0(\xE4\xA6\xC0\x80\0"kK\r\f\v  \xA17\xC8 A\xDCj A\xC8j \xC2\x80\x80\x80\0 /\xE0"\r\b 	A\0(\xE0\xA6\xC0\x80\0"\vAtj! (\xDC! \v A\0(\xE4\xA6\xC0\x80\0"\rkO\r \rAt"\vE\r   \v\xFC
\0\0\f\v@  	k"\r  \rk"M\r\0 \v k M\r\0 At"	E\r  Atj  	\xFC
\0\0\f\vA\0 \v \rk"6\xE0\xA6\xC0\x80\0 \rAt"\vE\r  Atj  	Atj \v\xFC
\0\0\f\v@  \vk"\vAt"E\r\0   \xFC
\0\0\v \r \vkAt"\vE\r\0  j 	 \v\xFC
\0\0\vA\0 6\xDC\xA6\xC0\x80\0A\0 6\xD8\xA6\xC0\x80\0A\0A\x006\xE0\xA6\xC0\x80\0 E\r \0 	 AtA \0\x9F\x80\x80\x80\0A\0(\xD8\xA6\xC0\x80\0!A\0(\xDC\xA6\xC0\x80\0!\f\vA\0 6\xDC\xA6\xC0\x80\0A\0 6\xD8\xA6\xC0\x80\0\v A\0(\xE0\xA6\xC0\x80\0"A\0  k"kA\0(\xE4\xA6\xC0\x80\0" I\x1BAtj Atj  \bj6\0A\0A\0(\xE4\xA6\xC0\x80\0Aj6\xE4\xA6\xC0\x80\0 Aj! \x07A\x7Fj!\x07\f\0\v\v\v \0A\xFE\xAC@ E\r\0A\xE4\xA6\xC0\x80\0!  \xFE\0\0!\xA3\v \0 \xFE\xA8A\0!A\0A\0\xFEA\xE8\xA6\xC0\x80\0AG\r\rA\xE8\xA6\xC0\x80\0!\0A! \0 \xFE\0\0!\xA4\f\r\vA\0A\0\xFEA\xE8\xA6\xC0\x80\0AG\rA\xE8\xA6\xC0\x80\0!\0A! \0 \xFE\0\0!\xA5\f\v \0A76\xB8 \0A\xB7\xA1\xC0\x80\x006\xB4\vA\xE3\0!\f\vA\xE7\0!\f\vA9!\v A\x9D\x7Fj\0\vA~!\f\vA|!\f\vA{!\f\vAz!\f\vA\x7F!\f\v \0 6\xB8 \0 6\xB4\vA}!\v A\xF0j$\x80\x80\x80\x80\0 \v\xDD\x7F~#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0A\0!@@@  K\r\0A\0!\f\v  j!@@ \0(\f"\x07  k"j \0(\bK\r\0@ E\r\0 \0( \x07j  \xFC
\0\0\v \0 \0(\f j6\f\f\v \0(\0(\0!\x07  6  6\0 A\bj \0 AA \x07\x81\x80\x80\x80\0\x80\x80\x80\x80\0 )\b"\bB \x88\xA7"A\xFF\xFFq\r \b\xA7!\v  j!\f\0\v\v Aj$\x80\x80\x80\x80\0 \v\0 \0 A\xFF\xFFq\xBF\x80\x80\x80\0\v\xEB\x7F#\x80\x80\x80\x80\0A0k"$\x80\x80\x80\x80\0A\0!@@ A\xE4\0I\r Aj jAj  A\xE4\0n"A\xE4\0lk" A\xFFqA
n"A
lkA\bt rA\xB0\xE0\0r;\0\0 A~j! !\f\0\v\v@@ A	K\r\0 Aj jA j A0r:\0\0 A j!\f\v Aj jAj  A\xFFqA
n"A
lkA\bt rA\xB0\xE0\0r;\0\0 Aj!\v \0 Aj jA! k\xBD\x80\x80\x80\0! A0j$\x80\x80\x80\x80\0 \v\x9E\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@ \r\0 A\x90\x89\xC0\x80\x006 A\bj  \xC2\x80\x80\x80\0@ /\f"E\r\0\f\vA\0! (\b!\f\v@ E\r\0A\0! A\0:\0\b@@A\0\r\0   At"A At"\x07 \xA3\x80\x80\x80\0"\r  \x07A \xA5\x80\x80\x80\0"\r\vA9!\f\v@ \x07  \x07 I\x1B"\x07E\r\0   \x07\xFC
\0\0\v   A \x9F\x80\x80\x80\0\f\v A\x90\x89\xC0\x80\x006\f A\bj  \xC4\x80\x80\x80\0A\0!A|!A\0!\v \0 ;\b \0 6 \0 6\0 Aj$\x80\x80\x80\x80\0\v\x80\x7F~\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0@@@@ \r\0  \xADB~"B \x88\xA7"A\0G:\0\b@ E\r\0B\x80\x80\x80\x80\x90\x07!\f\v@@ \xA7"\r\0B\xFC\xFF\xFF\xFF!\f\vB\0B\x80\x80\x80\x80\x90\x07  A \xA5\x80\x80\x80\0"\x1B \xAD\x84! E\r\v \xA7!\f\v@ E\r\0  \xADB~"B \x88\xA7"A\0G:\0\f@ \r\0@   Al"A \xA7" \xA3\x80\x80\x80\0"E\r\0 An!\f\v  A \xA5\x80\x80\x80\0"E\r\0@    I\x1B"\x07E\r\0   \x07\xFC
\0\0\v   A \x9F\x80\x80\x80\0 An!\f\vA9!\f\v A\x90\x89\xC0\x80\x006   \xC3\x80\x80\x80\0A\0!A|!\vA\0!\f\v B \x88\xA7!\v \0 ;\b \0 6 \0 6\0 Aj$\x80\x80\x80\x80\0\v\x9F\x7F~#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0 )\0!  A\xFF\xFF\xFF\xFFK:\0\f@@ A\x80\x80\x80\x80I\r\0B\x80\x80\x80\x80\x90\x07!\f\v@ At"\r\0B\xFC\xFF\xFF\xFF!\f\vB\0B\x80\x80\x80\x80\x90\x07 \xA7 AA\0 B \x88\xA7(\0\x80\x80\x80\x80\0\x80\x80\x80\x80\0"\x1B \xAD\x84!\v \0 7\0 Aj$\x80\x80\x80\x80\0\v-\0@ E\r\0 \0(\0  AlAA\0 \0((\f\x81\x80\x80\x80\0\x80\x80\x80\x80\0\v\v-\0@ E\r\0 \0(\0  AtAA\0 \0((\f\x81\x80\x80\x80\0\x80\x80\x80\x80\0\v\v\b\0 \0A\xACj\v\x8C\x7F#\x80\x80\x80\x80\0A k"$\x80\x80\x80\x80\0 \0 Atj"\0A\bj!@@@@@ \0A\fj(\0"\r\0 A\x90\x89\xC0\x80\x006 Aj A\fj \xBA\x80\x80\x80\0 /\r (!\0\f\v (\0! E\rA\0\r\0   A\0  \xA3\x80\x80\x80\0"\0\r  A\0 \xA5\x80\x80\x80\0"\0E\r\0@    I\x1B"E\r\0 \0  \xFC
\0\0\v   A\0 \x9F\x80\x80\x80\0\f\vA\0!\0\f\vA\0!   A\0 \x9F\x80\x80\x80\0A\x7F!\0\v  6  \x006\0\v A j$\x80\x80\x80\x80\0 \0\v\x99\x7F#\x80\x80\x80\x80\0Ak"$\x80\x80\x80\x80\0  \0\xFD\0\b\xFD\v\0A\0!@@ AF\r@  j"Aj(\0"E\r\0  (\0 A\0 \x9F\x80\x80\x80\0\v A\bj!\f\0\v\vA\0!@@ A\xF0\0F\r@ \0 j"A,j(\0"E\r\0  A$j(\0 AlA \x9F\x80\x80\x80\0\vA\xB8\xA3\xC0\x80\0 A4j(\0 A8j(\0\xC4\x80\x80\x80\0A\xB8\xA3\xC0\x80\0 A<j(\0 A\xC0\0j(\0\xC4\x80\x80\x80\0 A8j!\f\0\v\vA\xB8\xA3\xC0\x80\0 \0(\xA0 \0(\xA4\xC3\x80\x80\x80\0  \0A\xBCA \x9F\x80\x80\x80\0 Aj$\x80\x80\x80\x80\0\v\0@ \0(\xB4\r\0A\0\v \0(\xB8\v\b\0 \0(\xB4\v \0 \0(\x90 \0(\x94 \0(\x98A\0G\xAE\x80\x80\x80\0Aq\v\xA8\x7F@ A\xBCA \xA5\x80\x80\x80\0"E\r\0 B7 B7 B7\b  6  \x006\0@A8E"\r\0 A jA\x80\xA6\xC0\x80\0A8\xFC
\0\0\v@ \r\0 A\xD8\0jA\x80\xA6\xC0\x80\0A8\xFC
\0\0\v B\x007\xA4 A6\xA0  6\x94 A\xACj\xFD\f\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFD\v\0\v \v\v\xF1&\x90\b\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xC8\0\b	
\v\x1B\f\r\x07 !(0)"#*1892+$%,3:;4-&'.5<=6/7>?\0\b	
\v\x1B (!")081*#+29:3;\f\r\x07$,%&-4<5.'/6=>7?\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\x07\0\0\0\xFF\xFF\xFF\xFF	\0\0\0\xFF\xFF\xFF\xFF\v\0\0\0\xFF\xFF\xFF\xFF\r\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\x1B\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\0\0\0\0
\0\0\0\0\0\0\0\f\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x07\0\0\0\0\0\0	\0\0\0\0\0\0\v\0\0\0\0\0\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1B\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFF\xFF\xFF\xFF\b\0\0\0\xFF\xFF\xFF\xFF
\0\0\0\xFF\xFF\xFF\xFF\f\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\0\0\0\xFF\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\b\0\0\0\xFE\xFF\xFF\xFF
\0\0\0\xFE\xFF\xFF\xFF\f\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\0\0\0\xFE\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFE\xFF\xFF\xFF\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x07\0\0\0\0\0\0\0	\0\0\0\0\0\0\0\v\0\0\0\0\0\0\0\r\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\x1B\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\x07\0\0\0\xFC\xFF\xFF\xFF	\0\0\0\xFC\xFF\xFF\xFF\v\0\0\0\xFC\xFF\xFF\xFF\r\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\x1B\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\0\0\0\xFC\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xFC\xFF\xFF\xFF\0\0\0\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0\0\0\0\0
\0\0\0\0\0\0\0\f\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\b\0\0\0\xF8\xFF\xFF\xFF
\0\0\0\xF8\xFF\xFF\xFF\f\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\0\0\0\xF8\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\0\0\0\xE0\xFF\xFF\xFF\b\0\0\0\xE0\xFF\xFF\xFF
\0\0\0\xE0\xFF\xFF\xFF\f\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\0\0\0\xE0\xFF\xFF\xFF\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0\xFF\0\0\0\0\0\0\0Packet is smaller than the picture data size indicated in the picture header.\0Packet is smaller than the frame size indicated in the frame header.\0Invalid DC code stream.\0Invalid AC code stream.\0Picture header size too small.\0Frame header size too small.\0Slice header size too small.\0Invalid packet header frame type.\0Invalid frame type.\0Invalid alpha info header field.\0Invalid aspect ratio information header field.\0Version > 1 is not supported.\0Slice widths larger than 128 are not supported.\0Only slice heights of 1 are supported.\0Slice data extends past the bounds of the picture data.\0Channel data planes too large to fit into slice data.\0\0\0\0\xA0\0\xA0\b\0\xA0\b\0\xA0\v\0\xA0\v\0\xA0\f\0\xA0\f\0\0\0\0\0\xA0\0\xA0\0\xA0\0\xA0\0\xA0\0\xA0	\0\xA0	\0\xA0	\0\xA0	\0\xA0\b\0\xA0\b\0\xA0\b\0\xA0\b\0\xA0\b\0\xA0\b\0\xA0
\0\xA0\0\xA0\x07\0\xA0\0\xA0\0\xA0\0\xA0\b\0\xA0\b\0\xA0\b\0\xA0\b\0\xA0
\0\0\0\0\0\0\0\0\0\0\0\0\x90\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\b\0\0\0
\0\0\0\f\0\0\0Frame dimensions (x) exceed the maximum supported size of 16384x16384.\0\0\0\0\0\0\0\0\x07\0\0\0\b\0\0\0Unexpected slice count: expected , found .\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0	\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`;
var J = async (t, e) => {
	const { instance: r } = await WebAssembly.instantiate(t, { env: {
		memory: e,
		externPrint: (o, i) => {
			const s = new Uint8Array(e.buffer, o, i);
			console.log(T(s));
		}
	} });
	return r.exports;
};
var D = `"use strict";var h=(e=>(e[e.OutOfMemory=-1]="OutOfMemory",e[e.UnexpectedEof=-2]="UnexpectedEof",e[e.InvalidData=-3]="InvalidData",e[e.NotSupported=-4]="NotSupported",e[e.InvalidState=-5]="InvalidState",e[e.Overflow=-6]="Overflow",e))(h||{});function f(e){if(!e)throw new Error("Assertion failed.")}const O=e=>{let t=0,r="";for(;t<e.length;){let o=e[t++];if(o>127)if(o>191&&o<224){if(t>=e.length)throw new Error("UTF-8 decode: incomplete 2-byte sequence");o=(o&31)<<6|e[t++]&63}else if(o>223&&o<240){if(t+1>=e.length)throw new Error("UTF-8 decode: incomplete 3-byte sequence");o=(o&15)<<12|(e[t++]&63)<<6|e[t++]&63}else if(o>239&&o<248){if(t+2>=e.length)throw new Error("UTF-8 decode: incomplete 4-byte sequence");o=(o&7)<<18|(e[t++]&63)<<12|(e[t++]&63)<<6|e[t++]&63}else throw new Error("UTF-8 decode: unknown multibyte start 0x"+o.toString(16)+" at index "+(t-1));if(o<=65535)r+=String.fromCharCode(o);else if(o<=1114111)o-=65536,r+=String.fromCharCode(o>>10|55296),r+=String.fromCharCode(o&1023|56320);else throw new Error("UTF-8 decode: code point 0x"+o.toString(16)+" exceeds UTF-16 reach")}return r};Symbol.dispose??=Symbol("dispose");Symbol.asyncDispose??=Symbol("asyncDispose");const S=["I420","I420P10","I420P12","I420A","I420AP10","I420AP12","I422","I422P10","I422P12","I422A","I422AP10","I422AP12","I444","I444P10","I444P12","I444A","I444AP10","I444AP12"];new FinalizationRegistry(({runtime:e,ptr:t})=>{e.exports.closeFrame(t)});const _=(e,t,r,o)=>{const i=e.getFrameDataPtr(r),a=e.getFrameDataSize(r),I=new Uint8Array(t.buffer,i,a),u=S[e.getFramePixelFormat(r)];f(u!==void 0);const l=S[e.getOriginalPixelFormat(o)];f(l!==void 0);const c=["progressive","interlaced-top-field-first","interlaced-bottom-field-first"][e.getScanType(r)];return f(c!==void 0),{frameData:I,codedWidth:e.getCodedWidth(r),codedHeight:e.getCodedHeight(r),visibleWidth:e.getVisibleWidth(r),visibleHeight:e.getVisibleHeight(r),pixelFormat:u,originalPixelFormat:l,pixelAspectRatio:{num:e.getAspectRatioNum(r),den:e.getAspectRatioDen(r)},colorPrimaries:e.getColorPrimaries(r),colorTransfer:e.getColorTransfer(r),colorMatrix:e.getColorMatrix(r),colorRangeFull:!1,scanType:c}};var n=(e=>(e[e.SharedMemoryInit=0]="SharedMemoryInit",e[e.MessagePassingInit=1]="MessagePassingInit",e[e.CreateDecoder=2]="CreateDecoder",e[e.CloseDecoder=3]="CloseDecoder",e[e.Decode=4]="Decode",e[e.Ready=5]="Ready",e[e.InitOutOfMemoryError=6]="InitOutOfMemoryError",e[e.Decoded=7]="Decoded",e[e.DecodeError=8]="DecodeError",e))(n||{});const A=async(e,t)=>{const{instance:r}=await WebAssembly.instantiate(e,{env:{memory:t,externPrint:(o,i)=>{const a=new Uint8Array(t.buffer,o,i);console.log(O(a))}}});return r.exports};let d=null;const F=async e=>{switch(e.type){case n.SharedMemoryInit:{const t=await A(e.wasmBinary,e.memory);throw t.__stack_pointer.value=e.stackPointer,t.__wasm_init_tls(e.tlsPointer),t.setIsBrowserMainThread(0),t.startWorker(),new Error("Unexpected worker termination.")}case n.MessagePassingInit:{const t=new WebAssembly.Memory({initial:32,maximum:8192,shared:!0}),r=await A(e.wasmBinary,t),o=r.allocateThreadLocalState(r.__tls_size.value,r.__tls_align.value);if(o===0){s({type:n.InitOutOfMemoryError,message:"Failed to allocate thread-local state."});return}r.__wasm_init_tls(o),r.setIsBrowserMainThread(0);const i=r.createFrame();if(i===0){s({type:n.InitOutOfMemoryError,message:"Failed to create frame."});return}d={exports:r,memory:t,decoders:new Map,frame:i},s({type:n.Ready});return}case n.CreateDecoder:{f(d);const{exports:t}=d,{decoderId:r,bitDepth:o,allowedOutputFormats:i}=e,a=t.createDecoder(0,o,i);if(a===0)return;d.decoders.set(r,a);return}case n.CloseDecoder:{f(d);const{exports:t,decoders:r}=d,o=r.get(e.decoderId);o!==void 0&&(t.closeDecoder(o),r.delete(e.decoderId));return}case n.Decode:{f(d);const{exports:t,memory:r,decoders:o,frame:i}=d,{id:a,decoderId:I,packet:u,frameBuffer:l}=e,c=o.get(I);if(c===void 0){s({type:n.DecodeError,id:a,code:h.OutOfMemory});return}const g=t.allocatePacket(c,u.byteLength,0);if(g===0){s({type:n.DecodeError,id:a,code:h.OutOfMemory});return}new Uint8Array(r.buffer).set(u,g);const D=t.decodePacket(c,i,0);if(D<0){let v;const P=t.getErrorMessagePtr(c);if(P!==0){const b=t.getErrorMessageSize(c);v=O(new Uint8Array(r.buffer,P,b))}s({type:n.DecodeError,id:a,code:D,message:v});return}const m=_(t,r,i,c),y=l&&l.byteLength===m.frameData.byteLength?l:new ArrayBuffer(m.frameData.byteLength),p=new Uint8Array(y);p.set(m.frameData),m.frameData=p,s({type:n.Decoded,id:a,contents:m},[y]);return}}},s=(e,t)=>{w?w.postMessage(e,t??[]):self.postMessage(e,{transfer:t??[]})};let w=null;typeof self>"u"&&(w=require("node:worker_threads").parentPort);w?w.on("message",F):self.addEventListener("message",e=>void F(e.data));
`;
var w = null;
var P = () => {
	if (w) return w;
	w = new Uint8Array(k.length);
	for (let t = 0; t < k.length; t++) w[t] = k.charCodeAt(t);
	return w;
};
var U = async () => {
	if (typeof Worker < "u" && !("Bun" in globalThis)) {
		const e = new Blob([D], { type: "text/javascript" }), r = URL.createObjectURL(e);
		return new E(new Worker(r, { type: "module" }), null);
	}
	return new E(null, new (await (import(
		/* @vite-ignore */
		"node:" + L("worker_threads")
))).Worker(D, { eval: true }));
};
var E = class {
	constructor(e, r) {
		__publicField(this, "wrappedListeners", /* @__PURE__ */ new Map());
		this.webWorker = e, this.nodeWorker = r;
	}
	postMessage(e, r) {
		this.webWorker ? this.webWorker.postMessage(e, { transfer: r ?? [] }) : this.nodeWorker.postMessage(e, r ?? []);
	}
	addEventListener(e, r, o) {
		if (this.webWorker) this.webWorker.addEventListener(e, r, o);
		else {
			const i = (s) => r({ data: s });
			this.wrappedListeners.set(r, i), o?.once ? this.nodeWorker.once(e, i) : this.nodeWorker.on(e, i);
		}
	}
	removeEventListener(e, r) {
		this.webWorker ? this.webWorker.removeEventListener(e, r) : (this.nodeWorker.off(e, this.wrappedListeners.get(r)), this.wrappedListeners.delete(r));
	}
	terminate() {
		this.webWorker ? this.webWorker.terminate() : this.nodeWorker.terminate();
	}
};
var F = new FinalizationRegistry((t) => {
	for (const e of t) e.terminate();
});
var K = async () => {
	if (typeof navigator < "u" && navigator.hardwareConcurrency) return navigator.hardwareConcurrency;
	const t = await import(
		/* @vite-ignore */
		"node:" + L("os")
);
	return t.availableParallelism?.() ?? t.cpus().length;
};
var _ = null;
var Z = new y();
var $ = async () => {
	const t = await Z.acquire();
	try {
		if (_) {
			const r = _.deref();
			if (r) return r;
		}
		const e = await v.init();
		return _ = new WeakRef(e), e;
	} finally {
		t();
	}
};
var S = null;
var ee = () => {
	let t = S?.deref();
	return t || (t = new re(), S = new WeakRef(t)), t;
};
var q = class {
	constructor() {
		__publicField(this, "workers", []);
		__publicField(this, "refCount", 0);
		F.register(this, this.workers, this);
	}
	ref() {
		this.refCount++;
	}
	unref() {
		this.refCount--, !(typeof window < "u" && typeof document < "u") && this.refCount === 0 && this.destroy();
	}
	destroy() {
		for (const e of this.workers) e.terminate();
		this.workers.length = 0, F.unregister(this);
	}
};
var v = class _v extends q {
	constructor(e, r) {
		super(), this.memory = e, this.exports = r;
	}
	static async init() {
		const e = new WebAssembly.Memory({
			initial: 32,
			maximum: 65536,
			shared: true
		}), r = await J(P(), e), o = r.allocateThreadLocalState(r.__tls_size.value, r.__tls_align.value);
		if (o === 0) throw new Error("Failed to allocate thread-local state.");
		r.__wasm_init_tls(o);
		const i = typeof window < "u" && typeof document < "u" && self === window;
		return r.setIsBrowserMainThread(Number(i)), new _v(e, r);
	}
	async ensureWorkers(e) {
		for (; this.workers.length < e;) {
			const r = this.exports.allocateWorkerStack(), o = this.exports.allocateThreadLocalState(this.exports.__tls_size.value, this.exports.__tls_align.value);
			if (r === 0 || o === 0) throw new Error("Failed to allocate worker stack or thread-local state.");
			const i = await U();
			i.postMessage({
				type: l.SharedMemoryInit,
				wasmBinary: P(),
				memory: this.memory,
				stackPointer: r,
				tlsPointer: o
			}), this.workers.push(i);
		}
	}
	destroy() {
		super.destroy(), _ = null;
	}
};
var re = class extends q {
	constructor() {
		super(...arguments);
		__publicField(this, "workerLoad", []);
		__publicField(this, "nextRequestId", 0);
		__publicField(this, "nextDecoderId", 0);
		__publicField(this, "registeredDecoders", /* @__PURE__ */ new Map());
	}
	registerDecoder(e, r, o) {
		this.registeredDecoders.set(e, {
			bitDepth: r,
			allowedOutputFormats: o
		});
		for (const i of this.workers) i.postMessage({
			type: l.CreateDecoder,
			decoderId: e,
			bitDepth: r,
			allowedOutputFormats: o
		});
	}
	unregisterDecoder(e) {
		this.registeredDecoders.delete(e);
		for (const r of this.workers) r.postMessage({
			type: l.CloseDecoder,
			decoderId: e
		});
	}
	async ensureWorkers(e) {
		const r = e - this.workers.length;
		if (r <= 0) return;
		const o = await Promise.all(Array.from({ length: r }, async () => {
			const s = await U(), n = await new Promise((a) => {
				s.postMessage({
					type: l.MessagePassingInit,
					wasmBinary: P()
				}), s.addEventListener("message", (c) => a(c.data), { once: true });
			});
			return n.type === l.InitOutOfMemoryError ? (s.terminate(), new p(n.message)) : s;
		})), i = o.find((s) => s instanceof Error);
		if (i) {
			for (const s of o) s instanceof Error || s.terminate();
			return i;
		}
		for (const s of o) {
			this.workers.push(s), this.workerLoad.push(0);
			for (const [n, { bitDepth: a, allowedOutputFormats: c }] of this.registeredDecoders) s.postMessage({
				type: l.CreateDecoder,
				decoderId: n,
				bitDepth: a,
				allowedOutputFormats: c
			});
		}
	}
	destroy() {
		super.destroy(), S = null;
	}
};
var M = [
	"ap4x",
	"ap4h",
	"apch",
	"apcn",
	"apcs",
	"apco"
];
var z$2 = class {
	constructor() {
		/** @internal */
		__publicField(this, "_closed", false);
		/** @internal */
		__publicField(this, "_queue", Promise.resolve());
		/** @internal */
		__publicField(this, "_decodeQueueSize", 0);
		/** @internal */
		__publicField(this, "_dequeuedResolve");
		/** @internal */
		__publicField(this, "_dequeued", new Promise((e) => {
			this._dequeuedResolve = e;
		}));
	}
	/**
	* The number of decoding tasks that have been queued but have not yet finished. You can monitor this value
	* to apply backpressure if the decoder can't keep up with your supply of packets.
	*/
	get decodeQueueSize() {
		return this._decodeQueueSize;
	}
	/**
	* The number of additional packets that can be queued for decoding before the decoder's internal high-water mark
	* is reached, mirroring `desiredSize` from the Web Streams API. Keep queuing packets while this is positive to
	* make the most of the decoder performance-wise.
	*/
	get desiredSize() {
		return this._highWaterMark - this._decodeQueueSize;
	}
	/**
	* Resolves whenever a packet queued for decoding finishes decoding. Use it in conjunction with
	* `decodeQueueSize` to apply backpressure.
	*/
	get dequeued() {
		return this._dequeued;
	}
	/** @internal */
	_markDequeued() {
		this._decodeQueueSize--, this._dequeuedResolve(), this._dequeued = new Promise((e) => {
			this._dequeuedResolve = e;
		});
	}
	/** Creates a new ProRes decoder instance with the given options. */
	static async create(e) {
		if (typeof e != "object" || !e) throw new TypeError("options must be an object.");
		if (!M.includes(e.proresFourCc)) throw new TypeError(`options.proresFourCc must be one of ${M.join(", ")}.`);
		if (typeof e.useSharedMemory != "boolean") throw new TypeError("options.useSharedMemory must be a boolean.");
		if (e.concurrency !== void 0 && (!Number.isInteger(e.concurrency) || e.concurrency < 0)) throw new TypeError("options.concurrency, when provided, must be a non-negative integer.");
		if (e.allowedOutputFormats && !(Array.isArray(e.allowedOutputFormats) && e.allowedOutputFormats.length > 0 && e.allowedOutputFormats.every((s) => g.includes(s)))) throw new TypeError(`options.allowedOutputFormats, when provided, must be a non-empty array containing any of: ${g.join(", ")}.`);
		if (e.useSharedMemory && !I) return new C(`Shared memory is not available in this environment, so useSharedMemory: true cannot be used.
Since it provides way better performance, you should enable it by serving the page cross-origin isolated by setting the Cross-Origin-Opener-Policy header to 'same-origin' and the Cross-Origin-Embedder-Policy header to 'credentialless' or 'require-corp' (only the latter is supported by Safari).
Otherwise, pass useSharedMemory: false to use a slower, worker-based fallback.`);
		let r;
		if (e.allowedOutputFormats) {
			r = 0;
			for (const s of e.allowedOutputFormats) r |= 1 << g.indexOf(s);
		} else r = 4294967295;
		const o = e.proresFourCc === "ap4h" || e.proresFourCc === "ap4x" ? 12 : 10, i = e.concurrency ?? await K();
		if (e.useSharedMemory || i === 0) {
			const s = await $();
			s.ref(), await s.ensureWorkers(i);
			const n = s.exports.createDecoder(i, o, r);
			return n === 0 ? (s.unref(), new p()) : new te(s, n, i);
		} else {
			const s = ee();
			s.ref();
			const n = await s.ensureWorkers(i);
			return n ? (s.unref(), n) : new oe(s, i, o, r);
		}
	}
	/** Whether the environment supports proper shared-memory multithreading. */
	static canUseSharedMemory() {
		return I;
	}
	/**
	* Queues a ProRes packet for decoding with the given options. The decoded result will be stored in the passed
	* frame. Returns a promise that resolves either with the populated frame or with an error that occurred.
	*
	* Decoded frames will always be emitted in the same order in which their packets were queued for decoding.
	*/
	async decode(e, r, o = {}) {
		if (!(e instanceof Uint8Array)) throw new TypeError("packetData must be a Uint8Array.");
		if (!(r instanceof X)) throw new TypeError("frame must be a Frame.");
		if (typeof o != "object" || !o) throw new TypeError("options must be an object.");
		if (o.transfer !== void 0 && typeof o.transfer != "boolean") throw new TypeError("options.transfer, when provided, must be a boolean.");
		if (this._closed) return new j();
		if (r._locked) return new O();
		r._reset(), r._locked = true, this._decodeQueueSize++;
		const i = this._runDecode(e, r, o);
		i.catch(() => {});
		const s = this._queue.then(() => i).finally(() => {
			r._locked = false, queueMicrotask(() => {
				this._decodeQueueSize--, this._dequeuedResolve(), this._dequeued = new Promise((n) => {
					this._dequeuedResolve = n;
				});
			});
		});
		return this._queue = s.catch(() => {}), s;
	}
	/** Closes this decoder and releases all internal resources once all queued packet decodes complete. */
	close() {
		if (this._closed) return this._queue;
		this._closed = true;
		const e = this._queue.then(() => this._runClose());
		return this._queue = e.catch(() => {}), e;
	}
	/** Whether this decoder has been closed. */
	get isClosed() {
		return this._closed;
	}
	/** Calls `.close()` internally. */
	[Symbol.dispose]() {
		this.close();
	}
	/** Calls `.close()` internally. */
	[Symbol.asyncDispose]() {
		return this.close();
	}
};
var R = new FinalizationRegistry(({ runtime: t, ptr: e }) => {
	t.exports.closeDecoder(e), t.unref();
});
var te = class extends z$2 {
	constructor(e, r, o) {
		super();
		/** @internal */
		__publicField(this, "_runtime");
		/** @internal */
		__publicField(this, "_decoderPtr");
		/** @internal */
		__publicField(this, "_taskStateOffset");
		/** @internal */
		__publicField(this, "_decodeMutex", new y());
		/** @internal */
		__publicField(this, "_nextPacketSlot", 0);
		/** @internal */
		__publicField(this, "_packetSlotMutexes", [new y(), new y()]);
		/** @internal */
		__publicField(this, "_highWaterMark");
		__publicField(this, "useSharedMemory", true);
		__publicField(this, "concurrency");
		this._highWaterMark = o === 0 ? 1 : 2, this._runtime = e, this._decoderPtr = r, this._taskStateOffset = e.exports.getTaskStateAddress(r) / 4, this.concurrency = o, R.register(this, {
			runtime: e,
			ptr: r
		}, this);
	}
	_runClose() {
		h(this._runtime), R.unregister(this), this._runtime.exports.closeDecoder(this._decoderPtr), this._runtime.unref(), this._runtime = null;
	}
	async _runDecode(e, r, o) {
		h(this._runtime);
		const { exports: i, memory: s } = this._runtime;
		if (!r._ensureWasmFrame(this._runtime)) return new p();
		const n = r._ptr;
		o.transfer && (e = structuredClone(e, { transfer: [e.buffer] }));
		const a = this._nextPacketSlot;
		this._nextPacketSlot = this._nextPacketSlot + 1 & 1;
		const c = await this._packetSlotMutexes[a].acquire();
		try {
			const d = i.allocatePacket(this._decoderPtr, e.byteLength, a);
			if (d === 0) return new p();
			new Uint8Array(s.buffer).set(e, d);
			const u = await this._decodeMutex.acquire();
			try {
				let f = i.decodePacket(this._decoderPtr, n, a);
				if (f < 0) return this._createError(f);
				if (this.concurrency > 0 && (await Atomics.waitAsync(new Int32Array(s.buffer), this._taskStateOffset, 1).value, f = i.finalizePacketDecoding(this._decoderPtr), f < 0)) return this._createError(f);
				r._populate(Y(i, s, n, this._decoderPtr));
			} finally {
				u();
			}
		} finally {
			c();
		}
		return r;
	}
	/** @internal */
	_createError(e) {
		h(this._runtime);
		const { exports: r, memory: o } = this._runtime;
		let i;
		const s = r.getErrorMessagePtr(this._decoderPtr);
		if (s !== 0) {
			const n = r.getErrorMessageSize(this._decoderPtr);
			i = T(new Uint8Array(o.buffer, s, n));
		}
		return W(e, i);
	}
};
var A = new FinalizationRegistry((t) => {
	t.unref();
});
var oe = class extends z$2 {
	constructor(e, r, o, i) {
		super();
		/** @internal */
		__publicField(this, "_runtime");
		/** @internal */
		__publicField(this, "_decoderId");
		/** @internal */
		__publicField(this, "_highWaterMark");
		__publicField(this, "useSharedMemory", false);
		__publicField(this, "concurrency");
		this._highWaterMark = Math.max(r, 1), this._runtime = e, this.concurrency = r, this._decoderId = e.nextDecoderId++, e.registerDecoder(this._decoderId, o, i), A.register(this, e, this);
	}
	_runClose() {
		h(this._runtime), this._runtime.unregisterDecoder(this._decoderId), A.unregister(this), this._runtime.unref(), this._runtime = null;
	}
	_runDecode(e, r, o) {
		h(this._runtime);
		const i = this._runtime, s = o.transfer ? e : e.slice();
		let n = 0;
		for (let u = 1; u < i.workerLoad.length; u++) i.workerLoad[u] < i.workerLoad[n] && (n = u);
		const a = i.workers[n];
		i.workerLoad[n] = i.workerLoad[n] + 1;
		const c = i.nextRequestId++, d = r._buffer;
		return r._buffer = null, new Promise((u) => {
			a.postMessage({
				type: l.Decode,
				id: c,
				decoderId: this._decoderId,
				packet: s,
				frameBuffer: d
			}, d ? [s.buffer, d] : [s.buffer]);
			const f = (B) => {
				const m = B.data;
				m.type !== l.Decoded && m.type !== l.DecodeError || m.id === c && (a.removeEventListener("message", f), i.workerLoad[n]--, m.type === l.DecodeError ? u(W(m.code, m.message)) : (r._buffer = m.contents.frameData.buffer, r._populate(m.contents), u(r)));
			};
			a.addEventListener("message", f);
		});
	}
};
function assert$2(x2) {
	if (!x2) throw new Error("Assertion failed.");
}
1e6 * (1 + Number.EPSILON);
var isWebKitCache = null;
var isWebKit = () => {
	if (isWebKitCache !== null) return isWebKitCache;
	return isWebKitCache = !!(typeof navigator !== "undefined" && (navigator.vendor?.match(/apple/i) || /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) || /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)));
};
var PRORES_LOADED_SYMBOL = Symbol.for("@mediabunny/prores loaded");
if (globalThis[PRORES_LOADED_SYMBOL]) Logging$1._error("[WARNING]\n@mediabunny/prores was loaded twice. This will likely cause the decoder not to work correctly. Check if multiple dependencies are importing different versions of @mediabunny/prores, or if something is being bundled incorrectly.");
globalThis[PRORES_LOADED_SYMBOL] = true;
var _ProresDecoder = class _ProresDecoder$1 extends CustomVideoDecoder {
	constructor() {
		super(...arguments);
		this.decoder = null;
		this.framePool = [];
	}
	static supports(codec, config) {
		return codec === "prores";
	}
	/** @internal */
	static _determineSupportedVideoFrameFormats() {
		const result = [];
		const data = new Uint8Array(32);
		for (const format of g) try {
			new VideoFrame(data, {
				format,
				codedWidth: 2,
				codedHeight: 2,
				timestamp: 0,
				duration: 0
			}).close();
			result.push(format);
		} catch {}
		return result;
	}
	async init() {
		if (typeof VideoFrame !== "undefined") _ProresDecoder$1._supportedVideoFrameFormats ??= _ProresDecoder$1._determineSupportedVideoFrameFormats();
		const decoder = await z$2.create({
			proresFourCc: this.config.codec,
			useSharedMemory: z$2.canUseSharedMemory(),
			allowedOutputFormats: _ProresDecoder$1._supportedVideoFrameFormats ?? void 0
		});
		if (decoder instanceof Error) throw decoder;
		this.decoder = decoder;
	}
	async decode(packet) {
		assert$2(this.decoder);
		while (this.decoder.desiredSize <= 0) await this.decoder.dequeued;
		this.runDecode(packet).catch((error) => this.onError(error));
	}
	async runDecode(packet) {
		assert$2(this.decoder);
		let frame;
		if (this.framePool.length > 0) frame = this.framePool.shift();
		else frame = new X();
		const result = await this.decoder.decode(packet.data, frame);
		this.framePool.push(frame);
		if (result instanceof Error) throw result;
		if (result.visibleHeight < result.codedHeight && isWebKit()) this.trimCodedHeightToVisibleHeight(result);
		const colorSpaceInit = {
			primaries: result.colorPrimariesString,
			matrix: result.colorMatrixString,
			transfer: result.colorTransferString,
			fullRange: result.colorRangeFull
		};
		let displayWidth = result.visibleWidth;
		let displayHeight = result.visibleHeight;
		if (result.pixelAspectRatio.num > result.pixelAspectRatio.den) displayWidth = Math.round(result.visibleWidth * result.pixelAspectRatio.num / result.pixelAspectRatio.den);
		else displayHeight = Math.round(result.visibleHeight * result.pixelAspectRatio.den / result.pixelAspectRatio.num);
		let sample;
		if (typeof VideoFrame !== "undefined") sample = new VideoSample(new VideoFrame(result.frameData, {
			format: result.pixelFormat,
			codedWidth: result.codedWidth,
			codedHeight: result.codedHeight,
			displayWidth,
			displayHeight,
			visibleRect: {
				x: 0,
				y: 0,
				width: result.visibleWidth,
				height: result.visibleHeight
			},
			timestamp: packet.microsecondTimestamp,
			duration: packet.microsecondDuration,
			colorSpace: colorSpaceInit
		}), {
			timestamp: packet.timestamp,
			duration: packet.duration
		});
		else sample = new VideoSample(result.frameData, {
			format: result.pixelFormat,
			codedWidth: result.codedWidth,
			codedHeight: result.codedHeight,
			displayWidth,
			displayHeight,
			visibleRect: {
				left: 0,
				top: 0,
				width: result.visibleWidth,
				height: result.visibleHeight
			},
			timestamp: packet.timestamp,
			duration: packet.duration,
			colorSpace: colorSpaceInit
		});
		this.onSample(sample);
	}
	trimCodedHeightToVisibleHeight(result) {
		const bytesPerSample = result.pixelFormat.includes("P") ? 2 : 1;
		const subWidth = result.pixelFormat.includes("444") ? 1 : 2;
		const subHeight = result.pixelFormat.includes("420") ? 2 : 1;
		const chromaCodedWidth = result.codedWidth / subWidth;
		const chromaCodedHeight = result.codedHeight / subHeight;
		const chromaVisibleHeight = Math.ceil(result.visibleHeight / subHeight);
		const lumaCodedPixels = result.codedWidth * result.codedHeight;
		const lumaVisiblePixels = result.codedWidth * result.visibleHeight;
		const chromaCodedPixels = chromaCodedWidth * chromaCodedHeight;
		const chromaVisiblePixels = chromaCodedWidth * chromaVisibleHeight;
		result.frameData.set(result.frameData.subarray(bytesPerSample * lumaCodedPixels, bytesPerSample * (lumaCodedPixels + chromaCodedPixels)), bytesPerSample * lumaVisiblePixels);
		result.frameData.set(result.frameData.subarray(bytesPerSample * (lumaCodedPixels + chromaCodedPixels), bytesPerSample * (lumaCodedPixels + 2 * chromaCodedPixels)), bytesPerSample * (lumaVisiblePixels + chromaVisiblePixels));
		result.codedHeight = result.visibleHeight;
	}
	async flush() {
		assert$2(this.decoder);
		while (this.decoder.decodeQueueSize > 0) await this.decoder.dequeued;
	}
	async close() {
		assert$2(this.decoder);
		await this.decoder.close();
		for (const frame of this.framePool) frame.clear();
	}
};
/** @internal */
_ProresDecoder._supportedVideoFrameFormats = null;
var ProresDecoder = _ProresDecoder;
var registered$1 = false;
var registerProresDecoder = () => {
	if (registered$1) return;
	registered$1 = true;
	registerDecoder(ProresDecoder);
};

//#endregion
//#region ../../node_modules/.pnpm/@mediabunny+server@1.51.0_mediabunny@1.51.0/node_modules/@mediabunny/server/dist/bundles/mediabunny-server.mjs
/*!
* Copyright (c) 2026-present, Vanilagy and contributors
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
var CODEC_TO_CODEC_ID = {
	avc: NodeAv8.AV_CODEC_ID_H264,
	hevc: NodeAv8.AV_CODEC_ID_HEVC,
	vp8: NodeAv8.AV_CODEC_ID_VP8,
	vp9: NodeAv8.AV_CODEC_ID_VP9,
	av1: NodeAv8.AV_CODEC_ID_AV1,
	prores: NodeAv8.AV_CODEC_ID_PRORES,
	aac: NodeAv8.AV_CODEC_ID_AAC,
	opus: NodeAv8.AV_CODEC_ID_OPUS,
	mp3: NodeAv8.AV_CODEC_ID_MP3,
	vorbis: NodeAv8.AV_CODEC_ID_VORBIS,
	flac: NodeAv8.AV_CODEC_ID_FLAC,
	ac3: NodeAv8.AV_CODEC_ID_AC3,
	eac3: NodeAv8.AV_CODEC_ID_EAC3
};
var cachedHardwareContext = void 0;
var getHardwareContext = () => {
	if (_serverOptions.hardwareContext !== void 0 && typeof _serverOptions.hardwareContext !== "function") return _serverOptions.hardwareContext;
	if (cachedHardwareContext === void 0) cachedHardwareContext = NodeAv8.HardwareContext.auto();
	return cachedHardwareContext;
};
var validateHwContext = (hw) => {
	if (hw !== null && !(hw instanceof NodeAv8.HardwareContext)) throw new TypeError("When serverOptions.hardwareContext is a function, it must return or resolve to a NodeAv.HardwareContext or null.");
};
var hardwareDecoderCodecCache = /* @__PURE__ */ new Map();
var getHardwareDecoderCodec = async (codecId) => {
	if (typeof _serverOptions.hardwareContext === "function") {
		const hw = await _serverOptions.hardwareContext(codecId);
		validateHwContext(hw);
		return hw?.getDecoderCodec(codecId) ?? null;
	}
	if (!hardwareDecoderCodecCache.has(codecId)) {
		const hw = getHardwareContext();
		hardwareDecoderCodecCache.set(codecId, hw?.getDecoderCodec(codecId) ?? null);
	}
	return hardwareDecoderCodecCache.get(codecId);
};
var hardwareEncoderCodecCache = /* @__PURE__ */ new Map();
var getHardwareEncoderCodec = async (codecId) => {
	if (typeof _serverOptions.hardwareContext === "function") {
		const hw = await _serverOptions.hardwareContext(codecId);
		validateHwContext(hw);
		return hw?.getEncoderCodec(codecId) ?? null;
	}
	if (!hardwareEncoderCodecCache.has(codecId)) {
		const hw = getHardwareContext();
		hardwareEncoderCodecCache.set(codecId, hw?.getEncoderCodec(codecId) ?? null);
	}
	return hardwareEncoderCodecCache.get(codecId);
};
var mapColorPrimaries = (primaries) => {
	switch (primaries) {
		case "bt709": return NodeAv8.AVCOL_PRI_BT709;
		case "bt470bg": return NodeAv8.AVCOL_PRI_BT470BG;
		case "smpte170m": return NodeAv8.AVCOL_PRI_SMPTE170M;
		case "bt2020": return NodeAv8.AVCOL_PRI_BT2020;
		case "smpte432": return NodeAv8.AVCOL_PRI_SMPTE432;
	}
	return null;
};
var unmapColorPrimaries = (primaries) => {
	switch (primaries) {
		case NodeAv8.AVCOL_PRI_BT709: return "bt709";
		case NodeAv8.AVCOL_PRI_BT470BG: return "bt470bg";
		case NodeAv8.AVCOL_PRI_SMPTE170M: return "smpte170m";
		case NodeAv8.AVCOL_PRI_BT2020: return "bt2020";
		case NodeAv8.AVCOL_PRI_SMPTE432: return "smpte432";
	}
	return null;
};
var mapTransferCharacteristics = (transfer) => {
	switch (transfer) {
		case "bt709": return NodeAv8.AVCOL_TRC_BT709;
		case "smpte170m": return NodeAv8.AVCOL_TRC_SMPTE170M;
		case "iec61966-2-1": return NodeAv8.AVCOL_TRC_IEC61966_2_1;
		case "linear": return NodeAv8.AVCOL_TRC_LINEAR;
		case "pq": return NodeAv8.AVCOL_TRC_SMPTE2084;
		case "hlg": return NodeAv8.AVCOL_TRC_ARIB_STD_B67;
	}
	return null;
};
var unmapTransferCharacteristics = (transfer) => {
	switch (transfer) {
		case NodeAv8.AVCOL_TRC_BT709: return "bt709";
		case NodeAv8.AVCOL_TRC_SMPTE170M: return "smpte170m";
		case NodeAv8.AVCOL_TRC_IEC61966_2_1: return "iec61966-2-1";
		case NodeAv8.AVCOL_TRC_LINEAR: return "linear";
		case NodeAv8.AVCOL_TRC_SMPTE2084: return "pq";
		case NodeAv8.AVCOL_TRC_ARIB_STD_B67: return "hlg";
	}
	return null;
};
var mapMatrixCoefficients = (matrix) => {
	switch (matrix) {
		case "rgb": return NodeAv8.AVCOL_SPC_RGB;
		case "bt709": return NodeAv8.AVCOL_SPC_BT709;
		case "bt470bg": return NodeAv8.AVCOL_SPC_BT470BG;
		case "smpte170m": return NodeAv8.AVCOL_SPC_SMPTE170M;
		case "bt2020-ncl": return NodeAv8.AVCOL_SPC_BT2020_NCL;
	}
	return null;
};
var unmapMatrixCoefficients = (matrix) => {
	switch (matrix) {
		case NodeAv8.AVCOL_SPC_RGB: return "rgb";
		case NodeAv8.AVCOL_SPC_BT709: return "bt709";
		case NodeAv8.AVCOL_SPC_BT470BG: return "bt470bg";
		case NodeAv8.AVCOL_SPC_SMPTE170M: return "smpte170m";
		case NodeAv8.AVCOL_SPC_BT2020_NCL: return "bt2020-ncl";
	}
	return null;
};
var toPixelFormat = (ffmpegPixelFormat) => {
	switch (ffmpegPixelFormat) {
		case NodeAv8.AV_PIX_FMT_YUV420P: return "I420";
		case NodeAv8.AV_PIX_FMT_YUVJ420P: return "I420";
		case NodeAv8.AV_PIX_FMT_YUV420P10LE: return "I420P10";
		case NodeAv8.AV_PIX_FMT_YUV420P12LE: return "I420P12";
		case NodeAv8.AV_PIX_FMT_YUVA420P: return "I420A";
		case NodeAv8.AV_PIX_FMT_YUVA420P10LE: return "I420AP10";
		case NodeAv8.AV_PIX_FMT_YUV422P: return "I422";
		case NodeAv8.AV_PIX_FMT_YUVJ422P: return "I422";
		case NodeAv8.AV_PIX_FMT_YUV422P10LE: return "I422P10";
		case NodeAv8.AV_PIX_FMT_YUV422P12LE: return "I422P12";
		case NodeAv8.AV_PIX_FMT_YUVA422P: return "I422A";
		case NodeAv8.AV_PIX_FMT_YUVA422P10LE: return "I422AP10";
		case NodeAv8.AV_PIX_FMT_YUVA422P12LE: return "I422AP12";
		case NodeAv8.AV_PIX_FMT_YUV444P: return "I444";
		case NodeAv8.AV_PIX_FMT_YUVJ444P: return "I444";
		case NodeAv8.AV_PIX_FMT_YUV444P10LE: return "I444P10";
		case NodeAv8.AV_PIX_FMT_YUV444P12LE: return "I444P12";
		case NodeAv8.AV_PIX_FMT_YUVA444P: return "I444A";
		case NodeAv8.AV_PIX_FMT_YUVA444P10LE: return "I444AP10";
		case NodeAv8.AV_PIX_FMT_YUVA444P12LE: return "I444AP12";
		case NodeAv8.AV_PIX_FMT_NV12: return "NV12";
		case NodeAv8.AV_PIX_FMT_RGBA: return "RGBA";
		case NodeAv8.AV_PIX_FMT_RGB0: return "RGBX";
		case NodeAv8.AV_PIX_FMT_BGRA: return "BGRA";
		case NodeAv8.AV_PIX_FMT_BGR0: return "BGRX";
		default: return null;
	}
};
var fromPixelFormat = (pixelFormat) => {
	switch (pixelFormat) {
		case "I420": return NodeAv8.AV_PIX_FMT_YUV420P;
		case "I420P10": return NodeAv8.AV_PIX_FMT_YUV420P10LE;
		case "I420P12": return NodeAv8.AV_PIX_FMT_YUV420P12LE;
		case "I420A": return NodeAv8.AV_PIX_FMT_YUVA420P;
		case "I420AP10": return NodeAv8.AV_PIX_FMT_YUVA420P10LE;
		case "I422": return NodeAv8.AV_PIX_FMT_YUV422P;
		case "I422P10": return NodeAv8.AV_PIX_FMT_YUV422P10LE;
		case "I422P12": return NodeAv8.AV_PIX_FMT_YUV422P12LE;
		case "I422A": return NodeAv8.AV_PIX_FMT_YUVA422P;
		case "I422AP10": return NodeAv8.AV_PIX_FMT_YUVA422P10LE;
		case "I422AP12": return NodeAv8.AV_PIX_FMT_YUVA422P12LE;
		case "I444": return NodeAv8.AV_PIX_FMT_YUV444P;
		case "I444P10": return NodeAv8.AV_PIX_FMT_YUV444P10LE;
		case "I444P12": return NodeAv8.AV_PIX_FMT_YUV444P12LE;
		case "I444A": return NodeAv8.AV_PIX_FMT_YUVA444P;
		case "I444AP10": return NodeAv8.AV_PIX_FMT_YUVA444P10LE;
		case "I444AP12": return NodeAv8.AV_PIX_FMT_YUVA444P12LE;
		case "NV12": return NodeAv8.AV_PIX_FMT_NV12;
		case "RGBA": return NodeAv8.AV_PIX_FMT_RGBA;
		case "RGBX": return NodeAv8.AV_PIX_FMT_RGB0;
		case "BGRA": return NodeAv8.AV_PIX_FMT_BGRA;
		case "BGRX": return NodeAv8.AV_PIX_FMT_BGR0;
		default: return NodeAv8.AV_PIX_FMT_NONE;
	}
};
var toAudioSampleFormat = (ffmpegSampleFormat) => {
	switch (ffmpegSampleFormat) {
		case NodeAv8.AV_SAMPLE_FMT_U8: return "u8";
		case NodeAv8.AV_SAMPLE_FMT_S16: return "s16";
		case NodeAv8.AV_SAMPLE_FMT_S32: return "s32";
		case NodeAv8.AV_SAMPLE_FMT_FLT: return "f32";
		case NodeAv8.AV_SAMPLE_FMT_U8P: return "u8-planar";
		case NodeAv8.AV_SAMPLE_FMT_S16P: return "s16-planar";
		case NodeAv8.AV_SAMPLE_FMT_S32P: return "s32-planar";
		case NodeAv8.AV_SAMPLE_FMT_FLTP: return "f32-planar";
		default: return null;
	}
};
var fromAudioSampleFormat = (sampleFormat) => {
	switch (sampleFormat) {
		case "u8": return NodeAv8.AV_SAMPLE_FMT_U8;
		case "s16": return NodeAv8.AV_SAMPLE_FMT_S16;
		case "s32": return NodeAv8.AV_SAMPLE_FMT_S32;
		case "f32": return NodeAv8.AV_SAMPLE_FMT_FLT;
		case "u8-planar": return NodeAv8.AV_SAMPLE_FMT_U8P;
		case "s16-planar": return NodeAv8.AV_SAMPLE_FMT_S16P;
		case "s32-planar": return NodeAv8.AV_SAMPLE_FMT_S32P;
		case "f32-planar": return NodeAv8.AV_SAMPLE_FMT_FLTP;
		default: return NodeAv8.AV_SAMPLE_FMT_NONE;
	}
};
var getChannelLayout = (numChannels) => {
	switch (numChannels) {
		case 1: return NodeAv8.AV_CHANNEL_LAYOUT_MONO;
		case 2: return NodeAv8.AV_CHANNEL_LAYOUT_STEREO;
		case 4: return NodeAv8.AV_CHANNEL_LAYOUT_QUAD;
		case 6: return NodeAv8.AV_CHANNEL_LAYOUT_5POINT1_BACK;
		case 8: return NodeAv8.AV_CHANNEL_LAYOUT_7POINT1;
		default: return {
			nbChannels: numChannels,
			order: NodeAv8.AV_CHANNEL_ORDER_UNSPEC,
			mask: 0n
		};
	}
};
var _Logging = class _Logging$1 {
	constructor() {}
	/** The current log level. Defaults to {@link LogLevel.Info}. */
	static get level() {
		return _Logging$1._level;
	}
	static set level(value) {
		if (value !== 0 && value !== 1 && value !== 2 && value !== 3) throw new TypeError("Invalid log level. Use one of the values of the LogLevel enum.");
		_Logging$1._level = value;
	}
	/** @internal */
	static get _emitter() {
		return _Logging$1._emitterInstance ??= new EventEmitter();
	}
	/** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
	static on(event, listener, options) {
		return _Logging$1._emitter.on(event, listener, options);
	}
	/** @internal */
	static _error(...args) {
		_Logging$1._emitter._emit("error", args);
		if (_Logging$1._level >= 1) console.error(...args);
	}
	/** @internal */
	static _warn(...args) {
		_Logging$1._emitter._emit("warn", args);
		if (_Logging$1._level >= 2) console.warn(...args);
	}
	/** @internal */
	static _info(...args) {
		_Logging$1._emitter._emit("info", args);
		if (_Logging$1._level >= 3) console.info(...args);
	}
};
/** @internal */
_Logging._level = 3;
/** @internal */
_Logging._emitterInstance = null;
var Logging = _Logging;
function assert$1(x$1) {
	if (!x$1) throw new Error("Assertion failed.");
}
var last = (arr) => {
	return arr && arr[arr.length - 1];
};
var readExpGolomb = (bitstream) => {
	let leadingZeroBits = 0;
	while (bitstream.readBits(1) === 0 && leadingZeroBits < 32) leadingZeroBits++;
	if (leadingZeroBits >= 32) throw new Error("Invalid exponential-Golomb code.");
	return (1 << leadingZeroBits) - 1 + bitstream.readBits(leadingZeroBits);
};
var readSignedExpGolomb = (bitstream) => {
	const codeNum = readExpGolomb(bitstream);
	return (codeNum & 1) === 0 ? -(codeNum >> 1) : codeNum + 1 >> 1;
};
var toUint8Array = (source) => {
	if (source.constructor === Uint8Array) return source;
	else if (ArrayBuffer.isView(source)) return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
	else return new Uint8Array(source);
};
var toDataView = (source) => {
	if (source.constructor === DataView) return source;
	else if (ArrayBuffer.isView(source)) return new DataView(source.buffer, source.byteOffset, source.byteLength);
	else return new DataView(source);
};
var COLOR_PRIMARIES_MAP = {
	bt709: 1,
	bt470bg: 5,
	smpte170m: 6,
	bt2020: 9,
	smpte432: 12
};
var TRANSFER_CHARACTERISTICS_MAP = {
	"bt709": 1,
	"smpte170m": 6,
	"linear": 8,
	"iec61966-2-1": 13,
	"pq": 16,
	"hlg": 18
};
var MATRIX_COEFFICIENTS_MAP = {
	"rgb": 0,
	"bt709": 1,
	"bt470bg": 5,
	"smpte170m": 6,
	"bt2020-ncl": 9
};
var bytesToHexString = (bytes$1) => {
	return [...bytes$1].map((x$1) => x$1.toString(16).padStart(2, "0")).join("");
};
var reverseBitsU32 = (x$1) => {
	x$1 = x$1 >> 1 & 1431655765 | (x$1 & 1431655765) << 1;
	x$1 = x$1 >> 2 & 858993459 | (x$1 & 858993459) << 2;
	x$1 = x$1 >> 4 & 252645135 | (x$1 & 252645135) << 4;
	x$1 = x$1 >> 8 & 16711935 | (x$1 & 16711935) << 8;
	x$1 = x$1 >> 16 & 65535 | (x$1 & 65535) << 16;
	return x$1 >>> 0;
};
var binarySearchLessOrEqual = (arr, key, valueGetter) => {
	let low = 0;
	let high = arr.length - 1;
	let ans = -1;
	while (low <= high) {
		const mid = low + (high - low + 1) / 2 | 0;
		if (valueGetter(arr[mid]) <= key) {
			ans = mid;
			low = mid + 1;
		} else high = mid - 1;
	}
	return ans;
};
var assertNever = (x$1) => {
	throw new Error(`Unexpected value: ${x$1}`);
};
1e6 * (1 + Number.EPSILON);
var simplifyRational = (rational) => {
	assert$1(Number.isInteger(rational.num));
	assert$1(Number.isInteger(rational.den));
	assert$1(rational.den !== 0);
	let a = Math.abs(rational.num);
	let b$1 = Math.abs(rational.den);
	while (b$1 !== 0) {
		const t = a % b$1;
		a = b$1;
		b$1 = t;
	}
	const gcd = a || 1;
	return {
		num: rational.num / gcd,
		den: rational.den / gcd
	};
};
var EventEmitter = class {
	constructor() {
		/** @internal */
		this._listeners = /* @__PURE__ */ new Map();
	}
	/** Registers a listener for the given event. Returns a function that, when called, removes the listener again. */
	on(event, listener, options) {
		if (!this._listeners.has(event)) this._listeners.set(event, /* @__PURE__ */ new Set());
		const entry = {
			fn: listener,
			once: options?.once ?? false
		};
		this._listeners.get(event).add(entry);
		return () => {
			this._listeners.get(event)?.delete(entry);
		};
	}
	/** @internal */
	_emit(...args) {
		const [event, data] = args;
		const listeners = this._listeners.get(event);
		if (!listeners) return;
		for (const entry of listeners) {
			try {
				entry.fn(data);
			} catch (error) {
				console.error(error);
			}
			if (entry.once) listeners.delete(entry);
		}
	}
};
var JPEG_RANGE_PIX_FORMATS = /* @__PURE__ */ new Set([
	NodeAv8.AV_PIX_FMT_YUVJ411P,
	NodeAv8.AV_PIX_FMT_YUVJ420P,
	NodeAv8.AV_PIX_FMT_YUVJ422P,
	NodeAv8.AV_PIX_FMT_YUVJ440P,
	NodeAv8.AV_PIX_FMT_YUVJ444P
]);
var AvFrameVideoSampleResource = class _AvFrameVideoSampleResource extends VideoSampleResource {
	/**
	* The NodeAV [`Frame`](https://seydx.github.io/node-av/api/lib/classes/Frame.html) instance backing this resource.
	* Access throws if the resource has already been closed.
	*/
	get frame() {
		if (!this._frame) throw new Error("AvFrameVideoSampleResource has been closed.");
		return this._frame;
	}
	constructor(frame) {
		super();
		if (!(frame instanceof NodeAv8.Frame)) throw new TypeError("frame must be a NodeAv.Frame.");
		if (frame.getMediaType() !== NodeAv8.AVMEDIA_TYPE_VIDEO) throw new Error("AvFrameVideoSampleResource must be initialized with a video frame.");
		this._frame = frame;
	}
	getFormat() {
		return toPixelFormat(this.frame.format);
	}
	getCodedWidth() {
		return this.frame.width;
	}
	getCodedHeight() {
		return this.frame.height;
	}
	getSquarePixelWidth() {
		if (this.frame.sampleAspectRatio.num > this.frame.sampleAspectRatio.den) return Math.round(this.frame.width * this.frame.sampleAspectRatio.num / this.frame.sampleAspectRatio.den);
		else return this.frame.width;
	}
	getSquarePixelHeight() {
		if (this.frame.sampleAspectRatio.num > this.frame.sampleAspectRatio.den) return this.frame.height;
		else return Math.round(this.frame.height * this.frame.sampleAspectRatio.den / this.frame.sampleAspectRatio.num);
	}
	getColorSpace() {
		return new VideoSampleColorSpace({
			primaries: unmapColorPrimaries(this.frame.colorPrimaries),
			transfer: unmapTransferCharacteristics(this.frame.colorTrc),
			matrix: unmapMatrixCoefficients(this.frame.colorSpace),
			fullRange: this.frame.colorRange === NodeAv8.AVCOL_RANGE_JPEG || JPEG_RANGE_PIX_FORMATS.has(this.frame.format) ? true : this.frame.colorRange === NodeAv8.AVCOL_RANGE_MPEG ? false : null
		});
	}
	close() {
		this.frame.free();
		this._frame = null;
	}
	getDataPlanes() {
		assert$1(this.frame.data);
		return this.frame.data.map((data, i) => ({
			data: toUint8Array(data),
			stride: this.frame.linesize[i]
		}));
	}
	async toRgbSample(init, colorSpace) {
		const width = this.frame.width;
		const height = this.frame.height;
		const scaler = new NodeAv8.SoftwareScaleContext();
		const srcFmt = this.frame.format;
		const dstFmt = fromPixelFormat("RGBA");
		scaler.getContext(width, height, srcFmt, width, height, dstFmt, NodeAv8.SWS_BILINEAR);
		const dstFrame = new NodeAv8.Frame();
		dstFrame.width = width;
		dstFrame.height = height;
		dstFrame.format = dstFmt;
		dstFrame.alloc();
		dstFrame.allocBuffer();
		const srcFrame = this.frame;
		try {
			await scaler.scaleFrame(dstFrame, srcFrame);
		} finally {
			scaler.freeContext();
		}
		dstFrame.sampleAspectRatio = srcFrame.sampleAspectRatio;
		return new VideoSample(new _AvFrameVideoSampleResource(dstFrame), init);
	}
};
var copyVideoSampleToAvFrame = async (sample, frame, lastBuffer) => {
	assert$1(sample.format !== null);
	frame.format = fromPixelFormat(sample.format);
	frame.width = sample.codedWidth;
	frame.height = sample.codedHeight;
	frame.sampleAspectRatio = new NodeAv8.Rational(sample.pixelAspectRatio.num, sample.pixelAspectRatio.den);
	frame.colorPrimaries = mapColorPrimaries(sample.colorSpace.primaries ?? "unknown") ?? NodeAv8.AVCOL_PRI_UNSPECIFIED;
	frame.colorSpace = mapMatrixCoefficients(sample.colorSpace.matrix ?? "unknown") ?? NodeAv8.AVCOL_SPC_UNSPECIFIED;
	frame.colorTrc = mapTransferCharacteristics(sample.colorSpace.transfer ?? "unknown") ?? NodeAv8.AVCOL_TRC_UNSPECIFIED;
	frame.colorRange = sample.colorSpace.fullRange === false ? NodeAv8.AVCOL_RANGE_MPEG : sample.colorSpace.fullRange === true ? NodeAv8.AVCOL_RANGE_JPEG : NodeAv8.AVCOL_RANGE_UNSPECIFIED;
	const size = sample.allocationSize();
	if (!lastBuffer || lastBuffer.byteLength !== size) lastBuffer = Buffer.from({ length: size });
	await sample.copyTo(lastBuffer);
	frame.fromBuffer(lastBuffer);
	return lastBuffer;
};
var transformVideoSample = async (sample, description) => {
	let srcFrame;
	let srcFrameOwned = false;
	if (sample._data instanceof AvFrameVideoSampleResource) srcFrame = sample._data.frame;
	else {
		if (sample.format === null) return null;
		srcFrame = new NodeAv8.Frame();
		srcFrame.alloc();
		srcFrameOwned = true;
		await copyVideoSampleToAvFrame(sample, srcFrame, null);
	}
	const chain = [];
	if (sample.squarePixelWidth !== sample.codedWidth || sample.squarePixelHeight !== sample.codedHeight) {
		chain.push(`scale=${sample.squarePixelWidth}:${sample.squarePixelHeight}`);
		chain.push("setsar=1");
	}
	if (description.rotation === 90) chain.push("transpose=1");
	else if (description.rotation === 180) chain.push("transpose=1,transpose=1");
	else if (description.rotation === 270) chain.push("transpose=2");
	chain.push(`crop=${Math.round(description.crop.width)}:${Math.round(description.crop.height)}:${Math.round(description.crop.left)}:${Math.round(description.crop.top)}`);
	if (description.fit === "fill") chain.push(`scale=${description.width}:${description.height}`);
	else if (description.fit === "contain") {
		chain.push(`scale=${description.width}:${description.height}:force_original_aspect_ratio=decrease`);
		chain.push(`pad=${description.width}:${description.height}:(ow-iw)/2:(oh-ih)/2:color=black@0`);
	} else if (description.fit === "cover") {
		chain.push(`scale=${description.width}:${description.height}:force_original_aspect_ratio=increase`);
		chain.push(`crop=${description.width}:${description.height}`);
	}
	chain.push("setsar=1");
	const graph = new NodeAv8.FilterGraph();
	graph.alloc();
	try {
		const srcArgs = `video_size=${srcFrame.width}x${srcFrame.height}:pix_fmt=${srcFrame.format}:time_base=1/1000000:pixel_aspect=${sample.pixelAspectRatio.num}/${sample.pixelAspectRatio.den}`;
		const bufferSrc = graph.createFilter(NodeAv8.Filter.getByName("buffer"), "src", srcArgs);
		const bufferSink = graph.createFilter(NodeAv8.Filter.getByName("buffersink"), "sink");
		assert$1(bufferSrc && bufferSink);
		const outputs = NodeAv8.FilterInOut.createList([{
			name: "in",
			filterCtx: bufferSrc,
			padIdx: 0
		}]);
		const inputs = NodeAv8.FilterInOut.createList([{
			name: "out",
			filterCtx: bufferSink,
			padIdx: 0
		}]);
		const parseRet = graph.parsePtr(`[in]${chain.join(",")}[out]`, inputs, outputs);
		NodeAv8.FFmpegError.throwIfError(parseRet, "FilterGraph.parsePtr");
		const configRet = await graph.config();
		NodeAv8.FFmpegError.throwIfError(configRet, "FilterGraph.config");
		const addRet = await bufferSrc.buffersrcAddFrame(srcFrame);
		NodeAv8.FFmpegError.throwIfError(addRet, "buffersrcAddFrame");
		await bufferSrc.buffersrcAddFrame(null);
		const dstFrame = new NodeAv8.Frame();
		dstFrame.alloc();
		const getRet = await bufferSink.buffersinkGetFrame(dstFrame);
		NodeAv8.FFmpegError.throwIfError(getRet, "buffersinkGetFrame");
		return new VideoSample(new AvFrameVideoSampleResource(dstFrame), {
			timestamp: sample.timestamp,
			duration: sample.duration,
			rotation: 0
		});
	} finally {
		graph.free();
		if (srcFrameOwned) srcFrame.free();
	}
};
var NodeAvVideoDecoder = class extends CustomVideoDecoder {
	constructor() {
		super(...arguments);
		this.codecContext = null;
		this.preciseTimings = [];
	}
	static supports(codec, config) {
		return codec === "avc" || codec === "hevc" || codec === "vp8" || codec === "vp9" || codec === "av1";
	}
	async init() {
		this.frame = new NodeAv8.Frame();
		this.frame.alloc();
		this.packet = new NodeAv8.Packet();
		this.packet.alloc();
	}
	async initCodecContext(packet) {
		assert$1(this.codecContext === null);
		const codecId = CODEC_TO_CODEC_ID[this.codec];
		assert$1(codecId !== void 0);
		let codec;
		if (this.codec === "vp9" && packet.sideData.alpha) codec = NodeAv8.Codec.findDecoderByName(NodeAv8.FF_DECODER_LIBVPX_VP9) ?? NodeAv8.Codec.findDecoder(codecId);
		else if (this.config.hardwareAcceleration === "prefer-software" || this.codec === "av1") codec = NodeAv8.Codec.findDecoder(codecId);
		else codec = await getHardwareDecoderCodec(codecId) ?? NodeAv8.Codec.findDecoder(codecId);
		if (!codec) throw new Error(`Unable to obtain libav codec for '${this.codec}'.`);
		const codecContext = new NodeAv8.CodecContext();
		codecContext.allocContext3(codec);
		this.pixelAspectRatio = simplifyRational({
			num: (this.config.displayAspectWidth ?? this.config.codedWidth ?? 0) * (this.config.codedHeight ?? 0),
			den: (this.config.displayAspectHeight ?? this.config.codedHeight ?? 0) * (this.config.codedWidth ?? 0) || 1
		});
		codecContext.width = this.config.codedWidth ?? 0;
		codecContext.height = this.config.codedHeight ?? 0;
		codecContext.codecType = NodeAv8.AVMEDIA_TYPE_VIDEO;
		codecContext.codecId = codecId;
		codecContext.extraData = this.config.description ? Buffer.from(toUint8Array(this.config.description)) : null;
		codecContext.sampleAspectRatio = new NodeAv8.Rational(this.pixelAspectRatio.num, this.pixelAspectRatio.den);
		const ret = await codecContext.open2();
		NodeAv8.FFmpegError.throwIfError(ret, "Open codec context");
		this.codecContext = codecContext;
	}
	async decode(packet) {
		if (this.codecContext === null) await this.initCodecContext(packet);
		assert$1(this.codecContext);
		this.packet.isKeyframe = packet.type === "key";
		this.packet.data = Buffer.from(packet.data);
		this.packet.timeBase = {
			num: 1,
			den: 1e6
		};
		this.packet.pts = BigInt(packet.microsecondTimestamp);
		this.packet.dts = NodeAv8.AV_NOPTS_VALUE;
		this.packet.duration = BigInt(packet.microsecondDuration);
		if (packet.sideData.alpha) {
			const matroskaBlockAdditional = Buffer.alloc(8 + packet.sideData.alpha.byteLength);
			matroskaBlockAdditional[7] = 1;
			matroskaBlockAdditional.set(packet.sideData.alpha, 8);
			this.packet.addSideData(NodeAv8.AV_PKT_DATA_MATROSKA_BLOCKADDITIONAL, matroskaBlockAdditional);
		}
		const preciseTimingIndex = binarySearchLessOrEqual(this.preciseTimings, packet.microsecondTimestamp, (x$1) => x$1.microsecondTimestamp);
		const existingEntry = preciseTimingIndex !== -1 ? this.preciseTimings[preciseTimingIndex] : null;
		if (existingEntry && existingEntry.microsecondTimestamp === packet.microsecondTimestamp) {
			if (existingEntry.timestamp !== packet.timestamp) existingEntry.timestampIsValid = false;
			if (existingEntry.duration !== packet.duration) existingEntry.durationIsValid = false;
		} else {
			this.preciseTimings.splice(preciseTimingIndex + 1, 0, {
				microsecondTimestamp: packet.microsecondTimestamp,
				timestamp: packet.timestamp,
				duration: packet.duration,
				timestampIsValid: true,
				durationIsValid: true
			});
			if (this.preciseTimings.length > 128) this.preciseTimings.shift();
		}
		const ret = await this.codecContext.sendPacket(this.packet);
		NodeAv8.FFmpegError.throwIfError(ret, "Send packet");
		this.packet.unref();
		while (true) {
			const receiveRet = await this.codecContext.receiveFrame(this.frame);
			if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
			this.receiveFrame(receiveRet);
		}
	}
	receiveFrame(ret) {
		NodeAv8.FFmpegError.throwIfError(ret, "Receive frame");
		this.frame.sampleAspectRatio = new NodeAv8.Rational(this.pixelAspectRatio.num, this.pixelAspectRatio.den);
		let timestamp = Number(this.frame.pts) / 1e6;
		let duration = Number(this.frame.duration) / 1e6;
		const preciseTimingIndex = binarySearchLessOrEqual(this.preciseTimings, Number(this.frame.pts), (x$1) => x$1.microsecondTimestamp);
		const entry = preciseTimingIndex !== -1 ? this.preciseTimings[preciseTimingIndex] : null;
		if (entry && entry.microsecondTimestamp === Number(this.frame.pts)) {
			if (entry.timestampIsValid) timestamp = entry.timestamp;
			if (entry.durationIsValid) duration = entry.duration;
		}
		const clone = this.frame.clone();
		if (!clone) throw new Error("Frame clone allocation failed.");
		this.onSample(new VideoSample(new AvFrameVideoSampleResource(clone), {
			timestamp,
			duration
		}));
	}
	async flush() {
		if (!this.codecContext) return;
		const ret = await this.codecContext.sendPacket(null);
		NodeAv8.FFmpegError.throwIfError(ret, "Flush decoder");
		while (true) {
			const receiveRet = await this.codecContext.receiveFrame(this.frame);
			if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
			this.receiveFrame(receiveRet);
		}
		this.codecContext.flushBuffers();
	}
	close() {
		this.codecContext?.freeContext();
		this.frame.free();
		this.packet.free();
	}
};
var Bitstream = class _Bitstream {
	constructor(bytes$1) {
		this.bytes = bytes$1;
		/** Current offset in bits. */
		this.pos = 0;
	}
	seekToByte(byteOffset) {
		this.pos = 8 * byteOffset;
	}
	readBit() {
		const byteIndex = Math.floor(this.pos / 8);
		const byte = this.bytes[byteIndex] ?? 0;
		const bitIndex = 7 - (this.pos & 7);
		const bit = (byte & 1 << bitIndex) >> bitIndex;
		this.pos++;
		return bit;
	}
	readBits(n) {
		if (n === 1) return this.readBit();
		let result = 0;
		for (let i = 0; i < n; i++) {
			result <<= 1;
			result |= this.readBit();
		}
		return result;
	}
	writeBits(n, value) {
		const end = this.pos + n;
		for (let i = this.pos; i < end; i++) {
			const byteIndex = Math.floor(i / 8);
			let byte = this.bytes[byteIndex];
			const bitIndex = 7 - (i & 7);
			byte &= ~(1 << bitIndex);
			byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
			this.bytes[byteIndex] = byte;
		}
		this.pos = end;
	}
	readAlignedByte() {
		if (this.pos % 8 !== 0) throw new Error("Bitstream is not byte-aligned.");
		const byteIndex = this.pos / 8;
		const byte = this.bytes[byteIndex] ?? 0;
		this.pos += 8;
		return byte;
	}
	skipBits(n) {
		this.pos += n;
	}
	getBitsLeft() {
		return this.bytes.length * 8 - this.pos;
	}
	clone() {
		const clone = new _Bitstream(this.bytes);
		clone.pos = this.pos;
		return clone;
	}
};
var aacFrequencyTable = [
	96e3,
	88200,
	64e3,
	48e3,
	44100,
	32e3,
	24e3,
	22050,
	16e3,
	12e3,
	11025,
	8e3,
	7350
];
var aacChannelMap = [
	-1,
	1,
	2,
	3,
	4,
	5,
	6,
	8
];
var parseAacAudioSpecificConfig = (bytes$1) => {
	if (!bytes$1 || bytes$1.byteLength < 2) throw new TypeError("AAC description must be at least 2 bytes long.");
	const bitstream = new Bitstream(bytes$1);
	let objectType = bitstream.readBits(5);
	if (objectType === 31) objectType = 32 + bitstream.readBits(6);
	const frequencyIndex = bitstream.readBits(4);
	let sampleRate = null;
	if (frequencyIndex === 15) sampleRate = bitstream.readBits(24);
	else if (frequencyIndex < aacFrequencyTable.length) sampleRate = aacFrequencyTable[frequencyIndex];
	const channelConfiguration = bitstream.readBits(4);
	let numberOfChannels = null;
	if (channelConfiguration >= 1 && channelConfiguration <= 7) numberOfChannels = aacChannelMap[channelConfiguration];
	return {
		objectType,
		frequencyIndex,
		sampleRate,
		channelConfiguration,
		numberOfChannels
	};
};
var buildAdtsHeaderTemplate = (config) => {
	const header = new Uint8Array(7);
	const bitstream = new Bitstream(header);
	const { objectType, frequencyIndex, channelConfiguration } = config;
	const profile = objectType - 1;
	bitstream.writeBits(12, 4095);
	bitstream.writeBits(1, 0);
	bitstream.writeBits(2, 0);
	bitstream.writeBits(1, 1);
	bitstream.writeBits(2, profile);
	bitstream.writeBits(4, frequencyIndex);
	bitstream.writeBits(1, 0);
	bitstream.writeBits(3, channelConfiguration);
	bitstream.writeBits(1, 0);
	bitstream.writeBits(1, 0);
	bitstream.writeBits(1, 0);
	bitstream.writeBits(1, 0);
	bitstream.skipBits(13);
	bitstream.writeBits(11, 2047);
	bitstream.writeBits(2, 0);
	return {
		header,
		bitstream
	};
};
var AVC_LEVEL_TABLE = [
	{
		maxMacroblocks: 99,
		maxBitrate: 64e3,
		maxDpbMbs: 396,
		level: 10
	},
	{
		maxMacroblocks: 396,
		maxBitrate: 192e3,
		maxDpbMbs: 900,
		level: 11
	},
	{
		maxMacroblocks: 396,
		maxBitrate: 384e3,
		maxDpbMbs: 2376,
		level: 12
	},
	{
		maxMacroblocks: 396,
		maxBitrate: 768e3,
		maxDpbMbs: 2376,
		level: 13
	},
	{
		maxMacroblocks: 396,
		maxBitrate: 2e6,
		maxDpbMbs: 2376,
		level: 20
	},
	{
		maxMacroblocks: 792,
		maxBitrate: 4e6,
		maxDpbMbs: 4752,
		level: 21
	},
	{
		maxMacroblocks: 1620,
		maxBitrate: 4e6,
		maxDpbMbs: 8100,
		level: 22
	},
	{
		maxMacroblocks: 1620,
		maxBitrate: 1e7,
		maxDpbMbs: 8100,
		level: 30
	},
	{
		maxMacroblocks: 3600,
		maxBitrate: 14e6,
		maxDpbMbs: 18e3,
		level: 31
	},
	{
		maxMacroblocks: 5120,
		maxBitrate: 2e7,
		maxDpbMbs: 20480,
		level: 32
	},
	{
		maxMacroblocks: 8192,
		maxBitrate: 2e7,
		maxDpbMbs: 32768,
		level: 40
	},
	{
		maxMacroblocks: 8192,
		maxBitrate: 5e7,
		maxDpbMbs: 32768,
		level: 41
	},
	{
		maxMacroblocks: 8704,
		maxBitrate: 5e7,
		maxDpbMbs: 34816,
		level: 42
	},
	{
		maxMacroblocks: 22080,
		maxBitrate: 135e6,
		maxDpbMbs: 110400,
		level: 50
	},
	{
		maxMacroblocks: 36864,
		maxBitrate: 24e7,
		maxDpbMbs: 184320,
		level: 51
	},
	{
		maxMacroblocks: 36864,
		maxBitrate: 24e7,
		maxDpbMbs: 184320,
		level: 52
	},
	{
		maxMacroblocks: 139264,
		maxBitrate: 24e7,
		maxDpbMbs: 696320,
		level: 60
	},
	{
		maxMacroblocks: 139264,
		maxBitrate: 48e7,
		maxDpbMbs: 696320,
		level: 61
	},
	{
		maxMacroblocks: 139264,
		maxBitrate: 8e8,
		maxDpbMbs: 696320,
		level: 62
	}
];
var VP9_LEVEL_TABLE = [
	{
		maxPictureSize: 36864,
		maxBitrate: 2e5,
		level: 10
	},
	{
		maxPictureSize: 73728,
		maxBitrate: 8e5,
		level: 11
	},
	{
		maxPictureSize: 122880,
		maxBitrate: 18e5,
		level: 20
	},
	{
		maxPictureSize: 245760,
		maxBitrate: 36e5,
		level: 21
	},
	{
		maxPictureSize: 552960,
		maxBitrate: 72e5,
		level: 30
	},
	{
		maxPictureSize: 983040,
		maxBitrate: 12e6,
		level: 31
	},
	{
		maxPictureSize: 2228224,
		maxBitrate: 18e6,
		level: 40
	},
	{
		maxPictureSize: 2228224,
		maxBitrate: 3e7,
		level: 41
	},
	{
		maxPictureSize: 8912896,
		maxBitrate: 6e7,
		level: 50
	},
	{
		maxPictureSize: 8912896,
		maxBitrate: 12e7,
		level: 51
	},
	{
		maxPictureSize: 8912896,
		maxBitrate: 18e7,
		level: 52
	},
	{
		maxPictureSize: 35651584,
		maxBitrate: 18e7,
		level: 60
	},
	{
		maxPictureSize: 35651584,
		maxBitrate: 24e7,
		level: 61
	},
	{
		maxPictureSize: 35651584,
		maxBitrate: 48e7,
		level: 62
	}
];
var VP9_DEFAULT_SUFFIX = ".01.01.01.01.00";
var AV1_DEFAULT_SUFFIX = ".0.110.01.01.01.0";
var PRORES_FOURCCS = [
	"ap4x",
	"ap4h",
	"apch",
	"apcn",
	"apcs",
	"apco"
];
var extractVideoCodecString = (trackInfo) => {
	const { codec, codecDescription, colorSpace, avcCodecInfo, hevcCodecInfo, vp9CodecInfo, av1CodecInfo, proresFormat } = trackInfo;
	if (codec === "avc") {
		assert$1(trackInfo.avcType !== null);
		if (avcCodecInfo) {
			const bytes$1 = new Uint8Array([
				avcCodecInfo.avcProfileIndication,
				avcCodecInfo.profileCompatibility,
				avcCodecInfo.avcLevelIndication
			]);
			return `avc${trackInfo.avcType}.${bytesToHexString(bytes$1)}`;
		}
		if (!codecDescription || codecDescription.byteLength < 4) throw new TypeError("AVC decoder description is not provided or is not at least 4 bytes long.");
		return `avc${trackInfo.avcType}.${bytesToHexString(codecDescription.subarray(1, 4))}`;
	} else if (codec === "hevc") {
		let generalProfileSpace;
		let generalProfileIdc;
		let compatibilityFlags;
		let generalTierFlag;
		let generalLevelIdc;
		let constraintFlags;
		if (hevcCodecInfo) {
			generalProfileSpace = hevcCodecInfo.generalProfileSpace;
			generalProfileIdc = hevcCodecInfo.generalProfileIdc;
			compatibilityFlags = reverseBitsU32(hevcCodecInfo.generalProfileCompatibilityFlags);
			generalTierFlag = hevcCodecInfo.generalTierFlag;
			generalLevelIdc = hevcCodecInfo.generalLevelIdc;
			constraintFlags = [...hevcCodecInfo.generalConstraintIndicatorFlags];
		} else {
			if (!codecDescription || codecDescription.byteLength < 23) throw new TypeError("HEVC decoder description is not provided or is not at least 23 bytes long.");
			const view$1 = toDataView(codecDescription);
			const profileByte = view$1.getUint8(1);
			generalProfileSpace = profileByte >> 6 & 3;
			generalProfileIdc = profileByte & 31;
			compatibilityFlags = reverseBitsU32(view$1.getUint32(2));
			generalTierFlag = profileByte >> 5 & 1;
			generalLevelIdc = view$1.getUint8(12);
			constraintFlags = [];
			for (let i = 0; i < 6; i++) constraintFlags.push(view$1.getUint8(6 + i));
		}
		let codecString = "hev1.";
		codecString += [
			"",
			"A",
			"B",
			"C"
		][generalProfileSpace] + generalProfileIdc;
		codecString += ".";
		codecString += compatibilityFlags.toString(16).toUpperCase();
		codecString += ".";
		codecString += generalTierFlag === 0 ? "L" : "H";
		codecString += generalLevelIdc;
		while (constraintFlags.length > 0 && constraintFlags[constraintFlags.length - 1] === 0) constraintFlags.pop();
		if (constraintFlags.length > 0) {
			codecString += ".";
			codecString += constraintFlags.map((x$1) => x$1.toString(16).toUpperCase()).join(".");
		}
		return codecString;
	} else if (codec === "vp8") return "vp8";
	else if (codec === "vp9") {
		if (!vp9CodecInfo) {
			const pictureSize = trackInfo.width * trackInfo.height;
			let level2 = last(VP9_LEVEL_TABLE).level;
			for (const entry of VP9_LEVEL_TABLE) if (pictureSize <= entry.maxPictureSize) {
				level2 = entry.level;
				break;
			}
			return `vp09.00.${level2.toString().padStart(2, "0")}.08`;
		}
		const profile = vp9CodecInfo.profile.toString().padStart(2, "0");
		const level = vp9CodecInfo.level.toString().padStart(2, "0");
		const bitDepth = vp9CodecInfo.bitDepth.toString().padStart(2, "0");
		const chromaSubsampling = vp9CodecInfo.chromaSubsampling.toString().padStart(2, "0");
		const colourPrimaries = vp9CodecInfo.colourPrimaries.toString().padStart(2, "0");
		const transferCharacteristics = vp9CodecInfo.transferCharacteristics.toString().padStart(2, "0");
		const matrixCoefficients = vp9CodecInfo.matrixCoefficients.toString().padStart(2, "0");
		const videoFullRangeFlag = vp9CodecInfo.videoFullRangeFlag.toString().padStart(2, "0");
		let string = `vp09.${profile}.${level}.${bitDepth}.${chromaSubsampling}`;
		string += `.${colourPrimaries}.${transferCharacteristics}.${matrixCoefficients}.${videoFullRangeFlag}`;
		if (string.endsWith(VP9_DEFAULT_SUFFIX)) string = string.slice(0, -VP9_DEFAULT_SUFFIX.length);
		return string;
	} else if (codec === "av1") {
		if (!av1CodecInfo) {
			const pictureSize = trackInfo.width * trackInfo.height;
			let level2 = last(VP9_LEVEL_TABLE).level;
			for (const entry of VP9_LEVEL_TABLE) if (pictureSize <= entry.maxPictureSize) {
				level2 = entry.level;
				break;
			}
			return `av01.0.${level2.toString().padStart(2, "0")}M.08`;
		}
		const profile = av1CodecInfo.profile;
		const level = av1CodecInfo.level.toString().padStart(2, "0");
		const tier = av1CodecInfo.tier ? "H" : "M";
		const bitDepth = av1CodecInfo.bitDepth.toString().padStart(2, "0");
		const monochrome = av1CodecInfo.monochrome ? "1" : "0";
		const chromaSubsampling = 100 * av1CodecInfo.chromaSubsamplingX + 10 * av1CodecInfo.chromaSubsamplingY + 1 * (av1CodecInfo.chromaSubsamplingX && av1CodecInfo.chromaSubsamplingY ? av1CodecInfo.chromaSamplePosition : 0);
		const colorPrimaries = colorSpace?.primaries ? COLOR_PRIMARIES_MAP[colorSpace.primaries] : 1;
		const transferCharacteristics = colorSpace?.transfer ? TRANSFER_CHARACTERISTICS_MAP[colorSpace.transfer] : 1;
		const matrixCoefficients = colorSpace?.matrix ? MATRIX_COEFFICIENTS_MAP[colorSpace.matrix] : 1;
		const videoFullRangeFlag = colorSpace?.fullRange ? 1 : 0;
		let string = `av01.${profile}.${level}${tier}.${bitDepth}`;
		string += `.${monochrome}.${chromaSubsampling.toString().padStart(3, "0")}`;
		string += `.${colorPrimaries.toString().padStart(2, "0")}`;
		string += `.${transferCharacteristics.toString().padStart(2, "0")}`;
		string += `.${matrixCoefficients.toString().padStart(2, "0")}`;
		string += `.${videoFullRangeFlag}`;
		if (string.endsWith(AV1_DEFAULT_SUFFIX)) string = string.slice(0, -AV1_DEFAULT_SUFFIX.length);
		return string;
	} else if (codec === "prores") return proresFormat ?? "apch";
	else if (codec !== null) assertNever(codec);
	throw new TypeError(`Unhandled codec '${codec}'.`);
};
[...PRORES_FOURCCS];
var iterateNalUnitsInAnnexB = function* (packetData) {
	let i = 0;
	let nalStart = -1;
	while (i < packetData.length - 2) {
		const zeroIndex = packetData.indexOf(0, i);
		if (zeroIndex === -1 || zeroIndex >= packetData.length - 2) break;
		i = zeroIndex;
		let startCodeLength = 0;
		if (i + 3 < packetData.length && packetData[i + 1] === 0 && packetData[i + 2] === 0 && packetData[i + 3] === 1) startCodeLength = 4;
		else if (packetData[i + 1] === 0 && packetData[i + 2] === 1) startCodeLength = 3;
		if (startCodeLength === 0) {
			i++;
			continue;
		}
		if (nalStart !== -1 && i > nalStart) yield {
			offset: nalStart,
			length: i - nalStart
		};
		nalStart = i + startCodeLength;
		i = nalStart;
	}
	if (nalStart !== -1 && nalStart < packetData.length) yield {
		offset: nalStart,
		length: packetData.length - nalStart
	};
};
var extractNalUnitTypeForAvc = (byte) => {
	return byte & 31;
};
var removeEmulationPreventionBytes = (data) => {
	const result = [];
	const len = data.length;
	for (let i = 0; i < len; i++) if (i + 2 < len && data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 3) {
		result.push(0, 0);
		i += 2;
	} else result.push(data[i]);
	return new Uint8Array(result);
};
new Uint8Array([
	0,
	0,
	0,
	1
]);
var extractAvcDecoderConfigurationRecord = (packetData) => {
	try {
		const spsUnits = [];
		const ppsUnits = [];
		const spsExtUnits = [];
		for (const loc of iterateNalUnitsInAnnexB(packetData)) {
			const nalUnit = packetData.subarray(loc.offset, loc.offset + loc.length);
			const type = extractNalUnitTypeForAvc(nalUnit[0]);
			if (type === 7) spsUnits.push(nalUnit);
			else if (type === 8) ppsUnits.push(nalUnit);
			else if (type === 13) spsExtUnits.push(nalUnit);
		}
		if (spsUnits.length === 0) return null;
		if (ppsUnits.length === 0) return null;
		const spsData = spsUnits[0];
		const spsInfo = parseAvcSps(spsData);
		assert$1(spsInfo !== null);
		const hasExtendedData = spsInfo.profileIdc === 100 || spsInfo.profileIdc === 110 || spsInfo.profileIdc === 122 || spsInfo.profileIdc === 144;
		return {
			configurationVersion: 1,
			avcProfileIndication: spsInfo.profileIdc,
			profileCompatibility: spsInfo.constraintFlags,
			avcLevelIndication: spsInfo.levelIdc,
			lengthSizeMinusOne: 3,
			sequenceParameterSets: spsUnits,
			pictureParameterSets: ppsUnits,
			chromaFormat: hasExtendedData ? spsInfo.chromaFormatIdc : null,
			bitDepthLumaMinus8: hasExtendedData ? spsInfo.bitDepthLumaMinus8 : null,
			bitDepthChromaMinus8: hasExtendedData ? spsInfo.bitDepthChromaMinus8 : null,
			sequenceParameterSetExt: hasExtendedData ? spsExtUnits : null
		};
	} catch (error) {
		Logging._error("Error building AVC Decoder Configuration Record:", error);
		return null;
	}
};
var serializeAvcDecoderConfigurationRecord = (record) => {
	const bytes$1 = [];
	bytes$1.push(record.configurationVersion);
	bytes$1.push(record.avcProfileIndication);
	bytes$1.push(record.profileCompatibility);
	bytes$1.push(record.avcLevelIndication);
	bytes$1.push(252 | record.lengthSizeMinusOne & 3);
	bytes$1.push(224 | record.sequenceParameterSets.length & 31);
	for (const sps of record.sequenceParameterSets) {
		const length = sps.byteLength;
		bytes$1.push(length >> 8);
		bytes$1.push(length & 255);
		for (let i = 0; i < length; i++) bytes$1.push(sps[i]);
	}
	bytes$1.push(record.pictureParameterSets.length);
	for (const pps of record.pictureParameterSets) {
		const length = pps.byteLength;
		bytes$1.push(length >> 8);
		bytes$1.push(length & 255);
		for (let i = 0; i < length; i++) bytes$1.push(pps[i]);
	}
	if (record.avcProfileIndication === 100 || record.avcProfileIndication === 110 || record.avcProfileIndication === 122 || record.avcProfileIndication === 144) {
		assert$1(record.chromaFormat !== null);
		assert$1(record.bitDepthLumaMinus8 !== null);
		assert$1(record.bitDepthChromaMinus8 !== null);
		assert$1(record.sequenceParameterSetExt !== null);
		bytes$1.push(252 | record.chromaFormat & 3);
		bytes$1.push(248 | record.bitDepthLumaMinus8 & 7);
		bytes$1.push(248 | record.bitDepthChromaMinus8 & 7);
		bytes$1.push(record.sequenceParameterSetExt.length);
		for (const spsExt of record.sequenceParameterSetExt) {
			const length = spsExt.byteLength;
			bytes$1.push(length >> 8);
			bytes$1.push(length & 255);
			for (let i = 0; i < length; i++) bytes$1.push(spsExt[i]);
		}
	}
	return new Uint8Array(bytes$1);
};
var AVC_HEVC_ASPECT_RATIO_IDC_TABLE = {
	1: {
		num: 1,
		den: 1
	},
	2: {
		num: 12,
		den: 11
	},
	3: {
		num: 10,
		den: 11
	},
	4: {
		num: 16,
		den: 11
	},
	5: {
		num: 40,
		den: 33
	},
	6: {
		num: 24,
		den: 11
	},
	7: {
		num: 20,
		den: 11
	},
	8: {
		num: 32,
		den: 11
	},
	9: {
		num: 80,
		den: 33
	},
	10: {
		num: 18,
		den: 11
	},
	11: {
		num: 15,
		den: 11
	},
	12: {
		num: 64,
		den: 33
	},
	13: {
		num: 160,
		den: 99
	},
	14: {
		num: 4,
		den: 3
	},
	15: {
		num: 3,
		den: 2
	},
	16: {
		num: 2,
		den: 1
	}
};
var parseAvcSps = (sps) => {
	try {
		const bitstream = new Bitstream(removeEmulationPreventionBytes(sps));
		bitstream.skipBits(1);
		bitstream.skipBits(2);
		if (bitstream.readBits(5) !== 7) return null;
		const profileIdc = bitstream.readAlignedByte();
		const constraintFlags = bitstream.readAlignedByte();
		const levelIdc = bitstream.readAlignedByte();
		readExpGolomb(bitstream);
		let chromaFormatIdc = 1;
		let bitDepthLumaMinus8 = 0;
		let bitDepthChromaMinus8 = 0;
		let separateColourPlaneFlag = 0;
		if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
			chromaFormatIdc = readExpGolomb(bitstream);
			if (chromaFormatIdc === 3) separateColourPlaneFlag = bitstream.readBits(1);
			bitDepthLumaMinus8 = readExpGolomb(bitstream);
			bitDepthChromaMinus8 = readExpGolomb(bitstream);
			bitstream.skipBits(1);
			if (bitstream.readBits(1)) {
				for (let i = 0; i < (chromaFormatIdc !== 3 ? 8 : 12); i++) if (bitstream.readBits(1)) {
					const sizeOfScalingList = i < 6 ? 16 : 64;
					let lastScale = 8;
					let nextScale = 8;
					for (let j$1 = 0; j$1 < sizeOfScalingList; j$1++) {
						if (nextScale !== 0) {
							const deltaScale = readSignedExpGolomb(bitstream);
							nextScale = (lastScale + deltaScale + 256) % 256;
						}
						lastScale = nextScale === 0 ? lastScale : nextScale;
					}
				}
			}
		}
		readExpGolomb(bitstream);
		const picOrderCntType = readExpGolomb(bitstream);
		if (picOrderCntType === 0) readExpGolomb(bitstream);
		else if (picOrderCntType === 1) {
			bitstream.skipBits(1);
			readSignedExpGolomb(bitstream);
			readSignedExpGolomb(bitstream);
			const numRefFramesInPicOrderCntCycle = readExpGolomb(bitstream);
			for (let i = 0; i < numRefFramesInPicOrderCntCycle; i++) readSignedExpGolomb(bitstream);
		}
		readExpGolomb(bitstream);
		bitstream.skipBits(1);
		const picWidthInMbsMinus1 = readExpGolomb(bitstream);
		const picHeightInMapUnitsMinus1 = readExpGolomb(bitstream);
		const codedWidth = 16 * (picWidthInMbsMinus1 + 1);
		const codedHeight = 16 * (picHeightInMapUnitsMinus1 + 1);
		let displayWidth = codedWidth;
		let displayHeight = codedHeight;
		const frameMbsOnlyFlag = bitstream.readBits(1);
		if (!frameMbsOnlyFlag) bitstream.skipBits(1);
		bitstream.skipBits(1);
		if (bitstream.readBits(1)) {
			const frameCropLeftOffset = readExpGolomb(bitstream);
			const frameCropRightOffset = readExpGolomb(bitstream);
			const frameCropTopOffset = readExpGolomb(bitstream);
			const frameCropBottomOffset = readExpGolomb(bitstream);
			let cropUnitX;
			let cropUnitY;
			if ((separateColourPlaneFlag === 0 ? chromaFormatIdc : 0) === 0) {
				cropUnitX = 1;
				cropUnitY = 2 - frameMbsOnlyFlag;
			} else {
				const subWidthC = chromaFormatIdc === 3 ? 1 : 2;
				const subHeightC = chromaFormatIdc === 1 ? 2 : 1;
				cropUnitX = subWidthC;
				cropUnitY = subHeightC * (2 - frameMbsOnlyFlag);
			}
			displayWidth -= cropUnitX * (frameCropLeftOffset + frameCropRightOffset);
			displayHeight -= cropUnitY * (frameCropTopOffset + frameCropBottomOffset);
		}
		let colourPrimaries = 2;
		let transferCharacteristics = 2;
		let matrixCoefficients = 2;
		let fullRangeFlag = 0;
		let pixelAspectRatio = {
			num: 1,
			den: 1
		};
		let numReorderFrames = null;
		let maxDecFrameBuffering = null;
		if (bitstream.readBits(1)) {
			if (bitstream.readBits(1)) {
				const aspectRatioIdc = bitstream.readBits(8);
				if (aspectRatioIdc === 255) pixelAspectRatio = {
					num: bitstream.readBits(16),
					den: bitstream.readBits(16)
				};
				else {
					const aspectRatio = AVC_HEVC_ASPECT_RATIO_IDC_TABLE[aspectRatioIdc];
					if (aspectRatio) pixelAspectRatio = aspectRatio;
				}
			}
			if (bitstream.readBits(1)) bitstream.skipBits(1);
			if (bitstream.readBits(1)) {
				bitstream.skipBits(3);
				fullRangeFlag = bitstream.readBits(1);
				if (bitstream.readBits(1)) {
					colourPrimaries = bitstream.readBits(8);
					transferCharacteristics = bitstream.readBits(8);
					matrixCoefficients = bitstream.readBits(8);
				}
			}
			if (bitstream.readBits(1)) {
				readExpGolomb(bitstream);
				readExpGolomb(bitstream);
			}
			if (bitstream.readBits(1)) {
				bitstream.skipBits(32);
				bitstream.skipBits(32);
				bitstream.skipBits(1);
			}
			const nalHrdParametersPresentFlag = bitstream.readBits(1);
			if (nalHrdParametersPresentFlag) skipAvcHrdParameters(bitstream);
			const vclHrdParametersPresentFlag = bitstream.readBits(1);
			if (vclHrdParametersPresentFlag) skipAvcHrdParameters(bitstream);
			if (nalHrdParametersPresentFlag || vclHrdParametersPresentFlag) bitstream.skipBits(1);
			bitstream.skipBits(1);
			if (bitstream.readBits(1)) {
				bitstream.skipBits(1);
				readExpGolomb(bitstream);
				readExpGolomb(bitstream);
				readExpGolomb(bitstream);
				readExpGolomb(bitstream);
				numReorderFrames = readExpGolomb(bitstream);
				maxDecFrameBuffering = readExpGolomb(bitstream);
			}
		}
		if (numReorderFrames === null) {
			assert$1(maxDecFrameBuffering === null);
			const constraintSet3Flag = constraintFlags & 16;
			if ((profileIdc === 44 || profileIdc === 86 || profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244) && constraintSet3Flag) {
				numReorderFrames = 0;
				maxDecFrameBuffering = 0;
			} else {
				const picWidthInMbs = picWidthInMbsMinus1 + 1;
				const picHeightInMapUnits = picHeightInMapUnitsMinus1 + 1;
				const frameHeightInMbs = (2 - frameMbsOnlyFlag) * picHeightInMapUnits;
				const levelInfo = AVC_LEVEL_TABLE.find((x$1) => x$1.level >= levelIdc) ?? last(AVC_LEVEL_TABLE);
				const maxDpbFrames = Math.min(Math.floor(levelInfo.maxDpbMbs / (picWidthInMbs * frameHeightInMbs)), 16);
				numReorderFrames = maxDpbFrames;
				maxDecFrameBuffering = maxDpbFrames;
			}
		}
		assert$1(maxDecFrameBuffering !== null);
		return {
			profileIdc,
			constraintFlags,
			levelIdc,
			frameMbsOnlyFlag,
			chromaFormatIdc,
			bitDepthLumaMinus8,
			bitDepthChromaMinus8,
			codedWidth,
			codedHeight,
			displayWidth,
			displayHeight,
			pixelAspectRatio,
			colourPrimaries,
			matrixCoefficients,
			transferCharacteristics,
			fullRangeFlag,
			numReorderFrames,
			maxDecFrameBuffering
		};
	} catch (error) {
		Logging._error("Error parsing AVC SPS:", error);
		return null;
	}
};
var skipAvcHrdParameters = (bitstream) => {
	const cpb_cnt_minus1 = readExpGolomb(bitstream);
	bitstream.skipBits(4);
	bitstream.skipBits(4);
	for (let i = 0; i <= cpb_cnt_minus1; i++) {
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		bitstream.skipBits(1);
	}
	bitstream.skipBits(5);
	bitstream.skipBits(5);
	bitstream.skipBits(5);
	bitstream.skipBits(5);
};
var extractNalUnitTypeForHevc = (byte) => {
	return byte >> 1 & 63;
};
var parseHevcSps = (sps) => {
	try {
		const bitstream = new Bitstream(removeEmulationPreventionBytes(sps));
		bitstream.skipBits(16);
		bitstream.readBits(4);
		const spsMaxSubLayersMinus1 = bitstream.readBits(3);
		const spsTemporalIdNestingFlag = bitstream.readBits(1);
		const { general_profile_space, general_tier_flag, general_profile_idc, general_profile_compatibility_flags, general_constraint_indicator_flags, general_level_idc } = parseProfileTierLevel(bitstream, spsMaxSubLayersMinus1);
		readExpGolomb(bitstream);
		const chromaFormatIdc = readExpGolomb(bitstream);
		let separateColourPlaneFlag = 0;
		if (chromaFormatIdc === 3) separateColourPlaneFlag = bitstream.readBits(1);
		const picWidthInLumaSamples = readExpGolomb(bitstream);
		const picHeightInLumaSamples = readExpGolomb(bitstream);
		let displayWidth = picWidthInLumaSamples;
		let displayHeight = picHeightInLumaSamples;
		if (bitstream.readBits(1)) {
			const confWinLeftOffset = readExpGolomb(bitstream);
			const confWinRightOffset = readExpGolomb(bitstream);
			const confWinTopOffset = readExpGolomb(bitstream);
			const confWinBottomOffset = readExpGolomb(bitstream);
			let subWidthC = 1;
			let subHeightC = 1;
			const chromaArrayType = separateColourPlaneFlag === 0 ? chromaFormatIdc : 0;
			if (chromaArrayType === 1) {
				subWidthC = 2;
				subHeightC = 2;
			} else if (chromaArrayType === 2) {
				subWidthC = 2;
				subHeightC = 1;
			}
			displayWidth -= (confWinLeftOffset + confWinRightOffset) * subWidthC;
			displayHeight -= (confWinTopOffset + confWinBottomOffset) * subHeightC;
		}
		const bitDepthLumaMinus8 = readExpGolomb(bitstream);
		const bitDepthChromaMinus8 = readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		const startI = bitstream.readBits(1) ? 0 : spsMaxSubLayersMinus1;
		let spsMaxNumReorderPics = 0;
		for (let i = startI; i <= spsMaxSubLayersMinus1; i++) {
			readExpGolomb(bitstream);
			spsMaxNumReorderPics = readExpGolomb(bitstream);
			readExpGolomb(bitstream);
		}
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		if (bitstream.readBits(1)) {
			if (bitstream.readBits(1)) skipScalingListData(bitstream);
		}
		bitstream.skipBits(1);
		bitstream.skipBits(1);
		if (bitstream.readBits(1)) {
			bitstream.skipBits(4);
			bitstream.skipBits(4);
			readExpGolomb(bitstream);
			readExpGolomb(bitstream);
			bitstream.skipBits(1);
		}
		skipAllStRefPicSets(bitstream, readExpGolomb(bitstream));
		if (bitstream.readBits(1)) {
			const numLongTermRefPicsSps = readExpGolomb(bitstream);
			for (let i = 0; i < numLongTermRefPicsSps; i++) {
				readExpGolomb(bitstream);
				bitstream.skipBits(1);
			}
		}
		bitstream.skipBits(1);
		bitstream.skipBits(1);
		let colourPrimaries = 2;
		let transferCharacteristics = 2;
		let matrixCoefficients = 2;
		let fullRangeFlag = 0;
		let minSpatialSegmentationIdc = 0;
		let pixelAspectRatio = {
			num: 1,
			den: 1
		};
		if (bitstream.readBits(1)) {
			const vui = parseHevcVui(bitstream, spsMaxSubLayersMinus1);
			pixelAspectRatio = vui.pixelAspectRatio;
			colourPrimaries = vui.colourPrimaries;
			transferCharacteristics = vui.transferCharacteristics;
			matrixCoefficients = vui.matrixCoefficients;
			fullRangeFlag = vui.fullRangeFlag;
			minSpatialSegmentationIdc = vui.minSpatialSegmentationIdc;
		}
		return {
			displayWidth,
			displayHeight,
			pixelAspectRatio,
			colourPrimaries,
			transferCharacteristics,
			matrixCoefficients,
			fullRangeFlag,
			maxDecFrameBuffering: spsMaxNumReorderPics + 1,
			spsMaxSubLayersMinus1,
			spsTemporalIdNestingFlag,
			generalProfileSpace: general_profile_space,
			generalTierFlag: general_tier_flag,
			generalProfileIdc: general_profile_idc,
			generalProfileCompatibilityFlags: general_profile_compatibility_flags,
			generalConstraintIndicatorFlags: general_constraint_indicator_flags,
			generalLevelIdc: general_level_idc,
			chromaFormatIdc,
			bitDepthLumaMinus8,
			bitDepthChromaMinus8,
			minSpatialSegmentationIdc
		};
	} catch (error) {
		Logging._error("Error parsing HEVC SPS:", error);
		return null;
	}
};
var extractHevcDecoderConfigurationRecord = (packetData) => {
	try {
		const vpsUnits = [];
		const spsUnits = [];
		const ppsUnits = [];
		const seiUnits = [];
		for (const loc of iterateNalUnitsInAnnexB(packetData)) {
			const nalUnit = packetData.subarray(loc.offset, loc.offset + loc.length);
			const type = extractNalUnitTypeForHevc(nalUnit[0]);
			if (type === 32) vpsUnits.push(nalUnit);
			else if (type === 33) spsUnits.push(nalUnit);
			else if (type === 34) ppsUnits.push(nalUnit);
			else if (type === 39 || type === 40) seiUnits.push(nalUnit);
		}
		if (spsUnits.length === 0 || ppsUnits.length === 0) return null;
		const spsInfo = parseHevcSps(spsUnits[0]);
		if (!spsInfo) return null;
		let parallelismType = 0;
		if (ppsUnits.length > 0) {
			const pps = ppsUnits[0];
			const ppsBitstream = new Bitstream(removeEmulationPreventionBytes(pps));
			ppsBitstream.skipBits(16);
			readExpGolomb(ppsBitstream);
			readExpGolomb(ppsBitstream);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(3);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(1);
			readExpGolomb(ppsBitstream);
			readExpGolomb(ppsBitstream);
			readSignedExpGolomb(ppsBitstream);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(1);
			if (ppsBitstream.readBits(1)) readExpGolomb(ppsBitstream);
			readSignedExpGolomb(ppsBitstream);
			readSignedExpGolomb(ppsBitstream);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(1);
			ppsBitstream.skipBits(1);
			const tiles_enabled_flag = ppsBitstream.readBits(1);
			const entropy_coding_sync_enabled_flag = ppsBitstream.readBits(1);
			if (!tiles_enabled_flag && !entropy_coding_sync_enabled_flag) parallelismType = 0;
			else if (tiles_enabled_flag && !entropy_coding_sync_enabled_flag) parallelismType = 2;
			else if (!tiles_enabled_flag && entropy_coding_sync_enabled_flag) parallelismType = 3;
			else parallelismType = 0;
		}
		const arrays = [
			...vpsUnits.length ? [{
				arrayCompleteness: 1,
				nalUnitType: 32,
				nalUnits: vpsUnits
			}] : [],
			...spsUnits.length ? [{
				arrayCompleteness: 1,
				nalUnitType: 33,
				nalUnits: spsUnits
			}] : [],
			...ppsUnits.length ? [{
				arrayCompleteness: 1,
				nalUnitType: 34,
				nalUnits: ppsUnits
			}] : [],
			...seiUnits.length ? [{
				arrayCompleteness: 1,
				nalUnitType: extractNalUnitTypeForHevc(seiUnits[0][0]),
				nalUnits: seiUnits
			}] : []
		];
		return {
			configurationVersion: 1,
			generalProfileSpace: spsInfo.generalProfileSpace,
			generalTierFlag: spsInfo.generalTierFlag,
			generalProfileIdc: spsInfo.generalProfileIdc,
			generalProfileCompatibilityFlags: spsInfo.generalProfileCompatibilityFlags,
			generalConstraintIndicatorFlags: spsInfo.generalConstraintIndicatorFlags,
			generalLevelIdc: spsInfo.generalLevelIdc,
			minSpatialSegmentationIdc: spsInfo.minSpatialSegmentationIdc,
			parallelismType,
			chromaFormatIdc: spsInfo.chromaFormatIdc,
			bitDepthLumaMinus8: spsInfo.bitDepthLumaMinus8,
			bitDepthChromaMinus8: spsInfo.bitDepthChromaMinus8,
			avgFrameRate: 0,
			constantFrameRate: 0,
			numTemporalLayers: spsInfo.spsMaxSubLayersMinus1 + 1,
			temporalIdNested: spsInfo.spsTemporalIdNestingFlag,
			lengthSizeMinusOne: 3,
			arrays
		};
	} catch (error) {
		Logging._error("Error building HEVC Decoder Configuration Record:", error);
		return null;
	}
};
var parseProfileTierLevel = (bitstream, maxNumSubLayersMinus1) => {
	const general_profile_space = bitstream.readBits(2);
	const general_tier_flag = bitstream.readBits(1);
	const general_profile_idc = bitstream.readBits(5);
	let general_profile_compatibility_flags = 0;
	for (let i = 0; i < 32; i++) general_profile_compatibility_flags = general_profile_compatibility_flags << 1 | bitstream.readBits(1);
	const general_constraint_indicator_flags = new Uint8Array(6);
	for (let i = 0; i < 6; i++) general_constraint_indicator_flags[i] = bitstream.readBits(8);
	const general_level_idc = bitstream.readBits(8);
	const sub_layer_profile_present_flag = [];
	const sub_layer_level_present_flag = [];
	for (let i = 0; i < maxNumSubLayersMinus1; i++) {
		sub_layer_profile_present_flag.push(bitstream.readBits(1));
		sub_layer_level_present_flag.push(bitstream.readBits(1));
	}
	if (maxNumSubLayersMinus1 > 0) for (let i = maxNumSubLayersMinus1; i < 8; i++) bitstream.skipBits(2);
	for (let i = 0; i < maxNumSubLayersMinus1; i++) {
		if (sub_layer_profile_present_flag[i]) bitstream.skipBits(88);
		if (sub_layer_level_present_flag[i]) bitstream.skipBits(8);
	}
	return {
		general_profile_space,
		general_tier_flag,
		general_profile_idc,
		general_profile_compatibility_flags,
		general_constraint_indicator_flags,
		general_level_idc
	};
};
var skipScalingListData = (bitstream) => {
	for (let sizeId = 0; sizeId < 4; sizeId++) for (let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++) if (!bitstream.readBits(1)) readExpGolomb(bitstream);
	else {
		const coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
		if (sizeId > 1) readSignedExpGolomb(bitstream);
		for (let i = 0; i < coefNum; i++) readSignedExpGolomb(bitstream);
	}
};
var skipAllStRefPicSets = (bitstream, num_short_term_ref_pic_sets) => {
	const NumDeltaPocs = [];
	for (let stRpsIdx = 0; stRpsIdx < num_short_term_ref_pic_sets; stRpsIdx++) NumDeltaPocs[stRpsIdx] = skipStRefPicSet(bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs);
};
var skipStRefPicSet = (bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs) => {
	let NumDeltaPocsThis = 0;
	let inter_ref_pic_set_prediction_flag = 0;
	let RefRpsIdx = 0;
	if (stRpsIdx !== 0) inter_ref_pic_set_prediction_flag = bitstream.readBits(1);
	if (inter_ref_pic_set_prediction_flag) {
		if (stRpsIdx === num_short_term_ref_pic_sets) RefRpsIdx = stRpsIdx - (readExpGolomb(bitstream) + 1);
		else RefRpsIdx = stRpsIdx - 1;
		bitstream.readBits(1);
		readExpGolomb(bitstream);
		const numDelta = NumDeltaPocs[RefRpsIdx] ?? 0;
		for (let j$1 = 0; j$1 <= numDelta; j$1++) if (!bitstream.readBits(1)) bitstream.readBits(1);
		NumDeltaPocsThis = NumDeltaPocs[RefRpsIdx];
	} else {
		const num_negative_pics = readExpGolomb(bitstream);
		const num_positive_pics = readExpGolomb(bitstream);
		for (let i = 0; i < num_negative_pics; i++) {
			readExpGolomb(bitstream);
			bitstream.readBits(1);
		}
		for (let i = 0; i < num_positive_pics; i++) {
			readExpGolomb(bitstream);
			bitstream.readBits(1);
		}
		NumDeltaPocsThis = num_negative_pics + num_positive_pics;
	}
	return NumDeltaPocsThis;
};
var parseHevcVui = (bitstream, sps_max_sub_layers_minus1) => {
	let colourPrimaries = 2;
	let transferCharacteristics = 2;
	let matrixCoefficients = 2;
	let fullRangeFlag = 0;
	let minSpatialSegmentationIdc = 0;
	let pixelAspectRatio = {
		num: 1,
		den: 1
	};
	if (bitstream.readBits(1)) {
		const aspect_ratio_idc = bitstream.readBits(8);
		if (aspect_ratio_idc === 255) pixelAspectRatio = {
			num: bitstream.readBits(16),
			den: bitstream.readBits(16)
		};
		else {
			const aspectRatio = AVC_HEVC_ASPECT_RATIO_IDC_TABLE[aspect_ratio_idc];
			if (aspectRatio) pixelAspectRatio = aspectRatio;
		}
	}
	if (bitstream.readBits(1)) bitstream.readBits(1);
	if (bitstream.readBits(1)) {
		bitstream.readBits(3);
		fullRangeFlag = bitstream.readBits(1);
		if (bitstream.readBits(1)) {
			colourPrimaries = bitstream.readBits(8);
			transferCharacteristics = bitstream.readBits(8);
			matrixCoefficients = bitstream.readBits(8);
		}
	}
	if (bitstream.readBits(1)) {
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
	}
	bitstream.readBits(1);
	bitstream.readBits(1);
	bitstream.readBits(1);
	if (bitstream.readBits(1)) {
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
	}
	if (bitstream.readBits(1)) {
		bitstream.readBits(32);
		bitstream.readBits(32);
		if (bitstream.readBits(1)) readExpGolomb(bitstream);
		if (bitstream.readBits(1)) skipHevcHrdParameters(bitstream, true, sps_max_sub_layers_minus1);
	}
	if (bitstream.readBits(1)) {
		bitstream.readBits(1);
		bitstream.readBits(1);
		bitstream.readBits(1);
		minSpatialSegmentationIdc = readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
	}
	return {
		pixelAspectRatio,
		colourPrimaries,
		transferCharacteristics,
		matrixCoefficients,
		fullRangeFlag,
		minSpatialSegmentationIdc
	};
};
var skipHevcHrdParameters = (bitstream, commonInfPresentFlag, maxNumSubLayersMinus1) => {
	let nal_hrd_parameters_present_flag = false;
	let vcl_hrd_parameters_present_flag = false;
	let sub_pic_hrd_params_present_flag = false;
	if (commonInfPresentFlag) {
		nal_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
		vcl_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
		if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
			sub_pic_hrd_params_present_flag = bitstream.readBits(1) === 1;
			if (sub_pic_hrd_params_present_flag) {
				bitstream.readBits(8);
				bitstream.readBits(5);
				bitstream.readBits(1);
				bitstream.readBits(5);
			}
			bitstream.readBits(4);
			bitstream.readBits(4);
			if (sub_pic_hrd_params_present_flag) bitstream.readBits(4);
			bitstream.readBits(5);
			bitstream.readBits(5);
			bitstream.readBits(5);
		}
	}
	for (let i = 0; i <= maxNumSubLayersMinus1; i++) {
		const fixed_pic_rate_general_flag = bitstream.readBits(1) === 1;
		let fixed_pic_rate_within_cvs_flag = true;
		if (!fixed_pic_rate_general_flag) fixed_pic_rate_within_cvs_flag = bitstream.readBits(1) === 1;
		let low_delay_hrd_flag = false;
		if (fixed_pic_rate_within_cvs_flag) readExpGolomb(bitstream);
		else low_delay_hrd_flag = bitstream.readBits(1) === 1;
		let CpbCnt = 1;
		if (!low_delay_hrd_flag) CpbCnt = readExpGolomb(bitstream) + 1;
		if (nal_hrd_parameters_present_flag) skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
		if (vcl_hrd_parameters_present_flag) skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
	}
};
var skipSubLayerHrdParameters = (bitstream, CpbCnt, sub_pic_hrd_params_present_flag) => {
	for (let i = 0; i < CpbCnt; i++) {
		readExpGolomb(bitstream);
		readExpGolomb(bitstream);
		if (sub_pic_hrd_params_present_flag) {
			readExpGolomb(bitstream);
			readExpGolomb(bitstream);
		}
		bitstream.readBits(1);
	}
};
var serializeHevcDecoderConfigurationRecord = (record) => {
	const bytes$1 = [];
	bytes$1.push(record.configurationVersion);
	bytes$1.push((record.generalProfileSpace & 3) << 6 | (record.generalTierFlag & 1) << 5 | record.generalProfileIdc & 31);
	bytes$1.push(record.generalProfileCompatibilityFlags >>> 24 & 255);
	bytes$1.push(record.generalProfileCompatibilityFlags >>> 16 & 255);
	bytes$1.push(record.generalProfileCompatibilityFlags >>> 8 & 255);
	bytes$1.push(record.generalProfileCompatibilityFlags & 255);
	bytes$1.push(...record.generalConstraintIndicatorFlags);
	bytes$1.push(record.generalLevelIdc & 255);
	bytes$1.push(240 | record.minSpatialSegmentationIdc >> 8 & 15);
	bytes$1.push(record.minSpatialSegmentationIdc & 255);
	bytes$1.push(252 | record.parallelismType & 3);
	bytes$1.push(252 | record.chromaFormatIdc & 3);
	bytes$1.push(248 | record.bitDepthLumaMinus8 & 7);
	bytes$1.push(248 | record.bitDepthChromaMinus8 & 7);
	bytes$1.push(record.avgFrameRate >> 8 & 255);
	bytes$1.push(record.avgFrameRate & 255);
	bytes$1.push((record.constantFrameRate & 3) << 6 | (record.numTemporalLayers & 7) << 3 | (record.temporalIdNested & 1) << 2 | record.lengthSizeMinusOne & 3);
	bytes$1.push(record.arrays.length & 255);
	for (const arr of record.arrays) {
		bytes$1.push((arr.arrayCompleteness & 1) << 7 | 0 | arr.nalUnitType & 63);
		bytes$1.push(arr.nalUnits.length >> 8 & 255);
		bytes$1.push(arr.nalUnits.length & 255);
		for (const nal of arr.nalUnits) {
			bytes$1.push(nal.length >> 8 & 255);
			bytes$1.push(nal.length & 255);
			for (let i = 0; i < nal.length; i++) bytes$1.push(nal[i]);
		}
	}
	return new Uint8Array(bytes$1);
};
var extractVp9CodecInfoFromPacket = (packet) => {
	const bitstream = new Bitstream(packet);
	if (bitstream.readBits(2) !== 2) return null;
	const profileLowBit = bitstream.readBits(1);
	const profile = (bitstream.readBits(1) << 1) + profileLowBit;
	if (profile === 3) bitstream.skipBits(1);
	if (bitstream.readBits(1) === 1) return null;
	if (bitstream.readBits(1) !== 0) return null;
	bitstream.skipBits(2);
	if (bitstream.readBits(24) !== 4817730) return null;
	let bitDepth = 8;
	if (profile >= 2) bitDepth = bitstream.readBits(1) ? 12 : 10;
	const colorSpace = bitstream.readBits(3);
	let chromaSubsampling = 0;
	let videoFullRangeFlag = 0;
	if (colorSpace !== 7) {
		videoFullRangeFlag = bitstream.readBits(1);
		if (profile === 1 || profile === 3) {
			const subsamplingX = bitstream.readBits(1);
			const subsamplingY = bitstream.readBits(1);
			chromaSubsampling = !subsamplingX && !subsamplingY ? 3 : subsamplingX && !subsamplingY ? 2 : 1;
			bitstream.skipBits(1);
		} else chromaSubsampling = 1;
	} else {
		chromaSubsampling = 3;
		videoFullRangeFlag = 1;
	}
	const widthMinusOne = bitstream.readBits(16);
	const heightMinusOne = bitstream.readBits(16);
	const pictureSize = (widthMinusOne + 1) * (heightMinusOne + 1);
	let level = last(VP9_LEVEL_TABLE).level;
	for (const entry of VP9_LEVEL_TABLE) if (pictureSize <= entry.maxPictureSize) {
		level = entry.level;
		break;
	}
	return {
		profile,
		level,
		bitDepth,
		chromaSubsampling,
		videoFullRangeFlag,
		colourPrimaries: colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2,
		transferCharacteristics: colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2,
		matrixCoefficients: colorSpace === 7 ? 0 : colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2
	};
};
var iterateAv1PacketObus = function* (packet) {
	const bitstream = new Bitstream(packet);
	const readLeb128 = () => {
		let value = 0;
		for (let i = 0; i < 8; i++) {
			const byte = bitstream.readAlignedByte();
			value |= (byte & 127) << i * 7;
			if (!(byte & 128)) break;
			if (i === 7 && byte & 128) return null;
		}
		if (value >= 2 ** 32 - 1) return null;
		return value;
	};
	while (bitstream.getBitsLeft() >= 8) {
		bitstream.skipBits(1);
		const obuType = bitstream.readBits(4);
		const obuExtension = bitstream.readBits(1);
		const obuHasSizeField = bitstream.readBits(1);
		bitstream.skipBits(1);
		if (obuExtension) bitstream.skipBits(8);
		let obuSize;
		if (obuHasSizeField) {
			const obuSizeValue = readLeb128();
			if (obuSizeValue === null) return;
			obuSize = obuSizeValue;
		} else obuSize = Math.floor(bitstream.getBitsLeft() / 8);
		assert$1(bitstream.pos % 8 === 0);
		yield {
			type: obuType,
			data: packet.subarray(bitstream.pos / 8, bitstream.pos / 8 + obuSize)
		};
		bitstream.skipBits(obuSize * 8);
	}
};
var extractAv1CodecInfoFromPacket = (packet) => {
	for (const { type, data } of iterateAv1PacketObus(packet)) {
		if (type !== 1) continue;
		const bitstream = new Bitstream(data);
		const seqProfile = bitstream.readBits(3);
		bitstream.readBits(1);
		const reducedStillPictureHeader = bitstream.readBits(1);
		let seqLevel = 0;
		let seqTier = 0;
		let bufferDelayLengthMinus1 = 0;
		if (reducedStillPictureHeader) seqLevel = bitstream.readBits(5);
		else {
			if (bitstream.readBits(1)) {
				bitstream.skipBits(32);
				bitstream.skipBits(32);
				if (bitstream.readBits(1)) return null;
			}
			const decoderModelInfoPresentFlag = bitstream.readBits(1);
			if (decoderModelInfoPresentFlag) {
				bufferDelayLengthMinus1 = bitstream.readBits(5);
				bitstream.skipBits(32);
				bitstream.skipBits(5);
				bitstream.skipBits(5);
			}
			const operatingPointsCntMinus1 = bitstream.readBits(5);
			for (let i = 0; i <= operatingPointsCntMinus1; i++) {
				bitstream.skipBits(12);
				const seqLevelIdx = bitstream.readBits(5);
				if (i === 0) seqLevel = seqLevelIdx;
				if (seqLevelIdx > 7) {
					const seqTierTemp = bitstream.readBits(1);
					if (i === 0) seqTier = seqTierTemp;
				}
				if (decoderModelInfoPresentFlag) {
					if (bitstream.readBits(1)) {
						const n = bufferDelayLengthMinus1 + 1;
						bitstream.skipBits(n);
						bitstream.skipBits(n);
						bitstream.skipBits(1);
					}
				}
				if (bitstream.readBits(1)) bitstream.skipBits(4);
			}
		}
		const frameWidthBitsMinus1 = bitstream.readBits(4);
		const frameHeightBitsMinus1 = bitstream.readBits(4);
		const n1 = frameWidthBitsMinus1 + 1;
		bitstream.skipBits(n1);
		const n2 = frameHeightBitsMinus1 + 1;
		bitstream.skipBits(n2);
		let frameIdNumbersPresentFlag = 0;
		if (reducedStillPictureHeader) frameIdNumbersPresentFlag = 0;
		else frameIdNumbersPresentFlag = bitstream.readBits(1);
		if (frameIdNumbersPresentFlag) {
			bitstream.skipBits(4);
			bitstream.skipBits(3);
		}
		bitstream.skipBits(1);
		bitstream.skipBits(1);
		bitstream.skipBits(1);
		if (!reducedStillPictureHeader) {
			bitstream.skipBits(1);
			bitstream.skipBits(1);
			bitstream.skipBits(1);
			bitstream.skipBits(1);
			const enableOrderHint = bitstream.readBits(1);
			if (enableOrderHint) {
				bitstream.skipBits(1);
				bitstream.skipBits(1);
			}
			const seqChooseScreenContentTools = bitstream.readBits(1);
			let seqForceScreenContentTools = 0;
			if (seqChooseScreenContentTools) seqForceScreenContentTools = 2;
			else seqForceScreenContentTools = bitstream.readBits(1);
			if (seqForceScreenContentTools > 0) {
				if (!bitstream.readBits(1)) bitstream.skipBits(1);
			}
			if (enableOrderHint) bitstream.skipBits(3);
		}
		bitstream.skipBits(1);
		bitstream.skipBits(1);
		bitstream.skipBits(1);
		const highBitdepth = bitstream.readBits(1);
		let bitDepth = 8;
		if (seqProfile === 2 && highBitdepth) bitDepth = bitstream.readBits(1) ? 12 : 10;
		else if (seqProfile <= 2) bitDepth = highBitdepth ? 10 : 8;
		let monochrome = 0;
		if (seqProfile !== 1) monochrome = bitstream.readBits(1);
		let chromaSubsamplingX = 1;
		let chromaSubsamplingY = 1;
		let chromaSamplePosition = 0;
		if (!monochrome) {
			if (seqProfile === 0) {
				chromaSubsamplingX = 1;
				chromaSubsamplingY = 1;
			} else if (seqProfile === 1) {
				chromaSubsamplingX = 0;
				chromaSubsamplingY = 0;
			} else if (bitDepth === 12) {
				chromaSubsamplingX = bitstream.readBits(1);
				if (chromaSubsamplingX) chromaSubsamplingY = bitstream.readBits(1);
			}
			if (chromaSubsamplingX && chromaSubsamplingY) chromaSamplePosition = bitstream.readBits(2);
		}
		return {
			profile: seqProfile,
			level: seqLevel,
			tier: seqTier,
			bitDepth,
			monochrome,
			chromaSubsamplingX,
			chromaSubsamplingY,
			chromaSamplePosition
		};
	}
	return null;
};
new Uint8Array([
	5,
	4,
	65,
	67,
	45,
	51
]);
new Uint8Array([
	5,
	4,
	69,
	65,
	67,
	51
]);
var PRORES_FOURCC_TO_PROFILE = {
	apco: NodeAv8.AV_PROFILE_PRORES_PROXY,
	apcs: NodeAv8.AV_PROFILE_PRORES_LT,
	apcn: NodeAv8.AV_PROFILE_PRORES_STANDARD,
	apch: NodeAv8.AV_PROFILE_PRORES_HQ,
	ap4h: NodeAv8.AV_PROFILE_PRORES_4444,
	ap4x: NodeAv8.AV_PROFILE_PRORES_XQ
};
var NodeAvVideoEncoder = class extends CustomVideoEncoder {
	constructor() {
		super(...arguments);
		this.codecContext = null;
		this.scaler = null;
		this.dstFrame = null;
		this.lastBuffer = null;
		this.packetEmitted = false;
		this.lastScalerKey = null;
		this.preciseTimings = [];
	}
	static supports(codec, config) {
		return (codec === "avc" || codec === "hevc" || codec === "vp8" || codec === "vp9" || codec === "av1" || codec === "prores") && config.bitrateMode !== "quantizer";
	}
	async init() {
		this.frame = new NodeAv8.Frame();
		this.frame.alloc();
		this.frame.timeBase = new NodeAv8.Rational(1, 1e6);
		this.packet = new NodeAv8.Packet();
		this.packet.alloc();
		const codecId = CODEC_TO_CODEC_ID[this.codec];
		assert$1(codecId !== void 0);
		const getSoftwareCodec = () => {
			if (this.codec === "prores") {
				const proresKs = NodeAv8.Codec.findEncoderByName(NodeAv8.FF_ENCODER_PRORES_KS);
				if (proresKs) return proresKs;
			}
			return NodeAv8.Codec.findEncoder(codecId);
		};
		let codec = null;
		if (this.codec === "vp9" && this.config.alpha === "keep") codec = NodeAv8.Codec.findEncoderByName(NodeAv8.FF_ENCODER_LIBVPX_VP9) ?? NodeAv8.Codec.findEncoder(codecId);
		else if (this.config.hardwareAcceleration === "prefer-software") codec = getSoftwareCodec();
		else codec = await getHardwareEncoderCodec(codecId) ?? getSoftwareCodec();
		if (!codec) throw new Error(`Unable to obtain libav codec for '${this.codec}'.`);
		this.avCodec = codec;
		await this.createCodecContext();
	}
	async createCodecContext() {
		assert$1(this.codecContext === null);
		const codecContext = new NodeAv8.CodecContext();
		codecContext.allocContext3(this.avCodec);
		let pixelFormat = NodeAv8.AV_PIX_FMT_YUV420P;
		if (this.avCodec.pixelFormats) {
			if (!this.avCodec.pixelFormats.includes(NodeAv8.AV_PIX_FMT_YUV420P)) pixelFormat = this.avCodec.pixelFormats[0];
			if (this.config.alpha === "keep") if (this.avCodec.pixelFormats.includes(NodeAv8.AV_PIX_FMT_YUVA420P)) pixelFormat = NodeAv8.AV_PIX_FMT_YUVA420P;
			else pixelFormat = NodeAv8.avcodecFindBestPixFmtOfList(this.avCodec.pixelFormats, NodeAv8.AV_PIX_FMT_YUVA444P12LE);
		}
		const pixelAspectRatio = simplifyRational({
			num: (this.config.displayWidth ?? this.config.width) * this.config.height,
			den: (this.config.displayHeight ?? this.config.height) * this.config.width
		});
		codecContext.width = this.config.width;
		codecContext.height = this.config.height;
		codecContext.pixelFormat = pixelFormat;
		codecContext.timeBase = new NodeAv8.Rational(1, 1e6);
		codecContext.gopSize = 60;
		codecContext.framerate = new NodeAv8.Rational(Math.round(this.config.framerate ?? 0) || 30, 1);
		codecContext.bitRate = BigInt(this.config.bitrate ?? QUALITY_MEDIUM._toVideoBitrate(this.codec, this.config.width, this.config.height));
		codecContext.sampleAspectRatio = new NodeAv8.Rational(pixelAspectRatio.num, pixelAspectRatio.den);
		if (this.config.bitrateMode === "constant") {
			codecContext.rcMinRate = codecContext.bitRate;
			codecContext.rcMaxRate = codecContext.bitRate;
		}
		const isRealtime = this.config.latencyMode === "realtime";
		if (this.avCodec.name === "libx264") {
			if (isRealtime) {
				codecContext.setOption("tune", "zerolatency");
				codecContext.setOption("preset", "ultrafast");
			}
		} else if (this.avCodec.name === "libx265") {
			codecContext.setOption("x265-params", "log-level=error");
			if (isRealtime) {
				codecContext.setOption("tune", "zerolatency");
				codecContext.setOption("preset", "ultrafast");
			}
		} else if (this.avCodec.name === "libvpx") if (isRealtime) {
			codecContext.setOption("deadline", "realtime");
			codecContext.setOption("cpu-used", "8");
		} else codecContext.setOption("cpu-used", "8");
		else if (this.avCodec.name === "libvpx-vp9") {
			codecContext.setOption("deadline", "realtime");
			if (isRealtime) codecContext.setOption("cpu-used", "8");
			else codecContext.setOption("cpu-used", "5");
		} else if (this.avCodec.name === "libsvtav1") {
			process.env["SVT_LOG"] = "1";
			if (isRealtime) codecContext.setOption("preset", "12");
		} else if (this.avCodec.name === "h264_nvenc") codecContext.setOption("forced-idr", "1");
		else if (this.avCodec.name === "hevc_nvenc") codecContext.setOption("forced-idr", "1");
		if (this.codec === "prores") {
			const profile = PRORES_FOURCC_TO_PROFILE[this.config.codec];
			assert$1(profile !== void 0);
			codecContext.setOption("profile", String(profile));
		}
		const ret = await codecContext.open2();
		NodeAv8.FFmpegError.throwIfError(ret, "Open codec context");
		this.codecContext = codecContext;
	}
	async encode(videoSample, options) {
		if (this.codecContext === null) await this.createCodecContext();
		assert$1(this.codecContext);
		if (videoSample._data instanceof AvFrameVideoSampleResource) {
			this.frame.unref();
			this.frame.ref(videoSample._data.frame);
		} else {
			if (videoSample.format === null) throw new Error("Cannot encode foreign VideoSample with unknown (null) format.");
			this.lastBuffer = await copyVideoSampleToAvFrame(videoSample, this.frame, this.lastBuffer);
		}
		let frameToEncode = this.frame;
		if (this.codecContext.pixelFormat !== this.frame.format || this.codecContext.width !== this.frame.width || this.codecContext.height !== this.frame.height) {
			if (!this.scaler) this.scaler = new NodeAv8.SoftwareScaleContext();
			const key = `${this.frame.width}x${this.frame.height}:${this.frame.format}`;
			if (key !== this.lastScalerKey) {
				this.scaler.getContext(this.frame.width, this.frame.height, this.frame.format, this.codecContext.width, this.codecContext.height, this.codecContext.pixelFormat, NodeAv8.SWS_FAST_BILINEAR);
				this.lastScalerKey = key;
				const ret2 = this.scaler.initContext();
				NodeAv8.FFmpegError.throwIfError(ret2, "initContext");
			}
			if (!this.dstFrame) {
				this.dstFrame = new NodeAv8.Frame();
				this.dstFrame.alloc();
				this.dstFrame.width = this.codecContext.width;
				this.dstFrame.height = this.codecContext.height;
				this.dstFrame.format = this.codecContext.pixelFormat;
				this.dstFrame.allocBuffer();
			}
			await this.scaler.scaleFrame(this.dstFrame, this.frame);
			this.dstFrame.copyProps(this.frame);
			frameToEncode = this.dstFrame;
		}
		frameToEncode.pts = BigInt(videoSample.microsecondTimestamp);
		frameToEncode.duration = BigInt(videoSample.microsecondDuration);
		frameToEncode.timeBase = new NodeAv8.Rational(1, 1e6);
		frameToEncode.pictType = options?.keyFrame ? NodeAv8.AV_PICTURE_TYPE_I : NodeAv8.AV_PICTURE_TYPE_NONE;
		frameToEncode.keyFrame = options?.keyFrame ? 1 : 0;
		const preciseTimingIndex = binarySearchLessOrEqual(this.preciseTimings, videoSample.microsecondTimestamp, (x$1) => x$1.microsecondTimestamp);
		const existingEntry = preciseTimingIndex !== -1 ? this.preciseTimings[preciseTimingIndex] : null;
		if (existingEntry && existingEntry.microsecondTimestamp === videoSample.microsecondTimestamp) {
			if (existingEntry.timestamp !== videoSample.timestamp) existingEntry.timestampIsValid = false;
			if (existingEntry.duration !== videoSample.duration) existingEntry.durationIsValid = false;
		} else {
			this.preciseTimings.splice(preciseTimingIndex + 1, 0, {
				microsecondTimestamp: videoSample.microsecondTimestamp,
				timestamp: videoSample.timestamp,
				duration: videoSample.duration,
				timestampIsValid: true,
				durationIsValid: true
			});
			if (this.preciseTimings.length > 128) this.preciseTimings.shift();
		}
		const ret = await this.codecContext.sendFrame(frameToEncode);
		NodeAv8.FFmpegError.throwIfError(ret, "Send frame");
		while (true) {
			const receiveRet = await this.codecContext.receivePacket(this.packet);
			if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
			this.receivePacket(receiveRet);
		}
	}
	receivePacket(ret) {
		assert$1(this.codecContext);
		NodeAv8.FFmpegError.throwIfError(ret, "Receive packet");
		if (!this.packet.data) return;
		let packetData = toUint8Array(this.packet.data);
		let timestamp = Number(this.packet.pts) / 1e6;
		let duration = Number(this.packet.duration) / 1e6;
		const preciseTimingIndex = binarySearchLessOrEqual(this.preciseTimings, Number(this.packet.pts), (x$1) => x$1.microsecondTimestamp);
		const entry = preciseTimingIndex !== -1 ? this.preciseTimings[preciseTimingIndex] : null;
		if (entry && entry.microsecondTimestamp === Number(this.packet.pts)) {
			if (entry.timestampIsValid) timestamp = entry.timestamp;
			if (entry.durationIsValid) duration = entry.duration;
		}
		const metadata = {};
		let decoderConfigCodecString = null;
		let decoderConfigDescription = null;
		if (this.codec === "avc" || this.codec === "hevc") {
			let expectsAnnexB = false;
			if (this.codec === "avc") expectsAnnexB = this.config.avc?.format === "annexb";
			else expectsAnnexB = this.config.hevc?.format === "annexb";
			if (!this.packetEmitted) {
				let serializedRecord;
				if (this.codec === "avc") {
					const record = extractAvcDecoderConfigurationRecord(this.packet.data);
					if (!record) throw new Error("Invalid AVC data, could not extract decoder configuration record.");
					serializedRecord = serializeAvcDecoderConfigurationRecord(record);
				} else {
					const record = extractHevcDecoderConfigurationRecord(this.packet.data);
					if (!record) throw new Error("Invalid HEVC data, could not extract decoder configuration record.");
					serializedRecord = serializeHevcDecoderConfigurationRecord(record);
				}
				decoderConfigCodecString = extractVideoCodecString({
					width: this.config.width,
					height: this.config.height,
					codec: this.codec,
					codecDescription: serializedRecord,
					colorSpace: null,
					avcType: 1,
					avcCodecInfo: null,
					hevcCodecInfo: null,
					vp9CodecInfo: null,
					av1CodecInfo: null,
					proresFormat: null
				});
				if (!expectsAnnexB) decoderConfigDescription = serializedRecord;
			}
			if (!expectsAnnexB) {
				const NAL_UNIT_LENGTH_SIZE = 4;
				const nalUnits = [];
				for (const loc of iterateNalUnitsInAnnexB(packetData)) if (this.codec === "avc") {
					const naluType = extractNalUnitTypeForAvc(packetData[loc.offset]);
					if (naluType !== 7 && naluType !== 8 && naluType !== 13) nalUnits.push(loc);
				} else {
					const naluType = extractNalUnitTypeForHevc(packetData[loc.offset]);
					if (naluType !== 33 && naluType !== 34 && naluType !== 32) nalUnits.push(loc);
				}
				let totalSize = 0;
				for (const nalUnit of nalUnits) totalSize += NAL_UNIT_LENGTH_SIZE + nalUnit.length;
				const lengthPrefixedData = new Uint8Array(totalSize);
				const dataView = new DataView(lengthPrefixedData.buffer);
				let offset = 0;
				for (const nalUnit of nalUnits) {
					const length = nalUnit.length;
					dataView.setUint32(offset, length, false);
					offset += 4;
					lengthPrefixedData.set(packetData.subarray(nalUnit.offset, nalUnit.offset + nalUnit.length), offset);
					offset += nalUnit.length;
				}
				packetData = lengthPrefixedData;
			}
		} else if (this.codec === "vp8") {
			if (!this.packetEmitted) decoderConfigCodecString = extractVideoCodecString({
				width: this.config.width,
				height: this.config.height,
				codec: "vp8",
				codecDescription: null,
				colorSpace: null,
				avcType: null,
				avcCodecInfo: null,
				hevcCodecInfo: null,
				vp9CodecInfo: null,
				av1CodecInfo: null,
				proresFormat: null
			});
		} else if (this.codec === "vp9") {
			if (!this.packetEmitted) {
				const vp9CodecInfo = extractVp9CodecInfoFromPacket(packetData);
				decoderConfigCodecString = extractVideoCodecString({
					width: this.config.width,
					height: this.config.height,
					codec: "vp9",
					codecDescription: null,
					colorSpace: null,
					avcType: null,
					avcCodecInfo: null,
					hevcCodecInfo: null,
					vp9CodecInfo,
					av1CodecInfo: null,
					proresFormat: null
				});
			}
		} else if (this.codec === "av1") {
			if (!this.packetEmitted) {
				const av1CodecInfo = extractAv1CodecInfoFromPacket(packetData);
				decoderConfigCodecString = extractVideoCodecString({
					width: this.config.width,
					height: this.config.height,
					codec: "av1",
					codecDescription: null,
					colorSpace: null,
					avcType: null,
					avcCodecInfo: null,
					hevcCodecInfo: null,
					vp9CodecInfo: null,
					av1CodecInfo,
					proresFormat: null
				});
			}
		} else if (this.codec === "prores") {
			if (!this.packetEmitted) decoderConfigCodecString = extractVideoCodecString({
				width: this.config.width,
				height: this.config.height,
				codec: "prores",
				codecDescription: null,
				colorSpace: null,
				avcType: null,
				avcCodecInfo: null,
				hevcCodecInfo: null,
				vp9CodecInfo: null,
				av1CodecInfo: null,
				proresFormat: this.config.codec
			});
		} else throw new Error("Unreachable.");
		const sideData = {};
		const matroskaBlockAdditional = this.packet.getSideData(NodeAv8.AV_PKT_DATA_MATROSKA_BLOCKADDITIONAL);
		if (matroskaBlockAdditional) sideData.alpha = toUint8Array(matroskaBlockAdditional).subarray(8);
		const packet = new EncodedPacket(packetData, this.packet.isKeyframe ? "key" : "delta", timestamp, duration, void 0, void 0, sideData);
		if (decoderConfigCodecString !== null) metadata.decoderConfig = {
			codec: decoderConfigCodecString,
			codedWidth: this.codecContext.width,
			codedHeight: this.codecContext.height,
			displayAspectWidth: this.config.displayWidth ?? this.codecContext.width,
			displayAspectHeight: this.config.displayHeight ?? this.codecContext.height,
			description: decoderConfigDescription ?? void 0,
			colorSpace: {
				primaries: unmapColorPrimaries(this.codecContext.colorPrimaries),
				matrix: unmapMatrixCoefficients(this.codecContext.colorSpace),
				transfer: unmapTransferCharacteristics(this.codecContext.colorTrc),
				fullRange: this.codecContext.colorRange === NodeAv8.AVCOL_RANGE_JPEG ? true : this.codecContext.colorRange === NodeAv8.AVCOL_RANGE_MPEG ? false : void 0
			}
		};
		this.packetEmitted = true;
		this.onPacket(packet, metadata);
	}
	async flush() {
		if (this.codecContext) {
			const ret = await this.codecContext.sendFrame(null);
			NodeAv8.FFmpegError.throwIfError(ret, "Send frame");
			while (true) {
				const receiveRet = await this.codecContext.receivePacket(this.packet);
				if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
				this.receivePacket(receiveRet);
			}
			this.codecContext.freeContext();
			this.codecContext = null;
		}
		this.packetEmitted = false;
	}
	close() {
		this.codecContext?.freeContext();
		this.frame.free();
		this.packet.free();
		this.scaler?.freeContext();
		this.dstFrame?.free();
	}
};
var AvFrameAudioSampleResource = class extends AudioSampleResource {
	/**
	* The NodeAV [`Frame`](https://seydx.github.io/node-av/api/lib/classes/Frame.html) instance backing this resource.
	* Access throws if the resource has already been closed.
	*/
	get frame() {
		if (!this._frame) throw new Error("AvFrameAudioSampleResource has been closed.");
		return this._frame;
	}
	constructor(frame) {
		super();
		if (!(frame instanceof NodeAv8.Frame)) throw new TypeError("frame must be a NodeAv.Frame.");
		if (frame.getMediaType() !== NodeAv8.AVMEDIA_TYPE_AUDIO) throw new Error("AvFrameAudioSampleResource must be initialized with an audio frame.");
		this._frame = frame;
	}
	getFormat() {
		const result = toAudioSampleFormat(this.frame.format);
		if (result === null) {
			const name = NodeAv8.avGetSampleFmtName(this.frame.format);
			throw new TypeError(`Unsupported audio sample format: ${name} (${this.frame.format})`);
		}
		return result;
	}
	getSampleRate() {
		return this.frame.sampleRate;
	}
	getNumberOfChannels() {
		return this.frame.channels;
	}
	getNumberOfFrames() {
		return this.frame.nbSamples;
	}
	getTimestamp() {
		return Number(this.frame.pts) / this.frame.timeBase.den;
	}
	close() {
		this.frame.free();
		this._frame = null;
	}
	getDataPlane(planeIndex) {
		assert$1(this.frame.data && planeIndex < this.frame.data.length);
		return toUint8Array(this.frame.data[planeIndex]);
	}
};
var copyAudioSampleToAvFrame = (sample, frame) => {
	frame.format = fromAudioSampleFormat(sample.format);
	frame.nbSamples = sample.numberOfFrames;
	frame.sampleRate = sample.sampleRate;
	frame.channelLayout = getChannelLayout(sample.numberOfChannels);
	frame.allocBuffer();
	assert$1(frame.data);
	for (let i = 0; i < frame.data.length; i++) sample.copyTo(frame.data[i], { planeIndex: i });
};
var NodeAvAudioDecoder = class extends CustomAudioDecoder {
	constructor() {
		super(...arguments);
		this.codecContext = null;
	}
	static supports(codec, config) {
		return codec === "aac" || codec === "opus" || codec === "mp3" || codec === "vorbis" || codec === "flac" || codec === "ac3" || codec === "eac3";
	}
	async init() {
		this.frame = new NodeAv8.Frame();
		this.frame.alloc();
		this.packet = new NodeAv8.Packet();
		this.packet.alloc();
		const codecId = CODEC_TO_CODEC_ID[this.codec];
		assert$1(codecId !== void 0);
		const codec = NodeAv8.Codec.findDecoder(codecId);
		if (codec === null) throw new Error(`Unable to obtain libav codec for '${this.codec}'.`);
		const codecContext = new NodeAv8.CodecContext();
		codecContext.allocContext3(codec);
		codecContext.sampleRate = this.config.sampleRate;
		codecContext.channelLayout = getChannelLayout(this.config.numberOfChannels);
		codecContext.timeBase = new NodeAv8.Rational(1, this.config.sampleRate);
		codecContext.codecType = NodeAv8.AVMEDIA_TYPE_AUDIO;
		codecContext.codecId = codecId;
		codecContext.extraData = this.config.description ? Buffer.from(toUint8Array(this.config.description)) : null;
		const ret = await codecContext.open2();
		NodeAv8.FFmpegError.throwIfError(ret, "Open codec context");
		this.codecContext = codecContext;
	}
	async decode(packet) {
		assert$1(this.codecContext);
		this.packet.isKeyframe = packet.type === "key";
		this.packet.data = Buffer.from(packet.data);
		this.packet.timeBase = {
			num: 1,
			den: this.config.sampleRate
		};
		this.packet.pts = BigInt(Math.round(packet.timestamp * this.config.sampleRate));
		this.packet.dts = NodeAv8.AV_NOPTS_VALUE;
		this.packet.duration = BigInt(Math.round(packet.duration * this.config.sampleRate));
		const ret = await this.codecContext.sendPacket(this.packet);
		NodeAv8.FFmpegError.throwIfError(ret, "Send packet");
		this.packet.unref();
		while (true) {
			const receiveRet = await this.codecContext.receiveFrame(this.frame);
			if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
			this.receiveFrame(receiveRet);
		}
	}
	receiveFrame(ret) {
		NodeAv8.FFmpegError.throwIfError(ret, "Receive frame");
		const clone = this.frame.clone();
		if (!clone) throw new Error("Allocation failure during frame clone.");
		clone.timeBase = new NodeAv8.Rational(1, this.config.sampleRate);
		this.onSample(new AudioSample(new AvFrameAudioSampleResource(clone)));
	}
	async flush() {
		assert$1(this.codecContext);
		const ret = await this.codecContext.sendPacket(null);
		NodeAv8.FFmpegError.throwIfError(ret, "Flush decoder");
		while (true) {
			const receiveRet = await this.codecContext.receiveFrame(this.frame);
			if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
			this.receiveFrame(receiveRet);
		}
		this.codecContext.flushBuffers();
	}
	close() {
		this.codecContext?.freeContext();
		this.frame.free();
		this.packet.free();
	}
};
var AAC_SAMPLE_RATES = [
	96e3,
	88200,
	64e3,
	48e3,
	44100,
	32e3,
	24e3,
	22050,
	16e3,
	12e3,
	11025,
	8e3,
	7350
];
var OPUS_SAMPLE_RATES = [
	8e3,
	12e3,
	16e3,
	24e3,
	48e3
];
var MP3_SAMPLE_RATES = [
	8e3,
	11025,
	12e3,
	16e3,
	22050,
	24e3,
	32e3,
	44100,
	48e3
];
var AC3_SAMPLE_RATES = [
	32e3,
	44100,
	48e3
];
var FRAME_SIZE_FALLBACK = 1024;
var NodeAvAudioEncoder = class extends CustomAudioEncoder {
	constructor() {
		super(...arguments);
		this.codecContext = null;
		this.resampler = null;
		this.dstFrame = null;
		this.firstExpectedTimestamp = null;
		this.outputTimestampOffset = 0;
		this.inputParametersKey = null;
		this.resamplerInputSampleRate = null;
		this.nextResamplerPts = null;
		this.packetEmitted = false;
		this.adtsHeaderTemplate = null;
	}
	static supports(codec, config) {
		const { numberOfChannels, sampleRate } = config;
		return codec === "aac" && numberOfChannels >= 1 && numberOfChannels <= 48 && AAC_SAMPLE_RATES.includes(sampleRate) || codec === "opus" && numberOfChannels >= 1 && numberOfChannels <= 255 && OPUS_SAMPLE_RATES.includes(sampleRate) || codec === "mp3" && numberOfChannels >= 1 && numberOfChannels <= 2 && MP3_SAMPLE_RATES.includes(sampleRate) || codec === "vorbis" && numberOfChannels >= 1 && numberOfChannels <= 255 && sampleRate <= 2e5 || codec === "flac" && numberOfChannels >= 1 && numberOfChannels <= 8 && sampleRate <= 655350 || codec === "ac3" && numberOfChannels >= 1 && numberOfChannels <= 6 && AC3_SAMPLE_RATES.includes(sampleRate) || codec === "eac3" && numberOfChannels >= 1 && numberOfChannels <= 16 && AC3_SAMPLE_RATES.includes(sampleRate);
	}
	async init() {
		this.frame = new NodeAv8.Frame();
		this.frame.alloc();
		this.packet = new NodeAv8.Packet();
		this.packet.alloc();
		const codecId = CODEC_TO_CODEC_ID[this.codec];
		assert$1(codecId !== void 0);
		const codec = NodeAv8.Codec.findEncoder(codecId);
		if (!codec) throw new Error(`Unable to obtain libav codec for '${this.codec}'.`);
		this.avCodec = codec;
		await this.createCodecContext();
	}
	async createCodecContext() {
		assert$1(this.codecContext === null);
		const codecContext = new NodeAv8.CodecContext();
		codecContext.allocContext3(this.avCodec);
		let sampleFormat = NodeAv8.AV_SAMPLE_FMT_FLTP;
		if (this.avCodec.sampleFormats && !this.avCodec.sampleFormats.includes(NodeAv8.AV_SAMPLE_FMT_FLTP)) sampleFormat = this.avCodec.sampleFormats[0];
		codecContext.sampleRate = this.config.sampleRate;
		codecContext.channelLayout = getChannelLayout(this.config.numberOfChannels);
		codecContext.codecType = NodeAv8.AVMEDIA_TYPE_AUDIO;
		codecContext.codecId = CODEC_TO_CODEC_ID[this.codec];
		codecContext.sampleFormat = sampleFormat;
		codecContext.timeBase = new NodeAv8.Rational(1, this.config.sampleRate);
		codecContext.bitRate = BigInt(this.config.bitrate ?? QUALITY_MEDIUM._toAudioBitrate(this.codec) ?? 0);
		if (this.config.bitrateMode === "constant") {
			codecContext.rcMinRate = codecContext.bitRate;
			codecContext.rcMaxRate = codecContext.bitRate;
		}
		const ret = await codecContext.open2();
		NodeAv8.FFmpegError.throwIfError(ret, "Open codec context");
		this.codecContext = codecContext;
	}
	async encode(audioSample) {
		if (this.codecContext === null) {
			await this.createCodecContext();
			assert$1(this.codecContext);
		}
		this.firstExpectedTimestamp ??= audioSample.timestamp;
		if (audioSample._data instanceof AvFrameAudioSampleResource) {
			this.frame.unref();
			this.frame.ref(audioSample._data.frame);
		} else copyAudioSampleToAvFrame(audioSample, this.frame);
		this.frame.pts = BigInt(Math.round(audioSample.timestamp * this.config.sampleRate));
		this.frame.duration = BigInt(Math.round(audioSample.duration * this.config.sampleRate));
		this.frame.timeBase = new NodeAv8.Rational(1, this.config.sampleRate);
		const key = `${this.frame.sampleRate}:${this.frame.channels}:${this.frame.format}`;
		if (this.inputParametersKey !== null && this.inputParametersKey !== key) throw new Error("Input audio parameters changed. For this audio encoder, you cannot change the input audio parameters over time.");
		this.inputParametersKey = key;
		if (this.codecContext.frameSize > 0 || this.codecContext.sampleFormat !== this.frame.format || this.codecContext.sampleRate !== this.frame.sampleRate || this.codecContext.channels !== this.frame.channels) {
			if (!this.resampler) {
				this.resampler = new NodeAv8.SoftwareResampleContext();
				this.resamplerInputSampleRate = this.frame.sampleRate;
				const outLayout = getChannelLayout(this.codecContext.channels);
				const inLayout = getChannelLayout(this.frame.channels);
				const ret = this.resampler.allocSetOpts2(outLayout, this.codecContext.sampleFormat, this.codecContext.sampleRate, inLayout, this.frame.format, this.frame.sampleRate);
				NodeAv8.FFmpegError.throwIfError(ret, "allocSetOpts2");
				const ret2 = this.resampler.init();
				NodeAv8.FFmpegError.throwIfError(ret2, "init");
				this.dstFrame = new NodeAv8.Frame();
				this.dstFrame.alloc();
				this.dstFrame.channelLayout = outLayout;
				this.dstFrame.sampleRate = this.codecContext.sampleRate;
				this.dstFrame.format = this.codecContext.sampleFormat;
				this.dstFrame.nbSamples = this.codecContext.frameSize || FRAME_SIZE_FALLBACK;
				this.dstFrame.duration = BigInt(this.dstFrame.nbSamples);
				this.dstFrame.allocBuffer();
				this.nextResamplerPts = this.frame.pts;
			}
			const inputBuffers = this.frame.data;
			if (!inputBuffers) throw new DOMException("Frame has no data", "EncodingError");
			await this.resampler.convert(null, 0, inputBuffers, this.frame.nbSamples);
			await this.pullResampledFrames();
		} else await this.sendFrameAndReceivePackets(this.frame);
	}
	async pullResampledFrames() {
		assert$1(this.codecContext);
		assert$1(this.resampler);
		assert$1(this.dstFrame);
		assert$1(this.nextResamplerPts !== null);
		const frameSize = this.codecContext.frameSize || FRAME_SIZE_FALLBACK;
		while (true) {
			if (this.resampler.getOutSamples(0) < frameSize) break;
			await this.resampler.convert(this.dstFrame.data, frameSize, null, 0);
			this.dstFrame.pts = this.nextResamplerPts;
			await this.sendFrameAndReceivePackets(this.dstFrame);
			this.nextResamplerPts += BigInt(frameSize);
		}
	}
	async sendFrameAndReceivePackets(frame) {
		assert$1(this.codecContext);
		const ret = await this.codecContext.sendFrame(frame);
		NodeAv8.FFmpegError.throwIfError(ret, "Send frame");
		while (true) {
			const receiveRet = await this.codecContext.receivePacket(this.packet);
			if (receiveRet === NodeAv8.AVERROR_EAGAIN || receiveRet === NodeAv8.AVERROR_EOF) break;
			this.receivePacket(receiveRet);
		}
	}
	receivePacket(ret) {
		assert$1(this.codecContext);
		assert$1(this.firstExpectedTimestamp !== null);
		NodeAv8.FFmpegError.throwIfError(ret, "Receive packet");
		if (!this.packet.data) return;
		let timestamp = Number(this.packet.pts) / this.codecContext.sampleRate;
		const duration = Number(this.packet.duration) / this.codecContext.sampleRate;
		let data = this.packet.data;
		let metadata;
		if (this.packetEmitted) metadata = {};
		else {
			this.outputTimestampOffset = Math.max(this.firstExpectedTimestamp - timestamp, 0);
			const codecString = this.config.codec;
			let description = this.codecContext.extraData ? toUint8Array(this.codecContext.extraData) : void 0;
			if (this.codec === "aac") {
				if (!description) throw new Error("Extradata expected for AAC.");
				if (this.config.aac?.format === "adts") {
					this.adtsHeaderTemplate = buildAdtsHeaderTemplate(parseAacAudioSpecificConfig(description));
					description = void 0;
				}
			} else if (this.codec === "opus") {
				if (!description) throw new Error("Extradata expected for Opus.");
			} else if (this.codec === "vorbis") {
				if (!description) throw new Error("Extradata expected for Vorbis.");
			} else if (this.codec === "flac") {
				if (!description) throw new Error("Extradata expected for FLAC.");
				description = new Uint8Array([
					102,
					76,
					97,
					67,
					128,
					0,
					0,
					description.byteLength,
					...description
				]);
			}
			metadata = { decoderConfig: {
				codec: codecString,
				sampleRate: this.codecContext.sampleRate,
				numberOfChannels: this.codecContext.channels,
				description
			} };
		}
		if (this.adtsHeaderTemplate) {
			const frameLength = data.byteLength + this.adtsHeaderTemplate.header.byteLength;
			this.adtsHeaderTemplate.bitstream.pos = 30;
			this.adtsHeaderTemplate.bitstream.writeBits(13, frameLength);
			const final = new Uint8Array(this.adtsHeaderTemplate.header.byteLength + data.byteLength);
			final.set(this.adtsHeaderTemplate.header, 0);
			final.set(data, this.adtsHeaderTemplate.header.byteLength);
			data = final;
		}
		timestamp += this.outputTimestampOffset;
		const packet = new EncodedPacket(data, "key", timestamp, duration);
		this.packetEmitted = true;
		this.onPacket(packet, metadata);
	}
	async flush() {
		if (!this.codecContext) return;
		outer: if (this.resampler) {
			assert$1(this.resamplerInputSampleRate !== null);
			const currentOutSamples = this.resampler.getOutSamples(0);
			if (currentOutSamples === 0) break outer;
			const frameSize = this.codecContext.frameSize || FRAME_SIZE_FALLBACK;
			assert$1(currentOutSamples < frameSize);
			const inputSamplesNeeded = Math.ceil((frameSize - currentOutSamples) / this.codecContext.sampleRate * this.resamplerInputSampleRate);
			this.resampler.injectSilence(inputSamplesNeeded);
			await this.pullResampledFrames();
		}
		await this.sendFrameAndReceivePackets(null);
		this.codecContext.freeContext();
		this.codecContext = null;
		this.packetEmitted = false;
		this.firstExpectedTimestamp = null;
		this.outputTimestampOffset = 0;
		this.adtsHeaderTemplate = null;
		this.resampler?.free();
		this.resampler = null;
		this.inputParametersKey = null;
		this.resamplerInputSampleRate = null;
		this.nextResamplerPts = null;
		this.dstFrame?.free();
		this.dstFrame = null;
	}
	close() {
		this.codecContext?.freeContext();
		this.frame.free();
		this.packet.free();
		this.dstFrame?.free();
		this.resampler?.free();
	}
};
var SERVER_LOADED_SYMBOL = Symbol.for("@mediabunny/server loaded");
if (globalThis[SERVER_LOADED_SYMBOL]) Logging$1._error("[WARNING]\n@mediabunny/server was loaded twice. This will likely cause the package not to work correctly. Check if multiple dependencies are importing different versions of @mediabunny/server, or if something is being bundled incorrectly.");
globalThis[SERVER_LOADED_SYMBOL] = true;
var registered = false;
var _serverOptions = {};
var registerMediabunnyServer = (options = {}) => {
	if (typeof options !== "object" || !options) throw new TypeError("options must be an object.");
	if (options.hardwareContext != null && !(options.hardwareContext instanceof NodeAv8.HardwareContext || typeof options.hardwareContext === "function")) throw new TypeError("options.hardwareContext, when provided, must be a NodeAv.HardwareContext, a function, or null.");
	if (registered) return;
	registered = true;
	_serverOptions = options;
	NodeAv8.Log.setLevel(NodeAv8.AV_LOG_ERROR);
	registerDecoder(NodeAvVideoDecoder);
	registerProresDecoder();
	registerEncoder(NodeAvVideoEncoder);
	registerDecoder(NodeAvAudioDecoder);
	registerEncoder(NodeAvAudioEncoder);
	registerVideoSampleTransformer(transformVideoSample);
};

//#endregion
//#region ../../packages/renderer/dist/bootstrap-mediabunny-DqixQzzo.mjs
/**
* Recursively scans and preloads only the required font assets inside a VirtualMediaData tree.
* This ensures typography renders correctly on Node.js without pre-loading or memory bloating from large media assets.
*/
async function preloadFonts(media, device = null) {
	if (!media) return;
	const promises = [];
	const op = media.operation;
	if (R2_CUSTOM_DOMAIN) SlugFontCache.emojiFontUrl = `https://${R2_CUSTOM_DOMAIN}/static/NotoColorEmoji.ttf`;
	if (!SlugFontCache.emojiFontPath) try {
		const isDev = import.meta.url.endsWith(".ts");
		const emojiLocalUrl = new URL(isDev ? "./assets/NotoColorEmoji.ttf" : "../src/assets/NotoColorEmoji.ttf", import.meta.url).href;
		let fontPath = emojiLocalUrl;
		if (emojiLocalUrl.startsWith("file://")) try {
			fontPath = new URL(emojiLocalUrl).pathname;
		} catch {
			fontPath = emojiLocalUrl.replace(/^file:\/\//, "");
		}
		SlugFontCache.emojiFontPath = fontPath;
	} catch {}
	if (op) {
		const opText = op;
		if (opText.fontFamily) {
			const fontFamily = opText.fontFamily;
			const fontUrl = GetFontAssetUrl(fontFamily);
			promises.push(preloadFont(fontFamily, fontUrl).catch((err) => {
				rendererLogger.error(err, `[HeadlessMediaRenderer] Failed to preload font "${fontFamily}" from ${fontUrl}`);
			}));
			if (device) promises.push(SlugFontCache.preloadSlugFont(device, fontFamily, fontUrl).catch((err) => {
				rendererLogger.error(err, `[HeadlessMediaRenderer] Failed to preload Slug font "${fontFamily}" from ${fontUrl}`);
			}));
		}
		if (opText.op === "text" && opText.text && device) {
			const matches = opText.text.match(/\p{Extended_Pictographic}/gu);
			if (matches) {
				const fontSize = opText.fontSize ?? 48;
				for (const char of matches) promises.push(SlugFontCache.preloadEmoji(device, char, fontSize).catch((err) => {
					rendererLogger.error(err, `[HeadlessMediaRenderer] Failed to preload emoji texture for "${char}"`);
				}));
			}
		}
	}
	if (media.children && media.children.length > 0) for (const child of media.children) promises.push(preloadFonts(child, device));
	await Promise.all(promises);
}
let __filename$1 = "";
let __dirname$1 = "";
if (typeof process !== "undefined" && !!process.versions?.node) {
	__filename$1 = fileURLToPath(import.meta.url);
	__dirname$1 = path.dirname(__filename$1);
}
async function discoverAndRegisterNodeRenderers() {
	if (typeof process === "undefined" || !process.versions?.node) return;
	let nodesDir = path.resolve(__dirname$1, "../../../nodes");
	let currentDir = __dirname$1;
	while (true) {
		if (fs.existsSync(nodesDir)) {
			if (fs.readdirSync(nodesDir).some((d) => d.startsWith("node-") && fs.existsSync(path.join(nodesDir, d, "package.json")))) break;
		}
		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) {
			console.warn("[HeadlessWebGPURenderer] Nodes directory not found or invalid.");
			return;
		}
		currentDir = parentDir;
		nodesDir = path.resolve(currentDir, "nodes");
	}
	const entries = fs.readdirSync(nodesDir).filter((d) => {
		return d.startsWith("node-") && fs.statSync(path.join(nodesDir, d)).isDirectory();
	});
	const isDev = (__filename$1.endsWith(".ts") || process.env.npm_lifecycle_event === "dev") && process.env.NODE_ENV !== "production";
	console.log(`[HeadlessWebGPURenderer] Discovering node renderers in: ${nodesDir}`);
	for (const dir of entries) {
		const pkgPath = path.join(nodesDir, dir, "package.json");
		if (!fs.existsSync(pkgPath)) continue;
		try {
			const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
			if (pkg.gatewai?.enabled === false) continue;
			const metadataPath = path.join(nodesDir, dir, "src/metadata.ts");
			if (!fs.existsSync(metadataPath)) continue;
			const typeMatch = fs.readFileSync(metadataPath, "utf-8").match(/type:\s*["']([^"']+)["']/);
			if (!typeMatch || !typeMatch[1]) continue;
			const type = typeMatch[1];
			const rendererExports = pkg.exports?.["./renderer"];
			if (!rendererExports) continue;
			const relativePath = isDev && rendererExports.development ? rendererExports.development : rendererExports.import || rendererExports.default;
			if (!relativePath) continue;
			const mod = await import("file://" + path.join(nodesDir, dir, relativePath));
			if (mod && mod.default) {
				const rendererPlugin = mod.default;
				if (rendererPlugin.WebGPURenderer) {
					registerWebGPURenderer(type, rendererPlugin.WebGPURenderer);
					console.log(`[HeadlessWebGPURenderer] Registered custom WebGPU renderer for node operation: ${type}`);
				}
				if (rendererPlugin.audioProcessor) {
					audioRegistry.register(type, rendererPlugin.audioProcessor);
					console.log(`[HeadlessWebGPURenderer] Registered custom audio processor for node operation: ${type}`);
				}
			}
		} catch (err) {
			console.error(`[HeadlessWebGPURenderer] Failed to discover renderer for node ${dir}:`, err);
		}
	}
}
const isAMD = () => {
	if (process.platform !== "linux") return false;
	try {
		if (fs.existsSync("/sys/module/amdgpu") || fs.existsSync("/dev/kfd")) return true;
		const drmDir = "/sys/class/drm";
		if (fs.existsSync(drmDir)) {
			const files = fs.readdirSync(drmDir);
			for (const file of files) {
				const vendorPath = `${drmDir}/${file}/device/vendor`;
				if (fs.existsSync(vendorPath)) {
					if (fs.readFileSync(vendorPath, "utf8").trim() === "0x1002") return true;
				}
			}
		}
	} catch {}
	return false;
};
const bootstrapMediabunny = () => {
	const getHardwareContextOption = () => {
		if (isAMD()) return { hardwareContext: null };
		return {};
	};
	registerMediabunnyServer(getHardwareContextOption());
	for (const key of Object.keys(webcodecs)) if (typeof globalThis[key] === "undefined") globalThis[key] = webcodecs[key];
};

//#endregion
//#region ../../packages/renderer/dist/headless-webgpu-renderer-CEDI8ZS7.mjs
async function convertMp4ToGif(inputMp4Path, outputGifPath) {
	return new Promise((resolve$1, reject) => {
		const ffmpeg = spawn("ffmpeg", [
			"-i",
			inputMp4Path,
			"-vf",
			"split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
			"-y",
			outputGifPath
		]);
		let errorOutput = "";
		ffmpeg.stderr.on("data", (data) => {
			errorOutput += data.toString();
		});
		ffmpeg.on("close", async (code) => {
			if (code === 0) resolve$1();
			else {
				rendererLogger.error({
					code,
					err: errorOutput
				}, "[convertMp4ToGif] ffmpeg conversion failed");
				reject(/* @__PURE__ */ new Error(`ffmpeg exited with code ${code}: ${errorOutput}`));
			}
		});
		ffmpeg.on("error", (err) => {
			rendererLogger.error({ err }, "[convertMp4ToGif] ffmpeg spawn error");
			reject(err);
		});
	});
}
bootstrapMediabunny();
const globalObj = globalThis;
if (typeof globalThis !== "undefined") {
	globalObj.__IS_HEADLESS_RENDERER__ = true;
	globalObj.__GATEWAI_DELAYS__ ??= /* @__PURE__ */ new Set();
}
if (typeof globalThis.requestAnimationFrame === "undefined") {
	globalObj.requestAnimationFrame = (cb) => setTimeout(cb, 0);
	globalObj.cancelAnimationFrame = (id) => clearTimeout(id);
}
const dummyDomElement = {
	clientWidth: 1920,
	clientHeight: 1080,
	getBoundingClientRect: () => ({
		x: 0,
		y: 0,
		left: 0,
		top: 0,
		right: 1920,
		bottom: 1080,
		width: 1920,
		height: 1080
	}),
	style: {},
	appendChild: () => {},
	removeChild: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
	getAttribute: () => null
};
if (typeof globalThis.OffscreenCanvas === "undefined") globalObj.OffscreenCanvas = Canvas;
if (typeof globalThis.HTMLCanvasElement === "undefined") globalObj.HTMLCanvasElement = Canvas;
if (typeof globalThis.Image === "undefined") globalObj.Image = Image;
if (typeof globalThis.window === "undefined") globalObj.window = globalThis;
if (!globalThis.location) globalObj.location = new URL("http://localhost");
if (typeof globalThis.IntersectionObserver === "undefined") globalObj.IntersectionObserver = class IntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};
if (typeof globalThis.document === "undefined") globalObj.document = {
	createElement: (tag) => {
		if (tag === "canvas") return new Canvas(1, 1);
		return { ...dummyDomElement };
	},
	getElementsByTagName: () => [],
	documentElement: dummyDomElement,
	body: dummyDomElement
};
else {
	const docObj = globalThis.document;
	if (typeof docObj.getElementsByTagName === "undefined") docObj.getElementsByTagName = () => [];
	docObj.documentElement ??= dummyDomElement;
	docObj.body ??= dummyDomElement;
}
const skiaProto = Canvas.prototype;
if (typeof skiaProto.getBoundingClientRect === "undefined") skiaProto.getBoundingClientRect = function() {
	const width = this.width || 512;
	const height = this.height || 512;
	return {
		x: 0,
		y: 0,
		left: 0,
		top: 0,
		right: width,
		bottom: height,
		width,
		height
	};
};
if (!("style" in skiaProto)) Object.defineProperty(skiaProto, "style", {
	get() {
		this._style ??= {};
		return this._style;
	},
	configurable: true
});
if (!("clientWidth" in skiaProto)) Object.defineProperty(skiaProto, "clientWidth", {
	get() {
		return this.width || 512;
	},
	configurable: true
});
if (!("clientHeight" in skiaProto)) Object.defineProperty(skiaProto, "clientHeight", {
	get() {
		return this.height || 512;
	},
	configurable: true
});
if (!("parentElement" in skiaProto)) Object.defineProperty(skiaProto, "parentElement", {
	get() {
		return dummyDomElement;
	},
	configurable: true
});
if (typeof skiaProto.addEventListener === "undefined") skiaProto.addEventListener = () => {};
if (typeof skiaProto.removeEventListener === "undefined") skiaProto.removeEventListener = () => {};
if (typeof skiaProto.getAttribute === "undefined") skiaProto.getAttribute = () => null;
const CPU_COUNT = os.cpus().length;
const TOTAL_WORKER_BUDGET = Math.max(1, CPU_COUNT - 3);
const MAX_CONCURRENT_RENDERS = Math.max(1, Math.min(3, Math.floor(TOTAL_WORKER_BUDGET / 3)));
const QUEUE_TIMEOUT_MS = 120 * 6e4;
var RenderSemaphore = class {
	_running = 0;
	_max;
	_queue = [];
	constructor(max) {
		this._max = max;
	}
	acquire(timeoutMs = QUEUE_TIMEOUT_MS) {
		if (this._running < this._max) {
			this._running++;
			return Promise.resolve();
		}
		return new Promise((resolve$1, reject) => {
			const timer = setTimeout(() => {
				const idx = this._queue.findIndex((e) => e.resolve === resolve$1);
				if (idx !== -1) this._queue.splice(idx, 1);
				reject(/* @__PURE__ */ new Error(`Render queue timeout after ${timeoutMs}ms (${this._queue.length} queued, ${this._running}/${this._max} active)`));
			}, timeoutMs);
			this._queue.push({
				resolve: resolve$1,
				reject,
				timer
			});
		});
	}
	release() {
		if (this._queue.length > 0) {
			const next = this._queue.shift();
			clearTimeout(next.timer);
			next.resolve();
		} else this._running--;
	}
	get stats() {
		return {
			active: this._running,
			queued: this._queue.length,
			max: this._max
		};
	}
};
const renderSemaphore = new RenderSemaphore(MAX_CONCURRENT_RENDERS);
function toEvenDimension(n) {
	const v$1 = Math.round(n);
	return v$1 % 2 === 0 ? v$1 : v$1 + 1;
}
function resolveQuality(quality) {
	switch (quality) {
		case "very_low": return QUALITY_VERY_LOW;
		case "low": return QUALITY_LOW;
		case "high": return QUALITY_HIGH;
		case "very_high": return QUALITY_VERY_HIGH;
		default: return QUALITY_VERY_HIGH;
	}
}
function formatLutAsCube(lut) {
	const lines = [
		"# Created by Gatewai",
		lut.type === "3D" ? `LUT_3D_SIZE ${lut.size}` : `LUT_1D_SIZE ${lut.size}`,
		""
	];
	for (const p$1 of lut.points) lines.push(`${p$1[0].toFixed(6)} ${p$1[1].toFixed(6)} ${p$1[2].toFixed(6)}`);
	return lines.join("\n");
}
var HeadlessWebGPURenderer = class HeadlessWebGPURenderer$1 {
	static isInitialized = false;
	static initPromise = null;
	static initFailureCount = 0;
	static MAX_INIT_FAILURES = 3;
	static nextRetryAt = 0;
	static initialize() {
		if (HeadlessWebGPURenderer$1.isInitialized) return Promise.resolve();
		if (HeadlessWebGPURenderer$1.initFailureCount >= HeadlessWebGPURenderer$1.MAX_INIT_FAILURES) return Promise.reject(/* @__PURE__ */ new Error("GPU initialization permanently failed — circuit breaker open"));
		if (Date.now() < HeadlessWebGPURenderer$1.nextRetryAt) return Promise.reject(/* @__PURE__ */ new Error("GPU initialization in backoff period"));
		if (HeadlessWebGPURenderer$1.initPromise) return HeadlessWebGPURenderer$1.initPromise;
		HeadlessWebGPURenderer$1.initPromise = (async () => {
			try {
				rendererLogger.debug("[HeadlessWebGPURenderer] Initializing headless WebGPU…");
				await initHeadlessWebGPU();
				rendererLogger.debug("[HeadlessWebGPURenderer] Scanning node renderers…");
				await discoverAndRegisterNodeRenderers();
				HeadlessWebGPURenderer$1.isInitialized = true;
				HeadlessWebGPURenderer$1.initPromise = null;
				HeadlessWebGPURenderer$1.initFailureCount = 0;
				HeadlessWebGPURenderer$1.nextRetryAt = 0;
				rendererLogger.debug("[HeadlessWebGPURenderer] Initialization complete.");
			} catch (error) {
				HeadlessWebGPURenderer$1.initFailureCount++;
				HeadlessWebGPURenderer$1.nextRetryAt = Date.now() + 5e3 * 2 ** HeadlessWebGPURenderer$1.initFailureCount;
				HeadlessWebGPURenderer$1.initPromise = null;
				rendererLogger.error({
					err: error instanceof Error ? error.message : String(error),
					failureCount: HeadlessWebGPURenderer$1.initFailureCount,
					nextRetryAt: new Date(HeadlessWebGPURenderer$1.nextRetryAt).toISOString()
				}, "[HeadlessWebGPURenderer] Initialization failed");
				throw error;
			}
		})();
		return HeadlessWebGPURenderer$1.initPromise;
	}
	async renderImage(virtualMedia, frame = 0, fps = 24) {
		await HeadlessWebGPURenderer$1.initialize();
		const width = toEvenDimension(virtualMedia.metadata.width ?? 0);
		const height = toEvenDimension(virtualMedia.metadata.height ?? 0);
		if (!width || !height) throw new Error(`Invalid dimensions: ${width}x${height}`);
		const renderId = `img-${randomUUID()}`;
		rendererLogger.debug({
			renderId,
			frame,
			...renderSemaphore.stats
		}, "[HeadlessWebGPURenderer] Acquiring slot for image render");
		await renderSemaphore.acquire();
		let surface;
		let renderer;
		const device = await ensureDevice();
		try {
			await preloadFonts(virtualMedia, device);
			surface = new NodeSurfaceProvider(device, width, height);
			renderer = new Renderer2D(device, surface.colorFormat);
			const ctx = {
				device,
				renderer,
				surface
			};
			const preEncoder = device.createCommandEncoder();
			const dummyTex = renderer.getTemporaryTexture(width, height);
			const dummyView = dummyTex.createView();
			renderer.beginFrame(preEncoder, dummyView, {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, width, height, "clear").end();
			await drawCompositionTree(ctx, preEncoder, dummyView, dummyTex, width, height, virtualMedia, {
				frame,
				fps,
				isHeadless: true,
				renderId,
				virtualMedia,
				containerWidth: width,
				containerHeight: height,
				isVideoMode: virtualMedia.operation?.dataType === "Video"
			});
			device.queue.submit([preEncoder.finish()]);
			await lutStore.awaitAllPending(device);
			compositionStateStore.setState(renderId, frame, fps, true);
			const encoder = device.createCommandEncoder();
			const targetView = surface.getCurrentTextureView();
			const targetTexture = surface.getCurrentTexture();
			renderer.beginFrame(encoder, targetView, {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, width, height, "clear").end();
			await drawCompositionTree(ctx, encoder, targetView, targetTexture, width, height, virtualMedia, {
				frame,
				fps,
				isHeadless: true,
				renderId,
				virtualMedia,
				containerWidth: width,
				containerHeight: height,
				isVideoMode: virtualMedia.operation?.dataType === "Video"
			});
			device.queue.submit([encoder.finish()]);
			const pixels = await surface.readPixels();
			const pixelsArr = new Uint8Array(pixels.buffer, pixels.byteOffset, pixels.byteLength);
			return await sharp(Buffer.from(pixelsArr), { raw: {
				width,
				height,
				channels: 4
			} }).png().toBuffer();
		} finally {
			try {
				clearAllVideoCache();
			} catch {}
			try {
				shaderStore.clear(renderId);
			} catch {}
			try {
				renderer?.destroy();
			} catch {}
			try {
				surface?.destroy();
			} catch {}
			try {
				textureCache.destroy();
			} catch {}
			renderSemaphore.release();
			rendererLogger.debug({
				renderId,
				...renderSemaphore.stats
			}, "[HeadlessWebGPURenderer] Image render slot released");
		}
	}
	async renderLut(virtualMedia, frame = 0, fps = 24) {
		await HeadlessWebGPURenderer$1.initialize();
		const width = 32;
		const height = 32;
		const renderId = `lut-${randomUUID()}`;
		rendererLogger.debug({
			renderId,
			frame,
			...renderSemaphore.stats
		}, "[HeadlessWebGPURenderer] Acquiring slot for LUT render");
		await renderSemaphore.acquire();
		let surface;
		let renderer;
		const device = await ensureDevice();
		let lutData = null;
		const lutSub = lutStore.onChange((key) => {
			const raw = lutStore.getRawData(key);
			if (raw) lutData = raw;
		});
		try {
			await preloadFonts(virtualMedia, device);
			surface = new NodeSurfaceProvider(device, width, height);
			renderer = new Renderer2D(device, surface.colorFormat);
			const ctx = {
				device,
				renderer,
				surface
			};
			const preEncoder = device.createCommandEncoder();
			const dummyTex = renderer.getTemporaryTexture(width, height);
			const dummyView = dummyTex.createView();
			renderer.beginFrame(preEncoder, dummyView, {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, width, height, "clear").end();
			await drawCompositionTree(ctx, preEncoder, dummyView, dummyTex, width, height, virtualMedia, {
				frame,
				fps,
				isHeadless: true,
				renderId,
				virtualMedia,
				containerWidth: width,
				containerHeight: height,
				isVideoMode: virtualMedia.operation?.dataType === "Video"
			});
			device.queue.submit([preEncoder.finish()]);
			await lutStore.awaitAllPending(device);
			compositionStateStore.setState(renderId, frame, fps, true);
			const encoder = device.createCommandEncoder();
			const targetView = surface.getCurrentTextureView();
			const targetTexture = surface.getCurrentTexture();
			renderer.beginFrame(encoder, targetView, {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}, width, height, "clear").end();
			await drawCompositionTree(ctx, encoder, targetView, targetTexture, width, height, virtualMedia, {
				frame,
				fps,
				isHeadless: true,
				renderId,
				virtualMedia,
				containerWidth: width,
				containerHeight: height,
				isVideoMode: virtualMedia.operation?.dataType === "Video"
			});
			device.queue.submit([encoder.finish()]);
			await lutStore.awaitAllPending(device);
			if (!lutData) lutData = lutStore.getAnyRawData();
			if (!lutData) throw new Error("No LUT data generated during rendering");
			const cubeContent = formatLutAsCube(lutData);
			return Buffer.from(cubeContent, "utf-8");
		} finally {
			try {
				lutSub();
			} catch {}
			try {
				mediaDecoderCache.destroy();
				clearAllVideoCache();
			} catch {}
			try {
				shaderStore.clear(renderId);
			} catch {}
			try {
				renderer?.destroy();
			} catch {}
			try {
				surface?.destroy();
			} catch {}
			try {
				textureCache.destroy();
			} catch {}
			renderSemaphore.release();
			rendererLogger.debug({
				renderId,
				...renderSemaphore.stats
			}, "[HeadlessWebGPURenderer] LUT render slot released");
		}
	}
	async renderVideo(virtualMedia, options) {
		await HeadlessWebGPURenderer$1.initialize();
		const codecOption = options?.codec ?? "h264";
		const isMp3 = codecOption === "mp3";
		const isWebM = codecOption === "vp8" || codecOption === "vp9" || codecOption === "opus";
		const mediaType = getMediaType(virtualMedia);
		const isLut = mediaType === "LUT" || virtualMedia.operation?.dataType === "LUT";
		const isAudioOnly = isMp3 || codecOption === "aac" || codecOption === "opus" || mediaType === "Audio";
		const fps = virtualMedia.metadata.fps ?? (isAudioOnly || isLut ? 24 : void 0);
		if (!fps) {
			const dataType = mediaType ?? virtualMedia.dataType ?? "Unknown";
			const op = virtualMedia.operation?.op ?? virtualMedia.op ?? "Unknown";
			throw new Error(`FPS is missing from virtualMedia metadata (dataType: "${dataType}", operation: "${op}")`);
		}
		const width = toEvenDimension(virtualMedia.metadata.width ?? (isAudioOnly ? 1280 : 0));
		const height = toEvenDimension(virtualMedia.metadata.height ?? (isAudioOnly ? 720 : 0));
		if (!width || !height) throw new Error(`Invalid dimensions: ${width}x${height}`);
		const durationMs = virtualMedia.metadata.durationMs ?? 1e3;
		const totalFrames = Math.max(1, Math.round(durationMs / 1e3 * fps));
		const renderId = `vid-${randomUUID()}`;
		const videoCodec = codecOption === "vp9" ? "vp9" : codecOption === "vp8" ? "vp8" : "avc";
		const audioCodec = options?.audioCodec ?? (isMp3 ? "mp3" : isWebM ? "opus" : "aac");
		const quality = resolveQuality(options?.quality);
		rendererLogger.debug({
			renderId,
			totalFrames,
			fps,
			width,
			height,
			codec: codecOption,
			...renderSemaphore.stats
		}, "[HeadlessWebGPURenderer] Acquiring slot for video render (inline)");
		await renderSemaphore.acquire();
		let lastCpuUsage = process.cpuUsage();
		let lastCpuTime = process.hrtime.bigint();
		const getCpuUsage = () => {
			const curCpuUsage = process.cpuUsage();
			const curCpuTime = process.hrtime.bigint();
			const userDiff = curCpuUsage.user - lastCpuUsage.user;
			const sysDiff = curCpuUsage.system - lastCpuUsage.system;
			const timeDiff = Number(curCpuTime - lastCpuTime) / 1e3;
			lastCpuUsage = curCpuUsage;
			lastCpuTime = curCpuTime;
			if (timeDiff === 0) return "0.0%";
			const cpus = os.cpus().length || 1;
			return `${((userDiff + sysDiff) / timeDiff * 100 / cpus).toFixed(1)}%`;
		};
		const getRamUsage = () => {
			const mem = process.memoryUsage();
			const freeMem = os.freemem();
			const totalMem = os.totalmem();
			const usedMem = totalMem - freeMem;
			const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);
			const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024);
			return `Process: ${Math.round(mem.rss / 1024 / 1024)}MB RSS (${heapUsedMb}MB/${heapTotalMb}MB Heap), System: ${Math.round(usedMem / 1024 / 1024)}MB/${Math.round(totalMem / 1024 / 1024)}MB`;
		};
		const getVramUsage = () => {
			try {
				const [used, total] = execSync("nvidia-smi --query-gpu=memory.used,memory.total --format=csv,noheader,nounits", {
					encoding: "utf-8",
					stdio: [
						"ignore",
						"pipe",
						"ignore"
					]
				}).trim().split(",").map((s) => s.trim());
				if (used && total) return `${used}MB / ${total}MB`;
			} catch {}
			return "N/A";
		};
		let statsInterval;
		if (process.env.NODE_ENV === "production") statsInterval = setInterval(() => {
			rendererLogger.info({
				renderId,
				cpu: getCpuUsage(),
				ram: getRamUsage(),
				vram: getVramUsage(),
				renderQueue: renderSemaphore.stats
			}, "[HeadlessWebGPURenderer] Performance Stats");
		}, 5e3);
		const tempDir = os.tmpdir();
		const extension = isMp3 ? "mp3" : isWebM ? "webm" : "mp4";
		const tempFilePath = path.join(tempDir, `render-${renderId}.${extension}`);
		const tempGifPath = path.join(tempDir, `render-${renderId}.gif`);
		const target = new FilePathTarget(tempFilePath);
		const output = new Output({
			format: isMp3 ? new Mp3OutputFormat() : isWebM ? new WebMOutputFormat() : new Mp4OutputFormat(),
			target
		});
		let videoSource;
		if (!isAudioOnly) {
			videoSource = new VideoSampleSource({
				codec: videoCodec,
				bitrate: quality,
				latencyMode: "realtime",
				hardwareAcceleration: isAMD() ? "prefer-software" : "prefer-hardware"
			});
			output.addVideoTrack(videoSource);
		}
		const audioSource = new AudioSampleSource({
			codec: audioCodec,
			bitrate: quality
		});
		output.addAudioTrack(audioSource);
		let outputStarted = false;
		let outputFinalized = false;
		const device = await ensureDevice();
		let surface;
		let renderer;
		try {
			await output.start();
			outputStarted = true;
			await preloadFonts(virtualMedia, device);
			console.log(JSON.stringify(virtualMedia));
			if (!isAudioOnly && videoSource) {
				surface = new NodeSurfaceProvider(device, width, height);
				renderer = new Renderer2D(device, surface.colorFormat);
				const ctx = surface && renderer ? {
					device,
					renderer,
					surface
				} : null;
				if (ctx && renderer) {
					const preEncoder = device.createCommandEncoder();
					const dummyTex = renderer.getTemporaryTexture(width, height);
					const dummyView = dummyTex.createView();
					renderer.beginFrame(preEncoder, dummyView, {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					}, width, height, "clear").end();
					await drawCompositionTree(ctx, preEncoder, dummyView, dummyTex, width, height, virtualMedia, {
						frame: 0,
						fps,
						isHeadless: true,
						renderId,
						virtualMedia,
						containerWidth: width,
						containerHeight: height,
						isVideoMode: virtualMedia.operation?.dataType === "Video"
					});
					device.queue.submit([preEncoder.finish()]);
					await lutStore.awaitAllPending(device);
				}
				for (let i = 0; i < totalFrames; i++) {
					if (i % 10 === 0) rendererLogger.info({
						renderId,
						frame: i,
						totalFrames
					}, `[HeadlessWebGPURenderer] Rendering frame ${i}/${totalFrames}`);
					let pixelsArr;
					if (ctx && surface && renderer) {
						compositionStateStore.setState(renderId, i, fps, true);
						const encoder = device.createCommandEncoder();
						const targetView = surface.getCurrentTextureView();
						const targetTexture = surface.getCurrentTexture();
						renderer.beginFrame(encoder, targetView, {
							r: 0,
							g: 0,
							b: 0,
							a: 0
						}, width, height, "clear").end();
						await drawCompositionTree(ctx, encoder, targetView, targetTexture, width, height, virtualMedia, {
							frame: i,
							fps,
							isHeadless: true,
							renderId,
							virtualMedia,
							containerWidth: width,
							containerHeight: height,
							isVideoMode: virtualMedia.operation?.dataType === "Video"
						});
						device.queue.submit([encoder.finish()]);
						const pixels = await surface.readPixels();
						pixelsArr = new Uint8Array(pixels.buffer, pixels.byteOffset, pixels.byteLength);
					} else throw new Error("Invalid render context state");
					const vf = new globalThis.VideoFrame(pixelsArr, {
						format: "RGBA",
						codedWidth: width,
						codedHeight: height,
						timestamp: i / fps * 1e6,
						colorSpace: {
							primaries: "bt709",
							transfer: "bt709",
							matrix: "bt709",
							fullRange: false
						}
					});
					try {
						const sample = new VideoSample(vf, {
							duration: 1 / fps,
							timestamp: i / fps
						});
						try {
							await videoSource.add(sample);
						} finally {
							sample.close();
						}
					} finally {
						vf.close();
					}
				}
				rendererLogger.debug({
					renderId,
					totalFrames
				}, "[HeadlessWebGPURenderer] All frames rendered and encoded");
			}
			const { channels, sampleRate } = await mixAudioTracks(virtualMedia, fps, 48e3, device, renderId);
			const numChannels = channels.length;
			if (numChannels === 0) throw new Error("mixAudioTracks returned no channels");
			const totalSamples = channels[0].length;
			const chunkSize = Math.round(.1 * sampleRate);
			for (let offset = 0; offset < totalSamples; offset += chunkSize) {
				const currentChunk = Math.min(chunkSize, totalSamples - offset);
				const interleaved = new Float32Array(currentChunk * numChannels);
				for (let i = 0; i < currentChunk; i++) for (let ch = 0; ch < numChannels; ch++) interleaved[i * numChannels + ch] = channels[ch]?.[offset + i] ?? 0;
				const sample = new AudioSample({
					data: interleaved,
					format: "f32",
					numberOfChannels: numChannels,
					sampleRate,
					timestamp: offset / sampleRate
				});
				try {
					await audioSource.add(sample);
				} finally {
					sample.close();
				}
			}
			await output.finalize();
			outputFinalized = true;
			const cleanup = async () => {
				try {
					await fs$1.unlink(tempFilePath).catch(() => {});
					if (codecOption === "gif") await fs$1.unlink(tempGifPath).catch(() => {});
				} catch {}
			};
			if (codecOption === "gif") {
				rendererLogger.debug("[HeadlessWebGPURenderer] Converting rendered MP4 to high-quality GIF...");
				await convertMp4ToGif(tempFilePath, tempGifPath);
				return {
					filePath: tempGifPath,
					cleanup
				};
			}
			return {
				filePath: tempFilePath,
				cleanup
			};
		} catch (error) {
			if (outputStarted && !outputFinalized) try {
				await output.finalize();
			} catch {}
			try {
				await fs$1.unlink(tempFilePath).catch(() => {});
				if (codecOption === "gif") await fs$1.unlink(tempGifPath).catch(() => {});
			} catch {}
			throw error;
		} finally {
			if (statsInterval) clearInterval(statsInterval);
			try {
				renderer?.destroy();
			} catch {}
			try {
				surface?.destroy();
			} catch {}
			try {
				mediaDecoderCache.destroy();
			} catch {}
			try {
				clearAllVideoCache();
			} catch {}
			try {
				textureCache.destroy();
			} catch {}
			try {
				WebGPUAudioProcessor.clearCache(renderId);
			} catch {}
			try {
				shaderStore.clear(renderId);
			} catch {}
			renderSemaphore.release();
			rendererLogger.debug({
				renderId,
				...renderSemaphore.stats
			}, "[HeadlessWebGPURenderer] Video render slot released");
		}
	}
};
const HeadlessMediaRenderer = HeadlessWebGPURenderer;

//#endregion
//#region src/renderer/local-renderer.ts
let LocalMediaRendererService = class LocalMediaRendererService$1 {
	limit;
	constructor(storage) {
		this.storage = storage;
		const limitEnv = process.env.GATEWAI_CONCURRENT_RENDERS;
		let limitVal = limitEnv ? parseInt(limitEnv, 10) : 2;
		if (Number.isNaN(limitVal) || limitVal <= 0) limitVal = 2;
		this.limit = pLimit(limitVal);
	}
	async renderComposition(options) {
		return this.limit(async () => {
			const virtualMedia = options.inputProps.virtualMedia;
			if (!virtualMedia) throw new Error("Missing virtualMedia in inputProps");
			const renderResult = await new HeadlessMediaRenderer().renderVideo(virtualMedia, {
				codec: options.codec,
				audioCodec: options.audioCodec
			});
			const key = options.fileKey ?? `renders/render-${Date.now()}.mp4`;
			await this.storage.uploadFileToStorage(renderResult.filePath, key);
			await renderResult.cleanup();
			return { fileKey: key };
		});
	}
	async renderStillComposition(options) {
		return this.limit(async () => {
			const virtualMedia = options.inputProps.virtualMedia;
			if (!virtualMedia) throw new Error("Missing virtualMedia in inputProps");
			const buffer = await new HeadlessMediaRenderer().renderImage(virtualMedia, options.frame ?? 0);
			const key = options.fileKey ?? `renders/render-${Date.now()}.png`;
			await this.storage.uploadToStorage(buffer, key);
			return { fileKey: key };
		});
	}
	async renderLutComposition(options) {
		return this.limit(async () => {
			const virtualMedia = options.inputProps.virtualMedia;
			if (!virtualMedia) throw new Error("Missing virtualMedia in inputProps");
			const buffer = await new HeadlessMediaRenderer().renderLut(virtualMedia, options.frame ?? 0);
			const key = options.fileKey ?? `renders/render-${Date.now()}.cube`;
			await this.storage.uploadToStorage(buffer, key);
			return { fileKey: key };
		});
	}
	async renderVirtualMedia(media, _type, options) {
		if (_type === "LUT") return this.renderVirtualLut(media, options);
		return this.renderComposition({
			...options,
			inputProps: { virtualMedia: media }
		});
	}
	async renderVirtualImage(media, options) {
		return this.renderStillComposition({
			...options,
			inputProps: { virtualMedia: media },
			frame: options?.frame ?? 0
		});
	}
	async renderVirtualLut(media, options) {
		return this.renderLutComposition({
			...options,
			inputProps: { virtualMedia: media },
			frame: options?.frame ?? 0
		});
	}
	async renderVirtualAudio(media, options) {
		return this.renderVirtualMedia(media, "Audio", options);
	}
};
LocalMediaRendererService = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.STORAGE)),
	__decorateMetadata("design:paramtypes", [Object])
], LocalMediaRendererService);

//#endregion
//#region src/renderer/media-resolver.ts
let MediaResolverService = class MediaResolverService$1 {
	constructor(storage, prisma, renderer) {
		this.storage = storage;
		this.prisma = prisma;
		this.renderer = renderer;
	}
	async resolveToBuffer(media, type, options) {
		if (type === "Caption") {
			const srtText = media.operation?.srtText;
			if (typeof srtText === "string" && srtText.trim().length > 0) return {
				buffer: Buffer.from(srtText),
				mimeType: "text/plain"
			};
			if (hasOnlySingleSource(media)) {
				const source = findSourceAsset(media);
				const key = source?.entity?.key;
				if (key) return {
					buffer: await this.storage.getFromStorage(key),
					mimeType: source.entity?.mimeType ?? "text/plain",
					fileKey: key
				};
			}
			throw new Error("Caption not found in storage or operation config");
		}
		const isTypeMatching = !media.operation?.dataType || media.operation.dataType === type;
		if (hasOnlySingleSource(media) && isTypeMatching) {
			const source = findSourceAsset(media);
			const key = source?.entity?.key;
			if (key) return {
				buffer: await this.storage.getFromStorage(key),
				mimeType: source.entity?.mimeType ?? "application/octet-stream",
				fileKey: key
			};
		}
		let renderResult;
		let mimeType = "application/octet-stream";
		if (type === "Image" || type === "SVG") {
			renderResult = await this.renderer.renderVirtualImage(media, options);
			mimeType = "image/png";
		} else {
			renderResult = await this.renderer.renderVirtualMedia(media, type, options);
			if (type === "Video") mimeType = "video/mp4";
			else if (type === "Audio") mimeType = "audio/mp3";
			else if (type === "LUT") mimeType = "application/x-cube";
		}
		if (renderResult.fileKey) return {
			buffer: await this.storage.getFromStorage(renderResult.fileKey),
			mimeType,
			fileKey: renderResult.fileKey
		};
		throw new Error(`Failed to resolve ${type} to buffer`);
	}
	async ensureDataUrlIfNeeded(url$1, fileKey, type) {
		if (!url$1 || !url$1.startsWith("file://")) return url$1;
		try {
			const buffer = await this.storage.getFromStorage(fileKey);
			let mimeType = "image/png";
			if (type === "Audio") mimeType = "audio/mp3";
			else if (type === "Video") mimeType = "video/mp4";
			else if (type === "Caption") mimeType = "text/plain";
			else if (fileKey.endsWith(".jpg") || fileKey.endsWith(".jpeg")) mimeType = "image/jpeg";
			else if (fileKey.endsWith(".svg")) mimeType = "image/svg+xml";
			else if (fileKey.endsWith(".gif")) mimeType = "image/gif";
			return `data:${mimeType};base64,${buffer.toString("base64")}`;
		} catch {
			return url$1;
		}
	}
	async resolveToUrl(media, type, options) {
		if (type === "Caption") {
			if (hasOnlySingleSource(media)) {
				const key = findSourceAsset(media)?.entity?.key;
				if (key) {
					const rawUrl = this.storage.getPublicUrl(key);
					return {
						url: await this.ensureDataUrlIfNeeded(rawUrl, key, type),
						fileKey: key
					};
				}
			}
			const srtText = media.operation?.srtText;
			if (typeof srtText === "string" && srtText.trim().length > 0) {
				const tempKey = `temp/resolve_caption_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.srt`;
				await this.storage.uploadToStorage(Buffer.from(srtText), tempKey, "text/plain", "assets");
				const rawUrl = this.storage.getPublicUrl(tempKey);
				return {
					url: await this.ensureDataUrlIfNeeded(rawUrl, tempKey, type),
					fileKey: tempKey
				};
			}
			throw new Error("Caption not found in storage or operation config");
		}
		const isTypeMatching = !media.operation?.dataType || media.operation.dataType === type;
		if (hasOnlySingleSource(media) && isTypeMatching) {
			const key = findSourceAsset(media)?.entity?.key;
			if (key) {
				const rawUrl = this.storage.getPublicUrl(key);
				return {
					url: await this.ensureDataUrlIfNeeded(rawUrl, key, type),
					fileKey: key
				};
			}
		}
		let renderResult;
		if (type === "Image" || type === "SVG") renderResult = await this.renderer.renderVirtualImage(media, options);
		else renderResult = await this.renderer.renderVirtualMedia(media, type, options);
		if (renderResult.fileKey) {
			const rawUrl = this.storage.getPublicUrl(renderResult.fileKey);
			return {
				url: await this.ensureDataUrlIfNeeded(rawUrl, renderResult.fileKey, type),
				fileKey: renderResult.fileKey
			};
		}
		throw new Error(`Failed to resolve ${type} to URL`);
	}
	async resolveToAsset(media, type, options) {
		if (type === "Caption" && hasOnlySingleSource(media)) {
			const source = findSourceAsset(media);
			if (source && source.entity?.key) return { virtualMedia: createVirtualMedia(source, type) };
		}
		const bufferResult = await this.resolveToBuffer(media, type, options);
		const filename = `resolved_${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${type === "Audio" ? "mp3" : type === "Image" ? "png" : type === "LUT" ? "cube" : "mp4"}`;
		const { asset } = await createFileAsset(this.prisma, {
			userId: "cli-user",
			buffer: bufferResult.buffer,
			filename,
			mimeType: bufferResult.mimeType
		});
		return {
			virtualMedia: createVirtualMedia({ entity: asset }, type),
			fileKey: asset.key,
			assetId: asset.id
		};
	}
};
MediaResolverService = __decorate([
	injectable(),
	__decorateParam(0, inject(TOKENS.STORAGE)),
	__decorateParam(1, inject(TOKENS.PRISMA)),
	__decorateParam(2, inject(TOKENS.MEDIA_RENDERER)),
	__decorateMetadata("design:paramtypes", [
		Object,
		Object,
		Object
	])
], MediaResolverService);

//#endregion
//#region src/spec.ts
const HandleSpecSchema = z.object({
	label: z.string(),
	dataTypes: z.array(z.string())
});
const NodeSpecSchema = z.object({
	id: z.string(),
	type: z.string(),
	name: z.string().optional(),
	position: z.object({
		x: z.number(),
		y: z.number()
	}).optional().default({
		x: 0,
		y: 0
	}),
	config: z.record(z.string(), z.unknown()).optional().default({}),
	dynamicInputs: z.array(HandleSpecSchema).optional().default([]),
	dynamicOutputs: z.array(HandleSpecSchema).optional().default([]),
	result: z.unknown().optional(),
	locked: z.boolean().optional()
});
const EdgeSpecSchema = z.object({
	source: z.string(),
	target: z.string(),
	sourceLabel: z.string().optional(),
	targetLabel: z.string().optional()
});
const FontSpecSchema = z.object({
	family: z.string(),
	file: z.string()
});
const CanvasSpecSchema = z.object({
	name: z.string(),
	nodes: z.array(NodeSpecSchema),
	edges: z.array(EdgeSpecSchema).optional().default([]),
	fonts: z.array(FontSpecSchema).optional().default([]),
	canvasId: z.string().optional()
});

//#endregion
//#region src/storage/local-storage.ts
let LocalStorageService = class LocalStorageService$1 {
	storageDir;
	constructor() {
		this.storageDir = process.env.GATEWAI_STORAGE_DIR ? path.resolve(process.env.GATEWAI_STORAGE_DIR) : path.join(os.tmpdir(), "gatewai-storage");
	}
	getLocalPath(key) {
		if (path.isAbsolute(key)) return key;
		return path.join(this.storageDir, key);
	}
	async uploadToStorage(buffer, key) {
		const filePath = this.getLocalPath(key);
		await fs$1.mkdir(path.dirname(filePath), { recursive: true });
		await fs$1.writeFile(filePath, buffer);
	}
	async uploadFileToStorage(filePath, key) {
		const dest = this.getLocalPath(key);
		await fs$1.mkdir(path.dirname(dest), { recursive: true });
		await fs$1.copyFile(filePath, dest);
	}
	async getFromStorage(key) {
		return fs$1.readFile(this.getLocalPath(key));
	}
	async fileExistsInStorage(key) {
		return existsSync(this.getLocalPath(key));
	}
	async deleteFromStorage(key) {
		await fs$1.unlink(this.getLocalPath(key)).catch(() => {});
	}
	getPublicUrl(key) {
		return `file://${this.getLocalPath(key)}`;
	}
	async generateSignedUrl(key) {
		return this.getPublicUrl(key);
	}
	async generateSignedPutUrl(key) {
		return this.getPublicUrl(key);
	}
	getStreamFromStorage(key) {
		return createReadStream(this.getLocalPath(key));
	}
	async getObjectMetadata(key) {
		return {
			ContentLength: (await fs$1.stat(this.getLocalPath(key))).size,
			ContentType: key.endsWith(".mp4") ? "video/mp4" : key.endsWith(".mp3") ? "audio/mpeg" : key.endsWith(".png") ? "image/png" : key.endsWith(".jpg") || key.endsWith(".jpeg") ? "image/jpeg" : key.endsWith(".gif") ? "image/gif" : "application/octet-stream"
		};
	}
	async listFromStorage() {
		return [];
	}
	async uploadToTemporaryStorageFolder(buffer, _mimeType, key) {
		await this.uploadToStorage(buffer, key);
		return { key };
	}
};
LocalStorageService = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], LocalStorageService);

//#endregion
//#region src/memory.ts
function getFileInfo(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	let dataType = "Video";
	let mimeType = "video/mp4";
	if (ext === ".mp4") {
		dataType = "Video";
		mimeType = "video/mp4";
	} else if (ext === ".webm") {
		dataType = "Video";
		mimeType = "video/webm";
	} else if (ext === ".mp3" || ext === ".mpeg") {
		dataType = "Audio";
		mimeType = "audio/mpeg";
	} else if (ext === ".wav") {
		dataType = "Audio";
		mimeType = "audio/wav";
	} else if (ext === ".png") {
		dataType = "Image";
		mimeType = "image/png";
	} else if (ext === ".jpg" || ext === ".jpeg") {
		dataType = "Image";
		mimeType = "image/jpeg";
	} else if (ext === ".svg") {
		dataType = "SVG";
		mimeType = "image/svg+xml";
	} else if (ext === ".json") {
		dataType = "Lottie";
		mimeType = "application/json";
	} else if (ext === ".gif") {
		dataType = "GIF";
		mimeType = "image/gif";
	} else if (ext === ".cube") {
		dataType = "LUT";
		mimeType = "application/octet-stream";
	}
	return {
		dataType,
		mimeType
	};
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function findNodesDir() {
	let current = __dirname;
	while (true) {
		const nodesDir = path.resolve(current, "nodes");
		try {
			if (fs.readdirSync(nodesDir).some((d) => d.startsWith("node-") && fs.existsSync(path.join(nodesDir, d, "package.json")))) return nodesDir;
		} catch {}
		const parent = path.dirname(current);
		if (parent === current) throw new Error("nodes/ directory not found");
		current = parent;
	}
}
/**
* Locate the generated+bundled MAIN skill file.
*
* The full main skill (header + node catalog) is produced at build time into
* `dist/skills/SKILL.md` and shipped inside the npx package. We prefer that so
* the CLI works without the source tree; the developer-authored header in
* `skills/SKILL.md` is the fallback for a fresh dev checkout that hasn't run
* the generator yet.
*/
function resolveMainSkillPath() {
	return [
		path.resolve(__dirname, "../../dist/skills/SKILL.md"),
		path.resolve(__dirname, "../dist/skills/SKILL.md"),
		path.resolve(__dirname, "../skills/SKILL.md")
	].find((p$1) => fs.existsSync(p$1));
}
function parseFrontmatter(raw) {
	const trimmed = raw.trim();
	if (!trimmed.startsWith("---")) return {
		frontmatter: {},
		content: raw
	};
	const parts = trimmed.split("\n---");
	if (parts.length < 2) return {
		frontmatter: {},
		content: raw
	};
	const frontmatterStr = parts[0].replace(/^---/, "").trim();
	const content = parts.slice(1).join("\n---").trim();
	return {
		frontmatter: yaml.load(frontmatterStr) ?? {},
		content
	};
}
function discoverSkills() {
	const discovered = [];
	const skillsJsonPath = [
		path.resolve(__dirname, "../../dist/skills/skills.json"),
		path.resolve(__dirname, "../dist/skills/skills.json"),
		path.resolve(__dirname, "./skills/skills.json")
	].find((p$1) => fs.existsSync(p$1));
	if (skillsJsonPath) try {
		const items = JSON.parse(fs.readFileSync(skillsJsonPath, "utf-8"));
		if (Array.isArray(items)) {
			for (const item of items) if (item.nodeType && item.name) discovered.push(item);
		}
	} catch (e) {
		logger.warn(`[memory] Failed to read bundled skills.json: ${e}`);
	}
	else try {
		const nodesDir = findNodesDir();
		const entries = fs.readdirSync(nodesDir).filter((d) => d.startsWith("node-") && fs.statSync(path.join(nodesDir, d)).isDirectory());
		for (const dir of entries) {
			const skillPath = path.join(nodesDir, dir, "SKILL.md");
			if (fs.existsSync(skillPath)) try {
				const { frontmatter, content } = parseFrontmatter(fs.readFileSync(skillPath, "utf-8"));
				const nodeType = frontmatter.nodeType;
				const name = frontmatter.name;
				const description = frontmatter.description || frontmatter.summary;
				const triggers = Array.isArray(frontmatter.triggers) ? frontmatter.triggers.map(String) : typeof frontmatter.triggers === "string" && frontmatter.triggers ? frontmatter.triggers.split(",").map((s) => s.trim()) : [];
				if (nodeType && name && description) discovered.push({
					nodeType: String(nodeType),
					name: String(name),
					summary: String(description),
					triggers,
					content
				});
			} catch (e) {
				logger.warn(`[memory] Failed to parse skill for node ${dir}: ${e}`);
			}
		}
	} catch (e) {
		logger.warn(`[memory] Development node dir discovery skipped: ${e}`);
	}
	const mainSkillPath = resolveMainSkillPath();
	if (mainSkillPath && fs.existsSync(mainSkillPath)) try {
		const { frontmatter, content } = parseFrontmatter(fs.readFileSync(mainSkillPath, "utf-8"));
		const triggers = Array.isArray(frontmatter.triggers) ? frontmatter.triggers.map(String) : typeof frontmatter.triggers === "string" && frontmatter.triggers ? frontmatter.triggers.split(",").map((s) => s.trim()) : [];
		discovered.push({
			nodeType: "gatewai-artifex",
			name: String(frontmatter.name ?? "gatewai-artifex"),
			summary: String(frontmatter.description ?? frontmatter.summary ?? ""),
			triggers,
			content
		});
	} catch (e) {
		logger.warn(`[memory] Failed to parse CLI skill: ${e}`);
	}
	return discovered;
}
function buildTemplates(registry) {
	const templates = [];
	for (const manifest of registry.getAllManifests()) {
		const handles = [];
		let order = 0;
		for (const input of manifest.handles?.inputs ?? []) handles.push({
			type: "Input",
			dataTypes: input.dataTypes,
			label: input.label,
			order: order++,
			required: input.required ?? false
		});
		for (const output of manifest.handles?.outputs ?? []) handles.push({
			type: "Output",
			dataTypes: output.dataTypes,
			label: output.label,
			order: order++,
			required: output.required ?? false
		});
		templates.push({
			id: manifest.type,
			type: manifest.type,
			templateHandles: handles,
			variableInputs: manifest.variableInputs ? {
				enabled: true,
				dataTypes: manifest.variableInputs.dataTypes
			} : {
				enabled: false,
				dataTypes: []
			},
			variableOutputs: manifest.variableOutputs ? {
				enabled: true,
				dataTypes: manifest.variableOutputs.dataTypes
			} : {
				enabled: false,
				dataTypes: []
			},
			isTerminal: manifest.isTerminal ?? false,
			defaultConfig: manifest.defaultConfig
		});
	}
	return templates;
}
let memoryBound = false;
async function bootstrapInMemory() {
	ensureEnvDefaults();
	if (memoryBound) return;
	const registry = new NodeRegistry();
	await registerStaticNodes(registry);
	await registerStaticRenderers();
	const skillRegistry = new SkillRegistry();
	const skills = discoverSkills();
	for (const skill of skills) skillRegistry.register(skill);
	const storage = new LocalStorageService();
	const prismaShim = new MockPrismaClient();
	if (!container.isBound(TOKENS.ENV)) container.bind(TOKENS.ENV).toConstantValue(ENV_CONFIG);
	if (!container.isBound(TOKENS.LOGGER)) container.bind(TOKENS.LOGGER).toConstantValue(logger);
	if (container.isBound(TOKENS.STORAGE)) container.unbind(TOKENS.STORAGE);
	container.bind(TOKENS.STORAGE).toConstantValue(storage);
	if (container.isBound(TOKENS.PRISMA)) container.unbind(TOKENS.PRISMA);
	container.bind(TOKENS.PRISMA).toConstantValue(prismaShim);
	if (container.isBound(TOKENS.AI_PROVIDER)) container.unbind(TOKENS.AI_PROVIDER);
	container.bind(TOKENS.AI_PROVIDER).to(AiProviderService).inSingletonScope();
	const localRenderer = new LocalMediaRendererService(storage);
	if (container.isBound(TOKENS.MEDIA_RENDERER)) container.unbind(TOKENS.MEDIA_RENDERER);
	container.bind(TOKENS.MEDIA_RENDERER).toConstantValue(localRenderer);
	if (container.isBound(TOKENS.MEDIA_RESOLVER)) container.unbind(TOKENS.MEDIA_RESOLVER);
	container.bind(TOKENS.MEDIA_RESOLVER).to(MediaResolverService).inSingletonScope();
	if (container.isBound(TOKENS.NODE_REGISTRY)) container.unbind(TOKENS.NODE_REGISTRY);
	container.bind(TOKENS.NODE_REGISTRY).toConstantValue(registry);
	if (container.isBound(TOKENS.MEDIA)) container.unbind(TOKENS.MEDIA);
	container.bind(TOKENS.MEDIA).to(ServerMediaService).inSingletonScope();
	if (container.isBound(TOKENS.SKILL_REGISTRY)) container.unbind(TOKENS.SKILL_REGISTRY);
	container.bind(TOKENS.SKILL_REGISTRY).toConstantValue(skillRegistry);
	if (!container.isBound(TOKENS.GRAPH_RESOLVERS)) container.bind(TOKENS.GRAPH_RESOLVERS).to(GraphResolverService).inSingletonScope();
	memoryBound = true;
}
function canonicalize(value) {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b$1]) => a.localeCompare(b$1)).map(([key, entry]) => [key, canonicalize(entry)]));
	return value;
}
function fingerprintSpec(spec) {
	return crypto.createHash("sha256").update(JSON.stringify(canonicalize(spec))).digest("hex");
}
async function buildFromSpecInMemory(specIn, specPath) {
	const spec = CanvasSpecSchema.parse(specIn);
	const authoredSpecFingerprint = fingerprintSpec(spec);
	for (const node$1 of spec.nodes) if (node$1.type === "Import" && node$1.config && typeof node$1.config.file === "string") {
		const relativePath = node$1.config.file;
		const specDir = specPath ? path.dirname(path.resolve(specPath)) : process.cwd();
		let absolutePath = relativePath;
		if (!path.isAbsolute(absolutePath)) absolutePath = path.resolve(specDir, absolutePath);
		if (!fs.existsSync(absolutePath)) throw new Error(`Import file not found: ${absolutePath}`);
		const { dataType, mimeType } = getFileInfo(absolutePath);
		const stats = await fs.promises.stat(absolutePath);
		let metaSource;
		if (dataType === "Video" || dataType === "Audio") metaSource = absolutePath;
		else metaSource = await fs.promises.readFile(absolutePath);
		const meta = await extractMediaMetadata(metaSource, mimeType, dataType);
		const sourceMeta = {
			width: meta.width || void 0,
			height: meta.height || void 0,
			durationMs: meta.durationInSec ? meta.durationInSec * 1e3 : void 0,
			fps: meta.fps || void 0,
			sampleRate: meta.sampleRate || void 0,
			channels: meta.channels || void 0,
			bitDepth: meta.bitDepth || void 0,
			audioCodec: meta.audioCodec || void 0,
			audioBitrate: meta.audioBitrate || void 0
		};
		node$1.result = {
			selectedOutputIndex: 0,
			outputs: [{ items: [{
				type: dataType,
				data: {
					metadata: sourceMeta,
					operation: {
						op: "source",
						source: { entity: {
							id: node$1.id,
							name: path.basename(absolutePath),
							createdAt: /* @__PURE__ */ new Date(),
							updatedAt: /* @__PURE__ */ new Date(),
							bucket: "dummy-bucket",
							size: stats.size,
							mimeType,
							key: absolutePath,
							isUploaded: true,
							duration: sourceMeta.durationMs || null,
							fps: sourceMeta.fps || null,
							width: sourceMeta.width || null,
							height: sourceMeta.height || null
						} },
						sourceMeta,
						dataType
					},
					children: []
				}
			}] }]
		};
		if (!node$1.name) node$1.name = `Import ${dataType}`;
	}
	const registry = container.get(TOKENS.NODE_REGISTRY);
	const templates = buildTemplates(registry);
	const terminalTypes = new Set(templates.filter((t) => t.isTerminal).map((t) => t.type));
	const canvasId = spec.canvasId ?? `memory-${Date.now()}`;
	const sessionId = `cli-mem-${Date.now()}`;
	const engine = CanvasEngine.createInMemory(canvasId, sessionId, registry, templates);
	const nodeIds = {};
	const buildErrors = [];
	for (const nodeSpec of spec.nodes) try {
		if (nodeSpec.locked && !terminalTypes.has(nodeSpec.type)) throw new Error(`Non-terminal node "${nodeSpec.name || nodeSpec.id}" of type "${nodeSpec.type}" cannot be locked. Only terminal nodes can be locked.`);
		const created = engine.createNode({
			type: nodeSpec.type,
			name: nodeSpec.name,
			position: nodeSpec.position,
			config: nodeSpec.config
		});
		nodeIds[nodeSpec.id] = created.nodeId;
		if (nodeSpec.locked !== void 0) created.node.locked = nodeSpec.locked;
		if (nodeSpec.result) {
			const res = JSON.parse(JSON.stringify(nodeSpec.result));
			if (res.outputs && created.outputHandles.length > 0) for (const [outputIndex, output] of res.outputs.entries()) {
				const outputHandleId = created.outputHandles[outputIndex]?.id;
				if (output.items) {
					for (const item of output.items) if (!item.outputHandleId && outputHandleId) item.outputHandleId = outputHandleId;
				}
			}
			created.node.result = res;
		}
		const dynamicInputMap = {};
		for (const h$1 of nodeSpec.dynamicInputs) {
			const added = engine.addDynamicInput(created.nodeId, h$1.label, h$1.dataTypes);
			dynamicInputMap[h$1.label] = added.id;
			if (h$1.id) dynamicInputMap[h$1.id] = added.id;
		}
		for (const h$1 of nodeSpec.dynamicOutputs) engine.addDynamicOutput(created.nodeId, h$1.label, h$1.dataTypes);
		if (Object.keys(dynamicInputMap).length > 0) {
			const updatedConfig = { ...nodeSpec.config };
			for (const [k$1, v$1] of Object.entries(updatedConfig)) if (typeof v$1 === "string" && dynamicInputMap[v$1]) updatedConfig[k$1] = dynamicInputMap[v$1];
			const mapLayoutInputHandles = (nodes) => {
				for (const node$1 of nodes) if (node$1 && typeof node$1 === "object") {
					if ((node$1.kind === "media" || node$1.kind === "text") && typeof node$1.inputHandleId === "string") node$1.inputHandleId = dynamicInputMap[node$1.inputHandleId] ?? node$1.inputHandleId;
					if (Array.isArray(node$1.children)) mapLayoutInputHandles(node$1.children);
				}
			};
			if (Array.isArray(updatedConfig.layout)) mapLayoutInputHandles(updatedConfig.layout);
			engine.updateNodeConfig(created.nodeId, updatedConfig);
		}
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		buildErrors.push(`Node "${nodeSpec.name || nodeSpec.id}" [${nodeSpec.type}]: ${msg}`);
	}
	for (const edge of spec.edges) {
		const sourceNodeId = nodeIds[edge.source];
		const targetNodeId = nodeIds[edge.target];
		if (!sourceNodeId || !targetNodeId) {
			buildErrors.push(`Edge references unknown node: "${edge.source}" -> "${edge.target}"`);
			continue;
		}
		try {
			engine.connect({
				sourceNodeId,
				targetNodeId,
				sourceLabel: edge.sourceLabel,
				targetLabel: edge.targetLabel
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			buildErrors.push(`Edge "${edge.source}" (${edge.sourceLabel ?? "*"}) -> "${edge.target}" (${edge.targetLabel ?? "*"}): ${msg}`);
		}
	}
	try {
		engine.commitInMemory();
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		buildErrors.push(`Graph integrity error: ${msg}`);
	}
	if (buildErrors.length > 0) throw new Error(`Found ${buildErrors.length} validation error(s):\n` + buildErrors.map((e, i) => `  ${i + 1}. ${e}`).join("\n"));
	return {
		canvasId,
		sessionId,
		specFingerprint: authoredSpecFingerprint,
		nodeIds,
		engine,
		terminalTypes,
		templates
	};
}
async function runInMemory(build, targetNodeId) {
	const runner = new InMemoryWorkflowRunner(container.get(TOKENS.NODE_REGISTRY));
	const data = {
		nodes: build.engine.getNodes(),
		edges: build.engine.getEdges(),
		handles: build.engine.getHandles(),
		canvas: {
			id: build.canvasId,
			name: build.canvasId
		}
	};
	let nodeIds;
	if (Array.isArray(targetNodeId)) nodeIds = targetNodeId;
	else if (targetNodeId) nodeIds = [targetNodeId];
	else {
		const terminals = build.engine.getNodes().filter((n) => build.terminalTypes.has(n.type) && !n.locked).map((n) => n.id);
		if (terminals.length > 0) nodeIds = terminals;
	}
	const availableNodeIds = new Set(build.engine.getNodes().map((node$1) => node$1.id));
	for (const id of nodeIds ?? []) if (!availableNodeIds.has(id)) throw new Error(`Execution target "${id}" does not exist in the built canvas.`);
	const executed = await runner.executeWorkflowData(data, build.terminalTypes, nodeIds);
	const results = {};
	for (const node$1 of executed.nodes) if (node$1.result) results[node$1.id] = node$1.result;
	return {
		canvasId: build.canvasId,
		results,
		nodeIds: build.nodeIds
	};
}

//#endregion
//#region src/main.ts
const HELP = `
Usage: artifex <command> [spec.json] [options]

Commands:
  validate <spec.json>               Parse + validate spec and node config schemas.
  build    <spec.json>               Build canvas in memory and verify topological sort.
  run      <spec.json>               Execute workflow; print / save results.
  nodes                              Print the machine-readable registered nodes catalog.
  skill    [<nodeType>]              Print markdown instructions. Bare: the main skill (usage
                                     guide + full node catalog). --list enumerates all skills.
  version                            Print CLI version.
  help                               Show help.

Options:
  --json                             Produce machine-readable JSON output on stdout.
  --node <id>                        Specify target terminal node(s) to run (comma-separated).
  --state <file>                     Specify path to save CanvasState (results + node IDs).
  --from-state <file>                Specify path to load CanvasState from.
`;
function parseArgs(args) {
	const options = {
		json: false,
		node: void 0,
		state: void 0,
		fromState: void 0,
		yes: false
	};
	let command = "";
	let specPath = "";
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--json") options.json = true;
		else if (arg === "--node" && i + 1 < args.length) options.node = args[++i];
		else if (arg === "--state" && i + 1 < args.length) options.state = args[++i];
		else if (arg === "--from-state" && i + 1 < args.length) options.fromState = args[++i];
		else if (arg === "--yes" || arg === "--force") options.yes = true;
		else if (!command) command = arg;
		else if (!specPath) specPath = arg;
	}
	return {
		command,
		specPath,
		options
	};
}
function applyStateToBuild(build, stateData) {
	if (stateData.specFingerprint && stateData.specFingerprint !== build.specFingerprint) console.warn(`[applyStateToBuild] Warning: State fingerprint does not match the current workflow (expected ${build.specFingerprint}, received ${stateData.specFingerprint}). Loading cached results anyway.`);
	const results = stateData.results || {};
	const stateNodeIds = stateData.nodeIds || {};
	for (const [specId, currentEngineId] of Object.entries(build.nodeIds)) {
		const node$1 = build.engine.findNode(currentEngineId);
		if (node$1 && node$1.type === "Export") continue;
		const cachedResult = results[stateNodeIds[specId] ?? specId] ?? results[specId];
		if (cachedResult) {
			if (node$1) {
				const res = JSON.parse(JSON.stringify(cachedResult));
				const outputHandles = build.engine.getHandles().filter((h$1) => h$1.nodeId === currentEngineId && h$1.type === "Output").sort((a, b$1) => (a.order ?? 0) - (b$1.order ?? 0));
				if (res.outputs && outputHandles.length > 0) for (const [outputIndex, output] of res.outputs.entries()) {
					const outputHandleId = outputHandles[outputIndex]?.id;
					if (output.items && outputHandleId) for (const item of output.items) item.outputHandleId = outputHandleId;
				}
				node$1.result = res;
			}
		}
	}
}
/**
* Node types whose processors call a paid AI provider (FAL / OpenRouter) at run
* time. Frame extraction must not silently re-run these. Derived from which
* `nodes/*` processors call AiProviderService.getFal() / getOpenRouterOpenAI().
*/
async function loadFonts(specPath, fonts) {
	if (!fonts || fonts.length === 0) return;
	let device = null;
	try {
		device = await ensureDevice();
	} catch (e) {}
	const specDir = path.dirname(path.resolve(specPath));
	for (const font of fonts) try {
		let fontUrl = font.file;
		if (!fontUrl.startsWith("http://") && !fontUrl.startsWith("https://") && !fontUrl.startsWith("file://") && !path.isAbsolute(fontUrl)) fontUrl = path.resolve(specDir, fontUrl);
		if (path.isAbsolute(fontUrl)) fontUrl = `file://${fontUrl}`;
		await registerHeadlessFont(font.family, fontUrl);
		if (device) await SlugFontCache.preloadSlugFont(device, font.family, fontUrl);
	} catch (err) {
		console.warn(`[loadFonts] Failed to load font "${font.family}" from ${font.file}:`, err);
	}
}
async function main(argsOverride) {
	const { command, specPath, options } = parseArgs(argsOverride ?? process.argv.slice(2));
	if (!command || command === "help" || command === "--help" || command === "-h") {
		console.log(HELP);
		return;
	}
	try {
		switch (command) {
			case "version": {
				let version = "1.0.0";
				try {
					let dir = path.dirname(fileURLToPath(import.meta.url));
					while (true) {
						const pkgPath = path.join(dir, "package.json");
						if (existsSync(pkgPath)) {
							const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
							if (pkg.name === "@gatewai.studio/artifex" && pkg.version) {
								version = pkg.version;
								break;
							}
						}
						const parent = path.dirname(dir);
						if (parent === dir) break;
						dir = parent;
					}
				} catch {}
				if (options.json) console.log(JSON.stringify({ version }));
				else console.log(`artifex v${version}`);
				return;
			}
			case "nodes": {
				await bootstrapInMemory();
				const catalog = container.get(TOKENS.NODE_REGISTRY).getAllManifests().map((m) => ({
					type: m.type,
					displayName: m.displayName,
					description: m.description,
					category: m.category,
					subcategory: m.subcategory,
					isTerminal: m.isTerminal ?? false,
					handles: m.handles ?? {
						inputs: [],
						outputs: []
					},
					variableInputs: m.variableInputs,
					variableOutputs: m.variableOutputs,
					defaultConfig: m.defaultConfig ?? {}
				}));
				console.log(JSON.stringify(catalog, null, options.json ? 0 : 2));
				return;
			}
			case "skill": {
				await bootstrapInMemory();
				const skillRegistry = container.get(TOKENS.SKILL_REGISTRY);
				if (specPath === "--list") {
					const summaries = skillRegistry.getAllSummaries();
					if (options.json) console.log(JSON.stringify(summaries));
					else for (const s of summaries) console.log(`${s.nodeType}	${s.name}	${s.summary}`);
					return;
				}
				const requested = specPath || "gatewai-artifex";
				let content = skillRegistry.getContent(requested);
				let matchedNodeType = requested;
				if (!content) {
					const summary = skillRegistry.getAllSummaries().find((s) => s.name.toLowerCase() === requested.toLowerCase() || s.name.replace(/\s+/g, "").toLowerCase() === requested.replace(/\s+/g, "").toLowerCase() || s.nodeType.toLowerCase() === requested.toLowerCase() || s.nodeType.replace(/\s+/g, "").toLowerCase() === requested.replace(/\s+/g, "").toLowerCase());
					if (summary) {
						matchedNodeType = summary.nodeType;
						content = skillRegistry.getContent(summary.nodeType);
					}
				}
				if (!content) throw new CliError(`No skill found for node type "${requested}"`, ExitCode.INPUT_ERROR, "E_INPUT");
				if (options.json) console.log(JSON.stringify({
					nodeType: matchedNodeType,
					content
				}));
				else console.log(content);
				return;
			}
			case "validate": {
				if (!specPath) throw new CliError("validate requires spec.json file path", ExitCode.INPUT_ERROR, "E_INPUT");
				let raw;
				try {
					raw = await fs$1.readFile(specPath, "utf-8");
				} catch (e) {
					throw new CliError(`Failed to read spec file: ${e instanceof Error ? e.message : String(e)}`, ExitCode.INPUT_ERROR, "E_INPUT");
				}
				let spec;
				try {
					spec = JSON.parse(raw);
				} catch {
					throw new CliError("Invalid JSON in spec file", ExitCode.INPUT_ERROR, "E_INPUT");
				}
				const allErrors = [];
				const parsed = CanvasSpecSchema.safeParse(spec);
				if (!parsed.success) for (const issue of parsed.error.issues) {
					const fieldPath = issue.path.length > 0 ? ` at .${issue.path.join(".")}` : "";
					allErrors.push(`Schema error${fieldPath}: ${issue.message}`);
				}
				if (parsed.success) try {
					await bootstrapInMemory();
					await buildFromSpecInMemory(parsed.data, specPath);
				} catch (err) {
					const msg = err instanceof Error ? err.message : String(err);
					allErrors.push(msg);
				}
				if (allErrors.length > 0) throw new CliError(`Spec validation failed with ${allErrors.length} error(s):\n` + allErrors.map((e, i) => `  ${i + 1}. ${e}`).join("\n"), ExitCode.INPUT_ERROR, "E_INPUT");
				if (options.json) console.log(JSON.stringify({ valid: true }));
				else console.log("✓ Spec is valid.");
				return;
			}
			case "build": {
				if (!specPath) throw new CliError("build requires spec.json file path", ExitCode.INPUT_ERROR, "E_INPUT");
				let raw;
				try {
					raw = await fs$1.readFile(specPath, "utf-8");
				} catch (e) {
					throw new CliError(`Failed to read spec file: ${e instanceof Error ? e.message : String(e)}`, ExitCode.INPUT_ERROR, "E_INPUT");
				}
				let spec;
				try {
					spec = JSON.parse(raw);
				} catch {
					throw new CliError("Invalid JSON in spec file", ExitCode.INPUT_ERROR, "E_INPUT");
				}
				await bootstrapInMemory();
				try {
					const build = await buildFromSpecInMemory(spec, specPath);
					if (options.json) console.log(JSON.stringify({
						canvasId: build.canvasId,
						nodes: Object.keys(build.nodeIds)
					}));
					else {
						console.log(`✓ Built canvas ${build.canvasId} in-memory successfully.`);
						console.log(build.engine.inspect());
					}
				} catch (err) {
					throw new CliError(`Build graph error: ${err instanceof Error ? err.message : String(err)}`, ExitCode.GRAPH_ERROR, "E_GRAPH");
				}
				return;
			}
			case "run": {
				if (!specPath) throw new CliError("run requires spec.json file path", ExitCode.INPUT_ERROR, "E_INPUT");
				let raw;
				try {
					raw = await fs$1.readFile(specPath, "utf-8");
				} catch (e) {
					throw new CliError(`Failed to read spec file: ${e instanceof Error ? e.message : String(e)}`, ExitCode.INPUT_ERROR, "E_INPUT");
				}
				let spec;
				try {
					spec = JSON.parse(raw);
				} catch {
					throw new CliError("Invalid JSON in spec file", ExitCode.INPUT_ERROR, "E_INPUT");
				}
				const parsedSpec = CanvasSpecSchema.parse(spec);
				await bootstrapInMemory();
				await loadFonts(specPath, parsedSpec.fonts);
				const build = await buildFromSpecInMemory(parsedSpec, specPath);
				if (options.fromState) try {
					const rawState = await fs$1.readFile(options.fromState, "utf-8");
					applyStateToBuild(build, JSON.parse(rawState));
				} catch (err) {
					throw new CliError(`Failed to load compatible state from ${options.fromState}: ${err instanceof Error ? err.message : String(err)}`, ExitCode.INPUT_ERROR, "E_INPUT");
				}
				let targetEngineIds;
				if (options.node) {
					const targetSpecIds = options.node.split(",").map((s) => s.trim()).filter(Boolean);
					targetEngineIds = [];
					for (const specId of targetSpecIds) {
						const engineId = build.nodeIds[specId];
						if (!engineId) throw new CliError(`Target node "${specId}" not found in spec.`, ExitCode.GRAPH_ERROR, "E_GRAPH");
						const node$1 = build.engine.findNode(engineId);
						if (!node$1 || !build.terminalTypes.has(node$1.type)) throw new CliError(`Only terminal nodes can be selected for run. Node "${specId}" is not a terminal node.`, ExitCode.INPUT_ERROR, "E_INPUT");
						targetEngineIds.push(engineId);
					}
				}
				let runResult;
				let runError;
				try {
					runResult = await runInMemory(build, targetEngineIds);
				} catch (err) {
					runError = err;
					const results = {};
					for (const node$1 of build.engine.getNodes()) if (node$1.result) results[node$1.id] = node$1.result;
					runResult = {
						canvasId: build.canvasId,
						results,
						nodeIds: build.nodeIds,
						specFingerprint: build.specFingerprint
					};
				}
				const filteredResults = {};
				for (const [specId, engineId] of Object.entries(runResult.nodeIds)) {
					const specNode = parsedSpec.nodes.find((n) => n.id === specId);
					if (specNode && build.terminalTypes.has(specNode.type)) {
						const result = runResult.results[engineId];
						if (result) filteredResults[engineId] = result;
					}
				}
				const outputData = {
					canvasId: runResult.canvasId,
					results: filteredResults,
					nodeIds: runResult.nodeIds,
					specFingerprint: build.specFingerprint
				};
				const storage = container.get(TOKENS.STORAGE);
				for (const nodeSpec of parsedSpec.nodes) {
					if (nodeSpec.type !== "Export") continue;
					const engineId = build.nodeIds[nodeSpec.id];
					if (!engineId) continue;
					const nodeResult = runResult.results[engineId];
					if (!nodeResult) continue;
					const outputItem = nodeResult.outputs?.[nodeResult.selectedOutputIndex ?? 0]?.items?.[0];
					if (!outputItem) continue;
					const itemData = outputItem.data;
					const key = itemData?.operation?.source?.entity?.key ?? itemData?.entity?.key ?? itemData?.key ?? itemData?.source?.entity?.key ?? outputItem?.fileKey;
					const nodeConfig = nodeSpec.config ?? {};
					const format = nodeConfig.format ?? "mp4";
					const ext = format === "mp3" ? "mp3" : format === "gif" ? "gif" : format === "webm" ? "webm" : "mp4";
					const defaultFile = outputItem.type === "Image" ? "output.png" : `output.${ext}`;
					const targetFile = nodeConfig.file ?? defaultFile;
					const absoluteOut = path.resolve(targetFile);
					try {
						let buffer;
						if (key) buffer = await storage.getFromStorage(key);
						else if (Buffer.isBuffer(itemData)) buffer = itemData;
						else if (typeof itemData === "string") buffer = Buffer.from(itemData);
						if (buffer) {
							await fs$1.mkdir(path.dirname(absoluteOut), { recursive: true });
							await fs$1.writeFile(absoluteOut, buffer);
							if (!options.json) console.log(`✓ Exported node "${nodeSpec.id}" result to: ${absoluteOut}`);
						}
					} catch (err) {
						console.error(`[run] Failed to write exported node "${nodeSpec.id}" file:`, err);
					}
				}
				if (options.state) {
					await fs$1.writeFile(options.state, JSON.stringify(outputData, null, 2));
					if (!options.json) console.log(`✓ State saved to ${options.state}`);
				}
				if (runError) throw runError;
				if (options.json && !options.state) console.log(JSON.stringify(outputData));
				else if (!options.json && !options.state) {
					console.log(`✓ Ran canvas ${runResult.canvasId} successfully.`);
					for (const [id] of Object.entries(runResult.results)) console.log(`  Node ${id}: result generated.`);
				}
				return;
			}
			default: throw new CliError(`Unknown command "${command}". Run 'artifex help'.`, ExitCode.INPUT_ERROR, "E_INPUT");
		}
	} catch (err) {
		handleCliError(err, options.json);
	}
}

//#endregion
export { main };