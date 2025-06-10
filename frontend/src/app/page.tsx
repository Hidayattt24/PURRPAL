"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { HeroSection } from "@/components/ui/sections/hero-section";
import { FeatureSection } from "@/components/ui/sections/feature-section";
import { TestimonialSection } from "@/components/ui/sections/testimonial-section";
import { QASection } from "@/components/ui/sections/qa-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <FloatingDock />
      <section id="home">
        <HeroSection />
      </section>
      <section id="features">
        <FeatureSection />
      </section>
      <section id="testimonials">
        <TestimonialSection />
      </section>
      <section id="faq">
        <QASection />
      </section>
    </main>
  );
}
