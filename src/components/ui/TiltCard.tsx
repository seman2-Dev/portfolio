"use client";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

/** Subtle 3D hover tilt + mouse-follow sheen. No-op on touch and with reduced motion. */
export function TiltCard({ children, className, max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (!reduce) el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * max * 2}deg) rotateX(${-(y - 0.5) * max * 2}deg) translateY(-3px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={className} style={{ transition: "transform .25s ease-out" }}>
      {children}
    </div>
  );
}
