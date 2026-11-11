"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { projects, projectCategories } from "@/data/projects";
import type { Project } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HudCorners, SectionBackdrop } from "@/components/ui/Hud";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProjectPreview } from "./ProjectPreview";
import { cn } from "@/lib/utils";

const accent = { Frontend: "text-cyan", "Full-Stack": "text-violet", Cybersecurity: "text-neon", Experimental: "text-cyan" } as const;

/** Asymmetric bento: one hero tile, a stacked pair beside it, then alternating halves. */
function span(i: number, n: number) {
  if (n === 1) return "md:col-span-6";
  if (n === 2) return "md:col-span-3";
  if (i === 0) return "md:col-span-4 md:row-span-2";
  if (i <= 2) return "md:col-span-2";
  const rest = n - 3;
  return rest % 2 === 1 && i === n - 1 ? "md:col-span-6" : "md:col-span-3";
}

function Art({ p, className }: { p: Project; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-bg2", className)}>
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <ProjectPreview kind={p.preview} title={p.title} />
      )}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = dialog.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-bg/85 backdrop-blur-md sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={onClose}>
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="glass hud holo max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-b-none sm:rounded-b-[18px]"
      >
        <HudCorners />
        <Art p={project} className="aspect-[16/7] w-full" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={cn("mono-label", accent[project.category])}>{project.category}</p>
              <h3 id="modal-title" className="mt-2 font-display text-3xl font-bold tracking-tight">{project.title}</h3>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close project details" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line transition hover:border-neon/60 hover:text-neon">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="mt-5 leading-relaxed text-mute">{project.description}</p>
          <div className="mt-7 grid gap-7 sm:grid-cols-2">
            <div>
              <h4 className="mono-label mb-3">Main features</h4>
              <ul className="space-y-2 text-sm text-ink/90">
                {project.features.map((f) => <li key={f} className="flex gap-2.5"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-neon" />{f}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="mono-label mb-3">Stack</h4>
              <ul className="flex flex-wrap gap-2">{project.stack.map((t) => <li key={t} className="rounded-md border border-line bg-bg/60 px-2.5 py-1 font-mono text-xs text-cyan">{t}</li>)}</ul>
            </div>
          </div>
          {(project.liveUrl || project.repoUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-5 text-sm font-semibold text-bg"><ExternalLink className="h-4 w-4" aria-hidden /> Live demo<span className="sr-only"> (opens in a new tab)</span></a>}
              {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold transition hover:border-ink/50"><GithubIcon className="h-4 w-4" /> Repository<span className="sr-only"> (opens in a new tab)</span></a>}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [cat, setCat] = useState<(typeof projectCategories)[number]>("All Projects");
  const [open, setOpen] = useState<Project | null>(null);
  const shown = cat === "All Projects" ? projects : projects.filter((p) => p.category === cat);
  const count = (c: string) => (c === "All Projects" ? projects.length : projects.filter((p) => p.category === c).length);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad relative">
      <SectionBackdrop tone="violet" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="projects-title" index="03" eyebrow="Digital creations" title="Projects" intro="Things I've built while learning. Open any tile for the stack, features and links." />
          <div role="group" aria-label="Filter projects" className="mb-14 flex min-w-0 max-w-full gap-1 overflow-x-auto rounded-xl border border-line/70 bg-bg/60 p-1 backdrop-blur lg:mb-14">
            {projectCategories.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("relative min-h-10 shrink-0 whitespace-nowrap rounded-lg px-4 text-sm transition", cat === c ? "text-bg" : "text-mute hover:text-ink")}>
                {cat === c && <motion.span layoutId="proj-tab" className="absolute inset-0 -z-0 rounded-lg bg-neon" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative z-10">{c} <span className={cn("font-mono text-[10px]", cat === c ? "text-bg/70" : "text-line")}>{count(c)}</span></span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="grid auto-rows-[minmax(220px,auto)] grid-flow-dense gap-4 md:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => {
              const big = i === 0 && shown.length >= 3;
              return (
                <motion.li key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }} className={cn(span(i, shown.length))}>
                  <TiltCard max={2.5} className="sheen glass glass-hover group hud relative h-full">
                    <HudCorners />
                    <button type="button" onClick={() => setOpen(p)} className="flex h-full w-full flex-col overflow-hidden rounded-[inherit] text-left">
                      <Art p={p} className={cn("w-full shrink-0 transition duration-500 group-hover:scale-[1.02]", big ? "aspect-[16/9]" : "aspect-[16/8]")} />
                      <span className="flex flex-1 flex-col p-5 sm:p-6">
                        <span className="flex items-center justify-between">
                          <span className={cn("mono-label", accent[p.category])}>{p.category}</span>
                          <span className="font-mono text-[10px] text-line">P-{String(projects.indexOf(p) + 1).padStart(2, "0")}</span>
                        </span>
                        <span className={cn("mt-3 font-display font-semibold leading-tight", big ? "text-2xl sm:text-3xl" : "text-lg")}>{p.title}</span>
                        <span className={cn("mt-2 text-sm leading-relaxed text-mute", !big && "line-clamp-2")}>{p.summary}</span>
                        {big && (
                          <span className="mt-5 grid gap-x-6 gap-y-2 border-t border-line/50 pt-5 text-sm text-ink/85 sm:grid-cols-2">
                            {p.features.map((f) => <span key={f} className="flex gap-2.5"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-neon" />{f}</span>)}
                          </span>
                        )}
                        <span className="mt-auto flex items-end justify-between gap-3 pt-5">
                          <span className="flex flex-wrap gap-1.5">
                            {p.stack.slice(0, big ? 5 : 3).map((t) => <span key={t} className="rounded border border-line/70 px-1.5 py-0.5 font-mono text-[10px] text-mute">{t}</span>)}
                          </span>
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-mute transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon" aria-hidden />
                        </span>
                      </span>
                      <span className="sr-only">Open details for {p.title}</span>
                    </button>
                  </TiltCard>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
