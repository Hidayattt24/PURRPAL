"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const qaItems = [
  {
    question: "Apa itu PurrPal dan bagaimana cara kerjanya?",
    answer: "PurrPal adalah platform komunitas pecinta kucing yang dilengkapi dengan teknologi AI untuk membantu perawatan kucing. Aplikasi ini menawarkan fitur seperti asisten AI untuk deteksi kesehatan kucing, chatbot untuk konsultasi, dan fitur posting untuk berbagi pengalaman dengan komunitas.",
  },
  {
    question: "Seberapa akurat asisten AI dalam mendeteksi kesehatan kucing?",
    answer: "Asisten AI kami telah dilatih dengan data kesehatan kucing yang ekstensif dan divalidasi oleh dokter hewan profesional. Meskipun sangat membantu dalam mendeteksi masalah umum, sistem ini dirancang sebagai alat pendukung, bukan pengganti konsultasi dengan dokter hewan.",
  },
  {
    question: "Bagaimana cara menggunakan chatbot untuk konsultasi?",
    answer: "Chatbot kami dirancang untuk memberikan bantuan instan 24/7. Anda dapat mengajukan pertanyaan seputar perawatan kucing, gejala penyakit, atau tips pemeliharaan. Chatbot akan memberikan respons berdasarkan data dan pengetahuan veteriner yang telah divalidasi.",
  },
  {
    question: "Bagaimana cara menggunakan fitur posting?",
    answer: "Fitur posting memungkinkan Anda membagikan momen spesial bersama kucing kesayangan. Anda dapat mengunggah foto, menulis cerita, dan berbagi pengalaman merawat kucing. Postingan Anda akan tampil di komunitas dan dapat menginspirasi pemilik kucing lainnya. Fitur ini juga dilengkapi dengan tag dan kategori untuk memudahkan pengorganisasian konten.",
  },
  {
    question: "Apakah data kesehatan kucing saya aman?",
    answer: "Tentu saja. Kami sangat serius dalam keamanan data. Semua data kesehatan kucing Anda dienkripsi dan disimpan dengan aman mengikuti praktik terbaik industri. Anda memiliki kendali penuh atas data Anda, dan kami tidak pernah membagikan informasi pribadi tanpa persetujuan eksplisit Anda.",
  },
  {
    question: "Bagaimana jika saya membutuhkan bantuan darurat untuk kucing saya?",
    answer: "Dalam situasi darurat, PurrPal menyediakan panduan pertolongan pertama dan dapat membantu mendeteksi gejala serius melalui AI. Namun, kami selalu menyarankan untuk segera menghubungi dokter hewan terdekat untuk penanganan medis profesional.",
  },
  {
    question: "Apakah saya bisa berinteraksi dengan pemilik kucing lain di platform ini?",
    answer: "Ya! Melalui fitur posting dan komentar, Anda dapat berinteraksi dengan komunitas pecinta kucing lainnya. Anda bisa berbagi pengalaman, memberikan saran, atau sekadar berbagi cerita tentang kucing kesayangan Anda.",
  },
  {
    question: "Bagaimana cara memulai menggunakan PurrPal?",
    answer: "Cukup daftar akun di aplikasi kami, lengkapi profil Anda dan kucing Anda, dan Anda sudah bisa mengakses semua fitur. Mulailah dengan mengeksplorasi fitur AI untuk pemeriksaan kesehatan kucing, berinteraksi dengan chatbot, atau membagikan cerita pertama Anda di komunitas.",
  }
];

export function QASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-orange-50/30 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF823C] to-[#C54F0C] bg-clip-text text-transparent font-poppins">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Semua yang perlu Anda ketahui tentang PurrPal dan bagaimana platform ini dapat membantu Anda merawat kucing kesayangan
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {qaItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-neutral-800 hover:text-[#FF823C]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 