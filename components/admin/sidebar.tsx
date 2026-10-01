"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, FileText, LayoutDashboard, LogOut, Mail, User, Users } from "lucide-react"
import { logoutAction } from "@/app/admin/actions"
import type { CurrentAdmin } from "@/lib/auth"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/account", label: "Account", icon: User },
]

export function AdminSidebar({ admin }: { admin: CurrentAdmin }) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-4 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" aria-label="Admin dashboard">
            <Image src="/images/viaridez-logo-light.png" alt="Viaridez" width={1172} height={213} className="h-5 w-auto" />
          </Link>
          <form action={logoutAction} className="lg:hidden">
            <button type="submit" aria-label="Sign out" className="rounded-md p-2 text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>

        <nav aria-label="Admin" className="-mx-1 overflow-x-auto lg:mx-0 lg:mt-6">
          <ul className="flex gap-1 lg:flex-col">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-auto hidden flex-col gap-3 lg:flex">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            View website
          </Link>
          <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{admin.name}</p>
              <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
            </div>
            <form action={logoutAction}>
              <button type="submit" aria-label="Sign out" className="rounded-md p-2 text-muted-foreground hover:text-foreground">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  )
}
