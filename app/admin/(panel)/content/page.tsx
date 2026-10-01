import { ContentEditor } from "@/components/admin/content-editor"
import { getSettings } from "@/lib/settings"

export default async function ContentPage() {
  const settings = await getSettings()
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-light">Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edit every piece of text, link and section on your website.</p>
      </header>
      <ContentEditor initial={settings} />
    </div>
  )
}
