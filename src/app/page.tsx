"use client";

import { FloatingNav } from "./components/ui/floating-navbar";
import { HeroSection } from "./components/ui/hero-section";
import { FeatureSection } from "./components/ui/feature-section";
import { TestimonialSection } from "./components/ui/testimonial-section";
import { QASection } from "./components/ui/qa-section";

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
      <TestimonialSection />
      <QASection />
    </main>
  );
}
