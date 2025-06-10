"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  IconCalendarTime,
  IconMapPinFilled
} from "@tabler/icons-react";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { veterinaryServices, type VeterinaryService } from "@/lib/data/veterinaryServices";

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
    map.setView(center);
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
  const [selectedClinic, setSelectedClinic] = useState<VeterinaryService | null>(null);
  const [center, setCenter] = useState<[number, number]>([5.5718366, 95.3684017]); // Default ke Banda Aceh
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const shadowColor = "#FF823C";

  // Function to extract city name from address
  const extractCity = (address: string) => {
    // Common city identifiers in Indonesian addresses
    const cityIdentifiers = ["Kota", "Kabupaten", "Kab.", "Kota Adm."];
    
    // Split address into parts
    const parts = address.split(",").map(part => part.trim());
    
    // Look for parts containing city identifiers
    for (const part of parts) {
      for (const identifier of cityIdentifiers) {
        if (part.includes(identifier)) {
          // Remove the identifier and trim
          return part.replace(identifier, "").trim();
        }
      }
    }
    
    // If no identifier found, try to get the relevant part (usually after first comma)
    if (parts.length > 1) {
      return parts[1].trim();
    }
    
    return "";
  };

  // Close city suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Get unique cities for suggestions with count
  const citySuggestions = useMemo(() => {
    const cityCount = new Map<string, number>();
    veterinaryServices.forEach(clinic => {
      const city = extractCity(clinic.address);
      if (city) {
        cityCount.set(city, (cityCount.get(city) || 0) + 1);
      }
    });
    return Array.from(cityCount.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSearchQuery(city);
    setSelectedCity(city);
    setShowCitySuggestions(false);
  };

  // Filter klinik berdasarkan pencarian
  const filteredClinics = useMemo(() => {
    if (!searchQuery) return veterinaryServices;
    
    const query = searchQuery.toLowerCase();
    return veterinaryServices.filter(clinic => {
      const cityName = extractCity(clinic.address).toLowerCase();
      return clinic.name.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query) ||
        cityName.includes(query) ||
        clinic.services.some(service => 
          service.toLowerCase().includes(query)
        );
    });
  }, [searchQuery]);

  const handleClinicSelect = (clinic: VeterinaryService) => {
    setSelectedClinic(clinic);
    setCenter(clinic.position);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30 p-6">
      <div className="text-center mb-8">
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

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-[400px] rounded-2xl overflow-hidden relative mb-8"
      >
        <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="rounded-2xl z-10 [&_.leaflet-tile-pane]:brightness-[1.02] [&_.leaflet-control-zoom]:!bg-white/80 [&_.leaflet-control-zoom]:!backdrop-blur-sm [&_.leaflet-control-zoom]:!border-none [&_.leaflet-control-zoom]:!shadow-lg"
          >
            <ChangeView center={center} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="brightness-105 contrast-[0.95] saturate-[0.85]"
            />
            <AnimatePresence>
              {filteredClinics.map((clinic) => (
                <Marker
                  key={clinic.id}
                  position={clinic.position}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleClinicSelect(clinic),
                  }}
                >
                  <Popup className="rounded-xl overflow-hidden [&_.leaflet-popup-content-wrapper]:!rounded-xl [&_.leaflet-popup-content-wrapper]:!p-0 [&_.leaflet-popup-content]:!m-0 [&_.leaflet-popup-tip-container]:!hidden">
                    <div className="p-4 min-w-[250px] bg-white">
                      <h3 className="font-semibold text-lg mb-3">{clinic.name}</h3>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <IconMapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="flex-1">{clinic.address}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <IconPhone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="flex-1">{clinic.phone}</span>
                        </p>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <motion.a
                            href={clinic.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                          >
                            <IconMapPin className="w-4 h-4" />
                            Petunjuk Arah
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </AnimatePresence>
          </MapContainer>
        </div>
      </motion.div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div 
          ref={searchRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowCitySuggestions(true);
              }}
              onFocus={() => setShowCitySuggestions(true)}
              placeholder="Cari klinik, kota, atau layanan..."
              className="w-full px-4 py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
            />
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Enhanced City Suggestions Dropdown */}
          <AnimatePresence>
            {showCitySuggestions && searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {citySuggestions
                    .filter(({ city }) => 
                      city.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(({ city, count }, index) => (
                      <motion.div
                        key={city}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleCitySelect(city)}
                        className={`
                          flex items-center justify-between px-4 py-3 cursor-pointer
                          ${selectedCity === city ? 'bg-orange-50' : 'hover:bg-gray-50'}
                          transition-colors duration-200
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <IconMapPinFilled className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-700">{city}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {count} klinik
                        </span>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Search tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-500 text-center space-y-1"
        >
          <p>Cari berdasarkan: nama klinik, kota, atau layanan</p>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            >
              <IconMapPinFilled className="w-4 h-4" />
              <span>Menampilkan hasil untuk: {selectedCity}</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Clinic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedClinic?.id === clinic.id
                    ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-500"
                    : "bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200"
                } border shadow-lg`}
                onClick={() => handleClinicSelect(clinic)}
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
                    href={clinic.googleMapUrl}
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
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="col-span-full flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <IconMapPin className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak Ada Hasil
              </h3>
              <p className="text-gray-600 max-w-md">
                Maaf, kami tidak dapat menemukan klinik yang sesuai dengan pencarian Anda. 
                Coba gunakan kata kunci yang berbeda atau perluas area pencarian Anda.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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