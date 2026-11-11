"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ChevronDown, CircleDot, Circle } from "lucide-react";
import { journey } from "@/data/journey";
import type { JourneyStatus } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HudCorners, SectionBackdrop } from "@/components/ui/Hud";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const meta: Record<JourneyStatus, { label: string; chip: string; node: string; seg: string; Icon: typeof Check }> = {
  completed: { label: "Completed", chip: "border-neon/50 text-neon bg-neon/10", node: "border-neon text-neon shadow-[0_0_18px_-2px_rgb(57_255_136/0.6)]", seg: "bg-neon", Icon: Check },
  learning: { label: "Currently learning", chip: "border-cyan/50 text-cyan bg-cyan/10", node: "border-cyan text-cyan shadow-[0_0_18px_-2px_rgb(0_217_255/0.6)]", seg: "bg-cyan", Icon: CircleDot },
  planned: { label: "Planned", chip: "border-line text-mute bg-surface/60", node: "border-line text-mute", seg: "bg-line", Icon: Circle },
};
const order: JourneyStatus[] = ["completed", "learning", "planned"];
const firstLearning = journey.findIndex((j) => j.status === "learning");

export function Journey() {
  const root = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(firstLearning >= 0 ? firstLearning : null);
  const counts = order.map((s) => journey.filter((j) => j.status === s).length);

  useEffect(() => {
    if (reduce || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 28, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="journey" aria-labelledby="journey-title" className="section-pad relative bg-bg2/50">
      <SectionBackdrop tone="green" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="journey-title" index="06" eyebrow="Digital journey" title="Learning Roadmap" intro="Where I've been, where I am, and where I'm heading. Statuses are honest — open any step to see what it covers." />

        {/* status summary */}
        <div className="mb-16">
          <div role="img" aria-label={`${counts[0]} completed, ${counts[1]} currently learning, ${counts[2]} planned`} className="flex gap-1.5">
            {journey.map((j, i) => <span key={j.title} className={cn("h-1.5 flex-1 rounded-full transition-all", meta[j.status].seg, open === i && "scale-y-[2.2]")} />)}
          </div>
          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
            {order.map((s, i) => (
              <div key={s} className="flex items-baseline gap-3">
                <dd className={cn("font-display text-4xl font-bold", s === "completed" ? "text-neon" : s === "learning" ? "text-cyan" : "text-mute")}>{String(counts[i]).padStart(2, "0")}</dd>
                <dt className="mono-label">{meta[s].label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <ol ref={root} className="relative">
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-line/60 lg:left-1/2" />
          <div ref={line} aria-hidden className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-neon via-cyan to-violet lg:left-1/2" />
          {journey.map((j, i) => {
            const m = meta[j.status];
            const expanded = open === i;
            const right = i % 2 === 1;
            const here = i === firstLearning;
            return (
              <li key={j.title} data-step className={cn("relative mb-6 pl-14 lg:mb-4 lg:w-1/2 lg:pl-0", right ? "lg:-mt-14 lg:ml-auto lg:pl-14" : "lg:pr-14")}>
                <span aria-hidden className={cn("absolute left-0 top-5 grid h-8 w-8 place-items-center rounded-full border-2 bg-bg", m.node, right ? "lg:-left-4" : "lg:left-auto lg:-right-4")}>
                  <m.Icon className="h-4 w-4" />
                  {here && <span className="absolute inset-0 rounded-full border border-cyan" style={{ animation: "ping-ring 2.2s ease-out infinite" }} />}
                </span>
                <div className={cn("glass glass-hover hud relative", expanded && "holo")}>
                  {here && <HudCorners />}
                  <button type="button" aria-expanded={expanded} aria-controls={`step-${i}`} onClick={() => setOpen(expanded ? null : i)} className="flex w-full items-start gap-4 rounded-[inherit] p-5 text-left">
                    <span className="mt-0.5 font-mono text-sm text-line">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold leading-snug">{j.title}</span>
                      <span className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px]", m.chip)}>
                        {here && <span aria-hidden className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />}
                        {here ? "You are here · " : ""}{m.label}
                      </span>
                    </span>
                    <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-mute transition-transform", expanded && "rotate-180 text-neon")} aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div id={`step-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                        <div className="px-5 pb-5 pl-[3.75rem]">
                          <p className="text-sm leading-relaxed text-mute">{j.description}{j.period ? ` · ${j.period}` : ""}</p>
                          {j.topics && <ul className="mt-3 flex flex-wrap gap-1.5">{j.topics.map((t) => <li key={t} className="rounded border border-line/70 bg-bg/60 px-2 py-0.5 font-mono text-[11px] text-cyan">{t}</li>)}</ul>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
