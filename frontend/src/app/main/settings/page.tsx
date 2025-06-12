"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronRight, IconEdit, IconLock, IconMail, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Dialog from '@radix-ui/react-dialog';
import Cookies from 'js-cookie';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Listen for user data updates
    const handleUserDataUpdate = (event: CustomEvent<any>) => {
      setUser(event.detail);
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();

    // Cleanup event listener
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, [router]);

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    Cookies.remove('token');
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30 p-4 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>;
  }

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
                    src={user.avatar_url || "/main/home/placeholder-avatar.jpg"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <Link href="/main/settings/edit-photo">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg"
                  >
                    <IconEdit className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
              <h2 className="text-xl font-semibold mt-4">{user.full_name}</h2>
              <p className="text-gray-500 text-sm">{user.role}</p>
              <p className="text-gray-500 text-sm mt-1">{user.location}</p>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Account</h3>
            <div className="space-y-4">
              <Link href="/main/settings/edit-profile">
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

              <Link href="/main/settings/change-password">
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

              <Link href="/main/settings/edit-email">
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
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Logout Button */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <IconLogout className="w-5 h-5" />
                Log Out
              </motion.button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl">
                <Dialog.Title className="text-xl font-semibold">
                  Confirm Logout
                </Dialog.Title>
                <Dialog.Description className="text-gray-600">
                  Are you sure you want to log out of your account?
                </Dialog.Description>

                <div className="flex gap-4 mt-4">
                  <Dialog.Close asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </Dialog.Close>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Log Out
                  </motion.button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
} 