"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  IconMapPin,
  IconMap2,
  IconStethoscope,
  IconClock,
  IconStar,
} from "@tabler/icons-react"
import GoogleMapsVet from "@/components/ui/GoogleMapsVet"
import { LineShadowText } from "@/components/magicui/line-shadow-text"

interface UserLocation {
  lat: number
  lng: number
}

interface VetService {
  id: number
  name: string
  address: string
  phone: string
  rating: number
  totalReviews: number
  openHours: string
  services: string[]
  position: [number, number]
  googleMapUrl: string
  distance?: number
}

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const shadowColor = "#FF823C"

  // Get Google Maps API key from environment
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      // Uncomment if you want to redirect to login
      // router.push('/auth/login');
    }
  }, [])

  const handleLocationUpdate = (location: UserLocation) => {
    setUserLocation(location)
  }

  if (!googleMapsApiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-red-100 max-w-md w-full mx-4"
        >
          <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🗺️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Maps Configuration Required</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Please add your Google Maps API key to environment variables to enable map functionality.
          </p>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-left font-mono overflow-x-auto">
            <p className="text-gray-700">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            Get your API key from{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#FF823C 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-20"
        />

        <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
          {/* Main Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-orange-500 rounded-2xl">
                <IconMap2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-none tracking-tighter mb-4 sm:mb-6 px-2">
              Find Veterinary Care with{" "}
              <LineShadowText className="italic" shadowColor={shadowColor}>
                PurrPal
              </LineShadowText>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover trusted veterinary services near you with real-time information and expert care for your beloved
              pets
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-6 sm:pb-8">
        {/* Location Status Card */}
        <AnimatePresence>
          {userLocation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-3 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <IconMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Location Detected</h3>
                  <p className="text-xs sm:text-sm text-blue-600">
                    Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600">
                    Showing veterinary services sorted by distance from your location
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Maps Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 h-[400px] sm:h-[500px] md:h-[600px]"
        >
          <GoogleMapsVet
            apiKey={googleMapsApiKey}
            center={{ lat: 5.5577, lng: 95.322 }} // Default to Banda Aceh
            zoom={12}
            onLocationUpdate={handleLocationUpdate}
          />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                <IconStethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Emergency Care</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              24/7 emergency veterinary services available at selected clinics with immediate response.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <IconClock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Real-time Hours</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Live operating hours and availability status updated directly from Google Places.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                <IconStar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Verified Reviews</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Authentic ratings and reviews from verified pet owners and Google users.
            </p>
          </div>
        </motion.div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8 bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl p-4 sm:p-8 border border-orange-200"
        >
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">How to Use PurrPal Maps</h3>
            <p className="text-sm sm:text-base text-gray-600">Follow these simple steps to find the best veterinary care</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Enable Location</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Click "Find Nearby Vets" to get your current location and show nearest services.
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Explore Markers</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Click on map markers to see detailed information about each veterinary service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Adjust Search</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Use the search radius dropdown to adjust the search area (5-20 km).
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3">
                4
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Get Directions</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Click "Get Directions" in the info window to open navigation in Google Maps.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
