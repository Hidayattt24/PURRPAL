"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitingCirclesProps {
  children: React.ReactNode[];
  className?: string;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export const OrbitingCircles = ({
  children,
  className = "",
  reverse = false,
  duration = 40,
  delay = 0,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: OrbitingCirclesProps) => {
  const numElements = React.Children.count(children);
  const angleStep = (2 * Math.PI) / numElements;

  // Pre-calculate positions for smoother animation
  const positions = useMemo(() => {
    return Array.from({ length: numElements }, (_, i) => {
      const angle = angleStep * i;
      return angle;
    });
  }, [numElements, angleStep]);

  return (
    <div 
      className={cn("relative", className)}
      style={{ 
        width: radius * 2,
        height: radius * 2
      }}
    >
      {path && (
        <div
          className="absolute inset-0 rounded-full border-[1px] border-[#FF823C]/20"
          style={{ 
            width: radius * 2,
            height: radius * 2
          }}
        />
      )}
      {React.Children.map(children, (child, i) => {
        const initialAngle = positions[i];
        
        return (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              width: iconSize,
              height: iconSize,
              left: "50%",
              top: "50%",
              x: -iconSize / 2,
              y: -iconSize / 2,
            }}
            animate={{
              x: radius * Math.cos(initialAngle) - iconSize / 2,
              y: radius * Math.sin(initialAngle) - iconSize / 2,
              rotate: reverse ? [0, -360] : [0, 360],
            }}
            transition={{
              x: {
                duration: duration / speed,
                repeat: Infinity,
                ease: "linear",
                delay: (delay * i) / speed,
              },
              y: {
                duration: duration / speed,
                repeat: Infinity,
                ease: "linear",
                delay: (delay * i) / speed,
              },
              rotate: {
                duration: duration / speed,
                repeat: Infinity,
                ease: "linear",
                delay: (delay * i) / speed,
              }
            }}
          >
            <motion.div
              className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl border border-[#FF823C]/10"
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.1, ease: "easeOut" }
              }}
            >
              {child}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}; 