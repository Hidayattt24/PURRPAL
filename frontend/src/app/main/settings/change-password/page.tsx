"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error("All fields are required");
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords don't match", {
          description: "Please make sure your new passwords match"
        });
        return;
      }

      if (formData.newPassword === formData.currentPassword) {
        throw new Error("New password must be different from current password");
      }

      // Password strength validation
      const validation = validatePassword(formData.newPassword);
      if (!validation.isValid) {
        const errors = [];
        if (validation.errors.length) errors.push("at least 8 characters");
        if (validation.errors.number) errors.push("at least one number");
        if (validation.errors.specialChar) errors.push("at least one special character");
        
        throw new Error(`Password must contain ${errors.join(", ")}`);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Send request to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully!', {
        description: 'Your password has been updated securely.'
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Redirect back to settings after a short delay
      setTimeout(() => {
        router.push('/main/settings');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password', {
        description: error instanceof Error ? error.message : 'Please check your current password and try again'
      });
    } finally {
      setIsLoading(false);
    }
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
                Password successfully changed! Redirecting...
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
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
} 