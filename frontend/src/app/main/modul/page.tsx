"use client";

import { motion } from "framer-motion";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { IconPaw, IconHeartFilled, IconVaccine, IconMoodHappy, IconBowl, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Icon mapping
const iconComponents = {
  IconPaw: <IconPaw className="w-6 h-6" />,
  IconHeartFilled: <IconHeartFilled className="w-6 h-6" />,
  IconVaccine: <IconVaccine className="w-6 h-6" />,
  IconMoodHappy: <IconMoodHappy className="w-6 h-6" />,
  IconBowl: <IconBowl className="w-6 h-6" />,
};

interface Module {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof iconComponents;
  color: string;
}

export default function ModulPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shadowColor = "#FF823C";

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const data = await response.json();
        setModules(data);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/icon/iconname.svg"
            alt="PurrPal Logo"
            className="h-16 w-auto"
          />
        </div>
        <h2 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl mb-4">
          Selamat Datang di{" "}
          <LineShadowText className="italic" shadowColor={shadowColor}>
            Portal Edukasi
          </LineShadowText>
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto mt-6">
          Temukan berbagai informasi lengkap tentang kesehatan dan perawatan kucing kesayangan Anda
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative mt-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari informasi kesehatan kucing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-neutral-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent pl-14"
            />
            <IconSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF823C] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-neutral-600">Loading modules...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg inline-block">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      {!isLoading && !error && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/main/modul/${module.id}`}>
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-[#FF823C] transition-all duration-300 group h-full">
                  {/* Module Header */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} text-white`}>
                      {iconComponents[module.icon] || <IconPaw className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-[#FF823C] transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-2">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {filteredModules.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">No modules found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto mt-16">
        <p className="text-sm text-neutral-600 text-center px-4 py-3 bg-neutral-100 rounded-lg">
          Disclaimer: Informasi dalam portal ini bersifat edukatif dan tidak menggantikan konsultasi langsung dengan dokter hewan. Selalu konsultasikan masalah kesehatan kucing Anda dengan profesional veteriner yang qualified.
        </p>
      </div>
    </div>
  );
} 