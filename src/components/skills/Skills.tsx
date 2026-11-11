"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, Layout, Server, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { skills, skillCategories } from "@/data/skills";
import type { LearningStatus, Skill, SkillCategory } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { HudCorners, SectionBackdrop } from "@/components/ui/Hud";
import { cn } from "@/lib/utils";

type Key = (typeof skillCategories)[number];

const meta: Record<Key, { icon: LucideIcon; text: string; bar: string; led: string; label: string }> = {
  All: { icon: Layers, text: "text-ink", bar: "bg-ink", led: "bg-ink", label: "All modules" },
  Frontend: { icon: Layout, text: "text-cyan", bar: "bg-cyan", led: "bg-cyan", label: "Interface" },
  Backend: { icon: Server, text: "text-violet", bar: "bg-violet", led: "bg-violet", label: "Services" },
  Tools: { icon: Wrench, text: "text-mute", bar: "bg-mute", led: "bg-mute", label: "Toolchain" },
  Cybersecurity: { icon: ShieldCheck, text: "text-neon", bar: "bg-neon", led: "bg-neon", label: "Defense" },
};

const status: Record<LearningStatus, { label: string; cls: string }> = {
  learning: { label: "Learning", cls: "text-cyan" },
  practicing: { label: "Practicing", cls: "text-neon" },
  planned: { label: "Planned", cls: "text-mute" },
};

const mono = (n: string) => n.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Row({ s }: { s: Skill }) {
  const m = meta[s.category];
  const st = s.status ? status[s.status] : null;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 14 }}
      transition={{ duration: 0.25 }}
      className="group relative flex items-center gap-4 border-b border-line/50 py-3.5 pr-2 transition-colors hover:bg-white/[0.025]"
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-px origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100", m.bar)} />
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center border border-line/80 bg-bg/60 font-mono text-xs font-semibold transition group-hover:border-current", m.text)} style={{ clipPath: "polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)" }}>
        {mono(s.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] font-semibold">{s.name}</span>
        <span className="mono-label !text-[9px]">{s.category}</span>
      </span>
      {st ? (
        <span className={cn("flex items-center gap-2 font-mono text-[11px]", st.cls)}>
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", s.status === "learning" && "pulse-dot")} aria-hidden />
          {st.label}
        </span>
      ) : (
        <span className="font-mono text-[11px] text-line" aria-label="No status set">——</span>
      )}
    </motion.li>
  );
}

export function Skills() {
  const [key, setKey] = useState<Key>("All");
  const shown = key === "All" ? skills : skills.filter((s) => s.category === key);
  const M = meta[key];

  return (
    <section id="skills" aria-labelledby="skills-title" className="section-pad relative">
      <SectionBackdrop tone="cyan" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="skills-title" index="02" eyebrow="Technical arsenal" title="Skills & Technologies" intro="What I work with and what I'm still learning. Status labels are deliberately honest — there are no inflated percentages here." />

        <div className="grid gap-8 lg:grid-cols-12">
          {/* module rack */}
          <Reveal className="min-w-0 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
            <div role="group" aria-label="Filter skills by module" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-line/60 lg:pb-0">
              {skillCategories.map((c, i) => {
                const mm = meta[c];
                const list = c === "All" ? skills : skills.filter((s) => s.category === (c as SkillCategory));
                const on = key === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setKey(c)}
                    className={cn("group relative flex min-h-14 shrink-0 items-center gap-4 border border-line/60 px-4 py-3 text-left transition lg:border-0 lg:border-b lg:px-6", on ? "bg-white/[0.04]" : "hover:bg-white/[0.02]")}
                  >
                    {on && <motion.span layoutId="rack-bar" className={cn("absolute inset-y-0 -left-px w-[3px]", mm.bar)} style={{ boxShadow: "0 0 18px 1px currentColor" }} />}
                    <span className="font-mono text-[10px] text-mute">{String(i).padStart(2, "0")}</span>
                    <mm.icon className={cn("h-5 w-5 shrink-0", on ? mm.text : "text-mute group-hover:text-ink")} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block font-display text-base font-semibold", on ? "text-ink" : "text-ink/80")}>{c}</span>
                      <span className="mono-label hidden !text-[9px] lg:block">{mm.label}</span>
                    </span>
                    <span className="flex items-center gap-2 font-mono text-xs text-mute">
                      <span className="hidden gap-0.5 sm:flex" aria-hidden>
                        {list.slice(0, 8).map((s) => (
                          <span key={s.name} className={cn("h-3 w-0.5", s.status === "planned" ? "bg-line" : mm.bar, s.status ? "opacity-90" : "opacity-40")} />
                        ))}
                      </span>
                      {list.length}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-mute">
              <span className="text-cyan">● learning</span><span className="text-neon">● practicing</span><span>● planned</span><span className="text-line">—— no status set</span>
            </p>
          </Reveal>

          {/* spec panel */}
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="hud glass relative min-h-[28rem] p-5 sm:p-8">
              <HudCorners />
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-line/60 pb-4">
                <div>
                  <p className="mono-label">Module</p>
                  <h3 className={cn("font-display text-2xl font-bold", M.text)}>{key === "All" ? "Full arsenal" : key}</h3>
                </div>
                <p className="font-mono text-xs text-mute" aria-live="polite"><span className="text-ink">{shown.length}</span> technologies loaded</p>
              </div>
              <ul className="grid gap-x-10 md:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {shown.map((s) => <Row key={s.name} s={s} />)}
                </AnimatePresence>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
