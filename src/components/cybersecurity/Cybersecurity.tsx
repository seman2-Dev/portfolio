import { Bug, FileText, FlaskConical, Globe, KeyRound, Network, ScanLine, Search, SquareTerminal, Webhook, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { HudCorners, SectionBackdrop } from "@/components/ui/Hud";
import { learningTracks, labEntries } from "@/data/lab";
import type { LabEntry } from "@/types";
import { SecurityDashboard } from "./SecurityDashboard";
import { Terminal } from "@/components/terminal/Terminal";
import { cn } from "@/lib/utils";

const trackIcon: Record<string, LucideIcon> = { globe: Globe, bug: Bug, key: KeyRound, webhook: Webhook, terminal: SquareTerminal, network: Network, scan: ScanLine, search: Search };
const kindIcon = { Lab: FlaskConical, Note: FileText, Research: Search, Demo: Bug, Experiment: FlaskConical } as const;
const statusCls: Record<LabEntry["status"], string> = { "in-progress": "border-cyan/50 text-cyan", planned: "border-line text-mute", published: "border-neon/50 text-neon" };
const statusLabel: Record<LabEntry["status"], string> = { "in-progress": "In progress", planned: "Planned", published: "Published" };

const ribbon = [["Mode", "Educational"], ["Data", "Simulated"], ["Targets", "None"], ["Execution", "In-browser only"]] as const;

export function Cybersecurity() {
  return (
    <section id="cybersecurity" aria-labelledby="cyber-title" className="section-pad relative bg-bg2/60">
      <SectionBackdrop tone="green" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="cyber-title" index="04" eyebrow="Digital defense center" title="Cybersecurity Zone" intro="What I'm studying, and a few interactive demos built to explain it. Everything here is mock data running in your browser — nothing touches a real system." />

        {/* ops ribbon: honest framing of every demo below */}
        <Reveal className="mb-10">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line/70 bg-line/50 sm:grid-cols-4">
            {ribbon.map(([k, v]) => (
              <div key={k} className="bg-bg/80 px-4 py-3">
                <dt className="mono-label !text-[9px]">{k}</dt>
                <dd className="mt-1 flex items-center gap-2 font-mono text-xs text-ink"><span aria-hidden className="pulse-dot h-1.5 w-1.5 rounded-full bg-neon" />{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* learning tracks: ruled index, not cards */}
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h3 className="mono-label mb-4 !text-neon">{"// Learning tracks"}</h3>
              <ol className="border-t border-line/60">
                {learningTracks.map((t, i) => {
                  const I = trackIcon[t.icon] ?? Search;
                  return (
                    <li key={t.title} className="group relative flex gap-4 border-b border-line/60 py-4 transition-colors hover:bg-white/[0.025]">
                      <span aria-hidden className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-neon transition-transform duration-300 group-hover:scale-y-100" />
                      <span className="w-6 shrink-0 pl-2 font-mono text-[11px] text-line">{String(i + 1).padStart(2, "0")}</span>
                      <I className="mt-0.5 h-4 w-4 shrink-0 text-mute transition group-hover:text-neon" aria-hidden />
                      <span>
                        <span className="block font-display text-[15px] font-semibold">{t.title}</span>
                        <span className="mt-0.5 block text-sm text-mute">{t.blurb}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          <div className="space-y-8 lg:col-span-8">
            <Reveal><SecurityDashboard /></Reveal>
            <Reveal>
              <div className="hud relative">
                <HudCorners />
                <Terminal />
              </div>
            </Reveal>
          </div>
        </div>

        {/* security learning lab: case-file ledger */}
        <Reveal className="mt-20">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Security learning lab</h3>
            <span className="mono-label hidden sm:block">Notes · labs · research</span>
          </div>
          <ul className="divide-y divide-line/60 border-y border-line/60">
            {labEntries.map((l, i) => {
              const I = kindIcon[l.kind];
              const body = (
                <>
                  <span className="font-mono text-xs text-line">{`CASE-${String(i + 1).padStart(2, "0")}`}</span>
                  <span className="flex items-center gap-2 font-mono text-xs text-violet"><I className="h-3.5 w-3.5" aria-hidden />{l.kind}</span>
                  <span className="min-w-0">
                    <span className="block font-display font-semibold transition group-hover:text-neon">{l.title}</span>
                    <span className="mt-0.5 block text-sm text-mute">{l.summary}</span>
                  </span>
                  <span className={cn("justify-self-start rounded-full border px-3 py-0.5 font-mono text-[11px] sm:justify-self-end", statusCls[l.status])}>{statusLabel[l.status]}</span>
                </>
              );
              const cls = "group grid items-center gap-x-6 gap-y-2 px-1 py-5 sm:grid-cols-[5rem_7rem_1fr_auto] transition-colors hover:bg-white/[0.02]";
              return <li key={l.title}>{l.href ? <a href={l.href} className={cls}>{body}</a> : <div className={cls}>{body}</div>}</li>;
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
