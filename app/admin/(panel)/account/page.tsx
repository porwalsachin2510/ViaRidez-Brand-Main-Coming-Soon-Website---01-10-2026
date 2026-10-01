import { PasswordForm } from "@/components/admin/password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"

export default async function AccountPage() {
  const admin = await requireAdmin()
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-light">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {admin.name} ({admin.email})
        </p>
      </header>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Change password</CardTitle>
          <CardDescription>Use at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
