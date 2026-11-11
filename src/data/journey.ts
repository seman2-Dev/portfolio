import type { JourneyStep } from "@/types";

/**
 * ✏️ EDIT ME. A roadmap, not a claim of mastery.
 * Set each status to completed | learning | planned so it reflects reality.
 */
export const journey: JourneyStep[] = [
  { title: "Computer Science & Technology Education", description: "Formal foundation in computing concepts, problem solving and systems thinking.", status: "learning", topics: ["Algorithms", "Systems", "Networks"] },
  { title: "HTML and CSS", description: "Semantic markup, modern layout and responsive design.", status: "completed", topics: ["HTML", "CSS", "Tailwind CSS"] },
  { title: "JavaScript and TypeScript", description: "Language fundamentals, typing, tooling and async patterns.", status: "completed", topics: ["JavaScript", "TypeScript", "Git"] },
  { title: "React and Next.js", description: "Component architecture, the App Router and server components.", status: "completed", topics: ["React", "Next.js"] },
  { title: "Full-Stack Development", description: "Connecting UI, APIs and data end to end.", status: "learning", topics: ["REST APIs", "Authentication", "Databases"] },
  { title: "Backend Engineering", description: "Node.js services, REST design and data modelling.", status: "learning", topics: ["Node.js", "Express.js", "Databases"] },
  { title: "Linux and System Administration", description: "Shell, permissions, services and hardening basics.", status: "planned", topics: ["Linux", "Ubuntu", "Linux Security"] },
  { title: "Web Application Security", description: "OWASP Top 10, secure coding and threat modelling.", status: "learning", topics: ["OWASP Top 10", "Secure Coding", "AuthN & AuthZ"] },
  { title: "Cybersecurity Specialization", description: "Deepening into a focused security path.", status: "planned", topics: ["Ethical Hacking", "Networking", "Security Research"] },
];
