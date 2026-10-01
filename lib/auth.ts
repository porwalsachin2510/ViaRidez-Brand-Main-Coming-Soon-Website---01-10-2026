import crypto from "node:crypto"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connectDB } from "./db"
import { Admin, Session } from "./models"

const COOKIE_NAME = "vz_admin_session"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex")

export type CurrentAdmin = { id: string; name: string; email: string }

export const hashPassword = (password: string) => bcrypt.hash(password, 12)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export async function adminExists() {
  await connectDB()
  return (await Admin.countDocuments()) > 0
}

export async function createSession(adminId: string) {
  await connectDB()
  const token = crypto.randomBytes(32).toString("base64url")
  await Session.create({
    tokenHash: hashToken(token),
    admin: adminId,
    expiresAt: new Date(Date.now() + MAX_AGE_SECONDS * 1000),
  })
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return null
  await connectDB()
  const session = await Session.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean()
  if (!session) return null
  const admin = await Admin.findById(session.admin).lean()
  if (!admin) return null
  return { id: String(admin._id), name: admin.name, email: admin.email }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}

export async function destroySession() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (token) {
    await connectDB()
    await Session.deleteOne({ tokenHash: hashToken(token) })
  }
  store.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "none", path: "/", maxAge: 0 })
}
