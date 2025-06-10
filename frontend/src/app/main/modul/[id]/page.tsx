"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconPaw } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  highlights: string[];
  order_index: number;
}

interface ModuleContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sections: ModuleSection[];
}

export default function ModulDetailPage() {
  const params = useParams();
  const [module, setModule] = useState<ModuleContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch module');
        }
        
        const data = await response.json();
        setModule(data);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Failed to load module content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchModule();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF823C] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-neutral-600">Loading module content...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{error || 'Module not found'}</p>
            <Link 
              href="/main/modul"
              className="mt-4 inline-block text-sm text-red-600 hover:text-red-800 underline"
            >
              Return to modules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className={`w-full bg-gradient-to-br ${module.color} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/main/modul"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <IconArrowLeft className="w-5 h-5" />
            Kembali ke Portal Edukasi
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold">{module.title}</h1>
            <p className="text-white/80 text-lg">{module.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {module.sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-200 p-8"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white`}>
                  <IconPaw className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-neutral-800">
                    {section.title}
                  </h2>
                  <p className="text-neutral-600">
                    {section.description}
                  </p>
                  {section.highlights && section.highlights.length > 0 && (
                    <ul className="space-y-2 mt-4">
                      {section.highlights.map((highlight, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-2 text-neutral-700"
                        >
                          <span className="text-[#FF823C] font-bold">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12">
          <p className="text-sm text-neutral-600 text-center px-4 py-3 bg-neutral-100 rounded-lg">
            Disclaimer: Informasi dalam modul ini bersifat edukatif dan tidak menggantikan konsultasi langsung dengan dokter hewan. Selalu konsultasikan masalah kesehatan kucing Anda dengan profesional veteriner yang qualified.
          </p>
        </div>
      </div>
    </div>
  );
} 