import { ChevronDown } from "lucide-react";
import { profile } from "@/data/profile";
import { HeroBackground } from "@/components/3d/HeroBackground";
import { HeroCtas } from "./HeroCtas";
import { HeroTagline } from "./HeroTagline";

const hud = [
  ["CORE", "ONLINE", "text-neon"],
  ["SHIELD", "ACTIVE", "text-neon"],
  ["NODES", "LINKED", "text-cyan"],
  ["SCAN", "360°", "text-violet"],
] as const;

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate flex min-h-svh items-center overflow-hidden">
      <HeroBackground />

      {/* HUD overlay (decorative, desktop) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden md:block">
        <div className="absolute bottom-16 right-8 w-52 rounded-xl border border-line/60 bg-bg/50 p-4 backdrop-blur-md lg:right-12">
          <p className="mono-label mb-3 flex items-center justify-between">
            <span>System</span><span className="text-[9px]">visual only</span>
          </p>
          <ul className="space-y-2 font-mono text-[11px]">
            {hud.map(([k, v, c]) => (
              <li key={k} className="flex items-center justify-between text-mute">
                <span>{k}</span>
                <span className={`flex items-center gap-1.5 ${c}`}><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute right-8 top-24 flex flex-col items-end gap-1 font-mono text-[10px] text-mute/70 lg:right-12">
          <span>{"// decorative 3D scene"}</span>
          <span>move your cursor →</span>
        </div>
        <div className="absolute inset-y-0 right-6 hidden w-px bg-gradient-to-b from-transparent via-line/60 to-transparent xl:block" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-[46svh] sm:px-8 md:pt-32">
        <div className="max-w-2xl">
          <p className="rise mb-7 inline-flex items-center gap-2.5 rounded-full border border-neon/30 bg-neon/5 px-4 py-1.5 font-mono text-xs text-neon backdrop-blur" style={{ "--d": "0.1s" } as React.CSSProperties}>
            <span className="pulse-dot h-2 w-2 rounded-full bg-neon shadow-[0_0_10px_2px_rgb(57_255_136/0.7)]" aria-hidden />
            {profile.status}
          </p>

          <h1 id="hero-title" className="font-display font-bold leading-[0.98] tracking-tight">
            <span className="rise block font-mono text-sm font-medium uppercase tracking-[0.3em] text-mute sm:text-base" style={{ "--d": "0.2s" } as React.CSSProperties}>Hello, I&apos;m</span>
            <span className="rise text-gradient-anim mt-3 block text-[clamp(2.7rem,7.4vw,6.2rem)]" style={{ "--d": "0.3s" } as React.CSSProperties}>{profile.name}</span>
          </h1>

          <p className="rise mt-6 font-display text-xl font-medium text-ink sm:text-2xl" style={{ "--d": "0.45s" } as React.CSSProperties}>{profile.roleLine}</p>
          <p className="rise mt-4 max-w-xl text-base leading-relaxed text-mute sm:text-lg" style={{ "--d": "0.55s" } as React.CSSProperties}>{profile.heroDescription}</p>

          <div className="rise" style={{ "--d": "0.7s" } as React.CSSProperties}>
            <HeroTagline text={profile.heroTagline} />
            <HeroCtas cvUrl={profile.cvUrl} />
          </div>
        </div>
      </div>

      <a href="#about" aria-label="Scroll to About section" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-mute transition hover:text-neon">
        <span className="flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest">
          SCROLL <ChevronDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" aria-hidden />
        </span>
      </a>
    </section>
  );
}
