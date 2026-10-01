"use client"

import { useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      disabled={pending}
      className="text-muted-foreground hover:text-red-400"
      onClick={() => {
        if (!window.confirm("Delete this item permanently?")) return
        startTransition(async () => {
          await action()
          toast.success("Deleted")
        })
      }}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  )
}
