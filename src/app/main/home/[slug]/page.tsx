"use client";

import { useState } from "react";
import { IconArrowLeft, IconCamera, IconSearch, IconBrandSpotify, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function CreateStoryPage() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearchingSong, setIsSearchingSong] = useState(false);
  const [selectedSong, setSelectedSong] = useState<{
    title: string;
    artist: string;
    image: string;
  } | null>(null);

  // Dummy songs data for demo
  const dummySongs = [
    {
      title: "SOUL LADY",
      artist: "YUKIKA",
      image: "/main/home/placeholder-song.jpg"
    },
    {
      title: "Past Life",
      artist: "Tame Impala",
      image: "/main/home/placeholder-song.jpg"
    },
    // Add more dummy songs as needed
  ];

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
              className="w-full h-40 px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] placeholder:text-neutral-400 resize-none font-handwriting"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Add Photo:</label>
            <div className="relative">
              {selectedImage ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={selectedImage}
                    alt="Uploaded"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
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
                  <p className="text-sm text-neutral-600">Click to upload a photo</p>
                </label>
              )}
            </div>
          </div>

          {/* Song Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Add Song:</label>
            {selectedSong ? (
              <div className="flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                <img
                  src={selectedSong.image}
                  alt={selectedSong.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-800">{selectedSong.title}</p>
                  <p className="text-xs text-neutral-600">{selectedSong.artist}</p>
                </div>
                <button
                  onClick={() => setSelectedSong(null)}
                  className="ml-auto p-1 hover:bg-neutral-200 rounded-full"
                >
                  <IconX className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchingSong(true)}
                className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl border border-neutral-200 text-left hover:border-[#FF823C] transition-colors"
              >
                <IconBrandSpotify className="w-5 h-5 text-[#1DB954]" />
                <span className="text-sm text-neutral-600">Choose a song from Spotify</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Song Search Modal */}
      {isSearchingSong && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full h-[80vh] bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Choose a Song</h3>
              <button
                onClick={() => setIsSearchingSong(false)}
                className="p-1 hover:bg-neutral-100 rounded-full"
              >
                <IconX className="w-6 h-6 text-neutral-500" />
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search for a song..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C]"
              />
            </div>

            {/* Songs List */}
            <div className="space-y-3 max-h-[calc(80vh-200px)] overflow-y-auto">
              {dummySongs.map((song, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSong(song);
                    setIsSearchingSong(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50"
                >
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-800">{song.title}</p>
                    <p className="text-xs text-neutral-600">{song.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 