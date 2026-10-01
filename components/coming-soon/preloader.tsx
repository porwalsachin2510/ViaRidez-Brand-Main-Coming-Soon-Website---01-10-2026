"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, animate, motion } from "motion/react"

const EASE = [0.76, 0, 0.24, 1] as const

export function Preloader({ onReveal }: { onReveal: () => void }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"
    window.__lenis?.stop()
    const controls = animate(0, 100, {
      duration: 2.2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        window.setTimeout(() => {
          setVisible(false)
          onReveal()
          document.documentElement.style.overflow = ""
          window.__lenis?.start()
        }, 250)
      },
    })
    return () => {
      controls.stop()
      document.documentElement.style.overflow = ""
    }
  }, [onReveal])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={`Loading ${count}%`}
          className="grain fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 text-white md:p-10"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
            <span>Viaridez &copy; {new Date().getFullYear()}</span>
            <span>Loading experience</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)", y: 20 }}
              animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            >
              <Image
                src="/images/viaridez-logo-light.png"
                alt="Viaridez"
                width={1172}
                height={213}
                priority
                className="h-auto w-56 md:w-80"
              />
            </motion.div>
            <div className="h-px w-56 overflow-hidden bg-white/10 md:w-80">
              <div className="h-full bg-aqua transition-[width] duration-100" style={{ width: `${count}%` }} />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="max-w-[12rem] text-xs leading-relaxed text-white/50">
              Crafting the future of digital innovation
            </span>
            <span className="font-display text-7xl font-light tabular-nums leading-none md:text-[10rem]">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
