"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import type { SiteSettings } from "@/lib/schema"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

export function InlineSubscribe({ settings, compact }: { settings: SiteSettings; compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong")
      setStatus("success")
      setMessage(json.alreadySubscribed ? "You're already on the list — see you at launch." : settings.newsletter.successMessage)
      form.reset()
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className={cn(
          "flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 pl-5 transition-colors focus-within:border-aqua/60",
          !compact && "p-2 pl-6",
        )}
      >
        <label htmlFor={compact ? "email-compact" : "email-main"} className="sr-only">
          Email address
        </label>
        <input
          id={compact ? "email-compact" : "email-main"}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={settings.newsletter.placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40",
            compact ? "text-sm" : "text-base",
          )}
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-aqua text-ink transition-transform hover:scale-105 disabled:opacity-70",
            compact ? "size-9" : "h-12 gap-2 px-6 text-sm font-medium",
          )}
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : status === "success" ? (
            <Check className="size-4" />
          ) : (
            <>
              {!compact && <span>Notify me</span>}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
      <div aria-live="polite" className="min-h-0">
        <AnimatePresence>
          {message && status !== "loading" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={cn("mt-3 text-xs", status === "error" ? "text-red-300" : "text-aqua")}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
