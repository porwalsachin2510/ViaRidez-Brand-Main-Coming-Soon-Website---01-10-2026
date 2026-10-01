"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react"
import { Menu, X } from "lucide-react"
import type { SiteSettings } from "@/lib/schema"
import { scrollToHref } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

export function SiteNav({ settings, ready }: { settings: SiteSettings; ready: boolean }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400 && !open)
    setSolid(y > window.innerHeight * 0.85)
  })

  const onLink = (href: string) => (e: React.MouseEvent) => {
    setOpen(false)
    scrollToHref(href, e)
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          solid && !open && "border-b border-white/5 bg-ink/70 backdrop-blur-xl",
        )}
        initial={{ y: -100 }}
        animate={{ y: ready && !hidden ? 0 : -100 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12 lg:px-20">
          <a href="#home" onClick={onLink("#home")} className="relative z-10" aria-label="Viaridez home">
            <Image
              src={solid || open ? "/images/viaridez-logo-light.png" : "/images/viaridez-logo.png"}
              alt="Viaridez"
              width={1172}
              height={213}
              priority
              className="h-6 w-auto md:h-7"
            />
          </a>

          <ul className="hidden items-center gap-10 lg:flex">
            {settings.navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onLink(link.href)}
                  className={cn(
                    "group relative text-sm transition-colors",
                    solid ? "text-white/70 hover:text-white" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-teal transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {settings.statusBadge && (
              <span
                className={cn(
                  "hidden items-center gap-2.5 rounded-full border px-4 py-2 text-xs md:flex",
                  solid ? "border-white/15 text-white/80" : "border-ink/15 bg-white/30 text-ink/80 backdrop-blur",
                )}
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-aqua opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-aqua" />
                </span>
                {settings.statusBadge}
              </span>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative z-10 flex size-11 items-center justify-center rounded-full border lg:hidden",
                solid || open ? "border-white/20 text-white" : "border-ink/20 text-ink",
              )}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-6 pb-12 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <ul className="flex flex-col gap-2">
              {settings.navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={onLink(link.href)}
                    className="flex items-baseline gap-4 font-display text-5xl font-light text-white"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.07 }}
                  >
                    <span className="text-xs text-aqua">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-white/50">{settings.statusBadge}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
