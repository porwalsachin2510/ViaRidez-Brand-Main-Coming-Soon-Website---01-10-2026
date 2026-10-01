import type Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function scrollToHref(href: string, event?: { preventDefault: () => void }) {
  if (!href.startsWith("#")) return
  const target = document.querySelector(href)
  if (!target) return
  event?.preventDefault()
  if (window.__lenis) {
    window.__lenis.scrollTo(target as HTMLElement, { duration: 1.6 })
  } else {
    target.scrollIntoView({ behavior: "smooth" })
  }
}
