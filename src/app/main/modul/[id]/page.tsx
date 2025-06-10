"use client";

import { motion } from "framer-motion";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const moduleContent = {
  "pencegahan-penyakit": {
    title: "Pencegahan Penyakit Kucing",
    content: [
      {
        title: "Vaksinasi Rutin",
        description: `Vaksinasi adalah langkah krusial dalam mencegah penyakit serius pada kucing. Vaksin inti yang diperlukan termasuk FVRCP (melindungi dari Feline Viral Rhinotracheitis, Calicivirus, dan Panleukopenia) dan Rabies. Untuk kucing dengan risiko tinggi, vaksin tambahan seperti FeLV (Feline Leukemia Virus) juga direkomendasikan.`,
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/vaksinasi.jpg"
              alt="Vaksinasi Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Kebersihan dan Sanitasi",
        description: `Menjaga kebersihan adalah kunci pencegahan penyakit. Bersihkan kotak pasir setiap hari dan ganti seluruh pasir setiap 1-2 minggu. Cuci tempat makan dan minum setiap hari dengan air hangat dan sabun. Sediakan area tidur yang bersih dan nyaman, serta rutin membersihkan area bermain dan peralatan kucing.`,
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/kebersihan.jpg"
              alt="Kebersihan Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Pemeriksaan Rutin",
        description: `Kunjungi dokter hewan setidaknya 1-2 kali setahun untuk pemeriksaan menyeluruh. Pemeriksaan meliputi kondisi gigi dan mulut, berat badan, pemeriksaan parasit, dan evaluasi perilaku. Untuk kucing senior (7 tahun ke atas), pemeriksaan disarankan setiap 6 bulan.`,
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/checkup.jpg"
              alt="Pemeriksaan Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      }
    ]
  },
  "perawatan-dasar": {
    title: "Perawatan Dasar Kucing",
    content: [
      {
        title: "Grooming",
        description: `Sikat bulu kucing 2-3 kali seminggu untuk kucing berbulu pendek, dan setiap hari untuk kucing berbulu panjang. Gunakan sisir yang sesuai dengan jenis bulu. Potong kuku setiap 2-3 minggu dan bersihkan telinga secara berkala dengan pembersih khusus kucing. Mandikan kucing hanya jika diperlukan karena kucing umumnya dapat membersihkan diri sendiri.`,
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/grooming.jpg"
              alt="Grooming Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Kebutuhan Dasar",
        description: `Sediakan perlengkapan esensial: tempat makan dan minum terpisah yang selalu bersih, kotak pasir dengan lokasi yang mudah diakses (1 kotak per kucing + 1 tambahan), tempat tidur yang nyaman, mainan untuk stimulasi mental, dan garukan untuk merawat kuku. Pastikan area aktivitas aman dan cukup luas untuk kucing beraktivitas.`,
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/kebutuhan.jpg"
              alt="Kebutuhan Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Aktivitas dan Bermain",
        description: `Luangkan waktu minimal 10-15 menit, 2 kali sehari untuk bermain dengan kucing. Gunakan mainan interaktif seperti tongkat dengan tali dan bulu-buluan, bola kecil, atau laser pointer. Sediakan tempat memanjat atau cat tree untuk aktivitas vertikal. Rotasi mainan secara berkala untuk menghindari kebosanan.`,
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/bermain.jpg"
              alt="Aktivitas Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      }
    ]
  },
  "vaksinasi": {
    title: "Vaksinasi Kucing",
    content: [
      {
        title: "Jenis-jenis Vaksin",
        description: "Vaksin inti (core vaccines) wajib untuk semua kucing: FVRCP melindungi dari virus rhinotracheitis, calicivirus, dan panleukopenia. Vaksin rabies wajib secara hukum. Vaksin non-inti seperti FeLV direkomendasikan untuk kucing outdoor atau yang kontak dengan kucing lain. Konsultasikan dengan dokter hewan untuk program vaksinasi yang sesuai.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/jenis-vaksin.jpg"
              alt="Jenis Vaksin"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Jadwal Vaksinasi",
        description: "Anak kucing mulai divaksin pada usia 6-8 minggu (FVRCP pertama), diikuti booster pada 10-12 minggu dan 14-16 minggu. Vaksin rabies diberikan pada usia 16 minggu. Untuk kucing dewasa, booster FVRCP diberikan setiap 1-3 tahun dan rabies setiap 1-3 tahun, tergantung jenis vaksin dan regulasi lokal.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/jadwal-vaksin.jpg"
              alt="Jadwal Vaksinasi"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Persiapan Vaksinasi",
        description: "Sebelum vaksinasi, pastikan kucing dalam kondisi sehat dan tidak stress. Hindari kontak dengan kucing lain 1-2 minggu sebelum vaksinasi. Setelah vaksinasi, pantau reaksi seperti letargi atau bengkak di area suntikan. Berikan makanan dan minuman normal, dan hindari aktivitas berlebihan 24 jam pasca vaksinasi.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/persiapan-vaksin.jpg"
              alt="Persiapan Vaksinasi"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      }
    ]
  },
  "perilaku": {
    title: "Perilaku Kucing",
    content: [
      {
        title: "Bahasa Tubuh",
        description: "Pelajari sinyal tubuh kucing: Ekor tegak berarti sapaan ramah, ekor mengibas menandakan gelisah/marah. Telinga tegak menunjukkan ketertarikan, telinga mendatar menandakan ketakutan/agresi. Mendengkur biasanya tanda nyaman, tapi bisa juga indikasi sakit. Menggesekkan tubuh adalah cara menandai teritori dan menunjukkan afeksi.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/bahasa-tubuh.jpg"
              alt="Bahasa Tubuh Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Sosialisasi",
        description: "Mulai sosialisasi sejak usia dini (2-7 minggu). Kenalkan dengan berbagai orang, suara, dan situasi secara bertahap. Biarkan kucing menentukan kecepatan adaptasi mereka. Gunakan hadiah dan pujian untuk pengalaman positif. Sediakan tempat aman untuk bersembunyi saat merasa terancam. Untuk kucing dewasa, proses sosialisasi mungkin membutuhkan waktu lebih lama.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/sosialisasi.jpg"
              alt="Sosialisasi Kucing"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Masalah Perilaku",
        description: "Atasi masalah umum seperti buang air tidak pada tempatnya (periksa kesehatan dan kebersihan kotak pasir), menggaruk perabotan (sediakan garukan yang tepat), dan agresi (identifikasi pemicu). Enrichment lingkungan dan konsistensi dalam pelatihan sangat penting. Untuk masalah serius, konsultasikan dengan behaviorist kucing.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/masalah-perilaku.jpg"
              alt="Masalah Perilaku"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      }
    ]
  },
  "nutrisi": {
    title: "Nutrisi & Diet Kucing",
    content: [
      {
        title: "Kebutuhan Nutrisi Dasar",
        description: "Kucing adalah karnivora obligat yang membutuhkan protein hewani berkualitas tinggi. Nutrisi esensial meliputi taurine (untuk jantung dan mata), arginine, asam arakidonat, dan vitamin A. Pastikan makanan kucing mengandung minimal 26% protein untuk dewasa dan 30% untuk anak kucing. Air segar harus selalu tersedia karena kucing rentan dehidrasi.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/nutrisi-dasar.jpg"
              alt="Nutrisi Dasar"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Pemilihan Makanan",
        description: "Pilih makanan sesuai usia dan kondisi kucing. Wet food (kadar air 75-78%) bagus untuk hidrasi dan protein, dry food praktis dan baik untuk gigi. Baca label nutrisi: protein harus jadi bahan utama. Hindari makanan dengan banyak pengisi (fillers) atau by-product. Porsi makan disesuaikan dengan berat badan ideal, dibagi 2-3 kali sehari.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/makanan-kucing.jpg"
              alt="Pemilihan Makanan"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      },
      {
        title: "Diet Khusus",
        description: "Kucing dengan kondisi khusus memerlukan diet spesifik: obesitas (makanan rendah kalori, tinggi protein), diabetes (rendah karbohidrat), masalah ginjal (protein terkontrol), alergi (novel protein), dan lansia (mudah dicerna, antioksidan tinggi). Selalu konsultasikan perubahan diet dengan dokter hewan.",
        content: (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/main/modul/diet-khusus.jpg"
              alt="Diet Khusus"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ),
      }
    ]
  }
};

export default function ModulDetailPage() {
  const params = useParams();
  const moduleId = params.id as string;
  const module = moduleContent[moduleId as keyof typeof moduleContent];
  const [activeCard, setActiveCard] = useState(0);

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
        <div className="space-y-16">
          {module.content.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-2xl",
                index % 2 === 0 ? "bg-orange-50" : "bg-blue-50"
              )}
            >
              {/* Text Content */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                  {section.title}
                </h2>
                <p className="text-lg text-neutral-600">
                  {section.description}
                </p>
              </div>

              {/* Image Content */}
              <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16">
          <p className="text-sm text-neutral-600 text-center px-6 py-4 bg-neutral-100 rounded-lg">
            Informasi di atas bersifat edukatif. Selalu konsultasikan dengan dokter hewan untuk penanganan spesifik.
          </p>
        </div>
      </div>
    </div>
  );
} 