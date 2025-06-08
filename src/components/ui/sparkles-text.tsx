"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Sparkle = ({ color, size, style }: { color: string; size: number; style: any }) => {
  const path = `M${size / 2} 0 L${size / 2} ${size} M0 ${size / 2} L${size} ${size / 2}`;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 90, 180],
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
      style={style}
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.4,
        }}
      />
    </motion.svg>
  );
};

export const SparklesText = ({
  children,
  className,
  sparklesColor = "#FF823C",
}: {
  children: React.ReactNode;
  className?: string;
  sparklesColor?: string;
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 10; i++) {
        newSparkles.push({
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 10,
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={sparklesColor}
          size={sparkle.size}
          style={{
            position: "absolute",
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            pointerEvents: "none",
          }}
        />
      ))}
      {children}
    </div>
  );
}; 