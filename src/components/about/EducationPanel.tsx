import { GraduationCap } from "lucide-react";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { journey } from "@/data/journey";
import { HudCorners } from "@/components/ui/Hud";

/** Education + readout. All figures are derived from the config files — nothing is invented. */
export function EducationPanel() {
  const done = journey.filter((j) => j.status === "completed").length;
  const learning = journey.filter((j) => j.status === "learning").length;
  const planned = journey.length - done - learning;
  const stats: [string, number][] = [
    ["Technologies tracked", skills.length],
    ["Roadmap steps", journey.length],
    ["Completed", done],
    ["In progress", learning],
  ];
  const seg = (n: number) => `${(n / journey.length) * 100}%`;

  return (
    <div className="hud glass relative grid gap-8 p-6 sm:p-8 lg:grid-cols-5">
      <HudCorners />
      <div className="lg:col-span-2">
        <p className="mono-label mb-4 flex items-center gap-2 text-cyan"><GraduationCap className="h-4 w-4" aria-hidden /> Technical education</p>
        <ul className="space-y-4">
          {profile.education.map((e, i) => (
            <li key={i} className="border-l-2 border-cyan/50 pl-4">
              <p className="font-display text-lg font-semibold">{e.program}</p>
              {(e.institution || e.period) && <p className="mt-1 text-sm text-mute">{[e.institution, e.period].filter(Boolean).join(" · ")}</p>}
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-2.5 py-0.5 font-mono text-[10px] text-neon">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-neon" aria-hidden /> In progress
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-3">
        <p className="mono-label mb-4">Learning readout</p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {stats.map(([k, v]) => (
            <div key={k}>
              <dd className="font-display text-4xl font-bold text-gradient">{v}</dd>
              <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{k}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-6" role="img" aria-label={`Roadmap: ${done} completed, ${learning} in progress, ${planned} planned`}>
          <div className="flex h-2 overflow-hidden rounded-full bg-surface">
            <span className="bg-neon" style={{ width: seg(done) }} />
            <span className="bg-cyan" style={{ width: seg(learning) }} />
            <span className="bg-line" style={{ width: seg(planned) }} />
          </div>
          <p className="mt-2 flex gap-4 font-mono text-[10px] text-mute">
            <span><span className="text-neon">■</span> completed</span><span><span className="text-cyan">■</span> in progress</span><span><span className="text-mute">■</span> planned</span>
          </p>
        </div>
      </div>
    </div>
  );
}
