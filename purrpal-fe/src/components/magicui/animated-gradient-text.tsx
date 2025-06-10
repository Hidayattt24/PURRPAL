"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const AnimatedGradientText = ({
  children,
  className,
  speed = 1,
  colorFrom = "#FF823C",
  colorTo = "#C54F0C",
}: AnimatedGradientTextProps) => {
  return (
    <span
      className={cn(
        "animate-gradient bg-clip-text text-transparent",
        "bg-gradient-to-r",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, var(--color-from), var(--color-to), var(--color-from))`,
        backgroundSize: "200% 100%",
        animation: `gradient ${4 / speed}s linear infinite`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
      } as React.CSSProperties}
    >
      {children}
    </span>
  );
}; 