export const pathWgsl = `
struct Uniforms {
    transformCol0 : vec4<f32>,
    transformCol1 : vec4<f32>,
    transformCol2 : vec4<f32>,
    params        : vec4<f32>, // x = opacity, y = surfaceWidth, z = surfaceHeight, w = strokeWidth
    color         : vec4<f32>,
    p0            : vec2<f32>,
    p1            : vec2<f32>,
};

@group(0) @binding(0) var<uniform> u : Uniforms;

struct VSOut {
    @builtin(position) pos : vec4<f32>,
    @location(0) localPos  : vec2<f32>,
};

@vertex fn vs(@location(0) xy : vec2<f32>) -> VSOut {
    let transform = mat3x3<f32>(u.transformCol0.xyz, u.transformCol1.xyz, u.transformCol2.xyz);
    let p = transform * vec3<f32>(xy, 1.0);
    
    let surfaceSize = u.params.yz;
    let clipX = (p.x / surfaceSize.x) * 2.0 - 1.0;
    let clipY = 1.0 - (p.y / surfaceSize.y) * 2.0;

    return VSOut(vec4<f32>(clipX, clipY, 0.0, 1.0), xy);
}

fn sdLine(p: vec2<f32>, a: vec2<f32>, b: vec2<f32>) -> f32 {
    let pa = p - a;
    let ba = b - a;
    let d2 = dot(ba, ba);
    let h = clamp(dot(pa, ba) / max(d2, 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
}

@fragment fn fs(in : VSOut) -> @location(0) vec4<f32> {
    let d = sdLine(in.localPos, u.p0, u.p1);
    let radius = u.params.w * 0.5;
    
    // Antialiasing using fwidth for consistent 1-pixel ramp regardless of zoom/transform
    let alpha = clamp(0.5 - (d - radius) / fwidth(d), 0.0, 1.0);
    
    if (alpha <= 0.0) {
        discard;
    }
    
    return u.color * u.params.x * alpha;
}
`;
