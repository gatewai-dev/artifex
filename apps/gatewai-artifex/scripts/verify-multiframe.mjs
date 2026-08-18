#!/usr/bin/env node
// Regression check: multi-frame video export must render N distinct, non-blank frames
// in a single process.
//
//   Regression: renderImage used to mediaDecoderCache.destroy() (and reset the WebGPU
//   device) in its `finally`, so the 2nd+ frame re-opened the file:// demuxer and failed
//   with "UnsupportedInputFormatError" -> every frame > 0 came out pure black.
//   Fixed by keeping the decoder + device alive across frames. This script fails (exit 1)
//   if that regresses.
//
// Run:  node apps/gatewai-artifex/scripts/verify-multiframe.mjs
// Needs: node dist/index.mjs built + ffmpeg on PATH + a usable WebGPU/ffmpeg device.

import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cli = path.resolve(__dirname, "../dist/index.mjs");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gw-multiframe-verif-"));

const FRAMES = ["0", "24", "48"];
let failed = false;
const fail = (msg) => {
	failed = true;
	console.error(`[verify-multiframe] ❌ ${msg}`);
};

try {
	// 1. Generate a moving test pattern video (3s, 24fps -> 72 frames).
	const video = path.join(tmp, "src.mp4");
	const gen = spawnSync(
		"ffmpeg",
		[
			"-y",
			"-loglevel",
			"error",
			"-f",
			"lavfi",
			"-i",
			"testsrc=duration=3:size=320x180:rate=24",
			"-pix_fmt",
			"yuv420p",
			video,
		],
		{ encoding: "utf-8" },
	);
	if (gen.status !== 0) fail(`ffmpeg generation failed: ${gen.stderr?.trim()}`);

	const spec = path.join(tmp, "spec.json");
	fs.writeFileSync(
		spec,
		JSON.stringify({
			name: "multiframe",
			imports: { vid: "src.mp4" },
			nodes: [{ id: "e", type: "Export", config: {} }],
			edges: [
				{
					source: "vid",
					target: "e",
					sourceLabel: "Result",
					targetLabel: "Input",
				},
			],
			export: { node: "e", file: "out.png", type: "image" },
		}),
	);

	// 2. Render 3 frames in one process.
	const outDir = path.join(tmp, "frames");
	const run = spawnSync(
		"node",
		[
			cli,
			"export",
			spec,
			"--frames",
			FRAMES.join(","),
			"--out",
			outDir,
			"--json",
		],
		{ encoding: "utf-8" },
	);
	if (run.status !== 0) {
		fail(`export exited ${run.status}: ${run.stderr?.slice(0, 800)}`);
	} else {
		// 3. Assert all frames exist, are non-blank stubs, and are mutually distinct.
		const bufs = FRAMES.map((n) => {
			const p = path.join(outDir, `frame-${n}.png`);
			if (!fs.existsSync(p)) fail(`missing frame-${n}.png`);
			return fs.existsSync(p) ? fs.readFileSync(p) : Buffer.alloc(0);
		});
		for (const b of bufs) {
			if (b.length <= 1000)
				fail(`frame is a blank/stub (<1KB): got ${b.length}B`);
		}
		const hashes = bufs.map((b) => createHash("sha1").update(b).digest("hex"));
		if (new Set(hashes).size !== FRAMES.length) {
			fail(
				`frames are NOT distinct (${new Set(hashes).size}/${FRAMES.length} unique)`,
			);
		}
	}
} finally {
	fs.rmSync(tmp, { recursive: true, force: true });
}

if (failed) {
	console.error(
		"[verify-multiframe] FAILED — multi-frame rendering regressed.",
	);
	process.exit(1);
}
console.log(
	"[verify-multiframe] ✅ multi-frame export renders distinct frames.",
);
