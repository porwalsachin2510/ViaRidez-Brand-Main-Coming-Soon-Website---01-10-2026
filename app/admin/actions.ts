"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isValidObjectId } from "mongoose"
import { z } from "zod"
import {
  adminExists,
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Admin, Message, Subscriber } from "@/lib/models"
import { settingsSchema, type SiteSettings } from "@/lib/schema"
import { getSettings, saveSettings } from "@/lib/settings"

export type FormState = { error?: string; success?: string } | null

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
})

export async function setupAdminAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema
    .extend({ name: z.string().trim().min(2, "Name is too short").max(80) })
    .safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  if (await adminExists()) return { error: "An admin account already exists. Please sign in." }

  const admin = await Admin.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash: await hashPassword(parsed.data.password),
  })
  await createSession(String(admin._id))
  redirect("/admin")
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid email or password" }

  await connectDB()
  const admin = await Admin.findOne({ email: parsed.data.email })
  const valid = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false
  if (!admin || !valid) return { error: "Invalid email or password" }

  await createSession(String(admin._id))
  redirect("/admin")
}

export async function logoutAction() {
  await destroySession()
  redirect("/admin/login")
}

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const current = await requireAdmin()
  const parsed = z
    .object({
      currentPassword: z.string().min(1, "Enter your current password"),
      newPassword: z.string().min(8, "New password must be at least 8 characters").max(128),
    })
    .safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  await connectDB()
  const admin = await Admin.findById(current.id)
  if (!admin || !(await verifyPassword(parsed.data.currentPassword, admin.passwordHash))) {
    return { error: "Current password is incorrect" }
  }
  admin.passwordHash = await hashPassword(parsed.data.newPassword)
  await admin.save()
  return { success: "Password updated successfully" }
}

export async function saveSettingsAction(input: SiteSettings) {
  await requireAdmin()
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { ok: false as const, error: `${issue?.path.join(".")}: ${issue?.message}` }
  }
  await saveSettings(parsed.data)
  revalidatePath("/", "layout")
  return { ok: true as const }
}

export async function toggleComingSoonAction(enabled: boolean) {
  await requireAdmin()
  const settings = await getSettings()
  await saveSettings({ ...settings, comingSoonEnabled: enabled })
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function deleteSubscriberAction(id: string) {
  await requireAdmin()
  if (!isValidObjectId(id)) return
  await connectDB()
  await Subscriber.deleteOne({ _id: id })
  revalidatePath("/admin", "layout")
}

export async function deleteMessageAction(id: string) {
  await requireAdmin()
  if (!isValidObjectId(id)) return
  await connectDB()
  await Message.deleteOne({ _id: id })
  revalidatePath("/admin", "layout")
}

export async function setMessageReadAction(id: string, read: boolean) {
  await requireAdmin()
  if (!isValidObjectId(id)) return
  await connectDB()
  await Message.updateOne({ _id: id }, { $set: { read } })
  revalidatePath("/admin", "layout")
}
