"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconUpload, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

export default function EditPhotoPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return "File type not supported. Please upload a JPG, PNG, or GIF file.";
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

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
                    src="/main/home/placeholder-avatar.jpg"
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
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />

              <motion.button
                onClick={handleUploadClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <IconUpload className="w-5 h-5" />
                Upload New Photo
              </motion.button>

              {previewUrl && (
                <motion.button
                  onClick={handleRemovePhoto}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-red-100 text-red-600 rounded-2xl font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <IconTrash className="w-5 h-5" />
                  Remove Photo
                </motion.button>
              )}
            </div>

            <div className="text-sm text-gray-500 text-center">
              <p>Supported formats: JPG, PNG, GIF</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 