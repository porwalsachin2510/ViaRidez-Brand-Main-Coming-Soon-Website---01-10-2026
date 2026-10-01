"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Asterisk } from "lucide-react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Row({ words }: { words: string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center">
          <span
            className={`px-8 font-display text-6xl font-light uppercase tracking-tight md:text-8xl lg:text-9xl ${
              i % 2 === 1 ? "text-outline" : "text-white"
            }`}
          >
            {word}
          </span>
          <Asterisk aria-hidden className="size-10 text-aqua md:size-14" strokeWidth={1.2} />
        </span>
      ))}
    </div>
  )
}

export function Marquee({ words }: { words: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tween = gsap.to(track.current, { xPercent: -50, ease: "none", duration: 30, repeat: -1 })
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const speed = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 4)
          gsap.to(tween, { timeScale: self.direction * speed, duration: 0.3, overwrite: true })
          gsap.to(tween, { timeScale: self.direction, duration: 1.2, delay: 0.3 })
        },
      })
    },
    { scope: root },
  )

  if (words.length === 0) return null

  return (
    <div ref={root} aria-hidden className="relative overflow-hidden border-y border-white/5 bg-ink py-10 md:py-14">
      <div ref={track} className="flex w-max">
        <Row words={words} />
        <Row words={words} />
      </div>
    </div>
  )
}
