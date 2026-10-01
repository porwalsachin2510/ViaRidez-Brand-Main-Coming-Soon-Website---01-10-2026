"use client"

import { useTransition } from "react"
import { Loader2, Mail, MailOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReadToggle({ read, action }: { read: boolean; action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      aria-label={read ? "Mark as unread" : "Mark as read"}
      onClick={() => startTransition(action)}
      className="text-muted-foreground"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
    </Button>
  )
}
