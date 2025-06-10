"use client";

import { useState } from "react";
import { IconArrowLeft, IconCamera, IconMapPin, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function CreateStoryPage() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    name: string;
    address: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to get current location and handle it
  const handleAddLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Here you would typically make an API call to reverse geocode the coordinates
            // For demo purposes, we'll just set a default location
            setLocation({
              name: "Current Location",
              address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
            });

            // Here you could also update the selectedImage based on the location
            // For example, fetch a photo of the location or use street view
            // For now, we'll just use a placeholder
            if (!selectedImage) {
              setSelectedImage("/main/home/placeholder-activity.jpg");
            }
          } catch (error) {
            console.error("Error getting location details:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please try again.");
        }
      );
    } else {
      alert("Location services are not available in your browser.");
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
          <h1 className="text-lg font-medium">Tell Your Story</h1>
          <button 
            className="px-4 py-2 bg-[#FF823C] text-white rounded-full text-sm font-medium disabled:opacity-50"
            disabled={!message || !recipient}
          >
            Share
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <div className="space-y-6">
          {/* Recipient Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">To:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Who is this story for?"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] placeholder:text-neutral-400"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Your Story:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your story..."
              className="w-full h-40 px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] placeholder:text-neutral-400 resize-none"
            />
          </div>

          {/* Location and Image Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-neutral-700">Add My Location (Optional):</label>
            
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
                    onClick={() => {
                      setLocation(null);
                      if (!selectedImage) setSelectedImage(null);
                    }}
                    className="p-1 hover:bg-neutral-200 rounded-full"
                  >
                    <IconX className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {/* Location Image */}
                {selectedImage && (
                  <div className="relative w-full rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Location"
                      className="w-full h-auto max-h-[300px] object-contain"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                    >
                      <IconX className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAddLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#FF823C] transition-colors"
              >
                <IconMapPin className="w-5 h-5 text-[#FF823C]" />
                <span className="text-sm text-neutral-600">Add my current location</span>
              </button>
            )}

            {/* Manual Image Upload (if no location) */}
            {!location && (
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-700 block mb-2">Or Add a Photo:</label>
                <label className="block w-full border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#FF823C] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <IconCamera className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                  <p className="text-sm text-neutral-600">Click to upload a photo</p>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 