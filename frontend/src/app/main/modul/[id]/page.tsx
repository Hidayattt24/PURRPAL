"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from 'react';

// Emoji mapping for modules
const emojiMap: Record<string, string> = {
  'paw': '🐾',
  'heart': '❤️',
  'vaccine': '💉',
  'happy': '😊',
  'bowl': '🍽️',
  'medical': '⚕️',
  'dog': '🐕',
  'smile': '😃',
  'sun': '☀️',
  'plane': '✈️',
  'apple': '🍎',
  'stethoscope': '🏥',
  'pill': '💊',
  'cat': '🐱',
  'firstaid': '🚑',
  'default': '🐱'
};

// Modern color palette with better contrast
const colorPalette = {
  'from-blue-500 to-blue-700': 'from-slate-900 to-blue-900',
  'from-green-500 to-green-700': 'from-emerald-600 to-teal-700',
  'from-purple-500 to-purple-700': 'from-violet-600 to-purple-700',
  'from-pink-500 to-pink-700': 'from-rose-500 to-pink-600',
  'from-orange-500 to-orange-700': 'from-amber-500 to-orange-600',
  'from-red-500 to-red-700': 'from-red-500 to-rose-600',
  'from-indigo-500 to-indigo-700': 'from-indigo-600 to-purple-600',
  'from-cyan-500 to-cyan-700': 'from-cyan-500 to-teal-600',
  'from-yellow-500 to-yellow-700': 'from-yellow-400 to-amber-500',
  'from-gray-500 to-gray-700': 'from-slate-600 to-gray-700'
};

// Helper function to normalize colors
const normalizeColor = (color: string): string => {
  // If it's already a valid Tailwind gradient, return it
  if (color.includes('from-') && color.includes('to-')) {
    return colorPalette[color as keyof typeof colorPalette] || color;
  }
  
  // Default fallback
  return 'from-slate-900 to-blue-900';
};

// Helper function to get emoji
const getEmoji = (iconName: string) => {
  const normalizedIconName = iconName.replace(/^(icon-|Icon)/i, '').toLowerCase();
  return emojiMap[normalizedIconName] || emojiMap.default;
};

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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
        // Initially expand the first section
        if (data.sections && data.sections.length > 0) {
          setExpandedSections(new Set([data.sections[0].id]));
        }
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-200 border-r-blue-600" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-blue-100" />
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading module content...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-red-100">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-slate-600 mb-6">{error || 'Module not found'}</p>
            <Link 
              href="/main/modul"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              <IconArrowLeft className="w-4 h-4" />
              Return to modules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroGradient = normalizeColor(module.color);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <div className={`w-full bg-gradient-to-br ${heroGradient} text-white py-32 px-4 relative overflow-hidden`}>
        {/* Modern Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)
              `
            }}></div>
          </div>
          {/* Floating shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg" />
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <Link 
            href="/main/modul"
            className="inline-flex items-center gap-3 text-white/90 hover:text-white mb-16 transition-all duration-300 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 hover:border-white/30 transform hover:scale-105"
          >
            <IconArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Portal Edukasi</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="bg-white/15 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl"
              >
                <span className="text-6xl block">{getEmoji(module.icon)}</span>
              </motion.div>
              <div className="flex-grow">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                >
                  {module.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/90 text-xl md:text-2xl leading-relaxed font-light"
                >
                  {module.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="space-y-8">
          {module.sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left group"
              >
                <div className="p-8 flex items-start gap-6 cursor-pointer hover:bg-white/80 transition-all duration-300">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`shrink-0 p-5 rounded-2xl bg-gradient-to-br ${normalizeColor(section.color)} flex items-center justify-center text-3xl shadow-lg border border-white/20`}
                  >
                    {getEmoji(section.icon)}
                  </motion.div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {section.title}
                      </h2>
                      <motion.div
                        animate={{ rotate: expandedSections.has(section.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <IconChevronDown className="w-7 h-7 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </motion.div>
                    </div>
                    <p className="text-slate-600 mt-3 text-lg leading-relaxed line-clamp-2">
                      {section.description}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="border-t border-slate-200/50 bg-gradient-to-r from-white/40 to-slate-50/40 backdrop-blur-sm"
                >
                  <div className="p-8 pt-6">
                    <p className="text-slate-700 mb-8 text-lg leading-relaxed">
                      {section.description}
                    </p>
                    {section.highlights && section.highlights.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6">Key Points:</h3>
                        {section.highlights.map((highlight, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 group"
                          >
                            <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <span className="text-white text-sm font-bold">{index + 1}</span>
                            </div>
                            <p className="text-slate-700 flex-grow text-lg leading-relaxed">{highlight}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Modern Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">Important Disclaimer</h3>
                <p className="text-amber-800 leading-relaxed">
                  Informasi dalam modul ini bersifat edukatif dan tidak menggantikan konsultasi langsung dengan dokter hewan. 
                  Selalu konsultasikan masalah kesehatan kucing Anda dengan profesional veteriner yang qualified.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}