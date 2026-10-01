import type { SiteSettings } from "./schema"

const inSixtyDays = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString()

export const DEFAULT_SETTINGS: SiteSettings = {
  comingSoonEnabled: true,
  launchDate: inSixtyDays,
  statusBadge: "We're Building Something Amazing",
  eyebrow: "Coming Soon",
  headline: "The Future of Innovation is",
  headlineHighlight: "Almost Here",
  description:
    "Viaridez is crafting next-generation digital solutions to make your ideas real, faster, smarter and simpler. Stay tuned — something extraordinary is on the way.",
  primaryCta: { label: "Get Early Access", href: "#notify" },
  secondaryCta: { label: "Learn More", href: "#about" },
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ],
  marqueeWords: ["Innovation", "Performance", "Security", "Global Vision", "Design", "Technology"],
  manifesto: {
    eyebrow: "About Viaridez",
    text: "We believe technology should feel effortless. Viaridez is a new kind of digital partner — blending strategy, design and engineering to build products that move businesses forward and open doors to what comes next.",
  },
  stats: [
    { value: "120+", label: "Projects in the pipeline" },
    { value: "24/7", label: "Always-on reliability" },
    { value: "15", label: "Countries connected" },
    { value: "99.9%", label: "Uptime by design" },
  ],
  featuresEyebrow: "What we're building",
  featuresTitle: "Built on four promises for a smarter tomorrow.",
  features: [
    { icon: "sparkles", title: "Innovative Solutions", description: "Built for a smarter tomorrow with forward-thinking strategy and craft." },
    { icon: "zap", title: "Faster Performance", description: "Speed, efficiency and reliability engineered into every layer." },
    { icon: "shield", title: "Secure & Reliable", description: "Your data, our priority. Security is part of the foundation, never an afterthought." },
    { icon: "globe", title: "Global Vision", description: "Connecting people and businesses across the world with scalable platforms." },
  ],
  newsletter: {
    title: "Be the First to Know",
    subtitle: "Get notified the moment we go live, plus early access to everything we launch.",
    placeholder: "Enter your email address",
    successMessage: "You're on the list. We'll let you know the moment we launch.",
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Have an idea? Let's build it together.",
    email: "hello@viaridez.com",
    phone: "+91 00000 00000",
    address: "India — working with teams worldwide",
  },
  socials: [
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "X", url: "https://x.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "YouTube", url: "https://youtube.com" },
  ],
  footerText: "Viaridez. All rights reserved.",
  seo: {
    title: "Viaridez — The Future of Innovation is Almost Here",
    description: "Viaridez is crafting next-generation digital solutions. Join the waitlist and be the first to know when we launch.",
  },
}
