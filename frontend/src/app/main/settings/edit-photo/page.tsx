"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconUpload, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Ukuran file terlalu besar. Maksimum 2MB.');
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar (JPG, PNG).');
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      try {
        validateFile(file);
        setSelectedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Terjadi kesalahan saat memilih file.');
        }
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/photo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus foto');
      }

      toast.success('Foto profil berhasil dihapus!', {
        description: 'Foto profil Anda telah dihapus.'
      });

      // Update user data in localStorage and trigger update event
      window.dispatchEvent(new CustomEvent('userDataUpdated'));

      // Redirect back to settings after a short delay
      setTimeout(() => {
        router.push('/main/settings');
      }, 2000);
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Gagal menghapus foto', {
        description: error instanceof Error ? error.message : 'Silakan coba lagi nanti'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Silakan pilih file terlebih dahulu.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto');
      }

      toast.success('Foto profil berhasil diubah!', {
        description: 'Foto profil Anda telah diperbarui.'
      });

      // Update user data in localStorage and trigger update event
      window.dispatchEvent(new CustomEvent('userDataUpdated'));

      // Redirect back to settings after a short delay
      setTimeout(() => {
        router.push('/main/settings');
      }, 2000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Gagal mengunggah foto', {
        description: error instanceof Error ? error.message : 'Silakan coba lagi nanti'
      });
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
            <span className="ml-2 text-lg">Kembali ke Pengaturan</span>
          </Link>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-6">Ubah Foto Profil</h1>
          
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
              <p>Maximum file size: 2MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 