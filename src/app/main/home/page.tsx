"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IconBrandSpotify } from "@tabler/icons-react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";

const stories = [
  {
    from: "nayla",
    content: "thank you for being my safe place through 2023... even if we drifted",
    song: {
      title: "SOUL LADY",
      artist: "YUKIKA",
      image: "/main/home/placeholder-song.jpg"
    }
  },
  {
    from: "jensen",
    content: "kadang i wish i could tell u how much ur random texts made my day better",
    song: {
      title: "Past Life",
      artist: "Tame Impala",
      image: "/main/home/placeholder-song.jpg"
    }
  },
  {
    from: "emil",
    content: "wish i could forget how safe it felt being around you dulu",
    song: {
      title: "Always",
      artist: "Daniel Caesar",
      image: "/main/home/placeholder-song.jpg"
    }
  },
  {
    from: "vanya",
    content: "funny how someone bisa jadi stranger padahal they knew all your secrets",
    song: {
      title: "White Ferrari",
      artist: "Frank Ocean",
      image: "/main/home/placeholder-song.jpg"
    }
  }
];

export default function HomePage() {
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const userName = "User";
  const { resolvedTheme } = useTheme();
  const shadowColor = resolvedTheme === "dark" ? "white" : "#FF823C";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
          <Image
            src="/main/home/placeholder-avatar.jpg"
            alt="Profile"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-medium text-neutral-800">
          Hi, <span className="text-[#FF823C]">@{userName}</span>
        </h1>
      </div>

      {/* Create Story Title */}
      <div className="text-center space-y-4">
        <h2 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          Bagikan Cerita mu di{" "}
          <LineShadowText className="italic" shadowColor={shadowColor}>
            Purrpal
          </LineShadowText>
        </h2>
        <Link href="/main/home/create">
          <div className="mt-4 group relative mx-auto inline-flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#ff823c1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#ff823c3f]">
            <span
              className={cn(
                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#FF823C]/50 via-[#C54F0C]/50 to-[#FF823C]/50 bg-[length:300%_100%] p-[1px]",
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <AnimatedGradientText className="text-sm font-medium">
              Tell Your Story ✨
            </AnimatedGradientText>
            <ChevronRight
              className="ml-1 size-4 stroke-[#FF823C] transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
            />
          </div>
        </Link>
      </div>

      {/* Stories Section */}
      <div className="relative w-full py-10 bg-neutral-50/50 overflow-hidden">
        <div className="mb-8">
          <InfiniteMovingCards
            items={stories}
            direction="left"
            speed="normal"
            className="py-4"
          />
        </div>
        <div>
          <InfiniteMovingCards
            items={[...stories].reverse()}
            direction="right"
            speed="normal"
            className="py-4"
          />
        </div>
      </div>

      {/* Create Story Button */}
      <Link href="/main/home/create">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="fixed bottom-24 right-6 md:right-12 w-12 h-12 bg-[#FF823C] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl"
        >
          <span className="text-2xl">+</span>
        </motion.button>
      </Link>

      {/* Create Story Modal */}
      {isCreatingStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Buat Cerita Baru</h3>
              <button
                onClick={() => setIsCreatingStory(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Untuk siapa cerita ini?"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C]"
              />
              <textarea
                placeholder="Bagikan ceritamu..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF823C] min-h-[120px]"
              />
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-[#FF823C] text-white rounded-full hover:bg-[#FF823C]/90">
                  Bagikan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
} 