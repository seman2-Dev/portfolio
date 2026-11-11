<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository notes

Single-package Next.js 16 (App Router) portfolio, npm (`package-lock.json`), React 19, TypeScript strict, Tailwind CSS 4. Path alias `@/*` → `src/*`. Node 20+ required. No monorepo.

## Commands (verified)

- `npm run dev` — Turbopack dev server, http://localhost:3000
- `npm run typecheck` — `tsc --noEmit`; passes
- `npm run build` / `npm start` — passes
- `npm run lint` — **currently fails (exit 2), not your fault.** `eslint.config.mjs` spreads `eslint-config-next/core-web-vitals` as a flat config, but the installed `eslint-config-next@15.5.29` is legacy eslintrc-style (`{ extends: [...] }`) and its extensionless ESM import doesn't resolve. Fix: upgrade `eslint-config-next` to ^16 to match Next 16 (flat-config setup: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md`). Until then, rely on `typecheck` + `build`, and don't treat lint failures as real.
- No tests, test runner, CI, or Prettier exist — don't look for them.

## The managed block above

The `<!-- BEGIN:nextjs-agent-rules -->` block is written/restored by `next dev` (upserts by markers, keeps surrounding content). Never edit or delete it; add content only outside the markers.

## Content lives in `src/data`, not components

- All editable copy/config: `src/data/{profile,skills,projects,journey,lab,navigation}.ts`, typed by `src/types/index.ts`. To change what the site says, edit data files — components read from them.
- `[PLACEHOLDER]` / `[YOUR NAME]` strings are intentionally unfilled; replace only with real info the user provides.
- Honesty policy (README "Honesty notes"): the security dashboard, vulnerability scan, event feed and terminal use mock data and must stay labelled (`src/components/ui/SimulatedBadge.tsx`); never invent proficiency percentages, certifications, or experience.

## Env & runtime gotchas

- `.env.local` (from `.env.example`): `NEXT_PUBLIC_SITE_URL` feeds `profile.siteUrl` → sitemap, robots, `metadataBase` (falls back to `http://localhost:3000`). Contact form needs `RESEND_API_KEY` + `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL` together; without them `src/app/api/contact/route.ts` returns an honest **501** (by design). It also has a honeypot and a per-instance in-memory rate limit.
- Tailwind 4: no `tailwind.config` file — PostCSS plugin only (`postcss.config.mjs`); theme/utilities are in `src/app/globals.css`. Fonts are `@fontsource-variable/*` imports there, not `next/font`.
- `next.config.mjs` sets `transpilePackages: ["three"]` and a pinned Turbopack root — keep both.
- Hero 3D: `src/components/3d/HeroBackground.tsx` defers `HeroScene` via `next/dynamic` until idle, gated on WebGL support and reduced motion; the static CSS backdrop underneath is the fallback — preserve it when touching the scene.

## Docs

`README.md` has setup, content table, contact-form setup, and architecture. Trust it over prose here, except the lint status above (verified against the current `package.json`).
