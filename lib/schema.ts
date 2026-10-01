import { z } from "zod"

export const FEATURE_ICONS = [
  "sparkles",
  "zap",
  "shield",
  "globe",
  "cpu",
  "rocket",
  "layers",
  "lock",
] as const

const text = (max: number) => z.string().trim().max(max)
const link = z.object({ label: text(60).min(1), href: text(300).min(1) })

export const settingsSchema = z.object({
  comingSoonEnabled: z.boolean(),
  launchDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid launch date"),
  statusBadge: text(80),
  eyebrow: text(60),
  headline: text(120).min(1),
  headlineHighlight: text(60),
  description: text(500),
  primaryCta: link,
  secondaryCta: link,
  navLinks: z.array(link).max(8),
  marqueeWords: z.array(text(40).min(1)).max(12),
  manifesto: z.object({ eyebrow: text(60), text: text(800) }),
  stats: z.array(z.object({ value: text(12).min(1), label: text(40) })).max(4),
  featuresEyebrow: text(60),
  featuresTitle: text(120),
  features: z
    .array(z.object({ icon: z.enum(FEATURE_ICONS), title: text(60).min(1), description: text(240) }))
    .max(8),
  newsletter: z.object({
    title: text(80),
    subtitle: text(200),
    placeholder: text(60),
    successMessage: text(160),
  }),
  contact: z.object({
    eyebrow: text(60),
    title: text(120),
    email: text(120),
    phone: text(40),
    address: text(200),
  }),
  socials: z.array(z.object({ platform: text(30).min(1), url: z.string().trim().url().max(300) })).max(8),
  footerText: text(200),
  seo: z.object({ title: text(70), description: text(160) }),
})

export type SiteSettings = z.infer<typeof settingsSchema>
export type FeatureIcon = (typeof FEATURE_ICONS)[number]

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  website: z.string().max(0).optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(3000),
  website: z.string().max(0).optional(),
})
