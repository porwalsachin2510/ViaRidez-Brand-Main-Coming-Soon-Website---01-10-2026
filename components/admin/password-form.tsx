"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { changePasswordAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null)
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {state?.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p role="status" className="text-sm text-emerald-400">{state.success}</p>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Update password
      </Button>
    </form>
  )
}
