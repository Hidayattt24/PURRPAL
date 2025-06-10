"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconSearch, 
  IconMapPin, 
  IconPhone, 
  IconClock, 
  IconStar, 
  IconStarFilled,
  IconExternalLink,
  IconMapPinFilled,
  IconCalendarTime
} from "@tabler/icons-react";
import { LineShadowText } from "@/components/magicui/line-shadow-text";

// Contoh data veteriner (nanti bisa diganti dengan data dari API/database)
const veterinaryServices = [
  {
    id: 1,
    name: "Klinik Hewan Sejahtera",
    address: "Jl. Pahlawan No. 123, Jakarta Selatan",
    phone: "(021) 1234-5678",
    rating: 4.8,
    totalReviews: 156,
    openHours: "08:00 - 20:00",
    services: ["Vaksinasi", "Grooming", "Konsultasi", "UGD 24 Jam"],
    position: [-6.2088, 106.8456],
  },
  {
    id: 2,
    name: "PetCare Veterinary",
    address: "Jl. Gatot Subroto No. 45, Jakarta Pusat",
    phone: "(021) 2345-6789",
    rating: 4.6,
    totalReviews: 98,
    openHours: "09:00 - 21:00",
    services: ["Vaksinasi", "Grooming", "Operasi", "Rawat Inap"],
    position: [-6.2156, 106.8462],
  },
];

// Custom icon untuk marker
const customIcon = new Icon({
  iconUrl: "/icon/iconname.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component untuk mengatur view peta
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  }
};

export default function MapPage() {
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [center, setCenter] = useState<[number, number]>([-6.2088, 106.8456]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const shadowColor = "#FF823C";

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index < Math.floor(rating) ? (
              <IconStarFilled className="w-4 h-4 text-yellow-400" />
            ) : (
              <IconStar className="w-4 h-4 text-gray-300" />
            )}
          </motion.span>
        ))}
      </div>
    );
  };

  // Filter klinik berdasarkan pencarian
  const filteredClinics = useMemo(() => 
    veterinaryServices.filter(clinic =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30 p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          Selamat Datang di{" "}
          <LineShadowText className="italic" shadowColor={shadowColor}>
            Direktori Layanan
          </LineShadowText>
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto mt-6">
          Temukan klinik hewan terdekat untuk perawatan kucing kesayangan Anda dengan mudah dan cepat
        </p>
      </div>

      {/* Search Bar with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 max-w-2xl mx-auto"
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari klinik atau lokasi..."
          className="w-full px-4 py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
        />
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </motion.div>

      {/* Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Map Container with Glass Effect */}
        <div className="lg:col-span-2 w-full h-[600px] rounded-2xl overflow-hidden relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
          >
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="rounded-2xl z-10"
            >
              <ChangeView center={center} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <AnimatePresence>
                {veterinaryServices.map((clinic) => (
                  <Marker
                    key={clinic.id}
                    position={clinic.position as [number, number]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedClinic(clinic);
                        setCenter(clinic.position as [number, number]);
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-3 min-w-[200px]">
                        <h3 className="font-semibold text-lg mb-2">{clinic.name}</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <IconMapPin className="w-4 h-4 text-orange-500" />
                            {clinic.address}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <IconPhone className="w-4 h-4 text-orange-500" />
                            {clinic.phone}
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </AnimatePresence>
            </MapContainer>
          </motion.div>
        </div>

        {/* Scrollable Cards List */}
        <div className="h-[600px] overflow-y-auto rounded-2xl custom-scrollbar">
          <AnimatePresence>
            {filteredClinics.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl cursor-pointer mb-4 transition-all ${
                  selectedClinic?.id === clinic.id
                    ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-500"
                    : "bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200"
                } border shadow-lg`}
                onClick={() => {
                  setSelectedClinic(clinic);
                  setCenter(clinic.position as [number, number]);
                }}
              >
                {/* Clinic Name and Status */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{clinic.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Buka
                      </span>
                      <span className="text-sm text-gray-500">
                        {clinic.openHours}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rounded-xl">
                  <div className="flex-1">
                    {renderStars(clinic.rating)}
                    <span className="text-sm text-gray-600 mt-1 block">
                      {clinic.rating} ({clinic.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-500">
                      {clinic.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 block">/ 5.0</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <IconMapPinFilled className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">Alamat</p>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <IconPhone className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">Kontak</p>
                      <p className="text-sm text-gray-600">{clinic.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <IconCalendarTime className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">Jam Operasional</p>
                      <p className="text-sm text-gray-600">{clinic.openHours}</p>
                    </div>
                  </div>
                </div>

                {/* Services Tags */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Layanan Tersedia:</p>
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map((service, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full"
                      >
                        {service}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.position[0]},${clinic.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <IconMapPin className="w-4 h-4" />
                    Petunjuk Arah
                  </motion.a>
                  <motion.a
                    href={`tel:${clinic.phone}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <IconPhone className="w-4 h-4" />
                    Hubungi
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Add custom scrollbar styles to globals.css
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(style); 