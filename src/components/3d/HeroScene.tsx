"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Core, Shield } from "./scene/Core";
import { Rings } from "./scene/Rings";
import { Network } from "./scene/Network";
import { CircuitFloor, DataColumns, Dust } from "./scene/Environment";
import { Panels } from "./scene/Panels";
import { Clock, Composition, Lights } from "./scene/Rig";
import { sceneBus } from "./sceneBus";

export interface HeroSceneProps {
  mobile: boolean;
  animate: boolean;
  active: boolean;
  onReady?: () => void;
}

/**
 * The hero environment. Focal point: a holographic core inside a rotating shield,
 * ringed by scan sweeps, connected network nodes with moving packets, a circuit floor,
 * a data forest, floating HUD panels and atmospheric dust.
 */
export default function HeroScene({ mobile, animate, active, onReady }: HeroSceneProps) {
  const max = mobile ? 1.25 : 1.75;
  const [dpr, setDpr] = useState(max);
  const p = { mobile, animate };

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 0.5, 8.8], fov: 46, near: 0.1, far: 70 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: true }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); onReady?.(); }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(max)} />
      <fog attach="fog" args={["#05070d", 14, 40]} />
      <Clock />
      <Lights {...p} />
      <Composition animate={animate}>
        <group>
          <CircuitFloor {...p} />
          <DataColumns {...p} />
          <Dust {...p} />
        </group>
        <Network {...p} />
        <Panels {...p} />
        <Rings {...p} />
        <Core {...p} />
        <Shield {...p} />
      </Composition>
    </Canvas>
  );
}

export { sceneBus };
