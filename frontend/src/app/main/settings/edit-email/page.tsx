"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateUserData } from "@/lib/utils/user";

export default function EditEmailPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentEmail: "",
    newEmail: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in and get current email
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

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
        setFormData(prev => ({
          ...prev,
          currentEmail: userData.email
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [router]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.newEmail || !formData.password) {
        throw new Error("All fields are required");
      }

      if (!validateEmail(formData.newEmail)) {
        throw new Error("Please enter a valid email address");
      }

      if (formData.newEmail === formData.currentEmail) {
        throw new Error("New email must be different from current email");
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Send request to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newEmail: formData.newEmail,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update email');
      }

      // Update user data in localStorage and trigger update event
      updateUserData({ email: formData.newEmail });

      setSuccess(true);

      // Redirect back to settings after a short delay
      setTimeout(() => {
        router.push('/main/settings');
      }, 2000);
    } catch (error) {
      console.error('Error updating email:', error);
      setError(error instanceof Error ? error.message : 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/main/settings"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <IconChevronLeft className="w-5 h-5" />
            <span className="ml-2 text-lg">Back to Settings</span>
          </Link>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-6">Change Email Address</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm">
                Email updated successfully! Redirecting...
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Email
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <IconMail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{formData.currentEmail}</span>
                </div>
              </div>

              <div>
                <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  id="newEmail"
                  value={formData.newEmail}
                  onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your new email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your current password"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <p>Please note:</p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>You'll need to verify your new email address</li>
                <li>Your current email will remain active until verification</li>
                <li>All notifications will be sent to the new email after verification</li>
              </ul>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Updating Email...' : 'Change Email Address'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
} 