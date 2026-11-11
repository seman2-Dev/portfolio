/** GLSL for the hero scene. Colour uniforms are linear THREE.Colors; output is converted via colorspace_fragment. */

export const holoVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){
    vP = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const holoFrag = /* glsl */ `
  uniform float uTime; uniform float uPulse; uniform float uBoost;
  uniform vec3 uA; uniform vec3 uB;
  uniform float uScale; uniform float uGrid; uniform float uBase; uniform float uFres;
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uFres);
    float y = vP.y * uScale;
    float lines = smoothstep(0.55, 0.95, sin(vP.y * 70.0 * uScale - uTime * 1.8) * 0.5 + 0.5) * 0.18;
    vec2 g = abs(fract(vP.xy * 5.0 * uScale + 0.5) - 0.5);
    float grid = smoothstep(0.455, 0.5, max(g.x, g.y)) * uGrid;
    float b = mod(uTime * 0.32, 1.0) * 3.2 - 1.6;
    float sweep = exp(-pow((y - b) * 5.0, 2.0));
    vec3 col = mix(uA, uB, clamp(y * 0.5 + 0.5, 0.0, 1.0));
    float a = uBase + f * 0.85 + grid + lines + sweep * 0.5 + uPulse * 0.25 + uBoost * 0.08;
    gl_FragColor = vec4(col * (0.8 + f * 1.4 + sweep * 0.8), clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

export const ringVert = /* glsl */ `
  varying vec2 vPos;
  void main(){ vPos = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export const ringFrag = /* glsl */ `
  uniform float uTime; uniform vec3 uColor; uniform float uSpeed; uniform float uTicks; uniform float uSweep; uniform float uBoost;
  varying vec2 vPos;
  void main(){
    float a = atan(vPos.y, vPos.x) / 6.28318530718;
    float t = fract(a - uTime * uSpeed * (1.0 + uBoost * 1.5));
    float tail = pow(t, 4.0);
    float ticks = uTicks > 0.5 ? mix(0.25, 1.0, step(0.5, fract(a * uTicks))) : 1.0;
    float alpha = (0.14 + tail * 0.95 * uSweep) * ticks;
    gl_FragColor = vec4(uColor * (0.9 + tail * 1.2), alpha);
    #include <colorspace_fragment>
  }
`;

export const traceVert = /* glsl */ `
  attribute float aD; attribute float aId;
  varying float vD; varying float vId; varying float vDepth;
  void main(){
    vD = aD; vId = aId;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const traceFrag = /* glsl */ `
  uniform float uTime; uniform float uBoost; uniform vec3 uC1; uniform vec3 uC2;
  varying float vD; varying float vId; varying float vDepth;
  void main(){
    float run = fract(uTime * (0.16 + vId * 0.14) * (1.0 + uBoost) + vId * 7.0 - vD * 0.07);
    float pulse = pow(run, 16.0);
    float fade = smoothstep(36.0, 10.0, vDepth);
    vec3 col = mix(uC1, uC2, step(0.55, vId));
    gl_FragColor = vec4(col * (0.8 + pulse * 1.6), (0.3 + pulse * 0.85) * fade);
    #include <colorspace_fragment>
  }
`;

export const floorVert = /* glsl */ `
  varying vec3 vW;
  void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;

export const floorFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uTime;
  varying vec3 vW;
  void main(){
    vec2 p = vW.xz * 0.5;
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float d = length(vW.xz - vec2(0.0, -4.0));
    float fade = smoothstep(26.0, 3.0, d);
    float ripple = 0.6 + 0.4 * sin(d * 0.9 - uTime * 1.2);
    gl_FragColor = vec4(uColor, line * 0.42 * fade * ripple);
    #include <colorspace_fragment>
  }
`;

export const columnVert = /* glsl */ `
  varying float vY; varying vec3 vC; varying float vDepth; varying float vSeed;
  void main(){
    vY = position.y + 0.5;
    #ifdef USE_INSTANCING_COLOR
      vC = instanceColor;
    #else
      vC = vec3(1.0);
    #endif
    vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vSeed = fract(sin(dot(instanceMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
    vec4 mv = viewMatrix * wp;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const columnFrag = /* glsl */ `
  uniform float uTime;
  varying float vY; varying vec3 vC; varying float vDepth; varying float vSeed;
  void main(){
    float fade = smoothstep(40.0, 8.0, vDepth);
    float body = smoothstep(0.0, 1.0, vY) * 0.2;
    float cap = pow(vY, 9.0) * 1.2;
    float streak = step(0.93, fract(vY * 6.0 - uTime * (0.3 + vSeed * 0.5) + vSeed * 9.0)) * 0.5 * vY;
    gl_FragColor = vec4(vC * (0.9 + cap), (body + cap * 0.7 + streak) * fade);
    #include <colorspace_fragment>
  }
`;

export const dustVert = /* glsl */ `
  uniform float uTime; uniform float uSize; uniform float uH;
  attribute float aSeed; attribute vec3 aColor;
  varying vec3 vColor; varying float vTw; varying float vDepth;
  void main(){
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.08 + aSeed * 0.12) + uH * 0.5, uH) - uH * 0.5;
    p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.35;
    p.z += cos(uTime * 0.17 + aSeed * 31.0) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    vTw = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 50.0);
    vColor = aColor;
    gl_PointSize = uSize * (0.5 + aSeed) * (30.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dustFrag = /* glsl */ `
  varying vec3 vColor; varying float vTw; varying float vDepth;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a *= a * vTw * smoothstep(34.0, 6.0, vDepth);
    gl_FragColor = vec4(vColor, a * 0.85);
    #include <colorspace_fragment>
  }
`;
