import { connectDB } from "./db"
import { DEFAULT_SETTINGS } from "./defaults"
import { Setting } from "./models"
import type { SiteSettings } from "./schema"

const SITE_KEY = "site"

export async function getSettings(): Promise<SiteSettings> {
  try {
    await connectDB()
    const doc = await Setting.findOneAndUpdate(
      { key: SITE_KEY },
      { $setOnInsert: { key: SITE_KEY, data: DEFAULT_SETTINGS } },
      { upsert: true, returnDocument: "after", lean: true },
    )
    const data = (doc?.data ?? {}) as Partial<SiteSettings>
    return JSON.parse(JSON.stringify({ ...DEFAULT_SETTINGS, ...data }))
  } catch (error) {
    console.error("Failed to load settings, using defaults:", error)
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(data: SiteSettings) {
  await connectDB()
  await Setting.updateOne({ key: SITE_KEY }, { $set: { data } }, { upsert: true })
}
