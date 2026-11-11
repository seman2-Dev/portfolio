"use client";
import { useScramble } from "@/hooks/useScramble";

export function HeroTagline({ text }: { text: string }) {
  const shown = useScramble(text, 900);
  return (
    <p className="mt-6 max-w-xl font-mono text-xs text-cyan sm:text-sm" aria-label={text}>
      <span aria-hidden className="mr-2 text-neon">&gt;</span>
      <span aria-hidden>{shown}</span>
      <span aria-hidden className="caret ml-0.5 text-neon">▍</span>
    </p>
  );
}
