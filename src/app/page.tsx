"use client";

import { FloatingNav } from "./components/ui/floating-navbar";
import { HeroSection } from "./components/ui/hero-section";
import { FeatureSection } from "./components/ui/feature-section";

export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Features",
      link: "/features",
    },
    {
      name: "Testimonials",
      link: "/testimonials",
    },
    {
      name: "Qa",
      link: "/qa",
    },
  ];

  return (
    <main className="min-h-screen">
      <FloatingNav navItems={navItems} />
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
