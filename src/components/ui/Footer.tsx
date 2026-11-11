import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line/70 py-10 text-center">
      <p className="font-display text-sm text-ink">{profile.coreConcept}</p>
      <a href={`mailto:${profile.email}`} className="mt-3 inline-block font-mono text-sm text-ink transition hover:text-neon">
        Email
      </a>
      <p className="mt-2 font-mono text-xs text-mute">© {new Date().getFullYear()} {profile.name} · {profile.siteName}</p>
    </footer>
  );
}
