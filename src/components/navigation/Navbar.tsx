"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const ids = navItems.map((n) => n.id);

export function Navbar() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Always-on blur layer keeps the bar readable over the 3D hero and every section. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 transition-all duration-500",
          scrolled || open ? "border-b border-line/60 bg-bg/75 backdrop-blur-xl backdrop-saturate-150" : "bg-gradient-to-b from-bg/70 to-transparent backdrop-blur-[6px]",
        )}
      />
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#home" className="group flex items-center gap-3 font-display text-lg font-bold tracking-[0.12em]" aria-label={`${profile.siteName} — home`}>
          <Logo className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
          <span>{profile.siteName}</span>
        </a>

        <ul className="hidden items-center gap-0.5 rounded-full border border-line/60 bg-bg/40 p-1 backdrop-blur-md lg:flex">
          {navItems.map((n, i) => {
            const on = active === n.id;
            return (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={on ? "page" : undefined}
                  className={cn("group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors", on ? "text-neon" : "text-mute hover:text-ink")}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full border border-neon/30 bg-neon/10 shadow-[0_0_24px_-6px_rgb(57_255_136/0.55)]"
                    />
                  )}
                  <span className={cn("font-mono text-[9px] transition-opacity", on ? "opacity-70" : "opacity-0 group-hover:opacity-50")}>{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                  <span aria-hidden className={cn("absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-cyan transition-transform duration-300 group-hover:scale-x-100", on && "hidden")} />
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line/80 bg-bg/50 text-ink backdrop-blur lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-5 py-6 sm:px-8">
              {navItems.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === n.id ? "page" : undefined}
                    className={cn("flex min-h-14 items-center gap-4 border-b border-line/50 py-3 font-display text-2xl", active === n.id ? "text-neon" : "text-ink/90")}
                  >
                    <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
