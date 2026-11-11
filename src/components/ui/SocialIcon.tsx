import { Mail, Globe } from "lucide-react";
import type { SocialLink } from "@/types";
import { DiscordIcon, GithubIcon, LinkedinIcon } from "./BrandIcons";

const map = { github: GithubIcon, linkedin: LinkedinIcon, discord: DiscordIcon, mail: Mail, globe: Globe } as const;
export function SocialIcon({ name, className }: { name: SocialLink["icon"]; className?: string }) {
  const I = map[name];
  return <I className={className} aria-hidden />;
}
