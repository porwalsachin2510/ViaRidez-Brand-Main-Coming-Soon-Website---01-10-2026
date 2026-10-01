import Link from "next/link"
import { ArrowRight, CalendarClock, Mail, MailOpen, Users } from "lucide-react"
import { ComingSoonToggle } from "@/components/admin/coming-soon-toggle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { connectDB } from "@/lib/db"
import { Message, Subscriber } from "@/lib/models"
import { getSettings } from "@/lib/settings"

const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d))

export default async function DashboardPage() {
  await connectDB()
  const weekAgo = new Date(Date.now() - 7 * 86_400_000)
  const [settings, subscribers, newSubscribers, messages, unread, recentSubs, recentMsgs] = await Promise.all([
    getSettings(),
    Subscriber.countDocuments(),
    Subscriber.countDocuments({ createdAt: { $gte: weekAgo } }),
    Message.countDocuments(),
    Message.countDocuments({ read: false }),
    Subscriber.find().sort({ createdAt: -1 }).limit(5).lean(),
    Message.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  const daysLeft = Math.max(0, Math.ceil((Date.parse(settings.launchDate) - Date.now()) / 86_400_000))

  const stats = [
    { label: "Subscribers", value: subscribers, hint: `+${newSubscribers} this week`, icon: Users },
    { label: "Messages", value: messages, hint: `${unread} unread`, icon: Mail },
    { label: "Days to launch", value: daysLeft, hint: formatDate(settings.launchDate), icon: CalendarClock },
  ]

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-light">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your Viaridez launch.</p>
      </header>

      <ComingSoonToggle enabled={settings.comingSoonEnabled} />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-light">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest subscribers</CardTitle>
            <Link href="/admin/subscribers" className="flex items-center gap-1 text-xs text-primary">
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentSubs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscribers yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentSubs.map((s) => (
                  <li key={String(s._id)} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="truncate">{s.email}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(s.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest messages</CardTitle>
            <Link href="/admin/messages" className="flex items-center gap-1 text-xs text-primary">
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentMsgs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentMsgs.map((m) => (
                  <li key={String(m._id)} className="flex items-start gap-3 py-3 text-sm">
                    {m.read ? (
                      <MailOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-medium">
                        <span className="truncate">{m.name}</span>
                        {!m.read && <Badge className="h-5 px-1.5 text-[10px]">New</Badge>}
                      </p>
                      <p className="truncate text-muted-foreground">{m.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
