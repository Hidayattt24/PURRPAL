"use client";

import { cn } from "@/lib/utils";
import React, { ElementType } from "react";

interface LineShadowTextProps {
  children: React.ReactNode;
  shadowColor?: string;
  as?: ElementType;
  className?: string;
}

export const LineShadowText = ({
  children,
  shadowColor = "#FF823C",
  as: Component = "span",
  className,
}: LineShadowTextProps) => {
  return (
    <Component
      className={cn(
        "relative inline-block",
        "after:absolute after:left-0 after:top-[calc(100%_+_1px)] after:h-[2px] after:w-full",
        "after:animate-[line-width_1s_ease-in-out_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-[var(--shadow-color)] after:to-transparent",
        className
      )}
      style={{
        "--shadow-color": shadowColor,
      } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}; 