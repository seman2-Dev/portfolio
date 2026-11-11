"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { profile } from "@/data/profile";
import { C, U, getGlowTexture, type SceneProps } from "./shared";
import { holoFrag, holoVert } from "./shaders";

/** Shield outline (heater shield) as an extruded, bevelled shape. */
function useShieldGeometry() {
  return useMemo(() => {
    const w = 1, h = 1.25;
    const s = new THREE.Shape();
    s.moveTo(0, h);
    s.bezierCurveTo(0.34, h * 0.93, 0.7, h * 0.96, w, h * 0.86);
    s.lineTo(w, 0.2);
    s.bezierCurveTo(w, -0.55, 0.46, -h * 0.78, 0, -h);
    s.bezierCurveTo(-0.46, -h * 0.78, -w, -0.55, -w, 0.2);
    s.lineTo(-w, h * 0.86);
    s.bezierCurveTo(-0.7, h * 0.96, -0.34, h * 0.93, 0, h);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2, curveSegments: 28 });
    g.center();
    // inner "plate" outline, slightly smaller, for a layered look
    return g;
  }, []);
}

function HoloMaterial({ a, b, grid, base, fres, scale }: { a: THREE.Color; b: THREE.Color; grid: number; base: number; fres: number; scale: number }) {
  return (
    <shaderMaterial
      vertexShader={holoVert}
      fragmentShader={holoFrag}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
      uniforms={{
        uTime: U.time, uPulse: U.pulse, uBoost: U.boost,
        uA: { value: a }, uB: { value: b },
        uScale: { value: scale }, uGrid: { value: grid }, uBase: { value: base }, uFres: { value: fres },
      }}
    />
  );
}

/** Loads profile.photo for the shield's centre. No Suspense — pops in when ready; null when missing/failed. */
function usePortraitTexture() {
  const url = profile.photo;
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (!alive) { t.dispose(); return; }
        const img = t.image as HTMLImageElement;
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        // Circle maps the whole texture onto a square — crop so the face isn't stretched or beheaded.
        if (iw && ih && ih > iw) {
          const s = iw / ih;
          t.repeat.set(1, s);
          t.offset.set(0, 1 - s); // top-aligned: heads sit near the top of portrait shots
        } else if (iw > ih) {
          const s = ih / iw;
          t.repeat.set(s, 1);
          t.offset.set((1 - s) / 2, 0);
        }
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => {},
    );
    return () => { alive = false; };
  }, [url]);
  return tex;
}

export function Shield({ animate }: SceneProps) {
  const geo = useShieldGeometry();
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 28), [geo]);
  const group = useRef<THREE.Group>(null);

  const theta = useRef(0);
  useFrame((s, dt) => {
    const g = group.current;
    if (!g || !animate) return;
    // Continuous rotation whose speed drops when the shield faces the viewer (θ≈0,π)
    // and rushes through the edge-on pose, so it always reads as a shield.
    const w = 0.28 + 1.15 * Math.abs(Math.sin(theta.current));
    theta.current += w * dt * (1 + U.boost.value * 0.8);
    g.rotation.y = theta.current;
    g.rotation.x = Math.sin(s.clock.elapsedTime * 0.5) * 0.06;
    g.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group ref={group} scale={1.32}>
      <mesh geometry={geo}>
        <HoloMaterial a={C.green} b={C.cyan} grid={0.4} base={0.05} fres={2.0} scale={0.8} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#39ff88" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {/* inner plate */}
      <mesh geometry={geo} scale={0.84} position={[0, 0, 0]}>
        <HoloMaterial a={C.cyan} b={C.violet} grid={0.0} base={0.03} fres={3.0} scale={0.8} />
      </mesh>
    </group>
  );
}

export function Core({ animate, mobile }: SceneProps) {
  const core = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.Group>(null);
  const halo = getGlowTexture();
  const portrait = usePortraitTexture();
  const ico = useMemo(() => new THREE.IcosahedronGeometry(0.98, 1), []);
  const latticeEdges = useMemo(() => new THREE.EdgesGeometry(ico), [ico]);
  const latticePts = useMemo(() => {
    const p = ico.getAttribute("position");
    const seen = new Map<string, number>();
    const out: number[] = [];
    for (let i = 0; i < p.count; i++) {
      const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
      if (!seen.has(k)) { seen.set(k, 1); out.push(p.getX(i), p.getY(i), p.getZ(i)); }
    }
    return new Float32Array(out);
  }, [ico]);

  useFrame((s, dt) => {
    if (!animate) return;
    const t = s.clock.elapsedTime;
    if (core.current) {
      const k = 1 + Math.sin(t * 2.2) * 0.035 + U.pulse.value * 0.12 + U.boost.value * 0.06;
      core.current.scale.setScalar(k);
      core.current.rotation.y += dt * 0.55;
      core.current.rotation.x += dt * 0.2;
    }
    if (lattice.current) {
      lattice.current.rotation.y -= dt * 0.3;
      lattice.current.rotation.z += dt * 0.12;
    }
  });

  return (
    <group>
      {/* centre of the shield: the portrait, always facing the camera; holographic core when no photo */}
      {portrait ? (
        <Billboard position={[0, 0, 0.14]}>
          <mesh>
            <circleGeometry args={[0.64, 48]} />
            <meshBasicMaterial map={portrait} toneMapped={false} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.64, 0.672, 64]} />
            <meshBasicMaterial color="#39ff88" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.7, 0.712, 64]} />
            <meshBasicMaterial color="#00d9ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      ) : (
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[0.52, mobile ? 2 : 3]} />
            <HoloMaterial a={C.cyan} b={C.green} grid={0} base={0.12} fres={1.8} scale={1.8} />
          </mesh>
          <mesh scale={0.42}>
            <icosahedronGeometry args={[0.52, 1]} />
            <meshBasicMaterial color="#7fffe0" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      )}
      {/* data lattice orbiting the core */}
      <group ref={lattice}>
        <lineSegments geometry={latticeEdges}>
          <lineBasicMaterial color="#00d9ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[latticePts, 3]} />
          </bufferGeometry>
          <pointsMaterial map={halo} size={0.26} color="#b58cff" transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
      </group>
      {/* soft halo (always faces camera) */}
      <Billboard>
        <mesh scale={mobile ? 5 : 6.4}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={halo} color="#00d9ff" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh scale={mobile ? 2.4 : 3.1} position={[0, 0, 0.05]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={halo} color="#39ff88" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </Billboard>
    </group>
  );
}
