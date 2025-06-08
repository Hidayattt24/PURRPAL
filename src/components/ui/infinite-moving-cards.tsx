"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { IconBrandSpotify } from "@tabler/icons-react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    content: string;
    from: string;
    song?: {
      title: string;
      artist: string;
      image: string;
    };
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  
  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            key={item.from + idx}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-[#FF823C]/10 flex items-center justify-center">
                    <span className="text-sm text-[#FF823C]">@</span>
                  </div>
                  <div className="text-sm font-medium text-[#FF823C]">From: {item.from}</div>
                </div>
              </div>
              <p className="text-lg font-handwriting text-neutral-800 leading-relaxed">
                {item.content}
              </p>
              {item.song && (
                <div className="mt-4 flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <img
                    src={item.song.image}
                    alt={item.song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {item.song.title}
                    </p>
                    <p className="text-xs text-neutral-600">{item.song.artist}</p>
                  </div>
                  <div className="ml-auto">
                    <IconBrandSpotify className="w-6 h-6 text-neutral-400" />
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 