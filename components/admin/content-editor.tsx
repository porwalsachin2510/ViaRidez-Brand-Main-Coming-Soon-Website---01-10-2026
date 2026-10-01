"use client"

import { useState, useTransition } from "react"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { saveSettingsAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FEATURE_ICONS, type SiteSettings } from "@/lib/schema"

type Setter = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  type?: string
  hint?: string
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {textarea ? (
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  )
}

function ListEditor<T>({
  items,
  onChange,
  create,
  max,
  addLabel,
  render,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  max: number
  addLabel: string
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
          <div className="grid flex-1 gap-4 md:grid-cols-2">
            {render(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))), i)}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove item"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-muted-foreground hover:text-red-400"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      {items.length < max && (
        <Button type="button" variant="outline" onClick={() => onChange([...items, create()])} className="self-start">
          <Plus className="size-4" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}

const toLocalInput = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const offset = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

export function ContentEditor({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial)
  const [pending, startTransition] = useTransition()
  const set: Setter = (key, value) => setS((prev) => ({ ...prev, [key]: value }))

  const save = () =>
    startTransition(async () => {
      const res = await saveSettingsAction(s)
      if (res.ok) toast.success("Changes published to the website")
      else toast.error(res.error)
    })

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Tabs defaultValue="hero">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="nav">Navigation & Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6 flex flex-col gap-6">
          <Section title="Launch" description="Control the coming soon mode and countdown target.">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="cs-toggle">Coming soon mode</Label>
                <p className="text-xs text-muted-foreground">Turn off when the full website launches.</p>
              </div>
              <Switch id="cs-toggle" checked={s.comingSoonEnabled} onCheckedChange={(v) => set("comingSoonEnabled", v)} />
            </div>
            <Field
              label="Launch date & time"
              type="datetime-local"
              value={toLocalInput(s.launchDate)}
              onChange={(v) => v && set("launchDate", new Date(v).toISOString())}
              hint="Shown in your local timezone."
            />
            <Field label="Status badge" value={s.statusBadge} onChange={(v) => set("statusBadge", v)} />
          </Section>
          <Section title="Hero text">
            <Field label="Eyebrow" value={s.eyebrow} onChange={(v) => set("eyebrow", v)} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Headline" value={s.headline} onChange={(v) => set("headline", v)} />
              <Field label="Highlighted words" value={s.headlineHighlight} onChange={(v) => set("headlineHighlight", v)} hint="Rendered with the brand gradient." />
            </div>
            <Field label="Description" textarea value={s.description} onChange={(v) => set("description", v)} />
          </Section>
          <Section title="Buttons">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Primary label" value={s.primaryCta.label} onChange={(v) => set("primaryCta", { ...s.primaryCta, label: v })} />
              <Field label="Primary link" value={s.primaryCta.href} onChange={(v) => set("primaryCta", { ...s.primaryCta, href: v })} />
              <Field label="Secondary label" value={s.secondaryCta.label} onChange={(v) => set("secondaryCta", { ...s.secondaryCta, label: v })} />
              <Field label="Secondary link" value={s.secondaryCta.href} onChange={(v) => set("secondaryCta", { ...s.secondaryCta, href: v })} />
            </div>
          </Section>
          <Section title="Marquee words" description="Big scrolling words between sections (max 12).">
            <Field
              label="Words (comma separated)"
              value={s.marqueeWords.join(", ")}
              onChange={(v) => set("marqueeWords", v.split(",").map((w) => w.trim()).filter(Boolean).slice(0, 12))}
            />
          </Section>
        </TabsContent>

        <TabsContent value="about" className="mt-6 flex flex-col gap-6">
          <Section title="Manifesto">
            <Field label="Eyebrow" value={s.manifesto.eyebrow} onChange={(v) => set("manifesto", { ...s.manifesto, eyebrow: v })} />
            <Field label="Manifesto text" textarea value={s.manifesto.text} onChange={(v) => set("manifesto", { ...s.manifesto, text: v })} />
          </Section>
          <Section title="Stats" description='Numbers animate on scroll. Use values like "150+", "99.9%" or "24/7".'>
            <ListEditor
              items={s.stats}
              onChange={(v) => set("stats", v)}
              create={() => ({ value: "10+", label: "New stat" })}
              max={4}
              addLabel="Add stat"
              render={(item, update) => (
                <>
                  <Field label="Value" value={item.value} onChange={(v) => update({ value: v })} />
                  <Field label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                </>
              )}
            />
          </Section>
        </TabsContent>

        <TabsContent value="features" className="mt-6 flex flex-col gap-6">
          <Section title="Section heading">
            <Field label="Eyebrow" value={s.featuresEyebrow} onChange={(v) => set("featuresEyebrow", v)} />
            <Field label="Title" value={s.featuresTitle} onChange={(v) => set("featuresTitle", v)} />
          </Section>
          <Section title="Feature cards" description="The first four also appear in the hero footer strip.">
            <ListEditor
              items={s.features}
              onChange={(v) => set("features", v)}
              create={() => ({ icon: "sparkles" as const, title: "New feature", description: "" })}
              max={8}
              addLabel="Add feature"
              render={(item, update, i) => (
                <>
                  <Field label={`Title ${i + 1}`} value={item.title} onChange={(v) => update({ title: v })} />
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`icon-${i}`}>Icon</Label>
                    <select
                      id={`icon-${i}`}
                      value={item.icon}
                      onChange={(e) => update({ icon: e.target.value as (typeof FEATURE_ICONS)[number] })}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm capitalize"
                    >
                      {FEATURE_ICONS.map((icon) => (
                        <option key={icon} value={icon} className="bg-background">
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Field label={`Description ${i + 1}`} textarea value={item.description} onChange={(v) => update({ description: v })} />
                  </div>
                </>
              )}
            />
          </Section>
        </TabsContent>

        <TabsContent value="newsletter" className="mt-6">
          <Section title="Newsletter signup">
            <Field label="Title" value={s.newsletter.title} onChange={(v) => set("newsletter", { ...s.newsletter, title: v })} />
            <Field label="Subtitle" textarea value={s.newsletter.subtitle} onChange={(v) => set("newsletter", { ...s.newsletter, subtitle: v })} />
            <Field label="Input placeholder" value={s.newsletter.placeholder} onChange={(v) => set("newsletter", { ...s.newsletter, placeholder: v })} />
            <Field label="Success message" value={s.newsletter.successMessage} onChange={(v) => set("newsletter", { ...s.newsletter, successMessage: v })} />
          </Section>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Section title="Contact section">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Eyebrow" value={s.contact.eyebrow} onChange={(v) => set("contact", { ...s.contact, eyebrow: v })} />
              <Field label="Title" value={s.contact.title} onChange={(v) => set("contact", { ...s.contact, title: v })} />
              <Field label="Email" type="email" value={s.contact.email} onChange={(v) => set("contact", { ...s.contact, email: v })} />
              <Field label="Phone" value={s.contact.phone} onChange={(v) => set("contact", { ...s.contact, phone: v })} />
            </div>
            <Field label="Address" value={s.contact.address} onChange={(v) => set("contact", { ...s.contact, address: v })} />
          </Section>
        </TabsContent>

        <TabsContent value="nav" className="mt-6 flex flex-col gap-6">
          <Section title="Navigation links" description='Use section anchors like "#about", "#features", "#contact".'>
            <ListEditor
              items={s.navLinks}
              onChange={(v) => set("navLinks", v)}
              create={() => ({ label: "Link", href: "#home" })}
              max={8}
              addLabel="Add link"
              render={(item, update, i) => (
                <>
                  <Field label={`Label ${i + 1}`} value={item.label} onChange={(v) => update({ label: v })} />
                  <Field label={`Link ${i + 1}`} value={item.href} onChange={(v) => update({ href: v })} />
                </>
              )}
            />
          </Section>
          <Section title="Social profiles">
            <ListEditor
              items={s.socials}
              onChange={(v) => set("socials", v)}
              create={() => ({ platform: "LinkedIn", url: "https://" })}
              max={8}
              addLabel="Add social"
              render={(item, update, i) => (
                <>
                  <Field label={`Platform ${i + 1}`} value={item.platform} onChange={(v) => update({ platform: v })} />
                  <Field label={`URL ${i + 1}`} type="url" value={item.url} onChange={(v) => update({ url: v })} />
                </>
              )}
            />
          </Section>
          <Section title="Footer">
            <Field label="Copyright text" value={s.footerText} onChange={(v) => set("footerText", v)} />
          </Section>
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <Section title="Search engine optimisation">
            <Field label="Page title" value={s.seo.title} onChange={(v) => set("seo", { ...s.seo, title: v })} hint={`${s.seo.title.length}/70`} />
            <Field label="Meta description" textarea value={s.seo.description} onChange={(v) => set("seo", { ...s.seo, description: v })} hint={`${s.seo.description.length}/160`} />
          </Section>
        </TabsContent>
      </Tabs>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-10">
          <p className="text-sm text-muted-foreground">Changes go live instantly after saving.</p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setS(initial)} disabled={pending}>
              Reset
            </Button>
            <Button type="button" onClick={save} disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
