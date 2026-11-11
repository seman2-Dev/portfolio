export type Tok = { t: "kw" | "str" | "com" | "num" | "fn" | "txt"; v: string };

const KW = new Set(["import", "from", "export", "const", "let", "async", "await", "return", "if", "else", "function", "throw", "new", "type", "interface", "default"]);
const RE = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

/** Tiny dependency-free tokenizer for the display-only code editor. */
export function highlight(src: string): Tok[] {
  const out: Tok[] = [];
  let last = 0;
  for (const m of src.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "txt", v: src.slice(last, i) });
    if (m[1]) out.push({ t: "com", v: m[0] });
    else if (m[2]) out.push({ t: "str", v: m[0] });
    else if (m[3]) out.push({ t: "num", v: m[0] });
    else if (m[4]) out.push({ t: KW.has(m[0]) ? "kw" : "fn", v: m[0] });
    else out.push({ t: KW.has(m[0]) ? "kw" : "txt", v: m[0] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: "txt", v: src.slice(last) });
  return out;
}
