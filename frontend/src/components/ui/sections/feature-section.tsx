import React from "react";
import { motion } from "framer-motion";

const BentoCard = ({
  title,
  description,
  className,
  icon,
}: {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      className={`rounded-3xl p-8 bg-white border border-neutral-100 shadow-sm hover:shadow-lg transition-shadow ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        <div>
          {icon && <div className="mb-4 text-[#FF823C] w-8 h-8">{icon}</div>}
          <h3 className="font-semibold text-2xl mb-3 text-neutral-800 font-poppins">{title}</h3>
          <p className="text-neutral-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const FeatureSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF823C] to-[#C54F0C] bg-clip-text text-transparent font-poppins">Everything your cat needs</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive tools and expert-backed features to help you provide the best care for your feline friend
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* AI Health Detection - Large Card */}
          <div className="col-span-12 md:col-span-7">
            <BentoCard
              className="h-full"
              title="AI-Powered Disease & Health Detection"
              description="Instantly screen your cat's health using advanced AI — detect early signs of illness and get personalized care recommendations."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
              }
            />
          </div>

          {/* Right Side Cards */}
          <div className="col-span-12 md:col-span-5 grid gap-4">
            {/* Community Support */}
            <BentoCard
              title="24/7 Cat Owner Community & Vet-backed Advice"
              description="Connect with fellow cat lovers and get trusted advice anytime — backed by expert veterinarians and experienced owners."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              }
            />

            {/* Emergency Care */}
            <BentoCard
              title="Vet-Approved Emergency Care Guide"
              description="Access life-saving first aid tips and emergency care guides, curated by veterinary professionals — be prepared when it matters most."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              }
            />
          </div>

          {/* Bottom Cards */}
          <div className="col-span-12 md:col-span-4">
            {/* Daily Care Tips */}
            <BentoCard
              className="h-full"
              title="Vet & AI-Powered Daily Care Tips"
              description="Receive personalized daily tips and wellness reminders — developed with veterinarians to keep your cat happy and healthy."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              }
            />
          </div>

          {/* Vet Locator - Wide Card */}
          <div className="col-span-12 md:col-span-8">
            <BentoCard
              className="h-full"
              title="Find Trusted Vets Near You — Anytime"
              description="Locate and connect with verified veterinarians around you. Whether routine check-up or urgent care, help is just a tap away."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}; 