import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";

export const runtime = "nodejs";

// Best-effort per-instance rate limit (use a shared store such as Redis in multi-instance production).
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000, MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  // Honeypot: bots fill hidden field. Pretend success.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const input = { name: String(body.name ?? ""), email: String(body.email ?? ""), message: String(body.message ?? "") };
  const errors = validateContact(input);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL, from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    return NextResponse.json(
      { error: "Contact backend is not configured on this deployment. See README → Contact form setup." },
      { status: 501 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], reply_to: input.email.trim(),
      subject: `Portfolio message from ${input.name.trim().slice(0, 80).replace(/[\r\n]/g, " ")}`,
      html: `<p><strong>${esc(input.name)}</strong> &lt;${esc(input.email)}&gt;</p><p>${esc(input.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
