export const slugWgsl = `
struct Uniforms {
	transformCol0 : vec4<f32>,
	transformCol1 : vec4<f32>,
	transformCol2 : vec4<f32>,
	params        : vec4<f32>, // x = opacity, y = surfaceWidth, z = surfaceHeight
};

@group(0) @binding(0) var<uniform> u : Uniforms;

struct VSOut {
	@builtin(position) pos : vec4<f32>,
	@location(0) uv        : vec2<f32>,
	@location(1) @interpolate(flat) glyphScale : vec2<f32>,
	@location(2) @interpolate(flat) bandScale  : vec2<f32>,
	@location(3) @interpolate(flat) bandMax    : vec2<u32>,
	@location(4) @interpolate(flat) bandsTexCoords : vec2<u32>,
	@location(5) color     : vec4<f32>,
	@location(6) @interpolate(flat) blurAmount : f32,
};

var<private> pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(
	vec2<f32>(-1.0, -1.0),
	vec2<f32>(1.0, 1.0),
	vec2<f32>(-1.0, 1.0),
	vec2<f32>(-1.0, -1.0),
	vec2<f32>(1.0, -1.0),
	vec2<f32>(1.0, 1.0)
);

@vertex fn vs(
	@builtin(vertex_index) vertex_index : u32,
	@location(0) aScaleBias : vec4<f32>,
	@location(1) aGlyphBandScale : vec4<f32>,
	@location(2) aBandMaxTexCoords : vec4<f32>,
	@location(3) aAnim : vec4<f32>, // x = rotation, y = scale_mult, zw = translation
	@location(4) aColor : vec4<f32>,
	@location(5) aExtraParams : vec4<f32>,
) -> VSOut {
	let quad_pos = pos[vertex_index];
	let uv = vec2<f32>(quad_pos.x * 0.5 + 0.5, 1.0 - (quad_pos.y * 0.5 + 0.5));

	let angle = aAnim.x;
	let scale_mult = aAnim.y;
	let translation = aAnim.zw;

	let local_pos = quad_pos * aScaleBias.xy * scale_mult;
	let slant = u.params.w;
	let slanted_pos = vec2<f32>(
		local_pos.x - local_pos.y * slant,
		local_pos.y
	);
	let rotated = vec2<f32>(
		slanted_pos.x * cos(angle) - slanted_pos.y * sin(angle),
		slanted_pos.x * sin(angle) + slanted_pos.y * cos(angle)
	);

	let transformed = rotated + aScaleBias.zw + translation;

	let transform = mat3x3<f32>(u.transformCol0.xyz, u.transformCol1.xyz, u.transformCol2.xyz);
	let p = transform * vec3<f32>(transformed, 1.0);

	let surfaceSize = u.params.yz;
	let clipX = (p.x / surfaceSize.x) * 2.0 - 1.0;
	let clipY = 1.0 - (p.y / surfaceSize.y) * 2.0;

	var out : VSOut;
	out.pos = vec4<f32>(clipX, clipY, 0.0, 1.0);
	out.uv = uv;
	out.glyphScale = aGlyphBandScale.xy;
	out.bandScale = aGlyphBandScale.zw;
	
	let bandMaxU = vec2<u32>(aBandMaxTexCoords.xy);
	let bandsCoordsU = vec2<u32>(aBandMaxTexCoords.zw);
	out.bandMax = bandMaxU;
	out.bandsTexCoords = bandsCoordsU;
	out.color = aColor;
	out.blurAmount = aExtraParams.x;

	return out;
}

const epsilon : f32 = 0.0001;

@group(1) @binding(0) var curvesTex : texture_2d<f32>;
@group(1) @binding(1) var bandsTex : texture_2d<u32>;

fn TraceRayCurveH(p1: vec2<f32>, p2: vec2<f32>, p3: vec2<f32>, pixelsPerEm: f32) -> f32 {
	if (max(max(p1.x, p2.x), p3.x) * pixelsPerEm < -0.5) {
		return 0.0;
	}

	var cond1: u32 = 0u;
	if (p1.y > 0.0) { cond1 = 2u; }
	var cond2: u32 = 0u;
	if (p2.y > 0.0) { cond2 = 4u; }
	var cond3: u32 = 0u;
	if (p3.y > 0.0) { cond3 = 8u; }

	let shift = cond1 + cond2 + cond3;
	let code = (0x2E74u >> shift) & 3u;
	if (code == 0u) {
		return 0.0;
	}

	let a = p1 - p2 * 2.0 + p3;
	let b = p1 - p2;
	let c = p1.y;
	let ayr = 1.0 / a.y;
	let d = sqrt(max(b.y * b.y - a.y * c, 0.0));
	var t1 = (b.y - d) * ayr;
	var t2 = (b.y + d) * ayr;

	if (abs(a.y) < epsilon) {
		let val = c / (2.0 * b.y);
		t1 = val;
		t2 = val;
	}

	var coverage: f32 = 0.0;

	if ((code & 1u) != 0u) {
		let x1 = (a.x * t1 - b.x * 2.0) * t1 + p1.x;
		let cov_c = clamp(x1 * pixelsPerEm + 0.5, 0.0, 1.0);
		coverage = coverage + cov_c;
	}

	if (code > 1u) {
		let x2 = (a.x * t2 - b.x * 2.0) * t2 + p1.x;
		let cov_c = clamp(x2 * pixelsPerEm + 0.5, 0.0, 1.0);
		coverage = coverage - cov_c;
	}

	return coverage;
}

fn TraceRayBandH(bandData: vec2<u32>, pixelsPerEm: f32, glyphScale: vec2<f32>, uv: vec2<f32>) -> f32 {
	var coverage: f32 = 0.0;
	for (var curve: u32 = 0u; curve < bandData.x; curve = curve + 1u) {
		let curveOffset = bandData.y + curve;
		let coord = vec2<i32>(i32(curveOffset & 0xFFFu), i32(curveOffset >> 12u));
		let curveLoc = vec2<i32>(textureLoad(bandsTex, coord, 0).xy);
		
		let p12 = textureLoad(curvesTex, curveLoc, 0) / vec4<f32>(glyphScale, glyphScale) - vec4<f32>(uv, uv);
		let p3 = textureLoad(curvesTex, vec2<i32>(curveLoc.x + 1, curveLoc.y), 0).xy / glyphScale - uv;
		
		let max_x = max(max(p12.x, p12.z), p3.x);
		if (max_x * pixelsPerEm < -0.5) {
			break;
		}

		coverage = coverage + TraceRayCurveH(p12.xy, p12.zw, p3.xy, pixelsPerEm);
	}
	return coverage;
}

fn TraceRayBandV(bandData: vec2<u32>, pixelsPerEm: f32, glyphScale: vec2<f32>, uv: vec2<f32>) -> f32 {
	var coverage: f32 = 0.0;
	for (var curve: u32 = 0u; curve < bandData.x; curve = curve + 1u) {
		let curveOffset = bandData.y + curve;
		let coord = vec2<i32>(i32(curveOffset & 0xFFFu), i32(curveOffset >> 12u));
		let curveLoc = vec2<i32>(textureLoad(bandsTex, coord, 0).xy);
		
		let p12 = textureLoad(curvesTex, curveLoc, 0) / vec4<f32>(glyphScale, glyphScale) - vec4<f32>(uv, uv);
		let p3 = textureLoad(curvesTex, vec2<i32>(curveLoc.x + 1, curveLoc.y), 0).xy / glyphScale - uv;
		
		let max_y = max(max(p12.y, p12.w), p3.y);
		if (max_y * pixelsPerEm < -0.5) {
			break;
		}

		coverage = coverage + TraceRayCurveH(p12.yx, p12.wz, p3.yx, pixelsPerEm);
	}
	return coverage;
}

@fragment fn fs(in : VSOut) -> @location(0) vec4<f32> {
	let fdx = dpdx(in.uv);
	let fdy = dpdy(in.uv);
	let fw = max(max(abs(fdx), abs(fdy)), vec2<f32>(0.000001));
	var pixelsPerEm = vec2<f32>(1.0 / fw.x, 1.0 / fw.y);

	pixelsPerEm = max(pixelsPerEm, vec2<f32>(1.0));

	var slugAlpha = 0.0;

	if (in.blurAmount > 0.01) {
		let numSamples = 9.0;
		let step = fw * in.blurAmount * 0.3;
		
		for (var y_offset = -1.0; y_offset <= 1.0; y_offset = y_offset + 1.0) {
			for (var x_offset = -1.0; x_offset <= 1.0; x_offset = x_offset + 1.0) {
				let offset = vec2<f32>(x_offset, y_offset) * step;
				let uv_sample = in.uv + offset;
				
				let bandIndex = vec2<u32>(clamp(vec2<u32>(uv_sample * in.bandScale), vec2<u32>(0u), in.bandMax));
				let hBandOffset = in.bandsTexCoords.y * 4096u + in.bandsTexCoords.x + bandIndex.y;
				let hCoord = vec2<i32>(i32(hBandOffset & 0xFFFu), i32(hBandOffset >> 12u));
				let hBandData = textureLoad(bandsTex, hCoord, 0).xy;

				let vBandOffset = in.bandsTexCoords.y * 4096u + in.bandsTexCoords.x + in.bandMax.y + 1u + bandIndex.x;
				let vCoord = vec2<i32>(i32(vBandOffset & 0xFFFu), i32(vBandOffset >> 12u));
				let vBandData = textureLoad(bandsTex, vCoord, 0).xy;

				let coverageX = TraceRayBandH(hBandData, pixelsPerEm.x, in.glyphScale, uv_sample);
				let coverageY = TraceRayBandV(vBandData, pixelsPerEm.y, in.glyphScale, uv_sample);

				let finalCoverageX = min(abs(coverageX), 1.0);
				let finalCoverageY = min(abs(coverageY), 1.0);
				slugAlpha = slugAlpha + (finalCoverageX + finalCoverageY) * 0.5;
			}
		}
		slugAlpha = slugAlpha / numSamples;
	} else {
		let bandIndex = vec2<u32>(clamp(vec2<u32>(in.uv * in.bandScale), vec2<u32>(0u), in.bandMax));
		let hBandOffset = in.bandsTexCoords.y * 4096u + in.bandsTexCoords.x + bandIndex.y;
		let hCoord = vec2<i32>(i32(hBandOffset & 0xFFFu), i32(hBandOffset >> 12u));
		let hBandData = textureLoad(bandsTex, hCoord, 0).xy;

		let vBandOffset = in.bandsTexCoords.y * 4096u + in.bandsTexCoords.x + in.bandMax.y + 1u + bandIndex.x;
		let vCoord = vec2<i32>(i32(vBandOffset & 0xFFFu), i32(vBandOffset >> 12u));
		let vBandData = textureLoad(bandsTex, vCoord, 0).xy;

		let coverageX = TraceRayBandH(hBandData, pixelsPerEm.x, in.glyphScale, in.uv);
		let coverageY = TraceRayBandV(vBandData, pixelsPerEm.y, in.glyphScale, in.uv);

		let finalCoverageX = min(abs(coverageX), 1.0);
		let finalCoverageY = min(abs(coverageY), 1.0);
		slugAlpha = (finalCoverageX + finalCoverageY) * 0.5;
	}

	let alpha = in.color.a * u.params.x * slugAlpha;
	if (alpha < 0.0001) {
		discard;
	}
	return vec4<f32>(in.color.rgb * alpha, alpha);
}
`;
