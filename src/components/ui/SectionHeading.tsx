import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow, title, intro, id, index, align = "left",
}: { eyebrow: string; title: string; intro?: string; id: string; index?: string; align?: "left" | "center" }) {
  return (
    <Reveal className={`mb-14 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow mb-4 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        {index && <span className="text-mute">{index}</span>}
        <span aria-hidden className="h-px w-10 bg-gradient-to-r from-neon to-transparent" />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
