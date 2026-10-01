"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowUpRight, Loader2 } from "lucide-react"
import type { SiteSettings } from "@/lib/schema"
import { cn } from "@/lib/utils"
import { Magnetic } from "./magnetic"

const EASE = [0.22, 1, 0.36, 1] as const

function Field({
  label,
  name,
  type = "text",
  textarea,
  required,
}: {
  label: string
  name: string
  type?: string
  textarea?: boolean
  required?: boolean
}) {
  const className =
    "peer w-full border-b border-white/15 bg-transparent pb-3 pt-7 text-lg text-white outline-none transition-colors placeholder:text-transparent focus:border-aqua"
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={name} name={name} required={required} rows={4} placeholder={label} className={cn(className, "resize-none")} />
      ) : (
        <input id={name} name={name} type={type} required={required} placeholder={label} className={className} />
      )}
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-0 top-0 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors peer-focus:text-aqua"
      >
        {label}
      </label>
    </div>
  )
}

export function Contact({ settings }: { settings: SiteSettings }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong")
      setStatus("success")
      setMessage("Thank you! Your message has been received — we'll get back to you soon.")
      form.reset()
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  const details = [
    { label: "Email", value: settings.contact.email, href: `mailto:${settings.contact.email}` },
    { label: "Phone", value: settings.contact.phone, href: `tel:${settings.contact.phone.replace(/\s/g, "")}` },
    { label: "Location", value: settings.contact.address },
  ].filter((d) => d.value)

  return (
    <section id="contact" className="relative bg-ink px-6 py-28 text-white md:px-12 md:py-40 lg:px-20">
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
            <span className="text-aqua">(04)</span>
            {settings.contact.eyebrow}
          </p>
          <h2 className="mt-8 text-balance font-display text-4xl font-light leading-[1.1] md:text-6xl">
            {settings.contact.title}
          </h2>
          <dl className="mt-14 flex flex-col divide-y divide-white/10 border-y border-white/10">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between gap-6 py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-white/40">{d.label}</dt>
                <dd className="text-right">
                  {d.href ? (
                    <a href={d.href} className="group inline-flex items-center gap-2 text-white/80 hover:text-aqua">
                      {d.value}
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ) : (
                    <span className="text-white/80">{d.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Your name" name="name" required />
            <Field label="Email address" name="email" type="email" required />
          </div>
          <Field label="Company (optional)" name="company" />
          <Field label="Tell us about your idea" name="message" textarea required />
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          <div className="flex flex-wrap items-center gap-6">
            <Magnetic>
              <button
                type="submit"
                disabled={status === "loading"}
                className="group flex size-32 items-center justify-center rounded-full bg-aqua text-sm font-medium text-ink transition-transform hover:scale-105 disabled:opacity-70 md:size-36"
              >
                {status === "loading" ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1">
                    Send
                    <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                  </span>
                )}
              </button>
            </Magnetic>
            <p
              aria-live="polite"
              className={cn("max-w-xs text-sm", status === "error" ? "text-red-300" : "text-aqua")}
            >
              {status !== "loading" && message}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
