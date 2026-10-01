"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import type { SiteSettings } from "@/lib/schema"
import { FeatureIcon } from "./feature-icon"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Features({ settings }: { settings: SiteSettings }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        const el = track.current
        if (!el) return
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 80)
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  if (settings.features.length === 0) return null

  return (
    <section
      id="features"
      ref={root}
      className="relative overflow-hidden bg-[#0a1420] py-28 text-white lg:flex lg:h-screen lg:items-center lg:py-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 size-[36rem] rounded-full bg-teal/20 blur-[140px]"
      />
      <div ref={track} className="relative flex flex-col gap-6 px-6 md:px-12 lg:w-max lg:flex-row lg:items-stretch lg:gap-8 lg:px-20">
        <div className="mb-10 flex max-w-md flex-col justify-between lg:mb-0 lg:mr-16 lg:w-[30rem] lg:max-w-none">
          <div>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
              <span className="text-aqua">(02)</span>
              {settings.featuresEyebrow}
            </p>
            <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.1] md:text-6xl">
              {settings.featuresTitle}
            </h2>
          </div>
          <p className="mt-8 hidden text-sm text-white/40 lg:block">{"Keep scrolling \u2192"}</p>
        </div>

        {settings.features.map((feature, i) => (
          <article
            key={`${feature.title}-${i}`}
            className="feature-card group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:border-aqua/40 lg:h-[30rem] lg:w-[24rem] lg:shrink-0"
          >
            <div
              aria-hidden
              className="absolute -right-24 -top-24 size-64 rounded-full bg-aqua/0 blur-3xl transition-colors duration-700 group-hover:bg-aqua/20"
            />
            <div className="relative flex items-start justify-between">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-ink/60 transition-transform duration-700 group-hover:rotate-[20deg]">
                <FeatureIcon name={feature.icon} className="size-6 text-aqua" />
              </span>
              <span className="font-display text-6xl font-light text-white/10">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="relative">
              <h3 className="font-display text-2xl font-normal md:text-3xl">{feature.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{feature.description}</p>
              <span className="mt-8 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-aqua to-transparent transition-transform duration-700 group-hover:scale-x-100" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
