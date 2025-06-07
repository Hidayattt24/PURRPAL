"use client";

import { FloatingDock } from "./components/ui/floating-dock";
import { HeroSection } from "./components/ui/hero-section";
import { FeatureSection } from "./components/ui/feature-section";
import { TestimonialSection } from "./components/ui/testimonial-section";
import { QASection } from "./components/ui/qa-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <FloatingDock />
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <QASection />
    </main>
  );
}
