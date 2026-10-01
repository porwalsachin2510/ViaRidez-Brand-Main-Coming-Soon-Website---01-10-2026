"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (!dot.current || !ring.current) return
    document.documentElement.classList.add("has-custom-cursor")
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 1 })

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" })
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" })
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" })
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" })

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      const interactive = (e.target as HTMLElement).closest("a, button, input, textarea, [data-cursor]")
      gsap.to(ring.current, { scale: interactive ? 1.8 : 1, duration: 0.3, overwrite: "auto" })
    }
    window.addEventListener("pointermove", onMove)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.documentElement.classList.remove("has-custom-cursor")
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <div ref={dot} className="fixed left-0 top-0 size-1.5 rounded-full bg-white opacity-0" />
      <div ref={ring} className="fixed left-0 top-0 size-9 rounded-full border border-white/70 opacity-0" />
    </div>
  )
}
