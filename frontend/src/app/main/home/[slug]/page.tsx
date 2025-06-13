"use client";

import { useState, useEffect } from "react";
import { IconArrowLeft, IconCamera, IconMapPin, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateStoryPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{
    name: string;
    address: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use our proxy endpoint instead of calling Nominatim directly
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/location/reverse-geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch location details');
            }
            
            const data = await response.json();
            
            setLocation({
              name: data.display_name.split(',')[0],
              address: data.display_name
            });
            toast.success('Location added successfully');
          } catch (error) {
            console.error("Error getting location details:", error);
            toast.error('Failed to get location details', {
              description: 'Using coordinates as fallback'
            });
            // Fallback to coordinates if geocoding fails
            setLocation({
              name: "Current Location",
              address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error('Unable to get your location', {
            description: 'Please check your location permissions and try again'
          });
        }
      );
    } else {
      toast.error('Location services unavailable', {
        description: 'Your browser does not support location services'
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('content', message);
      
      if (location) {
        formData.append('location', JSON.stringify(location));
      }
      
      if (imageFile) {
        formData.append('photo', imageFile);
      }

      console.log('Submitting story with:', {
        content: message,
        hasLocation: !!location,
        hasImage: !!imageFile
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create story');
      }

      // Show success notification
      toast.success('Story shared successfully!', {
        description: 'Your story has been posted to the community.',
      });

      // Redirect to home page after successful creation
      router.push('/main/home');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to share story', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/main/home" className="text-neutral-600 hover:text-neutral-800">
            <IconArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-medium">Ceritakan Kisahmu</h1>
          <button 
            className="px-4 py-2 bg-[#FF823C] text-white rounded-full text-sm font-medium disabled:opacity-50"
            disabled={!message || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Membagikan...' : 'Bagikan'}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <div className="space-y-6">
          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Ceritamu:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bagikan ceritamu..."
              className="w-full h-40 px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] placeholder:text-neutral-400 resize-none"
            />
          </div>

          {/* Location and Image Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-neutral-700">Tambahkan Lokasiku (Opsional):</label>
            
            {location ? (
              <div className="space-y-4">
                {/* Location Display */}
                <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <IconMapPin className="w-5 h-5 text-[#FF823C] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{location.name}</p>
                    <p className="text-xs text-neutral-600">{location.address}</p>
                  </div>
                  <button
                    onClick={() => setLocation(null)}
                    className="p-1 hover:bg-neutral-200 rounded-full"
                  >
                    <IconX className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#FF823C] transition-colors"
              >
                <IconMapPin className="w-5 h-5 text-[#FF823C]" />
                <span className="text-sm text-neutral-600">Tambahkan lokasi saat ini</span>
              </button>
            )}

            {/* Photo Upload Section */}
            <div className="mt-4">
              <label className="text-sm font-medium text-neutral-700 block mb-2">Tambahkan Foto:</label>
              {selectedImage ? (
                <div className="relative w-full rounded-xl overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Terpilih"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="block w-full border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#FF823C] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <IconCamera className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                  <p className="text-sm text-neutral-600">Klik untuk mengunggah foto</p>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 