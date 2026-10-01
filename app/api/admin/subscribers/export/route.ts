import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Subscriber } from "@/lib/models"

export const runtime = "nodejs"

const csvCell = (value: string) => `"${value.replace(/"/g, '""').replace(/^[=+\-@]/, "'$&")}"`

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean()
  const rows = [
    "email,source,subscribed_at",
    ...subscribers.map((s) =>
      [csvCell(s.email), csvCell(s.source ?? ""), csvCell(new Date(s.createdAt).toISOString())].join(","),
    ),
  ]
  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="viaridez-subscribers.csv"`,
    },
  })
}
