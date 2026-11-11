/** Four HUD corner brackets. Place inside an element with the `hud` class. */
export function HudCorners() {
  return (
    <>
      <span aria-hidden className="hud-c tl" /><span aria-hidden className="hud-c tr" />
      <span aria-hidden className="hud-c bl" /><span aria-hidden className="hud-c br" />
    </>
  );
}

/** Layered section backdrop: aurora glows, grid/dots and noise. */
export function SectionBackdrop({ tone = "green", grid = true }: { tone?: "green" | "cyan" | "violet"; grid?: boolean }) {
  return (
    <div aria-hidden className="noise pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`aurora ${tone}`} />
      {grid && <div className="bg-dots absolute inset-0 opacity-70" />}
    </div>
  );
}

/** Transition between sections: gradient hairline with a glowing node and tick marks. */
export function SectionDivider() {
  return (
    <div aria-hidden className="relative mx-auto h-px w-full max-w-7xl px-5 sm:px-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-neon shadow-[0_0_14px_3px_rgb(57_255_136/0.55)]" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-24">
        <span className="h-3 w-px bg-line" /><span className="h-3 w-px bg-line" />
      </div>
    </div>
  );
}
