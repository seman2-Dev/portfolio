/**
 * Tiny mutable bus shared between the DOM (hero text, CTAs, scroll, pointer)
 * and the WebGL scene. Mutated outside React so it never causes re-renders.
 */
export const sceneBus = {
  /** pointer position, -1..1 (screen space) */
  px: 0,
  py: 0,
  hasPointer: false,
  /** 0..1 scroll progress through the hero */
  scroll: 0,
  /** 0..1 eased "attention" level, raised while a CTA is hovered/focused */
  boost: 0,
  /** incremented to trigger a scan pulse */
  pulseCount: 0,
  ping() {
    this.pulseCount++;
  },
};
