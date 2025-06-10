import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
}) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const animateText = async () => {
      for (let i = 0; i < words.length; i++) {
        await controls.start({
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    };

    animateText();
  }, [controls, words]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={`${word.text}-${idx}`}
          initial={{ opacity: 0, x: -4 }}
          animate={controls}
          className={word.className}
        >
          {word.text}
        </motion.span>
      ))}
    </div>
  );
}; 