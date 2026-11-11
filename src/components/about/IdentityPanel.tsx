"use client";
import { MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { TiltCard } from "@/components/ui/TiltCard";
import { HudCorners } from "@/components/ui/Hud";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "N";
}

const HEX = "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)";

/** Holographic "digital identity" card. Every field is config-driven; empty fields are omitted. */
export function IdentityPanel() {
  const rows: [string, string][] = [
    ["Name", profile.name],
    ["Role", profile.roleLine],
    ["Focus", profile.focus],
    ["Studying", profile.education[0]?.program ?? ""],
    ["Status", profile.status],
    ["Base", profile.location ?? ""],
    ["Contact", profile.email],
  ];
  const shown = rows.filter(([, v]) => v);

  return (
    <TiltCard max={4} className="holo sheen hud glass relative p-6 sm:p-7">
      <HudCorners />
      <div className="mb-6 flex items-center justify-between">
        <p className="mono-label text-cyan">Digital identity</p>
        <p className="flex items-center gap-2 font-mono text-[10px] text-neon">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-neon" aria-hidden /> ACTIVE
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <div aria-hidden className="absolute -inset-2 animate-[spin-slow_14s_linear_infinite] rounded-full border border-dashed border-cyan/30" />
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-neon/25 via-cyan/20 to-violet/30 p-px" style={{ clipPath: HEX }}>
            <div className="relative grid h-full w-full place-items-center overflow-hidden bg-bg2" style={{ clipPath: HEX }}>
              {profile.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-gradient font-display text-3xl font-bold">{initials(profile.name)}</span>
              )}
              <span aria-hidden className="absolute inset-x-0 h-8 animate-[scan_3.6s_linear_infinite] bg-gradient-to-b from-transparent via-cyan/25 to-transparent" />
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-semibold">{profile.name}</p>
          <p className="mt-1 text-sm text-mute">{profile.roleLine}</p>
          {profile.location && (
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-mute"><MapPin className="h-3 w-3 text-cyan" aria-hidden />{profile.location}</p>
          )}
        </div>
      </div>

      <dl className="mt-6 divide-y divide-line/60 border-t border-line/60 font-mono text-xs">
        {shown.slice(2).map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="uppercase tracking-[0.14em] text-mute">{k}</dt>
            <dd className="truncate text-right text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div aria-hidden className="mt-5 flex items-end justify-between gap-px opacity-60">
        {Array.from({ length: 46 }, (_, i) => (
          <span key={i} className="w-px bg-ink/70" style={{ height: `${8 + ((i * 53) % 17)}px` }} />
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-mute">{`${profile.siteName} // PROFILE`}</p>
    </TiltCard>
  );
}
