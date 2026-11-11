import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Skills } from "@/components/skills/Skills";
import { Projects } from "@/components/projects/Projects";
import { Cybersecurity } from "@/components/cybersecurity/Cybersecurity";
import { DeveloperWorkspace } from "@/components/developer/DeveloperWorkspace";
import { Journey } from "@/components/journey/Journey";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/ui/Footer";
import { TechTicker } from "@/components/ui/TechTicker";
import { SectionDivider } from "@/components/ui/Hud";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { profile } from "@/data/profile";

export default function Home() {
  const jsonLd = { "@context": "https://schema.org", "@type": "Person", name: profile.name, url: profile.siteUrl, jobTitle: profile.roleLine };
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-neon focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <TechTicker />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <Cybersecurity />
        <DeveloperWorkspace />
        <Journey />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
