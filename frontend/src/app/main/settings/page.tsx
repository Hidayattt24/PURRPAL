"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconChevronRight, IconEdit, IconLock, IconMail, IconBell } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                  <Image
                    src="/main/home/placeholder-avatar.jpg"
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <Link href="/main/map/edit-photo">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg"
                  >
                    <IconEdit className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
              <h2 className="text-xl font-semibold mt-4">Dwight Schrute</h2>
              <p className="text-gray-500 text-sm">UX | Product Designer</p>
              <p className="text-gray-500 text-sm mt-1">Scranton, Pennsylvania</p>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Account</h3>
            <div className="space-y-4">
              <Link href="/main/map/edit-profile">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <IconEdit className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="font-medium">Edit Profile</span>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              </Link>

              <Link href="/main/map/change-password">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <IconLock className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="font-medium">Change Password</span>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              </Link>

              <Link href="/main/map/edit-email">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <IconMail className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Email</span>
                      <span className="text-sm text-gray-500">dwight@dundermifflin.com</span>
                    </div>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors"
          >
            Log Out
          </motion.button>
        </div>
      </div>
    </div>
  );
} 