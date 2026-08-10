import { o as __toESM } from "./chunk-DPkJJFeX.mjs";
import { O as createVirtualMedia, a as TOKENS, c as logger, j as generateId, k as extractSvgDimensions, n as ENV_CONFIG, o as container, r as GetAssetEndpointBackend, s as getAssetKey, u as mediaLogger } from "./dist-D9o3ES2C.mjs";
import { n as prisma } from "./dist-BtS_watq.mjs";
import { t as require_src } from "./src-goQ_UXNy.mjs";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { inject, injectable, postConstruct } from "inversify";
import assert from "node:assert";
import { createRequire } from "module";
import sharp from "sharp";
import { spawn } from "node:child_process";

//#region ../../node_modules/.pnpm/fflate@0.8.2/node_modules/fflate/esm/index.mjs
var require = createRequire("/");
var Worker;
try {
	Worker = require("worker_threads").Worker;
} catch (e) {}
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
var fleb = new u8([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0,
	0,
	0,
	0
]);
var fdeb = new u8([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13,
	0,
	0
]);
var clim = new u8([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]);
var freb = function(eb, start) {
	var b = new u16(31);
	for (var i$1 = 0; i$1 < 31; ++i$1) b[i$1] = start += 1 << eb[i$1 - 1];
	var r = new i32(b[30]);
	for (var i$1 = 1; i$1 < 30; ++i$1) for (var j = b[i$1]; j < b[i$1 + 1]; ++j) r[j] = j - b[i$1] << 5 | i$1;
	return {
		b,
		r
	};
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
	var x = (i & 43690) >> 1 | (i & 21845) << 1;
	x = (x & 52428) >> 2 | (x & 13107) << 2;
	x = (x & 61680) >> 4 | (x & 3855) << 4;
	rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var hMap = (function(cd, mb, r) {
	var s = cd.length;
	var i$1 = 0;
	var l = new u16(mb);
	for (; i$1 < s; ++i$1) if (cd[i$1]) ++l[cd[i$1] - 1];
	var le = new u16(mb);
	for (i$1 = 1; i$1 < mb; ++i$1) le[i$1] = le[i$1 - 1] + l[i$1 - 1] << 1;
	var co;
	if (r) {
		co = new u16(1 << mb);
		var rvb = 15 - mb;
		for (i$1 = 0; i$1 < s; ++i$1) if (cd[i$1]) {
			var sv = i$1 << 4 | cd[i$1];
			var r_1 = mb - cd[i$1];
			var v = le[cd[i$1] - 1]++ << r_1;
			for (var m = v | (1 << r_1) - 1; v <= m; ++v) co[rev[v] >> rvb] = sv;
		}
	} else {
		co = new u16(s);
		for (i$1 = 0; i$1 < s; ++i$1) if (cd[i$1]) co[i$1] = rev[le[cd[i$1] - 1]++] >> 15 - cd[i$1];
	}
	return co;
});
var flt = new u8(288);
for (var i = 0; i < 144; ++i) flt[i] = 8;
for (var i = 144; i < 256; ++i) flt[i] = 9;
for (var i = 256; i < 280; ++i) flt[i] = 7;
for (var i = 280; i < 288; ++i) flt[i] = 8;
var fdt = new u8(32);
for (var i = 0; i < 32; ++i) fdt[i] = 5;
var flm = /* @__PURE__ */ hMap(flt, 9, 0), flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0), fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
	var m = a[0];
	for (var i$1 = 1; i$1 < a.length; ++i$1) if (a[i$1] > m) m = a[i$1];
	return m;
};
var bits = function(d, p, m) {
	var o = p / 8 | 0;
	return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
	var o = p / 8 | 0;
	return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
	return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
	if (s == null || s < 0) s = 0;
	if (e == null || e > v.length) e = v.length;
	return new u8(v.subarray(s, e));
};
var ec = [
	"unexpected EOF",
	"invalid block type",
	"invalid length/literal",
	"invalid distance",
	"stream finished",
	"no stream handler",
	,
	"no callback",
	"invalid UTF-8 data",
	"extra field too long",
	"date not in range 1980-2099",
	"filename too long",
	"stream finishing",
	"invalid zip data"
];
var err = function(ind, msg, nt) {
	var e = new Error(msg || ec[ind]);
	e.code = ind;
	if (Error.captureStackTrace) Error.captureStackTrace(e, err);
	if (!nt) throw e;
	return e;
};
var inflt = function(dat, st, buf, dict) {
	var sl = dat.length, dl = dict ? dict.length : 0;
	if (!sl || st.f && !st.l) return buf || new u8(0);
	var noBuf = !buf;
	var resize = noBuf || st.i != 2;
	var noSt = st.i;
	if (noBuf) buf = new u8(sl * 3);
	var cbuf = function(l$1) {
		var bl = buf.length;
		if (l$1 > bl) {
			var nbuf = new u8(Math.max(bl * 2, l$1));
			nbuf.set(buf);
			buf = nbuf;
		}
	};
	var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
	var tbts = sl * 8;
	do {
		if (!lm) {
			final = bits(dat, pos, 1);
			var type = bits(dat, pos + 1, 3);
			pos += 3;
			if (!type) {
				var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
				if (t > sl) {
					if (noSt) err(0);
					break;
				}
				if (resize) cbuf(bt + l);
				buf.set(dat.subarray(s, t), bt);
				st.b = bt += l, st.p = pos = t * 8, st.f = final;
				continue;
			} else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
			else if (type == 2) {
				var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
				var tl = hLit + bits(dat, pos + 5, 31) + 1;
				pos += 14;
				var ldt = new u8(tl);
				var clt = new u8(19);
				for (var i$1 = 0; i$1 < hcLen; ++i$1) clt[clim[i$1]] = bits(dat, pos + i$1 * 3, 7);
				pos += hcLen * 3;
				var clb = max(clt), clbmsk = (1 << clb) - 1;
				var clm = hMap(clt, clb, 1);
				for (var i$1 = 0; i$1 < tl;) {
					var r = clm[bits(dat, pos, clbmsk)];
					pos += r & 15;
					var s = r >> 4;
					if (s < 16) ldt[i$1++] = s;
					else {
						var c = 0, n = 0;
						if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i$1 - 1];
						else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;
						else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;
						while (n--) ldt[i$1++] = c;
					}
				}
				var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
				lbt = max(lt);
				dbt = max(dt);
				lm = hMap(lt, lbt, 1);
				dm = hMap(dt, dbt, 1);
			} else err(1);
			if (pos > tbts) {
				if (noSt) err(0);
				break;
			}
		}
		if (resize) cbuf(bt + 131072);
		var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
		var lpos = pos;
		for (;; lpos = pos) {
			var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
			pos += c & 15;
			if (pos > tbts) {
				if (noSt) err(0);
				break;
			}
			if (!c) err(2);
			if (sym < 256) buf[bt++] = sym;
			else if (sym == 256) {
				lpos = pos, lm = null;
				break;
			} else {
				var add = sym - 254;
				if (sym > 264) {
					var i$1 = sym - 257, b = fleb[i$1];
					add = bits(dat, pos, (1 << b) - 1) + fl[i$1];
					pos += b;
				}
				var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
				if (!d) err(3);
				pos += d & 15;
				var dt = fd[dsym];
				if (dsym > 3) {
					var b = fdeb[dsym];
					dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
				}
				if (pos > tbts) {
					if (noSt) err(0);
					break;
				}
				if (resize) cbuf(bt + 131072);
				var end = bt + add;
				if (bt < dt) {
					var shift = dl - dt, dend = Math.min(dt, end);
					if (shift + bt < 0) err(3);
					for (; bt < dend; ++bt) buf[bt] = dict[shift + bt];
				}
				for (; bt < end; ++bt) buf[bt] = buf[bt - dt];
			}
		}
		st.l = lm, st.p = lpos, st.b = bt, st.f = final;
		if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
	} while (!final);
	return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
	return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
	return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
	return b4(d, b) + b4(d, b + 4) * 4294967296;
};
/**
* Expands DEFLATE data with no wrapper
* @param data The data to decompress
* @param opts The decompression options
* @returns The decompressed version of the data
*/
function inflateSync(data, opts) {
	return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
	td.decode(et, { stream: true });
	tds = 1;
} catch (e) {}
var dutf8 = function(d) {
	for (var r = "", i$1 = 0;;) {
		var c = d[i$1++];
		var eb = (c > 127) + (c > 223) + (c > 239);
		if (i$1 + eb > d.length) return {
			s: r,
			r: slc(d, i$1 - 1)
		};
		if (!eb) r += String.fromCharCode(c);
		else if (eb == 3) c = ((c & 15) << 18 | (d[i$1++] & 63) << 12 | (d[i$1++] & 63) << 6 | d[i$1++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
		else if (eb & 1) r += String.fromCharCode((c & 31) << 6 | d[i$1++] & 63);
		else r += String.fromCharCode((c & 15) << 12 | (d[i$1++] & 63) << 6 | d[i$1++] & 63);
	}
};
/**
* Converts a Uint8Array to a string
* @param dat The data to decode to string
* @param latin1 Whether or not to interpret the data as Latin-1. This should
*               not need to be true unless encoding to binary string.
* @returns The original UTF-8/Latin-1 string
*/
function strFromU8(dat, latin1) {
	if (latin1) {
		var r = "";
		for (var i$1 = 0; i$1 < dat.length; i$1 += 16384) r += String.fromCharCode.apply(null, dat.subarray(i$1, i$1 + 16384));
		return r;
	} else if (td) return td.decode(dat);
	else {
		var _a$1 = dutf8(dat), s = _a$1.s, r = _a$1.r;
		if (r.length) err(8);
		return s;
	}
}
var slzh = function(d, b) {
	return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
	var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
	var _a$1 = z && bs == 4294967295 ? z64e(d, es) : [
		bs,
		b4(d, b + 24),
		b4(d, b + 42)
	], sc = _a$1[0], su = _a$1[1], off = _a$1[2];
	return [
		b2(d, b + 10),
		sc,
		su,
		fn,
		es + b2(d, b + 30) + b2(d, b + 32),
		off
	];
};
var z64e = function(d, b) {
	for (; b2(d, b) != 1; b += 4 + b2(d, b + 2));
	return [
		b8(d, b + 12),
		b8(d, b + 4),
		b8(d, b + 20)
	];
};
/**
* Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
* performance with more than one file.
* @param data The raw compressed ZIP file
* @param opts The ZIP extraction options
* @returns The decompressed files
*/
function unzipSync(data, opts) {
	var files = {};
	var e = data.length - 22;
	for (; b4(data, e) != 101010256; --e) if (!e || data.length - e > 65558) err(13);
	var c = b2(data, e + 8);
	if (!c) return {};
	var o = b4(data, e + 16);
	var z = o == 4294967295 || c == 65535;
	if (z) {
		var ze = b4(data, e - 12);
		z = b4(data, ze) == 101075792;
		if (z) {
			c = b4(data, ze + 32);
			o = b4(data, ze + 48);
		}
	}
	var fltr = opts && opts.filter;
	for (var i$1 = 0; i$1 < c; ++i$1) {
		var _a$1 = zh(data, o, z), c_2 = _a$1[0], sc = _a$1[1], su = _a$1[2], fn = _a$1[3], no = _a$1[4], off = _a$1[5], b = slzh(data, off);
		o = no;
		if (!fltr || fltr({
			name: fn,
			size: sc,
			originalSize: su,
			compression: c_2
		})) if (!c_2) files[fn] = slc(data, b, b + sc);
		else if (c_2 == 8) files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
		else err(14, "unknown compression type " + c_2);
	}
	return files;
}

//#endregion
//#region ../../node_modules/.pnpm/@borewit+text-codec@0.2.1/node_modules/@borewit/text-codec/lib/index.js
const WINDOWS_1252_EXTRA = {
	128: "€",
	130: "‚",
	131: "ƒ",
	132: "„",
	133: "…",
	134: "†",
	135: "‡",
	136: "ˆ",
	137: "‰",
	138: "Š",
	139: "‹",
	140: "Œ",
	142: "Ž",
	145: "‘",
	146: "’",
	147: "“",
	148: "”",
	149: "•",
	150: "–",
	151: "—",
	152: "˜",
	153: "™",
	154: "š",
	155: "›",
	156: "œ",
	158: "ž",
	159: "Ÿ"
};
const WINDOWS_1252_REVERSE = {};
for (const [code, char] of Object.entries(WINDOWS_1252_EXTRA)) WINDOWS_1252_REVERSE[char] = Number.parseInt(code, 10);
let _utf8Decoder;
function utf8Decoder() {
	if (typeof globalThis.TextDecoder === "undefined") return void 0;
	return _utf8Decoder !== null && _utf8Decoder !== void 0 ? _utf8Decoder : _utf8Decoder = new globalThis.TextDecoder("utf-8");
}
const CHUNK = 32 * 1024;
/**
* Decode text from binary data
* @param bytes Binary data
* @param encoding Encoding
*/
function textDecode(bytes, encoding = "utf-8") {
	switch (encoding.toLowerCase()) {
		case "utf-8":
		case "utf8": {
			const dec = utf8Decoder();
			return dec ? dec.decode(bytes) : decodeUTF8(bytes);
		}
		case "utf-16le": return decodeUTF16LE(bytes);
		case "us-ascii":
		case "ascii": return decodeASCII(bytes);
		case "latin1":
		case "iso-8859-1": return decodeLatin1(bytes);
		case "windows-1252": return decodeWindows1252(bytes);
		default: throw new RangeError(`Encoding '${encoding}' not supported`);
	}
}
function decodeUTF8(bytes) {
	const parts = [];
	let out = "";
	let i$1 = 0;
	while (i$1 < bytes.length) {
		const b1 = bytes[i$1++];
		if (b1 < 128) out += String.fromCharCode(b1);
		else if (b1 < 224) {
			const b2$1 = bytes[i$1++] & 63;
			out += String.fromCharCode((b1 & 31) << 6 | b2$1);
		} else if (b1 < 240) {
			const b2$1 = bytes[i$1++] & 63;
			const b3 = bytes[i$1++] & 63;
			out += String.fromCharCode((b1 & 15) << 12 | b2$1 << 6 | b3);
		} else {
			const b2$1 = bytes[i$1++] & 63;
			const b3 = bytes[i$1++] & 63;
			const b4$1 = bytes[i$1++] & 63;
			let cp = (b1 & 7) << 18 | b2$1 << 12 | b3 << 6 | b4$1;
			cp -= 65536;
			out += String.fromCharCode(55296 + (cp >> 10 & 1023), 56320 + (cp & 1023));
		}
		if (out.length >= CHUNK) {
			parts.push(out);
			out = "";
		}
	}
	if (out) parts.push(out);
	return parts.join("");
}
function decodeUTF16LE(bytes) {
	const len = bytes.length & -2;
	if (len === 0) return "";
	const parts = [];
	const maxUnits = CHUNK;
	for (let i$1 = 0; i$1 < len;) {
		const unitsThis = Math.min(maxUnits, len - i$1 >> 1);
		const units = new Array(unitsThis);
		for (let j = 0; j < unitsThis; j++, i$1 += 2) units[j] = bytes[i$1] | bytes[i$1 + 1] << 8;
		parts.push(String.fromCharCode.apply(null, units));
	}
	return parts.join("");
}
function decodeASCII(bytes) {
	const parts = [];
	for (let i$1 = 0; i$1 < bytes.length; i$1 += CHUNK) {
		const end = Math.min(bytes.length, i$1 + CHUNK);
		const codes = new Array(end - i$1);
		for (let j = i$1, k = 0; j < end; j++, k++) codes[k] = bytes[j] & 127;
		parts.push(String.fromCharCode.apply(null, codes));
	}
	return parts.join("");
}
function decodeLatin1(bytes) {
	const parts = [];
	for (let i$1 = 0; i$1 < bytes.length; i$1 += CHUNK) {
		const end = Math.min(bytes.length, i$1 + CHUNK);
		const codes = new Array(end - i$1);
		for (let j = i$1, k = 0; j < end; j++, k++) codes[k] = bytes[j];
		parts.push(String.fromCharCode.apply(null, codes));
	}
	return parts.join("");
}
function decodeWindows1252(bytes) {
	const parts = [];
	let out = "";
	for (let i$1 = 0; i$1 < bytes.length; i$1++) {
		const b = bytes[i$1];
		const extra = b >= 128 && b <= 159 ? WINDOWS_1252_EXTRA[b] : void 0;
		out += extra !== null && extra !== void 0 ? extra : String.fromCharCode(b);
		if (out.length >= CHUNK) {
			parts.push(out);
			out = "";
		}
	}
	if (out) parts.push(out);
	return parts.join("");
}

//#endregion
//#region ../../node_modules/.pnpm/token-types@6.1.2/node_modules/token-types/lib/index.js
function dv(array) {
	return new DataView(array.buffer, array.byteOffset);
}
const UINT8 = {
	len: 1,
	get(array, offset) {
		return dv(array).getUint8(offset);
	},
	put(array, offset, value) {
		dv(array).setUint8(offset, value);
		return offset + 1;
	}
};
/**
* 16-bit unsigned integer, Little Endian byte order
*/
const UINT16_LE = {
	len: 2,
	get(array, offset) {
		return dv(array).getUint16(offset, true);
	},
	put(array, offset, value) {
		dv(array).setUint16(offset, value, true);
		return offset + 2;
	}
};
/**
* 16-bit unsigned integer, Big Endian byte order
*/
const UINT16_BE = {
	len: 2,
	get(array, offset) {
		return dv(array).getUint16(offset);
	},
	put(array, offset, value) {
		dv(array).setUint16(offset, value);
		return offset + 2;
	}
};
/**
* 32-bit unsigned integer, Little Endian byte order
*/
const UINT32_LE = {
	len: 4,
	get(array, offset) {
		return dv(array).getUint32(offset, true);
	},
	put(array, offset, value) {
		dv(array).setUint32(offset, value, true);
		return offset + 4;
	}
};
/**
* 32-bit unsigned integer, Big Endian byte order
*/
const UINT32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getUint32(offset);
	},
	put(array, offset, value) {
		dv(array).setUint32(offset, value);
		return offset + 4;
	}
};
/**
* 32-bit signed integer, Big Endian byte order
*/
const INT32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getInt32(offset);
	},
	put(array, offset, value) {
		dv(array).setInt32(offset, value);
		return offset + 4;
	}
};
/**
* 64-bit unsigned integer, Little Endian byte order
*/
const UINT64_LE = {
	len: 8,
	get(array, offset) {
		return dv(array).getBigUint64(offset, true);
	},
	put(array, offset, value) {
		dv(array).setBigUint64(offset, value, true);
		return offset + 8;
	}
};
/**
* Consume a fixed number of bytes from the stream and return a string with a specified encoding.
* Supports all encodings supported by TextDecoder, plus 'windows-1252'.
*/
var StringType = class {
	constructor(len, encoding) {
		this.len = len;
		this.encoding = encoding;
	}
	get(data, offset = 0) {
		return textDecode(data.subarray(offset, offset + this.len), this.encoding);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/Errors.js
const defaultMessages = "End-Of-Stream";
/**
* Thrown on read operation of the end of file or stream has been reached
*/
var EndOfStreamError = class extends Error {
	constructor() {
		super(defaultMessages);
		this.name = "EndOfStreamError";
	}
};
var AbortError = class extends Error {
	constructor(message = "The operation was aborted") {
		super(message);
		this.name = "AbortError";
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/AbstractStreamReader.js
var AbstractStreamReader = class {
	constructor() {
		this.endOfStream = false;
		this.interrupted = false;
		/**
		* Store peeked data
		* @type {Array}
		*/
		this.peekQueue = [];
	}
	async peek(uint8Array, mayBeLess = false) {
		const bytesRead = await this.read(uint8Array, mayBeLess);
		this.peekQueue.push(uint8Array.subarray(0, bytesRead));
		return bytesRead;
	}
	async read(buffer, mayBeLess = false) {
		if (buffer.length === 0) return 0;
		let bytesRead = this.readFromPeekBuffer(buffer);
		if (!this.endOfStream) bytesRead += await this.readRemainderFromStream(buffer.subarray(bytesRead), mayBeLess);
		if (bytesRead === 0 && !mayBeLess) throw new EndOfStreamError();
		return bytesRead;
	}
	/**
	* Read chunk from stream
	* @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
	* @returns Number of bytes read
	*/
	readFromPeekBuffer(buffer) {
		let remaining = buffer.length;
		let bytesRead = 0;
		while (this.peekQueue.length > 0 && remaining > 0) {
			const peekData = this.peekQueue.pop();
			if (!peekData) throw new Error("peekData should be defined");
			const lenCopy = Math.min(peekData.length, remaining);
			buffer.set(peekData.subarray(0, lenCopy), bytesRead);
			bytesRead += lenCopy;
			remaining -= lenCopy;
			if (lenCopy < peekData.length) this.peekQueue.push(peekData.subarray(lenCopy));
		}
		return bytesRead;
	}
	async readRemainderFromStream(buffer, mayBeLess) {
		let bytesRead = 0;
		while (bytesRead < buffer.length && !this.endOfStream) {
			if (this.interrupted) throw new AbortError();
			const chunkLen = await this.readFromStream(buffer.subarray(bytesRead), mayBeLess);
			if (chunkLen === 0) break;
			bytesRead += chunkLen;
		}
		if (!mayBeLess && bytesRead < buffer.length) throw new EndOfStreamError();
		return bytesRead;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamReader.js
var WebStreamReader = class extends AbstractStreamReader {
	constructor(reader) {
		super();
		this.reader = reader;
	}
	async abort() {
		return this.close();
	}
	async close() {
		this.reader.releaseLock();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamByobReader.js
/**
* Read from a WebStream using a BYOB reader
* Reference: https://nodejs.org/api/webstreams.html#class-readablestreambyobreader
*/
var WebStreamByobReader = class extends WebStreamReader {
	/**
	* Read from stream
	* @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
	* @param mayBeLess - If true, may fill the buffer partially
	* @protected Bytes read
	*/
	async readFromStream(buffer, mayBeLess) {
		if (buffer.length === 0) return 0;
		const result = await this.reader.read(new Uint8Array(buffer.length), { min: mayBeLess ? void 0 : buffer.length });
		if (result.done) this.endOfStream = result.done;
		if (result.value) {
			buffer.set(result.value);
			return result.value.length;
		}
		return 0;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamDefaultReader.js
var WebStreamDefaultReader = class extends AbstractStreamReader {
	constructor(reader) {
		super();
		this.reader = reader;
		this.buffer = null;
	}
	/**
	* Copy chunk to target, and store the remainder in this.buffer
	*/
	writeChunk(target, chunk) {
		const written = Math.min(chunk.length, target.length);
		target.set(chunk.subarray(0, written));
		if (written < chunk.length) this.buffer = chunk.subarray(written);
		else this.buffer = null;
		return written;
	}
	/**
	* Read from stream
	* @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
	* @param mayBeLess - If true, may fill the buffer partially
	* @protected Bytes read
	*/
	async readFromStream(buffer, mayBeLess) {
		if (buffer.length === 0) return 0;
		let totalBytesRead = 0;
		if (this.buffer) totalBytesRead += this.writeChunk(buffer, this.buffer);
		while (totalBytesRead < buffer.length && !this.endOfStream) {
			const result = await this.reader.read();
			if (result.done) {
				this.endOfStream = true;
				break;
			}
			if (result.value) totalBytesRead += this.writeChunk(buffer.subarray(totalBytesRead), result.value);
		}
		if (!mayBeLess && totalBytesRead === 0 && this.endOfStream) throw new EndOfStreamError();
		return totalBytesRead;
	}
	abort() {
		this.interrupted = true;
		return this.reader.cancel();
	}
	async close() {
		await this.abort();
		this.reader.releaseLock();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamReaderFactory.js
function makeWebStreamReader(stream) {
	try {
		const reader = stream.getReader({ mode: "byob" });
		if (reader instanceof ReadableStreamDefaultReader) return new WebStreamDefaultReader(reader);
		return new WebStreamByobReader(reader);
	} catch (error) {
		if (error instanceof TypeError) return new WebStreamDefaultReader(stream.getReader());
		throw error;
	}
}

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/AbstractTokenizer.js
/**
* Core tokenizer
*/
var AbstractTokenizer = class {
	/**
	* Constructor
	* @param options Tokenizer options
	* @protected
	*/
	constructor(options) {
		this.numBuffer = new Uint8Array(8);
		/**
		* Tokenizer-stream position
		*/
		this.position = 0;
		this.onClose = options?.onClose;
		if (options?.abortSignal) options.abortSignal.addEventListener("abort", () => {
			this.abort();
		});
	}
	/**
	* Read a token from the tokenizer-stream
	* @param token - The token to read
	* @param position - If provided, the desired position in the tokenizer-stream
	* @returns Promise with token data
	*/
	async readToken(token, position = this.position) {
		const uint8Array = new Uint8Array(token.len);
		if (await this.readBuffer(uint8Array, { position }) < token.len) throw new EndOfStreamError();
		return token.get(uint8Array, 0);
	}
	/**
	* Peek a token from the tokenizer-stream.
	* @param token - Token to peek from the tokenizer-stream.
	* @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
	* @returns Promise with token data
	*/
	async peekToken(token, position = this.position) {
		const uint8Array = new Uint8Array(token.len);
		if (await this.peekBuffer(uint8Array, { position }) < token.len) throw new EndOfStreamError();
		return token.get(uint8Array, 0);
	}
	/**
	* Read a numeric token from the stream
	* @param token - Numeric token
	* @returns Promise with number
	*/
	async readNumber(token) {
		if (await this.readBuffer(this.numBuffer, { length: token.len }) < token.len) throw new EndOfStreamError();
		return token.get(this.numBuffer, 0);
	}
	/**
	* Read a numeric token from the stream
	* @param token - Numeric token
	* @returns Promise with number
	*/
	async peekNumber(token) {
		if (await this.peekBuffer(this.numBuffer, { length: token.len }) < token.len) throw new EndOfStreamError();
		return token.get(this.numBuffer, 0);
	}
	/**
	* Ignore number of bytes, advances the pointer in under tokenizer-stream.
	* @param length - Number of bytes to ignore.  Must be ≥ 0.
	* @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
	*/
	async ignore(length) {
		if (length < 0) throw new RangeError("ignore length must be ≥ 0 bytes");
		if (this.fileInfo.size !== void 0) {
			const bytesLeft = this.fileInfo.size - this.position;
			if (length > bytesLeft) {
				this.position += bytesLeft;
				return bytesLeft;
			}
		}
		this.position += length;
		return length;
	}
	async close() {
		await this.abort();
		await this.onClose?.();
	}
	normalizeOptions(uint8Array, options) {
		if (!this.supportsRandomAccess() && options && options.position !== void 0 && options.position < this.position) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
		return {
			mayBeLess: false,
			offset: 0,
			length: uint8Array.length,
			position: this.position,
			...options
		};
	}
	abort() {
		return Promise.resolve();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/ReadStreamTokenizer.js
const maxBufferSize = 256e3;
var ReadStreamTokenizer = class extends AbstractTokenizer {
	/**
	* Constructor
	* @param streamReader stream-reader to read from
	* @param options Tokenizer options
	*/
	constructor(streamReader, options) {
		super(options);
		this.streamReader = streamReader;
		this.fileInfo = options?.fileInfo ?? {};
	}
	/**
	* Read buffer from tokenizer
	* @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
	* @param options - Read behaviour options
	* @returns Promise with number of bytes read
	*/
	async readBuffer(uint8Array, options) {
		const normOptions = this.normalizeOptions(uint8Array, options);
		const skipBytes = normOptions.position - this.position;
		if (skipBytes > 0) {
			await this.ignore(skipBytes);
			return this.readBuffer(uint8Array, options);
		}
		if (skipBytes < 0) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
		if (normOptions.length === 0) return 0;
		const bytesRead = await this.streamReader.read(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
		this.position += bytesRead;
		if ((!options || !options.mayBeLess) && bytesRead < normOptions.length) throw new EndOfStreamError();
		return bytesRead;
	}
	/**
	* Peek (read ahead) buffer from tokenizer
	* @param uint8Array - Uint8Array (or Buffer) to write data to
	* @param options - Read behaviour options
	* @returns Promise with number of bytes peeked
	*/
	async peekBuffer(uint8Array, options) {
		const normOptions = this.normalizeOptions(uint8Array, options);
		let bytesRead = 0;
		if (normOptions.position) {
			const skipBytes = normOptions.position - this.position;
			if (skipBytes > 0) {
				const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
				bytesRead = await this.peekBuffer(skipBuffer, { mayBeLess: normOptions.mayBeLess });
				uint8Array.set(skipBuffer.subarray(skipBytes));
				return bytesRead - skipBytes;
			}
			if (skipBytes < 0) throw new Error("Cannot peek from a negative offset in a stream");
		}
		if (normOptions.length > 0) {
			try {
				bytesRead = await this.streamReader.peek(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
			} catch (err$1) {
				if (options?.mayBeLess && err$1 instanceof EndOfStreamError) return 0;
				throw err$1;
			}
			if (!normOptions.mayBeLess && bytesRead < normOptions.length) throw new EndOfStreamError();
		}
		return bytesRead;
	}
	/**
	* @param length Number of bytes to ignore. Must be ≥ 0.
	*/
	async ignore(length) {
		if (length < 0) throw new RangeError("ignore length must be ≥ 0 bytes");
		const bufSize = Math.min(maxBufferSize, length);
		const buf = new Uint8Array(bufSize);
		let totBytesRead = 0;
		while (totBytesRead < length) {
			const remaining = length - totBytesRead;
			const bytesRead = await this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
			if (bytesRead < 0) return bytesRead;
			totBytesRead += bytesRead;
		}
		return totBytesRead;
	}
	abort() {
		return this.streamReader.abort();
	}
	async close() {
		return this.streamReader.close();
	}
	supportsRandomAccess() {
		return false;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/BufferTokenizer.js
var BufferTokenizer = class extends AbstractTokenizer {
	/**
	* Construct BufferTokenizer
	* @param uint8Array - Uint8Array to tokenize
	* @param options Tokenizer options
	*/
	constructor(uint8Array, options) {
		super(options);
		this.uint8Array = uint8Array;
		this.fileInfo = {
			...options?.fileInfo ?? {},
			size: uint8Array.length
		};
	}
	/**
	* Read buffer from tokenizer
	* @param uint8Array - Uint8Array to tokenize
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async readBuffer(uint8Array, options) {
		if (options?.position) this.position = options.position;
		const bytesRead = await this.peekBuffer(uint8Array, options);
		this.position += bytesRead;
		return bytesRead;
	}
	/**
	* Peek (read ahead) buffer from tokenizer
	* @param uint8Array
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async peekBuffer(uint8Array, options) {
		const normOptions = this.normalizeOptions(uint8Array, options);
		const bytes2read = Math.min(this.uint8Array.length - normOptions.position, normOptions.length);
		if (!normOptions.mayBeLess && bytes2read < normOptions.length) throw new EndOfStreamError();
		uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read));
		return bytes2read;
	}
	close() {
		return super.close();
	}
	supportsRandomAccess() {
		return true;
	}
	setPosition(position) {
		this.position = position;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/BlobTokenizer.js
var BlobTokenizer = class extends AbstractTokenizer {
	/**
	* Construct BufferTokenizer
	* @param blob - Uint8Array to tokenize
	* @param options Tokenizer options
	*/
	constructor(blob, options) {
		super(options);
		this.blob = blob;
		this.fileInfo = {
			...options?.fileInfo ?? {},
			size: blob.size,
			mimeType: blob.type
		};
	}
	/**
	* Read buffer from tokenizer
	* @param uint8Array - Uint8Array to tokenize
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async readBuffer(uint8Array, options) {
		if (options?.position) this.position = options.position;
		const bytesRead = await this.peekBuffer(uint8Array, options);
		this.position += bytesRead;
		return bytesRead;
	}
	/**
	* Peek (read ahead) buffer from tokenizer
	* @param buffer
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async peekBuffer(buffer, options) {
		const normOptions = this.normalizeOptions(buffer, options);
		const bytes2read = Math.min(this.blob.size - normOptions.position, normOptions.length);
		if (!normOptions.mayBeLess && bytes2read < normOptions.length) throw new EndOfStreamError();
		const arrayBuffer = await this.blob.slice(normOptions.position, normOptions.position + bytes2read).arrayBuffer();
		buffer.set(new Uint8Array(arrayBuffer));
		return bytes2read;
	}
	close() {
		return super.close();
	}
	supportsRandomAccess() {
		return true;
	}
	setPosition(position) {
		this.position = position;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/core.js
/**
* Construct ReadStreamTokenizer from given ReadableStream (WebStream API).
* Will set fileSize, if provided given Stream has set the .path property/
* @param webStream - Read from Node.js Stream.Readable (must be a byte stream)
* @param options - Tokenizer options
* @returns ReadStreamTokenizer
*/
function fromWebStream(webStream, options) {
	const webStreamReader = makeWebStreamReader(webStream);
	const _options = options ?? {};
	const chainedClose = _options.onClose;
	_options.onClose = async () => {
		await webStreamReader.close();
		if (chainedClose) return chainedClose();
	};
	return new ReadStreamTokenizer(webStreamReader, _options);
}
/**
* Construct ReadStreamTokenizer from given Buffer.
* @param uint8Array - Uint8Array to tokenize
* @param options - Tokenizer options
* @returns BufferTokenizer
*/
function fromBuffer(uint8Array, options) {
	return new BufferTokenizer(uint8Array, options);
}
/**
* Construct ReadStreamTokenizer from given Blob.
* @param blob - Uint8Array to tokenize
* @param options - Tokenizer options
* @returns BufferTokenizer
*/
function fromBlob(blob, options) {
	return new BlobTokenizer(blob, options);
}

//#endregion
//#region ../../node_modules/.pnpm/@tokenizer+inflate@0.4.1/node_modules/@tokenizer/inflate/lib/ZipToken.js
/**
* Ref https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
*/
const Signature = {
	LocalFileHeader: 67324752,
	DataDescriptor: 134695760,
	CentralFileHeader: 33639248,
	EndOfCentralDirectory: 101010256
};
const DataDescriptor = {
	get(array) {
		return {
			signature: UINT32_LE.get(array, 0),
			compressedSize: UINT32_LE.get(array, 8),
			uncompressedSize: UINT32_LE.get(array, 12)
		};
	},
	len: 16
};
/**
* First part of the ZIP Local File Header
* Offset | Bytes| Description
* -------|------+-------------------------------------------------------------------
*      0 |    4 | Signature (0x04034b50)
*      4 |    2 | Minimum version needed to extract
*      6 |    2 | Bit flag
*      8 |    2 | Compression method
*     10 |    2 | File last modification time (MS-DOS format)
*     12 |    2 | File last modification date (MS-DOS format)
*     14 |    4 | CRC-32 of uncompressed data
*     18 |    4 | Compressed size
*     22 |    4 | Uncompressed size
*     26 |    2 | File name length (n)
*     28 |    2 | Extra field length (m)
*     30 |    n | File name
* 30 + n |    m | Extra field
*/
const LocalFileHeaderToken = {
	get(array) {
		const flags = UINT16_LE.get(array, 6);
		return {
			signature: UINT32_LE.get(array, 0),
			minVersion: UINT16_LE.get(array, 4),
			dataDescriptor: !!(flags & 8),
			compressedMethod: UINT16_LE.get(array, 8),
			compressedSize: UINT32_LE.get(array, 18),
			uncompressedSize: UINT32_LE.get(array, 22),
			filenameLength: UINT16_LE.get(array, 26),
			extraFieldLength: UINT16_LE.get(array, 28),
			filename: null
		};
	},
	len: 30
};
/**
* 4.3.16  End of central directory record:
*  end of central dir signature (0x06064b50)                                      4 bytes
*  number of this disk                                                            2 bytes
*  number of the disk with the start of the central directory                     2 bytes
*  total number of entries in the central directory on this disk                  2 bytes
*  total number of entries in the size of the central directory                   2 bytes
*  sizeOfTheCentralDirectory                                                      4 bytes
*  offset of start of central directory with respect to the starting disk number  4 bytes
*  .ZIP file comment length                                                       2 bytes
*  .ZIP file comment       (variable size)
*/
const EndOfCentralDirectoryRecordToken = {
	get(array) {
		return {
			signature: UINT32_LE.get(array, 0),
			nrOfThisDisk: UINT16_LE.get(array, 4),
			nrOfThisDiskWithTheStart: UINT16_LE.get(array, 6),
			nrOfEntriesOnThisDisk: UINT16_LE.get(array, 8),
			nrOfEntriesOfSize: UINT16_LE.get(array, 10),
			sizeOfCd: UINT32_LE.get(array, 12),
			offsetOfStartOfCd: UINT32_LE.get(array, 16),
			zipFileCommentLength: UINT16_LE.get(array, 20)
		};
	},
	len: 22
};
/**
* File header:
*    central file header signature   4 bytes   0 (0x02014b50)
*    version made by                 2 bytes   4
*    version needed to extract       2 bytes   6
*    general purpose bit flag        2 bytes   8
*    compression method              2 bytes  10
*    last mod file time              2 bytes  12
*    last mod file date              2 bytes  14
*    crc-32                          4 bytes  16
*    compressed size                 4 bytes  20
*    uncompressed size               4 bytes  24
*    file name length                2 bytes  28
*    extra field length              2 bytes  30
*    file comment length             2 bytes  32
*    disk number start               2 bytes  34
*    internal file attributes        2 bytes  36
*    external file attributes        4 bytes  38
*    relative offset of local header 4 bytes  42
*/
const FileHeader = {
	get(array) {
		const flags = UINT16_LE.get(array, 8);
		return {
			signature: UINT32_LE.get(array, 0),
			minVersion: UINT16_LE.get(array, 6),
			dataDescriptor: !!(flags & 8),
			compressedMethod: UINT16_LE.get(array, 10),
			compressedSize: UINT32_LE.get(array, 20),
			uncompressedSize: UINT32_LE.get(array, 24),
			filenameLength: UINT16_LE.get(array, 28),
			extraFieldLength: UINT16_LE.get(array, 30),
			fileCommentLength: UINT16_LE.get(array, 32),
			relativeOffsetOfLocalHeader: UINT32_LE.get(array, 42),
			filename: null
		};
	},
	len: 46
};

//#endregion
//#region ../../node_modules/.pnpm/@tokenizer+inflate@0.4.1/node_modules/@tokenizer/inflate/lib/ZipHandler.js
var import_src = /* @__PURE__ */ __toESM(require_src(), 1);
function signatureToArray(signature) {
	const signatureBytes = new Uint8Array(UINT32_LE.len);
	UINT32_LE.put(signatureBytes, 0, signature);
	return signatureBytes;
}
const debug = (0, import_src.default)("tokenizer:inflate");
const syncBufferSize = 256 * 1024;
const ddSignatureArray = signatureToArray(Signature.DataDescriptor);
const eocdSignatureBytes = signatureToArray(Signature.EndOfCentralDirectory);
var ZipHandler = class ZipHandler {
	constructor(tokenizer) {
		this.tokenizer = tokenizer;
		this.syncBuffer = new Uint8Array(syncBufferSize);
	}
	async isZip() {
		return await this.peekSignature() === Signature.LocalFileHeader;
	}
	peekSignature() {
		return this.tokenizer.peekToken(UINT32_LE);
	}
	async findEndOfCentralDirectoryLocator() {
		const randomReadTokenizer = this.tokenizer;
		const chunkLength = Math.min(16 * 1024, randomReadTokenizer.fileInfo.size);
		const buffer = this.syncBuffer.subarray(0, chunkLength);
		await this.tokenizer.readBuffer(buffer, { position: randomReadTokenizer.fileInfo.size - chunkLength });
		for (let i$1 = buffer.length - 4; i$1 >= 0; i$1--) if (buffer[i$1] === eocdSignatureBytes[0] && buffer[i$1 + 1] === eocdSignatureBytes[1] && buffer[i$1 + 2] === eocdSignatureBytes[2] && buffer[i$1 + 3] === eocdSignatureBytes[3]) return randomReadTokenizer.fileInfo.size - chunkLength + i$1;
		return -1;
	}
	async readCentralDirectory() {
		if (!this.tokenizer.supportsRandomAccess()) {
			debug("Cannot reading central-directory without random-read support");
			return;
		}
		debug("Reading central-directory...");
		const pos = this.tokenizer.position;
		const offset = await this.findEndOfCentralDirectoryLocator();
		if (offset > 0) {
			debug("Central-directory 32-bit signature found");
			const eocdHeader = await this.tokenizer.readToken(EndOfCentralDirectoryRecordToken, offset);
			const files = [];
			this.tokenizer.setPosition(eocdHeader.offsetOfStartOfCd);
			for (let n = 0; n < eocdHeader.nrOfEntriesOfSize; ++n) {
				const entry = await this.tokenizer.readToken(FileHeader);
				if (entry.signature !== Signature.CentralFileHeader) throw new Error("Expected Central-File-Header signature");
				entry.filename = await this.tokenizer.readToken(new StringType(entry.filenameLength, "utf-8"));
				await this.tokenizer.ignore(entry.extraFieldLength);
				await this.tokenizer.ignore(entry.fileCommentLength);
				files.push(entry);
				debug(`Add central-directory file-entry: n=${n + 1}/${files.length}: filename=${files[n].filename}`);
			}
			this.tokenizer.setPosition(pos);
			return files;
		}
		this.tokenizer.setPosition(pos);
	}
	async unzip(fileCb) {
		const entries = await this.readCentralDirectory();
		if (entries) return this.iterateOverCentralDirectory(entries, fileCb);
		let stop = false;
		do {
			const zipHeader = await this.readLocalFileHeader();
			if (!zipHeader) break;
			const next = fileCb(zipHeader);
			stop = !!next.stop;
			let fileData;
			await this.tokenizer.ignore(zipHeader.extraFieldLength);
			if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) {
				const chunks = [];
				let len = syncBufferSize;
				debug("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
				let nextHeaderIndex = -1;
				while (nextHeaderIndex < 0 && len === syncBufferSize) {
					len = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: true });
					nextHeaderIndex = indexOf(this.syncBuffer.subarray(0, len), ddSignatureArray);
					const size = nextHeaderIndex >= 0 ? nextHeaderIndex : len;
					if (next.handler) {
						const data = new Uint8Array(size);
						await this.tokenizer.readBuffer(data);
						chunks.push(data);
					} else await this.tokenizer.ignore(size);
				}
				debug(`Found data-descriptor-signature at pos=${this.tokenizer.position}`);
				if (next.handler) await this.inflate(zipHeader, mergeArrays(chunks), next.handler);
			} else if (next.handler) {
				debug(`Reading compressed-file-data: ${zipHeader.compressedSize} bytes`);
				fileData = new Uint8Array(zipHeader.compressedSize);
				await this.tokenizer.readBuffer(fileData);
				await this.inflate(zipHeader, fileData, next.handler);
			} else {
				debug(`Ignoring compressed-file-data: ${zipHeader.compressedSize} bytes`);
				await this.tokenizer.ignore(zipHeader.compressedSize);
			}
			debug(`Reading data-descriptor at pos=${this.tokenizer.position}`);
			if (zipHeader.dataDescriptor) {
				if ((await this.tokenizer.readToken(DataDescriptor)).signature !== 134695760) throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - DataDescriptor.len}`);
			}
		} while (!stop);
	}
	async iterateOverCentralDirectory(entries, fileCb) {
		for (const fileHeader of entries) {
			const next = fileCb(fileHeader);
			if (next.handler) {
				this.tokenizer.setPosition(fileHeader.relativeOffsetOfLocalHeader);
				const zipHeader = await this.readLocalFileHeader();
				if (zipHeader) {
					await this.tokenizer.ignore(zipHeader.extraFieldLength);
					const fileData = new Uint8Array(fileHeader.compressedSize);
					await this.tokenizer.readBuffer(fileData);
					await this.inflate(zipHeader, fileData, next.handler);
				}
			}
			if (next.stop) break;
		}
	}
	async inflate(zipHeader, fileData, cb) {
		if (zipHeader.compressedMethod === 0) return cb(fileData);
		if (zipHeader.compressedMethod !== 8) throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
		debug(`Decompress filename=${zipHeader.filename}, compressed-size=${fileData.length}`);
		return cb(await ZipHandler.decompressDeflateRaw(fileData));
	}
	static async decompressDeflateRaw(data) {
		const input = new ReadableStream({ start(controller) {
			controller.enqueue(data);
			controller.close();
		} });
		const ds = new DecompressionStream("deflate-raw");
		const output = input.pipeThrough(ds);
		try {
			const buffer = await new Response(output).arrayBuffer();
			return new Uint8Array(buffer);
		} catch (err$1) {
			const message = err$1 instanceof Error ? `Failed to deflate ZIP entry: ${err$1.message}` : "Unknown decompression error in ZIP entry";
			throw new TypeError(message);
		}
	}
	async readLocalFileHeader() {
		const signature = await this.tokenizer.peekToken(UINT32_LE);
		if (signature === Signature.LocalFileHeader) {
			const header = await this.tokenizer.readToken(LocalFileHeaderToken);
			header.filename = await this.tokenizer.readToken(new StringType(header.filenameLength, "utf-8"));
			return header;
		}
		if (signature === Signature.CentralFileHeader) return false;
		if (signature === 3759263696) throw new Error("Encrypted ZIP");
		throw new Error("Unexpected signature");
	}
};
function indexOf(buffer, portion) {
	const bufferLength = buffer.length;
	const portionLength = portion.length;
	if (portionLength > bufferLength) return -1;
	for (let i$1 = 0; i$1 <= bufferLength - portionLength; i$1++) {
		let found = true;
		for (let j = 0; j < portionLength; j++) if (buffer[i$1 + j] !== portion[j]) {
			found = false;
			break;
		}
		if (found) return i$1;
	}
	return -1;
}
function mergeArrays(chunks) {
	const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
	const mergedArray = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		mergedArray.set(chunk, offset);
		offset += chunk.length;
	}
	return mergedArray;
}

//#endregion
//#region ../../node_modules/.pnpm/@tokenizer+inflate@0.4.1/node_modules/@tokenizer/inflate/lib/GzipHandler.js
var GzipHandler = class {
	constructor(tokenizer) {
		this.tokenizer = tokenizer;
	}
	inflate() {
		const tokenizer = this.tokenizer;
		return new ReadableStream({ async pull(controller) {
			const buffer = new Uint8Array(1024);
			const size = await tokenizer.readBuffer(buffer, { mayBeLess: true });
			if (size === 0) {
				controller.close();
				return;
			}
			controller.enqueue(buffer.subarray(0, size));
		} }).pipeThrough(new DecompressionStream("gzip"));
	}
};

//#endregion
//#region ../../node_modules/.pnpm/uint8array-extras@1.5.0/node_modules/uint8array-extras/index.js
const objectToString = Object.prototype.toString;
const uint8ArrayStringified = "[object Uint8Array]";
function isType(value, typeConstructor, typeStringified) {
	if (!value) return false;
	if (value.constructor === typeConstructor) return true;
	return objectToString.call(value) === typeStringified;
}
function isUint8Array(value) {
	return isType(value, Uint8Array, uint8ArrayStringified);
}
function assertUint8Array(value) {
	if (!isUint8Array(value)) throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
}
function concatUint8Arrays(arrays, totalLength) {
	if (arrays.length === 0) return new Uint8Array(0);
	totalLength ??= arrays.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0);
	const returnValue = new Uint8Array(totalLength);
	let offset = 0;
	for (const array of arrays) {
		assertUint8Array(array);
		returnValue.set(array, offset);
		offset += array.length;
	}
	return returnValue;
}
const cachedDecoders = { utf8: new globalThis.TextDecoder("utf8") };
const cachedEncoder = new globalThis.TextEncoder();
const byteToHexLookupTable = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));
/**
@param {DataView} view
@returns {number}
*/
function getUintBE(view) {
	const { byteLength } = view;
	if (byteLength === 6) return view.getUint16(0) * 2 ** 32 + view.getUint32(2);
	if (byteLength === 5) return view.getUint8(0) * 2 ** 32 + view.getUint32(1);
	if (byteLength === 4) return view.getUint32(0);
	if (byteLength === 3) return view.getUint8(0) * 2 ** 16 + view.getUint16(1);
	if (byteLength === 2) return view.getUint16(0);
	if (byteLength === 1) return view.getUint8(0);
}

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/tokens.js
function stringToBytes(string, encoding) {
	if (encoding === "utf-16le") {
		const bytes = [];
		for (let index = 0; index < string.length; index++) {
			const code = string.charCodeAt(index);
			bytes.push(code & 255, code >> 8 & 255);
		}
		return bytes;
	}
	if (encoding === "utf-16be") {
		const bytes = [];
		for (let index = 0; index < string.length; index++) {
			const code = string.charCodeAt(index);
			bytes.push(code >> 8 & 255, code & 255);
		}
		return bytes;
	}
	return [...string].map((character) => character.charCodeAt(0));
}
/**
Checks whether the TAR checksum is valid.

@param {Uint8Array} arrayBuffer - The TAR header `[offset ... offset + 512]`.
@param {number} offset - TAR header offset.
@returns {boolean} `true` if the TAR checksum is valid, otherwise `false`.
*/
function tarHeaderChecksumMatches(arrayBuffer, offset = 0) {
	const readSum = Number.parseInt(new StringType(6).get(arrayBuffer, 148).replace(/\0.*$/v, "").trim(), 8);
	if (Number.isNaN(readSum)) return false;
	let sum = 256;
	for (let index = offset; index < offset + 148; index++) sum += arrayBuffer[index];
	for (let index = offset + 156; index < offset + 512; index++) sum += arrayBuffer[index];
	return readSum === sum;
}
/**
ID3 UINT32 sync-safe tokenizer token.
28 bits (representing up to 256MB) integer, the msb is 0 to avoid "false syncsignals".
*/
const uint32SyncSafeToken = {
	get: (buffer, offset) => buffer[offset + 3] & 127 | (buffer[offset + 2] & 127) << 7 | (buffer[offset + 1] & 127) << 14 | (buffer[offset] & 127) << 21,
	len: 4
};

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/supported.js
const extensions = [
	"jpg",
	"png",
	"apng",
	"gif",
	"webp",
	"flif",
	"xcf",
	"cr2",
	"cr3",
	"orf",
	"arw",
	"dng",
	"nef",
	"rw2",
	"raf",
	"tif",
	"bmp",
	"icns",
	"jxr",
	"psd",
	"indd",
	"zip",
	"tar",
	"rar",
	"gz",
	"bz2",
	"7z",
	"dmg",
	"mp4",
	"mid",
	"mkv",
	"webm",
	"mov",
	"avi",
	"mpg",
	"mp2",
	"mp3",
	"m4a",
	"oga",
	"ogg",
	"ogv",
	"opus",
	"flac",
	"wav",
	"spx",
	"amr",
	"pdf",
	"epub",
	"elf",
	"macho",
	"exe",
	"swf",
	"rtf",
	"wasm",
	"woff",
	"woff2",
	"eot",
	"ttf",
	"otf",
	"ttc",
	"ico",
	"flv",
	"ps",
	"xz",
	"sqlite",
	"nes",
	"crx",
	"xpi",
	"cab",
	"deb",
	"ar",
	"rpm",
	"Z",
	"lz",
	"cfb",
	"mxf",
	"mts",
	"blend",
	"bpg",
	"docx",
	"pptx",
	"xlsx",
	"3gp",
	"3g2",
	"j2c",
	"jp2",
	"jpm",
	"jpx",
	"mj2",
	"aif",
	"qcp",
	"odt",
	"ods",
	"odp",
	"xml",
	"mobi",
	"heic",
	"cur",
	"ktx",
	"ape",
	"wv",
	"dcm",
	"ics",
	"glb",
	"pcap",
	"dsf",
	"lnk",
	"alias",
	"voc",
	"ac3",
	"m4v",
	"m4p",
	"m4b",
	"f4v",
	"f4p",
	"f4b",
	"f4a",
	"mie",
	"asf",
	"ogm",
	"ogx",
	"mpc",
	"arrow",
	"shp",
	"aac",
	"mp1",
	"it",
	"s3m",
	"xm",
	"skp",
	"avif",
	"eps",
	"lzh",
	"pgp",
	"asar",
	"stl",
	"chm",
	"3mf",
	"zst",
	"jxl",
	"vcf",
	"jls",
	"pst",
	"dwg",
	"parquet",
	"class",
	"arj",
	"cpio",
	"ace",
	"avro",
	"icc",
	"fbx",
	"vsdx",
	"vtt",
	"apk",
	"drc",
	"lz4",
	"potx",
	"xltx",
	"dotx",
	"xltm",
	"ott",
	"ots",
	"otp",
	"odg",
	"otg",
	"xlsm",
	"docm",
	"dotm",
	"potm",
	"pptm",
	"jar",
	"jmp",
	"rm",
	"sav",
	"ppsm",
	"ppsx",
	"tar.gz",
	"reg",
	"dat",
	"key",
	"numbers",
	"pages"
];
const mimeTypes = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/flif",
	"image/x-xcf",
	"image/x-canon-cr2",
	"image/x-canon-cr3",
	"image/tiff",
	"image/bmp",
	"image/vnd.ms-photo",
	"image/vnd.adobe.photoshop",
	"application/x-indesign",
	"application/epub+zip",
	"application/x-xpinstall",
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12",
	"application/vnd.oasis.opendocument.text",
	"application/vnd.oasis.opendocument.spreadsheet",
	"application/vnd.oasis.opendocument.presentation",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow",
	"application/zip",
	"application/x-tar",
	"application/x-rar-compressed",
	"application/gzip",
	"application/x-bzip2",
	"application/x-7z-compressed",
	"application/x-apple-diskimage",
	"application/vnd.apache.arrow.file",
	"video/mp4",
	"audio/midi",
	"video/matroska",
	"video/webm",
	"video/quicktime",
	"video/vnd.avi",
	"audio/wav",
	"audio/qcelp",
	"audio/x-ms-asf",
	"video/x-ms-asf",
	"application/vnd.ms-asf",
	"video/mpeg",
	"video/3gpp",
	"audio/mpeg",
	"audio/mp4",
	"video/ogg",
	"audio/ogg",
	"audio/ogg; codecs=opus",
	"application/ogg",
	"audio/flac",
	"audio/ape",
	"audio/wavpack",
	"audio/amr",
	"application/pdf",
	"application/x-elf",
	"application/x-mach-binary",
	"application/x-msdownload",
	"application/x-shockwave-flash",
	"application/rtf",
	"application/wasm",
	"font/woff",
	"font/woff2",
	"application/vnd.ms-fontobject",
	"font/ttf",
	"font/otf",
	"font/collection",
	"image/x-icon",
	"video/x-flv",
	"application/postscript",
	"application/eps",
	"application/x-xz",
	"application/x-sqlite3",
	"application/x-nintendo-nes-rom",
	"application/x-google-chrome-extension",
	"application/vnd.ms-cab-compressed",
	"application/x-deb",
	"application/x-unix-archive",
	"application/x-rpm",
	"application/x-compress",
	"application/lzip",
	"application/x-cfb",
	"application/x-mie",
	"application/mxf",
	"video/mp2t",
	"application/x-blender",
	"image/bpg",
	"image/j2c",
	"image/jp2",
	"image/jpx",
	"image/jpm",
	"image/mj2",
	"audio/aiff",
	"application/xml",
	"application/x-mobipocket-ebook",
	"image/heif",
	"image/heif-sequence",
	"image/heic",
	"image/heic-sequence",
	"image/icns",
	"image/ktx",
	"application/dicom",
	"audio/x-musepack",
	"text/calendar",
	"text/vcard",
	"text/vtt",
	"model/gltf-binary",
	"application/vnd.tcpdump.pcap",
	"audio/x-dsf",
	"application/x-ms-shortcut",
	"application/x-ft-apple.alias",
	"audio/x-voc",
	"audio/vnd.dolby.dd-raw",
	"audio/x-m4a",
	"image/apng",
	"image/x-olympus-orf",
	"image/x-sony-arw",
	"image/x-adobe-dng",
	"image/x-nikon-nef",
	"image/x-panasonic-rw2",
	"image/x-fujifilm-raf",
	"video/x-m4v",
	"video/3gpp2",
	"application/x-esri-shape",
	"audio/aac",
	"audio/x-it",
	"audio/x-s3m",
	"audio/x-xm",
	"video/MP1S",
	"video/MP2P",
	"application/vnd.sketchup.skp",
	"image/avif",
	"application/x-lzh-compressed",
	"application/pgp-encrypted",
	"application/x-asar",
	"model/stl",
	"application/vnd.ms-htmlhelp",
	"model/3mf",
	"image/jxl",
	"application/zstd",
	"image/jls",
	"application/vnd.ms-outlook",
	"image/vnd.dwg",
	"application/vnd.apache.parquet",
	"application/java-vm",
	"application/x-arj",
	"application/x-cpio",
	"application/x-ace-compressed",
	"application/avro",
	"application/vnd.iccprofile",
	"application/x-ft-fbx",
	"application/vnd.visio",
	"application/vnd.android.package-archive",
	"application/x-ft-draco",
	"application/x-lz4",
	"application/vnd.openxmlformats-officedocument.presentationml.template",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template",
	"application/vnd.ms-excel.template.macroenabled.12",
	"application/vnd.oasis.opendocument.text-template",
	"application/vnd.oasis.opendocument.spreadsheet-template",
	"application/vnd.oasis.opendocument.presentation-template",
	"application/vnd.oasis.opendocument.graphics",
	"application/vnd.oasis.opendocument.graphics-template",
	"application/vnd.ms-excel.sheet.macroenabled.12",
	"application/vnd.ms-word.document.macroenabled.12",
	"application/vnd.ms-word.template.macroenabled.12",
	"application/vnd.ms-powerpoint.template.macroenabled.12",
	"application/vnd.ms-powerpoint.presentation.macroenabled.12",
	"application/java-archive",
	"application/vnd.rn-realmedia",
	"application/x-spss-sav",
	"application/x-ms-regedit",
	"application/x-ft-windows-registry-hive",
	"application/x-jmp-data",
	"application/vnd.apple.keynote",
	"application/vnd.apple.numbers",
	"application/vnd.apple.pages"
];

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/parser.js
const maximumUntrustedSkipSizeInBytes = 16 * 1024 * 1024;
var ParserHardLimitError = class extends Error {};
function getSafeBound(value, maximum, reason) {
	if (!Number.isFinite(value) || value < 0 || value > maximum) throw new ParserHardLimitError(`${reason} has invalid size ${value} (maximum ${maximum} bytes)`);
	return value;
}
async function safeIgnore(tokenizer, length, { maximumLength = maximumUntrustedSkipSizeInBytes, reason = "skip" } = {}) {
	const safeLength = getSafeBound(length, maximumLength, reason);
	await tokenizer.ignore(safeLength);
}
async function safeReadBuffer(tokenizer, buffer, options, { maximumLength = buffer.length, reason = "read" } = {}) {
	const safeLength = getSafeBound(options?.length ?? buffer.length, maximumLength, reason);
	return tokenizer.readBuffer(buffer, {
		...options,
		length: safeLength
	});
}
function checkBytes(buffer, headers, options) {
	options = {
		offset: 0,
		...options
	};
	for (const [index, header] of headers.entries()) if (options.mask) {
		if (header !== (options.mask[index] & buffer[index + options.offset])) return false;
	} else if (header !== buffer[index + options.offset]) return false;
	return true;
}
function hasUnknownFileSize(tokenizer) {
	const fileSize = tokenizer.fileInfo.size;
	return !Number.isFinite(fileSize) || fileSize === Number.MAX_SAFE_INTEGER;
}
function hasExceededUnknownSizeScanBudget(tokenizer, startOffset, maximumBytes) {
	return hasUnknownFileSize(tokenizer) && tokenizer.position - startOffset > maximumBytes;
}

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/detectors/zip.js
const maximumZipEntrySizeInBytes = 1024 * 1024;
const maximumZipEntryCount = 1024;
const maximumZipBufferedReadSizeInBytes = 2 ** 31 - 1;
const maximumZipTextEntrySizeInBytes = maximumZipEntrySizeInBytes;
const recoverableZipErrorMessages = new Set([
	"Unexpected signature",
	"Encrypted ZIP",
	"Expected Central-File-Header signature"
]);
const recoverableZipErrorMessagePrefixes = [
	"ZIP entry count exceeds ",
	"Unsupported ZIP compression method:",
	"ZIP entry compressed data exceeds ",
	"ZIP entry decompressed data exceeds ",
	"Expected data-descriptor-signature at position "
];
const recoverableZipErrorCodes = new Set([
	"Z_BUF_ERROR",
	"Z_DATA_ERROR",
	"ERR_INVALID_STATE"
]);
async function decompressDeflateRawWithLimit(data, { maximumLength = maximumZipEntrySizeInBytes } = {}) {
	const reader = new ReadableStream({ start(controller) {
		controller.enqueue(data);
		controller.close();
	} }).pipeThrough(new DecompressionStream("deflate-raw")).getReader();
	const chunks = [];
	let totalLength = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			totalLength += value.length;
			if (totalLength > maximumLength) {
				await reader.cancel();
				throw new Error(`ZIP entry decompressed data exceeds ${maximumLength} bytes`);
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const uncompressedData = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		uncompressedData.set(chunk, offset);
		offset += chunk.length;
	}
	return uncompressedData;
}
function mergeByteChunks(chunks, totalLength) {
	const merged = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		merged.set(chunk, offset);
		offset += chunk.length;
	}
	return merged;
}
function getMaximumZipBufferedReadLength(tokenizer) {
	const fileSize = tokenizer.fileInfo.size;
	const remainingBytes = Number.isFinite(fileSize) ? Math.max(0, fileSize - tokenizer.position) : Number.MAX_SAFE_INTEGER;
	return Math.min(remainingBytes, maximumZipBufferedReadSizeInBytes);
}
function isRecoverableZipError(error) {
	if (error instanceof EndOfStreamError) return true;
	if (error instanceof ParserHardLimitError) return true;
	if (!(error instanceof Error)) return false;
	if (recoverableZipErrorMessages.has(error.message)) return true;
	if (recoverableZipErrorCodes.has(error.code)) return true;
	for (const prefix of recoverableZipErrorMessagePrefixes) if (error.message.startsWith(prefix)) return true;
	return false;
}
function canReadZipEntryForDetection(zipHeader, maximumSize = maximumZipEntrySizeInBytes) {
	const sizes = [zipHeader.compressedSize, zipHeader.uncompressedSize];
	for (const size of sizes) if (!Number.isFinite(size) || size < 0 || size > maximumSize) return false;
	return true;
}
function createIWorkZipDetectionState() {
	return {
		hasDocumentEntry: false,
		hasMasterSlideEntry: false,
		hasTablesEntry: false,
		hasCalculationEngineEntry: false
	};
}
function updateIWorkZipDetectionStateFromFilename(iWorkState, filename) {
	if (filename === "Index/Document.iwa") iWorkState.hasDocumentEntry = true;
	if (filename.startsWith("Index/MasterSlide")) iWorkState.hasMasterSlideEntry = true;
	if (filename.startsWith("Index/Tables/")) iWorkState.hasTablesEntry = true;
	if (filename === "Index/CalculationEngine.iwa") iWorkState.hasCalculationEngineEntry = true;
}
function getIWorkFileTypeFromZipEntries(iWorkState) {
	if (!iWorkState.hasDocumentEntry) return;
	if (iWorkState.hasMasterSlideEntry) return {
		ext: "key",
		mime: "application/vnd.apple.keynote"
	};
	if (iWorkState.hasTablesEntry) return {
		ext: "numbers",
		mime: "application/vnd.apple.numbers"
	};
	return {
		ext: "pages",
		mime: "application/vnd.apple.pages"
	};
}
function getFileTypeFromMimeType(mimeType) {
	mimeType = mimeType.toLowerCase();
	switch (mimeType) {
		case "application/epub+zip": return {
			ext: "epub",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.text": return {
			ext: "odt",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.text-template": return {
			ext: "ott",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.spreadsheet": return {
			ext: "ods",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.spreadsheet-template": return {
			ext: "ots",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.presentation": return {
			ext: "odp",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.presentation-template": return {
			ext: "otp",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.graphics": return {
			ext: "odg",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.graphics-template": return {
			ext: "otg",
			mime: mimeType
		};
		case "application/vnd.openxmlformats-officedocument.presentationml.slideshow": return {
			ext: "ppsx",
			mime: mimeType
		};
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": return {
			ext: "xlsx",
			mime: mimeType
		};
		case "application/vnd.ms-excel.sheet.macroenabled": return {
			ext: "xlsm",
			mime: "application/vnd.ms-excel.sheet.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.template": return {
			ext: "xltx",
			mime: mimeType
		};
		case "application/vnd.ms-excel.template.macroenabled": return {
			ext: "xltm",
			mime: "application/vnd.ms-excel.template.macroenabled.12"
		};
		case "application/vnd.ms-powerpoint.slideshow.macroenabled": return {
			ext: "ppsm",
			mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return {
			ext: "docx",
			mime: mimeType
		};
		case "application/vnd.ms-word.document.macroenabled": return {
			ext: "docm",
			mime: "application/vnd.ms-word.document.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.template": return {
			ext: "dotx",
			mime: mimeType
		};
		case "application/vnd.ms-word.template.macroenabledtemplate": return {
			ext: "dotm",
			mime: "application/vnd.ms-word.template.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.presentationml.template": return {
			ext: "potx",
			mime: mimeType
		};
		case "application/vnd.ms-powerpoint.template.macroenabled": return {
			ext: "potm",
			mime: "application/vnd.ms-powerpoint.template.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.presentationml.presentation": return {
			ext: "pptx",
			mime: mimeType
		};
		case "application/vnd.ms-powerpoint.presentation.macroenabled": return {
			ext: "pptm",
			mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12"
		};
		case "application/vnd.ms-visio.drawing": return {
			ext: "vsdx",
			mime: "application/vnd.visio"
		};
		case "application/vnd.ms-package.3dmanufacturing-3dmodel+xml": return {
			ext: "3mf",
			mime: "model/3mf"
		};
		default:
	}
}
function createOpenXmlZipDetectionState() {
	return {
		hasContentTypesEntry: false,
		hasParsedContentTypesEntry: false,
		isParsingContentTypes: false,
		hasUnparseableContentTypes: false,
		hasWordDirectory: false,
		hasPresentationDirectory: false,
		hasSpreadsheetDirectory: false,
		hasThreeDimensionalModelEntry: false
	};
}
function updateOpenXmlZipDetectionStateFromFilename(openXmlState, filename) {
	if (filename.startsWith("word/")) openXmlState.hasWordDirectory = true;
	if (filename.startsWith("ppt/")) openXmlState.hasPresentationDirectory = true;
	if (filename.startsWith("xl/")) openXmlState.hasSpreadsheetDirectory = true;
	if (filename.startsWith("3D/") && filename.endsWith(".model")) openXmlState.hasThreeDimensionalModelEntry = true;
}
function getOpenXmlFileTypeFromDirectoryNames(openXmlState) {
	if (openXmlState.hasWordDirectory) return {
		ext: "docx",
		mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	};
	if (openXmlState.hasPresentationDirectory) return {
		ext: "pptx",
		mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
	};
	if (openXmlState.hasSpreadsheetDirectory) return {
		ext: "xlsx",
		mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	};
	if (openXmlState.hasThreeDimensionalModelEntry) return {
		ext: "3mf",
		mime: "model/3mf"
	};
}
function getOpenXmlFileTypeFromZipEntries(openXmlState) {
	if (!openXmlState.hasContentTypesEntry || openXmlState.hasUnparseableContentTypes || openXmlState.isParsingContentTypes || openXmlState.hasParsedContentTypesEntry) return;
	return getOpenXmlFileTypeFromDirectoryNames(openXmlState);
}
function getOpenXmlMimeTypeFromContentTypesXml(xmlContent) {
	const endPosition = xmlContent.indexOf(".main+xml\"");
	if (endPosition === -1) {
		const mimeType = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
		if (xmlContent.includes(`ContentType="${mimeType}"`)) return mimeType;
		return;
	}
	const truncatedContent = xmlContent.slice(0, endPosition);
	const firstQuotePosition = truncatedContent.lastIndexOf("\"");
	return truncatedContent.slice(firstQuotePosition + 1);
}
const zipDataDescriptorSignature = 134695760;
const zipDataDescriptorLengthInBytes = 16;
const zipDataDescriptorOverlapLengthInBytes = zipDataDescriptorLengthInBytes - 1;
function findZipDataDescriptorOffset(buffer, bytesConsumed) {
	if (buffer.length < zipDataDescriptorLengthInBytes) return -1;
	const lastPossibleDescriptorOffset = buffer.length - zipDataDescriptorLengthInBytes;
	for (let index = 0; index <= lastPossibleDescriptorOffset; index++) if (UINT32_LE.get(buffer, index) === zipDataDescriptorSignature && UINT32_LE.get(buffer, index + 8) === bytesConsumed + index) return index;
	return -1;
}
async function readZipDataDescriptorEntryWithLimit(zipHandler, { shouldBuffer, maximumLength = maximumZipEntrySizeInBytes } = {}) {
	const { syncBuffer } = zipHandler;
	const { length: syncBufferLength } = syncBuffer;
	const chunks = [];
	let bytesConsumed = 0;
	for (;;) {
		const length = await zipHandler.tokenizer.peekBuffer(syncBuffer, { mayBeLess: true });
		const dataDescriptorOffset = findZipDataDescriptorOffset(syncBuffer.subarray(0, length), bytesConsumed);
		const retainedLength = dataDescriptorOffset >= 0 ? 0 : length === syncBufferLength ? Math.min(zipDataDescriptorOverlapLengthInBytes, length - 1) : 0;
		const chunkLength = dataDescriptorOffset >= 0 ? dataDescriptorOffset : length - retainedLength;
		if (chunkLength === 0) break;
		bytesConsumed += chunkLength;
		if (bytesConsumed > maximumLength) throw new Error(`ZIP entry compressed data exceeds ${maximumLength} bytes`);
		if (shouldBuffer) {
			const data = new Uint8Array(chunkLength);
			await zipHandler.tokenizer.readBuffer(data);
			chunks.push(data);
		} else await zipHandler.tokenizer.ignore(chunkLength);
		if (dataDescriptorOffset >= 0) break;
	}
	if (!hasUnknownFileSize(zipHandler.tokenizer)) zipHandler.knownSizeDescriptorScannedBytes += bytesConsumed;
	if (!shouldBuffer) return;
	return mergeByteChunks(chunks, bytesConsumed);
}
function getRemainingZipScanBudget(zipHandler, startOffset) {
	if (hasUnknownFileSize(zipHandler.tokenizer)) return Math.max(0, maximumUntrustedSkipSizeInBytes - (zipHandler.tokenizer.position - startOffset));
	return Math.max(0, maximumZipEntrySizeInBytes - zipHandler.knownSizeDescriptorScannedBytes);
}
async function readZipEntryData(zipHandler, zipHeader, { shouldBuffer, maximumDescriptorLength = maximumZipEntrySizeInBytes } = {}) {
	if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) return readZipDataDescriptorEntryWithLimit(zipHandler, {
		shouldBuffer,
		maximumLength: maximumDescriptorLength
	});
	if (!shouldBuffer) {
		await safeIgnore(zipHandler.tokenizer, zipHeader.compressedSize, {
			maximumLength: hasUnknownFileSize(zipHandler.tokenizer) ? maximumZipEntrySizeInBytes : zipHandler.tokenizer.fileInfo.size,
			reason: "ZIP entry compressed data"
		});
		return;
	}
	const maximumLength = getMaximumZipBufferedReadLength(zipHandler.tokenizer);
	if (!Number.isFinite(zipHeader.compressedSize) || zipHeader.compressedSize < 0 || zipHeader.compressedSize > maximumLength) throw new Error(`ZIP entry compressed data exceeds ${maximumLength} bytes`);
	const fileData = new Uint8Array(zipHeader.compressedSize);
	await zipHandler.tokenizer.readBuffer(fileData);
	return fileData;
}
ZipHandler.prototype.inflate = async function(zipHeader, fileData, callback) {
	if (zipHeader.compressedMethod === 0) return callback(fileData);
	if (zipHeader.compressedMethod !== 8) throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
	return callback(await decompressDeflateRawWithLimit(fileData, { maximumLength: maximumZipEntrySizeInBytes }));
};
ZipHandler.prototype.unzip = async function(fileCallback) {
	let stop = false;
	let zipEntryCount = 0;
	const zipScanStart = this.tokenizer.position;
	this.knownSizeDescriptorScannedBytes = 0;
	do {
		if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
		const zipHeader = await this.readLocalFileHeader();
		if (!zipHeader) break;
		zipEntryCount++;
		if (zipEntryCount > maximumZipEntryCount) throw new Error(`ZIP entry count exceeds ${maximumZipEntryCount}`);
		const next = fileCallback(zipHeader);
		stop = Boolean(next.stop);
		await this.tokenizer.ignore(zipHeader.extraFieldLength);
		const fileData = await readZipEntryData(this, zipHeader, {
			shouldBuffer: Boolean(next.handler),
			maximumDescriptorLength: Math.min(maximumZipEntrySizeInBytes, getRemainingZipScanBudget(this, zipScanStart))
		});
		if (next.handler) await this.inflate(zipHeader, fileData, next.handler);
		if (zipHeader.dataDescriptor) {
			const dataDescriptor = new Uint8Array(zipDataDescriptorLengthInBytes);
			await this.tokenizer.readBuffer(dataDescriptor);
			if (UINT32_LE.get(dataDescriptor, 0) !== zipDataDescriptorSignature) throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - dataDescriptor.length}`);
		}
		if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
	} while (!stop);
};
async function detectZip(tokenizer) {
	let fileType;
	const openXmlState = createOpenXmlZipDetectionState();
	const iWorkState = createIWorkZipDetectionState();
	try {
		await new ZipHandler(tokenizer).unzip((zipHeader) => {
			updateOpenXmlZipDetectionStateFromFilename(openXmlState, zipHeader.filename);
			updateIWorkZipDetectionStateFromFilename(iWorkState, zipHeader.filename);
			if (iWorkState.hasDocumentEntry && (iWorkState.hasMasterSlideEntry || iWorkState.hasTablesEntry)) {
				fileType = getIWorkFileTypeFromZipEntries(iWorkState);
				return { stop: true };
			}
			const isOpenXmlContentTypesEntry = zipHeader.filename === "[Content_Types].xml";
			const openXmlFileTypeFromEntries = getOpenXmlFileTypeFromZipEntries(openXmlState);
			if (!isOpenXmlContentTypesEntry && openXmlFileTypeFromEntries) {
				fileType = openXmlFileTypeFromEntries;
				return { stop: true };
			}
			switch (zipHeader.filename) {
				case "META-INF/mozilla.rsa":
					fileType = {
						ext: "xpi",
						mime: "application/x-xpinstall"
					};
					return { stop: true };
				case "META-INF/MANIFEST.MF":
					fileType = {
						ext: "jar",
						mime: "application/java-archive"
					};
					return { stop: true };
				case "mimetype":
					if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) return {};
					return {
						async handler(fileData) {
							fileType = getFileTypeFromMimeType(new TextDecoder("utf-8").decode(fileData).trim());
						},
						stop: true
					};
				case "[Content_Types].xml":
					openXmlState.hasContentTypesEntry = true;
					if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) {
						openXmlState.hasUnparseableContentTypes = true;
						return {};
					}
					openXmlState.isParsingContentTypes = true;
					return {
						async handler(fileData) {
							const mimeType = getOpenXmlMimeTypeFromContentTypesXml(new TextDecoder("utf-8").decode(fileData));
							if (mimeType) fileType = getFileTypeFromMimeType(mimeType);
							openXmlState.hasParsedContentTypesEntry = true;
							openXmlState.isParsingContentTypes = false;
						},
						stop: true
					};
				default:
					if (/classes\d*\.dex/v.test(zipHeader.filename)) {
						fileType = {
							ext: "apk",
							mime: "application/vnd.android.package-archive"
						};
						return { stop: true };
					}
					return {};
			}
		});
	} catch (error) {
		if (!isRecoverableZipError(error)) throw error;
		if (openXmlState.isParsingContentTypes) {
			openXmlState.isParsingContentTypes = false;
			openXmlState.hasUnparseableContentTypes = true;
		}
		if (!fileType && error instanceof EndOfStreamError && !openXmlState.hasContentTypesEntry) fileType = getOpenXmlFileTypeFromDirectoryNames(openXmlState);
	}
	const iWorkFileType = hasUnknownFileSize(tokenizer) && iWorkState.hasDocumentEntry && !iWorkState.hasMasterSlideEntry && !iWorkState.hasTablesEntry && !iWorkState.hasCalculationEngineEntry ? void 0 : getIWorkFileTypeFromZipEntries(iWorkState);
	return fileType ?? getOpenXmlFileTypeFromZipEntries(openXmlState) ?? iWorkFileType ?? {
		ext: "zip",
		mime: "application/zip"
	};
}

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/detectors/ebml.js
const maximumEbmlDocumentTypeSizeInBytes = 64;
const maximumEbmlElementPayloadSizeInBytes = 1024 * 1024;
const maximumEbmlElementCount = 256;
async function detectEbml(tokenizer) {
	async function readField() {
		const msb = await tokenizer.peekNumber(UINT8);
		let mask = 128;
		let ic = 0;
		while ((msb & mask) === 0 && mask !== 0) {
			++ic;
			mask >>= 1;
		}
		const id = new Uint8Array(ic + 1);
		await safeReadBuffer(tokenizer, id, void 0, {
			maximumLength: id.length,
			reason: "EBML field"
		});
		return id;
	}
	async function readElement() {
		const idField = await readField();
		const lengthField = await readField();
		lengthField[0] ^= 128 >> lengthField.length - 1;
		const nrLength = Math.min(6, lengthField.length);
		const idView = new DataView(idField.buffer);
		const lengthView = new DataView(lengthField.buffer, lengthField.length - nrLength, nrLength);
		return {
			id: getUintBE(idView),
			len: getUintBE(lengthView)
		};
	}
	async function readChildren(children) {
		let ebmlElementCount = 0;
		while (children > 0) {
			ebmlElementCount++;
			if (ebmlElementCount > maximumEbmlElementCount) return;
			if (hasExceededUnknownSizeScanBudget(tokenizer, ebmlScanStart, maximumUntrustedSkipSizeInBytes)) return;
			const previousPosition = tokenizer.position;
			const element = await readElement();
			if (element.id === 17026) {
				if (element.len > maximumEbmlDocumentTypeSizeInBytes) return;
				const documentTypeLength = getSafeBound(element.len, maximumEbmlDocumentTypeSizeInBytes, "EBML DocType");
				return (await tokenizer.readToken(new StringType(documentTypeLength))).replaceAll(/\0.*$/gv, "");
			}
			if (hasUnknownFileSize(tokenizer) && (!Number.isFinite(element.len) || element.len < 0 || element.len > maximumEbmlElementPayloadSizeInBytes)) return;
			await safeIgnore(tokenizer, element.len, {
				maximumLength: hasUnknownFileSize(tokenizer) ? maximumEbmlElementPayloadSizeInBytes : tokenizer.fileInfo.size,
				reason: "EBML payload"
			});
			--children;
			if (tokenizer.position <= previousPosition) return;
		}
	}
	const rootElement = await readElement();
	const ebmlScanStart = tokenizer.position;
	switch (await readChildren(rootElement.len)) {
		case "webm": return {
			ext: "webm",
			mime: "video/webm"
		};
		case "matroska": return {
			ext: "mkv",
			mime: "video/matroska"
		};
		default:
	}
}

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/detectors/png.js
const maximumPngChunkCount = 512;
const maximumPngStreamScanBudgetInBytes = 16 * 1024 * 1024;
const maximumPngChunkSizeInBytes = 1024 * 1024;
function isPngAncillaryChunk(type) {
	return (type.codePointAt(0) & 32) !== 0;
}
async function detectPng(tokenizer) {
	const pngFileType = {
		ext: "png",
		mime: "image/png"
	};
	const apngFileType = {
		ext: "apng",
		mime: "image/apng"
	};
	await tokenizer.ignore(8);
	async function readChunkHeader() {
		return {
			length: await tokenizer.readToken(INT32_BE),
			type: await tokenizer.readToken(new StringType(4, "latin1"))
		};
	}
	const isUnknownPngStream = hasUnknownFileSize(tokenizer);
	const pngScanStart = tokenizer.position;
	let pngChunkCount = 0;
	let hasSeenImageHeader = false;
	do {
		pngChunkCount++;
		if (pngChunkCount > maximumPngChunkCount) break;
		if (hasExceededUnknownSizeScanBudget(tokenizer, pngScanStart, maximumPngStreamScanBudgetInBytes)) break;
		const previousPosition = tokenizer.position;
		const chunk = await readChunkHeader();
		if (chunk.length < 0) return;
		if (chunk.type === "IHDR") {
			if (chunk.length !== 13) return;
			hasSeenImageHeader = true;
		}
		switch (chunk.type) {
			case "IDAT": return pngFileType;
			case "acTL": return apngFileType;
			default:
				if (!hasSeenImageHeader && chunk.type !== "CgBI") return;
				if (isUnknownPngStream && chunk.length > maximumPngChunkSizeInBytes) return hasSeenImageHeader && isPngAncillaryChunk(chunk.type) ? pngFileType : void 0;
				try {
					await safeIgnore(tokenizer, chunk.length + 4, {
						maximumLength: isUnknownPngStream ? maximumPngChunkSizeInBytes + 4 : tokenizer.fileInfo.size,
						reason: "PNG chunk payload"
					});
				} catch (error) {
					if (!isUnknownPngStream && (error instanceof ParserHardLimitError || error instanceof EndOfStreamError)) return pngFileType;
					throw error;
				}
		}
		if (tokenizer.position <= previousPosition) break;
	} while (tokenizer.position + 8 < tokenizer.fileInfo.size);
	return pngFileType;
}

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/detectors/asf.js
const maximumAsfHeaderObjectCount = 512;
const maximumAsfHeaderPayloadSizeInBytes = 1024 * 1024;
async function detectAsf(tokenizer) {
	let isMalformedAsf = false;
	try {
		async function readHeader() {
			const guid = new Uint8Array(16);
			await safeReadBuffer(tokenizer, guid, void 0, {
				maximumLength: guid.length,
				reason: "ASF header GUID"
			});
			return {
				id: guid,
				size: Number(await tokenizer.readToken(UINT64_LE))
			};
		}
		await safeIgnore(tokenizer, 30, {
			maximumLength: 30,
			reason: "ASF header prelude"
		});
		const isUnknownFileSize = hasUnknownFileSize(tokenizer);
		const asfHeaderScanStart = tokenizer.position;
		let asfHeaderObjectCount = 0;
		while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
			asfHeaderObjectCount++;
			if (asfHeaderObjectCount > maximumAsfHeaderObjectCount) break;
			if (hasExceededUnknownSizeScanBudget(tokenizer, asfHeaderScanStart, maximumUntrustedSkipSizeInBytes)) break;
			const previousPosition = tokenizer.position;
			const header = await readHeader();
			let payload = header.size - 24;
			if (!Number.isFinite(payload) || payload < 0) {
				isMalformedAsf = true;
				break;
			}
			if (checkBytes(header.id, [
				145,
				7,
				220,
				183,
				183,
				169,
				207,
				17,
				142,
				230,
				0,
				192,
				12,
				32,
				83,
				101
			])) {
				const typeId = new Uint8Array(16);
				payload -= await safeReadBuffer(tokenizer, typeId, void 0, {
					maximumLength: typeId.length,
					reason: "ASF stream type GUID"
				});
				if (checkBytes(typeId, [
					64,
					158,
					105,
					248,
					77,
					91,
					207,
					17,
					168,
					253,
					0,
					128,
					95,
					92,
					68,
					43
				])) return {
					ext: "asf",
					mime: "audio/x-ms-asf"
				};
				if (checkBytes(typeId, [
					192,
					239,
					25,
					188,
					77,
					91,
					207,
					17,
					168,
					253,
					0,
					128,
					95,
					92,
					68,
					43
				])) return {
					ext: "asf",
					mime: "video/x-ms-asf"
				};
				break;
			}
			if (isUnknownFileSize && payload > maximumAsfHeaderPayloadSizeInBytes) {
				isMalformedAsf = true;
				break;
			}
			await safeIgnore(tokenizer, payload, {
				maximumLength: isUnknownFileSize ? maximumAsfHeaderPayloadSizeInBytes : tokenizer.fileInfo.size,
				reason: "ASF header payload"
			});
			if (tokenizer.position <= previousPosition) {
				isMalformedAsf = true;
				break;
			}
		}
	} catch (error) {
		if (error instanceof EndOfStreamError || error instanceof ParserHardLimitError) {
			if (hasUnknownFileSize(tokenizer)) isMalformedAsf = true;
		} else throw error;
	}
	if (isMalformedAsf) return;
	return {
		ext: "asf",
		mime: "application/vnd.ms-asf"
	};
}

//#endregion
//#region ../../node_modules/.pnpm/file-type@22.0.1/node_modules/file-type/source/index.js
/**
Primary entry point, Node.js specific entry point is index.js
*/
const reasonableDetectionSizeInBytes = 4100;
const maximumMpegOffsetTolerance = reasonableDetectionSizeInBytes - 2;
const maximumNestedGzipDetectionSizeInBytes = maximumUntrustedSkipSizeInBytes;
const maximumNestedGzipProbeDepth = 1;
const unknownSizeGzipProbeTimeoutInMilliseconds = 100;
const maximumId3HeaderSizeInBytes = maximumUntrustedSkipSizeInBytes;
const maximumTiffTagCount = 512;
const maximumDetectionReentryCount = 256;
const maximumTiffStreamIfdOffsetInBytes = 1024 * 1024;
const maximumTiffIfdOffsetInBytes = maximumUntrustedSkipSizeInBytes;
function normalizeSampleSize(sampleSize) {
	if (!Number.isFinite(sampleSize)) return reasonableDetectionSizeInBytes;
	return Math.max(1, Math.trunc(sampleSize));
}
function normalizeMpegOffsetTolerance(mpegOffsetTolerance) {
	if (!Number.isFinite(mpegOffsetTolerance)) return 0;
	return Math.max(0, Math.min(maximumMpegOffsetTolerance, Math.trunc(mpegOffsetTolerance)));
}
function getKnownFileSizeOrMaximum(fileSize) {
	if (!Number.isFinite(fileSize)) return Number.MAX_SAFE_INTEGER;
	return Math.max(0, fileSize);
}
function importAtRuntime(specifier) {
	return import(specifier);
}
function toDefaultStream(stream) {
	return stream.pipeThrough(new TransformStream());
}
function readWithSignal(reader, signal) {
	if (signal === void 0) return reader.read();
	signal.throwIfAborted();
	return Promise.race([reader.read(), new Promise((_resolve, reject) => {
		signal.addEventListener("abort", () => {
			reject(signal.reason);
			reader.cancel(signal.reason).catch(() => {});
		}, { once: true });
	})]);
}
function createByteLimitedReadableStream(stream, maximumBytes) {
	const reader = stream.getReader();
	let emittedBytes = 0;
	let sourceDone = false;
	let sourceCanceled = false;
	const cancelSource = async (reason) => {
		if (sourceDone || sourceCanceled) return;
		sourceCanceled = true;
		await reader.cancel(reason);
	};
	return new ReadableStream({
		async pull(controller) {
			if (emittedBytes >= maximumBytes) {
				controller.close();
				await cancelSource();
				return;
			}
			const { done, value } = await reader.read();
			if (done || !value) {
				sourceDone = true;
				controller.close();
				return;
			}
			const remainingBytes = maximumBytes - emittedBytes;
			if (value.length > remainingBytes) {
				controller.enqueue(value.subarray(0, remainingBytes));
				emittedBytes += remainingBytes;
				controller.close();
				await cancelSource();
				return;
			}
			controller.enqueue(value);
			emittedBytes += value.length;
		},
		async cancel(reason) {
			await cancelSource(reason);
		}
	});
}
async function fileTypeFromBuffer(input, options) {
	return new FileTypeParser(options).fromBuffer(input);
}
var FileTypeParser = class FileTypeParser {
	constructor(options) {
		const normalizedMpegOffsetTolerance = normalizeMpegOffsetTolerance(options?.mpegOffsetTolerance);
		this.options = {
			...options,
			mpegOffsetTolerance: normalizedMpegOffsetTolerance
		};
		this.detectors = [
			...this.options.customDetectors ?? [],
			{
				id: "core",
				detect: this.detectConfident
			},
			{
				id: "core.imprecise",
				detect: this.detectImprecise
			}
		];
		this.tokenizerOptions = { abortSignal: this.options.signal };
		this.gzipProbeDepth = 0;
	}
	getTokenizerOptions() {
		return { ...this.tokenizerOptions };
	}
	createTokenizerFromWebStream(stream) {
		return fromWebStream(toDefaultStream(stream), this.getTokenizerOptions());
	}
	async parseTokenizer(tokenizer, detectionReentryCount = 0) {
		this.detectionReentryCount = detectionReentryCount;
		const initialPosition = tokenizer.position;
		for (const detector of this.detectors) {
			let fileType;
			try {
				fileType = await detector.detect(tokenizer);
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				if (error instanceof ParserHardLimitError) return;
				throw error;
			}
			if (fileType) return fileType;
			if (initialPosition !== tokenizer.position) return;
		}
	}
	async fromTokenizer(tokenizer) {
		try {
			return await this.parseTokenizer(tokenizer);
		} finally {
			await tokenizer.close();
		}
	}
	async fromBuffer(input) {
		if (!(input instanceof Uint8Array || input instanceof ArrayBuffer)) throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof input}\``);
		const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
		if (!(buffer?.length > 1)) return;
		return this.fromTokenizer(fromBuffer(buffer, this.getTokenizerOptions()));
	}
	async fromBlob(blob) {
		this.options.signal?.throwIfAborted();
		const tokenizer = fromBlob(blob, this.getTokenizerOptions());
		return this.fromTokenizer(tokenizer);
	}
	async fromStream(stream) {
		this.options.signal?.throwIfAborted();
		const tokenizer = this.createTokenizerFromWebStream(stream);
		return this.fromTokenizer(tokenizer);
	}
	async fromFile(path$1) {
		this.options.signal?.throwIfAborted();
		const [{ default: fsPromises }, { FileTokenizer }] = await Promise.all([importAtRuntime("node:fs/promises"), importAtRuntime("strtok3")]);
		const fileHandle = await fsPromises.open(path$1, fsPromises.constants.O_RDONLY | fsPromises.constants.O_NONBLOCK);
		const fileStat = await fileHandle.stat();
		if (!fileStat.isFile()) {
			await fileHandle.close();
			return;
		}
		const tokenizer = new FileTokenizer(fileHandle, {
			...this.getTokenizerOptions(),
			fileInfo: {
				path: path$1,
				size: fileStat.size
			}
		});
		return this.fromTokenizer(tokenizer);
	}
	async toDetectionStream(stream, options) {
		this.options.signal?.throwIfAborted();
		const sampleSize = normalizeSampleSize(options?.sampleSize ?? reasonableDetectionSizeInBytes);
		let detectedFileType;
		let streamEnded = false;
		const reader = stream.getReader();
		const chunks = [];
		let totalSize = 0;
		try {
			while (totalSize < sampleSize) {
				const { value, done } = await readWithSignal(reader, this.options.signal);
				if (done || !value) {
					streamEnded = true;
					break;
				}
				chunks.push(value);
				totalSize += value.length;
			}
			if (!streamEnded && totalSize === sampleSize) {
				const { value, done } = await readWithSignal(reader, this.options.signal);
				if (done || !value) streamEnded = true;
				else {
					chunks.push(value);
					totalSize += value.length;
				}
			}
		} finally {
			reader.releaseLock();
		}
		if (totalSize > 0) {
			const sample = chunks.length === 1 ? chunks[0] : concatUint8Arrays(chunks);
			try {
				detectedFileType = await this.fromBuffer(sample.subarray(0, sampleSize));
			} catch (error) {
				if (!(error instanceof EndOfStreamError)) throw error;
				detectedFileType = void 0;
			}
			if (!streamEnded && detectedFileType?.ext === "pages") detectedFileType = {
				ext: "zip",
				mime: "application/zip"
			};
		}
		const transformStream = new TransformStream({
			start(controller) {
				for (const chunk of chunks) controller.enqueue(chunk);
			},
			transform(chunk, controller) {
				controller.enqueue(chunk);
			}
		});
		const newStream = stream.pipeThrough(transformStream);
		newStream.fileType = detectedFileType;
		return newStream;
	}
	async detectGzip(tokenizer) {
		if (this.gzipProbeDepth >= maximumNestedGzipProbeDepth) return {
			ext: "gz",
			mime: "application/gzip"
		};
		const limitedInflatedStream = createByteLimitedReadableStream(new GzipHandler(tokenizer).inflate(), maximumNestedGzipDetectionSizeInBytes);
		const hasUnknownSize = hasUnknownFileSize(tokenizer);
		let timeout;
		let probeSignal;
		let probeParser;
		let compressedFileType;
		if (hasUnknownSize) {
			const timeoutController = new AbortController();
			timeout = setTimeout(() => {
				timeoutController.abort(new DOMException(`Operation timed out after ${unknownSizeGzipProbeTimeoutInMilliseconds} ms`, "TimeoutError"));
			}, unknownSizeGzipProbeTimeoutInMilliseconds);
			probeSignal = this.options.signal === void 0 ? timeoutController.signal : AbortSignal.any([this.options.signal, timeoutController.signal]);
			probeParser = new FileTypeParser({
				...this.options,
				signal: probeSignal
			});
			probeParser.gzipProbeDepth = this.gzipProbeDepth + 1;
		} else this.gzipProbeDepth++;
		try {
			compressedFileType = await (probeParser ?? this).fromStream(limitedInflatedStream);
		} catch (error) {
			if (error?.name === "AbortError" && probeSignal?.reason?.name !== "TimeoutError") throw error;
		} finally {
			clearTimeout(timeout);
			if (!hasUnknownSize) this.gzipProbeDepth--;
		}
		if (compressedFileType?.ext === "tar") return {
			ext: "tar.gz",
			mime: "application/gzip"
		};
		return {
			ext: "gz",
			mime: "application/gzip"
		};
	}
	check(header, options) {
		return checkBytes(this.buffer, header, options);
	}
	checkString(header, options) {
		return this.check(stringToBytes(header, options?.encoding), options);
	}
	detectConfident = async (tokenizer) => {
		this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
		if (tokenizer.fileInfo.size === void 0) tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
		this.tokenizer = tokenizer;
		if (hasUnknownFileSize(tokenizer)) {
			await tokenizer.peekBuffer(this.buffer, {
				length: 3,
				mayBeLess: true
			});
			if (this.check([
				31,
				139,
				8
			])) return this.detectGzip(tokenizer);
		}
		await tokenizer.peekBuffer(this.buffer, {
			length: 32,
			mayBeLess: true
		});
		if (this.check([66, 77])) return {
			ext: "bmp",
			mime: "image/bmp"
		};
		if (this.check([11, 119])) return {
			ext: "ac3",
			mime: "audio/vnd.dolby.dd-raw"
		};
		if (this.check([120, 1])) return {
			ext: "dmg",
			mime: "application/x-apple-diskimage"
		};
		if (this.check([77, 90])) return {
			ext: "exe",
			mime: "application/x-msdownload"
		};
		if (this.check([37, 33])) {
			await tokenizer.peekBuffer(this.buffer, {
				length: 24,
				mayBeLess: true
			});
			if (this.checkString("PS-Adobe-", { offset: 2 }) && this.checkString(" EPSF-", { offset: 14 })) return {
				ext: "eps",
				mime: "application/eps"
			};
			return {
				ext: "ps",
				mime: "application/postscript"
			};
		}
		if (this.check([31, 160]) || this.check([31, 157])) return {
			ext: "Z",
			mime: "application/x-compress"
		};
		if (this.check([199, 113])) return {
			ext: "cpio",
			mime: "application/x-cpio"
		};
		if (this.check([96, 234])) return {
			ext: "arj",
			mime: "application/x-arj"
		};
		if (this.check([
			239,
			187,
			191
		])) {
			if (this.detectionReentryCount >= maximumDetectionReentryCount) return;
			this.detectionReentryCount++;
			await this.tokenizer.ignore(3);
			return this.detectConfident(tokenizer);
		}
		if (this.check([
			71,
			73,
			70
		])) return {
			ext: "gif",
			mime: "image/gif"
		};
		if (this.check([
			73,
			73,
			188
		])) return {
			ext: "jxr",
			mime: "image/vnd.ms-photo"
		};
		if (this.check([
			31,
			139,
			8
		])) return this.detectGzip(tokenizer);
		if (this.check([
			66,
			90,
			104
		])) return {
			ext: "bz2",
			mime: "application/x-bzip2"
		};
		if (this.checkString("ID3")) {
			await safeIgnore(tokenizer, 6, {
				maximumLength: 6,
				reason: "ID3 header prefix"
			});
			const id3HeaderLength = await tokenizer.readToken(uint32SyncSafeToken);
			const isUnknownFileSize = hasUnknownFileSize(tokenizer);
			if (!Number.isFinite(id3HeaderLength) || id3HeaderLength < 0 || isUnknownFileSize && (id3HeaderLength > maximumId3HeaderSizeInBytes || tokenizer.position + id3HeaderLength > maximumId3HeaderSizeInBytes)) return;
			if (tokenizer.position + id3HeaderLength > tokenizer.fileInfo.size) {
				if (isUnknownFileSize) return;
				return {
					ext: "mp3",
					mime: "audio/mpeg"
				};
			}
			try {
				await safeIgnore(tokenizer, id3HeaderLength, {
					maximumLength: isUnknownFileSize ? maximumId3HeaderSizeInBytes : tokenizer.fileInfo.size,
					reason: "ID3 payload"
				});
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				throw error;
			}
			if (this.detectionReentryCount >= maximumDetectionReentryCount) return;
			this.detectionReentryCount++;
			return this.parseTokenizer(tokenizer, this.detectionReentryCount);
		}
		if (this.checkString("MP+")) return {
			ext: "mpc",
			mime: "audio/x-musepack"
		};
		if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 })) return {
			ext: "swf",
			mime: "application/x-shockwave-flash"
		};
		if (this.check([
			255,
			216,
			255
		])) {
			if (this.check([247], { offset: 3 })) return {
				ext: "jls",
				mime: "image/jls"
			};
			return {
				ext: "jpg",
				mime: "image/jpeg"
			};
		}
		if (this.check([
			79,
			98,
			106,
			1
		])) return {
			ext: "avro",
			mime: "application/avro"
		};
		if (this.checkString("FLIF")) return {
			ext: "flif",
			mime: "image/flif"
		};
		if (this.checkString("8BPS")) return {
			ext: "psd",
			mime: "image/vnd.adobe.photoshop"
		};
		if (this.checkString("MPCK")) return {
			ext: "mpc",
			mime: "audio/x-musepack"
		};
		if (this.checkString("FORM")) return {
			ext: "aif",
			mime: "audio/aiff"
		};
		if (this.checkString("icns", { offset: 0 })) return {
			ext: "icns",
			mime: "image/icns"
		};
		if (this.check([
			80,
			75,
			3,
			4
		])) return detectZip(tokenizer);
		if (this.checkString("OggS")) {
			await tokenizer.ignore(28);
			const type = new Uint8Array(8);
			await tokenizer.readBuffer(type);
			if (checkBytes(type, [
				79,
				112,
				117,
				115,
				72,
				101,
				97,
				100
			])) return {
				ext: "opus",
				mime: "audio/ogg; codecs=opus"
			};
			if (checkBytes(type, [
				128,
				116,
				104,
				101,
				111,
				114,
				97
			])) return {
				ext: "ogv",
				mime: "video/ogg"
			};
			if (checkBytes(type, [
				1,
				118,
				105,
				100,
				101,
				111,
				0
			])) return {
				ext: "ogm",
				mime: "video/ogg"
			};
			if (checkBytes(type, [
				127,
				70,
				76,
				65,
				67
			])) return {
				ext: "oga",
				mime: "audio/ogg"
			};
			if (checkBytes(type, [
				83,
				112,
				101,
				101,
				120,
				32,
				32
			])) return {
				ext: "spx",
				mime: "audio/ogg"
			};
			if (checkBytes(type, [
				1,
				118,
				111,
				114,
				98,
				105,
				115
			])) return {
				ext: "ogg",
				mime: "audio/ogg"
			};
			return {
				ext: "ogx",
				mime: "application/ogg"
			};
		}
		if (this.check([80, 75]) && (this.buffer[2] === 3 || this.buffer[2] === 5 || this.buffer[2] === 7) && (this.buffer[3] === 4 || this.buffer[3] === 6 || this.buffer[3] === 8)) return {
			ext: "zip",
			mime: "application/zip"
		};
		if (this.checkString("MThd")) return {
			ext: "mid",
			mime: "audio/midi"
		};
		if (this.checkString("wOFF") && (this.check([
			0,
			1,
			0,
			0
		], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) return {
			ext: "woff",
			mime: "font/woff"
		};
		if (this.checkString("wOF2") && (this.check([
			0,
			1,
			0,
			0
		], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) return {
			ext: "woff2",
			mime: "font/woff2"
		};
		if (this.check([
			212,
			195,
			178,
			161
		]) || this.check([
			161,
			178,
			195,
			212
		])) return {
			ext: "pcap",
			mime: "application/vnd.tcpdump.pcap"
		};
		if (this.checkString("DSD ")) return {
			ext: "dsf",
			mime: "audio/x-dsf"
		};
		if (this.checkString("LZIP")) return {
			ext: "lz",
			mime: "application/lzip"
		};
		if (this.checkString("fLaC")) return {
			ext: "flac",
			mime: "audio/flac"
		};
		if (this.check([
			66,
			80,
			71,
			251
		])) return {
			ext: "bpg",
			mime: "image/bpg"
		};
		if (this.checkString("wvpk")) return {
			ext: "wv",
			mime: "audio/wavpack"
		};
		if (this.checkString("%PDF")) return {
			ext: "pdf",
			mime: "application/pdf"
		};
		if (this.check([
			0,
			97,
			115,
			109
		])) return {
			ext: "wasm",
			mime: "application/wasm"
		};
		if (this.check([73, 73])) {
			const fileType = await this.readTiffHeader(false);
			if (fileType) return fileType;
		}
		if (this.check([77, 77])) {
			const fileType = await this.readTiffHeader(true);
			if (fileType) return fileType;
		}
		if (this.checkString("MAC ")) return {
			ext: "ape",
			mime: "audio/ape"
		};
		if (this.check([
			26,
			69,
			223,
			163
		])) return detectEbml(tokenizer);
		if (this.checkString("SQLi")) return {
			ext: "sqlite",
			mime: "application/x-sqlite3"
		};
		if (this.check([
			78,
			69,
			83,
			26
		])) return {
			ext: "nes",
			mime: "application/x-nintendo-nes-rom"
		};
		if (this.checkString("Cr24")) return {
			ext: "crx",
			mime: "application/x-google-chrome-extension"
		};
		if (this.checkString("MSCF") || this.checkString("ISc(")) return {
			ext: "cab",
			mime: "application/vnd.ms-cab-compressed"
		};
		if (this.check([
			237,
			171,
			238,
			219
		])) return {
			ext: "rpm",
			mime: "application/x-rpm"
		};
		if (this.check([
			197,
			208,
			211,
			198
		])) return {
			ext: "eps",
			mime: "application/eps"
		};
		if (this.check([
			40,
			181,
			47,
			253
		])) return {
			ext: "zst",
			mime: "application/zstd"
		};
		if (this.check([
			127,
			69,
			76,
			70
		])) return {
			ext: "elf",
			mime: "application/x-elf"
		};
		if (this.check([
			33,
			66,
			68,
			78
		])) return {
			ext: "pst",
			mime: "application/vnd.ms-outlook"
		};
		if (this.checkString("PAR1") || this.checkString("PARE")) return {
			ext: "parquet",
			mime: "application/vnd.apache.parquet"
		};
		if (this.checkString("ttcf")) return {
			ext: "ttc",
			mime: "font/collection"
		};
		if (this.check([
			254,
			237,
			250,
			206
		]) || this.check([
			254,
			237,
			250,
			207
		]) || this.check([
			206,
			250,
			237,
			254
		]) || this.check([
			207,
			250,
			237,
			254
		])) return {
			ext: "macho",
			mime: "application/x-mach-binary"
		};
		if (this.check([
			4,
			34,
			77,
			24
		])) return {
			ext: "lz4",
			mime: "application/x-lz4"
		};
		if (this.checkString("regf")) return {
			ext: "dat",
			mime: "application/x-ft-windows-registry-hive"
		};
		if (this.checkString("$FL2") || this.checkString("$FL3")) return {
			ext: "sav",
			mime: "application/x-spss-sav"
		};
		if (this.check([
			79,
			84,
			84,
			79,
			0
		])) return {
			ext: "otf",
			mime: "font/otf"
		};
		if (this.checkString("#!AMR")) return {
			ext: "amr",
			mime: "audio/amr"
		};
		if (this.checkString(String.raw`{\rtf`)) return {
			ext: "rtf",
			mime: "application/rtf"
		};
		if (this.check([
			70,
			76,
			86,
			1
		])) return {
			ext: "flv",
			mime: "video/x-flv"
		};
		if (this.checkString("IMPM")) return {
			ext: "it",
			mime: "audio/x-it"
		};
		if (this.checkString("-lh0-", { offset: 2 }) || this.checkString("-lh1-", { offset: 2 }) || this.checkString("-lh2-", { offset: 2 }) || this.checkString("-lh3-", { offset: 2 }) || this.checkString("-lh4-", { offset: 2 }) || this.checkString("-lh5-", { offset: 2 }) || this.checkString("-lh6-", { offset: 2 }) || this.checkString("-lh7-", { offset: 2 }) || this.checkString("-lzs-", { offset: 2 }) || this.checkString("-lz4-", { offset: 2 }) || this.checkString("-lz5-", { offset: 2 }) || this.checkString("-lhd-", { offset: 2 })) return {
			ext: "lzh",
			mime: "application/x-lzh-compressed"
		};
		if (this.check([
			0,
			0,
			1,
			186
		])) {
			if (this.check([33], {
				offset: 4,
				mask: [241]
			})) return {
				ext: "mpg",
				mime: "video/MP1S"
			};
			if (this.check([68], {
				offset: 4,
				mask: [196]
			})) return {
				ext: "mpg",
				mime: "video/MP2P"
			};
		}
		if (this.checkString("ITSF")) return {
			ext: "chm",
			mime: "application/vnd.ms-htmlhelp"
		};
		if (this.check([
			202,
			254,
			186,
			190
		])) {
			const machOArchitectureCount = UINT32_BE.get(this.buffer, 4);
			const javaClassFileMajorVersion = UINT16_BE.get(this.buffer, 6);
			if (machOArchitectureCount > 0 && machOArchitectureCount <= 30) return {
				ext: "macho",
				mime: "application/x-mach-binary"
			};
			if (javaClassFileMajorVersion > 30) return {
				ext: "class",
				mime: "application/java-vm"
			};
		}
		if (this.checkString(".RMF")) return {
			ext: "rm",
			mime: "application/vnd.rn-realmedia"
		};
		if (this.checkString("DRACO")) return {
			ext: "drc",
			mime: "application/x-ft-draco"
		};
		if (this.check([
			253,
			55,
			122,
			88,
			90,
			0
		])) return {
			ext: "xz",
			mime: "application/x-xz"
		};
		if (this.checkString("<?xml ")) return {
			ext: "xml",
			mime: "application/xml"
		};
		if (this.check([
			55,
			122,
			188,
			175,
			39,
			28
		])) return {
			ext: "7z",
			mime: "application/x-7z-compressed"
		};
		if (this.check([
			82,
			97,
			114,
			33,
			26,
			7
		]) && (this.buffer[6] === 0 || this.buffer[6] === 1)) return {
			ext: "rar",
			mime: "application/x-rar-compressed"
		};
		if (this.checkString("solid ")) return {
			ext: "stl",
			mime: "model/stl"
		};
		if (this.checkString("AC")) {
			const version = new StringType(4, "latin1").get(this.buffer, 2);
			if (/^\d+$/v.test(version) && version >= 1e3 && version <= 1050) return {
				ext: "dwg",
				mime: "image/vnd.dwg"
			};
		}
		if (this.checkString("070707")) return {
			ext: "cpio",
			mime: "application/x-cpio"
		};
		if (this.checkString("BLENDER")) return {
			ext: "blend",
			mime: "application/x-blender"
		};
		if (this.checkString("!<arch>")) {
			await tokenizer.ignore(8);
			if (await tokenizer.readToken(new StringType(13, "ascii")) === "debian-binary") return {
				ext: "deb",
				mime: "application/x-deb"
			};
			return {
				ext: "ar",
				mime: "application/x-unix-archive"
			};
		}
		if (this.checkString("WEBVTT") && [
			"\n",
			"\r",
			"	",
			" ",
			"\0"
		].some((char7) => this.checkString(char7, { offset: 6 }))) return {
			ext: "vtt",
			mime: "text/vtt"
		};
		if (this.check([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		])) return detectPng(tokenizer);
		if (this.check([
			65,
			82,
			82,
			79,
			87,
			49,
			0,
			0
		])) return {
			ext: "arrow",
			mime: "application/vnd.apache.arrow.file"
		};
		if (this.check([
			103,
			108,
			84,
			70,
			2,
			0,
			0,
			0
		])) return {
			ext: "glb",
			mime: "model/gltf-binary"
		};
		if (this.check([
			102,
			114,
			101,
			101
		], { offset: 4 }) || this.check([
			109,
			100,
			97,
			116
		], { offset: 4 }) || this.check([
			109,
			111,
			111,
			118
		], { offset: 4 }) || this.check([
			119,
			105,
			100,
			101
		], { offset: 4 })) return {
			ext: "mov",
			mime: "video/quicktime"
		};
		if (this.check([
			73,
			73,
			82,
			79,
			8,
			0,
			0,
			0,
			24
		])) return {
			ext: "orf",
			mime: "image/x-olympus-orf"
		};
		if (this.checkString("gimp xcf ")) return {
			ext: "xcf",
			mime: "image/x-xcf"
		};
		if (this.checkString("ftyp", { offset: 4 }) && (this.buffer[8] & 96) !== 0) {
			const brandMajor = new StringType(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
			switch (brandMajor) {
				case "avif":
				case "avis": return {
					ext: "avif",
					mime: "image/avif"
				};
				case "mif1": return {
					ext: "heic",
					mime: "image/heif"
				};
				case "msf1": return {
					ext: "heic",
					mime: "image/heif-sequence"
				};
				case "heic":
				case "heix": return {
					ext: "heic",
					mime: "image/heic"
				};
				case "hevc":
				case "hevx": return {
					ext: "heic",
					mime: "image/heic-sequence"
				};
				case "qt": return {
					ext: "mov",
					mime: "video/quicktime"
				};
				case "M4V":
				case "M4VH":
				case "M4VP": return {
					ext: "m4v",
					mime: "video/x-m4v"
				};
				case "M4P": return {
					ext: "m4p",
					mime: "video/mp4"
				};
				case "M4B": return {
					ext: "m4b",
					mime: "audio/mp4"
				};
				case "M4A": return {
					ext: "m4a",
					mime: "audio/x-m4a"
				};
				case "F4V": return {
					ext: "f4v",
					mime: "video/mp4"
				};
				case "F4P": return {
					ext: "f4p",
					mime: "video/mp4"
				};
				case "F4A": return {
					ext: "f4a",
					mime: "audio/mp4"
				};
				case "F4B": return {
					ext: "f4b",
					mime: "audio/mp4"
				};
				case "crx": return {
					ext: "cr3",
					mime: "image/x-canon-cr3"
				};
				default:
					if (brandMajor.startsWith("3g")) {
						if (brandMajor.startsWith("3g2")) return {
							ext: "3g2",
							mime: "video/3gpp2"
						};
						return {
							ext: "3gp",
							mime: "video/3gpp"
						};
					}
					return {
						ext: "mp4",
						mime: "video/mp4"
					};
			}
		}
		if (this.checkString("REGEDIT4\r\n")) return {
			ext: "reg",
			mime: "application/x-ms-regedit"
		};
		if (this.check([
			82,
			73,
			70,
			70
		])) {
			if (this.checkString("WEBP", { offset: 8 })) return {
				ext: "webp",
				mime: "image/webp"
			};
			if (this.check([
				65,
				86,
				73
			], { offset: 8 })) return {
				ext: "avi",
				mime: "video/vnd.avi"
			};
			if (this.check([
				87,
				65,
				86,
				69
			], { offset: 8 })) return {
				ext: "wav",
				mime: "audio/wav"
			};
			if (this.check([
				81,
				76,
				67,
				77
			], { offset: 8 })) return {
				ext: "qcp",
				mime: "audio/qcelp"
			};
		}
		if (this.check([
			73,
			73,
			85,
			0,
			24,
			0,
			0,
			0,
			136,
			231,
			116,
			216
		])) return {
			ext: "rw2",
			mime: "image/x-panasonic-rw2"
		};
		if (this.check([
			48,
			38,
			178,
			117,
			142,
			102,
			207,
			17,
			166,
			217
		])) return detectAsf(tokenizer);
		if (this.check([
			171,
			75,
			84,
			88,
			32,
			49,
			49,
			187,
			13,
			10,
			26,
			10
		])) return {
			ext: "ktx",
			mime: "image/ktx"
		};
		if ((this.check([
			126,
			16,
			4
		]) || this.check([
			126,
			24,
			4
		])) && this.check([
			48,
			77,
			73,
			69
		], { offset: 4 })) return {
			ext: "mie",
			mime: "application/x-mie"
		};
		if (this.check([
			39,
			10,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		], { offset: 2 })) return {
			ext: "shp",
			mime: "application/x-esri-shape"
		};
		if (this.check([
			255,
			79,
			255,
			81
		])) return {
			ext: "j2c",
			mime: "image/j2c"
		};
		if (this.check([
			0,
			0,
			0,
			12,
			106,
			80,
			32,
			32,
			13,
			10,
			135,
			10
		])) {
			await tokenizer.ignore(20);
			switch (await tokenizer.readToken(new StringType(4, "ascii"))) {
				case "jp2 ": return {
					ext: "jp2",
					mime: "image/jp2"
				};
				case "jpx ": return {
					ext: "jpx",
					mime: "image/jpx"
				};
				case "jpm ": return {
					ext: "jpm",
					mime: "image/jpm"
				};
				case "mjp2": return {
					ext: "mj2",
					mime: "image/mj2"
				};
				default: return;
			}
		}
		if (this.check([255, 10]) || this.check([
			0,
			0,
			0,
			12,
			74,
			88,
			76,
			32,
			13,
			10,
			135,
			10
		])) return {
			ext: "jxl",
			mime: "image/jxl"
		};
		if (this.check([254, 255])) {
			if (this.checkString("<?xml ", {
				offset: 2,
				encoding: "utf-16be"
			})) return {
				ext: "xml",
				mime: "application/xml"
			};
			return;
		}
		if (this.check([
			208,
			207,
			17,
			224,
			161,
			177,
			26,
			225
		])) return {
			ext: "cfb",
			mime: "application/x-cfb"
		};
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(256, tokenizer.fileInfo.size),
			mayBeLess: true
		});
		if (this.check([
			97,
			99,
			115,
			112
		], { offset: 36 })) return {
			ext: "icc",
			mime: "application/vnd.iccprofile"
		};
		if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 })) return {
			ext: "ace",
			mime: "application/x-ace-compressed"
		};
		if (this.checkString("BEGIN:")) {
			if (this.checkString("VCARD", { offset: 6 })) return {
				ext: "vcf",
				mime: "text/vcard"
			};
			if (this.checkString("VCALENDAR", { offset: 6 })) return {
				ext: "ics",
				mime: "text/calendar"
			};
		}
		if (this.checkString("FUJIFILMCCD-RAW")) return {
			ext: "raf",
			mime: "image/x-fujifilm-raf"
		};
		if (this.checkString("Extended Module:")) return {
			ext: "xm",
			mime: "audio/x-xm"
		};
		if (this.checkString("Creative Voice File")) return {
			ext: "voc",
			mime: "audio/x-voc"
		};
		if (this.check([
			4,
			0,
			0,
			0
		]) && this.buffer.length >= 16) {
			const jsonSize = new DataView(this.buffer.buffer).getUint32(12, true);
			if (jsonSize > 12 && this.buffer.length >= jsonSize + 16) try {
				const header = new TextDecoder().decode(this.buffer.subarray(16, jsonSize + 16));
				if (JSON.parse(header).files) return {
					ext: "asar",
					mime: "application/x-asar"
				};
			} catch {}
		}
		if (this.check([
			6,
			14,
			43,
			52,
			2,
			5,
			1,
			1,
			13,
			1,
			2,
			1,
			1,
			2
		])) return {
			ext: "mxf",
			mime: "application/mxf"
		};
		if (this.checkString("SCRM", { offset: 44 })) return {
			ext: "s3m",
			mime: "audio/x-s3m"
		};
		if (this.check([71]) && this.check([71], { offset: 188 })) return {
			ext: "mts",
			mime: "video/mp2t"
		};
		if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 })) return {
			ext: "mts",
			mime: "video/mp2t"
		};
		if (this.check([
			66,
			79,
			79,
			75,
			77,
			79,
			66,
			73
		], { offset: 60 })) return {
			ext: "mobi",
			mime: "application/x-mobipocket-ebook"
		};
		if (this.check([
			68,
			73,
			67,
			77
		], { offset: 128 })) return {
			ext: "dcm",
			mime: "application/dicom"
		};
		if (this.check([
			76,
			0,
			0,
			0,
			1,
			20,
			2,
			0,
			0,
			0,
			0,
			0,
			192,
			0,
			0,
			0,
			0,
			0,
			0,
			70
		])) return {
			ext: "lnk",
			mime: "application/x-ms-shortcut"
		};
		if (this.check([
			98,
			111,
			111,
			107,
			0,
			0,
			0,
			0,
			109,
			97,
			114,
			107,
			0,
			0,
			0,
			0
		])) return {
			ext: "alias",
			mime: "application/x-ft-apple.alias"
		};
		if (this.checkString("Kaydara FBX Binary  \0")) return {
			ext: "fbx",
			mime: "application/x-ft-fbx"
		};
		if (this.check([76, 80], { offset: 34 }) && (this.check([
			0,
			0,
			1
		], { offset: 8 }) || this.check([
			1,
			0,
			2
		], { offset: 8 }) || this.check([
			2,
			0,
			2
		], { offset: 8 }))) return {
			ext: "eot",
			mime: "application/vnd.ms-fontobject"
		};
		if (this.check([
			6,
			6,
			237,
			245,
			216,
			29,
			70,
			229,
			189,
			49,
			239,
			231,
			254,
			116,
			183,
			29
		])) return {
			ext: "indd",
			mime: "application/x-indesign"
		};
		if (this.check([
			255,
			255,
			0,
			0,
			7,
			0,
			0,
			0,
			4,
			0,
			0,
			0,
			1,
			0,
			1,
			0
		]) || this.check([
			0,
			0,
			255,
			255,
			0,
			0,
			0,
			7,
			0,
			0,
			0,
			4,
			0,
			1,
			0,
			1
		])) return {
			ext: "jmp",
			mime: "application/x-jmp-data"
		};
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(512, tokenizer.fileInfo.size),
			mayBeLess: true
		});
		if (this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([
			0,
			0,
			0,
			0,
			0,
			0
		], { offset: 257 }) && tarHeaderChecksumMatches(this.buffer)) return {
			ext: "tar",
			mime: "application/x-tar"
		};
		if (this.check([255, 254])) {
			const encoding = "utf-16le";
			if (this.checkString("<?xml ", {
				offset: 2,
				encoding
			})) return {
				ext: "xml",
				mime: "application/xml"
			};
			if (this.check([255, 14], { offset: 2 }) && this.checkString("SketchUp Model", {
				offset: 4,
				encoding
			})) return {
				ext: "skp",
				mime: "application/vnd.sketchup.skp"
			};
			if (this.checkString("Windows Registry Editor Version 5.00\r\n", {
				offset: 2,
				encoding
			})) return {
				ext: "reg",
				mime: "application/x-ms-regedit"
			};
			return;
		}
		if (this.checkString("-----BEGIN PGP MESSAGE-----")) return {
			ext: "pgp",
			mime: "application/pgp-encrypted"
		};
	};
	detectImprecise = async (tokenizer) => {
		this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
		const fileSize = getKnownFileSizeOrMaximum(tokenizer.fileInfo.size);
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(8, fileSize),
			mayBeLess: true
		});
		if (this.check([
			0,
			0,
			1,
			186
		]) || this.check([
			0,
			0,
			1,
			179
		])) return {
			ext: "mpg",
			mime: "video/mpeg"
		};
		if (this.check([
			0,
			1,
			0,
			0,
			0
		])) return {
			ext: "ttf",
			mime: "font/ttf"
		};
		if (this.check([
			0,
			0,
			1,
			0
		])) return {
			ext: "ico",
			mime: "image/x-icon"
		};
		if (this.check([
			0,
			0,
			2,
			0
		])) return {
			ext: "cur",
			mime: "image/x-icon"
		};
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(2 + this.options.mpegOffsetTolerance, fileSize),
			mayBeLess: true
		});
		if (this.buffer.length >= 2 + this.options.mpegOffsetTolerance) for (let depth = 0; depth <= this.options.mpegOffsetTolerance; ++depth) {
			const type = this.scanMpeg(depth);
			if (type) return type;
		}
	};
	async readTiffTag(bigEndian) {
		const tagId = await this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
		await this.tokenizer.ignore(10);
		switch (tagId) {
			case 50341: return {
				ext: "arw",
				mime: "image/x-sony-arw"
			};
			case 50706: return {
				ext: "dng",
				mime: "image/x-adobe-dng"
			};
			default:
		}
	}
	async readTiffIFD(bigEndian) {
		const numberOfTags = await this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
		if (numberOfTags > maximumTiffTagCount) return;
		if (hasUnknownFileSize(this.tokenizer) && 2 + numberOfTags * 12 > maximumTiffIfdOffsetInBytes) return;
		for (let n = 0; n < numberOfTags; ++n) {
			const fileType = await this.readTiffTag(bigEndian);
			if (fileType) return fileType;
		}
	}
	async readTiffHeader(bigEndian) {
		const tiffFileType = {
			ext: "tif",
			mime: "image/tiff"
		};
		const version = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 2);
		const ifdOffset = (bigEndian ? UINT32_BE : UINT32_LE).get(this.buffer, 4);
		if (version === 42) {
			if (ifdOffset >= 6) {
				if (this.checkString("CR", { offset: 8 })) return {
					ext: "cr2",
					mime: "image/x-canon-cr2"
				};
				if (ifdOffset >= 8) {
					const someId1 = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 8);
					const someId2 = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 10);
					if (someId1 === 28 && someId2 === 254 || someId1 === 31 && someId2 === 11) return {
						ext: "nef",
						mime: "image/x-nikon-nef"
					};
				}
			}
			if (hasUnknownFileSize(this.tokenizer) && ifdOffset > maximumTiffStreamIfdOffsetInBytes) return tiffFileType;
			const maximumTiffOffset = hasUnknownFileSize(this.tokenizer) ? maximumTiffIfdOffsetInBytes : this.tokenizer.fileInfo.size;
			try {
				await safeIgnore(this.tokenizer, ifdOffset, {
					maximumLength: maximumTiffOffset,
					reason: "TIFF IFD offset"
				});
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				throw error;
			}
			let fileType;
			try {
				fileType = await this.readTiffIFD(bigEndian);
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				throw error;
			}
			return fileType ?? tiffFileType;
		}
		if (version === 43) return tiffFileType;
	}
	/**
	Scan check MPEG 1 or 2 Layer 3 header, or 'layer 0' for ADTS (MPEG sync-word 0xFFE).
	
	@param offset - Offset to scan for sync-preamble.
	@returns {{ext: string, mime: string}}
	*/
	scanMpeg(offset) {
		if (this.check([255, 224], {
			offset,
			mask: [255, 224]
		})) {
			if (this.check([16], {
				offset: offset + 1,
				mask: [22]
			})) {
				if (this.check([8], {
					offset: offset + 1,
					mask: [8]
				})) return {
					ext: "aac",
					mime: "audio/aac"
				};
				return {
					ext: "aac",
					mime: "audio/aac"
				};
			}
			if (this.check([2], {
				offset: offset + 1,
				mask: [6]
			})) return {
				ext: "mp3",
				mime: "audio/mpeg"
			};
			if (this.check([4], {
				offset: offset + 1,
				mask: [6]
			})) return {
				ext: "mp2",
				mime: "audio/mpeg"
			};
			if (this.check([6], {
				offset: offset + 1,
				mask: [6]
			})) return {
				ext: "mp1",
				mime: "audio/mpeg"
			};
		}
	}
};
const supportedExtensions = new Set(extensions);
const supportedMimeTypes = new Set(mimeTypes);

//#endregion
//#region ../../packages/media/dist/server.mjs
var __defProp = Object.defineProperty;
var __exportAll = (all, symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var utils_exports = /* @__PURE__ */ __exportAll({
	calculateFallbackMetadata: () => calculateFallbackMetadata,
	fixWebmMetadata: () => fixWebmMetadata,
	generateImageThumbnail: () => generateImageThumbnail,
	generateVideoThumbnail: () => generateVideoThumbnail,
	getAudioDetails: () => getAudioDetails,
	getMediaDuration: () => getMediaDuration,
	getVideoMetadata: () => getVideoMetadata,
	urlToBase64: () => urlToBase64
});
/**
* Gets the duration of media (video/audio) using ffprobe.
*/
async function getMediaDuration(bufferOrUrl, mimeType) {
	const isUrl = typeof bufferOrUrl === "string";
	let inputPath = "";
	let tempFile = "";
	let type;
	if (isUrl) inputPath = bufferOrUrl;
	else {
		const tempDir = os.tmpdir();
		type = await fileTypeFromBuffer(bufferOrUrl);
		let ext = type ? `.${type.ext}` : "";
		if (!ext && mimeType) ext = {
			"audio/mpeg": ".mp3",
			"audio/mp3": ".mp3",
			"audio/wav": ".wav",
			"audio/x-wav": ".wav",
			"audio/ogg": ".ogg",
			"audio/aac": ".aac",
			"audio/m4a": ".m4a",
			"audio/x-m4a": ".m4a",
			"audio/mp4": ".m4a",
			"video/mp4": ".mp4",
			"video/quicktime": ".mov",
			"video/x-matroska": ".mkv"
		}[mimeType] || "";
		tempFile = path.join(tempDir, `temp_media_${generateId()}${ext}`);
		await fs.writeFile(tempFile, bufferOrUrl);
		inputPath = tempFile;
	}
	try {
		return await new Promise((resolve$1, reject) => {
			const ffprobe = spawn("ffprobe", [
				"-v",
				"error",
				"-show_entries",
				"format=duration",
				"-of",
				"default=noprint_wrappers=1:nokey=1",
				inputPath
			]);
			let output = "";
			let errorOutput = "";
			ffprobe.stdout.on("data", (data) => {
				output += data.toString();
			});
			ffprobe.stderr.on("data", (data) => {
				errorOutput += data.toString();
			});
			ffprobe.on("error", (err$1) => {
				reject(/* @__PURE__ */ new Error(`Failed to start ffprobe: ${err$1.message}`));
			});
			ffprobe.on("close", (code) => {
				if (code === 0) {
					const duration = parseFloat(output.trim());
					resolve$1(Number.isNaN(duration) ? null : duration);
				} else {
					const details = isUrl ? `url: ${bufferOrUrl}` : `buffer size: ${bufferOrUrl.length}, hint: ${mimeType}, detected: ${type?.mime}`;
					reject(/* @__PURE__ */ new Error(`ffprobe exited with code ${code}. stderr: ${errorOutput.trim()}. details: ${details}`));
				}
			});
		});
	} finally {
		if (tempFile) try {
			await fs.unlink(tempFile);
		} catch (err$1) {
			mediaLogger.error({ err: err$1 }, "Failed to delete temp file");
		}
	}
}
/**
* Gets video metadata (width, height, fps, duration) using ffprobe.
*/
async function getVideoMetadata(bufferOrUrl) {
	const isUrl = typeof bufferOrUrl === "string";
	let inputPath = "";
	let tempFile = "";
	if (isUrl) inputPath = bufferOrUrl;
	else {
		const tempDir = os.tmpdir();
		const type = await fileTypeFromBuffer(bufferOrUrl);
		const ext = type ? `.${type.ext}` : "";
		tempFile = path.join(tempDir, `temp_video_meta_${generateId()}${ext}`);
		await fs.writeFile(tempFile, bufferOrUrl);
		inputPath = tempFile;
	}
	try {
		return await new Promise((resolve$1, reject) => {
			const ffprobe = spawn("ffprobe", [
				"-v",
				"error",
				"-select_streams",
				"v:0",
				"-show_entries",
				"stream=width,height,avg_frame_rate,duration",
				"-of",
				"json",
				inputPath
			]);
			let output = "";
			let errorOutput = "";
			ffprobe.stdout.on("data", (data) => {
				output += data.toString();
			});
			ffprobe.stderr.on("data", (data) => {
				errorOutput += data.toString();
			});
			ffprobe.on("error", (err$1) => {
				reject(/* @__PURE__ */ new Error(`Failed to start ffprobe: ${err$1.message}`));
			});
			ffprobe.on("close", (code) => {
				if (code === 0) try {
					const stream = JSON.parse(output).streams?.[0];
					if (!stream) return resolve$1(null);
					const width = Number(stream.width);
					const height = Number(stream.height);
					const duration = parseFloat(stream.duration);
					let fps = 0;
					if (stream.avg_frame_rate) {
						const [num, den] = stream.avg_frame_rate.split("/");
						if (num && den) fps = Number(num) / Number(den);
					}
					resolve$1({
						width: Number.isNaN(width) ? 0 : width,
						height: Number.isNaN(height) ? 0 : height,
						fps: Number.isNaN(fps) ? 0 : fps,
						duration: Number.isNaN(duration) ? 0 : duration
					});
				} catch (err$1) {
					reject(/* @__PURE__ */ new Error(`Failed to parse ffprobe output: ${err$1}`));
				}
				else reject(/* @__PURE__ */ new Error(`ffprobe exited with code ${code}. stderr: ${errorOutput.trim()}`));
			});
		});
	} finally {
		if (tempFile) try {
			await fs.unlink(tempFile);
		} catch (err$1) {
			mediaLogger.error({ err: err$1 }, "Failed to delete temp file");
		}
	}
}
/**
* Generates a thumbnail buffer from a video URL using FFmpeg and Sharp.
*/
async function generateVideoThumbnail(videoUrl, width, height) {
	return new Promise((resolve$1, reject) => {
		const ffmpeg = spawn("ffmpeg", [
			"-i",
			videoUrl,
			"-ss",
			"00:00:00.500",
			"-vframes",
			"1",
			"-f",
			"image2pipe",
			"-vcodec",
			"png",
			"-"
		]);
		const chunks = [];
		const errChunks = [];
		ffmpeg.stdout.on("data", (chunk) => {
			chunks.push(chunk);
		});
		ffmpeg.stderr.on("data", (chunk) => {
			errChunks.push(chunk);
		});
		ffmpeg.on("close", async (code) => {
			if (code !== 0) {
				const errorMessage = Buffer.concat(errChunks).toString();
				mediaLogger.error({ err: errorMessage }, "FFmpeg error");
				return reject(/* @__PURE__ */ new Error(`FFmpeg process exited with code ${code}. stderr: ${errorMessage.trim()}`));
			}
			const rawFrame = Buffer.concat(chunks);
			if (rawFrame.length === 0) return reject(/* @__PURE__ */ new Error("FFmpeg produced no output"));
			try {
				resolve$1(await sharp(rawFrame).resize({
					width,
					height,
					fit: "cover",
					position: "center"
				}).toFormat("webp", { quality: 80 }).toBuffer());
			} catch (error) {
				reject(error);
			}
		});
		ffmpeg.on("error", (err$1) => {
			reject(err$1);
		});
	});
}
/**
* Generates a thumbnail from an image buffer using Sharp.
*/
async function generateImageThumbnail(imageBuffer, width, height) {
	return sharp(imageBuffer).rotate().resize({
		width,
		height,
		fit: "cover",
		position: "center"
	}).toFormat("webp", { quality: 70 }).toBuffer();
}
/**
* Fetches a file from a URL and converts it to a base64 string
*/
async function urlToBase64(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
	const arrayBuffer = await response.arrayBuffer();
	return Buffer.from(arrayBuffer).toString("base64");
}
/**
* Remuxes a WebM buffer using FFmpeg to fix missing track durations and metadata.
*/
async function fixWebmMetadata(buffer) {
	const tempDir = os.tmpdir();
	const id = generateId();
	const tempIn = path.join(tempDir, `in_${id}.webm`);
	const tempOut = path.join(tempDir, `out_${id}.webm`);
	await fs.writeFile(tempIn, buffer);
	return new Promise((resolve$1, _reject) => {
		const ffmpeg = spawn("ffmpeg", [
			"-i",
			tempIn,
			"-c",
			"copy",
			"-y",
			tempOut
		]);
		let errorOutput = "";
		ffmpeg.stderr.on("data", (data) => {
			errorOutput += data.toString();
		});
		ffmpeg.on("close", async (code) => {
			try {
				if (code === 0) resolve$1(await fs.readFile(tempOut));
				else {
					mediaLogger.warn({
						code,
						err: errorOutput
					}, "ffmpeg fixWebmMetadata failed");
					resolve$1(buffer);
				}
			} catch (err$1) {
				mediaLogger.error({ err: err$1 }, "Failed to read fixed webm");
				resolve$1(buffer);
			} finally {
				fs.unlink(tempIn).catch((err$1) => {
					mediaLogger.error({
						err: err$1,
						path: tempIn
					}, "Cleanup: Failed to unlink tempIn");
				});
				fs.unlink(tempOut).catch((err$1) => {
					mediaLogger.error({
						err: err$1,
						path: tempOut
					}, "Cleanup: Failed to unlink tempOut");
				});
			}
		});
		ffmpeg.on("error", (err$1) => {
			mediaLogger.error({ err: err$1 }, "ffmpeg fixWebmMetadata spawn error");
			resolve$1(buffer);
		});
	});
}
/**
* Deeply calculates duration and FPS by running a full decode pass via FFmpeg.
* Useful for browser WebM streams where headers are empty or inaccurate.
*/
async function calculateFallbackMetadata(bufferOrUrl) {
	const isUrl = typeof bufferOrUrl === "string";
	let inputPath = "";
	let tempFile = "";
	if (isUrl) inputPath = bufferOrUrl;
	else {
		const tempDir = os.tmpdir();
		const id = generateId();
		tempFile = path.join(tempDir, `parse_${id}.webm`);
		await fs.writeFile(tempFile, bufferOrUrl);
		inputPath = tempFile;
	}
	return new Promise((resolve$1) => {
		const ffmpeg = spawn("ffmpeg", [
			"-v",
			"error",
			"-stats",
			"-i",
			inputPath,
			"-f",
			"null",
			"-"
		]);
		let output = "";
		ffmpeg.stderr.on("data", (data) => {
			output += data.toString();
		});
		ffmpeg.on("close", async () => {
			if (tempFile) try {
				await fs.unlink(tempFile);
			} catch (err$1) {
				mediaLogger.error({
					err: err$1,
					path: tempFile
				}, "Cleanup: Failed to unlink tempFile in fallback metadata");
			}
			const frameMatch = [...output.matchAll(/frame=\s*(\d+)/g)].pop();
			const timeMatch = [...output.matchAll(/time=(\d{2}):(\d{2}):(\d{2}\.\d+)/g)].pop();
			if (timeMatch) {
				const hours = parseInt(timeMatch[1], 10);
				const minutes = parseInt(timeMatch[2], 10);
				const seconds = parseFloat(timeMatch[3]);
				const duration = hours * 3600 + minutes * 60 + seconds;
				let fps = 30;
				if (frameMatch && duration > 0) {
					const frames = parseInt(frameMatch[1], 10);
					if (frames > 0) fps = frames / duration;
				}
				resolve$1({
					duration,
					fps
				});
				return;
			}
			resolve$1(null);
		});
		ffmpeg.on("error", () => resolve$1(null));
	});
}
async function getAudioDetails(bufferOrUrl) {
	const isUrl = typeof bufferOrUrl === "string";
	let inputPath = "";
	let tempFile = "";
	if (isUrl) inputPath = bufferOrUrl;
	else {
		const tempDir = os.tmpdir();
		const type = await fileTypeFromBuffer(bufferOrUrl);
		const ext = type ? `.${type.ext}` : "";
		tempFile = path.join(tempDir, `temp_audio_details_${generateId()}${ext}`);
		await fs.writeFile(tempFile, bufferOrUrl);
		inputPath = tempFile;
	}
	try {
		const streamInfo = await new Promise((resolve$1, reject) => {
			const ffprobe = spawn("ffprobe", [
				"-v",
				"error",
				"-select_streams",
				"a:0",
				"-show_entries",
				"stream=codec_name,sample_rate,channels,bits_per_sample,bits_per_raw_sample,bit_rate",
				"-of",
				"json",
				inputPath
			]);
			let output = "";
			let errorOutput = "";
			ffprobe.stdout.on("data", (data) => {
				output += data.toString();
			});
			ffprobe.stderr.on("data", (data) => {
				errorOutput += data.toString();
			});
			ffprobe.on("error", (err$1) => {
				reject(/* @__PURE__ */ new Error(`Failed to start ffprobe: ${err$1.message}`));
			});
			ffprobe.on("close", (code) => {
				if (code === 0) try {
					const stream = JSON.parse(output).streams?.[0];
					resolve$1(stream || null);
				} catch (err$1) {
					reject(/* @__PURE__ */ new Error(`Failed to parse ffprobe output: ${err$1}`));
				}
				else reject(/* @__PURE__ */ new Error(`ffprobe exited with code ${code}. stderr: ${errorOutput}`));
			});
		});
		if (!streamInfo) return null;
		const sampleRate = streamInfo.sample_rate ? parseInt(streamInfo.sample_rate, 10) : null;
		const channels = streamInfo.channels != null ? streamInfo.channels : null;
		let bitDepth = null;
		if (streamInfo.bits_per_sample != null) bitDepth = streamInfo.bits_per_sample;
		else if (streamInfo.bits_per_raw_sample != null) bitDepth = parseInt(streamInfo.bits_per_raw_sample, 10);
		const audioCodec = streamInfo.codec_name || null;
		const audioBitrate = streamInfo.bit_rate ? parseInt(streamInfo.bit_rate, 10) : null;
		return {
			sampleRate,
			channels,
			bitDepth,
			audioCodec,
			audioBitrate
		};
	} catch (err$1) {
		mediaLogger.error({ err: err$1 }, "Failed to extract audio details");
		return null;
	} finally {
		if (tempFile) try {
			await fs.unlink(tempFile);
		} catch (err$1) {
			mediaLogger.error({ err: err$1 }, "Failed to delete temp file in getAudioDetails");
		}
	}
}
const ANONYMOUS_MAX_ASSET_COUNT = 5;
const ANONYMOUS_MAX_TOTAL_SIZE_BYTES = 500 * 1024 * 1024;
async function checkAnonymousUploadLimits({ userId, anonymousSessionId, incomingCount = 1, incomingBytes = 0 }) {
	if (userId) return;
	const stats = await prisma.fileAsset.aggregate({
		where: {
			userId: null,
			anonymousSessionId: anonymousSessionId || null
		},
		_count: { id: true },
		_sum: { size: true }
	});
	const currentCount = stats._count.id ?? 0;
	const currentSize = stats._sum.size ?? 0;
	if (currentCount + incomingCount > ANONYMOUS_MAX_ASSET_COUNT) throw new Error(`Anonymous upload limit reached (maximum ${ANONYMOUS_MAX_ASSET_COUNT} assets). Please sign in to upload more.`);
	if (currentSize + incomingBytes > ANONYMOUS_MAX_TOTAL_SIZE_BYTES) throw new Error("Anonymous upload limit reached (maximum 500 MB total size). Please sign in to upload more.");
}
function isLottieJson(obj) {
	if (typeof obj !== "object" || obj === null) return false;
	const dict = obj;
	return "layers" in dict && Array.isArray(dict.layers);
}
function processAndValidateLottie(buffer, filename, mimeType) {
	const ext = filename.toLowerCase().split(".").pop();
	const isLottieExt = ext === "lottie";
	const isJsonExt = ext === "json";
	if (isLottieExt) try {
		const unzipped = unzipSync(new Uint8Array(buffer));
		let animationContent;
		const manifestKey = Object.keys(unzipped).find((k) => k.toLowerCase() === "manifest.json");
		if (manifestKey) try {
			const manifestStr = strFromU8(unzipped[manifestKey]);
			const manifest = JSON.parse(manifestStr);
			if (manifest && Array.isArray(manifest.animations) && manifest.animations.length > 0) {
				const initialId = manifest.initial;
				const fileKey = (manifest.animations.find((a) => a.id === initialId) || manifest.animations[0]).file;
				if (fileKey && unzipped[fileKey]) animationContent = unzipped[fileKey];
			}
		} catch (err$1) {
			logger.error({ err: err$1 }, "Failed to parse manifest.json from .lottie zip");
		}
		if (!animationContent) {
			const jsonKeys = Object.keys(unzipped).filter((k) => k.toLowerCase().endsWith(".json") && k.toLowerCase() !== "manifest.json");
			for (const key of jsonKeys) try {
				if (isLottieJson(JSON.parse(strFromU8(unzipped[key])))) {
					animationContent = unzipped[key];
					break;
				}
			} catch {}
		}
		if (!animationContent) throw new Error("No valid Lottie animation JSON file found inside .lottie archive");
		const text = strFromU8(animationContent);
		if (!isLottieJson(JSON.parse(text))) throw new Error("Extracted file from .lottie archive is not a valid Lottie animation");
		return {
			buffer: Buffer.from(text),
			filename: filename.replace(/\.lottie$/i, ".json"),
			contentType: "application/json"
		};
	} catch (error) {
		throw new Error(`Failed to process .lottie file: ${error.message}`);
	}
	if (isJsonExt || mimeType === "application/json" || mimeType === "text/json") try {
		const text = buffer.toString("utf-8");
		if (!isLottieJson(JSON.parse(text))) throw new Error("Not a valid Lottie animation (missing 'layers' array)");
		return {
			buffer,
			filename,
			contentType: "application/json"
		};
	} catch (error) {
		throw new Error(`Invalid JSON Lottie file: ${error.message}`);
	}
	return {
		buffer,
		filename,
		contentType: mimeType ?? "application/octet-stream"
	};
}
function extractCaptionDuration(buffer) {
	try {
		const str = buffer.toString("utf-8");
		const regex = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/g;
		let maxTimeSec = 0;
		let match;
		while ((match = regex.exec(str)) !== null) {
			const hours = parseInt(match[1], 10);
			const minutes = parseInt(match[2], 10);
			const seconds = parseInt(match[3], 10);
			const ms = parseInt(match[4], 10);
			const timeSec = hours * 3600 + minutes * 60 + seconds + ms / 1e3;
			if (timeSec > maxTimeSec) maxTimeSec = timeSec;
		}
		return maxTimeSec > 0 ? maxTimeSec : null;
	} catch {
		return null;
	}
}
async function resolveDataType(contentType, filename, buffer) {
	const ext = filename.toLowerCase().split(".").pop();
	if (ext === "cube") return "LUT";
	if (contentType === "image/svg+xml") return "SVG";
	if (contentType === "image/gif" || ext === "gif") return "GIF";
	if (contentType === "image/webp" || ext === "webp") {
		if (buffer) try {
			if (((await sharp(buffer).metadata()).pages || 1) > 1) return "GIF";
		} catch (error) {
			logger.error({ err: error }, "Failed to detect WebP animation");
		}
		return "Image";
	}
	if (contentType.startsWith("image/")) return "Image";
	if (contentType.startsWith("video/")) return "Video";
	if (contentType.startsWith("audio/")) return "Audio";
	if (ext === "srt") return "Caption";
	if (contentType === "text/srt") return "Caption";
	if (contentType === "application/json" || contentType === "text/json") return "Lottie";
	if (ext === "json" || ext === "lottie") return "Lottie";
	throw new Error(`Unsupported content type for Import Node: ${contentType}`);
}
/**
* Uploads a buffer to GCS, creates a FileAsset record, and appends an output
* entry to the node's result.
*
* Ordering guarantees:
* 1. Storage upload happens first — no DB rows are written if this fails.
* 2. FileAsset creation and node update are wrapped in a transaction —
* failure leaves no orphaned asset records.
*/
async function extractMediaMetadata(bufferOrUrl, contentType, dataType) {
	let buffer;
	if (typeof bufferOrUrl === "string") if (dataType !== "Video" && dataType !== "Audio") {
		const res = await fetch(bufferOrUrl);
		if (!res.ok) throw new Error(`Failed to fetch media from URL: ${res.statusText}`);
		buffer = Buffer.from(await res.arrayBuffer());
	} else buffer = Buffer.alloc(0);
	else buffer = bufferOrUrl;
	const mediaSource = typeof bufferOrUrl === "string" && (dataType === "Video" || dataType === "Audio") ? bufferOrUrl : buffer;
	let width = null;
	let height = null;
	let durationInSec = null;
	let fps = null;
	let sampleRate = null;
	let channels = null;
	let bitDepth = null;
	let audioCodec = null;
	let audioBitrate = null;
	if (dataType === "Image") {
		const meta = await container.get(TOKENS.MEDIA).getImageDimensions(buffer);
		width = meta.width || null;
		height = meta.height || null;
		if (width == null || height == null) throw new Error("Failed to extract image dimensions");
	} else if (dataType === "SVG") try {
		const dim = extractSvgDimensions(buffer);
		const w = dim?.w || 0;
		const h = dim?.h || 0;
		if (w === 0 || h === 0) {
			width = 1080;
			height = 1080;
		} else {
			width = w;
			height = h;
		}
	} catch (error) {
		logger.error({ err: error }, "Failed to extract SVG dimensions");
		width = 1080;
		height = 1080;
	}
	else if (dataType === "Video") {
		const meta = await getVideoMetadata(mediaSource);
		if (!meta) throw new Error("Failed to extract video metadata");
		width = meta.width;
		height = meta.height;
		durationInSec = meta.duration;
		fps = meta.fps;
		if (durationInSec === 0 || fps === 0) {
			const { calculateFallbackMetadata: calculateFallbackMetadata$1 } = await Promise.resolve().then(() => utils_exports);
			const fallback = await calculateFallbackMetadata$1(mediaSource);
			if (fallback && fallback.duration > 0) {
				durationInSec = fallback.duration;
				if (fps === 0 || Number.isNaN(fps)) fps = fallback.fps;
			}
		}
		if (width === 0 || height === 0 || durationInSec === 0 || fps === 0) throw new Error(`Incomplete video metadata: width=${width}, height=${height}, duration=${durationInSec}, fps=${fps}`);
		const audioDetails = await getAudioDetails(mediaSource);
		if (audioDetails) {
			sampleRate = audioDetails.sampleRate;
			channels = audioDetails.channels;
			bitDepth = audioDetails.bitDepth;
			audioCodec = audioDetails.audioCodec;
			audioBitrate = audioDetails.audioBitrate;
		}
	} else if (dataType === "Audio") {
		durationInSec = await getMediaDuration(mediaSource, contentType);
		if (durationInSec == null || durationInSec === 0) {
			const { calculateFallbackMetadata: calculateFallbackMetadata$1 } = await Promise.resolve().then(() => utils_exports);
			const fallback = await calculateFallbackMetadata$1(mediaSource);
			if (fallback && fallback.duration > 0) durationInSec = fallback.duration;
		}
		if (durationInSec == null || durationInSec === 0) throw new Error("Failed to extract audio duration");
		const audioDetails = await getAudioDetails(mediaSource);
		if (audioDetails) {
			sampleRate = audioDetails.sampleRate;
			channels = audioDetails.channels;
			bitDepth = audioDetails.bitDepth;
			audioCodec = audioDetails.audioCodec;
			audioBitrate = audioDetails.audioBitrate;
		}
	} else if (dataType === "Caption") {
		const captionDuration = extractCaptionDuration(buffer);
		if (captionDuration) durationInSec = captionDuration;
	} else if (dataType === "Lottie") try {
		const parsed = JSON.parse(buffer.toString("utf-8"));
		width = typeof parsed.w === "number" ? parsed.w : null;
		height = typeof parsed.h === "number" ? parsed.h : null;
		fps = typeof parsed.fr === "number" ? parsed.fr : null;
		const ip = typeof parsed.ip === "number" ? parsed.ip : 0;
		const op = typeof parsed.op === "number" ? parsed.op : 0;
		if (fps && fps > 0 && op > ip) durationInSec = (op - ip) / fps;
	} catch (error) {
		logger.error({ err: error }, "Failed to extract Lottie metadata");
	}
	else if (dataType === "GIF") try {
		const metadata = await sharp(buffer).metadata();
		width = metadata.width || null;
		height = metadata.height || null;
		const delay = metadata.delay;
		const pages = metadata.pages || 1;
		if (delay && delay.length > 0) {
			durationInSec = delay.reduce((acc, d) => acc + d, 0) / 1e3;
			fps = durationInSec > 0 ? Math.round(pages / durationInSec) : null;
		} else if (pages > 1) {
			durationInSec = pages * 100 / 1e3;
			fps = 10;
		} else {
			durationInSec = null;
			fps = null;
		}
	} catch (error) {
		logger.error({ err: error }, "Failed to extract GIF metadata");
	}
	else if (dataType === "LUT") {
		let type = "3D";
		let size = 33;
		if (buffer) {
			const lines = buffer.toString("utf-8").split(/\r?\n/);
			for (const line of lines) {
				const trimmed = line.trim();
				if (trimmed.startsWith("LUT_3D_SIZE")) {
					const parts = trimmed.split(/\s+/);
					const parsedSize = parseInt(parts[1], 10);
					if (!isNaN(parsedSize)) {
						size = parsedSize;
						type = "3D";
					}
					break;
				} else if (trimmed.startsWith("LUT_1D_SIZE")) {
					const parts = trimmed.split(/\s+/);
					const parsedSize = parseInt(parts[1], 10);
					if (!isNaN(parsedSize)) {
						size = parsedSize;
						type = "1D";
					}
					break;
				}
			}
		}
		width = size;
		height = type === "3D" ? 3 : 1;
	}
	return {
		width,
		height,
		durationInSec,
		fps,
		sampleRate,
		channels,
		bitDepth,
		audioCodec,
		audioBitrate
	};
}
/**
* Creates a FileAsset record in the database.
* This function only performs DB operations and can be called within a transaction.
*/
async function createFileAsset(tx, { userId, anonymousSessionId, buffer, filename, mimeType, preExtracted }) {
	if (!buffer && !preExtracted) throw new Error("Either buffer or preExtracted must be provided");
	if (buffer && !buffer.length) throw new Error("Upload buffer must not be empty");
	let key;
	let finalContentType;
	let dataType;
	let width;
	let height;
	let durationInSec;
	let fps;
	let sampleRate = null;
	let channels = null;
	let bitDepth = null;
	let audioCodec = null;
	let audioBitrate = null;
	if (preExtracted) {
		key = preExtracted.key;
		finalContentType = preExtracted.contentType;
		dataType = preExtracted.dataType;
		({width, height, durationInSec, fps, sampleRate, channels, bitDepth, audioCodec, audioBitrate} = {
			sampleRate: null,
			channels: null,
			bitDepth: null,
			audioCodec: null,
			audioBitrate: null,
			...preExtracted.metadata
		});
	} else {
		if (!buffer) throw new Error("Buffer must be provided if preExtracted is not present");
		finalContentType = mimeType ?? (await fileTypeFromBuffer(buffer))?.mime ?? "application/octet-stream";
		const processed = processAndValidateLottie(buffer, filename, finalContentType);
		buffer = processed.buffer;
		filename = processed.filename;
		finalContentType = processed.contentType;
		dataType = await resolveDataType(finalContentType, filename, buffer);
		if (finalContentType === "video/webm" || finalContentType === "audio/webm") buffer = await fixWebmMetadata(buffer);
		const meta = await extractMediaMetadata(buffer, finalContentType, dataType);
		width = meta.width;
		height = meta.height;
		durationInSec = meta.durationInSec;
		fps = meta.fps;
		sampleRate = meta.sampleRate ?? null;
		channels = meta.channels ?? null;
		bitDepth = meta.bitDepth ?? null;
		audioCodec = meta.audioCodec ?? null;
		audioBitrate = meta.audioBitrate ?? null;
		key = getAssetKey(`${generateId()}-${filename}`);
		await container.get(TOKENS.STORAGE).uploadToStorage(buffer, key, finalContentType, ENV_CONFIG.R2_ASSETS_BUCKET);
	}
	return {
		asset: await tx.fileAsset.create({ data: {
			name: filename,
			userId: userId || null,
			anonymousSessionId: anonymousSessionId || null,
			bucket: ENV_CONFIG.R2_ASSETS_BUCKET,
			key,
			isUploaded: true,
			duration: durationInSec != null ? Math.round(durationInSec * 1e3) : void 0,
			size: buffer ? buffer.length : preExtracted?.size ?? 0,
			width,
			height,
			fps: fps != null ? Math.round(fps) : void 0,
			mimeType: finalContentType,
			sampleRate,
			channels,
			bitDepth,
			audioCodec,
			audioBitrate
		} }),
		dataType
	};
}
/**
* Uploads a buffer to GCS, creates a FileAsset record, and appends an output
* entry to the node's result.
*
* Ordering guarantees:
* 1. Metadata extraction and Storage upload happen first — no DB rows are written if this fails.
* 2. FileAsset creation and node update are wrapped in a transaction —
* failure leaves no orphaned asset records.
*/
async function uploadToImportNode({ nodeId, buffer, filename, mimeType, userId, anonymousSessionId }) {
	const node = await prisma.node.findUniqueOrThrow({
		where: { id: nodeId },
		include: {
			canvas: { select: {
				id: true,
				userId: true,
				anonymousSessionId: true
			} },
			handles: {
				where: { type: "Output" },
				orderBy: { order: "asc" },
				take: 1
			}
		}
	});
	if (userId && node.canvas.userId && node.canvas.userId !== userId) throw new Error("Unauthorized: Node does not belong to user");
	const outputHandle = node.handles[0];
	if (!outputHandle) throw new Error(`No output handle found for node ${nodeId}`);
	const effectiveAnonId = anonymousSessionId || node.canvas.anonymousSessionId || null;
	await checkAnonymousUploadLimits({
		userId: userId || node.canvas.userId,
		anonymousSessionId: effectiveAnonId,
		incomingCount: 1,
		incomingBytes: buffer.length
	});
	let finalContentType = mimeType ?? (await fileTypeFromBuffer(buffer))?.mime ?? "application/octet-stream";
	const processed = processAndValidateLottie(buffer, filename, finalContentType);
	buffer = processed.buffer;
	filename = processed.filename;
	finalContentType = processed.contentType;
	const dataType = await resolveDataType(finalContentType, filename, buffer);
	if (finalContentType === "video/webm" || finalContentType === "audio/webm") buffer = await fixWebmMetadata(buffer);
	const metadata = await extractMediaMetadata(buffer, finalContentType, dataType);
	const key = getAssetKey(`${generateId()}-${filename}`);
	await container.get(TOKENS.STORAGE).uploadToStorage(buffer, key, finalContentType, ENV_CONFIG.R2_ASSETS_BUCKET);
	try {
		return await prisma.$transaction(async (tx) => {
			const targetUserId = userId || node.canvas.userId || null;
			const { asset } = await createFileAsset(tx, {
				userId: targetUserId,
				anonymousSessionId: targetUserId ? null : anonymousSessionId,
				buffer,
				filename,
				mimeType,
				preExtracted: {
					key,
					contentType: finalContentType,
					dataType,
					metadata
				}
			});
			const currentResult = (await tx.node.findUniqueOrThrow({
				where: { id: nodeId },
				select: { result: true }
			})).result ?? { outputs: [] };
			const outputs = currentResult.outputs ?? [];
			const newOutput = { items: [{
				outputHandleId: outputHandle.id,
				data: createVirtualMedia({ entity: asset }, dataType),
				type: dataType
			}] };
			return tx.node.update({
				where: { id: nodeId },
				data: { result: {
					...currentResult,
					selectedOutputIndex: outputs.length,
					outputs: [...outputs, newOutput]
				} },
				include: { handles: true }
			});
		});
	} catch (err$1) {
		container.get(TOKENS.STORAGE).deleteFromStorage?.(key, ENV_CONFIG.R2_ASSETS_BUCKET).catch((cleanupErr) => {
			logger.error({
				err: cleanupErr,
				key,
				bucket: ENV_CONFIG.R2_ASSETS_BUCKET
			}, "Failed to clean up orphaned storage object");
		});
		throw err$1;
	}
}
async function prepareUploadToImportNode({ nodeId, filename, mimeType, fileSize, userId, anonymousSessionId }) {
	const node = await prisma.node.findUniqueOrThrow({
		where: { id: nodeId },
		include: { canvas: { select: {
			id: true,
			userId: true,
			anonymousSessionId: true
		} } }
	});
	if (userId && node.canvas.userId && node.canvas.userId !== userId) throw new Error("Unauthorized: Node does not belong to user");
	const effectiveAnonId = anonymousSessionId || node.canvas.anonymousSessionId || null;
	await checkAnonymousUploadLimits({
		userId: userId || node.canvas.userId,
		anonymousSessionId: effectiveAnonId,
		incomingCount: 1,
		incomingBytes: fileSize ?? 0
	});
	const key = getAssetKey(`${generateId()}-${filename}`);
	return {
		key,
		signedUrl: await container.get(TOKENS.STORAGE).generateSignedPutUrl(key, ENV_CONFIG.R2_ASSETS_BUCKET, mimeType)
	};
}
async function finishUploadToImportNode({ nodeId, key, filename, mimeType, userId, anonymousSessionId }) {
	const node = await prisma.node.findUniqueOrThrow({
		where: { id: nodeId },
		include: {
			canvas: { select: {
				id: true,
				userId: true,
				anonymousSessionId: true
			} },
			handles: {
				where: { type: "Output" },
				orderBy: { order: "asc" },
				take: 1
			}
		}
	});
	if (userId && node.canvas.userId && node.canvas.userId !== userId) throw new Error("Unauthorized: Node does not belong to user");
	const outputHandle = node.handles[0];
	if (!outputHandle) throw new Error(`No output handle found for node ${nodeId}`);
	const storage = container.get(TOKENS.STORAGE);
	let fileSize = 0;
	let finalContentType = mimeType;
	try {
		const head = await storage.getObjectMetadata(key, ENV_CONFIG.R2_ASSETS_BUCKET);
		fileSize = head.ContentLength ?? 0;
		if (!finalContentType || finalContentType === "application/octet-stream") finalContentType = head.ContentType ?? "application/octet-stream";
	} catch (err$1) {
		logger.error({
			err: err$1,
			key
		}, "Failed to get object metadata from storage");
	}
	const effectiveAnonId = anonymousSessionId || node.canvas.anonymousSessionId || null;
	await checkAnonymousUploadLimits({
		userId: userId || node.canvas.userId,
		anonymousSessionId: effectiveAnonId,
		incomingCount: 1,
		incomingBytes: fileSize
	});
	let dataType = await resolveDataType(finalContentType, filename);
	const skipDownload = (dataType === "Video" || dataType === "Audio") && !(finalContentType === "video/webm" || finalContentType === "audio/webm");
	let buffer;
	let metadataUrl;
	if (skipDownload) metadataUrl = await storage.generateSignedUrl(key, ENV_CONFIG.R2_ASSETS_BUCKET);
	else buffer = await storage.getFromStorage(key, ENV_CONFIG.R2_ASSETS_BUCKET);
	let processedFilename = filename;
	let processedContentType = finalContentType;
	let processedBuffer = buffer;
	if (processedBuffer) {
		const processed = processAndValidateLottie(processedBuffer, processedFilename, processedContentType);
		processedBuffer = processed.buffer;
		processedFilename = processed.filename;
		processedContentType = processed.contentType;
		dataType = await resolveDataType(processedContentType, processedFilename, processedBuffer);
		if (processedContentType === "video/webm" || processedContentType === "audio/webm") {
			const originalLength = processedBuffer.length;
			processedBuffer = await fixWebmMetadata(processedBuffer);
			if (processedBuffer.length !== originalLength) {
				await storage.uploadToStorage(processedBuffer, key, processedContentType, ENV_CONFIG.R2_ASSETS_BUCKET);
				fileSize = processedBuffer.length;
			}
		}
	}
	const metadata = await extractMediaMetadata(processedBuffer ?? metadataUrl, processedContentType, dataType);
	const wasLottie = filename !== processedFilename;
	let finalKey = key;
	if (wasLottie && processedBuffer) {
		finalKey = getAssetKey(`${generateId()}-${processedFilename}`);
		await storage.uploadToStorage(processedBuffer, finalKey, processedContentType, ENV_CONFIG.R2_ASSETS_BUCKET);
		fileSize = processedBuffer.length;
		try {
			await storage.deleteFromStorage?.(key, ENV_CONFIG.R2_ASSETS_BUCKET);
		} catch (cleanupErr) {
			logger.error({
				err: cleanupErr,
				key,
				bucket: ENV_CONFIG.R2_ASSETS_BUCKET
			}, "Failed to delete original .lottie file from storage after extraction");
		}
	}
	try {
		return await prisma.$transaction(async (tx) => {
			const targetUserId = userId || node.canvas.userId || null;
			const { asset } = await createFileAsset(tx, {
				userId: targetUserId,
				anonymousSessionId: targetUserId ? null : anonymousSessionId,
				buffer: processedBuffer,
				filename: processedFilename,
				mimeType: processedContentType,
				preExtracted: {
					key: finalKey,
					contentType: processedContentType,
					dataType,
					size: fileSize,
					metadata
				}
			});
			const currentResult = (await tx.node.findUniqueOrThrow({
				where: { id: nodeId },
				select: { result: true }
			})).result ?? { outputs: [] };
			const outputs = currentResult.outputs ?? [];
			const newOutput = { items: [{
				outputHandleId: outputHandle.id,
				data: createVirtualMedia({ entity: asset }, dataType),
				type: dataType
			}] };
			return tx.node.update({
				where: { id: nodeId },
				data: { result: {
					...currentResult,
					selectedOutputIndex: outputs.length,
					outputs: [...outputs, newOutput]
				} },
				include: { handles: true }
			});
		});
	} catch (err$1) {
		storage.deleteFromStorage?.(key, ENV_CONFIG.R2_ASSETS_BUCKET).catch((cleanupErr) => {
			logger.error({
				err: cleanupErr,
				key,
				bucket: ENV_CONFIG.R2_ASSETS_BUCKET
			}, "Failed to clean up orphaned storage object");
		});
		throw err$1;
	}
}
/**
* Uploads multiple files from a recording session to GCS, creates FileAsset records,
* and appends a SINGLE output entry to the node's result containing all files.
*/
async function uploadToRecordNode({ nodeId, files, userId }) {
	const node = await prisma.node.findUniqueOrThrow({
		where: { id: nodeId },
		include: {
			canvas: { select: {
				id: true,
				userId: true
			} },
			handles: {
				where: { type: "Output" },
				orderBy: { order: "asc" }
			}
		}
	});
	if (userId && node.canvas.userId && node.canvas.userId !== userId) throw new Error("Unauthorized: Node does not belong to user");
	const storage = container.get(TOKENS.STORAGE);
	const preps = await Promise.all(files.map(async (file) => {
		let buffer = file.buffer;
		const mimeType = file.mimeType;
		const finalContentType = mimeType ?? (await fileTypeFromBuffer(buffer))?.mime ?? "application/octet-stream";
		const dataType = await resolveDataType(finalContentType, file.filename, buffer);
		if (finalContentType === "video/webm" || finalContentType === "audio/webm") buffer = await fixWebmMetadata(buffer);
		const metadata = await extractMediaMetadata(buffer, finalContentType, dataType);
		const key = getAssetKey(`${generateId()}-${file.filename}`);
		await storage.uploadToStorage(buffer, key, finalContentType, ENV_CONFIG.R2_ASSETS_BUCKET);
		return {
			buffer,
			filename: file.filename,
			mimeType,
			key,
			finalContentType,
			dataType,
			metadata
		};
	}));
	try {
		return await prisma.$transaction(async (tx) => {
			const targetUserId = userId || node.canvas.userId;
			assert(targetUserId, "User id is missing");
			const createdAssets = await Promise.all(preps.map((prep) => createFileAsset(tx, {
				userId: targetUserId,
				buffer: prep.buffer,
				filename: prep.filename,
				mimeType: prep.mimeType,
				preExtracted: {
					key: prep.key,
					contentType: prep.finalContentType,
					dataType: prep.dataType,
					metadata: prep.metadata
				}
			})));
			const currentResult = (await tx.node.findUniqueOrThrow({
				where: { id: nodeId },
				select: { result: true }
			})).result ?? { outputs: [] };
			const outputs = currentResult.outputs ?? [];
			const newOutput = { items: createdAssets.map(({ asset, dataType }, index) => {
				const filename = preps[index].filename.toLowerCase();
				const outputHandleId = node.handles.find((h) => filename.toLowerCase().startsWith(h.label.toLowerCase()))?.id;
				assert(outputHandleId, "Could not determine output handle for file");
				return {
					outputHandleId,
					data: createVirtualMedia({ entity: asset }, dataType),
					type: dataType
				};
			}) };
			return tx.node.update({
				where: { id: nodeId },
				data: { result: {
					...currentResult,
					selectedOutputIndex: outputs.length,
					outputs: [...outputs, newOutput]
				} },
				include: { handles: true }
			});
		});
	} catch (err$1) {
		for (const prep of preps) storage.deleteFromStorage?.(prep.key, ENV_CONFIG.R2_ASSETS_BUCKET).catch((cleanupErr) => {
			logger.error({
				err: cleanupErr,
				key: prep.key,
				bucket: ENV_CONFIG.R2_ASSETS_BUCKET
			}, "Failed to clean up orphaned storage object");
		});
		throw err$1;
	}
}
async function prepareUploadToRecordNode({ nodeId, files, userId }) {
	const node = await prisma.node.findUniqueOrThrow({
		where: { id: nodeId },
		include: { canvas: { select: {
			id: true,
			userId: true
		} } }
	});
	if (userId && node.canvas.userId && node.canvas.userId !== userId) throw new Error("Unauthorized: Node does not belong to user");
	const storage = container.get(TOKENS.STORAGE);
	return Promise.all(files.map(async (f) => {
		const key = getAssetKey(`${generateId()}-${f.filename}`);
		return {
			key,
			signedUrl: await storage.generateSignedPutUrl(key, ENV_CONFIG.R2_ASSETS_BUCKET, f.mimeType),
			filename: f.filename,
			mimeType: f.mimeType
		};
	}));
}
async function finishUploadToRecordNode({ nodeId, files, userId }) {
	const node = await prisma.node.findUniqueOrThrow({
		where: { id: nodeId },
		include: {
			canvas: { select: {
				id: true,
				userId: true
			} },
			handles: {
				where: { type: "Output" },
				orderBy: { order: "asc" }
			}
		}
	});
	if (userId && node.canvas.userId && node.canvas.userId !== userId) throw new Error("Unauthorized: Node does not belong to user");
	const storage = container.get(TOKENS.STORAGE);
	const preps = await Promise.all(files.map(async (file) => {
		let fileSize = 0;
		let finalContentType = file.mimeType;
		try {
			const head = await storage.getObjectMetadata(file.key, ENV_CONFIG.R2_ASSETS_BUCKET);
			fileSize = head.ContentLength ?? 0;
			if (!finalContentType || finalContentType === "application/octet-stream") finalContentType = head.ContentType ?? "application/octet-stream";
		} catch (err$1) {
			logger.error({
				err: err$1,
				key: file.key
			}, "Failed to get object metadata from storage");
		}
		const dataType = await resolveDataType(finalContentType, file.filename);
		const skipDownload = (dataType === "Video" || dataType === "Audio") && !(finalContentType === "video/webm" || finalContentType === "audio/webm");
		let buffer;
		let metadataUrl;
		if (skipDownload) metadataUrl = await storage.generateSignedUrl(file.key, ENV_CONFIG.R2_ASSETS_BUCKET);
		else buffer = await storage.getFromStorage(file.key, ENV_CONFIG.R2_ASSETS_BUCKET);
		let processedBuffer = buffer;
		if (processedBuffer) {
			if (finalContentType === "video/webm" || finalContentType === "audio/webm") {
				const originalLength = processedBuffer.length;
				processedBuffer = await fixWebmMetadata(processedBuffer);
				if (processedBuffer.length !== originalLength) {
					await storage.uploadToStorage(processedBuffer, file.key, finalContentType, ENV_CONFIG.R2_ASSETS_BUCKET);
					fileSize = processedBuffer.length;
				}
			}
		}
		const metadata = await extractMediaMetadata(processedBuffer ?? metadataUrl, finalContentType, dataType);
		return {
			buffer: processedBuffer,
			filename: file.filename,
			mimeType: file.mimeType,
			key: file.key,
			finalContentType,
			dataType,
			size: fileSize,
			metadata
		};
	}));
	try {
		return await prisma.$transaction(async (tx) => {
			const targetUserId = userId || node.canvas.userId;
			assert(targetUserId, "User id is missing");
			const createdAssets = await Promise.all(preps.map((prep) => createFileAsset(tx, {
				userId: targetUserId,
				buffer: prep.buffer,
				filename: prep.filename,
				mimeType: prep.mimeType,
				preExtracted: {
					key: prep.key,
					contentType: prep.finalContentType,
					dataType: prep.dataType,
					size: prep.size,
					metadata: prep.metadata
				}
			})));
			const currentResult = (await tx.node.findUniqueOrThrow({
				where: { id: nodeId },
				select: { result: true }
			})).result ?? { outputs: [] };
			const outputs = currentResult.outputs ?? [];
			const newOutput = { items: createdAssets.map(({ asset, dataType }, index) => {
				const filename = preps[index].filename.toLowerCase();
				const outputHandleId = node.handles.find((h) => filename.toLowerCase().startsWith(h.label.toLowerCase()))?.id || node.handles[0]?.id;
				assert(outputHandleId, "Could not determine output handle for file");
				return {
					outputHandleId,
					data: createVirtualMedia({ entity: asset }, dataType),
					type: dataType
				};
			}) };
			return tx.node.update({
				where: { id: nodeId },
				data: { result: {
					...currentResult,
					selectedOutputIndex: outputs.length,
					outputs: [...outputs, newOutput]
				} },
				include: { handles: true }
			});
		});
	} catch (err$1) {
		for (const prep of preps) storage.deleteFromStorage?.(prep.key, ENV_CONFIG.R2_ASSETS_BUCKET).catch((cleanupErr) => {
			logger.error({
				err: cleanupErr,
				key: prep.key,
				bucket: ENV_CONFIG.R2_ASSETS_BUCKET
			}, "Failed to clean up orphaned storage object");
		});
		throw err$1;
	}
}
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i$1 = decorators.length - 1; i$1 >= 0; i$1--) if (d = decorators[i$1]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ServerMediaService = class ServerMediaService$1 {
	baseUrl;
	env;
	constructor() {}
	init() {
		this.baseUrl = this.env.BASE_URL;
	}
	async getImageDimensions(buffer) {
		const metadata = await sharp(buffer).metadata();
		return {
			width: metadata.width,
			height: metadata.height
		};
	}
	async getImageBuffer(imageInput) {
		const urlToUse = imageInput?.entity ? GetAssetEndpointBackend(this.baseUrl, imageInput.entity) : null;
		if (!urlToUse) throw new Error("No URL found in FileData");
		const response = await fetch(urlToUse);
		return Buffer.from(await response.arrayBuffer());
	}
	resolveFileDataUrl(data) {
		if (!data) return null;
		if (data.entity) {
			const fileAsset = data.entity;
			return GetAssetEndpointBackend(this.baseUrl, fileAsset);
		}
		return null;
	}
};
__decorate([inject(TOKENS.ENV), __decorateMetadata("design:type", Object)], ServerMediaService.prototype, "env", void 0);
__decorate([
	postConstruct(),
	__decorateMetadata("design:type", Function),
	__decorateMetadata("design:paramtypes", []),
	__decorateMetadata("design:returntype", void 0)
], ServerMediaService.prototype, "init", null);
ServerMediaService = __decorate([injectable(), __decorateMetadata("design:paramtypes", [])], ServerMediaService);

//#endregion
export { finishUploadToRecordNode as a, uploadToImportNode as c, finishUploadToImportNode as i, uploadToRecordNode as l, createFileAsset as n, prepareUploadToImportNode as o, extractMediaMetadata as r, prepareUploadToRecordNode as s, ServerMediaService as t };