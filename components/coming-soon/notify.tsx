"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import type { SiteSettings } from "@/lib/schema"
import { Countdown } from "./countdown"
import { ParticleField } from "./particle-field"
import { InlineSubscribe } from "./subscribe-form"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Notify({ settings }: { settings: SiteSettings }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".notify-bg",
        { yPercent: -15, scale: 1.2 },
        {
          yPercent: 15,
          scale: 1.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      )
      gsap.fromTo(
        ".notify-frame",
        { clipPath: "inset(12% 8% 12% 8% round 2rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 20%", scrub: true },
        },
      )
      gsap.from(".notify-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      })
    },
    { scope: root },
  )

  return (
    <section id="notify" ref={root} className="relative bg-ink">
      <div className="notify-frame relative overflow-hidden">
        <div className="notify-bg absolute inset-0">
          <Image src="/images/hero-portal.png" alt="" fill sizes="100vw" className="object-cover object-[70%_center] opacity-40" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/20 blur-[160px]"
        />
        <ParticleField className="absolute inset-0 size-full" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col items-center justify-center px-6 py-32 text-center text-white md:px-12">
          <p className="notify-reveal flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
            <span className="text-aqua">(03)</span>
            Launch countdown
          </p>
          <h2 className="notify-reveal mt-8 max-w-4xl text-balance font-display text-5xl font-light leading-[1.05] md:text-7xl lg:text-8xl">
            {settings.newsletter.title}
          </h2>
          <p className="notify-reveal mt-6 max-w-lg text-pretty text-white/60">{settings.newsletter.subtitle}</p>

          <div className="notify-reveal mt-14">
            <Countdown launchDate={settings.launchDate} variant="light" size="lg" />
          </div>

          <div className="notify-reveal mt-14 w-full max-w-lg text-left">
            <InlineSubscribe settings={settings} />
          </div>
        </div>
      </div>
    </section>
  )
}
