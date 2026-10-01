"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowRight } from "lucide-react"
import type { SiteSettings } from "@/lib/schema"
import { scrollToHref } from "@/lib/scroll"
import { Countdown } from "./countdown"
import { FeatureIcon } from "./feature-icon"
import { Magnetic } from "./magnetic"
import { InlineSubscribe } from "./subscribe-form"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE = [0.22, 1, 0.36, 1] as const

function RevealWords({ text, ready, delay, className }: { text: string; ready: boolean; delay: number; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${className ?? ""}`}
            initial={{ y: "110%", rotate: 4 }}
            animate={ready ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </>
  )
}

export function Hero({ settings, ready, live }: { settings: SiteSettings; ready: boolean; live: boolean }) {
  const root = useRef<HTMLElement>(null)
  const bg = useRef<HTMLDivElement>(null)
  const bgMouse = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)

  const headlineWords = settings.headline.split(" ").length

  useGSAP(
    () => {
      gsap.fromTo(
        bg.current,
        { scale: 1.12, yPercent: 0 },
        {
          scale: 1.28,
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        },
      )
      gsap.to(content.current, {
        yPercent: -25,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
      })

      if (!window.matchMedia("(pointer: fine)").matches) return
      const xTo = gsap.quickTo(bgMouse.current, "x", { duration: 1.4, ease: "power3" })
      const yTo = gsap.quickTo(bgMouse.current, "y", { duration: 1.4, ease: "power3" })
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -30)
        yTo((e.clientY / window.innerHeight - 0.5) * -20)
      }
      window.addEventListener("pointermove", onMove)
      return () => window.removeEventListener("pointermove", onMove)
    },
    { scope: root },
  )

  return (
    <section id="home" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-mist">
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <div ref={bgMouse} className="absolute -inset-[3%]">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 2, ease: EASE }}
          >
            <Image
              src="/images/hero-portal.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[72%_center] lg:object-center"
            />
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-mist/95 via-mist/70 to-mist/10 lg:bg-gradient-to-r lg:from-mist/90 lg:via-mist/45 lg:to-transparent"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent lg:h-72" />

      <div
        ref={content}
        className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pb-16 pt-32 md:px-12 lg:px-20 lg:pb-10"
      >
        <div className="max-w-2xl">
          <motion.div
            className="mb-8 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="text-xs font-medium uppercase tracking-[0.5em] text-ink/80">
              {live ? "Now Live" : settings.eyebrow}
            </span>
            <motion.span
              className="h-px w-36 origin-left bg-gradient-to-r from-ink/40 to-transparent"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            />
          </motion.div>

          <h1 className="font-display text-[2.6rem] font-light leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
            <RevealWords text={settings.headline} ready={ready} delay={0.35} />
            {settings.headlineHighlight && (
              <RevealWords
                text={settings.headlineHighlight}
                ready={ready}
                delay={0.35 + headlineWords * 0.08}
                className="bg-gradient-to-r from-[#1b5fa3] via-teal to-aqua bg-clip-text text-transparent"
              />
            )}
          </h1>

          <motion.p
            className="mt-7 max-w-md text-pretty text-base leading-relaxed text-ink/70"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
          >
            {settings.description}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 1.15 }}
          >
            <Magnetic>
              <a
                href={settings.primaryCta.href}
                onClick={(e) => scrollToHref(settings.primaryCta.href, e)}
                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-ink py-2 pl-2 pr-7 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(45,212,191,0.4),0_10px_40px_-10px_rgba(14,155,138,0.6)]"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <ArrowRight className="size-4 text-aqua" />
                </span>
                {settings.primaryCta.label}
              </a>
            </Magnetic>
            <a
              href={settings.secondaryCta.href}
              onClick={(e) => scrollToHref(settings.secondaryCta.href, e)}
              className="group inline-flex items-center gap-3 text-sm text-ink/80"
            >
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              <span className="relative">
                {settings.secondaryCta.label}
                <span className="absolute -bottom-1 left-0 h-px w-full bg-ink/40 transition-colors group-hover:bg-teal" />
              </span>
            </a>
          </motion.div>

          {!live && (
            <motion.div
              className="mt-14"
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 1.3 }}
            >
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-ink/60">Launching in</p>
              <Countdown launchDate={settings.launchDate} />
            </motion.div>
          )}
        </div>

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:right-12 lg:right-20 lg:flex">
          <span className="text-center text-[10px] uppercase leading-relaxed tracking-[0.3em] text-white/80">
            Scroll
            <br />
            to explore
          </span>
          <span className="relative h-32 w-px overflow-hidden bg-white/30">
            <motion.span
              className="absolute left-0 top-0 h-8 w-px bg-aqua"
              animate={{ y: ["-100%", "400%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>

      <motion.div
        className="relative mx-auto hidden w-full max-w-[1600px] items-end justify-between gap-8 px-6 pb-10 md:px-12 lg:flex lg:px-20"
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: 1.5 }}
      >
        <ul className="flex flex-1 divide-x divide-white/10">
          {settings.features.slice(0, 4).map((feature) => (
            <li key={feature.title} className="flex flex-1 items-start gap-4 px-6 first:pl-0">
              <FeatureIcon name={feature.icon} className="mt-0.5 size-6 shrink-0 text-aqua" />
              <div>
                <p className="text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white">
                  {feature.title}
                </p>
                <p className="mt-2 line-clamp-2 max-w-[12rem] text-xs leading-relaxed text-white/50">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {!live && (
          <div className="w-[340px] shrink-0 rounded-2xl border border-aqua/30 bg-ink/60 p-5 backdrop-blur-xl">
            <p className="text-sm font-medium text-white">{settings.newsletter.title}</p>
            <p className="mb-4 mt-1 text-xs text-white/50">Get notified when we go live!</p>
            <InlineSubscribe settings={settings} compact />
          </div>
        )}
      </motion.div>
    </section>
  )
}
