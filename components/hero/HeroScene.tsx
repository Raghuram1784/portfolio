"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------
   HERO BACKGROUND
   A calm full-screen shader: slow, soft colour fields with a cursor
   spotlight and a fine dot grid whose dots grow, glow and drift away from
   the cursor. Light and dark palettes, plus a circular reveal on scroll.
   ------------------------------------------------------------------ */

export interface SceneSignals {
  progress: { current: number };
  pointer: { x: number; y: number };
}

const lerp = THREE.MathUtils.lerp;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ---------------- background shader ---------------- */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime; uniform vec2 uMouse; uniform float uLight; uniform vec2 uRes; uniform float uVeil; uniform int uVariant;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
  float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
  float field(vec2 p, vec2 c, float r){ vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }

  void main(){
    float ar = uRes.x / uRes.y;
    vec2 p = vUv * vec2(ar, 1.0);
    vec2 m = uMouse * vec2(ar, 1.0);
    float t = uTime * 0.07;

    // the site palette: deep navy / navy / royal / steel blue / gold — beige & ivory in light mode
    vec3 deep  = mix(vec3(0.043, 0.078, 0.141), vec3(0.945, 0.898, 0.824), uLight);
    vec3 navy  = mix(vec3(0.067, 0.122, 0.212), vec3(0.98, 0.96, 0.925), uLight);
    vec3 royal = mix(vec3(0.125, 0.227, 0.392), vec3(0.82, 0.86, 0.93), uLight);
    vec3 steel = mix(vec3(0.212, 0.341, 0.514), vec3(0.70, 0.77, 0.88), uLight);
    vec3 gold  = mix(vec3(0.78, 0.635, 0.38), vec3(0.78, 0.60, 0.30), uLight);
    vec3 col = mix(deep, navy, vUv.y);
    vec2 dm = p - m;
    float near = exp(-dot(dm, dm) / 0.05); // 1 at the cursor, fading out

    if (uVariant == 1) {
      // SILK — slow domain-warped flow; it swirls around the cursor and lights a gold thread
      vec2 sp = p + 0.3 * exp(-length(dm) * 2.5) * vec2(-dm.y, dm.x);
      vec2 q = vec2(fbm(sp * 1.6 + t), fbm(sp * 1.6 + vec2(5.2, 1.3) - t));
      float f = fbm(sp * 1.6 + 2.2 * q);
      col = mix(col, royal, smoothstep(0.35, 0.85, f) * 0.8);
      col = mix(col, steel, smoothstep(0.6, 0.95, f * length(q)) * 0.5);
      col += gold * smoothstep(0.012, 0.0, abs(f - 0.58)) * (0.25 + 0.6 * near);
    } else if (uVariant == 2) {
      // AURORA — ribbons of light that bend toward the cursor
      for (int k = 0; k < 3; k++) {
        float fk = float(k);
        float y = 0.72 - fk * 0.12 + 0.07 * sin(p.x * (1.4 + fk * 0.5) + t * (2.0 + fk) + fk * 2.0);
        float pull = exp(-pow((p.x - m.x) * 2.5, 2.0));
        y = mix(y, uMouse.y, pull * 0.35);
        float band = exp(-pow((vUv.y - y) * (7.0 + fk * 2.0), 2.0));
        col = mix(col, k == 1 ? gold : (k == 0 ? steel : royal), band * (k == 1 ? 0.4 : 0.65));
      }
    } else if (uVariant == 3) {
      // CONTOURS — a gold topographic map; the cursor raises a hill and rings form around it
      float h = fbm(p * 1.3 + vec2(t * 0.6, -t * 0.4)) + 0.35 * exp(-dot(dm, dm) / 0.03);
      col = mix(col, royal, smoothstep(0.3, 0.9, h) * 0.45);
      float lines = abs(fract(h * 14.0) - 0.5);
      col += gold * smoothstep(0.06, 0.0, lines) * (0.18 + 0.35 * near) * (0.4 + h);
    } else if (uVariant == 4) {
      // MESH — rich gradient mesh; a pool of gold light follows the cursor
      col = mix(col, royal, field(p, vec2(ar * 0.8 + 0.12 * sin(t * 1.3), 0.6 + 0.1 * cos(t)), 0.6) * 0.95);
      col = mix(col, steel, field(p, vec2(ar * 0.35 + 0.1 * cos(t * 0.9), 0.25 + 0.08 * sin(t * 1.2)), 0.5) * 0.8);
      col = mix(col, deep, field(p, vec2(ar * 0.05, 0.9), 0.5) * 0.6);
      col = mix(col, gold, field(p, m, 0.32) * 0.5);
    } else if (uVariant == 5) {
      // NEBULA — deep cloud and gold dust; the cloud parts and stars flare near the cursor
      float c = fbm(p * 1.8 + vec2(t, t * 0.5));
      float c2 = fbm(p * 3.4 - vec2(t * 0.7, -t * 0.4) + c);
      col = mix(col, royal * 1.25, smoothstep(0.3, 0.85, c) * 0.9 * (1.0 - near * 0.55));
      col = mix(col, steel * 1.15, smoothstep(0.55, 1.0, c) * 0.55);
      col += gold * smoothstep(0.62, 0.95, c2) * 0.22 * (1.0 + near * 1.5); // gold wisps, brighter near the cursor
      vec2 cell = vUv * uRes / 5.0;
      vec2 g = floor(cell);
      float h = hash(g);
      float on = step(0.985 - near * 0.03, h);
      float d = length(fract(cell) - 0.5);
      float star = on * smoothstep(0.5, 0.0, d) * (0.55 + 0.45 * sin(uTime * 2.0 + hash(g + 7.0) * 30.0));
      col += gold * star * (0.9 + near * 1.6);
    } else if (uVariant == 6) {
      // WAVES — fine silk threads flowing across the page; they ripple away from the cursor
      for (int k = 0; k < 7; k++) {
        float fk = float(k);
        float y = 0.2 + fk * 0.1 + 0.05 * sin(p.x * 2.2 + t * 3.0 + fk * 0.9) + 0.03 * sin(p.x * 5.0 - t * 2.0 + fk);
        float dx = p.x - m.x;
        y += 0.06 * exp(-dx * dx / 0.03) * sign(y - uMouse.y) * exp(-abs(y - uMouse.y) * 4.0);
        float line = smoothstep(0.004, 0.0, abs(vUv.y - y));
        col = mix(col, k == 3 ? gold : steel, line * (k == 3 ? 0.75 : 0.5));
      }
      col = mix(col, royal, field(p, vec2(ar * 0.75, 0.5), 0.6) * 0.5);
    } else {
      // CALM — slow soft colour fields with a gentle cursor spotlight
      col = mix(col, royal, field(p, vec2(ar * 0.78 + 0.07 * sin(t * 1.3), 0.52 + 0.07 * cos(t)), 0.55) * 0.75);
      col = mix(col, steel, field(p, vec2(ar * 0.2 + 0.06 * cos(t * 0.9), 0.15 + 0.05 * sin(t * 1.1)), 0.45) * 0.45);
      col = mix(col, mix(vec3(0.85, 0.72, 0.48), vec3(1.0, 0.97, 0.9), uLight), field(p, m, 0.28) * mix(0.14, 0.3, uLight));
    }

    col += (hash(vUv * uRes + fract(uTime)) - 0.5) * 0.015;

    float rad = uVeil * 1.9;
    float inside = smoothstep(rad, rad - 0.03, length((vUv - vec2(0.5, 0.57)) * vec2(ar, 1.0)));
    col = mix(col, vec3(0.071, 0.039, 0.141), inside * step(0.001, uVeil));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Silk({ pointer, light, progress, variant }: { pointer: SceneSignals["pointer"]; light: boolean; progress: SceneSignals["progress"]; variant: number }) {
  const sp = useRef(0);
  const { size } = useThree();
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        depthWrite: false,
        depthTest: false,
        uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0.7, 0.5) }, uLight: { value: light ? 1 : 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uVeil: { value: 0 }, uVariant: { value: variant } },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useFrame((state, dt) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uVariant.value = variant;
    mat.uniforms.uRes.value.set(size.width, size.height);
    const m = mat.uniforms.uMouse.value as THREE.Vector2;
    m.x += (pointer.x * 0.5 + 0.5 - m.x) * (1 - Math.exp(-dt * 6));
    m.y += (-pointer.y * 0.5 + 0.5 - m.y) * (1 - Math.exp(-dt * 6));
    mat.uniforms.uLight.value += ((light ? 1 : 0) - mat.uniforms.uLight.value) * (1 - Math.exp(-dt * 4));
    sp.current += (progress.current - sp.current) * (1 - Math.exp(-dt * 7));
    mat.uniforms.uVeil.value = smooth(0.55, 0.92, sp.current);
  });
  return (
    <mesh renderOrder={-1} frustumCulled={false} material={mat}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => onReady?.(), [onReady]);
  return null;
}

export default function HeroScene({ progress, pointer, active, light, variant = 0, onReady }: SceneSignals & { active: boolean; light: boolean; variant?: number; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 30 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Silk pointer={pointer} light={light} progress={progress} variant={variant} />
      <Ready onReady={onReady} />
    </Canvas>
  );
}
