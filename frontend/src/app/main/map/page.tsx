// frontend/src/app/main/map/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconSearch, IconFilter, IconMapPin, IconListDetails } from '@tabler/icons-react';
import GoogleMapsVet from '@/components/ui/GoogleMapsVet';

interface UserLocation {
  lat: number;
  lng: number;
}

interface VetService {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  openHours: string;
  services: string[];
  position: [number, number];
  googleMapUrl: string;
  distance?: number;
}

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(false);

  // Get Google Maps API key from environment
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Uncomment if you want to redirect to login
      // router.push('/auth/login');
    }
  }, []);

  const handleLocationUpdate = (location: UserLocation) => {
    setUserLocation(location);
  };

  const filterOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'clinic', label: 'Veterinary Clinics' },
    { value: 'grooming', label: 'Grooming Services' },
    { value: 'petshop', label: 'Pet Shops' },
    { value: 'emergency', label: 'Emergency Care' }
  ];

  if (!googleMapsApiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Google Maps API Key Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please add your Google Maps API key to environment variables.
          </p>
          <div className="bg-gray-100 p-3 rounded text-sm text-left">
            <p className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here</p>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                🏥 Veterinary Services
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Find the best veterinary care for your beloved pets
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search veterinary services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <IconFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    viewMode === 'map'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconMapPin className="w-4 h-4" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconListDetails className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Location Info */}
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-blue-700">
              <IconMapPin className="w-5 h-5" />
              <span className="font-medium">Your Location Detected</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Latitude: {userLocation.lat.toFixed(6)}, Longitude: {userLocation.lng.toFixed(6)}
            </p>
            <p className="text-blue-600 text-sm">
              Showing veterinary services sorted by distance from your location
            </p>
          </motion.div>
        )}

        {/* Google Maps Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <GoogleMapsVet
            apiKey={googleMapsApiKey}
            center={{ lat: 5.5577, lng: 95.3220 }} // Default to Banda Aceh
            zoom={12}
            onLocationUpdate={handleLocationUpdate}
          />
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">🩺</span>
              </div>
              <h3 className="font-semibold text-gray-800">Emergency Care</h3>
            </div>
            <p className="text-sm text-gray-600">
              24/7 emergency veterinary services available at selected clinics.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📱</span>
              </div>
              <h3 className="font-semibold text-gray-800">Easy Booking</h3>
            </div>
            <p className="text-sm text-gray-600">
              Call directly or visit their website to book appointments.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-800">Verified Reviews</h3>
            </div>
            <p className="text-sm text-gray-600">
              All ratings and reviews are from verified pet owners.
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6 border border-orange-200"
        >
          <h3 className="font-semibold text-gray-800 mb-3">How to Use:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Click "Find Nearby Vets" to get your current location and show the nearest veterinary services.</span>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Click on map markers to see detailed information about each veterinary service.</span>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Use the search radius dropdown to adjust the search area (5-20 km).</span>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>Click "Get Directions" in the info window to open navigation in Google Maps.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}