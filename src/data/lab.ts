import type { LabEntry, Track } from "@/types";

/**
 * ✏️ EDIT ME. Security Learning Lab. Statuses are honest: set "published"
 * (and add an `href`) only for write-ups that actually exist.
 */
export const labEntries: LabEntry[] = [
  { title: "OWASP Top 10 study notes", kind: "Note", summary: "Working through each category with a defensive example and a mitigation checklist.", status: "in-progress" },
  { title: "Secure login flow", kind: "Demo", summary: "Password hashing, rate limiting and session handling in a local demo app.", status: "in-progress" },
  { title: "Home lab on a local VM", kind: "Lab", summary: "A contained Linux environment I own, for practising hardening and networking basics.", status: "planned" },
  { title: "Security reading list", kind: "Research", summary: "Docs, talks and papers on web and network security, tracked as I go.", status: "in-progress" },
];

export const learningTracks: Track[] = [
  { title: "Web Application Security", blurb: "How web apps fail and how to harden them.", icon: "globe" },
  { title: "OWASP Top 10", blurb: "The most common classes of web risk.", icon: "bug" },
  { title: "Secure Authentication", blurb: "Hashing, sessions, MFA and recovery flows.", icon: "key" },
  { title: "API Security", blurb: "AuthZ, validation, rate limits and abuse cases.", icon: "webhook" },
  { title: "Linux Security", blurb: "Permissions, services and system hardening.", icon: "terminal" },
  { title: "Network Fundamentals", blurb: "TCP/IP, DNS, TLS and traffic basics.", icon: "network" },
  { title: "Ethical Hacking", blurb: "Authorised, lab-only testing methodology.", icon: "scan" },
  { title: "Security Research", blurb: "Reading advisories and writing things down.", icon: "search" },
];
