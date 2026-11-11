"use client";
import { ArrowRight, Compass, Download } from "lucide-react";
import { sceneBus } from "@/components/3d/sceneBus";

const hot = () => { sceneBus.boost = 1; sceneBus.ping(); };
const cool = () => { sceneBus.boost = 0; };

/** CTAs that talk to the 3D scene: hover/focus raises its energy and fires a scan pulse. */
export function HeroCtas({ cvUrl }: { cvUrl?: string }) {
  const bind = { onMouseEnter: hot, onMouseLeave: cool, onFocus: hot, onBlur: cool };
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <a href="#projects" {...bind} className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-neon px-7 py-3 text-sm font-semibold text-bg transition hover:shadow-[0_0_44px_-6px_rgb(57_255_136/0.75)]">
        <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative">Explore My Projects</span>
        <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
      </a>
      <a href="#journey" {...bind} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cyan/50 bg-cyan/5 px-7 py-3 text-sm font-semibold text-cyan backdrop-blur transition hover:bg-cyan/15 hover:shadow-[0_0_34px_-8px_rgb(0_217_255/0.7)]">
        <Compass className="h-4 w-4" aria-hidden /> Explore My Journey
      </a>
      {cvUrl ? (
        <a href={cvUrl} download {...bind} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-bg/40 px-7 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:border-ink/50">
          <Download className="h-4 w-4" aria-hidden /> Download CV
        </a>
      ) : (
        <button type="button" {...bind} title="CV not uploaded yet" className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-line bg-bg/40 px-7 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:border-ink/50 hover:text-mute">
          <Download className="h-4 w-4" aria-hidden /> Download CV
        </button>
      )}
    </div>
  );
}
