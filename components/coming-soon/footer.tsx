"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import type { SiteSettings } from "@/lib/schema"
import { scrollToHref } from "@/lib/scroll"

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink px-6 pb-10 pt-20 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {settings.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-aqua"
                >
                  {social.platform}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#home"
            onClick={(e) => scrollToHref("#home", e)}
            className="group inline-flex items-center gap-3 text-sm text-white/60 hover:text-white"
          >
            Back to top
            <span className="flex size-10 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-aqua group-hover:bg-aqua group-hover:text-ink">
              <ArrowUp className="size-4" />
            </span>
          </a>
        </div>

        <motion.div
          className="mt-20 overflow-hidden"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        >
          <Image
            src="/images/viaridez-logo-light.png"
            alt="Viaridez"
            width={1172}
            height={213}
            className="h-auto w-full opacity-90"
          />
        </motion.div>

        <div className="mt-10 flex flex-col justify-between gap-3 text-xs text-white/40 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {settings.footerText}
          </p>
          <p>Crafted with precision for a smarter tomorrow.</p>
        </div>
      </div>
    </footer>
  )
}
