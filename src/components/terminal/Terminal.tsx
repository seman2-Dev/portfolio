"use client";
import { useEffect, useRef, useState } from "react";
import { BANNER, COMMANDS, runCommand, type Line } from "@/lib/terminal";
import { SimulatedBadge } from "@/components/ui/SimulatedBadge";
import { cn } from "@/lib/utils";

const tone = { out: "text-ink/90", in: "text-neon", err: "text-red-400", sys: "text-violet" } as const;

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(() => BANNER.map((text) => ({ kind: "sys", text })));
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [idx, setIdx] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = value;
    const res = runCommand(cmd);
    if (res === "clear") setLines([]);
    else setLines((l) => [...l, { kind: "in", text: `visitor@nexora:~$ ${cmd}` }, ...res]);
    if (cmd.trim()) setHist((h) => [...h, cmd]);
    setIdx(-1);
    setValue("");
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && hist.length) {
      e.preventDefault();
      const n = idx < 0 ? hist.length - 1 : Math.max(0, idx - 1);
      setIdx(n); setValue(hist[n]);
    } else if (e.key === "ArrowDown" && idx >= 0) {
      e.preventDefault();
      const n = idx + 1;
      if (n >= hist.length) { setIdx(-1); setValue(""); } else { setIdx(n); setValue(hist[n]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const m = COMMANDS.filter((c) => c.startsWith(value.toLowerCase()));
      if (m.length === 1) setValue(m[0]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="glass overflow-hidden">
      <div className="flex items-center justify-between border-b border-line bg-surface/70 px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red-500/70" /><span className="h-3 w-3 rounded-full bg-yellow-500/70" /><span className="h-3 w-3 rounded-full bg-neon/70" />
        </div>
        <span className="font-mono text-xs text-mute">visitor@nexora: ~</span>
        <SimulatedBadge>MOCK SHELL</SimulatedBadge>
      </div>
      <div
        ref={box}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => input.current?.focus()}
        className="h-60 overflow-y-auto bg-bg/70 p-4 font-mono text-[13px] leading-relaxed"
      >
        {lines.map((l, i) => (
          <p key={i} className={cn("whitespace-pre-wrap break-words", tone[l.kind])}>{l.text}</p>
        ))}
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="term-input" className="shrink-0 text-neon">visitor@nexora:~$</label>
          <input
            id="term-input"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-ink outline-none"
            placeholder="type 'help'"
          />
        </form>
      </div>
    </div>
  );
}
