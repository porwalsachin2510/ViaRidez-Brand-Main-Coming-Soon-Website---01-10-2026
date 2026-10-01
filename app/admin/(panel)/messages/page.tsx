import { deleteMessageAction, setMessageReadAction } from "@/app/admin/actions"
import { DeleteButton } from "@/components/admin/delete-button"
import { ReadToggle } from "@/components/admin/read-toggle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { connectDB } from "@/lib/db"
import { Message } from "@/lib/models"
import { cn } from "@/lib/utils"

export default async function MessagesPage() {
  await connectDB()
  const messages = await Message.find().sort({ createdAt: -1 }).limit(500).lean()
  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-light">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} total, {unread} unread.
        </p>
      </header>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No messages yet. Submissions from the contact form appear here.
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => {
            const id = String(m._id)
            return (
              <li key={id}>
                <Card className={cn("gap-3", !m.read && "border-primary/40")}>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-medium">
                          {m.name}
                          {!m.read && <Badge className="h-5 px-1.5 text-[10px]">New</Badge>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <a href={`mailto:${m.email}`} className="hover:text-primary">
                            {m.email}
                          </a>
                          {m.company && ` · ${m.company}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="mr-2 text-xs text-muted-foreground">
                          {new Date(m.createdAt).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                        <ReadToggle read={m.read} action={setMessageReadAction.bind(null, id, !m.read)} />
                        <DeleteButton action={deleteMessageAction.bind(null, id)} label={`Delete message from ${m.name}`} />
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed text-foreground/80">{m.message}</p>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
