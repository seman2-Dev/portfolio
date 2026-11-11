"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { profile } from "@/data/profile";
import { sceneBus } from "./sceneBus";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

/** If WebGL throws at runtime the page keeps working with the static backdrop. */
class SceneBoundary extends Component<{ children: ReactNode; onError?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Static CSS backdrop — always rendered underneath; it is the fallback for no-WebGL / reduced-motion. */
function StaticBackdrop({ dimmed }: { dimmed: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgb(0_217_255/0.16),transparent_50%),radial-gradient(ellipse_at_72%_55%,rgb(57_255_136/0.16),transparent_45%),radial-gradient(ellipse_at_50%_105%,rgb(155_92_255/0.18),transparent_60%)]" />
      <div className="bg-grid absolute inset-0" />
      {/* static shield emblem for the fallback state; holds the portrait until the 3D scene takes over */}
      <svg viewBox="0 0 200 240" className={`absolute right-[12%] top-1/2 hidden h-[52%] -translate-y-1/2 transition-opacity duration-500 md:block ${dimmed ? "opacity-0" : "opacity-60"}`} fill="none">
        <path d="M100 8 176 36v62c0 52-32 92-76 114C56 190 24 150 24 98V36z" stroke="#39ff88" strokeWidth="1.5" fill="rgb(57 255 136 / .05)" />
        <path d="M100 30 156 50v46c0 38-24 70-56 86-32-16-56-48-56-86V50z" stroke="#00d9ff" strokeWidth="1" opacity=".6" />
        {profile.photo ? (
          <>
            <defs>
              <clipPath id="hero-portrait-clip"><circle cx="100" cy="100" r="34" /></clipPath>
            </defs>
            <image href={profile.photo} x="66" y="66" width="68" height="68" preserveAspectRatio="xMidYMin slice" clipPath="url(#hero-portrait-clip)" />
            <circle cx="100" cy="100" r="35" stroke="#39ff88" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="41" stroke="#00d9ff" strokeWidth="1" opacity=".6" />
          </>
        ) : (
          <>
            <circle cx="100" cy="100" r="22" stroke="#00d9ff" strokeWidth="1.5" fill="rgb(0 217 255 / .12)" />
            <circle cx="100" cy="100" r="6" fill="#39ff88" />
          </>
        )}
      </svg>
    </div>
  );
}

export function HeroBackground() {
  const reduce = usePrefersReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px)");
  const wrap = useRef<HTMLDivElement>(null);
  const canvasBox = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  // Once the canvas has drawn its first frame, fade the static emblem out (if it carries a portrait).
  const dimmed = enabled && !reduce && ready && !!profile.photo;

  // Defer heavy 3D until the browser is idle; skip if WebGL is unavailable.
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const start = () => { if (!cancelled && webglSupported()) { setReady(false); setEnabled(true); } };
    const hasIdle = "requestIdleCallback" in window;
    const id = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [reduce]);

  // Stop rendering when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer + scroll feed the scene (mutated outside React: no re-renders).
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      sceneBus.hasPointer = true;
      sceneBus.px = (e.clientX / window.innerWidth) * 2 - 1;
      sceneBus.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const h = wrap.current?.offsetHeight || window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      sceneBus.scroll = p;
      if (canvasBox.current) canvasBox.current.style.opacity = String(1 - p * 0.85);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      sceneBus.hasPointer = false;
      sceneBus.scroll = 0;
    };
  }, [enabled]);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden">
      <StaticBackdrop dimmed={dimmed} />
      {enabled && !reduce && (
        <div ref={canvasBox} className="absolute inset-x-0 top-0 h-[58svh] md:inset-0 md:h-auto">
          <SceneBoundary onError={() => { setReady(false); setEnabled(false); }}>
            <HeroScene mobile={mobile} animate={!reduce} active={visible} onReady={() => setReady(true)} />
          </SceneBoundary>
        </div>
      )}
      {/* readability scrims: the 3D never competes with the text */}
      <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgb(5_7_13/0.9),rgb(5_7_13/0.55)_38%,transparent_62%)] md:block" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(5_7_13/0.55),transparent_22%),linear-gradient(to_top,#05070d,transparent_28%)] md:bg-[linear-gradient(to_bottom,rgb(5_7_13/0.5),transparent_20%),linear-gradient(to_top,#05070d,transparent_26%)]" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#05070d_28%,transparent_62%)] md:hidden" />
    </div>
  );
}
