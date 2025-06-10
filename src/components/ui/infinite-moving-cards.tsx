"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { IconMapPin } from "@tabler/icons-react";

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
    image?: string;
    activityImage?: string;
    location?: {
      name: string;
      address: string;
    };
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

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
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative flex-shrink-0 rounded-2xl border border-neutral-200 bg-white p-4 md:w-[450px]"
            key={idx}
          >
            <div className="space-y-4">
              {/* Header with avatar and username */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || "/main/home/placeholder-avatar.jpg"}
                    alt={`${item.from}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-neutral-800">@{item.from}</h3>
              </div>

              {/* Story content */}
              <p className="text-neutral-600 text-sm leading-relaxed">{item.content}</p>

              {/* Location */}
              {item.location && (
                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg">
                  <IconMapPin className="w-5 h-5 text-[#FF823C] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-800">{item.location.name}</p>
                    <p className="text-xs text-neutral-600">{item.location.address}</p>
                  </div>
                </div>
              )}

              {/* Activity Image */}
              {item.activityImage && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={item.activityImage}
                    alt={`${item.from}'s activity`}
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 