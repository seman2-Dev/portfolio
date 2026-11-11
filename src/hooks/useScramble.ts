"use client";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useReducedMotion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/** "Decrypt" text effect: random glyphs resolving left-to-right. Instant with reduced motion. */
export function useScramble(text: string, delay = 600) {
  const reduce = usePrefersReducedMotion();
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (reduce) return;
    let frame = 0, iv: ReturnType<typeof setInterval> | undefined;
    const total = text.length;
    const to = setTimeout(() => {
      iv = setInterval(() => {
        frame++;
        const done = Math.floor(frame * 1.6);
        setOut(text.split("").map((ch, i) => (ch === " " ? " " : i < done ? ch : GLYPHS[(i * 7 + frame * 3) % GLYPHS.length])).join(""));
        if (done >= total) { clearInterval(iv); setOut(text); }
      }, 28);
    }, delay);
    return () => { clearTimeout(to); if (iv) clearInterval(iv); };
  }, [text, delay, reduce]);
  return reduce ? text : out;
}
