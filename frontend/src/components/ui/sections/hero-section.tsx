import React from "react";
import Typewriter from "typewriter-effect";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Icons } from "@/components/ui/icons";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/ui/sparkles-text";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-4 pt-32 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        {/* Gradient Circles */}
        <div className="absolute top-20 left-[15%] w-[30rem] h-[30rem] bg-[#FF823C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[15%] w-[25rem] h-[25rem] bg-[#C54F0C]/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(#FF823C 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.05
          }}
        />

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-40 right-[20%] w-8 h-8 border border-[#FF823C]/20 rounded-lg"
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-60 left-[25%] w-6 h-6 border border-[#C54F0C]/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-40 left-[30%] w-10 h-10 border border-[#FF823C]/20 rounded-lg rotate-45"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SparklesText 
            className="text-5xl md:text-7xl font-bold mb-6 font-poppins"
            sparklesColor="#FF823C"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF823C] to-[#C54F0C]">
              You're not alone. Helping you care for your cat — wherever you are
            </span>
          </SparklesText>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-12 font-poppins font-normal"
        >
          PurrPal connects cat lovers in remote areas with AI-powered health tools, a caring community, and trusted advice — so every cat gets the love and care it deserves.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center"
        >
          <button 
            onClick={() => router.push("/auth/login")}
            className="bg-gradient-to-r from-[#FF823C] to-[#C54F0C] px-8 py-4 rounded-full hover:opacity-90 transition-all text-white font-poppins font-medium shadow-lg hover:shadow-xl"
          >
            <Typewriter
              options={{
                strings: ["✨ Get Started →"],
                autoStart: true,
                loop: true,
                cursor: "|",
                delay: 50,
                deleteSpeed: 50,
              }}
            />
          </button>
        </motion.div>
      </div>

      {/* Orbiting Circles Section */}
      <div className="relative flex h-[500px] w-full items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF823C]/5 to-[#C54F0C]/5 rounded-full blur-3xl" />
          <OrbitingCircles iconSize={50} radius={180} speed={0.5} duration={40}>
            <Icons.health />
            <Icons.food />
            <Icons.vet />
            <Icons.community />
            <Icons.grooming />
            <Icons.emergency />
          </OrbitingCircles>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <OrbitingCircles iconSize={40} radius={120} reverse speed={0.7} duration={35}>
            <Icons.cat />
            <Icons.health />
            <Icons.tips />
            <Icons.community />
          </OrbitingCircles>
        </div>
      </div>
    </section>
  );
}; 