"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { motion } from "framer-motion";
import { IconSearch, IconMapPin, IconPhone, IconClock, IconStar, IconStarFilled } from "@tabler/icons-react";

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
  map.setView(center, 13);
  return null;
}

export default function MapPage() {
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [center, setCenter] = useState<[number, number]>([-6.2088, 106.8456]);
  const [searchQuery, setSearchQuery] = useState("");

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < Math.floor(rating) ? (
          <IconStarFilled className="w-4 h-4 text-yellow-400" />
        ) : (
          <IconStar className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

  // Filter klinik berdasarkan pencarian
  const filteredClinics = veterinaryServices.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-1/3 h-full overflow-y-auto border-r border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Direktori Layanan Veteriner
          </h1>

          {/* Search */}
          <div className="relative mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari klinik atau lokasi..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Clinic List */}
          <div className="space-y-4">
            {filteredClinics.map((clinic) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedClinic?.id === clinic.id
                    ? "bg-orange-50 border-orange-500"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                } border`}
                onClick={() => {
                  setSelectedClinic(clinic);
                  setCenter(clinic.position);
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                
                <div className="flex items-center mt-2 space-x-1">
                  {renderStars(clinic.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    ({clinic.totalReviews} reviews)
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-start space-x-2">
                    <IconMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">{clinic.address}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconPhone className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600">{clinic.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconClock className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600">{clinic.openHours}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="w-2/3 h-full relative">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <ChangeView center={center} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {veterinaryServices.map((clinic) => (
              <Marker
                key={clinic.id}
                position={clinic.position}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedClinic(clinic);
                    setCenter(clinic.position);
                  },
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{clinic.name}</h3>
                    <p className="text-sm text-gray-600">{clinic.address}</p>
                    <p className="text-sm text-gray-600 mt-1">{clinic.phone}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
} 