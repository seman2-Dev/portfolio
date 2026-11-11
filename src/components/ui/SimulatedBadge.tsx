export function SimulatedBadge({ children = "SIMULATED DATA — NOT REAL TELEMETRY" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-violet/50 bg-violet/10 px-3 py-1 font-mono text-[10px] tracking-wider text-violet">
      <span className="h-1.5 w-1.5 rounded-full bg-violet" aria-hidden />
      {children}
    </span>
  );
}
