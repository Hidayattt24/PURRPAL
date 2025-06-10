import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  isActive: boolean;
}

export default function PageTransition({ isActive }: PageTransitionProps) {
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    if (isActive) {
      // Get all main elements to animate
      const mainElements = document.querySelectorAll('body > *, body div');
      setElements(Array.from(mainElements));

      // Prevent scrolling during animation
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';

      // Reset after animation
      return () => {
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
      };
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && elements.length > 0) {
      elements.forEach((element: Element) => {
        const el = element as HTMLElement;
        const delay = Math.random() * 300; // Random delay between 0-300ms
        const speed = Math.random() * 1000 + 500; // Random duration between 500-1500ms
        const rotate = Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees
        const moveX = Math.random() * 100 - 50; // Random X movement between -50 and 50px

        el.style.transition = `transform ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        el.style.transitionDelay = `${delay}ms`;
        el.style.transform = `translateY(150vh) translateX(${moveX}px) rotate(${rotate}deg)`;
      });
    }
  }, [isActive, elements]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-b from-orange-50 to-orange-100 z-[100]"
      style={{ pointerEvents: 'none' }}
    />
  );
} 