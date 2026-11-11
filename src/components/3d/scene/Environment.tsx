"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { C, U, getGlowTexture, mulberry32, type SceneProps } from "./shared";
import { columnFrag, columnVert, dustFrag, dustVert, floorFrag, floorVert, traceFrag, traceVert } from "./shaders";

const FLOOR_Y = -2.55;

function buildTraces(count: number) {
  const rnd = mulberry32(42);
  const dirs: [number, number][] = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const pos: number[] = [], aD: number[] = [], aId: number[] = [], pads: number[] = [];
  for (let i = 0; i < count; i++) {
    let x = (rnd() - 0.5) * 30, z = 3 - rnd() * 22;
    let d = Math.floor(rnd() * 8);
    const id = rnd();
    let dist = 0;
    pads.push(x, 0, z);
    const segs = 3 + Math.floor(rnd() * 4);
    for (let s = 0; s < segs; s++) {
      const len = 1.1 + rnd() * 3.2;
      const [dx, dz] = dirs[d];
      const n = Math.hypot(dx, dz);
      const nx = x + (dx / n) * len, nz = z + (dz / n) * len;
      pos.push(x, 0, z, nx, 0, nz);
      aD.push(dist, dist + len);
      aId.push(id, id);
      dist += len; x = nx; z = nz;
      d = (d + (rnd() > 0.5 ? 1 : 7)) % 8;
    }
    pads.push(x, 0, z);
  }
  return { pos: new Float32Array(pos), aD: new Float32Array(aD), aId: new Float32Array(aId), pads: new Float32Array(pads) };
}

/** Circuit-board floor: fading grid, glowing pulse traces, solder pads and a soft light pool. */
export function CircuitFloor({ mobile }: SceneProps) {
  const t = useMemo(() => buildTraces(mobile ? 34 : 78), [mobile]);
  const glow = getGlowTexture();
  return (
    <group position={[0, FLOOR_Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -4]}>
        <planeGeometry args={[90, 90]} />
        <shaderMaterial vertexShader={floorVert} fragmentShader={floorFrag} transparent depthWrite={false} blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: C.cyan }, uTime: U.time }} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={15}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glow} color="#39ff88" transparent opacity={0.34} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[t.pos, 3]} />
          <bufferAttribute attach="attributes-aD" args={[t.aD, 1]} />
          <bufferAttribute attach="attributes-aId" args={[t.aId, 1]} />
        </bufferGeometry>
        <shaderMaterial vertexShader={traceVert} fragmentShader={traceFrag} transparent depthWrite={false} blending={THREE.AdditiveBlending}
          uniforms={{ uTime: U.time, uBoost: U.boost, uC1: { value: C.green }, uC2: { value: C.cyan } }} />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[t.pads, 3]} />
        </bufferGeometry>
        <pointsMaterial map={glow} size={0.32} color="#39ff88" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}

/** "Digital forest": tall emissive data columns receding into the fog. */
export function DataColumns({ mobile }: SceneProps) {
  const count = mobile ? 20 : 54;
  const set = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const rnd = mulberry32(77);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const side = rnd() > 0.5 ? 1 : -1;
      const x = side * (5 + rnd() * 13);
      const z = -5 - rnd() * 20;
      const h = 1 + rnd() * rnd() * 5.5;
      const w = 0.1 + rnd() * 0.22;
      m.compose(new THREE.Vector3(x, FLOOR_Y + h / 2, z), q, new THREE.Vector3(w, h, w));
      mesh.setMatrixAt(i, m);
      const r = rnd();
      col.copy(r > 0.7 ? C.violet : r > 0.35 ? C.cyan : C.green);
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <instancedMesh ref={set} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial vertexShader={columnVert} fragmentShader={columnFrag} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{ uTime: U.time }} />
    </instancedMesh>
  );
}

/** Atmospheric dust — animated entirely in the vertex shader (zero CPU per frame). */
export function Dust({ mobile }: SceneProps) {
  const n = mobile ? 200 : 620;
  const { pos, seed, col } = useMemo(() => {
    const rnd = mulberry32(3);
    const pos = new Float32Array(n * 3), seed = new Float32Array(n), col = new Float32Array(n * 3);
    const pal = [C.green, C.cyan, C.violet, C.cyan];
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rnd() - 0.5) * 28;
      pos[i * 3 + 1] = (rnd() - 0.5) * 12;
      pos[i * 3 + 2] = -rnd() * 22 + 6;
      seed[i] = rnd();
      pal[Math.floor(rnd() * pal.length)].toArray(col, i * 3);
    }
    return { pos, seed, col };
  }, [n]);
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[col, 3]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={dustVert} fragmentShader={dustFrag} transparent depthWrite={false} blending={THREE.AdditiveBlending}
        uniforms={{ uTime: U.time, uSize: { value: mobile ? 2.2 : 2.6 }, uH: { value: 12 } }} />
    </points>
  );
}
