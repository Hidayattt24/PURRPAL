"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconMail } from "@tabler/icons-react";
import Link from "next/link";

export default function EditEmailPage() {
  const [formData, setFormData] = useState({
    currentEmail: "dwight@dundermifflin.com",
    newEmail: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess(false);

    // Basic validation
    if (!formData.newEmail || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(formData.newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.newEmail === formData.currentEmail) {
      setError("New email must be different from current email");
      return;
    }

    // Handle email change here
    console.log("Email change submitted:", formData);
    setSuccess(true);
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
                Email change request has been sent. Please check your new email for verification.
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors"
            >
              Change Email Address
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
} 