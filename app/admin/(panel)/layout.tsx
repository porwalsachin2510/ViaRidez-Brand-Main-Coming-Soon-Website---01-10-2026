import { AdminSidebar } from "@/components/admin/sidebar"
import { requireAdmin } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin — Viaridez" }

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  return (
    <div className="dark min-h-screen bg-background text-foreground lg:flex">
      <AdminSidebar admin={admin} />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 lg:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
