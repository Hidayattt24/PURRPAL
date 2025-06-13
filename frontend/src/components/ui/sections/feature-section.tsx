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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF823C] to-[#C54F0C] bg-clip-text text-transparent font-poppins">Fitur Lengkap untuk Pembelajaran Anda</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Berbagai fitur canggih dan inovatif untuk mendukung proses pembelajaran Anda dengan cara yang lebih interaktif dan efektif
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* AI Learning Assistant - Large Card */}
          <div className="col-span-12 md:col-span-7">
            <BentoCard
              className="h-full"
              title="Asisten Pembelajaran AI"
              description="Dapatkan bantuan pembelajaran personal dengan AI canggih yang dapat membantu Anda memahami materi dengan lebih baik dan menjawab pertanyaan Anda secara real-time."
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
            {/* Chatbot Support */}
            <BentoCard
              title="Chatbot Pembelajaran Interaktif"
              description="Belajar menjadi lebih menyenangkan dengan chatbot pintar yang siap membantu Anda 24/7. Tanyakan apa saja tentang materi pembelajaran Anda."
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

            {/* Interactive Modules */}
            <BentoCard
              title="Modul Pembelajaran Interaktif"
              description="Akses berbagai modul pembelajaran yang dirancang secara interaktif untuk memudahkan pemahaman materi. Dilengkapi dengan latihan dan evaluasi."
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
            {/* Post Feature */}
            <BentoCard
              className="h-full"
              title="Fitur Posting Kucing"
              description="Bagikan momen spesial bersama kucing kesayangan Anda. Posting foto, cerita, dan pengalaman merawat kucing untuk menginspirasi komunitas pecinta kucing lainnya."
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
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
              }
            />
          </div>

          {/* Map Feature - Wide Card */}
          <div className="col-span-12 md:col-span-8">
            <BentoCard
              className="h-full"
              title="Peta Pembelajaran Interaktif"
              description="Visualisasikan perjalanan pembelajaran Anda dengan peta interaktif. Temukan koneksi antar materi dan rencanakan rute belajar yang optimal untuk mencapai tujuan Anda."
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