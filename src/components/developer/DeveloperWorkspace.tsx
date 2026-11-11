"use client";
import { useEffect, useRef, useState } from "react";
import { Database, FileCode2, Files, GitBranch, GitCommit, GitPullRequest, Globe, Lock, Rocket, Search, Server, ShieldCheck } from "lucide-react";
import { highlight } from "@/lib/highlight";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { HudCorners, SectionBackdrop } from "@/components/ui/Hud";
import { cn } from "@/lib/utils";

const FILES = [
  {
    path: "app/api/login/route.ts",
    name: "route.ts",
    code: `import { z } from "zod";

// Validate untrusted input at the boundary
const Login = z.object({
  email: z.string().email().max(254),
  password: z.string().min(12).max(128),
});

export async function POST(req: Request) {
  const parsed = Login.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  // Parameterised query + slow password hash (never string-concat SQL)
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user && (await verify(user.hash, parsed.data.password));
  if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401 });
  return Response.json({ ok: true });
}`,
  },
  {
    path: "lib/headers.ts",
    name: "headers.ts",
    code: `// Baseline security headers (illustrative)
export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=()" },
];`,
  },
] as const;

const TERM = [
  ["$ git switch -c feature/auth-hardening", "cmd"],
  ["Switched to a new branch 'feature/auth-hardening'", "out"],
  ["$ npm run typecheck && npm run lint", "cmd"],
  ["✓ type-check and lint pass (illustrative output)", "ok"],
  ["$ git commit -m \"validate login input at the boundary\"", "cmd"],
] as const;
const termText = TERM.map((t) => t[0]).join("\n");

const tone = { kw: "text-violet", str: "text-neon", com: "text-mute italic", num: "text-cyan", fn: "text-cyan", txt: "text-ink/90" } as const;

/** Types `total` characters once `go` is true; instant under reduced motion. */
function useTyping(total: number, go: boolean, reduce: boolean, step: number, ms: number, reset: unknown) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setN(0), 0);
    return () => clearTimeout(t);
  }, [reset]);
  useEffect(() => {
    if (!go) return;
    if (reduce) { const t = setTimeout(() => setN(total), 0); return () => clearTimeout(t); }
    const iv = setInterval(() => setN((v) => (v >= total ? v : v + step)), ms);
    return () => clearInterval(iv);
  }, [go, total, reduce, step, ms, reset]);
  return n;
}

function Ide() {
  const reduce = usePrefersReducedMotion();
  const [file, setFile] = useState(0);
  const [go, setGo] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const code = FILES[file].code;
  const n = useTyping(code.length, go, reduce, 3, 24, file);
  const tn = useTyping(termText.length, go, reduce, 2, 30, "term");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setGo(true), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = highlight(code.slice(0, n));
  const lines = code.split("\n").length;
  const typed = termText.slice(0, tn).split("\n");

  return (
    <div ref={box} className="hud relative">
      <HudCorners />
      <div className="glass holo overflow-hidden">
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-line/80 bg-surface/80 px-4 py-2.5">
          <span aria-hidden className="flex gap-2"><i className="h-3 w-3 rounded-full bg-red-500/70" /><i className="h-3 w-3 rounded-full bg-yellow-500/70" /><i className="h-3 w-3 rounded-full bg-neon/70" /></span>
          <span className="font-mono text-xs text-mute">nexora — workspace</span>
          <span className="hidden font-mono text-[10px] text-violet sm:block">DISPLAY ONLY · DOES NOT EXECUTE</span>
        </div>

        <div className="flex">
          {/* activity bar */}
          <div aria-hidden className="hidden w-12 shrink-0 flex-col items-center gap-5 border-r border-line/60 bg-bg/60 pt-4 text-mute sm:flex">
            <Files className="h-5 w-5 text-ink" /><Search className="h-5 w-5" /><GitBranch className="h-5 w-5" /><ShieldCheck className="h-5 w-5 text-neon" />
          </div>
          {/* explorer */}
          <div className="hidden w-52 shrink-0 border-r border-line/60 bg-bg/40 py-3 lg:block">
            <p className="mono-label px-4 pb-2 !text-[9px]">Explorer</p>
            <p className="px-4 py-1 font-mono text-xs text-mute">▾ src</p>
            {FILES.map((f, i) => (
              <button key={f.path} type="button" onClick={() => setFile(i)} className={cn("flex min-h-9 w-full items-center gap-2 py-1.5 pl-8 pr-3 text-left font-mono text-xs transition", file === i ? "bg-neon/10 text-neon" : "text-mute hover:bg-white/[0.03] hover:text-ink")}>
                <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden /> <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            {/* tabs */}
            <div role="tablist" aria-label="Sample files" className="flex border-b border-line/60 bg-surface/40">
              {FILES.map((f, i) => (
                <button key={f.name} role="tab" aria-selected={file === i} type="button" onClick={() => setFile(i)} className={cn("min-h-11 border-r border-line/60 px-4 font-mono text-xs transition", file === i ? "border-t-2 border-t-neon bg-bg/60 text-ink" : "text-mute hover:text-ink")}>{f.name}</button>
              ))}
            </div>
            <p className="border-b border-line/40 px-4 py-1.5 font-mono text-[11px] text-mute">src / {FILES[file].path.replaceAll("/", " / ")}</p>
            {/* editor */}
            <div role="tabpanel" className="flex min-h-[19rem] overflow-x-auto bg-bg/70 py-4 font-mono text-[12.5px] leading-6">
              <div aria-hidden className="select-none px-4 text-right text-line">{Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}</div>
              <pre aria-hidden className="pr-4"><code>{shown.map((t, i) => <span key={i} className={tone[t.t]}>{t.v}</span>)}<span className="caret text-neon">▍</span></code></pre>
              <pre className="sr-only"><code>{code}</code></pre>
            </div>
            {/* integrated terminal */}
            <div className="border-t border-line/70 bg-bg/90">
              <p className="mono-label flex items-center justify-between border-b border-line/40 px-4 py-1.5 !text-[9px]"><span>Terminal</span><span>illustrative output</span></p>
              <div aria-hidden className="h-36 overflow-hidden p-4 font-mono text-xs leading-5">
                {typed.map((l, i) => (
                  <p key={i} className={TERM[i]?.[1] === "cmd" ? "text-neon" : TERM[i]?.[1] === "ok" ? "text-cyan" : "text-mute"}>{l}{i === typed.length - 1 && <span className="caret">▍</span>}</p>
                ))}
              </div>
              <p className="sr-only">Illustrative terminal session: create a branch, run type-check and lint, commit.</p>
            </div>
          </div>
        </div>

        {/* status bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line/70 bg-neon/[0.07] px-4 py-1.5 font-mono text-[11px] text-mute">
          <span className="flex items-center gap-1.5 text-neon"><GitBranch className="h-3 w-3" aria-hidden /> feature/auth-hardening</span>
          <span className="flex gap-4"><span>TypeScript</span><span className="hidden sm:inline">UTF-8</span><span className="hidden sm:inline">Spaces: 2</span></span>
        </div>
      </div>
    </div>
  );
}

const flow = [
  { icon: GitBranch, t: "Branch", d: "One focused change per branch" },
  { icon: GitCommit, t: "Commit", d: "Small, descriptive commits" },
  { icon: GitPullRequest, t: "Pull request", d: "Review and automated checks" },
  { icon: Rocket, t: "Merge & deploy", d: "Only from a green main" },
];

const arch = [
  { icon: Globe, label: "Browser", sub: "Next.js UI", c: "text-cyan" },
  { icon: Server, label: "API layer", sub: "Route handlers", c: "text-cyan" },
  { icon: Lock, label: "Validation & auth", sub: "Schemas · sessions", c: "text-neon" },
  { icon: Database, label: "Database", sub: "Parameterised queries", c: "text-violet" },
];

export function DeveloperWorkspace() {
  return (
    <section id="developer" aria-labelledby="dev-title" className="section-pad relative">
      <SectionBackdrop tone="cyan" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="dev-title" index="05" eyebrow="Developer workspace" title="How I Build" intro="The workflow and the kind of code I'm practising: validate at the boundary, query safely, and ship small reviewed changes." />
        <Reveal><Ide /></Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h3 className="mono-label mb-6 !text-neon">{"// Git & GitHub workflow"}</h3>
            <ol className="relative space-y-6 border-l border-line/70 pl-8">
              {flow.map((f, i) => (
                <li key={f.t} className="relative">
                  <span aria-hidden className="absolute -left-[3.05rem] grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg text-neon"><f.icon className="h-4 w-4" /></span>
                  <p className="font-display font-semibold"><span className="mr-2 font-mono text-xs text-line">0{i + 1}</span>{f.t}</p>
                  <p className="text-sm text-mute">{f.d}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="mono-label mb-6 !text-cyan">{"// Application architecture"}</h3>
            <ol className="flex flex-col items-stretch lg:flex-row lg:items-center">
              {arch.map((a, i) => (
                <li key={a.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
                  <div className="glass glass-hover flex items-center gap-3 p-4 lg:h-32 lg:w-32 lg:shrink-0 lg:flex-col lg:justify-center lg:gap-2 lg:text-center">
                    <a.icon className={cn("h-6 w-6 shrink-0", a.c)} aria-hidden />
                    <div><p className="font-display text-sm font-semibold">{a.label}</p><p className="font-mono text-[10px] text-mute">{a.sub}</p></div>
                  </div>
                  {i < arch.length - 1 && (
                    <span aria-hidden className="relative mx-auto block h-8 w-px bg-line lg:mx-0 lg:h-px lg:min-w-6 lg:flex-1"><span className="pkt" style={{ animationDelay: `${i * 0.5}s` }} /></span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-mute">Every request crosses validation and authorisation before it reaches data.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
