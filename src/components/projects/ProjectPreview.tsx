import type { ProjectPreview as Kind } from "@/types";

/**
 * Generated artwork for each project (used when no real screenshot is configured).
 * Pure SVG: no assets to load, scales to any card, subtly animates on parent `group` hover.
 */
const G = "#39ff88", C = "#00d9ff", V = "#9b5cff", L = "#263348", S = "#101827", B = "#0a1020";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg role="img" aria-label={label} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="pv-g" x1="0" x2="1"><stop offset="0" stopColor={G} /><stop offset=".55" stopColor={C} /><stop offset="1" stopColor={V} /></linearGradient>
        <radialGradient id="pv-glow"><stop offset="0" stopColor={C} stopOpacity=".55" /><stop offset="1" stopColor={C} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="320" height="200" fill={B} />
      <path d="M0 160h320M0 120h320M0 80h320M0 40h320M80 0v200M160 0v200M240 0v200" stroke={L} strokeOpacity=".35" />
      {children}
    </svg>
  );
}

export function ProjectPreview({ kind, title }: { kind: Kind | "terminal"; title: string }) {
  const label = `${title} — illustrative preview`;
  switch (kind) {
    case "portfolio":
      return (
        <Frame label={label}>
          <rect x="30" y="26" width="260" height="150" rx="8" fill={S} stroke={L} />
          <path d="M30 46h260" stroke={L} />
          {[44, 56, 68].map((x, i) => <circle key={x} cx={x} cy="36" r="3" fill={[V, C, G][i]} />)}
          <rect x="46" y="62" width="110" height="9" rx="4" fill="url(#pv-g)" />
          <rect x="46" y="78" width="80" height="5" rx="2.5" fill={L} />
          <rect x="46" y="90" width="96" height="5" rx="2.5" fill={L} />
          <rect x="46" y="108" width="40" height="14" rx="7" fill={G} />
          <rect x="92" y="108" width="40" height="14" rx="7" fill="none" stroke={C} />
          {[46, 98, 150].map((x) => <rect key={x} x={x} y="136" width="44" height="28" rx="5" fill={B} stroke={L} />)}
          <circle cx="232" cy="96" r="44" fill="url(#pv-glow)" />
          <circle cx="232" cy="96" r="26" fill="none" stroke={C} strokeOpacity=".6" />
          <circle cx="232" cy="96" r="12" fill="none" stroke={G} />
          <circle cx="232" cy="96" r="4" fill={G} className="pulse-dot" />
          <path d="M232 70v-12M258 96h14M232 122v12M206 96h-14" stroke={V} />
        </Frame>
      );
    case "soc":
      return (
        <Frame label={label}>
          <rect x="22" y="20" width="170" height="104" rx="6" fill={S} stroke={L} />
          {[[44, 70, 90, 46], [90, 46, 136, 80], [90, 46, 120, 108], [136, 80, 170, 54], [44, 70, 76, 106]].map(([a, b, c, d], i) => (
            <path key={i} d={`M${a} ${b}L${c} ${d}`} stroke={C} strokeOpacity=".5" className="flow" />
          ))}
          {[[44, 70, G], [90, 46, C], [136, 80, V], [120, 108, C], [170, 54, G], [76, 106, V]].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r="5" fill={B} stroke={c as string} strokeWidth="1.5" />)}
          <circle cx="170" cy="54" r="12" fill="none" stroke={G} strokeOpacity=".5" className="pulse-dot" />
          <rect x="204" y="20" width="94" height="48" rx="6" fill={S} stroke={L} />
          <path d="M212 58l10-14 9 8 11-18 10 12 9-10 12 8 10-6" fill="none" stroke={G} strokeWidth="1.6" />
          <rect x="204" y="76" width="94" height="48" rx="6" fill={S} stroke={L} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={214 + i * 20} y={116 - [14, 28, 18, 34][i]} width="12" height={[14, 28, 18, 34][i]} fill={[C, G, V, "#ff5d73"][i]} opacity=".85" />)}
          <rect x="22" y="134" width="276" height="46" rx="6" fill={S} stroke={L} />
          {[0, 1, 2].map((i) => <g key={i}><circle cx="38" cy={150 + i * 12} r="2.5" fill={[G, "#ffc857", "#ff5d73"][i]} /><rect x="48" y={147 + i * 12} width={[150, 120, 176][i]} height="5" rx="2.5" fill={L} /></g>)}
        </Frame>
      );
    case "terminal":
      return (
        <Frame label={label}>
          <rect x="30" y="22" width="260" height="156" rx="8" fill="#060a12" stroke={L} />
          <path d="M30 42h260" stroke={L} />
          {[44, 56, 68].map((x, i) => <circle key={x} cx={x} cy="32" r="3" fill={["#ff5d73", "#ffc857", G][i]} />)}
          {[["$ help", G, 60], ["  skills  projects  owasp", C, 76], ["$ explain xss", G, 94], ["  context-aware output encoding", V, 110], ["  Content-Security-Policy", V, 124], ["$ scan-demo", G, 142]].map(([t, c, y], i) => (
            <text key={i} x="44" y={y as number} fill={c as string} fontFamily="ui-monospace, monospace" fontSize="10">{t}</text>
          ))}
          <rect x="44" y="152" width="7" height="12" fill={G} className="caret" />
        </Frame>
      );
    case "scene":
      return (
        <Frame label={label}>
          <ellipse cx="160" cy="100" rx="120" ry="38" fill="none" stroke={C} strokeOpacity=".4" />
          <ellipse cx="160" cy="100" rx="86" ry="26" fill="none" stroke={V} strokeOpacity=".5" />
          <ellipse cx="160" cy="100" rx="52" ry="15" fill="none" stroke={G} strokeOpacity=".6" />
          <circle cx="160" cy="100" r="70" fill="url(#pv-glow)" />
          <path d="M160 52l32 12v26c0 20-13 36-32 44-19-8-32-24-32-44V64z" fill="rgb(57 255 136 / .08)" stroke={G} strokeWidth="1.6" />
          <path d="M160 70l16 6v14c0 10-6 18-16 22-10-4-16-12-16-22V76z" fill="none" stroke={C} />
          <circle cx="160" cy="92" r="4" fill={G} className="pulse-dot" />
          {[[60, 78], [264, 118], [96, 148], [236, 56], [40, 120], [282, 84]].map(([x, y], i) => (
            <g key={i}><path d={`M${x} ${y}L160 100`} stroke={C} strokeOpacity=".25" /><circle cx={x} cy={y} r="3.5" fill={[G, C, V][i % 3]} /></g>
          ))}
        </Frame>
      );
    case "api":
      return (
        <Frame label={label}>
          {[[26, "CLIENT", C], [128, "ROUTE", G], [230, "DATA", V]].map(([x, t, c]) => (
            <g key={t as string}>
              <rect x={x as number} y="62" width="64" height="76" rx="8" fill={S} stroke={c as string} strokeOpacity=".7" />
              <text x={(x as number) + 32} y="82" textAnchor="middle" fill={c as string} fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing="1.5">{t}</text>
              {[96, 108, 120].map((y) => <rect key={y} x={(x as number) + 10} y={y} width={[40, 32, 44][(y - 96) / 12]} height="4" rx="2" fill={L} />)}
            </g>
          ))}
          <path d="M90 100h38M192 100h38" stroke={G} strokeWidth="1.4" className="flow" />
          <path d="M120 96l8 4-8 4zM222 96l8 4-8 4z" fill={G} />
          <g transform="translate(144 36)"><rect width="32" height="20" rx="4" fill={B} stroke={G} /><path d="M10 10v-3a6 6 0 0 1 12 0v3" fill="none" stroke={G} transform="translate(0 -2)" /><rect x="9" y="9" width="14" height="9" rx="2" fill={G} /></g>
          <text x="160" y="164" textAnchor="middle" fill={C} fontFamily="ui-monospace, monospace" fontSize="9" opacity=".8">validate → rate-limit → escape</text>
        </Frame>
      );
  }
}
