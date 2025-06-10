"use client";

import { cn } from "@/lib/utils";
import {
  IconHome,
  IconRobot,
  IconBook2,
  IconMapPin,
  IconSettings,
  IconMessageCircle,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    name: "Portal Komunitas",
    icon: <IconHome className="w-5 h-5 text-[#FF823C]" />,
    href: "/main/home",
  },
  {
    name: "PurrPal AI",
    icon: <IconRobot className="w-5 h-5 text-[#FF823C]" />,
    href: "/main/ai",
  },
  {
    name: "Modul Edukasi",
    icon: <IconBook2 className="w-5 h-5 text-[#FF823C]" />,
    href: "/main/modul",
  },
  {
    name: "Chatbot",
    icon: <IconMessageCircle className="w-5 h-5 text-[#FF823C]" />,
    href: "/main/chatbot",
  },
  {
    name: "Direktori Layanan",
    icon: <IconMapPin className="w-5 h-5 text-[#FF823C]" />,
    href: "/main/map",
  },
  {
    name: "Settings",
    icon: <IconSettings className="w-5 h-5 text-[#FF823C]" />,
    href: "/main/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="pb-24">{children}</div>
      <FloatingNavDesktop />
      <FloatingNavMobile />
    </main>
  );
}

const FloatingNavDesktop = () => {
  let mouseX = useMotionValue(Infinity);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 h-16 w-[40rem] rounded-full border border-neutral-200 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-50 hidden md:block"
    >
      <div className="flex h-full items-center justify-center gap-8">
        {navItems.map((item) => (
          <IconContainer
            key={item.href}
            mouseX={mouseX}
            item={item}
            pathname={pathname}
            onClick={() => router.push(item.href)}
          />
        ))}
      </div>
    </motion.div>
  );
};

const FloatingNavMobile = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 z-50 md:hidden">
      <div className="flex h-full items-center justify-around px-4">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
              pathname === item.href
                ? "text-[#FF823C]"
                : "text-neutral-600 hover:text-[#FF823C]"
            )}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

function IconContainer({
  mouseX,
  item,
  pathname,
  onClick,
}: {
  mouseX: MotionValue;
  item: {
    name: string;
    icon: React.ReactNode;
    href: string;
  };
  pathname: string;
  onClick: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square"
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-full transition-colors",
          pathname === item.href
            ? "bg-[#FF823C]/10 text-[#FF823C]"
            : "hover:bg-neutral-100"
        )}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-md bg-neutral-800 px-3 py-2 text-sm text-white"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
        {item.icon}
      </button>
    </motion.div>
  );
} 