import type { Profile } from "@/types";

/**
 * ✏️ EDIT ME — the single place for personal details.
 *
 * - Fields left empty ("" or undefined) are hidden from the UI automatically,
 *   so you never see half-filled boxes.
 * - Nothing here claims experience, certifications, awards or achievements.
 *   Only add those yourself when they are true.
 */
export const profile: Profile = {
  siteName: "Seman2",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // ── Identity ───────────────────────────────────────────────
  name: "Md.Semanto Bolbol", // ← replace with your real name
  roleLine: "Full-Stack Developer & Cybersecurity Enthusiast",
  heroTagline: "Building Digital Experiences. Exploring the Frontiers of Security.",
  secondaryTagline: "Code Beyond Limits. Think Beyond Boundaries. Secure the Future.",
  coreConcept: "Building the Future. Securing the Digital World.",
  heroDescription:
    "I build modern digital experiences and explore the technologies that make the digital world more secure.",
  status: "Learning & building",
  focus: "Full-Stack · Security",

  // ── Optional details (hidden when empty) ──────────────────
  photo: "images/profile.jpeg", // e.g. "/images/profile.jpg" (file in /public/images)
  cvUrl: undefined, // e.g. "/cv.pdf" (file in /public) — shows the Download CV button
  email: "semantobolbol2006@gmail.com", // Replace with an address when you want to show the email channel
  location: "Rajshahi, Bangladesh", // e.g. "Dhaka, Bangladesh"

  // ── About ─────────────────────────────────────────────────
  about: {
    eyebrow: "Identity",
    headline: "I build for the web — and study how it gets defended.",
    lead: "I'm a Computer Science & Technology student who builds full-stack web applications and is learning how to keep them secure.",
    paragraphs: [
      "My work sits where engineering meets defense: shipping clean interfaces and APIs while studying secure coding, web application security and Linux fundamentals, so that what I build holds up in the real world.",
      "I like understanding systems end to end — from the pixel in the browser to the packet on the wire.",
    ],
  },
  education: [
    {
      program: "Computer Science & Technology",
      institution: "Rajshahi Govt. Polytechnic Institute", // e.g. "University name"
      period: "2023 – 2027", // e.g. "2023 – 2027"
    },
  ],
  identities: [
    {
      key: "developer",
      title: "Full-Stack Developer",
      text: "Building modern, responsive and scalable digital applications — from interface to API to data.",
      tags: ["React", "Next.js", "Node.js", "TypeScript"],
    },
    {
      key: "security",
      title: "Cybersecurity Enthusiast",
      text: "Exploring web security, secure coding, ethical hacking and digital defense.",
      tags: ["OWASP Top 10", "Secure Coding", "Linux", "Networking"],
    },
    {
      key: "explorer",
      title: "Technology Explorer",
      text: "Learning emerging technologies and developing practical engineering skills.",
      tags: ["WebGL", "3D on the web", "Systems", "Tooling"],
    },
  ],

  // ── Social links (entries with an empty href are hidden) ──
  socials: [
    { label: "GitHub", href: "https://github.com/seman2-Dev", icon: "github" }, // e.g. "https://github.com/username"
    { label: "LinkedIn", href: "https://www.linkedin.com/in/md-semanto-bolbol", icon: "linkedin" },
    { label: "Discord", href: "https://discord.com/seman2_bol", icon: "discord" },
  ],
};
