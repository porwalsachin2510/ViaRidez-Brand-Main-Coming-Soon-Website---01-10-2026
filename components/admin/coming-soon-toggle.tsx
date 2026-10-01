"use client"

import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { toggleComingSoonAction } from "@/app/admin/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ComingSoonToggle({ enabled }: { enabled: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(enabled)
  const [pending, startTransition] = useTransition()

  const onChange = (value: boolean) =>
    startTransition(async () => {
      setOptimistic(value)
      await toggleComingSoonAction(value)
      toast.success(value ? "Coming soon mode enabled" : "Coming soon mode disabled — site is live")
    })

  return (
    <Card className={cn("border-primary/30", optimistic && "bg-primary/5")}>
      <CardContent className="flex items-center justify-between gap-6">
        <div>
          <p className="flex items-center gap-2 font-medium">
            <span className={cn("size-2 rounded-full", optimistic ? "bg-amber-400" : "bg-emerald-400")} />
            {optimistic ? "Coming soon mode is ON" : "Website is LIVE"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {optimistic
              ? "Visitors see the countdown and newsletter signup."
              : "Countdown and signup are hidden. Turn back on anytime."}
          </p>
        </div>
        <Switch
          checked={optimistic}
          onCheckedChange={onChange}
          disabled={pending}
          aria-label="Toggle coming soon mode"
        />
      </CardContent>
    </Card>
  )
}
