import type { Skill } from "@/types";

/**
 * ✏️ EDIT ME. `status` is optional and honest: "learning" | "practicing" | "planned".
 * Delete or change any entry. No proficiency percentages are used on purpose.
 * Initial statuses are neutral defaults — adjust them to reflect reality.
 */
export const skills: Skill[] = [
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend", status: "learning" },
  { name: "React", category: "Frontend", status: "learning" },
  { name: "Next.js", category: "Frontend", status: "learning" },
  { name: "Tailwind CSS", category: "Frontend" },

  { name: "Node.js", category: "Backend", status: "learning" },
  { name: "Express.js", category: "Backend", status: "learning" },
  { name: "REST APIs", category: "Backend", status: "learning" },
  { name: "Authentication", category: "Backend", status: "learning" },
  { name: "Databases", category: "Backend", status: "learning" },

  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Linux", category: "Tools", status: "learning" },
  { name: "Ubuntu", category: "Tools", status: "learning" },

  { name: "OWASP Top 10", category: "Cybersecurity", status: "learning" },
  { name: "Web Application Security", category: "Cybersecurity", status: "learning" },
  { name: "Secure Coding", category: "Cybersecurity", status: "learning" },
  { name: "AuthN & AuthZ", category: "Cybersecurity", status: "learning" },
  { name: "Linux Security", category: "Cybersecurity", status: "planned" },
  { name: "Networking Fundamentals", category: "Cybersecurity", status: "learning" },
  { name: "Ethical Hacking", category: "Cybersecurity", status: "planned" },
  { name: "Security Research", category: "Cybersecurity", status: "planned" },
];

export const skillCategories = ["All", "Frontend", "Backend", "Tools", "Cybersecurity"] as const;
