"use client"

import { useCallback, useState } from "react"
import type { SiteSettings } from "@/lib/schema"
import { Contact } from "./contact"
import { Cursor } from "./cursor"
import { Features } from "./features"
import { Footer } from "./footer"
import { Hero } from "./hero"
import { Manifesto } from "./manifesto"
import { Marquee } from "./marquee"
import { Notify } from "./notify"
import { Preloader } from "./preloader"
import { SiteNav } from "./site-nav"
import { SmoothScroll } from "./smooth-scroll"

export function ComingSoon({ settings, live }: { settings: SiteSettings; live: boolean }) {
  const [ready, setReady] = useState(false)
  const onReveal = useCallback(() => setReady(true), [])

  return (
    <SmoothScroll>
      <Preloader onReveal={onReveal} />
      <Cursor />
      <SiteNav settings={settings} ready={ready} />
      <main className="bg-ink">
        <Hero settings={settings} ready={ready} live={live} />
        <Marquee words={settings.marqueeWords} />
        <Manifesto settings={settings} />
        <Features settings={settings} />
        {!live && <Notify settings={settings} />}
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </SmoothScroll>
  )
}
