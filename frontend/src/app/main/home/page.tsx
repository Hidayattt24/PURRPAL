"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { LineShadowText } from "@/components/magicui/line-shadow-text"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { ChevronRight, MapPin, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

// Define the custom event type
declare global {
  interface WindowEventMap {
    userDataUpdated: CustomEvent<any>
  }
}

export default function HomePage() {
  const [isCreatingStory, setIsCreatingStory] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [stories, setStories] = useState([])
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const shadowColor = resolvedTheme === "dark" ? "white" : "#FF823C"

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const userData = await response.json()
      setUser(userData)

      // Update localStorage with fresh data
      localStorage.setItem("user", JSON.stringify(userData))

      return userData
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  const fetchStories = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch stories")

      const data = await response.json()
      setStories(data)
    } catch (error) {
      console.error("Error fetching stories:", error)
    }
  }

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Initial fetch of user data and stories
    fetchUserProfile(token)
    fetchStories(token)

    // Listen for user data updates
    const handleUserDataUpdate = (event: CustomEvent<any>) => {
      fetchUserProfile(token)
    }

    window.addEventListener("userDataUpdated", handleUserDataUpdate)

    // Cleanup event listener
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate)
    }
  }, [router])

  // Refresh data periodically
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const refreshInterval = setInterval(() => {
      fetchUserProfile(token)
      fetchStories(token)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20">
      {/* Header Section */}
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
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 left-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20"
        />

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={user?.avatar_url || "/main/home/placeholder-avatar.jpg"}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800">
                  Selamat datang kembali, <span className="text-[#FF823C]">{user?.username || "Pengguna"}</span>
                </h1>
                <p className="text-neutral-600">{user?.full_name}</p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="text-right">
              <div className="text-sm text-neutral-500">Hari ini</div>
              <div className="text-lg font-semibold text-neutral-800">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Create Story CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-semibold leading-none tracking-tighter mb-6">
            Bagikan Perjalananmu dengan{" "}
            <LineShadowText className="italic" shadowColor={shadowColor}>
              PurrPal
            </LineShadowText>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Terhubung dengan sesama pecinta kucing, bagikan pengalamanmu, dan temukan cerita menarik dari komunitas kami
          </p>

          <Link href="/main/home/create">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative mx-auto inline-flex items-center justify-center rounded-full px-8 py-4 shadow-[inset_0_-8px_10px_#ff823c1f] transition-all duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#ff823c3f]"
            >
              <span
                className={cn(
                  "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#FF823C]/50 via-[#C54F0C]/50 to-[#FF823C]/50 bg-[length:300%_100%] p-[1px]",
                )}
                style={{
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              <AnimatedGradientText className="text-lg font-semibold">✨ Buat Ceritamu</AnimatedGradientText>
              <ChevronRight className="ml-2 size-5 stroke-[#FF823C] transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">Cerita Komunitas</h3>
            <p className="text-neutral-600">Temukan cerita menarik dari komunitas pecinta kucing kami</p>
          </div>

          <div className="relative w-full py-10 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-3xl overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10"></div>

            <div className="mb-8">
              <InfiniteMovingCards items={stories} direction="left" speed="fast" className="py-4" />
            </div>
            <div>
              <InfiniteMovingCards items={[...stories].reverse()} direction="right" speed="fast" className="py-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <Link href="/main/home/create">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-6 md:right-12 w-14 h-14 bg-gradient-to-br from-[#FF823C] to-[#C54F0C] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all z-40"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </Link>

      {/* Create Story Modal */}
      <AnimatePresence>
        {isCreatingStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-800">Buat Cerita Baru</h3>
                <button
                  onClick={() => setIsCreatingStory(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Apa yang ingin kamu bagikan?"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent"
                />
                <textarea
                  placeholder="Ceritakan pengalamanmu..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent min-h-[120px] resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsCreatingStory(false)}
                    className="px-6 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                  >
                    Batal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gradient-to-r from-[#FF823C] to-[#C54F0C] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Bagikan Cerita
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
