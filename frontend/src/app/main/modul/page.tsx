"use client";

import { motion } from "framer-motion";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { IconPaw, IconHeartFilled, IconVaccine, IconMoodHappy, IconBowl, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

const modules = [
  {
    id: "pencegahan-penyakit",
    title: "Pencegahan Penyakit",
    description: "Pelajari cara mencegah penyakit umum pada kucing melalui vaksinasi, nutrisi yang tepat, dan perawatan rutin yang optimal.",
    icon: <IconHeartFilled className="w-6 h-6" />,
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "perawatan-dasar",
    title: "Perawatan Dasar",
    description: "Panduan lengkap perawatan dasar kucing dari grooming hingga kebutuhan harian.",
    icon: <IconPaw className="w-6 h-6" />,
    color: "from-red-400 to-red-600",
  },
  {
    id: "vaksinasi",
    title: "Vaksinasi",
    description: "Informasi lengkap tentang jadwal dan jenis vaksinasi yang diperlukan kucing.",
    icon: <IconVaccine className="w-6 h-6" />,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "perilaku",
    title: "Perilaku Kucing",
    description: "Memahami bahasa tubuh dan perilaku kucing untuk komunikasi yang lebih baik.",
    icon: <IconMoodHappy className="w-6 h-6" />,
    color: "from-green-400 to-green-600",
  },
  {
    id: "nutrisi",
    title: "Nutrisi & Diet",
    description: "Panduan nutrisi dan pola makan sehat untuk kucing.",
    icon: <IconBowl className="w-6 h-6" />,
    color: "from-purple-400 to-purple-600",
  },
];

export default function ModulPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const shadowColor = "#FF823C";

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

      {/* Modules Grid */}
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
                    {module.icon}
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
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto mt-16">
        <p className="text-sm text-neutral-600 text-center px-4 py-3 bg-neutral-100 rounded-lg">
          Disclaimer: Informasi dalam portal ini bersifat edukatif dan tidak menggantikan konsultasi langsung dengan dokter hewan. Selalu konsultasikan masalah kesehatan kucing Anda dengan profesional veteriner yang qualified.
        </p>
      </div>
    </div>
  );
} 