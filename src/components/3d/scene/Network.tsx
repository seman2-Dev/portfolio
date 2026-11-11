"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { C, getGlowTexture, mulberry32, type SceneProps } from "./shared";

interface NetData {
  nodes: THREE.Vector3[];
  edges: [number, number][];
  linePos: Float32Array;
  colors: THREE.Color[];
}

function build(N: number): NetData {
  const rnd = mulberry32(11);
  const nodes: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * golden;
    const rad = 3.6 + rnd() * 1.3;
    nodes.push(new THREE.Vector3(Math.cos(th) * r * rad * 1.15, y * rad * 0.7, Math.sin(th) * r * rad * 0.55));
  }
  const edges: [number, number][] = [];
  const has = new Set<string>();
  const add = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || has.has(k)) return;
    has.add(k);
    edges.push([a, b]);
  };
  for (let i = 0; i < N; i++) {
    const d = nodes.map((p, j) => [j, p.distanceToSquared(nodes[i])] as const).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
    add(i, d[0][0]);
    add(i, d[1][0]);
  }
  // uplinks to the core (index N = origin)
  nodes.push(new THREE.Vector3(0, 0, 0));
  for (let i = 0; i < Math.min(7, N); i++) add(Math.floor((i * N) / 7), N);
  const linePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    nodes[a].toArray(linePos, i * 6);
    nodes[b].toArray(linePos, i * 6 + 3);
  });
  const pal = [C.green, C.cyan, C.violet];
  const colors = nodes.map((_, i) => pal[i % 3]);
  return { nodes, edges, linePos, colors };
}

/** Connected network nodes with animated data packets travelling along the links. */
interface PacketState { edge: Int32Array; t: Float32Array; speed: Float32Array; dir: Int8Array; rnd: () => number }
/** Advances every packet along its edge; re-rolls edge and direction on arrival. */
function stepPackets(st: PacketState, dt: number, edgeCount: number, count: number) {
  for (let i = 0; i < count; i++) {
    st.t[i] += st.speed[i] * dt;
    if (st.t[i] >= 1) {
      st.t[i] = 0;
      st.edge[i] = Math.floor(st.rnd() * edgeCount);
      st.dir[i] = st.rnd() > 0.5 ? 1 : -1;
    }
  }
}

export function Network({ animate, mobile }: SceneProps) {
  const N = mobile ? 14 : 26;
  const P = mobile ? 14 : 34;
  const data = useMemo(() => build(N), [N]);
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const glow = getGlowTexture();

  const packetState = useMemo(() => {
    const rnd = mulberry32(5);
    return {
      edge: Int32Array.from({ length: P }, () => Math.floor(rnd() * data.edges.length)),
      t: Float32Array.from({ length: P }, () => rnd()),
      speed: Float32Array.from({ length: P }, () => 0.18 + rnd() * 0.3),
      dir: Int8Array.from({ length: P }, () => (rnd() > 0.5 ? 1 : -1)),
      rnd,
    };
  }, [P, data]);

  const haloColors = useMemo(() => {
    const a = new Float32Array(data.nodes.length * 3);
    data.colors.forEach((c, i) => c.toArray(a, i * 3));
    return a;
  }, [data]);
  const haloPos = useMemo(() => {
    const a = new Float32Array(data.nodes.length * 3);
    data.nodes.forEach((p, i) => p.toArray(a, i * 3));
    return a;
  }, [data]);

  const setNodes = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < N; i++) {
      const s = 0.035 + ((i * 37) % 10) / 10 * 0.04;
      m.compose(data.nodes[i], new THREE.Quaternion(), new THREE.Vector3(s, s, s));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, data.colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  const setPackets = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const pal = [C.green, C.cyan, C.violet, C.cyan];
    for (let i = 0; i < P; i++) mesh.setColorAt(i, pal[i % pal.length]);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  const tmpM = useMemo(() => new THREE.Matrix4(), []);
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpS = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, dt) => {
    if (!animate) return;
    if (group.current) group.current.rotation.y += dt * 0.045;
    const mesh = packets.current;
    if (!mesh) return;
    stepPackets(packetState, dt, data.edges.length, P);
    const st = packetState;
    for (let i = 0; i < P; i++) {
      const [a, b] = data.edges[st.edge[i]];
      const u = st.dir[i] === 1 ? st.t[i] : 1 - st.t[i];
      tmpP.lerpVectors(data.nodes[a], data.nodes[b], u);
      const sc = 0.5 + Math.sin(st.t[i] * Math.PI) * 0.9;
      tmpS.setScalar(0.035 * sc);
      tmpM.compose(tmpP, q, tmpS);
      mesh.setMatrixAt(i, tmpM);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00d9ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      {/* lit nodes: react to the moving coloured point lights */}
      <instancedMesh ref={setNodes} args={[undefined, undefined, N]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.35} metalness={0.2} emissive="#2a6a8a" emissiveIntensity={0.9} />
      </instancedMesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[haloPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[haloColors, 3]} />
        </bufferGeometry>
        <pointsMaterial map={glow} size={0.55} vertexColors transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>

      <instancedMesh ref={(m) => { packets.current = m; setPackets(m); }} args={[undefined, undefined, P]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
