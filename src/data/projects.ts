import type { Project } from "@/types";

/**
 * ✏️ EDIT ME. These entries describe the real components built into this
 * portfolio. Add your own projects (with `liveUrl` / `repoUrl` / `image`)
 * or replace these. Links that are not set are hidden automatically.
 */
export const projects: Project[] = [
  {
    slug: "nexora-portfolio",
    title: "NEXORA Portfolio",
    summary: "A hybrid portfolio: classic navigation plus an optional, lazy-loaded 3D cyber environment.",
    description:
      "The site you are looking at. Content is driven by typed config files, the 3D hero loads on idle only when WebGL is available, and every effect has a static or reduced-motion fallback.",
    category: "Frontend",
    preview: "portfolio",
    image: "/images/nexora-portfolio.png",
    liveUrl: "https://seman2.vercel.app/",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"],
    features: ["Typed content configuration", "Lazy-loaded WebGL with static fallback", "prefers-reduced-motion support", "Keyboard-accessible navigation"],
    featured: true,
  },
  {
    slug: "github-readme-md",
    title: "GitHub README.md",
    summary: "A modern, responsive README template for GitHub repositories.",
    description:
      "A clean, responsive and modern README template for GitHub repositories. It includes sections for features, installation, usage, and more, making it easy to showcase your project.",
    category: "Frontend",
    preview: "portfolio",
    image: "/images/github-readme.png",
    liveUrl: "https://gitfolio-md.vercel.app/",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    features: ["Modern design", "Keyboard-accessible navigation"],
    featured: true,
  },
  {
    slug: "dev-stack",
    title: "Developer Tech Stack",
    summary: "An interactive web app to explore, select, and build your custom developer tech stack with real-time UI feedback.",
    description:
      "An interactive web app to explore, select, and build your custom developer tech stack with real-time UI feedback.",
    category: "Frontend",
    preview: "portfolio",
    image: "/images/dev-stack.png",
    liveUrl: "https://luxury-palmier-187d94.netlify.app/",
    stack: ["HTML5", "TypeScript", "Tailwind CSS"],
    features: ["Responsive & Modern UI", "Dynamic Stack Selection"," Instant Toast Notifications", "Real-time UI Feedback"],
    featured: true,
  },
  // {
  //   slug: "defense-center",
  //   title: "Simulated Defense Center",
  //   summary: "An educational, clearly-labelled simulation of a security-operations interface.",
  //   description:
  //     "Network topology, animated packets, an event feed and a fictional vulnerability scan — all generated in the browser for demonstration. It never touches a real system and every panel is marked as simulated.",
  //   category: "Cybersecurity",
  //   preview: "soc",
  //   stack: ["React", "Canvas 2D", "TypeScript"],
  //   features: ["Animated network topology", "Simulated event feed", "Fictional scan walkthrough", "Explicit 'simulated data' labelling"],
  // },
  // {
  //   slug: "interactive-terminal",
  //   title: "Interactive Terminal",
  //   summary: "A mock Linux-style shell with defensive security explainers.",
  //   description:
  //     "A safe, in-browser terminal with command history, tab completion and educational commands that explain concepts like SQL injection and XSS from a defensive point of view. It is not a real shell.",
  //   category: "Experimental",
  //   preview: "terminal",
  //   stack: ["React", "TypeScript"],
  //   features: ["History and tab-completion", "Defensive concept explainers", "Mock-only scan output", "Screen-reader friendly log"],
  // },
  // {
  //   slug: "secure-contact",
  //   title: "Secure Contact Pipeline",
  //   summary: "A validated contact form backed by a hardened route handler.",
  //   description:
  //     "Shared client/server validation, a honeypot field, per-IP rate limiting, HTML escaping and provider-agnostic delivery. It reports honestly when no delivery provider is configured instead of pretending to send.",
  //   category: "Full-Stack",
  //   preview: "api",
  //   stack: ["Next.js Route Handlers", "TypeScript", "Resend API"],
  //   features: ["Server-side validation", "Honeypot and rate limiting", "Escaped HTML output", "Honest 'not configured' state"],
  // },
  {
    slug: "studio-space",
    title: "Studio Space",
    summary: "A secure contact form with a hardened backend.",
    description:
      "Peer-to-peer creative workspace marketplace — find and book photo studios, podcast rooms, music suites, sound stages and art workshops.",
    category: "Full-Stack",
    preview: "api",
    image: "/images/studio-space.png",
    liveUrl: "https://cat-harry-wine.vercel.app/",
    stack: ["Next.js Route Handlers", "TypeScript", "Resend API", "JWT Authentication", "MongoDB"],
    features: ["Server-side validation", "Honeypot and rate limiting", "Escaped HTML output", "Honest 'not configured' state"],
  },
  {
    slug: "cyber-environment",
    title: "3D Cyber Environment",
    summary: "A procedural WebGL scene: holographic core, shield, network and circuit floor.",
    description:
      "Built with React Three Fiber and custom GLSL shaders. Instanced rendering and a single shared uniform clock keep it light, and it pauses when off-screen or when the tab is hidden.",
    category: "Experimental",
    preview: "scene",
    liveUrl: "https://cyber-environment.vercel.app/",
    stack: ["Three.js", "React Three Fiber", "GLSL"],
    features: ["Custom holographic shaders", "Instanced nodes and data packets", "Depth-based camera parallax", "Mobile and low-power fallbacks"],
  },
];

export const projectCategories = ["All Projects", "Frontend", "Full-Stack", "Cybersecurity", "Experimental"] as const;
