"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

function getParts(target: number, now: number) {
  const diff = Math.max(0, target - now)
  return {
    done: diff === 0,
    parts: [
      { label: "Days", value: Math.floor(diff / 86_400_000) },
      { label: "Hours", value: Math.floor((diff / 3_600_000) % 24) },
      { label: "Minutes", value: Math.floor((diff / 60_000) % 60) },
      { label: "Seconds", value: Math.floor((diff / 1000) % 60) },
    ],
  }
}

export function Countdown({
  launchDate,
  variant = "dark",
  size = "md",
}: {
  launchDate: string
  variant?: "dark" | "light"
  size?: "md" | "lg"
}) {
  const target = Date.parse(launchDate)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const { parts, done } = getParts(target, now ?? target)
  const isLight = variant === "light"

  if (now !== null && done) {
    return (
      <p className={cn("font-display text-2xl font-light", isLight ? "text-white" : "text-ink")}>
        {"We're live — welcome to the future."}
      </p>
    )
  }

  return (
    <div className="flex items-stretch" role="timer" aria-live="off">
      {parts.map((part, i) => {
        const value = now === null ? "--" : String(part.value).padStart(2, "0")
        return (
          <div
            key={part.label}
            className={cn(
              "flex flex-col gap-1",
              i > 0 && "border-l pl-4 sm:pl-7",
              i < parts.length - 1 && "pr-4 sm:pr-7",
              isLight ? "border-white/15" : "border-ink/15",
            )}
          >
            <span
              className={cn(
                "relative block overflow-hidden font-display font-light tabular-nums leading-none",
                size === "lg" ? "text-5xl sm:text-7xl lg:text-8xl" : "text-3xl sm:text-4xl",
                isLight ? "text-white" : "text-ink",
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={value}
                  className="block"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {value}
                </motion.span>
              </AnimatePresence>
            </span>
            <span
              className={cn(
                "text-[10px] uppercase tracking-[0.25em]",
                isLight ? "text-white/50" : "text-ink/50",
              )}
            >
              {part.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
