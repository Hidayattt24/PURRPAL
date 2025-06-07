"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const Marquee = ({
  children,
  className,
  reverse,
  pauseOnHover = false,
  vertical = false,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group flex shrink-0 gap-4 [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {/* Marquee animation container */}
      <div
        className={cn(
          "flex shrink-0 animate-marquee gap-4 [--gap:1rem]",
          vertical ? "flex-col" : "flex-row",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      {/* Copy of the content for seamless loop */}
      <div
        className={cn(
          "flex shrink-0 animate-marquee gap-4 [--gap:1rem]",
          vertical ? "flex-col" : "flex-row",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}; 