"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

/** Lenis smooth scroll wired into GSAP ScrollTrigger. Disabled with reduced motion. */
export function SmoothScroll() {
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduce]);
  return null;
}
