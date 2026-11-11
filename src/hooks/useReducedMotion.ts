"use client";
import { useSyncExternalStore } from "react";

const Q = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(Q);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(Q).matches, () => false);
}
