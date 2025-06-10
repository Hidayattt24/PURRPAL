"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return {
      isValid: hasNumber && hasSpecialChar && hasMinLength,
      errors: {
        number: !hasNumber,
        specialChar: !hasSpecialChar,
        length: !hasMinLength
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess(false);

    // Basic validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setError("New password must be different from current password");
      return;
    }

    // Password strength validation
    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      const errors = [];
      if (validation.errors.length) errors.push("at least 8 characters");
      if (validation.errors.number) errors.push("at least one number");
      if (validation.errors.specialChar) errors.push("at least one special character");
      
      setError(`Password must contain ${errors.join(", ")}`);
      return;
    }

    // If all validations pass
    setSuccess(true);
    // Handle password change here
    console.log("Password change submitted:", formData);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
          <h1 className="text-2xl font-semibold mb-6">Change Password</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm">
                Password successfully changed!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.current ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.new ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.confirm ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character</li>
              </ul>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors"
            >
              Change Password
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
} 