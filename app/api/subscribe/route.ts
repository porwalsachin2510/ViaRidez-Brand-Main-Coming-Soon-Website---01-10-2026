import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Subscriber } from "@/lib/models"
import { subscribeSchema } from "@/lib/schema"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 })
  }
  if (parsed.data.website) return NextResponse.json({ ok: true })

  try {
    await connectDB()
    const result = await Subscriber.updateOne(
      { email: parsed.data.email },
      { $setOnInsert: { email: parsed.data.email, source: "coming-soon" } },
      { upsert: true },
    )
    const alreadySubscribed = result.upsertedCount === 0
    return NextResponse.json({ ok: true, alreadySubscribed }, { status: alreadySubscribed ? 200 : 201 })
  } catch (error) {
    console.error("Subscribe failed:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
