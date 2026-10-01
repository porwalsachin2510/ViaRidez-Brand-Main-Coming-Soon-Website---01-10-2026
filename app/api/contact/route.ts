import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Message } from "@/lib/models"
import { contactSchema } from "@/lib/schema"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 })
  }
  const { website, ...data } = parsed.data
  if (website) return NextResponse.json({ ok: true })

  try {
    await connectDB()
    await Message.create(data)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("Contact failed:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
