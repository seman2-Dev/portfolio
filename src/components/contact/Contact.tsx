"use client";
import { useState } from "react";
import { Check, Loader2, Mail, Send, X } from "lucide-react";
import { profile } from "@/data/profile";
import { validateContact, type ContactErrors, type ContactInput } from "@/lib/validation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Reveal } from "@/components/ui/Reveal";
import { HudCorners, SectionBackdrop } from "@/components/ui/Hud";
import { cn } from "@/lib/utils";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; msg: string };

const STAGES = ["Compose", "Validate", "Deliver"] as const;
type St = "todo" | "active" | "done" | "fail";

/** Maps the real form state onto three pipeline stages. */
function stages(state: State, hasErrors: boolean): St[] {
  if (state.kind === "ok") return ["done", "done", "done"];
  if (state.kind === "sending") return ["done", "done", "active"];
  if (state.kind === "error") return ["done", "done", "fail"];
  if (hasErrors) return ["done", "fail", "todo"];
  return ["active", "todo", "todo"];
}

const dot: Record<St, string> = {
  todo: "border-line text-line",
  active: "border-cyan text-cyan shadow-[0_0_16px_-2px_rgb(0_217_255/0.7)]",
  done: "border-neon text-neon bg-neon/10",
  fail: "border-red-400 text-red-400 bg-red-400/10",
};

function Tracker({ s }: { s: St[] }) {
  return (
    <ol aria-label="Message pipeline" className="mb-8 flex items-center">
      {STAGES.map((name, i) => (
        <li key={name} className="flex flex-1 items-center last:flex-none">
          <span className="flex items-center gap-2.5">
            <span className={cn("relative grid h-8 w-8 place-items-center rounded-full border-2 font-mono text-xs transition-all duration-300", dot[s[i]])}>
              {s[i] === "done" ? <Check className="h-4 w-4" aria-hidden /> : s[i] === "fail" ? <X className="h-4 w-4" aria-hidden /> : i + 1}
              {s[i] === "active" && <span aria-hidden className="absolute inset-0 rounded-full border border-cyan" style={{ animation: "ping-ring 1.8s ease-out infinite" }} />}
            </span>
            <span className={cn("font-mono text-[11px] uppercase tracking-widest", s[i] === "todo" ? "text-mute" : "text-ink")}>{name}</span>
          </span>
          {i < STAGES.length - 1 && <span aria-hidden className={cn("mx-3 h-px flex-1 transition-colors duration-500", s[i] === "done" ? "bg-neon/70" : "bg-line")} />}
        </li>
      ))}
    </ol>
  );
}

function NetworkArt() {
  const sat: [number, number, string][] = [[30, 34, "#39ff88"], [172, 28, "#00d9ff"], [186, 104, "#9b5cff"], [36, 110, "#00d9ff"], [108, 142, "#39ff88"]];
  return (
    <svg aria-hidden viewBox="0 0 216 160" className="h-auto w-full max-w-sm">
      <defs><radialGradient id="ct-glow"><stop offset="0" stopColor="#00d9ff" stopOpacity=".5" /><stop offset="1" stopColor="#00d9ff" stopOpacity="0" /></radialGradient></defs>
      <circle cx="108" cy="80" r="56" fill="url(#ct-glow)" />
      {sat.map(([x, y, c], i) => <line key={i} x1="108" y1="80" x2={x} y2={y} stroke={c} strokeOpacity=".55" className="flow" style={{ animationDelay: `${i * 0.3}s` }} />)}
      <circle cx="108" cy="80" r="22" fill="none" stroke="#00d9ff" strokeOpacity=".35" style={{ animation: "ping-ring 3s ease-out infinite", transformOrigin: "108px 80px" }} />
      <circle cx="108" cy="80" r="9" fill="#05070d" stroke="#39ff88" strokeWidth="2" />
      <circle cx="108" cy="80" r="3.5" fill="#39ff88" className="pulse-dot" />
      {sat.map(([x, y, c], i) => <circle key={i} cx={x} cy={y} r="5" fill="#0a1020" stroke={c} strokeWidth="1.5" />)}
    </svg>
  );
}

const inputCls = (bad: boolean) =>
  cn("w-full rounded-lg border bg-bg/70 px-4 py-3 text-sm text-ink transition placeholder:text-mute/50 focus:border-cyan focus:bg-bg focus:shadow-[0_0_0_3px_rgb(0_217_255/0.12)] focus:outline-none", bad ? "border-red-400/70" : "border-line");

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="mono-label">{label}</label>
        {hint && <span className="font-mono text-[10px] text-line">{hint}</span>}
      </div>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Contact() {
  const [v, setV] = useState<ContactInput>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const channels = profile.socials.filter((s) => s.href);
  const hasChannels = !!profile.email || channels.length > 0;

  const set = (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
    if (state.kind !== "sending") setState({ kind: "idle" });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validateContact(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      (document.getElementById(Object.keys(errs)[0]) as HTMLElement | null)?.focus();
      return;
    }
    setState({ kind: "sending" });
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, website: fd.get("website") ?? "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setState({ kind: "ok" }); setV({ name: "", email: "", message: "" }); }
      else setState({ kind: "error", msg: data.error ?? "Something went wrong." });
    } catch {
      setState({ kind: "error", msg: "Network error. Please try again." });
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad relative overflow-hidden">
      <SectionBackdrop tone="cyan" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="contact-title" index="07" eyebrow="Establish connection" title="Let's Connect" intro={profile.secondaryTagline} />
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="flex justify-center lg:justify-start"><NetworkArt /></div>
            <h3 className="mono-label mt-6 !text-cyan">{"// Channels"}</h3>
            {hasChannels ? (
              <ul className="mt-4 border-t border-line/60">
                {profile.email && (
                  <li><a href={`mailto:${profile.email}`} className="group flex min-h-12 items-center gap-3 border-b border-line/60 px-1 py-3 text-sm transition hover:bg-white/[0.025] hover:text-neon"><Mail className="h-4 w-4 text-mute transition group-hover:text-neon" aria-hidden />{profile.email}</a></li>
                )}
                {channels.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-12 items-center gap-3 border-b border-line/60 px-1 py-3 text-sm transition hover:bg-white/[0.025] hover:text-cyan">
                      <SocialIcon name={s.icon} className="h-4 w-4 text-mute transition group-hover:text-cyan" />{s.label}<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">The form is the best way to reach me. Send a message and it goes straight to my inbox.</p>
            )}
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="hud relative">
              <HudCorners />
              <div className="glass holo p-6 sm:p-8">
                <p className="mono-label mb-6 flex items-center justify-between"><span>Transmission // new message</span><span className="hidden sm:inline">encrypted in transit (HTTPS)</span></p>
                <Tracker s={stages(state, Object.keys(errors).length > 0)} />
                <form onSubmit={submit} noValidate className="space-y-5" aria-label="Contact form">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Name" error={errors.name}>
                      <input id="name" name="name" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} className={inputCls(!!errors.name)} />
                    </Field>
                    <Field id="email" label="Email" error={errors.email}>
                      <input id="email" name="email" type="email" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} className={inputCls(!!errors.email)} />
                    </Field>
                  </div>
                  <Field id="message" label="Message" error={errors.message} hint={`${v.message.length}/5000`}>
                    <textarea id="message" name="message" rows={6} value={v.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} className={inputCls(!!errors.message)} />
                  </Field>
                  {/* honeypot */}
                  <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button type="submit" disabled={state.kind === "sending"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-6 text-sm font-semibold text-bg transition hover:shadow-[0_0_30px_-4px_rgb(57_255_136/0.6)] disabled:opacity-60">
                      {state.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                      {state.kind === "sending" ? "Sending…" : "Send message"}
                    </button>
                    <div aria-live="polite" className="text-sm">
                      {state.kind === "ok" && <p className="text-neon">Message sent. Thank you!</p>}
                      {state.kind === "error" && <p className="text-red-400">{state.msg}</p>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
