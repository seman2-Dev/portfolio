"use client";
import { useEffect, useRef, useState } from "react";
import { Play, ShieldCheck, RotateCcw } from "lucide-react";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type N = { id: string; label: string; x: number; y: number; c: string };
const nodes: N[] = [
  { id: "net", label: "Internet", x: 0.08, y: 0.5, c: "#94a3b8" },
  { id: "fw", label: "Firewall", x: 0.28, y: 0.5, c: "#39ff88" },
  { id: "lb", label: "Load Balancer", x: 0.48, y: 0.5, c: "#00d9ff" },
  { id: "web", label: "Web App", x: 0.7, y: 0.25, c: "#00d9ff" },
  { id: "api", label: "API", x: 0.7, y: 0.75, c: "#9b5cff" },
  { id: "db", label: "Database", x: 0.92, y: 0.5, c: "#9b5cff" },
];
const edges: [string, string][] = [["net", "fw"], ["fw", "lb"], ["lb", "web"], ["lb", "api"], ["web", "db"], ["api", "db"]];

function Topology({ animate }: { animate: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const vis = useRef(true);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    let w = 0, h = 0, raf = 0;
    const packets = Array.from({ length: 14 }, (_, i) => ({ e: i % edges.length, t: (i * 0.173) % 1, s: 0.12 + (i % 5) * 0.03, bad: i % 7 === 0 }));

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(() => { resize(); draw(0); });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { vis.current = e.isIntersecting; }, { threshold: 0 });
    io.observe(cv);

    const pos = (n: N) => [n.x * w, n.y * h] as const;

    function draw(dt: number) {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const [x1, y1] = pos(byId[a]); const [x2, y2] = pos(byId[b]);
        ctx.strokeStyle = "rgba(38,51,72,1)";
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      for (const p of packets) {
        if (animate) { p.t += p.s * dt; if (p.t > 1) p.t = 0; }
        const [a, b] = edges[p.e];
        const [x1, y1] = pos(byId[a]); const [x2, y2] = pos(byId[b]);
        const x = x1 + (x2 - x1) * p.t, y = y1 + (y2 - y1) * p.t;
        // "suspicious" packets are shown blocked at the firewall edge only visually
        ctx.fillStyle = p.bad ? "#ff5d73" : "#39ff88";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      for (const n of nodes) {
        const [x, y] = pos(n);
        ctx.fillStyle = "#0a1020"; ctx.strokeStyle = n.c; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const narrow = w < 480;
        ctx.fillStyle = "#94a3b8"; ctx.font = `${narrow ? 9 : 11}px 'JetBrains Mono Variable', monospace`; ctx.textAlign = "center";
        // narrow screens: stagger labels above/below and keep them inside the canvas
        const tw = ctx.measureText(n.label).width;
        const lx = Math.min(w - tw / 2 - 2, Math.max(tw / 2 + 2, x));
        const above = narrow && nodes.indexOf(n) % 2 === 1;
        ctx.fillText(n.label, lx, above ? y - 22 : y + 32);
      }
    }

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (vis.current) draw(dt);
      raf = requestAnimationFrame(loop);
    };
    resize(); draw(0);
    if (animate) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [animate]);

  return <canvas ref={ref} role="img" aria-label="Simulated network topology: internet, firewall, load balancer, web app, API and database, with animated example packets." className="h-64 w-full sm:h-72" />;
}

const EVENT_POOL = [
  ["info", "Login success for demo-user"],
  ["info", "Static asset served from cache"],
  ["warn", "Rate limit threshold approached on /api/demo"],
  ["warn", "Unusual User-Agent flagged (example)"],
  ["block", "Request blocked: malformed payload (example)"],
  ["block", "Blocked repeated failed logins from 203.0.113.7 (documentation IP)"],
  ["info", "TLS certificate check passed"],
] as const;

const SCAN_STEPS = [
  ["Checking security headers", "warn", "CSP missing (example finding)"],
  ["Checking TLS configuration", "ok", "TLS 1.3 only (example)"],
  ["Checking cookie flags", "ok", "HttpOnly + Secure set (example)"],
  ["Checking dependency versions", "warn", "1 outdated package (example)"],
  ["Checking auth rate limiting", "ok", "Limits enforced (example)"],
] as const;

const tone = { info: "text-cyan", warn: "text-yellow-400", block: "text-neon", ok: "text-neon" } as const;

export function SecurityDashboard() {
  const reduce = usePrefersReducedMotion();
  const [events, setEvents] = useState<{ id: number; lvl: keyof typeof tone; msg: string; t: string }[]>([]);
  const [scan, setScan] = useState<{ step: number; running: boolean }>({ step: 0, running: false });
  const [counts, setCounts] = useState({ info: 0, warn: 0, block: 0 });

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const [lvl, msg] = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const t = new Date().toLocaleTimeString([], { hour12: false });
      setEvents((e) => [{ id: id++, lvl, msg, t }, ...e].slice(0, 6));
      setCounts((c) => ({ ...c, [lvl]: c[lvl] + 1 }));
    };
    tick();
    if (reduce) return;
    const iv = setInterval(tick, 2600);
    return () => clearInterval(iv);
  }, [reduce]);

  useEffect(() => {
    if (!scan.running) return;
    if (scan.step >= SCAN_STEPS.length) { const t = setTimeout(() => setScan((s) => ({ ...s, running: false })), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setScan((s) => ({ ...s, step: s.step + 1 })), reduce ? 50 : 700);
    return () => clearTimeout(t);
  }, [scan, reduce]);

  return (
    <div className="glass holo scanline relative overflow-hidden p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><ShieldCheck className="h-5 w-5 text-neon" aria-hidden /> Defense Center — demo</h3>
        <SimulatedBadge />
      </div>
      <p className="mb-4 text-sm text-mute">Everything below is generated in your browser for demonstration. No real systems are monitored and no real traffic is analysed.</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-bg/60 p-3 lg:col-span-2">
          <p className="mb-1 font-mono text-[11px] text-mute">NETWORK TOPOLOGY · animated example packets (<span className="text-neon">green</span> normal, <span className="text-red-400">red</span> suspicious)</p>
          <Topology animate={!reduce} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-bg/60 p-4">
            <p className="font-mono text-[11px] text-mute">SHIELD · THREAT LEVEL LOW (demo)</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
              <div aria-hidden className="relative grid h-[88px] w-[88px] shrink-0 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ animation: "spin-slow 18s linear infinite" }}><circle cx="50" cy="50" r="46" fill="none" stroke="#00d9ff" strokeOpacity=".55" strokeDasharray="2 7" strokeWidth="1.5" /></svg>
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ animation: "spin-slow 11s linear infinite reverse" }}><circle cx="50" cy="50" r="38" fill="none" stroke="#39ff88" strokeOpacity=".6" strokeDasharray="22 10" strokeWidth="1.2" /></svg>
                <span className="absolute h-14 w-14 rounded-full bg-neon/10 blur-xl" />
                <svg viewBox="0 0 48 56" className="relative h-10 w-9">
                  <path d="M24 3 44 11v16c0 13-8.5 22-20 26C12.500 49 4 40 4 27V11z" fill="rgb(57 255 136 / .1)" stroke="#39ff88" strokeWidth="2" />
                  <path d="m15 28 7 7 12-14" fill="none" stroke="#39ff88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <dl className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div><dt className="text-mute">info</dt><dd className="text-lg text-cyan">{counts.info}</dd></div>
                <div><dt className="text-mute">warn</dt><dd className="text-lg text-yellow-400">{counts.warn}</dd></div>
                <div><dt className="text-mute">blocked</dt><dd className="text-lg text-neon">{counts.block}</dd></div>
              </dl>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-bg/60 p-4">
            <div className="flex flex-col items-start gap-3">
              <p className="font-mono text-[11px] text-mute">VULNERABILITY SCAN (simulated)</p>
              <button
                type="button"
                disabled={scan.running}
                onClick={() => setScan({ step: 0, running: true })}
                className="inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-neon/50 px-3 text-xs text-neon transition hover:bg-neon/10 disabled:opacity-50"
              >
                {scan.step >= SCAN_STEPS.length ? <RotateCcw className="h-3 w-3" aria-hidden /> : <Play className="h-3 w-3" aria-hidden />}
                {scan.step >= SCAN_STEPS.length ? "Run again" : "Run demo scan"}
              </button>
            </div>
            <ul className="mt-3 space-y-1.5 font-mono text-[11px]" aria-live="polite">
              {SCAN_STEPS.slice(0, scan.step).map(([a, s, r]) => (
                <li key={a} className="flex gap-2"><span className={tone[s]}>[{s}]</span><span className="text-mute">{a} — {r}</span></li>
              ))}
              {scan.running && scan.step < SCAN_STEPS.length && <li className="text-mute">scanning<span className="caret">_</span></li>}
              {!scan.running && scan.step === 0 && <li className="text-mute">Press the button to run a fictional scan.</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-bg/60 p-4">
        <p className="mb-2 font-mono text-[11px] text-mute">SECURITY EVENT FEED (randomly generated examples)</p>
        <ul className="space-y-1 font-mono text-xs" aria-label="Simulated security events">
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-x-3"><span className="text-mute">{e.t}</span><span className={cn("w-12", tone[e.lvl])}>{e.lvl.toUpperCase()}</span><span className="text-ink/80">{e.msg}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
