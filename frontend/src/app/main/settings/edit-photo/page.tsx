"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconUpload, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EditPhotoPage() {
  const router = useRouter();
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch user profile to get current photo
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
        setCurrentPhoto(userData.avatar_url);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [router]);

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return "File type not supported. Please upload a JPG, PNG, GIF, or WebP file.";
    }

    if (file.size > maxSize) {
      return "File size too large. Maximum size is 5MB.";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Update profile with null avatar_url
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatar_url: null })
      });

      if (!response.ok) {
        throw new Error('Failed to remove photo');
      }

      setPreviewUrl(null);
      setCurrentPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Update local storage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        localStorage.setItem('user', JSON.stringify({
          ...parsedUser,
          avatar_url: null
        }));
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      setError('Failed to remove photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!previewUrl) return;

    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        throw new Error('No file selected');
      }

      // Create form data
      const formData = new FormData();
      formData.append('photo', file);

      // Upload photo
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      // Update local storage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        localStorage.setItem('user', JSON.stringify({
          ...parsedUser,
          avatar_url: data.avatar_url
        }));
      }

      // Redirect back to settings
      router.push('/main/settings');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload photo');
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

        {/* Photo Upload Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-6">Change Profile Photo</h1>
          
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Current/Preview Photo */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-4">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={currentPhoto || "/main/home/placeholder-avatar.jpg"}
                    alt="Current"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />

              <motion.button
                onClick={handleUploadClick}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <IconUpload className="w-5 h-5" />
                {isLoading ? 'Uploading...' : 'Upload New Photo'}
              </motion.button>

              {previewUrl && (
                <motion.button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Photo'}
                </motion.button>
              )}

              {(currentPhoto || previewUrl) && (
                <motion.button
                  onClick={handleRemovePhoto}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-red-100 text-red-600 rounded-2xl font-medium hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <IconTrash className="w-5 h-5" />
                  {isLoading ? 'Removing...' : 'Remove Photo'}
                </motion.button>
              )}
            </div>

            <div className="text-sm text-gray-500 text-center">
              <p>Supported formats: JPG, PNG, GIF, WebP</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 