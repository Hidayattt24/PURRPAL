"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ExpandableProps {
  children: (props: { isExpanded: boolean }) => React.ReactNode
  expanded?: boolean
  onToggle?: (expanded: boolean) => void
  expandDirection?: "both" | "horizontal" | "vertical"
  expandBehavior?: "push" | "replace"
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
}

interface ExpandableCardProps {
  children: React.ReactNode
  className?: string
  collapsedSize: { width: number | string; height: number | string }
  expandedSize: { width: number | string; height: number | string }
  hoverToExpand?: boolean
  expandDelay?: number
  collapseDelay?: number
}

interface ExpandableContentProps {
  children: React.ReactNode
  preset?: "fade" | "blur-sm" | "blur-md" | "slide-up"
  stagger?: boolean
  staggerChildren?: number
  keepMounted?: boolean
  animateIn?: {
    initial: any
    animate: any
    transition: any
  }
}

const ExpandableContext = React.createContext<{
  isExpanded: boolean
  onToggle: () => void
}>({
  isExpanded: false,
  onToggle: () => {},
})

export function Expandable({
  children,
  expanded: controlledExpanded,
  onToggle: onControlledToggle,
  expandDirection = "both",
  expandBehavior = "replace",
  initialDelay = 0,
  onExpandStart,
  onExpandEnd,
}: ExpandableProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(false)

  const isExpanded = controlledExpanded ?? uncontrolledExpanded
  const onToggle = onControlledToggle ?? (() => setUncontrolledExpanded(prev => !prev))

  return (
    <ExpandableContext.Provider value={{ isExpanded, onToggle }}>
      {typeof children === "function" ? children({ isExpanded }) : children}
    </ExpandableContext.Provider>
  )
}

export function ExpandableTrigger({ children }: { children: React.ReactNode }) {
  const { onToggle } = React.useContext(ExpandableContext)
  return <div onClick={onToggle}>{children}</div>
}

export function ExpandableCard({
  children,
  className,
  collapsedSize,
  expandedSize,
  hoverToExpand = false,
  expandDelay = 0,
  collapseDelay = 0,
}: ExpandableCardProps) {
  const { isExpanded } = React.useContext(ExpandableContext)
  const [isHovered, setIsHovered] = React.useState(false)

  const shouldExpand = isExpanded || (hoverToExpand && isHovered)

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        width: shouldExpand ? expandedSize.width : collapsedSize.width,
        height: shouldExpand ? expandedSize.height : collapsedSize.height,
      }}
      transition={{
        duration: 0.3,
        delay: shouldExpand ? expandDelay / 1000 : collapseDelay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}

export function ExpandableCardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>
}

export function ExpandableCardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-6 pb-6">{children}</div>
}

export function ExpandableContent({
  children,
  preset = "fade",
  stagger = false,
  staggerChildren = 0.1,
  keepMounted = false,
  animateIn,
}: ExpandableContentProps) {
  const { isExpanded } = React.useContext(ExpandableContext)

  const presets = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    "blur-sm": {
      initial: { opacity: 0, filter: "blur(4px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(4px)" },
    },
    "blur-md": {
      initial: { opacity: 0, filter: "blur(8px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(8px)" },
    },
    "slide-up": {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  }

  const selectedPreset = presets[preset]

  if (!keepMounted && !isExpanded) {
    return null
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          {...(animateIn || selectedPreset)}
          transition={{
            duration: 0.2,
            staggerChildren: stagger ? staggerChildren : 0,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ExpandableCardFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-6 pb-6">{children}</div>
} 