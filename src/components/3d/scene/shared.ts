import * as THREE from "three";

/** One uniform set, updated once per frame by <Clock/>, shared by every shader in the scene. */
export const U = {
  time: { value: 0 },
  pulse: { value: 0 },
  boost: { value: 0 },
};

export const C = {
  green: new THREE.Color("#39ff88"),
  cyan: new THREE.Color("#00d9ff"),
  violet: new THREE.Color("#9b5cff"),
  deep: new THREE.Color("#0a1020"),
};

/** Deterministic PRNG so scene generation is pure and stable. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let glow: THREE.CanvasTexture | null = null;
/** Soft radial sprite used for halos, stars and node glows. */
export function getGlowTexture() {
  if (glow) return glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.18, "rgba(255,255,255,0.55)");
  grd.addColorStop(0.5, "rgba(255,255,255,0.12)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glow = new THREE.CanvasTexture(c);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
}

export interface SceneProps {
  mobile: boolean;
  animate: boolean;
}
