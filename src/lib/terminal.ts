import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { journey } from "@/data/journey";

export type Line = { kind: "out" | "in" | "err" | "sys"; text: string };

const OWASP = [
  "A01 Broken Access Control",
  "A02 Cryptographic Failures",
  "A03 Injection",
  "A04 Insecure Design",
  "A05 Security Misconfiguration",
  "A06 Vulnerable and Outdated Components",
  "A07 Identification and Authentication Failures",
  "A08 Software and Data Integrity Failures",
  "A09 Security Logging and Monitoring Failures",
  "A10 Server-Side Request Forgery",
];

const EXPLAIN: Record<string, string[]> = {
  sqli: [
    "SQL injection (defensive overview)",
    "  Risk : untrusted input is concatenated into a query, changing its meaning.",
    "  Fix  : parameterised queries / prepared statements, least-privilege DB users,",
    "         input validation as defence-in-depth.",
  ],
  xss: [
    "Cross-site scripting (defensive overview)",
    "  Risk : untrusted data rendered as HTML/JS in another user's browser.",
    "  Fix  : context-aware output encoding, avoid dangerouslySetInnerHTML,",
    "         Content-Security-Policy, HttpOnly cookies.",
  ],
  csrf: [
    "Cross-site request forgery (defensive overview)",
    "  Risk : a third-party site triggers state-changing requests with your cookies.",
    "  Fix  : SameSite cookies, anti-CSRF tokens, verify Origin/Referer headers.",
  ],
  auth: [
    "Secure authentication (checklist)",
    "  - Hash passwords with a slow, salted algorithm (argon2id / bcrypt).",
    "  - Rate-limit and monitor login attempts; support MFA.",
    "  - Short-lived sessions, rotate on privilege change, secure cookie flags.",
  ],
};

export const COMMANDS = ["help", "about", "skills", "projects", "journey", "whoami", "ls", "date", "owasp", "explain", "scan-demo", "echo", "banner", "clear"];

export const BANNER = [
  "NEXORA shell v1.0 — portfolio terminal (not a real shell)",
  "Type 'help' for commands. Everything here is static/mock data.",
];

export function runCommand(raw: string): Line[] | "clear" {
  const input = raw.trim();
  if (!input) return [];
  const [cmd, ...args] = input.split(/\s+/);
  const out = (t: string[]): Line[] => t.map((text) => ({ kind: "out", text }));

  switch (cmd.toLowerCase()) {
    case "clear":
      return "clear";
    case "help":
      return out([
        "Available commands:",
        "  help            show this list",
        "  about           who I am",
        "  skills          technologies (honest status, no percentages)",
        "  projects        project list",
        "  journey         learning roadmap",
        "  whoami / ls / date / echo <text> / banner",
        "  owasp           OWASP Top 10 (2021) category names",
        "  explain <topic> sqli | xss | csrf | auth  (defensive concepts)",
        "  scan-demo       MOCK vulnerability-scan output (simulated)",
        "  clear           clear screen",
      ]);
    case "about":
      return out([`${profile.name} — ${profile.roleLine}`, ...profile.about.paragraphs, ...(profile.email ? [`Contact: ${profile.email}`] : [])]);
    case "skills": {
      const cats = [...new Set(skills.map((s) => s.category))];
      return out(cats.map((c) => `${c.padEnd(14)} ${skills.filter((s) => s.category === c).map((s) => s.name).join(", ")}`));
    }
    case "projects":
      return out(projects.map((p, i) => `${i + 1}. ${p.title} [${p.category}]`));
    case "journey":
      return out(journey.map((j, i) => `${String(i + 1).padStart(2, "0")}. [${j.status.padEnd(9)}] ${j.title}`));
    case "whoami":
      return out(["visitor"]);
    case "ls":
      return out(["about.txt  skills.txt  projects/  journey.md  contact.txt"]);
    case "date":
      return out([new Date().toString()]);
    case "echo":
      return out([args.join(" ")]);
    case "banner":
      return out(BANNER);
    case "owasp":
      return out(["OWASP Top 10 — 2021 edition (check owasp.org for the current list):", ...OWASP.map((o) => `  ${o}`)]);
    case "explain": {
      const t = (args[0] ?? "").toLowerCase();
      return EXPLAIN[t] ? out(EXPLAIN[t]) : [{ kind: "err", text: "usage: explain <sqli|xss|csrf|auth>" }];
    }
    case "scan-demo":
      return [
        { kind: "sys", text: "[SIMULATED] This is canned output. No network traffic is generated." },
        ...out([
          "Target : demo.invalid (fictional)",
          "  [ok]   TLS configuration reviewed",
          "  [warn] Missing Content-Security-Policy header (example finding)",
          "  [ok]   Cookies marked HttpOnly + Secure",
          "  [info] 1 warning, 0 critical (mock result)",
        ]),
      ];
    case "sudo":
    case "rm":
    case "ssh":
    case "nmap":
    case "curl":
      return [{ kind: "err", text: `${cmd}: this is a portfolio demo, not a real shell. Try 'help'.` }];
    default:
      return [{ kind: "err", text: `${cmd}: command not found. Type 'help'.` }];
  }
}
