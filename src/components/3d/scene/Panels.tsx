"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32, type SceneProps } from "./shared";

type Kind = 0 | 1 | 2;

function drawPanel(kind: Kind, accent: string, label: string): THREE.CanvasTexture {
  const W = 512, H = 320;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(kind * 97 + 13);
  g.fillStyle = "rgba(6, 14, 28, 0.62)";
  g.fillRect(0, 0, W, H);
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, accent + "22");
  grd.addColorStop(1, "transparent");
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = accent + "88";
  g.lineWidth = 2;
  g.strokeRect(1, 1, W - 2, H - 2);
  g.strokeStyle = accent;
  g.lineWidth = 4;
  for (const [x, y, dx, dy] of [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]]) {
    g.beginPath(); g.moveTo(x, y + dy * 26); g.lineTo(x, y); g.lineTo(x + dx * 26, y); g.stroke();
  }
  g.font = "600 24px ui-monospace, Menlo, Consolas, monospace";
  g.fillStyle = accent;
  g.fillText(label, 24, 44);
  g.fillStyle = "#94a3b8";
  g.font = "16px ui-monospace, Menlo, Consolas, monospace";
  g.fillText("SIMULATED", W - 128, 42);
  g.fillStyle = accent + "55";
  g.fillRect(24, 58, W - 48, 1);

  if (kind === 0) {
    // bars
    for (let i = 0; i < 18; i++) {
      const h = 30 + rnd() * 150;
      g.fillStyle = i % 5 === 0 ? "#9b5cff" : accent;
      g.globalAlpha = 0.75;
      g.fillRect(28 + i * 26, H - 28 - h, 16, h);
    }
    g.globalAlpha = 1;
  } else if (kind === 1) {
    // line chart
    g.strokeStyle = accent; g.lineWidth = 3; g.beginPath();
    let y = 180;
    for (let i = 0; i <= 24; i++) { y = Math.min(270, Math.max(100, y + (rnd() - 0.5) * 60)); const x = 28 + (i * (W - 56)) / 24; if (i === 0) g.moveTo(x, y); else g.lineTo(x, y); }
    g.stroke();
    g.strokeStyle = accent + "33"; g.lineWidth = 1;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(28, 90 + i * 45); g.lineTo(W - 28, 90 + i * 45); g.stroke(); }
  } else {
    // ring gauge + log lines
    g.lineWidth = 12; g.strokeStyle = accent + "33"; g.beginPath(); g.arc(120, 190, 62, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = accent; g.beginPath(); g.arc(120, 190, 62, -Math.PI / 2, Math.PI * 0.9); g.stroke();
    g.font = "16px ui-monospace, Menlo, Consolas, monospace";
    for (let i = 0; i < 7; i++) { g.fillStyle = i % 3 === 0 ? accent : "#64748b"; g.fillRect(230, 100 + i * 24, 40 + rnd() * 200, 8); }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const DEFS = [
  { kind: 0 as Kind, accent: "#00d9ff", label: "TRAFFIC", pos: [-2.1, 2.55, -1.2], ry: 0.42 },
  { kind: 1 as Kind, accent: "#39ff88", label: "ACCESS LOG", pos: [3.5, 1.9, -0.6], ry: -0.5 },
  { kind: 2 as Kind, accent: "#9b5cff", label: "INTEGRITY", pos: [3.4, -0.55, 0.9], ry: -0.38 },
] as const;

/** Floating holographic HUD panels linked to the core by faint tethers. */
export function Panels({ animate, mobile }: SceneProps) {
  const defs = mobile ? DEFS.slice(0, 2) : DEFS;
  const textures = useMemo(() => defs.map((d) => drawPanel(d.kind, d.accent, d.label)), [defs]);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const tether = useMemo(() => {
    const a = new Float32Array(defs.length * 6);
    defs.forEach((d, i) => { a[i * 6] = d.pos[0]; a[i * 6 + 1] = d.pos[1]; a[i * 6 + 2] = d.pos[2]; });
    return a;
  }, [defs]);

  useFrame((s) => {
    if (!animate) return;
    const t = s.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = defs[i].pos[1] + Math.sin(t * 0.7 + i * 1.7) * 0.12;
      m.rotation.y = defs[i].ry + Math.sin(t * 0.4 + i) * 0.06;
    });
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[tether, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#00d9ff" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {defs.map((d, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} position={d.pos as unknown as [number, number, number]} rotation={[0, d.ry, 0]} scale={mobile ? 0.78 : 1}>
          <planeGeometry args={[1.8, 1.125]} />
          <meshBasicMaterial map={textures[i]} transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
