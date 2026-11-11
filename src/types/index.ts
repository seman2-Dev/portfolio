export type LearningStatus = "learning" | "practicing" | "planned";
export type SkillCategory = "Frontend" | "Backend" | "Tools" | "Cybersecurity";

export interface Skill {
  name: string;
  category: SkillCategory;
  /** Optional, honest learning indicator. Never a fabricated percentage. */
  status?: LearningStatus;
  note?: string;
}

export type ProjectCategory = "Frontend" | "Full-Stack" | "Cybersecurity" | "Experimental";
export type ProjectPreview = "portfolio" | "soc" | "api" | "lab" | "scene" | "research" | "demo" | "experiment";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  /** Which generated preview artwork to show (used when `image` is not set). */
  preview: ProjectPreview;
  stack: string[];
  features: string[];
  image?: string; // optional real screenshot in /public/images
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export type JourneyStatus = "completed" | "learning" | "planned";

export interface JourneyStep {
  title: string;
  description: string;
  status: JourneyStatus;
  period?: string;
  /** Optional related technologies shown when the step is expanded. */
  topics?: string[];
}

export interface SocialLink {
  label: string;
  /** Leave empty to hide the link. */
  href: string;
  icon: "github" | "linkedin" | "discord" | "mail" | "globe";
}

export interface EducationEntry {
  program: string;
  institution?: string;
  period?: string;
}

export interface IdentityCard {
  key: "developer" | "security" | "explorer";
  title: string;
  text: string;
  tags: string[];
}

export interface Profile {
  siteName: string;
  siteUrl: string;
  name: string;
  roleLine: string;
  heroTagline: string;
  secondaryTagline: string;
  coreConcept: string;
  heroDescription: string;
  status: string;
  focus: string;
  photo?: string;
  cvUrl?: string;
  /** Leave empty to hide the email channel. */
  email: string;
  location?: string;
  about: {
    eyebrow: string;
    headline: string;
    lead: string;
    paragraphs: string[];
  };
  education: EducationEntry[];
  identities: IdentityCard[];
  socials: SocialLink[];
}

export interface LabEntry {
  title: string;
  kind: "Lab" | "Note" | "Research" | "Demo" | "Experiment";
  summary: string;
  status: "in-progress" | "planned" | "published";
  href?: string;
}

export interface Track {
  title: string;
  blurb: string;
  icon: string;
}
