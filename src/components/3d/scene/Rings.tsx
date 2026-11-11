"use client";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { C, U, type SceneProps } from "./shared";
import { ringFrag, ringVert } from "./shaders";
import { sceneBus } from "../sceneBus";

function Ring({ r, w, color, speed, ticks, sweep, rot }: { r: number; w: number; color: THREE.Color; speed: number; ticks: number; sweep: number; rot: [number, number, number] }) {
  return (
    <mesh rotation={rot}>
      <ringGeometry args={[r - w / 2, r + w / 2, 160]} />
      <shaderMaterial
        vertexShader={ringVert}
        fragmentShader={ringFrag}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: U.time, uBoost: U.boost, uColor: { value: color }, uSpeed: { value: speed }, uTicks: { value: ticks }, uSweep: { value: sweep } }}
      />
    </mesh>
  );
}

/** Circular scanning rings around the shield + an expanding floor scan pulse. */
export function Rings({ animate, mobile }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const pulseA = useRef<THREE.Mesh>(null);
  const pulseB = useRef<THREE.Mesh>(null);
  const start = useRef(-10);
  const seen = useRef(0);

  useEffect(() => { seen.current = sceneBus.pulseCount; }, []);

  useFrame((s, dt) => {
    if (!animate) return;
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += dt * 0.12;
      group.current.rotation.z = Math.sin(t * 0.3) * 0.08;
    }
    // trigger: periodic or CTA ping
    if (sceneBus.pulseCount !== seen.current) { seen.current = sceneBus.pulseCount; start.current = t; }
    else if (t - start.current > 5.5) start.current = t;
    const k = (t - start.current) / 2.6;
    const on = k >= 0 && k <= 1;
    const e = 1 - Math.pow(1 - Math.min(Math.max(k, 0), 1), 3);
    U.pulse.value = on ? Math.sin(Math.min(k, 1) * Math.PI) : 0;
    for (const ref of [pulseA, pulseB]) {
      const m = ref.current;
      if (!m) continue;
      m.visible = on;
      const scale = 1 + e * (ref === pulseA ? 9 : 6.5);
      m.scale.setScalar(scale);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - e) * (ref === pulseA ? 0.7 : 0.9);
    }
  });

  return (
    <>
      <group ref={group}>
        <Ring r={2.55} w={0.035} color={C.green} speed={0.14} ticks={0} sweep={1} rot={[Math.PI / 2 - 0.28, 0, 0]} />
        <Ring r={2.95} w={0.02} color={C.cyan} speed={-0.09} ticks={72} sweep={0.6} rot={[Math.PI / 2 + 0.34, 0.2, 0]} />
        {!mobile && <Ring r={3.45} w={0.025} color={C.violet} speed={0.07} ticks={0} sweep={0.9} rot={[0.35, 0, 0.9]} />}
      </group>
      {/* expanding scan pulses on the floor plane */}
      <mesh ref={pulseA} position={[0, -2.55, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.97, 1, 128]} />
        <meshBasicMaterial color="#39ff88" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={pulseB} position={[0, -2.55, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.94, 1, 128]} />
        <meshBasicMaterial color="#00d9ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}
