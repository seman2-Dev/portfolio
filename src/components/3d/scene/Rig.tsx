"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { U, type SceneProps } from "./shared";
import { sceneBus } from "../sceneBus";

/** Advances the shared shader clock and eases the CTA "attention" level. */
export function Clock() {
  useFrame((s) => {
    U.time.value = s.clock.elapsedTime;
    U.boost.value += (sceneBus.boost - U.boost.value) * 0.08;
  });
  return null;
}

/** Three coloured lights that orbit the shield; they light the glossy nodes. */
export function Lights({ animate }: SceneProps) {
  const a = useRef<THREE.PointLight>(null);
  const b = useRef<THREE.PointLight>(null);
  const c = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    const t = animate ? s.clock.elapsedTime : 0;
    const k = 1 + U.boost.value * 0.6 + U.pulse.value * 0.8;
    if (a.current) { a.current.position.set(Math.cos(t * 0.5) * 4.2, 1.2, Math.sin(t * 0.5) * 4.2); a.current.intensity = 70 * k; }
    if (b.current) { b.current.position.set(Math.cos(t * 0.4 + 2.1) * 5, -0.5, Math.sin(t * 0.4 + 2.1) * 5); b.current.intensity = 80 * k; }
    if (c.current) { c.current.position.set(0, 0.2, 1.2); c.current.intensity = 22 * k; }
  });
  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight ref={a} color="#39ff88" distance={16} decay={2} />
      <pointLight ref={b} color="#9b5cff" distance={16} decay={2} />
      <pointLight ref={c} color="#00d9ff" distance={9} decay={2} />
    </>
  );
}

/**
 * Composition + depth-based camera movement.
 * - Desktop: focal point sits right of the hero text; mobile: centred and scaled down.
 * - Camera drifts with the pointer (or a slow idle sway on touch) and dollies back as you scroll.
 */
export function Composition({ animate, children }: { animate: boolean; children: React.ReactNode }) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const aspect = s.size.width / s.size.height;
    const wide = aspect > 1.15;
    const tx = wide ? Math.min(2.8, aspect * 1.6) : 0;
    const sc = wide ? 1 : Math.min(0.98, Math.max(0.6, aspect * 1.05));
    const ty = wide ? 0.05 : 0.45;
    const kk = 1 - Math.exp(-dt * 4);
    const r = root.current;
    if (r) {
      r.position.x += (tx - r.position.x) * kk;
      r.position.y += (ty - r.position.y) * kk;
      r.scale.setScalar(r.scale.x + (sc - r.scale.x) * kk);
    }
    if (!animate) return;
    const t = s.clock.elapsedTime;
    const px = sceneBus.hasPointer ? sceneBus.px : Math.sin(t * 0.25) * 0.5;
    const py = sceneBus.hasPointer ? sceneBus.py : Math.cos(t * 0.2) * 0.3;
    target.current.set(px * 1.0, 0.5 + py * 0.5, 8.8 + sceneBus.scroll * 5);
    s.camera.position.lerp(target.current, 1 - Math.exp(-dt * 2.2));
    look.current.set(tx * 0.45, 0.05 - sceneBus.scroll * 0.8, 0);
    s.camera.lookAt(look.current);
    if (tilt.current) {
      tilt.current.rotation.y += (px * 0.18 - tilt.current.rotation.y) * kk * 0.6;
      tilt.current.rotation.x += (-py * 0.08 - tilt.current.rotation.x) * kk * 0.6;
    }
  });

  return (
    <group ref={root}>
      <group ref={tilt}>{children}</group>
    </group>
  );
}
