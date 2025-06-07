"use client";

import { cn } from "@/lib/utils";
import {
  IconHome,
  IconStarsFilled,
  IconMessageCircle2,
  IconQuestionMark,
  IconLayoutNavbarCollapse,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

const navItems = [
  {
    name: "Home",
    icon: <IconHome className="w-5 h-5 text-[#FF823C]" />,
    href: "/",
  },
  {
    name: "Features",
    icon: <IconStarsFilled className="w-5 h-5 text-[#FF823C]" />,
    href: "/features",
  },
  {
    name: "Testimonials",
    icon: <IconMessageCircle2 className="w-5 h-5 text-[#FF823C]" />,
    href: "/testimonials",
  },
  {
    name: "QA",
    icon: <IconQuestionMark className="w-5 h-5 text-[#FF823C]" />,
    href: "/qa",
  },
];

export const FloatingDock = () => {
  return (
    <>
      <FloatingDockDesktop />
      <FloatingDockMobile />
    </>
  );
};

const FloatingDockMobile = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 block md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2 items-end"
          >
            {navItems.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (navItems.length - 1 - idx) * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-orange-50 transition-colors"
                >
                  {item.icon}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF823C] shadow-lg hover:bg-[#C54F0C] transition-colors"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = () => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex h-16 items-center gap-4 rounded-full bg-white/80 backdrop-blur-sm px-8 shadow-lg border border-neutral-100"
    >
      <Link href="/" className="flex items-center">
        <img
          src="/icon/iconname.svg"
          alt="PurrPal Logo"
          className="h-8 w-auto mr-6"
        />
      </Link>

      {navItems.map((item) => (
        <IconContainer mouseX={mouseX} key={item.name} {...item} />
      ))}

      <div className="h-8 w-[1px] bg-neutral-200 mx-2" />

      <button className="bg-[#FF823C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#C54F0C] transition-colors">
        Login
      </button>
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  name,
  icon,
  href,
}: {
  mouseX: MotionValue;
  name: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
  let heightTransform = useTransform(distance, [-100, 0, 100], [40, 60, 40]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center rounded-full hover:bg-orange-50 transition-colors"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md bg-neutral-800 px-2 py-1 text-xs text-white"
            >
              {name}
            </motion.div>
          )}
        </AnimatePresence>
        {icon}
      </motion.div>
    </Link>
  );
} 