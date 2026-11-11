"use client";
import { forwardRef } from "react";
import { ShieldCheck } from "lucide-react";
import { profile } from "@/data/profile";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const tone = {
  developer: { text: "text-cyan", chip: "border-cyan/30 bg-cyan/10 text-cyan", glow: "from-cyan/20" },
  security: { text: "text-neon", chip: "border-neon/30 bg-neon/10 text-neon", glow: "from-neon/20" },
  explorer: { text: "text-violet", chip: "border-violet/30 bg-violet/10 text-violet", glow: "from-violet/25" },
} as const;

/** Isometric layered stack: UI / API / DATA. Layers fan apart on hover. */
function StackVisual() {
  const layers = [["DATA", "border-violet/50 bg-violet/15"], ["API", "border-neon/50 bg-neon/10"], ["UI", "border-cyan/60 bg-cyan/15"]];
  return (
    <div aria-hidden className="relative h-44 [perspective:900px]">
      <div className="absolute inset-0 grid place-items-center [--gap:16px] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-36deg)] group-hover:[--gap:40px] group-focus-within:[--gap:40px]">
        {layers.map(([label, cls], i) => (
          <div
            key={label}
            className={cn("absolute grid h-24 w-44 place-items-center rounded-lg border font-mono text-xs tracking-widest text-ink/90 shadow-[0_0_30px_-8px_currentColor] transition-transform duration-500", cls)}
            style={{ transform: `translateZ(calc(var(--gap) * ${i}))` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Radar with a rotating sweep and blips; sweep speeds up on hover. */
function RadarVisual() {
  return (
    <div aria-hidden className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 176 176" className="absolute inset-0 text-neon/40">
        {[28, 52, 76].map((r) => <circle key={r} cx="88" cy="88" r={r} fill="none" stroke="currentColor" strokeWidth="1" />)}
        <path d="M88 8v160M8 88h160" stroke="currentColor" strokeWidth="1" />
        <path d="M88 8v6M88 162v6M8 88h6M162 88h6" stroke="rgb(57 255 136)" strokeWidth="2" />
      </svg>
      <div className="absolute inset-[6px] animate-[sweep_5s_linear_infinite] rounded-full [background:conic-gradient(from_0deg,rgb(57_255_136/0.5),transparent_30%)] group-hover:[animation-duration:1.8s]" />
      {[[58, 40, "0s"], [118, 64, "1.2s"], [102, 126, "2.4s"]].map(([x, y, d], i) => (
        <span key={i} className="absolute h-2 w-2 rounded-full bg-neon shadow-[0_0_10px_2px_rgb(57_255_136/0.8)]" style={{ left: x as number, top: y as number, animation: `pulse-dot 2.4s ${d} ease-in-out infinite` }} />
      ))}
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-neon/50 bg-bg/80 backdrop-blur"><ShieldCheck className="h-6 w-6 text-neon" /></span>
      </div>
    </div>
  );
}

/** Orbiting bodies around a glowing centre. */
function OrbitVisual() {
  const orbits = [[64, "9s", "bg-cyan"], [92, "14s", "bg-violet"], [120, "22s", "bg-neon"]] as const;
  return (
    <div aria-hidden className="relative mx-auto h-44 w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_30px_10px_rgb(155_92_255/0.55)]" />
      {orbits.map(([r, dur, c], i) => (
        <div key={r} className="absolute left-1/2 top-1/2 rounded-full border border-violet/25" style={{ width: r * 2, height: r * 2 * 0.42, marginLeft: -r, marginTop: -r * 0.21, transform: `rotate(${i * 24 - 20}deg)` }}>
          <div className="absolute inset-0 animate-[spin-slow_var(--d)_linear_infinite] group-hover:[animation-duration:4s]" style={{ "--d": dur } as React.CSSProperties}>
            <span className={cn("absolute -top-1 left-1/2 h-2 w-2 rounded-full", c)} style={{ boxShadow: "0 0 12px 2px currentColor" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Tags({ tags, cls }: { tags: string[]; cls: string }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-1.5">
      {tags.map((t) => <li key={t} className={cn("rounded-full border px-2.5 py-1 font-mono text-[10.5px]", cls)}>{t}</li>)}
    </ul>
  );
}

function NotchEdges() {
  const line = "absolute h-7 w-7 [background:linear-gradient(to_bottom_left,transparent_calc(50%-0.5px),rgb(0_217_255/0.55)_50%,transparent_calc(50%+0.5px))]";
  return (
    <>
      <span aria-hidden className={cn(line, "right-0 top-0 [clip-path:none]")} />
      <span aria-hidden className={cn(line, "bottom-0 left-0")} />
    </>
  );
}

type Key = "developer" | "security" | "explorer";
const shape: Record<Key, string> = {
  developer: "notch",
  security: "rounded-[28px]",
  explorer: "rounded-[18px] rounded-tr-[56px] rounded-bl-[56px]",
};

export const IdentityCard = forwardRef<HTMLDivElement, { k: Key }>(function IdentityCard({ k }, ref) {
  const id = profile.identities.find((i) => i.key === k);
  if (!id) return null;
  const t = tone[k];
  const Visual = k === "developer" ? StackVisual : k === "security" ? RadarVisual : OrbitVisual;
  return (
    <div ref={ref} className="group h-full">
      <TiltCard max={5} className={cn("glass sheen glass-hover relative h-full p-6 sm:p-7", shape[k])}>
        {k === "developer" && <NotchEdges />}
        <div aria-hidden className={cn("pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br to-transparent blur-2xl", t.glow)} />
        <p className={cn("mono-label mb-4", t.text)}>{String(["developer", "security", "explorer"].indexOf(k) + 1).padStart(2, "0")} / identity</p>
        <Visual />
        <h3 className="mt-3 font-display text-xl font-semibold">{id.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mute">{id.text}</p>
        <Tags tags={id.tags} cls={t.chip} />
      </TiltCard>
    </div>
  );
});
