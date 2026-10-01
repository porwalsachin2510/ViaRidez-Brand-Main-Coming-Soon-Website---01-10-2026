"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import type { SiteSettings } from "@/lib/schema"

gsap.registerPlugin(ScrollTrigger, useGSAP)

function parseStat(value: string) {
  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/)
  if (!match) return null
  return { prefix: match[1], number: Number.parseFloat(match[2]), decimals: match[2].split(".")[1]?.length ?? 0, suffix: match[3] }
}

export function Manifesto({ settings }: { settings: SiteSettings }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".manifesto-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".manifesto-text", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      )

      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const parsed = parseStat(el.dataset.value ?? "")
        if (!parsed) return
        const counter = { v: 0 }
        gsap.to(counter, {
          v: parsed.number,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${parsed.prefix}${counter.v.toFixed(parsed.decimals)}${parsed.suffix}`
          },
        })
      })

      gsap.from(".stat-item", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} className="relative bg-ink px-6 py-28 text-white md:px-12 md:py-40 lg:px-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
            <span className="text-aqua">(01)</span>
            {settings.manifesto.eyebrow}
          </p>
          <p className="manifesto-text text-balance font-display text-3xl font-light leading-[1.2] md:text-5xl lg:text-6xl">
            {settings.manifesto.text.split(" ").map((word, i) => (
              <span key={`${word}-${i}`} className="manifesto-word">
                {word}{" "}
              </span>
            ))}
          </p>
        </div>

        {settings.stats.length > 0 && (
          <dl className="stats-grid mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:mt-32 lg:grid-cols-4">
            {settings.stats.map((stat) => (
              <div key={stat.label} className="stat-item flex flex-col gap-3 bg-ink p-6 md:p-10">
                <dt className="order-2 text-xs uppercase tracking-[0.2em] text-white/50">{stat.label}</dt>
                <dd
                  className="stat-value order-1 font-display text-4xl font-light text-white md:text-6xl"
                  data-value={stat.value}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
