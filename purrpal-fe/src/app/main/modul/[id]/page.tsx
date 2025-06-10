"use client";

import { motion } from "framer-motion";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { IconArrowLeft, IconVaccine, IconHeartFilled, IconStethoscope, IconSpray, IconBowl, IconPaw, IconMoodHappy, IconUsers, IconAlertTriangle, IconApple, IconScale, IconHeartRateMonitor } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ModuleSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  highlights: string[];
}

interface ModuleContent {
  title: string;
  content: ModuleSection[];
}

const moduleContent: Record<string, ModuleContent> = {
  "pencegahan-penyakit": {
    title: "Pencegahan Penyakit Kucing",
    content: [
      {
        title: "Vaksinasi Rutin",
        description: `Vaksinasi adalah langkah krusial dalam mencegah penyakit serius pada kucing. Vaksin inti yang diperlukan termasuk FVRCP (melindungi dari Feline Viral Rhinotracheitis, Calicivirus, dan Panleukopenia) dan Rabies. Untuk kucing dengan risiko tinggi, vaksin tambahan seperti FeLV (Feline Leukemia Virus) juga direkomendasikan.`,
        icon: <IconVaccine className="w-12 h-12" />,
        color: "from-orange-400 to-orange-600",
        highlights: [
          "FVRCP (Vaksin 3-in-1)",
          "Rabies",
          "FeLV (opsional)",
          "Jadwal rutin"
        ]
      },
      {
        title: "Kebersihan dan Sanitasi",
        description: `Menjaga kebersihan adalah kunci pencegahan penyakit. Bersihkan kotak pasir setiap hari dan ganti seluruh pasir setiap 1-2 minggu. Cuci tempat makan dan minum setiap hari dengan air hangat dan sabun. Sediakan area tidur yang bersih dan nyaman, serta rutin membersihkan area bermain dan peralatan kucing.`,
        icon: <IconSpray className="w-12 h-12" />,
        color: "from-blue-400 to-blue-600",
        highlights: [
          "Bersihkan kotak pasir harian",
          "Cuci tempat makan",
          "Area tidur bersih",
          "Sanitasi peralatan"
        ]
      },
      {
        title: "Pemeriksaan Rutin",
        description: `Kunjungi dokter hewan setidaknya 1-2 kali setahun untuk pemeriksaan menyeluruh. Pemeriksaan meliputi kondisi gigi dan mulut, berat badan, pemeriksaan parasit, dan evaluasi perilaku. Untuk kucing senior (7 tahun ke atas), pemeriksaan disarankan setiap 6 bulan.`,
        icon: <IconStethoscope className="w-12 h-12" />,
        color: "from-green-400 to-green-600",
        highlights: [
          "Check-up 1-2x setahun",
          "Pemeriksaan gigi",
          "Kontrol berat badan",
          "Evaluasi perilaku"
        ]
      }
    ]
  },
  "perawatan-dasar": {
    title: "Perawatan Dasar Kucing",
    content: [
      {
        title: "Grooming",
        description: `Sikat bulu kucing 2-3 kali seminggu untuk kucing berbulu pendek, dan setiap hari untuk kucing berbulu panjang. Gunakan sisir yang sesuai dengan jenis bulu. Potong kuku setiap 2-3 minggu dan bersihkan telinga secara berkala dengan pembersih khusus kucing.`,
        icon: <IconPaw className="w-12 h-12" />,
        color: "from-purple-400 to-purple-600",
        highlights: [
          "Sikat bulu rutin",
          "Potong kuku",
          "Bersihkan telinga",
          "Perawatan gigi"
        ]
      },
      {
        title: "Kebutuhan Dasar",
        description: `Sediakan perlengkapan esensial: tempat makan dan minum terpisah yang selalu bersih, kotak pasir dengan lokasi yang mudah diakses (1 kotak per kucing + 1 tambahan), tempat tidur yang nyaman, mainan untuk stimulasi mental, dan garukan untuk merawat kuku.`,
        icon: <IconHeartFilled className="w-12 h-12" />,
        color: "from-pink-400 to-pink-600",
        highlights: [
          "Tempat makan & minum",
          "Kotak pasir",
          "Tempat tidur",
          "Mainan & garukan"
        ]
      },
      {
        title: "Aktivitas dan Bermain",
        description: `Luangkan waktu minimal 10-15 menit, 2 kali sehari untuk bermain dengan kucing. Gunakan mainan interaktif seperti tongkat dengan tali dan bulu-buluan, bola kecil, atau laser pointer. Sediakan tempat memanjat atau cat tree untuk aktivitas vertikal.`,
        icon: <IconMoodHappy className="w-12 h-12" />,
        color: "from-yellow-400 to-yellow-600",
        highlights: [
          "Bermain 2x sehari",
          "Mainan interaktif",
          "Aktivitas vertikal",
          "Stimulasi mental"
        ]
      }
    ]
  },
  "vaksinasi": {
    title: "Vaksinasi Kucing",
    content: [
      {
        title: "Jenis-jenis Vaksin",
        description: "Vaksin inti (core vaccines) wajib untuk semua kucing: FVRCP melindungi dari virus rhinotracheitis, calicivirus, dan panleukopenia. Vaksin rabies wajib secara hukum. Vaksin non-inti seperti FeLV direkomendasikan untuk kucing outdoor atau yang kontak dengan kucing lain.",
        icon: <IconVaccine className="w-12 h-12" />,
        color: "from-blue-400 to-blue-600",
        highlights: [
          "FVRCP (Core)",
          "Rabies (Wajib)",
          "FeLV (Non-core)",
          "Konsultasi vet"
        ]
      },
      {
        title: "Jadwal Vaksinasi",
        description: "Anak kucing mulai divaksin pada usia 6-8 minggu (FVRCP pertama), diikuti booster pada 10-12 minggu dan 14-16 minggu. Vaksin rabies diberikan pada usia 16 minggu. Untuk kucing dewasa, booster FVRCP diberikan setiap 1-3 tahun.",
        icon: <IconHeartRateMonitor className="w-12 h-12" />,
        color: "from-green-400 to-green-600",
        highlights: [
          "6-8 minggu: FVRCP",
          "16 minggu: Rabies",
          "Booster rutin",
          "Evaluasi tahunan"
        ]
      },
      {
        title: "Persiapan Vaksinasi",
        description: "Sebelum vaksinasi, pastikan kucing dalam kondisi sehat dan tidak stress. Hindari kontak dengan kucing lain 1-2 minggu sebelum vaksinasi. Setelah vaksinasi, pantau reaksi seperti letargi atau bengkak di area suntikan.",
        icon: <IconStethoscope className="w-12 h-12" />,
        color: "from-purple-400 to-purple-600",
        highlights: [
          "Cek kesehatan",
          "Hindari stress",
          "Pantau reaksi",
          "Istirahat cukup"
        ]
      }
    ]
  },
  "perilaku": {
    title: "Perilaku Kucing",
    content: [
      {
        title: "Bahasa Tubuh",
        description: "Pelajari sinyal tubuh kucing: Ekor tegak berarti sapaan ramah, ekor mengibas menandakan gelisah/marah. Telinga tegak menunjukkan ketertarikan, telinga mendatar menandakan ketakutan/agresi. Mendengkur biasanya tanda nyaman, tapi bisa juga indikasi sakit.",
        icon: <IconMoodHappy className="w-12 h-12" />,
        color: "from-yellow-400 to-yellow-600",
        highlights: [
          "Posisi ekor",
          "Posisi telinga",
          "Suara & dengkuran",
          "Ekspresi wajah"
        ]
      },
      {
        title: "Sosialisasi",
        description: "Mulai sosialisasi sejak usia dini (2-7 minggu). Kenalkan dengan berbagai orang, suara, dan situasi secara bertahap. Biarkan kucing menentukan kecepatan adaptasi mereka. Gunakan hadiah dan pujian untuk pengalaman positif.",
        icon: <IconUsers className="w-12 h-12" />,
        color: "from-indigo-400 to-indigo-600",
        highlights: [
          "Usia 2-7 minggu",
          "Pengenalan bertahap",
          "Positive reinforcement",
          "Adaptasi alami"
        ]
      },
      {
        title: "Masalah Perilaku",
        description: "Atasi masalah umum seperti buang air tidak pada tempatnya (periksa kesehatan dan kebersihan kotak pasir), menggaruk perabotan (sediakan garukan yang tepat), dan agresi (identifikasi pemicu).",
        icon: <IconAlertTriangle className="w-12 h-12" />,
        color: "from-red-400 to-red-600",
        highlights: [
          "Identifikasi masalah",
          "Cek kesehatan",
          "Solusi bertahap",
          "Konsultasi ahli"
        ]
      }
    ]
  },
  "nutrisi": {
    title: "Nutrisi & Diet Kucing",
    content: [
      {
        title: "Kebutuhan Nutrisi Dasar",
        description: "Kucing adalah karnivora obligat yang membutuhkan protein hewani berkualitas tinggi. Nutrisi esensial meliputi taurine (untuk jantung dan mata), arginine, asam arakidonat, dan vitamin A.",
        icon: <IconApple className="w-12 h-12" />,
        color: "from-green-400 to-green-600",
        highlights: [
          "Protein hewani",
          "Taurine",
          "Vitamin A",
          "Asam lemak esensial"
        ]
      },
      {
        title: "Pemilihan Makanan",
        description: "Pilih makanan sesuai usia dan kondisi kucing. Wet food (kadar air 75-78%) bagus untuk hidrasi dan protein, dry food praktis dan baik untuk gigi. Baca label nutrisi: protein harus jadi bahan utama.",
        icon: <IconBowl className="w-12 h-12" />,
        color: "from-orange-400 to-orange-600",
        highlights: [
          "Wet vs Dry food",
          "Label nutrisi",
          "Sesuai usia",
          "Porsi tepat"
        ]
      },
      {
        title: "Diet Khusus",
        description: "Kucing dengan kondisi khusus memerlukan diet spesifik: obesitas (makanan rendah kalori, tinggi protein), diabetes (rendah karbohidrat), masalah ginjal (protein terkontrol), alergi (novel protein).",
        icon: <IconScale className="w-12 h-12" />,
        color: "from-blue-400 to-blue-600",
        highlights: [
          "Diet medis",
          "Kontrol kalori",
          "Protein terkontrol",
          "Alergi makanan"
        ]
      }
    ]
  }
};

export default function ModulDetailPage() {
  const params = useParams();
  const moduleId = params.id as string;
  const module = moduleContent[moduleId as keyof typeof moduleContent];
  const [activeSection, setActiveSection] = useState<number | null>(null);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">Modul tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/main/modul" className="inline-flex items-center text-neutral-600 hover:text-[#FF823C]">
            <IconArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Portal Edukasi
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          <LineShadowText shadowColor="#FF823C" className="text-neutral-800">
            {module.title}
          </LineShadowText>
        </h1>

        {/* Content */}
        <div className="space-y-8">
          {module.content.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "rounded-2xl overflow-hidden transition-all duration-300",
                activeSection === index ? "bg-white shadow-xl" : "bg-neutral-50"
              )}
            >
              <div 
                className={cn(
                  "p-6 cursor-pointer",
                  `bg-gradient-to-r ${section.color}`
                )}
                onClick={() => setActiveSection(activeSection === index ? null : index)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/90 rounded-xl p-3">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{ 
                  height: activeSection === index ? "auto" : 0,
                  opacity: activeSection === index ? 1 : 0
                }}
                className="overflow-hidden"
              >
                <div className="p-6">
                  <p className="text-lg text-neutral-600 mb-6">
                    {section.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {section.highlights.map((highlight, idx) => (
                      <div 
                        key={idx}
                        className="bg-neutral-100 rounded-lg p-4 text-center"
                      >
                        <p className="text-sm font-medium text-neutral-800">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <p className="font-medium text-orange-800">Catatan Penting</p>
            </div>
            <p className="text-sm text-orange-700">
              Informasi di atas bersifat edukatif. Selalu konsultasikan dengan dokter hewan untuk penanganan spesifik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 