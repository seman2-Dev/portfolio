"use client";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Desktop-only (fine pointer + hover) custom cursor. Never hides the native cursor on touch. */
export function CustomCursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest("a,button,[role=button],input,textarea,select");
      ring.current?.classList.toggle("scale-150", !!t);
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [fine]);

  if (!fine) return null;
  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-neon/60 transition-[scale] duration-200" />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-neon" />
    </>
  );
}
