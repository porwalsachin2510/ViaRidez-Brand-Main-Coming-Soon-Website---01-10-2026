import Image from "next/image"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/admin/auth-form"
import { adminExists, getCurrentAdmin } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin sign in — Viaridez" }

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin")
  const hasAdmin = await adminExists()

  return (
    <main className="dark grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-16 text-foreground">
      <div aria-hidden className="absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-teal/20 blur-[150px]" />
      <div className="relative w-full max-w-sm">
        <Image
          src="/images/viaridez-logo-light.png"
          alt="Viaridez"
          width={1172}
          height={213}
          priority
          className="mx-auto h-7 w-auto"
        />
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <h1 className="font-display text-2xl font-light text-white">
            {hasAdmin ? "Welcome back" : "Create admin account"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {hasAdmin
              ? "Sign in to manage your Viaridez website."
              : "No admin exists yet. The first account created becomes the site owner."}
          </p>
          <AuthForm mode={hasAdmin ? "login" : "setup"} />
        </div>
      </div>
    </main>
  )
}
