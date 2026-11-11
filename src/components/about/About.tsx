"use client";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackdrop } from "@/components/ui/Hud";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { IdentityPanel } from "./IdentityPanel";
import { IdentityCard } from "./IdentityCards";
import { EducationPanel } from "./EducationPanel";

interface Paths { d: string[]; nodes: [number, number][]; w: number; h: number }

/** Measures the real layout and draws animated circuit lines: panel → bus → each identity card. */
function useConnectors(box: React.RefObject<HTMLDivElement | null>, panel: React.RefObject<HTMLDivElement | null>, cards: React.RefObject<(HTMLDivElement | null)[]>) {
  const [paths, setPaths] = useState<Paths | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const compute = () => {
      const p = panel.current, cs = cards.current.filter(Boolean) as HTMLDivElement[];
      if (!p || cs.length < 3 || window.innerWidth < 1024) return setPaths(null);
      const o = el.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      const px = pr.left + pr.width / 2 - o.left, py = pr.bottom - o.top;
      const rects = cs.map((c) => c.getBoundingClientRect());
      const busY = Math.max(py + 24, Math.min(...rects.map((r) => r.top - o.top)) - 22);
      const d: string[] = [];
      const nodes: [number, number][] = [[px, py], [px, busY]];
      rects.forEach((r) => {
        const cx = r.left + r.width / 2 - o.left, top = r.top - o.top;
        d.push(`M${px} ${py} V${busY} H${cx} V${top}`);
        nodes.push([cx, busY], [cx, top]);
      });
      setPaths({ d, nodes, w: o.width, h: o.height });
    };
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    const settle = setTimeout(compute, 1400); // after reveal animations settle
    return () => { clearTimeout(settle); ro.disconnect(); window.removeEventListener("resize", compute); };
  }, [box, panel, cards]);
  return paths;
}

export function About() {
  const reduce = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const paths = useConnectors(box, panel, cards);
  const [lead, accent] = profile.about.headline.split(" — ");

  const facts: [string, string][] = [
    ["Focus", profile.focus],
    ["Studying", profile.education[0]?.program ?? ""],
    ["Status", profile.status],
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="section-pad relative">
      <SectionBackdrop tone="green" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={box} className="relative">
          {paths && (
            <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block" width={paths.w} height={paths.h} viewBox={`0 0 ${paths.w} ${paths.h}`}>
              <defs><filter id="glow-line"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              {paths.d.map((d, i) => <path key={i} d={d} fill="none" stroke="rgb(0 217 255 / .45)" strokeWidth="1.2" className="flow" />)}
              {paths.nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#05070d" stroke="#00d9ff" strokeWidth="1.2" />)}
              {!reduce && paths.d.map((d, i) => (
                <circle key={`p${i}`} r="3.2" fill="#39ff88" filter="url(#glow-line)">
                  <animateMotion dur={`${3.4 + i * 0.5}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" path={d} />
                </circle>
              ))}
            </svg>
          )}

          <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="text-mute">01</span><span aria-hidden className="h-px w-10 bg-gradient-to-r from-neon to-transparent" />{profile.about.eyebrow}
              </p>
              <h2 id="about-title" className="font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-bold leading-[1.04] tracking-tight">
                {lead}
                {accent && <><br /><span className="text-gradient">{accent}</span></>}
              </h2>
              <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink/90">{profile.about.lead}</p>
              <div className="mt-5 max-w-2xl space-y-4 leading-relaxed text-mute">
                {profile.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <dl className="mt-9 grid max-w-2xl grid-cols-1 divide-y divide-line/60 border-y border-line/60 font-mono text-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {facts.filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="px-0 py-4 sm:px-5 sm:first:pl-0">
                    <dt className="uppercase tracking-[0.16em] text-mute">{k}</dt>
                    <dd className="mt-1.5 text-sm text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="lg:col-span-5 lg:mt-20" delay={0.12}>
              <div ref={panel}><IdentityPanel /></div>
            </Reveal>

            <Reveal className="lg:col-span-5 lg:mt-4" delay={0.05}><IdentityCard k="developer" ref={(el) => { cards.current[0] = el; }} /></Reveal>
            <Reveal className="lg:col-span-4 lg:-mt-1" delay={0.15}><IdentityCard k="security" ref={(el) => { cards.current[1] = el; }} /></Reveal>
            <Reveal className="lg:col-span-3 lg:mt-14" delay={0.25}><IdentityCard k="explorer" ref={(el) => { cards.current[2] = el; }} /></Reveal>

            <Reveal className="lg:col-span-12"><EducationPanel /></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
