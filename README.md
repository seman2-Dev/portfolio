# NEXORA — Cybersecurity × Full-Stack Portfolio

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber · GSAP · Framer Motion · Lenis

## Install & run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint
```
Requires Node 20+ (developed on Node 22).

## Configure your content (no component edits needed)
| File | What it controls |
|---|---|
| `src/data/profile.ts` | Name, tagline, bio, education, email, photo, CV path, social links |
| `src/data/skills.ts` | Skills + optional honest status (`learning` / `practicing` / `planned`) |
| `src/data/projects.ts` | Projects (categories, stack, features, `liveUrl`, `repoUrl`) |
| `src/data/journey.ts` | Roadmap steps + status (`completed` / `learning` / `planned`) |
| `src/data/lab.ts` | Security learning tracks and lab entries |

Everything marked `[PLACEHOLDER]` / `[YOUR NAME]` is not real information. Replace it.
- **Photo**: put the file in `public/images/` and set `profile.photo`.
- **CV**: put the PDF in `public/` and set `profile.cvUrl` (the button shows "(not set)" until then).
- **Site URL**: copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SITE_URL` (used by sitemap, robots, Open Graph).

## Contact form setup
The form validates on client and server. The API route (`src/app/api/contact/route.ts`) returns an honest
**501 "not configured"** until you set these in `.env.local` (or your host's env settings):
```
RESEND_API_KEY=...        # https://resend.com
CONTACT_TO_EMAIL=you@yourdomain.com
CONTACT_FROM_EMAIL="Portfolio <noreply@your-verified-domain>"
```
Includes a honeypot field and a per-instance rate limit (use a shared store such as Redis if you scale to multiple instances).
Alternatively swap the `fetch` call for any provider (SES, Postmark, Formspree).

## Honesty notes
- The security dashboard, vulnerability scan, event feed and terminal use **mock data** and are labelled as simulated.
- The code editor is display-only and does not execute code.
- No proficiency percentages, certifications, awards or experience are invented.

## Architecture
```
src/app            layout, page, sitemap, robots, icon, api/contact
src/components     navigation · hero · 3d · about · skills · projects · cybersecurity · terminal
                   developer · journey · contact · animations · ui
src/data           editable content config
src/hooks          useReducedMotion, useMediaQuery, useActiveSection
src/lib            terminal engine, tokenizer, validation
```
3D: `HeroBackground` (client) lazy-loads `HeroScene` via `next/dynamic` on idle, only if WebGL exists and
motion isn't reduced; pauses rendering when off-screen; fewer particles/trees and lower DPR on mobile.
Static CSS backdrop is the fallback.

## Remaining / your tasks
Add real content, photo, CV, projects and links; configure the contact backend; add an Open Graph image
(`src/app/opengraph-image.png`); run Lighthouse on your deployed URL.
