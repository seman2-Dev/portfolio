import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile } from "@/data/profile";

const title = `${profile.siteName} — ${profile.roleLine}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s · ${profile.siteName}` },
  description: profile.heroDescription,
  keywords: ["full-stack developer", "cybersecurity", "portfolio", "Next.js", "web security"],
  openGraph: {
    title,
    description: profile.heroDescription,
    url: profile.siteUrl,
    siteName: profile.siteName,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description: profile.heroDescription },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#05070d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
