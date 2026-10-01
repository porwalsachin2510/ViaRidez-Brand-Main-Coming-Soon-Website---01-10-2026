import { Download } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteSubscriberAction } from "@/app/admin/actions"
import { connectDB } from "@/lib/db"
import { Subscriber } from "@/lib/models"

export default async function SubscribersPage() {
  await connectDB()
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).limit(1000).lean()

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light">Subscribers</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subscribers.length} people waiting for launch.</p>
        </div>
        <a
          href="/api/admin/subscribers/export"
          className={buttonVariants({ variant: "outline" })}
        >
          <Download className="size-4" />
          Export CSV
        </a>
      </header>

      <Card className="py-0">
        <CardContent className="px-0">
          {subscribers.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No subscribers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead className="pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((s) => (
                  <TableRow key={String(s._id)}>
                    <TableCell className="pl-6 font-medium">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground">{s.source}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString("en", { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DeleteButton action={deleteSubscriberAction.bind(null, String(s._id))} label={`Delete ${s.email}`} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
