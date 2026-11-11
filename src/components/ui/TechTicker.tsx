import { skills } from "@/data/skills";

/** Infinite technology ticker — a transition strip between hero and About. */
export function TechTicker() {
  const names = skills.map((s) => s.name);
  return (
    <div className="relative overflow-hidden border-y border-line/60 bg-bg2/60 py-4 backdrop-blur" role="region" aria-label="Technologies">
      <p className="sr-only">Technologies: {names.join(", ")}.</p>
      <div aria-hidden className="flex w-max animate-marquee gap-10 font-mono text-xs uppercase tracking-[0.2em] text-mute motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 gap-10">
            {names.map((n, i) => (
              <li key={n + i} className="flex items-center gap-10">
                <span>{n}</span>
                <span className={i % 3 === 0 ? "text-neon" : i % 3 === 1 ? "text-cyan" : "text-violet"}>◆</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
